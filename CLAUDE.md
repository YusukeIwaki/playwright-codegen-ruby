# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **playwright-codegen-ruby** - a Ruby-specific implementation of Playwright's code generation tool. The project aims to provide a CLI tool that launches a browser, records user interactions, and generates Ruby test code using the playwright-ruby-client library.

Key differentiator: Uses React Ink for a CLI interface instead of the GUI window that the official Playwright codegen provides.

## Architecture

### Expected Structure
- **CLI Interface**: React Ink-based terminal UI for interaction recording
- **Browser Control**: Chromium-based browser automation (fixed for stability)
- **Code Generation**: Outputs Ruby code compatible with playwright-ruby-client
- **Channel Support**: Chrome, Edge, and other Chromium-based browsers

### Technology Stack
- Node.js/JavaScript for browser interaction and CLI
- React Ink for terminal UI
- Playwright for browser automation
- Output: Ruby code using playwright-ruby-client APIs

## Current Status

**Core Recording and Code Generation Complete** - CLI launches browsers, records interactions, and generates complete Ruby scripts with proper playwright-ruby-client syntax. Ready for selector improvements and advanced features.

## Development Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers (required for first-time setup)
npx playwright install chromium  # or firefox, webkit

# Start the CLI
npm start
npm start https://example.com
npm start -- --channel chrome https://google.com
npm start -- --port 9224 https://example.com

# Development mode (watches for file changes)
npm run dev

# Type checking
npm run typecheck

# Build TypeScript
npm run build
```

## Integration Context

This tool is part of YusukeIwaki's Playwright Ruby ecosystem:
- **playwright-ruby-client**: Ruby bindings for Playwright (the output of this tool uses this library)
- **capybara-playwright-driver**: Playwright driver for Capybara
- **puppeteer-ruby**: Ruby port of Puppeteer

When implementing features, ensure generated Ruby code follows playwright-ruby-client conventions and syntax.

## Implementation Guidelines

1. **Code Generation**: Generated Ruby code should follow playwright-ruby-client API patterns
2. **CLI Design**: Use React Ink components for terminal UI, avoiding GUI dependencies
3. **Locator Strategy**: Implement smart selector generation similar to official Playwright codegen
4. **Browser Context**: Support authentication state, cookies, and viewport settings

## Completed Features

- ✅ Browser launching with recording capabilities (Chromium-based, fixed for stability)
- ✅ Browser channel support (Chrome, Edge, etc.) 
- ✅ Real-time Ruby code generation as user interacts
- ✅ Complete Ruby script generation with proper boilerplate
- ✅ Action type support (click, fill, press, check, select, etc.)
- ✅ Error handling for undefined selectors
- ✅ React Ink terminal UI with proper formatting
- ✅ Automatic duplicate action filtering
- ✅ Remote debugging support with configurable port (--port option, default: 9223)

## Key Features to Implement

- Smart locator generation with fallback strategies (currently using aria-ref)
- Support for assertions and wait conditions
- Device emulation and viewport configuration
- Authentication state preservation
- File output and clipboard copy functionality
- Better selector strategies for maintainable tests

## Important Implementation Notes

### Current Architecture
- **TypeScript/TSX**: Using tsx for direct execution without build step
- **CLI Entry Point**: `src/cli.tsx` with shebang `#!/usr/bin/env tsx`
- **Browser Management**: Proper cleanup on SIGINT/SIGTERM to prevent orphaned browser processes
- **Argument Parsing**: yargs for CLI arguments (browser type, channel, URL)

### Command-Line Interface
```bash
# Usage pattern matches official Playwright codegen
npx playwright-codegen-ruby [options] [url]

Options:
  -c, --channel    Browser channel (chrome, msedge, etc.)
  -p, --port       Remote debugging port (default: 9223)
  --help          Show help
```

### Browser Launch Configuration
- **Browser**: Fixed to Chromium for stability and consistency
- **Headless**: Always false (user needs to see the browser)
- **Viewport**: Set to null for full window size
- **Channel Support**: Allows using system-installed browsers (Chrome, Edge)
- **Remote Debugging**: Configurable port (--port option, default: 9223)

### Architecture Details
- **Recording**: Uses Playwright's internal `_enableRecorder` API with custom ReactiveRecorderLog
- **Code Generation**: Transforms Playwright actions into Ruby code via `rubyCodeGenerator.ts`
- **Script Template**: Generates complete scripts with `Playwright.create` boilerplate
- **Terminal Output**: Real-time display of generated Ruby code with proper formatting

### Next Implementation Steps
1. Improve selector generation (replace aria-ref with better strategies)
2. Add assertions and wait condition support
3. Implement file output and clipboard copy features
4. Add device emulation and viewport configuration
5. Enhance error handling and edge cases