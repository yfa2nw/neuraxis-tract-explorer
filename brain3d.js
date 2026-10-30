// brain3d.js — Real MNI152/ICBM152 3D Neuroanatomy Surface & Subcortical Atlas Explorer
// Loads real neuroimaging meshes (.mz3):
//   - BrainMesh_ICBM152.lh.mz3 (81,920-triangle pial cortical surface with real gyri/sulci + mirrored RH)
//   - bigbrain.mz3 (82,630-triangle BigBrain 22 subcortical nuclei: Thalamus, Caudate, Putamen, GPe, GPi, STN, SN, Red Nucleus, Amygdala, Hippocampus)
//   - atl-Anatom_space-MNI.mz3 (78,236-triangle cerebellar lobular & deep nuclei surface)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Coordinate transform from MNI152 (X=Right, Y=Anterior, Z=Superior in mm)
// to Three.js scene space (X=Right, Y=Superior, Z=Anterior, scaled by 0.042)
const SCALE = 0.042;
function mniToScene(xMm, yMm, zMm) {
  return new THREE.Vector3(xMm * SCALE, (zMm + 12) * SCALE, yMm * SCALE);
}

// All 12 anatomical levels mapped to real MNI152 stereotaxic coordinates
export const SLICE_3D_MAP = {
  cx:  { x: 0, yMm: -10, zMm:  46, rx: 2.75, rz: 3.30, tiltX:  0.00, label: 'Cerebral Cortex (Gyri & Sulci)' },
  th:  { x: 0, yMm: -16, zMm:   8, rx: 2.55, rz: 2.15, tiltX:  1.35, label: 'Thalamus, Basal Ganglia & Internal Capsule' },
  rmb: { x: 0, yMm: -22, zMm:  -8, rx: 0.92, rz: 0.85, tiltX: -0.18, label: 'Rostral Midbrain (Sup. Colliculus & Red Nucleus)' },
  cmb: { x: 0, yMm: -24, zMm: -14, rx: 0.88, rz: 0.82, tiltX: -0.18, label: 'Caudal Midbrain (Inf. Colliculus & SCP Decussation)' },
  rp:  { x: 0, yMm: -28, zMm: -24, rx: 1.05, rz: 0.96, tiltX: -0.15, label: 'Rostral Pons (Trigeminal Nuclei & Basis Pontis)' },
  cp:  { x: 0, yMm: -32, zMm: -35, rx: 1.12, rz: 1.02, tiltX: -0.14, label: 'Caudal Pons (Facial Colliculus & Trapezoid Body)' },
  cbl: { x: 0, yMm: -58, zMm: -34, rx: 2.25, rz: 1.45, tiltX:  0.00, label: 'Cerebellum (Cortex, Dentate & Peduncles)' },
  rm:  { x: 0, yMm: -39, zMm: -47, rx: 0.78, rz: 0.72, tiltX: -0.08, label: 'Rostral Medulla (Inferior Olive & 4th Ventricle)' },
  mm:  { x: 0, yMm: -41, zMm: -55, rx: 0.68, rz: 0.64, tiltX: -0.05, label: 'Mid Medulla (Sensory Decussation / Internal Arcuate)' },
  cm:  { x: 0, yMm: -43, zMm: -63, rx: 0.62, rz: 0.58, tiltX: -0.03, label: 'Caudal Medulla (Pyramidal Motor Decussation)' },
  c:   { x: 0, yMm: -45, zMm: -76, rx: 0.56, rz: 0.50, tiltX:  0.00, label: 'Cervical Spinal Cord' },
  // Schematic position below the cervical plane (matches the 'cs' route node); the real lumbar cord lies far lower
  lum: { x: 0, yMm: -46, zMm: -88, rx: 0.52, rz: 0.46, tiltX:  0.00, label: 'Lumbar Spinal Cord' }
};

// Longitudinal schematic nodes mapped to MNI (yMm, zMm, xSpreadMm)
const NODE_MNI = {
  cx:  { y: -12, z:  54, spread: 28 },
  olf: { y:  18, z: -16, spread: 14 },
  bg:  { y:   2, z:   6, spread: 24 },
  th:  { y: -18, z:   8, spread: 14 },
  rmb: { y: -20, z:  -8, spread:  7 },
  mb:  { y: -22, z: -11, spread:  7 },
  cmb: { y: -24, z: -14, spread:  7 },
  rp:  { y: -27, z: -24, spread:  8 },
  po:  { y: -29, z: -29, spread:  9 },
  cp:  { y: -32, z: -35, spread:  9 },
  cb:  { y: -56, z: -34, spread: 22 },
  rm:  { y: -39, z: -47, spread:  6 },
  mm:  { y: -41, z: -55, spread:  5 },
  cm:  { y: -43, z: -63, spread:  4.5 },
  cd:  { y: -45, z: -74, spread:  4 },
  cs:  { y: -46, z: -88, spread:  3.8 }
};

