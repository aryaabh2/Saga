import { useMemo, useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import { keyframes } from '@mui/system';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import TagRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import BookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from 'react-router-dom';
import { getMemberById, listFamilyMemories } from '../data/mockFamilyService.js';

const flipForward = keyframes`
  0% {
    transform: rotateY(0deg) translateZ(0);
    box-shadow: 0 18px 32px rgba(0, 0, 0, 0.18);
  }
  45% {
    transform: rotateY(-90deg) translateZ(18px);
    box-shadow: 0 28px 52px rgba(0, 0, 0, 0.28);
  }
  100% {
    transform: rotateY(-170deg) translateZ(26px);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.25);
  }
`;

const flipBackward = keyframes`
  0% {
    transform: rotateY(0deg) translateZ(0);
    box-shadow: 0 18px 32px rgba(0, 0, 0, 0.18);
  }
  45% {
    transform: rotateY(90deg) translateZ(18px);
    box-shadow: 0 28px 52px rgba(0, 0, 0, 0.28);
  }
  100% {
    transform: rotateY(170deg) translateZ(26px);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.25);
  }
`;

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
          ? '0 28px 52px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.52)'
          : '0 18px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.45)',
        transformOrigin: 'center',
        backfaceVisibility: 'hidden',
        transition: 'transform 0.6s ease, box-shadow 0.6s ease',
        transform: flipped ? 'rotateY(-10deg) translateZ(10px)' : 'rotateY(0deg) translateZ(0)'
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
  const canGoPrev = activeSpread > 0 && !turning;
  const canGoNext = activeSpread < spreads.length - 1 && !turning;

  const orderFlow = [
    {
      label: 'Keepsake bundle',
      icon: <BookRoundedIcon color="primary" />,
      title: 'Choose your keepsake set',
      description: 'Hardcover heirloom book, foil-stamped linen cover, and a matching slipcase to protect every page.',
      highlights: [
        { label: 'Hardcover 9x11\"', detail: 'Layflat archival paper, debossed title and family crest foil stamp.' },
        { label: '10 archival prints', detail: 'Loose prints for framing and gifting, printed from your favorite memories.' },
        { label: 'Digital backup', detail: 'Cloud-safe PDF and audiobook narration for everyone in the circle.' }
      ],
      cta: 'Continue to delivery'
    },
    {
      label: 'Delivery',
      icon: <LocalShippingRoundedIcon color="primary" />,
      title: 'Ship it to your family circle',
      description: 'We pre-fill your preferred address so you can review and adjust before sending to the printer.',
      highlights: [
        { label: 'Standard shipping', detail: 'Arrives between Sep 18 - Sep 22. Tracking and signature included.' },
        { label: 'Gift wrap', detail: 'Included linen wrap, ribbon, and handwritten enclosure note.' },
        { label: 'Pickup updates', detail: 'Email + text notifications when printing starts and when the courier scans it.' }
      ],
      cta: 'Continue to payment'
    },
    {
      label: 'Checkout',
      icon: <PaymentRoundedIcon color="primary" />,
      title: 'Preview payment and lock the print run',
      description: 'This is a demo checkout—confirming will simulate a paid order without charging you.',
      highlights: [
        { label: 'Keepsake set', detail: '$129' },
        { label: 'Insured shipping', detail: '$12' },
        { label: 'Estimated total', detail: '$141 + tax (demo authorization only)' }
      ],
      cta: 'Place demo order'
    }
  ];
  const [orderStep, setOrderStep] = useState(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handleTurn = (direction) => {
    if (turning) return;
    if (direction === 'next' && canGoNext) {
      setTurning('next');
      setTimeout(() => {
        setActiveSpread((prev) => prev + 1);
        setTurning(null);
      }, 650);
    }
    if (direction === 'prev' && canGoPrev) {
      setTurning('prev');
      setTimeout(() => {
        setActiveSpread((prev) => prev - 1);
        setTurning(null);
      }, 650);
    }
  };

  const startOrderFlow = () => {
    setOrderStep(0);
    setOrderCompleted(false);
  };

  const closeOrderFlow = () => {
    setOrderStep(null);
    setOrderCompleted(false);
  };

  const advanceOrderFlow = () => {
    if (orderStep === null) return;
    if (orderStep < orderFlow.length - 1) {
      setOrderStep((prev) => prev + 1);
      return;
    }
    setOrderCompleted(true);
  };

  const retreatOrderFlow = () => {
    if (orderStep === null) return;
    setOrderStep((prev) => Math.max(0, prev - 1));
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
              variant="outlined"
              color="secondary"
              startIcon={<ShoppingBagRoundedIcon />}
              onClick={startOrderFlow}
              sx={{
                backgroundColor: 'rgba(181, 18, 47, 0.04)',
                borderColor: alpha('#b5122f', 0.35),
                color: 'secondary.dark',
                '&:hover': { backgroundColor: alpha('#b5122f', 0.08), borderColor: '#b5122f' }
              }}
            >
              Order printed saga
            </Button>
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

      <Collapse in={orderStep !== null} timeout={300} unmountOnExit>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            backgroundImage: 'linear-gradient(120deg, rgba(255,248,242,0.85), rgba(244,221,191,0.9))',
            borderColor: alpha('#b5122f', 0.18),
            boxShadow: '0 18px 32px rgba(122, 8, 32, 0.14)'
          }}
        >
          <CardContent>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack spacing={0.75}>
                  <Typography variant="overline" color="secondary.dark">
                    Print "Your Saga"
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Reserve a keepsake book and slipcase
                  </Typography>
                  <Typography color="text.secondary">
                    Walk through a demo checkout flow—perfect for showing a client how the keepsake is produced, shipped,
                    and paid for without charging a real card.
                  </Typography>
                  {orderCompleted && (
                    <Chip
                      color="success"
                      icon={<CheckCircleRoundedIcon />}
                      label="Demo order placed and sent to the printer"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  )}
                </Stack>
                <IconButton aria-label="Close order flow" onClick={closeOrderFlow}>
                  <CloseRoundedIcon />
                </IconButton>
              </Stack>

              <Stepper activeStep={orderStep ?? 0} alternativeLabel>
                {orderFlow.map((step, index) => (
                  <Step key={step.label} completed={orderCompleted || (orderStep ?? 0) > index}>
                    <StepLabel icon={step.icon}>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {orderStep !== null && (
                <Stack spacing={2.5}>
                  <Stack spacing={1}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {orderFlow[orderStep].title}
                    </Typography>
                    <Typography color="text.secondary">{orderFlow[orderStep].description}</Typography>
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {orderFlow[orderStep].highlights.map((highlight) => (
                      <Box
                        key={highlight.label}
                        sx={{
                          flex: 1,
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: alpha('#b5122f', 0.2),
                          background: alpha('#fff', 0.9),
                          boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
                        }}
                      >
                        <Chip
                          label={highlight.label}
                          size="small"
                          color="secondary"
                          sx={{ mb: 1, bgcolor: alpha('#b5122f', 0.1), borderColor: alpha('#b5122f', 0.3), borderWidth: 1 }}
                        />
                        <Typography>{highlight.detail}</Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Divider flexItem />

                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={1.5}>
                    <Button
                      onClick={orderStep === 0 ? closeOrderFlow : retreatOrderFlow}
                      color="secondary"
                      sx={{ textTransform: 'none' }}
                    >
                      {orderStep === 0 ? 'Cancel' : 'Back'}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={advanceOrderFlow}
                      color={orderStep === orderFlow.length - 1 ? 'success' : 'primary'}
                      sx={{ boxShadow: '0 14px 32px rgba(122, 8, 32, 0.24)', minWidth: 220 }}
                      disabled={orderCompleted}
                    >
                      {orderCompleted ? 'Order placed' : orderFlow[orderStep].cta}
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Collapse>

      <Box
        sx={{
          position: 'relative',
          perspective: 2200,
          px: { xs: 0, sm: 2 },
          pb: 2,
          mt: 1
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
        <IconButton
          onClick={() => handleTurn('prev')}
          disabled={!canGoPrev}
          sx={{
            position: 'absolute',
            top: '50%',
            left: { xs: 6, md: 14 },
            transform: 'translateY(-50%)',
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'common.white',
            boxShadow: '0 18px 32px rgba(0,0,0,0.22)',
            border: '1px solid',
            borderColor: alpha('#b5122f', 0.35),
            color: 'text.primary',
            zIndex: 2,
            '&:hover': { bgcolor: 'primary.main', color: '#fff' },
            '&:disabled': { opacity: 0.4, boxShadow: 'none' }
          }}
        >
          <ChevronLeftRoundedIcon />
        </IconButton>
        <IconButton
          onClick={() => handleTurn('next')}
          disabled={!canGoNext}
          sx={{
            position: 'absolute',
            top: '50%',
            right: { xs: 6, md: 14 },
            transform: 'translateY(-50%)',
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: 'common.white',
            boxShadow: '0 18px 32px rgba(0,0,0,0.22)',
            border: '1px solid',
            borderColor: alpha('#b5122f', 0.35),
            color: 'text.primary',
            zIndex: 2,
            '&:hover': { bgcolor: 'primary.main', color: '#fff' },
            '&:disabled': { opacity: 0.4, boxShadow: 'none' }
          }}
        >
          <ChevronRightRoundedIcon />
        </IconButton>
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 2, md: 1.5 },
            minHeight: { xs: 780, md: 560 },
            transformStyle: 'preserve-3d',
            transition: 'transform 0.45s ease',
            transform:
              turning === 'next'
                ? 'rotateY(-5deg) translateZ(12px)'
                : turning === 'prev'
                ? 'rotateY(5deg) translateZ(12px)'
                : 'rotateY(0deg)'
          }}
        >
          {spreads[activeSpread]?.map((memory, index) => {
            const isLeftPage = index === 0;
            const isFlippingForward = turning === 'next' && isLeftPage;
            const isFlippingBackward = turning === 'prev' && !isLeftPage;
            const isPrimaryTurningPage = isFlippingForward || isFlippingBackward;
            const restingTilt = turning ? 'rotateY(0deg)' : `rotateY(${isLeftPage ? -2.5 : 2.5}deg)`;
            const pageAnimation = isFlippingForward
              ? `${flipForward} 0.7s cubic-bezier(0.32, 0.72, 0, 1)`
              : isFlippingBackward
              ? `${flipBackward} 0.7s cubic-bezier(0.32, 0.72, 0, 1)`
              : 'none';

            return (
              <Box
                key={memory.id}
                sx={{
                  height: '100%',
                  perspective: 1600,
                  transformStyle: 'preserve-3d',
                  px: { xs: 1, md: isLeftPage ? 0 : 2 },
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: 14,
                    left: isLeftPage ? '100%' : -14,
                    background: `linear-gradient(180deg, ${alpha('#7a0820', 0.3)}, ${alpha('#d4af37', 0.2)})`,
                    filter: 'blur(16px)',
                    opacity: 0.5
                  }}
                />
                <Box
                  sx={{
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transformOrigin: isLeftPage ? 'right center' : 'left center',
                    transition: 'transform 0.5s ease, box-shadow 0.5s ease',
                    animation: pageAnimation,
                    transform: pageAnimation === 'none' ? `${restingTilt} translateZ(0)` : undefined,
                    boxShadow: '0 18px 32px rgba(0,0,0,0.18)'
                  }}
                >
                  <MemoryLeaf memory={memory} flipped={isPrimaryTurningPage || turning !== null} />
                </Box>
              </Box>
            );
          })}
        </Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          mt={3}
          sx={{
            position: 'relative',
            zIndex: 2,
            bgcolor: alpha('#fff', 0.8),
            borderRadius: 999,
            px: 1.5,
            py: 0.75,
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <IconButton
            onClick={() => handleTurn('prev')}
            disabled={!canGoPrev}
            sx={{ border: '1px solid', borderColor: alpha('#b5122f', 0.4) }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            Page {activeSpread + 1} of {spreads.length}
          </Typography>
          <IconButton
            onClick={() => handleTurn('next')}
            disabled={!canGoNext}
            sx={{ border: '1px solid', borderColor: alpha('#b5122f', 0.4) }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}
