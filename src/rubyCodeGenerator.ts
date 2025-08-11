import { Page, Locator } from 'playwright-core';

export async function generateRubyCode(action: any, page?: Page): Promise<string> { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!action || !action.name) {
    return `# Invalid action`;
  }
  
  const { name } = action;
  
  // Use generatedSelector if available (from generateLocatorString)
  const selectorToUse = action.generatedSelector || action.selector;
  
  try {
    switch (name) {
      case 'openPage':
        return `# Browser and page are already created`;
        
      case 'navigate':
        return `page.goto("${action.url || 'about:blank'}")`;
      
      case 'click': {
      if (!selectorToUse) return `# Click action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      return `page.${selector}.click`;
    }
    
    case 'fill': {
      if (!selectorToUse) return `# Fill action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      const text = action.text || '';
      return `page.${selector}.fill("${text}")`;
    }
    
    case 'press': {
      if (!selectorToUse) return `# Press action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      const key = action.key || '';
      return `page.${selector}.press("${key}")`;
    }
    
    case 'check': {
      if (!selectorToUse) return `# Check action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      return `page.${selector}.check`;
    }
    
    case 'uncheck': {
      if (!selectorToUse) return `# Uncheck action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      return `page.${selector}.uncheck`;
    }
    
    case 'select': {
      if (!selectorToUse) return `# Select action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      if (!action.options || action.options.length === 0) {
        return `page.${selector}.select_option(value: [])`;
      }
      const values = action.options.map((opt: any) => `"${opt}"`).join(', '); // eslint-disable-line @typescript-eslint/no-explicit-any
      return `page.${selector}.select_option(value: [${values}])`;
    }
    
    case 'setInputFiles': {
      if (!selectorToUse) return `# SetInputFiles action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      if (!action.files || action.files.length === 0) {
        return `page.${selector}.set_input_files([])`;
      }
      const files = action.files.map((f: string) => `"${f}"`).join(', ');
      return `page.${selector}.set_input_files([${files}])`;
    }
    
    case 'hover': {
      if (!selectorToUse) return `# Hover action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      return `page.${selector}.hover`;
    }
    
    case 'waitForNavigation':
      return `# Wait for navigation`;
      
    case 'waitForLoadState':
      return `page.wait_for_load_state("${action.state || 'load'}")`;
      
    case 'assertText': {
      if (!selectorToUse) return `# AssertText action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      const text = action.text || '';
      return `expect(page.${selector}).to have_text("${text}")`;
    }
    
    case 'assertValue': {
      if (!selectorToUse) return `# AssertValue action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      const value = action.value || '';
      return `expect(page.${selector}).to have_value("${value}")`;
    }
    
    case 'assertChecked': {
      if (!selectorToUse) return `# AssertChecked action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      return `expect(page.${selector}).to be_checked`;
    }
    
    case 'assertVisible': {
      if (!selectorToUse) return `# AssertVisible action without selector`;
      const selector = await formatSelector(selectorToUse, action.selector, page);
      return `expect(page.${selector}).to be_visible`;
    }
      
      // Additional action types that might occur
      case 'closePage':
        return `page.close`;
        
      case 'dialog':
        if (action.dialogAction === 'accept') {
          return `# Accept dialog`;
        } else {
          return `# Dismiss dialog`;
        }
        
      case 'download':
        return `# Handle download`;
        
      case 'popup':
        return `# Handle popup window`;
        
      case 'framenavigated':
        return `# Frame navigated`;
        
      default:
        return `# Unknown action: ${name}`;
    }
  } catch (error) {
    console.error('Error generating Ruby code:', error);
    return `# Error generating code for action: ${name}`;
  }
}

