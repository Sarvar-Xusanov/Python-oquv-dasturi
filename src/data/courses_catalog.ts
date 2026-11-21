import type { Course } from '../types/domain';

export const ALL_COURSES: Course[] = [
  // =========================================================================
  // 1-BOSQICH: PYTHON ASOSLARI (BEGINNER · Courses 1-5 · 56 lessons)
  // =========================================================================
  {
    id: 'computer_literacy',
    number: 1,
    category: 'core',
    title: {
      uz: 'Kompyuter savodxonligi va dasturlashga kirish',
      en: 'Computer Literacy & Intro to Programming',
    },
    description: {
      uz: "Kompyuter va operatsion tizim ishlashi, dasturlash mohiyati, Python tarixi, Interpreter vs Compiler, Python/IDE o'rnatish, Terminal va ilk Python dasturi.",
      en: 'How computers and OS work, programming foundations, Python history, Interpreter vs Compiler, Python/IDE setup, Terminal CLI, and your first program.',
    },
    difficulty: 'beginner',
    estimatedHours: 6,
    prerequisites: [],
    objectives: {
      uz: [
        'CPU, RAM, disk va operatsion tizim vazifalarini tushunish',
        'Interpreter (Python) va Compiler farqini ajratish',
        'Python, VS Code / PyCharm va Terminal (CLI) muhitini sozlash',
        'Birinchi Python dasturini terminaldan ishga tushirish',
      ],
      en: [
        'Explain how CPU, RAM, storage, and operating systems cooperate',
        'Contrast interpreters with ahead-of-time compilers',
        'Install Python, configure VS Code / PyCharm, and navigate via CLI',
        'Write and execute your first Python script',
      ],
    },
    modules: [
      { id: 'c01_m1', title: { uz: '1-bo‘lim: Kompyuter va dasturlash asoslari', en: 'Module 1: Computers & Programming Basics' }, order: 1 },
      { id: 'c01_m2', title: { uz: '2-bo‘lim: Tillar, Python va Interpreter', en: 'Module 2: Languages, Python & Interpreter' }, order: 2 },
      { id: 'c01_m3', title: { uz: '3-bo‘lim: Python va IDE o‘rnatish', en: 'Module 3: Python & IDE Setup' }, order: 3 },
      { id: 'c01_m4', title: { uz: '4-bo‘lim: Terminal va birinchi dastur', en: 'Module 4: Terminal & First Program' }, order: 4 },
    ],
  },
  {
    id: 'python_fundamentals',
    number: 2,
    category: 'core',
    title: {
      uz: 'Python Fundamentals — dasturlash asoslari',
      en: 'Python Fundamentals',
    },
    description: {
      uz: "print(), izohlar (comments), o'zgaruvchilar, ma'lumot turlari (int, float, str, bool), type conversion, input() va barcha asosiy operatorlar.",
      en: 'print(), comments, variables, core data types (int, float, str, bool), type conversion, input(), arithmetic, comparison, and assignment operators.',
    },
    difficulty: 'beginner',
    estimatedHours: 9,
    prerequisites: ['computer_literacy'],
    objectives: {
      uz: [
        'print(), izohlar va PEP 8 kod yozish qoidalarini qo‘llash',
        "O'zgaruvchilar va 4 ta asosiy turni (int, float, str, bool) erkin boshqarish",
        "Tur o'zgartirish (casting) va input() bilan interaktiv dastur tuzish",
        'Arifmetik, taqqoslash va tayinlash operatorlaridan bexato foydalanish',
      ],
      en: [
        'Format output with print() and follow PEP 8 commenting conventions',
        'Manage variables across int, float, str, and bool types',
        'Cast types safely and collect user input via input()',
        'Apply arithmetic, comparison, and augmented assignment operators',
      ],
    },
    modules: [
      { id: 'c02_m1', title: { uz: '1-bo‘lim: Natija chiqarish va o‘zgaruvchilar', en: 'Module 1: Output, Comments & Variables' }, order: 1 },
      { id: 'c02_m2', title: { uz: '2-bo‘lim: Ma’lumot turlari', en: 'Module 2: Core Data Types' }, order: 2 },
      { id: 'c02_m3', title: { uz: '3-bo‘lim: Tur o‘zgartirish va kiritish', en: 'Module 3: Type Conversion & Input' }, order: 3 },
      { id: 'c02_m4', title: { uz: '4-bo‘lim: Operatorlar', en: 'Module 4: Operators' }, order: 4 },
    ],
  },
  {
    id: 'control_flow',
    number: 3,
    category: 'core',
    title: {
      uz: 'Shartlar va takrorlash operatorlari',
      en: 'Conditionals & Loops (Control Flow)',
    },
    description: {
      uz: "Boolean mantiq, if/elif/else, ichma-ich shartlar, and/or/not, while va for sikllari, range(), break/continue/pass hamda match-case.",
      en: 'Boolean logic, if/elif/else branching, nested conditions, logical operators, while and for loops, range(), loop control, and match-case.',
    },
    difficulty: 'beginner',
    estimatedHours: 8,
    prerequisites: ['python_fundamentals'],
    objectives: {
      uz: [
        'Boolean mantiq va murakkab and/or/not shartlarini tuzish',
        'if/elif/else va zamonaviy match-case tarmoqlanishini yozish',
        'while va for sikllarida range(), break, continue, pass ni qo‘llash',
      ],
      en: [
        'Build compound Boolean conditions using and, or, and not',
        'Branch cleanly with if/elif/else and Python 3.10+ match-case',
        'Control while and for loops with range(), break, continue, and pass',
      ],
    },
    modules: [
      { id: 'c03_m1', title: { uz: '1-bo‘lim: Mantiq va if operatori', en: 'Module 1: Boolean Logic & if' }, order: 1 },
      { id: 'c03_m2', title: { uz: '2-bo‘lim: Murakkab tarmoqlanish', en: 'Module 2: Branching & Logical Ops' }, order: 2 },
      { id: 'c03_m3', title: { uz: '3-bo‘lim: Sikllar (while va for)', en: 'Module 3: Loops (while & for)' }, order: 3 },
      { id: 'c03_m4', title: { uz: '4-bo‘lim: Sikl boshqaruvi va match-case', en: 'Module 4: Loop Control & match-case' }, order: 4 },
    ],
  },
  {
    id: 'data_structures',
    number: 4,
    category: 'core',
    title: {
      uz: "Ma'lumotlar tuzilmalari — Data Structures",
      en: 'Data Structures',
    },
    description: {
      uz: "List va uning metodlari, slicing, nested lists, Tuple, Set va to'plam amallari, Dictionary, mutable vs immutable, unpacking, comprehension va saralash.",
      en: 'Lists, slicing, nested lists, tuples, sets and set algebra, dictionaries, mutability, unpacking, comprehensions, and sorting/searching.',
    },
    difficulty: 'beginner',
    estimatedHours: 12,
    prerequisites: ['control_flow'],
    objectives: {
      uz: [
        'List, Tuple, Set va Dictionary tuzilmalarini vazifaga qarab tanlash',
        'Slicing, nested tuzilmalar va sequence unpacking ni bexato yozish',
        'Mutable vs Immutable xotira farqini tushunish',
        'List comprehension, saralash (sorted) va qidiruv usullarini qo‘llash',
      ],
      en: [
        'Choose properly among list, tuple, set, and dict',
        'Master slicing, nested structures, and unpacking',
        'Understand mutable vs immutable object semantics',
        'Write Pythonic comprehensions and custom key sorting',
      ],
    },
    modules: [
      { id: 'c04_m1', title: { uz: '1-bo‘lim: Listlar va Slicing', en: 'Module 1: Lists & Slicing' }, order: 1 },
      { id: 'c04_m2', title: { uz: '2-bo‘lim: Tuples va Sets', en: 'Module 2: Tuples & Sets' }, order: 2 },
      { id: 'c04_m3', title: { uz: '3-bo‘lim: Dictionaries', en: 'Module 3: Dictionaries' }, order: 3 },
      { id: 'c04_m4', title: { uz: '4-bo‘lim: Mutability va Unpacking', en: 'Module 4: Mutability & Unpacking' }, order: 4 },
      { id: 'c04_m5', title: { uz: '5-bo‘lim: Comprehension va Saralash', en: 'Module 5: Comprehensions & Sorting' }, order: 5 },
    ],
  },
  {
    id: 'functions',
    number: 5,
    category: 'core',
    title: {
      uz: 'Functions — funksiyalar',
      en: 'Functions',
    },
    description: {
      uz: "Funksiya tushunchasi, def, parametr/argument, return vs print, default/keyword/*args/**kwargs, LEGB scope, nested, lambda, rekursiya, docstring va type hints.",
      en: 'Function design, parameters vs arguments, return vs print, defaults, *args/**kwargs, LEGB scope, nested closures, lambda, recursion, docstrings, and typing.',
    },
    difficulty: 'beginner',
    estimatedHours: 10,
    prerequisites: ['data_structures'],
    objectives: {
      uz: [
        'Toza va qayta ishlatiluvchi funksiyalar loyihalash',
        'Positional, keyword, default, *args va **kwargs parametrlarini qo‘llash',
        'Local/Global scope, nested funksiya va lambda farqini bilish',
        'Base case bilan rekursiya hamda Type Hints + Docstring yozish',
      ],
      en: [
        'Design pure, modular functions with clear return contracts',
        'Combine default, keyword, *args, and **kwargs parameters',
        'Trace LEGB variable scope, nested functions, and lambdas',
        'Write terminating recursion plus type hints and docstrings',
      ],
    },
    modules: [
      { id: 'c05_m1', title: { uz: '1-bo‘lim: Funksiya asoslari', en: 'Module 1: Function Foundations' }, order: 1 },
      { id: 'c05_m2', title: { uz: '2-bo‘lim: Return va Parametrlar', en: 'Module 2: Return & Parameters' }, order: 2 },
      { id: 'c05_m3', title: { uz: '3-bo‘lim: Scope, Nested va Lambda', en: 'Module 3: Scope, Nested & Lambda' }, order: 3 },
      { id: 'c05_m4', title: { uz: '4-bo‘lim: Rekursiya va Type Hints', en: 'Module 4: Recursion & Type Hints' }, order: 4 },
    ],
  },

  // =========================================================================
  // 2-BOSQICH: MUSTAHKAM PYTHON BILIMLARI (INTERMEDIATE · Courses 6-11 · 69 lessons)
  // =========================================================================
  {
    id: 'files_io',
    number: 6,
    category: 'core',
    title: {
      uz: "Fayllar va ma'lumotlar bilan ishlash",
      en: 'Files & Data I/O',
    },
    description: {
      uz: "File handling, ochish/yopish, o'qish/yozish, with operatori, TXT, CSV, JSON, Binary fayllar, pathlib va papkalarni boshqarish.",
      en: 'File handling modes, safe opening/closing, with context managers, TXT, CSV, JSON, binary streams, pathlib, and directory management.',
    },
    difficulty: 'intermediate',
    estimatedHours: 8,
    prerequisites: ['functions'],
    objectives: {
      uz: [
        'with open(..., encoding="utf-8") bilan fayl resurslarini xavfsiz boshqarish',
        'TXT, CSV va JSON formatlarini tahlil qilish va yaratish',
        'Binary (bytes) fayllar bilan ishlash asoslarini tushunish',
        'pathlib.Path orqali kross-platforma fayl va papka boshqaruvini yozish',
      ],
      en: [
        'Manage file descriptors safely with context managers',
        'Parse and serialize TXT, CSV, and JSON files cleanly',
        'Read and inspect binary byte streams safely',
        'Automate paths and directories using pathlib.Path',
      ],
    },
    modules: [
      { id: 'c06_m1', title: { uz: '1-bo‘lim: Fayl bilan ishlash asoslari', en: 'Module 1: File Handling Basics' }, order: 1 },
      { id: 'c06_m2', title: { uz: '2-bo‘lim: Context Manager va TXT', en: 'Module 2: Context Managers & TXT' }, order: 2 },
      { id: 'c06_m3', title: { uz: '3-bo‘lim: CSV, JSON va Binary fayllar', en: 'Module 3: CSV, JSON & Binary Files' }, order: 3 },
      { id: 'c06_m4', title: { uz: '4-bo‘lim: pathlib va Papkalar', en: 'Module 4: pathlib & Directory Ops' }, order: 4 },
    ],
  },
  {
    id: 'errors_testing',
    number: 7,
    category: 'engineering',
    title: {
      uz: 'Xatolar, debugging va testing',
      en: 'Errors, Debugging & Testing',
    },
    description: {
      uz: "Syntax, Runtime va Logical xatolar, try/except/else/finally, raise, Custom Exceptions, Debugging texnikalari, Logging va pytest/unittest.",
      en: 'Syntax/runtime/logical bugs, try/except/else/finally, raise, custom exception hierarchies, systematic debugging, logging, and pytest unit testing.',
    },
    difficulty: 'intermediate',
    estimatedHours: 8,
    prerequisites: ['files_io'],
    objectives: {
      uz: [
        'Syntax, Runtime va Logical xatolarni diagnostika qilish',
        'try/except/else/finally va custom Exception klasslarini to‘g‘ri qo‘llash',
        'Systematic debugging va strukturali logging jurnallarini yuritish',
        'Unit testing (unittest/pytest) orqali funksiyalarni avtomatik tekshirish',
      ],
      en: [
        'Diagnose syntax, runtime, and subtle logical errors',
        'Handle and raise specific or custom exceptions cleanly',
        'Debug methodically and emit structured logs',
        'Write automated unit tests with assertions and pytest patterns',
      ],
    },
    modules: [
      { id: 'c07_m1', title: { uz: '1-bo‘lim: Xato turlari anatomiyasi', en: 'Module 1: Anatomy of Errors' }, order: 1 },
      { id: 'c07_m2', title: { uz: '2-bo‘lim: try / except / else / finally', en: 'Module 2: Exception Control Flow' }, order: 2 },
      { id: 'c07_m3', title: { uz: '3-bo‘lim: raise va Custom Exceptions', en: 'Module 3: Raising Custom Exceptions' }, order: 3 },
      { id: 'c07_m4', title: { uz: '4-bo‘lim: Debugging, Logging va Testing', en: 'Module 4: Debugging, Logging & Tests' }, order: 4 },
    ],
  },
  {
    id: 'modules_packages',
    number: 8,
    category: 'engineering',
    title: {
      uz: 'Modules, Packages va Development Environment',
      en: 'Modules, Packages & Dev Environment',
    },
    description: {
      uz: "Modullar, import/from, shaxsiy modul, Standart kutubxona, Paketlar, pip, venv, requirements.txt, pyproject.toml, Git/GitHub va loyiha arxitekturasi.",
      en: 'Modules, import mechanics, custom packages, standard library, pip, venv, requirements.txt, pyproject.toml, Git/GitHub workflows, and clean project structure.',
    },
    difficulty: 'intermediate',
    estimatedHours: 9,
    prerequisites: ['errors_testing'],
    objectives: {
      uz: [
        'Kodni qayta ishlatiluvchi modullar va paketlarga ajratish',
        'Python Standard Library dan unumli foydalanish',
        'pip, venv, requirements.txt va pyproject.toml bilan muhitni boshqarish',
        'Git/GitHub va professional loyiha strukturasini tashkil etish',
      ],
      en: [
        'Organize code into cohesive modules and packages',
        'Leverage Python’s batteries-included standard library',
        'Manage isolated environments with venv, requirements.txt, and pyproject.toml',
        'Follow Git/GitHub workflows and clean project layouts',
      ],
    },
    modules: [
      { id: 'c08_m1', title: { uz: '1-bo‘lim: Modullar va Standart kutubxona', en: 'Module 1: Modules & Standard Library' }, order: 1 },
      { id: 'c08_m2', title: { uz: '2-bo‘lim: Paketlar va pip', en: 'Module 2: Packages & pip' }, order: 2 },
      { id: 'c08_m3', title: { uz: '3-bo‘lim: Virtual muhit va konfiguratsiya', en: 'Module 3: venv, requirements & pyproject' }, order: 3 },
      { id: 'c08_m4', title: { uz: '4-bo‘lim: Git, GitHub va loyiha tuzilmasi', en: 'Module 4: Git & Project Architecture' }, order: 4 },
    ],
  },
  {
    id: 'oop',
    number: 9,
    category: 'engineering',
    title: {
      uz: 'Object-Oriented Programming — OOP',
      en: 'Object-Oriented Programming (OOP)',
    },
    description: {
      uz: "OOP falsafasi, Class va Object, Atribut va Metodlar, __init__ va self, Instance vs Class variables, Encapsulation, Inheritance, Polymorphism, Abstraction, Composition va Dunder metodlar.",
      en: 'OOP design, classes, objects, __init__ and self, class vs instance state, encapsulation, inheritance, polymorphism, abstraction, composition, and dunder protocols.',
    },
    difficulty: 'intermediate',
    estimatedHours: 12,
    prerequisites: ['modules_packages'],
    objectives: {
      uz: [
        'Real tizim obyektlarini Class, __init__, self va @property bilan modellashtirish',
        'Encapsulation, Inheritance, Polymorphism va Abstraction tamoyillarini qo‘llash',
        'Composition ("has-a") vs Inheritance ("is-a") tanlovini asoslash',
        '__repr__, __eq__, __len__ kabi Dunder metodlar bilan OOP loyiha qurish',
      ],
      en: [
        'Model real entities using classes, __init__, self, and @property',
        'Apply encapsulation, inheritance, polymorphism, and ABC abstraction',
        'Choose composition over deep inheritance cleanly',
        'Implement Pythonic dunder methods in a multi-class OOP project',
      ],
    },
    modules: [
      { id: 'c09_m1', title: { uz: '1-bo‘lim: OOP poydevori', en: 'Module 1: OOP Foundations' }, order: 1 },
      { id: 'c09_m2', title: { uz: '2-bo‘lim: Obyekt tuzilishi va holati', en: 'Module 2: State, __init__ & Variables' }, order: 2 },
      { id: 'c09_m3', title: { uz: '3-bo‘lim: Inkapsulyatsiya va Merosxo‘rlik', en: 'Module 3: Encapsulation & Inheritance' }, order: 3 },
      { id: 'c09_m4', title: { uz: '4-bo‘lim: Polimorfizm, Abstraksiya va Kompozitsiya', en: 'Module 4: Polymorphism, ABC & Composition' }, order: 4 },
      { id: 'c09_m5', title: { uz: '5-bo‘lim: Dunder metodlar va Katta Loyiha', en: 'Module 5: Dunder Methods & OOP Capstone' }, order: 5 },
    ],
  },
  {
    id: 'advanced_python',
    number: 10,
    category: 'engineering',
    title: {
      uz: 'Advanced Python va Async Concurrency',
      en: 'Advanced Python & Async Concurrency',
    },
    description: {
      uz: "Python xotira modeli, References, Iterators, Generators (yield), Decorators, Closures, Context Managers, RegEx, map/filter/zip, functools/itertools, Advanced Typing va asyncio (async/await).",
      en: 'Python memory model, object identity, iterators, generators, decorators, closures, context managers, regex, functional tools, typing, and asyncio async/await.',
    },
    difficulty: 'intermediate',
    estimatedHours: 13,
    prerequisites: ['oop'],
    objectives: {
      uz: [
        'Python xotira modeli, reference counting va shallow/deep copy ni tushunish',
        'Iteratorlar, lazy generatorlar (`yield`) va custom Context Manager tuzish',
        'Closure va `@wraps` li dekoratorlar hamda RegEx yozish',
        '`collections`, `itertools`, `functools`, Typing hamda `async/await` (`asyncio`) ni qo‘llash',
      ],
      en: [
        'Explain Python memory references, mutability, and identity (`is` vs `==`)',
        'Build custom iterators, lazy generators, and context managers',
        'Author closures, parameterized decorators, and regular expressions',
        'Master functools/itertools, advanced typing, and `asyncio` concurrency',
      ],
    },
    modules: [
      { id: 'c10_m1', title: { uz: '1-bo‘lim: Xotira modeli va Iteratorlar', en: 'Module 1: Memory Model & Iterators' }, order: 1 },
      { id: 'c10_m2', title: { uz: '2-bo‘lim: Generator, Dekorator va Context Manager', en: 'Module 2: Generators, Decorators & Context' }, order: 2 },
      { id: 'c10_m3', title: { uz: '3-bo‘lim: Comprehensions, RegEx va Funksional Python', en: 'Module 3: Comprehensions, RegEx & Functional' }, order: 3 },
      { id: 'c10_m4', title: { uz: '4-bo‘lim: Kuchli kutubxonalar, Typing va Asyncio', en: 'Module 4: Stdlib Power, Typing & Asyncio' }, order: 4 },
    ],
  },
  {
    id: 'algorithms',
    number: 11,
    category: 'engineering',
    title: {
      uz: 'Algorithms va Computer Science',
      en: 'Algorithms & Computer Science',
    },
    description: {
      uz: "Algoritm tushunchasi, Time Complexity, Big O, Linear & Binary Search, Bubble/Selection/Insertion/Merge/Quick Sort, Stack/Queue, Linked List, Trees/BST, Graphs va Backtracking.",
      en: 'Algorithmic thinking, Big O complexity, search algorithms, quadratic and O(n log n) sorting, stacks, queues, linked lists, trees, graphs, and backtracking.',
    },
    difficulty: 'intermediate',
    estimatedHours: 14,
    prerequisites: ['advanced_python'],
    objectives: {
      uz: [
        'Big O vaqt va xotira murakkabligini aniq hisoblash',
        'Linear/Binary Search hamda asosiy saralash algoritmlarini (Merge/Quick Sort) yozish',
        'Stack, Queue, Linked List, Tree/BST va Graph tuzilmalarini amalga oshirish',
        'Rekursiya va Backtracking yordamida texnik suhbat masalalarini yechish',
      ],
      en: [
        'Analyze time and space complexity using Big O notation',
        'Implement Binary Search plus quadratic and divide-and-conquer sorts',
        'Build stacks, queues, linked lists, binary search trees, and graph traversals',
        'Solve interview-grade problems via recursion and backtracking',
      ],
    },
    modules: [
      { id: 'c11_m1', title: { uz: '1-bo‘lim: Algoritm va Big O tahlili', en: 'Module 1: Algorithms & Big O' }, order: 1 },
      { id: 'c11_m2', title: { uz: '2-bo‘lim: Qidiruv va Saralash algoritmlari', en: 'Module 2: Search & Sorting Algorithms' }, order: 2 },
      { id: 'c11_m3', title: { uz: '3-bo‘lim: Chiziqli tuzilmalar va Daraxtlar', en: 'Module 3: Stack, Queue, Lists & Trees' }, order: 3 },
      { id: 'c11_m4', title: { uz: '4-bo‘lim: Graflar, Backtracking va Masalalar', en: 'Module 4: Graphs, Backtracking & Practice' }, order: 4 },
    ],
  },

  // =========================================================================
  // 3-BOSQICH: PROFESSIONAL DASTURCHILIK (ADVANCED · Courses 12-17 · 71 lessons)
  // =========================================================================
  {
    id: 'databases',
    number: 12,
    category: 'backend',
    title: {
      uz: 'Database va SQL',
      en: 'Databases & SQL',
    },
    description: {
      uz: "Ma'lumotlar bazasi asoslari, SQL CRUD, SELECT/WHERE, ORDER BY/GROUP BY, JOIN turlari, Primary & Foreign Key, SQLite, PostgreSQL va Python DB integratsiyasi.",
      en: 'Database fundamentals, SQL CRUD, filtering, aggregation with GROUP BY, JOINs, primary/foreign keys, SQLite, PostgreSQL, and safe Python integration.',
    },
    difficulty: 'advanced',
    estimatedHours: 10,
    prerequisites: ['oop'],
    objectives: {
      uz: [
        'Relyatsion jadvallarni Primary/Foreign Key va normalizatsiya bilan loyihalash',
        'SELECT, WHERE, ORDER BY, GROUP BY, HAVING va JOIN so‘rovlarini yozish',
        'SQLite va PostgreSQL farqlarini hamda indeksatsiya rolini bilish',
        'Parameterized query (`?`) orqali Python da SQL Injection dan himoyalangan DB qatlami qurish',
      ],
      en: [
        'Model relational schemas with primary/foreign keys',
        'Write filtering, GROUP BY aggregation, and multi-table JOIN queries',
        'Contrast SQLite and PostgreSQL for development and production',
        'Integrate databases safely into Python using bound parameters',
      ],
    },
    modules: [
      { id: 'c12_m1', title: { uz: '1-bo‘lim: Relyatsion bazalar va CRUD', en: 'Module 1: Relational DB & CRUD' }, order: 1 },
      { id: 'c12_m2', title: { uz: '2-bo‘lim: Qidiruv, Saralash va Guruhlash', en: 'Module 2: Querying & Aggregation' }, order: 2 },
      { id: 'c12_m3', title: { uz: '3-bo‘lim: Kalitlar va JOIN turlari', en: 'Module 3: Keys & SQL JOINs' }, order: 3 },
      { id: 'c12_m4', title: { uz: '4-bo‘lim: SQLite, PostgreSQL va Python', en: 'Module 4: SQLite, PostgreSQL & Python' }, order: 4 },
    ],
  },
  {
    id: 'http_apis',
    number: 13,
    category: 'backend',
    title: {
      uz: 'Internet, HTTP va API',
      en: 'Internet, HTTP & APIs',
    },
    description: {
      uz: "Internet va DNS ishlashi, Client-Server modeli, HTTP/HTTPS, Request/Response, HTTP metodlari, Status kodlari, JSON API, Python requests, REST, API Key, JWT/OAuth va API integratsiyasi.",
      en: 'How the internet works, Client-Server, HTTP/HTTPS, headers & bodies, verbs, status codes, JSON APIs, requests, REST conventions, API keys, JWT, and OAuth.',
    },
    difficulty: 'advanced',
    estimatedHours: 10,
    prerequisites: ['databases'],
    objectives: {
      uz: [
        'DNS, TCP/TLS, Client-Server va HTTP/HTTPS so‘rov-javob siklini tushunish',
        'GET, POST, PUT, PATCH, DELETE hamda 2xx/3xx/4xx/5xx status kodlarini to‘g‘ri qo‘llash',
        'RESTful JSON API dizayni va Python mijoz integratsiyasi (retry/timeout)',
        'API Key, Bearer JWT va OAuth 2.0 autentifikatsiya mexanizmlarini farqlash',
      ],
      en: [
        'Trace DNS, Client-Server, and HTTP/HTTPS request-response flows',
        'Apply HTTP verbs and semantic status codes consistently',
        'Design RESTful JSON payloads and resilient API clients',
        'Implement API key, JWT, and OAuth authentication flows securely',
      ],
    },
    modules: [
      { id: 'c13_m1', title: { uz: '1-bo‘lim: Tarmoq va HTTP asoslari', en: 'Module 1: Networking & HTTP Basics' }, order: 1 },
      { id: 'c13_m2', title: { uz: '2-bo‘lim: So‘rov, Metodlar va Status kodlari', en: 'Module 2: Requests, Methods & Status' }, order: 2 },
      { id: 'c13_m3', title: { uz: '3-bo‘lim: JSON, requests va REST API', en: 'Module 3: JSON, Client & REST' }, order: 3 },
      { id: 'c13_m4', title: { uz: '4-bo‘lim: Autentifikatsiya va API loyiha', en: 'Module 4: Auth, JWT & API Integration' }, order: 4 },
    ],
  },
  {
    id: 'web_backend',
    number: 14,
    category: 'backend',
    title: {
      uz: 'Backend Development va Production Deploy',
      en: 'Backend Engineering & Production Deploy',
    },
    description: {
      uz: "Backend arxitekturasi, Flask, Django va FastAPI, Routing, Request Validation, Pydantic, SQLAlchemy ORM, Auth/RBAC, Middleware, Background Tasks, To'liq Backend loyiha hamda Docker, Deploy, Security va Portfolio.",
      en: 'Backend layered architecture, Flask, Django, FastAPI, routing, Pydantic validation, SQLAlchemy ORM, RBAC auth, middleware, background tasks, full API project, Docker, deployment, security, and portfolio.',
    },
    difficulty: 'advanced',
    estimatedHours: 14,
    prerequisites: ['http_apis', 'advanced_python'],
    objectives: {
      uz: [
        'Router → Schema → Service → Repository qatlamli Backend arxitekturasini qurish',
        'Flask, Django va FastAPI ning kuchli tomonlarini solishtirish va FastAPI da API yozish',
        'Pydantic validatsiya, SQLAlchemy ORM, RBAC Auth va Middleware qo‘llash',
        'Background tasks, Docker konteynerlash, production xavfsizlik va portfolio taqdimotini tayyorlash',
      ],
      en: [
        'Architect layered backends (Routes, Schemas, Services, Repositories)',
        'Compare Flask, Django, and FastAPI and build typed APIs',
        'Integrate Pydantic schemas, SQLAlchemy ORM, RBAC auth, and middleware',
        'Ship background jobs, Dockerized deployments, security hardening, and interview portfolio',
      ],
    },
    modules: [
      { id: 'c14_m1', title: { uz: '1-bo‘lim: Backend arxitektura va Freymvorklar', en: 'Module 1: Architecture & Frameworks' }, order: 1 },
      { id: 'c14_m2', title: { uz: '2-bo‘lim: Routing, Validatsiya va Pydantic', en: 'Module 2: Routing, Validation & Pydantic' }, order: 2 },
      { id: 'c14_m3', title: { uz: '3-bo‘lim: ORM, Auth va Middleware', en: 'Module 3: ORM, Auth & Middleware' }, order: 3 },
      { id: 'c14_m4', title: { uz: '4-bo‘lim: Background Tasks, Docker va Deploy', en: 'Module 4: Tasks, Docker & Production' }, order: 4 },
    ],
  },
  {
    id: 'automation',
    number: 15,
    category: 'backend',
    title: {
      uz: 'Automation va System Programming',
      en: 'Automation & System Programming',
    },
    description: {
      uz: "Python Automation asoslari, OS bilan ishlash, os va sys, subprocess, Web Scraping, BeautifulSoup, Selenium, Excel/Office avtomatlashtirish, Email/Telegram botlar va Cron jadvallari.",
      en: 'Automation design, OS internals, os and sys, subprocess safety, web scraping, BeautifulSoup, Selenium browser automation, Excel reporting, Email/Telegram bots, and cron scheduling.',
    },
    difficulty: 'advanced',
    estimatedHours: 9,
    prerequisites: ['files_io', 'http_apis'],
    objectives: {
      uz: [
        'os, sys va subprocess modullaridan xavfsiz (shell=False) foydalanish',
        'HTML parsing (BeautifulSoup) va Selenium brauzer avtomatlashtirish tamoyillarini bilish',
        'Excel/CSV hisobotlar, Email va Telegram bildirishnoma skriptlarini tuzish',
        'Idempotent, dry-run rejimli Cron/rejalashtirilgan vazifalar yaratish',
      ],
      en: [
        'Use os, sys, and subprocess safely without shell injection',
        'Extract structured data with BeautifulSoup and browser automation',
        'Automate Excel/Office reports and Telegram/Email notifications',
        'Schedule resilient, idempotent jobs with cron and dry-run flags',
      ],
    },
    modules: [
      { id: 'c15_m1', title: { uz: '1-bo‘lim: OS va Tizim dasturlash', en: 'Module 1: OS & System Programming' }, order: 1 },
      { id: 'c15_m2', title: { uz: '2-bo‘lim: Web Scraping va BeautifulSoup', en: 'Module 2: Scraping & BeautifulSoup' }, order: 2 },
      { id: 'c15_m3', title: { uz: '3-bo‘lim: Brauzer va Ofis avtomatlashtirish', en: 'Module 3: Browser & Office Automation' }, order: 3 },
      { id: 'c15_m4', title: { uz: '4-bo‘lim: Botlar va Rejalashtirilgan vazifalar', en: 'Module 4: Bots & Scheduled Tasks' }, order: 4 },
    ],
  },
  {
    id: 'data_science',
    number: 16,
    category: 'data_ai',
    title: {
      uz: 'Data Science va Data Analysis',
      en: 'Data Science & Data Analysis',
    },
    description: {
      uz: "Data Science jarayoni, NumPy massivlari, Pandas DataFrame va Series, Data Cleaning, Transformatsiya, Data Analysis, Matplotlib, Seaborn, Statistika, EDA va yakuniy Data loyihasi.",
      en: 'Data science workflow, NumPy arrays, Pandas DataFrames/Series, data cleaning, transformations, aggregation, Matplotlib, Seaborn, statistics, EDA, and full analysis capstone.',
    },
    difficulty: 'advanced',
    estimatedHours: 12,
    prerequisites: ['algorithms', 'databases'],
    objectives: {
      uz: [
        'NumPy vektorlashgan hisob-kitoblari va Pandas Series/DataFrame operatsiyalarini tushunish',
        'Null qiymatlar, dublikatlar va outlier larni professional tozalash',
        'Matplotlib va Seaborn bilan ma’lumotni to‘g‘ri grafikda vizualizatsiya qilish',
        'Statistik ko‘rsatkichlar va Exploratory Data Analysis (EDA) loyihasini bajarish',
      ],
      en: [
        'Apply vectorized NumPy computation and Pandas DataFrame pipelines',
        'Clean missing values, inconsistent types, and outliers reliably',
        'Visualize distributions and trends with Matplotlib and Seaborn',
        'Execute end-to-end Exploratory Data Analysis (EDA) projects',
      ],
    },
    modules: [
      { id: 'c16_m1', title: { uz: '1-bo‘lim: Data Science, NumPy va Pandas', en: 'Module 1: NumPy & Pandas Foundations' }, order: 1 },
      { id: 'c16_m2', title: { uz: '2-bo‘lim: Tozalash va Transformatsiya', en: 'Module 2: Cleaning & Transformation' }, order: 2 },
      { id: 'c16_m3', title: { uz: '3-bo‘lim: Ma’lumot vizualizatsiyasi', en: 'Module 3: Data Visualization' }, order: 3 },
      { id: 'c16_m4', title: { uz: '4-bo‘lim: Statistika, EDA va Real loyiha', en: 'Module 4: Statistics, EDA & Capstone' }, order: 4 },
    ],
  },
  {
    id: 'ai_ml',
    number: 17,
    category: 'data_ai',
    title: {
      uz: 'Artificial Intelligence va Machine Learning',
      en: 'Artificial Intelligence & Machine Learning',
    },
    description: {
      uz: "AI va ML asoslari, Supervised vs Unsupervised, Dataset/Features, Preprocessing, Scikit-learn, Regression, Classification, Clustering, Model Training & Evaluation, Neural Networks, PyTorch va AI API ilovalari.",
      en: 'AI/ML landscape, supervised vs unsupervised learning, feature engineering, preprocessing, Scikit-learn, regression, classification, clustering, evaluation metrics, neural networks, PyTorch, and AI API apps.',
    },
    difficulty: 'advanced',
    estimatedHours: 14,
    prerequisites: ['data_science'],
    objectives: {
      uz: [
        'Supervised (Regression/Classification) va Unsupervised (Clustering) masalalarini ajratish',
        'Train/Test split, data leakage oldini olish va feature scaling qilish',
        'MSE, Accuracy, Precision/Recall/F1 va Confusion Matrix bilan modelni baholash',
        'Neyron tarmoqlar, PyTorch asoslari va xavfsiz AI API ilovalarini qurish',
      ],
      en: [
        'Distinguish supervised regression/classification from unsupervised clustering',
        'Prevent data leakage using proper train/test splits and scaling pipelines',
        'Evaluate models with MSE, R2, Accuracy, Precision, Recall, and F1-score',
        'Understand neural networks, PyTorch tensors/training loops, and LLM API apps',
      ],
    },
    modules: [
      { id: 'c17_m1', title: { uz: '1-bo‘lim: AI va Machine Learning asoslari', en: 'Module 1: AI & ML Foundations' }, order: 1 },
      { id: 'c17_m2', title: { uz: '2-bo‘lim: Dataset, Preprocessing va Scikit-learn', en: 'Module 2: Datasets, Scaling & Scikit-learn' }, order: 2 },
      { id: 'c17_m3', title: { uz: '3-bo‘lim: Asosiy ML algoritmlari', en: 'Module 3: Regression, Classification & Clustering' }, order: 3 },
      { id: 'c17_m4', title: { uz: '4-bo‘lim: Model o‘qitish va baholash', en: 'Module 4: Training & Evaluation' }, order: 4 },
      { id: 'c17_m5', title: { uz: '5-bo‘lim: Neural Networks, PyTorch va AI API', en: 'Module 5: Deep Learning, PyTorch & AI APIs' }, order: 5 },
    ],
  },
];
