import { NextResponse } from "next/server";

export async function GET() {
  const hasOpenAIKey = Boolean(
    process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY !== "your_openai_api_key" &&
      process.env.OPENAI_API_KEY !== "your-api-key-here"
  );

  return NextResponse.json({
    hasOpenAIKey,
    environment:
      process.env.VERCEL_ENV ||
      process.env.NODE_ENV ||
      "development",
  });
}

