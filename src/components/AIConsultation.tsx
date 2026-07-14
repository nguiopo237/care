/// <reference types="vite/client" />

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  HelpCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { createParser } from "eventsource-parser";
import { ChatMessage, UserProfile } from "../types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const LOCAL_STORAGE_KEY = "ceans_chat_messages";

interface AIConsultationProps {
  profile: UserProfile;
}

export default function AIConsultation({ 
  profile,
}: AIConsultationProps) {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch {
      // Ignore parse errors
    }
    return [
      {
        id: "1",
        sender: "ai",
        text: "Bonjour Camille ! Je suis l'assistant médical intelligent de CEan'sCare.\n\nJe suis programmé pour analyser vos paramètres physiologiques, suggérer des plans nutritionnels sur mesure et formuler des pistes de traitements naturels (phytothérapie, nutrition, hygiène de vie) pour optimiser votre forme physique générale.\n\nQuelle est votre préoccupation santé ou votre objectif aujourd'hui ? Je suis là pour vous écouter et vous conseiller.",
        timestamp: new Date(),
      },
    ];
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isStreamingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeBlock(code);
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = setTimeout(() => setCopiedCodeBlock(null), 2000);
    } catch {
      // Clipboard API may fail in non-secure contexts
    }
  }, []);

  // Persist messages to localStorage (skip while streaming to avoid partial saves)
  useEffect(() => {
    if (!isStreamingRef.current) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMessages));
    }
  }, [localMessages]);

  // Cleanup AbortController on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  // Suggestions for user
  const suggestions = [
    t("consultation.suggestion1"),
    t("consultation.suggestion2"),
    t("consultation.suggestion3"),
    t("consultation.suggestion4"),
  ];

  // Build system prompt from user profile
  const buildSystemPrompt = useCallback(() => {
    return `Tu es l'assistant de santé IA expert de CEan'sCare. Tu réponds aux préoccupations des utilisateurs avec beaucoup d'empathie, de rigueur scientifique et d'expertise pratique.
Tu donnes des conseils précieux sur le bien-être, l'alimentation, l'importance des plantes médicinales (phytothérapie) et l'hygiène de vie, ainsi que des pistes thérapeutiques claires pour les symptômes décrits, tout en insistant gentiment sur le suivi médical classique pour la sécurité de l'utilisateur.
Sois direct, chaleureux, utilise le français, structure tes réponses avec des puces élégantes, du gras pour la lisibilité et un style haut de gamme.

PROFIL DE L'UTILISATEUR:
- Âge : ${profile.age} ans
- Genre : ${profile.gender}
- Taille : ${profile.height} cm
- Poids : ${profile.weight} kg
- Tension artérielle : ${profile.systolic}/${profile.diastolic} mmHg
- Rythme cardiaque : ${profile.heartRate} bpm
- Maladies chroniques / antécédents : ${profile.chronicConditions || "Aucune déclarée"}
- Symptômes actuels : ${profile.symptoms || "Aucun déclaré"}
- Niveau d'activité : ${profile.activeLevel}
- Préférence alimentaire : ${profile.dietPreference}`;
  }, [profile]);

  // Stream response from OpenRouter using SSE
  const streamFromOpenRouter = useCallback(async (
    messagesToSend: ChatMessage[],
    onChunk: (text: string) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    const apiKey = "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";

    if (!apiKey) {
      throw new Error("Clé API OpenRouter manquante.");
    }

    const body = JSON.stringify({
      model: "openai/gpt-5.4-mini",
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...messagesToSend
          .filter(m => m.text && m.text.trim().length > 0)
          .map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true,
    });

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ceanscare.app",
        "X-Title": "CEan'sCare",
      },
      body,
      signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Erreur API OpenRouter (${response.status}) : ${errorBody || response.statusText}`);
    }

    if (!response.body) {
      throw new Error("Le corps de la réponse est vide.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const parser = createParser({
      onEvent(event) {
        if (event.data === "[DONE]") return;
        try {
          const parsed = JSON.parse(event.data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch {
          // Ignorer les erreurs de parsing sur des événements mal formés
        }
      },
    });

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        parser.feed(chunk);
      }
    } finally {
      reader.releaseLock();
    }
  }, [buildSystemPrompt]);

  // Core send function with streaming
  const sendUserMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsStreaming(true);
    isStreamingRef.current = true;

    // Create and add user message
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setLocalMessages((prev) => [...prev, userMsg]);

    // Create empty AI message that will be filled by the stream
    const aiMsgId = Math.random().toString(36).substring(7);
    setStreamingMsgId(aiMsgId);
    setLocalMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        sender: "ai",
        text: "",
        timestamp: new Date(),
      },
    ]);

    try {
      let accumulated = "";

      await streamFromOpenRouter(
        [...localMessages, userMsg],
        (chunk) => {
          accumulated += chunk;
          // Update the AI message in place with accumulated text
          setLocalMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId ? { ...m, text: accumulated } : m
            )
          );
        },
        abortController.signal
      );

      // Finalize: ensure the last accumulated text is set
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId ? { ...m, text: accumulated, timestamp: new Date() } : m
        )
      );
    } catch (error: any) {
      if (error.name === "AbortError") return;

      console.error("Erreur lors du streaming OpenRouter:", error);

      // Replace empty AI message with error message
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? {
                ...m,
                text: `⚠️ **Erreur de connexion :** ${error instanceof Error ? error.message : "Impossible de contacter l'assistant IA. Veuillez réessayer plus tard."}`,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      isStreamingRef.current = false;
      setStreamingMsgId(null);
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [isStreaming, localMessages, streamFromOpenRouter]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isStreaming) return;
    const text = inputText;
    setInputText("");
    await sendUserMessage(text);
  };

  const handleSuggestionClick = async (text: string) => {
    if (isStreaming) return;
    await sendUserMessage(text);
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, isStreaming]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col justify-between animate-fade-in">
      
      {/* Consultation Header */}
      <div className="bg-[#064E3B] p-5 text-white flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm sm:text-base">{t("consultation.title")}</h3>
            <span className="text-[10px] text-emerald-300 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block mr-1"></span>
              <span>{t("consultation.subtitle")}</span>
            </span>
          </div>
        </div>
        <div className="text-right text-[10px] text-emerald-100 font-mono hidden sm:block">
          <span>{t("consultation.responseTime")}</span>
        </div>
      </div>

      {/* Message History Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        
        {/* Welcome notice */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 max-w-2xl mx-auto flex items-start space-x-3 text-slate-500 text-xs shadow-sm">
          <HelpCircle className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 font-bold block mb-1">{t("consultation.helpTitle")}</strong>
            {t("consultation.helpDesc")}
          </div>
        </div>

        {/* Message Loop */}
        {localMessages.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={msg.id}
              className={`flex items-end space-x-2 ${isAI ? "justify-start" : "justify-end"}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div
                className={`max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm shadow-sm ${
                  isAI
                    ? "bg-white text-slate-800 border border-slate-100 rounded-bl-none leading-relaxed"
                    : "bg-[#064E3B] text-white rounded-br-none"
                }`}
              >
                {isAI ? (
                  <div className="prose prose-sm prose-emerald max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        strong: ({ children }) => <strong className="font-bold text-[#064E3B]">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-1">{children}</ol>,
                        li: ({ children }) => <li className="text-slate-700">{children}</li>,
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        h1: ({ children }) => <h1 className="text-base font-bold text-[#064E3B] mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-sm font-bold text-[#064E3B] mb-1.5">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xs font-bold text-[#064E3B] mb-1">{children}</h3>,
                        code({ className, children, inline }: any) {
                          if (inline) {
                            return (
                              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#064E3B] text-[10px]">
                                {children}
                              </code>
                            );
                          }
                          const match = /language-(\w+)/.exec(className || "");
                          const codeString = String(children).replace(/\n$/, "");
                          const lang = match ? match[1] : "code";
                          return (
                            <div className="-mx-4 sm:-mx-0 my-3 rounded-xl overflow-hidden border border-slate-200">
                              <div className="flex items-center justify-between px-4 py-1.5 bg-[#282c34] text-[#abb2bf] text-[10px] font-mono border-b border-white/5">
                                <span>{lang}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(codeString)}
                                  className={`hover:text-white transition-colors cursor-pointer text-[10px] ${copiedCodeBlock === codeString ? "text-emerald-400" : ""}`}
                                >
                                  {copiedCodeBlock === codeString ? t("common.copied") : t("common.copy")}
                                </button>
                              </div>
                              {match ? (
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.75rem", lineHeight: "1.4" }}
                                >
                                  {codeString}
                                </SyntaxHighlighter>
                              ) : (
                                <div className="bg-[#282c34] p-4 overflow-x-auto">
                                  <pre className="text-[0.75rem] leading-[1.4] text-[#abb2bf] font-mono whitespace-pre-wrap m-0">
                                    {codeString}
                                  </pre>
                                </div>
                              )}
                            </div>
                          );
                        },
                        pre: ({ children }) => <>{children}</>,
                        blockquote: ({ children }) => <blockquote className="border-l-2 border-emerald-400 pl-3 italic text-slate-600 my-2">{children}</blockquote>,
                        hr: () => <hr className="my-3 border-slate-200" />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {msg.text}
                  </div>
                )}
                
                <span className={`block text-[8px] mt-1.5 font-mono ${isAI ? "text-slate-400" : "text-white/60"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-lg bg-[#064E3B] text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Waiting indicator (only while waiting for the first chunk) */}
        {isStreaming && streamingMsgId && localMessages.find(m => m.id === streamingMsgId)?.text === "" && (
          <div className="flex items-end space-x-2 justify-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white text-slate-500 border border-slate-100 p-4 rounded-2xl rounded-bl-none text-xs flex items-center space-x-2 shadow-sm">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#064E3B]" />
              <span>{t("consultation.waitingMessage")}</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested prompts section */}
      {localMessages.length === 1 && !isStreaming && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{t("consultation.suggestionsTitle")}</span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                id={`btn-sug-${i}`}
                onClick={() => handleSuggestionClick(sug)}
                className="text-left bg-white hover:bg-emerald-50 text-slate-600 hover:text-[#064E3B] text-xs px-3 py-2 rounded-xl border border-slate-200 shadow-sm transition-all text-ellipsis overflow-hidden cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message input field */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          required
          disabled={isStreaming}
          placeholder={t("consultation.placeholder")}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
        />
        <button
          type="submit"
          id="btn-send-message"
          disabled={isStreaming}
          className="bg-[#064E3B] hover:bg-[#043427] text-white p-3 rounded-xl shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
