import { Logo } from "./Logo";
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        <Logo />
        <button className="relative w-10 h-10 rounded-full bg-bg flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
