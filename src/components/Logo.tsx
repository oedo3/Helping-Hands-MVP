export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { icon: 20, text: "text-sm" },
    md: { icon: 28, text: "text-lg" },
    lg: { icon: 36, text: "text-2xl" },
  };
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2">
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 36C20 36 8 28 8 18C8 14 10 10 14 10C16.5 10 18.5 11.5 20 14C21.5 11.5 23.5 10 26 10C30 10 32 14 32 18C32 28 20 36 20 36Z"
          fill="#2D8CFF"
          opacity="0.15"
        />
        <path
          d="M12 22C12 22 15 19 18 22"
          stroke="#1A1A2E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M22 22C22 22 25 19 28 22"
          stroke="#1A1A2E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M14 26C14 26 16 18 20 22C24 18 26 26 26 26"
          stroke="#1A1A2E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`${s.text} font-bold text-text-primary tracking-tight`}>
        Helping<span className="text-primary">Hands</span>
      </span>
    </div>
  );
}
