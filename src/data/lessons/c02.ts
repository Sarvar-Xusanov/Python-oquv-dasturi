import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C02_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-02-01',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m1',
    order: 1,
    titleUz: 'print() va dastur natijasi',
    titleEn: 'print() & Program Output Formatting',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-01-08'],
    conceptId: 'print_output',
    whyUz: "Har qanday CLI vositasi, log tizimi va debugging jarayoni `print()` orqali standart chiqish (stdout) ga ma'lumot uzatishdan boshlanadi.",
    whyEn: 'Console output, log streams, and quick inspection all build on mastering `print()`, `sep`, `end`, and escape sequences.',
    analogyUz: "`print()` — bu dastur mikrofonidir: RAM ichida bo'layotgan yashirin jarayonlarni ekranga olib chiqib eshittiradi.",
    analogyEn: '`print()` is your script’s loudspeaker: it turns invisible RAM values into readable screen output.',
    stopsUz: "Funksiyalar ichida natija qaytarish (`return`) va ekranga chiqarish (`print`) farq qiladi — buni 5-kursda chuqur o'rganamiz.",
    stopsEn: 'Displaying text (`print`) is distinct from returning a value (`return`) from a function.',
    objUz: [
      'print() ga bir nechta argument uzatish',
      'sep="..." va end="..." parametrlarini boshqarish',
      '\\n (yangi qator) va \\t (tab) escape belgilaridan foydalanish',
    ],
    objEn: [
      'Pass multiple positional arguments to `print()`',
      'Customize delimiters and line endings with `sep` and `end`',
      'Format clean output using `\\n`, `\\t`, and raw strings',
    ],
    theoryUz: `### 1. \`print()\` nima qiladi?
\`print()\` berilgan qiymatlarni matnga aylantirib **stdout** (ekran/terminal) ga chiqaradi.
### 2. Bir nechta argument va \`sep\`
Odatiy holatda \`print("A", "B", "C")\` orasiga bo'sh joy qo'yadi (\`sep=" "\`). \`sep="-"\` bilan uni o'zgartirish mumkin.
### 3. \`end\` parametri
Har \`print()\` oxiriga avtomatik yangi qator (\`\\n\`) qo'shadi. \`end=" | "\` desangiz keyingi chiqish o'sha qatorga ulanadi.
### 4. Escape belgilari (\`\\n\`, \`\\t\`, \`\\"\`)
\`\\n\` — yangi qatorga tushirish, \`\\t\` — jadval ustuni kabi surish.
### 5. Amaliy maslahat
F-string (\`f"{x}"\`) bilan \`print()\` ni birgalikda ishlatish eng toza natijani beradi.`,
    theoryEn: `### 1. What Does \`print()\` Do?
Converts objects via \`str()\` and writes them to **standard output (stdout)**.
### 2. Multiple Arguments & \`sep\`
Defaults to space separation (\`sep=" "\`). Override with \`sep=", "\` or \`sep="-"\`.
### 3. Controlling Line Endings with \`end\`
Defaults to \`\\n\`. Pass \`end=" "\` to keep output on the same line.
### 4. Escape Sequences
\`\\n\` newline, \`\\t\` tab, \`\\\\\` literal backslash.
### 5. Best Practice
Combine f-strings with \`sep\` and \`end\` for clean CLI tables.`,
    examples: [
      ex('Misol 1: `sep` parametri bilan ajratish', 'Example 1: Custom Separator with sep', `print("2026", "11", "21", sep="-")\nprint("Python", "SQL", "AI", sep=" | ")`, `2026-11-21\nPython | SQL | AI`, '`sep` barcha argumentlar orasiga kerakli belgini qo‘yadi.', '`sep` inserts a custom delimiter between arguments.'),
      ex('Misol 2: `end` bilan bir qatorda chiqarish', 'Example 2: Same-Line Output with end', `print("Yuklanmoqda", end="...")\nprint("Tayyor!")`, `Yuklanmoqda...Tayyor!`, '`end="..."` yangi qator o‘rniga uch nuqta qo‘ydi.', '`end="..."` suppresses the trailing newline.'),
      ex('Misol 3: Escape belgilari (`\\n`, `\\t`)', 'Example 3: Newline and Tab Formatting', `print("Fan\\tBall\\nPython\\t98")`, `Fan\tBall\nPython\t98`, '`\\t` ustunlarni tekislaydi, `\\n` yangi qator ochadi.', '`\\t` aligns columns while `\\n` breaks lines.'),
    ],
    traceTitleUz: 'sep va end taʼsiri',
    traceTitleEn: 'Tracing sep and end',
    traceCode: `print("A", "B", sep=":", end="!")\nprint("C")`,
    traceSteps: [
      traceStep(1, 'print("A", "B", sep=":", end="!")', 'stdout="A:B!"', 'Yangi qator o‘rniga ! qo‘yildi', 'Used : and ! instead of newline', 'A:B!'),
      traceStep(2, 'print("C")', 'stdout="A:B!C\\n"', 'C o‘sha qatorga ulandi', 'C appended to same line', 'A:B!C'),
    ],
    commonMistakes: [
      mistake('Katta harf bilan `Print` yozish', 'Capitalizing Print()', `Print("Salom")`, 'NameError: name "Print" is not defined', `print("Salom")`, 'Python katta-kichik harfga sezgir (case-sensitive).', 'Python identifiers are strictly case-sensitive.', 'Doim kichik harf bilan `print` yozing.', 'Always spell built-in `print` in lowercase.'),
      mistake('String va Sonni `+` bilan qo‘shish', 'Concatenating String + Int Directly', `print("Yosh: " + 20)`, 'TypeError: can only concatenate str to str', `print("Yosh:", 20)\nprint(f"Yosh: {20}")`, '`+` faqat ikki matnni ulaydi; f-string yoki vergul ishlating.', '`+` rejects mixing `str` and `int`.', 'Vergul yoki `f"..."` ishlating.', 'Use commas or f-strings.'),
    ],
    compareTitleUz: '`print(a, b)` vs `f"{a} {b}"`',
    compareTitleEn: '`print(a, b)` vs `f"{a} {b}"`',
    compareUz: ['`print(a, b, sep="-")`: ro‘yxatdagi elementlarni tez ulashda zo‘r.', '`f"..."`: murakkab jumlalar va yaxlitlash uchun eng qulay.'],
    compareEn: ['`print(a, b, sep=...)`: great for quick delimited values.', 'f-strings: superior for full templates and alignment.'],
    compareSummaryUz: 'Matn tuzishda f-string, tez ajratishda `sep` dan foydalaning.',
    compareSummaryEn: 'Use f-strings for templates and `sep`/`end` for quick stream formatting.',
    practiceTasks: [
      pt('p0201_1', '1-mashq: Sana formatlash', 'Task 1: Date with sep', '2026, 05, 01 ni `/` bilan ajratib chiqaring.', 'Print 2026/05/01 using sep.', `print("2026", "05", "01", sep="/")`, '2026/05/01', 'sep="/".', 'Use sep="/".'),
      pt('p0201_2', '2-mashq: Bitta qator', 'Task 2: Single Line', 'Hello va World ni `end=" "` bilan chiqaring.', 'Join Hello and World with end=" ".', `print("Hello", end=" ")\nprint("World")`, 'Hello World', 'end=" ".', 'Pass end=" ".'),
      pt('p0201_3', '3-mashq: Chiziq takrorlash', 'Task 3: Repeater', '`"-"` belgisini 5 marta chiqaring.', 'Print 5 dashes.', `print("-" * 5)`, '-----', '"-" * 5.', 'Multiply string by 5.'),
      pt('p0201_4', '4-mashq: Yangi qator belgisi', 'Task 4: Escape Newline', '`A\\nB` ni bitta print da chiqaring.', 'Print A and B on separate lines with one print.', `print("A\\nB")`, 'A\nB', '\\n.', 'Use \\n.'),
      pt('p0201_5', '5-mashq: Vergul bilan chop etish', 'Task 5: Comma Print', 'Natija: 42 ni vergul bilan chiqaring.', 'Print "Natija:" and 42.', `print("Natija:", 42)`, 'Natija: 42', 'Vergul bilan bering.', 'Pass two args.'),
    ],
    quiz: [
      q('q0201_1', '`print("a", "b", sep="-")` nima chiqaradi?', 'Output of `print("a", "b", sep="-")`?', ['a b', 'a-b', 'ab', 'Error'], ['a b', 'a-b', 'ab', 'Error'], 1, '`sep="-"` orasiga `-` qo‘yadi.', 'Inserts `-` between items.'),
      q('q0201_2', '`end=""` ning vazifasi?', 'Role of `end=""`?', ['Yangi qatorga o‘tmaslik', 'Xatoni o‘chirish', 'Kodni to‘xtatish', 'Fayl ochish'], ['Prevent trailing newline', 'Hide errors', 'Stop script', 'Open file'], 0, 'Keyingi chiqish shu qatorda davom etadi.', 'Keeps cursor on the same line.'),
      q('q0201_3', 'Qaysi belgi yangi qator bildiradi?', 'Escape sequence for newline?', ['\\t', '\\n', '\\r', '\\s'], ['\\t', '\\n', '\\r', '\\s'], 1, '`\\n` newline.', '`\\n` is newline.'),
      q('q0201_4', '`print("5" + 5)` qanday xato beradi?', 'Error for `print("5" + 5)`?', ['SyntaxError', 'TypeError', 'NameError', 'ValueError'], ['SyntaxError', 'TypeError', 'NameError', 'ValueError'], 1, 'str + int -> TypeError.', 'TypeError.'),
      q('q0201_5', 'Python `Print()` ni qabul qiladimi?', 'Does Python accept `Print()`?', ['Ha', 'Yo‘q, NameError beradi', 'Faqat Windows da', 'Faqat 3.12 da'], ['Yes', 'No, raises NameError', 'Windows only', '3.12 only'], 1, 'Case-sensitive.', 'Case-sensitive.'),
    ],
    homework: hw('Kvitansiya (Chek) chop etish', 'CLI Receipt Printer', '`print()`, `sep`, `end` va `\\t` dan foydalanib 3 ta mahsulotli do‘kon chekini chop eting.', 'Print a 3-item store receipt using `print()`, `sep`, `end`, and `\\t`.', ['Sarlavha chizig‘i (`"=" * 30`)', 'Kamida 3 ta mahsulot va jami summa'], ['Header border', '3 items + total'], 'print("Olma", "12000", sep="\\t")', 'Align columns with \\t.', 'Chegirma qatorini ham qo‘shing.', 'Add a discount line.', 20),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-02-02',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m1',
    order: 2,
    titleUz: 'Comments va kod yozish qoidalari',
    titleEn: 'Comments & PEP 8 Style Conventions',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-02-01'],
    conceptId: 'comments_pep8',
    whyUz: "Kod yozilgandan ko'ra 10 barobar ko'proq o'qiladi. Toza izohlar va PEP 8 qoidalari sizni boshqa dasturchilar uchun tushunarli mutaxassisga aylantiradi.",
    whyEn: 'Code is read 10x more than it is written. Thoughtful comments and PEP 8 consistency make your code maintainable for teams.',
    analogyUz: "Izohlar (comments) — bu avtomobil yo'lidagi belgilar: ular yo'lning o'zini o'zgartirmaydi, lekin haydovchiga xavfli burilish sababini tushuntiradi.",
    analogyEn: 'Comments are highway signs: they do not change the road surface, yet guide future drivers on why a turn exists.',
    stopsUz: "Yomon kodni izoh bilan yopish o'rniga, avval o'zgaruvchi nomlarini aniq qiling; izoh esa 'NIMA' ni emas, 'NEGA' ni tushuntirsin.",
    stopsEn: 'Never comment messy variable names to compensate — rename clearly first, and let comments explain WHY, not WHAT.',
    objUz: ['Bir qatorli (`#`) va ko‘p qatorli (`"""..."""`) izohlarni ajratish', 'PEP 8 asosiy qoidalarini (4 probel, snake_case, bo‘sh qatorlar) qo‘llash', 'Yaxshi izoh ("Nega?") va yomon izoh ("Nima?") farqini bilish'],
    objEn: ['Write single-line `#` comments and `"""..."""` docstrings', 'Follow core PEP 8 rules (4 spaces, `snake_case`, spacing)', 'Explain WHY rather than restating obvious code'],
    theoryUz: `### 1. Izoh (Comment) nima?
Python \`#\` belgisidan keyingi matnni butunlay e'tiborsiz qoldiradi — u faqat odamlar uchun yoziladi.
### 2. NIMA emas, NEGA ni tushuntiring
- **Yomon**: \`x = x + 1  # x ni 1 ga oshirish\` (kodning o‘zi ko‘rinib turibdi!)
- **Yaxshi**: \`x = x + 1  # 0-indeksni foydalanuvchi uchun 1-dan boshlash\`
### 3. Docstrings (\`"""..."""\`)
Funksiya yoki klassning birinchi qatorida yozilgan uch qo‘shtirnoq hujjatlashtirish satri bo‘lib, \`help()\` da chiqadi.
### 4. PEP 8 oltin qoidalari
| Element | PEP 8 standarti | Misol |
|---|---|---|
| O‘zgaruvchi/Funksiya | \`snake_case\` | \`user_score\`, \`calc_tax()\` |
| Konstanta | \`UPPER_SNAKE_CASE\` | \`MAX_RETRIES = 3\` |
| Chekinish (Indent) | 4 ta probel | \`    return x\` |
| Operator atrofi | Bitta probel | \`a = b + c\` |
| Qator uzunligi | <= 79–100 belgi | Toza o‘qilish |
### 5. Keng tarqalgan xato
Kodni o‘zgartirib, eski izohni yangilamaslik — yolg‘on izoh izohsiz koddan ham yomonroq!`,
    theoryEn: `### 1. What Are Comments?
Anything following \`#\` on a line is ignored by Python's parser.
### 2. Explain WHY, Not WHAT
Avoid narrating syntax (\`# add 1\`). Explain business intent or invariants (\`# Skip header row\`).
### 3. Docstrings (\`"""..."""\`)
Triple-quoted strings placed as the first statement of a module, class, or function populate \`__doc__\`.
### 4. Core PEP 8 Conventions
- \`snake_case\` for variables/functions
- \`UPPER_SNAKE_CASE\` for constants
- 4 spaces per indentation level
- Single space around \`=\` and binary operators
### 5. Stale Comments
Outdated comments actively mislead readers — always update or delete them when refactoring.`,
    examples: [
      ex('Misol 1: Toza izoh va PEP 8 nomlash', 'Example 1: Clean Comments & Naming', `# QQS stavkasi (O'zbekiston standarti)\nVAT_RATE = 0.12\n\nbase_price = 100_000\ntotal_price = int(base_price * (1 + VAT_RATE))\nprint("Jami:", total_price)`, `Jami: 112000`, 'Konstanta katta harfda (`VAT_RATE`), izoh esa nega 0.12 ekanini tushuntiradi.', 'Constant uses `UPPER_SNAKE_CASE`; comment explains business rationale.'),
      ex('Misol 2: Funksiya Docstringi', 'Example 2: Function Docstring Inspection', `def to_seconds(minutes: int) -> int:\n    """Daqiqalarni soniyalarga aylantiradi."""\n    return minutes * 60\n\nprint(to_seconds(4))\nprint(to_seconds.__doc__)`, `240\nDaqiqalarni soniyalarga aylantiradi.`, 'Docstring kod hujjatini funksiyaning ichida saqlaydi.', 'Docstrings attach documentation directly to functions.'),
      ex('Misol 3: TODO izoh bilan rejalash', 'Example 3: Structured Code & Inline Intent', `max_attempts = 3  # Brutfors hujumidan himoya limiti\nfor attempt in range(1, max_attempts + 1):\n    print(f"Urinish #{attempt}")`, `Urinish #1\nUrinish #2\nUrinish #3`, 'Qisqa inline izoh biznes sababini ko‘rsatadi.', 'Inline comment explains why limit=3.'),
    ],
    traceTitleUz: 'Parser izohlarni qanday o‘tkazadi',
    traceTitleEn: 'How Parser Skips Comments',
    traceCode: `# Bosh izoh\nrate = 10  # Inline izoh\nprint(rate * 2)`,
    traceSteps: [
      traceStep(1, '# Bosh izoh', '-', 'Parser eʼtiborsiz qoldirdi', 'Skipped by parser'),
      traceStep(2, 'rate = 10 # Inline izoh', 'rate=10', 'Faqat rate = 10 bajarildi', 'Only `rate = 10` executed'),
      traceStep(3, 'print(rate * 2)', '20', 'Natija chiqdi', 'Printed 20', '20'),
    ],
    commonMistakes: [
      mistake('Ortiqcha "Nima" izohlari', 'Redundant "What" Comments', `a = 5  # a ga 5 qiymat berish`, 'Cluttered noisy code', `retry_delay_sec = 5  # API rate-limit kutish vaqti`, 'Aniq o‘zgaruvchi nomi keraksiz izohdan ustun.', 'Descriptive names eliminate redundant comments.', 'Nomni aniq qilib, faqat sababni izohlang.', 'Name clearly and comment only intent.'),
      mistake('Chekinishda Tab va Probelni aralashtirish', 'Mixing Tabs and Spaces', `if True:\n\tprint("Tab")\n    print("Space")`, 'TabError: inconsistent use of tabs and spaces', `if True:\n    print("1")\n    print("2")`, 'Python 3 da Tab va Space aralashtirish taqiqlanadi.', 'Python 3 forbids mixing tabs and spaces in one block.', 'Har doim 4 ta probel ishlating.', 'Configure editor to insert 4 spaces.'),
    ],
    compareTitleUz: '`# Comment` vs `"""Docstring"""`',
    compareTitleEn: '`# Comment` vs `"""Docstring"""`',
    compareUz: ['`#`: ichki mantiqiy izohlar uchun, runtime da saqlanmaydi.', '`"""..."""`: funksiya/klass hujjati (`__doc__`), IDE va `help()` da ko‘rinadi.'],
    compareEn: ['`#`: internal implementation notes, stripped at compile time.', '`"""..."""`: public API docs stored in `__doc__`.'],
    compareSummaryUz: 'Funksiyalar uchun docstring, murakkab qatorlar sababi uchun `#` ishlating.',
    compareSummaryEn: 'Use docstrings for API docs and `#` comments for why-reasoning.',
    practiceTasks: [
      pt('p0202_1', '1-mashq: Konstanta nomlash', 'Task 1: PEP 8 Constant', '`MAX_USERS = 100` yaratib chiqaring.', 'Define `MAX_USERS = 100` and print it.', `MAX_USERS = 100\nprint(MAX_USERS)`, '100', 'UPPER_SNAKE_CASE.', 'Print MAX_USERS.'),
      pt('p0202_2', '2-mashq: Izohli kod', 'Task 2: Inline Comment', 'Izoh qo‘shib 7 * 3 ni chiqaring.', 'Add a comment and print 7 * 3.', `days_per_week = 7  # Hafta kunlari\nprint(days_per_week * 3)`, '21', '# bilan izoh qo‘shing.', 'Add inline comment.'),
      pt('p0202_3', '3-mashq: Docstring', 'Task 3: Docstring Check', 'Funksiya `__doc__` qiymatini chiqaring.', 'Print docstring of `ping()`.', `def ping():\n    """Tekshiruv"""\n    return "pong"\nprint(ping.__doc__)`, 'Tekshiruv', 'ping.__doc__.', 'Print ping.__doc__.'),
      pt('p0202_4', '4-mashq: snake_case', 'Task 4: snake_case Name', '`student_name` o‘zgaruvchisiga `"Ali"` berib chiqaring.', 'Print `student_name = "Ali"`.', `student_name = "Ali"\nprint(student_name)`, 'Ali', 'snake_case.', 'Use snake_case.'),
      pt('p0202_5', '5-mashq: Katta son o‘qilishi', 'Task 5: Underscore Numeric Literal', '`1_000_000` ni chiqaring.', 'Print `1_000_000`.', `budget = 1_000_000\nprint(budget)`, '1000000', '1_000_000.', 'Underscores improve readability.'),
    ],
    quiz: [
      q('q0202_1', 'Python izohni qaysi belgi bilan boshlaydi?', 'Symbol starting single-line comments?', ['//', '#', '/*', '--'], ['//', '#', '/*', '--'], 1, '`#` belgisi.', '`#`.'),
      q('q0202_2', 'PEP 8 bo‘yicha o‘zgaruvchilar qanday nomlanadi?', 'PEP 8 naming convention for variables?', ['CamelCase', 'snake_case', 'kebab-case', 'ALLCAPS'], ['CamelCase', 'snake_case', 'kebab-case', 'ALLCAPS'], 1, '`snake_case`.', '`snake_case`.'),
      q('q0202_3', 'Yaxshi izoh nimani tushuntiradi?', 'What should a good comment explain?', ['Kod nima qilayotganini so‘zma-so‘z', 'Nima uchun shunday yozilganini (sababini)', 'Faqat muallif ismini', 'Hech narsa'], ['Literal syntax translation', 'Why the code exists / business intent', 'Author name only', 'Nothing'], 1, 'Sababni (WHY) tushuntiradi.', 'Explains WHY.'),
      q('q0202_4', 'Tab va Space aralashtirilsa qaysi xato chiqadi?', 'Error when mixing tabs and spaces?', ['ValueError', 'TabError', 'NameError', 'KeyError'], ['ValueError', 'TabError', 'NameError', 'KeyError'], 1, 'TabError.', 'TabError.'),
      q('q0202_5', 'Funksiya hujjati qayerda saqlanadi?', 'Where is a function docstring stored?', ['__name__', '__doc__', '__str__', '__file__'], ['__name__', '__doc__', '__str__', '__file__'], 1, '`__doc__`.', '`__doc__`.'),
    ],
    homework: hw('PEP 8 Kod Refaktoringi', 'PEP 8 Code Cleanup', 'Noto‘g‘ri nomlangan (`A=10;b=20`) kodni PEP 8 ga mos `snake_case`, konstanta va maʼnoli izohlar bilan qayta yozing.', 'Refactor messy variable names into PEP 8 `snake_case`, constants, and clear why-comments.', ['Kamida 1 ta konstanta va 1 ta docstring', '4 probel chekinish'], ['1 constant + 1 docstring', '4-space indentation'], 'camelCase ni snake_case ga almashtiring.', 'Convert names to snake_case.', 'Type hints ham qo‘shing.', 'Add type hints.', 20),
    reviewCheckpoint: review(
      2,
      '2-Review Loyiha: Formatlangan Kvitansiya & PEP 8 Auditori',
      'Review Project #2: Formatted Receipt & PEP 8 Linter Demo',
      '6–10 darslar (`IDE`, `Terminal`, `First Script`, `print()`, `Comments/PEP 8`) asosida toza hujjatlashtirilgan chek generatorini yozing.',
      'Combine lessons 6–10 into a well-documented PEP 8 receipt printer with docstrings and clean formatting.',
      ['1) Docstring li narx hisoblovchi funksiya', '2) `UPPER_SNAKE_CASE` QQS konstantasi', '3) `sep` va `\\t` li chiroyli jadval'],
      ['1) Documented pricing function', '2) `UPPER_SNAKE_CASE` tax constant', '3) Clean table via `sep` and `\\t`'],
      `TAX_RATE = 0.12

def calc_total(price: int) -> float:
    """QQS qo'shilgan yakuniy summani qaytaradi."""
    return round(price * (1 + TAX_RATE), 2)

print("Mahsulot", "Jami", sep="\\t")
print("Kurs", calc_total(100_000), sep="\\t")`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-02-03',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m1',
    order: 3,
    titleUz: 'Variables — o‘zgaruvchilar',
    titleEn: 'Variables & Python Reference Model',
    difficulty: 'beginner',
    estimatedMinutes: 45,
    prerequisites: ['PY-02-02'],
    conceptId: 'variables_deep',
    whyUz: "O'zgaruvchilar — har bir dasturning poydevori. Python da ular qiymat saqlaydigan 'quti' emas, xotiradagi obyektga bog'langan 'yorliq' (reference) ekanini tushunish keyinchalik OOP va xotira xatolaridan qutqaradi.",
    whyEn: 'Variables underpin every program. Knowing that Python variables are labels bound to heap objects—not static boxes—prevents subtle aliasing bugs later.',
    analogyUz: "O'zgaruvchi — bu qutidagi buyumga yopishtirilgan ism yorlig'i (tag). Xuddi bir odamga ham 'Do'stim', ham 'Dasturchi' deb murojaat qilish mumkin bo'lganidek, bitta qiymatga ikki o'zgaruvchi ishora qilishi mumkin.",
    analogyEn: 'A Python variable is a sticky label attached to an object in memory, not a fixed box. Two labels can point to the exact same object.',
    stopsUz: "Butun son (`int`) va matn (`str`) o'zgarmas (immutable) bo'lgani uchun bitta yorliqni qayta tayinlash boshqasiga ta'sir qilmaydi; ro'yxat (`list`) da esa ta'sir qiladi!",
    stopsEn: 'Rebinding an immutable int/str label never mutates another label, whereas mutating a shared list affects all aliases.',
    objUz: [
      'O‘zgaruvchi tushunchasi va Python xotirasidagi yorliq (reference) modelini tushunish',
      'Nomlash qoidalari (Naming Rules) va Dynamic Typing ni qo‘llash',
      'Rebinding, ko‘p o‘zgaruvchili tayinlash (tuple unpacking) va swap texnikasini bilish',
    ],
    objEn: [
      'Explain variable labels vs memory objects (`id()`)',
      'Apply strict Python naming rules and PEP 8 conventions',
      'Understand dynamic typing, rebinding, multiple assignment, and swapping',
    ],
    theoryUz: `### 1. Variable nima?
**O'zgaruvchi (Variable)** — dastur davomida ma'lumotlarga murojaat qilish va ularni boshqarish uchun berilgan ramziy nomdir.

### 2. O'zgaruvchilar nima uchun kerak?
- Qiymatlarni qayta ishlatish (bir joyda o'zgartirsangiz hamma joyda yangilanadi);
- Kodga insoniy ma'no berish (\`x = 100 * 0.12\` emas, \`tax = price * TAX_RATE\`);
- Oraliq hisob-kitob natijalarini saqlash.

### 3. Python xotirasida qiymatlar qanday saqlanadi?
C tilidan farqli o'laroq, Python da o'zgaruvchi — **xotira qutisi emas, balki obyektga ko'rsatkich (reference)**:
\`\`\`
  age  ------>  [ int obyekt: 25 ]   (id: 140728...)
  x    ------↗
\`\`\`
\`id(age)\` funksiyasi obyektning xotiradagi noyob manzilini ko'rsatadi.

### 4. Variable yaratish sintaksisi
\`nom = qiymat\` (\`=\` bu yerda tenglik emas, **tayinlash / assignment** operatoridir).

### 5. Naming Rules — nomlash qoidalari
| Ruxsat etilgan (To'g'ri) | Taqiqlangan (Xato) | Sababi |
|---|---|---|
| \`user_name\`, \`_temp\`, \`score2\` | \`2score\` | Raqam bilan boshlanmaydi |
| \`total_amount\` | \`total-amount\` | Defis \`-\` ayirish operatori! |
| \`class_id\` | \`class\`, \`for\`, \`if\` | Kalit so'zlar (keywords) taqiqlanadi |

### 6. Dynamic Typing (Dinamik tiplash)
Python da o'zgaruvchi turini oldindan yozish shart emas: bitta nom avval \`int\` ga, keyin \`str\` ga ishora qilishi mumkin. Lekin yaxshi amaliyotda bitta o'zgaruvchi turini barqaror saqlash tavsiya etiladi.

### 7. Bir o'zgaruvchiga yangi qiymat berish (Rebinding)
\`score = 10\` keyin \`score = 20\` yozsangiz, \`score\` yorlig'i eski \`10\` dan uzilib yangi \`20\` obyektiga bog'lanadi (\`score += 5\` ham shunday).

### 8. Bir nechta o'zgaruvchi bilan ishlash
- Zanjirli tayinlash: \`a = b = c = 0\`
- Parallel tayinlash: \`x, y = 10, 20\`
- Qiymat almashtirish (Swap): \`x, y = y, x\` (vaqtinchalik o'zgaruvchisiz!).

### 9. Keng tarqalgan xatolar
1) E'lon qilinmagan o'zgaruvchini o'qish (\`NameError\`); 2) \`print = 5\` deb built-in nomni ezib yuborish (shadowing); 3) \`=\` va \`==\` ni adashtirish.

### 10. Real dasturlarda ishlatilishi
To'lov tizimlarida foydalanuvchi balansi, API konfiguratsiyalari, o'yinlarda o'yinchi koordinatalari va AI modellarda parametrlar barchasi o'zgaruvchilar orqali boshqariladi.`,
    theoryEn: `### 1. What Is a Variable?
A symbolic name bound to an object in memory.
### 2. Why Variables Matter
Enable reuse, express domain intent (\`tax = price * rate\`), and hold intermediate computations.
### 3. How Python Stores Values in Memory
Python variables are **references (labels)** pointing to objects on the heap; inspect addresses with \`id()\`.
### 4. Assignment Syntax
\`name = value\` binds \`name\` to the evaluated right-hand object.
### 5. Naming Rules
Letters, digits, and \`_\` only; cannot start with a digit; no hyphens or reserved keywords (\`if\`, \`class\`, \`for\`).
### 6. Dynamic Typing
Variables do not carry fixed types — objects do (\`type(var)\`).
### 7. Rebinding Values
Assigning \`score = 20\` moves the label to a new object without mutating \`10\`.
### 8. Working with Multiple Variables
Parallel unpacking (\`x, y = 1, 2\`) and clean swapping (\`x, y = y, x\`).
### 9. Common Mistakes
\`NameError\` from typos, shadowing built-ins like \`list = ...\`, or \`=\` vs \`==\`.
### 10. Real-World Usage
Balances, API configs, loop accumulators, and coordinates.`,
    examples: [
      ex('Misol 1: Xotira manzili (`id()`) va Dynamic Typing', 'Example 1: Object Identity & Dynamic Typing', `x = 100\nprint("Initial type:", type(x).__name__)\ny = x\nprint("Same object?:", id(x) == id(y))\nx = "Yuz"\nprint("Rebound x:", x, "| y:", y)`, `Initial type: int\nSame object?: True\nRebound x: Yuz | y: 100`, '`y = x` ikkala nomni bir obyektga bog‘laydi; `x` qayta tayinlanganda `y` o‘zgarmaydi.', '`y = x` aliases the object; rebinding `x` leaves `y` intact.'),
      ex('Misol 2: Parallel tayinlash va Swap', 'Example 2: Multiple Assignment & Swapping', `a, b = 10, 25\na, b = b, a\nprint(f"Swapped -> a={a}, b={b}")`, `Swapped -> a=25, b=10`, 'Python da ikki o‘zgaruvchini 1 qatorda vaqtinchalik o‘zgaruvchisiz almashtirish mumkin.', 'Tuple packing/unpacking swaps values cleanly in one line.'),
      ex('Misol 3: Yangilash (Rebinding)', 'Example 3: Progressive State Updates', `balance = 50_000\nbalance = balance + 15_000\nbalance -= 5_000\nprint("Yakuniy balans:", balance)`, `Yakuniy balans: 60000`, 'Har yangilashda o‘zgaruvchi yangi hisoblangan songa bog‘lanadi.', 'Augmented updates rebind to newly computed totals.'),
    ],
    traceTitleUz: 'Rebinding va Swap izi',
    traceTitleEn: 'Tracing Rebinding & Swapping',
    traceCode: `a = 3\nb = 7\na, b = b, a\nprint(a, b)`,
    traceSteps: [
      traceStep(1, 'a = 3', 'a->3', 'a 3 ga bog‘landi', 'a bound to 3'),
      traceStep(2, 'b = 7', 'a->3, b->7', 'b 7 ga bog‘landi', 'b bound to 7'),
      traceStep(3, 'a, b = b, a', 'a->7, b->3', 'Tuple (7, 3) ochildi', 'Unpacked (7, 3)'),
      traceStep(4, 'print(a, b)', '7 3', 'Natija chiqdi', 'Printed', '7 3'),
    ],
    commonMistakes: [
      mistake('Built-in nomini ezib yuborish', 'Shadowing Built-in Functions', `print = "Salom"\nprint("Test")`, "TypeError: 'str' object is not callable", `greeting = "Salom"\nprint(greeting)`, '`print`, `list`, `str`, `sum` kabi nomlarni o‘zgaruvchi qilmang.', 'Never assign over built-ins like `print`, `list`, or `str`.', 'Aniq domenga mos nom bering.', 'Use descriptive domain names.'),
      mistake('Kalit so‘z yoki raqam bilan boshlash', 'Invalid Variable Identifiers', `1st_user = "Ali"\nclass = "10A"`, 'SyntaxError', `first_user = "Ali"\nclass_name = "10A"`, 'Nom raqam bilan boshlanmaydi va keyword bo‘lolmaydi.', 'Cannot start with digits or use keywords.', 'Harf yoki `_` bilan boshlang.', 'Start with letter or `_`.'),
    ],
    compareTitleUz: 'Dynamic Typing vs Static Typing',
    compareTitleEn: 'Dynamic Typing vs Static Typing',
    compareUz: ['Dynamic (Python): tez prototiplash, qisqa sintaksis.', 'Type Hints (`age: int = 20`): ikkala dunyoning eng yaxshisi (IDE tekshiruvi + Python qulayligi).'],
    compareEn: ['Dynamic: rapid coding without ceremony.', 'Type Hints: optional static analysis without runtime friction.'],
    compareSummaryUz: 'Python dinamik til bo‘lsa-da, muhim o‘zgaruvchilarga Type Hint qo‘shish professional odatdir.',
    compareSummaryEn: 'Pair Python’s dynamic typing with type hints for clarity.',
    practiceTasks: [
      pt('p0203_1', '1-mashq: Qiymat almashtirish', 'Task 1: Swap Values', 'x=5, y=9 qiymatlarini swap qilib chiqaring.', 'Swap x=5, y=9 and print x, y.', `x, y = 5, 9\nx, y = y, x\nprint(x, y)`, '9 5', 'x, y = y, x.', 'Use tuple swap.'),
      pt('p0203_2', '2-mashq: Zanjirli tayinlash', 'Task 2: Chained Assignment', 'a = b = 10 qilib a + b ni chiqaring.', 'Set a = b = 10 and print a + b.', `a = b = 10\nprint(a + b)`, '20', 'a = b = 10.', 'Sum them.'),
      pt('p0203_3', '3-mashq: id() tekshiruvi', 'Task 3: Identity Alias', 'x = 50; y = x da `id(x) == id(y)` ni chiqaring.', 'Check id(x) == id(y).', `x = 50\ny = x\nprint(id(x) == id(y))`, 'True', 'id(x) == id(y).', 'Compare ids.'),
      pt('p0203_4', '4-mashq: Dinamik tur o‘zgarishi', 'Task 4: Rebinding Type', 'val = 10 so‘ng val = "O‘n" qilib type(val).__name__ ni chiqaring.', 'Rebind val and print type name.', `val = 10\nval = "O'n"\nprint(type(val).__name__)`, 'str', 'type(val).__name__.', 'Print type name.'),
      pt('p0203_5', '5-mashq: Keyword tekshiruvi', 'Task 5: Check Keyword', '`keyword.iskeyword("for")` natijasini chiqaring.', 'Check if "for" is a Python keyword.', `import keyword\nprint(keyword.iskeyword("for"))`, 'True', 'keyword.iskeyword().', 'Use keyword module.'),
    ],
    quiz: [
      q('q0203_1', 'Qaysi o‘zgaruvchi nomi TO‘G‘RI?', 'Which identifier is valid?', ['2user', 'my-var', '_user_1', 'class'], ['2user', 'my-var', '_user_1', 'class'], 2, '`_user_1` barcha qoidalarga mos.', '`_user_1` is valid.'),
      q('q0203_2', 'Python da o‘zgaruvchi aslida nima?', 'What is a Python variable under the hood?', ['Statik quti', 'Xotiradagi obyektga havola (reference)', 'Fayl', 'CPU registri'], ['Static box', 'Reference label to a memory object', 'Disk file', 'CPU register'], 1, 'Obyektga yorliq (reference).', 'Reference label.'),
      q('q0203_3', '`a, b = b, a` nima bajaradi?', 'What does `a, b = b, a` do?', ['Xato beradi', 'Ikkala qiymatni almashtiradi', 'Ikkisini 0 qiladi', 'O‘chiradi'], ['Raises error', 'Swaps values of a and b', 'Zeros both', 'Deletes both'], 1, 'Swap qiladi.', 'Swaps a and b.'),
      q('q0203_4', '`list = [1, 2]` yozishning zarari?', 'Risk of `list = [1, 2]`?', ['SyntaxError', 'O‘rnatilgan `list()` funksiyasini to‘sib qo‘yadi', 'Tezlashtiradi', 'Hech qanday'], ['SyntaxError', 'Shadows built-in `list()` function', 'Speeds up', 'None'], 1, 'Shadowing.', 'Shadows built-in.'),
      q('q0203_5', '`id(x)` nimani qaytaradi?', 'What does `id(x)` return?', ['Turini', 'Obyektning noyob xotira identifikatorini', 'Uzunligini', 'Qiymatini'], ['Type', 'Unique object identity integer', 'Length', 'Value'], 1, 'Xotira ID sini.', 'Object identity.'),
    ],
    homework: hw('Xotira va Swap Laboratoriyasi', 'Variable Memory & Swap Lab', '3 ta o‘zgaruvchi (`a=1, b=2, c=3`) qiymatlarini siklik aylantirib (`a->2, b->3, c->1`) chiqaruvchi va `id()` ni tekshiruvchi dastur yozing.', 'Rotate 3 variables (`a, b, c = b, c, a`) and print before/after values and types.', ['Parallel unpacking ishlating', 'Kamida 1 ta type hint yozing'], ['Use tuple unpacking', 'Add type hints'], 'a, b, c = b, c, a', 'One-line tuple unpack.', 'F-string jadvalda ko‘rsating.', 'Display in formatted table.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-02-04',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m2',
    order: 4,
    titleUz: 'Data Types — ma’lumot turlari',
    titleEn: 'Core Data Types Overview (`int`, `float`, `str`, `bool`, `None`)',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-02-03'],
    conceptId: 'data_types_overview',
    whyUz: "Har bir qiymat turi xotirada qancha joy olishini va uning ustida qanday amallar (masalan, qo'shish vs katta harf) bajarish mumkinligini belgilaydi.",
    whyEn: 'Data types define what operations are valid on an object—catching TypeErrors early and modeling real data accurately.',
    analogyUz: "Ma'lumot turlari — bu idish turlari: suyuqlik uchun kosa (`float`), dona buyum uchun quti (`int`), xat uchun konvert (`str`), yoqish/o'chirish tugmasi (`bool`).",
    analogyEn: 'Types are specialized containers: liquids vs discrete counts vs text labels vs on/off switches.',
    stopsUz: "Python da hamma narsa obyekt (hatto `int` ham metodlarga ega!) va har bir obyektning o'z turi bor.",
    stopsEn: 'In Python, every primitive value is actually a full object with its own class.',
    objUz: ['5 ta asosiy turni (`int`, `float`, `str`, `bool`, `NoneType`) farqlash', '`type()` va `isinstance()` bilan turni tekshirish', 'Qaysi turga qaysi amal mosligini bilish'],
    objEn: ['Distinguish `int`, `float`, `str`, `bool`, and `NoneType`', 'Inspect types safely via `type()` and `isinstance()`', 'Predict valid operations per type'],
    theoryUz: `### 1. Nega turlar kerak?
\`10 + 5\` bu \`15\`, lekin \`"10" + "5"\` bu \`"105"\`! Tur amalning ma'nosini belgilaydi.
### 2. Python ning 5 ta tayanch turi
| Tur | Misol | Vazifasi |
|---|---|---|
| \`int\` | \`42\`, \`-7\`, \`0\` | Butun sonlar (cheksiz aniqlik!) |
| \`float\` | \`3.14\`, \`-0.5\` | O'nlik kasr sonlar |
| \`str\` | \`"Salom"\` | Matn (Unicode) |
| \`bool\` | \`True\`, \`False\` | Mantiqiy qiymat |
| \`NoneType\` | \`None\` | Qiymat yo'qligi / bo'shlik |
### 3. \`type()\` vs \`isinstance()\`
\`isinstance(x, int)\` vorislikni ham hisobga oladi (professional kodda afzal).
### 4. \`None\` tushunchasi
\`None\` — bu \`0\` emas va \`""\` emas; u "hali qiymat tayinlanmagan" degan maxsus obyekt (\`is None\` bilan tekshiriladi).
### 5. Keng tarqalgan xato
\`True\` aslida \`int\` ning kenja turi (\`isinstance(True, int) == True\`), lekin mantiq uchun alohida ishlatiladi.`,
    theoryEn: `### 1. Why Types Matter
\`10 + 5 == 15\` vs \`"10" + "5" == "105"\`—the type dictates behavior.
### 2. Five Foundational Types
\`int\`, \`float\`, \`str\`, \`bool\`, and \`NoneType\` (\`None\`).
### 3. \`type()\` vs \`isinstance()\`
Prefer \`isinstance(val, int)\` in production checks.
### 4. Understanding \`None\`
Represents absence of a value; always check with \`val is None\`.
### 5. Subtle Fact
\`bool\` subclasses \`int\` (\`True == 1\`), though it represents logical truth.`,
    examples: [
      ex('Misol 1: Barcha asosiy turlarni ko‘rish', 'Example 1: Inspecting Foundational Types', `samples = [42, 3.14, "Python", True, None]\nfor item in samples:\n    print(f"{repr(item)} -> {type(item).__name__}")`, `42 -> int\n3.14 -> float\n'Python' -> str\nTrue -> bool\nNone -> NoneType`, 'Har bir qiymat o‘z aniq klass nomiga ega.', 'Each literal belongs to a distinct class.'),
      ex('Misol 2: `isinstance()` va `is None`', 'Example 2: Type Checking Safely', `age = 19\nmiddle_name = None\nprint("age is int:", isinstance(age, int))\nprint("no middle name:", middle_name is None)`, `age is int: True\nno middle name: True`, 'Turni tekshirishda `isinstance`, bo‘shlikni tekshirishda `is None` eng to‘g‘ri usul.', 'Use `isinstance()` for types and `is None` for None checks.'),
      ex('Misol 3: Turga qarab `+` operatori', 'Example 3: Operator Polymorphism Across Types', `print("Num add:", 7 + 3)\nprint("Str concat:", "7" + "3")`, `Num add: 10\nStr concat: 73`, 'Bir xil `+` belgisi turga qarab qo‘shadi yoki matnni ulaydi.', '`+` performs addition on numbers and concatenation on strings.'),
    ],
    traceTitleUz: 'Tur tekshiruvi izi',
    traceTitleEn: 'Tracing Type Checks',
    traceCode: `val = 9.5\nis_num = isinstance(val, (int, float))\nprint(type(val).__name__, is_num)`,
    traceSteps: [
      traceStep(1, 'val = 9.5', 'val=9.5 (float)', 'O‘nlik son saqlandi', 'Bound float literal'),
      traceStep(2, 'isinstance(val, (int, float))', 'is_num=True', 'Son ekanligi tasdiqlandi', 'Verified numeric type'),
      traceStep(3, 'print(...)', 'float True', 'Chiqish', 'Output', 'float True'),
    ],
    commonMistakes: [
      mistake('`"10"` va `10` ni bir xil deb o‘ylash', 'Treating "10" as Number 10', `price = "10"\nprint(price + 5)`, 'TypeError', `price = 10\nprint(price + 5)`, 'Qo‘shtirnoq ichidagi raqam ham `str` hisoblanadi.', 'Quoted digits are strings, not integers.', 'Sonlarni qo‘shtirnoqsiz yozing.', 'Write numeric literals without quotes.'),
      mistake('`== None` o‘rniga `is None` ishlatmaslik', 'Using == None Instead of is None', `if x == None:\n    pass`, 'Not Pythonic (can break custom __eq__)', `if x is None:\n    pass`, 'PEP 8 `None` ni faqat `is` / `is not` bilan tekshirishni talab qiladi.', 'PEP 8 requires identity check `is None`.', 'Doim `is None` yozing.', 'Always write `is None`.'),
    ],
    compareTitleUz: '`type(x) == int` vs `isinstance(x, int)`',
    compareTitleEn: '`type(x) == int` vs `isinstance(x, int)`',
    compareUz: ['`type(x)`: aynan o‘sha klassni tekshiradi.', '`isinstance(x, (int, float))`: bir nechta tur va merosxo‘rlikni birga tekshiradi.'],
    compareEn: ['`type(x)`: exact class match only.', '`isinstance(x, (int, float))`: supports tuples of types and inheritance.'],
    compareSummaryUz: 'Kodda tekshiruv uchun doim `isinstance()` dan foydalaning.',
    compareSummaryEn: 'Use `isinstance()` for clean, extensible type checks.',
    practiceTasks: [
      pt('p0204_1', '1-mashq: Tur nomi', 'Task 1: Type Name', '`type(3.5).__name__` ni chiqaring.', 'Print type name of 3.5.', `print(type(3.5).__name__)`, 'float', 'type().__name__.', 'Use __name__.'),
      pt('p0204_2', '2-mashq: None tekshiruvi', 'Task 2: is None', '`data = None` da `data is None` ni chiqaring.', 'Check `data is None`.', `data = None\nprint(data is None)`, 'True', 'is None.', 'Use is None.'),
      pt('p0204_3', '3-mashq: isinstance tuple', 'Task 3: Numeric Tuple Check', '`isinstance(12, (int, float))` ni chiqaring.', 'Check if 12 is int or float.', `print(isinstance(12, (int, float)))`, 'True', 'isinstance().', 'Pass (int, float).'),
      pt('p0204_4', '4-mashq: String qo‘shish', 'Task 4: String Concat', '`"2" + "6"` ni chiqaring.', 'Print `"2" + "6"`.', `print("2" + "6")`, '26', 'String + String.', 'Concatenate strings.'),
      pt('p0204_5', '5-mashq: Bool turi', 'Task 5: Bool Type', '`type(False).__name__` ni chiqaring.', 'Print type name of False.', `print(type(False).__name__)`, 'bool', 'type(False).__name__.', 'Print __name__.'),
    ],
    quiz: [
      q('q0204_1', '`None` ning turi nima?', 'What is the type of `None`?', ['null', 'void', 'NoneType', 'empty'], ['null', 'void', 'NoneType', 'empty'], 2, '`NoneType`.', '`NoneType`.'),
      q('q0204_2', '`type("25")` nimani beradi?', 'What is the type of `"25"`?', ['int', 'float', 'str', 'bool'], ['int', 'float', 'str', 'bool'], 2, 'Qo‘shtirnoq ichida — `str`.', 'Quoted text is `str`.'),
      q('q0204_3', '`None` ni tekshirishning to‘g‘ri usuli?', 'Idiomatic way to check for `None`?', ['x == None', 'x is None', 'x = None', 'type(x) = None'], ['x == None', 'x is None', 'x = None', 'type(x) = None'], 1, '`is None`.', '`is None`.'),
      q('q0204_4', 'Qaysi biri `float`?', 'Which literal is a `float`?', ['10', '"10.0"', '10.0', 'True'], ['10', '"10.0"', '10.0', 'True'], 2, '10.0 — float.', '10.0 is float.'),
      q('q0204_5', '`isinstance(42, (int, str))` natijasi?', 'Result of `isinstance(42, (int, str))`?', ['True', 'False', 'Error', 'None'], ['True', 'False', 'Error', 'None'], 0, '42 int ga mos keladi -> True.', 'True.'),
    ],
    homework: hw('Turlar Inspektori', 'Data Type Inspector', '5 xil turdagi (`int, float, str, bool, None`) o‘zgaruvchilarni ro‘yxatga solib, har biri uchun qiymat, tur nomi va `isinstance(..., (int, float))` natijasini chiqaring.', 'Inspect 5 typed values in a loop, printing value, type name, and whether numeric.', ['5 ta tur ham qatnashsin', 'is None tekshiruvi bo‘lsin'], ['Cover all 5 core types', 'Include is None check'], 'for v in values:', 'Iterate over list.', 'Jadval sarlavhasini qo‘shing.', 'Add header row.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-02-05',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m2',
    order: 5,
    titleUz: 'Integers va Floats',
    titleEn: 'Integers, Floats & Precision Math',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-02-04'],
    conceptId: 'int_float',
    whyUz: "Moliyaviy ilovalarda `0.1 + 0.2 == 0.30000000000000004` chiqishini bilmaslik tiyin/sent xatolariga olib keladi. Python da butun va o'nlik sonlar sirini bilish shart.",
    whyEn: 'Understanding arbitrary-precision ints vs IEEE-754 float quirks prevents financial rounding bugs.',
    analogyUz: "`int` — aniq dona sanash (olmalar soni); `float` — o'lchov chizg'ichi (vazn, harorat) — ba'zan mikroskopik kasr qoldig'i bo'lishi mumkin.",
    analogyEn: '`int` counts exact whole items; `float` measures continuous values with binary floating-point rounding.',
    stopsUz: "Pul hisoblashda aniq kasr uchun `int` (tiyin/sentda hisoblash) yoki standart `decimal.Decimal` ishlatiladi.",
    stopsEn: 'For currency, store integer cents/tiyins or use `decimal.Decimal`.',
    objUz: ['Python `int` cheksiz razryadli aniqligini bilish', '`float` IEEE-754 aniqlik chegarasini (`0.1 + 0.2`) tushunish', '`round()`, `abs()`, `math` va `Decimal` dan foydalanish'],
    objEn: ['Use arbitrary-precision integers', 'Understand IEEE-754 float imprecision (`0.1 + 0.2`)', 'Apply `round()`, `abs()`, `math`, and `Decimal`'],
    theoryUz: `### 1. \`int\` — Cheksiz butun sonlar
Python da \`int\` to‘lib ketmaydi (overflow yo‘q): \`10 ** 50\` bemalol hisoblanadi! Katta sonlarni \`1_000_000\` kabi yozish mumkin.
### 2. \`float\` — O‘nlik sonlar va IEEE-754 siri
Kompyuter ikkilik sanoq tizimida ishlagani uchun \`0.1 + 0.2\` natijasi \`0.30000000000000004\` bo‘ladi!
### 3. Bo‘lish qoidasi
\`10 / 2\` har doim **\`5.0\` (float)** qaytaradi; butun natija uchun \`10 // 2\` (\`5\`) ishlating.
### 4. Foydali funksiyalar
\`round(3.14159, 2) -> 3.14\`, \`abs(-12) -> 12\`, \`pow(2, 10) -> 1024\`, \`math.floor\`, \`math.ceil\`.
### 5. Moliyada \`Decimal\` yoki tiyin
\`\`\`python
from decimal import Decimal
Decimal("0.1") + Decimal("0.2") == Decimal("0.3")  # True!
\`\`\``,
    theoryEn: `### 1. Arbitrary-Precision \`int\`
Python ints never overflow: \`10 ** 100\` stays exact. Use underscores \`1_000_000\` for readability.
### 2. \`float\` & Binary Floating-Point
Because \`0.1\` is repeating in binary, \`0.1 + 0.2 == 0.3\` evaluates to \`False\`!
### 3. True vs Floor Division
\`/\` always yields \`float\` (\`10 / 2 == 5.0\`); \`//\` yields floor integer (\`10 // 2 == 5\`).
### 4. Built-in Math Helpers
\`round()\`, \`abs()\`, \`pow()\`, plus \`math.ceil\`, \`math.floor\`.
### 5. Financial Precision
Use \`Decimal("0.1")\` or integer cents for currency.`,
    examples: [
      ex('Misol 1: Float aniqlik tuzog‘i va `Decimal`', 'Example 1: Float Quirk vs Decimal', `print("Float equal?:", (0.1 + 0.2) == 0.3)\nfrom decimal import Decimal\nprint("Decimal equal?:", Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))`, `Float equal?: False\nDecimal equal?: True`, 'Float ikkilik yaqinlashuv beradi, `Decimal` esa aniq o‘nlik hisoblaydi.', 'Floats approximate base-10 fractions; `Decimal` stays exact.'),
      ex('Misol 2: Bo‘lish va yaxlitlash', 'Example 2: Division Types & Rounding', `print("10 / 2 =", 10 / 2)\nprint("10 // 3 =", 10 // 3)\nprint("Round:", round(3.14159, 2))`, `10 / 2 = 5.0\n10 // 3 = 3\nRound: 3.14`, '`/` doim float beradi, `//` butun qismini oladi.', '`/` always returns float; `//` floors.'),
      ex('Misol 3: `math` moduli bilan ishlash', 'Example 3: Using math Helpers', `import math\nprint("Floor:", math.floor(4.9))\nprint("Ceil:", math.ceil(4.1))\nprint("Sqrt:", int(math.sqrt(144)))`, `Floor: 4\nCeil: 5\nSqrt: 12`, '`math.floor` pastga, `math.ceil` yuqoriga yaxlitlaydi.', '`floor` rounds down; `ceil` rounds up.'),
    ],
    traceTitleUz: 'Butun vs Kasr bo‘lish izi',
    traceTitleEn: 'Tracing Division & Rounding',
    traceCode: `total = 25\ncount = 4\nexact = total / count\nwhole = total // count\nprint(exact, whole)`,
    traceSteps: [
      traceStep(1, 'exact = total / count', 'exact=6.25', 'Aniq kasr bo‘lish', 'True division'),
      traceStep(2, 'whole = total // count', 'whole=6', 'Butun qism', 'Floor division'),
      traceStep(3, 'print(exact, whole)', '6.25 6', 'Natija', 'Output', '6.25 6'),
    ],
    commonMistakes: [
      mistake('Floatlarni `==` bilan solishtirish', 'Exact == Comparison on Floats', `if 0.1 + 0.2 == 0.3:\n    print("Teng")`, 'Condition unexpectedly False', `import math\nif math.isclose(0.1 + 0.2, 0.3):\n    print("Teng")`, 'Float da `math.isclose()` yoki `Decimal` ishlatiladi.', 'Use `math.isclose()` or `Decimal` for float equality.', 'Hech qachon pulni oddiy `float ==` da tekshirmang.', 'Never compare floats blindly with `==`.'),
      mistake('Decimal ga float uzatish', 'Passing Float Literal into Decimal()', `from decimal import Decimal\nprint(Decimal(0.1))`, 'Long imprecise digits 0.10000000000000000555...', `from decimal import Decimal\nprint(Decimal("0.1"))`, '`Decimal(0.1)` avval noto‘g‘ri float ni oladi; string uzating!', '`Decimal(0.1)` captures binary float noise; pass a string.', 'Doim `Decimal("0.1")` yozing.', 'Always pass strings to `Decimal()`.'),
    ],
    compareTitleUz: '`int` vs `float` vs `Decimal`',
    compareTitleEn: '`int` vs `float` vs `Decimal`',
    compareUz: ['`int`: sanoq, indekslar, tiyinlar.', '`float`: fizika, grafika, ML hisoblar.', '`Decimal`: bank, hisob-kitob, soliq.'],
    compareEn: ['`int`: counts, indexes, cents.', '`float`: science, coordinates, ML.', '`Decimal`: accounting and billing.'],
    compareSummaryUz: 'Pul hisoblashda tiyin (`int`) yoki `Decimal("...")` ishlating.',
    compareSummaryEn: 'Use integer cents or `Decimal("...")` for money.',
    practiceTasks: [
      pt('p0205_1', '1-mashq: math.isclose', 'Task 1: math.isclose', '`math.isclose(0.1 + 0.2, 0.3)` ni chiqaring.', 'Check float closeness.', `import math\nprint(math.isclose(0.1 + 0.2, 0.3))`, 'True', 'math.isclose.', 'Use math.isclose.'),
      pt('p0205_2', '2-mashq: Decimal yig‘indi', 'Task 2: Decimal Sum', '`Decimal("1.50") + Decimal("2.75")` ni chiqaring.', 'Add Decimals.', `from decimal import Decimal\nprint(Decimal("1.50") + Decimal("2.75"))`, '4.25', 'Decimal("...").', 'Pass strings.'),
      pt('p0205_3', '3-mashq: Yaxlitlash', 'Task 3: Round', '`round(19.678, 1)` ni chiqaring.', 'Round 19.678 to 1 decimal.', `print(round(19.678, 1))`, '19.7', 'round(val, 1).', 'Pass 1.'),
      pt('p0205_4', '4-mashq: Absolyut qiymat', 'Task 4: Absolute Value', '`abs(-45)` ni chiqaring.', 'Print abs(-45).', `print(abs(-45))`, '45', 'abs().', 'Use abs().'),
      pt('p0205_5', '5-mashq: Yuqoriga yaxlitlash', 'Task 5: Ceil', '`math.ceil(4.01)` ni chiqaring.', 'Print math.ceil(4.01).', `import math\nprint(math.ceil(4.01))`, '5', 'math.ceil.', 'Use math.ceil.'),
    ],
    quiz: [
      q('q0205_1', '`10 / 2` natijasining turi nima?', 'Type of `10 / 2`?', ['int', 'float', 'str', 'bool'], ['int', 'float', 'str', 'bool'], 1, '`5.0` — float.', '`float`.'),
      q('q0205_2', '`0.1 + 0.2 == 0.3` natijasi?', 'Result of `0.1 + 0.2 == 0.3`?', ['True', 'False', 'Error', 'None'], ['True', 'False', 'Error', 'None'], 1, 'False (binary float).', 'False.'),
      q('q0205_3', 'Moliya uchun qaysi tur xavfsiz?', 'Safest type for financial amounts?', ['float', 'Decimal("...")', 'bool', 'set'], ['float', 'Decimal("...")', 'bool', 'set'], 1, '`Decimal` string bilan.', '`Decimal` from string.'),
      q('q0205_4', '`round(3.14159, 2)` natijasi?', 'Result of `round(3.14159, 2)`?', ['3.1', '3.14', '3.15', '3'], ['3.1', '3.14', '3.15', '3'], 1, '3.14.', '3.14.'),
      q('q0205_5', '`math.ceil(3.01)` nimani qaytaradi?', 'What does `math.ceil(3.01)` return?', ['3', '4', '3.0', '3.1'], ['3', '4', '3.0', '3.1'], 1, '4.', '4.'),
    ],
    homework: hw('Bank Foizi Kalkulyatori', 'Exact Currency Calculator', '`Decimal` yordamida 1 250 000 so‘mlik xaridga 12% QQS va 5% chegirma hisoblab 2 xonagacha yaxlitlab chiqaring.', 'Use `Decimal` to apply 5% discount then 12% VAT on 1,250,000 and print exact total.', ['String dan Decimal yarating', 'round(..., 2) qo‘llang'], ['Initialize Decimal from strings', 'Format to 2 decimals'], 'Decimal("1250000") * Decimal("0.95") * Decimal("1.12")', 'Chain Decimal multipliers.', 'Tejalgan summani ham chiqaring.', 'Print savings too.', 20),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-02-06',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m2',
    order: 6,
    titleUz: 'Strings — matnlar bilan ishlash',
    titleEn: 'Strings: Indexing, Slicing & Essential Methods',
    difficulty: 'beginner',
    estimatedMinutes: 40,
    prerequisites: ['PY-02-05'],
    conceptId: 'strings_mastery',
    whyUz: "Veb saytlardan kelgan ma'lumotlar, foydalanuvchi ismlari, JSON, CSV va AI promptlarining deyarli hammasi matn (`str`) ko'rinishida bo'ladi.",
    whyEn: 'User inputs, API responses, CSV files, and AI prompts arrive as strings—making string mastery indispensable.',
    analogyUz: "String — bu harflar ipga tizilgan marjon: har bir harfning o'z tartib raqami (indeksi `0, 1, 2...` yoki oxiridan `-1, -2...`) bor va uni joyida kesib olish mumkin, lekin ipni uzmasdan almashtirib bo'lmaydi (immutable).",
    analogyEn: 'A string is a pearl necklace of characters: each has an index (`0, 1...` or `-1` from the end), sliceable cleanly, and immutable.',
    stopsUz: "`.upper()` yoki `.replace()` asl matnni o'zgartirmaydi — doim YANGI matn qaytaradi!",
    stopsEn: 'Methods like `.upper()` or `.replace()` never mutate in place—they return a brand new string.',
    objUz: ['Indexing (`s[0]`, `s[-1]`) va Slicing (`s[start:stop:step]`) ni qo‘llash', 'Asosiy metodlar: `.strip()`, `.lower()`, `.upper()`, `.replace()`, `.split()`, `.join()`', 'F-string formatlash (`:.2f`, tekislash)'],
    objEn: ['Use positive/negative indexing and slicing', 'Chain `.strip()`, `.lower()`, `.replace()`, `.split()`, and `.join()`', 'Format numbers and widths cleanly in f-strings'],
    theoryUz: `### 1. String va Indekslash
\`s = "Python"\`: \`s[0] == 'P'\`, \`s[-1] == 'n'\`. Indeks doim \`0\` dan boshlanadi!
### 2. Slicing: \`s[start:stop:step]\`
\`stop\` indeksi natijaga kirmaydi: \`"Python"[0:3] -> "Pyt"\`, \`"Python"[::-1] -> "nohtyP"\` (teskari).
### 3. Immutability (O'zgarmaslik)
\`s[0] = "J"\` xato beradi! Yangi matn yasash kerak: \`"J" + s[1:]\`.
### 4. Eng ko'p ishlatiladigan 7 metod
- \`.strip()\`: chetlardagi bo'sh joylarni olib tashlash
- \`.lower()\` / \`.upper()\`: kichik/katta harf
- \`.replace(old, new)\`: almashtirish
- \`.split(sep)\`: bo'lib ro'yxat (\`list\`) olish
- \`", ".join(items)\`: ro'yxatni matnga birlashtirish
- \`.startswith()\` / \`.endswith()\`
### 5. F-string mini-tili
\`f"{price:.2f}"\` -> 2 xona aniqlik; \`f"{42:04d}"\` -> \`0042\`.`,
    theoryEn: `### 1. Indexing
0-based from left (\`s[0]\`), negative from right (\`s[-1]\`).
### 2. Slicing \`[start:stop:step]\`
\`stop\` is exclusive; \`s[::-1]\` reverses cleanly.
### 3. Immutability
\`s[0] = 'X'\` raises \`TypeError\`. Build a new string instead.
### 4. Essential String Methods
\`.strip()\`, \`.lower()\`, \`.upper()\`, \`.replace()\`, \`.split()\`, \`sep.join()\`, \`.startswith()\`.
### 5. F-String Formatting
\`f"{val:.2f}"\` formats 2 decimals; \`f"{n:04d}"\` pads zeros.`,
    examples: [
      ex('Misol 1: Slicing va teskari matn', 'Example 1: Indexing & Slicing', `word = "Python"\nprint("First & Last:", word[0], word[-1])\nprint("Slice 0:3:", word[0:3])\nprint("Reversed:", word[::-1])`, `First & Last: P n\nSlice 0:3: Pyt\nReversed: nohtyP`, 'Slicing chegaradan chiqsa ham xato bermaydi va matnni qulay kesadi.', 'Slicing handles bounds gracefully and `[::-1]` reverses.'),
      ex('Misol 2: Matn tozalash va Split/Join', 'Example 2: Cleaning, Splitting & Joining', `raw = "  dilshod.ali@mail.uz  "\nclean = raw.strip().lower()\nparts = clean.split("@")\nprint("Clean:", clean)\nprint("User:", parts[0], "| Domain:", parts[1])`, `Clean: dilshod.ali@mail.uz\nUser: dilshod.ali | Domain: mail.uz`, 'Email yoki telefon kiritmalarini avval `.strip().lower()` bilan tozalash oltin qoidadir.', 'Normalizing inputs with `.strip().lower()` prevents subtle mismatches.'),
      ex('Misol 3: F-string formatlash', 'Example 3: F-String Precision', `pi = 3.14159\norder_id = 7\nprint(f"Order #{order_id:04d} | Pi={pi:.2f}")`, `Order #0007 | Pi=3.14`, '`:04d` 4 xonali nol bilan to‘ldiradi, `:.2f` esa 2 kasr xonani qoldiradi.', '`:04d` pads leading zeros; `:.2f` fixes decimal places.'),
    ],
    traceTitleUz: 'String metodlari zanjiri',
    traceTitleEn: 'Tracing Chained String Methods',
    traceCode: `s = "  pyThon  "\nres = s.strip().title()\nprint(res, len(res))`,
    traceSteps: [
      traceStep(1, 's = "  pyThon  "', 's="  pyThon  "', 'Boshlang‘ich matn', 'Raw string'),
      traceStep(2, 's.strip()', '"pyThon"', 'Chet bo‘sh joylar ketdi', 'Whitespace stripped'),
      traceStep(3, '.title()', 'res="Python"', 'Bosh harfga keltirildi', 'Title-cased'),
      traceStep(4, 'print(res, len(res))', 'Python 6', 'Natija chiqdi', 'Printed', 'Python 6'),
    ],
    commonMistakes: [
      mistake('Qaytarilgan natijani saqlamaslik', 'Ignoring Returned New String', `name = "ali"\nname.upper()\nprint(name)`, 'Prints lowercase "ali"', `name = "ali"\nname = name.upper()\nprint(name)`, 'String immutable — metod asl o‘zgaruvchini o‘zgartirmaydi.', 'Strings are immutable; capture the returned string.', 'Natijani o‘zgaruvchiga qayta tayinlang.', 'Assign `name = name.upper()`.'),
      mistake('IndexError chegaradan chiqish', 'String Index Out of Range', `s = "Hi"\nprint(s[5])`, 'IndexError', `s = "Hi"\nprint(s[:5])`, 'Bitta indeks xato beradi, slice `[:5]` esa xavfsiz.', 'Direct indexing fails out-of-bounds; slicing clamps cleanly.', 'Uzunlikni `len()` bilan tekshiring.', 'Check `len()` before indexing.'),
    ],
    compareTitleUz: '`+` bilan ulash vs `"".join()` / f-string',
    compareTitleEn: '`+` Concatenation vs `join()` / f-strings',
    compareUz: ['2–3 ta matn: `f"{a} {b}"` eng o‘qilishi oson.', 'Ro‘yxatdagi 1000 ta so‘z: `", ".join(words)` O(n) eng tez.'],
    compareEn: ['2–3 parts: f-strings read cleanest.', 'Many items in a list: `sep.join(items)` is O(n) fastest.'],
    compareSummaryUz: 'Matn shakllantirishda f-string, ro‘yxat birlashtirishda `.join()` ishlating.',
    compareSummaryEn: 'Use f-strings for templates and `.join()` for collections.',
    practiceTasks: [
      pt('p0206_1', '1-mashq: Teskari matn', 'Task 1: Reverse String', '`"Salom"` ni teskari qilib chiqaring.', 'Reverse `"Salom"`.', `print("Salom"[::-1])`, 'molaS', '[::-1].', 'Use [::-1].'),
      pt('p0206_2', '2-mashq: Strip va Lower', 'Task 2: Normalize Text', '`"  ADMIN  "` ni tozalab kichik harfda chiqaring.', 'Strip and lowercase `"  ADMIN  "`.', `print("  ADMIN  ".strip().lower())`, 'admin', '.strip().lower().', 'Chain strip and lower.'),
      pt('p0206_3', '3-mashq: Join', 'Task 3: Join List', '`["A", "B", "C"]` ni `"-"` bilan ulang.', 'Join `["A", "B", "C"]` with `"-"`.', `print("-".join(["A", "B", "C"]))`, 'A-B-C', '"-".join(...).', 'Use join().'),
      pt('p0206_4', '4-mashq: Replace', 'Task 4: Replace Text', '`"2025-01-01"` da `"-"` ni `"/"` ga almashtiring.', 'Replace `-` with `/` in date string.', `print("2025-01-01".replace("-", "/"))`, '2025/01/01', '.replace("-", "/").', 'Use .replace().'),
      pt('p0206_5', '5-mashq: Nol to‘ldirish', 'Task 5: Zero Padding', '`9` sonini f-stringda `009` qilib chiqaring.', 'Format `9` as `009`.', `n = 9\nprint(f"{n:03d}")`, '009', '{n:03d}.', 'Use :03d.'),
    ],
    quiz: [
      q('q0206_1', '`"Python"[1:4]` nimani qaytaradi?', 'What does `"Python"[1:4]` return?', ['Pyt', 'yth', 'ytho', 'tho'], ['Pyt', 'yth', 'ytho', 'tho'], 1, 'Indeks 1, 2, 3 -> `"yth"`.', 'Indices 1..3 -> `"yth"`.'),
      q('q0206_2', '`s = "hi"; s[0] = "H"` nima qiladi?', 'What happens on `s = "hi"; s[0] = "H"`?', ['"Hi" ga o‘zgaradi', 'TypeError beradi', 'SyntaxError', 'None'], ['Becomes "Hi"', 'Raises TypeError', 'SyntaxError', 'None'], 1, 'String immutable.', 'Strings are immutable.'),
      q('q0206_3', 'Matnni bo‘sh joydan ro‘yxatga bo‘lish metodi?', 'Method splitting string into list of words?', ['.join()', '.split()', '.strip()', '.cut()'], ['.join()', '.split()', '.strip()', '.cut()'], 1, '`.split()`.', '`.split()`.'),
      q('q0206_4', '`s = "abc"; s.upper(); print(s)` nima chiqaradi?', 'Output of `s = "abc"; s.upper(); print(s)`?', ['ABC', 'abc', 'Abc', 'Error'], ['ABC', 'abc', 'Abc', 'Error'], 1, 'Natija saqlanmagani uchun `"abc"` chiqadi.', 'Original `s` remains `"abc"`.'),
      q('q0206_5', 'Oxirgi belgini olish indeksi?', 'Index for last character?', ['[0]', '[len]', '[-1]', '[-0]'], ['[0]', '[len]', '[-1]', '[-0]'], 2, '`[-1]`.', '`[-1]`.'),
    ],
    homework: hw('Username Normallashtirgich', 'Username Normalizer', '`"  Azizbek_Karimov 2026  "` kabi xom matnni tozalab, kichik harfga o‘tkazib, bo‘sh joylarni `"_"` ga almashtirib chiqaring.', 'Clean `"  Azizbek_Karimov 2026  "` by trimming, lowercasing, and replacing internal spaces with `_`.', ['strip(), lower(), replace() ishlating', 'Natijada bo‘sh joy qolmasin'], ['Chain strip, lower, replace', 'No spaces remain'], '.strip().lower().replace(" ", "_")', 'Chain methods.', 'Uzunligi 3..20 oraliqda ekanini ham tekshiring.', 'Also check length between 3 and 20.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),
];
