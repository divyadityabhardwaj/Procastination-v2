import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.TEST_EMAIL || "demo@example.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "123456";

// Helper to extract access token from login response
async function loginAndGetToken(request: any) {
  const res = await request.post("/api/auth/login", {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
  });
  console.log("Login response status:", res.status());
  let data;
  try {
    data = await res.json();
    console.log("Login response body:", data);
  } catch (e) {
    console.log("Login response not JSON:", await res.text());
    throw e;
  }
  expect(res.ok()).toBeTruthy();
  expect(data.session && data.session.access_token).toBeTruthy();
  return data.session.access_token;
}

test.describe("Full API Flow", () => {
  let accessToken: string;
  let sessionId: string;
  let noteId: string;
  let videoId: string;

  test("Login, create session, create note, get notes, add video, AI chat", async ({
    request,
  }) => {
    // 1. Login
    accessToken = await loginAndGetToken(request);

    // 2. Create session
    const sessionRes = await request.post("/api/session/createSession", {
      data: { name: "Test Session " + Date.now() },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Create session status:", sessionRes.status());
    const sessionData = await sessionRes.json();
    console.log("Create session body:", sessionData);
    expect(sessionRes.ok()).toBeTruthy();
    expect(sessionData.session).toBeTruthy();
    sessionId = sessionData.session.id;

    // 3. Create note in session
    const noteRes = await request.post("/api/notes/createNote", {
      data: { session_id: sessionId, content: "Test note content" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Create note status:", noteRes.status());
    const noteData = await noteRes.json();
    console.log("Create note body:", noteData);
    expect(noteRes.ok()).toBeTruthy();
    expect(noteData.note).toBeTruthy();
    noteId = noteData.note.id;

    // 4. Get all notes for session
    const getNotesRes = await request.get(
      `/api/notes/getNotesBySession?session_id=${sessionId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("Get notes status:", getNotesRes.status());
    const notesList = await getNotesRes.json();
    console.log("Get notes body:", notesList);
    expect(getNotesRes.ok()).toBeTruthy();
    expect(Array.isArray(notesList.notes)).toBeTruthy();
    expect(notesList.notes.find((n: any) => n.id === noteId)).toBeTruthy();

    // 5. Add a video to the note
    const testYoutubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const videoRes = await request.post(
      `/api/videos/createSingleVideo?noteId=${noteId}&videoUrl=${encodeURIComponent(
        testYoutubeUrl
      )}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("Create video status:", videoRes.status());
    const videoData = await videoRes.json();
    console.log("Create video body:", videoData);
    expect(videoRes.ok()).toBeTruthy();
    expect(Array.isArray(videoData.videos)).toBeTruthy();
    expect(videoData.videos[0].youtube_url).toContain("youtube.com");
    videoId = videoData.videos[0].id;

    // 6. Call AI chat summary (Gemini)
    const aiRes = await request.post("/api/gemini/getVideoSummary", {
      data: { videoId: "dQw4w9WgXcQ" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("AI summary status:", aiRes.status());
    const aiData = await aiRes.json();
    console.log("AI summary body:", aiData);
    expect(aiRes.ok()).toBeTruthy();
    expect(typeof aiData.response).toBe("string");
    expect(aiData.response.length).toBeGreaterThan(0);
  });
});
