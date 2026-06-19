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
  ["Directions", site.mapsUrl],
] as const;

export const signatures = [
  {
    name: "Desi Veg Paneer Burger",
    category: "Top Pick",
    price: "$16.99",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85",
    note: "A loaded vegetarian burger built around paneer, cheese, chutney, and a bold savory flavor.",
  },
  {
    name: "Sweet Mango Milkshake",
    category: "Mango Milkshake",
    price: "$10.00",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=85",
    note: "Thick, cold, and all mango. No added sugar.",
  },
  {
    name: "Fresh Alphonso Mango Juice",
    category: "Mango Drink",
    price: "$11.99",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1200&q=85",
    note: "Pure Alphonso, no extra sweeteners.",
  },
  {
    name: "Veg Momo Noodle Soup",
    category: "Guest Favorite",
    price: "See menu",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85",
    note: "Indo-Nepali momos in a rich broth—great when you want comforting, filling food.",
  },
];

export const proof = [
  ["4.9", "Google rating"],
  ["$16.99", "Desi Veg Burger"],
  ["10+", "5-star reviews"],
  ["11 AM", "opens daily"],
] as const;

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

export const menuSections: MenuSection[] = [
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