// Exact MNI152 3D stereotaxic trajectories for all 12 Cranial Nerves (CN I - CN XII)
const CN_3D_MNI = {
  // CN I: Olfactory bulb on cribriform plate -> olfactory tract in orbital sulcus -> piriform cortex / uncus (basal forebrain, NOT dorsal cortex!)
  cn1: [
    [[-9, 42, -16], [-10, 26, -16], [-13, 12, -17], [-22, 2, -20]]
  ],
  // CN II: Optic nerve from orbit -> optic chiasm -> optic tract around cerebral peduncle -> Lateral Geniculate Nucleus (LGN)
  cn2: [
    [[-18, 30, -16], [-6, 12, -15], [0, 4, -14], [-14, -8, -11], [-23, -22, -6]]
  ],
  // CN III: Oculomotor & Edinger-Westphal nuclei (rostral midbrain) -> through red nucleus -> interpeduncular fossa -> superior orbital fissure
  cn3: [
    [[-3, -22, -8], [-5, -16, -9], [-6, -10, -11], [-12, 8, -12]]
  ],
  // CN IV: Trochlear nucleus (caudal midbrain) -> dorsal decussation in superior medullary velum -> wraps around lateral midbrain -> anteriorly
  cn4: [
    [[3, -25, -14], [0, -29, -15], [-14, -24, -15], [-16, -12, -14], [-13, 6, -13]]
  ],
  // CN V: Trigeminal ganglion / lateral mid-pons root -> principal & motor nuclei -> descending spinal trigeminal tract to upper cervical cord
  cn5: [
    [[-22, -14, -26], [-15, -24, -26], [-11, -28, -25], [-10, -34, -35], [-9, -39, -47], [-7, -43, -64]]
  ],
  // CN VI: Abducens nucleus (facial colliculus of caudal pons) -> ventromedially through pons -> exits pontomedullary sulcus
  cn6: [
    [[-4, -35, -34], [-5, -26, -36], [-6, -16, -38], [-9, -2, -32]]
  ],
  // CN VII: Facial motor nucleus -> loops dorsomedially over abducens nucleus (internal genu) -> exits laterally at cerebellopontine angle
  cn7: [
    [[-9, -31, -35], [-4, -36, -34], [-12, -33, -36], [-21, -25, -36]]
  ],
  // CN VIII: Internal acoustic meatus / cerebellopontine angle -> Cochlear & Vestibular nuclei at dorsolateral pontomedullary junction
  cn8: [
    [[-25, -27, -36], [-17, -33, -36], [-12, -36, -35], [-10, -39, -45]]
  ],
  // CN IX: Solitary / Inf. Salivatory / Ambiguus nuclei in rostral medulla -> exits postolivary sulcus laterally to jugular foramen
  cn9: [
    [[-6, -39, -46], [-10, -38, -47], [-18, -33, -47]]
  ],
  // CN X: Dorsal motor nucleus of X & Nucleus ambiguus in mid/rostral medulla -> exits postolivary sulcus laterally
  cn10: [
    [[-5, -41, -53], [-10, -39, -53], [-18, -35, -53]]
  ],
  // CN XI: Spinal accessory nucleus in lateral ventral horn (C1-C5) -> ascends laterally through foramen magnum -> exits jugular foramen
  cn11: [
    [[-5, -45, -76], [-9, -44, -68], [-11, -42, -58], [-18, -36, -50]]
  ],
  // CN XII: Hypoglossal nucleus near midline floor of 4th ventricle -> courses ventrally between pyramid and olive -> exits preolivary sulcus
  cn12: [
    [[-3, -41, -54], [-5, -37, -54], [-7, -31, -55], [-10, -22, -55]]
  ]
};

