import { useMemo, useState } from 'react';
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
import { alpha, useTheme } from '@mui/material/styles';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import SparklesRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { listFamilyMembers, listFamilyMemories } from '../data/mockFamilyService.js';
import { useAuth } from '../context/AuthContext.jsx';

function TreeNode({ member, position, strength, onClick }) {
  const theme = useTheme();
  const shadowColor = strength > 0 ? theme.palette.primary.main : theme.palette.secondary.main;
  const glow = `0 0 14px ${alpha(shadowColor, 0.6)}, 0 0 32px ${alpha(shadowColor, 0.35)}`;

  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        textAlign: 'center'
      }}
    >
      <Box
        sx={{
          width: 104,
          height: 104,
          borderRadius: '50%',
          border: `2px solid ${alpha(theme.palette.secondary.dark, 0.72)}`,
          background: `radial-gradient(circle at 30% 30%, ${alpha(theme.palette.secondary.light, 0.55)}, ${alpha(
            theme.palette.background.paper,
            0.95
          )})`,
          boxShadow: glow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
          '&:hover': {
            transform: 'translate(-50%, -50%) scale(1.04)',
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 16px ${alpha(theme.palette.primary.main, 0.75)}, 0 0 42px ${alpha(
              theme.palette.primary.main,
              0.45
            )}`
          }
        }}
      >
        <Avatar
          src={member.avatarUrl || ''}
          alt={member.name}
          sx={{
            width: 86,
            height: 86,
            bgcolor: alpha(theme.palette.text.secondary, 0.12),
            color: theme.palette.text.primary,
            fontWeight: 700,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.35)}`
          }}
        >
          {member.name
            .split(' ')
            .map((part) => part[0])
            .join('')}
        </Avatar>
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {member.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {member.relation || 'Relative'}
      </Typography>
      {strength > 0 ? (
        <Chip
          size="small"
          label={`${strength} shared memorie${strength === 1 ? '' : 's'}`}
          icon={<SparklesRoundedIcon fontSize="small" />}
          sx={{
            bgcolor: alpha(theme.palette.primary.light, 0.2),
            borderColor: alpha(theme.palette.primary.main, 0.4),
            borderWidth: 1,
            borderStyle: 'solid',
            color: theme.palette.primary.dark,
            boxShadow: glow
          }}
        />
      ) : null}
    </Box>
  );
}

