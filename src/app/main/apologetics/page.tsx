"use client";

import { useCallback, useEffect, useState } from "react";
import ChatBubble from "@/components/ui/ChatBubble";
import CopyButton from "@/components/ui/CopyButton";
import LoadingDots from "@/components/ui/LoadingDots";
import RefreshButton from "@/components/ui/RefreshButton";
import ShareButton from "@/components/ui/ShareButton";
import StyleBadge from "@/components/ui/StyleBadge";
import Onboarding, { useOnboarding } from "@/components/Onboarding";
import { categories } from "@/data/categories";
import { answerStyles } from "@/data/styles";
import { useAnswer } from "@/hooks/useAnswer";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuestionSearch } from "@/hooks/useQuestionSearch";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { CategoryId } from "@/types/question";

interface QuestionItem {
  id: string;
  categoryId: string;
  question: string;
}

function EditableBubble({
  text,
  onChange,
}: {
  text: string;
  onChange: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="w-full">
        <textarea
          autoFocus
          className="w-full min-h-[120px] rounded-2xl bg-apolo-kakao p-4 text-[15px] leading-relaxed text-gray-900 resize-none focus:outline-none shadow-bubble"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          탭 밖을 누르면 완료
        </p>
      </div>
    );
  }

  return (
    <div className="w-full cursor-pointer" onClick={() => setEditing(true)}>
      <ChatBubble variant="sent">{text}</ChatBubble>
      <p className="mt-1 text-right text-xs text-gray-300">탭하여 편집</p>
    </div>
  );
}

