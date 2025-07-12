import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { handler } from "./createSingleVideo";

export default async function createMultipleVideosFromPlaylist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { noteId, playlistUrl } = req.query;
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

  if (!playlistUrl) {
    return res.status(400).json({ error: "Playlist URL is required" });
  }

  try {
    // Extract playlist ID from URL
    const urlObj = new URL(playlistUrl as string);
    const playlistId = urlObj.searchParams.get("list");
    if (!playlistId) {
      throw new Error("Invalid YouTube playlist URL: Missing 'list' parameter");
    }

    // Get all videos from playlist
    const videos = await fetchPlaylistVideos(playlistId);

    // Process each video and insert into Supabase
    const results = await Promise.all(
      videos.map(async (video) => {
        try {
          const { title } = await handler(video);
          const { data, error } = await supabase
            .from("videos")
            .insert({
              note_id: noteId,
              youtube_url: video,
              title,
            })
            .select("*");

          if (error) {
            throw error;
          }

          return data[0];
        } catch (error) {
          throw error;
        }
      })
    );

    return res.status(200).json({
      videos: results,
      message: "Successfully created videos from playlist",
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}

async function fetchPlaylistVideos(playlistId: string) {
  const videos: string[] = [];
  let nextPageToken: string | null = null;

  do {
    const apiUrl: string = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50${
      nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }&key=${process.env.YOUTUBE_API_KEY}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist items: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.items) {
      videos.push(
        ...data.items.map(
          (item: any) =>
            `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
        )
      );
    }

    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return videos;
}
