"use client";

import { useState, useCallback, useEffect } from "react";
import { categories } from "@/data/categories";
import { answerStyles } from "@/data/styles";
import { useQuestionSearch } from "@/hooks/useQuestionSearch";
import { useAnswer } from "@/hooks/useAnswer";
import { useFavorites } from "@/hooks/useFavorites";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { CategoryId } from "@/types/question";
import ChatBubble from "@/components/ui/ChatBubble";
import LoadingDots from "@/components/ui/LoadingDots";
import RefreshButton from "@/components/ui/RefreshButton";
import CopyButton from "@/components/ui/CopyButton";
import ShareButton from "@/components/ui/ShareButton";
import StyleBadge from "@/components/ui/StyleBadge";
import Onboarding, { useOnboarding } from "@/components/Onboarding";

interface QuestionItem {
  id: string;
  categoryId: string;
  question: string;
}

// ─── Inline-editable answer bubble ──────────────────────────
function EditableBubble({
  text,
  onChange,
}: {
  text: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="w-full">
        <textarea
          autoFocus
          className="w-full min-h-[120px] p-4 rounded-2xl bg-apolo-kakao text-gray-900 text-[15px] leading-relaxed resize-none focus:outline-none shadow-bubble"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          탭 밖을 누르면 완료
        </p>
      </div>
    );
  }

  return (
    <div className="w-full cursor-pointer" onClick={() => setEditing(true)}>
      <ChatBubble variant="sent">{text}</ChatBubble>
      <p className="text-xs text-gray-300 mt-1 text-right">탭하여 편집</p>
    </div>
  );
}

