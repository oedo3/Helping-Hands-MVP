"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getPreferences, updatePreferences } from "@/lib/supabase/queries/preferences";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        <p className="text-xs text-text-secondary mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-primary" : "bg-border"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

interface PrivacySettingsModalProps {
  onClose: () => void;
}

export function PrivacySettingsModal({ onClose }: PrivacySettingsModalProps) {
  const { userId } = useAppContext();
  const [settings, setSettings] = useState({
    showProfile: true,
    showHours: false,
    newsletter: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getPreferences(userId).then((prefs) => {
      if (prefs) {
        setSettings({
          showProfile: prefs.showProfile,
          showHours: prefs.showHours,
          newsletter: prefs.newsletter,
        });
      }
    });
  }, [userId]);

  const set = (key: keyof typeof settings) => (v: boolean) =>
    setSettings((s) => ({ ...s, [key]: v }));

  async function handleSave() {
    setSaving(true);
    if (userId) {
      await updatePreferences(userId, {
        showProfile: settings.showProfile,
        showHours: settings.showHours,
        newsletter: settings.newsletter,
      });
    }
    setSaving(false);
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed bottom-0 left-0 right-0 z-[2001] bg-card rounded-t-3xl shadow-2xl animate-sheet-up md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:rounded-3xl md:animate-modal-in"
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-text-primary">Privacy Settings</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg flex items-center justify-center">
              <X size={16} className="text-text-muted" />
            </button>
          </div>
          <ToggleRow
            label="Show profile to organizations"
            description="Let volunteer organizations see your profile."
            checked={settings.showProfile}
            onChange={set("showProfile")}
          />
          <ToggleRow
            label="Show my hours publicly"
            description="Display your total volunteer hours on your public profile."
            checked={settings.showHours}
            onChange={set("showHours")}
          />
          <ToggleRow
            label="Receive newsletter"
            description="Get weekly volunteer opportunity highlights."
            checked={settings.newsletter}
            onChange={set("newsletter")}
          />
          <button onClick={handleSave} disabled={saving} className="btn-gradient w-full py-3.5 rounded-2xl text-white text-sm font-bold mt-5 disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
