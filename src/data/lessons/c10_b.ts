import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C10_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-10-08',
    courseId: 'advanced_python',
    moduleId: 'c10_m3',
    order: 8,
    titleUz: 'Advanced Comprehensions va Walrus Operatori (:=)',
    titleEn: 'Advanced Comprehensions & Walrus Operator (:=)',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-10-07'],
    conceptId: 'adv_comprehensions',
    whyUz: "Dict comprehension, set comprehension, nested matrix flattening va Python 3.8+ dagi **Walrus operatori (`:=`)** yordamida funksiyani 2 marta chaqirmasdan ham filtrlash, ham qiymatni ishlatish mumkin — lekin haddan oshirilsa kod o‘qilmay qoladi!",
    whyEn: 'Master dict/set comprehensions, nested flattening order, and assignment expressions (`:=`)—while knowing the readability boundary where plain loops win.',
    analogyUz: "**Comprehension** — tez yurar oshxona konveyeri; **Walrus (`:=`)** esa o‘lchab bo‘lgach qog‘ozga yozib qo‘ymay, bir yo‘la laganga ham solib uzatuvchi qo‘l!",
    analogyEn: 'Comprehensions express collection transforms concisely; the walrus operator (`:=`) binds a computed sub-expression once inside the filter and reuses it in the output.',
    stopsUz: "Nested comprehension tartibi tashqaridan ichkariga **oddiy `for` sikllari tartibida** yoziladi (`[x for row in matrix for x in row]`). 3 qavatli comprehension o‘rniga o‘qilishi oson `for` sikli yozing! Walrus (`:=`) qavssiz ba’zan sintaksis chalkashtiradi — shuning uchun `if (y := f(x)) is not None:` deb qavs ishlating.",
    stopsEn: 'Nested comprehension `for` clauses read left-to-right identically to outer-to-inner `for` loops. Never nest 3+ levels; switch to a loop or helper function for readability.',
    objUz: ['Dict (`{k: v ...}`) va Set (`{x ...}`) comprehension larini yozish', 'Nested comprehension (`for row in m for x in row`) tartibini adashtirmaslik', 'Walrus operatori (`:=`) bilan takroriy hisoblashni yo‘qotish'],
    objEn: ['Build dict and set comprehensions cleanly', 'Flatten 2D collections with nested comprehensions in left-to-right loop order', 'Avoid duplicate function calls in filters using `:=`'],
    theoryUz: `### 1. Dict va Set Comprehensions
- Dict: \`{k: v for k, v in pairs}\`, lug‘at kalit-qiymatini almashtirish \`{v: k for k, v in d.items()}\`.
- Set: \`{w.lower() for w in words}\` — unikal qiymatlar.
### 2. Nested Comprehension Tartibi
\`[cell for row in grid for cell in row]\` — birinchi \`for\` tashqi, ikkinchi \`for\` ichki sikl!
### 3. Walrus Operatori (\`:=\`, Assignment Expression)
\`[y for x in data if (y := transform(x)) > 10]\` — \`transform(x)\` har elementda atigi **1 marta** chaqiriladi!
### 4. Qachon Oddiy \`for\` Afzal?
2 dan ortiq \`for\` yoki murakkab \`if/else\` bo‘lsa, comprehension emas oddiy \`for\` sikli yozing.`,
    theoryEn: `### 1. Dict & Set Comprehensions
Construct mappings and deduplicated sets directly without temporary lists.
### 2. Nested Flattening Order
\`[cell for row in matrix for cell in row]\` matches the exact top-to-bottom nesting order of regular \`for\` loops.
### 3. Walrus Operator (\`:=\`)
Bind and test an expensive computation once inside a comprehension filter or \`while (chunk := read()):\`.
### 4. Readability Limit
Stop at 1–2 clauses; complex multi-branch logic belongs in explicit loops.`,
    examples: [
      ex('Misol 1: Dict/Set comprehension va 2D flattening', 'Example 1: Dict, Set & Nested Flatten', `pairs = [("a", 1), ("b", 2), ("a", 1)]\ninverted = {v: k for k, v in pairs}\nunique_keys = sorted({k for k, _ in pairs})\nmatrix = [[1, 2], [3, 4]]\nflat = [x for row in matrix for x in row]\nprint(inverted, unique_keys, flat)`, `{1: 'a', 2: 'b'} ['a', 'b'] [1, 2, 3, 4]`, 'Dict, set va 2D tekislash bir qatordan aniq va ixcham.', 'Dict inversion, set deduplication, and nested flattening work cleanly.'),
      ex('Misol 2: Walrus `:=` bilan 2x chaqiruvni oldini olish', 'Example 2: Walrus Avoiding Duplicate Calls', `calls = 0\ndef heavy(n: int) -> int:\n    global calls\n    calls += 1\n    return n * 10\n\nres = [val for x in [1, 2, 3] if (val := heavy(x)) >= 20]\nprint("res:", res, "| calls:", calls)`, `res: [20, 30] | calls: 3`, '`heavy()` 3 ta element uchun faqat 3 marta (6 marta emas!) chaqirildi.', '`:=` caches `heavy(x)` so it executes once per element instead of twice.'),
      ex('Misol 3: `if/else` shartli qiymat transformatsiyasi', 'Example 3: Conditional Expression Inside Comprehension', `labels = ["even" if n % 2 == 0 else "odd" for n in range(4)]\nprint(labels)`, `['even', 'odd', 'even', 'odd']`, 'Transformatsiya uchun `if/else` `for` dan OLDIN, filtrlash uchun `if` `for` dan KEYIN yoziladi.', 'Ternary `if/else` sits before `for`; filtering `if` sits after `for`.'),
    ],
    traceTitleUz: 'Nested comprehension izi',
    traceTitleEn: 'Tracing Nested Flatten Order',
    traceCode: `m = [[1, 2], [3]]\nprint([x * 10 for row in m for x in row])`,
    traceSteps: [
      traceStep(1, 'row = [1, 2]', 'x=1, x=2', '1-qator elementlari', 'Iterated first row'),
      traceStep(2, 'row = [3]', 'x=3', '2-qator elementi', 'Iterated second row'),
      traceStep(3, 'print(...)', '[10, 20, 30]', 'Natija yig‘ildi', 'Printed [10, 20, 30]', '[10, 20, 30]'),
    ],
    commonMistakes: [
      mistake('Nested comprehension `for` tartibini teskari yozish', 'Reversing Nested for Clauses', `m = [[1, 2], [3, 4]]\ntry:\n    bad = [x for x in row for row in m]\nexcept NameError as e:\n    print("NameError:", e)`, 'NameError: name row is not defined', `m = [[1, 2], [3, 4]]\nprint([x for row in m for x in row])`, 'Tashqi sikl har doim chapda birinchi turishi shart!', 'The outer loop always comes first on the left.', 'Oddiy `for` yozish tartibini saqlang.', 'Keep outer-then-inner order.'),
      mistake('`{}` ni bo‘sh set deb o‘ylash', 'Confusing {} for an Empty Set', `x = {}\nprint(type(x).__name__)`, 'dict (not set!)', `s = set()\nprint(type(s).__name__)`, '`{}` bo‘sh dict yaratadi; bo‘sh set uchun `set()` kerak.', '`{}` creates an empty dict, not an empty set.', 'Bo‘sh to‘plam uchun `set()` yozing.', 'Use `set()` for an empty set.'),
    ],
    compareTitleUz: 'Comprehension vs Oddiy `for` Sikli',
    compareTitleEn: 'Comprehension vs Explicit Loop',
    compareUz: ['Comprehension: 1–2 bosqichli toza map/filter transformatsiyalar uchun.', 'Oddiy `for`: side-effect (`print`, DB yozish), 3+ shart yoki `try/except` kerak bo‘lganda.'],
    compareEn: ['Comprehension: clean 1–2 clause map/filter expressions.', 'Explicit loop: multi-branch logic, side effects, or error handling.'],
    compareSummaryUz: 'Dict/set comprehension va `:=` kodni ixchamlashtiradi, lekin 2 qavatdan oshsa oddiy `for` o‘qilishi osonroq.',
    compareSummaryEn: 'Use dict/set comprehensions and `:=` judiciously, switching to loops when nesting harms clarity.',
    practiceTasks: [
      pt('p1008_1', '1-mashq: Dict Comprehension', 'Task 1: Squares Dict', '1..4 sonlari uchun `{n: n*n}` lug‘atini tuzing.', 'Build squares dictionary.', `print({n: n * n for n in range(1, 5)})`, '{1: 1, 2: 4, 3: 9, 4: 16}', '{n: n*n for n in ...}', 'Prints dict.'),
      pt('p1008_2', '2-mashq: Set Comprehension', 'Task 2: Unique Word Lengths', '`["hi", "py", "oop"]` so‘zlari uzunliklari to‘plamini chiqaring.', 'Extract unique lengths.', `print(sorted({len(w) for w in ["hi", "py", "oop"]}))`, '[2, 3]', '{len(w) ...}', 'Prints [2, 3].'),
      pt('p1008_3', '3-mashq: 2D Matritsa tekislash', 'Task 3: Flatten Nested List', '`[[10], [20, 30]]` ni `[10, 20, 30]` ga tekislang.', 'Flatten 2D list.', `print([x for r in [[10], [20, 30]] for x in r])`, '[10, 20, 30]', 'for r in ... for x in r', 'Prints [10, 20, 30].'),
      pt('p1008_4', '4-mashq: Walrus `:=` bilan filter', 'Task 4: Walrus Filter', '`["a", "hello", "go"]` da uzunligi `>= 3` bo‘lgan so‘zlar uzunligini `:=` bilan oling.', 'Use := inside filter.', `words = ["a", "hello", "go"]\nprint([n for w in words if (n := len(w)) >= 3])`, '[5]', '(n := len(w)) >= 3', 'Prints [5].'),
      pt('p1008_5', '5-mashq: `if/else` transformatsiya', 'Task 5: Clamp Negatives', '`[-2, 5, -1]` dagi manfiylarni `0` ga almashtiring.', 'Clamp negative numbers to 0.', `print([x if x > 0 else 0 for x in [-2, 5, -1]])`, '[0, 5, 0]', 'x if x > 0 else 0', 'Prints [0, 5, 0].'),
    ],
    quiz: [
      q('q1008_1', 'Walrus operatori (`:=`) Python ning qaysi versiyasidan boshlab qo‘shilgan?', 'Which Python version introduced the walrus operator (`:=`)?', ['Python 3.5', 'Python 3.8', 'Python 3.12', 'Python 2.7'], ['Python 3.5', 'Python 3.8', 'Python 3.12', 'Python 2.7'], 1, 'Python 3.8 (PEP 572).', 'Python 3.8.'),
      q('q1008_2', '2D matritsani tekislashda qaysi yozuv to‘g‘ri?', 'Correct nested comprehension syntax to flatten `m`?', ['[x for x in r for r in m]', '[x for r in m for x in r]', '[r for r in m]', 'flatten(m)'], ['[x for x in r for r in m]', '[x for r in m for x in r]', '[r for r in m]', 'flatten(m)'], 1, 'Tashqi sikl chapda: `[x for r in m for x in r]`.', 'Outer loop first: `[x for r in m for x in r]`.'),
      q('q1008_3', 'Comprehension ichida `if/else` qiymatni o‘zgartirganda qayerga yoziladi?', 'Where does ternary `A if cond else B` sit inside a comprehension?', ['`for` dan keyin', '`for` dan oldin', 'Oxirida', 'Qavs tashqarisida'], ['After for', 'Before for', 'At end', 'Outside'], 1, '`for` dan oldin.', 'Before `for`.'),
      q('q1008_4', 'Walrus `:=` comprehension da qanday foyda beradi?', 'Primary use of `:=` inside a comprehension?', ['Fayl ochish', 'Bir marta hisoblangan qiymatni ham `if` da tekshirib, ham chiqishda qayta ishlatish', 'Async qilish', 'Class yaratish'], ['Open files', 'Compute once, test in `if`, and reuse in output', 'Async', 'Define classes'], 1, 'Takroriy hisoblashni oldini oladi.', 'Avoids recomputing an expression.'),
      q('q1008_5', '`{k: v for k, v in items}` qanday tur qaytaradi?', 'Return type of `{k: v for k, v in items}`?', ['set', 'dict', 'list', 'tuple'], ['set', 'dict', 'list', 'tuple'], 1, '`dict`.', '`dict`.'),
    ],
    homework: hw('Matn Indeksi va Inverted Index', 'Text Inverted Index Builder', 'Hujjatlar ro‘yxatidan dict va set comprehension hamda `:=` yordamida har bir so‘z qaysi hujjat ID larida uchrashini ko‘rsatuvchi `inverted_index` tuzing.', 'Build an inverted index `{word: {doc_ids}}` over sample documents using dict/set comprehensions and `:=`.', ['Dict va set comprehension ishlatilsin', 'Kamida 3 ta hujjat ustida test'], ['Use dict/set comprehensions', 'Verify on 3+ documents'], '{w: {d_id for ...} for w in vocab}', 'Build clean inverted index.', 'Stop-word larni chiqarib tashlang.', 'Filter common stop words.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-09',
    courseId: 'advanced_python',
    moduleId: 'c10_m3',
    order: 9,
    titleUz: 'Regular Expressions (`re`) — matn naqshlari va xavfsizligi',
    titleEn: 'Regular Expressions (re), Named Groups & ReDoS Safety',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-10-08'],
    conceptId: 'adv_regex',
    whyUz: "Log fayldan IP manzil va vaqtlarni ajratish, telefon raqam formatini tekshirish yoki matnni aqlli almashtirishda oddiy `.split()` ojiz qoladi. **`re` (Regular Expressions)** matn naqshlarini bir necha belgi bilan tavsiflaydi — lekin noto‘g‘ri regex **ReDoS** (CPU qotib qolishi) ga olib kelishi mumkin!",
    whyEn: 'Python’s `re` module handles structured text validation and extraction with raw strings, compiled patterns, and named capture groups—while requiring care against catastrophic backtracking (ReDoS).',
    analogyUz: "**Regex** — matn ichidan aynan kerakli shakldagi oltin donalarini (masalan `YYYY-MM-DD`) tutib oluvchi maxsus elak! Har doim **`r\"...\"` (raw string)** ishlating, aks holda `\\d` va `\\n` Python satr qoidasi bilan janjallashadi.",
    analogyEn: 'A regex is a precision stencil slid across text; always write patterns as raw strings (`r"..."`) so backslashes reach the regex engine intact.',
    stopsUz: "1) `re.match()` faqat satr **boshidan** tekshiradi, `re.search()` butun satr bo‘ylab birinchi moslikni topadi, `re.fullmatch()` esa butun satrni to‘liq tekshiradi (validatsiya uchun doim **`fullmatch`**!). 2) Ichma-ich takrorlovchi `(a+)+` kabi naqshlar **ReDoS** hujumiga ochiq — ulardan saqlaning!",
    stopsEn: 'Use `re.fullmatch()` (not `re.match()`) for input validation so trailing invalid chars aren’t ignored. Avoid nested quantifiers like `(a+)+` which cause exponential ReDoS backtracking.',
    objUz: ['`re.search`, `re.fullmatch`, `re.findall`, `re.sub` va `re.compile` ni to‘g‘ri tanlash', 'Named groups `(?P<year>\\d{4})` bilan tuzilgan ma’lumot olish', 'Raw strings (`r"\\d+"`), non-greedy (`*?`) va ReDoS xavfsizligini bilish'],
    objEn: ['Choose properly among `search`, `fullmatch`, `findall`, `sub`, and `compile`', 'Extract structured fields with named groups `(?P<name>...)`', 'Apply raw strings, lazy quantifiers (`*?`), and ReDoS-safe patterns'],
    theoryUz: `### 1. Asosiy Funksiyalar
- \`re.fullmatch(pat, s)\`: butun satr mos kelishi shart (email/telefon validatsiyasi).
- \`re.search(pat, s)\`: satr ichidan 1-uchragan moslikni topadi.
- \`re.findall(pat, s)\`: barcha mosliklar ro‘yxati.
- \`re.sub(pat, repl, s)\`: almashtirish.
### 2. Raw Strings (\`r"\\d+"\`)
Oddiy satrda \`\\b\` backspace bo‘ladi; \`r"\\b"\` esa regex so‘z chegarasi!
### 3. Named Groups (\`(?P<name>...)\`)
\`m.group("year")\` yoki \`m.groupdict()\` kodni raqamli \`m.group(1)\` dan ancha o‘qimli qiladi.
### 4. Greedy (\`.*\`) vs Non-Greedy (\`.*?\`)
\`<.*>\` birinchi \`<\` dan oxirgi \`>\` gacha yutadi; \`<.*?>\` esa eng yaqin \`>\` da to‘xtaydi!
### 5. ReDoS Xavfi
\`(a+)+b\` kabi ichma-ich \`+\`/\`*\` naqshlar noto‘g‘ri kirishda sekundlab CPU ni muzlatishi mumkin.`,
    theoryEn: `### 1. Core \`re\` Operations
\`fullmatch\` (validation), \`search\` (first occurrence), \`findall\` (all matches), \`sub\` (replace), and \`re.compile\` (reuse).
### 2. Raw Strings (\`r"..."\`)
Prevent Python string escaping from eating \`\\b\`, \`\\d\`, or \`\\s\`.
### 3. Named Capture Groups
\`(?P<key>...)\` + \`match.groupdict()\` make extractions self-documenting.
### 4. Greedy vs Lazy Quantifiers
\`.*?\` stops at the earliest closing delimiter instead of swallowing across tags.
### 5. Avoiding ReDoS
Never nest ambiguous quantifiers (\`(a+)+\`); prefer explicit character classes (\`[^>]+\`).`,
    examples: [
      ex('Misol 1: `re.compile` va Named Groups (`groupdict`)', 'Example 1: Named Groups with re.compile', `import re\n\nLOG_RE = re.compile(r"\\[(?P<level>INFO|ERR)\\]\\s+(?P<code_id>\\d+):\\s+(?P<msg>.+)")\nm = LOG_RE.fullmatch("[ERR] 503: Service down")\nif m:\n    print(m.groupdict())`, `{'level': 'ERR', 'code_id': '503', 'msg': 'Service down'}`, 'Named groups natijani tayyor lug‘at (`groupdict()`) sifatida qaytaradi.', 'Named capture groups produce clean self-labeled dictionaries via `.groupdict()`.'),
      ex('Misol 2: Greedy `.*` vs Non-Greedy `.*?`', 'Example 2: Greedy vs Non-Greedy Matching', `import re\n\nhtml = "<b>A</b><b>B</b>"\nprint("greedy:", re.findall(r"<b>.*</b>", html))\nprint("lazy:", re.findall(r"<b>.*?</b>", html))`, `greedy: ['<b>A</b><b>B</b>']\nlazy: ['<b>A</b>', '<b>B</b>']`, 'Lazy `*?` har bir tegni alohida ushlaydi.', 'Non-greedy `.*?` stops at the nearest closing tag.'),
      ex('Misol 3: `re.sub` bilan telefon raqamni maskalash', 'Example 3: Masking Digits with re.sub', `import re\n\ntext = "Call +998-90-123-45-67 now"\nmasked = re.sub(r"\\d{2}-\\d{2}$", "**-**", text.replace(" now", ""))\nprint(re.sub(r"\\d(?=-\\d{2}-\\d{2}|\\d-)", "*", "998901234567")[-4:], "|", re.sub(r"\\b\\d{4}\\b", "****", "Pin 1234 ok"))`, `4567 | Pin **** ok`, '`re.sub()` naqshga mos qismlarni avtomatik almashtiradi.', '`re.sub()` performs pattern-based redaction cleanly.'),
    ],
    traceTitleUz: '`search` vs `fullmatch` izi',
    traceTitleEn: 'Tracing match vs fullmatch',
    traceCode: `import re\ns = "123abc"\nprint(bool(re.match(r"\\d+", s)), bool(re.fullmatch(r"\\d+", s)))`,
    traceSteps: [
      traceStep(1, 're.match(r"\\d+", s)', 'Match("123")', 'Boshi mos kelgani uchun True!', 'Matched prefix "123"'),
      traceStep(2, 're.fullmatch(r"\\d+", s)', 'None', 'Oxirida "abc" bor -> False!', 'Rejected trailing "abc"'),
      traceStep(3, 'print(...)', 'True False', 'Validatsiyada fullmatch shart!', 'Printed True False', 'True False'),
    ],
    commonMistakes: [
      mistake('Validatsiya uchun `re.match()` ishlatish', 'Using re.match() Instead of re.fullmatch()', `import re\n# Bad: re.match allows trailing garbage!\nprint("match:", bool(re.match(r"\\d{4}", "2026_hack")))\nprint("fullmatch:", bool(re.fullmatch(r"\\d{4}", "2026_hack")))`, 're.match returns True for "2026_hack"!', `import re\nprint("Validated:", bool(re.fullmatch(r"\\d{4}", "2026")))`, '`re.match()` satr boshini tekshiradi xolos, dumini eʼtiborsiz qoldiradi!', '`re.match()` only anchors at the start, allowing invalid trailing characters.', 'Validatsiyada doim `re.fullmatch()` yozing.', 'Always use `re.fullmatch()` for input validation.'),
      mistake('Oddiy HTML ni katta regex bilan parse qilishga urinish', 'Parsing Complex Nested HTML with Regex', `# Regex cannot cleanly handle nested tags!`, 'Fragile breaks on attributes/nesting', `print("Use html.parser or BeautifulSoup for HTML, regex for flat tokens!")`, 'Ichma-ich HTML/JSON uchun regex emas, parser ishlatiladi.', 'Nested grammars exceed regular expressions.', 'HTML uchun `html.parser`/BeautifulSoup ishlating.', 'Use an HTML parser for HTML documents.'),
    ],
    compareTitleUz: '`str` Metodlari vs `re` Regex',
    compareTitleEn: '`str` Methods vs `re`',
    compareUz: ['`str` (`.startswith`, `.split`, `in`): oddiy qatʼiy qismlar uchun tezroq va sodda.', '`re`: murakkab shakl, naqsh ajratish (`groupdict`), format tekshirish (`fullmatch`) uchun.'],
    compareEn: ['`str` methods: faster and clearer for literal substring checks and fixed splits.', '`re`: indispensable for pattern validation and structured token extraction.'],
    compareSummaryUz: 'Oddiy holatlarda `str` metodlari, naqshli matnda esa `r"..."` + `re.compile` + `re.fullmatch` ishlating.',
    compareSummaryEn: 'Reach for `str` methods first; use raw-string `re.fullmatch` and named groups for pattern extraction.',
    practiceTasks: [
      pt('p1009_1', '1-mashq: `re.fullmatch` validatsiyasi', 'Task 1: Validate PIN', 'Aniq 4 ta raqamli PIN (`r"\\d{4}"`) ni `fullmatch` bilan tekshiring.', 'Check 4-digit PIN.', `import re\nprint(bool(re.fullmatch(r"\\d{4}", "1234")), bool(re.fullmatch(r"\\d{4}", "1234a")))`, 'True False', 're.fullmatch(r"\\d{4}", s)', 'Prints True False.'),
      pt('p1009_2', '2-mashq: `re.findall` raqamlar', 'Task 2: Extract Numbers', '`r"\\d+"` bilan `"a12 b345 c6"` dan barcha sonlarni oling.', 'Find all integer tokens.', `import re\nprint(re.findall(r"\\d+", "a12 b345 c6"))`, "['12', '345', '6']", 're.findall(r"\\d+", s)', "Prints ['12', '345', '6']."),
      pt('p1009_3', '3-mashq: Named group `groupdict`', 'Task 3: Parse Key=Value', '`r"(?P<k>[a-z]+)=(?P<v>\\d+)"` bilan `"port=8080"` ni ajrating.', 'Extract k and v.', `import re\nm = re.fullmatch(r"(?P<k>[a-z]+)=(?P<v>\\d+)", "port=8080")\nprint(m.groupdict())`, "{'k': 'port', 'v': '8080'}", '(?P<k>...)', 'Prints dict.'),
      pt('p1009_4', '4-mashq: Non-greedy `.*?`', 'Task 4: Non-Greedy Quotes', "`'\"a\" \"b\"'` dan har bir qo‘shtirnoq ichini alohida ajrating.", 'Match shortest quoted spans.', `import re\nprint(re.findall(r'"(.*?)"', '"a" "b"'))`, "['a', 'b']", 'Use .*? inside quotes', "Prints ['a', 'b']."),
      pt('p1009_5', '5-mashq: `re.sub` tozalash', 'Task 5: Collapse Spaces', '`r"\\s+"` bilan `"a   b\\tc"` ni bitta bo‘shliqqa birlashtiring.', 'Normalize whitespace.', `import re\nprint(re.sub(r"\\s+", " ", "a   b\\tc"))`, 'a b c', 're.sub(r"\\s+", " ", s)', 'Prints a b c.'),
    ],
    quiz: [
      q('q1009_1', 'Foydalanuvchi kiritgan email yoki ID ni to‘liq tekshirishda qaysi funksiya eng xavfsiz?', 'Safest `re` function for full-input validation?', ['re.match()', 're.search()', 're.fullmatch()', 're.findall()'], ['re.match()', 're.search()', 're.fullmatch()', 're.findall()'], 2, '`re.fullmatch()` satr boshidan oxirigacha moslikni talab qiladi.', '`re.fullmatch()` anchors both start and end.'),
      q('q1009_2', 'Regex naqshlarini nega `r"..."` (raw string) da yozish tavsiya etiladi?', 'Why write regex patterns as raw strings (`r"..."`)?', ['Tezroq ishlaydi', 'Python backslash (`\\d`, `\\b`) larni o‘zgartirib yubormasligi uchun', 'Majburiy sintaksis', 'Unicode qo‘shadi'], ['Faster', 'So Python does not interpret backslashes before the regex engine', 'Mandatory syntax', 'Adds Unicode'], 1, 'Backslash lar buzilmasligi uchun.', 'Preserves literal backslashes.'),
      q('q1009_3', '`r"<.*?>"` va `r"<.*>"` orasidagi farq nima?', 'Difference between `r"<.*?>"` and `r"<.*>"`?', ['Farqi yo‘q', '`*?` non-greedy (eng qisqa moslik), `*` greedy (eng uzun)', '`*?` xato', '`*` faqat raqam'], ['None', '`*?` is non-greedy (shortest), `*` is greedy (longest)', 'Error', 'Digits only'], 1, '`*?` eng qisqa moslikni ushlaydi.', 'Non-greedy matches minimal span.'),
      q('q1009_4', 'ReDoS (Regular Expression Denial of Service) nimadan kelib chiqadi?', 'What triggers catastrophic backtracking (ReDoS)?', ['Oddiy harflar', 'Ichma-ich takrorlanuvchi noaniq kvantifikatorlar (`(a+)+`)', '`re.compile()`', 'Raw string'], ['Plain literals', 'Nested ambiguous quantifiers like `(a+)+`', '`re.compile()`', 'Raw strings'], 1, 'Ichma-ich kvantifikatorlar eksponensial tekshiruv yaratadi.', 'Nested quantifiers cause exponential backtracking.'),
      q('q1009_5', '`(?P<year>\\d{4})` nomlangan guruh qiymatini olish usuli?', 'How do you access a named group `(?P<year>...)` on a match `m`?', ['m.year', 'm.group("year")', 'm["year"] only', 'm.find("year")'], ['m.year', 'm.group("year")', 'm["year"] only', 'm.find("year")'], 1, '`m.group("year")` (shuningdek `m.groupdict()`).', '`m.group("year")`.'),
    ],
    homework: hw('Log Parser va Masker', 'Structured Log Extractor & Redactor', 'Ko‘p qatorli server logidan `re.compile` va named groups yordamida `timestamp`, `level`, `ip` ni ajratib olib, maxfiy tokenlarni `re.sub` bilan `***` ga maskalaydigan funksiya yozing.', 'Parse multi-line server logs using compiled named-group regexes and redact `token=...` secrets with `re.sub`.', ['re.compile + re.finditer', 'Named groups + token redaction'], ['Use compiled patterns and named groups', 'Redact secrets safely'], 'for m in PAT.finditer(text): rows.append(m.groupdict())', 'Use finditer().', 'Sana formatini validatsiya qiluvchi `fullmatch` ham qo‘shing.', 'Add strict date validation.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-10',
    courseId: 'advanced_python',
    moduleId: 'c10_m3',
    order: 10,
    titleUz: 'map, filter, zip(strict=True), enumerate va Review #22',
    titleEn: 'Functional Built-ins: map, filter, zip(strict=True) & enumerate (+ Review #22)',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-10-09'],
    conceptId: 'adv_builtins_functional',
    whyUz: "Ikki ro‘yxatni parallel aylantirishda `for i in range(len(a)):` yozish C-uslubidagi qo‘pol koddir — bundan tashqari uzunliklar farq qilsa jim xato yuz beradi! Python ning **`enumerate()`**, **`zip(..., strict=True)`**, **`map()`** va **`filter()`** vositalari esa toza, dangasa (lazy) va xavfsiz!",
    whyEn: 'Replace error-prone index loops with idiomatic `enumerate(start=...)`, `zip(..., strict=True)` length checks, and lazy `map`/`filter` compositions.',
    analogyUz: "**`enumerate()`** — ro‘yxatga avtomatik tartib raqami yopishtiruvchi stiker apparati. **`zip(..., strict=True)`** — ikki fermuar tishlarini bog‘lovchi qulf: bitta tish ortib qolsa jim kesib tashlamay, darhol `ValueError` bilan ogohlantiradi!",
    analogyEn: '`enumerate()` stamps indices automatically; `zip(..., strict=True)` pairs two streams side by side and refuses to silently drop leftover elements.',
    stopsUz: "Python 3.10+ da **`zip(a, b, strict=True)`** dan foydalaning — oddiy `zip(a, b)` qisqa ro‘yxat tugashi bilan qolgan ma’lumotni **jim tashlab ketadi**! Ko‘p transformatsiyalarda `[fn(x) for x in xs]` comprehension `map(lambda ...)` dan ko‘ra o‘qimliroq; `map(str, xs)` esa tayyor funksiya nomi bilan juda toza.",
    stopsEn: 'Plain `zip(a, b)` silently truncates to the shortest sequence—use `zip(a, b, strict=True)` (Python 3.10+) whenever lengths must match. Prefer comprehensions over `map(lambda ...)`.',
    objUz: ['`enumerate(seq, start=1)` bilan indeks + elementni toza olish', '`zip(a, b, strict=True)` va `zip(*pairs)` (unzip) bilan parallel ishlash', '`map` / `filter` vs Comprehension qachon qaysi biri toza ekanini tanlash'],
    objEn: ['Iterate index+value cleanly with `enumerate(..., start=1)`', 'Guard length mismatches using `zip(..., strict=True)` and unzip via `zip(*rows)`', 'Compare lazy `map`/`filter` against comprehensions'],
    theoryUz: `### 1. \`enumerate(iterable, start=0)\`
\`range(len(xs))\` o‘rniga doim \`for idx, item in enumerate(xs, start=1):\` yozing.
### 2. \`zip(a, b, strict=True)\`
Oddiy \`zip([1, 2, 3], ["a"])\` -> \`[(1, "a")]\` (2 va 3 jim yo‘qoladi!). \`strict=True\` esa uzunliklar teng bo‘lmasa darhol \`ValueError\` chiqaradi.
### 3. \`zip(*matrix)\` — Unzip va Transpozitsiya
\`list(zip(*[(1, "a"), (2, "b")]))\` -> \`[(1, 2), ("a", "b")]\`.
### 4. \`map(fn, iter)\` va \`filter(pred, iter)\`
Ikkalasi ham **single-pass iterator** qaytaradi! Tayyor funksiya (\`map(int, strs)\`, \`filter(None, items)\`) bilan juda qulay; \`lambda\` kerak bo‘lsa comprehension o‘qishga osonroq.
### 5. \`any()\` va \`all()\`
Qisqa tutashuvli (short-circuiting) mantiqiy qisqartmalar.`,
    theoryEn: `### 1. Idiomatic \`enumerate(seq, start=1)\`
Never index manually with \`range(len(seq))\`.
### 2. Safe \`zip(..., strict=True)\`
Catch mismatched parallel inputs immediately with \`ValueError\` instead of silent truncation.
### 3. Matrix Transpose / Unzip via \`zip(*rows)\`
Unpack rows into columns effortlessly.
### 4. \`map\` & \`filter\`
Both return lazy single-pass iterators; great with named functions (\`map(int, tokens)\`, \`filter(None, lines)\`).
### 5. \`any()\` and \`all()\`
Short-circuiting boolean quantifiers over any iterable.`,
    examples: [
      ex('Misol 1: `enumerate(start=1)` va `zip(..., strict=True)`', 'Example 1: enumerate & zip(strict=True)', `names = ["Ali", "Vali"]\nscores = [95, 88]\nfor rank, (name, score) in enumerate(zip(names, scores, strict=True), start=1):\n    print(f"#{rank} {name}: {score}")`, `#1 Ali: 95\n#2 Vali: 88`, '`enumerate` va `zip(strict=True)` birga indekslarni ham, juftlik xavfsizligini ham beradi.', 'Combining `enumerate(start=1)` and `zip(..., strict=True)` stays concise and bug-proof.'),
      ex('Misol 2: `zip(*pairs)` unzip va `strict=True` xato tutishi', 'Example 2: Unzipping & Length Guard', `pairs = [("py", 1), ("sql", 2)]\nlangs, nums = zip(*pairs)\nprint(langs, nums)\ntry:\n    list(zip([1, 2], ["a"], strict=True))\nexcept ValueError:\n    print("Length mismatch caught!")`, `('py', 'sql') (1, 2)\nLength mismatch caught!`, '`zip(*pairs)` ustunlarga ajratadi, `strict=True` esa uzunlik xatosini ushlaydi.', '`zip(*pairs)` transposes tuples while `strict=True` detects unequal lengths.'),
      ex('Misol 3: `map(int, ...)` va `filter(None, ...)`', 'Example 3: Clean map & filter with Built-ins', `raw = [" 10", "", "25 ", ""]\nnums = list(map(int, filter(None, map(str.strip, raw))))\nprint(nums)`, `[10, 25]`, 'Nomlangan funksiyalar bilan `map`/`filter` lambda siz juda toza oqim tuzadi.', '`filter(None, ...)` drops empty strings before `map(int, ...)` parses numbers.'),
    ],
    traceTitleUz: '`zip(strict=True)` va `enumerate` izi',
    traceTitleEn: 'Tracing zip & enumerate',
    traceCode: `for i, (k, v) in enumerate(zip(["x", "y"], [10, 20], strict=True), 1):\n    print(i, k, v)`,
    traceSteps: [
      traceStep(1, 'i=1, (k, v)=("x", 10)', '1 x 10', '1-juftlik raqamlandi', 'Yielded rank 1 pair', '1 x 10'),
      traceStep(2, 'i=2, (k, v)=("y", 20)', '2 y 20', '2-juftlik raqamlandi', 'Yielded rank 2 pair', '2 y 20'),
    ],
    commonMistakes: [
      mistake('Uzunligi turlicha ro‘yxatlarni oddiy `zip()` bilan jim kesib tashlash', 'Silent Truncation with Non-Strict zip()', `ids = [1, 2, 3]\nusers = ["Ali", "Vali"]\nprint(dict(zip(ids, users)))  # ID 3 quietly vanished!`, "{1: 'Ali', 2: 'Vali'} — silent data loss!", `ids = [1, 2, 3]\nusers = ["Ali", "Vali"]\ntry:\n    dict(zip(ids, users, strict=True))\nexcept ValueError:\n    print("Stopped silent data loss!")`, 'Oddiy `zip` 3-elementni ogohlantirmasdan tashlab ketadi.', 'Default `zip` silently drops trailing elements of longer iterables.', 'Doim `strict=True` qo‘shing (Python 3.10+).', 'Pass `strict=True` when equal lengths are expected.'),
      mistake('`range(len(xs))` bilan qo‘lda indekslash', 'Manual range(len(xs)) Indexing', `xs = ["a", "b"]\nfor i in range(len(xs)):\n    print(i, xs[i])`, 'Verbose C-style indexing', `xs = ["a", "b"]\nfor i, val in enumerate(xs):\n    print(i, val)`, '`enumerate()` har qanday iterable da ishlaydi (hatto `len()` bo‘lmagan generatorlarda ham!).', '`enumerate()` is cleaner and works even on generators without `len()`.', 'Doim `enumerate()` ishlating.', 'Use `enumerate()`.'),
    ],
    compareTitleUz: '`map(fn, xs)` / `filter` vs Comprehension',
    compareTitleEn: '`map`/`filter` vs Comprehension',
    compareUz: ['`map(int, xs)` / `filter(None, xs)`: tayyor funksiya nomi bo‘lganda eng toza.', '`[fn(x) for x in xs if cond]`: lambda yozishga to‘g‘ri kelganda ancha ravshanroq.'],
    compareEn: ['`map`/`filter`: crisp when passing an existing function like `int` or `str.strip`.', 'Comprehension: cleaner whenever an inline `lambda` would otherwise be needed.'],
    compareSummaryUz: 'Parallel sikllarda `zip(..., strict=True)`, tartiblashda `enumerate(..., start=1)`, tozalashda esa `filter(None, ...)` ishlating.',
    compareSummaryEn: 'Favor `zip(..., strict=True)`, `enumerate()`, and `filter(None, ...)` for expressive, bug-resistant iteration.',
    practiceTasks: [
      pt('p1010_1', '1-mashq: `enumerate(start=1)`', 'Task 1: 1-Based Menu', '`["Home", "Docs"]` ni `"1:Home 2:Docs"` qilib chiqaring.', 'Format 1-based menu.', `print(" ".join(f"{i}:{s}" for i, s in enumerate(["Home", "Docs"], 1)))`, '1:Home 2:Docs', 'enumerate(..., 1)', 'Prints 1:Home 2:Docs.'),
      pt('p1010_2', '2-mashq: `zip(..., strict=True)`', 'Task 2: Strict Zip Guard', 'Teng bo‘lmagan `[1, 2]` va `["a"]` da `ValueError` tuting.', 'Catch strict ValueError.', `try:\n    list(zip([1, 2], ["a"], strict=True))\nexcept ValueError:\n    print("mismatch")`, 'mismatch', 'strict=True', 'Prints mismatch.'),
      pt('p1010_3', '3-mashq: `zip(*m)` Transpozitsiya', 'Task 3: Transpose Rows', '`[(1, 2), (3, 4)]` ustunlarini `[(1, 3), (2, 4)]` ga o‘giring.', 'Transpose with zip(*m).', `print(list(zip(*[(1, 2), (3, 4)])))`, '[(1, 3), (2, 4)]', 'zip(*matrix)', 'Prints transposed tuples.'),
      pt('p1010_4', '4-mashq: `filter(None, ...)`', 'Task 4: Filter Truthy Values', '`[0, "py", "", None, 5]` dan falsy qiymatlarni tozalang.', 'Use filter(None, items).', `print(list(filter(None, [0, "py", "", None, 5])))`, "['py', 5]", 'filter(None, ...)', "Prints ['py', 5]."),
      pt('p1010_5', '5-mashq: `map(int, ...)`', 'Task 5: Parse CSV Numbers', '`"4,8,15".split(",")` ni `map(int, ...)` bilan yig‘indisini oling.', 'Sum parsed integers.', `print(sum(map(int, "4,8,15".split(","))))`, '27', 'sum(map(int, ...))', 'Prints 27.'),
    ],
    quiz: [
      q('q1010_1', 'Python 3.10+ da `zip(a, b, strict=True)` uzunliklar teng bo‘lmasa nima qiladi?', 'What does `zip(a, b, strict=True)` do on unequal lengths?', ['Kesib tashlaydi', 'ValueError chiqaradi', 'None to‘ldiradi', 'Takrorlaydi'], ['Truncates', 'Raises ValueError', 'Pads None', 'Repeats'], 1, 'Darhol `ValueError` ko‘taradi.', 'Raises `ValueError`.'),
      q('q1010_2', '`enumerate(items, start=1)` da birinchi element indeksi nechadan boshlanadi?', 'Starting index in `enumerate(items, start=1)`?', ['0', '1', '-1', 'None'], ['0', '1', '-1', 'None'], 1, '`1` dan.', '`1`.'),
      q('q1010_3', '`filter(None, [0, "", "ok", 3])` natijasi?', 'Result of `list(filter(None, [0, "", "ok", 3]))`?', ['[0, ""]', '["ok", 3]', '[None]', 'Error'], ['[0, ""]', '["ok", 3]', '[None]', 'Error'], 1, 'Faqat truthy elementlar: `["ok", 3]`.', 'Keeps truthy elements `["ok", 3]`.'),
      q('q1010_4', '2D ro‘yxat ustunlarini ajratish (`unzip`) uchun qaysi sintaksis ishlatiladi?', 'Idiomatic Python expression to unzip/transpose `rows`?', ['zip(rows)', 'zip(*rows)', 'unzip(rows)', 'map(rows)'], ['zip(rows)', 'zip(*rows)', 'unzip(rows)', 'map(rows)'], 1, '`zip(*rows)`.', '`zip(*rows)`.'),
      q('q1010_5', '`map()` va `filter()` qanday obyekt qaytaradi?', 'What do `map()` and `filter()` return?', ['List', 'Lazy single-pass iterator', 'Tuple', 'Set'], ['List', 'Lazy single-pass iterator', 'Tuple', 'Set'], 1, 'Lazy single-pass iterator.', 'Lazy iterator.'),
    ],
    homework: hw('CSV Ustun Aggregatori', 'Strict Columnar Zip Analyzer', 'Ustun sarlavhalari (`headers`) va ma’lumot qatorlarini (`rows`) `zip(..., strict=True)` bilan birlashtirib `dict` larni yaratuvchi va `map`/`filter` bilan raqamlarni tozalovchi parser yozing.', 'Zip headers and rows with `strict=True`, drop blanks with `filter(None, ...)`, and compute per-column averages.', ['zip(strict=True) bilan qator/ustun soni nazorati', 'Hech qanday range(len(...)) ishlatilmasin'], ['Enforce matching row lengths with strict=True', 'No range(len()) loops'], 'records = [dict(zip(headers, r, strict=True)) for r in rows]', 'Combine strict zip with dict().', 'Transpozitsiya (`zip(*rows)`) bilan ustun summalarini chiqaring.', 'Compute column totals via `zip(*rows)`.', 25),
    reviewCheckpoint: review(
      22,
      'Review Loyiha #22: Regex + Strict Zip Ma’lumot Tozalagich (110-dars Marrasi!)',
      'Review Project #22: Regex + Functional Data Cleaner',
      '110-dars marrasi! Comprehensions (`:=`), Regex (`re.compile`, `groupdict`) va `zip(strict=True)` ni birlashtirib, xom matnli hisobotdan tuzilgan rekordlar yig‘ib chiqing.',
      '110-lesson milestone! Combine `re.compile` named groups, walrus comprehension filtering, and `zip(..., strict=True)` into a clean data parser.',
      ['`re.compile` + named groups bilan satrlarni ajratish', 'Walrus `:=` bilan faqat yaroqli satrlarni olish', '`enumerate(..., 1)` va `zip(..., strict=True)` bilan hisobot tuzish'],
      ['Compiled regex extraction', 'Walrus comprehension filtering', 'Strict zipped summary output'],
      `import re

PAT = re.compile(r"(?P<user>[a-z]+):(?P<score>\\d+)")
lines = ["ali:90", "invalid", "vali:85"]
parsed = [m.groupdict() for s in lines if (m := PAT.fullmatch(s))]
names = [p["user"] for p in parsed]
scores = list(map(int, (p["score"] for p in parsed)))
for rank, (n, sc) in enumerate(zip(names, scores, strict=True), 1):
    print(f"{rank}. {n} -> {sc}")
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-11',
    courseId: 'advanced_python',
    moduleId: 'c10_m4',
    order: 11,
    titleUz: 'collections, itertools va functools — Standart Kuch Asboblari',
    titleEn: 'Power Stdlib Modules: collections, itertools & functools',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-10-10'],
    conceptId: 'adv_stdlib_power',
    whyUz: "Har safar ikki uchidan tezkor navbat (`deque`), avtomatik sanagich (`Counter`), kombinatsiyalar (`itertools`) yoki funksiya keshlash (`@lru_cache`) ni noldan yozish — g‘ildirakni qayta ixtiro qilishdir! **`collections`**, **`itertools`** va **`functools`** C tilida yozilgan tayyor va chaqqon vositalardir.",
    whyEn: 'Replace manual queues, counters, combinations, and memoization boilerplate with C-accelerated tools from `collections`, `itertools`, and `functools`.',
    analogyUz: "Bu uch modul — ustaning **elektr asboblar qutisi**: `deque` ikki eshikli tez poyezd, `Counter` avtomatik sanoq mashinasi, `itertools.groupby` saralangan arxiv bo‘luvchi, `@lru_cache` esa kalkulyator xotirasi!",
    analogyEn: '`collections` gives optimal data containers, `itertools` builds lazy combinatoric streams, and `functools` transforms and caches functions.',
    stopsUz: "Juda muhim tuzoq: **`itertools.groupby(data, key)` faqat KETMA-KET bir xil kalitlarni guruhlaydi!** Shuning uchun `groupby` dan oldin albatta **`sorted(data, key=key)`** qiling! Shuningdek `deque` boshi va oxiridan O(1) qo‘shadi/oladi (`list.pop(0)` esa O(n)).",
    stopsEn: '`itertools.groupby()` only groups **consecutive** matching keys—you MUST sort by the same key first! Use `collections.deque` whenever popping from the left (`popleft()` is O(1) vs `list.pop(0)` O(n)).',
    objUz: ['`collections.Counter`, `defaultdict`, `deque(maxlen=...)` dan foydalanish', '`itertools.chain`, `islice`, `product`, `combinations` va `groupby` (sorted bilan!) ni qo‘llash', '`functools.lru_cache` va `functools.partial` bilan kodni tezlatish va soddalashtirish'],
    objEn: ['Use `Counter`, `defaultdict`, and bounded `deque`', 'Chain lazy streams with `itertools` (remembering to pre-sort before `groupby`)', 'Accelerate pure functions with `@lru_cache` and bind args with `partial`'],
    theoryUz: `### 1. \`collections\` Xazinasi
- \`Counter(items)\`: \`most_common(n)\`, \`c1 + c2\`.
- \`defaultdict(list)\`: kalit bo‘lmasa avtomatik bo‘sh ro‘yxat ochadi.
- \`deque(maxlen=3)\`: har ikki uchidan O(1) qo‘shish/olish va cheklangan bufer!
### 2. \`itertools\` Kombinatorikasi
- \`chain.from_iterable(nested)\`, \`islice(gen, n)\`, \`product\`, \`combinations\`.
- \`groupby(sorted_data, key=...)\`: **oldindan saralash shart!**
### 3. \`functools\` Asboblari
- \`@lru_cache(maxsize=128)\` (yoki \`@cache\`): sof funksiyalarni memoizatsiya qiladi (argumentlar hashable bo‘lishi kerak!).
- \`partial(fn, fixed_arg)\`: qisman bog‘langan funksiya yaratadi.`,
    theoryEn: `### 1. \`collections\` Containers
\`Counter\`, \`defaultdict\`, and \`deque(maxlen=...)\` (O(1) \`appendleft\` / \`popleft\`).
### 2. \`itertools\` Streams
\`chain\`, \`islice\`, \`combinations\`, \`product\`, and \`groupby\` (requires sorting by key first).
### 3. \`functools\` Utilities
\`@lru_cache(maxsize=...)\` for memoization (hashable args only) and \`partial()\` for pre-binding arguments.`,
    examples: [
      ex('Misol 1: `Counter`, `defaultdict` va `deque(maxlen=3)`', 'Example 1: Counter, defaultdict & deque', `from collections import Counter, defaultdict, deque\n\nfreq = Counter("abracadabra").most_common(2)\ngroups = defaultdict(list)\nfor k, v in [("uz", "Toshkent"), ("uz", "Samarqand"), ("uk", "London")]:\n    groups[k].append(v)\nrecent = deque(maxlen=3)\nfor i in range(5): recent.append(i)\nprint(freq, dict(groups), list(recent))`, `[('a', 5), ('b', 2)] {'uz': ['Toshkent', 'Samarqand'], 'uk': ['London']} [2, 3, 4]`, '`deque(maxlen=3)` avtomatik ravishda faqat oxirgi 3 elementni saqlaydi.', 'Bounded `deque(maxlen=3)` forms an O(1) sliding window buffer automatically.'),
      ex('Misol 2: `itertools.groupby` (pre-sorted!) va `combinations`', 'Example 2: Pre-Sorted groupby & combinations', `from itertools import combinations, groupby\n\nitems = sorted([("b", 2), ("a", 1), ("a", 3)], key=lambda x: x[0])\ngrouped = {k: [v for _, v in grp] for k, grp in groupby(items, key=lambda x: x[0])}\nprint(grouped, list(combinations(["A", "B", "C"], 2)))`, `{'a': [1, 3], 'b': [2]} [('A', 'B'), ('A', 'C'), ('B', 'C')]`, 'Oldindan saralangani uchun `groupby` barcha `"a"` larni bitta guruhga jamladi.', 'Sorting first ensures `groupby` merges all matching keys together.'),
      ex('Misol 3: `@lru_cache` va `partial`', 'Example 3: Memoization & partial', `from functools import lru_cache, partial\n\n@lru_cache(maxsize=64)\ndef fib(n: int) -> int:\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nbase2 = partial(int, base=2)\nprint("fib(30):", fib(30), "| hits > 0:", fib.cache_info().hits > 0, "| bin:", base2("1010"))`, `fib(30): 832040 | hits > 0: True | bin: 10`, '`@lru_cache` eksponensial Fibonacci ni O(n) ga aylantirdi; `partial` esa `base=2` ni oldindan bog‘ladi.', '`@lru_cache` speeds up overlapping subproblems; `partial` fixes keyword defaults.'),
    ],
    traceTitleUz: '`deque(maxlen=2)` izi',
    traceTitleEn: 'Tracing Bounded Deque',
    traceCode: `from collections import deque\nd = deque([1, 2], maxlen=2)\nd.append(3)\nprint(d.popleft(), list(d))`,
    traceSteps: [
      traceStep(1, 'd = deque([1, 2], maxlen=2)', '[1, 2]', '2 ta joy band', 'Full capacity 2'),
      traceStep(2, 'd.append(3)', '[2, 3]', '1 avtomatik chiqib ketdi', 'Evicted 1 from left'),
      traceStep(3, 'd.popleft()', '2, [3]', 'O(1) chapdan olish', 'Popped 2 in O(1)', '2 [3]'),
    ],
    commonMistakes: [
      mistake('`itertools.groupby` dan oldin `sorted()` qilmaslik', 'Calling groupby Without Sorting First', `from itertools import groupby\ndata = ["a1", "b1", "a2"]\nprint([(k, list(g)) for k, g in groupby(data, key=lambda s: s[0])])`, "[('a', ['a1']), ('b', ['b1']), ('a', ['a2'])] — split into 2 'a' groups!", `from itertools import groupby\ndata = sorted(["a1", "b1", "a2"], key=lambda s: s[0])\nprint([(k, list(g)) for k, g in groupby(data, key=lambda s: s[0])])`, '`groupby` faqat qo‘shni bir xil kalitlarni birlashtiradi.', '`groupby` only merges adjacent matching keys.', 'Oldin `sorted(..., key=...)` qiling!', 'Always sort by the exact same key first.'),
      mistake('`@lru_cache` ga `list` kabi unhashable argument berish', 'Passing Unhashable List to @lru_cache', `from functools import lru_cache\n@lru_cache\ndef total(xs): return sum(xs)\ntry:\n    total([1, 2])\nexcept TypeError as e:\n    print("TypeError:", e)`, 'TypeError: unhashable type: list', `from functools import lru_cache\n@lru_cache\ndef total(xs: tuple): return sum(xs)\nprint(total((1, 2)))`, 'Kesh kaliti sifatida lug‘atga faqat hashable (`tuple`, `int`, `str`) qabul qilinadi.', 'LRU cache keys require hashable arguments.', '`tuple` dan foydalaning.', 'Pass immutable `tuple`s instead of lists.'),
    ],
    compareTitleUz: '`list` vs `collections.deque`',
    compareTitleEn: '`list` vs `collections.deque`',
    compareUz: ['`list`: indeks bo‘yicha tasodifiy kirish `xs[i]` O(1), lekin `.pop(0)` O(n) sekin.', '`deque`: `appendleft()` / `popleft()` O(1) tez va `maxlen` cheklovi bor (navbatlar uchun ideal).'],
    compareEn: ['`list`: O(1) random indexing `xs[i]`, slow O(n) left pops.', '`deque`: O(1) head/tail queues and sliding windows (`maxlen`).'],
    compareSummaryUz: 'Hisoblashda `Counter`, guruhlashda `defaultdict(list)`, navbatda `deque`, keshlashda `@lru_cache` ishlating.',
    compareSummaryEn: 'Use `Counter`, `defaultdict`, `deque`, sorted `groupby`, and `@lru_cache` to write faster, cleaner stdlib Python.',
    practiceTasks: [
      pt('p1011_1', '1-mashq: `Counter.most_common`', 'Task 1: Top Word Count', '`["py", "go", "py"]` da eng ko‘p uchragan 1 ta elementni chiqaring.', 'Find top 1 item.', `from collections import Counter\nprint(Counter(["py", "go", "py"]).most_common(1))`, "[('py', 2)]", 'Counter(...).most_common(1)', "Prints [('py', 2)]."),
      pt('p1011_2', '2-mashq: `deque(maxlen=2)`', 'Task 2: Bounded History', '`deque(maxlen=2)` ga 10, 20, 30 qo‘shib ro‘yxatini chiqaring.', 'Verify eviction at maxlen=2.', `from collections import deque\nd = deque(maxlen=2)\nfor x in (10, 20, 30): d.append(x)\nprint(list(d))`, '[20, 30]', 'deque(maxlen=2)', 'Prints [20, 30].'),
      pt('p1011_3', '3-mashq: `itertools.chain`', 'Task 3: Chain Iterables', '`chain([1, 2], (3, 4))` ni ro‘yxatga aylantiring.', 'Flatten two sequences.', `from itertools import chain\nprint(list(chain([1, 2], (3, 4))))`, '[1, 2, 3, 4]', 'itertools.chain', 'Prints [1, 2, 3, 4].'),
      pt('p1011_4', '4-mashq: `@lru_cache`', 'Task 4: Cached Power', '`@lru_cache(maxsize=16)` bilan funksiya yozib `cache_info().currsize` chiqaring.', 'Inspect cache_info().', `from functools import lru_cache\n@lru_cache(maxsize=16)\ndef sq(x): return x * x\nsq(4); sq(4)\nprint(sq.cache_info().hits, sq.cache_info().currsize)`, '1 1', 'sq(4) twice gives 1 hit', 'Prints 1 1.'),
      pt('p1011_5', '5-mashq: `functools.partial`', 'Task 5: Partial Function', '`partial(round, ndigits=2)` yordamida `3.14159` ni yaxlitlang.', 'Create fixed round2 partial.', `from functools import partial\nround2 = partial(round, ndigits=2)\nprint(round2(3.14159))`, '3.14', 'partial(round, ndigits=2)', 'Prints 3.14.'),
    ],
    quiz: [
      q('q1011_1', 'Navbat (FIFO queue) da boshidan element olish (`popleft()`) qaysi tuzilmada O(1) ishlaydi?', 'Which structure provides O(1) `popleft()` for FIFO queues?', ['list', 'collections.deque', 'tuple', 'set'], ['list', 'collections.deque', 'tuple', 'set'], 1, '`collections.deque`.', '`collections.deque`.'),
      q('q1011_2', '`itertools.groupby()` to‘g‘ri ishlashi uchun oldindan nima qilish SHART?', 'Mandatory step before calling `itertools.groupby(data, key=...)`?', ['set() ga o‘girish', 'Aynan o‘sha `key` bo‘yicha `sorted()` qilish', 'list.reverse()', 'Hech narsa'], ['Convert to set', 'Sort the data by the exact same `key` first', 'Reverse', 'Nothing'], 1, 'Xuddi o‘sha `key` bo‘yicha `sorted()` qilish.', 'Pre-sort using the same key.'),
      q('q1011_3', '`@lru_cache` bilan bezatilgan funksiyaga qaysi turdagi argument berib bo‘lmaydi?', 'Which argument type fails as a cache key in `@lru_cache`?', ['int', 'str', 'list (unhashable)', 'tuple of ints'], ['int', 'str', 'list (unhashable)', 'tuple of ints'], 2, '`list` unhashable bo‘lgani uchun `TypeError` beradi.', 'Unhashable `list`.'),
      q('q1011_4', 'Oxirgi N ta log xabarini saqlab eskilarini avtomatik o‘chirish uchun qaysi paramter ishlatiladi?', 'Parameter enabling an automatic fixed-size ring buffer on `deque`?', ['limit=N', 'maxlen=N', 'cap=N', 'size=N'], ['limit=N', 'maxlen=N', 'cap=N', 'size=N'], 1, '`deque(maxlen=N)`.', '`deque(maxlen=N)`.'),
      q('q1011_5', 'Funksiyaning ba’zi argumentlarini oldindan bog‘lab yangi funksiya yaratuvchi vosita?', 'Tool creating a pre-bound specialized callable?', ['itertools.bind', 'functools.partial', 'collections.wrap', 'functools.cache'], ['itertools.bind', 'functools.partial', 'collections.wrap', 'functools.cache'], 1, '`functools.partial`.', '`functools.partial`.'),
    ],
    homework: hw('Sliding Window & Word Analytics', 'Log Window & Frequency Reporter', '`deque(maxlen=5)`, `Counter` va `itertools.groupby` (oldindan saralangan!) yordamida event loglar oqimini tahlil qilib oxirgi 5 event va har bir daraja (INFO/WARN/ERR) statistikasini chiqaruvchi analyzer yozing.', 'Use bounded `deque(maxlen=5)`, `Counter`, and sorted `groupby` to summarize event severity buckets and recent window history.', ['deque(maxlen=5) va Counter', 'Pre-sorted groupby'], ['Bounded deque + Counter', 'Sorted groupby'], 'events_s = sorted(events, key=lambda e: e[0])', 'Sort before groupby.', '@lru_cache bilan og‘ir metrika hisoblovchini ham keshlang.', 'Memoize metric scoring with `@lru_cache`.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-12',
    courseId: 'advanced_python',
    moduleId: 'c10_m4',
    order: 12,
    titleUz: 'Type Hints va Advanced Typing (Generic, Protocol, TypedDict, Literal)',
    titleEn: 'Advanced Type Hints: TypeVar, Generic, TypedDict & Literal',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-10-11'],
    conceptId: 'adv_typing',
    whyUz: "Oddiy `int` va `list[str]` kichik kodda yetadi, lekin API javoblari, umumiy repository sinflari (`Repository[T]`), qatʼiy rejimlar (`Literal['asc', 'desc']`) va JSON lug‘at kalitlarini (`TypedDict`) xatosiz tekshirish uchun **Advanced `typing`** zarur!",
    whyEn: 'Level up static safety with `TypeVar`, `Generic[T]`, `TypedDict`, `Literal`, `Final`, and `Callable` so IDEs and `mypy`/`pyright` catch bugs before code ever runs.',
    analogyUz: "**Type Hints** — bu samolyot asboblar paneli va parvoz oldi tekshiruvi: Python uchayotganda majburlamasa ham, IDE va static checker (`mypy`) qanotdagi nomuvofiqlikni yerdaligidayoq ko‘rsatib beradi!",
    analogyEn: 'Type hints are static pre-flight diagnostics—your type checker catches mismatched keys, modes, and generics long before runtime.',
    stopsUz: "Juda muhim: **Python runtime da Type Hints ni majburiy tekshirmaydi** (buni `mypy`/`pyright` static tekshiradi yoki Pydantic runtime da validatsiya qiladi)! Shuningdek Python 3.12+ da `def first[T](xs: list[T]) -> T:` yangi PEP 695 sintaksisi ham mavjud (`TypeVar` hamma 3.10+ versiyalarda ishlaydi).",
    stopsEn: 'Python ignores type annotations at runtime unless validated by libraries like Pydantic—their primary enforcement comes from static checkers (`mypy` / `pyright`).',
    objUz: ['`TypeVar` va `Generic[T]` bilan tur-xavfsiz konteyner va funksiyalar yozish', '`TypedDict`, `Literal`, `Final`, `Callable[[int], str]` va `X | None` ni qo‘llash', 'Static Type Checking (`mypy`) vs Runtime Validation (Pydantic) farqini bilish'],
    objEn: ['Parameterize functions and classes with `TypeVar` and `Generic[T]`', 'Constrain dictionaries, enums, and callbacks via `TypedDict`, `Literal`, `Final`, and `Callable`', 'Distinguish static type checking from runtime validation'],
    theoryUz: `### 1. \`TypeVar\` va \`Generic[T]\`
\`\`\`python
T = TypeVar("T")
def first(items: list[T]) -> T: return items[0]
\`\`\`
\`first([1, 2])\` -> \`int\`, \`first(["a"])\` -> \`str\` ekanini type checker aniq biladi!
### 2. \`TypedDict\` — Kalitlari Aniq JSON Lug‘ati
\`\`\`python
class UserDict(TypedDict):
    id: int
    role: Literal["admin", "student"]
\`\`\`
### 3. \`Literal\`, \`Final\`, \`Callable\`
- \`Literal["dev", "prod"]\`: faqat ruxsat etilgan satr qiymatlar.
- \`Final\`: qayta tayinlanmasligi kerak bo‘lgan konstanta.
- \`Callable[[int, int], int]\`: funksiya imzosi.
### 4. Runtime da \`typing.get_type_hints()\`
Runtime da ham annotatsiyalarni o‘qish mumkin (masalan FastAPI/Pydantic shunday ishlaydi!).`,
    theoryEn: `### 1. \`TypeVar\` & \`Generic[T]\`
Preserve input-to-output type relationships across generic wrappers, repositories, and helpers.
### 2. \`TypedDict\`
Type-check exact key names and per-key value types on plain Python dicts.
### 3. \`Literal\`, \`Final\`, \`Callable\`
Restrict string/int options with \`Literal\`, mark constants \`Final\`, and annotate callbacks with \`Callable[[Args], Return]\`.
### 4. \`typing.get_type_hints()\`
Inspect type metadata dynamically at runtime—the foundation behind Pydantic and FastAPI.`,
    examples: [
      ex('Misol 1: `TypeVar` va `Generic[T]` Box klassi', 'Example 1: TypeVar & Generic Box', `from typing import Generic, TypeVar\n\nT = TypeVar("T")\n\nclass Box(Generic[T]):\n    def __init__(self, value: T) -> None:\n        self.value = value\n    def unwrap(self) -> T:\n        return self.value\n\nprint(Box[int](42).unwrap(), Box[str]("py").unwrap())`, `42 py`, '`Generic[T]` har qanday turdagi qiymatni static type ni yo‘qotmasdan o‘raydi.', '`Generic[T]` preserves exact wrapped types across instances.'),
      ex('Misol 2: `TypedDict`, `Literal` va `get_type_hints`', 'Example 2: TypedDict, Literal & Introspection', `from typing import Literal, TypedDict, get_type_hints\n\nclass Config(TypedDict):\n    env: Literal["dev", "prod"]\n    workers: int\n\ncfg: Config = {"env": "prod", "workers": 4}\nprint(cfg, "| keys:", sorted(get_type_hints(Config).keys()))`, `{'env': 'prod', 'workers': 4} | keys: ['env', 'workers']`, '`TypedDict` oddiy `dict` bo‘lib qoladi, lekin kalitlarining aniq tur sxemasini beradi.', '`TypedDict` produces standard runtime dicts backed by strict static key schemas.'),
      ex('Misol 3: `Callable` va `Final`', 'Example 3: Callable & Final', `from typing import Callable, Final\n\nMAX_RETRIES: Final[int] = 3\ndef apply_twice(fn: Callable[[int], int], x: int) -> int:\n    return fn(fn(x))\n\nprint(MAX_RETRIES, apply_twice(lambda n: n + 5, 10))`, `3 20`, '`Callable[[int], int]` argument va qaytish turini hujjatlashtiradi.', '`Callable` annotates callback parameters concisely.'),
    ],
    traceTitleUz: 'Generic va get_type_hints izi',
    traceTitleEn: 'Tracing Annotations Metadata',
    traceCode: `def add(a: int, b: int) -> int:\n    return a + b\nprint(add.__annotations__["return"].__name__)`,
    traceSteps: [
      traceStep(1, 'def add(a: int, b: int) -> int', '__annotations__ populated', 'Python annotatsiyalarni lug‘atga saqladi', 'Stored hints in __annotations__'),
      traceStep(2, 'add.__annotations__["return"]', 'int', 'Qaytish turi olindi', 'Looked up return type', 'int'),
    ],
    commonMistakes: [
      mistake('Type Hint yozsam Python runtime da o‘zi tekshiradi deb o‘ylash', 'Assuming Type Hints Enforce Types at Runtime', `def inc(x: int) -> int:\n    return x + x\nprint(inc("ha"))  # Runs at runtime without raising TypeError!`, 'hahaha -> wait: "haha" instead of failing!', `def inc(x: int) -> int:\n    if not isinstance(x, int): raise TypeError("int required")\n    return x + 1\nprint(inc(5))`, 'Type hints static tekshiruv (`mypy`/`pyright`) uchun; runtime validatsiyani kod/Pydantic qiladi.', 'Type hints are advisory at runtime; enforce external inputs explicitly.', 'Tashqi kirishlarni `isinstance` yoki Pydantic bilan tekshiring.', 'Validate untrusted inputs explicitly.'),
      mistake('`TypedDict` da kalitni atribut `cfg.env` deb o‘qish', 'Accessing TypedDict Keys as Attributes', `# cfg.env raises AttributeError because TypedDict is still a dict!`, 'AttributeError: dict has no attribute env', `print("Access TypedDict via brackets: cfg['env']!")`, '`TypedDict` runtime da oddiy `dict` obyektidir, klass emas.', '`TypedDict` creates a plain `dict`, not an attribute-based class.', 'Kalitlarni `cfg["env"]` deb o‘qing.', 'Use subscript access `cfg["key"]`.'),
    ],
    compareTitleUz: '`TypedDict` vs `@dataclass`',
    compareTitleEn: '`TypedDict` vs `@dataclass`',
    compareUz: ['`TypedDict`: tashqi JSON `dict` bilan ishlash (`d["key"]`) va minimal o‘zgartirish kerak bo‘lganda.', '`@dataclass`: domen obyektlari (`obj.attr`), metodlar va `frozen=True` kerak bo‘lganda.'],
    compareEn: ['`TypedDict`: typing raw JSON-style dict payloads (`d["key"]`).', '`@dataclass`: domain models with attributes (`obj.attr`), methods, and immutability.'],
    compareSummaryUz: 'Umumiy kutubxonalarda `Generic[T]`/`TypeVar`, dict sxemalarida `TypedDict`, variantlarda `Literal`, callback larda `Callable` ishlating.',
    compareSummaryEn: 'Use `Generic[T]`, `TypedDict`, `Literal`, and `Callable` for expressive static contracts—and validate untrusted data at runtime.',
    practiceTasks: [
      pt('p1012_1', '1-mashq: `TypeVar` funksiyasi', 'Task 1: Generic first()', '`T = TypeVar("T")` bilan `first(xs: list[T]) -> T` yozing.', 'Write generic first().', `from typing import TypeVar\nT = TypeVar("T")\ndef first(xs: list[T]) -> T:\n    return xs[0]\nprint(first([9, 8]), first(["a", "b"]))`, '9 a', 'T = TypeVar("T")', 'Prints 9 a.'),
      pt('p1012_2', '2-mashq: `TypedDict` yaratish', 'Task 2: UserDict TypedDict', '`UserDict(TypedDict)` (`name: str`, `age: int`) tuzib chiqaring.', 'Create TypedDict instance.', `from typing import TypedDict\nclass UserDict(TypedDict):\n    name: str\n    age: int\nu: UserDict = {"name": "Aziz", "age": 22}\nprint(u["name"], u["age"])`, 'Aziz 22', 'Bracket access u["name"]', 'Prints Aziz 22.'),
      pt('p1012_3', '3-mashq: `Callable` parametri', 'Task 3: Typed Callback', '`run(fn: Callable[[str], int], s: str)` bilan `len` ni uzating.', 'Annotate Callable[[str], int].', `from typing import Callable\ndef run(fn: Callable[[str], int], s: str) -> int:\n    return fn(s)\nprint(run(len, "python"))`, '6', 'Callable[[str], int]', 'Prints 6.'),
      pt('p1012_4', '4-mashq: `get_type_hints`', 'Task 4: Inspect Hints', '`def f(a: int, b: str) -> bool:` ning `get_type_hints(f)` kalitlarini chiqaring.', 'Read type hints.', `from typing import get_type_hints\ndef f(a: int, b: str) -> bool: return True\nprint(sorted(get_type_hints(f).keys()))`, "['a', 'b', 'return']", 'get_type_hints(f)', "Prints ['a', 'b', 'return']."),
      pt('p1012_5', '5-mashq: `Literal` + `Final`', 'Task 5: Mode Literal & Final', '`MODE: Final[Literal["fast", "safe"]] = "safe"` chiqaring.', 'Combine Final and Literal.', `from typing import Final, Literal\nMODE: Final[Literal["fast", "safe"]] = "safe"\nprint(MODE)`, 'safe', 'Final[Literal[...]]', 'Prints safe.'),
    ],
    quiz: [
      q('q1012_1', 'Python dastur ishlayotganda (runtime) Type Hints ni avtomatik majburiy tekshiradimi?', 'Does standard Python enforce Type Hints automatically at runtime?', ['Ha, TypeError beradi', 'Yo‘q, ular static type checker (`mypy`/`pyright`) uchun', 'Faqat int da', 'Faqat funksiyada'], ['Yes', 'No, they are checked statically by tools like `mypy` / `pyright`', 'Ints only', 'Functions only'], 1, 'Yo‘q, runtime da tekshirilmaydi.', 'No runtime enforcement by default.'),
      q('q1012_2', '`TypedDict` obyekti runtime da qaysi turda bo‘ladi?', 'Runtime type of an object typed as `TypedDict`?', ['Class instance', 'Oddiy `dict`', 'NamedTuple', 'FrozenSet'], ['Class instance', 'Plain `dict`', 'NamedTuple', 'FrozenSet'], 1, 'Oddiy `dict`.', 'Plain `dict`.'),
      q('q1012_3', 'Kirish va chiqish turi bir xil bo‘lgan umumiy funksiya uchun nima ishlatiladi?', 'Used to express that return type matches input type polymorphically?', ['Any', 'TypeVar', 'Final', 'Union'], ['Any', 'TypeVar', 'Final', 'Union'], 1, '`TypeVar`.', '`TypeVar`.'),
      q('q1012_4', 'Faqat `"asc"` yoki `"desc"` qiymatlarni ruxsat etuvchi annotatsiya?', 'Annotation restricting string values to `"asc"` or `"desc"`?', ['Final["asc", "desc"]', 'Literal["asc", "desc"]', 'Enum["asc"]', 'Const["asc"]'], ['Final["asc", "desc"]', 'Literal["asc", "desc"]', 'Enum["asc"]', 'Const["asc"]'], 1, '`Literal["asc", "desc"]`.', '`Literal["asc", "desc"]`.'),
      q('q1012_5', '2 ta `int` olib `str` qaytaruvchi funksiya annotatsiyasi?', 'Annotation for a callable taking `(int, int)` and returning `str`?', ['Callable[int, str]', 'Callable[[int, int], str]', 'Func[int, int, str]', 'Def[[int], str]'], ['Callable[int, str]', 'Callable[[int, int], str]', 'Func[int, int, str]', 'Def[[int], str]'], 1, '`Callable[[int, int], str]`.', '`Callable[[int, int], str]`.'),
    ],
    homework: hw('Generic Repository[T] Shartnomasi', 'Typed Generic Repository', '`T = TypeVar("T")` bilan `InMemoryRepo(Generic[T])` (`save(key: str, item: T)`, `get(key: str) -> T | None`), `OrderPayload(TypedDict)` va `Literal["pending", "paid"]` statuslarini yozing.', 'Implement `InMemoryRepo(Generic[T])` storing `OrderPayload` `TypedDict` items with `Literal` statuses and verify type-hint metadata via `get_type_hints`.', ['Generic[T] + TypeVar', 'TypedDict + Literal'], ['Use Generic[T] + TypeVar', 'Use TypedDict + Literal'], 'class InMemoryRepo(Generic[T]): ...', 'Generic class.', '`Protocol` bilan ham uyg‘unlashtiring.', 'Add a `Protocol` check.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-13',
    courseId: 'advanced_python',
    moduleId: 'c10_m4',
    order: 13,
    titleUz: 'Async Python & asyncio — Coroutine, Event Loop va Concurrent I/O',
    titleEn: 'Async Python & asyncio: Coroutines, gather() & Non-Blocking Traps',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-10-12'],
    conceptId: 'adv_asyncio',
    whyUz: "Agar backend serveringiz 10 ta tashqi API ga ketma-ket (`for url in urls: fetch()`) murojaat qilsa, 10 × 0.5s = 5 soniya kutadi! **`asyncio` (`async def`, `await`, `asyncio.gather`)** esa bitta thread ichida kutish payti boshqa vazifalarni parallel bajarib, I/O vaqtini 10 baravar qisqartiradi — FastAPI ning yuragi aynan shu!",
    whyEn: 'Master `async def`, `await`, `asyncio.run()`, `asyncio.gather()`, and `TaskGroup` to run concurrent I/O without blocking the Event Loop.',
    analogyUz: "**Sync kod** — bitta oshpaz bitta choynak qaynashini qimirlamay kutib o‘tirishi. **Async (`asyncio`)** — o‘sha bitta oshpaz choynakni qo‘yib (`await`), kutish payti salat to‘g‘rashi va non pishirishi: hammasi bitta Event Loop da tezroq bitadi!",
    analogyEn: 'An Event Loop is one chef multitasking across I/O waits (`await`)—starting the kettle, chopping vegetables while water heats, never idling during network waits.',
    stopsUz: "Ikki halokatli xato: 1) `async def` ichida `time.sleep(2)` yoki oddiy `requests.get()` chaqirish **butun Event Loop ni muzlatib qo‘yadi** — albatta `await asyncio.sleep(...)` va async kutubxona (`httpx.AsyncClient`) ishlating! 2) `async def` oddiy chaqirilsa (`fetch()`) ishlamaydi — faqat coroutine obyekti beradi; albatta **`await`** yoki **`asyncio.run()`** kerak!",
    stopsEn: 'Never call blocking `time.sleep()` or sync `requests` inside `async def`—it stalls the entire event loop. Always `await` coroutines instead of calling them without `await`.',
    objUz: ['`async def` coroutine, `await`, va `asyncio.run()` asosiy siklini bilish', '`asyncio.gather(*tasks)` va `asyncio.create_task()` bilan I/O ni tezlashtirish', 'Blocking trap (`time.sleep` vs `asyncio.sleep`) va `asyncio.wait_for(..., timeout=...)` ni qo‘llash'],
    objEn: ['Run coroutines with `asyncio.run()` and `await`', 'Concurrently schedule tasks with `asyncio.gather()` and `create_task()`', 'Protect the event loop from blocking calls and enforce timeouts with `wait_for()`'],
    theoryUz: `### 1. Coroutine va \`await\`
\`async def fetch(): ...\` chaqirilganda bajarilmaydi, **coroutine** qaytaradi. \`await\` esa Event Loop ga "men kutayapman, boshqa taskni yuritib tur" deydi.
### 2. \`asyncio.gather()\` — Haqiqiy Konkurentlik
Ketma-ket \`await a(); await b()\` hali ham sekin; \`await asyncio.gather(a(), b())\` esa ikkalasini bir vaqtda ishga tushiradi va natijalarni **kiritilgan tartibda** qaytaradi!
### 3. \`asyncio.create_task()\` va \`TaskGroup\`
Orqa fon vazifasini darhol Event Loop ga navbatga qo‘yadi. Python 3.11+ da \`async with asyncio.TaskGroup() as tg:\` xatolarni xavfsiz boshqaradi.
### 4. Blocking Trap (\`time.sleep\` taqiqlanadi!)
CPU-heavy yoki sync I/O ni async ichida yurgizish shart bo‘lsa \`await asyncio.to_thread(sync_fn)\` ishlating!
### 5. \`asyncio.wait_for(coro, timeout=1.0)\`
Osilib qolgan tarmoq so‘rovlarini \`TimeoutError\` bilan uzadi.`,
    theoryEn: `### 1. Coroutines & \`await\`
\`async def\` defines a coroutine factory; \`await\` yields control back to the Event Loop until awaited I/O completes.
### 2. Concurrent Execution via \`asyncio.gather()\`
Sequential \`await\` runs one-by-one; \`await asyncio.gather(...)\` schedules coroutines concurrently and preserves input order in the returned list.
### 3. \`create_task()\` & \`TaskGroup\`
\`create_task()\` schedules background execution immediately; Python 3.11+ \`TaskGroup\` provides structured concurrency.
### 4. Avoiding Blocking Calls
Never use \`time.sleep()\`; offload unavoidable sync blocking functions via \`await asyncio.to_thread(...)\`.
### 5. Timeouts with \`asyncio.wait_for()\`
Bound slow coroutines cleanly and catch \`TimeoutError\`.`,
    examples: [
      ex('Misol 1: `asyncio.gather()` bilan konkurent bajarish', 'Example 1: Concurrent Tasks via asyncio.gather', `import asyncio\n\nasync def fetch_item(name: str) -> str:\n    await asyncio.sleep(0.01)\n    return f"ok:{name}"\n\nasync def main() -> None:\n    results = await asyncio.gather(fetch_item("users"), fetch_item("orders"))\n    print(results)\n\nasyncio.run(main())`, `['ok:users', 'ok:orders']`, '`asyncio.gather` ikkala korutinni parallel boshlaydi va tartibni saqlab javob beradi.', '`asyncio.gather()` runs coroutines concurrently and returns results in argument order.'),
      ex('Misol 2: `asyncio.create_task()` va `asyncio.wait_for()` timeout', 'Example 2: create_task & wait_for Timeout', `import asyncio\n\nasync def slow():\n    await asyncio.sleep(1.0)\n    return "late"\n\nasync def main():\n    try:\n        await asyncio.wait_for(slow(), timeout=0.01)\n    except TimeoutError:\n        print("Timed out cleanly!")\n\nasyncio.run(main())`, `Timed out cleanly!`, '`wait_for` belgilangan vaqtdan oshgan vazifani bekor qilib `TimeoutError` chiqaradi.', '`asyncio.wait_for()` cancels stalled coroutines cleanly on timeout.'),
      ex('Misol 3: `asyncio.to_thread()` bilan sync funksiyani xavfsiz chaqirish', 'Example 3: Offloading Blocking Work via to_thread', `import asyncio\n\ndef cpu_work(n: int) -> int:\n    return sum(range(n))\n\nasync def main():\n    res = await asyncio.to_thread(cpu_work, 10)\n    print("Offloaded sum:", res)\n\nasyncio.run(main())`, `Offloaded sum: 45`, '`asyncio.to_thread` bloklovchi funksiyani alohida thread ga chiqarib Event Loop ni bo‘sh qoldiradi.', '`asyncio.to_thread()` keeps the event loop responsive while running sync code.'),
    ],
    traceTitleUz: 'Event loop `gather` izi',
    traceTitleEn: 'Tracing asyncio.gather()',
    traceCode: `import asyncio\nasync def job(k): await asyncio.sleep(0); return k * 2\nasync def main(): print(await asyncio.gather(job(1), job(2)))\nasyncio.run(main())`,
    traceSteps: [
      traceStep(1, 'asyncio.run(main())', 'event loop started', 'Event loop ochildi', 'Started event loop'),
      traceStep(2, 'asyncio.gather(job(1), job(2))', '2 tasks scheduled', 'Ikkala task navbatga qo‘yildi', 'Scheduled both tasks'),
      traceStep(3, 'print(...)', '[2, 4]', 'Tartibli natija chiqdi', 'Printed [2, 4]', '[2, 4]'),
    ],
    commonMistakes: [
      mistake('`async def` funksiyani `await` siz chaqirish', 'Forgetting await on a Coroutine', `import asyncio\nasync def greet(): return "hi"\nc = greet()\nprint("Not str! Got:", type(c).__name__)\nc.close()`, 'Got: coroutine (never executed!)', `import asyncio\nasync def greet(): return "hi"\nprint(asyncio.run(greet()))`, '`await` yozilmasa korutin ichi umuman ishlamaydi va `RuntimeWarning` chiqadi.', 'Calling an `async def` without `await` creates an unawaited coroutine.', 'Doim `await coro()` yoki `asyncio.run(...)` ishlating.', 'Always `await` coroutines.'),
      mistake('`async def` ichida `time.sleep()` ishlatish', 'Calling Blocking time.sleep() Inside Async', `# time.sleep(2) freezes ALL concurrent tasks in the event loop!`, '0% concurrency — loop stalled', `import asyncio\nasync def safe(): await asyncio.sleep(0.01); return "non-blocking"\nprint(asyncio.run(safe()))`, '`time.sleep` thread ni bloklaydi, `asyncio.sleep` esa boshqa vazifalarga yo‘l beradi.', '`time.sleep()` freezes the loop; `await asyncio.sleep()` yields control.', 'Har doim `await asyncio.sleep(...)` ishlating.', 'Use `await asyncio.sleep(...)`.'),
    ],
    compareTitleUz: 'Threading vs Multiprocessing vs `asyncio`',
    compareTitleEn: 'Threading vs Multiprocessing vs `asyncio`',
    compareUz: ['`asyncio`: minglab tarmoq/DB I/O ulanishlari uchun eng yengil va tez (1 thread, 0 GIL muammo I/O da).', '`threading`: eski bloklovchi kutubxonalar bilan I/O uchun.', '`multiprocessing`: og‘ir CPU hisob-kitoblar (GIL ni chetlab o‘tish) uchun.'],
    compareEn: ['`asyncio`: high-concurrency non-blocking I/O on a single thread.', '`threading`: legacy blocking I/O libraries.', '`multiprocessing`: CPU-bound parallel computation bypassing the GIL.'],
    compareSummaryUz: 'Tarmoq I/O da `asyncio.gather` / `wait_for` ishlating; `time.sleep` dan tiyiling va sync kodni `asyncio.to_thread` bilan o‘rang.',
    compareSummaryEn: 'Use `asyncio` for concurrent I/O, never block the event loop, and bound waits with `asyncio.wait_for()`.',
    practiceTasks: [
      pt('p1013_1', '1-mashq: Oddiy `asyncio.run`', 'Task 1: Basic Coroutine', '`async def ping()` `"pong"` qaytarsin, `asyncio.run` bilan chiqaring.', 'Run a coroutine.', `import asyncio\nasync def ping(): return "pong"\nprint(asyncio.run(ping()))`, 'pong', 'asyncio.run(ping())', 'Prints pong.'),
      pt('p1013_2', '2-mashq: `asyncio.gather`', 'Task 2: Gather Two Tasks', '`double(2)` va `double(5)` ni `asyncio.gather` bilan ishga tushiring.', 'Gather two coroutines.', `import asyncio\nasync def dbl(n): await asyncio.sleep(0); return n * 2\nasync def main(): print(await asyncio.gather(dbl(2), dbl(5)))\nasyncio.run(main())`, '[4, 10]', 'await asyncio.gather(...)', 'Prints [4, 10].'),
      pt('p1013_3', '3-mashq: `asyncio.wait_for` timeout', 'Task 3: Timeout Catch', '`asyncio.sleep(1)` da `timeout=0.01` bilan `TimeoutError` tuting.', 'Catch TimeoutError.', `import asyncio\nasync def main():\n    try:\n        await asyncio.wait_for(asyncio.sleep(1), timeout=0.01)\n    except TimeoutError:\n        print("timeout")\nasyncio.run(main())`, 'timeout', 'asyncio.wait_for(..., timeout=0.01)', 'Prints timeout.'),
      pt('p1013_4', '4-mashq: `asyncio.create_task`', 'Task 4: Background Task', '`create_task` yaratib `await task` natijasini oling.', 'Await a created Task.', `import asyncio\nasync def job(): return "ready"\nasync def main():\n    t = asyncio.create_task(job())\n    print(await t)\nasyncio.run(main())`, 'ready', 'asyncio.create_task(job())', 'Prints ready.'),
      pt('p1013_5', '5-mashq: `asyncio.to_thread`', 'Task 5: Offload Sync Call', '`len("async")` ni `asyncio.to_thread` orqali chaqiring.', 'Run sync len in thread.', `import asyncio\nasync def main(): print(await asyncio.to_thread(len, "async"))\nasyncio.run(main())`, '5', 'await asyncio.to_thread(len, "async")', 'Prints 5.'),
    ],
    quiz: [
      q('q1013_1', '`async def` funksiyani `await` qilmasdan chaqirsak nima qaytadi?', 'Calling an `async def` function without `await` returns:', ['Natija qiymati', 'Bajarilmagan coroutine obyekti', 'None', 'Thread'], ['Return value', 'An unawaited coroutine object', 'None', 'Thread'], 1, 'Coroutine obyekti.', 'A coroutine object.'),
      q('q1013_2', 'Bir nechta korutinni parallel boshlab natijalarini tartib bilan olish uchun nima ishlatiladi?', 'Function running coroutines concurrently and returning results in input order?', ['asyncio.run()', 'asyncio.gather()', 'asyncio.sleep()', 'asyncio.lock()'], ['asyncio.run()', 'asyncio.gather()', 'asyncio.sleep()', 'asyncio.lock()'], 1, '`asyncio.gather()`.', '`asyncio.gather()`.'),
      q('q1013_3', '`async def` ichida `time.sleep(5)` yozilsa nima yuz beradi?', 'What happens if you call `time.sleep(5)` inside an `async def`?', ['Tezroq ishlaydi', 'Butun Event Loop va barcha tasklar 5 soniya muzlaydi', 'Thread ochiladi', 'Xato chiqadi'], ['Runs faster', 'Blocks the entire Event Loop for 5 seconds', 'Spawns thread', 'Raises error'], 1, 'Butun Event Loop bloklanadi.', 'Blocks the entire Event Loop.'),
      q('q1013_4', 'Bloklovchi sync funksiyani Event Loop ni to‘xtatmay chaqirish usuli?', 'How to safely run a blocking sync function from async code?', ['await fn()', 'await asyncio.to_thread(fn, ...)', 'time.sleep(0)', 'global fn'], ['await fn()', 'await asyncio.to_thread(fn, ...)', 'time.sleep(0)', 'global fn'], 1, '`await asyncio.to_thread(...)`.', '`await asyncio.to_thread(...)`.'),
      q('q1013_5', 'Korutinaga maksimal kutish vaqti berish funksiyasi?', 'Function enforcing a timeout on an awaitable?', ['asyncio.limit()', 'asyncio.wait_for()', 'asyncio.cancel()', 'asyncio.timer()'], ['asyncio.limit()', 'asyncio.wait_for()', 'asyncio.cancel()', 'asyncio.timer()'], 1, '`asyncio.wait_for()`.', '`asyncio.wait_for()`.'),
    ],
    homework: hw('Async Concurrent Task Scheduler', 'Async Batch Fetcher with Semaphore', '`asyncio.Semaphore(2)` bilan bir vaqtda ko‘pi bilan 2 ta vazifa yuradigan va `asyncio.wait_for` timeout himoyasiga ega `fetch_all(ids)` async dasturini yozing.', 'Build an async batch runner using `asyncio.Semaphore(2)` to cap concurrency and `asyncio.wait_for()` for timeout safety.', ['asyncio.gather + Semaphore', 'TimeoutError ushlanishi'], ['Use Semaphore + gather', 'Handle TimeoutError per item'], 'async with sem: return await asyncio.wait_for(...)', 'Throttle concurrent tasks.', 'Kurs 10 ni yakunlab natija hisobotini chiqaring.', 'Print completion summary.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),
];
