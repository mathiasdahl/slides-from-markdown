#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { buildFromFile } = require('../lib/build');
const { initExample } = require('../lib/init-example');

function printHelp() {
  console.log(`Convert Markdown to a single-file reveal.js presentation.

Usage:
  md2slides <input.md> [options]
  md2slides init [folder] [options]

Commands:
  init [folder]         Copy the example slides.md and images/ folder
                        into the current directory or into <folder>

Options:
  -o, --output <file>   Output HTML file (default: same name as input, .html)
  --force               Overwrite existing example files (init only)
  -h, --help            Show this help

Slide syntax:
  Separate horizontal slides with a line containing only --- (blank lines optional).
  Separate vertical slides within one horizontal slide with --.

  Optional slide attributes (reveal.js data-* attributes):
    <!-- .slide: data-background="#1a1a2e" -->

Examples:
  md2slides init
  md2slides init my-deck
  md2slides slides.md -o slides.html
`);
}

function parseConvertArgs(argv) {
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

function parseInitArgs(argv) {
  const args = { targetDir: null, force: false, help: false };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '-h' || arg === '--help') {
      args.help = true;
    } else if (arg === '--force') {
      args.force = true;
    } else if (arg === '-o' || arg === '--output') {
      throw new Error('The --output option is only valid when converting a markdown file.');
    } else if (!arg.startsWith('-') && !args.targetDir) {
      args.targetDir = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function runConvert(argv) {
  const args = parseConvertArgs(argv);

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

  buildFromFile(inputPath, outputPath);
  console.log(`Wrote ${outputPath}`);
}

function runInit(argv) {
  const args = parseInitArgs(argv);

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const { targetDir, created } = initExample({
    targetDir: args.targetDir || process.cwd(),
    force: args.force,
  });

  console.log(`Created example deck in ${targetDir}:`);
  for (const file of created) {
    console.log(`  ${file}`);
  }

  const slidesPath = path.join(targetDir, 'slides.md');
  const htmlPath = path.join(targetDir, 'slides.html');
  console.log('');
  console.log('Next step:');
  console.log(`  md2slides ${slidesPath} -o ${htmlPath}`);
}

function main() {
  const argv = process.argv.slice(2);

  try {
    if (argv[0] === 'init') {
      runInit(argv.slice(1));
      return;
    }

    runConvert(argv);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
