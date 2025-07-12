import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getVideosByNote(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { note_id } = req.query;
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

  if (!note_id) {
    return res.status(400).json({ error: "Missing note_id" });
  }

  // First check if the note belongs to the user
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .select("id, user_id")
    .eq("id", note_id)
    .single();

  if (noteError || !note || note.user_id !== user.id) {
    return res.status(403).json({ error: "You do not own this note" });
  }

  // Get videos for this note
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("note_id", note_id)
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ videos: data });
}
