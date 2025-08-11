# playwright-codegen-ruby

A Ruby-specific code generator for Playwright, providing a CLI tool to record browser interactions and generate Ruby test code.

## Overview

```bash
npx playwright-codegen-ruby [--browser chromium] [--channel chrome] [url]
```

It launches a browser and records activities just like `npx playwright codegen`, but generates Ruby code using the [playwright-ruby-client](https://github.com/YusukeIwaki/playwright-ruby-client) library.

While the official codegen shows a window for generated code, this is a CLI application implemented with [React Ink](https://github.com/vadimdemedes/ink) for terminal-based UI.

## Features

- 🌐 Multi-browser support (Chromium, Firefox, WebKit)
- 📝 Generates Ruby code compatible with playwright-ruby-client
- 🖥️ Terminal-based interface using React Ink
- 🔧 Support for browser channels (Chrome, Edge, etc.)

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YusukeIwaki/playwright-codegen-ruby.git
cd playwright-codegen-ruby
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers (first-time setup):
```bash
# Install specific browser
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit

# Or install all browsers
npx playwright install
```

### Running the CLI

```bash
# Start with default browser (Chromium)
npm start

# Open a specific URL
npm start https://example.com

# Use Firefox
npm start -- -b firefox https://example.com

# Use Chrome stable channel
npm start -- --channel chrome https://example.com

# Use Microsoft Edge
npm start -- -b chromium --channel msedge https://example.com

# Show help
npm start -- --help
```

### Development Mode

```bash
# Run with file watching (auto-restart on changes)
npm run dev

# Type checking
npm run typecheck

# Build TypeScript
npm run build
```

## Usage Examples

```bash
# Record interactions on example.com
npx playwright-codegen-ruby https://example.com

# Use WebKit browser
npx playwright-codegen-ruby -b webkit https://example.com

# Use system Chrome instead of Chromium
npx playwright-codegen-ruby --channel chrome https://example.com
```

## Project Structure

```
playwright-codegen-ruby/
├── src/
│   └── cli.tsx          # Main CLI entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## License

MIT
