"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type MenuSection } from "@/lib/menu-content";
import { site } from "@/lib/site";
import { useLiveMenuSections } from "@/lib/use-live-menu-sections";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const MANGO_BAR = "Mango Bar";

function toSectionId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

type Reduce = boolean | null;

/** The signature Mango Bar — the 3 Alphonso drinks, marketed as a tasting flight. */
function MangoBar({ section, reduce }: { section: MenuSection; reduce: Reduce }) {
  return (
    <motion.section
      layout
      className="mango-bar"
      id={toSectionId(section.name)}
      data-spy
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="section-shell mango-bar-shell">
        <header className="mango-bar-head">
          <p className="mango-bar-eyebrow">✦ The Mango Bar</p>
          <h2 className="mango-bar-title">Three ways to drink an Alphonso.</h2>
          <p className="mango-bar-note">
            The whole menu starts here. {section.note}
          </p>
        </header>

        <div className="mango-bar-flight">
          {section.items.map((item, i) => (
            <motion.article
              key={item.name}
              className="mango-pour"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: reduce ? 0 : i * 0.1, ease: EASE_OUT }}
            >
              <div className="mango-pour-media">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:900px) 50vw, 33vw"
                  quality={86}
                  className="photo-grade"
                />
                <span className="mango-pour-num" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <div className="mango-pour-body">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="mango-pour-price">{item.price}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/** Standard category — a clean refined image grid. */
function GridSection({ section, reduce }: { section: MenuSection; reduce: Reduce }) {
  return (
    <motion.section
      layout
      className="menu-section"
      id={toSectionId(section.name)}
      data-spy
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="section-shell">
        <header className="menu-section-head">
          <h2>{section.name}</h2>
          <p>{section.note}</p>
        </header>

        <div className="menu-grid">
          <AnimatePresence mode="popLayout">
            {section.items.map((item, i) => (
              <motion.article
                key={`${section.name}-${item.name}`}
                layout
                className="menu-card"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.25), ease: EASE_OUT }}
              >
                <div className="menu-card-media">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:980px) 50vw, 33vw"
                    quality={82}
                    className="photo-grade"
                  />
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-head">
                    <h3>{item.name}</h3>
                    <span className="menu-card-price">{item.price}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

export function MenuPageClient() {
  const menuSections = useLiveMenuSections();
  const reduce = useReducedMotion();
  const totalItems = menuSections.reduce((n, s) => n + s.items.length, 0);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");

  const filteredMenu = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return menuSections;
    return menuSections
      .map((s) => ({
        ...s,
        items: s.items.filter((item) =>
          `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(q),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [menuSections, searchQuery]);

  const hasQuery = searchQuery.trim().length > 0;
  const matchCount = filteredMenu.reduce((n, s) => n + s.items.length, 0);

  useEffect(() => {
    if (hasQuery) {
      setActiveSection("");
      return;
    }
    const els = document.querySelectorAll<HTMLElement>("[data-spy]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [filteredMenu, hasQuery]);

  return (
    <main className="menu-page">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <header className="menu-hero">
        <div className="section-shell">
          <motion.p
            className="label"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            Menu
          </motion.p>
          <motion.h1
            className="menu-hero-title text-balance"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 }}
          >
            The full menu
          </motion.h1>
          <motion.p
            className="menu-hero-sub"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.12 }}
          >
            Alphonso mango drinks, desi burgers, and Indo-Nepali comfort food —{" "}
            <span>{menuSections.length} categories, {totalItems} dishes,</span> updated live.
          </motion.p>
        </div>
      </header>

      {/* ── Sticky category + search bar ──────────────────────────────── */}
      <div className="menu-bar">
        <div className="section-shell menu-bar-inner">
          <nav className="menu-cats" aria-label="Jump to category">
            {menuSections.map((s) => {
              const id = toSectionId(s.name);
              return (
                <a
                  key={s.name}
                  href={`#${id}`}
                  className={`menu-cat${activeSection === id ? " is-active" : ""}`}
                >
                  {s.name}
                </a>
              );
            })}
          </nav>

          <label className="menu-search" aria-label="Search menu">
            <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              placeholder="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="menu-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>
        </div>
      </div>

      {/* ── Sections ──────────────────────────────────────────────────── */}
      <div id="menu-grid" className="menu-body">
        {hasQuery && (
          <p className="section-shell menu-result">
            {matchCount === 0
              ? "No dishes match"
              : `${matchCount} dish${matchCount !== 1 ? "es" : ""}`}{" "}
            for “{searchQuery.trim()}”
          </p>
        )}

        {filteredMenu.length === 0 ? (
          <div className="menu-empty">
            <h3>Nothing matches that</h3>
            <p>Try a different keyword or clear the search to see everything.</p>
            <button type="button" className="button button-primary" onClick={() => setSearchQuery("")}>
              Clear search
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((section) =>
              section.name === MANGO_BAR ? (
                <MangoBar key={section.name} section={section} reduce={reduce} />
              ) : (
                <GridSection key={section.name} section={section} reduce={reduce} />
              ),
            )}
          </AnimatePresence>
        )}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="menu-cta">
        <div className="section-shell menu-cta-inner">
          <div>
            <h2>Order ahead, skip the wait.</h2>
            <p>{site.hours} · {site.address}</p>
          </div>
          <a className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
            Order on DoorDash
          </a>
        </div>
      </section>
    </main>
  );
}
