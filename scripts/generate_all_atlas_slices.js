// scripts/generate_all_atlas_slices.js
// High-resolution (800x800 & 1000x500) Neuroanatomical Slice Renderer
// Combines:
//   1. Real 81,920-triangle ICBM152 Pial Cortical Surface Mesh (BrainMesh_ICBM152.lh.mz3) for Lateral Cortex (cx)
//   2. Tricubic-interpolated 0.5mm ICBM152 2009c MRI template (ICBM2009sym.nii.gz) + High-Res Histological Substructure for Coronal Forebrain (th) & Horizontal Cerebellum (cbl)
//   3. Exact Bezier Signed-Distance Fields matching the Vector SVG contours 1:1 + Detailed Histological Fiber Architecture for all 8 Brainstem & Spinal Cord levels (rmb, cmb, rp, cp, rm, mm, cm, c)

const fs = require('fs');
const zlib = require('zlib');

// --- PNG Encoder ---
function encodePNG(width, height, rgbaBuffer) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    rgbaBuffer.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    crcTable[n] = c >>> 0;
  }
  function crc32(buf) {
    let c = -1;
    for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff];
    return (c ^ -1) >>> 0;
  }
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const tp = Buffer.from(type, 'ascii');
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([tp, data])), 0);
    return Buffer.concat([len, tp, data, crc]);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// --- Math & Procedural Micro-Texture Utilities ---
function clamp(x, a = 0, b = 1) { return Math.max(a, Math.min(b, x)); }
function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
function lerp(a, b, t) { return a + (b - a) * t; }

function hash2(x, y) {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return h - Math.floor(h);
}
function vnoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy), b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
function fbm(x, y) {
  return 0.50 * vnoise(x, y) + 0.30 * vnoise(x * 2.17, y * 2.17) + 0.20 * vnoise(x * 4.53, y * 4.53);
}

// --- SVG Path Parser & Exact Polygon Signed Distance Field ---
function parseSVGPathToPolygon(dStr, stepsPerCurve = 24) {
  const tokens = dStr.match(/[MCLQAZ]|-?\d+(?:\.\d+)?/gi) || [];
  let i = 0;
  const pts = [];
  let cx = 0, cy = 0, sx = 0, sy = 0;
  let cmd = '';
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[MCLQAZ]$/i.test(t)) { cmd = t.toUpperCase(); i++; }
    if (cmd === 'M') {
      cx = parseFloat(tokens[i++]); cy = parseFloat(tokens[i++]);
      sx = cx; sy = cy;
      pts.push([cx, cy]);
      cmd = 'L';
    } else if (cmd === 'L') {
      cx = parseFloat(tokens[i++]); cy = parseFloat(tokens[i++]);
      pts.push([cx, cy]);
    } else if (cmd === 'Q') {
      const x1 = parseFloat(tokens[i++]), y1 = parseFloat(tokens[i++]);
      const x2 = parseFloat(tokens[i++]), y2 = parseFloat(tokens[i++]);
      for (let s = 1; s <= stepsPerCurve; s++) {
        const u = s / stepsPerCurve, inv = 1 - u;
        pts.push([
          inv * inv * cx + 2 * inv * u * x1 + u * u * x2,
          inv * inv * cy + 2 * inv * u * y1 + u * u * y2
        ]);
      }
      cx = x2; cy = y2;
    } else if (cmd === 'C') {
      const x1 = parseFloat(tokens[i++]), y1 = parseFloat(tokens[i++]);
      const x2 = parseFloat(tokens[i++]), y2 = parseFloat(tokens[i++]);
      const x3 = parseFloat(tokens[i++]), y3 = parseFloat(tokens[i++]);
      for (let s = 1; s <= stepsPerCurve; s++) {
        const u = s / stepsPerCurve, inv = 1 - u;
        pts.push([
          inv * inv * inv * cx + 3 * inv * inv * u * x1 + 3 * inv * u * u * x2 + u * u * u * x3,
          inv * inv * inv * cy + 3 * inv * inv * u * y1 + 3 * inv * u * u * y2 + u * u * u * y3
        ]);
      }
      cx = x3; cy = y3;
    } else if (cmd === 'Z') {
      if (Math.hypot(cx - sx, cy - sy) > 0.01) pts.push([sx, sy]);
      break;
    } else {
      i++;
    }
  }
  return pts;
}

// Signed distance to closed polygon: negative inside, positive outside
function sdPolygon(px, py, poly) {
  let dMinSq = Infinity;
  let inside = false;
  const n = poly.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const vx = xj - xi, vy = yj - yi;
    const wx = px - xi, wy = py - yi;
    const lenSq = vx * vx + vy * vy;
    const t = lenSq > 0 ? clamp((wx * vx + wy * vy) / lenSq, 0, 1) : 0;
    const dx = wx - t * vx, dy = wy - t * vy;
    const dSq = dx * dx + dy * dy;
    if (dSq < dMinSq) dMinSq = dSq;
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi + 1e-12) + xi)) {
      inside = !inside;
    }
  }
  return (inside ? -1 : 1) * Math.sqrt(dMinSq);
}

function sdEllipse(x, y, cx, cy, rx, ry) {
  const dx = (x - cx) / rx, dy = (y - cy) / ry;
  return (Math.hypot(dx, dy) - 1) * Math.min(rx, ry);
}

function softEllipse(x, y, cx, cy, rx, ry, feather = 2.5) {
  return 1 - smoothstep(-feather, feather, sdEllipse(x, y, cx, cy, rx, ry));
}

function softPoly(x, y, poly, feather = 2.0) {
  return 1 - smoothstep(-feather, feather, sdPolygon(x, y, poly));
}

// --- Color Palettes for the 3 Stains (Weigert, MRI, Luxol Fast Blue) ---
function colorizeHistology(myelin, gmNissl, csf, pialEdge, fineTex) {
  // myelin in [0..1]: 1 = dense compact myelinated white matter, 0 = pure gray matter neuropil
  // gmNissl in [0..1]: extra cellular/nuclear density inside gray matter nuclei
  const m = clamp(myelin * (0.92 + 0.14 * fineTex) + pialEdge * 0.25, 0, 1);

  // 1. Weigert Iron-Hematoxylin Stain (Classic DeArmond / Haines textbook look:
  //    Myelinated tracts = deep mahogany-indigo-black; Gray matter = warm golden-amber / buff; CSF = warm parchment slide)
  const wGmR = 232 - gmNissl * 24, wGmG = 196 - gmNissl * 26, wGmB = 142 - gmNissl * 22;
  const wWmR = 20, wWmG = 22, wWmB = 38;
  // Nonlinear staining curve so compact tracts look richly myelinated while reticular formation has intermediate tone
  const wCurve = Math.pow(m, 1.15);
  const wR = Math.round(lerp(lerp(wGmR, wWmR, wCurve), 247, csf));
  const wG = Math.round(lerp(lerp(wGmG, wWmG, wCurve), 243, csf));
  const wB = Math.round(lerp(lerp(wGmB, wWmB, wCurve), 234, csf));

  // 2. High-Field 7T T1-Weighted Anatomical MRI (White matter = bright hyperintense 215-242;
  //    Gray matter = distinct medium gray 95-135; CSF = dark 12-22)
  const mriCurve = Math.pow(m, 0.95);
  const gmInt = 104 - gmNissl * 14 + (fineTex - 0.5) * 14;
  const wmInt = 228 + (fineTex - 0.5) * 18;
  const mVal = clamp(Math.round(lerp(lerp(gmInt, wmInt, mriCurve) * (1 - pialEdge * 0.35), 14, csf)), 0, 255);
  const mR = mVal;
  const mG = Math.min(255, Math.round(mVal * 1.01));
  const mB = Math.min(255, Math.round(mVal * 1.05));

  // 3. Luxol Fast Blue + Cresyl Violet (Klüver-Barrera stain:
  //    Myelinated tracts = vibrant cyan-cobalt blue; Gray matter / Nissl soma = orchid-violet-pink; CSF = clean glass)
  const lGmR = 216 - gmNissl * 28, lGmG = 162 - gmNissl * 34, lGmB = 222 - gmNissl * 12;
  const lWmR = 10, lWmG = 86, lWmB = 168;
  const lCurve = Math.pow(m, 1.10);
  const lR = Math.round(lerp(lerp(lGmR, lWmR, lCurve), 244, csf));
  const lG = Math.round(lerp(lerp(lGmG, lWmG, lCurve), 247, csf));
  const lB = Math.round(lerp(lerp(lGmB, lWmB, lCurve), 252, csf));

  return { wR, wG, wB, mR, mG, mB, lR, lG, lB };
}

