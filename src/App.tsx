import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  BookMarked,
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass,
  FolderGit2,
  Globe,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  StickyNote,
  Sun,
  Terminal,
  Video,
  Wrench,
  X,
} from 'lucide-react';
import { AuthFlow } from './components/AuthFlow';
import { AiMentorScreen } from './components/screens/AiMentorScreen';
import { AchievementsScreen, AnalyticsScreen, SettingsScreen } from './components/screens/AnalyticsAndSettings';
import { CodeLabScreen } from './components/screens/CodeLabScreen';
import {
  CoursesScreen,
  DashboardScreen,
  LearningPathScreen,
  type DashboardData,
} from './components/screens/DashboardAndPath';
import { ExaminationsScreen, ExercisesScreen } from './components/screens/ExercisesAndExams';
import { LessonReaderScreen } from './components/screens/LessonReaderScreen';
import {
  GlossaryScreen,
  NotesScreen,
  ProjectLabScreen,
  VideoLibraryScreen,
} from './components/screens/ProjectsAndResources';
import { COURSES, LESSONS } from './data/curriculum';
import { EXERCISES } from './data/exercises';
import { SCREEN_TITLES, t } from './data/localization';
import { apiRequest } from './lib/api';
import type { Language, ScreenId, ThemeMode, UserSummary } from './types/domain';

interface NavItem {
  id: ScreenId;
  labelKey: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { id: 'learning_path', labelKey: 'nav.learning_path', icon: Compass },
  { id: 'courses', labelKey: 'nav.courses', icon: BookOpen },
  { id: 'code_lab', labelKey: 'nav.code_lab', icon: Code2 },
  { id: 'ai_mentor', labelKey: 'nav.ai_mentor', icon: Bot },
  { id: 'exercises', labelKey: 'nav.exercises', icon: Wrench },
  { id: 'examinations', labelKey: 'nav.examinations', icon: GraduationCap },
  { id: 'projects', labelKey: 'nav.projects', icon: FolderGit2 },
  { id: 'videos', labelKey: 'nav.videos', icon: Video },
  { id: 'notes', labelKey: 'nav.notes', icon: StickyNote },
  { id: 'glossary', labelKey: 'nav.glossary', icon: BookMarked },
  { id: 'analytics', labelKey: 'nav.analytics', icon: BarChart3 },
  { id: 'achievements', labelKey: 'nav.achievements', icon: Award },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings },
];

