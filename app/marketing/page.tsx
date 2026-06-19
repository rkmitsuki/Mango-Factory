import { campaigns, site, trackerStats } from "@/lib/site";

export const metadata = {
  title: "Marketing Tracker | Mango Factory",
  description: "Lightweight Mango Factory campaign tracker for leads, campaigns, orders, and offers.",
};

export default function MarketingPage() {
  return (
    <main className="marketing-page">
      <section className="section-shell tracker-shell">
        <div className="tracker-hero">
          <div>
            <p className="label">Marketing tracker</p>
            <h1 className="display-section text-balance">Campaign command center for Mango Factory growth.</h1>
            <p>
              Track burger demand, Alphonso drink clicks, boba experiments, review-led
              soup retargeting, and ordering signals. No Firebase required.
            </p>
          </div>
          <a className="button button-primary" href={site.orderUrl} target="_blank" rel="noreferrer">
            DoorDash listing
          </a>
        </div>

        <section className="tracker-metrics" aria-label="Marketing metrics">
          {trackerStats.map(([label, value, trend, note]) => (
            <article key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <em>{trend}</em>
              <p>{note}</p>
            </article>
          ))}
        </section>

        <section className="tracker-board" aria-label="Campaigns">
          <div className="tracker-board-head">
            <h2>Campaigns</h2>
            <span>June sprint</span>
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
