# playwright-codegen-ruby

A Ruby-specific code generator for Playwright, providing a CLI tool to record browser interactions and generate Ruby test code.

## Overview

```bash
npx playwright-codegen-ruby [--browser chromium] [--channel chrome] [url]
```

It launches a browser and records activities just like `npx playwright codegen`, but generates Ruby code using the [playwright-ruby-client](https://github.com/YusukeIwaki/playwright-ruby-client) library.

While the official codegen shows a window for generated code, this is a CLI application implemented with [React Ink](https://github.com/vadimdemedes/ink) for terminal-based UI.

## Features

- 🌐 Chromium-based browser support (system Chrome, Edge, etc.)
- 📝 Generates complete Ruby scripts compatible with playwright-ruby-client
- 🖥️ Terminal-based interface using React Ink
- 🔧 Support for browser channels (Chrome, Edge, etc.)
- 🎯 Real-time recording of browser interactions
- 📋 Displays complete, copy-paste ready Ruby scripts
- ✨ Proper indentation and Ruby code formatting
- 🔄 Automatic duplicate action filtering
- 🐛 Remote debugging support with configurable port

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

# Use Chrome stable channel
npm start -- --channel chrome https://example.com

# Use Microsoft Edge
npm start -- --channel msedge https://example.com

# Use custom debug port (default: 9223)
npm start -- --port 9224 https://example.com

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

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## Usage Examples

```bash
# Record interactions on example.com
npx playwright-codegen-ruby https://example.com

# Use system Chrome instead of Chromium
npx playwright-codegen-ruby --channel chrome https://example.com

# Use custom debug port for multiple instances
npx playwright-codegen-ruby --port 9224 https://example.com

# Use Microsoft Edge with custom port
npx playwright-codegen-ruby --channel msedge --port 9225 https://example.com
```

### Generated Code Example

The tool generates complete Ruby scripts that can be directly executed:

```ruby
require "playwright"

Playwright.create(playwright_cli_executable_path: './node_modules/.bin/playwright') do |playwright|
  playwright.chromium.launch(headless: false) do |browser|
    context = browser.new_context
    page = context.new_page

    page.goto("https://example.com")

    # Recorded actions:
    page.click("button[type=\"submit\"]")
    page.fill("input[name=\"email\"]", "user@example.com")
    page.press("input[name=\"password\"]", "Enter")
  end
end
```

## Project Structure

```
playwright-codegen-ruby/
├── src/
│   ├── cli.tsx                # Main CLI entry point with Ruby script generation
│   ├── useBrowserRecorder.ts  # Browser recording hook
│   └── rubyCodeGenerator.ts   # Ruby code generation from Playwright actions
├── tests/
│   ├── e2e/
│   │   └── codegen.test.ts    # End-to-end tests for code generation
│   ├── fixtures/
│   │   └── htmlPages.ts       # Test HTML page templates
│   └── utils/
│       ├── cliTestHelper.ts   # Common test utilities
│       └── portUtils.ts       # Port detection utilities
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vitest.config.ts           # Test configuration
├── CLAUDE.md                  # Development guidelines for AI assistance
└── README.md                  # This file
```

## Implementation Status

### ✅ Completed
- Browser launching with Chromium support (fixed to Chromium for stability)
- Browser channel support (Chrome, Edge, etc.)
- React Ink terminal UI with proper formatting and improved layout
- Real-time action recording using Playwright's internal recorder
- Complete Ruby script generation with proper boilerplate
- Support for various action types (click, fill, press, check, select, etc.)
- Proper Ruby code indentation and formatting
- Error handling for undefined selectors
- Automatic duplicate action filtering
- Remote debugging support with configurable port (default: 9223)
- Proper cleanup on exit (SIGINT/SIGTERM)
- Comprehensive E2E test suite with multiple test scenarios
- Test utilities and fixtures for easy test expansion

### 🚧 In Progress / TODO
- Smart selector generation (currently using aria-ref selectors)
- Support for assertions and wait conditions
- File output and clipboard copy functionality
- Authentication state preservation
- Device emulation and viewport configuration
- Better selector strategies for more maintainable tests

## License

MIT
