# Feature plan

Roadmap of reveal.js capabilities: what works today, what’s missing, and sensible next steps.

## Currently supported

Most of the core presentation experience is covered:

- Horizontal slides (`---`) and vertical slides (`--`)
- YAML front matter (title, theme, transition, etc.)
- reveal.js config passthrough via `reveal:` in front matter
- Built-in themes and transitions
- Code blocks with syntax highlighting (monokai / zenburn)
- Speaker notes via `<aside class="notes">`
- Slide backgrounds (color and image via `<!-- .slide: ... -->`)
- Local image embedding into the single HTML file (`<img>` and `data-background-image`)
- Zoom, overview, hash navigation, controls, progress
- Standard Markdown (GFM): lists, emphasis, links, tables, blockquotes

## Major gaps

### Math (KaTeX / MathJax)

The math plugin is not bundled. LaTeX such as `$E=mc^2$` or block equations will not render unless added manually or the build is extended to include `RevealMath`.

### In-slide search

The search plugin is not included, so there is no built-in full-deck text search (e.g. Ctrl+Shift+F).

### Fragments (partly broken)

The example deck documents Pandoc-style element comments:

```markdown
- First point <!-- .element: class="fragment" -->
```

These are **not processed**. Markdown is converted to HTML at build time, and reveal’s markdown plugin (which understands `.element:` comments) is not used. The comment stays in the output without adding `class="fragment"`.

**Workaround:** use raw HTML:

```html
<ul>
  <li class="fragment">First point</li>
  <li class="fragment">Second point</li>
</ul>
```

**Planned fix:** post-process HTML to apply `.element:` comments, or add a Markdown-friendly fragment syntax.

### Auto-animate

Supported in reveal.js via `data-auto-animate` attributes, but there is no Markdown syntax. Users must hand-write HTML attributes on slides.

### Background video and embedded media

- `data-background-video` works for URLs if set via slide attributes
- Local video/audio files are **not embedded** into the single HTML file (only images are)
- Offline decks with embedded video need additional build logic

### Parallax backgrounds

`parallaxBackgroundImage` can be set in `reveal:` config, but local parallax images are not inlined into the generated JS config.

### Custom CSS and custom plugins

No way to inject a custom stylesheet or register extra plugins (e.g. chalkboard, menu) from Markdown or front matter.

## Smaller / partial gaps

| Feature | Status |
|--------|--------|
| Tables, blockquotes, links | Work via standard Markdown |
| Slide IDs / deep links | No `{#id}` syntax; use raw HTML or hash indices |
| Fragment variants (`fade-in`, `grow`, etc.) | Require raw HTML, e.g. `class="fragment fade-in"` |
| Speaker note shortcuts (`Note:` prefix) | Not supported; use `<aside class="notes">` |
| PDF export | Possible manually in browser (`?print-pdf`); not documented or automated |
| Highlight themes | Only `monokai` and `zenburn` (what reveal.js ships in dist) |
| Mermaid / diagrams | Not supported |
| Scroll view (reveal.js 6) | May work via `reveal:` config; untested and undocumented |

## Recommended next steps

Priority order by impact:

1. **Fragments** — fix `.element:` comment processing or add a simple Markdown fragment syntax
2. **Math** — bundle the math plugin and document LaTeX usage
3. **Search** — include the search plugin in the output HTML
4. **Local video/media embedding** — extend inlining beyond images
5. **Custom CSS** — allow a `css:` path or inline styles via front matter

## Out of scope (for now)

- Third-party reveal plugins (chalkboard, menu, etc.)
- Mermaid / chart rendering
- Automated PDF export pipeline
- Pandoc compatibility layer
