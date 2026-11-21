import { useEffect, useState } from 'react';
import {
  Bot,
  FileCode2,
  Play,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { t } from '../../data/localization';
import { CodeEditor } from '../CodeEditor';
import type { Language, ThemeMode } from '../../types/domain';

interface CodeFile {
  filename: string;
  content: string;
  updated_at: string;
}

interface CodeLabProps {
  token: string;
  language: Language;
  theme: ThemeMode;
  fontSize: number;
  tabSize: number;
  initialCode?: string | null;
  onConsumeInitialCode: () => void;
  onSendToAiMentor: (prompt: string, code: string) => void;
  onAchievementUnlocked: () => Promise<void>;
}

export function CodeLabScreen({
  token,
  language,
  theme,
  fontSize,
  tabSize,
  initialCode,
  onConsumeInitialCode,
  onSendToAiMentor,
  onAchievementUnlocked,
}: CodeLabProps) {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFilename, setActiveFilename] = useState<string>('main.py');
  const [code, setCode] = useState<string>('');
  const [stdinText, setStdinText] = useState<string>('');
  const [newFilename, setNewFilename] = useState<string>('');
  const [showNewFile, setShowNewFile] = useState(false);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [outputTab, setOutputTab] = useState<'output' | 'errors' | 'sandbox'>('output');
  const [execResult, setExecResult] = useState<{
    stdout: string;
    stderr: string;
    exitCode: number | null;
    durationMs: number;
    timedOut: boolean;
  } | null>(null);

  const loadFiles = async () => {
    const res = await apiRequest<{ files: CodeFile[] }>('/api/code-files', { token });
    setFiles(res.files);
    if (res.files.length > 0) {
      const target = res.files.find((f) => f.filename === activeFilename) ?? res.files[0];
      setActiveFilename(target.filename);
      setCode(target.content);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [token]);

  useEffect(() => {
    if (initialCode) {
      setActiveFilename('scratchpad.py');
      setCode(initialCode);
      onConsumeInitialCode();
    }
  }, [initialCode]);

  const handleSaveFile = async (filenameToSave = activeFilename, contentToSave = code) => {
    setSaving(true);
    try {
      await apiRequest(`/api/code-files/${encodeURIComponent(filenameToSave)}`, {
        method: 'PUT',
        token,
        body: { content: contentToSave },
      });
      await loadFiles();
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newFilename.trim().endsWith('.py') ? newFilename.trim() : `${newFilename.trim()}.py`;
    if (!/^[a-zA-Z0-9._-]{1,64}\.py$/.test(clean)) return;
    await apiRequest(`/api/code-files/${encodeURIComponent(clean)}`, {
      method: 'PUT',
      token,
      body: { content: `# ${clean}\nprint("Salom, ${clean}!")\n` },
    });
    setNewFilename('');
    setShowNewFile(false);
    setActiveFilename(clean);
    await loadFiles();
  };

  const handleDeleteFile = async (fname: string) => {
    if (files.length <= 1) return;
    await apiRequest(`/api/code-files/${encodeURIComponent(fname)}`, { method: 'DELETE', token });
    const next = files.find((f) => f.filename !== fname);
    if (next) {
      setActiveFilename(next.filename);
      setCode(next.content);
    }
    await loadFiles();
  };

  const handleRun = async () => {
    setRunning(true);
    try {
      await handleSaveFile(activeFilename, code);
      const res = await apiRequest<{
        result: { stdout: string; stderr: string; exitCode: number | null; durationMs: number; timedOut: boolean };
        unlockedAchievement: string | null;
      }>('/api/execute', {
        method: 'POST',
        token,
        body: { code, stdin: stdinText },
      });
      setExecResult(res.result);
      setOutputTab(res.result.stderr ? 'errors' : 'output');
      if (res.unlockedAchievement) {
        await onAchievementUnlocked();
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-lg font-bold">{t(language, 'nav.code_lab')}</h1>
          <span className="font-mono text-xs text-[var(--pm-text-muted)]">{activeFilename}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors whitespace-nowrap"
          >
            <Play className="h-3.5 w-3.5" />
            {running ? '...' : `${t(language, 'common.run')} (Ctrl+Enter)`}
          </button>
          <button
            type="button"
            onClick={() => handleSaveFile()}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--pm-card-hover)]"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? '...' : t(language, 'common.save')}
          </button>
          <button
            type="button"
            onClick={() => setExecResult(null)}
            className="rounded-lg border border-[var(--pm-border)] px-3 py-1.5 text-xs font-medium text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]"
          >
            {t(language, 'common.clear')}
          </button>
        </div>
      </div>

      {/* 3-Column IDE Workspace */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Explorer */}
        <aside className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-3 lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--pm-text-muted)]">
              {language === 'uz' ? 'Fayllar' : 'Explorer'}
            </span>
            <button
              type="button"
              onClick={() => setShowNewFile((v) => !v)}
              className="rounded p-1 hover:bg-[var(--pm-card-hover)]"
              title="New file"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {showNewFile && (
            <form onSubmit={handleCreateFile} className="space-y-1.5">
              <input
                type="text"
                placeholder="script.py"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                className="w-full rounded border border-[var(--pm-border)] bg-[var(--pm-bg)] px-2 py-1 font-mono text-xs"
              />
              <button
                type="submit"
                className="w-full rounded bg-[var(--pm-primary)] py-1 text-xs font-semibold text-white"
              >
                {t(language, 'common.create')}
              </button>
            </form>
          )}

          <div className="space-y-1">
            {files.map((f) => (
              <div
                key={f.filename}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs ${
                  activeFilename === f.filename
                    ? 'bg-[var(--pm-primary)]/15 text-[var(--pm-text)] font-medium'
                    : 'text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilename(f.filename);
                    setCode(f.content);
                  }}
                  className="flex flex-1 items-center gap-2 truncate text-left font-mono"
                >
                  <FileCode2 className="h-3.5 w-3.5 shrink-0 text-[var(--pm-secondary)]" />
                  <span className="truncate">{f.filename}</span>
                </button>
                {files.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(f.filename)}
                    className="ml-1 text-[var(--pm-text-muted)] hover:text-[var(--pm-error)]"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Code Editor */}
        <div className="lg:col-span-7 space-y-3">
          <CodeEditor
            value={code}
            onChange={setCode}
            theme={theme}
            fontSize={fontSize}
            tabSize={tabSize}
            minHeight="380px"
            onRunShortcut={handleRun}
          />
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-3">
            <label className="block text-xs font-medium text-[var(--pm-text-muted)] mb-1">
              {language === 'uz' ? 'Standard Input (input() uchun)' : 'Standard Input (for input() calls)'}
            </label>
            <textarea
              rows={2}
              value={stdinText}
              onChange={(e) => setStdinText(e.target.value)}
              placeholder={language === 'uz' ? 'Har bir input() qiymatini alohida qatorga yozing...' : 'One input line per input() call...'}
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-2 font-mono text-xs focus:border-[var(--pm-primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* AI Quick Actions */}
        <aside className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 lg:col-span-3 space-y-3 h-fit">
          <div className="flex items-center gap-2 font-display text-sm font-semibold">
            <Bot className="h-4 w-4 text-[var(--pm-secondary)]" />
            <span>{t(language, 'nav.ai_mentor')}</span>
          </div>
          <p className="text-xs text-[var(--pm-text-secondary)]">
            {language === 'uz'
              ? 'Joriy kodingizni tahlil qilish, xatosini topish yoki yaxshilash uchun AI ustozga yuboring.'
              : 'Send your current editor code directly to the AI Mentor for review or debugging.'}
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                onSendToAiMentor(
                  language === 'uz'
                    ? 'Ushbu kodni qatorma-qator tushuntirib bering.'
                    : 'Explain this Python code line by line.',
                  code,
                )
              }
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-left text-xs font-medium hover:bg-[var(--pm-card-hover)]"
            >
              {language === 'uz' ? 'Kodni tushuntirish' : 'Explain Code'}
            </button>
            <button
              type="button"
              onClick={() =>
                onSendToAiMentor(
                  language === 'uz'
                    ? `Koddagi xatoni topishga yordam bering. Konsol xabari:\n${execResult?.stderr || 'yo‘q'}`
                    : `Help me debug this code. Console stderr:\n${execResult?.stderr || 'none'}`,
                  code,
                )
              }
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-left text-xs font-medium hover:bg-[var(--pm-card-hover)]"
            >
              {language === 'uz' ? 'Xatoni tahlil qilish (Debug)' : 'Debug Errors'}
            </button>
            <button
              type="button"
              onClick={() =>
                onSendToAiMentor(
                  language === 'uz'
                    ? 'Kodni PEP 8 va samaradorlik bo‘yicha tekshirib (Code Review) bering.'
                    : 'Review this code for readability, edge cases, and Pythonic style.',
                  code,
                )
              }
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-left text-xs font-medium hover:bg-[var(--pm-card-hover)]"
            >
              {language === 'uz' ? 'Kod sifati (Code Review)' : 'Code Review'}
            </button>
          </div>
        </aside>
      </div>

      {/* Console Drawer */}
      <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--pm-border)] px-4 py-2 bg-[var(--pm-sidebar)]">
          <div className="flex items-center gap-2">
            {(['output', 'errors', 'sandbox'] as const).map((tabId) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setOutputTab(tabId)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  outputTab === tabId
                    ? 'bg-[var(--pm-primary)] text-white'
                    : 'text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]'
                }`}
              >
                {tabId === 'output'
                  ? 'Output'
                  : tabId === 'errors'
                  ? 'Errors'
                  : language === 'uz' ? 'Sandbox xavfsizligi' : 'Sandbox Policy'}
              </button>
            ))}
          </div>
          {execResult && (
            <span className="font-mono text-xs tabular-nums text-[var(--pm-text-muted)]">
              exit {execResult.exitCode ?? '?'} · {execResult.durationMs} ms
            </span>
          )}
        </div>

        <div className="p-4 font-mono text-xs min-h-[120px] bg-[var(--pm-code-bg)]">
          {outputTab === 'output' && (
            <pre className="whitespace-pre-wrap text-[var(--pm-text)]">
              {execResult?.stdout || (language === 'uz' ? "Natija shu yerda ko'rinadi..." : 'Program output will appear here...')}
            </pre>
          )}
          {outputTab === 'errors' && (
            <pre className="whitespace-pre-wrap text-[var(--pm-error)]">
              {execResult?.stderr || (language === 'uz' ? "Xatoliklar yo'q." : 'No errors.')}
            </pre>
          )}
          {outputTab === 'sandbox' && (
            <div className="flex items-start gap-2.5 text-[var(--pm-text-secondary)] font-sans text-xs leading-relaxed">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--pm-secondary)] mt-0.5" />
              <p>
                {language === 'uz'
                  ? "Kod asosiy server jarayonidan ajratilgan Python 3.11 (-I izolyatsiya bayrog'i) muhitida, 3.5 soniya vaqt chegarasi, 64KB chiqish limiti va maxfiy o'zgaruvchilarsiz vaqtinchalik papkada bajariladi."
                  : 'Code runs in an isolated Python 3.11 child process (-I isolated mode) inside an ephemeral temp directory with a 3.5s timeout, 64KB output cap, and zero access to server secrets.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
