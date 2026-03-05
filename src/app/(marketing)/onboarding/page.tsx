"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Sparkles, Heart, MapPin, Clock, Wrench } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAppContext } from "@/context/AppContext";

const CATEGORIES = [
  { label: "Food & Hunger",  emoji: "🍽️", color: "#E74C3C" },
  { label: "Environment",    emoji: "🌳", color: "#27AE60" },
  { label: "Housing",        emoji: "🏠", color: "#FF8C42" },
  { label: "Animals",        emoji: "🐾", color: "#2D8CFF" },
  { label: "Education",      emoji: "📚", color: "#6C5CE7" },
  { label: "Elderly Care",   emoji: "💙", color: "#F39C12" },
  { label: "Health",         emoji: "❤️‍🩹", color: "#E84393" },
  { label: "Arts & Culture", emoji: "🎨", color: "#00CEC9" },
  { label: "Sports & Rec",   emoji: "⚽", color: "#55EFC4" },
  { label: "Disaster Relief",emoji: "🚨", color: "#FDCB6E" },
];

const AVAILABILITY_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const AVAILABILITY_TIMES = [
  { label: "Morning",   sub: "6 AM – 12 PM",  emoji: "🌅" },
  { label: "Afternoon", sub: "12 PM – 5 PM",  emoji: "☀️" },
  { label: "Evening",   sub: "5 PM – 10 PM",  emoji: "🌙" },
];

const SKILLS = [
  "Teaching / Tutoring", "Cooking / Food Prep", "Construction / Building",
  "Driving / Delivery",  "Medical / Healthcare", "IT / Tech Support",
  "Photography / Media", "Event Planning",       "Fundraising",
  "Translation",         "Animal Care",           "Administrative",
];

const DISTANCES = [5, 10, 25, 50];

