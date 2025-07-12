import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getAllSessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

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

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", user.id);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ sessions: data });
}
