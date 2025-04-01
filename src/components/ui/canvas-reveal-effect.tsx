"use client";

import React, { useEffect, useRef } from "react";

export const CanvasRevealEffect = ({
  colors = [[255, 255, 255]],
  dotSize = 2,
  animationSpeed = 10,
  containerClassName = "",
}: {
  colors?: number[][];
  dotSize?: number;
  animationSpeed?: number;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const dots: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: number[];
      size: number;
    }> = [];

    const createDots = () => {
      const dotsCount = Math.floor((rect.width * rect.height) / 1000);
      for (let i = 0; i < dotsCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        dots.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * animationSpeed * 0.1,
          vy: (Math.random() - 0.5) * animationSpeed * 0.1,
          color,
          size: dotSize,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot) => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < 0 || dot.x > rect.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > rect.height) dot.vy *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot.color[0]}, ${dot.color[1]}, ${dot.color[2]}, 0.8)`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    createDots();
    animate();

    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      canvas.width = newRect.width;
      canvas.height = newRect.height;
      dots.length = 0;
      createDots();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [colors, dotSize, animationSpeed]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
