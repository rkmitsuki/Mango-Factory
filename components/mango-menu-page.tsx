"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MotionGroup, MotionItem, MotionLink } from "@/components/motion";
import { type MenuSection } from "@/lib/menu-content";
import { site } from "@/lib/site";
import { useLiveMenuSections } from "@/lib/use-live-menu-sections";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const filters = ["All", "Burgers", "Drinks", "Comfort", "Snacks", "Add-on", "Popular", "Top Picks", "Bowl"] as const;

function toSectionId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function itemMatchesFilter(tags: string[], filter: (typeof filters)[number]) {
  if (filter === "All") return true;
  return tags.includes(filter);
}

function getActiveTags(sectionItems: MenuSection["items"]) {
  const all = sectionItems.flatMap((item) => item.tags);
  return Array.from(new Set(all));
}

export function MenuPageClient() {
  const menuSections = useLiveMenuSections();

  const allFilters = useMemo(() => {
    const discovered = new Set<(typeof filters)[number]>();
    menuSections.forEach((section) => {
      section.items.forEach((item) => {
        item.tags.forEach((tag) => {
          if (filters.includes(tag as (typeof filters)[number])) {
            discovered.add(tag as (typeof filters)[number]);
          }
        });
      });
    });
    return ["All", ...Array.from(discovered)] as (typeof filters)[number][];
  }, [menuSections]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [activeSection, setActiveSection] = useState("");

  const filteredMenu = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return menuSections
      .map((section) => {
        const items = section.items.filter((item) => {
          const matchesFilter = itemMatchesFilter(item.tags, activeFilter);
          const target = `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
          const matchesQuery = !normalizedQuery || target.includes(normalizedQuery);
          return matchesFilter && matchesQuery;
        });
        return { ...section, items };
      })
      .filter((section) => section.items.length > 0);
  }, [activeFilter, menuSections, searchQuery]);

  const hasQueryOrFilter = searchQuery.trim().length > 0 || activeFilter !== "All";

  useEffect(() => {
    if (hasQueryOrFilter) {
      setActiveSection("");
      return;
    }

    const elements = document.querySelectorAll<HTMLElement>(".menu-section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredMenu, hasQueryOrFilter]);

  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <MotionGroup className="section-shell subpage-hero-grid">
          <MotionItem>
            <p className="label">Menu</p>
            <h1 className="display-section text-balance">Browse the full menu.</h1>
            <p>
              Choose from burgers, drinks, and comfort bowls with category filters or search.
            </p>
            <div className="action-row">
              <MotionLink className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
                Order on DoorDash
              </MotionLink>
              <MotionLink className="button button-ghost" href="#menu-grid">
                Jump to categories
              </MotionLink>
            </div>
          </MotionItem>
          <MotionItem>
            <Image
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=92"
              alt="Mango Factory burger menu"
              width={1000}
              height={760}
              quality={92}
              className="photo-panel photo-grade"
            />
          </MotionItem>
        </MotionGroup>
      </section>

      <section className="menu-section-band">
        <div className="section-shell menu-toolbar-shell">
          <nav className="menu-category-nav" aria-label="Menu categories">
            {menuSections.map((section) => {
              const id = toSectionId(section.name);
              return (
                <a
                  key={section.name}
                  href={`#${id}`}
                  className={activeSection === id ? "is-active" : undefined}
                >
                  {section.name}
                </a>
              );
            })}
          </nav>

          <div className="menu-tools">
            <label className="menu-search" aria-label="Search menu">
              <span>Search menu</span>
              <input
                type="search"
                value={searchQuery}
                placeholder="Search mango, momo, burger, soup"
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
              />
            </label>

            <div className="menu-filter-pills" role="tablist" aria-label="Menu filters">
              {allFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={activeFilter === filter ? "menu-filter-pill active" : "menu-filter-pill"}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="menu-grid" className="section-shell menu-sections">
        {filteredMenu.length === 0 ? (
          <motion.article
            className="menu-empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <h2>No matching items</h2>
            <p>Try a shorter keyword or clear the filter.</p>
          </motion.article>
        ) : (
          <>
            {hasQueryOrFilter ? (
              <motion.p
                className="menu-result-note"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Showing {filteredMenu.flatMap((section) => section.items).length} matching items
              </motion.p>
            ) : null}

            <AnimatePresence mode="popLayout">
              {filteredMenu.map((section) => (
                <motion.article
                  key={section.name}
                  layout
                  className="menu-section"
                  id={toSectionId(section.name)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.38, ease: EASE_OUT }}
                >
                  <div className="menu-section-heading">
                    <p className="menu-section-eyebrow">Category</p>
                    <h2>{section.name}</h2>
                    <p className="menu-section-note">{section.note}</p>
                    <p className="menu-tags">{getActiveTags(section.items).join(" • ")}</p>
                  </div>

                  <div className="menu-item-card-grid">
                    <AnimatePresence mode="popLayout">
                      {section.items.map((item) => (
                        <motion.div
                          key={`${section.name}-${item.name}`}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.94 }}
                          transition={{ duration: 0.32, ease: EASE_OUT }}
                          className="menu-item-card"
                          whileHover={{ y: -4, boxShadow: "0 16px 48px rgba(23,16,10,0.14)" }}
                        >
                          <div className="menu-item-card-img-wrap">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={420}
                              height={300}
                              quality={85}
                              className="photo-grade"
                            />
                          </div>
                          <div>
                            <div className="menu-item-topline">
                              <h3>{item.name}</h3>
                              <strong>{item.price}</strong>
                            </div>
                            <p>{item.description}</p>
                            <p className="menu-item-tags">{item.tags.join(" • ")}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </>
        )}
      </section>
    </main>
  );
}
