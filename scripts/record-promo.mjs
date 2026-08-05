/**
 * MOTIONA — social promo recorder.
 *
 * Records the running site scrolling in real time, composites each frame into a
 * browser mockup on a gradient card, and encodes an MP4 sized for LinkedIn and
 * Instagram.
 *
 *   npm run dev            # in one terminal
 *   npm run video          # in another
 *
 * Real-time capture matters: the page mixes scroll-linked transforms (the
 * cascade) with time-based ones (heading reveals, the hero fan). Stepping the
 * scrollbar frame by frame would render the first correctly and the second at
 * the wrong speed, so the page is driven with genuine wheel events and frames
 * are taken via the DevTools screencast as they are painted.
 *
 * Flags:
 *   --format=square|vertical|both   default: both
 *   --seconds=45                    scroll duration, excluding holds
 *   --url=http://localhost:3000
 */
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import ffmpegPath from "ffmpeg-static";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const run = promisify(execFile);

/* ------------------------------------------------------------------ */
/* Options                                                             */
/* ------------------------------------------------------------------ */

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const URL = args.url ?? "http://localhost:3000";
const SCROLL_SECONDS = Number(args.seconds ?? 40);
const FORMAT = args.format ?? "both";
const FPS = 30;
const HOLD_START = 1.6;
const HOLD_END = 2.2;

const OUT_DIR = path.resolve("promo");
const TMP_DIR = path.join(OUT_DIR, ".frames");

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

/* ------------------------------------------------------------------ */
/* Output presets                                                      */
/* ------------------------------------------------------------------ */

/**
 * `capture` is the browser viewport; `content` is where it is drawn inside the
 * card. Both share an aspect ratio so nothing is stretched.
 */
const PRESETS = {
  square: {
    label: "square",
    canvas: { w: 1080, h: 1080 },
    capture: { w: 1400, h: 792 },
    content: { w: 1000, h: 566, x: 40, y: 275 },
    chromeBar: 36,
    radius: 16,
  },
  vertical: {
    label: "vertical",
    canvas: { w: 1080, h: 1920 },
    // A phone-shaped viewport so the recording shows the mobile layout.
    capture: { w: 420, h: 900 },
    // Window is 1629 + 44 tall; centred vertically in the 1920 canvas.
    content: { w: 760, h: 1629, x: 160, y: 168 },
    chromeBar: 44,
    radius: 44,
  },
};

/* ------------------------------------------------------------------ */
/* Card artwork                                                        */
/* ------------------------------------------------------------------ */

