"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type MenuSection } from "@/lib/menu-content";
import { site } from "@/lib/site";
import { useLiveMenuSections } from "@/lib/use-live-menu-sections";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const ALL_FILTERS = [
  "All", "Burgers", "Drinks", "Comfort", "Snacks", "Add-on", "Popular", "Top Picks", "Bowl",
] as const;
type Filter = (typeof ALL_FILTERS)[number];

function toSectionId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function itemMatchesFilter(tags: string[], filter: Filter) {
  if (filter === "All") return true;
  return tags.includes(filter);
}

export function MenuPageClient() {
  const menuSections = useLiveMenuSections();
  const reduce = useReducedMotion();
  const totalItems = menuSections.reduce((n, s) => n + s.items.length, 0);

  const availableFilters = useMemo<Filter[]>(() => {
    const found = new Set<Filter>();
    menuSections.forEach((s) =>
      s.items.forEach((i) =>
        i.tags.forEach((t) => {
          if (ALL_FILTERS.includes(t as Filter)) found.add(t as Filter);
        }),
      ),
    );
    return ["All", ...Array.from(found)];
  }, [menuSections]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [activeSection, setActiveSection] = useState("");

  const filteredMenu = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return menuSections
      .map((s) => ({
        ...s,
        items: s.items.filter((item) => {
          const matchF = itemMatchesFilter(item.tags, activeFilter);
          const matchQ =
            !q ||
            `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(q);
          return matchF && matchQ;
        }),
      }))
      .filter((s) => s.items.length > 0);
  }, [activeFilter, menuSections, searchQuery]);

  const hasQueryOrFilter = searchQuery.trim().length > 0 || activeFilter !== "All";
  const matchCount = filteredMenu.reduce((n, s) => n + s.items.length, 0);

  function clearAll() {
    setSearchQuery("");
    setActiveFilter("All");
  }

  useEffect(() => {
    if (hasQueryOrFilter) {
      setActiveSection("");
      return;
    }
    const els = document.querySelectorAll<HTMLElement>(".menu-section[id]");
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
  }, [filteredMenu, hasQueryOrFilter]);

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
            Alphonso mango drinks, desi burgers, and Indo-Nepali comfort food —
            {" "}
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

        <div className="section-shell menu-filters">
          {availableFilters.map((f) => (
            <button
              key={f}
              type="button"
              className={`menu-chip${activeFilter === f ? " is-active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
          {hasQueryOrFilter && (
            <button type="button" className="menu-chip-clear" onClick={clearAll}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Sections ──────────────────────────────────────────────────── */}
      <div id="menu-grid" className="menu-body">
        {hasQueryOrFilter && (
          <p className="section-shell menu-result">
            {matchCount === 0
              ? "No dishes match"
              : `${matchCount} dish${matchCount !== 1 ? "es" : ""}`}
            {activeFilter !== "All" && ` in ${activeFilter}`}
            {searchQuery.trim() && ` for “${searchQuery.trim()}”`}
          </p>
        )}

        {filteredMenu.length === 0 ? (
          <div className="menu-empty">
            <h3>Nothing matches that</h3>
            <p>Try a different keyword or clear the filters to see everything.</p>
            <button type="button" className="button button-primary" onClick={clearAll}>
              Reset menu
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((section) => (
              <motion.section
                key={section.name}
                layout
                className="menu-section"
                id={toSectionId(section.name)}
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
            ))}
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
