import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Bot,
  CheckCircle2,
  ExternalLink,
  Play,
  StickyNote,
} from 'lucide-react';
import { COURSES, LESSONS, getCourseById, getLessonsForCourse } from '../../data/curriculum';
import { VIDEO_CATALOG } from '../../data/exams_and_projects';
import { t } from '../../data/localization';
import { apiRequest } from '../../lib/api';
import { MarkdownRenderer } from '../MarkdownRenderer';
import type { Language } from '../../types/domain';

interface LessonReaderProps {
  lessonId: string;
  token: string;
  language: Language;
  completedLessonIds: Set<string>;
  bookmarkedLessonIds: Set<string>;
  onSelectLesson: (lessonId: string) => void;
  onProgressUpdated: () => Promise<void>;
  onOpenInCodeLab: (code: string) => void;
  onAskAiWithContext: (prompt: string, lessonId: string) => void;
}

export function LessonReaderScreen({
  lessonId,
  token,
  language,
  completedLessonIds,
  bookmarkedLessonIds,
  onSelectLesson,
  onProgressUpdated,
  onOpenInCodeLab,
  onAskAiWithContext,
}: LessonReaderProps) {
  const lesson = LESSONS.find((l) => l.id === lessonId) ?? LESSONS[0];
  const course = getCourseById(lesson.courseId) ?? COURSES[0];
  const courseLessons = getLessonsForCourse(course.id);

  const globalIdx = LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = globalIdx > 0 ? LESSONS[globalIdx - 1] : null;
  const nextLesson = globalIdx < LESSONS.length - 1 ? LESSONS[globalIdx + 1] : null;

  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quickOutput, setQuickOutput] = useState<string | null>(null);
  const [runningCode, setRunningCode] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteSavedMsg, setNoteSavedMsg] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');

  const isCompleted = completedLessonIds.has(lesson.id);
  const isBookmarked = bookmarkedLessonIds.has(lesson.id);
  const linkedVideos = VIDEO_CATALOG.filter((v) => lesson.relatedVideos.includes(v.id));

  const handleToggleComplete = async () => {
    await apiRequest(`/api/lessons/${lesson.id}/progress`, {
      method: 'POST',
      token,
      body: { status: isCompleted ? 'in_progress' : 'completed' },
    });
    await onProgressUpdated();
  };

  const handleToggleBookmark = async () => {
    await apiRequest(`/api/lessons/${lesson.id}/progress`, {
      method: 'POST',
      token,
      body: { bookmarked: !isBookmarked },
    });
    await onProgressUpdated();
  };

  const handleRunExample = async (code: string) => {
    setRunningCode(true);
    setQuickOutput(null);
    try {
      const res = await apiRequest<{ result: { stdout: string; stderr: string } }>('/api/execute', {
        method: 'POST',
        token,
        body: { code },
      });
      setQuickOutput(res.result.stdout || res.result.stderr || '(No output)');
    } catch (err) {
      setQuickOutput(err instanceof Error ? err.message : 'Execution error');
    } finally {
      setRunningCode(false);
    }
  };

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);
    if (lesson.quiz.length === 0) return;
    const correct = lesson.quiz.filter((q) => quizAnswers[q.id] === q.correctIndex).length;
    const score = Math.round((correct / lesson.quiz.length) * 100);
    await apiRequest(`/api/lessons/${lesson.id}/progress`, {
      method: 'POST',
      token,
      body: { quizScore: score, status: score >= 70 ? 'completed' : 'in_progress' },
    });
    await onProgressUpdated();
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    await apiRequest('/api/notes', {
      method: 'POST',
      token,
      body: {
        lessonId: lesson.id,
        title: noteTitle,
        content: noteBody,
        tags: [course.id],
      },
    });
    setNoteTitle('');
    setNoteBody('');
    setNoteSavedMsg(language === 'uz' ? 'Qayd saqlandi!' : 'Note saved!');
    setTimeout(() => setNoteSavedMsg(null), 2200);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left: Module & Lesson Tree */}
      <aside className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 lg:col-span-3 space-y-4 h-fit">
        <div>
          <div className="text-xs text-[var(--pm-text-muted)]">
            {language === 'uz' ? `${course.number}-kurs` : `Course ${course.number}`}
          </div>
          <h2 className="font-display text-base font-bold text-[var(--pm-text)]">{course.title[language]}</h2>
        </div>

        <div className="space-y-1">
          {courseLessons.map((item) => {
            const active = item.id === lesson.id;
            const done = completedLessonIds.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                  setQuickOutput(null);
                  onSelectLesson(item.id);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  active
                    ? 'bg-[var(--pm-primary)]/15 text-[var(--pm-text)] font-semibold'
                    : 'text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]'
                }`}
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 shrink-0 ${
                    done ? 'text-[var(--pm-success)]' : 'text-[var(--pm-text-muted)]'
                  }`}
                />
                <span className="truncate">{item.title[language]}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Center: Lesson Content + Runnable Examples + Quiz */}
      <article className="space-y-6 lg:col-span-6">
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--pm-border)] pb-4">
            <div className="space-y-1">
              <div className="text-xs text-[var(--pm-text-muted)]">
                {lesson.id} · {t(language, `common.${lesson.difficulty}`)} · {lesson.estimatedMinutes}{' '}
                {t(language, 'common.minutes')}
              </div>
              <h1 className="font-display text-2xl font-bold text-[var(--pm-text)]">{lesson.title[language]}</h1>
            </div>
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isBookmarked
                  ? 'border-[var(--pm-primary)] bg-[var(--pm-primary)]/15 text-[var(--pm-secondary)]'
                  : 'border-[var(--pm-border)] text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              {isBookmarked
                ? language === 'uz' ? 'Saqlangan' : 'Bookmarked'
                : language === 'uz' ? 'Xatcho‘p' : 'Bookmark'}
            </button>
          </div>

          <MarkdownRenderer
            content={lesson.theory[language]}
            onLoadCode={onOpenInCodeLab}
            loadLabel={t(language, 'lesson.open_in_lab')}
          />
        </div>

        {/* Code Examples */}
        {lesson.examples.map((ex, idx) => (
          <div key={idx} className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-[var(--pm-text)]">
                {t(language, 'lesson.examples')}: {ex.title[language]}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={runningCode}
                  onClick={() => handleRunExample(ex.code)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
                >
                  <Play className="h-3.5 w-3.5" />
                  {t(language, 'common.run')}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenInCodeLab(ex.code)}
                  className="rounded-lg border border-[var(--pm-border)] px-3 py-1.5 text-xs font-medium text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]"
                >
                  {t(language, 'lesson.open_in_lab')}
                </button>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-[var(--pm-border)] bg-[var(--pm-code-bg)] p-3.5 font-mono text-[13px] text-[var(--pm-text)]">
              <code>{ex.code}</code>
            </pre>
            <p className="text-xs text-[var(--pm-text-secondary)]">{ex.explanation[language]}</p>

            {quickOutput !== null && (
              <div className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                <div className="mb-1 text-[11px] font-medium text-[var(--pm-text-muted)]">Python Output</div>
                <pre className="font-mono text-xs text-[var(--pm-accent)] whitespace-pre-wrap">{quickOutput}</pre>
              </div>
            )}
          </div>
        ))}

        {/* Knowledge Check Quiz */}
        {lesson.quiz.length > 0 && (
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-4">
            <h3 className="font-display text-base font-semibold">{t(language, 'lesson.quiz')}</h3>
            {lesson.quiz.map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium text-[var(--pm-text)]">{q.question[language]}</p>
                <div className="grid gap-2">
                  {q.options[language].map((opt, optIdx) => {
                    const chosen = quizAnswers[q.id] === optIdx;
                    const isRight = quizSubmitted && optIdx === q.correctIndex;
                    const isWrong = quizSubmitted && chosen && optIdx !== q.correctIndex;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => setQuizAnswers((p) => ({ ...p, [q.id]: optIdx }))}
                        className={`rounded-lg border px-3.5 py-2 text-left text-sm transition-colors ${
                          isRight
                            ? 'border-[var(--pm-success)] bg-[var(--pm-success)]/15 text-[var(--pm-text)]'
                            : isWrong
                            ? 'border-[var(--pm-error)] bg-[var(--pm-error)]/15 text-[var(--pm-text)]'
                            : chosen
                            ? 'border-[var(--pm-primary)] bg-[var(--pm-primary)]/15 text-[var(--pm-text)]'
                            : 'border-[var(--pm-border)] bg-[var(--pm-bg)] text-[var(--pm-text-secondary)]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <p className="text-xs text-[var(--pm-text-secondary)]">{q.explanation[language]}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleSubmitQuiz}
              className="rounded-lg bg-[var(--pm-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
            >
              {language === 'uz' ? 'Javobni tekshirish' : 'Check Answer'}
            </button>
          </div>
        )}

        {/* Linked Video Resources */}
        {linkedVideos.length > 0 && (
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
            <h3 className="font-display text-base font-semibold">{t(language, 'nav.videos')}</h3>
            {linkedVideos.map((vid) => (
              <a
                key={vid.id}
                href={vid.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 hover:bg-[var(--pm-card-hover)] transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <div className="truncate text-sm font-medium text-[var(--pm-text)]">{vid.title}</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">
                    {vid.channel} · {vid.provider}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-[var(--pm-secondary)]" />
              </a>
            ))}
          </div>
        )}

        {/* Bottom Prev / Complete / Next */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4">
          <button
            type="button"
            disabled={!prevLesson}
            onClick={() => prevLesson && onSelectLesson(prevLesson.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] px-3.5 py-2 text-xs font-medium disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t(language, 'lesson.previous')}
          </button>

          <button
            type="button"
            onClick={handleToggleComplete}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
              isCompleted
                ? 'border border-[var(--pm-success)] bg-[var(--pm-success)]/15 text-[var(--pm-success)]'
                : 'bg-[var(--pm-primary)] text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110]'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isCompleted ? t(language, 'lesson.completed_badge') : t(language, 'lesson.mark_complete')}
          </button>

          <button
            type="button"
            disabled={!nextLesson}
            onClick={() => nextLesson && onSelectLesson(nextLesson.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] px-3.5 py-2 text-xs font-medium disabled:opacity-40"
          >
            {t(language, 'lesson.next')}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </article>

      {/* Right: Objectives + AI Quick Ask + Quick Note */}
      <aside className="space-y-4 lg:col-span-3">
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 space-y-2.5">
          <h3 className="font-display text-sm font-semibold text-[var(--pm-text)]">
            {t(language, 'lesson.objectives')}
          </h3>
          <ul className="space-y-1.5 text-xs text-[var(--pm-text-secondary)]">
            {lesson.objectives[language].map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pm-secondary)]" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Bot className="h-4 w-4 text-[var(--pm-secondary)]" />
            <span>{t(language, 'lesson.ask_ai')}</span>
          </div>
          <textarea
            rows={3}
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder={
              language === 'uz'
                ? 'Ushbu dars bo‘yicha tushunmagan joyingizni so‘rang...'
                : 'Ask the AI Mentor about this lesson...'
            }
            className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-2.5 text-xs focus:border-[var(--pm-primary)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() =>
              onAskAiWithContext(
                aiQuestion.trim() ||
                  (language === 'uz'
                    ? `"${lesson.title.uz}" darsini oddiy misollar bilan tushuntirib bering.`
                    : `Explain "${lesson.title.en}" with simple examples.`),
                lesson.id,
              )
            }
            className="w-full rounded-lg bg-[var(--pm-primary)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
          >
            {t(language, 'lesson.ask_ai')}
          </button>
        </div>

        <form onSubmit={handleSaveNote} className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <StickyNote className="h-4 w-4 text-[var(--pm-secondary)]" />
            <span>{language === 'uz' ? 'Tezkor qayd' : 'Quick Note'}</span>
          </div>
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder={language === 'uz' ? 'Qayd sarlavhasi...' : 'Note title...'}
            className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-2.5 py-1.5 text-xs focus:border-[var(--pm-primary)] focus:outline-none"
          />
          <textarea
            rows={3}
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder={language === 'uz' ? 'Muhim xulosa...' : 'Key takeaway...'}
            className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-2.5 text-xs focus:border-[var(--pm-primary)] focus:outline-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[var(--pm-success)]">{noteSavedMsg}</span>
            <button
              type="submit"
              className="rounded-lg border border-[var(--pm-border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--pm-card-hover)]"
            >
              {t(language, 'common.save')}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
