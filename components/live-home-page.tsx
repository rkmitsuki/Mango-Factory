"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionCard, MotionGroup, MotionItem, MotionLink } from "@/components/motion";
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
  "Veg Momo Noodle Soup": {
    category: "Guest Favorite",
    note: "Indo-Nepali momos in a rich broth-great when you want comforting, filling food.",
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
              <h1 className="display-hero text-balance">Burgers, mango drinks, momos.</h1>
            </MotionItem>
            <MotionItem>
              <p className="hero-lede">
                Mango Factory serves Desi Veg Paneer Burgers, Alphonso mango juice,
                sweet mango milkshakes, boba, momo noodle soup, fried rice, and spring
                rolls from 326 Commercial St in San Jose.
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
              <Image
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=92"
                alt="Loaded vegetarian burger representing Mango Factory desi burger menu"
                width={1400}
                height={1000}
                priority
                quality={92}
                className="photo-grade"
              />
              <div className="hero-ticket">
                <span>Top pick</span>
                <strong>Desi Veg Burger</strong>
              </div>
            </div>
          </MotionItem>
        </MotionGroup>
      </section>

      <section className="proof-strip">
        <div className="section-shell proof-grid">
          {proof.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section pairing-section">
        <div className="section-shell">
          <PairingCarousel />
        </div>
      </section>

      <section className="home-section cream-band" id="menu">
        <div className="section-shell section-heading">
          <div>
            <p className="label">Signature picks</p>
            <h2 className="display-section text-balance">Fan favorites from the kitchen.</h2>
          </div>
          <Link className="button button-secondary" href="/menu">
            View full menu
          </Link>
        </div>
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
        <div className="section-shell">
          <FeedbackCarousel />
        </div>
      </section>

      <section className="home-section visit-section">
        <div className="section-shell">
          <LocationMap />
        </div>
      </section>
    </main>
  );
}
