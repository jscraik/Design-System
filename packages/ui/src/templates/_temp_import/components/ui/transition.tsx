import * as React from "react";
import { motion, HTMLMotionProps, Variants } from "motion/react";

import { cn } from "./utils";

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

const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(
  (
    {
      show = true,
      variant = "fade",
      duration = 0.3,
      delay = 0,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variants = transitionVariants[variant];

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        exit="exit"
        variants={variants}
        transition={{
          duration,
          delay,
          ease: "easeInOut",
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Transition.displayName = "Transition";

// Stagger children animation
export interface StaggerProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  staggerDelay?: number;
  variant?: "fade" | "slide" | "scale" | "slideUp" | "slideDown";
  duration?: number;
}

const Stagger = React.forwardRef<HTMLDivElement, StaggerProps>(
  (
    {
      staggerDelay = 0.1,
      variant = "fade",
      duration = 0.3,
      className,
      children,
      ...props
    },
    ref
  ) => {
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
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={cn(className)}
        {...props}
      >
        {React.Children.toArray(children as React.ReactNode).map((child, index) => (
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
);
Stagger.displayName = "Stagger";

// Collapse/Expand animation
export interface CollapseProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  open?: boolean;
  duration?: number;
}

const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  ({ open = false, duration = 0.3, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{
          duration,
          ease: "easeInOut",
        }}
        style={{ overflow: "hidden" }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Collapse.displayName = "Collapse";

// Slide-in from side
export interface SlideInProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  from?: "left" | "right" | "top" | "bottom";
  show?: boolean;
  duration?: number;
  distance?: number;
}

const SlideIn = React.forwardRef<HTMLDivElement, SlideInProps>(
  (
    {
      from = "left",
      show = true,
      duration = 0.3,
      distance = 100,
      className,
      children,
      ...props
    },
    ref
  ) => {
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
        ref={ref}
        initial={{ ...getInitialPosition(), opacity: 0 }}
        animate={
          show
            ? { x: 0, y: 0, opacity: 1 }
            : { ...getInitialPosition(), opacity: 0 }
        }
        transition={{
          duration,
          ease: "easeInOut",
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
SlideIn.displayName = "SlideIn";

export { Transition, Stagger, Collapse, SlideIn };
