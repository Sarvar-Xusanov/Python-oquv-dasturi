import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createServer as createViteServer } from 'vite';
import { db, getDatabaseFileStats, initializeDatabase } from './server/db.ts';
import {
  createSessionToken,
  hashPassword,
  requireAuth,
  revokeSessionToken,
  verifyPassword,
  type AuthenticatedRequest,
} from './server/auth.ts';
import { runExerciseTests, runPythonCode } from './server/sandbox.ts';
import {
  ACTIVE_GEMINI_MODEL,
  generateExerciseHint,
  streamMentorReply,
  type MentorMode,
  type StudentContext,
} from './server/gemini.ts';
import { EXERCISES } from './src/data/exercises.ts';
import { DIAGNOSTIC_EXAM, EXAMINATIONS, PROJECTS } from './src/data/exams_and_projects.ts';
import { COURSES, getCourseById, getLessonById } from './src/data/curriculum.ts';

initializeDatabase();

const app = express();
app.use(express.json({ limit: '2mb' }));

let pythonVersion = 'Python 3';
try {
  pythonVersion = execSync('python3 --version', { encoding: 'utf8' }).trim();
} catch {
  pythonVersion = 'Python unavailable';
}

function unlockAchievement(userId: number, achievementId: string): boolean {
  const res = db
    .prepare(
      `INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)`,
    )
    .run(userId, achievementId);
  return Number(res.changes) > 0;
}

function updateConceptMastery(userId: number, conceptId: string, scoreDelta: number): void {
  const existing = db
    .prepare(`SELECT mastery_level, confidence_score FROM knowledge_mastery WHERE user_id = ? AND concept_id = ?`)
    .get(userId, conceptId) as { mastery_level: number; confidence_score: number } | undefined;

  if (!existing) {
    const initial = Math.max(0, Math.min(100, scoreDelta));
    db.prepare(
      `INSERT INTO knowledge_mastery (user_id, concept_id, mastery_level, confidence_score) VALUES (?, ?, ?, ?)`,
    ).run(userId, conceptId, initial, initial / 100);
  } else {
    const nextLevel = Math.max(0, Math.min(100, Math.round(existing.mastery_level * 0.5 + scoreDelta * 0.5)));
    db.prepare(
      `UPDATE knowledge_mastery SET mastery_level = ?, confidence_score = ?, last_assessed_at = datetime('now') WHERE user_id = ? AND concept_id = ?`,
    ).run(nextLevel, nextLevel / 100, userId, conceptId);
  }
}

function getUserSummary(userId: number) {
  const row = db
    .prepare(`
      SELECT
        u.id, u.username, u.display_name, u.role, u.password_hash, u.last_active_at,
        p.preferred_language, p.theme, p.experience_level, p.daily_goal_minutes,
        p.learning_goal, p.explanation_style, p.onboarding_completed, p.placement_score,
        p.avatar_color, p.editor_font_size, p.editor_tab_size,
        (SELECT COUNT(*) FROM lesson_progress lp WHERE lp.user_id = u.id AND lp.status = 'completed') AS completed_lessons
      FROM users u
      JOIN user_profiles p ON p.user_id = u.id
      WHERE u.id = ?
    `)
    .get(userId) as Record<string, unknown> | undefined;

  if (!row) return null;

  return {
    id: Number(row.id),
    username: String(row.username),
    displayName: String(row.display_name),
    role: String(row.role),
    hasPassword: Boolean(row.password_hash),
    preferredLanguage: (row.preferred_language === 'en' ? 'en' : 'uz') as 'uz' | 'en',
    theme: (row.theme === 'light' ? 'light' : 'dark') as 'dark' | 'light',
    experienceLevel: String(row.experience_level),
    dailyGoalMinutes: Number(row.daily_goal_minutes),
    learningGoal: String(row.learning_goal),
    explanationStyle: String(row.explanation_style),
    onboardingCompleted: Boolean(row.onboarding_completed),
    placementScore: row.placement_score === null ? null : Number(row.placement_score),
    avatarColor: String(row.avatar_color),
    editorFontSize: Number(row.editor_font_size),
    editorTabSize: Number(row.editor_tab_size),
    completedLessons: Number(row.completed_lessons),
    lastActiveAt: String(row.last_active_at),
  };
}

function calculateStreakDays(userId: number): number {
  const rows = db
    .prepare(`SELECT DISTINCT study_date FROM study_sessions WHERE user_id = ? ORDER BY study_date DESC LIMIT 60`)
    .all(userId) as Array<{ study_date: string }>;
  if (rows.length === 0) return 0;

  const dates = new Set(rows.map((r) => r.study_date));
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    if (dates.has(iso)) {
      streak += 1;
    } else if (i === 0) {
      // Allow streak if user studied yesterday even if not yet today
      continue;
    } else {
      break;
    }
  }
  return streak;
}

// Health & System Info
app.get('/api/health', (_req, res) => {
  const dbStats = getDatabaseFileStats();
  res.json({
    ok: true,
    pythonVersion,
    geminiModel: ACTIVE_GEMINI_MODEL,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    dbPath: dbStats.path,
    dbSizeBytes: dbStats.sizeBytes,
  });
});

