import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useNavigate } from 'react-router-dom';

const PROCESS_DURATION = 5000;

export default function ProcessingPage({ uploadData, onComplete }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!uploadData) {
      navigate('/', { replace: true });
      return;
    }

    let start;
    let animationFrame;

    const updateProgress = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const percentage = Math.min(100, Math.round((elapsed / PROCESS_DURATION) * 100));
      setProgress(percentage);

      if (elapsed < PROCESS_DURATION) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        onComplete();
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [navigate, onComplete, uploadData]);

  if (!uploadData) {
    return null;
  }

  return (
    <Stack spacing={4} alignItems="center">
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          Creating your saga
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Please hold tight while we weave together your memories into something warm and festive. This should only take a few moments.
        </Typography>
      </Box>

      <Card variant="outlined" sx={{ width: '100%' }}>
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <HourglassBottomIcon color="primary" sx={{ fontSize: 56 }} />
            <LinearProgress variant="determinate" value={progress} sx={{ width: '100%', height: 12, borderRadius: 6 }} />
            <Typography variant="h6">{progress}% complete</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Button variant="text" onClick={() => navigate('/')}>
        Go back to start
      </Button>
    </Stack>
  );
}
