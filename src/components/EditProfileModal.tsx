"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { UserProfile } from "@/lib/types";
import { categories } from "@/lib/data";

const AVATAR_OPTIONS = ["🙋", "👨", "👩", "🧑", "👦", "👧", "🧔", "👱", "🧑‍💻", "👨‍🎤", "👩‍🏫", "🧑‍🌾", "🦸", "🦹", "🧙", "🧝", "🧟", "🐱", "🐶", "🦊"];

interface EditProfileModalProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export function EditProfileModal({ profile, onSave, onClose }: EditProfileModalProps) {
  const [draft, setDraft] = useState<UserProfile>({ ...profile });

  function toggleInterest(cat: string) {
    setDraft((prev) => {
      const interests = prev.interests.includes(cat)
        ? prev.interests.filter((i) => i !== cat)
        : [...prev.interests, cat];
      return { ...prev, interests };
    });
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="fixed bottom-0 left-0 right-0 z-[2001] bg-card rounded-t-3xl shadow-2xl animate-sheet-up md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:rounded-3xl md:animate-modal-in overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 id="edit-profile-title" className="text-lg font-bold text-text-primary">Edit Profile</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg flex items-center justify-center">
              <X size={16} className="text-text-muted" />
            </button>
          </div>

          {/* Avatar */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Avatar</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setDraft((d) => ({ ...d, avatar: emoji }))}
                  className={`w-10 h-10 text-xl rounded-xl transition-all ${
                    draft.avatar === emoji
                      ? "bg-primary-light ring-2 ring-primary"
                      : "bg-bg hover:bg-border/40"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              maxLength={40}
              className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Bio */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
              Bio <span className="normal-case font-normal text-text-muted">({150 - draft.bio.length} chars left)</span>
            </label>
            <textarea
              value={draft.bio}
              onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value.slice(0, 150) }))}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-bg border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Tell volunteers about yourself..."
            />
          </div>

          {/* Interests */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Interests</p>
            <div className="flex flex-wrap gap-2">
              {categories.filter((c) => c !== "All").map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleInterest(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    draft.interests.includes(cat)
                      ? "btn-gradient text-white"
                      : "bg-bg border border-border text-text-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { onSave(draft); onClose(); }}
            disabled={!draft.name.trim()}
            className="btn-gradient w-full py-3.5 rounded-2xl text-white text-sm font-bold disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