// Profile listing (public local profile chooser metadata, no secrets)
app.get('/api/profiles', (_req, res) => {
  const rows = db
    .prepare(`
      SELECT
        u.id, u.username, u.display_name, u.role, u.password_hash, u.last_active_at,
        p.preferred_language, p.theme, p.experience_level, p.daily_goal_minutes,
        p.learning_goal, p.explanation_style, p.onboarding_completed, p.placement_score,
        p.avatar_color, p.editor_font_size, p.editor_tab_size,
        (SELECT COUNT(*) FROM lesson_progress lp WHERE lp.user_id = u.id AND lp.status = 'completed') AS completed_lessons
      FROM users u
      JOIN user_profiles p ON p.user_id = u.id
      ORDER BY u.last_active_at DESC
    `)
    .all() as Array<Record<string, unknown>>;

  res.json({
    profiles: rows.map((row) => ({
      id: Number(row.id),
      username: String(row.username),
      displayName: String(row.display_name),
      role: String(row.role),
      hasPassword: Boolean(row.password_hash),
      preferredLanguage: row.preferred_language === 'en' ? 'en' : 'uz',
      theme: row.theme === 'light' ? 'light' : 'dark',
      experienceLevel: String(row.experience_level),
      dailyGoalMinutes: Number(row.daily_goal_minutes),
      learningGoal: String(row.learning_goal),
      explanationStyle: String(row.explanation_style),
      onboardingCompleted: Boolean(row.onboarding_completed),
      placementScore: row.placement_score === null ? null : Number(row.placement_score),
      avatarColor: String(row.avatar_color),
      editorFontSize: Number(row.editor_font_size),
      editorTabSize: Number(row.editor_tab_size),
      completedLessons: Number(row.completed_lessons),
      lastActiveAt: String(row.last_active_at),
    })),
  });
});

app.post('/api/profiles/register', (req, res) => {
  const {
    username,
    displayName,
    password,
    preferredLanguage = 'uz',
    experienceLevel = 'beginner',
    learningGoal = 'junior_dev',
    dailyGoalMinutes = 60,
  } = req.body ?? {};

  const cleanUsername = String(username ?? '').trim().toLowerCase();
  const cleanDisplay = String(displayName ?? '').trim();

  if (!/^[a-z0-9_]{2,24}$/.test(cleanUsername)) {
    res.status(400).json({ error: 'Username must be 2-24 lowercase letters, numbers, or underscores.' });
    return;
  }
  if (cleanDisplay.length < 2 || cleanDisplay.length > 50) {
    res.status(400).json({ error: 'Display name must be between 2 and 50 characters.' });
    return;
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(cleanUsername);
  if (existing) {
    res.status(409).json({ error: 'Username already exists.' });
    return;
  }

  const passwordHash =
    typeof password === 'string' && password.length > 0 ? hashPassword(password) : null;

  const avatarPalette = ['#16A36A', '#0D9488', '#0284C7', '#059669', '#2563EB'];
  const avatarColor = avatarPalette[Math.floor(Math.random() * avatarPalette.length)];
  const lang = preferredLanguage === 'en' ? 'en' : 'uz';
  const goalMinutes = Math.max(15, Math.min(240, Number(dailyGoalMinutes) || 60));

  const insertUser = db.prepare(
    `INSERT INTO users (username, display_name, password_hash, role) VALUES (?, ?, ?, 'student')`,
  );
  const result = insertUser.run(cleanUsername, cleanDisplay, passwordHash);
  const userId = Number(result.lastInsertRowid);

  db.prepare(`
    INSERT INTO user_profiles (
      user_id, preferred_language, experience_level, daily_goal_minutes, learning_goal, avatar_color
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, lang, String(experienceLevel), goalMinutes, String(learningGoal), avatarColor);

  db.prepare(`
    INSERT INTO code_files (user_id, filename, content)
    VALUES (?, 'main.py', ?)
  `).run(
    userId,
    `# Python Mastery Code Lab\n# Muallif: ${cleanDisplay}\n\ndef greet(name: str) -> str:\n    return f"Assalomu alaykum, {name}! Python Mastery ga xush kelibsiz."\n\nprint(greet("${cleanDisplay}"))\n`,
  );

  const token = createSessionToken(userId);
  const user = getUserSummary(userId);
  res.status(201).json({ token, user });
});

app.post('/api/profiles/login', (req, res) => {
  const { userId, username, password } = req.body ?? {};

  const row = userId
    ? (db.prepare('SELECT id, password_hash FROM users WHERE id = ?').get(Number(userId)) as
        | { id: number; password_hash: string | null }
        | undefined)
    : (db.prepare('SELECT id, password_hash FROM users WHERE username = ?').get(String(username ?? '').trim().toLowerCase()) as
        | { id: number; password_hash: string | null }
        | undefined);

  if (!row) {
    res.status(404).json({ error: 'Profile not found.' });
    return;
  }

  if (row.password_hash) {
    if (typeof password !== 'string' || !verifyPassword(password, row.password_hash)) {
      res.status(401).json({ error: 'Invalid password.' });
      return;
    }
  }

  const token = createSessionToken(row.id);
  const user = getUserSummary(row.id);
  res.json({ token, user });
});

app.post('/api/profiles/logout', requireAuth, (req: AuthenticatedRequest, res) => {
  const rawToken = req.headers.authorization?.slice(7).trim() ?? '';
  if (rawToken) revokeSessionToken(rawToken);
  res.json({ ok: true });
});

app.get('/api/me', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = getUserSummary(req.user!.id);
  res.json({ user });
});

