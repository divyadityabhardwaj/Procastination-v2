import { supabase } from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, userId } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Please enter a name",
    });
  }

  if (!userId) {
    return res.status(400).json({
      error: "Please login again",
    });
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      name,
      user: userId,
    })
    .select("*");

  if (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  return res.status(200).json({
    session: data[0],
  });
}
