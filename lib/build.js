const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const REVEAL_ROOT = path.join(__dirname, '..', 'node_modules', 'reveal.js');

const THEMES = new Set([
  'beige',
  'black',
  'black-contrast',
  'blood',
  'dracula',
  'league',
  'moon',
  'night',
  'serif',
  'simple',
  'sky',
  'solarized',
  'white',
  'white-contrast',
]);

const HIGHLIGHT_THEMES = new Set(['monokai', 'zenburn']);

const SLIDE_ATTR_PATTERN = /<!--\s*\.slide:\s*(.*?)\s*-->/s;
const ELEMENT_COMMENT_IN_TAG = /<([a-z][a-z0-9]*)(\s[^>]*)?>([\s\S]*?)<!--\s*\.element:\s*(.*?)\s*-->\s*<\/\1>/gi;
const ELEMENT_ATTR_PARSE_PATTERN = /([^"= ]+?)="([^"]+?)"|(data-[^"= ]+?)(?=[" ])/g;

marked.setOptions({
  gfm: true,
  breaks: false,
});

function readAsset(relativePath) {
  return fs.readFileSync(path.join(REVEAL_ROOT, relativePath), 'utf8');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseSlideChunk(chunk) {
  const trimmed = chunk.trim();
  if (!trimmed) {
    return null;
  }

  let attrs = '';
  let content = trimmed;
  const attrMatch = content.match(SLIDE_ATTR_PATTERN);

  if (attrMatch) {
    attrs = attrMatch[1].trim();
    content = content.replace(attrMatch[0], '').trim();
  }

  return { attrs, content };
}

function parseSlides(markdown) {
  const horizontalParts = markdown.split(/\n\s*---\s*\n/);

  return horizontalParts
    .map((part) => {
      const verticalParts = part.split(/\n\s*--\s*\n/);

      if (verticalParts.length === 1) {
        return parseSlideChunk(verticalParts[0]);
      }

      const slides = verticalParts
        .map(parseSlideChunk)
        .filter(Boolean);

      return slides.length ? { stack: slides } : null;
    })
    .filter(Boolean);
}

function mimeTypeForExtension(ext) {
  switch (ext.toLowerCase()) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    default:
      return null;
  }
}

function filePathToDataUri(imagePath) {
  const mimeType = mimeTypeForExtension(path.extname(imagePath));
  if (!mimeType) {
    return null;
  }

  const data = fs.readFileSync(imagePath);
  return `data:${mimeType};base64,${data.toString('base64')}`;
}

function resolveLocalImageDataUri(src, baseDir) {
  if (/^(https?:|data:|\/\/|#)/i.test(src)) {
    return src;
  }

  const imagePath = path.resolve(baseDir, decodeURIComponent(src));
  if (!fs.existsSync(imagePath)) {
    return src;
  }

  return filePathToDataUri(imagePath) || src;
}

function inlineLocalImages(html, baseDir) {
  return html.replace(/<img\b([^>]*?\bsrc=")([^"]+)(")/gi, (match, prefix, src, suffix) => {
    const dataUri = resolveLocalImageDataUri(src, baseDir);
    if (dataUri === src) {
      return match;
    }

    return `<img${prefix}${dataUri}${suffix}`;
  });
}

function inlineLocalImagePathsInAttrs(attrs, baseDir) {
  if (!attrs) {
    return attrs;
  }

  return attrs.replace(/data-background-image="([^"]+)"/g, (match, src) => {
    const dataUri = resolveLocalImageDataUri(src.trim(), baseDir);
    return `data-background-image="${dataUri}"`;
  });
}

function parseHtmlAttributes(attrString) {
  const attrs = {};
  if (!attrString) {
    return attrs;
  }

  let match;
  const pattern = new RegExp(ELEMENT_ATTR_PARSE_PATTERN.source, 'g');
  while ((match = pattern.exec(attrString)) !== null) {
    if (match[2]) {
      attrs[match[1]] = match[2];
    } else if (match[3]) {
      attrs[match[3]] = '';
    }
  }

  return attrs;
}

function formatOpeningTag(tagName, attrs) {
  const parts = Object.entries(attrs).map(([name, value]) => (
    value === '' ? name : `${name}="${value}"`
  ));

  return parts.length ? `<${tagName} ${parts.join(' ')}>` : `<${tagName}>`;
}

function mergeOpeningTagAttributes(tagName, existingAttrString, elementAttrString) {
  const attrs = parseHtmlAttributes(existingAttrString);
  const additions = parseHtmlAttributes(elementAttrString);

  for (const [name, value] of Object.entries(additions)) {
    if (name === 'class' && attrs.class) {
      attrs.class = `${attrs.class} ${value}`.trim();
    } else {
      attrs[name] = value;
    }
  }

  return formatOpeningTag(tagName, attrs);
}

function applyElementComments(html) {
  return html.replace(
    ELEMENT_COMMENT_IN_TAG,
    (match, tagName, existingAttrs, content, elementAttrString) => {
      const openTag = mergeOpeningTagAttributes(tagName, existingAttrs, elementAttrString);
      return `${openTag}${content.trim()}</${tagName}>`;
    },
  );
}

function renderSlideSection(slide, baseDir) {
  const html = applyElementComments(
    inlineLocalImages(marked.parse(slide.content), baseDir),
  );
  const attrs = inlineLocalImagePathsInAttrs(slide.attrs, baseDir);
  const attrString = attrs ? ` ${attrs}` : '';
  return `<section${attrString}>\n${html}\n</section>`;
}

function renderSlidesHtml(slides, baseDir) {
  return slides
    .map((slide) => {
      if (slide.stack) {
        const nested = slide.stack
          .map((nestedSlide) => renderSlideSection(nestedSlide, baseDir))
          .join('\n');
        return `<section>\n${nested}\n</section>`;
      }

      return renderSlideSection(slide, baseDir);
    })
    .join('\n');
}

function buildRevealConfig(frontMatter) {
  const revealOptions = frontMatter.reveal && typeof frontMatter.reveal === 'object'
    ? frontMatter.reveal
    : {};

  return {
    controls: true,
    progress: true,
    center: true,
    hash: true,
    transition: frontMatter.transition || 'slide',
    ...revealOptions,
  };
}

function buildHtml({ slidesHtml, frontMatter }) {
  const title = frontMatter.title || 'Presentation';
  const theme = THEMES.has(frontMatter.theme) ? frontMatter.theme : 'black';
  const highlightTheme = HIGHLIGHT_THEMES.has(frontMatter.highlightTheme)
    ? frontMatter.highlightTheme
    : 'monokai';

  const resetCss = readAsset('dist/reset.css');
  const revealCss = readAsset('dist/reveal.css');
  const themeCss = readAsset(path.join('dist/theme', `${theme}.css`));
  const highlightCss = readAsset(path.join('dist/plugin/highlight', `${highlightTheme}.css`));
  const revealJs = readAsset('dist/reveal.js');
  const highlightJs = readAsset('dist/plugin/highlight.js');
  const notesJs = readAsset('dist/plugin/notes.js');
  const searchJs = readAsset('dist/plugin/search.js');
  const zoomJs = readAsset('dist/plugin/zoom.js');
  const revealConfig = buildRevealConfig(frontMatter);
  const configJson = JSON.stringify(revealConfig, null, 2);

  const metaLines = [];
  if (frontMatter.author) {
    metaLines.push(`    <meta name="author" content="${escapeHtml(frontMatter.author)}">`);
  }
  if (frontMatter.description) {
    metaLines.push(
      `    <meta name="description" content="${escapeHtml(frontMatter.description)}">`,
    );
  }

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
${metaLines.join('\n')}
    <style>${resetCss}</style>
    <style>${revealCss}</style>
    <style>${themeCss}</style>
    <style>${highlightCss}</style>
  </head>
  <body>
    <div class="reveal">
      <div class="slides">
${slidesHtml}
      </div>
    </div>
    <script>${revealJs}</script>
    <script>${highlightJs}</script>
    <script>${notesJs}</script>
    <script>${searchJs}</script>
    <script>${zoomJs}</script>
    <script>
      Reveal.initialize(Object.assign(${configJson}, {
        plugins: [ RevealHighlight, RevealNotes, RevealSearch, RevealZoom ]
      }));
    </script>
  </body>
</html>
`;
}

function buildFromMarkdown(markdown, options = {}) {
  const baseDir = options.baseDir || process.cwd();
  const { content, data: frontMatter } = matter(markdown);
  const slides = parseSlides(content);

  if (slides.length === 0) {
    throw new Error('No slides found. Separate slides with a line containing only ---');
  }

  const slidesHtml = renderSlidesHtml(slides, baseDir);
  return buildHtml({ slidesHtml, frontMatter });
}

function buildFromFile(inputPath, outputPath) {
  const absoluteInput = path.resolve(inputPath);
  const markdown = fs.readFileSync(absoluteInput, 'utf8');
  const html = buildFromMarkdown(markdown, { baseDir: path.dirname(absoluteInput) });
  fs.writeFileSync(path.resolve(outputPath), html, 'utf8');
}

module.exports = {
  buildFromFile,
  buildFromMarkdown,
  parseSlides,
};
