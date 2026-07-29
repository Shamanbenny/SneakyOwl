"use client";

import { useEffect, useRef, useState } from "react";

import BiteTrailDataPanel, {
  type BiteTrailSavedEntry,
} from "@/app/components/tools/bite-trail/BiteTrailDataPanel";
import BiteTrailMapData from "@/app/components/tools/bite-trail/BiteTrailMapData";
import type { BiteTrailResolvedPlace } from "@/app/components/tools/bite-trail/mockFoodEntries";

const BiteTrailWorkspace = () => {
  type DiscardRequest =
    | "location"
    | "entry"
    | "switch-entry"
    | "start-location";
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [activePlace, setActivePlace] = useState<BiteTrailResolvedPlace | null>(
    null,
  );
  const [savedEntry, setSavedEntry] = useState<BiteTrailSavedEntry | null>(
    null,
  );
  const [discardRequest, setDiscardRequest] = useState<DiscardRequest | null>(
    null,
  );
  const [pendingPlace, setPendingPlace] =
    useState<BiteTrailResolvedPlace | null>(null);
  const [startLocationPickerRequest, setStartLocationPickerRequest] =
    useState(0);
  const dataPanelRef = useRef<HTMLDivElement>(null);

  const discardEntry = () => {
    setActivePlace(null);
    setCoordinates({ latitude: "", longitude: "" });
  };

  const openEntry = (place: BiteTrailResolvedPlace) => {
    setActivePlace(place);
    setCoordinates({ latitude: "", longitude: "" });
    window.requestAnimationFrame(() => {
      dataPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleAddEntry = (place: BiteTrailResolvedPlace) => {
    if (activePlace || coordinates.latitude || coordinates.longitude) {
      setPendingPlace(place);
      setDiscardRequest("switch-entry");
      return;
    }
    openEntry(place);
  };

  const cancelDiscard = () => {
    setDiscardRequest(null);
    setPendingPlace(null);
  };

  useEffect(() => {
    if (!discardRequest) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancelDiscard();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [discardRequest]);

  const confirmDiscard = () => {
    const nextPlace = discardRequest === "switch-entry" ? pendingPlace : null;
    const shouldStartLocationPicker = discardRequest === "start-location";
    setDiscardRequest(null);
    setPendingPlace(null);
    if (nextPlace) {
      openEntry(nextPlace);
    } else {
      discardEntry();
      if (shouldStartLocationPicker) {
        setStartLocationPickerRequest((current) => current + 1);
      }
    }
  };

  return (
    <>
      <BiteTrailMapData
        latitude={coordinates.latitude}
        longitude={coordinates.longitude}
        hasActiveEntry={Boolean(
          activePlace || coordinates.latitude || coordinates.longitude,
        )}
        onLocationChange={(latitude, longitude) => {
          setActivePlace(null);
          setCoordinates({ latitude, longitude });
        }}
        onRequestClearDraft={() => setDiscardRequest("location")}
        onRequestStartNewLocation={() => setDiscardRequest("start-location")}
        startLocationPickerRequest={startLocationPickerRequest}
        onAddEntry={handleAddEntry}
        savedEntry={savedEntry}
      />
      <div ref={dataPanelRef} className="mt-6 scroll-mt-6">
        <BiteTrailDataPanel
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          onLocationChange={(latitude, longitude) =>
            setCoordinates({ latitude, longitude })
          }
          activePlace={activePlace}
          onDiscard={discardEntry}
          onRequestDiscard={() => setDiscardRequest("entry")}
          onSaved={setSavedEntry}
        />
      </div>
      {discardRequest ? (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) cancelDiscard();
          }}
        >
          <div
            className="site-surface-card w-full max-w-md rounded-[22px] border border-[color:var(--site-border-strong)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bite-trail-discard-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2
              id="bite-trail-discard-title"
              className="m-0 text-xl font-semibold text-[color:var(--site-text-strong)]"
            >
              {discardRequest === "switch-entry"
                ? "Start a different entry?"
                : discardRequest === "start-location"
                  ? "Start a new location?"
                  : `Discard ${discardRequest === "location" ? "new location" : "new entry"}?`}
            </h2>
            <p className="mt-3 leading-6 text-[color:var(--site-text-muted)]">
              {discardRequest === "switch-entry"
                ? "Your current entry will be discarded before opening the selected location."
                : discardRequest === "start-location"
                  ? "Your current entry will be discarded before location picking starts."
                  : `Any information entered for this ${discardRequest} will be lost.`}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[color:var(--site-border-strong)] px-4 font-semibold text-[color:var(--site-text-strong)] transition hover:border-[color:var(--site-accent-border-soft-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent-focus-ring)]"
                onClick={cancelDiscard}
              >
                Keep editing
              </button>
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[color:var(--site-accent-red)] bg-[color:var(--site-accent-red)] px-4 font-semibold text-[color:var(--site-bg)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-accent-red)]"
                onClick={confirmDiscard}
              >
                {discardRequest === "switch-entry" ||
                discardRequest === "start-location"
                  ? "Discard"
                  : "Discard"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default BiteTrailWorkspace;
