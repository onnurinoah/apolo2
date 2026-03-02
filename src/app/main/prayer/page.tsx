"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import LoadingDots from "@/components/ui/LoadingDots";
import RefreshButton from "@/components/ui/RefreshButton";
import ShareButton from "@/components/ui/ShareButton";
import { prayerTopics } from "@/data/prayerTopics";
import { usePrayer } from "@/hooks/usePrayer";
import { usePrayerShares } from "@/hooks/usePrayerShares";
import {
  PrayerInput,
  PrayerRelationship,
  PrayerTopic,
} from "@/types/prayer";

const RELATIONSHIP_OPTIONS: { value: PrayerRelationship; label: string }[] = [
  { value: "family", label: "👨‍👩‍👧 가족" },
  { value: "friend", label: "😊 친구" },
  { value: "acquaintance", label: "🤝 지인" },
  { value: "self", label: "🙋 나 자신" },
];

function PageToggle({
  mode,
  onChange,
}: {
  mode: "compose" | "share";
  onChange: (value: "compose" | "share") => void;
}) {
  return (
    <div className="rounded-2xl bg-gray-100 p-1">
      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={() => onChange("compose")}
          className={`rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${
            mode === "compose"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-400"
          }`}
        >
          기도문 작성
        </button>
        <button
          onClick={() => onChange("share")}
          className={`rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${
            mode === "share"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-400"
          }`}
        >
          기도제목 나눔
        </button>
      </div>
    </div>
  );
}

