# PROJECT STATUS — Python Mastery

## Current Development Phase
**Phase 8 / Release Readiness (Verified Full-Stack Educational Platform)**

## Architectural Adaptation Note
The original Master Prompt envisioned a PySide6 desktop GUI. For reliable cross-platform delivery inside a unified full-stack workspace, **Python Mastery** is implemented as a **React 19 + TypeScript + Vite 8 + Express + `node:sqlite` + real Python 3 subprocess sandbox** application served on port `3000`, with desktop-grade three-pane lesson navigation, CodeMirror 6 IDE (`stdin`, tabs, file persistence), offline local SQLite storage, and server-side Gemini AI Mentor streaming.

---

## Completed Tasks
- **Core Shell & Localization (`src/data/localization.ts`, `src/App.tsx`)**:
  - Uzbek-first UI with instant English language switching and persistent user preferences.
  - Dark Emerald & Light themes, collapsible sidebar across 14 screens, global search across courses/lessons/exercises.
- **Database & Auth (`server/db.ts`, `server/auth.ts`, `server.ts`)**:
  - Normalized SQLite schema (`users`, `user_profiles`, `sessions`, `lesson_progress`, `exercise_submissions`, `examination_attempts`, `user_projects`, `study_sessions`, `knowledge_mastery`, `ai_conversations`, `ai_messages`, `user_video_progress`, `notes`, `notes_fts`, `user_achievements`, `code_files`, `settings`) with WAL mode, foreign keys, and FTS5 full-text search triggers.
  - Local multi-profile sign-in / registration with SHA-256 session tokens and JSON backup export/restore.
- **Complete 17-Course / 196-Lesson Curriculum (`src/data/courses_catalog.ts`, `src/data/lessons/*.ts`)**:
  - **17 courses**, **71 modules**, **196 full-depth bilingual (UZ + EN) lessons**.
  - Every lesson includes learning objectives, detailed theory sections, visual diagrams/tables, **3 runnable code examples** (588 total), execution trace table, common mistakes, compare & choose, **5 practice tasks** (980 total), **5 quiz questions** (980 total), homework assignment, and **39 sequential milestone review checkpoints** (every 5th lesson).
- **Code Lab & Isolated Python 3 Execution (`server/sandbox.ts`, `CodeLabScreen.tsx`)**:
  - Multi-file `.py` editor with CodeMirror 6 syntax highlighting, `stdin` support, and persisted user files.
  - Runs user code in an isolated `python -I -B` subprocess inside an ephemeral temp workspace with 3.5s timeout, 64KB output cap, stripped host environment (`GEMINI_API_KEY` removed), and regex blocks on system/network modules (`subprocess`, `socket`, `ctypes`, `urllib`, `os.system`, etc.).
- **Exercises, Examinations & Projects (`src/data/exercises.ts`, `src/data/exams_and_projects.ts`)**:
  - **12 auto-graded coding exercises** (`EX-001`–`EX-012`) with visible + hidden test cases and 3-tier progressive hints + optional AI hints.
  - **4 examinations** (`EXAM-DIAGNOSTIC`, `EXAM-01`, `EXAM-02`, `EXAM-03`) integrated with concept mastery updates and spaced repetition review scheduling (`1/3/7/14/30d`).
  - **3 multi-milestone projects** (`PRJ-01`–`PRJ-03`), Video Catalog, Searchable Glossary, Analytics (CSV/Print export), and Achievements.
- **AI Mentor (`server/gemini.ts`, `AiMentorScreen.tsx`)**:
  - Server-side `@google/genai` SSE streaming across 7 pedagogical modes (`teacher`, `debugger`, `reviewer`, `practice_coach`, `socratic`, `project_mentor`, `exam_evaluator`) with student progress & editor context injection.

---

## Sandbox Security Boundary (Honest Documentation)
- **What is enforced**: Python runs via `spawn(..., ['-I', '-B', scriptPath])` inside an auto-cleaned per-execution temp directory with stripped environment variables, 3.5s hard kill timeout, 64KB stdout/stderr cap, and static AST/regex blocking of sensitive system/network modules and parent-path file opens.
- **Known boundary**: Because execution runs as a standard OS subprocess without container/seccomp-bpf/cgroups isolation, it is designed as a safe educational sandbox for local/single-tenant execution rather than hardened multi-tenant untrusted cloud execution.

---

## Test & Verification Results
- **`npx tsc --noEmit`**: Passed (0 TypeScript errors).
- **`npm run validate:content`** (`scripts/validate_content.ts`):
  - **Courses**: 17 | **Modules**: 71 | **Lessons**: 196 (196 v2.0 full-depth)
  - **Verified examples**: 588 / 588 passed Python 3 sandbox execution & exact stdout comparison
  - **Quiz questions**: 980 | **DAG Prerequisite Cycle Check**: 0 cycles, all IDs & references valid
- **Practice Tasks, Review Checkpoints & Projects Audit**:
  - **Practice tasks**: 980 / 980 passed Python 3 sandbox execution & expected output check
  - **Review checkpoints**: 39 / 39 passed execution
  - **Capstone projects**: 3 / 3 starter workspaces passed execution
- **Exercise Grader Audit**: 12 / 12 (`EX-001`–`EX-012`) passed 100% with reference solutions in `runExerciseTests`.

---

## Known Bugs & Pending / Optional Future Enhancements
- **Legacy Files Removed**: Cleaned up unused prototype files (`curriculum_core.ts`, `curriculum_pro.ts`) and leftover temp test artifacts.
- **AI Mentor Offline Behavior**: Requires `GEMINI_API_KEY` configured in `.env` on the server; all non-AI features (courses, Code Lab, exercises, exams, notes, projects, analytics) operate fully offline.
- **Future Expansion Opportunities**:
  - Expand `EXERCISES` (`EX-013+`) for Courses 12–17 (SQL, HTTP/REST, FastAPI, Automation, Pandas/ML) and add course-specific checkpoint exams for Courses 12–17.
  - Add downloadable offline video/package cache bundles and automated end-to-end API/UI integration test suite (`vitest` / `playwright`).

## Next Actions
- Keep `npm run validate:content` passing after any future lesson/exercise additions.
- Expand SQL/Data Science interactive exercises in future content iterations.
