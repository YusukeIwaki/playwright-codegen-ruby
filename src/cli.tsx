#!/usr/bin/env tsx

import React, { useEffect } from 'react';
import { render, Text, Box } from 'ink';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { useBrowserRecorder, RecordedAction } from './useBrowserRecorder.js';

interface AppProps {
  browserType: 'chromium' | 'firefox' | 'webkit';
  channel?: string;
  url?: string;
}

const argv = await yargs(hideBin(process.argv))
  .usage('$0 [url]')
  .positional('url', {
    describe: 'URL to open',
    type: 'string'
  })
  .option('browser', {
    alias: 'b',
    type: 'string',
    description: 'Browser to use',
    choices: ['chromium', 'firefox', 'webkit'] as const,
    default: 'chromium'
  })
  .option('channel', {
    alias: 'c',
    type: 'string',
    description: 'Browser channel to use (e.g., chrome, msedge)'
  })
  .help()
  .argv;

const App: React.FC<AppProps> = ({ browserType, channel, url }) => {
  const { status, actions, stop } = useBrowserRecorder({ browserType, channel, url });

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

  return (
    <Box flexDirection="column">
      <Text color="green">🎭 Playwright Codegen for Ruby</Text>
      <Text>Browser: {browserType}{channel ? ` (${channel})` : ''}</Text>
      {url && <Text>URL: {url}</Text>}
      <Text>Status: {status}</Text>
      <Text dimColor>Press Ctrl+C to quit.</Text>
      {actions.length > 0 && (
        <>
          <Text> </Text>
          <Text color="yellow">📝 Generated Ruby Code:</Text>
          {actions
            .filter((a: RecordedAction) => a.code && !a.code.startsWith('#'))
            .slice(-10)
            .map((a: RecordedAction, idx: number) => (
              <Text key={idx} color="cyan">  {a.code}</Text>
            ))}
        </>
      )}
    </Box>
  );
};

render(<App
  browserType={argv.browser as 'chromium' | 'firefox' | 'webkit'}
  channel={argv.channel}
  url={(argv as any)._?.[0]}
/>);
