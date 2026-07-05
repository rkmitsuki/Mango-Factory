import { Metadata } from "next";
import { MenuPageClient } from "@/components/mango-menu-page";
import "./menu.css";

export const metadata: Metadata = {
  title: "Menu | Mango Factory",
  description:
    "Browse Mango Factory's menu — fresh Alphonso mango drinks, desi burgers, homemade mango sweets, and bagels.",
};

export default function MenuPage() {
  return <MenuPageClient />;
}
