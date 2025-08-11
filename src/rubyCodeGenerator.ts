export function generateRubyCode(action: any): string { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!action || !action.name) {
    return `# Invalid action`;
  }
  
  const { name } = action;
  
  try {
    switch (name) {
      case 'openPage':
        return `# Browser and page are already created`;
        
      case 'navigate':
        return `page.goto("${action.url || 'about:blank'}")`;
      
    case 'click': {
      if (!action.selector) return `# Click action without selector`;
      const selector = formatSelector(action.selector);
      return `page.click("${selector}")`;
    }
    
    case 'fill': {
      if (!action.selector) return `# Fill action without selector`;
      const selector = formatSelector(action.selector);
      const text = action.text || '';
      return `page.fill("${selector}", "${text}")`;
    }
    
    case 'press': {
      if (!action.selector) return `# Press action without selector`;
      const selector = formatSelector(action.selector);
      const key = action.key || '';
      return `page.press("${selector}", "${key}")`;
    }
    
    case 'check': {
      if (!action.selector) return `# Check action without selector`;
      const selector = formatSelector(action.selector);
      return `page.check("${selector}")`;
    }
    
    case 'uncheck': {
      if (!action.selector) return `# Uncheck action without selector`;
      const selector = formatSelector(action.selector);
      return `page.uncheck("${selector}")`;
    }
    
    case 'select': {
      if (!action.selector) return `# Select action without selector`;
      const selector = formatSelector(action.selector);
      if (!action.options || action.options.length === 0) {
        return `page.select_option("${selector}", value: [])`;
      }
      const values = action.options.map((opt: any) => `"${opt}"`).join(', '); // eslint-disable-line @typescript-eslint/no-explicit-any
      return `page.select_option("${selector}", value: [${values}])`;
    }
    
    case 'setInputFiles': {
      if (!action.selector) return `# SetInputFiles action without selector`;
      const selector = formatSelector(action.selector);
      if (!action.files || action.files.length === 0) {
        return `page.set_input_files("${selector}", [])`;
      }
      const files = action.files.map((f: string) => `"${f}"`).join(', ');
      return `page.set_input_files("${selector}", [${files}])`;
    }
    
    case 'hover': {
      if (!action.selector) return `# Hover action without selector`;
      const selector = formatSelector(action.selector);
      return `page.hover("${selector}")`;
    }
    
    case 'waitForNavigation':
      return `# Wait for navigation`;
      
    case 'waitForLoadState':
      return `page.wait_for_load_state("${action.state || 'load'}")`;
      
    case 'assertText': {
      if (!action.selector) return `# AssertText action without selector`;
      const selector = formatSelector(action.selector);
      const text = action.text || '';
      return `expect(page.locator("${selector}")).to have_text("${text}")`;
    }
    
    case 'assertValue': {
      if (!action.selector) return `# AssertValue action without selector`;
      const selector = formatSelector(action.selector);
      const value = action.value || '';
      return `expect(page.locator("${selector}")).to have_value("${value}")`;
    }
    
    case 'assertChecked': {
      if (!action.selector) return `# AssertChecked action without selector`;
      const selector = formatSelector(action.selector);
      return `expect(page.locator("${selector}")).to be_checked`;
    }
    
    case 'assertVisible': {
      if (!action.selector) return `# AssertVisible action without selector`;
      const selector = formatSelector(action.selector);
      return `expect(page.locator("${selector}")).to be_visible`;
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

function formatSelector(selector: string | undefined | null): string {
  // Handle undefined or null selector
  if (!selector) {
    return '';
  }
  
  // Handle aria-ref selectors (internal Playwright format)
  if (selector.startsWith('aria-ref=')) {
    // This is an internal reference, we need to use a different selector
    return selector; // Will be handled by Playwright
  }
  
  // Handle getByRole, getByText, etc.
  if (selector.startsWith('getBy')) {
    const match = selector.match(/getBy(\w+)\("([^"]+)"\)/);
    if (match) {
      const [, method, value] = match;
      switch (method.toLowerCase()) {
        case 'role':
          return `role=${value}`;
        case 'text':
          return `text=${value}`;
        case 'label':
          return `label=${value}`;
        case 'placeholder':
          return `placeholder=${value}`;
        case 'title':
          return `title=${value}`;
        case 'testid':
          return `data-testid=${value}`;
        default:
          return selector;
      }
    }
  }
  
  // Escape quotes in selector
  return selector.replace(/"/g, '\\"');
}