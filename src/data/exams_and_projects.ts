import type {
  AchievementDefinition,
  Examination,
  GlossaryTerm,
  LearningProject,
  LocalizedText,
  VideoResource,
} from '../types/domain';

export const DIAGNOSTIC_EXAM: Examination = {
  id: 'EXAM-DIAGNOSTIC',
  title: { uz: "Boshlang'ich darajani aniqlash testi", en: 'Placement Diagnostic Test' },
  description: {
    uz: "Sizning hozirgi Python bilimingizni baholab, mos o'quv yo'lini tavsiya qiladi.",
    en: 'Evaluates your current Python level to personalize your learning path.',
  },
  difficulty: 'beginner',
  durationMinutes: 10,
  passingScore: 60,
  relatedCourseId: 'python_fundamentals',
  questions: [
    {
      id: 'd1',
      type: 'output_prediction',
      conceptId: 'python_fundamentals',
      prompt: {
        uz: "Quyidagi Python kodi ekranga nima chiqaradi?",
        en: 'What does the following Python code output?',
      },
      codeSnippet: `x = "5"\ny = 3\nprint(x * y)`,
      options: {
        uz: ['15', '555', 'TypeError', '53'],
        en: ['15', '555', 'TypeError', '53'],
      },
      correctIndex: 1,
      explanation: {
        uz: "String (`'5'`) ni integer (`3`) ga ko'paytirish matnni 3 marta takrorlaydi: `'555'`.",
        en: "Multiplying a string (`'5'`) by an integer (`3`) repeats the string 3 times: `'555'`.",
      },
    },
    {
      id: 'd2',
      type: 'multiple_choice',
      conceptId: 'control_flow',
      prompt: {
        uz: "Python'da `range(2, 10, 3)` qaysi sonlarni hosil qiladi?",
        en: 'Which numbers does `range(2, 10, 3)` generate in Python?',
      },
      options: {
        uz: ['2, 5, 8', '2, 5, 8, 10', '3, 6, 9', '2, 3, 10'],
        en: ['2, 5, 8', '2, 5, 8, 10', '3, 6, 9', '2, 3, 10'],
      },
      correctIndex: 0,
      explanation: {
        uz: "2 dan boshlab 3 qadam bilan 10 gacha (10 kirmaydi): 2, 5, 8.",
        en: 'Starts at 2, steps by 3, stops before 10: 2, 5, 8.',
      },
    },
    {
      id: 'd3',
      type: 'true_false',
      conceptId: 'data_structures',
      prompt: {
        uz: "Python'dagi `tuple` yaratilgandan keyin uning elementlarini o'zgartirib (mutable) bo'ladi.",
        en: 'A Python `tuple` is mutable and its elements can be modified after creation.',
      },
      options: {
        uz: ["To'g'ri (True)", "Noto'g'ri (False)"],
        en: ['True', 'False'],
      },
      correctIndex: 1,
      explanation: {
        uz: "`tuple` o'zgarmas (immutable) ma'lumot tuzilmasi hisoblanadi.",
        en: 'A `tuple` is an immutable sequence in Python.',
      },
    },
    {
      id: 'd4',
      type: 'debugging',
      conceptId: 'functions',
      prompt: {
        uz: "Quyidagi funksiyada qanday xatolik bor?",
        en: 'What is the bug in this function?',
      },
      codeSnippet: `def add_item(item, bucket=[]):\n    bucket.append(item)\n    return bucket`,
      options: {
        uz: [
          'SyntaxError beradi',
          "Mutable default argument (`[]`) barcha chaqiruvlar orasida saqlanib qoladi",
          'return ishlamaydi',
          'Hech qanday muammo yo‘q',
        ],
        en: [
          'Raises a SyntaxError',
          'Mutable default argument (`[]`) is shared across function calls',
          'return does not work',
          'There is no bug',
        ],
      },
      correctIndex: 1,
      explanation: {
        uz: "Default qiymat sifatida `None` ishlatib, funksiya ichida `if bucket is None: bucket = []` qilish kerak.",
        en: 'Use `bucket=None` and initialize `bucket = []` inside the function body.',
      },
    },
    {
      id: 'd5',
      type: 'multiple_choice',
      conceptId: 'oop',
      prompt: {
        uz: "OOP'da `__init__` metodining vazifasi nima?",
        en: 'What is the role of `__init__` in Python OOP?',
      },
      options: {
        uz: [
          'Klassni xotiradan o‘chiradi',
          'Yangi obyekt yaratilganda boshlang‘ich atributlarni sozlaydi',
          'Faqat meros olishda ishlaydi',
          'Fayllarni yopadi',
        ],
        en: [
          'Deletes the class from memory',
          'Initializes instance attributes when a new object is created',
          'Only runs during inheritance',
          'Closes open files',
        ],
      },
      correctIndex: 1,
      explanation: {
        uz: "`__init__` constructor (initializer) metodi bo'lib, yangi instance yaratilganda avtomatik chaqiriladi.",
        en: '`__init__` is the initializer called automatically when a new instance is created.',
      },
    },
  ],
};

