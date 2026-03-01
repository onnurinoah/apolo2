"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/main/apologetics",
    label: "변증답변",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-colors"
      >
        <path
          d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z"
          fill={active ? "#FFD43B" : "none"}
          stroke={active ? "#FFD43B" : "#9CA3AF"}
          strokeWidth="1.5"
        />
        <path
          d="M9 12H15M12 9V15"
          stroke={active ? "white" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/main/invitation",
    label: "예배초대",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-colors"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="3"
          fill={active ? "#FFD43B" : "none"}
          stroke={active ? "#FFD43B" : "#9CA3AF"}
          strokeWidth="1.5"
        />
        <path
          d="M3 8L12 13L21 8"
          stroke={active ? "white" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/main/prayer",
    label: "기도문",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-colors"
      >
        {/* Praying hands icon */}
        <path
          d="M12 2C12 2 8 6 8 10V14L6 16V18H18V16L16 14V10C16 6 12 2 12 2Z"
          fill={active ? "#FFD43B" : "none"}
          stroke={active ? "#FFD43B" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 18V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V18"
          stroke={active ? "#FFD43B" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M12 6V10M10 8H14"
          stroke={active ? "white" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/main/evangelism",
    label: "전도전략",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-colors"
      >
        {/* Target/bullseye icon */}
        <circle
          cx="12"
          cy="12"
          r="9"
          fill={active ? "#FFD43B" : "none"}
          stroke={active ? "#FFD43B" : "#9CA3AF"}
          strokeWidth="1.5"
        />
        <circle
          cx="12"
          cy="12"
          r="5"
          fill={active ? "white" : "none"}
          stroke={active ? "white" : "#9CA3AF"}
          strokeWidth="1.5"
        />
        <circle
          cx="12"
          cy="12"
          r="1.5"
          fill={active ? "#FFD43B" : "#9CA3AF"}
        />
      </svg>
    ),
  },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-[480px] mx-auto bg-white border-t border-gray-100">
        <div className="flex pb-[env(safe-area-inset-bottom)]">
          {tabs.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                  active ? "text-apolo-yellow-dark" : "text-gray-400"
                }`}
              >
                {tab.icon(active)}
                <span
                  className={`text-xs font-medium ${
                    active ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
