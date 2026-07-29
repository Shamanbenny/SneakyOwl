import type { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  writeBatch,
  type Firestore,
} from "firebase/firestore";

export const BITE_TRAIL_ADD_ERROR_MESSAGES = {
  ownList: "You cannot add your own BiteTrail list.",
  profileMissing: "This BiteTrail profile does not exist.",
  alreadyFollowing: "This friend is already on your watch list.",
} as const;

export const BITE_TRAIL_CUISINES = [
  "cafe",
  "Chinese",
  "dessert",
  "fast food",
  "hawker",
  "Indian",
  "Japanese",
  "Korean",
  "Malay",
  "Others",
  "seafood",
  "Thai",
  "western",
] as const;

export type BiteTrailCuisineGenre = (typeof BITE_TRAIL_CUISINES)[number];
export type BiteTrailCurrency = "SGD";
export type BiteTrailMapStart = "Singapore" | "Current location";

export type BiteTrailProfile = {
  displayName: string;
  photoURL: string | null;
  updatedAt?: Timestamp;
};

export type BiteTrailPreferences = {
  defaultCurrency: BiteTrailCurrency;
  hasCompletedTutorial: boolean;
  mapStart: BiteTrailMapStart;
  showSneakyOwl: boolean;
};

export type BiteTrailFollowing = {
  ownerUid: string;
  ownerDisplayName: string;
  status: "active";
  createdAt?: Timestamp;
};

export type BiteTrailPlace = {
  cuisineGenre: BiteTrailCuisineGenre;
  createdAt?: Timestamp;
  latitude: number;
  locationLabel: string;
  longitude: number;
  name: string;
  updatedAt?: Timestamp;
};

export type BiteTrailVisit = {
  comments: string;
  costPerPerson: number;
  createdAt?: Timestamp;
  currency: BiteTrailCurrency;
  itemsBought: string;
  ownerDisplayName: string;
  ownerUid: string;
  ratingOutOf10: number;
  visitedAt: string;
};

export type BiteTrailPlaceWithVisits = BiteTrailPlace & {
  id: string;
  visits: Array<BiteTrailVisit & { id: string }>;
};

const DEFAULT_PREFERENCES: BiteTrailPreferences = {
  defaultCurrency: "SGD",
  hasCompletedTutorial: false,
  mapStart: "Singapore",
  showSneakyOwl: true,
};

export const SNEAKY_OWL_UID = "AXOel5MZ8Yelb5a1bHgFcieT80y2";
const hiddenListsStorageKey = (uid: string) =>
  `sneakyowl:bite-trail:hidden-lists:${uid}`;

export const getHiddenBiteTrailOwnerIds = (uid: string) => {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const stored = window.localStorage.getItem(hiddenListsStorageKey(uid));
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (ownerUid): ownerUid is string => typeof ownerUid === "string",
        )
      : [];
  } catch {
    return [] as string[];
  }
};

export const setHiddenBiteTrailOwnerIds = (uid: string, ownerIds: string[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      hiddenListsStorageKey(uid),
      JSON.stringify(Array.from(new Set(ownerIds))),
    );
  } catch {
    // Hiding remains available for the current page when storage is blocked.
  }
};

export const clearHiddenBiteTrailOwnerIds = (uid: string) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(hiddenListsStorageKey(uid));
  } catch {
    // Account deletion should not be blocked if browser storage is unavailable.
  }
};

export const normalizeBiteTrailDisplayName = (
  uid: string,
  name?: string | null,
) => {
  const trimmedName = name?.trim() || "Food explorer";
  return trimmedName === "SneakyOwl" && uid !== SNEAKY_OWL_UID
    ? "NotSneakyOwl"
    : trimmedName;
};

const profileRef = (db: Firestore, uid: string) => doc(db, "users", uid);

const preferencesRef = (db: Firestore, uid: string) =>
  doc(db, "tools", "bite-trail", "users", uid);

const placeRef = (db: Firestore, placeId: string) =>
  doc(db, "tools", "bite-trail", "places", placeId);