app.post('/api/onboarding', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const {
    experienceLevel = 'beginner',
    learningGoal = 'junior_dev',
    dailyGoalMinutes = 60,
    explanationStyle = 'practical',
    placementScore = null,
  } = req.body ?? {};

  db.prepare(`
    UPDATE user_profiles
    SET experience_level = ?, learning_goal = ?, daily_goal_minutes = ?,
        explanation_style = ?, onboarding_completed = 1, placement_score = ?
    WHERE user_id = ?
  `).run(
    String(experienceLevel),
    String(learningGoal),
    Math.max(15, Math.min(240, Number(dailyGoalMinutes) || 60)),
    String(explanationStyle),
    placementScore === null ? null : Number(placementScore),
    userId,
  );

  res.json({ user: getUserSummary(userId) });
});

// Dashboard & Analytics
app.get('/api/dashboard', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const user = getUserSummary(userId);

  const completedLessons = db
    .prepare(`SELECT lesson_id, completed_at FROM lesson_progress WHERE user_id = ? AND status = 'completed' ORDER BY completed_at DESC`)
    .all(userId) as Array<{ lesson_id: string; completed_at: string }>;

  const studyTotals = db
    .prepare(`SELECT COALESCE(SUM(duration_seconds), 0) AS total_sec FROM study_sessions WHERE user_id = ?`)
    .get(userId) as { total_sec: number };

  const todaySecRow = db
    .prepare(`SELECT COALESCE(SUM(duration_seconds), 0) AS today_sec FROM study_sessions WHERE user_id = ? AND study_date = date('now')`)
    .get(userId) as { today_sec: number };

  const examAvgRow = db
    .prepare(`SELECT AVG(score) AS avg_score, COUNT(*) AS attempts FROM examination_attempts WHERE user_id = ?`)
    .get(userId) as { avg_score: number | null; attempts: number };

  const exerciseBestRows = db
    .prepare(`SELECT exercise_id, MAX(score) AS best_score FROM exercise_submissions WHERE user_id = ? GROUP BY exercise_id`)
    .all(userId) as Array<{ exercise_id: string; best_score: number }>;

  // Last 7 days activity
  const weeklyRows = db
    .prepare(`
      SELECT study_date, SUM(duration_seconds) AS seconds
      FROM study_sessions
      WHERE user_id = ? AND study_date >= date('now', '-6 days')
      GROUP BY study_date
    `)
    .all(userId) as Array<{ study_date: string; seconds: number }>;
  const weeklyMap = new Map(weeklyRows.map((r) => [r.study_date, Math.round(r.seconds / 60)]));

  const weeklyActivity: Array<{ date: string; label: string; minutes: number }> = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    weeklyActivity.push({
      date: iso,
      label: iso.slice(5),
      minutes: weeklyMap.get(iso) ?? 0,
    });
  }

  const masteryRows = db
    .prepare(`SELECT concept_id, mastery_level FROM knowledge_mastery WHERE user_id = ? ORDER BY mastery_level ASC`)
    .all(userId) as Array<{ concept_id: string; mastery_level: number }>;

  const achievementsRows = db
    .prepare(`SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ? ORDER BY unlocked_at DESC`)
    .all(userId) as Array<{ achievement_id: string; unlocked_at: string }>;

  const streakDays = calculateStreakDays(userId);
  if (streakDays >= 7) {
    unlockAchievement(userId, 'ach_streak_7');
  }

  const exerciseSuccessRate =
    exerciseBestRows.length > 0
      ? Math.round(exerciseBestRows.reduce((sum, r) => sum + r.best_score, 0) / exerciseBestRows.length)
      : 0;

  const avgScore =
    examAvgRow.avg_score !== null
      ? Math.round(examAvgRow.avg_score)
      : exerciseSuccessRate;

  res.json({
    user,
    stats: {
      streakDays,
      completedLessonsCount: completedLessons.length,
      totalStudyMinutes: Math.round((studyTotals.total_sec ?? 0) / 60),
      todayStudyMinutes: Math.round((todaySecRow.today_sec ?? 0) / 60),
      averageScore: avgScore,
      exerciseSuccessRate,
      solvedExercisesCount: exerciseBestRows.filter((r) => r.best_score === 100).length,
      examsPassedCount: (
        db
          .prepare(`SELECT COUNT(DISTINCT examination_id) AS cnt FROM examination_attempts WHERE user_id = ? AND passed = 1`)
          .get(userId) as { cnt: number }
      ).cnt,
    },
    weeklyActivity,
    mastery: masteryRows,
    weakTopics: masteryRows.filter((m) => m.mastery_level < 70).slice(0, 4),
    achievements: achievementsRows,
    lastCompletedLessonId: completedLessons[0]?.lesson_id ?? null,
  });
});

app.post('/api/study-sessions', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const durationSeconds = Math.max(10, Math.min(3600, Number(req.body?.durationSeconds) || 60));
  const activityType = String(req.body?.activityType || 'lesson').slice(0, 32);

  db.prepare(
    `INSERT INTO study_sessions (user_id, duration_seconds, activity_type) VALUES (?, ?, ?)`,
  ).run(userId, durationSeconds, activityType);

  if (calculateStreakDays(userId) >= 7) {
    unlockAchievement(userId, 'ach_streak_7');
  }
  res.json({ ok: true });
});

