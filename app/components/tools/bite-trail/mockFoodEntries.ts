import type {
  BiteTrailCurrency,
  BiteTrailCuisineGenre,
} from "@/lib/bite-trail";

export type { BiteTrailCuisineGenre } from "@/lib/bite-trail";

export type BiteTrailOwnerKind = "" | "advertisement";
export type BiteTrailResolvedOwnerKind = "you" | "friend" | "advertisement";
export type BiteTrailFoodEntry = {
  comments: string;
  costPerPerson: number;
  currency: BiteTrailCurrency;
  cuisineGenre: BiteTrailCuisineGenre;
  id: string;
  itemsBought?: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  ownerKind: BiteTrailOwnerKind;
  ownerName: string;
  ownerUid?: string;
  placeName: string;
  placeId?: string;
  ratingOutOf10: number;
  visitedAt: string;
};

export type BiteTrailPlace = {
  averageCost: number;
  averageRating: number;
  cuisineGenre: BiteTrailCuisineGenre;
  currency: BiteTrailCurrency;
  id: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  placeName: string;
  visits: BiteTrailFoodEntry[];
  ownerUid?: string;
  sourcePlaceId?: string;
};

export type BiteTrailResolvedFoodEntry = Omit<
  BiteTrailFoodEntry,
  "ownerKind"
> & {
  ownerKind: BiteTrailResolvedOwnerKind;
};

export type BiteTrailResolvedPlace = Omit<BiteTrailPlace, "visits"> & {
  visits: BiteTrailResolvedFoodEntry[];
};

// These are the globally available SneakyOwl and sponsored sample visits.
// Keep the place ID shared by the first pair to exercise advertisement priority.
export const mockFoodEntries: BiteTrailFoodEntry[] = [
];

const getPlaceId = (entry: BiteTrailFoodEntry) => entry.placeId ?? entry.id;

export const mockFoodPlaces: BiteTrailPlace[] = Array.from(
  mockFoodEntries.reduce((groups, entry) => {
    const placeId = getPlaceId(entry);
    const visits = groups.get(placeId) ?? [];
    visits.push(entry);
    groups.set(placeId, visits);
    return groups;
  }, new Map<string, BiteTrailFoodEntry[]>()),
).map(([id, visits]) => {
  const firstVisit = visits[0];
  return {
    averageCost:
      visits.reduce((total, visit) => total + visit.costPerPerson, 0) /
      visits.length,
    averageRating:
      visits.reduce((total, visit) => total + visit.ratingOutOf10, 0) /
      visits.length,
    cuisineGenre: firstVisit.cuisineGenre,
    currency: firstVisit.currency,
    id,
    latitude: firstVisit.latitude,
    longitude: firstVisit.longitude,
    neighborhood: firstVisit.neighborhood,
    placeName: firstVisit.placeName,
    visits,
  };
});
