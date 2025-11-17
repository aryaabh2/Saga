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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import FamilyTreeCanvas from '../components/FamilyTreeCanvas.jsx';
import { fetchFamilySnapshot } from '../data/mockFamilyService.js';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext.jsx';

const quickActions = [
  {
    label: 'Add memory',
    icon: <FavoriteBorderIcon fontSize="small" />,
    action: 'createMemory'
  }
];

function MemoryCard({ memory, memberMap, selectedMemberId, onOpen }) {
  const participantNames = useMemo(() => {
    return memory.people
      .map((personId) => memberMap.get(personId))
      .filter(Boolean)
      .map((member) => ({
        id: member.id,
        label: member.name.split(' ')[0],
        fullLabel: member.name,
        isSelected: member.id === selectedMemberId
      }));
  }, [memberMap, memory.people, selectedMemberId]);

  const tagLabels = memory.tags ?? [];
  const conciseDescription = useMemo(() => {
    const text = memory.description || '';
    if (text.length > 180) {
      return `${text.slice(0, 177)}...`;
    }
    return text;
  }, [memory.description]);

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: (theme) => `1px solid ${alpha(theme.palette.secondary.dark, 0.45)}`,
        boxShadow: '0 18px 32px rgba(36, 13, 8, 0.18)',
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.98)
      }}
    >
      <CardActionArea
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'stretch',
          height: '100%',
          width: '100%'
        }}
        onClick={() => onOpen?.(memory)}
      >
        <CardMedia
          component="img"
          src={`${memory.coverUrl}`}
          alt={memory.title}
          sx={{
            width: { xs: '100%', lg: 220 },
            height: { xs: 200, lg: '100%' },
            objectFit: 'cover'
          }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            p: { xs: 2.25, sm: 3 },
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
            minWidth: 0
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            {memory.date}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.6 }}>
            {memory.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.5 }}>
            {conciseDescription}
          </Typography>
          {tagLabels.length ? (
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ pt: 1 }}>
              {tagLabels.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: 0.4,
                    bgcolor: (theme) => alpha(theme.palette.primary.light, 0.1)
                  }}
                />
              ))}
            </Stack>
          ) : null}
          {participantNames.length ? (
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ pt: tagLabels.length ? 1 : 2, mt: 'auto' }}
            >
              {participantNames.map((participant) => (
                <Chip
                  key={participant.id}
                  label={participant.label}
                  size="small"
                  title={participant.fullLabel}
                  color={participant.isSelected ? 'primary' : 'default'}
                  sx={{
                    fontWeight: 600,
                    letterSpacing: 0.4,
                    bgcolor: (theme) =>
                      participant.isSelected
                        ? alpha(theme.palette.primary.main, 0.18)
                        : alpha(theme.palette.background.default, 0.8)
                  }}
                />
              ))}
            </Stack>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function MemoryScrollDialog({ memory, open, onClose, memberMap }) {
  if (!memory) return null;

  const participantNames = memory.people
    .map((personId) => memberMap.get(personId))
    .filter(Boolean)
    .map((person) => person.name);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          position: 'relative',
          overflow: 'hidden',
          px: { xs: 2.5, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          backgroundImage:
            'linear-gradient(180deg, rgba(251, 243, 231, 0.98), rgba(233, 213, 180, 0.98)), radial-gradient(circle at 18% 10%, rgba(122, 31, 29, 0.16), transparent 30%)',
          border: (theme) => `2px solid ${alpha(theme.palette.secondary.dark, 0.7)}`,
          boxShadow: '0 28px 60px rgba(36, 13, 8, 0.45)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 10,
            border: (theme) => `1px solid ${alpha(theme.palette.secondary.dark, 0.45)}`,
            pointerEvents: 'none',
            boxShadow: 'inset 0 8px 18px rgba(0,0,0,0.08)'
          }
        }
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Stack spacing={0.5}>
          <Typography variant="overline" color="secondary.dark" sx={{ letterSpacing: 1.8 }}>
            Memory scroll
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {memory.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {memory.date}
          </Typography>
        </Stack>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: (theme) => alpha(theme.palette.secondary.main, 0.4) }}>
        <Stack spacing={2.5}>
          <Box
            component="img"
            src={memory.coverUrl}
            alt={memory.title}
            sx={{
              width: '100%',
              maxHeight: 360,
              objectFit: 'cover',
              border: (theme) => `1px solid ${alpha(theme.palette.secondary.dark, 0.5)}`,
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
            }}
          />
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            {memory.description}
          </Typography>
          {participantNames.length ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Cast of characters
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {participantNames.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: (theme) => alpha(theme.palette.secondary.light, 0.25)
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          ) : null}
          {memory.tags?.length ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Heraldry
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {memory.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
                ))}
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {memory.mediaType ? `Recorded as ${memory.mediaType}` : 'Shared with love'}
        </Typography>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close scroll
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function MemberSpotlight({ member }) {
  if (!member) {
    return (
      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 2, md: 2.5 },
          bgcolor: 'common.white',
          boxShadow: '0 12px 24px rgba(44, 95, 45, 0.12)',
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
        bgcolor: 'common.white',
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
  const [traditions, setTraditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [activeMemory, setActiveMemory] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const snapshot = await fetchFamilySnapshot();
      if (!isMounted) return;
      setMembers(snapshot.members);
      setMemories(snapshot.memories);
      setTraditions(snapshot.upcomingTraditions ?? []);
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

  const greetingName = useMemo(() => {
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    if (referenceMember?.name) {
      return referenceMember.name.split(' ')[0];
    }
    return 'there';
  }, [referenceMember?.name, user?.name]);

  const handleSelectMember = (memberId) => {
    setSelectedMemberId(memberId);
  };

  const handleOpenMemory = (memory) => {
    setActiveMemory(memory);
  };

  const handleCloseMemory = () => {
    setActiveMemory(null);
  };

  const actionHandlers = {
    createMemory: onCreateMemory
  };

  return (
    <>
      <Stack spacing={{ xs: 3, md: 4 }} sx={{ width: '100%', maxWidth: { xs: '100%', lg: 1120 }, mx: 'auto' }}>
      <Box
        sx={{
          borderRadius: 2,
          px: { xs: 3, md: 4 },
          py: { xs: 3, md: 4 },
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
          border: (theme) => `1px solid ${alpha(theme.palette.secondary.dark, 0.5)}`,
          boxShadow: '0 18px 32px rgba(36, 13, 8, 0.18)',
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2.5, md: 3 }}
          alignItems={{ xs: 'center', md: 'center' }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1.6, color: 'primary.main' }}>
              Welcome, {greetingName}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Chronicles of your kin await
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 0.75, maxWidth: 620, mx: { xs: 'auto', md: 0 } }}
            >
              Trace the lineage, mark new gatherings, and unfurl treasured keepsakes across the royal family archive.
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
                  borderRadius: 1,
                  px: 2.5,
                  py: 1,
                  width: { xs: '100%', sm: 'auto' },
                  boxShadow: '0 12px 28px rgba(36, 13, 8, 0.25)'
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
          borderRadius: 2,
          px: { xs: 2.5, md: 3 },
          py: { xs: 3, md: 3.5 },
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92),
          border: (theme) => `1px solid ${alpha(theme.palette.secondary.dark, 0.5)}`,
          boxShadow: '0 16px 34px rgba(36, 13, 8, 0.2)'
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
                    borderRadius: 1,
                    borderColor: (theme) => alpha(theme.palette.secondary.dark, 0.45),
                    bgcolor: (theme) => alpha(theme.palette.background.default, 0.7),
                    '&:hover': {
                      borderColor: 'secondary.dark',
                      bgcolor: (theme) => alpha(theme.palette.secondary.light, 0.3)
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
          borderRadius: 2,
          px: { xs: 2.5, md: 3 },
          py: { xs: 3, md: 3.5 },
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
          border: (theme) => `1px solid ${alpha(theme.palette.secondary.dark, 0.5)}`,
          boxShadow: '0 18px 34px rgba(36, 13, 8, 0.22)'
        }}
      >
        <Stack spacing={{ xs: 2.5, md: 3 }}>
          <Stack spacing={1}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 0.75, md: 1.5 }}
            justifyContent="space-between"
            alignItems={{ xs: 'center', md: 'center' }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, textAlign: { xs: 'center', md: 'left' } }}
            >
              {memoriesHeading}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: { xs: 'center', md: 'right' } }}
            >
              {selectedMemories.length} saved {selectedMemories.length === 1 ? 'memory' : 'memories'}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: 'center', md: 'left' } }}
          >
            {selectedMember?.name?.split(' ')[0] ?? 'Your family'} is tagged in these shared keepsakes.
          </Typography>
          </Stack>

          {loading ? (
            <Grid
              container
              spacing={{ xs: 2.5, md: 3 }}
              justifyContent="center"
              sx={{ px: { xs: 0.5, md: 1 }, mx: 'auto', width: '100%' }}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <Grid key={index} item xs={12} md={6} sx={{ display: 'flex' }}>
                  <Skeleton
                    variant="rounded"
                    height={220}
                    sx={{ borderRadius: 2, width: '100%' }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : selectedMemories.length ? (
            <Grid
              container
              spacing={{ xs: 2.5, md: 3 }}
              justifyContent="center"
              sx={{ px: { xs: 0.5, md: 1 }, mx: 'auto', width: '100%' }}
            >
              {selectedMemories.map((memory) => (
                <Grid key={memory.id} item xs={12} md={6} sx={{ display: 'flex' }}>
                  <MemoryCard
                    memory={memory}
                    memberMap={memberMap}
                    selectedMemberId={selectedMemberId}
                    onOpen={handleOpenMemory}
                  />
                </Grid>
              ))}
            </Grid>
            ) : (
              <Box
                sx={{
                  borderRadius: 2,
                  py: { xs: 4, md: 5 },
                  px: { xs: 3, md: 4 },
                  textAlign: 'center',
                  bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92),
                  border: (theme) => `1px solid ${alpha(theme.palette.secondary.dark, 0.45)}`,
                  boxShadow: '0 18px 32px rgba(36, 13, 8, 0.2)'
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
                  sx={{ borderRadius: 1 }}
                >
                  Add memory
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {traditions.length ? (
        <Box
          sx={{
            borderRadius: 2,
            px: { xs: 2.5, md: 3 },
            py: { xs: 3, md: 3.5 },
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92),
            border: (theme) => `1px solid ${alpha(theme.palette.secondary.dark, 0.5)}`,
            boxShadow: '0 18px 34px rgba(36, 13, 8, 0.2)'
          }}
        >
          <Stack spacing={{ xs: 2.5, md: 3 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 0.75, md: 1.5 }}
              justifyContent="space-between"
              alignItems={{ xs: 'center', md: 'center' }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, textAlign: { xs: 'center', md: 'left' } }}>
                Upcoming traditions
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                color="text.secondary"
                sx={{ justifyContent: { xs: 'center', md: 'flex-end' } }}
              >
                <CalendarMonthIcon fontSize="small" />
                <Typography variant="body2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  Save the dates for the next gatherings.
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={2.5}>
              {traditions.map((tradition, index) => (
                <Box key={tradition.id}>
                  <Stack spacing={1.25}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {tradition.date} · {tradition.time}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {tradition.title}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {tradition.description}
                    </Typography>
                    {tradition.hosts?.length ? (
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {tradition.hosts.map((hostId) => {
                          const hostName = memberMap.get(hostId)?.name;
                          if (!hostName) {
                            return null;
                          }
                          return (
                            <Chip
                              key={`${tradition.id}-${hostId}`}
                              label={hostName.split(' ')[0]}
                              size="small"
                              title={hostName}
                              sx={{
                                fontWeight: 600,
                                letterSpacing: 0.4,
                                bgcolor: (theme) => alpha(theme.palette.secondary.light, 0.18)
                              }}
                            />
                          );
                        })}
                      </Stack>
                    ) : null}
                  </Stack>
                  {index < traditions.length - 1 ? (
                    <Divider sx={{ mt: 2.5, mb: 2.5, borderColor: (theme) => alpha(theme.palette.primary.main, 0.12) }} />
                  ) : null}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      ) : null}
      </Stack>
      <MemoryScrollDialog
        memory={activeMemory}
        open={Boolean(activeMemory)}
        onClose={handleCloseMemory}
        memberMap={memberMap}
      />
    </>
  );
}
