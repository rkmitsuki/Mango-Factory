"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion";
import { site } from "@/lib/site";

export function DirectionsView() {
  return (
    <main className="subpage-main directions-page">
      <section className="section-shell directions-hero">
        <Reveal>
          <p className="label">Visit</p>
          <h1 className="display-section text-balance">Find us in downtown San Jose.</h1>
          <p className="directions-sub">
            {site.address}. {site.hours}.
          </p>
        </Reveal>
      </section>

      <section className="section-shell directions-grid">
        <Reveal className="directions-map">
          <iframe
            title="Map to Mango Factory on Commercial Street"
            src="https://www.google.com/maps?q=Mango+Factory+326+Commercial+St+San+Jose+CA&z=16&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>

        <Reveal className="directions-info" delay={0.1}>
          <div className="directions-card">
            <p className="label">Address</p>
            <strong>326 Commercial St</strong>
            <p>San Jose, CA 95112</p>
            <a href={site.mapsUrl} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </div>

          <div className="directions-card">
            <p className="label">Open</p>
            <strong>Every day</strong>
            <p>Order ahead for pickup or delivery.</p>
          </div>

          <div className="directions-card">
            <p className="label">Contact</p>
            <strong>{site.phone}</strong>
            <a href={site.phoneHref}>Call the counter</a>
          </div>

          <div className="directions-actions">
            <a className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
              Order on DoorDash
            </a>
            <Link className="button button-secondary" href="/menu">
              View the menu
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
