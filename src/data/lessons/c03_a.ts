import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C03_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-03-01',
    courseId: 'control_flow',
    moduleId: 'c03_m1',
    order: 1,
    titleUz: 'Boolean Logic — mantiqiy asoslar',
    titleEn: 'Boolean Logic & Truth Tables',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-02-12'],
    conceptId: 'boolean_logic',
    whyUz: "Shart operatorlari (`if`), qidiruv filtrlari va ruxsat tizimlari (auth) Georg Bul yaratgan ikkilik mantiq qonunlariga tayanadi.",
    whyEn: 'Conditionals, database filters, and authorization guards rely directly on Boolean algebra.',
    analogyUz: "Mantiqiy darvozalar (AND, OR, NOT) xuddi eshik qulflari kabi: AND da ikkala kalit ham burilishi shart, OR da bittasi yetarli, NOT esa holatni teskarisiga ag'daradi.",
    analogyEn: 'AND requires both keys to unlock; OR needs either key; NOT flips locked to unlocked.',
    stopsUz: "Kundalik nutqda 'yoki' ba'zan 'faqat bittasi' ma'nosida keladi; dasturlashda `or` ikkalasi rost bo'lganda ham `True` beradi!",
    stopsEn: 'In English "or" can mean exclusive choice; Python `or` is inclusive (True when both operands are True).',
    objUz: ['AND, OR, NOT haqiqat jadvallarini (Truth Tables) yoddan bilish', 'Operator ustunligini (`not` > `and` > `or`) qo‘llash', 'De Morgan qonunlari bilan murakkab shartlarni soddalashtirish'],
    objEn: ['Evaluate AND, OR, NOT truth tables', 'Apply precedence (`not` > `and` > `or`)', 'Simplify negated conditions using De Morgan laws'],
    theoryUz: `### 1. Uchta asosiy mantiqiy amal
- **\`and\`**: faqat **ikkalasi ham** \`True\` bo‘lsa \`True\`.
- **\`or\`**: **kamida bittasi** \`True\` bo‘lsa \`True\`.
- **\`not\`**: qiymatni teskarisiga aylantiradi (\`not True == False\`).
### 2. Haqiqat jadvali (Truth Table)
| A | B | A and B | A or B | not A |
|---|---|---|---|---|
| True | True | True | True | False |
| True | False | False | True | False |
| False | True | False | True | True |
| False | False | False | False | True |
### 3. Mantiqiy ustunlik
**\`not\`** eng birinchi, keyin **\`and\`**, oxirida **\`or\`** bajariladi. Shubha bo‘lsa qavs \`()\` qo‘ying!
### 4. Short-Circuit Evaluation
\`False and expensive_fn()\` da Python ikkinchi qismni hisoblamaydi ham! \`True or ...\` da ham shunday.
### 5. De Morgan qoidasi
\`not (a or b)\` == \`(not a) and (not b)\`.`,
    theoryEn: `### 1. Core Boolean Gates
\`and\` (both True), \`or\` (at least one True), \`not\` (negates).
### 2. Precedence Order
\`not\` binds tightest, then \`and\`, then \`or\`. Use parentheses whenever combining \`and\` + \`or\`.
### 3. Short-Circuit Evaluation
\`False and ...\` stops immediately; \`True or ...\` stops immediately.
### 4. De Morgan Equivalence
\`not (a and b)\` == \`(not a) or (not b)\`.`,
    examples: [
      ex('Misol 1: Haqiqat jadvalini kodda ko‘rish', 'Example 1: Generating Truth Table', `for a in [True, False]:\n    for b in [True, False]:\n        print(f"A={str(a):5} B={str(b):5} | and={str(a and b):5} or={a or b}")`, `A=True  B=True  | and=True  or=True\nA=True  B=False | and=False or=True\nA=False B=True  | and=False or=True\nA=False B=False | and=False or=False`, 'Barcha 4 kombinatsiyaning natijasini ko‘ramiz.', 'Displays all 4 Boolean combinations.'),
      ex('Misol 2: Operator ustunligi (`and` vs `or`)', 'Example 2: Precedence of and over or', `print("No parens:", True or False and False)\nprint("With parens:", (True or False) and False)`, `No parens: True\nWith parens: False`, '`and` birinchi bajarilgani uchun qavssiz holat `True or False` -> `True` bo‘ladi.', '`and` binds tighter than `or`, changing outcome without parentheses.'),
      ex('Misol 3: Short-circuit himoyasi', 'Example 3: Short-Circuit Guard', `items = []\nsafe = len(items) > 0 and items[0] == "py"\nprint("Safe check:", safe)`, `Safe check: False`, '`len(items) > 0` False bo‘lgani uchun `items[0]` bajarilmaydi va `IndexError` chiqmaydi!', 'Short-circuiting skips `items[0]` when list is empty.'),
    ],
    traceTitleUz: 'Mantiqiy ifoda izi',
    traceTitleEn: 'Tracing Boolean Evaluation',
    traceCode: `is_admin = False\nis_active = True\nhas_key = True\nallow = is_admin or (is_active and has_key)\nprint(allow)`,
    traceSteps: [
      traceStep(1, 'is_active and has_key', 'True', 'Qavs ichidagi AND Rost', 'Inner AND True'),
      traceStep(2, 'is_admin or True', 'allow=True', 'False or True -> True', 'OR yields True'),
      traceStep(3, 'print(allow)', 'True', 'Natija', 'Output', 'True'),
    ],
    commonMistakes: [
      mistake('`and` + `or` da qavslarni unutish', 'Omitting Parentheses Mixing and/or', `role = "guest"\nis_verified = False\nif role == "admin" or role == "mod" and is_verified:\n    print("Ruxsat")`, 'Buggy logic when admin is unverified', `if (role == "admin" or role == "mod") and is_verified:\n    print("Ruxsat")`, '`and` doim `or` dan oldin bajariladi.', '`and` binds tighter than `or`.', '`and` va `or` aralashsa doim qavs `()` qo‘ying.', 'Always group mixed `and`/`or` with parentheses.'),
      mistake('`x == 1 or 2` deb yozish', 'Writing x == 1 or 2', `x = 5\nif x == 1 or 2:\n    print("Xato!")`, 'Always True because bool(2) is True!', `x = 5\nif x == 1 or x == 2:\n    print("Mos")\n# yoki: if x in (1, 2):`, '`x == 1 or 2` bu `(x == 1) or bool(2)` degani — har doim True!', '`2` alone evaluates truthy!', 'Har tomonni to‘liq taqqoslang yoki `in` ishlating.', 'Write `x in (1, 2)` cleanly.'),
    ],
    compareTitleUz: '`or` zanjiri vs `in (...)`',
    compareTitleEn: 'Chained `or` vs Membership `in`',
    compareUz: ['`x == "a" or x == "b"`: uzun va xato qilish oson.', '`x in ("a", "b")`: qisqa, tushunarli va xatosiz.'],
    compareEn: ['`x == "a" or x == "b"`: verbose.', '`x in ("a", "b")`: clean, idiomatic Python.'],
    compareSummaryUz: 'Bir nechta qiymatni tekshirishda `in` operatoridan foydalaning.',
    compareSummaryEn: 'Use `in (...)` instead of chaining repetitive `or` checks.',
    practiceTasks: [
      pt('p0301_1', '1-mashq: AND sharti', 'Task 1: AND Check', '`True and False` natijasini chiqaring.', 'Print `True and False`.', `print(True and False)`, 'False', 'and.', 'Use and.'),
      pt('p0301_2', '2-mashq: Ustunlik', 'Task 2: Precedence', '`(True or False) and False` ni chiqaring.', 'Print `(True or False) and False`.', `print((True or False) and False)`, 'False', 'Qavs.', 'Parentheses first.'),
      pt('p0301_3', '3-mashq: Short-circuit', 'Task 3: Guarded Access', 'Bo‘sh `nums=[]` da `bool(nums) and nums[0] > 0` ni chiqaring.', 'Check guarded boolean expression on empty list.', `nums = []\nprint(bool(nums) and nums[0] > 0)`, 'False', 'bool(nums) birinchi.', 'Guard with bool(nums).'),
      pt('p0301_4', '4-mashq: in operatori', 'Task 4: Membership Test', '`role = "editor"` da `role in ("admin", "editor")` ni chiqaring.', 'Check if role is in allowed tuple.', `role = "editor"\nprint(role in ("admin", "editor"))`, 'True', 'in.', 'Use in.'),
      pt('p0301_5', '5-mashq: De Morgan', 'Task 5: De Morgan', '`not (False or False)` ni chiqaring.', 'Print `not (False or False)`.', `print(not (False or False))`, 'True', 'not False -> True.', 'Evaluate inside parens first.'),
    ],
    quiz: [
      q('q0301_1', 'Qaysi mantiqiy operator eng yuqori ustunlikka ega?', 'Highest precedence among Boolean ops?', ['or', 'and', 'not', 'Teng'], ['or', 'and', 'not', 'Equal'], 2, '`not` > `and` > `or`.', '`not` binds tightest.'),
      q('q0301_2', '`x = 5; x == 1 or 2` nimani qaytaradi?', 'What does `x = 5; x == 1 or 2` evaluate to?', ['False', 'True', '2', 'Error'], ['False', 'True', '2', 'Error'], 2, 'Short-circuit `or` Truthy `2` ni qaytaradi.', 'Returns `2` (truthy!).'),
      q('q0301_3', '`False and ...` da Python o‘ng tomonni hisoblaydimi?', 'Does Python evaluate RHS of `False and RHS`?', ['Ha', 'Yo‘q (Short-circuit)', 'Faqat sonlarda', 'Baʼzan'], ['Yes', 'No (Short-circuit)', 'Numbers only', 'Sometimes'], 1, 'Yo‘q, short-circuit.', 'No, short-circuits.'),
      q('q0301_4', '`not (A and B)` nimaga teng?', 'What equals `not (A and B)`?', ['not A and not B', '(not A) or (not B)', 'A or B', 'A and B'], ['not A and not B', '(not A) or (not B)', 'A or B', 'A and B'], 1, 'De Morgan qonuni.', 'De Morgan law.'),
      q('q0301_5', '`x == 10 or x == 20` ning qisqa shakli?', 'Idiomatic shorthand for `x == 10 or x == 20`?', ['x == (10 or 20)', 'x in (10, 20)', 'x is 10, 20', 'x = 10 | 20'], ['x == (10 or 20)', 'x in (10, 20)', 'x is 10, 20', 'x = 10 | 20'], 1, '`x in (10, 20)`.', '`x in (10, 20)`.'),
    ],
    homework: hw('Kirish Ruxsat Matrixi', 'Access Permission Evaluator', '`is_authenticated`, `is_banned`, `role` o‘zgaruvchilari uchun ruxsat berish mantiqiy formulasini yozing va 4 xil holatda test qiling.', 'Evaluate `is_authenticated and not is_banned and role in ("admin", "staff")` across 4 test cases.', ['Kamida 1 ta De Morgan yoki qavsli shart', '4 holatni print qiling'], ['Use parentheses and `in`', 'Print 4 scenarios'], 'allow = auth and (not banned) and (role in ("admin", "staff"))', 'Combine guards clearly.', 'To‘liq jadval chiqaring.', 'Format as a truth table.', 15),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-03-02',
    courseId: 'control_flow',
    moduleId: 'c03_m1',
    order: 2,
    titleUz: 'if operatori — shartli tarmoqlanish',
    titleEn: 'The if Statement & Code Blocks',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-03-01'],
    conceptId: 'if_statement',
    whyUz: "Dasturlar aqlli bo'lishi uchun shartga qarab yo'nalish tanlashi kerak: parol to'g'rimi, balans yetarlimi, xato bormi — barchasi `if` bilan boshlanadi.",
    whyEn: 'Programs adapt to inputs by branching via `if` statements and indented code blocks.',
    analogyUz: "`if` — bu temir yo'ldagi strelka: chiroq yashil (`True`) bo'lsa qo'shimcha yo'lga buriladi, aks holda to'g'ri davom etadi.",
    analogyEn: 'An `if` statement is a railway switch: if the condition is `True`, execution enters the indented track; otherwise it skips straight past.',
    stopsUz: "Python da jingalak qavslar `{}` emas, ikki nuqta `:` va **4 ta probel (indentation)** blok chegarasini belgilaydi!",
    stopsEn: 'Python uses colons `:` and 4-space indentation—never curly braces `{}`—to delimit blocks.',
    objUz: ['`if <shart>:` sintaksisi va 4-probel chekinish qoidasini bilish', 'Blok ichidagi va blokdan tashqaridagi kodni farqlash', 'Bir necha mustaqil `if` lar ketma-ketligini tushunish'],
    objEn: ['Write valid `if <cond>:` statements with 4-space indentation', 'Distinguish statements inside vs outside the `if` block', 'Trace consecutive independent `if` statements'],
    theoryUz: `### 1. \`if\` sintaksisi
\`\`\`python
if age >= 18:
    print("Ruxsat berildi")
print("Doim bajariladi")
\`\`\`
Ikki nuqta \`:\` shart tugaganini, 4 ta probel esa blok boshlanganini bildiradi.
### 2. IndentationError nima?
Python da blok ichidagi barcha qatorlar bir xil masofada surilgan bo‘lishi shart.
### 3. Ketma-ket \`if\` lar
Agar ikkita mustaqil \`if\` yozsangiz, shartlari rost bo‘lsa **ikkalasi ham** bajariladi!
### 4. Truthy qisqartma
\`if username:\` — bo‘sh bo‘lmagan matnda ishlaydi.
### 5. Keng tarqalgan xato
\`:\` belgisini unutish (\`SyntaxError\`) yoki blok ichiga birorta ham qator yozmaslik.`,
    theoryEn: `### 1. Syntax of \`if\`
\`if condition:\` followed by an indented 4-space suite.
### 2. Indentation Is Semantic
Misaligned spaces raise \`IndentationError\`.
### 3. Sequential Independent \`if\`s
Multiple \`if\` blocks evaluate independently—more than one can trigger.
### 4. Idiomatic Truthy Guard
\`if items:\` avoids verbose \`if len(items) > 0:\`.
### 5. Common Mistakes
Omitting the trailing \`:\` or forgetting indentation.`,
    examples: [
      ex('Misol 1: Oddiy `if` va blok chegarasi', 'Example 1: if Block vs Post-Block Execution', `temp = 35\nif temp > 30:\n    print("Issiq ob-havo!")\n    print("Suv iching.")\nprint("Tekshiruv tugadi.")`, `Issiq ob-havo!\nSuv iching.\nTekshiruv tugadi.`, 'Oxirgi qator chekinishsiz bo‘lgani uchun har qanday haroratda ishlaydi.', 'Unindented final line runs regardless of condition.'),
      ex('Misol 2: Ketma-ket mustaqil `if` tekshiruvlari', 'Example 2: Independent Validation Checks', `errors = 0\npassword = "123"\nif len(password) < 8:\n    print("Kamida 8 belgi kerak")\n    errors += 1\nif password.isdigit():\n    print("Harf ham qo'shing")\n    errors += 1\nprint("Jami xato:", errors)`, `Kamida 8 belgi kerak\nHarf ham qo'shing\nJami xato: 2`, 'Parol ikkala shartni ham buzgani uchun ikkala `if` ham ishladi.', 'Both independent checks trigger and accumulate errors.'),
      ex('Misol 3: Guard clause bilan tekshirish', 'Example 3: Truthy Check', `cart = ["Kitob", "Qalam"]\nif cart:\n    print("Savatda mahsulot soni:", len(cart))`, `Savatda mahsulot soni: 2`, 'Bo‘sh bo‘lmagan ro‘yxat `True` bo‘lgani uchun ichkariga kiradi.', 'Non-empty list satisfies `if cart:`.'),
    ],
    traceTitleUz: 'if blokining bajarilish izi',
    traceTitleEn: 'Tracing if Block Execution',
    traceCode: `total = 150\nif total >= 100:\n    total -= 15\nprint(total)`,
    traceSteps: [
      traceStep(1, 'total = 150', 'total=150', 'Summa berildi', 'Initial total'),
      traceStep(2, 'if total >= 100:', 'True', '150 >= 100 Rost', 'Condition True'),
      traceStep(3, 'total -= 15', 'total=135', 'Chegirma ayirildi', 'Discount applied'),
      traceStep(4, 'print(total)', '135', 'Chiqish', 'Output', '135'),
    ],
    commonMistakes: [
      mistake('`:` belgisini unutish', 'Forgetting the Colon After Condition', `if x > 5\n    print("Katta")`, 'SyntaxError: expected ":"', `if x > 5:\n    print("Katta")`, 'Har bir `if` satri oxirida `:` bo‘lishi shart.', 'Every compound header requires `:`.', '`:` yozishni odat qiling.', 'Always close headers with `:`.'),
      mistake('Chekinishni (Indent) unutish', 'Missing Indentation Inside if', `if True:\nprint("Salom")`, 'IndentationError: expected an indented block', `if True:\n    print("Salom")`, '`:` dan keyin keyingi qator 4 probel ichkarida bo‘lishi shart.', 'Lines inside `if` must be indented 4 spaces.', 'Editor Tab tugmasi 4 probel qo‘yishini tekshiring.', 'Indent body 4 spaces.'),
    ],
    compareTitleUz: 'Mustaqil `if` lar vs `elif`',
    compareTitleEn: 'Multiple `if` vs `elif`',
    compareUz: ['Bir nechta mustaqil `if`: bir vaqtda bir nechta shart bajarilishi mumkin (masalan, forma xatolari).', '`if/elif`: faqat BITTA yo‘nalish tanlanishi kerak bo‘lganda.'],
    compareEn: ['Multiple `if`s: multiple conditions can independently fire.', '`if/elif`: mutually exclusive branches.'],
    compareSummaryUz: 'Barcha xatolarni yig‘ishda ketma-ket `if`, faqat birini tanlashda `elif` ishlating.',
    compareSummaryEn: 'Use consecutive `if`s to check all rules, and `elif` for mutually exclusive choices.',
    practiceTasks: [
      pt('p0302_1', '1-mashq: Musbat son', 'Task 1: Positive Check', '`n = 8` musbat bo‘lsa `"Musbat"` chiqaring.', 'Print `"Musbat"` if `n > 0`.', `n = 8\nif n > 0:\n    print("Musbat")`, 'Musbat', 'if n > 0:.', 'Use if n > 0:.'),
      pt('p0302_2', '2-mashq: Chegirma', 'Task 2: Apply Discount', '`price = 200` >= 100 bo‘lsa 20 ayirib chiqaring.', 'Subtract 20 if price >= 100.', `price = 200\nif price >= 100:\n    price -= 20\nprint(price)`, '180', 'price -= 20.', 'Indent price -= 20.'),
      pt('p0302_3', '3-mashq: Truthy matn', 'Task 3: Non-empty Check', '`msg = "OK"` bo‘sh bo‘lmasa chop eting.', 'Print msg if non-empty.', `msg = "OK"\nif msg:\n    print(msg)`, 'OK', 'if msg:.', 'Use if msg:.'),
      pt('p0302_4', '4-mashq: Ikkita mustaqil if', 'Task 4: Independent Ifs', '`n = 6` uchun juft va > 5 ekanini alohida `if` larda chiqaring.', 'Check even and > 5 independently.', `n = 6\nif n % 2 == 0:\n    print("Juft")\nif n > 5:\n    print(">5")`, 'Juft\n>5', '2 ta if.', 'Two if blocks.'),
      pt('p0302_5', '5-mashq: Blokdan tashqari', 'Task 5: Outside Block', '`if False:` dan keyin tashqarida `"Done"` chiqaring.', 'Print Done outside false if.', `if False:\n    print("Skip")\nprint("Done")`, 'Done', 'Chekinishsiz yozing.', 'No indent on Done.'),
    ],
    quiz: [
      q('q0302_1', '`if` sharti oxirida qaysi belgi shart?', 'Required symbol at end of `if` header?', [';', ':', '{', '->'], [';', ':', '{', '->'], 1, '`:`.', '`:`.'),
      q('q0302_2', 'Blok ichiga qator surilmasa qaysi xato chiqadi?', 'Error when `if` body is unindented?', ['ValueError', 'IndentationError', 'NameError', 'TypeError'], ['ValueError', 'IndentationError', 'NameError', 'TypeError'], 1, 'IndentationError.', 'IndentationError.'),
      q('q0302_3', 'Ikkita ketma-ket `if` yozilsa nima bo‘ladi?', 'What happens with two consecutive `if` blocks?', ['Faqat birinchisi ishlaydi', 'Sharti rost bo‘lgan har ikkalasi ham ishlaydi', 'SyntaxError', 'Ikkinchisi o‘chadi'], ['Only first runs', 'Both execute if both conditions are True', 'SyntaxError', 'Second ignored'], 1, 'Ikkalasi mustaqil tekshiriladi.', 'Both are evaluated independently.'),
      q('q0302_4', '`if []: print("A"); print("B")` nima chiqaradi?', 'Output of `if []: print("A")` then unindented `print("B")`?', ['A va B', 'Faqat B', 'Hech narsa', 'Error'], ['A and B', 'Only B', 'Nothing', 'Error'], 1, '`[]` Falsy, shuning uchun faqat B chiqadi.', 'Only B prints.'),
      q('q0302_5', 'Python bloklarni nima bilan ajratadi?', 'How does Python delimit blocks?', ['{ }', 'begin/end', '4 probel chekinish (Indentation)', '( )'], ['{ }', 'begin/end', 'Indentation', '( )'], 2, 'Indentation.', 'Indentation.'),
    ],
    homework: hw('Parol Kuchi Tekshirgichi', 'Password Strength Checker', 'Kamida 4 ta mustaqil `if` tekshiruvi bilan (`len >= 8`, raqam borligi, katta harf borligi, bo‘sh joy yo‘qligi) parol ballini 0..4 gacha hisoblang.', 'Score password strength 0–4 using 4 independent `if` rules.', ['4 ta mustaqil if sharti', 'Umumiy ballni chiqaring'], ['4 independent if rules', 'Print final score'], 'any(c.isdigit() for c in pwd)', 'Check character categories.', 'Qaysi talab yetishmaganini chiqaring.', 'Report missing criteria.', 20),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-03-03',
    courseId: 'control_flow',
    moduleId: 'c03_m2',
    order: 3,
    titleUz: 'elif va else — ko‘p yo‘nalishli tarmoqlanish',
    titleEn: 'elif, else & Conditional Expressions (Ternary)',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-03-02'],
    conceptId: 'elif_else',
    whyUz: "Baho qo'yish (A/B/C/F), tarif rejalari yoki HTTP statuslarni ajratishda bir nechta o'zaro istisno qiluvchi holatlardan faqat BITTA sini tanlash kerak bo'ladi.",
    whyEn: 'Grading tiers, pricing brackets, and mutually exclusive paths require `if/elif/else` chains and clean ternary expressions.',
    analogyUz: "`if / elif / else` — bu lift tugmalari yoki pochta ajratuvchi konveyer: birinchi mos teshikka tushishi bilan qolgan teshiklar tekshirilmaydi.",
    analogyEn: '`if/elif/else` is a coin sorter: once a coin drops into the first matching slot, lower checks never run.',
    stopsUz: "`elif` zanjirida tartib juda muhim! Agar eng kichik shartni (`>= 50`) tepaga qo'ysangiz, `95` ham o'sha birinchisiga tushib qoladi!",
    stopsEn: 'Order matters in `if/elif`: putting `score >= 60` before `score >= 90` traps a 95 inside the lower tier.',
    objUz: ['`if / elif / else` zanjirini to‘g‘ri tartibda tuzish', 'Ternary ifoda (`a if cond else b`) ni o‘rinli qo‘llash', 'Birinchi mos kelgan tarmoqdan keyin qolganlari tekshirilmasligini bilish'],
    objEn: ['Order mutually exclusive `if/elif/else` branches properly', 'Write readable conditional expressions (`x if cond else y`)', 'Understand short-circuit skipping across `elif` chains'],
    theoryUz: `### 1. \`else\` tarmog‘i
\`if\` yolg‘on bo‘lganda muqobil yo‘lni bajaradi.
### 2. \`elif\` ("else if" qisqartmasi)
Istalgancha shartni ketma-ket tekshiradi va **birinchi rost** tarmoq bajarilishi bilan zanjirdan chiqadi.
### 3. Tartib qoidasi (Kattadan kichikka!)
\`\`\`python
if score >= 90: grade = "A"
elif score >= 80: grade = "B"
elif score >= 70: grade = "C"
else: grade = "F"
\`\`\`
### 4. Ternary (Bir qatorli shart ifodasi)
\`status = "Katta" if age >= 18 else "Kichik"\` — oddiy qiymat tanlash uchun juda qulay.
### 5. Keng tarqalgan xato
\`elif\` o‘rniga bir nechta \`if\` ishlatish — bunda \`95\` ballga ham A, ham B, ham C chiqib ketadi!`,
    theoryEn: `### 1. The \`else\` Fallback
Executes only when preceding conditions are False.
### 2. \`elif\` Chains
Evaluates top-to-bottom; executes at most ONE branch.
### 3. Order Thresholds Correctly
Check strictest bounds first (\`>= 90\` before \`>= 80\`).
### 4. Ternary Expression
\`label = "Pass" if score >= 60 else "Fail"\` for concise value selection.
### 5. Classic Bug
Using multiple \`if\`s instead of \`elif\` triggers multiple grade tiers simultaneously.`,
    examples: [
      ex('Misol 1: Baho tizimi (if / elif / else)', 'Example 1: Grading Tier Chain', `score = 84\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"\nprint("Baho:", grade)`, `Baho: B`, '`84 >= 90` yolg‘on, `84 >= 80` rost -> `"B"` tanlanadi va qolgan shartlar o‘tkazib yuboriladi.', '84 matches `>= 80` and skips `>= 70` and `else`.'),
      ex('Misol 2: Ternary expression', 'Example 2: Conditional Ternary Expression', `age = 20\nticket = 50000 if age >= 18 else 25000\nprint("Chipta:", ticket)`, `Chipta: 50000`, 'Oddiy ikki variantli qiymat tanlashni 1 qatorda chiroyli yozish mumkin.', 'Clean single-line value assignment.'),
      ex('Misol 3: Yuk vazni bo‘yicha tarif', 'Example 3: Shipping Rate Tiers', `kg = 6\nif kg <= 1:\n    fee = 10000\nelif kg <= 5:\n    fee = 25000\nelif kg <= 10:\n    fee = 40000\nelse:\n    fee = 60000\nprint("Yetkazish:", fee)`, `Yetkazish: 40000`, 'O‘suvchi chegaralarda esa kichikdan kattaga (`<= 1`, `<= 5`, `<= 10`) tartiblanadi.', 'Ascending `<=` bounds match the tightest tier first.'),
    ],
    traceTitleUz: 'elif zanjiri izi',
    traceTitleEn: 'Tracing an elif Chain',
    traceCode: `n = 0\nif n > 0:\n    kind = "Musbat"\nelif n < 0:\n    kind = "Manfiy"\nelse:\n    kind = "Nol"\nprint(kind)`,
    traceSteps: [
      traceStep(1, 'if n > 0:', 'False', '0 > 0 yolg‘on', '0 > 0 False'),
      traceStep(2, 'elif n < 0:', 'False', '0 < 0 yolg‘on', '0 < 0 False'),
      traceStep(3, 'else:', 'kind="Nol"', 'Oxirgi tarmoq bajarildi', 'Else fallback ran'),
      traceStep(4, 'print(kind)', 'Nol', 'Chiqish', 'Output', 'Nol'),
    ],
    commonMistakes: [
      mistake('`elif` shartlarini teskari tartibda yozish', 'Inverted Threshold Order in elif', `score = 95\nif score >= 60:\n    g = "D"\nelif score >= 90:\n    g = "A"\nprint(g)`, 'Prints "D" for 95!', `score = 95\nif score >= 90:\n    g = "A"\nelif score >= 60:\n    g = "D"\nprint(g)`, '95 >= 60 birinchi tekshirilgani uchun A ga yetib bormaydi.', '95 satisfies `>= 60` first and never reaches `>= 90`.', '`>=` da kattadan kichikka, `<=` da kichikdan kattaga yozing.', 'Sort `>=` descending and `<=` ascending.'),
      mistake('`else if` deb yozish (Java/JS odati)', 'Writing else if Instead of elif', `if x > 0:\n    pass\nelse if x < 0:\n    pass`, 'SyntaxError', `if x > 0:\n    pass\nelif x < 0:\n    pass`, 'Python kalit so‘zi — `elif`.', 'Python keyword is `elif`, not `else if`.', 'Har doim `elif` yozing.', 'Use `elif`.'),
    ],
    compareTitleUz: '`if / elif / else` vs Ternary',
    compareTitleEn: '`if / elif / else` vs Ternary',
    compareUz: ['Ternary (`a if cond else b`): faqat oddiy 2 variantli qiymat tayinlashda.', '`if / elif / else`: 3+ holat yoki ko‘p qatorli harakatlar uchun.'],
    compareEn: ['Ternary: concise 2-way value expression.', '`if/elif/else`: 3+ cases or multi-statement blocks.'],
    compareSummaryUz: 'Hech qachon ichma-ich ternary yozmang — 3+ holatda doim `if / elif / else` ishlating.',
    compareSummaryEn: 'Never nest ternary expressions; use `if/elif/else` for 3+ branches.',
    practiceTasks: [
      pt('p0303_1', '1-mashq: Son ishorasi', 'Task 1: Sign Classifier', '`n = -5` uchun `"Musbat"`, `"Manfiy"`, `"Nol"` chiqaring.', 'Classify -5 as Musbat, Manfiy, or Nol.', `n = -5\nif n > 0:\n    print("Musbat")\nelif n < 0:\n    print("Manfiy")\nelse:\n    print("Nol")`, 'Manfiy', 'if/elif/else.', 'Use if/elif/else.'),
      pt('p0303_2', '2-mashq: Ternary juft/toq', 'Task 2: Ternary Parity', '`x = 7` uchun ternary bilan `"Juft"` yoki `"Toq"` chiqaring.', 'Print Juft or Toq using ternary.', `x = 7\nprint("Juft" if x % 2 == 0 else "Toq")`, 'Toq', 'a if cond else b.', 'Use ternary.'),
      pt('p0303_3', '3-mashq: Baho shkalasi', 'Task 3: Grade Lookup', '`score = 92` uchun A/B/C chiqaring.', 'Grade 92.', `score = 92\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")`, 'A', '>= 90 birinchi.', 'Check >= 90 first.'),
      pt('p0303_4', '4-mashq: HTTP status', 'Task 4: Status Label', '`code = 404` -> 200 OK, 404 Not Found, aks holda Other.', 'Map HTTP status 404.', `code = 404\nif code == 200:\n    print("OK")\nelif code == 404:\n    print("Not Found")\nelse:\n    print("Other")`, 'Not Found', 'elif code == 404.', 'Use elif.'),
      pt('p0303_5', '5-mashq: Maksimum ternary', 'Task 5: Max via Ternary', '`a=14, b=9` ning kattasini ternary bilan chiqaring.', 'Print max of 14 and 9 with ternary.', `a, b = 14, 9\nprint(a if a > b else b)`, '14', 'a if a > b else b.', 'Compare a > b.'),
    ],
    quiz: [
      q('q0303_1', '`else if` Python da qanday yoziladi?', 'How is "else if" spelled in Python?', ['else if', 'elseif', 'elif', 'elsif'], ['else if', 'elseif', 'elif', 'elsif'], 2, '`elif`.', '`elif`.'),
      q('q0303_2', '`if/elif/else` zanjiridan nechta tarmoq bajariladi?', 'How many branches execute in an `if/elif/else` chain?', ['Hammasi', 'Ko‘pi bilan bittasi', 'Kamida ikkitasi', 'Faqat oxirgisi'], ['All', 'At most one', 'At least two', 'Only last'], 1, 'Faqat birinchi mos kelgan bitta tarmoq.', 'At most one.'),
      q('q0303_3', '`if x >= 60: "D" elif x >= 90: "A"` da `x=95` nima beradi?', 'Output for `x=95` if `>= 60` comes before `>= 90`?', ['A', 'D', 'A va D', 'Error'], ['A', 'D', 'A and D', 'Error'], 1, 'Tartib xatosi tufayli `"D"`.', '"D" due to wrong order.'),
      q('q0303_4', '`res = "Ha" if True else "Yoq"` da `res`?', 'Value of `res` in `"Ha" if True else "Yoq"`?', ['Ha', 'Yoq', 'True', 'Error'], ['Ha', 'Yoq', 'True', 'Error'], 0, '"Ha".', '"Ha".'),
      q('q0303_5', '`else` blokida shart yoziladimi?', 'Does `else:` take a condition?', ['Ha', 'Yo‘q, faqat `else:` yoziladi', 'Ixtiyoriy', 'Faqat Python 3.12 da'], ['Yes', 'No, just `else:`', 'Optional', '3.12 only'], 1, '`else:` shart olmaydi.', 'No condition on `else:`.'),
    ],
    homework: hw('Soliq va Tarif Kalkulyatori', 'Progressive Tax Calculator', 'Daromadga qarab progressiv soliq stavkasini (`<= 1M: 0%`, `<= 5M: 12%`, `> 5M: 20%`) hisoblovchi dastur yozing.', 'Build a progressive tax bracket calculator using ordered `if/elif/else` tiers.', ['Kamida 4 ta tarif pog‘onasi', 'Yakuniy sof daromadni chiqaring'], ['At least 4 tiers', 'Print net income'], 'Tartibni kichikdan kattaga (<=) yozing.', 'Order `<=` thresholds ascending.', 'Ternary bilan soliq to‘lanishi ha/yo‘q bayrog‘ini qo‘shing.', 'Add a ternary taxable flag.', 20),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-03-04',
    courseId: 'control_flow',
    moduleId: 'c03_m2',
    order: 4,
    titleUz: 'Ichma-ich shartlar va Guard Clause',
    titleEn: 'Nested Conditionals vs Guard Clauses',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-03-03'],
    conceptId: 'nested_conditionals',
    whyUz: "Real tizimlarda avval foydalanuvchi tizimga kirganmi, keyin obunasi bormi, keyin balansi yetarlimi — bosqichma-bosqich tekshiriladi. Lekin juda chuqur ichma-ich `if` ('Arrow Code') dan qochishni bilish sizni darhol junior dan yuqori darajaga olib chiqadi!",
    whyEn: 'Multi-step checks require nested logic or—far cleaner—early-return guard clauses that keep code flat and readable.',
    analogyUz: "Ichma-ich `if` — bu qulf ichidagi qulf; Guard Clause esa — darvozada turgan qo'riqchi: birinchi talab bajarilmasa, ichkariga kiritmasdan darhol qaytarib yuboradi.",
    analogyEn: 'Deep nesting is Russian dolls of conditions; guard clauses are security bouncers rejecting invalid cases immediately at the door.',
    stopsUz: "2 darajadan ortiq ichma-ich `if` yozishga to'g'ri kelsa, funksiyada `return` bilan Guard Clause yoki `and` operatorini ishlating.",
    stopsEn: 'Whenever nesting exceeds 2 levels, flatten with early-return guard clauses or `and`.',
    objUz: ['Ichma-ich (nested) `if` bloklarining chekinishini (8 probel) to‘g‘ri kuzatish', 'Deep nesting ("Arrow Code") ni Guard Clause ga refaktor qilish', 'Xavfsizlik tekshiruvlarini bosqichli tuzish'],
    objEn: ['Trace 2-level nested conditionals accurately', 'Flatten deep arrow-code using guard clauses (`return`)', 'Sequence preconditions cleanly'],
    theoryUz: `### 1. Ichma-ich (Nested) \`if\` nima?
Bir \`if\` blokining ichida boshqa \`if\` bo‘lishi (8 ta probel chekinish).
\`\`\`python
if has_card:
    if pin_ok:
        print("Pul yechildi")
    else:
        print("PIN xato")
\`\`\`
### 2. "Arrow Code" muammosi
4–5 qavat ichma-ich \`if\` kodni o'qib bo'lmas darajaga keltiradi.
### 3. Professional Yechim: Guard Clauses (Erta qaytish)
\`\`\`python
def withdraw(has_card: bool, pin_ok: bool, amount: int) -> str:
    if not has_card:
        return "Karta yo'q"
    if not pin_ok:
        return "PIN xato"
    if amount <= 0:
        return "Summa noto'g'ri"
    return f"{amount} yechildi"
\`\`\`
Kod tekis, chiroyli va har bir xato sababi ko'rinib turadi!
### 4. Qachon nested \`if\` maʼqul?
Har qadamning o'z alohida \`else\` xabari bo'lsa va chuqurlik 2 darajadan oshmasa.
### 5. Keng tarqalgan xato
\`else\` qaysi \`if\` ga tegishli ekanini chekinish (4 probel vs 8 probel) dan adashtirish!`,
    theoryEn: `### 1. Nested Conditionals
Placing an \`if/else\` inside another \`if\` body (8-space indentation) when inner checks depend on outer truth.
### 2. The "Arrow Code" Anti-Pattern
4+ levels of indentation make logic hard to follow.
### 3. Refactoring to Guard Clauses
Check failure preconditions early and \`return\` immediately—leaving the happy path unindented at the bottom.
### 4. When 2-Level Nesting Fits
Small decision trees with distinct \`else\` branches per level.
### 5. Indentation Alignment Bug
Misaligning an inner \`else\` with the outer \`if\` silently alters logic.`,
    examples: [
      ex('Misol 1: Bankomat ikki bosqichli tekshiruvi', 'Example 1: 2-Level Nested ATM Check', `has_card = True\npin_valid = False\nif has_card:\n    if pin_valid:\n        print("Kirish ruxsat")\n    else:\n        print("PIN noto'g'ri")\nelse:\n    print("Karta qo'ying")`, `PIN noto'g'ri`, 'Ichki `else` 4 probel chekinishda bo‘lgani uchun aynan `if pin_valid` ga tegishli.', 'The inner `else` belongs exclusively to `if pin_valid`.'),
      ex('Misol 2: Guard Clause bilan tekis kod', 'Example 2: Flattened Guard Clauses', `def book_flight(age: int, has_passport: bool) -> str:\n    if not has_passport:\n        return "Pasport kerak"\n    if age < 18:\n        return "Kattalar hamrohligi kerak"\n    return "Chipta tasdiqlandi"\n\nprint(book_flight(22, True))\nprint(book_flight(16, True))`, `Chipta tasdiqlandi\nKattalar hamrohligi kerak`, 'Guard clause lar funksiya oqimini 1-darajada ushlab turadi.', 'Guard clauses eliminate deep nesting.'),
      ex('Misol 3: Chegirma va VIP tekshiruvi', 'Example 3: Combining Outer & Inner Conditions', `is_vip = True\ncart_total = 300\nif is_vip:\n    discount = 20 if cart_total >= 200 else 10\nelse:\n    discount = 0\nprint("Chegirma %:", discount)`, `Chegirma %: 20`, 'VIP mijozlar ichida xarid summasiga qarab chegirma ajratiladi.', 'Evaluates tier only after confirming VIP status.'),
    ],
    traceTitleUz: 'Guard Clause bajarilish izi',
    traceTitleEn: 'Tracing Guard Clause Early Return',
    traceCode: `def check(active, balance):\n    if not active:\n        return "Blok"\n    if balance < 10:\n        return "Kam"\n    return "OK"\nprint(check(True, 5))`,
    traceSteps: [
      traceStep(1, 'if not active:', 'False', 'active=True, davom etdi', 'Active passes'),
      traceStep(2, 'if balance < 10:', 'True', '5 < 10 -> erta qaytdi', 'Early return triggered'),
      traceStep(3, 'print(...)', 'Kam', 'Natija chiqdi', 'Output', 'Kam'),
    ],
    commonMistakes: [
      mistake('Ichki `else` ni tashqi `if` ustuniga qo‘yish', 'Misaligning Inner else with Outer if', `a, b = False, True\nif a:\n    if b:\n        print("AB")\nelse:\n    print("a False ekan")`, 'May bind to wrong condition if intended for b', `a, b = False, True\nif a:\n    if b:\n        print("AB")\n    else:\n        print("b False")`, 'Chekinish darajasi `else` qaysi `if` ga tegishliligini belgilaydi.', 'Indentation depth binds `else` to its matching `if`.', 'Har `else` ni o‘z `if` i bilan bir xil ustunga qo‘ying.', 'Align each `else` directly under its `if`.'),
      mistake('4-5 qavatli Arrow Code yozish', 'Deep 4-Level Nesting', `if a:\n    if b:\n        if c:\n            if d:\n                print("OK")`, 'Hard to read & test', `if a and b and c and d:\n    print("OK")`, 'Chuqur ichma-ichlikni `and` yoki guard clause bilan tekislang.', 'Flatten deep pyramids with `and` or early returns.', '2 darajadan oshmang.', 'Keep nesting <= 2 levels.'),
    ],
    compareTitleUz: 'Nested `if` vs Guard Clauses',
    compareTitleEn: 'Nested `if` vs Guard Clauses',
    compareUz: ['Nested `if`: juda kichik 2-bosqichli daraxtlarda qulay.', 'Guard Clause: funksiyada 3+ tekshiruv bo‘lganda professional standart.'],
    compareEn: ['Nested `if`: fine for tiny 2-branch trees.', 'Guard Clause: industry standard for functions with 3+ validations.'],
    compareSummaryUz: 'Funksiyalarda xato shartlarini tepada `return` bilan tekshirib chiqib keting.',
    compareSummaryEn: 'Handle invalid preconditions at the top of functions using early returns.',
    practiceTasks: [
      pt('p0304_1', '1-mashq: Guard funksiya', 'Task 1: Guard Clause', 'Yosh < 18 bo‘lsa `"Rad"`, aks holda `"Ruxsat"` qaytaruvchi funksiya yozing.', 'Write guard function returning Rad if age < 18 else Ruxsat.', `def enter(age: int) -> str:\n    if age < 18:\n        return "Rad"\n    return "Ruxsat"\nprint(enter(20))`, 'Ruxsat', 'Early return.', 'Return early.'),
      pt('p0304_2', '2-mashq: Nested tekshiruv', 'Task 2: Nested Check', 'Login True va Admin True bo‘lsa `"Panel"` chiqaring.', 'Print Panel when logged in and admin.', `logged, admin = True, True\nif logged:\n    if admin:\n        print("Panel")`, 'Panel', 'Ichma-ich if.', 'Nest 4 more spaces.'),
      pt('p0304_3', '3-mashq: Tekislash', 'Task 3: Flatten with and', '3 ta boolean rost bo‘lsa `"Hammasi OK"` chiqaring.', 'Flatten 3 checks with `and`.', `a, b, c = True, True, True\nif a and b and c:\n    print("Hammasi OK")`, 'Hammasi OK', 'and bilan ulang.', 'Join with and.'),
      pt('p0304_4', '4-mashq: Ichki else', 'Task 4: Inner Else', '`a=True, b=False` da ichki `else` `"B yoq"` chiqarsin.', 'Trigger inner else for b=False.', `a, b = True, False\nif a:\n    if b:\n        print("OK")\n    else:\n        print("B yoq")`, 'B yoq', '8 probel chekinish.', 'Indent inner else.'),
      pt('p0304_5', '5-mashq: Buyurtma guardi', 'Task 5: Order Guard', 'Stok 0 bo‘lsa `"Tugagan"`, balans kam bo‘lsa `"Mablag kam"` qaytaring.', 'Write stock and balance guard.', `def buy(stock, cash):\n    if stock <= 0:\n        return "Tugagan"\n    if cash < 50:\n        return "Mablag kam"\n    return "Xarid OK"\nprint(buy(0, 100))`, 'Tugagan', '2 ta guard if.', 'Two guard returns.'),
    ],
    quiz: [
      q('q0304_1', 'Guard Clause ning asosiy foydasi?', 'Main benefit of guard clauses?', ['Kodni chuqurlashtiradi', 'Chuqur chekinishni yo‘qotib kodni tekis va tushunarli qiladi', 'Xatoni yashiradi', 'Sekinlashtiradi'], ['Adds nesting', 'Eliminates arrow-code nesting via early returns', 'Hides bugs', 'Slows runtime'], 1, 'Kodni tekislaydi.', 'Keeps functions flat.'),
      q('q0304_2', '2-qavat ichki `if` tanasi nechta probel suriladi?', 'Indentation for body of a 2nd-level nested `if`?', ['4', '8', '12', '2'], ['4', '8', '12', '2'], 1, '8 ta probel (2 * 4).', '8 spaces.'),
      q('q0304_3', 'Optimal chekinish chuqurligi?', 'Recommended max nesting depth?', ['10', '1–2 qavat', '6', 'Cheksiz'], ['10', '1–2 levels', '6', 'Unlimited'], 1, '1–2 qavat.', '1–2 levels.'),
      q('q0304_4', '`else` qaysi `if` ga bog‘lanadi?', 'How does Python match an `else` to its `if`?', ['Eng yaqin chekinish ustuni bo‘yicha', 'Tasodifiy', 'Birinchi if ga', 'Oxirgi print ga'], ['Matching indentation column', 'Random', 'First if', 'Last print'], 0, 'Chekinish ustuni bo‘yicha.', 'By indentation level.'),
      q('q0304_5', 'Chuqur `if a: if b: if c:` ni qanday soddalashtirish mumkin?', 'How to simplify `if a: if b: if c:`?', ['and operatori bilan', 'while bilan', 'print bilan', 'bo‘lmaydi'], ['With `and`', 'With while', 'With print', 'Impossible'], 0, '`if a and b and c:`.', 'Combine with `and`.'),
    ],
    homework: hw('Onlayn Kredit Tekshiruvi Refaktoringi', 'Loan Approval Guard Refactor', '3 darajali ichma-ich `if/else` bilan yozilgan kredit tekshiruvini (`age >= 21`, `income >= 3_000_000`, `has_debt == False`) toza Guard Clause funksiyasiga aylantiring.', 'Refactor a 3-level nested loan approval check into a clean early-return guard function.', ['Funksiya ichida chuqurlik 1 darajadan oshmasin', '4 xil test holatida chaqiring'], ['Max nesting depth = 1', 'Test 4 scenarios'], 'if age < 21: return "Yosh yetarli emas"', 'Reject invalid cases first.', 'Sababli xabarlarni o‘zbek va ingliz tilida chiqaring.', 'Include rejection reason codes.', 20),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-03-05',
    courseId: 'control_flow',
    moduleId: 'c03_m2',
    order: 5,
    titleUz: 'and, or, not — amaliy shart kombinatsiyalari',
    titleEn: 'Practical Combinations of and, or, and not',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-03-04'],
    conceptId: 'logical_ops_practice',
    whyUz: "Haqiqiy biznes qoidalari kamdan-kam bitta shartdan iborat bo'ladi: 'Talaba 18–25 yoshda VA (imtiyozli YOKI GPA >= 3.5) VA bloklanmagan' kabi qoidalar `and`, `or`, `not` kombinatsiyasi bilan yoziladi.",
    whyEn: 'Real-world business rules combine multiple criteria cleanly using `and`, `or`, `not`, `any()`, and `all()`.',
    analogyUz: "`all([...])` — bu imtihon komissiyasi (hamma a'zo 'Ha' deyishi shart, xuddi `and`); `any([...])` — bu yong'in signali (bitta datchik chalinsa kifoya, xuddi `or`).",
    analogyEn: '`all([...])` is a unanimous jury (`and`); `any([...])` is a smoke alarm where one sensor suffices (`or`).',
    stopsUz: "Python da `or` va `and` har doim ham faqat `True`/`False` qaytarmaydi — ular oxirgi tekshirilgan operandning asl qiymatini qaytaradi (`\"\" or \"Mehmon\" -> \"Mehmon\"`).",
    stopsEn: 'Logical `and`/`or` actually return one of their operands rather than strictly coercing to `bool` (enabling `name or "Guest"`).',
    objUz: ['Murakkab biznes qoidalarini `and`, `or`, `not` bilan xatosiz yozish', '`any()` va `all()` funksiyalaridan o‘rinli foydalanish', '`or` yordamida fallback qiymat berish'],
    objEn: ['Express multi-factor rules with `and`, `or`, `not`', 'Replace repetitive chains with `all()` and `any()`', 'Use `or` safely for fallback values'],
    theoryUz: `### 1. Biznes mantiqni kodga o‘girish
Matnli shartni avval qavslarga ajrating: \`eligible = (18 <= age <= 25) and (is_grant or gpa >= 3.5) and not is_banned\`.
### 2. \`all()\` va \`any()\` superkuchi
5–6 ta \`and\` / \`or\` ni zanjirlash o‘rniga:
- \`all([cond1, cond2, cond3])\` -> hammasi Rostmi?
- \`any([err1, err2, err3])\` -> birortasi Rostmi?
### 3. \`or\` ning qiymat qaytarish siri
\`display = nickname or username or "Mehmon"\` — birinchi Truthy qiymatni oladi!
### 4. \`not in\` — o‘qishga qulay inkor
\`if not role in ("admin", "mod"):\` o‘rniga \`if role not in ("admin", "mod"):\` yozing.
### 5. Keng tarqalgan xato
\`or\` bilan default berayotganda \`0\` ham Falsy ekanini unutish (\`count = 0 or 10\` -> \`10\` bo‘lib ketadi!).`,
    theoryEn: `### 1. Translating Business Rules
Group clauses explicitly: \`(18 <= age <= 25) and (is_grant or gpa >= 3.5)\`.
### 2. \`all()\` and \`any()\`
Clean alternatives to long \`and\`/\`or\` chains across iterables.
### 3. Value-Returning \`and\` / \`or\`
\`display = nick or user or "Guest"\` selects the first truthy value.
### 4. Clean Negation: \`not in\` / \`is not\`
Prefer \`role not in ("admin", "mod")\` over \`not role in ...\`.
### 5. Classic Pitfall
Using \`or\` for defaults when \`0\` is a valid value (\`0 or 10 -> 10\`).`,
    examples: [
      ex('Misol 1: Murakkab stipendiya sharti', 'Example 1: Scholarship Eligibility Rule', `age = 20\ngpa = 3.7\nhas_award = False\nis_banned = False\neligible = (18 <= age <= 25) and (gpa >= 3.5 or has_award) and not is_banned\nprint("Stipendiya:", eligible)`, `Stipendiya: True`, 'Qavslar `or` ni guruhlab, `and` bilan umumiy shartga bog‘ladi.', 'Parentheses isolate the `or` branch cleanly.'),
      ex('Misol 2: `all()` va `any()` bilan tekshirish', 'Example 2: Using all() and any()', `checks = [True, True, True]\nwarnings = [False, True, False]\nprint("Ready:", all(checks))\nprint("Has warning:", any(warnings))`, `Ready: True\nHas warning: True`, '`all()` hamma element True bo‘lishini, `any()` kamida bittasini tekshiradi.', '`all()` checks unanimity; `any()` checks at least one.'),
      ex('Misol 3: `or` va `is not None` bilan default', 'Example 3: Fallback Values Safely', `nickname = ""\nusername = "aziza_py"\nshown = nickname or username or "Mehmon"\nlimit = 0\nsafe_limit = 10 if limit is None else limit\nprint(shown, safe_limit)`, `aziza_py 0`, '`0` qiymatini yo‘qotmaslik uchun sonlarda `is None` ishlating.', 'Use `or` for empty strings and `is None` when `0` is valid.'),
    ],
    traceTitleUz: 'all() va or zanjiri izi',
    traceTitleEn: 'Tracing Business Rule Evaluation',
    traceCode: `a = ""\nb = "Ali"\nres = a or b\nok = all([len(res) >= 3, not False])\nprint(res, ok)`,
    traceSteps: [
      traceStep(1, 'res = a or b', 'res="Ali"', 'Bo‘sh string o‘tib Ali olindi', 'Fallback chose Ali'),
      traceStep(2, 'all([...])', 'ok=True', 'Ikkala shart ham Rost', 'Both predicates True'),
      traceStep(3, 'print(res, ok)', 'Ali True', 'Natija', 'Output', 'Ali True'),
    ],
    commonMistakes: [
      mistake('`0` mumkin joyda `or` fallback ishlatish', 'Using or Fallback When 0 Is Valid', `discount = 0\napplied = discount or 10\nprint(applied)  # 0 bo'lishi kerak edi!`, 'Returns 10 instead of 0', `discount = 0\napplied = 10 if discount is None else discount\nprint(applied)`, '0 Falsy bo‘lgani uchun `0 or 10` -> `10` beradi.', '0 is falsy, so `0 or 10` yields `10`.', 'Sonli fallback da `is None` tekshiring.', 'Check `is None` for numeric defaults.'),
      mistake('`not x in items` yozish', 'Unidiomatic Negated Membership', `if not "x" in ["a", "b"]:\n    print("Yoq")`, 'Works but violates PEP 8', `if "x" not in ["a", "b"]:\n    print("Yoq")`, 'Python da maxsus `not in` operatori bor.', 'PEP 8 prefers `not in` over `not x in`.', '`not in` ishlating.', 'Write `x not in y`.'),
    ],
    compareTitleUz: 'Uzun `and` zanjiri vs `all([...])`',
    compareTitleEn: 'Long `and` Chains vs `all([...])`',
    compareUz: ['2–3 shart: `a and b` juda tez va o‘qilishi oson.', '4+ shart yoki ro‘yxat: `all([...])` / `any([...])` toza.'],
    compareEn: ['2–3 checks: `a and b` is concise.', '4+ dynamic checks: `all()` / `any()` scales cleanly.'],
    compareSummaryUz: 'Ro‘yxatdagi shartlar to‘plamini tekshirishda `all()` va `any()` dan foydalaning.',
    compareSummaryEn: 'Reach for `all()` and `any()` when evaluating collections of conditions.',
    practiceTasks: [
      pt('p0305_1', '1-mashq: all()', 'Task 1: all()', '`all([5 > 1, "a" in "cat", 10 != 0])` ni chiqaring.', 'Evaluate all() on 3 conditions.', `print(all([5 > 1, "a" in "cat", 10 != 0]))`, 'True', 'all([...]).', 'Pass list to all().'),
      pt('p0305_2', '2-mashq: any()', 'Task 2: any()', '`any([False, 0, "OK"])` ni chiqaring.', 'Evaluate any([False, 0, "OK"]).', `print(any([False, 0, "OK"]))`, 'True', 'any().', 'Use any().'),
      pt('p0305_3', '3-mashq: not in', 'Task 3: not in', '`"z" not in "python"` ni chiqaring.', 'Check `"z" not in "python"`.', `print("z" not in "python")`, 'True', 'not in.', 'Use not in.'),
      pt('p0305_4', '4-mashq: or zanjiri', 'Task 4: First Truthy', '`"" or None or "Default"` ni chiqaring.', 'Print first truthy value.', `print("" or None or "Default")`, 'Default', 'or zanjiri.', 'Chain with or.'),
      pt('p0305_5', '5-mashq: Biznes qoida', 'Task 5: Access Rule', '`(age >= 18 and has_id) or is_vip` ni `16, False, True` da chiqaring.', 'Check access rule.', `age, has_id, is_vip = 16, False, True\nprint((age >= 18 and has_id) or is_vip)`, 'True', 'Qavslar.', 'Group with ().'),
    ],
    quiz: [
      q('q0305_1', '`all([True, True, False])` natijasi?', 'Result of `all([True, True, False])`?', ['True', 'False', 'None', 'Error'], ['True', 'False', 'None', 'Error'], 1, 'Bittasi False bo‘lsa ham False.', 'False.'),
      q('q0305_2', '`any([0, "", None, 5])` natijasi?', 'Result of `any([0, "", None, 5])`?', ['True', 'False', '5', '0'], ['True', 'False', '5', '0'], 0, '5 Truthy bo‘lgani uchun `True`.', '`True`.'),
      q('q0305_3', '`"" or "Guest"` nimani qaytaradi?', 'Return value of `"" or "Guest"`?', ['True', '""', '"Guest"', 'False'], ['True', '""', '"Guest"', 'False'], 2, 'Birinchi Truthy qiymat `"Guest"`.', '`"Guest"`.'),
      q('q0305_4', 'PEP 8 bo‘yicha to‘g‘ri inkor?', 'Idiomatic PEP 8 membership negation?', ['not x in y', 'x not in y', 'x !in y', 'x != in y'], ['not x in y', 'x not in y', 'x !in y', 'x != in y'], 1, '`x not in y`.', '`x not in y`.'),
      q('q0305_5', '`val = 0; val or 100` nima qaytaradi?', 'What does `val = 0; val or 100` return?', ['0', '100', 'True', 'False'], ['0', '100', 'True', 'False'], 1, '0 Falsy bo‘lgani uchun `100` qaytadi.', 'Returns `100`.'),
    ],
    homework: hw('Kredit va Chegirma Qoidalari Dvigateli', 'Rule Engine Validator', '`all()` va `any()` yordamida xaridorning VIP chegirma olish shartlarini tekshiruvchi funksiya yozing.', 'Write a rule evaluator using `all()`, `any()`, and `not in` for VIP discount eligibility.', ['Kamida 1 ta all() va 1 ta any()', '3 ta mijoz misolida sinang'], ['Use all() and any()', 'Test 3 customers'], 'all([...]) and any([...])', 'Combine rule groups.', 'Qaysi qoidalar o‘tganini chop eting.', 'Print per-rule breakdown.', 20),
    reviewCheckpoint: review(
      5,
      '5-Review Loyiha: Aqlli Ruxsat & Tarif Dvigateli',
      'Review Project #5: Smart Access & Tier Decision Engine',
      '21–25 darslar (`Boolean Logic`, `if`, `elif/else`, `Guard Clauses`, `and/or/not`, `all/any`) asosida to‘liq qaror qabul qilish dvigatelini tuzing.',
      'Combine lessons 21–25 into a guard-clause + boolean rule engine with `all()`, `any()`, and `if/elif/else`.',
      ['1) Guard clause bilan xatolarni rad etish', '2) `all()` va `any()` bilan ruxsat tekshiruvi', '3) `if/elif/else` bilan tarif darajasi'],
      ['1) Early-return guards', '2) `all()`/`any()` eligibility checks', '3) `if/elif/else` tier assignment'],
      `def evaluate_plan(age: int, verified: bool, banned: bool, gpa: float) -> str:
    if banned or not verified:
        return "Rad etildi"
    if age < 18:
        return "Junior tarif"
    if all([age >= 18, gpa >= 3.5]):
        return "Stipendiya Pro"
    return "Standart tarif"

print(evaluate_plan(20, True, False, 3.8))
print(evaluate_plan(17, True, False, 4.0))`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),
];
