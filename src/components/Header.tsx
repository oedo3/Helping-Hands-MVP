import { Logo } from "./Logo";
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border/60 shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <button className="relative w-9 h-9 rounded-full bg-bg flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
