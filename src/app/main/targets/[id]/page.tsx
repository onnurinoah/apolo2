"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import LoadingDots from "@/components/ui/LoadingDots";
import RefreshButton from "@/components/ui/RefreshButton";
import ShareButton from "@/components/ui/ShareButton";
import { useEvangelism } from "@/hooks/useEvangelism";
import { useInvitation } from "@/hooks/useInvitation";
import { usePrayer } from "@/hooks/usePrayer";
import { usePrayerShares } from "@/hooks/usePrayerShares";
import { useTargets } from "@/hooks/useTargets";
import {
  TARGET_RELATIONSHIP_OPTIONS,
  TARGET_STATUS_OPTIONS,
} from "@/types/target";

function getUpcomingSundayLabel() {
  const today = new Date();
  const delta = today.getDay() === 0 ? 7 : 7 - today.getDay();
  const next = new Date(today);
  next.setDate(today.getDate() + delta);
  return `${next.getMonth() + 1}월 ${next.getDate()}일 주일`;
}

function formatDateKey(dateKey: string | null) {
  if (!dateKey) return "아직 없음";
  const date = new Date(dateKey);
  if (Number.isNaN(date.getTime())) return dateKey;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function mapPrayerRelationship(value: string) {
  if (value === "family") return "family";
  if (value === "friend") return "friend";
  return "acquaintance";
}

function mapInvitationRelationship(value: string) {
  if (value === "family") return "family";
  if (value === "friend") return "friend";
  if (value === "colleague") return "colleague";
  return "acquaintance";
}

export default function TargetDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    targets,
    hydrated,
    updateTarget,
    removeTarget,
    prayToday,
    getPrayStreak,
    getLastPrayerDate,
  } = useTargets();
  const targetId = Array.isArray(params.id) ? params.id[0] : params.id;
  const target = targets.find((item) => item.id === targetId);
  const {
    prayer,
    isLoading: prayerLoading,
    generate: generatePrayer,
    regenerate: regeneratePrayer,
  } = usePrayer();
  const { addShare } = usePrayerShares();
  const {
    actionPoints,
    isLoading: strategyLoading,
    generate: generateStrategy,
    regenerate: regenerateStrategy,
  } = useEvangelism();
  const {
    message,
    isLoading: invitationLoading,
    generate: generateInvitation,
    regenerate: regenerateInvitation,
  } = useInvitation();

  const [notesDraft, setNotesDraft] = useState("");
  const [eventName, setEventName] = useState("주일예배");
  const [eventDate, setEventDate] = useState(getUpcomingSundayLabel);
  const [eventLocation, setEventLocation] = useState("온누리교회 본당");
  const [editedPrayer, setEditedPrayer] = useState("");
  const [editedStrategy, setEditedStrategy] = useState("");
  const [editedInvitation, setEditedInvitation] = useState("");

  useEffect(() => {
    if (target) {
      setNotesDraft(target.notes || "");
    }
  }, [target]);

  const prayedToday = useMemo(() => {
    if (!target) return false;
    return target.prayerDates.includes(new Date().toISOString().slice(0, 10));
  }, [target]);

  const recentPrayerDays = useMemo(() => {
    if (!target) return [];
    const prayed = new Set(target.prayerDates);
    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - index));
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        active: prayed.has(key),
      };
    });
  }, [target]);

  if (!hydrated) {
    return (
      <div className="px-4 py-6 text-sm text-gray-400">대상자를 불러오는 중입니다.</div>
    );
  }

  if (!target) {
    return (
      <div className="px-4 py-6 space-y-4">
        <p className="text-sm text-gray-500">대상자를 찾을 수 없습니다.</p>
        <Link
          href="/main/targets"
          className="inline-flex rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const streak = getPrayStreak(target);
  const lastPrayer = formatDateKey(getLastPrayerDate(target));
  const relationshipLabel =
    TARGET_RELATIONSHIP_OPTIONS.find(
      (option) => option.value === target.relationship
    )?.label || target.relationship;

  const handleSaveNotes = () => {
    updateTarget(target.id, { notes: notesDraft });
  };

  const handleDelete = () => {
    removeTarget(target.id);
    router.push("/main/targets");
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href="/main/targets" className="text-xs font-semibold text-gray-400">
              ← 내 전도
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">{target.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {relationshipLabel} · {target.situation}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="rounded-2xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-500"
          >
            삭제
          </button>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-gray-500">진행 상태</p>
          <div className="flex flex-wrap gap-2">
            {TARGET_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateTarget(target.id, { status: option.value })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  target.status === option.value
                    ? "bg-apolo-yellow text-gray-900"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-gray-500">메모</p>
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            className="w-full min-h-[96px] rounded-2xl bg-gray-50 px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
            placeholder="관계 흐름, 최근 반응, 다음에 건넬 말 등을 적어두세요."
          />
          <button
            onClick={handleSaveNotes}
            className="mt-2 rounded-2xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white"
          >
            메모 저장
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-apolo-yellow-dark uppercase tracking-wide">
              기도
            </p>
            <p className="mt-1 text-sm text-gray-500">
              오늘 기도와 기도문 생성을 한 화면에서 관리합니다.
            </p>
          </div>
          <button
            onClick={() => prayToday(target.id)}
            disabled={prayedToday}
            className="rounded-2xl bg-apolo-yellow px-4 py-2 text-sm font-semibold text-gray-900 disabled:opacity-40"
          >
            {prayedToday ? "오늘 기도함" : "오늘 기도했어요"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-gray-50 px-3 py-3">
            <p className="text-xs text-gray-400">연속 기도</p>
            <p className="mt-1 font-semibold text-gray-900">🔥 {streak}일</p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-3 py-3">
            <p className="text-xs text-gray-400">마지막 기도</p>
            <p className="mt-1 font-semibold text-gray-900">{lastPrayer}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-gray-500">최근 30일</p>
          <div className="grid grid-cols-10 gap-1">
            {recentPrayerDays.map((day) => (
              <div
                key={day.key}
                className={`h-6 rounded-md ${
                  day.active ? "bg-apolo-yellow" : "bg-gray-100"
                }`}
                title={day.key}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <button
            onClick={() => {
              setEditedPrayer("");
              generatePrayer({
                personName: target.name,
                relationship: mapPrayerRelationship(target.relationship),
                topic: "salvation",
                additionalContext: target.notes || target.situation,
              });
            }}
            className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
          >
            이 대상자 기도문 생성
          </button>

          {(prayerLoading || prayer) && (
            <div className="space-y-3">
              {prayerLoading ? (
                <div className="inline-block rounded-bubble bg-apolo-kakao px-2 shadow-bubble">
                  <LoadingDots />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      생성된 기도문
                    </p>
                    <RefreshButton
                      onClick={() =>
                        regeneratePrayer({
                          personName: target.name,
                          relationship: mapPrayerRelationship(target.relationship),
                          topic: "salvation",
                          additionalContext: target.notes || target.situation,
                        })
                      }
                    />
                  </div>
                  <textarea
                    value={editedPrayer || prayer}
                    onChange={(e) => setEditedPrayer(e.target.value)}
                    className="w-full min-h-[220px] rounded-2xl bg-apolo-kakao px-4 py-3 text-[15px] leading-relaxed resize-none focus:outline-none shadow-bubble"
                  />
                  <div className="flex flex-wrap gap-2">
                    <CopyButton text={editedPrayer || prayer} />
                    <ShareButton text={editedPrayer || prayer} />
                  </div>
                  <button
                    onClick={() =>
                      addShare({
                        title: `${target.name} 기도제목`,
                        request: `${target.name}의 ${target.situation}을 위해 함께 기도해주세요.${target.notes ? ` ${target.notes}` : ""}`,
                        targetName: target.name,
                        topic: "salvation",
                        isAnonymous: true,
                      })
                    }
                    className="w-full rounded-2xl border border-apolo-yellow/50 bg-white px-4 py-3 text-sm font-semibold text-gray-900"
                  >
                    기도제목 나눔 게시판에 올리기
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-apolo-yellow-dark uppercase tracking-wide">
              전도 전략
            </p>
            <p className="mt-1 text-sm text-gray-500">
              현재 상황과 메모를 반영해 다음 행동을 정리합니다.
            </p>
          </div>
          {!strategyLoading && !!actionPoints && (
            <RefreshButton
              onClick={() =>
                regenerateStrategy({
                  targetName: target.name,
                  relationship: target.relationship,
                  situation: target.situation,
                  interest: target.interest,
                  additionalContext: target.notes || "",
                })
              }
            />
          )}
        </div>

        <button
          onClick={() => {
            setEditedStrategy("");
            generateStrategy({
              targetName: target.name,
              relationship: target.relationship,
              situation: target.situation,
              interest: target.interest,
              additionalContext: target.notes || "",
            });
          }}
          className="mt-4 w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
        >
          이 대상자 전략 생성
        </button>

        {(strategyLoading || actionPoints) && (
          <div className="mt-4 space-y-3">
            {strategyLoading ? (
              <div className="inline-block rounded-bubble bg-apolo-kakao px-2 shadow-bubble">
                <LoadingDots />
              </div>
            ) : (
              <>
                <textarea
                  value={editedStrategy || actionPoints}
                  onChange={(e) => setEditedStrategy(e.target.value)}
                  className="w-full min-h-[320px] rounded-2xl bg-apolo-kakao px-4 py-3 text-[15px] leading-relaxed resize-none focus:outline-none shadow-bubble"
                />
                <div className="flex flex-wrap gap-2">
                  <CopyButton text={editedStrategy || actionPoints} />
                  <ShareButton text={editedStrategy || actionPoints} />
                </div>
              </>
            )}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
        <p className="text-xs font-semibold text-apolo-yellow-dark uppercase tracking-wide">
          초대
        </p>
        <p className="mt-1 text-sm text-gray-500">
          대상자 이름을 불러서 바로 카톡 초대문을 만듭니다.
        </p>

        <div className="mt-4 space-y-3">
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="모임명"
            className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
          />
          <input
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            placeholder="날짜"
            className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
          />
          <input
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            placeholder="장소"
            className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
          />
          <button
            onClick={() => {
              setEditedInvitation("");
              generateInvitation({
                personName: target.name,
                relationship: mapInvitationRelationship(target.relationship),
                eventType: eventName,
                date: eventDate,
                location: eventLocation,
              });
              if (target.status === "approaching" || target.status === "praying") {
                updateTarget(target.id, { status: "invited" });
              }
            }}
            className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
          >
            이 대상자 초대문 생성
          </button>
        </div>

        {(invitationLoading || message) && (
          <div className="mt-4 space-y-3">
            {invitationLoading ? (
              <div className="inline-block rounded-bubble bg-apolo-kakao px-2 shadow-bubble">
                <LoadingDots />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    생성된 초대문
                  </p>
                  <RefreshButton
                    onClick={() =>
                      regenerateInvitation({
                        personName: target.name,
                        relationship: mapInvitationRelationship(
                          target.relationship
                        ),
                        eventType: eventName,
                        date: eventDate,
                        location: eventLocation,
                      })
                    }
                  />
                </div>
                <textarea
                  value={editedInvitation || message}
                  onChange={(e) => setEditedInvitation(e.target.value)}
                  className="w-full min-h-[220px] rounded-2xl bg-apolo-kakao px-4 py-3 text-[15px] leading-relaxed resize-none focus:outline-none shadow-bubble"
                />
                <div className="flex flex-wrap gap-2">
                  <CopyButton text={editedInvitation || message} />
                  <ShareButton text={editedInvitation || message} />
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
