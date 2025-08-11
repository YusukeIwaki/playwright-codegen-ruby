#!/usr/bin/env tsx

import React, { useEffect } from 'react';
import { render, Text, Box } from 'ink';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { useBrowserRecorder, RecordedAction } from './useBrowserRecorder.js';

interface AppProps {
  channel?: string;
  port: number;
  url?: string;
}

const argv = await yargs(hideBin(process.argv))
  .usage('$0 [url]')
  .positional('url', {
    describe: 'URL to open',
    type: 'string'
  })
  .option('channel', {
    alias: 'c',
    type: 'string',
    description: 'Browser channel to use (e.g., chrome, msedge)'
  })
  .option('port', {
    alias: 'p',
    type: 'number',
    description: 'Remote debugging port',
    default: 9223
  })
  .help()
  .argv;

const generateCompleteRubyScript = (channel: string | undefined, url: string | undefined, actions: RecordedAction[]): string[] => {
  const lines: string[] = [];

  // Add require statements
  lines.push('require "playwright"');
  lines.push('');

  // Start Playwright block with executable path
  lines.push(`Playwright.create(playwright_cli_executable_path: './node_modules/.bin/playwright') do |playwright|`);

  // Launch chromium browser with block
  let browserLine = `  playwright.chromium.launch(headless: false`;
  if (channel) {
    browserLine += `, channel: "${channel}"`;
  }
  browserLine += ') do |browser|';
  lines.push(browserLine);

  // Context and page setup
  lines.push('    context = browser.new_context');
  lines.push('    page = context.new_page');
  lines.push('');

  // Add initial navigation if URL provided
  if (url) {
    lines.push(`    page.goto("${url}")`);
    lines.push('');
  }

  // Add recorded actions with proper indentation
  const validActions = actions.filter((a: RecordedAction) => a.code && !a.code.startsWith('#'));
  if (validActions.length > 0) {
    lines.push('    # Recorded actions:');
    validActions.forEach((a: RecordedAction) => {
      // Skip duplicate navigation to the initial URL
      if (url && a.code.includes(`page.goto("${url}")`)) {
        return; // Skip this action since it's already handled in initial navigation
      }
      lines.push(`    ${a.code}`);
    });
  }

  // Close browser block
  lines.push('  end');
  // Close Playwright block
  lines.push('end');

  return lines;
};

const App: React.FC<AppProps> = ({ channel, port, url }) => {
  const { status, actions, stop } = useBrowserRecorder({ browserType: 'chromium', channel, port, url });

  // When process receives signals, ask hook to stop (once) then exit after short delay
  useEffect(() => {
    const handler = () => {
      void (async () => {
        await stop();
        setTimeout(() => process.exit(0), 50);
      })();
    };
    process.once('SIGINT', handler);
    process.once('SIGTERM', handler);
    return () => {
      process.off('SIGINT', handler);
      process.off('SIGTERM', handler);
    };
  }, [stop]);

  const rubyScript = generateCompleteRubyScript(channel, url, actions);

  return (
    <Box flexDirection="column">
      <Text color="green">🎭 Playwright Codegen for Ruby</Text>
      <Text>Browser: chromium{channel ? ` (${channel})` : ''} - Debug port: {port}</Text>
      {url && <Text>URL: {url}</Text>}
      <Text>Status: {status}</Text>
      <Text dimColor>Press Ctrl+C to quit.</Text>
      {actions.length > 0 && (
        <>
          <Text> </Text>
          <Text color="yellow">📝 Ruby Script</Text>
          <Text dimColor>────────────────────────────────────────────────────────────────────────────────────────────────────</Text>
          <Box width={100} flexDirection="column">
          {rubyScript.map((line: string, idx: number) => (
            <Text key={idx} color="cyan">{line || ' '}</Text>
          ))}
          </Box>
          <Text dimColor>────────────────────────────────────────────────────────────────────────────────────────────────────</Text>
        </>
      )}
    </Box>
  );
};

render(<App
  channel={argv.channel}
  port={argv.port}
  url={(argv as any)._?.[0]}
/>);
