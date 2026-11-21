import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'python_mastery.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

export function initializeDatabase(): void {
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      password_hash TEXT,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_active_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id INTEGER PRIMARY KEY,
      preferred_language TEXT NOT NULL DEFAULT 'uz',
      theme TEXT NOT NULL DEFAULT 'dark',
      experience_level TEXT NOT NULL DEFAULT 'beginner',
      daily_goal_minutes INTEGER NOT NULL DEFAULT 60,
      learning_goal TEXT NOT NULL DEFAULT 'junior_dev',
      explanation_style TEXT NOT NULL DEFAULT 'practical',
      onboarding_completed INTEGER NOT NULL DEFAULT 0,
      placement_score INTEGER,
      avatar_color TEXT NOT NULL DEFAULT '#16A36A',
      editor_font_size INTEGER NOT NULL DEFAULT 14,
      editor_tab_size INTEGER NOT NULL DEFAULT 4,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'not_started',
      completion_percentage INTEGER NOT NULL DEFAULT 0,
      bookmarked INTEGER NOT NULL DEFAULT 0,
      quiz_score INTEGER,
      started_at TEXT,
      completed_at TEXT,
      UNIQUE (user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exercise_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      exercise_id TEXT NOT NULL,
      source_code TEXT NOT NULL,
      passed_count INTEGER NOT NULL DEFAULT 0,
      total_count INTEGER NOT NULL DEFAULT 0,
      test_result_json TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS examination_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      examination_id TEXT NOT NULL,
      answers_json TEXT NOT NULL,
      score INTEGER NOT NULL,
      passed INTEGER NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_progress',
      milestones_json TEXT NOT NULL DEFAULT '[]',
      workspace_code TEXT NOT NULL DEFAULT '',
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      UNIQUE (user_id, project_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      activity_type TEXT NOT NULL DEFAULT 'lesson',
      study_date TEXT NOT NULL DEFAULT (date('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS knowledge_mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      concept_id TEXT NOT NULL,
      mastery_level INTEGER NOT NULL DEFAULT 0,
      confidence_score REAL NOT NULL DEFAULT 0,
      last_assessed_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, concept_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      mode TEXT NOT NULL DEFAULT 'teacher',
      model TEXT NOT NULL DEFAULT 'gemini-4-hydrogen',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_video_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      video_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unwatched',
      watched_percentage INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, video_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id TEXT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      code_snippet TEXT NOT NULL DEFAULT '',
      tags_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
      title,
      content,
      code_snippet,
      content='notes',
      content_rowid='id'
    );

    CREATE TRIGGER IF NOT EXISTS notes_ai AFTER INSERT ON notes BEGIN
      INSERT INTO notes_fts(rowid, title, content, code_snippet)
      VALUES (new.id, new.title, new.content, new.code_snippet);
    END;

    CREATE TRIGGER IF NOT EXISTS notes_ad AFTER DELETE ON notes BEGIN
      INSERT INTO notes_fts(notes_fts, rowid, title, content, code_snippet)
      VALUES('delete', old.id, old.title, old.content, old.code_snippet);
    END;

    CREATE TRIGGER IF NOT EXISTS notes_au AFTER UPDATE ON notes BEGIN
      INSERT INTO notes_fts(notes_fts, rowid, title, content, code_snippet)
      VALUES('delete', old.id, old.title, old.content, old.code_snippet);
      INSERT INTO notes_fts(rowid, title, content, code_snippet)
      VALUES (new.id, new.title, new.content, new.code_snippet);
    END;

    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      achievement_id TEXT NOT NULL,
      unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, achievement_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS code_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, filename),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      UNIQUE (user_id, key),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_sub_user ON exercise_submissions(user_id, exercise_id);
    CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON examination_attempts(user_id);
    CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, study_date);
    CREATE INDEX IF NOT EXISTS idx_ai_conv_user ON ai_conversations(user_id);
    CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
  `);
}

export function getDatabaseFileStats(): { path: string; sizeBytes: number } {
  const stat = fs.existsSync(DB_PATH) ? fs.statSync(DB_PATH) : { size: 0 };
  return { path: 'data/python_mastery.db', sizeBytes: stat.size };
}
