import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C11_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-11-07',
    courseId: 'algorithms',
    moduleId: 'c11_m3',
    order: 7,
    titleUz: 'Stack (LIFO) va Queue (FIFO) (+ Review #24)',
    titleEn: 'Stacks (LIFO), Queues (FIFO) & Monotonic Stack (+ Review #24)',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-11-06'],
    conceptId: 'algo_stack_queue',
    whyUz: "Brauzerdagi \"Orqaga\" (Back) tugmasi, Ctrl+Z (Undo), funksiya chaqiruvlari (Call Stack) va qavs tekshirish **Stack (LIFO)** da; printer navbati, task brokerlar va BFS qidiruv esa **Queue (FIFO)** da ishlaydi! Python da to‘g‘ri konteynerni tanlash esa O(n) dan O(1) ga tezlatadi.",
    whyEn: 'Master LIFO Stacks (`list.append`/`pop`) and FIFO Queues (`collections.deque.append`/`popleft`), plus classic interview patterns like balanced brackets and monotonic stacks.',
    analogyUz: "**Stack (LIFO — Last In, First Out)**: ustma-ust terilgan likopchalar — eng oxirgi qo‘yilgani birinchi olinadi! **Queue (FIFO — First In, First Out)**: kassa navbati — birinchi kelgan odam birinchi xizmat oladi!",
    analogyEn: 'A Stack is a pile of plates (last placed on top leaves first); a Queue is a checkout line (first person in line leaves first).',
    stopsUz: "Python da **Stack** uchun oddiy `list` (`append()` + `pop()` ikkalasi ham O(1)) juda yaxshi, lekin **Queue** uchun ASLO `list.pop(0)` yozmang (u O(n)!) — doim **`collections.deque`** (`append()` + `popleft()`, O(1)) ishlating! Bo‘sh stack/queue dan `pop()` qilishdan oldin doim `if stack:` tekshiring.",
    stopsEn: 'Use `list` (`append`/`pop`) for Stacks, and ALWAYS use `collections.deque` (`append`/`popleft`) for Queues so dequeue stays O(1) instead of `list.pop(0)`’s O(n).',
    objUz: ['LIFO Stack (`append`/`pop`/`[-1]`) va FIFO Queue (`deque.append`/`popleft`) ni O(1) da qo‘llash', 'Qavslar balansini tekshirish (`valid_parentheses`) algoritmini yozish', 'Monotonic Stack bilan "Keyingi katta element" (Next Greater Element) ni O(n) da yechish'],
    objEn: ['Implement O(1) LIFO stacks and `deque`-backed FIFO queues', 'Solve balanced brackets validation cleanly with a stack', 'Use a Monotonic Stack to solve Next Greater Element in O(n)'],
    theoryUz: `### 1. Stack — LIFO (Oxirgi kirgan, birinchi chiqar)
Amallar: \`push -> append(x)\`, \`pop -> pop()\`, \`peek -> stack[-1]\`, \`is_empty -> not stack\`. Barchasi **O(1)**!
### 2. Queue — FIFO (Birinchi kirgan, birinchi chiqar)
\`collections.deque\`: \`enqueue -> q.append(x)\`, \`dequeue -> q.popleft()\`. Ikkalasi ham **O(1)**!
### 3. Klassik Stack Masalasi: Valid Parentheses
Ochiluvchi qavsni stack ga soling; yopiluvchi kelsa stack bo‘sh emasligi va jufti mosligini tekshiring; oxirida stack bo‘sh bo‘lishi shart!
### 4. Monotonic Stack (O(n))
Har bir element uchun o‘zidan o‘ngdagi birinchi katta sonni topishda har element stack ga ko‘pi bilan 1 marta kirib 1 marta chiqadi -> **O(n)**!`,
    theoryEn: `### 1. Stack (LIFO)
O(1) \`append()\`, \`pop()\`, and peek \`stack[-1]\` via Python \`list\` or \`deque\`.
### 2. Queue (FIFO)
O(1) \`append()\` and \`popleft()\` via \`collections.deque\`.
### 3. Balanced Parentheses
Push opening brackets, pop and match on closing brackets, and assert the stack ends empty.
### 4. Monotonic Stack Pattern
Maintain sorted invariants on the stack so each item pushes and pops at most once—achieving O(n) total runtime.`,
    examples: [
      ex('Misol 1: Stack bilan Qavslar Balansi (`valid_brackets`)', 'Example 1: Balanced Brackets with Stack', `def is_valid(s: str) -> bool:\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack: list[str] = []\n    for ch in s:\n        if ch in "([{":\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack\n\nprint(is_valid("({[]})"), is_valid("([)]"), is_valid("(("))`, `True False False`, 'Har bir yopiluvchi qavs eng oxirgi ochilgan qavs bilan mos kelishi shart.', 'Each closing delimiter must match the most recent unclosed opener on the stack.'),
      ex('Misol 2: `deque` bilan FIFO Navbat Simulyatori', 'Example 2: O(1) FIFO Queue with deque', `from collections import deque\n\nq = deque(["job1", "job2"])\nq.append("job3")\nfirst = q.popleft()\nprint("served:", first, "| waiting:", list(q))`, `served: job1 | waiting: ['job2', 'job3']`, '`deque.popleft()` O(1) da navbat boshidan xizmat ko‘rsatadi.', '`deque.popleft()` dequeues from the front in O(1) time.'),
      ex('Misol 3: Monotonic Stack — Next Greater Element O(n)', 'Example 3: Monotonic Stack (Next Greater Element)', `def next_greater(nums: list[int]) -> list[int]:\n    res = [-1] * len(nums)\n    stack: list[int] = []  # stores indices\n    for i, val in enumerate(nums):\n        while stack and nums[stack[-1]] < val:\n            res[stack.pop()] = val\n        stack.append(i)\n    return res\n\nprint(next_greater([2, 1, 2, 4, 3]))`, `[4, 2, 4, -1, -1]`, 'Ichki `while` bo‘lishiga qaramay, har indeks ko‘pi bilan 1 marta pop bo‘ladi -> umumiy vaqt O(n)!', 'Each index enters and leaves the monotonic stack once, yielding O(n) runtime.'),
    ],
    traceTitleUz: 'Balanced brackets stack izi',
    traceTitleEn: 'Tracing Bracket Stack',
    traceCode: `# input = "([])"\n# '(' -> ['('], '[' -> ['(', '['], ']' -> ['('], ')' -> []`,
    traceSteps: [
      traceStep(1, "'(' va '['", "stack=['(', '[']", 'Ochiluvchilar stack ga qo‘shildi', 'Pushed openers'),
      traceStep(2, "']'", "pop '[' -> ['(']", 'Juft mos keldi', 'Matched ] with ['),
      traceStep(3, "')'", "pop '(' -> []", 'Oxirida bo‘sh stack -> True', 'Stack empty -> True', 'True'),
    ],
    commonMistakes: [
      mistake('FIFO Navbatda `list.pop(0)` ishlatish', 'Using O(n) list.pop(0) as a Queue', `q = [1, 2, 3]\nfirst = q.pop(0)  # Shifts all remaining elements in memory!`, 'Degrades BFS / workers from O(n) to O(n^2)!', `from collections import deque\nq = deque([1, 2, 3])\nprint("O(1) popleft:", q.popleft())`, '100,000 ta elementda `list.pop(0)` dasturni O(n²) ga qotiradi.', '`list.pop(0)` shifts every item left in O(n) time.', 'Navbat uchun doim `collections.deque` va `.popleft()` ishlating.', 'Always use `collections.deque` with `.popleft()`.'),
      mistake('Qavs tekshirishda sikl tugagach `return True` deb yozib qo‘yish', 'Returning True Without Checking Empty Stack', `# For input "((", the loop finishes without mismatch, yet stack is still ["(", "("]!`, 'Returns True on unclosed "("!', `print("Always return 'not stack' at the end!")`, 'Ochilgan qavslar yopilmagan bo‘lsa oxirida stack bo‘sh bo‘lmaydi.', 'Unclosed opening brackets leave items on the stack.', 'Oxirida `return len(stack) == 0` (`not stack`) qaytaring.', 'Return `not stack`.'),
    ],
    compareTitleUz: 'Stack (LIFO) vs Queue (FIFO)',
    compareTitleEn: 'Stack (LIFO) vs Queue (FIFO)',
    compareUz: ['Stack (`list` append/pop): Undo/Redo, qavs tekshirish, DFS, expression evaluation.', 'Queue (`deque` append/popleft): Task navbatlari, Rate limiter, BFS eng qisqa yo‘l.'],
    compareEn: ['Stack (`list` append/pop): Undo/Redo, bracket matching, DFS, call stacks.', 'Queue (`deque` append/popleft): task queues, schedulers, BFS shortest paths.'],
    compareSummaryUz: 'Stack uchun `list` (`append`/`pop`), Queue uchun esa `collections.deque` (`append`/`popleft`) ishlating — ikkalasida ham O(1)!',
    compareSummaryEn: 'Use `list` for O(1) LIFO Stacks and `collections.deque` for O(1) FIFO Queues.',
    practiceTasks: [
      pt('p1107_1', '1-mashq: Stack bilan satrni teskari qilish', 'Task 1: Reverse String via Stack', '`"abc"` harflarini stack ga push qilib pop bilan teskarisini yig‘ing.', 'Reverse via stack.', `st = list("abc")\nout = "".join(st.pop() for _ in range(len(st)))\nprint(out)`, 'cba', 'Pop until empty', 'Prints cba.'),
      pt('p1107_2', '2-mashq: `deque` FIFO navbat', 'Task 2: FIFO Deque Order', '`1, 2, 3` ni navbatga qo‘shib 2 tasini `popleft()` qiling.', 'Dequeue two items.', `from collections import deque\nq = deque([1, 2, 3])\nprint(q.popleft(), q.popleft(), list(q))`, '1 2 [3]', 'q.popleft()', 'Prints 1 2 [3].'),
      pt('p1107_3', '3-mashq: Valid Parentheses', 'Task 3: Bracket Checker', '`"[()]"`, `"[)"`, `""` uchun `is_valid` natijalarini chiqaring.', 'Check brackets.', `def ok(s):\n    m, st = {")":"(", "]":"[", "}":"{"}, []\n    for c in s:\n        if c in "([{": st.append(c)\n        elif not st or st.pop() != m[c]: return False\n    return not st\nprint(ok("[()]"), ok("[)"), ok(""))`, 'True False True', 'return not st', 'Prints True False True.'),
      pt('p1107_4', '4-mashq: Postfix (RPN) Kalkulyator', 'Task 4: Evaluate Postfix', '`["2", "3", "+", "4", "*"]` ifodasini stack bilan hisoblang -> `20`.', 'Evaluate RPN with stack.', `st = []\nfor tok in ["2", "3", "+", "4", "*"]:\n    if tok == "+": st.append(st.pop() + st.pop())\n    elif tok == "*": st.append(st.pop() * st.pop())\n    else: st.append(int(tok))\nprint(st[0])`, '20', 'Pop two operands on operator', 'Prints 20.'),
      pt('p1107_5', '5-mashq: `MinStack` O(1) min', 'Task 5: O(1) MinStack', 'Har push da joriy min ni juft saqlab `get_min()` -> `2` chiqaring.', 'Track running min on stack.', `st = []\nfor x in [5, 2, 8]:\n    cur_min = x if not st else min(x, st[-1][1])\n    st.append((x, cur_min))\nprint(st[-1][1])`, '2', 'Store (val, min_so_far)', 'Prints 2.'),
    ],
    quiz: [
      q('q1107_1', 'Stack tuzilmasining asosiy qoidasi nima?', 'Access order of a Stack?', ['FIFO', 'LIFO (Last In, First Out)', 'Random', 'Sorted'], ['FIFO', 'LIFO (Last In, First Out)', 'Random', 'Sorted'], 1, 'LIFO — oxirgi kirgan birinchi chiqadi.', 'LIFO.'),
      q('q1107_2', 'Python da Queue (FIFO) uchun `list` o‘rniga `collections.deque` ishlatishning sababi?', 'Why prefer `collections.deque` over `list` for a FIFO Queue?', ['Chiroyli nomi', '`popleft()` O(1) ishlaydi (`list.pop(0)` esa O(n))', 'Tartiblaydi', 'JSON ga o‘giradi'], ['Nicer name', '`popleft()` is O(1) whereas `list.pop(0)` is O(n)', 'Auto-sorts', 'JSON'], 1, '`deque.popleft()` O(1) dir.', 'O(1) dequeue.'),
      q('q1107_3', 'Qavslarni tekshirish algoritmida sikl tugaganda `stack` qanday holatda bo‘lishi shart?', 'At the end of balanced-brackets checking, the stack must be:', ['To‘liq', 'Bo‘sh (`not stack`)', '1 ta elementli', 'None'], ['Full', 'Empty (`not stack`)', '1 item', 'None'], 1, 'Bo‘sh (`not stack`) bo‘lishi kerak.', 'Must be empty.'),
      q('q1107_4', 'Monotonic Stack bilan "Next Greater Element" masalasining Time Complexity si?', 'Time Complexity of Next Greater Element using a Monotonic Stack?', ['O(n^2)', 'O(n)', 'O(n log n)', 'O(2^n)'], ['O(n^2)', 'O(n)', 'O(n log n)', 'O(2^n)'], 1, 'Har bir element 1 marta push/pop -> `O(n)`.', '`O(n)`.'),
      q('q1107_5', 'Matn muharriridagi `Undo` (Ctrl+Z) tugmasi qaysi tuzilmaga tayanadi?', 'An editor’s Undo (Ctrl+Z) history naturally uses a:', ['Queue', 'Stack', 'Graph', 'Set'], ['Queue', 'Stack', 'Graph', 'Set'], 1, 'Stack (LIFO).', 'Stack.'),
    ],
    homework: hw('Browser History & Undo Engine', 'Dual-Stack Browser Navigation', 'Ikkita Stack (`back_stack` va `forward_stack`) bilan `visit(url)`, `back()`, `forward()` metodlariga ega `BrowserHistory` klassini yozing.', 'Implement `BrowserHistory` with `visit(url)`, `back()`, and `forward()` using two stacks in O(1) per operation.', ['Ikkita stack (list) bilan O(1) navigatsiya', 'Yangi sahifaga o‘tganda forward_stack tozalanishi'], ['O(1) dual-stack operations', 'Clear forward stack on new visit'], 'back_stack.append(cur); cur = forward_stack.pop()', 'Swap stacks on navigation.', 'Monotonic Stack bilan kunlik harorat ("Daily Temperatures") masalasini ham yeching.', 'Solve Daily Temperatures.', 25),
    reviewCheckpoint: review(
      24,
      'Review Loyiha #24: Binary Search + Stack + Queue Integratsiyasi (120-dars Marrasi!)',
      'Review Project #24: Job Dispatcher with Stack & Deque (120th Lesson!)',
      '120-dars marrasi! `collections.deque` navbati va LIFO `undo` stackini birlashtirib, sintaksisi tekshirilgan vazifalarni bajaruvchi mini-dispatcher yarating.',
      '120-lesson milestone! Combine a `deque` job queue, bracket validator stack, and undo stack into one clean algorithmic dispatcher.',
      ['Bracket validator (`is_valid`)', '`deque` bilan FIFO bajarish navbati', 'Stack bilan `undo_last()` qaytarish'],
      ['Stack bracket validation', 'O(1) `deque` FIFO execution', 'LIFO undo rollback stack'],
      `from collections import deque

def valid_expr(expr: str) -> bool:
    st = []
    for c in expr:
        if c == "(": st.append(c)
        elif c == ")":
            if not st: return False
            st.pop()
    return not st

queue = deque(["(1+2)", "(3*4", "(5-1)"])
done_stack = []
while queue:
    item = queue.popleft()
    if valid_expr(item):
        done_stack.append(item)
print("Executed valid:", done_stack, "| Undo:", done_stack.pop())
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-08',
    courseId: 'algorithms',
    moduleId: 'c11_m3',
    order: 8,
    titleUz: 'Linked Lists — Bog‘langan Ro‘yxatlar va Two-Pointer',
    titleEn: 'Linked Lists: Singly Linked Nodes, Reversal & Cycle Detection',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-11-07'],
    conceptId: 'algo_linked_list',
    whyUz: "Oddiy `list` xotirada uzluksiz massiv bo‘lgani uchun o‘rtasiga/boshiga qo‘shish O(n) turadi. **Linked List** esa har bir tugun (`Node(val, next)`) keyingi tugunning manzilini saqlaydigan zanjirdir — `LRU Cache` (`OrderedDict` ichki tuzilishi!) va barcha past darajali ro‘yxatlar aynan shunday quriladi!",
    whyEn: 'Build Singly Linked Lists (`Node(val, next)`), reverse pointers in-place in O(1) space, and detect cycles in O(n) time / O(1) space using Floyd’s fast/slow pointers.',
    analogyUz: "**Array (`list`)** — stadiondagi yonma-yon raqamlangan o‘rindiqlar (1-o‘ringa yangi odam o‘tirsa hamma siljishi kerak). **Linked List** — xazina izlash o‘yini: har bir xatda bir qiymat va \"keyingi xat qayerdaligi\" (`next`) ko‘rsatilgan!",
    analogyEn: 'An array seats everyone side-by-side; a linked list is a scavenger hunt where each clue holds a value and points to the next clue.',
    stopsUz: "Linked List da eng muhim 2 texnika: 1) Bosh tugun (`head`) o‘zgarishi mumkin bo‘lgan masalalarda **`dummy = Node(0, head)`** yordamchi tugun ishlating — edge case lar 10x soddalashadi! 2) Indeks bilan `ll[5]` O(1) da olish **mumkin emas** (O(n) yurib borish kerak).",
    stopsEn: 'Use a sentinel `dummy = Node(0, head)` whenever `head` might be removed or modified. Remember Linked Lists lack O(1) random indexing—reaching index `i` takes O(i) pointer hops.',
    objUz: ['`Node(val, next)` bilan Singly Linked List tuzish va `prepend`/`traverse` yozish', 'O(1) xotirada `reverse_list(head)` (3 pointers: `prev`, `curr`, `nxt`) yozish', 'Floyd’s Tortoise & Hare (fast/slow pointers) bilan cycle va o‘rta tugunni topish'],
    objEn: ['Construct and traverse Singly Linked Lists', 'Reverse a linked list in-place using `prev`, `curr`, `nxt` pointers', 'Detect cycles and midpoints in O(1) space with fast/slow pointers'],
    theoryUz: `### 1. \`Node\` Tuzilishi
\`\`\`python
class Node:
    def __init__(self, val: int, next: "Node | None" = None):
        self.val = val
        self.next = next
\`\`\`
### 2. Array vs Linked List
- **Head ga qo‘shish/olish**: Linked List **O(1)**, Python \`list\` **O(n)**.
- **Indeks \`arr[i]\`**: Python \`list\` **O(1)**, Linked List **O(n)**.
### 3. In-Place Reversal (3 Pointer)
\`prev = None, curr = head\`: \`nxt = curr.next; curr.next = prev; prev = curr; curr = nxt\`. Tugagach \`return prev\`!
### 4. Floyd’s Cycle Detection (Fast & Slow)
\`slow\` 1 qadam, \`fast\` 2 qadam yuradi: sikl bo‘lsa ular albatta uchrashadi (\`slow is fast\`); sikl bo‘lmasa \`fast\` \`None\` ga yetadi!`,
    theoryEn: `### 1. Node Definition
Each \`Node\` stores a value and a reference \`next\` to the successor node (or \`None\`).
### 2. Complexity Trade-offs
O(1) head insertion/deletion vs O(n) random access \`get(i)\`.
### 3. In-Place Reversal
Iterate with \`prev\`, \`curr\`, and saved \`nxt = curr.next\` in O(n) time and O(1) space.
### 4. Fast & Slow Pointers
Move \`slow\` by 1 and \`fast\` by 2 to find the middle node or detect cycles in O(1) auxiliary space.`,
    examples: [
      ex('Misol 1: Linked List qurish va In-Place Teskari Qilish', 'Example 1: Build & Reverse Linked List', `class Node:\n    def __init__(self, val: int, nxt=None):\n        self.val, self.next = val, nxt\n\ndef to_list(head) -> list[int]:\n    out = []\n    while head:\n        out.append(head.val); head = head.next\n    return out\n\ndef reverse(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev, curr = curr, nxt\n    return prev\n\nh = Node(1, Node(2, Node(3)))\nprint("orig:", to_list(h))\nrev = reverse(h)\nprint("rev:", to_list(rev))`, `orig: [1, 2, 3]\nrev: [3, 2, 1]`, 'Yangi tugun ochmasdan `next` ko‘rsatkichlarini teskari burdik (O(1) xotira).', 'Reverses pointer directions in-place in O(n) time and O(1) space.'),
      ex('Misol 2: Floyd’s Cycle Detection (Sikl bor-yo‘qligi)', 'Example 2: Cycle Detection with Fast & Slow', `class Node:\n    def __init__(self, val: int, nxt=None): self.val, self.next = val, nxt\n\ndef has_cycle(head) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow is fast:\n            return True\n    return False\n\na, b, c = Node(1), Node(2), Node(3)\na.next, b.next = b, c\nprint("no cycle:", has_cycle(a))\nc.next = b\nprint("with cycle:", has_cycle(a))`, `no cycle: False\nwith cycle: True`, 'Sikl yaratilganda tez ko‘rsatkich sekiniga O(1) xotirada yetib oladi.', 'Fast/slow pointers detect cycles without needing a visited `set`.'),
      ex('Misol 3: `dummy` tugun bilan qiymatni o‘chirish', 'Example 3: Sentinel Dummy Node Removal', `class Node:\n    def __init__(self, val=0, nxt=None): self.val, self.next = val, nxt\n\ndef remove_val(head, target: int):\n    dummy = Node(0, head)\n    prev = dummy\n    while prev.next:\n        if prev.next.val == target:\n            prev.next = prev.next.next\n        else:\n            prev = prev.next\n    return dummy.next\n\nh = remove_val(Node(1, Node(2, Node(1))), 1)\nprint(h.val, h.next)`, `2 None`, '`dummy` tugun `head` ning o‘zi o‘chirilganda ham maxsus `if` yozishdan qutqaradi.', 'A sentinel `dummy` node handles head deletion uniformly.'),
    ],
    traceTitleUz: 'Reverse pointer izi',
    traceTitleEn: 'Tracing In-Place Reversal',
    traceCode: `# 1 -> 2 -> None\n# step1: 1 -> None (prev=1, curr=2)\n# step2: 2 -> 1 -> None (prev=2, curr=None)`,
    traceSteps: [
      traceStep(1, 'curr=1, prev=None', '1.next = None', '1-tugun orqaga qaradi', 'Reversed 1 -> None'),
      traceStep(2, 'curr=2, prev=1', '2.next = 1', '2-tugun 1 ga qaradi', 'Reversed 2 -> 1'),
      traceStep(3, 'curr=None', 'return prev (2)', 'Yangi head = 2', 'Returned new head 2', '[2, 1]'),
    ],
    commonMistakes: [
      mistake('`curr.next = prev` dan oldin `nxt = curr.next` ni saqlamaslik', 'Losing the Rest of the List Before Rebinding curr.next', `# If you write curr.next = prev before saving nxt = curr.next, the rest of the list is lost!`, 'Truncates list after 1 node', `print("Save nxt = curr.next FIRST, then overwrite curr.next = prev!")`, '`curr.next` ni o‘zgartirsangiz keyingi tugunga yo‘l yo‘qoladi.', 'Rebinding `curr.next` destroys the forward link unless saved first.', 'Birinchi qator: `nxt = curr.next`.', 'Save `nxt = curr.next` first.'),
      mistake('Fast pointer da `while fast:` deb `fast.next` ni tekshirmaslik', 'Calling fast.next.next Without Checking fast.next', `# If fast is the tail node, fast.next is None -> fast.next.next raises AttributeError!`, 'AttributeError: NoneType has no attribute next', `print("Always write: while fast and fast.next:")`, 'Oxirgi tugunda `fast.next` `None` bo‘ladi!', 'At the tail, `fast.next` is `None`.', '`while fast and fast.next:` yozing.', 'Guard both `fast` and `fast.next`.'),
    ],
    compareTitleUz: 'Python `list` (Array) vs Linked List',
    compareTitleEn: 'Dynamic Array (`list`) vs Linked List',
    compareUz: ['Python `list`: tasodifiy indeks `xs[i]` O(1), keshga do‘st, 95% holatda tezroq.', 'Linked List: O(1) o‘rtadan/boshidan uzish (iteratsiya davomida, masalan LRU Cache doubly-linked list).'],
    compareEn: ['Dynamic Array: O(1) indexing and CPU cache locality—default choice in Python.', 'Linked List: O(1) splice/unlink given a node reference (e.g., LRU Cache).'],
    compareSummaryUz: 'Linked List ko‘rsatkichlar (`prev`/`curr`/`nxt`, `dummy`, fast/slow) bilan fikrlashni o‘rgatadi va LRU keshlarda qo‘llanadi.',
    compareSummaryEn: 'Master sentinel `dummy` nodes, in-place reversal, and fast/slow pointers for linked structures and LRU caches.',
    practiceTasks: [
      pt('p1108_1', '1-mashq: Tugunlar yig‘indisi', 'Task 1: Sum Linked List', '`Node(3, Node(5, Node(2)))` tugunlari yig‘indisini hisoblang.', 'Sum linked nodes.', `class Node:\n    def __init__(self, v, n=None): self.val, self.next = v, n\nh = Node(3, Node(5, Node(2)))\ns = 0\nwhile h: s += h.val; h = h.next\nprint(s)`, '10', 'while h: s += h.val', 'Prints 10.'),
      pt('p1108_2', '2-mashq: Boshiga qo‘shish (`prepend`)', 'Task 2: O(1) Prepend', 'Bo‘sh ro‘yxat boshiga 10, keyin 20 qo‘shib elementlarni chiqaring.', 'Prepend nodes.', `class Node:\n    def __init__(self, v, n=None): self.val, self.next = v, n\nh = Node(20, Node(10))\nprint(h.val, h.next.val)`, '20 10', 'Node(new, head)', 'Prints 20 10.'),
      pt('p1108_3', '3-mashq: O‘rta tugunni topish', 'Task 3: Middle Node (Slow/Fast)', '`1->2->3->4->5` da `slow/fast` bilan o‘rta tugun (`3`) ni toping.', 'Find middle node.', `class Node:\n    def __init__(self, v, n=None): self.val, self.next = v, n\nh = Node(1, Node(2, Node(3, Node(4, Node(5)))))\ns = f = h\nwhile f and f.next: s, f = s.next, f.next.next\nprint(s.val)`, '3', 'while f and f.next', 'Prints 3.'),
      pt('p1108_4', '4-mashq: Teskari aylantirish', 'Task 4: Reverse Linked List', '`1->2` ni teskari qilib `2 1` chiqaring.', 'Reverse 1->2.', `class Node:\n    def __init__(self, v, n=None): self.val, self.next = v, n\np, c = None, Node(1, Node(2))\nwhile c: nxt = c.next; c.next = p; p, c = c, nxt\nprint(p.val, p.next.val)`, '2 1', 'prev, curr, nxt', 'Prints 2 1.'),
      pt('p1108_5', '5-mashq: Sikl aniqlash', 'Task 5: Detect Cycle', '2 ta tugunli siklda `has_cycle` `True` berishini tasdiqlang.', 'Detect 2-node cycle.', `class Node:\n    def __init__(self, v, n=None): self.val, self.next = v, n\na, b = Node(1), Node(2)\na.next, b.next = b, a\ns = f = a; cyc = False\nwhile f and f.next:\n    s, f = s.next, f.next.next\n    if s is f: cyc = True; break\nprint(cyc)`, 'True', 's is f', 'Prints True.'),
    ],
    quiz: [
      q('q1108_1', 'Singly Linked List da k-inchi indeksga yetib borish (`get(k)`) Time Complexity si?', 'Time Complexity of random access `get(k)` in a Singly Linked List?', ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], 1, 'Boshidan ko‘rsatkich bo‘ylab yurish kerak -> `O(n)`.', 'O(n) traversal.'),
      q('q1108_2', 'Floyd’s Cycle Detection (Tortoise & Hare) qo‘shimcha xotira (Space) sarfi?', 'Auxiliary Space Complexity of Floyd’s Fast/Slow cycle detection?', ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], 1, 'Faqat 2 ta pointer (`slow`, `fast`) -> `O(1)`.', 'O(1) space.'),
      q('q1108_3', 'Linked List masalalarida `dummy = Node(0, head)` tugunini ishlatishning foydasi?', 'Why use a sentinel `dummy` node before `head`?', ['Tezlatish uchun', '`head` ning o‘zi o‘chiriladigan/o‘zgaradigan chekka holatlarni soddalashtiradi', 'Sikl yaratish', 'Sortlash'], ['Speed', 'Eliminates special-case branching when `head` itself changes', 'Creates cycles', 'Sorts'], 1, '`head` o‘zgarishidagi chekka holatlarni yo‘qotadi.', 'Simplifies head edge cases.'),
      q('q1108_4', 'Linked List ni teskari qilish (`reverse`) da `curr.next = prev` dan oldin nima saqlanadi?', 'Before reassigning `curr.next = prev` during list reversal, you must save:', ['prev.next', 'nxt = curr.next', 'head.val', 'dummy.val'], ['prev.next', 'nxt = curr.next', 'head.val', 'dummy.val'], 1, '`nxt = curr.next`.', '`nxt = curr.next`.'),
      q('q1108_5', 'Fast/slow siklida `AttributeError` bo‘lmasligi uchun to‘g‘ri `while` sharti?', 'Safe loop guard for moving `fast = fast.next.next`?', ['while fast:', 'while fast and fast.next:', 'while slow:', 'while True:'], ['while fast:', 'while fast and fast.next:', 'while slow:', 'while True:'], 1, '`while fast and fast.next:`.', '`while fast and fast.next:`.'),
    ],
    homework: hw('Ikki Tartiblangan Linked List ni Birlashtirish', 'Merge Two Sorted Linked Lists', '`dummy` tugun yordamida ikkita tartiblangan Singly Linked List (`l1` va `l2`) ni yangi tugun yaratmasdan O(n+m) vaqt va O(1) xotirada birlashtiruvchi `merge_two_lists(l1, l2)` funksiyasini yozing.', 'Merge two sorted singly linked lists in O(n+m) time and O(1) space using a sentinel `dummy` node.', ['Sentinel dummy node ishlatish', 'O(1) qo‘shimcha xotira (mavjud tugunlarni ulash)'], ['Use sentinel dummy node', 'Splice existing nodes in O(1) space'], 'tail.next = l1 if l1.val <= l2.val else l2', 'Splice smaller head.', 'Doubly Linked List bilan oddiy LRU kesh skeletini ham tuzing.', 'Try a doubly-linked LRU node.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-09',
    courseId: 'algorithms',
    moduleId: 'c11_m3',
    order: 9,
    titleUz: 'Trees va Binary Search Trees (DFS, BFS va BST)',
    titleEn: 'Binary Trees, Traversals (DFS/BFS) & Binary Search Trees',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-11-08'],
    conceptId: 'algo_trees_bst',
    whyUz: "Fayl tizimi papkalari, HTML DOM daraxti, JSON tuzilmasi va ma’lumotlar bazasi indekslari (B-Tree) — barchasi **Tree** dir! Daraxt bo‘ylab yurish (**Preorder, Inorder, Postorder** DFS va Level-order BFS) hamda **BST** da O(log n) qidiruv algoritmlarning yuragi hisoblanadi.",
    whyEn: 'Traverse Binary Trees with Preorder/Inorder/Postorder DFS and `deque`-based BFS level order, and search/insert in Binary Search Trees (BST).',
    analogyUz: "**Binary Tree** — boshqaruv daraxti: har bir menejer (`node`) ko‘pi bilan 2 ta bo‘linma (`left`, `right`) ga ega. **BST (Binary Search Tree)** da esa qatʼiy qonun bor: chap bo‘limdagilarning **barchasi** boshliqdan kichik, o‘ngdagilarning **barchasi** katta!",
    analogyEn: 'A Binary Tree branches into at most two children; a BST enforces the invariant that every value in the left subtree is smaller and every value in the right subtree is larger.',
    stopsUz: "1) **BST da Inorder (Chap -> Ildiz -> O‘ng)** yurish har doim **saralangan (sorted) ro‘yxat** beradi! 2) BST ni tekshirishda (`is_valid_bst`) faqat `node.left.val < node.val` emas, butun subtree uchun **`(low, high)` chegara diapazonini** tekshirish shart! 3) Muvozanatsiz (skewed) BST O(n) ga sekinlashishi mumkin.",
    stopsEn: 'Inorder traversal of a valid BST always yields sorted values. When validating a BST, check each node against inherited `(low, high)` bounds—not just its immediate parent!',
    objUz: ['TreeNode bilan Preorder, Inorder, Postorder (DFS) rekursiv yurishlarni yozish', '`collections.deque` bilan Level-Order (BFS) yurish', 'BST ga qiymat qo‘shish (`insert`), qidirish (`search`) va `(low, high)` bilan `is_valid_bst` tekshirish'],
    objEn: ['Implement Preorder, Inorder, and Postorder DFS traversals', 'Traverse level-by-level with a `deque` BFS queue', 'Insert, search, and validate BST bounds `(low, high)`'],
    theoryUz: `### 1. Daraxt Atamalari
Root (ildiz), Parent/Child, Leaf (bargsiz oxirgi tugun), Height/Depth (balandlik).
### 2. DFS Yurish Tartiblari (Depth-First)
- **Preorder** (Root -> Left -> Right): daraxtni nusxalash/serializatsiya.
- **Inorder** (Left -> Root -> Right): **BST ni tartiblangan holda beradi!**
- **Postorder** (Left -> Right -> Root): daraxtni o‘chirish/hajm hisoblash.
### 3. BFS — Level-Order Traversal
\`collections.deque([root])\` bilan qavatma-qavat yurish.
### 4. BST (Binary Search Tree)
- Muvozanatli daraxtda \`search\`/\`insert\`: **O(log n)**.
- Tartiblangan ketma-ketlikni qo‘shaversak tayoqqa (skewed) aylanib **O(n)** bo‘ladi (shuning uchun DB larda muvozanatli AVL / Red-Black / B-Tree ishlatiladi).`,
    theoryEn: `### 1. Tree Terminology
Root, Parent, Child, Leaf (\`left is None and right is None\`), Height.
### 2. DFS Traversals
Preorder (Root-Left-Right), Inorder (Left-Root-Right -> **sorted in BST!**), Postorder (Left-Right-Root).
### 3. BFS Level-Order
Use \`collections.deque([root])\` to visit nodes layer by layer.
### 4. BST Invariant & Balance
Left subtree < Node < Right subtree gives O(log n) balanced search, degrading to O(n) when skewed.`,
    examples: [
      ex('Misol 1: BST yaratish va Inorder / Level-Order yurishlar', 'Example 1: BST Insert, Inorder & BFS Level Order', `from collections import deque\n\nclass TreeNode:\n    def __init__(self, val: int, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\ndef bst_insert(root, val: int):\n    if root is None: return TreeNode(val)\n    if val < root.val: root.left = bst_insert(root.left, val)\n    elif val > root.val: root.right = bst_insert(root.right, val)\n    return root\n\ndef inorder(node) -> list[int]:\n    return [] if not node else inorder(node.left) + [node.val] + inorder(node.right)\n\ndef level_order(root) -> list[list[int]]:\n    if not root: return []\n    q, res = deque([root]), []\n    while q:\n        lvl = []\n        for _ in range(len(q)):\n            cur = q.popleft()\n            lvl.append(cur.val)\n            if cur.left: q.append(cur.left)\n            if cur.right: q.append(cur.right)\n        res.append(lvl)\n    return res\n\nroot = None\nfor v in [5, 3, 7, 2, 4, 8]: root = bst_insert(root, v)\nprint("inorder:", inorder(root))\nprint("levels:", level_order(root))`, `inorder: [2, 3, 4, 5, 7, 8]\nlevels: [[5], [3, 7], [2, 4, 8]]`, 'BST da Inorder natija har doim o‘sish tartibida, BFS esa qavatma-qavat chiqadi.', 'Inorder yields sorted keys from a BST while `deque` BFS groups levels cleanly.'),
      ex('Misol 2: `is_valid_bst` `(low, high)` chegara bilan', 'Example 2: Validating BST with Range Bounds', `class TreeNode:\n    def __init__(self, val: int, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\nroot = TreeNode(5, TreeNode(3, TreeNode(2), TreeNode(4)), TreeNode(7, None, TreeNode(8)))\n\ndef is_valid_bst(node, low=float("-inf"), high=float("inf")) -> bool:\n    if not node: return True\n    if not (low < node.val < high): return False\n    return is_valid_bst(node.left, low, node.val) and is_valid_bst(node.right, node.val, high)\n\nprint(is_valid_bst(root))`, `True`, 'Butun subtree qiymatlari ajdod tugunlar qo‘ygan `(low, high)` oralig‘iga sig‘ishi tekshiriladi.', 'Range bounds catch grand-child violations that parent-only checks miss.'),
      ex('Misol 3: Daraxt balandligi (Max Depth)', 'Example 3: Tree Max Depth', `class TreeNode:\n    def __init__(self, val: int, left=None, right=None):\n        self.val, self.left, self.right = val, left, right\n\nroot = TreeNode(5, TreeNode(3, TreeNode(2), TreeNode(4)), TreeNode(7, None, TreeNode(8)))\n\ndef max_depth(node) -> int:\n    if not node: return 0\n    return 1 + max(max_depth(node.left), max_depth(node.right))\n\nprint("depth:", max_depth(root))`, `depth: 3`, 'Postorder rekursiyasi chap va o‘ng balandliklardan kattasiga `1` qo‘shadi.', 'Depth equals `1 + max(left_depth, right_depth)`.'),
    ],
    traceTitleUz: 'Inorder DFS izi',
    traceTitleEn: 'Tracing Inorder Traversal',
    traceCode: `# Tree: 2 with left=1, right=3\n# inorder(1)->[1], visit 2, inorder(3)->[3]`,
    traceSteps: [
      traceStep(1, 'inorder(node.left)', '[1]', 'Chap bargga tushildi', 'Visited left child 1'),
      traceStep(2, 'visit node.val', '2', 'Ildiz olindi', 'Visited root 2'),
      traceStep(3, 'inorder(node.right)', '[3]', 'O‘ng barg olindi', 'Visited right child 3', '[1, 2, 3]'),
    ],
    commonMistakes: [
      mistake('BST tekshirishda faqat bevosita farzandlarni (`left < root < right`) solishtirish', 'Checking Only Immediate Children in is_valid_bst', `# Tree: 5 -> right=7, 7 -> left=3. Local check 3 < 7 passes, yet 3 < 5 violates BST!`, 'Accepts invalid BST!', `print("Pass (low, high) interval bounds down recursion!")`, 'O‘ng tomondagi nevara tugun ildiz `5` dan kichik bo‘lib qolishi mumkin.', 'A grandchild in the right subtree could still be smaller than an ancestor.', 'Har doim `(low, node.val)` va `(node.val, high)` oralig‘ini uzating.', 'Propagate `(low, high)` bounds recursively.'),
      mistake('BFS daraxt yurishida `None` bolalarni navbatga qo‘shib yuborish', 'Enqueuing None Children in BFS', `# Appending None without if cur.left: crashes on cur.val!`, 'AttributeError: NoneType has no attribute val', `print("Check if cur.left: before q.append(cur.left)!")`, 'Navbatga faqat mavjud tugunlarni (`is not None`) qo‘shing.', 'Only enqueue non-None children.', '`if cur.left:` tekshiruvini qo‘ying.', 'Guard child existence before appending.'),
    ],
    compareTitleUz: 'DFS (Recursion/Stack) vs BFS (`deque` Queue)',
    compareTitleEn: 'DFS vs BFS on Trees',
    compareUz: ['DFS (Pre/In/Postorder): BST ni tartibli o‘qish, balandlik hisoblash, kamroq xotira chuqur tor daraxtlarda.', 'BFS (Level-order): eng yaqin bargni topish, daraxtni qavatma-qavat chop etish.'],
    compareEn: ['DFS: sorted BST readout, height/subtree aggregations, path searches.', 'BFS: level-by-level processing and shortest depth from root.'],
    compareSummaryUz: 'Daraxtlarda Inorder/Preorder/Postorder DFS va `deque`-asosli BFS hamda BST `(low, high)` invariantini puxta biling.',
    compareSummaryEn: 'Use Inorder DFS for sorted BST readout, `(low, high)` bounds for validation, and `deque` for BFS levels.',
    practiceTasks: [
      pt('p1109_1', '1-mashq: Preorder traversal', 'Task 1: Preorder DFS', '`2(left=1, right=3)` daraxtni Preorder (`[2, 1, 3]`) chiqaring.', 'Write preorder().', `class N:\n    def __init__(self, v, l=None, r=None): self.v, self.l, self.r = v, l, r\ndef pre(n): return [] if not n else [n.v] + pre(n.l) + pre(n.r)\nprint(pre(N(2, N(1), N(3))))`, '[2, 1, 3]', 'Root + left + right', 'Prints [2, 1, 3].'),
      pt('p1109_2', '2-mashq: Barg tugunlarni sanash', 'Task 2: Count Leaves', 'Chap va o‘ng bolasi yo‘q tugunlarni (`count_leaves`) sanang.', 'Count leaf nodes.', `class N:\n    def __init__(self, v, l=None, r=None): self.v, self.l, self.r = v, l, r\ndef leaves(n):\n    if not n: return 0\n    if not n.l and not n.r: return 1\n    return leaves(n.l) + leaves(n.r)\nprint(leaves(N(2, N(1), N(3, N(4)))))`, '2', 'not n.l and not n.r', 'Prints 2.'),
      pt('p1109_3', '3-mashq: BST Search O(log n)', 'Task 3: BST Search', 'BST dan berilgan qiymatni qidiring.', 'Search inside BST.', `class N:\n    def __init__(self, v, l=None, r=None): self.v, self.l, self.r = v, l, r\ndef find(n, x):\n    while n:\n        if x == n.v: return True\n        n = n.l if x < n.v else n.r\n    return False\nt = N(5, N(2), N(8))\nprint(find(t, 8), find(t, 6))`, 'True False', 'Go left if x < n.v else right', 'Prints True False.'),
      pt('p1109_4', '4-mashq: Daraxt tugunlari yig‘indisi', 'Task 4: Sum All Tree Nodes', 'Daraxtdagi barcha qiymatlar yig‘indisini Postorder da hisoblang.', 'Sum tree values.', `class N:\n    def __init__(self, v, l=None, r=None): self.v, self.l, self.r = v, l, r\ndef total(n): return 0 if not n else total(n.l) + total(n.r) + n.v\nprint(total(N(5, N(3), N(7))))`, '15', 'left + right + n.v', 'Prints 15.'),
      pt('p1109_5', '5-mashq: BFS level-order tekis ro‘yxat', 'Task 5: Flat BFS Order', '`deque` bilan daraxtni qavatma-qavat tekis ro‘yxatga chiqaring.', 'Traverse via deque BFS.', `from collections import deque\nclass N:\n    def __init__(self, v, l=None, r=None): self.v, self.l, self.r = v, l, r\nq, out = deque([N(1, N(2), N(3))]), []\nwhile q:\n    c = q.popleft(); out.append(c.v)\n    if c.l: q.append(c.l)\n    if c.r: q.append(c.r)\nprint(out)`, '[1, 2, 3]', 'deque popleft', 'Prints [1, 2, 3].'),
    ],
    quiz: [
      q('q1109_1', 'BST (Binary Search Tree) ustida qaysi yurish tartibi elementlarni o‘sish tartibida beradi?', 'Which traversal yields a BST’s values in sorted ascending order?', ['Preorder', 'Inorder (Left -> Root -> Right)', 'Postorder', 'BFS'], ['Preorder', 'Inorder (Left -> Root -> Right)', 'Postorder', 'BFS'], 1, 'Inorder traversal.', 'Inorder traversal.'),
      q('q1109_2', 'Daraxtni qavatma-qavat (Level-Order / BFS) aylanishda qaysi ma’lumot tuzilmasi ishlatiladi?', 'Data structure used for BFS Level-Order traversal?', ['Stack', 'Queue (collections.deque)', 'Set', 'Heap'], ['Stack', 'Queue (collections.deque)', 'Set', 'Heap'], 1, 'FIFO Queue (`collections.deque`).', 'FIFO Queue (`deque`).'),
      q('q1109_3', 'Muvozanatli BST da qidiruvning o‘rtacha Time Complexity si?', 'Average Time Complexity of searching a balanced BST?', ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], 1, '`O(log n)`.', '`O(log n)`.'),
      q('q1109_4', '`is_valid_bst` yozishda nima uchun har bir tugunga `(low, high)` chegaralari uzatiladi?', 'Why pass `(low, high)` bounds down recursively when validating a BST?', ['Xotira tejash uchun', 'Subtree dagi nevara tugunlar ham barcha ajdod qoidalariga mosligini tekshirish uchun', 'Tezlik uchun', 'Keragi yo‘q'], ['Save RAM', 'Every descendant must stay strictly bounded by all ancestor constraints', 'Speed', 'Optional'], 1, 'Barcha avlodlar ajdod oralig‘ida turishi shart.', 'Ancestors constrain entire subtrees.'),
      q('q1109_5', 'Tartiblangan `[1, 2, 3, 4, 5]` sonlar ketma-ket oddiy BST ga qo‘shilsa daraxt qanday shaklga tushadi?', 'Inserting sorted `[1, 2, 3, 4, 5]` sequentially into an unbalanced BST produces:', ['To‘liq muvozanatli daraxt', 'Tayoqsimon (skewed) O(n) zanjir', 'Sikl', 'Bo‘sh daraxt'], ['Balanced tree', 'Skewed O(n) chain', 'Cycle', 'Empty tree'], 1, 'O‘ngga cho‘zilgan tayoqsimon O(n) zanjir.', 'Skewed O(n) chain.'),
    ],
    homework: hw('BST Katalog & Eng Kichik K-element', 'BST Kth Smallest & LCA', 'BST ga ma’lumot qo‘shib, iterativ/rekursiv `kth_smallest(root, k)` (Inorder yordamida) va ikki tugunning **Lowest Common Ancestor (LCA)** sini O(log n) da topuvchi funksiyalarni yozing.', 'Build a BST supporting `kth_smallest(root, k)` via Inorder traversal and `lca(root, p, q)` exploiting BST ordering.', ['kth_smallest va lca funksiyalari', '5 ta assert test'], ['Implement kth_smallest and lca', '5 assertions'], 'If p < node.val and q < node.val: recurse left ...', 'Exploit BST bounds for LCA.', 'Balanced sorted array dan minimal balandlikdagi BST quruvchi `sorted_to_bst` ham qo‘shing.', 'Add `sorted_to_bst`.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-10',
    courseId: 'algorithms',
    moduleId: 'c11_m4',
    order: 10,
    titleUz: 'Graphs — Graflar, Adjacency List, BFS va DFS',
    titleEn: 'Graphs: Adjacency Lists, BFS Shortest Path & DFS',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-11-09'],
    conceptId: 'algo_graphs',
    whyUz: "Shaharlar orasidagi eng qisqa yo‘l (Navigator), ijtimoiy tarmoqdagi do‘stlar tarmog‘i, paketlar bog‘liqligi (dependency graph) va tarmoq marshrutizatsiyasi — barchasi **Graph (Graf)** dir! Daraxtdan farqli o‘laroq grafda **sikllar** bo‘lishi mumkin — shuning uchun `visited` to‘plamisiz cheksiz siklga tushasiz!",
    whyEn: 'Model connected networks with Adjacency Lists (`dict[str, list[str]]`), traverse with BFS and DFS using `visited` sets, and find unweighted shortest paths.',
    analogyUz: "**Graph** — metro xaritasi: bekatlar (`vertices/nodes`), chiziqlar (`edges`). Daraxtda yo‘l faqat pastga yuradi va aylanib qaytmaydi; metro xaritasida esa aylana yo‘llar bor — shuning uchun qaysi bekatga kirganingizni daftarga (`visited = set()`) belgilab yurmasangiz abadiy aylanasiz!",
    analogyEn: 'A graph is a subway network with possible loops—you MUST mark visited stations in a `visited` set so BFS/DFS never spins forever.',
    stopsUz: "Graf masalalarida 2 oltin qoida: 1) **BFS** (`deque`) vaznsiz grafda **eng qisqa yo‘lni (shortest path in hops)** kafolatlaydi (`DFS` esa kafolatlamaydi!). 2) **`visited` ga tugunni `pop` qilganda emas, `queue.append()` qilayotganda qo‘shing** — aks holda bitta tugun navbatga o‘n marta tushib qoladi!",
    stopsEn: 'In unweighted graphs, BFS guarantees the shortest path (minimum edges), whereas DFS does not. Always add neighbors to `visited` immediately when enqueueing (`q.append`) to avoid duplicate queue entries.',
    objUz: ['Grafni Adjacency List (`dict` + `list`) ko‘rinishida ifodalash (directed vs undirected)', 'BFS (`deque`) bilan eng qisqa yo‘l masofasini va yo‘lini topish', 'DFS bilan bog‘langan komponentlar soni va sikl bor-yo‘qligini aniqlash'],
    objEn: ['Represent directed and undirected graphs as Adjacency Lists', 'Find unweighted shortest paths via BFS (`deque`)', 'Count connected components and detect cycles with `visited` sets'],
    theoryUz: `### 1. Adjacency List vs Matrix
Real hayotda graflar siyrak (sparse) bo‘lgani uchun \`graph: dict[str, list[str]]\` (Adjacency List) xotirada \`O(V + E)\` bilan eng qulay!
### 2. BFS — Eng Qisqa Yo‘l (Vaznsiz Graf)
\`q = deque([(start, 0)])\`, \`visited = {start}\`: har qadam qo‘shnilarini \`visited\` ga qo‘shib \`dist + 1\` bilan navbatga soladi. Time: **O(V + E)**.
### 3. DFS — Chuqurlik Bo‘ylab Qidirish
Rekursiya yoki \`stack\` bilan bog‘langan komponentlarni (masalan "orollar soni" — Number of Islands) va topologik tartibni topishda zo‘r!
### 4. \`visited\` To‘plami
Har doim tugunni navbatga qo‘shishdan OLDIN \`visited.add(nbr)\` qiling.`,
    theoryEn: `### 1. Adjacency List (\`O(V + E)\`)
\`dict[node, list[neighbor]]\` represents sparse real-world graphs compactly.
### 2. BFS Shortest Path
Enqueue \`(node, dist)\` and mark \`visited.add(nbr)\` on enqueue; the first time \`target\` is reached is guaranteed minimal hops.
### 3. DFS Connectivity
Explore full components recursively or via an explicit stack to count islands or reachability.
### 4. Cycle Safety
Unlike trees, graphs contain cycles—never omit \`visited\`.`,
    examples: [
      ex('Misol 1: BFS bilan Eng Qisqa Masofa (`shortest_hops`)', 'Example 1: BFS Unweighted Shortest Path', `from collections import deque\n\ndef shortest_path(graph: dict[str, list[str]], start: str, goal: str) -> int:\n    if start == goal: return 0\n    q = deque([(start, 0)])\n    visited = {start}\n    while q:\n        node, dist = q.popleft()\n        for nbr in graph.get(node, []):\n            if nbr == goal: return dist + 1\n            if nbr not in visited:\n                visited.add(nbr)\n                q.append((nbr, dist + 1))\n    return -1\n\ng = {"A": ["B", "C"], "B": ["D"], "C": ["D", "E"], "D": ["E"], "E": []}\nprint("A->E hops:", shortest_path(g, "A", "E"))`, `A->E hops: 2`, 'A -> C -> E eng qisqa yo‘li 2 qadamda topildi (A->B->D->E 3 qadamdan qisqa!).', 'BFS finds the 2-hop shortest path `A -> C -> E` immediately.'),
      ex('Misol 2: DFS bilan Bog‘langan Komponentlar (Connected Components)', 'Example 2: DFS Connected Components Count', `def count_components(graph: dict[int, list[int]]) -> int:\n    visited: set[int] = set()\n    def dfs(u: int):\n        visited.add(u)\n        for v in graph.get(u, []):\n            if v not in visited: dfs(v)\n    count = 0\n    for node in graph:\n        if node not in visited:\n            count += 1\n            dfs(node)\n    return count\n\nug = {1: [2], 2: [1], 3: [4], 4: [3], 5: []}\nprint("Components:", count_components(ug))`, `Components: 3`, 'Grafda 3 ta alohida orol (`{1,2}`, `{3,4}`, `{5}`) borligi O(V+E) da topildi.', 'DFS counts 3 disconnected components cleanly in O(V + E).'),
      ex('Misol 3: Undirected Graf qurish yordamchisi', 'Example 3: Building Undirected Adjacency List', `from collections import defaultdict\n\nedges = [("A", "B"), ("B", "C")]\nadj = defaultdict(list)\nfor u, v in edges:\n    adj[u].append(v)\n    adj[v].append(u)\nprint({k: adj[k] for k in sorted(adj)})`, `{'A': ['B'], 'B': ['A', 'C'], 'C': ['B']}`, 'Yo‘naltirilmagan grafda har bir qirra ikkala yo‘nalishda ham qo‘shiladi.', 'Undirected edges add both `u -> v` and `v -> u`.'),
    ],
    traceTitleUz: 'BFS `visited` + `deque` izi',
    traceTitleEn: 'Tracing BFS Shortest Hops',
    traceCode: `# g = {A: [B, C], C: [D]}; start=A, goal=D`,
    traceSteps: [
      traceStep(1, 'pop (A, 0)', 'enqueue B(1), C(1)', 'visited={A,B,C}', 'Expanded A'),
      traceStep(2, 'pop (B, 1)', 'no neighbors', 'B da qo‘shni yo‘q', 'Expanded B'),
      traceStep(3, 'pop (C, 1)', 'nbr D == goal -> 2', 'Eng qisqa masofa 2!', 'Found goal at dist 2', '2'),
    ],
    commonMistakes: [
      mistake('Grafda `visited` to‘plamini unutib cheksiz siklga tushish', 'Infinite Loop by Omitting visited Set', `# In A <-> B, BFS/DFS without visited bounces A -> B -> A -> B forever!`, 'Infinite loop / RecursionError', `print("Always maintain visited = {start} and check if nbr not in visited!")`, 'Daraxtlardan farqli, graflarda sikl bor — `visited` majburiy!', 'Graphs contain cycles; `visited` prevents revisiting nodes.', '`visited = set()` dan foydalaning.', 'Track visited nodes.'),
      mistake('BFS da `visited.add(nbr)` ni `popleft` paytigacha kechiktirish', 'Marking Visited on Pop Instead of Enqueue', `# If A->B, A->C, B->D, C->D, marking on pop puts D into the queue TWICE!`, 'Exponential duplicate entries on dense grids', `print("Add to visited right when calling q.append(nbr)!")`, 'Bir nechta qo‘shni bir xil tugunni navbatga qayta-qayta tiqib yuborishi mumkin.', 'Delaying `visited.add` lets multiple paths enqueue the same node.', 'Navbatga solish zahoti `visited.add(nbr)` qiling.', 'Mark visited upon enqueue.'),
    ],
    compareTitleUz: 'Graf BFS vs Graf DFS',
    compareTitleEn: 'Graph BFS vs Graph DFS',
    compareUz: ['BFS (`deque`): vaznsiz eng qisqa yo‘l, daraja-daraja tarqalish (friends within 2 hops).', 'DFS (recursion/`stack`): yo‘l mavjudligi, komponentlar sanash, sikl/topologik tartiblash.'],
    compareEn: ['BFS (`deque`): guaranteed minimum-hop shortest paths on unweighted graphs.', 'DFS: connected components, cycle detection, topological ordering.'],
    compareSummaryUz: 'Siyrak graflarni Adjacency List (`dict[node, list]`) da saqlang, doim `visited` ishlating va eng qisqa yo‘l uchun BFS tanlang.',
    compareSummaryEn: 'Represent graphs with Adjacency Lists, guard loops with `visited`, and choose BFS for shortest paths.',
    practiceTasks: [
      pt('p1110_1', '1-mashq: Yo‘naltirilgan graf qo‘shnilari', 'Task 1: Build Directed Graph', '`[("A","B"), ("A","C")]` dan adjacency dict tuzib `"A"` qo‘shnilarini chiqaring.', 'Build directed adjacency dict.', `g = {}\nfor u, v in [("A", "B"), ("A", "C")]: g.setdefault(u, []).append(v)\nprint(g["A"])`, "['B', 'C']", 'g.setdefault(u, []).append(v)', "Prints ['B', 'C']."),
      pt('p1110_2', '2-mashq: DFS bilan yetib borish (`can_reach`)', 'Task 2: Reachability DFS', '`A->B->C` grafda `A` dan `C` ga va `C` dan `A` ga borish mumkinligini chiqaring.', 'Check directed reachability.', `g = {"A": ["B"], "B": ["C"], "C": []}\ndef can(s, t):\n    vis, st = set(), [s]\n    while st:\n        u = st.pop()\n        if u == t: return True\n        if u not in vis: vis.add(u); st.extend(g.get(u, []))\n    return False\nprint(can("A", "C"), can("C", "A"))`, 'True False', 'Iterative DFS stack', 'Prints True False.'),
      pt('p1110_3', '3-mashq: BFS eng qisqa masofa', 'Task 3: BFS Distance', '`{1:[2,3], 2:[4], 3:[4], 4:[]}` da `1->4` eng qisqa qadamini toping.', 'Find BFS hops 1->4.', `from collections import deque\ng = {1:[2,3], 2:[4], 3:[4], 4:[]}\nq, vis = deque([(1, 0)]), {1}\nwhile q:\n    u, d = q.popleft()\n    if u == 4: print(d); break\n    for v in g[u]:\n        if v not in vis: vis.add(v); q.append((v, d+1))`, '2', 'deque with (node, dist)', 'Prints 2.'),
      pt('p1110_4', '4-mashq: 2D Grid orollar soni (mini)', 'Task 4: Grid Neighbors', '3x3 grid da `(1, 1)` ning 4 ta qo‘shni koordinatalarini chiqaring.', 'List 4-directional grid neighbors.', `r, c = 1, 1\nprint([(r+dr, c+dc) for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]])`, '[(0, 1), (2, 1), (1, 0), (1, 2)]', '4 direction deltas', 'Prints 4 neighbors.'),
      pt('p1110_5', '5-mashq: Yo‘lning o‘zini tiklash (`parent`)', 'Task 5: Reconstruct BFS Path', '`parent` lug‘ati bilan `A -> B -> D` yo‘lini `["A", "B", "D"]` qilib tiklang.', 'Reconstruct path from parent map.', `parent = {"A": None, "B": "A", "D": "B"}\npath, cur = [], "D"\nwhile cur is not None: path.append(cur); cur = parent[cur]\nprint(path[::-1])`, "['A', 'B', 'D']", 'Walk parent backwards then reverse', "Prints ['A', 'B', 'D']."),
    ],
    quiz: [
      q('q1110_1', 'Vaznsiz (unweighted) grafda eng qisqa yo‘lni qaysi algoritm kafolatlaydi?', 'Which traversal guarantees the shortest path (fewest hops) in an unweighted graph?', ['DFS', 'BFS (`deque`)', 'Bubble Sort', 'Inorder'], ['DFS', 'BFS (`deque`)', 'Bubble Sort', 'Inorder'], 1, 'BFS (`deque`).', 'BFS.'),
      q('q1110_2', 'Grafni aylanishda `visited` to‘plamisiz ishlatsak nima sodir bo‘ladi?', 'What risk occurs if you traverse a graph without a `visited` set?', ['Tezroq ishlaydi', 'Sikllar tufayli cheksiz aylanish (infinite loop)', 'Xotira nol bo‘ladi', 'Tartiblanadi'], ['Faster', 'Infinite loops / recursion crashes on cycles', 'Zero RAM', 'Sorted'], 1, 'Sikllarda cheksiz aylanish.', 'Infinite loops on cycles.'),
      q('q1110_3', 'Adjacency List yordamida V ta tugun va E ta qirrali graf ustida BFS/DFS Time Complexity si?', 'Time Complexity of BFS/DFS on an Adjacency List with V vertices and E edges?', ['O(V * E)', 'O(V + E)', 'O(V^2)', 'O(log V)'], ['O(V * E)', 'O(V + E)', 'O(V^2)', 'O(log V)'], 1, '`O(V + E)`.', '`O(V + E)`.'),
      q('q1110_4', 'BFS da tugunni `visited` ga qaysi payt qo‘shish kerak?', 'When should a neighbor be added to `visited` during BFS?', ['Pop qilingandan keyin', 'Navbatga (`q.append`) qo‘shilayotgan zahoti', 'Sikl tugagach', 'Faqat oxirgi tugunda'], ['After popleft', 'Immediately when enqueued (`q.append`)', 'After loop', 'Only goal'], 1, 'Navbatga qo‘shilayotgan zahoti.', 'Immediately upon enqueueing.'),
      q('q1110_5', 'Siyrak (sparse) graflarni xotirada saqlashning eng tejamkor usuli?', 'Most space-efficient representation for sparse graphs?', ['Adjacency Matrix O(V^2)', 'Adjacency List `dict[node, list]` O(V+E)', 'Stack', 'Sorted tuple'], ['Adjacency Matrix O(V^2)', 'Adjacency List `dict[node, list]` O(V+E)', 'Stack', 'Sorted tuple'], 1, 'Adjacency List O(V+E).', 'Adjacency List.'),
    ],
    homework: hw('Kurslar Bog‘liqligi & Eng Qisqa Yo‘l', 'Course Prerequisites & Path Finder', 'Yo‘naltirilgan kurslar grafida (`{"PY-02": ["PY-01"], ...}`) `has_cycle(graph)` (3-rangli DFS: unvisited/visiting/visited) hamda `bfs_path(graph, start, goal)` yo‘l tiklovchi funksiyalarini yozing.', 'Implement 3-state cycle detection (`has_cycle`) for a directed dependency graph and `bfs_path(graph, start, goal)` returning the shortest path list.', ['3-holatli DFS sikl aniqlash', 'BFS parent xaritasi bilan yo‘l qaytarish'], ['3-state directed cycle detection', 'BFS path reconstruction'], 'Track 0=unvisited, 1=visiting (on stack), 2=done.', 'Back-edge to state 1 means cycle.', 'Kahn algoritmi (Topological Sort) ni ham qo‘shib ko‘ring.', 'Add Kahn topological order.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-11',
    courseId: 'algorithms',
    moduleId: 'c11_m4',
    order: 11,
    titleUz: 'Recursion, Memoization (DP) va Backtracking',
    titleEn: 'Recursion, Memoization (DP) & Backtracking (Choose-Explore-Unchoose)',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-11-10'],
    conceptId: 'algo_recursion_backtracking',
    whyUz: "Barcha qism to‘plamlar (`subsets`), joylashuvlar (`permutations`), labirintdan chiqish yo‘li va Sudoku yechimi oddiy `for` sikllariga sig‘maydi! **Backtracking** (*Tanla -> Tekshir -> Bekor qil*) barcha kombinatsiyalarni tizimli tekshiradi; takrorlanuvchi hisoblar esa **Memoization (Top-Down DP)** bilan O(2ⁿ) dan O(n) ga qisqaradi!",
    whyEn: 'Solve combinatoric search problems (subsets, permutations, constraint solving) with Backtracking (Choose-Explore-Unchoose) and eliminate exponential recomputation via Memoization.',
    analogyUz: "**Backtracking** — qorong‘u labirintda ip bog‘lab yurish: chorrahada chap yo‘lni tanlaysiz (**Choose**), ichkariga kirasiz (**Explore**); boshi berk ko‘cha chiqsa izga qaytib ipni yig‘asiz (**Unchoose**) va o‘ng yo‘lni sinaysiz!",
    analogyEn: 'Backtracking tries one branch (Choose), recurses deeper (Explore), and undoes the choice on return (Unchoose) to try the next sibling branch cleanly.',
    stopsUz: "Backtracking da №1 halokatli xato: **`res.append(path)`** deb nusxasiz yozish! Chunki `path` bitta o‘zgaruvchan ro‘yxat — oxirida `path.pop()` bo‘lib hamma javoblar `[]` bo‘lib qoladi! Har doim **`res.append(path.copy())`** yozing! Memoization da esa `@lru_cache` faqat hashable argumentlar oladi.",
    stopsEn: 'The classic backtracking bug is `res.append(path)` instead of `res.append(path.copy())`—mutating and popping `path` empties every stored solution! Always snapshot with `.copy()`.',
    objUz: ['Choose -> Explore -> Unchoose (Backtracking) shabloni bilan `subsets` va `permutations` yozish', '`res.append(path.copy())` snapshot qoidasini qo‘llash', 'Memoization (`memo` dict / `@lru_cache`) bilan O(2ⁿ) rekursiyani O(n) / O(n*W) ga tushirish'],
    objEn: ['Generate subsets and permutations via Choose -> Explore -> Unchoose', 'Snapshot mutable paths with `.copy()` on base cases', 'Speed up overlapping recursive subproblems via Memoization / DP'],
    theoryUz: `### 1. Backtracking Shabloni (Choose - Explore - Unchoose)
\`\`\`python
def backtrack(start, path):
    res.append(path.copy())  # Snapshot!
    for i in range(start, len(nums)):
        path.append(nums[i])     # Choose
        backtrack(i + 1, path)   # Explore
        path.pop()               # Unchoose
\`\`\`
### 2. \`path.copy()\` Majburiyati
\`path\` bitta ro‘yxat bo‘lgani uchun \`res.append(path)\` oxirida \`[[]]\` ga aylanib qoladi!
### 3. Memoization (Top-Down Dynamic Programming)
Takroriy holatlarni \`memo[(i, rem)]\` yoki \`@lru_cache\` da saqlab, har bir noyob holatni faqat 1 marta hisoblash.
### 4. Pruning (Qirqish)
Keraksiz shoxlarga kirmasdan oldin shart bilan (\`if cur_sum > target: continue\`) kesib tashlash dasturni 100x tezlatadi!`,
    theoryEn: `### 1. Choose -> Explore -> Unchoose
Append a choice, recurse, and pop the choice cleanly so sibling branches share zero stale state.
### 2. Always Snapshot (\`path.copy()\`)
Storing bare \`path\` appends references to a list that gets emptied by subsequent \`.pop()\` calls.
### 3. Memoization (DP)
Cache subproblem states (\`memo[state]\`) to collapse exponential trees into polynomial time.
### 4. Pruning
Skip branches violating constraints early before recursing.`,
    examples: [
      ex('Misol 1: Barcha qism to‘plamlar (`subsets`) — `path.copy()` bilan', 'Example 1: Subsets via Backtracking', `def subsets(nums: list[int]) -> list[list[int]]:\n    res: list[list[int]] = []\n    def bt(start: int, path: list[int]) -> None:\n        res.append(path.copy())\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            bt(i + 1, path)\n            path.pop()\n    bt(0, [])\n    return res\n\nprint(subsets([1, 2, 3]))`, `[[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]`, '`path.append` -> `bt` -> `path.pop` + `path.copy()` barcha 8 ta qism to‘plamni to‘g‘ri beradi.', 'Choose-Explore-Unchoose with `path.copy()` produces all `2^n` subsets cleanly.'),
      ex('Misol 2: Memoization bilan Zinalar soni (`climb_stairs`)', 'Example 2: Memoized Step Combinations', `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef climb(n: int) -> int:\n    if n <= 2: return n\n    return climb(n - 1) + climb(n - 2)\n\nprint("ways(10):", climb(10), "| ways(35):", climb(35))`, `ways(10): 89 | ways(35): 14930352`, 'Memoization bo‘lmasa `climb(35)` millionlab marta chaqirilar edi; `@lru_cache` esa uni bir zumda yechdi!', 'Memoization collapses exponential recursion into linear `O(n)` evaluation.'),
      ex('Misol 3: Pruning bilan `combination_sum`', 'Example 3: Backtracking with Pruning', `def combo_sum(cands: list[int], target: int) -> list[list[int]]:\n    cands = sorted(cands)\n    res: list[list[int]] = []\n    def bt(start: int, rem: int, path: list[int]):\n        if rem == 0:\n            res.append(path.copy()); return\n        for i in range(start, len(cands)):\n            if cands[i] > rem: break  # Prune!\n            path.append(cands[i])\n            bt(i, rem - cands[i], path)\n            path.pop()\n    bt(0, target, [])\n    return res\n\nprint(combo_sum([2, 3, 6], 7))`, `[[2, 2, 3]]`, 'Saralash + `if cands[i] > rem: break` keraksiz shoxlarni darhol qirqib tashladi.', 'Sorting enables pruning remaining branches once `cands[i] > rem`.'),
    ],
    traceTitleUz: 'Choose-Explore-Unchoose izi',
    traceTitleEn: 'Tracing Backtrack Snapshot',
    traceCode: `# nums = [1, 2]: [] -> choose 1 -> [1] -> choose 2 -> [1,2] -> pop 2 -> pop 1 -> choose 2 -> [2]`,
    traceSteps: [
      traceStep(1, 'bt(0, [])', 'res=[[]]', 'Bo‘sh snapshot saqlandi', 'Saved []'),
      traceStep(2, 'choose 1 -> choose 2', 'res=[[],[1],[1,2]]', 'Chuqur shoxlar saqlandi', 'Saved [1] and [1,2]'),
      traceStep(3, 'pop 2 -> pop 1 -> choose 2', 'res=[...,[2]]', 'Orqaga qaytib 2 tanlandi', 'Unchose and took [2]', '[[], [1], [1, 2], [2]]'),
    ],
    commonMistakes: [
      mistake('`res.append(path)` deb `.copy()` ni unutish', 'Appending Mutable path Without .copy()', `res = []\npath = [1, 2]\nres.append(path)\npath.pop(); path.pop()\nprint("Broken res:", res)`, 'Broken res: [[]] — solutions wiped out!', `res = []\npath = [1, 2]\nres.append(path.copy())\npath.pop(); path.pop()\nprint("Safe res:", res)`, '`res` faqat `path` ga havola saqlagani uchun `path.pop()` hamma yechimlarni tozalab yuboradi.', 'Mutating `path` after appending without `.copy()` destroys saved results.', 'Doim `res.append(path.copy())` yozing.', 'Always append `path.copy()`.'),
      mistake('Bazaviy holat (`base case`) siz cheksiz rekursiya yozish', 'Missing Base Case in Recursion', `# Recursive calls without stopping condition hit RecursionError at ~1000 frames!`, 'RecursionError: maximum recursion depth exceeded', `print("Verify base case shrinks strictly toward termination!")`, 'Har bir rekursiv chaqiruv bazaviy holatga yaqinlashishi shart.', 'Every recursive step must advance strictly toward a base case.', 'Birinchi qatorga bazaviy shartni (`if rem == 0:` / `if n <= 1:`) yozing.', 'Define termination base cases first.'),
    ],
    compareTitleUz: 'Backtracking vs Memoization (DP)',
    compareTitleEn: 'Backtracking vs Memoization',
    compareUz: ['Backtracking: barcha yechimlarni/kombinatsiyalarni (`subsets`, `N-Queens`, `Sudoku`) topish kerak bo‘lganda.', 'Memoization / DP: eng optimal son qiymat yoki yechimlar sonini (`min cost`, `ways count`) topishda.'],
    compareEn: ['Backtracking: enumerating all valid configurations/paths.', 'Memoization (DP): computing optimal counts/costs across overlapping subproblems.'],
    compareSummaryUz: 'Kombinatsiyalarda `Choose -> Explore -> Unchoose` + `path.copy()`, takroriy hisoblarda esa `@lru_cache`/`memo` + pruning ishlating.',
    compareSummaryEn: 'Pair `Choose -> Explore -> Unchoose` (`path.copy()`) for search with `@lru_cache` / pruning for overlapping subproblems.',
    practiceTasks: [
      pt('p1111_1', '1-mashq: Rekursiv faktorial va base case', 'Task 1: Recursive Factorial', '`fact(0) -> 1`, `fact(5) -> 120` yozing.', 'Write recursive factorial.', `def fact(n): return 1 if n <= 1 else n * fact(n - 1)\nprint(fact(0), fact(5))`, '1 120', 'if n <= 1: return 1', 'Prints 1 120.'),
      pt('p1111_2', '2-mashq: Memoization bilan `fib(20)`', 'Task 2: Memoized Fibonacci', '`memo` lug‘at bilan `fib(20)` -> `6765` hisoblang.', 'Memoize fib with a dict.', `memo = {0: 0, 1: 1}\ndef fib(n):\n    if n not in memo: memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]\nprint(fib(20))`, '6765', 'Store in memo[n]', 'Prints 6765.'),
      pt('p1111_3', '3-mashq: Qism to‘plamlar soni (`subsets`)', 'Task 3: Subsets of [1, 2]', '`[1, 2]` ning barcha 4 ta qism to‘plamini chiqaring.', 'Backtrack subsets of [1, 2].', `res = []\ndef bt(i, p):\n    res.append(p.copy())\n    for j in range(i, 2):\n        p.append([1, 2][j]); bt(j+1, p); p.pop()\nbt(0, [])\nprint(res)`, '[[], [1], [1, 2], [2]]', 'p.copy() snapshot', 'Prints 4 subsets.'),
      pt('p1111_4', '4-mashq: `permutations` Backtracking', 'Task 4: Permutations of [1, 2]', '`[1, 2]` ning barcha joylashuvlarini (`[[1, 2], [2, 1]]`) toping.', 'Generate permutations.', `res, used = [], [False, False]\ndef bt(p):\n    if len(p) == 2: res.append(p.copy()); return\n    for i in range(2):\n        if not used[i]:\n            used[i] = True; p.append(i+1); bt(p); p.pop(); used[i] = False\nbt([])\nprint(res)`, '[[1, 2], [2, 1]]', 'Track used flags', 'Prints permutations.'),
      pt('p1111_5', '5-mashq: `itertools.permutations` bilan solishtirish', 'Task 5: Stdlib Permutations', '`list(itertools.permutations(["A", "B"]))` chiqaring.', 'Use itertools.permutations.', `from itertools import permutations\nprint(list(permutations(["A", "B"])))`, "[('A', 'B'), ('B', 'A')]", 'itertools.permutations', 'Prints tuple list.'),
    ],
    quiz: [
      q('q1111_1', 'Backtracking da `res.append(path)` o‘rniga nima uchun `res.append(path.copy())` yoziladi?', 'Why append `path.copy()` instead of `path` in Backtracking?', ['Tezroq ishlaydi', '`path` keyinchalik `.pop()` bilan bo‘shatilib barcha javoblarni buzib qo‘ymasligi uchun', 'Syntax talabi', 'Tuple qiladi'], ['Faster', 'So future `path.pop()` mutations do not erase stored snapshots', 'Syntax', 'Makes tuple'], 1, 'Mutatsiyadan saqlovchi snapshot uchun.', 'Prevents mutating stored solutions.'),
      q('q1111_2', 'Memoization takrorlanuvchi rekursiv masalalarni qanday tezlatadi?', 'How does Memoization accelerate overlapping recursive problems?', ['Thread ochadi', 'Avval hisoblangan holat natijasini keshda saqlab qayta hisoblamaydi', 'Xotirani o‘chiradi', 'Sikl olib tashlaydi'], ['Spawns threads', 'Caches solved subproblem results to avoid redundant recursion', 'Deletes RAM', 'Removes loops'], 1, 'Hisoblangan ost-masalalarni keshlaydi.', 'Caches subproblem results.'),
      q('q1111_3', 'Backtracking algoritmidagi 3 ta asosiy qadam ketma-ketligi?', 'Core 3-step loop inside a Backtracking function?', ['Sort -> Binary -> Merge', 'Choose -> Explore (recurse) -> Unchoose (pop)', 'Push -> Pop -> Print', 'Lock -> Yield -> Unlock'], ['Sort -> Binary -> Merge', 'Choose -> Explore (recurse) -> Unchoose (pop)', 'Push -> Pop -> Print', 'Lock -> Yield -> Unlock'], 1, 'Choose -> Explore -> Unchoose.', 'Choose -> Explore -> Unchoose.'),
      q('q1111_4', 'n ta elementli to‘plamning jami qism to‘plamlari (`subsets`) soni nechta?', 'Total number of subsets of an n-element set?', ['n^2', 'n!', '2^n', 'n log n'], ['n^2', 'n!', '2^n', 'n log n'], 2, '`2^n`.', '`2^n`.'),
      q('q1111_5', 'Backtracking da imkonsiz shoxlarni erta to‘xtatish texnikasi nima deyiladi?', 'Cutting off invalid branches early during Backtracking is called:', ['Memoizing', 'Pruning (qirqish)', 'Hashing', 'Shadowing'], ['Memoizing', 'Pruning', 'Hashing', 'Shadowing'], 1, 'Pruning (shoxlarni qirqish).', 'Pruning.'),
    ],
    homework: hw('Valid Parentheses Generator (n juft)', 'Generate Balanced Parentheses', 'Backtracking bilan `n = 3` juft qavsdan tuziladigan barcha to‘g‘ri kombinatsiyalarni (`open < n`, `close < open` shartlari bilan) generatsiya qiluvchi `gen_parens(n)` funksiyasini yozing.', 'Use backtracking (`open_cnt < n`, `close_cnt < open_cnt`) to generate all valid combinations of `n` pairs of parentheses.', ['choose -> recurse -> unchoose', 'n=3 uchun aniq 5 ta javobni assert qilish'], ['Choose-Explore-Unchoose', 'Assert 5 combinations for n=3'], 'Track open_cnt and close_cnt integers cleanly.', 'Prune invalid closings early.', 'N-Queens (4x4) taxtasini ham urinib ko‘ring.', 'Try 4-Queens solver.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-11-12',
    courseId: 'algorithms',
    moduleId: 'c11_m4',
    order: 12,
    titleUz: 'Algorithmic Problem Solving (Two Pointers, Sliding Window, Hash Maps) va Review #25',
    titleEn: 'Problem-Solving Patterns: Two Pointers, Sliding Window & Hash Maps (+ Review #25)',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-11-11'],
    conceptId: 'algo_patterns_capstone',
    whyUz: "Texnik suhbat va real optimizatsiya masalalarining 80% i atigi 3 ta naqshga tayanadi: **Two Pointers** (tartiblangan massivda O(n)), **Sliding Window** (ketma-ket qism-massiv/satrda O(n)) va **Hash Map / Prefix Sum**! Endi har qanday O(n²) masalani ko‘rganda qaysi qurolni chiqarishni darhol taniysiz.",
    whyEn: 'Master the three highest-leverage interview and optimization patterns—Two Pointers, Sliding Window, and Hash Maps / Prefix Sums—turning O(n^2) scans into clean O(n) passes.',
    analogyUz: "**Two Pointers** — ikki uchidan bir-biriga qarab yuruvchi ikki qidiruvchi. **Sliding Window** — poyezd oynasini rels bo‘ylab bir vagon oldinga siljitish: hamma yo‘lovchini boshidan sanash o‘rniga faqat kirgan +1 ni qo‘shib, chiqqan -1 ni ayirasiz!",
    analogyEn: 'Sliding Window slides a frame along the sequence in O(1) per step—adding the incoming right item and subtracting the outgoing left item instead of recomputing the whole window.',
    stopsUz: "Qaysi naqshni tanlash shpalgalgasi: 1) Tartiblangan ro‘yxatda juftlik/uchlik izlash -> **Two Pointers**. 2) **Ketma-ket (contiguous)** qism-massiv/qism-satrda eng uzun/eng katta yig‘indi -> **Sliding Window**. 3) Tartibsiz massivda tezkor juftlik / chastota / subarray sum -> **Hash Map (`dict`/`Counter`)**!",
    stopsEn: 'Pattern selector: Sorted pairs/palindromes -> Two Pointers; Contiguous subarray/substring max or min -> Sliding Window; Unsorted pairs, grouping, or prefix-sum counts -> Hash Map.',
    objUz: ['Two Pointers (`left`, `right`) bilan tartiblangan massivda O(n) / O(1) space juftlik topish', 'Fixed va Variable Sliding Window bilan O(n) substring/subarray yechish', 'Prefix Sum + Hash Map (`dict`) bilan `subarray sum == k` ni O(n) da yechish'],
    objEn: ['Apply opposite-direction Two Pointers in O(n) time and O(1) space', 'Code fixed and variable-length Sliding Windows', 'Count subarrays summing to `k` in O(n) with Prefix Sums + Hash Map'],
    theoryUz: `### 1. Two Pointers (O(n) Time, O(1) Space)
Tartiblangan ro‘yxatda \`l = 0, r = len - 1\`: yig‘indi kichik bo‘lsa \`l += 1\`, katta bo‘lsa \`r -= 1\`.
### 2. Sliding Window (Ketma-ket Qism-Massiv/Satr)
- **Fixed size \`k\`**: har qadamda \`win += nums[r] - nums[r - k]\`.
- **Variable size**: \`r\` o‘ngga kengayadi; shart buzilganda \`l\` chapdan qisqartiriladi!
### 3. Prefix Sum + Hash Map
\`prefix - k in counts\` tekshiruvi bilan manfiy sonlar bor massivda ham aniq yig‘indisi \`k\` bo‘lgan qism-massivlar sonini **O(n)** da topadi!`,
    theoryEn: `### 1. Two Pointers
Advance \`l\` or retreat \`r\` deterministically on sorted sequences or palindromes in O(1) space.
### 2. Sliding Window (Fixed & Dynamic)
Maintain window state incrementally as \`r\` expands and \`l\` contracts—each index enters/leaves once -> O(n).
### 3. Prefix Sum + Hash Map
Record seen prefix sum frequencies (\`{0: 1}\`) to solve arbitrary subarray-sum targets in O(n), even with negative numbers.`,
    examples: [
      ex('Misol 1: Variable Sliding Window — Takrorsiz Eng Uzun Substring', 'Example 1: Longest Substring Without Repeating Chars', `def longest_unique(s: str) -> int:\n    last_seen: dict[str, int] = {}\n    left = best = 0\n    for right, ch in enumerate(s):\n        if ch in last_seen and last_seen[ch] >= left:\n            left = last_seen[ch] + 1\n        last_seen[ch] = right\n        best = max(best, right - left + 1)\n    return best\n\nprint(longest_unique("abcabcbb"), longest_unique("pwwkew"))`, `3 3`, 'Oyna chap chegarasi `left` har takrorda O(1) da sakrab o‘tadi -> jami O(n)!', '`left` jumps directly past the previous duplicate index inside the current window in O(n).'),
      ex('Misol 2: Two Pointers — Tartiblangan Two-Sum O(1) Xotirada', 'Example 2: Sorted Two-Sum with Two Pointers', `def sorted_two_sum(nums: list[int], target: int) -> tuple[int, int] | None:\n    l, r = 0, len(nums) - 1\n    while l < r:\n        s = nums[l] + nums[r]\n        if s == target: return (l, r)\n        if s < target: l += 1\n        else: r -= 1\n    return None\n\nprint(sorted_two_sum([2, 7, 11, 15], 9))`, `(0, 1)`, 'Set/Dict ochmasdan atigi 2 ta ko‘rsatkich bilan O(n) da topildi!', 'Finds the target pair in O(n) time and O(1) space without a hash map.'),
      ex('Misol 3: Prefix Sum + Hash Map (`subarray sum == k`)', 'Example 3: Subarray Sum Equals K (O(n))', `def count_subarrays(nums: list[int], k: int) -> int:\n    counts = {0: 1}\n    prefix = ans = 0\n    for x in nums:\n        prefix += x\n        ans += counts.get(prefix - k, 0)\n        counts[prefix] = counts.get(prefix, 0) + 1\n    return ans\n\nprint(count_subarrays([1, 1, 1], 2), count_subarrays([1, -1, 2, 1], 3))`, `2 2`, '`{0: 1}` boshlang‘ich yozuvi massiv boshidan boshlanuvchi yig‘indilarni ham sanaydi.', 'Initializing `{0: 1}` catches subarrays starting at index 0, even with negative numbers.'),
    ],
    traceTitleUz: 'Sliding Window oynasi izi',
    traceTitleEn: 'Tracing Fixed Sliding Window',
    traceCode: `nums, k = [2, 1, 5, 1, 3], 3\nwin = sum(nums[:k])\n# step r=3: win = 8 - 2 + 1 = 7`,
    traceSteps: [
      traceStep(1, 'sum(nums[:3])', 'win=8', 'Boshlang‘ich oyna [2,1,5]', 'Initial window [2,1,5]'),
      traceStep(2, 'slide to [1,5,1]', '8 - 2 + 1 = 7', 'Chap 2 chiqdi, o‘ng 1 kirdi', 'Removed 2, added 1'),
      traceStep(3, 'slide to [5,1,3]', '7 - 1 + 3 = 9', 'Eng katta summa = 9', 'Max window sum = 9', '9'),
    ],
    commonMistakes: [
      mistake('Manfiy sonli massivda `subarray sum == k` uchun Sliding Window ishlatish', 'Using Sliding Window on Arrays with Negatives', `# Shrinking left doesn't monotonically reduce sum when negative numbers exist!`, 'Misses valid subarrays containing negative values', `print("Use Prefix Sum + Hash Map when negative integers are allowed!")`, 'Sliding Window qisqarganda yig‘indi faqat musbat sonlarda kamayadi!', 'Variable Sliding Window relies on monotonicity that negative values break.', 'Manfiylar bo‘lsa Prefix Sum + Hash Map ishlating.', 'Use Prefix Sum + dict when negatives exist.'),
      mistake('Prefix Sum xaritasini `{0: 1}` bilan boshlamaslik', 'Forgetting {0: 1} in Prefix Sum Map', `# Without {0: 1}, a subarray starting at index 0 whose sum == k is missed!`, 'Under-counts by 1', `print("Always initialize prefix_counts = {0: 1}!")`, 'Boshidan `i`-indeksgacha yig‘indi `k` ga teng bo‘lsa `prefix - k = 0` bo‘ladi.', 'A prefix equaling `k` looks up `prefix - k == 0`.', '`counts = {0: 1}` yozing.', 'Start with `{0: 1}`.'),
    ],
    compareTitleUz: 'Two Pointers vs Sliding Window vs Hash Map',
    compareTitleEn: 'Choosing Among the Big 3 Patterns',
    compareUz: ['Two Pointers: tartiblangan massiv, palindrom, in-place siqish (O(1) xotira).', 'Sliding Window: uzluksiz (contiguous) qism-massiv/satr (musbat/uzunlik shartlari).', 'Hash Map + Prefix Sum: tartibsiz juftliklar, guruhlash, manfiyli subarray summalar.'],
    compareEn: ['Two Pointers: sorted arrays, palindromes, O(1) space.', 'Sliding Window: contiguous substring/subarray optimization.', 'Hash Map / Prefix Sum: unsorted lookups, grouping, arbitrary subarray sums.'],
    compareSummaryUz: 'Har bir masalada naqshni tanlang: Tartib -> Two Pointers, Ketma-ket oyna -> Sliding Window, Tez qidiruv/Prefix -> Hash Map.',
    compareSummaryEn: 'Recognize the pattern before coding: Two Pointers (sorted), Sliding Window (contiguous), Hash Map + Prefix Sum (unsorted/negatives).',
    practiceTasks: [
      pt('p1112_1', '1-mashq: Fixed Sliding Window max sum', 'Task 1: Max Sum of Size K', '`[1, 4, 2, 10, 2]` dan `k=3` uzunlikdagi eng katta qo‘shni yig‘indini toping.', 'Max subarray of size 3.', `xs, k = [1, 4, 2, 10, 2], 3\nw = best = sum(xs[:k])\nfor i in range(k, len(xs)): w += xs[i] - xs[i-k]; best = max(best, w)\nprint(best)`, '16', 'w += xs[i] - xs[i-k]', 'Prints 16.'),
      pt('p1112_2', '2-mashq: Two Pointers Palindrom', 'Task 2: Two-Pointer Palindrome', '`"racecar"` ni Two Pointers bilan tekshiring.', 'Check palindrome via l, r.', `s = "racecar"\nl, r, ok = 0, len(s)-1, True\nwhile l < r:\n    if s[l] != s[r]: ok = False; break\n    l += 1; r -= 1\nprint(ok)`, 'True', 'l += 1; r -= 1', 'Prints True.'),
      pt('p1112_3', '3-mashq: Variable Sliding Window (min len >= target)', 'Task 3: Min Subarray >= Target', '`[2, 3, 1, 2, 4, 3]` da yig‘indisi `>= 7` eng qisqa uzunlikni toping (`2`).', 'Smallest contiguous subarray >= 7.', `xs, t = [2, 3, 1, 2, 4, 3], 7\nl = s = 0; best = len(xs) + 1\nfor r, x in enumerate(xs):\n    s += x\n    while s >= t: best = min(best, r - l + 1); s -= xs[l]; l += 1\nprint(best)`, '2', 'Shrink left while s >= t', 'Prints 2.'),
      pt('p1112_4', '4-mashq: Hash Map Anagram Guruhlash', 'Task 4: Group Anagrams', '`["eat", "tea", "tan"]` ni anagram guruhlariga ajrating.', 'Group by sorted tuple key.', `from collections import defaultdict\ng = defaultdict(list)\nfor w in ["eat", "tea", "tan"]: g["".join(sorted(w))].append(w)\nprint(sorted(g.values()))`, "[['eat', 'tea'], ['tan']]", 'Key = "".join(sorted(w))', 'Prints grouped anagrams.'),
      pt('p1112_5', '5-mashq: Prefix Sum diapazoni', 'Task 5: Prefix Sum Range Query', '`[3, 1, 4, 2]` uchun `[1..3]` indeks yig‘indisini prefix bilan O(1) da oling.', 'Query subarray sum with prefix.', `xs = [3, 1, 4, 2]\np = [0]\nfor x in xs: p.append(p[-1] + x)\nprint(p[4] - p[1])`, '7', 'p[r+1] - p[l]', 'Prints 7.'),
    ],
    quiz: [
      q('q1112_1', 'Ketma-ket `k` uzunlikdagi eng katta qism-massiv yig‘indisini O(n) da topuvchi usul?', 'Pattern solving fixed-size contiguous subarray sums in O(n)?', ['Backtracking', 'Sliding Window', 'Bubble Sort', 'BST'], ['Backtracking', 'Sliding Window', 'Bubble Sort', 'BST'], 1, 'Sliding Window.', 'Sliding Window.'),
      q('q1112_2', 'Manfiy sonlar bo‘lgan massivda yig‘indisi `k` ga teng qism-massivlar sonini O(n) da topish uchun nima ishlatiladi?', 'O(n) pattern for counting `subarray sum == k` when negative numbers are present?', ['Variable Sliding Window', 'Prefix Sum + Hash Map (`{0: 1}`)', 'Two Pointers', 'Binary Search'], ['Variable Sliding Window', 'Prefix Sum + Hash Map (`{0: 1}`)', 'Two Pointers', 'Binary Search'], 1, 'Prefix Sum + Hash Map.', 'Prefix Sum + Hash Map.'),
      q('q1112_3', 'Two Pointers texnikasining Space Complexity si odatda nechaga teng?', 'Typical auxiliary Space Complexity of Two Pointers?', ['O(n)', 'O(1)', 'O(n^2)', 'O(log n)'], ['O(n)', 'O(1)', 'O(n^2)', 'O(log n)'], 1, '`O(1)`.', '`O(1)`.'),
      q('q1112_4', 'Prefix Sum lug‘ati nima uchun `{0: 1}` bilan boshlanadi?', 'Why initialize the Prefix Sum frequency map with `{0: 1}`?', ['Shunchaki bezak', '0-indeksdan boshlanib yig‘indisi `k` ga teng bo‘lgan qism-massivni sanash uchun', 'Overflow dan saqlash', 'Sortlash'], ['Cosmetic', 'Accounts for subarrays starting at index 0 where `prefix == k`', 'Overflow', 'Sort'], 1, '0-indeksdan boshlangan subarray larni hisoblash uchun.', 'Matches `prefix - k == 0`.'),
      q('q1112_5', '`["eat", "tea", "ate"]` anagramlarni Hash Map da birlashtirish uchun eng qulay O(k log k) kalit?', 'Best hashable key to group anagram words in a `defaultdict(list)`?', ['len(w)', 'tuple(sorted(w)) yoki "".join(sorted(w))', 'w[0]', 'set(w)'], ['len(w)', 'tuple(sorted(w)) or "".join(sorted(w))', 'w[0]', 'set(w)'], 1, '`"".join(sorted(w))`.', '`"".join(sorted(w))`.'),
    ],
    homework: hw('Kurs 11 Yakuniy Algoritmlar To‘plami', 'Course 11 Algorithmic Toolkit', 'Sliding Window (`longest_k_distinct`), Prefix Sum (`count_subarrays`), va Two Pointers (`three_sum_sorted`) funksiyalarini yozib, 10 ta edge-case `assert` testidan o‘tkazing.', 'Implement `longest_k_distinct`, `count_subarrays`, and `three_sum_sorted`, verifying all three across 10 edge-case assertions.', ['O(n) / O(n^2) optimal yechimlar', '10 ta assert edge-case testi'], ['Optimal complexities', '10 assertions'], 'Sort array first for 3Sum, skip duplicate anchors, run Two Pointers.', 'Combine patterns.', 'Kurs 12 (Database & SQL) ga o‘tishga tayyorlaning.', 'Prepare for Databases & SQL.', 35),
    reviewCheckpoint: review(
      25,
      'Review Loyiha #25: Kurs 11 (Algoritmlar) Bitiruv Marrasi (125-dars!)',
      'Review Project #25: Course 11 Algorithms Capstone (125th Lesson!)',
      '125-dars marrasi va 2-bosqich (Intermediate) yakuni! Two Pointers, Sliding Window, Prefix Sum va BFS/BST bilimlarini bitta tizimda sinab, `assert` testlar bilan tasdiqlang.',
      '125-lesson milestone & Stage 2 completion! Combine Sliding Window, Prefix Sum + Hash Map, and Two Pointers into a verified algorithmic suite.',
      ['`longest_unique_substring` (Sliding Window O(n))', '`subarray_sum_k` (Prefix Sum + Hash Map O(n))', '`sorted_two_sum` (Two Pointers O(1) space)'],
      ['O(n) Sliding Window longest unique substring', 'O(n) Prefix Sum + Hash Map', 'O(1)-space Two Pointers pair search'],
      `def longest_unique(s: str) -> int:
    seen, l, best = {}, 0, 0
    for r, ch in enumerate(s):
        if ch in seen and seen[ch] >= l:
            l = seen[ch] + 1
        seen[ch] = r
        best = max(best, r - l + 1)
    return best

def subarray_sum(nums: list[int], k: int) -> int:
    cnt, pref, ans = {0: 1}, 0, 0
    for x in nums:
        pref += x
        ans += cnt.get(pref - k, 0)
        cnt[pref] = cnt.get(pref, 0) + 1
    return ans

assert longest_unique("abcabcbb") == 3
assert subarray_sum([1, -1, 5, -2, 3], 3) == 3
print("Stage 2 Complete! Verified Sliding Window & Prefix Sum.")
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),
];
