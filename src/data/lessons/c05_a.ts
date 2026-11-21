import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C05_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-05-01',
    courseId: 'functions',
    moduleId: 'c05_m1',
    order: 1,
    titleUz: 'Funksiya nima? Modulli dasturlash va Review #9',
    titleEn: 'What Is a Function? Modularity, DRY & Review #9',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-04-14'],
    conceptId: 'functions_intro',
    whyUz: "Katta dasturlarda bir xil soliq hisoblash, email tekshirish yoki matn tozalash mantiqini 10 joyga nusxa ko‘chirish kodni boshqarib bo‘lmas holga keltiradi. Funksiya mantiqni nomli blokga o‘raydi.",
    whyEn: 'Functions encapsulate reusable logic into named, testable building blocks, eliminating copy-paste bugs (DRY principle).',
    analogyUz: "Funksiya — bu oshxonadagi blender: ichida qanday murakkab pichoq aylanishini har safar o‘ylamaysiz — meva solasiz (input), tugmani bosasiz (call), tayyor sharbat olasiz (output).",
    analogyEn: 'A function is a coffee machine: you supply beans and water (inputs), press one button (call), and get coffee (output) without rewiring internals.',
    stopsUz: "Bitta funksiya **bitta aniq ishni** (Single Responsibility) bajarishi kerak: ham foydalanuvchi kiritishini olib, ham DB ga yozib, ham `print()` qiladigan 100 qatorli funksiya — yomon arxitektura!",
    stopsEn: 'Keep each function focused on a single responsibility rather than mixing input, business rules, DB writes, and printing together.',
    objUz: ['DRY (Don’t Repeat Yourself) va Decompositsiya tushunchalarini bilish', 'O‘rnatilgan (`len`, `sum`) va foydalanuvchi funksiyalari farqini ko‘rish', 'Mantiqni kichik mustaqil qismlarga ajratishni o‘rganish'],
    objEn: ['Understand DRY and functional decomposition', 'Contrast built-in functions with custom functions', 'Break large workflows into clean single-purpose functions'],
    theoryUz: `### 1. Funksiya Nima?
Funksiya — bu kirish ma’lumotlarini qabul qilib, aniq vazifani bajaradigan va natija qaytaradigan nomlangan kod bloki.
### 2. Nima Uchun Kerak? (DRY Tamoyili)
Bir mantiqni 5 joyda yozsangiz, xato chiqqanda 5 joyni tuzatishga to‘g‘ri keladi. Funksiyada esa **1 joyda** tuzatasiz.
### 3. Abstraksiya va Testlanish
\`calculate_tax(price)\` funksiyasini alohida chaqirib tekshirish (unit test) oson.
### 4. Dekompozitsiya
Katta vazifa kichik qismlarga bo‘linadi: \`parse_data()\` -> \`validate()\` -> \`save()\`.
### 5. O‘rnatilgan vs Shaxsiy Funksiyalar
\`print()\`, \`len()\`, \`sorted()\` — Python bergan tayyor funksiyalar; endi biz o‘zimiznikini yaratamiz!`,
    theoryEn: `### 1. What Is a Function?
A named, reusable unit of computation mapping inputs to outputs.
### 2. Why DRY Matters
Fix or optimize logic in one place rather than hunting down duplicates.
### 3. Abstraction & Testability
Pure functions with explicit inputs and outputs are trivial to unit-test.
### 4. Problem Decomposition
Split large tasks into small composable steps.
### 5. Built-in vs User-Defined
Moving from calling \`len()\` and \`sorted()\` to writing your own functions.`,
    examples: [
      ex('Misol 1: Takrorlanishni funksiya bilan yo‘qotish', 'Example 1: DRY Refactoring', `def apply_tax(amount):\n    return round(amount * 1.12, 2)\n\nfor price in [100, 250, 50]:\n    print(price, "->", apply_tax(price))`, `100 -> 112.0\n250 -> 280.0\n50 -> 56.0`, 'Soliq formulasi bir joyda yozildi va 3 marta qayta ishlatildi.', 'Tax formula lives in one reusable function.'),
      ex('Misol 2: Matn normallashtiruvchi kichik funksiya', 'Example 2: Single-Responsibility Helper', `def clean_tag(raw):\n    return raw.strip().lower()\n\ntags = ["  Python ", "SQL  ", "  Ai"]\nprint([clean_tag(t) for t in tags])`, `['python', 'sql', 'ai']`, 'Comprehension ichida toza funksiya chaqirildi.', 'Composed clean helper inside list comprehension.'),
      ex('Misol 3: Funksiyalarni zanjir qilib bog‘lash', 'Example 3: Composing Functions', `def is_valid_age(age):\n    return 0 < age <= 120\n\ndef label_age(age):\n    if not is_valid_age(age):\n        return "Invalid"\n    return "Adult" if age >= 18 else "Minor"\n\nprint(label_age(25), label_age(-3))`, `Adult Invalid`, 'Bir funksiya ikkinchi yordamchi funksiyaga tayandi.', 'Composed validation helper inside classifier.'),
    ],
    traceTitleUz: 'Funksiya chaqiruvi oqimi',
    traceTitleEn: 'Tracing Function Call Flow',
    traceCode: `def double(n):\n    return n * 2\n\nx = double(7)\nprint(x)`,
    traceSteps: [
      traceStep(1, 'def double(n):', 'defined', 'Funksiya xotirada ro‘yxatga olindi', 'Function object defined'),
      traceStep(2, 'double(7)', 'n=7', 'Boshqaruv funksiya ichiga o‘tdi', 'Entered double with n=7'),
      traceStep(3, 'return 14', 'x=14', 'Natija chaqiruvchi joyga qaytdi', 'Returned 14 to caller'),
      traceStep(4, 'print(x)', '14', 'Chop etildi', 'Printed 14', '14'),
    ],
    commonMistakes: [
      mistake('Qavssiz chaqirish (`func` vs `func()`)', 'Forgetting Parentheses When Calling', `def greet():\n    return "Salom"\nprint(greet)`, '<function greet at 0x...>', `def greet():\n    return "Salom"\nprint(greet())`, 'Qavssiz `greet` funksiyaning o‘zi (obyekt), `greet()` esa uni ishga tushiradi.', 'Without `()` you reference the function object instead of calling it.', 'Funksiyani ishlatish uchun doim `()` qo‘ying.', 'Include `()` to invoke.'),
      mistake('Bitta funksiyaga hamma ishni tiqish', 'Monolithic God Function', `def do_all(x):\n    y = x * 2\n    print("Log:", y)\n    return y`, 'Mixes logging side-effect with pure calculation', `def calc(x):\n    return x * 2\nprint("Log:", calc(5))`, 'Hisoblash va `print()` ni ajratsangiz funksiyani hamma joyda ishlata olasiz.', 'Separating computation from I/O improves reuse.', 'Hisoblovchi funksiyadan faqat qiymat qaytaring.', 'Keep computation pure.'),
    ],
    compareTitleUz: 'Takrorlangan kod vs Funksiya',
    compareTitleEn: 'Copy-Paste vs Function',
    compareUz: ['Copy-paste: o‘zgartirish kerak bo‘lsa 10 joydan qidiriladi.', 'Funksiya: 1 joyda o‘zgaradi, nomidan vazifasi bilinadi, testlash oson.'],
    compareEn: ['Copy-paste: fragile and hard to maintain.', 'Function: single source of truth, self-documenting, testable.'],
    compareSummaryUz: 'Kod 2 marta takrorlandimi — uchinchi martasida uni albatta funksiyaga ajrating!',
    compareSummaryEn: 'Follow the Rule of Three: extract repeated logic into a named function.',
    practiceTasks: [
      pt('p0501_1', '1-mashq: Oddiy funksiya', 'Task 1: First Function', '`square(n)` funksiyasini yozib `square(6)` ni chiqaring.', 'Write square(n) and print square(6).', `def square(n):\n    return n * n\nprint(square(6))`, '36', 'return n * n', 'Call square(6).'),
      pt('p0501_2', '2-mashq: DRY soliq', 'Task 2: DRY Tax', '`with_fee(x)` `x + 5` qaytarsin; `with_fee(10) + with_fee(20)` ni chiqaring.', 'Add fee 5 cleanly.', `def with_fee(x):\n    return x + 5\nprint(with_fee(10) + with_fee(20))`, '40', 'return x + 5', 'Call twice.'),
      pt('p0501_3', '3-mashq: Mantiqiy tekshiruv', 'Task 3: Boolean Helper', '`is_even(n)` funksiyasini yozib `is_even(8)` ni chiqaring.', 'Write is_even(8).', `def is_even(n):\n    return n % 2 == 0\nprint(is_even(8))`, 'True', 'n % 2 == 0', 'Return boolean.'),
      pt('p0501_4', '4-mashq: Funksiya kompozitsiyasi', 'Task 4: Compose Helpers', '`add1(x)` dan foydalanib `add2(x)` yozing va `add2(5)` ni chiqaring.', 'Call add1 twice inside add2.', `def add1(x):\n    return x + 1\ndef add2(x):\n    return add1(add1(x))\nprint(add2(5))`, '7', 'add1(add1(x))', 'Compose functions.'),
      pt('p0501_5', '5-mashq: Chaqirish vs obyekt', 'Task 5: Call with ()', '`hello()` funksiyasi `"Hi!"` qaytarsin, uni `()` bilan chaqiring.', 'Define and call hello().', `def hello():\n    return "Hi!"\nprint(hello())`, 'Hi!', 'print(hello())', 'Use parentheses.'),
    ],
    quiz: [
      q('q0501_1', 'DRY tamoyili nimani anglatadi?', 'What does DRY stand for?', ['Do Run Yesterday', 'Don’t Repeat Yourself', 'Debug Return Yearly', 'Dynamic Runtime Yield'], ['Do Run Yesterday', 'Don’t Repeat Yourself', 'Debug Return Yearly', 'Dynamic Runtime Yield'], 1, 'Kodni takrorlamaslik (Don’t Repeat Yourself).', 'Don’t Repeat Yourself.'),
      q('q0501_2', 'Funksiyani ishga tushirish uchun nomi yoniga nima qo‘yiladi?', 'Syntax to invoke a function?', ['[]', '{}', '()', '<>'], ['[]', '{}', '()', '<>'], 2, 'Qavslar `()`.', 'Parentheses `()`.'),
      q('q0501_3', 'Single Responsibility qoidasi nimani tavsiya qiladi?', 'What does Single Responsibility advise?', ['Bitta funksiya 10 ta ish qilsin', 'Bitta funksiya bitta aniq vazifani bajarsin', 'Return ishlatmang', 'Global ishlatish'], ['Mix 10 tasks', 'One clear job per function', 'Avoid return', 'Use globals'], 1, 'Har bir funksiya bitta aniq masʼuliyatga ega bo‘lsin.', 'One cohesive responsibility per function.'),
      q('q0501_4', 'Qaysi birida funksiya chaqirilgan?', 'Which line actually invokes `f`?', ['x = f', 'x = f()', 'def f:', 'del f'], ['x = f', 'x = f()', 'def f:', 'del f'], 1, '`f()`.', '`f()`.'),
      q('q0501_5', 'Funksiyalarga ajratish nimani osonlashtiradi?', 'Why decompose into functions?', ['Qayta ishlatish va testlashni', 'Xotirani to‘ldirishni', 'Fayl sonini oshirishni', 'Hech narsani'], ['Reuse and testing', 'Memory leaks', 'File bloat', 'Nothing'], 0, 'Qayta ishlatish, o‘qish va unit testlashni.', 'Modularity, readability, and unit testing.'),
    ],
    homework: hw('Matn Tahlil Modullarini Ajratish', 'Decompose Text Analyzer', 'Berilgan matndan so‘zlarni ajratuvchi, tozalovchi va eng uzun so‘zni topuvchi 3 ta alohida funksiya tuzing.', 'Write 3 small composable functions: normalize_words, count_words, and longest_word.', ['3 ta alohida def funksiya', 'DRY tamoyiliga amal qilinsin'], ['3 distinct functions', 'Follow single responsibility'], 'def longest_word(words): return max(words, key=len)', 'Keep each function concise.', 'So‘zlarning o‘rtacha uzunligini ham funksiya bilan hisoblang.', 'Add avg_word_len function.', 20),
    reviewCheckpoint: review(
      9,
      'Review Loyiha #9: Buyurtmalar Cheki Generatori (1–4-kurslar + Funksiyalar)',
      'Review Project #9: Modular Receipt Calculator',
      '45-dars marrasi! Ma’lumotlar tuzilmalari (List/Dict) va modulli funksiyalarni birlashtirib do‘kon cheki tizimini quring.',
      '45-lesson milestone! Combine data structures with modular functions to compute itemized receipts and discounts.',
      ['`calc_subtotal(items)` funksiyasi', '`apply_discount(total, rate)` funksiyasi', 'Chiroyli formatlangan chek chiqarish'],
      ['Write `calc_subtotal(items)`', 'Write `apply_discount(total, rate)`', 'Format itemized receipt cleanly'],
      `def calc_subtotal(items):
    return sum(i["price"] * i["qty"] for i in items)

def apply_discount(amount, pct):
    return round(amount * (1 - pct / 100), 2)

cart = [
    {"name": "Keyboard", "price": 45, "qty": 1},
    {"name": "Mouse", "price": 25, "qty": 2},
]
sub = calc_subtotal(cart)
final = apply_discount(sub, 10)
print(f"Subtotal: {sub} | After 10% off: {final}")`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-05-02',
    courseId: 'functions',
    moduleId: 'c05_m1',
    order: 2,
    titleUz: '`def` orqali funksiya yaratish va bajarilish sikli',
    titleEn: 'Defining & Calling Functions with `def`',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-05-01'],
    conceptId: 'def_syntax',
    whyUz: "`def` — Python da har bir funksiyani yaratuvchi asosiy kalit so‘z. Python dasturining funksiyani avval o‘qib (define), keyin esa chaqirganda (call) bajarish tartibini tushunish xatolarni oldini oladi.",
    whyEn: 'Understanding `def` syntax, indentation blocks, and define-time vs call-time execution prevents `NameError` and early-return surprises.',
    analogyUz: "`def` — bu retsept daftariga taom retseptini yozib qo‘yish; retsept yozilgani bilan osh pishib qolmaydi — faqat uni chaqirganingizda (`cook()`) oshxonada jarayon boshlanadi!",
    analogyEn: '`def` writes a recipe into your cookbook—nothing cooks until you actually invoke the recipe by name.',
    stopsUz: "Python kodni **yuqoridan pastga** o‘qiydi! Agar funksiyani `def` dan **oldin** chaqirsangiz, `NameError: name '...' is not defined` xatosi chiqadi.",
    stopsEn: 'Python binds functions top-to-bottom at runtime; calling a function before its `def` block raises `NameError`.',
    objUz: ['To‘g‘ri `def name(params):` sarlavhasi va 4-bo‘shliq indentatsiya yozish', 'Define-time va call-time farqini tushunish', 'PEP 8 nomlash qoidalariga (`snake_case`, feʼl bilan boshlash) amal qilish'],
    objEn: ['Write valid `def` headers and 4-space indented bodies', 'Distinguish definition time from invocation time', 'Follow PEP 8 `snake_case` verb-first function names'],
    theoryUz: `### 1. \`def\` Sintaksisi
\`def function_name(param1, param2):\` -> ikki nuqta \`: \` va ichkarida 4 ta bo‘shliq indentatsiya.
### 2. Define-Time vs Call-Time
\`def\` bajarilganda Python funksiyani xotirada obyekt sifatida saqlaydi, lekin ichidagi kodni **ishga tushirmaydi**. Ichidagi kod har safar \`function_name(...)\` chaqirilganda bajariladi.
### 3. PEP 8 Nomlash Qoidalari
Funksiyalar \`snake_case\` da va odatda harakat/feʼl bilan nomlanadi: \`calculate_total\`, \`send_email\`, \`is_valid\`.
### 4. Bo‘sh Funksiya Uchun \`pass\`
Hozircha yozilmagan funksiya skeleti uchun \`pass\` qo‘yiladi.
### 5. Keng tarqalgan xato
\`def\` dan oldin funksiyani chaqirish (\`NameError\`) yoki \`:\` ni unutish (\`SyntaxError\`).`,
    theoryEn: `### 1. Syntax of \`def\`
Header \`def name(params):\` followed by an indented block.
### 2. Define vs Call Time
\`def\` creates the function object; calling \`name()\` executes the body.
### 3. Naming Conventions
Use \`snake_case\` action verbs (\`fetch_user\`, \`validate_email\`).
### 4. Placeholder \`pass\`
Stub out unfinished functions with \`pass\`.
### 5. Ordering Rule
Define functions before calling them at top-level execution.`,
    examples: [
      ex('Misol 1: Define-time vs Call-time tartibi', 'Example 1: Define vs Call Order', `print("1. Before def")\ndef say_ready():\n    print("3. Inside function!")\nprint("2. After def")\nsay_ready()`, `1. Before def\n2. After def\n3. Inside function!`, 'Funksiya faqat `say_ready()` chaqirilganida ishladi.', 'The body executed only when invoked on the last line.'),
      ex('Misol 2: Bir nechta marta qayta chaqirish', 'Example 2: Reusing a Function', `def line_banner(title):\n    return f"=== {title.upper()} ==="\n\nprint(line_banner("start"))\nprint(line_banner("end"))`, `=== START ===\n=== END ===`, 'Bir xil shablon turli kirishlar bilan 2 marta ishlatildi.', 'Invoked the same definition with different arguments.'),
      ex('Misol 3: `pass` skeleti va funksiya ichidan chaqirish', 'Example 3: Main Entry Function', `def step_one():\n    return "loaded"\n\ndef main():\n    print("Status:", step_one())\n\nmain()`, `Status: loaded`, '`main()` oxirida chaqirilgani uchun `step_one()` allaqachon aniqlangan.', '`main()` runs at the end when all helpers are defined.'),
    ],
    traceTitleUz: 'Define va Call izi',
    traceTitleEn: 'Tracing Define vs Call',
    traceCode: `def hi(name):\n    return "Hi " + name\n\nprint(hi("Ali"))`,
    traceSteps: [
      traceStep(1, 'def hi(name):', 'hi=<fn>', 'Funksiya obyekt yaratildi', 'Created function object'),
      traceStep(2, 'hi("Ali")', 'name="Ali"', 'Funksiya chaqirildi', 'Invoked hi'),
      traceStep(3, 'return "Hi Ali"', '"Hi Ali"', 'Qiymat qaytdi', 'Returned string'),
      traceStep(4, 'print(...)', 'Hi Ali', 'Ekranga chiqdi', 'Printed', 'Hi Ali'),
    ],
    commonMistakes: [
      mistake('Funksiyani `def` dan oldin chaqirish', 'Calling Before Definition', `print(add(2, 3))\ndef add(a, b):\n    return a + b`, "NameError: name 'add' is not defined", `def add(a, b):\n    return a + b\nprint(add(2, 3))`, 'Python faylni tepadan pastga o‘qiydi.', 'Python evaluates definitions sequentially.', 'Avval `def`, keyin chaqiruv.', 'Define before top-level calls.'),
      mistake('`def` sarlavhasida ikki nuqta `:` unutish', 'Missing Colon on def', `def ping()\n    print("pong")`, 'SyntaxError: expected ":"', `def ping():\n    print("pong")\nping()`, 'Har bir blok sarlavhasi `:` bilan tugashi shart.', 'Header must end with a colon.', '`:` va 4 bo‘shliq indentatsiyani tekshiring.', 'Add `:` and indent body.'),
    ],
    compareTitleUz: 'Top-level kod vs `main()` funksiya',
    compareTitleEn: 'Top-Level Script vs `main()`',
    compareUz: ['Top-level: 5 qatorli kichik test skriptlar uchun.', '`main()`: haqiqiy ilovalarda barcha funksiyalar aniqlangach tartibli ishga tushirish uchun.'],
    compareEn: ['Top-level statements: quick tiny snippets.', '`main()` entry: cleaner structure once all functions are defined.'],
    compareSummaryUz: 'Kattaroq skriptlarda barcha `def` lardan keyin oxirida `main()` chaqirish tartibni saqlaydi.',
    compareSummaryEn: 'Group helper `def`s first and invoke `main()` at the bottom.',
    practiceTasks: [
      pt('p0502_1', '1-mashq: `cube(x)`', 'Task 1: cube(x)', '`cube(x)` funksiyasi `x ** 3` qaytarsin; `cube(3)` ni chiqaring.', 'Define cube(x) and print cube(3).', `def cube(x):\n    return x ** 3\nprint(cube(3))`, '27', 'x ** 3', 'Define and call.'),
      pt('p0502_2', '2-mashq: `greet(name)`', 'Task 2: greet(name)', '`greet("Bob")` -> `"Hello, Bob!"` qaytarsin.', 'Return greeting string.', `def greet(name):\n    return f"Hello, {name}!"\nprint(greet("Bob"))`, 'Hello, Bob!', 'f"Hello, {name}!"', 'Return f-string.'),
      pt('p0502_3', '3-mashq: `pass` funksiya', 'Task 3: Stub with pass', '`def todo(): pass` yaratib `print(todo())` chiqaring.', 'Define empty stub with pass and print its return.', `def todo():\n    pass\nprint(todo())`, 'None', 'Empty function returns None.', 'Use pass.'),
      pt('p0502_4', '4-mashq: Ketma-ket chaqiruv', 'Task 4: Reuse', '`inc(x)` (`x + 1`) bilan `inc(inc(10))` ni chiqaring.', 'Nest inc(inc(10)).', `def inc(x):\n    return x + 1\nprint(inc(inc(10)))`, '12', 'inc(inc(10))', 'Compose calls.'),
      pt('p0502_5', '5-mashq: `main()` naqshi', 'Task 5: main() Entry', '`get_ver()` `3.12` qaytarsin, `main()` uni chop etsin.', 'Call get_ver() from main().', `def get_ver():\n    return "3.12"\ndef main():\n    print(get_ver())\nmain()`, '3.12', 'Define both then call main().', 'Invoke main().'),
    ],
    quiz: [
      q('q0502_1', 'Python da funksiya qaysi kalit so‘z bilan yaratiladi?', 'Keyword to define a function?', ['func', 'function', 'def', 'fn'], ['func', 'function', 'def', 'fn'], 2, '`def` kalit so‘zi bilan.', '`def`.'),
      q('q0502_2', '`def` dan oldin funksiyani chaqirish qanday xato beradi?', 'Calling before `def` raises?', ['ValueError', 'NameError', 'SyntaxError', 'TypeError'], ['ValueError', 'NameError', 'SyntaxError', 'TypeError'], 1, '`NameError`.', '`NameError`.'),
      q('q0502_3', 'Bo‘sh funksiya tanasi xatosiz turishi uchun nima yoziladi?', 'Placeholder for an empty function body?', ['skip', 'pass', 'none', 'empty'], ['skip', 'pass', 'none', 'empty'], 1, '`pass`.', '`pass`.'),
      q('q0502_4', 'PEP 8 bo‘yicha funksiya nomi qanday yoziladi?', 'PEP 8 function naming style?', ['CamelCase', 'snake_case', 'UPPER_CASE', 'kebab-case'], ['CamelCase', 'snake_case', 'UPPER_CASE', 'kebab-case'], 1, '`snake_case`.', '`snake_case`.'),
      q('q0502_5', '`def f():` bajarilganda ichidagi `print` darhol ishlaydimi?', 'Does `def f(): print(1)` print immediately?', ['Ha', 'Yo‘q, faqat f() chaqirilganda', 'Faqat bir marta', 'Xato beradi'], ['Yes', 'No, only when called', 'Once automatically', 'Raises error'], 1, 'Faqat chaqirilganda ishlaydi.', 'Only when invoked.'),
    ],
    homework: hw('Harorat Konvertori Funksiyalari', 'Temperature Converter Functions', '`c_to_f(c)` va `f_to_c(f)` funksiyalarini yozib, `main()` ichidan bir nechta shahar haroratini aylantirib chiqaring.', 'Define `c_to_f(c)` and `f_to_c(f)` and call them from `main()`.', ['PEP 8 snake_case nomlar', 'main() funksiyasi oxirida chaqirilsin'], ['Use snake_case names', 'Invoke via main()'], 'return round(c * 9 / 5 + 32, 1)', 'Round cleanly.', 'Qaytgan qiymatni qaytadan teskari aylantirib tekshiring.', 'Verify round-trip conversion.', 15),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-05-03',
    courseId: 'functions',
    moduleId: 'c05_m1',
    order: 3,
    titleUz: 'Parameters va Arguments — kirish ma’lumotlarini uzatish',
    titleEn: 'Parameters vs Arguments & Pass-by-Object-Reference',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-05-02'],
    conceptId: 'parameters_arguments',
    whyUz: "Hamma `parameter` va `argument` so‘zlarini chalkashtiradi, lekin bundan ham muhimi: funksiyaga `int` berilganda tashqari o‘zgarmaydi, lekin `list` berilib ichida `.append()` qilinsa tashqi ro‘yxat ham o‘zgarib ketishi mumkin!",
    whyEn: 'Distinguishing parameters from arguments—and knowing how Python passes object references—prevents accidental mutation of caller lists and dicts.',
    analogyUz: "**Parameter** — bu avtoturargohdagi belgilangan bo‘sh joy (`def park(car):`). **Argument** — esa o‘sha joyga kelib turadigan haqiqiy mashina (`park(\"Cobalt\")`).",
    analogyEn: 'A **parameter** is the empty parking spot label in `def`; an **argument** is the actual car you park into it during a call.',
    stopsUz: "Python **Pass-by-Object-Reference** modelida ishlaydi: agar funksiyaga mutable (`list`, `dict`) berib ichida `.append()` yoki `d[k] = v` qilsangiz, tashqaridagi asl obyekt ham o‘zgaradi!",
    stopsEn: 'Python passes object references: mutating a passed `list` or `dict` inside a function mutates the caller’s original object.',
    objUz: ['Parameter (definition) va Argument (call) atamalarini farqlash', 'Positional argumentlarning tartib ahamiyatini tushunish', 'Funksiyaga uzatilgan mutable obyektlarni buzmaslik (`.copy()` yoki sof funksiya)'],
    objEn: ['Distinguish formal parameters from call arguments', 'Pass multiple positional arguments in exact order', 'Protect caller mutable objects from unintended in-place side effects'],
    theoryUz: `### 1. Parameter vs Argument
- **Parameter**: \`def power(base, exp):\` dagi \`base\` va \`exp\` (qolip o‘zgaruvchilari).
- **Argument**: \`power(2, 5)\` dagi haqiqiy qiymatlar \`2\` va \`5\`.
### 2. Positional Arguments Tartibi
Birinchi argument birinchi parametrga, ikkinchisi ikkinchisiga bog‘lanadi: \`power(5, 2)\` = \`25\`, lekin \`power(2, 5)\` = \`32\`.
### 3. Pass-by-Object-Reference Modeli
- Immutable (\`int\`, \`str\`, \`tuple\`): funksiya ichida \`x = x + 1\` tashqariga taʼsir qilmaydi.
- Mutable (\`list\`, \`dict\`): funksiya ichida \`lst.append(9)\` **tashqaridagi \`lst\` ni ham o‘zgartiradi**!
### 4. Qachon Xavfsiz Nusxa Olish Kerak?
Agar funksiya ro‘yxatni o‘zgartirib yangisini qaytarishi kerak bo‘lsa: \`result = items.copy()\` yoki \`sorted(items)\` ishlating.
### 5. Keng tarqalgan xato
Kerakli argument sonidan kam yoki ko‘p berish -> \`TypeError: missing/takes X positional arguments\`.`,
    theoryEn: `### 1. Parameter vs Argument
Parameters live in \`def\`; arguments are values passed at call time.
### 2. Positional Matching
Arguments match left-to-right unless named as keywords.
### 3. Pass-by-Object-Reference
Reassigning a parameter name never affects the caller; mutating a shared mutable container does.
### 4. Defensive Copying
Return a new list (\`[...]\` or \`.copy()\`) instead of mutating caller inputs silently.
### 5. Arity Mismatch
Missing or extra arguments trigger \`TypeError\`.`,
    examples: [
      ex('Misol 1: Positional tartib ahamiyati', 'Example 1: Positional Order', `def format_price(amount, currency):\n    return f"{amount} {currency}"\n\nprint(format_price(50000, "UZS"))`, `50000 UZS`, '1-argument `amount` ga, 2-argument `currency` ga tushdi.', 'Arguments bound positionally left-to-right.'),
      ex('Misol 2: Mutable argument side-effect vs Pure funksiya', 'Example 2: Protecting Caller Lists', `def add_safe(items, val):\n    return items + [val]\n\norig = [1, 2]\nupdated = add_safe(orig, 3)\nprint("orig:", orig, "| updated:", updated)`, `orig: [1, 2] | updated: [1, 2, 3]`, '`items + [val]` asl `orig` ro‘yxatini buzmasdan yangi ro‘yxat qaytardi.', 'Concatenation kept `orig` untouched.'),
      ex('Misol 3: Immutable qayta tayinlash tashqariga taʼsir qilmaydi', 'Example 3: Rebinding Locally', `def bump(n):\n    n += 10\n    return n\n\nx = 5\ny = bump(x)\nprint("x:", x, "| y:", y)`, `x: 5 | y: 15`, 'Tashqaridagi `x` `5` ligicha qoldi.', '`x` outside stays 5 while `y` receives 15.'),
    ],
    traceTitleUz: 'Mutable vs Rebind izi',
    traceTitleEn: 'Tracing Object Reference',
    traceCode: `def push(arr, x):\n    arr.append(x)\n\nbag = [1]\npush(bag, 2)\nprint(bag)`,
    traceSteps: [
      traceStep(1, 'bag = [1]', 'bag->[1]', 'Ro‘yxat yaratildi', 'List allocated'),
      traceStep(2, 'push(bag, 2)', 'arr->[1], x=2', 'arr ham shu ro‘yxatga bog‘landi', 'arr aliases bag'),
      traceStep(3, 'arr.append(2)', '[1, 2]', 'Joyida qo‘shildi', 'Mutated shared list'),
      traceStep(4, 'print(bag)', '[1, 2]', 'Tashqarida ham o‘zgarish ko‘rindi', 'Caller observes mutation', '[1, 2]'),
    ],
    commonMistakes: [
      mistake('Argument sonini noto‘g‘ri berish', 'Wrong Argument Count', `def add(a, b):\n    return a + b\nprint(add(5))`, "TypeError: add() missing 1 required positional argument: 'b'", `def add(a, b):\n    return a + b\nprint(add(5, 3))`, '2 ta parametr bo‘lsa chaqirganda ham 2 ta qiymat shart (default bo‘lmasa).', 'Call must supply all required parameters.', 'Parametrlar ro‘yxatini tekshiring.', 'Match required arity.'),
      mistake('Kirish ro‘yxatini sezdirmay buzib qo‘yish', 'Unexpected Caller Mutation', `def zero_first(nums):\n    nums[0] = 0\n    return nums\na = [9, 8]\nb = zero_first(a)\nprint(a)`, 'a unexpectedly mutated to [0, 8]', `def zero_first(nums):\n    res = nums.copy()\n    res[0] = 0\n    return res\na = [9, 8]\nb = zero_first(a)\nprint("a:", a, "b:", b)`, 'Agar funksiya qiymat qaytarsa, kirish ro‘yxatini joyida o‘zgartirmang.', 'Functions returning a new value should rarely mutate their inputs.', '`.copy()` dan foydalaning.', 'Copy before mutating.'),
    ],
    compareTitleUz: 'In-place Mutator vs Pure Function',
    compareTitleEn: 'In-Place Mutator vs Pure Function',
    compareUz: ['In-place (`return None`): masalan `list.sort()` — asl ro‘yxatni o‘zgartiradi.', 'Pure (`return new_obj`): masalan `sorted(x)` — kirishga tegmaydi, testlash oson.'],
    compareEn: ['In-place mutator: modifies caller object, typically returns `None`.', 'Pure function: leaves inputs intact and returns new output.'],
    compareSummaryUz: 'Imkon qadar kirish ma’lumotlarini o‘zgartirmaydigan **pure** funksiyalar yozing.',
    compareSummaryEn: 'Prefer pure functions that avoid surprising side effects on caller arguments.',
    practiceTasks: [
      pt('p0503_1', '1-mashq: 2 ta parametr', 'Task 1: Two Params', '`area(w, h)` `w * h` qaytarsin; `area(4, 7)` ni chiqaring.', 'Compute rectangle area.', `def area(w, h):\n    return w * h\nprint(area(4, 7))`, '28', 'w * h', 'Call area(4, 7).'),
      pt('p0503_2', '2-mashq: Tashqi x o‘zgarmaydi', 'Task 2: Local Rebind', '`f(x)` ichida `x = 99` qiling; tashqaridagi `a = 5` ni chiqaring.', 'Show caller int stays unchanged.', `def f(x):\n    x = 99\na = 5\nf(a)\nprint(a)`, '5', 'Rebinding is local.', 'Print a.'),
      pt('p0503_3', '3-mashq: Xavfsiz ro‘yxat nusxasi', 'Task 3: Pure Copy', '`append_safe(lst, v)` aslni o‘zgartirmay yangi list qaytarsin.', 'Return new list without mutating input.', `def append_safe(lst, v):\n    return [*lst, v]\na = [1]\nb = append_safe(a, 2)\nprint(a, b)`, '[1] [1, 2]', '[*lst, v] or lst.copy()', 'Keep original intact.'),
      pt('p0503_4', '4-mashq: Tartib farqi', 'Task 4: Positional Order', '`sub(a, b)` `a - b` qaytarsin; `sub(10, 3)` ni chiqaring.', 'Return a - b.', `def sub(a, b):\n    return a - b\nprint(sub(10, 3))`, '7', '10 goes to a, 3 to b.', 'Call sub(10, 3).'),
      pt('p0503_5', '5-mashq: 3 ta parametr', 'Task 5: Three Params', '`clamp(val, lo, hi)` yozib `clamp(15, 0, 10)` ni chiqaring.', 'Clamp value between lo and hi.', `def clamp(val, lo, hi):\n    return max(lo, min(hi, val))\nprint(clamp(15, 0, 10))`, '10', 'max(lo, min(hi, val))', 'Call clamp.'),
    ],
    quiz: [
      q('q0503_1', '`def calc(x, y):` dagi `x` va `y` nima deb ataladi?', 'What are `x` and `y` in `def calc(x, y):`?', ['Arguments', 'Parameters', 'Globals', 'Returns'], ['Arguments', 'Parameters', 'Globals', 'Returns'], 1, 'Ular funksiyaning formal **parametrlari**.', 'Formal parameters.'),
      q('q0503_2', 'Funksiyaga `list` berib ichida `.append()` qilsak tashqi list nima bo‘ladi?', 'Calling `.append()` on a passed list affects caller list?', ['O‘zgarmaydi', 'Tashqi list ham o‘zgaradi', 'Xato beradi', 'None ga aylanadi'], ['Unchanged', 'Caller list also mutates', 'Error', 'Becomes None'], 1, 'Ikkalasi bitta list obyektiga ishora qilgani uchun o‘zgaradi.', 'Both reference the same mutable list.'),
      q('q0503_3', 'Funksiyaga `int` berib ichida `n = 100` qilsak tashqi o‘zgaruvchi nima bo‘ladi?', 'Rebinding an `int` parameter inside a function affects caller?', ['O‘zgaradi', 'O‘zgarmaydi', 'None bo‘ladi', 'Xato'], ['Mutates caller', 'Caller stays unchanged', 'Becomes None', 'Error'], 1, 'Lokal qayta tayinlash tashqariga taʼsir qilmaydi.', 'Local rebinding stays local.'),
      q('q0503_4', 'Parametrdan kam argument berilsa qaysi xato chiqadi?', 'Error when too few arguments are passed?', ['ValueError', 'NameError', 'TypeError', 'IndexError'], ['ValueError', 'NameError', 'TypeError', 'IndexError'], 2, '`TypeError`.', '`TypeError`.'),
      q('q0503_5', 'Kirish ro‘yxatini o‘zgartirmaslikning eng toza usuli?', 'Safest way to avoid mutating caller list?', ['lst.copy() bilan ishlash', 'global yozish', 'del lst', 'print(lst)'], ['Copy input first', 'Use global', 'del lst', 'print(lst)'], 0, '`.copy()` yoki yangi list qurish.', 'Copy or build a new list.'),
    ],
    homework: hw('Xavfsiz Savat Hisoblagichi', 'Non-Mutating Cart Helper', '`add_tax_items(prices, tax_pct)` funksiyasini yozing: u asl `prices` ro‘yxatini o‘zgartirmagan holda soliq qo‘shilgan yangi ro‘yxat qaytarsin.', 'Write `add_tax_items(prices, tax_pct)` returning a new list with tax applied while preserving the original list.', ['Asl ro‘yxat o‘zgarmasin', 'Ikkalasini ham print qilib tasdiqlang'], ['Keep input unchanged', 'Print both lists'], 'return [round(p * (1 + tax_pct / 100), 2) for p in prices]', 'Return fresh list.', 'Eng qimmat mahsulotga qo‘shimcha 5% hashamat solig‘i qo‘shing.', 'Add luxury surcharge option.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-05-04',
    courseId: 'functions',
    moduleId: 'c05_m2',
    order: 4,
    titleUz: '`return` va `print()` farqi — natija qaytarish san’ati',
    titleEn: '`return` vs `print()`: Data Flow, Early Return & Tuple Returns',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-05-03'],
    conceptId: 'return_vs_print',
    whyUz: "Yangi boshlovchilarning 1-raqamli xatosi — `return` o‘rniga `print()` yozib qo‘yish va keyin `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'` xatosiga tushishdir.",
    whyEn: 'Confusing `print()` (console display returning `None`) with `return` (passing values back into code) breaks function composition.',
    analogyUz: "`print()` — bu do‘kondagi tabloda narxni **ko‘rsatish** (qo‘lingizga pul bermaydi). `return` — bu kassadan naqd **qaytimni qo‘lingizga uzatish** (keyin uni yana ishlata olasiz).",
    analogyEn: '`print()` displays a number on a scoreboard; `return` hands the actual value back to the caller for further math.',
    stopsUz: "`return` bajarilgan zahoti funksiya **darhol to‘xtaydi**! `return` dan keyingi qatorlar (dead code) hech qachon ishlamaydi. Bundan tashqari, `return` yozilmagan funksiya yashirincha `None` qaytaradi.",
    stopsEn: '`return` exits the function immediately; lines after it are dead code, and omitting `return` returns `None`.',
    objUz: ['`print()` (`None` qaytaradi) va `return` (qiymat qaytaradi) farqini aniq bilish', 'Guard clause (`if bad: return None` — early return) yozish', 'Bir nechta qiymatni tuple ko‘rinishida (`return lo, hi`) qaytarish'],
    objEn: ['Contrast `print()` (side effect returning `None`) with `return`', 'Apply early-return guard clauses to flatten nesting', 'Return multiple values cleanly as tuples'],
    theoryUz: `### 1. \`print()\` vs \`return\`
\`print(a + b)\` faqat ekranga chiqaradi va funksiya \`None\` qaytaradi -> \`add(2, 3) * 10\` xato beradi! \`return a + b\` esa natijani dasturga qaytaradi.
### 2. Yashirin \`return None\`
Agar funksiyada \`return\` bo‘lmasa yoki bo‘sh \`return\` yozilsa, Python avtomatik \`None\` qaytaradi.
### 3. Early Return (Guard Clause)
Ichma-ich 4 qavat \`if\` o‘rniga xato holatda darrov \`return\` qilib chiqib ketish kodni o‘qishni keskin yaxshilaydi.
### 4. Bir Nechta Qiymat Qaytarish
\`return min(arr), max(arr)\` aslida bitta **\`tuple\`** qaytaradi, chaqiruvchi esa \`lo, hi = stats(arr)\` qilib ochib oladi.
### 5. Keng tarqalgan xato
\`for\` siklining 1-qadamidayoq \`return\` yozib yuborish — sikl faqat 1-elementni tekshirib to‘xtaydi!`,
    theoryEn: `### 1. \`print()\` vs \`return\`
\`print()\` writes to stdout and evaluates to \`None\`; \`return\` passes an object back to the caller.
### 2. Implicit \`None\`
Functions falling off the end return \`None\`.
### 3. Early Return Guard Clauses
Exit early on invalid inputs to keep main logic flat.
### 4. Returning Multiple Values
\`return a, b\` packs a tuple that callers unpack easily.
### 5. Premature Return Inside Loops
Putting \`return\` in an \`else\` branch inside a loop stops on the very first iteration!`,
    examples: [
      ex('Misol 1: `return` qiymatini keyingi hisobda ishlatish', 'Example 1: Composing Returned Values', `def square(n):\n    return n * n\n\nresult = square(3) + square(4)\nprint("3^2 + 4^2 =", result)`, `3^2 + 4^2 = 25`, '`return` bo‘lgani uchun ikkita natijani qo‘sha oldik.', 'Returned values compose directly in arithmetic expressions.'),
      ex('Misol 2: Early Return (Guard Clause)', 'Example 2: Early Return Guard Clause', `def safe_divide(a, b):\n    if b == 0:\n        return None\n    return round(a / b, 2)\n\nprint(safe_divide(10, 4), safe_divide(10, 0))`, `2.5 None`, 'Nolga bo‘lish tekshiruvi boshidayoq to‘xtatdi.', 'Guard clause avoids ZeroDivisionError cleanly.'),
      ex('Misol 3: Bir nechta qiymat (`tuple`) qaytarish', 'Example 3: Returning Multiple Values', `def min_max(nums):\n    return min(nums), max(nums)\n\nlo, hi = min_max([12, 4, 29, 8])\nprint(f"Min={lo}, Max={hi}")`, `Min=4, Max=29`, 'Tuple unpacking bilan ikkala natija bir qatorda olindi.', 'Packed tuple returned and unpacked at call site.'),
    ],
    traceTitleUz: 'Sikl ichidagi erta return xatosi vs to‘g‘risi',
    traceTitleEn: 'Tracing Loop Early Return',
    traceCode: `def has_zero(nums):\n    for n in nums:\n        if n == 0:\n            return True\n    return False\n\nprint(has_zero([3, 0, 5]))`,
    traceSteps: [
      traceStep(1, 'n = 3 -> n == 0 False', 'continue', 'Sikl davom etdi', 'Loop continues'),
      traceStep(2, 'n = 0 -> n == 0 True', 'return True', 'Darhol True bilan chiqdi', 'Returned True immediately'),
      traceStep(3, 'print(...)', 'True', 'False ga yetib bormadi', 'Output printed', 'True'),
    ],
    commonMistakes: [
      mistake('`return` o‘rniga `print()` yozish', 'Using print() Instead of return', `def add(a, b):\n    print(a + b)\n\nx = add(2, 3) + 10`, "TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'", `def add(a, b):\n    return a + b\nx = add(2, 3) + 10\nprint(x)`, '`print()` qiymat qaytarmaydi (`None` qaytaradi).', '`print()` returns `None`.', 'Hisoblovchi funksiyada doim `return` yozing.', 'Always use `return` to pass values back.'),
      mistake('Siklda `else: return False` yozib yuborish', 'Premature return in Loop else', `def has_even(nums):\n    for n in nums:\n        if n % 2 == 0:\n            return True\n        else:\n            return False\nprint(has_even([1, 2]))`, 'Wrongly prints False (stopped at 1!)', `def has_even(nums):\n    for n in nums:\n        if n % 2 == 0:\n            return True\n    return False\nprint(has_even([1, 2]))`, '`1` toq bo‘lgani uchun `else` darrov 1-qadamda `False` qaytarib yubordi.', 'Returning inside `else` aborted before checking item 2.', '`return False` ni sikldan **keyin** (tashqarisiga) yozing.', 'Place fallback `return False` after the loop.'),
    ],
    compareTitleUz: 'Ichma-ich `if/else` vs Early Return',
    compareTitleEn: 'Deep Nesting vs Early Return',
    compareUz: ['Ichma-ich `if/else`: ko‘p qavat o‘ngga surilib o‘qishni qiyinlashtiradi.', 'Early Return: chekka holatlarni boshida qaytarib, asosiy mantiqni tekis saqlaydi.'],
    compareEn: ['Deeply nested `if/else`: hard to follow indentation.', 'Early return guards: flat, clear happy-path code.'],
    compareSummaryUz: 'Xato yoki bo‘sh holatda funksiya boshidayoq `return` qilib chiqib keting.',
    compareSummaryEn: 'Use guard clauses at the top of functions to reduce nesting.',
    practiceTasks: [
      pt('p0504_1', '1-mashq: `return` qiymati', 'Task 1: Return Math', '`mul(a, b)` `a * b` qaytarsin; `mul(3, 4) + 2` ni chiqaring.', 'Compose return value with + 2.', `def mul(a, b):\n    return a * b\nprint(mul(3, 4) + 2)`, '14', 'Use return a * b', 'Multiply then add 2.'),
      pt('p0504_2', '2-mashq: Tuple return', 'Task 2: Return Tuple', '`divmod_pair(a, b)` `(a // b, a % b)` qaytarsin.', 'Return quotient and remainder.', `def divmod_pair(a, b):\n    return a // b, a % b\nq, r = divmod_pair(17, 5)\nprint(q, r)`, '3 2', 'return a // b, a % b', 'Unpack q, r.'),
      pt('p0504_3', '3-mashq: Sikldan keyin return', 'Task 3: Search Loop', '`contains_neg(arr)` manfiy son bo‘lsa `True`, bo‘lmasa sikldan keyin `False` qaytarsin.', 'Check if list contains negative number.', `def contains_neg(arr):\n    for x in arr:\n        if x < 0:\n            return True\n    return False\nprint(contains_neg([1, 2, -3]))`, 'True', 'Put return False outside for loop.', 'Test with [1, 2, -3].'),
      pt('p0504_4', '4-mashq: Guard clause', 'Task 4: Early Return', 'Bo‘sh string bo‘lsa `"Empty"`, aks holda `.upper()` qaytaring.', 'Return "Empty" for empty text.', `def shout(s):\n    if not s:\n        return "Empty"\n    return s.upper()\nprint(shout(""), shout("hi"))`, 'Empty HI', 'if not s: return "Empty"', 'Use guard clause.'),
      pt('p0504_5', '5-mashq: Yashirin None', 'Task 5: Implicit None', '`return` siz funksiyani chaqirib `is None` ekanini chiqaring.', 'Verify implicit None return.', `def noop():\n    x = 1\nprint(noop() is None)`, 'True', 'No return -> None.', 'Check is None.'),
    ],
    quiz: [
      q('q0504_1', '`return` siz funksiya nima qaytaradi?', 'What does a function without `return` return?', ['0', '""', 'None', 'Error'], ['0', '""', 'None', 'Error'], 2, 'Avtomatik `None`.', 'Implicitly `None`.'),
      q('q0504_2', '`return 1, 2` qanday tur qaytaradi?', 'Type returned by `return 1, 2`?', ['list', 'tuple', 'set', 'dict'], ['list', 'tuple', 'set', 'dict'], 1, '`tuple` (`(1, 2)`).', '`tuple`.'),
      q('q0504_3', '`return` dan keyingi qatorlar qachon ishlaydi?', 'When do lines after `return` execute?', ['Har doim', 'Hech qachon', 'Faqat debug da', 'Oxirida'], ['Always', 'Never', 'Debug only', 'At exit'], 1, 'Hech qachon — `return` funksiyani tugatadi.', 'Never—dead code.'),
      q('q0504_4', '`print()` qaytargan qiymatga `5` qo‘shilsa nima bo‘ladi?', 'Result of `print("hi") + 5`?', ['hi5', '5', 'TypeError', 'None'], ['hi5', '5', 'TypeError', 'None'], 2, '`None + 5` -> `TypeError`.', '`TypeError`.'),
      q('q0504_5', 'Sikl ichida element topilmasa `return False` qayerda turishi kerak?', 'Where should fallback `return False` sit in search loop?', ['if ichida', 'else ichida', 'Sikldan tashqarida (keyin)', 'def dan tepada'], ['Inside if', 'Inside else', 'After the loop', 'Above def'], 2, 'Butun sikl tugagandan keyin.', 'After the loop finishes.'),
    ],
    homework: hw('Sikl va Guard Clause Validator', 'Password Strength Function', '`check_password(pw)` funksiyasini early-return bilan yozing: uzunligi `< 8` bo‘lsa `"Too short"`, raqam bo‘lmasa `"Need digit"`, aks holda `"Strong"` qaytarsin.', 'Write `check_password(pw)` using early returns for length `< 8`, missing digit (`any(c.isdigit())`), or `"Strong"`.', ['Kamida 2 ta early return', 'Sikldan keyin to‘g‘ri return'], ['Use early returns', 'No premature else-return'], 'if not any(c.isdigit() for c in pw): return "Need digit"', 'Use any() cleanly.', 'Katta harf borligini ham tekshiruvchi shart qo‘shing.', 'Add uppercase check.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-05-05',
    courseId: 'functions',
    moduleId: 'c05_m2',
    order: 5,
    titleUz: 'Default Arguments va Mutable Default Tuzog‘i',
    titleEn: 'Default Arguments & the Mutable Default Trap',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-05-04'],
    conceptId: 'default_arguments',
    whyUz: "Har safar barcha parametrlarni yozish noqulay — masalan `round(x, 2)` da 2-parametr ko‘pincha standart bo‘ladi. Lekin Python'ning default argumentlari qachon hisoblanishini bilmaslik mashhur intervyu xatosiga olib keladi!",
    whyEn: 'Default parameter values simplify APIs, yet Python’s single define-time evaluation creates the famous mutable default argument trap.',
    analogyUz: "Parametr defaulti `def add(item, box=[])` — bu zalga hamma uchun **bitta umumiy** savat qo‘yib qo‘yish: 1-mijoz solgan narsani 2-mijoz ham savatda ko‘radi! To‘g‘risi: `box=None` qilib har safar yangi savat berish.",
    analogyEn: 'Writing `box=[]` puts one shared basket by the door for every caller; `box=None` gives each caller a fresh basket.',
    stopsUz: "Default qiymat **funksiya `def` qilinganda FAQAT BIR MARTA** yaratiladi! Shuning uchun `def f(items=[])` yoki `cache={}` **MUTLAQO TAQIQLANADI** — doim `items=None` va ichida `if items is None: items = []` yozing.",
    stopsEn: 'Default values are evaluated ONCE at `def` time! Always use `None` as sentinel for mutable defaults (`if items is None: items = []`).',
    objUz: ['Majburiy (non-default) parametrlardan keyin default parametrlarni yozish', 'Mutable default argument (`=[]` / `={}`) tuzog‘ini tushunish va tuzatish', '`None` sentinel qoidasini har doim qo‘llash'],
    objEn: ['Place default parameters after required positional parameters', 'Explain why mutable defaults leak across calls', 'Apply the `param=None` sentinel pattern safely'],
    theoryUz: `### 1. Default Parametr Yozish Qoidasi
\`def power(base, exp=2):\` -> \`power(5)\` = \`25\`, \`power(5, 3)\` = \`125\`.
**Muhim qoida**: Default parametrdan keyin oddiy (default siz) parametr kelishi **mumkin emas** (\`SyntaxError\`).
### 2. Mashhur Tuzoq: \`def add(x, bucket=[]):\`
Python \`def\` qatorini o‘qiganda bitta \`[]\` yaratib funksiyaga yopishtirib qo‘yadi. Keyingi barcha chaqiruvlar o‘sha bitta ro‘yxatga qo‘shaveradi!
### 3. Yagona To‘g‘ri Yechim: \`None\` Sentinel
\`\`\`python
def add(x, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(x)
    return bucket
\`\`\`
### 4. Nima Uchun \`bucket or []\` Xavfli?
Agar foydalanuvchi atayin bo‘sh ro‘yxat \`my_list = []\` bersa, \`my_list or []\` yangi ro‘yxat ochib yuborib asl \`my_list\` ga qo‘shmaydi! Shuning uchun aynan \`if bucket is None:\` kerak.
### 5. Keng tarqalgan xato
\`def f(a=1, b):\` -> \`SyntaxError: parameter without a default follows parameter with a default\`.`,
    theoryEn: `### 1. Syntax Rule
Required parameters must precede default parameters.
### 2. Mutable Default Bug
\`def f(items=[]):\` reuses the same list across every call without explicit arg.
### 3. The \`None\` Sentinel Fix
Default to \`None\` and initialize \`items = []\` inside the body when \`items is None\`.
### 4. Why \`is None\` Beats \`or []\`
If a caller intentionally passes an empty list, \`items or []\` silently discards it.
### 5. Parameter Ordering Error
\`def bad(a=1, b):\` triggers \`SyntaxError\`.`,
    examples: [
      ex('Misol 1: Oddiy default parametr', 'Example 1: Standard Defaults', `def greet(name, prefix="Salom"):\n    return f"{prefix}, {name}!"\n\nprint(greet("Ali"))\nprint(greet("Ali", "Assalom"))`, `Salom, Ali!\nAssalom, Ali!`, '2-argument berilmasa default `"Salom"` ishlatildi.', 'Used default prefix when omitted and custom prefix when passed.'),
      ex('Misol 2: `None` sentinel bilan xavfsiz ro‘yxat', 'Example 2: Safe None Sentinel', `def add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(tag)\n    return tags\n\nprint(add_tag("py"))\nprint(add_tag("sql"))`, `['py']\n['sql']`, 'Har bir chaqiruv mustaqil toza ro‘yxat oldi!', 'Each call got an isolated fresh list.'),
      ex('Misol 3: Mavjud ro‘yxatni uzatish', 'Example 3: Passing Explicit List', `def push_log(msg, logs=None):\n    if logs is None:\n        logs = []\n    logs.append(msg)\n    return logs\n\nbuf = ["boot"]\npush_log("ready", buf)\nprint(buf)`, `['boot', 'ready']`, '`is None` tekshiruvi mavjud `buf` ga to‘g‘ri qo‘shdi.', 'Explicit list argument remained wired cleanly.'),
    ],
    traceTitleUz: 'Mutable default tuzog‘i izi',
    traceTitleEn: 'Tracing Mutable Default Leak',
    traceCode: `def buggy(x, arr=[]):\n    arr.append(x)\n    return arr\n\nprint(buggy(1))\nprint(buggy(2))`,
    traceSteps: [
      traceStep(1, 'def buggy(x, arr=[]):', 'default=[]', 'Bitta default list yaratildi', 'Single default list created at def time'),
      traceStep(2, 'buggy(1)', '[1]', 'O‘sha listga 1 qo‘shildi', 'Mutated shared default', '[1]'),
      traceStep(3, 'buggy(2)', '[1, 2]', 'Yangi list emas, eski [1] ga 2 qo‘shildi!', 'Reused mutated default!', '[1, 2]'),
    ],
    commonMistakes: [
      mistake('`items=[]` default qilib qo‘yish', 'Shared Mutable Default List', `def add(x, box=[]):\n    box.append(x)\n    return box\nadd(1)\nprint(add(2))`, 'Unexpectedly prints [1, 2]', `def add(x, box=None):\n    if box is None:\n        box = []\n    box.append(x)\n    return box\nadd(1)\nprint(add(2))`, 'Default `[]` barcha chaqiruvlar orasida umumiy qoladi.', 'Default `[]` is shared across calls.', 'Doim `box=None` + `if box is None: box = []` yozing.', 'Always use `None` sentinel.'),
      mistake('Default parametrni oddiydan oldinga qo‘yish', 'Non-Default After Default', `def calc(rate=0.1, amount):\n    return amount * rate`, 'SyntaxError: parameter without a default follows parameter with a default', `def calc(amount, rate=0.1):\n    return amount * rate\nprint(calc(100))`, 'Avval majburiy parametrlar, keyin defaultlar yoziladi.', 'Required params must precede defaults.', '`amount` ni oldinga o‘tkazing.', 'Reorder parameters.'),
    ],
    compareTitleUz: '`items=None` vs `items=[]`',
    compareTitleEn: '`items=None` vs `items=[]`',
    compareUz: ['`items=[]`: bug — har chaqiruvda eski qiymatlar to‘planib boradi.', '`items=None`: xavfsiz standart — har chaqiruv yangi bo‘sh ro‘yxat oladi.'],
    compareEn: ['`items=[]`: shared-state bug across calls.', '`items=None`: fresh list initialized on each call.'],
    compareSummaryUz: 'Hech qachon `list`, `dict`, `set` ni funksiya default qiymati qilib bermang!',
    compareSummaryEn: 'Never use mutable objects (`[]`, `{}`) as default parameter values.',
    practiceTasks: [
      pt('p0505_1', '1-mashq: Default chegirma', 'Task 1: Default Rate', '`discount(price, pct=10)` yozib `discount(200)` ni chiqaring.', 'Apply default 10% discount.', `def discount(price, pct=10):\n    return price * (100 - pct) // 100\nprint(discount(200))`, '180', 'pct=10', 'Call with 1 arg.'),
      pt('p0505_2', '2-mashq: `None` sentinel', 'Task 2: Safe Sentinel', '`collect(v, box=None)` yozib `collect(1)` va `collect(2)` ni chiqaring.', 'Use None sentinel.', `def collect(v, box=None):\n    if box is None:\n        box = []\n    box.append(v)\n    return box\nprint(collect(1), collect(2))`, '[1] [2]', 'if box is None: box = []', 'Test twice.'),
      pt('p0505_3', '3-mashq: Dict sentinel', 'Task 3: Dict Sentinel', '`set_cfg(k, v, cfg=None)` yozib `set_cfg("a", 1)` ni chiqaring.', 'Safe default dict.', `def set_cfg(k, v, cfg=None):\n    if cfg is None:\n        cfg = {}\n    cfg[k] = v\n    return cfg\nprint(set_cfg("a", 1))`, "{'a': 1}", 'cfg=None', 'Check is None.'),
      pt('p0505_4', '4-mashq: Parametr tartibi', 'Task 4: Param Order', '`power(base, exp=2)` bilan `power(4)` va `power(2, 3)` ni chiqaring.', 'Default exp=2.', `def power(base, exp=2):\n    return base ** exp\nprint(power(4), power(2, 3))`, '16 8', 'Required base first.', 'Call with 1 and 2 args.'),
      pt('p0505_5', '5-mashq: Mavjud listni saqlash', 'Task 5: Explicit Empty List', '`out = []` ni `collect(9, out)` ga berib `out` ni chiqaring.', 'Pass explicit empty list.', `def collect(v, box=None):\n    if box is None:\n        box = []\n    box.append(v)\n    return box\nout = []\ncollect(9, out)\nprint(out)`, '[9]', 'Use is None (not or []).', 'Check out == [9].'),
    ],
    quiz: [
      q('q0505_1', 'Default argument qiymati qachon hisoblanadi?', 'When are default arguments evaluated?', ['Har chaqiruvda', 'Faqat def paytida 1 marta', 'Dastur oxirida', 'Hech qachon'], ['Every call', 'Once at def time', 'At exit', 'Never'], 1, 'Funksiya aniqlangan (`def`) paytida 1 marta.', 'Once when `def` executes.'),
      q('q0505_2', '`def f(a=None): if a is None: a = []` nima uchun yoziladi?', 'Why use `a=None` sentinel?', ['Tezroq ishlashi uchun', 'Mutable default birikib ketmasligi uchun', 'SyntaxError bermaslik uchun', 'Global qilish uchun'], ['Speed', 'Avoid shared mutable default across calls', 'Avoid SyntaxError', 'Make global'], 1, 'Chaqiruvlar orasida holat sizib chiqishini to‘xtatadi.', 'Prevents cross-call state leakage.'),
      q('q0505_3', '`def f(a=1, b):` qanday xato beradi?', 'Error for `def f(a=1, b):`?', ['TypeError', 'SyntaxError', 'NameError', 'ValueError'], ['TypeError', 'SyntaxError', 'NameError', 'ValueError'], 1, '`SyntaxError`.', '`SyntaxError`.'),
      q('q0505_4', '`def g(x, lst=[]): lst.append(x); return lst` -> `g(1); print(g(2))` natijasi?', 'Output of calling `g(1)` then `print(g(2))`?', ['[2]', '[1, 2]', '[1]', 'Error'], ['[2]', '[1, 2]', '[1]', 'Error'], 1, '`[1, 2]` chiqadi!', '`[1, 2]`.'),
      q('q0505_5', 'Default parametri yo‘q argumentlar qaysi tomonda turadi?', 'Where must required params sit relative to defaults?', ['Chapda (oldinda)', 'O‘ngda (oxirida)', 'Istalgan joyda', 'O‘rtada'], ['On the left', 'On the right', 'Anywhere', 'In middle'], 0, 'Chapda (oldinda).', 'Before default params.'),
    ],
    homework: hw('Xavfsiz Log Yig‘uvchi Funksiya', 'Safe Session Log Helper', '`record_event(event, log=None)` funksiyasini tuzing — u har safar `log` berilmasa yangi sessiya ro‘yxati ochsin, berilsa o‘sha ro‘yxatga qo‘shsin.', 'Implement `record_event(event, log=None)` supporting both isolated sessions and shared session logs safely.', ['None sentinel ishlatish', 'Ikki mustaqil sessiyani test qilish'], ['Use None sentinel', 'Verify isolation across two sessions'], 'if log is None: log = []', 'Initialize fresh list inside body.', 'Har bir yozuvga avtomatik tartib raqami (`1. ...`) qo‘shing.', 'Auto-number log entries.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-05-06',
    courseId: 'functions',
    moduleId: 'c05_m2',
    order: 6,
    titleUz: 'Keyword Arguments, `/` & `*` chegaralari va Review #10',
    titleEn: 'Keyword Arguments, `/` & `*` Separators & Review #10',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-05-05'],
    conceptId: 'keyword_arguments',
    whyUz: "`send_email(\"ali@x.uz\", \"Salom\", True, False, 3)` chaqiruvida `True, False, 3` nimani anglatishini hech kim tushunmaydi! Keyword argumentlar va `*` chegaralari funksiyangizni o‘zini-o‘zi tushuntiradigan API ga aylantiradi.",
    whyEn: 'Keyword arguments turn cryptic positional flags (`True, False, 3`) into self-documenting calls (`retry=True, tls=False, timeout=3`).',
    analogyUz: "Positional argument — bu konvertga manzil yozmay qo‘lga berish (tartibi almashsa adashadi). Keyword argument — bu aniq `\"Kimga\": ..., \"Mavzu\": ...` deb yorliqlash (tartibini almashtirsangiz ham adashmaydi!).",
    analogyEn: 'Positional args rely on envelope slot order; keyword args attach explicit `name=value` labels so order cannot be confused.',
    stopsUz: "Chaqiruvda **keyword** argumentdan keyin **positional** argument yozib bo‘lmaydi (`f(a=1, 2)` -> `SyntaxError`)! Shuningdek `def f(x, *, strict=True):` dagi `*` dan keyingi parametrlar **majburan keyword** bilan berilishi shart!",
    stopsEn: 'In calls, positional args cannot follow keyword args; in `def f(x, *, strict=True):`, everything after `*` is keyword-only.',
    objUz: ['Positional va Keyword argumentlarni to‘g‘ri aralashtirish', 'Keyword-only (`*`) va Positional-only (`/`) parametr chegaralarini o‘rganish', 'Boolean flag parametrlarni `*` ortida xavfsiz qilish'],
    objEn: ['Mix positional and keyword arguments safely', 'Enforce keyword-only parameters via `*` and positional-only via `/`', 'Improve API clarity by requiring keywords for flags'],
    theoryUz: `### 1. Keyword Arguments Nima?
\`create_user(name="Ali", role="admin", active=True)\` — tartibi almashsa ham nomidan bog‘lanadi va kod o‘qilishi 10 barobar oshadi!
### 2. Chaqiruv Tartibi Qoidasi
Avval **positional**, keyin **keyword**: \`create_user("Ali", active=True, role="admin")\`. Teskarisi \`SyntaxError\`!
### 3. Keyword-Only (\`*\`) Chegarasi
\`def connect(host, *, timeout=5, ssl=True):\` -> \`connect("localhost", 10)\` **xato** beradi! Faqat \`connect("localhost", timeout=10)\` ishlaydi. Bu flag parametrlar adashishini 100% yo‘qotadi.
### 4. Positional-Only (\`/\`, Python 3.8+)
\`def round_val(num, /, ndigits=2):\` -> \`/\` dan chapdagilar faqat positional berilishi mumkin (masalan built-in \`len(obj, /)\`).
### 5. Keng tarqalgan xato
\`f(x=1, 2)\` -> \`SyntaxError: positional argument follows keyword argument\`.`,
    theoryEn: `### 1. Self-Documenting Calls
Passing \`timeout=5, ssl=True\` eliminates mystery boolean flags.
### 2. Call Ordering Rule
Positional arguments must precede keyword arguments in every call.
### 3. Keyword-Only Parameters (\`*\`)
Parameters after \`*\` in \`def\` must be passed by name.
### 4. Positional-Only Parameters (\`/\`)
Parameters before \`/\` cannot be passed as keywords.
### 5. Invalid Call Syntax
\`fn(a=1, 2)\` triggers \`SyntaxError\`.`,
    examples: [
      ex('Misol 1: Keyword argumentlar va tartib mustaqilligi', 'Example 1: Keyword Order Independence', `def book(title, author, year):\n    return f"{title} — {author} ({year})"\n\nprint(book(year=2024, title="Python", author="Ali"))`, `Python — Ali (2024)`, 'Nom orqali uzatilgani uchun tartibi muhim bo‘lmadi.', 'Named arguments bound cleanly regardless of order.'),
      ex('Misol 2: `*` keyword-only chegarasi', 'Example 2: Enforcing Keyword-Only Flags', `def query(sql, *, limit=10, dry_run=False):\n    return f"{sql} [limit={limit}, dry={dry_run}]"\n\nprint(query("SELECT *", limit=50))`, `SELECT * [limit=50, dry=False]`, '`*` tufayli `limit` va `dry_run` faqat nom bilan uzatilishi shart.', 'Star separator requires explicit `limit=` and `dry_run=`.'),
      ex('Misol 3: Positional + Keyword aralashmasi', 'Example 3: Mixed Call Style', `def send(to, subject, *, urgent=False):\n    tag = "[URGENT] " if urgent else ""\n    return f"{tag}To {to}: {subject}"\n\nprint(send("dev@site.uz", "Deploy", urgent=True))`, `[URGENT] To dev@site.uz: Deploy`, 'Asosiy ma’lumotlar positional, flag esa keyword bilan berildi.', 'Positional core args paired with keyword flag.'),
    ],
    traceTitleUz: 'Keyword bog‘lanish izi',
    traceTitleEn: 'Tracing Keyword Binding',
    traceCode: `def f(a, *, b=10):\n    return a + b\n\nprint(f(5, b=20))`,
    traceSteps: [
      traceStep(1, '5 -> a', 'a=5', 'Positional a bog‘landi', 'Bound positional a'),
      traceStep(2, 'b=20 -> b', 'b=20', '* ortidagi keyword b bog‘landi', 'Bound keyword-only b'),
      traceStep(3, 'return 5 + 20', '25', 'Natija qaytdi', 'Returned 25', '25'),
    ],
    commonMistakes: [
      mistake('Keyword dan keyin positional argument berish', 'Positional After Keyword', `def f(a, b):\n    return a + b\nprint(f(a=1, 2))`, 'SyntaxError: positional argument follows keyword argument', `def f(a, b):\n    return a + b\nprint(f(1, b=2))`, 'Keyword boshlangach qolgan hamma argument ham keyword bo‘lishi shart.', 'All arguments after a keyword arg must also be keyword args.', 'Avval positional, keyin keyword yozing.', 'Put positional args first.'),
      mistake('Bitta parametrga ham positional, ham keyword berish', 'Duplicate Argument Value', `def f(x):\n    return x\nprint(f(5, x=5))`, "TypeError: f() got multiple values for argument 'x'", `def f(x):\n    return x\nprint(f(x=5))`, '`5` allaqachon `x` ga tushgan edi.', '`5` already bound parameter `x`.', 'Har parametrga qiymatni 1 marta bering.', 'Pass each parameter once.'),
    ],
    compareTitleUz: 'Oddiy parametr vs `*` Keyword-Only',
    compareTitleEn: 'Regular Params vs `*` Keyword-Only',
    compareUz: ['Oddiy: 1–2 ta asosiy argumentlar uchun qulay (`add(2, 3)`).', '`*` Keyword-Only: boolean flaglar va sozlamalar (`timeout=5, strict=True`) uchun xavfsiz.'],
    compareEn: ['Regular params: natural for 1–2 obvious positional inputs.', 'Keyword-only (`*`): prevents transposed boolean or numeric options.'],
    compareSummaryUz: '3 tadan ortiq parametri bor funksiyalarda sozlama va boolean flaglarni `*` dan keyin qo‘ying.',
    compareSummaryEn: 'Place optional flags and settings after `*` in multi-parameter APIs.',
    practiceTasks: [
      pt('p0506_1', '1-mashq: Teskari tartib keyword', 'Task 1: Reordered Keyword Call', '`sub(a, b)` ni `sub(b=3, a=10)` ko‘rinishida chaqiring.', 'Call sub(b=3, a=10).', `def sub(a, b):\n    return a - b\nprint(sub(b=3, a=10))`, '7', 'Keywords match by name.', 'Call sub(b=3, a=10).'),
      pt('p0506_2', '2-mashq: Keyword-only `*`', 'Task 2: Star Separator', '`fmt(val, *, unit="kg")` yozib `fmt(5, unit="g")` ni chiqaring.', 'Enforce keyword-only unit.', `def fmt(val, *, unit="kg"):\n    return f"{val}{unit}"\nprint(fmt(5, unit="g"))`, '5g', 'Put * before unit.', 'Call with unit="g".'),
      pt('p0506_3', '3-mashq: Aralash chaqiruv', 'Task 3: Positional + Keyword', '`rect(w, h)` ni `rect(4, h=5)` deb chaqiring.', 'Mix positional and keyword.', `def rect(w, h):\n    return w * h\nprint(rect(4, h=5))`, '20', 'Positional first.', 'Call rect(4, h=5).'),
      pt('p0506_4', '4-mashq: Positional-only `/`', 'Task 4: Positional-Only /', '`def inc(x, /): return x + 1` yozib `inc(9)` ni chiqaring.', 'Use / separator.', `def inc(x, /):\n    return x + 1\nprint(inc(9))`, '10', 'def inc(x, /):', 'Call inc(9).'),
      pt('p0506_5', '5-mashq: Ikkala chegara `/, *`', 'Task 5: Combine / and *', '`def tag(txt, /, *, wrap="[")`: `tag("ok", wrap="(")` -> `"(ok("` chiqaring.', 'Combine / and *.', `def tag(txt, /, *, wrap="["):\n    return f"{wrap}{txt}{wrap}"\nprint(tag("ok", wrap="("))`, '(ok(', 'txt before /, wrap after *.', 'Call cleanly.'),
    ],
    quiz: [
      q('q0506_1', '`def f(a, *, b):` da `f(1, 2)` chaqiruvi nima bo‘ladi?', 'Result of `f(1, 2)` when `def f(a, *, b):`?', ['3', 'TypeError', 'SyntaxError', 'None'], ['3', 'TypeError', 'SyntaxError', 'None'], 1, '`b` faqat keyword (`b=2`) bilan berilishi shart (`TypeError`).', '`TypeError`—`b` is keyword-only.'),
      q('q0506_2', 'Qaysi chaqiruv **SyntaxError** beradi?', 'Which call raises `SyntaxError`?', ['f(1, b=2)', 'f(a=1, b=2)', 'f(a=1, 2)', 'f(b=2, a=1)'], ['f(1, b=2)', 'f(a=1, b=2)', 'f(a=1, 2)', 'f(b=2, a=1)'], 2, 'Keyword dan keyin positional (`2`) keldi.', 'Positional after keyword.'),
      q('q0506_3', '`def g(x, /, y):` dagi `/` nimani cheklaydi?', 'What does `/` restrict in `def g(x, /, y):`?', ['x faqat positional bo‘lishi shart', 'y faqat positional', 'x default bo‘ladi', 'Ikkalasi keyword'], ['x is positional-only', 'y is positional-only', 'x has default', 'Both keyword'], 0, '`/` dan chapdagilar faqat positional.', 'Parameters left of `/` are positional-only.'),
      q('q0506_4', '`f(5, x=5)` (`def f(x):`) qanday xato beradi?', 'Error for `f(5, x=5)`?', ['SyntaxError', 'TypeError (multiple values)', 'ValueError', 'NameError'], ['SyntaxError', 'TypeError (multiple values)', 'ValueError', 'NameError'], 1, '`TypeError: got multiple values for argument`.', '`TypeError`.'),
      q('q0506_5', 'Keyword argumentlarning asosiy foydasi?', 'Primary benefit of keyword arguments?', ['Tartibdan mustaqillik va o‘qilishi aniqligi', 'Kod sekinlashadi', 'Faqat int uchun', 'Return ni o‘chiradi'], ['Clarity and order independence', 'Slower code', 'Ints only', 'Disables return'], 0, 'O‘qilishi ravon va tartibdan mustaqil.', 'Order independence and clarity.'),
    ],
    homework: hw('Xavfsiz API So‘rov Quruvchi', 'Keyword-Safe API Builder', '`build_url(path, *, version="v1", https=True)` funksiyasini yozing va turli parametrlar bilan 3 ta URL yarating.', 'Define `build_url(path, *, version="v1", https=True)` enforcing keyword-only options.', ['* chegarasini qo‘llang', 'Path boshida / bor-yo‘qligini tekshiring'], ['Use * separator', 'Normalize leading slash'], 'scheme = "https" if https else "http"', 'Format scheme + version + path.', 'Ixtiyoriy `limit=20` keyword parametrini query string sifatida qo‘shing.', 'Append `?limit=...`.', 20),
    reviewCheckpoint: review(
      10,
      'Review Loyiha #10: Moslashuvchan Hisob-Faktura Engine (Parameters + Defaults + Keywords)',
      'Review Project #10: Configurable Invoice Engine',
      '50-dars marrasi! Default qiymatlar, `None` sentinel, positional va `*` keyword-only parametrlarni birlashtirib moslashuvchan hisob-faktura generatori tuzing.',
      '50-lesson milestone! Build an invoice engine combining required inputs, `None` sentinels, and keyword-only options.',
      ['`create_invoice(client, items=None, *, tax=12, currency="UZS")` funksiyasi', '`items=None` sentinel orqali xavfsiz ro‘yxat', 'Jami va soliqni aniq formatda chiqarish'],
      ['Implement `create_invoice(client, items=None, *, tax=12, currency="UZS")`', 'Use safe `None` sentinel', 'Format itemized totals cleanly'],
      `def create_invoice(client, items=None, *, tax=12, currency="UZS"):
    if items is None:
        items = []
    subtotal = sum(items)
    total = round(subtotal * (1 + tax / 100), 2)
    return {"client": client, "count": len(items), "total": f"{total} {currency}"}

print(create_invoice("TechCorp", [100, 250], tax=10))
print(create_invoice("Startup"))`,
    ),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),
];