const STEPS = [
  { id: 1, label: "Interests",    icon: Heart },
  { id: 2, label: "Availability", icon: Clock },
  { id: 3, label: "Skills",       icon: Wrench },
  { id: 4, label: "Location",     icon: MapPin },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { saveUserProfile, userProfile } = useAppContext();

  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>(userProfile.interests ?? []);
  const [days, setDays] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [distance, setDistance] = useState(25);
  const [saving, setSaving] = useState(false);

  function toggleItem(arr: string[], setArr: (v: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  }

  async function handleFinish() {
    setSaving(true);
    const availability = [...days.map((d) => `day:${d}`), ...times.map((t) => `time:${t}`)];
    await saveUserProfile({
      interests,
      availability,
      skills,
      distancePref: distance,
      onboardingComplete: true,
    });
    router.push("/explore");
  }

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg/95 backdrop-blur-sm border-b border-border/40 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={() => router.push("/explore")}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Skip for now
          </button>
        </div>

        {/* Progress bar */}
        <div className="max-w-lg mx-auto mt-3">
          <div className="flex items-center gap-2 mb-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  s.id <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-text-muted">
            Step {step} of {STEPS.length} —{" "}
            <span className="text-text-secondary font-medium">
              {STEPS[step - 1].label}
            </span>
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-lg mx-auto w-full">
        {/* ── STEP 1: INTERESTS ── */}
        {step === 1 && (
          <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4">
                <Heart size={26} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                What causes{" "}
                <span className="text-gradient">light you up?</span>
              </h1>
              <p className="text-sm text-text-secondary">
                Select all the causes you care about. We&apos;ll match you with
                events that fit your passions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const selected = interests.includes(cat.label);
                return (
                  <button
                    key={cat.label}
                    onClick={() => toggleItem(interests, setInterests, cat.label)}
                    className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: cat.color + "22" }}
                    >
                      {cat.emoji}
                    </span>
                    <span
                      className={`text-sm font-semibold leading-tight ${
                        selected ? "text-primary" : "text-text-primary"
                      }`}
                    >
                      {cat.label}
                    </span>
                    {selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {interests.length > 0 && (
              <p className="text-center text-xs text-text-muted mt-4">
                {interests.length} cause{interests.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        )}

        {/* ── STEP 2: AVAILABILITY ── */}
        {step === 2 && (
          <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4">
                <Clock size={26} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                When are you{" "}
                <span className="text-gradient">free to help?</span>
              </h1>
              <p className="text-sm text-text-secondary">
                Pick the days and times that work for you so we can suggest
                events that fit your schedule.
              </p>
            </div>

            {/* Days */}
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Days of the week
            </p>
            <div className="flex gap-2 flex-wrap mb-6">
              {AVAILABILITY_DAYS.map((day) => {
                const selected = days.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleItem(days, setDays, day)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-text-secondary hover:border-primary/40"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Times */}
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Time of day
            </p>
            <div className="flex flex-col gap-3">
              {AVAILABILITY_TIMES.map((t) => {
                const selected = times.includes(t.label);
                return (
                  <button
                    key={t.label}
                    onClick={() => toggleItem(times, setTimes, t.label)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${selected ? "text-primary" : "text-text-primary"}`}>
                        {t.label}
                      </p>
                      <p className="text-xs text-text-muted">{t.sub}</p>
                    </div>
                    {selected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check size={13} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 3: SKILLS ── */}
        {step === 3 && (
          <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4">
                <Wrench size={26} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                What skills can{" "}
                <span className="text-gradient">you offer?</span>
              </h1>
              <p className="text-sm text-text-secondary">
                Your skills help us find high-impact roles where you&apos;ll
                make the biggest difference. Select any that apply.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => {
                const selected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleItem(skills, setSkills, skill)}
                    className={`px-4 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-text-secondary hover:border-primary/40"
                    }`}
                  >
                    {selected && <Check size={12} className="inline mr-1.5" strokeWidth={3} />}
                    {skill}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-card border border-border/50">
              <p className="text-xs text-text-muted text-center">
                💡 No worries if you&apos;re new to volunteering — most events
                welcome everyone regardless of skills!
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 4: LOCATION / DISTANCE ── */}
        {step === 4 && (
          <div className="w-full animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4">
                <MapPin size={26} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                How far will you{" "}
                <span className="text-gradient">travel to help?</span>
              </h1>
              <p className="text-sm text-text-secondary">
                We&apos;ll show you volunteer opportunities within your preferred
                distance from Evansville, IN.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {DISTANCES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDistance(d)}
                  className={`py-6 rounded-2xl border-2 font-bold transition-all ${
                    distance === d
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-text-primary hover:border-primary/40"
                  }`}
                >
                  <p className="text-3xl font-extrabold">{d}</p>
                  <p className="text-xs mt-1 font-medium text-text-muted">miles</p>
                </button>
              ))}
            </div>

            {/* Summary card */}
            <div className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-primary" />
                <p className="text-sm font-bold text-text-primary">Your Match Profile</p>
              </div>
              <div className="space-y-2 text-sm text-text-secondary">
                <p>
                  <span className="font-semibold text-text-primary">Causes:</span>{" "}
                  {interests.length > 0 ? interests.slice(0, 3).join(", ") + (interests.length > 3 ? ` +${interests.length - 3}` : "") : "All causes"}
                </p>
                <p>
                  <span className="font-semibold text-text-primary">Availability:</span>{" "}
                  {days.length > 0 || times.length > 0
                    ? [...days, ...times].slice(0, 4).join(", ")
                    : "Flexible"}
                </p>
                <p>
                  <span className="font-semibold text-text-primary">Skills:</span>{" "}
                  {skills.length > 0 ? skills.slice(0, 2).join(", ") + (skills.length > 2 ? ` +${skills.length - 2}` : "") : "No specific skills"}
                </p>
                <p>
                  <span className="font-semibold text-text-primary">Distance:</span>{" "}
                  Within {distance} miles
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-3 w-full">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-border text-text-secondary text-sm font-semibold hover:bg-border/40 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          {step < STEPS.length ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 btn-gradient py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="flex-1 btn-gradient py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
            >
              {saving ? "Saving…" : (
                <>
                  <Sparkles size={16} />
                  Get Matched Now
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
