import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  type MotionValue,
} from "framer-motion";

/** Full-viewport demo (original design): cursor reveal + infinite scroll grid + CTAs */
export const Component = () => {
  const [count, setCount] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5;
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background"
      )}
    >
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-[-20%] top-[-20%] h-[40%] w-[40%] rounded-full bg-orange-500/40 blur-[120px] dark:bg-orange-600/20" />
        <div className="absolute right-[10%] top-[-10%] h-[20%] w-[20%] rounded-full bg-primary/30 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/40 blur-[120px] dark:bg-blue-600/20" />
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex max-w-3xl flex-col items-center space-y-6 px-4 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm md:text-6xl">
            The Infinite Grid
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Move your cursor to reveal the active grid layer. <br />
            The pattern scrolls infinitely in the background.
          </p>
        </div>

        <div className="pointer-events-auto flex gap-4">
          <button
            type="button"
            onClick={() => setCount(count + 1)}
            className="rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95"
          >
            Interact ({count})
          </button>
          <button
            type="button"
            className="rounded-md bg-secondary px-8 py-3 font-semibold text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

type GridPatternProps = {
  offsetX: MotionValue<number>;
  offsetY: MotionValue<number>;
};

const GridPattern = ({ offsetX, offsetY }: GridPatternProps) => {
  return (
    <svg className="h-full w-full" aria-hidden>
      <defs>
        <motion.pattern
          id="grid-pattern-demo"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern-demo)" />
    </svg>
  );
};

/** Site backdrop: fixed under content, global mouse tracking, softer opacity */
export function InfiniteGridBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.35;
  const speedY = 0.35;

  useAnimationFrame(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const maskImage = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background/80 dark:bg-background/90"
      )}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-[0.04]">
        <GridPatternBackdrop id="grid-pattern-back-a" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.22]" style={{ maskImage, WebkitMaskImage: maskImage }}>
        <GridPatternBackdrop id="grid-pattern-back-b" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>
      <div className="absolute inset-0">
        <div className="absolute right-[-15%] top-[-15%] h-[38%] w-[38%] rounded-full bg-accent/25 blur-[110px] dark:bg-accent/20" />
        <div className="absolute right-[8%] top-[-8%] h-[18%] w-[18%] rounded-full bg-primary/20 blur-[90px]" />
        <div className="absolute bottom-[-18%] left-[-8%] h-[36%] w-[36%] rounded-full bg-accent-gold/15 blur-[110px]" />
      </div>
    </div>
  );
};

function GridPatternBackdrop({
  id,
  offsetX,
  offsetY,
}: GridPatternProps & { id: string }) {
  return (
    <svg className="h-full w-full">
      <defs>
        <motion.pattern
          id={id}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
