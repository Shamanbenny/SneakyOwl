"use client";

import type { Map as LeafletMap } from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import InfoTooltip from "./InfoTooltip";

const SINGAPORE_COORDINATES: [number, number] = [1.3015, 103.8493];
const SINGAPORE_ZOOM = 11;
const SINGAPORE_TIMEZONE = "Asia/Singapore";

const LocationMapCard: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isDaytime, setIsDaytime] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const singaporeTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: SINGAPORE_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      const singaporeHour = Number.parseInt(singaporeTime.split(":")[0], 10);
      setCurrentTime(singaporeTime);
      setIsDaytime(singaporeHour >= 6 && singaporeHour < 19);
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const initialiseMap = async () => {
      if (!mapContainerRef.current || mapInstanceRef.current) {
        return;
      }

      const leafletModule = await import("leaflet");
      const L = leafletModule.default;

      if (isCancelled || !mapContainerRef.current) {
        return;
      }

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        touchZoom: true,
      }).setView(SINGAPORE_COORDINATES, SINGAPORE_ZOOM);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
          keepBuffer: 4,
          updateWhenIdle: false,
          updateWhenZooming: false,
        },
      ).addTo(map);

      mapInstanceRef.current = map;
      setIsMapLoaded(true);
    };

    void initialiseMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const recenterMap = () => {
    mapInstanceRef.current?.setView(SINGAPORE_COORDINATES, SINGAPORE_ZOOM);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-[0.45rem] text-[0.65em] uppercase tracking-[0.06em] text-[color:var(--site-text-muted)]">
          <span className="xxl:hidden">Based In</span>
          <span className="hidden xxl:inline">Currently Based In</span>
        </span>
        <InfoTooltip
          ariaLabel="Leaflet attribution"
          preferredPlacement="left"
          className="shrink-0"
        >
          <p className="m-0">
            Powered by{" "}
            <a
              href="https://leafletjs.com/"
              target="_blank"
              rel="noreferrer"
              className="site-link-accent underline decoration-[rgba(110,231,183,0.45)] underline-offset-[3px]"
            >
              Leaflet
            </a>
            .
          </p>
        </InfoTooltip>
      </div>
      <div className="site-location-map-frame relative min-h-[92px] flex-1 overflow-hidden rounded-[16px] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)]">
        <div
          ref={mapContainerRef}
          className="h-full w-full"
          aria-label="Map centered on Singapore"
        />
        {!isMapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--site-bg-soft)] text-[0.68em] text-[color:var(--site-text-muted)]">
            Loading map...
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={recenterMap}
          className="text-[0.72em] text-[color:var(--site-text-muted)] transition-colors duration-150 ease-linear hover:text-[color:var(--site-accent-soft)] focus-visible:text-[color:var(--site-accent-soft)]"
        >
          Singapore
        </button>
        {currentTime ? (
          <div className="inline-flex items-center gap-1.5 text-[0.6em] font-medium text-[color:var(--site-accent-soft)]">
            {isDaytime ? (
              <FaSun className="text-[color:var(--site-accent)]" />
            ) : (
              <FaMoon className="text-[color:var(--site-accent-teal)]" />
            )}
            <span className="font-mono">{currentTime}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LocationMapCard;
