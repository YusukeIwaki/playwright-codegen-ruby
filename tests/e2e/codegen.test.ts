import { test, expect, describe, afterEach } from 'vitest';
import { CLITestHelper } from '../utils/cliTestHelper.js';
import { HTML_PAGES } from '../fixtures/htmlPages.js';

describe('Playwright Codegen Ruby E2E Tests', () => {
  const helper = new CLITestHelper();

  // テスト後のクリーンアップ
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
      // ログインフォームページを設定
      await context.page.setContent(HTML_PAGES.loginForm);

      // ログインフォームに入力
      await context.page.fill('#username', 'admin@example.com');
      await context.page.fill('#password', 'secretpassword123');
      await context.page.check('#remember-me');
      await context.page.click('#login-btn');

      // コード生成を確実にするため少し待機
      await helper.wait(1000);

      // 生成されたRubyコードを検証
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
      // 基本フォームページを設定
      await context.page.setContent(HTML_PAGES.basicForm);

      // 基本フォームに入力
      await context.page.fill('#name', 'John Doe');
      await context.page.fill('#email', 'john.doe@test.com');
      await context.page.click('#submit-btn');

      // コード生成を確実にするため少し待機
      await helper.wait(1000);

      // 生成されたRubyコードを検証
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
      // ログインフォームページを設定
      await context.page.setContent(HTML_PAGES.loginForm);

      // 空の状態でログインボタンをクリック
      await context.page.click('#login-btn');

      // コード生成を確実にするため少し待機
      await helper.wait(1000);

      // 最低限のRuby構造が生成されていることを検証
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
