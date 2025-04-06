import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return res.status(200).json({
      message: "Login successful",
      session: data.session,
      user: data.user,
    });
  } catch (error: any) {
    console.log("LOGIN CATCH", JSON.stringify(error));
    return res.status(400).json({
      error: error.message,
    });
  }
}
