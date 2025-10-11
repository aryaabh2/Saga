import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B95E82',
      light: '#D886A4',
      dark: '#8C3F5F'
    },
    secondary: {
      main: '#F39F9F',
      light: '#FFC29B',
      dark: '#D07474'
    },
    background: {
      default: '#FFECC0',
      paper: '#FFF7E1'
    },
    text: {
      primary: '#3C1C21',
      secondary: '#6B4F54'
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
          backgroundImage: 'linear-gradient(135deg, #B95E82, #D886A4)',
          boxShadow: '0 8px 20px rgba(185, 94, 130, 0.35)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #8C3F5F, #C97394)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          borderColor: 'rgba(185, 94, 130, 0.18)',
          backgroundImage: 'linear-gradient(180deg, rgba(255, 236, 192, 0.5), rgba(255, 247, 225, 0.9))'
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
