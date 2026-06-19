export const site = {
  name: "Mango Factory",
  shortName: "MF",
  tagline: "Alphonso mango drinks, desi burgers, and Indo-Nepali comfort food.",
  address: "326 Commercial St, San Jose, CA",
  phone: "(408) 555-0198",
  phoneHref: "tel:+14085550198",
  orderUrl: "https://www.doordash.com/store/mango-factory-san-jose-33771065/",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Mango+Factory+326+Commercial+St+San+Jose+CA",
};

export const navItems = [
  ["Menu", "/menu"],
  ["Dashboard", "/marketing"],
  ["Directions", site.mapsUrl],
] as const;

export const signatures = [
  {
    name: "Desi Veg Paneer Burger",
    category: "Most Ordered",
    price: "$16.99",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85",
    note: "A loaded vegetarian burger built around paneer, cheese, chutney, and a proper savory bite.",
  },
  {
    name: "Sweet Mango Milkshake",
    category: "Dreamy Drinks",
    price: "$10.00",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=85",
    note: "A thick mango shake with no added sugar listed on DoorDash.",
  },
  {
    name: "Fresh Alphonso Mango Juice",
    category: "Mango Dreams Series",
    price: "$11.99",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1200&q=85",
    note: "Fresh Alphonso mango flavor for the menu item people expect from the name.",
  },
  {
    name: "Veg Momo Noodle Soup",
    category: "Review Favorite",
    price: "DoorDash",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85",
    note: "Customers call out the Indian-style noodle soup for seasoning, quantity, and cold-weather comfort.",
  },
];

export const proof = [
  ["4.9", "early rating signal"],
  ["$16.99", "desi veg burgers"],
  ["10+", "DoorDash ratings"],
  ["11 AM", "opens for pickup"],
] as const;

export const menuSections = [
  {
    name: "Burgers",
    note: "The savory anchor customers keep talking about.",
    items: ["Desi Veg Paneer Burger", "Desi Veg Cheese Burger"],
  },
  {
    name: "Mango Drinks",
    note: "Alphonso mango shakes, juice, slices, and sweet mango drinks.",
    items: ["Sweet mango milkshake", "Fresh Alphonso milkshake 16 oz", "Fresh Alphonso mango juice", "Alphonso mango slice"],
  },
  {
    name: "Comfort Food",
    note: "The review-driven side of the menu.",
    items: ["Veg momo noodle soup", "Veg fried rice", "Veg spring rolls"],
  },
  {
    name: "Boba & Bagels",
    note: "DoorDash categories for snacks and repeat orders.",
    items: ["Boba", "Magical Bagel", "Dreamy Drinks"],
  },
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
