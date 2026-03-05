"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, Navigation, MapPin, Clock } from "lucide-react";
import { events as localEvents } from "@/lib/data";
import { EventCard } from "@/components/EventCard";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { categoryColors } from "@/lib/constants";
import { getUpcomingEvents } from "@/lib/supabase/queries/events";
import type { VolunteerEvent, DbEvent } from "@/lib/types";

function dbEventToVolunteerEvent(e: DbEvent): VolunteerEvent {
  return {
    id: e.id,
    title: e.title,
    organization: e.organizationName,
    location: e.address,
    date: e.eventDate,
    time: e.eventTime,
    spotsLeft: e.spotsRemaining,
    totalSpots: e.totalSpots,
    category: e.category,
    matchPercent: 75,
    distance: "Near you",
    image: e.imageUrl ?? "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&auto=format&fit=crop",
    description: e.description,
    lat: e.lat,
    lng: e.lng,
  };
}

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-border/40 animate-pulse flex items-center justify-center">
      <p className="text-text-muted text-sm">Loading map…</p>
    </div>
  ),
});

export default function MapPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [detailId, setDetailId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [liveEvents, setLiveEvents] = useState<VolunteerEvent[]>(localEvents);

  useEffect(() => {
    let cancelled = false;
    const timeout = new Promise<DbEvent[]>((resolve) => setTimeout(() => resolve([]), 3000));
    Promise.race([getUpcomingEvents(40), timeout])
      .then((dbEvents) => {
        if (cancelled) return;
        if (dbEvents.length > 0) setLiveEvents(dbEvents.map(dbEventToVolunteerEvent));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const searchResults = searchQuery.trim()
    ? liveEvents.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const visibleEvents =
    activeCategories.size === 0
      ? liveEvents
      : liveEvents.filter((e) => activeCategories.has(e.category));

  function handleSelectResult(id: string) {
    setSelectedEvent(id);
    setSearchQuery("");
    setShowResults(false);
  }

  function toggleCategory(cat: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  const detailEvent = detailId ? liveEvents.find((e) => e.id === detailId) ?? null : null;

  return (
    <div className="h-screen md:h-[calc(100vh-57px)] flex flex-col">
      {/* Search bar */}
      <div className="sticky top-0 z-40 bg-card border-b border-border/50">
        <div className="px-4 py-3">
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search events, categories, locations..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg border border-border text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-xl border border-border shadow-lg overflow-hidden z-50">
                {searchResults.map((event) => {
                  const color = categoryColors[event.category] ?? "#2D8CFF";
                  return (
                    <button
                      key={event.id}
                      onMouseDown={() => handleSelectResult(event.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-border/40 transition-colors text-left border-b border-border/50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ backgroundColor: color + "20" }}>
                        {event.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">{event.title}</p>
                        <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                          <span className="flex items-center gap-1"><MapPin size={10} />{event.distance}</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{event.time}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: color + "20", color }}>
                        {event.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {showResults && searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-xl border border-border shadow-lg px-4 py-3 z-50">
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
            events={visibleEvents}
            selectedId={selectedEvent}
            onSelect={setSelectedEvent}
            userLocation={userLocation}
          />
        </div>

        {/* Map controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={handleLocate}
            disabled={locating}
            title="My location"
            className={`w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center transition-colors ${
              locating ? "opacity-50" : "hover:bg-border/40"
            } ${userLocation ? "ring-2 ring-primary" : ""}`}
          >
            <Navigation size={18} className={userLocation ? "text-primary" : "text-text-secondary"} />
          </button>
        </div>

        {/* Category filter legend */}
        <div className="absolute top-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <p className="text-[10px] font-semibold text-text-secondary mb-2 uppercase tracking-wider">Categories</p>
          <div className="flex flex-col gap-1.5">
            {Object.entries(categoryColors).map(([cat, color]) => {
              const active = activeCategories.size === 0 || activeCategories.has(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-2 transition-opacity ${active ? "" : "opacity-40"}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-text-secondary">{cat}</span>
                </button>
              );
            })}
          </div>
          {activeCategories.size > 0 && (
            <button
              onClick={() => setActiveCategories(new Set())}
              className="mt-2 text-[10px] text-primary font-semibold hover:underline"
            >
              Show all
            </button>
          )}
        </div>
      </div>

      {/* Bottom list */}
      <div className="bg-card border-t border-border/50 max-h-[35%] overflow-y-auto pb-20 md:pb-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">Nearby Opportunities</h3>
            <span className="text-xs text-text-muted">{visibleEvents.length} nearby</span>
          </div>
          <div className="flex flex-col gap-2">
            {visibleEvents.slice(0, 6).map((event) => (
              <div
                key={event.id}
                onClick={() => { setSelectedEvent(event.id); setDetailId(event.id); }}
                className={`transition-all cursor-pointer ${
                  selectedEvent === event.id ? "ring-2 ring-primary rounded-2xl" : ""
                }`}
              >
                <EventCard
                  event={event}
                  variant="compact"
                  onViewDetails={(id) => { setSelectedEvent(id); setDetailId(id); }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <EventDetailSheet event={detailEvent} onClose={() => setDetailId(null)} />
    </div>
  );
}
