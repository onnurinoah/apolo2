"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/main/targets",
    label: "내 전도",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-colors"
      >
        <path
          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
          fill={active ? "#FFD43B" : "none"}
          stroke={active ? "#FFD43B" : "#9CA3AF"}
          strokeWidth="1.5"
        />
        <path
          d="M4 21C4.9 17.9 7.9 16 12 16C16.1 16 19.1 17.9 20 21"
          fill={active ? "#FFD43B" : "none"}
          stroke={active ? "#FFD43B" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
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
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[480px] border-t border-gray-100 bg-white">
        <div className="flex pb-[env(safe-area-inset-bottom)]">
          {tabs.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
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
