# Neuraxis Tract Explorer

An interactive, single-page atlas of the central nervous system's tracts, nuclei and cranial nerves, built for studying neuroanatomy. Pick a structure and see where it runs across 11 levels of the neuraxis, which way it conducts, where it crosses, and what happens clinically when it is damaged. Includes a lesion mode for spinal cord and medullary syndromes.

> **Educational use only.** Content is a study aid, not medical advice. Tract positions in the cross-sections are schematic, and the lesion overlays and tract involvement are simplified teaching models. Check them against your own references.

## Features

- **11 cross-sections, cortex at the top to spinal cord at the bottom:** cerebral cortex, thalamus and basal ganglia, rostral and caudal midbrain, rostral and caudal pons, cerebellum, rostral, mid and caudal medulla, and cervical cord. Slices are generated as SVG in JavaScript.
- **Tracts, nuclei and cranial nerves:** ascending, descending, bidirectional and cranial nerve items, plus brainstem nuclei, thalamic nuclei, basal ganglia, cerebellar nuclei and peduncles, and cortical areas.
- **Direction and decussation:** animated direction arrows, dashed crossing paths, and side badges showing ipsilateral, contralateral or bilateral course.
- **Description panel** for every item: Origin, Course, Decussation, Termination, Function and Clinical lesion correlates.
- **Search and filter:** free-text search, category chips (All, Sensory, Motor, Cerebellar, Cranial nerves, Lesions) and a "present at level" selector.
- **Lesion mode:**
  - Spinal cord: central cord, anterior cord, posterior cord, Brown-Séquard.
  - Brainstem strokes: lateral medullary (Wallenberg / PICA) and medial medullary (Dejerine).
  - For each: cause, blood supply, affected structures, motor, sensory and other signs, how to examine, imaging, alternative names, and a jump-to-tract list.
  - On the slice the lesion is shaded, damaged structures are red and partly affected ones are amber. Unilateral lesions have a left/right toggle.
- **Vertical brain diagram and 3D view** linked to the selected slice (`brain3d.js`).
- **Slice modes:** Vector, Weigert stain, MRI (T1w) and Luxol blue, plus pathway-side or bilateral laterality.
- Quiz mode, help dialog, light/dark theme, slice size slider.

## Interaction model

| Action | Result |
| --- | --- |
| Hover (nothing pinned) | Previews the item: highlights it and shows its description |
| Click | Pins the item |
| Hover while pinned | Does nothing |
| Unpin button, or click the pinned item again | Back to hover preview |
| Search / chip / level filter | Fades non-matching items only while **nothing is selected** |

Selecting an item does not auto-Spotlight a slice. Filtering the slices and the 3D view follows the pinned item only.

## Running it

The page uses ES modules and an import map for three.js, so it must be served over HTTP. Opening `index.html` as a `file://` URL will not work.

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

Any static server works. No build step.

## Project layout

```
index.html    Page structure: top bar, sidebar, inspector, slice grid, dialogs, import map
style.css     All styling, theme variables, lesion styles
script.js     Data, slice rendering, sidebar, filtering, interaction, lesion mode, quiz
brain3d.js    3D brain viewer (three.js), imported by script.js as initBrain3D
assets/       Images and models used by the slice modes and 3D view
scripts/      Helper scripts for preparing assets
```

`assets/` and `scripts/` are not described in detail here.

### `brain3d.js` interface used by `script.js`

`initBrain3D()` returns an object with `setActiveSlice`, `setTractPathway`, `highlightTractSlices`, `resize`, `resetCamera`, `zoomBy`, `setOpacity` and `setMode`. Replace it with a stub exposing these no-ops to test the 2D page without WebGL or the 3D assets.

## How `script.js` is organised

| Name | Purpose |
| --- | --- |
| `T` | Tracts. Each has `id`, `n` (name), `d` (direction), `p` (route), `loc` (per-level shapes `[dx, y, rx, ry, label, ...]`) and the description text (origin, course, decussation, termination, function, clinical) |
| `CN`, `CB`, `CX` | Cranial nerves, cerebellar items, cortical areas |
| `ST`, `TG`, `FB` | Structures and nuclei, links from tracts to structures, forebrain and cerebellum shapes |
| `CUSTOM_SHAPES`, `DEC_PATHS` | Hand-drawn shape overrides and decussation paths per slice |
| `SEC` | The 11 slices (`cx, th, rmb, cmb, rp, cp, cbl, rm, mm, cm, c`) |
| `base`, `sh()`, `lab()` | Slice outlines, shape rendering, right-hand labels |
| `LES` | Lesion syndromes: text fields, `hit` map, and overlay geometry |
| `paint()` | Applies highlighting, lesion shading, the info panel and the status text |
| `applyFilter()` | Search, chip and level filtering and fading |
| `selectItem()` | Pin and unpin |

State: `sel` (pinned item), `hov` (hovered item, used only when nothing is pinned), `LSIDE` (lesion side), filter state `F = {q, k, l}`.

### Coordinates and sides

Each slice SVG uses a 200 x 200 drawing area with the midline at x = 100, plus space on the right for labels. Shapes are stored for the right half (`dx` is the offset from the midline) and mirrored to the left. A slice's `data-side="L"` is the image-left half, labelled "Left / Ipsilateral ref".

## Adding content

### A tract

Add an entry to `T` with its `loc` shapes for each slice it passes through, and fill in the description fields. Follow the existing wording template: "Crosses…" or "Does not cross…", "Terminates in…", "Carries…" or "Controls…", and "Lesion: …".

### A lesion syndrome

Add an object to `LES`:

```js
{
  id: "les:xyz", n: "Name", aka: "Alternative names",
  lv: "rm",                       // slice key; must exist in LESION_CLIPS
  uni: true,                      // unilateral (adds the left/right toggle)
  grp: "brain", badge: "...", where: "rostral medulla", slice: "rostral medulla",   // optional
  cause, vessel, area, motor, sens, other, img,   // text
  exam: ["...", "..."],           // bedside checks
  hit: { cn5: "f", "cn9|Nucleus ambiguus": "f", vst: "p" },   // "f" = damaged, "p" = partly
  ov: () => '<path d="…"/>'       // lesion shape for the RIGHT half, in slice coordinates
}
```

- `hit` keys are tract ids. Use `"id|Name"` to single out one structure that shares an id, where Name is the shape's title.
- A lesion can only appear on a slice listed in `LESION_CLIPS` (currently `c` and `rm`). To support another slice, add its outline path there.

## Testing notes

Developed against headless Chromium (Playwright) with a stubbed `brain3d.js`. The 3D view and the stain and MRI slice images have not been covered by those tests.

## Known issues and ideas

- Escape does not close the help and quiz dialogs.
- A slice is blank if its stain or MRI image fails to load (no fallback).
- The image link may be stale when returning to Vector mode.
- Planned: pontine and midbrain strokes (Weber, Millard-Gubler, Benedikt, Claude, Foville), more lesion levels, and listing a lesion's involved tracts in the sidebar.
