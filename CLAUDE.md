# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **playwright-codegen-ruby** - a Ruby-specific implementation of Playwright's code generation tool. The project aims to provide a CLI tool that launches a browser, records user interactions, and generates Ruby test code using the playwright-ruby-client library.

Key differentiator: Uses React Ink for a CLI interface instead of the GUI window that the official Playwright codegen provides.

## Architecture

### Expected Structure
- **CLI Interface**: React Ink-based terminal UI for interaction recording
- **Browser Control**: Playwright integration for browser automation
- **Code Generation**: Outputs Ruby code compatible with playwright-ruby-client
- **Multi-browser Support**: Chromium, Firefox, WebKit

### Technology Stack
- Node.js/JavaScript for browser interaction and CLI
- React Ink for terminal UI
- Playwright for browser automation
- Output: Ruby code using playwright-ruby-client APIs

## Current Status

**Base Implementation Complete** - CLI launches Playwright browsers with TypeScript/TSX and React Ink interface. Core recording and code generation features pending.

## Development Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers (required for first-time setup)
npx playwright install chromium  # or firefox, webkit

# Start the CLI
npm start
npm start https://example.com
npm start -- -b firefox https://example.com
npm start -- --channel chrome https://google.com

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

## Key Features to Implement

- Browser launching with recording capabilities
- Real-time Ruby code generation as user interacts
- Smart locator generation with fallback strategies
- Support for assertions and wait conditions
- Device emulation and viewport configuration
- Authentication state preservation

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
  -b, --browser    Browser to use (chromium, firefox, webkit)
  -c, --channel    Browser channel (chrome, msedge, etc.)
  --help          Show help
```

### Browser Launch Configuration
- **Headless**: Always false (user needs to see the browser)
- **Viewport**: Set to null for full window size
- **Channel Support**: Allows using system-installed browsers (Chrome, Edge)

### Next Implementation Steps
1. Add Playwright Inspector integration for recording
2. Implement action recording event listeners
3. Create Ruby code generation from recorded actions
4. Add file output and clipboard copy features
5. Implement selector generation strategies