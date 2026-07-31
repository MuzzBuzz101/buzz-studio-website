/**
 * Downloads the seeded placeholder photography into `public/images/` so the site
 * serves local assets instead of hitting picsum.photos on every optimizer miss.
 *
 * Run once after cloning: `npm run placeholders`
 * Replace these files with real assets (same paths) as work is delivered.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";

const ROOT = join(process.cwd(), "public", "images");

/** [seed, outputPath, width, height] — dimensions match the data files exactly. */
const ASSETS = [
  ["echelon-cover", "projects/midnight-echelon/cover.jpg", 1000, 1250],
  ["echelon-1", "projects/midnight-echelon/01.jpg", 1200, 750],
  ["echelon-2", "projects/midnight-echelon/02.jpg", 900, 1200],
  ["echelon-3", "projects/midnight-echelon/03.jpg", 1200, 800],
  ["echelon-4", "projects/midnight-echelon/04.jpg", 1200, 750],

  ["aurum-cover", "projects/aurum-timepieces/cover.jpg", 1000, 1250],
  ["aurum-1", "projects/aurum-timepieces/01.jpg", 1200, 800],
  ["aurum-2", "projects/aurum-timepieces/02.jpg", 900, 1200],
  ["aurum-3", "projects/aurum-timepieces/03.jpg", 1200, 750],

  ["salt-cover", "projects/salt-and-static/cover.jpg", 1000, 1250],
  ["salt-1", "projects/salt-and-static/01.jpg", 1200, 800],
  ["salt-2", "projects/salt-and-static/02.jpg", 900, 1200],
  ["salt-3", "projects/salt-and-static/03.jpg", 1200, 750],
  ["salt-4", "projects/salt-and-static/04.jpg", 1200, 800],

  ["kinetic-cover", "projects/kinetic/cover.jpg", 1000, 1250],
  ["kinetic-1", "projects/kinetic/01.jpg", 1200, 800],
  ["kinetic-2", "projects/kinetic/02.jpg", 900, 1200],
  ["kinetic-3", "projects/kinetic/03.jpg", 1200, 750],

  ["glasshouse-cover", "projects/glasshouse-sessions/cover.jpg", 1000, 1250],
  ["glass-1", "projects/glasshouse-sessions/01.jpg", 1200, 800],
  ["glass-2", "projects/glasshouse-sessions/02.jpg", 900, 1200],
  ["glass-3", "projects/glasshouse-sessions/03.jpg", 1200, 750],

  ["obsidian-cover", "projects/obsidian/cover.jpg", 1000, 1250],
  ["obsidian-1", "projects/obsidian/01.jpg", 1200, 800],
  ["obsidian-2", "projects/obsidian/02.jpg", 900, 1200],
  ["obsidian-3", "projects/obsidian/03.jpg", 1200, 750],

  ["still-01", "stills/01.jpg", 900, 1200],
  ["still-02", "stills/02.jpg", 1200, 900],
  ["still-03", "stills/03.jpg", 900, 1200],
  ["still-04", "stills/04.jpg", 1100, 1100],
  ["still-05", "stills/05.jpg", 1200, 800],
  ["still-06", "stills/06.jpg", 900, 1200],
  ["still-07", "stills/07.jpg", 900, 1200],
  ["still-08", "stills/08.jpg", 1200, 900],
  ["still-09", "stills/09.jpg", 900, 1200],
];

const CONCURRENCY = 6;

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download([seed, out, width, height]) {
  const target = join(ROOT, out);
  if (await exists(target)) {
    return { out, skipped: true, bytes: 0 };
  }

  const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${seed}: HTTP ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buffer);
  return { out, skipped: false, bytes: buffer.byteLength };
}

async function main() {
  const queue = [...ASSETS];
  let total = 0;
  let downloaded = 0;
  let skipped = 0;

  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const asset = queue.shift();
      if (!asset) break;
      const result = await download(asset);
      total += result.bytes;
      if (result.skipped) {
        skipped += 1;
      } else {
        downloaded += 1;
        console.log(`  ✓ ${result.out} (${(result.bytes / 1024).toFixed(0)} KB)`);
      }
    }
  });

  await Promise.all(workers);

  console.log(
    `\nDone. ${downloaded} downloaded, ${skipped} already present, ${(total / 1024 / 1024).toFixed(2)} MB total.`
  );
}

main().catch((error) => {
  console.error(`\nFailed: ${error.message}`);
  process.exit(1);
});
