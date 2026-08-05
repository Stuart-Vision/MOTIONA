import type { Artwork, Collection } from "@/types";

const img = (n: number) => `/images/artworks/artwork-${String(n).padStart(2, "0")}.webp`;

export const artworks: Artwork[] = [
  { id: "aw-01", title: "Signal Bloom", artist: "Ise Karel", image: img(1), category: "Generative", year: 2025, colour: "lime", orientation: "square" },
  { id: "aw-02", title: "Soft Machinery", artist: "Nuri Vale", image: img(2), category: "Print", year: 2024, colour: "ochre", orientation: "tall" },
  { id: "aw-03", title: "Held Frequency", artist: "Odalys Mbeki", image: img(3), category: "Screen", year: 2025, colour: "ember", orientation: "portrait" },
  { id: "aw-04", title: "Counterweight", artist: "Renzo Aoki", image: img(4), category: "Sculpture", year: 2023, colour: "coral", orientation: "square" },
  { id: "aw-05", title: "Second Language", artist: "Marit Hessel", image: img(5), category: "Collage", year: 2025, colour: "cobalt", orientation: "landscape" },
  { id: "aw-06", title: "Low Orbit", artist: "Ise Karel", image: img(6), category: "Generative", year: 2024, colour: "violet", orientation: "portrait" },
  { id: "aw-07", title: "Paper Weather", artist: "Solveig Rand", image: img(7), category: "Print", year: 2025, colour: "ochre", orientation: "square" },
  { id: "aw-08", title: "Interior Noise", artist: "Nuri Vale", image: img(8), category: "Mixed media", year: 2024, colour: "carbon", orientation: "tall" },
  { id: "aw-09", title: "A Room That Listens", artist: "Odalys Mbeki", image: img(9), category: "Installation", year: 2025, colour: "blush", orientation: "portrait" },
  { id: "aw-10", title: "Field Notes", artist: "Renzo Aoki", image: img(10), category: "Drawing", year: 2023, colour: "lime", orientation: "square" },
  { id: "aw-11", title: "Warm Static", artist: "Marit Hessel", image: img(11), category: "Screen", year: 2025, colour: "coral", orientation: "landscape" },
  { id: "aw-12", title: "Two Suns", artist: "Solveig Rand", image: img(12), category: "Painting", year: 2024, colour: "ember", orientation: "portrait" },
  { id: "aw-13", title: "Quiet Protocol", artist: "Ise Karel", image: img(13), category: "Generative", year: 2025, colour: "cobalt", orientation: "square" },
  { id: "aw-14", title: "Grammar of Shade", artist: "Amaru Peña", image: img(14), category: "Photography", year: 2024, colour: "carbon", orientation: "tall" },
  { id: "aw-15", title: "Folded Archive", artist: "Nuri Vale", image: img(15), category: "Collage", year: 2025, colour: "violet", orientation: "portrait" },
  { id: "aw-16", title: "Half Remembered", artist: "Odalys Mbeki", image: img(16), category: "Painting", year: 2023, colour: "ochre", orientation: "square" },
  { id: "aw-17", title: "Public Frequency", artist: "Amaru Peña", image: img(17), category: "Installation", year: 2025, colour: "coral", orientation: "landscape" },
  { id: "aw-18", title: "Slow Blue", artist: "Renzo Aoki", image: img(18), category: "Print", year: 2024, colour: "cobalt", orientation: "portrait" },
  { id: "aw-19", title: "Every Surface Speaks", artist: "Solveig Rand", image: img(19), category: "Mixed media", year: 2025, colour: "lime", orientation: "square" },
  { id: "aw-20", title: "Descent, Repeated", artist: "Marit Hessel", image: img(20), category: "Sculpture", year: 2024, colour: "blush", orientation: "tall" },
  { id: "aw-21", title: "Border Weather", artist: "Amaru Peña", image: img(21), category: "Photography", year: 2025, colour: "ember", orientation: "portrait" },
  { id: "aw-22", title: "Instrument for Waiting", artist: "Ise Karel", image: img(22), category: "Generative", year: 2023, colour: "violet", orientation: "square" },
  { id: "aw-23", title: "Body of Evidence", artist: "Odalys Mbeki", image: img(23), category: "Screen", year: 2025, colour: "carbon", orientation: "landscape" },
  { id: "aw-24", title: "Nine Ways Home", artist: "Nuri Vale", image: img(24), category: "Drawing", year: 2024, colour: "ochre", orientation: "portrait" },
  { id: "aw-25", title: "Chorus", artist: "Solveig Rand", image: img(25), category: "Painting", year: 2025, colour: "coral", orientation: "square" },
  { id: "aw-26", title: "Threshold Study", artist: "Renzo Aoki", image: img(26), category: "Sculpture", year: 2024, colour: "lime", orientation: "tall" },
  { id: "aw-27", title: "Unstable Ground", artist: "Marit Hessel", image: img(27), category: "Collage", year: 2025, colour: "cobalt", orientation: "portrait" },
  { id: "aw-28", title: "Radio Garden", artist: "Amaru Peña", image: img(28), category: "Installation", year: 2023, colour: "blush", orientation: "square" },
  { id: "aw-29", title: "Almost Daylight", artist: "Ise Karel", image: img(29), category: "Generative", year: 2025, colour: "ember", orientation: "landscape" },
  { id: "aw-30", title: "The Long Middle", artist: "Odalys Mbeki", image: img(30), category: "Painting", year: 2024, colour: "violet", orientation: "portrait" },
];

export const byId = (id: string) => artworks.find((piece) => piece.id === id);

/** Hero cluster — deliberately mixed orientation so the stack reads as a collage. */
export const heroArtworks = ["aw-03", "aw-09", "aw-12", "aw-06", "aw-15"]
  .map(byId)
  .filter((piece): piece is Artwork => Boolean(piece));

export const stackArtworks = ["aw-21", "aw-02", "aw-24", "aw-27", "aw-30"]
  .map(byId)
  .filter((piece): piece is Artwork => Boolean(piece));

export const collageArtworks = artworks.slice(0, 9);

export const marqueeRowOne = artworks.slice(4, 15);
export const marqueeRowTwo = artworks.slice(15, 27);

export const collections: Collection[] = [
  { id: "col-01", title: "Soft Systems", curator: "Curated by Odalys Mbeki", pieces: 24, image: "/images/collections/collection-01.webp", colour: "ember", orientation: "landscape" },
  { id: "col-02", title: "After the Grid", curator: "Curated by Ise Karel", pieces: 18, image: "/images/collections/collection-02.webp", colour: "cobalt", orientation: "square" },
  { id: "col-03", title: "Paper & Pigment", curator: "Curated by Solveig Rand", pieces: 31, image: "/images/collections/collection-03.webp", colour: "ochre", orientation: "landscape" },
  { id: "col-04", title: "Night Studio", curator: "Curated by Renzo Aoki", pieces: 12, image: "/images/collections/collection-04.webp", colour: "carbon", orientation: "square" },
  { id: "col-05", title: "Loud Quiet", curator: "Curated by Marit Hessel", pieces: 27, image: "/images/collections/collection-05.webp", colour: "lime", orientation: "landscape" },
  { id: "col-06", title: "Inherited Colour", curator: "Curated by Amaru Peña", pieces: 20, image: "/images/collections/collection-06.webp", colour: "blush", orientation: "square" },
];
