import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fallbackMenuSections } from "@/lib/menu-content";
import { signatures, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Mango Factory",
  description: "Read the Mango Factory story, from ripe mangoes and small-batch prep to the drinks, burgers, and comfort food served in San Jose.",
};

export default function AboutPage() {
  const [, shake, juice] = signatures;
  const mangoSlice = fallbackMenuSections
    .flatMap((section) => section.items)
    .find((item) => item.name === "Alphonso Mango Slice");

  if (!mangoSlice) {
    throw new Error("Missing Alphonso Mango Slice image for about page.");
  }

  return (
    <main className="subpage-main pb-24">
      <section
        className="relative overflow-hidden pt-28 pb-14"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(32,95,59,0.18), transparent 18rem), radial-gradient(circle at 84% 18%, rgba(247,181,27,0.2), transparent 22rem), linear-gradient(180deg, rgba(255,248,234,0.92), rgba(247,241,231,0.72))",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent 0, transparent 10px, rgba(23,16,10,0.018) 10px, rgba(23,16,10,0.018) 11px)",
            maskImage: "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
        />

        <div className="section-shell relative z-1 grid items-end gap-7">
          <div className="grid gap-4">
            <p className="label">About</p>
            <h1 className="display-section text-balance">From mango farm to plate.</h1>
            <p className="max-w-3xl text-[1.06rem] leading-7 font-[620] text-[var(--muted)]">
              Mango Factory starts with ripe fruit, handled with care, then carries that same
              freshness into shakes, juices, and a menu that keeps the fruit tasting vivid all
              the way to the final order.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_1fr]">
        <article className="overflow-hidden rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-[0_24px_60px_rgba(23,16,10,0.08)]">
          <div className="relative h-[320px] lg:h-[420px]">
            <Image src={mangoSlice.image} alt={mangoSlice.name} fill sizes="(max-width: 980px) 100vw, 42vw" className="photo-grade object-cover" />
          </div>
        </article>

        <article className="overflow-hidden rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-[0_24px_60px_rgba(23,16,10,0.08)]">
          <div className="relative h-[320px] lg:h-[420px]">
            <Image src={juice.image} alt={juice.name} fill sizes="(max-width: 980px) 100vw, 28vw" className="photo-grade object-cover" />
          </div>
        </article>

        <article className="overflow-hidden rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-[0_24px_60px_rgba(23,16,10,0.08)]">
          <div className="relative h-[320px] lg:h-[420px]">
            <Image src={shake.image} alt={shake.name} fill sizes="(max-width: 980px) 100vw, 30vw" className="photo-grade object-cover" />
          </div>
        </article>
      </section>

      <section className="section-shell mt-8 grid gap-4 lg:grid-cols-3">
        <article className="grid content-start gap-3 rounded-[8px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,248,234,0.94),rgba(255,255,255,0.92))] p-6 shadow-[0_24px_60px_rgba(23,16,10,0.08)]">
          <p className="label">01 Source</p>
          <strong className="font-[var(--font-display)] text-[1.6rem] leading-none">Picked for flavor, not shelf life.</strong>
          <p className="leading-6 font-[620] text-[var(--muted)]">
            The first decision is simple: the mango has to smell right, look ripe, and taste
            sweet enough to carry a drink on its own. If the fruit is flat, the whole menu feels flat.
          </p>
        </article>

        <article className="grid content-start gap-3 rounded-[8px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,248,234,0.94),rgba(255,255,255,0.92))] p-6 shadow-[0_24px_60px_rgba(23,16,10,0.08)]">
          <p className="label">02 Prep</p>
          <strong className="font-[var(--font-display)] text-[1.6rem] leading-none">Built in small runs.</strong>
          <p className="leading-6 font-[620] text-[var(--muted)]">
            Mango works best when it stays bright. That means smaller batches, colder handling,
            and less time sitting around before it reaches the cup or the plate.
          </p>
        </article>

        <article className="grid content-start gap-3 rounded-[8px] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,248,234,0.94),rgba(255,255,255,0.92))] p-6 shadow-[0_24px_60px_rgba(23,16,10,0.08)]">
          <p className="label">03 Serve</p>
          <strong className="font-[var(--font-display)] text-[1.6rem] leading-none">Served with contrast.</strong>
          <p className="leading-6 font-[620] text-[var(--muted)]">
            Mango does not live in isolation here. The sweetness belongs next to spice, salt,
            and richer comfort food, which is what gives the whole menu its balance.
          </p>
        </article>
      </section>

      <section
        className="section-shell mt-8 grid gap-7 rounded-[8px] border border-[var(--line)] p-7 text-[var(--foreground)] lg:grid-cols-[minmax(0,1fr)_360px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,248,234,0.96), rgba(255,255,255,0.92)), radial-gradient(circle at 84% 18%, rgba(247,181,27,0.18), transparent 14rem)",
        }}
      >
        <div className="grid gap-4">
          <p className="label">Freshness</p>
          <h2 className="display-section text-balance">A daily rhythm, not a warehouse taste.</h2>
          <p className="max-w-2xl text-[1.06rem] leading-7 font-[620] text-[var(--muted)]">
            The point is not just mango flavor. It is the feeling of something handled at
            the right moment, served with enough care that the final bite or sip still tastes
            alive.
          </p>
        </div>
        <div className="grid gap-3">
          <article className="grid gap-2 rounded-[8px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] p-5 text-[var(--foreground)]">
            <strong className="font-[var(--font-display)] text-[1.4rem] leading-none">Ripe fruit</strong>
            <p className="leading-6 font-[620] text-[var(--muted)]">Chosen for aroma, color, and a finish that still tastes like mango.</p>
          </article>
          <article className="grid gap-2 rounded-[8px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] p-5 text-[var(--foreground)]">
            <strong className="font-[var(--font-display)] text-[1.4rem] leading-none">Small-batch prep</strong>
            <p className="leading-6 font-[620] text-[var(--muted)]">Shorter holding time keeps texture cleaner and the drinks sharper.</p>
          </article>
          <article className="grid gap-2 rounded-[8px] border border-[var(--line)] bg-[rgba(255,255,255,0.8)] p-5 text-[var(--foreground)]">
            <strong className="font-[var(--font-display)] text-[1.4rem] leading-none">Savory balance</strong>
            <p className="leading-6 font-[620] text-[var(--muted)]">The menu is built so the sweet side and the rich side make each other better.</p>
          </article>
        </div>
      </section>

      <section className="section-shell mt-8 grid gap-6 border-t border-[var(--line)] pt-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="grid gap-4">
          <p className="label">Why Mango Factory</p>
          <h2 className="display-section text-balance">More than a drink stop.</h2>
        </div>
        <div className="grid gap-4 text-[var(--muted)]">
          <p className="leading-7 font-[620]">
            Mango Factory is built around one idea: fruit can set the tone for an entire menu,
            not just dessert. That is why the site leads with mango, but the meal keeps going
            through paneer burgers, noodle soup, and heavier comfort dishes.
          </p>
          <p className="leading-7 font-[620]">
            The result is a place that feels less like a category and more like a rhythm:
            sweet first, savory after, then back again. That contrast is what makes the food
            memorable instead of generic.
          </p>
          <div className="grid gap-3 rounded-[8px] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] p-5 shadow-[0_24px_60px_rgba(23,16,10,0.08)]">
            <span className="label mb-0">What lands on the table</span>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="grid gap-1">
                <strong className="font-[var(--font-display)] text-[1.3rem]">Sweet</strong>
                <p className="leading-6 font-[620] text-[var(--muted)]">Alphonso juice and thick shakes.</p>
              </div>
              <div className="grid gap-1">
                <strong className="font-[var(--font-display)] text-[1.3rem]">Savory</strong>
                <p className="leading-6 font-[620] text-[var(--muted)]">Paneer burgers and comfort bowls.</p>
              </div>
              <div className="grid gap-1">
                <strong className="font-[var(--font-display)] text-[1.3rem]">Balance</strong>
                <p className="leading-6 font-[620] text-[var(--muted)]">A menu built on contrast, not sameness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-8 flex flex-col gap-6 border-t border-[var(--line)] pt-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="label">Visit</p>
          <h2 className="display-section text-balance">See the story in person.</h2>
          <p className="max-w-2xl leading-7 font-[620] text-[var(--muted)]">
            Find Mango Factory at {site.address}, order ahead, or browse the live menu before
            you stop by.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
            Order online
          </a>
          <Link className="button button-secondary" href="/menu">
            View menu
          </Link>
          <a className="button button-secondary" href={site.mapsUrl} target="_blank" rel="noreferrer">
            Get directions
          </a>
        </div>
      </section>
    </main>
  );
}
