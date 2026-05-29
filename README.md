# slides_from_markdown

Convert a Markdown file into a **single HTML file** you can open in any browser — a self-contained [reveal.js](https://revealjs.com/) presentation with no extra assets to ship.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (includes `npm`)

Check your install:

```bash
node --version
npm --version
```

## Setup

Clone or copy this project, then install dependencies:

```bash
npm install
```

## Quick start

Build the included example deck:

```bash
npm run build
```

Open `example/slides.html` in your browser.

To edit the slides, change `example/slides.md` and run `npm run build` again.

## Usage

Convert any Markdown file:

```bash
node bin/md2slides.js path/to/slides.md -o path/to/slides.html
```

If you omit `-o`, the output file uses the same name as the input with a `.html` extension.

```bash
node bin/md2slides.js talks/my-talk.md
# writes talks/my-talk.html
```

Show all options:

```bash
node bin/md2slides.js --help
```

## Writing slides

### Horizontal slides

Separate slides with a line containing only `---` (blank lines around it are fine):

```markdown
# First slide

Some content here.

---

## Second slide

More content.
```

### Vertical slides

Use `--` to nest slides vertically under one horizontal slide:

```markdown
## Main topic

Overview text.

--

### Detail A

Extra content below the main slide.

--

### Detail B

Navigate with the down arrow or `J`.
```

### Title and settings (YAML front matter)

Optional settings go at the very top of the file between `---` lines:

```yaml
---
title: My Presentation
author: Jane Doe
description: A short description for browser metadata
theme: black
transition: slide
highlightTheme: monokai
reveal:
  controls: true
  progress: true
  center: true
  hash: true
---
```

| Option | Description | Default |
|--------|-------------|---------|
| `title` | Browser tab title | `Presentation` |
| `author` | Shown in page metadata | — |
| `theme` | reveal.js theme | `black` |
| `transition` | Slide transition (`slide`, `fade`, `none`, …) | `slide` |
| `highlightTheme` | Code block theme (`monokai`, `zenburn`) | `monokai` |
| `reveal` | Any [reveal.js config](https://revealjs.com/config/) options | see example |

**Themes:** `beige`, `black`, `black-contrast`, `blood`, `dracula`, `league`, `moon`, `night`, `serif`, `simple`, `sky`, `solarized`, `white`, `white-contrast`

### Backgrounds and slide attributes

Add an HTML comment anywhere in a slide:

```markdown
<!-- .slide: data-background="#1a1a2e" -->

## Slide with a custom background
```

### Code blocks

Fenced code blocks are syntax-highlighted automatically:

````markdown
```javascript
function hello(name) {
  return `Hello, ${name}!`;
}
```
````

### Step-by-step content (fragments)

Reveal items one at a time:

```markdown
- First point <!-- .element: class="fragment" -->
- Second point <!-- .element: class="fragment" -->
- Third point <!-- .element: class="fragment" -->
```

### Speaker notes

Press `S` in the browser to open speaker view (works best with two windows or displays):

```markdown
## My slide

Content visible to the audience.

<aside class="notes">
  Notes only you see in speaker view.
</aside>
```

### Images

Reference images with normal Markdown syntax. **Local image files** next to your `.md` file are embedded into the HTML automatically:

```markdown
![Diagram](./diagram.png)
```

Remote URLs (`https://...`) are kept as links and require internet when presenting.

## Presenting

Open the generated `.html` file in Chrome, Firefox, Edge, or Safari.

| Key | Action |
|-----|--------|
| Arrow keys / Space | Next / previous |
| `F` | Fullscreen |
| `Esc` | Slide overview |
| `Ctrl+Shift+F` | Search slides |
| `S` | Speaker notes |

Because everything is in one file, you can email it, put it on a USB stick, or host it anywhere — no build step needed on the machine you present from.

## Project layout

```
slides_from_markdown/
├── bin/md2slides.js      # CLI
├── lib/build.js          # Conversion logic
├── example/
│   ├── slides.md         # Example deck (start here)
│   └── slides.html       # Generated output (after npm run build)
└── package.json
```

## Troubleshooting

**`node` or `npm` not found**  
Install Node.js from [nodejs.org](https://nodejs.org/) and restart your terminal.

**No slides found**  
Make sure slide breaks use a line with only `---`. The YAML front matter at the top of the file also uses `---`; that is separate from slide breaks.

**Output file is large (~1–2 MB)**  
Expected. The HTML embeds reveal.js, fonts, and syntax-highlighting styles so the deck works offline in one file.

## License

ISC