// ============================================================================
// PART 1: Exact SVG-Matched 800x800 Brainstem & Spinal Cord Histological Slices
// ============================================================================
const OUTER_PATHS = {
  c:   "M99,36 C82,34 56,38 34,54 C14,68 6,84 8,102 C10,124 22,144 44,156 C64,166 84,166 97,160 L98,136 L100,136 L102,160 C116,166 136,166 156,156 C178,144 190,124 192,102 C194,84 186,68 166,54 C144,38 118,34 101,36 L100,58 Z",
  cm:  "M99,32 C80,30 56,36 38,52 C22,68 18,90 22,112 C26,136 42,156 64,164 C78,169 92,168 98,162 L100,148 L102,162 C108,168 122,169 136,164 C158,156 174,136 178,112 C182,90 178,68 162,52 C144,36 120,30 101,32 L100,52 Z",
  mm:  "M99,28 C82,25 62,30 44,44 C26,58 18,78 22,102 C25,122 34,138 48,150 C60,162 76,174 96,174 L100,158 L104,174 C124,174 140,162 152,150 C166,138 175,122 178,102 C182,78 174,58 156,44 C138,30 118,25 101,28 L100,48 Z",
  rm:  "M58,36 C40,34 22,48 18,72 C14,98 22,126 36,146 C48,160 66,174 96,174 L100,154 L104,174 C134,174 152,160 164,146 C178,126 186,98 182,72 C178,48 160,34 142,36 L124,48 C114,54 106,56 100,58 C94,56 86,54 76,48 Z",
  cp:  "M56,36 C36,42 18,64 16,92 C14,116 20,146 44,166 C64,180 86,180 100,178 C114,180 136,180 156,166 C180,146 186,116 184,92 C182,64 164,42 144,36 L124,46 C114,50 106,48 100,50 C94,48 86,50 76,46 Z",
  rp:  "M64,32 C42,40 20,64 18,96 C14,124 22,154 46,170 C66,182 88,182 100,180 C112,182 134,182 154,170 C178,154 186,124 182,96 C180,64 158,40 136,32 L120,42 C110,36 90,36 80,42 Z",
  cmb: "M58,36 C68,24 84,26 96,34 L100,36 L104,34 C116,26 132,24 142,36 C164,46 180,68 178,96 C184,126 174,160 150,174 C134,182 118,174 110,158 C106,150 94,150 90,158 C82,174 66,182 50,174 C26,160 16,126 22,96 C20,68 36,46 58,36 Z",
  rmb: "M62,32 C74,22 90,24 98,32 L100,34 L102,32 C110,24 126,22 138,32 C160,40 178,64 176,94 C182,126 172,160 148,174 C132,182 116,170 108,154 C104,146 96,146 92,154 C84,170 68,182 52,174 C28,160 18,126 24,94 C22,64 40,40 62,32 Z"
};

const SPINAL_GRAY_HALF_POLY = parseSVGPathToPolygon(
  "M100,92 C92,92 84,84 78,66 C74,52 68,43 60,40 C55,39 51,43 53,49 C57,61 61,74 64,87 C60,92 55,96 52,101 C55,105 59,108 62,112 C52,122 45,134 46,145 C48,153 58,155 70,149 C80,143 86,130 88,114 C92,108 96,106 100,106 Z", 20
);

// True undulating/crenated C-shaped lamina for Inferior Olivary Nucleus (open medially at hilum)
function evalCrenatedRibbon(axW, sy, cx, cy, rx, ry, folds = 11, amp = 1.35, halfThick = 1.45) {
  const dx = axW - cx, dy = sy - cy;
  const theta = Math.atan2(dy / ry, dx / rx);
  // Open medially (around theta = 0, i.e., dx > 0, |dy| small -> medial hilum faces toward midline x=100, so in axW space hilum is at dx = -rx, theta = +-PI!)
  // Wait: in axW space (distance from midline 100), smaller axW is MORE MEDIAL!
  // So the medial hilum is at dx < 0 (theta near +-PI)!
  const angleFromMedial = Math.abs(Math.atan2(dy, -dx)); // 0 at medial hilum
  const hilumMask = smoothstep(0.28, 0.58, angleFromMedial);
  if (hilumMask <= 0.001) return 0;
  const rNorm = Math.hypot(dx / rx, dy / ry);
  const targetR = 1.0 + (amp / rx) * Math.sin(theta * folds + 0.5 * Math.cos(theta * 3));
  const distPx = Math.abs(rNorm - targetR) * Math.min(rx, ry);
  return (1 - smoothstep(halfThick - 0.6, halfThick + 0.8, distPx)) * hilumMask;
}
const V4_RM_POLY = parseSVGPathToPolygon("M58,36 Q100,26 142,36 L124,48 C114,54 106,56 100,58 C94,56 86,54 76,48 Z", 20);
const V4_CP_POLY = parseSVGPathToPolygon("M68,36 Q100,28 132,36 L122,48 C112,52 106,48 100,50 C94,48 88,52 78,48 Z", 20);
const V4_RP_POLY = parseSVGPathToPolygon("M76,38 C88,32 112,32 124,38 L118,56 C108,62 92,62 82,56 Z", 20);
const CM_GRAY_POLY = parseSVGPathToPolygon("M100,66 C86,66 74,72 70,84 C68,94 78,104 100,104 C122,104 132,94 130,84 C126,72 114,66 100,66 Z", 20);

