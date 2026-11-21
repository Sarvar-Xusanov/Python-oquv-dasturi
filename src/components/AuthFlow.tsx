import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Lock,
  Moon,
  Plus,
  Sun,
  Terminal,
  UserCheck,
} from 'lucide-react';
import { apiRequest } from '../lib/api';
import { t } from '../data/localization';
import { DIAGNOSTIC_EXAM } from '../data/exams_and_projects';
import type { Language, ThemeMode, UserSummary } from '../types/domain';

interface AuthFlowProps {
  profiles: UserSummary[];
  language: Language;
  theme: ThemeMode;
  onChangeLanguage: (lang: Language) => void;
  onChangeTheme: (theme: ThemeMode) => void;
  onAuthenticated: (token: string, user: UserSummary, needsOnboarding?: boolean) => void;
  onRefreshProfiles: () => Promise<void>;
}

type AuthView = 'welcome' | 'select' | 'register' | 'onboarding';

export function AuthFlow({
  profiles,
  language,
  theme,
  onChangeLanguage,
  onChangeTheme,
  onAuthenticated,
  onRefreshProfiles,
}: AuthFlowProps) {
  const [view, setView] = useState<AuthView>('welcome');
  const [selectedProfile, setSelectedProfile] = useState<UserSummary | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Registration state
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLevel, setRegLevel] = useState('beginner');
  const [regGoal, setRegGoal] = useState('junior_dev');
  const [regDailyMinutes, setRegDailyMinutes] = useState(60);

  // Pending authenticated session before onboarding finishes
  const [pendingAuth, setPendingAuth] = useState<{ token: string; user: UserSummary } | null>(null);
  const [obPrevCode, setObPrevCode] = useState('no');
  const [obStyle, setObStyle] = useState('practical');
  const [diagAnswers, setDiagAnswers] = useState<Record<string, number>>({});
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const handleProfileLogin = async (profile: UserSummary, password?: string) => {
    setErrorMsg(null);
    setBusy(true);
    try {
      const res = await apiRequest<{ token: string; user: UserSummary }>('/api/profiles/login', {
        method: 'POST',
        body: { userId: profile.id, password },
      });
      if (!res.user.onboardingCompleted) {
        setPendingAuth(res);
        setView('onboarding');
      } else {
        onAuthenticated(res.token, res.user, false);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setBusy(true);
    try {
      const res = await apiRequest<{ token: string; user: UserSummary }>('/api/profiles/register', {
        method: 'POST',
        body: {
          username: regUsername,
          displayName: regDisplayName,
          password: regPassword || undefined,
          preferredLanguage: language,
          experienceLevel: regLevel,
          learningGoal: regGoal,
          dailyGoalMinutes: regDailyMinutes,
        },
      });
      await onRefreshProfiles();
      setPendingAuth(res);
      setView('onboarding');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!pendingAuth) return;
    setBusy(true);
    setErrorMsg(null);
    try {
      let placementScore: number | null = null;
      let computedLevel = regLevel;

      if (showDiagnostic && Object.keys(diagAnswers).length > 0) {
        const examRes = await apiRequest<{ score: number }>(`/api/exams/${DIAGNOSTIC_EXAM.id}/submit`, {
          method: 'POST',
          token: pendingAuth.token,
          body: { answers: diagAnswers, startedAt: new Date().toISOString() },
        });
        placementScore = examRes.score;
        if (placementScore >= 80) computedLevel = 'intermediate';
        else if (placementScore >= 40) computedLevel = 'basic';
        else computedLevel = 'beginner';
      } else if (obPrevCode === 'yes_python') {
        computedLevel = 'intermediate';
      }

      const res = await apiRequest<{ user: UserSummary }>('/api/onboarding', {
        method: 'POST',
        token: pendingAuth.token,
        body: {
          experienceLevel: computedLevel,
          learningGoal: regGoal,
          dailyGoalMinutes: regDailyMinutes,
          explanationStyle: obStyle,
          placementScore,
        },
      });
      onAuthenticated(pendingAuth.token, res.user, false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not save onboarding');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] flex flex-col">
      {/* Minimal Header */}
      <header className="flex items-center justify-between gap-8 border-b border-[var(--pm-border)] px-6 py-4 bg-[var(--pm-sidebar)]">
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pm-primary)] text-white">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Python Mastery</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onChangeLanguage(language === 'uz' ? 'en' : 'uz')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] px-3 py-1.5 text-xs font-medium text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] transition-colors whitespace-nowrap shrink-0"
          >
            <Globe className="h-3.5 w-3.5" />
            {language === 'uz' ? "O'zbekcha" : 'English'}
          </button>
          <button
            type="button"
            onClick={() => onChangeTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] px-3 py-1.5 text-xs font-medium text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] transition-colors whitespace-nowrap shrink-0"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {view === 'welcome' && (
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
            <div className="flex flex-col justify-center space-y-6 lg:col-span-7">
              <p className="text-xs font-medium text-[var(--pm-secondary)]">
                {language === 'uz'
                  ? "17 kurs · 90 kunlik reja · Python 3.11 Sandbox · AI Ustoz"
                  : '17 Courses · 90-Day Roadmap · Python 3.11 Sandbox · AI Mentor'}
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-[var(--pm-text)] sm:text-5xl">
                {t(language, 'welcome.headline')}
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-[var(--pm-text-secondary)]">
                {t(language, 'welcome.subheadline')}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setView(profiles.length > 0 ? 'select' : 'register')}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--pm-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors whitespace-nowrap shrink-0"
                >
                  {t(language, 'welcome.start_learning')}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] px-5 py-3 text-sm font-medium text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors whitespace-nowrap shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  {t(language, 'welcome.create_profile')}
                </button>
                {profiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setView('select')}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] transition-colors whitespace-nowrap shrink-0"
                  >
                    <UserCheck className="h-4 w-4" />
                    {t(language, 'welcome.select_profile')} ({profiles.length})
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6 border-t border-[var(--pm-border)] pt-6 text-sm">
                <div>
                  <div className="font-mono text-xl font-semibold tabular-nums text-[var(--pm-text)]">17</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">
                    {language === 'uz' ? "Tizimli kurslar" : 'Structured courses'}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xl font-semibold tabular-nums text-[var(--pm-text)]">12+</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">
                    {language === 'uz' ? 'Avtomatik testli mashqlar' : 'Auto-graded exercises'}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xl font-semibold tabular-nums text-[var(--pm-text)]">7</div>
                  <div className="text-xs text-[var(--pm-text-muted)]">
                    {language === 'uz' ? 'AI ustoz rejimlari' : 'AI mentor modes'}
                  </div>
                </div>
              </div>
            </div>

            {/* Original Vector Educational Illustration */}
            <div className="lg:col-span-5 flex items-center">
              <div className="w-full rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-5">
                <svg
                  viewBox="0 0 420 260"
                  className="w-full h-auto rounded-lg bg-[var(--pm-code-bg)] border border-[var(--pm-border)]"
                  role="img"
                  aria-label="Python Mastery Learning Architecture"
                >
                  <defs>
                    <linearGradient id="emeraldFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#16A36A" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#39C98A" stopOpacity="0.06" />
                    </linearGradient>
                  </defs>
                  <rect width="420" height="260" fill="url(#emeraldFlow)" />
                  <g stroke="#263A30" strokeWidth="1" opacity="0.7">
                    <line x1="40" y1="50" x2="380" y2="50" />
                    <line x1="40" y1="100" x2="380" y2="100" />
                    <line x1="40" y1="150" x2="380" y2="150" />
                    <line x1="40" y1="200" x2="380" y2="200" />
                  </g>
                  <path
                    d="M 55 185 C 120 185, 130 125, 205 125 C 275 125, 290 65, 360 65"
                    fill="none"
                    stroke="#39C98A"
                    strokeWidth="2.5"
                  />
                  <circle cx="55" cy="185" r="7" fill="#16A36A" stroke="#75E0AE" strokeWidth="2" />
                  <circle cx="155" cy="147" r="7" fill="#16A36A" stroke="#75E0AE" strokeWidth="2" />
                  <circle cx="255" cy="105" r="7" fill="#16A36A" stroke="#75E0AE" strokeWidth="2" />
                  <circle cx="360" cy="65" r="8" fill="#39C98A" stroke="#F0F5F1" strokeWidth="2" />
                  <text x="42" y="212" fill="#A3B3AA" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    Understand
                  </text>
                  <text x="132" y="174" fill="#A3B3AA" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    Practice
                  </text>
                  <text x="235" y="132" fill="#A3B3AA" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    Test
                  </text>
                  <text x="338" y="45" fill="#75E0AE" fontSize="11" fontFamily="JetBrains Mono, monospace">
                    Build
                  </text>
                </svg>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-[var(--pm-text)]">
                    UNDERSTAND → PRACTICE → SOLVE → TEST → BUILD
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--pm-text-secondary)]">
                    {language === 'uz'
                      ? "Har bir nazariy dars real Python kodi, avtomatik test va AI tahlili bilan mustahkamlanadi."
                      : 'Every lesson pairs structured theory with sandboxed Python execution, automated tests, and AI guidance.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'select' && (
          <div className="w-full max-w-2xl rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">{t(language, 'welcome.select_profile')}</h2>
                <p className="text-sm text-[var(--pm-text-secondary)]">
                  {language === 'uz'
                    ? "Har bir foydalanuvchi o'z progressi, qaydlari va AI tarixi bilan alohida saqlanadi."
                    : 'Each local profile maintains isolated progress, notes, and AI mentor history.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedProfile(null);
                  setErrorMsg(null);
                  setView('welcome');
                }}
                className="text-sm text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]"
              >
                {t(language, 'auth.back')}
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-lg border border-[var(--pm-error)]/40 bg-[var(--pm-error)]/10 px-4 py-2.5 text-sm text-[var(--pm-error)]">
                {errorMsg}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {profiles.map((prof) => (
                <button
                  key={prof.id}
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (prof.hasPassword) {
                      setSelectedProfile(prof);
                      setPasswordInput('');
                      setErrorMsg(null);
                    } else {
                      handleProfileLogin(prof);
                    }
                  }}
                  className="flex items-center gap-3.5 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4 text-left hover:bg-[var(--pm-card-hover)] transition-colors"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg font-display text-base font-bold text-white"
                    style={{ backgroundColor: prof.avatarColor }}
                  >
                    {prof.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-[var(--pm-text)]">{prof.displayName}</span>
                      {prof.hasPassword && <Lock className="h-3.5 w-3.5 shrink-0 text-[var(--pm-text-muted)]" />}
                    </div>
                    <div className="text-xs text-[var(--pm-text-muted)] truncate">
                      @{prof.username} · {prof.completedLessons} {t(language, 'common.lessons')} · {prof.experienceLevel}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedProfile && selectedProfile.hasPassword && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProfileLogin(selectedProfile, passwordInput);
                }}
                className="flex flex-col gap-3 border-t border-[var(--pm-border)] pt-4 sm:flex-row sm:items-end"
              >
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
                    {selectedProfile.displayName} — {t(language, 'auth.password')}
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm text-[var(--pm-text)] focus:border-[var(--pm-primary)] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[var(--pm-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors whitespace-nowrap"
                >
                  {t(language, 'auth.sign_in')}
                </button>
              </form>
            )}

            <div className="flex justify-end border-t border-[var(--pm-border)] pt-4">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setView('register');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--pm-secondary)] hover:underline"
              >
                <Plus className="h-4 w-4" />
                {t(language, 'welcome.create_profile')}
              </button>
            </div>
          </div>
        )}

        {view === 'register' && (
          <form
            onSubmit={handleRegister}
            className="w-full max-w-lg rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">{t(language, 'welcome.create_profile')}</h2>
              <button
                type="button"
                onClick={() => setView(profiles.length > 0 ? 'select' : 'welcome')}
                className="text-sm text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]"
              >
                {t(language, 'auth.back')}
              </button>
            </div>

            {errorMsg && (
              <div className="rounded-lg border border-[var(--pm-error)]/40 bg-[var(--pm-error)]/10 px-4 py-2.5 text-sm text-[var(--pm-error)]">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
                {t(language, 'auth.display_name')}
              </label>
              <input
                type="text"
                required
                minLength={2}
                placeholder={language === 'uz' ? 'Masalan: Sardorbek Alimov' : 'e.g. Alex Morgan'}
                value={regDisplayName}
                onChange={(e) => setRegDisplayName(e.target.value)}
                className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3.5 py-2 text-sm focus:border-[var(--pm-primary)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
                {t(language, 'auth.username')}
              </label>
              <input
                type="text"
                required
                pattern="[a-zA-Z0-9_]{2,24}"
                placeholder="sardor_py"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3.5 py-2 font-mono text-sm focus:border-[var(--pm-primary)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
                {t(language, 'auth.password_optional')}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3.5 py-2 text-sm focus:border-[var(--pm-primary)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
                  {language === 'uz' ? 'Hozirgi daraja' : 'Current level'}
                </label>
                <select
                  value={regLevel}
                  onChange={(e) => setRegLevel(e.target.value)}
                  className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm focus:border-[var(--pm-primary)] focus:outline-none"
                >
                  <option value="beginner">{language === 'uz' ? 'Mutlaqo yangi' : 'Complete Beginner'}</option>
                  <option value="basic">{language === 'uz' ? "Boshlang'ich bilim" : 'Basic Knowledge'}</option>
                  <option value="intermediate">{language === 'uz' ? "O'rta daraja" : 'Intermediate'}</option>
                  <option value="advanced">{language === 'uz' ? 'Yuqori daraja' : 'Advanced'}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
                  {language === 'uz' ? 'Kunlik maqsad' : 'Daily goal'}
                </label>
                <select
                  value={regDailyMinutes}
                  onChange={(e) => setRegDailyMinutes(Number(e.target.value))}
                  className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm focus:border-[var(--pm-primary)] focus:outline-none"
                >
                  <option value={30}>30 {t(language, 'common.minutes')}</option>
                  <option value={60}>60 {t(language, 'common.minutes')} (90-day)</option>
                  <option value={120}>120 {t(language, 'common.minutes')}</option>
                  <option value={180}>180 {t(language, 'common.minutes')}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-[var(--pm-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
            >
              {busy ? t(language, 'common.loading') : t(language, 'common.continue')}
            </button>
          </form>
        )}

        {view === 'onboarding' && pendingAuth && (
          <div className="w-full max-w-2xl rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold">
                {language === 'uz'
                  ? `Xush kelibsiz, ${pendingAuth.user.displayName}!`
                  : `Welcome, ${pendingAuth.user.displayName}!`}
              </h2>
              <p className="text-sm text-[var(--pm-text-secondary)]">
                {language === 'uz'
                  ? "O'quv rejangizni shaxsiylashtirish uchun qisqa sozlamalarni tanlang."
                  : 'Personalize your learning plan and optionally take a 5-question diagnostic check.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
                  {language === 'uz' ? 'Avval dasturlaganmisiz?' : 'Have you programmed before?'}
                </label>
                <select
                  value={obPrevCode}
                  onChange={(e) => setObPrevCode(e.target.value)}
                  className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm"
                >
                  <option value="no">{language === 'uz' ? "Yo'q, noldan boshlayman" : 'No, starting from scratch'}</option>
                  <option value="other">{language === 'uz' ? 'Ha, boshqa tilda' : 'Yes, in another language'}</option>
                  <option value="yes_python">{language === 'uz' ? 'Ha, Python asoslarini bilaman' : 'Yes, I know basic Python'}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
                  {language === 'uz' ? 'Asosiy maqsadingiz' : 'Primary learning goal'}
                </label>
                <select
                  value={regGoal}
                  onChange={(e) => setRegGoal(e.target.value)}
                  className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] px-3 py-2 text-sm"
                >
                  <option value="junior_dev">Junior Python Developer</option>
                  <option value="backend">Backend & FastAPI</option>
                  <option value="data_ai">Data Science & AI</option>
                  <option value="automation">Automation & Scripting</option>
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-[var(--pm-text-secondary)]">
                  {language === 'uz' ? "Tushuntirish uslubi" : 'Preferred explanation style'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'practical', uz: 'Amaliy misollar bilan', en: 'Hands-on examples' },
                    { id: 'deep', uz: 'Chuqur nazariya bilan', en: 'Deep theory first' },
                    { id: 'socratic', uz: 'Savollar bilan o‘ylash', en: 'Guided Socratic' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setObStyle(opt.id)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        obStyle === opt.id
                          ? 'border-[var(--pm-primary)] bg-[var(--pm-primary)]/15 text-[var(--pm-text)]'
                          : 'border-[var(--pm-border)] bg-[var(--pm-bg)] text-[var(--pm-text-secondary)]'
                      }`}
                    >
                      {opt[language]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--pm-border)] pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {language === 'uz'
                    ? 'Ixtiyoriy daraja testi (5 ta savol)'
                    : 'Optional Placement Diagnostic (5 questions)'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowDiagnostic((v) => !v)}
                  className="text-xs font-semibold text-[var(--pm-secondary)] hover:underline"
                >
                  {showDiagnostic
                    ? language === 'uz' ? 'Yashirish' : 'Hide'
                    : language === 'uz' ? 'Testni ochish' : 'Take placement check'}
                </button>
              </div>

              {showDiagnostic && (
                <div className="max-h-72 overflow-y-auto space-y-4 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] p-4">
                  {DIAGNOSTIC_EXAM.questions.map((q, idx) => (
                    <div key={q.id} className="space-y-2">
                      <p className="text-sm font-medium text-[var(--pm-text)]">
                        {idx + 1}. {q.prompt[language]}
                      </p>
                      {q.codeSnippet && (
                        <pre className="rounded bg-[var(--pm-code-bg)] p-2.5 font-mono text-xs text-[var(--pm-text)] border border-[var(--pm-border)]">
                          {q.codeSnippet}
                        </pre>
                      )}
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {q.options[language].map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => setDiagAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`rounded-md border px-3 py-1.5 text-left text-xs transition-colors ${
                              diagAnswers[q.id] === optIdx
                                ? 'border-[var(--pm-primary)] bg-[var(--pm-primary)]/15 text-[var(--pm-text)]'
                                : 'border-[var(--pm-border)] bg-[var(--pm-card)] text-[var(--pm-text-secondary)]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="text-sm text-[var(--pm-error)]">{errorMsg}</div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={handleCompleteOnboarding}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--pm-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                {language === 'uz' ? 'Kabinetga kirish' : 'Enter Learning Workspace'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
