import type { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
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
export type BiteTrailCurrency = "SGD" | "USD" | "MYR";
export type BiteTrailMapStart = "Singapore" | "Current location";

export type BiteTrailProfile = {
  displayName: string;
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
    await setDoc(reference, {
      displayName,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else if (existing.data().displayName !== displayName) {
    await setDoc(
      reference,
      { displayName, updatedAt: serverTimestamp() },
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
  }
};

export const getBiteTrailProfile = async (db: Firestore, uid: string) => {
  const snapshot = await getDoc(profileRef(db, uid));
  return snapshot.exists() ? (snapshot.data() as BiteTrailProfile) : null;
};

export const getBiteTrailPreferences = async (db: Firestore, uid: string) => {
  const snapshot = await getDoc(preferencesRef(db, uid));
  return snapshot.exists()
    ? { ...DEFAULT_PREFERENCES, ...(snapshot.data() as BiteTrailPreferences) }
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
    { ...preferences, updatedAt: serverTimestamp() },
    { merge: true },
  );
};

export const createFollowing = async (
  db: Firestore,
  viewer: User,
  ownerUid: string,
) => {
  if (!ownerUid || ownerUid === viewer.uid) {
    throw new Error("You cannot add your own BiteTrail list.");
  }

  const owner = await getBiteTrailProfile(db, ownerUid);
  if (!owner) {
    throw new Error("This BiteTrail profile does not exist.");
  }

  await setDoc(doc(db, "users", viewer.uid, "following", ownerUid), {
    ownerUid,
    ownerDisplayName: owner.displayName || "Food explorer",
    status: "active",
    createdAt: serverTimestamp(),
  });
};

export const removeFollowing = (
  db: Firestore,
  viewerUid: string,
  ownerUid: string,
) => deleteDoc(doc(db, "users", viewerUid, "following", ownerUid));

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
  return `${origin}/tools/bite-trail/join?uid=${encodeURIComponent(uid)}`;
};
