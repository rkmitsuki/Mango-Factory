import Image from "next/image";
import { MotionGroup, MotionItem, MotionLink } from "@/components/motion";
import { menuSections, signatures, site } from "@/lib/site";

export const metadata = {
  title: "Menu | Mango Factory",
  description: "Mango Factory menu highlights for Desi Veg Paneer Burgers, Alphonso mango drinks, boba, momo noodle soup, fried rice, and spring rolls.",
};

export default function MenuPage() {
  return (
    <main className="subpage-main">
      <section className="subpage-hero">
        <MotionGroup className="section-shell subpage-hero-grid">
          <MotionItem>
            <h1 className="display-section text-balance">Menu built around desi burgers and Alphonso mango.</h1>
            <p>
              DoorDash shows the range clearly: burgers, mango drinks, Alphonso items,
              boba, bagels, momo noodle soup, fried rice, and spring rolls.
            </p>
            <MotionLink className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
              Order online
            </MotionLink>
          </MotionItem>
          <MotionItem>
            <Image src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=92" alt="Mango Factory burger menu highlight" width={1000} height={760} quality={92} className="photo-panel photo-grade" />
          </MotionItem>
        </MotionGroup>
      </section>
      <section className="menu-section-band">
        <div className="section-shell menu-section-grid">
          {menuSections.map((section) => (
            <article key={section.name}>
              <p className="label">{section.name}</p>
              <h2>{section.note}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="home-section cream-band">
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
