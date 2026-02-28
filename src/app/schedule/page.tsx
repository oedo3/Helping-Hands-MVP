"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { events } from "@/lib/data";

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

const eventDates = events.map((e) => e.date);

export default function SchedulePage() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDateString = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  const selectedEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : [];

  const upcomingEvents = events
    .filter((e) => e.isSignedUp && new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <Header />

      <div className="px-4 pt-4">
        {/* Calendar */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} className="text-text-secondary" />
            </button>
            <h2 className="font-semibold text-text-primary">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
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
              const hasEvent = eventDates.includes(dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday =
                day === now.getDate() &&
                currentMonth === now.getMonth() &&
                currentYear === now.getFullYear();

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`relative w-full aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                    isSelected
                      ? "bg-primary text-white font-semibold"
                      : isToday
                      ? "bg-primary-light text-primary font-semibold"
                      : "hover:bg-gray-50 text-text-primary"
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
                <div
                  key={event.id}
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-2xl">
                      {event.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {event.organization}
                      </p>
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
                      {event.isSignedUp && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-success">
                          <CheckCircle2 size={12} />
                          Signed Up
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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

        {/* My upcoming signed-up events */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">
            My Schedule
          </h3>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm text-text-secondary">No upcoming sessions</p>
              <p className="text-xs text-text-muted mt-1">Sign up for events on the Explore tab</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex items-center gap-3"
                >
                  <div className="flex flex-col items-center justify-center w-12 shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-lg font-bold text-text-primary">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{event.title}</h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {event.time} &middot; {event.location}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-lg">
                    {event.image}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}
