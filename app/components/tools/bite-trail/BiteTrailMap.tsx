"use client";

import type * as L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBowlFood,
  FaLocationCrosshairs,
  FaMapPin,
  FaRegCalendar,
  FaStar,
  FaUsers,
} from "react-icons/fa6";

import InfoTooltip from "@/app/components/shared/feedback/InfoTooltip";
import {
  type BiteTrailFoodEntry,
  mockFoodEntries,
} from "@/app/components/tools/bite-trail/mockFoodEntries";

type ClusterEvent = L.LeafletEvent & {
  layer: L.MarkerCluster;
};

const SINGAPORE_CENTER: [number, number] = [1.353, 103.822];
const SINGAPORE_ZOOM = 12;
const USER_LOCATION_ZOOM = 16;
const BITE_TRAIL_CLUSTER_RADIUS = 52;

const formatCurrency = (entry: BiteTrailFoodEntry) =>
  new Intl.NumberFormat("en-SG", {
    currency: entry.currency,
    maximumFractionDigits: 1,
    style: "currency",
  }).format(entry.costPerPerson);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00+08:00`));

const getOwnerLabel = (entry: BiteTrailFoodEntry) =>
  entry.ownerKind === "you" ? "Your list" : `${entry.ownerName}'s list`;

const createEntryIconHtml = (entry: BiteTrailFoodEntry, isSelected = false) => `
  <span class="bite-trail-marker ${entry.ownerKind === "you" ? "bite-trail-marker--own" : "bite-trail-marker--friend"} ${isSelected ? "bite-trail-marker--selected" : ""}">
    <span class="bite-trail-marker__dot"></span>
  </span>
`;

