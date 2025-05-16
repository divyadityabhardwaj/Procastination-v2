import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { handler } from "./createSingleVideo";

export default async function createMultipleVideosFromPlaylist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sessionId, playlistUrl } = req.query;

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
          const { title, thumbnail } = await handler(video);
          const { data, error } = await supabase
            .from("videos")
            .insert({
              session_id: sessionId,
              thumbnail,
              youtube_url: video,
              name: title,
            })
            .select("*");

          if (error) {
            throw error;
          }

          return data[0];
        } catch (error) {
          console.error(`Error processing video ${video}:`, error);
          throw error;
        }
      })
    );

    return res.status(200).json({
      videos: results,
      message: "Successfully created videos from playlist",
    });
  } catch (error: any) {
    console.error("Error creating videos from playlist:", error);
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
