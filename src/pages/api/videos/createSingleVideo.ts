import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createSingleVideo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { noteId, videoUrl } = req.query;
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Missing authorization header" });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "Invalid user session" });

  // Check note ownership
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("id, user_id")
    .eq("id", noteId)
    .single();
  if (noteError || !note || note.user_id !== user.id) {
    return res.status(403).json({ error: "You do not own this note" });
  }

  try {
    console.log("Creating video for note:", noteId, "with URL:", videoUrl);

    const { title } = await handler(videoUrl as string);
    console.log("Got title from YouTube API:", title);

    const { data, error } = await supabase
      .from("videos")
      .insert({
        note_id: noteId,
        youtube_url: videoUrl,
        title,
      })
      .select("*");

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Successfully created video:", data);
    return res.status(200).json({ videos: data });
  } catch (error: any) {
    console.error("Main function error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

export async function handler(youtubeUrl: string) {
  try {
    console.log("Processing YouTube URL:", youtubeUrl);

    const urlObj = new URL(youtubeUrl);
    const videoId = urlObj.searchParams.get("v");
    if (!videoId) {
      throw new Error("Invalid YouTube URL: Missing 'v' parameter");
    }

    console.log("Extracted video ID:", videoId);

    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error("YouTube API key is not configured");
    }

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;
    console.log(
      "Making YouTube API request to:",
      apiUrl.replace(process.env.YOUTUBE_API_KEY!, "[API_KEY]")
    );

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("YouTube API error:", response.status, errorText);
      throw new Error(
        `Failed to fetch YouTube video details: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("YouTube API response:", JSON.stringify(data, null, 2));

    if (!data?.items || data.items.length === 0 || !data.items[0]?.snippet) {
      throw new Error("Invalid YouTube video data received");
    }

    const { title } = data.items[0].snippet;
    console.log("Extracted title:", title);
    return { title };
  } catch (error: any) {
    console.error("Handler error:", error);
    throw error;
  }
}
