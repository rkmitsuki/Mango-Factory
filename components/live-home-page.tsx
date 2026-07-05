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
    note: "Silky mango cheesecake on a soft biscuit base — made in-house.",
  },
} as const;

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

  return (
    <main>
      <section className="hero-section">
        <div className="hero-grid-overlay" />
        <MotionGroup className="section-shell hero-layout">
          <div className="hero-copy">
            <MotionItem variant="headline">
              <h1 className="display-hero text-balance">Fresh Alphonso mango, done daily.</h1>
            </MotionItem>
            <MotionItem>
              <p className="hero-lede">
                Cold-pressed Alphonso mango juice and shakes, desi paneer burgers, and
                homemade mango sweets — blended, stacked, and made fresh to order at
                326 Commercial St in San Jose.
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

      <section className="home-section ethos-section">
        <Reveal className="section-shell ethos-head">
          <p className="label">What makes it ours</p>
          <h2 className="display-section text-balance">Fresh fruit, made by hand.</h2>
        </Reveal>
        <div className="section-shell ethos-grid">
          <Reveal className="ethos-item">
            <span className="ethos-num">01</span>
            <h3>Fresh, always</h3>
            <p>
              Juices are cold-pressed and shakes are blended to order — nothing sits,
              nothing comes from concentrate. You taste the fruit, not a mix.
            </p>
          </Reveal>
          <Reveal className="ethos-item" delay={0.1}>
            <span className="ethos-num">02</span>
            <h3>Pure Alphonso mango</h3>
            <p>
              The king of mangoes: a short season, deep sweetness, and a perfume you
              catch before the first sip. Every drink and sweet is built on it.
            </p>
          </Reveal>
          <Reveal className="ethos-item" delay={0.2}>
            <span className="ethos-num">03</span>
            <h3>Homemade</h3>
            <p>
              Mango cream cheese, cheesecake, and chutneys are made in our own kitchen —
              small batches from scratch, never off a supplier&apos;s shelf.
            </p>
          </Reveal>
        </div>
      </section>

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
