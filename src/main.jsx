import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFC7C7',
      light: '#FFE2E2',
      dark: '#AAAAAA'
    },
    secondary: {
      main: '#AAAAAA',
      light: '#FFE2E2',
      dark: '#AAAAAA'
    },
    background: {
      default: '#F6F6F6',
      paper: '#FFE2E2'
    },
    text: {
      primary: '#3B3B3B',
      secondary: '#6A6A6A'
    }
  },
  shape: {
    borderRadius: 12
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
          borderRadius: 16
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(135deg, #FFC7C7, #FFE2E2)',
          boxShadow: '0 10px 24px rgba(170, 170, 170, 0.25)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #FFE2E2, #FFC7C7)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          borderColor: 'rgba(170, 170, 170, 0.2)',
          backgroundImage: 'linear-gradient(180deg, rgba(255, 226, 226, 0.35), rgba(255, 199, 199, 0.65))'
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
