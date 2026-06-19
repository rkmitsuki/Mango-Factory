import Image from "next/image";
import Link from "next/link";
import { MotionCard, MotionGroup, MotionItem, MotionLink } from "@/components/motion";
import {
  customerMoments,
  customerQuotes,
  menuSections,
  orderPairings,
  proof,
  signatures,
  site,
} from "@/lib/site";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      <path d="M5 12h13m-5-5 5 5-5 5" />
    </svg>
  );
}

export default function Home() {
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
                <span>Most ordered</span>
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
        <div className="section-shell section-heading">
          <div>
            <p className="label">Order ideas</p>
            <h2 className="display-section text-balance">Built for the way people actually eat.</h2>
          </div>
        </div>
        <MotionGroup className="section-shell pairing-grid">
          {orderPairings.map((pairing) => (
            <MotionCard className="pairing-card" key={pairing.title}>
              <span>{pairing.title}</span>
              <strong>{pairing.items}</strong>
              <p>{pairing.note}</p>
            </MotionCard>
          ))}
        </MotionGroup>
      </section>

      <section className="home-section cream-band" id="menu">
        <div className="section-shell section-heading">
          <div>
            <p className="label">DoorDash favorites</p>
            <h2 className="display-section text-balance">Burgers first. Mango right behind.</h2>
          </div>
          <Link className="button button-secondary" href="/menu">
            View menu
          </Link>
        </div>
        <MotionGroup className="section-shell signature-grid">
          {signatures.map((item) => (
            <MotionCard className="signature-card" key={item.name}>
              <Image src={item.image} alt={item.name} width={760} height={540} quality={85} className="photo-grade" />
              <div>
                <p>{item.category}</p>
                <h3>{item.name}</h3>
                <span>{item.note}</span>
                <strong>{item.price}</strong>
              </div>
            </MotionCard>
          ))}
        </MotionGroup>
      </section>

      <section className="home-section order-section">
        <div className="section-shell order-grid">
          <MotionGroup className="order-copy">
            <MotionItem>
              <p className="label">Order rhythm</p>
              <h2 className="display-section text-balance">Start savory. Finish mango.</h2>
            </MotionItem>
            <MotionItem>
              <p>
                Guests can build the same kind of order people already make on
                DoorDash: a desi burger or comfort bowl, a mango drink, then a snack
                for later.
              </p>
            </MotionItem>
            <MotionItem className="step-list">
              {["Start with the burger", "Add Alphonso mango", "Order pickup on DoorDash"].map((step, index) => (
                <div key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step}</strong>
                </div>
              ))}
            </MotionItem>
          </MotionGroup>
          <MotionItem>
            <div className="menu-stack-panel">
              {menuSections.map((section) => (
                <article key={section.name}>
                  <span>{section.name}</span>
                  <strong>{section.note}</strong>
                  <p>{section.items.join(" · ")}</p>
                </article>
              ))}
            </div>
          </MotionItem>
        </div>
      </section>

      <section className="home-section feedback-section">
        <div className="section-shell feedback-layout">
          <MotionGroup className="feedback-copy">
            <MotionItem>
              <p className="label">Guest feedback</p>
              <h2 className="display-section text-balance">The menu has more range than the name gives away.</h2>
            </MotionItem>
            <MotionItem>
              <p>
                Regulars come in for mango drinks, then find the paneer burgers,
                momo noodle soup, fried rice, and spring rolls that make it a real meal.
              </p>
            </MotionItem>
          </MotionGroup>
          <MotionGroup className="quote-grid">
            {customerQuotes.map((item) => (
              <MotionCard className="quote-card" key={item.quote}>
                <p>&ldquo;{item.quote}&rdquo;</p>
                <span>{item.source}</span>
              </MotionCard>
            ))}
          </MotionGroup>
        </div>
      </section>

      <section className="home-section visit-section">
        <div className="section-shell visit-grid">
          <div>
            <p className="label">Visit Mango Factory</p>
            <h2 className="display-section text-balance">Pick up downtown or order ahead.</h2>
            <p>
              Find Mango Factory on Commercial Street in San Jose. Order on DoorDash,
              grab directions, or build a full lunch from burgers, mango drinks, and comfort food.
            </p>
            <div className="action-row">
              <MotionLink className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
                Order online <ArrowIcon />
              </MotionLink>
              <MotionLink className="button button-ghost-dark" href={site.mapsUrl} target="_blank" rel="noreferrer">
                Get directions
              </MotionLink>
            </div>
          </div>
          <div className="moment-list">
            {customerMoments.map(([title, detail]) => (
              <article key={title}>
                <span>{title}</span>
                <strong>{detail}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
