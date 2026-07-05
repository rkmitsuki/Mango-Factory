import { Metadata } from "next";
import { MenuPageClient } from "@/components/mango-menu-page";
import "./menu.css";

export const metadata: Metadata = {
  title: "Menu | Mango Factory",
  description:
    "Browse Mango Factory's menu with categories, search, and filter options for burgers, drinks, and comfort bowls.",
};

export default function MenuPage() {
  return <MenuPageClient />;
}