// Lesson Progress
app.get('/api/progress', requireAuth, (req: AuthenticatedRequest, res) => {
  const rows = db
    .prepare(`SELECT lesson_id, status, completion_percentage, bookmarked, quiz_score, started_at, completed_at FROM lesson_progress WHERE user_id = ?`)
    .all(req.user!.id);
  res.json({ progress: rows });
});

app.post('/api/lessons/:lessonId/progress', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const { lessonId } = req.params;
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }

  const { status, bookmarked, quizScore } = req.body ?? {};
  const existing = db
    .prepare(`SELECT status, bookmarked, quiz_score FROM lesson_progress WHERE user_id = ? AND lesson_id = ?`)
    .get(userId, lessonId) as { status: string; bookmarked: number; quiz_score: number | null } | undefined;

  const nextStatus = status === 'completed' || status === 'in_progress' ? status : existing?.status ?? 'in_progress';
  const nextPct = nextStatus === 'completed' ? 100 : 50;
  const nextBookmark = typeof bookmarked === 'boolean' ? (bookmarked ? 1 : 0) : existing?.bookmarked ?? 0;
  const nextQuiz = typeof quizScore === 'number' ? Math.max(0, Math.min(100, quizScore)) : existing?.quiz_score ?? null;

  db.prepare(`
    INSERT INTO lesson_progress (user_id, lesson_id, status, completion_percentage, bookmarked, quiz_score, started_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), CASE WHEN ? = 'completed' THEN datetime('now') ELSE NULL END)
    ON CONFLICT(user_id, lesson_id) DO UPDATE SET
      status = excluded.status,
      completion_percentage = excluded.completion_percentage,
      bookmarked = excluded.bookmarked,
      quiz_score = COALESCE(excluded.quiz_score, lesson_progress.quiz_score),
      completed_at = CASE WHEN excluded.status = 'completed' THEN COALESCE(lesson_progress.completed_at, datetime('now')) ELSE lesson_progress.completed_at END
  `).run(userId, lessonId, nextStatus, nextPct, nextBookmark, nextQuiz, nextStatus);

  const newlyUnlocked: string[] = [];
  if (nextStatus === 'completed') {
    updateConceptMastery(userId, lesson.conceptId, nextQuiz !== null ? nextQuiz : 85);
    db.prepare(`INSERT INTO study_sessions (user_id, duration_seconds, activity_type) VALUES (?, ?, 'lesson')`).run(
      userId,
      Math.min(1800, lesson.estimatedMinutes * 30),
    );
    const totalDone = (
      db.prepare(`SELECT COUNT(*) AS cnt FROM lesson_progress WHERE user_id = ? AND status = 'completed'`).get(userId) as { cnt: number }
    ).cnt;
    if (totalDone >= 1 && unlockAchievement(userId, 'ach_first_lesson')) newlyUnlocked.push('ach_first_lesson');
    if (totalDone >= 5 && unlockAchievement(userId, 'ach_five_lessons')) newlyUnlocked.push('ach_five_lessons');
  }

  res.json({ ok: true, newlyUnlocked });
});

// Code Lab Files & Sandboxed Python Execution
app.get('/api/code-files', requireAuth, (req: AuthenticatedRequest, res) => {
  const files = db
    .prepare(`SELECT filename, content, updated_at FROM code_files WHERE user_id = ? ORDER BY filename ASC`)
    .all(req.user!.id);
  res.json({ files });
});

app.put('/api/code-files/:filename', requireAuth, (req: AuthenticatedRequest, res) => {
  const filename = String(req.params.filename ?? '').trim();
  if (!/^[a-zA-Z0-9._-]{1,64}\.py$/.test(filename)) {
    res.status(400).json({ error: 'Invalid Python filename. Use letters, numbers, underscores, and .py extension.' });
    return;
  }
  const content = String(req.body?.content ?? '').slice(0, 40_000);
  db.prepare(`
    INSERT INTO code_files (user_id, filename, content, updated_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(user_id, filename) DO UPDATE SET content = excluded.content, updated_at = datetime('now')
  `).run(req.user!.id, filename, content);

  res.json({ ok: true });
});

app.delete('/api/code-files/:filename', requireAuth, (req: AuthenticatedRequest, res) => {
  const filename = String(req.params.filename ?? '').trim();
  db.prepare(`DELETE FROM code_files WHERE user_id = ? AND filename = ?`).run(req.user!.id, filename);
  res.json({ ok: true });
});

app.post('/api/execute', requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const code = String(req.body?.code ?? '');
  const stdin = String(req.body?.stdin ?? '');

  const userFilesRows = db
    .prepare(`SELECT filename, content FROM code_files WHERE user_id = ?`)
    .all(userId) as Array<{ filename: string; content: string }>;
  const extraFiles: Record<string, string> = {};
  for (const f of userFilesRows) {
    extraFiles[f.filename] = f.content;
  }

  const result = await runPythonCode(code, stdin, extraFiles);
  let unlocked: string | null = null;
  if (result.exitCode === 0 && !result.timedOut && !result.blockedReason) {
    if (unlockAchievement(userId, 'ach_first_program')) {
      unlocked = 'ach_first_program';
    }
    db.prepare(`INSERT INTO study_sessions (user_id, duration_seconds, activity_type) VALUES (?, 120, 'code_lab')`).run(userId);
  }

  res.json({ result, unlockedAchievement: unlocked });
});

