import { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { alpha } from '@mui/material/styles';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formState, setFormState] = useState({ name: '', email: '' });

  const handleChange = (field) => (event) => {
    setFormState((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login({ name: formState.name, email: formState.email });
    navigate('/account');
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: { xs: '70vh', md: '75vh' }
      }}
    >
      <Card
        elevation={12}
        sx={{
          width: '100%',
          maxWidth: 520,
          borderRadius: 4,
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.16)}, ${alpha(
              theme.palette.background.paper,
              0.98
            )})`
        }}
      >
        <CardContent sx={{ p: { xs: 3.25, md: 4 } }}>
          <Stack spacing={3}>
            <Stack spacing={1} alignItems="center" textAlign="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              >
                <LockOutlinedIcon />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Welcome back to Saga
              </Typography>
              <Typography color="text.secondary">
                This demo login unlocks the family hub so you can explore connections and shared memories.
              </Typography>
            </Stack>

            <Stack spacing={2.25}>
              <TextField
                label="Your name"
                value={formState.name}
                onChange={handleChange('name')}
                placeholder="Jordan Lee"
                fullWidth
              />
              <TextField
                label="Email"
                value={formState.email}
                onChange={handleChange('email')}
                placeholder="you@saga.demo"
                fullWidth
                type="email"
              />
            </Stack>

            <Button type="submit" variant="contained" size="large" sx={{ py: 1.4, borderRadius: 3 }}>
              Enter family hub
            </Button>
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Any details work here—Saga lets you in so you can preview the full experience.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
