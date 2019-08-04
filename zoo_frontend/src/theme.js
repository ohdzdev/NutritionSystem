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

export default theme;
