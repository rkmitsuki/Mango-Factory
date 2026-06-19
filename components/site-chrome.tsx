import Link from "next/link";
import { navItems, site } from "@/lib/site";
import { MotionHeader, MotionLink } from "./motion";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      <path d="M5 12h13m-5-5 5 5-5 5" />
    </svg>
  );
}

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      MF
    </span>
  );
}

export function SiteHeader() {
  return (
    <MotionHeader>
      <header className="site-header">
        <nav className="section-shell nav-shell" aria-label="Primary navigation">
          <Link href="/" className="brand-link" aria-label="Mango Factory home">
            <BrandMark />
            <span>
              <strong>{site.name}</strong>
              <small>Burgers · Mango Drinks · Momos</small>
            </span>
          </Link>
          <div className="nav-links">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href}>
                {label}
              </Link>
            ))}
          </div>
          <MotionLink className="button button-primary nav-order" href={site.orderUrl} target="_blank" rel="noreferrer">
            Order online <ArrowIcon />
          </MotionLink>
        </nav>
      </header>
    </MotionHeader>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div>
          <div className="footer-brand">
            <BrandMark />
            <strong>{site.name}</strong>
          </div>
          <p>{site.tagline}</p>
        </div>
        <div>
          <strong>Visit</strong>
          <a href={site.mapsUrl} target="_blank" rel="noreferrer">
            {site.address}
          </a>
          <a href={site.phoneHref}>{site.phone}</a>
        </div>
        <div>
          <strong>Order</strong>
          <Link href="/menu">Menu</Link>
          <a href={site.orderUrl} target="_blank" rel="noreferrer">
            DoorDash
          </a>
        </div>
      </div>
    </footer>
  );
}

export function MobileActionBar() {
  return (
    <div className="mobile-action-bar" aria-label="Quick actions">
      <a href={site.orderUrl} target="_blank" rel="noreferrer">
        Order
      </a>
      <a href={site.mapsUrl} target="_blank" rel="noreferrer">
        Directions
      </a>
    </div>
  );
}
