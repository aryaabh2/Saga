import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';

const parchmentTone = '#f6f0e4';
const parchmentPaper = '#efe2cc';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7a1f1d',
      light: '#b05749',
      dark: '#3c0f12'
    },
    secondary: {
      main: '#c6a35c',
      light: '#e5d5a4',
      dark: '#8a6b2c'
    },
    background: {
      default: parchmentTone,
      paper: parchmentPaper
    },
    text: {
      primary: '#2e1b12',
      secondary: '#5a4534'
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
          backgroundColor: parchmentTone,
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(198, 163, 92, 0.2), transparent 40%), radial-gradient(circle at 75% 0%, rgba(122, 31, 29, 0.22), transparent 35%), linear-gradient(180deg, rgba(245, 236, 214, 0.95), rgba(237, 221, 192, 0.98))',
          backgroundAttachment: 'fixed',
          minHeight: '100%',
          color: '#2e1b12',
          letterSpacing: 0.15
        },
        a: {
          color: '#7a1f1d'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: '0 12px 28px rgba(60, 15, 18, 0.28)'
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(135deg, #7a1f1d, #c6a35c)',
          color: '#fdf8ed',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #5a1315, #d4b36c)'
          }
        },
        outlinedPrimary: {
          borderWidth: 2,
          borderColor: '#c6a35c',
          color: '#3c0f12',
          '&:hover': {
            borderColor: '#7a1f1d',
            backgroundColor: 'rgba(198, 163, 92, 0.12)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(198, 163, 92, 0.65)',
          backgroundImage: 'linear-gradient(180deg, rgba(249, 242, 231, 0.96), rgba(236, 221, 195, 0.96))',
          boxShadow: '0 18px 36px rgba(45, 17, 8, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(198, 163, 92, 0.65)',
          backgroundImage: 'linear-gradient(180deg, rgba(249, 242, 231, 0.97), rgba(234, 216, 187, 0.97))',
          boxShadow: '0 12px 28px rgba(45, 17, 8, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.35)'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(90deg, #3c0f12, #2a120f 55%, #1b0b07)',
          color: '#f7ecd7',
          borderBottom: '2px solid #c6a35c',
          boxShadow: '0 18px 28px rgba(31, 11, 7, 0.5)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f0e4cf',
          backgroundImage:
            'linear-gradient(180deg, rgba(248, 237, 215, 0.96), rgba(233, 210, 174, 0.96)), radial-gradient(circle at 14% 18%, rgba(122, 31, 29, 0.15), transparent 30%)',
          borderRight: '2px solid rgba(198, 163, 92, 0.8)',
          color: '#2e1b12'
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