export default function PrayerPage() {
  const [mode, setMode] = useState<"compose" | "share">("compose");
  const [form, setForm] = useState<PrayerInput>({
    personName: "",
    relationship: "friend",
    topic: "salvation",
    additionalContext: "",
  });
  const [editedPrayer, setEditedPrayer] = useState("");
  const [shareForm, setShareForm] = useState({
    title: "",
    request: "",
    authorName: "",
    isAnonymous: true,
  });
  const { prayer, isLoading, generate, regenerate } = usePrayer();
  const { shares, hydrated, addShare, togglePrayed } = usePrayerShares();

  const isValid = form.personName && form.relationship && form.topic;
  const displayPrayer = editedPrayer || prayer;

  const topicLabel = useMemo(
    () => prayerTopics.find((item) => item.id === form.topic)?.nameKo || "기도",
    [form.topic]
  );

  const canShare =
    !!shareForm.title.trim() && !!shareForm.request.trim();

  const handleGenerate = () => {
    setEditedPrayer("");
    generate(form);
  };

  const handleRegenerate = () => {
    setEditedPrayer("");
    regenerate(form);
  };

  const fillShareFromPrayer = () => {
    const request = `${form.personName}의 ${topicLabel}을 위해 함께 기도해주세요.${form.additionalContext ? ` ${form.additionalContext}` : ""}`;
    setShareForm((prev) => ({
      ...prev,
      title: prev.title || `${form.personName} 기도제목`,
      request: request.trim(),
    }));
    setMode("share");
  };

  const handleShare = () => {
    if (!canShare) return;
    addShare({
      title: shareForm.title,
      request: shareForm.request,
      authorName: shareForm.authorName,
      isAnonymous: shareForm.isAnonymous,
      targetName: form.personName,
      topic: form.topic,
    });
    setShareForm((prev) => ({
      ...prev,
      title: "",
      request: "",
    }));
    setMode("share");
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-apolo-yellow-dark">
          기도문
        </p>
        <h1 className="mt-1 text-xl font-bold text-gray-900">
          전도를 혼자 하지 않게 만드는 기도 흐름
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          개인 기도문을 만들고, 필요한 기도제목은 공동체와 나눌 수 있게 구성했습니다.
        </p>
      </div>

      <PageToggle mode={mode} onChange={setMode} />

      {mode === "compose" ? (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-apolo-yellow-light px-4 py-3">
            <p className="text-sm text-gray-700">
              전도 대상자를 위한 진심 어린 기도문을 만들어드립니다. 🙏
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                기도 대상자 이름 *
              </label>
              <input
                type="text"
                placeholder="예: 홍길동"
                value={form.personName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, personName: e.target.value }))
                }
                className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                관계 *
              </label>
              <div className="flex flex-wrap gap-2">
                {RELATIONSHIP_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        relationship: option.value,
                      }))
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      form.relationship === option.value
                        ? "bg-apolo-yellow text-gray-900"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                기도 주제 *
              </label>
              <div className="flex flex-wrap gap-2">
                {prayerTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        topic: topic.id as PrayerTopic,
                      }))
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      form.topic === topic.id
                        ? "bg-apolo-yellow text-gray-900"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {topic.icon} {topic.nameKo}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                추가 기도 내용
              </label>
              <textarea
                placeholder="예: 최근 마음이 많이 지쳐 있습니다"
                value={form.additionalContext || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    additionalContext: e.target.value,
                  }))
                }
                className="min-h-[88px] w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!isValid || isLoading}
            className="w-full rounded-2xl bg-apolo-yellow py-4 text-base font-bold text-gray-900 disabled:opacity-40 active:bg-apolo-yellow-dark transition-colors"
          >
            {isLoading ? "생성 중..." : "기도문 생성하기"}
          </button>

          {(isLoading || prayer) && (
            <div className="space-y-3 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  생성된 기도문
                </p>
                {!isLoading && (
                  <RefreshButton onClick={handleRegenerate} disabled={isLoading} />
                )}
              </div>

              <div className="w-full">
                {isLoading ? (
                  <div className="inline-block rounded-bubble bg-apolo-kakao px-2 shadow-bubble">
                    <LoadingDots />
                  </div>
                ) : (
                  <>
                    <textarea
                      className="min-h-[220px] w-full rounded-2xl bg-apolo-kakao p-4 text-[15px] leading-relaxed text-gray-900 resize-none focus:outline-none shadow-bubble"
                      value={displayPrayer}
                      onChange={(e) => setEditedPrayer(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-400">탭하여 직접 편집 가능</p>
                  </>
                )}
              </div>

              {!isLoading && prayer && (
                <>
                  <div className="flex flex-wrap gap-2">
                    <CopyButton text={displayPrayer} />
                    <ShareButton text={displayPrayer} />
                  </div>
                  <button
                    onClick={fillShareFromPrayer}
                    className="w-full rounded-2xl border border-apolo-yellow/50 bg-white px-4 py-3 text-sm font-semibold text-gray-900"
                  >
                    이 기도제목을 나눔 게시판에 올리기
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-apolo-yellow-light px-4 py-3">
            <p className="text-sm text-gray-700">
              개인 기도에 머물지 않고, 필요한 기도제목은 공동체에 요청할 수 있도록 준비한 영역입니다.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card space-y-3">
            <p className="text-sm font-bold text-gray-900">기도제목 나누기</p>

            <input
              value={shareForm.title}
              onChange={(e) =>
                setShareForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="제목 예: 영희를 위한 구원 기도"
              className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
            />

            <textarea
              value={shareForm.request}
              onChange={(e) =>
                setShareForm((prev) => ({ ...prev, request: e.target.value }))
              }
              placeholder="함께 기도받고 싶은 내용을 적어주세요."
              className="min-h-[120px] w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
            />

            <input
              value={shareForm.authorName}
              onChange={(e) =>
                setShareForm((prev) => ({
                  ...prev,
                  authorName: e.target.value,
                }))
              }
              placeholder="공유자 이름 (선택)"
              className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
            />

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={shareForm.isAnonymous}
                onChange={(e) =>
                  setShareForm((prev) => ({
                    ...prev,
                    isAnonymous: e.target.checked,
                  }))
                }
              />
              익명으로 나누기
            </label>

            <button
              onClick={handleShare}
              disabled={!canShare}
              className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              기도제목 올리기
            </button>
          </div>

          {!hydrated ? (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 text-sm text-gray-400 shadow-card">
              나눔 게시판을 불러오는 중입니다.
            </div>
          ) : shares.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-apolo-yellow/50 bg-white p-6 text-center shadow-card">
              <p className="text-base font-semibold text-gray-900">
                아직 올라온 기도제목이 없습니다.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                첫 기도제목을 올려 공동체 기도 흐름을 만들어보세요.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {shares.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{item.title}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {item.isAnonymous
                          ? "익명"
                          : item.authorName || "이름 미입력"}
                        {" · "}
                        {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <span className="rounded-full bg-apolo-yellow-light px-3 py-1 text-xs font-semibold text-gray-700">
                      🙏 {item.prayedCount}
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {item.request}
                  </p>

                  <button
                    onClick={() => togglePrayed(item.id)}
                    className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                      item.prayedByMe
                        ? "bg-apolo-yellow text-gray-900"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.prayedByMe ? "함께 기도중" : "함께 기도했어요"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
