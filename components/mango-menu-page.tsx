"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MotionGroup, MotionItem } from "@/components/motion";
import { type MenuSection, type MenuItem } from "@/lib/menu-content";
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

function sectionTags(items: MenuSection["items"]) {
  return Array.from(new Set(items.flatMap((i) => i.tags)));
}

function isPopular(tags: string[]) {
  return tags.includes("Popular") || tags.includes("Top Picks");
}

/** Decorative Alphonso mango silhouette. */
function MangoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" fill="none">
      <path
        d="M83 20c14 8 26 24 26 44 0 30-25 52-53 52-24 0-45-16-45-41 0-30 24-46 40-59 9-7 21-4 32 4Z"
        fill="currentColor"
      />
      <path
        d="M88 14c-3 6-9 10-16 11"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function MenuPageClient() {
  const menuSections = useLiveMenuSections();
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

  const featured = useMemo<MenuItem | undefined>(() => {
    const all = menuSections.flatMap((s) => s.items);
    return (
      all.find((i) => i.tags.includes("Top Picks")) ??
      all.find((i) => i.tags.includes("Popular")) ??
      all[0]
    );
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
      <section className="menu-hero">
        <div className="menu-hero-glow" aria-hidden="true" />
        <MangoMark className="menu-hero-mango menu-hero-mango-a" />
        <MangoMark className="menu-hero-mango menu-hero-mango-b" />
        <MotionGroup className="section-shell menu-hero-inner">
          <MotionItem variant="headline">
            <p className="menu-hero-eyebrow">The Mango Factory Menu</p>
            <h1 className="menu-hero-title text-balance">
              Every bowl.<br />
              Every burger.<br />
              <em>Every mango.</em>
            </h1>
          </MotionItem>
          <MotionItem variant="rise" className="menu-hero-foot">
            <p className="menu-hero-meta">
              <span>{menuSections.length}</span> categories
              <i aria-hidden="true">·</i>
              <span>{totalItems}</span> dishes
              <i aria-hidden="true">·</i>
              updated live
            </p>
            <div className="menu-hero-actions">
              <a
                className="button button-primary"
                href={site.orderUrl}
                target="_blank"
                rel="noreferrer"
              >
                Order on DoorDash
              </a>
              <a className="button button-hero-ghost" href="#menu-grid">
                Browse the menu
              </a>
            </div>
          </MotionItem>
        </MotionGroup>
      </section>

      {/* ── Sticky filter bar ─────────────────────────────────────────── */}
      <div className="menu-bar">
        <div className="section-shell menu-bar-row">
          <nav className="menu-bar-nav" aria-label="Jump to category">
            {menuSections.map((s) => {
              const id = toSectionId(s.name);
              return (
                <a
                  key={s.name}
                  href={`#${id}`}
                  className={`menu-bar-tab${activeSection === id ? " is-active" : ""}`}
                >
                  {s.name}
                </a>
              );
            })}
          </nav>

          <label className="menu-bar-search" aria-label="Search menu">
            <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={searchQuery}
              placeholder="Search dishes…"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="menu-bar-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>
        </div>

        <div className="section-shell menu-bar-pills">
          {availableFilters.map((f) => (
            <button
              key={f}
              type="button"
              className={`menu-filter-pill${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
          {hasQueryOrFilter && (
            <button type="button" className="menu-filter-clear" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Featured spotlight (default view only) ─────────────────────── */}
      {!hasQueryOrFilter && featured && (
        <section className="menu-featured">
          <motion.div
            className="section-shell menu-featured-inner"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            <div className="menu-featured-media">
              <Image
                src={featured.image}
                alt={featured.name}
                fill
                sizes="(max-width:900px) 100vw, 55vw"
                quality={90}
                className="photo-grade"
              />
              <span className="menu-featured-stamp">
                <b>★</b> Most Ordered
              </span>
            </div>
            <div className="menu-featured-text">
              <p className="menu-featured-eyebrow">The house favorite</p>
              <h2 className="menu-featured-name">{featured.name}</h2>
              <p className="menu-featured-desc">{featured.description}</p>
              <div className="menu-featured-tags">
                {featured.tags.map((t) => (
                  <span key={t} className="menu-card-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="menu-featured-foot">
                <span className="menu-featured-price">{featured.price}</span>
                <a
                  className="button button-primary"
                  href={site.orderUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Order this
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── Menu grid ──────────────────────────────────────────────────── */}
      <div id="menu-grid" className="menu-grid-wrap">
        {hasQueryOrFilter && (
          <motion.div
            className="menu-result-band"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={`${searchQuery}|${activeFilter}`}
          >
            <p className="section-shell menu-result-note">
              {matchCount === 0
                ? "No dishes match"
                : `${matchCount} dish${matchCount !== 1 ? "es" : ""} matching`}
              {activeFilter !== "All" && <span className="menu-result-chip">{activeFilter}</span>}
            </p>
          </motion.div>
        )}

        {filteredMenu.length === 0 ? (
          <motion.div
            className="menu-empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <MangoMark className="menu-empty-mango" />
            <h3>Nothing on the menu matches</h3>
            <p>Try a different keyword or clear the filters to see everything.</p>
            <button type="button" className="button button-primary" onClick={clearAll}>
              Reset the menu
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((section, si) => (
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
                  <header className="menu-section-hd">
                    <span className="menu-section-num" aria-hidden="true">
                      {String(si + 1).padStart(2, "0")}
                    </span>
                    <div className="menu-section-hd-text">
                      <p className="menu-section-eyebrow">
                        {sectionTags(section.items).join(" · ")}
                      </p>
                      <h2 className="menu-section-title">{section.name}</h2>
                      <p className="menu-section-note">{section.note}</p>
                    </div>
                    <span className="menu-section-count">
                      {section.items.length} item{section.items.length !== 1 ? "s" : ""}
                    </span>
                  </header>

                  <div className="menu-card-grid">
                    <AnimatePresence mode="popLayout">
                      {section.items.map((item, i) => (
                        <motion.article
                          key={`${section.name}-${item.name}`}
                          layout
                          className={`menu-card${isPopular(item.tags) ? " is-popular" : ""}`}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.44, delay: i * 0.06, ease: EASE_OUT }}
                          whileHover={{ y: -6, transition: { duration: 0.2, ease: EASE_OUT } }}
                        >
                          <div className="menu-card-media">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width:680px) 100vw, (max-width:980px) 50vw, 33vw"
                              quality={85}
                              className="photo-grade"
                            />
                            <div className="menu-card-scrim" aria-hidden="true" />
                            {isPopular(item.tags) && (
                              <span className="menu-card-star">
                                <b>★</b> Popular
                              </span>
                            )}
                            <span className="menu-card-price">{item.price}</span>
                          </div>
                          <div className="menu-card-body">
                            <h3 className="menu-card-name">{item.name}</h3>
                            <p className="menu-card-desc">{item.description}</p>
                            <div className="menu-card-tags">
                              {item.tags.map((t) => (
                                <span key={t} className="menu-card-tag">
                                  {t}
                                </span>
                              ))}
                            </div>
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

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="menu-cta">
        <MangoMark className="menu-cta-mango" />
        <div className="section-shell menu-cta-inner">
          <div>
            <p className="menu-cta-eyebrow">Hungry yet?</p>
            <h2 className="menu-cta-title">Skip the line. Order ahead.</h2>
            <p className="menu-cta-sub">Open daily at 11 AM · 326 Commercial St, San Jose, CA</p>
          </div>
          <a className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
            Order on DoorDash
          </a>
        </div>
      </section>
    </main>
  );
}
