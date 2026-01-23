"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Variants } from "motion/react";

import { cn } from "../../utils";

export interface TransitionProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  show?: boolean;
  variant?: "fade" | "slide" | "scale" | "slideUp" | "slideDown" | "none";
  duration?: number;
  delay?: number;
}

const transitionVariants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  none: {
    hidden: {},
    visible: {},
    exit: {},
  },
};

function Transition({
  show = true,
  variant = "fade",
  duration = 0.3,
  delay = 0,
  className,
  children,
  ...props
}: TransitionProps) {
  const variants = transitionVariants[variant];

  return (
    <motion.div
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      exit="exit"
      variants={variants}
      transition={{ duration, delay, ease: "easeInOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerProps extends Omit<HTMLMotionProps<"div">, "variants" | "children"> {
  staggerDelay?: number;
  variant?: "fade" | "slide" | "scale" | "slideUp" | "slideDown";
  duration?: number;
  children?: React.ReactNode;
}

function Stagger({
  staggerDelay = 0.1,
  variant = "fade",
  duration = 0.3,
  className,
  children,
  ...props
}: StaggerProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(className)}
      {...props}
    >
      {React.Children.toArray(children).map((child, index) => (
        <motion.div
          key={index}
          variants={transitionVariants[variant]}
          transition={{ duration, ease: "easeInOut" }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export interface CollapseProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  open?: boolean;
  duration?: number;
}

function Collapse({ open = false, duration = 0.3, className, children, ...props }: CollapseProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        height: open ? "auto" : 0,
        opacity: open ? 1 : 0,
      }}
      transition={{ duration, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface SlideInProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  from?: "left" | "right" | "top" | "bottom";
  show?: boolean;
  duration?: number;
  distance?: number;
}

function SlideIn({
  from = "left",
  show = true,
  duration = 0.3,
  distance = 100,
  className,
  children,
  ...props
}: SlideInProps) {
  const getInitialPosition = () => {
    switch (from) {
      case "left":
        return { x: -distance };
      case "right":
        return { x: distance };
      case "top":
        return { y: -distance };
      case "bottom":
        return { y: distance };
    }
  };

  return (
    <motion.div
      initial={{ ...getInitialPosition(), opacity: 0 }}
      animate={show ? { x: 0, y: 0, opacity: 1 } : { ...getInitialPosition(), opacity: 0 }}
      transition={{ duration, ease: "easeInOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { Transition, Stagger, Collapse, SlideIn };
