import { apiClient } from "@/lib/api/client";

export type ChatbotMessageResponse = {
  messageSqid: string;
  role: "User" | "Assistant" | string;
  content?: string | null;
  createdAt: string;
  assistantPayload?: StudyFocusChatAiResponse | null;
};

export type ChatbotActionResponse = {
  label?: string | null;
  type?: string | null;
  href?: string | null;
  isPrimary?: boolean | null;
};

export type ChatbotContextResponse = {
  courseSqid?: string | null;
  topic?: string | null;
  noteSqid?: string | null;
  documentSqid?: string | null;
  deckSqid?: string | null;
  flashcardSqid?: string | null;
};

export type StudyFocusChatAiResponse = {
  message?: string | null;
  recommendedTopic?: string | null;
  reason?: string | null;
  studySequence?: string[] | null;
  reviewChecklist?: string[] | null;
  practiceTask?: string | null;
  fallbackText?: string | null;
  primaryAction?: ChatbotActionResponse | null;
  actions?: ChatbotActionResponse[] | null;
  actionLinks?: ChatbotActionResponse[] | null;
  context?: ChatbotContextResponse | null;
};

export type ChatbotThreadResponse = {
  threadSqid: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  messages: ChatbotMessageResponse[];
};

export type ChatbotThreadSummaryResponse = {
  threadSqid: string;
  title: string;
  lastMessagePreview: string;
  messageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getChatbotThread() {
  const { data } = await apiClient.get<ChatbotThreadResponse>("/chatbot/thread");
  return data;
}

export async function getChatbotThreads() {
  const { data } = await apiClient.get<ChatbotThreadSummaryResponse[]>("/chatbot/threads");
  return data;
}

export async function createChatbotThread() {
  const { data } = await apiClient.post<ChatbotThreadResponse>("/chatbot/threads");
  return data;
}

export async function getChatbotThreadById(threadSqid: string) {
  const { data } = await apiClient.get<ChatbotThreadResponse>(`/chatbot/threads/${threadSqid}`);
  return data;
}

export async function activateChatbotThread(threadSqid: string) {
  const { data } = await apiClient.patch<ChatbotThreadResponse>(`/chatbot/threads/${threadSqid}/activate`);
  return data;
}

export async function sendChatbotMessage(message: string) {
  const { data } = await apiClient.post<ChatbotThreadResponse>("/chatbot/messages", { message });
  return data;
}

export async function sendChatbotThreadMessage(threadSqid: string, message: string) {
  const { data } = await apiClient.post<ChatbotThreadResponse>(`/chatbot/threads/${threadSqid}/messages`, { message });
  return data;
}

export async function resetChatbotThread() {
  await apiClient.delete("/chatbot/thread");
}

export async function deleteChatbotThread(threadSqid: string) {
  await apiClient.delete(`/chatbot/threads/${threadSqid}`);
}
