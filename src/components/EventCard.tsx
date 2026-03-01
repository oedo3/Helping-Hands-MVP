"use client";

import { VolunteerEvent } from "@/lib/data";
import { MapPin, Clock, Users } from "lucide-react";

interface EventCardProps {
  event: VolunteerEvent;
  variant?: "feed" | "compact";
}

export function EventCard({ event, variant = "feed" }: EventCardProps) {
  const spotsPercent = ((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100;

  if (variant === "compact") {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center text-2xl shrink-0">
          {event.image}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-text-primary truncate">{event.title}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{event.distance} &middot; {event.time}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-semibold text-primary">{event.matchPercent}% Match</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.06)] border border-border/60 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 rounded-xl bg-primary-light flex items-center justify-center text-3xl shrink-0">
            {event.image}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-text-primary">{event.title}</h3>
                <p className="text-sm text-text-secondary">{event.organization}</p>
              </div>
              {event.isSignedUp ? (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <span className="text-xs font-semibold bg-primary-light text-primary px-2 py-1 rounded-full">
                  {event.matchPercent}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {event.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-xs text-text-secondary">
                <Users size={12} />
                {event.spotsLeft} spots left
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${spotsPercent}%`, background: "linear-gradient(to right, #2D8CFF, #7C68EE)" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {event.isSignedUp ? (
            <>
              <button className="flex-1 py-2.5 rounded-xl bg-primary-light text-primary text-sm font-semibold hover:bg-blue-100 transition-colors">
                Details
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-gray-100 text-text-secondary text-sm font-semibold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </>
          ) : (
            <button className="btn-gradient flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity">
              Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
