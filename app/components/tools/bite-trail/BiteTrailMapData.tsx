"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import BiteTrailMap from "@/app/components/tools/bite-trail/BiteTrailMap";
import { useNotifications } from "@/app/components/shared/feedback/NotificationProvider";
import {
  mockFoodPlaces,
  type BiteTrailFoodEntry,
  type BiteTrailPlace,
  type BiteTrailResolvedPlace,
} from "@/app/components/tools/bite-trail/mockFoodEntries";
import {
  ensureBiteTrailProfile,
  getHiddenBiteTrailOwnerIds,
  getBiteTrailPreferences,
  getBiteTrailProfile,
  listVisiblePlaces,
  normalizeBiteTrailDisplayName,
  SNEAKY_OWL_UID,
  type BiteTrailPlaceWithVisits,
  type BiteTrailMapStart,
} from "@/lib/bite-trail";
import { deleteBiteTrailVisit } from "@/lib/bite-trail-api";
import {
  revalidateFirebaseSession,
  withFirebaseSessionRetries,
} from "@/lib/firebase-auth";
import { getFirebaseClient } from "@/lib/firebase";

const resolveMapOwnerKinds = (
  places: BiteTrailPlace[],
  viewerUid: string | null,
): BiteTrailResolvedPlace[] =>
  places.map((place) => ({
    ...place,
    visits: place.visits.map((visit) => ({
      ...visit,
      ownerKind:
        visit.ownerKind === "advertisement"
          ? "advertisement"
          : viewerUid && place.ownerUid === viewerUid
            ? "you"
            : "friend",
    })),
  }));

const mergeMapPlaces = (places: BiteTrailPlace[]) => {
  const mergedPlaces = new Map<string, BiteTrailPlace>();

  places.forEach((place) => {
    const placeKey = place.sourcePlaceId ?? place.id;
    const existingPlace = mergedPlaces.get(placeKey);
    if (!existingPlace) {
      mergedPlaces.set(placeKey, {
        ...place,
        visits: Array.from(new Set(place.visits)),
      });
      return;
    }

    const visits = Array.from(
      new Set([...existingPlace.visits, ...place.visits]),
    );
    mergedPlaces.set(placeKey, {
      ...existingPlace,
      visits,
      averageCost:
        visits.reduce((total, visit) => total + visit.costPerPerson, 0) /
        (visits.length || 1),
      averageRating:
        visits.reduce((total, visit) => total + visit.ratingOutOf10, 0) /
        (visits.length || 1),
    });
  });

  return Array.from(mergedPlaces.values());
};

const toMapPlaces = (
  places: BiteTrailPlaceWithVisits[],
  user: User,
  currentUserName: string,
): BiteTrailPlace[] =>
  places.map((place) => ({
    averageCost:
      place.visits.reduce((total, visit) => total + visit.costPerPerson, 0) /
      (place.visits.length || 1),
    averageRating:
      place.visits.reduce((total, visit) => total + visit.ratingOutOf10, 0) /
      (place.visits.length || 1),
    cuisineGenre: place.cuisineGenre,
    currency: place.visits[0]?.currency ?? "SGD",
    id: `${place.ownerUid}:${place.id}`,
    latitude: place.latitude,
    longitude: place.longitude,
    neighborhood: place.locationLabel,
    placeName: place.name,
    ownerUid: place.ownerUid,
    sourcePlaceId: place.id,
    visits: place.visits.map(
      (visit): BiteTrailFoodEntry => ({
        comments: visit.comments,
        costPerPerson: visit.costPerPerson,
        currency: visit.currency,
        cuisineGenre: place.cuisineGenre,
        id: `${place.ownerUid}:${visit.id}`,
        itemsBought: visit.itemsBought,
        latitude: place.latitude,
        longitude: place.longitude,
        neighborhood: place.locationLabel,
        ownerKind: "",
        ownerName:
          place.ownerUid === user.uid
            ? currentUserName
            : place.ownerDisplayName,
        placeId: `${place.ownerUid}:${place.id}`,
        placeName: place.name,
        ratingOutOf10: visit.ratingOutOf10,
        visitedAt: visit.visitedAt,
      }),
    ),
  }));

const getMockPlacesForViewer = (viewerUid: string | null) => {
  if (viewerUid !== SNEAKY_OWL_UID) {
    return mockFoodPlaces;
  }

  return mockFoodPlaces
    .map((place) => ({
      ...place,
      visits: place.visits.filter((visit) => visit.ownerKind === "advertisement"),
    }))
    .filter((place) => place.visits.length > 0);
};

