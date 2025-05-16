import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createSingleVideo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sessionId, videoUrl } = req.query;

  try {
    const { title, thumbnail } = await handler(videoUrl as string);
    const { data, error } = await supabase
      .from("videos")
      .insert({
        session_id: sessionId,
        thumbnail,
        youtube_url: videoUrl,
        name: title,
      })
      .select("*"); // Select the inserted data

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      videos: data,
    });
  } catch (error: any) {
    console.error("Error creating video:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function handler(youtubeUrl: string) {
  try {
    const urlObj = new URL(youtubeUrl);
    const videoId = urlObj.searchParams.get("v");
    if (!videoId) {
      throw new Error("Invalid YouTube URL: Missing 'v' parameter");
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(
        `YouTube API error: ${response.status} - ${response.statusText}`
      );
      throw new Error(
        `Failed to fetch YouTube video details: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (!data?.items || data.items.length === 0 || !data.items[0]?.snippet) {
      console.error("Invalid YouTube API response:", data);
      throw new Error("Invalid YouTube video data received");
    }

    const { title, thumbnails } = data.items[0].snippet;
    const result = {
      videoId,
      title,
      thumbnail: thumbnails.high?.url, // Added a check for thumbnails.high
    };
    return result;
  } catch (error: any) {
    console.error("Error in handler:", error);
    throw error; // Re-throw the error to be caught in createSingleVideo
  }
}
