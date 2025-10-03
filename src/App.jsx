import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Box, Container, Step, StepLabel, Stepper, Toolbar, Typography } from '@mui/material';
import UploadPage from './pages/UploadPage.jsx';
import ProcessingPage from './pages/ProcessingPage.jsx';
import SagaPage from './pages/SagaPage.jsx';

const steps = ['Upload memories', 'Processing', 'Saga'];

function SagaLayout({ children }) {
  const location = useLocation();
  const activeStep = useMemo(() => {
    if (location.pathname.startsWith('/processing')) return 1;
    if (location.pathname.startsWith('/saga')) return 2;
    return 0;
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage:
          'radial-gradient(circle at top, rgba(234, 193, 124, 0.25), transparent 45%), radial-gradient(circle at bottom, rgba(166, 32, 64, 0.18), transparent 40%)'
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            Saga
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ '& .MuiStepLabel-label': { fontWeight: 600 } }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
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
    navigate('/processing');
  };

  const handleProcessingComplete = () => {
    if (!uploadData) {
      navigate('/');
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

    const stockImageUrl =
      'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1000&q=80';

    const generatedSaga = {
      title: uploadData.title?.trim() || 'Our Holiday Saga',
      summary:
        summaryText ||
        'A heartfelt recollection of treasured memories, wrapped in kindness for family and friends to share.',
      moments:
        storyMoments.length > 0
          ? storyMoments
          : [
              {
                id: 1,
                title: 'A cherished beginning',
                description:
                  summaryText ||
                  'Imagine the gentle start of this saga — a cozy gathering with carols, cocoa, and welcoming smiles.',
                imageName: 'Stock family photo',
                imageUrl: stockImageUrl
              },
              {
                id: 2,
                title: 'Shared laughter',
                description:
                  'Loved ones lean in close, sharing stories, laughter, and twinkling lights across generations.',
                imageName: 'Stock family photo',
                imageUrl: stockImageUrl
              },
              {
                id: 3,
                title: 'Legacy of love',
                description:
                  'The closing moment celebrates the wisdom and love that continue to guide the family forward with festive cheer.',
                imageName: 'Stock family photo',
                imageUrl: stockImageUrl
              }
            ]
    };

    setSaga(generatedSaga);
    navigate('/saga');
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
      <Route path="/" element={<UploadPage onSubmit={handleUpload} />} />
      <Route
        path="/processing"
        element={<ProcessingPage uploadData={uploadData} onComplete={handleProcessingComplete} />}
      />
      <Route
        path="/saga"
        element={
          saga ? <SagaPage saga={saga} /> : <Navigate to="/" replace />
        }
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
