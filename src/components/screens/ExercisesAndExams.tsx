import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Lightbulb,
  Play,
  Send,
  XCircle,
} from 'lucide-react';
import { EXERCISES } from '../../data/exercises';
import { EXAMINATIONS } from '../../data/exams_and_projects';
import { t } from '../../data/localization';
import { apiRequest } from '../../lib/api';
import { CodeEditor } from '../CodeEditor';
import type { Language, ThemeMode } from '../../types/domain';

interface TestOutcome {
  id: string;
  label: string;
  passed: boolean;
  isHidden: boolean;
  expected?: string;
  actual?: string;
  error?: string;
}

export function ExercisesScreen({
  token,
  language,
  theme,
  fontSize,
  tabSize,
  initialExerciseId,
  onAchievementUnlocked,
}: {
  token: string;
  language: Language;
  theme: ThemeMode;
  fontSize: number;
  tabSize: number;
  initialExerciseId?: string | null;
  onAchievementUnlocked: () => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState<string>(initialExerciseId || EXERCISES[0].id);
  const [diffFilter, setDiffFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [outcomes, setOutcomes] = useState<TestOutcome[] | null>(null);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [stderr, setStderr] = useState<string>('');
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadSubmissions = async () => {
    const res = await apiRequest<{
      submissions: Array<{ exercise_id: string; score: number; source_code: string }>;
    }>('/api/exercises/submissions', { token });
    const scores: Record<string, number> = {};
    const savedCodes: Record<string, string> = {};
    for (const s of res.submissions) {
      if (scores[s.exercise_id] === undefined || s.score > scores[s.exercise_id]) {
        scores[s.exercise_id] = s.score;
      }
      if (!savedCodes[s.exercise_id]) {
        savedCodes[s.exercise_id] = s.source_code;
      }
    }
    setBestScores(scores);
    setCodeMap((prev) => ({ ...savedCodes, ...prev }));
  };

  useEffect(() => {
    loadSubmissions();
  }, [token]);

  useEffect(() => {
    if (initialExerciseId) {
      setSelectedId(initialExerciseId);
    }
  }, [initialExerciseId]);

  const exercise = EXERCISES.find((e) => e.id === selectedId) ?? EXERCISES[0];
  const currentCode = codeMap[exercise.id] ?? exercise.starterCode;

  const filtered = EXERCISES.filter(
    (ex) => diffFilter === 'all' || ex.difficulty === diffFilter,
  );

  const handleRunVisible = async () => {
    setBusy(true);
    setHint(null);
    try {
      const res = await apiRequest<{
        result: { outcomes: TestOutcome[]; stderr: string; score: number };
      }>(`/api/exercises/${exercise.id}/run`, {
        method: 'POST',
        token,
        body: { code: currentCode },
      });
      setOutcomes(res.result.outcomes);
      setStderr(res.result.stderr);
      setLastScore(null);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async () => {
    setBusy(true);
    try {
      const res = await apiRequest<{
        result: { outcomes: TestOutcome[]; stderr: string; score: number };
        unlockedAchievement: string | null;
      }>(`/api/exercises/${exercise.id}/submit`, {
        method: 'POST',
        token,
        body: { code: currentCode },
      });
      setOutcomes(res.result.outcomes);
      setStderr(res.result.stderr);
      setLastScore(res.result.score);
      await loadSubmissions();
      if (res.unlockedAchievement) {
        await onAchievementUnlocked();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleRequestHint = async () => {
    setBusy(true);
    try {
      const res = await apiRequest<{ hint: string }>(`/api/exercises/${exercise.id}/hint`, {
        method: 'POST',
        token,
        body: { code: currentCode },
      });
      setHint(res.hint);
    } catch (err) {
      setHint(err instanceof Error ? err.message : 'Hint unavailable');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Left: Exercise Selector */}
      <aside className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-3 lg:col-span-3 space-y-3 h-fit">
        <div className="flex flex-wrap gap-1 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-1">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDiffFilter(d)}
              className={`flex-1 rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                diffFilter === d
                  ? 'bg-[var(--pm-primary)] text-white'
                  : 'text-[var(--pm-text-secondary)]'
              }`}
            >
              {d === 'all' ? (language === 'uz' ? 'Hammasi' : 'All') : t(language, `common.${d}`)}
            </button>
          ))}
        </div>

        <div className="space-y-1 max-h-[540px] overflow-y-auto">
          {filtered.map((ex) => {
            const best = bestScores[ex.id];
            const active = ex.id === exercise.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => {
                  setSelectedId(ex.id);
                  setOutcomes(null);
                  setStderr('');
                  setHint(null);
                  setLastScore(null);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition-colors ${
                  active
                    ? 'bg-[var(--pm-primary)]/15 text-[var(--pm-text)] font-semibold'
                    : 'text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="truncate">{ex.title[language]}</div>
                  <div className="text-[11px] text-[var(--pm-text-muted)]">
                    {t(language, `common.${ex.difficulty}`)} · {ex.estimatedMinutes}m
                  </div>
                </div>
                {best === 100 && <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--pm-success)]" />}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Center + Right: Prompt & Editor */}
      <div className="lg:col-span-9 space-y-4">
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs text-[var(--pm-text-muted)]">
                {exercise.id} · {exercise.topic[language]} · {t(language, `common.${exercise.difficulty}`)}
              </div>
              <h1 className="font-display text-xl font-bold text-[var(--pm-text)]">{exercise.title[language]}</h1>
            </div>
            {bestScores[exercise.id] !== undefined && (
              <span className="font-mono text-xs tabular-nums text-[var(--pm-secondary)]">
                {language === 'uz' ? 'Eng yaxshi natija:' : 'Best score:'} {bestScores[exercise.id]}%
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-[var(--pm-text-secondary)]">{exercise.instructions[language]}</p>

          <div className="grid gap-3 sm:grid-cols-2 pt-1 text-xs">
            <div className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
              <div className="font-semibold text-[var(--pm-text-muted)] mb-1">
                {language === 'uz' ? 'Namuna kiritma' : 'Sample Call'}
              </div>
              <code className="font-mono text-[var(--pm-text)]">{exercise.sampleInput}</code>
            </div>
            <div className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3">
              <div className="font-semibold text-[var(--pm-text-muted)] mb-1">
                {language === 'uz' ? 'Kutilgan natija' : 'Expected Return'}
              </div>
              <code className="font-mono text-[var(--pm-secondary)]">{exercise.sampleOutput}</code>
            </div>
          </div>

          <ul className="list-disc pl-5 text-xs text-[var(--pm-text-muted)] space-y-1">
            {exercise.constraints[language].map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <CodeEditor
            value={currentCode}
            onChange={(next) => setCodeMap((p) => ({ ...p, [exercise.id]: next }))}
            theme={theme}
            fontSize={fontSize}
            tabSize={tabSize}
            minHeight="280px"
            onRunShortcut={handleRunVisible}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={handleRunVisible}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] px-4 py-2 text-xs font-medium hover:bg-[var(--pm-card-hover)]"
              >
                <Play className="h-3.5 w-3.5" />
                {t(language, 'exercises.run_tests')}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                {t(language, 'exercises.submit_solution')}
              </button>
            </div>
            <button
              type="button"
              disabled={busy}
              onClick={handleRequestHint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] px-3.5 py-2 text-xs font-medium text-[var(--pm-warning)] hover:bg-[var(--pm-card-hover)]"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {t(language, 'exercises.request_hint')}
            </button>
          </div>
        </div>

        {hint && (
          <div className="rounded-xl border border-[var(--pm-warning)]/40 bg-[var(--pm-card)] p-4 text-sm text-[var(--pm-text)]">
            <div className="mb-1 text-xs font-semibold text-[var(--pm-warning)]">AI Mentor Hint</div>
            <p className="text-sm text-[var(--pm-text-secondary)]">{hint}</p>
          </div>
        )}

        {outcomes && (
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">
                {language === 'uz' ? 'Test natijalari' : 'Test Results'}
              </h3>
              {lastScore !== null && (
                <span className="font-mono text-sm font-semibold tabular-nums text-[var(--pm-secondary)]">
                  {lastScore}%
                </span>
              )}
            </div>

            {stderr && (
              <pre className="rounded-lg bg-[var(--pm-code-bg)] p-3 font-mono text-xs text-[var(--pm-error)] whitespace-pre-wrap">
                {stderr}
              </pre>
            )}

            <div className="divide-y divide-[var(--pm-border)]">
              {outcomes.map((o) => (
                <div key={o.id} className="flex items-start justify-between gap-3 py-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    {o.passed ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--pm-success)] mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-[var(--pm-error)] mt-0.5" />
                    )}
                    <div>
                      <div className="font-mono font-medium text-[var(--pm-text)]">{o.label}</div>
                      {!o.passed && !o.isHidden && (
                        <div className="mt-1 font-mono text-[11px] text-[var(--pm-text-secondary)]">
                          {o.error
                            ? o.error
                            : `Expected ${o.expected}, got ${o.actual || 'None'}`}
                        </div>
                      )}
                      {!o.passed && o.isHidden && o.error && (
                        <div className="mt-1 text-[11px] text-[var(--pm-error)]">{o.error}</div>
                      )}
                    </div>
                  </div>
                  <span className={o.passed ? 'text-[var(--pm-success)]' : 'text-[var(--pm-error)]'}>
                    {o.passed ? 'PASS' : 'FAIL'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ExaminationsScreen({
  token,
  language,
  initialExamId,
  onAchievementUnlocked,
}: {
  token: string;
  language: Language;
  initialExamId?: string | null;
  onAchievementUnlocked: () => Promise<void>;
}) {
  const [attempts, setAttempts] = useState<
    Array<{ id: number; examination_id: string; score: number; passed: number; completed_at: string }>
  >([]);
  const [activeExamId, setActiveExamId] = useState<string | null>(initialExamId ?? null);
  const [inProgress, setInProgress] = useState(false);
  const [startedAt, setStartedAt] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
    breakdown: Array<{ questionId: string; selectedIndex: number; correctIndex: number; isCorrect: boolean }>;
  } | null>(null);

  const loadAttempts = async () => {
    const res = await apiRequest<{
      attempts: Array<{ id: number; examination_id: string; score: number; passed: number; completed_at: string }>;
    }>('/api/exams/attempts', { token });
    setAttempts(res.attempts);
  };

  useEffect(() => {
    loadAttempts();
  }, [token]);

  useEffect(() => {
    if (!inProgress || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [inProgress, secondsLeft]);

  const activeExam = activeExamId ? EXAMINATIONS.find((e) => e.id === activeExamId) : null;

  const startExam = (examId: string) => {
    const ex = EXAMINATIONS.find((e) => e.id === examId);
    if (!ex) return;
    setActiveExamId(examId);
    setAnswers({});
    setResult(null);
    setCurrentIdx(0);
    setConfirmSubmit(false);
    setStartedAt(new Date().toISOString());
    setSecondsLeft(ex.durationMinutes * 60);
    setInProgress(true);
  };

  const submitExam = async () => {
    if (!activeExam) return;
    setInProgress(false);
    setConfirmSubmit(false);
    const res = await apiRequest<{
      score: number;
      passed: boolean;
      correctCount: number;
      totalCount: number;
      breakdown: Array<{ questionId: string; selectedIndex: number; correctIndex: number; isCorrect: boolean }>;
      unlockedAchievement: string | null;
    }>(`/api/exams/${activeExam.id}/submit`, {
      method: 'POST',
      token,
      body: { answers, startedAt },
    });
    setResult(res);
    await loadAttempts();
    if (res.unlockedAchievement) {
      await onAchievementUnlocked();
    }
  };

  if (activeExam && inProgress) {
    const q = activeExam.questions[currentIdx];
    const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const secs = String(secondsLeft % 60).padStart(2, '0');

    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] px-5 py-3">
          <div>
            <h2 className="font-display text-base font-bold">{activeExam.title[language]}</h2>
            <div className="text-xs text-[var(--pm-text-muted)]">
              {currentIdx + 1} / {activeExam.questions.length}
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums text-[var(--pm-warning)]">
            <Clock className="h-4 w-4" />
            {mins}:{secs}
          </div>
        </div>

        {/* Question navigation strip */}
        <div className="flex flex-wrap gap-2">
          {activeExam.questions.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`h-8 w-8 rounded-lg font-mono text-xs font-semibold tabular-nums border transition-colors ${
                idx === currentIdx
                  ? 'border-[var(--pm-primary)] bg-[var(--pm-primary)] text-white'
                  : answers[item.id] !== undefined
                  ? 'border-[var(--pm-secondary)]/50 bg-[var(--pm-primary)]/15 text-[var(--pm-text)]'
                  : 'border-[var(--pm-border)] bg-[var(--pm-card)] text-[var(--pm-text-muted)]'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-4">
          <p className="text-base font-medium text-[var(--pm-text)]">{q.prompt[language]}</p>
          {q.codeSnippet && (
            <pre className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-code-bg)] p-3.5 font-mono text-xs text-[var(--pm-text)]">
              {q.codeSnippet}
            </pre>
          )}
          <div className="space-y-2">
            {q.options[language].map((opt, optIdx) => (
              <button
                key={optIdx}
                type="button"
                onClick={() => setAnswers((p) => ({ ...p, [q.id]: optIdx }))}
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  answers[q.id] === optIdx
                    ? 'border-[var(--pm-primary)] bg-[var(--pm-primary)]/15 text-[var(--pm-text)]'
                    : 'border-[var(--pm-border)] bg-[var(--pm-bg)] text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => i - 1)}
            className="rounded-lg border border-[var(--pm-border)] px-4 py-2 text-xs font-medium disabled:opacity-40"
          >
            {t(language, 'lesson.previous')}
          </button>

          <div className="flex items-center gap-2">
            {currentIdx < activeExam.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => i + 1)}
                className="rounded-lg bg-[var(--pm-primary)] px-4 py-2 text-xs font-semibold text-white"
              >
                {t(language, 'lesson.next')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmSubmit(true)}
                className="rounded-lg bg-[var(--pm-primary)] px-5 py-2 text-xs font-semibold text-white"
              >
                {t(language, 'common.submit')}
              </button>
            )}
          </div>
        </div>

        {confirmSubmit && (
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 flex items-center justify-between gap-4">
            <span className="text-sm">
              {language === 'uz'
                ? 'Imtihonni yakunlab natijani hisoblaymizmi?'
                : 'Submit all answers and grade the examination?'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmSubmit(false)}
                className="rounded-lg border border-[var(--pm-border)] px-3 py-1.5 text-xs"
              >
                {t(language, 'common.cancel')}
              </button>
              <button
                type="button"
                onClick={submitExam}
                className="rounded-lg bg-[var(--pm-primary)] px-4 py-1.5 text-xs font-semibold text-white"
              >
                {t(language, 'common.submit')}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">{t(language, 'nav.examinations')}</h1>
        <p className="text-sm text-[var(--pm-text-secondary)]">
          {language === 'uz'
            ? "Har bir bosqich yakunida bilimingizni vaqt bilan cheklangan avtomatik imtihonda tekshiring."
            : 'Verify mastery at each stage with timed automated checkpoint examinations.'}
        </p>
      </div>

      {result && activeExam && (
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--pm-border)] pb-4">
            <div>
              <div className="text-xs text-[var(--pm-text-muted)]">{activeExam.title[language]}</div>
              <h2 className="font-display text-xl font-bold">
                {result.passed
                  ? language === 'uz' ? "Tabriklaymiz, imtihondan o'tdingiz!" : 'Passed!'
                  : language === 'uz' ? "Qayta tayyorlanib urinib ko'ring" : 'Review weak concepts and retry'}
              </h2>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl font-bold tabular-nums text-[var(--pm-secondary)]">
                {result.score}%
              </div>
              <div className="text-xs text-[var(--pm-text-muted)]">
                {result.correctCount} / {result.totalCount}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {activeExam.questions.map((q, idx) => {
              const b = result.breakdown.find((item) => item.questionId === q.id);
              return (
                <div key={q.id} className="rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-3.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--pm-text)]">
                      {idx + 1}. {q.prompt[language]}
                    </span>
                    <span className={b?.isCorrect ? 'text-[var(--pm-success)]' : 'text-[var(--pm-error)]'}>
                      {b?.isCorrect ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <p className="text-[var(--pm-text-secondary)]">{q.explanation[language]}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {EXAMINATIONS.map((exam) => (
          <div
            key={exam.id}
            className="flex flex-col justify-between rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-4"
          >
            <div className="space-y-2">
              <div className="text-xs text-[var(--pm-text-muted)]">
                {t(language, `common.${exam.difficulty}`)} · {exam.durationMinutes} {t(language, 'common.minutes')} ·{' '}
                {exam.questions.length} {language === 'uz' ? 'savol' : 'questions'}
              </div>
              <h3 className="font-display text-lg font-semibold">{exam.title[language]}</h3>
              <p className="text-sm text-[var(--pm-text-secondary)]">{exam.description[language]}</p>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--pm-border)] pt-3">
              <span className="font-mono text-xs text-[var(--pm-text-muted)]">
                {language === 'uz' ? "O'tish bali:" : 'Pass:'} {exam.passingScore}%
              </span>
              <button
                type="button"
                onClick={() => startExam(exam.id)}
                className="rounded-lg bg-[var(--pm-primary)] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
              >
                {t(language, 'common.start')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {attempts.length > 0 && (
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] overflow-hidden">
          <div className="border-b border-[var(--pm-border)] px-5 py-3 font-display text-sm font-semibold">
            {language === 'uz' ? 'Imtihon urinishlari tarixi' : 'Examination History'}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--pm-border)] text-[var(--pm-text-muted)]">
                <tr>
                  <th className="px-5 py-2.5">Exam ID</th>
                  <th className="px-5 py-2.5">Score</th>
                  <th className="px-5 py-2.5">Status</th>
                  <th className="px-5 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--pm-border)]">
                {attempts.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-2.5 font-mono">{a.examination_id}</td>
                    <td className="px-5 py-2.5 font-mono tabular-nums">{a.score}%</td>
                    <td className="px-5 py-2.5">
                      <span className={a.passed ? 'text-[var(--pm-success)]' : 'text-[var(--pm-error)]'}>
                        {a.passed ? 'PASSED' : 'RETRY'}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 font-mono text-[var(--pm-text-muted)]">{a.completed_at.slice(0, 16)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
