import { useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
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

  const sceneGrid = useMemo(
    () =>
      storyboard.scenes.map((scene) => (
        <Grid item xs={12} sm={6} key={scene.id}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {scene.imageName}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {scene.title}
              </Typography>
              <Typography color="text.secondary">{scene.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      )),
    [storyboard.scenes]
  );

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" gutterBottom>
          {storyboard.title}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {storyboard.summary}
        </Typography>
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