// Exercises & Automated Testing
app.get('/api/exercises/submissions', requireAuth, (req: AuthenticatedRequest, res) => {
  const rows = db
    .prepare(`SELECT id, exercise_id, source_code, passed_count, total_count, score, submitted_at FROM exercise_submissions WHERE user_id = ? ORDER BY submitted_at DESC`)
    .all(req.user!.id);
  res.json({ submissions: rows });
});

app.post('/api/exercises/:id/run', requireAuth, async (req: AuthenticatedRequest, res) => {
  const exercise = EXERCISES.find((ex) => ex.id === req.params.id);
  if (!exercise) {
    res.status(404).json({ error: 'Exercise not found' });
    return;
  }
  const code = String(req.body?.code ?? '');
  const visibleOnly = exercise.testCases.filter((tc) => !tc.isHidden);
  const result = await runExerciseTests(code, visibleOnly);
  res.json({ result });
});

app.post('/api/exercises/:id/submit', requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const exercise = EXERCISES.find((ex) => ex.id === req.params.id);
  if (!exercise) {
    res.status(404).json({ error: 'Exercise not found' });
    return;
  }
  const code = String(req.body?.code ?? '');
  const result = await runExerciseTests(code, exercise.testCases);

  db.prepare(`
    INSERT INTO exercise_submissions (user_id, exercise_id, source_code, passed_count, total_count, test_result_json, score)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, exercise.id, code, result.passedCount, result.totalCount, JSON.stringify(result.outcomes), result.score);

  updateConceptMastery(userId, exercise.courseId, result.score);
  db.prepare(`INSERT INTO study_sessions (user_id, duration_seconds, activity_type) VALUES (?, 300, 'exercise')`).run(userId);

  let unlocked: string | null = null;
  if (result.score === 100 && unlockAchievement(userId, 'ach_first_exercise')) {
    unlocked = 'ach_first_exercise';
  }

  res.json({ result, unlockedAchievement: unlocked });
});

app.post('/api/exercises/:id/hint', requireAuth, async (req: AuthenticatedRequest, res) => {
  const exercise = EXERCISES.find((ex) => ex.id === req.params.id);
  if (!exercise) {
    res.status(404).json({ error: 'Exercise not found' });
    return;
  }
  const user = getUserSummary(req.user!.id);
  const lang = user?.preferredLanguage ?? 'uz';
  try {
    const hint = await generateExerciseHint({
      exerciseTitle: exercise.title[lang],
      instructions: exercise.instructions[lang],
      studentCode: String(req.body?.code ?? ''),
      language: lang,
    });
    res.json({ hint });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'AI hint service error';
    res.status(502).json({ error: msg });
  }
});

// Examinations
app.get('/api/exams/attempts', requireAuth, (req: AuthenticatedRequest, res) => {
  const attempts = db
    .prepare(`SELECT id, examination_id, score, passed, started_at, completed_at FROM examination_attempts WHERE user_id = ? ORDER BY completed_at DESC`)
    .all(req.user!.id);
  res.json({ attempts });
});

app.post('/api/exams/:id/submit', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const allExams = [DIAGNOSTIC_EXAM, ...EXAMINATIONS];
  const exam = allExams.find((e) => e.id === req.params.id);
  if (!exam) {
    res.status(404).json({ error: 'Examination not found' });
    return;
  }

  const answers = (req.body?.answers ?? {}) as Record<string, number>;
  const startedAt = String(req.body?.startedAt ?? new Date().toISOString());

  let correctCount = 0;
  const breakdown = exam.questions.map((q) => {
    const selected = typeof answers[q.id] === 'number' ? answers[q.id] : -1;
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correctCount += 1;
    updateConceptMastery(userId, q.conceptId, isCorrect ? 100 : 30);
    return {
      questionId: q.id,
      selectedIndex: selected,
      correctIndex: q.correctIndex,
      isCorrect,
    };
  });

  const score = Math.round((correctCount / exam.questions.length) * 100);
  const passed = score >= exam.passingScore;

  db.prepare(`
    INSERT INTO examination_attempts (user_id, examination_id, answers_json, score, passed, started_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, exam.id, JSON.stringify(answers), score, passed ? 1 : 0, startedAt);

  db.prepare(`INSERT INTO study_sessions (user_id, duration_seconds, activity_type) VALUES (?, 480, 'exam')`).run(userId);

  let unlocked: string | null = null;
  if (passed && exam.id !== DIAGNOSTIC_EXAM.id && unlockAchievement(userId, 'ach_first_exam')) {
    unlocked = 'ach_first_exam';
  }

  res.json({
    score,
    passed,
    correctCount,
    totalCount: exam.questions.length,
    breakdown,
    unlockedAchievement: unlocked,
  });
});

// Projects
app.get('/api/projects', requireAuth, (req: AuthenticatedRequest, res) => {
  const rows = db
    .prepare(`SELECT project_id, status, milestones_json, workspace_code, started_at, completed_at FROM user_projects WHERE user_id = ?`)
    .all(req.user!.id);
  res.json({ userProjects: rows });
});

