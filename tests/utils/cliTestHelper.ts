import { spawn, ChildProcess } from 'child_process';
import { chromium, Browser, Page } from 'playwright-core';
import { findAvailablePort } from './portUtils.js';

export interface CLITestContext {
  cliProcess: ChildProcess;
  browser: Browser;
  page: Page;
  debugPort: number;
  cliOutput: string;
}

export class CLITestHelper {
  private context: CLITestContext | null = null;

  /**
   * Start CLI process and connect to browser
   */
  async startCLI(url?: string): Promise<CLITestContext> {
    // Find available port
    const debugPort = await findAvailablePort(9225, 9230);
    console.log(`Using debug port: ${debugPort}`);

    let cliOutput = '';

    // CLIプロセスを起動
    const args = ['src/cli.tsx', '--port', debugPort.toString()];
    if (url) {
      args.push(url);
    }
    const cliProcess = spawn('tsx', args, {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Capture CLI output
    cliProcess.stdout?.on('data', (data) => {
      cliOutput += data.toString();
    });

    cliProcess.stderr?.on('data', (data) => {
      console.error('CLI stderr:', data.toString());
    });

    // Wait for CLI to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Connect to browser via CDP
    const browser = await chromium.connectOverCDP(`http://localhost:${debugPort}`);
    const contexts = browser.contexts();

    if (contexts.length === 0) {
      throw new Error('No browser contexts found');
    }

    const context = contexts[0];
    const pages = context.pages();

    if (pages.length === 0) {
      throw new Error('No pages found in browser context');
    }

    const page = pages[0];

    this.context = {
      cliProcess,
      browser,
      page,
      debugPort,
      get cliOutput() { return cliOutput; }
    };

    return this.context;
  }

  /**
   * Properly terminate CLI process and browser
   */
  async cleanup(): Promise<string> {
    if (!this.context) return '';

    const { cliProcess, browser } = this.context;

    try {
      // Close browser
      if (browser) {
        await browser.close();
      }
    } catch (error) {
      console.error('Error closing browser:', error);
    }

    // Terminate CLI process
    if (cliProcess && !cliProcess.killed) {
      cliProcess.kill('SIGTERM');

      // Wait for process termination
      await new Promise(resolve => {
        cliProcess.on('exit', resolve);
        setTimeout(() => {
          cliProcess.kill('SIGKILL');
          resolve(undefined);
        }, 5000);
      });
    }

    const lastCliOutput = this.context.cliOutput || '';
    this.context = null;
    return lastCliOutput;
  }

  /**
   * Get current CLI output
   */
  getCLIOutput(): string {
    return this.context?.cliOutput || '';
  }

  /**
   * Wait for specified time
   */
  async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if expected Ruby code is included in output
   */
  expectOutputContains(expectedStrings: string[]): void {
    const output = this.getCLIOutput();
    console.log('Checking CLI Output for expected strings');

    expectedStrings.forEach((expectedString) => {
      if (!output.includes(expectedString)) {
        throw new Error(`Expected string not found in output: "${expectedString}"`);
      }
    });

    console.log(`✅ All ${expectedStrings.length} expected strings found in output`);
  }
}
