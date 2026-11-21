import type { Course, Lesson } from '../types/domain';

export const CORE_COURSES: Course[] = [
  {
    id: 'python_fundamentals',
    number: 1,
    category: 'core',
    title: { uz: 'Dasturlash Asoslari', en: 'Programming Foundations' },
    description: {
      uz: "Dasturlash nima, algoritmik fikrlash, Python o'rnatish, terminal va birinchi Python dasturini yozish.",
      en: 'What programming is, algorithmic thinking, Python setup, terminal basics, and writing your first script.',
    },
    difficulty: 'beginner',
    estimatedHours: 4,
    prerequisites: [],
    objectives: {
      uz: ["Algoritm va dastur tushunchalarini bilish", "print() va izohlar (comments) bilan ishlash", "Python sintaksis qoidalarini tushunish"],
      en: ['Understand algorithms and programs', 'Use print() and comments cleanly', 'Follow Python indentation and syntax rules'],
    },
    modules: [
      { id: 'fnd_intro', title: { uz: 'Dasturlash va Python bilan tanishuv', en: 'Introduction to Programming & Python' }, order: 1 },
      { id: 'fnd_first', title: { uz: 'Birinchi dastur va sintaksis', en: 'First Program & Basic Syntax' }, order: 2 },
    ],
  },
  {
    id: 'variables_types',
    number: 2,
    category: 'core',
    title: { uz: "O'zgaruvchilar va Ma'lumot Turlari", en: 'Variables and Data Types' },
    description: {
      uz: "Variable, String, Integer, Float, Boolean, type casting, input(), operatorlar va f-string formatlash.",
      en: 'Variables, strings, integers, floats, booleans, type conversion, input(), operators, and f-strings.',
    },
    difficulty: 'beginner',
    estimatedHours: 5,
    prerequisites: ['python_fundamentals'],
    objectives: {
      uz: ["Asosiy ma'lumot turlarini ajratish", "Tur o'zgartirish (int, float, str) qilish", "f-string bilan matn formatlash"],
      en: ['Distinguish core primitive types', 'Convert between types safely', 'Format clean strings with f-strings'],
    },
    modules: [
      { id: 'var_basics', title: { uz: "O'zgaruvchilar va sonlar", en: 'Variables & Numbers' }, order: 1 },
      { id: 'var_strings', title: { uz: 'Matnlar va operatorlar', en: 'Strings & Operators' }, order: 2 },
    ],
  },
  {
    id: 'control_flow',
    number: 3,
    category: 'core',
    title: { uz: 'Boshqaruv Oqimi (Control Flow)', en: 'Control Flow' },
    description: {
      uz: "Taqqoslash operatorlari, mantiqiy ifodalar, if/elif/else shartlari, for va while sikllari, break/continue.",
      en: 'Comparison operators, Boolean logic, if/elif/else branching, for and while loops, break and continue.',
    },
    difficulty: 'beginner',
    estimatedHours: 6,
    prerequisites: ['variables_types'],
    objectives: {
      uz: ['Shartli mantiq tuzish', 'for va while sikllarini samarali qo‘llash', 'break, continue va pass farqini bilish'],
      en: ['Write clear conditional branches', 'Iterate with for and while loops', 'Control loops using break and continue'],
    },
    modules: [
      { id: 'ctl_cond', title: { uz: 'Shart operatorlari (if/elif/else)', en: 'Conditionals (if/elif/else)' }, order: 1 },
      { id: 'ctl_loops', title: { uz: 'Takrorlanishlar (for / while)', en: 'Loops (for / while)' }, order: 2 },
    ],
  },
  {
    id: 'data_structures',
    number: 4,
    category: 'core',
    title: { uz: "Ma'lumot Tuzilmalari", en: 'Data Structures' },
    description: {
      uz: 'List, Tuple, Set, Dictionary, indekslash, slicing, metodlar va comprehension yozuvlari.',
      en: 'Lists, tuples, sets, dictionaries, indexing, slicing, methods, and comprehensions.',
    },
    difficulty: 'beginner',
    estimatedHours: 8,
    prerequisites: ['control_flow'],
    objectives: {
      uz: ["To'g'ri ma'lumot tuzilmasini tanlash", 'Slicing va dictionary metodlarini qo‘llash', 'List/Dict comprehension yozish'],
      en: ['Select the right collection type', 'Master slicing and dictionary methods', 'Write concise list/dict comprehensions'],
    },
    modules: [
      { id: 'ds_seq', title: { uz: 'List va Tuple', en: 'Lists & Tuples' }, order: 1 },
      { id: 'ds_map', title: { uz: 'Set, Dictionary va Comprehension', en: 'Sets, Dicts & Comprehensions' }, order: 2 },
    ],
  },
  {
    id: 'functions',
    number: 5,
    category: 'core',
    title: { uz: 'Funksiyalar', en: 'Functions' },
    description: {
      uz: 'def, parametr va argumentlar, return, default qiymatlar, *args/**kwargs, scope, lambda va rekursiya.',
      en: 'Defining functions, parameters, return values, default/keyword args, scope, lambda, and recursion.',
    },
    difficulty: 'intermediate',
    estimatedHours: 6,
    prerequisites: ['data_structures'],
    objectives: {
      uz: ['Modulli va qayta ishlatiladigan funksiyalar yozish', 'Scope (LEGB) qoidasini tushunish', 'Rekursiya va lambda ni qo‘llash'],
      en: ['Design modular reusable functions', 'Understand LEGB scope', 'Apply lambda and recursion responsibly'],
    },
    modules: [
      { id: 'fn_core', title: { uz: 'Funksiya asoslari va argumentlar', en: 'Function Basics & Arguments' }, order: 1 },
      { id: 'fn_adv', title: { uz: 'Scope, Lambda va Rekursiya', en: 'Scope, Lambda & Recursion' }, order: 2 },
    ],
  },
  {
    id: 'oop',
    number: 6,
    category: 'core',
    title: { uz: "Obyektga Yo'naltirilgan Dasturlash (OOP)", en: 'Object-Oriented Programming' },
    description: {
      uz: 'Class, Object, __init__, atributlar, metodlar, Inkapsulyatsiya, Merosxo‘rlik, Polimorfizm va Dunder metodlar.',
      en: 'Classes, objects, constructors, attributes, encapsulation, inheritance, polymorphism, and magic methods.',
    },
    difficulty: 'intermediate',
    estimatedHours: 8,
    prerequisites: ['functions'],
    objectives: {
      uz: ['Klass va obyektlarni loyihalash', 'Inheritance va Composition farqini bilish', '__str__, __repr__ kabi maxsus metodlarni yozish'],
      en: ['Model real entities with classes', 'Choose composition vs inheritance', 'Implement dunder methods'],
    },
    modules: [
      { id: 'oop_base', title: { uz: 'Klasslar va Obyektlar', en: 'Classes & Objects' }, order: 1 },
      { id: 'oop_pillars', title: { uz: "Merosxo'rlik va Polimorfizm", en: 'Inheritance & Polymorphism' }, order: 2 },
    ],
  },
  {
    id: 'files_exceptions',
    number: 7,
    category: 'core',
    title: { uz: 'Fayllar va Istisnolar (Exceptions)', en: 'Files and Exceptions' },
    description: {
      uz: 'Fayllarni o‘qish/yozish, pathlib, JSON, CSV, try/except/else/finally va maxsus xatolar (Custom Exceptions).',
      en: 'Reading/writing files, pathlib, JSON, CSV, try/except/else/finally, and custom exceptions.',
    },
    difficulty: 'intermediate',
    estimatedHours: 5,
    prerequisites: ['oop'],
    objectives: {
      uz: ['with open() kontekst menejeridan foydalanish', 'JSON va CSV ma’lumotlarini qayta ishlash', 'Xatolarni xavfsiz boshqarish'],
      en: ['Use context managers safely', 'Parse and serialize JSON/CSV', 'Handle runtime errors gracefully'],
    },
    modules: [
      { id: 'fe_files', title: { uz: 'Fayllar, JSON va CSV', en: 'Files, JSON & CSV' }, order: 1 },
      { id: 'fe_exc', title: { uz: 'Xatolarni boshqarish', en: 'Exception Handling' }, order: 2 },
    ],
  },
  {
    id: 'modules_packages',
    number: 8,
    category: 'engineering',
    title: { uz: 'Modullar va Paketlar', en: 'Modules and Packages' },
    description: {
      uz: 'import mexanizmi, standart kutubxona, pip, virtual environment (venv) va loyiha tuzilmasi.',
      en: 'Imports, standard library, pip, virtual environments, package layout, and requirements.',
    },
    difficulty: 'intermediate',
    estimatedHours: 4,
    prerequisites: ['files_exceptions'],
    objectives: {
      uz: ['Kodni modullarga to‘g‘ri bo‘lish', 'venv yaratish va boshqarish', 'Standart kutubxonadan unumli foydalanish'],
      en: ['Organize multi-file packages', 'Isolate dependencies with venv', 'Leverage Python standard library'],
    },
    modules: [
      { id: 'mod_std', title: { uz: 'Import va Standart Kutubxona', en: 'Imports & Standard Library' }, order: 1 },
    ],
  },
];

