import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";
import { YoutubeTranscript } from "youtube-transcript";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function getSubtitles(videoId: string): Promise<string | null> {
  try {
    console.log("Fetching transcript for video ID:", videoId);

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log("Transcript fetched successfully, length:", transcript.length);

    const formattedTranscript = transcript
      .map((line: any) => line.text)
      .join(" ");

    console.log("Formatted transcript length:", formattedTranscript.length);
    return formattedTranscript;
  } catch (error: any) {
    console.error("Error fetching transcript:", error);
    return null; // Return null instead of throwing to allow fallback
  }
}

async function getVideoMetadata(
  videoId: string
): Promise<{ title: string; description: string } | null> {
  try {
    console.log("Fetching video metadata for video ID:", videoId);

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Fetch the YouTube page
    const response = await fetch(videoUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video page: ${response.status}`);
    }

    const html = await response.text();

    // Extract title using regex
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch
      ? titleMatch[1].replace(" - YouTube", "").trim()
      : "Unknown Title";

    // Extract description using regex (look for meta description or og:description)
    let description = "No description available";

    // Try meta description first
    const metaDescMatch = html.match(
      /<meta[^>]*name="description"[^>]*content="([^"]*)"/i
    );
    if (metaDescMatch) {
      description = metaDescMatch[1].trim();
    } else {
      // Try og:description
      const ogDescMatch = html.match(
        /<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i
      );
      if (ogDescMatch) {
        description = ogDescMatch[1].trim();
      }
    }

    // Clean up description (remove HTML entities and extra whitespace)
    description = description
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

    // Limit description length
    if (description.length > 500) {
      description = description.substring(0, 500) + "...";
    }

    console.log("Video metadata fetched successfully");

    return {
      title,
      description,
    };
  } catch (error: any) {
    console.error("Error fetching video metadata:", error);
    return null;
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

    console.log("Processing video summary request for video ID:", videoId);

    if (!videoId) {
      return res.status(400).json({ error: "Video ID is required" });
    }

    // First, try to get transcript from YouTube
    const transcript = await getSubtitles(videoId);

    let summaryPrompt = "";
    let summarySource = "";

    if (transcript && transcript.trim().length > 0) {
      // Use transcript for summary
      summaryPrompt = `
        Here is the transcript of the video:
        ${transcript}
        
        Please provide a concise summary of the video based on this transcript.
        Focus on the key points and main ideas discussed in the video.
      `;
      summarySource = "transcript";
    } else {
      // Fallback to video metadata
      console.log("No transcript available, fetching video metadata...");
      const metadata = await getVideoMetadata(videoId);

      if (!metadata) {
        return res.status(400).json({
          error:
            "Unable to fetch video information. The video might be private, deleted, or unavailable.",
        });
      }

      summaryPrompt = `
        Here is the information about a YouTube video:
        
        Title: ${metadata.title}
        Description: ${metadata.description}
        
        Please provide a concise summary of what this video is about based on the title and description.
        Focus on the main topic and key points that would be covered in this video.
        If the description is very short or generic, focus on what can be inferred from the title.
      `;
      summarySource = "metadata";
    }

    console.log(`Generating summary with Gemini API using ${summarySource}...`);

    // Create chat with Gemini
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: [],
    });

    // Generate summary
    const response = await chat.sendMessage({
      message: summaryPrompt,
    });

    console.log("Summary generated successfully");

    return res.status(200).json({
      response: response.text,
      source: summarySource, // Indicate whether summary was based on transcript or metadata
    });
  } catch (error: any) {
    console.error("Error in getVideoSummary:", error);

    return res.status(500).json({
      error: error.message || "Failed to get summary from Gemini API",
    });
  }
}
