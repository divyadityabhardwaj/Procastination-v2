// src/pages/api/ping.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "POST" || req.method === "GET") {
    return res.status(200).json({ message: "API is running" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
