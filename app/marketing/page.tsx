import { DashboardClient } from "./dashboard-client";

export const metadata = {
  title: "Owner Dashboard | Mango Factory",
  description: "Mango Factory owner dashboard for menu demand, comments, offers, and ordering signals.",
};

export default function MarketingPage() {
  return <DashboardClient />;
}
