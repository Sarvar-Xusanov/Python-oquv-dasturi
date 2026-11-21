import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Bot,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitCompare,
  GraduationCap,
  Lightbulb,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
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
  const [outputsByExample, setOutputsByExample] = useState<
    Record<number, { text: string; matched?: boolean }>
  >({});
  const [runningIdx, setRunningIdx] = useState<number | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteSavedMsg, setNoteSavedMsg] = useState<string | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');

  // v2.0 Lesson Reader UX states
  const [showLeftRail, setShowLeftRail] = useState(true);
  const [showRightRail, setShowRightRail] = useState(true);
  const [readerTextSize, setReaderTextSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [traceStepIdx, setTraceStepIdx] = useState(0);
  const [checkedSections, setCheckedSections] = useState<Record<string, boolean>>({});
  const [showHomeworkHint, setShowHomeworkHint] = useState(false);

  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setOutputsByExample({});
    setTraceStepIdx(0);
    setCheckedSections({});
    setShowHomeworkHint(false);
  }, [lesson.id]);

  const isCompleted = completedLessonIds.has(lesson.id);
  const isBookmarked = bookmarkedLessonIds.has(lesson.id);
  const linkedVideos = VIDEO_CATALOG.filter((v) => lesson.relatedVideos.includes(v.id));

  const toggleSection = (key: string) => {
    setCheckedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const handleRunExample = async (idx: number, code: string, expectedOutput?: string) => {
    setRunningIdx(idx);
    try {
      const res = await apiRequest<{ result: { stdout: string; stderr: string } }>('/api/execute', {
        method: 'POST',
        token,
        body: { code },
      });
      const text = (res.result.stdout || res.result.stderr || '(No output)').trim();
      const matched =
        expectedOutput !== undefined ? text === expectedOutput.trim() : undefined;
      setOutputsByExample((prev) => ({ ...prev, [idx]: { text, matched } }));
      setCheckedSections((prev) => ({ ...prev, examples: true }));
    } catch (err) {
      setOutputsByExample((prev) => ({
        ...prev,
        [idx]: { text: err instanceof Error ? err.message : 'Execution error', matched: false },
      }));
    } finally {
      setRunningIdx(null);
    }
  };

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);
    setCheckedSections((prev) => ({ ...prev, quiz: true }));
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

  const centerColSpan =
    showLeftRail && showRightRail
      ? 'lg:col-span-6'
      : showLeftRail || showRightRail
      ? 'lg:col-span-9'
      : 'lg:col-span-12';

  const readerProseClass =
    readerTextSize === 'sm'
      ? 'text-[13px] leading-relaxed'
      : readerTextSize === 'lg'
      ? 'text-[16px] leading-7'
      : 'text-[14px] leading-relaxed';

  const quizScorePct =
    quizSubmitted && lesson.quiz.length > 0
      ? Math.round(
          (lesson.quiz.filter((q) => quizAnswers[q.id] === q.correctIndex).length /
            lesson.quiz.length) *
            100,
        )
      : null;

  return (
    <div className="space-y-4">
      {/* Reader Comfort & Panel Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLeftRail((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] px-2.5 py-1 text-xs text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]"
            title={language === 'uz' ? 'Kurs mundarijasi' : 'Course outline'}
          >
            {showLeftRail ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
            <span>{language === 'uz' ? 'Darslar' : 'Lessons'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRightRail((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] px-2.5 py-1 text-xs text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]"
            title={language === 'uz' ? 'Yordamchi panel' : 'Context panel'}
          >
            {showRightRail ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
            <span>{language === 'uz' ? 'Yordamchi' : 'Context'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {lesson.contentVersion && (
            <span className="rounded border border-[var(--pm-primary)]/40 bg-[var(--pm-primary)]/10 px-2 py-0.5 font-mono text-[11px] text-[var(--pm-secondary)]">
              v{lesson.contentVersion} · {lesson.contentStatus ?? 'published'}
            </span>
          )}
          <div className="flex items-center gap-1 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-0.5">
            {(['sm', 'base', 'lg'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setReaderTextSize(sz)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium ${
                  readerTextSize === sz
                    ? 'bg-[var(--pm-primary)] text-white'
                    : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {sz === 'sm' ? 'A-' : sz === 'base' ? 'A' : 'A+'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Module & Lesson Tree + TOC */}
        {showLeftRail && (
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
                    onClick={() => onSelectLesson(item.id)}
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

            {/* Section Anchor Navigation */}
            <div className="border-t border-[var(--pm-border)] pt-3 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--pm-text-muted)]">
                {language === 'uz' ? 'Dars bo‘limlari' : 'Lesson Sections'}
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <a href="#sec-theory" className="text-[var(--pm-text-secondary)] hover:text-[var(--pm-secondary)]">
                  1. {language === 'uz' ? 'Nazariya va Tushuncha' : 'Theory & Concepts'}
                </a>
                <a href="#sec-examples" className="text-[var(--pm-text-secondary)] hover:text-[var(--pm-secondary)]">
                  2. {t(language, 'lesson.examples')} ({lesson.examples.length})
                </a>
                {lesson.codeTrace && (
                  <a href="#sec-trace" className="text-[var(--pm-text-secondary)] hover:text-[var(--pm-secondary)]">
                    3. {language === 'uz' ? 'Kod izi (Code Trace)' : 'Execution Trace'}
                  </a>
                )}
                {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
                  <a href="#sec-mistakes" className="text-[var(--pm-text-secondary)] hover:text-[var(--pm-secondary)]">
                    4. {language === 'uz' ? 'Ko‘p uchraydigan xatolar' : 'Common Mistakes'}
                  </a>
                )}
                <a href="#sec-quiz" className="text-[var(--pm-text-secondary)] hover:text-[var(--pm-secondary)]">
                  5. {t(language, 'lesson.quiz')} ({lesson.quiz.length})
                </a>
              </div>
            </div>
          </aside>
        )}

        {/* Center: Deep Pedagogical Lesson Flow */}
        <article className={`space-y-6 ${centerColSpan} ${readerProseClass}`}>
          {/* Header + Time Breakdown + Why It Matters */}
          <div id="sec-theory" className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-5">
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

            {lesson.timeBreakdown && (
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--pm-text-secondary)]">
                <Clock className="h-3.5 w-3.5 text-[var(--pm-secondary)]" />
                <span>
                  {language === 'uz' ? 'Vaqt taqsimoti:' : 'Time plan:'}{' '}
                  {language === 'uz' ? 'Tushuntirish' : 'Theory'} {lesson.timeBreakdown.explanation}m ·{' '}
                  {language === 'uz' ? 'Misollar' : 'Examples'} {lesson.timeBreakdown.examples}m ·{' '}
                  {language === 'uz' ? 'Amaliyot' : 'Practice'} {lesson.timeBreakdown.practice}m ·{' '}
                  {language === 'uz' ? 'Takrorlash' : 'Review'} {lesson.timeBreakdown.review}m
                </span>
              </div>
            )}

            {lesson.whyItMatters && (
              <div className="rounded-lg border border-[var(--pm-primary)]/30 bg-[var(--pm-primary)]/10 p-4 space-y-1">
                <div className="text-xs font-semibold text-[var(--pm-secondary)]">
                  {language === 'uz' ? 'Nega bu dars muhim?' : 'Why this lesson matters'}
                </div>
                <p className="text-xs leading-relaxed text-[var(--pm-text)]">{lesson.whyItMatters[language]}</p>
              </div>
            )}

            {lesson.mentalModel && (
              <div className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--pm-info)]">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{language === 'uz' ? 'Fikrlash modeli (Mental Model)' : 'Mental Model & Analogy'}</span>
                </div>
                <p className="text-xs leading-relaxed text-[var(--pm-text-secondary)]">
                  {lesson.mentalModel.analogy[language]}
                </p>
                <p className="text-[11px] leading-relaxed text-[var(--pm-text-muted)] border-t border-[var(--pm-border)] pt-2">
                  <strong className="text-[var(--pm-warning)]">
                    {language === 'uz' ? 'Chegarasi:' : 'Where analogy stops:'}
                  </strong>{' '}
                  {lesson.mentalModel.whereItStops[language]}
                </p>
              </div>
            )}

            <MarkdownRenderer
              content={lesson.theory[language]}
              onLoadCode={onOpenInCodeLab}
              loadLabel={t(language, 'lesson.open_in_lab')}
            />

            <label className="flex items-center gap-2 pt-2 border-t border-[var(--pm-border)] text-xs text-[var(--pm-text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(checkedSections.theory)}
                onChange={() => toggleSection('theory')}
                className="accent-[var(--pm-primary)]"
              />
              <span>
                {language === 'uz'
                  ? 'Nazariya va asosiy qoidalarni tushunib chiqdim'
                  : 'I have read and understood the core theory'}
              </span>
            </label>
          </div>

          {/* Progressive Code Examples */}
          <section id="sec-examples" className="space-y-4">
            {lesson.examples.map((ex, idx) => {
              const out = outputsByExample[idx];
              return (
                <div key={idx} className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      {ex.stageLabel && (
                        <div className="text-[11px] font-medium text-[var(--pm-secondary)]">
                          {ex.stageLabel[language]}
                        </div>
                      )}
                      <h3 className="font-display text-base font-semibold text-[var(--pm-text)]">
                        {ex.title[language]}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={runningIdx === idx}
                        onClick={() => handleRunExample(idx, ex.code, ex.expectedOutput)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors disabled:opacity-60"
                      >
                        <Play className="h-3.5 w-3.5" />
                        {runningIdx === idx
                          ? language === 'uz' ? 'Ishlamoqda...' : 'Running...'
                          : t(language, 'common.run')}
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

                  {ex.expectedOutput && (
                    <div className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)]/60 px-3 py-2 text-xs">
                      <span className="text-[11px] font-medium text-[var(--pm-text-muted)]">
                        {language === 'uz' ? 'Kutilayotgan natija:' : 'Expected output:'}
                      </span>
                      <pre className="mt-1 font-mono text-[12px] text-[var(--pm-text-secondary)] whitespace-pre-wrap">
                        {ex.expectedOutput}
                      </pre>
                    </div>
                  )}

                  {out && (
                    <div className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
                      <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="font-medium text-[var(--pm-text-muted)]">Python Output</span>
                        {out.matched !== undefined && (
                          <span
                            className={
                              out.matched
                                ? 'font-semibold text-[var(--pm-success)]'
                                : 'font-semibold text-[var(--pm-warning)]'
                            }
                          >
                            {out.matched
                              ? language === 'uz' ? 'Kutilgan natija bilan bir xil' : 'Matches expected'
                              : language === 'uz' ? 'Farq aniqlandi' : 'Differs from expected'}
                          </span>
                        )}
                      </div>
                      <pre className="font-mono text-xs text-[var(--pm-accent)] whitespace-pre-wrap">{out.text}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* Interactive Code Tracing Table */}
          {lesson.codeTrace && (
            <section id="sec-trace" className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-[var(--pm-text)]">
                  {lesson.codeTrace.title[language]}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTraceStepIdx((i) => Math.max(0, i - 1))}
                    disabled={traceStepIdx === 0}
                    className="rounded border border-[var(--pm-border)] px-2.5 py-1 text-xs disabled:opacity-40"
                  >
                    {language === 'uz' ? 'Oldingi qadam' : 'Prev Step'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTraceStepIdx((i) => Math.min(lesson.codeTrace!.steps.length - 1, i + 1))
                    }
                    disabled={traceStepIdx >= lesson.codeTrace.steps.length - 1}
                    className="rounded bg-[var(--pm-primary)] px-2.5 py-1 text-xs font-medium text-white disabled:opacity-40"
                  >
                    {language === 'uz' ? 'Keyingi qadam' : 'Next Step'}
                  </button>
                </div>
              </div>

              <pre className="overflow-x-auto rounded-lg border border-[var(--pm-border)] bg-[var(--pm-code-bg)] p-3 font-mono text-xs text-[var(--pm-text)]">
                <code>{lesson.codeTrace.code}</code>
              </pre>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--pm-border)] text-[var(--pm-text-muted)]">
                      <th className="py-2 pr-3">#</th>
                      <th className="py-2 pr-3">{language === 'uz' ? 'Qator' : 'Line'}</th>
                      <th className="py-2 pr-3">{language === 'uz' ? 'Xotira holati' : 'State'}</th>
                      <th className="py-2">{language === 'uz' ? 'Izoh' : 'Note'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lesson.codeTrace.steps.map((st, idx) => {
                      const active = idx === traceStepIdx;
                      const revealed = idx <= traceStepIdx;
                      return (
                        <tr
                          key={st.step}
                          onClick={() => setTraceStepIdx(idx)}
                          className={`cursor-pointer border-b border-[var(--pm-border)]/50 transition-colors ${
                            active
                              ? 'bg-[var(--pm-primary)]/15 text-[var(--pm-text)]'
                              : revealed
                              ? 'text-[var(--pm-text-secondary)]'
                              : 'opacity-40 text-[var(--pm-text-muted)]'
                          }`}
                        >
                          <td className="py-2 pr-3 font-mono">{st.step}</td>
                          <td className="py-2 pr-3 font-mono text-[11px]">{st.line}</td>
                          <td className="py-2 pr-3 font-mono text-[11px] text-[var(--pm-secondary)]">{st.state}</td>
                          <td className="py-2">
                            {st.note[language]}
                            {st.output && (
                              <span className="ml-2 rounded bg-[var(--pm-bg)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--pm-accent)]">
                                → {st.output}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Common Mistakes & Debugging */}
          {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
            <section id="sec-mistakes" className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--pm-warning)]" />
                <h3 className="font-display text-base font-semibold text-[var(--pm-text)]">
                  {language === 'uz' ? 'Ko‘p uchraydigan xatolar va tuzatish' : 'Common Mistakes & Debugging'}
                </h3>
              </div>

              <div className="space-y-4">
                {lesson.commonMistakes.map((m, idx) => (
                  <div key={idx} className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-[var(--pm-text)]">{m.title[language]}</div>
                      <span className="rounded border border-[var(--pm-error)]/40 bg-[var(--pm-error)]/10 px-2 py-0.5 font-mono text-[11px] text-[var(--pm-error)]">
                        {m.errorSymptom}
                      </span>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <div className="mb-1 text-[11px] font-medium text-[var(--pm-error)]">
                          {language === 'uz' ? 'Xato kod' : 'Incorrect'}
                        </div>
                        <pre className="overflow-x-auto rounded border border-[var(--pm-error)]/30 bg-[var(--pm-code-bg)] p-2.5 font-mono text-xs text-[var(--pm-text)]">
                          <code>{m.wrongCode}</code>
                        </pre>
                      </div>
                      <div>
                        <div className="mb-1 text-[11px] font-medium text-[var(--pm-success)]">
                          {language === 'uz' ? 'To‘g‘ri kod' : 'Corrected'}
                        </div>
                        <pre className="overflow-x-auto rounded border border-[var(--pm-success)]/30 bg-[var(--pm-code-bg)] p-2.5 font-mono text-xs text-[var(--pm-text)]">
                          <code>{m.fixedCode}</code>
                        </pre>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--pm-text-secondary)]">
                      <strong>{language === 'uz' ? 'Sababi:' : 'Root cause:'}</strong> {m.rootCause[language]}
                    </p>
                    <p className="text-xs text-[var(--pm-secondary)]">
                      <strong>{language === 'uz' ? 'Oldini olish:' : 'Prevention:'}</strong> {m.preventionTip[language]}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Compare & Choose */}
          {lesson.compareAndChoose && (
            <section className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-[var(--pm-info)]" />
                <h3 className="font-display text-base font-semibold text-[var(--pm-text)]">
                  {lesson.compareAndChoose.title[language]}
                </h3>
              </div>
              <ul className="list-disc space-y-1.5 pl-5 text-xs text-[var(--pm-text-secondary)]">
                {lesson.compareAndChoose.criteria[language].map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3 text-xs font-medium text-[var(--pm-text)]">
                {lesson.compareAndChoose.summary[language]}
              </p>
            </section>
          )}

          {/* Knowledge Check Quiz */}
          {lesson.quiz.length > 0 && (
            <section id="sec-quiz" className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold">{t(language, 'lesson.quiz')}</h3>
                {quizScorePct !== null && (
                  <span
                    className={`font-mono text-xs font-semibold ${
                      quizScorePct >= 70 ? 'text-[var(--pm-success)]' : 'text-[var(--pm-warning)]'
                    }`}
                  >
                    {quizScorePct}%
                  </span>
                )}
              </div>
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
            </section>
          )}

          {/* Homework Task */}
          {lesson.homework && (
            <section className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[var(--pm-secondary)]" />
                  <h3 className="font-display text-base font-semibold text-[var(--pm-text)]">
                    {lesson.homework.title[language]}
                  </h3>
                </div>
                <span className="text-xs text-[var(--pm-text-muted)]">
                  ~{lesson.homework.estimatedMinutes} {t(language, 'common.minutes')}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--pm-text-secondary)]">
                {lesson.homework.task[language]}
              </p>
              <ul className="list-disc space-y-1 pl-5 text-xs text-[var(--pm-text-muted)]">
                {lesson.homework.requirements[language].map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowHomeworkHint((v) => !v)}
                  className="rounded-lg border border-[var(--pm-border)] px-3 py-1.5 text-xs font-medium text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]"
                >
                  {showHomeworkHint
                    ? language === 'uz' ? 'Maslahatni yashirish' : 'Hide Hint'
                    : language === 'uz' ? 'Maslahat olish' : 'Show Hint'}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenInCodeLab('# ' + lesson.homework!.title[language] + '\n')}
                  className="rounded-lg bg-[var(--pm-primary)]/15 border border-[var(--pm-primary)]/40 px-3 py-1.5 text-xs font-medium text-[var(--pm-secondary)]"
                >
                  {t(language, 'lesson.open_in_lab')}
                </button>
              </div>
              {showHomeworkHint && (
                <div className="rounded-lg border border-[var(--pm-warning)]/30 bg-[var(--pm-warning)]/10 p-3 text-xs text-[var(--pm-text)] space-y-1">
                  <div>{lesson.homework.hint[language]}</div>
                  <div className="text-[11px] text-[var(--pm-text-secondary)]">
                    <strong>{language === 'uz' ? 'Qo‘shimcha sinov:' : 'Extension:'}</strong>{' '}
                    {lesson.homework.extensionChallenge[language]}
                  </div>
                </div>
              )}
            </section>
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

        {/* Right: Objectives + Completion Criteria + AI Quick Ask + Quick Note */}
        {showRightRail && (
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

            {lesson.completionCriteria && (
              <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 space-y-2">
                <h3 className="font-display text-sm font-semibold text-[var(--pm-text)]">
                  {language === 'uz' ? 'Yakunlash mezonlari' : 'Mastery Criteria'}
                </h3>
                <ul className="space-y-1.5 text-xs text-[var(--pm-text-secondary)]">
                  {lesson.completionCriteria[language].map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--pm-primary)] shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
        )}
      </div>
    </div>
  );
}
