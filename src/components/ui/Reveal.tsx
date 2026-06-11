"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in seconds (use index * 0.05 for card grids) */
  delay?: number;
  /** Slide distance in px */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
};

/** Scroll-triggered fade-up. Respects prefers-reduced-motion. */
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, delay, ease: [0.21, 0.65, 0.36, 1] },
    },
  };

  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      className={className}
    >
      {children}
    </Tag>
  );
}
