// Renders the SVG app icons to the PNG sizes required by iOS and Android.
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const dir = new URL("../public/icons/", import.meta.url);
const icon = await readFile(new URL("icon.svg", dir));
const maskable = await readFile(new URL("icon-maskable.svg", dir));

const jobs = [
  [icon, 192, "icon-192.png"],
  [icon, 512, "icon-512.png"],
  [maskable, 512, "icon-maskable-512.png"],
  // iOS applies its own rounded mask, so the apple icon uses the full-bleed square artwork.
  [maskable, 180, "apple-touch-icon.png"],
];

for (const [svg, size, name] of jobs) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(new URL(name, dir).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
  console.log("wrote", name);
}
