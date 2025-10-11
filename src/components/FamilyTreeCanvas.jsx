import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Fade, Tooltip, Typography } from '@mui/material';

function buildTreeLayout(members) {
  if (!members.length) {
    return [];
  }

  const generationGroups = members.reduce((groups, member) => {
    const generation = member.generation ?? 0;
    if (!groups[generation]) {
      groups[generation] = [];
    }
    groups[generation].push(member);
    return groups;
  }, {});

  const maxGeneration = Math.max(...members.map((member) => member.generation ?? 0), 0);
  const verticalMargin = 8; // percentage
  const horizontalMargin = 10; // percentage
  const verticalRange = 100 - verticalMargin * 2;
  const horizontalRange = 100 - horizontalMargin * 2;

  return members.map((member) => {
    const generation = member.generation ?? 0;
    const group = generationGroups[generation] || [];
    const sortedGroup = group
      .slice()
      .sort((a, b) => (a.name > b.name ? 1 : -1));
    const index = sortedGroup.findIndex((item) => item.id === member.id);
    const denominator = sortedGroup.length + 1;
    const positionInGroup = denominator > 0 ? (index + 1) / denominator : 0.5;
    const x = horizontalMargin + positionInGroup * horizontalRange;
    const normalizedGeneration = maxGeneration > 0 ? generation / maxGeneration : 0;
    const y = verticalMargin + normalizedGeneration * verticalRange;

    return {
      ...member,
      x,
      y,
      generation,
      orderInGeneration: index
    };
  });
}

function buildConnectors(members) {
  const connectors = new Map();

  members.forEach((member) => {
    if (member.children) {
      member.children.forEach((childId) => {
        const key = `${member.id}->${childId}`;
        connectors.set(key, { from: member.id, to: childId });
      });
    }
    if (member.parents) {
      member.parents.forEach((parentId) => {
        const key = `${parentId}->${member.id}`;
        if (!connectors.has(key)) {
          connectors.set(key, { from: parentId, to: member.id });
        }
      });
    }
  });

  return Array.from(connectors.values());
}

