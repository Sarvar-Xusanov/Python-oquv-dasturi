# Error Handling & Sandbox Safety — Python Mastery

## 1. User-Facing Errors
- Internal stack traces, SQLite queries, and server secrets (`GEMINI_API_KEY`) are never exposed to the browser.
- Validation and runtime failures return concise, actionable JSON `{ error: "..." }` messages.

## 2. Python Sandbox Protections (`server/sandbox.ts`)
- **Cross-platform interpreter resolution**: selects `python3`/`python` on Unix/macOS and `python`/`py -3` on Windows.
- **Process isolation**: runs in a temporary UUID workspace with `python -I -B` (isolated mode, no user-site packages, no bytecode).
- **Environment stripping**: excludes `GEMINI_API_KEY` and host secrets from child process `env`.
- **Resource caps**: enforces 3.5s execution timeout, 64KB output truncation, 40KB script size limit, and regex blocking for restricted system/network modules (`subprocess`, `socket`, `ctypes`, `os.system`, etc.).
- **Cleanup**: temporary sandbox directories are removed in a `finally` block after every execution.

## 3. Data Isolation & Recovery
- All database queries scope strictly by authenticated `user_id` derived from SHA-256 Bearer session tokens (`sessions` table).
- Learners can export and restore complete personal progress JSON backups from the Settings screen.
