import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SouthRoundedIcon from '@mui/icons-material/SouthRounded';
import FamilyTreeCanvas from '../components/FamilyTreeCanvas.jsx';
import { fetchFamilySnapshot } from '../data/mockFamilyService.js';

const quickActions = [
  {
    label: 'Add a new memory',
    description: 'Upload photos, letters or videos to weave into your next saga.',
    icon: <FavoriteBorderIcon fontSize="small" />,
    action: 'createMemory'
  }
];

function MemoryCard({ memory, onNavigateToMember }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255, 250, 245, 0.9))'
      }}
    >
      <CardActionArea
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <CardMedia
          component="img"
          src={`${memory.coverUrl}`}
          alt={memory.title}
          sx={{
            width: { xs: '100%', sm: 220 },
            height: { xs: 200, sm: '100%' },
            objectFit: 'cover'
          }}
        />
        <CardContent sx={{ flexGrow: 1, p: { xs: 2.5, sm: 3 } }}>
          <Stack spacing={1.25}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip label={memory.mediaType} color="secondary" size="small" sx={{ fontWeight: 600 }} />
              <Typography variant="body2" color="text.secondary">
                {memory.date}
              </Typography>
            </Stack>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {memory.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {memory.description}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {memory.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="outlined" color="secondary" size="small" />
              ))}
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Featuring:
              </Typography>
              {memory.people.map((personId) => (
                <Chip
                  key={`${memory.id}-${personId}`}
                  label={onNavigateToMember.getLabel(personId)}
                  onClick={() => onNavigateToMember.handle(personId)}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(155, 29, 63, 0.08)',
                    borderRadius: 999,
                    fontWeight: 600
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function MemberSpotlight({ member }) {
  if (!member) {
    return (
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 2.5, md: 3 },
          border: '1px dashed rgba(240, 192, 96, 0.5)',
          bgcolor: 'rgba(255,255,255,0.8)',
          textAlign: 'center'
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Choose someone in the tree to view their spotlight
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Highlights and shared memories will appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: 4,
        p: { xs: 2.5, md: 3 },
        bgcolor: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(240, 192, 96, 0.25)',
        boxShadow: '0 18px 42px rgba(15, 23, 42, 0.12)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={member.avatarUrl}
            alt={member.name}
            sx={{ width: 68, height: 68, border: '4px solid rgba(240,192,96,0.35)' }}
          />
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Currently exploring
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
              {member.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Chip
                label={member.relation}
                size="small"
                color="secondary"
                sx={{ fontWeight: 600 }}
              />
              {member.location ? (
                <Typography variant="body2" color="text.secondary">
                  {member.location}
                </Typography>
              ) : null}
            </Stack>
          </Box>
        </Stack>
        {member.highlights?.length ? (
          <Stack spacing={1.25}>
            <Typography variant="subtitle2" color="text.secondary">
              Favorite highlights
            </Typography>
            <Stack spacing={1}>
              {member.highlights.map((highlight) => (
                <Stack key={highlight} direction="row" spacing={1.5} alignItems="center">
                  <PeopleAltRoundedIcon color="secondary" fontSize="small" />
                  <Typography variant="body2">{highlight}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}

export default function HomePage({ onCreateMemory }) {
  const [members, setMembers] = useState([]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const snapshot = await fetchFamilySnapshot();
      if (!isMounted) return;
      setMembers(snapshot.members);
      setMemories(snapshot.memories);
      setSelectedMemberId(snapshot.defaultMemberId || snapshot.members[0]?.id || '');
      setLoading(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const memberMap = useMemo(
    () => new Map(members.map((member) => [member.id, member])),
    [members]
  );

  const selectedMember = selectedMemberId ? memberMap.get(selectedMemberId) : undefined;

  const selectedMemories = useMemo(() => {
    if (!selectedMemberId) return [];
    return memories.filter((memory) => memory.people.includes(selectedMemberId));
  }, [memories, selectedMemberId]);

  const handleSelectMember = (memberId) => {
    setSelectedMemberId(memberId);
  };

  const actionHandlers = {
    createMemory: onCreateMemory
  };

  const navigateHelper = useMemo(
    () => ({
      handle: handleSelectMember,
      getLabel: (memberId) => memberMap.get(memberId)?.name?.split(' ')[0] ?? 'Family member'
    }),
    [memberMap]
  );

  return (
    <Stack spacing={{ xs: 4, md: 5.5 }}>
      <Card
        sx={{
          borderRadius: { xs: 4, md: 5 },
          px: { xs: 3, md: 4 },
          py: { xs: 3, md: 4 },
          backgroundImage:
            'linear-gradient(135deg, rgba(240, 192, 96, 0.12), rgba(155, 29, 63, 0.08)), linear-gradient(0deg, rgba(255,255,255,0.94), rgba(255,255,255,0.94))',
          boxShadow: '0 22px 48px rgba(15, 23, 42, 0.12)'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 4 }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
              Your family story, ready to explore together
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 540 }}>
              Glide across the tree to open a spotlight, then scroll to relive the memories you built together.
            </Typography>
          </Box>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            width={{ xs: '100%', md: 'auto' }}
            flexWrap="wrap"
            useFlexGap
          >
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant={action.action === 'createMemory' ? 'contained' : 'outlined'}
                color="primary"
                size="large"
                startIcon={action.icon}
                endIcon={action.action === 'createMemory' ? <ArrowForwardIcon /> : undefined}
                onClick={() => actionHandlers[action.action]?.()}
                sx={{ borderRadius: 999, px: 3, py: 1.5, width: { xs: '100%', sm: 'auto' } }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Card>

      <Card
        variant="outlined"
        sx={{
          borderRadius: { xs: 4, md: 5 },
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 3, md: 3.5 },
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(255, 250, 245, 0.9)), radial-gradient(circle at top right, rgba(240,192,96,0.18), transparent 55%)',
          boxShadow: '0 26px 56px rgba(15, 23, 42, 0.12)'
        }}
      >
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="stretch">
          <Grid item xs={12} lg={8}>
            <Stack spacing={2.5} sx={{ height: '100%' }}>
              <Box>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                  Family tree
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Zoom out, pan around, and tap a branch to pivot
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 520 }}>
                  The spotlight on the right updates instantly when you select someone new.
                </Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                {loading ? (
                  <Skeleton
                    variant="rounded"
                    height={420}
                    sx={{ borderRadius: { xs: 4, md: 5 }, bgcolor: 'rgba(255,255,255,0.65)' }}
                  />
                ) : (
                  <FamilyTreeCanvas
                    members={members}
                    selectedMemberId={selectedMemberId}
                    onSelectMember={handleSelectMember}
                  />
                )}
              </Box>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                justifyContent={{ xs: 'flex-start', lg: 'center' }}
                sx={{
                  bgcolor: 'rgba(240, 192, 96, 0.14)',
                  borderRadius: 999,
                  px: 2.5,
                  py: 1,
                  alignSelf: { xs: 'stretch', lg: 'center' }
                }}
              >
                <SouthRoundedIcon color="secondary" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Memories continue right below
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
            <Stack spacing={3} sx={{ width: '100%' }}>
              <MemberSpotlight member={selectedMember} />
              <Divider flexItem sx={{ opacity: 0.4 }} />
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" color="text.secondary">
                  Shared moments nearby
                </Typography>
                <Chip
                  label={`${selectedMemories.length} memories feature ${
                    selectedMember?.name?.split(' ')[0] ?? 'your family'
                  }`}
                  color="secondary"
                  sx={{ fontWeight: 600, width: 'fit-content' }}
                />
                <Typography variant="body2" color="text.secondary">
                  Scroll below to browse each moment, or start a new one and invite others to co-create.
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" color="text.secondary">
                  Quick action
                </Typography>
                {quickActions.map((action) => (
                  <Button
                    key={`sidebar-${action.action}`}
                    variant={action.action === 'createMemory' ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                    startIcon={action.icon}
                    endIcon={action.action === 'createMemory' ? <ArrowForwardIcon /> : undefined}
                    onClick={() => actionHandlers[action.action]?.()}
                    sx={{ borderRadius: 3 }}
                    fullWidth
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <Stack spacing={3.25}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2.5}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Memory library
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Featuring {selectedMember?.name?.split(' ')[0] ?? 'our family'}
            </Typography>
          </Box>
          <Chip
            label={`${selectedMemories.length} shared moments`}
            size="small"
            color="secondary"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Grid key={index} item xs={12}>
                <Skeleton variant="rounded" height={220} sx={{ borderRadius: 4 }} />
              </Grid>
            ))}
          </Grid>
        ) : selectedMemories.length ? (
          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {selectedMemories.map((memory) => (
              <Grid item xs={12} key={memory.id}>
                <MemoryCard memory={memory} onNavigateToMember={navigateHelper} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 4,
              py: { xs: 4, md: 5 },
              px: { xs: 3, md: 4 },
              textAlign: 'center',
              background:
                'linear-gradient(135deg, rgba(240, 192, 96, 0.12), rgba(255,255,255,0.94))'
            }}
          >
            <Stack spacing={1.75} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Invite someone to start a new memory with {selectedMember?.name?.split(' ')[0] ?? 'them'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
                Tag loved ones in the creation flow so everyone featured can revisit and add to the story when it
                arrives.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => onCreateMemory?.()}
                startIcon={<FavoriteBorderIcon />}
              >
                Add a new memory
              </Button>
            </Stack>
          </Card>
        )}
      </Stack>
    </Stack>
  );
}
