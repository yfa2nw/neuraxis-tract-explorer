# Neuraxis Tract Explorer

An interactive web tool for exploring major ascending and descending neural tracts, brainstem nuclei, cerebellar peduncles, and cranial nerves (CN I-XII) across 11 cross-sectional levels of the brain and spinal cord.

## Features

- **3D and 2D Views**: View pathways on a 2D schematic alongside a 3D brain model (`ICBM152`) showing where each cross-sectional slice and tract sits in space. Includes camera presets, zoom controls, and an opacity slider.
- **Cross-Sectional Slice Modes**: Switch between vector diagrams, Weigert stain, T1-weighted MRI, and Luxol Fast Blue views across all 11 levels.
- **Slice Filtering and Zoom**: Selecting a tract or structure filters the view to only the slices where it appears. Click any slice to enlarge it, and see decussation markers (`X`) and direction indicators (`▲`/`▼`) where pathways travel or cross the midline.
- **Quiz Mode**: Generate practice quizzes filtered by slice and question format (multiple choice, free-text typing with abbreviation support, or full slice labeling).
- **Customizable Layout**: Search bar for quick lookup, light/dark mode toggle, and draggable panel borders to resize sections.

## Running Locally

Since the 3D viewer loads ES modules and mesh files, run a local static server from the project folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.
