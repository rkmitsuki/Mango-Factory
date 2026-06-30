"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";

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

export function ParallaxLayer({
  children,
  className,
  strength = 60,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(py * -14);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? undefined : { rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setDisplay(value);
      return;
    }

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased * 10) / 10);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function Marquee({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const reduce = useReducedMotion();
  const loop = [...items, ...items];

  return (
    <div className="marquee">
      <motion.div
        className="marquee-track"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={reduce ? undefined : { duration: speed, ease: "linear", repeat: Infinity }}
      >
        {loop.map((item, index) => (
          <span className="marquee-item" key={`${item}-${index}`}>
            {item}
            <span aria-hidden="true">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export type StoryPanel = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

function ScrollStoryPanel({
  panel,
  onActivate,
}: {
  panel: StoryPanel;
  onActivate: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActivate();
  }, [inView, onActivate]);

  return (
    <motion.article
      ref={ref}
      className={`scroll-story-panel${inView ? " is-active" : ""}`}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: reduce ? 0 : 0.6, ease: EASE_OUT_EXPO }}
    >
      <span className="label">{panel.eyebrow}</span>
      <h3>{panel.title}</h3>
      <p>{panel.body}</p>
    </motion.article>
  );
}

export function ScrollStory({ panels }: { panels: StoryPanel[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <div className="scroll-story">
      <div className="scroll-story-media">
        <div className="scroll-story-media-frame">
          {panels.map((panel, index) => (
            <motion.div
              key={panel.id}
              className="scroll-story-media-layer"
              animate={{ opacity: active === index ? 1 : 0, scale: active === index ? 1 : 1.04 }}
              transition={{ duration: reduce ? 0 : 0.7, ease: EASE_OUT_EXPO }}
            >
              <Image
                src={panel.image}
                alt={panel.alt}
                fill
                sizes="(max-width: 980px) 100vw, 46vw"
                quality={85}
                className="photo-grade"
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          ))}
          <div className="scroll-story-index">
            <strong>{String(active + 1).padStart(2, "0")}</strong>
            <span>/ {String(panels.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      <div className="scroll-story-panels">
        {panels.map((panel, index) => (
          <ScrollStoryPanel key={panel.id} panel={panel} onActivate={() => setActive(index)} />
        ))}
      </div>
    </div>
  );
}
