"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDeploymentStatus } from "@/hooks/useDeploymentStatus";
import { useTargets } from "@/hooks/useTargets";
import {
  CreateTargetInput,
  TARGET_INTEREST_OPTIONS,
  TARGET_RELATIONSHIP_OPTIONS,
  TARGET_STATUS_OPTIONS,
} from "@/types/target";

function formatDate(value: string | null) {
  if (!value) return "아직 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function TargetsPage() {
  const { status, loading: statusLoading } = useDeploymentStatus();
  const {
    targets,
    hydrated,
    addTarget,
    getPrayStreak,
    getLastPrayerDate,
  } = useTargets();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateTargetInput>({
    name: "",
    relationship: "friend",
    situation: "",
    interest: "neutral",
    notes: "",
  });

  const canSubmit = useMemo(
    () => !!form.name.trim() && !!form.situation.trim(),
    [form.name, form.situation]
  );

  const handleCreate = () => {
    if (!canSubmit) return;
    addTarget(form);
    setForm({
      name: "",
      relationship: "friend",
      situation: "",
      interest: "neutral",
      notes: "",
    });
    setShowForm(false);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-apolo-yellow-dark uppercase tracking-wide">
              배포 상태
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Vercel에서 OpenAI 연결 상태를 앱 안에서 바로 확인할 수 있습니다.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              status?.hasOpenAIKey
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {statusLoading
              ? "확인 중"
              : status?.hasOpenAIKey
                ? "AI 연결 준비됨"
                : "AI 키 미설정"}
          </span>
        </div>

        <div className="mt-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
          {statusLoading ? (
            "배포 환경을 확인하고 있습니다."
          ) : status?.hasOpenAIKey ? (
            `현재 환경은 ${status.environment}이며 OpenAI API 키가 연결되어 있습니다.`
          ) : (
            "현재 환경변수에 OPENAI_API_KEY가 없거나 유효하지 않습니다. Vercel Settings > Environment Variables에서 추가하세요."
          )}
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-gray-100 shadow-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-apolo-yellow-dark uppercase tracking-wide">
              내 전도
            </p>
            <h1 className="text-xl font-bold text-gray-900 mt-1">
              오늘 돌볼 전도 대상자
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              이름을 저장해 두고 기도, 초대, 전략 생성을 한 흐름으로 이어갑니다.
            </p>
          </div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="flex-shrink-0 rounded-2xl bg-apolo-yellow px-4 py-2 text-sm font-semibold text-gray-900 active:bg-apolo-yellow-dark transition-colors"
          >
            {showForm ? "닫기" : "+ 추가"}
          </button>
        </div>

        {showForm && (
          <div className="mt-4 space-y-4 rounded-3xl bg-gray-50 p-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                이름 *
              </label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="예: 영희"
                className="w-full rounded-2xl bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                관계
              </label>
              <div className="flex flex-wrap gap-2">
                {TARGET_RELATIONSHIP_OPTIONS.map((option) => (
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
                        : "bg-white text-gray-500"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                현재 상황 *
              </label>
              <input
                value={form.situation}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, situation: e.target.value }))
                }
                placeholder="예: 취업 준비로 지쳐 있음"
                className="w-full rounded-2xl bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                현재 태도
              </label>
              <div className="flex flex-wrap gap-2">
                {TARGET_INTEREST_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        interest: option.value,
                      }))
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      form.interest === option.value
                        ? "bg-apolo-yellow text-gray-900"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                메모
              </label>
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="가까운 시일 안에 건넬 안부, 기억할 포인트 등을 적어두세요."
                className="w-full min-h-[96px] rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={!canSubmit}
              className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              대상자 저장하기
            </button>
          </div>
        )}
      </section>

      {!hydrated ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 text-sm text-gray-400 shadow-card">
          대상을 불러오는 중입니다.
        </div>
      ) : targets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-apolo-yellow/50 bg-apolo-yellow-light/40 p-6 text-center shadow-card">
          <p className="text-base font-semibold text-gray-900">
            첫 전도 대상자를 등록해보세요.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            저장한 대상자는 기도 기록과 함께 계속 이어서 관리할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {targets.map((target) => {
            const statusLabel =
              TARGET_STATUS_OPTIONS.find(
                (option) => option.value === target.status
              )?.label || target.status;
            const streak = getPrayStreak(target);
            const lastPrayer = formatDate(getLastPrayerDate(target));

            return (
              <Link
                key={target.id}
                href={`/main/targets/${target.id}`}
                className="block rounded-3xl border border-gray-100 bg-white p-4 shadow-card transition-transform active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {target.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {TARGET_RELATIONSHIP_OPTIONS.find(
                        (option) => option.value === target.relationship
                      )?.label || target.relationship}
                      {" · "}
                      {target.situation}
                    </p>
                  </div>
                  <span className="rounded-full bg-apolo-yellow-light px-3 py-1 text-xs font-semibold text-gray-700">
                    {statusLabel}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-2xl bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-400">연속 기도</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      🔥 {streak}일
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-400">마지막 기도</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {lastPrayer}
                    </p>
                  </div>
                </div>

                {target.notes && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {target.notes}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
