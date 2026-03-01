import { useEffect, useRef, type ReactNode } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export function CyberGridBackground(): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener("resize", resize);

    const gridSize = 60;

    const spawnParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life: 0,
      maxLife: 200 + Math.random() * 300,
      size: 1 + Math.random() * 2,
    });

    for (let i = 0; i < 40; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife;
      particlesRef.current.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(0, 255, 65, 0.04)";
      ctx.lineWidth = 0.5;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const time = Date.now() * 0.001;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const pulse = Math.sin(time + x * 0.01 + y * 0.01) * 0.5 + 0.5;
          if (pulse > 0.92) {
            ctx.fillStyle = `rgba(0, 255, 65, ${pulse * 0.15})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          particles[i] = spawnParticle();
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1;
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
