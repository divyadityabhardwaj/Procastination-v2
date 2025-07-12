import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function getAuthHeader(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // This endpoint is for development/testing only!
  // It returns the current user's access token if available.
  // You should delete this endpoint before going to production.

  // Try to get the session from a cookie (if using supabase-js on the client)
  // Or, you can pass the token in a custom header or query param for testing.

  // Example: get token from Authorization header (if sent)
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return res
      .status(200)
      .json({ access_token: authHeader.replace(/^Bearer /, "") });
  }

  // If you want to support getting the token from a cookie, you can add that logic here.

  return res
    .status(400)
    .json({ error: "No auth token found in Authorization header." });
}
