import { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import UploadPage from './pages/UploadPage.jsx';
import ProcessingPage from './pages/ProcessingPage.jsx';
import SagaPage from './pages/SagaPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import ConnectionsPage from './pages/ConnectionsPage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

const steps = ['Upload memories', 'Processing', 'Saga'];

function SagaLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const inMemoryFlow = location.pathname.startsWith('/memories');
  const isLoginPage = location.pathname === '/login';
  const [menuOpen, setMenuOpen] = useState(false);
  const activeStep = useMemo(() => {
    if (!inMemoryFlow) return 0;
    if (location.pathname.startsWith('/memories/processing')) return 1;
    if (location.pathname.startsWith('/memories/story')) return 2;
    return 0;
  }, [inMemoryFlow, location.pathname]);

  const navigationItems = useMemo(() => {
    if (!user) {
      return [
        {
          label: 'Log in',
          icon: <LockOpenIcon fontSize="medium" />,
          path: '/login'
        }
      ];
    }

    return [
      {
        label: 'Home',
        icon: <HomeRoundedIcon fontSize="medium" />,
        path: '/'
      },
      {
        label: 'Account',
        icon: <AccountCircleIcon fontSize="medium" />,
        path: '/account'
      },
      {
        label: 'Connections',
        icon: <AccountTreeIcon fontSize="medium" />,
        path: '/connections'
      },
      {
        label: 'Add memory',
        icon: <FavoriteBorderIcon fontSize="medium" />,
        path: '/memories/new'
      }
    ];
  }, [user]);

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: (theme) => theme.palette.background.default,
        backgroundImage:
          'radial-gradient(circle at 12% 18%, rgba(122, 31, 29, 0.12), transparent 26%), radial-gradient(circle at 82% 6%, rgba(198, 163, 92, 0.18), transparent 30%)'
      }}
    >
      <AppBar
        position="static"
        elevation={isLoginPage ? 0 : 8}
        color="default"
        sx={{
          backgroundImage: 'linear-gradient(110deg, rgba(60, 15, 18, 0.94), rgba(27, 11, 7, 0.94))',
          borderBottom: '3px solid',
          borderColor: 'secondary.main'
        }}
      >
        <Toolbar
          sx={{
            py: 1.75,
            px: { xs: 2, sm: 3.5 },
            display: 'flex',
            alignItems: 'center',
            gap: 2.5
          }}
        >
          {user && !isLoginPage ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              sx={{
                border: (theme) => `1px solid ${alpha(theme.palette.secondary.main, 0.6)}`,
                bgcolor: (theme) => alpha(theme.palette.common.white, 0.12),
                borderRadius: 1,
                boxShadow: '0 6px 14px rgba(0,0,0,0.35)',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.35)
                }
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
          ) : null}
          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: 700, letterSpacing: 1.4, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Saga
            <Typography component="span" variant="subtitle2" sx={{ fontWeight: 600, opacity: 0.9 }}>
              Royal Archives
            </Typography>
          </Typography>
        </Toolbar>
      </AppBar>
      {user && !isLoginPage ? (
        <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
          <Box
            sx={{
              width: { xs: 260, sm: 300 },
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100%',
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.98),
              backgroundImage:
                'linear-gradient(180deg, rgba(233, 217, 190, 0.96), rgba(217, 192, 155, 0.96)), radial-gradient(circle at 16% 12%, rgba(122, 31, 29, 0.12), transparent 24%)',
              borderRight: (theme) => `2px solid ${alpha(theme.palette.secondary.dark, 0.65)}`,
              boxShadow: '12px 0 28px rgba(31, 11, 7, 0.35)'
            }}
            role="presentation"
          >
            <Toolbar sx={{ px: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                Royal Menu
              </Typography>
            </Toolbar>
            <Divider />
            <List sx={{ flexGrow: 1 }}>
              {navigationItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    alignItems: 'center',
                    py: 1.25,
                    borderRadius: 1,
                    mx: 1,
                    border: (theme) => `1px solid ${alpha(theme.palette.secondary.main, 0.45)}`,
                    boxShadow: '0 6px 14px rgba(0,0,0,0.12)',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.secondary.light, 0.25)
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'secondary.dark' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 700, letterSpacing: 0.6 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
      ) : null}
      <Container
        maxWidth="lg"
        sx={{
          py: isLoginPage ? { xs: 4, md: 6 } : { xs: 3, md: 5 },
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: isLoginPage ? 'center' : 'stretch',
          gap: { xs: 2.5, md: 4 }
        }}
      >
        {inMemoryFlow && user && (
          <Box sx={{ px: { xs: 0, sm: 2 }, py: { xs: 1, md: 1.5 } }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                pt: 1,
                '& .MuiStepLabel-label': { fontWeight: 700, letterSpacing: 0.6 },
                '& .MuiStepConnector-line': { borderColor: (theme) => alpha(theme.palette.secondary.dark, 0.4) }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': { fontWeight: 700, color: 'text.primary' },
                      '& .MuiStepIcon-root': { color: 'secondary.main' },
                      '& .Mui-active': { color: 'primary.main' }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}
        {children}
      </Container>
    </Box>
  );
}

function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function SagaRouter() {
  const [uploadData, setUploadData] = useState(null);
  const [saga, setSaga] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUpload = (data) => {
    setUploadData(data);
    setSaga(null);
    navigate('/memories/processing');
  };

  const handleProcessingComplete = () => {
    if (!uploadData) {
      navigate('/memories/new');
      return;
    }

    const generateMomentTitle = (fileName, index) => {
      if (!fileName) {
        return `Moment ${index + 1}`;
      }

      const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
      const formatted = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      return formatted || `Moment ${index + 1}`;
    };

    const summaryText = uploadData.summary?.trim();

    const storyMoments = uploadData.files.map((file, index) => {
      const objectUrl = URL.createObjectURL(file);
      return {
        id: index + 1,
        title: generateMomentTitle(file.name, index),
        description:
          summaryText
            ? `${summaryText} — lovingly remembered through ${file.name}`
            : 'A treasured memory shared together, filled with love and warmth.',
        imageName: file.name,
        imageUrl: objectUrl,
        isObjectUrl: true
      };
    });

    const stockImageUrls = [
      'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544207240-4f2a2825f10f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=1000&q=80'
    ];

    const generatedSaga = {
      title: uploadData.title?.trim() || 'Our Holiday Saga',
      summary:
        summaryText ||
        'A heartfelt recollection of treasured memories, lovingly gathered for family and friends to revisit together.',
      moments:
        storyMoments.length > 0
          ? storyMoments
          : stockImageUrls.map((imageUrl, index) => {
              const defaultDescriptions = [
                summaryText ||
                  'Imagine the story beginning with everyone arriving, arms full of hugs, ready to remember together.',
                'Loved ones lean in close, sharing stories, laughter, and the glow of being together in one place.',
                'The closing moment celebrates the wisdom and love that continue to guide the family forward.'
              ];

              return {
                id: index + 1,
                title: ['A cherished beginning', 'Shared laughter', 'Legacy of love'][index] ||
                  `Moment ${index + 1}`,
                description: defaultDescriptions[index] || 'A treasured family memory.',
                imageName: 'Family memory photo',
                imageUrl
              };
            })
    };

    setSaga(generatedSaga);
    navigate('/memories/story');
  };

  const handleCreateMemory = () => {
    navigate('/memories/new');
  };

  useEffect(() => {
    return () => {
      saga?.moments?.forEach((moment) => {
        if (moment.isObjectUrl && moment.imageUrl) {
          URL.revokeObjectURL(moment.imageUrl);
        }
      });
    };
  }, [saga]);

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/account" replace /> : <LoginPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage onCreateMemory={handleCreateMemory} />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/memories/new" element={<UploadPage onSubmit={handleUpload} />} />
        <Route
          path="/memories/processing"
          element={<ProcessingPage uploadData={uploadData} onComplete={handleProcessingComplete} />}
        />
        <Route
          path="/memories/story"
          element={saga ? <SagaPage saga={saga} /> : <Navigate to="/memories/new" replace />}
        />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <BrowserRouter basename={baseUrl || undefined}>
      <AuthProvider>
        <SagaLayout>
          <SagaRouter />
        </SagaLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}
