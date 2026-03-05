"use client";

import { useEffect } from "react";
import { X, MapPin, Clock, Users, Calendar } from "lucide-react";
import type { VolunteerEvent } from "@/lib/types";
import { categoryColors } from "@/lib/constants";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/context/ToastContext";

interface EventDetailSheetProps {
  event: VolunteerEvent | null;
  onClose: () => void;
}

export function EventDetailSheet({ event, onClose }: EventDetailSheetProps) {
  const { isSignedUp, toggleSignUp } = useAppContext();
  const { showToast } = useToast();

  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [event, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (event) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [event]);

  if (!event) return null;

  const signedUp = isSignedUp(event.id);
  const spotsPercent = ((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100;
  const color = categoryColors[event.category] ?? "#2D8CFF";
  const formattedDate = new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  function handleToggle() {
    toggleSignUp(event!.id);
    if (signedUp) {
      showToast("Registration cancelled", "info");
    } else {
      showToast(`Signed up for ${event!.title}!`, "success");
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        className="fixed bottom-0 left-0 right-0 z-[2001] bg-card rounded-t-3xl shadow-2xl animate-sheet-up md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:rounded-3xl md:animate-modal-in"
        style={{ maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Color header */}
        <div
          className="relative h-36 rounded-t-3xl flex items-center justify-center"
          style={{ backgroundColor: color + "20" }}
        >
          <span className="text-6xl">{event.image}</span>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
          >
            <X size={18} className="text-text-primary" />
          </button>

          {/* Match badge */}
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {event.matchPercent}% Match
          </div>

          {/* Category pill */}
          <div
            className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: color + "25", color }}
          >
            {event.category}
          </div>
        </div>

        <div className="p-5">
          {/* Title */}
          <h2 id="detail-title" className="text-xl font-bold text-text-primary">
            {event.title}
          </h2>
          <p className="text-sm text-text-secondary mt-0.5">{event.organization}</p>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar size={15} className="text-primary shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Clock size={15} className="text-primary shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <MapPin size={15} className="text-primary shrink-0" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Users size={15} className="text-primary shrink-0" />
              <span>{event.spotsLeft} of {event.totalSpots} spots left</span>
            </div>
          </div>

          {/* Spots progress */}
          <div className="mt-4">
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${spotsPercent}%`,
                  background: "linear-gradient(to right, #2D8CFF, #7C68EE)",
                }}
              />
            </div>
            <p className="text-xs text-text-muted mt-1">
              {Math.round(spotsPercent)}% filled · {event.distance} away
            </p>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-text-primary mb-2">About this Opportunity</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
          </div>

          {/* CTA */}
          <div className="mt-6 pb-safe">
            {signedUp ? (
              <div className="flex gap-3">
                <div className="flex-1 py-3.5 rounded-2xl bg-success-light text-success text-sm font-bold text-center flex items-center justify-center gap-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  You&apos;re Signed Up!
                </div>
                <button
                  onClick={handleToggle}
                  className="flex-1 py-3.5 rounded-2xl bg-border/60 text-text-secondary text-sm font-semibold hover:bg-border transition-colors"
                >
                  Cancel Registration
                </button>
              </div>
            ) : (
              <button
                onClick={handleToggle}
                className="btn-gradient w-full py-3.5 rounded-2xl text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Sign Up to Volunteer
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
