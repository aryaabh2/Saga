import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  MobileStepper,
  Stack,
  Typography
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';

function downloadSaga(saga) {
  const documentContent = {
    generatedAt: new Date().toISOString(),
    title: saga.title,
    summary: saga.summary,
    moments: saga.moments
  };

  const blob = new Blob([JSON.stringify(documentContent, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${saga.title.replace(/\s+/g, '-').toLowerCase()}-saga.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function SagaPage({ saga }) {
  const navigate = useNavigate();
  const fallbackHeroImage =
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80';

  const moments = useMemo(() => saga.moments ?? [], [saga.moments]);
  const [activeMomentIndex, setActiveMomentIndex] = useState(0);

  useEffect(() => {
    setActiveMomentIndex(0);
  }, [moments.length]);

  const totalMoments = moments.length;
  const activeMoment = moments[activeMomentIndex] || null;
  const heroImage = activeMoment?.imageUrl || fallbackHeroImage;

  const handleNext = () => {
    if (!totalMoments) return;
    setActiveMomentIndex((prev) => (prev + 1) % totalMoments);
  };

  const handleBack = () => {
    if (!totalMoments) return;
    setActiveMomentIndex((prev) => (prev - 1 + totalMoments) % totalMoments);
  };

  const sectionContainerSx = { width: '100%', maxWidth: { xs: '100%', md: 880 } };

  return (
    <Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
      <Box sx={sectionContainerSx}>
        <Box
          sx={{
            position: 'relative',
            borderRadius: 3,
            overflow: 'hidden',
            minHeight: { xs: 140, md: 180 },
            backgroundImage: `linear-gradient(135deg, rgba(255, 199, 199, 0.72), rgba(170, 170, 170, 0.75)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'common.white',
            boxShadow: (theme) => theme.shadows[8]
          }}
        >
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(170, 170, 170, 0.25)' }} />
          <Stack
            spacing={2.5}
            sx={{ position: 'relative', p: { xs: 4, md: 5 }, maxWidth: { xs: '100%', md: 720 } }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 1.4, lineHeight: 1.1, color: 'secondary.light' }}>
              Saga keepsake
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
              {saga.title}
            </Typography>
            <Typography variant="h6" component="p" sx={{ lineHeight: 1.6 }}>
              {saga.summary}
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box sx={sectionContainerSx}>
        <Typography variant="h5" gutterBottom color="primary">
          Saga moments
        </Typography>
        {totalMoments > 0 ? (
          <Card
            variant="outlined"
            sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 3 }}
          >
            <CardMedia
              component="img"
              image={activeMoment?.imageUrl || fallbackHeroImage}
              alt={activeMoment?.imageName || activeMoment?.title || saga.title}
              sx={{
                height: { xs: 280, sm: 340 },
                objectFit: 'cover'
              }}
            />
            <CardContent sx={{ bgcolor: 'background.default', p: { xs: 2.75, sm: 3 } }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" color="secondary.dark" sx={{ letterSpacing: 1 }}>
                  Moment {activeMomentIndex + 1} of {totalMoments}
                </Typography>
                <Typography variant="h5" component="h2">
                  {activeMoment?.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                  {activeMoment?.description}
                </Typography>
                {activeMoment?.imageName && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    From: {activeMoment.imageName}
                  </Typography>
                )}
              </Stack>
            </CardContent>
            <MobileStepper
              variant="dots"
              steps={totalMoments}
              position="static"
              activeStep={activeMomentIndex}
              sx={{
                px: 3,
                pb: 2,
                backgroundColor: 'transparent',
                '& .MuiMobileStepper-dotActive': {
                  backgroundColor: 'secondary.main'
                }
              }}
              backButton={
                <Button onClick={handleBack} size="small" startIcon={<KeyboardArrowLeft />} color="primary">
                  Previous
                </Button>
              }
              nextButton={
                <Button onClick={handleNext} size="small" endIcon={<KeyboardArrowRight />} color="primary">
                  Next
                </Button>
              }
            />
          </Card>
        ) : (
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 2.75, sm: 3 } }}>
              <Typography color="text.secondary">
                Your saga moments will appear here once memories are added.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      <Box sx={sectionContainerSx}>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.75, sm: 3.25 } }}>
            <Stack spacing={2.25}>
              <Typography variant="h5" component="h2" color="primary">
                Share the joy
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                This saga is a warm note of gratitude for the love shared across generations—download it and
                invite family and caregivers to add their own chapters.
              </Typography>
            </Stack>
          </CardContent>
          <Divider />
          <CardActions
            sx={{ justifyContent: { xs: 'center', sm: 'space-between' }, flexWrap: 'wrap', gap: 2, p: { xs: 2.5, sm: 3 } }}
          >
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => downloadSaga(saga)}>
              Download saga
            </Button>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={() => navigate('/')}
              sx={{ borderRadius: 3 }}
            >
              Start a new saga
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Stack>
  );
}
