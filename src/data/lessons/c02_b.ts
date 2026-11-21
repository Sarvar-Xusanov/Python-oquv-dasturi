import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C02_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-02-07',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m2',
    order: 7,
    titleUz: 'Booleans — mantiqiy qiymatlar va Truthiness',
    titleEn: 'Booleans, Truthiness & Falsy Values',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-02-06'],
    conceptId: 'booleans_truthiness',
    whyUz: "Har bir `if` sharti va `while` sikli oxir-oqibat bitta savolga keladi: Rost (`True`) yoki Yolg'on (`False`)? Python dagi Truthy/Falsy qoidalarini bilish kodni qisqa va xatosiz qiladi.",
    whyEn: 'Every conditional and loop reduces to a boolean truth value. Mastering `bool()` truthiness prevents empty-list and zero-value bugs.',
    analogyUz: "Boolean — bu elektr tugmasi: faqat Yoqilgan (`True` / `1`) yoki O'chirilgan (`False` / `0`) holati bor; uchinchi holat yo'q.",
    analogyEn: 'A boolean is a light switch: strictly ON (`True`) or OFF (`False`), with no middle state.',
    stopsUz: "`bool(0)` bu `False`, lekin `bool(\"0\")` (matn!) — `True`! Chunki bo'sh bo'lmagan har qanday matn Truthy hisoblanadi.",
    stopsEn: '`bool(0)` is `False`, but `bool("0")` is `True` because any non-empty string is truthy!',
    objUz: ['`True` va `False` qiymatlarini to‘g‘ri ishlatish', 'Falsy qiymatlar ro‘yxatini (`0`, `0.0`, `""`, `[]`, `{}`, `None`) yodda saqlash', '`bool()` orqali istalgan obyektni mantiqiy tekshirish'],
    objEn: ['Use `True` and `False` literals accurately', 'Identify all Python falsy values (`0`, `""`, `[]`, `{}`, `None`)', 'Evaluate truthiness safely with `bool()`'],
    theoryUz: `### 1. \`bool\` turi
Faqat ikki qiymat mavjud: **\`True\`** va **\`False\`** (bosh harfi katta!).
### 2. Truthy va Falsy qiymatlar
Python \`if x:\` yozilganda avtomatik \`bool(x)\` ni chaqiradi. Quyidagilar doim **Falsy (\`False\`)**:
| Qiymat | Turi | \`bool(val)\` |
|---|---|---|
| \`0\`, \`0.0\` | Son | \`False\` |
| \`""\` | Bo‘sh matn | \`False\` |
| \`[]\`, \`()\`, \`{}\`, \`set()\` | Bo‘sh kolleksiya | \`False\` |
| \`None\` / \`False\` | Maxsus | \`False\` |
Qolgan barcha qiymatlar (\`-1\`, \`"False"\`, \`[0]\`) — **Truthy (\`True\`)**!
### 3. \`bool\` aslida \`int\` kenja turi
\`True + True == 2\` va \`isinstance(True, int) == True\`. Bu ro‘yxatda nechta \`True\` borligini \`sum()\` bilan sanashda qo‘l keladi!
### 4. \`0\` va \`None\` farqi
Agar foydalanuvchi hisobida \`balance = 0\` bo‘lishi mumkin bo‘lsa, \`if not balance:\` o‘rniga \`if balance is None:\` deb tekshiring!
### 5. Keng tarqalgan xato
\`bool("False")\` — \`True\` chiqaradi, chunki bu 5 ta harfli matn!`,
    theoryEn: `### 1. The \`bool\` Type
Strictly two constants: \`True\` and \`False\` (capitalized).
### 2. Falsy vs Truthy Values
Python treats \`0\`, \`0.0\`, \`""\`, \`[]\`, \`()\`, \`{}\`, \`set()\`, \`None\`, and \`False\` as **Falsy**. Everything else—including \`-1\`, \`[0]\`, and \`"False"\`—is **Truthy**.
### 3. Booleans Subclass Integers
\`True == 1\`, \`False == 0\`, allowing \`sum([True, False, True]) == 2\`.
### 4. Distinguishing \`0\` from \`None\`
When \`0\` is a valid value (score, balance), check \`if val is None:\` explicitly instead of \`if not val:\`.
### 5. Classic Trap
\`bool("False")\` is \`True\`!`,
    examples: [
      ex('Misol 1: Falsy va Truthy tekshiruvi', 'Example 1: Testing Falsy & Truthy Values', `samples = [0, 1, "", "0", [], [0], None]\nfor item in samples:\n    print(f"{repr(item):6} -> {bool(item)}")`, `0      -> False\n1      -> True\n''     -> False\n'0'    -> True\n[]     -> False\n[0]    -> True\nNone   -> False`, 'Bo‘sh bo‘lmagan `"0"` va `[0]` Truthy ekanligiga eʼtibor bering.', 'Notice non-empty `"0"` and `[0]` evaluate to `True`.'),
      ex('Misol 2: `True` larni `sum()` bilan sanash', 'Example 2: Counting True Flags with sum()', `passed = [True, False, True, True, False]\nprint("Passed count:", sum(passed))`, `Passed count: 3`, '`True == 1` bo‘lgani uchun `sum()` ro‘yxatdagi `True` lar sonini darhol beradi.', 'Since `True == 1`, `sum()` counts passing flags cleanly.'),
      ex('Misol 3: `0` vs `None` ehtiyotkorligi', 'Example 3: Guarding Valid Zero vs None', `score = 0\nprint("if not score:", not score)\nprint("score is None:", score is None)`, `if not score: True\nscore is None: False`, '`score = 0` haqiqiy ball bo‘lsa, `is None` uni yo‘q qiymatdan ajratadi.', 'Explicit `is None` preserves valid `0` scores.'),
    ],
    traceTitleUz: 'Truthiness baholash izi',
    traceTitleEn: 'Tracing Truthiness Evaluation',
    traceCode: `text = ""\nhas_text = bool(text)\ncount = int(True) + int(has_text)\nprint(has_text, count)`,
    traceSteps: [
      traceStep(1, 'text = ""', 'text=""', 'Bo‘sh matn', 'Empty string'),
      traceStep(2, 'has_text = bool(text)', 'has_text=False', 'Bo‘sh matn Falsy', 'Empty string is False'),
      traceStep(3, 'count = int(True) + int(has_text)', 'count=1', '1 + 0 = 1', '1 + 0 = 1'),
      traceStep(4, 'print(...)', 'False 1', 'Chiqish', 'Output', 'False 1'),
    ],
    commonMistakes: [
      mistake('`"False"` matnini `False` deb o‘ylash', 'Confusing "False" String with Boolean False', `flag = "False"\nif flag:\n    print("Kirdi!")`, 'Unexpectedly enters if block', `flag = False\nif flag:\n    print("Kirmaydi")`, 'Qo‘shtirnoq ichidagi har qanday matn Truthy.', 'Any non-empty string is truthy.', 'Boolean qiymatlarni qo‘shtirnoqsiz yozing.', 'Write `True`/`False` without quotes.'),
      mistake('`0` ballni yo‘q deb hisoblash', 'Treating 0 Score as Missing', `score = 0\nif not score:\n    print("Topshirilmagan")`, 'Wrong label for 0 score', `score = 0\nif score is None:\n    print("Topshirilmagan")\nelse:\n    print("Ball:", score)`, '`not 0` True beradi.', '`not 0` is True.', 'Yo‘qlik uchun `is None` ishlating.', 'Use `is None` for missing values.'),
    ],
    compareTitleUz: '`if len(items) > 0:` vs `if items:`',
    compareTitleEn: '`if len(items) > 0:` vs `if items:`',
    compareUz: ['`if items:`: PEP 8 tavsiya etgan qisqa va toza usul.', '`if x is not None:`: son `0` bo‘lishi mumkin joyda majburiy.'],
    compareEn: ['`if items:`: idiomatic PEP 8 check for non-empty sequences.', '`if x is not None:`: required when `0` is a valid number.'],
    compareSummaryUz: 'Kolleksiyalar uchun `if items:`, ixtiyoriy sonlar uchun `if x is not None:` yozing.',
    compareSummaryEn: 'Use `if items:` for collections and `if x is not None:` for optional numbers.',
    practiceTasks: [
      pt('p0207_1', '1-mashq: bool("0")', 'Task 1: String Zero Truthiness', '`bool("0")` natijasini chiqaring.', 'Print `bool("0")`.', `print(bool("0"))`, 'True', 'Bo‘sh bo‘lmagan str.', 'Non-empty string.'),
      pt('p0207_2', '2-mashq: bool([])', 'Task 2: Empty List Falsy', '`bool([])` natijasini chiqaring.', 'Print `bool([])`.', `print(bool([]))`, 'False', 'Bo‘sh ro‘yxat.', 'Empty list is falsy.'),
      pt('p0207_3', '3-mashq: True yig‘indisi', 'Task 3: Sum Booleans', '`[True, True, False, True]` da nechta True borligini chiqaring.', 'Count Trues using sum().', `print(sum([True, True, False, True]))`, '3', 'sum().', 'Use sum().'),
      pt('p0207_4', '4-mashq: is None vs not', 'Task 4: Zero Check', '`x = 0` da `x is None` ni chiqaring.', 'Check `x is None` when x=0.', `x = 0\nprint(x is None)`, 'False', 'is None.', 'Use is None.'),
      pt('p0207_5', '5-mashq: isinstance bool int', 'Task 5: Subclass Fact', '`isinstance(True, int)` ni chiqaring.', 'Check `isinstance(True, int)`.', `print(isinstance(True, int))`, 'True', 'bool inherits int.', 'Print isinstance.'),
    ],
    quiz: [
      q('q0207_1', 'Qaysi qiymat Truthy (`True`)?', 'Which value is Truthy?', ['0', '""', '"False"', '[]'], ['0', '""', '"False"', '[]'], 2, 'Bo‘sh bo‘lmagan string Truthy.', 'Non-empty string is truthy.'),
      q('q0207_2', '`bool(None)` nimaga teng?', 'Value of `bool(None)`?', ['True', 'False', 'None', 'Error'], ['True', 'False', 'None', 'Error'], 1, 'False.', 'False.'),
      q('q0207_3', '`True + True + False` natijasi?', 'Result of `True + True + False`?', ['True', '2', '3', 'Error'], ['True', '2', '3', 'Error'], 1, '1 + 1 + 0 = 2.', '2.'),
      q('q0207_4', '0 ballni `None` dan ajratish uchun?', 'How to distinguish 0 from None?', ['if x:', 'if x is None:', 'if not x:', 'if bool(x):'], ['if x:', 'if x is None:', 'if not x:', 'if bool(x):'], 1, '`is None`.', '`is None`.'),
      q('q0207_5', '`bool(-5)` nimani qaytaradi?', 'What does `bool(-5)` return?', ['True', 'False', 'Error', '-1'], ['True', 'False', 'Error', '-1'], 0, '0 dan boshqa har qanday son Truthy.', 'Any non-zero number is truthy.'),
    ],
    homework: hw('Forma Validatsiya Tekshirgichi', 'Form Input Truthiness Checker', 'Foydalanuvchi maydonlari (`name="Ali"`, `age=0`, `bio=""`, `notes=None`) uchun bo‘sh va kiritilgan maydonlarni aniq hisobot qilib chiqaring.', 'Audit form fields checking empty strings vs valid 0 vs None.', ['0 ni haqiqiy qiymat sifatida qabul qiling', 'Bo‘sh stringlarni aniqlang'], ['Accept 0 as valid', 'Flag empty strings'], 'field is None vs not field', 'Use `is None` carefully.', 'Valid maydonlar sonini chiqaring.', 'Count valid fields.', 20),
    reviewCheckpoint: review(
      3,
      '3-Review Loyiha: Maʼlumot Turlari & Truthiness Auditori',
      'Review Project #3: Data Types, Decimal & Truthiness Auditor',
      '11–15 darslar (`Variables`, `Data Types`, `Int/Float/Decimal`, `Strings`, `Booleans`) bilimlarini bitta maʼlumot tozalovchi va audit skriptida jamlang.',
      'Combine lessons 11–15 into a data sanitizer using `Decimal`, string normalization, type checks, and truthiness.',
      ['1) Matnni `.strip().lower()` bilan tozalash', '2) `Decimal` bilan aniq narx hisoblash', '3) Truthiness va `is None` tekshiruvi'],
      ['1) String normalization', '2) Exact `Decimal` calculation', '3) Truthiness & `is None` guard'],
      `from decimal import Decimal
raw_name = "  malika_dev  ".strip().title()
price = Decimal("49.90")
discount = Decimal("10.00")
print("User:", raw_name, "| Active:", bool(raw_name))
print("Final:", price - discount)`,
    ),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-02-08',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m3',
    order: 8,
    titleUz: 'Type Conversion — ma’lumot turlarini aylantirish',
    titleEn: 'Type Conversion & Safe Casting',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-02-07'],
    conceptId: 'type_conversion',
    whyUz: "Foydalanuvchi kiritmasi, CSV va JSON dan kelgan sonlar ko'pincha matn (`str`) bo'ladi. Ularni hisoblashdan oldin `int()` yoki `float()` ga xavfsiz o'girish har dasturda uchraydi.",
    whyEn: 'Inputs from keyboards, forms, and CSV files start as strings. Converting safely to `int`/`float` avoids TypeErrors and crashes.',
    analogyUz: "Type conversion — bu valyuta ayirboshlash shoxobchasi: qog'ozdagi `$100` matnini haqiqiy hisoblanadigan songa aylantirib beradi.",
    analogyEn: 'Casting is currency exchange: converting a text label `"100"` into a numeric `100` you can calculate with.',
    stopsUz: "`int(\"3.14\")` to'g'ridan-to'g'ri ishlamaydi (`ValueError`) — avval `float(\"3.14\")`, keyin `int(...)` qilish kerak!",
    stopsEn: '`int("3.14")` raises `ValueError`—cast via `int(float("3.14"))` first.',
    objUz: ['Explicit (`int()`, `float()`, `str()`, `bool()`) va Implicit (avtomatik `int + float -> float`) aylantirishni bilish', '`int("3.14")` tuzog‘idan qochish', 'Noto‘g‘ri matnda `ValueError` ni ushlash'],
    objEn: ['Use explicit constructors `int()`, `float()`, `str()`, `bool()`', 'Understand implicit int->float promotion', 'Handle invalid casts gracefully'],
    theoryUz: `### 1. Explicit Casting
\`int("42") -> 42\`, \`float("3.5") -> 3.5\`, \`str(100) -> "100"\`, \`bool(1) -> True\`.
### 2. Implicit Conversion (Avtomatik)
\`5 + 2.5\` -> Python avtomatik \`7.5\` (\`float\`) yasaydi. Lekin \`5 + "2"\` ni avtomatik qo‘shmaydi (strong typing)!
### 3. \`int("3.9")\` tuzog‘i
\`int(3.9)\` \`3\` beradi (kasrni kesadi), lekin \`int("3.9")\` **ValueError** beradi! Yechim: \`int(float("3.9"))\`.
### 4. Asoslar (Base) bilan aylantirish
\`int("1010", 2) -> 10\` (ikkilikdan o‘nlikka), \`int("ff", 16) -> 255\`.
### 5. Keng tarqalgan xato
\`int("abc")\` dasturni qulatadi — tekshirishda \`try/except ValueError\` yoki \`.isdigit()\` ishlating.`,
    theoryEn: `### 1. Explicit Constructors
\`int()\`, \`float()\`, \`str()\`, \`bool()\`.
### 2. Implicit Promotion vs Strong Typing
\`5 + 2.5 -> 7.5\`, yet \`5 + "2"\` raises \`TypeError\` because Python is strongly typed.
### 3. The \`int("3.9")\` Trap
Convert float-like strings with \`int(float("3.9"))\`.
### 4. Number Bases
\`int("1010", 2) == 10\`, \`int("ff", 16) == 255\`.
### 5. Validation
Guard untrusted user strings with \`try/except ValueError\`.`,
    examples: [
      ex('Misol 1: Asosiy tur o‘zgartirishlar', 'Example 1: Core Type Conversions', `raw = "45"\nnum = int(raw)\nprice = float("12.5")\nprint(num + 5, str(num) + "0", int(price))`, `50 450 12`, '`int("45")` songa, `str(45)` matnga, `int(12.5)` kasrni kesib `12` ga aylantiradi.', 'Demonstrates str->int, int->str, and float truncation.'),
      ex('Misol 2: Xavfsiz kasr-matn aylantirish', 'Example 2: Casting Float Strings to Int', `s = "19.8"\nwhole = int(float(s))\nprint("Truncated:", whole, "| Rounded:", round(float(s)))`, `Truncated: 19 | Rounded: 20`, '`int()` kesadi, `round()` esa eng yaqin butunga yaxlitlaydi.', '`int(float(s))` truncates while `round()` rounds nearest.'),
      ex('Misol 3: Ikkilik va o‘n oltilik sanoq', 'Example 3: Parsing Binary & Hex Strings', `print("Binary 1101:", int("1101", 2))\nprint("Hex ff:", int("ff", 16))`, `Binary 1101: 13\nHex ff: 255`, '`int(s, base)` ikkilik va hex satrlarni o‘qiydi.', 'Optional base argument decodes binary and hexadecimal strings.'),
    ],
    traceTitleUz: 'Casting zanjiri izi',
    traceTitleEn: 'Tracing Multi-Step Casting',
    traceCode: `raw = "8.7"\nf = float(raw)\nn = int(f)\nmsg = "Ball: " + str(n)\nprint(msg)`,
    traceSteps: [
      traceStep(1, 'raw = "8.7"', 'raw="8.7"', 'Kirish matni', 'Input string'),
      traceStep(2, 'f = float(raw)', 'f=8.7', 'Float ga o‘tdi', 'Cast to float'),
      traceStep(3, 'n = int(f)', 'n=8', 'Kasr kesildi', 'Truncated to 8'),
      traceStep(4, 'msg = "Ball: " + str(n)', 'msg="Ball: 8"', 'Matnga ulandi', 'Concatenated'),
      traceStep(5, 'print(msg)', 'Ball: 8', 'Chiqish', 'Output', 'Ball: 8'),
    ],
    commonMistakes: [
      mistake('`int("3.14")` yozish', 'Direct int() on Decimal String', `x = int("3.14")`, 'ValueError: invalid literal for int()', `x = int(float("3.14"))`, '`int()` nuqtali matnni tushunmaydi.', '`int()` rejects decimal points in strings.', 'Avval `float()` ga o‘giring.', 'Cast with `float()` first.'),
      mistake('`int(3.9)` ni yaxlitlash deb o‘ylash', 'Assuming int() Rounds Instead of Truncates', `print(int(3.9))  # 4 emas!`, 'Prints 3 unexpectedly', `print(round(3.9))`, '`int()` har doim kasrni tashlab yuboradi.', '`int()` truncates toward zero.', 'Yaxlitlash uchun `round()` ishlating.', 'Use `round()` when rounding is intended.'),
    ],
    compareTitleUz: '`int(x)` vs `round(x)`',
    compareTitleEn: '`int(x)` vs `round(x)`',
    compareUz: ['`int(4.9) -> 4`: kasrni shunchaki kesadi.', '`round(4.9) -> 5`: matematik yaxlitlaydi.'],
    compareEn: ['`int(4.9) -> 4`: truncates decimals.', '`round(4.9) -> 5`: rounds to nearest integer.'],
    compareSummaryUz: 'Hisob-kitobda yaxlitlash kerak bo‘lsa doim `round()` dan foydalaning.',
    compareSummaryEn: 'Use `round()` for rounding and `int()` only when truncation is desired.',
    practiceTasks: [
      pt('p0208_1', '1-mashq: str -> int qo‘shish', 'Task 1: Cast and Add', '`"15"` va `"25"` ni qo‘shib 40 chiqaring.', 'Cast `"15"` and `"25"` to ints and sum.', `print(int("15") + int("25"))`, '40', 'int().', 'Use int().'),
      pt('p0208_2', '2-mashq: float -> int', 'Task 2: Truncate Float String', '`int(float("7.9"))` ni chiqaring.', 'Cast `"7.9"` to int cleanly.', `print(int(float("7.9")))`, '7', 'int(float(...)).', 'Use float() then int().'),
      pt('p0208_3', '3-mashq: Son -> Matn uzunligi', 'Task 3: Digit Count', '`len(str(12345))` ni chiqaring.', 'Count digits of 12345 via str().', `print(len(str(12345)))`, '5', 'str().', 'Wrap in str().'),
      pt('p0208_4', '4-mashq: Binary parsing', 'Task 4: Binary String', '`int("1010", 2)` ni chiqaring.', 'Parse binary `"1010"`.', `print(int("1010", 2))`, '10', 'base 2.', 'Pass base 2.'),
      pt('p0208_5', '5-mashq: Implicit float', 'Task 5: Implicit Promotion', '`type(4 + 1.5).__name__` ni chiqaring.', 'Print type name of 4 + 1.5.', `print(type(4 + 1.5).__name__)`, 'float', 'int + float -> float.', 'Check __name__.'),
    ],
    quiz: [
      q('q0208_1', '`int("4.8")` nima beradi?', 'Result of `int("4.8")`?', ['4', '5', 'ValueError', '4.8'], ['4', '5', 'ValueError', '4.8'], 2, 'Nuqta tufayli ValueError.', 'Raises ValueError.'),
      q('q0208_2', '`int(4.9)` natijasi?', 'Result of `int(4.9)`?', ['5', '4', 'ValueError', '4.0'], ['5', '4', 'ValueError', '4.0'], 1, 'Kasrni kesadi -> 4.', 'Truncates to 4.'),
      q('q0208_3', '`5 + "5"` natijasi?', 'Result of `5 + "5"`?', ['10', '55', 'TypeError', 'SyntaxError'], ['10', '55', 'TypeError', 'SyntaxError'], 2, 'TypeError (strong typing).', 'TypeError.'),
      q('q0208_4', '`int("ff", 16)` natijasi?', 'Result of `int("ff", 16)`?', ['16', '255', '256', 'Error'], ['16', '255', '256', 'Error'], 1, '255.', '255.'),
      q('q0208_5', '`4 + 2.0` natijasining turi?', 'Type of `4 + 2.0`?', ['int', 'float', 'str', 'bool'], ['int', 'float', 'str', 'bool'], 1, 'Avtomatik `float`.', 'Implicit `float`.'),
    ],
    homework: hw('CSV Qator Konvertori', 'CSV Row Type Converter', '`"Ali, 22, 89.5, True"` qatorini `.split(",")` qilib ajrating va har bir maydonni mos turga (`str`, `int`, `float`, `bool`) o‘tkazib chiqaring.', 'Split `"Ali, 22, 89.5, True"` and cast each field to `str`, `int`, `float`, and `bool`.', ['strip() bilan tozalang', 'Mos turlarga aylantiring'], ['Strip whitespace', 'Cast all 4 fields'], 'age = int(parts[1].strip())', 'Strip then cast.', 'Dictionary ga yig‘ib JSON qilib chiqaring.', 'Pack into a dict and print.', 20),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-02-09',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m3',
    order: 9,
    titleUz: 'input() orqali ma’lumot olish',
    titleEn: 'Interactive Input with input() & Validation',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-02-08'],
    conceptId: 'user_input',
    whyUz: "Har qanday interaktiv dastur — CLI menyular, kalkulyatorlar va so'rovnomalar — foydalanuvchi bilan muloqot qilish uchun `input()` dan foydalanadi.",
    whyEn: 'Interactive scripts gather runtime user values via `input()`, requiring trimming, casting, and validation.',
    analogyUz: "`input()` — bu mikrofonga savol berib, foydalanuvchi Enter bosguncha sabr bilan kutadigan suhbatdosh; lekin u hamma javobni matn (`str`) ko'rinishida yozib oladi.",
    analogyEn: '`input()` pauses, prompts the user, waits for Enter, and always hands you back a raw `str`.',
    stopsUz: "Code Lab kabi sandbox muhitlarida interaktiv stdin bo'lmasa, dars misollarida oqimni `io.StringIO` yoki funksiya parametri bilan deterministik simulyatsiya qilamiz!",
    stopsEn: 'In automated tests and sandboxes without a live TTY, simulate stdin cleanly or pass inputs to pure functions.',
    objUz: ['`input()` doimo `str` qaytarishini bilish', '`.strip()` va `int()`/`float()` bilan tozalash', 'Funksiyalarni `input()` dan ajratib testlanadigan qilish'],
    objEn: ['Remember `input()` always returns `str`', 'Clean and cast inputs with `.strip()` and `int()`/`float()`', 'Decouple input reading from business logic for testability'],
    theoryUz: `### 1. \`input(prompt)\` qanday ishlaydi?
Dastur \`input("Ismingiz: ")\` ga yetganda to‘xtab turadi, foydalanuvchi Enter bosgach, kiritilgan matnni **\`str\`** sifatida qaytaradi.
### 2. Oltin qoida: \`input()\` DOIM \`str\` qaytaradi!
Foydalanuvchi \`25\` yozsa ham, Python uni \`"25"\` deb oladi. Hisoblash uchun \`int(input(...))\` kerak.
### 3. \`io.StringIO\` bilan input simulyatsiyasi
Unit testlarda \`sys.stdin\` ni almashtirish yoki biznes mantiqni alohida funksiyaga olish eng toza amaliyotdir.
### 4. Tozalash zanjiri
\`name = input("Ism: ").strip().title()\` — bosh/oxiridagi bo‘sh joylarni yo‘qotadi.
### 5. Keng tarqalgan xato
\`age = input("Yosh: ")\` deb \`age + 1\` yozish -> **TypeError**!`,
    theoryEn: `### 1. How \`input()\` Works
Displays optional prompt, waits for Enter, strips trailing newline, returns \`str\`.
### 2. Always Returns \`str\`
Even numeric input like \`42\` arrives as \`"42"\`; cast explicitly before math.
### 3. Clean & Normalize
\`input("Name: ").strip()\` eliminates accidental spaces.
### 4. Testable Design
Separate \`input()\` calls at the edge from pure functions that accept parameters.
### 5. Classic Bug
Adding a number directly to uncast \`input()\` raises \`TypeError\`.`,
    examples: [
      ex('Misol 1: `input()` oqimini simulyatsiya qilish', 'Example 1: Simulating input() via StringIO', `import io, sys\nsys.stdin = io.StringIO("Aziz\\n21\\n")\nname = input().strip()\nage = int(input())\nprint(f"{name} -> {age + 1} yoshga kiradi")`, `Aziz -> 22 yoshga kiradi`, '`io.StringIO` xuddi klaviaturadan yozilgandek `input()` ga maʼlumot beradi.', '`io.StringIO` feeds `input()` deterministically for testing.'),
      ex('Misol 2: Xavfsiz son o‘qish yordamchisi', 'Example 2: Safe Integer Input Parser', `def parse_age(raw: str) -> int:\n    clean = raw.strip()\n    if not clean.isdigit():\n        raise ValueError("Faqat musbat son kiriting")\n    return int(clean)\n\nprint(parse_age("  24  "))`, `24`, 'Kiritmani funksiyada tekshirish dasturni qulashdan saqlaydi.', 'Validating raw input strings avoids runtime crashes.'),
      ex('Misol 3: Standart qiymat (fallback) berish', 'Example 3: Default Fallback on Empty Input', `raw_city = "   ".strip()\ncity = raw_city or "Toshkent"\nprint("Shahar:", city)`, `Shahar: Toshkent`, '`or` operatori bo‘sh kiritmada default qiymatni tanlashga yordam beradi.', 'Short-circuit `or` applies a clean default on empty input.'),
    ],
    traceTitleUz: 'Kiritmani tozalash va aylantirish',
    traceTitleEn: 'Tracing Input Cleaning & Casting',
    traceCode: `raw = "  15 "\nclean = raw.strip()\nval = int(clean) * 2\nprint(val)`,
    traceSteps: [
      traceStep(1, 'raw = "  15 "', 'raw="  15 "', 'Klaviatura matni', 'Raw stdin text'),
      traceStep(2, 'clean = raw.strip()', 'clean="15"', 'Bo‘sh joylar ketdi', 'Trimmed'),
      traceStep(3, 'val = int(clean) * 2', 'val=30', 'Songa aylanib ko‘paydi', 'Cast & doubled'),
      traceStep(4, 'print(val)', '30', 'Natija', 'Output', '30'),
    ],
    commonMistakes: [
      mistake('`input()` natijasini `int()` siz ishlatish', 'Doing Math on Raw input()', `n = input()\nprint(n + 5)`, 'TypeError: can only concatenate str to str', `n = int(input())\nprint(n + 5)`, '`input()` doim matn qaytaradi.', '`input()` always returns `str`.', 'Son kerak bo‘lsa darhol `int()` yoki `float()` qiling.', 'Cast immediately when expecting numbers.'),
      mistake('Enter oldidagi/keyingi bo‘sh joylarni tozalamaslik', 'Forgetting .strip() on User Input', `cmd = "yes "\nprint(cmd == "yes")  # False!`, 'Unexpected mismatch', `cmd = "yes ".strip().lower()\nprint(cmd == "yes")`, 'Foydalanuvchi tasodifan probel bosishi juda ko‘p uchraydi.', 'Trailing spaces cause silent equality failures.', '`.strip()` dan odatiy foydalaning.', 'Always `.strip()` user strings.'),
    ],
    compareTitleUz: 'To‘g‘ridan-to‘g‘ri `input()` vs Pure Function',
    compareTitleEn: 'Inline `input()` vs Pure Function Parameters',
    compareUz: ['Inline `input()`: kichik CLI skriptda oddiy.', 'Funksiya parametri: avtomatik testlash va qayta ishlatish uchun eng to‘g‘ri.'],
    compareEn: ['Inline `input()`: quick scripts.', 'Function arguments: essential for automated unit tests and reuse.'],
    compareSummaryUz: 'Asosiy hisob-kitobni funksiyaga yozing, `input()` ni faqat tashqi qobiqda chaqiring.',
    compareSummaryEn: 'Keep `input()` at the program boundary and pass parsed values to pure functions.',
    practiceTasks: [
      pt('p0209_1', '1-mashq: StringIO bilan ism', 'Task 1: Read String Input', 'StringIO dan `"Madina"` ni o‘qib `"Salom, Madina"` chiqaring.', 'Read `"Madina"` from StringIO and print greeting.', `import io, sys\nsys.stdin = io.StringIO("Madina\\n")\nprint("Salom,", input().strip())`, 'Salom, Madina', 'input().strip().', 'Use input().strip().'),
      pt('p0209_2', '2-mashq: Son o‘qish', 'Task 2: Read Integer', 'StringIO dan `"12"` ni o‘qib kvadratini chiqaring.', 'Read `"12"` and print square.', `import io, sys\nsys.stdin = io.StringIO("12\\n")\nn = int(input())\nprint(n * n)`, '144', 'int(input()).', 'Cast with int().'),
      pt('p0209_3', '3-mashq: Default fallback', 'Task 3: Empty Fallback', '`"" or "Guest"` ni chiqaring.', 'Print default fallback `"Guest"` for empty string.', `raw = "".strip()\nprint(raw or "Guest")`, 'Guest', 'raw or "Guest".', 'Use `or`.'),
      pt('p0209_4', '4-mashq: isdigit() tekshiruvi', 'Task 4: isdigit Check', '`"42a".isdigit()` ni chiqaring.', 'Check `"42a".isdigit()`.', `print("42a".isdigit())`, 'False', '.isdigit().', 'Call .isdigit().'),
      pt('p0209_5', '5-mashq: Ikki kiritma yig‘indisi', 'Task 5: Two Inputs Sum', 'StringIO dan `7` va `8` o‘qib yig‘indini chiqaring.', 'Read 7 and 8 and print 15.', `import io, sys\nsys.stdin = io.StringIO("7\\n8\\n")\nprint(int(input()) + int(input()))`, '15', 'Ikki marta int(input()).', 'Call int(input()) twice.'),
    ],
    quiz: [
      q('q0209_1', '`input()` funksiyasi qaysi turda qiymat qaytaradi?', 'Return type of `input()`?', ['int', 'str', 'bool', 'Auto-detected'], ['int', 'str', 'bool', 'Auto-detected'], 1, 'Doim `str`.', 'Always `str`.'),
      q('q0209_2', 'Kiritilgan matn chetidagi bo‘sh joylarni nima olib tashlaydi?', 'Which method removes leading/trailing spaces?', ['.cut()', '.strip()', '.clean()', '.pop()'], ['.cut()', '.strip()', '.clean()', '.pop()'], 1, '`.strip()`.', '`.strip()`.'),
      q('q0209_3', 'Bo‘sh kiritmaga standart qiymat berishning qisqa yo‘li?', 'Concise fallback for empty string input?', ['x and "Default"', 'x or "Default"', 'x + "Default"', 'x == "Default"'], ['x and "Default"', 'x or "Default"', 'x + "Default"', 'x == "Default"'], 1, '`x or "Default"`.', '`x or "Default"`.'),
      q('q0209_4', 'Testlanadigan kodda `input()` qayerda turishi kerak?', 'Where should `input()` live in clean architecture?', ['Har funksiya ichida', 'Tashqi I/O qatlamida, hisobdan alohida', 'Faqat siklda', 'Izohda'], ['Inside every helper', 'At the I/O boundary separate from logic', 'Inside loops only', 'Comments'], 1, 'Hisobdan ajratilgan holda.', 'Separated at the I/O boundary.'),
      q('q0209_5', 'Foydalanuvchi `"salom"` kiritganda `int(input())` nima beradi?', 'What happens when `int(input())` receives `"salom"`?', ['0', 'ValueError', 'TypeError', 'None'], ['0', 'ValueError', 'TypeError', 'None'], 1, 'ValueError.', 'ValueError.'),
    ],
    homework: hw('Interaktiv BMI Kalkulyatori', 'Interactive BMI Calculator', 'Bo‘y (metr) va vazn (kg) ni olib BMI = kg / m^2 ni hisoblovchi hamda bo‘sh kiritmalarni tekshiruvchi dastur yozing.', 'Build a BMI calculator reading weight and height with `.strip()` and `float()` validation.', ['Funksiya ichida hisoblang', 'round(..., 1) bilan chiqaring'], ['Separate calculation function', 'Round to 1 decimal'], 'bmi = round(weight / (height ** 2), 1)', 'Use height ** 2.', 'io.StringIO bilan test qilib ko‘ring.', 'Verify with io.StringIO.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-02-10',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m4',
    order: 10,
    titleUz: 'Arithmetic Operators — arifmetik operatorlar',
    titleEn: 'Arithmetic Operators & Precedence',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-02-09'],
    conceptId: 'arithmetic_operators',
    whyUz: "To'lov hisob-kitoblari, chegirmalar, juft/toqlikni tekshirish (`%`), vaqtni soat/minutga bo'lish (`//`) va daraja (`**`) barcha dasturlarda ishlatiladi.",
    whyEn: 'Arithmetic powers pricing, pagination (`//`), even/odd parity (`%`), and geometric growth (`**`).',
    analogyUz: "`//` (butun bo'lish) — nechta to'liq quti to'lishini, `%` (modulo/qoldiq) — ortib qolgan donalar sonini aytadi.",
    analogyEn: '`//` counts full boxes packed; `%` reports the leftover items.',
    stopsUz: "Manfiy sonlarda Python ning `//` operatori nolga emas, pastga (manfiy cheksizlikka) qarab yaxlitlaydi (`-7 // 2 == -4`).",
    stopsEn: 'Python floor division rounds toward negative infinity (`-7 // 2 == -4`), not toward zero.',
    objUz: ['7 ta arifmetik operatorni (`+`, `-`, `*`, `/`, `//`, `%`, `**`) bilish', 'Amallar ustunligi (PEMDAS) ni qo‘llash', 'Qoldiq (`%`) bilan juft/toqlik va siklik aylanishni yechish'],
    objEn: ['Master all 7 arithmetic operators (`+`, `-`, `*`, `/`, `//`, `%`, `**`)', 'Apply operator precedence (PEMDAS) accurately', 'Use `%` and `//` for parity, time splitting, and pagination'],
    theoryUz: `### 1. 7 ta arifmetik operator
| Operator | Nomi | Misol | Natija |
|---|---|---|---|
| \`+\`, \`-\`, \`*\` | Asosiy amallar | \`7 * 3\` | \`21\` |
| \`/\` | Haqiqiy bo‘lish (float) | \`7 / 2\` | \`3.5\` |
| \`//\` | Butun bo‘lish (floor) | \`7 // 2\` | \`3\` |
| \`%\` | Qoldiq (modulo) | \`7 % 2\` | \`1\` |
| \`**\` | Daraja (exponent) | \`2 ** 5\` | \`32\` |
### 2. Juft/Toq va Bo‘linish
\`n % 2 == 0\` -> juft son; \`135 % 60\` -> soatdan ortgan daqiqalar (\`15\`).
### 3. Amallar tartibi (Precedence)
1) \`()\` Qavslar → 2) \`**\` Daraja → 3) \`*\`, \`/\`, \`//\`, \`%\` → 4) \`+\`, \`-\`.
### 4. \`divmod(a, b)\`
Bir vaqtda ham \`a // b\`, ham \`a % b\` ni tuple qilib qaytaradi!
### 5. Keng tarqalgan xato
\`^\` belgisini daraja deb o‘ylash (\`2 ^ 3\`) — Python da \`^\` bu Bitwise XOR; daraja uchun **\`**\`** ishlating!`,
    theoryEn: `### 1. The 7 Arithmetic Operators
\`+\`, \`-\`, \`*\`, \`/\` (float), \`//\` (floor), \`%\` (modulo), \`**\` (power).
### 2. Modulo Tricks
\`n % 2 == 0\` checks evenness; \`divmod(135, 60)\` splits minutes into \`(2, 15)\`.
### 3. Precedence (PEMDAS)
Parentheses > Exponentiation > Multiplication/Division > Addition/Subtraction.
### 4. Built-in \`divmod()\`
Returns \`(quotient, remainder)\` in one call.
### 5. Classic Mistake
\`^\` is bitwise XOR in Python, NOT exponentiation—use \`**\`.`,
    examples: [
      ex('Misol 1: Daqiqani soat va qoldiq daqiqaga ajratish', 'Example 1: Splitting Minutes with // and %', `total_minutes = 145\nhours = total_minutes // 60\nmins = total_minutes % 60\nprint(f"{hours} soat {mins} daqiqa")`, `2 soat 25 daqiqa`, '`//` to‘liq soatlarni, `%` qolgan daqiqalarni beradi.', '`//` extracts full hours while `%` extracts remaining minutes.'),
      ex('Misol 2: Operatorlar ustunligi', 'Example 2: Precedence with Parentheses', `print("Qavssiz:", 2 + 3 * 4 ** 2)\nprint("Qavsli:", (2 + 3) * 4)`, `Qavssiz: 50\nQavsli: 20`, 'Daraja (`**`) ko‘paytirishdan, ko‘paytirish esa qo‘shishdan oldin bajariladi.', '`**` runs before `*`, which runs before `+`.'),
      ex('Misol 3: `divmod()` bilan sahifalash', 'Example 3: Pagination via divmod()', `items = 53\nper_page = 10\nfull_pages, leftover = divmod(items, per_page)\nprint("Full:", full_pages, "Leftover:", leftover)`, `Full: 5 Leftover: 3`, '`divmod(53, 10)` bir zarbada `(5, 3)` qaytaradi.', '`divmod()` computes quotient and remainder together.'),
    ],
    traceTitleUz: 'PEMDAS hisoblash izi',
    traceTitleEn: 'Tracing Operator Precedence',
    traceCode: `res = 10 + 2 * 3 ** 2 - 4 // 2\nprint(res)`,
    traceSteps: [
      traceStep(1, '3 ** 2', '9', 'Avval daraja bajarildi', 'Exponentiation first'),
      traceStep(2, '2 * 9 and 4 // 2', '18 and 2', 'Ko‘paytirish va butun bo‘lish', 'Mult and floor div'),
      traceStep(3, '10 + 18 - 2', 'res=26', 'Chapdan o‘ngga qo‘shish/ayirish', 'Add/sub left-to-right'),
      traceStep(4, 'print(res)', '26', 'Natija', 'Output', '26'),
    ],
    commonMistakes: [
      mistake('Daraja o‘rniga `^` ishlatish', 'Using ^ Instead of ** for Power', `print(2 ^ 3)  # 8 chiqmaydi!`, 'Prints 1 (Bitwise XOR)', `print(2 ** 3)`, 'Python da daraja `**` bilan yoziladi.', 'Use `**` for exponentiation.', 'Daraja uchun doim `**` yozing.', 'Remember `2 ** 3 == 8`.'),
      mistake('0 ga bo‘lish', 'Division by Zero', `print(10 / 0)`, 'ZeroDivisionError', `denom = 0\nprint(10 / denom if denom != 0 else 0)`, 'Matematikada 0 ga bo‘lish mumkin emas.', 'Dividing by zero raises `ZeroDivisionError`.', 'Bo‘lishdan oldin `!= 0` ni tekshiring.', 'Guard denominators against zero.'),
    ],
    compareTitleUz: '`/` vs `//`',
    compareTitleEn: '`/` vs `//`',
    compareUz: ['`/`: har doim `float` (`8 / 2 == 4.0`).', '`//`: butun qism (`8 // 2 == 4`).'],
    compareEn: ['`/`: always float.', '`//`: floor quotient.'],
    compareSummaryUz: 'Indeks, soat/minut va sahifalashda `//`, foiz va o‘rtacha qiymatda `/` ishlating.',
    compareSummaryEn: 'Use `//` for discrete counts/pages and `/` for continuous ratios.',
    practiceTasks: [
      pt('p0210_1', '1-mashq: Daraja', 'Task 1: Power', '`2 ** 10` ni chiqaring.', 'Print 2 to the 10th power.', `print(2 ** 10)`, '1024', '** ishlating.', 'Use **.'),
      pt('p0210_2', '2-mashq: Qoldiq', 'Task 2: Modulo', '`29 % 5` ni chiqaring.', 'Print remainder of 29 / 5.', `print(29 % 5)`, '4', '%.', 'Use %.'),
      pt('p0210_3', '3-mashq: Butun bo‘lish', 'Task 3: Floor Div', '`29 // 5` ni chiqaring.', 'Print 29 // 5.', `print(29 // 5)`, '5', '//.', 'Use //.'),
      pt('p0210_4', '4-mashq: Oxirgi raqam', 'Task 4: Last Digit', '`478` ning oxirgi raqamini `% 10` bilan toping.', 'Extract last digit of 478.', `print(478 % 10)`, '8', '% 10.', 'Use % 10.'),
      pt('p0210_5', '5-mashq: divmod', 'Task 5: divmod', '`divmod(17, 5)` ni chiqaring.', 'Print `divmod(17, 5)`.', `print(divmod(17, 5))`, '(3, 2)', 'divmod().', 'Use divmod().'),
    ],
    quiz: [
      q('q0210_1', '`15 // 4` natijasi?', 'Result of `15 // 4`?', ['3.75', '3', '4', '3.0'], ['3.75', '3', '4', '3.0'], 1, 'Butun qism 3.', '3.'),
      q('q0210_2', 'Python da daraja operatori?', 'Exponentiation operator in Python?', ['^', '**', 'pow*', '^^'], ['^', '**', 'pow*', '^^'], 1, '`**`.', '`**`.'),
      q('q0210_3', '`2 + 3 * 4` natijasi?', 'Result of `2 + 3 * 4`?', ['20', '14', '24', '10'], ['20', '14', '24', '10'], 1, '3*4=12 + 2 = 14.', '14.'),
      q('q0210_4', 'Sonning juftligini qanday tekshiramiz?', 'How to test if `n` is even?', ['n / 2 == 0', 'n % 2 == 0', 'n // 2 == 0', 'n ** 2 == 0'], ['n / 2 == 0', 'n % 2 == 0', 'n // 2 == 0', 'n ** 2 == 0'], 1, '`n % 2 == 0`.', '`n % 2 == 0`.'),
      q('q0210_5', '`10 / 0` nima chiqaradi?', 'Error on `10 / 0`?', ['0', 'Infinity', 'ZeroDivisionError', 'ValueError'], ['0', 'Infinity', 'ZeroDivisionError', 'ValueError'], 2, 'ZeroDivisionError.', 'ZeroDivisionError.'),
    ],
    homework: hw('Soniya Konvertori', 'Seconds to H:M:S Converter', '3665 soniyani `//` va `%` yordamida soat, daqiqa va soniyaga ajratib chiqaring.', 'Convert 3665 seconds into hours, minutes, and seconds using `//` and `%`.', ['divmod yoki // va % ishlating', 'Natija 1:01:05 ko‘rinishida chiqsin'], ['Use // and % or divmod', 'Format as 1:01:05'], 'hours, rem = divmod(total, 3600)', 'Divide by 3600 first.', 'Kunlarni ham qo‘shing (86400s).', 'Add days conversion too.', 20),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-02-11',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m4',
    order: 11,
    titleUz: 'Comparison Operators — taqqoslash operatorlari',
    titleEn: 'Comparison Operators & Chained Comparisons',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-02-10'],
    conceptId: 'comparison_operators',
    whyUz: "Har qanday filtrlash, parol tekshiruvi, chegirma shartlari va qidiruv algoritmlari qiymatlarni taqqoslash (`==`, `!=`, `<`, `>`, `<=`, `>=`) ga asoslanadi.",
    whyEn: 'Filtering, authentication checks, threshold rules, and sorting rely on comparison operators returning `True` or `False`.',
    analogyUz: "Taqqoslash operatorlari — bu hakam: ikki qiymatni taroziga qo'yib, faqat `True` (mos) yoki `False` (mos emas) degan yakuniy hukm chiqaradi.",
    analogyEn: 'Comparison operators are referees weighing two values and returning strictly `True` or `False`.',
    stopsUz: "Python da `0 <= score <= 100` kabi zanjirli taqqoslash mumkin! Boshqa ko'pgina tillarda bu ishlamaydi.",
    stopsEn: 'Python uniquely supports mathematical chained comparisons like `0 <= score <= 100`.',
    objUz: ['6 ta taqqoslash operatorini (`==`, `!=`, `<`, `>`, `<=`, `>=`) qo‘llash', 'Zanjirli taqqoslash (`18 <= age <= 65`) yozish', '`==` (qiymat) va `is` (xotira obyekti) farqini ajratish'],
    objEn: ['Apply all 6 comparison operators', 'Write clean chained comparisons (`a < x < b`)', 'Distinguish value equality (`==`) from object identity (`is`)'],
    theoryUz: `### 1. 6 ta taqqoslash operatori
\`==\` (tengmi?), \`!=\` (teng emasmi?), \`>\`, \`<\`, \`>=\`, \`<=\`. Barchasi doim **\`bool\`** qaytaradi.
### 2. \`=\` vs \`==\`
\`x = 5\` — qiymat **berish** (assignment). \`x == 5\` — **tengligini tekshirish**.
### 3. Zanjirli taqqoslash (Chained Comparisons)
Python matematikadagi kabi yozishga ruxsat beradi: \`10 <= x <= 20\` (bu \`10 <= x and x <= 20\` ga teng).
### 4. Matnlarni taqqoslash
Stringlar alifbo (Unicode kodi) bo‘yicha taqqoslanadi: \`"apple" < "banana" -> True\`, lekin katta harflar kichiklardan oldin keladi (\`"Z" < "a"\`)!
### 5. \`==\` vs \`is\`
Qiymatlarni solishtirishda har doim \`==\` ishlating; \`is\` ni faqat \`None\` uchun (\`is None\`) saqlang!`,
    theoryEn: `### 1. Six Comparison Operators
\`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`—all return \`bool\`.
### 2. \`=\` vs \`==\`
Single \`=\` binds a variable; double \`==\` tests equality.
### 3. Chained Comparisons
\`0 <= score <= 100\` evaluates both bounds cleanly.
### 4. Lexicographical String Comparison
Compares Unicode code points (\`"a" < "b"\`, and uppercase precedes lowercase).
### 5. \`==\` vs \`is\`
Use \`==\` for value equality and \`is\` solely for \`None\` identity.`,
    examples: [
      ex('Misol 1: Zanjirli taqqoslash', 'Example 1: Chained Range Checks', `score = 88\nprint("Valid 0..100:", 0 <= score <= 100)\nprint("A grade (90..100):", 90 <= score <= 100)`, `Valid 0..100: True\nA grade (90..100): False`, 'Zanjirli taqqoslash kodni matematika kabi o‘qiladigan qiladi.', 'Chained comparisons express bounds cleanly.'),
      ex('Misol 2: Matn taqqoslash va normallashtirish', 'Example 2: Case-Insensitive String Equality', `a, b = "Python", "python"\nprint("Raw equal:", a == b)\nprint("Lower equal:", a.lower() == b.lower())`, `Raw equal: False\nLower equal: True`, 'Foydalanuvchi matnlarini taqqoslashda `.lower()` ishlating.', 'Normalize case with `.lower()` before string comparison.'),
      ex('Misol 3: `==` vs `is` farqi', 'Example 3: Equality vs Identity on Lists', `x = [1, 2]\ny = [1, 2]\nprint("Same value (==):", x == y)\nprint("Same object (is):", x is y)`, `Same value (==): True\nSame object (is): False`, 'Ikki alohida ro‘yxat qiymati bir xil (`==`), lekin xotirada boshqa obyektlar (`is`).', 'Two separate lists have equal values (`==`) but distinct identities (`is`).'),
    ],
    traceTitleUz: 'Zanjirli taqqoslash izi',
    traceTitleEn: 'Tracing Chained Comparison',
    traceCode: `temp = 22\ncomfort = 18 <= temp <= 26\nprint(comfort)`,
    traceSteps: [
      traceStep(1, 'temp = 22', 'temp=22', 'Harorat', 'Temperature bound'),
      traceStep(2, '18 <= temp', 'True', 'Chap qism Rost', 'Left check True'),
      traceStep(3, 'temp <= 26', 'True', 'O‘ng qism Rost', 'Right check True'),
      traceStep(4, 'print(comfort)', 'True', 'Yakuniy True', 'Output', 'True'),
    ],
    commonMistakes: [
      mistake('`==` o‘rniga `=` yozish', 'Assigning with = Inside Condition', `if age = 18:\n    print("18")`, 'SyntaxError: invalid syntax', `if age == 18:\n    print("18")`, 'Shart ichida tayinlash taqiqlanadi (`==` kerak).', 'Assignment `=` is invalid inside standard `if` conditions.', 'Tenglik tekshiruvida doim `==` yozing.', 'Use `==` for equality.'),
      mistake('Sonlar uchun `is` ishlatish', 'Using is Instead of == for Values', `x = 1000\ny = 999 + 1\nprint(x is y)`, 'Unreliable False!', `x = 1000\ny = 999 + 1\nprint(x == y)`, 'Python kichik sonlarni (-5..256) keshlaydi, katta sonlarda `is` False beradi!', 'Small-int caching makes `is` deceptive; large ints fail.', '`is` ni faqat `None` uchun ishlating.', 'Always use `==` for values.'),
    ],
    compareTitleUz: '`==` vs `is`',
    compareTitleEn: '`==` vs `is`',
    compareUz: ['`==`: qiymatlar tengmi?', '`is`: xotirada aynan bitta obyektmi? (`x is None`).'],
    compareEn: ['`==`: value equality.', '`is`: identical object reference (`x is None`).'],
    compareSummaryUz: 'Qiymatlar uchun `==`, `None` uchun `is None` ishlating.',
    compareSummaryEn: 'Use `==` for values and `is` strictly for `None`.',
    practiceTasks: [
      pt('p0211_1', '1-mashq: Zanjirli shart', 'Task 1: Chained Check', '`x = 15` uchun `10 <= x <= 20` ni chiqaring.', 'Check if x=15 is in [10, 20].', `x = 15\nprint(10 <= x <= 20)`, 'True', '10 <= x <= 20.', 'Use chained comparison.'),
      pt('p0211_2', '2-mashq: Teng emasmi', 'Task 2: Not Equal', '`10 != 20` ni chiqaring.', 'Check 10 != 20.', `print(10 != 20)`, 'True', '!=.', 'Use !=.'),
      pt('p0211_3', '3-mashq: Case-insensitive', 'Task 3: Case Compare', '`"Uz"` va `"uz"` ni kichik harfda solishtiring.', 'Compare case-insensitively.', `print("Uz".lower() == "uz".lower())`, 'True', '.lower().', 'Normalize with .lower().'),
      pt('p0211_4', '4-mashq: Tuple taqqoslash', 'Task 4: Tuple Compare', '`(3, 12) > (3, 10)` ni chiqaring.', 'Compare tuples.', `print((3, 12) > (3, 10))`, 'True', '> operatori.', 'Use >.'),
      pt('p0211_5', '5-mashq: Ro‘yxat == vs is', 'Task 5: List Equality', '`[1] == [1]` va `[1] is [1]` ni chiqaring.', 'Compare [1] == [1] and [1] is [1].', `a, b = [1], [1]\nprint(a == b, a is b)`, 'True False', '== vs is.', 'Print both.'),
    ],
    quiz: [
      q('q0211_1', 'Taqqoslash operatorlari qaysi turda natija beradi?', 'Return type of comparison operators?', ['int', 'bool', 'str', 'None'], ['int', 'bool', 'str', 'None'], 1, '`bool` (`True`/`False`).', '`bool`.'),
      q('q0211_2', '`5 <= 5` natijasi?', 'Result of `5 <= 5`?', ['True', 'False', 'Error', '5'], ['True', 'False', 'Error', '5'], 0, 'True.', 'True.'),
      q('q0211_3', 'Python da `1 < x < 10` mumkinmi?', 'Is `1 < x < 10` valid Python?', ['Ha, to‘liq ishlaydi', 'Yo‘q, SyntaxError', 'Faqat 10 dan katta sonlarda', 'Xato'], ['Yes, valid chained comparison', 'No, SyntaxError', 'Only > 10', 'Error'], 0, 'Ha, zanjirli taqqoslash.', 'Yes, valid.'),
      q('q0211_4', 'Qiymat tengligi uchun qaysi belgi?', 'Value equality operator?', ['=', '==', '===', 'is'], ['=', '==', '===', 'is'], 1, '`==`.', '`==`.'),
      q('q0211_5', '`a = [1]; b = [1]; a is b` natijasi?', 'Result of `a = [1]; b = [1]; a is b`?', ['True', 'False', 'Error', 'None'], ['True', 'False', 'Error', 'None'], 1, 'Ikki alohida list -> False.', 'False.'),
    ],
    homework: hw('Chegara va Reyting Tekshirgich', 'Bounds & Score Validator', 'Ball (0..100), chegirma limiti (>= 500_000) va VIP maqomini zanjirli taqqoslashlar bilan tekshiruvchi skript yozing.', 'Validate score bounds, discount threshold, and status equality cleanly.', ['Kamida 1 ta zanjirli taqqoslash (`<= <=`)', '== va != ishlatilsin'], ['Include chained comparison', 'Use == and !='], 'valid = 0 <= score <= 100', 'Chain bounds.', 'Har bir shart natijasini jadvalda chiqaring.', 'Print a boolean summary.', 15),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-02-12',
    courseId: 'python_fundamentals',
    moduleId: 'c02_m4',
    order: 12,
    titleUz: 'Assignment Operators — tayinlash operatorlari',
    titleEn: 'Assignment & Augmented Operators (+=, -=, *=)',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-02-11'],
    conceptId: 'assignment_operators',
    whyUz: "Hisoblagichlar (`count += 1`), yig'uvchilar (`total += price`), balans yangilash va Python 3.8+ dagi walrus (`:=`) operatorlari kodni ixcham va aniq qiladi.",
    whyEn: 'Augmented assignment (`+=`, `-=`, `*=`, `//=`) powers accumulators cleanly and concisely.',
    analogyUz: "`score = score + 10` deyish o'rniga `score += 10` deyish — bu 'hamyonimdagi pulga yana 10 qo'sh' degan qisqa buyruqdir.",
    analogyEn: '`score += 10` is shorthand for updating your running score without repeating its name.',
    stopsUz: "Python da C/JS dagi `i++` yoki `i--` operatori YO'Q (`SyntaxError`)! Har doim `i += 1` yozing.",
    stopsEn: 'Python intentionally omits `i++` and `i--`—always write `i += 1` or `i -= 1`.',
    objUz: ['`+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=` operatorlarini qo‘llash', 'Zanjirli tayinlash va unpacking ni qayta mustahkamlash', '`++` yo‘qligini va `+=` ning ro‘yxatlardagi xususiyatini bilish'],
    objEn: ['Apply augmented assignments (`+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=`)', 'Avoid the `i++` mistake from C/JS', 'Understand `+=` behavior on numbers vs mutable lists'],
    theoryUz: `### 1. Augmented Assignment operatorlari
| Qisqa shakl | To‘liq maʼnosi |
|---|---|
| \`x += 5\` | \`x = x + 5\` |
| \`x -= 3\` | \`x = x - 3\` |
| \`x *= 2\` | \`x = x * 2\` |
| \`x /= 4\` | \`x = x / 4\` |
| \`x //= 2\` | \`x = x // 2\` |
| \`x %= 10\` | \`x = x % 10\` |
| \`x **= 2\` | \`x = x ** 2\` |
### 2. \`++\` va \`--\` yo‘q!
Python da \`count++\` yozish **SyntaxError** beradi; \`count += 1\` yozing.
### 3. Walrus operatori (\`:=\`, Python 3.8+)
Ifoda ichida ham qiymat berish, ham tekshirish imkonini beradi: \`if (n := len(items)) > 3:\`.
### 4. Immutable vs Mutable da \`+=\`
Sonlarda \`x += 1\` yangi obyektga bog‘lanadi; \`list\` da esa mavjud ro‘yxatning o‘zini joyida kengaytiradi!
### 5. Kurs yakuni
Tabriklaymiz! Siz **Python Fundamentals** kursini to‘liq yakunladingiz va 3-kurs — **Control Flow** ga tayyorsiz!`,
    theoryEn: `### 1. Augmented Assignments
\`+=\`, \`-=\`, \`*=\`, \`/=\`, \`//=\`, \`%=\`, \`**=\` update variables concisely.
### 2. No \`++\` or \`--\`
Use \`count += 1\` instead of \`count++\`.
### 3. Walrus Operator (\`:=\`)
Assign and test within an expression: \`if (n := len(data)) > 2:\`.
### 4. Immutables vs Mutables
On ints/strs \`+=\` rebinds; on lists \`+=\` mutates in place like \`.extend()\`.
### 5. Course 2 Complete!
You are ready for Course 3: Conditionals & Loops.`,
    examples: [
      ex('Misol 1: Asosiy tayinlash operatorlari', 'Example 1: Progressive Augmented Updates', `points = 10\npoints += 5\npoints *= 2\npoints -= 4\npoints //= 2\nprint("Final points:", points)`, `Final points: 13`, '10 -> 15 -> 30 -> 26 -> 13 ketma-ket yangilanadi.', 'Step-by-step updates: 10 -> 15 -> 30 -> 26 -> 13.'),
      ex('Misol 2: Matn va Ro‘yxatda `+=`', 'Example 2: += on Strings & Lists', `log = "Start"\nlog += " -> End"\ntags = ["py"]\ntags += ["sql", "api"]\nprint(log)\nprint(tags)`, `Start -> End\n['py', 'sql', 'api']`, '`+=` matnga ulaydi, ro‘yxatga esa elementlarni joyida qo‘shadi.', '`+=` concatenates strings and extends lists in place.'),
      ex('Misol 3: Walrus operatori `:=`', 'Example 3: Walrus Operator in Condition', `items = [10, 20, 30, 40]\nif (count := len(items)) > 2:\n    print(f"{count} ta element yetarli")`, `4 ta element yetarli`, '`:=` uzunlikni bir marta hisoblab, ham tekshirdi, ham chop etdi.', '`:=` assigns `count` and tests it in one expression.'),
    ],
    traceTitleUz: 'Augmented updates izi',
    traceTitleEn: 'Tracing Augmented Assignments',
    traceCode: `wallet = 100\nwallet += 50\nwallet -= 30\nwallet *= 2\nprint(wallet)`,
    traceSteps: [
      traceStep(1, 'wallet = 100', 'wallet=100', 'Boshlang‘ich', 'Initial'),
      traceStep(2, 'wallet += 50', 'wallet=150', '50 qo‘shildi', 'Added 50'),
      traceStep(3, 'wallet -= 30', 'wallet=120', '30 ayrildi', 'Subtracted 30'),
      traceStep(4, 'wallet *= 2', 'wallet=240', '2 ga ko‘paydi', 'Doubled'),
      traceStep(5, 'print(wallet)', '240', 'Chiqish', 'Output', '240'),
    ],
    commonMistakes: [
      mistake('`i++` yozish (C/Java odati)', 'Writing i++ or i--', `i = 0\ni++`, 'SyntaxError: invalid syntax', `i = 0\ni += 1`, 'Python da `++` mavjud emas.', 'Python has no `++` operator.', 'Doim `i += 1` yozing.', 'Always use `i += 1`.'),
      mistake('`+=` o‘rniga `=+` yozish', 'Reversing += into =+', `x = 10\nx =+ 5  # x ni +5 ga tenglab qo'yadi!`, 'Silent bug: x becomes 5 instead of 15', `x = 10\nx += 5`, '`=+` bu "musbat 5 ni tayinla" degani!', '`=+ 5` assigns unary `+5` instead of adding!', 'Avval `+`, keyin `=` yozing (`+=`).', 'Always write `+=` with operator first.'),
    ],
    compareTitleUz: '`x = x + 1` vs `x += 1`',
    compareTitleEn: '`x = x + 1` vs `x += 1`',
    compareUz: ['`x += 1`: qisqa, Pythonic, ro‘yxatda joyida kengaytiradi.', '`x =+ 1`: XATO — x ni 1 ga tenglashtirib qo‘yadi!'],
    compareEn: ['`x += 1`: concise and Pythonic; mutates lists in place.', '`x =+ 1`: BUG — assigns positive 1!'],
    compareSummaryUz: 'Hisoblagich va akkumulyatorlarda doim `+=` / `-=` dan foydalaning.',
    compareSummaryEn: 'Use `+=` / `-=` cleanly for counters and accumulators.',
    practiceTasks: [
      pt('p0212_1', '1-mashq: += va *=', 'Task 1: Augment Ops', '`n = 4` ga 6 qo‘shib, 3 ga ko‘paytiring.', 'Add 6 to 4, then multiply by 3.', `n = 4\nn += 6\nn *= 3\nprint(n)`, '30', '+= keyin *=.', 'Use += then *=.'),
      pt('p0212_2', '2-mashq: **=', 'Task 2: Power Assign', '`x = 3; x **= 3` ni chiqaring.', 'Cube 3 via `**=`.', `x = 3\nx **= 3\nprint(x)`, '27', '**=.', 'Use **=.'),
      pt('p0212_3', '3-mashq: List +=', 'Task 3: Extend List', '`a = [1]; a += [2, 3]` ni chiqaring.', 'Extend `[1]` with `[2, 3]` via `+=`.', `a = [1]\na += [2, 3]\nprint(a)`, '[1, 2, 3]', 'a += [2, 3].', 'Use +=.'),
      pt('p0212_4', '4-mashq: %=', 'Task 4: Modulo Assign', '`m = 23; m %= 5` ni chiqaring.', 'Print 23 %= 5.', `m = 23\nm %= 5\nprint(m)`, '3', '%=.', 'Use %=.'),
      pt('p0212_5', '5-mashq: Walrus', 'Task 5: Walrus', '`if (l := len("Python")) == 6: print(l)` ni bajaring.', 'Use walrus `:=` to print length 6.', `if (l := len("Python")) == 6:\n    print(l)`, '6', ':= operatori.', 'Use :=.'),
    ],
    quiz: [
      q('q0212_1', '`x = 5; x += 3` dan keyin `x` nechaga teng?', 'Value of `x` after `x = 5; x += 3`?', ['3', '8', '53', 'Error'], ['3', '8', '53', 'Error'], 1, '8.', '8.'),
      q('q0212_2', 'Python da `i++` ishlaydimi?', 'Does `i++` work in Python?', ['Ha', 'Yo‘q, SyntaxError', 'Faqat siklda', 'Faqat int da'], ['Yes', 'No, SyntaxError', 'Loops only', 'Ints only'], 1, 'SyntaxError.', 'SyntaxError.'),
      q('q0212_3', '`x = 10; x =+ 4` dan keyin `x` nechaga teng?', 'Value of `x` after `x = 10; x =+ 4`?', ['14', '4', '10', 'Error'], ['14', '4', '10', 'Error'], 1, '4 (=+ musbat 4 tayinlaydi).', '4.'),
      q('q0212_4', '`:=` operatori nima deb ataladi?', 'What is `:=` called?', ['Lambda', 'Walrus (Assignment Expression)', 'Decorator', 'Slice'], ['Lambda', 'Walrus (Assignment Expression)', 'Decorator', 'Slice'], 1, 'Walrus operatori.', 'Walrus operator.'),
      q('q0212_5', '`a = [1]; a += [2]` dan keyin `a`?', 'Value of `a` after `a = [1]; a += [2]`?', ['[1, 2]', '[3]', 'Error', '[2]'], ['[1, 2]', '[3]', 'Error', '[2]'], 0, '[1, 2].', '[1, 2].'),
    ],
    homework: hw('Bank Hisob Simulyatori', 'Bank Balance Simulator', 'Boshlang‘ich balans (`1000.0`) ustida `+`, `-`, `*=` (foiz), va `//=` amallarini augmented operatorlar bilan ketma-ket bajarib hisobot chiqaring.', 'Simulate deposits, withdrawals, interest (`*=`), and integer splits (`//=`) on an initial balance.', ['Kamida 4 xil augmented operator ishlating', 'Har qadamdan keyin balansni chiqaring'], ['Use 4 augmented operators', 'Print balance per step'], 'balance *= 1.05', 'Multiply for interest.', 'Yakunda necha % o‘sganini chiqaring.', 'Print net growth %.', 20),
    reviewCheckpoint: review(
      4,
      '4-Review Loyiha: 2-Kurs Yakuniy CLI Kalkulyator & Hisob-kitob Tizimi',
      'Review Project #4: Course 2 Capstone Calculator & Account Engine',
      '16–20 darslar (`Strings`, `Booleans`, `Casting`, `input()`, `Arithmetic/Comparison/Assignment`) bilimlarini bitta yaxlit CLI hisoblagichda birlashtiring.',
      'Combine Course 2 fundamentals (casting, input parsing, math, comparisons, augmented updates) into one cohesive program.',
      ['1) Matn kiritmani tozalash va turga o‘tkazish', '2) `//`, `%`, `**` va zanjirli taqqoslash', '3) Augmented operatorlar bilan balans yangilash'],
      ['1) Input parsing & type casting', '2) Arithmetic & chained comparisons', '3) Augmented balance updates'],
      `raw_deposit = " 250000 "
balance = 100_000
deposit = int(raw_deposit.strip())
if 1_000 <= deposit <= 10_000_000:
    balance += deposit
    bonus = balance * 5 // 100
    balance += bonus
print("Yakuniy balans:", balance)`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),
];
