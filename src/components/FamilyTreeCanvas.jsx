import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Fade, Tooltip, Typography } from '@mui/material';

function buildTreeLayout(members) {
  if (!members.length) {
    return {
      nodes: [],
      metrics: {
        generationCount: 0,
        maxGenerationSize: 0,
        horizontalMargin: 10,
        verticalMargin: 12
      }
    };
  }

  const generationGroups = new Map();

  members.forEach((member) => {
    const generation = member.generation ?? 0;
    if (!generationGroups.has(generation)) {
      generationGroups.set(generation, []);
    }
    generationGroups.get(generation).push(member);
  });

  const generationOrder = Array.from(generationGroups.keys()).sort((a, b) => a - b);
  const generationIndexMap = new Map(generationOrder.map((generation, index) => [generation, index]));
  const maxGenerationSize = Math.max(
    ...generationOrder.map((generation) => generationGroups.get(generation)?.length ?? 0),
    0
  );

  const verticalMargin = 12; // percentage
  const horizontalMargin = 10; // percentage
  const verticalRange = 100 - verticalMargin * 2;
  const horizontalRange = 100 - horizontalMargin * 2;

  const baseRowSlots = maxGenerationSize + 1;
  const columnDenominator = generationOrder.length > 1 ? generationOrder.length - 1 : 1;

  const nodes = members.map((member) => {
    const generation = member.generation ?? 0;
    const group = generationGroups.get(generation) ?? [];
    const columnIndex = group.findIndex((item) => item.id === member.id);
    const safeColumnIndex = columnIndex >= 0 ? columnIndex : 0;
    const columnCount = group.length || 1;
    const rowIndex = generationIndexMap.get(generation) ?? 0;

    const offset = (maxGenerationSize - columnCount) / 2;
    const normalizedRow = baseRowSlots > 0 ? (offset + safeColumnIndex + 0.5) / baseRowSlots : 0.5;
    const normalizedColumn = generationOrder.length > 1 ? rowIndex / columnDenominator : 0.5;

    const x = horizontalMargin + normalizedColumn * horizontalRange;
    const y = verticalMargin + normalizedRow * verticalRange;

    return {
      ...member,
      x,
      y,
      generation,
      orderInGeneration: safeColumnIndex,
      generationIndex: rowIndex
    };
  });

  return {
    nodes,
    metrics: {
      generationCount: generationOrder.length,
      maxGenerationSize,
      horizontalMargin,
      verticalMargin
    }
  };
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
  const [firstName, ...rest] = member.name.split(' ');
  const remainingName = rest.join(' ');

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
          transform: `translate(-50%, -50%) scale(${selected ? 1.08 : 1})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: { xs: 92, md: 108 },
          cursor: 'pointer',
          outline: 'none',
          transition: 'transform 0.25s ease, opacity 0.3s ease',
          zIndex: selected ? 2 : 1
        }}
      >
        <Box
          sx={{
            width: '100%',
            borderRadius: 2,
            px: 1.25,
            py: 1,
            bgcolor: selected ? 'rgba(255, 226, 226, 0.95)' : 'rgba(246, 246, 246, 0.9)',
            boxShadow: selected
              ? '0 12px 28px rgba(170, 170, 170, 0.3)'
              : '0 6px 18px rgba(170, 170, 170, 0.22)',
            border: (theme) =>
              `1px solid ${selected ? theme.palette.primary.main : 'rgba(170, 170, 170, 0.35)'}`,
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {firstName}
          </Typography>
          {remainingName ? (
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {remainingName}
            </Typography>
          ) : null}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
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
          <stop offset="0%" stopColor="rgba(255, 199, 199, 0.6)" />
          <stop offset="100%" stopColor="rgba(170, 170, 170, 0.35)" />
        </linearGradient>
      </defs>
      {lines.map((line) => (
        <path
          key={line.key}
          d={line.path}
          stroke="url(#family-connector)"
          strokeWidth={line.emphasis ? 4 : 2.6}
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
      const midpointX = (startX + endX) / 2;

      return {
        key: `${edge.from}-${edge.to}`,
        path: `M ${startX} ${startY} C ${midpointX} ${startY}, ${midpointX} ${endY}, ${endX} ${endY}`,
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

  const { nodes: positionedMembers, metrics: layoutMetrics } = useMemo(
    () => buildTreeLayout(members),
    [members]
  );
  const positionedBounds = useMemo(() => {
    if (!positionedMembers.length) {
      return null;
    }

    const xs = positionedMembers.map((member) => member.x);
    const ys = positionedMembers.map((member) => member.y);

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }, [positionedMembers]);
  const connectors = useMemo(() => computeConnectorPaths(positionedMembers), [positionedMembers]);

  const applyViewConstraints = useCallback(
    (nextView) => {
      if (!positionedBounds || !containerSize.width || !containerSize.height) {
        return nextView;
      }

      const paddingX = Math.min(64, containerSize.width * 0.08);
      const paddingY = Math.min(64, containerSize.height * 0.08);

      const minX = (positionedBounds.minX / 100) * containerSize.width;
      const maxX = (positionedBounds.maxX / 100) * containerSize.width;
      const minY = (positionedBounds.minY / 100) * containerSize.height;
      const maxY = (positionedBounds.maxY / 100) * containerSize.height;

      const allowedMinX = paddingX - minX * nextView.scale;
      const allowedMaxX = containerSize.width - paddingX - maxX * nextView.scale;
      const allowedMinY = paddingY - minY * nextView.scale;
      const allowedMaxY = containerSize.height - paddingY - maxY * nextView.scale;

      const clampAxis = (value, min, max) => {
        if (min <= max) {
          return Math.min(Math.max(value, min), max);
        }
        return (min + max) / 2;
      };

      return {
        scale: nextView.scale,
        x: clampAxis(nextView.x, allowedMinX, allowedMaxX),
        y: clampAxis(nextView.y, allowedMinY, allowedMaxY)
      };
    },
    [containerSize.height, containerSize.width, positionedBounds]
  );

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

  const clampScale = useCallback((value) => Math.min(Math.max(value, 0.75), 1.75), []);
  const hasAutoCentered = useRef(false);

  useEffect(() => {
    hasAutoCentered.current = false;
  }, [members]);

  useEffect(() => {
    hasAutoCentered.current = false;
  }, [containerSize.height, containerSize.width]);

  useEffect(() => {
    if (!positionedMembers.length || !containerSize.width || !containerSize.height) {
      return;
    }

    if (hasAutoCentered.current) {
      return;
    }

    if (!positionedBounds) {
      return;
    }

    const { minX, maxX, minY, maxY } = positionedBounds;

    const widthPercent = Math.max(
      maxX - minX,
      Math.max(36, (100 - layoutMetrics.horizontalMargin * 2) * 0.85)
    );
    const heightPercent = Math.max(
      maxY - minY,
      Math.max(36, (100 - layoutMetrics.verticalMargin * 2) * 0.85)
    );

    const widthPx = (widthPercent / 100) * containerSize.width;
    const heightPx = (heightPercent / 100) * containerSize.height;

    const fittedScale = clampScale(
      Math.min(
        containerSize.width / (widthPx || 1),
        containerSize.height / (heightPx || 1)
      ) * 0.9
    );

    const centerX = ((minX + maxX) / 2 / 100) * containerSize.width;
    const centerY = ((minY + maxY) / 2 / 100) * containerSize.height;

    const nextView = {
      scale: fittedScale,
      x: containerSize.width / 2 - centerX * fittedScale,
      y: containerSize.height / 2 - centerY * fittedScale
    };

    setView(applyViewConstraints(nextView));

    hasAutoCentered.current = true;
  }, [
    applyViewConstraints,
    clampScale,
    containerSize.height,
    containerSize.width,
    layoutMetrics.horizontalMargin,
    layoutMetrics.verticalMargin,
    positionedBounds,
    positionedMembers
  ]);

  useEffect(() => {
    return () => {
      dragState.current.active = false;
    };
  }, []);

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

    setView((prev) =>
      applyViewConstraints({
        ...prev,
        x: dragState.current.originX + deltaX,
        y: dragState.current.originY + deltaY
      })
    );
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
    if (event.ctrlKey || event.metaKey) {
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
        return applyViewConstraints({ scale: nextScale, x: nextX, y: nextY });
      });
      return;
    }

    event.preventDefault();
    setView((prev) =>
      applyViewConstraints({
        ...prev,
        x: prev.x - event.deltaX * 0.5,
        y: prev.y - event.deltaY * 0.6
      })
    );
  };

  return (
    <Fade in={isMounted} timeout={600}>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          borderRadius: { xs: 3, md: 4 },
          minHeight: { xs: 380, md: 480 },
          maxHeight: { xs: 560, md: 680 },
          overflow: 'hidden',
          bgcolor: 'rgba(255, 226, 226, 0.92)',
          backgroundImage:
            'radial-gradient(circle at 18% 18%, rgba(255, 199, 199, 0.3), transparent 55%), radial-gradient(circle at 82% 12%, rgba(170, 170, 170, 0.25), transparent 60%), linear-gradient(135deg, rgba(246, 246, 246, 0.8), rgba(255, 226, 226, 0.95))',
          boxShadow: '0 18px 40px rgba(170, 170, 170, 0.26)',
          p: { xs: 1.6, md: 2.1 },
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
