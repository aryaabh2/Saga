import { useMemo, useState } from 'react';
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

    const storyScenes = uploadData.files.map((file, index) => ({
      id: index + 1,
      title: `Scene ${index + 1}`,
      description: uploadData.prompt || `Moment captured from ${file.name}`,
      imageName: file.name
    }));

    const generatedStoryboard = {
      title: uploadData.title || 'Saga Storyboard',
      summary:
        uploadData.summary ||
        'A heartfelt recollection of treasured memories, arranged for easy sharing with loved ones.',
      scenes: storyScenes.length
        ? storyScenes
        : [
            {
              id: 1,
              title: 'Scene 1',
              description:
                'Your story will appear here once we have images or text to guide the storyboard.',
              imageName: 'Placeholder image'
            }
          ]
    };

    setStoryboard(generatedStoryboard);
    navigate('/storyboard');
  };

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
