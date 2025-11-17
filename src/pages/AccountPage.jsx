import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import CakeRoundedIcon from '@mui/icons-material/CakeRounded';
import { alpha, useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext.jsx';

export default function AccountPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const [photoPreview, setPhotoPreview] = useState('');

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result?.toString() || '');
    reader.readAsDataURL(file);
  };

  const profileImage = photoPreview || user?.avatarUrl || '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          backgroundImage:
            'radial-gradient(circle at 22% 20%, rgba(212, 175, 55, 0.15), transparent 28%), linear-gradient(145deg, rgba(255, 248, 242, 0.98), rgba(245, 224, 197, 0.95))'
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Box
            sx={{
              position: 'relative',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${alpha(theme.palette.primary.light, 0.25)}, ${alpha(
                theme.palette.background.paper,
                0.9
              )})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 24px 44px rgba(0,0,0,0.18), 0 0 0 10px ${alpha(theme.palette.secondary.light, 0.32)}`
            }}
          >
            <Avatar
              src={profileImage}
              alt={user?.name || 'Profile avatar'}
              sx={{
                width: 170,
                height: 170,
                bgcolor: alpha(theme.palette.text.secondary, 0.08),
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: '2rem'
              }}
            >
              {(user?.name || 'Saga User')
                .split(' ')
                .map((piece) => piece[0])
                .join('')}
            </Avatar>
            <Button
              component="label"
              variant="contained"
              startIcon={<PhotoCameraRoundedIcon />}
              sx={{ position: 'absolute', bottom: 10 }}
            >
              Update portrait
              <input hidden accept="image/*" type="file" onChange={handleUpload} />
            </Button>
          </Box>
          <Stack spacing={1}>
            <Typography variant="overline" color="secondary.dark">
              Account
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {user?.name || 'Saga member'}
            </Typography>
            <Typography color="text.secondary">
              {user?.tagline || 'Keepers of stories, memories, and traditions.'}
            </Typography>
          </Stack>
        </Stack>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <MailRoundedIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Email
                    </Typography>
                    <Typography color="text.secondary">{user?.email || 'jordan@saga.demo'}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <LocationOnRoundedIcon color="secondary" />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Home base
                    </Typography>
                    <Typography color="text.secondary">{user?.location || 'Portland, Oregon'}</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <CakeRoundedIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      Member since
                    </Typography>
                    <Typography color="text.secondary">{user?.memberSince || 2021}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
                Share your story in a sentence
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Update your one-liner so your family knows what you are up to these days.
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={user?.tagline || 'Curator of family stories and host of the winter cocoa chats.'}
                sx={{
                  mt: 1.5,
                  background: alpha(theme.palette.background.paper, 0.8),
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />
              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                <Chip label="Family archivist" color="primary" variant="outlined" />
                <Chip label="Memory weaver" color="secondary" variant="outlined" />
                <Chip label="Tradition host" variant="outlined" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
