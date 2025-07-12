import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { history, message, videoContext } = req.body;

    if (!history || !Array.isArray(history)) {
      return res.status(400).json({ error: "History must be an array" });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message must be a string" });
    }

    // Build context from video information if available
    let contextMessage = "";
    if (videoContext && videoContext.length > 0) {
      contextMessage = `\n\nContext from videos in this note:\n${videoContext
        .map((video: any) => `- ${video.title}: ${video.url}`)
        .join("\n")}\n\n`;
    }

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: history.map((item: any) => ({
        role: item.role,
        parts: [{ text: item.content }],
      })),
    });

    const response = await chat.sendMessage({
      message: contextMessage + message,
    });

    return res.status(200).json({
      response: response.text,
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: error.message || "Failed to get response from Gemini API",
    });
  }
}
