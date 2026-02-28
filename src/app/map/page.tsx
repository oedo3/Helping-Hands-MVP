"use client";

import { useState } from "react";
import { Search, Navigation, Layers } from "lucide-react";
import { events } from "@/lib/data";
import { EventCard } from "@/components/EventCard";

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
    <div className="h-screen flex flex-col">
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
        {/* Map area */}
        <div className="absolute inset-0 bg-[#e8ebe4]">
          <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            {/* Roads */}
            <line x1="0" y1="150" x2="400" y2="150" stroke="#ffffff" strokeWidth="3" />
            <line x1="0" y1="300" x2="400" y2="300" stroke="#ffffff" strokeWidth="4" />
            <line x1="0" y1="450" x2="400" y2="450" stroke="#ffffff" strokeWidth="3" />
            <line x1="100" y1="0" x2="100" y2="600" stroke="#ffffff" strokeWidth="3" />
            <line x1="200" y1="0" x2="200" y2="600" stroke="#ffffff" strokeWidth="4" />
            <line x1="300" y1="0" x2="300" y2="600" stroke="#ffffff" strokeWidth="3" />
            <line x1="50" y1="0" x2="350" y2="600" stroke="#ffffff" strokeWidth="2" />
            <line x1="350" y1="0" x2="50" y2="600" stroke="#ffffff" strokeWidth="2" />

            {/* Water feature */}
            <ellipse cx="350" cy="500" rx="80" ry="120" fill="#b8d4e3" opacity="0.5" />

            {/* Park areas */}
            <rect x="60" y="200" width="60" height="60" rx="8" fill="#c8dcc0" opacity="0.6" />
            <rect x="280" y="100" width="50" height="50" rx="8" fill="#c8dcc0" opacity="0.6" />

            {/* Map pins */}
            {events.map((event, i) => {
              const positions = [
                { x: 120, y: 100 },
                { x: 250, y: 180 },
                { x: 80, y: 280 },
                { x: 320, y: 250 },
                { x: 180, y: 380 },
                { x: 280, y: 420 },
                { x: 150, y: 480 },
                { x: 60, y: 430 },
              ];
              const pos = positions[i] || { x: 200, y: 300 };
              const color = categoryColors[event.category] || "#2D8CFF";
              const isSelected = selectedEvent === event.id;

              return (
                <g
                  key={event.id}
                  onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r="20" fill={color} opacity="0.2">
                      <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <g transform={`translate(${pos.x - 12}, ${pos.y - 32})`}>
                    <path
                      d="M12 0C5.4 0 0 5.4 0 12c0 9 12 22 12 22s12-13 12-22c0-6.6-5.4-12-12-12z"
                      fill={color}
                    />
                    <circle cx="12" cy="12" r="5" fill="white" />
                  </g>
                </g>
              );
            })}

            {/* Current location indicator */}
            <circle cx="200" cy="300" r="8" fill="#2D8CFF" opacity="0.3">
              <animate attributeName="r" values="8;14;8" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="300" r="6" fill="#2D8CFF" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Navigation size={18} className="text-text-secondary" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Layers size={18} className="text-text-secondary" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
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
      <div className="bg-white border-t border-border/50 max-h-[35%] overflow-y-auto pb-20">
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Nearby Opportunities</h3>
          <div className="flex flex-col gap-2">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`transition-all ${
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