export const EXAMINATIONS: Examination[] = [
  {
    id: 'EXAM-01',
    title: { uz: '1-Bosqich Imtihoni: Python Asoslari', en: 'Checkpoint 1: Python Foundations' },
    description: {
      uz: "O'zgaruvchilar, ma'lumot turlari, shart operatorlari va sikllar bo'yicha nazorat imtihoni.",
      en: 'Assessment covering variables, data types, conditionals, and loops.',
    },
    difficulty: 'beginner',
    durationMinutes: 15,
    passingScore: 70,
    relatedCourseId: 'control_flow',
    questions: [
      {
        id: 'e1_q1',
        type: 'output_prediction',
        conceptId: 'python_fundamentals',
        prompt: { uz: 'Natija nima bo‘ladi?', en: 'What is the output?' },
        codeSnippet: `a = 17\nb = 5\nprint(a // b, a % b)`,
        options: {
          uz: ['3.4 2', '3 2', '3 3', '4 2'],
          en: ['3.4 2', '3 2', '3 3', '4 2'],
        },
        correctIndex: 1,
        explanation: {
          uz: "`//` butun bo'lish (floor division) -> 3, `%` qoldiq (modulo) -> 2.",
          en: '`//` performs floor division (3) and `%` returns the remainder (2).',
        },
      },
      {
        id: 'e1_q2',
        type: 'multiple_choice',
        conceptId: 'control_flow',
        prompt: {
          uz: "`while` siklida hozirgi iteratsiyani o'tkazib yuborib, keyingi qadamga o'tish uchun qaysi kalit so'z ishlatiladi?",
          en: 'Which keyword skips the rest of the current loop iteration and jumps to the next one?',
        },
        options: {
          uz: ['break', 'pass', 'continue', 'skip'],
          en: ['break', 'pass', 'continue', 'skip'],
        },
        correctIndex: 2,
        explanation: {
          uz: "`continue` keyingi iteratsiyaga o'tadi, `break` siklni butunlay to'xtatadi.",
          en: '`continue` moves to the next iteration, while `break` exits the loop.',
        },
      },
      {
        id: 'e1_q3',
        type: 'output_prediction',
        conceptId: 'control_flow',
        prompt: { uz: 'Ekranga nima chiqadi?', en: 'What does this print?' },
        codeSnippet: `total = 0\nfor i in range(1, 6):\n    if i % 2 == 0:\n        total += i\nprint(total)`,
        options: {
          uz: ['6', '9', '15', '4'],
          en: ['6', '9', '15', '4'],
        },
        correctIndex: 0,
        explanation: {
          uz: '1 dan 5 gacha juft sonlar 2 va 4: 2 + 4 = 6.',
          en: 'Even numbers from 1 to 5 are 2 and 4: 2 + 4 = 6.',
        },
      },
      {
        id: 'e1_q4',
        type: 'true_false',
        conceptId: 'python_fundamentals',
        prompt: {
          uz: "Python'da `bool(\"\")` (bo'sh string) qiymati `False` ga teng.",
          en: 'In Python, `bool("")` (empty string) evaluates to `False`.',
        },
        options: {
          uz: ["To'g'ri (True)", "Noto'g'ri (False)"],
          en: ['True', 'False'],
        },
        correctIndex: 0,
        explanation: {
          uz: "Bo'sh string, bo'sh list `[]`, `0` va `None` Python'da falsy qiymatlardir.",
          en: 'Empty strings, empty containers, `0`, and `None` are falsy in Python.',
        },
      },
      {
        id: 'e1_q5',
        type: 'debugging',
        conceptId: 'control_flow',
        prompt: {
          uz: "Quyidagi kod nima uchun xato beradi?",
          en: 'Why does this code raise an error?',
        },
        codeSnippet: `age = input("Yosh: ")\nif age >= 18:\n    print("Kirish mumkin")`,
        options: {
          uz: [
            'input() doim str qaytaradi, int bilan >= taqqoslab bo‘lmaydi',
            'if qatorida : yetishmayapti',
            'age o‘zgaruvchisi noto‘g‘ri nomlangan',
            'print() sintaksisi xato',
          ],
          en: [
            'input() always returns a str, which cannot be compared with >= against an int',
            'Missing colon in if statement',
            'Invalid variable name',
            'Invalid print() syntax',
          ],
        },
        correctIndex: 0,
        explanation: {
          uz: '`int(input("Yosh: "))` ko‘rinishida turini aylantirish (type casting) zarur.',
          en: 'Convert the input using `int(input("Yosh: "))` before numeric comparison.',
        },
      },
    ],
  },
  {
    id: 'EXAM-02',
    title: {
      uz: "2-Bosqich Imtihoni: Ma'lumot tuzilmalari va Funksiyalar",
      en: 'Checkpoint 2: Data Structures & Functions',
    },
    description: {
      uz: 'List, Dict, Set, Comprehension, Scope, Lambda va OOP asoslari.',
      en: 'Covers lists, dicts, sets, comprehensions, scope, lambda, and OOP basics.',
    },
    difficulty: 'intermediate',
    durationMinutes: 20,
    passingScore: 70,
    relatedCourseId: 'data_structures',
    questions: [
      {
        id: 'e2_q1',
        type: 'output_prediction',
        conceptId: 'data_structures',
        prompt: { uz: 'Kod natijasi qanday bo‘ladi?', en: 'What is the output?' },
        codeSnippet: `nums = [1, 2, 3, 4]\nsquares = [x * x for x in nums if x % 2 == 1]\nprint(squares)`,
        options: {
          uz: ['[1, 4, 9, 16]', '[1, 9]', '[4, 16]', '[1, 3]'],
          en: ['[1, 4, 9, 16]', '[1, 9]', '[4, 16]', '[1, 3]'],
        },
        correctIndex: 1,
        explanation: {
          uz: 'Faqat toq sonlar (1 va 3) tanlanib, kvadratga oshiriladi: [1, 9].',
          en: 'Only odd numbers (1 and 3) are squared: [1, 9].',
        },
      },
      {
        id: 'e2_q2',
        type: 'multiple_choice',
        conceptId: 'data_structures',
        prompt: {
          uz: "Dictionary'dan kalit topilmaganda KeyError bermasdan default qiymat olish uchun qaysi metod ishlatiladi?",
          en: 'Which dictionary method returns a default value instead of raising KeyError when a key is missing?',
        },
        options: {
          uz: ['dict.find()', 'dict.get()', 'dict.fetch()', 'dict.lookup()'],
          en: ['dict.find()', 'dict.get()', 'dict.fetch()', 'dict.lookup()'],
        },
        correctIndex: 1,
        explanation: {
          uz: "`d.get('key', default)` kalit mavjud bo'lmasa `default` (yoki `None`) qaytaradi.",
          en: "`d.get('key', default)` safely returns the fallback without raising KeyError.",
        },
      },
      {
        id: 'e2_q3',
        type: 'output_prediction',
        conceptId: 'functions',
        prompt: { uz: 'Natija nima bo‘ladi?', en: 'What is printed?' },
        codeSnippet: `def calc(a, b=2, *args):\n    return a + b + sum(args)\n\nprint(calc(3, 4, 5, 6))`,
        options: {
          uz: ['7', '18', '16', 'TypeError'],
          en: ['7', '18', '16', 'TypeError'],
        },
        correctIndex: 1,
        explanation: {
          uz: 'a=3, b=4, args=(5, 6). Jami: 3 + 4 + 11 = 18.',
          en: 'a=3, b=4, args=(5, 6). Sum: 3 + 4 + 11 = 18.',
        },
      },
      {
        id: 'e2_q4',
        type: 'multiple_choice',
        conceptId: 'oop',
        prompt: {
          uz: "Merosxo'rlikda (Inheritance) ota klass metodini chaqirish uchun nima ishlatiladi?",
          en: 'Which built-in function calls a method from the parent class in OOP inheritance?',
        },
        options: {
          uz: ['parent()', 'base()', 'super()', 'inherit()'],
          en: ['parent()', 'base()', 'super()', 'inherit()'],
        },
        correctIndex: 2,
        explanation: {
          uz: '`super()` ota klass (MRO bo‘yicha keyingi klass) metodlariga murojaat qiladi.',
          en: '`super()` delegates calls to the parent class following MRO.',
        },
      },
    ],
  },
  {
    id: 'EXAM-03',
    title: {
      uz: '3-Bosqich Imtihoni: Professional Python, Algoritmlar va Backend',
      en: 'Checkpoint 3: Advanced Python, Algorithms & Backend',
    },
    description: {
      uz: 'Dekoratorlar, generatorlar, Big O murakkabligi, SQL va REST API tamoyillari.',
      en: 'Tests decorators, generators, Big O complexity, SQL, and REST API fundamentals.',
    },
    difficulty: 'advanced',
    durationMinutes: 25,
    passingScore: 70,
    relatedCourseId: 'algorithms',
    questions: [
      {
        id: 'e3_q1',
        type: 'multiple_choice',
        conceptId: 'algorithms',
        prompt: {
          uz: "Hash table (Python `dict`) da kalit bo'yicha qidiruvning o'rtacha vaqt murakkabligi qanday?",
          en: 'What is the average-case time complexity of key lookup in a Python `dict`?',
        },
        options: {
          uz: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          en: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        },
        correctIndex: 0,
        explanation: {
          uz: 'Python `dict` hash table asosida ishlaydi, shuning uchun o‘rtacha qidiruv O(1).',
          en: 'Python dicts are hash tables with average O(1) lookup time.',
        },
      },
      {
        id: 'e3_q2',
        type: 'multiple_choice',
        conceptId: 'advanced_python',
        prompt: {
          uz: "Katta fayllarni xotirani to'ldirmasdan qatorma-qator o'qish uchun qaysi yondashuv eng samarali?",
          en: 'Which approach reads large datasets lazily without loading everything into RAM?',
        },
        options: {
          uz: ['List comprehension [...]', 'Generator / yield', 'Tuple unpacking', 'Global variable'],
          en: ['List comprehension [...]', 'Generator / yield', 'Tuple unpacking', 'Global variable'],
        },
        correctIndex: 1,
        explanation: {
          uz: 'Generatorlar elementlarni talab qilinganda (lazy) bittadan ishlab chiqaradi.',
          en: 'Generators yield items lazily one at a time, keeping memory usage O(1).',
        },
      },
      {
        id: 'e3_q3',
        type: 'multiple_choice',
        conceptId: 'databases',
        prompt: {
          uz: "SQL so'rovlarida foydalanuvchi kiritgan ma'lumotni to'g'ridan-to'g'ri stringga qo'shmasdan himoyalashning to'g'ri usuli qaysi?",
          en: 'What is the safe way to pass user input into SQL queries?',
        },
        options: {
          uz: [
            'f-string bilan birlashtirish',
            'Parameterized queries (placeholders ? / :param)',
            'Base64 kodlash',
            'eval() ishlatish',
          ],
          en: [
            'String interpolation with f-strings',
            'Parameterized queries with bound placeholders',
            'Base64 encoding',
            'Using eval()',
          ],
        },
        correctIndex: 1,
        explanation: {
          uz: 'Parameterized queries SQL injection hujumlarining oldini oladi.',
          en: 'Parameterized queries separate SQL structure from untrusted data, preventing SQL injection.',
        },
      },
      {
        id: 'e3_q4',
        type: 'true_false',
        conceptId: 'advanced_python',
        prompt: {
          uz: "`asyncio` I/O-bound vazifalar (masalan, tarmoq so'rovlari) uchun juda samarali, CPU-bound hisoblashlar uchun esa `multiprocessing` afzal.",
          en: '`asyncio` excels at I/O-bound concurrency, whereas CPU-bound tasks benefit from `multiprocessing`.',
        },
        options: {
          uz: ["To'g'ri (True)", "Noto'g'ri (False)"],
          en: ['True', 'False'],
        },
        correctIndex: 0,
        explanation: {
          uz: 'GIL tufayli CPU-bound parallelizm multiprocessing orqali, tarmoq kutishlari esa asyncio orqali tezlashadi.',
          en: 'Asyncio yields during I/O waits, while multiprocessing bypasses the GIL for CPU parallelism.',
        },
      },
    ],
  },
];

