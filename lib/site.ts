import { fallbackMenuSections, type MenuItem, type MenuSection } from "@/lib/menu-content";

export type { MenuContentDocument, MenuItem, MenuSection } from "@/lib/menu-content";

export const site = {
  name: "Mango Factory",
  shortName: "MF",
  tagline: "Alphonso mango drinks, desi burgers, and Indo-Nepali comfort food.",
  address: "326 Commercial St, San Jose, CA",
  hours: "Open daily at 11 AM",
  phone: "(408) 555-0198",
  phoneHref: "tel:+14085550198",
  orderUrl: "https://www.doordash.com/store/mango-factory-san-jose-33771065/",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Mango+Factory+326+Commercial+St+San+Jose+CA",
};

export const navItems = [
  ["Menu", "/menu"],
  ["About", "/about"],
  ["Directions", site.mapsUrl],
] as const;

const menuItemsByName = new Map(
  fallbackMenuSections.flatMap((section) => section.items).map((item) => [item.name, item] as const),
);

function getMenuItem(name: string): MenuItem {
  const item = menuItemsByName.get(name);

  if (!item) {
    throw new Error(`Missing signature item in menu content: ${name}`);
  }

  return item;
}

function getSignatureImage(item: MenuItem): string {
  return item.image.replace("w=900", "w=1200");
}

const signatureContent = [
  {
    name: "Desi Veg Paneer Burger",
    category: "Top Pick",
    note: "A loaded vegetarian burger built around paneer, cheese, chutney, and a bold savory flavor.",
  },
  {
    name: "Sweet Mango Milkshake",
    category: "Mango Milkshake",
    note: "Thick, cold, and all mango. No added sugar.",
  },
  {
    name: "Fresh Alphonso Mango Juice",
    category: "Mango Drink",
    note: "Pure Alphonso, no extra sweeteners.",
  },
  {
    name: "Veg Momo Noodle Soup",
    category: "Guest Favorite",
    note: "Indo-Nepali momos in a rich broth—great when you want comforting, filling food.",
  },
] as const;

export const signatures = signatureContent.map(({ name, category, note }) => {
  const item = getMenuItem(name);

  return {
    name: item.name,
    category,
    price: item.price,
    image: getSignatureImage(item),
    note,
  };
});

export const proof = [
  ["4.9", "Google rating"],
  ["$16.99", "Desi Veg Burger"],
  ["10+", "5-star reviews"],
  ["11 AM", "opens daily"],
] as const;

export const menuSections: MenuSection[] = fallbackMenuSections;

export const orderPairings = [
  {
    title: "Burger + mango shake",
    items: "Desi Veg Paneer Burger, Sweet Mango Milkshake",
    note: "Savory burger and sweet mango shake in one order.",
  },
  {
    title: "Soup + spring rolls",
    items: "Veg Momo Noodle Soup, Veg Spring Rolls",
    note: "Comfort combo for lunch, rainy days, and pickup.",
  },
  {
    title: "Fried rice + Alphonso juice",
    items: "Veg Fried Rice, Fresh Alphonso Mango Juice",
    note: "Fast and filling with a bright mango finish.",
  },
] as const;

export const customerQuotes = [
  {
    quote: "The paneer burger is the standout order. Big portion, lots of flavor, and it travels well.",
    source: "Google review",
  },
  {
    quote: "Alphonso mango juice tastes like the reason the place is called Mango Factory.",
    source: "DoorDash review",
  },
  {
    quote: "Momo noodle soup has the seasoning and quantity people keep coming back for.",
    source: "Google Maps",
  },
] as const;

export const customerMoments = [
  ["Lunch break", "Burger, fried rice, mango drink"],
  ["Sweet stop", "Alphonso shake, boba, mango slice"],
  ["Comfort order", "Momo noodle soup, spring rolls"],
] as const;

export const trackerStats = [
  ["Local interest", "184", "+22%", "Maps, DoorDash, and Instagram traffic"],
  ["Tracked orders", "71", "+15%", "Burger, mango drink, and pickup conversions"],
  ["Active offers", "5", "live", "Burger, mango drink, soup, boba, and lunch offers"],
  ["Return", "3.8x", "target", "Blended paid and organic estimate"],
] as const;

export const campaigns = [
  {
    name: "Desi burger push",
    channel: "Google Local + DoorDash",
    spend: "$520",
    leads: 74,
    status: "Scaling",
  },
  {
    name: "Alphonso drink launch",
    channel: "Instagram Reels",
    spend: "$420",
    leads: 58,
    status: "Scaling",
  },
  {
    name: "Soup review retargeting",
    channel: "Meta",
    spend: "$260",
    leads: 37,
    status: "Testing",
  },
  {
    name: "Commercial St lunch",
    channel: "Google Local",
    spend: "$310",
    leads: 49,
    status: "Active",
  },
  {
    name: "Boba and bagel test",
    channel: "Meta",
    spend: "$190",
    leads: 21,
    status: "New",
  },
];

export const commentThemes = [
  {
    source: "Google Maps",
    theme: "Burger demand",
    quote: "People keep calling out the Desi Veg Paneer Burger as the unexpected favorite.",
    sentiment: "Positive",
    count: 18,
    action: "Feature burger first on homepage and DoorDash hero photo.",
  },
  {
    source: "DoorDash",
    theme: "Mango drinks",
    quote: "Sweet mango milkshake and Alphonso juice are pairing with savory orders.",
    sentiment: "Positive",
    count: 15,
    action: "Bundle mango drink with burger and fried rice orders.",
  },
  {
    source: "Google Maps",
    theme: "Comfort food",
    quote: "Momo noodle soup feedback mentions seasoning, quantity, and cold-weather value.",
    sentiment: "Positive",
    count: 9,
    action: "Run soup + spring roll lunch creative on cold weekdays.",
  },
  {
    source: "DoorDash",
    theme: "Menu clarity",
    quote: "Some customers do not expect burgers from the Mango Factory name.",
    sentiment: "Opportunity",
    count: 7,
    action: "Keep burgers visible before drinks on site and social.",
  },
] as const;

export const menuRadar = [
  ["Desi Veg Paneer Burger", 94, "+31%", "Hero item"],
  ["Fresh Alphonso Mango Juice", 82, "+24%", "Pairing item"],
  ["Sweet Mango Milkshake", 79, "+18%", "Dessert drink"],
  ["Veg Momo Noodle Soup", 68, "+12%", "Review driver"],
  ["Veg Spring Rolls", 54, "+9%", "Attach item"],
] as const;

export const ownerActions = [
  {
    title: "Put burgers above the fold",
    impact: "High",
    detail: "Customers are discovering the restaurant through savory items, not only mango drinks.",
  },
  {
    title: "Launch burger + Alphonso bundle",
    impact: "High",
    detail: "Best no-database promo for DoorDash and homepage ordering behavior.",
  },
  {
    title: "Collect post-order feedback",
    impact: "Medium",
    detail: "Use a simple form now, wire to database later when the owner signs.",
  },
] as const;
