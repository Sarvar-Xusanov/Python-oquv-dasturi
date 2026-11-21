import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C04_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-04-01',
    courseId: 'data_structures',
    moduleId: 'c04_m1',
    order: 1,
    titleUz: 'List bilan ishlash — tartibli ro‘yxatlar',
    titleEn: 'Working with Lists: Creation, Indexing & Mutability',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-03-10'],
    conceptId: 'lists_basics',
    whyUz: "Dasturlashda bitta emas, yuzlab foydalanuvchilar, mahsulotlar yoki ballarni saqlash kerak bo'ladi. Python `list` — eng ko'p ishlatiladigan dinamik ro'yxat tuzilmasidir.",
    whyEn: 'Real programs process collections of users, prices, and records. Python `list` is the foundational dynamic ordered sequence.',
    analogyUz: "`list` — bu poyezd vagonlari: har bir vagonning raqami (indeksi `0, 1, 2...`) bor, yangi vagon ulash yoki ichidagi yukni almashtirish (`mutable`) mumkin.",
    analogyEn: 'A `list` is a train of numbered cars (`0, 1, 2...`) where you can swap cargo in place or attach/detach cars.',
    stopsUz: "Ro'yxatning oxiriga element qo'shish (`.append()`) O(1) juda tez, lekin boshiga qo'shish (`.insert(0, x)`) barcha elementlarni surishi uchun sekinroq O(n)!",
    stopsEn: 'Appending to the end is O(1) amortized, while inserting/popping at index 0 shifts all items in O(n).',
    objUz: ['Ro‘yxat yaratish, musbat/manfiy indekslash va elementni joyida o‘zgartirish', '`len()`, `in`, `min()`, `max()`, `sum()` funksiyalarini qo‘llash', 'Ro‘yxatga nusxa olish (`.copy()`) va reference aliasing farqini bilish'],
    objEn: ['Create, index, and mutate lists in place', 'Apply `len()`, `in`, `min()`, `max()`, and `sum()`', 'Avoid accidental aliasing by copying with `.copy()`'],
    theoryUz: `### 1. List nima?
Tartiblangan va o‘zgartiriladigan (mutable) kolleksiya: \`skills = ["Python", "SQL", "FastAPI"]\`.
### 2. Indekslash va Joyida O‘zgartirish
\`skills[0] = "Go"\` — stringdan farqli o‘laroq, list elementini to‘g‘ridan-to‘g‘ri o‘zgartirish mumkin!
### 3. Foydali o‘rnatilgan funksiyalar
\`len(nums)\`, \`sum(nums)\`, \`min(nums)\`, \`max(nums)\`, \`val in nums\`.
### 4. Reference Aliasing tuzog‘i!
\`b = a\` yangi ro‘yxat yaratmaydi — ikkalasi bitta ro‘yxatga ishora qiladi! Mustaqil nusxa uchun \`b = a.copy()\` yozing.
### 5. Keng tarqalgan xato
\`nums[len(nums)]\` -> **IndexError** (oxirgi indeks \`len(nums) - 1\` yoki \`-1\`).`,
    theoryEn: `### 1. What Is a List?
Ordered, mutable, dynamic array supporting mixed types.
### 2. Indexing & In-Place Mutation
\`items[0] = "New"\` mutates directly.
### 3. Built-in Helpers
\`len()\`, \`sum()\`, \`min()\`, \`max()\`, \`in\`.
### 4. Aliasing vs Copying
\`b = a\` creates an alias; \`b = a.copy()\` creates a shallow copy.
### 5. Off-by-One Trap
Last valid index is \`len(a) - 1\` (or \`-1\`).`,
    examples: [
      ex('Misol 1: Indekslash, o‘zgartirish va statistika', 'Example 1: Indexing, Mutating & Stats', `scores = [78, 92, 85, 90]\nscores[0] = 88\nprint("Updated:", scores)\nprint("Max:", max(scores), "Avg:", sum(scores) / len(scores))`, `Updated: [88, 92, 85, 90]\nMax: 92 Avg: 88.75`, 'List mutable bo‘lgani uchun `scores[0]` joyida yangilandi.', 'Mutated index 0 directly and computed built-in aggregates.'),
      ex('Misol 2: Alias vs `.copy()`', 'Example 2: Reference Alias vs .copy()', `a = [1, 2]\nb = a\nc = a.copy()\nb.append(3)\nprint("a:", a, "| c:", c)`, `a: [1, 2, 3] | c: [1, 2]`, '`b` ni o‘zgartirish `a` ga taʼsir qildi, lekin `.copy()` qilingan `c` mustaqil qoldi.', '`b = a` shares the list, whereas `.copy()` isolates `c`.'),
      ex('Misol 3: Dinamik o‘sish va tekshiruv', 'Example 3: Membership & Bounds', `langs = ["Python", "SQL"]\nprint("Has SQL:", "SQL" in langs)\nprint("Last:", langs[-1])`, `Has SQL: True\nLast: SQL`, '`in` operatori element bor-yo‘qligini tekshiradi.', 'Check membership with `in` and end item via `-1`.'),
    ],
    traceTitleUz: 'List mutatsiyasi izi',
    traceTitleEn: 'Tracing List Mutation',
    traceCode: `a = [10, 20]\nb = a\nb[1] = 99\nprint(a)`,
    traceSteps: [
      traceStep(1, 'a = [10, 20]', 'a->[10,20]', 'Ro‘yxat yaratildi', 'List allocated'),
      traceStep(2, 'b = a', 'a,b->[10,20]', 'Ikkala yorliq bir listga bog‘landi', 'Aliased'),
      traceStep(3, 'b[1] = 99', '[10, 99]', 'Joyida yangilandi', 'Mutated index 1'),
      traceStep(4, 'print(a)', '[10, 99]', 'a ham o‘zgardi', 'Output reflects mutation', '[10, 99]'),
    ],
    commonMistakes: [
      mistake('`b = a` bilan nusxa oldim deb o‘ylash', 'Mutating Shared List Alias', `orig = [1, 2]\ncopy_bug = orig\ncopy_bug.append(99)\nprint(orig)`, 'Unexpectedly prints [1, 2, 99]', `orig = [1, 2]\nsafe_copy = orig.copy()\nsafe_copy.append(99)\nprint(orig)`, '`=` faqat havolani nusxalaydi.', 'Assignment shares references.', '`.copy()` yoki `list(orig)` ishlating.', 'Use `.copy()`.'),
      mistake('`IndexError` chegaradan chiqish', 'Off-by-One Indexing', `arr = [5, 6]\nprint(arr[2])`, 'IndexError: list index out of range', `arr = [5, 6]\nprint(arr[-1])`, '2 ta elementli ro‘yxatda indekslar 0 va 1.', 'Indices for length 2 are 0 and 1.', 'Oxirgi element uchun `[-1]` ishlating.', 'Use `[-1]` for last element.'),
    ],
    compareTitleUz: '`b = a` vs `b = a.copy()`',
    compareTitleEn: '`b = a` vs `b = a.copy()`',
    compareUz: ['`b = a`: xotirani tejaydi, lekin o‘zgarish ikkalasiga taʼsir qiladi.', '`b = a.copy()`: mustaqil nusxa kerak bo‘lganda majburiy.'],
    compareEn: ['`b = a`: zero memory copy, shared mutation.', '`b = a.copy()`: independent top-level list copy.'],
    compareSummaryUz: 'Ro‘yxatni o‘zgartirishdan oldin mustaqillik kerak bo‘lsa doim `.copy()` oling.',
    compareSummaryEn: 'Call `.copy()` whenever modifying a list without affecting the caller.',
    practiceTasks: [
      pt('p0401_1', '1-mashq: Element yangilash', 'Task 1: Mutate Element', '`nums = [1, 2, 3]` da o‘rtasini `20` ga almashtirib chiqaring.', 'Replace middle element with 20.', `nums = [1, 2, 3]\nnums[1] = 20\nprint(nums)`, '[1, 20, 3]', 'nums[1] = 20.', 'Assign index 1.'),
      pt('p0401_2', '2-mashq: Min va Max', 'Task 2: Min & Max', '`[4, 9, 1, 7]` ning min va max yig‘indisini chiqaring.', 'Print min + max.', `a = [4, 9, 1, 7]\nprint(min(a) + max(a))`, '10', 'min(a) + max(a).', 'Use min and max.'),
      pt('p0401_3', '3-mashq: Xavfsiz nusxa', 'Task 3: Safe Copy', '`a = [1, 2]` dan `.copy()` olib `3` qo‘shing va `a` ni chiqaring.', 'Copy a, append 3 to copy, print original a.', `a = [1, 2]\nb = a.copy()\nb.append(3)\nprint(a)`, '[1, 2]', 'a.copy().', 'Use .copy().'),
      pt('p0401_4', '4-mashq: in tekshiruvi', 'Task 4: Membership', '`"Py" in ["JS", "Py", "Go"]` ni chiqaring.', 'Check membership.', `print("Py" in ["JS", "Py", "Go"])`, 'True', 'in.', 'Use in.'),
      pt('p0401_5', '5-mashq: Oxirgi element', 'Task 5: Last Item', '`[10, 20, 30, 40]` ning oxirgi elementini `[-1]` bilan chiqaring.', 'Print last item.', `print([10, 20, 30, 40][-1])`, '40', '[-1].', 'Use [-1].'),
    ],
    quiz: [
      q('q0401_1', 'List qaysi qavs bilan yaratiladi?', 'Brackets used for a Python list?', ['()', '[]', '{}', '<>'], ['()', '[]', '{}', '<>'], 1, '`[]`.', '`[]`.'),
      q('q0401_2', '`a = [1]; b = a; b.append(2); print(a)` nima chiqaradi?', 'Output of `a = [1]; b = a; b.append(2); print(a)`?', ['[1]', '[1, 2]', '[2]', 'Error'], ['[1]', '[1, 2]', '[2]', 'Error'], 1, 'Aliasing tufayli `[1, 2]`.', '`[1, 2]`.'),
      q('q0401_3', 'Ro‘yxat uzunligi `n` bo‘lsa oxirgi musbat indeks?', 'Last positive index of length-n list?', ['n', 'n - 1', 'n + 1', '0'], ['n', 'n - 1', 'n + 1', '0'], 1, '`n - 1`.', '`n - 1`.'),
      q('q0401_4', 'Mustaqil nusxa olish metodi?', 'Method creating a shallow copy?', ['.clone()', '.copy()', '.dup()', '.mirror()'], ['.clone()', '.copy()', '.dup()', '.mirror()'], 1, '`.copy()`.', '`.copy()`.'),
      q('q0401_5', 'List mutable mi?', 'Are Python lists mutable?', ['Ha', 'Yo‘q', 'Faqat raqamlarda', 'Faqat bo‘shda'], ['Yes', 'No', 'Numbers only', 'Empty only'], 0, 'Ha, mutable.', 'Yes.'),
    ],
    homework: hw('Haftalik Harorat Analizatori', 'Weekly Temperature Analyzer', '7 kunlik harorat ro‘yxati ustida eng issiq, eng sovuq, o‘rtacha harorat va 30+ issiq kunlar sonini hisoblovchi dastur yozing.', 'Analyze 7 daily temperatures computing min, max, mean, and days >= 30.', ['Built-in min/max/sum ishlating', 'Asl ro‘yxatni o‘zgartirmang'], ['Use min/max/sum', 'Keep original list intact'], 'avg = round(sum(temps) / len(temps), 1)', 'Compute average cleanly.', 'Eng issiq kun indeksini (`index`) ham toping.', 'Print index of hottest day.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-04-02',
    courseId: 'data_structures',
    moduleId: 'c04_m1',
    order: 2,
    titleUz: 'List Methods — ro‘yxat metodlari',
    titleEn: 'Essential List Methods: append, extend, insert, pop & sort',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-04-01'],
    conceptId: 'list_methods',
    whyUz: "Ro'yxatga yangi element qo'shish, navbatdan olib tashlash, element sonini sanash va joyida saralash kundalik backend va ma'lumotlar bilan ishlashning asosidir.",
    whyEn: 'Mutating methods—`append`, `extend`, `pop`, `remove`, `sort`, `reverse`—drive queues, stacks, and data pipelines.',
    analogyUz: "`append([4, 5])` bu yuk mashinasiga butun qutini bir butun element qilib ortish (`[1, 2, [4, 5]]`); `extend([4, 5])` esa qutini ochib ichidagi narsalarni alohida-alohida qo'shish (`[1, 2, 4, 5]`).",
    analogyEn: '`.append([4, 5])` puts a sealed box inside the list; `.extend([4, 5])` unpacks each item directly into the list.',
    stopsUz: "`.append()`, `.sort()`, `.reverse()` metodlari JOYIDA (in-place) o'zgartiradi va `None` qaytaradi! Shuning uchun `x = nums.sort()` yozsangiz `x` `None` bo'lib qoladi!",
    stopsEn: 'In-place mutators like `.append()`, `.sort()`, and `.reverse()` return `None`—never assign `nums = nums.sort()`.',
    objUz: ['`.append()`, `.extend()`, `.insert()`, `.pop()`, `.remove()` metodlarini aniq qo‘llash', '`.sort()` (returns None) vs `sorted()` (returns new list) farqini bilish', '`.count()` va `.index()` bilan qidirish'],
    objEn: ['Use `append`, `extend`, `insert`, `pop`, and `remove` accurately', 'Contrast in-place `.sort()` with `sorted()`', 'Search safely using `count()` and `in`'],
    theoryUz: `### 1. Qo‘shish metodlari
- \`nums.append(x)\` — oxiriga 1 ta element qo‘shadi (O(1))
- \`nums.extend([x, y])\` — iterable elementlarini bitta-bitta qo‘shadi
- \`nums.insert(i, x)\` — \`i\`-indeksga joylashtiradi
### 2. O‘chirish metodlari
- \`nums.pop()\` — oxirgi elementni o‘chirib **qiymatini qaytaradi** (\`pop(0)\` boshidan)
- \`nums.remove(val)\` — birinchi uchragan \`val\` qiymatni o‘chiradi (topilmasa \`ValueError\`)
- \`nums.clear()\` — hammasini tozalaydi
### 3. Qidirish va Tartiblash
\`nums.count(x)\`, \`nums.index(x)\`, \`nums.sort(reverse=True)\`, \`nums.reverse()\`.
### 4. Eng katta tuzoq: \`None\` qaytishi!
\`nums = nums.append(5)\` yoki \`res = nums.sort()\` -> **\`None\`**!
### 5. Keng tarqalgan xato
\`nums.remove(x)\` dan oldin \`if x in nums:\` tekshirmaslik (\`ValueError\`).`,
    theoryEn: `### 1. Adding Elements
\`append(x)\`, \`extend(iterable)\`, \`insert(index, x)\`.
### 2. Removing Elements
\`pop(idx=-1)\` removes & returns; \`remove(val)\` removes first match; \`clear()\`.
### 3. Ordering & Counting
\`count(val)\`, \`index(val)\`, \`sort(reverse=False)\`, \`reverse()\`.
### 4. The \`None\` Return Rule
\`append\`, \`extend\`, \`insert\`, \`remove\`, \`sort\`, and \`reverse\` return \`None\`.
### 5. Classic Bug
Assigning \`lst = lst.sort()\` wipes the list with \`None\`.`,
    examples: [
      ex('Misol 1: `append` vs `extend`', 'Example 1: append() vs extend()', `a = [1, 2]\na.append([3, 4])\nb = [1, 2]\nb.extend([3, 4])\nprint("append:", a)\nprint("extend:", b)`, `append: [1, 2, [3, 4]]\nextend: [1, 2, 3, 4]`, '`append` ro‘yxatni ichma-ich element qiladi, `extend` esa yoyib qo‘shadi.', '`append` nests the list; `extend` flattens its items in.'),
      ex('Misol 2: `pop()` va `remove()`', 'Example 2: Removing with pop() and remove()', `tasks = ["Email", "Code", "Test", "Code"]\ndone = tasks.pop(0)\ntasks.remove("Code")\nprint("Done:", done, "| Left:", tasks)`, `Done: Email | Left: ['Test', 'Code']`, '`pop(0)` qiymatni olib qaytardi; `remove("Code")` esa birinchi uchraganini o‘chirdi.', '`pop` returns removed item; `remove` deletes first matching value.'),
      ex('Misol 3: `.sort()` vs `sorted()`', 'Example 3: In-Place .sort() vs sorted()', `orig = [5, 1, 9]\nnew_sorted = sorted(orig, reverse=True)\nprint("orig:", orig, "| new:", new_sorted)\norig.sort()\nprint("orig after .sort():", orig)`, `orig: [5, 1, 9] | new: [9, 5, 1]\norig after .sort(): [1, 5, 9]`, '`sorted()` asl ro‘yxatni saqlab yangisini qaytaradi; `.sort()` esa joyida o‘zgartiradi.', '`sorted()` preserves original; `.sort()` mutates in place.'),
    ],
    traceTitleUz: 'Metodlar ketma-ketligi izi',
    traceTitleEn: 'Tracing List Mutations',
    traceCode: `stack = []\nstack.append("A")\nstack.append("B")\ntop = stack.pop()\nprint(top, stack)`,
    traceSteps: [
      traceStep(1, 'stack.append("A")', "['A']", 'A qo‘shildi', 'Appended A'),
      traceStep(2, 'stack.append("B")', "['A', 'B']", 'B qo‘shildi', 'Appended B'),
      traceStep(3, 'top = stack.pop()', "top='B', stack=['A']", 'Oxirgisi olindi', 'Popped B'),
      traceStep(4, 'print(top, stack)', "B ['A']", 'Natija', 'Output', "B ['A']"),
    ],
    commonMistakes: [
      mistake('`lst = lst.sort()` deb yozish', 'Assigning Return Value of .sort()', `nums = [3, 1, 2]\nnums = nums.sort()\nprint(nums)`, 'Prints None!', `nums = [3, 1, 2]\nnums.sort()\nprint(nums)`, '`.sort()` qiymat qaytarmaydi (`None`).', '`.sort()` returns `None`.', 'Yangi ro‘yxat kerak bo‘lsa `sorted(nums)` yozing.', 'Use `nums.sort()` standalone or `sorted(nums)`.'),
      mistake('Yo‘q elementni `.remove()` qilish', 'Calling .remove() on Missing Value', `items = ["a", "b"]\nitems.remove("z")`, 'ValueError: list.remove(x): x not in list', `items = ["a", "b"]\nif "z" in items:\n    items.remove("z")`, 'Topilmagan elementda `remove()` xato chiqaradi.', '`.remove()` raises `ValueError` if absent.', 'Avval `in` bilan tekshiring.', 'Guard with `if val in items:`.'),
    ],
    compareTitleUz: '`.sort()` vs `sorted()`',
    compareTitleEn: '`.sort()` vs `sorted()`',
    compareUz: ['`nums.sort()`: xotira tejamkor, joyida saralaydi (`None` qaytaradi).', '`sorted(iterable)`: asl ro‘yxatni o‘zgartirmaydi, tuple/set/dict da ham ishlaydi.'],
    compareEn: ['`nums.sort()`: O(1) extra object, mutates list in place, returns `None`.', '`sorted(iterable)`: preserves input, works on any iterable.'],
    compareSummaryUz: 'Asl tartibni saqlash kerak bo‘lsa `sorted()`, katta ro‘yxatni o‘zini tartiblashda `.sort()` ishlating.',
    compareSummaryEn: 'Use `sorted()` to stay pure and `.sort()` when in-place mutation is intended.',
    practiceTasks: [
      pt('p0402_1', '1-mashq: append va pop', 'Task 1: Append & Pop', '`a = [1, 2]` ga `3` qo‘shing va oxirgisini `pop()` qilib chiqaring.', 'Append 3 then pop and print it.', `a = [1, 2]\na.append(3)\nprint(a.pop())`, '3', 'a.pop().', 'Call .pop().'),
      pt('p0402_2', '2-mashq: extend', 'Task 2: Extend', '`[1]` ga `[2, 3]` ni `extend` qilib chiqaring.', 'Extend [1] with [2, 3].', `a = [1]\na.extend([2, 3])\nprint(a)`, '[1, 2, 3]', 'a.extend([2, 3]).', 'Use .extend().'),
      pt('p0402_3', '3-mashq: insert', 'Task 3: Insert', '`["A", "C"]` ning 1-indeksiga `"B"` qo‘ying.', 'Insert B at index 1.', `a = ["A", "C"]\na.insert(1, "B")\nprint(a)`, "['A', 'B', 'C']", 'insert(1, "B").', 'Use .insert().'),
      pt('p0402_4', '4-mashq: count', 'Task 4: Count', '`[1, 2, 1, 1]` da `1` necha marta bor?', 'Count occurrences of 1.', `print([1, 2, 1, 1].count(1))`, '3', '.count(1).', 'Use .count().'),
      pt('p0402_5', '5-mashq: Teskari saralash', 'Task 5: Sort Descending', '`[4, 1, 9, 2]` ni kamayish tartibida saralab chiqaring.', 'Sort descending using sorted().', `print(sorted([4, 1, 9, 2], reverse=True))`, '[9, 4, 2, 1]', 'reverse=True.', 'Pass reverse=True.'),
    ],
    quiz: [
      q('q0402_1', '`a = [3, 1]; b = a.sort(); print(b)` nima chiqaradi?', 'Output of `a = [3, 1]; b = a.sort(); print(b)`?', ['[1, 3]', '[3, 1]', 'None', 'Error'], ['[1, 3]', '[3, 1]', 'None', 'Error'], 2, '`.sort()` `None` qaytaradi.', 'Returns `None`.'),
      q('q0402_2', '`[1].append([2, 3])` natijasi?', 'Result of `a = [1]; a.append([2, 3])`?', ['[1, 2, 3]', '[1, [2, 3]]', 'Error', '[2, 3, 1]'], ['[1, 2, 3]', '[1, [2, 3]]', 'Error', '[2, 3, 1]'], 1, 'Ichma-ich ro‘yxat bo‘ladi.', 'Nests `[2, 3]`.'),
      q('q0402_3', 'Elementni o‘chirib qiymatini qaytaruvchi metod?', 'Method that removes AND returns an element?', ['.remove()', '.delete()', '.pop()', '.clear()'], ['.remove()', '.delete()', '.pop()', '.clear()'], 2, '`.pop()`.', '`.pop()`.'),
      q('q0402_4', '`tuple` ustida qaysi biri ishlaydi?', 'Which works on tuples and sets as well as lists?', ['.sort()', 'sorted()', '.append()', '.reverse()'], ['.sort()', 'sorted()', '.append()', '.reverse()'], 1, '`sorted()`.', '`sorted()`.'),
      q('q0402_5', 'Ro‘yxatda mavjud bo‘lmagan qiymatga `.remove()` qilinsa?', 'Error when `.remove()` misses?', ['KeyError', 'ValueError', 'IndexError', 'None'], ['KeyError', 'ValueError', 'IndexError', 'None'], 1, 'ValueError.', 'ValueError.'),
    ],
    homework: hw('Vazifalar Navbati (Task Queue)', 'CLI Task Queue Manager', 'Bo‘sh ro‘yxat ustida `append`, `insert(0, ...)`, `pop(0)`, `remove` va `sorted()` amallarini ketma-ket bajarib jarayonni log qilib chiqaring.', 'Manage a task queue using `append`, priority `insert(0, ...)`, `pop(0)`, guarded `remove`, and `sorted()`.', ['Kamida 5 ta list metodini qo‘llang', 'remove dan oldin in tekshiruvi bo‘lsin'], ['Use 5 distinct list methods', 'Guard remove with `in`'], 'if task in queue: queue.remove(task)', 'Check before removing.', 'Bajarilgan vazifalar arxivini alohida ro‘yxatda saqlang.', 'Archive completed tasks in a second list.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-04-03',
    courseId: 'data_structures',
    moduleId: 'c04_m1',
    order: 3,
    titleUz: 'List Slicing — bo‘laklash va qadamlar',
    titleEn: 'List Slicing (`[start:stop:step]`) & Slice Assignment',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-04-02'],
    conceptId: 'list_slicing',
    whyUz: "Sahifalash (pagination: 10–20 elementlar), oxirgi 5 ta xabarni olish, ro'yxatni teskari qilish va nusxalash aynan List Slicing yordamida bir qatorda yechiladi.",
    whyEn: 'Pagination, grabbing recent logs (`logs[-5:]`), reversing sequences, and shallow copying rely on Python slicing.',
    analogyUz: "Slicing — bu non bo'lagini kesish: `start` dan boshlab `stop` gacha (`stop` kirmaydi) `step` qadam bilan yangi lagan (yangi ro'yxat!) ga olib qo'yadi.",
    analogyEn: 'Slicing cuts a fresh sub-plate from `[start:stop:step]` without touching the original loaf.',
    stopsUz: "Slicing har doim YANGI ro'yxat qaytaradi (shallow copy) va indeks chegaradan chiqib ketsa ham (`nums[:1000]`) hech qachon `IndexError` bermaydi!",
    stopsEn: 'Slicing always returns a new shallow-copied list and gracefully clamps out-of-range bounds without throwing `IndexError`.',
    objUz: ['`a[start:stop:step]` ning barcha kombinatsiyalarini tushunish', 'Oxirgi N ta (`a[-3:]`), teskari (`a[::-1]`) va juft indekslar (`a[::2]`) ni olish', 'Sahifalash (pagination) formulasini yozish'],
    objEn: ['Master `start`, `stop`, `step` and negative slice bounds', 'Grab tails (`[-3:]`), reverse (`[::-1]`), and stride (`[::2]`)', 'Implement clean list pagination with slicing'],
    theoryUz: `### 1. Slicing formulasi: \`seq[start:stop:step]\`
- \`start\`: boshlang‘ich indeks (odatiy \`0\`)
- \`stop\`: to‘xtash indeksi (**kirmaydi!**)
- \`step\`: qadam (odatiy \`1\`, manfiy bo‘lsa teskari)
### 2. Eng mashhur 5 ta qolip
| Qolip | Maʼnosi |
|---|---|
| \`a[:3]\` | Birinchi 3 ta element |
| \`a[-3:]\` | Oxirgi 3 ta element |
| \`a[1:-1]\` | Boshi va oxirisiz o‘rta qism |
| \`a[::2]\` | Har 2-element (0, 2, 4...) |
| \`a[::-1]\` | Teskari tartibda yangi ro‘yxat |
### 3. Xavfsiz chegaralar
\`[1, 2][:100]\` -> \`[1, 2]\` (xato bermaydi!).
### 4. Slice Assignment (Mutable xususiyat!)
\`nums[1:3] = [20, 30, 40]\` ro‘yxatning bir bo‘lagini istalgan uzunlikdagi bo‘lakka almashtiradi!
### 5. Keng tarqalgan xato
Teskari kesishda bosh/oxir tartibini adashtirish: \`a[1:4:-1]\` -> bo‘sh \`[]\` beradi (\`a[4:1:-1]\` kerak)!`,
    theoryEn: `### 1. Slice Syntax: \`seq[start:stop:step]\`
\`start\` inclusive, \`stop\` exclusive, \`step\` stride.
### 2. Essential Idioms
\`a[:3]\` first 3, \`a[-3:]\` tail 3, \`a[::2]\` even indices, \`a[::-1]\` reversed copy.
### 3. Out-of-Bounds Clamping
Slicing clamps silently instead of raising \`IndexError\`.
### 4. Slice Assignment
Lists allow replacing slices: \`nums[1:3] = [99]\`.
### 5. Negative-Step Trap
When \`step < 0\`, \`start\` must be greater than \`stop\`, e.g., \`a[4:1:-1]\`.`,
    examples: [
      ex('Misol 1: Asosiy kesish qoliplari', 'Example 1: Everyday List Slicing Idioms', `nums = [10, 20, 30, 40, 50, 60]\nprint("First 3:", nums[:3])\nprint("Last 2:", nums[-2:])\nprint("Every 2nd:", nums[::2])\nprint("Reversed:", nums[::-1])`, `First 3: [10, 20, 30]\nLast 2: [50, 60]\nEvery 2nd: [10, 30, 50]\nReversed: [60, 50, 40, 30, 20, 10]`, 'Har bir slice asl `nums` ga tegmasdan yangi ro‘yxat qaytaradi.', 'Each slice returns a fresh list leaving `nums` untouched.'),
      ex('Misol 2: Sahifalash (Pagination) funksiyasi', 'Example 2: Paginating Results via Slicing', `def paginate(items: list, page: int, size: int = 3) -> list:\n    start = (page - 1) * size\n    return items[start : start + size]\n\nposts = ["P1", "P2", "P3", "P4", "P5", "P6", "P7"]\nprint("Page 2:", paginate(posts, 2, 3))\nprint("Page 3:", paginate(posts, 3, 3))`, `Page 2: ['P4', 'P5', 'P6']\nPage 3: ['P7']`, '3-sahifada faqat 1 ta element bo‘lsa ham slicing IndexError bermay `["P7"]` qaytaradi!', 'Clamping makes page 3 work cleanly without manual min() checks.'),
      ex('Misol 3: Slice assignment', 'Example 3: Replacing a Slice In-Place', `a = [1, 2, 3, 4, 5]\na[1:4] = [200, 300]\nprint(a)`, `[1, 200, 300, 5]`, 'Indeks 1..3 (2, 3, 4) o‘rniga 2 ta yangi element joylandi.', 'Replaced 3 elements with 2 elements directly in place.'),
    ],
    traceTitleUz: 'Slicing izi',
    traceTitleEn: 'Tracing List Slicing',
    traceCode: `a = [0, 1, 2, 3, 4, 5]\nsub = a[1:5:2]\nprint(sub)`,
    traceSteps: [
      traceStep(1, 'start=1, stop=5, step=2', 'indices: 1, 3', 'Indeks 1 olindi', 'Index 1 -> 1'),
      traceStep(2, '1 + 2 = 3 < 5', 'sub=[1, 3]', 'Indeks 3 olindi; 5 kirmaydi', 'Index 3 -> 3; stops before 5'),
      traceStep(3, 'print(sub)', '[1, 3]', 'Natija', 'Output', '[1, 3]'),
    ],
    commonMistakes: [
      mistake('Manfiy qadamda kichikdan kattaga kesish', 'Ascending Bounds with Negative Step', `a = [10, 20, 30, 40, 50]\nprint(a[1:4:-1])  # Bo'sh!`, 'Prints [] unexpectedly', `a = [10, 20, 30, 40, 50]\nprint(a[4:1:-1])`, 'Chapga yurish uchun `start > stop` bo‘lishi kerak.', 'Moving backwards requires `start > stop`.', 'Yoki `a[1:4][::-1]` qilib oling — o‘qish osonroq!', 'Or slice forward first then reverse: `a[1:4][::-1]`.'),
      mistake('`a[-3]` va `a[-3:]` ni adashtirish', 'Confusing Index [-3] with Slice [-3:]', `a = [1, 2, 3, 4]\nprint(a[-3])   # Bitta son: 2`, 'Gets single element instead of tail', `a = [1, 2, 3, 4]\nprint(a[-3:])  # Oxirgi 3 ta: [2, 3, 4]`, 'Ikki nuqta `:` bo‘lmasa bitta indeks olinadi.', 'Without `:`, it is single-item indexing.', 'Oxirgi N ta uchun `[-N:]` yozing.', 'Include `:` for tail slices.'),
    ],
    compareTitleUz: '`nums[::-1]` vs `nums.reverse()`',
    compareTitleEn: '`nums[::-1]` vs `nums.reverse()`',
    compareUz: ['`nums[::-1]`: asl ro‘yxatga tegmaydi, yangi teskari ro‘yxat qaytaradi.', '`nums.reverse()`: asl ro‘yxatni joyida teskari qiladi (`None` qaytaradi).'],
    compareEn: ['`nums[::-1]`: creates a reversed shallow copy.', '`nums.reverse()`: mutates original list in place, returns `None`.'],
    compareSummaryUz: 'Asl tartib kerak bo‘lsa `[::-1]`, xotirani tejash uchun `.reverse()` ishlating.',
    compareSummaryEn: 'Use `[::-1]` when keeping original order and `.reverse()` for in-place reversal.',
    practiceTasks: [
      pt('p0403_1', '1-mashq: Oxirgi 3 ta', 'Task 1: Tail 3', '`[1, 2, 3, 4, 5]` ning oxirgi 3 tasini chiqaring.', 'Print last 3 items.', `print([1, 2, 3, 4, 5][-3:])`, '[3, 4, 5]', '[-3:].', 'Use [-3:].'),
      pt('p0403_2', '2-mashq: Boshi va oxirisiz', 'Task 2: Trim Ends', '`[10, 20, 30, 40]` ning o‘rtasini chiqaring.', 'Trim first and last items.', `print([10, 20, 30, 40][1:-1])`, '[20, 30]', '[1:-1].', 'Use [1:-1].'),
      pt('p0403_3', '3-mashq: Toq indekslar', 'Task 3: Odd Indices', '`[0, 1, 2, 3, 4, 5]` dan 1, 3, 5 indekslarni chiqaring.', 'Slice odd indices.', `print([0, 1, 2, 3, 4, 5][1::2])`, '[1, 3, 5]', '[1::2].', 'Start at 1 step 2.'),
      pt('p0403_4', '4-mashq: Teskari nusxa', 'Task 4: Reverse Copy', '`["a", "b", "c"]` ni teskari chiqaring.', 'Reverse list via slice.', `print(["a", "b", "c"][::-1])`, "['c', 'b', 'a']", '[::-1].', 'Use [::-1].'),
      pt('p0403_5', '5-mashq: Slice nusxa', 'Task 5: Full Copy', '`a = [1, 2]; b = a[:]` da `b is a` ni chiqaring.', 'Check identity of full slice.', `a = [1, 2]\nb = a[:]\nprint(b is a)`, 'False', 'a[:] yangi list yaratadi.', 'Full slice creates new list.'),
    ],
    quiz: [
      q('q0403_1', '`[10, 20, 30, 40][1:3]` natijasi?', 'Output of `[10, 20, 30, 40][1:3]`?', ['[10, 20]', '[20, 30]', '[20, 30, 40]', 'Error'], ['[10, 20]', '[20, 30]', '[20, 30, 40]', 'Error'], 1, 'Indeks 1 va 2 -> `[20, 30]`.', '[20, 30].'),
      q('q0403_2', '`[1, 2][:100]` nima qaytaradi?', 'Result of `[1, 2][:100]`?', ['IndexError', '[1, 2]', '[1, 2, None]', '[]'], ['IndexError', '[1, 2]', '[1, 2, None]', '[]'], 1, 'Slicing xavfsiz qisqartiradi -> `[1, 2]`.', 'Clamps to `[1, 2]`.'),
      q('q0403_3', 'Oxirgi 2 elementni olish?', 'Slice for last 2 elements?', ['[-2]', '[-2:]', '[:-2]', '[2:]'], ['[-2]', '[-2:]', '[:-2]', '[2:]'], 1, '`[-2:]`.', '`[-2:]`.'),
      q('q0403_4', '`[1, 2, 3][::-1]` nimani beradi?', 'Result of `[1, 2, 3][::-1]`?', ['[3, 2, 1]', '[1, 2, 3]', '[]', 'None'], ['[3, 2, 1]', '[1, 2, 3]', '[]', 'None'], 0, 'Teskari ro‘yxat `[3, 2, 1]`.', '[3, 2, 1].'),
      q('q0403_5', '`a[:]` ning vazifasi?', 'What does `a[:]` create?', ['Reference alias', 'Yangi shallow copy ro‘yxat', 'Bo‘sh ro‘yxat', 'Tuple'], ['Reference alias', 'Shallow copy of the list', 'Empty list', 'Tuple'], 1, 'Shallow copy.', 'Shallow copy.'),
    ],
    homework: hw('Loglar Sahifalash Tizimi', 'Log Paginator with Slicing', '10 ta log satridan iborat ro‘yxatni 3 tadan sahifalovchi `get_page(logs, page, per_page=3)` funksiyasini va oxirgi 3 ta logni ko‘rsatuvchi qismni yozing.', 'Write `get_page(logs, page, per_page=3)` and display page 1, page 2, and latest 3 entries.', ['Slicing bilan sahifalang', 'page < 1 holatini guard qiling'], ['Paginate via slicing', 'Guard page < 1'], 'start = (page - 1) * per_page', 'Compute offset cleanly.', 'Jami sahifalar sonini ham hisoblang (`math.ceil`).', 'Compute total pages too.', 20),
    relatedVideos: ['VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-04-04',
    courseId: 'data_structures',
    moduleId: 'c04_m1',
    order: 4,
    titleUz: 'Nested Lists — ichma-ich ro‘yxatlar va matrisalar',
    titleEn: 'Nested Lists, Matrices & Shallow vs Deep Copy',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-04-03'],
    conceptId: 'nested_lists',
    whyUz: "Shaxmat taxtasi, Excel jadvallari (qator x ustun), tasvir piksellari va ML dagi 2D matrisalar Python da ichma-ich ro'yxatlar (`matrix[row][col]`) sifatida modellashtiriladi.",
    whyEn: 'Spreadsheets, game boards, pixel grids, and 2D matrices are modeled as nested lists (`grid[row][col]`).',
    analogyUz: "2D ro'yxat — bu ko'p qavatli bino: `matrix[row]` — qavatni tanlaydi, `matrix[row][col]` esa shu qavatdagi xonani!",
    analogyEn: 'A 2D list is an apartment building: `matrix[row]` picks the floor, and `[col]` picks the room on that floor.',
    stopsUz: "ENG MASHHUR TUZOQ: `grid = [[0] * 3] * 3` deb matrisa yaratmang! Barcha 3 qator XOTIRADA BITTA ro'yxatga ishora qilib qoladi — birini o'zgartirsangiz uchalasi ham o'zgaradi!",
    stopsEn: 'NEVER initialize a 2D grid with `[[0] * 3] * 3`—it duplicates references to the exact same row object! Use a comprehension.',
    objUz: ['2D matrisaga `grid[r][c]` orqali murojaat qilish va ichma-ich `for` bilan aylanish', '`[[0] * 3] * 3` tuzog‘ini tushunib, list comprehension bilan tuzatish', '`.copy()` (shallow) vs `copy.deepcopy()` farqini amalda ko‘rish'],
    objEn: ['Index and iterate 2D matrices cleanly', 'Avoid the `[[0] * cols] * rows` shared-row trap', 'Contrast shallow `.copy()` with `copy.deepcopy()` on nested structures'],
    theoryUz: `### 1. 2D Ro‘yxat (Matrisa)
\`\`\`python
matrix = [
    [1, 2, 3],
    [4, 5, 6]
]
print(matrix[1][2])  # 6 (2-qator, 3-ustun)
\`\`\`
### 2. Matrisani xavfsiz yaratish
- **XATO**: \`grid = [[0] * 3] * 3\` (bitta ichki ro‘yxat 3 marta nusxalandi!)
- **TO‘G‘RI**: \`grid = [[0] * 3 for _ in range(3)]\`
### 3. Ichma-ich \`for\` sikli bilan aylanish
\`\`\`python
for row in matrix:
    for val in row:
        total += val
\`\`\`
### 4. Shallow Copy vs Deep Copy
Oddiy \`.copy()\` yoki \`[:]\` faqat tashqi ro‘yxatni nusxalaydi; ichki ro‘yxatlar esa hali ham umumiy qoladi! To‘liq ajratish uchun \`import copy; copy.deepcopy(matrix)\` kerak.
### 5. Keng tarqalgan xato
\`row, col\` o‘rnini almashtirib \`IndexError\` olish.`,
    theoryEn: `### 1. 2D Matrices
\`matrix[row][col]\` indexes rows first, then columns.
### 2. Safe 2D Grid Initialization
Always use \`[[0] * cols for _ in range(rows)]\`—never \`[[0] * cols] * rows\`.
### 3. Traversing Grids
Use nested loops or \`[x for row in matrix for x in row]\` to flatten.
### 4. Shallow vs Deep Copy
\`.copy()\` copies outer references only; \`copy.deepcopy()\` clones nested sublists recursively.
### 5. Pitfalls
Swapping row/col bounds on non-square matrices.`,
    examples: [
      ex('Misol 1: Matrisa yaratish tuzog‘i va to‘g‘ri yo‘l', 'Example 1: Avoiding Shared-Row Grid Bug', `bad = [[0] * 2] * 2\nbad[0][0] = 9\nprint("Bad grid:", bad)\n\ngood = [[0] * 2 for _ in range(2)]\ngood[0][0] = 9\nprint("Good grid:", good)`, `Bad grid: [[9, 0], [9, 0]]\nGood grid: [[9, 0], [0, 0]]`, '`[[0]*2]*2` ikkala qatorni bitta obyektga bog‘lagani uchun ikkala qator ham 9 bo‘ldi!', '`* 2` repeats the same list reference; comprehension creates distinct rows.'),
      ex('Misol 2: Matrisa elementlari yig‘indisi', 'Example 2: Summing a 2D Matrix', `grid = [[1, 2], [3, 4], [5, 6]]\ntotal = 0\nfor row in grid:\n    for val in row:\n        total += val\nprint("Sum:", total)`, `Sum: 21`, 'Ichma-ich sikl barcha qator va ustunlarni bosib chiqadi.', 'Nested loops traverse every row and cell.'),
      ex('Misol 3: `copy.deepcopy()` bilan himoya', 'Example 3: Shallow vs Deep Copy', `import copy\norig = [[1, 2], [3, 4]]\nshallow = orig.copy()\ndeep = copy.deepcopy(orig)\nshallow[0][0] = 99\nprint("orig:", orig, "| deep:", deep)`, `orig: [[99, 2], [3, 4]] | deep: [[1, 2], [3, 4]]`, '`shallow` ni o‘zgartirish `orig` ga taʼsir qildi, `deepcopy` esa to‘liq izolyatsiya qildi.', '`shallow` still shares sublists; `deepcopy` isolates completely.'),
    ],
    traceTitleUz: '2D matrisa murojaat izi',
    traceTitleEn: 'Tracing 2D Matrix Access',
    traceCode: `m = [[10, 20], [30, 40]]\nm[1][0] += 5\nprint(m[1])`,
    traceSteps: [
      traceStep(1, 'm[1]', '[30, 40]', '2-qator tanlandi', 'Selected row 1'),
      traceStep(2, 'm[1][0] += 5', '35', '0-ustun 35 ga oshdi', 'Incremented col 0 to 35'),
      traceStep(3, 'print(m[1])', '[35, 40]', 'Chiqish', 'Output', '[35, 40]'),
    ],
    commonMistakes: [
      mistake('`[[0]*3]*3` bilan matrisa ochish', 'Repeating Mutable Row Lists with *', `board = [["."] * 3] * 3\nboard[0][0] = "X"`, 'Sets X in all 3 rows!', `board = [["."] * 3 for _ in range(3)]\nboard[0][0] = "X"`, '`*` operatsiyasi ichki listlarni nusxalamaydi, havolasini takrorlaydi.', '`*` duplicates the row pointer.', 'Har doim list comprehension ishlating.', 'Use `[[...] for _ in range(rows)]`.'),
      mistake('Ichma-ich ro‘yxatda `.copy()` yetarli deb o‘ylash', 'Using Shallow Copy on Nested Lists', `b = a.copy()\nb[0].append(5)`, 'Mutates original nested list `a`!', `import copy\nb = copy.deepcopy(a)\nb[0].append(5)`, '`.copy()` faqat 1-qavatni nusxalaydi.', '`.copy()` only copies outer container.', 'Ichma-ich ro‘yxatda `copy.deepcopy()` ishlating.', 'Use `copy.deepcopy()`.'),
    ],
    compareTitleUz: '`.copy()` vs `copy.deepcopy()`',
    compareTitleEn: '`.copy()` vs `copy.deepcopy()`',
    compareUz: ['`.copy()`: 1-qavatli (tekis) ro‘yxatlar uchun tez va yetarli.', '`copy.deepcopy()`: ichma-ich list/dict lar uchun to‘liq mustaqil nusxa.'],
    compareEn: ['`.copy()`: fast shallow copy for flat lists.', '`copy.deepcopy()`: recursive deep isolation for nested data.'],
    compareSummaryUz: 'Matrisa yaratishda `[[0]*n for _ in range(m)]`, nusxalashda `deepcopy()` ishlating.',
    compareSummaryEn: 'Use comprehensions to create grids and `deepcopy()` to clone them safely.',
    practiceTasks: [
      pt('p0404_1', '1-mashq: Katakcha olish', 'Task 1: Matrix Element', '`m = [[1, 2], [3, 4]]` dan `3` ni chiqaring.', 'Access 3 from matrix.', `m = [[1, 2], [3, 4]]\nprint(m[1][0])`, '3', 'm[1][0].', 'Row 1, Col 0.'),
      pt('p0404_2', '2-mashq: Xavfsiz 2x3 jadval', 'Task 2: Safe 2x3 Grid', '`[[0]*3 for _ in range(2)]` da `[0][1] = 7` qilib chiqaring.', 'Build safe 2x3 grid and set [0][1]=7.', `g = [[0] * 3 for _ in range(2)]\ng[0][1] = 7\nprint(g)`, '[[0, 7, 0], [0, 0, 0]]', 'Comprehension.', 'Use comprehension.'),
      pt('p0404_3', '3-mashq: Qator yig‘indisi', 'Task 3: Row Sums', '`[[1, 2], [3, 4]]` har bir qator yig‘indisini chiqaring.', 'Print sum of each row.', `for r in [[1, 2], [3, 4]]:\n    print(sum(r))`, '3\n7', 'sum(r).', 'Use sum(r).'),
      pt('p0404_4', '4-mashq: Deepcopy', 'Task 4: Deepcopy', '`a = [[1]]` dan `deepcopy` olib `b[0][0] = 9` qiling va `a` ni chiqaring.', 'Deepcopy and verify a unchanged.', `import copy\na = [[1]]\nb = copy.deepcopy(a)\nb[0][0] = 9\nprint(a)`, '[[1]]', 'copy.deepcopy.', 'Use copy.deepcopy.'),
      pt('p0404_5', '5-mashq: Diagonal', 'Task 5: Main Diagonal', '`[[1, 2], [3, 4]]` bosh diagonal elementlarini chiqaring.', 'Print main diagonal sum.', `m = [[1, 2], [3, 4]]\nprint(sum(m[i][i] for i in range(len(m))))`, '5', 'm[i][i].', 'Sum m[i][i].'),
    ],
    quiz: [
      q('q0404_1', '`m = [[5, 6], [7, 8]]` da `m[1][0]` nechaga teng?', 'Value of `m[1][0]` in `[[5, 6], [7, 8]]`?', ['5', '6', '7', '8'], ['5', '6', '7', '8'], 2, '7.', '7.'),
      q('q0404_2', 'Nega `[[0]*3]*3` xato?', 'Why is `[[0]*3]*3` buggy?', ['SyntaxError', 'Barcha qatorlar bitta listga ishora qiladi', 'Juda sekin', 'Float beradi'], ['SyntaxError', 'All rows reference the exact same list object', 'Too slow', 'Returns float'], 1, 'Shared row reference.', 'Shared row reference.'),
      q('q0404_3', 'Ichma-ich ro‘yxatni to‘liq ajratib nusxalash?', 'How to clone nested lists completely?', ['a.copy()', 'a[:]', 'copy.deepcopy(a)', 'b = a'], ['a.copy()', 'a[:]', 'copy.deepcopy(a)', 'b = a'], 2, '`copy.deepcopy(a)`.', '`copy.deepcopy(a)`.'),
      q('q0404_4', 'To‘g‘ri 3x3 nollar matrisasi?', 'Safe 3x3 zero matrix?', ['[[0]*3]*3', '[[0]*3 for _ in range(3)]', 'matrix(3,3)', '[[0 for 3]]'], ['[[0]*3]*3', '[[0]*3 for _ in range(3)]', 'matrix(3,3)', '[[0 for 3]]'], 1, 'Comprehension.', 'Comprehension.'),
      q('q0404_5', '2D matrisada birinchi indeks nimani bildiradi?', 'What does the first index `m[i][j]` select?', ['Ustun', 'Qator', 'Qiymat', 'Oxirgi'], ['Column', 'Row', 'Value', 'Last'], 1, 'Qator (Row).', 'Row.'),
    ],
    homework: hw('3x3 Tic-Tac-Toe Taxtasi', '3x3 Tic-Tac-Toe Grid', 'Xavfsiz 3x3 bo‘sh taxta yarating, markazga `"X"` va burchakka `"O"` qo‘ying hamda taxtani chiroyli qatorlar bilan chop eting.', 'Create a safe 3x3 board, place `"X"` at center and `"O"` at corner, and render rows cleanly.', ['List comprehension bilan yarating', 'Ichma-ich siklsiz chiroyli `" | ".join(row)` bilan chiqaring'], ['Build grid via comprehension', 'Render rows with `" | ".join(row)`'], 'board = [["."]*3 for _ in range(3)]', 'Create independent rows.', 'G‘olib qator bor-yo‘qligini tekshiruvchi funksiya qo‘shing.', 'Add a row-winner check.', 20),
    relatedVideos: ['VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-04-05',
    courseId: 'data_structures',
    moduleId: 'c04_m2',
    order: 5,
    titleUz: 'Tuples — o‘zgarmas ketma-ketliklar',
    titleEn: 'Tuples: Immutability, Packing & Unpacking',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-04-04'],
    conceptId: 'tuples',
    whyUz: "GPS koordinatalar, RGB ranglar, funksiyadan bir nechta qiymat qaytarish va `dict` kalitlari o'zgarmas (immutable) bo'lishi kerak — bular uchun `tuple` ishlatiladi.",
    whyEn: 'Coordinates, RGB colors, multi-value function returns, and hashable dict keys require immutable tuples.',
    analogyUz: "`list` — bu qalam bilan yozilgan ro'yxat (o'chirib tuzatish mumkin); `tuple` — bu toshga o'yilgan muhr (yaratilgach o'zgarmaydi, shuning uchun ishonchli va tezkor).",
    analogyEn: 'A `list` is a whiteboard you can erase; a `tuple` is carved in stone—immutable, lighter, and safe as a dictionary key.',
    stopsUz: "1 ta elementli tuple yaratishda vergul SHART: `t = (5,)`! Qavs qo'yib vergul qo'ymasangiz `(5)`, Python uni oddiy `int` deb tushunadi!",
    stopsEn: 'A single-element tuple requires a trailing comma: `(5,)`. Without the comma, `(5)` is just integer `5`.',
    objUz: ['Tuple yaratish va 1-elementli `(x,)` qoidasini bilish', 'Packing va Unpacking (`lat, lon = coords`) ni qo‘llash', 'Qachon `list` o‘rniga `tuple` (hashable, xavfsiz, tezkor) tanlashni bilish'],
    objEn: ['Construct tuples cleanly including 1-element `(x,)`', 'Use tuple packing and unpacking', 'Know when to choose `tuple` over `list` (immutability & dict keys)'],
    theoryUz: `### 1. Tuple nima?
Tartiblangan, lekin **o‘zgarmas (immutable)** kolleksiya: \`point = (41.3, 69.2)\`.
### 2. 1-elementli tuple siri
\`a = (42)\` -> **\`int\`**! \`b = (42,)\` -> **\`tuple\`**! Aslida tuple ni qavs emas, **vergul** yaratadi!
### 3. Immutability va Hashability
\`t[0] = 99\` -> \`TypeError\`. O‘zgarmas bo‘lgani uchun \`tuple\` larni \`dict\` kaliti yoki \`set\` elementi qilish mumkin!
### 4. Unpacking (Ochish)
\`name, age = ("Ali", 21)\` — funksiyalar bir nechta natija qaytarganda aynan tuple qaytaradi (\`divmod()\`).
### 5. Keng tarqalgan xato
\`(x)\` ni tuple deb o‘ylash yoki tuple ustida \`.append()\` chaqirishga urinish.`,
    theoryEn: `### 1. What Is a Tuple?
Ordered, immutable sequence—created by commas (\`1, 2\` or \`(1, 2)\`).
### 2. Single-Element Comma Rule
\`(42)\` is an \`int\`; \`(42,)\` is a 1-element \`tuple\`.
### 3. Hashability
Tuples of immutables can serve as dictionary keys or set elements.
### 4. Packing & Unpacking
\`r, g, b = (255, 128, 0)\` cleanly unpacks values.
### 5. Pitfalls
Calling \`.append()\` on a tuple or forgetting the trailing comma.`,
    examples: [
      ex('Misol 1: 1-elementli tuple tuzog‘i', 'Example 1: Single-Element Tuple Comma Rule', `not_tuple = (42)\nis_tuple = (42,)\nprint(type(not_tuple).__name__, type(is_tuple).__name__)`, `int tuple`, 'Vergulsiz `(42)` oddiy son, vergulli `(42,)` esa haqiqiy tuple.', 'Only the trailing comma turns `(42,)` into a tuple.'),
      ex('Misol 2: Unpacking va Dict kaliti sifatida', 'Example 2: Unpacking & Hashable Dict Keys', `cities = {(41.3, 69.2): "Toshkent", (39.6, 66.9): "Samarqand"}\ncoord = (41.3, 69.2)\nlat, lon = coord\nprint(cities[coord], "| Lat:", lat)`, `Toshkent | Lat: 41.3`, 'List ni dict kaliti qilib bo‘lmaydi, lekin tuple ni bemalol qilish mumkin!', 'Tuples are hashable and work cleanly as dictionary keys.'),
      ex('Misol 3: Tuple xotirada yengilroq', 'Example 3: Tuple Memory Efficiency', `import sys\nlst = [1, 2, 3, 4]\ntup = (1, 2, 3, 4)\nprint("Tuple smaller than list:", sys.getsizeof(tup) < sys.getsizeof(lst))`, `Tuple smaller than list: True`, 'Tuple o‘smagani uchun Python unga kamroq xotira ajratadi.', 'Fixed-size tuples carry less memory overhead than lists.'),
    ],
    traceTitleUz: 'Tuple unpacking izi',
    traceTitleEn: 'Tracing Tuple Unpacking',
    traceCode: `def min_max(nums):\n    return min(nums), max(nums)\nlo, hi = min_max([8, 2, 15])\nprint(lo, hi)`,
    traceSteps: [
      traceStep(1, 'return min(nums), max(nums)', '(2, 15)', 'Tuple qaytdi', 'Packed into (2, 15)'),
      traceStep(2, 'lo, hi = (2, 15)', 'lo=2, hi=15', 'Ikkita o‘zgaruvchiga ochildi', 'Unpacked into lo, hi'),
      traceStep(3, 'print(lo, hi)', '2 15', 'Natija', 'Output', '2 15'),
    ],
    commonMistakes: [
      mistake('1-elementli tuple da vergulni unutish', 'Forgetting Trailing Comma on 1-Tuple', `t = ("admin")\nprint(len(t))  # 1 emas, 5 chiqadi!`, 'Evaluates as str instead of tuple', `t = ("admin",)\nprint(type(t).__name__, len(t))`, 'Vergulsiz Python buni oddiy matn deb o‘qiydi.', 'Without a comma, `("admin")` is just a string.', 'Bitta elementli tuple da doim `(val,)` yozing.', 'Always append `,` for 1-item tuples.'),
      mistake('Tuple elementini o‘zgartirishga urinish', 'Mutating a Tuple', `t = (1, 2, 3)\nt[0] = 9`, "TypeError: 'tuple' object does not support item assignment", `t = (1, 2, 3)\nt = (9,) + t[1:]\nprint(t)`, 'Tuple o‘zgarmas; o‘zgartirish kerak bo‘lsa yangisini yarating yoki `list` ishlating.', 'Tuples are immutable; construct a new tuple or use a list.', 'O‘zgaradigan maʼlumot uchun `list` tanlang.', 'Choose `list` if items must change.'),
    ],
    compareTitleUz: '`list` vs `tuple`',
    compareTitleEn: '`list` vs `tuple`',
    compareUz: ['`list`: bir xil turdagi o‘zgaruvchan elementlar (foydalanuvchilar ro‘yxati).', '`tuple`: o‘zgarmas yozuvlar (koordinata, RGB, DB qatori, dict kaliti).'],
    compareEn: ['`list`: homogeneous mutable sequences.', '`tuple`: heterogeneous fixed records, dict keys, and safe returns.'],
    compareSummaryUz: 'O‘zgarmas yozuvlar va funksiya return lari uchun doim `tuple` ishlating.',
    compareSummaryEn: 'Use `tuple` for fixed records, dict keys, and multi-value returns.',
    practiceTasks: [
      pt('p0405_1', '1-mashq: 1-elementli tuple', 'Task 1: Singleton Tuple', '`("py",)` yaratib turi nomini chiqaring.', 'Print type name of `("py",)`.', `t = ("py",)\nprint(type(t).__name__)`, 'tuple', 'Vergul qo‘ying.', 'Include trailing comma.'),
      pt('p0405_2', '2-mashq: Unpacking', 'Task 2: Unpack RGB', '`r, g, b = (255, 100, 0)` qilib `g` ni chiqaring.', 'Unpack RGB and print g.', `r, g, b = (255, 100, 0)\nprint(g)`, '100', 'r, g, b = ...', 'Unpack tuple.'),
      pt('p0405_3', '3-mashq: Dict kaliti', 'Task 3: Tuple Key', '`{(1, 2): "Start"}` lug‘atidan `(1, 2)` ni chiqaring.', 'Lookup tuple key in dict.', `grid = {(1, 2): "Start"}\nprint(grid[(1, 2)])`, 'Start', 'grid[(1, 2)].', 'Use tuple key.'),
      pt('p0405_4', '4-mashq: Tuple -> List -> Tuple', 'Task 4: Rebuild Tuple', '`(1, 2)` ga `3` qo‘shib `(1, 2, 3)` hosil qiling.', 'Create (1, 2, 3) from (1, 2).', `t = (1, 2)\nt = t + (3,)\nprint(t)`, '(1, 2, 3)', 't + (3,).', 'Concatenate singleton tuple.'),
      pt('p0405_5', '5-mashq: count va index', 'Task 5: Tuple Methods', '`(5, 7, 5).count(5)` ni chiqaring.', 'Print count of 5 in tuple.', `print((5, 7, 5).count(5))`, '2', '.count(5).', 'Use .count().'),
    ],
    quiz: [
      q('q0405_1', '`type((10))` nimani beradi?', 'What is `type((10))`?', ['tuple', 'int', 'list', 'Error'], ['tuple', 'int', 'list', 'Error'], 1, 'Vergulsiz `(10)` — `int`.', '`int`.'),
      q('q0405_2', 'Tuple ni `dict` kaliti qilib bo‘ladimi?', 'Can a tuple of ints be a dictionary key?', ['Ha, chunki o‘zgarmas (hashable)', 'Yo‘q', 'Faqat bo‘sh bo‘lsa', 'Faqat 2 ta elementda'], ['Yes, because it is immutable/hashable', 'No', 'Only empty', 'Only length 2'], 0, 'Ha.', 'Yes.'),
      q('q0405_3', '`t = (1, 2); t[0] = 5` nima chiqaradi?', 'Result of `t = (1, 2); t[0] = 5`?', ['(5, 2)', 'TypeError', 'ValueError', 'IndexError'], ['(5, 2)', 'TypeError', 'ValueError', 'IndexError'], 1, 'TypeError.', 'TypeError.'),
      q('q0405_4', 'Qaysi birida xotira kamroq sarflanadi?', 'Which has lower memory overhead?', ['list', 'tuple', 'dict', 'set'], ['list', 'tuple', 'dict', 'set'], 1, '`tuple`.', '`tuple`.'),
      q('q0405_5', '`a, b = (3, 7)` qanday nomlanadi?', 'What is `a, b = (3, 7)` called?', ['Slicing', 'Tuple Unpacking', 'Casting', 'Hashing'], ['Slicing', 'Tuple Unpacking', 'Casting', 'Hashing'], 1, 'Tuple Unpacking.', 'Tuple Unpacking.'),
    ],
    homework: hw('Koordinata va Ranglar Registri', 'Coordinate & Color Registry', 'Tuple kalitli shahar koordinatalari lug‘ati va funksiyadan `(min, max, avg)` tuple qaytaruvchi tahlilchi yozing.', 'Build a tuple-keyed coordinate lookup dict and a function returning `(min, max, avg)` as a tuple.', ['Kamida 1 ta 1-elementli tuple va unpacking ishlating', 'Tuple dict kalitini qo‘llang'], ['Include 1-tuple and unpacking', 'Use tuple dict key'], 'return min(xs), max(xs), round(sum(xs)/len(xs), 1)', 'Return packed tuple.', 'Masofalar ro‘yxatini unpack qilib chiqaring.', 'Unpack and print summary.', 20),
    reviewCheckpoint: review(
      7,
      '7-Review Loyiha: 2D Jadval & Tuple Koordinata Dvigateli',
      'Review Project #7: Matrix, Slicing & Tuple Engine',
      '31–35 darslar (`List`, `Methods`, `Slicing`, `Nested Lists/Deepcopy`, `Tuples`) bilimlarini bitta o‘yin/analitika modulida jamlang.',
      'Combine lessons 31–35 (`list`, methods, slicing, nested 2D grids, tuples) into a matrix & coordinate tracker.',
      ['1) Comprehension bilan xavfsiz 2D jadval yaratish', '2) Slicing bilan sahifa/oxirgi yozuvlarni olish', '3) Tuple koordinata unpacking va `dict` kaliti'],
      ['1) Safe 2D grid via comprehension', '2) Slicing tail/page view', '3) Tuple unpacking & hashable key'],
      `grid = [[0] * 3 for _ in range(3)]
moves = [(1, 1), (0, 2), (2, 0)]
for r, c in moves:
    grid[r][c] = 1
print("Center:", grid[1][1], "| Last 2 moves:", moves[-2:])`,
    ),
    relatedVideos: ['VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-04-06',
    courseId: 'data_structures',
    moduleId: 'c04_m2',
    order: 6,
    titleUz: 'Sets — noyob elementlar to‘plami',
    titleEn: 'Sets: Uniqueness & O(1) Membership Lookup',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-04-05'],
    conceptId: 'sets_basics',
    whyUz: "Millionta foydalanuvchi ichidan dublikat email larni 1 millisekundda olib tashlash yoki ID ro'yxatida qidiruvni O(n) dan O(1) ga tezlashtirish `set` orqali bajariladi.",
    whyEn: 'Deduplicating millions of IDs and checking membership in constant O(1) hash time makes `set` indispensable.',
    analogyUz: "`set` — bu VIP klub a'zolar daftaridir: bir kishi ro'yxatga faqat 1 marta kiradi, tartib muhim emas, lekin eshikda 'ismingiz bormi?' deb tekshirish bir soniya (O(1)) oladi.",
    analogyEn: 'A `set` is a VIP guest list: duplicates are automatically ignored, order is unimportant, and checking a name is instant O(1).',
    stopsUz: "ENG KENG TARQALGAN XATO: `s = {}` yozsangiz bu `set` EMAS, bo'sh **`dict`** yaratadi! Bo'sh set uchun albatta **`s = set()`** yozing!",
    stopsEn: '`{}` creates an empty `dict`, NOT a `set`! Always create an empty set with `set()`.',
    objUz: ['`set()` va `{a, b}` bilan to‘plam yaratish hamda dublikatlarni yo‘qotish', '`.add()`, `.discard()`, `.remove()` farqini bilish', '`list` vs `set` da `in` qidiruv tezligi (O(n) vs O(1)) ni tushunish'],
    objEn: ['Create sets cleanly (`set()` for empty)', 'Contrast `.add()`, `.discard()`, and `.remove()`', 'Understand O(1) hash membership vs O(n) list scans'],
    theoryUz: `### 1. Set nima?
Tartibsiz (indekssiz!), faqat **noyob (unique)** va hashable elementlardan iborat to‘plam.
### 2. Bo‘sh Set yaratish qoidasi
- \`{}\` -> **dict**!
- \`set()\` -> **bo‘sh set**!
### 3. Metodlar: \`.add()\`, \`.discard()\`, \`.remove()\`
- \`s.add(x)\` — qo‘shadi (bor bo‘lsa indamaydi)
- \`s.remove(x)\` — topilmasa **KeyError** beradi
- \`s.discard(x)\` — topilmasa ham **xato bermaydi** (xavfsiz!)
### 4. Indekslash mumkin emas!
\`s[0]\` -> \`TypeError\`. Tartib kerak bo‘lsa \`sorted(s)\` qiling.
### 5. Hashability talabi
\`list\` ni \`set\` ichiga solib bo‘lmaydi (\`unhashable type: 'list'\`); faqat \`int, str, tuple\` kabi immutable turlar kiradi.`,
    theoryEn: `### 1. What Is a Set?
Unordered collection of unique, hashable elements.
### 2. Empty Set Syntax
Use \`set()\`, never \`{}\` (which creates a dict).
### 3. Safe Mutations
\`add()\`, \`remove()\` (raises KeyError if missing), \`discard()\` (safe no-op if missing).
### 4. No Indexing
\`s[0]\` raises \`TypeError\`. Convert with \`sorted(s)\` when order is needed.
### 5. Hashability
Cannot contain mutable lists or dicts.`,
    examples: [
      ex('Misol 1: Dublikatlarni olib tashlash va bo‘sh set', 'Example 1: Deduplication & Empty Set', `empty_d = {}\nempty_s = set()\nraw_tags = ["py", "sql", "py", "ai", "sql"]\nunique_tags = sorted(set(raw_tags))\nprint("Types:", type(empty_d).__name__, type(empty_s).__name__)\nprint("Unique:", unique_tags)`, `Types: dict set\nUnique: ['ai', 'py', 'sql']`, '`set(raw_tags)` dublikatlarni darhol tozalaydi, `sorted()` esa tartiblab beradi.', '`set()` deduplicates instantly; `sorted()` produces deterministic order.'),
      ex('Misol 2: `.discard()` vs `.remove()`', 'Example 2: Safe Removal with .discard()', `roles = {"user", "editor"}\nroles.add("admin")\nroles.discard("ghost")  # Xato bermaydi!\nprint("Count:", len(roles), "| Has admin:", "admin" in roles)`, `Count: 3 | Has admin: True`, '`.discard()` element bo‘lmasa ham dasturni qulatmaydi.', '`.discard()` safely ignores absent items unlike `.remove()`.'),
      ex('Misol 3: Tartibni saqlab dublikat tozalash', 'Example 3: Order-Preserving Deduplication', `items = ["b", "a", "b", "c", "a"]\nseen = set()\nordered = []\nfor x in items:\n    if x not in seen:\n        seen.add(x)\n        ordered.append(x)\nprint(ordered)`, `['b', 'a', 'c']`, '`set` tezligi (O(1)) + `list` tartibini birlashtirish klassik intervyu yechimidir.', 'Combining a `seen` set with a `list` preserves first-seen order in O(n).'),
    ],
    traceTitleUz: 'Set deduplikatsiya izi',
    traceTitleEn: 'Tracing Order-Preserving Dedupe',
    traceCode: `seen = set()\nout = []\nfor ch in "abac":\n    if ch not in seen:\n        seen.add(ch)\n        out.append(ch)\nprint("".join(out))`,
    traceSteps: [
      traceStep(1, "ch='a'", "seen={'a'}, out=['a']", 'Yangi -> qo‘shildi', 'Added a'),
      traceStep(2, "ch='b'", "seen={'a','b'}, out=['a','b']", 'Yangi -> qo‘shildi', 'Added b'),
      traceStep(3, "ch='a'", "seen={'a','b'}", 'Allaqachon bor -> skip', 'Duplicate skipped'),
      traceStep(4, "ch='c'", "out=['a','b','c']", 'Yangi -> qo‘shildi', 'Added c'),
      traceStep(5, 'print(...)', 'abc', 'Chiqish', 'Output', 'abc'),
    ],
    commonMistakes: [
      mistake('Bo‘sh set uchun `{}` yozish', 'Creating Empty Set with {}', `s = {}\ns.add(10)`, "AttributeError: 'dict' object has no attribute 'add'", `s = set()\ns.add(10)\nprint(s)`, '`{}` bo‘sh dictionary yaratadi!', '`{}` is an empty dict literal.', 'Bo‘sh to‘plam uchun doim `set()` yozing.', 'Always write `set()`.'),
      mistake('`set` ga indeks `s[0]` bilan murojaat qilish', 'Indexing a Set with s[0]', `s = {10, 20}\nprint(s[0])`, "TypeError: 'set' object is not subscriptable", `s = {10, 20}\nprint(min(s))`, 'Set tartibsiz to‘plam bo‘lib, indeksi yo‘q.', 'Sets have no positional index.', 'Tartibli ko‘rish uchun `sorted(s)` ishlating.', 'Convert via `sorted(s)` or `list(s)`.'),
    ],
    compareTitleUz: '`list` vs `set` qidiruvida',
    compareTitleEn: '`list` vs `set` Lookup',
    compareUz: ['`list`: elementlar tartibi va dublikatlar kerak bo‘lganda (`x in lst` -> O(n)).', '`set`: faqat noyob qiymatlar va tezkor `x in s` (O(1)) kerak bo‘lganda.'],
    compareEn: ['`list`: ordered duplicates; `in` scans O(n).', '`set`: unordered uniqueness; `in` hashes in O(1).'],
    compareSummaryUz: 'Tezkor membership tekshiruvi (`if id in blocked_ids:`) uchun har doim `set` ishlating.',
    compareSummaryEn: 'Use `set` whenever checking membership repeatedly.',
    practiceTasks: [
      pt('p0406_1', '1-mashq: Bo‘sh set', 'Task 1: Empty Set', 'Bo‘sh set yaratib unga `5` qo‘shing va uzunligini chiqaring.', 'Create empty set, add 5, print len.', `s = set()\ns.add(5)\nprint(len(s))`, '1', 'set().', 'Use set().'),
      pt('p0406_2', '2-mashq: Dublikat soni', 'Task 2: Unique Count', '`[1, 2, 2, 3, 3, 3]` da nechta noyob son bor?', 'Count unique ints.', `print(len(set([1, 2, 2, 3, 3, 3])))`, '3', 'len(set(...)).', 'Wrap in set().'),
      pt('p0406_3', '3-mashq: discard', 'Task 3: Safe Discard', '`{1, 2}` dan `99` ni xatosiz o‘chirib uzunligini chiqaring.', 'Safely discard 99 and print len.', `s = {1, 2}\ns.discard(99)\nprint(len(s))`, '2', '.discard().', 'Use .discard().'),
      pt('p0406_4', '4-mashq: So‘zlar noyobligi', 'Task 4: Unique Words', '`"go py go".split()` dan noyob so‘zlarni tartiblab chiqaring.', 'Print sorted unique words.', `print(sorted(set("go py go".split())))`, "['go', 'py']", 'sorted(set(...)).', 'Combine set and sorted.'),
      pt('p0406_5', '5-mashq: Qidiruv tezligi', 'Task 5: Membership', '`10 in {5, 10, 15}` ni chiqaring.', 'Check 10 in set.', `print(10 in {5, 10, 15})`, 'True', 'in.', 'Use in.'),
    ],
    quiz: [
      q('q0406_1', '`type({})` natijasi?', 'Result of `type({})`?', ['set', 'dict', 'tuple', 'list'], ['set', 'dict', 'tuple', 'list'], 1, '`dict`.', '`dict`.'),
      q('q0406_2', 'Topilmagan elementda xato bermaydigan o‘chirish metodi?', 'Safe removal method that never raises KeyError?', ['.remove()', '.discard()', '.pop()', '.del()'], ['.remove()', '.discard()', '.pop()', '.del()'], 1, '`.discard()`.', '`.discard()`.'),
      q('q0406_3', '`set` da `x in s` qidiruv tezligi?', 'Average time complexity of `x in my_set`?', ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], 2, 'O(1) hash lookup.', 'O(1).'),
      q('q0406_4', '`set([[1, 2]])` ishlaydimi?', 'Does `set([[1, 2]])` work?', ['Ha', 'Yo‘q, TypeError: unhashable type list', 'Bo‘sh set beradi', 'Faqat 3.12 da'], ['Yes', 'No, TypeError: unhashable type list', 'Empty set', '3.12 only'], 1, 'List unhashable.', 'Lists are unhashable.'),
      q('q0406_5', 'Bo‘sh set qanday yaratiladi?', 'How do you create an empty set?', ['{}', 'set()', '[]', '()'], ['{}', 'set()', '[]', '()'], 1, '`set()`.', '`set()`.'),
    ],
    homework: hw('Takroriy Email Tozalagich', 'Duplicate Email Filter', 'Katta ro‘yxatdagi email manzillarini `.strip().lower()` qilib normallashtiring va tartibni saqlagan holda dublikatlarni olib tashlab nechta noyob hamda nechta dublikat topilganini chiqaring.', 'Normalize emails with `.strip().lower()`, deduplicate preserving first-seen order, and report unique vs duplicate counts.', ['seen = set() ishlating', 'Tartib saqlansin'], ['Use seen = set()', 'Preserve order'], 'if clean not in seen:', 'Track seen emails.', 'Noyob domenlar (`@` dan keyingi qism) sonini ham chiqaring.', 'Also count unique domains.', 20),
    relatedVideos: ['VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-04-07',
    courseId: 'data_structures',
    moduleId: 'c04_m2',
    order: 7,
    titleUz: 'Set Operations — to‘plamlar ustida amallar',
    titleEn: 'Set Algebra: Union, Intersection, Difference & Subsets',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-04-06'],
    conceptId: 'set_operations',
    whyUz: "Ikki foydalanuvchining umumiy do'stlarini topish (`&`), eski va yangi ro'yxat orasidagi farqni aniqlash (`-`) yoki ruxsat huquqlarini tekshirish (`<=`) to'plam algebra amallari bilan bir qatorda yechiladi.",
    whyEn: 'Finding mutual friends (`&`), missing permissions (`-`), combined tags (`|`), and symmetric diffs (`^`) take one operator with sets.',
    analogyUz: "To'plam amallari — bu maktabdagi Venn diagrammalari: `A | B` (ikkalasi birga), `A & B` (kesishgan o'rta qismi), `A - B` (faqat A da borlari).",
    analogyEn: 'Set operations mirror Venn diagrams: `|` unites circles, `&` takes the overlap, `-` keeps only left-side exclusivity.',
    stopsUz: "`|` va `&` operatorlari ikkala tomon ham `set` bo'lishini talab qiladi; `.union(list)` kabi metodlar esa istalgan iterable (masalan, `list`) ni ham qabul qiladi!",
    stopsEn: 'Operators (`|`, `&`, `-`) require both sides to be sets, whereas methods (`.union(lst)`) accept any iterable.',
    objUz: ['Union (`|`), Intersection (`&`), Difference (`-`), Symmetric Difference (`^`) ni qo‘llash', 'Subset (`<=`) va Disjoint (`.isdisjoint()`) tekshiruvlarini bilish', 'Operatorlar vs metodlar farqini ajratish'],
    objEn: ['Compute union (`|`), intersection (`&`), difference (`-`), and symmetric diff (`^`)', 'Check subsets (`<=`) and disjointness (`.isdisjoint()`)', 'Know when to use set methods vs operators'],
    theoryUz: `### 1. To‘rtta asosiy Venn amali
| Operator | Metod | Maʼnosi |
|---|---|---|
| \`A \\| B\` | \`A.union(B)\` | Ikkalasidagi barcha elementlar |
| \`A & B\` | \`A.intersection(B)\` | Ikkalasida ham bor umumiy elementlar |
| \`A - B\` | \`A.difference(B)\` | A da bor, lekin B da yo‘q |
| \`A ^ B\` | \`A.symmetric_difference(B)\` | Faqat bittasida bor (umumiysiz) |
### 2. Qism to‘plamlar (Subsets)
- \`req <= user_perms\`: talab qilingan hamma ruxsatlar foydalanuvchida bormi?
- \`A.isdisjoint(B)\`: umuman umumiy elementi yo‘qmi?
### 3. Amaliy misollar
RBAC ruxsat tekshirish, tavsiya tizimlari (umumiy teglar), fayl sinxronizatsiya (qaysi fayl yangi, qaysisi o‘chirilgan).
### 4. Keng tarqalgan xato
\`A - B\` va \`B - A\` bir xil emas! (Ayirish tartibga bog‘liq).`,
    theoryEn: `### 1. Core Set Algebra
Union (\`|\`), Intersection (\`&\`), Difference (\`-\`), Symmetric Difference (\`^\`).
### 2. Subset & Disjoint Checks
\`required <= granted\` checks permissions cleanly; \`isdisjoint()\` verifies zero overlap.
### 3. Real-World Applications
Role authorization, tag matching, file diffing.
### 4. Asymmetry Note
\`A - B\` differs from \`B - A\`.`,
    examples: [
      ex('Misol 1: Venn amallari amalda', 'Example 1: Venn Set Algebra', `py_devs = {"Ali", "Vali", "Laylo"}\nsql_devs = {"Laylo", "Sardor", "Ali"}\nprint("Both:", sorted(py_devs & sql_devs))\nprint("Only Py:", sorted(py_devs - sql_devs))\nprint("Either:", sorted(py_devs | sql_devs))\nprint("Exclusive:", sorted(py_devs ^ sql_devs))`, `Both: ['Ali', 'Laylo']\nOnly Py: ['Vali']\nEither: ['Ali', 'Laylo', 'Sardor', 'Vali']\nExclusive: ['Sardor', 'Vali']`, 'Bir qatorda umumiy va farqli dasturchilar ajratildi.', 'Single-operator set algebra classifies overlaps cleanly.'),
      ex('Misol 2: Ruxsatlarni `<=` (Subset) bilan tekshirish', 'Example 2: Permission Subset Check', `required = {"read", "export"}\nuser_role = {"read", "write", "export"}\nprint("Allowed?:", required <= user_role)`, `Allowed?: True`, '`required <= user_role` hamma zarur ruxsatlar mavjudligini tekshiradi.', '`<=` confirms all required permissions are granted.'),
      ex('Misol 3: `isdisjoint()` bilan bloklangan teglarni tekshirish', 'Example 3: Disjoint Check', `banned = {"spam", "scam"}\npost_tags = {"python", "tutorial"}\nprint("Clean post?:", post_tags.isdisjoint(banned))`, `Clean post?: True`, 'Kesishma bo‘lmasa `isdisjoint()` `True` qaytaradi.', 'Returns `True` when zero elements overlap.'),
    ],
    traceTitleUz: 'Set farqi va kesishmasi izi',
    traceTitleEn: 'Tracing Set Algebra',
    traceCode: `a = {1, 2, 3}\nb = {2, 3, 4}\nprint(sorted(a & b), sorted(a - b))`,
    traceSteps: [
      traceStep(1, 'a & b', '{2, 3}', 'Umumiy elementlar', 'Intersection'),
      traceStep(2, 'a - b', '{1}', 'Faqat a da bor', 'Difference'),
      traceStep(3, 'print(...)', '[2, 3] [1]', 'Tartiblab chiqarildi', 'Output', '[2, 3] [1]'),
    ],
    commonMistakes: [
      mistake('`A - B` ni `B - A` bilan teng deb o‘ylash', 'Assuming Set Difference Is Symmetric', `a = {1, 2}\nb = {2, 3}\nprint(a - b == b - a)  # False!`, 'Wrong diff direction', `a = {1, 2}\nb = {2, 3}\nprint("a-b:", a - b, "| b-a:", b - a)`, 'Ayirish tartibga bog‘liq (`{1}` vs `{3}`); ikkala farq uchun `^` ishlating.', 'Difference is asymmetric; use `^` for symmetric difference.', 'Nimani nimadan ayirayotganingizni aniq belgilang.', 'Check operand order carefully.'),
      mistake('`set` va `list` ni `|` bilan qo‘shish', 'Using | Between a Set and a List', `s = {1, 2} | [3, 4]`, 'TypeError: unsupported operand type(s) for |', `s = {1, 2}.union([3, 4])\nprint(sorted(s))`, 'Operator `|` ikkala tomon ham `set` bo‘lishini talab qiladi.', '`|` requires both sides to be sets.', 'List bilan `.union(lst)` metodini ishlating.', 'Use `.union(lst)` when combining with a list.'),
    ],
    compareTitleUz: 'Operator (`|`, `&`) vs Metod (`.union()`, `.intersection()`)',
    compareTitleEn: 'Operators vs Methods',
    compareUz: ['Operator (`A & B`): ikkalasi ham `set` bo‘lganda o‘qilishi juda toza.', 'Metod (`A.intersection(my_list)`): `list`/`tuple` bilan to‘g‘ridan-to‘g‘ri ishlaydi.'],
    compareEn: ['Operators: crisp math syntax for two sets.', 'Methods: accept any iterable without casting first.'],
    compareSummaryUz: 'Ikkita set uchun `&`, `|`, `-`, `^` operatorlari eng ixcham tanlovdir.',
    compareSummaryEn: 'Use `&`, `|`, `-`, `^` between sets and methods when passing lists/tuples.',
    practiceTasks: [
      pt('p0407_1', '1-mashq: Umumiy elementlar', 'Task 1: Intersection', '`{1, 2, 3} & {2, 3, 4}` ni tartiblab chiqaring.', 'Print sorted intersection.', `print(sorted({1, 2, 3} & {2, 3, 4}))`, '[2, 3]', '& operatori.', 'Use &.'),
      pt('p0407_2', '2-mashq: Farq', 'Task 2: Difference', '`{"a", "b", "c"} - {"b"}` ni tartiblab chiqaring.', 'Print sorted difference.', `print(sorted({"a", "b", "c"} - {"b"}))`, "['a', 'c']", '- operatori.', 'Use -.'),
      pt('p0407_3', '3-mashq: Simmetrik farq', 'Task 3: Symmetric Diff', '`{1, 2} ^ {2, 3}` ni tartiblab chiqaring.', 'Print sorted symmetric difference.', `print(sorted({1, 2} ^ {2, 3}))`, '[1, 3]', '^ operatori.', 'Use ^.'),
      pt('p0407_4', '4-mashq: Subset', 'Task 4: Subset Check', '`{"read"} <= {"read", "write"}` ni chiqaring.', 'Check subset.', `print({"read"} <= {"read", "write"})`, 'True', '<=.', 'Use <=.'),
      pt('p0407_5', '5-mashq: List bilan union', 'Task 5: Union with List', '`{1, 2}.union([2, 3])` ni tartiblab chiqaring.', 'Union set with list.', `print(sorted({1, 2}.union([2, 3])))`, '[1, 2, 3]', '.union().', 'Use .union().'),
    ],
    quiz: [
      q('q0407_1', '`{1, 2} & {2, 3}` nimani beradi?', 'Result of `{1, 2} & {2, 3}`?', ['{1, 2, 3}', '{2}', '{1, 3}', 'set()'], ['{1, 2, 3}', '{2}', '{1, 3}', 'set()'], 1, '`{2}`.', '`{2}`.'),
      q('q0407_2', '`{1, 2} - {2, 3}` natijasi?', 'Result of `{1, 2} - {2, 3}`?', ['{1}', '{3}', '{1, 3}', '{2}'], ['{1}', '{3}', '{1, 3}', '{2}'], 0, '`{1}`.', '`{1}`.'),
      q('q0407_3', '`{1, 2} ^ {2, 3}` natijasi?', 'Result of `{1, 2} ^ {2, 3}`?', ['{2}', '{1, 3}', '{1, 2, 3}', 'Error'], ['{2}', '{1, 3}', '{1, 2, 3}', 'Error'], 1, 'Faqat birida borlar -> `{1, 3}`.', '`{1, 3}`.'),
      q('q0407_4', 'Qaysi metod umuman umumiy element yo‘qligini tekshiradi?', 'Which method checks for zero overlap?', ['.issubset()', '.isdisjoint()', '.union()', '.clear()'], ['.issubset()', '.isdisjoint()', '.union()', '.clear()'], 1, '`.isdisjoint()`.', '`.isdisjoint()`.'),
      q('q0407_5', '`{1} | [2]` ishlaydimi?', 'Does `{1} | [2]` succeed?', ['Ha', 'Yo‘q, TypeError (method .union kerak)', 'SyntaxError', 'True'], ['Yes', 'No, TypeError (use .union())', 'SyntaxError', 'True'], 1, 'TypeError.', 'TypeError.'),
    ],
    homework: hw('Vakansiya Ko‘nikmalari Moslashtirgichi', 'Job Skill Matcher', 'Nomzod ko‘nikmalari va vakansiya talablari setlari orasida: mos kelganlar (`&`), yetishmayotganlar (`req - cand`), ortiqcha ko‘nikmalar va 100% moslik (`<=`) hisobotini chiqaring.', 'Compare candidate skills vs required job skills computing matched, missing, extra, and full-match status.', ['Kamida 3 ta to‘plam operatori ishlating', 'Moslik foizini hisoblang'], ['Use 3 set operators', 'Compute match %'], 'pct = round(len(req & cand) / len(req) * 100)', 'Divide intersection by required.', 'Bir nechta nomzodni solishtiring.', 'Rank multiple candidates.', 20),
    relatedVideos: ['VIDEO-COREY-001'],
  }),
];
