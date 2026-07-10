export type BiteTrailOwnerKind = "you" | "friend";

export type BiteTrailFoodEntry = {
  comments: string;
  costPerPerson: number;
  currency: "SGD";
  id: string;
  itemsBought?: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  ownerKind: BiteTrailOwnerKind;
  ownerName: string;
  placeName: string;
  ratingOutOf10: number;
  visitedAt: string;
};

export const mockFoodEntries: BiteTrailFoodEntry[] = [
  {
    id: "bt-maxwell-tian-tian",
    placeName: "Tian Tian Chicken Rice",
    ownerName: "Benny",
    ownerKind: "you",
    latitude: 1.2807,
    longitude: 103.8447,
    neighborhood: "Maxwell",
    costPerPerson: 6.5,
    currency: "SGD",
    itemsBought: "Chicken rice, iced barley",
    ratingOutOf10: 8.7,
    visitedAt: "2026-06-14",
    comments:
      "Reliable lunch stop. Rice is fragrant and the queue moves faster than expected.",
  },
  {
    id: "bt-maxwell-zhen-zhen",
    placeName: "Zhen Zhen Porridge",
    ownerName: "Benny",
    ownerKind: "you",
    latitude: 1.28095,
    longitude: 103.84435,
    neighborhood: "Maxwell",
    costPerPerson: 5.8,
    currency: "SGD",
    itemsBought: "Century egg porridge",
    ratingOutOf10: 8.2,
    visitedAt: "2026-06-02",
    comments: "Comfort food texture, best when eaten early before the stall gets too crowded.",
  },
  {
    id: "bt-maxwell-fuzhou",
    placeName: "Fuzhou Oyster Cake",
    ownerName: "Kai",
    ownerKind: "friend",
    latitude: 1.28046,
    longitude: 103.84418,
    neighborhood: "Maxwell",
    costPerPerson: 3.2,
    currency: "SGD",
    itemsBought: "Oyster cake",
    ratingOutOf10: 7.9,
    visitedAt: "2026-05-29",
    comments: "Crispy snack pin from Kai's list. Worth adding as a side stop.",
  },
  {
    id: "bt-tanjong-pagar-bakery",
    placeName: "Keong Saik Bakery",
    ownerName: "Mira",
    ownerKind: "friend",
    latitude: 1.28021,
    longitude: 103.84222,
    neighborhood: "Tanjong Pagar",
    costPerPerson: 12,
    currency: "SGD",
    itemsBought: "Sourdough tart, coffee",
    ratingOutOf10: 8.4,
    visitedAt: "2026-05-18",
    comments: "Good dessert follow-up after dinner nearby. The pastry case is the main draw.",
  },
  {
    id: "bt-bugis-albert-kway-chap",
    placeName: "Albert Centre Kway Chap",
    ownerName: "Benny",
    ownerKind: "you",
    latitude: 1.30084,
    longitude: 103.85416,
    neighborhood: "Bugis",
    costPerPerson: 7.4,
    currency: "SGD",
    itemsBought: "Kway chap set",
    ratingOutOf10: 7.6,
    visitedAt: "2026-04-27",
    comments: "Strong weekday option when in Bugis. Broth was the highlight.",
  },
  {
    id: "bt-bugis-dessert",
    placeName: "Ah Chew Desserts",
    ownerName: "Mira",
    ownerKind: "friend",
    latitude: 1.30051,
    longitude: 103.85554,
    neighborhood: "Bugis",
    costPerPerson: 6.8,
    currency: "SGD",
    itemsBought: "Mango sago, sesame paste",
    ratingOutOf10: 8.1,
    visitedAt: "2026-04-20",
    comments: "Late-night dessert pin. Best as a shared stop because portions are generous.",
  },
  {
    id: "bt-holland-village-pasta",
    placeName: "Tipo Pasta Bar",
    ownerName: "Benny",
    ownerKind: "you",
    latitude: 1.31113,
    longitude: 103.79589,
    neighborhood: "Holland Village",
    costPerPerson: 22,
    currency: "SGD",
    itemsBought: "Pink sauce pasta, iced tea",
    ratingOutOf10: 8.8,
    visitedAt: "2026-03-09",
    comments: "More expensive than hawker pins, but the handmade pasta made it memorable.",
  },
  {
    id: "bt-jewel-ramen",
    placeName: "Tsuta Jewel",
    ownerName: "Kai",
    ownerKind: "friend",
    latitude: 1.36021,
    longitude: 103.98974,
    neighborhood: "Changi",
    costPerPerson: 19.5,
    currency: "SGD",
    itemsBought: "Shoyu soba",
    ratingOutOf10: 7.8,
    visitedAt: "2026-02-25",
    comments: "Airport meal that does not feel like a fallback. Good before evening flights.",
  },
];