export const ensureBiteTrailProfile = async (db: Firestore, user: User) => {
  const reference = profileRef(db, user.uid);
  const existing = await getDoc(reference);
  const displayName = normalizeBiteTrailDisplayName(user.uid, user.displayName);

  if (!existing.exists()) {
    try {
      await setDoc(reference, {
        displayName,
        photoURL: user.photoURL ?? null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      // Multiple authenticated surfaces can initialize the same account at
      // once. If another caller created the profile first, the failed create
      // is safe to ignore; otherwise preserve the original error.
      const profileAfterCreate = await getDoc(reference);
      if (!profileAfterCreate.exists()) {
        throw error;
      }
    }
  }

  const preferences = preferencesRef(db, user.uid);
  const existingPreferences = await getDoc(preferences);
  if (!existingPreferences.exists()) {
    await setDoc(preferences, {
      ...DEFAULT_PREFERENCES,
      hasCompletedTutorial: existing.data()?.hasCompletedTutorial === true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else if (
    existingPreferences.data().defaultCurrency !== "SGD" ||
    typeof existingPreferences.data().hasCompletedTutorial !== "boolean" ||
    typeof existingPreferences.data().showSneakyOwl !== "boolean"
  ) {
    await setDoc(
      preferences,
      {
        defaultCurrency: "SGD",
        hasCompletedTutorial:
          existingPreferences.data().hasCompletedTutorial === true,
        showSneakyOwl: existingPreferences.data().showSneakyOwl !== false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }
};

export const getBiteTrailProfile = async (db: Firestore, uid: string) => {
  const snapshot = await getDoc(profileRef(db, uid));
  return snapshot.exists() ? (snapshot.data() as BiteTrailProfile) : null;
};

export const getBiteTrailPreferences = async (db: Firestore, uid: string) => {
  const snapshot = await getDoc(preferencesRef(db, uid));
  return snapshot.exists()
    ? {
        ...DEFAULT_PREFERENCES,
        ...(snapshot.data() as BiteTrailPreferences),
        defaultCurrency: "SGD" as const,
      }
    : DEFAULT_PREFERENCES;
};

export const saveBiteTrailPreferences = async (
  db: Firestore,
  uid: string,
  preferences: Pick<
    BiteTrailPreferences,
    "defaultCurrency" | "mapStart" | "showSneakyOwl"
  >,
) => {
  await setDoc(
    preferencesRef(db, uid),
    { ...preferences, defaultCurrency: "SGD", updatedAt: serverTimestamp() },
    { merge: true },
  );
};

export const listFollowing = async (db: Firestore, uid: string) => {
  const snapshots = await getDocs(
    collection(db, "tools", "bite-trail", "followings", uid, "relationships"),
  );
  return snapshots.docs.map((snapshot) => {
    const data = snapshot.data() as {
      createdAt?: Timestamp;
      friendDisplayName: string;
      friendUid: string;
    };
    return {
      ownerUid: data.friendUid,
      ownerDisplayName: data.friendDisplayName,
      status: "active",
      createdAt: data.createdAt,
    } satisfies BiteTrailFollowing;
  });
};

export const createPlaceWithVisit = async (
  db: Firestore,
  user: User,
  placeId: string,
  visitId: string,
  place: Omit<BiteTrailPlace, "createdAt" | "updatedAt">,
  visit: Omit<BiteTrailVisit, "createdAt" | "ownerUid" | "ownerDisplayName">,
) => {
  const batch = writeBatch(db);
  const placeReference = placeRef(db, placeId);
  const visitReference = doc(placeReference, "visits", visitId);

  batch.set(placeReference, {
    ...place,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(visitReference, {
    ...visit,
    ownerUid: user.uid,
    ownerDisplayName: normalizeBiteTrailDisplayName(user.uid, user.displayName),
    createdAt: serverTimestamp(),
  });
  await batch.commit();
};

export const appendVisit = async (
  db: Firestore,
  user: User,
  placeId: string,
  visitId: string,
  visit: Omit<BiteTrailVisit, "createdAt" | "ownerUid" | "ownerDisplayName">,
) => {
  await setDoc(doc(placeRef(db, placeId), "visits", visitId), {
    ...visit,
    ownerUid: user.uid,
    ownerDisplayName: normalizeBiteTrailDisplayName(user.uid, user.displayName),
    createdAt: serverTimestamp(),
  });
};

export const getBiteTrailShareLink = (uid: string) => {
  const origin =
    typeof window === "undefined"
      ? "https://sneakyowl.net"
      : window.location.origin;
  return `${origin}/tools/bite-trail/add?uid=${encodeURIComponent(uid)}`;
};
