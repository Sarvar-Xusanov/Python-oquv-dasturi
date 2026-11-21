import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Plus,
  RefreshCw,
  Send,
  Square,
  Trash2,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { t } from '../../data/localization';
import { MarkdownRenderer } from '../MarkdownRenderer';
import type { Language, UserSummary } from '../../types/domain';

interface Conversation {
  id: number;
  title: string;
  mode: string;
  model: string;
  created_at: string;
  messages: Array<{ id?: number; role: 'user' | 'model'; content: string }>;
}

const MENTOR_MODES = [
  { id: 'teacher', uz: 'O‘qituvchi (Teacher)', en: 'Teacher' },
  { id: 'debugger', uz: 'Xato topuvchi (Debugger)', en: 'Debugger' },
  { id: 'reviewer', uz: 'Kod tekshiruvchi (Reviewer)', en: 'Code Reviewer' },
  { id: 'practice_coach', uz: 'Amaliyot murabbiyi', en: 'Practice Coach' },
  { id: 'socratic', uz: 'Sokratik ustoz', en: 'Socratic Tutor' },
  { id: 'project_mentor', uz: 'Loyiha ustozi', en: 'Project Mentor' },
  { id: 'exam_evaluator', uz: 'Imtihon baholovchi', en: 'Exam Evaluator' },
] as const;

interface AiMentorProps {
  token: string;
  user: UserSummary;
  language: Language;
  prefillPrompt?: { message: string; code?: string; lessonId?: string } | null;
  onConsumePrefill: () => void;
  onOpenInCodeLab: (code: string) => void;
}

