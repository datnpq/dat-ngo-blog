import sharp from "sharp";
import { resolve } from "node:path";

const W = 1200, H = 675;
// Convergence point (the crowded "red ocean" everyone rushes toward)
const TX = 1010, TY = 430;

function rnd(seed) {
  // deterministic pseudo-random
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// --- crowd of identical gray chevrons all pointing at the target ---
let chevrons = "";
let i = 0;
for (let gx = 110; gx <= 600; gx += 64) {
  for (let gy = 150; gy <= 600; gy += 60) {
    i++;
    const jx = (rnd(i * 1.3) - 0.5) * 38;
    const jy = (rnd(i * 2.7) - 0.5) * 38;
    const x = gx + jx, y = gy + jy;
    // skip a few to avoid a rigid grid
    if (rnd(i * 3.9) < 0.12) continue;
    const ang = (Math.atan2(TY - y, TX - x) * 180) / Math.PI;
    const s = 0.85 + rnd(i * 5.1) * 0.4;
    const op = 0.28 + rnd(i * 6.3) * 0.4;
    chevrons += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${s.toFixed(2)})">
      <path d="M -9 -9 L 1 0 L -9 9" fill="none" stroke="#A8A8A2" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" opacity="${op.toFixed(2)}"/>
    </g>`;
  }
}

// faint funnel point glow at the convergence
const funnel = `<circle cx="${TX}" cy="${TY}" r="46" fill="#9CA3AF" opacity="0.10"/>
  <circle cx="${TX}" cy="${TY}" r="22" fill="#9CA3AF" opacity="0.14"/>`;

// --- the one accent arrow breaking away to open space (blue → violet) ---
const accent = `
  <path d="M 470 500 C 600 470, 720 470, 840 360 S 980 210, 1080 150"
        fill="none" stroke="url(#grad)" stroke-width="17" stroke-linecap="round"
        filter="url(#glow)"/>
  <!-- arrowhead -->
  <g transform="translate(1080 150) rotate(-38)">
    <path d="M -2 0 L -30 -16 L -20 0 L -30 16 Z" fill="url(#grad)" filter="url(#glow)"/>
  </g>
  <!-- origin dot -->
  <circle cx="470" cy="500" r="9" fill="#2563EB"/>
`;

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
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#4F46E5" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#FAFAF8"/>
  <rect width="${W}" height="5" fill="url(#top)"/>
  ${funnel}
  ${chevrons}
  ${accent}
</svg>`;

const out = resolve("public/blog/canh-tranh-ke-thua-cuoc.jpg");
await sharp(Buffer.from(svg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out);
const meta = await sharp(out).metadata();
console.log(`Saved ${out} — ${meta.width}x${meta.height}`);
