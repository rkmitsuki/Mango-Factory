import Image from "next/image";
import { MotionGroup, MotionItem, MotionLink } from "@/components/motion";
import { menuSections, signatures, site } from "@/lib/site";

function toSectionId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export const metadata = {
  title: "Menu | Mango Factory",
  description: "Browse Mango Factory's menu: burgers, Alphonso drinks, comfort bowls, and add-ons.",
};

export default function MenuPage() {
  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <MotionGroup className="section-shell subpage-hero-grid">
          <MotionItem>
            <p className="label">DoorDash menu</p>
            <h1 className="display-section text-balance">What people actually order, made easy to browse.</h1>
            <p>
              Burgers lead, mango drinks stay high, and bowls are the no-fuss lunch fallback.
              This page gives a quick read of what&apos;s available so you can order faster.
            </p>
            <div className="action-row">
              <MotionLink className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
                Order online
              </MotionLink>
              <MotionLink className="button button-ghost" href="#menu-grid">
                Browse categories
              </MotionLink>
            </div>
          </MotionItem>
          <MotionItem>
            <Image
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=92"
              alt="Mango Factory burger menu highlight"
              width={1000}
              height={760}
              quality={92}
              className="photo-panel photo-grade"
            />
          </MotionItem>
        </MotionGroup>
      </section>

      <section className="menu-section-band">
        <div className="section-shell menu-category-nav">
          {menuSections.map((section) => (
            <a key={section.name} href={`#${toSectionId(section.name)}`}>
              {section.name}
            </a>
          ))}
        </div>
      </section>

      <section id="menu-grid" className="section-shell">
        {menuSections.map((section) => (
          <article key={section.name} className="menu-category" id={toSectionId(section.name)}>
            <div className="menu-category-heading">
              <p className="label">Category</p>
              <h2>{section.name}</h2>
              <p className="menu-category-note">{section.note}</p>
            </div>
            <ul>
              {section.items.map((item) => (
                <li key={item.name}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <strong>{item.price}</strong>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="home-section cream-band">
        <div className="section-shell section-heading">
          <div>
            <p className="label">Popular right now</p>
            <h2 className="display-section">Need a fast pick? Start here.</h2>
          </div>
          <MotionLink className="button button-secondary" href={site.orderUrl} target="_blank" rel="noreferrer">
            Open full DoorDash menu
          </MotionLink>
        </div>
        <div className="section-shell menu-list">
          {signatures.map((item) => (
            <article key={item.name}>
              <Image src={item.image} alt={item.name} width={420} height={300} quality={85} className="photo-grade" />
              <div>
                <p className="label">{item.category}</p>
                <h2>{item.name}</h2>
                <span>{item.note}</span>
              </div>
              <strong>{item.price}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
