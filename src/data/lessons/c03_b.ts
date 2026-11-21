import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C03_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-03-06',
    courseId: 'control_flow',
    moduleId: 'c03_m3',
    order: 6,
    titleUz: 'while loop — shartli takrorlash',
    titleEn: 'The while Loop & Termination Conditions',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-03-05'],
    conceptId: 'while_loop',
    whyUz: "Necha marta takrorlanishi oldindan noma'lum bo'lgan jarayonlar — foydalanuvchi to'g'ri parol kiritguncha kutish, o'yin sikllari va retry mexanizmlari — `while` sikli bilan quriladi.",
    whyEn: 'When iteration counts are unknown upfront—retries, input validation, and game loops—`while` repeats until a condition flips.',
    analogyUz: "`while` — bu termostatli isitgich: 'xona 22 darajaga yetguncha isitishda davom et'. Har aylanishda haroratni yana tekshiradi.",
    analogyEn: 'A `while` loop is a thermostat: "keep heating while temperature < 22°C," rechecking the condition every cycle.',
    stopsUz: "Agar sikl ichida shartga ta'sir qiluvchi o'zgaruvchini yangilashni unutsangiz, dastur CHEKSIZ SIKL (Infinite Loop) ga tushib qoladi!",
    stopsEn: 'If the loop body never updates the condition state, it spins into an infinite loop until timeout.',
    objUz: ['`while <shart>:` tuzilmasi va to‘xtash shartini (termination) loyihalash', 'Cheksiz sikl (infinite loop) sabablari va oldini olish', 'Hisoblagich (counter) va `while True` + `break` naqshini qo‘llash'],
    objEn: ['Design terminating `while` loops with proper state updates', 'Prevent accidental infinite loops', 'Apply sentinel-controlled `while True` + `break` safely'],
    theoryUz: `### 1. \`while\` sikli nima?
Shart \`True\` bo‘lib turguncha blokni qayta-qayta bajaradi:
\`\`\`python
count = 1
while count <= 3:
    print(count)
    count += 1
\`\`\`
### 2. To'xtash kafolati (3 qism)
Har to‘g‘ri \`while\` da: 1) Boshlang‘ich holat (\`count = 1\`); 2) Shart (\`count <= 3\`); 3) Holatni o‘zgartirish (\`count += 1\`) bo‘lishi shart!
### 3. \`while True\` + \`break\` naqshi
Tekshiruv sikl o‘rtasida bo‘lganda \`while True:\` ichida \`if done: break\` ishlatiladi (doim maksimal urinish limiti bilan!).
### 4. \`while ... else:\`
Sikl \`break\` siz tabiiy tugagandagina \`else:\` qismi ishlaydi.
### 5. Keng tarqalgan xato
\`count += 1\` ni unutish yoki \`while x != 10:\` da 2 qadam sakrab (\`x += 3\`) 10 dan o‘tib ketish!`,
    theoryEn: `### 1. How \`while\` Works
Re-evaluates the boolean condition before every pass until it becomes \`False\`.
### 2. Three Loop Invariants
Initialization -> Condition -> Progress step toward termination.
### 3. Sentinel / Retry Loops
Always include a max-attempts guard on \`while True:\` loops.
### 4. \`while ... else:\`
Runs only when the loop terminates naturally without hitting \`break\`.
### 5. Classic Mistakes
Forgetting the increment or using \`!=\` on step sizes that overshoot the target.`,
    examples: [
      ex('Misol 1: Asosiy `while` sanoqchisi', 'Example 1: Basic Countdown Loop', `n = 3\nwhile n > 0:\n    print("T-minus:", n)\n    n -= 1\nprint("Start!")`, `T-minus: 3\nT-minus: 2\nT-minus: 1\nStart!`, 'Har qadamda `n -= 1` bajarilib `n == 0` da sikl to‘xtaydi.', 'Decrements `n` each cycle until `n > 0` becomes False.'),
      ex('Misol 2: Xavfsiz retry (maksimal urinishlar bilan)', 'Example 2: Bounded Retry Pattern', `attempts = 0\nmax_tries = 3\nconnected = False\nwhile attempts < max_tries and not connected:\n    attempts += 1\n    print(f"Urinish #{attempts}")\n    if attempts == 2:\n        connected = True\nprint("Ulandi:", connected)`, `Urinish #1\nUrinish #2\nUlandi: True`, 'Maksimal urinish chegarasi dasturni abadiy qotishdan asraydi.', 'Bounded retries guarantee termination.'),
      ex('Misol 3: Raqamlarni yig‘ish (`//` va `%` bilan)', 'Example 3: Summing Digits of an Integer', `num = 472\ndigit_sum = 0\nwhile num > 0:\n    digit_sum += num % 10\n    num //= 10\nprint("Raqamlar yig'indisi:", digit_sum)`, `Raqamlar yig'indisi: 13`, '`num % 10` oxirgi raqamni oladi, `num //= 10` uni o‘chiradi.', '`% 10` peels the last digit and `//= 10` shrinks the number.'),
    ],
    traceTitleUz: 'while sikli izi',
    traceTitleEn: 'Tracing a while Loop',
    traceCode: `x = 1\ntotal = 0\nwhile x <= 3:\n    total += x\n    x += 1\nprint(total)`,
    traceSteps: [
      traceStep(1, 'x=1, total=0', 'x=1, total=0', 'Boshlang‘ich holat', 'Initialized'),
      traceStep(2, 'Iter 1 (x=1)', 'total=1, x=2', '1 qo‘shildi', 'Added 1'),
      traceStep(3, 'Iter 2 (x=2)', 'total=3, x=3', '2 qo‘shildi', 'Added 2'),
      traceStep(4, 'Iter 3 (x=3)', 'total=6, x=4', '3 qo‘shildi; x=4 <= 3 False', 'Loop terminates'),
      traceStep(5, 'print(total)', '6', 'Natija', 'Output', '6'),
    ],
    commonMistakes: [
      mistake('Hisoblagichni yangilashni unutish', 'Forgetting State Update (Infinite Loop)', `i = 1\nwhile i <= 5:\n    print(i)  # i += 1 yo'q!`, 'Infinite loop timeout', `i = 1\nwhile i <= 5:\n    print(i)\n    i += 1`, '`i` o‘zgarmasa `i <= 5` abadiy `True` bo‘lib qoladi.', 'If `i` never changes, `i <= 5` stays True forever.', 'Har `while` ichida to‘xtatuvchi o‘zgarish borligini tekshiring.', 'Verify progress toward exit condition.'),
      mistake('Qadam sakrab shartni o‘tkazib yuborish', 'Overshooting != Termination Condition', `x = 1\nwhile x != 4:\n    x += 2  # 1 -> 3 -> 5 -> 7...`, 'Infinite loop!', `x = 1\nwhile x <= 4:\n    x += 2`, 'Tengsizlik `!=` o‘rniga `<` yoki `<=` ishlating.', '`!=` misses exact targets when stepping by > 1.', 'Chegaralarda `<=` yoki `<` xavfsizroq.', 'Prefer `<` or `<=` bounds.'),
    ],
    compareTitleUz: '`while` vs `for`',
    compareTitleEn: '`while` vs `for`',
    compareUz: ['`for`: aniq to‘plam yoki maʼlum takrorlar soni (`range(n)`) uchun.', '`while`: shart bajarilguncha kutish yoki dinamik o‘zgaruvchi chegaralar uchun.'],
    compareEn: ['`for`: fixed collections or known iteration counts.', '`while`: condition-driven repetition until an event occurs.'],
    compareSummaryUz: 'Ro‘yxat va sanoqlar uchun `for`, shartli kutish uchun `while` tanlang.',
    compareSummaryEn: 'Use `for` for collections/ranges and `while` for open-ended conditions.',
    practiceTasks: [
      pt('p0306_1', '1-mashq: 1 dan 4 gacha', 'Task 1: Count 1 to 4', '`while` bilan 1, 2, 3, 4 ni chiqaring.', 'Print 1..4 via while.', `i = 1\nwhile i <= 4:\n    print(i)\n    i += 1`, '1\n2\n3\n4', 'i += 1 unutmang.', 'Increment i.'),
      pt('p0306_2', '2-mashq: Ikki barobarlash', 'Task 2: Doubling Limit', '`x = 1` ni 100 dan kichik bo‘lguncha 2 ga ko‘paytirib oxirgi qiymatni chiqaring.', 'Double x starting at 1 while < 100.', `x = 1\nwhile x < 100:\n    x *= 2\nprint(x)`, '128', 'x *= 2.', 'Multiply by 2.'),
      pt('p0306_3', '3-mashq: Teskari sanoq', 'Task 3: Countdown', '3 dan 1 gacha chiqarib oxirida `"Go"` chiqaring.', 'Countdown 3..1 then print Go.', `c = 3\nwhile c > 0:\n    print(c)\n    c -= 1\nprint("Go")`, '3\n2\n1\nGo', 'c -= 1.', 'Decrement c.'),
      pt('p0306_4', '4-mashq: Yig‘indi', 'Task 4: Running Sum', '1+2+3+4+5 ni `while` bilan toping.', 'Sum 1..5 using while.', `i, s = 1, 0\nwhile i <= 5:\n    s += i\n    i += 1\nprint(s)`, '15', 's += i.', 'Accumulate into s.'),
      pt('p0306_5', '5-mashq: Raqamlar soni', 'Task 5: Digit Count', '`9052` da nechta raqam borligini `while` + `//=` bilan toping.', 'Count digits of 9052 via //= 10.', `n, cnt = 9052, 0\nwhile n > 0:\n    cnt += 1\n    n //= 10\nprint(cnt)`, '4', 'n //= 10.', 'Floor divide by 10.'),
    ],
    quiz: [
      q('q0306_1', 'Cheksiz sikl qachon yuzaga keladi?', 'What causes an infinite `while` loop?', ['Shart har doim True bo‘lib qolsa', 'Sikl ichida print bo‘lsa', 'if ishlatilsa', 'Son kichik bo‘lsa'], ['Condition stays True forever', 'Using print()', 'Using if', 'Small int'], 0, 'Shart False ga o‘tmasa.', 'Condition never flips False.'),
      q('q0306_2', '`while` vs `for` qaysi holatda `while` afzal?', 'When is `while` better than `for`?', ['List ustida aylanishda', 'Takrorlar soni oldindan nomaʼlum shartli jarayonda', 'String kesishda', 'Dict yaratishda'], ['Iterating list', 'Unknown repetition count driven by a runtime condition', 'Slicing string', 'Building dict'], 1, 'Takror soni nomaʼlum bo‘lganda.', 'Unknown iteration count.'),
      q('q0306_3', '`while True:` dan qanday chiqiladi?', 'How do you exit `while True:`?', ['continue', 'break', 'pass', 'skip'], ['continue', 'break', 'pass', 'skip'], 1, '`break`.', '`break`.'),
      q('q0306_4', '`x = 1; while x != 4: x += 2` nima bo‘ladi?', 'What happens in `x = 1; while x != 4: x += 2`?', ['1 marta ishlaydi', 'Cheksiz siklga tushadi', 'SyntaxError', '0 chiqaradi'], ['Runs once', 'Infinite loop (skips 4)', 'SyntaxError', 'Prints 0'], 1, '1, 3, 5, 7 -> 4 dan sakrab o‘tadi.', 'Overshoots 4.'),
      q('q0306_5', '`while ... else:` dagi `else` qachon ishlaydi?', 'When does `else:` on a `while` loop execute?', ['Har doim', 'Sikl `break` siz tabiiy tugaganda', 'Faqat break bo‘lganda', 'Hech qachon'], ['Always', 'Only if loop exits normally without `break`', 'Only on break', 'Never'], 1, '`break` ishlamaganda.', 'When no `break` occurred.'),
    ],
    homework: hw('Parol Urinishlari Cheklagichi', 'Login Retry Lockout', 'To‘g‘ri parol `"python2026"` bo‘lganda, urinishlar ro‘yxati (`["123", "qwerty", "python2026"]`) ustida maksimal 3 ta urinishli `while` tekshiruvini yozing.', 'Simulate a 3-attempt bounded `while` login loop over a list of candidate passwords.', ['while bilan indeksni oshiring', 'Muvaffaqiyat yoki blok xabarini chiqaring'], ['Track attempt index', 'Report success or lockout'], 'while idx < len(tries) and idx < 3:', 'Guard both length and max tries.', 'Qolgan urinishlar sonini ham ko‘rsating.', 'Display remaining attempts.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-03-07',
    courseId: 'control_flow',
    moduleId: 'c03_m3',
    order: 7,
    titleUz: 'for loop — kolleksiyalar bo‘ylab iteratsiya',
    titleEn: 'The for Loop, enumerate() & zip()',
    difficulty: 'beginner',
    estimatedMinutes: 40,
    prerequisites: ['PY-03-06'],
    conceptId: 'for_loop',
    whyUz: "Python dasturchisi vaqtining katta qismini ro'yxatlar, fayl qatorlari, foydalanuvchilar va lug'atlar ustida `for` sikli yozishga sarflaydi. `enumerate()` va `zip()` esa bu sikllarni san'at darajasiga chiqaradi.",
    whyEn: 'Python `for` loops iterate cleanly over sequences and iterables, while `enumerate()` and `zip()` replace clumsy manual index tracking.',
    analogyUz: "`for` sikli — bu pochta tarqatuvchi: ro'yxatdagi har bir uyga (`item`) birma-bir kirib chiqadi va uy tugaganda avtomatik to'xtaydi (cheksiz sikl xavfi yo'q!).",
    analogyEn: 'A `for` loop is a mail carrier visiting every address in a list once and stopping automatically at the last house.',
    stopsUz: "`for` sikli ichida aylanayotgan ro'yxatning o'zidan element o'chirmang (`.remove()`), aks holda elementlar sakrab ketiladi — yangi ro'yxat yig'ing!",
    stopsEn: 'Never mutate (`append`/`remove`) a list while iterating over it directly—build a new list or iterate a copy.',
    objUz: ['List, string, dict va tuple ustida `for item in iterable:` yozish', 'Indeks + qiymat kerak bo‘lganda `range(len())` o‘rniga `enumerate()` ishlatish', 'Ikki ro‘yxatni parallel aylanishda `zip()` qo‘llash'],
    objEn: ['Iterate cleanly over lists, strings, tuples, and dicts', 'Replace `range(len(seq))` with `enumerate(seq, start=1)`', 'Pair parallel sequences via `zip()`'],
    theoryUz: `### 1. Python \`for\` sikli ("For-Each")
\`\`\`python
for fruit in ["Olma", "Banan", "Uzum"]:
    print(fruit)
\`\`\`
### 2. \`enumerate()\` — Indeks va Qiymat birga
\`for i in range(len(items)):\` o‘rniga Pythonic usul:
\`for idx, item in enumerate(items, start=1):\`
### 3. \`zip()\` — Bir nechta ro‘yxatni birlashtirish
\`for name, score in zip(names, scores):\` — ikkala ro‘yxatni juftma-juft beradi.
### 4. Akkumulyator naqshi (Sum, Count, Filter)
\`\`\`python
total = 0
for price in prices:
    if price > 100:
        total += price
\`\`\`
### 5. Oltin ogohlantirish
Iteratsiya paytida asl ro‘yxatdan element o‘chirmang — \`[x for x in items if ...]\` yoki nusxasi (\`items[:]\`) ustida ishlang.`,
    theoryEn: `### 1. Pythonic For-Each Iteration
\`for item in sequence:\` avoids off-by-one indexing bugs.
### 2. \`enumerate(iterable, start=0)\`
Yields \`(index, item)\` pairs directly without \`range(len(...))\`.
### 3. \`zip(a, b)\`
Pairs corresponding elements from multiple sequences, stopping at the shortest.
### 4. Accumulator & Filter Loops
Sum, count, max, or append matching entries cleanly.
### 5. Mutating While Iterating
Never remove elements from a list you are currently looping over—create a new list.`,
    examples: [
      ex('Misol 1: `enumerate()` bilan tartib raqami', 'Example 1: Numbered List with enumerate()', `topics = ["Variables", "Loops", "Functions"]\nfor idx, topic in enumerate(topics, start=1):\n    print(f"{idx}. {topic}")`, `1. Variables\n2. Loops\n3. Functions`, '`start=1` foydalanuvchiga qulay 1-dan boshlangan raqamlash beradi.', '`start=1` yields human-friendly 1-based numbering.'),
      ex('Misol 2: `zip()` bilan parallel ro‘yxatlar', 'Example 2: Parallel Iteration with zip()', `names = ["Ali", "Laylo"]\nscores = [92, 97]\nfor name, score in zip(names, scores):\n    print(f"{name}: {score}")`, `Ali: 92\nLaylo: 97`, '`zip()` har bir talabani o‘z bali bilan bog‘laydi.', '`zip()` pairs items at matching positions.'),
      ex('Misol 3: Matndan unli harflarni sanash', 'Example 3: Counting Vowels in a String', `text = "Python Mastery"\nvowels = "aeiouAEIOU"\ncount = 0\nfor ch in text:\n    if ch in vowels:\n        count += 1\nprint("Unlilar:", count)`, `Unlilar: 3`, 'String ham iterable bo‘lgani uchun `for` harfma-harf aylanadi.', 'Strings iterate character-by-character naturally.'),
    ],
    traceTitleUz: 'Akkumulyator for sikli izi',
    traceTitleEn: 'Tracing an Accumulator for Loop',
    traceCode: `nums = [4, 7, 2]\ntotal = 0\nfor n in nums:\n    total += n\nprint(total)`,
    traceSteps: [
      traceStep(1, 'n = 4', 'total=4', '0 + 4 = 4', 'Added 4'),
      traceStep(2, 'n = 7', 'total=11', '4 + 7 = 11', 'Added 7'),
      traceStep(3, 'n = 2', 'total=13', '11 + 2 = 13', 'Added 2'),
      traceStep(4, 'print(total)', '13', 'Chiqish', 'Output', '13'),
    ],
    commonMistakes: [
      mistake('Iteratsiya paytida ro‘yxatdan element o‘chirish', 'Removing Items While Iterating Over Same List', `nums = [1, 2, 3, 4]\nfor n in nums:\n    if n % 2 == 0:\n        nums.remove(n)\nprint(nums)  # Katta ro'yxatda element sakraydi!`, 'Skipped elements bug on adjacent matches', `nums = [1, 2, 2, 4]\nclean = [n for n in nums if n % 2 != 0]\nprint(clean)`, 'Element o‘chsa indekslar chapga suriladi va keyingi element tashlab ketiladi.', 'Removing shifts indices left, skipping the next element.', 'Doim yangi filtrlangan ro‘yxat tuzing.', 'Build a new filtered list instead.'),
      mistake('`range(len())` ni keraksiz ishlatish', 'Unnecessary range(len()) Indexing', `for i in range(len(items)):\n    print(i, items[i])`, 'Verbose C-style loop', `for i, item in enumerate(items):\n    print(i, item)`, '`enumerate()` qisqa va Pythonic.', '`enumerate()` unpacks index and value cleanly.', 'Indeks kerak bo‘lsa `enumerate()` tanlang.', 'Use `enumerate()`.'),
    ],
    compareTitleUz: '`for item in seq` vs `enumerate()` vs `zip()`',
    compareTitleEn: '`for item in seq` vs `enumerate()` vs `zip()`',
    compareUz: ['Faqat qiymat: `for x in items:`', 'Indeks + qiymat: `for i, x in enumerate(items):`', '2+ ro‘yxat: `for a, b in zip(xs, ys):`'],
    compareEn: ['Values only: `for x in items:`', 'Index + value: `for i, x in enumerate(items):`', 'Parallel sequences: `for a, b in zip(xs, ys):`'],
    compareSummaryUz: 'Python da C-uslubidagi `range(len(...))` o‘rniga to‘g‘ridan-to‘g‘ri iteratsiya, `enumerate()` va `zip()` ishlating.',
    compareSummaryEn: 'Avoid manual indexing—use direct iteration, `enumerate()`, and `zip()`.',
    practiceTasks: [
      pt('p0307_1', '1-mashq: Ro‘yxat yig‘indisi', 'Task 1: Sum Elements', '`[10, 20, 30]` yig‘indisini `for` sikli bilan toping.', 'Sum `[10, 20, 30]` in a for loop.', `s = 0\nfor n in [10, 20, 30]:\n    s += n\nprint(s)`, '60', 's += n.', 'Accumulate into s.'),
      pt('p0307_2', '2-mashq: enumerate', 'Task 2: Enumerate', '`["A", "B"]` ni `0: A` ko‘rinishida chiqaring.', 'Print index and value via enumerate.', `for i, v in enumerate(["A", "B"]):\n    print(f"{i}: {v}")`, '0: A\n1: B', 'enumerate().', 'Use enumerate().'),
      pt('p0307_3', '3-mashq: zip ko‘paytma', 'Task 3: Zip Products', '`[2, 3]` va `[4, 5]` juftlari ko‘paytmasini chiqaring.', 'Multiply pairs from two lists with zip().', `for a, b in zip([2, 3], [4, 5]):\n    print(a * b)`, '8\n15', 'zip().', 'Use zip().'),
      pt('p0307_4', '4-mashq: Eng katta son', 'Task 4: Find Max', '`[3, 9, 4]` dan eng kattasini `for` bilan toping.', 'Find max of `[3, 9, 4]` with a loop.', `nums = [3, 9, 4]\nbest = nums[0]\nfor n in nums:\n    if n > best:\n        best = n\nprint(best)`, '9', 'best = nums[0].', 'Compare each n > best.'),
      pt('p0307_5', '5-mashq: Belgilar soni', 'Task 5: Count a', '`"banana"` da nechta `"a"` borligini `for` bilan sanang.', 'Count `"a"` in `"banana"` via loop.', `cnt = 0\nfor ch in "banana":\n    if ch == "a":\n        cnt += 1\nprint(cnt)`, '3', 'if ch == "a".', 'Increment counter.'),
    ],
    quiz: [
      q('q0307_1', '`enumerate(["x", "y"], start=1)` birinchi element sifatida nima beradi?', 'First tuple from `enumerate(["x", "y"], start=1)`?', ['(0, "x")', '(1, "x")', '("x", 1)', 'Error'], ['(0, "x")', '(1, "x")', '("x", 1)', 'Error'], 1, '(1, "x").', '(1, "x").'),
      q('q0307_2', '`zip([1, 2, 3], ["a", "b"])` nechta juft beradi?', 'How many pairs does `zip([1, 2, 3], ["a", "b"])` yield?', ['3', '2', '5', 'ValueError'], ['3', '2', '5', 'ValueError'], 1, 'Eng qisqa ro‘yxat uzunligida — 2 ta.', 'Stops at shortest: 2.'),
      q('q0307_3', 'Nega `for` sikli ichida ro‘yxatdan element o‘chirish xavfli?', 'Why avoid mutating a list while looping over it?', ['Xotira to‘ladi', 'Indekslar surilib elementlar sakrab ketiladi', 'SyntaxError', 'Sekin'], ['Fills RAM', 'Shifting indices skips adjacent items', 'SyntaxError', 'Slow'], 1, 'Elementlar sakrab ketiladi.', 'Indices shift and skip items.'),
      q('q0307_4', 'String ustida `for ch in "abc":` qilsak nima chiqadi?', 'What does `for ch in "abc":` iterate over?', ['Sonlar', 'Har bir belgi ("a", "b", "c")', 'Butun matn 1 marta', 'Error'], ['Numbers', 'Each character ("a", "b", "c")', 'Whole string once', 'Error'], 1, 'Harfma-harf.', 'Character by character.'),
      q('q0307_5', 'Qaysi yondashuv Pythonic hisoblanadi?', 'Which loop is most Pythonic for index + value?', ['range(len(x))', 'enumerate(x)', 'while i < len(x)', 'goto'], ['range(len(x))', 'enumerate(x)', 'while i < len(x)', 'goto'], 1, '`enumerate()`.', '`enumerate()`.'),
    ],
    homework: hw('Savat Hisob-kitob Agregator', 'Shopping Cart Aggregator', '`items = ["Olma", "Non", "Sut"]`, `prices = [12000, 4000, 15000]`, `qtys = [2, 3, 1]` ro‘yxatlarini `zip()` va `enumerate(..., 1)` bilan birlashtirib to‘liq chek va jami summani chiqaring.', 'Combine items, prices, and quantities using `zip()` and `enumerate(..., 1)` to print a receipt and grand total.', ['zip() va enumerate() ishlating', 'Umumiy summani chiqaring'], ['Use zip() and enumerate()', 'Print grand total'], 'for i, (name, p, q) in enumerate(zip(items, prices, qtys), 1):', 'Unpack enumerate(zip(...)).', 'Eng qimmat pozitsiyani ham aniqlang.', 'Highlight the highest line total.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-03-08',
    courseId: 'control_flow',
    moduleId: 'c03_m3',
    order: 8,
    titleUz: 'range() funksiyasi va son ketma-ketliklari',
    titleEn: 'The range() Sequence: Start, Stop & Step',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-03-07'],
    conceptId: 'range_function',
    whyUz: "Ma'lum bir takrorlar soni (`10` marta urinish), juft/toq sonlar, teskari sanoq va matrisalar bilan ishlashda `range()` xotirani tejaydigan (lazy) eng muhim vositadir.",
    whyEn: '`range(start, stop, step)` generates numeric progressions lazily in O(1) memory without allocating giant lists.',
    analogyUz: "`range(1, 1_000_000)` xotiraga millionta sonni birdan yozmaydi — u faqat 'boshi=1, oxiri=1_000_000, qadam=1' formulasini eslab turadi va so'raganda bittadan beradi.",
    analogyEn: '`range(1_000_000)` does not store a million ints in RAM; it stores just `start`, `stop`, and `step` and computes each value on demand.',
    stopsUz: "`stop` qiymati hech qachon natijaga kirmaydi (`range(1, 5)` -> `1, 2, 3, 4`); teskari qadamda esa `start > stop` bo'lishi shart (`range(5, 0, -1)`).",
    stopsEn: '`stop` is always exclusive; negative steps require `start > stop` or the range will be empty.',
    objUz: ['`range(stop)`, `range(start, stop)`, `range(start, stop, step)` shakllarini bilish', 'Teskari sanoq (`range(10, 0, -2)`) yozish', '`range()` O(1) xotira tejashini (`sys.getsizeof`) ko‘rish'],
    objEn: ['Master 1-, 2-, and 3-argument `range()` forms', 'Write descending ranges with negative steps', 'Understand why `range()` uses O(1) memory regardless of span'],
    theoryUz: `### 1. Uchta ko‘rinishi
- \`range(5)\` -> \`0, 1, 2, 3, 4\`
- \`range(2, 6)\` -> \`2, 3, 4, 5\`
- \`range(0, 10, 2)\` -> \`0, 2, 4, 6, 8\`
### 2. Teskari (Negative Step)
\`range(5, 0, -1)\` -> \`5, 4, 3, 2, 1\`.
### 3. Xotira samaradorligi (Lazy Range)
\`range(10**9)\` ham \`range(10)\` bilan bir xil (~48 bayt) xotira egallaydi! Shuning uchun kerak bo‘lmasa \`list(range(...))\` ga o‘girib yubormang.
### 4. \`len()\` va \`in\` ni O(1) da qo‘llab-quvvatlaydi
\`500_000 in range(1_000_000)\` bir onda (formula orqali) tekshiriladi!
### 5. Keng tarqalgan xato
\`range(5, 1)\` (manfiy \`-1\` qadamsiz) bo‘sh ketma-ketlik beradi!`,
    theoryEn: `### 1. Three Forms
\`range(stop)\`, \`range(start, stop)\`, \`range(start, stop, step)\`.
### 2. Counting Down
Pass negative step: \`range(10, 0, -1)\`.
### 3. O(1) Memory Footprint
\`range(10**12)\` takes ~48 bytes; avoid \`list(range(...))\` unless needed.
### 4. Fast \`len()\` and \`in\`
Membership checks run in constant O(1) math time.
### 5. Empty Range Mistake
\`range(5, 0)\` yields nothing because default step is \`+1\`.`,
    examples: [
      ex('Misol 1: Qadam va teskari sanoq', 'Example 1: Step & Countdown Ranges', `print("Evens:", list(range(2, 11, 2)))\nprint("Countdown:", list(range(5, 0, -1)))`, `Evens: [2, 4, 6, 8, 10]\nCountdown: [5, 4, 3, 2, 1]`, '`stop` qiymati kirmaydi: `11` gacha -> `10`, `0` gacha -> `1`.', 'Exclusive stop produces up to 10 ascending and down to 1 descending.'),
      ex('Misol 2: Xotirada O(1) hajm', 'Example 2: O(1) Memory of Huge Range', `import sys\nsmall_r = range(10)\nhuge_r = range(10_000_000)\nprint("Equal bytes:", sys.getsizeof(small_r) == sys.getsizeof(huge_r))\nprint("5_000_000 in huge_r:", 5_000_000 in huge_r)`, `Equal bytes: True\n5_000_000 in huge_r: True`, '10 millionlik range ham 10 talik range kabi bir xil xotira egallaydi.', 'Huge ranges take constant memory and O(1) membership lookup.'),
      ex('Misol 3: Ko‘paytirish jadvali qatori', 'Example 3: Generating Multiplication Row', `n = 5\nfor i in range(1, 6):\n    print(f"{n}x{i}={n*i}", end="  ")`, `5x1=5  5x2=10  5x3=15  5x4=20  5x5=25`, '`range(1, 6)` 1 dan 5 gacha aniq sonlarni beradi.', '`range(1, 6)` cleanly bounds 1..5.'),
    ],
    traceTitleUz: 'Teskari range izi',
    traceTitleEn: 'Tracing Negative-Step Range',
    traceCode: `res = []\nfor x in range(6, 0, -2):\n    res.append(x)\nprint(res)`,
    traceSteps: [
      traceStep(1, 'x = 6', 'res=[6]', 'Boshlang‘ich qiymat', 'Start at 6'),
      traceStep(2, 'x = 4', 'res=[6, 4]', '6 - 2 = 4', 'Stepped by -2'),
      traceStep(3, 'x = 2', 'res=[6, 4, 2]', '4 - 2 = 2; keyingi 0 > 0 False', 'Stops before 0'),
      traceStep(4, 'print(res)', '[6, 4, 2]', 'Natija', 'Output', '[6, 4, 2]'),
    ],
    commonMistakes: [
      mistake('Teskari sanoqda `-1` qadamni unutish', 'Forgetting Negative Step for Countdown', `print(list(range(5, 0)))  # Bo'sh [] chiqadi!`, 'Empty range unexpectedly', `print(list(range(5, 0, -1)))`, 'Odatiy qadam `+1`; kamayish uchun `-1` shart.', 'Default step is +1; pass -1 to count down.', 'Teskari `range` da doim 3-argument `-1` yozing.', 'Always supply negative step when start > stop.'),
      mistake('Float qadam berishga urinish', 'Passing Float to range()', `range(0, 1, 0.2)`, 'TypeError: "float" object cannot be interpreted as an integer', `for i in range(0, 10, 2):\n    print(i / 10)`, '`range()` faqat `int` qabul qiladi.', '`range()` accepts integers only.', 'Butun sonlarda hisoblab keyin bo‘ling.', 'Loop integers and divide inside.'),
    ],
    compareTitleUz: '`range(n)` vs `list(range(n))`',
    compareTitleEn: '`range(n)` vs `list(range(n))`',
    compareUz: ['`for i in range(n)`: O(1) xotira, juda tez.', '`list(range(n))`: barcha sonlarni RAM ga yozadi (faqat ro‘yxat metodi kerak bo‘lganda).'],
    compareEn: ['`for i in range(n)`: O(1) memory lazy progression.', '`list(range(n))`: materializes all ints in RAM.'],
    compareSummaryUz: 'Sikllarda `range()` ni hech qachon `list()` ga o‘ramang — o‘zini ishlating.',
    compareSummaryEn: 'Iterate over `range()` directly without converting it to a `list`.',
    practiceTasks: [
      pt('p0308_1', '1-mashq: 1 dan 5 gacha', 'Task 1: 1..5', '`list(range(1, 6))` ni chiqaring.', 'Print list(range(1, 6)).', `print(list(range(1, 6)))`, '[1, 2, 3, 4, 5]', 'stop=6.', 'Use stop=6.'),
      pt('p0308_2', '2-mashq: 3 ga karrali sonlar', 'Task 2: Multiples of 3', '3 dan 15 gacha (15 kirsin) 3 qadamli ro‘yxat chiqaring.', 'Print multiples of 3 from 3 to 15.', `print(list(range(3, 16, 3)))`, '[3, 6, 9, 12, 15]', 'range(3, 16, 3).', 'Step=3, stop=16.'),
      pt('p0308_3', '3-mashq: Teskari', 'Task 3: Reverse Range', '10 dan 2 gacha juft sonlarni kamayish tartibida chiqaring.', 'Print even numbers 10 down to 2.', `print(list(range(10, 0, -2)))`, '[10, 8, 6, 4, 2]', 'step=-2.', 'Use step=-2.'),
      pt('p0308_4', '4-mashq: Yig‘indi', 'Task 4: Sum Range', '`sum(range(1, 101))` ni chiqaring.', 'Sum integers 1..100.', `print(sum(range(1, 101)))`, '5050', 'sum(range(1, 101)).', 'Pass range to sum().'),
      pt('p0308_5', '5-mashq: Takroriy amal', 'Task 5: Repeat N Times', '`_` bilan 3 marta `"Salom"` chiqaring.', 'Print Salom 3 times using _.', `for _ in range(3):\n    print("Salom")`, 'Salom\nSalom\nSalom', 'for _ in range(3):.', 'Use `_` loop variable.'),
    ],
    quiz: [
      q('q0308_1', '`list(range(2, 7))` nimani beradi?', 'Result of `list(range(2, 7))`?', ['[2, 3, 4, 5, 6, 7]', '[2, 3, 4, 5, 6]', '[3, 4, 5, 6]', '[2, 4, 6]'], ['[2, 3, 4, 5, 6, 7]', '[2, 3, 4, 5, 6]', '[3, 4, 5, 6]', '[2, 4, 6]'], 1, 'stop (7) kirmaydi.', '7 is exclusive.'),
      q('q0308_2', '`list(range(5, 1))` natijasi?', 'Result of `list(range(5, 1))`?', ['[5, 4, 3, 2]', '[]', 'Error', '[1, 2, 3, 4]'], ['[5, 4, 3, 2]', '[]', 'Error', '[1, 2, 3, 4]'], 1, 'Manfiy qadamsiz bo‘sh `[]`.', 'Empty `[]`.'),
      q('q0308_3', '`range(0.5, 5.5)` ishlaydimi?', 'Does `range(0.5, 5.5)` work?', ['Ha', 'Yo‘q, TypeError (faqat int)', 'Float qaytaradi', 'Yaxlitlaydi'], ['Yes', 'No, raises TypeError (ints only)', 'Returns floats', 'Rounds'], 1, 'Faqat `int`.', 'Integers only.'),
      q('q0308_4', '`range(10_000_000)` qanday xotira oladi?', 'Memory complexity of `range(10_000_000)`?', ['O(n)', 'O(1)', 'O(n^2)', '1 GB'], ['O(n)', 'O(1)', 'O(n^2)', '1 GB'], 1, 'Doimiy O(1).', 'O(1) lazy.'),
      q('q0308_5', 'Sikl o‘zgaruvchisi kerak bo‘lmasa nima yoziladi?', 'Convention for unused loop variable?', ['x', '_', 'null', 'temp'], ['x', '_', 'null', 'temp'], 1, 'Pastki chiziq `_`.', 'Underscore `_`.'),
    ],
    homework: hw('Ko‘paytirish Jadvali Generatori', 'Multiplication Table Matrix', '`range(1, 6)` ichma-ich sikli bilan 5x5 ko‘paytirish jadvalini chiroyli formatda chiqaring.', 'Generate a neat 5x5 multiplication grid using nested `range(1, 6)` loops.', ['Ichma-ich for/range ishlating', 'Ustunlarni f"{val:3d}" bilan tekislang'], ['Use nested range loops', 'Align columns cleanly'], 'print(f"{r*c:3d}", end="")', 'Pad columns with :3d.', 'Faqat yuqori uchburchak variantini ham qo‘shing.', 'Add a triangular view too.', 20),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-03-09',
    courseId: 'control_flow',
    moduleId: 'c03_m4',
    order: 9,
    titleUz: 'break, continue, pass va for-else',
    titleEn: 'Loop Control: break, continue, pass & for-else',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-03-08'],
    conceptId: 'break_continue_pass',
    whyUz: "Qidirilayotgan element topilgan zahoti siklni to'xtatish (`break`), keraksiz yozuvlarni o'tkazib yuborish (`continue`) va vaqtinchalik bo'sh skelet qo'yish (`pass`) algoritm tezligi va tozaligini oshiradi.",
    whyEn: '`break` stops early once a target is found, `continue` skips noise cleanly, and `pass` serves as a valid empty placeholder.',
    analogyUz: "`break` — favqulodda tormoz (izlangan narsa topildi, poezddan tushamiz); `continue` — bekatni o'tkazib keyingi bekatga o'tish; `pass` — qurilayotgan bekatdagi 'bo'sh o'rin' belgisi.",
    analogyEn: '`break` exits the train immediately; `continue` skips this stop for the next; `pass` is an empty placeholder sign.',
    stopsUz: "`break` faqat o'zi turgan ENG ICHKI siklni to'xtatadi; tashqi sikllar davom etaveradi.",
    stopsEn: '`break` exits only the innermost enclosing loop, not outer loops.',
    objUz: ['`break` (to‘xtatish), `continue` (keyingi iteratsiyaga sakrash), `pass` (no-op) farqini bilish', '`for ... else:` naqshini qidiruvlarda qo‘llash', 'Nestlangan siklda `continue` dan keyingi kod o‘tkazib yuborilishini kuzatish'],
    objEn: ['Distinguish `break`, `continue`, and `pass`', 'Apply `for ... else:` for clean search loops', 'Avoid skipped-increment bugs in `while` + `continue`'],
    theoryUz: `### 1. \`break\` — Sikldan darhol chiqish
Masalan, ro‘yxatdan birinchi manfiy sonni topishi bilan to‘xtash (ortiqcha tekshirmaslik).
### 2. \`continue\` — Qadamni o‘tkazib yuborish
Siklning qolgan qismini bajarmasdan darhol keyingi elementga o‘tadi (guard clause sifatida juda qulay!).
### 3. \`pass\` — Hech narsa qilmaslik
Python bo‘sh blok (\`def todo():\`) ga ruxsat bermaydi; vaqtinchalik bo‘sh joy uchun \`pass\` yoziladi.
### 4. \`for ... else:\` (Qidiruv naqshi)
Agar \`for\` sikli \`break\` ga tushmasdan oxirigacha borsa, \`else:\` bloki ishlaydi ("Topilmadi").
### 5. Keng tarqalgan xato
\`while\` siklida \`continue\` dan OLDIN \`i += 1\` yozmaslik -> cheksiz sikl!`,
    theoryEn: `### 1. \`break\`
Terminates the innermost loop immediately.
### 2. \`continue\`
Jumps straight to the next iteration, great for skipping invalid records at the top of a loop body.
### 3. \`pass\`
A syntactic no-op placeholder where Python requires a statement block.
### 4. \`for ... else:\`
Executes \`else:\` only if the loop finished without hitting \`break\`.
### 5. Classic Bug
Placing \`continue\` before the counter increment inside a \`while\` loop triggers an infinite loop.`,
    examples: [
      ex('Misol 1: `continue` bilan filtr va `break` bilan qidiruv', 'Example 1: Filtering with continue & Early Exit with break', `for n in [1, -3, 4, 0, 99, 7]:\n    if n <= 0:\n        continue\n    if n == 99:\n        print("Stop marker topildi!")\n        break\n    print("Valid:", n)`, `Valid: 1\nValid: 4\nStop marker topildi!`, 'Manfiy va 0 `continue` bilan tashlab ketildi, `99` da esa sikl `break` bilan to‘xtadi.', 'Skips non-positives with `continue` and stops at sentinel `99`.'),
      ex('Misol 2: `for ... else:` bilan qidiruv', 'Example 2: Search Loop with for...else', `targets = [3, 7, 11]\nfor x in targets:\n    if x == 10:\n        print("Topildi!")\n        break\nelse:\n    print("10 topilmadi")`, `10 topilmadi`, 'Sikl `break` siz tugagani uchun `else` ishladi.', '`else:` runs because `10` was never matched via `break`.'),
      ex('Misol 3: `pass` va `continue` farqi', 'Example 3: pass Does Not Skip Following Lines', `for x in [1, 2]:\n    if x == 1:\n        pass\n    print("Processed:", x)`, `Processed: 1\nProcessed: 2`, '`pass` hech narsa qilmaydi va keyingi qator davom etaveradi (`continue` esa sakraydi).', '`pass` falls through to subsequent statements unlike `continue`.'),
    ],
    traceTitleUz: 'break va continue izi',
    traceTitleEn: 'Tracing break and continue',
    traceCode: `total = 0\nfor x in [5, -1, 10, 100]:\n    if x < 0:\n        continue\n    if x > 50:\n        break\n    total += x\nprint(total)`,
    traceSteps: [
      traceStep(1, 'x = 5', 'total=5', '5 qo‘shildi', 'Added 5'),
      traceStep(2, 'x = -1', 'total=5', 'continue -> o‘tkazildi', 'Skipped via continue'),
      traceStep(3, 'x = 10', 'total=15', '10 qo‘shildi', 'Added 10'),
      traceStep(4, 'x = 100', 'total=15', 'break -> sikl tugadi', 'Exited loop'),
      traceStep(5, 'print(total)', '15', 'Chiqish', 'Output', '15'),
    ],
    commonMistakes: [
      mistake('`while` siklida `continue` oldidan `i += 1` qo‘ymaslik', 'continue Skipping Counter Increment in while', `i = 0\nwhile i < 3:\n    if i == 1:\n        continue  # Cheksiz sikl!\n    i += 1`, 'Infinite loop when i == 1', `i = 0\nwhile i < 3:\n    i += 1\n    if i == 2:\n        continue\n    print(i)`, '`while` da hisoblagichni `continue` dan oldin yangilang.', 'Increment before `continue` in `while` loops.', 'Sanoqlar uchun `for` ishlatish xavfsizroq.', 'Prefer `for` for counting.'),
      mistake('`pass` ni `continue` deb o‘ylash', 'Confusing pass with continue', `for x in [1, 2]:\n    if x == 1:\n        pass  # Baribir print(x) ishlaydi!\n    print(x)`, 'Prints 1 even though condition matched', `for x in [1, 2]:\n    if x == 1:\n        continue\n    print(x)`, '`pass` iteratsiyani o‘tkazib yubormaydi.', '`pass` is a no-op, not a skip.', 'O‘tkazib yuborish uchun `continue` yozing.', 'Use `continue` to skip.'),
    ],
    compareTitleUz: '`break` vs `continue` vs `pass`',
    compareTitleEn: '`break` vs `continue` vs `pass`',
    compareUz: ['`break`: sikldan butunlay chiqadi.', '`continue`: faqat joriy qadamni tugatib keyingisiga o‘tadi.', '`pass`: bo‘sh blok o‘rnini to‘ldiruvchi (hech narsa qilmaydi).'],
    compareEn: ['`break`: exits the entire loop.', '`continue`: skips rest of current iteration.', '`pass`: does nothing (syntactic placeholder).'],
    compareSummaryUz: 'Tez qidirishda `break`, filtrli tozalashda `continue`, skelet kodda `pass` ishlating.',
    compareSummaryEn: 'Use `break` for early exit, `continue` to skip items, and `pass` for stubs.',
    practiceTasks: [
      pt('p0309_1', '1-mashq: Birinchi juftda break', 'Task 1: First Even Break', '`[1, 3, 4, 6]` da birinchi juft sonni chiqarib to‘xtang.', 'Print first even and break.', `for n in [1, 3, 4, 6]:\n    if n % 2 == 0:\n        print(n)\n        break`, '4', 'break.', 'Use break.'),
      pt('p0309_2', '2-mashq: continue bilan o‘tkazish', 'Task 2: Skip Negatives', '`[2, -5, 8]` dan faqat musbatlarni chiqaring.', 'Skip negative numbers with continue.', `for n in [2, -5, 8]:\n    if n < 0:\n        continue\n    print(n)`, '2\n8', 'continue.', 'Use continue.'),
      pt('p0309_3', '3-mashq: pass skelet', 'Task 3: pass Placeholder', '`def future(): pass` yaratib `"OK"` chiqaring.', 'Define stub function with pass and print OK.', `def future():\n    pass\nprint("OK")`, 'OK', 'pass.', 'Use pass.'),
      pt('p0309_4', '4-mashq: for-else', 'Task 4: for-else', '`[2, 4, 6]` da toq son yo‘q bo‘lsa `"Toq yoq"` chiqaring.', 'Print Toq yoq via for-else.', `for n in [2, 4, 6]:\n    if n % 2 == 1:\n        break\nelse:\n    print("Toq yoq")`, 'Toq yoq', 'for ... else.', 'Use else on for.'),
      pt('p0309_5', '5-mashq: Bo‘sh satrlarni skip qilish', 'Task 5: Skip Empty Lines', '`["a", "", "b"]` dan bo‘sh emaslarini chiqaring.', 'Skip empty strings via continue.', `for s in ["a", "", "b"]:\n    if not s:\n        continue\n    print(s)`, 'a\nb', 'if not s: continue.', 'Skip falsy strings.'),
    ],
    quiz: [
      q('q0309_1', 'Qaysi kalit so‘z siklni darhol to‘xtatadi?', 'Which keyword exits the loop immediately?', ['continue', 'pass', 'break', 'exit'], ['continue', 'pass', 'break', 'exit'], 2, '`break`.', '`break`.'),
      q('q0309_2', '`continue` nima qiladi?', 'What does `continue` do?', ['Sikldan chiqadi', 'Joriy qadamni tugatib keyingi iteratsiyaga o‘tadi', 'Dasturni to‘xtatadi', 'Hech narsa'], ['Exits loop', 'Jumps to the next loop iteration', 'Halts script', 'Nothing'], 1, 'Keyingi iteratsiyaga o‘tadi.', 'Advances to next iteration.'),
      q('q0309_3', '`pass` dan keyin o‘sha blokdagi keyingi qator bajariladimi?', 'Do lines after `pass` in the same block execute?', ['Ha', 'Yo‘q', 'Faqat break bilan', 'SyntaxError'], ['Yes', 'No', 'Only with break', 'SyntaxError'], 0, 'Ha, `pass` hech narsa qilmaydi.', 'Yes, `pass` is a no-op.'),
      q('q0309_4', '`for ... else` dagi `else` qachon ishlaydi?', 'When does `for ... else` execute `else`?', ['Sikl `break` ga duch kelmasdan tugasa', 'Faqat break bo‘lganda', 'Har qadamda', 'Hech qachon'], ['When loop completes without `break`', 'Only on break', 'Every step', 'Never'], 0, '`break` siz tugasa.', 'When no `break` happens.'),
      q('q0309_5', 'Ichma-ich siklda `break` qaysi siklni to‘xtatadi?', 'Which loop does `break` terminate in nested loops?', ['Hammasini', 'Faqat eng ichkisini', 'Faqat tashqisini', 'Hech birini'], ['All', 'Only the innermost loop', 'Outer only', 'None'], 1, 'Eng ichki siklni.', 'Innermost loop only.'),
    ],
    homework: hw('Tub Son Tekshiruvchi (for-else)', 'Prime Checker with for-else', '`n = 29` sonining tub (prime) ekanligini `for d in range(2, n):` va `for ... else:` yordamida tekshiring hamda 2..30 oralig‘idagi barcha tub sonlarni chiqaring.', 'Use `for ... else:` with `break` to detect primes between 2 and 30.', ['break va for-else ishlating', 'Barcha tub sonlarni ro‘yxatga yig‘ing'], ['Use break and for-else', 'Collect primes into a list'], 'if num % d == 0: break', 'Break on first divisor.', 'range(2, int(num**0.5) + 1) bilan optimallashtiring.', 'Optimize up to sqrt(num).', 20),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-03-10',
    courseId: 'control_flow',
    moduleId: 'c03_m4',
    order: 10,
    titleUz: 'match-case — zamonaviy pattern matching',
    titleEn: 'Structural Pattern Matching (match-case)',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-03-09'],
    conceptId: 'match_case',
    whyUz: "Python 3.10 dan boshlab qo'shilgan `match-case` nafaqat oddiy qiymatlarni, balki tuple, ro'yxat va buyruq strukturalarini (`[\"move\", x, y]`) bir zumda ajratib olish (Structural Pattern Matching) imkonini beradi.",
    whyEn: 'Introduced in Python 3.10, `match-case` goes far beyond C `switch`: it destructures tuples, lists, and commands cleanly.',
    analogyUz: "`match-case` — bu shaklli qolip (sorter): konvert ichidagi narsa aynan qaysi shaklga (`[\"pay\", summa]` yoki `[\"cancel\", id]`) tushsa, o'sha yo'lakka kirib, ichidagi qiymatlarni ham o'zi ochib beradi.",
    analogyEn: '`match-case` is a shape sorter that matches structure AND unpacks inner fields simultaneously.',
    stopsUz: "Python `match-case` da C/Java dagi kabi `break` yozish SHART EMAS — birinchi mos `case` bajarilgach avtomatik chiqib ketadi! Default tarmoq esa `case _:` bilan yoziladi.",
    stopsEn: 'Python `match-case` never falls through between cases—no `break` needed. Use `case _:` as the wildcard fallback.',
    objUz: ['Oddiy `match-case` va `|` (OR pattern) dan foydalanish', 'Wildcard (`case _:`) va `if` guard (`case x if x > 0:`) yozish', 'Sequence/tuple strukturalarini destructuring qilish'],
    objEn: ['Use `match-case`, OR patterns (`|`), and wildcard (`case _:`)', 'Add conditional guards (`case x if ...`)', 'Destructure tuples and command lists cleanly'],
    theoryUz: `### 1. Asosiy \`match-case\` (Python 3.10+)
\`\`\`python
match status:
    case 200 | 201:
        print("Muvaffaqiyat")
    case 404:
        print("Topilmadi")
    case _:
        print("Boshqa status")
\`\`\`
### 2. \`break\` kerak emas!
Birinchi mos \`case\` bajarilishi bilan \`match\` tugaydi.
### 3. Structural Destructuring (Kuchli jihati!)
\`case ["buy", item, qty]:\` — ro‘yxat uzunligi 3 va 1-elementi \`"buy"\` bo‘lsa, \`item\` va \`qty\` ni avtomatik o‘zgaruvchiga oladi!
### 4. Guard sharti (\`case ... if ...\`)
\`case [x, y] if x == y: print("Diagonal")\`
### 5. Keng tarqalgan xato
\`case PI:\` deb nuqtasiz nom yozsangiz, Python uni tekshiriladigan konstanta emas, yangi o‘zgaruvchi deb tushunib **har doim mos keladigan** qilib qo‘yadi!`,
    theoryEn: `### 1. Basic \`match-case\` (Python 3.10+)
Matches literals, OR patterns (\`200 | 201\`), and fallback \`case _:\`.
### 2. No Fall-Through
Only the first matching case runs—never add \`break\`.
### 3. Structural Destructuring
\`case ["move", x, y]:\` matches list shape and binds \`x\` and \`y\` simultaneously.
### 4. Case Guards
\`case n if n > 0:\` adds extra runtime conditions.
### 5. Variable Capture Trap
A bare name \`case target:\` acts as a wildcard capture unless dotted (\`Colors.RED\`).`,
    examples: [
      ex('Misol 1: HTTP status va `|` kombinatsiyasi', 'Example 1: Status Codes & OR Patterns', `def describe_code(code: int) -> str:\n    match code:\n        case 200 | 201:\n            return "Success"\n        case 401 | 403:\n            return "Auth Error"\n        case 404:\n            return "Not Found"\n        case _:\n            return "Unknown"\n\nprint(describe_code(201), "|", describe_code(500))`, `Success | Unknown`, '`|` belgisi bir nechta qiymatni bitta `case` da birlashtiradi.', '`|` combines alternative literals cleanly without fall-through.'),
      ex('Misol 2: Buyruq ro‘yxatini destructuring qilish', 'Example 2: Command Sequence Matching', `def run_cmd(cmd: list):\n    match cmd:\n        case ["ping"]:\n            return "pong"\n        case ["add", a, b]:\n            return a + b\n        case ["greet", name]:\n            return f"Salom, {name}"\n        case _:\n            return "Noma'lum buyruq"\n\nprint(run_cmd(["add", 7, 8]))\nprint(run_cmd(["greet", "Ali"]))`, `15\nSalom, Ali`, '`match-case` ro‘yxat tuzilishini tekshirib, ichidagi qiymatlarni ajratib beradi.', 'Matches list structure and binds variables in one step.'),
      ex('Misol 3: Guard (`if`) bilan koordinata tekshiruvi', 'Example 3: Pattern Matching with Guards', `point = (5, 5)\nmatch point:\n    case (0, 0):\n        print("Markaz")\n    case (x, y) if x == y:\n        print(f"Diagonal: {x}")\n    case (x, y):\n        print(f"Nuqta: {x},{y}")`, `Diagonal: 5`, 'Guard sharti pattern mos kelgandan keyin qo‘shimcha `if` tekshiradi.', 'The `if` guard refines a matched tuple pattern.'),
    ],
    traceTitleUz: 'match-case bajarilish izi',
    traceTitleEn: 'Tracing Structural match-case',
    traceCode: `cmd = ["mul", 3, 4]\nmatch cmd:\n    case ["add", x, y]:\n        res = x + y\n    case ["mul", x, y]:\n        res = x * y\nprint(res)`,
    traceSteps: [
      traceStep(1, 'case ["add", x, y]:', 'No match', '"mul" != "add"', 'First element mismatch'),
      traceStep(2, 'case ["mul", x, y]:', 'x=3, y=4', 'Mos keldi va qiymatlar olindi', 'Matched & unpacked'),
      traceStep(3, 'res = x * y', 'res=12', 'Ko‘paytirildi', 'Computed 12'),
      traceStep(4, 'print(res)', '12', 'Chiqish', 'Output', '12'),
    ],
    commonMistakes: [
      mistake('`case _` ni birinchi yozish', 'Putting Wildcard case _ First', `match x:\n    case _:\n        print("Barcha")\n    case 1:\n        print("Bir")`, 'SyntaxError: wildcard makes remaining patterns unreachable', `match x:\n    case 1:\n        print("Bir")\n    case _:\n        print("Boshqa")`, 'Wildcard `_` doim eng oxirida turishi shart.', 'Wildcard `_` must be the final branch.', 'Default `case _:` ni oxiriga qo‘ying.', 'Always place `case _:` last.'),
      mistake('Nuqtasiz o‘zgaruvchi nomi bilan taqqoslash', 'Bare Variable Name Captures Everything', `target = 10\nmatch 5:\n    case target:  # target=5 qilib yuboradi!\n        print("Captured:", target)`, 'Unintended capture instead of value check', `target = 10\nmatch 5:\n    case x if x == target:\n        print("Matched")\n    case _:\n        print("No match")`, 'Oddiy nom `case` da har doim qiymatni ushlab oluvchi o‘zgaruvchi bo‘ladi.', 'A bare identifier binds any value instead of comparing.', 'Dinamik qiymatni `if x == target:` guardi bilan solishtiring.', 'Compare dynamic variables using `if` guards.'),
    ],
    compareTitleUz: '`if / elif / else` vs `match-case`',
    compareTitleEn: '`if / elif / else` vs `match-case`',
    compareUz: ['`if/elif`: diapazonlar (`score >= 90`) va murakkab mantiq uchun.', '`match-case`: aniq variantlar, CLI buyruqlar, tuple/dict tuzilmalarini ajratish uchun.'],
    compareEn: ['`if/elif`: ranges and numeric inequalities.', '`match-case`: discrete variants, commands, and structural destructuring.'],
    compareSummaryUz: '3-kursni yakunladingiz! 4-kurs — Maʼlumotlar tuzilmalarida ro‘yxat va lug‘atlar bilan yanada chuqur ishlaymiz.',
    compareSummaryEn: 'Course 3 complete! Next up: Course 4 Data Structures.',
    practiceTasks: [
      pt('p0310_1', '1-mashq: Kun nomi', 'Task 1: Weekday Match', '`day = 6` -> 6|7 "Dam olish", qolgani "Ish kuni" chiqaring.', 'Match 6|7 as Dam olish else Ish kuni.', `day = 6\nmatch day:\n    case 6 | 7:\n        print("Dam olish")\n    case _:\n        print("Ish kuni")`, 'Dam olish', '6 | 7.', 'Use | and _.'),
      pt('p0310_2', '2-mashq: Buyruq ochish', 'Task 2: Unpack Command', '`["hi", "Sardor"]` dan `"Salom Sardor"` chiqaring.', 'Match ["hi", name].', `match ["hi", "Sardor"]:\n    case ["hi", name]:\n        print("Salom", name)`, 'Salom Sardor', 'case ["hi", name]:.', 'Bind name.'),
      pt('p0310_3', '3-mashq: Tuple nuqta', 'Task 3: Tuple Guard', '`(0, 5)` da `(0, y)` bo‘lsa `"Y oqi"` chiqaring.', 'Match (0, y) on Y axis.', `match (0, 5):\n    case (0, y):\n        print("Y oqi:", y)`, 'Y oqi: 5', 'case (0, y):.', 'Match 0 in x.'),
      pt('p0310_4', '4-mashq: Guard sharti', 'Task 4: Guard Condition', '`n = -4` da `case x if x < 0: print("Manfiy")` chiqaring.', 'Match negative with guard.', `match -4:\n    case x if x < 0:\n        print("Manfiy")`, 'Manfiy', 'if x < 0.', 'Add guard.'),
      pt('p0310_5', '5-mashq: Ro‘yxat uzunligi', 'Task 5: Empty List Match', 'Bo‘sh `[]` ni match qilib `"Bosh"` chiqaring.', 'Match empty list.', `match []:\n    case []:\n        print("Bosh")`, 'Bosh', 'case []:.', 'Match [].'),
    ],
    quiz: [
      q('q0310_1', '`match-case` Python ning qaysi versiyasidan boshlab qo‘shilgan?', 'Python version introducing `match-case`?', ['3.6', '3.8', '3.10', '2.7'], ['3.6', '3.8', '3.10', '2.7'], 2, 'Python 3.10.', 'Python 3.10.'),
      q('q0310_2', 'Python `match-case` da `break` yozish shartmi?', 'Do you need `break` inside Python `match-case`?', ['Ha', 'Yo‘q, avtomatik chiqadi', 'Faqat default da', 'Faqat raqamlarda'], ['Yes', 'No, never falls through', 'In default only', 'Numbers only'], 1, 'Yo‘q.', 'No fall-through.'),
      q('q0310_3', 'Default holat qanday yoziladi?', 'How is the wildcard default branch written?', ['default:', 'else:', 'case _:', 'otherwise:'], ['default:', 'else:', 'case _:', 'otherwise:'], 2, '`case _:`.', '`case _:`.'),
      q('q0310_4', 'Bir nechta qiymatni bitta `case` da qaysi belgi birlashtiradi?', 'Operator combining multiple patterns in one `case`?', ['and', '|', 'or', '&'], ['and', '|', 'or', '&'], 1, '`|`.', '`|`.'),
      q('q0310_5', '`case _:` qayerda turishi shart?', 'Where must `case _:` be placed?', ['Boshida', 'Eng oxirida', 'O‘rtada', 'Farqi yo‘q'], ['First', 'Last', 'Middle', 'Anywhere'], 1, 'Eng oxirida.', 'At the end.'),
    ],
    homework: hw('Mini CLI Bot Parser', 'CLI Command Dispatcher', '`["help"]`, `["calc", "+", 4, 5]`, `["calc", "*", 3, 7]`, `["quit"]` buyruqlarini `match-case` bilan bajaruvchi parser yozing.', 'Write a command dispatcher handling `help`, `calc` math ops, and `quit` using `match-case`.', ['Strukturali unpacking ishlating', 'Wildcard fallback qo‘shing'], ['Use structural pattern matching', 'Include case _:'], 'case ["calc", "+", a, b]: return a + b', 'Unpack operator and operands.', 'Bo‘lishda `if b != 0` guardini qo‘shing.', 'Add zero-division guard on `/`.', 20),
    reviewCheckpoint: review(
      6,
      '6-Review Loyiha: 3-Kurs Yakuniy Sikllar & Buyruq Dvigateli',
      'Review Project #6: Control Flow Capstone Command Loop',
      '26–30 darslar (`while`, `for`, `enumerate`, `range`, `break/continue`, `match-case`) ni bitta buyruqlar paketini qayta ishlovchi dvigatelga jamlang.',
      'Combine Course 3 (`while`, `for`, `enumerate`, `range`, `break/continue`, `match-case`) into a batch command processor.',
      ['1) Buyruqlar oqimini `for` + `enumerate` bilan o‘qish', '2) Bo‘sh/izoh qatorlarni `continue` bilan o‘tkazish', '3) `match-case` bilan buyruqlarni bajarish va `STOP` da `break`'],
      ['1) Iterate commands with `enumerate`', '2) Skip blanks via `continue`', '3) Dispatch via `match-case` and halt on STOP'],
      `commands = ["", "add 10", "mul 3", "STOP", "add 999"]
total = 0
for step, raw in enumerate(commands, 1):
    if not raw:
        continue
    if raw == "STOP":
        print(f"Step {step}: halted")
        break
    match raw.split():
        case ["add", val]:
            total += int(val)
        case ["mul", val]:
            total *= int(val)
print("Total:", total)`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),
];