export const PROJECTS: LearningProject[] = [
  {
    id: 'PRJ-01',
    title: { uz: 'CLI Xarajatlar Nazoratchisi', en: 'CLI Personal Expense Tracker' },
    difficulty: 'beginner',
    estimatedHours: 4,
    summary: {
      uz: "Kundalik xarajatlarni kategoriyalar bo'yicha kiritish, sarhisob qilish va hisobot chiqarish dasturi.",
      en: 'A terminal-based application to log, categorize, and summarize daily expenses.',
    },
    problemStatement: {
      uz: "Foydalanuvchi o'z xarajatlarini (sana, kategoriya, summa, izoh) saqlab boradigan va oylik umumiy hamda kategoriya kesimidagi hisobotni ko'ra oladigan ishonchli Python dasturi yarating.",
      en: 'Build a reliable Python program that tracks expense records (date, category, amount, note) and generates category summaries.',
    },
    requirements: {
      uz: [
        'Expense qo‘shish va manfiy summani rad etish',
        'Kategoriya bo‘yicha filtrlash va umumiy summani hisoblash',
        'Eng katta xarajatni aniqlash',
      ],
      en: [
        'Add expenses while validating positive amounts',
        'Filter by category and compute category totals',
        'Identify the highest single expense',
      ],
    },
    architectureTips: {
      uz: [
        'Har bir xarajatni dictionary yoki dataclass ko‘rinishida saqlang',
        'Biznes mantiqni (add_expense, get_summary) alohida funksiyalarga ajrating',
      ],
      en: [
        'Model each expense using a dictionary or dataclass',
        'Separate business logic functions from display formatting',
      ],
    },
    evaluationCriteria: {
      uz: ['Kod tozaligi va type hints', 'Noto‘g‘ri kiritmalarda xato bermaslik', 'To‘g‘ri hisob-kitob'],
      en: ['Clean functions & type hints', 'Input validation', 'Accurate aggregations'],
    },
    milestones: [
      { id: 'm1', title: { uz: "Ma'lumot modelini tuzish", en: 'Design expense data model' }, description: { uz: 'List + Dict strukturasini yarating', en: 'Create list of expense dicts' } },
      { id: 'm2', title: { uz: "Qo'shish va tekshirish funksiyasi", en: 'Implement add & validation' }, description: { uz: 'Summa > 0 ekanligini tekshiring', en: 'Validate amount > 0' } },
      { id: 'm3', title: { uz: 'Kategoriya hisobotini chiqarish', en: 'Build category summary report' }, description: { uz: 'Barcha kategoriyalar yig‘indisini hisoblang', en: 'Compute totals per category' } },
    ],
    starterCode: `from dataclasses import dataclass

@dataclass
class Expense:
    category: str
    amount: float
    note: str

def summarize_by_category(expenses: list[Expense]) -> dict[str, float]:
    summary: dict[str, float] = {}
    for item in expenses:
        if item.amount <= 0:
            raise ValueError("Summa musbat bo'lishi kerak")
        summary[item.category] = round(summary.get(item.category, 0.0) + item.amount, 2)
    return summary

sample = [
    Expense("Oziq-ovqat", 45000, "Tushlik"),
    Expense("Transport", 12000, "Metro"),
    Expense("Oziq-ovqat", 30000, "Meva"),
]
print("Hisobot:", summarize_by_category(sample))
`,
  },
  {
    id: 'PRJ-02',
    title: { uz: 'Talabalar Baho Tizimi (OOP)', en: 'OOP Student Gradebook Engine' },
    difficulty: 'intermediate',
    estimatedHours: 6,
    summary: {
      uz: "Klasslar, JSON saqlash va GPA hisoblash algoritmiga ega obyektga yo'naltirilgan loyiha.",
      en: 'An object-oriented student gradebook with GPA computation and JSON serialization.',
    },
    problemStatement: {
      uz: "Talabalar, fanlar va baholarni boshqaruvchi `Student` va `Gradebook` klasslarini yozing. Eng yaxshi talabalarni reyting bo'yicha saralang.",
      en: 'Design `Student` and `Gradebook` classes to manage courses, scores, average GPA calculation, and leaderboard ranking.',
    },
    requirements: {
      uz: [
        '0–100 oraliqdagi baholarni validatsiya qilish',
        'O‘rtacha ball (average) hisoblash property si',
        'JSON formatida eksport qilish',
      ],
      en: [
        'Validate grades within 0–100',
        'Compute student average via @property',
        'Serialize gradebook summary to JSON',
      ],
    },
    architectureTips: {
      uz: ['@property va @dataclass dekoratorlaridan foydalaning', 'JSON uchun json.dumps(..., indent=2) ishlating'],
      en: ['Use @property and dataclasses', 'Use json.dumps(..., indent=2) for clean export'],
    },
    evaluationCriteria: {
      uz: ['OOP kapsulyatsiyasi', 'Edge case tekshiruvlari', 'JSON formatlash'],
      en: ['OOP encapsulation', 'Edge-case handling', 'Clean JSON output'],
    },
    milestones: [
      { id: 'm1', title: { uz: 'Student klassi', en: 'Implement Student class' }, description: { uz: 'Baholar qo‘shish va o‘rtacha ball', en: 'Add scores and average property' } },
      { id: 'm2', title: { uz: 'Gradebook reytingi', en: 'Implement Gradebook ranking' }, description: { uz: 'Talabalarni ball bo‘yicha tartiblash', en: 'Sort students descending by average' } },
      { id: 'm3', title: { uz: 'JSON eksport', en: 'Add JSON export' }, description: { uz: 'Natijani JSON stringga o‘tkazish', en: 'Convert report to JSON' } },
    ],
    starterCode: `import json

class Student:
    def __init__(self, name: str) -> None:
        self.name = name
        self.scores: dict[str, int] = {}

    def add_score(self, subject: str, score: int) -> None:
        if not 0 <= score <= 100:
            raise ValueError("Ball 0 va 100 oralig'ida bo'lishi shart")
        self.scores[subject] = score

    @property
    def average(self) -> float:
        if not self.scores:
            return 0.0
        return round(sum(self.scores.values()) / len(self.scores), 2)

s1 = Student("Dilshod")
s1.add_score("Python", 94)
s1.add_score("SQL", 88)

s2 = Student("Malika")
s2.add_score("Python", 98)
s2.add_score("SQL", 92)

ranking = sorted([s1, s2], key=lambda s: s.average, reverse=True)
print(json.dumps([{"name": s.name, "avg": s.average} for s in ranking], indent=2))
`,
  },
  {
    id: 'PRJ-03',
    title: { uz: 'Server Log Tahlilchisi va Xavfsizlik Auditori', en: 'Server Log Analyzer & Anomaly Reporter' },
    difficulty: 'advanced',
    estimatedHours: 8,
    summary: {
      uz: "Regex, generatorlar va Counter yordamida katta log oqimlaridan 5xx xatolarni va shubhali IP larni aniqlash.",
      en: 'Stream-parse server logs with generators and regex to detect 5xx spikes and suspicious IP bursts.',
    },
    problemStatement: {
      uz: "HTTP log satrlarini xotirani tejab generator orqali tahlil qiling, status kodlar taqsimotini va limitdan oshgan IP manzillarni aniqlang.",
      en: 'Process HTTP log lines using lazy generators, aggregate status code counts, and flag IPs exceeding request thresholds.',
    },
    requirements: {
      uz: ['Regex bilan IP, metod va status kodni ajratib olish', 'collections.Counter bilan statistika', 'Threshold dan oshgan IP larni ogohlantirish'],
      en: ['Parse IP, HTTP method, and status via regex', 'Aggregate with collections.Counter', 'Flag IPs above request threshold'],
    },
    architectureTips: {
      uz: ['Log satrlarini generator funksiyada yield qiling', 'Dataclass bilan ParsedLog strukturasi tuzing'],
      en: ['Yield parsed log entries in a generator', 'Represent each record cleanly with dataclass'],
    },
    evaluationCriteria: {
      uz: ['O(1) xotira oqimi', 'Aniq regex parsing', 'Toza hisobot'],
      en: ['Streaming memory efficiency', 'Accurate regex parsing', 'Clear anomaly report'],
    },
    milestones: [
      { id: 'm1', title: { uz: 'Log parser', en: 'Build regex log parser' }, description: { uz: 'Har bir log qatorini tahlil qiling', en: 'Extract IP, path, status' } },
      { id: 'm2', title: { uz: 'Statistika agregatori', en: 'Aggregate metrics' }, description: { uz: '2xx/4xx/5xx sonini hisoblang', en: 'Count status families' } },
      { id: 'm3', title: { uz: 'Anomaliya aniqlash', en: 'Detect IP bursts' }, description: { uz: 'Shubhali IP larni ajratib ko‘rsating', en: 'Flag IPs exceeding threshold' } },
    ],
    starterCode: `import re
from collections import Counter

LOGS = [
    '192.168.1.10 GET /api/courses 200',
    '10.0.0.42 POST /api/login 401',
    '10.0.0.42 POST /api/login 401',
    '10.0.0.42 POST /api/login 401',
    '192.168.1.15 GET /api/lessons 500',
]

PATTERN = re.compile(r'^(?P<ip>\\S+)\\s+(?P<method>\\w+)\\s+(?P<path>\\S+)\\s+(?P<status>\\d{3})$')

def parse_logs(lines):
    for line in lines:
        m = PATTERN.match(line.strip())
        if m:
            yield m.groupdict()

status_counts = Counter()
failed_ips = Counter()

for entry in parse_logs(LOGS):
    code = int(entry['status'])
    status_counts[f"{code // 100}xx"] += 1
    if code >= 400:
        failed_ips[entry['ip']] += 1

print("Statuslar:", dict(status_counts))
print("Shubhali IP:", [ip for ip, cnt in failed_ips.items() if cnt >= 3])
`,
  },
];

