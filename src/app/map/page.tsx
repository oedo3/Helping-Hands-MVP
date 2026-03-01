"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Search, Navigation, Layers, MapPin, Clock } from "lucide-react";
import { events } from "@/lib/data";
import { EventCard } from "@/components/EventCard";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const categoryColors: Record<string, string> = {
  "Food & Hunger": "#E74C3C",
  Environment: "#27AE60",
  Housing: "#FF8C42",
  Animals: "#2D8CFF",
  Education: "#6C5CE7",
  "Elderly Care": "#F39C12",
};

export default function MapPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const searchResults = searchQuery.trim()
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  function handleSelectResult(id: string) {
    setSelectedEvent(id);
    setSearchQuery("");
    setShowResults(false);
  }

  return (
    <div className="h-screen md:h-[calc(100vh-57px)] flex flex-col">
      <div className="sticky top-0 z-40 bg-white border-b border-border/50">
        <div className="px-4 py-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search events, categories, locations..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg border border-border text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />

            {/* Search results dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-border shadow-lg overflow-hidden z-50">
                {searchResults.map((event) => {
                  const color = categoryColors[event.category] ?? "#2D8CFF";
                  return (
                    <button
                      key={event.id}
                      onMouseDown={() => handleSelectResult(event.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-border/50 last:border-0"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                        style={{ backgroundColor: color + "20" }}
                      >
                        {event.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{event.title}</p>
                        <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {event.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {event.time}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: color + "20", color }}
                      >
                        {event.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* No results state */}
            {showResults && searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-border shadow-lg px-4 py-3 z-50">
                <p className="text-sm text-text-muted">No events match &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex-1">
        {/* Live map */}
        <div className="absolute inset-0 z-0">
          <MapView
            events={events}
            selectedId={selectedEvent}
            onSelect={setSelectedEvent}
          />
        </div>

        {/* Map controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Navigation size={18} className="text-text-secondary" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Layers size={18} className="text-text-secondary" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <p className="text-[10px] font-semibold text-text-secondary mb-2 uppercase tracking-wider">Categories</p>
          <div className="flex flex-col gap-1.5">
            {Object.entries(categoryColors).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-text-secondary">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom list */}
      <div className="bg-white border-t border-border/50 max-h-[35%] overflow-y-auto pb-20 md:pb-0">
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Nearby Opportunities</h3>
          <div className="flex flex-col gap-2">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`transition-all cursor-pointer ${
                  selectedEvent === event.id ? "ring-2 ring-primary rounded-2xl" : ""
                }`}
              >
                <EventCard event={event} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
