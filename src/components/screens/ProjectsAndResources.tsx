import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  Play,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { GLOSSARY_TERMS, PROJECTS, VIDEO_CATALOG } from '../../data/exams_and_projects';
import { t } from '../../data/localization';
import { apiRequest } from '../../lib/api';
import { CodeEditor } from '../CodeEditor';
import type { Language, ThemeMode } from '../../types/domain';

export function ProjectLabScreen({
  token,
  language,
  theme,
  fontSize,
  tabSize,
  onAchievementUnlocked,
}: {
  token: string;
  language: Language;
  theme: ThemeMode;
  fontSize: number;
  tabSize: number;
  onAchievementUnlocked: () => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const [projectState, setProjectState] = useState<
    Record<string, { status: string; milestones: string[]; code: string }>
  >({});
  const [output, setOutput] = useState<string>('');
  const [running, setRunning] = useState(false);

  const loadProjects = async () => {
    const res = await apiRequest<{
      userProjects: Array<{
        project_id: string;
        status: string;
        milestones_json: string;
        workspace_code: string;
      }>;
    }>('/api/projects', { token });
    const next: Record<string, { status: string; milestones: string[]; code: string }> = {};
    for (const row of res.userProjects) {
      next[row.project_id] = {
        status: row.status,
        milestones: JSON.parse(row.milestones_json || '[]'),
        code: row.workspace_code,
      };
    }
    setProjectState(next);
  };

  useEffect(() => {
    loadProjects();
  }, [token]);

  const project = PROJECTS.find((p) => p.id === selectedId) ?? PROJECTS[0];
  const saved = projectState[project.id];
  const completedMilestones = saved?.milestones ?? [];
  const code = saved?.code || project.starterCode;

  const saveProjectProgress = async (nextMilestones: string[], nextCode: string) => {
    setProjectState((prev) => ({
      ...prev,
      [project.id]: { status: saved?.status || 'in_progress', milestones: nextMilestones, code: nextCode },
    }));
    const res = await apiRequest<{ unlockedAchievement: string | null }>(`/api/projects/${project.id}`, {
      method: 'PUT',
      token,
      body: { completedMilestones: nextMilestones, workspaceCode: nextCode },
    });
    if (res.unlockedAchievement) {
      await onAchievementUnlocked();
    }
  };

  const toggleMilestone = async (mId: string) => {
    const next = completedMilestones.includes(mId)
      ? completedMilestones.filter((id) => id !== mId)
      : [...completedMilestones, mId];
    await saveProjectProgress(next, code);
  };

  const handleRunProject = async () => {
    setRunning(true);
    try {
      await saveProjectProgress(completedMilestones, code);
      const res = await apiRequest<{ result: { stdout: string; stderr: string } }>('/api/execute', {
        method: 'POST',
        token,
        body: { code },
      });
      setOutput(res.result.stdout || res.result.stderr || '(No output)');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{t(language, 'nav.projects')}</h1>
          <p className="text-sm text-[var(--pm-text-secondary)]">
            {language === 'uz'
              ? "Haqiqiy bosqichlar (milestones) va arxitektura talablari asosida amaliy Python loyihalarini quring."
              : 'Build real multi-milestone Python projects with workspace code execution.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedId(p.id);
                setOutput('');
              }}
              className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                p.id === project.id
                  ? 'border-[var(--pm-primary)] bg-[var(--pm-primary)] text-white'
                  : 'border-[var(--pm-border)] bg-[var(--pm-card)] text-[var(--pm-text-secondary)]'
              }`}
            >
              {p.title[language]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
            <div className="text-xs text-[var(--pm-text-muted)]">
              {project.id} · {t(language, `common.${project.difficulty}`)} · {project.estimatedHours}{' '}
              {t(language, 'common.hours')}
            </div>
            <h2 className="font-display text-xl font-bold">{project.title[language]}</h2>
            <p className="text-sm text-[var(--pm-text-secondary)]">{project.problemStatement[language]}</p>

            <div className="border-t border-[var(--pm-border)] pt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--pm-text-muted)] mb-2">
                {language === 'uz' ? 'Texnik talablar' : 'Requirements'}
              </h3>
              <ul className="list-disc pl-5 text-xs text-[var(--pm-text-secondary)] space-y-1">
                {project.requirements[language].map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
            <h3 className="font-display text-sm font-semibold">
              {language === 'uz' ? 'Loyiha bosqichlari (Milestones)' : 'Project Milestones'}
            </h3>
            <div className="space-y-2">
              {project.milestones.map((m) => {
                const checked = completedMilestones.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMilestone(m.id)}
                    className="flex w-full items-start gap-3 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 text-left hover:bg-[var(--pm-card-hover)] transition-colors"
                  >
                    <CheckCircle2
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        checked ? 'text-[var(--pm-success)]' : 'text-[var(--pm-text-muted)]'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-semibold text-[var(--pm-text)]">{m.title[language]}</div>
                      <div className="text-[11px] text-[var(--pm-text-muted)]">{m.description[language]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-7">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--pm-text-muted)]">workspace/{project.id.toLowerCase()}.py</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => saveProjectProgress(completedMilestones, code)}
                className="rounded-lg border border-[var(--pm-border)] px-3 py-1.5 text-xs font-medium"
              >
                {t(language, 'common.save')}
              </button>
              <button
                type="button"
                disabled={running}
                onClick={handleRunProject}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-4 py-1.5 text-xs font-semibold text-white"
              >
                <Play className="h-3.5 w-3.5" />
                {t(language, 'common.run')}
              </button>
            </div>
          </div>

          <CodeEditor
            value={code}
            onChange={(next) =>
              setProjectState((p) => ({
                ...p,
                [project.id]: {
                  status: saved?.status || 'in_progress',
                  milestones: completedMilestones,
                  code: next,
                },
              }))
            }
            theme={theme}
            fontSize={fontSize}
            tabSize={tabSize}
            minHeight="340px"
            onRunShortcut={handleRunProject}
          />

          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-code-bg)] p-4">
            <div className="mb-1 text-xs font-medium text-[var(--pm-text-muted)]">Project Output</div>
            <pre className="font-mono text-xs text-[var(--pm-text)] whitespace-pre-wrap">
              {output || (language === 'uz' ? 'Kodni ishga tushiring...' : 'Run workspace code...')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoLibraryScreen({
  token,
  language,
  onOpenLesson,
}: {
  token: string;
  language: Language;
  onOpenLesson: (lessonId: string) => void;
}) {
  const [watchedMap, setWatchedMap] = useState<Record<string, boolean>>({});
  const [topicFilter, setTopicFilter] = useState('');

  useEffect(() => {
    apiRequest<{ videoProgress: Array<{ video_id: string; status: string }> }>('/api/videos/progress', { token }).then(
      (res) => {
        const next: Record<string, boolean> = {};
        for (const r of res.videoProgress) {
          next[r.video_id] = r.status === 'watched';
        }
        setWatchedMap(next);
      },
    );
  }, [token]);

  const toggleWatched = async (videoId: string) => {
    const next = !watchedMap[videoId];
    setWatchedMap((p) => ({ ...p, [videoId]: next }));
    await apiRequest(`/api/videos/${videoId}/progress`, {
      method: 'PUT',
      token,
      body: { status: next ? 'watched' : 'unwatched' },
    });
  };

  const filtered = VIDEO_CATALOG.filter(
    (v) =>
      !topicFilter.trim() ||
      v.title.toLowerCase().includes(topicFilter.toLowerCase()) ||
      v.topics.some((tp) => tp.toLowerCase().includes(topicFilter.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t(language, 'nav.videos')}</h1>
          <p className="text-sm text-[var(--pm-text-secondary)]">
            {language === 'uz'
              ? "Harvard CS50P, Corey Schafer, freeCodeCamp va rasmiy Python qo'llanmalarining tekshirilgan manbalari."
              : 'Verified external video courses and official Python documentation linked to your lessons.'}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--pm-text-muted)]" />
          <input
            type="text"
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            placeholder={t(language, 'common.search')}
            className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] pl-9 pr-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((vid) => {
          const isWatched = Boolean(watchedMap[vid.id]);
          return (
            <div
              key={vid.id}
              className="flex flex-col justify-between rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-4"
            >
              <div className="space-y-2">
                <div className="text-xs text-[var(--pm-text-muted)]">
                  {vid.provider} · {vid.channel} · {t(language, `common.${vid.difficulty}`)}
                </div>
                <h3 className="font-display text-lg font-semibold">{vid.title}</h3>
                <p className="text-sm text-[var(--pm-text-secondary)]">{vid.description[language]}</p>
                <div className="text-xs text-[var(--pm-text-muted)]">
                  {vid.topics.join(' · ')}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--pm-border)] pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleWatched(vid.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                      isWatched
                        ? 'border-[var(--pm-success)] bg-[var(--pm-success)]/15 text-[var(--pm-success)]'
                        : 'border-[var(--pm-border)] text-[var(--pm-text-secondary)]'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isWatched
                      ? language === 'uz' ? "Ko'rilgan" : 'Watched'
                      : language === 'uz' ? "Ko'rildi deb belgilash" : 'Mark Watched'}
                  </button>
                  {vid.relatedLessons[0] && (
                    <button
                      type="button"
                      onClick={() => onOpenLesson(vid.relatedLessons[0])}
                      className="text-xs text-[var(--pm-secondary)] hover:underline"
                    >
                      {language === 'uz' ? 'Darsga o‘tish' : 'Open Lesson'}
                    </button>
                  )}
                </div>

                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
                >
                  {language === 'uz' ? 'Brauzerda ochish' : 'Open Resource'}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface NoteRecord {
  id: number;
  lesson_id: string | null;
  title: string;
  content: string;
  code_snippet: string;
  updated_at: string;
}

export function NotesScreen({
  token,
  language,
  onAchievementUnlocked,
}: {
  token: string;
  language: Language;
  onAchievementUnlocked: () => Promise<void>;
}) {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchNotes = async (q = search) => {
    const url = q.trim() ? `/api/notes?q=${encodeURIComponent(q.trim())}` : '/api/notes';
    const res = await apiRequest<{ notes: NoteRecord[] }>(url, { token });
    setNotes(res.notes);
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchNotes(search), 150);
    return () => clearTimeout(timer);
  }, [search, token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (editingId) {
      await apiRequest(`/api/notes/${editingId}`, {
        method: 'PUT',
        token,
        body: { title, content, codeSnippet },
      });
    } else {
      const res = await apiRequest<{ unlockedAchievement: string | null }>('/api/notes', {
        method: 'POST',
        token,
        body: { title, content, codeSnippet },
      });
      if (res.unlockedAchievement) await onAchievementUnlocked();
    }
    setTitle('');
    setContent('');
    setCodeSnippet('');
    setEditingId(null);
    await fetchNotes(search);
  };

  const handleDelete = async (id: number) => {
    await apiRequest(`/api/notes/${id}`, { method: 'DELETE', token });
    await fetchNotes(search);
  };

  const handleExportMd = () => {
    const md = notes
      .map(
        (n) =>
          `# ${n.title}\n\n${n.content}\n${n.code_snippet ? `\n\`\`\`python\n${n.code_snippet}\n\`\`\`\n` : ''}`,
      )
      .join('\n---\n\n');
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python_mastery_notes.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <form
        onSubmit={handleSave}
        className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3 lg:col-span-5 h-fit"
      >
        <h2 className="font-display text-lg font-bold">
          {editingId
            ? language === 'uz' ? 'Qaydni tahrirlash' : 'Edit Note'
            : language === 'uz' ? 'Yangi qayd yaratish' : 'New Study Note'}
        </h2>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={language === 'uz' ? 'Sarlavha...' : 'Note title...'}
          className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm"
        />
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={language === 'uz' ? 'Asosiy fikrlar va izohlar...' : 'Notes and takeaways...'}
          className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 text-sm"
        />
        <textarea
          rows={4}
          value={codeSnippet}
          onChange={(e) => setCodeSnippet(e.target.value)}
          placeholder="# Python code snippet (optional)"
          className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-code-bg)] p-3 font-mono text-xs"
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-4 py-2 text-xs font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            {t(language, 'common.save')}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle('');
                setContent('');
                setCodeSnippet('');
              }}
              className="rounded-lg border border-[var(--pm-border)] px-3 py-2 text-xs"
            >
              {t(language, 'common.cancel')}
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--pm-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'uz' ? 'FTS5 bo‘yicha tezkor qidiruv...' : 'Full-text search notes...'}
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] pl-9 pr-3 py-2 text-sm"
            />
          </div>
          {notes.length > 0 && (
            <button
              type="button"
              onClick={handleExportMd}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] px-3.5 py-2 text-xs font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              Export .md
            </button>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-8 text-center text-sm text-[var(--pm-text-muted)]">
            {language === 'uz' ? 'Hozircha qaydlar yo‘q.' : 'No notes yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold">{n.title}</h3>
                    <div className="text-[11px] font-mono text-[var(--pm-text-muted)]">
                      {n.updated_at.slice(0, 16)} {n.lesson_id ? `· ${n.lesson_id}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(n.id);
                        setTitle(n.title);
                        setContent(n.content);
                        setCodeSnippet(n.code_snippet);
                      }}
                      className="text-[var(--pm-secondary)] hover:underline"
                    >
                      {t(language, 'common.edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(n.id)}
                      className="text-[var(--pm-text-muted)] hover:text-[var(--pm-error)]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {n.content && <p className="text-sm text-[var(--pm-text-secondary)] whitespace-pre-line">{n.content}</p>}
                {n.code_snippet && (
                  <pre className="overflow-x-auto rounded-lg border border-[var(--pm-border)] bg-[var(--pm-code-bg)] p-3 font-mono text-xs">
                    {n.code_snippet}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function GlossaryScreen({
  language,
  onOpenInCodeLab,
}: {
  language: Language;
  onOpenInCodeLab: (code: string) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = GLOSSARY_TERMS.filter(
    (g) =>
      !query.trim() ||
      g.term.toLowerCase().includes(query.toLowerCase()) ||
      g.uzTranslation.toLowerCase().includes(query.toLowerCase()) ||
      g.definition[language].toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t(language, 'nav.glossary')}</h1>
          <p className="text-sm text-[var(--pm-text-secondary)]">
            {language === 'uz'
              ? "Inglizcha dasturlash atamalarining o'zbekcha izohli lug'ati va ishlaydigan misollar."
              : 'Bilingual English-Uzbek Python terminology reference with runnable snippets.'}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--pm-text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(language, 'common.search')}
            className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] pl-9 pr-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs text-[var(--pm-text-muted)]">{item.category}</div>
                <h3 className="font-display text-lg font-bold text-[var(--pm-text)]">
                  {item.term} — <span className="text-[var(--pm-secondary)]">{item.uzTranslation}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onOpenInCodeLab(item.example)}
                className="rounded border border-[var(--pm-border)] px-2.5 py-1 text-[11px] font-medium hover:bg-[var(--pm-card-hover)]"
              >
                Code Lab
              </button>
            </div>
            <p className="text-sm text-[var(--pm-text-secondary)]">{item.definition[language]}</p>
            <pre className="overflow-x-auto rounded-lg border border-[var(--pm-border)] bg-[var(--pm-code-bg)] p-3 font-mono text-xs text-[var(--pm-text)]">
              {item.example}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
