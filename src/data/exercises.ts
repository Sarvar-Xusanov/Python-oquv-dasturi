import type { Exercise } from '../types/domain';

export const EXERCISES: Exercise[] = [
  {
    id: 'EX-001',
    title: { uz: "Salomlashish funksiyasi", en: 'Greeting Function' },
    courseId: 'python_fundamentals',
    topic: { uz: 'Funksiyalar va String', en: 'Functions & Strings' },
    difficulty: 'beginner',
    estimatedMinutes: 10,
    instructions: {
      uz: "`greet(name)` funksiyasini yozing. U `name` nomli matn (string) qabul qilib, `'Salom, <name>!'` ko'rinishida natija qaytarsin (`return`). Agar `name` bo'sh bo'lsa, `'Salom, mehmon!'` qaytarsin.",
      en: "Write a function `greet(name)` that accepts a string `name` and returns `'Salom, <name>!'`. If `name` is empty or whitespace only, return `'Salom, mehmon!'`.",
    },
    constraints: {
      uz: ["Natijani print emas, return bilan qaytaring", "Bo'sh joylarni strip() bilan tozalang"],
      en: ['Use return instead of print', 'Strip leading/trailing whitespace'],
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
    courseId: 'variables_types',
    topic: { uz: "Sonlar va arifmetik amallar", en: 'Numbers & Arithmetic' },
    difficulty: 'beginner',
    estimatedMinutes: 10,
    instructions: {
      uz: "`c_to_f(celsius)` funksiyasini yozing. Formula: `(celsius * 9 / 5) + 32`. Natijani `round(..., 2)` bilan 2 xonagacha yaxlitlab qaytaring.",
      en: 'Write `c_to_f(celsius)` using `(celsius * 9 / 5) + 32`, rounded to 2 decimal places with `round(..., 2)`.',
    },
    constraints: {
      uz: ["Manfiy va o'nlik sonlarni ham to'g'ri hisoblang"],
      en: ['Handle negative numbers and floats accurately'],
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
    estimatedMinutes: 15,
    instructions: {
      uz: "`count_positive_evens(numbers)` funksiyasini yozing. Berilgan `list` ichidagi 0 dan katta va juft (`n > 0 and n % 2 == 0`) sonlar sonini qaytarsin.",
      en: 'Write `count_positive_evens(numbers)` returning the count of integers in the list that are strictly positive (`n > 0`) and even (`n % 2 == 0`).',
    },
    constraints: {
      uz: ["0 musbat son hisoblanmaydi", "Bo'sh ro'yxat uchun 0 qaytaring"],
      en: ['0 is not positive', 'Return 0 for an empty list'],
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
    estimatedMinutes: 15,
    instructions: {
      uz: "`fizzbuzz(n)` funksiyasi 1 dan `n` gacha (shu jumladan) bo'lgan sonlar ro'yxatini qaytarsin: 15 ga bo'linsa `'FizzBuzz'`, 3 ga bo'linsa `'Fizz'`, 5 ga bo'linsa `'Buzz'`, aks holda sonning `str` ko'rinishini qo'shing.",
      en: "Write `fizzbuzz(n)` returning a list of strings from 1 to `n`: `'FizzBuzz'` if divisible by 15, `'Fizz'` if by 3, `'Buzz'` if by 5, otherwise `str(i)`.",
    },
    constraints: {
      uz: ['1 <= n <= 1000', "Ro'yxat elementlari str turida bo'lsin"],
      en: ['1 <= n <= 1000', 'All returned list elements must be strings'],
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
    estimatedMinutes: 15,
    instructions: {
      uz: "`word_freq(text)` funksiyasini yozing. Matndagi barcha so'zlarni kichik harfga o'tkazib (`lower()`), bo'sh joy bo'yicha bo'lib (`split()`), har bir so'z necha marta uchraganini `dict` ko'rinishida qaytaring.",
      en: 'Write `word_freq(text)` that lowercases `text`, splits on whitespace, and returns a dictionary mapping each word to its frequency count.',
    },
    constraints: {
      uz: ["Bo'sh matn uchun {} qaytaring"],
      en: ['Return {} for an empty string'],
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
    estimatedMinutes: 15,
    instructions: {
      uz: "`unique_ordered(items)` funksiyasi ro'yxatdagi takroriy elementlarni olib tashlab, ularning birinchi uchragan tartibini saqlagan holda yangi ro'yxat qaytarsin.",
      en: 'Write `unique_ordered(items)` that removes duplicates from a list while preserving the original order of first appearance.',
    },
    constraints: {
      uz: ["O(n) vaqt murakkabligi uchun set ishlatish tavsiya etiladi"],
      en: ['Use a seen set for O(n) time complexity'],
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
    estimatedMinutes: 12,
    instructions: {
      uz: "`is_palindrome(text)` funksiyasi faqat harf va raqamlarni (`isalnum()`) hisobga olib, katta-kichik harfni e'tiborsiz qoldirib, matn palindrom ekanligini (`True`/`False`) qaytarsin.",
      en: 'Write `is_palindrome(text)` ignoring non-alphanumeric characters and letter case, returning `True` if it reads the same forwards and backwards.',
    },
    constraints: {
      uz: ["Bo'sh matn True qaytaradi"],
      en: ['Empty string returns True'],
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
    estimatedMinutes: 20,
    instructions: {
      uz: "`BankAccount` klassini yarating: `__init__(self, owner, balance=0)`, `deposit(amount)` (faqat musbat bo'lsa qo'shadi va yangi balansni qaytaradi, aks holda `ValueError` chiqaradi), `withdraw(amount)` (balans yetsa ayiradi va yangi balansni qaytaradi, yetmasa `ValueError` chiqaradi).",
      en: 'Create `BankAccount(owner, balance=0)` with `deposit(amount)` (adds if > 0 else raises `ValueError`) and `withdraw(amount)` (subtracts if 0 < amount <= balance else raises `ValueError`), returning updated balance.',
    },
    constraints: {
      uz: ["Manfiy deposit yoki balansdan ortiq yechishda ValueError ko'taring"],
      en: ['Raise ValueError on invalid amounts or insufficient funds'],
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
    courseId: 'files_exceptions',
    topic: { uz: 'try / except / ValueError', en: 'Exception Handling' },
    difficulty: 'beginner',
    estimatedMinutes: 12,
    instructions: {
      uz: "`parse_ints(items)` funksiyasi berilgan `list[str]` elementlarini `int` ga aylantirib ro'yxat qaytarsin. Agar biror element butun songa aylanmasa, `try/except ValueError` yordamida uni tashlab ketsin.",
      en: 'Write `parse_ints(items)` converting valid integer strings in a list to `int`, silently skipping invalid entries using `try/except ValueError`.',
    },
    constraints: {
      uz: ["Bo'sh yoki noto'g'ri satrlar dasturni to'xtatmasligi kerak"],
      en: ['Invalid strings must not crash the function'],
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
    estimatedMinutes: 15,
    instructions: {
      uz: "`fib_gen(limit)` generator funksiyasini `yield` yordamida yozing. U dastlabki `limit` ta Fibonacci sonini (0, 1, 1, 2, 3, ...) ketma-ket ishlab chiqarsin.",
      en: 'Write a generator function `fib_gen(limit)` using `yield` that produces the first `limit` Fibonacci numbers starting with 0, 1, 1, 2, 3...',
    },
    constraints: {
      uz: ["Ro'yxat emas, generator (yield) qaytaring"],
      en: ['Must use yield as a generator'],
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
    estimatedMinutes: 20,
    instructions: {
      uz: "Tartiblangan `nums` ro'yxatidan `target` elementining indeksini `O(log n)` binary search orqali topuvchi `binary_search(nums, target)` funksiyasini yozing. Topilmasa `-1` qaytaring.",
      en: 'Implement `binary_search(nums, target)` in `O(log n)` time on a sorted list. Return the index if found, or `-1` if absent.',
    },
    constraints: {
      uz: ["list.index() dan foydalanmang; two-pointer (left, right) ishlating"],
      en: ['Do not use list.index(); implement left/right binary search'],
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
    estimatedMinutes: 25,
    instructions: {
      uz: "`is_valid_brackets(s)` funksiyasini yozing. `'()'`, `'[]'`, `'{}'` qavslari to'g'ri ochilib yopilgan bo'lsa `True`, aks holda `False` qaytarsin.",
      en: "Write `is_valid_brackets(s)` returning `True` if brackets `'()'`, `'[]'`, `'{}'` are properly matched and balanced, else `False`.",
    },
    constraints: {
      uz: ['Stack (list append/pop) usulidan foydalaning'],
      en: ['Use a stack (list append/pop)'],
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
