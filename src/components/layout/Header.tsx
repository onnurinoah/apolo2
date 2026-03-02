"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-center h-14 px-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 active:opacity-70 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-apolo-yellow flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z"
                fill="white"
              />
              <path
                d="M12 7V17M9 12H15"
                stroke="#FFD43B"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            APOLO
          </span>
        </button>
      </div>
    </header>
  );
}
