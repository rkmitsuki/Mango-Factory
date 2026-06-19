"use client";

import { useMemo, useState } from "react";
import { campaigns, commentThemes, menuRadar, ownerActions, site, trackerStats } from "@/lib/site";

const filters = ["All", "Google Maps", "DoorDash", "Positive", "Opportunity"] as const;

export function DashboardClient() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");

  const visibleComments = useMemo(() => {
    if (activeFilter === "All") {
      return commentThemes;
    }

    return commentThemes.filter((item) => item.source === activeFilter || item.sentiment === activeFilter);
  }, [activeFilter]);

  const totalComments = commentThemes.reduce((sum, item) => sum + item.count, 0);

  return (
    <main className="marketing-page">
      <section className="section-shell tracker-shell">
        <div className="tracker-hero dashboard-hero">
          <div>
            <p className="label">Owner dashboard</p>
            <h1 className="display-section text-balance">What customers are ordering, saying, and coming back for.</h1>
            <p>
              An operating view for Mango Factory: item demand, review themes,
              comment tracking, offer ideas, and next actions without needing a database yet.
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

        <section className="dashboard-two-col">
          <article className="tracker-board insight-panel">
            <div className="tracker-board-head">
              <h2>Menu demand</h2>
              <span>Today</span>
            </div>
            <div className="radar-list">
              {menuRadar.map(([item, score, trend, note]) => (
                <div key={item} className="radar-row">
                  <div>
                    <strong>{item}</strong>
                    <span>{note}</span>
                  </div>
                  <div className="bar-track" aria-label={`${item} demand score ${score}`}>
                    <i style={{ width: `${score}%` }} />
                  </div>
                  <em>{trend}</em>
                </div>
              ))}
            </div>
          </article>

          <article className="tracker-board insight-panel">
            <div className="tracker-board-head">
              <h2>Next actions</h2>
              <span>Owner view</span>
            </div>
            <div className="action-stack">
              {ownerActions.map((action) => (
                <div key={action.title}>
                  <span>{action.impact}</span>
                  <strong>{action.title}</strong>
                  <p>{action.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="tracker-board comment-board" aria-label="Comment tracking">
          <div className="tracker-board-head">
            <h2>Comment tracking</h2>
            <span>{totalComments} tagged signals</span>
          </div>
          <div className="filter-row" aria-label="Comment filters">
            {filters.map((filter) => (
              <button
                className={filter === activeFilter ? "active" : ""}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="comment-list">
            {visibleComments.map((item) => (
              <article key={`${item.source}-${item.theme}`}>
                <div>
                  <span>{item.source}</span>
                  <strong>{item.theme}</strong>
                </div>
                <p>&ldquo;{item.quote}&rdquo;</p>
                <em>{item.sentiment}</em>
                <small>{item.count} mentions</small>
                <b>{item.action}</b>
              </article>
            ))}
          </div>
        </section>

        <section className="tracker-board" aria-label="Offer planner">
          <div className="tracker-board-head">
            <h2>Offer planner</h2>
            <span>This week</span>
          </div>
          <div className="campaign-table">
            {campaigns.map((campaign) => (
              <article key={campaign.name}>
                <div>
                  <strong>{campaign.name}</strong>
                  <span>{campaign.channel}</span>
                </div>
                <span>{campaign.spend}</span>
                <span>{campaign.leads} Orders</span>
                <em>{campaign.status}</em>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
