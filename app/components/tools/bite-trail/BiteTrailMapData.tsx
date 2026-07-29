"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import BiteTrailMap from "@/app/components/tools/bite-trail/BiteTrailMap";
import type { BiteTrailSavedEntry } from "@/app/components/tools/bite-trail/BiteTrailDataPanel";
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
  listFollowing,
  normalizeBiteTrailDisplayName,
  SNEAKY_OWL_UID,
  type BiteTrailPlaceWithVisits,
  type BiteTrailMapStart,
} from "@/lib/bite-trail";
import {
  deleteBiteTrailVisit,
  getVisibleBiteTrailPlaces,
} from "@/lib/bite-trail-api";
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
          : viewerUid && visit.ownerUid === viewerUid
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
        visits: [...place.visits],
      });
      return;
    }

    const visitsById = new Map(
      [...existingPlace.visits, ...place.visits].map((visit) => [
        visit.id,
        visit,
      ]),
    );
    const visits = Array.from(visitsById.values());
    mergedPlaces.set(placeKey, {
      ...place,
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

const BITE_TRAIL_SNAPSHOT_URL =
  process.env.NEXT_PUBLIC_BITE_TRAIL_SNAPSHOT_URL ||
  "https://raw.githubusercontent.com/Shamanbenny/SneakyOwl/output/bite-trail.json";

const toMapPlaces = (places: BiteTrailPlaceWithVisits[]): BiteTrailPlace[] =>
  places.map((place) => ({
    averageCost:
      place.visits.reduce((total, visit) => total + visit.costPerPerson, 0) /
      (place.visits.length || 1),
    averageRating:
      place.visits.reduce((total, visit) => total + visit.ratingOutOf10, 0) /
      (place.visits.length || 1),
    cuisineGenre: place.cuisineGenre,
    currency: place.visits[0]?.currency ?? "SGD",
    id: place.id,
    latitude: place.latitude,
    longitude: place.longitude,
    neighborhood: place.locationLabel,
    placeName: place.name,
    sourcePlaceId: place.id,
    visits: place.visits.map(
      (visit): BiteTrailFoodEntry => ({
        comments: visit.comments,
        costPerPerson: visit.costPerPerson,
        currency: visit.currency,
        cuisineGenre: place.cuisineGenre,
        id: visit.id,
        itemsBought: visit.itemsBought,
        latitude: place.latitude,
        longitude: place.longitude,
        neighborhood: place.locationLabel,
        ownerKind: "",
        ownerName: visit.ownerDisplayName,
        ownerUid: visit.ownerUid,
        placeId: place.id,
        placeName: place.name,
        ratingOutOf10: visit.ratingOutOf10,
        visitedAt: visit.visitedAt,
      }),
    ),
  }));

const getMockPlacesForViewer = (isFollowingSneakyOwl: boolean) => {
  if (!isFollowingSneakyOwl) {
    return mockFoodPlaces;
  }

  return mockFoodPlaces
    .map((place) => ({
      ...place,
      visits: place.visits.filter((visit) => visit.ownerKind !== ""),
    }))
    .filter((place) => place.visits.length > 0);
};

const BiteTrailMapData = ({
  latitude,
  longitude,
  hasActiveEntry,
  onLocationChange,
  onRequestClearDraft,
  onRequestStartNewLocation,
  startLocationPickerRequest,
  onAddEntry,
  savedEntry,
}: {
  latitude: string;
  longitude: string;
  hasActiveEntry: boolean;
  onLocationChange: (latitude: string, longitude: string) => void;
  onRequestClearDraft: () => void;
  onRequestStartNewLocation: () => void;
  startLocationPickerRequest: number;
  onAddEntry: (place: BiteTrailResolvedPlace) => void;
  savedEntry: BiteTrailSavedEntry | null;
}) => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [currentUserName, setCurrentUserName] = useState("You");
  const [isFollowingSneakyOwl, setIsFollowingSneakyOwl] = useState(false);
  const [mapStart, setMapStart] = useState<BiteTrailMapStart>("Singapore");
  const [staticPlaces, setStaticPlaces] = useState<BiteTrailPlace[]>([]);
  const [firestorePlaces, setFirestorePlaces] = useState<BiteTrailPlace[]>([]);
  const [isStaticReady, setIsStaticReady] = useState(false);
  const { notify } = useNotifications();
  const visibleStaticPlaces = useMemo(() => {
    if (!user) return staticPlaces;

    const hiddenOwnerIds = new Set(getHiddenBiteTrailOwnerIds(user.uid));
    return staticPlaces
      .map((place) => ({
        ...place,
        visits: place.visits.filter(
          (visit) =>
            visit.ownerUid === user.uid ||
            !visit.ownerUid ||
            !hiddenOwnerIds.has(visit.ownerUid),
        ),
      }))
      .filter((place) => place.visits.length > 0);
  }, [staticPlaces, user]);
  const mapPlaces = useMemo<BiteTrailResolvedPlace[]>(
    () =>
      resolveMapOwnerKinds(
        mergeMapPlaces([
          ...visibleStaticPlaces,
          ...firestorePlaces,
          ...getMockPlacesForViewer(isFollowingSneakyOwl),
        ]),
        user?.uid ?? null,
      ),
    [firestorePlaces, isFollowingSneakyOwl, user, visibleStaticPlaces],
  );

  useEffect(() => {
    let cancelled = false;

    const loadStaticSnapshot = async () => {
      try {
        const response = await fetch(BITE_TRAIL_SNAPSHOT_URL, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Snapshot unavailable");

        const payload = (await response.json()) as {
          places?: BiteTrailPlaceWithVisits[];
        };
        if (!Array.isArray(payload.places)) throw new Error("Invalid snapshot");

        if (!cancelled) setStaticPlaces(toMapPlaces(payload.places));
      } catch {
        if (!cancelled) setStaticPlaces([]);
      } finally {
        if (!cancelled) setIsStaticReady(true);
      }
    };

    void loadStaticSnapshot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!firebaseClient) {
      return;
    }

    return onAuthStateChanged(firebaseClient.auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setCurrentUserName("You");
        setMapStart("Singapore");
        setFirestorePlaces([]);
        setIsFollowingSneakyOwl(false);
        return;
      }

      notify("We’re fetching your latest BiteTrail data.", "info");
      try {
        await withFirebaseSessionRetries(nextUser, async () => {
          await revalidateFirebaseSession(nextUser);
          await ensureBiteTrailProfile(firebaseClient.db, nextUser);
          const [profile, following, visiblePlaces] = await Promise.all([
            getBiteTrailProfile(firebaseClient.db, nextUser.uid),
            listFollowing(firebaseClient.db, nextUser.uid),
            getVisibleBiteTrailPlaces(nextUser),
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
          setIsFollowingSneakyOwl(
            following.some((friend) => friend.ownerUid === SNEAKY_OWL_UID),
          );
          setMapStart(preferences.mapStart);
          const hiddenOwnerIds = new Set(
            getHiddenBiteTrailOwnerIds(nextUser.uid),
          );
          setFirestorePlaces(
            toMapPlaces(visiblePlaces)
              .map((place) => ({
                ...place,
                visits: place.visits.filter(
                  (visit) =>
                    visit.ownerUid === nextUser.uid ||
                    !visit.ownerUid ||
                    !hiddenOwnerIds.has(visit.ownerUid),
                ),
              }))
              .filter((place) => place.visits.length > 0),
          );
          notify("Your BiteTrail data has been updated on the map.");
        });
      } catch {
        setUser(null);
        setCurrentUserName("You");
        setMapStart("Singapore");
        setFirestorePlaces([]);
        setIsFollowingSneakyOwl(false);
      }
    });
  }, [firebaseClient, notify]);

  useEffect(() => {
    if (!savedEntry || !user) return;

    setFirestorePlaces((currentPlaces) => {
      if (savedEntry.place) {
        if (
          currentPlaces.some(
            (currentPlace) =>
              (currentPlace.sourcePlaceId ?? currentPlace.id) ===
              savedEntry.placeId,
          )
        ) {
          return currentPlaces;
        }

        const place: BiteTrailPlace = {
          averageCost: savedEntry.visit.costPerPerson,
          averageRating: savedEntry.visit.ratingOutOf10,
          cuisineGenre: savedEntry.place.cuisineGenre,
          currency: savedEntry.visit.currency,
          id: savedEntry.placeId,
          latitude: savedEntry.place.latitude,
          longitude: savedEntry.place.longitude,
          neighborhood: savedEntry.place.locationLabel,
          placeName: savedEntry.place.name,
          sourcePlaceId: savedEntry.placeId,
          visits: [],
        };
        place.visits.push({
          comments: savedEntry.visit.comments,
          costPerPerson: savedEntry.visit.costPerPerson,
          currency: savedEntry.visit.currency,
          cuisineGenre: place.cuisineGenre,
          id: savedEntry.visitId,
          itemsBought: savedEntry.visit.itemsBought,
          latitude: place.latitude,
          longitude: place.longitude,
          neighborhood: place.neighborhood,
          ownerKind: "",
          ownerName: currentUserName,
          ownerUid: user.uid,
          placeId: savedEntry.placeId,
          placeName: place.placeName,
          ratingOutOf10: savedEntry.visit.ratingOutOf10,
          visitedAt: savedEntry.visit.visitedAt,
        });
        return [...currentPlaces, place];
      }

      return currentPlaces.map((place) => {
        if (place.sourcePlaceId !== savedEntry.placeId) return place;
        if (place.visits.some((visit) => visit.id === savedEntry.visitId)) {
          return place;
        }

        const visit: BiteTrailFoodEntry = {
          comments: savedEntry.visit.comments,
          costPerPerson: savedEntry.visit.costPerPerson,
          currency: savedEntry.visit.currency,
          cuisineGenre: place.cuisineGenre,
          id: savedEntry.visitId,
          itemsBought: savedEntry.visit.itemsBought,
          latitude: place.latitude,
          longitude: place.longitude,
          neighborhood: place.neighborhood,
          ownerKind: "",
          ownerName: currentUserName,
          ownerUid: user.uid,
          placeId: savedEntry.placeId,
          placeName: place.placeName,
          ratingOutOf10: savedEntry.visit.ratingOutOf10,
          visitedAt: savedEntry.visit.visitedAt,
        };
        return { ...place, visits: [...place.visits, visit] };
      });
    });
  }, [currentUserName, savedEntry, user]);

  if (!isStaticReady) {
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
      hasActiveEntry={hasActiveEntry}
      onDraftLocationChange={onLocationChange}
      onRequestClearDraft={onRequestClearDraft}
      onRequestStartNewLocation={onRequestStartNewLocation}
      startLocationPickerRequest={startLocationPickerRequest}
      onAddEntry={onAddEntry}
      isAuthenticated={Boolean(user)}
      onDeleteVisit={async (place, visit) => {
        if (!user || visit.ownerUid !== user.uid || !place.sourcePlaceId) {
          return;
        }

        const visitId = visit.id.split(":").at(-1);
        if (!visitId) return;

        notify("Deleting entry...", "info");
        try {
          await deleteBiteTrailVisit(user, place.sourcePlaceId, visitId);
          notify("Your visit was deleted.");
          setFirestorePlaces((currentPlaces) =>
            currentPlaces
              .map((currentPlace) =>
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
