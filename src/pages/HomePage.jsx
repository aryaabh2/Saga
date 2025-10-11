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
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        bgcolor: 'background.paper'
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
            <Typography variant="subtitle2" color="text.secondary">
              {memory.date}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {memory.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {memory.description}
            </Typography>
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
          borderRadius: 3,
          p: { xs: 2, md: 2.5 },
          border: '1px dashed',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          textAlign: 'center'
        }}
      >
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
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none'
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={member.avatarUrl}
            alt={member.name}
            sx={{ width: 64, height: 64 }}
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
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2.5, md: 3 }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
              Pick someone in the tree and open a memory when you are ready.
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
                sx={{ borderRadius: 2, px: 2.5, py: 1, width: { xs: '100%', sm: 'auto' } }}
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
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="stretch">
          <Grid item xs={12} lg={8}>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Family tree
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Tap anyone to update the spotlight on the right.
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
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
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
                  sx={{ borderRadius: 2 }}
                  fullWidth
                >
                  {action.label}
                </Button>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Memories
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedMemories.length} items
          </Typography>
        </Stack>

        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Grid key={index} item xs={12}>
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        ) : selectedMemories.length ? (
          <Grid container spacing={{ xs: 2.5, md: 3 }}>
            {selectedMemories.map((memory) => (
              <Grid item xs={12} key={memory.id}>
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
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
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
    </Stack>
  );
}