export default function FamilyTreePage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [members, setMembers] = useState(() => listFamilyMembers());
  const memories = useMemo(() => listFamilyMemories(), []);
  const userId = user?.id || 'jordan';
  const [newMember, setNewMember] = useState({ name: '', relation: '' });
  const [spotlightId, setSpotlightId] = useState(userId);

  const connectionStrengths = useMemo(() => {
    const counts = {};
    members.forEach((member) => {
      const overlap = memories.filter(
        (memory) => memory.people.includes(userId) && memory.people.includes(member.id)
      );
      counts[member.id] = overlap.length;
    });
    return counts;
  }, [memories, members, userId]);

  const orbitMembers = members.filter((member) => member.id !== userId);

  const positions = useMemo(() => {
    const total = orbitMembers.length;
    const radiusSteps = [28, 40, 52];
    const assigned = {};
    orbitMembers.forEach((member, index) => {
      const angle = (2 * Math.PI * index) / total;
      const ring = radiusSteps[index % radiusSteps.length];
      assigned[member.id] = {
        x: 50 + ring * Math.cos(angle),
        y: 50 + ring * Math.sin(angle)
      };
    });

    assigned[userId] = { x: 50, y: 50 };
    return assigned;
  }, [orbitMembers, userId]);

  const handleAddMember = () => {
    if (!newMember.name.trim()) return;
    setMembers((previous) => [
      ...previous,
      {
        id: `new-${previous.length + 1}`,
        name: newMember.name.trim(),
        relation: newMember.relation.trim() || 'Relative',
        tagline: 'New branch waiting for stories',
        avatarUrl: '',
        generation: 2,
        highlights: []
      }
    ]);
    setNewMember({ name: '', relation: '' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          backgroundImage: `radial-gradient(circle at 16% 24%, ${alpha(
            theme.palette.primary.main,
            0.16
          )}, transparent 36%), linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.96)}, ${alpha(
            theme.palette.background.paper,
            0.82
          )})`
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
          <Stack spacing={1}>
            <Typography variant="overline" color="secondary.dark">
              Ancestral map
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Family tree with glowing bonds
            </Typography>
            <Typography color="text.secondary" maxWidth={760}>
              Each connection brightens as you collect more shared memories. Click a portrait to spotlight
              a branch, or add a new leaf to begin inviting them into stories.
            </Typography>
          </Stack>
          <Chip
            icon={<ForestRoundedIcon />}
            label={`${members.length} relatives mapped`}
            sx={{
              alignSelf: { xs: 'flex-start', md: 'center' },
              bgcolor: alpha(theme.palette.secondary.light, 0.3),
              borderColor: alpha(theme.palette.secondary.dark, 0.4),
              borderWidth: 1,
              borderStyle: 'solid'
            }}
          />
        </Stack>
        <Box
          sx={{
            position: 'relative',
            mt: 4,
            borderRadius: 4,
            overflow: 'hidden',
            minHeight: { xs: 460, md: 520 },
            background: `radial-gradient(circle at 20% 28%, ${alpha(
              theme.palette.primary.main,
              0.12
            )}, transparent 30%), linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.94)}, ${alpha(
              theme.palette.background.default,
              0.92
            )})`,
            border: `1px solid ${alpha(theme.palette.secondary.dark, 0.45)}`,
            boxShadow: '0 24px 48px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.45)'
          }}
        >
          <Box component="svg" viewBox="0 0 100 100" preserveAspectRatio="none" sx={{ position: 'absolute', inset: 0 }}>
            {orbitMembers.map((member) => {
              const pos = positions[member.id];
              const center = positions[userId];
              const intensity = connectionStrengths[member.id] || 1;
              return (
                <line
                  key={member.id}
                  x1={center.x}
                  y1={center.y}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={theme.palette.primary.main}
                  strokeWidth={2 + intensity * 0.8}
                  strokeLinecap="round"
                  style={{
                    filter: `drop-shadow(0 0 4px ${alpha(theme.palette.primary.main, 0.55)})`,
                    opacity: 0.85
                  }}
                />
              );
            })}
          </Box>

          {members.map((member) => (
            <TreeNode
              key={member.id}
              member={member}
              position={positions[member.id] || { x: 50, y: 50 }}
              strength={connectionStrengths[member.id] || 0}
              onClick={() => setSpotlightId(member.id)}
            />
          ))}

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: spotlightId
                ? `radial-gradient(circle at ${positions[spotlightId]?.x || 50}% ${positions[spotlightId]?.y || 50}%, ${alpha(
                    theme.palette.primary.light,
                    0.22
                  )}, transparent 40%)`
                : 'transparent',
              pointerEvents: 'none'
            }}
          />
        </Box>
      </Card>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <SparklesRoundedIcon color="primary" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Glow rules
                  </Typography>
                  <Typography color="text.secondary">
                    Shared stories between you and someone increase the brightness of their connection line.
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={1}>
                {orbitMembers.slice(0, 6).map((member) => (
                  <Stack
                    key={member.id}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      border: `1px dashed ${alpha(theme.palette.secondary.dark, 0.4)}`,
                      backgroundColor: alpha(theme.palette.secondary.light, 0.16)
                    }}
                  >
                    <Avatar src={member.avatarUrl || ''} alt={member.name} sx={{ width: 44, height: 44 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 700 }}>{member.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.relation || 'Relative'}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={`${connectionStrengths[member.id] || 0} memories`}
                      sx={{ bgcolor: alpha(theme.palette.primary.light, 0.16) }}
                    />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <PersonAddAlt1RoundedIcon color="secondary" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Add a new branch
                  </Typography>
                  <Typography color="text.secondary">
                    Invite someone new by name and relationship. They will appear on the map ready for memories.
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  value={newMember.name}
                  onChange={(event) => setNewMember((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Aunt Lila"
                  fullWidth
                />
                <TextField
                  label="Relationship"
                  value={newMember.relation}
                  onChange={(event) => setNewMember((prev) => ({ ...prev, relation: event.target.value }))}
                  placeholder="Cousin, family friend, etc."
                  fullWidth
                />
                <Button
                  variant="contained"
                  startIcon={<PersonAddAlt1RoundedIcon />}
                  onClick={handleAddMember}
                  sx={{ alignSelf: 'flex-start', px: 3 }}
                >
                  Place on the tree
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
