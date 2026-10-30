# Neuraxis Tract Explorer

An interactive, single-page atlas of the central nervous system's tracts, nuclei and cranial nerves, built for studying neuroanatomy. Pick a pathway and see where it starts, which way it conducts, where it crosses the midline, where it ends, and what happens clinically when it is damaged, across 12 cross-sections from the cerebral cortex to the lumbar cord. A lesion mode covers 20 spinal cord, brainstem and cerebral stroke syndromes, and a quiz tests identification, clinical localisation and function.

> **Educational use only.** This is a study aid, not medical advice. Tract positions are schematic, lesion overlays are simplified teaching models, and the stain and MRI views are illustrations. Check everything against your own references. See [Limitations](#limitations).

## Contents

- [Features](#features)
- [Getting started](#getting-started)
- [Using the explorer](#using-the-explorer)
- [Project structure](#project-structure)
- [Adding content](#adding-content)
- [Testing](#testing)
- [Limitations](#limitations)
- [Known issues and ideas](#known-issues-and-ideas)
- [License](#license)

## Features

- **12 cross-sections**, cortex to cord: cerebral cortex (lateral view), thalamus and basal ganglia (coronal), rostral and caudal midbrain, rostral and caudal pons, cerebellum (horizontal), rostral, mid and caudal medulla, and cervical and lumbar spinal cord.
- **37 pathways:** ascending, descending and bidirectional tracts, cerebellar pathways and all 12 cranial nerves, plus 37 brain structures (cortical areas, thalamic nuclei, basal ganglia, cerebellar zones, nuclei and peduncles).
- **Description panel** for every pathway: origin, course, decussation, termination, function and clinical correlates. Every structure has a description covering location, connections, function, blood supply and lesion effects.
- **Direction and crossing:** animated ▲/▼ arrows, dashed decussation paths with ✕ markers, and a side badge on each slice (ipsilateral, contralateral or crossing).
- **2D schematic** of the whole neuraxis showing the selected tract's start, crossings and end, with a route card summarising each step.
- **3D brain** with real neuroimaging meshes, clickable slice planes and the selected tract drawn as a tube.
- **20 lesion syndromes:**
  - **Spinal cord:** central cord, anterior cord, posterior cord, Brown-Séquard.
  - **Midbrain:** Weber, Benedikt, Claude.
  - **Pons:** ventromedial (Raymond), ventral (Millard-Gubler), Foville, lateral pontine (AICA), locked-in.
  - **Medulla:** lateral medullary (Wallenberg), medial medullary (Dejerine).
  - **Cerebral:** ACA, MCA (dominant and non-dominant), PCA, MCA/ACA and MCA/PCA watershed.
  - Each entry gives cause, blood supply, affected structures, motor, sensory and other signs, bedside tests, imaging and alternative names.
- **Quiz** with eight formats: identify structures (multiple choice, typed, label the slice), name a lesion from symptoms or shading, match a lesion to its presentation, and link structures to functions.
- **Slice modes** (Vector, Weigert, MRI, Luxol), laterality modes, resizable panels, light and dark themes.

## Getting started

The page uses ES modules and loads three.js from a CDN through an import map, so it must be **served over HTTP** and needs an **internet connection**. Opening `index.html` as a `file://` URL will not work.

```bash
# from the project folder
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

Any static file server works (for example `npx serve`). There is no build step and no package to install.

Requirements: a recent desktop browser (Chrome, Edge, Firefox or Safari) with WebGL for the 3D view. The layout uses modern CSS (`color-mix()`, `:has()`, subgrid).

## Using the explorer

### Layout

| Column | What it holds |
| --- | --- |
| **Left** | Search box, category chips, level filter, and the list of pathways, lesion syndromes and brain structures |
| **Middle** | The 3D brain and the 2D schematic (switch with **3D + 2D**, **3D Brain**, **2D Schematic**) |
| **Right** | The info panel for the selected item, then the grid of cross-sections |

The **?** button in the top bar opens a quick-start guide.

### Selecting items

| Action | Result |
| --- | --- |
| Point at an item (nothing pinned) | Previews it: highlights it everywhere and shows its description |
| Click an item | Pins it; other items stop previewing |
| Click a structure on a slice | Pins that structure's pathway |
| **Unpin ✕**, `Esc`, or click the pinned item again | Back to preview mode |
| Click a pill in the info panel or route card | Jumps to that tract, structure or lesion |

While an item is pinned, **Active Slices Only** hides the levels it does not reach (**Show All 12 Slices** brings them back), and **← Prev Slice / Next Slice →** steps along it.

### Finding things

- Press `/` and type a name, abbreviation, sub-nucleus or syndrome: *Wallenberg*, *INO*, *nucleus ambiguus*, *Gerstmann*, *Percheron*. Search covers descriptions and alternative names too.
- **Chips** narrow the list: Sensory, Motor, Cerebellar, Cranial nerves, Lesions.
- **Level menu** lists only what passes through one level.
- Filters fade non-matching items only while nothing is pinned.

### Reading a cross-section

- Dorsal (posterior) is at the top, ventral (anterior) at the bottom. Labels for every structure run down the right side.
- **▲** ascending, **▼** descending, **⇅** both directions.
- A dashed line marks a decussation. Every slice shows its crossings as faint lines; the selected tract's crossing is drawn brightly with a **✕**.
- The left half is the reference (ipsilateral) side, the right half the contralateral side. **Pathway Side** highlights the side a tract occupies at each level; **Bilateral** lights both.
- **⤢ Spotlight** (or a slice title) enlarges a slice across the top of the grid.
- **Slice Mode** swaps the vector drawing for a Weigert (myelin), MRI (T1-weighted) or Luxol blue rendering, with the structures overlaid.

### Lesions and strokes

Open the **Lesions** chip or the **Spinal cord lesions**, **Cerebral strokes** and **Brainstem strokes** groups.

- The shaded area is the lesion (or arterial territory). Structures in **red** are damaged and **amber** ones may be partly affected; the rest are dimmed.
- For a one-sided lesion, **Left half / Right half** flips the side.
- The info panel lists cause, blood supply, affected structures, motor, sensory and other signs, **How to check** (bedside tests), imaging, alternative names, and the involved tracts as clickable pills.

### The 2D schematic

The schematic is a vertical map of the neuraxis, with the level names in the left margin, a left (ipsilateral) and right (contralateral) column, and a dashed midline.

- The selected tract is drawn as an animated line with a filled **start** marker, a ringed **end** marker, and a **✕** at each crossing (hover it to see which decussation).
- Levels the tract passes through turn bold.
- The **route card** underneath gives the start, crossing and end in one line each, with level tags, plus the full route (e.g. *Cortex → Midbrain → Pons → … → Lumbar cord*).
- Click a level block to jump to that slice. The red block marks a selected lesion's level.

### The 3D brain

#### Navigating

| Input | Action |
| --- | --- |
| Left-drag (one finger on touch) | Rotate around the brain |
| Right-drag (two fingers on touch) | Pan |
| Scroll wheel, pinch, or **− / +** | Zoom |
| **Reset** | Return to the starting view |
| Click a slice disc | Jump to that cross-section |
| **3D Opacity** slider | Fade the cortex to see the deep nuclei, brainstem and tract tubes |
| Drag the bar between 3D and 2D | Share the column between them (double-click to reset) |

#### What it shows

- **Meshes:** the ICBM152 cortical surface (left hemisphere, mirrored to make the right), BigBrain subcortical nuclei and a cerebellar atlas. The brainstem and cord are a smooth tube.
- **Slice discs:** 12 discs mark the cross-section levels. The active slice is red, and the levels a pinned tract passes through are blue.
- **Selected tract:** drawn as a tube with a bead travelling from its start to its end. Cranial nerves follow hand-placed trajectories; other tracts are interpolated between the schematic's level points.
- **Label:** the current slice name appears in the lower left.

### Quiz

Click **🎓 Quiz Me!**, choose a format, a number of questions and the slices to draw from, then **Start Quiz**.

| Group | Format | You see | You answer |
| --- | --- | --- | --- |
| Identify on a slice | Multiple Choice | A highlighted structure | Pick its name from 4 (or press `1`–`4`) |
| | Type the Name | A highlighted structure | Type its name or abbreviation |
| | Label the Slice | Up to 8 numbered structures | Match each name to its structure |
| Clinical lesions | Lesion from Symptoms | A patient presentation | Type the syndrome |
| | Lesion from Shading | A shaded lesion on its slice | Type the syndrome |
| | Symptoms of a Lesion | A syndrome name | Pick its presentation from 4 |
| Function | Structure from Function | A function | Pick the tract or structure from 4 |
| | Function of a Structure | A tract or structure | Pick its function from 4 |

- **Typed answers:**
  - **Allowed:** small typos, abbreviations (`LCST`, `VPL`, `CN III`), and eponym, descriptive or artery names for lesions (*Wallenberg*, *lateral medullary*, *PICA*).
  - **Not enough on its own:** a single generic word such as "lateral".
  - **MCA strokes:** you must say dominant or non-dominant.
- **Explanations:** each answer shows one; the results screen lists every question with an **Inspect** button that opens it in the atlas.

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| `/` | Focus the search box |
| `Esc` | Close a dialog, clear the search, or unpin the selected item |
| `1`–`4` | Answer a multiple-choice quiz question |

### Saved preferences

The slice card size and the widths of the sidebar and middle column are saved in the browser (`localStorage`). Double-click any resize edge to reset it. The theme follows your system setting until you toggle it, and the toggle is not remembered between visits.

## Project structure

```text
index.html     Page structure: top bar, sidebar, middle column, info panel, slice grid, dialogs, import map
style.css      All styling: theme variables, slices, schematic, lesions, quiz, dialogs
script.js      Data and app logic: tracts, structures, lesions, slices, rendering, interaction, quiz
brain3d.js     3D viewer (three.js), imported by script.js as initBrain3D
assets/
  meshes/      Brain meshes for the 3D view (.mz3)
  slices/      Stain and MRI images for each slice: <key>_weigert.png, <key>_mri.png, <key>_lfb.png
scripts/
  generate_all_atlas_slices.js   Generates the images in assets/slices
LICENSE        MIT
```

There is no framework or bundler; `script.js` is one ES module that holds the data at the top and the app logic below it.

### How `script.js` is organised

#### Pathway data


| Name | Purpose |
| --- | --- |
| `T` | All pathways. Built from the main tract list plus `CN` (cranial nerves), `CB` (cerebellar pathways) and `CX` (others). Each entry: `id`, `n` (name), `d` (direction: `a` ascending, `d` descending, `b` both, `n` cranial nerve), `p` (route through the levels), `loc` (shapes per slice) |
| `TX` | Description text per pathway: origin, course, decussation, termination, function, clinical |
| `R_COORDS` | Shape positions per pathway per slice (merged into `loc`) |
| `LB` | Labels for individual shapes, e.g. "Nucleus ambiguus" within CN IX |
| `CUSTOM_SHAPES` | Hand-drawn SVG paths that replace a default ellipse |
| `DEC_PATHS` | Decussation paths drawn on each slice |
| `TAG` | Category chip for each pathway (`s` sensory, `m` motor, `c` cerebellar; anything missing counts as a cranial nerve) |
| `ROUTE` | One-line start, crossing and end for the route card |
| `TG` | Links from pathways to brain structures (drives the "Key structures" pills and structure highlighting) |

#### Structures and forebrain


| Name | Purpose |
| --- | --- |
| `ST` | Brain structures: `[name, description]` |
| `FB` | Positions of structures on the cortex, thalamus and cerebellum views |
| `REGION` | Sidebar subtitle for each structure (worked out from `FB`) |

#### Slices and schematic


| Name | Purpose |
| --- | --- |
| `SEC` | The 12 slices in order (`cx, th, rmb, cmb, rp, cp, cbl, rm, mm, cm, c, lum`) with their titles |
| `base` | Outline drawing for each slice |
| `SEC_TO_LONG`, `LEVEL_NAMES` | Map slices to schematic levels, and give slices readable names |
| `X`, `Y`, `LV` | 2D schematic columns, level heights and rows |
| `LEVEL_LONG`, `LEVEL_ROWS` | Names of schematic levels and the rows each covers |

#### Lesions


| Name | Purpose |
| --- | --- |
| `LES` | Lesion syndromes (text, damaged structures, overlay shape) |
| `LESION_CLIPS` | Slices that can show a lesion, with the outline the shading is clipped to |

#### Rendering and interaction


| Name | Purpose |
| --- | --- |
| `sh()`, `fore()`, `lab()` | Draw a brainstem/cord slice, a forebrain slice, and the label column |
| `paint()` | Applies all highlighting, the schematic, the route card and the info panel |
| `lesionPaint()`, `lesInfo()` | Lesion shading and the lesion info panel |
| `applyFilter()`, `buildSidebar()` | Search and filtering, and the sidebar list |
| `selectItem()`, `jumpToSlice()` | Pinning and slice navigation |
| `layout()`, `parseRoute()`, `routeCardHTML()` | The 2D schematic and route card |
| `initHelpAndQuiz()` | Help dialog and quiz. Holds the quiz-only data: `LES_QUIZ` (lesion presentations and extra accepted names), `STF` (structure function lines), `CONFUSE` (items too similar to offer as alternatives) |

State: `sel` (pinned item), `hov` (previewed item), `LSIDE` (lesion side), `F = {q, k, l}` (search, chip, level).

### Coordinate systems

- **Brainstem and cord slices:**
  - **Drawing area:** 200 × 200 with the midline at x = 100, plus space on the right for labels.
  - **Shapes:** stored for the right half as `[dx, y, rx, ry, label?]`, where `dx` is the distance from the midline, and mirrored to the left.
  - **Sides:** `data-side="L"` is the image-left half (the ipsilateral reference).
- **Forebrain slices** (`cx`, `th`, `cbl`): a 400 × 200 drawing area. `FB` entries are `[id, x, y, rx, ry]`. The cerebellum uses the `M()` helper to mirror entries into both hemispheres.
- **Routes (`p`):** a space-separated list of `side:level` points from start to end.
  - **Sides:**
    - `L`: ipsilateral column
    - `R`: contralateral column
    - `O`: outside the brainstem (a nerve exit)
    - `E`: cerebellum
  - **Levels:** `cx olf bg th mb po cb rm mm cm cd cs`.
  - **Crossings:** consecutive `L` and `R` points mark a crossing. For example, `R:cx R:mb R:po R:rm R:mm R:cm L:cm L:cd L:cs` is the lateral corticospinal tract crossing in the caudal medulla.
- **3D:** MNI millimetre coordinates, converted to scene units in `brain3d.js`.

### `brain3d.js`

`initBrain3D({ canvas, onSelectSlice })` returns `setActiveSlice`, `setTractPathway`, `highlightTractSlices`, `setOpacity`, `zoomBy`, `resetCamera` and `resize`. Its data tables:

- **`SLICE_3D_MAP`:** position and size of each slice disc.
- **`NODE_MNI`:** 3D position of each route level, used to turn a tract's `p` into a tube.
- **`CN_3D_MNI`:** hand-placed 3D trajectories for the cranial nerves.

To work on the 2D page without WebGL or the CDN, serve a stub `brain3d.js` that exports `initBrain3D()` returning those seven functions as no-ops.

### Slice image generator

```bash
node scripts/generate_all_atlas_slices.js          # every slice
node scripts/generate_all_atlas_slices.js lum c    # only the listed slices
```

Run it from the project root. The brainstem and cord images (`lum c cm mm rm cp rp cmb rmb`) are painted from the same outlines the app draws, so they line up exactly. The forebrain images (`th`, `cbl`) also need `assets/meshes/ICBM2009sym.nii.gz`, which is not included; it is only loaded when those slices are requested.

## Adding content

Wording conventions used throughout: descriptions say "Crosses…" or "Does not cross…", "Terminates in…", "Carries…" or "Controls…", and the clinical line starts "Lesion: …". Spelling is British (*decussation, haemorrhage, oedema*).

### A tract

1. **Entry:** add it to `T` with `id`, `n`, `d`, `p` and `loc: {}`. Add it at the **end** of the `CX` list: colours come from list position, so inserting earlier changes every later item's colour.
2. **Text:** add six strings to `TX` (origin, course, decussation, termination, function, clinical).
3. **Positions:** add an entry to `R_COORDS` with a shape for each slice it appears on. Find a free spot by checking the other tracts' coordinates on that slice.
4. **Optional extras:**
   - `LB` labels for individual shapes
   - `CUSTOM_SHAPES` for a non-elliptical outline
   - `DEC_PATHS` for a crossing drawn on a slice
5. **Category:** add it to `TAG`, or it will be filed under Cranial nerves.
6. **Route card:** add a start, crossing and end line to `ROUTE`.
7. **Optional:** `TG` links to brain structures, and a `CONFUSE` group if it is easily mistaken for another pathway in the quiz.

The sidebar, search, schematic, 3D tube and every quiz format pick it up automatically.

### A cranial nerve

As for a tract, but add it to `CN` with `d: "n"` and a name in the form `"CN V Trigeminal"`; the quiz then also accepts "CN V", "CN 5" and "Trigeminal". Use `O:` points in `p` for where the nerve leaves the brainstem, and add a hand-placed trajectory to `CN_3D_MNI` in `brain3d.js`.

### A brain structure or cortical area

1. **Entry:** add `[name, description]` to `ST` under a short uppercase id.
2. **Position:** add `[id, x, y, rx, ry]` to the right list in `FB` (`cx`, `th` or `cbl`).
3. **Region:** on the thalamus view, structures count as thalamus unless their id is in the basal ganglia list in the `REGION` code.
4. **Quiz:** add a one-line function to `STF`, written without naming the structure.
5. **Optional:** link pathways to it in `TG`.

### A lesion syndrome

Add an object to `LES`:

```js
{
  id: "les:xyz", n: "Name", aka: "Other name · another name",
  grp: "brain",                   // omit for spinal cord, "brain" for brainstem, "cerebral" for strokes on the cortex view
  badge: "Brainstem stroke", where: "rostral medulla", slice: "rostral medulla",
  lv: "rm",                       // slice key; must be in LESION_CLIPS
  uni: true,                      // one-sided: adds the Left/Right toggle
  vessel, cause, area, motor, sens, other, img,   // text
  exam: ["...", "..."],           // bedside checks
  hit: { lcst: "f", "cn9|Nucleus ambiguus": "f", vst: "p" },   // "f" damaged, "p" partly affected
  ov: () => '<path d="…"/>'       // lesion shape for the RIGHT half, in slice coordinates
}
```

- **`hit` keys:** these are pathway ids. Use `"id|Label"` to pick one shape that shares an id; the label is the shape's name in `LB`. On the cortex view, keys can also be structure ids from `ST` (e.g. `M1`, `BRO`), and the shape is drawn as given, without mirroring.
- **Lesion slices:** lesions can appear on `c`, `rm`, `cp`, `rp`, `rmb` and `cx`. For another slice, add its outline to `LESION_CLIPS`.
- **Quiz:** add an entry to `LES_QUIZ` in `initHelpAndQuiz()`:
  - **`sx`:** a short presentation that does not name the syndrome or its artery. Keep the lesion on the patient's left.
  - **`acc`:** extra accepted answers.

  Lesions without an entry are left out of the lesion quiz.

### A slice level

This touches several places:

1. **Slice list:** add `[key, title]` to `SEC`, in rostral-to-caudal order.
2. **Drawing:** add an outline function to `base`.
3. **Pathways:** add positions to `R_COORDS` for every pathway at that level, and `DEC_PATHS` for any crossings.
4. **Mappings:** add the key to `SEC_TO_LONG` (and to `Y`/`LEVEL_LONG` if it is a new schematic level) and to `LEVEL_NAMES`. Point the matching `LV` schematic row at it.
5. **3D:** add a disc to `SLICE_3D_MAP` in `brain3d.js`.
6. **Images:** add the outline and tissue pattern to the generator and run it for the new key.
7. **Optional:** add it to the quiz presets in `initHelpAndQuiz()`, and to `LESION_CLIPS` if lesions should appear on it.

## Testing

There is no automated test suite in the repository. Changes were checked by:

- driving the page in a headless browser with a stub `brain3d.js`
- playing every quiz format to its results screen
- testing the typed-answer marking against lists of sample answers

These checks do not cover the 3D view or the stain and MRI images.

## Limitations

### Anatomical accuracy

- Positions in the cross-sections are schematic: they show relative arrangement, not true size, shape or position. Each region is shown at one or two representative levels.
- Coverage is selective. Many pathways are missing, for example limbic and hypothalamic connections (fornix, mammillothalamic tract), monoamine systems, the optic radiation, autonomic pathways, and the solitary tract as a separate item. The thoracic and sacral cord are not shown, nor are features such as the lateral horn and Clarke's nucleus.
- Laterality is simplified to a left (ipsilateral) and right (contralateral) column. Partly crossed or bilateral pathways are shown in a reduced form.
- No references or citations accompany the content, and it has not been formally reviewed.

### Lesions

- The 20 syndromes are teaching models. Damaged-structure lists and shaded areas are approximations; real infarcts vary widely.
- Spinal cord syndromes are shown only on the cervical slice; the lumbar slice has no lesions.
- Thalamic, internal capsule (lacunar) and cerebellar strokes are not modelled as syndromes.
- Cerebral strokes are drawn on a single lateral view of the left hemisphere. ACA and PCA territories lie mostly on the medial and inferior surfaces, so only part of them is visible. The non-dominant MCA stroke is shown on the same (left) image.

### Images and 3D

- The Weigert, MRI and Luxol views are **generated illustrations**, not real histology or scans. The brainstem and cord images are painted from the vector outlines; the forebrain images come from an MRI template.
- The 3D view places the brainstem and cord schematically: the lumbar disc sits just below the cervical one, not at its true depth.
- 3D tract tubes join the schematic level points; they are not tractography.
- The right cortical hemisphere is a mirror of the left.
- three.js loads from a CDN, and `script.js` imports the 3D module directly, so **without an internet connection the whole page fails to load**, not just the 3D view.

### Quiz

- Typed answers are marked by approximate matching. Unusual synonyms can be marked wrong, and near-misses can occasionally be accepted.
- Lesion questions: every presentation puts the lesion on the patient's left, and there are at most 20 questions (one per syndrome).
- Label the Slice shows at most 8 structures per slice.
- Scores and progress are not saved.

### Usability and accessibility

- Previews rely on pointing with a mouse; on touch screens, tap to pin instead.
- The SVG slices expose structure names only through tooltips, so they are of limited use with a screen reader.
- Pathway colours are spread around the colour wheel and can be hard to tell apart with colour-vision deficiency. The labels and sidebar are the reliable way to identify an item.
- Text in the 2D schematic is small in the default 3D + 2D split; switch to **2D Schematic** for a larger view.
- The theme choice is not remembered between visits.

### Code

- All data lives in `script.js` alongside the app logic (about 2,700 lines), not in separate data files. Adding content means editing several tables, as described in [Adding content](#adding-content).
- No build step, type checking or automated tests.

## Known issues and ideas

- A slice is blank in a stain or MRI mode if its image fails to load (there is no fallback to the vector drawing).
- The image link may be stale when returning to Vector mode.
- Ideas:
  - lesion shading on the lumbar slice
  - more lesion levels (thalamus, internal capsule, cerebellum)
  - listing a lesion's involved tracts in the sidebar
  - remembering the theme
  - moving the data into separate files

## License

MIT. See [LICENSE](LICENSE).
