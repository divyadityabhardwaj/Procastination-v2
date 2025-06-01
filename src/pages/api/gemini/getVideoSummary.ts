import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";
import { YoutubeTranscript } from "youtube-transcript";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function getSubtitles(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    const formattedTranscript = transcript
      .map((line: any) => line.text)
      .join(" ");

    return formattedTranscript;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error("Failed to fetch transcript");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { videoId } = req.body;

    // Get transcript from YouTube
    const transcript = await getSubtitles(videoId);

    // Create chat with Gemini
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: [],
    });

    // Use transcript as context for the summary
    const response = await chat.sendMessage({
      message: `
        Here is the transcript of the video:
        ${transcript}
        
        Please provide a concise summary of the video based on this transcript.
        Focus on the key points and main ideas discussed in the video.
        `,
    });

    return res.status(200).json({
      response: response.text,
    });
  } catch (error: any) {
    console.error("Error in getVideoSummary:", error);
    return res.status(500).json({
      error: error.message || "Failed to get summary from Gemini API",
    });
  }
}
