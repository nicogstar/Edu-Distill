import React, { useEffect, useRef } from 'react';

const DistillationGraphic: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; speed: number; size: number }[] = [];

    // Setup
    const teacherX = 150;
    const teacherY = canvas.height / 2;
    const studentX = canvas.width - 150;
    const studentY = canvas.height / 2;

    const resize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() / 1000;

      // Update Dimensions
      const tx = canvas.width * 0.25;
      const ty = canvas.height * 0.5;
      const sx = canvas.width * 0.75;
      const sy = canvas.height * 0.5;

      // 1. Draw Teacher Node (Massive, Complex)
      ctx.save();
      ctx.translate(tx, ty);
      // Outer Rings
      ctx.strokeStyle = '#06b6d4'; // Cyan
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=0; i<5; i++) {
        ctx.rotate(time * 0.1 * (i%2===0 ? 1 : -1));
        ctx.beginPath();
        ctx.arc(0, 0, 60 + i*15 + Math.sin(time + i)*5, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Core
      ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      // 2. Draw Student Node (Compact, Efficient, Green)
      ctx.save();
      ctx.translate(sx, sy);
      ctx.strokeStyle = '#10b981'; // Emerald
      ctx.lineWidth = 3;
      // Fast spin ring
      ctx.rotate(-time * 2);
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 1.5);
      ctx.stroke();
      // Core
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      // 3. Particles (Distillation Flow)
      // Spawn new particles
      if (Math.random() > 0.8) {
        particles.push({
            x: tx + 60,
            y: ty + (Math.random() - 0.5) * 40,
            speed: 5 + Math.random() * 5,
            size: 2 + Math.random() * 3
        });
      }

      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#fff';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speed;
        
        // Move towards student Y
        const progress = (p.x - tx) / (sx - tx);
        const targetY = sy;
        p.y += (targetY - p.y) * 0.05;

        // Draw Data Packet
        ctx.globalAlpha = 1 - progress; // Fade out as it integrates
        ctx.fillRect(p.x, p.y, p.size * 3, p.size);
        
        // Remove if hit student
        if (p.x >= sx - 20) {
            particles.splice(i, 1);
            // Flash student
            ctx.save();
            ctx.translate(sx, sy);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(0,0, 30, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
      }
      ctx.globalAlpha = 1;

      // 4. Labels
      ctx.font = 'bold 16px Space Grotesk';
      ctx.fillStyle = '#06b6d4';
      ctx.textAlign = 'center';
      ctx.fillText("TEACHER MODEL (Gemini 2.5)", tx, ty + 160);
      
      ctx.fillStyle = '#10b981';
      ctx.fillText("STUDENT MODEL (Distilled)", sx, sy + 100);

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0 pointer-events-none" />;
};

export default DistillationGraphic;