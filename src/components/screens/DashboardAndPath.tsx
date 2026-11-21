import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Lock,
  PlayCircle,
  Search,
  Target,
} from 'lucide-react';
import { COURSES, LESSONS, getLessonsForCourse } from '../../data/curriculum';
import { EXERCISES } from '../../data/exercises';
import { ACHIEVEMENTS, NINETY_DAY_PROGRAM } from '../../data/exams_and_projects';
import { t } from '../../data/localization';
import type { Course, Difficulty, Language, ScreenId, UserSummary } from '../../types/domain';

export interface DashboardData {
  stats: {
    streakDays: number;
    completedLessonsCount: number;
    totalStudyMinutes: number;
    todayStudyMinutes: number;
    averageScore: number;
    exerciseSuccessRate: number;
    solvedExercisesCount: number;
    examsPassedCount: number;
  };
  weeklyActivity: Array<{ date: string; label: string; minutes: number }>;
  mastery: Array<{ concept_id: string; mastery_level: number }>;
  weakTopics: Array<{ concept_id: string; mastery_level: number }>;
  achievements: Array<{ achievement_id: string; unlocked_at: string }>;
  lastCompletedLessonId: string | null;
}

export function DashboardScreen({
  user,
  dashboard,
  completedLessonIds,
  onNavigate,
  onOpenLesson,
  onOpenExercise,
}: {
  user: UserSummary;
  dashboard: DashboardData | null;
  completedLessonIds: Set<string>;
  onNavigate: (screen: ScreenId) => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenExercise: (exerciseId: string) => void;
}) {
  const lang = user.preferredLanguage;
  const hour = new Date().getHours();
  const greeting =
    lang === 'uz'
      ? hour < 12
        ? 'Xayrli tong'
        : hour < 18
        ? 'Xayrli kun'
        : 'Xayrli kech'
      : hour < 12
      ? 'Good morning'
      : hour < 18
      ? 'Good afternoon'
      : 'Good evening';

  const nextLesson =
    LESSONS.find((l) => !completedLessonIds.has(l.id)) ?? LESSONS[0];
  const nextCourse = COURSES.find((c) => c.id === nextLesson.courseId) ?? COURSES[0];

  const stats = dashboard?.stats ?? {
    streakDays: 0,
    completedLessonsCount: completedLessonIds.size,
    totalStudyMinutes: 0,
    todayStudyMinutes: 0,
    averageScore: 0,
    exerciseSuccessRate: 0,
    solvedExercisesCount: 0,
    examsPassedCount: 0,
  };

  const dailyPct = Math.min(
    100,
    Math.round((stats.todayStudyMinutes / Math.max(1, user.dailyGoalMinutes)) * 100),
  );
  const weekly = dashboard?.weeklyActivity ?? [];
  const maxWeekly = Math.max(30, ...weekly.map((d) => d.minutes));

  const studyHours = (stats.totalStudyMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--pm-text)] sm:text-3xl">
            {greeting}, {user.displayName}
          </h1>
          <p className="text-sm text-[var(--pm-text-secondary)]">
            {lang === 'uz'
              ? `${nextCourse.number}-kurs · ${nextCourse.title.uz} yo'nalishida davom eting`
              : `Continue your path in Course ${nextCourse.number} · ${nextCourse.title.en}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenLesson(nextLesson.id)}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--pm-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors whitespace-nowrap shrink-0"
        >
          {t(lang, 'dashboard.continue_learning')}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* 4 KPI Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--pm-text-muted)]">
            <span>{t(lang, 'dashboard.streak')}</span>
            <Flame className="h-4 w-4 text-[var(--pm-warning)]" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[var(--pm-text)]">
            {stats.streakDays} {lang === 'uz' ? 'kun' : 'days'}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--pm-text-muted)]">
            <span>{t(lang, 'dashboard.completed_lessons')}</span>
            <BookOpen className="h-4 w-4 text-[var(--pm-secondary)]" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[var(--pm-text)]">
            {stats.completedLessonsCount} / {LESSONS.length}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--pm-text-muted)]">
            <span>{t(lang, 'dashboard.study_hours')}</span>
            <Clock className="h-4 w-4 text-[var(--pm-info)]" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[var(--pm-text)]">
            {studyHours} {t(lang, 'common.hours')}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4">
          <div className="flex items-center justify-between text-xs text-[var(--pm-text-muted)]">
            <span>{t(lang, 'dashboard.avg_score')}</span>
            <Target className="h-4 w-4 text-[var(--pm-secondary)]" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[var(--pm-text)]">
            {stats.averageScore}%
          </div>
        </div>
      </div>

      {/* Main Split: Continue Card + Weekly Activity */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-[var(--pm-text-muted)]">
              <span>{t(lang, 'dashboard.continue_learning')}</span>
              <span>
                {nextLesson.id} · {nextLesson.estimatedMinutes} {t(lang, 'common.minutes')}
              </span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--pm-text)]">
                {nextLesson.title[lang]}
              </h2>
              <p className="mt-1 text-sm text-[var(--pm-text-secondary)]">
                {nextCourse.title[lang]} — {nextCourse.description[lang]}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onOpenLesson(nextLesson.id)}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--pm-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
                {t(lang, 'common.continue')}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('code_lab')}
                className="rounded-lg border border-[var(--pm-border)] px-4 py-2 text-sm font-medium text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)] transition-colors"
              >
                {t(lang, 'nav.code_lab')}
              </button>
            </div>
          </div>

          {/* Daily Goal */}
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[var(--pm-text)]">{t(lang, 'dashboard.daily_goal')}</span>
              <span className="font-mono text-xs tabular-nums text-[var(--pm-text-secondary)]">
                {stats.todayStudyMinutes} / {user.dailyGoalMinutes} {t(lang, 'common.minutes')} ({dailyPct}%)
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--pm-bg)]">
              <div
                className="h-full rounded-full bg-[var(--pm-primary)] transition-all duration-300"
                style={{ width: `${dailyPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 7-day SVG Activity Chart */}
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-[var(--pm-text)]">
              {t(lang, 'dashboard.weekly_activity')}
            </h3>
            <span className="text-xs text-[var(--pm-text-muted)]">
              {lang === 'uz' ? "So'nggi 7 kun (daqiqa)" : 'Last 7 days (min)'}
            </span>
          </div>

          <div className="flex h-44 items-end gap-2.5 pt-4">
            {weekly.map((day) => {
              const heightPct = Math.max(6, Math.round((day.minutes / maxWeekly) * 100));
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                  <span className="font-mono text-[11px] tabular-nums text-[var(--pm-text-muted)]">
                    {day.minutes}
                  </span>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t bg-[var(--pm-primary)]/85 hover:bg-[var(--pm-secondary)] transition-colors"
                      style={{ height: `${heightPct}%` }}
                      title={`${day.date}: ${day.minutes} min`}
                    />
                  </div>
                  <span className="font-mono text-[11px] tabular-nums text-[var(--pm-text-muted)]">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recommended Exercises + Weak Topics + Achievements */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
          <h3 className="font-display text-base font-semibold">{t(lang, 'dashboard.recommended_exercises')}</h3>
          <div className="divide-y divide-[var(--pm-border)]">
            {EXERCISES.slice(0, 3).map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => onOpenExercise(ex.id)}
                className="flex w-full items-center justify-between py-2.5 text-left hover:text-[var(--pm-secondary)] transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="truncate text-sm font-medium text-[var(--pm-text)]">{ex.title[lang]}</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">
                    {t(lang, `common.${ex.difficulty}`)} · {ex.estimatedMinutes} {t(lang, 'common.minutes')}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--pm-text-muted)]" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
          <h3 className="font-display text-base font-semibold">{t(lang, 'dashboard.weak_topics')}</h3>
          {dashboard && dashboard.weakTopics.length > 0 ? (
            <div className="space-y-2.5">
              {dashboard.weakTopics.map((wt) => (
                <div key={wt.concept_id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[var(--pm-text)]">{wt.concept_id}</span>
                    <span className="font-mono tabular-nums text-[var(--pm-warning)]">{wt.mastery_level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--pm-bg)]">
                    <div
                      className="h-full rounded-full bg-[var(--pm-warning)]"
                      style={{ width: `${wt.mastery_level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--pm-text-muted)]">
              {lang === 'uz'
                ? "Dars testlari va mashqlarni topshirganingizda zaif mavzular shu yerda ko'rinadi."
                : 'Complete quizzes and exercises to surface topics that need extra practice.'}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">{t(lang, 'dashboard.recent_achievements')}</h3>
            <button
              type="button"
              onClick={() => onNavigate('achievements')}
              className="text-xs font-medium text-[var(--pm-secondary)] hover:underline"
            >
              {lang === 'uz' ? 'Barchasi' : 'View all'}
            </button>
          </div>
          {dashboard && dashboard.achievements.length > 0 ? (
            <div className="space-y-2.5">
              {dashboard.achievements.slice(0, 3).map((ua) => {
                const def = ACHIEVEMENTS.find((a) => a.id === ua.achievement_id);
                if (!def) return null;
                return (
                  <div key={ua.achievement_id} className="flex items-center gap-3">
                    <Award className="h-4 w-4 shrink-0 text-[var(--pm-secondary)]" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[var(--pm-text)]">{def.title[lang]}</div>
                      <div className="truncate text-xs text-[var(--pm-text-muted)]">{def.description[lang]}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--pm-text-muted)]">
              {lang === 'uz'
                ? "Ilk kodingizni ishga tushiring yoki birinchi darsni tugallang!"
                : 'Run your first Python program or finish a lesson to unlock achievements.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function LearningPathScreen({
  language,
  completedLessonIds,
  onOpenCourse,
  onOpenExam,
}: {
  language: Language;
  completedLessonIds: Set<string>;
  onOpenCourse: (courseId: string) => void;
  onOpenExam: (examId: string) => void;
}) {
  const [tab, setTab] = useState<'roadmap' | '90day'>('roadmap');

  const courseCompletionMap = useMemo(() => {
    const map = new Map<string, { done: number; total: number; pct: number }>();
    for (const c of COURSES) {
      const lessons = getLessonsForCourse(c.id);
      const done = lessons.filter((l) => completedLessonIds.has(l.id)).length;
      const pct = lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;
      map.set(c.id, { done, total: lessons.length, pct });
    }
    return map;
  }, [completedLessonIds]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t(language, 'nav.learning_path')}</h1>
          <p className="text-sm text-[var(--pm-text-secondary)]">
            {language === 'uz'
              ? "17 bosqichli universal dastur va 90 kunlik intensiv o'quv rejasi"
              : '17-course mastery roadmap and structured 90-day intensive schedule'}
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] p-1">
          <button
            type="button"
            onClick={() => setTab('roadmap')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              tab === 'roadmap'
                ? 'bg-[var(--pm-primary)] text-white'
                : 'text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]'
            }`}
          >
            {language === 'uz' ? '17 Kurs Xaritasi' : '17-Course Roadmap'}
          </button>
          <button
            type="button"
            onClick={() => setTab('90day')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              tab === '90day'
                ? 'bg-[var(--pm-primary)] text-white'
                : 'text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]'
            }`}
          >
            {language === 'uz' ? '90 Kunlik Dastur' : '90-Day Intensive'}
          </button>
        </div>
      </div>

      {tab === 'roadmap' ? (
        <div className="space-y-3">
          {COURSES.map((course) => {
            const prog = courseCompletionMap.get(course.id) ?? { done: 0, total: 0, pct: 0 };
            const prereqsMet = course.prerequisites.every(
              (pid) => (courseCompletionMap.get(pid)?.pct ?? 0) === 100,
            );
            const state =
              prog.pct === 100
                ? 'completed'
                : prog.done > 0
                ? 'in_progress'
                : prereqsMet
                ? 'available'
                : 'locked';

            return (
              <div
                key={course.id}
                className="flex flex-col gap-4 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-semibold tabular-nums ${
                      state === 'completed'
                        ? 'bg-[var(--pm-primary)] text-white'
                        : state === 'locked'
                        ? 'bg-[var(--pm-bg)] text-[var(--pm-text-muted)] border border-[var(--pm-border)]'
                        : 'bg-[var(--pm-primary)]/15 text-[var(--pm-secondary)] border border-[var(--pm-primary)]/40'
                    }`}
                  >
                    {String(course.number).padStart(2, '0')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-semibold text-[var(--pm-text)]">
                        {course.title[language]}
                      </h3>
                      <span className="text-xs text-[var(--pm-text-muted)]">
                        · {t(language, `common.${course.difficulty}`)} · {prog.done}/{prog.total} {t(language, 'common.lessons')}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--pm-text-secondary)]">{course.description[language]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-28 space-y-1">
                    <div className="flex justify-between font-mono text-xs tabular-nums text-[var(--pm-text-muted)]">
                      <span>{t(language, `common.${state}`)}</span>
                      <span>{prog.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--pm-bg)]">
                      <div
                        className="h-full rounded-full bg-[var(--pm-primary)]"
                        style={{ width: `${prog.pct}%` }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenCourse(course.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3.5 py-2 text-xs font-medium text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors whitespace-nowrap"
                  >
                    {state === 'locked' && <Lock className="h-3.5 w-3.5 text-[var(--pm-text-muted)]" />}
                    {state === 'completed' ? <CheckCircle2 className="h-3.5 w-3.5 text-[var(--pm-success)]" /> : null}
                    {language === 'uz' ? 'Ochish' : 'Open'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {NINETY_DAY_PROGRAM.map((stage) => (
            <div
              key={stage.phase}
              className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-3"
            >
              <div className="flex items-center justify-between text-xs text-[var(--pm-text-muted)]">
                <span className="inline-flex items-center gap-1.5 font-mono text-[var(--pm-secondary)]">
                  <Calendar className="h-3.5 w-3.5" />
                  {language === 'uz' ? `${stage.daysRange}-kunlar` : `Days ${stage.daysRange}`}
                </span>
                <span>~{15} {t(language, 'common.hours')}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--pm-text)]">
                {stage.title[language]}
              </h3>
              <p className="text-sm text-[var(--pm-text-secondary)]">{stage.focus[language]}</p>
              <div className="border-t border-[var(--pm-border)] pt-3 text-xs text-[var(--pm-text-muted)]">
                {stage.milestoneDeliverable[language]}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenCourse(stage.courseIds[0])}
                  className="rounded-lg bg-[var(--pm-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
                >
                  {language === 'uz' ? 'Kursni ochish' : 'Open Course'}
                </button>
                {stage.checkpointExamId && (
                  <button
                    type="button"
                    onClick={() => onOpenExam(stage.checkpointExamId!)}
                    className="rounded-lg border border-[var(--pm-border)] px-3 py-1.5 text-xs font-medium text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)]"
                  >
                    {language === 'uz' ? 'Nazorat imtihoni' : 'Checkpoint Exam'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CoursesScreen({
  language,
  completedLessonIds,
  selectedCourseId,
  onSelectCourse,
  onOpenLesson,
}: {
  language: Language;
  completedLessonIds: Set<string>;
  selectedCourseId: string | null;
  onSelectCourse: (courseId: string | null) => void;
  onOpenLesson: (lessonId: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all');
  const [category, setCategory] = useState<'all' | Course['category']>('all');

  const selectedCourse = selectedCourseId ? COURSES.find((c) => c.id === selectedCourseId) : null;

  if (selectedCourse) {
    const courseLessons = getLessonsForCourse(selectedCourse.id);
    const doneCount = courseLessons.filter((l) => completedLessonIds.has(l.id)).length;
    const pct = courseLessons.length > 0 ? Math.round((doneCount / courseLessons.length) * 100) : 0;

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => onSelectCourse(null)}
          className="text-sm font-medium text-[var(--pm-secondary)] hover:underline"
        >
          ← {language === 'uz' ? 'Barcha kurslarga qaytish' : 'Back to course catalog'}
        </button>

        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-[var(--pm-text-muted)]">
                {language === 'uz' ? `${selectedCourse.number}-kurs` : `Course ${selectedCourse.number}`} ·{' '}
                {t(language, `common.${selectedCourse.difficulty}`)} · {selectedCourse.estimatedHours}{' '}
                {t(language, 'common.hours')}
              </div>
              <h1 className="font-display text-2xl font-bold">{selectedCourse.title[language]}</h1>
              <p className="max-w-2xl text-sm text-[var(--pm-text-secondary)]">
                {selectedCourse.description[language]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = courseLessons.find((l) => !completedLessonIds.has(l.id)) ?? courseLessons[0];
                if (next) onOpenLesson(next.id);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--pm-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors whitespace-nowrap"
            >
              {doneCount > 0 ? t(language, 'common.continue') : t(language, 'common.start')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-[var(--pm-text-muted)]">
              <span>{language === 'uz' ? 'Kurs progressi' : 'Course completion'}</span>
              <span className="font-mono tabular-nums">
                {doneCount}/{courseLessons.length} ({pct}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--pm-bg)]">
              <div className="h-full rounded-full bg-[var(--pm-primary)]" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="border-t border-[var(--pm-border)] pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--pm-text-muted)] mb-2">
              {t(language, 'lesson.objectives')}
            </h3>
            <ul className="grid gap-1.5 sm:grid-cols-2 text-sm text-[var(--pm-text-secondary)]">
              {selectedCourse.objectives[language].map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pm-secondary)]" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {selectedCourse.modules.map((mod) => {
            const modLessons = courseLessons.filter((l) => l.moduleId === mod.id);
            return (
              <div
                key={mod.id}
                className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] overflow-hidden"
              >
                <div className="border-b border-[var(--pm-border)] bg-[var(--pm-sidebar)] px-5 py-3 font-display text-base font-semibold">
                  {mod.title[language]}
                </div>
                <div className="divide-y divide-[var(--pm-border)]">
                  {modLessons.map((lesson) => {
                    const isDone = completedLessonIds.has(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => onOpenLesson(lesson.id)}
                        className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-[var(--pm-card-hover)] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CheckCircle2
                            className={`h-4 w-4 shrink-0 ${
                              isDone ? 'text-[var(--pm-success)]' : 'text-[var(--pm-text-muted)]'
                            }`}
                          />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-[var(--pm-text)]">
                              {lesson.title[language]}
                            </div>
                            <div className="text-xs text-[var(--pm-text-muted)]">
                              {lesson.id} · {lesson.estimatedMinutes} {t(language, 'common.minutes')}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--pm-text-muted)]" />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const filteredCourses = COURSES.filter((c) => {
    const matchesQuery =
      !query.trim() ||
      c.title[language].toLowerCase().includes(query.toLowerCase()) ||
      c.description[language].toLowerCase().includes(query.toLowerCase());
    const matchesDiff = difficulty === 'all' || c.difficulty === difficulty;
    const matchesCat = category === 'all' || c.category === category;
    return matchesQuery && matchesDiff && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{t(language, 'nav.courses')}</h1>
          <p className="text-sm text-[var(--pm-text-secondary)]">
            {language === 'uz'
              ? 'Mutlaqo noldan professional darajagacha barcha 17 ta Python kursi'
              : 'All 17 comprehensive Python courses from zero to production engineering'}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--pm-text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(language, 'common.search')}
            className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] pl-9 pr-3 py-2 text-sm focus:border-[var(--pm-primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Interactive filter controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] p-1">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                difficulty === d
                  ? 'bg-[var(--pm-primary)] text-white'
                  : 'text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]'
              }`}
            >
              {d === 'all' ? (language === 'uz' ? 'Barchasi' : 'All levels') : t(language, `common.${d}`)}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] p-1">
          {(
            [
              { id: 'all', uz: 'Barcha yo‘nalishlar', en: 'All tracks' },
              { id: 'core', uz: 'Asosiy Python', en: 'Core Python' },
              { id: 'engineering', uz: 'Muhandislik', en: 'Engineering' },
              { id: 'backend', uz: 'Backend & DB', en: 'Backend & DB' },
              { id: 'data_ai', uz: 'Data & AI', en: 'Data & AI' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                category === cat.id
                  ? 'bg-[var(--pm-primary)] text-white'
                  : 'text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]'
              }`}
            >
              {cat[language]}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-10 text-center text-sm text-[var(--pm-text-muted)]">
          {t(language, 'common.no_results')}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => {
            const lessons = getLessonsForCourse(course.id);
            const done = lessons.filter((l) => completedLessonIds.has(l.id)).length;
            const pct = lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => onSelectCourse(course.id)}
                className="flex flex-col justify-between rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 text-left hover:bg-[var(--pm-card-hover)] transition-colors space-y-4"
              >
                <div className="space-y-2">
                  <div className="text-xs text-[var(--pm-text-muted)]">
                    {String(course.number).padStart(2, '0')} · {t(language, `common.${course.difficulty}`)} ·{' '}
                    {course.estimatedHours} {t(language, 'common.hours')}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[var(--pm-text)]">
                    {course.title[language]}
                  </h3>
                  <p className="text-sm text-[var(--pm-text-secondary)] line-clamp-2">
                    {course.description[language]}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-xs tabular-nums text-[var(--pm-text-muted)]">
                    <span>
                      {done}/{lessons.length} {t(language, 'common.lessons')}
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--pm-bg)]">
                    <div
                      className="h-full rounded-full bg-[var(--pm-primary)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
