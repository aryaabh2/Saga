import { useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useNavigate } from 'react-router-dom';

function downloadStoryboard(storyboard, uploadData) {
  const documentContent = {
    generatedAt: new Date().toISOString(),
    title: storyboard.title,
    summary: storyboard.summary,
    guidance: uploadData?.prompt || '',
    scenes: storyboard.scenes
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

  const sceneGrid = useMemo(
    () =>
      storyboard.scenes.map((scene, index) => (
        <Grid item xs={12} sm={6} key={scene.id}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <CardMedia
              component="img"
              image={scene.imageUrl || fallbackHeroImage}
              alt={scene.imageName || scene.title}
              sx={{
                height: 240,
                objectFit: 'cover'
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Scene {index + 1}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {scene.title}
              </Typography>
              <Typography color="text.secondary">{scene.description}</Typography>
              {scene.imageName && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                  From: {scene.imageName}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      )),
    [storyboard.scenes]
  );

  const primaryScene = storyboard.scenes[0];
  const heroImage = primaryScene?.imageUrl || fallbackHeroImage;

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
          Scenes
        </Typography>
        <Grid container spacing={3}>
          {sceneGrid}
        </Grid>
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
