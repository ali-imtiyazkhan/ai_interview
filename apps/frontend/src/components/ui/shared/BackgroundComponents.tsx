'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion, useMediaQuery } from '@/design/hooks';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
  type: 'node' | 'connection' | 'sparkle';
}

interface ParticleSystemProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  mouseInfluence?: number;
  colors?: string[];
  showConnections?: boolean;
  showSparkles?: boolean;
}

const DEFAULT_COLORS = ['oklch(0.6 0.25 280 / 0.6)', 'oklch(0.55 0.2 160 / 0.5)', 'oklch(0.6 0.22 320 / 0.5)'];
const PARTICLE_TYPES: Particle['type'][] = ['node', 'connection', 'sparkle'];

function getRandomColor(colors: string[]): string {
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (color ?? colors[0]) as string;
}

function getRandomType(): Particle['type'] {
  const type = PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)];
  return (type ?? 'node') as Particle['type'];
}

export function ParticleSystem({
  className,
  particleCount = 60,
  connectionDistance = 150,
  mouseInfluence = 100,
  colors = DEFAULT_COLORS,
  showConnections = true,
  showSparkles = true,
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = dimensions;
    const count = isMobile ? particleCount / 2 : particleCount;
    
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      color: getRandomColor(colors),
      type: getRandomType(),
    }));
  }, [dimensions, particleCount, colors, isMobile]);

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
        initParticles();
      }
    });

    resizeObserver.observe(canvas.parentElement!);
    return () => resizeObserver.disconnect();
  }, [initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * window.devicePixelRatio,
        y: (e.clientY - rect.top) * window.devicePixelRatio,
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showConnections) return;
    const particles = particlesRef.current;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        if (!p1 || !p2) continue;
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `oklch(0.6 0.25 280 / ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }, [showConnections, connectionDistance]);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;
    
    for (const particle of particles) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius * window.devicePixelRatio, 0, Math.PI * 2);
      
      if (particle.type === 'sparkle') {
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3 * window.devicePixelRatio
        );
        gradient.addColorStop(0, particle.color.replace('/ 0.5', '/ 1').replace('/ 0.6', '/ 1'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      } else {
        ctx.fillStyle = particle.color.replace('/ 0.5', `/ ${particle.opacity}`).replace('/ 0.6', `/ ${particle.opacity}`);
        ctx.fill();
      }
    }
  }, []);

  const updateParticles = useCallback(() => {
    if (reducedMotion) return;
    
    const particles = particlesRef.current;
    const { width, height } = dimensions;
    
    for (const particle of particles) {
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseInfluence && distance > 0) {
        const force = (1 - distance / mouseInfluence) * 0.5;
        particle.vx += (dx / distance) * force * 0.02;
        particle.vy += (dy / distance) * force * 0.02;
      }
      
      particle.x += particle.vx * window.devicePixelRatio;
      particle.y += particle.vy * window.devicePixelRatio;
      
      particle.vx *= 0.995;
      particle.vy *= 0.995;
      
      if (particle.x < 0) { particle.x = width; particle.vx *= -1; }
      if (particle.x > width) { particle.x = 0; particle.vx *= -1; }
      if (particle.y < 0) { particle.y = height; particle.vy *= -1; }
      if (particle.y > height) { particle.y = 0; particle.vy *= -1; }
      
      if (particle.type === 'sparkle') {
        particle.opacity = 0.3 + Math.sin(Date.now() * 0.005 + particle.x) * 0.3;
      }
    }
  }, [dimensions, mouseInfluence, reducedMotion]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawConnections(ctx);
    drawParticles(ctx);
    updateParticles();
    
    animationRef.current = requestAnimationFrame(animate);
  }, [drawConnections, drawParticles, updateParticles]);

  useEffect(() => {
    if (reducedMotion) return;
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 z-0 pointer-events-none', className)}
      aria-hidden="true"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

interface AmbientBackgroundProps {
  variant?: 'video' | 'particles' | 'gradient';
  className?: string;
  videoSrc?: string;
  videoPoster?: string;
  particleConfig?: Partial<ParticleSystemProps>;
}

export function AmbientBackground({ 
  variant = 'particles', 
  className, 
  videoSrc = '/assets/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
  videoPoster = '/assets/ambient-poster.jpg',
  particleConfig = {},
}: AmbientBackgroundProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [useParticles, setUseParticles] = useState(false);

  useEffect(() => {
    if (variant === 'video' && (reducedMotion || isMobile)) {
      setUseParticles(true);
    }
  }, [variant, reducedMotion, isMobile]);

  if (variant === 'particles' || useParticles) {
    return (
      <>
        <ParticleSystem {...particleConfig} />
        <div className="fixed inset-0 z-[1] bg-background/40" />
        <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.6_0.25_280/0.1),transparent_70%),radial-gradient(ellipse_50%_40%_at_90%_100%,oklch(0.55_0.2_160/0.06),transparent_70%)]" />
      </>
    );
  }

  if (variant === 'gradient') {
    return (
      <>
        <div className="fixed inset-0 z-0 bg-background" />
        <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.6_0.25_280/0.08),transparent),radial-gradient(ellipse_60%_40%_at_80%_80%,oklch(0.55_0.2_160/0.05),transparent),radial-gradient(ellipse_50%_50%_at_20%_60%,oklch(0.6_0.2_40/0.04),transparent)]" />
      </>
    );
  }

  return (
    <>
      <video
        className="fixed inset-0 z-0 h-full w-full object-cover"
        src={videoSrc}
        poster={videoPoster}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        preload="none"
        onLoadStart={() => setVideoLoaded(true)}
      />
      <div className="fixed inset-0 z-[1] bg-background/40" />
      <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.6_0.25_280/0.1),transparent_70%),radial-gradient(ellipse_50%_40%_at_90%_100%,oklch(0.55_0.2_160/0.06),transparent_70%)]" />
    </>
  );
}