function AnswerView({
  question,
  onBack,
}: {
  question: QuestionItem;
  onBack: () => void;
}) {
  const answer = useAnswer();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [editedText, setEditedText] = useState("");
  const isCustom = question.id.startsWith("custom-");
  const fav = isFavorite(question.id);

  useEffect(() => {
    answer.loadAnswer(isCustom ? "" : question.id, question.question);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  useEffect(() => {
    if (answer.text) setEditedText("");
  }, [answer.text, answer.styleId]);

  const displayText = editedText || answer.text;
  const categoryInfo = categories.find((category) => category.id === question.categoryId);

  return (
    <div className="flex h-full flex-col animate-fade-in-up">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="#374151"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-gray-400">
            {isCustom ? "💬 직접 질문" : `${categoryInfo?.icon} ${categoryInfo?.nameKo}`}
          </p>
          <p className="truncate text-sm font-semibold text-gray-900">
            {question.question}
          </p>
        </div>
        {!isCustom && (
          <button
            onClick={() => toggleFavorite(question)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-90"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={fav ? "#FFD43B" : "none"}
              stroke={fav ? "#FFD43B" : "#9CA3AF"}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>

      {isCustom && (
        <div className="mx-4 mt-2 rounded-xl bg-blue-50 px-3 py-1.5">
          <p className="text-xs text-blue-600">
            🤖 AI가 답변을 생성합니다 (OpenAI GPT-4o-mini)
          </p>
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        <ChatBubble variant="received">{question.question}</ChatBubble>

        <div className="flex flex-col items-end gap-2">
          {answer.isLoading ? (
            <div className="rounded-bubble bg-apolo-kakao px-2 shadow-bubble">
              <LoadingDots />
            </div>
          ) : answer.error ? (
            <div className="chat-bubble chat-bubble-sent chat-bubble-tail-right">
              <p className="text-sm text-red-500">{answer.error}</p>
            </div>
          ) : answer.text ? (
            <EditableBubble text={displayText} onChange={setEditedText} />
          ) : null}
        </div>
      </div>

      {(answer.text || answer.isLoading) && (
        <div className="space-y-3 border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <StyleBadge name={answer.styleName} />
            <RefreshButton
              onClick={() =>
                answer.nextStyle(isCustom ? "" : question.id, question.question)
              }
              disabled={answer.isLoading}
            />
            <span className="ml-auto text-xs text-gray-300">
              {answerStyles.findIndex((style) => style.id === answer.styleId) + 1}/
              {answerStyles.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={displayText} />
            <ShareButton text={displayText} />
          </div>
        </div>
      )}
    </div>
  );
}

function CustomQuestionInput({
  onSubmit,
}: {
  onSubmit: (question: string) => void;
}) {
  const [text, setText] = useState("");
  const voice = useVoiceInput();

  useEffect(() => {
    if (voice.transcript) {
      setText(voice.transcript);
    }
  }, [voice.transcript]);

  const handleSubmit = () => {
    const question = text.trim();
    if (!question) return;
    onSubmit(question);
    setText("");
    voice.resetTranscript();
  };

  return (
    <div className="space-y-3 animate-fade-in-up">
      <div className="relative">
        <textarea
          placeholder={"궁금한 것을 자유롭게 질문하세요...\n예: 왜 하나님이 선하시다면 고통이 있나요?"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px] w-full rounded-2xl bg-white p-4 pr-12 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-apolo-yellow"
        />
        {voice.isSupported && (
          <button
            onClick={() =>
              voice.isListening ? voice.stopListening() : voice.startListening()
            }
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              voice.isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-200 text-gray-500 active:bg-gray-300"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect
                x="9"
                y="2"
                width="6"
                height="12"
                rx="3"
                fill="currentColor"
              />
              <path
                d="M5 10V11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11V10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 18V22M8 22H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {voice.isListening && (
        <p className="text-xs text-red-500 animate-pulse">
          🎙️ 듣고 있습니다... 말씀해주세요
        </p>
      )}
      {voice.error && <p className="text-xs text-red-400">{voice.error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="w-full rounded-2xl bg-apolo-yellow py-3 text-sm font-bold text-gray-900 disabled:opacity-40 active:bg-apolo-yellow-dark transition-colors"
      >
        AI에게 질문하기
      </button>

      <p className="text-center text-xs text-gray-400">
        AI(GPT-4o-mini)가 보수 개혁주의 관점으로 답변합니다.
      </p>
    </div>
  );
}

function CategoryChips({
  selected,
  onSelect,
}: {
  selected?: CategoryId;
  onSelect: (id?: CategoryId) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-1 py-1 scrollbar-hide">
      <button
        onClick={() => onSelect(undefined)}
        className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          !selected
            ? "bg-apolo-yellow text-gray-900"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        전체
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            selected === category.id
              ? "bg-apolo-yellow text-gray-900"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {category.icon} {category.nameKo}
        </button>
      ))}
    </div>
  );
}

function QuestionCard({
  question,
  isFav,
  onTap,
}: {
  question: QuestionItem;
  isFav: boolean;
  onTap: () => void;
}) {
  const categoryInfo = categories.find((category) => category.id === question.categoryId);

  return (
    <button
      onClick={onTap}
      className="w-full rounded-2xl border border-gray-50 bg-white px-4 py-4 text-left shadow-card transition-colors active:bg-gray-50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {categoryInfo && (
            <span className="mb-2 inline-flex items-center rounded-full bg-apolo-yellow-light px-2 py-0.5 text-xs font-medium text-apolo-yellow-dark">
              {categoryInfo.icon} {categoryInfo.nameKo}
            </span>
          )}
          <p className="text-sm font-medium leading-snug text-gray-900">
            {question.question}
          </p>
        </div>
        <div className="mt-1 flex flex-shrink-0 items-center gap-1">
          {isFav && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD43B">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          )}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="#D1D5DB"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: "ai" | "db";
  onChange: (mode: "ai" | "db") => void;
}) {
  return (
    <div className="rounded-2xl bg-gray-100 p-1">
      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={() => onChange("ai")}
          className={`rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${
            mode === "ai" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
          }`}
        >
          AI 질문
        </button>
        <button
          onClick={() => onChange("db")}
          className={`rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${
            mode === "db" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
          }`}
        >
          DB 찾기
        </button>
      </div>
    </div>
  );
}

export default function ApologeticsPage() {
  const { show: showOnboarding, done: onboardingDone } = useOnboarding();
  const [mode, setMode] = useState<"ai" | "db">("ai");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | undefined>();
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionItem | null>(null);
  const { results, isLoading } = useQuestionSearch(query, selectedCategory);
  const { favorites, isFavorite } = useFavorites();

  const handleSelectCategory = useCallback((id?: CategoryId) => {
    setSelectedCategory(id);
    setSelectedQuestion(null);
  }, []);

  const handleCustomQuestion = useCallback((questionText: string) => {
    setSelectedQuestion({
      id: `custom-${Date.now()}`,
      categoryId: "custom",
      question: questionText,
    });
  }, []);

  if (showOnboarding) {
    return <Onboarding onDone={onboardingDone} />;
  }

  if (selectedQuestion) {
    return (
      <AnswerView
        question={selectedQuestion}
        onBack={() => setSelectedQuestion(null)}
      />
    );
  }

  const favoriteShortcuts = favorites.slice(0, 3);

  return (
    <div className="flex flex-col">
      <div className="space-y-4 px-4 pb-6 pt-4">
        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-apolo-yellow-dark">
            변증답변
          </p>
          <h1 className="mt-1 text-xl font-bold text-gray-900">
            전도 현장에서 바로 꺼내 쓰는 답변
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            자유 질문을 먼저 열어 두고, 자주 묻는 질문 DB는 보조 탐색으로 둡니다.
          </p>
        </div>

        <ModeToggle mode={mode} onChange={setMode} />

        {mode === "ai" ? (
          <div className="space-y-4 animate-fade-in-up">
            <div className="rounded-3xl border border-apolo-yellow/30 bg-gradient-to-br from-apolo-yellow-light via-white to-amber-50 p-4 shadow-card">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-apolo-yellow text-lg">
                  🤖
                </span>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    직접 질문이 기본입니다
                  </p>
                  <p className="text-xs text-gray-500">
                    120개 DB에 없는 질문도 AI가 바로 답합니다.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <CustomQuestionInput onSubmit={handleCustomQuestion} />
              </div>
            </div>

            {favoriteShortcuts.length > 0 && (
              <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  자주 보는 질문
                </p>
                <div className="mt-3 space-y-2">
                  {favoriteShortcuts.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={{
                        id: question.id,
                        categoryId: question.categoryId,
                        question: question.question,
                      }}
                      isFav={true}
                      onTap={() =>
                        setSelectedQuestion({
                          id: question.id,
                          categoryId: question.categoryId,
                          question: question.question,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5L21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="질문 키워드를 입력하세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-2xl bg-gray-50 py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow transition-shadow"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>

            <CategoryChips
              selected={selectedCategory}
              onSelect={handleSelectCategory}
            />

            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <LoadingDots />
                </div>
              ) : results.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  검색 결과가 없습니다
                </div>
              ) : (
                results.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isFav={isFavorite(question.id)}
                    onTap={() => setSelectedQuestion(question)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
