import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createNoteInSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id, title, content } = req.body;
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

  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      session_id,
      user_id: user.id,
      title,
      content,
    })
    .select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ note: data[0] });
}
