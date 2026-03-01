"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Search, Navigation, Layers } from "lucide-react";
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
              placeholder="Search nearby..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg border border-border text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
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
