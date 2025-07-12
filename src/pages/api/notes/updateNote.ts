import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function updateNote(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, content } = req.body;
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

  if (!id || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("notes")
    .update({ content })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ note: data[0] });
}