// Binary .mz3 parser
async function loadMZ3Geometry(url, mirrorX = false) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}`);
  let arrayBuf = await resp.arrayBuffer();
  const bytes = new Uint8Array(arrayBuf);

  if (bytes[0] === 0x1f && bytes[1] === 0x8b && typeof DecompressionStream !== 'undefined') {
    const ds = new DecompressionStream('gzip');
    const decompressedStream = new Response(bytes).body.pipeThrough(ds);
    arrayBuf = await new Response(decompressedStream).arrayBuffer();
  }

  const dv = new DataView(arrayBuf);
  const magic = dv.getUint16(0, true);
  if (magic !== 23117) throw new Error(`Invalid MZ3 magic ${magic} in ${url}`);
  const attr = dv.getUint16(2, true);
  const nface = dv.getUint32(4, true);
  const nvert = dv.getUint32(8, true);
  const nskip = dv.getUint32(12, true);

  const isFace = (attr & 1) !== 0;
  const isVert = (attr & 2) !== 0;
  const isRgba = (attr & 4) !== 0;

  let offset = 16 + nskip;
  const indices = new Uint32Array(nface * 3);
  if (isFace) {
    for (let i = 0; i < nface; i++) {
      const a = dv.getUint32(offset, true);
      const b = dv.getUint32(offset + 4, true);
      const c = dv.getUint32(offset + 8, true);
      if (mirrorX) {
        indices[i * 3] = a;
        indices[i * 3 + 1] = c;
        indices[i * 3 + 2] = b;
      } else {
        indices[i * 3] = a;
        indices[i * 3 + 1] = b;
        indices[i * 3 + 2] = c;
      }
      offset += 12;
    }
  }

  const positions = new Float32Array(nvert * 3);
  if (isVert) {
    const signX = mirrorX ? -1 : 1;
    for (let i = 0; i < nvert; i++) {
      const xMm = dv.getFloat32(offset, true) * signX;
      const yMm = dv.getFloat32(offset + 4, true);
      const zMm = dv.getFloat32(offset + 8, true);
      positions[i * 3] = xMm * SCALE;
      positions[i * 3 + 1] = (zMm + 12) * SCALE;
      positions[i * 3 + 2] = yMm * SCALE;
      offset += 12;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));

  if (isRgba) {
    const colors = new Float32Array(nvert * 3);
    for (let i = 0; i < nvert; i++) {
      colors[i * 3] = dv.getUint8(offset) / 255;
      colors[i * 3 + 1] = dv.getUint8(offset + 1) / 255;
      colors[i * 3 + 2] = dv.getUint8(offset + 2) / 255;
      offset += 4;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }

  geo.computeVertexNormals();
  return geo;
}

export function initBrain3D({ canvas, onSelectSlice }) {
  if (!canvas) return null;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 150);
  camera.position.set(8.2, 2.6, 10.8);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, -0.35, -0.8);
  controls.minDistance = 2.0;
  controls.maxDistance = 45.0; // Allow zooming way out

  // Studio Neuroimaging Lighting
  const hemiLight = new THREE.HemisphereLight(0xfff8f0, 0x384868, 1.05);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff5e8, 1.35);
  keyLight.position.set(7, 12, 9);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x7aa8ff, 0.85);
  rimLight.position.set(-8, -5, -8);
  scene.add(rimLight);

  const brainGroup = new THREE.Group();
  scene.add(brainGroup);

  // Materials for real meshes (controlled via setOpacity)
  const cortexMatLH = new THREE.MeshPhysicalMaterial({
    color: 0xe2c2aa,
    roughness: 0.42,
    metalness: 0.04,
    transparent: true,
    opacity: 0.38,
    clearcoat: 0.15,
    depthWrite: false,
    side: THREE.FrontSide
  });

  const cortexMatRH = new THREE.MeshPhysicalMaterial({
    color: 0xe2c2aa,
    roughness: 0.42,
    metalness: 0.04,
    transparent: true,
    opacity: 0.24,
    clearcoat: 0.15,
    depthWrite: false,
    side: THREE.FrontSide
  });

  const subcorticalMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.35,
    metalness: 0.08,
    transparent: true,
    opacity: 0.76
  });

  const cerebellumMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.48,
    metalness: 0.04,
    transparent: true,
    opacity: 0.48,
    depthWrite: false
  });

  const stemMat = new THREE.MeshPhysicalMaterial({
    color: 0xe6d4bc,
    roughness: 0.38,
    transparent: true,
    opacity: 0.58,
    depthWrite: false
  });

  function setOpacity(val) {
    const v = Math.max(0.05, Math.min(1.0, parseFloat(val) || 0.5));
    cortexMatLH.opacity = Math.min(0.96, v * 0.76);
    cortexMatRH.opacity = Math.min(0.92, v * 0.50);
    cerebellumMat.opacity = Math.min(0.96, v * 0.88);
    stemMat.opacity = Math.min(0.96, v * 0.95);
    subcorticalMat.opacity = Math.min(1.0, 0.25 + v * 0.75);
    cortexMatLH.depthWrite = v > 0.85;
  }

  function zoomBy(factor) {
    const offset = camera.position.clone().sub(controls.target);
    const newLen = Math.max(controls.minDistance, Math.min(controls.maxDistance, offset.length() * factor));
    offset.setLength(newLen);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  }

  // Load the real MNI152 / BigBrain / SUIT Cerebellar meshes asynchronously
  (async () => {
    try {
      const [lhGeo, rhGeo, bigBrainGeo, cblGeo] = await Promise.all([
        loadMZ3Geometry('./assets/meshes/BrainMesh_ICBM152.lh.mz3', false),
        loadMZ3Geometry('./assets/meshes/BrainMesh_ICBM152.lh.mz3', true),
        loadMZ3Geometry('./assets/meshes/bigbrain.mz3', false),
        loadMZ3Geometry('./assets/meshes/atl-Anatom_space-MNI.mz3', false)
      ]);

      brainGroup.add(new THREE.Mesh(lhGeo, cortexMatLH));
      brainGroup.add(new THREE.Mesh(rhGeo, cortexMatRH));
      brainGroup.add(new THREE.Mesh(bigBrainGeo, subcorticalMat));
      brainGroup.add(new THREE.Mesh(cblGeo, cerebellumMat));
    } catch (e) {
      console.warn('Error loading MZ3 meshes:', e);
    }
  })();

  // Anatomically contoured MNI-space Brainstem + Cervical/Lumbar Spinal Cord continuity mesh
  const stemProfileMNI = [
    { zMm:  -4, yMm: -20, rxMm: 14, ryMm: 12 },
    { zMm: -10, yMm: -22, rxMm: 16, ryMm: 14 },
    { zMm: -16, yMm: -24, rxMm: 15, ryMm: 13 },
    { zMm: -24, yMm: -27, rxMm: 18, ryMm: 17 },
    { zMm: -35, yMm: -31, rxMm: 19, ryMm: 17 },
    { zMm: -43, yMm: -37, rxMm: 13, ryMm: 12 },
    { zMm: -49, yMm: -39, rxMm: 12, ryMm: 11 },
    { zMm: -57, yMm: -41, rxMm: 10, ryMm: 9.5 },
    { zMm: -65, yMm: -43, rxMm: 8.5, ryMm: 8.0 },
    { zMm: -76, yMm: -45, rxMm: 7.5, ryMm: 6.5 },
    { zMm: -92, yMm: -46, rxMm: 6.5, ryMm: 5.8 }
  ];

  const segs = 32;
  const sVerts = [];
  const sIdx = [];
  stemProfileMNI.forEach(lv => {
    for (let j = 0; j <= segs; j++) {
      const a = (j / segs) * Math.PI * 2;
      const xMm = Math.cos(a) * lv.rxMm;
      const yMm = lv.yMm + Math.sin(a) * lv.ryMm;
      const v = mniToScene(xMm, yMm, lv.zMm);
      sVerts.push(v.x, v.y, v.z);
    }
  });
  for (let r = 0; r < stemProfileMNI.length - 1; r++) {
    for (let j = 0; j < segs; j++) {
      const a = r * (segs + 1) + j;
      const b = a + segs + 1;
      sIdx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const stemGeo = new THREE.BufferGeometry();
  stemGeo.setAttribute('position', new THREE.Float32BufferAttribute(sVerts, 3));
  stemGeo.setIndex(sIdx);
  stemGeo.computeVertexNormals();
  brainGroup.add(new THREE.Mesh(stemGeo, stemMat));

  // Interactive 3D Slice Cutting Planes in MNI space
  const slicePlanes = {};
  const clickableMeshes = [];

  Object.entries(SLICE_3D_MAP).forEach(([key, cfg]) => {
    const group = new THREE.Group();
    const pos = mniToScene(cfg.x || 0, cfg.yMm, cfg.zMm);
    group.position.copy(pos);
    group.rotation.x = cfg.tiltX || 0;

    const discGeo = new THREE.CircleGeometry(1, 44);
    discGeo.rotateX(-Math.PI / 2);
    discGeo.scale(cfg.rx, 1, cfg.rz);

    const discMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.userData = { sliceKey: key };
    clickableMeshes.push(disc);
    group.add(disc);

    const pts = [];
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * cfg.rx, 0, Math.sin(a) * cfg.rz));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.50
    });
    const ring = new THREE.Line(ringGeo, ringMat);
    group.add(ring);

    brainGroup.add(group);
    slicePlanes[key] = { group, disc, ring, discMat, ringMat, cfg };
  });

  // 3D Tract Pathway Tubes + Conduction Beads
  const tractGroup = new THREE.Group();
  brainGroup.add(tractGroup);
  let activePulseSpheres = [];

  function parseTract3DPoints(tract) {
    // Use exact stereotaxic MNI coordinates for Cranial Nerves I - XII
    if (CN_3D_MNI[tract.id]) {
      return CN_3D_MNI[tract.id].map(chain => chain.map(([x, y, z]) => mniToScene(x, y, z)));
    }
    return tract.p.split('|').map(seg => {
      return seg.trim().split(/\s+/).map(tok => {
        const [side, lv] = tok.split(':');
        const m = NODE_MNI[lv] || { y: -30, z: -30, spread: 8 };
        let xMm = 0;
        let yMm = m.y;
        if (side === 'L') xMm = -m.spread;
        else if (side === 'R') xMm = m.spread;
        else if (side === 'E') { xMm = -22; yMm = -56; }
        else if (side === 'O') { xMm = -24; yMm = m.y + 16; }
        return mniToScene(xMm, yMm, m.z);
      });
    });
  }

  function setTractPathway(tract) {
    while (tractGroup.children.length) {
      const ch = tractGroup.children[0];
      if (ch.geometry) ch.geometry.dispose();
      if (ch.material) ch.material.dispose();
      tractGroup.remove(ch);
    }
    activePulseSpheres = [];
    if (!tract || !tract.p) return;

    const col = new THREE.Color(tract.col || '#3b82f6');
    const polylines = parseTract3DPoints(tract);

    polylines.forEach(pts => {
      if (pts.length < 2) return;
      const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.35);
      const tubeGeo = new THREE.TubeGeometry(curve, Math.max(28, pts.length * 12), 0.058, 12, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.55,
        roughness: 0.2
      });
      tractGroup.add(new THREE.Mesh(tubeGeo, tubeMat));

      const beadGeo = new THREE.SphereGeometry(0.10, 14, 14);
      const beadMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const bead = new THREE.Mesh(beadGeo, beadMat);
      tractGroup.add(bead);
      activePulseSpheres.push({ bead, curve });
    });
  }

  let activeSliceKey = 'c';
  function setActiveSlice(key) {
    if (!SLICE_3D_MAP[key]) return;
    activeSliceKey = key;
    Object.entries(slicePlanes).forEach(([k, obj]) => {
      const isAct = k === key;
      obj.discMat.color.setHex(isAct ? 0xef4444 : 0x3b82f6);
      obj.discMat.opacity = isAct ? 0.50 : 0.08;
      obj.ringMat.color.setHex(isAct ? 0xef4444 : 0x3b82f6);
      obj.ringMat.opacity = isAct ? 1.0 : 0.40;
      obj.group.scale.setScalar(isAct ? 1.06 : 1.0);
    });
    const hud = document.getElementById('hud-slice-label');
    if (hud) hud.textContent = `Slice: ${SLICE_3D_MAP[key].label}`;
  }

  function highlightTractSlices(sliceSet) {
    Object.entries(slicePlanes).forEach(([k, obj]) => {
      const isAct = k === activeSliceKey;
      const inTract = sliceSet && sliceSet.has(k);
      if (isAct) {
        obj.discMat.color.setHex(0xef4444);
        obj.discMat.opacity = 0.52;
        obj.ringMat.color.setHex(0xef4444);
        obj.ringMat.opacity = 1.0;
      } else if (inTract) {
        obj.discMat.color.setHex(0x0284c7);
        obj.discMat.opacity = 0.28;
        obj.ringMat.color.setHex(0x0284c7);
        obj.ringMat.opacity = 0.88;
      } else {
        obj.discMat.color.setHex(0x3b82f6);
        obj.discMat.opacity = sliceSet && sliceSet.size ? 0.03 : 0.08;
        obj.ringMat.color.setHex(0x3b82f6);
        obj.ringMat.opacity = sliceSet && sliceSet.size ? 0.16 : 0.40;
      }
    });
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downPos = { x: 0, y: 0 };

  canvas.addEventListener('pointerdown', e => { downPos = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', e => {
    if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 5) return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickableMeshes, false);
    if (hits.length > 0) {
      const k = hits[0].object.userData.sliceKey;
      if (k) {
        setActiveSlice(k);
        if (onSelectSlice) onSelectSlice(k);
      }
    }
  });

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth, h = parent.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();

  function resetCamera() {
    camera.position.set(8.2, 2.6, 10.8);
    controls.target.set(0, -0.35, -0.8);
    controls.update();
  }

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    activePulseSpheres.forEach(item => {
      const u = (t * 0.42) % 1;
      item.bead.position.copy(item.curve.getPointAt(u));
    });
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return {
    setActiveSlice,
    setTractPathway,
    highlightTractSlices,
    setOpacity,
    zoomBy,
    resetCamera,
    resize
  };
}
