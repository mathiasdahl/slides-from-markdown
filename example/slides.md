---
title: Markdown to reveal.js Demo
author: Your Name
description: An example deck you can edit and rebuild into a single HTML file
theme: black
transition: slide
highlightTheme: monokai
reveal:
  controls: true
  progress: true
  center: true
  hash: true
---

# Slides from Markdown

Convert this file to a **single HTML presentation based on Reveal.js**.

Press `S` for speaker notes · `F` for fullscreen · `Esc` for overview · `Ctrl+Shift+F` to search. Arrow keys (Right, Left, Up, Down) moves around in the presentation.

---

## Why Markdown?

- Write slides in a familiar format
- Version control friendly
- Focus on content, not layout tools

---

## Slide separators

Put a line with only `---` between horizontal slides.

Use `--` between **vertical** slides (nested under one horizontal slide):

Try to use the arrow up and down keys now.

--

### Vertical slide 1

Vertical slides share one horizontal position.

--

### Vertical slide 2

Use the down arrow or `J` to move between them.

---

## Lists and emphasis

- Bullet points work as expected
- **Bold**, *italic*, and `inline code`
- Numbered lists too:

1. First item
2. Second item
3. Third item

---

## Code blocks

Syntax highlighting is included automatically:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('world'));
```

---

## Fragments

Reveal step-by-step content with the `fragment` class (press Space or Right/Down arrow to show bullets):

- First point <!-- .element: class="fragment" -->
- Second point <!-- .element: class="fragment" -->
- Third point <!-- .element: class="fragment" -->

Look at the source slides.md file to see how it's done.

---

## Backgrounds

<!-- .slide: data-background="#1e40af" -->

This slide uses a **custom blue background** (`#1e40af`).

Compare it with the default black theme on neighboring slides — the color is set with a slide attribute comment:

```markdown
<!-- .slide: data-background="#1e40af" -->
```

Add the comment anywhere in the slide. Hex colors, `hsl()`, and `rgb()` all work.

---

## Themes

The whole deck uses one reveal.js theme, set in the YAML front matter at the top of the file:

```yaml
theme: league
```

Available themes:

| | | | |
|--|--|--|--|
| `beige` | `black` | `black-contrast` | `blood` |
| `dracula` | `league` | `moon` | `night` |
| `serif` | `simple` | `sky` | `solarized` |
| `white` | `white-contrast` | | |

The default is `black`. Try changing `theme:` in the front matter and rebuilding to see the difference.

See the [reveal.js theme gallery](https://revealjs.com/themes/) for previews of each theme.

Themes control fonts, text color, and link styling for the entire presentation. Use per-slide `data-background` attributes when you only want one slide to look different.

---

## Images

Local image files are embedded into the HTML when you build.

--

### Markdown syntax

![Sample diagram](./images/sample-diagram.svg)

```markdown
![Alt text](./images/sample-diagram.svg)
```

Paths are relative to the `.md` file (here: `example/images/`).

--

### Remote URLs

External images work too, but need internet when presenting:

![reveal.js logo](https://static.slid.es/reveal/logo-v1/reveal-white-text.svg)

```markdown
![Logo](https://example.com/image.png)
```

--

### Size and layout

Use HTML when you need explicit dimensions or CSS classes:

<img src="./images/sample-diagram.svg" alt="Smaller diagram" height="160">

```html
<img src="./images/sample-diagram.svg" alt="Diagram" height="160">
```

--

### Image as slide background

<!-- .slide: data-background-image="./images/sample-diagram.svg" data-background-size="contain" data-background-opacity="0.25" -->

Use slide attributes for full-slide backgrounds. Local files are embedded automatically.

```markdown
<!-- .slide: data-background-image="./images/photo.jpg" data-background-size="cover" -->
```

---

## Speaker notes

Open the speaker view with `S` (two windows / displays work best).

<aside class="notes">
  These notes are only visible in speaker view.
  Mention that the build script inlines reveal.js into one portable HTML file.
</aside>

---

## Build it

From the project root:

```bash
npm install
npm run build
```

Or specify paths directly:

```bash
node bin/md2slides.js example/slides.md -o example/slides.html
```

Then open `example/slides.html` in your browser.

---

# Questions?

Edit `example/slides.md` and run the build again.