/** Gradient backdrop plus browser chrome, rendered once per preset. */
async function buildCard(preset) {
  const { canvas, content, chromeBar, radius } = preset;
  const windowH = content.h + chromeBar;
  const windowY = content.y - chromeBar;

  const dots =
    preset.label === "square"
      ? [0, 1, 2]
          .map(
            (i) =>
              `<circle cx="${content.x + 22 + i * 17}" cy="${windowY + chromeBar / 2}" r="4.5" fill="#D6D6D0"/>`,
          )
          .join("")
      : "";

  // A pill standing in for the address bar on the square preset.
  const addressBar =
    preset.label === "square"
      ? `<rect x="${content.x + 88}" y="${windowY + 10}" width="${content.w - 176}" height="16" rx="8" fill="#EFEFEA"/>`
      : `<rect x="${content.x + content.w / 2 - 60}" y="${windowY + 16}" width="120" height="10" rx="5" fill="#DDDDD7"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.w}" height="${canvas.h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F5391B"/>
      <stop offset="45%" stop-color="#FF5A1F"/>
      <stop offset="100%" stop-color="#FF9636"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="26" stdDeviation="34" flood-color="#5A1200" flood-opacity="0.4"/>
    </filter>
  </defs>

  <rect width="${canvas.w}" height="${canvas.h}" fill="url(#bg)"/>
  <rect width="${canvas.w}" height="${canvas.h}" fill="url(#glow)"/>

  <!-- Window shell: chrome bar plus a white plate the page is drawn onto -->
  <g filter="url(#shadow)">
    <rect x="${content.x}" y="${windowY}" width="${content.w}" height="${windowH}"
          rx="${radius}" fill="#FFFFFF"/>
  </g>
  ${dots}
  ${addressBar}
</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * Rounds only the corners that sit on the window's outer edge — the top two are
 * covered by the chrome bar, so squaring them avoids a visible notch.
 */
async function roundedPageMask(w, h, radius) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <path d="M0 0 H${w} V${h - radius} A${radius} ${radius} 0 0 1 ${w - radius} ${h}
             H${radius} A${radius} ${radius} 0 0 1 0 ${h - radius} Z" fill="#fff"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/* ------------------------------------------------------------------ */
/* Capture                                                             */
/* ------------------------------------------------------------------ */

async function capture(preset) {
  const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));

  if (!executablePath) {
    throw new Error(
      `No Chrome or Edge found. Checked:\n  ${CHROME_CANDIDATES.join("\n  ")}\n` +
        `Pass one explicitly by editing CHROME_CANDIDATES in this script.`,
    );
  }

  const browser = await puppeteer.launch({
    executablePath,
    headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: preset.capture.w,
    height: preset.capture.h,
    deviceScaleFactor: 2,
    isMobile: preset.label === "vertical",
    hasTouch: preset.label === "vertical",
  });

  // Hide the dev-server overlay so a recording taken against `npm run dev`
  // looks identical to one taken against a production build.
  await page.evaluateOnNewDocument(() => {
    const style = document.createElement("style");
    style.textContent = `
      nextjs-portal,
      [data-nextjs-toast],
      #__next-build-watcher,
      #__next-prerender-indicator { display: none !important; }
    `;
    document.addEventListener("DOMContentLoaded", () => document.head.append(style));
  });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 120000 });
  // Let fonts settle and the hero entrance begin from a clean state.
  await new Promise((r) => setTimeout(r, 2500));

  const frames = [];
  const client = await page.createCDPSession();
  client.on("Page.screencastFrame", async ({ data, sessionId, metadata }) => {
    frames.push({ data, t: metadata.timestamp });
    try {
      await client.send("Page.screencastFrameAck", { sessionId });
    } catch {
      /* session closed mid-flight */
    }
  });

  await client.send("Page.startScreencast", {
    format: "jpeg",
    quality: 95,
    everyNthFrame: 1,
  });

  const started = Date.now();
  await new Promise((r) => setTimeout(r, HOLD_START * 1000));

  await page.mouse.move(preset.capture.w / 2, preset.capture.h / 2);

  const measure = () =>
    page.evaluate(() => ({
      y: window.scrollY,
      max: document.documentElement.scrollHeight - window.innerHeight,
    }));

  /*
   * Drive with real wheel events so Lenis eases the motion the way a visitor
   * would see it.
   *
   * Two things make a naive loop wrong. Each dispatch costs a variable DevTools
   * round trip, so a fixed-count loop overruns the target duration; and the
   * page grows as its dynamically imported sections mount, so a height measured
   * up front stops short of the footer. Both are handled by re-measuring
   * position and height a few times a second and re-deriving the rate from
   * distance still to cover ÷ time still to run.
   */
  const scrollStart = Date.now();
  let rate = 0;
  let nextPoll = 0;
  let lastDispatch = Date.now();

  for (;;) {
    const now = Date.now();
    const elapsed = (now - scrollStart) / 1000;
    if (elapsed >= SCROLL_SECONDS) break;

    if (now >= nextPoll) {
      const { y, max } = await measure();
      const remainingTime = Math.max(0.5, SCROLL_SECONDS - elapsed);
      rate = Math.max(0, (max - y) / remainingTime);
      nextPoll = now + 350;
    }

    // Distance is derived from time actually elapsed since the last dispatch,
    // not from the nominal tick — a round trip costs far more than the sleep,
    // and assuming otherwise silently delivers a fraction of the intended rate.
    const dt = (now - lastDispatch) / 1000;
    lastDispatch = now;

    const delta = rate * dt;
    if (delta >= 0.5) await page.mouse.wheel({ deltaY: delta });
    await new Promise((r) => setTimeout(r, 8));
  }

  // Close out any shortfall so the footer is actually on screen for the hold.
  const { y, max } = await measure();
  if (max - y > 4) await page.mouse.wheel({ deltaY: max - y });

  await new Promise((r) => setTimeout(r, HOLD_END * 1000));

  try {
    await client.send("Page.stopScreencast");
  } catch {
    /* already stopped */
  }
  await browser.close();

  if (frames.length === 0) throw new Error("Screencast produced no frames.");

  // Normalise timestamps to seconds from the first frame.
  const t0 = frames[0].t;
  const timeline = frames.map((f) => ({ data: f.data, t: f.t - t0 }));
  const duration = (Date.now() - started) / 1000;

  console.log(
    `  captured ${timeline.length} frames over ${duration.toFixed(1)}s ` +
      `(~${(timeline.length / duration).toFixed(0)} fps)`,
  );

  return { timeline, duration };
}

/* ------------------------------------------------------------------ */
/* Composite + encode                                                  */
/* ------------------------------------------------------------------ */

async function render(preset, timeline, duration) {
  const { content, radius } = preset;
  const dir = path.join(TMP_DIR, preset.label);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const card = await buildCard(preset);
  const mask = await roundedPageMask(content.w, content.h, radius);

  const outFrames = Math.floor(duration * FPS);
  let cursor = 0;

  for (let i = 0; i < outFrames; i += 1) {
    const t = i / FPS;
    // Hold the most recent painted frame — the screencast only emits on change.
    while (cursor + 1 < timeline.length && timeline[cursor + 1].t <= t) cursor += 1;

    const page = await sharp(Buffer.from(timeline[cursor].data, "base64"))
      .resize(content.w, content.h, { fit: "cover", position: "top" })
      .composite([{ input: mask, blend: "dest-in" }])
      .png()
      .toBuffer();

    await sharp(card)
      .composite([{ input: page, left: content.x, top: content.y }])
      .jpeg({ quality: 94 })
      .toFile(path.join(dir, `f-${String(i).padStart(5, "0")}.jpg`));

    if (i % 150 === 0) process.stdout.write(`  composited ${i}/${outFrames}\n`);
  }

  const output = path.join(OUT_DIR, `motiona-${preset.label}.mp4`);
  await run(ffmpegPath, [
    "-y",
    "-framerate", String(FPS),
    "-i", path.join(dir, "f-%05d.jpg"),
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "19",
    "-pix_fmt", "yuv420p",
    // Both platforms re-encode; a keyframe every second survives that better.
    "-g", String(FPS),
    "-movflags", "+faststart",
    output,
  ]);

  await rm(dir, { recursive: true, force: true });
  return { output, frames: outFrames };
}

/* ------------------------------------------------------------------ */

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const wanted = FORMAT === "both" ? ["square", "vertical"] : [FORMAT];
  const results = [];

  for (const key of wanted) {
    const preset = PRESETS[key];
    if (!preset) throw new Error(`Unknown format "${key}". Use square, vertical or both.`);

    console.log(`\n▸ ${preset.label} — ${preset.canvas.w}×${preset.canvas.h}`);
    const { timeline, duration } = await capture(preset);
    const { output, frames } = await render(preset, timeline, duration);
    results.push({ output, frames, duration });
    console.log(`  wrote ${output}`);
  }

  await rm(TMP_DIR, { recursive: true, force: true });

  console.log("\nDone:");
  for (const r of results) {
    console.log(`  ${r.output}  (${(r.frames / FPS).toFixed(1)}s)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
