# slides_from_markdown

Convert a Markdown file into a **single HTML file** you can open in any browser — a self-contained [reveal.js](https://revealjs.com/) presentation with no extra assets to ship.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (includes `npm` and `npx`)

Check your install:

```bash
node --version
npm --version
```

No IDE or git required — just Node and a terminal (PowerShell, Command Prompt, or bash).

## Quick start (npx)

The easiest way to convert a deck is with `npx` — no clone or `npm install` needed:

```bash
npx --package=github:mathiasdahl/slides-from-markdown md2slides my-talk.md -o my-talk.html
```

Run the command from the folder that contains your `.md` file. Local images referenced in the markdown (e.g. `./images/diagram.svg`) are embedded automatically when the files exist next to your markdown.

If you omit `-o`, the output file uses the same name as the input with a `.html` extension:

```bash
npx --package=github:mathiasdahl/slides-from-markdown md2slides my-talk.md
# writes my-talk.html
```

The first run downloads the tool (may take a few seconds); later runs are faster.

Show all options:

```bash
npx --package=github:mathiasdahl/slides-from-markdown md2slides --help
```

## Try it with the example deck

Want to test before writing your own slides?

1. Download [`example/slides.md`](example/slides.md) and the [`example/images/`](example/images/) folder from this repo (keep the same folder layout).
2. Open a terminal in that folder.
3. Run:

```bash
npx --package=github:mathiasdahl/slides-from-markdown md2slides slides.md -o slides.html
```

4. Open `slides.html` in your browser.

On GitHub you can browse the [example folder](https://github.com/mathiasdahl/slides-from-markdown/tree/main/example), download individual files, or download the whole repository as a ZIP and use the `example/` directory.

## Setup (for development)

If you want to hack on the converter itself, clone the repo and install dependencies:

```bash
git clone https://github.com/mathiasdahl/slides-from-markdown.git
cd slides-from-markdown
npm install
```

Build the included example deck:

```bash
npm run build
```

Open `example/slides.html` in your browser.

To edit the slides, change `example/slides.md` and run `npm run build` again.

## Usage (local install)

When working from a cloned copy of this repo:

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

**`node`, `npm`, or `npx` not found**  
Install Node.js from [nodejs.org](https://nodejs.org/) and restart your terminal.

**`ENOENT ... reveal.js`**  
Update to the latest version on GitHub and run the `npx` command again. Use the `--package=github:mathiasdahl/slides-from-markdown` form shown above.

**Images missing in the output**  
Run the command from the folder containing your `.md` file, and keep image paths relative to that file (e.g. `./images/diagram.svg`).

**No slides found**  
Make sure slide breaks use a line with only `---`. The YAML front matter at the top of the file also uses `---`; that is separate from slide breaks.

**Output file is large (~1–2 MB)**  
Expected. The HTML embeds reveal.js, fonts, and syntax-highlighting styles so the deck works offline in one file.

## License

ISC
