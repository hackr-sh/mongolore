"use client";

import confetti from "canvas-confetti";

export function useConfetti() {
  const triggerSideCannons = (props?: {
    delay?: number;
    duration?: number;
  }) => {
    const { delay = 0, duration = 1000 } = props ?? {};
    const start = Date.now() + delay;
    const end = Date.now() + delay + duration;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() < start) return;
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return {
    triggerSideCannons,
  };
}