app.put('/api/projects/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const project = PROJECTS.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const milestones = Array.isArray(req.body?.completedMilestones)
    ? (req.body.completedMilestones as string[])
    : [];
  const workspaceCode = String(req.body?.workspaceCode ?? project.starterCode).slice(0, 40_000);
  const allDone = project.milestones.every((m) => milestones.includes(m.id));
  const status = allDone ? 'completed' : 'in_progress';

  db.prepare(`
    INSERT INTO user_projects (user_id, project_id, status, milestones_json, workspace_code, completed_at)
    VALUES (?, ?, ?, ?, ?, CASE WHEN ? = 'completed' THEN datetime('now') ELSE NULL END)
    ON CONFLICT(user_id, project_id) DO UPDATE SET
      status = excluded.status,
      milestones_json = excluded.milestones_json,
      workspace_code = excluded.workspace_code,
      completed_at = CASE WHEN excluded.status = 'completed' THEN COALESCE(user_projects.completed_at, datetime('now')) ELSE NULL END
  `).run(userId, project.id, status, JSON.stringify(milestones), workspaceCode, status);

  let unlocked: string | null = null;
  if (allDone && unlockAchievement(userId, 'ach_first_project')) {
    unlocked = 'ach_first_project';
  }

  res.json({ ok: true, status, unlockedAchievement: unlocked });
});

// Videos
app.get('/api/videos/progress', requireAuth, (req: AuthenticatedRequest, res) => {
  const rows = db
    .prepare(`SELECT video_id, status, watched_percentage, updated_at FROM user_video_progress WHERE user_id = ?`)
    .all(req.user!.id);
  res.json({ videoProgress: rows });
});

app.put('/api/videos/:id/progress', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const videoId = String(req.params.id);
  const status = req.body?.status === 'watched' ? 'watched' : 'unwatched';
  const pct = status === 'watched' ? 100 : Math.max(0, Math.min(100, Number(req.body?.watchedPercentage) || 0));

  db.prepare(`
    INSERT INTO user_video_progress (user_id, video_id, status, watched_percentage, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_id, video_id) DO UPDATE SET
      status = excluded.status,
      watched_percentage = excluded.watched_percentage,
      updated_at = datetime('now')
  `).run(userId, videoId, status, pct);

  res.json({ ok: true });
});

// Notes with SQLite FTS5 Search
app.get('/api/notes', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const q = String(req.query.q ?? '').trim();

  if (q.length > 0) {
    const safeTokens = q
      .replace(/[^\p{L}\p{N}_ ]+/gu, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => `"${t}"*`)
      .join(' ');

    if (safeTokens) {
      const notes = db
        .prepare(`
          SELECT n.id, n.lesson_id, n.title, n.content, n.code_snippet, n.tags_json, n.created_at, n.updated_at
          FROM notes n
          JOIN notes_fts f ON f.rowid = n.id
          WHERE n.user_id = ? AND notes_fts MATCH ?
          ORDER BY n.updated_at DESC
        `)
        .all(userId, safeTokens);
      res.json({ notes });
      return;
    }
  }

  const notes = db
    .prepare(`
      SELECT id, lesson_id, title, content, code_snippet, tags_json, created_at, updated_at
      FROM notes WHERE user_id = ? ORDER BY updated_at DESC
    `)
    .all(userId);
  res.json({ notes });
});

