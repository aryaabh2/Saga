import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PROCESS_DURATION = 5000;

export default function ProcessingPage({ uploadData, onComplete }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

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
    <Stack
      spacing={{ xs: 3, md: 3.5 }}
      alignItems="center"
      sx={{ width: '100%', maxWidth: { xs: '100%', lg: 1120 }, mx: 'auto' }}
    >
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          Creating your saga{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please hold tight while we weave together your memories into something warm and memorable. This should only take a few moments.
        </Typography>
      </Box>

      <Card
        variant="outlined"
        sx={{ width: '100%', borderRadius: 3, bgcolor: 'common.white', boxShadow: '0 16px 32px rgba(44, 95, 45, 0.12)' }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
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
