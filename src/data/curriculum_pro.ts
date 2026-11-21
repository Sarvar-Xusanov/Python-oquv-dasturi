import type { Course, Lesson } from '../types/domain';

export const PRO_COURSES: Course[] = [
  {
    id: 'advanced_python',
    number: 9,
    category: 'engineering',
    title: { uz: 'Yuqori Darajadagi Python', en: 'Advanced Python' },
    description: {
      uz: 'Iteratorlar, generatorlar (yield), dekoratorlar, closure, type hints, dataclasses va logging.',
      en: 'Iterators, generators, decorators, closures, type hints, dataclasses, enums, and logging.',
    },
    difficulty: 'advanced',
    estimatedHours: 7,
    prerequisites: ['modules_packages'],
    objectives: {
      uz: ['Generatorlar bilan xotirani tejash', 'Dekorator yozish', '@dataclass va typing dan foydalanish'],
      en: ['Build lazy generators', 'Write custom decorators', 'Use dataclasses and type hints'],
    },
    modules: [
      { id: 'adv_gen', title: { uz: 'Generatorlar, Dekoratorlar va Dataclasses', en: 'Generators, Decorators & Dataclasses' }, order: 1 },
    ],
  },
  {
    id: 'algorithms',
    number: 10,
    category: 'engineering',
    title: { uz: "Algoritmlar va Ma'lumot Tuzilmalari", en: 'Algorithms and Data Structures' },
    description: {
      uz: 'Big O murakkabligi, Linear/Binary search, saralash, Stack, Queue, Hash Table va Graph asoslari.',
      en: 'Big O analysis, linear & binary search, sorting, stacks, queues, hash tables, trees, and graphs.',
    },
    difficulty: 'advanced',
    estimatedHours: 10,
    prerequisites: ['advanced_python'],
    objectives: {
      uz: ['Big O murakkabligini baholash', 'O(log n) Binary Search yozish', 'Stack va Queue muammolarini yechish'],
      en: ['Analyze Big O time/space complexity', 'Implement Binary Search', 'Solve problems using stacks and queues'],
    },
    modules: [
      { id: 'alg_core', title: { uz: 'Big O, Qidiruv va Stack/Queue', en: 'Big O, Search & Stack/Queue' }, order: 1 },
    ],
  },
  {
    id: 'software_engineering',
    number: 11,
    category: 'engineering',
    title: { uz: 'Dasturiy Taʼminot Muhandisligi', en: 'Software Engineering' },
    description: {
      uz: 'Git, GitHub, Clean Code, SOLID tamoyillari, Pytest bilan unit testing va debugging.',
      en: 'Git workflows, clean code, SOLID principles, pytest unit testing, and systematic debugging.',
    },
    difficulty: 'intermediate',
    estimatedHours: 6,
    prerequisites: ['modules_packages'],
    objectives: {
      uz: ['Git branch/commit oqimini tushunish', 'SOLID tamoyillarini qo‘llash', 'Avtomatik testlar yozish'],
      en: ['Follow Git feature-branch workflows', 'Apply SOLID principles', 'Write automated unit tests'],
    },
    modules: [
      { id: 'se_clean', title: { uz: 'Clean Code, SOLID va Testing', en: 'Clean Code, SOLID & Testing' }, order: 1 },
    ],
  },
  {
    id: 'databases',
    number: 12,
    category: 'backend',
    title: { uz: "Ma'lumotlar Bazalari (SQL va SQLite)", en: 'Databases & SQL' },
    description: {
      uz: 'Relyatsion jadvallar, SQL SELECT/INSERT/UPDATE/DELETE, JOIN, indekslar, SQLite va SQLAlchemy ORM.',
      en: 'Relational modeling, SQL CRUD, JOINs, indexes, SQLite, PostgreSQL, and SQLAlchemy.',
    },
    difficulty: 'intermediate',
    estimatedHours: 7,
    prerequisites: ['oop'],
    objectives: {
      uz: ['SQL so‘rovlarini yozish', 'JOIN va indekslarni tushunish', 'SQL injection dan himoyalanish'],
      en: ['Write relational SQL queries', 'Design foreign keys and indexes', 'Prevent SQL injection with bound parameters'],
    },
    modules: [
      { id: 'db_sql', title: { uz: 'SQL va SQLite amaliyoti', en: 'SQL & SQLite Practice' }, order: 1 },
    ],
  },
  {
    id: 'web_backend',
    number: 13,
    category: 'backend',
    title: { uz: 'Web va Backend Dasturlash (REST & FastAPI)', en: 'Web & Backend Engineering' },
    description: {
      uz: 'HTTP protokoli, JSON API, REST arxitekturasi, FastAPI route lar, validatsiya va autentifikatsiya.',
      en: 'HTTP semantics, JSON REST APIs, FastAPI routing, Pydantic validation, and authentication.',
    },
    difficulty: 'advanced',
    estimatedHours: 8,
    prerequisites: ['databases'],
    objectives: {
      uz: ['HTTP status kodlari va metodlarini bilish', 'RESTful endpoint loyihalash', 'Autentifikatsiya asoslarini tushunish'],
      en: ['Master HTTP methods & status codes', 'Design clean REST endpoints', 'Implement validation and auth checks'],
    },
    modules: [
      { id: 'web_rest', title: { uz: 'HTTP, REST va FastAPI', en: 'HTTP, REST & FastAPI' }, order: 1 },
    ],
  },
  {
    id: 'automation',
    number: 14,
    category: 'backend',
    title: { uz: 'Avtomatlashtirish (Automation)', en: 'Python Automation' },
    description: {
      uz: 'Fayl tizimini avtomatlashtirish, CSV/Excel qayta ishlash, API integratsiyalari va rejalashtirilgan skriptlar.',
      en: 'Filesystem automation, CSV processing, API integrations, scheduling, and resilient scripts.',
    },
    difficulty: 'intermediate',
    estimatedHours: 5,
    prerequisites: ['files_exceptions'],
    objectives: {
      uz: ['Takroriy fayl vazifalarini avtomatlashtirish', 'CSV hisobotlar generatsiya qilish'],
      en: ['Automate repetitive file workflows', 'Generate structured CSV reports'],
    },
    modules: [
      { id: 'auto_fs', title: { uz: 'Skriptlar va CSV avtomatlashtirish', en: 'Scripts & CSV Automation' }, order: 1 },
    ],
  },
  {
    id: 'async_python',
    number: 15,
    category: 'backend',
    title: { uz: 'Asinxron Python (asyncio)', en: 'Asynchronous Python' },
    description: {
      uz: 'Processlar vs Threadlar, async/await, asyncio event loop va bir vaqtda ko‘p I/O vazifalarni bajarish.',
      en: 'Processes vs threads, async/await coroutines, asyncio.gather, and concurrent I/O.',
    },
    difficulty: 'advanced',
    estimatedHours: 5,
    prerequisites: ['web_backend'],
    objectives: {
      uz: ['CPU-bound va I/O-bound farqini bilish', 'async def va await bilan parallel vazifa bajarish'],
      en: ['Distinguish CPU-bound vs I/O-bound workloads', 'Run concurrent coroutines with asyncio.gather'],
    },
    modules: [
      { id: 'async_core', title: { uz: 'Coroutines va asyncio', en: 'Coroutines & asyncio' }, order: 1 },
    ],
  },
  {
    id: 'data_science_ai',
    number: 16,
    category: 'data_ai',
    title: { uz: "Data Science va AI Asoslari", en: 'Data Science and AI Fundamentals' },
    description: {
      uz: 'Statistika asoslari, ma’lumotlarni tozalash, NumPy/Pandas tushunchalari va AI API integratsiyasi.',
      en: 'Statistics basics, data cleaning, NumPy/Pandas concepts, ML workflow, and AI API integration.',
    },
    difficulty: 'advanced',
    estimatedHours: 7,
    prerequisites: ['algorithms'],
    objectives: {
      uz: ['Ma’lumotlarni tozalash va tahlil qilish', 'AI API lar bilan xavfsiz ishlash tamoyillarini bilish'],
      en: ['Clean and analyze tabular datasets', 'Integrate AI APIs responsibly'],
    },
    modules: [
      { id: 'ds_ai', title: { uz: 'Statistika, Data tahlili va AI API', en: 'Statistics, Data Analysis & AI APIs' }, order: 1 },
    ],
  },
  {
    id: 'professional_dev',
    number: 17,
    category: 'engineering',
    title: { uz: 'Professional Rivojlanish va Karyera', en: 'Professional Development' },
    description: {
      uz: 'Tizim arxitekturasi, xavfsizlik, env sozlamalari, logging, deploy, portfolio va texnik suhbat.',
      en: 'Architecture, security, configuration, logging, deployment, portfolio, and technical interviews.',
    },
    difficulty: 'advanced',
    estimatedHours: 5,
    prerequisites: ['software_engineering'],
    objectives: {
      uz: ['Ishlab chiqarishga (production) tayyor kod yozish', 'Junior Python Developer suhbatiga tayyorlanish'],
      en: ['Write production-hardened applications', 'Prepare effectively for Junior Python interviews'],
    },
    modules: [
      { id: 'pro_ready', title: { uz: 'Arxitektura, Xavfsizlik va Texnik Suhbat', en: 'Architecture, Security & Interviews' }, order: 1 },
    ],
  },
];