app.post('/api/notes', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const title = String(req.body?.title ?? '').trim().slice(0, 140);
  const content = String(req.body?.content ?? '').trim().slice(0, 20_000);
  const codeSnippet = String(req.body?.codeSnippet ?? '').slice(0, 10_000);
  const lessonId = req.body?.lessonId ? String(req.body.lessonId) : null;
  const tags = Array.isArray(req.body?.tags) ? req.body.tags.slice(0, 8).map(String) : [];

  if (!title) {
    res.status(400).json({ error: 'Note title is required.' });
    return;
  }

  const info = db
    .prepare(`
      INSERT INTO notes (user_id, lesson_id, title, content, code_snippet, tags_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(userId, lessonId, title, content, codeSnippet, JSON.stringify(tags));

  let unlocked: string | null = null;
  if (unlockAchievement(userId, 'ach_note_taker')) {
    unlocked = 'ach_note_taker';
  }

  const created = db
    .prepare(`SELECT id, lesson_id, title, content, code_snippet, tags_json, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?`)
    .get(Number(info.lastInsertRowid), userId);

  res.status(201).json({ note: created, unlockedAchievement: unlocked });
});

app.put('/api/notes/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const noteId = Number(req.params.id);
  const title = String(req.body?.title ?? '').trim().slice(0, 140);
  const content = String(req.body?.content ?? '').trim().slice(0, 20_000);
  const codeSnippet = String(req.body?.codeSnippet ?? '').slice(0, 10_000);
  const lessonId = req.body?.lessonId ? String(req.body.lessonId) : null;
  const tags = Array.isArray(req.body?.tags) ? req.body.tags.slice(0, 8).map(String) : [];

  if (!title) {
    res.status(400).json({ error: 'Note title is required.' });
    return;
  }

  const resUpdate = db
    .prepare(`
      UPDATE notes
      SET title = ?, content = ?, code_snippet = ?, lesson_id = ?, tags_json = ?, updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `)
    .run(title, content, codeSnippet, lessonId, JSON.stringify(tags), noteId, userId);

  if (Number(resUpdate.changes) === 0) {
    res.status(404).json({ error: 'Note not found.' });
    return;
  }

  res.json({ ok: true });
});

app.delete('/api/notes/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const resDel = db.prepare(`DELETE FROM notes WHERE id = ? AND user_id = ?`).run(Number(req.params.id), req.user!.id);
  if (Number(resDel.changes) === 0) {
    res.status(404).json({ error: 'Note not found.' });
    return;
  }
  res.json({ ok: true });
});

// AI Mentor Conversations & Streaming SSE
app.get('/api/ai/conversations', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const conversations = db
    .prepare(`SELECT id, title, mode, model, created_at FROM ai_conversations WHERE user_id = ? ORDER BY id DESC`)
    .all(userId) as Array<{ id: number; title: string; mode: string; model: string; created_at: string }>;

  const result = conversations.map((c) => {
    const messages = db
      .prepare(`SELECT id, role, content, created_at FROM ai_messages WHERE conversation_id = ? ORDER BY id ASC`)
      .all(c.id);
    return { ...c, messages };
  });

  res.json({ conversations: result });
});

app.post('/api/ai/conversations', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const title = String(req.body?.title ?? 'Yangi suhbat').slice(0, 120);
  const mode = String(req.body?.mode ?? 'teacher').slice(0, 32);

  const info = db
    .prepare(`INSERT INTO ai_conversations (user_id, title, mode, model) VALUES (?, ?, ?, ?)`)
    .run(userId, title, mode, ACTIVE_GEMINI_MODEL);

  res.status(201).json({
    conversation: {
      id: Number(info.lastInsertRowid),
      title,
      mode,
      model: ACTIVE_GEMINI_MODEL,
      created_at: new Date().toISOString(),
      messages: [],
    },
  });
});

app.delete('/api/ai/conversations/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  db.prepare(`DELETE FROM ai_conversations WHERE id = ? AND user_id = ?`).run(Number(req.params.id), req.user!.id);
  res.json({ ok: true });
});

app.post('/api/ai/chat/stream', requireAuth, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const userSummary = getUserSummary(userId);
  if (!userSummary) {
    res.status(404).json({ error: 'User profile not found' });
    return;
  }

  let conversationId = Number(req.body?.conversationId || 0);
  const mode = (req.body?.mode || 'teacher') as MentorMode;
  const userMessage = String(req.body?.message ?? '').trim();
  const activeCode = typeof req.body?.activeCode === 'string' ? req.body.activeCode : undefined;
  const currentLessonId = typeof req.body?.currentLessonId === 'string' ? req.body.currentLessonId : undefined;

  if (!userMessage) {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  if (!conversationId) {
    const info = db
      .prepare(`INSERT INTO ai_conversations (user_id, title, mode, model) VALUES (?, ?, ?, ?)`)
      .run(userId, userMessage.slice(0, 48), mode, ACTIVE_GEMINI_MODEL);
    conversationId = Number(info.lastInsertRowid);
  } else {
    const conv = db
      .prepare(`SELECT id FROM ai_conversations WHERE id = ? AND user_id = ?`)
      .get(conversationId, userId);
    if (!conv) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }
    db.prepare(`UPDATE ai_conversations SET mode = ? WHERE id = ?`).run(mode, conversationId);
  }

  const historyRows = db
    .prepare(`SELECT role, content FROM ai_messages WHERE conversation_id = ? ORDER BY id ASC LIMIT 16`)
    .all(conversationId) as Array<{ role: 'user' | 'model'; content: string }>;

  db.prepare(`INSERT INTO ai_messages (conversation_id, role, content) VALUES (?, 'user', ?)`).run(
    conversationId,
    userMessage,
  );

  const weakRows = db
    .prepare(`SELECT concept_id FROM knowledge_mastery WHERE user_id = ? AND mastery_level < 70 LIMIT 4`)
    .all(userId) as Array<{ concept_id: string }>;

  const currentLesson = currentLessonId ? getLessonById(currentLessonId) : undefined;
  const currentCourse = currentLesson ? getCourseById(currentLesson.courseId) : COURSES[0];

  const studentContext: StudentContext = {
    displayName: userSummary.displayName,
    preferredLanguage: userSummary.preferredLanguage,
    experienceLevel: userSummary.experienceLevel,
    completedLessonsCount: userSummary.completedLessons,
    currentCourseTitle: currentCourse?.title[userSummary.preferredLanguage],
    currentLessonTitle: currentLesson?.title[userSummary.preferredLanguage],
    weakTopics: weakRows.map((w) => w.concept_id),
    activeCode,
  };

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  const controller = new AbortController();
  req.on('close', () => controller.abort());

  res.write(`data: ${JSON.stringify({ type: 'meta', conversationId })}\n\n`);

  try {
    const reply = await streamMentorReply({
      mode,
      context: studentContext,
      history: historyRows,
      userMessage,
      signal: controller.signal,
      onChunk: (delta) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: delta })}\n\n`);
      },
    });

    if (reply.trim()) {
      db.prepare(`INSERT INTO ai_messages (conversation_id, role, content) VALUES (?, 'model', ?)`).run(
        conversationId,
        reply,
      );
    }

    res.write(`data: ${JSON.stringify({ type: 'done', conversationId })}\n\n`);
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gemini streaming error';
    res.write(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`);
    res.end();
  }
});

// Settings & Backup/Restore
app.put('/api/settings', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const {
    preferredLanguage,
    theme,
    dailyGoalMinutes,
    editorFontSize,
    editorTabSize,
    displayName,
  } = req.body ?? {};

  if (typeof displayName === 'string' && displayName.trim().length >= 2) {
    db.prepare(`UPDATE users SET display_name = ? WHERE id = ?`).run(displayName.trim().slice(0, 50), userId);
  }

  const current = getUserSummary(userId)!;
  const nextLang = preferredLanguage === 'en' ? 'en' : preferredLanguage === 'uz' ? 'uz' : current.preferredLanguage;
  const nextTheme = theme === 'light' ? 'light' : theme === 'dark' ? 'dark' : current.theme;
  const nextGoal = dailyGoalMinutes ? Math.max(15, Math.min(240, Number(dailyGoalMinutes))) : current.dailyGoalMinutes;
  const nextFont = editorFontSize ? Math.max(12, Math.min(22, Number(editorFontSize))) : current.editorFontSize;
  const nextTab = editorTabSize === 2 || editorTabSize === 4 ? editorTabSize : current.editorTabSize;

  db.prepare(`
    UPDATE user_profiles
    SET preferred_language = ?, theme = ?, daily_goal_minutes = ?, editor_font_size = ?, editor_tab_size = ?
    WHERE user_id = ?
  `).run(nextLang, nextTheme, nextGoal, nextFont, nextTab, userId);

  res.json({ user: getUserSummary(userId) });
});

app.get('/api/backup/export', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const payload = {
    exportedAt: new Date().toISOString(),
    app: 'Python Mastery',
    version: '1.0.0',
    profile: getUserSummary(userId),
    lessonProgress: db.prepare(`SELECT lesson_id, status, completion_percentage, bookmarked, quiz_score, completed_at FROM lesson_progress WHERE user_id = ?`).all(userId),
    notes: db.prepare(`SELECT lesson_id, title, content, code_snippet, tags_json, created_at FROM notes WHERE user_id = ?`).all(userId),
    codeFiles: db.prepare(`SELECT filename, content FROM code_files WHERE user_id = ?`).all(userId),
    videoProgress: db.prepare(`SELECT video_id, status, watched_percentage FROM user_video_progress WHERE user_id = ?`).all(userId),
    achievements: db.prepare(`SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = ?`).all(userId),
  };
  res.json(payload);
});

app.post('/api/backup/restore', requireAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const data = req.body;
  if (!data || data.app !== 'Python Mastery') {
    res.status(400).json({ error: 'Invalid backup file format.' });
    return;
  }

  try {
    db.exec('BEGIN TRANSACTION;');
    if (Array.isArray(data.codeFiles)) {
      const stmt = db.prepare(`
        INSERT INTO code_files (user_id, filename, content) VALUES (?, ?, ?)
        ON CONFLICT(user_id, filename) DO UPDATE SET content = excluded.content
      `);
      for (const f of data.codeFiles) {
        if (typeof f.filename === 'string' && /^[a-zA-Z0-9._-]{1,64}\.py$/.test(f.filename)) {
          stmt.run(userId, f.filename, String(f.content ?? '').slice(0, 40_000));
        }
      }
    }
    if (Array.isArray(data.lessonProgress)) {
      const stmt = db.prepare(`
        INSERT INTO lesson_progress (user_id, lesson_id, status, completion_percentage, bookmarked, quiz_score, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, lesson_id) DO UPDATE SET
          status = excluded.status,
          completion_percentage = excluded.completion_percentage,
          bookmarked = excluded.bookmarked
      `);
      for (const lp of data.lessonProgress) {
        if (typeof lp.lesson_id === 'string' && getLessonById(lp.lesson_id)) {
          stmt.run(
            userId,
            lp.lesson_id,
            lp.status === 'completed' ? 'completed' : 'in_progress',
            Number(lp.completion_percentage) || 0,
            lp.bookmarked ? 1 : 0,
            lp.quiz_score ?? null,
            lp.completed_at ?? null,
          );
        }
      }
    }
    if (Array.isArray(data.notes)) {
      const stmt = db.prepare(`
        INSERT INTO notes (user_id, lesson_id, title, content, code_snippet, tags_json)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const n of data.notes) {
        if (typeof n.title === 'string' && n.title.trim()) {
          stmt.run(
            userId,
            n.lesson_id ?? null,
            String(n.title).slice(0, 140),
            String(n.content ?? '').slice(0, 20_000),
            String(n.code_snippet ?? '').slice(0, 10_000),
            typeof n.tags_json === 'string' ? n.tags_json : '[]',
          );
        }
      }
    }
    db.exec('COMMIT;');
    res.json({ ok: true });
  } catch (err) {
    db.exec('ROLLBACK;');
    res.status(500).json({ error: err instanceof Error ? err.message : 'Restore failed' });
  }
});

const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Python Mastery server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
