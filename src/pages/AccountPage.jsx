import { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext.jsx';

function StatCard({ icon, label, value, description }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: '100%',
        background: (theme) => alpha(theme.palette.background.paper, 0.96),
        boxShadow: '0 16px 28px rgba(35, 74, 65, 0.18)'
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.25 } }}>
        <Stack spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.primary.light, 0.18),
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, connections, familyMembers } = useAuth();

  const groupedConnections = useMemo(() => {
    const groups = connections.reduce((accumulator, connection) => {
      const key = connection.relation;
      accumulator[key] = accumulator[key] ? accumulator[key] + 1 : 1;
      return accumulator;
    }, {});

    return Object.entries(groups).map(([relation, count]) => ({ relation, count }));
  }, [connections]);

  const highlightedMembers = useMemo(() => {
    const map = new Map(familyMembers.map((member) => [member.id, member]));
    return connections
      .map((connection) => ({
        ...connection,
        member: map.get(connection.memberId)
      }))
      .filter((item) => Boolean(item.member));
  }, [connections, familyMembers]);

  if (!user) {
    return null;
  }

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Card
        sx={{
          borderRadius: 4,
          px: { xs: 3, md: 5 },
          py: { xs: 3.5, md: 4.5 },
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, ${alpha(
              theme.palette.background.default,
              0.92
            )})`,
          boxShadow: '0 20px 38px rgba(35, 74, 65, 0.22)'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2.5, md: 4 }}
          alignItems={{ xs: 'center', md: 'flex-start' }}
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              fontSize: 36,
              fontWeight: 700,
              bgcolor: (theme) => alpha(theme.palette.primary.dark, 0.9)
            }}
          >
            {user.name
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </Avatar>
          <Stack spacing={1.5} textAlign={{ xs: 'center', md: 'left' }}>
            <Typography variant="overline" sx={{ letterSpacing: 1.8, color: 'primary.dark' }}>
              Account overview
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {user.name}
            </Typography>
            <Typography color="text.secondary">{user.email}</Typography>
            <Typography color="text.secondary">{user.location}</Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <Chip label={`Member since ${user.memberSince}`} color="primary" sx={{ borderRadius: 2 }} />
              <Chip label={user.tagline} variant="outlined" sx={{ borderRadius: 2 }} />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} pt={1.5}>
              <Button
                variant="contained"
                startIcon={<ManageAccountsIcon />}
                onClick={() => navigate('/connections')}
                sx={{ borderRadius: 3 }}
              >
                Manage connections
              </Button>
              <Button variant="text" onClick={() => navigate('/')}>Go to family home</Button>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<FamilyRestroomIcon fontSize="small" />}
            label="Connections logged"
            value={connections.length}
            description="Direct relationships mapped to your immediate story circle."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<Diversity2Icon fontSize="small" />}
            label="Relationship types"
            value={groupedConnections.length}
            description="Unique connection types across your family tree."
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={<ManageAccountsIcon fontSize="small" />}
            label="Tree members"
            value={familyMembers.length}
            description="Family members currently represented in your demo tree."
          />
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, boxShadow: '0 12px 28px rgba(35, 74, 65, 0.18)' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Spotlighted connections
            </Typography>
            <Stack spacing={2}>
              {highlightedMembers.map((item) => (
                <Stack
                  key={item.id}
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  sx={{
                    borderRadius: 2,
                    p: { xs: 1.5, md: 2 },
                    bgcolor: (theme) => alpha(theme.palette.background.default, 0.9)
                  }}
                >
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.relation}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.story}
                  </Typography>
                  <Chip label={item.connectionLevel} size="small" sx={{ ml: { md: 'auto' } }} />
                </Stack>
              ))}
              {!highlightedMembers.length && (
                <Typography variant="body2" color="text.secondary">
                  Add a connection to see it highlighted here.
                </Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
