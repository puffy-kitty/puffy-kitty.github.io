# puffy-kitty.github.io

Crochet pattern sharing site for publishing original crochet charts, PDFs, finished photos, materials, and contact information.

## Files

- `index.html`: website content
- `styles.css`: page styling
- `patterns/`: PDF patterns, images, and downloadable files

## GitHub Pages

This repository is named `puffy-kitty.github.io`, so the site URL is:

```text
https://puffy-kitty.github.io/
```

In GitHub, open `Settings > Pages` and use:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/root`

## Add A New Pattern

1. Put the PDF in `patterns/`, for example `patterns/flower-coaster.pdf`.
2. Open `index.html`.
3. Copy one `<article class="pattern-card">...</article>` block.
4. Edit the title, difficulty, description, and download link.

## Use Finished Photos

If you have a photo such as `patterns/flower-coaster.jpg`, replace this:

```html
<div class="pattern-preview motif-a" aria-hidden="true"></div>
```

with:

```html
<img class="pattern-image" src="patterns/flower-coaster.jpg" alt="Finished flower coaster" />
```

Then add this to `styles.css`:

```css
.pattern-image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```
