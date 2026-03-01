"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SettingsModalProps {
  onClose: () => void;
}

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark",  label: "Dark",  icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render theme UI after mount
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[200]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[360px] bg-card rounded-t-3xl md:rounded-2xl shadow-2xl z-[201] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-text-primary">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-bg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-text-secondary" />
          </button>
        </div>

        {/* Appearance */}
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Appearance
          </p>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, label, icon: Icon }) => {
              const isActive = mounted && theme === value;
              return (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${
                    isActive
                      ? "border-transparent btn-gradient text-white shadow-md"
                      : "border-border bg-bg text-text-secondary hover:border-primary/40"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Safe area spacer on mobile */}
        <div className="h-4 md:hidden" />
      </div>
    </>
  );
}
