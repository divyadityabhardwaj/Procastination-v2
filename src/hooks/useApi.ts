import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// React Query keys for caching
export const queryKeys = {
  sessions: ["sessions"] as const,
  notes: (sessionId: string) => ["notes", sessionId] as const,
  videos: (noteId: string) => ["videos", noteId] as const,
};

// Session hooks
export const useSessions = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery({
    queryKey: queryKeys.sessions,
    queryFn: () => api.getSessions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token, // Only run if user is authenticated
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => api.createSession(name),
    onSuccess: () => {
      // Invalidate and refetch sessions
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
    },
  });
};

// Note hooks
export const useNotes = (sessionId: string) => {
  return useQuery({
    queryKey: queryKeys.notes(sessionId),
    queryFn: () => api.getNotesBySession(sessionId),
    enabled: !!sessionId,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      title,
      content,
    }: {
      sessionId: string;
      title: string;
      content: string;
    }) => api.createNote(sessionId, title, content),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notes(sessionId) });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, content }: { noteId: string; content: string }) => {
      console.log("useUpdateNote called with:", { noteId, content });
      return api.updateNote(noteId, content);
    },
    onSuccess: () => {
      // Invalidate all notes queries (could be more specific)
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

// Video hooks
export const useVideos = (noteId: string) => {
  return useQuery({
    queryKey: queryKeys.videos(noteId),
    queryFn: () => api.getVideosByNote(noteId),
    enabled: !!noteId,
  });
};

export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, videoUrl }: { noteId: string; videoUrl: string }) =>
      api.createVideo(noteId, videoUrl),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos(noteId) });
    },
  });
};

// AI hooks
export const useVideoSummary = () => {
  return useMutation({
    mutationFn: (videoId: string) => api.getVideoSummary(videoId),
  });
};

export const useChat = () => {
  return useMutation({
    mutationFn: ({
      message,
      history,
      videoContext,
    }: {
      message: string;
      history?: any[];
      videoContext?: any[];
    }) => api.chat(message, history, videoContext),
  });
};
