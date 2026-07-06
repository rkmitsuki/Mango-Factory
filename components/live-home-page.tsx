"use client";

import Image from "next/image";
import Link from "next/link";
import { Marquee, MotionCard, MotionGroup, MotionItem, MotionLink, ParallaxLayer, Reveal } from "@/components/motion";
import { FeedbackCarousel, LocationMap, PairingCarousel } from "@/components/home-showcase";
import { getSignatureItems } from "@/lib/menu-content";
import { proof, site } from "@/lib/site";
import { useLiveMenuSections } from "@/lib/use-live-menu-sections";

const signatureCopyByName = {
  "Desi Veg Paneer Burger": {
    category: "Top Pick",
    note: "A loaded vegetarian burger built around paneer, cheese, chutney, and a bold savory flavor.",
  },
  "Sweet Mango Milkshake": {
    category: "Mango Milkshake",
    note: "Thick, cold, and all mango. No added sugar.",
  },
  "Fresh Alphonso Mango Juice": {
    category: "Mango Drink",
    note: "Pure Alphonso, no extra sweeteners.",
  },
  "Alphonso Mango Cheesecake": {
    category: "Homemade",
    note: "Silky mango cheesecake on a soft biscuit base. Made in-house.",
  },
} as const;

const storyRows = [
  {
    id: "fresh",
    num: "01",
    kicker: "Fresh",
    title: "Pressed and poured the same day.",
    body: "Juices cold-pressed, shakes blended to order. Nothing sits, nothing from concentrate.",
    image: "https://images.unsplash.com/photo-1716956755600-4d32af2b8f87?auto=format&fit=crop&w=1200&q=85",
    alt: "Tall glass of fresh-pressed Alphonso mango juice",
  },
  {
    id: "alphonso",
    num: "02",
    kicker: "Alphonso mango",
    title: "The king of mangoes, and nothing less.",
    body: "A short season, honeyed sweetness, and a scent you notice before the first sip. Every drink starts with real Alphonso.",
    image: "https://images.unsplash.com/photo-1544531480-9eadeb3c8f41?auto=format&fit=crop&w=1200&q=85",
    alt: "A ripe Alphonso mango held in hand",
  },
  {
    id: "homemade",
    num: "03",
    kicker: "Homemade",
    title: "Made in our kitchen, in small batches.",
    body: "Mango cream cheese, cheesecake, and chutneys, all made in-house from scratch. The part you can't buy off a shelf.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=85",
    alt: "A slice of homemade mango cheesecake",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      <path d="M5 12h13m-5-5 5 5-5 5" />
    </svg>
  );
}

