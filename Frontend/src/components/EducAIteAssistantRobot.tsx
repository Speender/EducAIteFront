import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, History, Loader2, Maximize2, Minimize2, Plus, Send, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AImpatin from "../assets/robot.svg";
import {
  activateChatbotThread,
  createChatbotThread,
  deleteChatbotThread,
  getChatbotThread,
  getChatbotThreads,
  sendChatbotThreadMessage,
  type ChatbotMessageResponse,
  type ChatbotThreadResponse,
  type ChatbotThreadSummaryResponse,
} from "@/features/chatbot/api/service";
import { parseAssistantMessage } from "@/features/chatbot/lib/format";

interface ChatMessage {
  id: string;
  text: string;
  isAi: boolean;
  isError?: boolean;
  formatted?: ReturnType<typeof parseAssistantMessage>;
}

function mapMessage(message: ChatbotMessageResponse): ChatMessage {
  const isAi = message.role.toLowerCase() === "assistant";
  const content = message.content?.trim() ?? "";
  const formatted = isAi ? parseAssistantMessage(content, message.assistantPayload) : undefined;

  return {
    id: message.messageSqid,
    text: content || formatted?.message || formatted?.fallbackText || "",
    isAi,
    formatted,
  };
}

function mapMessages(thread: ChatbotThreadResponse): ChatMessage[] {
  return thread.messages.map(mapMessage);
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const EducAIteAssistantRobot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [threads, setThreads] = useState<ChatbotThreadSummaryResponse[]>([]);
  const [activeThread, setActiveThread] = useState<ChatbotThreadResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [isSwitchingThread, setIsSwitchingThread] = useState(false);
  const [deletingThreadSqid, setDeletingThreadSqid] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [hasLoadedThread, setHasLoadedThread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isBusy = isSending || isCreatingThread || isSwitchingThread || isLoadingMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    if (!isFullscreen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if ((!isOpen && !isFullscreen) || hasLoadedThread) {
      return;
    }

    let isMounted = true;
    setIsLoadingThreads(true);
    setIsLoadingMessages(true);

    getChatbotThread()
      .then(async (thread) => {
        const summaries = await getChatbotThreads();
        if (!isMounted) {
          return;
        }

        setActiveThread(thread);
        setMessages(mapMessages(thread));
        setThreads(summaries);
        setHasLoadedThread(true);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setMessages([{
          id: "load-error",
          text: "I could not load your study chats yet. Try opening me again in a moment.",
          isAi: true,
          isError: true,
        }]);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingThreads(false);
          setIsLoadingMessages(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hasLoadedThread, isFullscreen, isOpen]);

  const refreshThreads = async () => {
    const summaries = await getChatbotThreads();
    setThreads(summaries);
    return summaries;
  };

  const handleCreateThread = async () => {
    if (isCreatingThread) {
      return;
    }

    setIsCreatingThread(true);
    setLastFailedMessage(null);
    setActiveThread(null);
    setMessages([]);

    try {
      const thread = await createChatbotThread();
      setActiveThread(thread);
      setMessages([]);
      await refreshThreads();
      setHasLoadedThread(true);
      setIsDrawerOpen(false);
    } catch {
      setMessages([{
        id: `create-error-${Date.now()}`,
        text: "I could not start a new chat yet.",
        isAi: true,
        isError: true,
      }]);
    } finally {
      setIsCreatingThread(false);
    }
  };

  const handleSwitchThread = async (threadSqid: string) => {
    if (threadSqid === activeThread?.threadSqid || isSwitchingThread) {
      return;
    }

    setIsSwitchingThread(true);
    setLastFailedMessage(null);

    try {
      const thread = await activateChatbotThread(threadSqid);
      setActiveThread(thread);
      setMessages(mapMessages(thread));
      await refreshThreads();
      setHasLoadedThread(true);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `switch-error-${Date.now()}`,
          text: "I could not open that chat session.",
          isAi: true,
          isError: true,
        },
      ]);
    } finally {
      setIsSwitchingThread(false);
    }
  };

  const handleDeleteThread = async (threadSqid: string) => {
    if (deletingThreadSqid) {
      return;
    }

    const wasActive = threadSqid === activeThread?.threadSqid;
    setDeletingThreadSqid(threadSqid);
    if (wasActive) {
      setIsSwitchingThread(true);
    }

    try {
      await deleteChatbotThread(threadSqid);
      const summaries = await refreshThreads();

      if (wasActive) {
        const nextActive = summaries.find((thread) => thread.isActive) ?? summaries[0];
        if (nextActive) {
          const thread = await getChatbotThread();
          setActiveThread(thread);
          setMessages(mapMessages(thread));
        } else {
          const thread = await createChatbotThread();
          setActiveThread(thread);
          setMessages([]);
          await refreshThreads();
        }
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `delete-error-${Date.now()}`,
          text: "I could not delete that chat session.",
          isAi: true,
          isError: true,
        },
      ]);
    } finally {
      setDeletingThreadSqid(null);
      setIsSwitchingThread(false);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const messageText = (overrideText ?? inputText).trim();
    if (!messageText || isSending || isCreatingThread) {
      return;
    }

    setLastFailedMessage(null);
    setInputText("");
    setIsSending(true);

    const optimisticMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      text: messageText,
      isAi: false,
    };

    setMessages((current) => [...current.filter((message) => !message.isError), optimisticMessage]);

    try {
      const thread = activeThread
        ? await sendChatbotThreadMessage(activeThread.threadSqid, messageText)
        : await createChatbotThread().then((createdThread) =>
            sendChatbotThreadMessage(createdThread.threadSqid, messageText));

      setActiveThread(thread);
      setMessages(mapMessages(thread));
      await refreshThreads();
      setHasLoadedThread(true);
    } catch {
      setLastFailedMessage(messageText);
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          text: "I could not generate a study reply right now.",
          isAi: true,
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const renderAssistantContent = (message: ChatMessage) => {
    const hasActions = (payload: NonNullable<ChatMessage["formatted"]>) =>
      Boolean(payload.primaryAction || payload.actions.length > 0);

    const getFallbackReply = (payload: NonNullable<ChatMessage["formatted"]>) => {
      const fallback = payload.message || payload.fallbackText || message.text.trim();

      if (fallback) {
        return fallback;
      }

      return hasActions(payload)
        ? "I found a study action for you."
        : "I could not generate a study reply yet. Try asking again in a moment.";
    };

    const openAction = (href: string) => {
      if (/^https?:\/\//.test(href)) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }

      navigate(href);
    };

    const renderTextWithLinks = (value: string) => {
      const parts = value.split(/(https?:\/\/[^\s)]+|\/(?:notes|documents|courses|flashcards|quizzes)\/[A-Za-z0-9_?=&/-]+)/g);
      return (
        <>
          {parts.map((part, index) => {
            if (/^https?:\/\//.test(part) || /^\/(?:notes|documents|courses|flashcards|quizzes)\//.test(part)) {
              return (
                <a
                  key={`${message.id}-link-${index}`}
                  href={part}
                  className="underline decoration-black/40 underline-offset-2 transition hover:decoration-black"
                >
                  {part}
                </a>
              );
            }

            return <React.Fragment key={`${message.id}-text-${index}`}>{part}</React.Fragment>;
          })}
        </>
      );
    };

    if (message.isError || !message.formatted) {
      return <>{renderTextWithLinks(message.text)}</>;
    }

    const payload = message.formatted;
    const fallbackReply = getFallbackReply(payload);

    return (
      <div className="space-y-3">
        {fallbackReply && <p>{renderTextWithLinks(fallbackReply)}</p>}
        {payload.recommendedTopic && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">Recommended Topic</p>
            <p>{renderTextWithLinks(payload.recommendedTopic)}</p>
          </div>
        )}
        {payload.reason && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">Reason</p>
            <p>{renderTextWithLinks(payload.reason)}</p>
          </div>
        )}
        {payload.studySequence.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">Study Sequence</p>
            <ul className="list-disc space-y-1 pl-5">
              {payload.studySequence.map((item, index) => (
                <li key={`${message.id}-study-${index}`}>{renderTextWithLinks(item)}</li>
              ))}
            </ul>
          </div>
        )}
        {payload.reviewChecklist.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">Review Checklist</p>
            <ul className="list-disc space-y-1 pl-5">
              {payload.reviewChecklist.map((item, index) => (
                <li key={`${message.id}-check-${index}`}>{renderTextWithLinks(item)}</li>
              ))}
            </ul>
          </div>
        )}
        {payload.practiceTask && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/60">Practice Task</p>
            <p>{renderTextWithLinks(payload.practiceTask)}</p>
          </div>
        )}
        {(payload.primaryAction || payload.actions.length > 0) && (
          <div className="flex min-h-8 flex-wrap gap-2 pt-1">
            {[payload.primaryAction, ...payload.actions]
              .filter((action, index, array): action is NonNullable<typeof payload.primaryAction> =>
                Boolean(action) && array.findIndex((candidate) => candidate?.href === action?.href) === index)
              .map((action) => (
                <button
                  key={`${message.id}-${action.href}`}
                  type="button"
                  onClick={() => openAction(action.href)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                    action.href === payload.primaryAction?.href
                      ? "bg-black text-white"
                      : "border border-black/15 bg-white/40 text-black hover:bg-white/70"
                  }`}
                >
                  {action.label}
                </button>
              ))}
          </div>
        )}
      </div>
    );
  };

  const renderMessageSkeletons = () => (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex max-w-[84%] items-end gap-2.5 self-start">
        <div className="h-8 w-8 shrink-0 rounded-full bg-white/10" />
        <div className="h-20 flex-1 rounded-t-2xl rounded-br-2xl rounded-bl-sm bg-white/15" />
      </div>
      <div className="h-12 w-[62%] self-end rounded-t-2xl rounded-bl-2xl rounded-br-sm bg-[#00CEC8]/15" />
      <div className="flex max-w-[78%] items-end gap-2.5 self-start">
        <div className="h-8 w-8 shrink-0 rounded-full bg-white/10" />
        <div className="h-16 flex-1 rounded-t-2xl rounded-br-2xl rounded-bl-sm bg-white/15" />
      </div>
    </div>
  );

  const renderThreadSkeletons = () => (
    <div className="space-y-2">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="h-3 w-2/3 rounded-full bg-white/15" />
          <div className="mt-2 h-3 w-full rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );

  const renderThreadRows = (closeDrawerOnSelect: boolean) => {
    if (isLoadingThreads) {
      return renderThreadSkeletons();
    }

    if (threads.length === 0) {
      return (
        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/35">
          No saved chats yet.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {threads.map((thread) => {
          const isActive = thread.threadSqid === activeThread?.threadSqid || thread.isActive;
          const isDeleting = deletingThreadSqid === thread.threadSqid;

          return (
            <div
              key={thread.threadSqid}
              className={`group flex min-h-[72px] items-center gap-2 rounded-xl border p-3 transition ${
                isActive
                  ? "border-[#00CEC8]/40 bg-[#00CEC8]/10"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
              } ${isDeleting ? "opacity-50" : ""}`}
            >
              <button
                type="button"
                onClick={() => {
                  handleSwitchThread(thread.threadSqid);
                  if (closeDrawerOnSelect) {
                    setIsDrawerOpen(false);
                  }
                }}
                disabled={isDeleting || isSwitchingThread}
                className="min-w-0 flex-1 text-left disabled:cursor-not-allowed"
              >
                <p className="truncate text-sm font-semibold text-white">{thread.title || "New chat"}</p>
                <p className="mt-1 truncate text-xs text-white/45">
                  {thread.lastMessagePreview || "Empty session"}
                </p>
                <p className="mt-1 text-[11px] text-white/30">
                  {thread.messageCount} messages {formatUpdatedAt(thread.updatedAt)}
                </p>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteThread(thread.threadSqid)}
                disabled={Boolean(deletingThreadSqid)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 opacity-100 transition hover:bg-rose-500/10 hover:text-rose-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Delete ${thread.title || "chat session"}`}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex w-[340px] origin-bottom-right animate-in flex-col overflow-hidden rounded-2xl border border-white/20 bg-black shadow-[0_10px_50px_rgba(0,0,0,0.8)] fade-in slide-in-from-bottom-5 duration-300 md:w-[400px]">
          <div className="z-10 flex h-[76px] items-center gap-3 border-b border-white/20 bg-black p-4 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black">
              <img src={AImpatin} alt="educAIte Assistant" className="h-8 w-8 object-contain" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="truncate text-lg font-bold leading-tight tracking-wide text-white">
                educ<span className="text-[#00CEC8]">AI</span>te
              </h3>
              <p className="truncate text-xs font-medium text-white/60">AImpatin Study Buddy</p>
            </div>
            <button
              type="button"
              onClick={handleCreateThread}
              disabled={isCreatingThread || isSending}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/65 transition hover:border-[#00CEC8]/50 hover:text-[#00CEC8] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Start new study chat"
              title="New chat"
            >
              {isCreatingThread ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFullscreen(true);
                setIsOpen(false);
                setIsDrawerOpen(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/65 transition hover:border-[#00CEC8]/50 hover:text-[#00CEC8] active:scale-95"
              aria-label="Open fullscreen chat"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsDrawerOpen((current) => !current)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/65 transition hover:border-[#00CEC8]/50 hover:text-[#00CEC8] active:scale-95"
              aria-label="Open chat history"
              title="Chat history"
            >
              <History className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex h-[350px] max-h-[350px] overflow-hidden bg-black">
            <aside
              className={`absolute inset-y-0 left-0 z-30 flex w-[270px] flex-col border-r border-white/10 bg-[#070707] shadow-2xl transition-transform duration-200 ease-out ${
                isDrawerOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
                <div>
                  <p className="text-sm font-semibold text-white">Chat sessions</p>
                  <p className="text-xs text-white/45">Switch or delete a chat</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white active:scale-95"
                  aria-label="Close chat history"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {renderThreadRows(true)}
              </div>

              <div className="shrink-0 border-t border-white/10 p-3">
                <button
                  type="button"
                  onClick={handleCreateThread}
                  disabled={isCreatingThread}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-semibold text-white/70 transition hover:border-[#00CEC8]/40 hover:text-[#00CEC8] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreatingThread ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  New chat
                </button>
              </div>
            </aside>

            {isDrawerOpen && (
              <button
                type="button"
                className="absolute inset-0 z-20 bg-black/35 transition-opacity md:hidden"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close chat history overlay"
              />
            )}

            <div className="relative flex min-w-0 flex-1 flex-col">
              <div className="flex h-full flex-col gap-4 overflow-y-auto p-5 transition-opacity duration-200 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {(isLoadingMessages || isCreatingThread) && renderMessageSkeletons()}

                {!isLoadingMessages && !isCreatingThread && messages.length === 0 && (
                  <div className="flex flex-1 items-center justify-center text-center text-sm text-white/35">
                    Ask what to study, review, or focus on next.
                  </div>
                )}

                {!isLoadingMessages && !isCreatingThread && messages.map((message) => (
                  message.isAi ? (
                    <div key={message.id} className="flex max-w-[88%] animate-in flex-row items-end gap-2.5 self-start fade-in slide-in-from-left-2 duration-300">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black">
                        <img src={AImpatin} alt="AI Avatar" className="h-5 w-5 object-contain" />
                      </div>
                      <div className={`w-full whitespace-pre-line rounded-t-2xl rounded-br-2xl rounded-bl-sm p-3.5 text-sm shadow-md ${message.isError ? "border border-rose-500/30 bg-rose-500/10 text-rose-100" : "bg-[#D9D9D9] text-black"}`}>
                        {message.isError && <AlertCircle className="mb-2 h-4 w-4" />}
                        {renderAssistantContent(message)}
                        {message.isError && lastFailedMessage && (
                          <button
                            type="button"
                            onClick={() => handleSend(lastFailedMessage)}
                            disabled={isSending}
                            className="mt-3 block rounded-full border border-rose-300/30 px-3 py-1 text-xs font-semibold text-rose-100 transition hover:bg-rose-300/10 active:scale-95 disabled:opacity-50"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={message.id} className="max-w-[75%] animate-in self-end rounded-t-2xl rounded-bl-2xl rounded-br-sm border border-[#00CEC8]/30 bg-[#00CEC8]/20 p-3.5 text-sm text-white shadow-md fade-in slide-in-from-right-2 duration-300">
                      {message.text}
                    </div>
                  )
                ))}

                {isSending && (
                  <div className="flex max-w-[85%] flex-row items-end gap-2.5 self-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black">
                      <img src={AImpatin} alt="AI Avatar" className="h-5 w-5 object-contain" />
                    </div>
                    <div className="rounded-t-2xl rounded-br-2xl rounded-bl-sm bg-[#D9D9D9] p-3.5 text-sm text-black shadow-md">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {isSwitchingThread && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 backdrop-blur-[1px] transition-opacity">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-sm text-white/75 shadow-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-[#00CEC8]" />
                    Opening chat...
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto flex h-[76px] items-center gap-3 border-t border-white/10 bg-black p-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-white shadow-md" />
            <div className="h-11 flex-1 overflow-hidden rounded-full bg-[#737373] transition-all ring-white/30 focus-within:ring-2">
              <input
                type="text"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Ask what to study next..."
                className="h-full w-full bg-transparent px-5 text-sm font-medium text-white outline-none placeholder:text-white/60"
                disabled={isBusy}
              />
            </div>
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isBusy}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/20 bg-black text-[#00CEC8] shadow-[0_0_10px_rgba(255,255,255,0.05)] transition-all hover:border-[#00CEC8]/50 hover:bg-white/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/20 disabled:hover:bg-black"
              aria-label="Send study question"
            >
              {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}

      {isFullscreen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="AImpatin fullscreen chat"
        >
          <div className="flex h-[calc(100vh-1.5rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B0B0B] shadow-[0_24px_90px_rgba(0,0,0,0.85)] sm:h-[min(860px,calc(100vh-3rem))]">
            <aside className="hidden w-[292px] shrink-0 flex-col border-r border-white/10 bg-[#050505] md:flex">
              <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/10 px-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black">
                  <img src={AImpatin} alt="educAIte Assistant" className="h-7 w-7 object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">AImpatin</p>
                  <p className="truncate text-xs text-white/45">Study sessions</p>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {renderThreadRows(false)}
              </div>

              <div className="shrink-0 border-t border-white/10 p-3">
                <button
                  type="button"
                  onClick={handleCreateThread}
                  disabled={isCreatingThread}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreatingThread ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  New chat
                </button>
              </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col bg-[#0B0B0B]">
              <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-white/10 px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen((current) => !current)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#00CEC8]/40 hover:text-[#00CEC8] active:scale-95 md:hidden"
                  aria-label="Open chat history"
                >
                  <History className="h-4 w-4" />
                </button>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black md:hidden">
                  <img src={AImpatin} alt="AI Avatar" className="h-6 w-6 object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-semibold text-white">AImpatin</h2>
                  <p className="truncate text-xs text-white/45">Ask about studying, notes, flashcards, quizzes, and progress.</p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateThread}
                  disabled={isCreatingThread || isSending}
                  className="hidden h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm font-semibold text-white/70 transition hover:border-[#00CEC8]/40 hover:text-[#00CEC8] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
                >
                  {isCreatingThread ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  New chat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreen(false);
                    setIsOpen(true);
                    setIsDrawerOpen(false);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-[#00CEC8]/40 hover:text-[#00CEC8] active:scale-95"
                  aria-label="Minimize chat"
                  title="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreen(false);
                    setIsDrawerOpen(false);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/30 hover:text-white active:scale-95"
                  aria-label="Close fullscreen chat"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="relative min-h-0 flex-1">
                {isDrawerOpen && (
                  <aside className="absolute inset-y-0 left-0 z-30 flex w-[290px] flex-col border-r border-white/10 bg-[#050505] shadow-2xl transition-transform duration-200 ease-out md:hidden">
                    <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
                      <div>
                        <p className="text-sm font-semibold text-white">Chat sessions</p>
                        <p className="text-xs text-white/45">Switch or delete a chat</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white active:scale-95"
                        aria-label="Close chat history"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto p-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {renderThreadRows(true)}
                    </div>
                    <div className="shrink-0 border-t border-white/10 p-3">
                      <button
                        type="button"
                        onClick={handleCreateThread}
                        disabled={isCreatingThread}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-semibold text-white/70 transition hover:border-[#00CEC8]/40 hover:text-[#00CEC8] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isCreatingThread ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        New chat
                      </button>
                    </div>
                  </aside>
                )}

                {isDrawerOpen && (
                  <button
                    type="button"
                    className="absolute inset-0 z-20 bg-black/35 transition-opacity md:hidden"
                    onClick={() => setIsDrawerOpen(false)}
                    aria-label="Close chat history overlay"
                  />
                )}

                <div className="flex h-full flex-col overflow-y-auto px-4 py-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden">
                  <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4">
                    {(isLoadingMessages || isCreatingThread) && renderMessageSkeletons()}

                    {!isLoadingMessages && !isCreatingThread && messages.length === 0 && (
                      <div className="flex flex-1 items-center justify-center text-center text-sm text-white/35">
                        Ask what to study, review, or focus on next.
                      </div>
                    )}

                    {!isLoadingMessages && !isCreatingThread && messages.map((message) => (
                      message.isAi ? (
                        <div key={message.id} className="flex max-w-[88%] animate-in flex-row items-end gap-2.5 self-start fade-in slide-in-from-bottom-2 duration-300">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black">
                            <img src={AImpatin} alt="AI Avatar" className="h-5 w-5 object-contain" />
                          </div>
                          <div className={`w-full whitespace-pre-line rounded-2xl p-4 text-sm shadow-md ${message.isError ? "border border-rose-500/30 bg-rose-500/10 text-rose-100" : "bg-[#D9D9D9] text-black"}`}>
                            {message.isError && <AlertCircle className="mb-2 h-4 w-4" />}
                            {renderAssistantContent(message)}
                            {message.isError && lastFailedMessage && (
                              <button
                                type="button"
                                onClick={() => handleSend(lastFailedMessage)}
                                disabled={isSending}
                                className="mt-3 block rounded-full border border-rose-300/30 px-3 py-1 text-xs font-semibold text-rose-100 transition hover:bg-rose-300/10 active:scale-95 disabled:opacity-50"
                              >
                                Retry
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div key={message.id} className="max-w-[76%] animate-in self-end rounded-2xl border border-[#00CEC8]/30 bg-[#00CEC8]/20 p-4 text-sm text-white shadow-md fade-in slide-in-from-bottom-2 duration-300">
                          {message.text}
                        </div>
                      )
                    ))}

                    {isSending && (
                      <div className="flex max-w-[85%] flex-row items-end gap-2.5 self-start">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black">
                          <img src={AImpatin} alt="AI Avatar" className="h-5 w-5 object-contain" />
                        </div>
                        <div className="rounded-2xl bg-[#D9D9D9] p-4 text-sm text-black shadow-md">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {isSwitchingThread && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 backdrop-blur-[1px] transition-opacity">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-sm text-white/75 shadow-lg">
                      <Loader2 className="h-4 w-4 animate-spin text-[#00CEC8]" />
                      Opening chat...
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-white/10 bg-[#0B0B0B] px-4 py-4 sm:px-8">
                <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-[#151515] px-4 shadow-lg transition focus-within:border-[#00CEC8]/45">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(event) => setInputText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSend();
                      }
                    }}
                    placeholder="Message AImpatin..."
                    className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/45"
                    disabled={isBusy}
                  />
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputText.trim() || isBusy}
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#00CEC8] text-black transition hover:bg-[#16E2DC] active:scale-95 disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/30"
                    aria-label="Send study question"
                  >
                    {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/20 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95 ${
          isOpen ? "scale-105 border-[#00CEC8]/50 bg-white/10 shadow-[0_0_20px_rgba(0,206,200,0.2)]" : "bg-black hover:scale-110 hover:bg-white/5"
        }`}
        aria-label="Toggle educAIte study buddy"
      >
        <img src={AImpatin} alt="educAIte Assistant" className="h-10 w-10 object-contain" />
      </button>
    </div>
  );
};

export default EducAIteAssistantRobot;
