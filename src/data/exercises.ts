import type { Exercise } from '../types/domain';

export const EXERCISES: Exercise[] = [
  {
    id: 'EX-001',
    title: { uz: "Salomlashish funksiyasi", en: 'Greeting Function' },
    courseId: 'python_fundamentals',
    topic: { uz: 'Funksiyalar va String', en: 'Functions & Strings' },
    difficulty: 'beginner',
    skillLevel: 'guided',
    estimatedMinutes: 10,
    instructions: {
      uz: "`greet(name)` funksiyasini yozing. U `name` nomli matn (string) qabul qilib, `'Salom, <name>!'` ko'rinishida natija qaytarsin (`return`). Agar `name` bo'sh bo'lsa, `'Salom, mehmon!'` qaytarsin.",
      en: "Write a function `greet(name)` that accepts a string `name` and returns `'Salom, <name>!'`. If `name` is empty or whitespace only, return `'Salom, mehmon!'`.",
    },
    constraints: {
      uz: ["Natijani print emas, return bilan qaytaring", "Bo'sh joylarni strip() bilan tozalang"],
      en: ['Use return instead of print', 'Strip leading/trailing whitespace'],
    },
    progressiveHints: {
      conceptual: {
        uz: "Avval matnning ikki chetidagi bo‘sh joylarni `.strip()` bilan tozalang, so‘ng tozalangan matn bo‘sh (`\"\"`) ekanligini tekshiring.",
        en: 'Trim whitespace with `.strip()` first, then check whether the resulting string is empty.',
      },
      structural: {
        uz: "1) `clean = name.strip()` yozing. 2) `if not clean: return 'Salom, mehmon!'`. 3) Aks holda `f'Salom, {clean}!'` ni qaytaring.",
        en: "1) Store `clean = name.strip()`. 2) Handle `if not clean:`. 3) Return `f'Salom, {clean}!'`.",
      },
      nearSolution: {
        uz: "`clean = name.strip()` dan keyin `return f'Salom, {clean}!' if clean else 'Salom, mehmon!'` strukturasi barcha testlardan o‘tadi.",
        en: "After `clean = name.strip()`, `return f'Salom, {clean}!' if clean else 'Salom, mehmon!'` handles every case.",
      },
    },
    sampleInput: "greet('Aziza')",
    sampleOutput: "'Salom, Aziza!'",
    starterCode: `def greet(name: str) -> str:
    # Kodingizni shu yerga yozing
    pass
`,
    testCases: [
      { id: 't1', label: "greet('Aziza')", callExpression: "greet('Aziza')", expectedOutput: "'Salom, Aziza!'" },
      { id: 't2', label: "greet('  Sardor  ')", callExpression: "greet('  Sardor  ')", expectedOutput: "'Salom, Sardor!'" },
      { id: 't3', label: "greet('')", callExpression: "greet('')", expectedOutput: "'Salom, mehmon!'" },
      { id: 't4', label: 'Hidden whitespace', callExpression: "greet('   ')", expectedOutput: "'Salom, mehmon!'", isHidden: true },
    ],
  },
  {
    id: 'EX-002',
    title: { uz: "Harorat o'girgich (Celsius -> Fahrenheit)", en: 'Temperature Converter' },
    courseId: 'python_fundamentals',
    topic: { uz: "Sonlar va arifmetik amallar", en: 'Numbers & Arithmetic' },
    difficulty: 'beginner',
    skillLevel: 'recognition',
    estimatedMinutes: 10,
    instructions: {
      uz: "`c_to_f(celsius)` funksiyasini yozing. Formula: `(celsius * 9 / 5) + 32`. Natijani `round(..., 2)` bilan 2 xonagacha yaxlitlab qaytaring.",
      en: 'Write `c_to_f(celsius)` using `(celsius * 9 / 5) + 32`, rounded to 2 decimal places with `round(..., 2)`.',
    },
    constraints: {
      uz: ["Manfiy va o'nlik sonlarni ham to'g'ri hisoblang"],
      en: ['Handle negative numbers and floats accurately'],
    },
    progressiveHints: {
      conceptual: {
        uz: "Avval `celsius * 9 / 5 + 32` qiymatini hisoblang va `round(qiymat, 2)` bilan qaytaring.",
        en: 'Compute `(celsius * 9 / 5) + 32` and wrap the result in `round(..., 2)`.',
      },
      structural: {
        uz: "Qavslar tartibiga e’tibor bering: `f_val = (celsius * 9 / 5) + 32` va `return round(f_val, 2)`.",
        en: 'Bind `f_val = (celsius * 9 / 5) + 32`, then `return round(f_val, 2)`.',
      },
      nearSolution: {
        uz: "Bitta qator yetarli: `return round((celsius * 9 / 5) + 32, 2)`.",
        en: 'A clean single return statement: `return round((celsius * 9 / 5) + 32, 2)`.',
      },
    },
    sampleInput: 'c_to_f(25)',
    sampleOutput: '77.0',
    starterCode: `def c_to_f(celsius: float) -> float:
    pass
`,
    testCases: [
      { id: 't1', label: 'c_to_f(0)', callExpression: 'c_to_f(0)', expectedOutput: '32.0' },
      { id: 't2', label: 'c_to_f(25)', callExpression: 'c_to_f(25)', expectedOutput: '77.0' },
      { id: 't3', label: 'c_to_f(-40)', callExpression: 'c_to_f(-40)', expectedOutput: '-40.0' },
      { id: 't4', label: 'Hidden float', callExpression: 'c_to_f(36.6)', expectedOutput: '97.88', isHidden: true },
    ],
  },
  {
    id: 'EX-003',
    title: { uz: 'Juft va musbat sonlarni sanash', en: 'Count Positive Even Numbers' },
    courseId: 'control_flow',
    topic: { uz: 'if/else va for sikllari', en: 'Conditionals & Loops' },
    difficulty: 'beginner',
    skillLevel: 'guided',
    estimatedMinutes: 15,
    instructions: {
      uz: "`count_positive_evens(numbers)` funksiyasini yozing. Berilgan `list` ichidagi 0 dan katta va juft (`n > 0 and n % 2 == 0`) sonlar sonini qaytarsin.",
      en: 'Write `count_positive_evens(numbers)` returning the count of integers in the list that are strictly positive (`n > 0`) and even (`n % 2 == 0`).',
    },
    constraints: {
      uz: ["0 musbat son hisoblanmaydi", "Bo'sh ro'yxat uchun 0 qaytaring"],
      en: ['0 is not positive', 'Return 0 for an empty list'],
    },
    progressiveHints: {
      conceptual: {
        uz: "Sanoqchi (`count = 0`) oching va har bir son uchun ikkala shart (`n > 0` VA `n % 2 == 0`) rostligini tekshiring.",
        en: 'Initialize a counter at 0 and increment only when both `n > 0` and `n % 2 == 0` hold.',
      },
      structural: {
        uz: "`for n in numbers:` ichida `if n > 0 and n % 2 == 0:` shartini tekshiring va `count += 1` qiling.",
        en: 'Inside `for n in numbers:`, check `if n > 0 and n % 2 == 0:` and increment `count`.',
      },
      nearSolution: {
        uz: "`count = 0` -> sikl -> `if n > 0 and n % 2 == 0: count += 1` -> `return count`.",
        en: 'Initialize `count = 0`, loop with the `and` guard, then `return count`.',
      },
    },
    sampleInput: 'count_positive_evens([-4, 0, 2, 3, 8, 10])',
    sampleOutput: '3',
    starterCode: `def count_positive_evens(numbers: list[int]) -> int:
    pass
`,
    testCases: [
      { id: 't1', label: '[-4, 0, 2, 3, 8, 10]', callExpression: 'count_positive_evens([-4, 0, 2, 3, 8, 10])', expectedOutput: '3' },
      { id: 't2', label: '[]', callExpression: 'count_positive_evens([])', expectedOutput: '0' },
      { id: 't3', label: '[1, 3, 5]', callExpression: 'count_positive_evens([1, 3, 5])', expectedOutput: '0' },
      { id: 't4', label: 'Hidden negatives', callExpression: 'count_positive_evens([-2, -6, 4, 12])', expectedOutput: '2', isHidden: true },
    ],
  },
  {
    id: 'EX-004',
    title: { uz: "FizzBuzz klassik masalasi", en: 'FizzBuzz Sequence' },
    courseId: 'control_flow',
    topic: { uz: 'Shart operatorlari va List', en: 'Conditionals & Lists' },
    difficulty: 'beginner',
    skillLevel: 'independent',
    estimatedMinutes: 15,
    instructions: {
      uz: "`fizzbuzz(n)` funksiyasi 1 dan `n` gacha (shu jumladan) bo'lgan sonlar ro'yxatini qaytarsin: 15 ga bo'linsa `'FizzBuzz'`, 3 ga bo'linsa `'Fizz'`, 5 ga bo'linsa `'Buzz'`, aks holda sonning `str` ko'rinishini qo'shing.",
      en: "Write `fizzbuzz(n)` returning a list of strings from 1 to `n`: `'FizzBuzz'` if divisible by 15, `'Fizz'` if by 3, `'Buzz'` if by 5, otherwise `str(i)`.",
    },
    constraints: {
      uz: ['1 <= n <= 1000', "Ro'yxat elementlari str turida bo'lsin"],
      en: ['1 <= n <= 1000', 'All returned list elements must be strings'],
    },
    progressiveHints: {
      conceptual: {
        uz: "15 soni ham 3 ga, ham 5 ga bo‘linadi! Shuning uchun `elif` zanjirida eng avval `15` ni tekshiring.",
        en: '15 is divisible by both 3 and 5, so check `i % 15 == 0` BEFORE checking 3 or 5.',
      },
      structural: {
        uz: "Bo‘sh `result = []` oching, `for i in range(1, n + 1):` ichida `if / elif / elif / else` bilan qo‘shib boring.",
        en: 'Create `result = []`, loop `range(1, n + 1)`, and append strings in `if/elif/elif/else`.',
      },
      nearSolution: {
        uz: "Oxirgi `else` da `result.append(str(i))` yozishni unutmang — aks holda int qo‘shilib qoladi.",
        en: 'Remember `result.append(str(i))` in the `else` branch so all items are strings.',
      },
    },
    sampleInput: 'fizzbuzz(5)',
    sampleOutput: "['1', '2', 'Fizz', '4', 'Buzz']",
    starterCode: `def fizzbuzz(n: int) -> list[str]:
    pass
`,
    testCases: [
      { id: 't1', label: 'fizzbuzz(5)', callExpression: 'fizzbuzz(5)', expectedOutput: "['1', '2', 'Fizz', '4', 'Buzz']" },
      { id: 't2', label: 'fizzbuzz(1)', callExpression: 'fizzbuzz(1)', expectedOutput: "['1']" },
      { id: 't3', label: 'Hidden 15', callExpression: 'fizzbuzz(15)[-1]', expectedOutput: "'FizzBuzz'", isHidden: true },
    ],
  },
  {
    id: 'EX-005',
    title: { uz: "So'zlar chastotasini hisoblash", en: 'Word Frequency Dictionary' },
    courseId: 'data_structures',
    topic: { uz: 'Dictionary va String metodlari', en: 'Dictionaries & Strings' },
    difficulty: 'beginner',
    skillLevel: 'independent',
    estimatedMinutes: 15,
    instructions: {
      uz: "`word_freq(text)` funksiyasini yozing. Matndagi barcha so'zlarni kichik harfga o'tkazib (`lower()`), bo'sh joy bo'yicha bo'lib (`split()`), har bir so'z necha marta uchraganini `dict` ko'rinishida qaytaring.",
      en: 'Write `word_freq(text)` that lowercases `text`, splits on whitespace, and returns a dictionary mapping each word to its frequency count.',
    },
    constraints: {
      uz: ["Bo'sh matn uchun {} qaytaring"],
      en: ['Return {} for an empty string'],
    },
    progressiveHints: {
      conceptual: {
        uz: "`text.lower().split()` barcha so‘zlarni ro‘yxatga ajratadi (bo‘sh matnda `[]` beradi). Har bir so‘zni `counts` lug‘atida sanab boring.",
        en: '`text.lower().split()` splits words cleanly and gives `[]` on whitespace-only text.',
      },
      structural: {
        uz: "`counts: dict[str, int] = {}` yarating va har bir `w` uchun `counts[w] = counts.get(w, 0) + 1` yozing.",
        en: 'Initialize `counts = {}` and update each word with `counts[w] = counts.get(w, 0) + 1`.',
      },
      nearSolution: {
        uz: "4 qator kod: `counts = {}`, `for w in text.lower().split():`, `counts[w] = counts.get(w, 0) + 1`, `return counts`.",
        en: 'Loop over `text.lower().split()`, increment via `counts.get(w, 0) + 1`, and return `counts`.',
      },
    },
    sampleInput: "word_freq('Python zor python kuchli')",
    sampleOutput: "{'python': 2, 'zor': 1, 'kuchli': 1}",
    starterCode: `def word_freq(text: str) -> dict[str, int]:
    pass
`,
    testCases: [
      { id: 't1', label: 'Basic sentence', callExpression: "word_freq('Python zor python kuchli')", expectedOutput: "{'python': 2, 'zor': 1, 'kuchli': 1}" },
      { id: 't2', label: 'Empty text', callExpression: "word_freq('   ')", expectedOutput: '{}' },
      { id: 't3', label: 'Hidden mixed case', callExpression: "word_freq('Code code CODE')", expectedOutput: "{'code': 3}", isHidden: true },
    ],
  },
  {
    id: 'EX-006',
    title: { uz: "Takrorlanmas elementlarni tartibda saqlash", en: 'Unique Elements Preserving Order' },
    courseId: 'data_structures',
    topic: { uz: 'Set va List', en: 'Sets & Lists' },
    difficulty: 'intermediate',
    skillLevel: 'applied',
    estimatedMinutes: 15,
    instructions: {
      uz: "`unique_ordered(items)` funksiyasi ro'yxatdagi takroriy elementlarni olib tashlab, ularning birinchi uchragan tartibini saqlagan holda yangi ro'yxat qaytarsin.",
      en: 'Write `unique_ordered(items)` that removes duplicates from a list while preserving the original order of first appearance.',
    },
    constraints: {
      uz: ["O(n) vaqt murakkabligi uchun set ishlatish tavsiya etiladi"],
      en: ['Use a seen set for O(n) time complexity'],
    },
    progressiveHints: {
      conceptual: {
        uz: "Oddiy `list(set(items))` tartibni buzishi mumkin. Tartibni saqlash uchun ham `seen = set()`, ham `result = []` ishlating.",
        en: '`list(set(items))` does not guarantee order; pair a `seen` set for O(1) lookups with a `result` list.',
      },
      structural: {
        uz: "Har bir `item` uchun `if item not in seen:` bo‘lsa, `seen.add(item)` va `result.append(item)` bajaring.",
        en: 'When `item not in seen`, call both `seen.add(item)` and `result.append(item)`.',
      },
      nearSolution: {
        uz: "Yoki `dict.fromkeys(items)` ham Python 3.7+ da tartibni saqlaydi (`list(dict.fromkeys(items))`).",
        en: 'Alternatively, `return list(dict.fromkeys(items))` preserves insertion order in Python 3.7+.',
      },
    },
    sampleInput: 'unique_ordered([3, 1, 3, 2, 1, 4])',
    sampleOutput: '[3, 1, 2, 4]',
    starterCode: `def unique_ordered(items: list) -> list:
    pass
`,
    testCases: [
      { id: 't1', label: '[3, 1, 3, 2, 1, 4]', callExpression: 'unique_ordered([3, 1, 3, 2, 1, 4])', expectedOutput: '[3, 1, 2, 4]' },
      { id: 't2', label: "['a', 'b', 'a']", callExpression: "unique_ordered(['a', 'b', 'a'])", expectedOutput: "['a', 'b']" },
      { id: 't3', label: 'Hidden empty', callExpression: 'unique_ordered([])', expectedOutput: '[]', isHidden: true },
    ],
  },
  {
    id: 'EX-007',
    title: { uz: "Palindrom tekshiruvchi", en: 'Palindrome Checker' },
    courseId: 'functions',
    topic: { uz: 'Funksiyalar va Slicing', en: 'Functions & Slicing' },
    difficulty: 'beginner',
    skillLevel: 'independent',
    estimatedMinutes: 12,
    instructions: {
      uz: "`is_palindrome(text)` funksiyasi faqat harf va raqamlarni (`isalnum()`) hisobga olib, katta-kichik harfni e'tiborsiz qoldirib, matn palindrom ekanligini (`True`/`False`) qaytarsin.",
      en: 'Write `is_palindrome(text)` ignoring non-alphanumeric characters and letter case, returning `True` if it reads the same forwards and backwards.',
    },
    constraints: {
      uz: ["Bo'sh matn True qaytaradi"],
      en: ['Empty string returns True'],
    },
    progressiveHints: {
      conceptual: {
        uz: "Avval matndan faqat harf va raqamlarni (`ch.isalnum()`) kichik harfga o‘tkazib yangi `cleaned` matn yig‘ing.",
        en: 'Filter out punctuation using `ch.isalnum()` and lowercase each kept character.',
      },
      structural: {
        uz: "`cleaned = ''.join(ch.lower() for ch in text if ch.isalnum())` so‘ng `cleaned == cleaned[::-1]` ni qaytaring.",
        en: "Build `cleaned = ''.join(ch.lower() for ch in text if ch.isalnum())`, then compare with its reverse `[::-1]`.",
      },
      nearSolution: {
        uz: "`return cleaned == cleaned[::-1]` bo‘sh matn uchun ham `'' == ''` -> `True` qaytaradi.",
        en: '`return cleaned == cleaned[::-1]` also satisfies the empty string constraint automatically.',
      },
    },
    sampleInput: "is_palindrome('A man, a plan, a canal: Panama')",
    sampleOutput: 'True',
    starterCode: `def is_palindrome(text: str) -> bool:
    pass
`,
    testCases: [
      { id: 't1', label: 'Panama phrase', callExpression: "is_palindrome('A man, a plan, a canal: Panama')", expectedOutput: 'True' },
      { id: 't2', label: 'python', callExpression: "is_palindrome('python')", expectedOutput: 'False' },
      { id: 't3', label: 'Hidden radar', callExpression: "is_palindrome('Radar')", expectedOutput: 'True', isHidden: true },
    ],
  },
  {
    id: 'EX-008',
    title: { uz: 'BankHisobi (BankAccount) klassi', en: 'BankAccount OOP Class' },
    courseId: 'oop',
    topic: { uz: 'Classes, Methods, Encapsulation', en: 'Classes & Encapsulation' },
    difficulty: 'intermediate',
    skillLevel: 'applied',
    estimatedMinutes: 20,
    instructions: {
      uz: "`BankAccount` klassini yarating: `__init__(self, owner, balance=0)`, `deposit(amount)` (faqat musbat bo'lsa qo'shadi va yangi balansni qaytaradi, aks holda `ValueError` chiqaradi), `withdraw(amount)` (balans yetsa ayiradi va yangi balansni qaytaradi, yetmasa `ValueError` chiqaradi).",
      en: 'Create `BankAccount(owner, balance=0)` with `deposit(amount)` (adds if > 0 else raises `ValueError`) and `withdraw(amount)` (subtracts if 0 < amount <= balance else raises `ValueError`), returning updated balance.',
    },
    constraints: {
      uz: ["Manfiy deposit yoki balansdan ortiq yechishda ValueError ko'taring"],
      en: ['Raise ValueError on invalid amounts or insufficient funds'],
    },
    progressiveHints: {
      conceptual: {
        uz: "`__init__` da `self.owner = owner` va `self.balance = balance` ni saqlang. `deposit` va `withdraw` da avval noto‘g‘ri miqdorni tekshirib `raise ValueError(...)` qiling.",
        en: 'Store `self.owner` and `self.balance` in `__init__`. Guard both methods with `if ...: raise ValueError(...)`.',
      },
      structural: {
        uz: "`deposit` da: `if amount <= 0: raise ValueError(...)`, keyin `self.balance += amount; return self.balance`. `withdraw` da: `if amount <= 0 or amount > self.balance: raise ValueError(...)`.",
        en: 'In `deposit`, reject `amount <= 0`. In `withdraw`, reject `amount <= 0 or amount > self.balance`. Return `self.balance` in both.',
      },
      nearSolution: {
        uz: "Har ikkala metod oxirida `return self.balance` borligini tekshiring — testlar yangi balans qaytishini kutadi.",
        en: 'Ensure both `deposit` and `withdraw` end with `return self.balance`.',
      },
    },
    sampleInput: 'acc = BankAccount("Ali", 100); acc.deposit(50)',
    sampleOutput: '150',
    starterCode: `class BankAccount:
    def __init__(self, owner: str, balance: float = 0) -> None:
        pass

    def deposit(self, amount: float) -> float:
        pass

    def withdraw(self, amount: float) -> float:
        pass
`,
    testCases: [
      { id: 't1', label: 'Deposit & withdraw', callExpression: '(lambda a: (a.deposit(50), a.withdraw(30)))(BankAccount("Ali", 100))', expectedOutput: '(150, 120)' },
      { id: 't2', label: 'Overdraft raises ValueError', callExpression: 'BankAccount("Ali", 10).withdraw(50)', expectedOutput: '', expectedError: 'ValueError' },
      { id: 't3', label: 'Owner attribute', callExpression: 'BankAccount("Madina", 200).owner', expectedOutput: "'Madina'", isHidden: true },
    ],
  },
  {
    id: 'EX-009',
    title: { uz: "Xavfsiz butun son o'qish (Exceptions)", en: 'Safe Integer Parser' },
    courseId: 'errors_testing',
    topic: { uz: 'try / except / ValueError', en: 'Exception Handling' },
    difficulty: 'beginner',
    skillLevel: 'guided',
    estimatedMinutes: 12,
    instructions: {
      uz: "`parse_ints(items)` funksiyasi berilgan `list[str]` elementlarini `int` ga aylantirib ro'yxat qaytarsin. Agar biror element butun songa aylanmasa, `try/except ValueError` yordamida uni tashlab ketsin.",
      en: 'Write `parse_ints(items)` converting valid integer strings in a list to `int`, silently skipping invalid entries using `try/except ValueError`.',
    },
    constraints: {
      uz: ["Bo'sh yoki noto'g'ri satrlar dasturni to'xtatmasligi kerak"],
      en: ['Invalid strings must not crash the function'],
    },
    progressiveHints: {
      conceptual: {
        uz: "Har bir `s` elementini `int(s)` qilishni `try:` bloki ichiga oling; agar `ValueError` chiqsa `except ValueError: continue` qiling.",
        en: 'Wrap `int(item)` inside `try:` and skip invalid items in `except ValueError:`.',
      },
      structural: {
        uz: "`res = []` -> `for s in items:` -> `try: res.append(int(s))` -> `except ValueError: pass` -> `return res`.",
        en: 'Initialize `res = []`, iterate `items`, try `res.append(int(s))`, catch `ValueError`, then return `res`.',
      },
      nearSolution: {
        uz: "`'3.14'` ham `int('3.14')` da `ValueError` beradi — `try/except` uni avtomatik tashlab ketadi.",
        en: "`int('3.14')` raises `ValueError`, which `except ValueError:` skips cleanly.",
      },
    },
    sampleInput: "parse_ints(['10', 'abc', '-5', '3.14', '42'])",
    sampleOutput: '[10, -5, 42]',
    starterCode: `def parse_ints(items: list[str]) -> list[int]:
    pass
`,
    testCases: [
      { id: 't1', label: 'Mixed strings', callExpression: "parse_ints(['10', 'abc', '-5', '3.14', '42'])", expectedOutput: '[10, -5, 42]' },
      { id: 't2', label: 'All invalid', callExpression: "parse_ints(['x', 'y'])", expectedOutput: '[]' },
      { id: 't3', label: 'Hidden valid', callExpression: "parse_ints(['0', '99'])", expectedOutput: '[0, 99]', isHidden: true },
    ],
  },
  {
    id: 'EX-010',
    title: { uz: 'Fibonacci generatori (yield)', en: 'Fibonacci Generator' },
    courseId: 'advanced_python',
    topic: { uz: 'Generators & Iterators', en: 'Generators' },
    difficulty: 'intermediate',
    skillLevel: 'independent',
    estimatedMinutes: 15,
    instructions: {
      uz: "`fib_gen(limit)` generator funksiyasini `yield` yordamida yozing. U dastlabki `limit` ta Fibonacci sonini (0, 1, 1, 2, 3, ...) ketma-ket ishlab chiqarsin.",
      en: 'Write a generator function `fib_gen(limit)` using `yield` that produces the first `limit` Fibonacci numbers starting with 0, 1, 1, 2, 3...',
    },
    constraints: {
      uz: ["Ro'yxat emas, generator (yield) qaytaring"],
      en: ['Must use yield as a generator'],
    },
    progressiveHints: {
      conceptual: {
        uz: "`a, b = 0, 1` bilan boshlang va `limit` marta sikl aylantirib har safar `yield a` qiling, so‘ng `a, b = b, a + b` yangilang.",
        en: 'Start with `a, b = 0, 1`, loop `limit` times, `yield a`, and advance `a, b = b, a + b`.',
      },
      structural: {
        uz: "`for _ in range(limit):` ichida `yield a` va keyingi qatorda `a, b = b, a + b` yozing. `return []` yozmang!",
        en: 'Use `for _ in range(limit): yield a; a, b = b, a + b`. Do not return a list.',
      },
      nearSolution: {
        uz: "`limit <= 0` bo‘lsa `range(limit)` bo‘sh bo‘lib generator 0 ta element beradi (`list(...) == []`).",
        en: 'When `limit == 0`, `range(0)` executes zero times and `list(fib_gen(0))` yields `[]`.',
      },
    },
    sampleInput: 'list(fib_gen(6))',
    sampleOutput: '[0, 1, 1, 2, 3, 5]',
    starterCode: `def fib_gen(limit: int):
    pass
`,
    testCases: [
      { id: 't1', label: 'list(fib_gen(6))', callExpression: 'list(fib_gen(6))', expectedOutput: '[0, 1, 1, 2, 3, 5]' },
      { id: 't2', label: 'list(fib_gen(0))', callExpression: 'list(fib_gen(0))', expectedOutput: '[]' },
      { id: 't3', label: 'Hidden fib_gen(8)', callExpression: 'list(fib_gen(8))', expectedOutput: '[0, 1, 1, 2, 3, 5, 8, 13]', isHidden: true },
    ],
  },
  {
    id: 'EX-011',
    title: { uz: 'Binary Search algoritmi', en: 'Binary Search' },
    courseId: 'algorithms',
    topic: { uz: 'O(log n) qidiruv', en: 'Searching Algorithms' },
    difficulty: 'intermediate',
    skillLevel: 'applied',
    estimatedMinutes: 20,
    instructions: {
      uz: "Tartiblangan `nums` ro'yxatidan `target` elementining indeksini `O(log n)` binary search orqali topuvchi `binary_search(nums, target)` funksiyasini yozing. Topilmasa `-1` qaytaring.",
      en: 'Implement `binary_search(nums, target)` in `O(log n)` time on a sorted list. Return the index if found, or `-1` if absent.',
    },
    constraints: {
      uz: ["list.index() dan foydalanmang; two-pointer (left, right) ishlating"],
      en: ['Do not use list.index(); implement left/right binary search'],
    },
    progressiveHints: {
      conceptual: {
        uz: "`left = 0` va `right = len(nums) - 1` pointerlaridan foydalaning. Har qadamda o‘rta indeks `mid = (left + right) // 2` ni tekshirib yarim oraliqni qisqartiring.",
        en: 'Track `left = 0` and `right = len(nums) - 1`. Compare `nums[mid]` with `target` and discard half the search space.',
      },
      structural: {
        uz: "`while left <= right:` ichida `mid = (left + right) // 2`. Agar `nums[mid] == target`: `return mid`; `< target`: `left = mid + 1`; aks holda: `right = mid - 1`.",
        en: 'Loop `while left <= right:`; if `nums[mid] < target` set `left = mid + 1`, else `right = mid - 1`.',
      },
      nearSolution: {
        uz: "Sikl tugasa element yo‘q — oxirida `return -1` yozing.",
        en: 'If the loop finishes without a match, `return -1`.',
      },
    },
    sampleInput: 'binary_search([1, 3, 5, 7, 9, 11], 7)',
    sampleOutput: '3',
    starterCode: `def binary_search(nums: list[int], target: int) -> int:
    pass
`,
    testCases: [
      { id: 't1', label: 'Found middle', callExpression: 'binary_search([1, 3, 5, 7, 9, 11], 7)', expectedOutput: '3' },
      { id: 't2', label: 'Not found', callExpression: 'binary_search([1, 3, 5, 7, 9], 4)', expectedOutput: '-1' },
      { id: 't3', label: 'Hidden empty', callExpression: 'binary_search([], 10)', expectedOutput: '-1', isHidden: true },
      { id: 't4', label: 'Hidden first element', callExpression: 'binary_search([2, 4, 6, 8], 2)', expectedOutput: '0', isHidden: true },
    ],
  },
  {
    id: 'EX-012',
    title: { uz: 'Valid Parentheses (Stack)', en: 'Valid Parentheses with Stack' },
    courseId: 'algorithms',
    topic: { uz: 'Stack maʼlumotlar tuzilmasi', en: 'Stack Data Structure' },
    difficulty: 'advanced',
    skillLevel: 'challenge',
    estimatedMinutes: 25,
    instructions: {
      uz: "`is_valid_brackets(s)` funksiyasini yozing. `'()'`, `'[]'`, `'{}'` qavslari to'g'ri ochilib yopilgan bo'lsa `True`, aks holda `False` qaytarsin.",
      en: "Write `is_valid_brackets(s)` returning `True` if brackets `'()'`, `'[]'`, `'{}'` are properly matched and balanced, else `False`.",
    },
    constraints: {
      uz: ['Stack (list append/pop) usulidan foydalaning'],
      en: ['Use a stack (list append/pop)'],
    },
    progressiveHints: {
      conceptual: {
        uz: "Ochiluvchi qavs kelganda uni `stack` ga qo‘shing. Yopiluvchi qavs kelganda `stack` ning eng oxiridagi qavs unga mos juft ekanligini tekshiring.",
        en: 'Push opening brackets onto a stack. On a closing bracket, verify the stack is non-empty and its top matches.',
      },
      structural: {
        uz: "`pairs = {')': '(', ']': '[', '}': '{'}` lug‘atini tuzing. Agar `ch` `pairs` kalitida bo‘lsa: `if not stack or stack.pop() != pairs[ch]: return False`.",
        en: "Use `pairs = {')': '(', ']': '[', '}': '{'}`. Pop and compare whenever a closing bracket appears.",
      },
      nearSolution: {
        uz: "Sikl oxirida `return len(stack) == 0` qaytaring — shunda `'((('` kabi ochiq qolgan qavslar `False` beradi!",
        en: "Return `len(stack) == 0` at the end so unclosed brackets like `'((('` return `False`.",
      },
    },
    sampleInput: "is_valid_brackets('{[()]}')",
    sampleOutput: 'True',
    starterCode: `def is_valid_brackets(s: str) -> bool:
    pass
`,
    testCases: [
      { id: 't1', label: "'{[()]}'", callExpression: "is_valid_brackets('{[()]}')", expectedOutput: 'True' },
      { id: 't2', label: "'([)]'", callExpression: "is_valid_brackets('([)]')", expectedOutput: 'False' },
      { id: 't3', label: "Hidden '((('", callExpression: "is_valid_brackets('(((')", expectedOutput: 'False', isHidden: true },
      { id: 't4', label: "Hidden ''", callExpression: "is_valid_brackets('')", expectedOutput: 'True', isHidden: true },
    ],
  },
];