async function formatSelector(selector: string | undefined | null, originalSelector?: string, page?: Page): Promise<string> {
  // Handle undefined or null selector
  if (!selector) {
    return 'locator("")';
  }
  
  // Check if this is a JavaScript locator string (from generateLocatorString)
  if (selector.startsWith('getBy')) {
    return convertJsLocatorToRuby(selector);
  }
  
  // Handle aria-ref selectors (internal Playwright format) - should not reach here if generateLocatorString worked
  if (originalSelector && originalSelector.startsWith('aria-ref=')) {
    // Fall back to using aria-ref directly - the Ruby client should handle it
    return `locator("${originalSelector.replace(/"/g, '\\"')}")`;
  }
  
  // Handle getByRole, getByText, etc.
  if (selector.startsWith('getBy')) {
    const match = selector.match(/getBy(\w+)\("([^"]+)"\)/);
    if (match) {
      const [, method, value] = match;
      switch (method.toLowerCase()) {
        case 'role':
          return `locator("role=${value}")`;
        case 'text':
          return `locator("text=${value}")`;
        case 'label':
          return `locator("label=${value}")`;
        case 'placeholder':
          return `locator("placeholder=${value}")`;
        case 'title':
          return `locator("title=${value}")`;
        case 'testid':
          return `locator("data-testid=${value}")`;
        default:
          return `locator("${selector.replace(/"/g, '\\"')}")`;
      }
    }
  }
  
  // Escape quotes in selector and wrap in locator
  return `locator("${selector.replace(/"/g, '\\"')}")`;
}

function convertJsLocatorToRuby(jsLocator: string): string {
  // Convert JavaScript locator syntax to Ruby syntax
  // Examples:
  // getByRole('button', { name: 'Submit' }) -> get_by_role("button", name: "Submit")
  // getByText('Hello') -> get_by_text("Hello")
  // getByPlaceholder('Enter text') -> get_by_placeholder("Enter text")
  
  // Match method name and arguments
  const match = jsLocator.match(/(getBy\w+)\((.*)\)/);
  if (!match) {
    return `locator("${jsLocator.replace(/"/g, '\\"')}")`;
  }
  
  const [, methodName, args] = match;
  
  // Convert camelCase to snake_case
  const rubyMethodName = methodName.replace(/([A-Z])/g, '_$1').toLowerCase();
  
  // Parse and convert arguments
  let rubyArgs = args;
  
  // Replace single quotes with double quotes
  rubyArgs = rubyArgs.replace(/'/g, '"');
  
  // Convert object notation { key: value } to Ruby hash notation key: value
  rubyArgs = rubyArgs.replace(/\{\s*(\w+):\s*/g, '$1: ');
  rubyArgs = rubyArgs.replace(/\s*\}/g, '');
  
  // Handle multiple arguments separated by comma
  if (rubyArgs.includes(',')) {
    // Split arguments and process each
    const argParts = rubyArgs.split(/,\s*(?![^{]*})/).map(part => part.trim());
    return `${rubyMethodName}(${argParts.join(', ')})`;
  }
  
  return `${rubyMethodName}(${rubyArgs})`;
}

function convertSelectorToRuby(selector: string): string {
  // Try to convert internal selector formats to Ruby-style locators
  
  // Handle role selectors
  if (selector.startsWith('role=')) {
    const parts = selector.substring(5).split('[');
    const role = parts[0];
    
    // Extract attributes like name
    if (parts[1]) {
      const nameMatch = parts[1].match(/name="([^"]+)"/);
      if (nameMatch) {
        return `get_by_role("${role}", name: "${nameMatch[1]}")`;
      }
    }
    return `get_by_role("${role}")`;
  }
  
  // Handle text selectors
  if (selector.startsWith('text=')) {
    const text = selector.substring(5);
    return `get_by_text("${text.replace(/"/g, '\\"')}")`;
  }
  
  // Handle placeholder selectors
  if (selector.startsWith('placeholder=')) {
    const placeholder = selector.substring(12);
    return `get_by_placeholder("${placeholder.replace(/"/g, '\\"')}")`;
  }
  
  // Handle label selectors
  if (selector.startsWith('label=')) {
    const label = selector.substring(6);
    return `get_by_label("${label.replace(/"/g, '\\"')}")`;
  }
  
  // Handle test-id selectors
  if (selector.startsWith('data-testid=')) {
    const testId = selector.substring(12);
    return `get_by_test_id("${testId.replace(/"/g, '\\"')}")`;
  }
  
  // Default: use locator with the selector as-is
  return `locator("${selector.replace(/"/g, '\\"')}")`;
}