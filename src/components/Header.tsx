"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Logo } from "./Logo";
import { NotificationsPanel } from "./NotificationsPanel";
import { useAppContext } from "@/context/AppContext";

export function Header() {
  const { unreadCount } = useAppContext();
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/60 shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
          <button
            onClick={() => setPanelOpen(true)}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            className="relative w-9 h-9 rounded-full bg-bg flex items-center justify-center hover:bg-border/40 transition-colors"
          >
            <Bell size={18} className="text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-card" />
            )}
          </button>
        </div>
      </header>
      {panelOpen && <NotificationsPanel onClose={() => setPanelOpen(false)} />}
    </>
  );
}
