"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDays,
  FaPlus,
  FaTrashCan,
} from "react-icons/fa6";

import InfoTooltip from "@/app/components/shared/feedback/InfoTooltip";
import {
  BITE_TRAIL_CUISINES,
  appendVisit,
  createPlaceWithVisit,
  ensureBiteTrailProfile,
  type BiteTrailCuisineGenre,
} from "@/lib/bite-trail";
import type { BiteTrailResolvedPlace } from "@/app/components/tools/bite-trail/mockFoodEntries";
import { getFirebaseClient } from "@/lib/firebase";

const today = () => new Date().toISOString().slice(0, 10);
const inputClassName =
  "bite-trail-input h-11 px-3 placeholder:text-[color:var(--site-text-faint)] disabled:cursor-not-allowed disabled:opacity-60";
const textAreaClassName =
  "bite-trail-input min-h-24 p-3 placeholder:text-[color:var(--site-text-faint)]";

const formatCuisineLabel = (cuisine: BiteTrailCuisineGenre) =>
  cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
const formatDateLabel = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString("en-SG", { month: "long", year: "numeric" });
const getCalendarDays = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  return [
    ...Array.from({ length: firstDay.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
};

type VisitForm = {
  name: string;
  locationLabel: string;
  cuisineGenre: BiteTrailCuisineGenre;
  ratingOutOf10: string;
  costPerPerson: string;
  itemsBought: string;
  comments: string;
  visitedAt: string;
};

const emptyForm = (): VisitForm => ({
  name: "",
  locationLabel: "",
  cuisineGenre: "hawker",
  ratingOutOf10: "8",
  costPerPerson: "",
  itemsBought: "",
  comments: "",
  visitedAt: today(),
});

const BiteTrailDataPanel = ({
  latitude,
  longitude,
  activePlace,
  onLocationChange,
  onDiscard,
  onSaved,
}: {
  latitude: string;
  longitude: string;
  activePlace: BiteTrailResolvedPlace | null;
  onLocationChange: (latitude: string, longitude: string) => void;
  onDiscard: () => void;
  onSaved?: () => void;
}) => {
  const firebaseClient = useMemo(() => getFirebaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<VisitForm>(emptyForm);
  const [openMenu, setOpenMenu] = useState<"cuisine" | "date" | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const controlRef = useRef<HTMLFormElement>(null);
  const isNewPlace = !activePlace && Boolean(latitude && longitude);
  const isAdding = isNewPlace || Boolean(activePlace);
  const formLatitude = activePlace ? activePlace.latitude.toFixed(6) : latitude;
  const formLongitude = activePlace
    ? activePlace.longitude.toFixed(6)
    : longitude;
  const calendarDays = getCalendarDays(calendarMonth);
  const selectedDate = new Date(`${form.visitedAt}T00:00:00`);
  const resetFormState = useCallback(() => {
    setForm(emptyForm());
    setMessage(null);
    setOpenMenu(null);
    setCalendarMonth(new Date());
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const closeMenuOnOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !controlRef.current?.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("pointerdown", closeMenuOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeMenuOnOutsideClick);
  }, [openMenu]);

  useEffect(() => {
    if (!activePlace) {
      if (!latitude && !longitude) {
        resetFormState();
      }
      return;
    }
    setForm({
      ...emptyForm(),
      name: activePlace.placeName,
      locationLabel: activePlace.neighborhood,
      cuisineGenre: activePlace.cuisineGenre,
    });
  }, [activePlace, latitude, longitude, resetFormState]);

  useEffect(() => {
    if (!firebaseClient) return;
    return onAuthStateChanged(firebaseClient.auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          await ensureBiteTrailProfile(firebaseClient.db, nextUser);
        } catch {
          setMessage("We could not initialise your BiteTrail profile.");
        }
      }
    });
  }, [firebaseClient]);

  const updateForm = (field: keyof VisitForm, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firebaseClient || !user) {
      setMessage("Sign in before adding a BiteTrail entry.");
      return;
    }

    const ratingOutOf10 = Number(form.ratingOutOf10);
    const costPerPerson = Number(form.costPerPerson);
    const parsedLatitude = Number(formLatitude);
    const parsedLongitude = Number(formLongitude);
    const validVisit =
      Number.isInteger(ratingOutOf10) &&
      ratingOutOf10 >= 0 &&
      ratingOutOf10 <= 10 &&
      Number.isFinite(costPerPerson) &&
      costPerPerson >= 0;
    const validLocation =
      Number.isFinite(parsedLatitude) &&
      parsedLatitude >= -90 &&
      parsedLatitude <= 90 &&
      Number.isFinite(parsedLongitude) &&
      parsedLongitude >= -180 &&
      parsedLongitude <= 180;

    if (
      !validVisit ||
      (!activePlace &&
        (!form.name.trim() || !form.locationLabel.trim() || !validLocation))
    ) {
      setMessage(
        activePlace
          ? "Enter a whole rating from 0 to 10 and a non-negative cost."
          : "Enter a place, location, valid coordinates, a whole rating from 0 to 10, and a non-negative cost.",
      );
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      const visit = {
        ratingOutOf10,
        costPerPerson,
        currency: "SGD" as const,
        itemsBought: form.itemsBought.trim(),
        comments: form.comments.trim(),
        visitedAt: form.visitedAt,
      };
      if (
        activePlace?.sourcePlaceId &&
        activePlace.visits.some((entry) => entry.ownerKind === "you")
      ) {
        await appendVisit(
          firebaseClient.db,
          user.uid,
          activePlace.sourcePlaceId,
          crypto.randomUUID(),
          visit,
        );
      } else {
        await createPlaceWithVisit(
          firebaseClient.db,
          user.uid,
          crypto.randomUUID(),
          crypto.randomUUID(),
          {
            name: form.name.trim(),
            locationLabel: form.locationLabel.trim(),
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            cuisineGenre: form.cuisineGenre,
          },
          visit,
        );
      }
      resetFormState();
      onSaved?.();
      onDiscard();
    } catch {
      setMessage(
        activePlace
          ? "We could not add that entry. Check Firestore Rules and try again."
          : "We could not save that place. Check Firestore Rules and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!firebaseClient) return null;

  return (
    <section className="site-surface-card grid gap-6 rounded-[26px] p-5 sm:p-7">
      {!isAdding ? (
        <div>
          <h2 className="mt-2 text-[1.8rem] font-semibold text-[color:var(--site-text-strong)]">
            Add new location or Add new entry
          </h2>
          <p className="mt-2 leading-7 text-[color:var(--site-text-muted)]">
            Drop a new pin on the map to save a place, or choose a location in
            View Entries and press <span className="font-semibold">+</span> to
            record another visit.
          </p>
        </div>
      ) : (
        <>
          <div>
            <h2 className="mt-2 text-[1.8rem] font-semibold text-[color:var(--site-text-strong)]">
              {activePlace
                ? "Add a new entry to an existing location"
                : "Save a place and record your first visit"}
            </h2>
          </div>
          {user ? (
            <form
              ref={controlRef}
              className="grid gap-4 lg:grid-cols-2"
              onSubmit={submit}
            >
              {(["name", "locationLabel"] as const).map((field) => (
                <label
                  key={field}
                  className="grid gap-2 text-[0.78rem] font-semibold capitalize text-[color:var(--site-text-muted)]"
                >
                  {field === "locationLabel" ? "Location label" : "Place name"}
                  <input
                    className={inputClassName}
                    placeholder={
                      field === "locationLabel"
                        ? "E.g. Bugis+"
                        : "E.g. ABC Western"
                    }
                    value={form[field]}
                    disabled={Boolean(activePlace)}
                    onChange={(event) => updateForm(field, event.target.value)}
                  />
                </label>
              ))}
              <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
                Latitude
                <input
                  className={inputClassName}
                  inputMode="decimal"
                  value={formLatitude}
                  disabled={Boolean(activePlace)}
                  onChange={(event) =>
                    onLocationChange(event.target.value, longitude)
                  }
                />
              </label>
              <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
                Longitude
                <input
                  className={inputClassName}
                  inputMode="decimal"
                  value={formLongitude}
                  disabled={Boolean(activePlace)}
                  onChange={(event) =>
                    onLocationChange(latitude, event.target.value)
                  }
                />
              </label>
              <label className="relative grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
                Cuisine
                <button
                  className="bite-trail-control"
                  type="button"
                  disabled={Boolean(activePlace)}
                  aria-haspopup="listbox"
                  aria-expanded={openMenu === "cuisine"}
                  onClick={() =>
                    setOpenMenu(openMenu === "cuisine" ? null : "cuisine")
                  }
                >
                  <span>{formatCuisineLabel(form.cuisineGenre)}</span>
                  <FaChevronDown
                    className={openMenu === "cuisine" ? "rotate-180" : ""}
                    aria-hidden="true"
                  />
                </button>
                {openMenu === "cuisine" ? (
                  <div className="bite-trail-menu" role="listbox">
                    {BITE_TRAIL_CUISINES.map((cuisine) => (
                      <button
                        className={`bite-trail-menu-option ${form.cuisineGenre === cuisine ? "bite-trail-menu-option--selected" : ""}`}
                        key={cuisine}
                        type="button"
                        role="option"
                        aria-selected={form.cuisineGenre === cuisine}
                        onClick={() => {
                          updateForm("cuisineGenre", cuisine);
                          setOpenMenu(null);
                        }}
                      >
                        {formatCuisineLabel(cuisine)}
                      </button>
                    ))}
                  </div>
                ) : null}
              </label>
              <label className="relative grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
                Visited on
                <button
                  className="bite-trail-control"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={openMenu === "date"}
                  onClick={() => {
                    setCalendarMonth(selectedDate);
                    setOpenMenu(openMenu === "date" ? null : "date");
                  }}
                >
                  <span>{formatDateLabel(form.visitedAt)}</span>
                  <FaCalendarDays
                    className="bite-trail-calendar-icon"
                    aria-hidden="true"
                  />
                </button>
                {openMenu === "date" ? (
                  <div
                    className="bite-trail-calendar"
                    role="dialog"
                    aria-label="Choose visit date"
                  >
                    <div className="bite-trail-calendar-header">
                      <button
                        type="button"
                        aria-label="Previous month"
                        onClick={() =>
                          setCalendarMonth(
                            (month) =>
                              new Date(
                                month.getFullYear(),
                                month.getMonth() - 1,
                                1,
                              ),
                          )
                        }
                      >
                        <FaChevronLeft aria-hidden="true" />
                      </button>
                      <span>{formatMonthLabel(calendarMonth)}</span>
                      <button
                        type="button"
                        aria-label="Next month"
                        onClick={() =>
                          setCalendarMonth(
                            (month) =>
                              new Date(
                                month.getFullYear(),
                                month.getMonth() + 1,
                                1,
                              ),
                          )
                        }
                      >
                        <FaChevronRight aria-hidden="true" />
                      </button>
                    </div>
                    <div
                      className="bite-trail-calendar-weekdays"
                      aria-hidden="true"
                    >
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <span key={`${day}-${index}`}>{day}</span>
                      ))}
                    </div>
                    <div className="bite-trail-calendar-grid">
                      {calendarDays.map((day, index) => {
                        if (!day) return <span key={`empty-${index}`} />;
                        const dateValue = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = dateValue === form.visitedAt;
                        return (
                          <button
                            className={`bite-trail-calendar-day ${isSelected ? "bite-trail-calendar-day--selected" : ""}`}
                            key={dateValue}
                            type="button"
                            aria-label={formatDateLabel(dateValue)}
                            aria-pressed={isSelected}
                            onClick={() => {
                              updateForm("visitedAt", dateValue);
                              setOpenMenu(null);
                            }}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </label>
              <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
                <span className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span>Rating (0–10)</span>
                    <InfoTooltip
                      ariaLabel="About rating"
                      preferredPlacement="top"
                    >
                      <p className="m-0">
                        The higher the rating, the better the bite! Do note that
                        rating is entirely subjective so don&apos;t stress up
                        over it.
                      </p>
                    </InfoTooltip>
                  </span>
                  <span className="text-[color:var(--site-text-strong)]">
                    {form.ratingOutOf10} / 10
                  </span>
                </span>
                <span className="relative mt-3 block h-5">
                  <span className="absolute left-0 right-0 top-2 h-1 rounded-full bg-[color:var(--site-border-strong)]" />
                  <span
                    className="absolute left-0 top-2 h-1 rounded-full bg-[color:var(--site-accent)]"
                    style={{ width: `${Number(form.ratingOutOf10) * 10}%` }}
                  />
                  <input
                    className="bite-trail-range absolute inset-0 h-5 w-full"
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={form.ratingOutOf10}
                    aria-label="Rating from 0 to 10"
                    onChange={(event) =>
                      updateForm("ratingOutOf10", event.target.value)
                    }
                  />
                </span>
              </label>
              <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)]">
                Cost per person (SGD)
                <input
                  className={inputClassName}
                  inputMode="decimal"
                  value={form.costPerPerson}
                  onChange={(event) =>
                    updateForm("costPerPerson", event.target.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)] lg:col-span-2">
                What did you order?
                <input
                  className={inputClassName}
                  placeholder="E.g. Chicken chop rice, Cheesy fries"
                  value={form.itemsBought}
                  onChange={(event) =>
                    updateForm("itemsBought", event.target.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-[0.78rem] font-semibold text-[color:var(--site-text-muted)] lg:col-span-2">
                Comments
                <textarea
                  className={textAreaClassName}
                  placeholder="E.g. The fries was well seasoned, and the rice was very fragrant, even though the chicken chop was a little dry"
                  value={form.comments}
                  onChange={(event) =>
                    updateForm("comments", event.target.value)
                  }
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
                <button
                  className="site-button-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold disabled:opacity-55"
                  type="submit"
                  disabled={isSaving}
                >
                  <FaPlus className="h-4 w-4" aria-hidden="true" />
                  {isSaving
                    ? "Saving..."
                    : activePlace
                      ? "Add entry"
                      : "Save place and visit"}
                </button>
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--site-accent-red)] bg-transparent px-4 font-semibold text-[color:var(--site-accent-red)] transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 disabled:pointer-events-none disabled:opacity-55"
                  type="button"
                  onClick={onDiscard}
                  disabled={isSaving}
                >
                  <FaTrashCan className="h-4 w-4" aria-hidden="true" />
                  Discard
                </button>
              </div>
            </form>
          ) : (
            <p className="text-[color:var(--site-text-muted)]">
              Sign in above to start adding entries.
            </p>
          )}
        </>
      )}
      {message ? (
        <p className="text-[0.84rem] leading-6 text-[color:var(--site-accent-soft)]">
          {message}
        </p>
      ) : null}
    </section>
  );
};

export default BiteTrailDataPanel;
