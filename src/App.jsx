import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import UploadPage from './pages/UploadPage.jsx';
import ProcessingPage from './pages/ProcessingPage.jsx';
import SagaPage from './pages/SagaPage.jsx';
import HomePage from './pages/HomePage.jsx';

const steps = ['Upload memories', 'Processing', 'Saga'];

function SagaLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const inMemoryFlow = location.pathname.startsWith('/memories');
  const [menuOpen, setMenuOpen] = useState(false);
  const activeStep = useMemo(() => {
    if (!inMemoryFlow) return 0;
    if (location.pathname.startsWith('/memories/processing')) return 1;
    if (location.pathname.startsWith('/memories/story')) return 2;
    return 0;
  }, [inMemoryFlow, location.pathname]);

  const navigationItems = [
    {
      label: 'Home',
      icon: <HomeRoundedIcon fontSize="medium" />,
      path: '/'
    },
    {
      label: 'Add memory',
      icon: <FavoriteBorderIcon fontSize="medium" />,
      path: '/memories/new'
    }
  ];

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: (theme) => theme.palette.grey[100]
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        color="default"
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar
          sx={{
            py: 1.5,
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <IconButton
            color="default"
            edge="start"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            sx={{
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: 700, letterSpacing: 0.4 }}
          >
            Saga
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box
          sx={{
            width: { xs: 260, sm: 300 },
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%'
          }}
          role="presentation"
        >
          <Toolbar sx={{ px: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Menu
            </Typography>
          </Toolbar>
          <Divider />
          <List sx={{ flexGrow: 1 }}>
            {navigationItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  alignItems: 'flex-start',
                  py: 1.5
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 3, md: 5 },
          px: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2.5, md: 4 }
        }}
      >
        {inMemoryFlow && (
          <Box sx={{ px: { xs: 0, sm: 2 }, py: { xs: 1, md: 1.5 } }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ pt: 1 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 600 } }}>{label}</StepLabel>
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

function SagaRouter() {
  const [uploadData, setUploadData] = useState(null);
  const [saga, setSaga] = useState(null);
  const navigate = useNavigate();

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
        path="/"
        element={<HomePage onCreateMemory={handleCreateMemory} />}
      />
      <Route
        path="/memories/new"
        element={<UploadPage onSubmit={handleUpload} />}
      />
      <Route
        path="/memories/processing"
        element={<ProcessingPage uploadData={uploadData} onComplete={handleProcessingComplete} />}
      />
      <Route
        path="/memories/story"
        element={saga ? <SagaPage saga={saga} /> : <Navigate to="/memories/new" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <BrowserRouter basename={baseUrl || undefined}>
      <SagaLayout>
        <SagaRouter />
      </SagaLayout>
    </BrowserRouter>
  );
}
