import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FamilyTreeCanvas from '../components/FamilyTreeCanvas.jsx';
import { fetchFamilySnapshot } from '../data/mockFamilyService.js';
import { alpha } from '@mui/material/styles';

const quickActions = [
  {
    label: 'Add memory',
    icon: <FavoriteBorderIcon fontSize="small" />,
    action: 'createMemory'
  }
];

function MemoryCard({ memory }) {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
        boxShadow: '0 14px 30px rgba(125, 46, 50, 0.18)',
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92)
      }}
    >
      <CardActionArea
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'stretch',
          height: '100%'
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
        <CardContent
          sx={{
            flexGrow: 1,
            p: { xs: 2.5, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {memory.date}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {memory.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {memory.description}
          </Typography>
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
          borderRadius: 3,
          p: { xs: 2, md: 2.5 },
          border: (theme) => `1px dashed ${alpha(theme.palette.primary.main, 0.4)}`,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
          textAlign: 'center'
        }}
      >
        <Typography
          variant="overline"
          sx={{
            display: 'block',
            fontWeight: 700,
            letterSpacing: 1.6,
            color: 'secondary.dark',
            mb: 0.5
          }}
        >
          Currently viewing
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Choose a person to see their details
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: { xs: 2, md: 2.5 },
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
        boxShadow: '0 16px 32px rgba(125, 46, 50, 0.22)'
      }}
    >
      <Stack spacing={2}>
        <Typography
          variant="overline"
          sx={{ letterSpacing: 1.6, fontWeight: 700, color: 'primary.main' }}
        >
          Currently viewing
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={member.avatarUrl}
            alt={member.name}
            sx={{
              width: 64,
              height: 64,
              border: (theme) => `3px solid ${alpha(theme.palette.secondary.main, 0.35)}`,
              bgcolor: (theme) => alpha(theme.palette.background.default, 0.6)
            }}
          />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {member.relation}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
              {member.name}
            </Typography>
            {member.location ? (
              <Typography variant="body2" color="text.secondary">
                {member.location}
              </Typography>
            ) : null}
          </Box>
        </Stack>
        {member.highlights?.length ? (
          <Stack spacing={0.75}>
            {member.highlights.map((highlight) => (
              <Typography key={highlight} variant="body2">
                {highlight}
              </Typography>
            ))}
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

  const referenceMember = useMemo(() => {
    if (!members.length) return undefined;
    return members.find((member) => member.id === 'jordan') ?? members[0];
  }, [members]);

  const familyGroupLabel = useMemo(() => {
    if (!referenceMember?.name) {
      return 'your family';
    }
    const parts = referenceMember.name.trim().split(' ');
    if (parts.length > 1) {
      return `${parts[parts.length - 1]} family`;
    }
    return `${referenceMember.name}'s family`;
  }, [referenceMember]);

  const familyGroupLabelWithArticle = useMemo(() => {
    if (!familyGroupLabel) {
      return 'your family';
    }
    return familyGroupLabel.startsWith('your ') ? familyGroupLabel : `the ${familyGroupLabel}`;
  }, [familyGroupLabel]);

  const selectedFirstName = selectedMember?.name?.split(' ')[0];
  const memoriesHeading = selectedFirstName
    ? `Memories for ${selectedFirstName}`
    : `Memories for ${familyGroupLabelWithArticle}`;

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

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Box
        sx={{
          borderRadius: 3,
          px: { xs: 3, md: 4 },
          py: { xs: 3, md: 4 },
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92),
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.65)}, ${alpha(
              theme.palette.background.default,
              0.85
            )})`,
          boxShadow: '0 18px 36px rgba(44, 95, 45, 0.16)'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2.5, md: 3 }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Family sagas for {familyGroupLabelWithArticle}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
              Choose someone on the tree to spotlight their highlights and open shared memories whenever you're ready.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} width={{ xs: '100%', md: 'auto' }}>
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant="contained"
                color="primary"
                size="medium"
                startIcon={action.icon}
                onClick={() => actionHandlers[action.action]?.()}
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  width: { xs: '100%', sm: 'auto' },
                  boxShadow: '0 12px 28px rgba(125, 46, 50, 0.22)'
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          borderRadius: 3,
          px: { xs: 2.5, md: 3 },
          py: { xs: 3, md: 3.5 },
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
          boxShadow: '0 16px 34px rgba(44, 95, 45, 0.18)'
        }}
      >
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="stretch">
          <Grid item xs={12} lg={8}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Three-generation snapshot
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  A quick view of {familyGroupLabelWithArticle} connections—tap anyone to update the spotlight on the right.
                </Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                {loading ? (
                  <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
                ) : (
                  <FamilyTreeCanvas
                    members={members}
                    selectedMemberId={selectedMemberId}
                    onSelectMember={handleSelectMember}
                  />
                )}
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={4} sx={{ display: 'flex' }}>
            <Stack spacing={2.5} sx={{ width: '100%' }}>
              <MemberSpotlight member={selectedMember} />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: 'text.primary' }}
                >
                  {selectedMemories.length} saved moments
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {selectedMember?.name?.split(' ')[0] ?? 'Your family'} is tagged in these memories.
                </Typography>
              </Box>
              {quickActions.map((action) => (
                <Button
                  key={`sidebar-${action.action}`}
                  variant="outlined"
                  color="primary"
                  size="medium"
                  startIcon={action.icon}
                  onClick={() => actionHandlers[action.action]?.()}
                  sx={{
                    borderRadius: 2,
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.35),
                    bgcolor: (theme) => alpha(theme.palette.background.default, 0.7),
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: (theme) => alpha(theme.palette.primary.light, 0.4)
                    }
                  }}
                  fullWidth
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          borderRadius: 3,
          px: { xs: 2.5, md: 3 },
          py: { xs: 3, md: 3.5 },
          border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92),
          boxShadow: '0 18px 34px rgba(44, 95, 45, 0.2)'
        }}
      >
        <Stack spacing={{ xs: 2.5, md: 3 }}>
          <Stack spacing={1}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 0.75, md: 1.5 }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {memoriesHeading}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedMemories.length} saved {selectedMemories.length === 1 ? 'memory' : 'memories'}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {selectedMember?.name?.split(' ')[0] ?? 'Your family'} is tagged in these shared keepsakes.
            </Typography>
          </Stack>

          {loading ? (
            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid key={index} item xs={12} md={6} sx={{ display: 'flex' }}>
                  <Skeleton
                    variant="rounded"
                    height={220}
                    sx={{ borderRadius: 3, width: '100%' }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : selectedMemories.length ? (
            <Grid container spacing={{ xs: 2.5, md: 3 }}>
              {selectedMemories.map((memory) => (
                <Grid key={memory.id} item xs={12} md={6} sx={{ display: 'flex' }}>
                  <MemoryCard memory={memory} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                borderRadius: 3,
                py: { xs: 4, md: 5 },
                px: { xs: 3, md: 4 },
                textAlign: 'center',
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
                boxShadow: '0 18px 32px rgba(44, 95, 45, 0.18)'
              }}
            >
              <Stack spacing={1.5} alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  No memories yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                  Start a simple collection for {selectedMember?.name?.split(' ')[0] ?? 'your family'}.
                </Typography>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => onCreateMemory?.()}
                  startIcon={<FavoriteBorderIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Add memory
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
