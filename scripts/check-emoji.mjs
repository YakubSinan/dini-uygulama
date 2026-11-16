// Fails if any emoji or pictographic symbol appears in the source tree.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOTS = ["app", "components", "data", "lib", "public", "scripts"];
const EXT = /\.(tsx?|jsx?|mjs|json|css|svg|md)$/;
// Extended_Pictographic covers emoji; also catch variation selector 16 and regional indicators (flags).
const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (EXT.test(entry.name)) yield p;
  }
}

let found = 0;
for (const root of ROOTS) {
  for await (const file of walk(root)) {
    const lines = (await readFile(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      if (EMOJI.test(line)) {
        found++;
        console.log(`${file}:${i + 1}: ${line.trim().slice(0, 100)}`);
      }
    });
  }
}
console.log(found ? `\n${found} line(s) with emoji found.` : "No emoji found.");
process.exit(found ? 1 : 0);
