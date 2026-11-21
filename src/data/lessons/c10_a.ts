import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C10_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-10-01',
    courseId: 'advanced_python',
    moduleId: 'c10_m1',
    order: 1,
    titleUz: 'Python Memory Model — xotira, Reference Counting va GC',
    titleEn: 'Python Memory Model, Refcounting & Garbage Collection',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-09-12'],
    conceptId: 'adv_memory_model',
    whyUz: "Nega Python da o‘zgaruvchiga qiymat berganda `int` va `list` turlicha tutadi, xotira qanday tozalanadi va nega ba’zan xotira sizib chiqishi (memory leak) ro‘y beradi? **CPython Memory Model** (`sys.getrefcount`, Reference Counting va Generational GC) dasturingiz tezligi va xotira sarfini tushunishning kalitidir!",
    whyEn: 'Understanding CPython’s PyObject header, Reference Counting, Generational Garbage Collector, and `is` vs `==` prevents subtle memory leaks and aliasing bugs.',
    analogyUz: "**Reference Counting** — bu xonadagi chiroq sensoriga o‘xshaydi: xonaga kirgan har bir ism (`a = x`, `b = x`) hisoblagichni `+1` qiladi, chiqqanda `-1`; hisoblagich `0` bo‘lishi bilan xona darhol tozalanadi! Agar ikki obyekt bir-birini ushlab aylana (reference cycle) qilsa, ularni Generational GC tozalaydi.",
    analogyEn: 'Reference counting turns off the lights the instant the last name referencing an object disappears; the cyclic GC cleans up isolated reference loops.',
    stopsUz: "`sys.getrefcount(x)` funksiya argumentining o‘zi ham vaqtincha +1 havola qo‘shadi! Shuningdek, kichik butun sonlar (`-5..256`) va qisqa identifikator satrlar CPython tomonidan interning (keshlash) qilinishi mumkin — shuning uchun hech qachon qiymat solishtirishda `is` ishlatmang, faqat **`==`** ishlating (`None` bundan mustasno: `x is None`)!",
    stopsEn: '`sys.getrefcount(x)` includes the temporary argument reference itself (+1). Never rely on CPython small-int (`-5..256`) or string interning—always compare values with `==` and singletons (`None`) with `is`.',
    objUz: ['Python da o‘zgaruvchi — quti emas, obyektga bog‘langan yorliq (name -> object) ekanini tushunish', '`sys.getrefcount()` va `gc.collect()` mexanizmini ko‘rish', 'Circular reference (aylanma havola) nima va GC uni qanday yechishini bilish'],
    objEn: ['Model Python variables as name bindings to heap objects', 'Inspect reference counts with `sys.getrefcount()` and cycle collection with `gc`', 'Explain why `is` is reserved for `None`/identity while `==` compares equality'],
    theoryUz: `### 1. Name -> Object Modeli
Python da \`x = 10\` "x nomli qutiga 10 solish" emas, balki xotiradagi \`10\` obyektiga \`x\` yorlig‘ini bog‘lashdir.
### 2. Reference Counting (Asosiy mexanizm)
Har bir \`PyObject\` o‘zida \`ob_refcnt\` saqlaydi. \`b = a\` refcount ni oshiradi, \`del a\` kamaytiradi; \`0\` bo‘lsa xotira darhol bo‘shaydi.
### 3. Reference Cycles va Generational GC
\`a.child = b; b.parent = a\` bo‘lsa, \`del a, b\` dan keyin ham refcount 1 bo‘lib qoladi. CPython dagi Generational GC (0, 1, 2-avlodlar) bunday sikllarni topib tozalaydi.
### 4. Interning & Caching
CPython \`-5..256\` sonlarni oldindan keshlaydi — bu ichki optimizatsiya, til kafolati emas!
### 5. \`__slots__\` bilan xotira tejash
Millionlab kichik obyektlarda \`__slots__ = ("x", "y")\` har bir obyekt uchun \`__dict__\` ochmasdan xotirani 2–3 baravar tejaydi.`,
    theoryEn: `### 1. Names Bind to Heap Objects
Assignment binds a label to an object on the heap rather than copying bytes into a named box.
### 2. Reference Counting
Each object tracks active references; dropping to zero deallocates it immediately.
### 3. Cyclic Garbage Collection
Mutually referencing containers (\`a.next = b; b.next = a\`) require the generational cyclic GC (\`gc\`) to reclaim.
### 4. Small-Int & String Interning
Small integers (\`-5..256\`) are cached by CPython—treat interning as an implementation detail, never application logic.
### 5. \`__slots__\` Optimization
Declaring \`__slots__\` omits per-instance \`__dict__\`, saving substantial RAM at scale.`,
    examples: [
      ex('Misol 1: `sys.getrefcount()` o‘zgarishini kuzatish', 'Example 1: Observing Reference Count Changes', `import sys\n\nobj = [1, 2, 3]\nc0 = sys.getrefcount(obj)\nalias = obj\nc1 = sys.getrefcount(obj)\ndel alias\nc2 = sys.getrefcount(obj)\nprint("delta add:", c1 - c0, "| delta del:", c2 - c0)`, `delta add: 1 | delta del: 0`, 'Yangi nom bog‘langanda refcount +1 ga oshadi, `del alias` dan keyin eski holatga qaytadi.', 'Binding an alias increments refcount by 1; deleting the binding restores it.'),
      ex('Misol 2: `gc.collect()` va Circular Reference', 'Example 2: Reclaiming Cyclic References', `import gc\n\nclass Node:\n    def __init__(self): self.other = None\n\ngc.collect()\na, b = Node(), Node()\na.other, b.other = b, a\ndel a, b\ncollected = gc.collect()\nprint("Collected cyclic objects > 0?", collected >= 2)`, `Collected cyclic objects > 0? True`, 'Aylanma havola qilgan 2 ta `Node` ni `gc.collect()` muvaffaqiyatli tozaladi.', 'The cyclic garbage collector detects and frees unreferenced mutual cycles.'),
      ex('Misol 3: `__slots__` obyektda `__dict__` bo‘lmasligi', 'Example 3: Memory-Saving __slots__', `class Point:\n    __slots__ = ("x", "y")\n    def __init__(self, x: int, y: int):\n        self.x, self.y = x, y\n\np = Point(3, 4)\nprint(p.x, p.y, "has __dict__?", hasattr(p, "__dict__"))`, `3 4 has __dict__? False`, '`__slots__` qo‘llanganda har bir nusxa uchun ortiqcha `__dict__` lug‘ati ochilmaydi.', '`__slots__` eliminates per-instance `__dict__` allocation.'),
    ],
    traceTitleUz: 'Reference counting izi',
    traceTitleEn: 'Tracing Name Bindings',
    traceCode: `a = [1, 2]\nb = a\nb.append(3)\nprint(a is b, a)`,
    traceSteps: [
      traceStep(1, 'a = [1, 2]', 'refcnt=1', 'Ro‘yxat yaratildi va `a` bog‘landi', 'List allocated with refcount 1'),
      traceStep(2, 'b = a', 'refcnt=2', 'O‘sha obyektga 2-yorliq ulandi', 'Second name bound to same object'),
      traceStep(3, 'b.append(3)', '[1, 2, 3]', 'Ikkala nom ham bir obyektga qaraydi', 'Both names observe mutation', 'True [1, 2, 3]'),
    ],
    commonMistakes: [
      mistake('Son yoki satrlarni `is` bilan solishtirish', 'Using `is` Instead of `==` for Values', `x = int("1000")\ny = int("1000")\nprint("is:", x is y, "==:", x == y)`, 'is: False ==: True (breaks unpredictably!)', `x = int("1000")\ny = int("1000")\nprint("Use ==:", x == y)`, '`is` qiymatni emas, xotira manzilini (`id()`) solishtiradi; `1000` da `False` beradi!', '`is` compares object identity, not numeric value.', 'Qiymatlar uchun `==`, faqat `None` uchun `is None` yozing.', 'Use `==` for values and `is` only for `None`.'),
      mistake('Global ro‘yxatga kesh to‘plab tozalamaslik', 'Unbounded Global Cache Memory Leak', `# global CACHE = [] growing forever prevents refcount from hitting 0!`, 'Unbounded RAM growth', `from functools import lru_cache\nprint("Use bounded @lru_cache(maxsize=128)!")`, 'Obyektga bitta faol global havola qolsa ham GC uni hech qachon o‘chirmaydi.', 'Reachable objects in unbounded globals are never collected.', 'Cheklangan (`maxsize`) keshlardan foydalaning.', 'Use bounded caches like `lru_cache(maxsize=...)`.'),
    ],
    compareTitleUz: 'Reference Counting vs Cyclic GC',
    compareTitleEn: 'Refcounting vs Generational GC',
    compareUz: ['Refcounting: har bir `del`/scope tugashida darhol deterministic tozalaydi (sikllarni ushlolmaydi).', 'Generational GC: davriy ravishda ishga tushib aylanma (cyclic) chiqindilarni yig‘adi.'],
    compareEn: ['Refcounting: immediate deterministic cleanup on zero refs (fails on cycles).', 'Cyclic GC: periodic sweep collecting unreachable reference cycles.'],
    compareSummaryUz: 'Python da o‘zgaruvchilar nom-yorliqdir; qiymatni `==`, `None` ni `is None` bilan solishtiring va katta ma’lumotlarda kesh chegarasini saqlang.',
    compareSummaryEn: 'Remember names bind to objects: use `==` for equality, `is None` for None checks, and bound caches.',
    practiceTasks: [
      pt('p1001_1', '1-mashq: `id()` va `is`', 'Task 1: Identity Check', '`a = [1]` va `b = a` uchun `id(a) == id(b)` ni chiqaring.', 'Verify shared identity.', `a = [1]\nb = a\nprint(id(a) == id(b))`, 'True', 'a and b point to same list', 'Prints True.'),
      pt('p1001_2', '2-mashq: `==` vs `is`', 'Task 2: Value vs Identity', '`x = [1, 2]; y = [1, 2]` uchun `x == y, x is y` chiqaring.', 'Compare equality vs identity.', `x = [1, 2]\ny = [1, 2]\nprint(x == y, x is y)`, 'True False', 'Distinct lists with equal values', 'Prints True False.'),
      pt('p1001_3', '3-mashq: `sys.getrefcount`', 'Task 3: Measure Refcount Delta', 'Ro‘yxatga yangi alias berganda refcount +1 oshishini ko‘rsating.', 'Compute refcount difference.', `import sys\nx = [9]\nbefore = sys.getrefcount(x)\ny = x\nafter = sys.getrefcount(x)\nprint(after - before)`, '1', 'after - before', 'Prints 1.'),
      pt('p1001_4', '4-mashq: `__slots__` xususiyati', 'Task 4: Test __slots__', '`__slots__ = ("a",)` klassiga dinamik `.b = 2` berishga urinib `AttributeError` tuting.', 'Catch AttributeError on slotted class.', `class S:\n    __slots__ = ("a",)\ns = S(); s.a = 1\ntry:\n    s.b = 2\nexcept AttributeError:\n    print("slotted")`, 'slotted', 'Only listed slots allowed', 'Prints slotted.'),
      pt('p1001_5', '5-mashq: `is None` tekshiruvi', 'Task 5: Singleton None Check', '`val = None` uchun `val is None` chiqaring.', 'Check singleton identity.', `val = None\nprint(val is None)`, 'True', 'Use is None', 'Prints True.'),
    ],
    quiz: [
      q('q1001_1', 'CPython xotirani bo‘shatishning birlamchi va tezkor mexanizmi qaysi?', 'Primary immediate memory reclamation mechanism in CPython?', ['Manual free()', 'Reference Counting', 'Mark-and-Sweep only', 'Reboot'], ['Manual free()', 'Reference Counting', 'Mark-and-Sweep only', 'Reboot'], 1, 'Reference Counting.', 'Reference Counting.'),
      q('q1001_2', 'Generational Garbage Collector (GC) aynan qaysi muammoni hal qilish uchun kerak?', 'What problem does CPython’s cyclic GC solve?', ['Oddiy integerlarni qo‘shish', 'O‘zaro bir-birini ko‘rsatib turgan circular reference (aylanma havola) larni tozalash', 'Syntax xatolar', 'Fayl o‘qish'], ['Adding ints', 'Collecting unreachable circular reference cycles', 'Syntax errors', 'File I/O'], 1, 'Aylanma havolalarni (cycles) tozalash.', 'Circular references.'),
      q('q1001_3', 'Qiymatlar tengligini tekshirish uchun qaysi operator ishlatiladi (`is` emas)?', 'Which operator checks value equality rather than memory identity?', ['is', '==', 'id', 'in'], ['is', '==', 'id', 'in'], 1, '`==`.', '`==`.'),
      q('q1001_4', '`__slots__` klassga nima beradi?', 'What is the primary benefit of `__slots__`?', ['Ko‘p merosxo‘rlik', 'Har bir obyektda `__dict__` ochmasdan xotirani tejash', 'Avtomatik JSON', 'Async execution'], ['Multiple inheritance', 'Eliminates per-instance __dict__ to save RAM', 'Auto JSON', 'Async'], 1, 'Per-instance `__dict__` ni olib tashlab xotira tejaydi.', 'Saves memory by removing `__dict__`.'),
      q('q1001_5', 'Nega `sys.getrefcount(x)` kutilganidan 1 taga ko‘proq chiqadi?', 'Why is `sys.getrefcount(x)` higher by 1 than local bindings?', ['Bug tufayli', 'Funksiyaga argument sifatida o‘tayotgan vaqtinchalik havola ham sanaladi', 'GC xatosi', 'OS keshlaydi'], ['Bug', 'Passing `x` as an argument creates a temporary reference', 'GC bug', 'OS cache'], 1, 'Argument havolasi ham sanaladi.', 'Argument reference counts as +1.'),
    ],
    homework: hw('Xotira va `__slots__` Taqqoslovi', 'Memory & __slots__ Lab', '`sys.getsizeof` va `tracemalloc` yordamida 10,000 ta oddiy `Point` obyekti bilan 10,000 ta `__slots__` li `FastPoint` obyektining xotira sarfini solishtiring.', 'Compare peak memory allocation between 10,000 regular class instances and 10,000 `__slots__` instances using `tracemalloc`.', ['tracemalloc.start() va get_traced_memory()', 'Ikkala tur natijasini foizda taqqoslash'], ['Use tracemalloc', 'Compare memory footprint'], 'import tracemalloc; tracemalloc.start()', 'Measure traced RAM.', 'Circular reference misoli ham qo‘shing.', 'Add a gc cycle test.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-02',
    courseId: 'advanced_python',
    moduleId: 'c10_m1',
    order: 2,
    titleUz: 'References, Shallow Copy, Deep Copy va Weakref',
    titleEn: 'Aliasing, Shallow vs Deep Copy & Weak References',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-10-01'],
    conceptId: 'adv_copy_weakref',
    whyUz: "Ichma-ich ro‘yxatni `b = a.copy()` qildingiz, lekin `b[0].append(99)` qilganda asl `a[0]` ham buzilib ketdi! Chunki `.copy()` va `a[:]` faqat tashqi qobiqni nusxalaydigan **Shallow Copy**. Ichki obyektlargacha mustaqil nusxa olish uchun **`copy.deepcopy()`**, refcount ni oshirmasdan kuzatish uchun esa **`weakref`** kerak!",
    whyEn: 'Master the critical difference between aliasing (`b = a`), shallow copying (`copy.copy`), recursive cloning (`copy.deepcopy`), and non-owning `weakref` references.',
    analogyUz: "**Aliasing** — bitta uyga 2 ta kalit. **Shallow Copy** — uyning yangi nusxasi, lekin ichidagi mebellar o‘sha eski omborga ulangan. **Deep Copy** — uy ham, ichidagi har bir mebel ham noldan alohida nusxalangan!",
    analogyEn: 'Aliasing shares the whole house; shallow copy duplicates the outer rooms but shares the furniture inside; deep copy duplicates everything recursively.',
    stopsUz: "Funksiya parametriga berilgan `list`/`dict` ham **call-by-object-reference (sharing)** bo‘lib o‘tadi: ichini `.append()` qilsangiz tashqi ro‘yxat o‘zgaradi! O‘zgartirmaslik uchun nusxa oling yoki `tuple` bering.",
    stopsEn: 'Python passes arguments by object sharing—mutating a passed list or dict in-place modifies the caller’s object unless copied first.',
    objUz: ['Aliasing (`b = a`), Shallow Copy (`copy.copy` / `.copy()` / `[:]`) va Deep Copy (`copy.deepcopy`) farqini ko‘rish', 'Funksiya parametrlarida accidental mutation xavfini oldini olish', '`weakref.WeakValueDictionary` kabi kuchsiz havolalarni tushunish'],
    objEn: ['Distinguish aliasing, shallow copy, and `copy.deepcopy` on nested data', 'Prevent unintended in-place mutations inside functions', 'Use `weakref.ref` to avoid keeping cached objects alive unnecessarily'],
    theoryUz: `### 1. Aliasing (\`b = a\`)
Hech narsa nusxalanmaydi — ikkala nom bitta obyektga ishora qiladi.
### 2. Shallow Copy (\`a.copy()\`, \`a[:]\`, \`copy.copy(a)\`)
Yangi tashqi konteyner ochadi, lekin ichidagi elementlarga eski havolalarni qo‘yadi. Oddiy 1-qavatli \`[1, 2, 3]\` uchun yetarli, nested \`[[1], [2]]\` uchun esa xavfli!
### 3. Deep Copy (\`copy.deepcopy(a)\`)
Rekursiv ravishda hamma ichki qavatlargacha yangi nusxa yaratadi (memo lug‘ati tufayli hatto o‘z-o‘ziga havola qilgan sikllarda ham osilib qolmaydi!).
### 4. Call-by-Object-Sharing
Python da funksiyaga obyekt havolasi uzatiladi: \`x = [1]\` ga \`.append()\` taʼsir qiladi, \`x = [9]\` qayta bog‘lash esa tashqariga taʼsir qilmaydi!
### 5. \`weakref\`
Kesh obyekt o‘chib ketishiga xalaqit bermasdan unga murojaat saqlash imkonini beradi (oddiy class nusxalari bilan ishlaydi).`,
    theoryEn: `### 1. Aliasing (\`b = a\`)
Two variable names point to the exact same object.
### 2. Shallow Copy (\`copy.copy\`, \`.copy()\`, \`[:]\`)
Allocates a new outer container whose slots still point to the original nested objects.
### 3. Deep Copy (\`copy.deepcopy\`)
Recursively clones all nested objects while preserving shared graph structure via a memo dict.
### 4. Function Argument Passing
Rebinding a parameter inside a function stays local; mutating a mutable argument affects the caller.
### 5. Weak References (\`weakref\`)
Track objects in caches or observers without incrementing their reference count.`,
    examples: [
      ex('Misol 1: Shallow vs Deep Copy nested ro‘yxatda', 'Example 1: Shallow vs Deep Copy', `import copy\n\norig = [[1, 2], [3, 4]]\nshallow = copy.copy(orig)\ndeep = copy.deepcopy(orig)\n\nshallow[0].append(99)\ndeep[1].append(77)\nprint("orig:", orig)\nprint("deep:", deep)`, `orig: [[1, 2, 99], [3, 4]]\ndeep: [[1, 2], [3, 4, 77]]`, '`shallow[0]` asl `orig[0]` ni o‘zgartirdi; `deep[1]` esa `orig[1]` ga taʼsir qilmadi.', 'Mutating a nested list in `shallow` leaks into `orig`; `deep` stays isolated.'),
      ex('Misol 2: Funksiya ichida Rebind vs Mutate', 'Example 2: Rebind vs In-Place Mutate', `def test(xs: list[int], ys: list[int]):\n    xs.append(9)   # Mutates caller's list!\n    ys = [0, 0]    # Rebinds local name only\n\na, b = [1], [1]\ntest(a, b)\nprint("a:", a, "| b:", b)`, `a: [1, 9] | b: [1]`, '`.append()` asl ro‘yxatni o‘zgartirdi, `ys = [0, 0]` esa tashqariga taʼsir qilmadi.', 'In-place mutation affects the caller; parameter rebinding does not.'),
      ex('Misol 3: `weakref` obyektni ushlab qolmasligi', 'Example 3: Weak Reference Auto-Expiry', `import weakref\n\nclass Payload:\n    pass\n\np = Payload()\nr = weakref.ref(p)\nprint("alive?", r() is p)\ndel p\nprint("after del:", r())`, `alive? True\nafter del: None`, '`p` o‘chirilganda `weakref` refcount ni oshirmagani uchun obyekt darhol tozalandi (`None`).', 'Deleting the last strong reference frees the object immediately despite the active `weakref`.'),
    ],
    traceTitleUz: 'Shallow copy tuzog‘i izi',
    traceTitleEn: 'Tracing Shallow Copy Aliasing',
    traceCode: `a = [[10]]\nb = a.copy()\nb[0][0] = 55\nprint(a[0][0])`,
    traceSteps: [
      traceStep(1, 'a = [[10]]', 'outer1 -> [inner1]', 'Asl nested ro‘yxat', 'Allocated nested list'),
      traceStep(2, 'b = a.copy()', 'outer2 -> [inner1]', 'Yangi tashqi qobiq, lekin o‘sha inner1', 'Shallow copy shares inner1'),
      traceStep(3, 'b[0][0] = 55', 'inner1=[55]', 'Ikkala tashqi ro‘yxat o‘zgardi', 'Mutated shared inner list', '55'),
    ],
    commonMistakes: [
      mistake('`[[0] * 3] * 3` bilan 2D matritsa yasash', 'Row Aliasing with List Multiplication', `grid = [[0] * 3] * 3\ngrid[0][0] = 1\nprint(grid)`, '[[1, 0, 0], [1, 0, 0], [1, 0, 0]] — all 3 rows mutated!', `grid = [[0] * 3 for _ in range(3)]\ngrid[0][0] = 1\nprint(grid)`, '`* 3` bitta ichki ro‘yxatga 3 ta havola qo‘yadi!', 'List multiplication aliases the same inner list across rows.', 'Doim list comprehension `[[0]*3 for _ in range(3)]` ishlating.', 'Use a list comprehension to allocate distinct rows.'),
      mistake('Config dict ni shallow copy qilib o‘zgartirish', 'Mutating Shallow-Copied Nested Config', `cfg = {"db": {"port": 5432}}\nc2 = cfg.copy()\nc2["db"]["port"] = 9999\nprint("Original broken:", cfg["db"]["port"])`, 'Original config mutated!', `import copy\ncfg = {"db": {"port": 5432}}\nc2 = copy.deepcopy(cfg)\nc2["db"]["port"] = 9999\nprint("Original safe:", cfg["db"]["port"])`, 'Ichki lug‘at shallow copy da umumiy bo‘lib qoladi.', 'Shallow copy shares nested dictionaries.', 'Ichma-ich konfiguratsiyalarda `copy.deepcopy()` ishlating.', 'Use `copy.deepcopy()` for nested dicts.'),
    ],
    compareTitleUz: 'Shallow Copy vs Deep Copy vs `weakref`',
    compareTitleEn: 'Shallow vs Deep Copy vs `weakref`',
    compareUz: ['Shallow (`.copy()`): tez, 1-qavatli yassi ro‘yxat/lug‘atlar uchun.', 'Deep (`copy.deepcopy()`): ichma-ich murakkab tuzilmalarni to‘liq izolyatsiya qilish uchun.', '`weakref`: keshda obyektni o‘chirishga to‘sqinlik qilmasdan kuzatish uchun.'],
    compareEn: ['Shallow copy: fast for flat collections.', 'Deep copy: safe full-graph cloning for nested configs/trees.', '`weakref`: non-owning observer/cache links.'],
    compareSummaryUz: 'Flat ro‘yxatlarda `.copy()`, nested obyektlarda `copy.deepcopy()`, keshlarda esa `weakref` ishlating.',
    compareSummaryEn: 'Use `.copy()` for flat containers, `copy.deepcopy()` for nested structures, and `weakref` for non-owning caches.',
    practiceTasks: [
      pt('p1002_1', '1-mashq: 2D matritsa to‘g‘ri yaratish', 'Task 1: Independent 2D Grid', '2x2 nol matritsani comprehension bilan tuzib `[0][1] = 5` qiling.', 'Create isolated 2x2 matrix.', `g = [[0]*2 for _ in range(2)]\ng[0][1] = 5\nprint(g)`, '[[0, 5], [0, 0]]', 'List comprehension per row', 'Prints [[0, 5], [0, 0]].'),
      pt('p1002_2', '2-mashq: `deepcopy` himoyasi', 'Task 2: Isolate Nested Dict', '`orig = {"a": [1]}` dan `deepcopy` olib nusxaga `2` qo‘shing, `orig` o‘zgarmasin.', 'Deepcopy nested dict.', `import copy\norig = {"a": [1]}\ncloned = copy.deepcopy(orig)\ncloned["a"].append(2)\nprint(orig["a"], cloned["a"])`, '[1] [1, 2]', 'copy.deepcopy(orig)', 'Prints [1] [1, 2].'),
      pt('p1002_3', '3-mashq: Slicing shallow copy', 'Task 3: Slice Copy Check', '`x = [1, 2]; y = x[:]; y.append(3)` natijasini chiqaring.', 'Verify flat slice copy.', `x = [1, 2]\ny = x[:]\ny.append(3)\nprint(x, y)`, '[1, 2] [1, 2, 3]', 'Flat slice creates new list', 'Prints [1, 2] [1, 2, 3].'),
      pt('p1002_4', '4-mashq: `weakref.ref`', 'Task 4: Weakref Lifecycle', '`class A: pass; a = A(); w = weakref.ref(a); del a` dan keyin `w()` chiqaring.', 'Observe cleared weakref.', `import weakref\nclass A: pass\na = A()\nw = weakref.ref(a)\ndel a\nprint(w())`, 'None', 'w() returns None', 'Prints None.'),
      pt('p1002_5', '5-mashq: Sof funksiya nusxa bilan', 'Task 5: Pure Function Copy', '`add_tag(tags, t)` asl ro‘yxatni o‘zgartirmay yangi ro‘yxat qaytarsin.', 'Return new list without mutating.', `def add_tag(tags, t):\n    return [*tags, t]\norig = ["py"]\nres = add_tag(orig, "oop")\nprint(orig, res)`, "['py'] ['py', 'oop']", '[*tags, t]', "Prints ['py'] ['py', 'oop']."),
    ],
    quiz: [
      q('q1002_1', '`grid = [[0] * 3] * 3` kodining muammosi nimada?', 'What bug hides in `grid = [[0] * 3] * 3`?', ['SyntaxError', 'Barcha 3 qator bitta ichki ro‘yxatga havola qiladi (aliasing)', 'Sekin ishlaydi', 'Tuple qaytaradi'], ['SyntaxError', 'All 3 rows alias the exact same inner list', 'Slow', 'Returns tuple'], 1, '3 ta qator bitta ro‘yxatga bog‘lanib qoladi.', 'Row aliasing bug.'),
      q('q1002_2', 'Ichma-ich obyektlarni to‘liq mustaqil nusxalash uchun qaysi funksiya ishlatiladi?', 'Function that recursively clones nested structures?', ['copy.copy()', 'list.copy()', 'copy.deepcopy()', 'slice [:]'], ['copy.copy()', 'list.copy()', 'copy.deepcopy()', 'slice [:]'], 2, '`copy.deepcopy()`.', '`copy.deepcopy()`.'),
      q('q1002_3', 'Funksiyaga uzatilgan `xs = [1, 2]` ichida `xs = [9]` yozilsa, tashqi ro‘yxat o‘zgaradimi?', 'Does rebinding `xs = [9]` inside a function alter the caller’s variable?', ['Ha', 'Yo‘q, faqat lokal nom qayta bog‘lanadi', 'Xato beradi', 'Faqat global bilan'], ['Yes', 'No, it only rebinds the local parameter name', 'Raises error', 'Only with global'], 1, 'Yo‘q, qayta bog‘lash lokal qoladi.', 'Rebinding parameter is local.'),
      q('q1002_4', '`weakref` oddiy havoladan nimasi bilan farq qiladi?', 'How does `weakref` differ from a normal variable reference?', ['Obyektning reference count ini oshirmaydi', 'Tezroq nusxa oladi', 'Faqat int uchun', 'Obyektni muzlatadi'], ['Does not increment reference count', 'Faster copy', 'Ints only', 'Freezes objects'], 0, 'Reference count ni oshirmaydi.', 'Does not increase refcount.'),
      q('q1002_5', 'Flat `[1, 2, 3]` ro‘yxatni tez nusxalash uchun `copy.deepcopy` shartmi?', 'Is `copy.deepcopy` necessary for a flat list of ints `[1, 2, 3]`?', ['Ha', 'Yo‘q, `.copy()` yoki `[:]` yetarli va tezroq', 'Ha, aks holda xato', 'Faqat tuple da'], ['Yes', 'No, `.copy()` or `[:]` is faster and sufficient', 'Error otherwise', 'Tuples only'], 1, 'Flat ro‘yxatlarda `.copy()` yetarli.', 'Shallow copy suffices for flat lists.'),
    ],
    homework: hw('Xavfsiz Config Merge Utilitasi', 'Safe Nested Config Clone & Merge', 'Chuqur ichma-ich `default_cfg` lug‘atini qabul qilib, asl lug‘atni aslo buzmagan holda `overrides` ni qo‘shib beruvchi `merge_configs(base, overrides)` funksiyasini `copy.deepcopy` bilan yozing.', 'Write `merge_configs(base, overrides)` using `copy.deepcopy` so mutating nested dicts never leaks back to `base`.', ['Asl base lug‘at o‘zgarmasligi shart', 'Chuqur nested dict larni birlashtirish'], ['Preserve base unmodified', 'Support nested dict merging'], 'out = copy.deepcopy(base)', 'Clone first.', '`WeakKeyDictionary` bilan obyekt metadata keshini ham qo‘shing.', 'Add a weakref metadata cache example.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-03',
    courseId: 'advanced_python',
    moduleId: 'c10_m1',
    order: 3,
    titleUz: 'Iterators va Iterables — Iterator protokoli',
    titleEn: 'Iterators, Iterables & Custom Iteration Protocol',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-10-02'],
    conceptId: 'adv_iterators',
    whyUz: "Har bir `for x in obj:` sikli orqasida nima yashiringan? Python `iter(obj)` va `next(it)` metodlari orqali ishlaydi! Bu **Iterator protokoli** tufayli million qatorli faylni ham RAM ga birdan yuklamasdan 1 qatordan o‘qish mumkin!",
    whyEn: 'Every Python `for` loop runs on the Iterator Protocol (`__iter__` and `__next__`). Distinguishing reusable Iterables from single-pass Iterators avoids subtle exhaustion bugs.',
    analogyUz: "**Iterable** (kitob) — ustida bir necha marta o‘qish mumkin bo‘lgan ma’lumot manbai (`list`, `range`). **Iterator** (xatcho‘p) — hozir qaysi sahifada turganini eslab yuradigan bitta yuruvchi ko‘rsatkich (`next()` bilan oldinga yuradi, tugasa `StopIteration` beradi va orqaga qaytmaydi!).",
    analogyEn: 'An Iterable is a book you can re-read from page 1 anytime; an Iterator is the bookmark tracking one forward pass until `StopIteration`.',
    stopsUz: "Eng muhim qoida: **Iterator bitta yurishda tugaydi (exhausts)!** Masalan `zip()`, `map()`, `filter()` va generatorlar — iteratorlardir: ularni 2-marta `for` da aylantirsangiz bo‘sh chiqadi! Qayta ishlatish uchun Iterable (`__iter__` har safar yangi iterator qaytaruvchi klass) yozing.",
    stopsEn: 'Iterators exhaust after one pass (`zip`, `map`, `filter`, file handles, generators). Reusable collections separate the Iterable (`__iter__` returning a fresh iterator) from the Iterator state.',
    objUz: ['`__iter__()` va `__next__()` metodlari bilan custom Iterator yozish', '`for` siklining ichki `iter()` + `next()` + `StopIteration` mexanizmini tushunish', 'Iterable (`list`, `range`) vs Single-pass Iterator (`zip`, `iter()`) farqini ajratish'],
    objEn: ['Implement the `__iter__` / `__next__` iterator protocol', 'Desugar `for x in seq` into `iter()`, `next()`, and `StopIteration`', 'Avoid iterator-exhaustion bugs with `zip`/`map`/generators'],
    theoryUz: `### 1. \`for\` Sikli Ichida Nima Bo‘ladi?
\`\`\`python
it = iter(collection)
while True:
    try:
        x = next(it)
    except StopIteration:
        break
\`\`\`
### 2. Iterable vs Iterator
- **Iterable**: \`__iter__()\` metodiga ega (\`list\`, \`str\`, \`range\`).
- **Iterator**: ham \`__iter__()\` (o‘zini qaytaradi: \`return self\`), ham \`__next__()\` metodiga ega.
### 3. Single-Pass Exhaustion
Iterator tugagach \`StopIteration\` tashlaydi va qayta tiklanmaydi! Agar \`zip(a, b)\` ni 2 marta \`list()\` qilsangiz, 2-si \`[]\` bo‘ladi.
### 4. \`iter(callable, sentinel)\`
Ikki argumentli \`iter(read_chunk, "")\` sentinel qiymat kelguncha avtomatik o‘qiydi.
### 5. Keng tarqalgan xato
Iteratorda \`len(it)\` yoki \`it[0]\` ishlaydi deb o‘ylash.`,
    theoryEn: `### 1. Desugaring \`for\` Loops
Python calls \`iter(obj)\` once, then repeatedly calls \`next(it)\` until \`StopIteration\`.
### 2. Iterable vs Iterator
An Iterable provides \`__iter__\` returning an Iterator; an Iterator implements both \`__iter__\` (\`return self\`) and \`__next__\`.
### 3. Exhaustion Behavior
Iterators are single-use streams; a second loop over the same iterator yields zero items.
### 4. Sentinel \`iter(fn, sentinel)\`
Call a zero-arg callable repeatedly until a sentinel value appears.
### 5. No Indexing on Iterators
Iterators don’t support \`len(it)\` or \`it[i]\`—materialize or use \`itertools.islice\`.`,
    examples: [
      ex('Misol 1: Custom `Countdown` Iterator klassi', 'Example 1: Custom Countdown Iterator', `class Countdown:\n    def __init__(self, start: int):\n        self.cur = start\n    def __iter__(self):\n        return self\n    def __next__(self) -> int:\n        if self.cur <= 0:\n            raise StopIteration\n        val = self.cur\n        self.cur -= 1\n        return val\n\ncd = Countdown(3)\nprint("First pass:", list(cd))\nprint("Second pass:", list(cd))`, `First pass: [3, 2, 1]\nSecond pass: []`, '1-o‘tishda tugagan iterator 2-o‘tishda bo‘sh ro‘yxat beradi.', 'Once exhausted, the iterator yields nothing on a second pass.'),
      ex('Misol 2: Qayta ishlatiladigan Iterable (`__iter__` yangi iterator beradi)', 'Example 2: Reusable Iterable vs Single-Pass Iterator', `class RepeatableRange:\n    def __init__(self, n: int): self.n = n\n    def __iter__(self): return iter(range(self.n))\n\nr = RepeatableRange(3)\nprint("Pass 1:", list(r), "| Pass 2:", list(r))`, `Pass 1: [0, 1, 2] | Pass 2: [0, 1, 2]`, '`__iter__` har safar yangi iterator qaytargani uchun qayta-qayta aylanish mumkin.', 'Returning a fresh iterator in `__iter__` makes the object endlessly iterable.'),
      ex('Misol 3: `next(it, default)` bilan xavfsiz olish', 'Example 3: Safe next() with Default', `it = iter(["first"])\nprint(next(it, "none"), next(it, "none"))`, `first none`, '2-argumentli `next(it, default)` `StopIteration` o‘rniga xavfsiz default qiymat qaytaradi.', 'Supplying a default to `next()` avoids `StopIteration` exceptions.'),
    ],
    traceTitleUz: 'Iterator protokoli izi',
    traceTitleEn: 'Tracing iter() and next()',
    traceCode: `it = iter([10, 20])\nprint(next(it), next(it), next(it, -1))`,
    traceSteps: [
      traceStep(1, 'it = iter([10, 20])', 'list_iterator', 'Ro‘yxatdan iterator olindi', 'Created iterator'),
      traceStep(2, 'next(it), next(it)', '10, 20', 'Elementlar ketma-ket olindi', 'Yielded 10 then 20'),
      traceStep(3, 'next(it, -1)', '-1', 'Tugagani uchun default qaytdi', 'Exhausted -> returned -1', '10 20 -1'),
    ],
    commonMistakes: [
      mistake('`zip()` yoki `map()` ni 2 marta ishlatish', 'Reusing Exhausted zip/map Iterator', `pairs = zip([1, 2], ["a", "b"])\nprint("1st:", list(pairs))\nprint("2nd:", list(pairs))`, '2nd pass prints [] unexpectedly!', `pairs = list(zip([1, 2], ["a", "b"]))\nprint("1st:", pairs)\nprint("2nd:", pairs)`, '`zip()` va `map()` iterator qaytaradi — 1 marta o‘qilgach bo‘shaydi.', '`zip()` and `map()` return single-pass iterators.', 'Bir necha marta kerak bo‘lsa `list(zip(...))` qiling.', 'Materialize to a `list` if you need multiple passes.'),
      mistake('Iterator tugaganda `None` qaytarib `StopIteration` tashlamaslik', 'Returning None Instead of Raising StopIteration', `# Returning None from __next__ creates an infinite loop printing None!`, 'Infinite loop!', `print("Always raise StopIteration inside __next__ when done!")`, '`for` sikli faqat `StopIteration` ko‘rganda to‘xtaydi.', '`for` loops only terminate on `StopIteration`.', 'Tugash shartida `raise StopIteration` yozing.', 'Raise `StopIteration` at end of stream.'),
    ],
    compareTitleUz: 'Iterable vs Iterator',
    compareTitleEn: 'Iterable vs Iterator',
    compareUz: ['Iterable: `__iter__()` bor, qayta-qayta `for` da ishlaydi (`list`, `tuple`, `range`).', 'Iterator: `__iter__()` + `__next__()` bor, bir marta o‘qiladi, O(1) xotirada oqim beradi.'],
    compareEn: ['Iterable: reusable container returning a fresh iterator each loop.', 'Iterator: stateful single-pass stream yielding items on demand.'],
    compareSummaryUz: 'Iteratorlar xotirani tejaydigan oqimdir; qayta aylanish kerak bo‘lganda Iterable (`__iter__` -> yangi iterator) yozing.',
    compareSummaryEn: 'Use Iterators for O(1) lazy streams and Iterables when callers loop repeatedly.',
    practiceTasks: [
      pt('p1003_1', '1-mashq: `iter()` va `next()`', 'Task 1: Manual Iteration', '`[7, 8]` ustida `iter()` va `next()` bilan elementlarni chiqaring.', 'Iterate manually.', `it = iter([7, 8])\nprint(next(it), next(it))`, '7 8', 'next(it) twice', 'Prints 7 8.'),
      pt('p1003_2', '2-mashq: `StopIteration` tutish', 'Task 2: Catch StopIteration', 'Bo‘sh iteratorga `next()` chaqirib `"done"` chiqaring.', 'Catch StopIteration.', `it = iter([])\ntry:\n    next(it)\nexcept StopIteration:\n    print("done")`, 'done', 'try/except StopIteration', 'Prints done.'),
      pt('p1003_3', '3-mashq: Custom `StepUp` Iterator', 'Task 3: Custom __next__', '0 dan `limit-1` gacha beruvchi `StepUp` iteratorini yozing.', 'Build StepUp iterator.', `class StepUp:\n    def __init__(self, n): self.i, self.n = 0, n\n    def __iter__(self): return self\n    def __next__(self):\n        if self.i >= self.n: raise StopIteration\n        v = self.i; self.i += 1; return v\nprint(list(StepUp(4)))`, '[0, 1, 2, 3]', 'raise StopIteration when i >= n', 'Prints [0, 1, 2, 3].'),
      pt('p1003_4', '4-mashq: `iter(obj) is obj` testi', 'Task 4: Iterator Self Identity', 'Iterator uchun `iter(it) is it`, ro‘yxat uchun `iter(xs) is xs` chiqaring.', 'Check iterator self-return.', `xs = [1]\nit = iter(xs)\nprint(iter(it) is it, iter(xs) is xs)`, 'True False', 'Iterator returns self', 'Prints True False.'),
      pt('p1003_5', '5-mashq: `next(it, fallback)`', 'Task 5: Fallback Default', 'Filtrdan birinchi juft sonni `next((x for x in [1,3,5]), None)` bilan oling.', 'Use default in next().', `print(next((x for x in [1, 3, 5] if x % 2 == 0), None))`, 'None', 'Second arg to next()', 'Prints None.'),
    ],
    quiz: [
      q('q1003_1', '`for` sikli iterator tugaganini qanday biladi?', 'How does a `for` loop detect that an iterator is exhausted?', ['None qaytarganda', 'StopIteration istisnosi chiqqanda', 'False qaytarganda', '-1 chiqqanda'], ['Returns None', 'Raises StopIteration', 'Returns False', 'Returns -1'], 1, '`StopIteration` ko‘tarilganda.', 'When `StopIteration` is raised.'),
      q('q1003_2', 'Har bir Iterator bir vaqtning o‘zida Iterable ham bo‘ladimi?', 'Is every Python Iterator also an Iterable?', ['Yo‘q', 'Ha, chunki u `__iter__` da `self` qaytaradi', 'Faqat list', 'Faqat generator'], ['No', 'Yes, its `__iter__` returns `self`', 'Lists only', 'Generators only'], 1, 'Ha, `iter(it) is it`.', 'Yes, every iterator implements `__iter__`.'),
      q('q1003_3', 'Bitta `zip(a, b)` obyektini ikki marta `list()` ga o‘girsak, 2-chi natija nima bo‘ladi?', 'Result of calling `list()` a second time on the same `zip()` object?', ['Xuddi o‘sha natija', 'Bo‘sh ro‘yxat `[]`', 'TypeError', 'None'], ['Same list', 'Empty list `[]`', 'TypeError', 'None'], 1, 'Tugagani uchun `[]`.', 'Empty `[]` because it exhausted.'),
      q('q1003_4', 'Iterator protokolini tashkil qiluvchi ikki dunder metod?', 'Which two dunder methods form the Iterator Protocol?', ['__start__ va __end__', '__iter__ va __next__', '__enter__ va __exit__', '__get__ va __set__'], ['__start__ & __end__', '__iter__ & __next__', '__enter__ & __exit__', '__get__ & __set__'], 1, '`__iter__` va `__next__`.', '`__iter__` and `__next__`.'),
      q('q1003_5', 'Iterator bo‘sh bo‘lsa xato bermasdan default olish uchun nima yoziladi?', 'Safe way to get the next item with a fallback if exhausted?', ['next(it, default)', 'it.get(default)', 'first(it)', 'pop(it)'], ['next(it, default)', 'it.get(default)', 'first(it)', 'pop(it)'], 0, '`next(it, default)`.', '`next(it, default)`.'),
    ],
    homework: hw('Chunking Stream Iterator', 'Fixed-Size Batch Iterator', 'Ixtiyoriy iterable ni `size` o‘lchamdagi bo‘laklarga (chunks) O(batch) xotirada bo‘lib beruvchi `BatchIterator(iterable, size)` klassini yozing.', 'Write a `BatchIterator(iterable, size)` implementing `__iter__` and `__next__` to yield fixed-size tuples lazily.', ['__iter__ va __next__ metodlari', 'Oxirgi qoldiq bo‘lakni ham chiqarish'], ['Implement Iterator protocol', 'Yield final partial chunk'], 'Take up to `size` items from `self._it` in `__next__`.', 'Batch slice via next().', 'Bo‘sh kirish va `size <= 0` uchun `ValueError` qo‘shing.', 'Validate size > 0.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-04',
    courseId: 'advanced_python',
    moduleId: 'c10_m2',
    order: 4,
    titleUz: 'Generators va yield — dangasa (lazy) hisoblash',
    titleEn: 'Generators, yield, yield from & Lazy Pipelines',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-10-03'],
    conceptId: 'adv_generators',
    whyUz: "Agar 10 million ta son kvadratini `[x*x for x in range(10_000_000)]` qilib yig‘sangiz, 400 MB RAM band bo‘ladi! **Generator** (`yield` yoki `(x*x for x in ...)`) esa qiymatlarni xotirada saqlamasdan bittadan, kerak paytda (lazy) ishlab chiqaradi va atigi ~200 bayt joy egallaydi!",
    whyEn: 'Generator functions (`yield`) and generator expressions (`(x for x in ...)`) suspend and resume execution lazily, processing massive or infinite streams in O(1) memory.',
    analogyUz: "**List (`return [...]`)** — bu 10,000 ta somsa pishirib stolga uyib qo‘yish. **Generator (`yield`)** — har bir xaridor kelganda aynan o‘sha payt 1 ta issiq somsa uzatadigan konveyer: stol ham band bo‘lmaydi, isrof ham yo‘q!",
    analogyEn: 'A list pre-cooks a million meals onto a giant table; a generator hands over one fresh item on demand while keeping the kitchen counter tiny.',
    stopsUz: "Funksiya ichida birorta `yield` bo‘lsa, u chaqirilganda tanasi darhol ishlamaydi — **generator obyekti** qaytaradi! Ichidagi kod faqat birinchi `next()` da yurishni boshlaydi va `yield` da to‘xtab lokal o‘zgaruvchilarni muzlatib turadi. Ichki generatorni uzatish uchun **`yield from subgen`** ishlating.",
    stopsEn: 'Calling a generator function returns a suspended generator object without executing the body yet; execution starts on the first `next()`. Delegate sub-generators cleanly with `yield from`.',
    objUz: ['`yield` funksiyasi va `return` funksiyasi o‘rtasidagi execution model farqini bilish', 'Generator expression `(x for x in ...)` yozib RAM tejash (`sys.getsizeof`)', '`yield from` bilan ichma-ich generatorlarni zanjirlash (pipeline)'],
    objEn: ['Pause and resume state across `yield` statements', 'Contrast memory footprints of list comprehensions vs generator expressions', 'Compose multi-stage lazy data pipelines and delegate with `yield from`'],
    theoryUz: `### 1. \`yield\` Qanday Ishlaydi?
\`return\` funksiyani butunlay yopadi; \`yield\` esa qiymatni tashqariga berib, funksiyaning barcha lokal o‘zgaruvchilari va instruction pointer ini muzlatib turadi!
### 2. Generator Expressions (\`(x for x in ...)\`)
\`sum(x*x for x in range(1000))\` — \`[]\` o‘rniga \`()\` ishlatib O(1) xotira sarflaydi.
### 3. \`yield from\` Delegatsiyasi
\`\`\`python
def flatten(nested):
    for sub in nested:
        yield from sub
\`\`\`
### 4. Lazy Data Pipelines
Fayl o‘qish -> filtrlash -> transformatsiya generatorlarini ketma-ket ulab gigabaytli loglarni RAM ga sig‘dirmasdan qayta ishlash mumkin!
### 5. Keng tarqalgan xato
Generatorni 2 marta \`sum(g)\` va \`len(list(g))\` ga berib, 2-sida 0 olish.`,
    theoryEn: `### 1. Suspending Execution with \`yield\`
\`yield\` pauses stack frame state and hands control back to the caller until the next \`next()\`.
### 2. Generator Expressions
\`sum(x * x for x in nums)\` avoids allocating an intermediate list.
### 3. Delegating with \`yield from\`
\`yield from iterable\` replaces boilerplate inner \`for\` loops when flattening or delegating.
### 4. Lazy Pipelines
Chain generator stages so each record flows end-to-end without buffering entire datasets in memory.
### 5. Single-Pass Exhaustion
Generators are iterators—consume once or recreate the generator when needed again.`,
    examples: [
      ex('Misol 1: Cheksiz Fibonacci generatori va `islice`', 'Example 1: Infinite Fibonacci Generator', `from itertools import islice\n\ndef fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nprint(list(islice(fib(), 7)))`, `[0, 1, 1, 2, 3, 5, 8]`, '`fib()` cheksiz sikl bo‘lsa ham faqat so‘ralgan 7 ta qiymatnigina hisoblaydi.', 'Infinite generators run safely when bounded lazily by `islice()`.'),
      ex('Misol 2: List vs Generator xotira farqi', 'Example 2: O(n) List vs O(1) Generator RAM', `import sys\n\nlst = [i for i in range(5000)]\ngen = (i for i in range(5000))\nprint("Gen much smaller than list?", sys.getsizeof(gen) < sys.getsizeof(lst) / 10)`, `Gen much smaller than list? True`, 'Generator ro‘yxatga nisbatan o‘nlab baravar kam xotira egallaydi.', 'Generator expressions take constant memory regardless of stream length.'),
      ex('Misol 3: `yield from` va Lazy Pipeline', 'Example 3: yield from & Pipeline', `def flatten(groups):\n    for g in groups:\n        yield from g\n\nevens = (x for x in flatten([[1, 2], [3, 4], [5]]) if x % 2 == 0)\nprint(list(evens))`, `[2, 4]`, '`yield from` ichki bo‘limlarni silliq tekislab, keyingi bosqichga uzatadi.', '`yield from` delegates seamlessly into a lazy filter pipeline.'),
    ],
    traceTitleUz: 'Generator muzlash/davom etish izi',
    traceTitleEn: 'Tracing Generator Yield',
    traceCode: `def gen():\n    yield "A"\n    yield "B"\ng = gen()\nprint(next(g), next(g))`,
    traceSteps: [
      traceStep(1, 'g = gen()', 'suspended at start', 'Tana hali ishlamadi', 'Body not started yet'),
      traceStep(2, 'next(g)', '"A" (paused line 2)', '1-yield da to‘xtadi', 'Yielded "A" and paused'),
      traceStep(3, 'next(g)', '"B" (paused line 3)', '2-yield ga davom etdi', 'Resumed and yielded "B"', 'A B'),
    ],
    commonMistakes: [
      mistake('Generatorda `len(g)` chaqirish', 'Calling len() on a Generator', `g = (x for x in range(5))\ntry:\n    print(len(g))\nexcept TypeError:\n    print("Generators have no len()!")`, 'TypeError: object of type generator has no len()', `g = (x for x in range(5))\nprint(sum(1 for _ in g))`, 'Generator hali keyingi qiymatlarni hisoblamagani uchun uzunligini bilmaydi.', 'Generators compute lazily so they have no `__len__`.', 'Uzunlik kerak bo‘lsa `sum(1 for _ in g)` yoki `list(g)` ishlating.', 'Count via `sum(1 for _ in g)` or materialize if small.'),
      mistake('Generator funksiyani chaqirsam birdan ishlaydi deb o‘ylash', 'Expecting Body Execution Before next()', `def side_effect():\n    print("Started!")\n    yield 1\ng = side_effect()\nprint("After call, before next")`, 'Nothing from side_effect printed yet!', `print("Generator body runs only when iterated!")`, '`g = side_effect()` faqat generator obyekti yaratadi, ichini yuritmaydi.', 'Calling a generator function only constructs the generator.', '`next(g)` yoki `for` bilan yuriting.', 'Drive it with `next()` or `for`.'),
    ],
    compareTitleUz: 'List Comprehension `[...]` vs Generator `(...)`',
    compareTitleEn: 'List Comprehension vs Generator Expression',
    compareUz: ['`[...]`: indeks (`xs[3]`), `len()`, bir necha marta aylanish kerak bo‘lganda.', '`(...)`: `sum()`, `any()`, `all()`, `max()`, katta oqimlarda 1 martalik o‘tish uchun (O(1) RAM).'],
    compareEn: ['List `[...]`: random indexing, `len()`, multi-pass reuse.', 'Generator `(...)`: streaming reductions (`sum`, `any`, `max`) in O(1) memory.'],
    compareSummaryUz: 'Katta ma’lumot oqimlarini `yield` va generator pipeline lari bilan qayta ishlang — RAM ni tejang.',
    compareSummaryEn: 'Build O(1)-memory lazy streams with `yield`, `yield from`, and generator expressions.',
    practiceTasks: [
      pt('p1004_1', '1-mashq: Oddiy `yield` generatori', 'Task 1: Squares Generator', '`squares(n)` generatorini `yield i * i` bilan yozib `list(squares(4))` chiqaring.', 'Write squares generator.', `def squares(n):\n    for i in range(1, n + 1):\n        yield i * i\nprint(list(squares(4)))`, '[1, 4, 9, 16]', 'yield i * i', 'Prints [1, 4, 9, 16].'),
      pt('p1004_2', '2-mashq: Generator expression bilan `sum`', 'Task 2: Sum of Evens', '1..10 juft sonlari yig‘indisini generator expression bilan hisoblang.', 'Use generator inside sum().', `print(sum(x for x in range(1, 11) if x % 2 == 0))`, '30', 'No square brackets needed', 'Prints 30.'),
      pt('p1004_3', '3-mashq: `yield from` bilan birlashtirish', 'Task 3: Chain via yield from', '`chain_two(a, b)` funksiyasini `yield from` bilan yozing.', 'Use yield from.', `def chain_two(a, b):\n    yield from a\n    yield from b\nprint(list(chain_two([1, 2], (3, 4))))`, '[1, 2, 3, 4]', 'yield from a; yield from b', 'Prints [1, 2, 3, 4].'),
      pt('p1004_4', '4-mashq: Ikki bosqichli pipeline', 'Task 4: 2-Stage Pipeline', 'Satrlarni `.strip()` qilib, bo‘sh emaslarini `.upper()` qiluvchi generator pipeline yozing.', 'Chain strip and upper generators.', `raw = [" py ", "", " oop "]\nclean = (s.strip().upper() for s in raw if s.strip())\nprint(list(clean))`, "['PY', 'OOP']", 'Filter then transform', "Prints ['PY', 'OOP']."),
      pt('p1004_5', '5-mashq: `any()` qisqa tutashuv (short-circuit)', 'Task 5: Short-Circuit with Generator', 'Generator bilan `any(x > 5 for x in [1, 2, 8, 9])` natijasini chiqaring.', 'Verify short-circuiting any().', `print(any(x > 5 for x in [1, 2, 8, 9]))`, 'True', 'Stops at 8 immediately', 'Prints True.'),
    ],
    quiz: [
      q('q1004_1', '`yield` so‘zining `return` dan asosiy farqi nima?', 'Key difference between `yield` and `return`?', ['Farqi yo‘q', '`yield` qiymat berib funksiya holatini saqlab to‘xtatadi, keyingi `next()` da davom etadi', '`yield` faqat int qaytaradi', '`yield` dasturni yopadi'], ['None', '`yield` suspends frame state and resumes on next `next()`', 'Ints only', 'Exits program'], 1, 'Holatni muzlatib davom etadi.', 'Suspends and resumes state.'),
      q('q1004_2', '`sum(x*x for x in range(10**6))` nega tez va kam xotira yeydi?', 'Why is `sum(x*x for x in range(10**6))` memory-efficient?', ['C tilida', 'Generator expression bir vaqtda faqat 1 ta qiymat hisoblaydi (O(1) RAM)', 'Tuple yaratadi', 'Thread ochadi'], ['In C', 'Generator computes lazily in O(1) memory', 'Creates tuple', 'Spawns threads'], 1, 'O(1) xotirada dangasa hisoblaydi.', 'O(1) lazy streaming.'),
      q('q1004_3', '`yield from sub_gen` nima qiladi?', 'What does `yield from sub_gen` do?', ['Xato beradi', 'Ichki iterable/generator elementlarini tashqariga bevosita uzatadi', 'Ro‘yxatga o‘giradi', 'Rekursiyani o‘chiradi'], ['Error', 'Delegates yielding directly to a sub-iterable/sub-generator', 'Converts to list', 'Disables recursion'], 1, 'Sub-generatorga delegatsiya qiladi.', 'Delegates directly to sub-generator.'),
      q('q1004_4', 'Generator obyektining `len(g)` chaqirilganda nima bo‘ladi?', 'What happens when calling `len(g)` on a generator?', ['Elementlar soni', 'TypeError', '0', 'None'], ['Count', 'TypeError', '0', 'None'], 1, '`TypeError: object of type generator has no len()`.', '`TypeError`.'),
      q('q1004_5', 'Generator funksiyani oddiy chaqirish `g = my_gen()` nimani qaytaradi?', 'Calling `g = my_gen()` immediately returns:', ['Birinchi qiymatni', 'Boshlanmagan generator obyektini', 'Ro‘yxatni', 'None'], ['First value', 'A suspended generator object', 'A list', 'None'], 1, 'Generator obyektini.', 'A generator object.'),
    ],
    homework: hw('Log Stream Analyzer Pipeline', 'Lazy Log Stream Processor', 'Katta log qatorlari oqimini (`parse_logs` -> `filter_errors` -> `format_summary`) faqat generatorlar (`yield`) zanjiri orqali O(1) xotirada qayta ishlovchi 3-bosqichli pipeline yozing.', 'Build a 3-stage generator pipeline (`parse -> filter_level -> format_line`) processing simulated log streams without storing intermediate lists.', ['3 ta generator bosqich', 'Hech qayerda oraliq list yaratilmasin'], ['3 chained generator stages', 'Zero intermediate list allocations'], 'for item in stage1: if cond: yield transform(item)', 'Stream record-by-record.', 'Eng ko‘p uchragan xato kodini ham sanab chiqaring.', 'Summarize error counts.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-05',
    courseId: 'advanced_python',
    moduleId: 'c10_m2',
    order: 5,
    titleUz: 'Decorators — dekoratorlar, @wraps va parametrli dekorator va Review #21',
    titleEn: 'Decorators, @functools.wraps & Parameterized Decorators (+ Review #21)',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-10-04'],
    conceptId: 'adv_decorators',
    whyUz: "50 ta API endpointingizda bir xil login tekshiruvi, vaqt o‘lchash (timing), retry yoki logging kodini qayta-qayta yozish o‘rniga bitta `@require_auth` yoki `@timed` qo‘yish kifoya! **Dekoratorlar** — funksiyaning ichini o‘zgartirmasdan unga yangi qobiliyat kiygizadigan Python ning eng kuchli vositasidir.",
    whyEn: 'Decorators wrap functions or classes with reusable cross-cutting behavior—like timing, caching, validation, and auth—using `@decorator` syntactic sugar.',
    analogyUz: "**Dekorator** — sovg‘a o‘rami (wrapper): ichidagi asosiy sovg‘a (`add(a, b)`) o‘zgarmaydi, lekin tashqarisiga chiroyli lentacha (`@log_calls` — kirish/chiqishni yozib borish) o‘raladi!",
    analogyEn: 'A decorator is gift-wrapping around a function: the core gift stays intact while the wrapper adds logging, timing, or access checks around every call.',
    stopsUz: "Har doim ichki `wrapper` funksiya tepasiga **`@functools.wraps(func)`** qo‘ying! Aks holda original funksiyaning `__name__` va `__doc__` metadata si yo‘qolib `\"wrapper\"` bo‘lib qoladi. Parametrli `@repeat(n=3)` dekoratori esa **3 qavatli funksiya** (`decorator_factory -> decorator -> wrapper`) dir!",
    stopsEn: 'Always decorate the inner wrapper with `@functools.wraps(func)` to preserve `__name__`, `__doc__`, and `__wrapped__`. Parameterized decorators (`@retry(times=3)`) require a 3-level factory returning the decorator.',
    objUz: ['`@dec` sintaksisi `fn = dec(fn)` ga teng ekanini tushunish', '`@functools.wraps(func)` bilan metadata ni saqlab `*args, **kwargs` o‘tkazish', 'Parametrli dekorator (`@repeat(n)`) va bir nechta dekorator tartibini (stacking) bilish'],
    objEn: ['Understand `@dec` as `fn = dec(fn)` wrapper binding', 'Preserve function metadata with `@functools.wraps(func)`', 'Write parameterized decorator factories (`@repeat(n)`) and stack multiple decorators'],
    theoryUz: `### 1. Dekorator Sintaksisi
\`\`\`python
@my_dec
def greet(name): ...
# Xuddi shu narsa: greet = my_dec(greet)
\`\`\`
### 2. \`@functools.wraps(func)\` Shartligi
\`@wraps(func)\` original \`__name__\`, \`__doc__\` va type metadata larini wrapper ga ko‘chirib beradi!
### 3. \`*args, **kwargs\` Universal Imzo
Wrapper har qanday funksiyaga mos tushishi uchun \`def wrapper(*args, **kwargs): return func(*args, **kwargs)\` yoziladi va **natijani \`return\` qilish** unutilmaydi!
### 4. Parametrli Dekorator (3 Qavat)
\`\`\`python
def repeat(n):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs): ...
        return wrapper
    return decorator
\`\`\`
### 5. Stacked Decorators Tartibi
Tepadan pastga qo‘llanadi: \`@A\` ustida \`@B\` -> \`A(B(func))\`.`,
    theoryEn: `### 1. Syntactic Sugar
\`@dec\` above \`def f():\` rebinds \`f = dec(f)\` at definition time.
### 2. Always Use \`@functools.wraps(func)\`
Preserves \`__name__\`, \`__doc__\`, and \`__wrapped__\` for introspection, Sphinx docs, and pytest.
### 3. Forwarding Args & Return Value
Accept \`(*args, **kwargs)\` and always \`return func(*args, **kwargs)\`.
### 4. Parameterized Decorators (3 Levels)
\`repeat(n)\` returns a \`decorator(func)\` which returns \`wrapper(*args, **kwargs)\`.
### 5. Stacking Order
\`@outer\` over \`@inner\` evaluates as \`outer(inner(func))\`.`,
    examples: [
      ex('Misol 1: `@wraps` bilan Universal Call Logger', 'Example 1: Call Tracing Decorator with @wraps', `from functools import wraps\n\ndef trace(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        res = func(*args, **kwargs)\n        print(f"CALL {func.__name__}{args} -> {res}")\n        return res\n    return wrapper\n\n@trace\ndef add(a: int, b: int) -> int:\n    return a + b\n\nout = add(3, 4)\nprint("name:", add.__name__, "out:", out)`, `CALL add(3, 4) -> 7\nname: add out: 7`, '`@wraps` tufayli `add.__name__` `"wrapper"` emas, `"add"` bo‘lib qoldi!', '`@wraps(func)` preserves `add.__name__` while tracing inputs and return values.'),
      ex('Misol 2: Parametrli `@repeat(times)` dekoratori', 'Example 2: Parameterized Decorator Factory', `from functools import wraps\n\ndef repeat(times: int):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            return [func(*args, **kwargs) for _ in range(times)]\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef ping(host: str) -> str:\n    return f"ok:{host}"\n\nprint(ping("api"))`, `['ok:api', 'ok:api', 'ok:api']`, '3 qavatli funksiya dekoratorga argument (`3`) berish imkonini yaratadi.', 'A 3-level factory accepts configuration parameters before wrapping the target function.'),
      ex('Misol 3: Dekoratorlarni ustma-ust qo‘yish (Stacking)', 'Example 3: Decorator Stacking Order', `def bold(fn): return lambda: f"<b>{fn()}</b>"\ndef upper(fn): return lambda: fn().upper()\n\n@bold\n@upper\ndef msg(): return "hi"\n\nprint(msg())`, `<b>HI</b>`, 'Avval `@upper` (`"HI"`), keyin `@bold` (`"<b>HI</b>"`) o‘raydi.', 'Inner `@upper` runs before outer `@bold` wraps the result.'),
    ],
    traceTitleUz: 'Dekorator chaqiruv izi',
    traceTitleEn: 'Tracing Wrapped Execution',
    traceCode: `def dbl(fn):\n    def w(x): return fn(x) * 2\n    return w\n@dbl\ndef inc(x): return x + 1\nprint(inc(4))`,
    traceSteps: [
      traceStep(1, '@dbl -> inc = dbl(inc)', 'inc = w', 'Taʼrif vaqtida wrapper ga ulandi', 'Rebound inc to wrapper w'),
      traceStep(2, 'inc(4) -> w(4)', 'fn(4) -> 5', 'Asl inc(4) chaqirildi', 'Called original inc(4)'),
      traceStep(3, '5 * 2', '10', 'Wrapper natijani o‘zgartirib qaytardi', 'Printed 10', '10'),
    ],
    commonMistakes: [
      mistake('Wrapper ichida `return` ni unutish', 'Forgetting to Return Wrapped Result', `def bad(fn):\n    def w(*a, **k): fn(*a, **k)  # Missing return!\n    return w\n@bad\ndef calc(x): return x + 1\nprint(calc(5))`, 'Prints None instead of 6!', `def good(fn):\n    def w(*a, **k): return fn(*a, **k)\n    return w\n@good\ndef calc(x): return x + 1\nprint(calc(5))`, '`return` yozilmasa original funksiya natijasi yo‘qolib `None` qaytadi.', 'Omitting `return` discards the underlying function’s return value.', 'Doim `return func(*args, **kwargs)` qaytaring.', 'Always return the wrapped call result.'),
      mistake('Dekoratorni chaqirib qo‘yish yoki `@wraps` siz metadata yo‘qotish', 'Omitting @functools.wraps', `def dec(fn):\n    def wrapper(): return fn()\n    return wrapper\n@dec\ndef f(): pass\nprint("Lost name:", f.__name__)`, 'f.__name__ became "wrapper"!', `from functools import wraps\ndef dec(fn):\n    @wraps(fn)\n    def wrapper(): return fn()\n    return wrapper\n@dec\ndef f(): pass\nprint("Kept name:", f.__name__)`, 'Debugging va testlarda funksiya nomi yo‘qoladi.', 'Missing `@wraps` breaks introspection and tracebacks.', 'Har doim `@wraps(fn)` ishlating.', 'Always apply `@wraps(fn)`.'),
    ],
    compareTitleUz: 'Oddiy Wrapper Funksiya vs Parametrli Dekorator',
    compareTitleEn: '2-Level vs 3-Level Decorator',
    compareUz: ['2 qavat (`@trace`): dekoratorga qo‘shimcha parametr kerak bo‘lmaganda.', '3 qavat (`@retry(n=3)`): konfiguratsiya parametri qabul qiladigan dekoratorlar uchun.'],
    compareEn: ['2-level (`@trace`): zero-argument wrapper.', '3-level (`@retry(n=3)`): parameterized decorator factory.'],
    compareSummaryUz: 'Dekoratorlarda `@functools.wraps(func)`, `(*args, **kwargs)` va `return` ni hech qachon unutmang.',
    compareSummaryEn: 'Every production decorator needs `@functools.wraps(func)`, `(*args, **kwargs)`, and returning the inner result.',
    practiceTasks: [
      pt('p1005_1', '1-mashq: Natijani ikkilantiruvchi dekorator', 'Task 1: Double Result Decorator', '`@double` dekoratori funksiya natijasini `* 2` qilsin.', 'Multiply return value by 2.', `from functools import wraps\ndef double(fn):\n    @wraps(fn)\n    def w(*a, **k): return fn(*a, **k) * 2\n    return w\n@double\ndef val(): return 7\nprint(val())`, '14', 'return fn(...) * 2', 'Prints 14.'),
      pt('p1005_2', '2-mashq: `@wraps` tekshiruvi', 'Task 2: Preserve __name__', '`@wraps` ishlatib `my_fn.__name__` `"my_fn"` chiqishini tekshiring.', 'Verify __name__ preservation.', `from functools import wraps\ndef tag(fn):\n    @wraps(fn)\n    def w(*a, **k): return fn(*a, **k)\n    return w\n@tag\ndef my_fn(): return 1\nprint(my_fn.__name__)`, 'my_fn', '@wraps(fn)', 'Prints my_fn.'),
      pt('p1005_3', '3-mashq: Parametrli `@prefix(p)`', 'Task 3: Parameterized Prefix', '`@prefix("INFO")` satr oldiga `"[INFO] "` qo‘shsin.', 'Build 3-level prefix decorator.', `from functools import wraps\ndef prefix(p):\n    def dec(fn):\n        @wraps(fn)\n        def w(*a, **k): return f"[{p}] " + fn(*a, **k)\n        return w\n    return dec\n@prefix("INFO")\ndef msg(): return "ok"\nprint(msg())`, '[INFO] ok', '3 nested functions', 'Prints [INFO] ok.'),
      pt('p1005_4', '4-mashq: Chaqiruv sanagich', 'Task 4: Call Counter', '`w.calls = 0` bilan funksiya necha marta chaqirilganini sanang.', 'Attach .calls counter.', `from functools import wraps\ndef count(fn):\n    @wraps(fn)\n    def w(*a, **k):\n        w.calls += 1\n        return fn(*a, **k)\n    w.calls = 0\n    return w\n@count\ndef hi(): return 1\nhi(); hi()\nprint(hi.calls)`, '2', 'w.calls += 1', 'Prints 2.'),
      pt('p1005_5', '5-mashq: Auth tekshiruv dekoratori', 'Task 5: Role Check Guard', '`role != "admin"` bo‘lsa `PermissionError` chiqaruvchi dekorator yozing.', 'Block non-admin caller.', `def admin_only(fn):\n    def w(role):\n        if role != "admin": raise PermissionError("denied")\n        return fn(role)\n    return w\n@admin_only\ndef wipe(role): return "wiped"\ntry:\n    wipe("guest")\nexcept PermissionError as e:\n    print(e)`, 'denied', 'Raise PermissionError', 'Prints denied.'),
    ],
    quiz: [
      q('q1005_1', '`@dec` dekorator sintaksisi qaysi kodga ekvivalent?', 'What is `@dec` above `def f():` equivalent to?', ['dec(f())', 'f = dec(f)', 'f.dec()', 'import dec'], ['dec(f())', 'f = dec(f)', 'f.dec()', 'import dec'], 1, '`f = dec(f)`.', '`f = dec(f)`.'),
      q('q1005_2', 'Wrapper tepasiga `@functools.wraps(func)` qo‘yish nima uchun shart?', 'Why apply `@functools.wraps(func)` inside a decorator?', ['Tezlatish uchun', 'Original funksiyaning `__name__` va `__doc__` metadata sini saqlab qolish uchun', 'Global scopega chiqish', 'Xatoni yutish'], ['Speed', 'Preserves original `__name__` and `__doc__`', 'Global scope', 'Silence errors'], 1, 'Metadata (`__name__`, `__doc__`) ni saqlaydi.', 'Preserves metadata.'),
      q('q1005_3', 'Argument qabul qiluvchi `@retry(3)` dekoratori nechta ichma-ich funksiya qavatidan iborat?', 'How many nested function levels does a parameterized decorator (`@retry(3)`) have?', ['1', '2', '3', '4'], ['1', '2', '3', '4'], 2, '3 qavat (factory -> decorator -> wrapper).', '3 levels.'),
      q('q1005_4', 'Wrapper oxirida `return func(*args, **kwargs)` unutilsa funksiya nima qaytaradi?', 'What happens if the wrapper forgets `return func(*args, **kwargs)`?', ['Asl qiymat', 'None', 'SyntaxError', '0'], ['Original value', 'None', 'SyntaxError', '0'], 1, '`None`.', '`None`.'),
      q('q1005_5', '`@A` ustida, `@B` pastida tursa ular qaysi tartibda o‘raydi?', 'Given `@A` above `@B` above `def f()`, what is the resulting call?', ['B(A(f))', 'A(B(f))', 'A(f)', 'Random'], ['B(A(f))', 'A(B(f))', 'A(f)', 'Random'], 1, '`A(B(f))` (pastdan tepaga o‘raydi).', '`A(B(f))`.'),
    ],
    homework: hw('Retry & Memoize Dekoratorlar Paketi', 'Resilient Decorator Toolkit', '`@retry(attempts=3)` (xato chiqsa qayta urinadigan) va `@memoize` (argument bo‘yicha keshlaydigan) dekoratorlarini `@functools.wraps` bilan noldan yozing va test qiling.', 'Implement `@retry(attempts)` and `@memoize` decorators from scratch using `@functools.wraps` and validate both.', ['@wraps(fn) ishlatilishi', 'retry fail/success holatlari test qilinishi'], ['Use @wraps(fn)', 'Test retry success after transient failures'], 'Store cache dict in closure; loop `range(attempts)` in retry.', 'Use closures cleanly.', '`__wrapped__` atributini ham tekshiring.', 'Inspect `__wrapped__`.', 25),
    reviewCheckpoint: review(
      21,
      'Review Loyiha #21: Generator + Decorator Telemetry Oqimi (105-dars Marrasi!)',
      'Review Project #21: Lazy Pipeline + Decorator Engine',
      '105-dars marrasi! Kurs 10 ning Memory/Iterator/Generator/Decorator vositalarini birlashtirib, dangasa ma’lumot oqimi ustida hisoblagich va keshlovchi dekoratorlarni ishga tushiring.',
      '105-lesson milestone! Combine custom iterators/generators with `@wraps` tracing and memoization decorators.',
      ['`yield` orqali lazy kvadratlar oqimi', '`@trace_calls` dekoratori (`@wraps` + `calls` hisoblagichi)', 'O(1) xotirali pipeline natijasi'],
      ['Lazy `yield` generator pipeline', '`@trace_calls` decorator preserving `__name__`', 'Counted and summarized stream output'],
      `from functools import wraps

def count_calls(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@count_calls
def transform(x: int) -> int:
    return x * x + 1

stream = (transform(i) for i in range(1, 6))
print("Stream:", list(stream), "| Calls:", transform.calls)
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-06',
    courseId: 'advanced_python',
    moduleId: 'c10_m2',
    order: 6,
    titleUz: 'Closures va Higher-Order Functions (Late-Binding Tuzog‘i)',
    titleEn: 'Closures, Higher-Order Functions & Late Binding Trap',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-10-05'],
    conceptId: 'adv_closures',
    whyUz: "Nega sikl ichida `[lambda: i for i in range(3)]` yozsangiz hamma funksiya `0, 1, 2` o‘rniga `2, 2, 2` qaytaradi? Bu Python intervyularidagi №1 savol: **Closure va Late-Binding**! Uni tushunsangiz `nonlocal`, factory funksiyalar va dekoratorlar siri to‘liq ochiladi.",
    whyEn: 'Closures let inner functions remember enclosing scope variables via `__closure__` cells—but Python’s late binding in loops surprises many developers unless captured explicitly.',
    analogyUz: "**Closure** — tashqi funksiya yopilgandan keyin ham ichki funksiya qo‘lida olib chiqqan shaxsiy ryukzak (`__closure__`). **Late Binding** esa — rasm chizib olish o‘rniga uyning kalitini berish: sikl tugaganda uy ichidagi `i` allaqachon `2` ga aylanib bo‘lgan bo‘ladi!",
    analogyEn: 'A closure packs enclosing variables into a cell backpack; late binding means every lambda holds a reference to the same loop box rather than a snapshot.',
    stopsUz: "`for i in range(3): funcs.append(lambda: i)` da `i` qiymati yaratilganda emas, funksiya **chaqirilganda** qaraladi! Yechimi: **`lambda i=i: i`** (default argument darhol bog‘lanadi!) yoki factory funksiya `make_fn(i)`. O‘zgartirish uchun esa `nonlocal` ishlatiladi.",
    stopsEn: 'Closures look up enclosing loop variables at call time (late binding). Capture the current loop value eagerly via `lambda i=i: i` or a helper factory function.',
    objUz: ['Closure va `__closure__` (cell objects) mexanizmini tushunish', '`nonlocal` bilan tashqi funksiya o‘zgaruvchisini yangilash', 'Late-binding loop tuzog‘ini `i=i` yoki factory bilan tuzatish'],
    objEn: ['Inspect closure cells via `fn.__closure__`', 'Mutate enclosing bindings safely with `nonlocal`', 'Fix late-binding loop lambdas with default args or factories'],
    theoryUz: `### 1. Higher-Order Functions
Funksiyani argument sifatida qabul qiluvchi yoki yangi funksiya qaytaruvchi funksiyalar (\`sorted(key=...)\`, \`make_multiplier(n)\`).
### 2. Closure Uchta Sharti
1. Tashqi funksiya ichida ichki funksiya bor.
2. Ichki funksiya tashqi funksiya o‘zgaruvchisiga murojaat qiladi.
3. Tashqi funksiya o‘sha ichki funksiyani qaytaradi.
### 3. \`nonlocal\` Kalit So‘zi
Ichki funksiyada \`count += 1\` yozish uchun \`nonlocal count\` eʼlon qilish kerak, aks holda \`UnboundLocalError\` chiqadi!
### 4. Late-Binding Loop Tuzog‘i
\`[lambda: i for i in range(3)]\` -> hamma funksiya bitta \`i\` cell ga bog‘lanadi -> \`[2, 2, 2]\`.
Yechim: \`[lambda i=i: i for i in range(3)]\` -> \`[0, 1, 2]\`!`,
    theoryEn: `### 1. Higher-Order Functions
Functions that accept functions as inputs or return newly built functions.
### 2. Anatomy of a Closure
An inner function captures bindings from an enclosing scope inside \`__closure__\` cells even after the outer function exits.
### 3. Modifying Enclosing State (\`nonlocal\`)
Rebinding a captured scalar (\`count += 1\`) requires declaring \`nonlocal count\`.
### 4. The Late-Binding Closure Trap
Closures capture the variable reference, not its current value. Fix loop closures with \`lambda x=i: x\` or a factory call.`,
    examples: [
      ex('Misol 1: `nonlocal` bilan holat saqlovchi hisoblagich', 'Example 1: Stateful Closure with nonlocal', `def make_counter(start: int = 0):\n    count = start\n    def inc(step: int = 1) -> int:\n        nonlocal count\n        count += step\n        return count\n    return inc\n\nc = make_counter(10)\nprint(c(), c(5), "| closure cells:", len(c.__closure__))`, `11 16 | closure cells: 1`, '`make_counter` yopilgandan keyin ham `c` ichki `count` qiymatini eslab turadi.', 'The returned closure updates its captured `count` cell via `nonlocal`.'),
      ex('Misol 2: Late-binding tuzog‘i va `i=i` yechimi', 'Example 2: Late-Binding Trap & Default-Arg Fix', `broken = [lambda: i for i in range(3)]\nfixed = [lambda i=i: i for i in range(3)]\nprint("broken:", [f() for f in broken])\nprint("fixed:", [f() for f in fixed])`, `broken: [2, 2, 2]\nfixed: [0, 1, 2]`, 'Default argument `i=i` lambda yaratilayotgan zahoti joriy `i` qiymatini muzlatadi.', 'Default arguments bind eagerly at definition time, fixing the loop trap.'),
      ex('Misol 3: Factory funksiya (`make_power`)', 'Example 3: Higher-Order Power Factory', `def make_power(exp: int):\n    return lambda base: base ** exp\n\nsquare, cube = make_power(2), make_power(3)\nprint(square(5), cube(3))`, `25 27`, 'Har bir factory chaqiruvi o‘z alohida `exp` closure ini yaratadi.', 'Each factory invocation creates a distinct closure capturing `exp`.'),
    ],
    traceTitleUz: 'Late-binding izi',
    traceTitleEn: 'Tracing Closure Cell vs Default Arg',
    traceCode: `fns = [lambda x=i: x for i in (10, 20)]\nprint(fns[0](), fns[1]())`,
    traceSteps: [
      traceStep(1, 'i = 10', 'fn0 default x=10', '0-lambda ga 10 bog‘landi', 'Bound x=10 on fn0'),
      traceStep(2, 'i = 20', 'fn1 default x=20', '1-lambda ga 20 bog‘landi', 'Bound x=20 on fn1'),
      traceStep(3, 'print(...)', '10 20', 'Har biri o‘z qiymatini qaytardi', 'Printed 10 20', '10 20'),
    ],
    commonMistakes: [
      mistake('`nonlocal` siz tashqi o‘zgaruvchini `+= 1` qilish', 'Missing nonlocal Declaration', `def make():\n    n = 0\n    def step():\n        n += 1\n        return n\n    return step\ntry:\n    make()()\nexcept UnboundLocalError:\n    print("UnboundLocalError!")`, 'UnboundLocalError: cannot access local variable n', `def make():\n    n = 0\n    def step():\n        nonlocal n\n        n += 1\n        return n\n    return step\nprint(make()())`, '`n += 1` Python ga `n` ni lokal deb o‘ylatadi va o‘qishda xato chiqadi.', 'Assignment makes `n` local unless `nonlocal n` is declared.', '`nonlocal n` yozing.', 'Declare `nonlocal n`.'),
      mistake('Sikl ichida `lambda: i` yaratib hammasini bir xil chiqarish', 'Unbound Loop Variable in Lambdas', `bad = [lambda: i for i in range(3)]\nprint([f() for f in bad])`, '[2, 2, 2]', `good = [lambda i=i: i for i in range(3)]\nprint([f() for f in good])`, 'Barcha lambda lar oxirgi `i = 2` ni ko‘radi.', 'Every lambda reads the final value of `i`.', '`lambda i=i:` yoki factory funksiya ishlating.', 'Bind eagerly via `i=i` or a factory.'),
    ],
    compareTitleUz: 'Closure vs Kichik Class (`__call__`)',
    compareTitleEn: 'Closure vs Callable Class',
    compareUz: ['Closure: 1 ta funksiya va 1–2 ta yashirin o‘zgaruvchi uchun juda ixcham (dekoratorlar).', 'Callable Class (`__call__`): bir nechta metod va murakkab holat boshqaruvi kerak bo‘lganda.'],
    compareEn: ['Closure: concise for lightweight stateful functions and decorators.', 'Callable Class: clearer when exposing multiple methods or complex state.'],
    compareSummaryUz: 'Closure lar Python funktsional dasturlashining yuragi; sikllarda late-binding dan ehtiyot bo‘ling va `nonlocal` ni to‘g‘ri qo‘llang.',
    compareSummaryEn: 'Use closures for compact state capture, guard against loop late-binding, and declare `nonlocal` on scalar updates.',
    practiceTasks: [
      pt('p1006_1', '1-mashq: Multiplier Factory', 'Task 1: make_multiplier', '`make_mul(k)` `k` ga ko‘paytiruvchi funksiya qaytarsin.', 'Build multiplier closure.', `def make_mul(k):\n    return lambda x: x * k\ntriple = make_mul(3)\nprint(triple(7))`, '21', 'Capture k in closure', 'Prints 21.'),
      pt('p1006_2', '2-mashq: `nonlocal` yig‘uvchi', 'Task 2: Running Sum Closure', '`running_sum()` har chaqiruvda yig‘indini oshirib borsin.', 'Accumulate via nonlocal.', `def running_sum():\n    total = 0\n    def add(v):\n        nonlocal total\n        total += v\n        return total\n    return add\ns = running_sum()\nprint(s(5), s(3))`, '5 8', 'nonlocal total', 'Prints 5 8.'),
      pt('p1006_3', '3-mashq: Late-binding tuzatish', 'Task 3: Fix Loop Lambdas', '0, 2, 4 qaytaradigan 3 ta lambda ro‘yxatini yarating.', 'Capture i*2 eagerly.', `fns = [lambda v=i*2: v for i in range(3)]\nprint([f() for f in fns])`, '[0, 2, 4]', 'v=i*2 default arg', 'Prints [0, 2, 4].'),
      pt('p1006_4', '4-mashq: `__closure__` hujayrasi', 'Task 4: Inspect Closure Cell', 'Closure hujayrasi qiymatini `fn.__closure__[0].cell_contents` bilan o‘qing.', 'Read cell_contents.', `def outer(secret):\n    return lambda: secret\nf = outer("py")\nprint(f.__closure__[0].cell_contents)`, 'py', 'cell_contents', 'Prints py.'),
      pt('p1006_5', '5-mashq: Higher-order `compose`', 'Task 5: Function Composition', '`compose(f, g)(x)` -> `f(g(x))` yozing.', 'Compose two functions.', `def compose(f, g):\n    return lambda x: f(g(x))\nh = compose(lambda x: x * 2, lambda x: x + 3)\nprint(h(4))`, '14', '(4 + 3) * 2', 'Prints 14.'),
    ],
    quiz: [
      q('q1006_1', '`[lambda: i for i in range(4)]` funksiyalari chaqirilganda qaysi ro‘yxat chiqadi?', 'Output of `[f() for f in [lambda: i for i in range(4)]]`?', ['[0, 1, 2, 3]', '[3, 3, 3, 3]', '[0, 0, 0, 0]', 'Error'], ['[0, 1, 2, 3]', '[3, 3, 3, 3]', '[0, 0, 0, 0]', 'Error'], 1, 'Late binding tufayli `[3, 3, 3, 3]`.', '`[3, 3, 3, 3]` due to late binding.'),
      q('q1006_2', 'Tashqi funksiyadagi oddiy son o‘zgaruvchisini ichki funksiyada o‘zgartirish uchun nima yoziladi?', 'Keyword needed to rebind an enclosing function scalar variable?', ['global', 'nonlocal', 'outer', 'static'], ['global', 'nonlocal', 'outer', 'static'], 1, '`nonlocal`.', '`nonlocal`.'),
      q('q1006_3', 'Sikl ichidagi lambda ga joriy `i` ni darhol bog‘lashning eng ixcham usuli?', 'Idiomatic eager-binding fix for loop lambdas?', ['lambda: i', 'lambda i=i: i', 'global i', 'del i'], ['lambda: i', 'lambda i=i: i', 'global i', 'del i'], 1, '`lambda i=i: i`.', '`lambda i=i: i`.'),
      q('q1006_4', 'Closure o‘zgaruvchilari funksiya obyektining qaysi atributida saqlanadi?', 'Attribute holding closure cell objects on a function?', ['__globals__', '__closure__', '__slots__', '__mro__'], ['__globals__', '__closure__', '__slots__', '__mro__'], 1, '`__closure__`.', '`__closure__`.'),
      q('q1006_5', 'Funksiya qabul qiluvchi yoki qaytaruvchi funksiya qanday ataladi?', 'Term for a function that takes or returns another function?', ['Recursive', 'Higher-Order Function', 'Magic Method', 'Context Manager'], ['Recursive', 'Higher-Order Function', 'Magic Method', 'Context Manager'], 1, 'Higher-Order Function.', 'Higher-Order Function.'),
    ],
    homework: hw('Composable Validation Pipeline', 'Closure-Based Validators', '`min_len(n)`, `max_len(n)` va `matches_prefix(p)` factory funksiyalarini closure lar yordamida yozing, hamda ularni `validate_all(value, rules)` higher-order funksiyasidan o‘tkazing.', 'Build reusable validator factories (`min_len`, `max_len`, `has_digit`) returning closures, plus an `all_pass(val, rules)` runner.', ['Kamida 3 ta closure factory', 'Late-binding xatosiz sikl testlari'], ['At least 3 closure factories', 'Loop-created rules without late-binding bugs'], 'def min_len(n): return lambda s: len(s) >= n', 'Closure factory.', '`not_rule(rule)` kombinatorini ham qo‘shing.', 'Add a `negate(rule)` combinator.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-10-07',
    courseId: 'advanced_python',
    moduleId: 'c10_m2',
    order: 7,
    titleUz: 'Custom Context Managers — __enter__, __exit__ va @contextmanager',
    titleEn: 'Context Managers: __enter__/__exit__ & @contextmanager',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-10-06'],
    conceptId: 'adv_context_managers',
    whyUz: "`with open(...) as f:` faqat fayllar uchun emas! Ma’lumotlar bazasi tranzaksiyasini xato chiqsa `ROLLBACK`, muvaffaqiyatda `COMMIT` qilish, vaqt o‘lchash, lock olish yoki vaqtinchalik muhit o‘rnatish uchun o‘zingizning **Custom Context Manager** laringizni yozishingiz mumkin!",
    whyEn: 'Context managers guarantee deterministic setup and teardown (even on exceptions) using either class-based `__enter__/__exit__` or generator-based `@contextlib.contextmanager`.',
    analogyUz: "**Context Manager (`with`)** — bu xavfsizlik qulfli operatsiya xonasi: kirishda (`__enter__`) chiroq yoqiladi va asbob tayyorlanadi; chiqishda (`__exit__`) — ichkarida xato yuz bersa ham bermasa ham — eshik yopilib xona albatta tozalanadi!",
    analogyEn: 'A `with` block guarantees that cleanup runs on exit just like a `try...finally` guard, even when an exception occurs midway.',
    stopsUz: "1) `@contextlib.contextmanager` bilan generator yozganda tozalash kodini **`try: yield ... finally:`** ichiga qo‘ying — aks holda blok ichida xato chiqsa `yield` dan keyingi qatorlar ISHLAMAYDI! 2) Klassli `__exit__` `True` qaytarsa, xatoni yutib yuboradi (suppress); odatda `False`/`None` qaytarish kerak.",
    stopsEn: 'Always wrap `yield` inside `try ... finally` in `@contextmanager` functions so cleanup still executes when the body raises. Returning `True` from `__exit__` suppresses the exception.',
    objUz: ['`__enter__` va `__exit__(self, exc_type, exc_val, exc_tb)` protokolini yozish', '`@contextlib.contextmanager` + `try / yield / finally` bilan yengil manager yaratish', '`contextlib.suppress` va `ExitStack` dan foydalanish'],
    objEn: ['Implement class-based `__enter__` and `__exit__`', 'Write generator-based `@contextmanager` helpers with `try/finally`', 'Inspect exception propagation and `contextlib.suppress`'],
    theoryUz: `### 1. \`with\` Blokining Ichki Tuzilishi
1. \`__enter__()\` ishlaydi, qaytargan qiymati \`as var\` ga boradi.
2. Tana bajariladi.
3. Har qanday holatda \`__exit__(exc_type, exc_val, exc_tb)\` chaqiriladi!
### 2. Xatoni Boshqarish (\`__exit__\`)
Xatosiz chiqishda 3 ta parametr \`None\` bo‘ladi. \`__exit__\` \`True\` qaytarsa xato yutiladi; \`False\`/\`None\` qaytarsa xato tashqariga chiqadi.
### 3. \`@contextlib.contextmanager\`
\`\`\`python
from contextlib import contextmanager
@contextmanager
def managed(res):
    res.open()
    try:
        yield res
    finally:
        res.close()
\`\`\`
### 4. \`contextlib.suppress\` va \`ExitStack\`
\`with suppress(FileNotFoundError):\` — toza xato yutish; \`ExitStack\` — dinamik sondagi resurslarni yopish.`,
    theoryEn: `### 1. How \`with\` Works
Calls \`__enter__()\` (binding its return value to \`as\`), runs the suite, and guarantees \`__exit__()\` on any exit path.
### 2. Exception Handling in \`__exit__\`
Receives \`(exc_type, exc_val, exc_tb)\` or \`(None, None, None)\`. Return \`True\` only when intentionally suppressing an exception.
### 3. \`@contextlib.contextmanager\`
Write setup before \`try: yield resource\` and cleanup inside \`finally:\`.
### 4. \`suppress\` and \`ExitStack\`
Use \`contextlib.suppress(Err)\` for explicit single-error ignoring and \`ExitStack\` for dynamic resource lists.`,
    examples: [
      ex('Misol 1: Klassli Tranzaksiya Context Manager', 'Example 1: Class-Based Transaction Manager', `class Transaction:\n    def __init__(self, log: list[str]):\n        self.log = log\n    def __enter__(self):\n        self.log.append("BEGIN")\n        return self\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.log.append("ROLLBACK" if exc_type else "COMMIT")\n        return False\n\nlog1, log2 = [], []\nwith Transaction(log1):\n    log1.append("INSERT")\ntry:\n    with Transaction(log2):\n        raise RuntimeError("boom")\nexcept RuntimeError:\n    pass\nprint("log1:", log1)\nprint("log2:", log2)`, `log1: ['BEGIN', 'INSERT', 'COMMIT']\nlog2: ['BEGIN', 'ROLLBACK']`, 'Muvaffaqiyatda `COMMIT`, xatoda esa avtomatik `ROLLBACK` ishladi.', '`__exit__` commits cleanly on success and rolls back automatically when an exception occurs.'),
      ex('Misol 2: `@contextmanager` + `try / finally`', 'Example 2: Generator @contextmanager', `from contextlib import contextmanager\n\n@contextmanager\ndef bracket(tag: str, out: list[str]):\n    out.append(f"<{tag}>")\n    try:\n        yield out\n    finally:\n        out.append(f"</{tag}>")\n\nbuf: list[str] = []\nwith bracket("div", buf) as b:\n    b.append("hello")\nprint("".join(buf))`, `<div>hello</div>`, '`try/finally` yopuvchi teg har qanday vaziyatda qo‘shilishini kafolatlaydi.', 'The `finally` block guarantees cleanup runs after `yield`.'),
      ex('Misol 3: `contextlib.suppress`', 'Example 3: Clean Error Suppression', `from contextlib import suppress\n\nd = {"a": 1}\nwith suppress(KeyError):\n    del d["missing"]\nprint("Continued safely:", d)`, `Continued safely: {'a': 1}`, '`suppress(KeyError)` bo‘sh `try/except: pass` o‘rniga o‘qilishi oson muqobil.', '`suppress` replaces noisy `try / except: pass` blocks cleanly.'),
    ],
    traceTitleUz: 'with bloki exit izi',
    traceTitleEn: 'Tracing __enter__ and __exit__',
    traceCode: `class CM:\n    def __enter__(self): print("IN"); return 42\n    def __exit__(self, *a): print("OUT")\nwith CM() as x:\n    print(x)`,
    traceSteps: [
      traceStep(1, 'CM().__enter__()', 'x = 42', 'IN chop etildi va 42 olindi', 'Printed IN, bound x=42'),
      traceStep(2, 'print(x)', '42', 'Blok tanasi ishladi', 'Executed body'),
      traceStep(3, '__exit__(None, None, None)', 'OUT', 'Blok tugab OUT ishladi', 'Guaranteed exit cleanup', 'IN\n42\nOUT'),
    ],
    commonMistakes: [
      mistake('`@contextmanager` da `yield` ni `try/finally` ga olmaslik', 'Omitting try/finally in @contextmanager', `from contextlib import contextmanager\n@contextmanager\ndef unsafe(log):\n    try: pass\n    yield\n    log.append("CLEANED")  # Skipped if body raises!`, 'Cleanup skipped on exception!', `from contextlib import contextmanager\n@contextmanager\ndef safe(log):\n    try:\n        yield\n    finally:\n        log.append("CLEANED")\nlog = []\ntry:\n    with safe(log): raise ValueError()\nexcept ValueError:\n    pass\nprint(log)`, 'Blok ichida xato chiqsa `yield` dan keyingi oddiy qatorlar bajarilmay qoladi.', 'Without `finally`, exceptions skip cleanup after `yield`.', 'Doim `try: yield ... finally:` yozing.', 'Always wrap `yield` in `try ... finally`.'),
      mistake('`__exit__` da tasodifan `return True` qilib xatoni yutib yuborish', 'Accidentally Suppressing Exceptions via return True', `# Returning True from __exit__ hides bugs inside the with block!`, 'Silent swallowed bugs', `print("Return False (or None) unless explicitly suppressing!")`, '`return True` barcha xatolarni (hatto `KeyError`, `TypeError`) yashirib qo‘yadi.', 'Returning `True` swallows arbitrary bugs inside `with`.', 'Xatoni yutish shart bo‘lmasa `return False` yozing.', 'Return `False` by default.'),
    ],
    compareTitleUz: 'Klassli (`__enter__`/`__exit__`) vs `@contextmanager`',
    compareTitleEn: 'Class CM vs `@contextmanager`',
    compareUz: ['Klass (`__enter__`/`__exit__`): qayta ishlatiladigan, murakkab holatli va metodli obyektlar uchun.', '`@contextmanager`: 5–10 qatorli tezkor setup/teardown wrapper lar uchun juda ixcham.'],
    compareEn: ['Class CM: reusable objects exposing extra methods/state.', '`@contextmanager`: concise generator syntax for simple setup/teardown.'],
    compareSummaryUz: 'Resurslarni va tranzaksiyalarni har doim `with` Context Manager lar bilan boshqaring; `@contextmanager` da `try/finally` ni unutmang.',
    compareSummaryEn: 'Wrap deterministic setup/teardown in context managers and always protect `@contextmanager` yields with `try/finally`.',
    practiceTasks: [
      pt('p1007_1', '1-mashq: Oddiy `__enter__`/`__exit__`', 'Task 1: Basic Class CM', '`Gate` kirishda `"open"`, chiqishda `"close"` chop etsin.', 'Implement Gate CM.', `class Gate:\n    def __enter__(self): print("open")\n    def __exit__(self, *a): print("close")\nwith Gate():\n    print("work")`, 'open\nwork\nclose', 'Define __enter__ and __exit__', 'Prints open, work, close.'),
      pt('p1007_2', '2-mashq: `@contextmanager` + `finally`', 'Task 2: Safe Generator CM', '`guard(log)` kirishda `"start"`, xato chiqsa ham oxirida `"end"` qo‘shsin.', 'Guarantee end with finally.', `from contextlib import contextmanager\n@contextmanager\ndef guard(log):\n    log.append("start")\n    try: yield\n    finally: log.append("end")\nlog = []\ntry:\n    with guard(log): raise RuntimeError()\nexcept RuntimeError:\n    pass\nprint(log)`, "['start', 'end']", 'try: yield finally:', "Prints ['start', 'end']."),
      pt('p1007_3', '3-mashq: Xatoni yutish (`return True`)', 'Task 3: Suppress ValueError', '`__exit__` faqat `exc_type is ValueError` da `True` qaytarsin.', 'Suppress only ValueError.', `class IgnoreVal:\n    def __enter__(self): pass\n    def __exit__(self, t, v, tb): return t is ValueError\nwith IgnoreVal():\n    raise ValueError("skip")\nprint("survived")`, 'survived', 'return t is ValueError', 'Prints survived.'),
      pt('p1007_4', '4-mashq: `contextlib.suppress`', 'Task 4: Use suppress()', '`suppress(ZeroDivisionError)` bilan bo‘lish xatosini o‘tkazing.', 'Use contextlib.suppress.', `from contextlib import suppress\nwith suppress(ZeroDivisionError):\n    _ = 1 / 0\nprint("ok")`, 'ok', 'with suppress(ZeroDivisionError):', 'Prints ok.'),
      pt('p1007_5', '5-mashq: `as` qiymatini qaytarish', 'Task 5: Return Resource from __enter__', '`__enter__` `{"status": "ready"}` qaytarsin va `as cfg` orqali chiqaring.', 'Return dict from __enter__.', `class CfgCM:\n    def __enter__(self): return {"status": "ready"}\n    def __exit__(self, *a): return False\nwith CfgCM() as cfg:\n    print(cfg["status"])`, 'ready', 'Return value in __enter__', 'Prints ready.'),
    ],
    quiz: [
      q('q1007_1', '`with` bloki ichida istisno (Exception) chiqsa `__exit__` ishlaydimi?', 'Does `__exit__` still run if an exception is raised inside the `with` body?', ['Yo‘q', 'Ha, har doim ishlaydi va xato ma’lumotlarini oladi', 'Faqat SyntaxError da', 'Faqat `return True` bo‘lsa'], ['No', 'Yes, always, receiving `(exc_type, exc_val, exc_tb)`', 'SyntaxError only', 'Only if True'], 1, 'Ha, `__exit__` har qanday chiqishda ishlaydi.', 'Yes, guaranteed on all exits.'),
      q('q1007_2', '`__exit__` `True` qaytarsa nima yuz beradi?', 'What happens when `__exit__` returns `True`?', ['Xato qayta ko‘tariladi', 'Xato yutiladi (suppress) va dastur `with` dan keyin davom etadi', 'Dastur to‘xtaydi', 'TypeError chiqadi'], ['Re-raises', 'Suppresses the exception cleanly', 'Exits', 'TypeError'], 1, 'Istisno yutiladi.', 'Suppresses the exception.'),
      q('q1007_3', '`@contextmanager` funksiyasida xato chiqqanda ham tozalash ishlashi uchun `yield` qayerga yoziladi?', 'How should `yield` be structured in `@contextmanager` so cleanup always runs?', ['Oddiy qatorga', '`try: yield ... finally:` blokiga', 'Faqat `if` ichiga', '`while` ichiga'], ['Bare yield', 'Inside `try: yield ... finally:`', 'If block', 'While loop'], 1, '`try: yield ... finally:` ichiga.', 'Wrapped in `try ... finally`.'),
      q('q1007_4', '`with CM() as x:` da `x` ga qaysi metod qaytargan qiymat boradi?', 'Which method supplies the value bound to `x` in `with CM() as x:`?', ['__init__', '__enter__', '__exit__', '__call__'], ['__init__', '__enter__', '__exit__', '__call__'], 1, '`__enter__()`.', '`__enter__()`.'),
      q('q1007_5', '`try: ... except KeyError: pass` o‘rniga qaysi standart context manager qulay?', 'Built-in context manager replacing `try ... except KeyError: pass`?', ['contextlib.ignore', 'contextlib.suppress', 'contextlib.null', 'contextlib.skip'], ['contextlib.ignore', 'contextlib.suppress', 'contextlib.null', 'contextlib.skip'], 1, '`contextlib.suppress`.', '`contextlib.suppress`.'),
    ],
    homework: hw('Temp State & Lock Context Manager', 'Scoped Settings Override CM', 'Lug‘atdagi konfiguratsiya kalitini `with override_setting(cfg, key, temp_val):` bloki ichida vaqtincha almashtirib, blokdan chiqishda (hatto xato yuz bersa ham) eski qiymatini tiklaydigan `@contextmanager` yozing.', 'Write an `@contextmanager` `override_setting(cfg, key, temp_val)` that temporarily sets a key and restores its previous state (or removes it if newly added) inside `finally:`.', ['@contextmanager + try/finally', 'Xato yuz berganda ham asl qiymat tiklanishi'], ['@contextmanager with try/finally', 'Restores original value on exception'], 'Save `had_key = key in cfg; old = cfg.get(key)` before `try:`.', 'Restore inside finally.', 'Bir nechta kalit uchun `ExitStack` bilan test qiling.', 'Chain multiple overrides with `ExitStack`.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),
];
