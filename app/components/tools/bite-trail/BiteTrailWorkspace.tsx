"use client";

import { useRef, useState } from "react";

import BiteTrailDataPanel from "@/app/components/tools/bite-trail/BiteTrailDataPanel";
import BiteTrailMapData from "@/app/components/tools/bite-trail/BiteTrailMapData";
import type { BiteTrailPlace } from "@/app/components/tools/bite-trail/mockFoodEntries";

const BiteTrailWorkspace = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [activePlace, setActivePlace] = useState<BiteTrailPlace | null>(null);
  const dataPanelRef = useRef<HTMLDivElement>(null);

  const discardEntry = () => {
    setActivePlace(null);
    setCoordinates({ latitude: "", longitude: "" });
  };

  return (
    <>
      <BiteTrailMapData
        latitude={coordinates.latitude}
        longitude={coordinates.longitude}
        onLocationChange={(latitude, longitude) =>
          {
            setActivePlace(null);
            setCoordinates({ latitude, longitude });
          }
        }
        onAddEntry={(place) => {
          setActivePlace(place);
          setCoordinates({ latitude: "", longitude: "" });
          window.requestAnimationFrame(() => {
            dataPanelRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          });
        }}
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
        />
      </div>
    </>
  );
};

export default BiteTrailWorkspace;
