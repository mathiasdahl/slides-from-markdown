#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { buildFromFile } = require('../lib/build');

function printHelp() {
  console.log(`Convert Markdown to a single-file reveal.js presentation.

Usage:
  md2slides <input.md> [options]

Options:
  -o, --output <file>   Output HTML file (default: same name as input, .html)
  -h, --help            Show this help

Slide syntax:
  Separate horizontal slides with a line containing only --- (blank lines optional).
  Separate vertical slides within one horizontal slide with --.

  Optional slide attributes (reveal.js data-* attributes):
    <!-- .slide: data-background="#1a1a2e" -->

Example:
  md2slides example/slides.md -o example/slides.html
`);
}

function parseArgs(argv) {
  const args = { input: null, output: null, help: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '-h' || arg === '--help') {
      args.help = true;
    } else if (arg === '-o' || arg === '--output') {
      args.output = argv[i + 1];
      i += 1;
    } else if (!arg.startsWith('-') && !args.input) {
      args.input = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function main() {
  let args;

  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  if (args.help || !args.input) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const inputPath = path.resolve(args.input);

  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const outputPath = args.output
    ? path.resolve(args.output)
    : inputPath.replace(/\.md$/i, '.html');

  try {
    buildFromFile(inputPath, outputPath);
    console.log(`Wrote ${outputPath}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