function renderBrainstemHistologySlice(key) {
  const W = 800, H = 800;
  const mriBuf = Buffer.alloc(W * H * 4);
  const weigertBuf = Buffer.alloc(W * H * 4);
  const lfbBuf = Buffer.alloc(W * H * 4);

  const outerPoly = parseSVGPathToPolygon(OUTER_PATHS[key], 28);

  for (let py = 0; py < H; py++) {
    const y = (py / (H - 1)) * 200;
    for (let px = 0; px < W; px++) {
      const x = (px / (W - 1)) * 200;
      const ax = Math.abs(x - 100);
      const symX = 100 - ax; // mirrored into left half [0..100]

      // 1. Exact Pial Boundary & Ventricular CSF Cavity
      let pialDist = sdPolygon(x, y, outerPoly);
      let csfDist = 999;

      if (key === 'c') {
        csfDist = Math.hypot(ax, y - 99) - 2.6;
      } else if (key === 'cm') {
        csfDist = Math.hypot(ax, y - 82) - 2.5;
      } else if (key === 'mm') {
        csfDist = Math.hypot(ax, y - 60) - 2.5;
      } else if (key === 'rm') {
        csfDist = sdPolygon(x, y, V4_RM_POLY);
        pialDist = Math.min(pialDist, csfDist);
      } else if (key === 'cp') {
        csfDist = sdPolygon(x, y, V4_CP_POLY);
        pialDist = Math.min(pialDist, csfDist);
      } else if (key === 'rp') {
        csfDist = sdPolygon(x, y, V4_RP_POLY);
        pialDist = Math.min(pialDist, csfDist);
      } else if (key === 'cmb' || key === 'rmb') {
        csfDist = Math.hypot(ax, y - 56) - 4.0;
      }

      if (pialDist > 0.75) continue;
      const alpha = pialDist < -0.5 ? 255 : Math.round(clamp((0.75 - pialDist) / 1.25, 0, 1) * 255);
      const csf = csfDist < -0.5 ? 1 : csfDist < 0.75 ? clamp((0.75 - csfDist) / 1.25, 0, 1) : 0;

      // Subtle organic histological domain warp for internal structures
      const wx = (fbm(x * 0.14, y * 0.14) - 0.5) * 1.4;
      const wy = (fbm(x * 0.14 + 13.7, y * 0.14 + 7.9) - 0.5) * 1.4;
      const sx = symX + wx * 0.5;
      const sy = y + wy * 0.5;
      const axW = Math.abs(x + wx * 0.5 - 100);

      // Baseline tissue state: white matter (myelin = 0.88), modified by anatomical structures
      let myelin = 0.86;
      let gmNissl = 0.0;

      if (key === 'c') {
        // Exact Butterfly Gray Horn from SPINAL_GRAY_HALF_POLY
        const dHorn = sdPolygon(sx, sy, SPINAL_GRAY_HALF_POLY);
        const inHorn = 1 - smoothstep(-1.4, 1.8, dHorn);
        // Substantia gelatinosa (Lamina II cap at tip of dorsal horn) is extra pale/unmyelinated
        const sgCap = softEllipse(axW, sy, 42, 43, 8, 7, 2.5);
        // Reticulated lateral margin (cervical reticular process between dorsal & ventral horns)
        const retProc = softEllipse(axW, sy, 45, 96, 8, 10, 3.0) * (0.5 + 0.5 * Math.sin(axW * 1.8 + sy * 1.4));
        // Ventral horn alpha motor neuron pools (medial & lateral lamina IX clusters)
        const motorPool = softEllipse(axW, sy, 34, 134, 12, 13, 3.0) + softEllipse(axW, sy, 20, 140, 8, 9, 2.5);
        const gm = clamp(inHorn + retProc * 0.45, 0, 1);

        // Radial myelinated septa & funiculi (dorsal columns, lateral corticospinal, spinothalamic)
        const theta = Math.atan2(y - 99, ax);
        const radialSepta = 0.06 * Math.sin(theta * 28 + fbm(x * 0.2, y * 0.2) * 3.0);
        // Anterior white commissure transverse myelinated fibers ventral to central canal
        const awc = softEllipse(axW, y, 0, 110, 16, 4.5, 2.0);

        myelin = clamp((1 - gm * 0.86 - sgCap * 0.12) + awc * 0.25 + radialSepta * (1 - gm), 0.04, 0.98);
        gmNissl = clamp(gm * 0.55 + motorPool * 0.40 + sgCap * 0.25, 0, 1);
      } else if (key === 'cm') {
        // Central gray around central canal + Gracile, Cuneate, and Spinal V nuclei
        const cGray = softPoly(x + wx * 0.4, sy, CM_GRAY_POLY, 2.5);
        const nGrac = softEllipse(axW, sy, 12, 48, 6.5, 11, 2.5);
        const nCun = softEllipse(axW, sy, 27, 52, 8.5, 11, 2.5);
        const nSpV = softEllipse(axW, sy, 58, 66, 9.5, 13, 3.0);
        const retForm = softEllipse(axW, sy, 34, 106, 22, 20, 5.0);

        // Interdigitating Pyramidal Decussation bundles crossing obliquely from ventral pyramid to contralateral LCST
        const decZone = softEllipse(axW, sy, 12, 118, 22, 22, 5.0);
        const crossBundles = 0.5 + 0.5 * Math.cos((x - 100) * 0.55 + (y - 118) * 0.65) * Math.cos(-(x - 100) * 0.55 + (y - 118) * 0.65);

        // Dense white tracts: Fasciculus gracilis & cuneatus (dorsal caps), Spinal V tract (dorsolateral rim), LCST, Ventral Pyramid
        const wmDorsal = softEllipse(axW, sy, 10, 38, 6, 6, 2.0) + softEllipse(axW, sy, 26, 41, 8, 6, 2.0);
        const wmPyr = softEllipse(axW, sy, 14, 136, 12, 14, 3.0);
        const wmLCST = softEllipse(axW, sy, 56, 92, 11, 14, 3.5);

        const gmTotal = clamp(cGray * 0.85 + nGrac * 0.78 + nCun * 0.78 + nSpV * 0.82 + retForm * 0.48 - (wmDorsal + wmPyr + wmLCST) * 0.65, 0, 1);
        myelin = clamp(0.88 - gmTotal * 0.76 + decZone * (crossBundles * 0.35 - 0.12), 0.08, 0.96);
        gmNissl = clamp(gmTotal * 0.75, 0, 1);
      } else if (key === 'mm') {
        // Central periventricular gray (Hypoglossal, DMX, Solitary) + Nucleus Gracilis & Cuneatus + Accessory Cuneate + Spinal V
        const cGray = softEllipse(axW, sy, 0, 65, 25, 12, 3.5);
        const nGrac = softEllipse(axW, sy, 12, 43, 7.5, 11, 2.5);
        const nCun = softEllipse(axW, sy, 30, 49, 9.5, 10.5, 2.5);
        const nAccCun = softEllipse(axW, sy, 43, 66, 6.5, 6.5, 2.0);
        const nSpV = softEllipse(axW, sy, 58, 66, 9.5, 13, 3.0);
        const retForm = softEllipse(axW, sy, 32, 102, 26, 22, 5.0);

        // True Crenated Inferior Olivary Nucleus (scaled for mid-medulla)
        const oliveRibbon = evalCrenatedRibbon(axW, sy, 46, 136, 13.5, 11.0, 10, 1.25, 1.35);
        const oliveHilum = softEllipse(axW, sy, 42, 136, 10, 7, 2.5);

        // Sweeping Internal Arcuate Fibers (sensory decussation curving from gracile/cuneate around central gray to midline ML)
        const arcR = Math.hypot(axW * 1.15, (sy - 78) * 0.85);
        const arcEnv = softEllipse(axW, sy, 18, 86, 22, 26, 4.0);
        const arcStrands = arcEnv * (0.5 + 0.5 * Math.sin(arcR * 1.65));

        // Dense compact white matter: Medullary Pyramid, Paramedian Medial Lemniscus, MLF
        const wmPyr = softEllipse(axW, sy, 22, 158, 17, 11.5, 3.0);
        const wmML = softEllipse(axW, sy, 8, 120, 6, 21, 2.5);
        const wmMLF = softEllipse(axW, sy, 4.5, 80, 3.5, 9, 1.5);

        const gmTotal = clamp(cGray * 0.82 + nGrac * 0.80 + nCun * 0.80 + nAccCun * 0.76 + nSpV * 0.82 + oliveRibbon * 0.92 + retForm * 0.46, 0, 1);
        const wmBoost = clamp(wmPyr * 0.95 + wmML * 0.92 + wmMLF * 0.90 + oliveHilum * 0.45 + arcStrands * 0.42, 0, 1);
        myelin = clamp(0.84 - gmTotal * 0.76 + wmBoost * 0.55, 0.06, 0.97);
        gmNissl = clamp(gmTotal * (1 - wmBoost * 0.7) * 0.85, 0, 1);
      } else if (key === 'rm') {
        // Floor of 4th ventricle cranial nerve nuclear column (XII, DMX, Solitary, Medial/Inferior Vestibular)
        const floorGray = softEllipse(axW, sy, 22, 56, 28, 9.5, 3.0);
        const nSpV = softEllipse(axW, sy, 58, 78, 8.5, 11, 2.5);
        const nAmb = softEllipse(axW, sy, 44, 98, 5.5, 5.5, 2.0);
        const retForm = softEllipse(axW, sy, 34, 96, 26, 22, 5.0);

        // True Crenated Inferior Olivary Nucleus + Dorsal & Medial Accessory Olivary blades
        const oliveRibbon = evalCrenatedRibbon(axW, sy, 46, 134, 15.5, 12.5, 11, 1.45, 1.45);
        const medAccOlive = softEllipse(axW, sy, 24, 138, 7.5, 1.8, 1.0);
        const dorsAccOlive = softEllipse(axW, sy, 48, 115, 8.5, 1.8, 1.0);
        const oliveHilum = softEllipse(axW, sy, 46, 134, 11, 8, 2.5);

        // Olivocerebellar fibers streaming from olive hilum across midline toward ICP
        const olivoFibers = softEllipse(axW, sy, 36, 98, 32, 24, 5.0) * (0.5 + 0.5 * Math.sin((axW * 0.55 + sy * 0.75) * 1.4));

        // Dense compact white tracts: Pyramid, Medial Lemniscus, MLF, Inferior Cerebellar Peduncle (Restiform body)
        const wmPyr = softEllipse(axW, sy, 26, 158, 16, 11, 3.0);
        const wmML = softEllipse(axW, sy, 8.5, 114, 6, 24, 2.5);
        const wmMLF = softEllipse(axW, sy, 4.5, 76, 3.5, 9, 1.5);
        const wmICP = softEllipse(axW, sy, 70, 58, 9.5, 14, 3.0);
        // Hypoglossal rootlets coursing ventrally between ML/pyramid and olive
        const cn12Root = softEllipse(axW, sy, 17, 112, 1.6, 32, 1.0);

        const gmTotal = clamp(floorGray * 0.84 + nSpV * 0.80 + nAmb * 0.78 + oliveRibbon * 0.94 + medAccOlive * 0.85 + dorsAccOlive * 0.85 + retForm * 0.44, 0, 1);
        const wmBoost = clamp(wmPyr * 0.95 + wmML * 0.92 + wmMLF * 0.90 + wmICP * 0.94 + oliveHilum * 0.55 + cn12Root * 0.65 + olivoFibers * 0.25, 0, 1);
        myelin = clamp(0.84 - gmTotal * 0.78 + wmBoost * 0.60, 0.06, 0.98);
        gmNissl = clamp(gmTotal * (1 - wmBoost * 0.65) * 0.88, 0, 1);
      } else if (key === 'cp' || key === 'rp') {
        const isRostral = key === 'rp';
        // Dorsal Pontine Tegmentum: 4th ventricle floor gray + Cranial Nerve Nuclei (VI, VII, VIII in cp; V motor & principal in rp)
        const floorGray = softEllipse(axW, sy, 18, isRostral ? 62 : 55, 26, 8, 2.5);
        const tegRet = softEllipse(axW, sy, 26, isRostral ? 86 : 76, 32, 20, 5.0);
        const cnNuc = isRostral
          ? (softEllipse(axW, sy, 32, 72, 5.5, 5.5, 1.8) + softEllipse(axW, sy, 44, 72, 6, 6.5, 1.8))
          : (softEllipse(axW, sy, 11, 58, 5.5, 5.5, 1.8) + softEllipse(axW, sy, 32, 82, 7, 7, 2.0) + softEllipse(axW, sy, 35, 54, 6, 5, 1.8));

        // Basis Pontis: Alternating horizontal streams of myelinated Transverse Pontine Fibers & islands of Pontine Gray Nuclei
        const basisEnv = softEllipse(axW, sy, 0, 144, 68, 32, 6.0);
        const bendY = sy - 0.0035 * axW * axW;
        const transStrands = 0.5 + 0.5 * Math.cos((bendY - 118) * 0.72 + fbm(x * 0.15, y * 0.15) * 1.4);
        // Corticospinal & Corticobulbar rounded fascicles embedded inside the basis pontis
        const cstBundles = softEllipse(axW, sy, 24, 140, 13, 9, 2.5) + softEllipse(axW, sy, 46, 146, 10, 8, 2.5) + softEllipse(axW, sy, 15, 131, 6, 5.5, 2.0);

        // Major White Matter Pathways: MCP (brachium pontis), SCP, Medial Lemniscus, Trapezoid Body, MLF
        const wmMCP = softEllipse(axW, sy, 66, 112, 13, 24, 4.0);
        const wmSCP = isRostral ? softEllipse(axW, sy, 30, 46, 5.5, 10, 2.0) : softEllipse(axW, sy, 46, 58, 8.5, 10, 2.5);
        const wmML = softEllipse(axW, sy, isRostral ? 26 : 18, isRostral ? 114 : 96, 16, 6, 2.2);
        const wmMLF = softEllipse(axW, sy, 4.5, isRostral ? 82 : 60, 3.5, 7, 1.5);
        const wmTrap = !isRostral ? softEllipse(axW, sy, 20, 88, 26, 4.5, 2.0) : 0;

        const gmTeg = clamp(floorGray * 0.82 + cnNuc * 0.85 + tegRet * 0.46, 0, 1);
        const gmBasis = basisEnv * (1 - transStrands * 0.72) * (1 - cstBundles * 0.78) * 0.82;
        const gmTotal = clamp(gmTeg * (1 - basisEnv) + gmBasis, 0, 1);
        const wmBoost = clamp(wmMCP * 0.96 + wmSCP * 0.92 + wmML * 0.92 + wmMLF * 0.90 + wmTrap * 0.85 + cstBundles * basisEnv * 0.88 + basisEnv * transStrands * 0.65, 0, 1);

        myelin = clamp(0.84 - gmTotal * 0.78 + wmBoost * 0.48, 0.06, 0.98);
        gmNissl = clamp(gmTotal * 0.85, 0, 1);
      } else if (key === 'cmb' || key === 'rmb') {
        const isRostral = key === 'rmb';
        // Heart/pear-shaped Periaqueductal Gray (PAG) + CN III/E-W (rmb) or CN IV (cmb)
        const pag = softEllipse(axW, sy, 0, 58, 15, 16, 3.0);
        const cnNuc = isRostral
          ? (softEllipse(axW, sy, 5, 73, 5, 5, 1.5) + softEllipse(axW, sy, 3.5, 65, 3, 3.5, 1.2))
          : softEllipse(axW, sy, 5, 72, 4.5, 4.5, 1.5);

        // Colliculi: Superior Colliculus (laminated gray/white strata in rmb) vs Inferior Colliculus (ovoid nucleus in cmb)
        const collCore = isRostral
          ? softEllipse(axW, sy, 26, 38, 19, 8.5, 2.5) * (0.72 + 0.25 * Math.sin((sy - 30) * 0.9))
          : softEllipse(axW, sy, 30, 46, 16, 11.5, 2.5);

        // Substantia Nigra (tilted band separating tegmentum from crus cerebri)
        const snRotX = axW - (sy - 120) * 0.65;
        const snBand = softEllipse(snRotX, sy, 30, 134, 19, 6.8, 2.5);

        // Crus Cerebri (Cerebral Peduncle — massive densely myelinated ventral fan)
        const pedRotX = axW - (sy - 128) * 0.65;
        const crusCerebri = softEllipse(pedRotX, sy, 38, 146, 23, 11.5, 3.0);

        // Medial, Spinal, & Lateral Lemniscus sweeping dorsolaterally in lateral tegmentum
        const wmML = softEllipse(axW, sy, isRostral ? 52 : 56, isRostral ? 104 : 100, 11, 7.5, 2.5);
        const wmLL = softEllipse(axW, sy, isRostral ? 62 : 58, isRostral ? 64 : 58, 7.5, 9.5, 2.5);
        const wmMLF = softEllipse(axW, sy, 6.5, 80, 3.2, 5.5, 1.2);

        let specialGM = 0, specialWM = 0;
        if (isRostral) {
          // Red Nucleus with dense myelinated capsule (dentatorubrothalamic fibers) + traversing CN III fascicles
          const dRN = Math.hypot(axW - 30, sy - 106);
          const rnCore = 1 - smoothstep(9.5, 12.0, dRN);
          const rnCapsule = (1 - smoothstep(11.5, 14.8, dRN)) * smoothstep(9.0, 11.8, dRN);
          // Internal trabeculae & CN III rootlets sweeping through medial Red Nucleus to interpeduncular fossa
          const cn3Fasc = softEllipse(axW - (sy - 74) * 0.08, sy, 6, 114, 2.5, 32, 1.2) * (0.6 + 0.4 * Math.sin(axW * 3.2));
          specialGM = rnCore * 0.88;
          specialWM = rnCapsule * 0.92 + cn3Fasc * 0.72;
        } else {
          // Massive Decussation of the Superior Cerebellar Peduncle (Wernekinck) at midline tegmentum
          const scpDec = softEllipse(axW, sy, 0, 106, 23, 11, 3.5);
          const crossWeave = 0.75 + 0.25 * Math.cos((x - 100) * 0.6 + (y - 106) * 0.6);
          specialWM = scpDec * crossWeave * 0.95;
        }

        const tegRet = softEllipse(axW, sy, 24, 94, 34, 24, 6.0);
        const gmTotal = clamp(pag * 0.84 + cnNuc * 0.88 + collCore * 0.80 + snBand * 0.90 + specialGM + tegRet * 0.42 * (1 - specialWM), 0, 1);
        const wmBoost = clamp(crusCerebri * 0.98 + wmML * 0.90 + wmLL * 0.88 + wmMLF * 0.90 + specialWM, 0, 1);

        myelin = clamp(0.84 - gmTotal * 0.78 + wmBoost * 0.58, 0.05, 0.98);
        gmNissl = clamp(gmTotal * (1 - wmBoost * 0.6) * 0.88, 0, 1);
      }

      const fineTex = fbm(x * 0.45, y * 0.45);
      const pialEdge = pialDist > -1.8 ? clamp((pialDist + 1.8) / 2.2, 0, 1) : 0;
      const { wR, wG, wB, mR, mG, mB, lR, lG, lB } = colorizeHistology(myelin, gmNissl, csf, pialEdge, fineTex);

      const idx = (py * W + px) * 4;
      weigertBuf[idx] = wR; weigertBuf[idx + 1] = wG; weigertBuf[idx + 2] = wB; weigertBuf[idx + 3] = alpha;
      mriBuf[idx] = mR; mriBuf[idx + 1] = mG; mriBuf[idx + 2] = mB; mriBuf[idx + 3] = alpha;
      lfbBuf[idx] = lR; lfbBuf[idx + 1] = lG; lfbBuf[idx + 2] = lB; lfbBuf[idx + 3] = alpha;
    }
  }

  fs.writeFileSync(`assets/slices/${key}_weigert.png`, encodePNG(W, H, weigertBuf));
  fs.writeFileSync(`assets/slices/${key}_mri.png`, encodePNG(W, H, mriBuf));
  fs.writeFileSync(`assets/slices/${key}_lfb.png`, encodePNG(W, H, lfbBuf));
  console.log(`Rendered 800x800 SVG-registered histology & MRI slice for [${key}]`);
}