export const PRO_LESSONS: Lesson[] = [
  {
    id: 'PY-ADV-001',
    courseId: 'advanced_python',
    moduleId: 'adv_gen',
    order: 1,
    title: { uz: 'Generatorlar, Dekoratorlar va Dataclasses', en: 'Generators, Decorators, and Dataclasses' },
    difficulty: 'advanced',
    estimatedMinutes: 50,
    prerequisites: ['PY-MOD-001'],
    conceptId: 'advanced_python',
    objectives: {
      uz: ['yield bilan xotirani tejash', 'Funksiya dekoratori tuzish', '@dataclass bilan toza modellar yaratish'],
      en: ['Yield lazy sequences with generators', 'Wrap functions with decorators', 'Reduce boilerplate using @dataclass'],
    },
    theory: {
      uz: `## Generatorlar va Dekoratorlar
- **Generator (\`yield\`)**: barcha qiymatlarni xotiraga birdan yuklamasdan, har safar \`next()\` so'ralganda bitta qiymat ishlab chiqaradi.
- **Decorator**: \`@my_decorator\` sintaksisi funksiyani boshqa funksiya ichiga o'rab, logging yoki vaqt o'lchash kabi qo'shimcha imkoniyat qo'shadi.
- **\`@dataclass\`**: \`__init__\`, \`__repr__\`, \`__eq__\` metodlarini avtomatik yaratib beradi.`,
      en: `## Generators, Decorators, and Dataclasses
Generators compute values lazily using \`yield\`. Decorators wrap callables to add cross-cutting concerns like timing or authorization. \`@dataclass\` auto-generates boilerplate methods.`,
    },
    examples: [
      {
        title: { uz: 'Dataclass va Decorator misoli', en: 'Dataclass and Decorator example' },
        code: `from dataclasses import dataclass
from functools import wraps

def log_call(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        print(f"Chaqirildi: {fn.__name__}")
        return fn(*args, **kwargs)
    return wrapper

@dataclass
class Task:
    title: str
    done: bool = False

@log_call
def complete(task: Task) -> Task:
    task.done = True
    return task

print(complete(Task("Dekoratorni o'rganish")))`,
        explanation: {
          uz: '`@wraps(fn)` asl funksiyaning nomi va docstringini saqlab qoladi.',
          en: '`@wraps(fn)` preserves the wrapped function metadata.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'Generator funksiyada qiymatni navbatma-navbat qaytaruvchi kalit so‘z qaysi?', en: 'Which keyword makes a function a generator?' },
        options: { uz: ['return', 'yield', 'async', 'lambda'], en: ['return', 'yield', 'async', 'lambda'] },
        correctIndex: 1,
        explanation: { uz: '`yield` funksiyaning holatini saqlab qiymat uzatadi.', en: '`yield` suspends execution and yields each value lazily.' },
      },
    ],
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
    relatedExercises: ['EX-010'],
  },
  {
    id: 'PY-ALG-001',
    courseId: 'algorithms',
    moduleId: 'alg_core',
    order: 1,
    title: { uz: 'Big O, Binary Search va Stack', en: 'Big O Complexity, Binary Search, and Stack' },
    difficulty: 'advanced',
    estimatedMinutes: 55,
    prerequisites: ['PY-ADV-001'],
    conceptId: 'algorithms',
    objectives: {
      uz: ['O(1), O(log n), O(n), O(n^2) farqlarini bilish', 'Binary search algoritmini yozish', 'Stack (LIFO) tamoyilini qo‘llash'],
      en: ['Compare O(1), O(log n), O(n), and O(n^2)', 'Implement binary search', 'Solve bracket balancing with a stack'],
    },
    theory: {
      uz: `## Big O Notation
1 million elementli tartiblangan ro'yxatdan element izlash:
- **Linear Search — O(n)**: eng yomon holatda 1,000,000 ta tekshiruv.
- **Binary Search — O(log n)**: har qadamda oraliqni ikkiga bo'ladi — ko'pi bilan **20 ta** tekshiruv!

### Stack (LIFO — Last In, First Out)
Python \`list\` da \`.append()\` va \`.pop()\` oxiridan O(1) vaqtda ishlaydi.`,
      en: `## Big O & Core Algorithms
Binary search cuts a sorted search space in half each step (O(log n)). A Stack follows Last-In, First-Out (LIFO) order using O(1) \`append()\` and \`pop()\`.`,
    },
    examples: [
      {
        title: { uz: 'Binary Search amalda', en: 'Binary Search in action' },
        code: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

print("Indeks:", binary_search([2, 5, 8, 12, 16, 23, 38], 16))`,
        explanation: {
          uz: 'Har iteratsiyada `mid` tekshirilib, qidiruv oralig‘i yarmiga qisqartiriladi.',
          en: 'Each iteration halves the remaining search interval.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'Binary search ishlashi uchun asosiy shart nima?', en: 'What is the prerequisite for binary search?' },
        options: { uz: ['Ro‘yxat tartiblangan (sorted) bo‘lishi kerak', 'Faqat manfiy sonlar bo‘lishi kerak', 'Ro‘yxat uzunligi juft bo‘lishi kerak', 'Hech qanday shart yo‘q'], en: ['The collection must be sorted', 'Only negative integers', 'Even length', 'No prerequisite'] },
        correctIndex: 0,
        explanation: { uz: 'Binary search tartiblangan ketma-ketlikdagina to‘g‘ri ishlaydi.', en: 'Binary search relies on sorted ordering to discard half the array.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: ['EX-011', 'EX-012'],
  },
  {
    id: 'PY-SE-001',
    courseId: 'software_engineering',
    moduleId: 'se_clean',
    order: 1,
    title: { uz: 'Git, Clean Code, SOLID va Unit Testing', en: 'Git, Clean Code, SOLID, and Unit Testing' },
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    prerequisites: ['PY-MOD-001'],
    conceptId: 'software_engineering',
    objectives: {
      uz: ['Single Responsibility (SOLID) tamoyilini tushunish', 'unittest/pytest bilan assert testlar yozish', 'Toza nomlash va kichik funksiyalar qoidasi'],
      en: ['Apply Single Responsibility Principle', 'Write deterministic unit tests with assertions', 'Keep functions cohesive and readable'],
    },
    theory: {
      uz: `## Clean Code va SOLID
- **S (Single Responsibility)**: har bir funksiya yoki klass faqat bitta aniq vazifaga javob bersin.
- **Unit Testing**: kodingizni qo'lda tekshirish o'rniga, har bir o'zgarishdan keyin avtomatik \`assert\` testlarni ishga tushiring.`,
      en: `## Clean Code & Testing
Apply the Single Responsibility Principle so functions stay focused and testable. Automated unit tests catch regressions immediately.`,
    },
    examples: [
      {
        title: { uz: 'Oddiy unit test yozish', en: 'Writing clean unit tests' },
        code: `def calculate_bmi(weight_kg: float, height_m: float) -> float:
    if height_m <= 0:
        raise ValueError("Bo'y musbat bo'lishi kerak")
    return round(weight_kg / (height_m ** 2), 1)

assert calculate_bmi(70, 1.75) == 22.9
print("Barcha unit testlar muvaffaqiyatli o'tdi!")`,
        explanation: {
          uz: '`assert` kutilgan natija bilan haqiqiy natijani solishtiradi.',
          en: '`assert` verifies expected behavior automatically.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'SOLID dagi "S" harfi nimani anglatadi?', en: 'What does "S" stand for in SOLID?' },
        options: { uz: ['Static Typing', 'Single Responsibility Principle', 'Server Side', 'Sorted List'], en: ['Static Typing', 'Single Responsibility Principle', 'Server Side', 'Sorted List'] },
        correctIndex: 1,
        explanation: { uz: 'Single Responsibility — har bir modul/klass bitta javobgarlikka ega bo‘lishi kerak.', en: 'Single Responsibility Principle keeps components focused on one reason to change.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: ['EX-008'],
  },
  {
    id: 'PY-DB-001',
    courseId: 'databases',
    moduleId: 'db_sql',
    order: 1,
    title: { uz: 'SQLite, SQL CRUD va Parameterized Queries', en: 'SQLite, SQL CRUD, and Parameterized Queries' },
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    prerequisites: ['PY-OOP-002'],
    conceptId: 'databases',
    objectives: {
      uz: ['CREATE TABLE, INSERT, SELECT, JOIN yozish', 'sqlite3 moduli bilan xavfsiz ishlash', 'SQL injection dan himoyalanish'],
      en: ['Write CREATE, INSERT, SELECT, and JOIN queries', 'Use Python sqlite3 safely', 'Always parameterize SQL queries'],
    },
    theory: {
      uz: `## SQL va SQLite
Python standart kutubxonasida tayyor \`sqlite3\` mavjud.
**Xavfsizlik qoidasi**: hech qachon foydalanuvchi ma'lumotini f-string bilan SQL ga qo'shmang! Har doim \`cursor.execute("SELECT * FROM users WHERE name = ?", (name,))\` ishlating.`,
      en: `## SQL & SQLite in Python
Python includes \`sqlite3\` out of the box. Always bind parameters with \`?\` placeholders to prevent SQL injection.`,
    },
    examples: [
      {
        title: { uz: 'Xotiradagi (:memory:) SQLite bazasi', en: 'In-memory SQLite example' },
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT)")
cur.execute("INSERT INTO courses (title) VALUES (?)", ("Python Mastery",))
cur.execute("SELECT id, title FROM courses")
print("Natija:", cur.fetchall())
conn.close()`,
        explanation: {
          uz: '`:memory:` tezkor testlar uchun vaqtinchalik SQLite bazasini ochadi.',
          en: '`:memory:` runs a real SQLite engine directly in RAM for fast testing.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'SQL injection hujumidan himoyalanishning eng to‘g‘ri yo‘li qaysi?', en: 'How do you prevent SQL injection?' },
        options: { uz: ['f-string ishlatish', 'Parameterized queries (?)', 'Parolni qisqartirish', 'HTML ga o‘girish'], en: ['Using f-strings', 'Parameterized queries (?)', 'Shortening inputs', 'HTML escaping'] },
        correctIndex: 1,
        explanation: { uz: 'Placeholder `?` ma’lumotni SQL buyrug‘idan ajratadi.', en: 'Bound parameters treat values strictly as data, not SQL syntax.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: [],
  },
  {
    id: 'PY-WEB-001',
    courseId: 'web_backend',
    moduleId: 'web_rest',
    order: 1,
    title: { uz: 'HTTP, JSON REST API va FastAPI arxitekturasi', en: 'HTTP, REST APIs, and FastAPI Architecture' },
    difficulty: 'advanced',
    estimatedMinutes: 50,
    prerequisites: ['PY-DB-001'],
    conceptId: 'web_backend',
    objectives: {
      uz: ['GET, POST, PUT, DELETE metodlarini bilish', '200, 201, 400, 401, 404, 500 status kodlari', 'Pydantic bilan request validatsiyasi'],
      en: ['Understand HTTP verbs & status codes', 'Design predictable REST endpoints', 'Validate payloads cleanly'],
    },
    theory: {
      uz: `## REST API asoslari
- **GET**: ma'lumot olish (\`200 OK\`)
- **POST**: yangi resurs yaratish (\`201 Created\`)
- **PUT/PATCH**: yangilash
- **DELETE**: o'chirish

**FastAPI** zamonaviy Python backend freymvorki bo'lib, Type Hints va Pydantic orqali avtomatik validatsiya hamda OpenAPI hujjatlarini yaratadi.`,
      en: `## REST APIs & FastAPI
REST maps CRUD actions onto HTTP verbs (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`) with semantic status codes (\`200\`, \`201\`, \`400\`, \`401\`, \`404\`). FastAPI leverages Python type hints for validation.`,
    },
    examples: [
      {
        title: { uz: 'REST javob tuzilmasini modellashtirish', en: 'Modeling a REST JSON payload' },
        code: `import json

def create_course_response(title: str, status_code: int = 201) -> dict:
    if not title.strip():
        return {"status": 400, "error": "Title cannot be empty"}
    return {
        "status": status_code,
        "data": {"title": title.strip(), "published": True},
    }

print(json.dumps(create_course_response("FastAPI Mastery"), indent=2))`,
        explanation: {
          uz: 'Backend handler har doim kirish ma’lumotini tekshirib, aniq status kod qaytaradi.',
          en: 'API handlers validate input early and return structured status payloads.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'Yangi resurs muvaffaqiyatli yaratilganda qaysi HTTP status kodi qaytariladi?', en: 'Which HTTP status code indicates a resource was successfully created?' },
        options: { uz: ['200', '201', '404', '500'], en: ['200', '201', '404', '500'] },
        correctIndex: 1,
        explanation: { uz: '`201 Created` yangi obyekt yaratilganini bildiradi.', en: '`201 Created` signals successful resource creation.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: [],
  },
  {
    id: 'PY-AUTO-001',
    courseId: 'automation',
    moduleId: 'auto_fs',
    order: 1,
    title: { uz: 'CSV, Fayl tizimi va Avtomatlashtirish skriptlari', en: 'CSV Processing & Automation Scripts' },
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-FE-002'],
    conceptId: 'automation',
    objectives: {
      uz: ['csv.DictReader bilan jadval ma’lumotlarini o‘qish', 'pathlib orqali kataloglarni skanerlash'],
      en: ['Parse tabular text with csv.DictReader', 'Scan paths cleanly with pathlib'],
    },
    theory: {
      uz: `## Avtomatlashtirish
Python kundalik ofis va server vazifalarini (fayllarni saralash, CSV hisobotlar tuzish, loglarni tekshirish) bir necha soniyada avtomatlashtirish uchun ideal vosita.`,
      en: `## Practical Automation
Python automates file organization, CSV transformation, and log auditing reliably using \`pathlib\` and \`csv\`.`,
    },
    examples: [
      {
        title: { uz: 'CSV matnini DictReader bilan tahlil qilish', en: 'Parsing CSV rows with DictReader' },
        code: `import csv
import io

raw_csv = "name,score\\nAziz,92\\nMadina,97\\n"
reader = csv.DictReader(io.StringIO(raw_csv))
for row in reader:
    print(f"{row['name']} -> {int(row['score']) * 1}%")`,
        explanation: {
          uz: '`csv.DictReader` har bir qatorni ustun nomlari bo‘yicha dictionary qilib qaytaradi.',
          en: '`csv.DictReader` maps each row using header column names.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "Zamonaviy Python'da fayl yo'llari bilan ishlash uchun qaysi standart modul tavsiya etiladi?", en: 'Which standard module is recommended for modern file paths?' },
        options: { uz: ['pathlib', 'random', 'math', 'pickle'], en: ['pathlib', 'random', 'math', 'pickle'] },
        correctIndex: 0,
        explanation: { uz: '`pathlib.Path` Linux va Windows yo‘llarini bir xil toza usulda boshqaradi.', en: '`pathlib.Path` offers a clean cross-platform object-oriented path API.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: [],
  },
  {
    id: 'PY-ASYNC-001',
    courseId: 'async_python',
    moduleId: 'async_core',
    order: 1,
    title: { uz: 'async / await va asyncio Event Loop', en: 'async / await and the asyncio Event Loop' },
    difficulty: 'advanced',
    estimatedMinutes: 45,
    prerequisites: ['PY-WEB-001'],
    conceptId: 'async_python',
    objectives: {
      uz: ['Coroutine nima ekanini tushunish', 'asyncio.gather() bilan bir nechta vazifani parallel kutish'],
      en: ['Define async coroutines', 'Run concurrent I/O tasks via asyncio.gather()'],
    },
    theory: {
      uz: `## Asinxron dasturlash
Oddiy sinxron kod tarmoq javobini kutayotganda to'xtab turadi. \`async def\` va \`await\` esa kutish vaqtida event loop boshqa vazifalarni bajarishiga imkon beradi.`,
      en: `## Asynchronous Python
With \`async def\` and \`await\`, coroutines yield control back to the event loop during I/O waits, maximizing throughput.`,
    },
    examples: [
      {
        title: { uz: 'asyncio.gather() bilan parallel vazifalar', en: 'Concurrent tasks with asyncio.gather' },
        code: `import asyncio

async def fetch_lesson(lesson_id: str) -> str:
    await asyncio.sleep(0.05)
    return f"Loaded {lesson_id}"

async def main():
    results = await asyncio.gather(
        fetch_lesson("PY-01"),
        fetch_lesson("PY-02"),
        fetch_lesson("PY-03"),
    )
    print(results)

asyncio.run(main())`,
        explanation: {
          uz: '3 ta vazifa ketma-ket emas, bir vaqtda (concurrently) bajariladi.',
          en: '`asyncio.gather` schedules all three coroutines concurrently.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "`async def` funksiyani ishga tushirish uchun qaysi kalit so'z ishlatiladi?", en: 'Which keyword awaits an async coroutine inside another async function?' },
        options: { uz: ['wait', 'await', 'yield', 'thread'], en: ['wait', 'await', 'yield', 'thread'] },
        correctIndex: 1,
        explanation: { uz: '`await` coroutine tugashini event loop ni bloklamasdan kutadi.', en: '`await` yields to the event loop until the coroutine completes.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: [],
  },
  {
    id: 'PY-DSAI-001',
    courseId: 'data_science_ai',
    moduleId: 'ds_ai',
    order: 1,
    title: { uz: "Statistika, Ma'lumot tozalash va AI API asoslari", en: 'Statistics, Data Cleaning, and AI API Concepts' },
    difficulty: 'advanced',
    estimatedMinutes: 45,
    prerequisites: ['PY-ALG-001'],
    conceptId: 'data_science',
    objectives: {
      uz: ['O‘rtacha (mean), mediana (median) va dispersiya', 'Ma’lumotlarni tozalash (missing values)', 'AI API larda prompt va kontekst xavfsizligi'],
      en: ['Compute mean, median, and standard deviation', 'Handle missing/dirty values', 'Design safe AI API integrations'],
    },
    theory: {
      uz: `## Data Science va AI
Haqiqiy ma'lumotlar hech qachon mukammal bo'lmaydi: bo'sh qiymatlar (\`None\`), dublikatlar va noto'g'ri turlar uchraydi.
Python standart \`statistics\` moduli hamda Pandas/NumPy tahlildan oldingi tozalash jarayonini osonlashtiradi.`,
      en: `## Data Science & AI Foundations
Before training models or visualizing insights, raw data must be cleaned and summarized statistically. Never leak credentials in prompts when calling AI APIs.`,
    },
    examples: [
      {
        title: { uz: 'Statistika va ma’lumot tozalash', en: 'Cleaning data & computing statistics' },
        code: `import statistics

raw_scores = [85, None, 92, 78, None, 95, 88]
clean_scores = [s for s in raw_scores if s is not None]

print("Tozalangan:", clean_scores)
print("O'rtacha (mean):", round(statistics.mean(clean_scores), 2))
print("Mediana:", statistics.median(clean_scores))`,
        explanation: {
          uz: '`None` qiymatlarni filtrlab olgandan keyin o‘rtacha va mediana aniq hisoblanadi.',
          en: 'Filtering out missing values ensures valid mean and median calculations.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'Katta chetlanishlar (outliers) mavjud bo‘lganda o‘rtachadan ko‘ra qaysi ko‘rsatkich ishonchliroq?', en: 'Which measure is more robust against extreme outliers than the mean?' },
        options: { uz: ['Median (mediana)', 'Sum (yig‘indi)', 'Max', 'Min'], en: ['Median', 'Sum', 'Max', 'Min'] },
        correctIndex: 0,
        explanation: { uz: 'Mediana tartiblangan ro‘yxatning o‘rtasidagi qiymat bo‘lib, ekstremal sonlardan kam ta’sirlanadi.', en: 'The median sits at the middle rank and resists skew from outliers.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: [],
  },
  {
    id: 'PY-PRO-001',
    courseId: 'professional_dev',
    moduleId: 'pro_ready',
    order: 1,
    title: { uz: 'Xavfsizlik, Konfiguratsiya, Logging va Texnik Suhbat', en: 'Security, Logging, Configuration, and Interviews' },
    difficulty: 'advanced',
    estimatedMinutes: 50,
    prerequisites: ['PY-SE-001'],
    conceptId: 'professional_dev',
    objectives: {
      uz: ['API kalitlarni os.environ orqali saqlash', 'logging moduli bilan tizimli jurnal yuritish', 'Portfolio va suhbatga tayyorgarlik'],
      en: ['Store secrets in environment variables, never in code', 'Use Python logging instead of print in production', 'Structure portfolio projects'],
    },
    theory: {
      uz: `## Production Python Tamoyillari
1. **Hech qachon parol yoki API key ni kodga yozmang**: \`.env\` va \`os.environ\` dan foydalaning.
2. **\`print()\` o'rniga \`logging\`**: darajalar (INFO, WARNING, ERROR) va vaqt belgisini beradi.
3. **Junior Portfolio**: kamida 3 ta toza, testlangan va README hujjatli loyiha yarating.`,
      en: `## Production Readiness
Never hardcode secrets—load configuration from environment variables. Replace ad-hoc prints with structured \`logging\`, and showcase tested projects in your portfolio.`,
    },
    examples: [
      {
        title: { uz: 'Logging konfiguratsiyasi', en: 'Structured logging setup' },
        code: `import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger("python_mastery")

logger.info("Ilova ishga tushdi")
logger.warning("Kunlik maqsadga 15 daqiqa qoldi")`,
        explanation: {
          uz: '`logging` ishlab chiqarish muhitida xatolarni kuzatishni osonlashtiradi.',
          en: 'Structured logging enables filtering by severity in production.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'API kalitlarni saqlashning xavfsiz usuli qaysi?', en: 'What is the secure way to manage API keys?' },
        options: { uz: ['Kod ichiga to‘g‘ridan-to‘g‘ri yozish', 'Environment variables (os.environ) orqali serverda saqlash', 'README.md ga yozish', 'Frontend JS faylga qo‘shish'], en: ['Hardcoding in source', 'Server-side environment variables', 'Writing in README', 'Exposing in client JS'] },
        correctIndex: 1,
        explanation: { uz: 'Maxfiy kalitlar faqat server muhit o‘zgaruvchilarida saqlanishi lozim.', en: 'Secrets belong in server-side environment variables, never in source control or client bundles.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: [],
  },
];