// ─── Answer View ─────────────────────────────────────────────
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

  // Load answer on mount
  useEffect(() => {
    answer.loadAnswer(isCustom ? "" : question.id, question.question);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  // Reset edited text when new answer arrives
  useEffect(() => {
    if (answer.text) setEditedText("");
  }, [answer.text, answer.styleId]);

  const displayText = editedText || answer.text;

  const catInfo = categories.find((c) => c.id === question.categoryId);

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      {/* Back header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center active:bg-gray-100"
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
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 truncate">
            {isCustom ? "💬 직접 질문" : `${catInfo?.icon} ${catInfo?.nameKo}`}
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {question.question}
          </p>
        </div>
        {/* Favorite (hide for custom) */}
        {!isCustom && (
          <button
            onClick={() => toggleFavorite(question)}
            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
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

      {/* AI indicator for custom questions */}
      {isCustom && (
        <div className="mx-4 mt-2 px-3 py-1.5 bg-blue-50 rounded-xl">
          <p className="text-xs text-blue-600">
            🤖 AI가 답변을 생성합니다 (OpenAI GPT-4o-mini)
          </p>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Question bubble (received) */}
        <ChatBubble variant="received">{question.question}</ChatBubble>

        {/* Answer bubble (sent) */}
        <div className="flex flex-col items-end gap-2">
          {answer.isLoading ? (
            <div className="bg-apolo-kakao rounded-bubble shadow-bubble px-2">
              <LoadingDots />
            </div>
          ) : answer.error ? (
            <div className="chat-bubble chat-bubble-sent chat-bubble-tail-right">
              <p className="text-red-500 text-sm">{answer.error}</p>
            </div>
          ) : answer.text ? (
            <EditableBubble text={displayText} onChange={setEditedText} />
          ) : null}
        </div>
      </div>

      {/* Controls */}
      {(answer.text || answer.isLoading) && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-3">
          {/* Style badge + refresh */}
          <div className="flex items-center gap-2">
            <StyleBadge name={answer.styleName} />
            <RefreshButton
              onClick={() =>
                answer.nextStyle(
                  isCustom ? "" : question.id,
                  question.question
                )
              }
              disabled={answer.isLoading}
            />
            <span className="text-xs text-gray-300 ml-auto">
              {answerStyles.findIndex((s) => s.id === answer.styleId) + 1}/
              {answerStyles.length}
            </span>
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            <CopyButton text={displayText} />
            <ShareButton text={displayText} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Custom Question Input ───────────────────────────────────
function CustomQuestionInput({
  onSubmit,
}: {
  onSubmit: (question: string) => void;
}) {
  const [text, setText] = useState("");
  const voice = useVoiceInput();

  // Sync voice transcript to text
  useEffect(() => {
    if (voice.transcript) {
      setText(voice.transcript);
    }
  }, [voice.transcript]);

  const handleSubmit = () => {
    const q = text.trim();
    if (q) {
      onSubmit(q);
      setText("");
      voice.resetTranscript();
    }
  };

  return (
    <div className="space-y-3 animate-fade-in-up">
      <div className="relative">
        <textarea
          placeholder="궁금한 것을 자유롭게 질문하세요...&#10;예: 하나님이 정말 존재하나요?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[100px] p-4 pr-12 bg-gray-50 rounded-2xl text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-apolo-yellow transition-shadow"
        />
        {/* Microphone button */}
        {voice.isSupported && (
          <button
            onClick={() =>
              voice.isListening ? voice.stopListening() : voice.startListening()
            }
            className={`absolute right-3 top-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
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

      {/* Voice status */}
      {voice.isListening && (
        <p className="text-xs text-red-500 animate-pulse">
          🎙️ 듣고 있습니다... 말씀해주세요
        </p>
      )}
      {voice.error && (
        <p className="text-xs text-red-400">{voice.error}</p>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!text.trim()}
        className="w-full py-3 rounded-2xl bg-apolo-yellow text-gray-900 font-bold text-sm disabled:opacity-40 active:bg-apolo-yellow-dark transition-colors"
      >
        AI에게 질문하기 🤖
      </button>

      <p className="text-xs text-gray-300 text-center">
        AI(GPT-4o-mini)가 보수 개혁주의 관점으로 답변합니다
      </p>
    </div>
  );
}

// ─── Category Chips ───────────────────────────────────────────
function CategoryChips({
  selected,
  onSelect,
}: {
  selected?: CategoryId;
  onSelect: (id?: CategoryId) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
      <button
        onClick={() => onSelect(undefined)}
        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          !selected
            ? "bg-apolo-yellow text-gray-900"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selected === cat.id
              ? "bg-apolo-yellow text-gray-900"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {cat.icon} {cat.nameKo}
        </button>
      ))}
    </div>
  );
}

// ─── Question Card ─────────────────────────────────────────────
function QuestionCard({
  question,
  isFav,
  onTap,
}: {
  question: QuestionItem;
  isFav: boolean;
  onTap: () => void;
}) {
  const cat = categories.find((c) => c.id === question.categoryId);
  return (
    <button
      onClick={onTap}
      className="w-full text-left bg-white rounded-2xl shadow-card border border-gray-50 px-4 py-4 active:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center text-xs font-medium text-apolo-yellow-dark bg-apolo-yellow-light px-2 py-0.5 rounded-full mb-2">
            {cat?.icon} {cat?.nameKo}
          </span>
          <p className="text-sm font-medium text-gray-900 leading-snug">
            {question.question}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 mt-1">
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

// ─── Main Page ────────────────────────────────────────────────
export default function ApologeticsPage() {
  const { show: showOnboarding, done: onboardingDone } = useOnboarding();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryId | undefined
  >();
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionItem | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
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
    setShowCustomInput(false);
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

  return (
    <div className="flex flex-col">
      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
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
            className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-apolo-yellow transition-shadow"
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
      </div>

      {/* "Ask your own" card */}
      <div className="px-4 pb-2">
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full bg-gradient-to-r from-apolo-yellow-light to-amber-50 rounded-2xl px-4 py-3 flex items-center gap-3 active:opacity-80 transition-opacity border border-apolo-yellow/30"
          >
            <div className="w-10 h-10 rounded-xl bg-apolo-yellow flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect
                  x="9"
                  y="2"
                  width="6"
                  height="12"
                  rx="3"
                  fill="white"
                />
                <path
                  d="M5 10V11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11V10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 18V22M8 22H16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-gray-900">
                직접 질문하기
              </p>
              <p className="text-xs text-gray-500">
                텍스트 또는 음성으로 자유롭게 질문하세요
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="#D1D5DB"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">
                💬 직접 질문하기
              </h3>
              <button
                onClick={() => setShowCustomInput(false)}
                className="text-xs text-gray-400"
              >
                닫기
              </button>
            </div>
            <CustomQuestionInput onSubmit={handleCustomQuestion} />
          </div>
        )}
      </div>

      {/* Category chips */}
      <CategoryChips
        selected={selectedCategory}
        onSelect={handleSelectCategory}
      />

      {/* Content */}
      <div className="px-4 py-2 space-y-3">
        {/* Favorites section */}
        {favorites.length > 0 && !query && !selectedCategory && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              ♥ 즐겨찾기
            </p>
            <div className="space-y-2">
              {favorites.slice(0, 3).map((fav) => (
                <QuestionCard
                  key={fav.id}
                  question={fav}
                  isFav={true}
                  onTap={() => setSelectedQuestion(fav)}
                />
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 mb-2" />
          </div>
        )}

        {/* Question list */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingDots />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-sm text-gray-400">
              {query
                ? `"${query}"에 대한 질문을 찾을 수 없어요`
                : "질문이 없습니다"}
            </p>
          </div>
        ) : (
          <>
            {!query && !selectedCategory && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                전체 질문 ({results.length})
              </p>
            )}
            {results.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                isFav={isFavorite(q.id)}
                onTap={() => setSelectedQuestion(q)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