// ============================================================================
// PART 2: Real 0.5mm ICBM152 + Sub-Millimeter Histological Forebrain & Cerebellum
// ============================================================================
const icbm = zlib.gunzipSync(fs.readFileSync('assets/meshes/ICBM2009sym.nii.gz'));
const nx = icbm.readInt16LE(42);
const ny = icbm.readInt16LE(44);
const nz = icbm.readInt16LE(46);
const off = icbm.readFloatLE(108);
const sx0 = icbm.readFloatLE(292), dx0 = icbm.readFloatLE(280);
const sy0 = icbm.readFloatLE(308), dy0 = icbm.readFloatLE(300);
const sz0 = icbm.readFloatLE(324), dz0 = icbm.readFloatLE(320);

function cubicHermite(p0, p1, p2, p3, t) {
  const a = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3;
  const b = p0 - 2.5 * p1 + 2.0 * p2 - 0.5 * p3;
  const c = -0.5 * p0 + 0.5 * p2;
  return ((a * t + b) * t + c) * t + p1;
}

// Smooth Tricubic Catmull-Rom interpolation of 0.5mm ICBM2009sym volume (eliminates voxel stair-stepping)
function sampleIcbmTricubic(xMm, yMm, zMm) {
  const fi = (xMm - sx0) / dx0;
  const fj = (yMm - sy0) / dy0;
  const fk = (zMm - sz0) / dz0;
  const i0 = Math.floor(fi), j0 = Math.floor(fj), k0 = Math.floor(fk);
  if (i0 < 1 || i0 >= nx - 2 || j0 < 1 || j0 >= ny - 2 || k0 < 1 || k0 >= nz - 2) return 0;
  const tx = fi - i0, ty = fj - j0, tz = fk - k0;
  const at = (i, j, k) => icbm[off + i + j * nx + k * nx * ny];

  const sliceVals = [0, 0, 0, 0];
  for (let dk = -1; dk <= 2; dk++) {
    const rowVals = [0, 0, 0, 0];
    const kIdx = (k0 + dk) * nx * ny;
    for (let dj = -1; dj <= 2; dj++) {
      const base = off + (j0 + dj) * nx + kIdx;
      rowVals[dj + 1] = cubicHermite(
        icbm[base + i0 - 1], icbm[base + i0], icbm[base + i0 + 1], icbm[base + i0 + 2], tx
      );
    }
    sliceVals[dk + 1] = cubicHermite(rowVals[0], rowVals[1], rowVals[2], rowVals[3], ty);
  }
  return clamp(cubicHermite(sliceVals[0], sliceVals[1], sliceVals[2], sliceVals[3], tz), 0, 255);
}

