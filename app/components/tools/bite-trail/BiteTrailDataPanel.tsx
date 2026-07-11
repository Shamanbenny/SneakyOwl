"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { FaPlus, FaTrashCan } from "react-icons/fa6";

import {
  BITE_TRAIL_CUISINES,
  appendVisit,
  createPlaceWithVisit,
  ensureBiteTrailProfile,
  listVisiblePlaces,
  type BiteTrailCuisineGenre,
  type BiteTrailPlaceWithVisits,
} from "@/lib/bite-trail";
import { deleteBiteTrailVisit } from "@/lib/bite-trail-api";
import { getFirebaseClient } from "@/lib/firebase";

const today = () => new Date().toISOString().slice(0, 10);

const BiteTrailDataPanel = () => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [places, setPlaces] = useState<BiteTrailPlaceWithVisits[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    locationLabel: "",
    latitude: "1.3521",
    longitude: "103.8198",
    cuisineGenre: "hawker" as BiteTrailCuisineGenre,
    ratingOutOf10: "8",
    costPerPerson: "",
    itemsBought: "",
    comments: "",
    visitedAt: today(),
  });
  const [appendForm, setAppendForm] = useState({
    placeId: "",
    ratingOutOf10: "8",
    costPerPerson: "",
    itemsBought: "",
    comments: "",
    visitedAt: today(),
  });

  const reload = useCallback(
    async (nextUser: User) => {
      if (!firebaseClient) {
        return;
      }
      setIsLoading(true);
      try {
        setPlaces(await listVisiblePlaces(firebaseClient.db, nextUser));
      } catch {
        setMessage(
          "We could not load your BiteTrail places. Check Firestore Rules and try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [firebaseClient],
  );

  useEffect(() => {
    if (!firebaseClient) {
      return;
    }
    return onAuthStateChanged(firebaseClient.auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setPlaces([]);
        return;
      }
      try {
        await ensureBiteTrailProfile(firebaseClient.db, nextUser);
        await reload(nextUser);
      } catch {
        setMessage("We could not initialise your BiteTrail profile.");
      }
    });
  }, [firebaseClient, reload]);

  const updateForm = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const addPlace = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firebaseClient || !user) {
      setMessage("Sign in before adding a BiteTrail place.");
      return;
    }

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    const ratingOutOf10 = Number(form.ratingOutOf10);
    const costPerPerson = Number(form.costPerPerson);
    if (
      !form.name.trim() ||
      !form.locationLabel.trim() ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      !Number.isInteger(ratingOutOf10) ||
      ratingOutOf10 < 0 ||
      ratingOutOf10 > 10 ||
      !Number.isFinite(costPerPerson) ||
      costPerPerson < 0
    ) {
      setMessage(
        "Enter a place, location, valid coordinates, a whole rating from 0 to 10, and a non-negative cost.",
      );
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      const placeId = crypto.randomUUID();
      await createPlaceWithVisit(
        firebaseClient.db,
        user.uid,
        placeId,
        crypto.randomUUID(),
        {
          name: form.name.trim(),
          locationLabel: form.locationLabel.trim(),
          latitude,
          longitude,
          cuisineGenre: form.cuisineGenre,
        },
        {
          ratingOutOf10,
          costPerPerson,
          currency: "SGD",
          itemsBought: form.itemsBought.trim(),
          comments: form.comments.trim(),
          visitedAt: form.visitedAt,
        },
      );
      setForm((current) => ({
        ...current,
        name: "",
        locationLabel: "",
        costPerPerson: "",
        itemsBought: "",
        comments: "",
      }));
      setMessage("Place and first visit saved.");
      await reload(user);
    } catch {
      setMessage(
        "We could not save that place. Check Firestore Rules and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteVisit = async (placeId: string, visitId: string) => {
    if (!user) {
      return;
    }
    setMessage(null);
    try {
      await deleteBiteTrailVisit(user, placeId, visitId);
      await reload(user);
      setMessage("Visit deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not delete that visit.",
      );
    }
  };

  const addVisit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firebaseClient || !user || !appendForm.placeId) {
      setMessage("Choose one of your places before adding a visit.");
      return;
    }

    const ratingOutOf10 = Number(appendForm.ratingOutOf10);
    const costPerPerson = Number(appendForm.costPerPerson);
    if (
      !Number.isInteger(ratingOutOf10) ||
      ratingOutOf10 < 0 ||
      ratingOutOf10 > 10 ||
      !Number.isFinite(costPerPerson) ||
      costPerPerson < 0
    ) {
      setMessage("Enter a whole rating from 0 to 10 and a non-negative cost.");
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      await appendVisit(
        firebaseClient.db,
        user.uid,
        appendForm.placeId,
        crypto.randomUUID(),
        {
          ratingOutOf10,
          costPerPerson,
          currency: "SGD",
          itemsBought: appendForm.itemsBought.trim(),
          comments: appendForm.comments.trim(),
          visitedAt: appendForm.visitedAt,
        },
      );
      setAppendForm((current) => ({
        ...current,
        ratingOutOf10: "8",
        costPerPerson: "",
        itemsBought: "",
        comments: "",
      }));
      await reload(user);
      setMessage("Visit added.");
    } catch {
      setMessage(
        "We could not add that visit. Check Firestore Rules and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!firebaseClient) {
    return null;
  }

  return (
    <section className="site-surface-card grid gap-6 rounded-[26px] p-5 sm:p-7">
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
          BiteTrail data
        </p>
        <h2 className="mt-2 text-[1.8rem] font-semibold text-[color:var(--site-text-strong)]">
          Save a place and its first visit
        </h2>
        <p className="mt-2 leading-7 text-[color:var(--site-text-muted)]">
          {user
            ? "Your saved places and watched lists are stored in Firestore."
            : "Sign in above to start saving places."}
        </p>
      </div>

      {user ? (
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={addPlace}>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Place name
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-3 text-[color:var(--site-text-strong)]"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Location label
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-3 text-[color:var(--site-text-strong)]"
              placeholder="e.g. Hillion Mall"
              value={form.locationLabel}
              onChange={(event) =>
                updateForm("locationLabel", event.target.value)
              }
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Latitude
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-3 text-[color:var(--site-text-strong)]"
              inputMode="decimal"
              value={form.latitude}
              onChange={(event) => updateForm("latitude", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Longitude
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-3 text-[color:var(--site-text-strong)]"
              inputMode="decimal"
              value={form.longitude}
              onChange={(event) => updateForm("longitude", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Cuisine
            <select
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-3 text-[color:var(--site-text-strong)]"
              value={form.cuisineGenre}
              onChange={(event) =>
                updateForm("cuisineGenre", event.target.value)
              }
            >
              {BITE_TRAIL_CUISINES.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Visited on
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-3 text-[color:var(--site-text-strong)]"
              type="date"
              value={form.visitedAt}
              onChange={(event) => updateForm("visitedAt", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Rating (0–10)
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-3 text-[color:var(--site-text-strong)]"
              inputMode="numeric"
              value={form.ratingOutOf10}
              onChange={(event) =>
                updateForm("ratingOutOf10", event.target.value)
              }
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Cost per person (SGD)
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-3 text-[color:var(--site-text-strong)]"
              inputMode="decimal"
              value={form.costPerPerson}
              onChange={(event) =>
                updateForm("costPerPerson", event.target.value)
              }
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)] lg:col-span-2">
            What did you order?{" "}
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] px-3 text-[color:var(--site-text-strong)]"
              value={form.itemsBought}
              onChange={(event) =>
                updateForm("itemsBought", event.target.value)
              }
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)] lg:col-span-2">
            Comments
            <textarea
              className="min-h-24 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-soft)] p-3 text-[color:var(--site-text-strong)]"
              value={form.comments}
              onChange={(event) => updateForm("comments", event.target.value)}
            />
          </label>
          <button
            className="site-button-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold disabled:opacity-55 lg:col-span-2"
            type="submit"
            disabled={isSaving}
          >
            <FaPlus className="h-4 w-4" aria-hidden="true" />
            {isSaving ? "Saving..." : "Save place and visit"}
          </button>
        </form>
      ) : null}

      {user && places.some((place) => place.ownerUid === user.uid) ? (
        <form
          className="grid gap-4 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4 lg:grid-cols-2"
          onSubmit={addVisit}
        >
          <div className="lg:col-span-2">
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--site-text-muted)]">
              Add another visit
            </p>
          </div>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)] lg:col-span-2">
            Your place
            <select
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 text-[color:var(--site-text-strong)]"
              value={appendForm.placeId}
              onChange={(event) =>
                setAppendForm((current) => ({
                  ...current,
                  placeId: event.target.value,
                }))
              }
            >
              <option value="">Choose a place</option>
              {places
                .filter((place) => place.ownerUid === user.uid)
                .map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name} — {place.locationLabel}
                  </option>
                ))}
            </select>
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Rating (0–10)
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 text-[color:var(--site-text-strong)]"
              inputMode="numeric"
              value={appendForm.ratingOutOf10}
              onChange={(event) =>
                setAppendForm((current) => ({
                  ...current,
                  ratingOutOf10: event.target.value,
                }))
              }
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Cost per person (SGD)
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 text-[color:var(--site-text-strong)]"
              inputMode="decimal"
              value={appendForm.costPerPerson}
              onChange={(event) =>
                setAppendForm((current) => ({
                  ...current,
                  costPerPerson: event.target.value,
                }))
              }
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            Visited on
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 text-[color:var(--site-text-strong)]"
              type="date"
              value={appendForm.visitedAt}
              onChange={(event) =>
                setAppendForm((current) => ({
                  ...current,
                  visitedAt: event.target.value,
                }))
              }
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
            What did you order?
            <input
              className="h-11 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] px-3 text-[color:var(--site-text-strong)]"
              value={appendForm.itemsBought}
              onChange={(event) =>
                setAppendForm((current) => ({
                  ...current,
                  itemsBought: event.target.value,
                }))
              }
            />
          </label>
          <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)] lg:col-span-2">
            Comments
            <textarea
              className="min-h-20 rounded-lg border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-strong)] p-3 text-[color:var(--site-text-strong)]"
              value={appendForm.comments}
              onChange={(event) =>
                setAppendForm((current) => ({
                  ...current,
                  comments: event.target.value,
                }))
              }
            />
          </label>
          <button
            className="site-button-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold disabled:opacity-55 lg:col-span-2"
            type="submit"
            disabled={isSaving}
          >
            <FaPlus className="h-4 w-4" aria-hidden="true" />
            {isSaving ? "Saving..." : "Add visit"}
          </button>
        </form>
      ) : null}

      {message ? (
        <p className="text-[0.84rem] leading-6 text-[color:var(--site-accent-soft)]">
          {message}
        </p>
      ) : null}

      {user ? (
        <div className="grid gap-3">
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--site-text-muted)]">
            Visible saved places{" "}
            {isLoading ? "(loading...)" : `(${places.length})`}
          </p>
          {places.map((place) => (
            <article
              className="rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4"
              key={`${place.ownerUid}-${place.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[color:var(--site-text-strong)]">
                    {place.name}
                  </h3>
                  <p className="mt-1 text-[0.8rem] text-[color:var(--site-text-muted)]">
                    {place.locationLabel} · {place.ownerDisplayName}
                  </p>
                </div>
                <span className="text-[0.78rem] text-[color:var(--site-accent-soft)]">
                  {place.cuisineGenre}
                </span>
              </div>
              {place.visits.map((visit) => (
                <div
                  className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--site-border)] pt-3 text-[0.82rem] text-[color:var(--site-text)]"
                  key={visit.id}
                >
                  <span>
                    {visit.visitedAt} · {visit.ratingOutOf10}/10 · SGD{" "}
                    {visit.costPerPerson.toFixed(2)}
                  </span>
                  {place.ownerUid === user.uid ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-red-300 hover:text-red-200"
                      onClick={() => deleteVisit(place.id, visit.id)}
                    >
                      <FaTrashCan className="h-3.5 w-3.5" aria-hidden="true" />
                      Delete visit
                    </button>
                  ) : null}
                </div>
              ))}
            </article>
          ))}
          {!isLoading && !places.length ? (
            <p className="rounded-xl border border-dashed border-[color:var(--site-border-strong)] p-4 text-[0.84rem] text-[color:var(--site-text-muted)]">
              No places yet. Add your first one above.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default BiteTrailDataPanel;
