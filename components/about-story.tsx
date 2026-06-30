"use client";

import Image from "next/image";
import Link from "next/link";
import { Counter, Marquee, ParallaxLayer, ScrollStory, TiltCard, type StoryPanel } from "@/components/motion";
import { MotionGroup, MotionItem } from "@/components/motion";
import { signatures, site } from "@/lib/site";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544531480-9eadeb3c8f41?auto=format&fit=crop&w=1600&q=85";

const storyPanels: StoryPanel[] = [
  {
    id: "source",
    eyebrow: "01 — Source",
    title: "It starts with Alphonso.",
    body: "Alphonso mango is the variety chefs argue over — short season, high sugar, a smell that fills the room before you cut into it. Everything on the Mango Factory menu, sweet or savory, is built around what that fruit can do.",
    image: "https://images.unsplash.com/photo-1544531480-9eadeb3c8f41?auto=format&fit=crop&w=1400&q=85",
    alt: "Ripe Alphonso mango close-up",
  },
  {
    id: "harvest",
    eyebrow: "02 — Harvest",
    title: "Ripe enough to eat plain.",
    body: "We pick for flavor, not shelf life. If a mango isn't sweet enough to eat on its own, it doesn't make it into a shake, a juice, or a slice — the bar is that simple, and it's the reason regulars notice the difference.",
    image: "https://images.unsplash.com/photo-1550825570-8ae96cf12d87?auto=format&fit=crop&w=1400&q=85",
    alt: "Pile of ripe whole mangoes",
  },
  {
    id: "press",
    eyebrow: "03 — Press",
    title: "Pure Alphonso, nothing added.",
    body: "The Fresh Alphonso Mango Juice and Sweet Mango Milkshake both run on one rule: no added sugar. The fruit is already there. Blending it thin and watering it down would just be hiding what made you order it.",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1400&q=85",
    alt: "Cold mango smoothie poured into a glass next to a whole mango",
  },
  {
    id: "kitchen",
    eyebrow: "04 — Kitchen",
    title: "Then the savory side wakes up.",
    body: `The Desi Veg Paneer Burger is the one people come back for first: paneer, cheddar, roasted onion, and house chutney stacked on a brioche bun for ${signatures[0]?.price ?? "$16.99"}. It's the proof that "mango" doesn't mean dessert-only.`,
    image: "https://images.unsplash.com/photo-1688246780164-00c01647e78c?auto=format&fit=crop&w=1400&q=85",
    alt: "Loaded burger on a wooden board",
  },
  {
    id: "comfort",
    eyebrow: "05 — Comfort",
    title: "Indo-Nepali comfort, built for return visits.",
    body: "Momos land in a rich, well-seasoned broth in the Veg Momo Noodle Soup — the dish customers mention by name in reviews. It's the cold-day order, the one that turns a quick stop into a sit-down meal.",
    image: "https://images.unsplash.com/photo-1767324672653-84c017d85d8e?auto=format&fit=crop&w=1400&q=85",
    alt: "Momos steaming in a bamboo basket",
  },
];

const marqueeItems = [
  "ALPHONSO MANGO",
  "326 COMMERCIAL ST, SAN JOSE",
  "DESI BURGERS",
  "INDO-NEPALI COMFORT",
  "OPEN DAILY AT 11 AM",
  "DOORDASH READY",
];

export function AboutStory() {
  return (
    <main className="subpage-main pb-24">
      <section className="about-hero">
        <ParallaxLayer className="about-hero-media" strength={70}>
          <Image
            src={HERO_IMAGE}
            alt="Hand holding a ripe whole mango"
            fill
            priority
            sizes="100vw"
            quality={85}
            className="photo-grade about-hero-img"
            style={{ objectFit: "cover" }}
          />
        </ParallaxLayer>
        <div className="about-hero-scrim" aria-hidden="true" />

        <div className="section-shell about-hero-content">
          <MotionGroup>
            <MotionItem variant="headline">
              <p className="label about-hero-label">About Mango Factory</p>
              <h1 className="display-hero about-hero-title text-balance">
                Ripe fruit first.
                <br />
                Everything else follows.
              </h1>
            </MotionItem>
            <MotionItem variant="rise">
              <p className="about-hero-sub max-w-2xl">
                A San Jose counter built around Alphonso mango — sweet drinks on one side,
                desi burgers and Indo-Nepali comfort food on the other, served {site.hours.toLowerCase()}.
              </p>
            </MotionItem>
            <MotionItem variant="softScale">
              <div className="about-hero-stats">
                <div className="about-hero-stat">
                  <strong>
                    <Counter value={4.9} suffix="★" />
                  </strong>
                  <span>Google rating</span>
                </div>
                <div className="about-hero-stat">
                  <strong>
                    <Counter value={16.99} prefix="$" />
                  </strong>
                  <span>Top pick: Desi Veg Burger</span>
                </div>
                <div className="about-hero-stat">
                  <strong>
                    <Counter value={11} suffix=" AM" />
                  </strong>
                  <span>Doors open daily</span>
                </div>
              </div>
            </MotionItem>
          </MotionGroup>
        </div>
      </section>

      <section className="section-shell about-story-intro">
        <p className="label">The journey</p>
        <h2 className="display-section text-balance">From orchard to order, in five stops.</h2>
        <p className="max-w-2xl leading-7 font-[620] text-[var(--muted)]">
          Scroll through how a mango becomes the menu — and where the savory side comes in to
          balance it out.
        </p>
      </section>

      <section className="section-shell mt-6">
        <ScrollStory panels={storyPanels} />
      </section>

      <Marquee items={marqueeItems} speed={34} />

      <section className="section-shell about-gallery">
        <div className="about-gallery-head">
          <p className="label">What lands on the table</p>
          <h2 className="display-section text-balance">Sweet, savory, and the contrast between them.</h2>
        </div>
        <div className="about-gallery-grid">
          {signatures.map((item) => (
            <TiltCard key={item.name} className="about-gallery-card">
              <div className="about-gallery-card-media">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 980px) 100vw, 24vw"
                  quality={85}
                  className="photo-grade"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="about-gallery-card-body">
                <span className="label about-gallery-card-label">{item.category}</span>
                <strong>{item.name}</strong>
                <p>{item.note}</p>
                <span className="about-gallery-card-price">{item.price}</span>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="section-shell about-visit">
        <div className="about-visit-copy">
          <p className="label">Visit</p>
          <h2 className="display-section text-balance">Ready when you are.</h2>
          <p className="max-w-xl leading-7 font-[620] text-[var(--muted)]">
            Find Mango Factory at {site.address}, order ahead on DoorDash, or browse the full
            menu before you go.
          </p>
        </div>
        <div className="about-visit-actions">
          <a className="button button-primary about-visit-cta" href={site.orderUrl} target="_blank" rel="noreferrer">
            Order on DoorDash
          </a>
          <Link className="button button-secondary" href="/menu">
            View full menu
          </Link>
          <a className="button button-secondary" href={site.mapsUrl} target="_blank" rel="noreferrer">
            Get directions
          </a>
        </div>
      </section>
    </main>
  );
}
