import type { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
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
  hasCompletedTutorial: boolean;
  photoURL: string | null;
  updatedAt?: Timestamp;
};

export type BiteTrailPreferences = {
  defaultCurrency: BiteTrailCurrency;
  mapStart: BiteTrailMapStart;
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
  ownerUid: string;
  ratingOutOf10: number;
  visitedAt: string;
};

export type BiteTrailPlaceWithVisits = BiteTrailPlace & {
  id: string;
  ownerDisplayName: string;
  ownerUid: string;
  visits: Array<BiteTrailVisit & { id: string }>;
};

const DEFAULT_PREFERENCES: BiteTrailPreferences = {
  defaultCurrency: "SGD",
  mapStart: "Singapore",
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
      ? parsed.filter((ownerUid): ownerUid is string => typeof ownerUid === "string")
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
  doc(db, "users", uid, "preferences", "bite-trail");

export const ensureBiteTrailProfile = async (db: Firestore, user: User) => {
  const reference = profileRef(db, user.uid);
  const existing = await getDoc(reference);
  const displayName = normalizeBiteTrailDisplayName(user.uid, user.displayName);

  if (!existing.exists()) {
    try {
      await setDoc(reference, {
        displayName,
        hasCompletedTutorial: false,
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
  } else if (
    existing.data().displayName !== displayName ||
    typeof existing.data().hasCompletedTutorial !== "boolean"
  ) {
    await setDoc(
      reference,
      {
        displayName,
        hasCompletedTutorial:
          typeof existing.data().hasCompletedTutorial === "boolean"
            ? existing.data().hasCompletedTutorial
            : false,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  const preferences = preferencesRef(db, user.uid);
  const existingPreferences = await getDoc(preferences);
  if (!existingPreferences.exists()) {
    await setDoc(preferences, {
      ...DEFAULT_PREFERENCES,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else if (existingPreferences.data().defaultCurrency !== "SGD") {
    await setDoc(
      preferences,
      { defaultCurrency: "SGD", updatedAt: serverTimestamp() },
      { merge: true },
    );
  }
};

export const getBiteTrailProfile = async (db: Firestore, uid: string) => {
  const snapshot = await getDoc(profileRef(db, uid));
  return snapshot.exists()
    ? {
        ...(snapshot.data() as BiteTrailProfile),
        hasCompletedTutorial:
          snapshot.data().hasCompletedTutorial === true,
      }
    : null;
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

export const saveBiteTrailProfile = async (
  db: Firestore,
  uid: string,
  profile: Pick<BiteTrailProfile, "displayName" | "photoURL">,
) => {
  await setDoc(
    profileRef(db, uid),
    {
      ...profile,
      displayName: normalizeBiteTrailDisplayName(uid, profile.displayName),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const saveBiteTrailPreferences = async (
  db: Firestore,
  uid: string,
  preferences: BiteTrailPreferences,
) => {
  await setDoc(
    preferencesRef(db, uid),
    { ...preferences, defaultCurrency: "SGD", updatedAt: serverTimestamp() },
    { merge: true },
  );
};

export const createFollowing = async (
  db: Firestore,
  viewer: User,
  ownerUid: string,
) => {
  if (!ownerUid || ownerUid === viewer.uid) {
    throw new Error(BITE_TRAIL_ADD_ERROR_MESSAGES.ownList);
  }

  const [viewerProfile, ownerProfile] = await Promise.all([
    getBiteTrailProfile(db, viewer.uid),
    getBiteTrailProfile(db, ownerUid),
  ]);
  if (!ownerProfile) {
    throw new Error(BITE_TRAIL_ADD_ERROR_MESSAGES.profileMissing);
  }

  const viewerDisplayName = normalizeBiteTrailDisplayName(
    viewer.uid,
    viewerProfile?.displayName || viewer.displayName,
  );
  const ownerDisplayName = normalizeBiteTrailDisplayName(
    ownerUid,
    ownerProfile.displayName,
  );
  const viewerFollowingReference = doc(
    db,
    "users",
    viewer.uid,
    "following",
    ownerUid,
  );
  const viewerAlreadyFollowsOwner = await getDoc(viewerFollowingReference);
  if (viewerAlreadyFollowsOwner.exists()) {
    throw new Error(BITE_TRAIL_ADD_ERROR_MESSAGES.alreadyFollowing);
  }

  const batch = writeBatch(db);

  batch.set(viewerFollowingReference, {
    ownerUid,
    ownerDisplayName,
    status: "active",
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db, "users", ownerUid, "following", viewer.uid), {
    ownerUid: viewer.uid,
    ownerDisplayName: viewerDisplayName,
    status: "active",
    createdAt: serverTimestamp(),
  });

  await batch.commit();
};

export const removeFollowing = async (
  db: Firestore,
  viewerUid: string,
  ownerUid: string,
) => {
  const batch = writeBatch(db);

  batch.delete(doc(db, "users", viewerUid, "following", ownerUid));
  batch.delete(doc(db, "users", ownerUid, "following", viewerUid));

  await batch.commit();
};

export const listFollowing = async (db: Firestore, uid: string) => {
  const snapshots = await getDocs(collection(db, "users", uid, "following"));
  return snapshots.docs.map(
    (snapshot) => snapshot.data() as BiteTrailFollowing,
  );
};

export const createPlaceWithVisit = async (
  db: Firestore,
  uid: string,
  placeId: string,
  visitId: string,
  place: Omit<BiteTrailPlace, "createdAt" | "updatedAt">,
  visit: Omit<BiteTrailVisit, "createdAt" | "ownerUid">,
) => {
  const batch = writeBatch(db);
  const placeReference = doc(db, "users", uid, "places", placeId);
  const visitReference = doc(placeReference, "visits", visitId);

  batch.set(placeReference, {
    ...place,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(visitReference, {
    ...visit,
    ownerUid: uid,
    createdAt: serverTimestamp(),
  });
  await batch.commit();
};

export const appendVisit = async (
  db: Firestore,
  uid: string,
  placeId: string,
  visitId: string,
  visit: Omit<BiteTrailVisit, "createdAt" | "ownerUid">,
) => {
  await setDoc(doc(db, "users", uid, "places", placeId, "visits", visitId), {
    ...visit,
    ownerUid: uid,
    createdAt: serverTimestamp(),
  });
};

const listPlacesForOwner = async (
  db: Firestore,
  ownerUid: string,
  ownerDisplayName: string,
) => {
  const places = await getDocs(collection(db, "users", ownerUid, "places"));
  return Promise.all(
    places.docs.map(async (placeSnapshot) => {
      const visits = await getDocs(
        query(
          collection(placeSnapshot.ref, "visits"),
          orderBy("visitedAt", "desc"),
          limit(100),
        ),
      );
      return {
        ...(placeSnapshot.data() as BiteTrailPlace),
        id: placeSnapshot.id,
        ownerDisplayName,
        ownerUid,
        visits: visits.docs.map((visitSnapshot) => ({
          ...(visitSnapshot.data() as BiteTrailVisit),
          id: visitSnapshot.id,
        })),
      } satisfies BiteTrailPlaceWithVisits;
    }),
  );
};

export const listVisiblePlaces = async (db: Firestore, user: User) => {
  const [profile, following] = await Promise.all([
    getBiteTrailProfile(db, user.uid),
    listFollowing(db, user.uid),
  ]);
  const ownName = normalizeBiteTrailDisplayName(
    user.uid,
    profile?.displayName || user.displayName,
  );
  const ownerLists = [
    listPlacesForOwner(db, user.uid, ownName),
    ...following.map((friend) =>
      listPlacesForOwner(db, friend.ownerUid, friend.ownerDisplayName),
    ),
  ];
  return (await Promise.all(ownerLists)).flat();
};

export const getBiteTrailShareLink = (uid: string) => {
  const origin =
    typeof window === "undefined"
      ? "https://sneakyowl.net"
      : window.location.origin;
  return `${origin}/tools/bite-trail/add?uid=${encodeURIComponent(uid)}`;
};
