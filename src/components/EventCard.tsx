"use client";

import { MapPin, Clock, Users, CheckCircle2 } from "lucide-react";
import type { VolunteerEvent } from "@/lib/types";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

interface EventCardProps {
  event: VolunteerEvent;
  variant?: "feed" | "compact";
  onViewDetails?: (id: string) => void;
}

export function EventCard({ event, variant = "feed", onViewDetails }: EventCardProps) {
  const { isSignedUp, toggleSignUp } = useAppContext();
  const { showToast } = useToast();
  const signedUp = isSignedUp(event.id);
  const spotsPercent = ((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100;

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    toggleSignUp(event.id);
    if (signedUp) {
      showToast("Registration cancelled", "info");
    } else {
      showToast(`Signed up for ${event.title}!`, "success");
    }
  }

  if (variant === "compact") {
    return (
      <div
        className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 flex items-center gap-4 cursor-pointer"
        onClick={() => onViewDetails?.(event.id)}
      >
        <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center text-2xl shrink-0">
          {event.image}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-text-primary truncate">{event.title}</h3>
          <p className="text-xs text-text-secondary mt-0.5">{event.distance} &middot; {event.time}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-primary">{event.matchPercent}% Match</span>
            {signedUp && (
              <span className="flex items-center gap-0.5 text-xs font-semibold text-success">
                <CheckCircle2 size={11} />
                Signed Up
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-card rounded-2xl shadow-[0_2px_12px_rgba(15,23,42,0.06)] border border-border/60 overflow-hidden cursor-pointer"
      onClick={() => onViewDetails?.(event.id)}
    >
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
              {signedUp ? (
                <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center shrink-0">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <span className="text-xs font-semibold bg-primary-light text-primary px-2 py-1 rounded-full shrink-0">
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
                {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
              <span className="text-xs text-text-muted">{event.distance}</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${spotsPercent}%`, background: "linear-gradient(to right, #2D8CFF, #7C68EE)" }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
          {signedUp ? (
            <>
              <button
                onClick={() => onViewDetails?.(event.id)}
                className="flex-1 py-2.5 rounded-xl bg-primary-light text-primary text-sm font-semibold hover:bg-blue-100 transition-colors"
              >
                Details
              </button>
              <button
                onClick={handleToggle}
                className="flex-1 py-2.5 rounded-xl bg-border/60 text-text-secondary text-sm font-semibold hover:bg-border transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleToggle}
              className="btn-gradient flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
