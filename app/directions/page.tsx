import type { Metadata } from "next";
import { DirectionsView } from "@/components/directions-view";

export const metadata: Metadata = {
  title: "Directions | Mango Factory",
  description:
    "Find Mango Factory at 326 Commercial St in downtown San Jose. Open daily. Get directions and how to order for pickup or delivery.",
};

export default function DirectionsPage() {
  return <DirectionsView />;
}