// Render 1000x500 Coronal Forebrain Slice (th: Basal Ganglia, Internal Capsule, Thalamus, STN, SN, Optic Tract)
function renderCoronalThalamusHiRes() {
  const W = 1000, H = 500;
  const mriBuf = Buffer.alloc(W * H * 4);
  const weigertBuf = Buffer.alloc(W * H * 4);
  const lfbBuf = Buffer.alloc(W * H * 4);

  for (let py = 0; py < H; py++) {
    const svgY = (py / (H - 1)) * 200;
    const zMm = 72 - (py / (H - 1)) * 96; // +72mm to -24mm
    for (let px = 0; px < W; px++) {
      const svgX = (px / (W - 1)) * 400;
      const xMm = -72 + (px / (W - 1)) * 144; // -72mm to +72mm
      const yMm = -16;

      // Sample continuous tricubic ICBM152 T1w intensity + slight spatial Gaussian average for ultra-clean pial boundary
      const t1 = sampleIcbmTricubic(xMm, yMm, zMm);
      const t1Blur = 0.5 * t1 + 0.125 * (
        sampleIcbmTricubic(xMm - 0.6, yMm, zMm) +
        sampleIcbmTricubic(xMm + 0.6, yMm, zMm) +
        sampleIcbmTricubic(xMm, yMm, zMm - 0.6) +
        sampleIcbmTricubic(xMm, yMm, zMm + 0.6)
      );

      if (t1Blur < 24) continue;
      const alpha = Math.round(smoothstep(24, 42, t1Blur) * 255);
      if (alpha === 0) continue;

      // Continuous CSF / Gray Matter / White Matter separation directly from smooth T1w intensity (NO blocky integer mask!)
      const csf = 1 - smoothstep(32, 68, t1);
      // In ICBM2009sym: gray matter is ~115-158, white matter is ~168-225
      let myelin = smoothstep(122, 198, t1) * (1 - csf);
      let gmNissl = smoothstep(80, 148, t1) * (1 - smoothstep(155, 192, t1)) * (1 - csf);

      // Enhance sub-millimeter histological laminae so Basal Ganglia & Thalamic subdivisions are crystal clear:
      // 1. Internal Medullary Lamina of Thalamus (Y-shaped white matter sheet separating ANT, MD, and VL/VPL/VPM)
      const axSvg = Math.abs(svgX - 200);
      const imlStem = softEllipse(axSvg - (svgY - 120) * 0.25, svgY, 24, 134, 1.4, 16, 1.0);
      const imlFork = softEllipse(axSvg + (svgY - 118) * 0.7, svgY, 20, 120, 1.4, 8, 1.0);
      // 2. External & Internal Medullary Laminae of Globus Pallidus (separating Putamen / GPe / GPi)
      const gpLamina1 = softEllipse(axSvg + (svgY - 145) * 0.45, svgY, 70, 146, 1.2, 16, 0.9);
      const gpLamina2 = softEllipse(axSvg + (svgY - 150) * 0.45, svgY, 59, 152, 1.1, 11, 0.9);
      // 3. Subthalamic Nucleus (STN) & Substantia Nigra (SN) & Red Nucleus / LGN / MGN cellular definition
      const stnNuc = softEllipse(axSvg, svgY, 30, 166, 8.5, 5.0, 2.0);
      const snNuc = softEllipse(axSvg, svgY, 28, 178, 12.0, 5.5, 2.0);
      const opticTract = softEllipse(axSvg, svgY, 44, 168, 7.0, 3.5, 1.5);

      myelin = clamp(myelin + (imlStem + imlFork + gpLamina1 + gpLamina2 + opticTract) * 0.35 - (stnNuc + snNuc) * 0.45, 0, 1);
      gmNissl = clamp(gmNissl + (stnNuc + snNuc) * 0.55, 0, 1);

      const fineTex = fbm(svgX * 0.4, svgY * 0.4);
      const pialEdge = t1Blur < 55 ? clamp((55 - t1Blur) / 30, 0, 1) * (1 - csf) : 0;
      const { wR, wG, wB, mR, mG, mB, lR, lG, lB } = colorizeHistology(myelin, gmNissl, csf, pialEdge, fineTex);

      const idx = (py * W + px) * 4;
      weigertBuf[idx] = wR; weigertBuf[idx + 1] = wG; weigertBuf[idx + 2] = wB; weigertBuf[idx + 3] = alpha;
      mriBuf[idx] = mR; mriBuf[idx + 1] = mG; mriBuf[idx + 2] = mB; mriBuf[idx + 3] = alpha;
      lfbBuf[idx] = lR; lfbBuf[idx + 1] = lG; lfbBuf[idx + 2] = lB; lfbBuf[idx + 3] = alpha;
    }
  }

  fs.writeFileSync('assets/slices/th_weigert.png', encodePNG(W, H, weigertBuf));
  fs.writeFileSync('assets/slices/th_mri.png', encodePNG(W, H, mriBuf));
  fs.writeFileSync('assets/slices/th_lfb.png', encodePNG(W, H, lfbBuf));
  console.log('Rendered 1000x500 tricubic Coronal Forebrain / Thalamus / Basal Ganglia slice [th]');
}

