import type { Transition, Variants } from "framer-motion";

const expressiveEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const exitEase: [number, number, number, number] = [0.4, 0, 1, 1];

export const routeExitDelayMs = 180;

export const routePageVariants: Variants = {
  initial: { opacity: 0, y: 28, scale: 0.99 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      ease: expressiveEase,
    } satisfies Transition,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.99,
    transition: {
      duration: 0.24,
      ease: exitEase,
    } satisfies Transition,
  },
};

export const stateSwapVariants: Variants = {
  initial: { opacity: 0, y: 14, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: expressiveEase,
    } satisfies Transition,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.2,
      ease: exitEase,
    } satisfies Transition,
  },
};

export const listContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    } satisfies Transition,
  },
};

export const listItemVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: expressiveEase,
    } satisfies Transition,
  },
};
