"use client";

import Link from "next/link";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;
const EASE_DRAMATIC = [0.19, 1, 0.22, 1] as const;

export function MotionGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className,
  variant = "rise",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "rise" | "headline" | "visual" | "softScale";
}) {
  const reduce = useReducedMotion();
  const variants = {
    rise: {
      hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.64, ease: EASE_OUT_EXPO } },
    },
    headline: {
      hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 44, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: reduce ? 0 : 0.92, ease: EASE_DRAMATIC },
      },
    },
    visual: {
      hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 28, scale: 0.94, rotate: -1.5 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        rotate: 0,
        transition: { duration: reduce ? 0 : 0.9, ease: EASE_OUT_EXPO },
      },
    },
    softScale: {
      hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: reduce ? 0 : 0.62, ease: EASE_OUT_EXPO },
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants[variant]}
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0 : 0.62, ease: EASE_OUT_EXPO } },
      }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.018, transition: { duration: 0.24, ease: EASE_SPRING } }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
    >
      {children}
    </motion.article>
  );
}

export function MotionLink({
  href,
  className,
  children,
  target,
  rel,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}) {
  const reduce = useReducedMotion();
  const motionProps: HTMLMotionProps<"span"> = {
    className: "motion-action",
    whileHover: reduce ? undefined : { y: -2, scale: 1.025 },
    whileTap: reduce ? undefined : { scale: 0.98 },
    transition: { duration: 0.22, ease: EASE_SPRING },
  };

  if (href.startsWith("/")) {
    return (
      <motion.span {...motionProps}>
        <Link className={className} href={href}>
          {children}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.span {...motionProps}>
      <a className={className} href={href} target={target} rel={rel}>
        {children}
      </a>
    </motion.span>
  );
}

export function MotionHeader({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.58, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
