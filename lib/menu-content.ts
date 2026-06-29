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
    name: "Desi Burgers",
    note: "Savory burgers people come back for.",
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
        price: "$17.99",
        tags: ["Burgers", "Popular"],
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
  {
    name: "Alphonso Mango Drinks",
    note: "Cold, bright mango drinks that pair well with mains.",
    items: [
      {
        name: "Sweet Mango Milkshake",
        description: "Creamy mango shake blended with ice cream and lightly spiced dairy.",
        price: "$10.00",
        tags: ["Drinks", "Popular", "Top Picks"],
        image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Fresh Alphonso Milkshake 16 oz",
        description: "Richer Alphonso blend in a larger cup for carryout.",
        price: "$11.99",
        tags: ["Drinks", "Popular"],
        image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Fresh Alphonso Mango Juice",
        description: "Straight Alphonso juice, chilled and unsweetened.",
        price: "$11.99",
        tags: ["Drinks", "Top Picks"],
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Alphonso Mango Slice",
        description: "Sweet mango wedges served chilled in a shared cup.",
        price: "$6.50",
        tags: ["Drinks"],
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
  {
    name: "Soup and Bowls",
    note: "Lunch favorites that are filling and easy to share.",
    items: [
      {
        name: "Veg Momo Noodle Soup",
        description: "Vegetable momos, soft noodles, and broth with coriander and scallion.",
        price: "$14.00",
        tags: ["Comfort", "Popular", "Bowl"],
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Veg Fried Rice",
        description: "Toasted rice with vegetables and light house-seasoned sauce.",
        price: "$12.50",
        tags: ["Comfort", "Bowl"],
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Veg Spring Rolls",
        description: "Crispy rolls with mild veggie filling and house sweet-chili dip.",
        price: "$8.50",
        tags: ["Comfort", "Add-on"],
        image: "https://images.unsplash.com/photo-1596662951482-f5f6d6d0e0c1?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },
  {
    name: "Drinks, Boba, and Snacks",
    note: "Great with full meals and shared orders.",
    items: [
      {
        name: "Boba",
        description: "Iced tea with chewy tapioca pearls.",
        price: "$6.00",
        tags: ["Snacks", "Add-on"],
        image: "https://images.unsplash.com/photo-1610889556528-9a770e9fd1e2?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Magical Bagel",
        description: "Dense bagel topped with a seasonal glaze.",
        price: "$7.50",
        tags: ["Snacks", "Add-on"],
        image: "https://images.unsplash.com/photo-1604908176997-125fddc0f2f8?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "House Drink Selection",
        description: "Seasonal house drinks; check the counter for today's options.",
        price: "Ask at counter",
        tags: ["Drinks", "Add-on"],
        image: "https://images.unsplash.com/photo-1563903532903-4e1ca7c6cb7e?auto=format&fit=crop&w=900&q=85",
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
