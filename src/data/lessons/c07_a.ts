import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C07_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-07-01',
    courseId: 'errors_testing',
    moduleId: 'c07_m1',
    order: 1,
    titleUz: 'Syntax Errors — dastur ishga tushmasdan oldingi xatolar',
    titleEn: 'Syntax Errors: Parser Checks, IndentationError & `SyntaxError`',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-06-10'],
    conceptId: 'syntax_errors',
    whyUz: "Har bir dasturchi kuniga o‘nlab `SyntaxError` va `IndentationError` ko‘radi. Muhimi — Python parsing bosqichida xatoni qanday ko‘rsatishini (`^` ko‘rsatkichi baʼzan oldingi qatordagi yopilmagan qavsni bildirishi!) tez o‘qiy olishdir.",
    whyEn: 'Python parses syntax into an AST before running a single line. Reading `SyntaxError` / `IndentationError` tracebacks—especially unclosed delimiters on prior lines—cuts debug time dramatically.',
    analogyUz: "`SyntaxError` — bu avtomobil zavoddan chiqishidan oldin texnik nazoratda \"g‘ildiragi burilmagan\" deb to‘xtatilishi: mashina hali umuman yurmagan, chunki imlo qoidasi buzilgan!",
    analogyEn: 'A `SyntaxError` stops the car at the factory inspection gate before the engine ever turns on—the code violates Python grammar.',
    stopsUz: "`SyntaxError` ni **`try / except` bilan ushlab bo‘lmaydi** (chunki `try` bloki ham birinchi navbatda parse qilinishi shart — faqat `eval`/`compile` dagi dinamik matnda ushlash mumkin)! Shuningdek xato ko‘rsatkich `^` ko‘pincha **oldingi qatordagi** yopilmagan `(` yoki `\"` sabab keyingi qatorda chiqadi!",
    stopsEn: '`SyntaxError` occurs at parse time before execution—`try/except` cannot catch syntax errors in the same source file, and the caret `^` often points one line *after* an unclosed `(` or quote.',
    objUz: ['Parse-time (`SyntaxError`, `IndentationError`, `TabError`) vs Runtime farqini bilish', 'Traceback dagi fayl, qator raqami va `^` ko‘rsatkichini to‘g‘ri o‘qish', 'Yopilmagan qavs, `=` vs `==` va indentatsiya xatolarini darrov tuzatish'],
    objEn: ['Distinguish parse-time syntax errors from runtime exceptions', 'Diagnose unclosed brackets, missing colons, and `=` vs `==` traps', 'Resolve `IndentationError` and `TabError` (spaces vs tabs)'],
    theoryUz: `### 1. Parse-Time vs Runtime
Python avval faylni o‘qib **AST (Syntax Tree)** quradi. Agar grammatika xato bo‘lsa, 1-qatordagi \`print("Start")\` ham **umuman ishlamaydi**!
### 2. Eng Ko‘p Uchraydigan 5 ta Syntax Error
1. Ikki nuqta \`:\` unutish (\`if x > 0\`, \`def f()\`)
2. \`=\` (tayinlash) ni \`==\` (taqqoslash) o‘rniga \`if x = 5:\` deb yozish
3. Qavs/qo‘shtirnoq yopilmay qolishi (xato keyingi qatorda ko‘rinadi!)
4. Kalit so‘zni (\`class\`, \`return\`, \`for\`) o‘zgaruvchi nomi qilish
5. \`IndentationError\` / \`TabError\` (4 ta space o‘rniga tab aralashtirish)
### 3. \`ast.parse()\` Bilan Kod Tekshirish
Python'ning standart \`ast\` moduli kodni ishga tushirmasdan sintaksisini tekshirib ko‘rishga imkon beradi!
### 4. Keng tarqalgan xato
\`SyntaxError\` ni o‘z faylida \`try/except SyntaxError:\` bilan ushlayman deb o‘ylash.`,
    theoryEn: `### 1. Parse-Time Rejection
Python compiles source to bytecode before executing line 1; a single \`SyntaxError\` prevents the entire module from starting.
### 2. Top 5 Syntax Bugs
Missing \`:\`, \`=\` instead of \`==\`, unclosed delimiters, reserved keywords as identifiers, and mixed tabs/spaces (\`TabError\`).
### 3. Inspecting Syntax Safely via \`ast.parse\`
Validate code snippets statically without executing them.
### 4. Pitfall
\`try/except SyntaxError:\` only catches syntax errors inside dynamically parsed strings (\`ast.parse\`), never in static code around it.`,
    examples: [
      ex('Misol 1: `ast.parse()` bilan sintaksis xatosini aniqlash', 'Example 1: Detecting Syntax Errors via ast.parse', `import ast\n\nsnippets = ["x = 1 + 2", "if x = 5: print(x)", "def f():\\nprint(1)"]\nfor code in snippets:\n    try:\n        ast.parse(code)\n        print("VALID:", repr(code))\n    except (SyntaxError, IndentationError) as err:\n        print("ERROR:", type(err).__name__, "at line", err.lineno)`, `VALID: 'x = 1 + 2'\nERROR: SyntaxError at line 1\nERROR: IndentationError at line 2`, '`ast.parse()` kodni ishga tushirmay `SyntaxError` va `IndentationError` ni topdi.', 'Statically validated valid vs malformed Python snippets using `ast.parse()`.'),
      ex('Misol 2: Yopilmagan qavs keyingi qatorda xato berishi', 'Example 2: Unclosed Delimiter Caret Offset', `import ast\nbad = "nums = [1, 2\\nprint(nums)"\ntry:\n    ast.parse(bad)\nexcept SyntaxError as e:\n    print("Reported line:", e.lineno, "| msg:", e.msg)`, `Reported line: 1 | msg: '[' was never closed`, 'Zamonaviy Python 3.12 xato aynan `[` ochilgan 1-qatorni ko‘rsatadi!', 'Modern Python pinpoints the unclosed opening bracket line.'),
      ex('Misol 3: `TabError` (4 space standarti)', 'Example 3: Clean 4-Space Indentation', `def greet(name):\n    if name:\n        return f"Salom, {name}"\n    return "Salom"\n\nprint(greet("Ali"))`, `Salom, Ali`, 'Har bir ichki blok aniq 4 bo‘shliq bilan yozilgan.', 'Consistent 4-space indentation keeps blocks valid.'),
    ],
    traceTitleUz: 'Parser tekshiruvi izi',
    traceTitleEn: 'Tracing Parser vs Execution',
    traceCode: `import ast\ntry:\n    ast.parse("for i in range(3) print(i)")\nexcept SyntaxError as e:\n    print("Caught parse error at line", e.lineno)`,
    traceSteps: [
      traceStep(1, 'ast.parse(...)', 'scanning tokens', 'Parser ikki nuqta (:) kutdi', 'Parser expected colon'),
      traceStep(2, 'SyntaxError', 'lineno=1', 'Parse bosqichidayoq to‘xtadi', 'Raised SyntaxError'),
      traceStep(3, 'except SyntaxError:', 'Caught line 1', 'Xato ushlandi', 'Printed line 1', 'Caught parse error at line 1'),
    ],
    commonMistakes: [
      mistake('`if` shartida `==` o‘rniga `=` yozish', 'Assignment = Inside if Condition', `x = 5\nif x = 5:\n    print("ok")`, 'SyntaxError: invalid syntax (maybe you meant == ?)', `x = 5\nif x == 5:\n    print("ok")`, '`=` tayinlash operatori, taqqoslash uchun `==` kerak.', '`=` assigns; `==` compares equality.', 'Shartlarda doim `==` ni tekshiring.', 'Use `==` in conditions.'),
      mistake('Python kalit so‘zini o‘zgaruvchi nomi qilish', 'Using Reserved Keyword as Identifier', `class = "10-A"\nprint(class)`, 'SyntaxError: invalid syntax', `grade_class = "10-A"\nprint(grade_class)`, '`class`, `def`, `return`, `import`, `pass` zaxiralangan so‘zlar.', 'Keywords cannot be used as variable names.', '`class_name`, `is_active` kabi aniq nomlar bering.', 'Choose non-keyword names.'),
    ],
    compareTitleUz: '`SyntaxError` vs `IndentationError`',
    compareTitleEn: '`SyntaxError` vs `IndentationError`',
    compareUz: ['`SyntaxError`: qavs, ikki nuqta, qo‘shtirnoq, kalit so‘z buzilganda.', '`IndentationError` (va `TabError`): blok boshidagi bo‘shliqlar/tablar mos kelmaganda (`SyntaxError` ning merosxo‘ri).'],
    compareEn: ['`SyntaxError`: invalid grammar tokens or missing punctuation.', '`IndentationError`: subclass of `SyntaxError` for mismatched leading whitespace.'],
    compareSummaryUz: 'Muharrirda 4 ta bo‘shliq (spaces) sozlang va qizil to‘lqinli chiziqlarga darrov eʼtibor bering.',
    compareSummaryEn: 'Configure your editor for 4 spaces and fix syntax highlights before running code.',
    practiceTasks: [
      pt('p0701_1', '1-mashq: `ast.parse` tekshiruvi', 'Task 1: Validate Valid Snippet', '`ast.parse("x = 5")` xatosiz o‘tishini `"ok"` bilan chiqaring.', 'Parse valid code.', `import ast\nast.parse("x = 5")\nprint("ok")`, 'ok', 'ast.parse("x = 5")', 'Prints ok.'),
      pt('p0701_2', '2-mashq: `SyntaxError` ushlash', 'Task 2: Catch SyntaxError', '`ast.parse("if True print(1)")` dan `SyntaxError` tutib `"syntax"` chiqaring.', 'Catch SyntaxError via ast.parse.', `import ast\ntry:\n    ast.parse("if True print(1)")\nexcept SyntaxError:\n    print("syntax")`, 'syntax', 'except SyntaxError', 'Missing colon.'),
      pt('p0701_3', '3-mashq: `IndentationError`', 'Task 3: Catch IndentationError', '`ast.parse("if True:\\nprint(1)")` dan `IndentationError` tuting.', 'Catch IndentationError.', `import ast\ntry:\n    ast.parse("if True:\\nprint(1)")\nexcept IndentationError:\n    print("indent")`, 'indent', 'except IndentationError', 'Unindented body.'),
      pt('p0701_4', '4-mashq: `=` vs `==` tuzatish', 'Task 4: Fix == Condition', '`a = 3` da `if a == 3: print("match")` ni yozing.', 'Compare equality properly.', `a = 3\nif a == 3:\n    print("match")`, 'match', 'Use ==', 'Prints match.'),
      pt('p0701_5', '5-mashq: Kalit so‘zlar ro‘yxati', 'Task 5: keyword.iskeyword', '`import keyword` bilan `"class"` va `"klass"` dan qaysi biri keyword ekanini chiqaring.', 'Check keyword.iskeyword.', `import keyword\nprint(keyword.iskeyword("class"), keyword.iskeyword("klass"))`, 'True False', 'keyword.iskeyword(...)', 'Print both bools.'),
    ],
    quiz: [
      q('q0701_1', '`SyntaxError` dasturning qaysi bosqichida sodir bo‘ladi?', 'When does a `SyntaxError` happen?', ['Bajarilish oxirida', 'Kod ishga tushmasdan oldin (parse bosqichida)', 'Faqat input() da', 'Faqat siklda'], ['At exit', 'Before execution during parsing', 'Only in input()', 'Inside loops'], 1, 'Kod bajarilishidan oldin parse bosqichida.', 'During initial parsing before execution.'),
      q('q0701_2', '`IndentationError` qaysi sinfning vorisi (subclass)?', '`IndentationError` is a subclass of?', ['RuntimeError', 'SyntaxError', 'ValueError', 'NameError'], ['RuntimeError', 'SyntaxError', 'ValueError', 'NameError'], 1, '`SyntaxError`.', '`SyntaxError`.'),
      q('q0701_3', 'Bir faylda oddiy `try: if x = 1: except SyntaxError:` ishlaydimi?', 'Can static `try/except SyntaxError` catch broken syntax inside its own block?', ['Ha', 'Yo‘q, try ham parse bo‘lmaydi', 'Faqat debug da', 'Faqat Python 3.12 da'], ['Yes', 'No, parser rejects the file first', 'Debug only', '3.12 only'], 1, 'Yo‘q, butun fayl parse dan o‘ta olmaydi.', 'No, parsing fails before execution.'),
      q('q0701_4', 'Space va Tab ni bitta blokda aralashtirish qaysi xatoni beradi?', 'Mixing tabs and spaces raises?', ['TypeError', 'TabError', 'ValueError', 'KeyError'], ['TypeError', 'TabError', 'ValueError', 'KeyError'], 1, '`TabError`.', '`TabError`.'),
      q('q0701_5', 'Qaysi nom o‘zgaruvchi nomi bo‘la OLMAYDI?', 'Which is an illegal variable name?', ['user_class', 'return', 'total_2', '_id'], ['user_class', 'return', 'total_2', '_id'], 1, '`return` Python kalit so‘zi.', '`return` is a reserved keyword.'),
    ],
    homework: hw('Mini Python Sintaksis Linteri', 'AST Syntax Checker', '`check_snippets(snippets: list[str])` funksiyasini tuzing: har bir kod parchasini `ast.parse` bilan tekshirib `"VALID"` yoki xato turi + qator raqamini hisobot qilib chiqarsin.', 'Write `check_snippets(snippets)` using `ast.parse()` to classify valid snippets vs `IndentationError` and `SyntaxError` with line numbers.', ['IndentationError ni SyntaxError dan oldin tuting (subclass!)', 'Kamida 4 ta test parchasi'], ['Catch IndentationError before SyntaxError', 'Test at least 4 snippets'], 'except IndentationError as e: ... except SyntaxError as e: ...', 'Order specific subclass first.', 'Har bir parcha ichidagi funksiya (`ast.FunctionDef`) lar sonini ham sanang.', 'Count `ast.FunctionDef` nodes in valid code.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-07-02',
    courseId: 'errors_testing',
    moduleId: 'c07_m1',
    order: 2,
    titleUz: 'Runtime Errors — Traceback o‘qish va Exception turlari',
    titleEn: 'Runtime Errors: Reading Tracebacks & Core Built-in Exceptions',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-07-01'],
    conceptId: 'runtime_errors',
    whyUz: "Kod sintaksis jihatdan 100% to‘g‘ri bo‘lishi mumkin, lekin ishlayotgan paytda foydalanuvchi `\"abc\"` kiritsa (`ValueError`), nolga bo‘lsa (`ZeroDivisionError`) yoki yo‘q kalit so‘rasa (`KeyError`) to‘satdan qulaydi. Traceback ni tez o‘qish har bir muhandisning superkuchidir!",
    whyEn: 'Syntactically valid programs still fail dynamically on bad inputs, missing keys, or zero division. Reading Python tracebacks bottom-up isolates bugs in seconds.',
    analogyUz: "**Traceback** — bu samolyotning qora qutisi: eng pastki qatorda **nima bo‘lgani** (xato turi va sababi), undan tepasida esa halokatga olib kelgan chaqiruvlar zanjiri (call stack) turadi.",
    analogyEn: 'A Traceback is a flight black box: read from the bottom line up—the bottom states *what* failed, and frames above show *how* execution arrived there.',
    stopsUz: "Traceback ni har doim **ENG PASTIDAN TEPAGA** qarab o‘qing! Eng oxirgi qator sizga aniq Exception nomini va sababini aytadi; siz yozgan faylning eng oxirgi (eng pastki) satri esa haqiqiy aybdor joydir!",
    stopsEn: 'Always read tracebacks **bottom-up**: the final line reveals the exception type/message, and the lowest frame in your own code pinpoints the crash site.',
    objUz: ['Python Exception ierarxiyasining asosiy turlarini (`ValueError`, `TypeError`, `KeyError`, `IndexError`, `AttributeError`, `ZeroDivisionError`) ajratish', 'Traceback (`traceback` moduli) ni pastdan tepaga o‘qish', 'Bir xil xato matnida sababni (Value vs Type) tez aniqlash'],
    objEn: ['Identify `ValueError`, `TypeError`, `KeyError`, `IndexError`, `AttributeError`, and `ZeroDivisionError`', 'Read call-stack tracebacks bottom-up', 'Distinguish type mismatches (`TypeError`) from invalid domain values (`ValueError`)'],
    theoryUz: `### 1. Eng Ko‘p Uchraydigan Runtime Xatolar
- **\`ValueError\`**: turi to‘g‘ri, lekin qiymati yaroqsiz (\`int("abc")\`)
- **\`TypeError\`**: tur noto‘g‘ri (\`"5" + 3\`, \`len(10)\`)
- **\`KeyError\`**: lug‘atda mavjud bo‘lmagan kalit (\`d["missing"]\`)
- **\`IndexError\`**: ro‘yxat chegarasidan chiqish (\`[1, 2][5]\`)
- **\`AttributeError\`**: obyektda bunday metod/atribut yo‘q (\`None.strip()\`)
- **\`ZeroDivisionError\`**: \`x / 0\`
- **\`NameError\`**: aniqlanmagan o‘zgaruvchi
### 2. \`ValueError\` vs \`TypeError\` Farqi
\`int(None)\` -> **\`TypeError\`** (chunki \`None\` noto‘g‘ri tur); \`int("hello")\` -> **\`ValueError\`** (chunki \`str\` qabul qilinadigan tur, lekin \`"hello"\` raqam emas!).
### 3. Traceback O‘qish Tartibi
1) Eng pastki qator: Xato klassi va xabari.
2) Undan bir pog‘ona tepa: Xato otilgan aniq qator.
3) Undan tepalar: Bu funksiyani kim chaqirgani (call stack).
### 4. Keng tarqalgan xato
\`traceback\` da birinchi (eng yuqori) fayl qatoriga qarab chalg‘ib ketish.`,
    theoryEn: `### 1. Core Runtime Exceptions
\`ValueError\`, \`TypeError\`, \`KeyError\`, \`IndexError\`, \`AttributeError\`, \`ZeroDivisionError\`, \`NameError\`, \`FileNotFoundError\`.
### 2. \`TypeError\` vs \`ValueError\`
\`int([1])\` raises \`TypeError\` (wrong type); \`int("xyz")\` raises \`ValueError\` (right type \`str\`, bad content).
### 3. Reading Tracebacks Bottom-Up
Start at the exception line at the very bottom, then walk up to the first frame in your codebase.
### 4. Inspecting via \`traceback\` Module
Use \`traceback.format_exc()\` when logging unexpected errors.`,
    examples: [
      ex('Misol 1: `TypeError` vs `ValueError` amalda', 'Example 1: TypeError vs ValueError', `for fn, arg in [(int, "abc"), (int, [1, 2]), (lambda x: 10 / x, 0)]:\n    try:\n        fn(arg)\n    except Exception as err:\n        print(f"{type(err).__name__}: {err}")`, `ValueError: invalid literal for int() with base 10: 'abc'\nTypeError: int() argument must be a string, a bytes-like object or a real number, not 'list'\nZeroDivisionError: division by zero`, 'Har bir xato turi vaziyatga qarab aniq klass nomini ko‘rsatdi.', 'Contrasted `ValueError`, `TypeError`, and `ZeroDivisionError`.'),
      ex('Misol 2: `KeyError`, `IndexError` va `AttributeError`', 'Example 2: Lookup & Attribute Errors', `cases = [\n    lambda: {"a": 1}["b"],\n    lambda: [10][3],\n    lambda: None.upper(),\n]\nfor call in cases:\n    try:\n        call()\n    except Exception as e:\n        print(type(e).__name__)`, `KeyError\nIndexError\nAttributeError`, 'Uchta klassik runtime xatosi aniq ajratib olindi.', 'Triggered and named three everyday lookup/attribute failures.'),
      ex('Misol 3: Call-stack chuqurligini ko‘rish (`traceback`)', 'Example 3: Inspecting Stack Frames', `import traceback\n\ndef inner(): return 1 / 0\ndef outer(): return inner()\n\ntry:\n    outer()\nexcept ZeroDivisionError as exc:\n    frames = traceback.extract_tb(exc.__traceback__)\n    print("Call chain:", " -> ".join(f.name for f in frames))`, `Call chain: <module> -> outer -> inner`, '`__traceback__` dan chaqiruvlar zanjiri (`outer -> inner`) ko‘rindi.', 'Extracted call stack frames leading straight to `inner`.'),
    ],
    traceTitleUz: 'Call stack va traceback izi',
    traceTitleEn: 'Tracing Stack Unwinding',
    traceCode: `def b(): return int("x")\ndef a(): return b()\ntry:\n    a()\nexcept ValueError as e:\n    print(type(e).__name__)`,
    traceSteps: [
      traceStep(1, 'a() -> b()', 'stack: a -> b', 'Funksiya zanjiri ochildi', 'Entered a then b'),
      traceStep(2, 'int("x")', 'ValueError', 'b() ichida xato otildi', 'Raised ValueError in b'),
      traceStep(3, 'except ValueError:', 'ValueError', 'Xato a() orqali yuqoriga ko‘tarilib ushlandi', 'Propagated and caught', 'ValueError'),
    ],
    commonMistakes: [
      mistake('`None` qaytargan funksiyadan `.strip()` chaqirish', 'AttributeError on None Return', `user_bio = None\nprint(user_bio.strip())`, "AttributeError: 'NoneType' object has no attribute 'strip'", `user_bio = None\nprint((user_bio or "").strip() or "Empty")`, '`.get()` yoki funksiya `None` qaytarsa metod chaqirib bo‘lmaydi.', 'Calling string methods on `None` triggers `AttributeError`.', '`(val or "")` yoki `if val is not None:` bilan tekshiring.', 'Guard against `None` first.'),
      mistake('Traceback ning eng yuqori qatorini xato joyi deb o‘ylash', 'Reading Traceback Top-Down', `# Top frame is often main() or test runner, bottom is the bug!`, 'Wastes time inspecting caller instead of crash line', `print("Always start reading from the LAST line of a Traceback!")`, 'Haqiqiy sabab eng pastki qatorda yoziladi.', 'The bottom line contains the exception class and message.', 'Pastdan tepaga o‘qing.', 'Read tracebacks bottom-up.'),
    ],
    compareTitleUz: '`ValueError` vs `TypeError`',
    compareTitleEn: '`ValueError` vs `TypeError`',
    compareUz: ['`TypeError`: noto‘g‘ri tur berilgan (`"5" + 2`, `len(42)`).', '`ValueError`: turi to‘g‘ri, lekin mazmuni/qiymati mos emas (`int("abc")`, `math.sqrt(-1)`).'],
    compareEn: ['`TypeError`: incompatible object type passed.', '`ValueError`: right type, invalid semantic value.'],
    compareSummaryUz: 'Tur muammosida `TypeError`, qiymat chegarasi/formatida `ValueError` kuting va oting.',
    compareSummaryEn: 'Expect/raise `TypeError` for wrong types and `ValueError` for invalid values.',
    practiceTasks: [
      pt('p0702_1', '1-mashq: `ZeroDivisionError`', 'Task 1: ZeroDivisionError', '`10 / 0` xatosini ushlab klass nomini chiqaring.', 'Catch ZeroDivisionError.', `try:\n    _ = 10 / 0\nexcept Exception as e:\n    print(type(e).__name__)`, 'ZeroDivisionError', 'type(e).__name__', 'Divide by zero.'),
      pt('p0702_2', '2-mashq: `ValueError`', 'Task 2: ValueError', '`int("xyz")` xatosini ushlab klass nomini chiqaring.', 'Catch ValueError.', `try:\n    int("xyz")\nexcept Exception as e:\n    print(type(e).__name__)`, 'ValueError', 'int("xyz")', 'Print class name.'),
      pt('p0702_3', '3-mashq: `TypeError`', 'Task 3: TypeError', '`len(99)` xatosini ushlab klass nomini chiqaring.', 'Catch TypeError.', `try:\n    len(99)\nexcept Exception as e:\n    print(type(e).__name__)`, 'TypeError', 'len(99)', 'Print TypeError.'),
      pt('p0702_4', '4-mashq: `KeyError`', 'Task 4: KeyError', '`{}["k"]` xatosini ushlab klass nomini chiqaring.', 'Catch KeyError.', `try:\n    _ = {}["k"]\nexcept Exception as e:\n    print(type(e).__name__)`, 'KeyError', '{}["k"]', 'Print KeyError.'),
      pt('p0702_5', '5-mashq: `AttributeError`', 'Task 5: AttributeError', '`(123).append(1)` xatosini ushlab klass nomini chiqaring.', 'Catch AttributeError.', `try:\n    (123).append(1)\nexcept Exception as e:\n    print(type(e).__name__)`, 'AttributeError', '(123).append(1)', 'Print AttributeError.'),
    ],
    quiz: [
      q('q0702_1', '`int("salom")` qaysi xatoni chiqaradi?', 'Exception raised by `int("salom")`?', ['TypeError', 'ValueError', 'SyntaxError', 'NameError'], ['TypeError', 'ValueError', 'SyntaxError', 'NameError'], 1, '`str` turi ruxsat etilgan, lekin qiymati son emas -> `ValueError`.', '`ValueError`.'),
      q('q0702_2', '`"5" + 5` qaysi xatoni chiqaradi?', 'Exception raised by `"5" + 5`?', ['ValueError', 'TypeError', 'SyntaxError', 'IndexError'], ['ValueError', 'TypeError', 'SyntaxError', 'IndexError'], 1, 'Ikki mos kelmas tur -> `TypeError`.', '`TypeError`.'),
      q('q0702_3', 'Traceback ni qaysi tomondan boshlab o‘qish to‘g‘ri?', 'Which direction should you read a Python traceback?', ['Tepadan pastga', 'Pastdan tepaga (oxirgi qatordan)', 'O‘rtadan', 'Farqi yo‘q'], ['Top-down', 'Bottom-up (from final error line)', 'From middle', 'Either'], 1, 'Pastdan tepaga.', 'Bottom-up.'),
      q('q0702_4', '`None.lower()` chaqiruvi qaysi xatoni beradi?', 'Exception raised by `None.lower()`?', ['TypeError', 'ValueError', 'AttributeError', 'KeyError'], ['TypeError', 'ValueError', 'AttributeError', 'KeyError'], 2, '`AttributeError`.', '`AttributeError`.'),
      q('q0702_5', 'Runtime xatolar `SyntaxError` dan qaysi jihatdan farq qiladi?', 'How do runtime exceptions differ from `SyntaxError`?', ['Kod ishga tushgach bajarilish vaqtida yuz beradi', 'Hech qachon ushlab bo‘lmaydi', 'Faqat 1-qatorda chiqadi', 'Farqi yo‘q'], ['Occur during execution after parsing', 'Uncatchable', 'Line 1 only', 'Identical'], 0, 'Kod parse bo‘lib ishga tushgandan keyin yuz beradi.', 'Occur dynamically during execution.'),
    ],
    homework: hw('Xatolar Diagnostikasi Jadvali', 'Runtime Error Classifier', '5 ta turli xato chiqaradigan lambda funksiyalar ro‘yxatini (`ValueError`, `TypeError`, `KeyError`, `IndexError`, `AttributeError`) siklda ishlatib, har birining `__traceback__` chuqurligi va nomini hisobot qiling.', 'Run 5 failing callables in a loop and print each exception class name, message, and frame count using `traceback.extract_tb`.', ['5 ta turli exception turi', 'traceback moduli ishlatilsin'], ['Trigger 5 distinct exceptions', 'Use traceback.extract_tb'], 'len(traceback.extract_tb(err.__traceback__))', 'Inspect traceback object.', 'Xato xabarlarini JSON hisobot ko‘rinishida jamlang.', 'Summarize counts as dict.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-07-03',
    courseId: 'errors_testing',
    moduleId: 'c07_m1',
    order: 3,
    titleUz: 'Logical Errors — eng makkor xatolar va `assert` himoyasi',
    titleEn: 'Logical Errors: Silent Bugs, Off-by-One & `assert` Invariants',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-07-02'],
    conceptId: 'logical_errors',
    whyUz: "Syntax Error da Python ishga tushirmaydi, Runtime Error da Traceback chiqaradi. **Logical Error** da esa dastur 0 ta xato bilan chiroyli ishlaydi... lekin mijozga 10% chegirma o‘rniga 90% chegirma hisoblab kompaniyani zarar kiritadi!",
    whyEn: 'Logical errors crash neither the parser nor runtime—they silently produce wrong numbers. Catching off-by-one, precedence, and boolean bugs early requires invariants (`assert`) and edge-case tests.',
    analogyUz: "Logical error — bu GPS navigator sizni xato bermasdan silliq olib borib, Toshkent o‘rniga Samarqandga tushirib qo‘yishi: mashina buzilmagan, lekin manzil noto‘g‘ri!",
    analogyEn: 'A logical bug is a silent wrong turn: the engine runs smoothly, yet you arrive at the wrong city.',
    stopsUz: "`assert condition, \"msg\"` faqat dasturchi xatolarini (invariants) tekshirish va testlarda ishlatiladi — `python -O` flagi bilan o‘chirilishi mumkinligi uchun **foydalanuvchi kiritishi yoki auth tekshiruvida `assert` ishlatmang** (`if ...: raise ValueError(...)` yozing)!",
    stopsEn: 'Never use `assert` for production input validation or authorization—Python’s `-O` flag strips `assert` statements! Use explicit `if ...: raise`.',
    objUz: ['Off-by-one (`range(1, n)` vs `n+1`), operator ustuvorligi (`a + b / 2`) va `and`/`or` mantiqiy xatolarini topish', 'Floating-point (`0.1 + 0.2`) muammosida `math.isclose()` qo‘llash', '`assert` qayerda ishlatiladi va qayerda taqiqlanishini bilish'],
    objEn: ['Spot off-by-one, precedence, boolean short-circuit, and loop-scope logical bugs', 'Compare floats safely with `math.isclose()` instead of `==`', 'Use `assert` for internal invariants/tests (not security/input validation)'],
    theoryUz: `### 1. Klassik Mantiqiy Xatolar
1. **Operator ustuvorligi**: \`avg = a + b / 2\` (aslida \`(a + b) / 2\` kerak edi!)
2. **Off-by-one**: \`range(1, 5)\` 5 ni kiritmaydi (\`1..4\`)
3. **Boolean xato**: \`if x == 1 or 2:\` har doim \`True\` (\`bool(2) == True\`)! To‘g‘risi: \`if x in (1, 2):\`
4. **Float taqqoslash**: \`0.1 + 0.2 == 0.3\` -> \`False\`! To‘g‘risi: \`math.isclose(0.1 + 0.2, 0.3)\`
### 2. \`assert\` Invariantlari
\`assert len(items) > 0, "Bug: items must not be empty"\` — agar yolg‘on bo‘lsa \`AssertionError\` beradi.
### 3. Nima Uchun Input Validation Uchun \`assert\` Mumkin Emas?
\`python -O app.py\` rejimida barcha \`assert\` lar o‘chirib tashlanadi! Foydalanuvchi tekshiruvi uchun doim \`if ...: raise ValueError(...)\` yozing.
### 4. Keng tarqalgan xato
\`0.1 + 0.2 == 0.3\` ga ishonib shart yozish.`,
    theoryEn: `### 1. Classic Silent Bugs
Precedence (\`(a+b)/2\`), off-by-one (\`range(1, n+1)\`), \`if x == 1 or 2:\`, and \`0.1 + 0.2 == 0.3\`.
### 2. Float Comparison
Always use \`math.isclose(a, b)\` for floating-point equality.
### 3. \`assert\` for Tests & Invariants
Triggers \`AssertionError\` during development and unit tests.
### 4. Never Validate User Input with \`assert\`
Running Python with \`-O\` strips every \`assert\`; always use \`if ...: raise\`.`,
    examples: [
      ex('Misol 1: Operator ustuvorligi va `or` mantiqiy bugi', 'Example 1: Fixing Precedence & Boolean Bugs', `a, b = 10, 20\nbuggy_avg = a + b / 2\nfixed_avg = (a + b) / 2\nrole = "guest"\nprint("Buggy avg:", buggy_avg, "| Fixed:", fixed_avg)\nprint("Safe check:", role in ("admin", "editor"))`, `Buggy avg: 20.0 | Fixed: 15.0\nSafe check: False`, 'Qavs qo‘yilmasa `/` birinchi bajarilib noto‘g‘ri `20.0` chiqqan edi.', 'Added parentheses for average and `in` tuple check for role.'),
      ex('Misol 2: `math.isclose()` bilan float aniqligi', 'Example 2: Floating-Point Comparison', `import math\ntotal = 0.1 + 0.2\nprint("Exact ==:", total == 0.3)\nprint("isclose:", math.isclose(total, 0.3))`, `Exact ==: False\nisclose: True`, 'IEEE-754 kasr yaxlitlash farqini `math.isclose()` hal qildi.', '`math.isclose()` handles IEEE-754 rounding tolerance reliably.'),
      ex('Misol 3: `assert` yordamida funksiyani tekshirish', 'Example 3: Verifying Invariants with assert', `def apply_discount(price, pct):\n    return round(price * (1 - pct / 100), 2)\n\nassert apply_discount(100, 20) == 80.0\nassert apply_discount(50, 0) == 50.0\nprint("All invariants passed!")`, `All invariants passed!`, 'Kichik invariant tekshiruvlar mantiqiy xatoni darrov ushlaydi.', 'Assertions verified expected outputs cleanly.'),
    ],
    traceTitleUz: 'Mantiqiy xato izi (`or 2`)',
    traceTitleEn: 'Tracing Boolean Logical Bug',
    traceCode: `x = 99\nbug = (x == 1 or 2)\nfix = (x in (1, 2))\nprint(bool(bug), fix)`,
    traceSteps: [
      traceStep(1, 'x == 1', 'False', '99 == 1 yolg‘on', 'Evaluates to False'),
      traceStep(2, 'False or 2', '2 (Truthy!)', 'or 2 har doim 2 qaytaradi', 'Short-circuits to 2'),
      traceStep(3, 'x in (1, 2)', 'False', 'To‘g‘ri tekshiruv False berdi', 'Membership check returns False', 'True False'),
    ],
    commonMistakes: [
      mistake('`if cmd == "yes" or "y":` yozish', 'Always-True Boolean Or Bug', `cmd = "no"\nif cmd == "yes" or "y":\n    print("Accepted wrongly!")`, 'Prints Accepted wrongly for ANY input!', `cmd = "no"\nif cmd in ("yes", "y"):\n    print("Accepted")\nelse:\n    print("Rejected")`, '`"y"` bo‘sh bo‘lmagan string bo‘lgani uchun har doim `True`.', 'Non-empty `"y"` is always truthy.', 'Bir nechta qiymat uchun `in ("yes", "y")` ishlating.', 'Use `in (...)` tuple membership.'),
      mistake('Parol yoki kiritishni `assert` bilan tekshirish', 'Using assert for Security/Input Checks', `def withdraw(bal, amt):\n    assert amt <= bal, "Too much"`, 'Disabled completely under python -O!', `def withdraw(bal, amt):\n    if amt > bal:\n        raise ValueError("Insufficient funds")\n    return bal - amt\nprint(withdraw(100, 40))`, '`python -O` bayrog‘i `assert` ni o‘chiradi.', '`assert` is stripped in optimized mode (`-O`).', 'Ishlab chiqarish validatsiyasi uchun `if ...: raise` yozing.', 'Always use `if ...: raise` for runtime validation.'),
    ],
    compareTitleUz: '`assert` vs `if ...: raise`',
    compareTitleEn: '`assert` vs `if ...: raise`',
    compareUz: ['`assert`: testlar va ichki dasturchi invariantlari uchun (`-O` da o‘chishi mumkin).', '`if ...: raise`: foydalanuvchi kiritishi, API validatsiyasi va xavfsizlik tekshiruvlari uchun (hech qachon o‘chmaydi).'],
    compareEn: ['`assert`: unit tests and internal developer invariants.', '`if ...: raise`: production input validation and security enforcement.'],
    compareSummaryUz: 'Foydalanuvchi ma’lumotlari va biznes qoidalarida `assert` emas, `if ...: raise` ishlating.',
    compareSummaryEn: 'Reserve `assert` for tests and internal invariants; use `if ...: raise` for runtime validation.',
    practiceTasks: [
      pt('p0703_1', '1-mashq: Qavs ustuvorligi', 'Task 1: Fix Average', '`10` va `20` o‘rtachasini to‘g‘ri chiqaring (`15.0`).', 'Compute average of 10 and 20.', `print((10 + 20) / 2)`, '15.0', 'Wrap 10 + 20 in parentheses.', 'Print 15.0.'),
      pt('p0703_2', '2-mashq: `in` bilan to‘g‘ri tekshiruv', 'Task 2: Membership Fix', '`x = 5` uchun `x in (1, 2)` natijasini chiqaring.', 'Verify x in (1, 2) is False.', `x = 5\nprint(x in (1, 2))`, 'False', 'x in (1, 2)', 'Prints False.'),
      pt('p0703_3', '3-mashq: `math.isclose`', 'Task 3: Float Isclose', '`math.isclose(0.1 + 0.2, 0.3)` ni chiqaring.', 'Compare floats via math.isclose.', `import math\nprint(math.isclose(0.1 + 0.2, 0.3))`, 'True', 'math.isclose(...)', 'Prints True.'),
      pt('p0703_4', '4-mashq: Off-by-one tuzatish', 'Task 4: Inclusive Sum', '`1` dan `5` gacha (5 ham kirsin) yig‘indini chiqaring.', 'Sum 1..5 inclusive.', `print(sum(range(1, 6)))`, '15', 'range(1, 6)', 'Includes 5.'),
      pt('p0703_5', '5-mashq: `AssertionError` tutish', 'Task 5: Catch AssertionError', '`assert 2 == 3` dan `AssertionError` tutib `"failed"` chiqaring.', 'Catch AssertionError.', `try:\n    assert 2 == 3\nexcept AssertionError:\n    print("failed")`, 'failed', 'except AssertionError', 'Prints failed.'),
    ],
    quiz: [
      q('q0703_1', 'Qaysi xato turida Python hech qanday xato xabari chiqarmaydi?', 'Which error produces NO crash or traceback?', ['SyntaxError', 'RuntimeError', 'Logical Error', 'IndentationError'], ['SyntaxError', 'RuntimeError', 'Logical Error', 'IndentationError'], 2, 'Logical Error jim holda noto‘g‘ri natija beradi.', 'Logical error fails silently.'),
      q('q0703_2', '`if role == "admin" or "staff":` har doim qaysi qiymatni beradi?', 'What does `if role == "admin" or "staff":` evaluate to?', ['False', 'True (har qanday role uchun)', 'None', 'SyntaxError'], ['False', 'True for any role', 'None', 'SyntaxError'], 1, '`"staff"` truthy bo‘lgani uchun har doim `True`.', 'Always truthy due to `"staff"`.'),
      q('q0703_3', 'Float sonlarni solishtirishning ishonchli usuli?', 'Reliable way to compare floating-point results?', ['==', 'is', 'math.isclose()', 'id()'], ['==', 'is', 'math.isclose()', 'id()'], 2, '`math.isclose()`.', '`math.isclose()`.'),
      q('q0703_4', 'Nima uchun auth/kiritish tekshiruvida `assert` ishlatilmaydi?', 'Why avoid `assert` for input/auth validation?', ['Sekin', 'python -O bayrog‘i assert larni o‘chirib tashlaydi', 'Faqat int uchun', 'SyntaxError beradi'], ['Slow', 'python -O strips assert statements', 'Ints only', 'SyntaxError'], 1, '`python -O` opt rejimida barcha `assert` o‘chadi.', '`-O` disables `assert`.'),
      q('q0703_5', '`assert False` bajarilsa qaysi xato ko‘tariladi?', 'Exception raised by failing `assert`?', ['ValueError', 'AssertionError', 'LogicError', 'RuntimeError'], ['ValueError', 'AssertionError', 'LogicError', 'RuntimeError'], 1, '`AssertionError`.', '`AssertionError`.'),
    ],
    homework: hw('Mantiqiy Xatolarni Top va Tuzat (Bug Hunt)', 'Silent Bug Hunt Lab', 'Quyidagi 3 ta yashirin mantiqiy xatoni tuzating va har biriga `assert` testlar yozing: (1) chegirma hisobida ustuvorlik, (2) `range` off-by-one, (3) `0.1 + 0.2 == 0.3` float tekshiruvi.', 'Fix 3 silent logical bugs (precedence average, inclusive range sum, float comparison) and prove each with `assert` invariants.', ['3 ta tuzatilgan funksiya', 'Har biriga kamida 2 ta assert'], ['3 fixed functions', '2+ assertions each'], 'math.isclose(a + b, target)', 'Use isclose for floats.', 'Chekka qiymatlar (`0`, manfiy son) uchun ham assert qo‘shing.', 'Add edge-case assertions.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-07-04',
    courseId: 'errors_testing',
    moduleId: 'c07_m2',
    order: 4,
    titleUz: '`try` va `except` — xatolarni nazorat qilish va Review #14',
    titleEn: 'Exception Handling with `try` & `except` + Review #14',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-07-03'],
    conceptId: 'try_except',
    whyUz: "Haqiqiy foydalanuvchilar raqam o‘rniga matn kiritadi, API vaqtincha javob bermaydi yoki fayl topilmaydi. `try / except` dasturni qulashdan saqlab, muloyim xato xabari yoki zaxira (fallback) yo‘liga o‘tkazadi.",
    whyEn: '`try` / `except` gracefully handles expected runtime failures—invalid inputs, missing keys, or unavailable files—without crashing the process.',
    analogyUz: "`try / except` — bu trapesiya ustidagi xavfsizlik to‘ri: akrobat (`try`) yiqilsa ham, aniq turdagi himoya to‘ri (`except ValueError:`) uni ilib olib o‘yinni davom ettiradi.",
    analogyEn: '`try/except` is a safety net beneath a tightrope: specific exception nets catch specific failures cleanly instead of halting the whole show.',
    stopsUz: "**Bare `except:`** (tur ko‘rsatmasdan) yoki **`except Exception: pass`** yozish eng xavfli anti-pattern dir! U hatto `KeyboardInterrupt` va siz kutmagan haqiqiy buglarni ham yashirib (swallow) yuboradi. Har doim aniq xato turini tuting!",
    stopsEn: 'Never write bare `except:` or silent `except Exception: pass`—always catch specific expected exceptions and handle or log them explicitly.',
    objUz: ['Aniq xato turlarini (`except ValueError:`, `except (TypeError, KeyError) as err:`) ushlash', 'Merosxo‘rlik tartibini (tor/subclass yuqorida, keng/base pastda) to‘g‘ri qo‘yish', 'EAFP ("It’s Easier to Ask for Forgiveness than Permission") Python uslubini tushunish'],
    objEn: ['Catch specific exceptions and bind error objects with `as err`', 'Order narrow subclasses before broader base classes', 'Apply Pythonic EAFP (`try/except`) vs LBYL (`if`) judiciously'],
    theoryUz: `### 1. \`try / except\` Sintaksisi
\`\`\`python
try:
    age = int(raw)
except ValueError as err:
    print("Noto‘g‘ri son:", err)
\`\`\`
### 2. Bir Nechta \`except\` va Tuple
Bir nechta xatoni bitta blokda: \`except (ValueError, TypeError) as e:\`.
### 3. Tartib Qoidasi (Subclass First!)
\`FileNotFoundError\` bu \`OSError\` ning bolasi. Agar avval \`except OSError:\` yozsangiz, pastdagi \`except FileNotFoundError:\` ga **hech qachon navbat kelmaydi**!
### 4. \`try\` Blokini Minimal Saqlang
\`try:\` ichiga 30 qator kod tiqmang — faqat xato chiqishi mumkin bo‘lgan **1–2 qatorni** qo‘ying, aks holda boshqa joydagi \`ValueError\` ni adashib tutib olasiz.
### 5. Keng tarqalgan xato
Bare \`except:\` yoki \`except Exception: pass\` bilan xatolarni yutib yuborish.`,
    theoryEn: `### 1. Targeted \`try / except\`
Catch the exact exception class you know how to recover from.
### 2. Multiple Handlers & Tuples
Group shared handlers with \`except (KeyError, IndexError) as err:\`.
### 3. Inheritance Order
Always list narrower exceptions (\`FileNotFoundError\`) before parent exceptions (\`OSError\`).
### 4. Keep \`try\` Small
Wrap only the specific operation that may fail so unrelated bugs aren’t masked.
### 5. Never Swallow Exceptions Silently
Avoid bare \`except:\` or empty \`pass\` blocks.`,
    examples: [
      ex('Misol 1: Aniq xatolarni ajratib ushlash', 'Example 1: Specific Multiple Handlers', `def parse_ratio(data: dict, key: str) -> float | None:\n    try:\n        val = int(data[key])\n        return round(100 / val, 2)\n    except KeyError:\n        print("Missing key:", key)\n    except (ValueError, ZeroDivisionError) as err:\n        print("Bad divisor:", err)\n    return None\n\nprint(parse_ratio({"n": "4"}, "n"))\nparse_ratio({}, "n")\nparse_ratio({"n": "0"}, "n")`, `25.0\nMissing key: n\nBad divisor: division by zero`, 'Har bir xato turiga mos aniq xabar chiqarildi.', 'Handled missing keys separately from invalid/zero divisors.'),
      ex('Misol 2: Subclass birinchi tartibi (`FileNotFoundError` < `OSError`)', 'Example 2: Specific Subclass First', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    try:\n        Path(d, "nope.txt").read_text(encoding="utf-8")\n    except FileNotFoundError:\n        print("Caught specific FileNotFoundError!")\n    except OSError:\n        print("General OS error")`, `Caught specific FileNotFoundError!`, '`FileNotFoundError` `OSError` dan oldin turgani uchun aniq ushlandi.', 'Narrow `FileNotFoundError` matched before general `OSError`.'),
      ex('Misol 3: EAFP uslubida lug‘atdan xavfsiz o‘qish', 'Example 3: Pythonic EAFP Conversion', `raw_items = ["10", "x", "25"]\nparsed = []\nfor s in raw_items:\n    try:\n        parsed.append(int(s))\n    except ValueError:\n        continue\nprint(parsed)`, `[10, 25]`, 'Buzilgan `"x"` qiymat tashlab ketilib, toza sonlar yig‘ildi.', 'Skipped non-numeric tokens cleanly via `try/except ValueError`.'),
    ],
    traceTitleUz: '`try / except` oqim izi',
    traceTitleEn: 'Tracing Exception Dispatch',
    traceCode: `try:\n    x = int("abc")\n    print("After")\nexcept ValueError:\n    print("Recovered")`,
    traceSteps: [
      traceStep(1, 'int("abc")', 'raises ValueError', 'Xato ko‘tarildi', 'Raised ValueError'),
      traceStep(2, 'print("After")', 'SKIPPED', 'Qolgan try qatorlari o‘tkazildi', 'Skipped rest of try block'),
      traceStep(3, 'except ValueError:', 'Recovered', 'Mos handler ishladi', 'Matched ValueError handler', 'Recovered'),
    ],
    commonMistakes: [
      mistake('Bare `except:` yoki `except Exception: pass` yozish', 'Swallowing All Errors with Bare except', `try:\n    res = 10 / 0\nexcept:\n    pass`, 'Silent bug—impossible to debug!', `try:\n    res = 10 / 0\nexcept ZeroDivisionError as e:\n    print("Cannot divide by zero:", e)`, 'Hamma xatoni yutib yuborish real loyihalarda eng qiyin buglarga sabab bo‘ladi.', 'Swallowing errors silently hides bugs.', 'Aniq xatoni tuting va xabar/log yozing.', 'Catch specific classes and report or recover explicitly.'),
      mistake('`try` blokiga butun dasturni tiqish', 'Overly Broad try Block', `try:\n    name = input_val\n    count = int("10")\n    print(undefined_var)\nexcept Exception:\n    print("Must be bad input!")`, 'Misdiagnoses NameError bug as bad input!', `raw = "10"\ntry:\n    count = int(raw)\nexcept ValueError:\n    count = 0\nprint(count)`, 'Keng `try` haqiqiy kod xatolarini ham input xatosi deb yashiradi.', 'Broad `try` masks unrelated bugs.', '`try` ichida faqat xavfli 1–2 qator qoldiring.', 'Keep `try` blocks minimal.'),
    ],
    compareTitleUz: 'LBYL (`if`) vs EAFP (`try/except`)',
    compareTitleEn: 'LBYL (`if`) vs EAFP (`try/except`)',
    compareUz: ['LBYL (Look Before You Leap): `if s.isdigit():` — oddiy va kutilgan shartlarda tez.', 'EAFP (Forgiveness vs Permission): `try: int(s) except ValueError:` — manfiy son `"-5"`, float `"3.14"` va fayl ochishda (race condition yo‘q) Python standarti!'],
    compareEn: ['LBYL: pre-checks with `if` when failure is common.', 'EAFP: `try/except`—cleaner for parsing `"-5"`/`"3.14"` and atomic file checks.'],
    compareSummaryUz: 'Manfiy/kasr sonlar va I/O operatsiyalarida EAFP (`try/except` aniq xato turi bilan) eng ishonchli usuldir.',
    compareSummaryEn: 'Use EAFP (`try/except` on narrow exception types) for parsing and I/O.',
    practiceTasks: [
      pt('p0704_1', '1-mashq: `int()` xatosini tutish', 'Task 1: Safe Int Parse', '`safe_int(s)` yozib `safe_int("7")` -> `7`, `safe_int("no")` -> `0` chiqaring.', 'Parse int with fallback 0.', `def safe_int(s):\n    try:\n        return int(s)\n    except ValueError:\n        return 0\nprint(safe_int("7"), safe_int("no"))`, '7 0', 'except ValueError: return 0', 'Test both.'),
      pt('p0704_2', '2-mashq: Bir nechta xato tuple', 'Task 2: Tuple Except', '`except (KeyError, IndexError):` bilan `{}["a"]` ni tutib `"missing"` chiqaring.', 'Catch tuple of lookup errors.', `try:\n    _ = {}["a"]\nexcept (KeyError, IndexError):\n    print("missing")`, 'missing', 'except (KeyError, IndexError):', 'Prints missing.'),
      pt('p0704_3', '3-mashq: `as err` bilan xabar', 'Task 3: Bind Exception', '`1 / 0` dan `except ZeroDivisionError as e:` qilib `type(e).__name__` chiqaring.', 'Bind exception object.', `try:\n    _ = 1 / 0\nexcept ZeroDivisionError as e:\n    print(type(e).__name__)`, 'ZeroDivisionError', 'as e', 'Print name.'),
      pt('p0704_4', '4-mashq: Ro‘yxatni tozalash', 'Task 4: Filter Valid Floats', '`["1.5", "bad", "2.5"]` dan yaroqli floatlar yig‘indisini chiqaring.', 'Sum valid floats ignoring bad strings.', `total = 0.0\nfor s in ["1.5", "bad", "2.5"]:\n    try:\n        total += float(s)\n    except ValueError:\n        pass\nprint(total)`, '4.0', 'except ValueError', 'Sum valid floats.'),
      pt('p0704_5', '5-mashq: Tor klass oldinda', 'Task 5: Subclass Order', '`ArithmeticError` dan oldin `ZeroDivisionError` qo‘yib `"zero"` chiqaring.', 'Match subclass before parent.', `try:\n    _ = 5 / 0\nexcept ZeroDivisionError:\n    print("zero")\nexcept ArithmeticError:\n    print("math")`, 'zero', 'ZeroDivisionError < ArithmeticError', 'Order narrow first.'),
    ],
    quiz: [
      q('q0704_1', 'Nima uchun bare `except:` yozish yomon?', 'Why is bare `except:` considered harmful?', ['Sekin ishlaydi', 'Barcha xatolarni (hatto bug va KeyboardInterrupt ni) ko‘r-ko‘rona yashiradi', 'SyntaxError beradi', 'Xotira yeydi'], ['Slow', 'Masks unexpected bugs and KeyboardInterrupt', 'SyntaxError', 'Memory leak'], 1, 'Haqiqiy buglarni ham tutib yashirib qo‘yadi.', 'Silently catches unrelated bugs and system exits.'),
      q('q0704_2', '`FileNotFoundError` va `OSError` birga tutilsa qaysi biri tepada turishi kerak?', 'Ordering `FileNotFoundError` and `OSError`: which goes first?', ['OSError', 'FileNotFoundError (tor klass)', 'Farqi yo‘q', 'Alifbo tartibida'], ['OSError', 'FileNotFoundError (subclass)', 'Either', 'Alphabetical'], 1, 'Tor (subclass) `FileNotFoundError` birinchi turishi shart.', 'Narrower subclass first.'),
      q('q0704_3', 'Bitta `except` da 2 ta xatoni tutish sintaksisi?', 'Syntax to catch two exception types together?', ['except A or B:', 'except (A, B):', 'except A, B:', 'except [A, B]:'], ['except A or B:', 'except (A, B):', 'except A, B:', 'except [A, B]:'], 1, '`except (A, B):`.', '`except (A, B):`.'),
      q('q0704_4', 'EAFP qisqartmasi Python da nimani bildiradi?', 'What does Python’s EAFP principle mean?', ['Hamma narsani oldindan if bilan tekshirish', 'Kodni sinab ko‘rib, xato chiqsa except bilan boshqarish', 'Xatoni o‘chirish', 'Fayl yozish'], ['Always pre-check', 'Try operation and catch specific exceptions', 'Disable errors', 'Write files'], 1, 'Try/except bilan ishlab, xato bo‘lsa ushlash.', 'Ask forgiveness via `try/except`.'),
      q('q0704_5', '`"-12".isdigit()` nimani qaytaradi (EAFP ning foydasi)?', 'What does `"-12".isdigit()` return?', ['True', 'False', '-12', 'Error'], ['True', 'False', '-12', 'Error'], 1, '`False` — shuning uchun `try: int(s)` EAFP manfiy sonlarda ham to‘g‘ri ishlaydi!', '`False`—whereas `try: int("-12")` works properly.'),
    ],
    homework: hw('Xatolarga Chidamli JSON/CSV O‘quvchi', 'Resilient Batch Record Parser', 'Aralash yaroqli va buzilgan satrlar ro‘yxatidan (`"Ali:90"`, `"BadLine"`, `"Lola:abc"`, `"Bek:85"`) `try/except` bilan faqat to‘g‘ri `(ism, ball)` juftliklarini ajratib, xato satrlar sonini hisoblang.', 'Parse mixed `"name:score"` strings catching `ValueError` cleanly and returning valid records plus skipped count.', ['try/except faqat int() va split() atrofida', 'Aniq xato turlari'], ['Minimal try blocks', 'Catch ValueError specifically'], 'try: name, raw = line.split(":"); score = int(raw)', 'Validate cleanly.', 'Ball `0..100` oralig‘ida ekanini ham tekshiring.', 'Reject out-of-range scores.', 20),
    reviewCheckpoint: review(
      14,
      'Review Loyiha #14: Xatolarga Chidamli Fayl Konfig Yuklovchisi (Course 6 + Course 7)',
      'Review Project #14: Fault-Tolerant Config Loader',
      '70-dars marrasi! `pathlib`, `json` va maqsadli `try/except` (`FileNotFoundError`, `JSONDecodeError`, `ValueError`) ni birlashtirib hech qachon qulamaydigan konfiguratsiya yuklovchi yozing.',
      '70-lesson milestone! Combine `pathlib`, `json`, and targeted `try/except` handlers into a crash-proof config loader.',
      ['`load_config(path: Path, defaults: dict) -> dict` funksiyasi', '`FileNotFoundError` va `json.JSONDecodeError` ni alohida boshqarish', 'Yaroqli maydonlarni `defaults` bilan merge (`|`) qilish'],
      ['Implement `load_config(path, defaults) -> dict`', 'Handle `FileNotFoundError` and `JSONDecodeError` distinctly', 'Merge safely with `defaults | parsed`'],
      `import json, tempfile
from pathlib import Path

def load_config(path: Path, defaults: dict) -> dict:
    try:
        raw = path.read_text(encoding="utf-8")
        data = json.loads(raw)
        if not isinstance(data, dict):
            raise ValueError("Root must be JSON object")
        return defaults | data
    except FileNotFoundError:
        return defaults.copy()
    except (json.JSONDecodeError, ValueError):
        return defaults.copy()

defaults = {"port": 8000, "debug": False}
with tempfile.TemporaryDirectory() as d:
    p = Path(d) / "cfg.json"
    print("Missing:", load_config(p, defaults))
    p.write_text("{corrupt", encoding="utf-8")
    print("Corrupt:", load_config(p, defaults))
    p.write_text('{"port": 9000}', encoding="utf-8")
    print("Valid:", load_config(p, defaults))`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-07-05',
    courseId: 'errors_testing',
    moduleId: 'c07_m2',
    order: 5,
    titleUz: '`else` va `finally` — mukammal xato boshqaruvi sikli',
    titleEn: '`try / except / else / finally`: Exact Execution Semantics',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-07-04'],
    conceptId: 'else_finally',
    whyUz: "Nima uchun `try` blokiga hamma kodni qo‘shish xavfli ekanini bildik. Xo‘sh, `try` **muvaffaqiyatli** o‘tgandagina ishlashi kerak bo‘lgan kod qayerda turadi (`else`), va nima bo‘lishidan qatʼiy nazar **har doim** yopilishi kerak tozalash qayerda (`finally`)?",
    whyEn: '`else` runs strictly when `try` succeeds without masking its exceptions, while `finally` executes unconditionally for guaranteed cleanup—even past `return`.',
    analogyUz: "`try` — jarrohlik amaliyoti; `except` — asorat chiqsa tez yordam; `else` — amaliyot muvaffaqiyatli o‘tsagina beriladigan ruxsat; `finally` — har qanday natijadan keyin ham operatsiya xonasini **albatta** tozalash!",
    analogyEn: '`try` attempts the action; `except` catches failure; `else` celebrates success; `finally` cleans up the room unconditionally.',
    stopsUz: "1) `else:` faqat **`try` xatosiz tugaganda** ishlaydi (va `else` ichidagi xato `except` ga tushmaydi!). 2) `finally:` **`return` dan ham kuchli** — `try` ichida `return 1` bo‘lsa ham `finally:` bajariladi; agar `finally` ichida ham `return 2` yozsangiz, u asl natijani yutib yuboradi (HECH QACHON `finally` da `return` yozmang)!",
    stopsEn: '`else` runs only if `try` succeeded; `finally` runs even after `return`—and putting a `return` inside `finally` silently overrides the `try` return value or swallows exceptions!',
    objUz: ['To‘liq 4-qismli `try / except / else / finally` oqimini aniq chizish', 'Nima uchun muvaffaqiyatli kod `try` emas, `else` da turishi kerakligini tushunish', '`finally` va `return` o‘zaro taʼsiri hamda `finally` da `return` yozmaslik qoidasini bilish'],
    objEn: ['Trace all execution paths through `try / except / else / finally`', 'Keep `try` minimal by moving post-success work into `else`', 'Never put `return` inside `finally` so exceptions and values are preserved'],
    theoryUz: `### 1. To‘liq 4-Blokli Tuzilma
- **\`try:\`** faqat xato otishi mumkin bo‘lgan xavfli qator
- **\`except Error:\`** xato chiqqanda ishlaydi
- **\`else:\`** **faqat** \`try\` xatosiz tugaganda ishlaydi (lekin \`else\` dagi xatoni yuqoridagi \`except\` ushlamaydi!)
- **\`finally:\`** xato chiqsa ham, chiqmasa ham, \`return\` qilinsa ham **100% ishlaydi**
### 2. Nima Uchun \`else\` Kerak?
Agar muvaffaqiyatli qatorni \`try\` ichiga qo‘ysangiz, undagi kutilmagan \`ValueError\` ni ham \`except\` ushlab olib chalg‘itadi. \`else\` da esa toza ajratiladi!
### 3. \`finally\` + \`return\` Xavfi!
\`finally:\` ichida \`return\` yozish \`try\` dagi \`return\` qiymatini ham, ko‘tarilgan Exception ni ham butunlay o‘chirib yuboradi!
### 4. Keng tarqalgan xato
\`else\` ni \`finally\` dan keyin yozish (\`SyntaxError\`: tartib qatʼiy \`try -> except -> else -> finally\`).`,
    theoryEn: `### 1. Execution Roles
\`try\` (risky operation), \`except\` (failure handler), \`else\` (success continuation), \`finally\` (unconditional cleanup).
### 2. Why \`else\` Matters
Prevents accidental catching of exceptions raised by post-success logic.
### 3. Never \`return\` in \`finally\`
Returning from \`finally\` swallows active exceptions and overwrites \`try\` return values.
### 4. Strict Clause Order
Always \`try -> except -> else -> finally\`.`,
    examples: [
      ex('Misol 1: To‘liq `try / except / else / finally` sikli', 'Example 1: Full 4-Clause Flow', `def process(raw: str) -> str:\n    log = []\n    try:\n        num = int(raw)\n    except ValueError:\n        log.append("invalid")\n        return "ERR"\n    else:\n        log.append(f"ok:{num * 2}")\n        return f"VAL={num * 2}"\n    finally:\n        log.append("cleanup")\n        print("Trace:", " -> ".join(log))\n\nprint(process("15"))\nprint(process("abc"))`, `Trace: ok:30 -> cleanup\nVAL=30\nTrace: invalid -> cleanup\nERR`, 'Har ikki holatda ham `return` dan oldin `finally` bajarildi!', '`finally` ran cleanup before returning on both success and failure paths.'),
      ex('Misol 2: `else` blokidagi xato `except` ga tushmaydi', 'Example 2: else Isolates Subsequent Errors', `try:\n    val = int("10")\nexcept ValueError:\n    print("Bad int")\nelse:\n    try:\n        print(100 / (val - 10))\n    except ZeroDivisionError:\n        print("Math error inside else!")`, `Math error inside else!`, '`val = int("10")` muvaffaqiyatli o‘tgach `else` ishladi va undagi mantiq alohida nazorat qilindi.', 'Separating `else` prevented masking downstream math errors.'),
      ex('Misol 3: `finally` bilan ulanish/resurs holatini tiklash', 'Example 3: Deterministic State Cleanup', `locked = False\ntry:\n    locked = True\n    print("Working, locked:", locked)\n    raise RuntimeError("step failed")\nexcept RuntimeError as e:\n    print("Caught:", e)\nfinally:\n    locked = False\nprint("After finally, locked:", locked)`, `Working, locked: True\nCaught: step failed\nAfter finally, locked: False`, 'Xato chiqishiga qaramay `finally` qulfni (`locked = False`) bo‘shatdi.', '`finally` restored `locked = False` even after the error.'),
    ],
    traceTitleUz: '`try/except/else/finally` + `return` izi',
    traceTitleEn: 'Tracing finally with return',
    traceCode: `def f():\n    try:\n        return "from_try"\n    finally:\n        print("cleaned")\n\nprint(f())`,
    traceSteps: [
      traceStep(1, 'return "from_try"', 'pending return', 'Return qiymati eslab qolindi', 'Staged return value'),
      traceStep(2, 'finally: print("cleaned")', 'cleaned', 'Qaytishdan oldin finally ishladi', 'Executed finally cleanup', 'cleaned'),
      traceStep(3, 'print(f())', 'from_try', 'Saqlangan qiymat qaytdi', 'Delivered staged value', 'from_try'),
    ],
    commonMistakes: [
      mistake('`finally` ichida `return` yozib xatoni yutib yuborish', 'Return Inside finally Swallows Exceptions', `def bad():\n    try:\n        1 / 0\n    finally:\n        return "fine!"\nprint(bad())`, 'Silently returns "fine!" and hides ZeroDivisionError!', `def good():\n    try:\n        return 10 // 2\n    finally:\n        print("cleanup only")\nprint(good())`, '`finally` dagi `return` faol exceptionni ham bekor qiladi.', 'A `return` in `finally` discards active exceptions.', '`finally` da faqat tozalash (cleanup) yozing, `return` emas!', 'Keep `finally` strictly for cleanup.'),
      mistake('`else` ni `finally` dan keyin yozish', 'Wrong Clause Order', `try:\n    x = 1\nfinally:\n    pass\nelse:\n    pass`, 'SyntaxError: invalid syntax', `try:\n    x = 1\nexcept ValueError:\n    pass\nelse:\n    print("ok")\nfinally:\n    print("done")`, 'Python sintaksisi qatʼiy: `try -> except -> else -> finally`.', 'Order must strictly be `try -> except -> else -> finally`.', '`else` ni `except` dan keyin, `finally` dan oldin qo‘ying.', 'Place `else` before `finally`.'),
    ],
    compareTitleUz: '`try` ichi vs `else` bloki',
    compareTitleEn: 'Inside `try` vs `else` Block',
    compareUz: ['`try` ichi: faqat xato kutayotgan 1–2 qator (masalan `int(s)` yoki `open(...)`).', '`else` bloki: xatosiz o‘tgandan keyingi asosiy ishlov berish (xatoni adashib ushlamaydi).'],
    compareEn: ['Inside `try`: strictly the risky line(s).', '`else` block: downstream processing that shouldn’t be caught by the preceding `except`.'],
    compareSummaryUz: 'Kichik `try`, aniq `except`, davom ettiruvchi `else` va kafolatli tozalovchi `finally` tartibiga amal qiling.',
    compareSummaryEn: 'Follow `try` (minimal) -> `except` (specific) -> `else` (on success) -> `finally` (always).',
    practiceTasks: [
      pt('p0705_1', '1-mashq: `else` faqat muvaffaqiyatda', 'Task 1: Success else', '`int("5")` da `else` ishlab `"ok:5"` chiqarsin.', 'Run else on valid int.', `try:\n    n = int("5")\nexcept ValueError:\n    print("err")\nelse:\n    print(f"ok:{n}")`, 'ok:5', 'Put print in else.', 'Tests success path.'),
      pt('p0705_2', '2-mashq: Xatoda `else` o‘tmaydi', 'Task 2: Error Skips else', '`int("x")` da `except` va `finally` ishlasin, `else` emas.', 'Verify else skipped on error.', `try:\n    n = int("x")\nexcept ValueError:\n    print("except")\nelse:\n    print("else")\nfinally:\n    print("finally")`, 'except\nfinally', 'Error runs except + finally.', 'Check output.'),
      pt('p0705_3', '3-mashq: `finally` + `return`', 'Task 3: finally Before Return', '`try: return 42` va `finally: print("done")` yozing.', 'Print done before returning 42.', `def f():\n    try:\n        return 42\n    finally:\n        print("done")\nprint(f())`, 'done\n42', 'finally runs before return completes.', 'Call print(f()).'),
      pt('p0705_4', '4-mashq: To‘liq 4 blok', 'Task 4: All 4 Clauses', '`10 / 2` uchun `else` va `finally` natijasini chiqaring.', 'Run try/except/else/finally.', `try:\n    r = 10 // 2\nexcept ZeroDivisionError:\n    print("zero")\nelse:\n    print(r)\nfinally:\n    print("end")`, '5\nend', 'try -> else -> finally', 'Print 5 then end.'),
      pt('p0705_5', '5-mashq: Holatni tiklash', 'Task 5: Restore Flag', '`busy = True` ni `try` da qo‘yib `finally` da `False` qiling.', 'Restore busy flag on error.', `busy = False\ntry:\n    busy = True\n    raise ValueError("x")\nexcept ValueError:\n    pass\nfinally:\n    busy = False\nprint(busy)`, 'False', 'Reset in finally.', 'Print busy.'),
    ],
    quiz: [
      q('q0705_1', 'To‘g‘ri klauza tartibi qaysi?', 'Correct clause order?', ['try -> finally -> except -> else', 'try -> except -> else -> finally', 'try -> else -> except -> finally', 'except -> try -> finally'], ['try -> finally -> except -> else', 'try -> except -> else -> finally', 'try -> else -> except -> finally', 'except -> try -> finally'], 1, '`try -> except -> else -> finally`.', '`try -> except -> else -> finally`.'),
      q('q0705_2', '`else` bloki qachon bajariladi?', 'When does the `else` block run?', ['Har doim', 'Faqat try da hech qanday xato chiqmaganda', 'Faqat except ishlaganda', 'Finally dan keyin'], ['Always', 'Only when try raises no exception', 'Only after except', 'After finally'], 1, 'Faqat `try` muvaffaqiyatli o‘tganda.', 'Only when `try` succeeds.'),
      q('q0705_3', '`try` ichida `return 10` bajarilsa `finally` ishlaydimi?', 'Does `finally` run if `try` executes `return 10`?', ['Yo‘q', 'Ha, return dan oldin ishlaydi', 'Faqat xato bo‘lsa', 'SyntaxError'], ['No', 'Yes, before the function returns', 'On error only', 'SyntaxError'], 1, 'Ha, har doim ishlaydi.', 'Yes, always.'),
      q('q0705_4', '`finally` ichida `return` yozish nima uchun xavfli?', 'Why never put `return` inside `finally`?', ['Sekin', 'Faol Exception va try return qiymatini yutib yuboradi', 'Sintaksis xato', 'Hech qanday zarari yo‘q'], ['Slow', 'Swallows active exceptions and overrides try returns', 'SyntaxError', 'Harmless'], 1, 'Exception va asl `return` ni yutib yuboradi.', 'Swallows exceptions and overrides return values.'),
      q('q0705_5', '`else` bloki ichida xato chiqsa uni yuqoridagi `except` ushlaydimi?', 'Does the preceding `except` catch errors raised inside `else`?', ['Ha', 'Yo‘q', 'Faqat ValueError ni', 'Baʼzan'], ['Yes', 'No', 'ValueError only', 'Sometimes'], 1, 'Yo‘q, `except` faqat `try` ni qo‘riqlaydi.', 'No, `except` guards only `try`.'),
    ],
    homework: hw('Tranzaksiya Simulyatori (`try/except/else/finally`)', 'Safe Transaction Runner', '`run_transfer(balance, amount, should_fail=False)` funksiyasini yozing: `lock` ochib, muvaffaqiyatda (`else`) balansni yangilasin, xatoda (`except`) bekor qilsin va `finally` da har doim lock ni yopsin.', 'Simulate a bank transfer setting a lock flag, applying debit in `else`, rolling back on failure in `except`, and releasing the lock in `finally`.', ['try / except / else / finally hammasi ishlatilsin', 'finally da return bo‘lmasin'], ['Use all 4 clauses', 'No return in finally'], 'finally:\n    state["locked"] = False', 'Guarantee unlock.', 'Har ikki holat (muvaffaqiyat va xato) ni test qiling.', 'Test both success and rollback.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),
];
