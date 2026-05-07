# Puffy Kitty Crochet Archive

## Project Goal

Build a personal artist-style website for publishing crochet pattern charts, OC/custom work, and visual process archives.

The site should feel like a cute handmade pattern notebook rather than a commercial shop.

## Visual Direction

- Pale blue background
- Cute but readable Chinese font using `cjkFonts 全瀨體`
- Thick black handwritten-style typography
- Soft photo previews with irregular rounded corners
- Highlighter-style notes
- Hand-drawn / scrapbook / sticker-like feeling
- Avoid product-card or ecommerce styling

## Current Site Structure

- `#/`
  - Personal homepage
  - Hero image
  - Short personal introduction
  - Series rows

- `#/pattern`
  - Crochet candy pattern series gallery
  - Shows pattern entries as gallery cards

- `#/pattern/patterns/gummy/pokemon/ralts`
  - Individual pattern reader page
  - Left side: fixed image carousel
  - Right side: scrollable pattern instructions
  - Supports Chinese / US / UK crochet terms
  - Can generate PNG and PDF downloads in browser

- `#/gallery`
  - OC/custom display gallery

- `#/about`
  - Workflow notes

- `#/contact`
  - Contact information

## Current Implementation

- Pure static site
- Hosted by GitHub Pages
- No build step
- Main files:
  - `index.html`
  - `styles.css`
  - `scripts.js`
  - `assets/`
  - `patterns.json`
  - pattern folders such as `patterns/gummy/pokemon/ralts/`

## Current GitHub Repository

Repository:

```text
puffy-kitty/puffy-kitty.github.io
```

Expected Pages URL:

```text
https://puffy-kitty.github.io/
```

Local branch currently contains unpublished commits ahead of GitHub.

## Pattern Data Model

Pattern content now lives in one folder per pattern. The current pattern is:

```text
patterns/gummy/pokemon/ralts/
  pattern.MD
  cover.JPEG
  1.JPEG
  2.JPEG
  3.JPEG
```

`patterns.json` lists which pattern folders the static site should load.

Each pattern can define:

- `fileName`
- `images`
- `category`
- `tags`
- `title.zh / title.us / title.uk`
- `summary.zh / summary.us / summary.uk`
- `rows`
- `notes`
- `hair`
- `abbreviations`

The page reads this data from the JSON front matter and Markdown sections in `pattern.MD`, then generates downloads from the currently selected language.

## Key Design Decisions

- Homepage should not be a pattern list.
- Pattern and gallery are second-level sections.
- Each pattern gets its own detail page.
- Pattern detail page uses split reader layout:
  - image carousel stays visually fixed on the left
  - instructions scroll on the right
  - scrollbars are hidden for a cleaner reader feel
- The site is an artist archive, not a store.

## Next TODO

- Replace placeholder `Puffy Kitty` logo with the final logo image or final brand text.
- Confirm whether the brand name is `Puffy Kitty`, `猫团团`, or both.
- Add real personal introduction copy for the homepage.
- Add real pattern entries and images using one folder per pattern.
- Decide whether to self-host `cjkFonts 全瀨體` instead of using ZeoSeven hosted WebFont.
- Preview in browser across desktop and mobile.
- Push local commits to GitHub after visual confirmation.

## Useful Commands

Check JavaScript syntax:

```powershell
node --check scripts.js
```

Run a local preview:

```powershell
node serve-local.js
```

Check git status:

```powershell
git status --short --branch
```

Push when ready:

```powershell
git push
```
