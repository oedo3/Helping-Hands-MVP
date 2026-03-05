"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle2, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { events } from "@/lib/data";
import { useAppContext } from "@/context/AppContext";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SchedulePage() {
  const { signedUpIds } = useAppContext();
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [scheduleTab, setScheduleTab] = useState<"upcoming" | "past">("upcoming");
  const [detailId, setDetailId] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Calendar dots only for signed-up events
  const signedUpDates = useMemo(
    () => new Set(events.filter((e) => signedUpIds.has(e.id)).map((e) => e.date)),
    [signedUpIds]
  );

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const goToToday = () => {
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setSelectedDate(todayStr);
  };

  const getDateString = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  const selectedEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : [];

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => signedUpIds.has(e.id) && e.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [signedUpIds, todayStr]
  );

  const pastEvents = useMemo(
    () =>
      events
        .filter((e) => signedUpIds.has(e.id) && e.date < todayStr)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [signedUpIds, todayStr]
  );

  const displayedEvents = scheduleTab === "upcoming" ? upcomingEvents : pastEvents;
  const detailEvent = detailId ? events.find((e) => e.id === detailId) ?? null : null;

  return (
    <div>
      <Header />

      <div className="px-4 pt-4 md:max-w-6xl md:mx-auto md:px-8 md:pt-6">
        <div className="md:grid md:grid-cols-2 md:gap-6 md:items-start">

          {/* Left column: calendar */}
          <div>
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="w-8 h-8 rounded-lg hover:bg-border/40 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft size={18} className="text-text-secondary" />
                </button>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-text-primary">
                    {monthNames[currentMonth]} {currentYear}
                  </h2>
                  <button
                    onClick={goToToday}
                    className="text-[10px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                  >
                    Today
                  </button>
                </div>
                <button
                  onClick={nextMonth}
                  className="w-8 h-8 rounded-lg hover:bg-border/40 flex items-center justify-center transition-colors"
                >
                  <ChevronRight size={18} className="text-text-secondary" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-[10px] font-semibold text-text-muted py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = getDateString(day);
                  const hasEvent = signedUpDates.has(dateStr);
                  const isSelected = selectedDate === dateStr;
                  const isToday = dateStr === todayStr;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`relative w-full aspect-square rounded-lg flex items-center justify-center text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? "bg-primary text-white font-semibold"
                          : isToday
                          ? "bg-primary-light text-primary font-semibold"
                          : "hover:bg-border/40 text-text-primary"
                      }`}
                    >
                      {day}
                      {hasEvent && !isSelected && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected date events */}
            {selectedDate && selectedEvents.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Events on{" "}
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="flex flex-col gap-2">
                  {selectedEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setDetailId(event.id)}
                      className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 text-left w-full hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-2xl">
                          {event.image}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-text-primary">{event.title}</h4>
                          <p className="text-xs text-text-secondary mt-0.5">{event.organization}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {event.distance}
                            </span>
                          </div>
                          {signedUpIds.has(event.id) && (
                            <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-success">
                              <CheckCircle2 size={12} />
                              Signed Up
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedEvents.length === 0 && (
              <div className="mt-4 text-center py-8">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm text-text-secondary">No events on this date</p>
              </div>
            )}
          </div>

          {/* Right column: My Schedule */}
          <div>
            <div className="mt-6 md:mt-0">
              {/* Tab toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setScheduleTab("upcoming")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    scheduleTab === "upcoming"
                      ? "btn-gradient text-white"
                      : "bg-card border border-border text-text-secondary hover:bg-border/40"
                  }`}
                >
                  Upcoming {upcomingEvents.length > 0 && `(${upcomingEvents.length})`}
                </button>
                <button
                  onClick={() => setScheduleTab("past")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    scheduleTab === "past"
                      ? "btn-gradient text-white"
                      : "bg-card border border-border text-text-secondary hover:bg-border/40"
                  }`}
                >
                  Past {pastEvents.length > 0 && `(${pastEvents.length})`}
                </button>
              </div>

              {displayedEvents.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-border/50 shadow-sm">
                  <div className="text-4xl mb-3">
                    {scheduleTab === "upcoming" ? "🗓️" : "📋"}
                  </div>
                  <p className="font-semibold text-text-primary mb-1">
                    {scheduleTab === "upcoming" ? "No upcoming sessions" : "No past sessions"}
                  </p>
                  <p className="text-sm text-text-secondary mb-4">
                    {scheduleTab === "upcoming"
                      ? "Sign up for volunteer events to see them here."
                      : "Completed events will appear here."}
                  </p>
                  {scheduleTab === "upcoming" && (
                    <Link
                      href="/explore"
                      className="btn-gradient inline-block px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
                    >
                      Explore Opportunities
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {displayedEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setDetailId(event.id)}
                      className={`bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex items-center gap-3 w-full text-left hover:border-primary/30 transition-colors ${
                        scheduleTab === "past" ? "opacity-70" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center w-12 shrink-0">
                        <span className="text-xs font-semibold text-primary">
                          {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-lg font-bold text-text-primary">
                          {new Date(event.date + "T00:00:00").getDate()}
                        </span>
                      </div>
                      <div className="w-px h-10 bg-border" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate text-text-primary">{event.title}</h4>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {event.time} · {event.location}
                        </p>
                        {scheduleTab === "past" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success mt-1">
                            <CalendarDays size={10} />
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-lg shrink-0">
                        {event.image}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="h-6" />

      <EventDetailSheet event={detailEvent} onClose={() => setDetailId(null)} />
    </div>
  );
}
