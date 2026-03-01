"use client";

import { useState } from "react";
import {
  Star,
  Clock,
  BarChart3,
  Zap,
  Settings,
  ChevronRight,
  Shield,
  Info,
  Award,
} from "lucide-react";
import { badges, milestones, volunteerStats } from "@/lib/data";
import { SettingsModal } from "@/components/SettingsModal";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"hours" | "badges">("hours");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const maxHours = Math.max(...volunteerStats.monthlyHours.map((m) => m.hours));

  return (
    <div>
      {/* Profile header */}
      <div className="px-4 pt-6 pb-8" style={{ background: "linear-gradient(135deg, #3B1FA8 0%, #7C68EE 30%, #C850F0 50%, #FF6060 70%, #FF8C00 88%)" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Volunteer</h1>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Star size={16} className="text-white" />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Settings size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock size={14} className="text-yellow-300" />
            </div>
            <p className="text-2xl font-bold text-white">{volunteerStats.totalHours}</p>
            <p className="text-[10px] text-white/80 font-medium">Total Hours</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 size={14} className="text-green-300" />
            </div>
            <p className="text-2xl font-bold text-white">{volunteerStats.sessions}</p>
            <p className="text-[10px] text-white/80 font-medium">Sessions</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap size={14} className="text-orange-300" />
            </div>
            <p className="text-2xl font-bold text-white">
              {volunteerStats.impactPoints.toLocaleString()}
            </p>
            <p className="text-[10px] text-white/80 font-medium">Impact Points</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 md:max-w-5xl md:mx-auto md:px-8">
        {/* Tab switcher */}
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-1 flex mb-4">
          <button
            onClick={() => setActiveTab("hours")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "hours"
                ? "btn-gradient text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Volunteer Hours
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "badges"
                ? "btn-gradient text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Badges & Milestones
          </button>
        </div>

        {activeTab === "hours" && (
          <>
            {/* Monthly chart */}
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 mb-4">
              <h3 className="font-semibold text-sm text-text-primary mb-4">
                Monthly Volunteer Hours
              </h3>
              <div className="flex items-end justify-between gap-2 h-36">
                {volunteerStats.monthlyHours.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold text-text-secondary">
                      {m.hours}
                    </span>
                    <div className="w-full relative">
                      <div
                        className="w-full rounded-t-lg transition-all btn-gradient"
                        style={{
                          height: `${(m.hours / maxHours) * 100}px`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-text-muted font-medium">
                      {m.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified hours */}
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-text-primary">Verified Hours</h3>
                <div className="flex items-center gap-4 text-[10px] font-semibold text-text-muted">
                  <span>Safe</span>
                  <span>Done</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {badges
                  .filter((b) => b.earned)
                  .map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 py-2"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ backgroundColor: badge.color + "20" }}
                      >
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary">
                          {badge.name}
                        </p>
                        {badge.subtitle && (
                          <p className="text-xs text-text-secondary">{badge.subtitle}</p>
                        )}
                      </div>
                      <button className="w-7 h-7 rounded-full bg-bg flex items-center justify-center">
                        <Info size={14} className="text-text-muted" />
                      </button>
                      <div className="w-7 h-7 flex items-center justify-center">
                        {badge.verified ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M9 12l2 2 4-4"
                              stroke="#27AE60"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="4"
                              stroke="#27AE60"
                              strokeWidth="2"
                            />
                          </svg>
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-gray-200" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "badges" && (
          <>
            {/* Badges grid */}
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 mb-4">
              <h3 className="font-semibold text-sm text-text-primary mb-4">Your Badges</h3>
              <div className="grid grid-cols-3 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                      badge.earned
                        ? "bg-white border border-border/50"
                        : "bg-gray-50 opacity-50"
                    }`}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative"
                      style={{ backgroundColor: badge.color + "15" }}
                    >
                      {badge.icon}
                      {badge.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
                          <Shield size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-text-primary text-center leading-tight">
                      {badge.name}
                    </span>
                    {!badge.earned && (
                      <span className="text-[9px] text-text-muted">Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 mb-4">
              <h3 className="font-semibold text-sm text-text-primary mb-4">Milestones</h3>
              <div className="flex flex-col gap-4">
                {milestones.map((milestone) => (
                  <div key={milestone.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-lg">
                      {milestone.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-text-primary">
                          {milestone.label}
                        </span>
                        <span className="text-[10px] font-semibold text-primary">
                          {milestone.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            milestone.progress === 100
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                    {milestone.progress === 100 && (
                      <Award size={18} className="text-success shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

          </>
        )}

        {/* Account actions — always visible */}
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 mb-4 overflow-hidden">
          {[
            { label: "Edit Profile", icon: "👤" },
            { label: "Privacy Settings", icon: "🔒" },
            { label: "Notification Preferences", icon: "🔔" },
            { label: "Help & Support", icon: "❓" },
          ].map((item, i, arr) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                i < arr.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-left text-sm font-medium text-text-primary">
                {item.label}
              </span>
              <ChevronRight size={16} className="text-text-muted" />
            </button>
          ))}
        </div>
      </div>

      <div className="h-6" />

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
