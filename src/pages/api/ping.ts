// src/pages/api/ping.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Ping request received");
  console.log("Request method:", req.method);
  console.log("Request body:", req.body);
  if (req.method === "POST" || req.method === "GET") {
    return res.status(200).json({ message: "API is running" });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
