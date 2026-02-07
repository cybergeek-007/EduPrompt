// src/api/api.ts

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

/* ---------------- AUTH ---------------- */

export async function signupApi(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Signup failed");
  return json;
}

export async function loginApi(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Login failed");
  return json;
}

export async function logoutApi() {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return safeJson(res);
}

export async function meApi() {
  const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Session invalid");
  return json;
}

/* ---------------- CONTENT ---------------- */

export async function fetchTopicsApi() {
  const res = await fetch(`${API_URL}/api/content/topics`, {
    credentials: "include",
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to fetch topics");
  return json;
}

export async function fetchSubtopicsApi(topicId: string) {
  if (!topicId) throw new Error("Topic ID is required");

  const res = await fetch(`${API_URL}/api/content/topics/${topicId}/subtopics`, {
    credentials: "include",
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to fetch subtopics");
  return json.subtopics || json;
}

export async function fetchSubtopicContentApi(subtopicId: string) {
  const res = await fetch(`${API_URL}/api/content/subtopics/${subtopicId}`, {
    credentials: "include",
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to fetch subtopic content");
  return json;
}

export async function toggleSubtopicCompleteApi(subtopicId: string, completed: boolean) {
  const res = await fetch(`${API_URL}/api/content/subtopics/${subtopicId}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ completed }),
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to toggle");
  return json;
}

/* ---------------- QUIZ (UPDATED) ---------------- */

/**
 * GET topic-level quiz
 * GET /api/quiz/topic/:topicId
 */
export async function fetchTopicQuizApi(topicId: string) {
  const res = await fetch(`${API_URL}/api/quiz/topic/${topicId}`, {
    credentials: "include",
  });

  const json = await safeJson(res);

  if (!res.ok) throw new Error(json.error || "Failed to fetch quiz");

  // Always return stable structure
  return {
    quiz: json.quiz || [],
    topicName: json.topicName || "Quiz",
  };
}

/* ---------------- PROGRESS CHECK (NEW) ---------------- */
/**
 * Used to block quiz route if progress < 100%
 * GET /api/content/topics/:id/subtopics
 */
export async function fetchTopicProgressApi(topicId: string) {
  const res = await fetch(`${API_URL}/api/content/topics/${topicId}/subtopics`, {
    credentials: "include",
  });

  const json = await safeJson(res);

  if (!res.ok) throw new Error(json.error || "Failed to fetch progress");

  const subs = json.subtopics || [];

  const total = subs.length;
  const completed = subs.filter((s: any) => s.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, progress };
}

/* ---------------- HELPERS ---------------- */

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return { error: "Invalid JSON received from server." };
  }
}
