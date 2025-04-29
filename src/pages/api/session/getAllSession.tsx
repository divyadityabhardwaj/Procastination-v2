import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function getAllSessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      error: "User ID is required",
    });
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user", userId);

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  return res.status(200).json({
    sessions: data,
  });
}
