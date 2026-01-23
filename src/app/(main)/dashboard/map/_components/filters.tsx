"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { CalendarIcon, FilterX, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cartographyService } from "@/services/cartography.service";

interface MapFiltersProps {
  onDateChange: (date: string) => void;
  onZoneChange: (zone: string) => void;
  onAgentChange: (agent: string) => void;
  onHeatmapToggle: (enabled: boolean) => void;
  onRoutesToggle: (enabled: boolean) => void;
  selectedDate?: string;
  selectedZone?: string;
  selectedAgent?: string;
}

export function MapFilters({
  onDateChange,
  onZoneChange,
  onAgentChange,
  onHeatmapToggle,
  onRoutesToggle,
  selectedDate,
  selectedZone,
  selectedAgent,
}: MapFiltersProps) {
  const [zones, setZones] = useState<Array<{ id: string; name: string }>>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [zonesData, agentsData] = await Promise.all([
          cartographyService.getAvailableZones(),
          cartographyService.getAvailableAgents(),
        ]);
        setZones(zonesData);
        setAgents(agentsData);
      } catch (error) {
        console.error("Erreur lors du chargement des filtres:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  const handleResetFilters = () => {
    onDateChange("");
    onZoneChange("");
    onAgentChange("");
    setShowHeatmap(false);
    setShowRoutes(false);
    onHeatmapToggle(false);
    onRoutesToggle(false);
  };

  const handleHeatmapToggle = (checked: boolean) => {
    setShowHeatmap(checked);
    onHeatmapToggle(checked);
  };

  const handleRoutesToggle = (checked: boolean) => {
    setShowRoutes(checked);
    onRoutesToggle(checked);
  };

  const hasActiveFilters = selectedDate || selectedZone || selectedAgent || showHeatmap || showRoutes;

  // Générer les 7 derniers jours
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, "yyyy-MM-dd");
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="size-5" />
              Filtres et Options
            </CardTitle>
            <CardDescription>Affinez votre vue de la cartographie</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              <FilterX className="mr-2 size-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 @md/main:grid-cols-2 @xl/main:grid-cols-4">
          {/* Filtre Date */}
          <div className="space-y-2">
            <Label htmlFor="date-select" className="text-xs font-semibold uppercase tracking-wide">
              <CalendarIcon className="mr-1 inline-block size-4" />
              Date
            </Label>
            <Select value={selectedDate || ""} onValueChange={onDateChange} disabled={loading}>
              <SelectTrigger id="date-select">
                <SelectValue placeholder="Sélectionner une date" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((date) => (
                  <SelectItem key={date} value={date}>
                    {format(new Date(date), "dd MMM yyyy", { locale: require("date-fns/locale/fr").fr })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre Zone */}
          <div className="space-y-2">
            <Label htmlFor="zone-select" className="text-xs font-semibold uppercase tracking-wide">
              📍 Zone
            </Label>
            <Select value={selectedZone || ""} onValueChange={onZoneChange} disabled={loading}>
              <SelectTrigger id="zone-select">
                <SelectValue placeholder="Toutes les zones" />
              </SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre Agent */}
          <div className="space-y-2">
            <Label htmlFor="agent-select" className="text-xs font-semibold uppercase tracking-wide">
              👤 Agent
            </Label>
            <Select value={selectedAgent || ""} onValueChange={onAgentChange} disabled={loading}>
              <SelectTrigger id="agent-select">
                <SelectValue placeholder="Tous les agents" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Options d'affichage */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide">Options</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="heatmap" checked={showHeatmap} onCheckedChange={handleHeatmapToggle} />
                <Label htmlFor="heatmap" className="font-normal cursor-pointer">
                  <Badge variant="outline" className="text-xs">
                    🔥 Heatmap
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="routes" checked={showRoutes} onCheckedChange={handleRoutesToggle} />
                <Label htmlFor="routes" className="font-normal cursor-pointer">
                  <Badge variant="outline" className="text-xs">
                    🛣️ Itinéraires
                  </Badge>
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Résumé des filtres actifs */}
        {hasActiveFilters && (
          <div className="mt-4 border-t pt-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Filtres actifs</p>
            <div className="flex flex-wrap gap-2">
              {selectedDate && (
                <Badge>
                  📅 {format(new Date(selectedDate), "dd MMM yyyy", { locale: require("date-fns/locale/fr").fr })}
                </Badge>
              )}
              {selectedZone && (
                <Badge>
                  📍 {zones.find((z) => z.id === selectedZone)?.name || selectedZone}
                </Badge>
              )}
              {selectedAgent && (
                <Badge>
                  👤 {agents.find((a) => a.id === selectedAgent)?.name || selectedAgent}
                </Badge>
              )}
              {showHeatmap && <Badge variant="secondary">🔥 Heatmap</Badge>}
              {showRoutes && <Badge variant="secondary">🛣️ Itinéraires</Badge>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
