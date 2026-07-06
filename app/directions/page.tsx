import type { Metadata } from "next";
import { DirectionsView } from "@/components/directions-view";

export const metadata: Metadata = {
  title: "Directions | Mango Factory",
  description:
    "Find Mango Factory at 326 Commercial St in downtown San Jose. Open daily at 11 AM. Get directions, hours, and how to order.",
};

export default function DirectionsPage() {
  return <DirectionsView />;
}
