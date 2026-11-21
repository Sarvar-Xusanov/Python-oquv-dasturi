import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C12_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-12-06',
    courseId: 'databases',
    moduleId: 'c12_m3',
    order: 6,
    titleUz: 'JOIN turlari — INNER JOIN, LEFT JOIN va Self-Join',
    titleEn: 'SQL Joins: INNER JOIN, LEFT JOIN & Self-Joins',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-12-05'],
    conceptId: 'db_joins',
    whyUz: "Real ilovada foydalanuvchilar `users` jadvalida, ularning buyurtmalari esa `orders` jadvalida saqlanadi. Bularni Python ichida ikki marta `SELECT` qilib `for` siklida qo‘shish (**N+1 muammosi!**) serverni qotiradi — SQL **`JOIN`** esa jadvallarni bazaning o‘zida millisekundlarda birlashtirib beradi!",
    whyEn: 'Combine normalized tables inside SQL using `INNER JOIN`, `LEFT JOIN` (preserving unmatched rows), and Self-Joins—eliminating N+1 query bottlenecks.',
    analogyUz: "**INNER JOIN** — ikkala ro‘yxatda ham bor bo‘lgan juftliklarni (masalan \"kamida 1 ta buyurtma qilgan mijozlar\") chiqaradi. **LEFT JOIN** — esa chap ro‘yxatdagi **hamma** mijozlarni saqlaydi, buyurtmasi yo‘qlariga esa `NULL` yozib qo‘yadi!",
    analogyEn: '`INNER JOIN` returns only matched pairs; `LEFT JOIN` keeps every row from the left table and fills unmatched right columns with `NULL`.',
    stopsUz: "Juda xavfli tuzoq: **`LEFT JOIN` qilingan o‘ng jadval ustunini `WHERE r.status = 'paid'` deb filtrlasangiz, u yashirincha `INNER JOIN` ga aylanib qoladi** (chunki `NULL = 'paid'` False bo‘lib hamma NULL qatorlar uchib ketadi)! O‘ng jadval shartini `LEFT JOIN ... ON ... AND r.status = 'paid'` ga qo‘ying!",
    stopsEn: 'Putting a right-table filter inside `WHERE` turns a `LEFT JOIN` into an `INNER JOIN` because `NULL` rows fail the condition—move right-table conditions into the `ON` clause.',
    objUz: ['`INNER JOIN` vs `LEFT JOIN` farqini bilish va `LEFT JOIN ... WHERE r.id IS NULL` bilan mos kelmaganlarni topish', '`ON` sharti vs `WHERE` sharti `LEFT JOIN` da qanday ishlashini tushunish', 'Self-Join (masalan `employees.manager_id -> employees.id`) va N+1 muammosini yechish'],
    objEn: ['Use `INNER JOIN` and `LEFT JOIN` cleanly', 'Keep right-side filters in `ON` when preserving left rows', 'Write Self-Joins and avoid N+1 query loops'],
    theoryUz: `### 1. \`INNER JOIN\`
Faqat \`ON a.id = b.user_id\` shartiga mos kelgan qatorlarni qaytaradi.
### 2. \`LEFT JOIN\` (va "hech qachon ... qilmaganlarni topish")
Chap jadvalning **barcha** qatorlari saqlanadi; o‘ng tomonda moslik bo‘lmasa \`NULL\` chiqadi! \`WHERE o.id IS NULL\` qo‘shib "hali buyurtma qilmagan mijozlar" ni topish mumkin.
### 3. \`LEFT JOIN\` da \`ON\` vs \`WHERE\` Tuzog‘i
\`WHERE o.status = 'paid'\` -> \`NULL\` larni o‘chirib yuboradi! To‘g‘ri usul: \`LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid'\`.
### 4. Self-Join va N+1 Muammosi
Bitta jadvalni o‘ziga alias bilan ulash (\`FROM emp e LEFT JOIN emp m ON e.manager_id = m.id\`). N+1 (1 ta query + N ta loop query) o‘rniga 1 ta \`JOIN\` ishlating!`,
    theoryEn: `### 1. \`INNER JOIN\`
Returns rows matching both tables’ join predicate.
### 2. \`LEFT JOIN\` & Anti-Join Pattern
Preserves every left row with \`NULL\` padding on misses; filter \`WHERE right.id IS NULL\` to find unmatched left rows.
### 3. Filter Placement in \`LEFT JOIN\`
Put optional right-table predicates in \`ON\` rather than \`WHERE\` to preserve unmatched left rows.
### 4. Self-Joins & N+1 Prevention
Alias one table twice (\`e\` and \`m\`) for hierarchies; replace loop queries (N+1) with single \`JOIN\`s.`,
    examples: [
      ex('Misol 1: `INNER JOIN` vs `LEFT JOIN` + `COALESCE`', 'Example 1: INNER vs LEFT JOIN Totals', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE users (id INT PRIMARY KEY, name TEXT)")\nc.execute("CREATE TABLE orders (id INT PRIMARY KEY, user_id INT, amt INT)")\nc.executemany("INSERT INTO users VALUES (?, ?)", [(1, "Ali"), (2, "Vali"), (3, "Guli")])\nc.executemany("INSERT INTO orders VALUES (?, ?, ?)", [(10, 1, 50), (11, 1, 30), (12, 2, 40)])\n\nres = c.execute("""\n    SELECT u.name, COUNT(o.id) AS orders_cnt, COALESCE(SUM(o.amt), 0) AS total\n    FROM users u\n    LEFT JOIN orders o ON o.user_id = u.id\n    GROUP BY u.id, u.name\n    ORDER BY u.id\n""").fetchall()\nprint(res)`, `[('Ali', 2, 80), ('Vali', 1, 40), ('Guli', 0, 0)]`, '`LEFT JOIN` tufayli 0 ta buyurtmali Guli ham yo‘qolib ketmadi (`COUNT(o.id) = 0`)!', '`LEFT JOIN` preserves Guli with `COUNT(o.id) = 0` and `COALESCE` avoids `NULL` sum.'),
      ex('Misol 2: Anti-Join (`WHERE o.id IS NULL`) — Buyurtmasiz foydalanuvchilar', 'Example 2: Finding Unmatched Rows via LEFT JOIN', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (id INT, name TEXT)")\nc.execute("CREATE TABLE o (id INT, uid INT)")\nc.executemany("INSERT INTO u VALUES (?, ?)", [(1, "Ali"), (2, "Guli")])\nc.execute("INSERT INTO o VALUES (10, 1)")\nprint(c.execute("SELECT u.name FROM u LEFT JOIN o ON o.uid = u.id WHERE o.id IS NULL").fetchall())`, `[('Guli',)]`, '`LEFT JOIN` + `WHERE o.id IS NULL` mosligi yo‘q qatorlarni bir zumda ajratadi.', '`LEFT JOIN ... WHERE right.id IS NULL` finds rows lacking any child record.'),
      ex('Misol 3: Self-Join — Xodim va uning Menejerini chiqarish', 'Example 3: Employee-Manager Self-Join', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE emp (id INT, name TEXT, mgr_id INT)")\nc.executemany("INSERT INTO emp VALUES (?, ?, ?)", [(1, "Aziz (CEO)", None), (2, "Dilnoza", 1)])\nprint(c.execute("SELECT e.name, COALESCE(m.name, 'TOP') FROM emp e LEFT JOIN emp m ON e.mgr_id = m.id ORDER BY e.id").fetchall())`, `[('Aziz (CEO)', 'TOP'), ('Dilnoza', 'Aziz (CEO)')]`, 'Ikki xil alias (`e` va `m`) yordamida jadval o‘ziga muvaffaqiyatli bog‘landi.', 'Aliasing the same table as `e` and `m` resolves parent-child trees in one query.'),
    ],
    traceTitleUz: 'LEFT JOIN va GROUP BY izi',
    traceTitleEn: 'Tracing LEFT JOIN Matching',
    traceCode: `SELECT u.name, o.amt FROM users u LEFT JOIN orders o ON o.uid = u.id`,
    traceSteps: [
      traceStep(1, 'Ali (id=1)', 'matches 10, 11', '2 ta qator hosil bo‘ldi', 'Matched 2 orders'),
      traceStep(2, 'Guli (id=3)', 'no match -> NULL', 'LEFT JOIN Guli ni NULL bilan saqladi', 'Kept Guli with NULL'),
    ],
    commonMistakes: [
      mistake('`LEFT JOIN` dan keyin o‘ng jadvalga `WHERE o.status = \'paid\'` qo‘yish', 'Filtering Right Table in WHERE After LEFT JOIN', `# WHERE o.status = 'paid' discards NULL rows from Guli, silently converting LEFT JOIN into INNER JOIN!`, 'Drops unmatched left rows unexpectedly', `print("Move optional right filters into: LEFT JOIN orders o ON o.uid = u.id AND o.status = 'paid'!")`, '`NULL = \'paid\'` True bo‘lmagani uchun chap jadvaldagi bo‘sh qatorlar yo‘qoladi.', '`WHERE` drops unmatched `NULL` rows after joining.', 'Shartni `ON ... AND ...` ga ko‘chiring.', 'Place right-side filters in the `ON` clause.'),
      mistake('`COUNT(*)` ni `LEFT JOIN` da ishlatib 0 o‘rniga 1 olish', 'Using COUNT(*) Instead of COUNT(right.id) in LEFT JOIN', `# LEFT JOIN produces 1 NULL-padded row for Guli, so COUNT(*) returns 1 instead of 0!`, 'Off-by-one counts (1 instead of 0)', `print("Always count a right-table non-null column: COUNT(o.id)!")`, 'Guli uchun 1 ta NULL qator bo‘lgani uchun `COUNT(*)` 1 sanaydi, `COUNT(o.id)` esa `0`!', '`COUNT(*)` counts NULL-padded rows; `COUNT(o.id)` ignores `NULL`s.', '`COUNT(o.id)` yozing.', 'Count `right.id` instead of `*`.'),
    ],
    compareTitleUz: '`INNER JOIN` vs `LEFT JOIN`',
    compareTitleEn: '`INNER JOIN` vs `LEFT JOIN`',
    compareUz: ['`INNER JOIN`: faqat ikkala jadvalda ham bog‘liq yozuvi bor qatorlar.', '`LEFT JOIN`: chap jadvaldagi barcha qatorlar + bor joyda o‘ng ma’lumot (yo‘q joyda `NULL`).'],
    compareEn: ['`INNER JOIN`: strictly intersecting pairs.', '`LEFT JOIN`: all left rows, `NULL`-padded when unmatched.'],
    compareSummaryUz: 'Jadvallarni birlashtirishda N+1 sikllardan voz kechib `JOIN` yozing; `LEFT JOIN` da esa `COUNT(right.id)` va `ON ... AND` qoidasini saqlang.',
    compareSummaryEn: 'Replace N+1 loops with `JOIN`s, use `COUNT(right.id)` in `LEFT JOIN` aggregations, and place optional right filters inside `ON`.',
    practiceTasks: [
      pt('p1206_1', '1-mashq: Oddiy `INNER JOIN`', 'Task 1: Basic INNER JOIN', '`users(id, name)` va `posts(uid, title)` ni birlashtirib chiqaring.', 'Inner join users & posts.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (id INT, name TEXT)")\nc.execute("CREATE TABLE p (uid INT, title TEXT)")\nc.execute("INSERT INTO u VALUES (1, 'Ali'), (2, 'Bob')")\nc.execute("INSERT INTO p VALUES (1, 'SQL')")\nprint(c.execute("SELECT u.name, p.title FROM u INNER JOIN p ON p.uid = u.id").fetchall())`, "[('Ali', 'SQL')]", 'INNER JOIN p ON p.uid = u.id', "Prints [('Ali', 'SQL')]."),
      pt('p1206_2', '2-mashq: `LEFT JOIN` + `COUNT(p.id)`', 'Task 2: LEFT JOIN Post Counts', 'Posti yo‘q `Bob` uchun ham `0` chiqaring.', 'Count posts per user.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (id INT, name TEXT)"); c.execute("CREATE TABLE p (id INT, uid INT)")\nc.executemany("INSERT INTO u VALUES (?, ?)", [(1, "Ali"), (2, "Bob")])\nc.execute("INSERT INTO p VALUES (10, 1)")\nprint(c.execute("SELECT u.name, COUNT(p.id) FROM u LEFT JOIN p ON p.uid=u.id GROUP BY u.id, u.name ORDER BY u.id").fetchall())`, "[('Ali', 1), ('Bob', 0)]", 'COUNT(p.id)', "Prints [('Ali', 1), ('Bob', 0)]."),
      pt('p1206_3', '3-mashq: Anti-Join (`IS NULL`)', 'Task 3: Unmatched Users', 'Hech qanday posti yo‘q foydalanuvchini toping.', 'Filter WHERE p.id IS NULL.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (id INT, name TEXT)"); c.execute("CREATE TABLE p (id INT, uid INT)")\nc.executemany("INSERT INTO u VALUES (?, ?)", [(1, "Ali"), (2, "Bob")])\nc.execute("INSERT INTO p VALUES (10, 1)")\nprint(c.execute("SELECT u.name FROM u LEFT JOIN p ON p.uid=u.id WHERE p.id IS NULL").fetchall())`, "[('Bob',)]", 'WHERE p.id IS NULL', "Prints [('Bob',)]."),
      pt('p1206_4', '4-mashq: Self-Join', 'Task 4: Category Parent Self-Join', '`(id, name, parent_id)` jadvalidan kategoriya va ota nomini chiqaring.', 'Self-join categories.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE cat (id INT, name TEXT, pid INT)")\nc.executemany("INSERT INTO cat VALUES (?, ?, ?)", [(1, "Dev", None), (2, "Python", 1)])\nprint(c.execute("SELECT c1.name, c2.name FROM cat c1 JOIN cat c2 ON c1.pid = c2.id").fetchall())`, "[('Python', 'Dev')]", 'JOIN cat c2 ON c1.pid = c2.id', "Prints [('Python', 'Dev')]."),
      pt('p1206_5', '5-mashq: 3 ta jadval `JOIN`', 'Task 5: Three-Table Join', '`students` -> `enrollments` -> `courses` zanjirini birlashtiring.', 'Join 3 tables.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE s (id INT, n TEXT)"); c.execute("CREATE TABLE e (sid INT, cid INT)"); c.execute("CREATE TABLE cr (id INT, t TEXT)")\nc.execute("INSERT INTO s VALUES (1, 'Ali')"); c.execute("INSERT INTO cr VALUES (9, 'OOP')"); c.execute("INSERT INTO e VALUES (1, 9)")\nprint(c.execute("SELECT s.n, cr.t FROM s JOIN e ON e.sid=s.id JOIN cr ON cr.id=e.cid").fetchall())`, "[('Ali', 'OOP')]", 'Chain two JOINs', "Prints [('Ali', 'OOP')]."),
    ],
    quiz: [
      q('q1206_1', 'Chap jadvalning barcha qatorlarini (mos kelmaganlarni `NULL` bilan) saqlab qoluvchi JOIN?', 'Which JOIN keeps all rows from the left table with `NULL` on right misses?', ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'NATURAL DELETE'], ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'NATURAL DELETE'], 1, '`LEFT JOIN`.', '`LEFT JOIN`.'),
      q('q1206_2', '`LEFT JOIN` da o‘ng jadvalda yozuvi yo‘q chap qatorlar sonini hisoblashda nega `COUNT(r.id)` yoziladi (`COUNT(*)` emas)?', 'Why write `COUNT(r.id)` instead of `COUNT(*)` after a `LEFT JOIN`?', ['Tezroq', '`COUNT(*)` NULL qatorni ham 1 deb sanab yuboradi, `COUNT(r.id)` esa 0 beradi', 'Syntax xato', 'Hash uchun'], ['Faster', '`COUNT(*)` counts NULL-padded rows as 1, while `COUNT(r.id)` returns 0', 'Syntax error', 'Hashing'], 1, '`COUNT(r.id)` NULL ni sanamaydi.', '`COUNT(r.id)` skips `NULL`s.'),
      q('q1206_3', '`LEFT JOIN` da o‘ng jadvalga tegishli shart `WHERE r.active = 1` ga yozilsa nima bo‘ladi?', 'Effect of putting `r.active = 1` in `WHERE` on a `LEFT JOIN`?', ['Hech narsa', 'NULL qatorlar tushib qolib amalda `INNER JOIN` ga aylanadi', 'Tezlashadi', 'Xato beradi'], ['Nothing', 'Silently degrades the `LEFT JOIN` into an `INNER JOIN`', 'Faster', 'SyntaxError'], 1, '`INNER JOIN` ga aylanib qoladi.', 'Turns into `INNER JOIN`.'),
      q('q1206_4', '"N+1 query muammosi" nimani anglatadi?', 'What is the "N+1 query problem"?', ['1 ta jadvalga N ta ustun', '1 ta asosiy ro‘yxat so‘rovidan keyin sikl ichida N marta qo‘shimcha SQL yuborish', 'Index qo‘shish', 'Migration xatosi'], ['N columns', 'Fetching a list then firing N extra per-row queries inside a loop', 'Indexing', 'Migrations'], 1, 'Sikl ichida N ta qo‘shimcha query yuborish.', 'Looping extra queries instead of JOINing.'),
      q('q1206_5', 'Biror jadvalning ichidagi `manager_id` ni shu jadvalning `id` siga ulash usuli?', 'Joining a table’s `manager_id` back to its own `id` is called:', ['Cross Join', 'Self-Join (ikkita alias bilan)', 'Full Outer', 'Union'], ['Cross Join', 'Self-Join using aliases', 'Full Outer', 'Union'], 1, 'Self-Join.', 'Self-Join.'),
    ],
    homework: hw('LMS Kurslar va Talabalar Hisoboti', 'Three-Table LMS Join Reporter', '`students`, `courses` va `enrollments` (Many-to-Many) jadvallarini tuzib, `LEFT JOIN` + `GROUP BY` bilan har bir talabaning yozilgan kurslari soni va umumiy to‘lovini (kursga yozilmagan talabani `0` bilan!) chiqaring.', 'Create `students`, `courses`, and `enrollments` tables and write a multi-table `LEFT JOIN` query reporting course counts (`COUNT(e.course_id)`) and total tuition (`COALESCE(..., 0)`) per student.', ['3 ta jadval + Many-to-Many', '0 ta kursli talaba ham 0 bilan chiqishi'], ['3 tables (M:N)', 'Preserve 0-enrollment students'], 'FROM students s LEFT JOIN enrollments e ON ... LEFT JOIN courses c ON ...', 'Chain LEFT JOINs cleanly.', 'Hali hech kim yozilmagan kurslarni topuvchi Anti-Join ham yozing.', 'Add anti-join for empty courses.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-12-07',
    courseId: 'databases',
    moduleId: 'c12_m3',
    order: 7,
    titleUz: 'Primary Key, Foreign Key va Normalization (1NF–3NF)',
    titleEn: 'Keys, Foreign Key Cascades & Database Normalization (1NF–3NF)',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-12-06'],
    conceptId: 'db_keys_normalization',
    whyUz: "Agar buyurtmalar jadvalida foydalanuvchining ismi va telefonini har safar nusxalab saqlasangiz, foydalanuvchi telefonini o‘zgartirganda 500 ta eski buyurtma eskirib qoladi (Update Anomaly)! **Foreign Keys** va **Normalizatsiya (1NF–3NF)** ma’lumotlarning takrorlanishi va uzilib qolishini (orphan records) oldini oladi!",
    whyEn: 'Enforce referential integrity with Primary Keys, Foreign Keys (`ON DELETE CASCADE` / `RESTRICT`), and 1NF–3NF normalization to eliminate update, insert, and delete anomalies.',
    analogyUz: "**Denormalized jadval** — har bir pochtachi qog‘oziga mijozning to‘liq manzilini qayta-qayta ko‘chirib yozish (ko‘chsa hamma qog‘oz xato!). **Normalized (3NF)** — mijoz manzili faqat `users` da 1 marta saqlanadi, `orders` esa uning ID raqamiga (`user_id` Foreign Key) ishora qiladi!",
    analogyEn: 'Normalization stores each fact once in its home table and links records cleanly via Foreign Keys instead of duplicating mutable text everywhere.',
    stopsUz: "SQLite ning eng katta sirlaridan biri: **SQLite da `PRAGMA foreign_keys = ON` sukut bo‘yicha O‘CHIQ (OFF) turadi!** Har bir yangi `sqlite3.connect(...)` ulanishida darhol `conn.execute(\"PRAGMA foreign_keys = ON\")` chaqirmasangiz, `FOREIGN KEY` va `ON DELETE CASCADE` umuman ishlamaydi!",
    stopsEn: 'CRITICAL SQLITE GOTCHA: SQLite disables foreign key enforcement by default on every new connection! Always execute `PRAGMA foreign_keys = ON` immediately after connecting.',
    objUz: ['Natural vs Surrogate Primary Key (`id` / UUID) tanlash', 'SQLite da `PRAGMA foreign_keys = ON` va `ON DELETE CASCADE` / `RESTRICT` ni yoqish', '1NF (atomik qiymatlar), 2NF va 3NF (tranzitiv bog‘liqlikni olib tashlash) qoidalarini bilish'],
    objEn: ['Choose clean Primary Keys and Many-to-Many junction tables', 'Enable `PRAGMA foreign_keys = ON` and configure `CASCADE` / `RESTRICT`', 'Normalize schemas cleanly through 1NF, 2NF, and 3NF'],
    theoryUz: `### 1. Primary Key & Surrogate ID
Har bir qatorni noyob aniqlaydi. O‘zgaruvchan \`email\`/\`phone\` o‘rniga o‘zgarmas **Surrogate Key** (\`id INTEGER PRIMARY KEY\`) ishlating (\`email\` ga esa \`UNIQUE\` bering).
### 2. Foreign Key & \`PRAGMA foreign_keys = ON\`
\`\`\`sql
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
\`\`\`
- \`RESTRICT\` (yoki \`NO ACTION\`): bolalari bor otani o‘chirishga ruxsat bermaydi (xavfsiz default!).
- \`CASCADE\`: ota o‘chirilsa bolalari ham avtomatik o‘chadi.
- \`SET NULL\`: boladagi \`user_id\` ni \`NULL\` qiladi.
### 3. Normalizatsiya Bosqichlari (1NF -> 3NF)
- **1NF**: har katakda bitta atomik qiymat (bitta ustunda \`"a,b,c"\` CSV saqlamang!).
- **2NF**: har bir oddiy ustun to‘liq Primary Key ga bog‘liq (kompozit kalitli jadvallarda).
- **3NF**: asosiy kalitga bog‘liq bo‘lmagan ustunlar orasida tranzitiv bog‘liqlik yo‘q (masalan \`orders\` da \`zip_code -> city\` bo‘lsa \`cities\` ga ajrating).`,
    theoryEn: `### 1. Primary Keys (Surrogate vs Natural)
Use immutable surrogate \`id\` primary keys and enforce \`UNIQUE\` on mutable natural keys like \`email\`.
### 2. Foreign Keys & Cascades
Always run \`PRAGMA foreign_keys = ON\` in SQLite; choose \`ON DELETE RESTRICT\` (safe default), \`CASCADE\`, or \`SET NULL\`.
### 3. Normalization (1NF–3NF)
**1NF**: atomic single values per cell (no comma-separated lists); **2NF**: no partial dependency on composite keys; **3NF**: no transitive dependencies between non-key columns.`,
    examples: [
      ex('Misol 1: `PRAGMA foreign_keys = ON` va `ON DELETE CASCADE`', 'Example 1: Enforcing Foreign Keys & Cascade in SQLite', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("PRAGMA foreign_keys = ON")\nc.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")\nc.execute("""\nCREATE TABLE tokens (\n    id INTEGER PRIMARY KEY,\n    user_id INTEGER NOT NULL,\n    val TEXT NOT NULL,\n    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n)\n""")\nc.execute("INSERT INTO users VALUES (1, 'Ali')")\nc.execute("INSERT INTO tokens (user_id, val) VALUES (1, 'tok_abc')")\ntry:\n    c.execute("INSERT INTO tokens (user_id, val) VALUES (999, 'bad')")\nexcept sqlite3.IntegrityError:\n    print("Blocked orphan token!")\nc.execute("DELETE FROM users WHERE id = 1")\nprint("Remaining tokens after CASCADE:", c.execute("SELECT * FROM tokens").fetchall())`, `Blocked orphan token!\nRemaining tokens after CASCADE: []`, '`PRAGMA foreign_keys = ON` mavjud bo‘lmagan `user_id=999` ni blokladi va `user` o‘chganda tokenni ham o‘chirdi.', 'With `PRAGMA foreign_keys = ON`, SQLite blocks orphan FKs and cascades parent deletions.'),
      ex('Misol 2: 1NF buzilishini Many-to-Many Junction Table bilan tuzatish', 'Example 2: Fixing 1NF Violation with Junction Table', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("PRAGMA foreign_keys = ON")\nc.execute("CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT)")\nc.execute("CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT UNIQUE)")\nc.execute("CREATE TABLE post_tags (post_id INT, tag_id INT, PRIMARY KEY (post_id, tag_id))")\nc.execute("INSERT INTO posts VALUES (1, 'SQL Guide')")\nc.execute("INSERT INTO tags VALUES (1, 'db'), (2, 'python')")\nc.executemany("INSERT INTO post_tags VALUES (?, ?)", [(1, 1), (1, 2)])\nprint(c.execute("SELECT t.name FROM tags t JOIN post_tags pt ON pt.tag_id=t.id WHERE pt.post_id=1 ORDER BY t.name").fetchall())`, `[('db',), ('python',)]`, '"db,python" ni bitta matn ustuniga tiqish (1NF buzilishi) o‘rniga `post_tags` bog‘lovchi jadval tuzildi.', 'Junction table `post_tags` models Many-to-Many cleanly in 1NF/3NF.'),
      ex('Misol 3: `ON DELETE RESTRICT` bilan muhim yozuvlarni himoyalash', 'Example 3: Protecting Invoices with RESTRICT', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("PRAGMA foreign_keys = ON")\nc.execute("CREATE TABLE cust (id INT PRIMARY KEY)")\nc.execute("CREATE TABLE inv (id INT PRIMARY KEY, cid INT REFERENCES cust(id) ON DELETE RESTRICT)")\nc.execute("INSERT INTO cust VALUES (1)"); c.execute("INSERT INTO inv VALUES (10, 1)")\ntry:\n    c.execute("DELETE FROM cust WHERE id = 1")\nexcept sqlite3.IntegrityError:\n    print("Cannot delete customer with invoices!")`, `Cannot delete customer with invoices!`, 'Moliyaviy tarixi bor mijozni tasodifan o‘chirib yuborishdan himoya.', '`ON DELETE RESTRICT` prevents deleting parents that still have protected children.'),
    ],
    traceTitleUz: 'Foreign Key Cascade izi',
    traceTitleEn: 'Tracing Foreign Key Cascade',
    traceCode: `PRAGMA foreign_keys = ON;\nDELETE FROM users WHERE id = 1;`,
    traceSteps: [
      traceStep(1, 'PRAGMA check', 'FK enabled', 'SQLite tashqi kalit nazorati faol', 'FK enforcement active'),
      traceStep(2, 'DELETE user id=1', 'scan tokens(user_id=1)', 'Bog‘liq bolalar topildi', 'Located child rows'),
      traceStep(3, 'ON DELETE CASCADE', 'deleted child tokens', 'Yetim qator qolmadi', 'Cascaded clean delete'),
    ],
    commonMistakes: [
      mistake('SQLite da `PRAGMA foreign_keys = ON` ni unutish', 'Forgetting PRAGMA foreign_keys = ON in SQLite', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE p (id INT PRIMARY KEY)")\nc.execute("CREATE TABLE ch (pid INT REFERENCES p(id))")\nc.execute("INSERT INTO ch VALUES (999)")  # Succeeds silently without PRAGMA!\nprint("Orphan allowed without PRAGMA:", c.execute("SELECT * FROM ch").fetchall())`, 'Orphan record (999) inserted silently!', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("PRAGMA foreign_keys = ON")\nprint("Always enable PRAGMA foreign_keys = ON immediately on connect!")`, 'Sukut bo‘yicha SQLite `REFERENCES` cheklovini tekshirmaydi!', 'SQLite skips foreign key checks unless `PRAGMA foreign_keys = ON` is executed per connection.', 'Har ulanishda birinchi `PRAGMA foreign_keys = ON` bajaring.', 'Enable `PRAGMA foreign_keys = ON` on every connection.'),
      mistake('Bitta ustunga `"python,sql,web"` qilib ko‘p qiymat yozish (1NF buzilishi)', 'Storing Comma-Separated Lists in One Column', `# Storing "python,sql,web" in tags TEXT breaks indexing, joins, and clean deletes!`, 'Violates 1NF — forces slow LIKE "%sql%" scans', `print("Normalize M:N relationships using a junction table (post_tags)!")`, 'Vergulli matnni indeks bilan qidirib bo‘lmaydi.', 'Comma-separated strings defeat indexes and relational integrity.', 'Bog‘lovchi (junction) jadval oching.', 'Create a proper junction table.'),
    ],
    compareTitleUz: '`ON DELETE CASCADE` vs `ON DELETE RESTRICT`',
    compareTitleEn: '`CASCADE` vs `RESTRICT`',
    compareUz: ['`CASCADE`: ota o‘chganda yashash ma’nosi yo‘qoladigan qismlar (`user_sessions`, `cart_items`).', '`RESTRICT`: o‘chirilishi mumkin bo‘lmagan tarixiy yozuvlar (`orders`, `invoices`, `payments`).'],
    compareEn: ['`CASCADE`: dependent child state like sessions or password-reset tokens.', '`RESTRICT`: financial invoices, audit records, and orders that must never vanish accidentally.'],
    compareSummaryUz: 'SQLite da doim `PRAGMA foreign_keys = ON` yoqing, o‘zgarmas Surrogate `id` ishlating va sxemani 3NF gacha toza ajrating.',
    compareSummaryEn: 'Enable `PRAGMA foreign_keys = ON` in SQLite, prefer surrogate primary keys, and normalize tables cleanly through 3NF.',
    practiceTasks: [
      pt('p1207_1', '1-mashq: `PRAGMA foreign_keys = ON` tekshiruvi', 'Task 1: Enable & Verify FK', '`PRAGMA foreign_keys = ON` qilib `PRAGMA foreign_keys` `1` chiqishini tasdiqlang.', 'Verify FK pragma.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("PRAGMA foreign_keys = ON")\nprint(c.execute("PRAGMA foreign_keys").fetchone()[0])`, '1', 'PRAGMA foreign_keys = ON', 'Prints 1.'),
      pt('p1207_2', '2-mashq: Yetim yozuvni bloklash', 'Task 2: Block Orphan Insert', 'Mavjud bo‘lmagan `dept_id=5` ga `IntegrityError` ushlang.', 'Reject invalid FK.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("PRAGMA foreign_keys = ON")\nc.execute("CREATE TABLE d (id INT PRIMARY KEY)")\nc.execute("CREATE TABLE e (did INT REFERENCES d(id))")\ntry:\n    c.execute("INSERT INTO e VALUES (5)")\nexcept sqlite3.IntegrityError:\n    print("fk blocked")`, 'fk blocked', 'PRAGMA + REFERENCES', 'Prints fk blocked.'),
      pt('p1207_3', '3-mashq: `ON DELETE CASCADE`', 'Task 3: Cascade Delete', 'Ota o‘chirilganda bola ham o‘chishini tasdiqlang.', 'Test ON DELETE CASCADE.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("PRAGMA foreign_keys = ON")\nc.execute("CREATE TABLE p (id INT PRIMARY KEY)"); c.execute("CREATE TABLE ch (pid INT REFERENCES p(id) ON DELETE CASCADE)")\nc.execute("INSERT INTO p VALUES (1)"); c.execute("INSERT INTO ch VALUES (1)")\nc.execute("DELETE FROM p WHERE id=1")\nprint(c.execute("SELECT * FROM ch").fetchall())`, '[]', 'ON DELETE CASCADE', 'Prints [].'),
      pt('p1207_4', '4-mashq: `ON DELETE SET NULL`', 'Task 4: Set Null on Delete', 'Muallif o‘chirilganda maqolada `author_id` `None` bo‘lib qolsin.', 'Test ON DELETE SET NULL.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("PRAGMA foreign_keys = ON")\nc.execute("CREATE TABLE a (id INT PRIMARY KEY)"); c.execute("CREATE TABLE p (aid INT REFERENCES a(id) ON DELETE SET NULL)")\nc.execute("INSERT INTO a VALUES (1)"); c.execute("INSERT INTO p VALUES (1)")\nc.execute("DELETE FROM a WHERE id=1")\nprint(c.execute("SELECT * FROM p").fetchall())`, '[(None,)]', 'ON DELETE SET NULL', 'Prints [(None,)].'),
      pt('p1207_5', '5-mashq: Kompozit Primary Key (M:N)', 'Task 5: Composite PK Uniqueness', '`PRIMARY KEY (user_id, role_id)` bilan takroriy juftlikni bloklang.', 'Enforce composite PK.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE ur (u INT, r INT, PRIMARY KEY (u, r))")\nc.execute("INSERT INTO ur VALUES (1, 2)")\ntry:\n    c.execute("INSERT INTO ur VALUES (1, 2)")\nexcept sqlite3.IntegrityError:\n    print("unique pair")`, 'unique pair', 'PRIMARY KEY (u, r)', 'Prints unique pair.'),
    ],
    quiz: [
      q('q1207_1', 'Yangi `sqlite3.connect()` ulanishida `FOREIGN KEY` lar ishlashi uchun nima bajarish SHART?', 'Mandatory command per SQLite connection to enforce Foreign Keys?', ['BEGIN TRANSACTION', 'PRAGMA foreign_keys = ON', 'SET FOREIGN_KEYS = 1', 'ENABLE FK'], ['BEGIN TRANSACTION', 'PRAGMA foreign_keys = ON', 'SET FOREIGN_KEYS = 1', 'ENABLE FK'], 1, '`PRAGMA foreign_keys = ON`.', '`PRAGMA foreign_keys = ON`.'),
      q('q1207_2', '1-Normal Forma (1NF) qaysi muammoni taqiqlaydi?', 'What does First Normal Form (1NF) prohibit?', ['Primary key ishlatishni', 'Bitta katakda ko‘p qiymatli ro‘yxat (`"tag1,tag2"`) saqlashni', 'JOIN yozishni', 'NULL qiymatni'], ['Primary keys', 'Storing multi-valued lists inside a single column cell', 'JOINs', 'NULLs'], 1, 'Atomik bo‘lmagan (vergulli ro‘yxat) ustunlarni taqiqlaydi.', 'Multi-valued cells.'),
      q('q1207_3', 'Bolalari (masalan `invoices`) bor mijozni o‘chirishni taqiqlovchi FK qoidasi?', 'Foreign key delete action preventing deletion of a parent with existing invoices?', ['CASCADE', 'RESTRICT / NO ACTION', 'SET NULL', 'DROP'], ['CASCADE', 'RESTRICT / NO ACTION', 'SET NULL', 'DROP'], 1, '`ON DELETE RESTRICT`.', '`ON DELETE RESTRICT`.'),
      q('q1207_4', 'Nima uchun Primary Key sifatida foydalanuvchi `email` dan ko‘ra Surrogate `id` afzal?', 'Why prefer an immutable surrogate `id` over `email` as a Primary Key?', ['Email o‘zgarishi mumkin va string FK lar kattaroq joy oladi', 'Email UNIQUE bo‘lmaydi', 'SQLite matnni qo‘llamaydi', 'Indeks ishlamaydi'], ['Emails can change and inflate FK indexes', 'Emails cannot be unique', 'No text support', 'No index'], 0, 'Email o‘zgaruvchan, `id` esa o‘zgarmas va ixcham.', 'Surrogate `id` is immutable and compact.'),
      q('q1207_5', 'Many-to-Many (Masalan `Students` <-> `Courses`) munosabati qanday quriladi?', 'How are Many-to-Many relationships modeled in 3NF?', ['Vergulli ustun bilan', 'Ikkita FK ni birlashtiruvchi Junction (oraliq) jadval orqali', 'Bitta jadvalda', 'JSON matnda'], ['CSV column', 'A junction/bridge table holding both Foreign Keys', 'One table', 'JSON string'], 1, 'Oraliq Junction jadval (`enrollments`) orqali.', 'Via a junction table.'),
    ],
    homework: hw('Denormalized Jadvalni 3NF ga O‘tkazish', 'Normalize Order Sheet to 3NF', 'Bitta ulkan `(order_id, customer_name, customer_email, item_tags_csv, product_name, price_cents)` jadvalini 3NF ga (`customers`, `products`, `orders`, `order_items`) ajratib, `PRAGMA foreign_keys = ON` bilan test qiling.', 'Refactor a flat unnormalized order table into 3NF (`customers`, `products`, `orders`, `order_items`) with `PRAGMA foreign_keys = ON`, cascades, and a JOIN summary.', ['4 ta normalizatsiyalangan jadval', 'PRAGMA foreign_keys = ON va IntegrityError testi'], ['4 normalized tables', 'FK pragma & integrity checks'], 'Create junction order_items(order_id, product_id, qty).', 'Clean 3NF structure.', 'Mijoz emailini faqat 1 joyda yangilab barcha buyurtmalarda ko‘ring.', 'Update customer email once and verify via JOIN.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-12-08',
    courseId: 'databases',
    moduleId: 'c12_m4',
    order: 8,
    titleUz: 'SQLite Chuqurlashtirilgan — Indexlar, EXPLAIN QUERY PLAN, WAL va Row Factory',
    titleEn: 'SQLite Internals: Indexes, EXPLAIN QUERY PLAN, Row Factory & WAL',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-12-07'],
    conceptId: 'db_sqlite_indexes',
    whyUz: "Jadvalda 100 ta qator bo‘lsa hamma so‘rov tez ishlaydi. 500,000 qatorda esa `WHERE email = ?` ustida **Index** bo‘lmasa baza **Full Table Scan** (O(n)) qilib soniyalar sarflaydi! B-Tree **Index** va **`EXPLAIN QUERY PLAN`** yordamida qidiruvni O(log n) ga tushirasiz!",
    whyEn: 'Accelerate reads from O(n) table scans to O(log n) B-Tree lookups using `CREATE INDEX`, inspect plans with `EXPLAIN QUERY PLAN`, and map rows cleanly with `sqlite3.Row`.',
    analogyUz: "**Full Table Scan (`SCAN`)** — 1000 betlik kitobda \"Recursion\" so‘zini 1-betdan boshlab qidirish. **B-Tree Index (`SEARCH`)** — esa kitob oxiridagi alifbo ko‘rsatkichidan darhol 412-betni ochishdir!",
    analogyEn: 'A `SCAN` reads every page of a book; an index `SEARCH` jumps straight to the exact page via a sorted lookup directory.',
    stopsUz: "1) `CREATE INDEX` o‘qishni (`SELECT`) tezlashtiradi, lekin har bir `INSERT`/`UPDATE`/`DELETE` da indeks ham yangilangani uchun **yozishni biroz sekinlashtiradi** — hamma ustunga ham bekor indeks qo‘ymang! 2) **`conn.row_factory = sqlite3.Row`** qatorlarni `row[\"email\"]` deb nom bilan o‘qishga imkon beradi (lekin `dict(row)` ga aylantirish ham juda oson).",
    stopsEn: 'Indexes speed up `SELECT` / `JOIN` / `ORDER BY` at the cost of extra disk space and slightly slower writes—index selective `WHERE` and `FOREIGN KEY` columns, not every column.',
    objUz: ['`CREATE INDEX` (single va composite) yaratish va `EXPLAIN QUERY PLAN` da `SCAN` vs `SEARCH` ni o‘qish', '`conn.row_factory = sqlite3.Row` bilan ustun nomlari orqali o‘qish', 'SQLite `WAL` rejimi va `busy_timeout` nima uchun kerakligini tushunish'],
    objEn: ['Create B-Tree indexes and read `SCAN` vs `SEARCH` in `EXPLAIN QUERY PLAN`', 'Enable `sqlite3.Row` for dictionary-like column access', 'Configure `WAL` mode and `timeout` for concurrent SQLite reads/writes'],
    theoryUz: `### 1. B-Tree Index (\`CREATE INDEX\`)
\`CREATE INDEX idx_orders_user ON orders(user_id);\` — tartiblangan B-Tree ko‘rsatkich yaratadi (**O(log n)** qidiruv).
### 2. \`EXPLAIN QUERY PLAN\`
- \`SCAN table\`: butun jadvalni boshdan oxirigacha o‘qiydi (O(n) — sekin!).
- \`SEARCH table USING INDEX idx_...\`: B-Tree indeksdan foydalandi (O(log n) — tez!).
### 3. Composite Index Tartibi (Leftmost Prefix)
\`INDEX (dept, salary)\` -> \`WHERE dept = ?\` va \`WHERE dept = ? AND salary > ?\` uchun ishlaydi, lekin faqat \`WHERE salary > ?\` uchun ISHLAMAYDI!
### 4. \`sqlite3.Row\` va WAL Rejimi
\`conn.row_factory = sqlite3.Row\` -> \`row["name"]\` yoki \`dict(row)\`. \`PRAGMA journal_mode=WAL;\` bir o‘quvchi va yozuvchilarning birga ishlashini keskin yaxshilaydi.`,
    theoryEn: `### 1. B-Tree Indexes
\`CREATE INDEX idx_col ON tbl(col)\` turns O(n) scans into O(log n) B-Tree lookups.
### 2. Reading \`EXPLAIN QUERY PLAN\`
Look for \`SEARCH ... USING INDEX\` instead of \`SCAN\`.
### 3. Composite Index Ordering
An index on \`(a, b)\` supports queries on \`(a)\` and \`(a, b)\` (leftmost prefix rule), not standalone \`(b)\`.
### 4. \`sqlite3.Row\` & \`WAL\` Mode
\`sqlite3.Row\` enables column-name access and \`dict(row)\`; \`WAL\` lets readers proceed concurrently with a writer.`,
    examples: [
      ex('Misol 1: `EXPLAIN QUERY PLAN` — `SCAN` dan `SEARCH` ga', 'Example 1: SCAN vs Indexed SEARCH', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE logs (id INTEGER PRIMARY KEY, user_id INT, msg TEXT)")\nplan_before = c.execute("EXPLAIN QUERY PLAN SELECT msg FROM logs WHERE user_id = 42").fetchall()\nc.execute("CREATE INDEX idx_logs_uid ON logs(user_id)")\nplan_after = c.execute("EXPLAIN QUERY PLAN SELECT msg FROM logs WHERE user_id = 42").fetchall()\nprint("Before:", plan_before[0][3])\nprint("After:", plan_after[0][3])`, `Before: SCAN logs\nAfter: SEARCH logs USING INDEX idx_logs_uid (user_id=?)`, '`CREATE INDEX` qo‘shilgach reja `SCAN logs` dan `SEARCH logs USING INDEX` ga o‘zgardi!', 'Adding the index transforms `SCAN logs` into an indexed `SEARCH`.'),
      ex('Misol 2: `sqlite3.Row` bilan ustun nomlari bo‘yicha o‘qish', 'Example 2: Dictionary-Like sqlite3.Row Access', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.row_factory = sqlite3.Row\nc.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, role TEXT)")\nc.execute("INSERT INTO users (name, role) VALUES ('Aziza', 'admin')")\nrow = c.execute("SELECT id, name, role FROM users").fetchone()\nprint(row["name"], "| dict:", dict(row))`, `Aziza | dict: {'id': 1, 'name': 'Aziza', 'role': 'admin'}`, '`sqlite3.Row` tupledagi raqamli indeks (`row[1]`) xatolaridan qutqaradi va `dict(row)` ga oson o‘tadi.', '`sqlite3.Row` eliminates brittle positional tuple indexing.'),
      ex('Misol 3: Composite Index va Leftmost Prefix', 'Example 3: Composite Index Query Plan', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE ev (kind TEXT, ts INT)")\nc.execute("CREATE INDEX idx_ev_kind_ts ON ev(kind, ts)")\np1 = c.execute("EXPLAIN QUERY PLAN SELECT * FROM ev WHERE kind='err' AND ts > 10").fetchone()[3]\np2 = c.execute("EXPLAIN QUERY PLAN SELECT * FROM ev WHERE ts > 10").fetchone()[3]\nprint("both:", "INDEX" in p1, "| ts only:", "SCAN" in p2)`, `both: True | ts only: True`, 'Composite `(kind, ts)` indeksida 1-ustun (`kind`) bo‘lmasa, baza indeksdan foydalana olmaydi!', 'Queries skipping the leading column (`kind`) fall back to a full `SCAN`.'),
    ],
    traceTitleUz: 'Query Planner izi',
    traceTitleEn: 'Tracing EXPLAIN QUERY PLAN',
    traceCode: `CREATE INDEX idx_u ON logs(user_id);\nEXPLAIN QUERY PLAN SELECT * FROM logs WHERE user_id = 5;`,
    traceSteps: [
      traceStep(1, 'No index', 'SCAN logs', 'Hamma qator ko‘riladi (O(n))', 'Full table scan'),
      traceStep(2, 'With idx_u', 'SEARCH ... USING INDEX', 'B-Tree bo‘ylab tez qidiruv (O(log n))', 'Indexed B-Tree search'),
    ],
    commonMistakes: [
      mistake('`WHERE LOWER(email) = ?` yozib oddiy `email` indeksini ishdan chiqarish', 'Wrapping Indexed Column in Function in WHERE', `# WHERE LOWER(email) = 'a@b.uz' prevents SQLite from using an index on (email)!`, 'Falls back to slow full SCAN', `print("Normalize email on INSERT or create an expression index: CREATE INDEX ... ON u(LOWER(email))!")`, 'Indeksli ustun ustiga funksiya qo‘llansa oddiy B-Tree ishlamaydi.', 'Applying functions to indexed columns bypasses standard B-Tree indexes.', 'Emailni saqlashda `.lower()` qiling yoki expression index oching.', 'Store normalized lowercase or index the expression.'),
      mistake('Kichik/kam o‘qiladigan jadvalda har bir ustunga indeks qo‘yish', 'Over-Indexing Every Column', `# Too many indexes slow down INSERT/UPDATE and bloat database file size!`, 'Write amplification overhead', `print("Index Foreign Keys and high-selectivity WHERE/ORDER BY columns only!")`, 'Har bir ortiqcha indeks har `INSERT` da qayta daraxt yangilaydi.', 'Every index adds write amplification on `INSERT`/`UPDATE`/`DELETE`.', 'Faqat kerakli `WHERE`/`JOIN`/`ORDER BY` ustunlarini indekslang.', 'Index selectively based on real query plans.'),
    ],
    compareTitleUz: 'Table `SCAN` vs Index `SEARCH`',
    compareTitleEn: 'Full `SCAN` vs Indexed `SEARCH`',
    compareUz: ['`SCAN`: O(n), kichik (< 500 qator) jadvallarda yoki jadvalning >30% qatori kerak bo‘lganda normal.', '`SEARCH USING INDEX`: O(log n), million qatorda aniq qator yoki kichik diapazonni millisekundda topadi.'],
    compareEn: ['`SCAN`: O(n), fine for tiny tables or high-fraction scans.', '`SEARCH`: O(log n) B-Tree lookup essential for selective queries at scale.'],
    compareSummaryUz: 'Tez-tez qidiriladigan FK va `WHERE` ustunlariga `CREATE INDEX` qo‘ying, `EXPLAIN QUERY PLAN` bilan tekshiring va `sqlite3.Row` ishlating.',
    compareSummaryEn: 'Verify selective queries hit `SEARCH ... USING INDEX` via `EXPLAIN QUERY PLAN` and bind `sqlite3.Row` for readable row access.',
    practiceTasks: [
      pt('p1208_1', '1-mashq: `sqlite3.Row` va `dict(row)`', 'Task 1: Row Factory Dict', '`row_factory = sqlite3.Row` bilan qatorni `dict` ga o‘giring.', 'Use sqlite3.Row.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.row_factory = sqlite3.Row\nc.execute("CREATE TABLE t (id INT, k TEXT)"); c.execute("INSERT INTO t VALUES (1, 'py')")\nr = c.execute("SELECT * FROM t").fetchone()\nprint(r["k"], dict(r))`, "py {'id': 1, 'k': 'py'}", 'c.row_factory = sqlite3.Row', 'Prints row dict.'),
      pt('p1208_2', '2-mashq: `EXPLAIN QUERY PLAN` SCAN vs SEARCH', 'Task 2: Verify Index Usage', 'Indeks qo‘shilgach reja ichida `"INDEX"` chiqishini tekshiring.', 'Check INDEX in query plan.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (email TEXT)")\nc.execute("CREATE INDEX idx_em ON u(email)")\np = c.execute("EXPLAIN QUERY PLAN SELECT * FROM u WHERE email='a'").fetchone()[3]\nprint("INDEX" in p)`, 'True', 'CREATE INDEX idx_em ON u(email)', 'Prints True.'),
      pt('p1208_3', '3-mashq: `UNIQUE INDEX` yaratish', 'Task 3: Unique Index Guard', '`CREATE UNIQUE INDEX` bilan dublikat qiymatni bloklang.', 'Create UNIQUE INDEX.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (slug TEXT)")\nc.execute("CREATE UNIQUE INDEX uq_slug ON t(slug)")\nc.execute("INSERT INTO t VALUES ('py')")\ntry:\n    c.execute("INSERT INTO t VALUES ('py')")\nexcept sqlite3.IntegrityError:\n    print("unique idx")`, 'unique idx', 'CREATE UNIQUE INDEX', 'Prints unique idx.'),
      pt('p1208_4', '4-mashq: Covering Index (`USING COVERING INDEX`)', 'Task 4: Covering Index Check', 'So‘ralgan ustunlarning hammasi indeksda bo‘lganda `"COVERING INDEX"` chiqishini ko‘ring.', 'Test covering index.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE p (cat TEXT, price INT)")\nc.execute("CREATE INDEX idx_cp ON p(cat, price)")\nplan = c.execute("EXPLAIN QUERY PLAN SELECT price FROM p WHERE cat='bk'").fetchone()[3]\nprint("COVERING" in plan)`, 'True', 'Index covers SELECT price', 'Prints True.'),
      pt('p1208_5', '5-mashq: `DROP INDEX IF EXISTS`', 'Task 5: Drop Index Safely', 'Indeksni `DROP INDEX IF EXISTS` bilan xatosiz o‘chiring.', 'Drop index safely.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("DROP INDEX IF EXISTS idx_missing")\nprint("ok")`, 'ok', 'DROP INDEX IF EXISTS', 'Prints ok.'),
    ],
    quiz: [
      q('q1208_1', '`EXPLAIN QUERY PLAN` natijasida `SCAN users` so‘zi nimani bildiradi?', 'What does `SCAN users` mean in SQLite’s `EXPLAIN QUERY PLAN`?', ['Indeks ishlatildi', 'Butun jadval boshidan oxirigacha o‘qildi (O(n) full scan)', 'Xato yuz berdi', 'Keshdan olindi'], ['Used index', 'Full table scan reading every row (O(n))', 'Error', 'Cached'], 1, 'To‘liq jadval skani (O(n)).', 'Full table scan.'),
      q('q1208_2', '`CREATE INDEX idx ON emp(dept, salary)` qaysi so‘rovni tezlashtira OLMAYDI?', 'Which query CANNOT use a composite index on `(dept, salary)`?', ['WHERE dept = "IT"', 'WHERE dept = "IT" AND salary > 100', 'Faqat WHERE salary > 100 (chap ustun `dept` siz)', 'ORDER BY dept'], ['WHERE dept = "IT"', 'WHERE dept = "IT" AND salary > 100', 'WHERE salary > 100 alone (skips leading column)', 'ORDER BY dept'], 2, 'Leftmost prefix qoidasi: `dept` siz faqat `salary` da ishlamaydi.', 'Skipping the leading column breaks B-Tree lookup.'),
      q('q1208_3', 'Qatorlarni `row[0]` o‘rniga `row["email"]` deb nom bilan olish uchun nima sozlanadi?', 'Setting on `sqlite3.Connection` enabling `row["col"]` access?', ['conn.dict_mode = True', 'conn.row_factory = sqlite3.Row', 'conn.use_names()', 'cursor.rows = dict'], ['conn.dict_mode = True', 'conn.row_factory = sqlite3.Row', 'conn.use_names()', 'cursor.rows = dict'], 1, '`conn.row_factory = sqlite3.Row`.', '`conn.row_factory = sqlite3.Row`.'),
      q('q1208_4', 'Nima uchun jadvalning barcha 20 ta ustuniga indeks qo‘yish zararli?', 'Downside of indexing every single column blindly?', ['SELECT sekinlashadi', 'Har bir INSERT/UPDATE/DELETE sekinlashadi va disk hajmi ortadi', 'SQLite ruxsat bermaydi', 'NULL bo‘lib qoladi'], ['SELECT slows down', 'Write amplification slows INSERT/UPDATE/DELETE and bloats storage', 'Forbidden', 'Becomes NULL'], 1, 'Yozish operatsiyalarini sekinlashtiradi va disk yeydi.', 'Slows writes and increases storage.'),
      q('q1208_5', 'SQLite da bir vaqtda o‘quvchi va yozuvchilar bloklanmasligini yaxshilovchi journal rejimi?', 'SQLite journal mode improving concurrent reads during writes?', ['DELETE', 'WAL (Write-Ahead Logging)', 'MEMORY', 'JSON'], ['DELETE', 'WAL (Write-Ahead Logging)', 'MEMORY', 'JSON'], 1, 'WAL (`PRAGMA journal_mode=WAL`).', 'WAL mode.'),
    ],
    homework: hw('Query Plan Optimizatori Laboratoriyasi', 'Index Optimization Benchmark', 'SQLite da 5,000 qatorli `events(user_id, level, created_at)` jadvalini to‘ldirib, indeksdan oldingi va keyingi `EXPLAIN QUERY PLAN` va `time.perf_counter()` farqini o‘lchang.', 'Populate 5,000 rows in `events`, capture `EXPLAIN QUERY PLAN` before/after adding a composite index `(user_id, created_at)`, and compare query timings.', ['5,000 qator + EXPLAIN QUERY PLAN taqqoslash', 'sqlite3.Row bilan natija o‘qish'], ['5,000 rows + before/after query plans', 'Use sqlite3.Row'], 'Create index on (user_id, created_at) and compare perf_counter.', 'Measure speedup.', 'Covering index hosil bo‘lishini ham tekshiring.', 'Verify covering index.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-12-09',
    courseId: 'databases',
    moduleId: 'c12_m4',
    order: 9,
    titleUz: 'PostgreSQL — Ishlab Chiqarish Bazasi (psycopg3, Pools, JSONB, EXPLAIN)',
    titleEn: 'PostgreSQL in Production: psycopg3, Connection Pools, JSONB & EXPLAIN',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-12-08'],
    conceptId: 'db_postgresql',
    whyUz: "SQLite bitta serverli kichik/o‘rta ilovalar uchun ajoyib, lekin ko‘p serverli yuklama, yuqori parallel yozish, `JSONB` indekslari, `TIMESTAMPTZ` va **Connection Pooling** talab qiladigan production backendlarning 80% i **PostgreSQL** da ishlaydi!",
    whyEn: 'Contrast SQLite vs PostgreSQL in production: learn `psycopg` (psycopg3) parameter placeholders (`%s`), connection pools, `JSONB` + GIN indexing, and `EXPLAIN ANALYZE`.',
    analogyUz: "**SQLite** — sizning shaxsiy yozuv stolingiz (bitta fayl, o‘ta tezkor, noldan sozlashsiz). **PostgreSQL** — esa ko‘p qavatli zavod-server: yuzlab ishchi (**Connection Pool**) bir vaqtda ulanadi, alohida server sifatida ishlaydi va murakkab tahlillarni bajaradi!",
    analogyEn: 'SQLite is an ultra-fast embedded notebook; PostgreSQL is a dedicated client-server database built for concurrent writers, connection pools, and rich types like `JSONB`.',
    stopsUz: "SQLite dan PostgreSQL ga o‘tishda 3 muhim farq: 1) Placeholder sintaksisi: SQLite da **`?`**, PostgreSQL `psycopg` da **`%s`** (`$1` esa asyncpg da)! 2) **Connection Pooling (`psycopg_pool`)**: har bir HTTP so‘rovda yangi TCP/TLS PostgreSQL ulanishi ochib yopish sekin — tayyor pool dan oling! 3) `AUTOINCREMENT` o‘rniga **`GENERATED ALWAYS AS IDENTITY`** (yoki `SERIAL`).",
    stopsEn: 'When migrating from SQLite to PostgreSQL (`psycopg3`), replace `?` placeholders with `%s`, use `GENERATED ALWAYS AS IDENTITY` instead of `AUTOINCREMENT`, and always use a connection pool rather than connecting per request.',
    objUz: ['SQLite vs PostgreSQL (concurrency, types, architecture) farqlarini bilish', '`psycopg` (`%s` parametrlari, `with psycopg.connect(...)`) va Connection Pooling konseptini tushunish', 'PostgreSQL ning `JSONB`, `ARRAY`, `TIMESTAMPTZ` va `EXPLAIN ANALYZE` imkoniyatlarini o‘rganish'],
    objEn: ['Know when to graduate from SQLite to PostgreSQL', 'Use `psycopg` `%s` parameterization and connection pooling patterns', 'Leverage Postgres `JSONB`, `TIMESTAMPTZ`, and `EXPLAIN ANALYZE`'],
    theoryUz: `### 1. SQLite vs PostgreSQL Arxitekturasi
- **SQLite**: embedded library, bitta fayl, 1 ta yozuvchi (writer) navbatda turadi.
- **PostgreSQL**: alohida TCP server, MVCC (Multi-Version Concurrency Control) — yuzlab parallel yozuvchilar!
### 2. \`psycopg\` (v3) Sintaksisi
\`\`\`python
with pool.connection() as conn:
    cur = conn.execute("SELECT id, email FROM users WHERE id = %s", (user_id,))
\`\`\`
(Diqqat: \`%\` formatlash EMAS, parametr tuple uzatish!)
### 3. Connection Pooling Nima Uchun Kerak?
PostgreSQL da yangi ulanish ochish ~20–50ms va jarayon (process) ochadi. \`ConnectionPool(min_size=2, max_size=10)\` tayyor ulanishlarni qayta ishlatadi!
### 4. PostgreSQL Super-Turlari
- \`TIMESTAMPTZ\`: har doim UTC timezone bilan.
- \`JSONB\`: ikkilik JSON — ichidagi kalitlarni **GIN index** bilan tezkor qidirish mumkin!
- \`EXPLAIN (ANALYZE, BUFFERS)\`: haqiqiy bajarish vaqti va xotira buferlarini o‘lchaydi.`,
    theoryEn: `### 1. Embedded vs Client-Server MVCC
SQLite embeds in-process with serialized writes; PostgreSQL runs as a network server using MVCC for high-concurrency multi-writer workloads.
### 2. \`psycopg\` (v3) Parameterization
Pass \`(val,)\` alongside \`%s\` placeholders—still strict server-side parameter binding, never Python \`%\` string formatting.
### 3. Connection Pooling
Reuse warm database connections via \`psycopg_pool.ConnectionPool\` to avoid TCP/handshake/fork overhead per request.
### 4. PostgreSQL Power Features
\`TIMESTAMPTZ\`, \`NUMERIC\`, \`JSONB\` with GIN indexes, and \`EXPLAIN (ANALYZE, BUFFERS)\`.`,
    examples: [
      ex('Misol 1: Dialect Adapter — `?` (SQLite) vs `%s` (PostgreSQL)', 'Example 1: Parameter Dialect Pattern (SQLite & Postgres)', `def adapt_sql(sql_qmark: str, dialect: str) -> str:\n    return sql_qmark.replace("?", "%s") if dialect == "postgres" else sql_qmark\n\nq = "SELECT id FROM users WHERE email = ? AND active = ?"\nprint("sqlite:", adapt_sql(q, "sqlite"))\nprint("postgres:", adapt_sql(q, "postgres"))`, `sqlite: SELECT id FROM users WHERE email = ? AND active = ?\npostgres: SELECT id FROM users WHERE email = %s AND active = %s`, 'Turli SQL drayverlar turlicha placeholder (`?`, `%s`, `$1`) ishlatadi, lekin barchasi parametrli!', 'Drivers vary in placeholder syntax (`?` vs `%s` vs `$1`) while sharing strict parameterization.'),
      ex('Misol 2: Connection Pool Simulyatori (`queue.LifoQueue`)', 'Example 2: Thread-Safe Connection Pool Pattern', `from contextlib import contextmanager\nimport sqlite3\n\nclass MiniPool:\n    def __init__(self, size: int):\n        self._free = [sqlite3.connect(":memory:") for _ in range(size)]\n    @contextmanager\n    def connection(self):\n        conn = self._free.pop()\n        try:\n            yield conn\n        finally:\n            self._free.append(conn)\n\npool = MiniPool(2)\nwith pool.connection() as c:\n    print("Borrowed! Free left:", len(pool._free), "| Query:", c.execute("SELECT 1 + 1").fetchone()[0])\nprint("Returned! Free now:", len(pool._free))`, `Borrowed! Free left: 1 | Query: 2\nReturned! Free now: 2`, 'Connection Pool tayyor ulanishni qarzga berib, `finally` da albatta qaytarib oladi.', 'Connection pools lend warm connections and guarantee return via `try/finally`.'),
      ex('Misol 3: `JSONB`-uslubidagi metadatalarni SQLite `json_extract` bilan ko‘rish', 'Example 3: Structured JSON Column Queries', `import json, sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE items (id INT, meta TEXT)")\nc.execute("INSERT INTO items VALUES (1, ?)", (json.dumps({"brand": "Lenovo", "ram": 16}),))\nprint(c.execute("SELECT json_extract(meta, '$.ram') FROM items WHERE json_extract(meta, '$.brand') = ?", ("Lenovo",)).fetchone()[0])`, `16`, 'PostgreSQL dagi `meta->>\'brand\'` kabi SQLite da ham `json_extract` bilan JSON ichidan qidirish mumkin.', 'Relational engines support querying JSON attributes directly inside SQL.'),
    ],
    traceTitleUz: 'Connection Pool borrow/return izi',
    traceTitleEn: 'Tracing Connection Pool Lifecycle',
    traceCode: `with pool.connection() as conn:\n    conn.execute(...)`,
    traceSteps: [
      traceStep(1, '__enter__', 'free: 2 -> 1', 'Tayyor ulanish pool dan olindi', 'Checked out warm connection'),
      traceStep(2, 'execute SQL', 'SELECT ...', 'TCP handshake siz darhol bajarildi', 'Executed without reconnect cost'),
      traceStep(3, '__exit__', 'free: 1 -> 2', 'Ulanish pool ga qaytarildi', 'Returned connection cleanly'),
    ],
    commonMistakes: [
      mistake('`psycopg` da `execute("... %s" % val)` deb string formatlash ishlatish', 'Confusing %s Placeholder with Python % Formatting', `# WRONG: cur.execute("SELECT * FROM u WHERE id = %s" % user_id) -> SQL INJECTION!\n# RIGHT: cur.execute("SELECT * FROM u WHERE id = %s", (user_id,))`, 'SQL Injection via % operator!', `print("Use a COMMA cur.execute('... %s', (uid,)), NEVER % operator!")`, '`%` belgisi Python da satrga qo‘shib yuboradi; vergul `, (uid,)` esa `psycopg` parametriga uzatadi!', 'Using Python’s `%` operator formats raw strings into SQL; passing `, (uid,)` binds parameters safely.', 'Doim `, (uid,)` bilan 2-argument qilib bering.', 'Pass parameters as the second argument tuple.'),
      mistake('Har bir HTTP so‘rovda yangi PostgreSQL ulanishi ochib yopish', 'Opening a Fresh Postgres Connection Per HTTP Request', `# Reconnecting TCP + Auth + Fork on 500 req/sec overwhelms Postgres max_connections!`, 'Too many connections / high latency', `print("Always reuse connections through psycopg_pool.ConnectionPool!")`, 'PostgreSQL har bir ulanish uchun OS jarayoni ochadi — pool siz tizim tez to‘lib qoladi.', 'Per-request Postgres connections exhaust `max_connections` quickly.', '`ConnectionPool` dan foydalaning.', 'Use a connection pool.'),
    ],
    compareTitleUz: 'SQLite vs PostgreSQL',
    compareTitleEn: 'SQLite vs PostgreSQL',
    compareUz: ['SQLite: CLI, desktop, IoT, testlar, o‘qish ko‘p bo‘lgan kichik/o‘rta veb-ilova (0 config).', 'PostgreSQL: ko‘p serverli production backend, parallel yozishlar, `JSONB`, full-text search, `pgvector`.'],
    compareEn: ['SQLite: zero-config embedded DB for tests, prototypes, edge nodes, and read-heavy apps.', 'PostgreSQL: multi-node concurrent production backend with rich types and pooling.'],
    compareSummaryUz: 'PostgreSQL + `psycopg3` da `%s` (vergul bilan!) parametr uzating, `ConnectionPool` ishlating va vaqtlar uchun `TIMESTAMPTZ` tanlang.',
    compareSummaryEn: 'In PostgreSQL (`psycopg3`), pass `(val,)` tuples to `%s` placeholders, reuse connections via `ConnectionPool`, and store UTC `TIMESTAMPTZ`.',
    practiceTasks: [
      pt('p1209_1', '1-mashq: Placeholder dialekt konverteri', 'Task 1: Dialect Placeholder Mapper', '`?` li so‘rovni PostgreSQL `%s` ga o‘giruvchi funksiya yozing.', 'Map ? to %s.', `def to_pg(sql): return sql.replace("?", "%s")\nprint(to_pg("SELECT * FROM u WHERE id = ? AND ok = ?"))`, 'SELECT * FROM u WHERE id = %s AND ok = %s', 'sql.replace("?", "%s")', 'Prints %s SQL.'),
      pt('p1209_2', '2-mashq: Pool `acquire/release` sanash', 'Task 2: Pool Size Counter', '3 talik pool dan 2 ta ulanish olinganda bo‘sh son `1` chiqishini ko‘rsating.', 'Track pool availability.', `pool = [1, 2, 3]\na, b = pool.pop(), pool.pop()\nprint(len(pool))\npool.extend([a, b])\nprint(len(pool))`, '1\n3', 'Pop and restore', 'Prints 1 then 3.'),
      pt('p1209_3', '3-mashq: `json_extract` bilan JSON ustun', 'Task 3: Query JSON Attribute', '`{"tier": "pro"}` JSON dan `"pro"` ni SQL orqali ajrating.', 'Extract JSON field in SQL.', `import json, sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (meta TEXT)")\nc.execute("INSERT INTO u VALUES (?)", (json.dumps({"tier": "pro"}),))\nprint(c.execute("SELECT json_extract(meta, '$.tier') FROM u").fetchone()[0])`, 'pro', 'json_extract(meta, "$.tier")', 'Prints pro.'),
      pt('p1209_4', '4-mashq: ISO-8601 UTC vaqt formati', 'Task 4: UTC Timestamp Storage', '`datetime(2026, 1, 1, tzinfo=timezone.utc).isoformat()` ni bazaga yozib o‘qing.', 'Store UTC ISO timestamp.', `from datetime import datetime, timezone\nimport sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE e (ts TEXT)")\nc.execute("INSERT INTO e VALUES (?)", (datetime(2026, 1, 1, tzinfo=timezone.utc).isoformat(),))\nprint(c.execute("SELECT ts FROM e").fetchone()[0])`, '2026-01-01T00:00:00+00:00', 'timezone.utc.isoformat()', 'Prints UTC ISO.'),
      pt('p1209_5', '5-mashq: Pool da xato chiqsa ham qaytarish', 'Task 5: Pool Return in finally', '`try/finally` ichida ulanish xato chiqsa ham pool ga qaytishini tasdiqlang.', 'Guarantee return via finally.', `pool = ["c1"]\nconn = pool.pop()\ntry:\n    raise ValueError("query err")\nexcept ValueError:\n    pass\nfinally:\n    pool.append(conn)\nprint(len(pool))`, '1', 'finally: pool.append(conn)', 'Prints 1.'),
    ],
    quiz: [
      q('q1209_1', 'PostgreSQL `psycopg` drayverida parametrli placeholder qanday yoziladi?', 'Parameter placeholder syntax in PostgreSQL `psycopg`?', ['?', '%s (2-argument tuple bilan)', ':1', '@val'], ['?', '%s (with separate params tuple)', ':1', '@val'], 1, '`%s` (2-argument `(val,)` tuple bilan).', '`%s` passed with tuple.'),
      q('q1209_2', 'Nima uchun production PostgreSQL ilovalarida `ConnectionPool` ishlatiladi?', 'Why use a Connection Pool with PostgreSQL in production?', ['Parolni yashirish', 'Har so‘rovda yangi TCP/process ulanish ochish kechikishini yo‘qotish va `max_connections` ni saqlash', 'JSON siqish', 'SQL Injection'], ['Hide password', 'Avoid per-request TCP/handshake overhead and cap connection count', 'Compress JSON', 'SQLi'], 1, 'Ulanishlarni qayta ishlatish va resursni tejash uchun.', 'Reuses warm connections safely.'),
      q('q1209_3', 'PostgreSQL da ichki kalitlarni GIN index bilan tezkor qidirish imkonini beruvchi JSON turi?', 'PostgreSQL JSON type supporting binary storage and GIN indexing?', ['TEXT', 'JSONB', 'BLOB', 'VARCHAR'], ['TEXT', 'JSONB', 'BLOB', 'VARCHAR'], 1, '`JSONB`.', '`JSONB`.'),
      q('q1209_4', '`EXPLAIN ANALYZE` oddiy `EXPLAIN` dan nimasi bilan farq qiladi?', 'Difference between `EXPLAIN` and `EXPLAIN ANALYZE` in PostgreSQL?', ['Farqi yo‘q', '`EXPLAIN ANALYZE` so‘rovni haqiqatda ishlatib ko‘rib real bajarish vaqti va qatorlar sonini o‘lchaydi', 'Jadvalni o‘chiradi', 'Indeks yasaydi'], ['None', '`EXPLAIN ANALYZE` actually executes the query and reports real timing/row counts', 'Drops table', 'Builds index'], 1, 'Haqiqiy ijro vaqtini o‘lchab ko‘rsatadi.', 'Executes and measures real runtime.'),
      q('q1209_5', 'Vaqt zonasi bilan sanalarni PostgreSQL da saqlashning eng to‘g‘ri turi?', 'Recommended PostgreSQL timestamp column type?', ['TEXT', 'TIMESTAMPTZ (TIMESTAMP WITH TIME ZONE)', 'INT', 'DATE only'], ['TEXT', 'TIMESTAMPTZ (TIMESTAMP WITH TIME ZONE)', 'INT', 'DATE only'], 1, '`TIMESTAMPTZ`.', '`TIMESTAMPTZ`.'),
    ],
    homework: hw('PostgreSQL/SQLite Repository Ko‘prigi', 'Dialect-Agnostic Connection Pool', 'Connection Pool kontekst menejeri (`@contextmanager`) va `?` -> `%s` dialekt adapterini yozib, SQLite da ishlaydigan `JSON` saqlash va vaqt filtrlash testlarini o‘tkazing.', 'Build a thread-safe `ConnectionPool` context manager with dialect adaptation (`?` vs `%s`), `json_extract` filtering, and UTC `isoformat` timestamps.', ['finally da ulanishni qaytaruvchi pool', 'JSON + UTC timestamp query testlari'], ['Safe pool with finally release', 'JSON + UTC tests'], 'Yield connection inside try, push back in finally.', 'Clean resource safety.', 'Pool to‘lib qolganda `RuntimeError` yoki kutish mexanizmini qo‘shing.', 'Handle exhausted pool.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-12-10',
    courseId: 'databases',
    moduleId: 'c12_m4',
    order: 10,
    titleUz: 'Python & Database Integratsiyasi — Repository Pattern va Review #27',
    titleEn: 'Python + DB Architecture: Repository Pattern, Unit of Work & Review #27',
    difficulty: 'advanced',
    estimatedMinutes: 40,
    prerequisites: ['PY-12-09'],
    conceptId: 'db_python_integration',
    whyUz: "Har bir biznes funksiyasining o‘rtasiga xom `SELECT ...` va `conn.commit()` larni sochib tashlasangiz, kodni test qilish ham, SQLite dan PostgreSQL ga ko‘chirish ham dahshatga aylanadi! **Repository Pattern** SQL ni bitta toza qatlamga yig‘ib, biznes mantiqqa faqat typed Python obyektlarini (`@dataclass`) uzatadi.",
    whyEn: 'Encapsulate SQL inside cohesive Repository classes returning typed `@dataclass` entities, manage atomic transactions via Unit of Work blocks, and prepare cleanly for ORMs.',
    analogyUz: "**Repository Pattern** — bu oshxona tarjimoni: biznes qatlami (ofitsiant) faqat \"Userni top\" (`repo.get_by_email(...)`) deydi; SQL oshxonasi esa qaysi bazadan (`SQLite` yoki `Postgres`) olishni o‘zi hal qilib tayyor `@dataclass User` obyektini qaytaradi!",
    analogyEn: 'A Repository hides raw SQL dialect details behind domain methods (`get_by_id`, `create`) returning clean `@dataclass` models.',
    stopsUz: "Repository qatlamida 2 oltin qoida: 1) **Repository metodlari ichida `conn.commit()` qilmang** — aks holda 2 ta repository amalini bitta atomik tranzaksiyaga (`with conn:`) birlashtirib bo‘lmaydi! 2) Har doim **`?` parametrlar** va **`sqlite3.Row`** -> `@dataclass` mapping ishlating!",
    stopsEn: 'Avoid committing inside individual Repository methods when multiple operations share a transaction—let the outer Unit of Work (`with conn:`) control commit/rollback boundaries.',
    objUz: ['`UserRepository` klassi bilan SQL ni biznes mantiqdan ajratish', '`sqlite3.Row` -> `@dataclass` obyektiga toza mapping yozish', 'Outer `with conn:` (Unit of Work) bilan ko‘p-repository atomik tranzaksiyani boshqarish'],
    objEn: ['Isolate parameterized SQL inside a Repository class', 'Hydrate `@dataclass` domain objects from `sqlite3.Row` results', 'Coordinate multi-step transactions with an outer Unit of Work (`with conn:`)'],
    theoryUz: `### 1. Repository Pattern Tuzilishi
\`\`\`python
class BookRepo:
    def __init__(self, conn): self.conn = conn
    def get(self, bid: int) -> Book | None: ...
    def add(self, title: str) -> Book: ...
\`\`\`
### 2. Row -> \`@dataclass\` Mapping
SQL dan kelgan natijani tuple (\`row[1]\`) sifatida emas, \`Book(id=row["id"], title=row["title"])\` qilib qaytarish IDE avtoto‘ldirish va type-safety beradi!
### 3. Tranzaksiya Chegarasi (Unit of Work)
Repository \`execute()\` qiladi; tashqi servis esa \`with conn:\` blokida bir nechta repository ni chaqirib hammasi muvaffaqiyatli bo‘lsagina \`COMMIT\` qiladi!
### 4. Raw SQL vs ORM (SQLAlchemy)
Oddiy analitika va maksimal nazorat uchun Raw SQL Repository ajoyib; katta domenlarda SQLAlchemy 2.0 ORM bu ishni yanada qulaylashtiradi (14-kurs!).`,
    theoryEn: `### 1. Repository Pattern
Isolates SQL statements, parameter binding, and row mapping from service/business logic.
### 2. Typed Domain Mapping
Convert \`sqlite3.Row\` directly into \`@dataclass\` entities for full IDE/static-typing clarity.
### 3. Unit of Work Transaction Control
Repositories execute statements on a shared connection; the outer \`with conn:\` service block commits or rolls back atomically.
### 4. Stepping Stone to ORMs
Mastering raw Repository patterns makes SQLAlchemy 2.0 sessions and migrations effortless in Course 14.`,
    examples: [
      ex('Misol 1: Typed `@dataclass` + `UserRepo` + Unit of Work', 'Example 1: Typed Repository & Atomic Service', `from dataclasses import dataclass\nimport sqlite3\n\n@dataclass(frozen=True)\nclass User:\n    id: int\n    email: str\n    balance: int\n\nclass UserRepo:\n    def __init__(self, conn: sqlite3.Connection):\n        self.conn = conn\n    def create(self, email: str, balance: int) -> User:\n        r = self.conn.execute(\n            "INSERT INTO users (email, balance) VALUES (?, ?) RETURNING id, email, balance",\n            (email, balance)\n        ).fetchone()\n        return User(id=r["id"], email=r["email"], balance=r["balance"])\n    def add_balance(self, uid: int, delta: int) -> None:\n        self.conn.execute("UPDATE users SET balance = balance + ? WHERE id = ?", (delta, uid))\n    def get(self, uid: int) -> User | None:\n        r = self.conn.execute("SELECT id, email, balance FROM users WHERE id = ?", (uid,)).fetchone()\n        return User(**dict(r)) if r else None\n\nconn = sqlite3.connect(":memory:")\nconn.row_factory = sqlite3.Row\nconn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, balance INT CHECK (balance >= 0))")\nrepo = UserRepo(conn)\nwith conn:\n    u1 = repo.create("ali@uz.dev", 100)\n    repo.add_balance(u1.id, 50)\nprint(repo.get(u1.id))`, `User(id=1, email='ali@uz.dev', balance=150)`, 'Biznes kod SQL haqida bilmaydi — faqat typed `User` obyektlari va atomik `with conn:` bilan ishlaydi!', 'Callers interact solely with typed `User` objects while `with conn:` guarantees atomicity.'),
      ex('Misol 2: Xatoda ko‘p-bosqichli rollback testi', 'Example 2: Multi-Step Transaction Rollback', `import sqlite3\n\nclass UserRepo:\n    def __init__(self, conn): self.conn = conn\n    def add_balance(self, uid: int, delta: int) -> None:\n        self.conn.execute("UPDATE users SET balance = balance + ? WHERE id = ?", (delta, uid))\n    def balance_of(self, uid: int) -> int:\n        return self.conn.execute("SELECT balance FROM users WHERE id = ?", (uid,)).fetchone()[0]\n\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, balance INT CHECK (balance >= 0))")\nconn.execute("INSERT INTO users VALUES (1, 150)")\nconn.commit()\nrepo = UserRepo(conn)\ntry:\n    with conn:\n        repo.add_balance(1, -100)\n        repo.add_balance(1, -100)  # Violates CHECK (balance >= 0)!\nexcept sqlite3.IntegrityError:\n    print("Both updates rolled back! Balance:", repo.balance_of(1))`, `Both updates rolled back! Balance: 150`, '1-ayirish o‘tgan bo‘lsa ham, 2-ayirish `CHECK` da yiqilgani uchun ikkalasi ham bekor qilindi!', 'Because `repo.add_balance()` did not commit internally, both steps roll back together.'),
      ex('Misol 3: `get_or_none` bilan 404 holatini toza qaytarish', 'Example 3: Clean Missing-Record Handling', `import sqlite3\n\nclass UserRepo:\n    def __init__(self, conn): self.conn = conn\n    def get(self, uid: int):\n        return self.conn.execute("SELECT id FROM users WHERE id = ?", (uid,)).fetchone()\n\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY)")\nrepo = UserRepo(conn)\nprint("Missing id=99:", repo.get(99))`, `Missing id=99: None`, 'Qator topilmasa crash emas, `None` qaytariladi.', 'Returns `None` cleanly when no record matches.'),
    ],
    traceTitleUz: 'Repository + Unit of Work izi',
    traceTitleEn: 'Tracing Repository Flow',
    traceCode: `with conn:\n    u = repo.create(...)\n    repo.add_balance(u.id, 50)`,
    traceSteps: [
      traceStep(1, 'with conn:', 'BEGIN', 'Tashqi Unit of Work boshlandi', 'Started transaction'),
      traceStep(2, 'repo.create + add_balance', 'User(id=1)', 'Row -> @dataclass ga o‘girildi', 'Hydrated User dataclass'),
      traceStep(3, 'exit with conn:', 'COMMIT', 'Hammasi birdan saqlandi', 'Committed atomically'),
    ],
    commonMistakes: [
      mistake('Repository metodi ichida `self.conn.commit()` chaqirib tranzaksiyani buzish', 'Committing Inside Individual Repository Methods', `# If repo.debit() commits immediately, a failure in repo.credit() leaves money missing!`, 'Breaks multi-step atomicity!', `print("Never commit inside Repo methods—let outer 'with conn:' own the transaction!")`, 'Ichki commit 1-bosqichni muhrlab qo‘yadi va 2-bosqich xatosida rollback qilib bo‘lmaydi.', 'Internal commits prevent rolling back earlier steps if a later step fails.', 'Commit/rollback ni tashqi `with conn:` ga bering.', 'Manage transaction scope outside the repository.'),
      mistake('UI/Route kodiga to‘g‘ridan-to‘g‘ri xom SQL yozish', 'Leaking Raw SQL Queries Into Routes/Handlers', `# Mixing SQL strings into FastAPI routes makes unit testing and refactoring painful!`, 'Tightly coupled application', `print("Keep all SQL encapsulated inside Repository classes!")`, 'SQL ni Repository ga yashirsangiz, testda `FakeRepo` bilan almashtirish oson bo‘ladi.', 'Encapsulating SQL in repositories keeps services easy to test and refactor.', 'Barcha SQL ni `*Repository` klasslariga yig‘ing.', 'Isolate SQL in repository modules.'),
    ],
    compareTitleUz: 'Raw SQL Repository vs ORM (SQLAlchemy)',
    compareTitleEn: 'Raw SQL Repository vs ORM',
    compareUz: ['Raw SQL Repo: maksimal nazorat, noldan tezlik, murakkab hisobotlar va `EXPLAIN` optimizatsiyasi.', 'ORM (SQLAlchemy 2.0): katta CRUD tizimlarda avto-mapping, munosabatlar va Alembic migratsiyalar.'],
    compareEn: ['Raw SQL Repo: full query control, zero abstraction overhead, ideal for custom SQL.', 'ORM: productive object mapping and schema migrations in large enterprise backends.'],
    compareSummaryUz: 'Python + DB integratsiyasida `Repository + @dataclass + sqlite3.Row + with conn:` eng toza va xavfsiz arxitekturadir.',
    compareSummaryEn: 'Pair `Repository` classes with `@dataclass` mapping, `sqlite3.Row`, and outer `with conn:` transaction boundaries.',
    practiceTasks: [
      pt('p1210_1', '1-mashq: `@dataclass` + `sqlite3.Row` mapping', 'Task 1: Hydrate Dataclass', '`Note(id, body)` dataclassini `sqlite3.Row` dan `Note(**dict(r))` qilib yarating.', 'Map row to dataclass.', `from dataclasses import dataclass\nimport sqlite3\n@dataclass\nclass Note: id: int; body: str\nc = sqlite3.connect(":memory:"); c.row_factory = sqlite3.Row\nc.execute("CREATE TABLE n (id INT, body TEXT)"); c.execute("INSERT INTO n VALUES (1, 'hi')")\nprint(Note(**dict(c.execute("SELECT * FROM n").fetchone())))`, "Note(id=1, body='hi')", 'Note(**dict(row))', 'Prints Note dataclass.'),
      pt('p1210_2', '2-mashq: `Repo.get` topilmasa `None`', 'Task 2: Repo Get or None', 'Mavjud bo‘lmagan ID uchun `None` qaytaruvchi `get(id)` yozing.', 'Return None on miss.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (id INT)")\ndef get_item(i): return c.execute("SELECT * FROM t WHERE id=?", (i,)).fetchone()\nprint(get_item(99))`, 'None', 'fetchone() returns None', 'Prints None.'),
      pt('p1210_3', '3-mashq: Tashqi `with conn:` atomikligi', 'Task 3: Outer Unit of Work', 'Ikkita insert dan keyin xato chiqsa ikkalasi ham bekor bo‘lishini ko‘rsating.', 'Rollback multi-insert.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (v INT)")\ntry:\n    with c: c.execute("INSERT INTO t VALUES (1)"); c.execute("INSERT INTO t VALUES (2)"); raise RuntimeError()\nexcept RuntimeError: pass\nprint(c.execute("SELECT COUNT(*) FROM t").fetchone()[0])`, '0', 'Outer with c: rolls back both', 'Prints 0.'),
      pt('p1210_4', '4-mashq: `Repo.list_all()` tartibli ro‘yxat', 'Task 4: List Typed Entities', 'Barcha qatorlarni `@dataclass` ro‘yxati qilib qaytaring.', 'Return list[Item].', `from dataclasses import dataclass\nimport sqlite3\n@dataclass\nclass Item: name: str\nc = sqlite3.connect(":memory:"); c.row_factory = sqlite3.Row\nc.execute("CREATE TABLE it (name TEXT)"); c.executemany("INSERT INTO it VALUES (?)", [("b",), ("a",)])\nprint([Item(**dict(r)) for r in c.execute("SELECT name FROM it ORDER BY name")])`, "[Item(name='a'), Item(name='b')]", 'List comprehension over rows', 'Prints sorted Item list.'),
      pt('p1210_5', '5-mashq: `Repo.delete()` boolean qaytarishi', 'Task 5: Delete Returns Bool', '`cur.rowcount > 0` orqali o‘chirilgan/o‘chirilmaganini `bool` qaytaring.', 'Return rowcount > 0.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (id INT)"); c.execute("INSERT INTO t VALUES (1)")\ndef delete(i): return c.execute("DELETE FROM t WHERE id=?", (i,)).rowcount > 0\nprint(delete(1), delete(1))`, 'True False', 'cur.rowcount > 0', 'Prints True False.'),
    ],
    quiz: [
      q('q1210_1', 'Repository Pattern ning asosiy maqsadi nima?', 'Primary goal of the Repository Pattern?', ['SQL ni o‘chirish', 'SQL so‘rovlar va row mapping ni biznes mantiqdan ajratish', 'Faqat NoSQL ishlatish', 'Global ulanish ochish'], ['Drop SQL', 'Encapsulate SQL and row mapping away from business logic', 'NoSQL only', 'Global conn'], 1, 'Ma’lumotlar bazasi kodini biznes mantiqdan ajratish.', 'Decouples persistence from domain logic.'),
      q('q1210_2', 'Nima uchun Repository metodlari ichida `conn.commit()` chaqirish tavsiya etilmaydi?', 'Why avoid calling `conn.commit()` inside individual Repository methods?', ['Sekin', 'Bir nechta repository amallarini bitta atomik tranzaksiyaga birlashtirib bo‘lmay qoladi', 'SyntaxError', 'SQLite ruxsat bermaydi'], ['Slow', 'Prevents composing multiple repository calls into one atomic transaction', 'SyntaxError', 'Disallowed'], 1, 'Multi-step atomiklikni buzadi.', 'Breaks multi-step transaction atomicity.'),
      q('q1210_3', '`sqlite3.Row` obyektini `@dataclass` ga aylantirishning toza usuli?', 'Clean way to hydrate a `@dataclass` `User` from a `sqlite3.Row` `r`?', ['User(r)', 'User(**dict(r))', 'User.from(r)', 'list(r)'], ['User(r)', 'User(**dict(r))', 'User.from(r)', 'list(r)'], 1, '`User(**dict(r))`.', '`User(**dict(r))`.'),
      q('q1210_4', 'Row topilmaganda `fetchone()` nimani qaytaradi?', 'What does `cursor.fetchone()` return when no row matches?', ['[]', 'None', 'KeyError', '{}'], ['[]', 'None', 'KeyError', '{}'], 1, '`None`.', '`None`.'),
      q('q1210_5', 'Repository metodining `delete(id)` muvaffaqiyatli o‘chirganini bilish uchun nima tekshiriladi?', 'How does `Repo.delete(id)` check whether a row actually existed and was deleted?', ['fetchone()', 'cursor.rowcount > 0', 'len(cursor)', 'lastrowid'], ['fetchone()', 'cursor.rowcount > 0', 'len(cursor)', 'lastrowid'], 1, '`cursor.rowcount > 0`.', '`cursor.rowcount > 0`.'),
    ],
    homework: hw('Kurs 12 Yakuniy Loyiha: Typed Wallet Repository', 'Course 12 Capstone: Typed SQLite Wallet Repo', '`PRAGMA foreign_keys = ON`, `CREATE INDEX`, `sqlite3.Row`, `@dataclass` (`Account`, `TxLog`), `AccountRepository` va tashqi `with conn:` Unit of Work orqali xavfsiz pul o‘tkazma servisini yarating.', 'Build the Course 12 capstone: an indexed SQLite ledger with FK audit logs, `AccountRepository` returning `@dataclass` entities, and an atomic transfer service.', ['Repository + @dataclass + Unit of Work', 'PRAGMA foreign_keys=ON + CREATE INDEX + 6 ta assert'], ['Repository + dataclass + UoW', 'FKs + Index + 6 assertions'], 'Pass shared conn to AccountRepo and TxRepo inside with conn:.', 'Clean layered DB code.', 'Kurs 13 (Internet, HTTP va API) ga tayyorlaning.', 'Prepare for HTTP & APIs.', 35),
    reviewCheckpoint: review(
      27,
      'Review Loyiha #27: Kurs 12 (Database & SQL) Bitiruv Marrasi (135-dars!)',
      'Review Project #27: Course 12 Database Capstone (135th Lesson!)',
      '135-dars marrasi! Foreign Key (`PRAGMA foreign_keys = ON`), Index (`EXPLAIN QUERY PLAN`), `JOIN`, `@dataclass` Repository va Atomik Unit of Work ni bitta tizimda ishga tushiring.',
      '135-lesson milestone! Combine FKs, indexed queries, JOINs, and a typed `@dataclass` Repository inside an atomic SQLite Unit of Work.',
      ['`PRAGMA foreign_keys = ON` + `CREATE INDEX`', '`@dataclass` entity qaytaruvchi `BookRepo`', 'Atomik `with conn:` + `LEFT JOIN` hisoboti'],
      ['FK enforcement + Index', 'Typed `BookRepo` returning `@dataclass`', 'Atomic transaction + `LEFT JOIN` summary'],
      `from dataclasses import dataclass
import sqlite3

@dataclass(frozen=True)
class AuthorStats:
    name: str
    books: int

class CatalogRepo:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn
    def summary(self) -> list[AuthorStats]:
        rows = self.conn.execute("""
            SELECT a.name, COUNT(b.id) AS books
            FROM authors a
            LEFT JOIN books b ON b.author_id = a.id
            GROUP BY a.id, a.name
            ORDER BY a.name
        """).fetchall()
        return [AuthorStats(**dict(r)) for r in rows]

c = sqlite3.connect(":memory:")
c.row_factory = sqlite3.Row
c.execute("PRAGMA foreign_keys = ON")
c.execute("CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT UNIQUE)")
c.execute("CREATE TABLE books (id INTEGER PRIMARY KEY, author_id INT REFERENCES authors(id) ON DELETE CASCADE, title TEXT)")
c.execute("CREATE INDEX idx_books_auth ON books(author_id)")
with c:
    c.executemany("INSERT INTO authors (name) VALUES (?)", [("Ali",), ("Zed",)])
    c.execute("INSERT INTO books (author_id, title) VALUES (1, 'SQL Mastery')")
print(CatalogRepo(c).summary())
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),
];
