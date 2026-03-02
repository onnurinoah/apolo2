import { NextRequest, NextResponse } from "next/server";
import { allQuestions } from "@/data/questions";
import { getOpenAIClient } from "@/lib/openai";
import { STYLE_PROMPTS } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { questionId, questionText, styleId } = body;

  // Try database first
  if (questionId) {
    const question = allQuestions.find((q) => q.id === questionId);
    if (question) {
      const variant = question.answers.find((a) => a.styleId === styleId);
      if (variant) {
        return NextResponse.json({
          answer: variant.content,
          styleId,
          source: "database",
          questionId,
        });
      }
    }
  }

  // AI fallback
  const openai = getOpenAIClient();
  if (!openai) {
    // No API key - return a fallback message
    return NextResponse.json({
      answer:
        "현재 AI 답변 생성 기능을 사용할 수 없습니다. OpenAI API 키를 설정해주세요.",
      styleId,
      source: "fallback",
      questionId,
    });
  }

  try {
    const systemPrompt = STYLE_PROMPTS[styleId] || STYLE_PROMPTS.formal;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: questionText || "이 질문에 답해주세요." },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = completion.choices[0]?.message?.content || "답변을 생성할 수 없습니다.";

    return NextResponse.json({
      answer,
      styleId,
      source: "ai",
      questionId,
    });
  } catch (error) {
    console.error("OpenAI answer generation failed:", error);

    return NextResponse.json({
      answer:
        "OpenAI 실시간 답변 호출이 실패했습니다. 보통 결제 한도, 프로젝트 권한, 또는 모델 접근 권한 문제일 수 있습니다. 잠시 후 다시 시도하거나 OpenAI billing/project 설정을 확인해주세요.",
      styleId,
      source: "fallback",
      questionId,
    });
  }
}
