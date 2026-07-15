"use client";

import type * as L from "leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaBowlFood,
  FaChevronDown,
  FaFilter,
  FaFilterCircleXmark,
  FaLocationCrosshairs,
  FaList,
  FaMapPin,
  FaStar,
  FaUtensils,
  FaUser,
  FaUsers,
} from "react-icons/fa6";

import InfoTooltip from "@/app/components/shared/feedback/InfoTooltip";
import {
  type BiteTrailCuisineGenre,
  type BiteTrailFoodEntry,
  type BiteTrailPlace,
  mockFoodPlaces,
} from "@/app/components/tools/bite-trail/mockFoodEntries";
import type { BiteTrailMapStart } from "@/lib/bite-trail";

type ClusterEvent = L.LeafletEvent & {
  layer: L.MarkerCluster;
};

const SINGAPORE_CENTER: [number, number] = [1.353, 103.822];
const SINGAPORE_ZOOM = 12;
const USER_LOCATION_ZOOM = 14;
const BITE_TRAIL_CLUSTER_RADIUS = 52;

type BiteTrailFilters = {
  cuisineGenres: BiteTrailCuisineGenre[];
  maxCost: number;
  minCost: number;
  minRating: number;
  ownerNames: string[];
};

const CURRENT_USER_NAME = "You";

const CUISINE_OPTIONS = (
  [
    "hawker",
    "cafe",
    "Chinese",
    "dessert",
    "fast food",
    "western",
    "Korean",
    "Japanese",
    "Thai",
    "Indian",
    "Malay",
    "Others",
    "seafood",
  ] as BiteTrailCuisineGenre[]
).sort((firstCuisine, secondCuisine) => {
  if (firstCuisine === "Others") return 1;
  if (secondCuisine === "Others") return -1;
  return firstCuisine.localeCompare(secondCuisine);
});

const formatCurrency = (
  cost: number,
  currency: BiteTrailFoodEntry["currency"] = "SGD",
) =>
  new Intl.NumberFormat("en-SG", {
    currency,
    maximumFractionDigits: 2,
    style: "currency",
  }).format(cost);

const formatCuisineLabel = (cuisine: BiteTrailCuisineGenre) =>
  cuisine.replace(/\b\w/g, (character) => character.toUpperCase());

type VisibleBiteTrailPlace = BiteTrailPlace & {
  averageCost: number;
  averageRating: number;
  visibleVisits: BiteTrailFoodEntry[];
};

const getPlaceOwnerKind = (place: BiteTrailPlace) =>
  place.visits.some((visit) => visit.ownerKind === "you") ? "you" : "friend";

const createEntryIconHtml = (place: BiteTrailPlace, isSelected = false) => `
  <span class="bite-trail-marker ${getPlaceOwnerKind(place) === "you" ? "bite-trail-marker--own" : "bite-trail-marker--friend"} ${isSelected ? "bite-trail-marker--selected" : ""}">
    <span class="bite-trail-marker__dot"></span>
  </span>
`;

const createClusterIconHtml = (count: number, isSelected = false) => `
  <span class="bite-trail-cluster ${isSelected ? "bite-trail-cluster--selected" : ""}">
    <span>${count}</span>
  </span>
`;

const createUserLocationIconHtml = () => `
  <span class="bite-trail-user-location">
    <svg viewBox="-24 -24 368 560" aria-hidden="true">
      <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-223.1L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6l29.7 0c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9 232 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128-16 0z" />
    </svg>
  </span>
`;

const EntryStat = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="rounded-[0.75rem] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] px-3 py-2">
    <div className="mb-1 flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.08em] text-[color:var(--site-text-muted)]">
      <span className="text-[color:var(--site-accent-soft)]">{icon}</span>
      {label}
    </div>
    <p className="text-[0.95rem] text-[color:var(--site-text-strong)]">
      {value}
    </p>
  </div>
);

const EntryDetailPanel = ({
  place,
  currentUserName,
}: {
  place: VisibleBiteTrailPlace;
  currentUserName: string;
}) => (
  <div className="flex min-h-full flex-col p-5">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-[1.7rem] font-semibold leading-tight text-[color:var(--site-text-strong)]">
          {place.placeName}
        </h3>
      </div>
    </div>

    <div className="mb-5 flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] text-[color:var(--site-text)]">
        <FaMapPin className="text-[color:var(--site-accent-soft)]" />
        {place.neighborhood}
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] capitalize text-[color:var(--site-text)]">
        <FaUtensils className="text-[color:var(--site-accent-soft)]" />
        {formatCuisineLabel(place.cuisineGenre)}
      </span>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xxl:grid-cols-2">
      <EntryStat
        icon={<FaStar />}
        label="Average rating"
        value={`${place.averageRating.toFixed(1)} / 10`}
      />
      <EntryStat
        icon={<FaBowlFood />}
        label="Average cost"
        value={`${formatCurrency(place.averageCost, place.currency)} / pax`}
      />
    </div>

    <div className="mt-5">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
        Visits ({place.visibleVisits.length})
      </p>
      <div className="mt-3 grid gap-3">
        {place.visibleVisits.map((visit) => (
          <article
            key={visit.id}
            className="rounded-[0.75rem] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="inline-flex items-center gap-2 font-semibold text-[color:var(--site-accent-soft)]">
                  {visit.ownerName === currentUserName ? (
                    <FaUser className="text-[color:var(--site-accent-soft)]" />
                  ) : (
                    <FaUsers className="text-[color:var(--site-accent-soft)]" />
                  )}
                  {visit.ownerName === currentUserName
                    ? "Your visit"
                    : `${visit.ownerName}'s visit`}
                </p>
                <p className="mt-1 text-[0.78rem] text-[color:var(--site-text-muted)]">
                  {visit.visitedAt}
                </p>
              </div>
              <div className="text-right text-[0.82rem] text-[color:var(--site-text)]">
                <p>Rating: {visit.ratingOutOf10} / 10</p>
                <p>
                  Cost: {formatCurrency(visit.costPerPerson, visit.currency)} /
                  pax
                </p>
              </div>
            </div>
            {visit.itemsBought ? (
              <p className="mt-3 leading-6 text-[color:var(--site-text)]">
                <span className="font-semibold text-[color:var(--site-accent-soft)]">
                  Ordered:{" "}
                </span>
                {visit.itemsBought}
              </p>
            ) : null}
            <p className="mt-3 leading-6 text-[color:var(--site-text)]">
              <span className="font-semibold text-[color:var(--site-accent-soft)]">
                Comments:{" "}
              </span>
              {visit.comments}
            </p>
          </article>
        ))}
      </div>
    </div>
  </div>
);