export const VIDEO_CATALOG: VideoResource[] = [
  {
    id: 'VIDEO-CS50P-001',
    title: "Harvard CS50's Introduction to Programming with Python — Full Course",
    provider: 'YouTube',
    channel: 'CS50',
    url: 'https://www.youtube.com/watch?v=nLRL_NcnK-4',
    language: 'en',
    difficulty: 'beginner',
    topics: ['functions', 'variables', 'conditionals', 'loops', 'exceptions', 'oop'],
    relatedCourse: 'python_fundamentals',
    relatedLessons: ['PY-02-01', 'PY-02-03', 'PY-05-01'],
    description: {
      uz: "Harvard universitetining mashhur CS50P Python kursi: funksiyalar, shartlar, sikllar, testlar va OOP bo'yicha fundamental ma'ruzalar.",
      en: "Harvard University's CS50P lectures covering functions, variables, conditionals, loops, unit tests, and OOP.",
    },
    verified: true,
  },
  {
    id: 'VIDEO-CS50P-002',
    title: 'CS50P Official Course Portal & Problem Sets',
    provider: 'Official Docs',
    channel: 'Harvard CS50',
    url: 'https://pll.harvard.edu/course/cs50s-introduction-programming-python',
    language: 'en',
    difficulty: 'beginner',
    topics: ['curriculum', 'python', 'problem solving'],
    relatedCourse: 'python_fundamentals',
    relatedLessons: ['PY-01-01'],
    description: {
      uz: 'Harvard CS50P rasmiy kurs sahifasi va qo‘shimcha amaliy topshiriqlar.',
      en: 'Official Harvard CS50P course portal with structured lecture notes and problem sets.',
    },
    verified: true,
  },
  {
    id: 'VIDEO-COREY-001',
    title: 'Corey Schafer — Python Programming Beginner Tutorials',
    provider: 'YouTube',
    channel: 'Corey Schafer',
    url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU',
    language: 'en',
    difficulty: 'beginner',
    topics: ['strings', 'lists', 'dictionaries', 'functions', 'oop', 'decorators'],
    relatedCourse: 'data_structures',
    relatedLessons: ['PY-04-01', 'PY-04-08', 'PY-09-01'],
    description: {
      uz: "Python ma'lumot turlari, dictionary, funksiya, dekoratorlar va OOP ni amaliy misollar bilan tushuntiruvchi mashhur darslar turkumi.",
      en: 'Comprehensive practical tutorials on strings, lists, dicts, functions, OOP, and decorators.',
    },
    verified: true,
  },
  {
    id: 'VIDEO-FCC-001',
    title: 'freeCodeCamp — Learn Python Full Course for Beginners',
    provider: 'YouTube',
    channel: 'freeCodeCamp.org',
    url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    language: 'en',
    difficulty: 'beginner',
    topics: ['variables', 'lists', 'loops', 'files', 'classes'],
    relatedCourse: 'python_fundamentals',
    relatedLessons: ['PY-02-03', 'PY-03-02'],
    description: {
      uz: "Noldan boshlovchilar uchun Python sintaksisi, ro'yxatlar, sikllar va klasslar bo'yicha yaxlit video qo'llanma.",
      en: 'Complete beginner-friendly walkthrough of Python syntax, lists, loops, files, and classes.',
    },
    verified: true,
  },
  {
    id: 'VIDEO-DOCS-001',
    title: 'Official Python 3 Tutorial & Documentation',
    provider: 'Official Docs',
    channel: 'Python Software Foundation',
    url: 'https://docs.python.org/3/tutorial/',
    language: 'en',
    difficulty: 'intermediate',
    topics: ['standard library', 'modules', 'classes', 'errors'],
    relatedCourse: 'modules_packages',
    relatedLessons: ['PY-08-01', 'PY-10-01'],
    description: {
      uz: "Python 3 ning rasmiy qo'llanmasi: standart kutubxonalar, modullar va chuqur til xususiyatlari.",
      en: 'The official Python 3 tutorial covering standard library, modules, and language semantics.',
    },
    verified: true,
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'g-var',
    term: 'Variable',
    uzTranslation: "O'zgaruvchi",
    category: 'Foundations',
    definition: {
      uz: "Xotiradagi qiymatga berilgan nomli havola (reference). Python'da o'zgaruvchi turini oldindan e'lon qilish shart emas.",
      en: 'A named reference pointing to an object in memory. Python uses dynamic typing.',
    },
    example: `age = 21\nname = "Aziz"`,
    relatedCourseId: 'python_fundamentals',
  },
  {
    id: 'g-str',
    term: 'String (str)',
    uzTranslation: 'Matn turi',
    category: 'Data Types',
    definition: {
      uz: "Qo'shtirnoq yoki birtirnoq ichidagi o'zgarmas (immutable) belgilar ketma-ketligi.",
      en: 'An immutable sequence of Unicode characters enclosed in quotes.',
    },
    example: `greeting = f"Salom, {name}!"`,
    relatedCourseId: 'python_fundamentals',
  },
  {
    id: 'g-list',
    term: 'List',
    uzTranslation: "Ro'yxat (o'zgaruvchan)",
    category: 'Data Structures',
    definition: {
      uz: "Tartiblangan va o'zgartiriladigan (mutable) elementlar to'plami.",
      en: 'An ordered, mutable sequence capable of storing heterogeneous items.',
    },
    example: `skills = ["Python", "SQL", "FastAPI"]\nskills.append("Docker")`,
    relatedCourseId: 'data_structures',
  },
  {
    id: 'g-dict',
    term: 'Dictionary (dict)',
    uzTranslation: "Lug'at (kalit-qiymat)",
    category: 'Data Structures',
    definition: {
      uz: "Har bir noyob kalit (key) ni qiymat (value) bilan bog'laydigan O(1) tezkor hash jadval.",
      en: 'A key-value mapping implemented as a hash table with O(1) average lookup.',
    },
    example: `student = {"name": "Madina", "score": 95}`,
    relatedCourseId: 'data_structures',
  },
  {
    id: 'g-tuple',
    term: 'Tuple',
    uzTranslation: "O'zgarmas kortej",
    category: 'Data Structures',
    definition: {
      uz: "Yaratilgandan keyin elementlarini o'zgartirib bo'lmaydigan (immutable) tartiblangan to'plam.",
      en: 'An ordered, immutable sequence commonly used for fixed records.',
    },
    example: `coords = (41.2995, 69.2401)`,
    relatedCourseId: 'data_structures',
  },
  {
    id: 'g-set',
    term: 'Set',
    uzTranslation: "Noyob elementlar to'plami",
    category: 'Data Structures',
    definition: {
      uz: "Takrorlanuvchi qiymatlarga ruxsat bermaydigan tartibsiz to'plam.",
      en: 'An unordered collection of unique hashable elements.',
    },
    example: `unique_tags = {"python", "backend", "python"}  # {"python", "backend"}`,
    relatedCourseId: 'data_structures',
  },
  {
    id: 'g-func',
    term: 'Function (def)',
    uzTranslation: 'Funksiya',
    category: 'Functions',
    definition: {
      uz: "Qayta ishlatiladigan nomlangan kod bloki. Parametr qabul qiladi va `return` bilan natija qaytaradi.",
      en: 'A reusable named block of code defined with `def` that accepts parameters and returns a value.',
    },
    example: `def square(x: int) -> int:\n    return x * x`,
    relatedCourseId: 'functions',
  },
  {
    id: 'g-oop-class',
    term: 'Class & Object',
    uzTranslation: 'Klass va Obyekt',
    category: 'OOP',
    definition: {
      uz: "Class — obyektlar yaratish uchun chizma (blueprint); Object (instance) — shu chizmadan yaratilgan haqiqiy nusxa.",
      en: 'A Class is a blueprint defining attributes and methods; an Object is an instance of that class.',
    },
    example: `class Course:\n    def __init__(self, title: str):\n        self.title = title`,
    relatedCourseId: 'oop',
  },
  {
    id: 'g-exc',
    term: 'Exception (try/except)',
    uzTranslation: 'Istisno (xatoni ushlash)',
    category: 'Error Handling',
    definition: {
      uz: "Dastur bajarilishi vaqtida yuzaga keladigan xatolarni ushlab, dastur qulashining oldini olish mexanizmi.",
      en: 'A runtime error object that can be caught and handled cleanly using `try` and `except`.',
    },
    example: `try:\n    n = int("abc")\nexcept ValueError:\n    n = 0`,
    relatedCourseId: 'errors_testing',
  },
  {
    id: 'g-dec',
    term: 'Decorator',
    uzTranslation: 'Dekorator',
    category: 'Advanced Python',
    definition: {
      uz: "Boshqa funksiyani o'rab olib, uning asl kodini o'zgartirmasdan qo'shimcha xatti-harakat qo'shadigan funksiya.",
      en: 'A callable that wraps another function to extend its behavior without modifying its source.',
    },
    example: `@staticmethod\ndef info():\n    return "Python"`,
    relatedCourseId: 'advanced_python',
  },
  {
    id: 'g-gen',
    term: 'Generator (yield)',
    uzTranslation: 'Generator',
    category: 'Advanced Python',
    definition: {
      uz: "Qiymatlarni birdaniga xotiraga yig'masdan, `yield` orqali navbatma-navbat ishlab chiqaruvchi iterator.",
      en: 'A lazy iterator function that yields values one at a time, preserving state between calls.',
    },
    example: `def count_up(n):\n    for i in range(n):\n        yield i`,
    relatedCourseId: 'advanced_python',
  },
  {
    id: 'g-bigo',
    term: 'Big O Notation',
    uzTranslation: 'Algoritm murakkabligi',
    category: 'Algorithms',
    definition: {
      uz: "Kirish ma'lumotlari hajmi (n) oshishi bilan algoritm vaqti yoki xotirasi qanday o'sishini ko'rsatuvchi o'lchov.",
      en: 'Asymptotic notation describing how algorithm runtime or memory scales with input size `n`.',
    },
    example: `# Binary search: O(log n)\n# Linear scan: O(n)`,
    relatedCourseId: 'algorithms',
  },
  {
    id: 'g-sql-join',
    term: 'SQL JOIN',
    uzTranslation: 'Jadvallarni birlashtirish',
    category: 'Databases',
    definition: {
      uz: "Relyatsion ma'lumotlar bazasida ikki yoki undan ortiq jadvalni umumiy ustun (Foreign Key) orqali birlashtirish.",
      en: 'Combining rows from two or more relational tables based on a related column.',
    },
    example: `SELECT u.username, n.title FROM users u JOIN notes n ON n.user_id = u.id;`,
    relatedCourseId: 'databases',
  },
  {
    id: 'g-async',
    term: 'async / await',
    uzTranslation: 'Asinxron dasturlash',
    category: 'Concurrency',
    definition: {
      uz: "Tarmoq yoki disk javobini kutish paytida boshqa vazifalarni parallel bajarish imkonini beruvchi coroutine mexanizmi.",
      en: 'Syntax for writing non-blocking coroutines managed by the `asyncio` event loop.',
    },
    example: `async def fetch_data():\n    await asyncio.sleep(0.1)\n    return "OK"`,
    relatedCourseId: 'advanced_python',
  },
];

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'ach_first_program',
    title: { uz: 'Birinchi dastur', en: 'First Program Executed' },
    description: {
      uz: 'Code Labda birinchi Python kodingizni muvaffaqiyatli ishga tushirdingiz.',
      en: 'Successfully executed your first Python script in Code Lab.',
    },
    criteriaText: { uz: '1 ta kodni muvaffaqiyatli bajaring', en: 'Run 1 Python script without errors' },
    iconName: 'Terminal',
  },
  {
    id: 'ach_first_lesson',
    title: { uz: 'Ilk qadam', en: 'First Lesson Completed' },
    description: {
      uz: "Birinchi nazariy darsni to'liq o'zlashtirib tugalladingiz.",
      en: 'Completed your first curriculum lesson.',
    },
    criteriaText: { uz: '1 ta darsni tugallang', en: 'Complete 1 lesson' },
    iconName: 'BookOpen',
  },
  {
    id: 'ach_five_lessons',
    title: { uz: 'Izchil talaba', en: 'Consistent Learner (5 Lessons)' },
    description: {
      uz: '5 ta darsni muvaffaqiyatli yakunladingiz.',
      en: 'Completed 5 structured lessons across courses.',
    },
    criteriaText: { uz: '5 ta darsni tugallang', en: 'Complete 5 lessons' },
    iconName: 'Layers',
  },
  {
    id: 'ach_first_exercise',
    title: { uz: 'Muammo yechuvchi', en: 'First Exercise Solved' },
    description: {
      uz: "Avtomatik testlardan 100% o'tgan birinchi amaliy mashqni topshirdingiz.",
      en: 'Passed 100% of test cases on your first coding exercise.',
    },
    criteriaText: { uz: '1 ta mashqdan 100% oling', en: 'Score 100% on an exercise' },
    iconName: 'CheckCircle2',
  },
  {
    id: 'ach_first_exam',
    title: { uz: 'Imtihondan o‘tdi', en: 'First Examination Passed' },
    description: {
      uz: 'Nazorat imtihonini muvaffaqiyatli topshirib tasdiqladingiz.',
      en: 'Passed an official course checkpoint examination.',
    },
    criteriaText: { uz: '1 ta imtihondan o‘ting', en: 'Pass 1 examination' },
    iconName: 'Award',
  },
  {
    id: 'ach_first_project',
    title: { uz: 'Mustaqil loyiha', en: 'First Project Built' },
    description: {
      uz: "Loyiha laboratoriyasida barcha bosqichlarni bajarib loyihani yakunladingiz.",
      en: 'Completed all milestones of a real-world Python project.',
    },
    criteriaText: { uz: '1 ta loyihani yakunlang', en: 'Complete 1 project' },
    iconName: 'FolderGit2',
  },
  {
    id: 'ach_note_taker',
    title: { uz: 'Bilim yig‘uvchi', en: 'Knowledge Architect' },
    description: {
      uz: "O'zingizning ilk o'quv qaydingizni yaratdingiz.",
      en: 'Created your first structured study note with code.',
    },
    criteriaText: { uz: 'Kamida 1 ta qayd yarating', en: 'Create 1 study note' },
    iconName: 'FileText',
  },
  {
    id: 'ach_streak_7',
    title: { uz: '7 kunlik intizom', en: '7-Day Study Streak' },
    description: {
      uz: 'Ketma-ket 7 kun davomida Python bilan shug‘ullandingiz.',
      en: 'Maintained active study sessions for 7 consecutive days.',
    },
    criteriaText: { uz: '7 kun ketma-ket o‘qing', en: '7 consecutive days of study' },
    iconName: 'Flame',
  },
];

