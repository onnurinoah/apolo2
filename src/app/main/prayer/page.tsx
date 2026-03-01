"use client";

import { useState } from "react";
import { usePrayer } from "@/hooks/usePrayer";
import {
  PrayerInput,
  PrayerTopic,
  PrayerRelationship,
} from "@/types/prayer";
import { prayerTopics } from "@/data/prayerTopics";
import LoadingDots from "@/components/ui/LoadingDots";
import RefreshButton from "@/components/ui/RefreshButton";
import CopyButton from "@/components/ui/CopyButton";
import ShareButton from "@/components/ui/ShareButton";

// ─── Constants ────────────────────────────────────────────
const RELATIONSHIP_OPTIONS: { value: PrayerRelationship; label: string }[] = [
  { value: "family", label: "👨‍👩‍👧 가족" },
  { value: "friend", label: "😊 친구" },
  { value: "acquaintance", label: "🤝 지인" },
  { value: "self", label: "🙋 나 자신" },
];

// ─── Main Page ────────────────────────────────────────────
export default function PrayerPage() {
  const [form, setForm] = useState<PrayerInput>({
    personName: "",
    relationship: "friend",
    topic: "salvation",
    additionalContext: "",
  });
  const [editedPrayer, setEditedPrayer] = useState("");
  const { prayer, isLoading, generate, regenerate } = usePrayer();

  const isValid = form.personName && form.relationship && form.topic;

  const handleGenerate = () => {
    setEditedPrayer("");
    generate(form);
  };

  const handleRegenerate = () => {
    setEditedPrayer("");
    regenerate(form);
  };

  const displayPrayer = editedPrayer || prayer;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header */}
      <div className="bg-apolo-yellow-light rounded-2xl px-4 py-3">
        <p className="text-sm text-gray-700">
          전도 대상자를 위한 진심 어린 기도문을 만들어드립니다. 🙏
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Person name */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            기도 대상자 이름 *
          </label>
          <input
            type="text"
            placeholder="예: 홍길동"
            value={form.personName}
            onChange={(e) =>
              setForm((f) => ({ ...f, personName: e.target.value }))
            }
            className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow transition-shadow"
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            관계 *
          </label>
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIP_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  setForm((f) => ({ ...f, relationship: opt.value }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  form.relationship === opt.value
                    ? "bg-apolo-yellow text-gray-900"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prayer topic */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            기도 주제 *
          </label>
          <div className="flex flex-wrap gap-2">
            {prayerTopics.map((t) => (
              <button
                key={t.id}
                onClick={() =>
                  setForm((f) => ({ ...f, topic: t.id as PrayerTopic }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  form.topic === t.id
                    ? "bg-apolo-yellow text-gray-900"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.icon} {t.nameKo}
              </button>
            ))}
          </div>
        </div>

        {/* Additional context */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            추가 기도 내용 (선택)
          </label>
          <textarea
            placeholder="예: 최근 힘든 시간을 보내고 있습니다"
            value={form.additionalContext || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, additionalContext: e.target.value }))
            }
            className="w-full min-h-[80px] px-4 py-3 bg-gray-50 rounded-2xl text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-apolo-yellow transition-shadow"
          />
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!isValid || isLoading}
        className="w-full py-4 rounded-2xl bg-apolo-yellow text-gray-900 font-bold text-base disabled:opacity-40 active:bg-apolo-yellow-dark transition-colors"
      >
        {isLoading ? "생성 중..." : "기도문 생성하기 🙏"}
      </button>

      {/* Result */}
      {(isLoading || prayer) && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              생성된 기도문
            </p>
            {!isLoading && (
              <RefreshButton onClick={handleRegenerate} disabled={isLoading} />
            )}
          </div>

          {/* Bubble */}
          <div className="w-full">
            {isLoading ? (
              <div className="bg-apolo-kakao rounded-bubble shadow-bubble px-2 inline-block">
                <LoadingDots />
              </div>
            ) : (
              <>
                <textarea
                  className="w-full min-h-[200px] p-4 rounded-2xl bg-apolo-kakao text-gray-900 text-[15px] leading-relaxed resize-none focus:outline-none shadow-bubble"
                  value={displayPrayer}
                  onChange={(e) => setEditedPrayer(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  탭하여 직접 편집 가능
                </p>
              </>
            )}
          </div>

          {/* Actions */}
          {!isLoading && prayer && (
            <div className="flex gap-2 flex-wrap">
              <CopyButton text={displayPrayer} />
              <ShareButton text={displayPrayer} />
            </div>
          )}
        </div>
      )}

      {/* Bottom padding */}
      <div className="h-4" />
    </div>
  );
}
