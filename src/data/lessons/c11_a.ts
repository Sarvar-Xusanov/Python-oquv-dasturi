import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C11_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-11-01',
    courseId: 'algorithms',
    moduleId: 'c11_m1',
    order: 1,
    titleUz: 'Algorithm tushunchasi va muammoni modellashtirish',
    titleEn: 'What Is an Algorithm? Problem Decomposition & Correctness',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-10-13'],
    conceptId: 'algo_intro',
    whyUz: "Har bir senior dasturchi kod yozishdan oldin masalani aniq bosqichlarga bo‘ladi: kirish (`input`), cheklovlar (`constraints`), chekka holatlar (`edge cases`), to‘g‘rilik va samaradorlik. **Algoritmik fikrlash** nafaqat Google/FAANG intervyularida, balki har kuni sekin ishlaydigan backend so‘rovlarini 1000x tezlatishda ham asqotadi!",
    whyEn: 'An algorithm is a finite, unambiguous step-by-step procedure transforming valid inputs into verified outputs—even on edge cases like empty lists or duplicate values.',
    analogyUz: "**Algoritm** — bu aniq grammlari, harorati va ketma-ketligi yozilgan oshpaz retsepti: xuddi shu retsept bo‘yicha kim pishirsa ham bir xil taom chiqadi, tuz solishni unutib qo‘yish (edge case!) ham oldindan tekshiriladi.",
    analogyEn: 'An algorithm is a deterministic recipe with exact inputs, invariants, and checks for edge cases like an empty pan or duplicate ingredients.',
    stopsUz: "Algoritm yozishda 1-xato: darhol kod yozishga sho‘ng‘ib, **chekka holatlarni** (bo‘sh ro‘yxat `[]`, bitta element `[x]`, manfiy sonlar, takroriy qiymatlar) unutish! Har doim 3 ta savol bering: 1) Kirish nima? 2) Chiqish nima? 3) Edge case larda sinmaydimi?",
    stopsEn: 'Never jump straight into coding without defining inputs, outputs, and edge cases (`[]`, `[x]`, negatives, duplicates). Verify correctness with invariants and assertions.',
    objUz: ['Algoritmning 5 ta sharti (aniqlik, cheklilik, kirish, chiqish, samaradorlik) ni bilish', 'Brute-force (sodda) yechimdan optimal (hash set / two-pass) yechimga o‘tish', 'Edge case lar (`[]`, 1 ta element, duplicate) uchun `assert` testlar yozish'],
    objEn: ['State core properties of a valid algorithm (finiteness, determinism, correctness)', 'Contrast brute-force nested loops vs hash-set single-pass improvements', 'Guard against edge cases (`[]`, singletons, duplicates) with assertions'],
    theoryUz: `### 1. Algoritm Nima?
Chekli sondagi aniq, ikkilanishsiz qadamlardan iborat muammo yechish usuli.
### 2. Masalani Yechishning 4 Qadami
1. **Understand & Edge Cases**: bo‘sh kirish, manfiy qiymat, tartib.
2. **Brute-Force**: avval to‘g‘ri ishlaydigan sodda yechim toping.
3. **Optimize**: takroriy ishni olib tashlang (\`set\` / \`dict\` / tartib).
4. **Verify**: \`assert\` lar bilan tekshiring.
### 3. Loop Invariant
Siklning har bir qadamidan keyin ham to‘g‘ri qoladigan qoida (masalan: \`max_so_far\` shu paytgacha ko‘rilgan eng katta son).
### 4. Keng tarqalgan xato
\`[1, 2, 3]\` uchun ishlaydigan kod yozib, \`[]\` berilganda \`IndexError\` olish.`,
    theoryEn: `### 1. Definition
A finite, unambiguous sequence of steps guaranteed to terminate with the correct output.
### 2. 4-Step Problem Workflow
Clarify constraints & edge cases -> Sketch brute-force -> Optimize bottlenecks -> Assert edge cases.
### 3. Loop Invariants
Conditions remaining true before and after every iteration (e.g., \`best\` holds the maximum seen so far).
### 4. Edge-Case Blindness
Always test empty collections, single-element lists, and duplicates.`,
    examples: [
      ex('Misol 1: Edge-case xavfsiz `max_value` va Loop Invariant', 'Example 1: Safe Max with Edge Case Guard', `def safe_max(nums: list[int]) -> int | None:\n    if not nums:\n        return None\n    best = nums[0]\n    for x in nums[1:]:\n        if x > best:\n            best = x\n    return best\n\nprint(safe_max([]), safe_max([7]), safe_max([-5, -2, -9]))`, `None 7 -2`, 'Bo‘sh ro‘yxatda `None`, manfiylarda esa `0` emas `-2` to‘g‘ri topildi!', 'Handles empty lists and all-negative inputs without assuming `best = 0`.'),
      ex('Misol 2: Brute-force O(n^2) vs Set O(n) takror topish', 'Example 2: Brute Force vs Set Lookup', `def has_dup_fast(nums: list[int]) -> bool:\n    seen: set[int] = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n\nprint(has_dup_fast([1, 2, 3]), has_dup_fast([1, 2, 1]))`, `False True`, '`set` bilan tekshirish bir o‘tishdayoq natija beradi.', 'A hash set finds duplicates in a single pass instead of nested pairs.'),
      ex('Misol 3: `assert` bilan algoritmni tekshirish', 'Example 3: Verification Table with Asserts', `def is_sorted(xs: list[int]) -> bool:\n    return all(xs[i] <= xs[i + 1] for i in range(len(xs) - 1))\n\nfor case, exp in [([], True), ([5], True), ([1, 2, 2], True), ([3, 1], False)]:\n    assert is_sorted(case) == exp\nprint("All 4 edge cases passed!")`, `All 4 edge cases passed!`, 'Bo‘sh va 1-elementli ro‘yxatlarda ham sikl xatosiz o‘tdi.', 'Tests empty, singleton, duplicate, and unsorted arrays cleanly.'),
    ],
    traceTitleUz: 'Loop invariant izi',
    traceTitleEn: 'Tracing Max Loop Invariant',
    traceCode: `nums = [4, 9, 2]\nbest = nums[0]\nfor x in nums[1:]:\n    if x > best: best = x\nprint(best)`,
    traceSteps: [
      traceStep(1, 'best = 4', 'best=4', '1-element boshlang‘ich invariant', 'Initialized best=4'),
      traceStep(2, 'x = 9', 'best=9', '9 > 4 -> yangilandi', 'Updated best=9'),
      traceStep(3, 'x = 2', 'best=9', '2 > 9 False -> saqlandi', 'Kept best=9', '9'),
    ],
    commonMistakes: [
      mistake('`best = 0` deb olib manfiy sonlarda xato qilish', 'Assuming best = 0 for Maximum', `def bad_max(nums):\n    best = 0\n    for x in nums:\n        if x > best: best = x\n    return best\nprint("bad_max([-5, -2]):", bad_max([-5, -2]))`, 'Returns 0 instead of -2!', `def good_max(nums):\n    best = nums[0]\n    for x in nums[1:]:\n        if x > best: best = x\n    return best\nprint("good_max([-5, -2]):", good_max([-5, -2]))`, '`0` ro‘yxatda bo‘lmasa ham javob `0` chiqib qoladi!', '`best = 0` breaks on all-negative inputs.', 'Doim `best = nums[0]` (bo‘sh bo‘lmaganida) dan boshlang.', 'Initialize `best` from `nums[0]`.'),
      mistake('Bo‘sh kirish `[]` ni tekshirmaslik', 'Ignoring Empty Input Edge Case', `# Accessing nums[0] on [] raises IndexError!`, 'IndexError: list index out of range', `print("Check if not nums: before indexing nums[0]!")`, 'Bo‘sh ro‘yxat eng ko‘p uchraydigan edge case.', 'Empty inputs are the #1 edge-case crash.', 'Avval `if not nums:` shartini qo‘ying.', 'Guard empty inputs up front.'),
    ],
    compareTitleUz: 'Brute-Force vs Optimal Algoritm',
    compareTitleEn: 'Brute-Force vs Optimized',
    compareUz: ['Brute-Force: yozishga oson, kichik `n` da xatosiz tekshiruv (reference test) sifatida zo‘r.', 'Optimal (`set`/`dict`/sort): katta `n` da sekundlarni millisekundga tushiradi.'],
    compareEn: ['Brute-force: simple baseline ideal for verifying correctness on tiny inputs.', 'Optimized: essential when input scale `n` grows large.'],
    compareSummaryUz: 'Kod yozishdan oldin chekka holatlarni (`[]`, `[x]`, manfiy, duplicate) aniqlab, avval to‘g‘ri ishlaydigan sodda yechim, so‘ng optimal yechim quring.',
    compareSummaryEn: 'Define inputs, edge cases, and invariants first; verify a simple baseline before optimizing.',
    practiceTasks: [
      pt('p1101_1', '1-mashq: Edge-case xavfsiz `min_val`', 'Task 1: Safe Minimum', 'Bo‘sh bo‘lsa `None`, aks holda eng kichik sonni qaytaring (built-in `min` siz).', 'Find min manually.', `def my_min(xs):\n    if not xs: return None\n    m = xs[0]\n    for x in xs[1:]:\n        if x < m: m = x\n    return m\nprint(my_min([]), my_min([-3, -9, 1]))`, 'None -9', 'Start at xs[0]', 'Prints None -9.'),
      pt('p1101_2', '2-mashq: Ikki yig‘indi (`set` yordamida)', 'Task 2: Two-Sum Exists', '`nums` da yig‘indisi `target` ga teng 2 ta son borligini `set` bilan tekshiring.', 'Check two-sum with set.', `def has_pair(nums, target):\n    seen = set()\n    for x in nums:\n        if target - x in seen: return True\n        seen.add(x)\n    return False\nprint(has_pair([2, 7, 11], 9), has_pair([1, 2], 10))`, 'True False', 'target - x in seen', 'Prints True False.'),
      pt('p1101_3', '3-mashq: Tartibni tekshirish', 'Task 3: Verify Sorted', 'Ro‘yxat kamaymaydigan tartibdaligini `assert` lar bilan tasdiqlang.', 'Check non-decreasing order.', `def sorted_ok(xs): return all(xs[i] <= xs[i+1] for i in range(len(xs)-1))\nprint(sorted_ok([]), sorted_ok([1, 2, 2]), sorted_ok([2, 1]))`, 'True True False', 'all(xs[i] <= xs[i+1])', 'Prints True True False.'),
      pt('p1101_4', '4-mashq: Unikal tartib saqlash', 'Task 4: Stable Deduplicate', 'Tartibni buzmay takrorlarni olib tashlang (`[3, 1, 3, 2]`).', 'Deduplicate keeping order.', `def dedup(xs):\n    seen, out = set(), []\n    for x in xs:\n        if x not in seen:\n            seen.add(x); out.append(x)\n    return out\nprint(dedup([3, 1, 3, 2]))`, '[3, 1, 2]', 'Track seen in a set', 'Prints [3, 1, 2].'),
      pt('p1101_5', '5-mashq: Palindrom edge case', 'Task 5: Empty & Single Palindrome', '`""` va `"a"` palindrom ekanini tekshiring.', 'Check palindrome helper.', `def is_pal(s): return s == s[::-1]\nprint(is_pal(""), is_pal("a"), is_pal("ab"))`, 'True True False', 's == s[::-1]', 'Prints True True False.'),
    ],
    quiz: [
      q('q1101_1', 'Algoritm yozishda eng birinchi qadam nima bo‘lishi kerak?', 'What should be the first step before coding an algorithm?', ['Darhol sikl yozish', 'Kirish/chiqish, cheklovlar va chekka holatlarni (edge cases) aniqlash', 'Global o‘zgaruvchi ochish', 'Kodni qisqartirish'], ['Code loops immediately', 'Clarify inputs, outputs, constraints, and edge cases', 'Add globals', 'Golf code'], 1, 'Cheklovlar va chekka holatlarni aniqlash.', 'Clarify constraints and edge cases.'),
      q('q1101_2', 'Manfiy sonlardan iborat ro‘yxatda `best = 0` deb maksimum izlash qaysi xatoga olib keladi?', 'Bug when initializing `best = 0` to find the maximum of negative numbers?', ['SyntaxError', 'Ro‘yxatda bo‘lmagan `0` ni eng katta deb qaytaradi', 'Infinite loop', 'MemoryError'], ['SyntaxError', 'Returns 0 instead of the true negative max', 'Infinite loop', 'MemoryError'], 1, '`0` ni noto‘g‘ri qaytaradi.', 'Returns 0 incorrectly.'),
      q('q1101_3', '`Loop Invariant` nimani anglatadi?', 'What is a Loop Invariant?', ['Hech qachon tugamaydigan sikl', 'Siklning har bir iteratsiyasi oldidan va keyin to‘g‘ri qoladigan mantiqiy shart', 'O‘zgarmas son', 'break operatori'], ['Infinite loop', 'A condition preserved before and after every loop iteration', 'Constant int', 'break keyword'], 1, 'Har qadamda saqlanuvchi to‘g‘rilik sharti.', 'Condition maintained across iterations.'),
      q('q1101_4', 'Takroriy elementni tekshirishda `set` ishlatish nimani yaxshilaydi?', 'Why use a `set` instead of nested loops for duplicate checks?', ['Xotirani o‘chiradi', 'Qidiruvni O(n^2) dan bitta o‘tishli O(n) ga tushiradi', 'Tartiblaydi', 'Syntaxni qisqartiradi'], ['Frees RAM', 'Reduces duplicate check from O(n^2) to single-pass O(n)', 'Sorts', 'Shorter syntax'], 1, 'O(n^2) dan O(n) ga tezlashtiradi.', 'Speeds up to O(n).'),
      q('q1101_5', 'Qaysi kirishlar "edge cases" (chekka holatlar) ga kiradi?', 'Which inputs are classic algorithm edge cases?', ['Faqat [1, 2, 3]', 'Bo‘sh `[]`, 1 ta element `[x]`, hamma elementlar bir xil, manfiy sonlar', 'Faqat 10 ta son', 'Faqat musbat sonlar'], ['[1, 2, 3]', 'Empty `[]`, singleton `[x]`, duplicates, negatives', 'Ten items', 'Positives only'], 1, 'Bo‘sh, bitta element, duplicate va manfiylar.', 'Empty, singleton, duplicates, negatives.'),
    ],
    homework: hw('Two-Sum va Edge Case Test Majmuasi', 'Two-Sum Indices Solver', 'Qaytarilgan indekslar bilan `two_sum(nums, target)` (O(n) lug‘at bilan) funksiyasini yozing va bo‘sh ro‘yxat, bitta element, duplicate `[3, 3]`, manfiy sonlar `[-3, 4, 3]` bo‘yicha 6 ta `assert` testidan o‘tkazing.', 'Implement O(n) `two_sum(nums, target) -> tuple[int, int] | None` using a dictionary and assert 6 edge cases including `[3, 3]` and negative integers.', ['O(n) bitta sikl + dict', '6 ta assert edge-case testi'], ['Single-pass O(n) dict', '6 assert edge-case tests'], 'need = target - x; if need in seen: return (seen[need], i)', 'Store index in seen dict.', '3 ta son yig‘indisi (`three_sum`) varianti haqida fikrlang.', 'Extend to unique triplets.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-02',
    courseId: 'algorithms',
    moduleId: 'c11_m1',
    order: 2,
    titleUz: 'Time Complexity va Space Complexity (+ Review #23)',
    titleEn: 'Time & Space Complexity Analysis (+ Review #23)',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-11-01'],
    conceptId: 'algo_complexity',
    whyUz: "Nega sizning kodingiz 100 ta foydalanuvchida 1 ms ishlab, 100,000 ta foydalanuvchida serverni qotirib qo‘ydi? Chunki kirish hajmi `n` oshishi bilan qadamlar soni (**Time Complexity**) va qo‘shimcha RAM (**Space Complexity**) turlicha o‘sadi — Python da `x in list` vs `x in set` buning eng yorqin misoli!",
    whyEn: 'Analyze how operation counts (Time) and extra memory (Space) scale with input size `n`, and learn Python built-in complexities (`list` vs `dict`/`set` vs `str` joins).',
    analogyUz: "**Time Complexity** — bu mashina tezligi emas, yo‘l uzunligi `n` oshganda qadamlar sonining o‘sish shakli! 10 baravar ko‘p mehmon kelganda ham 10 baravar ko‘p vaqt ketsa — chiziqli; 100 baravar ko‘p ketsa — kvadratik!",
    analogyEn: 'Complexity measures how work scales as input size `n` grows—not raw clock seconds on one laptop.',
    stopsUz: "Python da **eng ko‘p uchraydigan yashirin sekinliklar**: 1) Sikl ichida `s += chunk` satr qo‘shish ba’zan O(n^2) bo‘ladi — `''.join(parts)` ishlating! 2) `x in my_list` O(n), `x in my_set` esa O(1)! 3) `list.pop(0)` O(n), `deque.popleft()` O(1)!",
    stopsEn: 'Watch out for hidden Python costs: `x in list` is O(n) (vs O(1) for `set`/`dict`), `list.pop(0)` is O(n) (vs O(1) for `deque.popleft()`), and repeated string concatenation in loops can degrade compared to `"".join(parts)`.',
    objUz: ['Kodning qadamlar sonini `n` ga bog‘liq formula (`T(n)`) sifatida sanash', 'Qo‘shimcha xotira (**Auxiliary Space**) — O(1) in-place vs O(n) nusxa farqini tushunish', 'Python `list`, `set`, `dict`, `deque` amallari murakkabligini bilish'],
    objEn: ['Count operations as a function of input size `n`', 'Distinguish O(1) in-place auxiliary space from O(n) extra allocations', 'Know standard Python container complexities (`list`, `set`, `dict`, `deque`)'],
    theoryUz: `### 1. Time Complexity — Qadamlar O‘sishi
Noutbuk protsessoriga emas, kirish o‘lchami \`n\` ga nisbatan qancha asosiy operatsiya bajarilishiga qaraymiz.
### 2. Space Complexity — Qo‘shimcha Xotira
- **O(1) Auxiliary Space**: faqat bir nechta o‘zgaruvchi (\`i\`, \`total\`, \`low/high\`).
- **O(n) Space**: yangi ro‘yxat/set yaratish yoki \`n\` chuqurlikdagi rekursiya steki!
### 3. Python Container Cheat-Sheet
- \`list[i]\`, \`list.append()\`, \`list.pop()\`: **O(1)**
- \`x in list\`, \`list.insert(0, x)\`, \`list.pop(0)\`: **O(n)**
- \`x in set/dict\`, \`dict[k]\`: **O(1)** (o‘rtacha)
- \`sorted(xs)\`: **O(n log n)** va O(n) xotira!
### 4. Keng tarqalgan xato
\`for x in list_a: if x in list_b:\` deb O(n * m) yozish — \`set(list_b)\` bilan u O(n + m) bo‘ladi!`,
    theoryEn: `### 1. Time Complexity
Express growth of primitive operations relative to input size \`n\`, independent of hardware speed.
### 2. Auxiliary Space Complexity
Count extra memory beyond the input itself—including new collections and recursion call frames.
### 3. Python Built-in Costs
\`list[i]\`, \`append\`, \`set/dict\` lookup are O(1); \`x in list\` and \`list.pop(0)\` are O(n); Timsort (\`sorted\`) is O(n log n).
### 4. Nested Membership Trap
\`for x in A: if x in B_list:\` is O(|A| * |B|); convert \`B\` to a \`set\` first for O(|A| + |B|).`,
    examples: [
      ex('Misol 1: O(n^2) List vs O(n) Set kesishma qadamlarini sanash', 'Example 1: Counting Steps — List vs Set Lookup', `def count_list_ops(a: list[int], b: list[int]) -> int:\n    ops = 0\n    for x in a:\n        for y in b:\n            ops += 1\n            if x == y: break\n    return ops\n\ndef count_set_ops(a: list[int], b: list[int]) -> int:\n    ops = len(b)\n    b_set = set(b)\n    for x in a:\n        ops += 1\n        _ = x in b_set\n    return ops\n\na, b = list(range(50)), list(range(50, 100))\nprint("O(n*m) ops:", count_list_ops(a, b), "| O(n+m) ops:", count_set_ops(a, b))`, `O(n*m) ops: 2500 | O(n+m) ops: 100`, '50 ta elementdayoq 2500 ta taqqoslash 100 ta qadamga tushdi!', 'Converting `b` to a `set` drops operations from 2500 to 100 on just 50 items.'),
      ex('Misol 2: Space Complexity — O(1) vs O(n)', 'Example 2: O(1) In-Place vs O(n) Space', `def reverse_copy(xs: list[int]) -> list[int]:   # O(n) space\n    return xs[::-1]\n\ndef reverse_inplace(xs: list[int]) -> None:     # O(1) space\n    l, r = 0, len(xs) - 1\n    while l < r:\n        xs[l], xs[r] = xs[r], xs[l]\n        l += 1; r -= 1\n\narr = [1, 2, 3, 4]\ncp = reverse_copy(arr)\nreverse_inplace(arr)\nprint("copy:", cp, "| in-place:", arr)`, `copy: [4, 3, 2, 1] | in-place: [4, 3, 2, 1]`, 'Two-pointer almashtirish yangi ro‘yxat ochmasdan O(1) qo‘shimcha xotirada ishlaydi.', 'Two-pointer in-place reversal uses O(1) extra memory.'),
      ex('Misol 3: `"".join(parts)` bilan satr yig‘ish', 'Example 3: Linear String Join', `parts = [str(i) for i in range(5)]\nprint("-".join(parts))`, `0-1-2-3-4`, '`join()` umumiy uzunlikni oldindan hisoblab O(n) da yig‘adi.', '`str.join()` pre-computes total buffer size for clean O(n) concatenation.'),
    ],
    traceTitleUz: 'Sikl operatsiyalarini sanash izi',
    traceTitleEn: 'Tracing Loop Step Counts',
    traceCode: `n = 4\nops = 0\nfor i in range(n):\n    for j in range(i + 1, n):\n        ops += 1\nprint("pairs:", ops)`,
    traceSteps: [
      traceStep(1, 'i = 0', 'j = 1,2,3 -> ops=3', '3 ta juftlik', '3 pairs'),
      traceStep(2, 'i = 1', 'j = 2,3 -> ops=5', '+2 juftlik', '+2 pairs'),
      traceStep(3, 'i = 2', 'j = 3 -> ops=6', 'n*(n-1)/2 = 6', 'Total 6 pairs', 'pairs: 6'),
    ],
    commonMistakes: [
      mistake('`for` sikli ichida `x in big_list` tekshirish', 'Hidden O(n) Lookup Inside a Loop', `# Checking 'if x in list_b' inside 'for x in list_a' turns O(n) into O(n^2)!`, 'Slow quadratic scan on large data', `b_set = set([10, 20, 30])\nprint([x for x in [5, 20] if x in b_set])`, '`in list` chiziqli qidiruv — tashqi sikl bilan kvadratik bo‘ladi.', 'List membership is O(n), multiplying the outer loop to O(n^2).', 'Qidiriladigan kolleksiyani oldindan `set()` qiling.', 'Pre-convert lookup targets to a `set`.'),
      mistake('Rekursiyaning stack xotirasini (Space) unutish', 'Forgetting Recursion Call-Stack Space', `# Recursive function of depth n uses O(n) call stack space even with no lists!`, 'O(n) hidden stack space (and RecursionError > 1000)', `print("Iterative loops keep Space at O(1)!")`, 'Har bir rekursiya chaqiruvi call stack da ramka ochadi.', 'Each active recursive frame consumes stack memory.', 'Chuqur sikllarda iterativ O(1) yechimni afzal ko‘ring.', 'Prefer iterative O(1) space when depth can grow.'),
    ],
    compareTitleUz: 'O(1) In-Place vs O(n) Extra Space',
    compareTitleEn: 'In-Place O(1) Space vs O(n) Copy',
    compareUz: ['O(1) in-place: katta massivlarda RAM tejaydi, lekin asl ro‘yxatni o‘zgartiradi.', 'O(n) yangi obyekt: asl ma’lumotni buzmaydi (immutability), kichik/o‘rta hajmda xavfsizroq.'],
    compareEn: ['O(1) in-place: minimizes RAM at scale while mutating input.', 'O(n) copy: preserves input immutability for callers.'],
    compareSummaryUz: 'Python da `set`/`dict` O(1) qidiruvini va `deque` O(1) `popleft()` ini ishlating — va doim ham vaqt, ham xotira murakkabligini baholang.',
    compareSummaryEn: 'Pair O(1) `set`/`dict`/`deque` primitives with explicit time and auxiliary space analysis.',
    practiceTasks: [
      pt('p1102_1', '1-mashq: Umumiy elementlarni O(n+m) topish', 'Task 1: Fast Intersection', 'Ikki ro‘yxat kesishmasini `set` yordamida saralangan holda chiqaring.', 'Intersect via set.', `a, b = [4, 1, 2], [2, 3, 4]\nprint(sorted(set(a) & set(b)))`, '[2, 4]', 'set(a) & set(b)', 'Prints [2, 4].'),
      pt('p1102_2', '2-mashq: O(1) xotirali `in-place` aylantirish', 'Task 2: In-Place Reverse', '`xs = [1, 2, 3]` ni yangi ro‘yxat ochmay almashtiring.', 'Swap two pointers.', `xs = [1, 2, 3]\nl, r = 0, len(xs) - 1\nwhile l < r: xs[l], xs[r] = xs[r], xs[l]; l += 1; r -= 1\nprint(xs)`, '[3, 2, 1]', 'l += 1; r -= 1', 'Prints [3, 2, 1].'),
      pt('p1102_3', '3-mashq: Juftliklar soni formulasi', 'Task 3: Count Unique Pairs', '`n = 5` uchun `n * (n - 1) // 2` ni chiqaring.', 'Compute pair count.', `n = 5\nprint(n * (n - 1) // 2)`, '10', 'n*(n-1)//2', 'Prints 10.'),
      pt('p1102_4', '4-mashq: O(1) `deque.popleft()`', 'Task 4: Deque Left Pop', '`deque([10, 20, 30])` dan chap elementni O(1) da chiqaring.', 'Use popleft().', `from collections import deque\nq = deque([10, 20, 30])\nprint(q.popleft(), list(q))`, '10 [20, 30]', 'q.popleft()', 'Prints 10 [20, 30].'),
      pt('p1102_5', '5-mashq: `"".join()` bilan O(n) matn', 'Task 5: Linear String Build', '`["a", "b", "c"]` ni `"".join()` bilan birlashtiring.', 'Join list in O(n).', `print("".join(["a", "b", "c"]))`, 'abc', '"".join(...)', 'Prints abc.'),
    ],
    quiz: [
      q('q1102_1', 'Python `set` va `dict` da `x in container` o‘rtacha Time Complexity si qancha?', 'Average Time Complexity of `x in my_set` in Python?', ['O(n)', 'O(1)', 'O(n^2)', 'O(log n)'], ['O(n)', 'O(1)', 'O(n^2)', 'O(log n)'], 1, 'Hash jadval tufayli o‘rtacha O(1).', 'Average O(1) hash lookup.'),
      q('q1102_2', 'Python `list.pop(0)` ning Time Complexity si nechaga teng?', 'Time Complexity of `list.pop(0)`?', ['O(1)', 'O(n) — qolgan barcha elementlar chapga suriladi', 'O(log n)', 'O(n^2)'], ['O(1)', 'O(n) due to shifting all trailing elements', 'O(log n)', 'O(n^2)'], 1, 'O(n), chunki hamma element suriladi.', 'O(n) array shift.'),
      q('q1102_3', '`for i in range(n): for j in range(n):` ichma-ich sikl murakkabligi?', 'Time Complexity of two full nested `range(n)` loops?', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'], ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'], 2, 'O(n^2).', 'O(n^2).'),
      q('q1102_4', 'Faqat 2 ta indeks o‘zgaruvchisi (`l`, `r`) ishlatuvchi in-place algoritmning Space Complexity si?', 'Auxiliary Space Complexity of an in-place two-pointer swap?', ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], 1, 'O(1) doimiy xotira.', 'O(1) constant extra space.'),
      q('q1102_5', 'Python `sorted(xs)` (Timsort) o‘rtacha/eng yomon Time Complexity si?', 'Time Complexity of Python’s `sorted(xs)`?', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'], ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'], 1, 'O(n log n).', 'O(n log n).'),
    ],
    homework: hw('Complexity Benchmark Tahlili', 'List vs Set Step Counter', '`list` va `set` da 1000 ta element ichidan 1000 ta so‘rovni tekshiruvchi qadam sanagich (`ops`) yozing va `time.perf_counter()` da farqini chiqaring.', 'Measure both comparison counts and elapsed `perf_counter()` timings comparing `x in list` vs `x in set` for 1,000 queries.', ['Operatsiyalar soni + perf_counter taqqoslash', 'Set versiyasi ancha tez chiqishi'], ['Compare step counts and runtime', 'Demonstrate speedup'], 't0 = time.perf_counter(); ...; dt = time.perf_counter() - t0', 'Time cleanly.', 'Kichik `n` vs katta `n` nisbatini jadval qiling.', 'Print scaling ratio table.', 25),
    reviewCheckpoint: review(
      23,
      'Review Loyiha #23: Async + Algoritmik Samaradorlik (115-dars Marrasi!)',
      'Review Project #23: Fast Set Deduplication & Complexity Guard',
      '115-dars marrasi! Katta hajmli kirishlarda O(n^2) to‘siqni O(n) `set`/`dict` algoritmiga aylantirib, edge-case `assert` testlari bilan tasdiqlang.',
      '115-lesson milestone! Refactor an O(n^2) duplicate-finding scan into O(n) set/dict logic verified across edge-case assertions.',
      ['Bo‘sh `[]`, `[x]`, manfiy va duplicate testlari', 'Qadam hisoblagich (`ops`) O(n) isboti', 'O(n) vaqt + aniq chiqish'],
      ['Edge-case assertions', 'O(n) operation counter verification', 'Clean deduplicated summary'],
      `def fast_common(a: list[int], b: list[int]) -> list[int]:
    if not a or not b:
        return []
    b_set = set(b)
    seen, out = set(), []
    for x in a:
        if x in b_set and x not in seen:
            seen.add(x)
            out.append(x)
    return out

assert fast_common([], [1]) == []
assert fast_common([3, 1, 3, 2], [2, 3, 3]) == [3, 2]
print("Verified O(n+m):", fast_common([3, 1, 3, 2], [2, 3, 3]))
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-03',
    courseId: 'algorithms',
    moduleId: 'c11_m1',
    order: 3,
    titleUz: 'Big O Notation — O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)',
    titleEn: 'Big O Notation: Asymptotic Growth Classes',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-11-02'],
    conceptId: 'algo_big_o',
    whyUz: "Agar hamkasbingiz kodingizga qarab \"Bu O(n²) ekan, O(n log n) ga tushira olamizmi?\" desa, nima nazarda tutilayotganini soniyada tushunishingiz kerak. **Big O Notation** — barcha dasturchilar orasidagi algoritm tezligi haqidagi umumiy xalqaro til!",
    whyEn: 'Big O notation drops constant factors and lower-order terms to classify asymptotic upper-bound scaling across O(1), O(log n), O(n), O(n log n), O(n^2), and O(2^n).',
    analogyUz: "**Big O** — bu poyezd va samolyot tezligini 10,000 km masofada solishtirish: aeroportga kirishdagi 10 daqiqalik chipta tekshiruvi (konstanta!) masofa katta bo‘lganda ahamiyatsiz — asosiy narsa tezlik o‘sish qonunidir!",
    analogyEn: 'Big O ignores startup constants and small terms because as `n` reaches millions, only the dominant growth curve matters.',
    stopsUz: "Big O ni soddalashtirishning 3 oltin qoidasi: 1) **Konstantalarni tashlang**: `O(2n + 5)` -> **`O(n)`**! 2) **Kichik hadlarni tashlang**: `O(n² + n)` -> **`O(n²)`**! 3) **Har xil kirishlarni qo‘shmang**: `a` (uzunlik `n`) va `b` (uzunlik `m`) bo‘lsa `O(n + m)` (yoki ichma-ichda `O(n * m)`), `O(n)` emas!",
    stopsEn: 'Big O simplification rules: drop constant factors (`2n -> O(n)`), keep only the dominant term (`n^2 + n -> O(n^2)`), and keep distinct input variables separate (`O(n + m)`, not `O(n)`).',
    objUz: ['O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) iyerarxiyasini bilish', 'Konstanta va past darajali hadlarni tashlab Big O chiqarish', 'Big O (worst-case), Omega (best-case) va Amortized O(1) (`list.append`) farqini bilish'],
    objEn: ['Order complexity classes from O(1) through O(2^n)', 'Simplify expressions like `3n^2 + 100n + 5` down to `O(n^2)`', 'Understand Amortized O(1) on dynamic arrays (`list.append`)'],
    theoryUz: `### 1. Eng Muhim Big O Sinflari (n = 1,000,000 da)
- **O(1)** (Constant): \`1\` qadam — \`dict[k]\`, \`arr[0]\`.
- **O(log n)** (Logarithmic): ~\`20\` qadam — Binary Search!
- **O(n)** (Linear): \`1,000,000\` qadam — bitta \`for\` sikl.
- **O(n log n)** (Linearithmic): ~\`20,000,000\` — Merge Sort / Timsort.
- **O(n²)** (Quadratic): \`1,000,000,000,000\` — ichma-ich sikl (timeout!).
- **O(2ⁿ)** (Exponential): soniyada portlaydi — memoizatsiyasiz rekursiv Fib.
### 2. Soddalashtirish Qoidalari
\`5n² + 200n + 1000\` -> eng katta had \`n²\` qoladi, \`5\` tashlanadi -> **\`O(n²)\`**.
### 3. Amortized O(1)
Python \`list.append()\` ba’zan xotirani kengaytirish uchun O(n) nusxa olsa ham, o‘rtacha har bir \`append()\` **Amortized O(1)** dir!`,
    theoryEn: `### 1. Complexity Hierarchy
\`O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)\`. Notice that at \`n = 10^6\`, \`log2(n)\` is only ~20 steps while \`n^2\` is \`10^12\`.
### 2. Simplification Rules
Drop constant multipliers and lower-order terms; preserve distinct input variables (\`n\`, \`m\`).
### 3. Best / Average / Worst Case & Amortized O(1)
Big O usually describes the worst-case upper bound. \`list.append()\` occasionally resizes in O(n), averaging out to **Amortized O(1)** per append.`,
    examples: [
      ex('Misol 1: Turli Big O sinflarining `n=1024` da qadam soni', 'Example 1: Step Counts Across Big O Classes', `import math\n\nn = 1024\nprint("O(1):", 1, "| O(log n):", int(math.log2(n)), "| O(n):", n, "| O(n log n):", n * int(math.log2(n)), "| O(n^2):", n * n)`, `O(1): 1 | O(log n): 10 | O(n): 1024 | O(n log n): 10240 | O(n^2): 1048576`, '`n=1024` da O(log n) atigi 10 qadam, O(n²) esa 1 milliondan ortiq qadam!', 'At `n=1024`, logarithmic takes 10 steps while quadratic exceeds 1 million.'),
      ex('Misol 2: Har xil kirishlar — `O(n + m)` vs `O(n * m)`', 'Example 2: Distinct Inputs O(n + m)', `def combine_independent(a: list[int], b: list[int]) -> int:\n    return sum(a) + sum(b)  # O(n + m), NOT O(n)!\n\nprint(combine_independent([1, 2], [3, 4, 5]))`, `15`, 'Ikkita alohida ro‘yxat uzunligi `n` va `m` bo‘lsa, murakkablik `O(n + m)` yoziladi.', 'Two sequential loops over separate inputs `a` and `b` scale as `O(n + m)`.'),
      ex('Misol 3: Logarifmik bo‘lish `n //= 2`', 'Example 3: Logarithmic Halving Loop', `def log2_steps(n: int) -> int:\n    steps = 0\n    while n > 1:\n        n //= 2\n        steps += 1\n    return steps\n\nprint(log2_steps(64), log2_steps(1024))`, `6 10`, 'Har qadamda muammo yarmiga qisqarsa, murakkablik `O(log n)` bo‘ladi.', 'Halving the search space on each iteration yields `O(log n)` complexity.'),
    ],
    traceTitleUz: 'O(log n) qisqarish izi',
    traceTitleEn: 'Tracing O(log n) Halving',
    traceCode: `n = 16\nwhile n > 1:\n    print(n, end=" ")\n    n //= 2`,
    traceSteps: [
      traceStep(1, 'n = 16', '16', 'Boshlandi', 'Printed 16', '16 '),
      traceStep(2, 'n //= 2', '8 -> 4 -> 2', 'Har safar 2 baravar kamaydi', 'Halved repeatedly', '8 4 2 '),
      traceStep(3, 'n = 1', 'loop ends', 'Atigi 4 qadamda tugadi', 'Stopped after 4 steps'),
    ],
    commonMistakes: [
      mistake('`O(2n)` yoki `O(n² + n)` ni soddalashtirmaslik', 'Keeping Constants and Lower Terms in Big O', `# Writing O(2n + 10) or O(n^2 + 5n) misses asymptotic simplification!`, 'Non-standard Big O notation', `print("Drop constants and smaller terms: 2n+10 -> O(n), n^2+5n -> O(n^2)!")`, 'Big O faqat o‘sish sinfini ko‘rsatadi: konstantalar tashlanadi.', 'Big O drops constant multipliers and non-dominant terms.', 'Eng kuchli hadni qoldirib koeffitsientni o‘chiring.', 'Keep only the highest-order term.'),
      mistake('Ketma-ket 2 ta ro‘yxat siklini `O(n²)` deb adashtirish', 'Confusing Sequential Loops O(n + m) with O(n^2)', `# Loop 1 over a, then Loop 2 over b (NOT nested) is O(n + m), NOT O(n^2)!`, 'Misidentifying complexity by an order of magnitude', `print("Sequential = add O(n+m); Nested = multiply O(n*m)!")`, 'Alohida sikllar qo‘shiladi, ichma-ich sikllar ko‘paytiriladi.', 'Sequential loops add; nested loops multiply.', 'Sikl ichma-ichmi yoki ketma-ketmi — tekshiring.', 'Check whether loops are sequential or nested.'),
    ],
    compareTitleUz: 'O(log n) vs O(n) vs O(n log n) vs O(n²)',
    compareTitleEn: 'Comparing Growth Curves',
    compareUz: ['`O(log n)` / `O(n)` / `O(n log n)`: millionlab ma’lumotda ham tez ishlaydi.', '`O(n²)` / `O(2ⁿ)`: `n > 10,000` yoki `n > 35` bo‘lganda serverni qotiradi.'],
    compareEn: ['`O(log n)`, `O(n)`, `O(n log n)`: production-scalable to millions of items.', '`O(n^2)` and `O(2^n)`: degrade rapidly on modest datasets.'],
    compareSummaryUz: 'Kod yozganda ichma-ich O(n²) sikl ko‘rsangiz, darhol uni `set`/`dict` (O(n)) yoki sorting + binary search (O(n log n)) ga tushirish yo‘lini qidiring.',
    compareSummaryEn: 'Spot O(n^2) loops early and reduce them to O(n log n) via sorting or O(n) via hash tables.',
    practiceTasks: [
      pt('p1103_1', '1-mashq: O(log n) qadam sanagich', 'Task 1: Count Halvings', '`n = 256` nechta `n //= 2` qadamda 1 ga tushishini hisoblang.', 'Count halvings for 256.', `n, c = 256, 0\nwhile n > 1:\n    n //= 2; c += 1\nprint(c)`, '8', 'while n > 1: n //= 2', 'Prints 8.'),
      pt('p1103_2', '2-mashq: `O(1)` vs `O(n)` kodni aniqlash', 'Task 2: Constant Time Access', 'Ro‘yxatning birinchi va oxirgi elementini yig‘ish O(1) ekanini chiqaring.', 'Sum ends in O(1).', `def ends_sum(xs): return xs[0] + xs[-1]\nprint(ends_sum([10, 20, 30, 40]))`, '50', 'Direct index lookup is O(1)', 'Prints 50.'),
      pt('p1103_3', '3-mashq: `O(n + m)` ketma-ket sikl', 'Task 3: Sequential Sum', 'Ikkita ro‘yxat yig‘indisini alohida sikllarda hisoblang.', 'Compute sequential sums.', `a, b = [1, 2], [3, 4, 5]\ns = 0\nfor x in a: s += x\nfor y in b: s += y\nprint(s)`, '15', 'Two non-nested loops', 'Prints 15.'),
      pt('p1103_4', '4-mashq: `O(n log n)` saralash orqali tekshirish', 'Task 4: Anagram via Sort', 'Ikki so‘zni `sorted(a) == sorted(b)` bilan anagramga tekshiring.', 'Check anagram in O(n log n).', `print(sorted("listen") == sorted("silent"))`, 'True', 'sorted(a) == sorted(b)', 'Prints True.'),
      pt('p1103_5', '5-mashq: O(2ⁿ) o‘sishni ko‘rish', 'Task 5: Exponential Growth', '`2 ** 10` va `2 ** 20` farqini chiqaring.', 'Show exponential growth.', `print(2 ** 10, 2 ** 20)`, '1024 1048576', '2**10 vs 2**20', 'Prints 1024 1048576.'),
    ],
    quiz: [
      q('q1103_1', '`3n² + 50n + 1000` ifodasining soddalashtirilgan Big O shakli qaysi?', 'Simplified Big O of `3n^2 + 50n + 1000`?', ['O(3n^2)', 'O(n^2 + n)', 'O(n^2)', 'O(n)'], ['O(3n^2)', 'O(n^2 + n)', 'O(n^2)', 'O(n)'], 2, 'Konstanta va kichik hadlar tashlanadi -> `O(n^2)`.', 'Drop constants and lower terms -> `O(n^2)`.'),
      q('q1103_2', 'Eng tezdan eng sekinga to‘g‘ri tartiblangan qatorni toping:', 'Correct ordering from fastest growth efficiency to slowest:', ['O(1) < O(n) < O(log n) < O(n^2)', 'O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)', 'O(log n) < O(1) < O(n)', 'O(2^n) < O(n^2)'], ['O(1) < O(n) < O(log n) < O(n^2)', 'O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)', 'O(log n) < O(1) < O(n)', 'O(2^n) < O(n^2)'], 1, '`O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)`.', 'Standard Big O hierarchy.'),
      q('q1103_3', 'Har bir qadamda ma’lumot hajmi yarmiga kamaysa, qaysi Big O sinfi hosil bo‘ladi?', 'Halving the search space each iteration gives:', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1, '`O(log n)`.', '`O(log n)`.'),
      q('q1103_4', 'Python `list.append(x)` ba’zan massivni ko‘chirishiga qaramay nima deb tasniflanadi?', 'How is Python `list.append(x)` classified despite occasional resizing?', ['O(n^2)', 'Amortized O(1)', 'O(log n)', 'O(2^n)'], ['O(n^2)', 'Amortized O(1)', 'O(log n)', 'O(2^n)'], 1, 'Amortized O(1).', 'Amortized O(1).'),
      q('q1103_5', 'Uzunligi `n` va `m` bo‘lgan ikkita alohida ketma-ket `for` siklining Big O si?', 'Big O of two sequential loops over arrays of size `n` and `m`?', ['O(n * m)', 'O(n + m)', 'O(n^2)', 'O(1)'], ['O(n * m)', 'O(n + m)', 'O(n^2)', 'O(1)'], 1, '`O(n + m)`.', '`O(n + m)`.'),
    ],
    homework: hw('Kod Snippetlariga Big O Bahosi', 'Big O Classifier Lab', 'O(1), O(log n), O(n), O(n log n) va O(n²) ishlaydigan 5 ta alohida Python funksiyasini yozib, `n = 10, 100, 1000` da bajarilgan operatsiyalar jadvalini chiqaring.', 'Write 5 functions representing O(1), O(log n), O(n), O(n log n), and O(n^2), instrumenting step counts for `n = 10, 100, 1000`.', ['5 ta funksiya va ops sanagich', 'Jadval ko‘rinishida chop etish'], ['5 instrumented functions', 'Formatted growth table'], 'Print aligned columns comparing ops across n values.', 'Compare growth curves.', 'Eng yaxshi O(n) anagram tekshirgichni (`Counter`) ham qo‘shing.', 'Add O(n) Counter anagram check.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-04',
    courseId: 'algorithms',
    moduleId: 'c11_m2',
    order: 4,
    titleUz: 'Linear Search va Binary Search (va bisect moduli)',
    titleEn: 'Linear Search, Binary Search & Python’s bisect Module',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-11-03'],
    conceptId: 'algo_search',
    whyUz: "1 milliard ismli telefon kitobidan ismni 1-sahifadan boshlab izlasangiz (`Linear Search`), 1 milliard qadam ketadi. Agar kitob alifbo tartibida bo‘lsa, o‘rtasidan ochib yarmini tashlab ketish (**Binary Search**) atigi **30 ta qadamda** topadi! Va Python ning **`bisect`** moduli buni C tezligida tayyor beradi!",
    whyEn: 'Linear search scans unsorted inputs in O(n), whereas Binary Search locates targets (and insertion bounds) in sorted sequences in O(log n)—backed by Python’s `bisect` module.',
    analogyUz: "**Linear Search** — yo‘qolgan uyni 1-raqamdan boshlab bittalab qidirish. **Binary Search** — 1 dan 100 gacha o‘ylangan sonni har safar o‘rtasini aytib (\"50 dan kattami? Unda 75?\") 7 urinishda topish o‘yini!",
    analogyEn: 'Linear search checks doors one by one; binary search opens the middle page of a sorted dictionary and discards half the pages on every guess.',
    stopsUz: "Binary Search da 3 ta klassik xato: 1) **Tartiblanmagan** ro‘yxatda ishlatish (xato javob beradi!). 2) `while low < high` o‘rniga **`while low <= high:`** yozishni unutib oxirgi 1 elementni tashlab ketish. 3) Chegaralarda `low = mid + 1`, `high = mid - 1` emas `mid` qilib cheksiz siklga tushish!",
    stopsEn: 'Binary search requires sorted input! Use `while low <= high:` with `low = mid + 1` and `high = mid - 1` to avoid infinite loops or off-by-one misses, and use `bisect` in production.',
    objUz: ['Linear Search O(n) va Binary Search O(log n) ni qo‘lda yozish', 'Chegaralarda off-by-one xatosiz `low <= high` va `mid = low + (high - low) // 2` qo‘llash', 'Python `bisect.bisect_left` / `bisect_right` bilan chegaralarni topish'],
    objEn: ['Implement Linear Search (O(n)) and bug-free Binary Search (O(log n))', 'Avoid off-by-one and infinite-loop boundary errors', 'Use stdlib `bisect_left` / `bisect_right` for sorted index queries'],
    theoryUz: `### 1. Linear Search — O(n)
Tartiblanmagan ro‘yxatda boshidan oxirigacha qidiradi. Tartibsiz ma’lumotda yagona yo‘l (yoki 1 marta qidirilsa).
### 2. Binary Search — O(log n)
Sharti: **ro‘yxat albatta tartiblangan (sorted) bo‘lishi kerak!**
1. \`low = 0, high = len(xs) - 1\`.
2. \`while low <= high:\`
   - \`mid = low + (high - low) // 2\`
   - Teng bo‘lsa \`return mid\`; kichik bo‘lsa \`low = mid + 1\`; katta bo‘lsa \`high = mid - 1\`.
### 3. Lower Bound / Upper Bound va \`bisect\`
Duplicate elementlar bo‘lganda birinchi uchrash o‘rnini \`bisect_left\`, oxirgisidan keyingi o‘rinni \`bisect_right\` beradi!
### 4. Qachon Saralash + Binary Search Foydali?
Ko‘p marta (\`k\` marta) qidirilsa \`O(n log n + k log n)\` juda foydali; 1 marta qidirilsa oddiy Linear \`O(n)\` tezroq!`,
    theoryEn: `### 1. Linear Search — O(n)
Works on any unsorted sequence; optimal for a single search on unsorted data.
### 2. Binary Search — O(log n)
Requires sorted order. Halves \`[low, high]\` using \`while low <= high:\` and \`mid = low + (high - low) // 2\`.
### 3. \`bisect_left\` & \`bisect_right\`
Python’s C-implemented \`bisect\` module finds exact lower/upper insertion bounds cleanly on duplicates.
### 4. Search-Cost Trade-off
Don’t spend O(n log n) sorting just to run one O(log n) search; amortize sorting across many queries.`,
    examples: [
      ex('Misol 1: Binary Search va qadam sonini ko‘rish', 'Example 1: Binary Search with Step Counter', `def binary_search(nums: list[int], target: int) -> tuple[int, int]:\n    low, high, steps = 0, len(nums) - 1, 0\n    while low <= high:\n        steps += 1\n        mid = low + (high - low) // 2\n        if nums[mid] == target:\n            return mid, steps\n        if nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1, steps\n\ndata = list(range(0, 200, 2))  # 100 sorted items\nprint("found 142:", binary_search(data, 142), "| missing 99:", binary_search(data, 99))`, `found 142: (71, 7) | missing 99: (-1, 6)`, '100 ta element ichidan bor-yo‘g‘i 6–7 qadamda aniq javob topildi!', 'Locates or rejects targets across 100 sorted elements in 6–7 steps.'),
      ex('Misol 2: `bisect_left` va `bisect_right` bilan duplicate lar', 'Example 2: bisect_left & bisect_right Bounds', `from bisect import bisect_left, bisect_right\n\narr = [10, 20, 20, 20, 30]\nl, r = bisect_left(arr, 20), bisect_right(arr, 20)\nprint("first:", l, "| after_last:", r, "| count of 20:", r - l)`, `first: 1 | after_last: 4 | count of 20: 3`, '`bisect_right - bisect_left` O(log n) da element necha marta qatnashganini ham sanab beradi!', '`bisect_left` and `bisect_right` give exact range bounds and counts in O(log n).'),
      ex('Misol 3: `bisect` bilan baho shkalasi (Grade Mapping)', 'Example 3: Grade Lookup with bisect', `from bisect import bisect_right\n\ndef grade(score: int) -> str:\n    cutoffs = [60, 75, 90]\n    letters = ["F", "C", "B", "A"]\n    return letters[bisect_right(cutoffs, score)]\n\nprint([grade(s) for s in (55, 60, 82, 95)])`, `['F', 'C', 'B', 'A']`, 'Uzun `if/elif` o‘rniga `bisect_right` chegaralar bo‘yicha jadvaldan bir zumda topadi.', 'Python docs’ classic `bisect` table-lookup pattern.'),
    ],
    traceTitleUz: 'Binary Search `low/mid/high` izi',
    traceTitleEn: 'Tracing Binary Search Bounds',
    traceCode: `arr = [2, 5, 8, 12]\n# searching 8: low=0, high=3`,
    traceSteps: [
      traceStep(1, 'mid = (0+3)//2 = 1', 'arr[1]=5 < 8', 'Chap yarmi tashlandi: low=2', '5 < 8 -> low=2'),
      traceStep(2, 'mid = (2+3)//2 = 2', 'arr[2]=8 == 8', 'Topildi! index=2', 'Found target at index 2', '2'),
    ],
    commonMistakes: [
      mistake('Tartiblanmagan ro‘yxatda Binary Search chaqirish', 'Running Binary Search on Unsorted Data', `# binary_search([10, 2, 8], 2) fails because 2 is left of middle 2? Wait: checks 2 vs 2? For 10 it misses!`, 'Silent wrong -1 return', `arr = sorted([10, 2, 8])\nfrom bisect import bisect_left\nprint("Sorted index of 8:", bisect_left(arr, 8))`, 'Binary Search faqat monoton tartiblangan ro‘yxatda to‘g‘ri ishlaydi.', 'Binary search requires sorted input.', 'Avval ro‘yxat tartiblanganligiga ishonch hosil qiling.', 'Ensure input is sorted first.'),
      mistake('`low = mid` yoki `high = mid` deb cheksiz siklga tushish', 'Infinite Loop with low = mid', `# If low=2, high=3 -> mid=2 -> low=mid stays 2 forever!`, 'Infinite loop hang', `print("Always move past mid: low = mid + 1 and high = mid - 1!")`, '`mid` ni allaqachon tekshirdik, shuning uchun uni tashlab `+ 1` / `- 1` yurish shart.', '`mid` was already checked; move bounds to `mid + 1` or `mid - 1`.', '`low = mid + 1` va `high = mid - 1` yozing.', 'Advance past `mid`.'),
    ],
    compareTitleUz: 'Linear Search vs Binary Search',
    compareTitleEn: 'Linear Search vs Binary Search',
    compareUz: ['Linear Search O(n): tartiblanmagan ro‘yxatda yoki 1 martalik qidiruvda.', 'Binary Search O(log n): tartiblangan massivda minglab/millionlab so‘rovlarda.'],
    compareEn: ['Linear O(n): works unsorted; best for single scans.', 'Binary O(log n): ultra-fast on sorted arrays or repeated queries.'],
    compareSummaryUz: 'Tartibsiz ro‘yxatda Linear Search, tartiblangan ro‘yxatda esa Binary Search (`while low <= high:` yoki `bisect`) ishlating.',
    compareSummaryEn: 'Use Linear Search on unsorted inputs and Binary Search / `bisect` on sorted sequences.',
    practiceTasks: [
      pt('p1104_1', '1-mashq: Linear Search', 'Task 1: Linear Search Index', '`lin_search([4, 9, 2], 9)` -> `1`, topilmasa `-1` qaytarsin.', 'Write linear search.', `def lin(xs, t):\n    for i, x in enumerate(xs):\n        if x == t: return i\n    return -1\nprint(lin([4, 9, 2], 9), lin([4, 9, 2], 7))`, '1 -1', 'enumerate loop', 'Prints 1 -1.'),
      pt('p1104_2', '2-mashq: Binary Search', 'Task 2: Binary Search', '`[1, 3, 5, 7, 9]` dan `7` indeksini Binary Search bilan toping.', 'Implement binary search.', `def bs(xs, t):\n    l, h = 0, len(xs) - 1\n    while l <= h:\n        m = (l + h) // 2\n        if xs[m] == t: return m\n        if xs[m] < t: l = m + 1\n        else: h = m - 1\n    return -1\nprint(bs([1, 3, 5, 7, 9], 7), bs([1, 3, 5], 2))`, '3 -1', 'while l <= h:', 'Prints 3 -1.'),
      pt('p1104_3', '3-mashq: `bisect_left` bilan bor-yo‘qlik', 'Task 3: Contains via bisect_left', '`bisect_left` yordamida `8` `[2, 4, 8, 10]` da borligini tekshiring.', 'Check membership with bisect_left.', `from bisect import bisect_left\na = [2, 4, 8, 10]\ni = bisect_left(a, 8)\nprint(i < len(a) and a[i] == 8)`, 'True', 'Check i < len(a) and a[i] == x', 'Prints True.'),
      pt('p1104_4', '4-mashq: `bisect` bilan duplicate sanash', 'Task 4: Count Duplicates', '`[1, 2, 2, 2, 5]` da `2` soni nechtaligini O(log n) da toping.', 'Use bisect_right - bisect_left.', `from bisect import bisect_left, bisect_right\na = [1, 2, 2, 2, 5]\nprint(bisect_right(a, 2) - bisect_left(a, 2))`, '3', 'bisect_right - bisect_left', 'Prints 3.'),
      pt('p1104_5', '5-mashq: `insort` bilan tartibli qo‘shish', 'Task 5: Keep List Sorted', '`bisect.insort(arr, 4)` bilan `[1, 3, 7]` ga `4` qo‘shing.', 'Use bisect.insort.', `from bisect import insort\na = [1, 3, 7]\ninsort(a, 4)\nprint(a)`, '[1, 3, 4, 7]', 'insort(a, 4)', 'Prints [1, 3, 4, 7].'),
    ],
    quiz: [
      q('q1104_1', 'Binary Search ishlashi uchun asosiy shart nima?', 'Strict precondition for Binary Search?', ['Ro‘yxat juft uzunlikda', 'Ro‘yxat tartiblangan (sorted) bo‘lishi shart', 'Faqat musbat sonlar', 'Unikal bo‘lmasligi'], ['Even length', 'Sequence must be sorted', 'Positives only', 'Duplicates forbidden'], 1, 'Tartiblangan bo‘lishi shart.', 'Must be sorted.'),
      q('q1104_2', '1,000,000 ta elementli tartiblangan ro‘yxatda Binary Search ko‘pi bilan nechta taqqoslash qiladi?', 'Max comparisons for Binary Search on 1,000,000 items?', ['500,000', '~20 (log2 10^6)', '1,000', '100'], ['500,000', '~20 (log2 10^6)', '1,000', '100'], 1, 'Taxminan 20 ta qadam.', 'About 20 steps.'),
      q('q1104_3', 'Binary Search sikli chegaralarida qaysi shart to‘g‘ri?', 'Correct loop condition for inclusive bounds `[low, high]`?', ['while low < high:', 'while low <= high:', 'while low != high:', 'while mid > 0:'], ['while low < high:', 'while low <= high:', 'while low != high:', 'while mid > 0:'], 1, '`while low <= high:` (oxirgi `low == high` elementni ham tekshiradi).', '`while low <= high:`.'),
      q('q1104_4', '`bisect_left([1, 2, 2, 4], 2)` qaysi indeksni qaytaradi?', 'What index does `bisect_left([1, 2, 2, 4], 2)` return?', ['0', '1', '2', '3'], ['0', '1', '2', '3'], 1, 'Birinchi `2` ning indeksi -> `1`.', 'First insertion index `1`.'),
      q('q1104_5', 'Tartiblanmagan ro‘yxatda atigi 1 marta element qidirish uchun qaysi biri tezroq?', 'Faster for a single search on an unsorted array?', ['Avval sort + Binary Search', 'Linear Search O(n)', 'Bubble Sort', 'Hash Sort'], ['Sort + Binary Search', 'Linear Search O(n)', 'Bubble Sort', 'Hash Sort'], 1, 'Linear Search O(n) (sort O(n log n) dan tez!).', 'Linear Search O(n).'),
    ],
    homework: hw('Binary Search on Answer: Shipping Capacity', 'Binary Search Lower Bound Solver', 'Saralangan versiya raqamlari `[101, 102, ..., 200]` dan berilgan shart (`is_broken(v)`) ni qanoatlantiruvchi **birinchi buzilgan versiyani** `O(log n)` Binary Search bilan topuvchi funksiya yozing.', 'Implement "First Bad Version" (`O(log n)`) using binary search lower-bound logic and verify against linear search across 10 test cases.', ['O(log n) lower bound', 'Hech qanday cheksiz sikl bo‘lmasin'], ['O(log n) lower bound', 'Guaranteed termination'], 'if is_bad(mid): ans = mid; high = mid - 1 else: low = mid + 1', 'Track earliest match.', 'Rotated sorted array ichidan qidirishni ham sinab ko‘ring.', 'Try rotated array search.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-05',
    courseId: 'algorithms',
    moduleId: 'c11_m2',
    order: 5,
    titleUz: 'Bubble Sort, Selection Sort va Insertion Sort',
    titleEn: 'Quadratic Sorts: Bubble, Selection & Insertion Sort',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-11-04'],
    conceptId: 'algo_basic_sorts',
    whyUz: "Nima uchun Python ning `sorted()` i ichida 32–64 tadan kichik qismlar uchun Quick Sort emas, aynan **Insertion Sort** ishlaydi (Timsort)? Uchta klassik O(n²) tartiblash algoritmining farqini, `swapped` flagini va stability (teng elementlar tartibi) tushunchasini tushunib olasiz!",
    whyEn: 'Implement Bubble, Selection, and Insertion Sort from scratch, compare swap counts and stability, and see why Insertion Sort shines on nearly sorted data (and powers Timsort small runs).',
    analogyUz: "**Bubble Sort** — eng og‘ir pufakchalarni juft-juft almashtirib tepaga chiqaradi. **Selection Sort** — har safar eng kichigini topib joyiga qo‘yadi (eng kam yozish!). **Insertion Sort** — qo‘ldagi o‘yin kartalarini chapdan bittalab o‘z o‘rniga suqib boradi (deyarli tartibli kartalarda O(n) chaqqon!).",
    analogyEn: 'Bubble swaps neighbors repeatedly, Selection picks the minimum each pass, and Insertion slides each new card into its sorted left hand—ultra-fast on nearly sorted arrays.',
    stopsUz: "1) Uchala algoritm ham O(n²) va O(1) in-place, lekin **Insertion Sort** deyarli tartiblangan ro‘yxatda **O(n)** ishlaydi! 2) **Stability**: teng kalitli elementlar (`(2, 'a')`, `(2, 'b')`) asl nisbiy tartibini saqlab qolsa — algoritm **Stable** (Bubble va Insertion stable; oddiy Selection stable emas!).",
    stopsEn: 'All three are O(n^2) worst-case with O(1) space, yet Insertion Sort hits O(n) best-case on nearly sorted inputs. Bubble and Insertion are stable; standard Selection Sort is not.',
    objUz: ['Bubble Sort (early-exit `swapped` flagi bilan), Selection Sort va Insertion Sort yozish', 'Stability (barqarorlik) tushunchasi va swap sonini taqqoslash', 'Nega Timsort kichik bo‘laklarda Insertion Sort ishlatishini bilish'],
    objEn: ['Code early-exit Bubble Sort, Selection Sort, and Insertion Sort', 'Compare stability and swap counts across input shapes', 'Explain why Timsort switches to Insertion Sort on small runs'],
    theoryUz: `### 1. Bubble Sort (Pufakchali)
Qo‘shni elementlarni solishtirib katta elementni o‘ngga suradi. \`swapped = False\` flagi bilan allaqachon tartibli ro‘yxatda O(n) da to‘xtaydi! **Stable.**
### 2. Selection Sort (Tanlash)
Har safar o‘ng tomondan eng kichik indeks (\`min_idx\`) ni topib 1 marta swap qiladi — xotiraga yozish (swaps) eng kam, lekin deyarli tartibli ro‘yxatda ham doim O(n²) va **Unstable**.
### 3. Insertion Sort (Qo‘yish)
Chap qismni tartibli ushlab, keyingi \`key\` elementni kerakli joyga siljitib qo‘yadi. Kichik (\`n < 32\`) yoki deyarli tartibli ro‘yxatlarda eng tez (O(n) best-case) va **Stable**!`,
    theoryEn: `### 1. Bubble Sort
Repeatedly swaps adjacent out-of-order pairs; an early-exit \`swapped\` flag yields O(n) best-case. **Stable.**
### 2. Selection Sort
Finds the minimum in the unsorted suffix and performs at most \`n-1\` swaps total—always O(n^2) comparisons and **Unstable**.
### 3. Insertion Sort
Shifts larger sorted elements right to insert each new item; O(n) on nearly sorted arrays and **Stable**, making it Timsort’s small-run workhorse.`,
    examples: [
      ex('Misol 1: Insertion Sort (Timsortning kichik bo‘lak dvigateli)', 'Example 1: Insertion Sort', `def insertion_sort(xs: list[int]) -> list[int]:\n    a = xs.copy()\n    for i in range(1, len(a)):\n        key = a[i]\n        j = i - 1\n        while j >= 0 and a[j] > key:\n            a[j + 1] = a[j]\n            j -= 1\n        a[j + 1] = key\n    return a\n\nprint(insertion_sort([5, 2, 9, 1, 5]))`, `[1, 2, 5, 5, 9]`, 'Element o‘zidan kattalarini o‘ngga surib, bo‘sh joyga qo‘yiladi.', 'Shifts larger prefix items right and inserts `key` into place.'),
      ex('Misol 2: Early-Exit Bubble Sort vs Selection Sort', 'Example 2: Bubble & Selection Sort', `def bubble_sort(xs: list[int]) -> list[int]:\n    a = xs.copy()\n    for i in range(len(a)):\n        swapped = False\n        for j in range(0, len(a) - 1 - i):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n                swapped = True\n        if not swapped: break\n    return a\n\ndef selection_sort(xs: list[int]) -> list[int]:\n    a = xs.copy()\n    for i in range(len(a)):\n        m = min(range(i, len(a)), key=a.__getitem__)\n        a[i], a[m] = a[m], a[i]\n    return a\n\nprint(bubble_sort([4, 1, 3, 2]), selection_sort([4, 1, 3, 2]))`, `[1, 2, 3, 4] [1, 2, 3, 4]`, 'Ikkala algoritm ham `O(1)` qo‘shimcha xotirada to‘g‘ri tartiblaydi.', 'Early-exit Bubble and Selection sort yield identical sorted outputs.'),
      ex('Misol 3: Stability (Teng kalitlarda tartib saqlanishi)', 'Example 3: Sort Stability Demo', `records = [(2, "birinchi"), (1, "nol"), (2, "ikkinchi")]\nprint(sorted(records, key=lambda x: x[0]))`, `[(1, 'nol'), (2, 'birinchi'), (2, 'ikkinchi')]`, 'Barqaror (stable) tartibda `2` lar orasida `"birinchi"` `"ikkinchi"` dan oldin qoladi.', 'Stable sorting preserves original relative order among equal keys.'),
    ],
    traceTitleUz: 'Insertion Sort siljitish izi',
    traceTitleEn: 'Tracing Insertion Sort',
    traceCode: `a = [4, 2, 3]\n# i=1 (key=2) -> [2, 4, 3]; i=2 (key=3) -> [2, 3, 4]`,
    traceSteps: [
      traceStep(1, 'i=1, key=2', '4 > 2 -> siljidi', '2 boshiga qo‘yildi: [2, 4, 3]', 'Inserted 2 -> [2, 4, 3]'),
      traceStep(2, 'i=2, key=3', '4 > 3 -> siljidi', '3 o‘rtasiga qo‘yildi: [2, 3, 4]', 'Inserted 3 -> [2, 3, 4]', '[2, 3, 4]'),
    ],
    commonMistakes: [
      mistake('Insertion Sort da `j >= 0` shartini unutish (`j = -1` indeks muammosi)', 'Forgetting j >= 0 in Insertion Sort', `# In Python a[-1] accesses the LAST element instead of throwing an error!`, 'Silently corrupts sorting by comparing a[-1]!', `print("Always check j >= 0 BEFORE accessing a[j]!")`, 'Python da manfiy `j = -1` oxirgi elementni oladi — shuning uchun `while j >= 0 and ...` juda muhim!', 'Unlike C, Python `a[-1]` reads the last element silently!', '`j >= 0` ni birinchi yozing.', 'Always guard `j >= 0` first.'),
      mistake('Bubble Sort da `swapped` flagini qo‘ymay tartibli ro‘yxatda ham O(n²) yurish', 'Missing Early-Exit Flag in Bubble Sort', `# Without swapped=True check, sorted [1..1000] still runs 500,000 iterations!`, 'Wasted O(n^2) work on sorted inputs', `print("Add swapped = False; break if not swapped!")`, 'Tayyor tartibli ro‘yxatda 1-o‘tishda hech narsa almashmasa siklni uzish kerak.', 'Breaking when zero swaps occur gives O(n) best-case.', '`if not swapped: break` qo‘shing.', 'Add early exit.'),
    ],
    compareTitleUz: 'Bubble vs Selection vs Insertion Sort',
    compareTitleEn: 'Bubble vs Selection vs Insertion',
    compareUz: ['Insertion Sort: kichik yoki deyarli tartibli ro‘yxatlarda eng tez (O(n) best-case), Stable.', 'Selection Sort: swaplar soni eng kam (<= n), lekin doim O(n²) va Unstable.', 'Bubble Sort: o‘rganish uchun qulay, amalda Insertion dan sekinroq.'],
    compareEn: ['Insertion: fastest on nearly sorted/tiny arrays (O(n) best), Stable.', 'Selection: fewest writes, always O(n^2), Unstable.', 'Bubble: pedagogical baseline, slower than Insertion in practice.'],
    compareSummaryUz: 'Kichik yoki deyarli tartibli massivlarda **Insertion Sort**, katta massivlarda esa O(n log n) **Merge/Timsort** ishlating.',
    compareSummaryEn: 'Favor Insertion Sort for small or nearly sorted arrays and O(n log n) algorithms for large inputs.',
    practiceTasks: [
      pt('p1105_1', '1-mashq: Insertion Sort yozing', 'Task 1: Insertion Sort', '`[8, 3, 5, 1]` ni Insertion Sort bilan tartiblang.', 'Implement insertion sort.', `def ins(a):\n    for i in range(1, len(a)):\n        k, j = a[i], i - 1\n        while j >= 0 and a[j] > k: a[j+1] = a[j]; j -= 1\n        a[j+1] = k\n    return a\nprint(ins([8, 3, 5, 1]))`, '[1, 3, 5, 8]', 'while j >= 0 and a[j] > k', 'Prints [1, 3, 5, 8].'),
      pt('p1105_2', '2-mashq: Selection Sort', 'Task 2: Selection Sort', '`[6, 2, 9, 4]` ni Selection Sort bilan tartiblang.', 'Implement selection sort.', `def sel(a):\n    for i in range(len(a)):\n        m = i\n        for j in range(i+1, len(a)):\n            if a[j] < a[m]: m = j\n        a[i], a[m] = a[m], a[i]\n    return a\nprint(sel([6, 2, 9, 4]))`, '[2, 4, 6, 9]', 'Swap min_idx with i', 'Prints [2, 4, 6, 9].'),
      pt('p1105_3', '3-mashq: Bubble Sort + `passes`', 'Task 3: Early-Exit Bubble Passes', '`[1, 2, 3, 4]` da early-exit Bubble Sort nechta o‘tish qilishini chiqaring.', 'Count passes on sorted list.', `a, passes = [1, 2, 3, 4], 0\nfor i in range(len(a)):\n    swapped = False; passes += 1\n    for j in range(len(a)-1-i):\n        if a[j] > a[j+1]: a[j], a[j+1] = a[j+1], a[j]; swapped = True\n    if not swapped: break\nprint(passes)`, '1', 'Breaks after 1st pass', 'Prints 1.'),
      pt('p1105_4', '4-mashq: Kamayish tartibi', 'Task 4: Descending Insertion', 'Insertion Sort ni kattadan kichikka (`a[j] < k`) qilib `[3, 1, 4]` ni chiqaring.', 'Sort descending.', `a = [3, 1, 4]\nfor i in range(1, len(a)):\n    k, j = a[i], i - 1\n    while j >= 0 and a[j] < k: a[j+1] = a[j]; j -= 1\n    a[j+1] = k\nprint(a)`, '[4, 3, 1]', 'Flip comparison to a[j] < k', 'Prints [4, 3, 1].'),
      pt('p1105_5', '5-mashq: In-place swap sonini sanash', 'Task 5: Count Swaps', '`[3, 2, 1]` da Selection Sort nechta haqiqiy swap (`i != m`) qiladi?', 'Count non-trivial swaps.', `a, sw = [3, 2, 1], 0\nfor i in range(len(a)):\n    m = min(range(i, len(a)), key=a.__getitem__)\n    if i != m: a[i], a[m] = a[m], a[i]; sw += 1\nprint(sw, a)`, '1 [1, 2, 3]', 'Only swaps 3 and 1!', 'Prints 1 [1, 2, 3].'),
    ],
    quiz: [
      q('q1105_1', 'Deyarli tartiblangan ro‘yxatda eng tez (O(n)) ishlaydigan va Timsort ichida ham qo‘llanadigan algoritm?', 'Quadratic sort that runs in O(n) on nearly sorted data and powers Timsort small runs?', ['Selection Sort', 'Insertion Sort', 'Bogosort', 'Slow Sort'], ['Selection Sort', 'Insertion Sort', 'Bogosort', 'Slow Sort'], 1, 'Insertion Sort.', 'Insertion Sort.'),
      q('q1105_2', 'Qaysi tartiblash algoritmi xotiraga eng kam almashtirish (O(n) swaps) yozadi?', 'Which sort minimizes the number of swaps (at most n-1)?', ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Quick Sort'], ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Quick Sort'], 1, 'Selection Sort.', 'Selection Sort.'),
      q('q1105_3', '"Stable sorting" nimani anglatadi?', 'What does a "stable" sorting algorithm guarantee?', ['Xotira ishlatmaydi', 'Teng qiymatli elementlarning asl nisbiy tartibi o‘zgarmaydi', 'Har doim O(n)', 'Rekursiv emas'], ['Uses zero RAM', 'Equal keys preserve their original relative order', 'Always O(n)', 'Non-recursive'], 1, 'Teng kalitlarning nisbiy tartibini saqlaydi.', 'Preserves relative order of equal keys.'),
      q('q1105_4', 'Insertion Sort da `while j >= 0` shartini unutish Python da nimaga olib keladi?', 'Why is omitting `j >= 0` in Python’s Insertion Sort extra sneaky?', ['Darhol IndexError beradi', '`a[-1]` oxirgi elementni o‘qib jim xato natija beradi', 'SyntaxError', 'None'], ['Immediate IndexError', '`a[-1]` wraps around to the end of the list silently!', 'SyntaxError', 'None'], 1, 'Python manfiy indeksni oxiridan o‘qiydi!', '`a[-1]` indexes from the end!'),
      q('q1105_5', 'Oddiy Bubble, Selection va Insertion Sort larning o‘rtacha Time Complexity si?', 'Average Time Complexity of Bubble, Selection, and Insertion Sort?', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], 2, 'O(n²).', 'O(n^2).'),
    ],
    homework: hw('3 ta Sort Taqqoslagich Benchmarker', 'Sorting Benchmark Suite', 'Bubble, Selection va Insertion Sort larni bitta test to‘plamida (tasodifiy, deyarli tartibli va teskari tartibli ro‘yxatlar) solishtirish va taqqoslashlar sonini jadvalda chiqarish.', 'Compare comparison/swap counts of Bubble, Selection, and Insertion Sort across random, nearly-sorted, and reversed inputs.', ['3 ta alohida tartiblash funksiyasi', 'Test assertlari + qadamlar jadvali'], ['All 3 sorting functions', 'Assertions + comparison count table'], 'Count each comparison inside inner loops.', 'Instrument counts cleanly.', 'Python built-in `sorted()` natijasi bilan `assert` qiling.', 'Assert equality with `sorted()`.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-06',
    courseId: 'algorithms',
    moduleId: 'c11_m2',
    order: 6,
    titleUz: 'Merge Sort, Quick Sort va Python Timsort',
    titleEn: 'Divide & Conquer: Merge Sort, Quick Sort & Timsort',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-11-05'],
    conceptId: 'algo_fast_sorts',
    whyUz: "100,000 ta elementni O(n²) da tartiblash 10 milliard amal (sekundlar/minutlar), **O(n log n)** da esa atigi ~1.7 million amal (millisekundlar)! **Divide and Conquer** (Bo‘lib tashla va hukmronlik qil) tamoyilidagi **Merge Sort** va **Quick Sort** hamda Python ning **Timsort** i shu mo‘jizani yaratadi.",
    whyEn: 'Master O(n log n) Divide & Conquer sorting: deterministic stable Merge Sort, randomized in-place Quick Sort, and how Python’s hybrid Timsort powers `.sort()`.',
    analogyUz: "**Merge Sort** — qalin kitob varaqlarini teng 2 ga bo‘lib tartiblab, keyin ikki tartibli dastani zipdek birlashtiradi. **Quick Sort** — bitta \"tayanch\" (pivot) tanlab, undan kichiklarni chapga, kattalarni o‘ngga ajratadi!",
    analogyEn: 'Merge Sort splits arrays in half and zips two sorted halves back together; Quick Sort picks a pivot and partitions smaller items left, larger items right.',
    stopsUz: "1) **Merge Sort**: har doim kafolatlangan **O(n log n)** va **Stable**, lekin qo‘shimcha **O(n) xotira** oladi. 2) **Quick Sort**: o‘rtacha **O(n log n)** va in-place tez, lekin doim 1-elementni pivot olsangiz tartiblangan ro‘yxatda **O(n²)** ga tushadi (shuning uchun tasodifiy/median-of-3 pivot oling!). 3) Python `sorted()` (**Timsort**) — **Merge Sort + Insertion Sort** gibridi!",
    stopsEn: 'Merge Sort guarantees worst-case O(n log n) and stability with O(n) space. Naive Quick Sort with first-element pivot degrades to O(n^2) on sorted arrays—use randomized or 3-way partitioning.',
    objUz: ['Merge Sort (`split` + `merge` two-pointer) ni noldan yozish', 'Quick Sort partitioning va worst-case O(n²) tuzog‘ini tushunish', 'Merge Sort, Quick Sort va Timsort xususiyatlarini solishtirish'],
    objEn: ['Implement recursive Merge Sort with two-pointer `merge()`', 'Write Quick Sort and avoid O(n^2) worst-case via random pivots', 'Contrast Merge Sort, Quick Sort, and Python’s Timsort'],
    theoryUz: `### 1. Divide & Conquer Tamoyili
1. **Divide**: massivni ikkiga bo‘ling.
2. **Conquer**: har ikki qismni rekursiv tartiblang.
3. **Combine**: natijalarni birlashtiring.
### 2. Merge Sort — Kafolatlangan O(n log n)
\`len(xs) <= 1\` bo‘lsa qaytaradi; aks holda \`left\` va \`right\` ni \`merge()\` da ikki ko‘rsatkich (\`i, j\`) bilan birlashtiradi. **Stable**, Space: **O(n)**.
### 3. Quick Sort — Pivot va Partitioning
Tasodifiy (yoki o‘rta) \`pivot\` tanlab \`< pivot\`, \`== pivot\`, \`> pivot\` (3-way) ga ajratadi. O‘rtacha **O(n log n)**, eng yomoni O(n²) (pivot yomon tanlansa).
### 4. Timsort — Python \`list.sort()\` va \`sorted()\`
Real ma’lumotlarda allaqachon tartibli qismlar (*runs*) ni topib, kichiklarini **Insertion Sort**, kattalarini **Merge Sort** bilan birlashtiradi!`,
    theoryEn: `### 1. Divide & Conquer
Break problem in half, solve subproblems recursively, and combine results.
### 2. Merge Sort
Guaranteed O(n log n) worst-case time, O(n) auxiliary space, and **Stable** (via \`left[i] <= right[j]\`).
### 3. Quick Sort
In-place average O(n log n) via partitioning around a pivot; randomize pivot selection to prevent O(n^2) on sorted inputs.
### 4. Timsort
Python’s native sort exploits pre-existing sorted runs using Insertion Sort + Merge Sort (O(n) best-case, O(n log n) worst-case, Stable).`,
    examples: [
      ex('Misol 1: Merge Sort (`split` + two-pointer `merge`)', 'Example 1: Deterministic Merge Sort', `def merge(left: list[int], right: list[int]) -> list[int]:\n    out, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            out.append(left[i]); i += 1\n        else:\n            out.append(right[j]); j += 1\n    out.extend(left[i:]); out.extend(right[j:])\n    return out\n\ndef merge_sort(xs: list[int]) -> list[int]:\n    if len(xs) <= 1: return xs\n    mid = len(xs) // 2\n    return merge(merge_sort(xs[:mid]), merge_sort(xs[mid:]))\n\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))`, `[3, 9, 10, 27, 38, 43, 82]`, '`left[i] <= right[j]` belgisidagi `<=` Merge Sort ning barqaror (stable) bo‘lishini taʼminlaydi.', 'Using `<=` in `merge()` keeps Merge Sort stable while running in O(n log n).'),
      ex('Misol 2: 3-Way Quick Sort (Duplicate larga chidamli)', 'Example 2: 3-Way Quick Sort with Mid Pivot', `def quick_sort(xs: list[int]) -> list[int]:\n    if len(xs) <= 1: return xs\n    pivot = xs[len(xs) // 2]\n    lt = [x for x in xs if x < pivot]\n    eq = [x for x in xs if x == pivot]\n    gt = [x for x in xs if x > pivot]\n    return quick_sort(lt) + eq + quick_sort(gt)\n\nprint(quick_sort([5, 3, 8, 3, 1, 9, 3]))`, `[1, 3, 3, 3, 5, 8, 9]`, 'O‘rta pivot va 3-qismga ajratish ko‘p takrorli va tartiblangan massivlarda O(n²) ni oldini oladi.', 'Mid-pivot 3-way partitioning handles sorted inputs and duplicates cleanly.'),
      ex('Misol 3: `sorted(key=...)` Timsort kuchi', 'Example 3: Python Timsort with Key Function', `words = ["python", "go", "rust", "c"]\nprint(sorted(words, key=lambda w: (len(w), w)))`, `['c', 'go', 'rust', 'python']`, 'Timsort Schwartzian transform (Decorate-Sort-Undecorate) bilan har bir element uchun `key` ni atigi 1 marta hisoblaydi.', 'Timsort caches `key(x)` once per element and guarantees O(n log n) stability.'),
    ],
    traceTitleUz: 'Merge Sort birlashtirish izi',
    traceTitleEn: 'Tracing Merge Step',
    traceCode: `left, right = [2, 7], [3, 5]\n# two-pointer merge -> [2, 3, 5, 7]`,
    traceSteps: [
      traceStep(1, '2 <= 3', 'out=[2], i=1', '2 chapdan olindi', 'Took 2 from left'),
      traceStep(2, '7 > 3', 'out=[2,3], j=1', '3 o‘ngdan olindi', 'Took 3 from right'),
      traceStep(3, '7 > 5 -> extend [7]', 'out=[2,3,5,7]', 'Qolgan 7 qo‘shildi', 'Appended tail [7]', '[2, 3, 5, 7]'),
    ],
    commonMistakes: [
      mistake('Quick Sort da doim `xs[0]` ni pivot olib tartibli ro‘yxatni O(n²) ga tushirish', 'Always Picking First Element Pivot in Quick Sort', `# Choosing xs[0] on sorted [1..5000] hits max recursion depth and O(n^2)!`, 'RecursionError / O(n^2) degradation', `print("Pick middle xs[len(xs)//2], median-of-3, or random.choice(xs)!")`, 'Allaqachon tartiblangan ro‘yxatda `xs[0]` eng yomon bo‘linish (0 vs n-1) beradi.', 'First-element pivot hits O(n^2) on sorted or reversed inputs.', 'O‘rta yoki tasodifiy pivot oling.', 'Use mid/random pivot.'),
      mistake('Merge Sort bazaviy holatini `len(xs) == 0` qilib `len(xs) == 1` ni unutish', 'Missing len(xs) <= 1 Base Case', `# If base case is only len(xs) == 0, size-1 slices recurse infinitely!`, 'RecursionError', `print("Base case for recursive sorts MUST be if len(xs) <= 1: return xs")`, '1 ta elementli massiv allaqachon tartibli — uni qayta bo‘lish mumkin emas.', 'A 1-element list is already sorted and cannot split smaller.', '`if len(xs) <= 1: return xs` yozing.', 'Check `len(xs) <= 1`.'),
    ],
    compareTitleUz: 'Merge Sort vs Quick Sort vs Timsort',
    compareTitleEn: 'Merge Sort vs Quick Sort vs Timsort',
    compareUz: ['Merge Sort: kafolatlangan O(n log n), Stable, Linked List va tashqi fayllarni tartiblashda zo‘r, O(n) RAM.', 'Quick Sort: in-place O(log n) stack, keshga do‘st, lekin Unstable.', 'Timsort (Python): O(n) best-case, O(n log n) worst-case, Stable — amaliy loyihalarda doim `sorted()` ishlating!'],
    compareEn: ['Merge Sort: guaranteed O(n log n) & Stable, uses O(n) extra space.', 'Quick Sort: fast cache-friendly average O(n log n), Unstable.', 'Timsort: Python’s production hybrid—always use `.sort()`/`sorted()` in real apps.'],
    compareSummaryUz: 'Amaliy Python kodida doim C-tezligidagi **`sorted()` / `.sort()` (Timsort)** dan foydalaning; intervyu va chuqur tizimlarda Merge/Quick Sort ni biling.',
    compareSummaryEn: 'Use Python’s built-in Timsort (`sorted()` / `.sort()`) in production and master Merge/Quick Sort for systems and interviews.',
    practiceTasks: [
      pt('p1106_1', '1-mashq: `merge(a, b)` ikki ko‘rsatkich bilan', 'Task 1: Merge Two Sorted Lists', '`[1, 4, 6]` va `[2, 3, 5]` ni `merge` bilan birlashtiring.', 'Implement two-pointer merge.', `def merge(a, b):\n    out, i, j = [], 0, 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]: out.append(a[i]); i += 1\n        else: out.append(b[j]); j += 1\n    return out + a[i:] + b[j:]\nprint(merge([1, 4, 6], [2, 3, 5]))`, '[1, 2, 3, 4, 5, 6]', 'Extend remaining tail', 'Prints [1, 2, 3, 4, 5, 6].'),
      pt('p1106_2', '2-mashq: To‘liq Merge Sort', 'Task 2: Full Merge Sort', '`[9, 2, 7, 1, 5]` ni Merge Sort bilan tartiblang.', 'Implement merge_sort.', `def ms(xs):\n    if len(xs) <= 1: return xs\n    m = len(xs) // 2\n    l, r = ms(xs[:m]), ms(xs[m:])\n    out, i, j = [], 0, 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]: out.append(l[i]); i += 1\n        else: out.append(r[j]); j += 1\n    return out + l[i:] + r[j:]\nprint(ms([9, 2, 7, 1, 5]))`, '[1, 2, 5, 7, 9]', 'Split at len(xs)//2', 'Prints [1, 2, 5, 7, 9].'),
      pt('p1106_3', '3-mashq: 3-Way Quick Sort', 'Task 3: 3-Way Quick Sort', '`[4, 2, 4, 1, 3]` ni 3-way Quick Sort bilan tartiblang.', 'Write 3-way quick sort.', `def qs(xs):\n    if len(xs) <= 1: return xs\n    p = xs[len(xs) // 2]\n    return qs([x for x in xs if x < p]) + [x for x in xs if x == p] + qs([x for x in xs if x > p])\nprint(qs([4, 2, 4, 1, 3]))`, '[1, 2, 3, 4, 4]', 'lt + eq + gt', 'Prints [1, 2, 3, 4, 4].'),
      pt('p1106_4', '4-mashq: Lomuto partition (in-place)', 'Task 4: In-Place Partition', '`[9, 3, 7, 2, 5]` da oxirgi `5` atrofida partition qilib pivot indeksini chiqaring.', 'Partition around last element.', `a = [9, 3, 7, 2, 5]\np, i = a[-1], 0\nfor j in range(len(a) - 1):\n    if a[j] <= p: a[i], a[j] = a[j], a[i]; i += 1\na[i], a[-1] = a[-1], a[i]\nprint(i, a[i])`, '2 5', 'Swap elements <= pivot to front', 'Prints 2 5.'),
      pt('p1106_5', '5-mashq: Ko‘p mezonli Timsort', 'Task 5: Multi-Key Timsort', '`(score, name)` juftliklarini avval score kamayishi, keyin name alifbosi bilan tartiblang.', 'Sort descending score, ascending name.', `rows = [(90, "Zed"), (95, "Bob"), (90, "Ali")]\nprint(sorted(rows, key=lambda r: (-r[0], r[1])))`, "[(95, 'Bob'), (90, 'Ali'), (90, 'Zed')]", 'key=lambda r: (-r[0], r[1])', 'Prints sorted tuples.'),
    ],
    quiz: [
      q('q1106_1', 'Merge Sort ning eng yomon holatdagi (worst-case) Time Complexity si?', 'Worst-case Time Complexity of Merge Sort?', ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], 1, 'Har doim kafolatlangan `O(n log n)`.', 'Guaranteed `O(n log n)`.'),
      q('q1106_2', 'Python built-in `sorted()` va `.sort()` qaysi gibrid algoritmdan foydalanadi?', 'Algorithm powering Python’s built-in `sorted()` and `.sort()`?', ['Quick Sort', 'Timsort (Merge Sort + Insertion Sort)', 'Heap Sort', 'Bubble Sort'], ['Quick Sort', 'Timsort (Merge Sort + Insertion Sort)', 'Heap Sort', 'Bubble Sort'], 1, 'Timsort.', 'Timsort.'),
      q('q1106_3', 'Quick Sort qaysi holatda O(n²) ga sekinlashib ketishi mumkin?', 'When does naive Quick Sort degrade to O(n^2)?', ['Massiv kichik bo‘lsa', 'Yomon pivot (masalan tartiblangan massivda doim 1-element) tanlanganda', 'Takror yo‘q bo‘lsa', 'Juft uzunlikda'], ['Tiny arrays', 'Poor pivot choices (e.g. first element on sorted input)', 'No duplicates', 'Even length'], 1, 'Doim eng kichik/katta pivot tanlanganda.', 'Skewed partitions from bad pivots.'),
      q('q1106_4', 'Merge Sort va Quick Sort orasidagi xotira/barqarorlik farqi?', 'Key difference between Merge Sort and in-place Quick Sort?', ['Ikkalasi O(1) RAM', 'Merge Sort Stable va O(n) xotira oladi; in-place Quick Sort Unstable va O(log n) stack', 'Quick Sort Stable', 'Merge Sort sekin'], ['Both O(1) RAM', 'Merge Sort is Stable with O(n) space; in-place Quick Sort is Unstable with O(log n) stack', 'Quick Sort Stable', 'Merge Sort slow'], 1, 'Merge Sort Stable + O(n) RAM; Quick Sort Unstable + O(log n) stack.', 'Stability and space trade-off.'),
      q('q1106_5', 'Merge Sort rekursiyasi qaysi shartda to‘xtashi shart?', 'Mandatory base case for recursive Merge Sort and Quick Sort?', ['len(xs) == 0', 'len(xs) <= 1', 'len(xs) == 2', 'xs is None'], ['len(xs) == 0', 'len(xs) <= 1', 'len(xs) == 2', 'xs is None'], 1, '`len(xs) <= 1`.', '`len(xs) <= 1`.'),
    ],
    homework: hw('QuickSelect (K-inchi Eng Kichik Element)', 'O(n) Average QuickSelect', 'Butun massivni O(n log n) tartiblamasdan, Quick Sort partition g‘oyasi bilan K-inchi eng kichik elementni **o‘rtacha O(n)** vaqtda topuvchi `quick_select(xs, k)` algoritmini yozing.', 'Implement `quick_select(xs, k)` using 3-way partitioning to find the k-th smallest element in O(n) average time.', ['Faqat kerakli yarmiga rekursiya qilish', 'sorted(xs)[k] bilan assert tekshiruvlar'], ['Recurse only into the relevant partition', 'Assert against sorted(xs)[k]'], 'if k < len(lt): return quick_select(lt, k) ...', '3-way selection.', 'In-place Quick Sort versiyasini ham taqqoslang.', 'Compare against in-place Quick Sort.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),
];
