import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9b1d3f',
      light: '#c85a75',
      dark: '#6c0a26'
    },
    secondary: {
      main: '#f0c060',
      light: '#f7d993',
      dark: '#c59736'
    },
    background: {
      default: '#fdf8f3',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 16
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    },
    button: {
      textTransform: 'none',
      fontSize: '1rem',
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(135deg, #9b1d3f, #c85a75)',
          boxShadow: '0 8px 16px rgba(155, 29, 63, 0.25)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #831235, #b54765)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          borderColor: 'rgba(155, 29, 63, 0.12)'
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