export interface NinetyDayPhase {
  phase: number;
  daysRange: string;
  title: LocalizedText;
  focus: LocalizedText;
  courseIds: string[];
  checkpointExamId?: string;
  milestoneDeliverable: LocalizedText;
}

export const NINETY_DAY_PROGRAM: NinetyDayPhase[] = [
  {
    phase: 1,
    daysRange: '1–15',
    title: { uz: '1-bosqich: Sintaksis va Mantiq poydevori', en: 'Phase 1: Foundations & Control Flow' },
    focus: {
      uz: "Dasturlash asoslari, o'zgaruvchilar, stringlar, shart operatorlari va for/while sikllari.",
      en: 'Foundations, variables, types, conditionals, and loops.',
    },
    courseIds: ['computer_literacy', 'python_fundamentals', 'control_flow'],
    checkpointExamId: 'EXAM-01',
    milestoneDeliverable: {
      uz: 'Har 5 darsda mini amaliyot + 15-kuni 1-Bosqich nazorat imtihoni',
      en: 'Mini coding reviews every 5 lessons + Checkpoint 1 Exam on Day 15',
    },
  },
  {
    phase: 2,
    daysRange: '16–30',
    title: { uz: "2-bosqich: Ma'lumot tuzilmalari va Funksiyalar", en: 'Phase 2: Data Structures & Functions' },
    focus: {
      uz: 'List, Tuple, Set, Dictionary, Comprehension va funksiyalar arxitekturasi.',
      en: 'Lists, tuples, sets, dicts, comprehensions, functions, and recursion.',
    },
    courseIds: ['data_structures', 'functions'],
    checkpointExamId: 'EXAM-02',
    milestoneDeliverable: {
      uz: 'CLI Xarajatlar Nazoratchisi loyihasi + 2-Bosqich imtihoni',
      en: 'CLI Expense Tracker project + Checkpoint 2 Exam',
    },
  },
  {
    phase: 3,
    daysRange: '31–45',
    title: { uz: '3-bosqich: Fayllar, Xatolar va OOP', en: 'Phase 3: Files, Testing & OOP' },
    focus: {
      uz: 'Fayl oqimlari (TXT/CSV/JSON/pathlib), try/except, pytest va OOP klasslar arxitekturasi.',
      en: 'File streams, exception handling, pytest, and OOP classes & design patterns.',
    },
    courseIds: ['files_io', 'errors_testing', 'oop'],
    milestoneDeliverable: {
      uz: 'OOP Talabalar Baho Tizimi loyihasi',
      en: 'OOP Student Gradebook project',
    },
  },
  {
    phase: 4,
    daysRange: '46–60',
    title: { uz: '4-bosqich: Modullar va Advanced Python', en: 'Phase 4: Modules & Advanced Python' },
    focus: {
      uz: 'Modullar, venv, Git/GitHub, dekoratorlar, generatorlar, regex va typing.',
      en: 'Modules, venv, Git, decorators, generators, regex, and advanced typing.',
    },
    courseIds: ['modules_packages', 'advanced_python'],
    milestoneDeliverable: {
      uz: 'Unit testlangan modulli Python kutubxonasi',
      en: 'Unit-tested modular Python package',
    },
  },
  {
    phase: 5,
    daysRange: '61–75',
    title: { uz: "5-bosqich: Algoritmlar, SQL, HTTP va Backend", en: 'Phase 5: Algorithms, SQL & Backend' },
    focus: {
      uz: 'Big O, Qidiruv/Saralash, SQLite/PostgreSQL, REST API, Flask/Django/FastAPI.',
      en: 'Big O, searching/sorting, SQL, HTTP/REST APIs, and FastAPI/ORM backends.',
    },
    courseIds: ['algorithms', 'databases', 'http_apis', 'web_backend'],
    checkpointExamId: 'EXAM-03',
    milestoneDeliverable: {
      uz: '3-Bosqich Imtihoni + Maʼlumotlar bazali API prototipi',
      en: 'Checkpoint 3 Exam + Database-backed API prototype',
    },
  },
  {
    phase: 6,
    daysRange: '76–90',
    title: { uz: '6-bosqich: Automation, Data Science va AI / ML', en: 'Phase 6: Automation, Data Science & AI/ML' },
    focus: {
      uz: 'OS avtomatlashtirish, Web Scraping, NumPy/Pandas/EDA, Scikit-learn, PyTorch va AI API.',
      en: 'Automation, scraping, NumPy/Pandas/EDA, Scikit-learn, PyTorch, and AI API apps.',
    },
    courseIds: ['automation', 'data_science', 'ai_ml'],
    milestoneDeliverable: {
      uz: '90-kun yakuniy loyihasi (Server Log Auditor) va Junior tayyorgarlik baholash',
      en: 'Day 90 Capstone Project & Junior-readiness competency review',
    },
  },
];
