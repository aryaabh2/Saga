import { useMemo, useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import TagRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import { useNavigate } from 'react-router-dom';
import { getMemberById, listFamilyMemories } from '../data/mockFamilyService.js';

function MemoryLeaf({ memory, flipped }) {
  const participants = memory.people.map((personId) => getMemberById(personId)?.name).filter(Boolean);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        backgroundImage: `linear-gradient(180deg, ${alpha('#fffaf3', 0.95)}, ${alpha('#f4ddbf', 0.98)})`,
        boxShadow: flipped
          ? '0 26px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.52)'
          : '0 18px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.45)',
        transformOrigin: 'left center',
        backfaceVisibility: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 200,
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.22), rgba(0,0,0,0.55)), url(${memory.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          display: 'flex',
          alignItems: 'flex-end',
          p: 2.5
        }}
      >
        <Stack spacing={0.5}>
          <Chip
            label={memory.mediaType}
            size="small"
            sx={{ alignSelf: 'flex-start', bgcolor: alpha('#fff', 0.25), color: '#fff', borderColor: alpha('#fff', 0.5) }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {memory.title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {memory.date}
          </Typography>
        </Stack>
      </Box>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, flexGrow: 1 }}>
        <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {memory.description}
        </Typography>
        <Divider flexItem>
          <Chip icon={<PeopleAltRoundedIcon />} label="With" size="small" />
        </Divider>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {participants.map((person) => (
            <Chip
              key={person}
              label={person}
              size="small"
              sx={{ bgcolor: alpha('#d4af37', 0.18), borderColor: alpha('#b5122f', 0.18), borderWidth: 1, borderStyle: 'solid' }}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
          <AccessTimeRoundedIcon fontSize="small" />
          <Typography variant="body2">Captured {memory.date}</Typography>
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {memory.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" icon={<TagRoundedIcon />} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const memories = useMemo(() => listFamilyMemories(), []);
  const spreads = useMemo(() => {
    const pages = [];
    for (let i = 0; i < memories.length; i += 2) {
      pages.push(memories.slice(i, i + 2));
    }
    return pages;
  }, [memories]);
  const [activeSpread, setActiveSpread] = useState(0);
  const [turning, setTurning] = useState(null);

  const handleTurn = (direction) => {
    if (turning) return;
    if (direction === 'next' && activeSpread < spreads.length - 1) {
      setTurning('next');
      setTimeout(() => {
        setActiveSpread((prev) => prev + 1);
        setTurning(null);
      }, 420);
    }
    if (direction === 'prev' && activeSpread > 0) {
      setTurning('prev');
      setTimeout(() => {
        setActiveSpread((prev) => prev - 1);
        setTurning(null);
      }, 420);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          backgroundImage:
            'radial-gradient(circle at 18% 20%, rgba(181, 18, 47, 0.12), transparent 32%), linear-gradient(135deg, rgba(255, 248, 242, 0.96), rgba(246, 226, 196, 0.95))'
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack spacing={1}>
            <Typography variant="overline" color="secondary.dark">
              Library of moments
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Your memories in a keepsake book
            </Typography>
            <Typography color="text.secondary" maxWidth={720}>
              Flip through the family memories like an heirloom storybook. Each spread carries the textures,
              warmth, and voices from the people you love most.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddCircleRoundedIcon />}
              onClick={() => navigate('/memories/new')}
              sx={{ boxShadow: '0 14px 32px rgba(122, 8, 32, 0.28)' }}
            >
              Add memory
            </Button>
          </Stack>
        </Stack>
      </Card>

      <Box
        sx={{
          position: 'relative',
          perspective: 2000,
          px: { xs: 0, sm: 2 },
          pb: 2
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 12,
            transform: 'translateX(-50%)',
            width: { xs: '90%', md: '70%' },
            height: 'calc(100% - 40px)',
            borderRadius: 4,
            background: alpha('#7a0820', 0.06),
            filter: 'blur(22px)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 2, md: 0 },
            minHeight: { xs: 780, md: 520 },
            transformStyle: 'preserve-3d',
            transition: 'transform 0.45s ease',
            transform: turning === 'next' ? 'rotateY(-6deg)' : turning === 'prev' ? 'rotateY(6deg)' : 'rotateY(0deg)'
          }}
        >
          {spreads[activeSpread]?.map((memory, index) => (
            <Box
              key={memory.id}
              sx={{
                height: '100%',
                perspective: 1600,
                transformStyle: 'preserve-3d',
                px: { xs: 1, md: index === 0 ? 0 : 2 },
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: 12,
                  left: index === 0 ? '100%' : -12,
                  background: `linear-gradient(180deg, ${alpha('#7a0820', 0.3)}, ${alpha('#d4af37', 0.2)})`,
                  filter: 'blur(14px)',
                  opacity: 0.5
                }}
              />
              <Box
                sx={{
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.45s ease, box-shadow 0.45s ease',
                  transform:
                    turning === 'next'
                      ? index === 0
                        ? 'rotateY(-12deg)'
                        : 'rotateY(-6deg)'
                      : turning === 'prev'
                      ? index === 0
                        ? 'rotateY(12deg)'
                        : 'rotateY(6deg)'
                      : 'rotateY(0deg)'
                }}
              >
                <MemoryLeaf memory={memory} flipped={turning === 'next'} />
              </Box>
            </Box>
          ))}
        </Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          mt={3}
          sx={{ position: 'relative', zIndex: 2 }}
        >
          <IconButton
            onClick={() => handleTurn('prev')}
            disabled={activeSpread === 0 || turning !== null}
            sx={{ border: '1px solid', borderColor: alpha('#b5122f', 0.4) }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Page {activeSpread + 1} of {spreads.length}
          </Typography>
          <IconButton
            onClick={() => handleTurn('next')}
            disabled={activeSpread === spreads.length - 1 || turning !== null}
            sx={{ border: '1px solid', borderColor: alpha('#b5122f', 0.4) }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}
