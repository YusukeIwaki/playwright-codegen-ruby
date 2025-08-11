#!/usr/bin/env tsx

import { chromium, firefox, webkit, Browser, Page } from 'playwright-core';
import React, { useEffect, useState } from 'react';
import { render, Text, Box } from 'ink';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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
  const [browser, setBrowser] = useState<Browser | null>(null);
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    let browserInstance: Browser | null = null;
    let page: Page | null = null;

    const launch = async () => {
      try {
        setStatus(`Launching ${browserType}${channel ? ` (${channel})` : ''}...`);

        const browsers = {
          chromium,
          firefox,
          webkit
        };

        const selectedBrowser = browsers[browserType];

        const launchOptions: any = { headless: false };

        if (channel) {
          launchOptions.channel = channel;
        }

        browserInstance = await selectedBrowser.launch(launchOptions);

        setBrowser(browserInstance);

        const context = await browserInstance.newContext({
          viewport: null
        });

        page = await context.newPage();
        
        if (url) {
          await page.goto(url);
        }

        setStatus(`${browserType}${channel ? ` (${channel})` : ''} is running. Press Ctrl+C to exit.`);
      } catch (error) {
        setStatus(`Error: ${(error as Error).message}`);
        process.exit(1);
      }
    };

    launch();

    const cleanup = async () => {
      setStatus('Closing browser...');
      if (browserInstance) {
        await browserInstance.close();
      }
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    return () => {
      cleanup();
    };
  }, [browserType, channel, url]);

  return (
    <Box flexDirection="column">
      <Text color="green">🎭 Playwright Codegen for Ruby</Text>
      <Text>Browser: {browserType}{channel ? ` (${channel})` : ''}</Text>
      {url && <Text>URL: {url}</Text>}
      <Text>Status: {status}</Text>
    </Box>
  );
};

render(<App 
  browserType={argv.browser as 'chromium' | 'firefox' | 'webkit'} 
  channel={argv.channel} 
  url={(argv as any)._?.[0]} 
/>);