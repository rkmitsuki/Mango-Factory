import { Metadata } from "next";
import { MenuPageClient } from "@/components/mango-menu-page";
import "./menu.css";

export const metadata: Metadata = {
  title: "Menu | Mango Factory",
  description:
    "Browse the Mango Factory menu. Fresh Alphonso mango drinks, desi burgers, homemade sweets, and bagels.",
};

export default function MenuPage() {
  return <MenuPageClient />;
}
