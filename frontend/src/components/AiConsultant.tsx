import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, RefreshCw, HelpCircle } from 'lucide-react';
import { ChatMessage, SkinScan } from '../types';
import { useAuth } from '../hooks/useAuth';

interface AiConsultantProps {
  latestReport: SkinScan | null;
  chatMessages: ChatMessage[];
  onChatMessagesChanged: (messages: ChatMessage[]) => void;
}

export default function AiConsultant({ latestReport, chatMessages, onChatMessagesChanged }: AiConsultantProps) {
  const { idToken } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested prompt quickcards
  const promptSuggestions = [
    { title: "Layering Rules", prompt: "Can I combine Niacinamide and Salicylic Acid together?" },
    { title: "Pregnancy Safety", prompt: "Which active ingredients must be strictly avoided during pregnancy?" },
    { title: "Barrier Healing", prompt: "What are the telltale signs of a damaged skin barrier and how do I heal it?" },
    { title: "Cheek Redness", prompt: "My cheeks feel hot and show localized redness. Which soothing botanicals will diffuse this?" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, userMessage];
    onChatMessagesChanged(updatedMessages);
    setInputText('');
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 30 seconds client-side timeout

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: updatedMessages,
          currentReport: latestReport
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('API server returned an error.');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: data.text || "I apologize, I wasn't able to compile a detailed skin response. Let me try again.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      onChatMessagesChanged([...updatedMessages, assistantMessage]);
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error(error);
      const isTimeout = error.name === 'AbortError';
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        text: isTimeout 
          ? "I apologize, but the skin science server took longer than 30 seconds to respond. Please try your message again."
          : "I apologize, but I had trouble establishing a secure connection with our skin science server. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      onChatMessagesChanged([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const clearChat = () => {
    onChatMessagesChanged([
      {
        id: 'initial',
        role: 'model',
        text: "Hello! I am SkinGPT, your private AI Skincare Coach and Cosmetic Chemist. If you have completed a facial analysis scan, I am already updated on your primary skin type, scores, and active concerns. Ask me any question about ingredient pairings, formulation pH ranges, or how to lay out your custom morning and evening routine!",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8" id="ai-skincare-coach-chat">
      
      {/* Left panel: Context summaries (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 sticky top-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-500 dark:text-indigo-400 animate-pulse-subtle" />
              SkinGPT Consult Context
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">SkinGPT synchronizes with your profile automatically.</p>
          </div>

          {/* Active Context Card */}
          {latestReport && latestReport.isValid ? (
            <div className="p-4 bg-brand-50/20 dark:bg-indigo-950/15 border border-brand-200/60 dark:border-indigo-900/30 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-brand-100/50 dark:border-slate-800">
                <span className="font-semibold text-gray-500 dark:text-gray-400">USER PROFILE</span>
                <span className="px-2 py-0.5 bg-brand-500 dark:bg-indigo-600 text-white rounded font-bold text-[9px] uppercase tracking-wider">SYNCED</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-500">Primary Skin Type:</span>
                  <span className="font-bold text-brand-900 dark:text-brand-300">{latestReport.skinType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 dark:text-gray-500">Skin Wellness Score:</span>
                  <span className="font-bold text-brand-900 dark:text-brand-300 font-mono">{latestReport.score.overall}/100</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-400 dark:text-gray-500 block mb-1">Monitored Concerns:</span>
                  <div className="flex flex-wrap gap-1">
                    {latestReport.concerns?.map((con, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 border border-brand-200/50 dark:border-slate-700 text-gray-800 dark:text-gray-300 text-[10px] rounded">
                        {con}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-amber-50/5 dark:bg-amber-950/5 rounded-2xl border border-dashed border-amber-200/60 dark:border-amber-900/40 text-xs text-center space-y-3">
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                You have not run a facial scan yet. Run a deep AI Skin Scan to synchronize diagnostics with SkinGPT for hyper-personalized consulting.
              </p>
            </div>
          )}

          {/* Advice Disclaimer */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-xl text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
            <p>
              SkinGPT's feedback represents cosmetic, routine, and ingredient optimizations for general educational skin health and is strictly NOT medical advice or dermatological diagnoses.
            </p>
          </div>

          {chatMessages.length > 1 && (
            <button
              onClick={clearChat}
              className="w-full py-2.5 text-xs border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-gray-600 dark:text-gray-300 cursor-pointer"
            >
              Clear Consult Session
            </button>
          )}
        </div>
      </div>

      {/* Right panel: Chat Window (8 cols) */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-brand-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px] rounded-3xl">
        {/* Chat header */}
        <div className="p-5 border-b border-brand-100 dark:border-slate-800 flex justify-between items-center bg-brand-50/5 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-500 dark:bg-indigo-600 rounded-full flex items-center justify-center text-white relative">
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full"></span>
              <Sparkles className="h-5 w-5 text-brand-100 animate-pulse-subtle" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">Coach SkinGPT</h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Cosmetic Chemist • Online</p>
            </div>
          </div>
        </div>

        {/* Messages thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin bg-white dark:bg-slate-900">
          {chatMessages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs ${
                  isUser ? 'bg-brand-100 dark:bg-indigo-950/80 text-brand-800 dark:text-indigo-300' : 'bg-brand-500 dark:bg-indigo-600 text-white'
                }`}>
                  {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div className={`space-y-1 p-4 rounded-2xl text-xs leading-relaxed ${
                  isUser 
                    ? 'bg-brand-500 dark:bg-indigo-600 text-white rounded-tr-none shadow-sm' 
                    : 'bg-brand-50/10 dark:bg-slate-800/50 border border-brand-100 dark:border-slate-800/80 text-gray-800 dark:text-gray-300 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`block text-[9px] text-right ${isUser ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="h-8 w-8 rounded-full bg-brand-500 dark:bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
              <div className="px-4 py-3 bg-brand-50/10 dark:bg-slate-800/50 border border-brand-100 dark:border-slate-800/85 text-gray-500 dark:text-gray-450 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                SkinGPT is analyzing cosmetic formulations...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion prompt cards at bottom */}
        {chatMessages.length === 1 && (
          <div className="px-6 py-3 bg-brand-50/5 dark:bg-slate-900 border-t border-brand-100 dark:border-slate-800 grid grid-cols-2 gap-2">
            {promptSuggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug.prompt)}
                className="p-2.5 rounded-xl border border-brand-100 dark:border-slate-800 hover:border-brand-300 dark:hover:border-indigo-500 text-left hover:bg-brand-50/10 dark:hover:bg-slate-800/40 transition-colors text-[10px] space-y-1 cursor-pointer"
              >
                <p className="font-bold text-brand-900 dark:text-indigo-300">{sug.title}</p>
                <p className="text-gray-400 dark:text-gray-500 truncate">{sug.prompt}</p>
              </button>
            ))}
          </div>
        )}

        {/* Chat input form */}
        <form onSubmit={handleFormSubmit} className="p-4 border-t border-brand-100 dark:border-slate-800 bg-brand-50/5 dark:bg-slate-850/50 flex gap-2.5">
          <input
            type="text"
            required
            disabled={isLoading}
            placeholder={latestReport ? "Ask SkinGPT about layering, routine schedules, active conflicts..." : "Ask SkinGPT any cosmetic or active ingredient questions..."}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-850 focus:outline-none focus:border-brand-500 dark:focus:border-indigo-500 text-xs text-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-3 bg-brand-500 hover:bg-brand-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-gray-200 text-white rounded-xl transition-all shadow-sm hover:shadow shrink-0 cursor-pointer"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
