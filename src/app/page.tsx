"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SplashPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(() => {
      router.push("/main/apologetics");
    }, 300);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-white cursor-pointer transition-opacity duration-300 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleEnter}
    >
      {/* Logo */}
      <div className="animate-pulse-glow flex flex-col items-center gap-6">
        {/* Shield Icon */}
        <div className="w-28 h-28 rounded-3xl bg-apolo-yellow flex items-center justify-center shadow-lg">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L3 7V12C3 17.55 6.84 22.74 12 24C17.16 22.74 21 17.55 21 12V7L12 2Z"
              fill="white"
              stroke="white"
              strokeWidth="0.5"
            />
            <path
              d="M12 6V18M8 12H16"
              stroke="#FFD43B"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            APOLO
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-medium">
            기독교 변증 도우미
          </p>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-12 animate-fade-in">
        <p className="text-xs text-gray-300 font-medium">
          화면을 터치하여 시작하세요
        </p>
      </div>
    </div>
  );
}
