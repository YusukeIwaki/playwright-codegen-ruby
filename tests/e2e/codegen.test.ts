import { test, expect, describe, afterEach } from 'vitest';
import { CLITestHelper } from '../utils/cliTestHelper.js';
import { HTML_PAGES } from '../fixtures/htmlPages.js';

describe('Playwright Codegen Ruby E2E Tests', () => {
  const helper = new CLITestHelper();

  // Cleanup after tests
  afterEach(async () => {
    await helper.cleanup();
  });

  test('should generate Ruby code', async () => {
    await helper.startCLI();
    const output = await helper.cleanup();

    expect(output).toContain(`
require "playwright"

Playwright.create(playwright_cli_executable_path: './node_modules/.bin/playwright') do |playwright|
  playwright.chromium.launch(headless: false) do |browser|
    context = browser.new_context
    page = context.new_page

    # Recorded actions:
    page.close
  end
end
`)
  });

  test('should generate Ruby code for browsing URL', async () => {
    await helper.startCLI('about:blank');
    const output = await helper.cleanup();

    expect(output).toContain(`
require "playwright"

Playwright.create(playwright_cli_executable_path: './node_modules/.bin/playwright') do |playwright|
  playwright.chromium.launch(headless: false) do |browser|
    context = browser.new_context
    page = context.new_page

    page.goto("about:blank")

    # Recorded actions:
    page.close
  end
end
`)
  });

  test('should generate Ruby code for login form interactions', async () => {
    const context = await helper.startCLI();

    try {
      // Set up login form page
      await context.page.setContent(HTML_PAGES.loginForm);

      // Fill in login form
      await context.page.fill('#username', 'admin@example.com');
      await context.page.fill('#password', 'secretpassword123');
      await context.page.check('#remember-me');
      await context.page.click('#login-btn');

      // Wait briefly to ensure code generation
      await helper.wait(1000);

      // Verify generated Ruby code
      helper.expectOutputContains([
        '# Recorded actions:',
        'page.fill("aria-ref=e7", "admin@example.com")',
        'page.fill("aria-ref=e10", "secretpassword123")',
        'page.check("aria-ref=e13")',
        'page.click("aria-ref=e14")',
      ]);

      console.log('✅ Login form test passed - Ruby code generated correctly');

    } catch (error) {
      console.error('Error during login form test:', error);
      throw error;
    }
  }, 30000);

  test('should generate Ruby code for basic form interactions', async () => {
    const context = await helper.startCLI();

    try {
      // Set up basic form page
      await context.page.setContent(HTML_PAGES.basicForm);

      // Fill in basic form
      await context.page.fill('#name', 'John Doe');
      await context.page.fill('#email', 'john.doe@test.com');
      await context.page.click('#submit-btn');

      // Wait briefly to ensure code generation
      await helper.wait(1000);

      // Verify generated Ruby code
      helper.expectOutputContains([
        '# Recorded actions:',
        'page.fill("aria-ref=e4", "John Doe")',
        'page.fill("aria-ref=e5", "john.doe@test.com")',
        'page.click("aria-ref=e6")'
      ]);

      console.log('✅ Basic form test passed - Ruby code generated correctly');

    } catch (error) {
      console.error('Error during basic form test:', error);
      throw error;
    }
  }, 30000);

  test('should handle empty form submission', async () => {
    const context = await helper.startCLI();

    try {
      // Set up login form page
      await context.page.setContent(HTML_PAGES.loginForm);

      // Click login button with empty form
      await context.page.click('#login-btn');

      // Wait briefly to ensure code generation
      await helper.wait(1000);

      // Verify that basic Ruby structure is generated
      helper.expectOutputContains([
        '# Recorded actions:',
        'page.click("aria-ref=e14")'
      ]);

      console.log('✅ Empty form test passed - Basic Ruby code structure generated');

    } catch (error) {
      console.error('Error during empty form test:', error);
      throw error;
    }
  }, 30000);
});
