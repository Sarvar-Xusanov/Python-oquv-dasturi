import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C04_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-04-08',
    courseId: 'data_structures',
    moduleId: 'c04_m3',
    order: 8,
    titleUz: 'Dictionaries — kalit-qiymat lug‘atlar',
    titleEn: 'Dictionaries: Hash-Table Key-Value Mapping',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-04-07'],
    conceptId: 'dicts_basics',
    whyUz: "Haqiqiy dasturlarda foydalanuvchi profili, API JSON javobi va konfiguratsiyalar indeks (`0, 1, 2`) emas, balki ma'noli kalitlar (`\"name\"`, `\"email\"`, `\"role\"`) bilan saqlanadi.",
    whyEn: 'Real applications store profiles, configs, and JSON payloads by meaningful keys (`"name"`, `"role"`) with O(1) average lookup speed.',
    analogyUz: "Lug‘at (`dict`) — bu xonadondagi pochta qutilari: `\"Aziz\"` nomini bilsangiz, 10 000 ta quti orasidan qidirmasdan to‘g‘ri o‘sha qutini 1 qadamda (O(1)) ochasiz.",
    analogyEn: 'A `dict` is like labeled bank vaults—given the key label, hash indexing jumps straight to the value in O(1) average time.',
    stopsUz: "Lug‘at kaliti (key) faqat **hashable** (immutable) tur bo‘lishi shart: `str`, `int`, `tuple` mumkin, lekin `list` yoki boshqa `dict` kalit bo‘la olmaydi (`TypeError: unhashable type`).",
    stopsEn: 'Dictionary keys must be hashable (immutable like `str`, `int`, `tuple`); `list` or `dict` cannot be keys.',
    objUz: ['`{key: value}` va `dict()` bilan lug‘at yaratish', 'Kalit orqali o‘qish, yangilash va `del` / `.pop()` bilan o‘chirish', 'O(1) hash lookup va Python 3.7+ da tartib saqlanishini tushunish'],
    objEn: ['Create dicts using literals and `dict()`', 'Read, insert, update, and remove entries safely', 'Understand O(1) hash lookup and insertion-order preservation'],
    theoryUz: `### 1. Dictionary nima?
\`dict\` — bu \`kalit: qiymat\` (\`key: value\`) juftliklaridan iborat kolleksiya. Python 3.7+ dan boshlab kiritish tartibi saqlanadi.
### 2. Yaratish va O‘qish
\`user = {"name": "Ali", "age": 22}\` -> \`user["name"]\` \`"Ali"\` qaytaradi. Mavjud bo‘lmagan kalitga \`user["job"]\` deb murojaat qilish **\`KeyError\`** beradi!
### 3. Qo‘shish va Yangilash
\`user["city"] = "Toshkent"\` yangi juftlik qo‘shadi; agar kalit mavjud bo‘lsa qiymatini yangilaydi.
### 4. O‘chirish va Tekshirish
\`"age" in user\` kalitlar ichidan O(1) da qidiradi. \`del user["age"]\` yoki \`removed = user.pop("age")\` juftlikni o‘chiradi.
### 5. Hashable Kalitlar Qoidasi
Kalit o‘zgarmas (\`str\`, \`int\`, \`float\`, \`tuple\`) bo‘lishi shart. Qiymat esa istagan tur (hatto \`list\` yoki ichki \`dict\`) bo‘lishi mumkin.`,
    theoryEn: `### 1. What Is a Dictionary?
An insertion-ordered key-value mapping backed by a hash table.
### 2. Creation & Direct Indexing
\`user = {"name": "Ali"}\`; missing keys raise \`KeyError\` on \`user["missing"]\`.
### 3. Insertion & Updates
\`user[k] = v\` inserts if absent or overwrites if present.
### 4. Membership & Deletion
\`k in d\` checks keys in O(1). Remove via \`del d[k]\` or \`d.pop(k)\`.
### 5. Hashable Keys Requirement
Keys must be immutable; values may be any Python object.`,
    examples: [
      ex('Misol 1: Yaratish, o‘zgartirish va tekshirish', 'Example 1: Create, Update & Membership', `user = {"name": "Madina", "score": 85}\nuser["score"] = 92\nuser["city"] = "Samarqand"\nprint(user)\nprint("Has city:", "city" in user)`, `{'name': 'Madina', 'score': 92, 'city': 'Samarqand'}\nHas city: True`, 'Mavjud kalit yangilandi, yangi kalit qo‘shildi va `in` bilan tekshirildi.', 'Updated existing key, inserted new key, checked membership.'),
      ex('Misol 2: Chastota hisoblagich (Frequency Map)', 'Example 2: Word Frequency Counter', `words = ["py", "sql", "py", "ai", "py", "sql"]\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)`, `{'py': 3, 'sql': 2, 'ai': 1}`, 'Har bir so‘z uchrash soni O(n) bitta siklda sanaldi.', 'Counted frequencies in one linear pass.'),
      ex('Misol 3: `del` va `.pop()` farqi', 'Example 3: Removing Keys', `cfg = {"host": "localhost", "port": 8000, "debug": True}\ndebug_val = cfg.pop("debug")\nprint("Popped:", debug_val, "| Remaining:", cfg)`, `Popped: True | Remaining: {'host': 'localhost', 'port': 8000}`, '`.pop()` o‘chirilgan qiymatni qaytaradi.', '`.pop()` deletes and returns the popped value.'),
    ],
    traceTitleUz: 'Lug‘at xotira izi',
    traceTitleEn: 'Tracing Dictionary Mutations',
    traceCode: `d = {"a": 1}\nd["b"] = 2\nd["a"] = 10\nprint(d["a"] + d["b"])`,
    traceSteps: [
      traceStep(1, 'd = {"a": 1}', '{"a": 1}', 'Boshlang‘ich lug‘at', 'Initial dict'),
      traceStep(2, 'd["b"] = 2', '{"a": 1, "b": 2}', 'Yangi kalit qo‘shildi', 'Inserted "b"'),
      traceStep(3, 'd["a"] = 10', '{"a": 10, "b": 2}', '"a" qiymati yangilandi', 'Overwrote "a"'),
      traceStep(4, 'print(...)', '12', '10 + 2 chop etildi', 'Printed sum', '12'),
    ],
    commonMistakes: [
      mistake('Mavjud bo‘lmagan kalitga `[]` bilan murojaat', 'Direct Access Missing KeyError', `user = {"name": "Ali"}\nprint(user["phone"])`, 'KeyError: "phone"', `user = {"name": "Ali"}\nprint(user.get("phone", "N/A"))`, 'Kalit yo‘q bo‘lsa `[]` xato beradi.', '`[]` raises KeyError on absent keys.', 'Xavfsiz o‘qish uchun `.get(key, default)` ishlating.', 'Use `.get(key, default)`.'),
      mistake('`list` ni dict kaliti qilish', 'Using List as Dict Key', `bad = {[1, 2]: "point"}`, 'TypeError: unhashable type: "list"', `good = {(1, 2): "point"}\nprint(good[(1, 2)])`, '`list` o‘zgaruvchan va hashlanmaydi.', 'Lists are mutable and unhashable.', 'Koordinata kalitlari uchun `tuple` ishlating.', 'Use tuples as composite keys.'),
    ],
    compareTitleUz: '`d[key]` vs `d.get(key, default)`',
    compareTitleEn: '`d[key]` vs `d.get(key, default)`',
    compareUz: ['`d[key]`: kalit aniq bo‘lishi shart joyda (xatoni darrov ushlash uchun).', '`d.get(key, default)`: kalit bo‘lmasligi tabiiy bo‘lgan API/forma ma’lumotlarida.'],
    compareEn: ['`d[key]`: fail-loud when key presence is a strict contract.', '`d.get(key, default)`: safe fallback for optional inputs.'],
    compareSummaryUz: 'Ixtiyoriy kalitlar uchun `.get()`, majburiy kontraktlar uchun `[]` ishlating.',
    compareSummaryEn: 'Use `.get()` for optional lookups and `[]` when missing keys represent bugs.',
    practiceTasks: [
      pt('p0408_1', '1-mashq: Profil yaratish', 'Task 1: Create Profile', '`{"name": "Sardor", "age": 24}` lug‘atida `age` ni `25` qilib chiqaring.', 'Update age to 25 and print.', `p = {"name": "Sardor", "age": 24}\np["age"] = 25\nprint(p["age"])`, '25', 'p["age"] = 25', 'Overwrite key.'),
      pt('p0408_2', '2-mashq: Xavfsiz `.get()`', 'Task 2: Safe .get()', '`{"a": 1}` dan `"b"` ni default `99` bilan oling.', 'Read missing key "b" with fallback 99.', `d = {"a": 1}\nprint(d.get("b", 99))`, '99', 'd.get("b", 99)', 'Use .get().'),
      pt('p0408_3', '3-mashq: Kalit qo‘shish', 'Task 3: Add Entry', '`d = {"x": 10}` ga `"y": 20` qo‘shib uzunligini chiqaring.', 'Add "y": 20 and print len(d).', `d = {"x": 10}\nd["y"] = 20\nprint(len(d))`, '2', 'd["y"] = 20', 'Assign key.'),
      pt('p0408_4', '4-mashq: `.pop()` bilan o‘chirish', 'Task 4: Pop Key', '`{"a": 1, "b": 2}` dan `"a"` ni pop qilib natijani chiqaring.', 'Pop "a" and print returned value.', `d = {"a": 1, "b": 2}\nprint(d.pop("a"))`, '1', 'd.pop("a")', 'Use pop().'),
      pt('p0408_5', '5-mashq: Tuple kalit', 'Task 5: Tuple Key', '`{(0, 0): "origin"}` dan `(0, 0)` qiymatini chiqaring.', 'Print value at tuple key (0, 0).', `grid = {(0, 0): "origin"}\nprint(grid[(0, 0)])`, 'origin', 'Tuple is hashable.', 'Index with (0, 0).'),
    ],
    quiz: [
      q('q0408_1', 'Qaysi tur dictionary kaliti BO‘LA OLMAYDI?', 'Which type CANNOT be a dict key?', ['str', 'int', 'tuple', 'list'], ['str', 'int', 'tuple', 'list'], 3, '`list` mutable bo‘lgani uchun unhashable.', '`list` is unhashable.'),
      q('q0408_2', '`d.get("missing")` default berilmasa nima qaytaradi?', 'What does `d.get("missing")` return without a default?', ['KeyError', '""', 'None', '0'], ['KeyError', '""', 'None', '0'], 2, '`None` qaytaradi.', 'Returns `None`.'),
      q('q0408_3', 'Dictionary kalit qidirish o‘rtacha murakkabligi?', 'Average lookup complexity of a dict?', ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], 2, 'Hash jadvali tufayli O(1).', 'O(1) via hash table.'),
      q('q0408_4', '`x in my_dict` nimani tekshiradi?', 'What does `x in my_dict` check?', ['Faqat qiymatlarni', 'Faqat kalitlarni', 'Ikkalasini', 'Indeksni'], ['Values only', 'Keys only', 'Both', 'Index'], 1, 'Faqat kalitlarni (`keys`) tekshiradi.', 'Checks keys only.'),
      q('q0408_5', 'Bir lug‘atda ikkita bir xil kalit bo‘lishi mumkinmi?', 'Can a dict contain duplicate keys?', ['Ha', 'Yo‘q, keyingisi eskisini ustidan yozadi', 'Faqat int da', 'Faqat bo‘shda'], ['Yes', 'No, later value overwrites', 'Ints only', 'Empty only'], 1, 'Kalitlar noyob (unique) bo‘ladi.', 'Keys are unique.'),
    ],
    homework: hw('Kichik Mahsulotlar Ombori Lug‘ati', 'Mini Inventory Dict', 'Mahsulot narxlari va zaxira sonini dict da saqlang, chegirma qo‘llang va yo‘q mahsulotni xavfsiz `.get()` bilan tekshiring.', 'Store products in a dict, update stock safely, and handle missing products with `.get()`.', ['Kamida 4 ta mahsulot', '.get() dan foydalanish'], ['At least 4 items', 'Use .get() safely'], 'price = catalog.get(item, 0)', 'Default missing prices to 0.', 'Barcha mahsulotlar umumiy qiymatini hisoblang.', 'Compute total inventory value.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-04-09',
    courseId: 'data_structures',
    moduleId: 'c04_m3',
    order: 9,
    titleUz: 'Dictionary Methods — lug‘at metodlari va iteratsiya',
    titleEn: 'Dictionary Methods: .keys(), .values(), .items(), .setdefault() & |',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-04-08'],
    conceptId: 'dict_methods',
    whyUz: "Lug‘at ustida aylanish (`.items()`), ikkita konfiguratsiyani birlashtirish (`|` yoki `.update()`), guruhlash (`.setdefault()`) — har bir backend API va ma’lumot tahlilining yuragi.",
    whyEn: 'Iterating `.items()`, merging configs with `|` / `.update()`, and grouping records with `.setdefault()` appear everywhere in Python codebases.',
    analogyUz: "`.keys()` — faqat yorliqlar ro‘yxati; `.values()` — faqat quti ichidagi narsalar; `.items()` — har bir qutining `(yorliq, ichidagi_narsa)` juftligi.",
    analogyEn: '`.keys()` yields labels, `.values()` yields contents, and `.items()` yields `(label, content)` pairs together.',
    stopsUz: "Sikl ichida lug‘at ustida aylanayotganda (`for k in d:`) unga yangi kalit qo‘shish yoki `del d[k]` qilish `RuntimeError: dictionary changed size during iteration` xatosini beradi!",
    stopsEn: 'Never add or delete keys while iterating directly over a dict—collect keys first or build a new dict.',
    objUz: ['`.keys()`, `.values()`, `.items()` view obyektlari bilan sikl yozish', '`.setdefault()` va `.update()` hamda Python 3.9+ `|` merge operatorini qo‘llash', 'Sikl paytida lug‘at hajmini o‘zgartirish xatosidan qochish'],
    objEn: ['Iterate cleanly with `.keys()`, `.values()`, and `.items()`', 'Group items with `.setdefault()` and merge dicts via `|` or `.update()`', 'Avoid mutating dictionary size during iteration'],
    theoryUz: `### 1. View obyektlari: \`.keys()\`, \`.values()\`, \`.items()\`
\`for k, v in scores.items():\` — ham kalit, ham qiymatni eng toza olish usuli.
### 2. \`.setdefault(key, default)\` bilan guruhlash
Agar kalit bo‘lmasa default qiymatni qo‘yib qaytaradi, bor bo‘lsa o‘sha qiymatni o‘zgartirmay qaytaradi: \`groups.setdefault(dept, []).append(emp)\`.
### 3. Lug‘atlarni birlashtirish: \`.update()\` vs \`|\`
\`d1.update(d2)\` joyida o‘zgartiradi; \`merged = d1 | d2\` (Python 3.9+) esa asl lug‘atlarga tegmasdan **yangi** lug‘at yaratadi!
### 4. \`.popitem()\` va \`.copy()\`
\`popitem()\` oxirgi qo‘shilgan \`(k, v)\` juftlikni qaytaradi. \`.copy()\` sayoz nusxa oladi.
### 5. Keng tarqalgan xato
\`for k in d: del d[k]\` -> \`RuntimeError\`.`,
    theoryEn: `### 1. View Objects
\`.keys()\`, \`.values()\`, and \`.items()\` return dynamic views; use \`for k, v in d.items():\`.
### 2. Grouping with \`.setdefault()\`
\`groups.setdefault(tag, []).append(item)\` avoids boilerplate \`if tag not in groups\`.
### 3. Merging: \`.update()\` vs \`|\`
\`.update()\` mutates in place; \`a | b\` creates a fresh merged dictionary.
### 4. \`.popitem()\` and \`.copy()\`
LIFO removal and shallow copy helpers.
### 5. Iteration Mutation Error
Modifying dict size during iteration raises \`RuntimeError\`.`,
    examples: [
      ex('Misol 1: `.items()` bilan formatlash', 'Example 1: Iterating .items()', `grades = {"Aziz": 95, "Bobur": 82, "Lola": 90}\nfor name, score in grades.items():\n    print(f"{name}: {score}")`, `Aziz: 95\nBobur: 82\nLola: 90`, 'Tuple unpacking orqali har bir juftlik chiqarildi.', 'Unpacked key-value pairs directly from `.items()`.'),
      ex('Misol 2: `.setdefault()` bilan guruhlash', 'Example 2: Grouping via .setdefault()', `pairs = [("backend", "Ali"), ("ai", "Zarina"), ("backend", "Sardor")]\ngroups = {}\nfor track, student in pairs:\n    groups.setdefault(track, []).append(student)\nprint(groups)`, `{'backend': ['Ali', 'Sardor'], 'ai': ['Zarina']}`, '`.setdefault` yo‘q bo‘lgan guruhga darrov bo‘sh list ochib berdi.', 'Grouped students cleanly without `if track not in groups`.'),
      ex('Misol 3: `|` operatori bilan konfiguratsiya birlashtirish', 'Example 3: Merging Dicts with |', `defaults = {"timeout": 5, "retries": 2}\nuser_cfg = {"timeout": 15}\nfinal_cfg = defaults | user_cfg\nprint("Default:", defaults)\nprint("Merged:", final_cfg)`, `Default: {'timeout': 5, 'retries': 2}\nMerged: {'timeout': 15, 'retries': 2}`, '`|` operatori asl `defaults` ni buzmasdan yangi dict qaytardi.', '`defaults | user_cfg` preserves both source dictionaries.'),
    ],
    traceTitleUz: '`.setdefault()` izi',
    traceTitleEn: 'Tracing .setdefault()',
    traceCode: `g = {}\ng.setdefault("a", []).append(1)\ng.setdefault("a", []).append(2)\nprint(g)`,
    traceSteps: [
      traceStep(1, 'g = {}', '{}', 'Bo‘sh dict', 'Empty dict'),
      traceStep(2, 'g.setdefault("a", []).append(1)', '{"a": [1]}', '"a" yaratildi va 1 qo‘shildi', 'Initialized "a" and appended 1'),
      traceStep(3, 'g.setdefault("a", []).append(2)', '{"a": [1, 2]}', 'Mavjud listga 2 qo‘shildi', 'Reused existing list'),
      traceStep(4, 'print(g)', "{'a': [1, 2]}", 'Natija chiqdi', 'Printed', "{'a': [1, 2]}"),
    ],
    commonMistakes: [
      mistake('Sikl paytida lug‘atdan kalit o‘chirish', 'Deleting Keys While Iterating', `d = {"a": 1, "b": -2}\nfor k in d:\n    if d[k] < 0:\n        del d[k]`, 'RuntimeError: dictionary changed size during iteration', `d = {"a": 1, "b": -2}\nfor k in list(d.keys()):\n    if d[k] < 0:\n        del d[k]\nprint(d)`, 'Iteratsiya paytida dict o‘lchami o‘zgarishi mumkin emas.', 'Iterating over a changing hash table is unsafe.', '`list(d.keys())` yoki dict comprehension ishlating.', 'Iterate over `list(d)` or rebuild via comprehension.'),
      mistake('`for x in d:` qiymat beradi deb o‘ylash', 'Assuming Dict Iteration Yields Values', `prices = {"apple": 5, "pear": 7}\nprint(sum(prices))`, 'TypeError: unsupported operand type(s) for +: int and str', `prices = {"apple": 5, "pear": 7}\nprint(sum(prices.values()))`, '`for x in d` kalitlarni beradi, qiymatlarni emas.', 'Iterating a dict directly yields keys.', 'Qiymatlar uchun `.values()` chaqiring.', 'Use `.values()`.'),
    ],
    compareTitleUz: '`d1.update(d2)` vs `d1 | d2`',
    compareTitleEn: '`d1.update(d2)` vs `d1 | d2`',
    compareUz: ['`d1.update(d2)`: mavjud `d1` ni joyida o‘zgartiradi.', '`d1 | d2`: asl lug‘atlarni saqlab yangi birlashtirilgan lug‘at yaratadi.'],
    compareEn: ['`.update()`: mutates `d1` in place.', '`d1 | d2`: returns a new merged dict leaving inputs untouched.'],
    compareSummaryUz: 'Sozlamalarni xavfsiz birlashtirishda `d1 | d2` ni afzal ko‘ring.',
    compareSummaryEn: 'Prefer `d1 | d2` when immutability of defaults matters.',
    practiceTasks: [
      pt('p0409_1', '1-mashq: Qiymatlar yig‘indisi', 'Task 1: Sum Values', '`{"a": 10, "b": 25, "c": 5}` qiymatlari yig‘indisini chiqaring.', 'Sum all dict values.', `d = {"a": 10, "b": 25, "c": 5}\nprint(sum(d.values()))`, '40', 'sum(d.values())', 'Use .values().'),
      pt('p0409_2', '2-mashq: `|` bilan merge', 'Task 2: Dict Merge |', '`{"x": 1} | {"x": 9, "y": 2}` da `"x"` qiymatini chiqaring.', 'Merge two dicts and print "x".', `m = {"x": 1} | {"x": 9, "y": 2}\nprint(m["x"])`, '9', 'Right side wins on conflict.', 'Use | operator.'),
      pt('p0409_3', '3-mashq: `.setdefault()`', 'Task 3: setdefault', 'Bo‘sh dict ga `setdefault("tags", []).append("py")` qilib chiqaring.', 'Append "py" via setdefault.', `d = {}\nd.setdefault("tags", []).append("py")\nprint(d)`, "{'tags': ['py']}", 'd.setdefault("tags", [])', 'Chain .append().'),
      pt('p0409_4', '4-mashq: `.items()` soni', 'Task 4: Item Pairs', '`{"k1": 1, "k2": 2}` da `sorted(d.keys())` ni chiqaring.', 'Print sorted keys.', `d = {"k2": 2, "k1": 1}\nprint(sorted(d.keys()))`, "['k1', 'k2']", 'sorted(d.keys())', 'Sort keys.'),
      pt('p0409_5', '5-mashq: Xavfsiz filtrlash', 'Task 5: Safe Filter', '`{"a": 1, "b": -3, "c": 4}` dan manfiy qiymatni olib tashlab natijani chiqaring.', 'Keep only positive values in a new dict.', `d = {"a": 1, "b": -3, "c": 4}\nclean = {k: v for k, v in d.items() if v > 0}\nprint(clean)`, "{'a': 1, 'c': 4}", 'Dict comprehension or list(d).', 'Build filtered dict.'),
    ],
    quiz: [
      q('q0409_1', '`.items()` har bir iteratsiyada nima beradi?', 'What does `.items()` yield?', ['Faqat kalit', 'Faqat qiymat', '(key, value) tuple', '[key]'], ['Key only', 'Value only', '(key, value) tuple', '[key]'], 2, '`(key, value)` juftligini.', '`(key, value)` tuples.'),
      q('q0409_2', 'Python 3.9+ da asl dict larni buzmay birlashtiruvchi operator?', 'Non-mutating dict merge operator in Python 3.9+?', ['+', '&', '|', '**'], ['+', '&', '|', '**'], 2, '`|` operatori.', '`|` operator.'),
      q('q0409_3', 'Sikl paytida `del d[k]` qilish qanday xato beradi?', 'Deleting during iteration raises?', ['KeyError', 'IndexError', 'RuntimeError', 'ValueError'], ['KeyError', 'IndexError', 'RuntimeError', 'ValueError'], 2, '`RuntimeError`.', '`RuntimeError`.'),
      q('q0409_4', '`.setdefault(k, [])` kalit mavjud bo‘lsa nima qiladi?', 'What if key already exists in `.setdefault(k, [])`?', ['Ustidan yozadi', 'Mavjud qiymatni o‘zgartirmay qaytaradi', 'Xato beradi', 'O‘chiradi'], ['Overwrites it', 'Returns existing value untouched', 'Raises error', 'Deletes it'], 1, 'Mavjud qiymatni qaytaradi.', 'Returns existing value.'),
      q('q0409_5', '`d.update(other)` qaytargan qiymat nima?', 'Return value of `d.update(other)`?', ['Yangi dict', 'None', 'True', 'len(d)'], ['New dict', 'None', 'True', 'len(d)'], 1, 'Joyida o‘zgartirib `None` qaytaradi.', 'Mutates in place and returns `None`.'),
    ],
    homework: hw('Xodimlar Bo‘limi Bo‘yicha Guruhlash', 'Group Employees by Department', 'Xodimlar `(ism, bo‘lim)` ro‘yxatini `.setdefault()` bilan `{bo‘lim: [ismlar]}` lug‘atiga guruhlang va har bir bo‘limdagi xodim sonini chop eting.', 'Group `(name, dept)` records using `.setdefault()` and print counts per department.', ['.setdefault() ishlatilsin', '.items() bilan chiroyli chiqarilsin'], ['Use .setdefault()', 'Iterate with .items()'], 'groups.setdefault(dept, []).append(name)', 'Initialize lists cleanly.', 'Bo‘lim ichidagi ismlarni alifbo tartibida chiqaring.', 'Sort names alphabetically per department.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-04-10',
    courseId: 'data_structures',
    moduleId: 'c04_m3',
    order: 10,
    titleUz: 'Nested Dictionaries — ichma-ich lug‘atlar va Review #8',
    titleEn: 'Nested Dictionaries, Safe Traversal & Review #8',
    difficulty: 'beginner',
    estimatedMinutes: 40,
    prerequisites: ['PY-04-09'],
    conceptId: 'nested_dicts',
    whyUz: "Har bir REST API javobi (ob-havo, to‘lov tizimi, Telegram bot update) — bu ichma-ich joylashgan `dict` va `list` tuzilmalari! Ulardan xatosiz ma’lumot sug‘urib olish professional mahoratdir.",
    whyEn: 'Every real REST API JSON payload (weather, payments, webhooks) is a tree of nested dicts and lists. Safe traversal avoids production crashes.',
    analogyUz: "Ichma-ich lug‘at — bu kompyuterdagi papkalar daraxti: `\"tashkilot\" -> \"bo‘limlar\" -> \"backend\" -> \"budjet\"`. Bir papka bo‘lmasa, zanjir uzilmasligi uchun `.get(..., {})` qalqon qo‘yiladi.",
    analogyEn: 'Nested dicts resemble nested file folders—chaining `.get(..., {})` guards against missing intermediate branches.',
    stopsUz: "`data[\"user\"][\"address\"][\"city\"]` da biror oraliq kalit bo‘lmasa `KeyError` yoki qiymat `None` bo‘lsa `TypeError: 'NoneType' object is not subscriptable` chiqadi!",
    stopsEn: 'Chained brackets `d["a"]["b"]` crash with `KeyError` or `TypeError` if any intermediate node is absent or `None`.',
    objUz: ['Ichma-ich `dict` va `list` kombinasiyalarini o‘qish va yangilash', 'Zanjirli `.get("a", {}).get("b")` xavfsiz o‘qish texnikasini qo‘llash', 'List of dicts (jadval ko‘rinishidagi yozuvlar) ustida filtrlash va agregatsiya'],
    objEn: ['Traverse nested dict/list payloads safely', 'Guard intermediate lookups with `.get(key, {})`', 'Filter and aggregate list-of-dicts tables'],
    theoryUz: `### 1. Nested Dictionary nima?
Lug‘at qiymati sifatida boshqa lug‘at yoki ro‘yxat kelishi: \`users = {"u1": {"name": "Ali", "skills": ["Python", "SQL"]}}\`.
### 2. Zanjirli O‘qish
\`users["u1"]["skills"][0]\` -> \`"Python"\`.
### 3. Xavfsiz O‘qish (\`.get(..., {})\`)
\`city = profile.get("address", {}).get("city", "Noma'lum")\`. Agar \`"address"\` qiymati \`None\` bo‘lishi mumkin bo‘lsa: \`(profile.get("address") or {}).get("city", "Noma'lum")\`.
### 4. List of Dicts (API Jadval Shakli)
\`orders = [{"id": 1, "total": 120}, {"id": 2, "total": 80}]\` — eng keng tarqalgan JSON shakli.
### 5. Keng tarqalgan xato
\`profile.get("address", {}).get("city")\` da agar \`profile = {"address": None}\` bo‘lsa, \`.get\` \`None\` qaytaradi va keyingi \`.get\` da \`AttributeError\` chiqadi! \`or {}\` bilan himoyalaning.`,
    theoryEn: `### 1. Nested Dictionaries
Hierarchical structures combining dicts and lists—matching JSON objects.
### 2. Chained Access
\`payload["data"]["items"][0]["id"]\`.
### 3. Defensive Traversal
Use \`(d.get("address") or {}).get("city", "Unknown")\` so even explicit \`None\` values never crash.
### 4. List of Dicts Pattern
Rows from APIs and DB queries arrive as \`list[dict]\`.
### 5. Explicit None Trap
\`{"address": None}.get("address", {})\` returns \`None\`, not \`{}\`—always follow with \`or {}\`.`,
    examples: [
      ex('Misol 1: Xavfsiz ichki qidiruv (`or {}`)', 'Example 1: Null-Safe Nested Lookup', `users = [\n    {"name": "Ali", "meta": {"city": "Toshkent"}},\n    {"name": "Zarina", "meta": None},\n    {"name": "Bek"}\n]\nfor u in users:\n    city = (u.get("meta") or {}).get("city", "N/A")\n    print(u["name"], "->", city)`, `Ali -> Toshkent\nZarina -> N/A\nBek -> N/A`, '`meta` yo‘q bo‘lganda ham, `None` bo‘lganda ham dastur yiqilmadi.', 'Handled missing keys and explicit `None` safely.'),
      ex('Misol 2: List of Dicts agregatsiyasi', 'Example 2: Aggregating Records', `orders = [\n    {"user": "Ali", "paid": True, "amount": 150},\n    {"user": "Lola", "paid": False, "amount": 90},\n    {"user": "Ali", "paid": True, "amount": 50},\n]\ntotal_paid = sum(o["amount"] for o in orders if o["paid"])\nprint("Paid sum:", total_paid)`, `Paid sum: 200`, 'Faqat `paid=True` buyurtmalar yig‘indisi hisoblandi.', 'Filtered and summed paid orders cleanly.'),
      ex('Misol 3: Ichki qiymatni yangilash', 'Example 3: Mutating Nested Value', `store = {"fruits": {"apple": 10, "banana": 5}}\nstore["fruits"]["apple"] += 4\nprint(store["fruits"])`, `{'apple': 14, 'banana': 5}`, 'Ichki kalit qiymati joyida oshirildi.', 'Incremented nested counter cleanly.'),
    ],
    traceTitleUz: 'Xavfsiz zanjir izi',
    traceTitleEn: 'Tracing Null-Safe Access',
    traceCode: `u = {"meta": None}\ncity = (u.get("meta") or {}).get("city", "N/A")\nprint(city)`,
    traceSteps: [
      traceStep(1, 'u.get("meta")', 'None', 'Kalit qiymati None', 'Returned None'),
      traceStep(2, 'None or {}', '{}', 'Bo‘sh dict zaxira sifatida olindi', 'Fallback {} activated'),
      traceStep(3, '{}.get("city", "N/A")', '"N/A"', 'Default qaytdi', 'Default returned'),
      traceStep(4, 'print(city)', 'N/A', 'Xatosiz chop etildi', 'Printed cleanly', 'N/A'),
    ],
    commonMistakes: [
      mistake('`None` qiymatda `.get(k, {})` ga ishonib qolish', 'Explicit None AttributeError', `u = {"profile": None}\nprint(u.get("profile", {}).get("bio"))`, "AttributeError: 'NoneType' object has no attribute 'get'", `u = {"profile": None}\nprint((u.get("profile") or {}).get("bio", "Empty"))`, 'Kalit bor lekin qiymati `None` bo‘lsa default `{}` ishlamaydi.', '`.get(k, default)` only uses `default` when `k` is absent, not when its value is `None`.', '`(d.get(k) or {}).get(...)` ishlating.', 'Always wrap with `(d.get(k) or {})`.'),
      mistake('List ichida kalit nomini adashtirish', 'Indexing List with String Key', `res = {"items": [{"id": 10}]}\nprint(res["items"]["id"])`, 'TypeError: list indices must be integers', `res = {"items": [{"id": 10}]}\nprint(res["items"][0]["id"])`, '`res["items"]` bu list — avval indeks `[0]`, keyin `["id"]`.', '`items` is a list so index `[0]` first.', 'Har qadamda JSON shaklini (`dict` vs `list`) tekshiring.', 'Track dict vs list at each depth.'),
    ],
    compareTitleUz: 'To‘g‘ridan-to‘g‘ri `d["a"]["b"]` vs `(d.get("a") or {}).get("b")`',
    compareTitleEn: 'Direct Brackets vs Defensive `.get()`',
    compareUz: ['`d["a"]["b"]`: qatʼiy schema tekshirilgan ichki ma’lumotlarda qisqa.', '`(d.get("a") or {}).get("b")`: tashqi API va foydalanuvchi JSON ida xavfsiz.'],
    compareEn: ['Direct `[][]`: concise after schema validation.', 'Chained `.get()` + `or {}`: safe on untrusted or sparse payloads.'],
    compareSummaryUz: 'Tashqi API dan keladigan nested dict larni doim `(d.get(k) or {}).get(...)` bilan o‘qing.',
    compareSummaryEn: 'Guard external JSON payloads with `(d.get(k) or {}).get(...)`.',
    practiceTasks: [
      pt('p0410_1', '1-mashq: Ichki o‘qish', 'Task 1: Nested Read', '`{"a": {"b": 42}}` dan `42` ni chiqaring.', 'Print 42 from nested dict.', `d = {"a": {"b": 42}}\nprint(d["a"]["b"])`, '42', 'd["a"]["b"]', 'Chain keys.'),
      pt('p0410_2', '2-mashq: Null-safe o‘qish', 'Task 2: Null-Safe', '`{"cfg": None}` dan `"mode"` ni `"prod"` default bilan oling.', 'Read mode safely with fallback "prod".', `d = {"cfg": None}\nprint((d.get("cfg") or {}).get("mode", "prod"))`, 'prod', '(d.get("cfg") or {})', 'Use or {}.'),
      pt('p0410_3', '3-mashq: List ichidagi dict', 'Task 3: Dict in List', '`{"users": [{"name": "Ali"}, {"name": "Bek"}]}` dan `"Bek"` ni chiqaring.', 'Extract "Bek".', `data = {"users": [{"name": "Ali"}, {"name": "Bek"}]}\nprint(data["users"][1]["name"])`, 'Bek', 'data["users"][1]["name"]', 'Index 1 then name.'),
      pt('p0410_4', '4-mashq: Ichki yangilash', 'Task 4: Nested Update', '`s = {"db": {"port": 3306}}` da portni `5432` qiling.', 'Change port to 5432.', `s = {"db": {"port": 3306}}\ns["db"]["port"] = 5432\nprint(s["db"]["port"])`, '5432', 's["db"]["port"] = 5432', 'Assign nested key.'),
      pt('p0410_5', '5-mashq: Yozuvlar yig‘indisi', 'Task 5: Sum List of Dicts', '`[{"p": 10}, {"p": 25}]` da `"p"` lar yig‘indisini chiqaring.', 'Sum all "p" values.', `rows = [{"p": 10}, {"p": 25}]\nprint(sum(r["p"] for r in rows))`, '35', 'sum(r["p"] for r in rows)', 'Sum generator.'),
    ],
    quiz: [
      q('q0410_1', '`{"a": None}.get("a", {})` nimani qaytaradi?', 'What does `{"a": None}.get("a", {})` return?', ['{}', 'None', 'KeyError', 'False'], ['{}', 'None', 'KeyError', 'False'], 1, 'Kalit mavjud, qiymati `None` bo‘lgani uchun `None` qaytadi.', 'Key exists with value `None`, so it returns `None`.'),
      q('q0410_2', 'JSON obyekti Python da qaysi turga aylanadi?', 'JSON object maps to which Python type?', ['list', 'tuple', 'dict', 'set'], ['list', 'tuple', 'dict', 'set'], 2, '`dict`.', '`dict`.'),
      q('q0410_3', '`d["items"][0]["id"]` qaysi tuzilmaga mos?', 'What shape matches `d["items"][0]["id"]`?', ['Dict -> List -> Dict', 'List -> Dict -> List', 'Tuple -> Set', 'Dict -> Dict -> List'], ['Dict -> List -> Dict', 'List -> Dict -> List', 'Tuple -> Set', 'Dict -> Dict -> List'], 0, 'Dict ichida List, List ichida Dict.', 'Dict containing List of Dicts.'),
      q('q0410_4', 'Null-safe himoya uchun eng to‘g‘ri ibora?', 'Safest null-guard expression?', ['d.get("a", {}).get("b")', '(d.get("a") or {}).get("b")', 'd["a"]["b"]', 'd.pop("a")'], ['d.get("a", {}).get("b")', '(d.get("a") or {}).get("b")', 'd["a"]["b"]', 'd.pop("a")'], 1, '`or {}` explicit `None` ni ham tutadi.', '`or {}` handles explicit `None` too.'),
      q('q0410_5', 'Lug‘at qiymati sifatida yana lug‘at saqlash mumkinmi?', 'Can a dict value be another dict?', ['Ha', 'Yo‘q', 'Faqat 2 qavat', 'Faqat tuple da'], ['Yes', 'No', 'Only 2 levels', 'Tuple only'], 0, 'Ha, cheklovsiz.', 'Yes, arbitrarily nested.'),
    ],
    homework: hw('API Foydalanuvchilar Katalogi Parseri', 'API User Catalog Parser', '3 ta foydalanuvchidan iborat nested JSON-like list yarating (birida `contact: None` bo‘lsin) va hammasining email/shahrini xavfsiz chiqaring.', 'Parse a nested list of 3 user payloads including a `contact: None` edge case.', ['or {} himoyasi', 'Har bir foydalanuvchi nomi va shahri'], ['Use or {} guard', 'Print name and city for all'], '(u.get("contact") or {}).get("city", "Noma\'lum")', 'Guard nested lookup.', 'Faol (`active=True`) foydalanuvchilar sonini ham hisoblang.', 'Count active users too.', 25),
    reviewCheckpoint: review(
      8,
      'Review Loyiha #8: Talabalar va Kurslar Bazasi (Dict + List + Set)',
      'Review Project #8: Student & Course Registry',
      '40-dars marrasi! List, Tuple, Set va Nested Dictionary bilimlaringizni birlashtirib, talabalar baholari va umumiy ko‘nikmalar tahlilchisini tuzing.',
      '40-lesson milestone! Combine lists, sets, tuples, and nested dicts into a student analytics engine.',
      ['Har bir talaba o‘rtacha ballini hisoblash', 'Barcha kurslardagi noyob ko‘nikmalar (`set`) ro‘yxatini chiqarish', 'Eng yuqori ball olgan talabani topish'],
      ['Compute average grade per student', 'Extract unique skills across all students with `set`', 'Find the top-scoring student'],
      `students = {
    "u1": {"name": "Aziza", "scores": [90, 95, 88], "skills": {"Python", "SQL"}},
    "u2": {"name": "Bobur", "scores": [78, 82, 80], "skills": {"SQL", "Docker"}},
    "u3": {"name": "Madina", "scores": [96, 94, 98], "skills": {"Python", "AI"}},
}
all_skills = set()
top_name, top_avg = "", 0.0
for info in students.values():
    avg = sum(info["scores"]) / len(info["scores"])
    all_skills |= info["skills"]
    if avg > top_avg:
        top_avg, top_name = avg, info["name"]
    print(f"{info['name']}: avg={avg:.1f}")
print("Top:", top_name, round(top_avg, 1))
print("All skills:", sorted(all_skills))`,
    ),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-04-11',
    courseId: 'data_structures',
    moduleId: 'c04_m4',
    order: 11,
    titleUz: 'Mutable va Immutable — xotira xulq-atvori',
    titleEn: 'Mutable vs Immutable: Object Identity & Shallow vs Deep Copy',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-04-10'],
    conceptId: 'mutability',
    whyUz: "Python dasturchilaridagi eng ayyor xatolarning 70%i aynan `mutable` obyektlarni bilmasdan nusxalash (aliasing) va `shallow` vs `deep` copy farqini tushunmaslikdan kelib chiqadi.",
    whyEn: 'Understanding object mutability, `id()`, aliasing, and shallow vs deep copies eliminates some of the sneakiest state-corruption bugs in Python.',
    analogyUz: "Immutable (`int`, `str`, `tuple`) — bu qog‘ozga ruchkada yozilgan chek: o‘zgartirib bo‘lmaydi, yangi chek yoziladi. Mutable (`list`, `dict`, `set`) — bu oq doska: xohlagan payt o‘chirib joyida o‘zgartirasiz, hamma ko‘ruvchilar ham yangisini ko‘radi.",
    analogyEn: 'Immutable objects are printed receipts (must issue a new one); mutable objects are shared whiteboards everyone sees live edits on.',
    stopsUz: "`list.copy()` faqat 1-qavatni (shallow copy) nusxalaydi! Agar ro‘yxat ichida yana ro‘yxat (`[[1, 2]]`) bo‘lsa, ichki ro‘yxatlar hali ham umumiy (shared) qoladi — to‘liq ajratish uchun `copy.deepcopy()` kerak!",
    stopsEn: '`.copy()` performs a shallow copy—nested lists/dicts inside are still shared! Use `copy.deepcopy()` for complete isolation.',
    objUz: ['Mutable (`list`, `dict`, `set`) va Immutable (`int`, `float`, `str`, `tuple`, `bool`) turlarni ajratish', '`id()` va `is` vs `==` yordamida xotira havolasini tekshirish', 'Shallow copy (`.copy()`) va `copy.deepcopy()` farqini amalda ko‘rish'],
    objEn: ['Classify mutable vs immutable built-in types', 'Inspect object identity via `id()` and `is` vs `==`', 'Prevent nested aliasing with `copy.deepcopy()`'],
    theoryUz: `### 1. Immutable va Mutable Jadvali
- **Immutable**: \`int\`, \`float\`, \`str\`, \`bool\`, \`tuple\`, \`frozenset\`
- **Mutable**: \`list\`, \`dict\`, \`set\`
### 2. \`id()\` va \`is\` vs \`==\`
\`==\` **qiymatlar** tengligini tekshiradi; \`is\` ikki o‘zgaruvchi xotirada **aynan bitta obyektga** ishora qilayotganini (\`id(a) == id(b)\`) tekshiradi.
### 3. Immutable qayta tayinlash
\`s = "hi"; s += "!"\` mavjud stringni o‘zgartirmaydi — xotirada **yangi** string yaratib \`s\` ni unga bog‘laydi (\`id(s)\` o‘zgaradi).
### 4. Shallow vs Deep Copy
\`nested = [[1, 2], [3, 4]]\` da \`shallow = nested.copy()\` qilsangiz, \`shallow[0].append(9)\` asl \`nested[0]\` ni ham buzadi! \`import copy; deep = copy.deepcopy(nested)\` barcha qavatlarni ajratadi.
### 5. Keng tarqalgan xato
\`[[0] * 3] * 3\` matrisasini ko‘paytirish — 3 ta qator bitta ichki ro‘yxatga ishora qilib qoladi! To‘g‘risi: \`[[0] * 3 for _ in range(3)]\`.`,
    theoryEn: `### 1. Mutability Classification
Immutable: \`int\`, \`float\`, \`str\`, \`bool\`, \`tuple\`. Mutable: \`list\`, \`dict\`, \`set\`.
### 2. Identity (\`is\`) vs Equality (\`==\`)
\`==\` compares values; \`is\` checks whether two names reference the identical memory address (\`id()\`).
### 3. Rebinding vs Mutating
\`s += "!"\` rebinds \`s\` to a new \`str\`; \`lst.append(1)\` mutates the same \`id(lst)\`.
### 4. Shallow vs Deep Copy
Use \`copy.deepcopy()\` when copying nested mutable structures.
### 5. Matrix Multiplication Bug
Never build 2D grids with \`[[0]*3]*3\`—use \`[[0]*3 for _ in range(3)]\`.`,
    examples: [
      ex('Misol 1: `id()` o‘zgarishi — `str` vs `list`', 'Example 1: Object Identity Behavior', `s = "Py"\ns_id1 = id(s)\ns += "thon"\ns_id2 = id(s)\nnums = [1, 2]\nn_id1 = id(nums)\nnums.append(3)\nn_id2 = id(nums)\nprint("str same id:", s_id1 == s_id2)\nprint("list same id:", n_id1 == n_id2)`, `str same id: False\nlist same id: True`, '`str` da yangi obyekt yaratildi, `list` esa o‘z joyida (`id` o‘zgarmay) kengaydi.', 'String rebinding allocates a new id; list `.append()` mutates in place.'),
      ex('Misol 2: Shallow copy vs `deepcopy`', 'Example 2: Shallow vs Deep Copy', `import copy\norig = [[1, 2], [3, 4]]\nshallow = orig.copy()\ndeep = copy.deepcopy(orig)\nshallow[0].append(99)\nprint("orig:", orig)\nprint("deep:", deep)`, `orig: [[1, 2, 99], [3, 4]]\ndeep: [[1, 2], [3, 4]]`, '`shallow[0]` asl `orig[0]` ga taʼsir qildi, lekin `deepcopy` to‘liq mustaqil qoldi.', '`shallow` shared the inner list while `deepcopy` isolated it.'),
      ex('Misol 3: `[[0]*3]*3` tuzog‘i vs Comprehension', 'Example 3: Safe 2D Grid Creation', `bad = [[0] * 2] * 2\nbad[0][0] = 7\ngood = [[0] * 2 for _ in range(2)]\ngood[0][0] = 7\nprint("bad:", bad)\nprint("good:", good)`, `bad: [[7, 0], [7, 0]]\ngood: [[7, 0], [0, 0]]`, '`[[0]*2]*2` ikkala qatorni bitta listga bog‘lab qo‘ydi!', 'List comprehension allocates an independent list per row.'),
    ],
    traceTitleUz: 'Nested reference izi',
    traceTitleEn: 'Tracing Shared Inner List',
    traceCode: `a = [[1]]\nb = a.copy()\nb[0].append(2)\nprint(a)`,
    traceSteps: [
      traceStep(1, 'a = [[1]]', 'outer->[inner]', 'Tashqi va ichki list yaratildi', 'Outer and inner lists allocated'),
      traceStep(2, 'b = a.copy()', 'b->[inner]', 'Yangi tashqi list, lekin o‘sha inner', 'New outer list pointing to same inner'),
      traceStep(3, 'b[0].append(2)', 'inner=[1,2]', 'Ichki list o‘zgardi', 'Mutated shared inner list'),
      traceStep(4, 'print(a)', '[[1, 2]]', 'a ham o‘zgardi!', 'a sees the inner mutation', '[[1, 2]]'),
    ],
    commonMistakes: [
      mistake('`[[0]*3]*3` bilan 2D jadval tuzish', 'Shared Rows via * Operator', `grid = [[0] * 3] * 3\ngrid[0][1] = 5\nprint(grid)`, '[[0, 5, 0], [0, 5, 0], [0, 5, 0]]', `grid = [[0] * 3 for _ in range(3)]\ngrid[0][1] = 5\nprint(grid)`, '`* 3` bitta ichki ro‘yxatga 3 ta havola qo‘yadi.', '`* 3` repeats references to the same inner list.', 'Har doim `[ [0]*3 for _ in range(3) ]` yozing.', 'Always use a list comprehension for nested mutable rows.'),
      mistake('Qiymat solishtirishda `==` o‘rniga `is` ishlatish', 'Using `is` for Value Equality', `a = [1, 2]\nb = [1, 2]\nprint(a is b)`, 'False (unexpected if expecting value match)', `a = [1, 2]\nb = [1, 2]\nprint(a == b)`, '`is` xotira manzilini solishtiradi, qiymatni emas.', '`is` checks identity, not value equality.', '`is` ni faqat `is None` / `is not None` da ishlating.', 'Reserve `is` for `None` checks; use `==` for values.'),
    ],
    compareTitleUz: '`.copy()` vs `copy.deepcopy()`',
    compareTitleEn: 'Shallow `.copy()` vs `copy.deepcopy()`',
    compareUz: ['`.copy()`: 1 qavatli ro‘yxat/lug‘at uchun tez va yetarli.', '`copy.deepcopy()`: ichma-ich list/dict lar to‘liq ajratilishi shart bo‘lganda.'],
    compareEn: ['`.copy()`: fast single-level copy.', '`copy.deepcopy()`: recursive isolation for nested mutable trees.'],
    compareSummaryUz: 'Flat kolleksiyada `.copy()`, ichma-ich mutable tuzilmada `copy.deepcopy()` ishlating.',
    compareSummaryEn: 'Use `.copy()` for flat containers and `copy.deepcopy()` for nested mutable containers.',
    practiceTasks: [
      pt('p0411_1', '1-mashq: `==` vs `is`', 'Task 1: == vs is', '`[1] == [1]` va `[1] is [1]` natijasini chiqaring.', 'Print equality vs identity.', `a = [1]\nb = [1]\nprint(a == b, a is b)`, 'True False', '== True, is False.', 'Compare both.'),
      pt('p0411_2', '2-mashq: Deepcopy', 'Task 2: Deepcopy', '`import copy` bilan `[[5]]` dan deepcopy olib nusxani o‘zgartirgach aslini chiqaring.', 'Deepcopy [[5]], mutate copy, print original.', `import copy\na = [[5]]\nb = copy.deepcopy(a)\nb[0].append(6)\nprint(a)`, '[[5]]', 'copy.deepcopy(a)', 'Use deepcopy.'),
      pt('p0411_3', '3-mashq: Mustaqil 2D grid', 'Task 3: Independent Grid', '2x2 nollar matritsasini comprehension bilan yasab `(0, 0)` ni `1` qiling.', 'Create 2x2 zero grid and set [0][0]=1.', `g = [[0] * 2 for _ in range(2)]\ng[0][0] = 1\nprint(g)`, '[[1, 0], [0, 0]]', '[[0]*2 for _ in range(2)]', 'Use comprehension.'),
      pt('p0411_4', '4-mashq: Tuple ichida list', 'Task 4: Mutable Inside Tuple', '`t = ([1], 2)` da `t[0].append(9)` qilib chiqaring.', 'Append 9 to list inside tuple.', `t = ([1], 2)\nt[0].append(9)\nprint(t)`, '([1, 9], 2)', 't[0] is mutable.', 'Mutate t[0].'),
      pt('p0411_5', '5-mashq: `is None`', 'Task 5: Identity with None', '`x = None` uchun `print(x is None)` chiqaring.', 'Check None identity.', `x = None\nprint(x is None)`, 'True', 'x is None', 'Use is None.'),
    ],
    quiz: [
      q('q0411_1', 'Qaysi tur **immutable** hisoblanadi?', 'Which type is immutable?', ['list', 'dict', 'set', 'tuple'], ['list', 'dict', 'set', 'tuple'], 3, '`tuple` immutable.', '`tuple` is immutable.'),
      q('q0411_2', '`a = [1]; b = [1]` uchun `a is b` natijasi?', 'Result of `a is b` for two `[1]` literals?', ['True', 'False', 'None', 'Error'], ['True', 'False', 'None', 'Error'], 1, 'Ular xotirada 2 ta alohida obyekt (`False`).', 'Two distinct objects -> `False`.'),
      q('q0411_3', 'Ichma-ich listlarni to‘liq mustaqil nusxalash funksiyasi?', 'Function for full recursive copy?', ['.copy()', 'list()', 'copy.deepcopy()', '[:]'], ['.copy()', 'list()', 'copy.deepcopy()', '[:]'], 2, '`copy.deepcopy()`.', '`copy.deepcopy()`.'),
      q('q0411_4', '2D jadval yaratishning xavfsiz yo‘li?', 'Safe way to build a 3x3 zero matrix?', ['[[0]*3]*3', '[[0]*3 for _ in range(3)]', '[0*3]*3', 'tuple([0]*3)'], ['[[0]*3]*3', '[[0]*3 for _ in range(3)]', '[0*3]*3', 'tuple([0]*3)'], 1, 'Comprehension har qatorga alohida list yaratadi.', 'Comprehension creates distinct row lists.'),
      q('q0411_5', '`None` bilan taqqoslashda PEP 8 qaysi operatorni buyuradi?', 'PEP 8 recommends comparing to `None` with?', ['==', 'is', 'in', '!='], ['==', 'is', 'in', '!='], 1, '`is None` / `is not None`.', '`is None` / `is not None`.'),
    ],
    homework: hw('Matritsa va Deepcopy Xavfsizlik Testi', 'Matrix & Deepcopy Lab', '3x3 o‘yin doskasi (board) tuzing, `copy.deepcopy()` bilan sinov nusxasiga yurish qilib asl doska o‘zgarmaganini tekshiring.', 'Build a 3x3 board, test moves on a `deepcopy`, and assert the original board stayed intact.', ['List comprehension bilan yaratilsin', 'deepcopy ishlatilsin'], ['Use comprehension', 'Use copy.deepcopy'], 'test_board = copy.deepcopy(board)', 'Isolate nested lists.', 'Yurishdan keyingi ikkala doskani ham chiroyli chiqaring.', 'Print both boards cleanly.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-04-12',
    courseId: 'data_structures',
    moduleId: 'c04_m4',
    order: 12,
    titleUz: 'Unpacking — qiymatlarni ochish va *yulduzcha',
    titleEn: 'Sequence Unpacking, Starred Targets & zip()',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-04-11'],
    conceptId: 'unpacking',
    whyUz: "`row[0]`, `row[1]`, `row[2]` kabi o‘qilishi qiyin indekslar o‘rniga Python'da `name, role, salary = row` tarzida bir qatorda toza unpacking yoziladi.",
    whyEn: 'Pythonic unpacking (`name, role, salary = row`, `first, *rest = items`, and `zip()`) replaces noisy index arithmetic with self-documenting bindings.',
    analogyUz: "Unpacking — bu pochta posilkasini ochib, ichidagi narsalarni stol ustidagi belgilangan joylarga bir harakatda qo‘yib chiqishdir; `*rest` esa qolgan mayda narsalarni bitta savatga yig‘adi.",
    analogyEn: 'Unpacking distributes box items onto named desk spots in one move; `*rest` sweeps any leftover items into a list.',
    stopsUz: "Oddiy unpacking da elementlar soni o‘zgaruvchilar soniga teng bo‘lmasa `ValueError: too many/not enough values to unpack` chiqadi. O‘zgaruvchan uzunlikda `*rest` ishlating.",
    stopsEn: 'Mismatched counts raise `ValueError` unless a starred target (`*rest`) absorbs the remainder.',
    objUz: ['Oddiy va ichki sequence unpacking yozish', 'Extended `*rest` unpacking va `_` (ignore) qoidasini qo‘llash', '`zip()` va `enumerate()` bilan parallel iteratsiya qilish'],
    objEn: ['Unpack sequences and nested tuples cleanly', 'Use starred targets (`first, *mid, last`) and `_` placeholders', 'Pair multiple sequences using `zip()` and `enumerate()`'],
    theoryUz: `### 1. Oddiy Unpacking va Almashtirish (Swap)
\`x, y = 10, 20\`; qiymatlarni almashtirish: \`x, y = y, x\`.
### 2. Extended Starred Unpacking (\`*\`)
\`head, *body, tail = [1, 2, 3, 4, 5]\` -> \`head=1\`, \`body=[2, 3, 4]\`, \`tail=5\`. Eʼtibor bering: \`*body\` har doim **\`list\`** bo‘ladi!
### 3. Keraksiz qiymat uchun \`_\`
\`name, _, score = ("Ali", "ignored", 95)\`.
### 4. \`enumerate()\` va \`zip()\` bilan siklda unpacking
\`for idx, (k, v) in enumerate(items):\` va \`for name, age in zip(names, ages):\`.
### 5. Keng tarqalgan xato
\`a, b = [1, 2, 3]\` -> \`ValueError: too many values to unpack\`.`,
    theoryEn: `### 1. Tuple/Sequence Unpacking & Swapping
\`a, b = b, a\` swaps without a temp variable.
### 2. Extended \`*\` Unpacking
\`first, *rest = seq\` always binds \`rest\` as a \`list\`.
### 3. Throwaway \`_\` Convention
\`host, _, port = ("127.0.0.1", "tcp", 8000)\`.
### 4. Loop Unpacking with \`zip()\` & \`enumerate()\`
Combine parallel lists cleanly with \`zip(a, b)\`.
### 5. Count Mismatch
Always match length or include one \`*target\`.`,
    examples: [
      ex('Misol 1: Swap va `*` unpacking', 'Example 1: Swap & Starred Unpacking', `a, b = 5, 9\na, b = b, a\nfirst, *middle, last = [10, 20, 30, 40, 50]\nprint("Swapped:", a, b)\nprint("Parts:", first, middle, last)`, `Swapped: 9 5\nParts: 10 [20, 30, 40] 50`, '`a, b = b, a` qo‘shimcha o‘zgaruvchisiz almashtirdi, `*middle` o‘rtadagi elementlarni oldi.', 'Swapped values and captured middle slice with `*middle`.'),
      ex('Misol 2: `zip()` bilan ikkita ro‘yxatni juftlash', 'Example 2: Parallel Iteration with zip()', `names = ["Ali", "Lola"]\nscores = [92, 97]\npaired = dict(zip(names, scores))\nprint(paired)`, `{'Ali': 92, 'Lola': 97}`, '`zip()` ikki ro‘yxatni juftlab `dict()` ga aylantirdi.', '`zip()` paired keys and values cleanly into a dict.'),
      ex('Misol 3: `enumerate()` bilan indeks + unpacking', 'Example 3: Enumerate + Tuple Unpacking', `records = [("Python", 101), ("SQL", 102)]\nfor i, (title, code) in enumerate(records, start=1):\n    print(f"{i}. {title} #{code}")`, `1. Python #101\n2. SQL #102`, 'Har bir qadamda ham tartib raqami, ham tuple ichi ochildi.', 'Unpacked both index and nested tuple fields in one loop.'),
    ],
    traceTitleUz: 'Starred unpacking izi',
    traceTitleEn: 'Tracing Starred Unpacking',
    traceCode: `head, *tail = (10, 20, 30)\nprint(head, tail)`,
    traceSteps: [
      traceStep(1, 'head, *tail = (10, 20, 30)', 'head=10', 'Birinchi element head ga', 'First item bound to head'),
      traceStep(2, '*tail', 'tail=[20, 30]', 'Qolganlari list ga yig‘ildi', 'Remainder collected as list'),
      traceStep(3, 'print(head, tail)', '10 [20, 30]', 'Natija chop etildi', 'Output printed', '10 [20, 30]'),
    ],
    commonMistakes: [
      mistake('Bitta qatorda ikkita `*` ishlatish', 'Multiple Starred Targets', `a, *b, *c = [1, 2, 3, 4]`, 'SyntaxError: multiple starred expressions in assignment', `a, *b, c = [1, 2, 3, 4]\nprint(a, b, c)`, 'Python qayergacha `b` va qayerdan `c` boshlanishini bila olmaydi.', 'Multiple `*` targets are ambiguous.', 'Har bir unpacking da faqat 1 ta `*` ishlating.', 'Allow at most one `*` per unpacking target.'),
      mistake('`*rest` tuple qaytaradi deb o‘ylash', 'Expecting Tuple from *rest', `a, *rest = (1, 2, 3)\nprint(type(rest).__name__)`, 'Prints list (not tuple)', `a, *rest = (1, 2, 3)\nprint(tuple(rest))`, 'Asl kolleksiya tuple bo‘lsa ham, `*rest` doim `list` bo‘ladi.', '`*rest` always creates a `list` even from tuples.', 'Kerak bo‘lsa `tuple(rest)` qiling.', 'Convert explicitly if tuple needed.'),
    ],
    compareTitleUz: 'Indeks (`row[0], row[1]`) vs Unpacking (`name, age = row`)',
    compareTitleEn: 'Index Access vs Unpacking',
    compareUz: ['`row[0]`: faqat 1 ta ustun kerak bo‘lganda.', '`name, age = row`: kod o‘zini o‘zi tushuntiradi va o‘qilishi oson.'],
    compareEn: ['`row[0]`: fine for single isolated access.', '`name, age = row`: self-documenting multi-field extraction.'],
    compareSummaryUz: 'CSV, SQL qatorlari va API tuple larini har doim ma’noli nomlar bilan unpack qiling.',
    compareSummaryEn: 'Unpack structured rows into descriptive variable names instead of magic indices.',
    practiceTasks: [
      pt('p0412_1', '1-mashq: Swap', 'Task 1: Swap', '`x, y = 1, 9` ni almashtirib chiqaring.', 'Swap x and y.', `x, y = 1, 9\nx, y = y, x\nprint(x, y)`, '9 1', 'x, y = y, x', 'Tuple swap.'),
      pt('p0412_2', '2-mashq: Starred `*`', 'Task 2: Starred Unpack', '`first, *rest = [5, 6, 7]` da `rest` ni chiqaring.', 'Print rest.', `first, *rest = [5, 6, 7]\nprint(rest)`, '[6, 7]', 'first, *rest = ...', 'Print rest.'),
      pt('p0412_3', '3-mashq: `zip()` bilan juftlash', 'Task 3: zip()', '`list(zip([1, 2], ["a", "b"]))` ni chiqaring.', 'Zip two lists.', `print(list(zip([1, 2], ["a", "b"])))`, "[(1, 'a'), (2, 'b')]", 'list(zip(...))', 'Use zip.'),
      pt('p0412_4', '4-mashq: Ichki unpacking', 'Task 4: Nested Unpack', '`a, (b, c) = [1, [2, 3]]` da `b + c` ni chiqaring.', 'Unpack nested pair and print b + c.', `a, (b, c) = [1, [2, 3]]\nprint(b + c)`, '5', 'a, (b, c) = ...', 'Match nested shape.'),
      pt('p0412_5', '5-mashq: Oxirgi element', 'Task 5: Last via *', '`*_, last = [10, 20, 30]` da `last` ni chiqaring.', 'Extract last with *_.', `*_, last = [10, 20, 30]\nprint(last)`, '30', '*_, last = ...', 'Ignore prefix with *_.'),
    ],
    quiz: [
      q('q0412_1', '`x, *y = (1, 2, 3)` da `y` ning turi nima?', 'Type of `y` in `x, *y = (1, 2, 3)`?', ['tuple', 'list', 'set', 'int'], ['tuple', 'list', 'set', 'int'], 1, '`*y` doim `list` bo‘ladi.', 'Always `list`.'),
      q('q0412_2', '`zip([1, 2, 3], [10, 20])` nechta juftlik beradi?', 'Pairs yielded by `zip([1, 2, 3], [10, 20])`?', ['3', '2', '1', 'Error'], ['3', '2', '1', 'Error'], 1, 'Eng qisqa ro‘yxat uzunligicha (2 ta).', 'Stops at shortest sequence (2).'),
      q('q0412_3', 'Bitta unpacking qatorida nechta `*` ishlatish mumkin?', 'Max starred targets per assignment?', ['1', '2', 'Cheksiz', '0'], ['1', '2', 'Unlimited', '0'], 0, 'Faqat 1 ta.', 'At most 1.'),
      q('q0412_4', '`a, b = [1]` qanday xato beradi?', 'Error on `a, b = [1]`?', ['IndexError', 'TypeError', 'ValueError', 'KeyError'], ['IndexError', 'TypeError', 'ValueError', 'KeyError'], 2, '`ValueError: not enough values to unpack`.', '`ValueError`.'),
      q('q0412_5', 'Qiymat tashlab yuborish uchun odatda qaysi nom qo‘yiladi?', 'Conventional throwaway variable name?', ['$', '_', 'null', 'skip'], ['$', '_', 'null', 'skip'], 1, '`_` belgisi.', 'Underscore `_`.'),
    ],
    homework: hw('CSV Jadval Satrlarini Unpacking Bilan Tahlil', 'Unpack CSV Row Tuples', 'Talabalar `(ism, guruh, *ballar)` tuple laridan har bir talabaning o‘rtacha ballini unpacking yordamida hisoblang.', 'Use `name, group, *scores = row` unpacking to calculate averages for student records.', ['Starred *scores unpacking ishlating', 'zip() yoki enumerate() qo‘llang'], ['Use *scores unpacking', 'Include enumerate()'], 'for name, group, *scores in rows:', 'Unpack variable-length scores.', 'Eng yuqori o‘rtacha ball olgan guruhni aniqlang.', 'Report top student.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-04-13',
    courseId: 'data_structures',
    moduleId: 'c04_m5',
    order: 13,
    titleUz: 'List Comprehension — ixcham va Pythonic kod',
    titleEn: 'List, Dict & Set Comprehensions',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-04-12'],
    conceptId: 'comprehensions',
    whyUz: "5 qatorli bo‘sh list ochib `.append()` qiladigan sikl o‘rniga bitta ravon qator yozish Python'ning eng mashhur va tezkor xususiyatlaridan biridir.",
    whyEn: 'Comprehensions express filtering and mapping transformations in a single readable, C-speed Python expression.',
    analogyUz: "Comprehension — bu avtomatik konveyer: xom mahsulot kiradi (`for x in items`), sifat nazoratidan o‘tadi (`if x > 0`), qayta ishlanadi (`x * 2`) va tayyor qutiga tushadi (`[...]`).",
    analogyEn: 'A comprehension is a compact assembly line: feed items in, filter quality, transform each item, and pack into a list/dict/set.',
    stopsUz: "Comprehension faqat **yangi kolleksiya yaratish** uchun! Agar siz faqat `print()` qilish uchun `[print(x) for x in items]` yozsangiz, xotirada keraksiz `[None, None, ...]` ro‘yxati hosil bo‘ladi — buning uchun oddiy `for` yozing!",
    stopsEn: 'Never use a comprehension solely for side effects like `print()`—that allocates a useless list of `None`s.',
    objUz: ['`[expr for x in iter if cond]` sintaksisini yozish', 'Ternary (`a if cond else b`) + comprehension farqini bilish', 'Dict `{k: v ...}` va Set `{x ...}` comprehension larni qo‘llash'],
    objEn: ['Write list comprehensions with transformation and filtering', 'Distinguish filter `if` (right) from ternary `if/else` (left)', 'Build dict and set comprehensions cleanly'],
    theoryUz: `### 1. List Comprehension Sintaksisi
\`[transform for item in iterable if condition]\`. Misol: \`evens_sq = [x ** 2 for x in range(10) if x % 2 == 0]\`.
### 2. \`if\` O‘ngda vs \`if/else\` Chapda!
- Filtrlash (o‘ngda): \`[x for x in nums if x > 0]\`
- Almashtirish / Ternary (chapda): \`[x if x > 0 else 0 for x in nums]\`
### 3. Dict va Set Comprehensions
- Dict: \`{w: len(w) for w in words}\`
- Set: \`{w.lower() for w in tags}\`
### 4. O‘qilishi (Readability) Chegarasi
2 tadan ko‘p ichma-ich \`for\` yoki murakkab mantiq bo‘lsa, oddiy \`for\` sikli yozing — kod o‘qilishi birinchi o‘rinda!
### 5. Keng tarqalgan xato
Side-effect uchun list comprehension ishlatish (\`[items.append(x) for x in ...]\`).`,
    theoryEn: `### 1. Basic List Comprehension
\`[expr for x in seq if pred]\`.
### 2. Filter \`if\` vs Conditional Expression \`if/else\`
Filter goes on the right; value mapping \`a if c else b\` goes on the left.
### 3. Dict and Set Comprehensions
\`{k: f(k) for k in keys}\` and \`{f(x) for x in items}\`.
### 4. Readability Limit
Avoid chaining more than two \`for\` clauses—drop back to a clear \`for\` loop.
### 5. Anti-Pattern: Side Effects
Do not build throwaway lists of \`None\` via \`[print(x) for x in seq]\`.`,
    examples: [
      ex('Misol 1: Filtrlash va transformatsiya', 'Example 1: Filter & Square', `nums = [-2, 1, 2, 3, 4]\npos_sq = [x ** 2 for x in nums if x > 0]\nprint(pos_sq)`, `[1, 4, 9, 16]`, 'Faqat musbat sonlarning kvadrati olindi.', 'Filtered positives and squared them in one line.'),
      ex('Misol 2: Chapda `if/else` bilan qiymat almashtirish', 'Example 2: Conditional Mapping', `raw = [10, -5, 3, -1]\nclamped = [x if x >= 0 else 0 for x in raw]\nprint(clamped)`, `[10, 0, 3, 0]`, 'Manfiy sonlar `0` ga almashtirildi.', 'Clamped negative numbers to zero.'),
      ex('Misol 3: Dict va Set comprehension', 'Example 3: Dict & Set Comprehensions', `words = ["Python", "SQL", "python"]\nunique_lower = sorted({w.lower() for w in words})\nlengths = {w: len(w) for w in unique_lower}\nprint(lengths)`, `{'python': 6, 'sql': 3}`, 'Set dublikatlarni tozaladi, dict esa uzunlik xaritasini tuzdi.', 'Deduplicated with a set comprehension and mapped lengths with a dict comprehension.'),
    ],
    traceTitleUz: 'Comprehension bajarilish tartibi',
    traceTitleEn: 'Tracing Comprehension Execution',
    traceCode: `res = [x * 10 for x in [1, 2, 3] if x != 2]\nprint(res)`,
    traceSteps: [
      traceStep(1, 'x = 1, 1 != 2 -> True', '[10]', '1 * 10 qo‘shildi', 'Added 10'),
      traceStep(2, 'x = 2, 2 != 2 -> False', '[10]', 'O‘tkazib yuborildi', 'Skipped 2'),
      traceStep(3, 'x = 3, 3 != 2 -> True', '[10, 30]', '3 * 10 qo‘shildi', 'Added 30'),
      traceStep(4, 'print(res)', '[10, 30]', 'Natija chiqdi', 'Printed', '[10, 30]'),
    ],
    commonMistakes: [
      mistake('`if/else` ni comprehension oxiriga yozish', 'SyntaxError Putting else on Right', `res = [x for x in [1, -1] if x > 0 else 0]`, 'SyntaxError: invalid syntax', `res = [x if x > 0 else 0 for x in [1, -1]]\nprint(res)`, '`else` qismi bo‘lsa u chapdagi qiymat tanlash (ternary) qismiga o‘tishi shart.', '`if/else` is a ternary expression placed before `for`.', 'Faqat filtr bo‘lsa o‘ngda `if`, almashtirish bo‘lsa chapda `if/else`.', 'Filter `if` goes right; ternary `if/else` goes left.'),
      mistake('Side-effect uchun comprehension ishlatish', 'Using Comprehension for print()', `_ = [print(i) for i in [1, 2]]`, 'Allocates unused [None, None] list', `for i in [1, 2]:\n    print(i)`, 'Yig‘iladigan natija kerak bo‘lmaganda oddiy `for` yozing.', 'Comprehensions are for constructing collections, not running print loops.', 'Faqat yangi list/dict/set yasashda qo‘llang.', 'Use standard `for` loops for side effects.'),
    ],
    compareTitleUz: '`for` + `.append()` vs List Comprehension',
    compareTitleEn: '`for` + `.append()` vs List Comprehension',
    compareUz: ['`for` + `.append()`: bir necha qadamli murakkab mantiq va side-effect lar uchun.', 'List comprehension: bitta aniq transformatsiya + filtr uchun qisqa va tezroq.'],
    compareEn: ['`for` loop: complex multi-step logic or side effects.', 'Comprehension: cleaner and faster for single map/filter pipelines.'],
    compareSummaryUz: 'Oddiy filtr/xaritalashda comprehension, murakkab ko‘p qadamli logikada `for` ishlating.',
    compareSummaryEn: 'Use comprehensions for concise map/filter expressions and loops for multi-step logic.',
    practiceTasks: [
      pt('p0413_1', '1-mashq: Kvadratlar', 'Task 1: Squares', '1 dan 5 gacha kvadratlar ro‘yxatini comprehension bilan chiqaring.', 'List squares 1..5.', `print([x ** 2 for x in range(1, 6)])`, '[1, 4, 9, 16, 25]', 'range(1, 6)', 'Square each x.'),
      pt('p0413_2', '2-mashq: Juft sonlar filtri', 'Task 2: Filter Evens', '`[1, 2, 3, 4, 5, 6]` dan juftlarini ajrating.', 'Filter even numbers.', `print([x for x in [1, 2, 3, 4, 5, 6] if x % 2 == 0])`, '[2, 4, 6]', 'if x % 2 == 0', 'Filter mod 2.'),
      pt('p0413_3', '3-mashq: Chapda `if/else`', 'Task 3: Map Labels', '`[1, 2, 3]` ni `"even"`/`"odd"` ga aylantiring.', 'Map 1..3 to odd/even strings.', `print(["even" if x % 2 == 0 else "odd" for x in [1, 2, 3]])`, "['odd', 'even', 'odd']", 'Ternary goes left of for.', 'Use if/else on left.'),
      pt('p0413_4', '4-mashq: Dict comprehension', 'Task 4: Dict Comp', '`{x: x * 2 for x in [1, 2, 3]}` ni chiqaring.', 'Build double dict.', `print({x: x * 2 for x in [1, 2, 3]})`, '{1: 2, 2: 4, 3: 6}', '{k: v for ...}', 'Use dict comprehension.'),
      pt('p0413_5', '5-mashq: Matn tozalash', 'Task 5: Strip Words', '`[" a ", " B "]` ni strip+lower qiling.', 'Strip and lowercase list.', `print([s.strip().lower() for s in [" a ", " B "]])`, "['a', 'b']", 's.strip().lower()', 'Chain methods.'),
    ],
    quiz: [
      q('q0413_1', '`[x for x in range(5) if x > 2]` natijasi?', 'Output of `[x for x in range(5) if x > 2]`?', ['[2, 3, 4]', '[3, 4]', '[0, 1, 2]', '[3, 4, 5]'], ['[2, 3, 4]', '[3, 4]', '[0, 1, 2]', '[3, 4, 5]'], 1, '3 va 4.', '`[3, 4]`.'),
      q('q0413_2', 'Comprehension da `if/else` qayerda yoziladi?', 'Where does `if/else` go in a comprehension?', ['Oxirida', 'for dan chapda (ifoda qismida)', 'Qavsdan tashqarida', 'Yozib bo‘lmaydi'], ['At the end', 'Left of `for`', 'Outside brackets', 'Forbidden'], 1, '`for` dan chapda.', 'Left of `for`.'),
      q('q0413_3', '`{x % 2 for x in [1, 2, 3, 4]}` qanday tuzilma yaratadi?', 'What type does `{x % 2 for x in [1, 2, 3, 4]}` create?', ['dict', 'list', 'set', 'tuple'], ['dict', 'list', 'set', 'tuple'], 2, 'Ikki nuqta `:` bo‘lmagani uchun `set` (`{0, 1}`).', 'Set `{0, 1}`.'),
      q('q0413_4', '`[print(x) for x in [1, 2]]` ning qaytargan ro‘yxati?', 'List produced by `[print(x) for x in [1, 2]]`?', ['[1, 2]', '[None, None]', '[]', 'Error'], ['[1, 2]', '[None, None]', '[]', 'Error'], 1, '`print()` `None` qaytargani uchun `[None, None]`.', '`[None, None]`.'),
      q('q0413_5', 'Dict comprehension kalit-qiymatni nima bilan ajratadi?', 'Separator in dict comprehension?', ['=', ':', '->', ','], ['=', ':', '->', ','], 1, 'Ikki nuqta `:` bilan.', 'Colon `:`.'),
    ],
    homework: hw('Narxlar va Chegirmalar Transformatori', 'Price & Discount Transformer', 'Mahsulot narxlari lug‘atidan 100 dan katta bo‘lganlariga 15% chegirma qo‘llab, yangi dict ni bitta dict comprehension bilan hosil qiling.', 'Use a dict comprehension to apply a 15% discount to items priced over 100.', ['Dict comprehension ishlatish', 'Natijani round(..., 2) bilan yaxlitlash'], ['Use dict comprehension', 'Round values to 2 decimals'], '{k: round(v * 0.85, 2) for k, v in prices.items() if v > 100}', 'Filter > 100 and multiply 0.85.', 'Chegirilgan umumiy summani ham chiqaring.', 'Compute total savings.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-04-14',
    courseId: 'data_structures',
    moduleId: 'c04_m5',
    order: 14,
    titleUz: 'Ma’lumotlarni saralash (`sorted`, `key=`) va qidirish',
    titleEn: 'Sorting (`sorted`, `key=`) & Searching Collections',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-04-13'],
    conceptId: 'sorting_searching',
    whyUz: "Har qanday do‘kon katalogi (narx bo‘yicha), reyting jadvali (ball bo‘yicha) va qidiruv tizimi Python'ning Timsort (`sorted(..., key=...)`) mexanizmiga tayanadi.",
    whyEn: 'Every leaderboard, product catalog, and ranked feed relies on Python’s Timsort (`sorted(..., key=...)`) and efficient search.',
    analogyUz: "`key=` parametri — bu saralash ustasiga berilgan mezon kartasi: u foydalanuvchilarning o‘zini o‘zgartirmaydi, faqat \"har birining `ball` qiymatiga qarab tizib ber\" deb aytadi.",
    analogyEn: 'The `key=` function tells the sorter which attribute to measure without altering the items themselves.',
    stopsUz: "Python'ning `sorted()` funksiyasi **Timsort** algoritmidan foydalanadi (`O(n log n)` va **stable** — teng elementlarning asl tartibini buzmaydi). `dict` lar to‘g‘ridan-to‘g‘ri `<` bilan solishtirilmaydi (`TypeError`), shuning uchun `key=lambda u: u['score']` shart!",
    stopsEn: 'Python’s Timsort is O(n log n) and stable; dicts cannot be compared with `<` directly so always pass `key=lambda x: ...`.',
    objUz: ['`sorted(iter, key=..., reverse=...)` va `.sort()` farqini amalda qo‘llash', 'Tuple/Dict larni ko‘p mezonli (`key=lambda x: (-x["score"], x["name"])`) saralash', '`in`, `.index()`, `any()`, `all()` bilan tez qidiruv va tekshiruv yozish'],
    objEn: ['Sort lists of dicts and tuples via `key=` functions', 'Use multi-criteria sorting and `reverse=True`', 'Search cleanly using `in`, `any()`, `all()`, and `min/max(..., key=...)`'],
    theoryUz: `### 1. \`sorted()\` vs \`.sort()\`
- \`new = sorted(items)\` — asl ro‘yxatga tegmaydi, istalgan iterable ni (tuple, dict, set) saralab **yangi list** qaytaradi.
- \`items.sort()\` — faqat \`list\` da bor, **joyida** o‘zgartiradi va \`None\` qaytaradi.
### 2. \`key=\` Parametri
\`sorted(words, key=len)\` — uzunlik bo‘yicha; \`sorted(words, key=str.lower)\` — harf registridan qatʼiy nazar.
### 3. Dict ro‘yxatini va Ko‘p Mezonli Saralash
\`sorted(users, key=lambda u: (-u["score"], u["name"]))\` — avval ball bo‘yicha kamayish, teng bo‘lsa ism bo‘yicha alifbo tartibida!
### 4. \`min()\` / \`max()\` ham \`key=\` oladi!
\`best = max(users, key=lambda u: u["score"])\`.
### 5. Qidirish va \`any()\` / \`all()\`
\`any(u["score"] >= 90 for u in users)\` birinchi mos kelganida darrov to‘xtaydi (short-circuit).`,
    theoryEn: `### 1. \`sorted()\` vs \`.sort()\`
\`sorted()\` works on any iterable and returns a new list; \`.sort()\` mutates a list in place.
### 2. Custom \`key=\` Functions
\`sorted(words, key=len)\` or \`key=str.lower\`.
### 3. Multi-Criteria Dict Sorting
Return a tuple from \`key=\`: \`key=lambda u: (-u["score"], u["name"])\`.
### 4. \`min(..., key=)\` & \`max(..., key=)\`
Find the extremum record directly without full sorting (O(n)).
### 5. Searching with \`any()\` & \`all()\`
Short-circuiting predicate checks across iterables.`,
    examples: [
      ex('Misol 1: Ko‘p mezonli saralash', 'Example 1: Multi-Key Sorting', `students = [\n    {"name": "Zarina", "score": 90},\n    {"name": "Ali", "score": 90},\n    {"name": "Bek", "score": 95},\n]\nranked = sorted(students, key=lambda s: (-s["score"], s["name"]))\nfor s in ranked:\n    print(s["name"], s["score"])`, `Bek 95\nAli 90\nZarina 90`, 'Avval ball kamayish (`-score`), teng bo‘lganda ism alifbosi bo‘yicha saralandi.', 'Sorted by descending score then ascending name.'),
      ex('Misol 2: `max(..., key=)` va `any()`', 'Example 2: max(key=) & any()', `items = [{"id": 1, "price": 40}, {"id": 2, "price": 120}, {"id": 3, "price": 80}]\npriciest = max(items, key=lambda i: i["price"])\nhas_cheap = any(i["price"] < 50 for i in items)\nprint("Max ID:", priciest["id"], "| Cheap exists:", has_cheap)`, `Max ID: 2 | Cheap exists: True`, '`max(key=)` eng qimmat yozuvni O(n) da topdi.', 'Found max record in O(n) and checked threshold with `any()`.'),
      ex('Misol 3: `sorted(scores.items(), key=...)`', 'Example 3: Sorting Dict by Value', `counts = {"b": 2, "a": 5, "c": 1}\ntop = sorted(counts.items(), key=lambda kv: kv[1], reverse=True)\nprint(top)`, `[('a', 5), ('b', 2), ('c', 1)]`, 'Lug‘atni qiymat bo‘yicha saralash uchun `.items()` ga `kv[1]` berildi.', 'Sorted dictionary entries descending by value.'),
    ],
    traceTitleUz: '`sorted()` key funksiyasi izi',
    traceTitleEn: 'Tracing sorted(key=len)',
    traceCode: `words = ["python", "go", "rust"]\nprint(sorted(words, key=len))`,
    traceSteps: [
      traceStep(1, 'len("python")=6, len("go")=2, len("rust")=4', 'keys: 6, 2, 4', 'Kalit qiymatlari olindi', 'Computed key lengths'),
      traceStep(2, 'sort by keys: 2 < 4 < 6', '["go", "rust", "python"]', 'Kalitlar tartiblandi', 'Ordered by length'),
      traceStep(3, 'print(...)', "['go', 'rust', 'python']", 'Asl so‘zlar chiqdi', 'Printed sorted words', "['go', 'rust', 'python']"),
    ],
    commonMistakes: [
      mistake('`res = arr.sort()` dan `None` olish', 'Assigning Return Value of .sort()', `a = [3, 1, 2]\nb = a.sort()\nprint(b)`, 'Prints None instead of [1, 2, 3]', `a = [3, 1, 2]\nb = sorted(a)\nprint(b)`, '`.sort()` joyida ishlaydi va `None` qaytaradi.', '`.sort()` returns `None`.', 'Yangi ro‘yxat kerak bo‘lsa `sorted(a)` ishlating.', 'Use `sorted(a)` when assigning a new variable.'),
      mistake('`dict` larni `key=` siz saralashga urinish', 'Sorting Dicts Without key=', `sorted([{"a": 2}, {"a": 1}])`, "TypeError: '<' not supported between instances of 'dict' and 'dict'", `print(sorted([{"a": 2}, {"a": 1}], key=lambda d: d["a"]))`, 'Python qaysi maydon bo‘yicha solishtirishni bilmaydi.', 'Dicts lack a default `<` comparison.', 'Har doim `key=lambda d: d[...]` bering.', 'Provide a `key=` function.'),
    ],
    compareTitleUz: '`sorted()` vs `.sort()`',
    compareTitleEn: '`sorted()` vs `.sort()`',
    compareUz: ['`sorted()`: istalgan iterable uchun, asl ma’lumotni saqlab yangi list qaytaradi.', '`.sort()`: faqat `list` uchun, joyida o‘zgartirib xotirani tejaydi.'],
    compareEn: ['`sorted()`: works on any iterable, preserves original.', '`.sort()`: list-only in-place sort.'],
    compareSummaryUz: 'Asl tartibni saqlash kerak bo‘lganda `sorted()`, joyida saralashda `.sort()` ishlating.',
    compareSummaryEn: 'Use `sorted()` unless intentionally mutating an existing list in place.',
    practiceTasks: [
      pt('p0414_1', '1-mashq: Kamayish tartibi', 'Task 1: Descending Sort', '`[4, 1, 9, 2]` ni kamayish tartibida `sorted()` bilan chiqaring.', 'Sort descending.', `print(sorted([4, 1, 9, 2], reverse=True))`, '[9, 4, 2, 1]', 'reverse=True', 'Pass reverse=True.'),
      pt('p0414_2', '2-mashq: Uzunlik bo‘yicha', 'Task 2: Sort by Length', '`["banana", "fig", "apple"]` ni uzunligi bo‘yicha saralang.', 'Sort by string length.', `print(sorted(["banana", "fig", "apple"], key=len))`, "['fig', 'apple', 'banana']", 'key=len', 'Pass key=len.'),
      pt('p0414_3', '3-mashq: Dict ro‘yxatidan max', 'Task 3: Max Dict Record', '`[{"n": "A", "p": 5}, {"n": "B", "p": 12}]` dan max `"n"` ni chiqaring.', 'Print name of max price item.', `items = [{"n": "A", "p": 5}, {"n": "B", "p": 12}]\nprint(max(items, key=lambda x: x["p"])["n"])`, 'B', 'max(items, key=...)', 'Use key lambda.'),
      pt('p0414_4', '4-mashq: `all()` tekshiruvi', 'Task 4: all() Check', '`[80, 90, 75]` hammasi `>= 70` ekanini `all()` bilan chiqaring.', 'Check all >= 70.', `print(all(s >= 70 for s in [80, 90, 75]))`, 'True', 'all(s >= 70 for s in ...)', 'Use all().'),
      pt('p0414_5', '5-mashq: Registrsiz saralash', 'Task 5: Case-Insensitive Sort', '`["b", "A", "c"]` ni `key=str.lower` bilan saralang.', 'Sort case-insensitively.', `print(sorted(["b", "A", "c"], key=str.lower))`, "['A', 'b', 'c']", 'key=str.lower', 'Pass str.lower.'),
    ],
    quiz: [
      q('q0414_1', 'Python `sorted()` qaysi algoritmdan foydalanadi?', 'Algorithm used by Python `sorted()`?', ['Bubble Sort', 'Timsort', 'Selection Sort', 'Bogosort'], ['Bubble Sort', 'Timsort', 'Selection Sort', 'Bogosort'], 1, 'Timsort (Merge + Insertion gibridi, O(n log n)).', 'Timsort.'),
      q('q0414_2', '`.sort()` metodi nimani qaytaradi?', 'Return value of `list.sort()`?', ['Saralangan list', 'None', 'True', 'Tuple'], ['Sorted list', 'None', 'True', 'Tuple'], 1, '`None` qaytaradi.', 'Returns `None`.'),
      q('q0414_3', 'Eng qimmat dict ni saralamasdan O(n) da topish funksiyasi?', 'Find highest record in O(n) without sorting?', ['sorted()[0]', 'max(items, key=...)', 'any()', 'zip()'], ['sorted()[0]', 'max(items, key=...)', 'any()', 'zip()'], 1, '`max(items, key=...)`.', '`max(items, key=...)`.'),
      q('q0414_4', '`key=lambda x: (-x["score"], x["name"])` nimani bildiradi?', 'Meaning of `(-x["score"], x["name"])`?', ['Ikkalasi o‘sish', 'Ball kamayish, ism o‘sish', 'Ball o‘sish, ism kamayish', 'Xato beradi'], ['Both ascending', 'Score desc, name asc', 'Score asc, name desc', 'Error'], 1, 'Manfiy ishora sonni kamayish tartibida saralaydi.', 'Negating score reverses numeric order.'),
      q('q0414_5', '`all([])` ning natijasi nima?', 'What is `all([])` in Python?', ['False', 'True', 'None', 'Error'], ['False', 'True', 'None', 'Error'], 1, 'Bo‘sh ketma-ketlikda qarshi misol yo‘qligi uchun `True` (vacuous truth).', 'Vacuously `True`.'),
    ],
    homework: hw('E-Tijorat Katalogini Ko‘p Mezonli Saralash', 'E-Commerce Catalog Sorter', 'Kamida 5 ta mahsulot (`name`, `rating`, `price`) ro‘yxatini yarating: avval `rating` kamayishi, teng bo‘lganda `price` o‘sishi bo‘yicha tartiblang va eng yaxshi mahsulotni `max()` bilan ko‘rsating.', 'Sort 5 products by descending rating then ascending price, and find the top-rated item via `max()`.', ['sorted(..., key=lambda ...)', 'Kamida 2 ta bir xil ratingli mahsulot bo‘lsin'], ['Use multi-key sorted', 'Include tied ratings'], 'key=lambda p: (-p["rating"], p["price"])', 'Tuple key handles tie-breakers.', 'Faqat zaxirada (`in_stock=True`) bo‘lganlarini filtrlab saralang.', 'Filter in-stock items first.', 25),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),
];
