import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C05_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-05-07',
    courseId: 'functions',
    moduleId: 'c05_m2',
    order: 7,
    titleUz: '`*args` va `**kwargs` — moslashuvchan parametrlar',
    titleEn: 'Variadic Functions: `*args` & `**kwargs`',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-05-06'],
    conceptId: 'args_kwargs',
    whyUz: "Baʼzan funksiyaga nechta son (`sum_all(1, 2, 3, 4)`) yoki nechta konfiguratsiya kaliti (`build_user(name='Ali', role='dev', city='Toshkent')`) kelishini oldindan bilmaysiz. `*args` va `**kwargs` shuni hal qiladi!",
    whyEn: '`*args` and `**kwargs` enable functions, decorators, and wrappers to accept arbitrary positional and keyword arguments.',
    analogyUz: "`*args` — bu xohlagancha qo‘shimcha positional narsalarni yig‘adigan **tuple sumka**; `**kwargs` — esa kalit=qiymat ko‘rinishidagi istalgan yorliqlarni yig‘adigan **dict jomadon**.",
    analogyEn: '`*args` gathers extra positional inputs into a `tuple`; `**kwargs` gathers extra named inputs into a `dict`.',
    stopsUz: "Parametrlar tartibi qatʼiy: `def fn(pos, *args, kw_only=1, **kwargs):` — `**kwargs` har doim **eng oxirida** turishi shart! Aks holda `SyntaxError` chiqadi.",
    stopsEn: 'Parameter order is strict: standard params, `*args`, keyword-only params, then `**kwargs` last.',
    objUz: ['`*args` (`tuple`) va `**kwargs` (`dict`) turlarini va qoidalarini bilish', 'To‘g‘ri parametr tartibini (`a, *args, flag=True, **kwargs`) yozish', 'Argument ochish (unpacking call): `fn(*nums, **cfg)` ni qo‘llash'],
    objEn: ['Receive variable arguments via `*args` (tuple) and `**kwargs` (dict)', 'Maintain strict parameter ordering rules', 'Unpack sequences/dicts into function calls via `*` and `**`'],
    theoryUz: `### 1. \`*args\` — Istalgan Sonda Positional Argument
\`def total(*nums):\` ichida \`nums\` avtomatik **\`tuple\`** bo‘ladi. \`total(1, 2, 3)\` -> \`nums = (1, 2, 3)\`.
### 2. \`**kwargs\` — Istalgan Sonda Keyword Argument
\`def profile(**info):\` ichida \`info\` avtomatik **\`dict\`** bo‘ladi. \`profile(name="Ali", age=22)\` -> \`info = {"name": "Ali", "age": 22}\`.
### 3. Qatʼiy Parametr Tartibi
\`def api(endpoint, *args, timeout=5, **kwargs):\`
1. Oddiy parametrlar (\`endpoint\`)
2. \`*args\`
3. Keyword-only parametrlar (\`timeout=5\`)
4. \`**kwargs\` (eng oxirida!)
### 4. Chaqiruvda Unpacking (\`*\` va \`**\`)
\`nums = [10, 20]\`; \`cfg = {"sep": "-"}\`; \`print(*nums, **cfg)\` -> \`10-20\`!
### 5. Keng tarqalgan xato
\`def bad(**kwargs, *args):\` -> \`SyntaxError\`.`,
    theoryEn: `### 1. \`*args\` Packs Positional Extras into a \`tuple\`
\`def total(*nums): return sum(nums)\`.
### 2. \`**kwargs\` Packs Keyword Extras into a \`dict\`
\`def log(msg, **meta): ...\`.
### 3. Mandatory Signature Order
\`(regular, *args, keyword_only, **kwargs)\`.
### 4. Unpacking at Call Sites
Spread lists with \`*\` and dicts with \`**\` into any compatible call.
### 5. Common Mistake
Placing \`*args\` after \`**kwargs\` is a \`SyntaxError\`.`,
    examples: [
      ex('Misol 1: `*args` va `**kwargs` birgalikda', 'Example 1: Combining *args & **kwargs', `def summarize(title, *scores, **meta):\n    avg = sum(scores) / len(scores) if scores else 0\n    print(title, "| Avg:", round(avg, 1), "| Meta:", meta)\n\nsummarize("Quiz", 80, 90, 100, group="A1", term=1)`, `Quiz | Avg: 90.0 | Meta: {'group': 'A1', 'term': 1}`, '`scores` tuple bo‘ldi, `meta` esa dict bo‘lib yig‘ildi.', 'Variadic scores packed as tuple; metadata packed as dict.'),
      ex('Misol 2: Chaqiruvda `*` va `**` unpacking', 'Example 2: Unpacking into Calls', `def calc(a, b, *, mult=1):\n    return (a + b) * mult\n\npair = [3, 7]\nopts = {"mult": 10}\nprint(calc(*pair, **opts))`, `100`, '`*pair` `3, 7` ni, `**opts` `mult=10` ni uzatdi.', 'Unpacked sequence and dict cleanly into function signature.'),
      ex('Misol 3: Wrapper (Forwarding) funksiya', 'Example 3: Argument Forwarding', `def trace_call(fn, *args, **kwargs):\n    res = fn(*args, **kwargs)\n    print("Result:", res)\n    return res\n\ntrace_call(max, 4, 12, 9)`, `Result: 12`, 'Barcha argumentlar ichki `fn` ga yo‘naltirildi — dekoratorlar asosidir.', 'Forwarded arbitrary args/kwargs directly to target function.'),
    ],
    traceTitleUz: '`*args` / `**kwargs` yig‘ilish izi',
    traceTitleEn: 'Tracing Variadic Binding',
    traceCode: `def f(a, *b, **c):\n    print(a, b, c)\n\nf(1, 2, 3, k=9)`,
    traceSteps: [
      traceStep(1, '1 -> a', 'a=1', 'Positional a ga tushdi', 'Bound first arg to a'),
      traceStep(2, '2, 3 -> *b', 'b=(2, 3)', 'Qolgan positionallar tuple bo‘ldi', 'Remaining positional args packed as tuple'),
      traceStep(3, 'k=9 -> **c', "c={'k': 9}", 'Keywordlar dict bo‘ldi', 'Keyword args packed as dict', "1 (2, 3) {'k': 9}"),
    ],
    commonMistakes: [
      mistake('`**kwargs` ni `*args` dan oldin yozish', 'Invalid Order **kwargs Before *args', `def f(**kw, *a):\n    pass`, 'SyntaxError: arguments cannot follow var-keyword argument', `def f(*a, **kw):\n    return len(a), len(kw)\nprint(f(1, 2, x=3))`, '`**kwargs` doim eng oxirgi parametr bo‘lishi shart.', '`**kwargs` must always be last.', 'Tartib: `(pos, *args, kw_only, **kwargs)`.', 'Place `*args` before `**kwargs`.'),
      mistake('Unpacking qilmay dict uzatish', 'Passing Dict Without **', `def greet(name="Guest"):\n    return f"Hi {name}"\ncfg = {"name": "Ali"}\nprint(greet(cfg))`, "Prints Hi {'name': 'Ali'} instead of Hi Ali", `def greet(name="Guest"):\n    return f"Hi {name}"\ncfg = {"name": "Ali"}\nprint(greet(**cfg))`, '`greet(cfg)` butun dict ni bitta positional `name` ga berib yubordi.', 'Passing `cfg` directly binds the whole dict as `name`.', 'Dict ni keywordlarga ochish uchun `**cfg` yozing.', 'Unpack dicts with `**cfg`.'),
    ],
    compareTitleUz: 'Aniq parametrlar (`a, b, c`) vs `*args, **kwargs`',
    compareTitleEn: 'Explicit Params vs `*args / **kwargs`',
    compareUz: ['Aniq parametrlar: IDE yordam beradi, type-check oson, xatoni darrov ushlaydi.', '`*args/**kwargs`: wrapperlar, dekoratorlar va cheksiz argumentli utilitalar uchun.'],
    compareEn: ['Explicit params: self-documenting and type-checked.', '`*args/**kwargs`: ideal for decorators, adapters, and variadic helpers.'],
    compareSummaryUz: 'Zarurat bo‘lmasa aniq parametrlar yozing; `*args/**kwargs` ni faqat haqiqiy moslashuvchanlik kerak joyda ishlating.',
    compareSummaryEn: 'Prefer explicit parameters when known; reserve `*args/**kwargs` for variadic wrappers.',
    practiceTasks: [
      pt('p0507_1', '1-mashq: `*args` yig‘indisi', 'Task 1: Sum *args', '`sum_all(*nums)` yozib `sum_all(2, 4, 6)` ni chiqaring.', 'Sum arbitrary ints.', `def sum_all(*nums):\n    return sum(nums)\nprint(sum_all(2, 4, 6))`, '12', 'sum(nums)', 'Pass 3 numbers.'),
      pt('p0507_2', '2-mashq: `**kwargs` kalitlari', 'Task 2: Dict Keys', '`count_opts(**kw)` `len(kw)` qaytarsin; `count_opts(a=1, b=2)` ni chiqaring.', 'Return count of kwargs.', `def count_opts(**kw):\n    return len(kw)\nprint(count_opts(a=1, b=2))`, '2', 'len(kw)', 'Count keys.'),
      pt('p0507_3', '3-mashq: Aralash tartib', 'Task 3: Full Signature', '`f(x, *args, scale=1, **kw)` da `(x + sum(args)) * scale` qaytaring.', 'Combine regular, *args, kw-only.', `def f(x, *args, scale=1, **kw):\n    return (x + sum(args)) * scale\nprint(f(1, 2, 3, scale=10, debug=True))`, '60', 'Order: x, *args, scale=1, **kw', 'Call with scale=10.'),
      pt('p0507_4', '4-mashq: Ro‘yxatni `*` bilan ochish', 'Task 4: Spread List', '`add3(a, b, c)` ga `[10, 20, 30]` ni `*` bilan uzating.', 'Unpack list into add3.', `def add3(a, b, c):\n    return a + b + c\nvals = [10, 20, 30]\nprint(add3(*vals))`, '60', 'add3(*vals)', 'Use *vals.'),
      pt('p0507_5', '5-mashq: Dict ni `**` bilan ochish', 'Task 5: Spread Dict', '`fmt(k, v)` ga `{"k": "port", "v": 80}` ni `**` bilan uzating.', 'Unpack dict into fmt.', `def fmt(k, v):\n    return f"{k}={v}"\nd = {"k": "port", "v": 80}\nprint(fmt(**d))`, 'port=80', 'fmt(**d)', 'Use **d.'),
    ],
    quiz: [
      q('q0507_1', 'Funksiya ichida `*args` qaysi ma’lumot turida bo‘ladi?', 'Type of `args` inside `def f(*args):`?', ['list', 'tuple', 'set', 'dict'], ['list', 'tuple', 'set', 'dict'], 1, '`tuple`.', '`tuple`.'),
      q('q0507_2', 'Funksiya ichida `**kwargs` qaysi turda bo‘ladi?', 'Type of `kwargs` inside `def f(**kwargs):`?', ['list', 'tuple', 'dict', 'set'], ['list', 'tuple', 'dict', 'set'], 2, '`dict`.', '`dict`.'),
      q('q0507_3', 'Qaysi funksiya sarlavhasi TO‘G‘RI?', 'Which header is syntactically valid?', ['def f(**kw, *a):', 'def f(*a, x=1, **kw):', 'def f(x=1, y):', 'def f(**kw, x=1):'], ['def f(**kw, *a):', 'def f(*a, x=1, **kw):', 'def f(x=1, y):', 'def f(**kw, x=1):'], 1, '`*args`, keyin keyword-only, eng oxirida `**kwargs`.', '`(*args, kw_only, **kwargs)`.'),
      q('q0507_4', '`*args` nomi o‘rniga `*nums` yozish mumkinmi?', 'Can you name `*args` as `*nums`?', ['Yo‘q', 'Ha, `*` muhim, nom ixtiyoriy', 'Faqat Python 3.12 da', 'Xato beradi'], ['No', 'Yes, `*` matters, name is convention', '3.12 only', 'Error'], 1, 'Ha, `*` belgisi muhim; `args` shunchaki konvensiya.', 'Yes, `*` syntax matters.'),
      q('q0507_5', 'Chaqiruvda dict ni keyword argumentlarga ochuvchi belgi?', 'Operator unpacking dict into keyword args?', ['*', '&', '**', '@'], ['*', '&', '**', '@'], 2, '`**`.', '`**`.'),
    ],
    homework: hw('Universal Log Formatlovchi Funksiya', 'Flexible Logger Utility', '`log_event(level, *messages, sep=" | ", **context)` funksiyasini tuzing: xabarlarni `sep` bilan birlashtirsin va context juftliklarini oxiriga chiqarsin.', 'Write `log_event(level, *messages, sep=" | ", **context)` combining positional messages and keyword metadata.', ['*messages, keyword-only sep, **context', '2 ta misol chaqiruv'], ['Include *messages, sep, **context', 'Test 2 calls'], 'body = sep.join(str(m) for m in messages)', 'Join messages safely.', '`timestamp` yo‘q bo‘lsa default qiymat qo‘shing.', 'Add default metadata key.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-05-08',
    courseId: 'functions',
    moduleId: 'c05_m3',
    order: 8,
    titleUz: 'Local va Global Scope — LEGB qoidasi',
    titleEn: 'Local vs Global Scope & the LEGB Lookup Rule',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-05-07'],
    conceptId: 'scope_legb',
    whyUz: "Nima uchun funksiya ichidagi `x` tashqaridagi `x` ga taʼsir qilmaydi? Nima uchun `x += 1` yozganda to‘satdan `UnboundLocalError` chiqadi? Bularning barchasini Python'ning **LEGB** qoidasi tushuntiradi.",
    whyEn: 'Understanding Python’s LEGB scope resolution rule explains variable visibility and eliminates `UnboundLocalError` bugs.',
    analogyUz: "LEGB — bu ko‘zoynak qidirish tartibi: avval stolingiz ustini (**L**ocal), keyin qo‘shni xonani (**E**nclosing), keyin butun uyni (**G**lobal), oxirida do‘konni (**B**uilt-in) qaraysiz.",
    analogyEn: 'LEGB searches like looking for keys: your pocket (**L**ocal), room (**E**nclosing), house (**G**lobal), then standard hardware (**B**uilt-in).',
    stopsUz: "Funksiya ichida `count = count + 1` yozsangiz, Python `count = ...` tayinlashini ko‘rishi bilanoq `count` ni **butun funksiya bo‘ylab LOCAL** deb belgilaydi — natijada o‘qish paytida `UnboundLocalError` chiqadi! Tashqi o‘zgaruvchini o‘zgartirish o‘rniga uni argument qilib berib `return` qiling.",
    stopsEn: 'Assigning anywhere inside a function marks that variable local for the entire body—causing `UnboundLocalError` if read beforehand!',
    objUz: ['LEGB (Local -> Enclosing -> Global -> Built-in) qidiruv tartibini bilish', '`UnboundLocalError` sababini va toza yechimini tushunish', '`global` kalit so‘zi nima uchun zararli ekani va `UPPER_CASE` konstantalarni bilish'],
    objEn: ['Trace LEGB scope resolution order', 'Diagnose and fix `UnboundLocalError`', 'Avoid mutating globals (`global`) in favor of explicit parameters/returns'],
    theoryUz: `### 1. LEGB Qidiruv Zanjiri
1. **L (Local)**: hozirgi funksiya ichida yaratilgan nomlar
2. **E (Enclosing)**: tashqi (o‘rab turuvchi) funksiya nomlari
3. **G (Global)**: modul (fayl) darajasidagi nomlar
4. **B (Built-in)**: \`len\`, \`sum\`, \`int\`, \`print\` kabi tayyor nomlar
### 2. Built-in Shadowing Xavfi!
\`list = [1, 2]\` yoki \`sum = 10\` deb yozsangiz, Global \`sum\` Built-in \`sum()\` ni berkitib qo‘yadi (shadowing) — keyin \`sum([1, 2])\` \`TypeError\` beradi!
### 3. \`UnboundLocalError\` Anatomiyasi
Agar funksiya ichida \`total += 1\` yozilsa, Python uni local deb biladi va global \`total\` ni o‘qishga ruxsat bermaydi.
### 4. Nima Uchun \`global\` Yomon Amaliyot?
\`global\` funksiyalarni bir-biriga yashirincha bog‘lab qo‘yadi (hidden state) va testlashni buzadi. Buning o‘rniga qiymatni parametr qilib oling va \`return\` qiling!
### 5. Konstantalar
Global darajada faqat o‘zgarmas sozlamalar (\`TAX_RATE = 0.12\`, \`MAX_RETRIES = 3\`) saqlanadi.`,
    theoryEn: `### 1. LEGB Resolution Order
Local -> Enclosing -> Global -> Built-in.
### 2. Avoid Shadowing Built-ins
Never name variables \`list\`, \`dict\`, \`sum\`, or \`str\`.
### 3. Why \`UnboundLocalError\` Happens
Any assignment binds the name locally across the whole function scope.
### 4. Why Avoid \`global\` Mutation
Hidden global mutations create spaghetti dependencies; pass arguments and return results.
### 5. Read-Only Global Constants
Uppercase constants (\`TAX_RATE = 0.12\`) are clean and safe to read.`,
    examples: [
      ex('Misol 1: LEGB ko‘rinish doirasi', 'Example 1: LEGB Resolution', `RATE = 0.1  # Global\n\ndef outer():\n    bonus = 5  # Enclosing\n    def inner(x):\n        return x * RATE + bonus  # Local x + G + E\n    return inner(100)\n\nprint(outer())`, `15.0`, '`inner` ichida `x` Local, `bonus` Enclosing, `RATE` Global dan topildi.', 'Resolved Local `x`, Enclosing `bonus`, and Global `RATE`.'),
      ex('Misol 2: `global` siz toza holat yangilash', 'Example 2: Pure Return Instead of global', `def increment(count, step=1):\n    return count + step\n\nscore = 10\nscore = increment(score, 5)\nprint(score)`, `15`, '`global` ishlatmasdan sof argument/return bilan yangilandi.', 'Updated state explicitly via parameter and return.'),
      ex('Misol 3: Local va Global bir xil nomda (Shadowing)', 'Example 3: Local Shadowing', `name = "Global"\n\ndef test():\n    name = "Local"\n    return name\n\nprint(test(), "| Outside:", name)`, `Local | Outside: Global`, 'Ichki `name` tashqaridagi `name` ni o‘zgartirmadi.', 'Local rebinding leaves global `name` intact.'),
    ],
    traceTitleUz: 'LEGB va `UnboundLocalError` izi',
    traceTitleEn: 'Tracing Local Shadowing',
    traceCode: `x = 10\ndef f():\n    x = 20\n    return x\nprint(f(), x)`,
    traceSteps: [
      traceStep(1, 'x = 10', 'G: x=10', 'Global x yaratildi', 'Bound global x'),
      traceStep(2, 'f() -> x = 20', 'L: x=20', 'Yangi local x yaratildi', 'Bound local x inside frame'),
      traceStep(3, 'print(f(), x)', '20 10', 'Local 20, Global 10 chiqdi', 'Local and global stay separate', '20 10'),
    ],
    commonMistakes: [
      mistake('Funksiya ichida global o‘zgaruvchini o‘zgartiraman deb `UnboundLocalError` olish', 'UnboundLocalError on Global Increment', `cnt = 0\ndef bump():\n    cnt += 1\nbump()`, "UnboundLocalError: cannot access local variable 'cnt'", `def bump(cnt):\n    return cnt + 1\ncnt = 0\ncnt = bump(cnt)\nprint(cnt)`, '`cnt += 1` `cnt` ni local deb belgilaydi.', 'Assignment forces `cnt` to be local.', '`global` o‘rniga parametr va `return` ishlating.', 'Pass `cnt` in and return the updated value.'),
      mistake('Built-in nomlarni (`list`, `sum`, `str`) o‘zgaruvchi qilish', 'Shadowing Python Built-ins', `list = [1, 2, 3]\nprint(list("abc"))`, "TypeError: 'list' object is not callable", `items = [1, 2, 3]\nprint(list("abc"))`, 'Global `list` built-in `list()` funksiyasini yopib qo‘ydi.', 'Variable `list` shadowed built-in `list()`.', 'Doim `items`, `total`, `text` kabi nomlar bering.', 'Use descriptive names like `items` or `total`.'),
    ],
    compareTitleUz: '`global x` vs Parametr + `return`',
    compareTitleEn: '`global x` vs Explicit Parameter + `return`',
    compareUz: ['`global x`: yashirin bog‘liqlik yaratadi, parallel kod va testlarni buzadi.', 'Parametr + `return`: kirish va chiqish aniq, 100% testlanadigan kod.'],
    compareEn: ['`global x`: hidden side effects, fragile tests.', 'Explicit args + `return`: transparent and pure.'],
    compareSummaryUz: 'Hech qachon `global` bilan o‘zgaruvchi o‘zgartirmang — doim parametr va `return` ishlating.',
    compareSummaryEn: 'Avoid `global` mutations; thread state explicitly through parameters and return values.',
    practiceTasks: [
      pt('p0508_1', '1-mashq: Global o‘qish', 'Task 1: Read Constant', '`TAX = 2` global konstantani funksiyada o‘qib `f(10)` -> `12` chiqaring.', 'Read global constant inside function.', `TAX = 2\ndef f(x):\n    return x + TAX\nprint(f(10))`, '12', 'Reading global needs no keyword.', 'Add TAX.'),
      pt('p0508_2', '2-mashq: Shadowing', 'Task 2: Local Shadow', '`x = 5` global; `def g(): x = 99; return x` -> `g(), x` chiqaring.', 'Verify local x leaves global x intact.', `x = 5\ndef g():\n    x = 99\n    return x\nprint(g(), x)`, '99 5', 'Local does not overwrite global.', 'Print g(), x.'),
      pt('p0508_3', '3-mashq: `UnboundLocalError` tuzatish', 'Task 3: Fix Counter', '`bump(n)` yozib `c = 0; c = bump(c)` bilan `1` chiqaring.', 'Fix counter via parameter.', `def bump(n):\n    return n + 1\nc = 0\nc = bump(c)\nprint(c)`, '1', 'Avoid global; pass n and return n+1.', 'Print c.'),
      pt('p0508_4', '4-mashq: Built-in dan foydalanish', 'Task 4: Safe Naming', '`total = sum([3, 4, 5])` (built-in ni berkitmay) chiqaring.', 'Compute sum safely.', `nums = [3, 4, 5]\ntotal = sum(nums)\nprint(total)`, '12', 'Do not name variable sum.', 'Use total.'),
      pt('p0508_5', '5-mashq: LEGB ustunligi', 'Task 5: L Beats G', '`v = "G"`; `def test(): v = "L"; return v` -> `test()` ni chiqaring.', 'Local overrides global.', `v = "G"\ndef test():\n    v = "L"\n    return v\nprint(test())`, 'L', 'L comes before G in LEGB.', 'Print test().'),
    ],
    quiz: [
      q('q0508_1', 'LEGB dagi harflar nimani anglatadi?', 'What does LEGB stand for?', ['List, Enum, Global, Bool', 'Local, Enclosing, Global, Built-in', 'Loop, Exit, Get, Break', 'Load, Exec, Go, Build'], ['List, Enum, Global, Bool', 'Local, Enclosing, Global, Built-in', 'Loop, Exit, Get, Break', 'Load, Exec, Go, Build'], 1, 'Local -> Enclosing -> Global -> Built-in.', 'Local, Enclosing, Global, Built-in.'),
      q('q0508_2', 'Funksiya ichida tashqi global o‘zgaruvchini o‘zgartirmoqchi bo‘lsak qaysi xato chiqadi (`global` siz)?', 'Reading then assigning a global inside a function without `global` raises?', ['NameError', 'UnboundLocalError', 'KeyError', 'SyntaxError'], ['NameError', 'UnboundLocalError', 'KeyError', 'SyntaxError'], 1, '`UnboundLocalError`.', '`UnboundLocalError`.'),
      q('q0508_3', '`list = [1, 2]` deb nomlash qanday muammo keltiradi?', 'Why avoid naming a variable `list`?', ['SyntaxError beradi', 'Built-in list() funksiyasini yopib qo‘yadi', 'Xotira oshadi', 'Tuple ga aylanadi'], ['SyntaxError', 'Shadows built-in list()', 'Memory leak', 'Becomes tuple'], 1, 'Built-in `list()` ni yopib qo‘yadi (shadowing).', 'Shadows built-in `list()`.'),
      q('q0508_4', 'Global o‘zgaruvchini faqat O‘QISH uchun `global` kalit so‘zi shartmi?', 'Is `global` needed just to READ a global variable?', ['Ha', 'Yo‘q', 'Faqat int da', 'Faqat list da'], ['Yes', 'No', 'Ints only', 'Lists only'], 1, 'Yo‘q, LEGB G bosqichidan o‘zi topadi.', 'No, reads follow LEGB automatically.'),
      q('q0508_5', '`global` o‘rniga qaysi usul afzal?', 'Better alternative to mutating `global`?', ['Parametr orqali olib return qaytarish', 'eval() ishlatish', 'nonlocal ishlatish', 'Faylga yozish'], ['Pass parameters and return values', 'Use eval()', 'Use nonlocal', 'Write files'], 0, 'Parametr va `return`.', 'Parameters and return values.'),
    ],
    homework: hw('Sof Holatli O‘yin Ballari Hisoblagichi', 'Pure-State Score Tracker', '`global` ishlatmasdan `add_points(state, pts)` va `reset_streak(state)` funksiyalarini yozib o‘yinchi holatini boshqaring.', 'Manage game score/streak dict purely via parameters and returns without `global`.', ['Hech qanday global kalit so‘zi yo‘q', 'Kamida 3 ta ketma-ket holat o‘zgarishi'], ['Zero global statements', 'Chain at least 3 updates'], 'return {**state, "score": state["score"] + pts}', 'Return updated dict.', 'Eng yuqori rekord (`best`) ni ham saqlab boring.', 'Track high score too.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-05-09',
    courseId: 'functions',
    moduleId: 'c05_m3',
    order: 9,
    titleUz: 'Nested Functions — ichki funksiyalar, Closure va `nonlocal`',
    titleEn: 'Nested Functions, Enclosing Scope & `nonlocal`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-05-08'],
    conceptId: 'nested_functions',
    whyUz: "Funksiya ichida funksiya yaratish — bu dekoratorlar (Course 10) va factory funksiyalarning poydevori! Ichki funksiya tashqarisining o‘zgaruvchilarini eslab qolishi (Closure) Python'ning eng kuchli imkoniyatidir.",
    whyEn: 'Nested functions and closures remember enclosing variables after the outer function finishes—forming the foundation for Python decorators and factories.',
    analogyUz: "Closure — bu tashqi zavod (`make_multiplier(3)`) yasab bergan maxsus kalkulyator: zavod yopilib ketsa ham, u chiqargan kalkulyator ichidagi `3` raqamini umrbod eslab yuradi!",
    analogyEn: 'A closure is a custom tool built by an outer factory: even after the factory closes, the tool remembers the factory setting baked inside it.',
    stopsUz: "Ichki funksiya tashqi funksiyadagi (`Enclosing`) o‘zgaruvchini o‘qiy oladi, lekin unga `count += 1` deb yangi qiymat bermoqchi bo‘lsa **`nonlocal count`** yozmasa `UnboundLocalError` beradi!",
    stopsEn: 'Rebinding an enclosing variable inside a nested function requires `nonlocal varname`; otherwise Python treats it as local.',
    objUz: ['Funksiya ichida yordamchi funksiya (`helper`) yozish', 'Funksiya qaytaruvchi **Factory / Closure** yaratish', 'Enclosing o‘zgaruvchini o‘zgartirish uchun `nonlocal` kalit so‘zini to‘g‘ri qo‘llash'],
    objEn: ['Define private helper functions inside outer functions', 'Build factory closures that return customized functions', 'Update enclosing variables cleanly using `nonlocal`'],
    theoryUz: `### 1. Ichki (Nested) Funksiya Nima Uchun Kerak?
Faqat bitta katta funksiya ichida ishlatiladigan yordamchi \`helper\` funksiyani tashqi namespace ga chiqarmay, ichkarida yashirish (encapsulation).
### 2. Funksiya — Birinchi Darajali Obyekt (First-Class Object)
Python da funksiyani o‘zgaruvchiga tayinlash, ro‘yxatga solish va boshqa funksiyadan \`return inner\` qilib qaytarish mumkin!
### 3. Closure Mexanizmi
\`\`\`python
def make_multiplier(k):
    def multiply(x):
        return x * k  # Enclosing 'k' ni eslab qoladi!
    return multiply
\`\`\`
### 4. \`nonlocal\` Kalit So‘zi
Tashqi funksiya o‘zgaruvchisini o‘zgartirish kerak bo‘lganda \`nonlocal count\` yoziladi (\`global\` dan farqli o‘laroq faqat 1-tashqi funksiyagacha qaraydi).
### 5. Keng tarqalgan xato
\`return inner()\` (chaqirib natijasini qaytarish) o‘rniga \`return inner\` (funksiyaning o‘zini qaytarish) ni adashtirish.`,
    theoryEn: `### 1. Private Inner Helpers
Keep single-use helper logic scoped strictly inside the parent function.
### 2. Functions as First-Class Objects
Assign, pass, and return functions just like integers or strings.
### 3. Closures
An inner function captures and retains access to enclosing scope bindings even after the outer call returns.
### 4. \`nonlocal\` Rebinding
Declare \`nonlocal x\` inside the nested function to rebind an enclosing variable.
### 5. Returning \`fn\` vs \`fn()\`
Factories return the inner function object (\`return inner\`), not the result of calling it (\`return inner()\`).`,
    examples: [
      ex('Misol 1: Factory Closure (`make_multiplier`)', 'Example 1: Closure Factory', `def make_multiplier(factor):\n    def multiply(val):\n        return val * factor\n    return multiply\n\ntriple = make_multiplier(3)\ntimes10 = make_multiplier(10)\nprint(triple(7), times10(7))`, `21 70`, '`triple` va `times10` har biri o‘zining `factor` qiymatini eslab qoldi.', 'Each returned closure retained its own `factor` binding.'),
      ex('Misol 2: `nonlocal` bilan hisoblagich', 'Example 2: Stateful Counter with nonlocal', `def make_counter(start=0):\n    count = start\n    def step():\n        nonlocal count\n        count += 1\n        return count\n    return step\n\nc = make_counter(10)\nprint(c(), c(), c())`, `11 12 13`, '`nonlocal count` tashqi `count` o‘zgaruvchisini xavfsiz yangiladi.', '`nonlocal` allowed `step` to increment the enclosing `count`.'),
      ex('Misol 3: Tashqi funksiyani himoyalovchi ichki validator', 'Example 3: Encapsulated Helper', `def format_users(names):\n    def clean(s):\n        return s.strip().title()\n    return [clean(n) for n in names if n.strip()]\n\nprint(format_users(["  ali ", "  ", "zarina"]))`, `['Ali', 'Zarina']`, '`clean` faqat `format_users` ichida ko‘rinadi.', 'Private helper stays encapsulated inside `format_users`.'),
    ],
    traceTitleUz: 'Closure xotira izi',
    traceTitleEn: 'Tracing Closure Capture',
    traceCode: `def adder(k):\n    def add(x):\n        return x + k\n    return add\n\nf = adder(5)\nprint(f(12))`,
    traceSteps: [
      traceStep(1, 'adder(5)', 'E: k=5', 'Tashqi ramkada k=5 yaratildi', 'Outer frame binds k=5'),
      traceStep(2, 'return add', 'f=add (with k=5)', 'Closure k=5 ni o‘zi bilan olib qaytdi', 'Returned closure capturing k=5'),
      traceStep(3, 'f(12)', '12 + 5 = 17', 'Tashqi funksiya tugagan bo‘lsa ham k=5 ishladi', 'Evaluated 12 + 5', '17'),
    ],
    commonMistakes: [
      mistake('`nonlocal` siz enclosing o‘zgaruvchiga `+=` yozish', 'UnboundLocalError on Enclosing Variable', `def outer():\n    x = 0\n    def inc():\n        x += 1\n        return x\n    return inc\nouter()()`, "UnboundLocalError: cannot access local variable 'x'", `def outer():\n    x = 0\n    def inc():\n        nonlocal x\n        x += 1\n        return x\n    return inc\nprint(outer()())`, 'Yangi qiymat berishdan oldin `nonlocal x` eʼlon qilinishi shart.', 'Rebinding enclosing state requires `nonlocal`.', '`nonlocal x` qatorini qo‘shing.', 'Add `nonlocal x`.'),
      mistake('Factory ichida `return inner()` qilib yuborish', 'Calling Inner Instead of Returning It', `def make_greeter(prefix):\n    def greet(name):\n        return f"{prefix} {name}"\n    return greet()`, "TypeError: greet() missing 1 required positional argument: 'name'", `def make_greeter(prefix):\n    def greet(name):\n        return f"{prefix} {name}"\n    return greet\nhi = make_greeter("Salom")\nprint(hi("Ali"))`, 'Factory funksiyaning o‘zini (`greet`) qaytarishi kerak, `greet()` ni emas.', 'Return the function object without calling it.', 'Qavslarsiz `return greet` yozing.', 'Omit `()` on return.'),
    ],
    compareTitleUz: '`global` vs `nonlocal`',
    compareTitleEn: '`global` vs `nonlocal`',
    compareUz: ['`global`: modul (butun fayl) darajasiga chiqadi — xavfli.', '`nonlocal`: faqat o‘rab turuvchi funksiya doirasida qoladi — kapsulalangan.'],
    compareEn: ['`global`: reaches module namespace.', '`nonlocal`: stays encapsulated within an enclosing function.'],
    compareSummaryUz: 'Kichik stateful closure lar uchun `nonlocal`, kattaroq obyektlar uchun esa `class` (OOP) ishlating.',
    compareSummaryEn: 'Use `nonlocal` for tiny stateful closures; upgrade to a `class` when state grows.',
    practiceTasks: [
      pt('p0509_1', '1-mashq: Daraja factory', 'Task 1: Power Factory', '`make_pow(exp)` funksiyasi `base ** exp` hisoblovchi funksiya qaytarsin.', 'Return closure computing base ** exp.', `def make_pow(exp):\n    def fn(base):\n        return base ** exp\n    return fn\nsq = make_pow(2)\nprint(sq(9))`, '81', 'return fn without ()', 'Test sq(9).'),
      pt('p0509_2', '2-mashq: `nonlocal` yig‘uvchi', 'Task 2: Accumulator', '`make_acc()` har chaqirilganda berilgan sonni qo‘shib jami summani qaytarsin.', 'Running total closure using nonlocal.', `def make_acc():\n    total = 0\n    def add(v):\n        nonlocal total\n        total += v\n        return total\n    return add\na = make_acc()\nprint(a(5), a(10))`, '5 15', 'nonlocal total', 'Call a(5) and a(10).'),
      pt('p0509_3', '3-mashq: Ichki helper', 'Task 3: Inner Helper', '`calc_pair(x)` ichida `dbl(n)` yozib `dbl(x) + 1` ni qaytaring.', 'Nest helper dbl inside calc_pair.', `def calc_pair(x):\n    def dbl(n):\n        return n * 2\n    return dbl(x) + 1\nprint(calc_pair(4))`, '9', 'Define dbl inside calc_pair.', 'Call calc_pair(4).'),
      pt('p0509_4', '4-mashq: Prefix closure', 'Task 4: Prefix Closure', '`make_tag(p)` `"[" + p + "] " + msg` qaytarsin.', 'Tag formatter closure.', `def make_tag(p):\n    def fmt(msg):\n        return f"[{p}] {msg}"\n    return fmt\nwarn = make_tag("WARN")\nprint(warn("Low disk"))`, '[WARN] Low disk', 'Capture p in closure.', 'Print warn("Low disk").'),
      pt('p0509_5', '5-mashq: Birinchi darajali funksiya', 'Task 5: Function in Variable', '`def hi(): return "OK"`; `fn = hi`; `print(fn())` chiqaring.', 'Assign function to alias variable.', `def hi():\n    return "OK"\nfn = hi\nprint(fn())`, 'OK', 'fn = hi', 'Call fn().'),
    ],
    quiz: [
      q('q0509_1', 'Closure nima?', 'What is a closure?', ['Yopilgan fayl', 'Tashqi funksiya o‘zgaruvchisini eslab qoluvchi ichki funksiya', 'SyntaxError', 'While sikli'], ['Closed file', 'Inner function remembering enclosing variables', 'SyntaxError', 'While loop'], 1, 'Tashqi scope qiymatlarini eslab qoluvchi ichki funksiya.', 'Inner function retaining enclosing bindings.'),
      q('q0509_2', 'Enclosing o‘zgaruvchini ichki funksiyada o‘zgartirish kalit so‘zi?', 'Keyword to rebind enclosing variable?', ['global', 'outer', 'nonlocal', 'enclosing'], ['global', 'outer', 'nonlocal', 'enclosing'], 2, '`nonlocal`.', '`nonlocal`.'),
      q('q0509_3', 'Factory funksiya oxirida nimani qaytarishi kerak?', 'What should a closure factory return?', ['inner()', 'inner', 'None', 'nonlocal'], ['inner()', 'inner', 'None', 'nonlocal'], 1, 'Funksiyaning o‘zini (`inner`).', 'The function object (`inner`).'),
      q('q0509_4', '`nonlocal` qaysi scope ga taʼsir qiladi?', 'Which scope does `nonlocal` target?', ['Global', 'Enclosing (o‘rab turuvchi)', 'Built-in', 'Hamma fayllarga'], ['Global', 'Enclosing function scope', 'Built-in', 'All modules'], 1, 'Enclosing funksiya doirasiga.', 'Enclosing function scope.'),
      q('q0509_5', 'Nima uchun Python da funksiyalar "first-class" deyiladi?', 'Why are Python functions called first-class?', ['Tezligi uchun', 'Obyekt sifatida uzatish va qaytarish mumkinligi uchun', 'Faqat 1-qatorda yozilgani uchun', 'C da yozilgani uchun'], ['Speed', 'Can be stored, passed, and returned like values', 'Line 1 rule', 'Written in C'], 1, 'Ularni o‘zgaruvchi, argument va natija sifatida ishlatish mumkin.', 'Handled like any other value.'),
    ],
    homework: hw('Chegirma Generator Fabrikasi', 'Discount Closure Factory', '`make_discount(pct)` funksiyasini yozing — u berilgan narxdan `pct` foiz chegirib qaytaruvchi maxsus funksiya yaratsin (`vip_off = make_discount(20)`).', 'Implement `make_discount(pct)` returning a specialized discount pricing function.', ['Closure bilan pct ni eslab qolish', 'Kamida 2 ta turli chegirma funksiyasi yaratish'], ['Capture pct cleanly', 'Create 2 discount tiers'], 'def apply(price): return round(price * (1 - pct / 100), 2)', 'Return apply without ().', 'Har bir chaqiruv sonini sanovchi `nonlocal calls` qo‘shing.', 'Track invocation count with `nonlocal`.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-05-10',
    courseId: 'functions',
    moduleId: 'c05_m3',
    order: 10,
    titleUz: 'Lambda Functions — bir qatorli anonim funksiyalar',
    titleEn: 'Lambda Functions: Single-Expression Anonymous Functions',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-05-09'],
    conceptId: 'lambda_functions',
    whyUz: "`sorted(users, key=...)`, `max(items, key=...)`, `map()`, `filter()` kabi joylarda bir martalik 1 qatorli funksiya uchun alohida `def get_price(item):` yozish o‘rniga ixcham `lambda item: item['price']` ishlatiladi.",
    whyEn: 'Lambdas provide concise inline expressions for `sorted(..., key=)`, `min/max(..., key=)`, and functional pipelines without cluttering namespaces.',
    analogyUz: "`def` — bu rasmiy xizmat pasportli doimiy xodim. `lambda` — esa bir marta yuk tashib berib ketadigan tezkor kuryer: nomi ham yo‘q, bir qatorda ishini bitiradi.",
    analogyEn: '`def` hires a named permanent staffer; `lambda` dispatches an unnamed single-task courier right where needed.',
    stopsUz: "PEP 8 qatʼiy ogohlantiradi: `f = lambda x: x * 2` deb o‘zgaruvchiga nom berib saqlash **anti-pattern**! Agar funksiyaga nom kerak bo‘lsa, har doim `def f(x):` yozing.",
    stopsEn: 'PEP 8 forbids assigning lambdas to names (`f = lambda x: ...`)—use `def` whenever a function deserves a name.',
    objUz: ['`lambda args: expression` sintaksisini yozish', '`sorted`, `min`, `max`, `map`, `filter` ichida `lambda` qo‘llash', '`lambda` cheklovlarini (faqat bitta ifoda, statement yo‘q) va PEP 8 qoidasini bilish'],
    objEn: ['Write valid single-expression lambdas', 'Use lambdas effectively as `key=` callbacks', 'Follow PEP 8: never bind lambdas to variables when `def` belongs'],
    theoryUz: `### 1. Lambda Sintaksisi
\`lambda param1, param2: expression\`. \`return\` yozilmaydi — ifodaning qiymati avtomatik qaytariladi!
### 2. Eng Yaxshi Qo‘llanish Joylari
\`sorted(products, key=lambda p: p["price"])\`, \`max(teams, key=lambda t: t["points"])\`.
### 3. \`lambda\` Ichida Ternary Shart
\`lambda x: "even" if x % 2 == 0 else "odd"\` — ifoda bo‘lgani uchun ishlaydi, lekin \`for\`, \`while\`, \`=\` (assignment) yozish **mumkin emas**!
### 4. PEP 8 Anti-Pattern
Yomon: \`double = lambda x: x * 2\` (stack trace da \`<lambda>\` chiqadi, debug qiyin).
Yaxshi: \`def double(x): return x * 2\`.
### 5. Keng tarqalgan xato
\`lambda x: return x + 1\` -> \`SyntaxError\` (\`return\` yozilmaydi!).`,
    theoryEn: `### 1. Lambda Syntax
\`lambda params: single_expression\` (implicitly returns the expression value).
### 2. Ideal Use Case: Inline Callbacks
\`sorted(items, key=lambda x: x[1])\`, \`min/max(key=...)\`.
### 3. Conditional Expression in Lambda
\`lambda n: "pos" if n > 0 else "non-pos"\` is valid; statements (\`=\`, \`for\`, \`return\`) are illegal.
### 4. PEP 8 Rule
Never bind \`fn = lambda ...\`; use \`def\` so tracebacks carry real names.
### 5. Common Mistake
Writing \`return\` inside a lambda body causes \`SyntaxError\`.`,
    examples: [
      ex('Misol 1: `sorted()` va `max()` da inline lambda', 'Example 1: Inline Sorting & Max Key', `tasks = [("Deploy", 3), ("Auth", 1), ("Tests", 2)]\nordered = sorted(tasks, key=lambda t: t[1])\ntop_prio = min(tasks, key=lambda t: t[1])\nprint("Ordered:", ordered)\nprint("First:", top_prio[0])`, `Ordered: [('Auth', 1), ('Tests', 2), ('Deploy', 3)]\nFirst: Auth`, 'Bir martalik `key` funksiyasi sifatida `lambda` juda qulay.', 'Clean one-off key selection without extra `def` clutter.'),
      ex('Misol 2: `map()` va `filter()` bilan lambda', 'Example 2: map() & filter()', `nums = [1, 2, 3, 4, 5]\nsquared = list(map(lambda x: x * x, nums))\nevens = list(filter(lambda x: x % 2 == 0, nums))\nprint(squared, evens)`, `[1, 4, 9, 16, 25] [2, 4]`, '`map` transformatsiya qildi, `filter` saraladi.', 'Transformed and filtered streams using inline lambdas.'),
      ex('Misol 3: Conditional ternary bilan lambda', 'Example 3: Ternary Expression in Lambda', `scores = [("Ali", 88), ("Bek", 54)]\nlabeled = [(n, (lambda s: "Pass" if s >= 60 else "Fail")(s)) for n, s in scores]\nprint(labeled)`, `[('Ali', 'Pass'), ('Bek', 'Fail')]`, 'Ternary ifoda `lambda` ichida ruxsat etilgan.', 'Single ternary expression evaluates cleanly inside lambda.'),
    ],
    traceTitleUz: 'Lambda key bajarilish izi',
    traceTitleEn: 'Tracing Lambda Key Callback',
    traceCode: `words = ["pear", "kiwi", "fig"]\nprint(min(words, key=lambda w: len(w)))`,
    traceSteps: [
      traceStep(1, 'w="pear"', 'len=4', 'Kalit 4', 'Key 4'),
      traceStep(2, 'w="kiwi"', 'len=4', 'Kalit 4', 'Key 4'),
      traceStep(3, 'w="fig"', 'len=3', 'Eng kichik kalit 3', 'Minimum key 3', 'fig'),
    ],
    commonMistakes: [
      mistake('Lambda ichida `return` yozish', 'Using return Inside Lambda', `fn = lambda x: return x * 2`, 'SyntaxError: invalid syntax', `def fn(x):\n    return x * 2\nprint(fn(5))`, '`lambda` da `return` yozilmaydi, ifoda natijasi o‘zi qaytadi.', 'Lambdas return their single expression automatically.', 'Nom berish kerak bo‘lsa `def` ishlating.', 'Use `def` for named functions.'),
      mistake('Nomli funksiya o‘rniga `f = lambda ...` yozish', 'PEP 8 Violation: Naming a Lambda', `calc = lambda a, b: a + b\nprint(calc.__name__)`, 'Prints <lambda> in tracebacks', `def calc(a, b):\n    return a + b\nprint(calc.__name__)`, 'Stack trace da `<lambda>` ko‘rinishi debugging ni qiyinlashtiradi.', 'Named lambdas lose meaningful function names in tracebacks.', 'Doim `def calc(a, b):` yozing.', 'Always use `def` when assigning a name.'),
    ],
    compareTitleUz: '`def` vs `lambda`',
    compareTitleEn: '`def` vs `lambda`',
    compareUz: ['`def`: nomli, ko‘p qatorli, docstring va type hints qo‘shiladigan asosiy funksiyalar.', '`lambda`: faqat `sorted/min/max/map` ga bir martalik qisqa callback berish uchun.'],
    compareEn: ['`def`: named, documented, typed, multi-statement functions.', '`lambda`: brief anonymous expressions passed straight as callbacks.'],
    compareSummaryUz: 'Nom berish kerak bo‘lsa `def`, bir martalik `key=` callback bo‘lsa `lambda` tanlang.',
    compareSummaryEn: 'Use `def` whenever naming a function; use `lambda` strictly for short inline callbacks.',
    practiceTasks: [
      pt('p0510_1', '1-mashq: Oxirgi harf bo‘yicha sort', 'Task 1: Sort by Last Char', '`["ab", "ba", "cc"]` ni oxirgi harfi bo‘yicha `sorted(..., key=lambda ...)` bilan chiqaring.', 'Sort by last letter.', `print(sorted(["ab", "cc", "ba"], key=lambda s: s[-1]))`, "['ba', 'ab', 'cc']", 'key=lambda s: s[-1]', 'Use s[-1].'),
      pt('p0510_2', '2-mashq: Tuple 2-element bo‘yicha max', 'Task 2: Max Pair', '`[("A", 10), ("B", 25), ("C", 18)]` dan max qiymatni chiqaring.', 'Find tuple with highest number.', `pairs = [("A", 10), ("B", 25), ("C", 18)]\nprint(max(pairs, key=lambda p: p[1])[0])`, 'B', 'key=lambda p: p[1]', 'Print first element.'),
      pt('p0510_3', '3-mashq: `filter` + lambda', 'Task 3: Filter Positives', '`[-3, 0, 4, 7]` dan musbatlarini `filter` bilan chiqaring.', 'Filter > 0 using lambda.', `print(list(filter(lambda x: x > 0, [-3, 0, 4, 7])))`, '[4, 7]', 'list(filter(...))', 'Use x > 0.'),
      pt('p0510_4', '4-mashq: `map` + lambda', 'Task 4: Map +10', '`[1, 2, 3]` ga `map` bilan `10` qo‘shing.', 'Add 10 via map.', `print(list(map(lambda x: x + 10, [1, 2, 3])))`, '[11, 12, 13]', 'list(map(...))', 'Use x + 10.'),
      pt('p0510_5', '5-mashq: Dict qiymati bo‘yicha sort', 'Task 5: Sort Dict Items', '`{"c": 3, "a": 1, "b": 2}` ni qiymati bo‘yicha saralang.', 'Sort dict items by value.', `d = {"c": 3, "a": 1, "b": 2}\nprint(sorted(d.items(), key=lambda kv: kv[1]))`, "[('a', 1), ('b', 2), ('c', 3)]", 'kv[1]', 'Sort d.items().'),
    ],
    quiz: [
      q('q0510_1', 'Lambda tanasida nechta statement bo‘lishi mumkin?', 'How many statements fit in a lambda?', ['Cheksiz', 'Faqat 1 ta expression (ifoda)', '2 ta', '3 ta'], ['Unlimited', 'Strictly 1 expression', '2', '3'], 1, 'Faqat 1 ta expression.', 'Strictly one expression.'),
      q('q0510_2', 'Lambda ichida `return` yozish mumkinmi?', 'Can a lambda contain `return`?', ['Ha', 'Yo‘q, SyntaxError beradi', 'Faqat True qaytarishda', 'Faqat Python 3.12 da'], ['Yes', 'No, SyntaxError', 'Only True', '3.12 only'], 1, 'Yo‘q, `SyntaxError`.', 'No, raises `SyntaxError`.'),
      q('q0510_3', 'PEP 8 `f = lambda x: x + 1` haqida nima deydi?', 'What does PEP 8 say about `f = lambda x: x + 1`?', ['Tavsiya etadi', 'Taqiqlaydi — def f(x) yozish kerak', 'Faqat class da', 'Majburiy'], ['Recommends it', 'Discourages it — use def instead', 'Classes only', 'Required'], 1, 'Nom berishda har doim `def` ishlatilishi kerak.', 'Use `def` whenever binding a name.'),
      q('q0510_4', '`(lambda x, y: x * y)(3, 4)` natijasi?', 'Output of `(lambda x, y: x * y)(3, 4)`?', ['7', '12', 'Error', 'None'], ['7', '12', 'Error', 'None'], 1, 'Darhol chaqirilib `12` qaytaradi.', 'Evaluates to `12`.'),
      q('q0510_5', 'Qaysi vazifa uchun lambda eng mos?', 'Best use case for lambda?', ['100 qatorli API handler', 'sorted(..., key=lambda u: u["age"])', 'Global o‘zgaruvchi yaratish', 'While sikl yozish'], ['100-line handler', 'sorted(..., key=lambda u: u["age"])', 'Globals', 'While loops'], 1, '`sorted/min/max` `key=` callback sifatida.', 'Short inline `key=` callbacks.'),
    ],
    homework: hw('Lambda Bilan Katalog Reytingi', 'Lambda Catalog Ranker', '5 ta kitob lug‘atidan (`title`, `pages`, `rating`) iborat ro‘yxatni `lambda` yordamida avval `rating` kamayishida saralang va `filter` bilan 300+ sahifali kitoblarni ajrating.', 'Rank 5 book dicts by descending rating and filter 300+ page books using lambdas.', ['sorted(..., key=lambda ...)', 'filter(lambda ..., ...)'], ['Use sorted key lambda', 'Use filter lambda'], 'sorted(books, key=lambda b: b["rating"], reverse=True)', 'Sort descending.', 'Keyin xuddi shu filtrni list comprehension ga o‘girib solishtiring.', 'Compare readability with comprehension.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-05-11',
    courseId: 'functions',
    moduleId: 'c05_m4',
    order: 11,
    titleUz: 'Recursion — o‘zini-o‘zi chaqiruvchi funksiyalar va Review #11',
    titleEn: 'Recursion: Base Case, Call Stack & Review #11',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-05-10'],
    conceptId: 'recursion_basics',
    whyUz: "Papkalar daraxti (folders inside folders), JSON daraxtlari, menyular va Merge/Quick Sort algoritmlari tabiiy ravishda **rekursiv** tuzilgan — ularni rekursiyasiz yozish juda qiyin!",
    whyEn: 'Trees, nested JSON folders, parsers, and divide-and-conquer algorithms are naturally recursive—calling themselves on smaller subproblems.',
    analogyUz: "Rekursiya — bu matryoshka qo‘g‘irchoqlari: eng kichik qo‘g‘irchoqqa (**Base Case**) yetmaguningizcha har birini ochib ichidan kichikrog‘ini olasiz, keyin esa hammasini tartib bilan yopib qaytasiz.",
    analogyEn: 'Recursion opens Russian nesting dolls until reaching the tiny solid core (**Base Case**), then stacks answers back up.',
    stopsUz: "**Base Case** (to‘xtash sharti) bo‘lmasa yoki muammo kichraymasa funksiya cheksiz chaqirilib **`RecursionError: maximum recursion depth exceeded`** (Python da odatda ~1000 qavat) bilan qulaydi!",
    stopsEn: 'Missing or unreachable base cases exhaust Python’s call stack (~1000 frames) and crash with `RecursionError`.',
    objUz: ['Har bir rekursiyada 2 shartni — **Base Case** va **Recursive Step** ni ajratish', 'Call stack (chaqiruvlar steki) qanday o‘sib-kamayishini chizish', 'Qachon oddiy `for/while` sikli rekursiyadan tezroq va xavfsizroq ekanini bilish'],
    objEn: ['Identify Base Case and shrinking Recursive Step in every recursion', 'Trace call stack frames pushing and unwinding', 'Compare recursion vs iteration for linear sequences vs tree structures'],
    theoryUz: `### 1. Rekursiyaning 2 Oltin Qoidasi
1. **Base Case**: rekursiyani to‘xtatadigan eng sodda holat (\`if n <= 1: return 1\`).
2. **Recursive Step**: muammoni Base Case ga yaqinlashtiruvchi kichikroq chaqiruv (\`return n * fact(n - 1)\`).
### 2. Call Stack Qanday Ishlaydi?
Har bir \`fact(3) -> fact(2) -> fact(1)\` chaqiruvi xotirada alohida **stack frame** ochadi; \`fact(1)\` \`1\` qaytargach orqaga \`2*1=2\`, \`3*2=6\` bo‘lib yig‘iladi.
### 3. Rekursiya vs Sikl (Iteration)
Oddiy sanash yoki faktorial uchun \`for\` sikli xotira O(1) bo‘lgani uchun yaxshiroq; lekin **ichma-ich papkalar / daraxtlar** uchun rekursiya tengsiz!
### 4. Python Cheklovi (~1000 qavat)
\`sys.getrecursionlimit()\` odatda 1000. Juda chuqur chiziqli zanjirlar uchun sikl yozing.
### 5. Keng tarqalgan xato
\`return\` yozmay \`fact(n - 1)\` ni shunchaki chaqirib qo‘yish — natijada \`None * int\` \`TypeError\` beradi!`,
    theoryEn: `### 1. Two Mandatory Parts
Base case (stopping condition) and recursive step (moves strictly toward base case).
### 2. Call Stack Unwinding
Each call allocates a stack frame until the base case returns and results unwind upward.
### 3. Recursion vs Iteration
Use loops for flat sequences (O(1) stack); use recursion for trees, nested dicts, and divide-and-conquer.
### 4. Recursion Limit (~1000 frames)
Deep linear recursion hits \`RecursionError\`.
### 5. Forgetting \`return\` on Recursive Call
Omitting \`return\` passes \`None\` back up the call stack.`,
    examples: [
      ex('Misol 1: Faktorial rekursiyasi', 'Example 1: Factorial', `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))`, `120`, 'Base case `n <= 1` dan keyin stek orqaga `1 -> 2 -> 6 -> 24 -> 120` bo‘lib qaytdi.', 'Unwound call stack cleanly from base case 1 up to 120.'),
      ex('Misol 2: Ichma-ich listlar yig‘indisi (Tree Sum)', 'Example 2: Nested List Tree Sum', `def deep_sum(node):\n    if isinstance(node, int):\n        return node\n    return sum(deep_sum(child) for child in node)\n\ntree = [1, [2, [3, 4]], 5]\nprint("Tree sum:", deep_sum(tree))`, `Tree sum: 15`, 'Nechta qavat ichma-ich bo‘lishidan qatʼiy nazar barcha sonlarni qo‘shdi!', 'Handled arbitrary nesting depth cleanly where loops struggle.'),
      ex('Misol 3: Matnni rekursiv teskari qilish', 'Example 3: Reversing a String', `def rev(s):\n    if len(s) <= 1:\n        return s\n    return rev(s[1:]) + s[0]\n\nprint(rev("python"))`, `nohtyp`, 'Har qadamda matn 1 belgiga qisqarib Base Case ga yetdi.', 'Shrunk string toward length <= 1 base case.'),
    ],
    traceTitleUz: 'Faktorial call stack izi',
    traceTitleEn: 'Tracing factorial(3) Stack',
    traceCode: `def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\nprint(fact(3))`,
    traceSteps: [
      traceStep(1, 'fact(3)', 'waiting 3 * fact(2)', 'Stekka fact(3) qo‘shildi', 'Pushed frame fact(3)'),
      traceStep(2, 'fact(2)', 'waiting 2 * fact(1)', 'Stekka fact(2) qo‘shildi', 'Pushed frame fact(2)'),
      traceStep(3, 'fact(1) -> 1', 'returns 1', 'Base case 1 qaytardi', 'Base case unwinds'),
      traceStep(4, '2*1=2 -> 3*2=6', '6', 'Stek bo‘shab natija chiqdi', 'Unwound final answer 6', '6'),
    ],
    commonMistakes: [
      mistake('Base case siz rekursiya yozish', 'Missing Base Case (RecursionError)', `def countdown(n):\n    print(n)\n    countdown(n - 1)\ncountdown(5)`, 'RecursionError: maximum recursion depth exceeded', `def countdown(n):\n    if n <= 0:\n        return\n    print(n)\n    countdown(n - 1)\ncountdown(3)`, 'To‘xtash sharti bo‘lmagani uchun stek to‘lib ketdi.', 'Infinite self-calls overflow the call stack.', 'Har doim eng boshida `if base_case: return ...` yozing.', 'Always write the base case first.'),
      mistake('Rekursiv chaqiruv oldida `return` unutish', 'Forgetting return Before Recursive Call', `def sum_to(n):\n    if n <= 1:\n        return n\n    n + sum_to(n - 1)\nprint(sum_to(3))`, "TypeError: unsupported operand type(s) for +: 'int' and 'NoneType'", `def sum_to(n):\n    if n <= 1:\n        return n\n    return n + sum_to(n - 1)\nprint(sum_to(3))`, '`sum_to(1)` 1 qaytarsa ham, `sum_to(2)` natijani `return` qilmagani uchun `None` qaytdi.', 'Omitting `return` discards the recursive value and returns `None`.', 'Har doim `return ...` bilan qaytaring.', 'Include `return` on the recursive branch.'),
    ],
    compareTitleUz: 'Rekursiya vs Sikl (`for/while`)',
    compareTitleEn: 'Recursion vs Loops',
    compareUz: ['Sikl: chiziqli vazifalarda (`1..N` yig‘indi) O(1) xotira va tezroq.', 'Rekursiya: daraxtlar, nested JSON, fayl tizimi va bo‘lib-hukmronlik (Merge Sort) uchun eng toza.'],
    compareEn: ['Loops: O(1) stack and faster for flat iteration.', 'Recursion: cleanest expressiveness for nested trees and divide-and-conquer.'],
    compareSummaryUz: 'Daraxt va ichma-ich tuzilmalarda rekursiya, oddiy sanashlarda sikl ishlating.',
    compareSummaryEn: 'Use loops for linear sweeps and recursion for branching/hierarchical data.',
    practiceTasks: [
      pt('p0511_1', '1-mashq: Rekursiv yig‘indi', 'Task 1: Sum 1..N', '`sum_n(n)` `1 + 2 + ... + n` ni rekursiv hisoblasin; `sum_n(5)` -> `15`.', 'Recursive sum 1..n.', `def sum_n(n):\n    if n <= 0:\n        return 0\n    return n + sum_n(n - 1)\nprint(sum_n(5))`, '15', 'Base: n <= 0 -> 0', 'Call sum_n(5).'),
      pt('p0511_2', '2-mashq: Daraja hisoblash', 'Task 2: Recursive Power', '`rec_pow(b, e)` ni rekursiv yozing (`rec_pow(2, 4)` -> `16`).', 'Recursive b ** e.', `def rec_pow(b, e):\n    if e == 0:\n        return 1\n    return b * rec_pow(b, e - 1)\nprint(rec_pow(2, 4))`, '16', 'if e == 0: return 1', 'Test 2^4.'),
      pt('p0511_3', '3-mashq: Ro‘yxat uzunligi', 'Task 3: Recursive Length', '`rec_len(arr)` ni `len()` siz rekursiv yozing (`[4, 5, 6]` -> `3`).', 'Compute length recursively.', `def rec_len(arr):\n    if not arr:\n        return 0\n    return 1 + rec_len(arr[1:])\nprint(rec_len([4, 5, 6]))`, '3', '1 + rec_len(arr[1:])', 'Test [4,5,6].'),
      pt('p0511_4', '4-mashq: Raqamlar yig‘indisi', 'Task 4: Digit Sum', '`digit_sum(1234)` -> `10` ni rekursiv chiqaring.', 'Recursive sum of digits.', `def digit_sum(n):\n    if n < 10:\n        return n\n    return (n % 10) + digit_sum(n // 10)\nprint(digit_sum(1234))`, '10', 'n % 10 + digit_sum(n // 10)', 'Test 1234.'),
      pt('p0511_5', '5-mashq: Palindrom tekshiruvi', 'Task 5: Recursive Palindrome', '`is_pal("radar")` ni rekursiv chiqaring.', 'Check palindrome recursively.', `def is_pal(s):\n    if len(s) <= 1:\n        return True\n    return s[0] == s[-1] and is_pal(s[1:-1])\nprint(is_pal("radar"))`, 'True', 'Compare ends and recurse inner.', 'Test "radar".'),
    ],
    quiz: [
      q('q0511_1', 'Har bir rekursiv funksiyada qaysi ikki qism shart?', 'Two mandatory parts of recursion?', ['try va except', 'Base case va Recursive step', 'global va nonlocal', 'lambda va map'], ['try and except', 'Base case and Recursive step', 'global and nonlocal', 'lambda and map'], 1, 'Base case (to‘xtash) va Recursive step (kichrayish).', 'Base case and shrinking recursive step.'),
      q('q0511_2', 'Base case bo‘lmasa qaysi xato chiqadi?', 'Error when recursion never terminates?', ['MemoryError', 'RecursionError', 'IndexError', 'OverflowError'], ['MemoryError', 'RecursionError', 'IndexError', 'OverflowError'], 1, '`RecursionError`.', '`RecursionError`.'),
      q('q0511_3', 'Python da standart maksimal rekursiya chuqurligi taxminan qancha?', 'Default Python recursion limit roughly?', ['100', '1000', '100000', 'Cheksiz'], ['100', '1000', '100000', 'Unlimited'], 1, 'Taxminan `1000`.', 'Around `1000`.'),
      q('q0511_4', 'Qaysi vazifada rekursiya oddiy sikldan ancha qulay?', 'Where does recursion clearly outshine simple loops?', ['1..100 sanash', 'Cheksiz chuqurlikdagi ichma-ich papka/daraxtlar', 'Ikkita sonni qo‘shish', 'String upper'], ['Counting 1..100', 'Arbitrarily nested trees/folders', 'Adding 2 numbers', 'Uppercasing'], 1, 'Daraxt va ichma-ich tuzilmalarni aylanishda.', 'Traversing trees and nested hierarchies.'),
      q('q0511_5', 'Rekursiv chaqiruv oldida `return` tushib qolsa funksiya odatda nima qaytaradi?', 'If `return` is omitted before recursive call, caller gets?', ['0', 'None', 'True', '1'], ['0', 'None', 'True', '1'], 1, '`None` (va keyin `TypeError`).', '`None`.'),
    ],
    homework: hw('Nested JSON Kalitlar Qidiruvchisi', 'Recursive Nested Key Finder', 'Ichma-ich `dict` va `list` daraxtidan berilgan kalit nomiga mos barcha qiymatlarni rekursiv yig‘uvchi `find_all_values(tree, target_key)` funksiyasini tuzing.', 'Write `find_all_values(tree, target_key)` recursively collecting all matching values inside arbitrarily nested dicts/lists.', ['isinstance(..., dict) va list ni tekshirish', 'Base case bilan xavfsiz qaytish'], ['Check dict/list branches', 'Return flat list of matches'], 'for k, v in node.items(): if k == target: out.append(v); out.extend(...)', 'Recurse on values.', 'Nechta qavat chuqurlikda topilganini ham chiqaring.', 'Include depth level in output.', 25),
    reviewCheckpoint: review(
      11,
      'Review Loyiha #11: Rekursiv Papka Hajmi Hisoblagichi (Functions + Recursion)',
      'Review Project #11: Recursive Directory Size Tree',
      '55-dars marrasi! Funksiya scopes, closure, lambda va rekursiyani birlashtirib virtual fayl tizimi hajmini hisoblovchi dastur yarating.',
      '55-lesson milestone! Combine recursion, lambdas, and functions to compute sizes across a nested virtual directory tree.',
      ['Ichma-ich dict (papka -> fayllar va ichki papkalar)', '`calc_size(node)` rekursiv funksiyasi', 'Eng katta fayl/papka nomini lambda bilan topish'],
      ['Nested folder dict structure', 'Recursive `calc_size(node)`', 'Rank subfolders using lambda key'],
      `fs = {
    "src": {"app.py": 12, "utils.py": 5, "auth": {"jwt.py": 8, "rbac.py": 6}},
    "README.md": 3,
}

def calc_size(node):
    if isinstance(node, int):
        return node
    return sum(calc_size(child) for child in node.values())

print("Total KB:", calc_size(fs))
for name, item in fs.items():
    print(f" - {name}: {calc_size(item)} KB")`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-05-12',
    courseId: 'functions',
    moduleId: 'c05_m4',
    order: 12,
    titleUz: 'Docstrings va Type Hints — professional hujjatlashtirish',
    titleEn: 'Docstrings (PEP 257) & Type Hints (PEP 484)',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-05-11'],
    conceptId: 'docstrings_typing',
    whyUz: "FastAPI, Pydantic, zamonaviy IDE avtomatik to‘ldirish (`autocomplete`) va `mypy` static tekshiruvlari aynan **Type Hints** hamda **Docstrings** ustiga qurilgan. Professional jamoalarda tipsiz funksiya code-review dan o‘tmaydi!",
    whyEn: 'Docstrings and Type Hints power FastAPI, Pydantic validation, IDE autocomplete, and static bug-catching via `mypy`/`pyright`.',
    analogyUz: "Type Hint — bu dori qutisidagi aniq yorliq (`mg`, `kattalar uchun`). Python baribir dinamik til bo‘lib qolaveradi, lekin shifokor (IDE/FastAPI) adashmasligi uchun yorliq hamma xatolarni kod ishga tushmasdan oldin ko‘rsatadi.",
    analogyEn: 'Type hints are clear nutrition labels: Python runtime remains dynamic, yet your IDE and tools catch mismatches before running.',
    stopsUz: "Python Type Hints **runtime da majburiy emas** (`def add(a: int, b: int) -> int:` ga `\"a\", \"b\"` bersangiz ham Python xato bermaydi)! Ular FastAPI, `mypy` va IDE lar uchun kontraktdir.",
    stopsEn: 'Python does not enforce type hints at runtime—they guide static analyzers (`mypy`), IDEs, and runtime libraries like Pydantic.',
    objUz: ['Python 3.10+ zamonaviy type hint sintaksisini (`list[int]`, `str | None`, `-> float`) yozish', 'PEP 257 / Google style docstring (`"""..."""`) va `.__doc__` dan foydalanish', 'Static tekshiruv (type annotations) vs runtime tekshiruv farqini bilish'],
    objEn: ['Annotate signatures using Python 3.10+ syntax (`list[int]`, `str | None`)', 'Write clear PEP 257 docstrings readable via `help()` and `.__doc__`', 'Understand static hints vs runtime type validation'],
    theoryUz: `### 1. Type Hints Sintaksisi (PEP 484 & Python 3.10+)
\`\`\`python
def avg_score(scores: list[int], weight: float = 1.0) -> float | None:
    if not scores:
        return None
    return round((sum(scores) / len(scores)) * weight, 2)
\`\`\`
### 2. \`|\` Union Sintaksisi (Python 3.10+)
Eski \`Optional[str]\` o‘rniga \`str | None\`; \`Union[int, float]\` o‘rniga \`int | float\`.
### 3. Docstrings (PEP 257)
Funksiya ostidagi birinchi qator \`"""Qisqacha vazifa tavsifi."""\`. Uzunroq bo‘lsa: Args, Returns, Raises bo‘limlari (Google style).
### 4. \`__annotations__\` va \`__doc__\`
Python tip izohlarini \`fn.__annotations__\` lug‘atida, hujjatni esa \`fn.__doc__\` da saqlaydi.
### 5. Keng tarqalgan xato
Type hint yozsam Python o‘zi \`str\` kelsa \`TypeError\` beradi deb o‘ylash — runtime tekshiruvi uchun \`isinstance()\` yoki Pydantic kerak.`,
    theoryEn: `### 1. Modern Type Hint Syntax
\`def greet(name: str, times: int = 1) -> str:\` plus \`list[str]\`, \`dict[str, int]\`, \`int | None\`.
### 2. PEP 257 Docstrings
Triple-quoted string right under \`def\` describing contract, Args, and Returns.
### 3. Runtime Inspection
Hints live in \`fn.__annotations__\` and docstrings in \`fn.__doc__\`.
### 4. Not Enforced Automatically at Runtime
Python skips runtime type checks unless checked explicitly or by Pydantic/FastAPI.
### 5. First-Line Pitfall
Docstrings must be the very first statement inside the function body.`,
    examples: [
      ex('Misol 1: To‘liq typed va docstringli funksiya', 'Example 1: Typed Function + Docstring', `def find_user(users: dict[int, str], uid: int) -> str | None:\n    """Return user name by ID or None if missing."""\n    return users.get(uid)\n\ndb = {1: "Aziza", 2: "Sardor"}\nprint(find_user(db, 1), find_user(db, 9))\nprint(find_user.__annotations__["return"])`, `Aziza None\nstr | None`, 'Ham tip izohlari, ham docstring toza birlashtirildi.', 'Clean modern union typing plus runtime `__annotations__` check.'),
      ex('Misol 2: Google-style docstring va `.__doc__`', 'Example 2: Inspecting __doc__', `def calc_bmi(weight_kg: float, height_m: float) -> float:\n    """Compute Body Mass Index.\n\n    Args:\n        weight_kg: Weight in kilograms.\n        height_m: Height in meters.\n    """\n    return round(weight_kg / (height_m ** 2), 1)\n\nprint(calc_bmi(70, 1.75))\nprint(calc_bmi.__doc__.splitlines()[0])`, `22.9\nCompute Body Mass Index.`, '`__doc__` dan birinchi qisqa tavsif satri o‘qildi.', 'First summary line extracted from docstring cleanly.'),
      ex('Misol 3: `-> None` qaytarmaydigan funksiya uchun', 'Example 3: Annotating -> None', `def print_report(items: list[str]) -> None:\n    """Print numbered lines to stdout."""\n    for idx, item in enumerate(items, 1):\n        print(f"{idx}. {item}")\n\nprint_report(["Python", "FastAPI"])`, `1. Python\n2. FastAPI`, 'Qiymat qaytarmaydigan funksiyalar `-> None` bilan belgilanadi.', 'Side-effect procedures annotate return type as `-> None`.'),
    ],
    traceTitleUz: 'Docstring va Annotation saqlanishi',
    traceTitleEn: 'Tracing Annotations & Docstring',
    traceCode: `def add(a: int, b: int) -> int:\n    """Add two integers."""\n    return a + b\n\nprint(add.__doc__)`,
    traceSteps: [
      traceStep(1, 'def add(a: int, b: int) -> int:', '__annotations__ saved', 'Tiplar metadata da saqlandi', 'Saved type hints in __annotations__'),
      traceStep(2, '"""Add two integers."""', '__doc__ saved', 'Docstring __doc__ ga yozildi', 'Bound __doc__ attribute'),
      traceStep(3, 'print(add.__doc__)', 'Add two integers.', 'Hujjat matni chiqdi', 'Printed docstring', 'Add two integers.'),
    ],
    commonMistakes: [
      mistake('Type hint runtime da tekshiradi deb ishonish', 'Assuming Runtime Enforcement', `def add(a: int, b: int) -> int:\n    return a + b\nprint(add("hi", "!") )`, 'Silently prints "hi!" without raising TypeError', `def add(a: int, b: int) -> int:\n    if not (isinstance(a, int) and isinstance(b, int)):\n        raise TypeError("Expected ints")\n    return a + b\nprint(add(2, 3))`, 'Python type hintlarni avtomatik tekshirmaydi.', 'Hints are metadata for linters/IDEs, not runtime guards.', 'Tashqi kirishlarda `isinstance()` yoki Pydantic qo‘llang.', 'Validate external inputs explicitly.'),
      mistake('Docstringni funksiya tepasiga `#` bilan yozib `.__doc__` dan ayrilish', 'Comment Above def Instead of Docstring', `# Adds two numbers\ndef add(a, b):\n    return a + b\nprint(add.__doc__)`, 'Prints None', `def add(a, b):\n    """Adds two numbers."""\n    return a + b\nprint(add.__doc__)`, '`#` izoh `help()` va `__doc__` ga tushmaydi.', 'Hash comments are stripped before runtime.', 'Funksiya tanasi ichida `"""..."""` yozing.', 'Place triple-quoted docstring as first statement.'),
    ],
    compareTitleUz: 'Izoh (`#`) vs Docstring (`"""..."""`)',
    compareTitleEn: 'Comment (`#`) vs Docstring (`"""..."""`)',
    compareUz: ['`#` izoh: kod **qanday/nima uchun** yozilganini ichki dasturchiga tushuntiradi.', '`"""Docstring"""`: funksiyani **qanday chaqirish** kontraktini IDE va `help()` ga beradi.'],
    compareEn: ['`#` comments explain internal implementation why.', 'Docstrings document public API contracts for callers and IDEs.'],
    compareSummaryUz: 'Har bir ommaviy funksiyaga qisqa type hints va 1 qatorli docstring yozishni odat qiling.',
    compareSummaryEn: 'Annotate public functions with clean type hints and a concise PEP 257 docstring.',
    practiceTasks: [
      pt('p0512_1', '1-mashq: Oddiy type hints', 'Task 1: Typed Function', '`def mul(a: int, b: int) -> int:` yozib `mul(6, 7)` ni chiqaring.', 'Write typed mul function.', `def mul(a: int, b: int) -> int:\n    return a * b\nprint(mul(6, 7))`, '42', 'a: int, b: int -> int', 'Call mul(6, 7).'),
      pt('p0512_2', '2-mashq: Union `| None`', 'Task 2: Union Return', '`first_even(nums: list[int]) -> int | None` yozib `[1, 3]` uchun chiqaring.', 'Return int | None.', `def first_even(nums: list[int]) -> int | None:\n    for n in nums:\n        if n % 2 == 0:\n            return n\n    return None\nprint(first_even([1, 3]))`, 'None', 'list[int] -> int | None', 'Test [1, 3].'),
      pt('p0512_3', '3-mashq: Docstring `.__doc__`', 'Task 3: Docstring Check', '`ping()` funksiyasiga `"""Health check."""` yozib `ping.__doc__` ni chiqaring.', 'Inspect __doc__.', `def ping() -> str:\n    """Health check."""\n    return "ok"\nprint(ping.__doc__)`, 'Health check.', '"""Health check."""', 'Print ping.__doc__.'),
      pt('p0512_4', '4-mashq: `-> None`', 'Task 4: Void Return', '`show(msg: str) -> None` yozib `show("Hi")` va `show.__annotations__["return"]` ni chiqaring.', 'Annotate -> None.', `def show(msg: str) -> None:\n    print(msg)\nshow("Hi")\nprint(show.__annotations__["return"])`, 'Hi\nNone', '-> None', 'Print return annotation.'),
      pt('p0512_5', '5-mashq: `dict[str, float]`', 'Task 5: Typed Dict', '`total_bill(cart: dict[str, float]) -> float` yozib `{"tea": 2.5, "pie": 4.5}` uchun chiqaring.', 'Sum dict[str, float].', `def total_bill(cart: dict[str, float]) -> float:\n    return sum(cart.values())\nprint(total_bill({"tea": 2.5, "pie": 4.5}))`, '7.0', 'sum(cart.values())', 'Call total_bill.'),
    ],
    quiz: [
      q('q0512_1', 'Python 3.10+ da `str` yoki `None` qaytishini qanday yozish tavsiya etiladi?', 'Modern Python 3.10+ nullable hint?', ['str?','str | None', 'str && None', 'Maybe<str>'], ['str?', 'str | None', 'str && None', 'Maybe<str>'], 1, '`str | None`.', '`str | None`.'),
      q('q0512_2', 'Python runtime da type hint buzilsa avtomatik `TypeError` beradimi?', 'Does Python enforce type hints automatically at runtime?', ['Ha', 'Yo‘q, ular faqat metadata/static tekshiruv uchun', 'Faqat int da', 'Faqat FastAPI siz'], ['Yes', 'No, they are metadata for tools/linters', 'Ints only', 'Always'], 1, 'Yo‘q, `mypy`/IDE/Pydantic tekshiradi.', 'No, checked by tools like mypy or Pydantic.'),
      q('q0512_3', 'Docstring qayerda joylashishi shart?', 'Where must a docstring be placed?', ['def tepasida', 'Funksiya tanasining birinchi qatorida', 'return dan keyin', 'Fayl oxirida'], ['Above def', 'First statement inside body', 'After return', 'End of file'], 1, 'Funksiya tanasining eng birinchi qatorida.', 'First statement inside body.'),
      q('q0512_4', 'Qiymat qaytarmaydigan funksiyaning return type hinti?', 'Return type hint for a void function?', ['-> void', '-> null', '-> None', '-> Empty'], ['-> void', '-> null', '-> None', '-> Empty'], 2, '`-> None`.', '`-> None`.'),
      q('q0512_5', 'Docstring matniga runtime da qaysi atribut orqali murojaat qilinadi?', 'Attribute holding docstring text?', ['.__text__', '.__help__', '.__doc__', '.__info__'], ['.__text__', '.__help__', '.__doc__', '.__info__'], 2, '`.__doc__`.', '`.__doc__`.'),
    ],
    homework: hw('5-Kurs Yakuniy Typed Funksiyalar Kutubxonasi', 'Course 5 Typed String & Math Kit', '3 ta funksiyali (`slugify`, `clamp`, `stats_summary`) kichik kutubxona yozing: har birida zamonaviy Type Hints (`str | None`, `list[float]`) va Google-style docstring bo‘lsin.', 'Build a mini 3-function utility module (`slugify`, `clamp`, `stats_summary`) fully typed and documented per PEP 257/484.', ['To‘liq Type Hints', 'Har birida docstring', 'Kamida 3 ta test chaqiruvi'], ['Full Type Hints', 'PEP 257 docstrings', 'Test calls included'], 'def slugify(text: str) -> str:', 'Keep signatures clean.', 'Har bir funksiyaning `.__annotations__` ni ham tekshirib chiqaring.', 'Inspect `__annotations__` programmatically.', 25),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),
];
