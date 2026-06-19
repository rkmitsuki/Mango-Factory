import { campaigns, site, trackerStats } from "@/lib/site";

export const metadata = {
  title: "Growth Dashboard | Mango Factory",
  description: "Mango Factory growth dashboard for demand, offers, orders, and channel performance.",
};

export default function MarketingPage() {
  return (
    <main className="marketing-page">
      <section className="section-shell tracker-shell">
        <div className="tracker-hero">
          <div>
            <p className="label">Growth dashboard</p>
            <h1 className="display-section text-balance">A clearer view of what customers want next.</h1>
            <p>
              See burger demand, Alphonso drink interest, boba tests, review-led
              comfort food momentum, and ordering signals in one place.
            </p>
          </div>
          <a className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
            DoorDash listing
          </a>
        </div>

        <section className="tracker-metrics" aria-label="Growth metrics">
          {trackerStats.map(([label, value, trend, note]) => (
            <article key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <em>{trend}</em>
              <p>{note}</p>
            </article>
          ))}
        </section>

        <section className="tracker-board" aria-label="Offers">
          <div className="tracker-board-head">
            <h2>Offers</h2>
            <span>Demo sprint</span>
          </div>
          <div className="campaign-table">
            {campaigns.map((campaign) => (
              <article key={campaign.name}>
                <div>
                  <strong>{campaign.name}</strong>
                  <span>{campaign.channel}</span>
                </div>
                <span>{campaign.spend}</span>
                <span>{campaign.leads} Leads</span>
                <em>{campaign.status}</em>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
