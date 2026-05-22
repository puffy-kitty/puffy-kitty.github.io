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
- `cover1` for the website card/detail cover image; default to `cover1.JPEG`
- `cover2` for the image shown on downloaded PNG/PDF exports; default to `cover2.JPEG`
- `images`
- `category`
- `tags`
- `title.zh / title.us / title.uk`
- `summary.zh / summary.us / summary.uk`
- `rows`
- `notes`
- `hair`
- `abbreviations`

Patterns with one version dimension use `versions` plus matching sections like
`body:large`, `notes:large`, and `hair:large`.

Patterns with independent version dimensions use `versionGroups`. The site
builds every combination from the group options and reads matching sections
whose suffix is the joined option ids, for example:

```text
versionGroups:
  region: johto / paldea
  body: half / one

sections:
  body:johto-half
  body:johto-one
  body:paldea-half
  body:paldea-one
```

Put yarn color/material notes directly under the body section using
`body-materials:<version-id>` instead of writing the color inside `R1`.

Use `color-notes:<version-id>` for mid-pattern color changes. These notes render
between the pattern title and body table. Inline `*text*` uses green highlight,
and `**text**` uses orange highlight, for example `*换绿线*`.

Named accessories use `accessories` metadata plus `assess:<name>:<version-id>`
sections. For example:

```text
accessories:
  antenna -> 触角 / Antenna

sections:
  assess:antenna:johto-half
  assess:antenna:paldea-half
```

Tiny accessories should stay as plain localized bullets after their material
line when they only have one or two crochet rounds/rows, or when they only need
one or two short instructions. Do not force `R1` / `R2` labels unless the
accessory has three or more meaningful rounds/rows or a genuinely long sequence.
When writing turn-back instructions, always include the count: use `倒1回钩`,
not `倒回钩`.

When the user asks to add a new gummy Pokemon draft, create a lower-case English
folder under `patterns/gummy/pokemon/` and add `draft.md`. For example, "增加一个
皮卡丘软糖图解" means:

```text
patterns/gummy/pokemon/pikachu/draft.md
```

with this starting content:

```markdown
# 皮卡丘
## 主体


# note to ai
```

New pattern SOP:

- `新建一个图解，类型是宝可梦软糖，名字是 xxx` creates
  `patterns/gummy/pokemon/<english-slug>/draft.md`.
- `新建一个图解，类型是动物软糖，名字是 xxx` creates
  `patterns/gummy/animals/<english-slug>/draft.md`.
- Ask a short clarification if the Chinese name or nickname cannot be mapped to
  a confident English slug.
- Draft creation does not add the folder to `patterns.json`.
- Formal conversion creates `pattern.MD`, defaults to `cover1.JPEG` and
  `cover2.JPEG`, adds localized metadata/tags/accessories, adds the folder to
  `patterns.json`, and renames the source draft to `draft-done.md` or similar.
- Pokemon gummy patterns use `Pokemon` and `gummy` tags. Animal gummy patterns
  use `animal` and `gummy` tags.

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
