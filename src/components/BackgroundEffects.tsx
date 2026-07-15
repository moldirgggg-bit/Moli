import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  type: 'sparkle' | 'petal' | 'flower' | 'butterfly' | 'heart' | 'balloon';
  color: string;
  opacity: number;
  angle: number;
  spinSpeed: number;
  scale?: number;
  flutter?: number;
  flutterSpeed?: number;
  balloonString?: number;
}

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];

    // Helper to generate a particle
    const createParticle = (initY = false): Particle => {
      const types: Particle['type'][] = ['sparkle', 'petal', 'flower', 'butterfly', 'heart', 'balloon'];
      // Weigh sparkles and petals higher for better visuals
      const rand = Math.random();
      let type: Particle['type'] = 'sparkle';
      
      if (rand < 0.35) type = 'sparkle';
      else if (rand < 0.60) type = 'petal';
      else if (rand < 0.75) type = 'flower';
      else if (rand < 0.85) type = 'butterfly';
      else if (rand < 0.93) type = 'heart';
      else type = 'balloon';

      const size =
        type === 'sparkle'
          ? Math.random() * 2 + 1
          : type === 'petal' || type === 'flower'
          ? Math.random() * 8 + 6
          : type === 'butterfly'
          ? Math.random() * 10 + 8
          : type === 'heart'
          ? Math.random() * 8 + 5
          : Math.random() * 15 + 12; // Balloon

      const x = Math.random() * width;
      // Start some particles already on screen, others at top/bottom boundaries
      const y = initY ? Math.random() * height : type === 'balloon' || type === 'heart' ? height + 20 : -20;

      // Speeds
      let speedX = (Math.random() - 0.5) * 0.5;
      let speedY = 0;

      if (type === 'sparkle') {
        speedY = Math.random() * 0.5 + 0.2;
      } else if (type === 'petal' || type === 'flower') {
        speedY = Math.random() * 0.8 + 0.4;
        speedX = (Math.random() - 0.3) * 0.8;
      } else if (type === 'butterfly') {
        speedY = Math.random() * 0.4 + 0.2;
        speedX = (Math.random() - 0.5) * 1.2;
      } else if (type === 'heart' || type === 'balloon') {
        speedY = -(Math.random() * 0.6 + 0.3); // Moves upwards
        speedX = (Math.random() - 0.5) * 0.3;
      }

      // Luxury Colors
      let color = '';
      if (type === 'sparkle') {
        color = Math.random() > 0.5 ? 'rgba(212, 175, 55, ' : 'rgba(244, 232, 193, '; // Gold sparkles
      } else if (type === 'petal') {
        // Rose petals: crimson, rose gold, soft pink
        const petalColors = ['rgba(141, 18, 36, ', 'rgba(251, 180, 188, ', 'rgba(197, 137, 145, '];
        color = petalColors[Math.floor(Math.random() * petalColors.length)];
      } else if (type === 'flower') {
        color = 'rgba(255, 255, 255, '; // Soft white petals
      } else if (type === 'butterfly') {
        color = Math.random() > 0.6 ? 'rgba(255, 255, 255, ' : 'rgba(212, 175, 55, '; // White or Gold butterflies
      } else if (type === 'heart') {
        color = Math.random() > 0.5 ? 'rgba(212, 175, 55, ' : 'rgba(224, 169, 175, '; // Gold or dusty rose hearts
      } else {
        // Balloon
        color = Math.random() > 0.5 ? 'rgba(255, 255, 255, ' : 'rgba(212, 175, 55, '; // White or gold balloons
      }

      return {
        x,
        y,
        size,
        speedX,
        speedY,
        type,
        color,
        opacity: Math.random() * 0.6 + 0.2,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.02,
        flutter: Math.random() * Math.PI,
        flutterSpeed: Math.random() * 0.1 + 0.05,
      };
    };

    // Initialize particles on screen
    for (let i = 0; i < 75; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Drawing helpers
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.moveTo(x, y + size / 4);
      c.quadraticCurveTo(x, y, x + size / 2, y);
      c.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      c.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      c.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      c.quadraticCurveTo(x, y, x + size / 2, y);
      c.closePath();
      c.fill();
    };

    const drawButterfly = (c: CanvasRenderingContext2D, x: number, y: number, size: number, flutter: number) => {
      const wingWidth = size * Math.abs(Math.sin(flutter));
      c.beginPath();
      // Left wings
      c.ellipse(x - wingWidth / 2, y - size / 4, wingWidth / 2, size / 3, Math.PI / 6, 0, Math.PI * 2);
      c.ellipse(x - wingWidth / 2, y + size / 4, wingWidth / 3, size / 4, -Math.PI / 6, 0, Math.PI * 2);
      // Right wings
      c.ellipse(x + wingWidth / 2, y - size / 4, wingWidth / 2, size / 3, -Math.PI / 6, 0, Math.PI * 2);
      c.ellipse(x + wingWidth / 2, y + size / 4, wingWidth / 3, size / 4, Math.PI / 6, 0, Math.PI * 2);
      c.closePath();
      c.fill();

      // Body
      c.fillStyle = 'rgba(10, 10, 10, 0.4)';
      c.beginPath();
      c.ellipse(x, y, 1, size / 2, 0, 0, Math.PI * 2);
      c.fill();
    };

    const drawBalloon = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      // Balloon shape
      c.beginPath();
      c.ellipse(x, y, size * 0.7, size, 0, 0, Math.PI * 2);
      c.fill();

      // Small basket/knot at bottom
      c.beginPath();
      c.moveTo(x - 2, y + size);
      c.lineTo(x + 2, y + size);
      c.lineTo(x, y + size + 3);
      c.closePath();
      c.fill();

      // String
      c.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      c.lineWidth = 0.5;
      c.beginPath();
      c.moveTo(x, y + size + 3);
      c.bezierCurveTo(x - 4, y + size + 15, x + 4, y + size + 25, x, y + size + 40);
      c.stroke();
    };

    // Render loop
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        // Update positions
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.spinSpeed;
        if (p.flutter !== undefined && p.flutterSpeed !== undefined) {
          p.flutter += p.flutterSpeed;
        }

        // Off-screen check -> replace
        const isOffscreen =
          p.y < -30 || p.y > height + 50 || p.x < -30 || p.x > width + 30;

        if (isOffscreen) {
          particles[index] = createParticle();
          return;
        }

        // Draw based on type
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.strokeStyle = `${p.color}${p.opacity * 0.5})`;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        if (p.type === 'sparkle') {
          // Drawing sparkling stars/diamonds
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(p.size * 0.4, -p.size * 0.4);
          ctx.lineTo(p.size * 1.5, 0);
          ctx.lineTo(p.size * 0.4, p.size * 0.4);
          ctx.lineTo(0, p.size * 1.5);
          ctx.lineTo(-p.size * 0.4, p.size * 0.4);
          ctx.lineTo(-p.size * 1.5, 0);
          ctx.lineTo(-p.size * 0.4, -p.size * 0.4);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'petal') {
          // Rose petal
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'flower') {
          // White blossom petal
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.8, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'butterfly') {
          drawButterfly(ctx, 0, 0, p.size, p.flutter || 0);
        } else if (p.type === 'heart') {
          drawHeart(ctx, -p.size / 2, -p.size / 2, p.size);
        } else if (p.type === 'balloon') {
          drawBalloon(ctx, 0, 0, p.size);
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particles-canvas"
      className="fixed inset-0 pointer-events-none z-5"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