const BiteTrailMapData = ({
  latitude,
  longitude,
  onLocationChange,
  onAddEntry,
  refreshKey,
}: {
  latitude: string;
  longitude: string;
  onLocationChange: (latitude: string, longitude: string) => void;
  onAddEntry: (place: BiteTrailResolvedPlace) => void;
  refreshKey: number;
}) => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [currentUserName, setCurrentUserName] = useState("You");
  const [mapStart, setMapStart] = useState<BiteTrailMapStart>("Singapore");
  const [firestorePlaces, setFirestorePlaces] = useState<BiteTrailPlace[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { notify } = useNotifications();
  const mapPlaces = useMemo<BiteTrailResolvedPlace[]>(
    () =>
      resolveMapOwnerKinds(
        mergeMapPlaces([
          ...firestorePlaces,
          ...getMockPlacesForViewer(user?.uid ?? null),
        ]),
        user?.uid ?? null,
      ),
    [firestorePlaces, user],
  );

  useEffect(() => {
    if (!firebaseClient) {
      setIsAuthReady(true);
      return;
    }

    return onAuthStateChanged(firebaseClient.auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setCurrentUserName("You");
        setMapStart("Singapore");
        setFirestorePlaces([]);
        setIsAuthReady(true);
        return;
      }

      try {
        await withFirebaseSessionRetries(nextUser, async () => {
          await revalidateFirebaseSession(nextUser);
          await ensureBiteTrailProfile(firebaseClient.db, nextUser);
          const [profile, visiblePlaces] = await Promise.all([
            getBiteTrailProfile(firebaseClient.db, nextUser.uid),
            listVisiblePlaces(firebaseClient.db, nextUser),
          ]);
          const preferences = await getBiteTrailPreferences(
            firebaseClient.db,
            nextUser.uid,
          );
          const name = normalizeBiteTrailDisplayName(
            nextUser.uid,
            profile?.displayName || nextUser.displayName,
          );
          setCurrentUserName(name);
          setMapStart(preferences.mapStart);
          const hiddenOwnerIds = new Set(
            getHiddenBiteTrailOwnerIds(nextUser.uid),
          );
          setFirestorePlaces(
            toMapPlaces(visiblePlaces, nextUser, name).filter(
              (place) =>
                place.ownerUid === nextUser.uid ||
                !place.ownerUid ||
                !hiddenOwnerIds.has(place.ownerUid),
            ),
          );
        });
      } catch {
        setUser(null);
        setCurrentUserName("You");
        setMapStart("Singapore");
        setFirestorePlaces([]);
      } finally {
        setIsAuthReady(true);
      }
    });
  }, [firebaseClient, refreshKey]);

  if (!isAuthReady) {
    return (
      <section className="site-surface-card flex h-[420px] items-center justify-center rounded-[26px] text-[0.84rem] text-[color:var(--site-text-muted)] sm:h-[500px] xl:h-[620px]">
        Loading BiteTrail entries...
      </section>
    );
  }

  return (
    <BiteTrailMap
      places={mapPlaces}
      mapStart={mapStart}
      draftLatitude={latitude}
      draftLongitude={longitude}
      onDraftLocationChange={onLocationChange}
      onAddEntry={onAddEntry}
      isAuthenticated={Boolean(user)}
      onDeleteVisit={async (place, visit) => {
        if (!user || place.ownerUid !== user.uid || !place.sourcePlaceId) {
          return;
        }

        const visitId = visit.id.split(":").at(-1);
        if (!visitId) return;

        try {
          await deleteBiteTrailVisit(user, place.sourcePlaceId, visitId);
          notify("Your visit was deleted.");
          setFirestorePlaces((currentPlaces) =>
            currentPlaces
              .map((currentPlace) =>
                currentPlace.ownerUid === user.uid &&
                currentPlace.sourcePlaceId === place.sourcePlaceId
                  ? {
                      ...currentPlace,
                      visits: currentPlace.visits.filter(
                        (currentVisit) => currentVisit.id !== visitId,
                      ),
                    }
                  : currentPlace,
              )
              .filter((currentPlace) => currentPlace.visits.length > 0),
          );
        } catch (error) {
          notify(
            error instanceof Error
              ? error.message
              : "We could not delete your visit.",
            "error",
          );
        }
      }}
    />
  );
};

export default BiteTrailMapData;
