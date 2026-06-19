import Image from "next/image";
import Link from "next/link";
import { MotionCard, MotionGroup, MotionItem, MotionLink } from "@/components/motion";
import { campaigns, menuSections, proof, signatures, site, trackerStats } from "@/lib/site";

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
              <h1 className="display-hero text-balance">Desi burgers meet Alphonso mango.</h1>
            </MotionItem>
            <MotionItem>
              <p className="hero-lede">
                Mango Factory is not just drinks. The DoorDash favorites are paneer
                burgers, sweet mango milkshakes, Alphonso juice, boba, momo noodle soup,
                fried rice, and spring rolls from 326 Commercial St, San Jose.
              </p>
            </MotionItem>
            <MotionItem className="action-row">
              <MotionLink className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
                Order online <ArrowIcon />
              </MotionLink>
              <MotionLink className="button button-ghost" href={site.mapsUrl} target="_blank" rel="noreferrer">
                Get directions
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
              <p className="label">Fast path</p>
              <h2 className="display-section text-balance">Make the site sell the next visit.</h2>
            </MotionItem>
            <MotionItem>
              <p>
                The site now sells the real order: savory burgers and comfort food
                up front, then mango drinks, boba, bagels, and DoorDash pickup.
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

      <section className="home-section marketing-preview">
        <div className="section-shell marketing-grid">
          <div>
            <p className="label">Marketing tracker</p>
            <h2 className="display-section text-balance">Track burgers and mango drinks separately.</h2>
            <p>
              A lightweight dashboard for the marketing push: track burger campaigns,
              mango drink campaigns, review-driven soup retargeting, and pickup demand.
            </p>
            <div className="action-row">
              <MotionLink className="button button-primary" href="/marketing">
                Open tracker <ArrowIcon />
              </MotionLink>
              <MotionLink className="button button-ghost-dark" href={site.orderUrl} target="_blank" rel="noreferrer">
                DoorDash listing
              </MotionLink>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-topline">
              <strong>Marketing tracker</strong>
              <span>Live plan</span>
            </div>
            <div className="metric-grid">
              {trackerStats.map(([label, value, trend]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <em>{trend}</em>
                </div>
              ))}
            </div>
            <div className="campaign-list">
              {campaigns.slice(0, 3).map((campaign) => (
                <div key={campaign.name}>
                  <span>{campaign.channel}</span>
                  <strong>{campaign.name}</strong>
                  <em>{campaign.status}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
