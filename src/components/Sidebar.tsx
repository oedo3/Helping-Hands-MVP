"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, CalendarDays, Compass, User } from "lucide-react";
import { Logo } from "./Logo";

const navItems = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/account", label: "Account", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen bg-white border-r border-border/60">
      <div className="px-5 py-5 border-b border-border/60">
        <Logo />
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "btn-gradient text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
