"use client";

import { useState, useEffect } from "react";

const ONBOARDING_KEY = "apolo_onboarded";

const slides = [
  {
    icon: (
      <div className="w-20 h-20 rounded-2xl bg-apolo-yellow flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
          <path
            d="M16.5 16.5L21 21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 11H14M11 8V14"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    title: "키워드로 빠르게 검색",
    desc: "전도 중에 받은 질문을 키워드로 입력하면 관련 질문 목록이 바로 나타납니다. 직접 질문을 입력하거나 음성으로도 물어볼 수 있어요!",
  },
  {
    icon: (
      <div className="w-20 h-20 rounded-2xl bg-apolo-yellow flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="4" fill="white" />
          <path
            d="M7 9H17M7 13H13"
            stroke="#FFD43B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    title: "카카오톡 스타일 답변",
    desc: "5가지 스타일(반말·존대말·선배·학술·청소년)로 답변을 확인하고, 바로 카카오톡에 복사·공유하세요.",
  },
  {
    icon: (
      <div className="w-20 h-20 rounded-2xl bg-apolo-yellow flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="3"
            fill="white"
          />
          <path
            d="M3 8.5L12 13.5L21 8.5"
            stroke="#FFD43B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    title: "1:1 전도 초대 메시지",
    desc: "전도 대상자의 이름과 관계를 입력하면, 그 사람에게 보낼 따뜻한 카카오톡 초대 메시지를 자동으로 만들어드립니다.",
  },
  {
    icon: (
      <div className="w-20 h-20 rounded-2xl bg-apolo-yellow flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C12 2 8 6 8 10V14L6 16V18H18V16L16 14V10C16 6 12 2 12 2Z"
            fill="white"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M10 18V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 6V10M10 8H14"
            stroke="#FFD43B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    title: "기도문 생성",
    desc: "전도 대상자를 위한 맞춤 기도문을 생성하세요. 구원, 건강, 가정 등 다양한 주제로 진심 어린 기도문을 만들어드립니다.",
  },
];

interface OnboardingProps {
  onDone: () => void;
}

export default function Onboarding({ onDone }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const isLast = current === slides.length - 1;

  const handleDone = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, "1");
    } catch {}
    onDone();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-[480px] mx-auto">
      {/* Skip */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleDone}
          className="text-sm text-gray-400 font-medium px-2 py-1"
        >
          건너뛰기
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8 animate-fade-in-up">
        {slides[current].icon}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {slides[current].title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            {slides[current].desc}
          </p>
        </div>
      </div>

      {/* Dots + Button */}
      <div className="p-8 flex flex-col items-center gap-6">
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2 bg-apolo-yellow"
                  : "w-2 h-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Next / Start button */}
        <button
          onClick={() => (isLast ? handleDone() : setCurrent(current + 1))}
          className="w-full py-4 rounded-2xl bg-apolo-yellow text-gray-900 font-bold text-base active:bg-apolo-yellow-dark transition-colors"
        >
          {isLast ? "시작하기 🚀" : "다음"}
        </button>
      </div>
    </div>
  );
}

export function useOnboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const done = localStorage.getItem(ONBOARDING_KEY);
      if (!done) setShow(true);
    } catch {}
  }, []);

  return { show, done: () => setShow(false) };
}