export function LiveHomePage() {
  const sections = useLiveMenuSections();
  const signatures = getSignatureItems(sections);
  const mangoBar = sections.find((s) => s.name === "Mango Bar");
  const barDrinks = mangoBar ? mangoBar.items.slice(0, 3) : [];

  return (
    <main>
      <section className="hero-section">
        <div className="hero-grid-overlay" />
        <MotionGroup className="section-shell hero-layout">
          <div className="hero-copy">
            <MotionItem variant="headline">
              <p className="hero-kicker">Desi Burgers · Alphonso Mango · San Jose</p>
              <h1 className="display-hero text-balance">Fresh Alphonso mango, made daily.</h1>
            </MotionItem>
            <MotionItem>
              <p className="hero-lede">
                Cold-pressed mango juice, desi paneer burgers, and homemade sweets.
                Made fresh daily in San Jose.
              </p>
            </MotionItem>
            <MotionItem className="action-row">
              <MotionLink className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
                Order online <ArrowIcon />
              </MotionLink>
              <MotionLink className="button button-ghost" href={site.mapsUrl} target="_blank" rel="noreferrer">
                Get directions
              </MotionLink>
              <MotionLink className="button button-ghost" href="/menu">
                View menu
              </MotionLink>
            </MotionItem>
            <MotionItem>
              <p className="hero-meta">
                <span>★ 4.9</span> on Google · Open daily at 11 AM · No added sugar
              </p>
            </MotionItem>
          </div>
          <MotionItem className="hero-visual-wrap" variant="visual">
            <div className="hero-visual">
              <ParallaxLayer className="hero-visual-parallax" strength={44} offset={["start start", "end start"]}>
                <Image
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=92"
                  alt="Loaded vegetarian burger representing Mango Factory desi burger menu"
                  width={1400}
                  height={1000}
                  priority
                  quality={92}
                  className="photo-grade"
                />
              </ParallaxLayer>
              <div className="hero-ticket">
                <span>Top pick</span>
                <strong>Desi Veg Burger</strong>
              </div>
            </div>
          </MotionItem>
        </MotionGroup>
      </section>

      <section className="proof-strip">
        <Reveal className="section-shell proof-grid">
          {proof.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      <Marquee
        items={["FRESH ALPHONSO MANGO", "DESI BURGERS", "PRESSED DAILY", "HOMEMADE SWEETS", "NO ADDED SUGAR", "SAN JOSE, CA"]}
        speed={28}
      />

      <section className="story-section">
        <Reveal className="section-shell story-head">
          <p className="label">What makes it ours</p>
          <h2 className="display-section text-balance">Fresh fruit, made by hand.</h2>
          <p className="story-head-sub">Three things we don&apos;t cut corners on.</p>
        </Reveal>

        <div className="story-rows">
          {storyRows.map((row) => (
            <div className="story-row section-shell" key={row.id}>
              <div className="story-row-media">
                <ParallaxLayer className="story-row-parallax" strength={46}>
                  <Image
                    src={row.image}
                    alt={row.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    quality={85}
                    className="photo-grade"
                  />
                </ParallaxLayer>
                <span className="story-row-num" aria-hidden="true">{row.num}</span>
              </div>
              <Reveal className="story-row-text">
                <p className="story-row-kicker">{row.kicker}</p>
                <h3>{row.title}</h3>
                <p className="story-row-body">{row.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {barDrinks.length > 0 && (
        <section className="home-bar">
          <div className="home-bar-aura" aria-hidden="true" />
          <div className="section-shell home-bar-inner">
            <Reveal className="home-bar-head">
              <p className="label">The Mango Bar</p>
              <h2 className="display-section text-balance">Three ways to drink an Alphonso.</h2>
              <p className="home-bar-note">
                Cold-pressed juice, a thick 16 oz shake, and a no-sugar sweet shake.
                Every pour is pure Alphonso.
              </p>
              <MotionLink className="button button-primary" href="/menu">
                See the full menu <ArrowIcon />
              </MotionLink>
            </Reveal>
            <div className="home-bar-drinks">
              {barDrinks.map((drink, index) => (
                <Reveal className="home-bar-drink" key={drink.name} delay={index * 0.08}>
                  <span className="home-bar-drink-num" aria-hidden="true">0{index + 1}</span>
                  <div className="home-bar-drink-media">
                    <Image
                      src={drink.image}
                      alt={drink.name}
                      fill
                      sizes="(max-width: 900px) 33vw, 220px"
                      quality={82}
                      className="photo-grade"
                    />
                  </div>
                  <div className="home-bar-drink-info">
                    <h3>{drink.name}</h3>
                    <strong>{drink.price}</strong>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-section pairing-section">
        <Reveal className="section-shell">
          <PairingCarousel />
        </Reveal>
      </section>

      <section className="home-section cream-band" id="menu">
        <Reveal className="section-shell section-heading">
          <div>
            <p className="label">Signature picks</p>
            <h2 className="display-section text-balance">Fan favorites from the kitchen.</h2>
          </div>
          <Link className="button button-secondary" href="/menu">
            View full menu
          </Link>
        </Reveal>
        <MotionGroup className="section-shell signature-grid">
          {signatures.map((item) => {
            const signatureCopy = signatureCopyByName[item.name as keyof typeof signatureCopyByName];

            return (
              <MotionCard className="signature-card" key={item.name}>
                <Image src={item.image} alt={item.name} width={760} height={540} quality={85} className="photo-grade" />
                <div>
                  <p>{signatureCopy?.category ?? (item.tags[0] ?? "Featured")}</p>
                  <h3>{item.name}</h3>
                  <span>{signatureCopy?.note ?? item.description}</span>
                  <strong>{item.price}</strong>
                </div>
              </MotionCard>
            );
          })}
        </MotionGroup>
      </section>

      <section className="home-section feedback-section">
        <Reveal className="section-shell">
          <FeedbackCarousel />
        </Reveal>
      </section>

      <section className="home-section visit-section">
        <Reveal className="section-shell">
          <LocationMap />
        </Reveal>
      </section>
    </main>
  );
}