export default function App() {
  const [profiles, setProfiles] = useState<UserSummary[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserSummary | null>(null);
  const [language, setLanguage] = useState<Language>('uz');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState<Set<string>>(new Set());
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSONS[0].id);
  const [initialExerciseId, setInitialExerciseId] = useState<string | null>(null);
  const [initialExamId, setInitialExamId] = useState<string | null>(null);
  const [codeLabPrefill, setCodeLabPrefill] = useState<string | null>(null);
  const [aiPrefill, setAiPrefill] = useState<{ message: string; code?: string; lessonId?: string } | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [healthInfo, setHealthInfo] = useState<{
    pythonVersion: string;
    geminiModel: string;
    geminiConfigured: boolean;
    dbPath: string;
    dbSizeBytes: number;
  } | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const loadProfiles = useCallback(async () => {
    try {
      const res = await apiRequest<{ profiles: UserSummary[] }>('/api/profiles');
      setProfiles(res.profiles);
    } catch {
      setProfiles([]);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
    apiRequest<{
      pythonVersion: string;
      geminiModel: string;
      geminiConfigured: boolean;
      dbPath: string;
      dbSizeBytes: number;
    }>('/api/health')
      .then(setHealthInfo)
      .catch(() => null);
  }, [loadProfiles]);

  const refreshLearningData = useCallback(async () => {
    if (!token) return;
    const [dashRes, progRes] = await Promise.all([
      apiRequest<DashboardData & { user: UserSummary }>('/api/dashboard', { token }),
      apiRequest<{ progress: Array<{ lesson_id: string; status: string; bookmarked: number }> }>('/api/progress', {
        token,
      }),
    ]);
    setDashboard(dashRes);
    if (dashRes.user) {
      setUser(dashRes.user);
    }
    const done = new Set<string>();
    const bookmarked = new Set<string>();
    for (const p of progRes.progress) {
      if (p.status === 'completed') done.add(p.lesson_id);
      if (p.bookmarked) bookmarked.add(p.lesson_id);
    }
    setCompletedLessonIds(done);
    setBookmarkedLessonIds(bookmarked);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    refreshLearningData();
    const heartbeat = setInterval(() => {
      apiRequest('/api/study-sessions', {
        method: 'POST',
        token,
        body: { durationSeconds: 60, activityType: activeScreen },
      }).catch(() => null);
    }, 60_000);
    return () => clearInterval(heartbeat);
  }, [token, refreshLearningData, activeScreen]);

  const handleAuthenticated = (nextToken: string, nextUser: UserSummary) => {
    setToken(nextToken);
    setUser(nextUser);
    setLanguage(nextUser.preferredLanguage);
    setTheme(nextUser.theme);
    setActiveScreen('dashboard');
  };

  const handleSignOut = async () => {
    if (token) {
      await apiRequest('/api/profiles/logout', { method: 'POST', token }).catch(() => null);
    }
    setToken(null);
    setUser(null);
    setDashboard(null);
    setCompletedLessonIds(new Set());
    setBookmarkedLessonIds(new Set());
    await loadProfiles();
  };

  const handleQuickLanguage = async () => {
    const next: Language = language === 'uz' ? 'en' : 'uz';
    setLanguage(next);
    if (token) {
      const res = await apiRequest<{ user: UserSummary }>('/api/settings', {
        method: 'PUT',
        token,
        body: { preferredLanguage: next },
      });
      setUser(res.user);
    }
  };

  const handleQuickTheme = async () => {
    const next: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (token) {
      const res = await apiRequest<{ user: UserSummary }>('/api/settings', {
        method: 'PUT',
        token,
        body: { theme: next },
      });
      setUser(res.user);
    }
  };

  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{ kind: 'course' | 'lesson' | 'exercise'; id: string; title: string }> = [];
    for (const c of COURSES) {
      if (c.title[language].toLowerCase().includes(q)) {
        results.push({ kind: 'course', id: c.id, title: c.title[language] });
      }
    }
    for (const l of LESSONS) {
      if (l.title[language].toLowerCase().includes(q)) {
        results.push({ kind: 'lesson', id: l.id, title: l.title[language] });
      }
    }
    for (const ex of EXERCISES) {
      if (ex.title[language].toLowerCase().includes(q)) {
        results.push({ kind: 'exercise', id: ex.id, title: ex.title[language] });
      }
    }
    return results.slice(0, 7);
  }, [globalSearch, language]);

  if (!token || !user) {
    return (
      <AuthFlow
        profiles={profiles}
        language={language}
        theme={theme}
        onChangeLanguage={setLanguage}
        onChangeTheme={setTheme}
        onAuthenticated={handleAuthenticated}
        onRefreshProfiles={loadProfiles}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Navigation Sidebar */}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--pm-border)] bg-[var(--pm-sidebar)] transition-all duration-200 lg:static ${
          sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--pm-border)] px-4">
          <button
            type="button"
            onClick={() => setActiveScreen('dashboard')}
            className="flex items-center gap-2.5 overflow-hidden text-left"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--pm-primary)] text-white">
              <Terminal className="h-4 w-4" />
            </div>
            {!sidebarCollapsed && (
              <span className="truncate font-display text-base font-bold tracking-tight">
                Python Mastery
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="hidden rounded-lg p-1 text-[var(--pm-text-muted)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)] lg:inline-flex"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1 text-[var(--pm-text-muted)] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              activeScreen === item.id || (item.id === 'courses' && activeScreen === 'lesson');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'courses') setSelectedCourseId(null);
                  setActiveScreen(item.id);
                  setMobileMenuOpen(false);
                }}
                title={sidebarCollapsed ? t(language, item.labelKey) : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[var(--pm-primary)] text-white'
                    : 'text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{t(language, item.labelKey)}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile Block */}
        <div className="border-t border-[var(--pm-border)] p-3 space-y-2">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.displayName.slice(0, 2).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-[var(--pm-text)]">{user.displayName}</div>
                <div className="truncate text-[11px] text-[var(--pm-text-muted)]">@{user.username}</div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg border border-[var(--pm-border)] px-2.5 py-1.5 text-xs text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)] transition-colors"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">{t(language, 'nav.switch_profile')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="no-print flex h-16 items-center justify-between gap-4 border-b border-[var(--pm-border)] bg-[var(--pm-sidebar)] px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-1.5 text-[var(--pm-text-secondary)] hover:bg-[var(--pm-card-hover)] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="truncate font-display text-sm font-semibold text-[var(--pm-text)]">
              {SCREEN_TITLES[activeScreen][language]}
            </span>
          </div>

          {/* Search */}
          <div className="relative hidden w-full max-w-sm md:block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--pm-text-muted)]" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder={t(language, 'common.search')}
              className="w-full rounded-lg border border-[var(--pm-border)] bg-[var(--pm-bg)] pl-9 pr-3 py-1.5 text-sm focus:border-[var(--pm-primary)] focus:outline-none"
            />
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-10 z-50 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-1.5 shadow-lg">
                {searchResults.map((r) => (
                  <button
                    key={`${r.kind}-${r.id}`}
                    type="button"
                    onClick={() => {
                      setGlobalSearch('');
                      if (r.kind === 'course') {
                        setSelectedCourseId(r.id);
                        setActiveScreen('courses');
                      } else if (r.kind === 'lesson') {
                        setActiveLessonId(r.id);
                        setActiveScreen('lesson');
                      } else {
                        setInitialExerciseId(r.id);
                        setActiveScreen('exercises');
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs hover:bg-[var(--pm-card-hover)]"
                  >
                    <span className="truncate font-medium">{r.title}</span>
                    <span className="ml-2 font-mono text-[10px] text-[var(--pm-text-muted)]">{r.kind}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleQuickLanguage}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] whitespace-nowrap shrink-0"
            >
              <Globe className="h-3.5 w-3.5" />
              {language.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={handleQuickTheme}
              className="inline-flex items-center justify-center rounded-lg border border-[var(--pm-border)] bg-[var(--pm-card)] p-1.5 text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('code_lab')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pm-primary)] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[var(--pm-secondary)] hover:text-[#0B1110] transition-colors whitespace-nowrap shrink-0"
            >
              <Code2 className="h-3.5 w-3.5" />
              Code Lab
            </button>
          </div>
        </header>

        {/* Active Screen Viewport */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {activeScreen === 'dashboard' && (
              <DashboardScreen
                user={user}
                dashboard={dashboard}
                completedLessonIds={completedLessonIds}
                onNavigate={setActiveScreen}
                onOpenLesson={(lessonId) => {
                  setActiveLessonId(lessonId);
                  setActiveScreen('lesson');
                }}
                onOpenExercise={(exId) => {
                  setInitialExerciseId(exId);
                  setActiveScreen('exercises');
                }}
              />
            )}

            {activeScreen === 'learning_path' && (
              <LearningPathScreen
                language={language}
                completedLessonIds={completedLessonIds}
                onOpenCourse={(courseId) => {
                  setSelectedCourseId(courseId);
                  setActiveScreen('courses');
                }}
                onOpenExam={(examId) => {
                  setInitialExamId(examId);
                  setActiveScreen('examinations');
                }}
              />
            )}

            {activeScreen === 'courses' && (
              <CoursesScreen
                language={language}
                completedLessonIds={completedLessonIds}
                selectedCourseId={selectedCourseId}
                onSelectCourse={setSelectedCourseId}
                onOpenLesson={(lessonId) => {
                  setActiveLessonId(lessonId);
                  setActiveScreen('lesson');
                }}
              />
            )}

            {activeScreen === 'lesson' && (
              <LessonReaderScreen
                lessonId={activeLessonId}
                token={token}
                language={language}
                completedLessonIds={completedLessonIds}
                bookmarkedLessonIds={bookmarkedLessonIds}
                onSelectLesson={setActiveLessonId}
                onProgressUpdated={refreshLearningData}
                onOpenInCodeLab={(code) => {
                  setCodeLabPrefill(code);
                  setActiveScreen('code_lab');
                }}
                onAskAiWithContext={(message, lessonId) => {
                  setAiPrefill({ message, lessonId });
                  setActiveScreen('ai_mentor');
                }}
              />
            )}

            {activeScreen === 'code_lab' && (
              <CodeLabScreen
                token={token}
                language={language}
                theme={theme}
                fontSize={user.editorFontSize}
                tabSize={user.editorTabSize}
                initialCode={codeLabPrefill}
                onConsumeInitialCode={() => setCodeLabPrefill(null)}
                onSendToAiMentor={(message, code) => {
                  setAiPrefill({ message, code });
                  setActiveScreen('ai_mentor');
                }}
                onAchievementUnlocked={refreshLearningData}
              />
            )}

            {activeScreen === 'ai_mentor' && (
              <AiMentorScreen
                token={token}
                user={user}
                language={language}
                prefillPrompt={aiPrefill}
                onConsumePrefill={() => setAiPrefill(null)}
                onOpenInCodeLab={(code) => {
                  setCodeLabPrefill(code);
                  setActiveScreen('code_lab');
                }}
              />
            )}

            {activeScreen === 'exercises' && (
              <ExercisesScreen
                token={token}
                language={language}
                theme={theme}
                fontSize={user.editorFontSize}
                tabSize={user.editorTabSize}
                initialExerciseId={initialExerciseId}
                onAchievementUnlocked={refreshLearningData}
              />
            )}

            {activeScreen === 'examinations' && (
              <ExaminationsScreen
                token={token}
                language={language}
                initialExamId={initialExamId}
                onAchievementUnlocked={refreshLearningData}
              />
            )}

            {activeScreen === 'projects' && (
              <ProjectLabScreen
                token={token}
                language={language}
                theme={theme}
                fontSize={user.editorFontSize}
                tabSize={user.editorTabSize}
                onAchievementUnlocked={refreshLearningData}
              />
            )}

            {activeScreen === 'videos' && (
              <VideoLibraryScreen
                token={token}
                language={language}
                onOpenLesson={(lessonId) => {
                  setActiveLessonId(lessonId);
                  setActiveScreen('lesson');
                }}
              />
            )}

            {activeScreen === 'notes' && (
              <NotesScreen
                token={token}
                language={language}
                onAchievementUnlocked={refreshLearningData}
              />
            )}

            {activeScreen === 'glossary' && (
              <GlossaryScreen
                language={language}
                onOpenInCodeLab={(code) => {
                  setCodeLabPrefill(code);
                  setActiveScreen('code_lab');
                }}
              />
            )}

            {activeScreen === 'analytics' && (
              <AnalyticsScreen
                language={language}
                dashboard={dashboard}
                completedLessonIds={completedLessonIds}
              />
            )}

            {activeScreen === 'achievements' && (
              <AchievementsScreen
                language={language}
                unlocked={dashboard?.achievements ?? []}
              />
            )}

            {activeScreen === 'settings' && (
              <SettingsScreen
                token={token}
                user={user}
                language={language}
                theme={theme}
                healthInfo={healthInfo}
                onUserUpdated={(updated) => {
                  setUser(updated);
                  setLanguage(updated.preferredLanguage);
                  setTheme(updated.theme);
                  loadProfiles();
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