export function AiMentorScreen({
  token,
  user,
  language,
  prefillPrompt,
  onConsumePrefill,
  onOpenInCodeLab,
}: AiMentorProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [mode, setMode] = useState<string>('teacher');
  const [input, setInput] = useState('');
  const [attachedCode, setAttachedCode] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadConversations = async () => {
    const res = await apiRequest<{ conversations: Conversation[] }>('/api/ai/conversations', { token });
    setConversations(res.conversations);
    if (!activeConvId && res.conversations.length > 0) {
      setActiveConvId(res.conversations[0].id);
      setMode(res.conversations[0].mode || 'teacher');
    }
  };

  useEffect(() => {
    loadConversations();
  }, [token]);

  useEffect(() => {
    if (prefillPrompt) {
      setInput(prefillPrompt.message);
      if (prefillPrompt.code) setAttachedCode(prefillPrompt.code);
      onConsumePrefill();
    }
  }, [prefillPrompt]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, streaming]);

  const activeConversation = conversations.find((c) => c.id === activeConvId) ?? null;

  const handleNewConversation = async () => {
    const res = await apiRequest<{ conversation: Conversation }>('/api/ai/conversations', {
      method: 'POST',
      token,
      body: { title: language === 'uz' ? 'Yangi suhbat' : 'New chat', mode },
    });
    setConversations((prev) => [res.conversation, ...prev]);
    setActiveConvId(res.conversation.id);
  };

  const handleDeleteConversation = async (id: number) => {
    await apiRequest(`/api/ai/conversations/${id}`, { method: 'DELETE', token });
    setConfirmDeleteId(null);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
    }
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || streaming) return;
    setErrorMsg(null);
    setStreaming(true);

    const userMsg = textToSend.trim();
    setInput('');

    let targetConvId = activeConvId;
    if (!targetConvId) {
      const created = await apiRequest<{ conversation: Conversation }>('/api/ai/conversations', {
        method: 'POST',
        token,
        body: { title: userMsg.slice(0, 44), mode },
      });
      targetConvId = created.conversation.id;
      setConversations((prev) => [created.conversation, ...prev]);
      setActiveConvId(targetConvId);
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { role: 'user', content: userMsg },
                { role: 'model', content: '' },
              ],
            }
          : c,
      ),
    );

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/ai/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: targetConvId,
          mode,
          message: userMsg,
          activeCode: attachedCode || undefined,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`AI service returned status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          if (!evt.startsWith('data: ')) continue;
          const payload = JSON.parse(evt.slice(6)) as {
            type: string;
            text?: string;
            error?: string;
          };
          if (payload.type === 'chunk' && payload.text) {
            setConversations((prev) =>
              prev.map((c) => {
                if (c.id !== targetConvId) return c;
                const msgs = [...c.messages];
                const last = msgs[msgs.length - 1];
                if (last && last.role === 'model') {
                  msgs[msgs.length - 1] = { ...last, content: last.content + payload.text };
                }
                return { ...c, messages: msgs };
              }),
            );
          } else if (payload.type === 'error') {
            setErrorMsg(payload.error || 'Gemini API error');
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setErrorMsg(err instanceof Error ? err.message : 'Streaming failed');
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleRegenerate = () => {
    if (!activeConversation || streaming) return;
    const lastUser = [...activeConversation.messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      sendMessage(lastUser.content);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-12 h-[calc(100vh-160px)] min-h-[540px]">
      {/* Left: Modes & History */}
      <aside className="flex flex-col rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-3 lg:col-span-3 overflow-hidden">
        <button
          type="button"
          onClick={handleNewConversation}
          className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--pm-primary)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          {t(language, 'mentor.new_chat')}
        </button>

        <div className="mb-3 space-y-1">
          <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--pm-text-muted)]">
            {language === 'uz' ? 'Ustoz rejimi' : 'Mentor Mode'}
          </div>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-2.5 py-2 text-xs font-medium"
          >
            {MENTOR_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m[language]}
              </option>
            ))}
          </select>
        </div>

        <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--pm-text-muted)] mb-1.5">
          {language === 'uz' ? 'Suhbatlar tarixi' : 'Conversations'}
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs ${
                activeConvId === c.id
                  ? 'bg-[var(--pm-primary)]/15 text-[var(--pm-text)] font-medium'
                  : 'text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveConvId(c.id);
                  setMode(c.mode || 'teacher');
                }}
                className="flex-1 truncate text-left"
              >
                {c.title}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(c.id)}
                className="ml-1.5 text-[var(--pm-text-muted)] hover:text-[var(--pm-error)]"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {confirmDeleteId !== null && (
          <div className="mt-2 rounded-lg border border-[var(--pm-error)]/40 bg-[var(--pm-bg)] p-2.5 space-y-2 text-xs">
            <p>{language === 'uz' ? "Suhbat o'chirilsinmi?" : 'Delete this conversation?'}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-2 py-1 text-[var(--pm-text-muted)]"
              >
                {t(language, 'common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConversation(confirmDeleteId)}
                className="rounded bg-[var(--pm-error)] px-2.5 py-1 font-medium text-white"
              >
                {t(language, 'common.delete')}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Center: Streaming Chat */}
      <section className="flex flex-col rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] lg:col-span-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--pm-border)] px-4 py-3 bg-[var(--pm-sidebar)]">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-[var(--pm-secondary)]" />
            <span className="font-display text-sm font-semibold">{t(language, 'mentor.title')}</span>
            <span className="text-xs text-[var(--pm-text-muted)]">· gemini-4-hydrogen</span>
          </div>
          {activeConversation && activeConversation.messages.length > 0 && (
            <button
              type="button"
              disabled={streaming}
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1 text-xs text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] disabled:opacity-40"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {language === 'uz' ? 'Qayta yaratish' : 'Regenerate'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {(!activeConversation || activeConversation.messages.length === 0) && (
            <div className="flex h-full flex-col items-center justify-center text-center space-y-3 px-6">
              <Bot className="h-8 w-8 text-[var(--pm-secondary)]" />
              <h3 className="font-display text-lg font-semibold">
                {language === 'uz' ? 'Salom! Men sizning Python ustozingizman.' : 'Hi! I am your Python Mastery AI Mentor.'}
              </h3>
              <p className="max-w-md text-xs text-[var(--pm-text-secondary)] leading-relaxed">
                {language === 'uz'
                  ? "Savol bering, xato chiqqan kodni yuboring yoki o'zingizga tushunarsiz bo'lgan mavzuni qatorma-qator tahlil qilishni so'rang."
                  : 'Ask any Python question, paste code for debugging or review, or request a Socratic walkthrough.'}
              </p>
            </div>
          )}

          {activeConversation?.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-3.5 ${
                msg.role === 'user'
                  ? 'ml-8 bg-[var(--pm-primary)]/15 border border-[var(--pm-primary)]/30 text-sm text-[var(--pm-text)]'
                  : 'mr-4 bg-[var(--pm-bg)] border border-[var(--pm-border)]'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : msg.content ? (
                <MarkdownRenderer
                  content={msg.content}
                  onLoadCode={onOpenInCodeLab}
                  loadLabel={t(language, 'lesson.open_in_lab')}
                />
              ) : (
                <span className="text-xs text-[var(--pm-text-muted)]">
                  {language === 'uz' ? 'Javob tayyorlanmoqda...' : 'Thinking...'}
                </span>
              )}
            </div>
          ))}

          {errorMsg && (
            <div className="rounded-lg border border-[var(--pm-error)]/40 bg-[var(--pm-error)]/10 p-3 text-xs text-[var(--pm-error)]">
              {errorMsg}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="border-t border-[var(--pm-border)] p-3 bg-[var(--pm-sidebar)] space-y-2"
        >
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={t(language, 'mentor.placeholder')}
              className="flex-1 resize-none rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm focus:border-[var(--pm-primary)] focus:outline-none"
            />
            {streaming ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-error)] px-4 text-xs font-semibold text-white"
              >
                <Square className="h-3.5 w-3.5" />
                {t(language, 'common.stop')}
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-4 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] disabled:opacity-40 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                {t(language, 'mentor.send')}
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Right: Scoped Learning Context */}
      <aside className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 lg:col-span-3 space-y-4 overflow-y-auto">
        <h3 className="font-display text-sm font-semibold">
          {language === 'uz' ? "O'quv konteksti" : 'Learning Context'}
        </h3>
        <div className="space-y-2 text-xs text-[var(--pm-text-secondary)]">
          <div className="flex justify-between">
            <span className="text-[var(--pm-text-muted)]">{language === 'uz' ? 'Talaba' : 'Student'}</span>
            <span className="font-medium text-[var(--pm-text)]">{user.displayName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--pm-text-muted)]">{language === 'uz' ? 'Daraja' : 'Level'}</span>
            <span className="font-medium text-[var(--pm-text)]">{user.experienceLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--pm-text-muted)]">{language === 'uz' ? 'Tugallangan darslar' : 'Completed'}</span>
            <span className="font-mono tabular-nums text-[var(--pm-text)]">{user.completedLessons}</span>
          </div>
        </div>

        <div className="border-t border-[var(--pm-border)] pt-3 space-y-1.5">
          <label className="text-xs font-medium text-[var(--pm-text-muted)]">
            {language === 'uz' ? 'Kontekst uchun kod (ixtiyoriy)' : 'Attached Code Snippet (optional)'}
          </label>
          <textarea
            rows={8}
            value={attachedCode}
            onChange={(e) => setAttachedCode(e.target.value)}
            placeholder="def my_func(): ..."
            className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-code-bg)] p-2.5 font-mono text-xs focus:border-[var(--pm-primary)] focus:outline-none"
          />
        </div>
      </aside>
    </div>
  );
}