// Render 1000x500 Horizontal Cerebellum Slice (cbl: Folia, Arbor Vitae, Crumpled Dentate, Interposed & Fastigial Nuclei, Peduncles)
function renderAxialCerebellumHiRes() {
  const W = 1000, H = 500;
  const mriBuf = Buffer.alloc(W * H * 4);
  const weigertBuf = Buffer.alloc(W * H * 4);
  const lfbBuf = Buffer.alloc(W * H * 4);
  const zMm = -34;

  for (let py = 0; py < H; py++) {
    const svgY = (py / (H - 1)) * 200;
    const yMm = -24 - (py / (H - 1)) * 68; // -24mm (anterior peduncles) to -92mm (posterior folia)
    for (let px = 0; px < W; px++) {
      const svgX = (px / (W - 1)) * 400;
      const xMm = -64 + (px / (W - 1)) * 128; // -64mm to +64mm

      const t1 = sampleIcbmTricubic(xMm, yMm, zMm);
      // Restrict to cerebellum & peduncles posterior to yMm = -22 (smoothly masked using ONLY continuous tricubic T1 intensity — zero AllenAtlas hole artifacts!)
      const antFade = smoothstep(-21, -26, yMm + Math.abs(xMm) * 0.12);
      const effT1 = t1 * antFade;
      if (effT1 < 28) continue;
      const alpha = Math.round(smoothstep(28, 48, effT1) * 255);
      if (alpha === 0) continue;

      const csf = 1 - smoothstep(35, 72, t1);
      let myelin = smoothstep(125, 195, t1) * (1 - csf);
      let gmNissl = smoothstep(80, 145, t1) * (1 - smoothstep(155, 190, t1)) * (1 - csf);

      // Add high-resolution Cerebellar Folia (fine sub-millimeter horizontal/curved cortical leaf striations)
      // and the classic serrated/crumpled Dentate Nucleus ribbon + Globose, Emboliform & Fastigial nuclei!
      const axSvg = Math.abs(svgX - 200);
      const foliaWave = Math.sin((svgY - 0.0022 * axSvg * axSvg) * 0.95 + fbm(svgX * 0.08, svgY * 0.08) * 1.8);
      const inCortexRim = smoothstep(15, 55, axSvg) * (1 - smoothstep(130, 175, t1));
      if (inCortexRim > 0.05) {
        // Arbor vitae fine white matter branches alternating with granular/molecular cortical layers
        myelin = clamp(myelin + inCortexRim * foliaWave * 0.22, 0, 1);
        gmNissl = clamp(gmNissl + inCortexRim * (-foliaWave) * 0.25, 0, 1);
      }

      // Crumpled Dentate Nucleus Ribbon centered at (154, 82) and (246, 82) -> axSvg = 46, svgY = 82
      const dentateRibbon = evalCrenatedRibbon(axSvg, svgY, 46, 82, 13.0, 11.5, 10, 1.15, 1.35);

      // Emboliform (axSvg=28, y=82), Globose (axSvg=19, y=84), Fastigial (axSvg=9, y=84)
      const deepNuclei = dentateRibbon * 0.92
        + softEllipse(axSvg, svgY, 28, 82, 4.5, 6.0, 1.5) * 0.85
        + softEllipse(axSvg, svgY, 19, 84, 4.0, 4.5, 1.5) * 0.85
        + softEllipse(axSvg, svgY,  9, 84, 4.5, 4.5, 1.5) * 0.85;

      // White matter peduncles: MCP (axSvg=60, y=38), ICP (axSvg=36, y=46), SCP (axSvg=22, y=56)
      const pedWM = softEllipse(axSvg, svgY, 58, 40, 14, 15, 3.5)
        + softEllipse(axSvg, svgY, 36, 48, 9, 10, 2.5)
        + softEllipse(axSvg, svgY, 22, 56, 7, 9, 2.5);

      myelin = clamp(myelin * (1 - deepNuclei * 0.85) + pedWM * 0.45, 0.05, 0.98);
      gmNissl = clamp(gmNissl + deepNuclei * 0.85, 0, 1);

      const fineTex = fbm(svgX * 0.45, svgY * 0.45);
      const pialEdge = effT1 < 52 ? clamp((52 - effT1) / 24, 0, 1) * (1 - csf) : 0;
      const { wR, wG, wB, mR, mG, mB, lR, lG, lB } = colorizeHistology(myelin, gmNissl, csf, pialEdge, fineTex);

      const idx = (py * W + px) * 4;
      weigertBuf[idx] = wR; weigertBuf[idx + 1] = wG; weigertBuf[idx + 2] = wB; weigertBuf[idx + 3] = alpha;
      mriBuf[idx] = mR; mriBuf[idx + 1] = mG; mriBuf[idx + 2] = mB; mriBuf[idx + 3] = alpha;
      lfbBuf[idx] = lR; lfbBuf[idx + 1] = lG; lfbBuf[idx + 2] = lB; lfbBuf[idx + 3] = alpha;
    }
  }

  fs.writeFileSync('assets/slices/cbl_weigert.png', encodePNG(W, H, weigertBuf));
  fs.writeFileSync('assets/slices/cbl_mri.png', encodePNG(W, H, mriBuf));
  fs.writeFileSync('assets/slices/cbl_lfb.png', encodePNG(W, H, lfbBuf));
  console.log('Rendered 1000x500 tricubic Horizontal Cerebellum slice [cbl]');
}

