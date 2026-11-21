import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
  blockedReason?: string;
}

export interface ExerciseTestCase {
  id: string;
  label: string;
  callExpression: string;
  expectedOutput: string;
  expectedError?: string;
  isHidden?: boolean;
}

export interface ExerciseTestOutcome {
  id: string;
  label: string;
  passed: boolean;
  isHidden: boolean;
  expected?: string;
  actual?: string;
  error?: string;
}

export interface ExerciseRunResult {
  passedCount: number;
  totalCount: number;
  score: number;
  outcomes: ExerciseTestOutcome[];
  stderr: string;
  timedOut: boolean;
  durationMs: number;
  blockedReason?: string;
}

const MAX_OUTPUT_BYTES = 64 * 1024;
const EXECUTION_TIMEOUT_MS = 3500;

const BLOCKED_MODULE_PATTERNS: Array<{ regex: RegExp; reason: string }> = [
  {
    regex: /\b(import|from)\s+(subprocess|shutil|socket|ctypes|pty|fcntl|resource|multiprocessing|webbrowser|http\.server|urllib|ftplib|smtplib|telnetlib)\b/,
    reason: 'Security sandbox policy: restricted system/network module is not permitted in practice mode.',
  },
  {
    regex: /\b__import__\s*\(/,
    reason: 'Security sandbox policy: dynamic __import__() is not permitted.',
  },
  {
    regex: /\bos\s*\.\s*(system|popen|exec|spawn|fork|kill|remove|unlink|rmdir|chmod|chown|environ)/,
    reason: 'Security sandbox policy: OS process/environment mutation is blocked.',
  },
  {
    regex: /\bopen\s*\(\s*['"](\/etc|\/proc|\/sys|\/var|\/root|\/home|~|\.\.)/,
    reason: 'Security sandbox policy: accessing paths outside the temporary sandbox workspace is blocked.',
  },
];

export function validateSandboxCode(code: string): string | null {
  if (typeof code !== 'string') {
    return 'Code must be a string.';
  }
  if (code.length > 40_000) {
    return 'Code exceeds 40,000 character sandbox limit.';
  }
  for (const rule of BLOCKED_MODULE_PATTERNS) {
    if (rule.regex.test(code)) {
      return rule.reason;
    }
  }
  return null;
}

function createIsolatedWorkspace(): string {
  const id = crypto.randomUUID();
  const dir = path.join(os.tmpdir(), `pm_sandbox_${id}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function cleanupWorkspace(dir: string): void {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors on already-removed temp paths
  }
}

export async function runPythonCode(
  code: string,
  stdinText = '',
  extraFiles: Record<string, string> = {},
): Promise<ExecutionResult> {
  const blocked = validateSandboxCode(code);
  if (blocked) {
    return {
      stdout: '',
      stderr: blocked,
      exitCode: 1,
      timedOut: false,
      durationMs: 0,
      blockedReason: blocked,
    };
  }

  const workspaceDir = createIsolatedWorkspace();
  const scriptPath = path.join(workspaceDir, 'main.py');

  try {
    fs.writeFileSync(scriptPath, code, 'utf8');

    for (const [name, content] of Object.entries(extraFiles)) {
      const safeName = path.basename(name);
      if (!safeName || safeName === 'main.py' || !/^[a-zA-Z0-9._-]+$/.test(safeName)) {
        continue;
      }
      const targetPath = path.resolve(workspaceDir, safeName);
      if (targetPath.startsWith(workspaceDir + path.sep)) {
        fs.writeFileSync(targetPath, String(content).slice(0, 40_000), 'utf8');
      }
    }

    return await executePythonFile(workspaceDir, scriptPath, stdinText);
  } finally {
    cleanupWorkspace(workspaceDir);
  }
}

async function executePythonFile(
  cwd: string,
  scriptPath: string,
  stdinText: string,
): Promise<ExecutionResult> {
  const startedAt = Date.now();

  return new Promise((resolve) => {
    const child = spawn('python3', ['-I', '-B', scriptPath], {
      cwd,
      env: {
        PATH: '/usr/local/bin:/usr/bin:/bin',
        HOME: cwd,
        TMPDIR: cwd,
        LANG: 'C.UTF-8',
        PYTHONIOENCODING: 'utf-8',
        PYTHONDONTWRITEBYTECODE: '1',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let outputExceeded = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, EXECUTION_TIMEOUT_MS);

    child.stdout.on('data', (chunk: Buffer) => {
      if (stdout.length + chunk.length > MAX_OUTPUT_BYTES) {
        stdout += chunk.toString('utf8').slice(0, MAX_OUTPUT_BYTES - stdout.length);
        stdout += '\n[Output truncated at 64KB sandbox limit]';
        outputExceeded = true;
        child.kill('SIGKILL');
        return;
      }
      stdout += chunk.toString('utf8');
    });

    child.stderr.on('data', (chunk: Buffer) => {
      if (stderr.length + chunk.length > MAX_OUTPUT_BYTES) {
        stderr += chunk.toString('utf8').slice(0, MAX_OUTPUT_BYTES - stderr.length);
        outputExceeded = true;
        child.kill('SIGKILL');
        return;
      }
      stderr += chunk.toString('utf8');
    });

    if (stdinText) {
      child.stdin.write(stdinText.slice(0, 8192));
    }
    child.stdin.end();

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr: `Python runner error: ${err.message}`,
        exitCode: 1,
        timedOut: false,
        durationMs: Date.now() - startedAt,
      });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut && !stderr) {
        stderr = `Execution timed out after ${EXECUTION_TIMEOUT_MS / 1000}s.`;
      } else if (outputExceeded && !stderr) {
        stderr = 'Output exceeded 64KB limit.';
      }
      resolve({
        stdout,
        stderr,
        exitCode: code,
        timedOut,
        durationMs: Date.now() - startedAt,
      });
    });
  });
}

export async function runExerciseTests(
  userCode: string,
  testCases: ExerciseTestCase[],
): Promise<ExerciseRunResult> {
  const blocked = validateSandboxCode(userCode);
  if (blocked) {
    return {
      passedCount: 0,
      totalCount: testCases.length,
      score: 0,
      outcomes: testCases.map((tc) => ({
        id: tc.id,
        label: tc.isHidden ? 'Hidden evaluation test' : tc.label,
        passed: false,
        isHidden: Boolean(tc.isHidden),
        error: blocked,
      })),
      stderr: blocked,
      timedOut: false,
      durationMs: 0,
      blockedReason: blocked,
    };
  }

  const workspaceDir = createIsolatedWorkspace();
  const userModulePath = path.join(workspaceDir, 'solution.py');
  const harnessPath = path.join(workspaceDir, 'run_tests.py');

  const serializedTests = JSON.stringify(
    testCases.map((tc) => ({
      id: tc.id,
      label: tc.label,
      call: tc.callExpression,
      expected: tc.expectedOutput,
      expectedError: tc.expectedError ?? null,
      isHidden: Boolean(tc.isHidden),
    })),
  );

  const harnessCode = `import io
import os
import sys
import json
import contextlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

TESTS = json.loads(${JSON.stringify(serializedTests)})
results = []

for tc in TESTS:
    buf = io.StringIO()
    ok = False
    err_msg = None
    actual_str = ""
    try:
        ns = {}
        with contextlib.redirect_stdout(buf):
            import solution
            import importlib
            importlib.reload(solution)
            ns = vars(solution)
            val = eval(tc["call"], ns)
            printed = buf.getvalue().strip()
            actual_str = repr(val) if val is not None else printed
            if tc["expected"] == "__STDOUT__":
                actual_str = printed
        if tc["expectedError"]:
            ok = False
            err_msg = f"Expected {tc['expectedError']}, but no exception was raised"
        else:
            expected_str = tc["expected"]
            ok = str(actual_str).strip() == str(expected_str).strip()
    except Exception as exc:
        if tc["expectedError"] and type(exc).__name__ == tc["expectedError"]:
            ok = True
            actual_str = type(exc).__name__
        else:
            err_msg = f"{type(exc).__name__}: {exc}"
    results.append({
        "id": tc["id"],
        "label": "Yashirin test (Hidden test)" if tc["isHidden"] else tc["label"],
        "passed": ok,
        "isHidden": tc["isHidden"],
        "expected": None if tc["isHidden"] else tc["expected"],
        "actual": None if tc["isHidden"] else actual_str,
        "error": "Test muvaffaqiyatsiz tugadi" if (tc["isHidden"] and err_msg) else err_msg,
    })

print("__PM_TEST_RESULTS__" + json.dumps(results))
`;

  try {
    fs.writeFileSync(userModulePath, userCode, 'utf8');
    fs.writeFileSync(harnessPath, harnessCode, 'utf8');

    const execRes = await executePythonFile(workspaceDir, harnessPath, '');
    const marker = '__PM_TEST_RESULTS__';
    const markerIdx = execRes.stdout.indexOf(marker);

    if (markerIdx === -1) {
      return {
        passedCount: 0,
        totalCount: testCases.length,
        score: 0,
        outcomes: testCases.map((tc) => ({
          id: tc.id,
          label: tc.isHidden ? 'Yashirin test (Hidden test)' : tc.label,
          passed: false,
          isHidden: Boolean(tc.isHidden),
          error: execRes.stderr || 'Runtime error during test execution',
        })),
        stderr: execRes.stderr,
        timedOut: execRes.timedOut,
        durationMs: execRes.durationMs,
      };
    }

    const jsonStr = execRes.stdout.slice(markerIdx + marker.length).trim();
    const outcomes = JSON.parse(jsonStr) as ExerciseTestOutcome[];
    const passedCount = outcomes.filter((o) => o.passed).length;
    const totalCount = outcomes.length;
    const score = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

    return {
      passedCount,
      totalCount,
      score,
      outcomes,
      stderr: execRes.stderr,
      timedOut: execRes.timedOut,
      durationMs: execRes.durationMs,
    };
  } finally {
    cleanupWorkspace(workspaceDir);
  }
}
