import type { Metadata } from "next";
import { AboutStory } from "@/components/about-story";

export const metadata: Metadata = {
  title: "About | Mango Factory",
  description:
    "Read the Mango Factory story, from ripe Alphonso mangoes and small-batch prep to the desi burgers and homemade mango sweets served in San Jose.",
};

export default function AboutPage() {
  return <AboutStory />;
}