// ============================================================================
// PART 3: High-Res 1000x500 Lateral Cerebral Cortex & Parasagittal Atlas (cx)
// Rendered directly from the 81,920-triangle BrainMesh_ICBM152.lh.mz3 mesh!
// ============================================================================
function renderLateralCortexMeshHiRes() {
  const mz3Raw = fs.readFileSync('assets/meshes/BrainMesh_ICBM152.lh.mz3');
  const buf = (mz3Raw[0] === 0x1f && mz3Raw[1] === 0x8b) ? zlib.gunzipSync(mz3Raw) : mz3Raw;
  const nface = buf.readUInt32LE(4);
  const nvert = buf.readUInt32LE(8);
  const nskip = buf.readUInt32LE(12);

  let offMz = 16 + nskip;
  const faces = new Uint32Array(nface * 3);
  for (let i = 0; i < nface * 3; i++) {
    faces[i] = buf.readUInt32LE(offMz);
    offMz += 4;
  }
  const verts = new Float32Array(nvert * 3);
  for (let i = 0; i < nvert * 3; i++) {
    verts[i] = buf.readFloatLE(offMz);
    offMz += 4;
  }

  // Compute smooth vertex normals in MNI space
  const norms = new Float32Array(nvert * 3);
  for (let f = 0; f < nface; f++) {
    const i0 = faces[f * 3], i1 = faces[f * 3 + 1], i2 = faces[f * 3 + 2];
    const ax = verts[i0 * 3], ay = verts[i0 * 3 + 1], az = verts[i0 * 3 + 2];
    const bx = verts[i1 * 3] - ax, by = verts[i1 * 3 + 1] - ay, bz = verts[i1 * 3 + 2] - az;
    const cx = verts[i2 * 3] - ax, cy = verts[i2 * 3 + 1] - ay, cz = verts[i2 * 3 + 2] - az;
    const nx = by * cz - bz * cy, ny = bz * cx - bx * cz, nz = bx * cy - by * cx;
    norms[i0 * 3] += nx; norms[i0 * 3 + 1] += ny; norms[i0 * 3 + 2] += nz;
    norms[i1 * 3] += nx; norms[i1 * 3 + 1] += ny; norms[i1 * 3 + 2] += nz;
    norms[i2 * 3] += nx; norms[i2 * 3 + 1] += ny; norms[i2 * 3 + 2] += nz;
  }
  for (let v = 0; v < nvert; v++) {
    const l = Math.hypot(norms[v * 3], norms[v * 3 + 1], norms[v * 3 + 2]) || 1;
    norms[v * 3] /= l; norms[v * 3 + 1] /= l; norms[v * 3 + 2] /= l;
  }

  // 2x2 Supersampled Z-buffer rasterizer (2000x1000 downsampled to 1000x500)
  // Maps MNI (yMm in [+74..-106], zMm in [+82..-48]) to SVG (400x200) -> Pixel (W x H)
  const W = 1000, H = 500;
  const SS = 2;
  const SW = W * SS, SH = H * SS;
  const zBuf = new Float32Array(SW * SH).fill(Infinity);
  const nxBuf = new Float32Array(SW * SH);
  const nyBuf = new Float32Array(SW * SH);
  const nzBuf = new Float32Array(SW * SH);
  const mniXBuf = new Float32Array(SW * SH);
  const mniYBuf = new Float32Array(SW * SH);
  const mniZBuf = new Float32Array(SW * SH);

  const mniToPx = (yMm, zMm) => [
    ((74 - yMm) / 180) * (SW * 0.90) + SW * 0.05,
    ((80 - zMm) / 128) * (SH * 0.90) + SH * 0.05
  ];

  for (let f = 0; f < nface; f++) {
    const i0 = faces[f * 3], i1 = faces[f * 3 + 1], i2 = faces[f * 3 + 2];
    const x0 = verts[i0 * 3], y0 = verts[i0 * 3 + 1], z0 = verts[i0 * 3 + 2];
    const x1 = verts[i1 * 3], y1 = verts[i1 * 3 + 1], z1 = verts[i1 * 3 + 2];
    const x2 = verts[i2 * 3], y2 = verts[i2 * 3 + 1], z2 = verts[i2 * 3 + 2];
    // Only lateral-facing hemisphere surface (xMm < -2)
    if (x0 > -1 && x1 > -1 && x2 > -1) continue;

    const [px0, py0] = mniToPx(y0, z0);
    const [px1, py1] = mniToPx(y1, z1);
    const [px2, py2] = mniToPx(y2, z2);

    const minX = Math.max(0, Math.floor(Math.min(px0, px1, px2)));
    const maxX = Math.min(SW - 1, Math.ceil(Math.max(px0, px1, px2)));
    const minY = Math.max(0, Math.floor(Math.min(py0, py1, py2)));
    const maxY = Math.min(SH - 1, Math.ceil(Math.max(py0, py1, py2)));

    const denom = (py1 - py2) * (px0 - px2) + (px2 - px1) * (py0 - py2);
    if (Math.abs(denom) < 1e-6) continue;

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const w0 = ((py1 - py2) * (px - px2) + (px2 - px1) * (py - py2)) / denom;
        const w1 = ((py2 - py0) * (px - px2) + (px0 - px2) * (py - py2)) / denom;
        const w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;

        // Lateral view looks from -X toward +X, so most negative xMm is closest to camera
        const depth = w0 * x0 + w1 * x1 + w2 * x2;
        const idx = py * SW + px;
        if (depth < zBuf[idx]) {
          zBuf[idx] = depth;
          nxBuf[idx] = w0 * norms[i0 * 3] + w1 * norms[i1 * 3] + w2 * norms[i2 * 3];
          nyBuf[idx] = w0 * norms[i0 * 3 + 1] + w1 * norms[i1 * 3 + 1] + w2 * norms[i2 * 3 + 1];
          nzBuf[idx] = w0 * norms[i0 * 3 + 2] + w1 * norms[i1 * 3 + 2] + w2 * norms[i2 * 3 + 2];
          mniXBuf[idx] = depth;
          mniYBuf[idx] = w0 * y0 + w1 * y1 + w2 * y2;
          mniZBuf[idx] = w0 * z0 + w1 * z1 + w2 * z2;
        }
      }
    }
  }

  // Downsample 2x2 with studio neuroimaging lighting & sulcal depth shading + subcortical white matter peel
  const mriBuf = Buffer.alloc(W * H * 4);
  const weigertBuf = Buffer.alloc(W * H * 4);
  const lfbBuf = Buffer.alloc(W * H * 4);

  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      let hits = 0;
      let sumW = [0, 0, 0], sumM = [0, 0, 0], sumL = [0, 0, 0];

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const sIdx = (py * SS + sy) * SW + (px * SS + sx);
          if (zBuf[sIdx] === Infinity) continue;
          hits++;

          let nx = nxBuf[sIdx], ny = nyBuf[sIdx], nz = nzBuf[sIdx];
          const nl = Math.hypot(nx, ny, nz) || 1;
          nx /= nl; ny /= nl; nz /= nl;

          // Studio lighting from anterosuperior-lateral (-0.75, 0.35, 0.56) + rim light
          const keyDot = Math.max(0, nx * -0.76 + ny * 0.32 + nz * 0.56);
          const fillDot = Math.max(0, nx * -0.45 - ny * 0.45 - nz * 0.35);
          // Sulcal depth / ambient occlusion: vertices facing away from -X or recessed inside sulci are darker
          const lateralFacing = clamp(-nx, 0, 1);
          const sulcalShade = Math.pow(lateralFacing, 0.65);

          // Sample subcortical tissue 5mm inward along vertex normal in ICBM2009sym for natural cortical/subcortical texture
          const vx = mniXBuf[sIdx] - nx * 4.5;
          const vy = mniYBuf[sIdx] - ny * 4.5;
          const vz = mniZBuf[sIdx] - nz * 4.5;
          const t1Sub = sampleIcbmTricubic(vx, vy, vz) / 255;

          const shade = clamp(0.26 + 0.58 * keyDot + 0.18 * fillDot, 0.12, 1.0) * (0.45 + 0.55 * sulcalShade) * (0.88 + 0.16 * t1Sub);
          const spec = Math.pow(Math.max(0, nx * -0.82 + ny * 0.25 + nz * 0.51), 18) * 0.18 * sulcalShade;

          // 1. MRI 3D-Shaded Cortical Surface
          const mInt = clamp(Math.round((32 + 212 * shade + spec * 255)), 18, 252);
          sumM[0] += mInt; sumM[1] += Math.round(mInt * 1.01); sumM[2] += Math.min(255, Math.round(mInt * 1.04));

          // 2. Weigert Stain (Warm golden-tan gyral crowns, deep iron-hematoxylin sulcal depths & subcortical myelinated fibers)
          const wT = clamp(shade + spec * 0.5, 0, 1);
          sumW[0] += Math.round(lerp(28, 238, wT));
          sumW[1] += Math.round(lerp(26, 202, wT));
          sumW[2] += Math.round(lerp(42, 148, wT));

          // 3. Luxol Fast Blue + Cresyl Violet (Orchid-violet gyral crowns, deep cobalt-blue sulcal depths & myelinated fibers)
          sumL[0] += Math.round(lerp(14, 218, wT));
          sumL[1] += Math.round(lerp(78, 172, wT));
          sumL[2] += Math.round(lerp(162, 228, wT));
        }
      }

      if (hits === 0) continue;
      const idx = (py * W + px) * 4;
      const alpha = Math.round((hits / (SS * SS)) * 255);

      weigertBuf[idx] = Math.round(sumW[0] / hits);
      weigertBuf[idx + 1] = Math.round(sumW[1] / hits);
      weigertBuf[idx + 2] = Math.round(sumW[2] / hits);
      weigertBuf[idx + 3] = alpha;

      mriBuf[idx] = Math.round(sumM[0] / hits);
      mriBuf[idx + 1] = Math.round(sumM[1] / hits);
      mriBuf[idx + 2] = Math.round(sumM[2] / hits);
      mriBuf[idx + 3] = alpha;

      lfbBuf[idx] = Math.round(sumL[0] / hits);
      lfbBuf[idx + 1] = Math.round(sumL[1] / hits);
      lfbBuf[idx + 2] = Math.round(sumL[2] / hits);
      lfbBuf[idx + 3] = alpha;
    }
  }

  fs.writeFileSync('assets/slices/cx_weigert.png', encodePNG(W, H, weigertBuf));
  fs.writeFileSync('assets/slices/cx_mri.png', encodePNG(W, H, mriBuf));
  fs.writeFileSync('assets/slices/cx_lfb.png', encodePNG(W, H, lfbBuf));
  console.log('Rendered 1000x500 supersampled ICBM152 3D-shaded Lateral Cortex slice [cx]');
}

['c', 'cm', 'mm', 'rm', 'cp', 'rp', 'cmb', 'rmb'].forEach(renderBrainstemHistologySlice);
renderCoronalThalamusHiRes();
renderAxialCerebellumHiRes();
renderLateralCortexMeshHiRes();
console.log('All 33 high-resolution slices generated successfully!');
