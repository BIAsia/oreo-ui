/**
 * Regenerates everything in public/ that is drawn rather than written:
 * favicon.ico, the PNG app icons and og.png. Run it after changing the Oreo
 * mark, the wordmark copy or the social-card layout.
 *
 *   node scripts/generate-brand-assets.mjs
 *
 * Rasterizing is done by headless Chrome (no image dependency to install).
 * Point CHROME at another binary if yours lives elsewhere.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const WORK = mkdtempSync(path.join(tmpdir(), "oreo-brand-"));
const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** The Oreo mark, 36x24 — kept in sync with src/docs/OreoLogo.tsx. */
const MARK =
  "M23 0C26.866 0 30 5.37258 30 12C30 18.6274 26.866 24 23 24C20.3635 24 18.0688 21.5009 16.875 17.8096C15.3401 21.5008 12.3897 24 9 24C4.02944 24 0 18.6274 0 12C0 5.37258 4.02944 0 9 0C12.3894 0 15.34 2.49871 16.875 6.18945C18.0689 2.49861 20.3637 0 23 0ZM33 0C34.6569 0 36 5.37258 36 12C36 18.6274 34.6569 24 33 24C31.3431 24 30 18.6274 30 12C30 5.37258 31.3431 0 33 0Z";
const INK = "#000000";
const PAPER = "#ffffff";

function shoot(name, { width, height = width, body }) {
  const page = path.join(WORK, `${name}.html`);
  writeFileSync(
    page,
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}</style>${body}`,
  );
  const png = path.join(WORK, `${name}.png`);
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--default-background-color=00000000",
      `--window-size=${width},${height}`,
      `--screenshot=${png}`,
      `file://${page}`,
    ],
    { stdio: "ignore" },
  );
  return readFileSync(png);
}

/** markRatio: mark width as a fraction of the canvas. rxRatio: 0 for full bleed. */
function icon(size, { markRatio, rxRatio }) {
  const w = size * markRatio;
  const scale = w / 36;
  const x = (size - w) / 2;
  const y = (size - 24 * scale) / 2;
  return shoot(`icon-${size}-${rxRatio}`, {
    width: size,
    body:
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<rect width="${size}" height="${size}" rx="${size * rxRatio}" fill="${INK}"/>` +
      `<path transform="translate(${x} ${y}) scale(${scale})" fill="${PAPER}" d="${MARK}"/></svg>`,
  });
}

/** ICO with PNG-compressed entries — understood by every browser still shipping. */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + 16 * entries.length;
  const dir = entries.map(({ size, png }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size, 0);
    e.writeUInt8(size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.png)]);
}

function socialCard() {
  const inter = readFileSync(
    path.join(ROOT, "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2"),
  ).toString("base64");
  return shoot("og", {
    width: 1200,
    height: 630,
    body: `
<style>
  @font-face { font-family:"Inter Variable"; font-weight:100 900; font-style:normal;
               src:url(data:font/woff2;base64,${inter}) format("woff2-variations"); }
  body { width:1200px; height:630px; background:#0d0d0d; color:#f5f5f5;
         font-family:"Inter Variable",system-ui,sans-serif; -webkit-font-smoothing:antialiased;
         position:relative; overflow:hidden; }
  .dots { position:absolute; inset:0;
          background-image:radial-gradient(rgba(255,255,255,.09) 1px, transparent 1px);
          background-size:24px 24px;
          -webkit-mask-image:radial-gradient(120% 90% at 78% 12%, #000 0%, transparent 70%); }
  .glow { position:absolute; width:900px; height:900px; right:-260px; top:-420px; border-radius:50%;
          background:radial-gradient(circle, rgba(255,255,255,.10) 0%, transparent 62%); }
  .wrap { position:absolute; left:88px; top:0; height:630px;
          display:flex; flex-direction:column; justify-content:center; gap:26px; }
  h1 { margin:0; font-size:82px; font-weight:600; letter-spacing:-.035em; line-height:1; }
  p  { margin:0; font-size:30px; font-weight:400; line-height:1.42; color:#a0a0a0;
       max-width:960px; letter-spacing:-.01em; }
  .meta { position:absolute; left:88px; bottom:64px; font-size:23px; color:#8a8a8a; }
</style>
<div class="glow"></div><div class="dots"></div>
<div class="wrap">
  <svg width="150" viewBox="0 0 36 24" fill="#f5f5f5"><path d="${MARK}"/></svg>
  <h1>Oreo UI</h1>
  <p>Copy-paste React components for chat and agent interfaces — Base UI behavior, Tailwind tokens, Motion springs.</p>
</div>
<div class="meta">oreo-ui-preview.vercel.app</div>`,
  });
}

const TILE = { markRatio: 0.6875, rxRatio: 14 / 64 }; // rounded app tile
const BLEED = { markRatio: 0.55, rxRatio: 0 }; // full bleed: iOS and maskable mask it themselves

const written = {
  "favicon.ico": ico([16, 32, 48].map((size) => ({ size, png: icon(size, TILE) }))),
  "apple-touch-icon.png": icon(180, BLEED),
  "icon-192.png": icon(192, TILE),
  "icon-512.png": icon(512, TILE),
  "icon-maskable-512.png": icon(512, BLEED),
  "og.png": socialCard(),
};

for (const [name, data] of Object.entries(written)) {
  writeFileSync(path.join(PUBLIC, name), data);
  console.log(`public/${name}  ${(data.length / 1024).toFixed(1)} kB`);
}
console.log("\npublic/icon.svg is hand-written (it swaps colors with prefers-color-scheme) — edit it directly.");
