import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

export async function GET(request: NextRequest) {
  const hasOpenAIKey = Boolean(
    process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "your_openai_api_key" &&
      process.env.OPENAI_API_KEY !== "your-api-key-here"
  );

  const shouldProbe = request.nextUrl.searchParams.get("probe") === "ai";
  let aiReachable: boolean | null = null;
  let aiError: string | null = null;

  if (shouldProbe && hasOpenAIKey) {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        aiReachable = false;
        aiError = "OpenAI client initialization failed";
      } else {
        await openai.models.retrieve("gpt-4o-mini");
        aiReachable = true;
      }
    } catch (error) {
      aiReachable = false;
      aiError =
        error instanceof Error ? error.message : "Unknown OpenAI error";
      console.error("OpenAI health probe failed:", error);
    }
  }

  return NextResponse.json({
    hasOpenAIKey,
    aiReachable,
    aiError,
    environment:
      process.env.VERCEL_ENV ||
      process.env.NODE_ENV ||
      "development",
  });
}