function FamilyNode({ member, selected, onSelect }) {
  return (
    <Tooltip
      arrow
      enterTouchDelay={0}
      title={
        <Box sx={{ px: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {member.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {member.tagline}
          </Typography>
        </Box>
      }
    >
      <Box
        role="button"
        onClick={() => onSelect(member.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect(member.id);
          }
        }}
        tabIndex={0}
        data-member-node
        sx={{
          position: 'absolute',
          top: `${member.y}%`,
          left: `${member.x}%`,
          transform: `translate(-50%, -50%) scale(${selected ? 1.12 : 1})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          width: { xs: 140, md: 160 },
          cursor: 'pointer',
          outline: 'none',
          transition: 'transform 0.35s ease, opacity 0.35s ease'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: 72, md: 88 },
            height: { xs: 72, md: 88 },
            borderRadius: '50%',
            backgroundImage: selected
              ? (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: selected
              ? '0 16px 32px rgba(155, 29, 63, 0.3)'
              : '0 12px 30px rgba(16, 24, 40, 0.12)',
            border: (theme) => `3px solid ${selected ? theme.palette.primary.main : 'rgba(255,255,255,0.8)'}`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease'
          }}
        >
          <Avatar
            src={member.avatarUrl}
            alt={member.name}
            sx={{
              width: { xs: 64, md: 76 },
              height: { xs: 64, md: 76 },
              border: '3px solid rgba(255,255,255,0.6)'
            }}
          />
        </Box>
        <Box
          sx={{
            bgcolor: selected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255,255,255,0.85)',
            borderRadius: 999,
            px: 2,
            py: 0.75,
            boxShadow: selected ? '0 10px 20px rgba(155, 29, 63, 0.18)' : '0 6px 14px rgba(16,24,40,0.12)',
            textAlign: 'center',
            backdropFilter: 'blur(12px)'
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {member.name.split(' ')[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {member.relation}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
}

const MemoizedFamilyNode = memo(FamilyNode);

function ConnectorLayer({ lines }) {
  return (
    <svg
      aria-hidden
      width="100%"
      height="100%"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="family-connector" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(155, 29, 63, 0.38)" />
          <stop offset="100%" stopColor="rgba(240, 192, 96, 0.4)" />
        </linearGradient>
      </defs>
      {lines.map((line) => (
        <path
          key={line.key}
          d={line.path}
          stroke="url(#family-connector)"
          strokeWidth={line.emphasis ? 5 : 3.2}
          fill="transparent"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function computeConnectorPaths(positionedMembers) {
  const edges = buildConnectors(positionedMembers);
  const memberMap = new Map(positionedMembers.map((member) => [member.id, member]));

  return edges
    .map((edge) => {
      const from = memberMap.get(edge.from);
      const to = memberMap.get(edge.to);
      if (!from || !to) {
        return null;
      }

      const startX = from.x * 10;
      const startY = from.y * 10;
      const endX = to.x * 10;
      const endY = to.y * 10;
      const midpointY = (startY + endY) / 2;

      return {
        key: `${edge.from}-${edge.to}`,
        path: `M ${startX} ${startY} C ${startX} ${midpointY}, ${endX} ${midpointY}, ${endX} ${endY}`,
        emphasis: from.generation === 2 || to.generation === 2
      };
    })
    .filter(Boolean);
}

function FamilyTreeCanvas({ members, selectedMemberId, onSelectMember }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry?.contentRect) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const positionedMembers = useMemo(() => buildTreeLayout(members), [members]);
  const connectors = useMemo(() => computeConnectorPaths(positionedMembers), [positionedMembers]);
  const selectedMember = useMemo(
    () => positionedMembers.find((member) => member.id === selectedMemberId),
    [positionedMembers, selectedMemberId]
  );

  useEffect(() => {
    if (!selectedMember || !containerSize.width || !containerSize.height) {
      return;
    }

    setView((prev) => {
      const targetScale = Math.min(Math.max(prev.scale, 1.12), 1.45);
      const nodeX = (selectedMember.x / 100) * containerSize.width;
      const nodeY = (selectedMember.y / 100) * containerSize.height;
      const translateX = containerSize.width / 2 - nodeX * targetScale;
      const translateY = containerSize.height / 2 - nodeY * targetScale;
      return { scale: targetScale, x: translateX, y: translateY };
    });
  }, [containerSize.height, containerSize.width, selectedMember]);

  useEffect(() => {
    return () => {
      dragState.current.active = false;
    };
  }, []);

  const clampScale = (value) => Math.min(Math.max(value, 0.75), 1.75);

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    const nodeTarget = event.target.closest('[data-member-node]');
    if (nodeTarget) {
      return;
    }

    dragState.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: view.x,
      originY: view.y
    };
    setIsDragging(true);
    canvasRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragState.current.active) {
      return;
    }

    const deltaX = event.clientX - dragState.current.startX;
    const deltaY = event.clientY - dragState.current.startY;

    setView((prev) => ({ ...prev, x: dragState.current.originX + deltaX, y: dragState.current.originY + deltaY }));
  };

  const handlePointerUp = (event) => {
    if (!dragState.current.active) {
      return;
    }

    dragState.current.active = false;
    setIsDragging(false);
    canvasRef.current?.releasePointerCapture(event.pointerId);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    setView((prev) => {
      const wheelDirection = event.deltaY < 0 ? 1 : -1;
      const nextScale = clampScale(prev.scale + wheelDirection * 0.08);
      const preZoomX = (offsetX - prev.x) / prev.scale;
      const preZoomY = (offsetY - prev.y) / prev.scale;
      const nextX = offsetX - preZoomX * nextScale;
      const nextY = offsetY - preZoomY * nextScale;
      return { scale: nextScale, x: nextX, y: nextY };
    });
  };

  return (
    <Fade in={isMounted} timeout={600}>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          borderRadius: { xs: 4, md: 5 },
          minHeight: { xs: 440, md: 560 },
          overflow: 'hidden',
          bgcolor: 'rgba(255, 255, 255, 0.78)',
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(240, 192, 96, 0.18), transparent 55%), radial-gradient(circle at 80% 10%, rgba(155, 29, 63, 0.12), transparent 55%), linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255, 250, 245, 0.9))',
          boxShadow: '0 32px 70px rgba(15, 23, 42, 0.12)',
          p: 0,
          userSelect: 'none'
        }}
        onWheel={handleWheel}
      >
        <Box
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          sx={{
            position: 'absolute',
            inset: 0,
            touchAction: 'none',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
          >
            <ConnectorLayer lines={connectors} />
            {positionedMembers.map((member) => (
              <MemoizedFamilyNode
                key={member.id}
                member={member}
                selected={member.id === selectedMemberId}
                onSelect={onSelectMember}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}

export default memo(FamilyTreeCanvas);
