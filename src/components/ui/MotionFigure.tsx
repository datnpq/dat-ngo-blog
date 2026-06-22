"use client";

import { motion, useReducedMotion } from "motion/react";

interface MotionFigureProps {
  children: React.ReactNode;
  className?: string;
}

/** Reveals a figure/image with a soft blur-in + scale for depth. */
export function MotionFigure({ children, className }: MotionFigureProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduce ? false : { opacity: 0, scale: 0.985, filter: "blur(8px)" }
      }
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