export const CORE_LESSONS: Lesson[] = [
  {
    id: 'PY-FND-001',
    courseId: 'python_fundamentals',
    moduleId: 'fnd_intro',
    order: 1,
    title: { uz: 'Dasturlash, Algoritm va Python nima?', en: 'What are Programming, Algorithms, and Python?' },
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: [],
    conceptId: 'foundations',
    objectives: {
      uz: ['Dastur va algoritm o‘rtasidagi farqni tushunish', 'Python nega eng mashhur tillardan biri ekanini bilish', 'Interpreter qanday ishlashini anglash'],
      en: ['Understand what a program and algorithm are', 'Learn why Python is widely adopted', 'See how the Python interpreter executes code'],
    },
    theory: {
      uz: `## Dasturlash nima?
**Programming (dasturlash)** — bu kompyuterga aniq, ketma-ket va mantiqiy ko'rsatmalar (**instructions**) berish jarayonidir.

### Algoritm (Algorithm)
**Algorithm** — muammoni hal qilish uchun tuzilgan aniq qadamlar ketma-ketligi. Masalan, choy damlash ham oddiy algoritmdir:
1. Choynakka suv quying.
2. Suvni qaynating.
3. Choy bargini soling va damlang.

Kompyuterlar inson kabi taxmin qila olmaydi — ular faqat siz yozgan aniq buyruqni bajaradi.

### Nega aynan Python?
**Python** 1991-yilda Guido van Rossum tomonidan yaratilgan yuqori darajadagi (**high-level**), o'qishga oson va ko'p qirrali dasturlash tilidir:
- **Backend veb-dasturlash**: Django, FastAPI
- **Sun'iy intellekt va Data Science**: PyTorch, Pandas, NumPy
- **Avtomatlashtirish va DevOps**: skriptlar, testlash, tizim boshqaruvi

Python **interpreted** til bo'lib, yozgan kodingizni **Python Interpreter** qatorma-qator o'qib bajaradi.`,
      en: `## What is Programming?
**Programming** is the craft of writing clear, step-by-step logical **instructions** that a computer can execute reliably.

### Algorithms
An **algorithm** is a finite, unambiguous sequence of steps to solve a problem. Computers cannot guess intent — every edge case must be expressed explicitly.

### Why Python?
Created by Guido van Rossum in 1991, **Python** is a high-level, readable, general-purpose language powering:
- **Backend engineering**: FastAPI, Django
- **Data Science & AI**: NumPy, Pandas, PyTorch
- **Automation & Scripting**: CLI tools, testing, DevOps

Python uses an **interpreter** to read and execute your code line by line.`,
    },
    examples: [
      {
        title: { uz: 'Python versiyasini va oddiy hisobni tekshirish', en: 'Checking Python version & simple math' },
        code: `import sys

print("Salom, Python dunyosi!")
print("Python versiyasi:", sys.version.split()[0])
print("2 + 3 * 4 =", 2 + 3 * 4)`,
        explanation: {
          uz: '`sys` moduli tizimdagi Python versiyasini ko‘rsatadi, `print()` esa natijani konsolga chiqaradi.',
          en: '`sys` exposes interpreter metadata, while `print()` writes output to standard output.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'Algoritm deb nimaga aytiladi?', en: 'What is an algorithm?' },
        options: {
          uz: ['Faqat kompyuter qurilmasi', 'Muammoni yechish uchun aniq qadamlar ketma-ketligi', 'Internet brauzeri', 'Matn muharriri'],
          en: ['A hardware component', 'A clear step-by-step sequence to solve a problem', 'A web browser', 'A text editor'],
        },
        correctIndex: 1,
        explanation: {
          uz: 'Algoritm — natijaga olib boruvchi aniq buyruqlar ketma-ketligidir.',
          en: 'An algorithm is an ordered, unambiguous procedure for solving a task.',
        },
      },
    ],
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-CS50P-002'],
    relatedExercises: ['EX-001'],
  },
  {
    id: 'PY-FND-002',
    courseId: 'python_fundamentals',
    moduleId: 'fnd_first',
    order: 2,
    title: { uz: 'print(), Izohlar (Comments) va Sintaksis', en: 'print(), Comments, and Basic Syntax' },
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-FND-001'],
    conceptId: 'foundations',
    objectives: {
      uz: ['print() funksiyasidan sep va end bilan foydalanish', 'Bir qatorli va ko‘p qatorli izoh yozish', 'Indentation (bo‘sh joy) qoidasini tushunish'],
      en: ['Use print() with sep and end arguments', 'Write meaningful comments', 'Understand Python indentation rules'],
    },
    theory: {
      uz: `## print() funksiyasi
\`print()\` ekranga matn yoki qiymat chiqarish uchun ishlatiladigan standart (**built-in**) funksiyadir.

### Izohlar (Comments)
Kod nima uchun yozilganini tushuntirish uchun \`#\` belgisidan foydalaniladi. Interpreter \`#\` dan keyingi matnni bajarmaydi:
\`\`\`python
# Bu bir qatorli izoh (single-line comment)
print("Dastur ishga tushdi")
\`\`\`

### Sintaksis va Indentation
Boshqa tillardan (C++, Java) farqli o'laroq, Python kod bloklarini qavslar \`{}\` bilan emas, balki **indentation** (odatda 4 ta bo'sh joy) bilan ajratadi. Noto'g'ri bo'sh joy \`IndentationError\` ga olib keladi.`,
      en: `## The print() Function
\`print()\` is Python's built-in output function. You can customize separators with \`sep\` and line endings with \`end\`.

### Comments
Comments start with \`#\` and are ignored by the interpreter. Use them to explain *why* code exists, not just *what* it does.

### Indentation
Python defines code blocks using **indentation** (4 spaces per level by PEP 8 convention) rather than curly braces.`,
    },
    examples: [
      {
        title: { uz: 'print() sep va end parametrlari', en: 'Using sep and end in print()' },
        code: `# Elementlar orasiga chiziqcha qo'yish
print("Python", "Mastery", "2026", sep=" - ")

# Bir qatorga ulab chiqarish
print("Yuklanmoqda", end="... ")
print("Tayyor!")`,
        explanation: {
          uz: '`sep` argumentlar orasidagi ajratuvchini, `end` esa qator oxiridagi belgini belgilaydi.',
          en: '`sep` controls the delimiter between arguments and `end` replaces the default newline.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "Python'da izoh (comment) qaysi belgi bilan boshlanadi?", en: 'Which symbol starts a single-line comment in Python?' },
        options: { uz: ['//', '/*', '#', '--'], en: ['//', '/*', '#', '--'] },
        correctIndex: 2,
        explanation: { uz: "Python'da bir qatorli izoh `#` bilan yoziladi.", en: 'Python single-line comments begin with `#`.' },
      },
    ],
    relatedVideos: ['VIDEO-CS50P-001'],
    relatedExercises: ['EX-001'],
  },
  {
    id: 'PY-VAR-001',
    courseId: 'variables_types',
    moduleId: 'var_basics',
    order: 1,
    title: { uz: "O'zgaruvchilar (Variables) va Asosiy Turlar", en: 'Variables and Primitive Data Types' },
    difficulty: 'beginner',
    estimatedMinutes: 40,
    prerequisites: ['PY-FND-002'],
    conceptId: 'variables',
    objectives: {
      uz: ["str, int, float, bool turlarini farqlash", "type() funksiyasi bilan turni tekshirish", "snake_case nomlash qoidasini qo‘llash"],
      en: ['Differentiate str, int, float, and bool', 'Inspect types with type()', 'Apply PEP 8 snake_case naming'],
    },
    theory: {
      uz: `## Variable (O'zgaruvchi) nima?
**Variable** — qiymatga biriktirilgan nom. Python'da **snake_case** uslubi tavsiya etiladi: \`student_name\`, \`total_score\`.

### 4 ta asosiy tur (Data Types):
1. **\`str\` (String)**: matn (\`"Toshkent"\`, \`'Python'\`)
2. **\`int\` (Integer)**: butun son (\`42\`, \`-7\`, \`0\`)
3. **\`float\` (Floating-point)**: o'nlik kasr son (\`3.14\`, \`-0.5\`)
4. **\`bool\` (Boolean)**: mantiqiy qiymat (\`True\` yoki \`False\`)

### Type Conversion (Turni o'zgartirish)
\`int("25")\` matnni songa, \`str(25)\` esa sonni matnga aylantiradi.`,
      en: `## Variables
A **variable** binds a name to a value in memory. Use descriptive \`snake_case\` names like \`student_age\` or \`course_count\`.

### Core Primitive Types
1. **\`str\`**: Unicode text
2. **\`int\`**: Arbitrary-precision whole numbers
3. **\`float\`**: IEEE 754 decimal numbers
4. **\`bool\`**: Logical \`True\` or \`False\`

Use \`int()\`, \`float()\`, \`str()\`, and \`bool()\` for explicit type conversion.`,
    },
    examples: [
      {
        title: { uz: "O'zgaruvchilar va type() tekshiruvi", en: 'Variables & type() inspection' },
        code: `course_name = "Python Mastery"
lesson_count = 45
rating = 4.9
is_active = True

print(f"{course_name}: {lesson_count} dars, reyting {rating}")
print(type(course_name), type(lesson_count), type(rating), type(is_active))`,
        explanation: {
          uz: 'f-string (`f"..."`) o‘zgaruvchilarni to‘g‘ridan-to‘g‘ri matn ichiga joylashtirish imkonini beradi.',
          en: 'f-strings cleanly interpolate expressions inside string literals.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "`type(10 / 2)` qanday natija qaytaradi?", en: 'What does `type(10 / 2)` return in Python 3?' },
        options: { uz: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"], en: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"] },
        correctIndex: 1,
        explanation: { uz: "`/` operatori Python 3 da har doim `float` qaytaradi (5.0).", en: 'True division `/` always yields a `float` (5.0).' },
      },
    ],
    relatedVideos: ['VIDEO-FCC-001'],
    relatedExercises: ['EX-002'],
  },
  {
    id: 'PY-VAR-002',
    courseId: 'variables_types',
    moduleId: 'var_strings',
    order: 2,
    title: { uz: "String metodlari va Arifmetik operatorlar", en: 'String Methods and Operators' },
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-VAR-001'],
    conceptId: 'variables',
    objectives: {
      uz: ['strip(), lower(), upper(), split(), replace() metodlarini ishlatish', '// (floor division), % (modulo) va ** (daraja) operatorlarini bilish'],
      en: ['Use strip, lower, upper, split, and replace', 'Apply //, %, and ** arithmetic operators'],
    },
    theory: {
      uz: `## String metodlari
Matnlar **immutable** (o'zgarmas) bo'lgani uchun metodlar yangi matn qaytaradi:
- \`.strip()\` — boshi va oxiridagi bo'sh joylarni olib tashlaydi
- \`.lower()\` / \`.upper()\` — harflarni kichik/katta qiladi
- \`.split()\` — matnni bo'lib \`list\` qaytaradi

### Muhim arifmetik operatorlar
- \`//\` — butun bo'lish (\`17 // 5 == 3\`)
- \`%\` — bo'lishdan qolgan qoldiq (\`17 % 5 == 2\`)
- \`**\` — darajaga ko'tarish (\`2 ** 5 == 32\`)`,
      en: `## String Methods
Strings are immutable, so methods return new strings: \`.strip()\`, \`.lower()\`, \`.upper()\`, \`.split()\`, and \`.replace()\`.

### Key Arithmetic Operators
- \`//\` floor division (\`17 // 5 == 3\`)
- \`%\` modulo remainder (\`17 % 5 == 2\`)
- \`**\` exponentiation (\`2 ** 5 == 32\`)`,
    },
    examples: [
      {
        title: { uz: 'Matn tozalash va qoldiqni hisoblash', en: 'Cleaning text and modulo' },
        code: `raw_input = "   Salom Python   "
clean = raw_input.strip().upper()
print(clean)
print("So'zlar:", clean.split())
print("17 // 5 =", 17 // 5, "qoldiq =", 17 % 5)`,
        explanation: {
          uz: 'Metodlarni nuqta bilan ketma-ket (chaining) chaqirish mumkin.',
          en: 'String methods can be chained cleanly from left to right.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "`'  salom  '.strip()` nimani qaytaradi?", en: "What does `'  salom  '.strip()` return?" },
        options: { uz: ["'  salom'", "'salom  '", "'salom'", "'salom '"], en: ["'  salom'", "'salom  '", "'salom'", "'salom '"] },
        correctIndex: 2,
        explanation: { uz: 'strip() ikki tomondagi bo‘sh joylarni olib tashlaydi.', en: 'strip() trims whitespace from both ends.' },
      },
    ],
    relatedVideos: ['VIDEO-COREY-001'],
    relatedExercises: ['EX-001', 'EX-002'],
  },
  {
    id: 'PY-CTL-001',
    courseId: 'control_flow',
    moduleId: 'ctl_cond',
    order: 1,
    title: { uz: 'Shart operatorlari (if / elif / else)', en: 'Conditional Statements (if / elif / else)' },
    difficulty: 'beginner',
    estimatedMinutes: 40,
    prerequisites: ['PY-VAR-002'],
    conceptId: 'control_flow',
    objectives: {
      uz: ['Taqqoslash (==, !=, <, >=) va mantiqiy (and, or, not) operatorlarni qo‘llash', 'if / elif / else shoxlanishini yozish'],
      en: ['Use comparison and boolean operators', 'Branch execution with if / elif / else'],
    },
    theory: {
      uz: `## Shartli mantiq (Conditional Logic)
Dastur qaror qabul qilishi uchun \`if\`, \`elif\` (aks holda agar) va \`else\` (aks holda) ishlatiladi.

\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 75:
    grade = "B"
else:
    grade = "C"
\`\`\`

### Mantiqiy operatorlar:
- \`and\` — ikkala shart ham \`True\` bo'lsa
- \`or\` — kamida bitta shart \`True\` bo'lsa
- \`not\` — mantiqiy qiymatni teskarisiga aylantiradi`,
      en: `## Conditional Branching
Use \`if\`, \`elif\`, and \`else\` to route execution based on Boolean conditions combined with \`and\`, \`or\`, and \`not\`.`,
    },
    examples: [
      {
        title: { uz: 'Baholash tizimi misoli', en: 'Grading logic example' },
        code: `score = 88
attendance = 92

if score >= 85 and attendance >= 80:
    print("Imtihondan a'lo natija bilan o'tdingiz!")
elif score >= 60:
    print("Imtihondan o'tdingiz.")
else:
    print("Qayta tayyorlanish tavsiya etiladi.")`,
        explanation: {
          uz: 'Birinchi rost bo‘lgan shart bloki bajariladi, qolganlari tekshirilmaydi.',
          en: 'Python executes the first matching branch and skips the remaining conditions.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "`True and False or True` natijasi nima?", en: 'What does `True and False or True` evaluate to?' },
        options: { uz: ['True', 'False', 'None', 'Error'], en: ['True', 'False', 'None', 'Error'] },
        correctIndex: 0,
        explanation: { uz: '`and` ustuvorligi `or` dan yuqori: `(True and False) or True` -> `False or True` -> `True`.', en: '`and` binds tighter than `or`, yielding `True`.' },
      },
    ],
    relatedVideos: ['VIDEO-CS50P-001'],
    relatedExercises: ['EX-003', 'EX-004'],
  },
  {
    id: 'PY-CTL-002',
    courseId: 'control_flow',
    moduleId: 'ctl_loops',
    order: 2,
    title: { uz: 'Sikllar: for, while, break va continue', en: 'Loops: for, while, break, and continue' },
    difficulty: 'beginner',
    estimatedMinutes: 45,
    prerequisites: ['PY-CTL-001'],
    conceptId: 'control_flow',
    objectives: {
      uz: ['for sikli va range() bilan ishlash', 'while siklida cheksiz aylanishdan saqlanish', 'break va continue ni to‘g‘ri qo‘llash'],
      en: ['Iterate with for and range()', 'Avoid infinite while loops', 'Control iteration with break and continue'],
    },
    theory: {
      uz: `## for va while sikllari
Takrorlanuvchi amallarni bajarish uchun sikllar (**loops**) ishlatiladi:
- **\`for\`**: ma'lum to'plam yoki \`range(start, stop, step)\` bo'ylab yuradi.
- **\`while\`**: shart \`True\` bo'lib turgancha davom etadi.

\`break\` sikldan darhol chiqadi, \`continue\` esa joriy qadamni tashlab keyingi iteratsiyaga o'tadi.`,
      en: `## Loops in Python
Use \`for\` to iterate over sequences or \`range()\` intervals, and \`while\` when looping until a condition changes. \`break\` exits immediately; \`continue\` advances to the next iteration.`,
    },
    examples: [
      {
        title: { uz: 'for va while bilan yig‘indi', en: 'Summing with for and while' },
        code: `evens = []
for i in range(1, 11):
    if i % 2 != 0:
        continue
    evens.append(i)
print("Juft sonlar:", evens)

n = 3
while n > 0:
    print("Sanash:", n)
    n -= 1`,
        explanation: {
          uz: 'Toq sonlarda `continue` ishlab, faqat juft sonlar `evens` ga qo‘shiladi.',
          en: '`continue` skips odd numbers so only even integers are appended.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'Siklni muddatidan oldin to‘liq to‘xtatuvchi kalit so‘z qaysi?', en: 'Which keyword terminates a loop early?' },
        options: { uz: ['continue', 'pass', 'break', 'stop'], en: ['continue', 'pass', 'break', 'stop'] },
        correctIndex: 2,
        explanation: { uz: '`break` siklni to‘xtatadi.', en: '`break` immediately exits the enclosing loop.' },
      },
    ],
    relatedVideos: ['VIDEO-CS50P-001'],
    relatedExercises: ['EX-003', 'EX-004'],
  },
  {
    id: 'PY-DS-001',
    courseId: 'data_structures',
    moduleId: 'ds_seq',
    order: 1,
    title: { uz: "List va Tuple: Tartiblangan ma'lumotlar", en: 'Lists and Tuples' },
    difficulty: 'beginner',
    estimatedMinutes: 45,
    prerequisites: ['PY-CTL-002'],
    conceptId: 'data_structures',
    objectives: {
      uz: ['List indekslash va slicing ([start:stop:step])', 'append, pop, sort metodlari', 'Mutable (list) vs Immutable (tuple) farqi'],
      en: ['Index and slice sequences', 'Use append, pop, and sort', 'Contrast mutable lists with immutable tuples'],
    },
    theory: {
      uz: `## List (Ro'yxat) va Tuple
- **\`list\`** \`[...]\` — **mutable** (element qo'shish, o'chirish, o'zgartirish mumkin).
- **\`tuple\`** \`(...)\` — **immutable** (yaratilgandan keyin o'zgarmaydi, tezkorroq va xavfsizroq).

### Slicing (Kesib olish)
\`nums[1:4]\` 1-indeksdan 3-indeksgacha bo'lgan qismni qaytaradi. \`nums[::-1]\` ro'yxatni teskari aylantiradi.`,
      en: `## Lists vs Tuples
A \`list\` is mutable and dynamic; a \`tuple\` is immutable and ideal for fixed coordinates or records. Both support zero-based indexing and \`[start:stop:step]\` slicing.`,
    },
    examples: [
      {
        title: { uz: 'Slicing va list metodlari', en: 'Slicing and list operations' },
        code: `languages = ["Python", "SQL", "FastAPI", "Docker"]
print("Birinchi ikkitasi:", languages[:2])
print("Oxirgisi:", languages[-1])

languages.append("Git")
languages.sort()
print("Tartiblangan:", languages)

point = (41.3, 69.2)
lat, lon = point  # unpacking
print(f"Kenglik: {lat}, Uzunlik: {lon}")`,
        explanation: {
          uz: 'Tuple unpacking orqali qiymatlarni bir qatorda o‘zgaruvchilarga ajratish juda qulay.',
          en: 'Tuple unpacking assigns sequence items cleanly into named variables.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "`[10, 20, 30, 40][1:3]` natijasi nima?", en: 'What does `[10, 20, 30, 40][1:3]` evaluate to?' },
        options: { uz: ['[10, 20]', '[20, 30]', '[20, 30, 40]', '[10, 20, 30]'], en: ['[10, 20]', '[20, 30]', '[20, 30, 40]', '[10, 20, 30]'] },
        correctIndex: 1,
        explanation: { uz: 'Slicing start (1) ni oladi, stop (3) kirmaydi: indekslar 1 va 2 -> [20, 30].', en: 'Stop index 3 is exclusive, returning indices 1 and 2.' },
      },
    ],
    relatedVideos: ['VIDEO-COREY-001'],
    relatedExercises: ['EX-006', 'EX-007'],
  },
  {
    id: 'PY-DS-002',
    courseId: 'data_structures',
    moduleId: 'ds_map',
    order: 2,
    title: { uz: "Dictionary, Set va Comprehensions", en: 'Dictionaries, Sets, and Comprehensions' },
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    prerequisites: ['PY-DS-001'],
    conceptId: 'data_structures',
    objectives: {
      uz: ['dict.get() va .items() bilan ishlash', 'Set to‘plam amallari (union, intersection)', 'List va Dict comprehension yozish'],
      en: ['Iterate dictionaries safely with .get() and .items()', 'Use set operations for uniqueness', 'Write Pythonic comprehensions'],
    },
    theory: {
      uz: `## Dictionary va Set
- **\`dict\`**: \`{"kalit": qiymat}\` — har qanday kalit bo'yicha ma'lumotni **O(1)** tezlikda topadi.
- **\`set\`**: takrorlanmas elementlar to'plami. \`a & b\` kesishma, \`a | b\` birlashma beradi.

### List Comprehension
\`\`\`python
squares = [x ** 2 for x in range(1, 6)]
\`\`\``,
      en: `## Dictionaries, Sets, and Comprehensions
Dictionaries provide O(1) key-value lookup, sets enforce uniqueness and fast membership checks, and comprehensions express transformations concisely.`,
    },
    examples: [
      {
        title: { uz: 'Dictionary va Comprehension amaliyoti', en: 'Dict & comprehension practice' },
        code: `scores = {"Ali": 88, "Laylo": 95, "Bobur": 72}
for name, pts in scores.items():
    print(f"{name}: {pts}")

passed = [name for name, pts in scores.items() if pts >= 80]
print("O'tganlar:", passed)

a = {1, 2, 3}
b = {2, 3, 4}
print("Umumiy:", a & b)`,
        explanation: {
          uz: 'List comprehension shartli filtrlash va transformatsiyani bir qatorda bajaradi.',
          en: 'Comprehension filters and transforms dictionary entries cleanly.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "Bo'sh set yaratishning to'g'ri usuli qaysi?", en: 'How do you create an empty set in Python?' },
        options: { uz: ['{}', 'set()', '[]', 'empty_set()'], en: ['{}', 'set()', '[]', 'empty_set()'] },
        correctIndex: 1,
        explanation: { uz: '`{}` bo‘sh dictionary yaratadi; bo‘sh set uchun `set()` yoziladi.', en: '`{}` creates an empty dict; use `set()` for an empty set.' },
      },
    ],
    relatedVideos: ['VIDEO-COREY-001'],
    relatedExercises: ['EX-005', 'EX-006'],
  },
  {
    id: 'PY-FN-001',
    courseId: 'functions',
    moduleId: 'fn_core',
    order: 1,
    title: { uz: 'Funksiyalar, Parametrlar va Return', en: 'Defining Functions, Parameters, and Return' },
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-DS-002'],
    conceptId: 'functions',
    objectives: {
      uz: ['def va return kalit so‘zlarini to‘g‘ri qo‘llash', 'Default va keyword argumentlar berish', 'Type hints va docstring yozish'],
      en: ['Write pure functions with def and return', 'Use default and keyword arguments', 'Document functions with docstrings and type hints'],
    },
    theory: {
      uz: `## Funksiyalar (Functions)
Funksiya — kodni takrorlamaslik (**DRY — Don't Repeat Yourself**) va mantiqni testlanadigan qismlarga ajratish uchun asosiy vosita.

- **\`return\`** qiymatni chaqiruvchiga qaytaradi (va funksiyani tugatadi).
- **Default argument**: \`def greet(name="Mehmon"): ...\`
- **Docstring**: funksiyaning birinchi qatoridagi \`"""..."""\` hujjati.`,
      en: `## Functions
Functions keep logic modular, testable, and reusable. Always return values rather than merely printing inside business-logic functions, and add type hints plus docstrings.`,
    },
    examples: [
      {
        title: { uz: 'Chegirma hisoblovchi toza funksiya', en: 'Discount calculator function' },
        code: `def apply_discount(price: float, percent: float = 10.0) -> float:
    """Berilgan narxga foizli chegirma qo'llaydi."""
    if price < 0 or not 0 <= percent <= 100:
        raise ValueError("Noto'g'ri narx yoki foiz")
    return round(price * (1 - percent / 100), 2)

print(apply_discount(200_000))
print(apply_discount(200_000, percent=25))`,
        explanation: {
          uz: 'Default argument `percent=10.0` qiymat berilmaganda avtomatik qo‘llanadi.',
          en: 'Default parameters provide sensible fallbacks while keyword args improve readability.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "`return` yozilmagan funksiya nimani qaytaradi?", en: 'What does a function without a `return` statement return?' },
        options: { uz: ['0', '""', 'None', 'False'], en: ['0', '""', 'None', 'False'] },
        correctIndex: 2,
        explanation: { uz: 'Python funksiyalari sukut bo‘yicha `None` qaytaradi.', en: 'Functions implicitly return `None` if no value is returned.' },
      },
    ],
    relatedVideos: ['VIDEO-COREY-001'],
    relatedExercises: ['EX-001', 'EX-007'],
  },
  {
    id: 'PY-FN-002',
    courseId: 'functions',
    moduleId: 'fn_adv',
    order: 2,
    title: { uz: 'Scope (LEGB), Lambda va Rekursiya', en: 'Scope, Lambda, and Recursion' },
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    prerequisites: ['PY-FN-001'],
    conceptId: 'functions',
    objectives: {
      uz: ['Local vs Global scope ni tushunish', 'lambda qisqa funksiyalarini sorted() bilan ishlatish', 'Rekursiyada base case muhimligini bilish'],
      en: ['Understand LEGB variable scope', 'Use lambda with sorted()', 'Write safe recursive functions with a base case'],
    },
    theory: {
      uz: `## LEGB Scope va Lambda
Python o'zgaruvchilarni **L**ocal -> **E**nclosing -> **G**lobal -> **B**uilt-in tartibida qidiradi.

**\`lambda\`** — bir qatorli nomsiz funksiya: \`lambda x: x * 2\`.

**Recursion** — funksiya o'zini o'zi chaqirishi. Har doim to'xtash sharti (**base case**) bo'lishi shart!`,
      en: `## Scope, Lambda, and Recursion
Python resolves names in LEGB order (Local, Enclosing, Global, Built-in). Use \`lambda\` for short inline key functions, and always include a base case in recursive functions.`,
    },
    examples: [
      {
        title: { uz: 'Lambda saralash va Rekursiv faktorial', en: 'Lambda sorting and recursive factorial' },
        code: `students = [("Alisher", 85), ("Zarina", 96), ("Kamol", 79)]
by_score = sorted(students, key=lambda item: item[1], reverse=True)
print("Reyting:", by_score)

def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print("5! =", factorial(5))`,
        explanation: {
          uz: '`factorial(n)` funksiyasida `n <= 1` to‘xtash sharti cheksiz rekursiyaning oldini oladi.',
          en: 'The base case `n <= 1` ensures recursion terminates cleanly.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'Rekursiv funksiyada base case bo‘lmasa nima sodir bo‘ladi?', en: 'What happens if a recursive function lacks a base case?' },
        options: { uz: ['0 qaytaradi', 'RecursionError yuzaga keladi', 'Avtomatik to‘xtaydi', 'SyntaxError beradi'], en: ['Returns 0', 'Raises RecursionError', 'Stops automatically', 'Raises SyntaxError'] },
        correctIndex: 1,
        explanation: { uz: 'Call stack to‘lib, `RecursionError` ko‘tariladi.', en: 'The call stack overflows and Python raises `RecursionError`.' },
      },
    ],
    relatedVideos: ['VIDEO-COREY-001'],
    relatedExercises: ['EX-007'],
  },
  {
    id: 'PY-OOP-001',
    courseId: 'oop',
    moduleId: 'oop_base',
    order: 1,
    title: { uz: 'Klasslar, Obyektlar va Konstruktor (__init__)', en: 'Classes, Objects, and Constructors' },
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    prerequisites: ['PY-FN-002'],
    conceptId: 'oop',
    objectives: {
      uz: ['class va self tushunchasini anglash', 'Instance atributlar va metodlar yozish', '__repr__ va @property qo‘llash'],
      en: ['Understand class, instance, and self', 'Define instance attributes and methods', 'Implement __repr__ and @property'],
    },
    theory: {
      uz: `## OOP — Obyektga Yo'naltirilgan Dasturlash
**Class** — ma'lumot (attributes) va harakatlarni (methods) birlashtiruvchi shablon.
**Object (instance)** — shu klass asosida yaratilgan aniq obyekt.

\`self\` parametr sifatida har bir metodda hozirgi obyektning o'zini bildiradi.`,
      en: `## Classes and Objects
A \`class\` bundles data (attributes) and behavior (methods). \`self\` refers to the specific instance on which a method is called.`,
    },
    examples: [
      {
        title: { uz: 'Talaba klassi', en: 'Student class example' },
        code: `class Learner:
    def __init__(self, name: str, track: str) -> None:
        self.name = name
        self.track = track
        self.xp = 0

    def complete_lesson(self, points: int = 20) -> None:
        self.xp += points

    def __repr__(self) -> str:
        return f"Learner(name={self.name!r}, xp={self.xp})"

user = Learner("Jasur", "Backend Python")
user.complete_lesson(50)
print(user)`,
        explanation: {
          uz: '`__repr__` obyektni `print()` qilganda chiroyli va tushunarli ko‘rinishda chiqaradi.',
          en: '`__repr__` provides a clear developer-friendly string representation.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: "Klass metodidagi birinchi parametr `self` nimani anglatadi?", en: 'What does `self` refer to inside an instance method?' },
        options: { uz: ['Global namespace', 'Joriy obyekt (instance) ning o‘zi', 'Ota klass', 'Python moduli'], en: ['Global namespace', 'The current object instance', 'Parent class', 'Python module'] },
        correctIndex: 1,
        explanation: { uz: '`self` chaqirilayotgan obyekt nusxasiga havoladir.', en: '`self` is a reference to the instance invoking the method.' },
      },
    ],
    relatedVideos: ['VIDEO-COREY-001'],
    relatedExercises: ['EX-008'],
  },
  {
    id: 'PY-OOP-002',
    courseId: 'oop',
    moduleId: 'oop_pillars',
    order: 2,
    title: { uz: "Merosxo'rlik (Inheritance) va Polimorfizm", en: 'Inheritance, Polymorphism, and Composition' },
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    prerequisites: ['PY-OOP-001'],
    conceptId: 'oop',
    objectives: {
      uz: ['Ota klassdan meros olish va super()', 'Metodlarni override qilish (Polimorfizm)', 'Composition qachon afzalligini bilish'],
      en: ['Subclass and call super()', 'Override methods for polymorphism', 'Prefer composition when appropriate'],
    },
    theory: {
      uz: `## Inheritance va Polymorphism
**Inheritance** orqali yangi klass mavjud klass xususiyatlarini meros qilib oladi.
**Polymorphism** — bir xil metod nomi (\`area()\`, \`notify()\`) turli klasslarda turlicha ishlashi.`,
      en: `## Inheritance & Polymorphism
Subclasses reuse and extend parent behavior via \`super()\`, while polymorphism lets different classes implement a common interface cleanly.`,
    },
    examples: [
      {
        title: { uz: 'Xabarnoma klasslari (Polimorfizm)', en: 'Notification polymorphism' },
        code: `class Notifier:
    def send(self, msg: str) -> str:
        raise NotImplementedError

class EmailNotifier(Notifier):
    def send(self, msg: str) -> str:
        return f"[Email] {msg}"

class TelegramNotifier(Notifier):
    def send(self, msg: str) -> str:
        return f"[Telegram] {msg}"

for channel in [EmailNotifier(), TelegramNotifier()]:
    print(channel.send("Dars tayyor!"))`,
        explanation: {
          uz: 'Bir xil `.send()` chaqiruvi har xil kanallarda o‘ziga xos natija beradi.',
          en: 'Uniform `.send()` calls dispatch dynamically to each subclass implementation.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: 'Ota klass konstruktorini chaqirish uchun nima ishlatiladi?', en: 'How do you call the parent class initializer?' },
        options: { uz: ['parent().__init__()', 'super().__init__()', 'base.__init__()', 'self.parent()'], en: ['parent().__init__()', 'super().__init__()', 'base.__init__()', 'self.parent()'] },
        correctIndex: 1,
        explanation: { uz: '`super().__init__()` ota klass konstruktorini ishga tushiradi.', en: '`super().__init__()` invokes the parent initializer.' },
      },
    ],
    relatedVideos: ['VIDEO-COREY-001'],
    relatedExercises: ['EX-008'],
  },
  {
    id: 'PY-FE-001',
    courseId: 'files_exceptions',
    moduleId: 'fe_files',
    order: 1,
    title: { uz: 'Fayllar, JSON va Context Managers (with)', en: 'Files, JSON, and Context Managers' },
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-OOP-002'],
    conceptId: 'files_exceptions',
    objectives: {
      uz: ['with open() bilan fayl resurslarini avtomatik yopish', 'json.loads() va json.dumps() bilan ishlash', 'Try/except bilan xavfsiz o‘qish'],
      en: ['Manage file handles safely with `with`', 'Serialize/deserialize JSON', 'Combine file I/O with exception handling'],
    },
    theory: {
      uz: `## Fayllar va JSON
\`with open("data.json", "r", encoding="utf-8") as f:\` strukturasi xato yuz bersa ham faylni avtomatik yopadi.
**JSON** — veb API va konfiguratsiyalarda eng keng tarqalgan ma'lumot almashish formatidir.`,
      en: `## Context Managers & JSON
Using \`with open(...)\` guarantees files close even if an exception occurs. The \`json\` module converts seamlessly between Python dicts/lists and JSON text.`,
    },
    examples: [
      {
        title: { uz: 'JSON serializatsiya va deserializatsiya', en: 'JSON serialization & parsing' },
        code: `import json

profile = {"username": "dilnoza", "level": "intermediate", "goals": ["FastAPI", "SQL"]}
payload = json.dumps(profile, indent=2)
print(payload)

restored = json.loads(payload)
print("Tiklangan username:", restored["username"])`,
        explanation: {
          uz: '`json.dumps` Python obyektini matnga, `json.loads` esa matnni yana Python dict ga aylantiradi.',
          en: '`json.dumps` serializes to string; `json.loads` parses JSON back to Python objects.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: '`with open(...)` blokining asosiy afzalligi nima?', en: 'What is the main benefit of `with open(...)`?' },
        options: { uz: ['Faylni shifrlaydi', 'Blok tugagach faylni avtomatik yopadi', 'Internetga yuklaydi', 'Fayl hajmini kichraytiradi'], en: ['Encrypts the file', 'Automatically closes the file even on errors', 'Uploads to cloud', 'Compresses the file'] },
        correctIndex: 1,
        explanation: { uz: 'Context manager `__exit__` metodi orqali faylni har qanday holatda yopadi.', en: 'The context manager ensures the file descriptor is always closed.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: ['EX-009'],
  },
  {
    id: 'PY-FE-002',
    courseId: 'files_exceptions',
    moduleId: 'fe_exc',
    order: 2,
    title: { uz: 'try / except / else / finally va Custom Exceptions', en: 'Exception Handling & Custom Exceptions' },
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-FE-001'],
    conceptId: 'files_exceptions',
    objectives: {
      uz: ['Aniq xato turlarini (ValueError, KeyError) ushlash', 'finally blokining vazifasini bilish', 'O‘z Exception klassini yaratish'],
      en: ['Catch specific exceptions rather than bare except', 'Understand else and finally blocks', 'Define custom Exception subclasses'],
    },
    theory: {
      uz: `## Xatolarni boshqarish
Hech qachon bo'sh \`except:\` yozmang — aniq xatoni ushlang (\`except ValueError:\`).
- \`else\`: \`try\` ichida xato chiqmasa bajariladi.
- \`finally\`: xato chiqsa ham, chiqmasa ham har doim bajariladi.`,
      en: `## Clean Exception Handling
Always catch specific exception types (\`ValueError\`, \`ZeroDivisionError\`). \`else\` runs on success; \`finally\` always executes for cleanup.`,
    },
    examples: [
      {
        title: { uz: 'Xavfsiz bo‘lish va custom exception', en: 'Safe division and custom error' },
        code: `class NegativeAmountError(ValueError):
    pass

def safe_divide(a: float, b: float) -> float:
    if b < 0:
        raise NegativeAmountError("Bo'luvchi manfiy bo'lmasin")
    try:
        result = a / b
    except ZeroDivisionError:
        return 0.0
    else:
        return round(result, 3)

print(safe_divide(10, 3))
print(safe_divide(10, 0))`,
        explanation: {
          uz: 'Maxsus `NegativeAmountError` biznes qoidasi buzilganda aniq xabar beradi.',
          en: 'Custom exceptions express domain rule violations clearly.',
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: '`finally` bloki qachon ishlaydi?', en: 'When does the `finally` block run?' },
        options: { uz: ['Faqat xato bo‘lganda', 'Faqat xato bo‘lmaganda', 'Har doim (xato bo‘lsa ham, bo‘lmasa ham)', 'Hech qachon'], en: ['Only on error', 'Only on success', 'Always, regardless of whether an exception occurred', 'Never'] },
        correctIndex: 2,
        explanation: { uz: '`finally` har doim resurslarni tozalash uchun ishga tushadi.', en: '`finally` is guaranteed to execute.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: ['EX-009'],
  },
  {
    id: 'PY-MOD-001',
    courseId: 'modules_packages',
    moduleId: 'mod_std',
    order: 1,
    title: { uz: 'Modullar, venv va Standart kutubxona', en: 'Modules, Virtual Environments, and Standard Library' },
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-FE-002'],
    conceptId: 'modules',
    objectives: {
      uz: ['datetime, collections, pathlib va random modullaridan foydalanish', 'Virtual environment (python -m venv .venv) mohiyatini tushunish', '__name__ == "__main__" nima uchun kerakligini bilish'],
      en: ['Use pathlib, collections, and datetime', 'Isolate project packages with venv', 'Guard script entry points with __name__ == "__main__"'],
    },
    theory: {
      uz: `## Modullar va Virtual Environment
Katta loyihada barcha kod bitta faylga yozilmaydi. Har bir \`.py\` fayl — **modul**, ichida \`__init__.py\` bor papka — **paket (package)**.

### Virtual Environment (venv)
Turli loyihalardagi kutubxona versiyalari to'qnashmasligi uchun har bir loyihaga alohida \`python -m venv .venv\` yaratiladi.`,
      en: `## Modules & Virtual Environments
Every \`.py\` file is a module. Use \`python -m venv .venv\` so each project maintains clean, isolated dependency versions in \`requirements.txt\`.`,
    },
    examples: [
      {
        title: { uz: 'Standart kutubxonadan Counter va datetime', en: 'Counter and datetime from stdlib' },
        code: `from collections import Counter
from datetime import date

logs = ["python", "sql", "python", "fastapi", "python", "sql"]
top_topics = Counter(logs).most_common(2)
print("Bugun:", date.today().isoformat())
print("Top mavzular:", top_topics)`,
        explanation: {
          uz: 'Python standart kutubxonasi ko‘plab tayyor kuchli vositalarni o‘z ichiga oladi.',
          en: "Python's batteries-included standard library solves common tasks without external packages.",
        },
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: { uz: '`python -m venv .venv` buyrug‘ining vazifasi nima?', en: 'What does `python -m venv .venv` do?' },
        options: { uz: ['Pythonni o‘chiradi', 'Loyiha uchun alohida izolyatsiyalangan virtual muhit yaratadi', 'Kodni kompilyatsiya qiladi', 'Git commit yaratadi'], en: ['Uninstalls Python', 'Creates an isolated virtual environment for dependencies', 'Compiles bytecode', 'Creates a Git commit'] },
        correctIndex: 1,
        explanation: { uz: '`venv` loyiha paketlarini global Python dan ajratib turadi.', en: '`venv` isolates project dependencies from the system Python.' },
      },
    ],
    relatedVideos: ['VIDEO-DOCS-001'],
    relatedExercises: ['EX-005'],
  },
];
