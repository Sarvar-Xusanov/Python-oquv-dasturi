import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C12_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-12-01',
    courseId: 'databases',
    moduleId: 'c12_m1',
    order: 1,
    titleUz: 'Database nima? RDBMS, NoSQL va ACID xossalari',
    titleEn: 'What Is a Database? RDBMS, NoSQL & ACID Guarantees',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['PY-11-12'],
    conceptId: 'db_intro',
    whyUz: "Dastur yopilganda RAM dagi `dict` va `list` lar o‘chib ketadi; bir vaqtda 50 ta foydalanuvchi bitta JSON faylga yozsa esa fayl buziladi! **Database (Ma’lumotlar Bazasi)** ma’lumotlarni xavfsiz saqlash, bir zumda qidirish va bir vaqtda minglab so‘rovlarni **ACID** kafolati bilan boshqaradi.",
    whyEn: 'Understand why JSON/CSV files break under concurrency and crash recovery, how Relational Databases (RDBMS) enforce ACID guarantees, and when to choose SQL vs NoSQL.',
    analogyUz: "**Oddiy JSON fayl** — hamma bir vaqtda bitta qog‘oz daftarga ruchka bilan yozishi (bir-birini chizib yuboradi!). **RDBMS (PostgreSQL / SQLite)** — har bir operatsiyani navbat, jurnal va qulf bilan nazorat qiladigan bank arxividir!",
    analogyEn: 'Writing directly to a JSON file is like ten clerks scribbling over one notebook; an RDBMS is an ACID-compliant vault coordinating safe concurrent transactions.',
    stopsUz: "Har doim ham NoSQL \"zamonaviyroq\" emas! 90% biznes ilovalarda (foydalanuvchilar, buyurtmalar, to‘lovlar, bog‘liq jadvallar) **RDBMS (PostgreSQL / SQLite)** eng to‘g‘ri tanlov — chunki jadvallararo munosabat va ACID tranzaksiyalar tayyor!",
    stopsEn: 'SQL/RDBMS is not outdated—for relational entities, financial balances, and reporting, PostgreSQL/SQLite’s schema constraints and ACID transactions beat schemaless stores.',
    objUz: ['Fayl saqlash (JSON/CSV) vs RDBMS (SQLite/PostgreSQL) farqini tushunish', 'ACID (Atomicity, Consistency, Isolation, Durability) tamoyillarini bilish', 'RDBMS (Relational) vs NoSQL (Document/Key-Value) tanlash mezonlarini bilish'],
    objEn: ['Contrast raw file storage against relational databases', 'Explain Atomicity, Consistency, Isolation, and Durability (ACID)', 'Choose cleanly between SQL (RDBMS) and NoSQL stores'],
    theoryUz: `### 1. Nima Uchun JSON Fayl Yetarli Emas?
1. Bir vaqtda yozish (Race condition) faylni buzadi.
2. Qidirish uchun butun faylni RAM ga o‘qish kerak (O(n)).
3. Yarim yo‘lda elektr o‘chsa fayl chala qoladi.
### 2. RDBMS Tuzilishi
**Table (Jadval)** -> **Row / Record (Qator)** -> **Column (Ustun)** + qatʼiy Data Type lar.
### 3. ACID Kafolatlari
- **A (Atomicity)**: "Hammasi yoki hech narsa" — pul o‘tkazmada chiqim bo‘lib kirim bo‘lmay qolishiga yo‘l qo‘ymaydi!
- **C (Consistency)**: barcha qoidalar (\`CHECK\`, \`FOREIGN KEY\`) har doim to‘g‘ri qoladi.
- **I (Isolation)**: parallel tranzaksiyalar bir-biriga xalaqit bermaydi.
- **D (Durability)**: \`COMMIT\` bo‘lgan ma’lumot elektr o‘chsa ham diskda saqlanadi.
### 4. SQL vs NoSQL
- **SQL (PostgreSQL, SQLite, MySQL)**: tuzilgan bog‘liq ma’lumotlar, tranzaksiyalar.
- **NoSQL (Redis, MongoDB)**: tezkor kesh (Redis) yoki o‘zgaruvchan sxemali log/hujjatlar.`,
    theoryEn: `### 1. Why Files Fail at Scale
Lack concurrency locks, atomic crash recovery, and indexed lookups.
### 2. Relational Model
Tables (relations) composed of typed Columns and Rows linked via Keys.
### 3. ACID Transactions
**Atomicity** (all-or-nothing), **Consistency** (constraints upheld), **Isolation** (safe concurrency), **Durability** (persisted after commit).
### 4. SQL vs NoSQL
Default to SQL (PostgreSQL/SQLite) for structured relational data; pair with NoSQL (e.g., Redis) for ephemeral caching or unstructured logs.`,
    examples: [
      ex('Misol 1: Python `sqlite3` da ACID Atomicity (`ROLLBACK` vs `COMMIT`)', 'Example 1: ACID Atomicity with sqlite3', `import sqlite3\n\nconn = sqlite3.connect(":memory:")\nconn.execute("CREATE TABLE accounts (name TEXT PRIMARY KEY, bal INT CHECK (bal >= 0))")\nconn.execute("INSERT INTO accounts VALUES ('Ali', 100), ('Vali', 50)")\nconn.commit()\n\ntry:\n    with conn:\n        conn.execute("UPDATE accounts SET bal = bal - 200 WHERE name = 'Ali'")\nexcept sqlite3.IntegrityError:\n    print("Rolled back! Ali balance safe.")\n\nprint(conn.execute("SELECT name, bal FROM accounts ORDER BY name").fetchall())`, `Rolled back! Ali balance safe.\n[('Ali', 100), ('Vali', 50)]`, '`CHECK (bal >= 0)` buzilganda `with conn:` tranzaksiyani avtomatik `ROLLBACK` qildi.', 'A failed constraint inside `with conn:` rolls back automatically, preserving consistency.'),
      ex('Misol 2: Jadval sxemasi va turlarni tekshirish', 'Example 2: Inspecting Table Schema', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL)")\nc.execute("INSERT INTO users (email) VALUES ('a@b.uz')")\nprint(c.execute("SELECT id, email FROM users").fetchall())`, `[(1, 'a@b.uz')]`, 'RDBMS avtomatik `id` va `UNIQUE` nazoratini taʼminlaydi.', 'Relational schemas enforce `PRIMARY KEY` and `UNIQUE` guarantees automatically.'),
      ex('Misol 3: Bir nechta so‘rovni tranzaksiyada guruhlash', 'Example 3: Atomic Transfer', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE w (id INT, bal INT)")\nc.executemany("INSERT INTO w VALUES (?, ?)", [(1, 100), (2, 20)])\nwith c:\n    c.execute("UPDATE w SET bal = bal - 30 WHERE id = 1")\n    c.execute("UPDATE w SET bal = bal + 30 WHERE id = 2")\nprint(c.execute("SELECT * FROM w ORDER BY id").fetchall())`, `[(1, 70), (2, 50)]`, 'Ikkala `UPDATE` bitta atomik tranzaksiyada (`COMMIT`) bajarildi.', 'Both updates commit atomically together.'),
    ],
    traceTitleUz: 'ACID tranzaksiya izi',
    traceTitleEn: 'Tracing Transaction Rollback',
    traceCode: `with conn:\n    conn.execute("UPDATE ...")\n    raise ValueError("fail") # triggers ROLLBACK`,
    traceSteps: [
      traceStep(1, 'BEGIN', 'txn open', 'Tranzaksiya boshlandi', 'Transaction started'),
      traceStep(2, 'UPDATE / Error', 'exception raised', 'Xato yuz berdi', 'Constraint/exception raised'),
      traceStep(3, '__exit__ -> ROLLBACK', 'unchanged', 'Eski holat saqlandi', 'Rolled back safely'),
    ],
    commonMistakes: [
      mistake('`conn.commit()` ni unutib o‘zgarishlarni yo‘qotish', 'Forgetting commit() on Writes', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (x INT)")\nc.execute("INSERT INTO t VALUES (1)")\nc.rollback()\nprint("After rollback:", c.execute("SELECT * FROM t").fetchall())`, 'Empty [] — uncommitted write disappeared!', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (x INT)")\nwith c:\n    c.execute("INSERT INTO t VALUES (1)")\nprint("Committed:", c.execute("SELECT * FROM t").fetchall())`, '`commit()` yoki `with conn:` bo‘lmasa yozuvlar saqlanmaydi.', 'Without `commit()` or `with conn:`, writes stay uncommitted.', '`with conn:` kontekst menejeridan foydalaning.', 'Wrap writes in `with conn:`.'),
      mistake('Real ko‘p foydalanuvchili bazani oddiy `.json` faylga solish', 'Using Plain JSON File as Concurrent Database', `# Two requests reading/writing data.json simultaneously overwrite each other!`, 'Lost updates / corrupted JSON', `print("Use SQLite/PostgreSQL instead of raw JSON for concurrent app state!")`, 'JSON fayllarda qulf va atomik indeks yo‘q.', 'Raw JSON lacks concurrency locks and atomic commits.', 'Doim SQLite yoki PostgreSQL ishlating.', 'Use a real database engine.'),
    ],
    compareTitleUz: 'RDBMS (SQL) vs NoSQL',
    compareTitleEn: 'Relational (SQL) vs NoSQL',
    compareUz: ['RDBMS (PostgreSQL, SQLite): qatʼiy sxema, JOIN lar, ACID tranzaksiyalar — asosiy biznes ma’lumotlari.', 'NoSQL (Redis, MongoDB): tezkor key-value kesh, sessiyalar, o‘zgaruvchan hujjatlar.'],
    compareEn: ['RDBMS: rigid schemas, relational integrity, ACID transactions—default for core apps.', 'NoSQL: ultra-fast KV caches (Redis) or flexible document/event stores.'],
    compareSummaryUz: 'Asosiy ma’lumotlar uchun RDBMS (SQL + ACID) ni tanlang, tez keshlash kerak bo‘lgandagina NoSQL qo‘shing.',
    compareSummaryEn: 'Start with an ACID RDBMS for relational data integrity and pair with NoSQL only where specialized access patterns demand it.',
    practiceTasks: [
      pt('p1201_1', '1-mashq: In-memory `sqlite3` jadval', 'Task 1: Create Memory Table', '`items(id INT, name TEXT)` yaratib `("pen",)` qo‘shing va chiqaring.', 'Create and query in-memory table.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT)")\nc.execute("INSERT INTO items (name) VALUES ('pen')")\nprint(c.execute("SELECT * FROM items").fetchall())`, "[(1, 'pen')]", 'sqlite3.connect(":memory:")', "Prints [(1, 'pen')]."),
      pt('p1201_2', '2-mashq: `CHECK` bilan Consistency', 'Task 2: Check Constraint', '`age INT CHECK (age >= 0)` ga `-1` kiritishda `IntegrityError` tuting.', 'Catch IntegrityError.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE p (age INT CHECK (age >= 0))")\ntry:\n    c.execute("INSERT INTO p VALUES (-1)")\nexcept sqlite3.IntegrityError:\n    print("consistent")`, 'consistent', 'CHECK (age >= 0)', 'Prints consistent.'),
      pt('p1201_3', '3-mashq: Atomik `with conn:` rollback', 'Task 3: Atomic Rollback', '`with c:` ichida `INSERT` qilib keyin `ValueError` chiqaring; jadval bo‘sh qolsin.', 'Verify rollback on error.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (x INT)")\ntry:\n    with c:\n        c.execute("INSERT INTO t VALUES (99)")\n        raise ValueError()\nexcept ValueError:\n    pass\nprint(c.execute("SELECT * FROM t").fetchall())`, '[]', 'with c: rolls back on exception', 'Prints [].'),
      pt('p1201_4', '4-mashq: `UNIQUE` ustun cheklovi', 'Task 4: Unique Email Constraint', 'Ikki marta bir xil email kiritilganda `IntegrityError` ushlang.', 'Test UNIQUE constraint.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (email TEXT UNIQUE)")\nc.execute("INSERT INTO u VALUES ('x@y.uz')")\ntry:\n    c.execute("INSERT INTO u VALUES ('x@y.uz')")\nexcept sqlite3.IntegrityError:\n    print("duplicate blocked")`, 'duplicate blocked', 'UNIQUE constraint', 'Prints duplicate blocked.'),
      pt('p1201_5', '5-mashq: `sqlite3.sqlite_version`', 'Task 5: Check SQLite Availability', '`bool(sqlite3.sqlite_version)` True chiqishini tekshiring.', 'Verify sqlite3 module.', `import sqlite3\nprint(len(sqlite3.sqlite_version) > 0)`, 'True', 'sqlite3 built-in', 'Prints True.'),
    ],
    quiz: [
      q('q1201_1', 'ACID dagi "A" (Atomicity) nimani kafolatlaydi?', 'What does Atomicity in ACID guarantee?', ['Eng tez qidiruv', '"Hammasi bajariladi yoki hech narsa o‘zgarmaydi" (all-or-nothing)', 'Cheksiz xotira', 'Avtomatik shifrlash'], ['Fastest search', 'All operations in a transaction succeed together or roll back completely', 'Infinite RAM', 'Auto encryption'], 1, 'All-or-nothing tranzaksiya.', 'All-or-nothing.'),
      q('q1201_2', 'Bir nechta bog‘liq jadvallar va moliyaviy tranzaksiyalar uchun qaysi baza turi afzal?', 'Preferred database family for structured relational data and financial transactions?', ['Oddiy TXT fayl', 'RDBMS (PostgreSQL / SQLite)', 'CSV', 'LocalStorage'], ['Plain TXT', 'RDBMS (PostgreSQL / SQLite)', 'CSV', 'LocalStorage'], 1, 'RDBMS (SQL).', 'RDBMS.'),
      q('q1201_3', 'Python da tashqi paket o‘rnatmasdan ishlaydigan o‘rnatilgan (built-in) SQL bazasi?', 'Built-in SQL engine included in Python’s standard library?', ['psycopg2', 'sqlite3', 'pymysql', 'sqlalchemy'], ['psycopg2', 'sqlite3', 'pymysql', 'sqlalchemy'], 1, '`sqlite3`.', '`sqlite3`.'),
      q('q1201_4', 'ACID dagi "D" (Durability) nimani anglatadi?', 'What does Durability mean in ACID?', ['`COMMIT` qilingan ma’lumot tizim o‘chsa ham diskda saqlanib qolishi', 'Ma’lumotni o‘chirish', 'Parol qo‘yish', 'Ikki marta saqlash'], ['Committed data survives crashes/power loss', 'Deleting data', 'Passwords', 'Duplication'], 0, 'COMMIT dan keyin ma’lumot yo‘qolmasligi.', 'Persisted across crashes.'),
      q('q1201_5', 'Python `sqlite3` da `with conn:` bloki ichida istisno (Exception) chiqsa nima qiladi?', 'What does `with conn:` do automatically in Python `sqlite3` if an exception occurs?', ['Hech narsa', 'Avtomatik `ROLLBACK` qiladi', 'Diskni formatlaydi', 'Commit qiladi'], ['Nothing', 'Automatically executes `ROLLBACK`', 'Formats disk', 'Commits'], 1, 'Avtomatik `ROLLBACK` qiladi.', 'Automatically rolls back.'),
    ],
    homework: hw('Bank O‘tkazmasi ACID Simulyatori', 'ACID Bank Ledger Simulator', 'SQLite `:memory:` da `accounts(id, owner, balance CHECK (balance >= 0))` jadvalini ochib, `transfer(conn, from_id, to_id, amount)` funksiyasini `with conn:` ichida yozing va manfiy balansga tushganda avtomatik `ROLLBACK` bo‘lishini tekshiring.', 'Build an in-memory SQLite ledger with `transfer(conn, src, dst, amount)` guarded by `CHECK (balance >= 0)` and verify atomic rollback on overdraft.', ['CHECK constraint bilan himoya', 'Muvaffaqiyatli va muvaffaqiyatsiz o‘tkazmalar testi'], ['Enforce CHECK (balance >= 0)', 'Verify both commit and rollback'], 'with conn: update src (-amt), update dst (+amt)', 'Atomic transaction block.', 'Tranzaksiyalar tarixi (`ledger_logs`) jadvalini ham qo‘shing.', 'Add audit log table.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-12-02',
    courseId: 'databases',
    moduleId: 'c12_m1',
    order: 2,
    titleUz: 'SQL asoslari va Schema DDL (Turlar va Cheklovlar)',
    titleEn: 'SQL Fundamentals & Schema Design (DDL, Types & Constraints)',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['PY-12-01'],
    conceptId: 'db_sql_ddl',
    whyUz: "Dastur kodi bir yilda 10 marta o‘zgarishi mumkin, lekin **ma’lumotlar bazasi sxemasi (Schema)** yillar davomida saqlanadi! Noto‘g‘ri tanlangan ustun turi (masalan pulni `REAL/FLOAT` da saqlash yoki `NOT NULL` qo‘ymaslik) keyinchalik millionlab buzilgan qatorlarga olib keladi.",
    whyEn: 'Design clean relational schemas using DDL (`CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`), choosing exact data types (integer cents vs floats) and strict constraints (`NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`).',
    analogyUz: "**Schema DDL** — bu binoning temir-beton karkasi va xavfsizlik qoidalari: eshik o‘lchami (`TEXT`), majburiy maydon (`NOT NULL`) va ruxsat etilgan diapazon (`CHECK`) avvaldan quyiladi!",
    analogyEn: 'Schema DDL is the structural concrete blueprint—enforcing valid data types and constraints before a single row enters.',
    stopsUz: "Pul (narx, balans) qiymatlarini hech qachon `REAL` / `FLOAT` da saqlamang (`0.1 + 0.2 != 0.3`!) — SQLite da `INTEGER` (tiyin/cent) yoki PostgreSQL da `NUMERIC(12, 2)` ishlating! Sana/vaqtlar uchun esa ISO-8601 (`'2026-11-20T12:00:00Z'`) yoki `TIMESTAMPTZ` ishlating.",
    stopsEn: 'Never store currency as floating-point `REAL`/`FLOAT`; use integer minor units (`price_cents INTEGER`) or `DECIMAL`/`NUMERIC`. Always enforce `NOT NULL` and `DEFAULT` explicitly.',
    objUz: ['SQL buyruq guruhlari: **DDL** (CREATE/ALTER/DROP) vs **DML** (INSERT/UPDATE/DELETE) vs **DQL** (SELECT) ni bilish', 'SQLite/SQL turlari (`INTEGER`, `TEXT`, `REAL`, `BLOB`) va `NUMERIC` / integer-cents qoidasini qo‘llash', '`PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`, `CREATE TABLE IF NOT EXISTS` yozish'],
    objEn: ['Distinguish DDL, DML, and DQL command families', 'Pick accurate SQL column types (integer cents over floats)', 'Enforce `NOT NULL`, `UNIQUE`, `CHECK`, and `DEFAULT` constraints'],
    theoryUz: `### 1. SQL Tilining 3 Asosiy Qismi
- **DDL (Data Definition Language)**: jadval tuzish/o‘zgartirish (\`CREATE\`, \`ALTER\`, \`DROP\`).
- **DML (Data Manipulation Language)**: ma’lumot yozish (\`INSERT\`, \`UPDATE\`, \`DELETE\`).
- **DQL (Data Query Language)**: o‘qish (\`SELECT\`).
### 2. SQLite Ustun Turlari
\`INTEGER\`, \`TEXT\`, \`REAL\`, \`BLOB\`, \`NUMERIC\`. (Pul uchun \`INTEGER\` tiyin/cent!).
### 3. Muhim Cheklovlar (Constraints)
- \`INTEGER PRIMARY KEY\`: avtomatik ortuvchi noyob ID.
- \`NOT NULL\`: \`NULL\` qabul qilmaydi.
- \`UNIQUE\`: takrorlanishni taqiqlaydi.
- \`CHECK (price_cents > 0)\`: domen qoidasi.
- \`DEFAULT CURRENT_TIMESTAMP\`: avtomatik sana.
### 4. \`CREATE TABLE IF NOT EXISTS\`
Skript qayta ishga tushganda \`table already exists\` xatosini oldini oladi.`,
    theoryEn: `### 1. SQL Sub-languages
**DDL** defines schema (\`CREATE\`, \`ALTER\`, \`DROP\`); **DML** mutates rows (\`INSERT\`, \`UPDATE\`, \`DELETE\`); **DQL** queries (\`SELECT\`).
### 2. Data Types & Currency Rule
Use \`INTEGER\` minor units (cents/tiyin) instead of \`REAL\` floats for exact money arithmetic.
### 3. Column Constraints
\`PRIMARY KEY\`, \`NOT NULL\`, \`UNIQUE\`, \`CHECK (...)\`, and \`DEFAULT ...\`.
### 4. Idempotent DDL
\`CREATE TABLE IF NOT EXISTS\` prevents crashes on repeated initialization.`,
    examples: [
      ex('Misol 1: To‘liq Cheklovli `products` Jadvali', 'Example 1: Strict DDL with Constraints', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("""\nCREATE TABLE IF NOT EXISTS products (\n    id INTEGER PRIMARY KEY,\n    sku TEXT UNIQUE NOT NULL,\n    price_cents INTEGER NOT NULL CHECK (price_cents > 0),\n    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)\n)\n""")\nc.execute("INSERT INTO products (sku, price_cents) VALUES (?, ?)", ("BK-01", 45000))\nprint(c.execute("SELECT sku, price_cents, stock FROM products").fetchall())`, `[('BK-01', 45000, 0)]`, '`DEFAULT 0` tufayli `stock` avtomatik `0` bo‘ldi, `price_cents` esa integer cent da aniq saqlandi.', '`DEFAULT` populated `stock = 0` while `price_cents` stores exact integer currency.'),
      ex('Misol 2: `ALTER TABLE` bilan yangi ustun qo‘shish', 'Example 2: Adding a Column with ALTER TABLE', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL)")\nc.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'student'")\nc.execute("INSERT INTO users (name) VALUES ('Malika')")\nprint(c.execute("SELECT id, name, role FROM users").fetchall())`, `[(1, 'Malika', 'student')]`, 'Mavjud jadvalga `ALTER TABLE ... ADD COLUMN` bilan yangi ustun qo‘shish uchun `DEFAULT` beriladi.', 'Adding a `NOT NULL` column to an existing table pairs cleanly with `DEFAULT`.'),
      ex('Misol 3: `PRAGMA table_info()` bilan sxemani tekshirish', 'Example 3: Inspecting Table Metadata', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (id INTEGER PRIMARY KEY, code TEXT NOT NULL)")\nprint([(r[1], r[2], r[3]) for r in c.execute("PRAGMA table_info(t)")])`, `[('id', 'INTEGER', 0), ('code', 'TEXT', 1)]`, '`PRAGMA table_info` ustun nomlari, turlari va `notnull` holatini ko‘rsatadi.', '`PRAGMA table_info` returns `(cid, name, type, notnull, dflt_value, pk)`.'),
    ],
    traceTitleUz: 'DDL constraint tekshiruv izi',
    traceTitleEn: 'Tracing DDL Defaults & Checks',
    traceCode: `INSERT INTO products (sku, price_cents) VALUES ('BK-01', 45000)`,
    traceSteps: [
      traceStep(1, 'CHECK price_cents > 0', '45000 > 0 (OK)', 'Musbat narx tasdiqlandi', 'Passed CHECK'),
      traceStep(2, 'DEFAULT stock', 'stock = 0', 'Standart qiymat qo‘yildi', 'Applied DEFAULT 0'),
      traceStep(3, 'PRIMARY KEY id', 'id = 1', 'Avtomatik ID berildi', 'Auto-assigned id=1'),
    ],
    commonMistakes: [
      mistake('Pul qiymatlarini `REAL` / `FLOAT` ustunda saqlash', 'Storing Money in Floating-Point REAL Columns', `# 0.1 + 0.2 == 0.30000000000000004 breaks exact financial balances!`, 'Rounding drift in accounting', `print("Store money in INTEGER cents/tiyin or NUMERIC(12, 2)!")`, 'Ikkilik suzuvchi vergulli sonlar o‘nlik kasrlarni aniq ifodalay olmaydi.', 'Binary floats lose decimal precision on cents.', 'Doim `INTEGER` (tiyin/cent) yoki `NUMERIC` ishlating.', 'Use integer minor units or `NUMERIC`.'),
      mistake('`NOT NULL` yozmay muhim ustunlarga `NULL` kirib qolishiga yo‘l qo‘yish', 'Leaving Required Columns Nullable', `# Nullable email/price columns force None checks everywhere in Python!`, 'Unexpected None values in queries', `print("Mark required columns NOT NULL by default!")`, 'Default bo‘yicha SQL ustunlari `NULL` ruxsat etadi.', 'SQL columns allow `NULL` unless `NOT NULL` is specified.', 'Majburiy ustunlarga `NOT NULL` qo‘ying.', 'Add `NOT NULL` explicitly.'),
    ],
    compareTitleUz: 'DDL vs DML vs DQL',
    compareTitleEn: 'DDL vs DML vs DQL',
    compareUz: ['DDL (`CREATE`, `ALTER`, `DROP`): jadval tuzilmasi va cheklovlarini belgilaydi.', 'DML (`INSERT`, `UPDATE`, `DELETE`): qatorlarni qo‘shadi, tahrirlaydi, o‘chiradi.', 'DQL (`SELECT`): ma’lumotlarni o‘qiydi va tahlil qiladi.'],
    compareEn: ['DDL: defines schema and constraints.', 'DML: mutates row records.', 'DQL: reads and aggregates data.'],
    compareSummaryUz: 'Sxema loyihalashda `IF NOT EXISTS`, `NOT NULL`, `CHECK` va pul uchun `INTEGER` tiyin/cent qoidasiga amal qiling.',
    compareSummaryEn: 'Design schemas with `NOT NULL`, `CHECK`, `UNIQUE`, and integer minor units for money.',
    practiceTasks: [
      pt('p1202_1', '1-mashq: `CREATE TABLE IF NOT EXISTS`', 'Task 1: Idempotent Table Create', 'Ikki marta `CREATE TABLE IF NOT EXISTS` ishlatib xatosiz jadval oching.', 'Run idempotent CREATE.', `import sqlite3\nc = sqlite3.connect(":memory:")\nfor _ in range(2):\n    c.execute("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY, msg TEXT NOT NULL)")\nprint("ok")`, 'ok', 'IF NOT EXISTS', 'Prints ok.'),
      pt('p1202_2', '2-mashq: `DEFAULT` qiymat', 'Task 2: Default Status Column', '`status TEXT NOT NULL DEFAULT \'active\'` ustuni bilan qator qo‘shing.', 'Use DEFAULT value.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active')")\nc.execute("INSERT INTO u (name) VALUES ('Ali')")\nprint(c.execute("SELECT * FROM u").fetchall())`, "[('Ali', 'active')]", 'DEFAULT \'active\'', "Prints [('Ali', 'active')]."),
      pt('p1202_3', '3-mashq: `NOT NULL` himoyasi', 'Task 3: NOT NULL Guard', '`NOT NULL` ustunga `None` kiritishda `IntegrityError` ushlang.', 'Trigger IntegrityError.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (code TEXT NOT NULL)")\ntry:\n    c.execute("INSERT INTO t VALUES (?)", (None,))\nexcept sqlite3.IntegrityError:\n    print("null blocked")`, 'null blocked', 'NOT NULL rejects None', 'Prints null blocked.'),
      pt('p1202_4', '4-mashq: `ALTER TABLE ADD COLUMN`', 'Task 4: Alter Table', '`books(title)` jadvaliga `year INT DEFAULT 2026` qo‘shing.', 'Add column with ALTER TABLE.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE b (title TEXT)")\nc.execute("INSERT INTO b VALUES ('Py')")\nc.execute("ALTER TABLE b ADD COLUMN year INT NOT NULL DEFAULT 2026")\nprint(c.execute("SELECT * FROM b").fetchall())`, "[('Py', 2026)]", 'ALTER TABLE b ADD COLUMN ...', "Prints [('Py', 2026)]."),
      pt('p1202_5', '5-mashq: `DROP TABLE IF EXISTS`', 'Task 5: Safe Drop Table', 'Mavjud bo‘lmagan jadvalni `DROP TABLE IF EXISTS temp` bilan xatosiz o‘chiring.', 'Safe drop.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("DROP TABLE IF EXISTS temp")\nprint("clean")`, 'clean', 'DROP TABLE IF EXISTS', 'Prints clean.'),
    ],
    quiz: [
      q('q1202_1', '`CREATE TABLE`, `ALTER TABLE` va `DROP TABLE` SQL ning qaysi guruhiga kiradi?', 'Which SQL sub-language includes `CREATE`, `ALTER`, and `DROP`?', ['DML', 'DDL (Data Definition Language)', 'DQL', 'DCL'], ['DML', 'DDL (Data Definition Language)', 'DQL', 'DCL'], 1, 'DDL.', 'DDL.'),
      q('q1202_2', 'Moliyaviy summa/narxlarni SQLite/SQL da saqlashning eng aniq usuli?', 'Most exact way to store monetary amounts in SQL?', ['FLOAT / REAL', 'INTEGER (tiyin/cent) yoki NUMERIC/DECIMAL', 'BOOLEAN', 'BLOB'], ['FLOAT / REAL', 'INTEGER (cents) or NUMERIC/DECIMAL', 'BOOLEAN', 'BLOB'], 1, '`INTEGER` (minor units) yoki `NUMERIC`.', 'Integer cents or `NUMERIC`.'),
      q('q1202_3', 'Qayta ishga tushganda "table already exists" xatosini oldini olish sintaksisi?', 'Clause preventing errors if a table already exists?', ['CREATE OR IGNORE', 'CREATE TABLE IF NOT EXISTS', 'CREATE SAFE TABLE', 'TRY CREATE'], ['CREATE OR IGNORE', 'CREATE TABLE IF NOT EXISTS', 'CREATE SAFE TABLE', 'TRY CREATE'], 1, '`CREATE TABLE IF NOT EXISTS`.', '`CREATE TABLE IF NOT EXISTS`.'),
      q('q1202_4', 'Ustunga bo‘sh (`NULL`) qiymat kiritilishini taqiqlovchi cheklov?', 'Constraint forbidding `NULL` values in a column?', ['UNIQUE', 'NOT NULL', 'CHECK', 'DEFAULT'], ['UNIQUE', 'NOT NULL', 'CHECK', 'DEFAULT'], 1, '`NOT NULL`.', '`NOT NULL`.'),
      q('q1202_5', 'SQLite da `PRAGMA table_info(tbl)` nima qaytaradi?', 'What does `PRAGMA table_info(tbl)` return in SQLite?', ['Barcha qatorlarni', 'Jadval ustunlari sxemasi va turlarini', 'Foydalanuvchi parolini', 'Loglarni'], ['All rows', 'Column names, types, NOT NULL, defaults, and PK metadata', 'Passwords', 'Logs'], 1, 'Ustunlar sxemasi metadata sini.', 'Table column metadata.'),
    ],
    homework: hw('E-Commerce Sxema DDL Loyihasi', 'E-Commerce Schema DDL', 'SQLite da `customers`, `products` (`price_cents CHECK > 0`) va `orders` (`status DEFAULT \'pending\'`) jadvallarini DDL bilan tuzing, `PRAGMA table_info` orqali sxemani chop eting va cheklovlarni `IntegrityError` bilan sinang.', 'Author DDL for `customers`, `products`, and `orders` with `NOT NULL`, `UNIQUE`, `CHECK`, and `DEFAULT`, then verify constraints raise `IntegrityError` on invalid inserts.', ['3 ta jadval DDL bilan', 'IntegrityError tekshiruvlari'], ['3 tables with strict constraints', 'Constraint violation tests'], 'Use CREATE TABLE IF NOT EXISTS ...', 'Test negative prices & duplicate emails.', 'Migratsiya sifatida `ALTER TABLE` bilan `phone` ustunini qo‘shing.', 'Add a column via ALTER TABLE.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-12-03',
    courseId: 'databases',
    moduleId: 'c12_m1',
    order: 3,
    titleUz: 'CREATE, INSERT, UPDATE, DELETE (CRUD) va SQL Injection Himoyasi',
    titleEn: 'CRUD Operations (INSERT, UPDATE, DELETE) & Parameterized Queries',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-12-02'],
    conceptId: 'db_crud',
    whyUz: "Har qanday backend dasturning 4 ta asosi — **CRUD** (Create, Read, Update, Delete). Lekin SQL so‘rovlarni f-string `f\"... WHERE name = '{user}'\"` bilan yozish dunyodagi №1 xavfsizlik teshigi — **SQL Injection** ga olib keladi! Va `WHERE` siz `UPDATE`/`DELETE` yozish esa butun jadvalni yo‘q qiladi!",
    whyEn: 'Perform Create, Read, Update, and Delete operations safely with parameterized placeholders (`?` / `%s`), `executemany()`, and `RETURNING`, while preventing SQL Injection and unguarded `DELETE`s.',
    analogyUz: "**f-string SQL**: foydalanuvchi kiritgan xatni buyruq qog‘oziga yopishtirib ijrochiga berish (xat ichiga \"hamma jadvalni o‘chir!\" deb yozsa ijrochi bajarib yuboradi!). **Parameterized query (`?`)**: buyruq shabloni alohida, ma’lumot esa muhrlangan konvertda alohida beriladi — hech qachon kod sifatida o‘qilmaydi!",
    analogyEn: 'String-interpolated SQL mixes user text into executable commands (SQL Injection); parameterized `?` placeholders pass data separately so it is never parsed as SQL syntax.',
    stopsUz: "2 ta qatʼiy qonun: 1) **ASLO `f\"... {var}\"` bilan SQL yozmang** — har doim **`conn.execute(\"SELECT ... WHERE id = ?\", (uid,))`** (1 elementli tuple da vergulni unutmang `(uid,)`!) yozing. 2) **`UPDATE` va `DELETE` dan oldin doim `WHERE` shartini tekshiring** (hatto avval `SELECT` bilan nechta qator tushishini ko‘ring!).",
    stopsEn: 'NEVER format user input into SQL strings—always pass `(val,)` parameter tuples (note the trailing comma for 1-tuples!). NEVER run `UPDATE` or `DELETE` without verifying the `WHERE` clause.',
    objUz: ['`INSERT INTO ... VALUES (?)`, `executemany()`, `UPDATE ... SET ... WHERE` va `DELETE FROM ... WHERE` yozish', 'SQL Injection hujumi qanday ishlashini va `?` parametrlari uni 100% to‘xtatishini ko‘rish', '`RETURNING id` va `cursor.rowcount` bilan natija olish'],
    objEn: ['Execute `INSERT`, `executemany`, `UPDATE`, and `DELETE` safely', 'Demonstrate SQL Injection defense with `?` parameter binding', 'Retrieve created IDs via `lastrowid` / `RETURNING` and count mutations with `rowcount`'],
    theoryUz: `### 1. \`INSERT INTO\` va \`executemany\`
\`INSERT INTO users (name, age) VALUES (?, ?)\` — ustun nomlarini doim aniq ko‘rsating! Ko‘p qator uchun \`conn.executemany(...)\` ancha tez.
### 2. \`UPDATE\` va \`DELETE\` (+ \`WHERE\` Qoidasi!)
\`\`\`sql
UPDATE accounts SET balance = balance + 100 WHERE id = ?;
DELETE FROM sessions WHERE expired = 1;
\`\`\`
\`WHERE\` bo‘lmasa **jadvaldagi BARCHA qatorlar** o‘zgaradi yoki o‘chadi!
### 3. SQL Injection & Parameterized Queries
\`"Ali' OR '1'='1"\` kabi kirish f-string da hamma ma’lumotni ochib beradi; \`(user_input,)\` parametrida esa u oddiy matn sifatida qidiriladi!
### 4. \`RETURNING\` (SQLite 3.35+ / PostgreSQL)
\`INSERT INTO ... VALUES (?) RETURNING id\` — qo‘shilgan ID ni bitta so‘rovda qaytaradi.`,
    theoryEn: `### 1. \`INSERT\` & \`executemany\`
Always list explicit target columns; batch bulk inserts with \`executemany()\`.
### 2. \`UPDATE\` & \`DELETE\`
Always include a selective \`WHERE\` clause; inspect \`cursor.rowcount\` to confirm affected rows.
### 3. Preventing SQL Injection
Use \`?\` (SQLite) or \`%s\` / \`$1\` (Postgres) parameter bindings—never f-strings or \`+\` concatenation.
### 4. \`RETURNING\` & \`lastrowid\`
Fetch generated primary keys cleanly in the same statement via \`RETURNING id\`.`,
    examples: [
      ex('Misol 1: To‘liq CRUD + `RETURNING` va `rowcount`', 'Example 1: Parameterized CRUD Lifecycle', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL, done INT DEFAULT 0)")\n\nnew_id = c.execute("INSERT INTO tasks (title) VALUES (?) RETURNING id", ("Learn SQL",)).fetchone()[0]\nc.executemany("INSERT INTO tasks (title) VALUES (?)", [("Build API",), ("Write Tests",)])\ncur = c.execute("UPDATE tasks SET done = 1 WHERE id = ?", (new_id,))\nprint("Inserted id:", new_id, "| Updated rows:", cur.rowcount)\nc.execute("DELETE FROM tasks WHERE id = ?", (3,))\nprint(c.execute("SELECT id, title, done FROM tasks ORDER BY id").fetchall())`, `Inserted id: 1 | Updated rows: 1\n[(1, 'Learn SQL', 1), (2, 'Build API', 0)]`, 'Yaratish, ommaviy qo‘shish, yangilash va o‘chirish hammasi `?` parametrlari bilan xavfsiz bajarildi.', 'CRUD operations using `RETURNING`, `executemany()`, `rowcount`, and `?` bindings.'),
      ex('Misol 2: SQL Injection himoyasi (`?` vs f-string)', 'Example 2: Blocking SQL Injection', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE users (name TEXT, secret TEXT)")\nc.execute("INSERT INTO users VALUES ('admin', 'TOP_SECRET')")\n\npayload = "' OR '1'='1"\nsafe_rows = c.execute("SELECT secret FROM users WHERE name = ?", (payload,)).fetchall()\nprint("Safe parameterized result:", safe_rows)`, `Safe parameterized result: []`, 'Hujumchi `\' OR \'1\'=\'1` kiritsa ham `?` uni oddiy matn deb qabul qilib `[]` qaytardi!', 'Parameterization treats the injection payload strictly as literal text, returning `[]`.'),
      ex('Misol 3: `INSERT ... ON CONFLICT DO UPDATE` (Upsert)', 'Example 3: SQLite Upsert Pattern', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE stats (tag TEXT PRIMARY KEY, hits INT)")\nfor t in ["py", "sql", "py"]:\n    c.execute("INSERT INTO stats VALUES (?, 1) ON CONFLICT(tag) DO UPDATE SET hits = hits + 1", (t,))\nprint(c.execute("SELECT * FROM stats ORDER BY tag").fetchall())`, `[('py', 2), ('sql', 1)]`, 'Upsert bitta so‘rovda bor kalitni yangilaydi, yo‘q bo‘lsa yangi qo‘shadi.', '`ON CONFLICT ... DO UPDATE` handles insert-or-increment atomically.'),
    ],
    traceTitleUz: 'Parametrli CRUD izi',
    traceTitleEn: 'Tracing Parameter Binding',
    traceCode: `c.execute("UPDATE tasks SET done = ? WHERE id = ?", (1, 2))`,
    traceSteps: [
      traceStep(1, 'Compile SQL template', '2 placeholders (?, ?)', 'SQL shablon ajratib olindi', 'Prepared SQL AST'),
      traceStep(2, 'Bind (1, 2)', '?1=1, ?2=2', 'Ma’lumotlar alohida bog‘landi', 'Bound literal params safely'),
      traceStep(3, 'Execute', 'rowcount=1', 'Faqat id=2 yangilandi', 'Updated matching row'),
    ],
    commonMistakes: [
      mistake('f-string bilan SQL so‘rov yasash (SQL Injection!)', 'Interpolating User Input via f-Strings', `# f"SELECT * FROM users WHERE name = '{user_input}'" allows ' OR '1'='1 attacks!`, 'Critical SQL Injection vulnerability', `print("ALWAYS pass (val,) tuples to execute(sql, params)!")`, 'Foydalanuvchi matni SQL sintaksisiga qo‘shilib ketadi.', 'String interpolation mixes untrusted text into SQL syntax.', '`execute("... WHERE name = ?", (val,))` yozing.', 'Always use parameterized `?` placeholders.'),
      mistake('1 elementli parametr tuple da vergulni unutish: `(uid)` vs `(uid,)`', 'Missing Trailing Comma in 1-Element Tuple', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (id INT)")\ntry:\n    c.execute("SELECT * FROM t WHERE id = ?", ("abc"))  # Treated as 3 chars ('a','b','c')!\nexcept sqlite3.ProgrammingError as e:\n    print("ProgrammingError:", e)`, 'ProgrammingError: Incorrect number of bindings supplied', `print("Always write a trailing comma: (uid,)!")`, 'Python da `("abc")` — tuple emas, oddiy `str` (3 ta belgi!); `("abc",)` esa 1 elementli tuple!', 'Without a trailing comma, `("abc")` is a 3-character string, not a 1-tuple.', '1 ta parametrda `(val,)` deb vergul qo‘ying.', 'Include the trailing comma `(val,)`.'),
    ],
    compareTitleUz: 'Soft Delete (`deleted_at`) vs Hard `DELETE`',
    compareTitleEn: 'Soft Delete vs Hard `DELETE`',
    compareUz: ['Soft Delete (`UPDATE ... SET is_deleted = 1`): audit, tiklash va tashqi kalitlarni saqlash uchun (buyurtma/foydalanuvchi).', 'Hard `DELETE`: kesh, vaqtinchalik token/sessiyalar yoki GDPR o‘chirish talabi bo‘lganda.'],
    compareEn: ['Soft Delete: preserves audit history and foreign key integrity.', 'Hard `DELETE`: reclaims space for ephemeral sessions/logs or GDPR erasure.'],
    compareSummaryUz: 'CRUD da har doim `?` parametrli tuple (`(x,)`) va `UPDATE`/`DELETE` da majburiy `WHERE` ishlating.',
    compareSummaryEn: 'Never build SQL with f-strings—always bind `(val,)` tuples and guard every `UPDATE`/`DELETE` with `WHERE`.',
    practiceTasks: [
      pt('p1203_1', '1-mashq: `INSERT ... RETURNING`', 'Task 1: Insert with RETURNING', '`notes(id, text)` ga yozuv qo‘shib `RETURNING id` ni chiqaring.', 'Use RETURNING id.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE n (id INTEGER PRIMARY KEY, txt TEXT)")\nrid = c.execute("INSERT INTO n (txt) VALUES (?) RETURNING id", ("hi",)).fetchone()[0]\nprint(rid)`, '1', 'RETURNING id', 'Prints 1.'),
      pt('p1203_2', '2-mashq: `executemany` bilan 3 qator', 'Task 2: Bulk executemany', '`executemany` bilan 3 ta son qo‘shib `COUNT(*)` ni chiqaring.', 'Bulk insert rows.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE n (v INT)")\nc.executemany("INSERT INTO n VALUES (?)", [(10,), (20,), (30,)])\nprint(c.execute("SELECT COUNT(*) FROM n").fetchone()[0])`, '3', 'List of 1-tuples [(10,), ...]', 'Prints 3.'),
      pt('p1203_3', '3-mashq: `UPDATE ... WHERE` + `rowcount`', 'Task 3: Update & Check rowcount', 'Faqat `id=2` ni yangilab `cur.rowcount` ni chiqaring.', 'Update row 2.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (id INT, v INT)")\nc.executemany("INSERT INTO t VALUES (?, ?)", [(1, 0), (2, 0)])\ncur = c.execute("UPDATE t SET v = 9 WHERE id = ?", (2,))\nprint(cur.rowcount, c.execute("SELECT v FROM t WHERE id=2").fetchone()[0])`, '1 9', 'WHERE id = ?', 'Prints 1 9.'),
      pt('p1203_4', '4-mashq: `DELETE ... WHERE`', 'Task 4: Safe Delete', '`v < 0` qatorlarni o‘chirib qolganlarini chiqaring.', 'Delete negative rows.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (v INT)")\nc.executemany("INSERT INTO t VALUES (?)", [(-5,), (10,)])\nc.execute("DELETE FROM t WHERE v < ?", (0,))\nprint(c.execute("SELECT v FROM t").fetchall())`, '[(10,)]', 'DELETE FROM t WHERE v < ?', 'Prints [(10,)].'),
      pt('p1203_5', '5-mashq: Upsert `ON CONFLICT`', 'Task 5: Atomic Upsert', '`k="hits"` uchun 2 marta Upsert ishlatib qiymat `2` bo‘lishini ko‘ring.', 'Upsert counter.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE m (k TEXT PRIMARY KEY, c INT)")\nfor _ in range(2):\n    c.execute("INSERT INTO m VALUES ('hits', 1) ON CONFLICT(k) DO UPDATE SET c = c + 1")\nprint(c.execute("SELECT c FROM m").fetchone()[0])`, '2', 'ON CONFLICT(k) DO UPDATE', 'Prints 2.'),
    ],
    quiz: [
      q('q1203_1', 'SQL so‘rovlarni `f"SELECT * FROM u WHERE name = \'{x}\'"` deb yozish qaysi hujumga ochiq?', 'Vulnerability caused by formatting user strings directly into SQL?', ['XSS', 'SQL Injection', 'CSRF', 'Buffer Overflow'], ['XSS', 'SQL Injection', 'CSRF', 'Buffer Overflow'], 1, 'SQL Injection.', 'SQL Injection.'),
      q('q1203_2', 'Python `sqlite3` da bitta parametr uzatishda qaysi yozuv to‘g‘ri?', 'Correct parameter binding for a single value `uid` in `sqlite3`?', ['(uid)', '(uid,)', '[uid] -> str', '{uid}'], ['(uid)', '(uid,)', '[uid] -> str', '{uid}'], 1, 'Oxirida vergulli 1-tuple: `(uid,)`.', 'Trailing comma 1-tuple `(uid,)`.'),
      q('q1203_3', '`DELETE FROM users` so‘rovi `WHERE` shartisiz ishlatilsa nima bo‘ladi?', 'What happens if you run `DELETE FROM users;` without a `WHERE` clause?', ['Xato beradi', 'Jadvaldagi BARCHA qatorlarni o‘chirib yuboradi', 'Oxirgi qatorni o‘chiradi', 'Hech narsa'], ['Raises error', 'Deletes EVERY row in the table', 'Deletes last row', 'Nothing'], 1, 'Jadvaldagi barcha qatorlar o‘chib ketadi!', 'Deletes all rows!'),
      q('q1203_4', 'Ko‘p qatorlarni bitta tsiklda tez qo‘shish uchun qaysi `sqlite3` metodi ishlatiladi?', 'Efficient `sqlite3` method for bulk inserts?', ['executeall()', 'executemany()', 'executescript()', 'insertmany()'], ['executeall()', 'executemany()', 'executescript()', 'insertmany()'], 1, '`executemany()`.', '`executemany()`.'),
      q('q1203_5', '`UPDATE` yoki `DELETE` nechta qatorni o‘zgartirganini qaysi atribut ko‘rsatadi?', 'Cursor attribute reporting how many rows an `UPDATE`/`DELETE` modified?', ['cur.len', 'cur.rowcount', 'cur.affected', 'cur.total'], ['cur.len', 'cur.rowcount', 'cur.affected', 'cur.total'], 1, '`cur.rowcount`.', '`cur.rowcount`.'),
    ],
    homework: hw('Xavfsiz Vazifalar (Todo) CRUD Moduli', 'Parameterized Todo CRUD Store', '`TodoStore` klassini `sqlite3` ustida to‘liq `?` parametrli `add()`, `mark_done()`, `delete()` va `list_all()` metodlari bilan yozing hamda SQL Injection payload (`\' OR 1=1 --`) bilan xavfsizligini test qiling.', 'Build a parameterized `TodoStore` backed by SQLite with `add`, `mark_done`, `delete`, and `list_all`, plus an assertion proving SQL Injection strings are safely neutralized.', ['Barcha SQL so‘rovlar ? parametrli', 'SQL Injection testi'], ['100% parameterized SQL', 'SQL injection test'], 'Never concatenate strings into SQL.', 'Use `?` everywhere.', '`ON CONFLICT` bilan tag hisoblagichini qo‘shing.', 'Add an upsert tag counter.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-12-04',
    courseId: 'databases',
    moduleId: 'c12_m2',
    order: 4,
    titleUz: 'SELECT, WHERE, LIKE, IN, BETWEEN va Pagination (LIMIT/OFFSET)',
    titleEn: 'Querying Data: SELECT, WHERE, LIKE, IN, BETWEEN & Pagination',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['PY-12-03'],
    conceptId: 'db_select_where',
    whyUz: "Production bazada 10 million ta qator bo‘lishi mumkin — `SELECT * FROM orders` deb hammasini Python ga tortish server xotirasini portlatadi! **SQL DQL (`SELECT`, `WHERE`, `IN`, `LIKE`, `IS NULL`, `LIMIT/OFFSET`)** yordamida bazaning o‘zida aniq filtrlash va sahifalashni bajarish kerak.",
    whyEn: 'Filter and paginate datasets efficiently inside the database using `SELECT`, `DISTINCT`, `WHERE`, `IS NULL`, `IN`, `BETWEEN`, `LIKE` wildcards, and `LIMIT`/`OFFSET`.',
    analogyUz: "`SELECT *` — kutubxonadan barcha 1 million kitobni uyga olib kelib, keyin ichidan bittasini qidirish. **`WHERE` + `LIMIT`** — kutubxonachiga aniq muallif va sahifa raqamini aytib, faqat kerakli 10 ta kitobni oldirish!",
    analogyEn: 'Fetching `SELECT *` into Python is hauling every book home to read two pages; `WHERE` and `LIMIT` ask the database to return only the exact slice you need.',
    stopsUz: "SQL da 3 ta klassik tuzoq: 1) **`= NULL` ASLO ishlamaydi!** `NULL` ni tekshirish uchun faqat **`IS NULL`** yoki **`IS NOT NULL`** yozing (`NULL = NULL` SQL da `UNKNOWN/False`!). 2) **`SELECT *`** o‘rniga kerakli ustunlarni aniq sanang. 3) `LIMIT` dan oldin deterministik natija uchun doim **`ORDER BY`** yozing!",
    stopsEn: 'Never write `WHERE col = NULL` (always returns no rows in 3-valued SQL logic)—use `IS NULL` / `IS NOT NULL`. Always pair `LIMIT`/`OFFSET` with `ORDER BY` for deterministic pagination.',
    objUz: ['Aniq ustunlar tanlash (`SELECT col1, col2`), `AS` alias va `DISTINCT`', '`WHERE` da `AND/OR`, `IN`, `BETWEEN`, `LIKE` (`%`, `_`) va `IS NULL` ishlatish', '`ORDER BY ... LIMIT ? OFFSET ?` bilan sahifalash (Pagination) yozish'],
    objEn: ['Select explicit columns with `AS` aliases and `DISTINCT`', 'Filter with `IN`, `BETWEEN`, `LIKE`, and `IS NULL`/`IS NOT NULL`', 'Paginate deterministically using `ORDER BY ... LIMIT ? OFFSET ?`'],
    theoryUz: `### 1. SQL So‘rovining Mantiqiy Bajarilish Tartibi
Yozilishi: \`SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...\`.
Lekin baza aslida bajaradi: **\`FROM\` -> \`WHERE\` -> \`SELECT\` -> \`DISTINCT\` -> \`ORDER BY\` -> \`LIMIT\`**!
### 2. \`IS NULL\` Qoidasi (3-Valued Logic)
\`col = NULL\` har doim nomaʼlum (\`UNKNOWN\`) qaytaradi! Faqat \`WHERE deleted_at IS NULL\` to‘g‘ri ishlaydi.
### 3. \`LIKE\`, \`IN\`, \`BETWEEN\`
- \`LIKE 'py%'\`: \`%\` (0+ belgi), \`_\` (aniq 1 belgi).
- \`IN ('paid', 'shipped')\`: ro‘yxat ichidan tekshirish.
- \`BETWEEN 10 AND 20\`: ikkala chegara ham kiradi (\`10 <= x <= 20\`).
### 4. Pagination: \`LIMIT\` + \`OFFSET\`
Sahifa \`page\` (1-based), \`size = 10\`: \`LIMIT 10 OFFSET (page - 1) * 10\`.`,
    theoryEn: `### 1. Logical Execution Order
SQL evaluates \`FROM\` -> \`WHERE\` -> \`SELECT\` -> \`DISTINCT\` -> \`ORDER BY\` -> \`LIMIT\`.
### 2. 3-Valued \`NULL\` Logic
Comparisons with \`NULL\` yield \`UNKNOWN\`; always write \`IS NULL\` or \`IS NOT NULL\`.
### 3. Pattern & Range Predicates
\`LIKE\` (\`%\` any chars, \`_\` single char), \`IN (...)\`, and inclusive \`BETWEEN low AND high\`.
### 4. Deterministic Pagination
Combine \`ORDER BY id\` with \`LIMIT ? OFFSET ?\`.`,
    examples: [
      ex('Misol 1: `WHERE`, `IN`, `BETWEEN` va `IS NULL`', 'Example 1: Filtering with IN, BETWEEN & IS NULL', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE courses (code TEXT, stage TEXT, price INT, archived_at TEXT)")\nc.executemany("INSERT INTO courses VALUES (?, ?, ?, ?)", [\n    ("PY-01", "beg", 0, None), ("PY-09", "mid", 50, None), ("PY-14", "adv", 90, "2025-01-01"), ("PY-17", "adv", 120, None)\n])\nrows = c.execute("""\n    SELECT code, price FROM courses\n    WHERE archived_at IS NULL AND stage IN ('mid', 'adv') AND price BETWEEN 40 AND 150\n    ORDER BY price DESC\n""").fetchall()\nprint(rows)`, `[('PY-17', 120), ('PY-09', 50)]`, '`IS NULL` arxivlanmaganlarni ajratdi, `IN` va `BETWEEN` esa bosqich hamda narxni filtrlab berdi.', 'Combines `IS NULL`, `IN`, `BETWEEN`, and `ORDER BY` directly inside SQL.'),
      ex('Misol 2: `LIKE` naqshlari va `DISTINCT`', 'Example 2: LIKE Wildcards & DISTINCT', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE tags (name TEXT, cat TEXT)")\nc.executemany("INSERT INTO tags VALUES (?, ?)", [("python", "lang"), ("pytest", "test"), ("sql", "db"), ("pydantic", "lib")])\nprint("py%:", c.execute("SELECT name FROM tags WHERE name LIKE 'py%' ORDER BY name").fetchall())\nprint("cats:", c.execute("SELECT DISTINCT cat FROM tags ORDER BY cat").fetchall())`, `py%: [('pydantic',), ('pytest',), ('python',)]\ncats: [('db',), ('lang',), ('lib',), ('test',)]`, '`LIKE \'py%\'` "py" bilan boshlanuvchi barcha teglarni topdi.', '`LIKE` filters prefixes while `DISTINCT` deduplicates categories.'),
      ex('Misol 3: `ORDER BY ... LIMIT ? OFFSET ?` sahifalash', 'Example 3: Deterministic Pagination', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE n (v INT)")\nc.executemany("INSERT INTO n VALUES (?)", [(i,) for i in range(1, 8)])\npage2 = c.execute("SELECT v FROM n ORDER BY v LIMIT ? OFFSET ?", (3, 3)).fetchall()\nprint("page 2:", [r[0] for r in page2])`, `page 2: [4, 5, 6]`, '3 tadan 2-sahifa (`OFFSET 3`) `[4, 5, 6]` ni aniq qaytardi.', '`ORDER BY` + `LIMIT ? OFFSET ?` paginates cleanly.'),
    ],
    traceTitleUz: 'SQL mantiqiy bajarilish izi',
    traceTitleEn: 'Tracing SQL Evaluation Order',
    traceCode: `SELECT name FROM users WHERE active = 1 ORDER BY name LIMIT 2`,
    traceSteps: [
      traceStep(1, 'FROM users -> WHERE active = 1', 'filtered rows', 'Faqat aktiv qatorlar qoldi', 'Filtered active rows'),
      traceStep(2, 'SELECT name -> ORDER BY name', 'sorted names', 'Ismlar saralandi', 'Sorted projected names'),
      traceStep(3, 'LIMIT 2', 'top 2', 'Birinchi 2 tasi olindi', 'Took first 2 rows'),
    ],
    commonMistakes: [
      mistake('`WHERE col = NULL` deb yozib bo‘sh natija olish', 'Writing WHERE col = NULL Instead of IS NULL', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (x INT)")\nc.execute("INSERT INTO t VALUES (NULL)")\nprint("= NULL:", c.execute("SELECT * FROM t WHERE x = NULL").fetchall())\nprint("IS NULL:", c.execute("SELECT * FROM t WHERE x IS NULL").fetchall())`, '= NULL returns []!', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (x INT)")\nc.execute("INSERT INTO t VALUES (NULL)")\nprint("Use IS NULL:", c.execute("SELECT * FROM t WHERE x IS NULL").fetchall())`, 'SQL da `NULL` qiymat emas, "nomaʼlum" holat; unga `=` ham, `!=` ham `False/UNKNOWN` beradi.', 'In 3-valued SQL logic, comparing anything with `=` to `NULL` evaluates to UNKNOWN.', 'Doim `IS NULL` yoki `IS NOT NULL` yozing.', 'Always use `IS NULL` / `IS NOT NULL`.'),
      mistake('`ORDER BY` siz `LIMIT` ishlatib tartibsiz natija olish', 'Using LIMIT Without ORDER BY', `# Without ORDER BY, database row order across pages is NOT guaranteed!`, 'Duplicate/skipped items during pagination', `print("Always pair LIMIT/OFFSET with deterministic ORDER BY id!")`, '`ORDER BY` bo‘lmasa baza xohlagan tartibda qaytarishi mumkin.', 'Without `ORDER BY`, result ordering is arbitrary across queries.', 'Har doim `ORDER BY` qo‘shing.', 'Always specify `ORDER BY`.'),
    ],
    compareTitleUz: '`OFFSET` Pagination vs Keyset (Cursor) Pagination',
    compareTitleEn: 'OFFSET vs Keyset Pagination',
    compareUz: ['`LIMIT/OFFSET`: 1–1000 sahifalarda oddiy va qulay (lekin katta `OFFSET 100000` sekinlashadi).', 'Keyset (`WHERE id > last_id LIMIT 20`): millionlab qatorli infinite-scroll da O(log n) tez!'],
    compareEn: ['`LIMIT/OFFSET`: simple for modest page counts.', 'Keyset (`WHERE id > last_id LIMIT 20`): stays fast via B-Tree index even at page 50,000.'],
    compareSummaryUz: 'Bazaning o‘zida `WHERE`, `IS NULL`, `IN`, `BETWEEN`, `LIKE` va `ORDER BY ... LIMIT` bilan filtrlang — Python ga ortiqcha qator tortmang.',
    compareSummaryEn: 'Filter in SQL with `IS NULL`, `IN`, `BETWEEN`, and `LIKE`, and always back `LIMIT` with `ORDER BY`.',
    practiceTasks: [
      pt('p1204_1', '1-mashq: `IS NULL` filtrlash', 'Task 1: Filter IS NULL', '`deleted_at IS NULL` bo‘lgan faol foydalanuvchi ismlarini chiqaring.', 'Select active users.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (name TEXT, del TEXT)")\nc.executemany("INSERT INTO u VALUES (?, ?)", [("Ali", None), ("Bob", "2026")])\nprint(c.execute("SELECT name FROM u WHERE del IS NULL").fetchall())`, "[('Ali',)]", 'WHERE del IS NULL', "Prints [('Ali',)]."),
      pt('p1204_2', '2-mashq: `IN` va `ORDER BY`', 'Task 2: Filter with IN', '`role IN (\'admin\', \'mentor\')` larni alifbo tartibida chiqaring.', 'Use IN + ORDER BY.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (name TEXT, role TEXT)")\nc.executemany("INSERT INTO u VALUES (?, ?)", [("Zed","mentor"), ("Ali","admin"), ("Bob","student")])\nprint([r[0] for r in c.execute("SELECT name FROM u WHERE role IN ('admin','mentor') ORDER BY name")])`, "['Ali', 'Zed']", 'IN (...) ORDER BY name', "Prints ['Ali', 'Zed']."),
      pt('p1204_3', '3-mashq: `BETWEEN` diapazoni', 'Task 3: BETWEEN Score Range', 'Balli `80 AND 100` orasidagi talabalar sonini toping.', 'Use BETWEEN.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE s (v INT)")\nc.executemany("INSERT INTO s VALUES (?)", [(70,), (80,), (95,), (100,)])\nprint(c.execute("SELECT COUNT(*) FROM s WHERE v BETWEEN 80 AND 100").fetchone()[0])`, '3', '80 and 100 are inclusive', 'Prints 3.'),
      pt('p1204_4', '4-mashq: `LIKE` naqshi', 'Task 4: LIKE Pattern', '`%python%` o‘z ichiga olgan kurslarni sanang.', 'Match %python%.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE c (t TEXT)")\nc.executemany("INSERT INTO c VALUES (?)", [("Learn Python",), ("Go",), ("Pythonic SQL",)])\nprint(c.execute("SELECT COUNT(*) FROM c WHERE LOWER(t) LIKE '%python%'").fetchone()[0])`, '2', 'LOWER(t) LIKE ...', 'Prints 2.'),
      pt('p1204_5', '5-mashq: `LIMIT` + `OFFSET`', 'Task 5: Top 2 After Offset 1', 'Tartiblangan sonlardan 1 tasini tashlab keyingi 2 tasini oling.', 'Use LIMIT 2 OFFSET 1.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE n (x INT)")\nc.executemany("INSERT INTO n VALUES (?)", [(1,), (2,), (3,), (4,)])\nprint([r[0] for r in c.execute("SELECT x FROM n ORDER BY x LIMIT 2 OFFSET 1")])`, '[2, 3]', 'LIMIT 2 OFFSET 1', 'Prints [2, 3].'),
    ],
    quiz: [
      q('q1204_1', 'SQL da ustun qiymati `NULL` ekanini tekshirishning yagona to‘g‘ri usuli?', 'Only correct SQL condition to test whether `col` is `NULL`?', ['col = NULL', 'col == None', 'col IS NULL', 'col LIKE NULL'], ['col = NULL', 'col == None', 'col IS NULL', 'col LIKE NULL'], 2, '`col IS NULL`.', '`col IS NULL`.'),
      q('q1204_2', 'SQL so‘rovida `WHERE` qaysi bosqichdan OLDIN bajariladi?', 'Which clause executes AFTER `WHERE` in SQL’s logical pipeline?', ['FROM', 'SELECT va ORDER BY', 'JOIN', 'Tableni ochish'], ['FROM', 'SELECT and ORDER BY', 'JOIN', 'Scan'], 1, '`FROM` -> `WHERE` -> `SELECT` -> `ORDER BY` -> `LIMIT`.', '`SELECT` and `ORDER BY` run after `WHERE`.'),
      q('q1204_3', '`LIMIT 10 OFFSET 20` nechanchi qatorlardan boshlab oladi?', 'What does `LIMIT 10 OFFSET 20` return?', ['1–10', '20 ta tashlab keyingi 10 ta qatorni (3-sahifa)', '20 ta qatorni', 'Oxirgi 10 ta'], ['Rows 1-10', 'Skips 20 rows and returns the next 10 (page 3)', '20 rows', 'Last 10'], 1, '20 ta tashlab 10 tasini qaytaradi.', 'Skips 20, returns next 10.'),
      q('q1204_4', '`LIKE \'_a%\'` naqshi nimaga mos keladi?', 'What string does `LIKE \'_a%\'` match?', ['Boshida "a" bor', 'Ikkinchi harfi "a" bo‘lgan kamida 2 belgili satrlar', 'Oxiri "a"', 'Faqat "_a"'], ['Starts with a', 'Any string whose 2nd character is "a"', 'Ends with a', 'Literal _a'], 1, '`_` aynan 1 ta ixtiyoriy belgi degani.', '`_` matches any single character.'),
      q('q1204_5', '`LIMIT` ishlatganda natija har safar bir xil chiqishi uchun nima majburiy?', 'What must accompany `LIMIT`/`OFFSET` for deterministic pagination?', ['DISTINCT', 'ORDER BY', 'GROUP BY', 'CHECK'], ['DISTINCT', 'ORDER BY', 'GROUP BY', 'CHECK'], 1, '`ORDER BY`.', '`ORDER BY`.'),
    ],
    homework: hw('Katalog Qidiruv va Pagination Funksiyasi', 'Paginated Catalog Search Query', 'SQLite da `search_products(conn, keyword, min_price, max_price, page, size)` funksiyasini parametrli `LIKE`, `BETWEEN`, `IS NULL` (faqat arxivlanmagan), `ORDER BY` va `LIMIT/OFFSET` bilan yozing.', 'Write `search_products(conn, keyword, min_price, max_price, page, size)` combining parameterized `LIKE`, `BETWEEN`, `IS NULL`, `ORDER BY`, and `LIMIT`/`OFFSET`.', ['100% ? parametrli', '2-sahifa natijasini assert qilish'], ['100% parameterized', 'Assert page 2 slicing'], 'offset = (page - 1) * size', 'Compute offset cleanly.', 'Keyset (`WHERE id > last_id`) variantini ham qo‘shib taqqoslang.', 'Add keyset pagination comparison.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-12-05',
    courseId: 'databases',
    moduleId: 'c12_m2',
    order: 5,
    titleUz: 'ORDER BY, GROUP BY, HAVING va Agregat Funksiyalar (+ Review #26)',
    titleEn: 'Aggregations: GROUP BY, HAVING & Window Previews (+ Review #26)',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-12-04'],
    conceptId: 'db_groupby_having',
    whyUz: "\"Har bir kategoriya bo‘yicha umumiy savdo summasi qancha?\" yoki \"Kamida 5 ta buyurtma qilgan mijozlar kimlar?\" — bu savollar uchun 10,000 ta qatorni Python `for` sikliga olib kirish shart emas! SQL **`COUNT`**, **`SUM`**, **`AVG`**, **`GROUP BY`** va **`HAVING`** buni bazaning o‘zida 100x tezroq hisoblab beradi.",
    whyEn: 'Compute analytical rollups inside SQL with aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`), `GROUP BY`, and post-aggregation filtering with `HAVING`.',
    analogyUz: "**`WHERE`** — bu zavod darvozasidagi elak (guruhlashdan OLDIN xom qatorlarni saralaydi). **`GROUP BY`** — mevalarni rangiga qarab savatlarga ajratadi. **`HAVING`** — esa to‘lgan savatlarning o‘zini tekshiradi (masalan \"ichida 5 tadan ko‘p olma bor savatlarni qoldir\")!",
    analogyEn: '`WHERE` filters individual items before sorting into buckets (`GROUP BY`); `HAVING` filters whole buckets after aggregation (`SUM`, `COUNT`, `AVG`).',
    stopsUz: "SQL intervyularidagi eng mashhur xato: **`WHERE COUNT(*) > 5`** deb yozish — bu **Syntax/OperationalError** beradi! Agregat natijalarni filtrlash uchun faqat **`HAVING COUNT(*) > 5`** ishlatiladi! Shuningdek `COUNT(*)` NULL larni ham sanaydi, `COUNT(col)` esa faqat NULL bo‘lmaganlarni sanaydi!",
    stopsEn: 'Never put aggregate functions (`COUNT`, `SUM`, `AVG`) inside `WHERE`—`WHERE` runs before grouping, so use `HAVING` for aggregate filters. Note `COUNT(*)` counts all rows including `NULL`s, whereas `COUNT(col)` skips `NULL`s.',
    objUz: ['`COUNT(*)`, `COUNT(col)`, `SUM`, `AVG`, `MIN`, `MAX` xususiyatlarini bilish', '`GROUP BY` bilan guruhli hisobotlar chiqarish', '`WHERE` (qator filtri) vs `HAVING` (guruh filtri) farqini qo‘llash'],
    objEn: ['Compute `COUNT(*)`, `COUNT(col)`, `SUM`, `AVG`, `MIN`, and `MAX`', 'Summarize groups cleanly with `GROUP BY`', 'Distinguish pre-group `WHERE` filtering from post-group `HAVING` filtering'],
    theoryUz: `### 1. Agregat Funksiyalar
- \`COUNT(*)\`: barcha qatorlar soni.
- \`COUNT(email)\`: faqat \`NULL\` bo‘lmagan qiymatlar soni.
- \`SUM(amount)\`, \`AVG(score)\`, \`MIN(price)\`, \`MAX(price)\`.
### 2. \`GROUP BY\` Qoidasi
\`SELECT\` ichida turgan va agregatga kirmagan har bir ustun \`GROUP BY\` da bo‘lishi kerak!
### 3. \`WHERE\` vs \`HAVING\`
\`\`\`sql
SELECT category, COUNT(*) AS cnt, SUM(total) AS rev
FROM orders
WHERE status = 'paid'        -- 1) Avval faqat 'paid' qatorlarni ol
GROUP BY category            -- 2) Kategoriya bo‘yicha guruhla
HAVING COUNT(*) >= 2         -- 3) Kamida 2 ta buyurtmali guruhni qoldir
ORDER BY rev DESC;           -- 4) Daromad bo‘yicha tartibla
\`\`\`
### 4. \`COALESCE(SUM(x), 0)\`
Bo‘sh guruhda \`SUM\` \`NULL\` qaytarmasligi uchun \`COALESCE(..., 0)\` foydali.`,
    theoryEn: `### 1. Aggregate Functions
\`COUNT(*)\` counts rows; \`COUNT(col)\` skips \`NULL\`s; \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\` reduce groups.
### 2. \`GROUP BY\` Rule
Every non-aggregated column in \`SELECT\` should appear in \`GROUP BY\`.
### 3. \`WHERE\` vs \`HAVING\`
\`WHERE\` filters raw rows *before* \`GROUP BY\`; \`HAVING\` filters aggregated groups *after* \`GROUP BY\`.
### 4. \`COALESCE\` Safety
Wrap nullable sums in \`COALESCE(SUM(col), 0)\`.`,
    examples: [
      ex('Misol 1: `WHERE` + `GROUP BY` + `HAVING` to‘liq hisobot', 'Example 1: Full Analytics Query (WHERE + GROUP BY + HAVING)', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE sales (dept TEXT, status TEXT, amt INT)")\nc.executemany("INSERT INTO sales VALUES (?, ?, ?)", [\n    ("books", "paid", 40), ("books", "paid", 60), ("books", "refund", 20),\n    ("tech", "paid", 300), ("music", "paid", 15)\n])\nrows = c.execute("""\n    SELECT dept, COUNT(*) AS cnt, SUM(amt) AS revenue\n    FROM sales\n    WHERE status = 'paid'\n    GROUP BY dept\n    HAVING SUM(amt) >= 50\n    ORDER BY revenue DESC\n""").fetchall()\nprint(rows)`, `[('tech', 1, 300), ('books', 2, 100)]`, '`WHERE` avval refundni chiqarib tashladi, `GROUP BY` jamladi, `HAVING` esa 50 dan kichik `music` ni filtrlab qo‘ydi.', '`WHERE` drops refunds first, `GROUP BY` aggregates totals, and `HAVING` filters groups below 50.'),
      ex('Misol 2: `COUNT(*)` vs `COUNT(col)` NULL farqi', 'Example 2: COUNT(*) vs COUNT(col)', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (id INT, phone TEXT)")\nc.executemany("INSERT INTO u VALUES (?, ?)", [(1, "901"), (2, None), (3, "902")])\nprint(c.execute("SELECT COUNT(*), COUNT(phone) FROM u").fetchone())`, `(3, 2)`, '`COUNT(*)` 3 ta qatorni, `COUNT(phone)` esa `NULL` ni tashlab `2` ni sanadi.', '`COUNT(*)` includes rows with `NULL`s; `COUNT(col)` ignores `NULL`s.'),
      ex('Misol 3: `ROUND(AVG(score), 2)` va ko‘p ustunli `GROUP BY`', 'Example 3: Multi-Column GROUP BY', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE g (grp TEXT, subj TEXT, score INT)")\nc.executemany("INSERT INTO g VALUES (?, ?, ?)", [("A", "py", 90), ("A", "py", 80), ("A", "sql", 100)])\nprint(c.execute("SELECT grp, subj, ROUND(AVG(score), 1) FROM g GROUP BY grp, subj ORDER BY subj").fetchall())`, `[('A', 'py', 85.0), ('A', 'sql', 100.0)]`, 'Ikki ustun (`grp, subj`) bo‘yicha guruhlash har bir fan o‘rtachasini aniq beradi.', 'Grouping by `(grp, subj)` computes per-subject averages cleanly.'),
    ],
    traceTitleUz: 'GROUP BY va HAVING izi',
    traceTitleEn: 'Tracing WHERE -> GROUP BY -> HAVING',
    traceCode: `SELECT dept, COUNT(*) FROM sales WHERE ok=1 GROUP BY dept HAVING COUNT(*) > 1`,
    traceSteps: [
      traceStep(1, 'WHERE ok = 1', '4 rows left', 'Yaroqsiz qatorlar chiqdi', 'Filtered raw rows'),
      traceStep(2, 'GROUP BY dept', 'books(2), tech(1), music(1)', 'Guruhlarga ajratildi', 'Grouped by dept'),
      traceStep(3, 'HAVING COUNT(*) > 1', 'books(2)', '1 talik guruhlar olib tashlandi', 'Filtered groups', "[('books', 2)]"),
    ],
    commonMistakes: [
      mistake('`WHERE` ichida `COUNT(*)` yoki `SUM()` ishlatish', 'Using Aggregate Functions Inside WHERE', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (dept TEXT)")\ntry:\n    c.execute("SELECT dept FROM t WHERE COUNT(*) > 1 GROUP BY dept")\nexcept sqlite3.OperationalError as e:\n    print("SQL Error:", e)`, 'OperationalError: misuse of aggregate: COUNT()', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (dept TEXT)")\nprint(c.execute("SELECT dept FROM t GROUP BY dept HAVING COUNT(*) > 1").fetchall())`, '`WHERE` guruhlashdan oldin ishlaydi va agregatlarni bilmaydi.', '`WHERE` executes before grouping so aggregates are illegal there.', 'Agregat shartlarini `HAVING` ga yozing.', 'Put aggregate filters in `HAVING`.'),
      mistake('`GROUP BY` dan tashqari ustunni agregatsiz `SELECT` ga qo‘yish', 'Selecting Non-Grouped Columns Without Aggregates', `# Selecting non-grouped columns relies on arbitrary row picking in SQLite and fails in PostgreSQL!`, 'Non-deterministic / PostgreSQL error', `print("Wrap non-grouped columns in MAX/MIN/COUNT or add to GROUP BY!")`, 'PostgreSQL bunday so‘rovni umuman qabul qilmaydi.', 'Strict SQL engines reject ungrouped columns in `SELECT`.', 'Har bir ustunni `GROUP BY` ga qo‘shing yoki agregatlang.', 'Group or aggregate every projected column.'),
    ],
    compareTitleUz: '`WHERE` vs `HAVING`',
    compareTitleEn: '`WHERE` vs `HAVING`',
    compareUz: ['`WHERE`: guruhlashdan OLDIN alohida qatorlarni filtrlaydi (indeksdan foydalanadi, juda tez).', '`HAVING`: `GROUP BY` dan KEYIN guruhlangan `SUM`/`COUNT` natijalarini filtrlaydi.'],
    compareEn: ['`WHERE`: filters raw rows before grouping (index-friendly).', '`HAVING`: filters aggregated groups after `GROUP BY`.'],
    compareSummaryUz: 'Imkon qadar qatorlarni `WHERE` da qisqartirib, keyin `GROUP BY` va `HAVING` bilan yakuniy guruh hisobotini chiqaring.',
    compareSummaryEn: 'Filter raw rows early in `WHERE`, group with `GROUP BY`, and filter aggregate metrics in `HAVING`.',
    practiceTasks: [
      pt('p1205_1', '1-mashq: `COUNT(*)` va `SUM()`', 'Task 1: Totals Query', '`[10, 20, 30]` qatorlarining soni va yig‘indisini SQL da chiqaring.', 'Compute count and sum.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE n (v INT)")\nc.executemany("INSERT INTO n VALUES (?)", [(10,), (20,), (30,)])\nprint(c.execute("SELECT COUNT(*), SUM(v) FROM n").fetchone())`, '(3, 60)', 'COUNT(*), SUM(v)', 'Prints (3, 60).'),
      pt('p1205_2', '2-mashq: `GROUP BY` hisoboti', 'Task 2: Count by Category', 'Har bir kategoriya bo‘yicha sonni alifbo tartibida chiqaring.', 'Group and count.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE p (cat TEXT)")\nc.executemany("INSERT INTO p VALUES (?)", [("b",), ("a",), ("a",)])\nprint(c.execute("SELECT cat, COUNT(*) FROM p GROUP BY cat ORDER BY cat").fetchall())`, "[('a', 2), ('b', 1)]", 'GROUP BY cat ORDER BY cat', "Prints [('a', 2), ('b', 1)]."),
      pt('p1205_3', '3-mashq: `HAVING` filtri', 'Task 3: Filter Groups with HAVING', 'Kamida 2 ta yozuvi bor guruhlarni qoldiring.', 'Use HAVING COUNT(*) >= 2.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE p (cat TEXT)")\nc.executemany("INSERT INTO p VALUES (?)", [("b",), ("a",), ("a",)])\nprint(c.execute("SELECT cat FROM p GROUP BY cat HAVING COUNT(*) >= 2").fetchall())`, "[('a',)]", 'HAVING COUNT(*) >= 2', "Prints [('a',)]."),
      pt('p1205_4', '4-mashq: `WHERE` + `HAVING` birgalikda', 'Task 4: Combined WHERE & HAVING', 'Faqat `active=1` lardan guruhlab `SUM(v) > 15` larni oling.', 'Combine WHERE and HAVING.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE s (k TEXT, active INT, v INT)")\nc.executemany("INSERT INTO s VALUES (?, ?, ?)", [("x",1,10),("x",1,10),("y",0,50),("z",1,5)])\nprint(c.execute("SELECT k, SUM(v) FROM s WHERE active=1 GROUP BY k HAVING SUM(v) > 15").fetchall())`, "[('x', 20)]", 'WHERE active=1 ... HAVING SUM(v) > 15', "Prints [('x', 20)]."),
      pt('p1205_5', '5-mashq: `COUNT(DISTINCT col)`', 'Task 5: Distinct Count in SQL', 'Noyob shaharlar sonini `COUNT(DISTINCT city)` bilan toping.', 'Use COUNT(DISTINCT city).', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (city TEXT)")\nc.executemany("INSERT INTO u VALUES (?)", [("Toshkent",), ("Samarqand",), ("Toshkent",)])\nprint(c.execute("SELECT COUNT(DISTINCT city) FROM u").fetchone()[0])`, '2', 'COUNT(DISTINCT city)', 'Prints 2.'),
    ],
    quiz: [
      q('q1205_1', 'Guruhlangan (`GROUP BY`) natijalarni `SUM(total) > 1000` kabi shart bilan filtrlash uchun qaysi band ishlatiladi?', 'Clause used to filter grouped results like `SUM(total) > 1000`?', ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], 1, '`HAVING`.', '`HAVING`.'),
      q('q1205_2', '`COUNT(*)` va `COUNT(email)` orasidagi farq nima?', 'Difference between `COUNT(*)` and `COUNT(email)`?', ['Farqi yo‘q', '`COUNT(*)` barcha qatorlarni, `COUNT(email)` esa faqat `NULL` bo‘lmaganlarini sanaydi', '`COUNT(email)` tezroq', '`COUNT(*)` xato'], ['None', '`COUNT(*)` counts all rows; `COUNT(email)` skips `NULL`s', 'Faster', 'Error'], 1, '`COUNT(col)` `NULL` qiymatlarni tashlab ketadi.', '`COUNT(col)` skips `NULL`s.'),
      q('q1205_3', 'Bitta so‘rovda `WHERE` va `HAVING` qaysi tartibda ishlaydi?', 'Execution order of `WHERE` and `HAVING` in one query?', ['HAVING keyin WHERE', 'WHERE (qatorlar) -> GROUP BY -> HAVING (guruhlar)', 'Bir vaqtda', 'Tasodifiy'], ['HAVING then WHERE', 'WHERE (rows) -> GROUP BY -> HAVING (groups)', 'Simultaneous', 'Random'], 1, 'Avval `WHERE`, keyin `GROUP BY`, keyin `HAVING`.', '`WHERE` before `GROUP BY` before `HAVING`.'),
      q('q1205_4', 'Noyob (takrorlanmas) qiymatlar sonini bitta so‘rovda sanash sintaksisi?', 'SQL expression to count unique values in `col`?', ['DISTINCT COUNT(col)', 'COUNT(DISTINCT col)', 'UNIQUE(col)', 'SUM(DISTINCT col)'], ['DISTINCT COUNT(col)', 'COUNT(DISTINCT col)', 'UNIQUE(col)', 'SUM(DISTINCT col)'], 1, '`COUNT(DISTINCT col)`.', '`COUNT(DISTINCT col)`.'),
      q('q1205_5', 'Bo‘sh natijada `SUM(price)` `NULL` qaytarmasligi uchun qaysi funksiya bilan o‘raladi?', 'Function replacing `NULL` sum with `0`?', ['IFNONE', 'COALESCE(SUM(price), 0)', 'NOTNULL', 'DEFAULT'], ['IFNONE', 'COALESCE(SUM(price), 0)', 'NOTNULL', 'DEFAULT'], 1, '`COALESCE(SUM(price), 0)`.', '`COALESCE(SUM(price), 0)`.'),
    ],
    homework: hw('Oylik Savdo Analitikasi Hisoboti', 'Monthly Sales Analytics Rollup', 'SQLite da `orders(customer, category, status, amount_cents)` jadvaliga kamida 10 ta yozuv kiritib, `WHERE status = "paid"`, `GROUP BY category`, `HAVING COUNT(*) >= 2` hamda `ROUND(AVG(...), 2)` hisobotini chiqaring.', 'Populate 10+ sample rows in an in-memory `orders` table and run analytics queries combining `WHERE`, `GROUP BY`, `HAVING`, `COUNT(DISTINCT customer)`, and `ORDER BY`.', ['WHERE + GROUP BY + HAVING birgalikda', 'COUNT(DISTINCT ...) va SUM/AVG'], ['Combine WHERE, GROUP BY, HAVING', 'Include COUNT(DISTINCT) and AVG'], 'Filter status first in WHERE, then HAVING COUNT(*) >= 2.', 'Clean analytical SQL.', 'Window funksiya `RANK() OVER (ORDER BY SUM(amount_cents) DESC)` ham sinab ko‘ring.', 'Try window RANK().', 25),
    reviewCheckpoint: review(
      26,
      'Review Loyiha #26: SQLite CRUD + Parametrli Analitika Dvigateli (130-dars Marrasi!)',
      'Review Project #26: Safe Parameterized SQLite Analytics (130th Lesson!)',
      '130-dars marrasi! DDL (`CHECK`, `NOT NULL`), `?` parametrli CRUD (`with conn:` ACID) va `GROUP BY` + `HAVING` analitikasini bitta yaxlit Python + SQLite modulida birlashtiring.',
      '130-lesson milestone! Combine strict DDL constraints, ACID parameterized CRUD transactions, and `WHERE`/`GROUP BY`/`HAVING` analytics in one clean SQLite repository.',
      ['`CHECK (amount_cents > 0)` va `NOT NULL` jadvali', 'Parameterized `?` + `executemany` kiritish', '`WHERE` + `GROUP BY` + `HAVING` hisoboti'],
      ['Constrained DDL table', 'Parameterized ACID writes', 'Aggregate rollup query'],
      `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("""
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'posted',
    cents INTEGER NOT NULL CHECK (cents > 0)
)
""")
with conn:
    conn.executemany(
        "INSERT INTO expenses (category, status, cents) VALUES (?, ?, ?)",
        [("food", "posted", 1500), ("food", "posted", 2500), ("travel", "void", 9000), ("books", "posted", 4500)]
    )
summary = conn.execute("""
    SELECT category, COUNT(*), SUM(cents)
    FROM expenses
    WHERE status = 'posted'
    GROUP BY category
    HAVING SUM(cents) >= 3000
    ORDER BY SUM(cents) DESC
""").fetchall()
print("Analytics summary:", summary)
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),
];
