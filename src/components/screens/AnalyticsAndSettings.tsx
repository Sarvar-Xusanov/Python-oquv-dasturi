import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  FileText,
  Flame,
  FolderGit2,
  Layers,
  Printer,
  Terminal,
  Upload,
} from 'lucide-react';
import { COURSES, LESSONS, getLessonsForCourse } from '../../data/curriculum';
import { ACHIEVEMENTS } from '../../data/exams_and_projects';
import { t } from '../../data/localization';
import { apiRequest } from '../../lib/api';
import type { Language, ThemeMode, UserSummary } from '../../types/domain';
import type { DashboardData } from './DashboardAndPath';

export function AnalyticsScreen({
  language,
  dashboard,
  completedLessonIds,
}: {
  language: Language;
  dashboard: DashboardData | null;
  completedLessonIds: Set<string>;
}) {
  const stats = dashboard?.stats ?? {
    streakDays: 0,
    completedLessonsCount: 0,
    totalStudyMinutes: 0,
    todayStudyMinutes: 0,
    averageScore: 0,
    exerciseSuccessRate: 0,
    solvedExercisesCount: 0,
    examsPassedCount: 0,
  };

  const handleExportCsv = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Completed Lessons', `${stats.completedLessonsCount}/${LESSONS.length}`],
      ['Total Study Minutes', String(stats.totalStudyMinutes)],
      ['Average Score (%)', String(stats.averageScore)],
      ['Exercise Success Rate (%)', String(stats.exerciseSuccessRate)],
      ['Solved Exercises', String(stats.solvedExercisesCount)],
      ['Exams Passed', String(stats.examsPassedCount)],
      ['Streak Days', String(stats.streakDays)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'python_mastery_analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{t(language, 'nav.analytics')}</h1>
          <p className="text-sm text-[var(--pm-text-secondary)]">
            {language === 'uz'
              ? "Haqiqiy ma'lumotlar bazasiga asoslangan o'zlashtirish ko'rsatkichlaringiz."
              : 'Real database-backed learning telemetry, topic mastery, and exportable reports.'}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] px-3.5 py-2 text-xs font-medium hover:bg-[var(--pm-card-hover)]"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-3.5 py-2 text-xs font-semibold text-white"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4">
          <div className="text-xs text-[var(--pm-text-muted)]">{t(language, 'dashboard.study_hours')}</div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">
            {(stats.totalStudyMinutes / 60).toFixed(1)} h
          </div>
        </div>
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4">
          <div className="text-xs text-[var(--pm-text-muted)]">
            {language === 'uz' ? 'Mashqlar muvaffaqiyati' : 'Exercise Success'}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{stats.exerciseSuccessRate}%</div>
        </div>
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4">
          <div className="text-xs text-[var(--pm-text-muted)]">
            {language === 'uz' ? 'Yechilgan mashqlar' : 'Exercises Solved'}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{stats.solvedExercisesCount}</div>
        </div>
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4">
          <div className="text-xs text-[var(--pm-text-muted)]">
            {language === 'uz' ? "O'tilgan imtihonlar" : 'Exams Passed'}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{stats.examsPassedCount}</div>
        </div>
      </div>

      {/* Topic Mastery + Course Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-4">
          <h2 className="font-display text-base font-semibold">
            {language === 'uz' ? "Mavzular bo'yicha o'zlashtirish" : 'Topic Mastery'}
          </h2>
          {dashboard && dashboard.mastery.length > 0 ? (
            <div className="space-y-3">
              {dashboard.mastery.map((m) => (
                <div key={m.concept_id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{m.concept_id}</span>
                    <span className="font-mono tabular-nums text-[var(--pm-secondary)]">{m.mastery_level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--pm-bg)]">
                    <div
                      className="h-full rounded-full bg-[var(--pm-primary)]"
                      style={{ width: `${m.mastery_level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--pm-text-muted)]">
              {language === 'uz'
                ? "Dars testlari, mashqlar va imtihonlardan o'tganingiz sari grafik to'lib boradi."
                : 'Complete lesson quizzes, exercises, and exams to populate topic mastery.'}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-5 space-y-4">
          <h2 className="font-display text-base font-semibold">
            {language === 'uz' ? 'Kurslar kesimida progress' : 'Course Progress Breakdown'}
          </h2>
          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {COURSES.map((c) => {
              const ls = getLessonsForCourse(c.id);
              const done = ls.filter((l) => completedLessonIds.has(l.id)).length;
              const pct = ls.length > 0 ? Math.round((done / ls.length) * 100) : 0;
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="truncate pr-2">{c.title[language]}</span>
                    <span className="font-mono tabular-nums text-[var(--pm-text-muted)]">
                      {done}/{ls.length} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--pm-bg)]">
                    <div className="h-full rounded-full bg-[var(--pm-primary)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const ICON_MAP: Record<string, typeof Award> = {
  Terminal,
  BookOpen: FileText,
  Layers,
  CheckCircle2,
  Award,
  FolderGit2,
  FileText,
  Flame,
};

export function AchievementsScreen({
  language,
  unlocked,
}: {
  language: Language;
  unlocked: Array<{ achievement_id: string; unlocked_at: string }>;
}) {
  const unlockedMap = new Map(unlocked.map((u) => [u.achievement_id, u.unlocked_at]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">{t(language, 'nav.achievements')}</h1>
        <p className="text-sm text-[var(--pm-text-secondary)]">
          {language === 'uz'
            ? `Ochilgan yutuqlar: ${unlocked.length} / ${ACHIEVEMENTS.length}`
            : `Unlocked achievements: ${unlocked.length} / ${ACHIEVEMENTS.length}`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACHIEVEMENTS.map((ach) => {
          const unlockedAt = unlockedMap.get(ach.id);
          const Icon = ICON_MAP[ach.iconName] ?? Award;
          return (
            <div
              key={ach.id}
              className={`rounded-xl border p-5 space-y-3 ${
                unlockedAt
                  ? 'border-[var(--pm-primary)]/60 bg-[var(--pm-card)]'
                  : 'border-[var(--pm-border)] bg-[var(--pm-card)] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    unlockedAt
                      ? 'bg-[var(--pm-primary)] text-white'
                      : 'bg-[var(--pm-bg)] text-[var(--pm-text-muted)]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {unlockedAt && (
                  <span className="font-mono text-[11px] text-[var(--pm-success)]">
                    {unlockedAt.slice(0, 10)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">{ach.title[language]}</h3>
                <p className="mt-1 text-xs text-[var(--pm-text-secondary)]">{ach.description[language]}</p>
              </div>
              <div className="border-t border-[var(--pm-border)] pt-2 text-[11px] text-[var(--pm-text-muted)]">
                {ach.criteriaText[language]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SettingsScreen({
  token,
  user,
  language,
  theme,
  healthInfo,
  onUserUpdated,
}: {
  token: string;
  user: UserSummary;
  language: Language;
  theme: ThemeMode;
  healthInfo: { pythonVersion: string; geminiModel: string; geminiConfigured: boolean; dbPath: string; dbSizeBytes: number } | null;
  onUserUpdated: (user: UserSummary) => void;
}) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [nextLang, setNextLang] = useState<Language>(language);
  const [nextTheme, setNextTheme] = useState<ThemeMode>(theme);
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoalMinutes);
  const [fontSize, setFontSize] = useState(user.editorFontSize);
  const [tabSize, setTabSize] = useState(user.editorTabSize);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiRequest<{ user: UserSummary }>('/api/settings', {
      method: 'PUT',
      token,
      body: {
        displayName,
        preferredLanguage: nextLang,
        theme: nextTheme,
        dailyGoalMinutes: dailyGoal,
        editorFontSize: fontSize,
        editorTabSize: tabSize,
      },
    });
    onUserUpdated(res.user);
    setStatusMsg(language === 'uz' ? 'Sozlamalar saqlandi.' : 'Settings saved.');
    setTimeout(() => setStatusMsg(null), 2200);
  };

  const handleExportBackup = async () => {
    const data = await apiRequest<Record<string, unknown>>('/api/backup/export', { token });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `python_mastery_backup_${user.username}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await apiRequest('/api/backup/restore', { method: 'POST', token, body: parsed });
      setStatusMsg(language === 'uz' ? 'Zaxira nusxasi tiklandi!' : 'Backup restored successfully!');
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : 'Restore failed');
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">{t(language, 'settings.title')}</h1>
        <p className="text-sm text-[var(--pm-text-secondary)]">
          {language === 'uz'
            ? 'Profil, muharrir, til, mavzu va maʼlumotlar bazasi zaxira sozlamalari.'
            : 'Customize language, theme, code editor behavior, and backup/restore.'}
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--pm-text-secondary)]">{t(language, 'auth.display_name')}</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--pm-text-secondary)]">{t(language, 'settings.language')}</label>
            <select
              value={nextLang}
              onChange={(e) => setNextLang(e.target.value as Language)}
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm"
            >
              <option value="uz">O&apos;zbekcha (Uzbek)</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--pm-text-secondary)]">{t(language, 'settings.theme')}</label>
            <select
              value={nextTheme}
              onChange={(e) => setNextTheme(e.target.value as ThemeMode)}
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm"
            >
              <option value="dark">Dark Emerald / Nephrite</option>
              <option value="light">Light Emerald</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--pm-text-secondary)]">{t(language, 'settings.daily_goal')}</label>
            <input
              type="number"
              min={15}
              max={240}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 font-mono text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
              {language === 'uz' ? 'Muharrir shrift hajmi (px)' : 'Editor font size (px)'}
            </label>
            <input
              type="number"
              min={12}
              max={22}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 font-mono text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--pm-text-secondary)]">Tab size</label>
            <select
              value={tabSize}
              onChange={(e) => setTabSize(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 font-mono text-sm"
            >
              <option value={4}>4 spaces (PEP 8)</option>
              <option value={2}>2 spaces</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[var(--pm-success)]">{statusMsg}</span>
          <button
            type="submit"
            className="rounded-lg bg-[var(--pm-primary)] px-5 py-2 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
          >
            {t(language, 'common.save')}
          </button>
        </div>
      </form>

      {/* Storage, Backup & Runtime Info */}
      <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-4">
        <h2 className="font-display text-base font-semibold">
          {language === 'uz' ? "Saqlash, Zaxira nusxa va Tizim" : 'Storage, Backup & Environment'}
        </h2>

        {healthInfo && (
          <div className="grid gap-2 text-xs text-[var(--pm-text-secondary)] sm:grid-cols-2">
            <div>
              Python Runtime: <span className="font-mono text-[var(--pm-text)]">{healthInfo.pythonVersion}</span>
            </div>
            <div>
              AI Model: <span className="font-mono text-[var(--pm-text)]">{healthInfo.geminiModel}</span>
            </div>
            <div>
              SQLite DB: <span className="font-mono text-[var(--pm-text)]">{healthInfo.dbPath}</span>
            </div>
            <div>
              DB Size:{' '}
              <span className="font-mono tabular-nums text-[var(--pm-text)]">
                {(healthInfo.dbSizeBytes / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--pm-border)] px-4 py-2 text-xs font-medium hover:bg-[var(--pm-card-hover)]"
          >
            <Download className="h-3.5 w-3.5" />
            {t(language, 'settings.backup_export')}
          </button>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--pm-border)] px-4 py-2 text-xs font-medium hover:bg-[var(--pm-card-hover)]">
            <Upload className="h-3.5 w-3.5" />
            {t(language, 'settings.backup_restore')}
            <input type="file" accept="application/json" onChange={handleRestoreFile} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
}
