'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/design/hooks';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  shape: 'square' | 'circle' | 'triangle' | 'rect';
}

const COLORS = [
  'oklch(0.6 0.25 280)',
  'oklch(0.55 0.2 160)',
  'oklch(0.6 0.22 320)',
  'oklch(0.75 0.18 85)',
  'oklch(0.65 0.2 145)',
  'oklch(0.6 0.2 20)',
];

const SHAPES: ConfettiPiece['shape'][] = ['square', 'circle', 'triangle', 'rect'];

function getRandomColor(): string {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return (color ?? COLORS[0]) as string;
}

function getRandomShape(): ConfettiPiece['shape'] {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return (shape ?? 'square') as ConfettiPiece['shape'];
}

export function ConfettiCanvas({ 
  active = true, 
  count = 100, 
  duration = 3000,
  origin = { x: 0.5, y: 0.5 },
  className,
}: { 
  active?: boolean; 
  count?: number; 
  duration?: number;
  origin?: { x: number; y: number };
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ConfettiPiece[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const reducedMotion = useReducedMotion();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = dimensions;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: origin.x * width,
      y: origin.y * height,
      vx: (Math.random() - 0.5) * 20,
      vy: -Math.random() * 15 - 5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 8 + 4,
      color: getRandomColor(),
      shape: getRandomShape(),
    }));
    startTimeRef.current = performance.now();
  }, [dimensions, count, origin]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        setDimensions({ width, height });
        if (active) initParticles();
      }
    });

    resizeObserver.observe(canvas.parentElement!);
    return () => resizeObserver.disconnect();
  }, [active, initParticles]);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: ConfettiPiece) => {
    ctx.save();
    ctx.translate(particle.x * window.devicePixelRatio, particle.y * window.devicePixelRatio);
    ctx.rotate(particle.rotation);
    ctx.fillStyle = particle.color;
    
    const size = particle.size * window.devicePixelRatio;
    
    switch (particle.shape) {
      case 'square':
        ctx.fillRect(-size / 2, -size / 2, size, size);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'rect':
        ctx.fillRect(-size / 2, -size / 4, size, size / 2);
        break;
    }
    ctx.restore();
  }, []);

  const animate = useCallback(() => {
    if (reducedMotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const elapsed = performance.now() - (startTimeRef.current || performance.now());
    if (elapsed > duration) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const gravity = 0.3;
    
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.vx * window.devicePixelRatio;
      particle.y += particle.vy * window.devicePixelRatio;
      particle.vy += gravity;
      particle.rotation += particle.rotationSpeed;
      
      drawParticle(ctx, particle);
      
      return particle.y < canvas.height + 50 && particle.x > -50 && particle.x < canvas.width + 50;
    });
    
    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [drawParticle, duration, reducedMotion]);

  useEffect(() => {
    if (!active || reducedMotion) return;
    initParticles();
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [active, animate, initParticles, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 z-[100] pointer-events-none', className)}
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export function ConfettiBurst({ 
  trigger, 
  count = 50, 
  className,
}: { 
  trigger: boolean; 
  count?: number; 
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (trigger && !reducedMotion) {
      setActive(true);
      setTimeout(() => setActive(false), 3000);
    }
  }, [trigger, reducedMotion]);

  if (!active) return null;

  return <ConfettiCanvas count={count} className={className} />;
}

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  delay?: number;
  className?: string;
}

export function ScoreRing({ 
  score, 
  size = 120, 
  strokeWidth = 8, 
  animated = true, 
  delay = 0,
  className,
}: ScoreRingProps) {
  const reducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'oklch(0.65 0.2 145)';
    if (score >= 60) return 'oklch(0.75 0.18 85)';
    return 'oklch(0.6 0.2 20)';
  };

  const color = getScoreColor(score);

  if (reducedMotion || !animated) {
    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.25 0 0 / 0.5)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: 'drop-shadow(0 0 8px ' + color + ')' }}
          />
        </svg>
        <span className="absolute text-3xl font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.25 0 0 / 0.5)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay, ease: 'easeOut', type: 'spring', damping: 15, stiffness: 100 }}
          style={{ filter: 'drop-shadow(0 0 8px ' + color + ')' }}
        />
      </svg>
      <motion.span
        className="absolute text-3xl font-bold"
        style={{ color }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.5, ease: 'easeOut' }}
      >
        {score}
      </motion.span>
    </div>
  );
}

interface CelebrationProps {
  score: number;
  onComplete?: () => void;
  className?: string;
}

export function Celebration({ score, onComplete, className }: CelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (score >= 80 && !reducedMotion) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    onComplete?.();
  }, [score, reducedMotion, onComplete]);

  return (
    <div className={cn('relative', className)}>
      <ScoreRing score={score} size={150} animated />
      <AnimatePresence>
        {showConfetti && (
          <ConfettiCanvas count={80} duration={3000} origin={{ x: 0.5, y: 0.3 }} />
        )}
      </AnimatePresence>
    </div>
  );
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export function FloatingParticles({ count = 20, colors = COLORS, className }: FloatingParticlesProps) {
  const reducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  useEffect(() => {
    if (reducedMotion) return;
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        color: (colors[Math.floor(Math.random() * colors.length)] ?? colors[0]) as string,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 4,
      }))
    );
  }, [count, colors, reducedMotion]);

  if (reducedMotion || particles.length === 0) return null;

  return (
    <div className={cn('fixed inset-0 z-0 pointer-events-none overflow-hidden', className)}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0.3,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 0], 
            opacity: [0, 0.3, 0],
            y: [0, -50, -100],
            x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}