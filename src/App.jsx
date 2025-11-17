import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import ProcessingPage from './pages/ProcessingPage.jsx';
import SagaPage from './pages/SagaPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import FamilyTreePage from './pages/FamilyTreePage.jsx';

const navItems = [
  { label: 'Memories', path: '/', icon: <AutoStoriesRoundedIcon /> },
  { label: 'Family tree', path: '/family-tree', icon: <FamilyRestroomRoundedIcon /> },
  { label: 'Account', path: '/account', icon: <PersonRoundedIcon /> }
];

function ProtectedLayout() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleNav = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const showBackToBook =
    location.pathname.startsWith('/memories/') &&
    !['/memories', '/'].includes(location.pathname);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        backgroundImage:
          'radial-gradient(circle at 12% 18%, rgba(181, 18, 47, 0.12), transparent 30%), radial-gradient(circle at 82% 6%, rgba(212, 175, 55, 0.18), transparent 32%)'
      }}
    >
      <AppBar position="sticky" elevation={8}>
        <Toolbar sx={{ py: 1.5, px: { xs: 2, sm: 3 } }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.6)}`,
                bgcolor: alpha(theme.palette.common.white, 0.08),
                display: { xs: 'flex', md: 'none' }
              }}
              aria-label="Open navigation menu"
            >
              <MenuRoundedIcon />
            </IconButton>
            <Stack spacing={0}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1.2 }}>
                Saga
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                A keepsake hub for your family stories
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => handleNav(item.path)}
                sx={{
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
                  bgcolor: alpha(theme.palette.common.white, 0.08)
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddCircleRoundedIcon />}
              onClick={() => handleNav('/memories/new')}
              sx={{ boxShadow: '0 14px 28px rgba(0,0,0,0.25)' }}
            >
              Add memory
            </Button>
            <IconButton color="inherit" onClick={logout}>
              <LogoutRoundedIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{ width: 280, p: 2, display: 'flex', flexDirection: 'column', gap: 1, minHeight: '100%' }}
          role="presentation"
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, px: 1 }}>
            Navigate
          </Typography>
          <Divider />
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.path} onClick={() => handleNav(item.path)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Button startIcon={<AddCircleRoundedIcon />} variant="contained" onClick={() => handleNav('/memories/new')} sx={{ mb: 2 }}>
            Add memory
          </Button>
          <Button startIcon={<LogoutRoundedIcon />} onClick={logout} color="inherit">
            Logout
          </Button>
        </Box>
      </Drawer>

      {showBackToBook ? (
        <Box sx={{ textAlign: 'center', py: 1.5, bgcolor: alpha(theme.palette.primary.light, 0.08), borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.45)}` }}>
          <Button color="primary" onClick={() => handleNav('/')} startIcon={<AutoStoriesRoundedIcon />}>
            Return to the book of memories
          </Button>
        </Box>
      ) : null}

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}

function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar sx={{ py: 1.5, px: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Saga
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <LoginPage />
      </Container>
    </Box>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<PublicLayout />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<HomePage />} />
        <Route path="memories" element={<HomePage />} />
        <Route path="memories/new" element={<UploadPage />} />
        <Route path="memories/processing" element={<ProcessingPage />} />
        <Route path="memories/story" element={<SagaPage />} />
        <Route path="family-tree" element={<FamilyTreePage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