const createClusterIconHtml = (count: number, isSelected = false) => `
  <span class="bite-trail-cluster ${isSelected ? "bite-trail-cluster--selected" : ""}">
    <span>${count}</span>
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
    <p className="text-[0.95rem] text-[color:var(--site-text-strong)]">{value}</p>
  </div>
);

const EntryDetailPanel = ({
  entry,
}: {
  entry: BiteTrailFoodEntry;
}) => (
  <aside className="site-surface-card flex min-h-[390px] flex-col rounded-[22px] p-5">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
          Selected bite
        </p>
        <h3 className="text-[1.7rem] font-semibold leading-tight text-[color:var(--site-text-strong)]">
          {entry.placeName}
        </h3>
      </div>
    </div>

    <div className="mb-5 flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-accent-border-soft)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] text-[color:var(--site-text-strong)]">
        <FaUsers className="text-[color:var(--site-accent-soft)]" />
        {getOwnerLabel(entry)}
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] text-[color:var(--site-text)]">
        <FaMapPin className="text-[color:var(--site-accent-soft)]" />
        {entry.neighborhood}
      </span>
      <span className="inline-flex items-center rounded-full border border-[color:var(--site-border)] bg-[color:var(--site-bg-strong)] px-3 py-1.5 text-[0.78rem] capitalize text-[color:var(--site-text)]">
        {entry.cuisineGenre}
      </span>
    </div>

    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xxl:grid-cols-3">
      <EntryStat
        icon={<FaStar />}
        label="Rating"
        value={`${entry.ratingOutOf10} / 10`}
      />
      <EntryStat icon={<FaBowlFood />} label="Cost" value={`${formatCurrency(entry)} / pax`} />
      <EntryStat icon={<FaRegCalendar />} label="Visited" value={formatDate(entry.visitedAt)} />
    </div>

    {entry.itemsBought ? (
      <div className="mt-5">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
          Ordered
        </p>
        <p className="mt-2 leading-7 text-[color:var(--site-text)]">{entry.itemsBought}</p>
      </div>
    ) : null}

    <div className="mt-5">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
        Comments
      </p>
      <p className="mt-2 leading-7 text-[color:var(--site-text)]">{entry.comments}</p>
    </div>
  </aside>
);

const ClusterListPanel = ({
  entries,
  onSelect,
  onHover,
}: {
  entries: BiteTrailFoodEntry[];
  onSelect: (entry: BiteTrailFoodEntry) => void;
  onHover: (entry: BiteTrailFoodEntry | null) => void;
}) => (
  <aside className="site-surface-card flex min-h-[390px] flex-col rounded-[22px] p-5">
    <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
      Cluster preview
    </p>
    <h3 className="text-[1.7rem] font-semibold leading-tight text-[color:var(--site-text-strong)]">
      {entries.length} nearby places
    </h3>
    <div className="mt-5 grid gap-3">
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
            {entry.neighborhood} · {entry.cuisineGenre} · {entry.ratingOutOf10} / 10 ·{" "}
            {formatCurrency(entry)}
          </span>
        </button>
      ))}
    </div>
  </aside>
);

const EmptyPanel = () => (
  <aside className="site-surface-card flex min-h-[390px] flex-col justify-center rounded-[22px] p-5">
    <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-text-muted)]">
      Bite details
    </p>
    <h3 className="text-[1.7rem] font-semibold leading-tight text-[color:var(--site-text-strong)]">
      Select a pin or cluster
    </h3>
    <p className="mt-4 leading-7 text-[color:var(--site-text)]">
      This preview uses sample BiteTrail entries as if saved food places already exist. Pins
      open meal notes, cost, rating, and friend-list context without touching backend data yet.
    </p>
  </aside>
);

const BiteTrailMap = () => {
  const entries = mockFoodEntries;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const activeTooltipMarkerRef = useRef<L.Marker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    entries[0]?.id ?? null,
  );
  const [clusterEntryIds, setClusterEntryIds] = useState<string[]>([]);
  const selectedEntryIdRef = useRef<string | null>(selectedEntryId);
  selectedEntryIdRef.current = selectedEntryId;

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedEntryId) ?? null,
    [entries, selectedEntryId],
  );

  const clusterEntries = useMemo(
    () =>
      clusterEntryIds
        .map((entryId) => entries.find((entry) => entry.id === entryId))
        .filter((entry): entry is BiteTrailFoodEntry => Boolean(entry)),
    [clusterEntryIds, entries],
  );

  const syncSelectedMarkerStyles = () => {
    markerRefs.current.forEach((marker, entryId) => {
      marker
        .getElement()
        ?.querySelector(".bite-trail-marker")
        ?.classList.toggle("bite-trail-marker--selected", entryId === selectedEntryIdRef.current);
    });
  };

  const openEntryTooltip = (entry: BiteTrailFoodEntry) => {
    const map = mapInstanceRef.current;
    const marker = markerRefs.current.get(entry.id);
    const tooltip = marker?.getTooltip();
    if (!map || !marker || !tooltip) {
      return;
    }

    const visibleParent = markerClusterGroupRef.current?.getVisibleParent(marker);
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
  }, [selectedEntryId]);

  useEffect(() => {
    let isCancelled = false;
    const markerRegistry = markerRefs.current;

    const initialiseMap = async () => {
      if (!mapContainerRef.current || mapInstanceRef.current) {
        return;
      }

      const leafletModule = await import("leaflet");
      const L = leafletModule.default;
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
        setSelectedEntryId(null);
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

      const entryByMarker = new Map<number, BiteTrailFoodEntry>();
      const hasMarkerCluster = typeof L.markerClusterGroup === "function";
      const markers: L.FeatureGroup | L.MarkerClusterGroup = hasMarkerCluster
        ? L.markerClusterGroup({
            iconCreateFunction: (cluster) =>
              L.divIcon({
                className: "bite-trail-cluster-icon",
                html: createClusterIconHtml(
                  cluster.getChildCount(),
                  Boolean(
                    selectedEntryIdRef.current &&
                      cluster.getAllChildMarkers().some(
                        (marker: L.Marker) =>
                          entryByMarker.get(L.stamp(marker))?.id === selectedEntryIdRef.current,
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
            html: createEntryIconHtml(entry, entry.id === selectedEntryIdRef.current),
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
          setSelectedEntryId(entry.id);
          setClusterEntryIds([]);
        });
        markers.addLayer(marker);
      });

      if (hasMarkerCluster) {
        markers.on("clusterclick", (event) => {
          const clusterEvent = event as ClusterEvent;
          const originalEvent = (clusterEvent as L.LeafletMouseEvent).originalEvent;
          if (originalEvent) {
            L.DomEvent.stopPropagation(originalEvent);
          }
          const clusterGroup = markers as L.MarkerClusterGroup;
          const childMarkers = clusterEvent.layer.getAllChildMarkers();
          const nextClusterEntries = clusterEvent.layer
            .getAllChildMarkers()
            .map((marker: L.Marker) => entryByMarker.get(L.stamp(marker)))
            .filter((entry: BiteTrailFoodEntry | undefined): entry is BiteTrailFoodEntry =>
              Boolean(entry),
            );

          setClusterEntryIds(nextClusterEntries.map((entry: BiteTrailFoodEntry) => entry.id));
          setSelectedEntryId(null);
          const revealNextClusterLevel = () => {
            const visibleParents = new Set(
              childMarkers.map((marker: L.Marker) => clusterGroup.getVisibleParent(marker)),
            );
            const hasIndividualMarker = childMarkers.some(
              (marker: L.Marker) => clusterGroup.getVisibleParent(marker) === marker,
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
      markerRegistry.clear();
      markerClusterGroupRef.current = null;
      activeTooltipMarkerRef.current?.closeTooltip();
      activeTooltipMarkerRef.current = null;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [entries]);

  const recenterMap = () => {
    mapInstanceRef.current?.setView(SINGAPORE_CENTER, SINGAPORE_ZOOM);
    setLocationError(null);
    setClusterEntryIds([]);
    setSelectedEntryId(entries[0]?.id ?? null);
  };

  const centerToUser = () => {
    if (!navigator.geolocation) {
      setLocationError("Current location is not available in this browser.");
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

        mapInstanceRef.current?.setView(nextCenter, USER_LOCATION_ZOOM);
        setClusterEntryIds([]);
        setSelectedEntryId(null);
        setIsLocatingUser(false);
      },
      () => {
        setLocationError("Location permission was denied or unavailable.");
        setIsLocatingUser(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 10000,
      },
    );
  };

  const focusEntry = (entry: BiteTrailFoodEntry) => {
    setSelectedEntryId(entry.id);
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
    const visibleParent = markerClusterGroupRef.current?.getVisibleParent(marker);
    const parentCluster =
      visibleParent && visibleParent !== marker ? (visibleParent as L.MarkerCluster) : null;
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

  const previewEntryHover = (entry: BiteTrailFoodEntry | null) => {
    if (!entry) {
      markerRefs.current.forEach((marker) => marker.closeTooltip());
      activeTooltipMarkerRef.current?.closeTooltip();
      activeTooltipMarkerRef.current = null;
      return;
    }

    openEntryTooltip(entry);
  };

  const panel =
    selectedEntry ? (
      <EntryDetailPanel entry={selectedEntry} />
    ) : clusterEntries.length > 0 ? (
      <ClusterListPanel
        entries={clusterEntries}
        onSelect={focusEntry}
        onHover={previewEntryHover}
      />
    ) : (
      <EmptyPanel />
    );

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)] xl:h-[700px]">
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
            <button
              type="button"
              onClick={centerToUser}
              disabled={!isMapLoaded || isLocatingUser}
              aria-label="Center map to my current location"
              title="Center to me"
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--site-border-strong)] bg-[color:var(--site-bg-chrome)] text-[color:var(--site-text-strong)] shadow-[0_14px_30px_rgba(0,0,0,0.34)] transition duration-150 hover:border-[color:var(--site-accent-border-soft-hover)] hover:text-[color:var(--site-accent-soft)] focus-visible:border-[color:var(--site-accent-border-soft-hover)] focus-visible:text-[color:var(--site-accent-soft)] disabled:pointer-events-none disabled:opacity-55"
            >
              <FaLocationCrosshairs className={isLocatingUser ? "h-4 w-4 animate-pulse" : "h-4 w-4"} />
            </button>
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
          <button
            type="button"
            onClick={recenterMap}
            className="inline-flex items-center gap-2 text-[0.82rem] text-[color:var(--site-text-muted)] transition-colors duration-150 hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
          >
            <FaLocationCrosshairs />
            Singapore
          </button>
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
            <InfoTooltip ariaLabel="Leaflet map attribution" preferredPlacement="left">
              <p className="m-0">
                Map tiles are rendered with Leaflet and OpenStreetMap. Entries are sample data
                for the current UI pass.
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
