import { SheetsRegistry } from 'jss';
import { createGenerateClassName } from '@material-ui/core/styles';

import { createMuiTheme } from '@material-ui/core';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#689f38',
      light: '#dcedc8',
      dark: '#33691e',
    },
    secondary: {
      main: '#ef6c00',
      light: '#ffe0b2',
      dark: '#e65100',
    },
    type: 'light',
  },
  typography: {
  },
});

function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

let pageContext;

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!pageContext) {
    pageContext = createPageContext();
  }

  return pageContext;
}

export { theme };
