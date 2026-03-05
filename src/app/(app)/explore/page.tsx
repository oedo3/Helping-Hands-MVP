"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, TrendingUp, X } from "lucide-react";
import { Header } from "@/components/Header";
import { EventCard } from "@/components/EventCard";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { events as localEvents, categories } from "@/lib/data";
import type { VolunteerEvent, DbEvent } from "@/lib/types";
import { getUpcomingEvents } from "@/lib/supabase/queries/events";
import { useAppContext } from "@/context/AppContext";

function dbEventToVolunteerEvent(e: DbEvent, interests: string[]): VolunteerEvent {
  const matchPercent = interests.includes(e.category)
    ? Math.floor(Math.random() * 15) + 85
    : Math.floor(Math.random() * 30) + 55;
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
    matchPercent,
    distance: "Near you",
    image: e.imageUrl ?? "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&auto=format&fit=crop",
    description: e.description,
    lat: e.lat,
    lng: e.lng,
  };
}

type SortOption = "match" | "date" | "spots";

interface Filters {
  sort: SortOption;
  dateRange: "any" | "week" | "month";
  categories: Set<string>;
}

const defaultFilters: Filters = {
  sort: "match",
  dateRange: "any",
  categories: new Set(),
};

function applyFilters(evts: VolunteerEvent[], q: string, filters: Filters) {
  const today = new Date().toISOString().split("T")[0];
  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const monthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  let result = evts.filter((e) => {
    const matchesSearch =
      !q ||
      e.title.toLowerCase().includes(q.toLowerCase()) ||
      e.organization.toLowerCase().includes(q.toLowerCase());
    const matchesCat = filters.categories.size === 0 || filters.categories.has(e.category);
    const matchesDate =
      filters.dateRange === "any" ||
      (filters.dateRange === "week" && e.date >= today && e.date <= weekFromNow) ||
      (filters.dateRange === "month" && e.date >= today && e.date <= monthFromNow);
    return matchesSearch && matchesCat && matchesDate;
  });

  if (filters.sort === "match") {
    result = [...result].sort((a, b) => b.matchPercent - a.matchPercent);
  } else if (filters.sort === "date") {
    result = [...result].sort((a, b) => a.date.localeCompare(b.date));
  } else if (filters.sort === "spots") {
    result = [...result].sort((a, b) => b.spotsLeft - a.spotsLeft);
  }

  return result;
}

export default function ExplorePage() {
  const { userProfile } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [liveEvents, setLiveEvents] = useState<VolunteerEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Load from Supabase with 3s timeout, fall back to local events
  useEffect(() => {
    let cancelled = false;
    const timeout = new Promise<DbEvent[]>((resolve) => setTimeout(() => resolve([]), 3000));
    Promise.race([getUpcomingEvents(40), timeout])
      .then((dbEvents) => {
        if (cancelled) return;
        if (dbEvents.length > 0) {
          setLiveEvents(dbEvents.map((e) => dbEventToVolunteerEvent(e, userProfile.interests)));
        } else {
          setLiveEvents(localEvents);
        }
        setLoadingEvents(false);
      })
      .catch(() => {
        if (!cancelled) {
          setLiveEvents(localEvents);
          setLoadingEvents(false);
        }
      });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activeFilterCount =
    (filters.sort !== "match" ? 1 : 0) +
    (filters.dateRange !== "any" ? 1 : 0) +
    filters.categories.size;

  const filteredEvents = useMemo(() => {
    const base = liveEvents.filter(
      (e) => selectedCategory === "All" || e.category === selectedCategory
    );
    return applyFilters(base, searchQuery, filters);
  }, [searchQuery, selectedCategory, filters, liveEvents]);

  const detailEvent = detailId ? liveEvents.find((e) => e.id === detailId) ?? null : null;

  function toggleFilterCategory(cat: string) {
    setFilters((prev) => {
      const next = new Set(prev.categories);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return { ...prev, categories: next };
    });
  }

  function clearFilters() {
    setFilters(defaultFilters);
  }

  return (
    <div className="md:max-w-6xl md:mx-auto md:px-8 md:pt-6">
      <Header />

      <div className="px-4 pt-4 md:px-0 md:pt-0">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-card border border-border text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <button
            onClick={() => setFilterOpen(true)}
            className="btn-gradient absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center"
          >
            <SlidersHorizontal size={14} className="text-white" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-danger rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:overflow-x-visible">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "btn-gradient text-white shadow-sm"
                  : "bg-card text-text-secondary border border-border hover:bg-border/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 md:px-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <h2 className="text-sm font-semibold text-text-primary">Recommended for You</h2>
          </div>
          <span className="text-xs text-text-muted">{filteredEvents.length} results</span>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-text-secondary">Filters active</span>
            <button
              onClick={clearFilters}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <X size={11} />
              Clear all
            </button>
          </div>
        )}

        {loadingEvents ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-pulse">
                <div className="h-32 bg-border/40" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-border/40 rounded w-3/4" />
                  <div className="h-3 bg-border/40 rounded w-1/2" />
                  <div className="h-3 bg-border/40 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={setDetailId}
              />
            ))}
          </div>
        )}

        {!loadingEvents && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-text-secondary font-medium">No opportunities found</p>
            <p className="text-text-muted text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <div className="h-6" />

      {/* Filter panel */}
      {filterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]"
            onClick={() => setFilterOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[2001] bg-card rounded-t-3xl shadow-2xl p-5 animate-sheet-up md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:rounded-3xl md:animate-modal-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-text-primary text-lg">Filter & Sort</h3>
              <button onClick={() => setFilterOpen(false)}>
                <X size={20} className="text-text-muted" />
              </button>
            </div>

            {/* Sort */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Sort by</p>
              <div className="flex gap-2">
                {([["match", "Best Match"], ["date", "Soonest"], ["spots", "Most Spots"]] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setFilters((f) => ({ ...f, sort: val }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      filters.sort === val
                        ? "btn-gradient text-white"
                        : "bg-bg border border-border text-text-secondary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date range */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Date Range</p>
              <div className="flex gap-2">
                {([["any", "Any Time"], ["week", "This Week"], ["month", "This Month"]] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setFilters((f) => ({ ...f, dateRange: val }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      filters.dateRange === val
                        ? "btn-gradient text-white"
                        : "bg-bg border border-border text-text-secondary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.filter((c) => c !== "All").map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      filters.categories.has(cat)
                        ? "btn-gradient text-white"
                        : "bg-bg border border-border text-text-secondary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 rounded-2xl border border-border text-text-secondary text-sm font-semibold hover:bg-border/40 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="btn-gradient flex-1 py-3 rounded-2xl text-white text-sm font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}

      <EventDetailSheet
        event={detailEvent}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}
