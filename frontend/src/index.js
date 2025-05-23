import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/jura/300.css';
import '@fontsource/jura/400.css';
import '@fontsource/jura/500.css';
import '@fontsource/jura/700.css';
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/500.css';
import '@fontsource/noto-sans-sc/700.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Jura", sans-serif',
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Noto Sans SC", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 500,
    },
    body2: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Jura", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
); 