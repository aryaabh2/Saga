import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B4434B',
      light: '#F2D6CF',
      dark: '#7D2E32'
    },
    secondary: {
      main: '#2C5F2D',
      light: '#5C8F4D',
      dark: '#1E3F1F'
    },
    background: {
      default: '#F4F6FA',
      paper: '#FFF9F5'
    },
    text: {
      primary: '#2D2A32',
      secondary: '#5F5A63'
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
          backgroundImage: 'linear-gradient(135deg, #B4434B, #D9B272)',
          boxShadow: '0 10px 24px rgba(125, 46, 50, 0.25)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #C95B63, #E2C182)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          borderColor: 'rgba(125, 46, 50, 0.18)',
          backgroundImage: 'linear-gradient(180deg, rgba(244, 230, 219, 0.75), rgba(217, 178, 114, 0.35))'
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
