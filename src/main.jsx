import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';

const canvasBase = '#fff8f2';
const canvasPaper = '#fff2df';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#b5122f',
      light: '#e35d73',
      dark: '#7a0820'
    },
    secondary: {
      main: '#d4af37',
      light: '#f4e4a6',
      dark: '#9c7a11'
    },
    background: {
      default: canvasBase,
      paper: canvasPaper
    },
    text: {
      primary: '#3d0a14',
      secondary: '#6b2c2c'
    }
  },
  shape: {
    borderRadius: 6
  },
  typography: {
    fontFamily: '"Cormorant Garamond", "Georgia", "Times New Roman", serif',
    h1: {
      fontFamily: '"Cinzel", "Cinzel Decorative", "Georgia", serif',
      letterSpacing: 1.2,
      fontWeight: 700
    },
    h2: {
      fontFamily: '"Cinzel", "Cinzel Decorative", "Georgia", serif',
      letterSpacing: 1,
      fontWeight: 700
    },
    h3: {
      fontFamily: '"Cinzel", "Cinzel Decorative", "Georgia", serif',
      letterSpacing: 0.8,
      fontWeight: 700
    },
    h4: {
      fontFamily: '"Cinzel", "Cinzel Decorative", "Georgia", serif',
      letterSpacing: 0.6,
      fontWeight: 700
    },
    h5: {
      fontFamily: '"Cinzel", "Cinzel Decorative", "Georgia", serif',
      letterSpacing: 0.5,
      fontWeight: 700
    },
    h6: {
      fontFamily: '"Cinzel", "Cinzel Decorative", "Georgia", serif',
      letterSpacing: 0.4,
      fontWeight: 700
    },
    button: {
      textTransform: 'uppercase',
      fontSize: '0.95rem',
      fontWeight: 700,
      letterSpacing: 1.3,
      fontFamily: '"Cinzel", "Cinzel Decorative", "Georgia", serif'
    },
    overline: {
      fontWeight: 700,
      letterSpacing: 2.1
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: canvasBase,
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(181, 18, 47, 0.12), transparent 42%), radial-gradient(circle at 78% 8%, rgba(212, 175, 55, 0.2), transparent 36%), linear-gradient(180deg, rgba(255, 248, 242, 0.96), rgba(255, 236, 210, 0.98))',
          backgroundAttachment: 'fixed',
          minHeight: '100%',
          color: '#3d0a14',
          letterSpacing: 0.15
        },
        a: {
          color: '#b5122f'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 10px 26px rgba(122, 8, 32, 0.22)'
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(135deg, #b5122f, #d4af37)',
          color: '#fff9f2',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #8c0d26, #e0c159)'
          }
        },
        outlinedPrimary: {
          borderWidth: 2,
          borderColor: '#d4af37',
          color: '#7a0820',
          '&:hover': {
            borderColor: '#b5122f',
            backgroundColor: 'rgba(212, 175, 55, 0.14)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: 'none',
          backgroundImage:
            'linear-gradient(180deg, rgba(255, 250, 241, 0.95), rgba(249, 231, 205, 0.9)), radial-gradient(circle at 22% 16%, rgba(212, 175, 55, 0.12), transparent 40%)',
          boxShadow: '0 16px 36px rgba(73, 7, 24, 0.14)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: 'none',
          backgroundImage:
            'linear-gradient(180deg, rgba(255, 248, 236, 0.96), rgba(246, 226, 196, 0.9)), radial-gradient(circle at 12% 10%, rgba(181, 18, 47, 0.08), transparent 30%)',
          boxShadow: '0 14px 28px rgba(73, 7, 24, 0.12)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(105deg, rgba(140, 13, 38, 0.98), rgba(62, 6, 26, 0.9) 58%, rgba(28, 0, 10, 0.92))',
          color: '#fff7eb',
          borderBottom: 'none',
          boxShadow: '0 10px 20px rgba(122, 8, 32, 0.28)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fff4e3',
          backgroundImage:
            'linear-gradient(180deg, rgba(255, 244, 227, 0.96), rgba(247, 223, 187, 0.96)), radial-gradient(circle at 14% 18%, rgba(181, 18, 47, 0.18), transparent 30%)',
          borderRight: 'none',
          color: '#3d0a14',
          boxShadow: '8px 0 28px rgba(73, 7, 24, 0.24)'
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