const EntryListPanel = ({
  entries,
  eyebrow,
  heading,
  onSelect,
  onHover,
}: {
  entries: VisibleBiteTrailPlace[];
  eyebrow?: string;
  heading?: string;
  onSelect: (entry: VisibleBiteTrailPlace) => void;
  onHover: (entry: VisibleBiteTrailPlace | null) => void;
}) => (
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-5">
    {eyebrow ? (
      <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
        {eyebrow}
      </p>
    ) : null}
    {heading ? (
      <h3 className="text-[1.7rem] font-semibold leading-tight text-[color:var(--site-text-strong)]">
        {heading}
      </h3>
    ) : null}
    <div
      className={`${heading ? "mt-5" : "mt-0"} min-h-0 flex-1 overflow-y-auto pr-3 [scrollbar-gutter:stable]`}
    >
      <div className="grid gap-3">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onSelect(entry)}
            onMouseEnter={() => onHover(entry)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(entry)}
            onBlur={() => onHover(null)}
            className="rounded-[0.75rem] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] px-4 py-3 text-left transition duration-150 hover:border-[color:var(--site-accent-border-soft-hover)] hover:text-[color:var(--site-accent-soft)] focus-visible:border-[color:var(--site-accent-border-soft-hover)] focus-visible:text-[color:var(--site-accent-soft)]"
          >
            <span className="block text-[1rem] font-semibold text-[color:var(--site-text-strong)]">
              {entry.placeName}
            </span>
            <span className="mt-1 block text-[0.82rem] text-[color:var(--site-text-muted)]">
              {entry.neighborhood} · {formatCuisineLabel(entry.cuisineGenre)} ·{" "}
              {entry.averageRating.toFixed(1)} / 10 ·{" "}
              {formatCurrency(entry.averageCost, entry.currency)}
            </span>
          </button>
        ))}
      </div>
      {entries.length === 0 ? (
        <p className="mt-5 leading-7 text-[color:var(--site-text-muted)]">
          No entries match the current filters.
        </p>
      ) : null}
    </div>
  </div>
);

const filterSelectClassName =
  "mt-2 w-full rounded-[0.75rem] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] px-3 py-2.5 text-[0.84rem] text-[color:var(--site-text-strong)] outline-none transition focus:border-[color:var(--site-accent-border-soft-hover)]";

