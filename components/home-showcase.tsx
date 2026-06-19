"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { customerQuotes, orderPairings, site } from "@/lib/site";

const SLIDE_EASE = [0.16, 1, 0.3, 1] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      <path d="M5 12h13m-5-5 5 5-5 5" />
    </svg>
  );
}

export function PairingCarousel() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % orderPairings.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, [reduce]);

  const pairing = orderPairings[active];

  return (
    <div className="carousel-shell">
      <div className="carousel-copy">
        <p className="label">Order pairings</p>
        <h2 className="display-section text-balance">Most popular combinations.</h2>
        <p>
          Guests often start with a burger or mango drink, then add a side or soup.
        </p>
        <div className="carousel-controls">
          <button type="button" onClick={() => setActive((active + orderPairings.length - 1) % orderPairings.length)}>
            Prev
          </button>
          <button type="button" onClick={() => setActive((active + 1) % orderPairings.length)}>
            Next
          </button>
        </div>
      </div>

      <div className="carousel-stage">
        <AnimatePresence mode="wait">
          <motion.article
            key={pairing.title}
            className="carousel-card"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24, rotate: -1.2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18, rotate: 1.2 }}
            transition={{ duration: reduce ? 0 : 0.78, ease: SLIDE_EASE }}
          >
            <span>{pairing.title}</span>
            <strong>{pairing.items}</strong>
            <p>{pairing.note}</p>
            <div className="carousel-dots" aria-label="Combo carousel">
              {orderPairings.map((item, index) => (
                <button
                  aria-label={`Show ${item.title}`}
                  className={index === active ? "active" : ""}
                  key={item.title}
                  onClick={() => setActive(index)}
                  type="button"
                />
              ))}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function FeedbackCarousel() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % customerQuotes.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [reduce]);

  const quote = customerQuotes[active];

  return (
    <div className="feedback-carousel">
      <div className="feedback-head">
        <p className="label">Guest voices</p>
        <h2 className="display-section text-balance">What guests say.</h2>
        <p>
          Reviews consistently mention these items as the biggest crowd favorites.
        </p>
      </div>

      <div className="feedback-stage">
        <AnimatePresence mode="wait">
          <motion.article
            key={quote.quote}
            className="feedback-card"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.8, ease: SLIDE_EASE }}
          >
            <div className="feedback-quote-mark">&ldquo;</div>
            <p>{quote.quote}</p>
            <div className="feedback-meta">
              <span>{quote.source}</span>
              <div className="feedback-dots">
                {customerQuotes.map((item, index) => (
                  <button
                    aria-label={`Show feedback from ${item.source}`}
                    className={index === active ? "active" : ""}
                    key={item.quote}
                    onClick={() => setActive(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function LocationMap() {
  const reduce = useReducedMotion();

  return (
    <div className="map-shell">
      <motion.div
        className="map-copy"
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: reduce ? 0 : 0.7, ease: SLIDE_EASE }}
      >
        <p className="label">Find us</p>
        <h2 className="display-section text-balance">Downtown San Jose, on Commercial St.</h2>
        <p>
          We're at 326 Commercial St. Order ahead on DoorDash or swing by — kitchen opens at 11 AM daily.
        </p>
        <div className="map-actions">
          <a className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
            Order online <ArrowIcon />
          </a>
          <a className="button button-ghost-dark" href={site.mapsUrl} target="_blank" rel="noreferrer">
            Open in Maps
          </a>
        </div>
        <div className="map-badges">
          <span>11 AM pickup</span>
          <span>Commercial St</span>
          <span>San Jose</span>
        </div>
      </motion.div>

      <motion.div
        className="map-frame"
        initial={reduce ? false : { opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: reduce ? 0 : 0.82, ease: SLIDE_EASE }}
      >
        <iframe
          title="Mango Factory map"
          src="https://www.google.com/maps?q=Mango+Factory+326+Commercial+St+San+Jose+CA&z=16&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="map-overlay">
          <strong>326 Commercial St</strong>
          <span>San Jose, CA</span>
        </div>
      </motion.div>
    </div>
  );
}
