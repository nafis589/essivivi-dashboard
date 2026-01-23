"use client";

import { useState } from "react";
import { MapFilters } from "./filters";
import { MapComponent } from "./map";
import { MapStatsCards } from "./stats-cards";

export function CartographyView() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* Statistiques */}
      <MapStatsCards 
        selectedDate={selectedDate}
        selectedZone={selectedZone}
        selectedAgent={selectedAgent}
      />

      {/* Filtres */}
      <MapFilters
        onDateChange={setSelectedDate}
        onZoneChange={setSelectedZone}
        onAgentChange={setSelectedAgent}
        onHeatmapToggle={setShowHeatmap}
        onRoutesToggle={setShowRoutes}
        selectedDate={selectedDate}
        selectedZone={selectedZone}
        selectedAgent={selectedAgent}
      />

      {/* Carte Interactive */}
      <MapComponent
        selectedDate={selectedDate}
        selectedZone={selectedZone}
        selectedAgent={selectedAgent}
        showHeatmap={showHeatmap}
        showRoutes={showRoutes}
      />
    </div>
  );
}
