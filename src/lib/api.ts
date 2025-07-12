// API client for making authenticated requests to our backend
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch (e) {
      console.error("Could not parse error response as JSON");
    }

    // Handle authentication errors
    if (response.status === 401) {
      // Clear invalid token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/";
      }
      throw new Error("Authentication failed. Please log in again.");
    }

    // Handle 400 errors specifically
    if (response.status === 400) {
      const errorMessage =
        errorData.error || errorData.message || "Bad request";
      throw new Error(`Request failed: ${errorMessage}`);
    }

    throw new Error(
      errorData.message ||
        errorData.error ||
        `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

export const api = {
  // Session APIs
  getSessions: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found. Please log in.");
    }

    const response = await fetch("/api/session/getAllSession", {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createSession: async (name: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No access token found. Please log in.");
    }

    const response = await fetch("/api/session/createSession", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  },

  // Note APIs
  getNotesBySession: async (sessionId: string) => {
    const response = await fetch(
      `/api/notes/getNotesBySession?session_id=${sessionId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  createNote: async (sessionId: string, title: string, content: string) => {
    const response = await fetch("/api/notes/createNote", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ session_id: sessionId, title, content }),
    });
    return handleResponse(response);
  },

  updateNote: async (noteId: string, content: string) => {
    const response = await fetch("/api/notes/updateNote", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: noteId, content }),
    });
    return handleResponse(response);
  },

  // Video APIs
  getVideosByNote: async (noteId: string) => {
    const response = await fetch(
      `/api/videos/getVideosByNote?note_id=${noteId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  createVideo: async (noteId: string, videoUrl: string) => {
    const response = await fetch(
      `/api/videos/createSingleVideo?noteId=${noteId}&videoUrl=${encodeURIComponent(
        videoUrl
      )}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // AI APIs
  getVideoSummary: async (videoId: string) => {
    const response = await fetch("/api/gemini/getVideoSummary", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ videoId: videoId }),
    });
    return handleResponse(response);
  },

  chat: async (message: string, history?: any[], videoContext?: any[]) => {
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        message,
        history: history || [],
        videoContext,
      }),
    });
    return handleResponse(response);
  },
};
