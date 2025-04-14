import React, { useEffect, useRef } from 'react';

const MicroGraphCircle = () => {
  const canvasRef = useRef(null);
  const points = [];
  const numPoints = 15;
  const speed = 0.05;
  const maxDistance = 70; // Max distance between points to draw a line

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 200;

    // Resize handler
    const resize = () => {
      canvas.width = 200;
      canvas.height = 200;
    };
    window.addEventListener('resize', resize);

    // Create points
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw lines between points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(25,118,210,${1 - dist / maxDistance})`;
            ctx.lineWidth = 1;
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw points
      for (const p of points) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(25,118,210,0.6)';
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        // Bounce the points off the edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '2px solid #1976D2', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: '50%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default MicroGraphCircle;
