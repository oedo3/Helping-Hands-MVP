export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { box: 26, icon: 14, text: "text-sm" },
    md: { box: 34, icon: 18, text: "text-lg" },
    lg: { box: 44, icon: 24, text: "text-2xl" },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div
        style={{
          width: s.box,
          height: s.box,
          background: "linear-gradient(135deg, #2D8CFF 0%, #1a6fd4 100%)",
          borderRadius: s.box * 0.28,
        }}
        className="flex items-center justify-center shrink-0 shadow-sm"
      >
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21C12 21 3 14.5 3 8.5C3 6 4.8 4 7 4C8.7 4 10.1 5 11 6.4C11.9 5 13.3 4 15 4C17.2 4 19 6 19 8.5C19 14.5 12 21 12 21Z"
            fill="white"
          />
        </svg>
      </div>
      <span className={`${s.text} font-bold text-text-primary tracking-tight`}>
        Helping<span className="text-primary">Hands</span>
      </span>
    </div>
  );
}
