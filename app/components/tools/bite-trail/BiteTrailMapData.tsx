"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import BiteTrailMap from "@/app/components/tools/bite-trail/BiteTrailMap";
import {
  mockFoodPlaces,
  type BiteTrailFoodEntry,
  type BiteTrailPlace,
} from "@/app/components/tools/bite-trail/mockFoodEntries";
import {
  ensureBiteTrailProfile,
  getBiteTrailPreferences,
  getBiteTrailProfile,
  listVisiblePlaces,
  normalizeBiteTrailDisplayName,
  type BiteTrailPlaceWithVisits,
  type BiteTrailMapStart,
} from "@/lib/bite-trail";
import { getFirebaseClient } from "@/lib/firebase";

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
        ownerKind: place.ownerUid === user.uid ? "you" : "friend",
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

const BiteTrailMapData = ({
  latitude,
  longitude,
  onLocationChange,
  onAddEntry,
}: {
  latitude: string;
  longitude: string;
  onLocationChange: (latitude: string, longitude: string) => void;
  onAddEntry: (place: BiteTrailPlace) => void;
}) => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [currentUserName, setCurrentUserName] = useState("You");
  const [mapStart, setMapStart] = useState<BiteTrailMapStart>("Singapore");
  const [firestorePlaces, setFirestorePlaces] = useState<BiteTrailPlace[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const mapPlaces = useMemo(
    () => [...firestorePlaces, ...mockFoodPlaces],
    [firestorePlaces],
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
        setFirestorePlaces(toMapPlaces(visiblePlaces, nextUser, name));
      } catch {
        setMapStart("Singapore");
        setFirestorePlaces([]);
      } finally {
        setIsAuthReady(true);
      }
    });
  }, [firebaseClient]);

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
      currentUserName={user ? currentUserName : "You"}
      mapStart={mapStart}
      draftLatitude={latitude}
      draftLongitude={longitude}
      onDraftLocationChange={onLocationChange}
      onAddEntry={onAddEntry}
    />
  );
};

export default BiteTrailMapData;
