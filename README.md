# Neuraxis — Interactive Neuroanatomy & Tract Explorer

An interactive web-based 3D & 2D neuroanatomy atlas and pathway explorer covering ascending sensory tracts, descending motor tracts, cerebellar peduncles, deep nuclei, and cranial nerves (`CN I–XII`) across 11 canonical cross-sectional levels of the human central nervous system.

---

## ✨ Key Features & Enhancements

### 1. Interactive 3D Brain Explorer (`3D + 2D` Split View)
- **Real-Time 3D Surface Geometry (`brain3d.js`)**: Explore cortical hemispheres (`ICBM152`), cerebellum, and brainstem in 3D alongside the 2D schematic.
- **Interactive 3D Slice Planes & Tract Trajectories**: Click any of the 11 anatomical levels (`Lateral Cortex`, `Coronal Forebrain`, `Rostral Midbrain`, `Caudal Midbrain`, `Rostral Pons`, `Caudal Pons`, `Cerebellum`, `Rostral Medulla`, `Mid-Medulla`, `Caudal Medulla`, `Cervical Cord`) to highlight its exact cutting plane in 3D space, or click any tract/cranial nerve to trace its 3D course.
- **Camera & Opacity Controls**: Includes quick anatomical camera presets (`Lat`, `Ant`, `Sup`, `Med`), zoom controls (`−`, `+`, `Reset`), and an adjustable **3D Opacity** slider (`5%–100%`) to peer deep inside the brain.

### 2. Multi-Modal High-Resolution Cross-Sectional Slices
- **4 Viewing Modalities**: Seamlessly switch cross-sectional slices between:
  - **Vector Illustration**: Crisp anatomical vector contours with labeled landmarks.
  - **Weigert Stain**: Classical myelin-stained histological cross-sections (dark white-matter tracts, golden-tan grey matter).
  - **MRI (T1w)**: High-resolution T1-weighted structural MRI cross-sections.
  - **Luxol Fast Blue**: Histological myelin stain (deep cyan-blue myelinated tracts, violet-pink Nissl grey matter).
- **Anatomical Detail**: Detailed cortical sulci/gyri, basal ganglia (`Caudate`, `Putamen`, `Globus Pallidus`), internal capsule, thalamus, deep cerebellar nuclei (`Dentate`, `Interposed`, `Fastigial`), and brainstem/spinal grey & white matter.

### 3. Pathway Filtering, Focus Zoom & Decussation Visualization
- **Smart Slice Filtering**: Clicking a tract, structure, or cranial nerve automatically filters the cross-sectional slice grid to show only the levels where that structure is present.
- **Focus / Zoom (`⤢`)**: Click any slice card to inspect it at full scale while keeping sibling slices accessible in a bottom thumbnail strip.
- **Decussation Crossovers (`✕`)**: Visual crossover pathways and `✕` markers at the exact anatomical levels where tracts cross the midline (e.g., pyramidal decussation in Caudal Medulla, internal arcuate fibers, superior cerebellar peduncle decussation in Caudal Midbrain, and anterior white commissure in the Spinal Cord).
- **Directionality Indicators**: Animated `▲` (ascending sensory) and `▼` (descending motor) conduction indicators on both longitudinal pathways and cross-sections.

### 4. Dynamic `🎓 Quiz Me!` Game Mode
- **Customizable Quiz Setup**:
  - **Multiple Choice**: Identify the highlighted structure on a slice from 4 options.
  - **Type the Name**: Free-response input with smart neuroanatomy synonym and abbreviation matching (e.g., `CST`, `MLF`, `DCML`, `STT`, `ICP`, `MCP`, `SCP`, `VPL`, `LGN`, `MGN`, or Roman/Arabic cranial nerve numbers).
  - **Label the Slice**: Match and label every structure present on a cross-sectional slice from an interactive word bank.
- **Configurable Difficulty**: Choose which of the 11 anatomical slices to include, toggle ascending/descending (`▲`/`▼`) animations on or off, and review a full accuracy breakdown at the end with one-click jumps back into the atlas.

### 5. Modern, Customizable Workspace UI
- **Instant Search (`/` or `Ctrl+K`)**: Filter tracts, structures, and cranial nerves by name, abbreviation, or clinical function.
- **Click-and-Drag Resizable Panels**: Drag the borders of the left sidebar, 2D/3D explorer column, internal 3D/2D split, bottom info bar, or individual slice cards to customize your layout (double-click any border to reset).
- **Light & Dark Themes**: Full light/dark mode support across both the UI and the 3D WebGL viewport.
- **Built-In `?` User Guide**: Quick-reference modal explaining all tools, color codes, and controls.

---

## 🚀 Running Locally

Because the 3D viewer uses ES modules (`Three.js`), serve the folder with any static local server:

```bash
# Using Python
python -m http.server 8080

# Or using Node.js
npx serve .
```

Then open `http://localhost:8080` in your browser.