const FilterPanel = ({
  filters,
  onChange,
  onApply,
  ownerOptions,
  costFilterMin,
  costFilterMax,
  currentUserName,
}: {
  filters: BiteTrailFilters;
  onChange: (filters: BiteTrailFilters) => void;
  onApply: () => void;
  ownerOptions: string[];
  costFilterMin: number;
  costFilterMax: number;
  currentUserName: string;
}) => {
  const [isCuisineMenuOpen, setIsCuisineMenuOpen] = useState(false);
  const [isOwnerMenuOpen, setIsOwnerMenuOpen] = useState(false);
  const cuisineMenuRef = useRef<HTMLDivElement>(null);
  const ownerMenuRef = useRef<HTMLDivElement>(null);
  const allOwnersSelected = filters.ownerNames.length === ownerOptions.length;
  const allCuisinesSelected =
    filters.cuisineGenres.length === CUISINE_OPTIONS.length;

  useEffect(() => {
    if (!isCuisineMenuOpen && !isOwnerMenuOpen) {
      return;
    }

    const closeMenusOnOutsideClick = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      if (
        isCuisineMenuOpen &&
        !cuisineMenuRef.current?.contains(event.target)
      ) {
        setIsCuisineMenuOpen(false);
      }
      if (isOwnerMenuOpen && !ownerMenuRef.current?.contains(event.target)) {
        setIsOwnerMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeMenusOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeMenusOnOutsideClick);
  }, [isCuisineMenuOpen, isOwnerMenuOpen]);

  const toggleCuisine = (cuisine: BiteTrailCuisineGenre) => {
    const cuisineGenres = filters.cuisineGenres.includes(cuisine)
      ? filters.cuisineGenres.filter(
          (selectedCuisine) => selectedCuisine !== cuisine,
        )
      : [...filters.cuisineGenres, cuisine];
    onChange({ ...filters, cuisineGenres });
  };

  const toggleOwner = (ownerName: string) => {
    const ownerNames = filters.ownerNames.includes(ownerName)
      ? filters.ownerNames.filter((name) => name !== ownerName)
      : [...filters.ownerNames, ownerName];
    onChange({ ...filters, ownerNames });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5">
      <div className="grid gap-5">
        <div
          ref={ownerMenuRef}
          className="relative text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--site-text-muted)]"
        >
          <span className="block">Watch List</span>
          <button
            type="button"
            onClick={() => setIsOwnerMenuOpen((isOpen) => !isOpen)}
            aria-expanded={isOwnerMenuOpen}
            aria-haspopup="listbox"
            className={`${filterSelectClassName} flex items-center justify-between text-left hover:border-[color:var(--site-accent-border-soft-hover)] focus:border-[color:var(--site-accent-border-soft-hover)]`}
          >
            <span>
              {filters.ownerNames.length === 0
                ? "All lists"
                : `${filters.ownerNames.length} ${filters.ownerNames.length === 1 ? "person" : "people"} selected`}
            </span>
            <FaChevronDown
              className={`text-[0.7rem] transition-transform ${isOwnerMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isOwnerMenuOpen ? (
            <div
              className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[0.75rem] border border-[color:var(--site-border)] bg-[color:var(--site-bg-chrome)] shadow-[0_16px_32px_rgba(0,0,0,0.32)]"
              role="listbox"
            >
              <div className="max-h-[440px] overflow-y-auto p-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      ownerNames: allOwnersSelected ? [] : ownerOptions,
                    })
                  }
                  className="mb-1 w-full rounded-[0.55rem] px-3 py-2 text-left text-[0.8rem] font-semibold normal-case tracking-normal text-[color:var(--site-text-strong)] hover:bg-[color:var(--site-bg-soft)]"
                >
                  {allOwnersSelected ? "Unselect all" : "Select all"}
                </button>
                {ownerOptions.map((ownerName) => {
                  const isSelected = filters.ownerNames.includes(ownerName);
                  return (
                    <label
                      key={ownerName}
                      className="flex cursor-pointer items-center gap-3 rounded-[0.55rem] px-3 py-2 text-[0.8rem] font-normal normal-case tracking-normal text-[color:var(--site-text)] hover:bg-[color:var(--site-bg-soft)]"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOwner(ownerName)}
                        className="h-4 w-4 accent-[color:var(--site-accent)]"
                      />
                      <span>
                        {ownerName === currentUserName
                          ? `${ownerName} (you)`
                          : ownerName}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div
          ref={cuisineMenuRef}
          className="relative text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--site-text-muted)]"
        >
          <span className="block">Cuisine</span>
          <button
            type="button"
            onClick={() => setIsCuisineMenuOpen((isOpen) => !isOpen)}
            aria-expanded={isCuisineMenuOpen}
            aria-haspopup="listbox"
            className={`${filterSelectClassName} flex items-center justify-between text-left hover:border-[color:var(--site-accent-border-soft-hover)] focus:border-[color:var(--site-accent-border-soft-hover)]`}
          >
            <span>
              {filters.cuisineGenres.length === 0
                ? "All cuisines"
                : `${filters.cuisineGenres.length} ${filters.cuisineGenres.length === 1 ? "cuisine" : "cuisines"} selected`}
            </span>
            <FaChevronDown
              className={`text-[0.7rem] transition-transform ${isCuisineMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isCuisineMenuOpen ? (
            <div
              className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[0.75rem] border border-[color:var(--site-border)] bg-[color:var(--site-bg-chrome)] shadow-[0_16px_32px_rgba(0,0,0,0.32)]"
              role="listbox"
            >
              <div className="max-h-[350px] overflow-y-auto p-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      cuisineGenres: allCuisinesSelected ? [] : CUISINE_OPTIONS,
                    })
                  }
                  className="mb-1 w-full rounded-[0.55rem] px-3 py-2 text-left text-[0.8rem] font-semibold normal-case tracking-normal text-[color:var(--site-text-strong)] hover:bg-[color:var(--site-bg-soft)]"
                >
                  {allCuisinesSelected ? "Unselect all" : "Select all"}
                </button>
                {CUISINE_OPTIONS.map((cuisine) => (
                  <label
                    key={cuisine}
                    className="flex cursor-pointer items-center gap-3 rounded-[0.55rem] px-3 py-2 text-[0.8rem] font-normal normal-case tracking-normal text-[color:var(--site-text)] hover:bg-[color:var(--site-bg-soft)]"
                  >
                    <input
                      type="checkbox"
                      checked={filters.cuisineGenres.includes(cuisine)}
                      onChange={() => toggleCuisine(cuisine)}
                      className="h-4 w-4 accent-[color:var(--site-accent)]"
                    />
                    <span>{formatCuisineLabel(cuisine)}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--site-text-muted)]">
          <span className="flex items-center gap-2">
            <span>Minimum rating</span>
            <InfoTooltip
              ariaLabel="About minimum rating"
              preferredPlacement="top"
            >
              <p className="m-0">
                Only entries at or above the selected rating will be shown. The
                higher the rating, the better the bite!
              </p>
            </InfoTooltip>
          </span>
          <span className="mt-2 flex items-center justify-between text-[0.84rem] font-normal normal-case tracking-normal text-[color:var(--site-text-strong)]">
            <span>
              {filters.minRating === 0
                ? "Any rating"
                : `${filters.minRating} / 10 or higher`}
            </span>
          </span>
          <span className="relative mt-3 block h-5">
            <span className="absolute left-0 right-0 top-2 h-1 rounded-full bg-[color:var(--site-border-strong)]" />
            <span
              className="absolute left-0 top-2 h-1 rounded-full bg-[color:var(--site-accent)]"
              style={{ width: `${filters.minRating * 10}%` }}
            />
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={filters.minRating}
              onChange={(event) =>
                onChange({ ...filters, minRating: Number(event.target.value) })
              }
              aria-label="Minimum rating"
              className="bite-trail-range absolute inset-0 h-5 w-full"
            />
          </span>
        </div>

        <div className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--site-text-muted)]">
          <span className="flex items-center gap-2">
            <span>Cost per person</span>
            <InfoTooltip
              ariaLabel="About cost per person"
              preferredPlacement="top"
            >
              <p className="m-0">
                Only entries within the selected per-person cost range will be
                shown. This is just an estimate, so prices may vary per visit!
              </p>
            </InfoTooltip>
          </span>
          <span className="mt-2 flex items-center justify-between text-[0.84rem] font-normal normal-case tracking-normal text-[color:var(--site-text-strong)]">
            <span>
              S${filters.minCost} - S${filters.maxCost}
            </span>
            <span>SGD</span>
          </span>
          <span className="relative mt-3 block h-5">
            <span className="absolute left-0 right-0 top-2 h-1 rounded-full bg-[color:var(--site-border-strong)]" />
            <span
              className="absolute top-2 h-1 rounded-full bg-[color:var(--site-accent)]"
              style={{
                left: `${((filters.minCost - costFilterMin) / (costFilterMax - costFilterMin || 1)) * 100}%`,
                right: `${((costFilterMax - filters.maxCost) / (costFilterMax - costFilterMin || 1)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={costFilterMin}
              max={costFilterMax}
              step="1"
              value={filters.minCost}
              onChange={(event) =>
                onChange({
                  ...filters,
                  minCost: Math.min(
                    Number(event.target.value),
                    filters.maxCost,
                  ),
                })
              }
              aria-label="Minimum cost per person"
              className="bite-trail-range absolute inset-0 h-5 w-full"
            />
            <input
              type="range"
              min={costFilterMin}
              max={costFilterMax}
              step="1"
              value={filters.maxCost}
              onChange={(event) =>
                onChange({
                  ...filters,
                  maxCost: Math.max(
                    Number(event.target.value),
                    filters.minCost,
                  ),
                })
              }
              aria-label="Maximum cost per person"
              className="bite-trail-range absolute inset-0 h-5 w-full"
            />
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onApply}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-[0.75rem] border border-[color:var(--site-accent-border-strong)] bg-[color:var(--site-accent-strong)] px-4 py-3 text-[0.84rem] font-semibold text-[color:var(--site-text-strong)] transition hover:bg-[color:var(--site-accent)] focus-visible:bg-[color:var(--site-accent)]"
      >
        <FaFilter />
        Filter entries
      </button>

      <p className="mt-4 text-[0.78rem] leading-6 text-[color:var(--site-text-muted)]">
        Apply filters to update the visible pins and entry list together.
      </p>
    </div>
  );
};

const BiteTrailMap = ({
  places = mockFoodPlaces,
  currentUserName = CURRENT_USER_NAME,
  mapStart = "Singapore",
}: {
  places?: BiteTrailPlace[];
  currentUserName?: string;
  mapStart?: BiteTrailMapStart;
}) => {
  const allPlaces = places;
  const ownerOptions = useMemo(
    () => [
      currentUserName,
      ...Array.from(
        new Set(
          allPlaces.flatMap((place) =>
            place.visits.map((visit) => visit.ownerName),
          ),
        ),
      )
        .filter((ownerName) => ownerName !== currentUserName)
        .sort((firstOwner, secondOwner) =>
          firstOwner.localeCompare(secondOwner),
        ),
    ],
    [allPlaces, currentUserName],
  );
  const costFilterMin = useMemo(
    () =>
      Math.floor(
        Math.min(
          ...allPlaces.flatMap((place) =>
            place.visits.map((visit) => visit.costPerPerson),
          ),
          0,
        ),
      ),
    [allPlaces],
  );
  const costFilterMax = useMemo(
    () =>
      Math.max(
        Math.ceil(
          Math.max(
            ...allPlaces.flatMap((place) =>
              place.visits.map((visit) => visit.costPerPerson),
            ),
            1,
          ),
        ),
        costFilterMin,
      ),
    [allPlaces, costFilterMin],
  );
  const defaultFilters = useMemo<BiteTrailFilters>(
    () => ({
      cuisineGenres: [],
      maxCost: costFilterMax,
      minCost: costFilterMin,
      minRating: 0,
      ownerNames: [],
    }),
    [costFilterMax, costFilterMin],
  );
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const leafletRef = useRef<{
    circle: typeof import("leaflet").circle;
    divIcon: typeof import("leaflet").divIcon;
    latLng: typeof import("leaflet").latLng;
    marker: typeof import("leaflet").marker;
  } | null>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const hasRequestedInitialLocationRef = useRef(false);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const activeTooltipMarkerRef = useRef<L.Marker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [draftFilters, setDraftFilters] =
    useState<BiteTrailFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<BiteTrailFilters>(defaultFilters);
  const [expandedPanel, setExpandedPanel] = useState<"filters" | "entries">(
    "entries",
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [clusterEntryIds, setClusterEntryIds] = useState<string[]>([]);
  const selectedPlaceIdRef = useRef<string | null>(selectedPlaceId);
  selectedPlaceIdRef.current = selectedPlaceId;

  useEffect(() => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSelectedPlaceId(null);
  }, [defaultFilters]);

  const entries = useMemo(
    () =>
      allPlaces.flatMap((place) => {
        const visibleVisits = place.visits.filter(
          (visit) =>
            appliedFilters.ownerNames.length === 0 ||
            appliedFilters.ownerNames.includes(visit.ownerName),
        );
        const matchesCuisine =
          appliedFilters.cuisineGenres.length === 0 ||
          appliedFilters.cuisineGenres.includes(place.cuisineGenre);
        const averageRating =
          visibleVisits.reduce(
            (total, visit) => total + visit.ratingOutOf10,
            0,
          ) / (visibleVisits.length || 1);
        const averageCost =
          visibleVisits.reduce(
            (total, visit) => total + visit.costPerPerson,
            0,
          ) / (visibleVisits.length || 1);
        const matchesRating = averageRating >= appliedFilters.minRating;
        const matchesCost =
          averageCost >= appliedFilters.minCost &&
          averageCost <= appliedFilters.maxCost;

        if (
          !visibleVisits.length ||
          !matchesCuisine ||
          !matchesRating ||
          !matchesCost
        ) {
          return [];
        }

        return [{ ...place, averageCost, averageRating, visibleVisits }];
      }),
    [allPlaces, appliedFilters],
  );

  const selectedPlace = useMemo(
    () => entries.find((entry) => entry.id === selectedPlaceId) ?? null,
    [entries, selectedPlaceId],
  );

  const clusterEntries = useMemo(
    () =>
      clusterEntryIds
        .map((entryId) => entries.find((entry) => entry.id === entryId))
        .filter((entry): entry is VisibleBiteTrailPlace => Boolean(entry)),
    [clusterEntryIds, entries],
  );

  const syncSelectedMarkerStyles = () => {
    markerRefs.current.forEach((marker, entryId) => {
      marker
        .getElement()
        ?.querySelector(".bite-trail-marker")
        ?.classList.toggle(
          "bite-trail-marker--selected",
          entryId === selectedPlaceIdRef.current,
        );
    });
  };

  const openEntryTooltip = (entry: VisibleBiteTrailPlace) => {
    const map = mapInstanceRef.current;
    const marker = markerRefs.current.get(entry.id);
    const tooltip = marker?.getTooltip();
    if (!map || !marker || !tooltip) {
      return;
    }

    const visibleParent =
      markerClusterGroupRef.current?.getVisibleParent(marker);
    const isGrouped = Boolean(visibleParent && visibleParent !== marker);
    const tooltipLatLng = visibleParent?.getLatLng() ?? marker.getLatLng();

    activeTooltipMarkerRef.current?.closeTooltip();
    tooltip.options.direction = "bottom";
    tooltip.options.offset = isGrouped ? [0, 2] : [0, 12];
    tooltip.setLatLng(tooltipLatLng);
    activeTooltipMarkerRef.current = marker;

    if (isGrouped) {
      tooltip.openOn(map);
    } else {
      marker.openTooltip();
    }
  };

  useEffect(() => {
    markerClusterGroupRef.current?.refreshClusters();
    syncSelectedMarkerStyles();
  }, [selectedPlaceId]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const leaflet = leafletRef.current;
    if (!map || !leaflet) {
      return;
    }

    const removeLayer = (layer: L.Layer | null) => {
      if (layer && map.hasLayer(layer)) {
        layer.removeFrom(map);
      }
    };

    removeLayer(userLocationMarkerRef.current);
    removeLayer(userAccuracyCircleRef.current);
    userLocationMarkerRef.current = null;
    userAccuracyCircleRef.current = null;

    if (!userLocation) {
      return;
    }

    const location = leaflet.latLng(
      userLocation.latitude,
      userLocation.longitude,
    );
    userAccuracyCircleRef.current = leaflet.circle(location, {
      color: "var(--site-accent-orange)",
      fillColor: "var(--site-accent-orange)",
      fillOpacity: 0.12,
      opacity: 0.5,
      radius: Math.max(userLocation.accuracy, 20),
      weight: 1,
    }).addTo(map);
    userLocationMarkerRef.current = leaflet.marker(location, {
      alt: "Your current location",
      icon: leaflet.divIcon({
        className: "bite-trail-user-location-icon",
        html: createUserLocationIconHtml(),
        iconAnchor: [16, 16],
        iconSize: [32, 32],
      }),
      keyboard: false,
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindTooltip("You are here", {
        className: "bite-trail-marker-tooltip",
        direction: "bottom",
        offset: [0, 16],
      });

    return () => {
      removeLayer(userLocationMarkerRef.current);
      removeLayer(userAccuracyCircleRef.current);
      userLocationMarkerRef.current = null;
      userAccuracyCircleRef.current = null;
    };
  }, [isMapLoaded, userLocation]);

  useEffect(() => {
    let isCancelled = false;
    const markerRegistry = markerRefs.current;

    const initialiseMap = async () => {
      if (!mapContainerRef.current || mapInstanceRef.current) {
        return;
      }

      const leafletModule = await import("leaflet");
      const L = leafletModule.default;
      leafletRef.current = L;
      (globalThis as typeof globalThis & { L?: typeof L }).L = L;
      (window as Window & { L?: typeof L }).L = L;
      try {
        await import("leaflet.markercluster");
      } catch {
        // Marker clustering is progressive enhancement; the map should still render.
      }

      if (isCancelled || !mapContainerRef.current) {
        return;
      }

      const map = L.map(mapContainerRef.current, {
        attributionControl: false,
        boxZoom: true,
        doubleClickZoom: true,
        dragging: true,
        keyboard: true,
        scrollWheelZoom: true,
        touchZoom: true,
        zoomControl: false,
      }).setView(SINGAPORE_CENTER, SINGAPORE_ZOOM);

      map.on("click", () => {
        markerRefs.current.forEach((marker) => marker.closeTooltip());
        activeTooltipMarkerRef.current?.closeTooltip();
        activeTooltipMarkerRef.current = null;
        setSelectedPlaceId(null);
        setClusterEntryIds([]);
      });
      map.on("zoomend moveend", syncSelectedMarkerStyles);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        keepBuffer: 4,
        maxZoom: 19,
        updateWhenIdle: false,
        updateWhenZooming: false,
      }).addTo(map);

      const entryByMarker = new Map<number, VisibleBiteTrailPlace>();
      const hasMarkerCluster = typeof L.markerClusterGroup === "function";
      const markers: L.FeatureGroup | L.MarkerClusterGroup = hasMarkerCluster
        ? L.markerClusterGroup({
            iconCreateFunction: (cluster) =>
              L.divIcon({
                className: "bite-trail-cluster-icon",
                html: createClusterIconHtml(
                  cluster.getChildCount(),
                  Boolean(
                    selectedPlaceIdRef.current &&
                      cluster
                        .getAllChildMarkers()
                        .some(
                          (marker: L.Marker) =>
                            entryByMarker.get(L.stamp(marker))?.id ===
                            selectedPlaceIdRef.current,
                        ),
                  ),
                ),
                iconAnchor: [24, 52],
                iconSize: [48, 54],
              }),
            maxClusterRadius: BITE_TRAIL_CLUSTER_RADIUS,
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: false,
            zoomToBoundsOnClick: false,
          })
        : L.featureGroup();

      if (hasMarkerCluster) {
        markerClusterGroupRef.current = markers as L.MarkerClusterGroup;
      }

      entries.forEach((entry) => {
        const marker = L.marker([entry.latitude, entry.longitude], {
          icon: L.divIcon({
            className: "bite-trail-marker-icon",
            html: createEntryIconHtml(
              entry,
              entry.id === selectedPlaceIdRef.current,
            ),
            iconAnchor: [12, 12],
            iconSize: [24, 24],
          }),
          keyboard: true,
          title: entry.placeName,
        });

        entryByMarker.set(L.stamp(marker), entry);
        markerRegistry.set(entry.id, marker);
        marker.bindTooltip(entry.placeName, {
          className: "bite-trail-marker-tooltip",
          direction: "bottom",
          offset: [0, 12],
        });
        marker.on("click", (event: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(event);
          marker.closeTooltip();
          setSelectedPlaceId(entry.id);
          setClusterEntryIds([]);
          setExpandedPanel("entries");
        });
        markers.addLayer(marker);
      });

      if (hasMarkerCluster) {
        markers.on("clusterclick", (event) => {
          const clusterEvent = event as ClusterEvent;
          const originalEvent = (clusterEvent as L.LeafletMouseEvent)
            .originalEvent;
          if (originalEvent) {
            L.DomEvent.stopPropagation(originalEvent);
          }
          const clusterGroup = markers as L.MarkerClusterGroup;
          const childMarkers = clusterEvent.layer.getAllChildMarkers();
          const nextClusterEntries = clusterEvent.layer
            .getAllChildMarkers()
            .map((marker: L.Marker) => entryByMarker.get(L.stamp(marker)))
            .filter(
              (
                entry: VisibleBiteTrailPlace | undefined,
              ): entry is VisibleBiteTrailPlace => Boolean(entry),
            );

          setClusterEntryIds(
            nextClusterEntries.map((entry: VisibleBiteTrailPlace) => entry.id),
          );
          setSelectedPlaceId(null);
          setExpandedPanel("entries");
          const revealNextClusterLevel = () => {
            const visibleParents = new Set(
              childMarkers.map((marker: L.Marker) =>
                clusterGroup.getVisibleParent(marker),
              ),
            );
            const hasIndividualMarker = childMarkers.some(
              (marker: L.Marker) =>
                clusterGroup.getVisibleParent(marker) === marker,
            );
            const maxZoom = map.getMaxZoom();

            if (
              visibleParents.size > 1 ||
              hasIndividualMarker ||
              (Number.isFinite(maxZoom) && map.getZoom() >= maxZoom)
            ) {
              return;
            }

            map.once("moveend", revealNextClusterLevel);
            map.setZoom(map.getZoom() + 1, {
              animate: true,
              duration: 0.45,
            });
          };

          map.once("moveend", revealNextClusterLevel);
          map.flyToBounds(clusterEvent.layer.getBounds(), {
            animate: true,
            duration: 0.75,
            easeLinearity: 0.25,
            padding: [42, 42],
          });
        });
      }

      markers.addTo(map);
      mapInstanceRef.current = map;
      setIsMapLoaded(true);
    };

    void initialiseMap().catch(() => {
      if (!isCancelled) {
        setMapError("BiteTrail map could not be loaded.");
        setIsMapLoaded(true);
      }
    });

    return () => {
      isCancelled = true;
      setIsMapLoaded(false);
      markerRegistry.clear();
      markerClusterGroupRef.current = null;
      activeTooltipMarkerRef.current?.closeTooltip();
      activeTooltipMarkerRef.current = null;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      leafletRef.current = null;
      userLocationMarkerRef.current = null;
      userAccuracyCircleRef.current = null;
    };
  }, [entries]);

  const recenterMap = () => {
    mapInstanceRef.current?.setView(SINGAPORE_CENTER, SINGAPORE_ZOOM);
    setLocationError(null);
    setClusterEntryIds([]);
    setSelectedPlaceId(null);
  };

  const requestUserLocation = useCallback((shouldCenterMap: boolean) => {
    if (!navigator.geolocation) {
      setLocationError("Current location is not available in this browser.");
      return;
    }

    if (!window.isSecureContext) {
      setLocationError(
        "Location requires HTTPS on a phone. Open the secure site or use an HTTPS local development URL.",
      );
      return;
    }

    setIsLocatingUser(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setUserLocation({
          accuracy: position.coords.accuracy,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        if (shouldCenterMap) {
          mapInstanceRef.current?.setView(nextCenter, USER_LOCATION_ZOOM);
        }
        setClusterEntryIds([]);
        setSelectedPlaceId(null);
        setIsLocatingUser(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission was denied. Allow location access for this site in your browser settings, then try again.",
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError(
            "Your device could not determine its location. Check that phone location services are enabled.",
          );
        } else {
          setLocationError(
            "The location request timed out. Try again where your phone has a clearer GPS signal.",
          );
        }
        setIsLocatingUser(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 10000,
      },
    );
  }, []);

  useEffect(() => {
    if (!isMapLoaded || hasRequestedInitialLocationRef.current) {
      return;
    }

    hasRequestedInitialLocationRef.current = true;
    requestUserLocation(mapStart === "Current location");
  }, [isMapLoaded, mapStart, requestUserLocation]);

  const centerToUser = () => requestUserLocation(true);

  const focusEntry = (entry: VisibleBiteTrailPlace) => {
    setSelectedPlaceId(entry.id);
    setClusterEntryIds([]);

    const map = mapInstanceRef.current;
    const marker = markerRefs.current.get(entry.id);
    if (!map || !marker) {
      return;
    }

    marker.closeTooltip();
    activeTooltipMarkerRef.current?.closeTooltip();
    activeTooltipMarkerRef.current = null;

    const entryCenter: [number, number] = [entry.latitude, entry.longitude];
    const currentZoom = map.getZoom();
    const maxZoom = map.getMaxZoom();
    const visibleParent =
      markerClusterGroupRef.current?.getVisibleParent(marker);
    const parentCluster =
      visibleParent && visibleParent !== marker
        ? (visibleParent as L.MarkerCluster)
        : null;
    const siblingMarkers = parentCluster?.getAllChildMarkers() ?? [marker];
    let targetZoom = currentZoom;

    if (parentCluster && siblingMarkers.length > 1) {
      const lastZoom = Number.isFinite(maxZoom) ? maxZoom : currentZoom + 8;
      const firstCandidateZoom = Math.ceil(currentZoom);

      for (let zoom = firstCandidateZoom; zoom <= lastZoom; zoom += 1) {
        const entryPoint = map.project(marker.getLatLng(), zoom);
        const isOutsideClusterRadius = siblingMarkers
          .filter((sibling) => sibling !== marker)
          .every(
            (sibling) =>
              entryPoint.distanceTo(map.project(sibling.getLatLng(), zoom)) >
              BITE_TRAIL_CLUSTER_RADIUS,
          );

        if (isOutsideClusterRadius) {
          targetZoom = zoom;
          break;
        }

        targetZoom = lastZoom;
      }
    }

    map.flyTo(entryCenter, targetZoom, {
      animate: true,
      duration: 1,
      easeLinearity: 0.25,
    });
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setSelectedPlaceId(null);
    setClusterEntryIds([]);
    setExpandedPanel("entries");
  };

  const clearFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSelectedPlaceId(null);
    setClusterEntryIds([]);
    setExpandedPanel("entries");
  };

  const previewEntryHover = (entry: VisibleBiteTrailPlace | null) => {
    if (!entry) {
      markerRefs.current.forEach((marker) => marker.closeTooltip());
      activeTooltipMarkerRef.current?.closeTooltip();
      activeTooltipMarkerRef.current = null;
      return;
    }

    openEntryTooltip(entry);
  };

  const panel = (
    <aside className="flex h-full min-h-0 flex-col gap-3">
      <section
        className={`site-surface-card flex min-h-0 flex-col overflow-hidden rounded-[22px] ${expandedPanel === "filters" ? "flex-1" : "shrink-0"}`}
      >
        <div className="relative border-b border-[color:var(--site-border)]">
          <button
            type="button"
            onClick={() =>
              setExpandedPanel(
                expandedPanel === "filters" ? "entries" : "filters",
              )
            }
            className="flex w-full items-center gap-3 px-5 py-4 pr-16 text-left"
            aria-expanded={expandedPanel === "filters"}
          >
            <FaFilter className="shrink-0 text-[color:var(--site-accent-soft)]" />
            <span className="truncate text-[1.05rem] font-semibold text-[color:var(--site-text-strong)]">
              Filter
            </span>
            <FaChevronDown
              className={`ml-auto shrink-0 text-[0.75rem] text-[color:var(--site-text-muted)] transition-transform ${expandedPanel === "filters" ? "rotate-180" : ""}`}
            />
          </button>
          <div className="absolute right-5 top-1/2 z-10 -translate-y-1/2">
            <InfoTooltip
              ariaLabel="Clear filters"
              preferredPlacement="left"
              trigger={
                <button
                  type="button"
                  aria-label="Clear filters"
                  onClick={clearFilters}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--site-border)] text-[color:var(--site-text-muted)] transition hover:border-[color:var(--site-accent-border-soft-hover)] hover:text-[color:var(--site-accent-soft)] focus-visible:border-[color:var(--site-accent-border-soft-hover)] focus-visible:text-[color:var(--site-accent-soft)]"
                >
                  <FaFilterCircleXmark />
                </button>
              }
            >
              <p className="m-0">Clear filters</p>
            </InfoTooltip>
          </div>
        </div>
        {expandedPanel === "filters" ? (
          <FilterPanel
            filters={draftFilters}
            onChange={setDraftFilters}
            onApply={applyFilters}
            ownerOptions={ownerOptions}
            costFilterMin={costFilterMin}
            costFilterMax={costFilterMax}
            currentUserName={currentUserName}
          />
        ) : null}
      </section>

      <section
        className={`site-surface-card flex min-h-0 flex-col overflow-hidden rounded-[22px] ${expandedPanel === "entries" ? "flex-1" : "shrink-0"}`}
      >
        <button
          type="button"
          onClick={() =>
            setExpandedPanel(
              expandedPanel === "entries" ? "filters" : "entries",
            )
          }
          className="flex items-center gap-3 border-b border-[color:var(--site-border)] px-5 py-4 text-left"
          aria-expanded={expandedPanel === "entries"}
        >
          <FaList className="text-[color:var(--site-accent-soft)]" />
          <span className="text-[1.05rem] font-semibold text-[color:var(--site-text-strong)]">
            View entries
          </span>
          <FaChevronDown
            className={`ml-auto text-[0.75rem] text-[color:var(--site-text-muted)] transition-transform ${expandedPanel === "entries" ? "rotate-180" : ""}`}
          />
        </button>
        {expandedPanel === "entries" ? (
          selectedPlace ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <EntryDetailPanel
                place={selectedPlace}
                currentUserName={currentUserName}
              />
            </div>
          ) : clusterEntries.length > 0 ? (
            <EntryListPanel
              entries={clusterEntries}
              eyebrow="Cluster preview"
              heading={`${clusterEntries.length} nearby places`}
              onSelect={focusEntry}
              onHover={previewEntryHover}
            />
          ) : (
            <EntryListPanel
              entries={entries}
              onSelect={focusEntry}
              onHover={previewEntryHover}
            />
          )
        ) : null}
      </section>
    </aside>
  );

  return (
    <section className="grid gap-6 xl:h-[700px] xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
      <div className="site-surface-card overflow-hidden rounded-[26px] p-3 sm:p-4">
        <div className="bite-trail-map-frame relative h-[420px] overflow-hidden rounded-[18px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] sm:h-[500px] xl:h-[620px]">
          <div
            ref={mapContainerRef}
            className="h-full w-full"
            aria-label="BiteTrail food entry map preview"
          />
          <div className="pointer-events-none absolute bottom-4 right-4 z-[500] flex flex-col items-end gap-2">
            {locationError ? (
              <p className="max-w-[240px] rounded-[0.75rem] border border-[color:var(--site-border)] bg-[color:var(--site-bg-chrome)] px-3 py-2 text-right text-[0.74rem] leading-5 text-[color:var(--site-text-muted)] shadow-[0_12px_28px_rgba(0,0,0,0.32)]">
                {locationError}
              </p>
            ) : null}
            <InfoTooltip
              ariaLabel="Center to me"
              preferredPlacement="left"
              trigger={
                <button
                  type="button"
                  onClick={centerToUser}
                  disabled={!isMapLoaded || isLocatingUser}
                  aria-label="Center map to my current location"
                  className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-chrome)] text-[color:var(--site-text-strong)] shadow-[0_14px_30px_rgba(0,0,0,0.34)] transition duration-150 hover:border-[color:var(--site-accent-border-soft-hover)] hover:text-[color:var(--site-accent-soft)] focus-visible:border-[color:var(--site-accent-border-soft-hover)] focus-visible:text-[color:var(--site-accent-soft)] disabled:pointer-events-none disabled:opacity-55"
                >
                  <FaLocationCrosshairs
                    className={
                      isLocatingUser ? "h-4 w-4 animate-pulse" : "h-4 w-4"
                    }
                  />
                </button>
              }
            >
              <p className="m-0">Center to me</p>
            </InfoTooltip>
          </div>
          {!isMapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--site-bg-soft)] text-[0.82rem] text-[color:var(--site-text-muted)]">
              Loading BiteTrail map...
            </div>
          ) : null}
          {mapError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--site-bg-soft)] px-5 text-center text-[0.82rem] leading-6 text-[color:var(--site-text-muted)]">
              {mapError}
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
          <InfoTooltip
            ariaLabel="Center map to Singapore"
            preferredPlacement="right"
            trigger={
              <button
                type="button"
                onClick={recenterMap}
                className="inline-flex items-center gap-2 text-[0.82rem] text-[color:var(--site-text-muted)] transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
              >
                <FaLocationCrosshairs />
                Singapore
              </button>
            }
          >
            <p className="m-0">
              Center map to Singapore. Change this under &quot;Default location
              for maps&quot; in &quot;My profile&quot;!
            </p>
          </InfoTooltip>
          <div className="flex flex-wrap items-center gap-2 text-[0.76rem] text-[color:var(--site-text-muted)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] px-3 py-1.5 text-[0.78rem] text-[color:var(--site-text)]">
              <FaMapPin className="text-[color:var(--site-accent-soft)]" />
              {entries.length} pins
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--site-accent)]" />
              Your list
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--site-accent-cyan)]" />
              Friends
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="bite-trail-user-location-legend" />
              You are here
            </span>
            <InfoTooltip
              ariaLabel="Leaflet map attribution"
              preferredPlacement="left"
            >
              <p className="m-0">
                Map tiles are rendered with Leaflet and OpenStreetMap. Entries
                are sample data for the current UI pass.
              </p>
            </InfoTooltip>
          </div>
        </div>
      </div>

      {panel}
    </section>
  );
};

export default BiteTrailMap;
