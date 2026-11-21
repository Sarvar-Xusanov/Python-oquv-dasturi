import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C08_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-08-07',
    courseId: 'modules_packages',
    moduleId: 'c08_m3',
    order: 7,
    titleUz: 'Virtual Environments (`venv`) — har bir loyiha uchun toza muhit',
    titleEn: 'Virtual Environments (`venv`): Isolation, Activation & `sys.prefix`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-08-06'],
    conceptId: 'virtual_environments',
    whyUz: "Agar A loyiha `django==4.2`, B loyiha esa `django==5.1` talab qilsa, global Python muhitiga ikkalasini birga o‘rnatib bo‘lmaydi! **`venv`** har bir loyiha uchun alohida izolyatsiyalangan Python muhiti yaratadi.",
    whyEn: 'Virtual environments (`venv`) isolate per-project dependencies so conflicting package versions across projects never collide.',
    analogyUz: "Global Python — bu butun shahar uchun bitta umumiy oshxona. **`venv`** — esa har bir loyiha uchun alohida shaxsiy oshxona: tuzni qancha solishingiz boshqalarga taʼsir qilmaydi!",
    analogyEn: 'Global Python is one shared kitchen; `venv` gives every project its own isolated pantry.',
    stopsUz: "**HECH QACHON** `.venv/` yoki `venv/` papkasini Git/GitHub ga yuklamang (`commit` qilmang)! U katta va kompyuterga xos — `.gitignore` ga `.venv/` yozib, Git ga faqat `requirements.txt` / `pyproject.toml` yuklang.",
    stopsEn: 'NEVER commit `.venv/` to Git! Add `.venv/` to `.gitignore` and share reproducible specs (`requirements.txt` / `pyproject.toml`).',
    objUz: ['`python -m venv .venv` yaratish va Windows/Linux/macOS da faollashtirish', '`sys.prefix != sys.base_prefix` bilan faol muhitni tekshirish', '`.venv/` ni `.gitignore` da qoldirish qoidasini bilish'],
    objEn: ['Create and activate `.venv` on Windows and POSIX', 'Check active virtual environment via `sys.prefix != sys.base_prefix`', 'Exclude `.venv/` in `.gitignore`'],
    theoryUz: `### 1. \`venv\` Yaratish va Faollashtirish
- Yaratish: \`python -m venv .venv\`
- **Windows PowerShell**: \`.venv\\Scripts\\Activate.ps1\`
- **macOS / Linux**: \`source .venv/bin/activate\`
- Chiqish: \`deactivate\`
### 2. Muhitni Kodda Tekshirish
\`isinstance(sys.prefix != sys.base_prefix, bool)\` — \`venv\` faollashganda \`sys.prefix\` \`.venv\` ga ishora qiladi!
### 3. Nima Uchun \`.venv/\` Git ga Kirmaydi?
100+ MB va OS ga bog‘liq binarlar bor; jamoa \`requirements.txt\` dan o‘zi qayta tiklaydi.
### 4. Keng tarqalgan xato
\`venv\` ni activate qilmasdan \`pip install\` qilib paketni global Python ga o‘rnatib qo‘yish.`,
    theoryEn: `### 1. Create & Activate
\`python -m venv .venv\`, then \`.venv/bin/activate\` (POSIX) or \`.venv\\Scripts\\Activate.ps1\` (Windows).
### 2. Inspecting Active Environment
\`sys.prefix != sys.base_prefix\` evaluates \`True\` inside a venv.
### 3. Never Commit \`.venv/\`
Keep \`.venv/\` inside \`.gitignore\`.
### 4. Pitfall
Installing before activating mutates global Python instead of \`.venv\`.`,
    examples: [
      ex('Misol 1: Python interpretatori va `sys.prefix` tekshiruvi', 'Example 1: Checking Interpreter & Prefix', `import sys\nprint("Python major:", sys.version_info.major)\nprint("Prefix is str:", isinstance(sys.prefix, str))\nprint("Flag is bool:", isinstance(sys.prefix != sys.base_prefix, bool))`, `Python major: 3\nPrefix is str: True\nFlag is bool: True`, '`sys.prefix != sys.base_prefix` har qanday muhitda venv faolligini aniqlaydi.', '`sys.prefix != sys.base_prefix` deterministically detects venv activation.'),
      ex('Misol 2: `venv` va `.gitignore` tekshiruvi', 'Example 2: Checking .gitignore Rules', `ignore_lines = [".venv/", "__pycache__/", "*.pyc", ".env"]\nprint(".venv ignored?", ".venv/" in ignore_lines)\nprint("secrets ignored?", ".env" in ignore_lines)`, `.venv ignored? True\nsecrets ignored? True`, '`.venv/` ham, maxfiy `.env` fayli ham Git dan chetlatiladi.', 'Both virtual environments and secret `.env` files belong in `.gitignore`.'),
      ex('Misol 3: OS bo‘yicha aktivatsiya yo‘li (`pathlib`)', 'Example 3: Cross-Platform Activation Path', `from pathlib import Path\ndef activate_hint(os_name: str) -> str:\n    if os_name == "windows":\n        return (Path(".venv") / "Scripts" / "Activate.ps1").as_posix()\n    return "source .venv/bin/activate"\n\nprint(activate_hint("linux"))\nprint(activate_hint("windows"))`, `source .venv/bin/activate\n.venv/Scripts/Activate.ps1`, 'Windows `Scripts/`, Linux/macOS esa `bin/` papkasidan foydalanadi.', 'Windows uses `Scripts/` while POSIX uses `bin/`.'),
    ],
    traceTitleUz: 'Virtual muhit tekshiruv izi',
    traceTitleEn: 'Tracing venv Prefix Check',
    traceCode: `import sys\nis_isolated = (sys.prefix != sys.base_prefix)\nprint(type(is_isolated).__name__)`,
    traceSteps: [
      traceStep(1, 'sys.prefix != sys.base_prefix', 'bool', 'Hozirgi va asosiy prefix solishtirildi', 'Compared active vs base prefix'),
      traceStep(2, 'print(...)', 'bool', 'Boolean natija olindi', 'Printed bool type', 'bool'),
    ],
    commonMistakes: [
      mistake('`.venv/` papkasini GitHub ga push qilish', 'Committing .venv/ to Git', `# git add .venv/ -> uploads 8,000+ OS-specific files!`, 'Bloated repo & broken binaries on other OSes', `print("Add '.venv/' to .gitignore before git add!")`, '`.venv` kompyuterga xos va juda katta.', 'Virtual envs are machine-specific and huge.', '`.gitignore` ga `.venv/` qo‘shing.', 'Add `.venv/` to `.gitignore`.'),
      mistake('Aktivatsiya qilmay `pip install` yozish', 'Installing Before Activating venv', `# Forgot 'source .venv/bin/activate' -> installs into global site-packages`, 'Works locally on your PC, breaks on teammate PCs', `print("Check prompt (.venv) or run: .venv/bin/python -m pip install ...")`, 'Promptda `(.venv)` belgisi chiqmaguncha global Python faol bo‘ladi.', 'Without activation, `pip` targets global Python.', 'Faollashtiring yoki `.venv` python yo‘lini ko‘rsating.', 'Activate first or call `.venv` Python directly.'),
    ],
    compareTitleUz: 'Global Python vs `venv`',
    compareTitleEn: 'Global Python vs `venv`',
    compareUz: ['Global Python: turli loyihalar paket versiyalari bir-biri bilan urishadi.', '`venv`: har bir loyiha uchun toza, mustaqil va qayta tiklanadigan muhit.'],
    compareEn: ['Global: fragile version conflicts across projects.', '`venv`: isolated, clean, reproducible dependencies per project.'],
    compareSummaryUz: 'Har bir yangi Python loyihasini `python -m venv .venv` yaratishdan boshlang.',
    compareSummaryEn: 'Start every Python project with `python -m venv .venv`.',
    practiceTasks: [
      pt('p0807_1', '1-mashq: `sys.base_prefix`', 'Task 1: Check Prefix Bool', '`isinstance(sys.prefix != sys.base_prefix, bool)` ni chiqaring.', 'Check venv prefix boolean.', `import sys\nprint(isinstance(sys.prefix != sys.base_prefix, bool))`, 'True', 'sys.prefix != sys.base_prefix', 'Prints True.'),
      pt('p0807_2', '2-mashq: Python major versiya', 'Task 2: Major Version', '`sys.version_info.major` ni chiqaring (`3`).', 'Print Python major version.', `import sys\nprint(sys.version_info.major)`, '3', 'sys.version_info.major', 'Prints 3.'),
      pt('p0807_3', '3-mashq: `venv` yaratish buyrug‘i', 'Task 3: Create Command', '`"python -m venv .venv"` satrini split qilib uzunligini chiqaring.', 'Inspect create venv command tokens.', `print(len("python -m venv .venv".split()))`, '4', 'python -m venv .venv', 'Prints 4.'),
      pt('p0807_4', '4-mashq: `.gitignore` filtri', 'Task 4: Gitignore Filter', '`[".venv/", "app.py"]` dan Git ga kiradiganlarini ajrating.', 'Filter non-ignored files.', `files = [".venv/", "app.py"]\nprint([f for f in files if f != ".venv/"])`, "['app.py']", 'Exclude .venv/.', 'Prints ["app.py"].'),
      pt('p0807_5', '5-mashq: `venv` moduli mavjudligi', 'Task 5: Stdlib venv Module', '`import venv` qilib `hasattr(venv, "create")` ni chiqaring.', 'Verify stdlib venv module.', `import venv\nprint(hasattr(venv, "create"))`, 'True', 'import venv', 'Prints True.'),
    ],
    quiz: [
      q('q0807_1', 'Yangi virtual muhit yaratishning standart buyrug‘i?', 'Standard command to create a virtual environment?', ['pip venv .venv', 'python -m venv .venv', 'mkdir .venv', 'git init venv'], ['pip venv .venv', 'python -m venv .venv', 'mkdir .venv', 'git init venv'], 1, '`python -m venv .venv`.', '`python -m venv .venv`.'),
      q('q0807_2', 'Python da faol `venv` da ekaningizni qanday tekshirasiz?', 'Expression checking if running inside a virtual environment?', ['os.venv == True', 'sys.prefix != sys.base_prefix', 'sys.version == 3', 'venv.active()'], ['os.venv == True', 'sys.prefix != sys.base_prefix', 'sys.version == 3', 'venv.active()'], 1, '`sys.prefix != sys.base_prefix`.', '`sys.prefix != sys.base_prefix`.'),
      q('q0807_3', '`.venv/` papkasini GitHub ga push qilish to‘g‘rimi?', 'Should `.venv/` be committed to Git?', ['Ha, majburiy', 'Yo‘q, .gitignore ga qo‘shish shart', 'Faqat Windows da', 'Faqat katta loyihada'], ['Yes', 'No, exclude it via .gitignore', 'Windows only', 'Large repos only'], 1, 'Yo‘q, `.gitignore` da turishi shart.', 'No, always ignore `.venv/`.'),
      q('q0807_4', 'Virtual muhitdan chiqish buyrug‘i?', 'Command to exit an activated venv?', ['exit_venv', 'deactivate', 'close', 'stop'], ['exit_venv', 'deactivate', 'close', 'stop'], 1, '`deactivate`.', '`deactivate`.'),
      q('q0807_5', 'Linux/macOS da `.venv` ni faollashtirish buyrug‘i?', 'POSIX command to activate `.venv`?', ['run .venv', 'source .venv/bin/activate', '.venv/Scripts/activate', 'start .venv'], ['run .venv', 'source .venv/bin/activate', '.venv/Scripts/activate', 'start .venv'], 1, '`source .venv/bin/activate`.', '`source .venv/bin/activate`.'),
    ],
    homework: hw('`.venv` Muhit Tekshiruv Skripti', 'Environment Health Checker', '`check_env()` funksiyasini yozing: u Python versiyasini, virtual muhit faolligini (`sys.prefix != sys.base_prefix`) va `.gitignore` tavsiya ro‘yxatini JSON hisobot sifatida chiqarsin.', 'Write `check_env()` returning a JSON diagnostic of Python version, `in_venv` flag, and recommended `.gitignore` entries.', ['sys.version_info va sys.prefix', 'JSON chiqish'], ['Inspect sys.version_info & sys.prefix', 'Format as JSON'], 'f"{sys.version_info.major}.{sys.version_info.minor}"', 'Format Python version.', 'Windows va Linux uchun aktivatsiya yo‘riqnomasini ham qo‘shing.', 'Include activation commands for both OSes.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-08-08',
    courseId: 'modules_packages',
    moduleId: 'c08_m3',
    order: 8,
    titleUz: '`requirements.txt` — bog‘liqliklarni muzlatish va tiklash',
    titleEn: '`requirements.txt`: Pinning, Dev Splitting & Clean Installs',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-08-07'],
    conceptId: 'requirements_txt',
    whyUz: "Loyihangizni do‘stingizga yoki serverga ko‘chirganingizda \"Mening kompyuterimda ishlayapti-ku!\" muammosini yo‘qotadigan asosiy fayl — **`requirements.txt`** (`pip install -r requirements.txt`).",
    whyEn: '`requirements.txt` makes environments reproducible across teammates and CI/CD servers via `python -m pip install -r requirements.txt`.',
    analogyUz: "`requirements.txt` — bu oshpazning aniq grammlar yozilgan masalliqlar ro‘yxati: har kim shu ro‘yxat bilan aynan bir xil taom (dastur muhiti) pishira oladi!",
    analogyEn: '`requirements.txt` is an exact ingredient recipe with measurements so every server rebuilds the identical environment.',
    stopsUz: "Bitta loyihada production paketlari (`fastapi`, `sqlalchemy`) va test/dev paketlarini (`pytest`, `ruff`) ajrating: `requirements.txt` hamda `requirements-dev.txt` (ichida `-r requirements.txt` bo‘ladi) — shunda Docker image yengil bo‘ladi!",
    stopsEn: 'Separate production dependencies (`requirements.txt`) from test/lint tools (`requirements-dev.txt` starting with `-r requirements.txt`) to keep production images lean.',
    objUz: ['`pip freeze > requirements.txt` va `pip install -r requirements.txt` siklini bilish', '`requirements.in` (asosiy paketlar) vs `requirements.txt` (pinned lock) farqini tushunish', '`requirements-dev.txt` bilan dev va prod muhitlarini ajratish'],
    objEn: ['Freeze and install dependencies via `requirements.txt`', 'Contrast top-level intents (`requirements.in`) vs exact pinned locks', 'Split `requirements-dev.txt` with `-r requirements.txt`'],
    theoryUz: `### 1. Asosiy Buyruqlar
- Saqlash: \`python -m pip freeze > requirements.txt\`
- Tiklash: \`python -m pip install -r requirements.txt\`
### 2. \`requirements.txt\` vs \`requirements-dev.txt\`
\`requirements-dev.txt\` ichida:
\`\`\`text
-r requirements.txt
pytest==8.3.0
ruff==0.6.0
\`\`\`
### 3. Top-Level Intent vs Transitive Freeze
\`pip freeze\` bilvosita paketlarni ham (30–50 qator) chiqaradi; asosiy keraklilarini aniq saqlab \`pip-compile\` yoki \`uv pip compile\` ishlatish yanada toza.
### 4. Keng tarqalgan xato
\`pip freeze\` ni \`venv\` dan tashqarida (global Python da) ishlatib 100 ta begona paketni loyihaga qo‘shib yuborish!`,
    theoryEn: `### 1. Freeze & Install Cycle
\`pip freeze > requirements.txt\` and \`pip install -r requirements.txt\`.
### 2. Splitting Dev Tools
Keep \`pytest\`/\`ruff\` in \`requirements-dev.txt\` referencing \`-r requirements.txt\`.
### 3. Direct vs Transitive Dependencies
Separate human-maintained direct dependencies from pinned lock snapshots.
### 4. Global Freeze Trap
Never run \`pip freeze\` outside an isolated \`.venv\`!`,
    examples: [
      ex('Misol 1: `requirements.txt` parseri (izoh, bo‘sh satr va `-r` filtri)', 'Example 1: Parsing requirements.txt', `import io\nraw = "# Core API\\nfastapi==0.115.0\\n\\n-r base.txt\\nSQLAlchemy>=2.0,<3.0\\n"\npkgs = []\nfor line in io.StringIO(raw):\n    s = line.strip()\n    if not s or s.startswith(("#", "-r")):\n        continue\n    pkgs.append(s)\nprint(pkgs)`, `['fastapi==0.115.0', 'SQLAlchemy>=2.0,<3.0']`, 'Izoh, bo‘sh satr va `-r` havola qatorlari tozalandi.', 'Parsed package specifications cleanly while skipping comments and `-r`.'),
      ex('Misol 2: Pinned (`==`) vs Unpinned tekshiruvi', 'Example 2: Auditing Pinned Specs', `specs = ["fastapi==0.115.0", "pytest", "pydantic==2.9.0"]\nunpinned = [s for s in specs if "==" not in s]\nprint("Unpinned:", unpinned)`, `Unpinned: ['pytest']`, 'Production muhitda aniq `==` bilan qotirilmagan paketlarni darrov topish mumkin.', 'Flagged unpinned dependency specifications cleanly.'),
      ex('Misol 3: Temp papkada `requirements.txt` va `requirements-dev.txt` yaratish', 'Example 3: Splitting Prod & Dev Requirements', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    req = Path(d) / "requirements.txt"\n    dev = Path(d) / "requirements-dev.txt"\n    req.write_text("fastapi==0.115.0\\n", encoding="utf-8")\n    dev.write_text("-r requirements.txt\\npytest==8.3.0\\n", encoding="utf-8")\n    print("Prod lines:", len(req.read_text(encoding="utf-8").splitlines()))\n    print("Dev lines:", len(dev.read_text(encoding="utf-8").splitlines()))`, `Prod lines: 1\nDev lines: 2`, 'Production va Dev bog‘liqliklar toza ajratildi.', 'Created split production and dev requirement manifests.'),
    ],
    traceTitleUz: 'Requirements tekshiruv izi',
    traceTitleEn: 'Tracing Spec Audit',
    traceCode: `lines = ["# comment", "uvicorn==0.30.0", ""]\nprint([l for l in lines if l and not l.startswith("#")])`,
    traceSteps: [
      traceStep(1, '"# comment"', 'skip', 'Izoh tashlandi', 'Skipped comment'),
      traceStep(2, '"uvicorn==0.30.0"', 'keep', 'Paket qo‘shildi', 'Kept package'),
      traceStep(3, '""', 'skip', 'Bo‘sh satr tashlandi', 'Skipped blank', "['uvicorn==0.30.0']"),
    ],
    commonMistakes: [
      mistake('Global Python muhitida `pip freeze` qilish', 'Running pip freeze Globally', `# Running pip freeze outside .venv dumps 120 unrelated system packages!`, 'Pollutes requirements.txt with global clutter', `print("Verify .venv is active before: python -m pip freeze > requirements.txt")`, 'Global muhitdagi begona kutubxonalar loyihaga yopishib qoladi.', 'Global freeze captures unrelated packages.', 'Faqat toza `.venv` ichida freeze qiling.', 'Freeze strictly inside `.venv`.'),
      mistake('`pytest` va linterlarni prod `requirements.txt` ga aralashtirish', 'Shipping Dev Tools to Production', `# Mixing pytest, black, mypy inside production Docker requirements`, 'Bloats deployment containers needlessly', `print("Keep dev tools in requirements-dev.txt with '-r requirements.txt'")`, 'Serverda test kutubxonalari kerak emas.', 'Production servers rarely need linters or test frameworks.', '`requirements-dev.txt` yarating.', 'Split dev dependencies.'),
    ],
    compareTitleUz: '`requirements.txt` vs `requirements-dev.txt`',
    compareTitleEn: '`requirements.txt` vs `requirements-dev.txt`',
    compareUz: ['`requirements.txt`: faqat ilova ishlashi uchun zarur runtime paketlar.', '`requirements-dev.txt`: `-r requirements.txt` + test/linter/formatter (`pytest`, `ruff`, `mypy`).'],
    compareEn: ['`requirements.txt`: minimal runtime dependencies.', '`requirements-dev.txt`: inherits runtime + adds test/lint tools.'],
    compareSummaryUz: 'Minimal runtime paketlarni `requirements.txt` da, test va linterlarni `requirements-dev.txt` da saqlang.',
    compareSummaryEn: 'Separate minimal runtime deps (`requirements.txt`) from dev tooling (`requirements-dev.txt`).',
    practiceTasks: [
      pt('p0808_1', '1-mashq: Paket nomini ajratish', 'Task 1: Extract Package Name', '`"fastapi==0.115.0".split("==")[0]` ni chiqaring.', 'Extract name before ==.', `print("fastapi==0.115.0".split("==")[0])`, 'fastapi', 'split("==")[0]', 'Prints fastapi.'),
      pt('p0808_2', '2-mashq: Izohlarni tozalash', 'Task 2: Clean Lines', '`["# a", "", "httpx==0.27"]` dan paket satrini chiqaring.', 'Filter non-comment lines.', `print([l for l in ["# a", "", "httpx==0.27"] if l and not l.startswith("#")])`, "['httpx==0.27']", 'Skip # and empty.', 'Prints list.'),
      pt('p0808_3', '3-mashq: Pin tekshiruvi', 'Task 3: All Pinned?', '`all("==" in s for s in ["a==1", "b==2"])` ni chiqaring.', 'Verify all pinned.', `print(all("==" in s for s in ["a==1", "b==2"]))`, 'True', 'Check == in each.', 'Prints True.'),
      pt('p0808_4', '4-mashq: `-r` havolasini aniqlash', 'Task 4: Detect -r Include', '`"-r requirements.txt".startswith("-r")` ni chiqaring.', 'Detect include directive.', `print("-r requirements.txt".startswith("-r"))`, 'True', 'startswith("-r")', 'Prints True.'),
      pt('p0808_5', '5-mashq: O‘rnatish buyrug‘i', 'Task 5: Install Command', '`python -m pip install -r requirements.txt` satrida `-r` borligini tekshiring.', 'Verify -r flag.', `cmd = "python -m pip install -r requirements.txt"\nprint(" -r " in cmd)`, 'True', 'Check -r flag.', 'Prints True.'),
    ],
    quiz: [
      q('q0808_1', '`requirements.txt` dan barcha paketlarni o‘rnatish buyrug‘i?', 'Command installing from `requirements.txt`?', ['pip load requirements.txt', 'python -m pip install -r requirements.txt', 'pip freeze requirements.txt', 'python requirements.txt'], ['pip load requirements.txt', 'python -m pip install -r requirements.txt', 'pip freeze requirements.txt', 'python requirements.txt'], 1, '`python -m pip install -r requirements.txt`.', '`python -m pip install -r requirements.txt`.'),
      q('q0808_2', '`requirements-dev.txt` birinchi qatoriga asosiy faylni ulash sintaksisi?', 'Directive inside `requirements-dev.txt` to include base requirements?', ['#include requirements.txt', '-r requirements.txt', 'import requirements.txt', '@base requirements.txt'], ['#include requirements.txt', '-r requirements.txt', 'import requirements.txt', '@base requirements.txt'], 1, '`-r requirements.txt`.', '`-r requirements.txt`.'),
      q('q0808_3', 'Nima uchun `pip freeze` faqat faol `.venv` ichida qilinadi?', 'Why run `pip freeze` only inside an active `.venv`?', ['Tezroq', 'Global tizimdagi keraksiz paketlarni qo‘shib yubormaslik uchun', 'Internet tejash', 'Shart emas'], ['Faster', 'Avoid capturing unrelated global system packages', 'Save bandwidth', 'Optional'], 1, 'Begona global paketlar kirmasligi uchun.', 'Prevents polluting project manifests with global packages.'),
      q('q0808_4', '`fastapi==0.115.0` nimani anglatadi?', 'What does `fastapi==0.115.0` enforce?', ['Kamida 0.115.0', 'Aynan 0.115.0 versiyani', 'Eng oxirgisini', '0.115 dan kichigini'], ['At least 0.115.0', 'Exact pinned version 0.115.0', 'Latest', 'Under 0.115'], 1, 'Aynan `0.115.0` versiyani.', 'Exact pinned version.'),
      q('q0808_5', '`requirements.txt` da izoh qaysi belgi bilan yoziladi?', 'Comment prefix in `requirements.txt`?', ['//', '/*', '#', '--'], ['//', '/*', '#', '--'], 2, '`#` belgisi bilan.', '`#`.'),
    ],
    homework: hw('`requirements.txt` Auditori', 'Requirements Manifest Auditor', 'Berilgan `requirements.txt` matnini tahlil qilib, nechta aniq pinned (`==`), nechta oralig‘li (`>=`) va nechta versiyasiz xavfli paket borligini hisoblovchi funksiya yozing.', 'Parse a multi-line `requirements.txt` string and report counts of exact-pinned (`==`), bounded (`>=`/`~=`), and unpinned packages.', ['Izoh va -r qatorlarini ajratish', 'JSON/dict hisobot'], ['Skip comments & -r lines', 'Return structured audit dict'], 'if "==" in spec: counts["pinned"] += 1', 'Classify each spec cleanly.', 'Dublikat paket nomlarini ham ogohlantiring.', 'Detect duplicate package entries.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-08-09',
    courseId: 'modules_packages',
    moduleId: 'c08_m3',
    order: 9,
    titleUz: '`pyproject.toml` — zamonaviy Python standarti va Review #17',
    titleEn: '`pyproject.toml` Standard (`tomllib`) & Review #17',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-08-08'],
    conceptId: 'pyproject_toml',
    whyUz: "Oldin Python loyihalarida `setup.py`, `setup.cfg`, `pytest.ini`, `.flake8` kabi 6 ta konfiguratsiya fayli sochilib yotardi. Bugun barcha Python vositalari (`pip`, `pytest`, `ruff`, `mypy`) yagona **`pyproject.toml`** faylida birlashgan!",
    whyEn: '`pyproject.toml` (PEP 517/518/621) unifies package metadata, dependencies, and tool configs (`pytest`, `ruff`, `mypy`) into one clean TOML manifest.',
    analogyUz: "`pyproject.toml` — bu loyihaning pasporti va barcha bo‘limlar uchun yagona boshqaruv markazi: 6 xil alohida qog‘oz o‘rniga bitta tartibli hujjat!",
    analogyEn: '`pyproject.toml` replaces half a dozen scattered config files with one standardized project passport.',
    stopsUz: "Python 3.11+ standart kutubxonasiga **`tomllib`** qo‘shildi! Eslatma: `tomllib.load(f)` faylni **binary rejimda (`\"rb\"`)** ochishni talab qiladi (`\"r\"` bilan ochsangiz `TypeError` beradi)!",
    stopsEn: 'Python 3.11+ includes `tomllib` in the stdlib! Always open TOML files in binary mode (`"rb"`) for `tomllib.load(f)`—text mode fails with `TypeError`.',
    objUz: ['PEP 621 `[project]`, `[project.optional-dependencies]`, `[tool.pytest.ini_options]`, `[tool.ruff]` bo‘limlarini bilish', 'Python 3.11+ `tomllib.loads()` va `tomllib.load(open(..., "rb"))` dan foydalanish', 'Editable install (`python -m pip install -e .`) tushunchasini bilish'],
    objEn: ['Structure `[project]`, `[project.optional-dependencies]`, and `[tool.*]` tables', 'Parse `pyproject.toml` cleanly via stdlib `tomllib` (opening files as `"rb"`)', 'Understand PEP 621 metadata and editable installs (`pip install -e .`)'],
    theoryUz: `### 1. Zamonaviy \`pyproject.toml\` Tuzilishi (PEP 621)
\`\`\`toml
[project]
name = "uz-shop-api"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = ["fastapi>=0.115,<1.0"]

[project.optional-dependencies]
dev = ["pytest>=8.0", "ruff>=0.6"]

[tool.ruff]
line-length = 100
\`\`\`
### 2. \`tomllib\` Bilan O‘qish (Python 3.11+)
- Stringdan: \`tomllib.loads(toml_str)\`
- Fayldan: \`with open("pyproject.toml", "rb") as f: data = tomllib.load(f)\` (**albatta \`"rb"\`**!)
### 3. Editable Install (\`-e .\`)
\`python -m pip install -e ".[dev]"\` — kodingizni paket qilib o‘rnatadi va \`src/\` dagi o‘zgarishlar darhol ko‘rinadi!
### 4. Keng tarqalgan xato
\`tomllib.load()\` ga \`"r"\` text mode fayl berish -> \`TypeError\`.`,
    theoryEn: `### 1. PEP 621 Layout
\`[build-system]\`, \`[project]\`, \`[project.optional-dependencies]\`, and \`[tool.*]\` sections.
### 2. Parsing via \`tomllib\`
\`tomllib.loads(s)\` for strings and \`tomllib.load(f)\` with binary mode \`"rb"\`.
### 3. Editable Installs
\`pip install -e ".[dev]"\` links local \`src/\` code directly into \`.venv\`.
### 4. Pitfall
Passing a text-mode handle to \`tomllib.load()\` raises \`TypeError\`.`,
    examples: [
      ex('Misol 1: `tomllib.loads()` bilan `pyproject.toml` o‘qish', 'Example 1: Parsing pyproject.toml with tomllib', `import tomllib\n\ntoml_text = '''\n[project]\nname = "uz-api"\nversion = "1.2.0"\nrequires-python = ">=3.11"\ndependencies = ["fastapi>=0.115"]\n\n[tool.ruff]\nline-length = 100\n'''\ndata = tomllib.loads(toml_text)\nprint("Name:", data["project"]["name"], "| Deps:", data["project"]["dependencies"])\nprint("Ruff line-length:", data["tool"]["ruff"]["line-length"])`, `Name: uz-api | Deps: ['fastapi>=0.115']\nRuff line-length: 100`, '`tomllib.loads()` TOML bo‘limlarini toza Python `dict` ga aylantirdi.', 'Parsed PEP 621 metadata and tool config directly into Python dicts.'),
      ex('Misol 2: `open(..., "rb")` bilan fayldan `tomllib.load()`', 'Example 2: Binary Mode tomllib.load()', `import tempfile, tomllib\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as d:\n    p = Path(d) / "pyproject.toml"\n    p.write_text('[project]\\nname = "demo"\\nversion = "0.1.0"\\n', encoding="utf-8")\n    with open(p, "rb") as f:\n        cfg = tomllib.load(f)\n    print(cfg["project"]["name"], cfg["project"]["version"])`, `demo 0.1.0`, '`tomllib.load(f)` albatta `"rb"` (binary read) rejimini talab qiladi.', '`tomllib.load()` requires `"rb"` binary mode.'),
      ex('Misol 3: `optional-dependencies` (`dev`) ni tekshirish', 'Example 3: Reading Optional Dependencies', `import tomllib\nsrc = '[project.optional-dependencies]\\ndev = ["pytest>=8.0", "ruff"]'\ncfg = tomllib.loads(src)\nprint(cfg["project"]["optional-dependencies"]["dev"])`, `['pytest>=8.0', 'ruff']`, 'Dev va test paketlari `[project.optional-dependencies]` ostida guruhlanadi.', 'Optional extras like `dev` live cleanly under `optional-dependencies`.'),
    ],
    traceTitleUz: '`tomllib` TOML -> dict izi',
    traceTitleEn: 'Tracing tomllib Parse',
    traceCode: `import tomllib\nd = tomllib.loads('[project]\\nversion = "2.0.0"') \nprint(d["project"]["version"])`,
    traceSteps: [
      traceStep(1, '[project]', "{'project': {}}", 'Bo‘lim dict ochildi', 'Opened [project] table'),
      traceStep(2, 'version = "2.0.0"', "{'project': {'version': '2.0.0'}}", 'Qiymat bog‘landi', 'Bound version key', '2.0.0'),
    ],
    commonMistakes: [
      mistake('`tomllib.load(open("pyproject.toml", "r"))` text mode da ochish', 'Opening TOML in Text Mode', `import tempfile, tomllib\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    p = Path(d) / "a.toml"\n    p.write_text("x = 1", encoding="utf-8")\n    try:\n        with open(p, "r", encoding="utf-8") as f:\n            tomllib.load(f)\n    except TypeError as e:\n        print("Error:", type(e).__name__)`, 'Error: TypeError', `import tempfile, tomllib\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    p = Path(d) / "a.toml"\n    p.write_text("x = 1", encoding="utf-8")\n    with open(p, "rb") as f:\n        print("Loaded:", tomllib.load(f))`, '`tomllib.load` faqat binary stream (`"rb"`) qabul qiladi.', '`tomllib.load` requires a binary file object (`"rb"`).', 'Doim `open(path, "rb")` yozing.', 'Always open with `"rb"`.'),
      mistake('Eski `setup.py` da Python kod yurgizib paket taʼriflash', 'Using Legacy Imperative setup.py', `# setup.py executes arbitrary code on pip inspect; pyproject.toml is declarative`, 'Harder tooling integration and security risk', `print("Prefer declarative pyproject.toml (PEP 621)!")`, 'Zamonaviy Python standart deklarativ `pyproject.toml` ni talab qiladi.', 'PEP 621 replaces `setup.py` with declarative TOML.', 'Yangi loyihalarda `pyproject.toml` yarating.', 'Use `pyproject.toml` for all new packages.'),
    ],
    compareTitleUz: '`requirements.txt` vs `pyproject.toml`',
    compareTitleEn: '`requirements.txt` vs `pyproject.toml`',
    compareUz: ['`requirements.txt`: oddiy ilovalar va serverga aniq pinlangan versiyalarni qo‘yish (deploy) uchun juda qulay.', '`pyproject.toml`: kutubxonalar, paketlash (`pip install -e .`) va `ruff`/`pytest`/`mypy` sozlamalarini bir joyda yig‘ish uchun zamonaviy standart.'],
    compareEn: ['`requirements.txt`: simple exact runtime pinning for deployments.', '`pyproject.toml`: unified PEP 621 manifest + tool configuration (`pytest`, `ruff`, `mypy`).'],
    compareSummaryUz: 'Loyiha konfiguratsiyasi uchun `pyproject.toml`, serverga aniq versiyalarni deploy qilish uchun esa pinlangan lock (`requirements.txt`) ishlating.',
    compareSummaryEn: 'Use `pyproject.toml` as your single project manifest and pinned lockfiles for deterministic deploys.',
    practiceTasks: [
      pt('p0809_1', '1-mashq: `tomllib.loads`', 'Task 1: Parse TOML String', "`'a = 10\\nb = \"py\"'` ni parse qilib `d[\"b\"]` chiqaring.", 'Parse simple TOML.', `import tomllib\nprint(tomllib.loads('a = 10\\nb = "py"')["b"])`, 'py', 'tomllib.loads', 'Prints py.'),
      pt('p0809_2', '2-mashq: `[project]` jadvali', 'Task 2: Read [project]', "`'[project]\\nname = \"api\"'` dan `\"name\"` chiqaring.", 'Read project.name.', `import tomllib\nd = tomllib.loads('[project]\\nname = "api"')\nprint(d["project"]["name"])`, 'api', 'd["project"]["name"]', 'Prints api.'),
      pt('p0809_3', '3-mashq: `"rb"` bilan fayl o‘qish', 'Task 3: Binary Load', 'Temp `a.toml` faylini `"rb"` bilan `tomllib.load` qiling.', 'Load TOML file in rb mode.', `import tempfile, tomllib\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    p = Path(d) / "a.toml"\n    p.write_text("port = 8000", encoding="utf-8")\n    with open(p, "rb") as f:\n        print(tomllib.load(f)["port"])`, '8000', 'open(p, "rb")', 'Prints 8000.'),
      pt('p0809_4', '4-mashq: `[tool.ruff]`', 'Task 4: Tool Config', "`'[tool.ruff]\\nline-length = 88'` dan `88` chiqaring.", 'Extract tool.ruff.line-length.', `import tomllib\nd = tomllib.loads('[tool.ruff]\\nline-length = 88')\nprint(d["tool"]["ruff"]["line-length"])`, '88', 'Nested keys.', 'Prints 88.'),
      pt('p0809_5', '5-mashq: `dependencies` ro‘yxati', 'Task 5: Dependencies Array', "`'[project]\\ndependencies = [\"httpx\", \"rich\"]'` uzunligini chiqaring.", 'Count dependencies.', `import tomllib\nd = tomllib.loads('[project]\\ndependencies = ["httpx", "rich"]')\nprint(len(d["project"]["dependencies"]))`, '2', 'len(dependencies)', 'Prints 2.'),
    ],
    quiz: [
      q('q0809_1', 'Python 3.11+ da TOML fayllarni o‘qish uchun standart kutubxona moduli?', 'Stdlib module added in Python 3.11 for parsing TOML?', ['toml', 'tomllib', 'configparser', 'json'], ['toml', 'tomllib', 'configparser', 'json'], 1, '`tomllib`.', '`tomllib`.'),
      q('q0809_2', '`tomllib.load(f)` ga beriladigan fayl qaysi rejimda ochilishi shart?', 'Required file mode for `tomllib.load(f)`?', ['"r"', '"rb"', '"w"', '"rt"'], ['"r"', '"rb"', '"w"', '"rt"'], 1, 'Binary read (`"rb"`).', '`"rb"`.'),
      q('q0809_3', 'Loyiha nomi, versiyasi va bog‘liqliklari qaysi `pyproject.toml` bo‘limida turadi?', 'Section holding project name, version, and dependencies?', ['[tool.app]', '[project]', '[meta]', '[pip]'], ['[tool.app]', '[project]', '[meta]', '[pip]'], 1, '`[project]` (PEP 621).', '`[project]`.'),
      q('q0809_4', '`python -m pip install -e .` dagi `-e` bayrog‘i nimani bildiradi?', 'What does `-e` mean in `pip install -e .`?', ['Encrypted', 'Editable install (kod o‘zgarishi darhol ishlaydi)', 'Exact version', 'Exit'], ['Encrypted', 'Editable install (live local source link)', 'Exact', 'Exit'], 1, 'Editable mode.', 'Editable mode.'),
      q('q0809_5', '`pytest` va `ruff` sozlamalari `pyproject.toml` da qaysi bo‘lim ostida yoziladi?', 'Prefix section for tool settings in `pyproject.toml`?', ['[apps.*]', '[tool.*]', '[dev.*]', '[scripts.*]'], ['[apps.*]', '[tool.*]', '[dev.*]', '[scripts.*]'], 1, '`[tool.pytest]`, `[tool.ruff]` kabi `[tool.*]` ostida.', '`[tool.*]`.'),
    ],
    homework: hw('`pyproject.toml` Validator', 'Manifest Validator', 'Temp papkada to‘liq `pyproject.toml` (`[project]`, `[project.optional-dependencies]`, `[tool.pytest.ini_options]`) yaratib, uni `tomllib` bilan `"rb"` rejimida o‘qib barcha majburiy maydonlar (`name`, `version`, `requires-python`) borligini tekshiruvchi skript tuzing.', 'Create a temp `pyproject.toml`, parse it in `"rb"` mode with `tomllib`, and validate required PEP 621 fields cleanly.', ['open(..., "rb") + tomllib.load', 'Majburiy kalitlarni tekshirish'], ['Use rb + tomllib.load', 'Validate required keys'], 'missing = [k for k in ("name", "version") if k not in proj]', 'Check missing keys.', 'Qayta ishlatiluvchi `validate_pyproject(path: Path)` funksiyasi yozing.', 'Add type hints and docstring.', 20),
    reviewCheckpoint: review(
      17,
      'Review Loyiha #17: Python Loyiha Muhiti Auditori (`pyproject` + `requirements` + `venv`)',
      'Review Project #17: Python Workspace & Manifest Auditor',
      '85-dars marrasi! `pathlib`, `tomllib`, `sys` va `importlib` bilimlarini birlashtirib, har qanday Python loyiha papkasida `pyproject.toml`, `requirements.txt` va `.gitignore` holatini tekshiruvchi auditor quring.',
      '85-lesson milestone! Combine `pathlib`, `tomllib`, and `sys` into a workspace diagnostic tool auditing `pyproject.toml` and `.gitignore`.',
      ['`pyproject.toml` ni `tomllib` bilan tahlil qilish', '`.gitignore` da `.venv/` borligini tekshirish', 'Audit natijasini JSON hisobot sifatida chiqarish'],
      ['Parse `pyproject.toml` via `tomllib`', 'Verify `.venv/` inside `.gitignore`', 'Emit structured audit report'],
      `import json, tempfile, tomllib
from pathlib import Path

with tempfile.TemporaryDirectory() as d:
    root = Path(d)
    (root / "pyproject.toml").write_text('[project]\\nname = "core-api"\\nversion = "0.2.0"\\ndependencies = ["fastapi"]\\n', encoding="utf-8")
    (root / ".gitignore").write_text(".venv/\\n__pycache__/\\n", encoding="utf-8")
    with open(root / "pyproject.toml", "rb") as f:
        meta = tomllib.load(f)["project"]
    ignored = set((root / ".gitignore").read_text(encoding="utf-8").splitlines())
    report = {"project": meta["name"], "deps": len(meta["dependencies"]), "venv_ignored": ".venv/" in ignored}
    print(json.dumps(report))`,
    ),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-08-10',
    courseId: 'modules_packages',
    moduleId: 'c08_m4',
    order: 10,
    titleUz: 'Git va GitHub — versiya nazorati, `.gitignore` va commit intizomi',
    titleEn: 'Git & GitHub Workflows: Commits, Branches, PRs & `.gitignore`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-08-09'],
    conceptId: 'git_github',
    whyUz: "Dasturchi hayotida \"kodim buzilib qoldi, kechagi versiyaga qayta olmayapman\" yoki \"maxfiy API kalitini GitHub ga push qilib yubordim!\" kabi falokatlarni faqat professional Git bilimi bartaraf etadi.",
    whyEn: 'Git version control tracks history safely, enables collaborative feature branches/PRs on GitHub, and `.gitignore` prevents secrets or `.venv/` from leaking.',
    analogyUz: "Git — bu o‘yinlardagi \"Checkpoint Save\": har bir muhim o‘zgarishdan keyin (`git commit`) saqlab qo‘yasiz; xato qilsangiz istalgan eski nuqtaga 1 soniyada qaytish mumkin!",
    analogyEn: 'Git commits are save checkpoints in your project timeline; branches let you experiment safely without breaking `main`.',
    stopsUz: "**HECH QACHON** `.env` fayli, API kalitlar, parollar, `.venv/`, `__pycache__/` yoki katta SQLite bazalarni Git ga commit qilmang! Bir marta GitHub ga push bo‘lgan maxfiy kalitni oddiy keyingi commit o‘chira olmaydi (tarixda qoladi — kalitni darrov revoke/rotate qilish kerak bo‘ladi!).",
    stopsEn: 'NEVER commit `.env`, API keys, `.venv/`, or `__pycache__/`. Secrets pushed once stay in Git history until rotated!',
    objUz: ['Asosiy Git siklini (`git status`, `add`, `commit`, `branch`, `switch`, `push`, `pull`) bilish', 'Python uchun standart `.gitignore` tarkibini (`.venv/`, `__pycache__/`, `.env`, `.pytest_cache/`) tuzish', 'Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`) va Pull Request madaniyatini o‘rganish'],
    objEn: ['Navigate the core Git workflow (`status`, `add`, `commit`, `branch`, `switch`, `push`)', 'Maintain a clean Python `.gitignore` excluding `.venv/`, `__pycache__/`, and `.env`', 'Write clear Conventional Commits (`feat:`, `fix:`, `test:`) and clean PRs'],
    theoryUz: `### 1. Asosiy Git Sikli
1. \`git status\` — nimalar o‘zgarganini ko‘rish
2. \`git switch -c feat/auth\` — yangi branch ochish
3. \`git add -p\` / \`git add src/\` — faqat kerakli fayllarni stage qilish
4. \`git commit -m "feat: add jwt auth helper"\`
5. \`git push -u origin feat/auth\` -> GitHub da Pull Request!
### 2. Majburiy Python \`.gitignore\`
\`__pycache__/\`, \`*.py[cod]\`, \`.venv/\`, \`.env\`, \`.pytest_cache/\`, \`.mypy_cache/\`, \`dist/\`.
### 3. Conventional Commits
- \`feat:\` yangi imkoniyat
- \`fix:\` xato tuzatish
- \`test:\` test qo‘shish
- \`refactor:\` tuzilmani yaxshilash
### 4. Keng tarqalgan xato
\`git add .\` qilishdan oldin \`.gitignore\` tekshirmasdan \`.env\` yoki \`.venv\` ni push qilib yuborish.`,
    theoryEn: `### 1. Core Git Lifecycle
Check \`git status\`, work on a feature branch (\`git switch -c feat/...\`), stage changes, commit atomically, and push PRs.
### 2. Essential Python \`.gitignore\`
Ignore \`__pycache__/\`, \`*.pyc\`, \`.venv/\`, \`.env\`, \`.pytest_cache/\`, and build artifacts.
### 3. Conventional Commits
Prefix commits cleanly: \`feat:\`, \`fix:\`, \`test:\`, \`docs:\`, \`refactor:\`.
### 4. Secret Leak Rule
Never commit \`.env\`; provide an empty \`.env.example\` template instead.`,
    examples: [
      ex('Misol 1: `.gitignore` qoidalarini tekshiruvchi funksiya', 'Example 1: Python .gitignore Pattern Matcher', `import fnmatch\npatterns = [".venv/", "__pycache__/", "*.pyc", ".env", ".pytest_cache/"]\ndef is_ignored(path: str) -> bool:\n    return any(path.startswith(p.rstrip("/")) or fnmatch.fnmatch(path, p) for p in patterns)\n\nfor p in ["src/app.py", ".env", "app.pyc", ".venv/bin/python"]:\n    print(p, "-> ignored?", is_ignored(p))`, `src/app.py -> ignored? False\n.env -> ignored? True\napp.pyc -> ignored? True\n.venv/bin/python -> ignored? True`, 'Manba kodlar saqlandi, maxfiy va kesh fayllar chiqarib tashlandi.', 'Allowed source files while blocking `.env`, `.pyc`, and `.venv/`.'),
      ex('Misol 2: Conventional Commit xabar validator', 'Example 2: Validating Commit Messages', `import re\nPATTERN = re.compile(r"^(feat|fix|docs|test|refactor|chore)(\\(.+\\))?: .{3,}")\nfor msg in ["feat: add login", "wip", "fix(api): handle 404"]:\n    print(msg, "-> valid?", bool(PATTERN.match(msg)))`, `feat: add login -> valid? True\nwip -> valid? False\nfix(api): handle 404 -> valid? True`, 'Regex yordamida aniq va mazmunli commit xabarlari tekshirildi.', 'Validated Conventional Commit prefixes cleanly.'),
      ex('Misol 3: `.env.example` vs `.env` shablon tekshiruvi', 'Example 3: Safe .env.example Template', `env_example = {"DATABASE_URL": "", "JWT_SECRET": ""}\nhas_real_secrets = any(bool(v) for v in env_example.values())\nprint("Safe to commit .env.example?", not has_real_secrets)`, `Safe to commit .env.example? True`, '`.env.example` da faqat kalit nomlari bo‘ladi, haqiqiy parollar emas.', 'Committed `.env.example` contains keys without secret values.'),
    ],
    traceTitleUz: 'Gitignore filtrlash izi',
    traceTitleEn: 'Tracing Gitignore Filter',
    traceCode: `files = ["main.py", ".env", "a.pyc"]\nprint([f for f in files if f != ".env" and not f.endswith(".pyc")])`,
    traceSteps: [
      traceStep(1, '"main.py"', 'keep', 'Manba kod saqlandi', 'Kept source'),
      traceStep(2, '".env", "a.pyc"', 'ignored', 'Maxfiy va baytkod chetlatildi', 'Excluded secret and bytecode', "['main.py']"),
    ],
    commonMistakes: [
      mistake('`.env` faylini GitHub ga commit qilish', 'Leaking .env Secrets to Git', `# git add .env -> exposes API keys in public/team commit history forever!`, 'Account compromise risk even if deleted in a later commit', `print("Commit '.env.example' without values, and ignore '.env' in .gitignore!")`, 'Keyingi commitda o‘chirganingiz bilan eski commit tarixida kalit qoladi.', 'Deleted secrets remain reachable in Git history.', '`.env` ni `.gitignore` ga qo‘shing va `.env.example` bering.', 'Ignore `.env` and ship `.env.example`.'),
      mistake('`"fix"`, `"asdf"`, `"update"` deb maʼnosiz commit yozish', 'Vague Commit Messages', `# git commit -m "changes" -> impossible to understand 2 months later`, 'Painful debugging and git bisect', `print("Write: 'fix(auth): reject expired JWT tokens'")`, 'Aniq commit xabari kelajakdagi debugging ni tezlashtiradi.', 'Clear commit messages explain *why* a change occurred.', 'Conventional Commits (`feat:`, `fix:`) qo‘llang.', 'Follow Conventional Commits.'),
    ],
    compareTitleUz: 'To‘g‘ridan-to‘g‘ri `main` ga push vs Feature Branch + PR',
    compareTitleEn: 'Direct `main` Push vs Feature Branch + PR',
    compareUz: ['`main` ga to‘g‘ridan-to‘g‘ri push: sinovdan o‘tmagan kod butun jamoani sindirishi mumkin.', 'Feature Branch (`feat/...`) + PR: CI testlar, code review va xavfsiz merge.'],
    compareEn: ['Direct `main` push: risks breaking the shared build.', 'Feature branch + PR: enables review and automated test gates.'],
    compareSummaryUz: 'Har bir yangi vazifa uchun alohida branch oching va hech qachon `.env`/`.venv` ni commit qilmang.',
    compareSummaryEn: 'Work in feature branches, follow Conventional Commits, and keep `.env`/`.venv` untracked.',
    practiceTasks: [
      pt('p0810_1', '1-mashq: Conventional Commit', 'Task 1: Commit Check', '`"feat: add user api".startswith(("feat:", "fix:"))` chiqaring.', 'Check valid prefix.', `print("feat: add user api".startswith(("feat:", "fix:")))`, 'True', 'Check tuple prefixes.', 'Prints True.'),
      pt('p0810_2', '2-mashq: `.pyc` va `__pycache__`', 'Task 2: Cache Filter', '`["a.py", "a.pyc", "__pycache__/x"]` dan toza `.py` faylni ajrating.', 'Keep clean .py only.', `files = ["a.py", "a.pyc", "__pycache__/x"]\nprint([f for f in files if f.endswith(".py")])`, "['a.py']", 'endswith(".py")', 'Prints ["a.py"].'),
      pt('p0810_3', '3-mashq: Branch nomi formati', 'Task 3: Slugify Branch Name', '`"Add Login Flow"` dan `"feat/add-login-flow"` yasang.', 'Build branch name.', `t = "Add Login Flow"\nprint("feat/" + t.lower().replace(" ", "-"))`, 'feat/add-login-flow', 'lower + replace', 'Prints branch.'),
      pt('p0810_4', '4-mashq: `.env.example` generatori', 'Task 4: Strip Secret Values', '`{"PORT": "8000", "KEY": "secret"}` dan faqat `KEY=` shablonini yasang.', 'Blank out values for .env.example.', `cfg = {"PORT": "8000", "KEY": "secret"}\nprint("\\n".join(f"{k}=" for k in cfg))`, 'PORT=\nKEY=', 'Keep keys only.', 'Prints lines.'),
      pt('p0810_5', '5-mashq: Git buyruq ketma-ketligi', 'Task 5: Git Workflow Order', '`["status", "add", "commit", "push"]` tartibini ` -> ` bilan chiqaring.', 'Join Git steps.', `print(" -> ".join(["status", "add", "commit", "push"]))`, 'status -> add -> commit -> push', 'Use join().', 'Prints chain.'),
    ],
    quiz: [
      q('q0810_1', 'Qaysi fayl HECH QACHON GitHub ga yuklanmasligi kerak?', 'Which file must NEVER be committed to Git?', ['README.md', 'pyproject.toml', '.env (maxfiy kalitlar bilan)', 'tests/test_app.py'], ['README.md', 'pyproject.toml', '.env (containing secrets)', 'tests/test_app.py'], 2, '`.env` maxfiy kalitlarni saqlaydi.', '`.env` holds secrets.'),
      q('q0810_2', 'Yangi branch yaratib unga o‘tishning zamonaviy Git buyrug‘i?', 'Modern Git command to create and switch to a branch?', ['git move', 'git switch -c feat/x', 'git branch -go', 'git jump'], ['git move', 'git switch -c feat/x', 'git branch -go', 'git jump'], 1, '`git switch -c <branch>`.', '`git switch -c <branch>`.'),
      q('q0810_3', 'Conventional Commits da xato tuzatish qanday boshlanadi?', 'Conventional Commit prefix for a bug fix?', ['add:', 'fix:', 'bug:', 'edit:'], ['add:', 'fix:', 'bug:', 'edit:'], 1, '`fix: ...`.', '`fix: ...`.'),
      q('q0810_4', 'Python `.gitignore` da bo‘lishi shart bo‘lgan kompilyatsiya kesh papkasi?', 'Python bytecode cache folder ignored in `.gitignore`?', ['src/', '__pycache__/', 'docs/', 'tests/'], ['src/', '__pycache__/', 'docs/', 'tests/'], 1, '`__pycache__/`.', '`__pycache__/`.'),
      q('q0810_5', 'Agar tasodifan API kalitini GitHub ga push qilib qo‘ysangiz birinchi qadam?', 'First action if a real API key is pushed to GitHub?', ['Keyingi commitda o‘chirish yetarli', 'Kalitni darhol revoke/rotate (almashtirish) qilish', 'Fayl nomini o‘zgartirish', 'Hech narsa'], ['Just delete in next commit', 'Revoke/rotate the exposed key immediately', 'Rename file', 'Ignore'], 1, 'Tarixdan darrov chiqarib bo‘lmagani uchun kalitni zudlik bilan almashtiring.', 'Immediately revoke and rotate the secret.'),
    ],
    homework: hw('Python Loyiha Git Tayyorlovchisi', 'Repo Hygiene Checker', 'Temp papkada `.gitignore`, `.env.example` va `README.md` yarating, so‘ng `.env` va `.venv/` commit ro‘yxatiga tushmasligini tekshiruvchi `audit_staged(files, gitignore)` funksiyasini yozing.', 'Create `.gitignore`, `.env.example`, and `README.md` in a temp repo, and write `audit_staged(files, gitignore)` catching forbidden `.env`/`.venv`/`__pycache__` files.', ['Standard Python .gitignore', 'fnmatch filtri'], ['Standard Python .gitignore', 'fnmatch checks'], 'fnmatch.fnmatch(path, pat)', 'Check each file path.', 'Conventional commit xabarlarini tekshiruvchi funksiya ham qo‘shing.', 'Validate commit format too.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-08-11',
    courseId: 'modules_packages',
    moduleId: 'c08_m4',
    order: 11,
    titleUz: 'Project Structure — professional Python loyiha arxitekturasi',
    titleEn: 'Clean Python Project Structure: `src/` Layout, Tests & Docs',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-08-10'],
    conceptId: 'project_structure',
    whyUz: "Hamma fayllar (`models.py`, `routes.py`, `test_api.py`, `notes.txt`) bitta papkada aralashib yotsa loyiha tezda tartibsiz axlatxonaga aylanadi! Professional Python paketlari **`src/` layout** va ajratilgan `tests/` papkasidan foydalanadi.",
    whyEn: 'A clean `src/` layout separates installable package code from `tests/`, `docs/`, and root configs—preventing accidental local imports in CI.',
    analogyUz: "`src/` layout — bu uy arxitekturasi: yashash xonalari (`src/myapp/`), garaj (`tests/`), kirish yo‘lagi (`README.md`, `pyproject.toml`) alohida joylashadi!",
    analogyEn: 'The `src/` layout separates living quarters (`src/myapp/`), testing workshop (`tests/`), and blueprints (`pyproject.toml`, `README.md`).',
    stopsUz: "Nima uchun **`src/myapp/`** flat `myapp/` dan ustun? Flat papkada `pytest` siz o‘rnatmagan (ishchi) lokal fayllarni tasodifan import qilib o‘tadi, `src/` esa paket to‘g‘ri o‘rnatilganini (`pip install -e .`) majburiy tekshiradi!",
    stopsEn: 'The `src/` layout ensures `pytest` tests the actually installed package rather than accidentally importing un-packaged files from the current working directory.',
    objUz: ['Standart `src/<package_name>/` va `tests/` loyiha daraxtini qurish', 'Qatlamlar bo‘yicha ajratish (`models/`, `services/`, `repositories/`, `api/`) ni tushunish', '`README.md`, `pyproject.toml`, `.gitignore`, `.env.example` ildiz fayllarini bilish'],
    objEn: ['Organize scalable `src/<pkg>/` and `tests/` project trees', 'Separate layers (`models`, `services`, `api`, `utils`) cleanly', 'Include standard root files (`README.md`, `pyproject.toml`, `.gitignore`)'],
    theoryUz: `### 1. Professional Python Loyiha Daraxti
\`\`\`text
my_service/
├── pyproject.toml
├── README.md
├── .gitignore
├── .env.example
├── src/
│   └── my_service/
│       ├── __init__.py
│       ├── config.py
│       ├── models.py
│       └── services.py
└── tests/
    └── test_services.py
\`\`\`
### 2. Nima Uchun \`src/\` Layout Standart?
Testlar \`src\` ichidagi paketni faqat o‘rnatilgan (\`pip install -e .\`) holatda ko‘radi — paketlash xatolarini ishlab chiqarishdan oldin ushlaydi!
### 3. Qatlamlar Masʼuliyati
- \`config.py\`: sozlamalar
- \`models.py\`: ma’lumot tuzilmalari
- \`services.py\`: biznes mantiq
- \`tests/\`: unit va integratsiya testlari
### 4. Keng tarqalgan xato
Test fayllarini (\`test_*.py\`) paketning o‘zi (\`src/my_service/\`) ichiga qo‘shib yuborish (paket hajmi kattalashadi).`,
    theoryEn: `### 1. Standard \`src/\` Layout
Root manifests + \`src/<pkg>/\` + parallel \`tests/\` tree.
### 2. Why \`src/\` Beats Flat Layout
Prevents accidental imports from CWD during testing.
### 3. Clean Separation of Concerns
Isolate config, models, business services, and I/O adapters.
### 4. Keep Tests Outside Package Source
Place \`tests/\` alongside \`src/\`, not inside \`src/<pkg>/\`.`,
    examples: [
      ex('Misol 1: `pathlib` bilan professional `src/` loyiha generatori', 'Example 1: Scaffolding src/ Project Layout', `import tempfile\nfrom pathlib import Path\n\ndef scaffold_project(root: Path, pkg: str) -> list[str]:\n    files = [\n        root / "pyproject.toml",\n        root / "README.md",\n        root / ".gitignore",\n        root / "src" / pkg / "__init__.py",\n        root / "src" / pkg / "core.py",\n        root / "tests" / f"test_{pkg}.py",\n    ]\n    for f in files:\n        f.parent.mkdir(parents=True, exist_ok=True)\n        f.write_text("", encoding="utf-8")\n    return sorted(f.relative_to(root).as_posix() for f in files)\n\nwith tempfile.TemporaryDirectory() as d:\n    created = scaffold_project(Path(d), "billing")\n    for path in created:\n        print(path)`, `.gitignore\nREADME.md\npyproject.toml\nsrc/billing/__init__.py\nsrc/billing/core.py\ntests/test_billing.py`, '6 ta standart fayl bir soniyada toza `src/` strukturada yaratildi.', 'Scaffolded clean `src/` layout with separate `tests/` directory.'),
      ex('Misol 2: Loyiha ildizi (Root) sog‘lig‘ini tekshiruvchi auditor', 'Example 2: Auditing Required Root Files', `required = {"pyproject.toml", "README.md", ".gitignore"}\npresent = {"pyproject.toml", "README.md", ".gitignore", "src"}\nprint("Missing:", sorted(required - present))`, `Missing: []`, 'To‘plam (set) ayirmasi yetishmayotgan fayllarni 1 qatorda tekshiradi.', 'Set difference validates repository completeness cleanly.'),
      ex('Misol 3: `src/` paketining `tests/` dan ajratilganligini tekshirish', 'Example 3: Ensuring Tests Stay Outside src/', `paths = ["src/app/__init__.py", "src/app/api.py", "tests/test_api.py"]\nleaked_tests = [p for p in paths if p.startswith("src/") and "test_" in p]\nprint("Tests leaked into src/?", bool(leaked_tests))`, `Tests leaked into src/? False`, 'Testlar `src/` tashqarisida saqlangani uchun tarqatiladigan paket toza qoladi.', 'Confirmed no test modules leaked inside `src/`.'),
    ],
    traceTitleUz: 'Scaffold papkalar yaratish izi',
    traceTitleEn: 'Tracing Scaffold Tree',
    traceCode: `from pathlib import Path\np = Path("src") / "shop" / "core.py"\nprint(p.parts)`,
    traceSteps: [
      traceStep(1, 'Path("src") / "shop" / "core.py"', "('src', 'shop', 'core.py')", 'Yo‘l segmentlarga ajraldi', 'Built nested path parts', "('src', 'shop', 'core.py')"),
    ],
    commonMistakes: [
      mistake('Barcha 15 ta faylni bitta ildiz papkaga tashlab yuborish', 'Flat Dumping Everything in Root', `# app.py, db.py, auth.py, test1.py, test2.py, temp.txt all mixed in root/`, 'Messy imports and accidental test shipping', `print("Group source inside src/<pkg>/ and tests inside tests/!")`, 'Aralash papkada kod va testlar bir-biriga xalaqit beradi.', 'Flat roots mix app modules, scratch files, and tests.', 'Doim `src/<pkg>/` va `tests/` ajrating.', 'Separate `src/` and `tests/`.'),
      mistake('`test_*.py` fayllarini `src/<pkg>/` ichiga qo‘yish', 'Shipping Tests Inside Package Source', `# src/myapp/test_utils.py gets packaged into production wheels!`, 'Bloats distributed package', `print("Keep tests/ as a sibling of src/, not inside src/!")`, 'Paket build qilinganda testlar ham qo‘shilib ketadi.', 'Putting tests inside `src/` ships test files in wheels.', '`tests/` ni `src/` bilan yonma-yon (sibling) joylang.', 'Keep `tests/` at root beside `src/`.'),
    ],
    compareTitleUz: 'Flat Layout vs `src/` Layout',
    compareTitleEn: 'Flat Layout vs `src/` Layout',
    compareUz: ['Flat Layout: 1–2 faylli kichik skriptlar uchun sodda.', '`src/` Layout: paketlar, backend API va jamoaviy loyihalarda xavfsiz standart.'],
    compareEn: ['Flat layout: tiny 1–2 script demos.', '`src/` layout: modern standard preventing accidental local-dir imports during tests.'],
    compareSummaryUz: 'Har qanday jiddiy loyihani boshidayoq `src/<pkg>/` + `tests/` + `pyproject.toml` shablonida boshlang.',
    compareSummaryEn: 'Start non-trivial Python apps with the `src/<pkg>/`, `tests/`, and `pyproject.toml` layout.',
    practiceTasks: [
      pt('p0811_1', '1-mashq: `Path.parts`', 'Task 1: Path Parts', '`Path("src/app/models.py").parts` ni chiqaring.', 'Print path parts.', `from pathlib import Path\nprint(Path("src/app/models.py").parts)`, "('src', 'app', 'models.py')", 'Path(...).parts', 'Prints tuple.'),
      pt('p0811_2', '2-mashq: Yetishmayotgan fayllar', 'Task 2: Missing Root Files', '`{"README.md", "pyproject.toml"} - {"README.md"}` ni chiqaring.', 'Find missing file via set diff.', `print(sorted({"README.md", "pyproject.toml"} - {"README.md"}))`, "['pyproject.toml']", 'Set subtraction.', 'Prints list.'),
      pt('p0811_3', '3-mashq: Temp loyiha yaratish', 'Task 3: Create src & tests', 'Temp papkada `src/api/__init__.py` va `tests/test_api.py` yaratib `exists()` chiqaring.', 'Create src and tests dirs.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    a = Path(d) / "src" / "api" / "__init__.py"\n    t = Path(d) / "tests" / "test_api.py"\n    a.parent.mkdir(parents=True); t.parent.mkdir(parents=True)\n    a.write_text("", encoding="utf-8"); t.write_text("", encoding="utf-8")\n    print(a.exists(), t.exists())`, 'True True', 'mkdir(parents=True)', 'Prints True True.'),
      pt('p0811_4', '4-mashq: Paket nomini tekshirish', 'Task 4: Valid Package Name', '`"my_service".isidentifier()` chiqaring.', 'Check package identifier.', `print("my_service".isidentifier())`, 'True', '.isidentifier()', 'Prints True.'),
      pt('p0811_5', '5-mashq: Test joylashuvi', 'Task 5: Keep Tests Outside src', '`not "tests/test_a.py".startswith("src/")` chiqaring.', 'Verify test outside src.', `print(not "tests/test_a.py".startswith("src/"))`, 'True', 'Check prefix.', 'Prints True.'),
    ],
    quiz: [
      q('q0811_1', 'Nima uchun `src/` layout oddiy flat layoutdan ustun?', 'Why does `src/` layout beat flat layout?', ['Qisqaroq', 'Testlar tasodifan lokal fayllarni import qilmay, o‘rnatilgan paketni tekshiradi', 'Tezroq', 'Git talab qiladi'], ['Shorter', 'Forces tests to verify installed package instead of CWD', 'Faster', 'Git requires it'], 1, 'CWD import xatolarini oldini oladi.', 'Prevents accidental local CWD imports.'),
      q('q0811_2', 'Test fayllari qayerda turishi kerak?', 'Where should `test_*.py` files live?', ['src/pkg/ ichida', 'Loyiha ildizidagi tests/ papkasida', 'venv/ ichida', 'Desktop da'], ['Inside src/pkg/', 'In root tests/ alongside src/', 'Inside venv/', 'Desktop'], 1, 'Ildizdagi `tests/` papkasida.', 'In root `tests/` directory.'),
      q('q0811_3', 'Qaysi fayl yangi dasturchiga loyihani qanday o‘rnatish va ishlatishni tushuntiradi?', 'Root file documenting setup & usage?', ['__init__.py', 'README.md', '.gitignore', 'models.py'], ['__init__.py', 'README.md', '.gitignore', 'models.py'], 1, '`README.md`.', '`README.md`.'),
      q('q0811_4', 'Paket papkasi sifatida tanilishi uchun `src/app/` ichida qaysi fayl bo‘lishi kerak?', 'File inside `src/app/` marking it a regular package?', ['main.py', '__init__.py', 'app.toml', 'setup.txt'], ['main.py', '__init__.py', 'app.toml', 'setup.txt'], 1, '`__init__.py`.', '`__init__.py`.'),
      q('q0811_5', 'Biznes mantiq va sozlamalarni bitta faylga tiqmasdan ajratish tamoyili?', 'Principle of isolating config, models, and services?', ['Monolit', 'Separation of Concerns', 'Monkey patching', 'Spaghetti'], ['Monolith', 'Separation of Concerns', 'Monkey patching', 'Spaghetti'], 1, 'Separation of Concerns.', 'Separation of Concerns.'),
    ],
    homework: hw('CLI Loyiha Shablon Generatori', 'Project Template Scaffolder', 'Temp papkada istalgan `project_name` uchun to‘liq `src/<pkg>/`, `tests/`, `pyproject.toml`, `.gitignore` va `README.md` yaratuvchi `create_scaffold(root, project_name)` funksiyasini tuzing.', 'Implement `create_scaffold(root, project_name)` generating a clean `src/` Python repository complete with `pyproject.toml`, `.gitignore`, `README.md`, and `tests/`.', ['src/<pkg>/__init__.py va tests/test_<pkg>.py', 'pyproject.toml ni tomllib bilan o‘qib tekshirish'], ['Generate src and tests trees', 'Verify generated pyproject.toml via tomllib'], 'pkg = project_name.replace("-", "_")', 'Normalize package identifier.', 'Yaratilgan barcha fayllarni `.rglob("*")` bilan hisoblang.', 'Count generated files via `.rglob("*")`.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-08-12',
    courseId: 'modules_packages',
    moduleId: 'c08_m4',
    order: 12,
    titleUz: 'Python loyihasini boshqarish — Ruff, mypy, pre-commit va CI',
    titleEn: 'Managing Python Projects: Ruff, mypy, Quality Gates & CI',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-08-11'],
    conceptId: 'project_management_ci',
    whyUz: "Kod yozish — ishning yarimi; uni toza, xatosiz va jamoa bilan uyg‘un ushlab turish uchun zamonaviy Python muhandislari avtomatik **Linter (`ruff`)**, **Type Checker (`mypy`)**, **`pytest`** va **GitHub Actions CI** quvurini o‘rnatadilar!",
    whyEn: 'Professional Python teams automate code formatting (`ruff format`), linting (`ruff check`), static type checking (`mypy`), and `pytest` on every commit via CI.',
    analogyUz: "Linter va CI — bu aviakompaniyaning uchishdan oldingi avtomatik tekshiruvi: inson ko‘zi charchaganda ham avtomat tizim har bir commitda sintaksis, tip va testlarni 100% tekshirib beradi!",
    analogyEn: 'Linters, type checkers, and CI act as automated pre-flight checklists—verifying style, types, and tests on every single commit.',
    stopsUz: "Linter va formatterni qo‘lda \"har qatorda 4 bo‘shliq bormi\" deb ko‘z bilan tekshirmang! **`ruff check` + `ruff format`** buni 0.05 soniyada avtomatik bajaradi; **`mypy`** esa ishlab chiqarishdan oldin `None` xatolarini ushlaydi.",
    stopsEn: 'Never enforce style manually—automate linting/formatting with `ruff`, type checks with `mypy`, and tests with `pytest` in CI.',
    objUz: ['Python sifat zanjirini (`ruff format` -> `ruff check` -> `mypy` -> `pytest`) bilish', '`pyproject.toml` da `[tool.ruff]` va `[tool.mypy]` qoidalarini tushunish', 'GitHub Actions CI workflow (`.github/workflows/ci.yml`) mantiqini tushunish'],
    objEn: ['Run the modern Python quality stack (`ruff`, `mypy`, `pytest`)', 'Configure tool strictness inside `pyproject.toml`', 'Understand automated CI checks on Pull Requests'],
    theoryUz: `### 1. Zamonaviy Python Sifat Zanjiri (4 Qadam)
1. **Formatter**: \`ruff format .\` (eski \`black\` o‘rnini bosuvchi o‘ta tez formatter)
2. **Linter**: \`ruff check .\` (ishlatilmagan import, \`bare except\`, PEP 8 xatolari!)
3. **Static Type Checker**: \`mypy src/\` (masalan \`str | None\` ni tekshirmasdan \`.upper()\` chaqirsangiz ushlaydi!)
4. **Tests**: \`pytest -q\`
### 2. \`pyproject.toml\` Konfiguratsiyasi
\`\`\`toml
[tool.ruff]
line-length = 100
[tool.ruff.lint]
select = ["E", "F", "I", "B"]
[tool.mypy]
strict = true
\`\`\`
### 3. Pre-commit Hooks & GitHub Actions CI
Har bir PR ochilganda GitHub Actions avtomatik \`venv\` ko‘tarib 4 qadamni yurgizadi; bittasi yiqilsa merge bloklanadi!
### 4. Keng tarqalgan xato
Test va linterlarni faqat loyiha oxirida emas, har bir kichik vazifada yurgizib borish kerak.`,
    theoryEn: `### 1. The 4-Stage Python Quality Stack
1. \`ruff format\` (consistent formatting)
2. \`ruff check\` (unused imports, bugbears, PEP 8)
3. \`mypy\` (static type verification)
4. \`pytest\` (automated test suite)
### 2. Unified \`pyproject.toml\` Config
Configure \`[tool.ruff]\`, \`[tool.mypy]\`, and \`[tool.pytest.ini_options]\` in one file.
### 3. CI/CD Quality Gates
GitHub Actions runs all checks automatically on every PR before merging to \`main\`.`,
    examples: [
      ex('Misol 1: `ast` bilan oddiy Linter qoidalarini (unused/bare-except) yozish', 'Example 1: Custom AST Quality Checker', `import ast\n\ncode = '''\ntry:\n    x = 1\nexcept:\n    pass\n'''\ntree = ast.parse(code)\nbare_excepts = sum(1 for n in ast.walk(tree) if isinstance(n, ast.ExceptHandler) and n.type is None)\nprint("Bare excepts found:", bare_excepts)`, `Bare excepts found: 1`, 'Xuddi `ruff` singari AST tahlili xavfli `except:` blokini avtomatik topdi!', 'AST inspection caught dangerous bare `except:` just like `ruff`!'),
      ex('Misol 2: `tomllib` bilan CI/Ruff/Mypy konfiguratsiyasini o‘qish', 'Example 2: Auditing Tool Config in pyproject.toml', `import tomllib\ncfg = tomllib.loads('''\n[tool.ruff]\nline-length = 100\n[tool.mypy]\nstrict = true\n''')\nprint("Max line:", cfg["tool"]["ruff"]["line-length"], "| Strict mypy:", cfg["tool"]["mypy"]["strict"])`, `Max line: 100 | Strict mypy: True`, 'Format va type-check qoidalari `pyproject.toml` dan o‘qildi.', 'Loaded project quality gate settings cleanly.'),
      ex('Misol 3: CI Quality Gate simulyatori', 'Example 3: Simulating CI Pipeline Stages', `stages = [("format", True), ("lint", True), ("mypy", True), ("pytest", True)]\npassed = all(ok for _, ok in stages)\nprint("Merge allowed?", passed, "| Checks:", len(stages))`, `Merge allowed? True | Checks: 4`, 'Barcha 4 bosqich muvaffaqiyatli o‘tsagina PR merge qilinadi.', 'All 4 automated gates must pass before merging.'),
    ],
    traceTitleUz: 'AST linter tekshiruv izi',
    traceTitleEn: 'Tracing AST Lint Rule',
    traceCode: `import ast\nt = ast.parse("def f(): pass\\nassert True")\nprint(any(isinstance(n, ast.Assert) for n in ast.walk(t)))`,
    traceSteps: [
      traceStep(1, 'ast.parse(...)', 'AST tree', 'Kod daraxtga aylantirildi', 'Parsed AST'),
      traceStep(2, 'ast.walk(t)', 'found Assert node', 'Assert tuguni topildi', 'Matched Assert node', 'True'),
    ],
    commonMistakes: [
      mistake('Linter/Formatter ni faqat oxirgi kunda ishlatish', 'Running Formatters Only Once at End', `# Leads to a massive 10,000-line reformat commit obscuring git blame`, 'Ruins git history and introduces merge conflicts', `print("Run ruff format & check before every commit!")`, 'Har commitdan oldin ishlatilsa o‘zgarishlar doim toza bo‘ladi.', 'Late giant reformats clutter Git diffs.', 'Pre-commit yoki har commitdan oldin yurgizing.', 'Run quality checks continuously.'),
      mistake('CI yiqilganda testni o‘chirib yuborish', 'Deleting Failing Tests to Green CI', `# Skipping or deleting failing assertions hides real regressions!`, 'Ships broken features to users', `print("Fix the root cause or update outdated specs thoughtfully!")`, 'Qizil CI sizni real xatodan ogohlantirmoqda.', 'Red CI signals a genuine contract or bug issue.', 'Asl sababni tuzating.', 'Diagnose and fix failing checks.'),
    ],
    compareTitleUz: 'Eski stack (`flake8`+`black`+`isort`) vs Zamonaviy `ruff`',
    compareTitleEn: 'Legacy Stack vs Unified `ruff`',
    compareUz: ['Eski stack: 4 ta alohida paket va sekin ishlaydi.', '`ruff`: Rust da yozilgan, 100x tez, linting + import sorting + formatting hammasini bitta vositada bajaradi!'],
    compareEn: ['Legacy: multiple slower Python packages (`flake8`, `black`, `isort`).', '`ruff`: single Rust-powered tool handling lint + sort + format 100x faster.'],
    compareSummaryUz: 'Har bir zamonaviy Python loyihasida `ruff` + `mypy` + `pytest` uchligini CI da majburiy qiling.',
    compareSummaryEn: 'Standardize on `ruff` + `mypy` + `pytest` enforced by CI.',
    practiceTasks: [
      pt('p0812_1', '1-mashq: AST bare except', 'Task 1: Detect Bare Except', '`ast.parse("try:\\n x=1\\nexcept:\\n pass")` da `n.type is None` sonini chiqaring.', 'Count bare excepts via ast.', `import ast\nt = ast.parse("try:\\n x=1\\nexcept:\\n pass")\nprint(sum(1 for n in ast.walk(t) if isinstance(n, ast.ExceptHandler) and n.type is None))`, '1', 'n.type is None', 'Prints 1.'),
      pt('p0812_2', '2-mashq: Sifat bosqichlari', 'Task 2: Gate All Pass', '`[("ruff", True), ("mypy", True), ("pytest", False)]` da merge ruxsatini chiqaring.', 'Check if all CI gates pass.', `gates = [("ruff", True), ("mypy", True), ("pytest", False)]\nprint(all(ok for _, ok in gates))`, 'False', 'all(ok for ...)', 'Prints False.'),
      pt('p0812_3', '3-mashq: AST funksiya docstring tekshiruvi', 'Task 3: Check Docstring via AST', '`def a():\n """Doc."""\n pass` da `ast.get_docstring` chiqaring.', 'Inspect docstring via ast.', `import ast\nt = ast.parse('def a():\\n    """Doc."""\\n    pass')\nprint(ast.get_docstring(t.body[0]))`, 'Doc.', 'ast.get_docstring', 'Prints Doc.'),
      pt('p0812_4', '4-mashq: Tool sozlamasini o‘qish', 'Task 4: Read Ruff Select', '`[tool.ruff.lint]\\nselect = ["E", "F"]` ni parse qilib chiqaring.', 'Parse ruff lint rules.', `import tomllib\nd = tomllib.loads('[tool.ruff.lint]\\nselect = ["E", "F"]')\nprint(d["tool"]["ruff"]["lint"]["select"])`, "['E', 'F']", 'Nested dict keys.', 'Prints list.'),
      pt('p0812_5', '5-mashq: 4 ta bosqich ro‘yxati', 'Task 5: Format CI Pipeline', '`["format", "lint", "mypy", "pytest"]` ni `" | "` bilan chiqaring.', 'Join 4 stages.', `print(" | ".join(["format", "lint", "mypy", "pytest"]))`, 'format | lint | mypy | pytest', 'Use join().', 'Prints string.'),
    ],
    quiz: [
      q('q0812_1', 'Bugungi Python da linting, import sorting va formattingni bitta vositada 100x tez bajaruvchi asbob?', 'Modern all-in-one fast Python linter & formatter?', ['pylint', 'ruff', 'unittest', 'venv'], ['pylint', 'ruff', 'unittest', 'venv'], 1, '`ruff`.', '`ruff`.'),
      q('q0812_2', '`mypy` vositasining asosiy vazifasi?', 'Primary purpose of `mypy`?', ['Kodni formatlash', 'Static Type Hints xatolarini kod ishga tushmasdan topish', 'Paket o‘rnatish', 'Server yurgizish'], ['Formatting', 'Static type checking before runtime', 'Installing packages', 'Serving HTTP'], 1, 'Static type checking.', 'Static type checking.'),
      q('q0812_3', 'GitHub Actions CI nima vazifa bajaradi?', 'Role of GitHub Actions CI?', ['Fayl tahrirlash', 'Har bir push/PR da avtomatik lint, type-check va testlarni yurgizish', 'Parol saqlash', 'Database boshqarish'], ['Edit files', 'Automate lint, type-check, and tests on push/PR', 'Store secrets', 'Run DB'], 1, 'Har push/PR da sifat tekshiruvini avtomatik ishga tushiradi.', 'Automates quality gates on every PR.'),
      q('q0812_4', '`ruff` va `mypy` sozlamalari qaysi yagona faylda saqlanadi?', 'Single file storing `[tool.ruff]` and `[tool.mypy]` configs?', ['.env', 'pyproject.toml', 'requirements.txt', '__init__.py'], ['.env', 'pyproject.toml', 'requirements.txt', '__init__.py'], 1, '`pyproject.toml`.', '`pyproject.toml`.'),
      q('q0812_5', '`ast` moduli nima uchun ishlatiladi?', 'What does Python’s `ast` module let you inspect?', ['HTML teglar', 'Python kodining sintaksis daraxtini ishga tushirmasdan tahlil qilish', 'SQL jadvallar', 'Rasm baytlari'], ['HTML tags', 'Python source Abstract Syntax Trees statically', 'SQL tables', 'Image bytes'], 1, 'Python kodini ishga tushirmay AST bo‘yicha tahlil qilish.', 'Inspect Python syntax trees statically.'),
    ],
    homework: hw('8-Kurs Yakuniy Loyiha Sifat Auditori', 'Course 8 AST & Manifest Auditor', 'Berilgan Python fayl matni va `pyproject.toml` ustida 3 ta sifat tekshiruvini (1. bare `except:` yo‘qligi, 2. barcha funksiyalarda docstring borligi, 3. `pyproject.toml` da `[tool.ruff]` mavjudligi) bajaradigan mini-CI tekshiruvchini tuzing.', 'Build a mini Python CI gate inspecting source snippets via `ast` (no bare `except:`, docstrings present) and validating `[tool.ruff]` in `pyproject.toml` via `tomllib`.', ['ast.walk + ast.get_docstring', 'tomllib bilan [tool.ruff] tekshiruvi'], ['Use ast checks', 'Validate tomllib config'], 'isinstance(node, ast.FunctionDef) and ast.get_docstring(node)', 'Check each function docstring.', 'Barcha natijalarni yakuniy `PASS`/`FAIL` statusi bilan chop eting.', 'Emit PASS/FAIL CI summary.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),
];
