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
    return null;
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        px: { xs: 3, md: 4 },
        py: { xs: 3, md: 3.5 },
        background:
          'radial-gradient(circle at top left, rgba(240, 192, 96, 0.12), transparent 55%), rgba(255,255,255,0.94)'
      }}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={member.avatarUrl}
            alt={member.name}
            sx={{ width: 72, height: 72, border: '4px solid rgba(240,192,96,0.4)' }}
          />
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Currently exploring
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {member.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {member.relation} • {member.location}
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={1.25}>
          <Typography variant="subtitle2" color="text.secondary">
            Favorite highlights
          </Typography>
          <Stack spacing={1}>
            {member.highlights?.map((highlight) => (
              <Stack key={highlight} direction="row" spacing={1.5} alignItems="center">
                <PeopleAltRoundedIcon color="secondary" fontSize="small" />
                <Typography variant="body2">{highlight}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
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
    <Stack spacing={{ xs: 3, md: 4.5 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 3, md: 4 }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
            Your family story, all together in one warm place
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 540 }}>
            Pick up a memory, invite loved ones, and tap through the tree to relive each shared moment.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant={action.action === 'createMemory' ? 'contained' : 'outlined'}
              color="primary"
              size="large"
              startIcon={action.icon}
              endIcon={action.action === 'createMemory' ? <ArrowForwardIcon /> : undefined}
              onClick={() => actionHandlers[action.action]?.()}
              sx={{ borderRadius: 999, px: 3, py: 1.5 }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </Stack>

      <Box sx={{ width: '100%' }}>
        {loading ? (
          <Skeleton
            variant="rounded"
            height={560}
            sx={{ borderRadius: { xs: 4, md: 5 }, bgcolor: 'rgba(255,255,255,0.6)' }}
          />
        ) : (
          <FamilyTreeCanvas
            members={members}
            selectedMemberId={selectedMemberId}
            onSelectMember={handleSelectMember}
          />
        )}
      </Box>

      <Stack spacing={2.75}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Memories featuring {selectedMember?.name?.split(' ')[0] ?? 'our family'}
          </Typography>
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
        ) : (
          <Grid container spacing={{ xs: 2.5, md: 3 }} alignItems="stretch">
            {selectedMember && (
              <Grid item xs={12} md={4}>
                <MemberSpotlight member={selectedMember} />
              </Grid>
            )}
            <Grid item xs={12} md={selectedMember ? 8 : 12}>
              {selectedMemories.length ? (
                <Grid container spacing={2.5}>
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
                      Tag loved ones in the creation flow so everyone featured can revisit and add to the story when
                      it arrives.
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
            </Grid>
          </Grid>
        )}
      </Stack>
    </Stack>
  );
}
