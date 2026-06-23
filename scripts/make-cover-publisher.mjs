import sharp from "sharp";
import { resolve } from "node:path";

const W = 1200, H = 675;
const PAD = 90;
const chartW = W - PAD * 2;
const chartH = 320;
const baseY = 470;

// A publisher journey: ramp up, plateau, taper off (the "trickle then decline")
const pts = [0.06, 0.12, 0.28, 0.46, 0.55, 0.62, 0.58, 0.66, 0.52, 0.40, 0.30, 0.18, 0.08];
const n = pts.length;
const coords = pts.map((p, i) => {
  const x = PAD + (chartW * i) / (n - 1);
  const y = baseY - p * chartH;
  return [x, y];
});

const linePath =
  "M " + coords.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ");
const areaPath =
  `M ${PAD} ${baseY} L ` +
  coords.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") +
  ` L ${PAD + chartW} ${baseY} Z`;

// gridlines
let grid = "";
for (let i = 0; i <= 4; i++) {
  const y = baseY - (chartH * i) / 4;
  grid += `<line x1="${PAD}" y1="${y}" x2="${PAD + chartW}" y2="${y}" stroke="#E9E9E9" stroke-width="1" stroke-dasharray="3 6"/>`;
}

// dots on the line
const dots = coords
  .map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="#FAFAF8" stroke="url(#grad)" stroke-width="2.5"/>`)
  .join("");

// floating coins ($) — simple circles with a slash to imply currency, no text glyphs
function coin(cx, cy, r, op) {
  return `<g opacity="${op}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#grad)" stroke-width="${(r/7).toFixed(1)}"/>
    <line x1="${cx}" y1="${cy - r * 0.55}" x2="${cx}" y2="${cy + r * 0.55}" stroke="url(#grad)" stroke-width="${(r/7).toFixed(1)}" stroke-linecap="round"/>
  </g>`;
}

const coins = coin(250, 150, 26, 0.9) + coin(1000, 120, 18, 0.7) + coin(1080, 250, 13, 0.55);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="grad" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#2563EB"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="top" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2563EB"/>
      <stop offset="1" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7C3AED" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#2563EB" stop-opacity="0.02"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="9" flood-color="#4F46E5" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#FAFAF8"/>
  <rect width="${W}" height="5" fill="url(#top)"/>
  ${grid}
  ${coins}
  <path d="${areaPath}" fill="url(#area)"/>
  <path d="${linePath}" fill="none" stroke="url(#grad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  ${dots}
</svg>`;

const out = resolve("public/blog/publisher-earnings.jpg");
await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
const meta = await sharp(out).metadata();
console.log(`Saved ${out} — ${meta.width}x${meta.height}`);
