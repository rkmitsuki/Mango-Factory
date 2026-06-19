"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { MotionGroup, MotionItem, MotionLink } from "@/components/motion";
import { menuSections, site, MenuSection } from "@/lib/site";

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
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");

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
  }, [activeFilter, searchQuery]);

  const hasQueryOrFilter = searchQuery.trim().length > 0 || activeFilter !== "All";

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
            {menuSections.map((section) => (
              <a key={section.name} href={`#${toSectionId(section.name)}`}>
                {section.name}
              </a>
            ))}
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
          <article className="menu-empty">
            <h2>No matching items</h2>
            <p>Try a shorter keyword or clear the filter.</p>
          </article>
        ) : (
          <>
            {hasQueryOrFilter ? (
              <p className="menu-result-note">
                Showing {filteredMenu.flatMap((section) => section.items).length} matching items
              </p>
            ) : null}

            {filteredMenu.map((section) => (
              <article key={section.name} className="menu-section" id={toSectionId(section.name)}>
                <div className="menu-section-heading">
                  <p className="menu-section-eyebrow">Category</p>
                  <h2>{section.name}</h2>
                  <p className="menu-section-note">{section.note}</p>
                  <p className="menu-tags">{getActiveTags(section.items).join(" • ")}</p>
                </div>

                <div className="menu-item-card-grid">
                  {section.items.map((item) => (
                    <article key={`${section.name}-${item.name}`} className="menu-item-card">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={420}
                        height={300}
                        quality={85}
                        className="photo-grade"
                      />
                      <div>
                        <div className="menu-item-topline">
                          <h3>{item.name}</h3>
                          <strong>{item.price}</strong>
                        </div>
                        <p>{item.description}</p>
                        <p className="menu-item-tags">{item.tags.join(" • ")}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            ))}
          </>
        )}
      </section>

    </main>
  );
}
