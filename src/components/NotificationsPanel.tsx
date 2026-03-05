"use client";

import { useEffect } from "react";
import { X, Bell } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

interface NotificationsPanelProps {
  onClose: () => void;
}

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const { notifications, markAllRead, unreadCount } = useAppContext();

  // Mark all read when panel opens
  useEffect(() => {
    const timer = setTimeout(markAllRead, 500);
    return () => clearTimeout(timer);
  }, [markAllRead]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        className="fixed bottom-0 left-0 right-0 z-[2001] bg-card rounded-t-3xl shadow-2xl animate-sheet-up md:top-0 md:bottom-0 md:right-0 md:left-auto md:w-96 md:rounded-none md:rounded-l-3xl md:animate-slide-in-right overflow-hidden"
        style={{ maxHeight: "85vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h2 className="font-bold text-text-primary">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-bg flex items-center justify-center hover:bg-border/40 transition-colors"
          >
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 70px)" }}>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">🔔</p>
              <p className="text-sm text-text-secondary">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-5 py-4 border-b border-border/50 last:border-0 transition-colors ${
                  !n.read ? "bg-primary-light/30" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center text-xl shrink-0">
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-text-primary" : "font-medium text-text-primary"}`}>
                      {n.title}
                    </p>
                    {!n.read && <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-text-muted mt-1.5">{timeAgo(n.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
