import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C15_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-15-01',
    courseId: 'automation',
    moduleId: 'c15_m1',
    order: 1,
    titleUz: 'Python Automation Asoslari — Idempotency, Dry-Run va Atomic Fayl Yozish',
    titleEn: 'Python Automation Foundations: Idempotency, Dry-Run & Atomic Writes',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-14-13'],
    conceptId: 'auto_foundations',
    whyUz: "Har kuni 100 ta faylni qo‘lda tartiblash vaqtni yeydi, lekin yomon yozilgan skript 1 soniyada minglab faylni buzishi mumkin! Professional **Automation** skripti 3 tayanchga quriladi: **Idempotency** (qayta ishlasa zarar qilmaydi), **`--dry-run` rejimi** va **Atomic Operations**.",
    whyEn: 'Design safe Python automation workflows built on Idempotency (safe to re-run), `--dry-run` previews before mutating state, and atomic file replacement.',
    analogyUz: "**`--dry-run`** — jarrohning kesishdan oldingi belgi qo‘yishi (avval rejani ekranga chiqaradi); **Idempotency** esa lift tugmasi — 5 marta bossangiz ham lift 1 marta keladi!",
    analogyEn: 'A `--dry-run` flag previews planned actions before touching disk; idempotency ensures running a script five times yields the exact same clean state as running it once.',
    stopsUz: "3 oltin qoida: 1) O‘chirish/ko‘chirishdan oldin doim **`--dry-run`** qo‘shing! 2) Skript uzilsa qayta yurganda dublikat qilmasin (**Idempotent**). 3) Muhim faylni avval **`.tmp` ga yozib, keyin `Path.replace()`** bilan atomik almashtiring!",
    stopsEn: 'Always provide `--dry-run`, make batch tasks idempotent across retries, and write critical outputs to `.tmp` before swapping atomically via `Path.replace()`.',
    objUz: ['Automation ROI ni baholash', 'Idempotent fayl va holat pipeline larini tuzish', '`--dry-run` plan vs apply va `.tmp` -> `.replace()` atomik yozish'],
    objEn: ['Evaluate automation ROI cleanly', 'Design idempotent pipelines', 'Implement `--dry-run` plans and atomic `.tmp` writes'],
    theoryUz: `### 1. Automation ROI
Tez-tez takrorlanadigan, qoidaga bo‘ysunadigan va inson xatosiga moyil vazifalarni avtomatlashtiring.
### 2. Idempotency
\`mkdir(exist_ok=True)\` va checkpoint tracking bilan skript qayta ishlaganda ham \`FileExistsError\` yoki dublikat bermasin.
### 3. Plan vs Apply (\`--dry-run\`)
Avval sof \`plan_actions()\` ro‘yxatini tuzib, \`dry_run=True\` da faqat chop eting.
### 4. Atomik Yozish
Avval \`out.json.tmp\` ga yozib, so‘ng \`tmp.replace(out)\` qiling — uzilishda yarim fayl qolmaydi.`,
    theoryEn: `### 1. Automation ROI
Target repetitive, rule-based tasks where human slips are costly.
### 2. Idempotency
Use \`exist_ok=True\` and state checkpoints so retries never fail or duplicate work.
### 3. Plan vs Apply (\`--dry-run\`)
Separate pure planning from disk mutations for safe previews and unit tests.
### 4. Atomic Replacement
Write to \`.tmp\` and swap via \`Path.replace()\` so readers never see partial files.`,
    examples: [
      ex('Misol 1: Plan vs Apply (`--dry-run`) Fayl Tartiblagich', 'Example 1: Dry-Run Action Planner', `from pathlib import Path

def plan_organize(files: list[str]) -> list[tuple[str, str]]:
    ext_map = {".py": "code", ".csv": "data", ".log": "logs"}
    return [(f, f"{ext_map.get(Path(f).suffix, 'other')}/{f}") for f in sorted(files)]

def run_organize(files: list[str], dry_run: bool = True) -> list[str]:
    prefix = "[DRY-RUN]" if dry_run else "[APPLIED]"
    return [f"{prefix} {src} -> {dst}" for src, dst in plan_organize(files)]

print("\\n".join(run_organize(["app.py", "sales.csv"], dry_run=True)))
print("\\n".join(run_organize(["app.py"], dry_run=False)))`, `[DRY-RUN] app.py -> code/app.py\n[DRY-RUN] sales.csv -> data/sales.csv\n[APPLIED] app.py -> code/app.py`, 'Rejani bajarishdan ajratish `--dry-run` va toza unit testlashni beradi.', 'Separating planning from mutation supports `--dry-run` previews.'),
      ex('Misol 2: Atomik Fayl Almashtirish (`.tmp -> .replace`)', 'Example 2: Atomic Temp-File Swap', `from pathlib import Path
import json

target = Path("config_out.json")
tmp = Path("config_out.json.tmp")
tmp.write_text(json.dumps({"version": 2, "ok": True}), encoding="utf-8")
tmp.replace(target)
print("Target:", target.exists(), "| Tmp left:", tmp.exists(), "| Data:", target.read_text(encoding="utf-8"))`, `Target: True | Tmp left: False | Data: {"version": 2, "ok": true}`, '`tmp.replace(target)` atomik almashtirish bajaradi.', '`Path.replace()` swaps completed `.tmp` atomically.'),
      ex('Misol 3: Idempotent Batch Checkpoint', 'Example 3: Idempotent Batch Processing', `done = {"a.csv"}
def run(batch: list[str]) -> list[str]:
    added = []
    for f in batch:
        if f not in done:
            done.add(f); added.append(f)
    return added
print("Run 1:", run(["a.csv", "b.csv"]))
print("Run 2:", run(["a.csv", "b.csv"]))`, `Run 1: ['b.csv']\nRun 2: []`, 'Takroriy chaqiruvda dublikat qayta ishlanmaydi.', 'Skipping processed keys ensures idempotency.'),
    ],
    traceTitleUz: 'Plan -> Dry-Run -> Apply Trace',
    traceTitleEn: 'Tracing Dry-Run Execution',
    traceCode: `run_organize(["app.py"], dry_run=True)`,
    traceSteps: [
      traceStep(1, 'plan_organize', '[("app.py", "code/app.py")]', 'Reja hisoblandi', 'Built pure plan'),
      traceStep(2, 'dry_run=True', 'no disk write', 'Faqat preview chiqdi', 'Previewed safely'),
    ],
    commonMistakes: [
      mistake('`--dry-run` siz fayllarni o‘zgartirish/o‘chirish', 'Mutating Files Without Dry-Run', `# Running batch delete without dry-run risks wiping needed data on a typo!`, 'Irreversible data loss', `print("Always add --dry-run preview before mutating files!")`, 'Avval rejani ko‘rib tekshiring.', 'Preview batch plans first.', '`--dry-run` qo‘shing.', 'Add `--dry-run`.'),
      mistake('Faylni to‘g‘ridan-to‘g‘ri `open(dst, "w")` bilan ustidan yozish', 'Non-Atomic Direct Overwrite', `# Crash mid-write leaves corrupted truncated output!`, 'Corrupted partial file', `print("Write to dst.tmp then call tmp.replace(dst)!")`, 'Avval `.tmp` ga yozib `.replace()` qiling.', 'Stage via `.tmp` and swap atomically.', '`.tmp` + `.replace()` ishlating.', 'Use atomic `.replace()`.'),
    ],
    compareTitleUz: 'Ad-hoc Shell vs Python Automation',
    compareTitleEn: 'Shell One-Liners vs Python Automation',
    compareUz: ['Bash: tez 3 qatorli quvurlar.', 'Python: kross-platforma `pathlib`, JSON/CSV, `--dry-run` va testlanadigan tuzilma.'],
    compareEn: ['Shell: quick pipes.', 'Python: portable `pathlib`, structured parsing, `--dry-run`, and unit tests.'],
    compareSummaryUz: 'Automation skriptlarini doim idempotent, `--dry-run` li va atomik `.replace()` bilan yozing.',
    compareSummaryEn: 'Keep automation idempotent, `--dry-run` enabled, and atomic on disk writes.',
    practiceTasks: [
      pt('p1501_1', '1-mashq: Pure Planner', 'Task 1: Pure Action Planner', 'Fayl kengaytmasiga ko‘ra manzil rejasi tuzing.', 'Plan folders.', `def plan(fs): return [(f, "py/" + f if f.endswith(".py") else "other/" + f) for f in fs]\nprint(plan(["a.py", "b.md"]))`, "[('a.py', 'py/a.py'), ('b.md', 'other/b.md')]", 'Return list of tuples', 'Prints planned pairs.'),
      pt('p1501_2', '2-mashq: Dry-Run Bayrog‘i', 'Task 2: Dry-Run Flag', '`dry_run=True` da `"PREVIEW"`, `False` da `"DONE"` chiqaring.', 'Toggle dry_run.', `def act(n, dry=True): return ("PREVIEW:" if dry else "DONE:") + n\nprint(act("sync", True), act("sync", False))`, 'PREVIEW:sync DONE:sync', 'Ternary prefix', 'Prints preview and done.'),
      pt('p1501_3', '3-mashq: Atomik `.replace()`', 'Task 3: Atomic Swap', '`Path("x.tmp")` yozib `Path("x.txt")` ga almashtiring.', 'Atomic swap.', `from pathlib import Path\nt, d = Path("x.tmp"), Path("x.txt")\nt.write_text("v1", encoding="utf-8"); t.replace(d)\nprint(d.read_text(), t.exists())`, 'v1 False', 'Write tmp then replace', 'Prints v1 False.'),
      pt('p1501_4', '4-mashq: `exist_ok=True`', 'Task 4: Idempotent mkdir', 'Papkani 2 marta xatosiz yarating.', 'Idempotent mkdir.', `from pathlib import Path\np = Path("auto_tmp/sub"); p.mkdir(parents=True, exist_ok=True); p.mkdir(parents=True, exist_ok=True)\nprint(p.is_dir())`, 'True', 'exist_ok=True', 'Prints True.'),
      pt('p1501_5', '5-mashq: Audit Counter', 'Task 5: Count Results', 'Applied va skipped sonini sanang.', 'Count outcomes.', `res = ["ok", "skip", "ok"]\nprint(res.count("ok"), res.count("skip"))`, '2 1', 'Use list.count', 'Prints 2 1.'),
    ],
    quiz: [
      q('q1501_1', 'Automation skripti "Idempotent" bo‘lishi nimani anglatadi?', 'What does idempotent mean for automation?', ['Faqat Linux', 'Qayta yuritilganda ham dublikat/xato chiqarmay bir xil natija berishi', 'Tezligi', 'SQL'], ['Linux only', 'Re-running multiple times gives the same safe result without duplicates', 'Speed', 'SQL'], 1, 'Qayta yuritish xavfsiz.', 'Safe across retries.'),
      q('q1501_2', '`--dry-run` nima uchun kerak?', 'Purpose of `--dry-run`?', ['Tezlatish', 'Disk/DB ni o‘zgartirmasdan rejani oldindan ko‘rsatish', 'Shifrlash', 'Compile'], ['Speed', 'Preview planned changes without mutating state', 'Encrypt', 'Compile'], 1, 'Xavfsiz oldindan ko‘rish.', 'Safe preview.'),
      q('q1501_3', 'Fayl yozishda elektr o‘chsa buzilmaslik usuli?', 'How to write files atomically?', ['print()', 'Avval `.tmp` ga yozib `Path.replace()` qilish', 'open("a")', 'eval'], ['print()', 'Stage to `.tmp` then `Path.replace()`', 'append', 'eval'], 1, '`.tmp` + `.replace()`.', 'Atomic `.tmp` swap.'),
      q('q1501_4', 'Nima uchun `plan()` ni `execute()` dan ajratamiz?', 'Why separate `plan()` from `execute()`?', ['Ko‘p kod', 'Unit-test va `--dry-run` ni osonlashtirish', 'CSS', 'Port'], ['More code', 'Easy unit-testing and `--dry-run` previews', 'CSS', 'Port'], 1, 'Test va dry-run uchun.', 'Testable plans.'),
      q('q1501_5', '`Path.mkdir()` da papka bor bo‘lsa xato bermaslik parametri?', 'Parameter avoiding `FileExistsError` in `Path.mkdir()`?', ['force=True', 'exist_ok=True', 'safe=True', 'pass'], ['force=True', 'exist_ok=True', 'safe=True', 'pass'], 1, '`exist_ok=True`.', '`exist_ok=True`.'),
    ],
    homework: hw('Dry-Run Fayl Tartiblagich', 'Idempotent File Organizer', '`dry_run` rejimi, idempotent checkpoint va `.tmp -> .replace` JSON hisobotli fayl tartiblagich tuzing.', 'Build a dry-run, idempotent file organizer emitting an atomic JSON summary report.', ['Plan/Apply + dry_run', 'Atomik JSON hisobot'], ['Plan/Apply + dry_run', 'Atomic JSON report'], 'Compute plan list before applying.', 'Safe automation.', 'Eski fayllar filtrini qo‘shing.', 'Add age filter.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-15-02',
    courseId: 'automation',
    moduleId: 'c15_m1',
    order: 2,
    titleUz: 'Operating System bilan Ishlash — Jarayonlar, Ruxsatlar va Kross-Platforma',
    titleEn: 'Working with the OS: Processes, Permissions, Signals & Portability',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-15-01'],
    conceptId: 'auto_os_concepts',
    whyUz: "Windows dagi `\\` Linux serverda ishlamaydi, sirli token fayllari `0o600` ruxsatini talab qiladi va Docker to‘xtatganda `SIGTERM` yuboradi. OS asoslarini bilish skriptni hamma muhitda barqaror qiladi.",
    whyEn: 'Bridge Windows, macOS, and Linux reliably: understand PIDs, POSIX octal modes (`0o600`/`0o755`), graceful `SIGINT`/`SIGTERM` flags, and cross-platform `pathlib` paths.',
    analogyUz: "**OS** — bino komendanti: Python jarayoniga (`PID`) xotira, fayl kalitlari (`rwx` ruxsat) va yong‘in signali (`SIGTERM`) beradi.",
    analogyEn: 'The OS is the building manager assigning PIDs, `rwx` room keys, and `SIGTERM` shutdown alerts.',
    stopsUz: "Hech qachon `\"a\\\\b\"` qo‘lda ulamang — `pathlib.Path` ishlating! UTF-8 va CSV uchun `newline=\"\"` bering, sir fayllarni `0o600` qiling.",
    stopsEn: 'Always use `pathlib.Path` instead of string separators, specify `encoding="utf-8"`, and restrict secret files to `0o600`.',
    objUz: ['Process PID va `Path.cwd()` tushunchalari', 'Octal ruxsatlar (`0o600`, `0o755`) va `CRLF` vs `LF`', '`signal` (`SIGTERM`) graceful shutdown va `pathlib`'],
    objEn: ['Inspect PIDs and `Path.cwd()`', 'Decode octal permissions (`0o600`, `0o755`) & line endings', 'Handle `SIGTERM` shutdown flags cleanly'],
    theoryUz: `### 1. Process va PID
Har dastur OS da noyob \`PID\` (\`os.getpid()\`) ga ega.
### 2. Ruxsatlar (\`r=4, w=2, x=1\`)
\`0o600\` = faqat egasiga \`rw-\` (tokenlar uchun); \`0o755\` = skript/papka.
### 3. Signallar (\`SIGTERM\`, \`SIGINT\`)
\`signal.signal\` bilan bayroq o‘rnatib siklni toza yakunlang.
### 4. Kross-Platforma
\`Path("a") / "b"\` va \`encoding="utf-8"\`.`,
    theoryEn: `### 1. Processes & PIDs
Every script runs with a unique OS \`PID\` (\`os.getpid()\`).
### 2. Octal Modes (\`r=4, w=2, x=1\`)
\`0o600\` keeps secrets owner-only; \`0o755\` fits executables/directories.
### 3. Signals (\`SIGTERM\`/\`SIGINT\`)
Set a graceful stop boolean in signal handlers.
### 4. Portability
Use \`pathlib.Path\`, \`encoding="utf-8"\`, and normalize \`\\r\\n\`.`,
    examples: [
      ex('Misol 1: PID, Platforma va `Path`', 'Example 1: OS Process & Portable Path', `import os, platform\nfrom pathlib import Path\np = Path("reports") / "2026" / "daily.csv"\nprint(os.getpid() > 0, platform.system() in {"Linux", "Windows", "Darwin"}, p.parts)`, `True True ('reports', '2026', 'daily.csv')`, '`Path` barcha OS da bir xil bo‘laklarni ajratadi.', '`Path` stays consistent across platforms.'),
      ex('Misol 2: Octal Ruxsat Dekoderi', 'Example 2: Decode Octal Modes', `def mode_str(m: int) -> str:\n    return "".join(("r" if (m>>s)&4 else "-") + ("w" if (m>>s)&2 else "-") + ("x" if (m>>s)&1 else "-") for s in (6, 3, 0))\nprint(mode_str(0o755), mode_str(0o600))`, `rwxr-xr-x rw-------`, '`0o600` faqat egasiga `rw-` beradi.', '`0o600` restricts access strictly to owner.'),
      ex('Misol 3: `SIGTERM` Graceful Flag', 'Example 3: Graceful Stop Flag', `import signal\nstop = False\ndef on_sig(s, f):\n    global stop; stop = True\nsignal.signal(signal.SIGTERM, on_sig)\non_sig(signal.SIGTERM, None)\nprint("Stop requested:", stop)`, `Stop requested: True`, 'Signal kelganda sikl chiroyli to‘xtaydi.', 'Allows finishing the current step cleanly.'),
    ],
    traceTitleUz: 'Octal Mode Bitlari Trace',
    traceTitleEn: 'Tracing 0o600 Bitmask',
    traceCode: `mode_str(0o600)`,
    traceSteps: [
      traceStep(1, 'shift=6 (owner)', 'bits=6 -> rw-', 'Egasi o‘qiydi va yozadi', 'Owner rw-'),
      traceStep(2, 'shift=3,0', 'bits=0 -> ------', 'Boshqalarga yopiq', 'No group/other access'),
    ],
    commonMistakes: [
      mistake('Qattiq `\\` separator yozish', 'Hardcoding Backslashes', `# "a\\\\b.txt" creates a literal backslash filename on Linux!`, 'Broken cross-platform paths', `from pathlib import Path\nprint((Path("a") / "b.txt").as_posix())`, '`pathlib.Path` ishlating.', 'Always use `pathlib.Path`.', '`Path` ishlating.', 'Use `Path`.'),
      mistake('Sir faylini `0o777` qoldirish', 'World-Readable Secret Modes', `# 0o777 lets every local process read secret tokens!`, 'Secret leak', `print("Use 0o600 for secret credential files!")`, 'Faqat `0o600` qo‘ying.', 'Restrict secrets to `0o600`.', '`0o600` bering.', 'Enforce `0o600`.'),
    ],
    compareTitleUz: 'Windows vs POSIX Linux',
    compareTitleEn: 'Windows vs Linux Automation',
    compareUz: ['Windows: CRLF (`\\r\\n`), backslash.', 'Linux: LF (`\\n`), `/`, `rwx` bitlar — `pathlib` ikkalasini birlashtiradi.'],
    compareEn: ['Windows: CRLF, backslashes.', 'Linux: LF, `/`, POSIX `rwx`—unified by `pathlib` and UTF-8.'],
    compareSummaryUz: '`pathlib.Path`, `encoding="utf-8"`, `0o600` va `SIGTERM` bayrog‘idan foydalaning.',
    compareSummaryEn: 'Use `pathlib.Path`, explicit UTF-8, `0o600` secret modes, and graceful `SIGTERM` flags.',
    practiceTasks: [
      pt('p1502_1', '1-mashq: `.as_posix()`', 'Task 1: POSIX Format', '`Path("var") / "log"` ni `.as_posix()` qiling.', 'Format POSIX path.', `from pathlib import Path\nprint((Path("var") / "log").as_posix())`, 'var/log', 'Use as_posix()', 'Prints var/log.'),
      pt('p1502_2', '2-mashq: CRLF -> LF', 'Task 2: Normalize Endings', '`"a\\r\\nb"` dan `\\r` ni olib tashlang.', 'Normalize CRLF.', `print(repr("a\\r\\nb".replace("\\r\\n", "\\n")))`, "'a\\nb'", 'Replace \\r\\n', "Prints 'a\\nb'."),
      pt('p1502_3', '3-mashq: Private Mode Check', 'Task 3: Verify 0o600', '`(mode & 0o077) == 0` tekshiring.', 'Check private bits.', `def priv(m): return (m & 0o077) == 0\nprint(priv(0o600), priv(0o644))`, 'True False', 'Bitwise AND 0o077', 'Prints True False.'),
      pt('p1502_4', '4-mashq: `os.getpid()`', 'Task 4: PID Check', 'PID musbatligini chiqaring.', 'Verify positive PID.', `import os\nprint(os.getpid() > 0)`, 'True', 'Call os.getpid()', 'Prints True.'),
      pt('p1502_5', '5-mashq: Stop Flag Loop', 'Task 5: Clean Break', '2 ta elementdan keyin to‘xtang.', 'Break on stop.', `out = []\nfor x in [1, 2, 3]:\n    out.append(x)\n    if x == 2: break\nprint(out)`, '[1, 2]', 'Stop cleanly', 'Prints [1, 2].'),
    ],
    quiz: [
      q('q1502_1', 'Sir fayl uchun xavfsiz octal mode?', 'Safest octal permission for secret files?', ['0o777', '0o644', '0o600', '0o111'], ['0o777', '0o644', '0o600', '0o111'], 2, '`0o600`.', '`0o600`.'),
      q('q1502_2', 'Docker konteynerni muloyim to‘xtatuvchi signal?', 'Signal requesting graceful shutdown?', ['SIGKILL', 'SIGTERM', 'SIGSEGV', 'SIGABRT'], ['SIGKILL', 'SIGTERM', 'SIGSEGV', 'SIGABRT'], 1, '`SIGTERM`.', '`SIGTERM`.'),
      q('q1502_3', 'Kross-platforma yo‘l birlashtirish?', 'Portable path joining?', ['"a\\\\b"', '`pathlib.Path("a") / "b"`', 'eval', 'join'], ['"a\\\\b"', '`pathlib.Path("a") / "b"`', 'eval', 'join'], 1, '`pathlib.Path`.', '`pathlib.Path`.'),
      q('q1502_4', '`0o755` da `7` nimani bildiradi?', 'What does `7` mean in `0o755`?', ['7 fayl', 'Owner r+w+x (4+2+1)', '7 MB', '7 kun'], ['7 files', 'Owner r+w+x (4+2+1)', '7 MB', '7 days'], 1, 'Owner `rwx`.', 'Owner `rwx`.'),
      q('q1502_5', 'Windows CSV da `newline=""` nimaga kerak?', 'Why pass `newline=""` for CSV on Windows?', ['Tezlik', 'Bo‘sh qatorlar tushmasligi uchun', 'JSON', 'UTF'], ['Speed', 'Avoids extra blank lines', 'JSON', 'UTF'], 1, 'Ortiqcha bo‘sh qatorni oldini oladi.', 'Prevents blank lines.'),
    ],
    homework: hw('OS Preflight Auditor', 'Cross-Platform Mode & Line-Ending Auditor', '`0o600` maxfiylik tekshiruvi, `CRLF -> LF` normallashtiruvchi va `pathlib` hisobotini tuzing.', 'Build an auditor checking `0o600` modes, normalizing `CRLF`, and emitting `pathlib` reports.', ['Mode decoder + CRLF normalizer', '5 ta test'], ['Mode decoder + normalizer', '5 tests'], 'Mask `(mode & 0o077) == 0`.', 'Clean OS helper.', 'SIGTERM flagini ulang.', 'Add SIGTERM flag.', 20),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-15-03',
    courseId: 'automation',
    moduleId: 'c15_m1',
    order: 3,
    titleUz: '`os` va `sys` Modullari — CLI (`argparse`), Exit Codes va Pipes',
    titleEn: '`os` and `sys` Modules: `argparse`, Exit Codes & Streams',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-15-02'],
    conceptId: 'auto_os_sys',
    whyUz: "Automation skripti Cron/CI da avtomatik yuradi: u `argparse` bilan flaglarni olishi, JSON ni `stdout` ga, loglarni `stderr` ga yozishi va natijani `sys.exit(0/1)` bilan bildirishi shart!",
    whyEn: 'Build production CLI scripts using `argparse(argv)`, separating `stdout` data from `stderr` logs, and returning semantic exit codes (`0` vs non-zero).',
    analogyUz: "`stdout` — asosiy konveyer, `stderr` — diagnostika ekrani, Exit Code (`0`/`1`) — CI/CD svetofori!",
    analogyEn: '`stdout` is the data conveyor, `stderr` is the log monitor, and exit codes are the CI traffic light.',
    stopsUz: "1) `sys.argv` ni qo‘lda indekslamang — `argparse` ishlating! 2) Loglarni `file=sys.stderr` ga chiqaring (`pipe` buzilmasin!). 3) Xatoda `sys.exit(1)` qaytaring!",
    stopsEn: 'Use `argparse`, send diagnostic logs to `sys.stderr`, and return non-zero exit codes on errors.',
    objUz: ['`argparse` bilan testlanadigan `main(argv)`', '`stdout` vs `stderr` ajratish', 'Exit code (`0`/`1`) va `os.scandir`'],
    objEn: ['Build testable `argparse` CLIs', 'Separate `stdout` vs `stderr`', 'Return exit codes and traverse with `os.scandir`'],
    theoryUz: `### 1. \`argparse\`
\`parser.parse_args(argv)\` bilan testlash oson va \`--help\` tayyor.
### 2. \`stdout\` vs \`stderr\`
JSON/CSV -> \`stdout\`; loglar -> \`sys.stderr\`.
### 3. \`os.scandir()\` & Exit Codes
\`os.scandir()\` metadata ni tez o‘qiydi; xato bo‘lsa \`1\`, muvaffaqiyatda \`0\` qaytaring.`,
    theoryEn: `### 1. Testable \`argparse\`
Pass explicit \`argv\` lists for instant unit testing.
### 2. Streams
Keep \`stdout\` machine-parseable and send logs to \`sys.stderr\`.
### 3. \`os.scandir()\` & Exit Codes
Use \`os.scandir()\` for fast directory scans and return \`0\` or non-zero exit codes.`,
    examples: [
      ex('Misol 1: Testlanadigan `argparse` CLI', 'Example 1: Testable argparse CLI', `import argparse\np = argparse.ArgumentParser()\np.add_argument("--env", default="dev")\np.add_argument("--dry-run", action="store_true")\nargs = p.parse_args(["--env", "prod", "--dry-run"])\nprint(args.env, args.dry_run)`, `prod True`, '`parse_args([...])` unit-testni osonlashtiradi.', 'Explicit argv makes CLI testing clean.'),
      ex('Misol 2: `stdout` vs `stderr`', 'Example 2: Stream Separation', `import io, json\nout, err = io.StringIO(), io.StringIO()\nprint("Loading...", file=err)\nprint(json.dumps({"n": 3}), file=out)\nprint("OUT:", out.getvalue().strip(), "| ERR:", err.getvalue().strip())`, `OUT: {"n": 3} | ERR: Loading...`, 'Loglar `stdout` JSON ini buzmaydi.', 'Logs never pollute JSON stdout.'),
      ex('Misol 3: `os.scandir` Katalog Scan', 'Example 3: Fast Scan with os.scandir', `import os\nfrom pathlib import Path\nd = Path("scan_demo"); d.mkdir(exist_ok=True)\n(d / "a.txt").write_text("hi", encoding="utf-8")\nwith os.scandir(d) as it:\n    print(sorted((e.name, e.is_file()) for e in it))`, `[('a.txt', True)]`, '`os.scandir` tez va toza metadata beradi.', '`os.scandir` efficiently reports file flags.'),
    ],
    traceTitleUz: 'CLI Exit Code Trace',
    traceTitleEn: 'Tracing CLI Execution',
    traceCode: `main(["--dry-run"])`,
    traceSteps: [
      traceStep(1, 'parse_args', 'dry_run=True', 'Flag o‘qildi', 'Parsed CLI flag'),
      traceStep(2, 'stderr + return 0', 'exit=0', 'Muvaffaqiyatli tugadi', 'Exited cleanly'),
    ],
    commonMistakes: [
      mistake('JSON `stdout` ga progress `print()` aralashtirish', 'Mixing Logs into JSON stdout', `# print("Wait...") before print(json) breaks jq parsers!`, 'JSON parse error in pipe', `import sys\nprint("Wait...", file=sys.stderr)\nprint('{"ok": true}')`, 'Loglarni `sys.stderr` ga yuboring.', 'Send logs to `sys.stderr`.', '`sys.stderr` ishlating.', 'Write logs to `stderr`.'),
      mistake('Xatoda `0` exit code qaytarish', 'Exiting 0 on Failure', `# Returning 0 tells Cron the failed job succeeded!`, 'False green CI build', `print("Return 1 on errors: sys.exit(1)")`, 'Xatoda `1` qaytaring.', 'Return non-zero on failure.', 'Non-zero qaytaring.', 'Use `sys.exit(1)`.'),
    ],
    compareTitleUz: '`sys.argv` vs `argparse`',
    compareTitleEn: '`sys.argv` vs `argparse`',
    compareUz: ['`sys.argv`: mo‘rt indeks.', '`argparse`: tiplar, defaultlar, `--help`.'],
    compareEn: ['`sys.argv`: brittle indexing.', '`argparse`: typed flags, defaults, help.'],
    compareSummaryUz: '`argparse(argv)`, `stderr` loglari va `0`/`1` exit kodlardan foydalaning.',
    compareSummaryEn: 'Use `argparse(argv)`, route logs to `stderr`, and return `0`/non-zero exit codes.',
    practiceTasks: [
      pt('p1503_1', '1-mashq: `argparse`', 'Task 1: Parse Flags', '`--n` (int, default 5) va `--all` ni parse qiling.', 'Parse flags.', `import argparse\np = argparse.ArgumentParser(); p.add_argument("--n", type=int, default=5); p.add_argument("--all", action="store_true")\na = p.parse_args(["--all"]); print(a.n, a.all)`, '5 True', 'store_true', 'Prints 5 True.'),
      pt('p1503_2', '2-mashq: `sys.version_info`', 'Task 2: Python Version', 'Python >= 3.10 ekanini tekshiring.', 'Check version.', `import sys\nprint(sys.version_info >= (3, 10))`, 'True', 'Tuple compare', 'Prints True.'),
      pt('p1503_3', '3-mashq: Streams', 'Task 3: stdout/stderr', 'Log va ma’lumotni ajrating.', 'Separate streams.', `import io\no, e = io.StringIO(), io.StringIO()\nprint("err", file=e); print("data", file=o)\nprint(o.getvalue().strip(), e.getvalue().strip())`, 'data err', 'file=o/e', 'Prints data err.'),
      pt('p1503_4', '4-mashq: Exit Code', 'Task 4: Exit Code', '`--fail` da `1`, bo‘lmasa `0` qaytaring.', 'Return 0 or 1.', `def m(a): return 1 if "--fail" in a else 0\nprint(m([]), m(["--fail"]))`, '0 1', 'Check flag', 'Prints 0 1.'),
      pt('p1503_5', '5-mashq: `normpath`', 'Task 5: Normpath', '`"a/b/../c.py"` ni normallashtiring.', 'Normalize path.', `import os\nprint(os.path.normpath("a/b/../c.py").replace("\\\\", "/"))`, 'a/c.py', 'os.path.normpath', 'Prints a/c.py.'),
    ],
    quiz: [
      q('q1503_1', 'Muvaffaqiyatli CLI exit kodi?', 'Success exit code?', ['1', '0', '200', '-1'], ['1', '0', '200', '-1'], 1, '`0`.', '`0`.'),
      q('q1503_2', 'Pipe da diagnostika loglari qayerga chiqadi?', 'Stream for diagnostic logs in pipes?', ['stdout', 'stderr', 'stdin', 'argv'], ['stdout', 'stderr', 'stdin', 'argv'], 1, '`stderr`.', '`stderr`.'),
      q('q1503_3', '`parse_args(argv)` afzalligi?', 'Benefit of `parse_args(argv)`?', ['Tezroq', 'Unit testlash oson', 'CSS', 'SQL'], ['Faster', 'Easy unit testing', 'CSS', 'SQL'], 1, 'Unit testlash.', 'Unit-testable.'),
      q('q1503_4', '`os.listdir` dan tezroq iterator?', 'Faster iterator than `os.listdir`?', ['walk', 'os.scandir()', 'glob', 'sys'], ['walk', 'os.scandir()', 'glob', 'sys'], 1, '`os.scandir()`.', '`os.scandir()`.'),
      q('q1503_5', 'Qiymatsiz flag uchun `argparse` action?', 'Action for boolean flag?', ['bool', 'store_true', 'int', 'set'], ['bool', 'store_true', 'int', 'set'], 1, '`store_true`.', '`store_true`.'),
    ],
    homework: hw('Testable CLI Log Auditor', 'CLI Auditor with argparse & Streams', '`argparse`, `stdout` JSON, `stderr` log va `0`/`1` exit kodli `main(argv)` tuzing.', 'Build `main(argv)` with `argparse`, JSON `stdout`, `stderr` logs, and `0`/`1` exit codes.', ['argparse + argv', 'stdout/stderr + exit codes'], ['argparse + argv', 'streams + exit codes'], 'Inject StringIO streams for tests.', 'Clean CLI.', 'Subcommand qo‘shing.', 'Add subcommands.', 20),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-15-04',
    courseId: 'automation',
    moduleId: 'c15_m1',
    order: 4,
    titleUz: '`subprocess` — Tashqi Jarayonlar, `shell=False` va Command Injection Himoyasi',
    titleEn: '`subprocess`: External Commands & Preventing Command Injection',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['PY-15-03'],
    conceptId: 'auto_subprocess',
    whyUz: "Tashqi `git` yoki `docker` chaqirganda `os.system` yoki `shell=True` ishlatsangiz `; rm -rf /` bilan server buziladi (**Command Injection**). **`subprocess.run([...], shell=False, check=True, timeout=...)`** bu xavfni yo‘qotadi!",
    whyEn: 'Run external CLIs safely using `subprocess.run(["cmd", arg], shell=False, check=True, timeout=...)` to prevent shell command injection and hangs.',
    analogyUz: "`shell=True` buyruqni `bash` tarjimoniga beradi (`;` bajariladi); `shell=False` esa to‘g‘ridan-to‘g‘ri dasturga argument listi uzatadi.",
    analogyEn: '`shell=True` interprets `;` and `|` via a shell; `shell=False` passes literal argument lists directly to the executable.',
    stopsUz: "1) `os.system()` va `shell=True` ishlatmang! 2) Doim `list[str]` + `check=True` + `timeout=` bering! (Sandboxda `subprocess` cheklangani uchun bu darsda argv validatorlarni stdlib da mashq qilamiz.)",
    stopsEn: 'Never use `os.system()` or `shell=True` on untrusted input; always pass `list[str]`, `check=True`, and `timeout=`. (Sandbox simulates command validation in pure stdlib.)',
    objUz: ['Command Injection vs `shell=False`', '`check=True`, `timeout=`, `capture_output=True`', '`shlex.split` / `shlex.quote` va allowlist'],
    objEn: ['Prevent Command Injection via `shell=False`', 'Configure `check=True` and `timeout=`', 'Tokenize & escape safely with `shlex`'],
    theoryUz: `### 1. Command Injection
\`shell=True\` foydalanuvchi kiritgan \`; id\` ni buyruq sifatida bajaradi. \`shell=False\` + ro‘yxat esa xavfsiz!
### 2. \`subprocess.run()\`
\`check=True\` exit != 0 da \`CalledProcessError\` ko‘taradi; \`timeout=30\` osilib qolishni to‘sadi.
### 3. \`shlex\`
\`shlex.split()\` tirnoqli buyruqni xavfsiz tokenlarga bo‘ladi.`,
    theoryEn: `### 1. Avoiding Injection
Always pass \`["git", "status"]\` with \`shell=False\`.
### 2. \`check=True\` & \`timeout=\`
Prevent silent failures and hung worker processes.
### 3. \`shlex\`
Tokenize quoted strings cleanly with \`shlex.split()\`.`,
    examples: [
      ex('Misol 1: `shlex.split` + Binary Allowlist', 'Example 1: Allowlist & shlex Tokenization', `import shlex\nALLOWED = {"git", "python3"}\ndef build(bin_name: str, args: list[str]) -> list[str]:\n    if bin_name not in ALLOWED: raise ValueError("Blocked")\n    return [bin_name, *args]\nprint(build("git", ["commit", "-m", "fix; rm -rf /"]))\nprint(shlex.split('python3 -c "print(1+1)"'))`, `['git', 'commit', '-m', 'fix; rm -rf /']\n['python3', '-c', 'print(1+1)']`, '`shell=False` ro‘yxatida `;` oddiy matn bo‘lib qoladi.', 'Arg lists keep `;` inert.'),
      ex('Misol 2: `check=True` va `timeout` Simulyatsiyasi', 'Example 2: Simulating check=True & Timeout', `def run_sim(rc: int, elapsed: float, timeout: float = 5.0):\n    if elapsed > timeout: raise TimeoutError("Timed out")\n    if rc != 0: raise RuntimeError(f"Exit {rc}")\n    return "ok"\ntry:\n    run_sim(1, 0.2)\nexcept RuntimeError as e:\n    print("Caught:", e)`, `Caught: Exit 1`, '`check=True` xatolarni yashirmaydi.', '`check=True` catches non-zero exit codes.'),
      ex('Misol 3: Xavfsiz Fayl Nomi Regexi', 'Example 3: Safe Filename Allowlist', `import re\ndef ok_name(s: str) -> bool: return bool(re.fullmatch(r"[a-zA-Z0-9._-]+", s))\nprint(ok_name("app.log"), ok_name("a;id"))`, `True False`, 'Metabelgilar boshidan rad etiladi.', 'Rejects metacharacters upfront.'),
    ],
    traceTitleUz: 'shell=True vs shell=False Trace',
    traceTitleEn: 'Tracing shell=False Safety',
    traceCode: `["echo", "hi; id"]`,
    traceSteps: [
      traceStep(1, 'shell=True', 'runs hi AND id', 'Injection ishladi!', 'Executed injected cmd'),
      traceStep(2, 'shell=False', 'prints literal "hi; id"', 'Xavfsiz bajarildi', 'Literal safe arg'),
    ],
    commonMistakes: [
      mistake('`shell=True` + f-string', 'Interpolating Input into shell=True', `# subprocess.run(f"ping {host}", shell=True) -> Command Injection!`, 'Remote Code Execution', `print("Always pass argv list with shell=False!")`, 'Ro‘yxat va `shell=False` ishlating.', 'Pass `list[str]` with `shell=False`.', '`shell=False` ishlating.', 'Keep `shell=False`.'),
      mistake('`timeout=` bermaslik', 'Omitting timeout=', `# Hung external tools freeze workers indefinitely!`, 'Hung worker', `print("Always pass timeout=30!")`, 'Doim `timeout=` qo‘ying.', 'Always set `timeout=`.', '`timeout=` bering.', 'Set `timeout=`.'),
    ],
    compareTitleUz: '`os.system` vs `subprocess.run`',
    compareTitleEn: '`os.system` vs `subprocess.run`',
    compareUz: ['`os.system`: shell ochadi, timeout yo‘q.', '`subprocess.run(..., shell=False, check=True, timeout=...)`: xavfsiz standart.'],
    compareEn: ['`os.system`: spawns shell, no timeout.', '`subprocess.run`: safe, captures streams, raises on failure, supports timeout.'],
    compareSummaryUz: 'Faqat `list[str]`, `shell=False`, `check=True`, `timeout=` bilan tashqi jarayon chaqiring.',
    compareSummaryEn: 'Run external commands solely with `list[str]`, `shell=False`, `check=True`, and `timeout=`.',
    practiceTasks: [
      pt('p1504_1', '1-mashq: `shlex.split`', 'Task 1: shlex.split', "`'git commit -m \"hi\"'` ni ajrating.", 'Split command.', `import shlex\nprint(shlex.split('git commit -m "hi"'))`, "['git', 'commit', '-m', 'hi']", 'shlex.split', 'Prints 4 items.'),
      pt('p1504_2', '2-mashq: Binary Allowlist', 'Task 2: Binary Allowlist', '`{"git", "pytest"}` ni tekshiring.', 'Check allowlist.', `def ok(c): return c[0] in {"git", "pytest"}\nprint(ok(["git"]), ok(["rm"]))`, 'True False', 'Set check', 'Prints True False.'),
      pt('p1504_3', '3-mashq: `shlex.quote`', 'Task 3: shlex.quote', '`"a; b"` ni escape qiling.', 'Quote arg.', `import shlex\nprint(shlex.quote("a; b"))`, "'a; b'", 'shlex.quote', 'Prints quoted.'),
      pt('p1504_4', '4-mashq: `check=True`', 'Task 4: Non-Zero Raise', '`rc != 0` da xato chiqaring.', 'Raise on non-zero.', `def chk(rc):\n    if rc: raise ValueError(rc)\ntry: chk(2)\nexcept ValueError as e: print("rc", e)`, 'rc 2', 'Check rc', 'Prints rc 2.'),
      pt('p1504_5', '5-mashq: `--` Separator', 'Task 5: -- Separator', '`grep -- -pat file` yasang.', 'Include --.', `print(["grep", "--", "-pat", "f.txt"])`, "['grep', '--', '-pat', 'f.txt']", 'Add "--"', 'Prints safe argv.'),
    ],
    quiz: [
      q('q1504_1', 'Command Injection ni to‘suvchi `subprocess.run` parametri?', 'Parameter keeping `subprocess.run` safe from injection?', ['text', 'shell=False', 'check', 'env'], ['text', 'shell=False', 'check', 'env'], 1, '`shell=False`.', '`shell=False`.'),
      q('q1504_2', 'Xatoda exception ko‘taruvchi parametr?', 'Param raising on non-zero exit?', ['timeout', 'check=True', 'text', 'stdin'], ['timeout', 'check=True', 'text', 'stdin'], 1, '`check=True`.', '`check=True`.'),
      q('q1504_3', 'Nima uchun `os.system` yomon?', 'Why avoid `os.system`?', ['Tez', 'Shell injection va timeout yo‘qligi', 'Mac', 'JSON'], ['Fast', 'Shell injection and missing timeout', 'Mac', 'JSON'], 1, 'Injection xavfi.', 'Injection risk.'),
      q('q1504_4', 'Osilib qolishni to‘xtatuvchi parametr?', 'Param preventing hangs?', ['limit', 'timeout', 'ttl', 'max'], ['limit', 'timeout', 'ttl', 'max'], 1, '`timeout`.', '`timeout`.'),
      q('q1504_5', '`-rf` ni flag deb olmaslik uchun belgi?', 'End-of-options marker?', ['//', '--', '&&', '::'], ['//', '--', '&&', '::'], 1, '`--`.', '`--`.'),
    ],
    homework: hw('Command Policy Validator', 'Hardened Command Validator', 'Binary allowlist, regex fayl nomi, timeout chegarasi va `shlex.split` ni birlashtiruvchi validator yozing.', 'Build a command validator checking allowed binaries, filename regex, timeout cap, and `shlex`.', ['Allowlist + timeout + regex', 'Injection testlari'], ['Allowlist + timeout + regex', 'Injection tests'], 'Validate command[0] first.', 'Defense-in-depth.', 'Audit JSON yozing.', 'Add JSON audit.', 20),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-15-05',
    courseId: 'automation',
    moduleId: 'c15_m2',
    order: 5,
    titleUz: 'Web Scraping Asoslari — API First, `robots.txt`, Etika va Review #33',
    titleEn: 'Web Scraping Foundations: APIs First, `robots.txt`, Rate Limits & Review #33',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-15-04'],
    conceptId: 'auto_scraping_basics',
    whyUz: "Ma’lumot yig‘ishda avval rasmiy **JSON API** izlang; scraping kerak bo‘lsa **`robots.txt`** ga amal qiling, **Rate Limiting** qo‘ying va Fetch ni Parse dan ajratish uchun **kesh + checkpoint** ishlating!",
    whyEn: 'Collect web data responsibly: prefer JSON APIs over HTML scraping, obey `robots.txt`, throttle requests, cache HTML locally, and checkpoint paginated crawls.',
    analogyUz: "**API** — tayyor elektron katalog; **Scraping** — kutubxona qoidasi (`robots.txt`) va odobli tezlik (Rate Limit) bilan sahifa o‘qish.",
    analogyEn: 'APIs are direct feeds; polite scraping reads `robots.txt` rules and paces requests.',
    stopsUz: "1) Avval Network XHR/JSON API ni tekshiring! 2) `robots.txt` va shartlarni hurmat qiling! 3) Rate limit + local HTML kesh + pagination checkpoint saqlang!",
    stopsEn: 'Prefer official APIs, obey `robots.txt`, throttle requests, cache raw HTML, and checkpoint crawl progress.',
    objUz: ['API vs HTML Scraping tanlovi', '`robots.txt` parseri', 'Local Cache, `429 Retry-After` va Pagination Checkpoint'],
    objEn: ['Prefer JSON APIs first', 'Parse `robots.txt` directives', 'Cache HTML & checkpoint crawls'],
    theoryUz: `### 1. API First
JSON API dizayn o‘zgarishiga chidamli va tez.
### 2. \`robots.txt\`
\`Disallow:\` qoidalarini crawl dan oldin tekshiring.
### 3. Fetch -> Cache -> Parse
Xom HTML ni keshlab olib, parserni offline sinang va sahifa raqamini checkpoint qiling.`,
    theoryEn: `### 1. Check APIs First
Network JSON APIs beat brittle HTML selectors.
### 2. Obey \`robots.txt\`
Check \`Disallow\` prefixes before requesting paths.
### 3. Fetch -> Cache -> Parse
Cache fetched HTML and checkpoint pagination state.`,
    examples: [
      ex('Misol 1: `robots.txt` Tekshiruvchi', 'Example 1: robots.txt Checker', `def can_fetch(robots: str, path: str) -> bool:\n    ok = True\n    for line in robots.splitlines():\n        if line.startswith("Disallow:"):\n            rule = line.split(":", 1)[1].strip()\n            if rule and path.startswith(rule): ok = False\n    return ok\nr = "User-agent: *\\nDisallow: /admin"\nprint(can_fetch(r, "/courses"), can_fetch(r, "/admin/1"))`, `True False`, 'Taqiqlangan yo‘llar crawl qilinmaydi.', 'Skips disallowed paths cleanly.'),
      ex('Misol 2: Local Cache', 'Example 2: Fetch-Once Cache', `cache = {"/p1": "<h1>Ok</h1>"}\ncalls = 0\ndef get(u):\n    global calls\n    if u not in cache: calls += 1; cache[u] = f"<h1>{u}</h1>"\n    return cache[u]\nprint(get("/p1"), get("/p2"), "net calls:", calls)`, `<h1>Ok</h1> <h1>/p2</h1> net calls: 1`, 'Kesh tarmoq so‘rovlarini tejaydi.', 'Caching prevents redundant requests.'),
      ex('Misol 3: Pagination Checkpoint', 'Example 3: Checkpoint Resume', `last_ok = 3\nprint("Next pages:", list(range(last_ok + 1, 6)))`, `Next pages: [4, 5]`, 'Uzilishdan keyin 4-sahifadan davom etadi.', 'Resumes from saved page.'),
    ],
    traceTitleUz: 'Fetch -> Cache -> Parse Trace',
    traceTitleEn: 'Tracing Crawler Pipeline',
    traceCode: `get("/p2")`,
    traceSteps: [
      traceStep(1, 'can_fetch', 'True', 'robots.txt ruxsat berdi', 'Allowed path'),
      traceStep(2, 'cache + save', 'calls=1', 'Yuklandi va keshlandi', 'Fetched & cached'),
    ],
    commonMistakes: [
      mistake('Pauzasiz yuzlab so‘rov yuborish', 'Unthrottled Tight-Loop Crawling', `# Tight-loop scraping triggers immediate 429/403 IP bans!`, 'IP block / 429', `print("Add polite delay and handle 429 Retry-After!")`, 'Rate limit qo‘ying.', 'Throttle requests politely.', 'Pauza qo‘ying.', 'Pace requests.'),
      mistake('Har parser tuzatishda saytni qayta tortish', 'Re-Scraping Live Sites While Debugging', `# Re-fetching live pages on every edit wastes bandwidth and risks bans!`, 'Slow & risky', `print("Cache raw HTML once locally, parse offline!")`, 'Avval HTML ni keshlang.', 'Cache HTML first.', 'Fetch va Parse ni ajrating.', 'Separate fetch/parse.'),
    ],
    compareTitleUz: 'JSON API vs HTML Scraping',
    compareTitleEn: 'API vs Scraping',
    compareUz: ['JSON API: barqaror sxema.', 'Scraping: API bo‘lmaganda `robots.txt` + kesh bilan.'],
    compareEn: ['API: stable contract.', 'Scraping: fallback with `robots.txt` + cache.'],
    compareSummaryUz: 'Avval API izlang; scraping da `robots.txt`, rate-limit, kesh va checkpoint ishlating.',
    compareSummaryEn: 'Prefer APIs; scrape with `robots.txt`, rate limits, caching, and checkpoints.',
    practiceTasks: [
      pt('p1505_1', '1-mashq: Disallow Check', 'Task 1: Disallow Check', '`/admin` ni bloklang.', 'Block /admin.', `def ok(p): return not p.startswith("/admin")\nprint(ok("/docs"), ok("/admin/x"))`, 'True False', 'startswith', 'Prints True False.'),
      pt('p1505_2', '2-mashq: Polite Delay', 'Task 2: Delay List', '`1.0` + `[0.1, 0.2]` chiqaring.', 'Compute delays.', `print([round(1.0 + j, 2) for j in (0.1, 0.2)])`, '[1.1, 1.2]', 'Add base', 'Prints [1.1, 1.2].'),
      pt('p1505_3', '3-mashq: Cache Hit %', 'Task 3: Hit Ratio', '7/10 hit foizini chiqaring.', 'Compute %.', `print(f"{7*100//10}%")`, '70%', 'Integer %', 'Prints 70%.'),
      pt('p1505_4', '4-mashq: Page URLs', 'Task 4: Page URLs', '1..3 URL yasang.', 'Build URLs.', `print([f"/p?i={i}" for i in range(1, 4)])`, "['/p?i=1', '/p?i=2', '/p?i=3']", 'List comp', 'Prints 3 URLs.'),
      pt('p1505_5', '5-mashq: Retry-After', 'Task 5: Retry-After', 'Headerdan int oling.', 'Parse header.', `print(int({"Retry-After": "12"}.get("Retry-After", "5")))`, '12', 'dict.get', 'Prints 12.'),
    ],
    quiz: [
      q('q1505_1', 'Scraping dan oldin birinchi tekshiriladigan manba?', 'First thing to check before scraping HTML?', ['Selenium', 'Rasmiy JSON API / XHR', 'Threads', 'Regex'], ['Selenium', 'Official JSON API / XHR', 'Threads', 'Regex'], 1, 'JSON API.', 'Official JSON API.'),
      q('q1505_2', 'Bot qoidalari qaysi faylda?', 'File declaring crawler rules?', ['cors.json', '/robots.txt', 'humans.txt', 'env'], ['cors.json', '/robots.txt', 'humans.txt', 'env'], 1, '`/robots.txt`.', '`/robots.txt`.'),
      q('q1505_3', 'Fetch va Parse ni ajratish foydasi?', 'Benefit of separating Fetch & Parse?', ['CSS', 'Keshdagi HTML ustida tarmoqqa urmasdan parser sinash', 'SQL', 'Port'], ['CSS', 'Test parsers offline on cached HTML', 'SQL', 'Port'], 1, 'Offline sinash.', 'Offline iteration.'),
      q('q1505_4', '`429` da kutish vaqtini bildiruvchi sarlavha?', 'Header giving wait time on 429?', ['ETag', 'Retry-After', 'Accept', 'Host'], ['ETag', 'Retry-After', 'Accept', 'Host'], 1, '`Retry-After`.', '`Retry-After`.'),
      q('q1505_5', 'Uzilgan sahifadan davom etish usuli?', 'How to resume interrupted crawls?', ['Cookie', 'Checkpoint holati', 'Cache', 'DNS'], ['Cookie', 'Checkpoint state', 'Cache', 'DNS'], 1, 'Checkpoint.', 'Checkpointing.'),
    ],
    homework: hw('Robots-Aware Cache Planner', 'Cached Crawl Planner', '`robots.txt`, local kesh, `Retry-After` va checkpoint bilan crawl rejalashtiruvchi yozing.', 'Build a crawl planner checking `robots.txt`, caching HTML, respecting `Retry-After`, and checkpointing pages.', ['robots + cache + checkpoint', 'Test assertlari'], ['robots + cache + checkpoint', 'Test assertions'], 'Check disallowed rules before cache lookup.', 'Resilient fetcher.', 'Keyingi darsda HTML parsing qo‘shamiz.', 'Add HTML parsing next.', 20),
    reviewCheckpoint: review(
      33,
      'Review Loyiha #33: CLI Dry-Run + Robots & Cache Planner',
      'Review Project #33: CLI Dry-Run + Safe Crawl Planner',
      '15-kurs 1-yarmini yakunlang: `argparse` `--dry-run`, `robots.txt` tekshiruvi va atomik `.tmp -> .replace` checkpoint faylini birlashtiring.',
      'Combine `argparse` (`--dry-run`), `robots.txt` validation, and atomic `.tmp -> .replace` checkpoint output in one CLI script.',
      ['`argparse` (`--dry-run`)', '`robots.txt` filter', 'Atomik `.replace()` checkpoint'],
      ['`argparse` (`--dry-run`)', '`robots.txt` gate', 'Atomic checkpoint write'],
      `import argparse, json
from pathlib import Path

ROBOTS = "User-agent: *\\nDisallow: /admin"
def allowed(p: str) -> bool:
    return not any(p.startswith(l.split(":", 1)[1].strip()) for l in ROBOTS.splitlines() if l.startswith("Disallow:"))

def run_cli(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--dry-run", action="store_true"); ap.add_argument("paths", nargs="+")
    ns = ap.parse_args(argv)
    plan = [x for x in ns.paths if allowed(x)]
    if ns.dry_run:
        print("DRY-RUN:", plan); return 0
    t, d = Path("crawl.tmp"), Path("crawl.json")
    t.write_text(json.dumps({"allowed": plan}), encoding="utf-8"); t.replace(d)
    print("APPLIED:", d.read_text(encoding="utf-8"))
    return 0

run_cli(["--dry-run", "/courses", "/admin/x"])
run_cli(["/courses", "/admin/x"])
`,
    ),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),
];
