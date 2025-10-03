import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  MobileStepper,
  Stack,
  Typography
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';

function downloadStoryboard(storyboard, uploadData) {
  const documentContent = {
    generatedAt: new Date().toISOString(),
    title: storyboard.title,
    summary: storyboard.summary,
    guidance: uploadData?.prompt || '',
    moments: storyboard.moments
  };

  const blob = new Blob([JSON.stringify(documentContent, null, 2)], {
    type: 'application/json'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${storyboard.title.replace(/\s+/g, '-').toLowerCase()}-storyboard.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function StoryboardPage({ storyboard, uploadData }) {
  const navigate = useNavigate();
  const fallbackHeroImage =
    'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=80';

  const moments = useMemo(() => storyboard.moments ?? [], [storyboard.moments]);
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

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          minHeight: { xs: 260, md: 320 },
          backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.4), rgba(17, 24, 39, 0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'common.white'
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(17, 24, 39, 0.35)' }} />
        <Stack spacing={2} sx={{ position: 'relative', p: { xs: 4, md: 6 }, maxWidth: 520 }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.2 }}>
            Storyboard
          </Typography>
          <Typography variant="h3" component="h1">
            {storyboard.title}
          </Typography>
          <Typography variant="h6" component="p">
            {storyboard.summary}
          </Typography>
        </Stack>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1" color="text.secondary">
              Story guidance
            </Typography>
            <Typography>
              {uploadData?.prompt
                ? uploadData.prompt
                : 'We used your notes and photos to organize the storyboard below.'}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Box>
        <Typography variant="h5" gutterBottom>
          Story moments
        </Typography>
        {totalMoments > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={10}>
              <Card
                variant="outlined"
                sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              >
                <CardMedia
                  component="img"
                  image={activeMoment?.imageUrl || fallbackHeroImage}
                  alt={activeMoment?.imageName || activeMoment?.title || storyboard.title}
                  sx={{
                    height: { xs: 260, sm: 320 },
                    objectFit: 'cover'
                  }}
                />
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" color="primary">
                      Moment {activeMomentIndex + 1} of {totalMoments}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {activeMoment?.title}
                    </Typography>
                    <Typography color="text.secondary">
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
                  sx={{ px: 3, pb: 2 }}
                  backButton={
                    <Button onClick={handleBack} size="small" startIcon={<KeyboardArrowLeft />}>
                      Previous
                    </Button>
                  }
                  nextButton={
                    <Button onClick={handleNext} size="small" endIcon={<KeyboardArrowRight />}>
                      Next
                    </Button>
                  }
                />
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography color="text.secondary">
                Your storyboard moments will appear here once memories are added.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1" color="text.secondary">
              Next steps
            </Typography>
            <Typography>
              Download the storyboard summary to save or share with family members. You can restart to make changes anytime.
            </Typography>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: { xs: 'center', sm: 'space-between' }, flexWrap: 'wrap', gap: 2, p: 3 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => downloadStoryboard(storyboard, uploadData)}
          >
            Download storyboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={() => navigate('/')}
          >
            Start a new storyboard
          </Button>
        </CardActions>
      </Card>
    </Stack>
  );
}
