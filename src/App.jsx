import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Box, Container, Step, StepLabel, Stepper, Toolbar, Typography } from '@mui/material';
import UploadPage from './pages/UploadPage.jsx';
import ProcessingPage from './pages/ProcessingPage.jsx';
import StoryboardPage from './pages/StoryboardPage.jsx';

const steps = ['Upload memories', 'Processing', 'Storyboard'];

function SagaLayout({ children }) {
  const location = useLocation();
  const activeStep = useMemo(() => {
    if (location.pathname.startsWith('/processing')) return 1;
    if (location.pathname.startsWith('/storyboard')) return 2;
    return 0;
  }, [location.pathname]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            Saga
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
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
  const [storyboard, setStoryboard] = useState(null);
  const navigate = useNavigate();

  const handleUpload = (data) => {
    setUploadData(data);
    setStoryboard(null);
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

    const promptText = uploadData.prompt?.trim();
    const summaryText = uploadData.summary?.trim();

    const storyMoments = uploadData.files.map((file, index) => {
      const objectUrl = URL.createObjectURL(file);
      return {
        id: index + 1,
        title: generateMomentTitle(file.name, index),
        description:
          promptText ||
          (summaryText
            ? `${summaryText} — captured through ${file.name}`
            : 'A treasured memory shared together.'),
        imageName: file.name,
        imageUrl: objectUrl,
        isObjectUrl: true
      };
    });

    const stockImageUrl =
      'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1000&q=80';

    const generatedStoryboard = {
      title: uploadData.title || 'Saga Storyboard',
      summary:
        uploadData.summary ||
        'A heartfelt recollection of treasured memories, arranged for easy sharing with loved ones.',
      moments:
        storyMoments.length > 0
          ? storyMoments
          : [
              {
                id: 1,
                title: 'A cherished beginning',
                description:
                  summaryText ||
                  'We imagine the gentle start of this memory — a warm gathering filled with smiles.',
                imageName: 'Stock family photo',
                imageUrl: stockImageUrl
              },
              {
                id: 2,
                title: 'Shared laughter',
                description:
                  promptText ||
                  'In our storyboard, everyone leans in close, sharing stories and laughter across generations.',
                imageName: 'Stock family photo',
                imageUrl: stockImageUrl
              },
              {
                id: 3,
                title: 'Legacy of love',
                description:
                  'The closing moment celebrates the wisdom and love that continue to guide the family forward.',
                imageName: 'Stock family photo',
                imageUrl: stockImageUrl
              }
            ]
    };

    setStoryboard(generatedStoryboard);
    navigate('/storyboard');
  };

  useEffect(() => {
    return () => {
      storyboard?.moments?.forEach((moment) => {
        if (moment.isObjectUrl && moment.imageUrl) {
          URL.revokeObjectURL(moment.imageUrl);
        }
      });
    };
  }, [storyboard]);

  return (
    <Routes>
      <Route path="/" element={<UploadPage onSubmit={handleUpload} />} />
      <Route
        path="/processing"
        element={<ProcessingPage uploadData={uploadData} onComplete={handleProcessingComplete} />}
      />
      <Route
        path="/storyboard"
        element={
          storyboard ? (
            <StoryboardPage storyboard={storyboard} uploadData={uploadData} />
          ) : (
            <Navigate to="/" replace />
          )
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
