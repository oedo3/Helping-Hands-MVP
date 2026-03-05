"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

const FAQ = [
  {
    q: "How does event matching work?",
    a: "We match you with events based on your selected interest categories. Events with higher match percentages align more closely with your volunteer history and preferences.",
  },
  {
    q: "How do I get my hours verified?",
    a: "After completing a volunteer session, the organization you worked with verifies your hours through their account. Verified hours appear with a green checkmark on your profile.",
  },
  {
    q: "Can I cancel a sign-up?",
    a: "Yes! You can cancel any time by tapping the Cancel button on the event card or in the event detail sheet. Please try to cancel at least 24 hours in advance out of respect for the organizers.",
  },
  {
    q: "How do I earn badges?",
    a: "Badges are awarded automatically when you reach certain milestones — like your first volunteer session, 10 hours volunteered, or trying a new category of event.",
  },
  {
    q: "Is my information shared with organizations?",
    a: "Only your display name and interests are visible to organizations when they review volunteer applications. You can control this in Privacy Settings.",
  },
];

export function HelpSupportModal({ onClose }: { onClose: () => void }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed bottom-0 left-0 right-0 z-[2001] bg-card rounded-t-3xl shadow-2xl animate-sheet-up md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:rounded-3xl md:animate-modal-in overflow-y-auto"
        style={{ maxHeight: "85vh" }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-text-primary">Help & Support</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg flex items-center justify-center">
              <X size={16} className="text-text-muted" />
            </button>
          </div>
          <p className="text-sm text-text-secondary mb-5">Frequently asked questions</p>
          <div className="flex flex-col gap-2">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-bg rounded-2xl border border-border/50 overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-text-primary">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-text-muted transition-transform shrink-0 ml-2 ${openIdx === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openIdx === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={onClose} className="btn-gradient w-full py-3.5 rounded-2xl text-white text-sm font-bold mt-5">
            Close
          </button>
        </div>
      </div>
    </>
  );
}
