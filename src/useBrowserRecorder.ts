import { useEffect, useState, useRef, useCallback } from 'react';
import { chromium, firefox, webkit, Browser, Page } from 'playwright-core';
import { generateRubyCode } from './rubyCodeGenerator.js';

interface UseBrowserRecorderParams {
  browserType: 'chromium' | 'firefox' | 'webkit';
  channel?: string;
  port: number;
  url?: string;
}

export interface RecordedAction {
  code: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

class ReactiveRecorderLog {
  private pushCb: (action: RecordedAction[]) => void;
  actions: RecordedAction[] = [];

  constructor(pushCb: (actions: RecordedAction[]) => void) {
    this.pushCb = pushCb;
  }

  /**
   * Improve action by resolving aria-ref selectors to getByXxx format
   */
  private async improveAction(page: Page, action: any): Promise<any> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const improvedAction = { ...action };
    
    if (improvedAction.selector && improvedAction.selector.startsWith('aria-ref=')) {
      try {
        // Try to use internal generateLocatorString API if available
        await (page as any)._snapshotForAI(); // eslint-disable-line @typescript-eslint/no-explicit-any
        const locator = page.locator(improvedAction.selector);
        const locatorString = await (locator as any)._generateLocatorString(); // eslint-disable-line @typescript-eslint/no-explicit-any
        if (locatorString) {
          improvedAction.generatedSelector = locatorString;
        }
      } catch (e) {
        // Ignore errors and fall back to original selector
      }
    }

    return improvedAction;
  }

  async actionAdded(page: Page, actionInContext: any, _code: string): Promise<void> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const improvedAction = await this.improveAction(page, actionInContext.action);
    const rubyCode = await generateRubyCode(improvedAction, page);
    this.actions.push({ ...actionInContext, code: rubyCode });
    this.pushCb([...this.actions]);
  }

  async actionUpdated(page: Page, actionInContext: any, _code: string): Promise<void> { // eslint-disable-line @typescript-eslint/no-explicit-any
    const improvedAction = await this.improveAction(page, actionInContext.action);
    const rubyCode = await generateRubyCode(improvedAction, page);
    this.actions[this.actions.length - 1] = { ...actionInContext, code: rubyCode };
    this.pushCb([...this.actions]);
  }
}

export function useBrowserRecorder({ browserType, channel, port, url }: UseBrowserRecorderParams) {
  const [status, setStatus] = useState<string>('Starting...');
  const [actions, setActions] = useState<RecordedAction[]>([]);
  const browserRef = useRef<Browser | null>(null);
  const startedRef = useRef(false);
  const stoppingRef = useRef(false);

  const stop = useCallback(async () => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    setStatus('Closing browser...');
    try {
      await browserRef.current?.close();
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (startedRef.current) return; // avoid relaunch if props change mid-flight
      startedRef.current = true;
      try {
        setStatus(`Launching ${browserType}${channel ? ` (${channel})` : ''}...`);
        const browsers = { chromium, firefox, webkit } as const;
        const selectedBrowser = browsers[browserType];
        const launchOptions: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
            headless: false,
            args: [
                // Add remote debugging port for chromium
                `--remote-debugging-port=${port}`
            ]
        };
        if (channel) launchOptions.channel = channel;
        const browser = await selectedBrowser.launch(launchOptions);
        browserRef.current = browser;
        const context = await browser.newContext({ viewport: null });
        const recorderLog = new ReactiveRecorderLog(setActions);

        // Enable recorder with proper options
        const recorderOptions = {
          mode: 'recording',
          outputFile: undefined,
          handleSIGINT: false,
          recorderMode: 'api',
        };

        try {
          (context as any)._enableRecorder(recorderOptions, recorderLog); // eslint-disable-line @typescript-eslint/no-explicit-any
        } catch (error) {
          console.error('Failed to enable recorder:', error);
        }

        const page = await context.newPage();
        if (url) await page.goto(url);
        if (!cancelled) {
          setStatus(`${browserType}${channel ? ` (${channel})` : ''} is running. Debug at http://localhost:${port}. Press Ctrl+C to exit.`);
        }
      } catch (e) {
        if (!cancelled) setStatus(`Error: ${(e as Error).message}`);
      }
    })();
    return () => {
      cancelled = true;
      void stop();
    };
  }, [browserType, channel, port, url, stop]);

  return { status, actions, stop };
}
