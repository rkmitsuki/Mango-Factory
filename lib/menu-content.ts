export type MenuItem = {
  name: string;
  description: string;
  price: string;
  tags: string[];
  image: string;
};

export type MenuSection = {
  name: string;
  note: string;
  items: MenuItem[];
};

export type MenuContentDocument = {
  sections: MenuSection[];
  updatedAt?: number;
};

export const fallbackMenuSections: MenuSection[] = [
  {
    name: "Mango Bar",
    note: "Every pour is pure Alphonso — pressed, blended, or shaken.",
    items: [
      {
        name: "Fresh Alphonso Mango Juice",
        description: "Cold-pressed Alphonso, chilled and unsweetened — just the fruit.",
        price: "$11.99",
        tags: ["Drinks", "Popular", "Top Picks"],
        image: "https://images.unsplash.com/photo-1716956755600-4d32af2b8f87?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Fresh Alphonso Milkshake 16 oz",
        description: "The full 16 oz pour — thick, cold, and all Alphonso.",
        price: "$10.00",
        tags: ["Drinks", "Popular"],
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Sweet Mango Milkshake",
        description: "Creamy Alphonso shake blended sweet with no added sugar.",
        price: "$10.00",
        tags: ["Drinks", "Top Picks"],
        image: "https://images.unsplash.com/photo-1562114676-007657641f2e?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
  {
    name: "Desi Burgers",
    note: "Savory desi burgers people come back for.",
    items: [
      {
        name: "Desi Veg Paneer Burger",
        description: "Paneer, cheddar, roasted onion, and house chutney on a brioche bun.",
        price: "$16.99",
        tags: ["Burgers", "Popular", "Top Picks"],
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Desi Veg Cheese Burger",
        description: "Indian-spiced cheese blend, lettuce, tomato, pickled onion, and smoky-sweet sauce.",
        price: "$16.99",
        tags: ["Burgers", "Popular"],
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Desi Veggie Mushroom Paneer Burger",
        description: "Paneer and mushroom stacked with chutney and melted cheese.",
        price: "$16.99",
        tags: ["Burgers"],
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
  {
    name: "Mango Sweets",
    note: "Alphonso, for dessert.",
    items: [
      {
        name: "Alphonso Mango Slice",
        description: "Sweet Alphonso wedges served chilled in a shareable cup.",
        price: "$12.00",
        tags: ["Popular"],
        image: "https://images.unsplash.com/photo-1550825570-8ae96cf12d87?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Alphonso Mango Cheesecake",
        description: "Silky mango cheesecake on a soft biscuit base.",
        price: "$8.99",
        tags: ["Top Picks"],
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Alphonso Mango Madness",
        description: "A layered mango parfait with cream and toppings.",
        price: "$12.00",
        tags: ["Popular"],
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
  {
    name: "Bagels",
    note: "Toasted bagels, mango-forward.",
    items: [
      {
        name: "Mango Cream Cheese Bagel",
        description: "Sesame bagel with sweet Alphonso mango cream cheese.",
        price: "$7.99",
        tags: ["Snacks", "Popular"],
        image: "https://images.unsplash.com/photo-1643049440977-52149e636d0c?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Cream Cheese Bagel",
        description: "Classic toasted bagel with house cream cheese.",
        price: "$7.99",
        tags: ["Snacks"],
        image: "https://images.unsplash.com/photo-1585841393012-e4ded4a6e2d0?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isMenuItem(value: unknown): value is MenuItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return typeof item.name === "string"
    && typeof item.description === "string"
    && typeof item.price === "string"
    && typeof item.image === "string"
    && isStringArray(item.tags);
}

function isMenuSection(value: unknown): value is MenuSection {
  if (!value || typeof value !== "object") {
    return false;
  }

  const section = value as Record<string, unknown>;
  return typeof section.name === "string"
    && typeof section.note === "string"
    && Array.isArray(section.items)
    && section.items.every(isMenuItem);
}

export function parseMenuContentDocument(value: unknown): MenuContentDocument | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const doc = value as Record<string, unknown>;
  if (!Array.isArray(doc.sections) || !doc.sections.every(isMenuSection)) {
    return null;
  }

  const hasUpdatedAt = Object.prototype.hasOwnProperty.call(doc, "updatedAt");
  if (hasUpdatedAt && typeof doc.updatedAt !== "number") {
    return null;
  }

  return {
    sections: doc.sections,
    updatedAt: doc.updatedAt as number | undefined,
  };
}

export function getSignatureItems(sections: MenuSection[]): MenuItem[] {
  const allItems = sections.flatMap((section) => section.items);
  const topPicks = allItems.filter((item) => item.tags.includes("Top Picks"));

  if (topPicks.length >= 4) {
    return topPicks.slice(0, 4);
  }

  const remainingItems = allItems.filter((item) => !topPicks.includes(item));
  return [...topPicks, ...remainingItems].slice(0, 4);
}
