import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C14_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-14-08',
    courseId: 'web_backend',
    moduleId: 'c14_m3',
    order: 8,
    titleUz: 'Database ORM, SQLAlchemy, Alembic va Review #31',
    titleEn: 'Database ORM, SQLAlchemy 2.0, Alembic Migrations & Review #31',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-14-07'],
    conceptId: 'be_orm_sqlalchemy',
    whyUz: "Har bir jadval uchun yuzlab qator qo‘lda SQL yozish va satrlarni Python obyektiga o‘girish sekin va xatoga moyil. **SQLAlchemy 2.0 ORM** Python klasslarini relyatsion jadvallarga bog‘laydi, **Session (Unit of Work)** bilan tranzaksiyalarni boshqaradi, **Alembic** esa sxemani versiyalab boradi!",
    whyEn: 'Bridge relational SQL and Python domain objects using SQLAlchemy 2.0 patterns (`Mapped[]`, `Session` Unit of Work), prevent N+1 queries with `selectinload`/`joinedload`, and evolve schemas safely via Alembic migrations.',
    analogyUz: "**ORM (Object-Relational Mapping)** — bu tarjimon: siz Python obyektlari (`order.items`) bilan ishlaysiz, u esa ortda xavfsiz parameterized SQL (`SELECT ... WHERE ...`) yozadi. **Session** esa savat: hamma o‘zgarishlarni yig‘ib, `commit()` da bitta atomik tranzaksiya sifatida bazaga muhrlaydi!",
    analogyEn: 'An ORM translates between Python objects and SQL rows, while a `Session` acts as a transactional Unit of Work that batches changes until `commit()` (or reverts all on `rollback()`).',
    stopsUz: "ORM da 3 ta qatʼiy qoida: 1) **Har doim Request-Scoped Session ishlating** (`with Session() as db:` — global bitta `session` ni hamma foydalanuvchiga ulashmang!). 2) **`N+1 Query` tuzog‘idan qoching**: bog‘liq ro‘yxatlar uchun `selectinload()` / `joinedload()` ishlating (`lazy='raise'` qo‘yish N+1 ni testdayoq ushlaydi!). 3) Production da **`Base.metadata.create_all()`** emas, **Alembic migrations** ishlating!",
    stopsEn: 'Never share a global ORM `Session` across requests, never ship `create_all()` instead of Alembic migrations in production, and guard relationship loops with `selectinload()` / `joinedload()`.',
    objUz: ['SQLAlchemy 2.0 declarative modellar va `Session` (Unit of Work / commit / rollback) sikli', 'Eager loading (`joinedload` / `selectinload`) orqali N+1 query muammosini yo‘qotish', 'Alembic migratsiyalari vs `create_all()` hamda Connection Pooling (`pool_size`)'],
    objEn: ['Manage transactional `Session` lifecycles (`commit` vs `rollback`)', 'Prevent ORM N+1 roundtrips with eager loading strategies', 'Track production schema changes with Alembic instead of `create_all()`'],
    theoryUz: `### 1. ORM va Unit of Work (\`Session\`)
SQLAlchemy da \`Session\` bitta mantiqiy biznes operatsiyasini (masalan, buyurtma yaratish + balans yechish) bitta DB tranzaksiyasida ushlaydi: xato chiqsa \`rollback()\`, muvaffaqiyatli bo‘lsa \`commit()\`.
### 2. SQLAlchemy 2.0 Sxemasi
\`id: Mapped[int] = mapped_column(primary_key=True)\` — ham SQL ustuni, ham Python Mypy/Pyright tiplash!
### 3. N+1 Muammosi va Eager Loading
Agar \`users = session.scalars(select(User))\` qilib keyin har bir \`u.orders\` ga murojaat qilsangiz, 100 ta foydalanuvchi uchun 101 ta SQL ketadi! Yechim:
- \`joinedload(User.profile)\` (1 ta \`LEFT JOIN\`, bitta obyekt uchun).
- \`selectinload(User.orders)\` (2 ta tezkor \`WHERE user_id IN (...)\`, 1-to-many uchun!).
### 4. Alembic vs \`create_all()\`
\`create_all()\` mavjud jadvalga yangi ustun qo‘shmaydi! Alembic esa \`alembic revision --autogenerate\` va \`alembic upgrade head\` bilan xavfsiz evolyutsiya beradi.`,
    theoryEn: `### 1. Transactional Session (Unit of Work)
Open one \`Session\` per request, commit at the boundary, and \`rollback()\` on any exception.
### 2. Declarative Models (SQLAlchemy 2.0)
\`Mapped[T]\` + \`mapped_column()\` unite runtime SQL DDL with static type checking.
### 3. Eliminating N+1 Queries
Use \`joinedload()\` for single-object relations and \`selectinload()\` for one-to-many collections so loops execute 1–2 queries instead of N+1.
### 4. Alembic Migrations
\`create_all()\` ignores existing tables; Alembic tracks ordered, reversible schema revisions across dev/staging/prod.`,
    examples: [
      ex('Misol 1: SQLite ustida Mini Repository + Unit of Work (`commit`/`rollback`)', 'Example 1: Transactional Unit of Work Session', `import sqlite3
from contextlib import contextmanager
from dataclasses import dataclass

@dataclass
class Account:
    id: int
    owner: str
    balance: int

class MiniSession:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn
    @contextmanager
    def begin(self):
        try:
            yield self
            self.conn.commit()
        except Exception:
            self.conn.rollback()
            raise
    def get_account(self, aid: int) -> Account | None:
        r = self.conn.execute("SELECT id, owner, balance FROM accounts WHERE id=?", (aid,)).fetchone()
        return Account(*r) if r else None

c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE accounts (id INT PRIMARY KEY, owner TEXT, balance INT CHECK (balance >= 0))")
c.executemany("INSERT INTO accounts VALUES (?, ?, ?)", [(1, "Ali", 500), (2, "Vali", 100)])
c.commit()

sess = MiniSession(c)
try:
    with sess.begin():
        c.execute("UPDATE accounts SET balance = balance - 900 WHERE id = 1")
except sqlite3.IntegrityError:
    print("Rollback triggered cleanly!")
print("Ali balance unchanged:", sess.get_account(1))`, `Rollback triggered cleanly!\nAli balance unchanged: Account(id=1, owner='Ali', balance=500)`, 'Xato (`CHECK balance >= 0`) chiqishi bilan kontekst menejer avtomatik `rollback()` qildi va balans buzilmadi.', 'A failing constraint automatically rolls back the entire Unit of Work transaction.'),
      ex('Misol 2: `selectinload()` Strategiyasi (N+1 -> 2 Query)', 'Example 2: Simulating selectinload (2 Queries Instead of N+1)', `import sqlite3

c = sqlite3.connect(":memory:")
c.execute("CREATE TABLE users (id INT PRIMARY KEY, name TEXT)")
c.execute("CREATE TABLE orders (id INT PRIMARY KEY, uid INT, total INT)")
c.executemany("INSERT INTO users VALUES (?, ?)", [(1, "Aziz"), (2, "Madina")])
c.executemany("INSERT INTO orders VALUES (?, ?, ?)", [(10, 1, 120), (11, 1, 80), (12, 2, 200)])

# Query 1: fetch users; Query 2: single IN(...) batch for all their orders
users = c.execute("SELECT id, name FROM users ORDER BY id").fetchall()
uids = [u[0] for u in users]
placeholders = ",".join("?" * len(uids))
orders = c.execute(f"SELECT uid, id, total FROM orders WHERE uid IN ({placeholders}) ORDER BY id", uids).fetchall()
by_uid: dict[int, list] = {u[0]: [] for u in users}
for uid, oid, total in orders:
    by_uid[uid].append((oid, total))
for uid, name in users:
    print(name, "->", by_uid[uid])`, `Aziz -> [(10, 120), (11, 80)]\nMadina -> [(12, 200)]`, '`selectinload()` 1000 ta foydalanuvchi uchun ham atigi 2 ta SQL so‘rov yuboradi!', '`selectinload()` resolves an entire 1-to-many collection in 2 SQL queries regardless of N.'),
      ex('Misol 3: `Identity Map` — Bitta Session Ichida Yagona Obyekt Nusxasi', 'Example 3: Session Identity Map Pattern', `class IdentitySession:
    def __init__(self, rows: dict[int, dict]):
        self._rows = rows
        self._identity_map: dict[int, dict] = {}
    def get(self, pk: int) -> dict | None:
        if pk not in self._identity_map and pk in self._rows:
            self._identity_map[pk] = dict(self._rows[pk])
        return self._identity_map.get(pk)

s = IdentitySession({1: {"id": 1, "name": "Ali"}})
a, b = s.get(1), s.get(1)
print("Same object in session?", a is b)`, `Same object in session? True`, 'Identity Map bitta so‘rov ichida bir xil PK li satrni xotirada yagona obyekt sifatida ushlaydi.', 'An ORM Identity Map returns the exact same Python object instance for repeated PK lookups within one session.'),
    ],
    traceTitleUz: 'Unit of Work `commit()` / `rollback()` izi',
    traceTitleEn: 'Tracing Unit of Work Transaction',
    traceCode: `with sess.begin():\n    debit(1, 900)  # violates CHECK(balance >= 0)`,
    traceSteps: [
      traceStep(1, '__enter__', 'transaction open', 'Tranzaksiya boshlandi', 'Opened transaction'),
      traceStep(2, 'UPDATE balance', 'IntegrityError raised', 'CHECK cheklovi buzildi', 'Constraint failed'),
      traceStep(3, '__exit__', 'conn.rollback()', 'Barcha o‘zgarish bekor qilindi', 'Rolled back safely'),
    ],
    commonMistakes: [
      mistake('Bitta global `session` yaratib barcha parallel so‘rovlarda ishlatish', 'Sharing a Global ORM Session Across Requests', `# Global session = Session(engine) causes race conditions and stale reads across concurrent requests!`, 'Corrupted transactions & thread crashes', `print("Always open and close a fresh Session per request via dependency injection!")`, 'Har bir HTTP so‘rov o‘zining alohida `Session`iga ega bo‘lishi shart.', 'ORM sessions are stateful and not thread/coroutine-safe across requests.', 'Per-request `with Session()` ishlating.', 'Scope one `Session` per request.'),
      mistake('Production bazada Alembic o‘rniga `Base.metadata.create_all()` ga tayanish', 'Relying on create_all() Instead of Alembic in Production', `# create_all() NEVER alters existing tables when you add a new column to a model!`, 'OperationalError: no such column', `print("Use Alembic migrations (revision -> upgrade head) for all production schema updates!")`, 'Yangi ustun qo‘shilganda `create_all()` eski jadvalni yangilamaydi!', '`create_all()` only creates missing tables and skips altered columns.', 'Alembic migratsiyalarini ishlating.', 'Manage schemas with Alembic.'),
    ],
    compareTitleUz: 'Raw SQL vs SQLAlchemy ORM',
    compareTitleEn: 'Raw Parameterized SQL vs SQLAlchemy ORM',
    compareUz: ['Raw SQL (`psycopg`/`sqlite3`): murakkab analitik hisobotlar va bulk ETL da maksimal tezlik.', 'SQLAlchemy ORM: domain CRUD, `Session` Unit of Work, munosabatlar, tiplangan querylar va Alembic bilan tez rivojlantirish.'],
    compareEn: ['Raw SQL: peak performance for complex analytical queries and bulk ETL.', 'SQLAlchemy ORM: maintainable domain modeling, transactions, type safety, and Alembic schema history.'],
    compareSummaryUz: 'ORM da `Session` ni har so‘rovga alohida oching, `selectinload`/`joinedload` bilan N+1 ni yo‘qoting va sxemani Alembic da boshqaring.',
    compareSummaryEn: 'Scope ORM `Session`s per request, prevent N+1 with eager loading, and evolve schemas exclusively via Alembic.',
    practiceTasks: [
      pt('p1408_1', '1-mashq: Atomik `rollback()` tekshiruvi', 'Task 1: Rollback on Failure', 'Xato chiqqanda balans o‘zgarmasligini ko‘rsating.', 'Verify transaction rollback.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE w (id INT, bal INT CHECK (bal >= 0))")\nc.execute("INSERT INTO w VALUES (1, 100)"); c.commit()\ntry:\n    c.execute("UPDATE w SET bal = 50 WHERE id = 1")\n    c.execute("UPDATE w SET bal = -10 WHERE id = 1")\n    c.commit()\nexcept sqlite3.IntegrityError:\n    c.rollback()\nprint(c.execute("SELECT bal FROM w WHERE id=1").fetchone()[0])`, '100', 'Call c.rollback() in except', 'Prints 100.'),
      pt('p1408_2', '2-mashq: `WHERE id IN (...)` Batch Yuklash', 'Task 2: Batch IN Query', 'Bir nechta ID bo‘yicha 1 ta so‘rovda satrlarni oling.', 'Batch fetch with IN.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (id INT, v TEXT)")\nc.executemany("INSERT INTO t VALUES (?, ?)", [(1,"a"),(2,"b"),(3,"c")])\nids = [1, 3]\nqm = ",".join("?"*len(ids))\nprint(c.execute(f"SELECT v FROM t WHERE id IN ({qm}) ORDER BY id", ids).fetchall())`, "[('a',), ('c',)]", 'Parameterized IN clause', "Prints [('a',), ('c',)]."),
      pt('p1408_3', '3-mashq: Identity Map kesh', 'Task 3: Identity Map Cache', 'Bir xil ID ikkinchi marta so‘ralganda bazaga bormasligini ko‘rsating.', 'Track DB hits.', `hits = 0\ncache = {}\ndef get_user(uid):\n    global hits\n    if uid not in cache: hits += 1; cache[uid] = {"id": uid}\n    return cache[uid]\nget_user(5); get_user(5)\nprint("DB hits:", hits)`, 'DB hits: 1', 'Cache per session', 'Prints DB hits: 1.'),
      pt('p1408_4', '4-mashq: Soft Delete filtri', 'Task 4: Soft Delete Query', 'Faqat `deleted_at IS NULL` yozuvlarni oling.', 'Filter non-deleted rows.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE n (id INT, deleted_at TEXT)")\nc.executemany("INSERT INTO n VALUES (?, ?)", [(1, None), (2, "2026-01-01")])\nprint([r[0] for r in c.execute("SELECT id FROM n WHERE deleted_at IS NULL")])`, '[1]', 'WHERE deleted_at IS NULL', 'Prints [1].'),
      pt('p1408_5', '5-mashq: Optimistic Locking (`version`)', 'Task 5: Optimistic Version Check', '`WHERE id=? AND version=?` bilan `rowcount` ni tekshiring.', 'Check version conflict.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE doc (id INT, txt TEXT, ver INT)")\nc.execute("INSERT INTO doc VALUES (1, 'v1', 1)")\ncur = c.execute("UPDATE doc SET txt='v2', ver=ver+1 WHERE id=1 AND ver=99")\nprint("Updated rows:", cur.rowcount)`, 'Updated rows: 0', 'Check cur.rowcount', 'Prints Updated rows: 0.'),
    ],
    quiz: [
      q('q1408_1', 'SQLAlchemy da bir nechta o‘zgarishni bitta tranzaksiyada yig‘ib `commit()` yoki `rollback()` qiluvchi Pattern?', 'Pattern implemented by SQLAlchemy’s `Session` to group DB writes atomically?', ['Singleton', 'Unit of Work', 'Observer', 'Factory'], ['Singleton', 'Unit of Work', 'Observer', 'Factory'], 1, 'Unit of Work.', 'Unit of Work.'),
      q('q1408_2', '1-to-Many munosabatda (`User -> Orders`) N+1 muammosini `WHERE user_id IN (...)` orqali 2 ta so‘rovga tushiradigan SQLAlchemy opsiyasi?', 'SQLAlchemy eager-loading option issuing a batched `IN (...)` query for 1-to-many collections?', ['lazy="dynamic"', 'selectinload()', 'noload()', 'defer()'], ['lazy="dynamic"', 'selectinload()', 'noload()', 'defer()'], 1, '`selectinload()`.', '`selectinload()`.'),
      q('q1408_3', 'Nima uchun production da `Base.metadata.create_all()` o‘rniga **Alembic** ishlatiladi?', 'Why use Alembic instead of `Base.metadata.create_all()` in production?', ['Alembic Pythonni tezlatadi', '`create_all()` mavjud jadvallarga yangi ustun/indeks migratsiya qila olmaydi', 'SQLite ishlamaydi', 'JSON kerak'], ['Faster Python', '`create_all()` cannot alter existing tables or track incremental schema revisions', 'No SQLite', 'JSON'], 1, '`create_all()` mavjud jadvallarni o‘zgartira olmaydi.', 'Alembic safely tracks incremental DDL changes.'),
      q('q1408_4', 'FastAPI da `Session` hayot sikli qanday bo‘lishi kerak?', 'Correct lifecycle for an ORM `Session` in web backends?', ['1 ta global session', 'Har bir HTTP so‘rov uchun alohida ochilib so‘rov oxirida yopiladigan Session', 'Har soatda', 'Faqat startda'], ['One global session', 'One request-scoped session opened via DI and closed cleanly in finally', 'Hourly', 'Startup only'], 1, 'Har so‘rov uchun alohida Session.', 'Per-request scoped Session.'),
      q('q1408_5', '`UPDATE items SET qty = 5, version = version + 1 WHERE id = ? AND version = ?` qanday himoya usuli?', 'Concurrency pattern checking a `version` column in the `WHERE` clause during `UPDATE`?', ['Pessimistic Lock', 'Optimistic Locking (Lost-Update himoyasi)', 'Sharding', 'Deadlock'], ['Pessimistic Lock', 'Optimistic Locking', 'Sharding', 'Deadlock'], 1, 'Optimistic Locking.', 'Optimistic Locking.'),
    ],
    homework: hw('Mini SQLAlchemy Repository + Unit of Work', 'Transactional Repository & Eager Loader', 'SQLite ustida `Session` (`commit`/`rollback`), `User` va `Post` jadvallari uchun Repository, N+1 siz `selectinload` helperi va `version` bilan Optimistic Locking yozing.', 'Implement a transactional `Session` context manager over SQLite with `User`/`Post` repositories, batch `selectinload` loading, and optimistic version checks.', ['Unit of Work rollback testi', 'Batch IN eager loader + optimistic lock'], ['Unit of Work rollback test', 'Batch IN loader + optimistic lock'], 'Keep identity map per session and validate cur.rowcount == 1 on versioned updates.', 'Clean ORM core.', 'Alembic `up`/`down` migratsiya tarixini ham ulang.', 'Connect with versioned migrations.', 25),
    reviewCheckpoint: review(
      31,
      'Review Loyiha #31: Pydantic Schemas + Transactional ORM Repository',
      'Review Project #31: Validated DTOs + Transactional Repository',
      '14-kursning 8-darsigacha bo‘lgan bilimlarni birlashtiring: Allowlist DTO validatsiyasi, SQLite Unit of Work tranzaksiyasi va N+1 siz batch `IN` yuklashni bitta buyurtma servisida birga ishlating.',
      'Combine strict DTO allowlist validation, transactional Unit-of-Work rollback safety, and N+1-free batch loading in an Order service.',
      ['Allowlist payload tekshiruvi (`422`)', 'Atomik balans + buyurtma tranzaksiyasi (`rollback` on fail)', 'Batch `IN` buyurtmalar hisoboti'],
      ['Strict DTO validation', 'Atomic balance + order commit/rollback', 'Batch IN eager fetch'],
      `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE users (id INT PRIMARY KEY, bal INT CHECK (bal >= 0))")
conn.execute("CREATE TABLE orders (id INTEGER PRIMARY KEY, uid INT, amount INT)")
conn.execute("INSERT INTO users VALUES (1, 100)")
conn.commit()

def place_order(uid: int, amount: int) -> tuple[int, dict]:
    if not isinstance(amount, int) or isinstance(amount, bool) or amount <= 0:
        return 422, {"error": "Invalid amount"}
    try:
        conn.execute("UPDATE users SET bal = bal - ? WHERE id = ?", (amount, uid))
        conn.execute("INSERT INTO orders (uid, amount) VALUES (?, ?)", (uid, amount))
        conn.commit()
        return 201, {"status": "created"}
    except sqlite3.IntegrityError:
        conn.rollback()
        return 409, {"error": "Insufficient balance"}

print(place_order(1, 40))
print(place_order(1, 90))
print("Remaining:", conn.execute("SELECT bal FROM users WHERE id=1").fetchone()[0])
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-09',
    courseId: 'web_backend',
    moduleId: 'c14_m3',
    order: 9,
    titleUz: 'Authentication va Authorization — Hashing, JWT/Sessions va RBAC',
    titleEn: 'Authentication & Authorization: Password Hashing, JWT & RBAC',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-14-08'],
    conceptId: 'be_auth_rbac',
    whyUz: "Har yili minglab saytlar oddiy 2 ta xato sababli buziladi: 1) Parollarni ochiq yoki tez `MD5/SHA256` bilan saqlash (`Argon2`/`scrypt`/`PBKDF2` o‘rniga!), 2) **IDOR (Insecure Direct Object Reference)** — `GET /orders/105` da foydalanuvchi tizimga kirgan (`401` o‘tdi), lekin buyurtma `105` unga tegishlimi yo‘qmi tekshirilmagan!",
    whyEn: 'Secure user identities properly: hash passwords with slow salted KDFs (`hashlib.scrypt` / `pbkdf2_hmac` / Argon2id), distinguish `401` Authentication vs `403` Authorization, enforce RBAC + object-level ownership (preventing IDOR), and handle token revocation.',
    analogyUz: "**Authentication (`401`)** — aeroportda pasport tekshiruvi: \"Siz haqiqatan Alimisiz?\". **Authorization (`403`)** — samolyot eshigi: \"Ha, Alisiz, lekin sizning chiptangiz Ekonom-klassga, Biznes-klassga yoki boshqa birovning o‘rindig‘iga kirishga ruxsat YO‘Q!\"",
    analogyEn: 'Authentication proves who you are (`401` if unverified); Authorization decides what you may touch (`403` if your role or resource ownership lacks permission).',
    stopsUz: "Auth xavfsizligida 4 oltin qoida: 1) Parolni **hech qachon SHA-256** bilan xeshlamang — **sekin va tuzli (`salt`) KDF** (`Argon2id` yoki stdlib `hashlib.scrypt` / `pbkdf2_hmac`) ishlating! 2) Login xatosida **\"Email topilmadi\"** vs **\"Parol xato\"** demang — User Enumeration dan qochish uchun ikkalasiga ham **\"Login yoki parol xato\"** deb javob bering! 3) Har doim **Object Ownership (`order.user_id == current_user.id`)** ni tekshiring (IDOR himoyasi!).",
    stopsEn: 'Never hash passwords with fast digests like SHA-256—use salted slow KDFs (`Argon2id`/`scrypt`/`pbkdf2_hmac`). Return generic login failures to prevent user enumeration, and check resource ownership on every object endpoint to stop IDOR.',
    objUz: ['`hashlib.scrypt` / `pbkdf2_hmac` + `secrets.token_bytes` salt + `hmac.compare_digest` bilan parol saqlash', '`401 Unauthorized` (AuthN) vs `403 Forbidden` (AuthZ / RBAC)', 'RBAC (Role-Based Access Control) va IDOR (Ownership check) himoyasi'],
    objEn: ['Hash and verify passwords safely with salted slow KDFs and constant-time comparison', 'Distinguish `401` (unauthenticated) vs `403` (unauthorized)', 'Enforce RBAC permissions and object-level ownership checks against IDOR'],
    theoryUz: `### 1. Authentication (\`401\`) vs Authorization (\`403\`)
- **401**: token yo‘q, yaroqsiz yoki muddati o‘tgan.
- **403**: foydalanuvchi kimligi maʼlum, lekin ruxsati (roli yoki egalik huquqi) yetarli emas!
### 2. Parol Xeshlash (Slow Salted KDF)
Tezkor SHA-256 da GPU sekundiga milliardlab parolni sinaydi. **\`scrypt\` / \`PBKDF2\` / \`Argon2id\`** esa har bir foydalanuvchi uchun tasodifiy \`salt\` qo‘shib hisobni ataylab sekinlashtiradi!
### 3. RBAC va IDOR Himoyasi
\`if user.role != "admin" and note.owner_id != user.id: return 403\` — bu bitta qator IDOR (birovning maʼlumotini ID raqamini o‘zgartirib o‘g‘irlash) hujumini to‘sadi!
### 4. JWT Revocation & Token Rotation
Stateless JWT ni darhol bekor qilish qiyin; shuning uchun qisqa umrli Access Token (5–15 min) + Bazada saqlanadigan Refresh Token (\`jti\`/revoked flag) ishlatiladi.`,
    theoryEn: `### 1. \`401\` vs \`403\`
Return \`401\` when identity is missing/invalid; return \`403\` when an authenticated identity lacks required roles or ownership.
### 2. Slow Salted Password Hashing
Fast hashes invite brute-force cracking; use salted \`Argon2id\` or Python stdlib \`hashlib.scrypt\` / \`pbkdf2_hmac\` with \`hmac.compare_digest\`.
### 3. RBAC & Anti-IDOR Ownership Checks
Every \`GET/PATCH/DELETE /{resource}/{id}\` must verify \`resource.owner_id == current_user.id or current_user.role == "admin"\`.
### 4. Short-Lived Access + Revocable Refresh Tokens
Keep access tokens short (5–15 min) and store refresh token IDs in DB/Redis so compromised sessions can be revoked.`,
    examples: [
      ex('Misol 1: Stdlib `hashlib.scrypt` + Random Salt + `hmac.compare_digest`', 'Example 1: Production-Safe Stdlib Password Hashing', `import hashlib, hmac, secrets

def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    dk = hashlib.scrypt(password.encode("utf-8"), salt=salt.encode(), n=2**14, r=8, p=1)
    return f"scrypt\${salt}\${dk.hex()}"

def verify_password(password: str, stored: str) -> bool:
    _, salt, expected_hex = stored.split("$")
    dk = hashlib.scrypt(password.encode("utf-8"), salt=salt.encode(), n=2**14, r=8, p=1)
    return hmac.compare_digest(dk.hex(), expected_hex)

h1 = hash_password("Secret!99")
h2 = hash_password("Secret!99")
print("Different salts produce different hashes?", h1 != h2)
print("Valid check:", verify_password("Secret!99", h1), "| Wrong check:", verify_password("wrong", h1))`, `Different salts produce different hashes? True\nValid check: True | Wrong check: False`, 'Har bir parolga noyob `salt` berilgani uchun bir xil parollar ham har xil xeshga ega bo‘ladi.', 'Unique random salts defeat rainbow tables, and `hmac.compare_digest` stops timing attacks.'),
      ex('Misol 2: RBAC + Anti-IDOR Ownership Guard (`401` vs `403`)', 'Example 2: RBAC & Object-Ownership Access Guard', `def get_invoice(current_user: dict | None, invoice: dict) -> tuple[int, dict]:
    if not current_user:
        return 401, {"error": "Authentication required"}
    is_admin = current_user["role"] == "admin"
    is_owner = invoice["owner_id"] == current_user["id"]
    if not (is_admin or is_owner):
        return 403, {"error": "Forbidden: not your invoice"}
    return 200, invoice

inv = {"id": 501, "owner_id": 10, "amount": 250}
print("Anon:", get_invoice(None, inv))
print("Attacker ID=99:", get_invoice({"id": 99, "role": "user"}, inv))
print("Owner ID=10:", get_invoice({"id": 10, "role": "user"}, inv))
print("Admin:", get_invoice({"id": 1, "role": "admin"}, inv))`, `Anon: (401, {'error': 'Authentication required'})\nAttacker ID=99: (403, {'error': 'Forbidden: not your invoice'})\nOwner ID=10: (200, {'id': 501, 'owner_id': 10, 'amount': 250})\nAdmin: (200, {'id': 501, 'owner_id': 10, 'amount': 250})`, 'Token yo‘q -> `401`; boshqa birovning ID si -> `403` (IDOR to‘xtatildi!); egasi yoki admin -> `200`.', 'Stops IDOR cleanly by enforcing ownership alongside role permissions.'),
      ex('Misol 3: JWT Token Revocation List (`jti` Blocklist)', 'Example 3: Token Revocation via jti Blocklist', `revoked_jtis = {"tok_compromised_7"}

def verify_session(claims: dict | None) -> int:
    if not claims or claims["jti"] in revoked_jtis:
        return 401
    return 200

print("Revoked token:", verify_session({"sub": "u1", "jti": "tok_compromised_7"}))
print("Active token:", verify_session({"sub": "u1", "jti": "tok_fresh_8"}))`, `Revoked token: 401\nActive token: 200`, 'Logout qilingan yoki o‘g‘irlangan token `jti` ro‘yxati orqali darhol bekor qilinadi.', 'Checking `jti` against a revocation store lets you immediately invalidate stolen/logged-out tokens.'),
    ],
    traceTitleUz: 'AuthN (`401`) -> AuthZ (`403`) -> `200` qaror izi',
    traceTitleEn: 'Tracing AuthN vs AuthZ Gate',
    traceCode: `get_invoice(user={"id": 99, "role": "user"}, invoice={"owner_id": 10})`,
    traceSteps: [
      traceStep(1, 'Check current_user', 'present (id=99)', 'Authentication (401) dan o‘tdi', 'Passed AuthN'),
      traceStep(2, 'Check role/owner', 'user != admin and 99 != 10', 'Authorization muvaffaqiyatsiz', 'Failed AuthZ'),
      traceStep(3, 'Return', '403 Forbidden', 'IDOR hujumi bloklandi', 'Blocked IDOR with 403'),
    ],
    commonMistakes: [
      mistake('Parollarni `hashlib.sha256(pw.encode()).hexdigest()` bilan tuzsiz saqlash', 'Hashing Passwords with Fast Unsalted SHA-256', `# SHA-256 is built for speed—modern GPUs crack billions of unsalted SHA-256 passwords per second!`, 'Instant password crack on DB leak', `print("Always use Argon2id, bcrypt, or hashlib.scrypt with a random per-user salt!")`, 'Parollar uchun ataylab sekin KDF (`Argon2id` / `scrypt` / `PBKDF2`) va tasodifiy `salt` shart.', 'Use memory-hard / salted slow KDFs (`scrypt`/`Argon2id`) instead of SHA-256.', '`scrypt`/`Argon2id` ishlating.', 'Use slow salted KDFs.'),
      mistake('Birovning `/api/orders/{id}` yozuvini so‘raganda faqat loginni tekshirib egalikni unutish (IDOR)', 'Checking Authentication Without Resource Ownership (IDOR)', `# Checking @login_required alone lets any logged-in user read /api/invoices/1, 2, 3...!`, 'Mass data breach across users', `print("Always verify invoice.owner_id == current_user.id (unless admin)!")`, 'Login bo‘lish barcha foydalanuvchilar ma’lumotini ko‘rish huquqini bermaydi!', 'Authenticated users must only access resources they own or have explicit role access to.', 'Egalik (`owner_id`) ni doim tekshiring.', 'Enforce ownership checks.'),
    ],
    compareTitleUz: 'Stateful Sessions (Cookie) vs Stateless JWT',
    compareTitleEn: 'Server Sessions vs JWT Tokens',
    compareUz: ['Server Session (HttpOnly Cookie + Redis): 1 klikda darhol logout/revoke, XSS dan himoyalangan.', 'JWT (Bearer Token): mikroservislar va mobil ilovalarda qulay, lekin darhol revoke qilish uchun qisqa TTL + Refresh Token store kerak.'],
    compareEn: ['Server Sessions: instant revocation, HttpOnly XSS safety, ideal for web apps.', 'JWTs: portable across microservices/mobile; pair short access TTL with DB-backed refresh tokens.'],
    compareSummaryUz: 'Parollarni tuzli sekin KDF (`scrypt`) da saqlang, `401` (AuthN) va `403` (AuthZ) ni ajrating va har bir obyektda IDOR egalik tekshiruvini qo‘ying.',
    compareSummaryEn: 'Hash passwords with salted slow KDFs, separate `401` AuthN from `403` AuthZ, and enforce per-object ownership checks.',
    practiceTasks: [
      pt('p1409_1', '1-mashq: Tuzli `scrypt` verify', 'Task 1: Salted Scrypt Check', 'Parolni `hashlib.scrypt` bilan xeshlang va to‘g‘ri/xato parolni tekshiring.', 'Hash and verify password.', `import hashlib, hmac\ndk1 = hashlib.scrypt(b"pass1", salt=b"s1", n=1024, r=8, p=1)\ndk2 = hashlib.scrypt(b"pass1", salt=b"s1", n=1024, r=8, p=1)\nprint(hmac.compare_digest(dk1, dk2))`, 'True', 'Use scrypt + compare_digest', 'Prints True.'),
      pt('p1409_2', '2-mashq: `401` vs `403` RBAC', 'Task 2: Role Gatekeeper', 'Token `None` -> `401`, rol `"viewer"` -> `403`, `"admin"` -> `200`.', 'Check 401 vs 403.', `def gate(u):\n    if not u: return 401\n    return 200 if u["role"] == "admin" else 403\nprint(gate(None), gate({"role": "viewer"}), gate({"role": "admin"}))`, '401 403 200', 'Check None first, then role', 'Prints 401 403 200.'),
      pt('p1409_3', '3-mashq: IDOR Egalik Tekshiruvi', 'Task 3: Prevent IDOR', 'SQL da `WHERE id=? AND owner_id=?` bilan birovning yozuvini yashiring.', 'Filter query by owner_id.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE docs (id INT, owner_id INT, txt TEXT)")\nc.execute("INSERT INTO docs VALUES (7, 1, 'secret')")\nprint(c.execute("SELECT txt FROM docs WHERE id=? AND owner_id=?", (7, 2)).fetchone())`, 'None', 'Include AND owner_id=?', 'Prints None.'),
      pt('p1409_4', '4-mashq: Generic Login Error', 'Task 4: Prevent Enumeration', 'Yo‘q user va xato parol uchun bir xil `"Invalid credentials"` qaytaring.', 'Avoid user enumeration.', `def login_err(user_exists, pw_ok): return "OK" if (user_exists and pw_ok) else "Invalid credentials"\nprint(login_err(False, False) == login_err(True, False))`, 'True', 'Identical error message', 'Prints True.'),
      pt('p1409_5', '5-mashq: Role Permissions Map', 'Task 5: Permission Matrix', 'Rolga qarab `"delete:post"` ruxsatini tekshiring.', 'Check permission set.', `PERMS = {"admin": {"read", "delete"}, "user": {"read"}}\ndef can(role, p): return p in PERMS.get(role, set())\nprint(can("user", "delete"), can("admin", "delete"))`, 'False True', 'Lookup role in dict of sets', 'Prints False True.'),
    ],
    quiz: [
      q('q1409_1', 'Foydalanuvchi tizimga kirgan (`token` to‘g‘ri), lekin admin sahifasiga kirishga huquqi yo‘q — qaysi HTTP status?', 'Status code when an authenticated user lacks permission for an admin action?', ['401 Unauthorized', '403 Forbidden', '404 Not Found', '422'], ['401 Unauthorized', '403 Forbidden', '404 Not Found', '422'], 1, '`403 Forbidden`.', '`403 Forbidden`.'),
      q('q1409_2', 'Nima uchun parollarni saqlashda oddiy `SHA-256` o‘rniga `Argon2id` / `scrypt` / `PBKDF2` ishlatiladi?', 'Why use `Argon2id` / `scrypt` instead of `SHA-256` for password hashing?', ['Kichikroq satr', 'Ataylab sekin va xotira talab qiluvchi tuzli KDF brute-force hujumini million marta sekinlashtiradi', 'SHA-256 ishlamaydi', 'JSON uchun'], ['Shorter', 'Salted slow/memory-hard KDFs resist GPU brute-force attacks', 'Broken', 'JSON'], 1, 'Brute-force dan himoya qilish uchun.', 'Resists brute-force and rainbow tables.'),
      q('q1409_3', 'Foydalanuvchi ID=5 tizimga kirib `/api/orders/9` orqali ID=9 foydalanuvchi buyurtmasini ko‘ra olishi qanday zaiflik?', 'Vulnerability where user 5 reads user 9’s order by changing the URL ID?', ['CSRF', 'IDOR (Insecure Direct Object Reference)', 'SQLi', 'XSS'], ['CSRF', 'IDOR (Insecure Direct Object Reference)', 'SQLi', 'XSS'], 1, 'IDOR (object-level authorization yetishmasligi).', 'IDOR.'),
      q('q1409_4', 'Ikkita xeshni solishtirganda timing-attack dan himoyalanish uchun Python da qaysi funksiya ishlatiladi?', 'Python stdlib function for constant-time token/hash comparison?', ['==', 'hmac.compare_digest()', 'str.equals()', 'is'], ['==', 'hmac.compare_digest()', 'str.equals()', 'is'], 1, '`hmac.compare_digest()`.', '`hmac.compare_digest()`.'),
      q('q1409_5', 'Login da "Email topilmadi" vs "Parol xato" o‘rniga nima uchun yagona "Email yoki parol xato" qaytariladi?', 'Why return an identical generic error whether email is missing or password is wrong?', ['Tezroq', 'User Enumeration (ro‘yxatdan o‘tgan emaillarni aniqlab olish) ning oldini olish uchun', 'Kamroq kod', 'HTTP talabi'], ['Faster', 'Prevents User Enumeration of valid accounts', 'Less code', 'HTTP spec'], 1, 'User Enumeration hujumini oldini olish uchun.', 'Prevents account enumeration.'),
    ],
    homework: hw('RBAC + Salted Scrypt Auth Servisi', 'AuthN / AuthZ Security Module', 'Foydalanuvchi ro‘yxatdan o‘tishi (`scrypt` salt bilan), login (`hmac.compare_digest` + generic error), RBAC rol tekshiruvi (`admin`/`editor`/`user`) va IDOR ga qarshi `owner_id` tekshiruvi bo‘lgan modul yozing.', 'Build a complete AuthN/AuthZ security module with salted `scrypt` hashing, constant-time verification, RBAC permissions, and anti-IDOR ownership guards.', ['scrypt + random salt', '401 vs 403 va IDOR testlari'], ['Salted scrypt', '401/403 + anti-IDOR tests'], 'Never store raw passwords or return password_hash in user payloads.', 'Hardened auth core.', 'Token `jti` blocklist va `logout` endpointini qo‘shing.', 'Add token revocation.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-10',
    courseId: 'web_backend',
    moduleId: 'c14_m3',
    order: 10,
    titleUz: 'Middleware — Request/Response Pipeline, CORS, Rate Limit va Tracing',
    titleEn: 'Middleware: Onion Pipeline, CORS, Request IDs & Rate Limiting',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['PY-14-09'],
    conceptId: 'be_middleware',
    whyUz: "50 ta endpointning har biriga qo‘lda vaqt o‘lchash, `X-Request-ID`, CORS sarlavhalari, Rate Limiting va markaziy xato ushlash kodini yozib chiqish — mashaqqatli va xatoga boy. **Middleware** \"piyoz qatlamlari\" (Onion Model) kabi barcha so‘rovlarni endpointga kirishdan OLDIN va javob chiqishidan KEYIN avtomatik o‘tkazadi!",
    whyEn: 'Master the ASGI/WSGI Middleware onion model for cross-cutting concerns: Request ID correlation (`X-Request-ID`), latency timing, strict CORS origin allowlisting, token-bucket rate limiting (`429`), and global error envelopes.',
    analogyUz: "**Middleware** — bank binosiga kirishdagi xavfsizlik darvozalari: 1-darvoza — sumkani tekshiradi (CORS/Rate Limit), 2-darvoza — kirish talonini beradi (`X-Request-ID`), keyin siz kassa (Endpoint) ga kirasiz, chiqishda esa qancha vaqt ketganini qayd etadi (`X-Process-Time`)!",
    analogyEn: 'Middleware layers wrap your route handlers like onion skins—running pre-request checks (rate limits, request IDs) before the handler and post-processing headers/logs on the way out.',
    stopsUz: "Middleware da 3 ta jiddiy tuzoq: 1) **`Access-Control-Allow-Origin: *` bilan `Allow-Credentials: true`** birga ishlashiga brauzerlar ruxsat bermaydi (xavfsizlik teshigi!) — doim **aniq frontend domenlarini allowlist** qiling! 2) ASGI Middleware da `request.body()` ni o‘qib qo‘ysangiz stream tugab qolib endpoint body ni ololmaydi. 3) Og‘ir biznes mantiqni middleware ga tiqmang!",
    stopsEn: 'Never combine wildcard `Access-Control-Allow-Origin: *` with `Allow-Credentials: true` (browsers reject it; always allowlist explicit origins). Keep middleware lightweight and avoid consuming streaming request bodies blindly.',
    objUz: ['Middleware "Onion" (kirish -> endpoint -> chiqish) bajarilish tartibini tushunish', '`X-Request-ID`, `X-Process-Time-Ms` va Global Exception Middleware tuzish', 'CORS (`OPTIONS` preflight, allowlist origins) va Rate Limiting (`429 Too Many Requests` + `Retry-After`)'],
    objEn: ['Trace onion-model execution order across chained middlewares', 'Inject `X-Request-ID` correlation IDs and latency headers cleanly', 'Configure strict CORS allowlists and token-bucket rate limiters (`429`)'],
    theoryUz: `### 1. Onion (Piyoz) Modeli
Agar \`LoggingMW\` tashqida, \`AuthMW\` ichkarida bo‘lsa:
\`Logging(in) -> Auth(in) -> Endpoint -> Auth(out) -> Logging(out)\`.
### 2. Request Correlation (\`X-Request-ID\`)
Har so‘rovga noyob UUID berilib javob sarlavhasiga va barcha loglarga yoziladi — shunda production xatoni soniyada topasiz!
### 3. CORS (\`Access-Control-Allow-Origin\`)
Brauzer \`https://app.uz\` dan \`https://api.uz\` ga so‘rov yuborganda ruxsat so‘raydi (\`OPTIONS\` preflight). **Allowlist** (\`ALLOWED_ORIGINS = {"https://app.uz"}\`) ishlating — wildcard \`*\` + cookie mumkin emas!
### 4. Rate Limiting (\`429 Too Many Requests\`)
Login/OTP/API endpointlarini DDoS va brute-force dan himoyalash uchun IP/User bo‘yicha kvota + \`Retry-After\` header!`,
    theoryEn: `### 1. The Middleware Onion Model
Outer middlewares execute first on the request path and last on the response path.
### 2. Correlation IDs & Latency Timing
Attach a UUID \`X-Request-ID\` (reusing trusted inbound IDs or generating fresh ones) and measure \`time.perf_counter()\` duration.
### 3. Strict CORS Policies
Verify \`Origin\` against an explicit allowlist rather than \`*\`, especially when cookies/credentials are permitted.
### 4. Rate Limiting (\`429\`)
Enforce sliding-window or token-bucket quotas and include a \`Retry-After\` header on \`429\` rejections.`,
    examples: [
      ex('Misol 1: Zanjirli Middleware Onion Pipeline (`RequestID -> RateLimit -> Route`)', 'Example 1: Chained Middleware Onion Pipeline', `def make_request_id_mw(next_fn):
    counter = 0
    def mw(req: dict) -> tuple[int, dict, dict]:
        nonlocal counter
        counter += 1
        req["req_id"] = f"req-{counter}"
        st, hdrs, body = next_fn(req)
        hdrs["X-Request-ID"] = req["req_id"]
        return st, hdrs, body
    return mw

def make_rate_limit_mw(limit: int, next_fn):
    counts: dict[str, int] = {}
    def mw(req: dict) -> tuple[int, dict, dict]:
        ip = req["ip"]
        counts[ip] = counts.get(ip, 0) + 1
        if counts[ip] > limit:
            return 429, {"Retry-After": "60"}, {"error": "Too Many Requests"}
        return next_fn(req)
    return mw

def endpoint(req: dict):
    return 200, {}, {"ok": True, "rid": req["req_id"]}

app = make_request_id_mw(make_rate_limit_mw(2, endpoint))
for _ in range(3):
    print(app({"ip": "1.2.3.4"}))`, `(200, {'X-Request-ID': 'req-1'}, {'ok': True, 'rid': 'req-1'})\n(200, {'X-Request-ID': 'req-2'}, {'ok': True, 'rid': 'req-2'})\n(429, {'Retry-After': '60', 'X-Request-ID': 'req-3'}, {'error': 'Too Many Requests'})`, '3-so‘rov rate limit dan oshganda endpointga yetmasdan `429` qaytdi, lekin tashqi `RequestID` middleware baribir `X-Request-ID` qo‘shdi!', 'Outer Request-ID middleware wraps the rate limiter so even `429` rejections receive correlation headers.'),
      ex('Misol 2: CORS Origin Allowlist Tekshiruvi', 'Example 2: Explicit CORS Origin Allowlist', `ALLOWED_ORIGINS = {"https://pythonmastery.uz", "http://localhost:3000"}

def cors_headers(origin: str) -> dict[str, str]:
    if origin in ALLOWED_ORIGINS:
        return {"Access-Control-Allow-Origin": origin, "Access-Control-Allow-Credentials": "true"}
    return {}

print("Trusted:", cors_headers("https://pythonmastery.uz"))
print("Evil site:", cors_headers("https://evil.com"))`, `Trusted: {'Access-Control-Allow-Origin': 'https://pythonmastery.uz', 'Access-Control-Allow-Credentials': 'true'}\nEvil site: {}`, 'Faqat aniq allowlist dagi domenlargagina `Access-Control-Allow-Origin` qaytariladi.', 'Reflects `Access-Control-Allow-Origin` strictly for explicitly allowlisted origins.'),
      ex('Misol 3: Global Exception Middleware (Stack Trace Yashirish)', 'Example 3: Global Error Catcher Middleware', `def safe_middleware(handler):
    def wrap(req):
        try:
            return handler(req)
        except Exception:
            return 500, {"error": "Internal Server Error", "req_id": req.get("req_id")}
    return wrap

@safe_middleware
def buggy(req): raise RuntimeError("DB password leaked in traceback!")

print(buggy({"req_id": "r-99"}))`, `(500, {'error': 'Internal Server Error', 'req_id': 'r-99'})`, 'Ichki xato matni foydalanuvchiga emas server logiga ketadi, mijozga esa faqat xavfsiz `500` va `req_id` qaytadi.', 'Prevents internal stack traces from leaking to API clients while returning a traceable `req_id`.'),
    ],
    traceTitleUz: 'Middleware Onion Tartibi Trace',
    traceTitleEn: 'Tracing Middleware Onion Order',
    traceCode: `app = timing_mw(auth_mw(endpoint))`,
    traceSteps: [
      traceStep(1, 'timing_mw enter', 'start timer', 'Tashqi middleware boshlandi', 'Outer middleware starts clock'),
      traceStep(2, 'auth_mw enter', 'validates token', 'Ichki auth middleware tekshirdi', 'Inner auth validates token'),
      traceStep(3, 'endpoint()', '200 OK', 'Asosiy handler ishladi', 'Core route returns 200'),
      traceStep(4, 'timing_mw exit', 'sets X-Process-Time', 'Tashqi middleware javobga header yozdi', 'Outer adds timing header'),
    ],
    commonMistakes: [
      mistake('CORS da `allow_origins=["*"]` bilan `allow_credentials=True` ni birga yoqish', 'Combining CORS Wildcard * with Credentials', `# Browsers BLOCK Access-Control-Allow-Origin: * when Access-Control-Allow-Credentials: true!`, 'CORS preflight error & security flaw', `print("Explicitly list trusted frontend origins in allow_origins!")`, 'Wildcard `*` va credentials birga ishlashi standartga zid va xavfli.', 'Spec forbids `*` with credentials; always specify exact allowed origins.', 'Aniq domenlar ro‘yxatini yozing.', 'Use explicit origin allowlist.'),
      mistake('Auth dan OLDIN og‘ir rate-limit/body-parse qilmaslik yoki ichki stack traceni qaytarish', 'Exposing Raw Python Tracebacks in 500 Errors', `# Returning str(exc) or traceback.format_exc() exposes SQL table names and file paths!`, 'Information disclosure vulnerability', `print("Log full traceback server-side; return generic 500 + request_id to client!")`, 'Xatoni serverda to‘liq loglang, mijozga esa faqat `request_id` ko‘rsating.', 'Never return raw exception strings or tracebacks in production JSON responses.', 'Global exception middleware qo‘ying.', 'Catch unhandled errors cleanly.'),
    ],
    compareTitleUz: 'Middleware vs FastAPI Dependency (`Depends()`)',
    compareTitleEn: 'Middleware vs Per-Route Dependencies',
    compareUz: ['Middleware: HAMMA marshrutlarga birdek tegishli ishlarda (Logging, Timing, CORS, Request ID).', '`Depends()`: aniq route guruhiga kerakli Auth, DB Session, Permission tekshiruvlarida.'],
    compareEn: ['Middleware: global cross-cutting concerns (CORS, timing, Request ID, global error envelope).', 'Dependencies (`Depends`): route-specific auth scopes, DB sessions, and resource loaders.'],
    compareSummaryUz: 'CORS, Request-ID, Rate Limit va xato tutishni Middleware da hal qiling, endpointga xos RBAC/DB ni esa `Depends()` ga qoldiring.',
    compareSummaryEn: 'Handle global cross-cutting tasks (CORS, Request IDs, rate limiting, global errors) in middleware and route-specific auth/DB in `Depends()`.',
    practiceTasks: [
      pt('p1410_1', '1-mashq: Onion bajarilish tartibi', 'Task 1: Verify Onion Order', '2 ta middleware kirish/chiqish izini listga yig‘ing.', 'Trace onion sequence.', `log = []\ndef mw(name, nxt):\n    def f(): log.append(name + "_in"); r = nxt(); log.append(name + "_out"); return r\n    return f\nmw("A", mw("B", lambda: log.append("H")))()\nprint(log)`, "['A_in', 'B_in', 'H', 'B_out', 'A_out']", 'Before and after nxt()', 'Prints exact onion list.'),
      pt('p1410_2', '2-mashq: CORS Origin Tekshiruvi', 'Task 2: CORS Preflight Check', 'Faqat `"https://site.uz"` uchun CORS header qaytaring.', 'Allow trusted origin only.', `def cors(o): return o if o in {"https://site.uz"} else None\nprint(cors("https://site.uz"), cors("https://bad.uz"))`, 'https://site.uz None', 'Set membership check', 'Prints allowed origin and None.'),
      pt('p1410_3', '3-mashq: Token Bucket Rate Limiter', 'Task 3: Fixed Quota Gate', 'Limit=3 dan oshganda `429` qaytaring.', 'Return 429 over quota.', `hits = 0\ndef req():\n    global hits\n    hits += 1\n    return 429 if hits > 3 else 200\nprint([req() for _ in range(5)])`, '[200, 200, 200, 429, 429]', 'Increment and compare > 3', 'Prints [200, 200, 200, 429, 429].'),
      pt('p1410_4', '4-mashq: `X-Request-ID` saqlash', 'Task 4: Preserve or Generate ID', 'Inbound `X-Request-ID` bo‘lsa shuni, bo‘lmasa `"gen-1"` qaytaring.', 'Reuse inbound Request-ID.', `def get_rid(hdrs): return hdrs.get("X-Request-ID") or "gen-1"\nprint(get_rid({"X-Request-ID": "abc"}), get_rid({}))`, 'abc gen-1', 'Fallback to generated ID', 'Prints abc gen-1.'),
      pt('p1410_5', '5-mashq: Xavfsiz 500 Error Middleware', 'Task 5: Mask Internal Error', '`ZeroDivisionError` ni tutib `500` JSON qaytaring.', 'Mask internal exception.', `def wrap(fn):\n    try: return fn()\n    except Exception: return (500, {"error": "Internal error"})\nprint(wrap(lambda: 1 / 0))`, "(500, {'error': 'Internal error'})", 'Catch Exception cleanly', "Prints (500, {'error': 'Internal error'})."),
    ],
    quiz: [
      q('q1410_1', '`M1(M2(endpoint))` ko‘rinishida Middleware lar qaysi tartibda ishlaydi?', 'Execution order for `M1(M2(endpoint))`?', ['M2 -> M1 -> endpoint', 'M1(in) -> M2(in) -> endpoint -> M2(out) -> M1(out)', 'Faqat M1', 'Tasodifiy'], ['M2 -> M1 -> endpoint', 'M1(in) -> M2(in) -> endpoint -> M2(out) -> M1(out)', 'M1 only', 'Random'], 1, 'Onion (piyoz) tartibida.', 'Onion model order.'),
      q('q1410_2', 'Rate limit dan oshgan mijozga qaysi HTTP status va sarlavha qaytariladi?', 'HTTP status and helpful header for rate-limited clients?', ['400', '429 Too Many Requests + Retry-After', '503', '403'], ['400', '429 Too Many Requests + Retry-After', '503', '403'], 1, '`429` va `Retry-After`.', '`429` with `Retry-After`.'),
      q('q1410_3', 'Nima uchun CORS da `Access-Control-Allow-Origin: *` bilan `Allow-Credentials: true` ni birga yozish mumkin emas?', 'Why is `Allow-Origin: *` incompatible with `Allow-Credentials: true`?', ['Tezlik', 'Xavfsizlik standarti cookie/credential yuborilganda faqat aniq allowlist domenlarini talab qiladi', 'JSON buziladi', 'GET ishlamaydi'], ['Speed', 'Browser security forbids wildcard origins when sending credentials/cookies', 'JSON', 'GET'], 1, 'Brauzer xavfsizlik qoidasi aniq domenlarni talab qiladi.', 'Browser CORS spec requires explicit origins with credentials.'),
      q('q1410_4', 'Har bir so‘rovga `X-Request-ID` biriktirishning asosiy foydasi?', 'Main operational benefit of attaching `X-Request-ID` to every request and response?', ['Shifrlash', 'Distributed loglar va mijoz xatolarini aniq bir so‘rovga bog‘lash (correlation)', 'SQL tezlatish', 'Keshlash'], ['Encryption', 'Correlates client bug reports with exact backend log lines across services', 'SQL speed', 'Caching'], 1, 'Loglarni tezkor qidirish va kuzatuvchanlik.', 'End-to-end request tracing.'),
      q('q1410_5', 'Route-spesifik Auth/RBAC ni qayerga qo‘yish qulayroq?', 'Better placement for route-specific Auth scopes and DB session injection?', ['Global Middleware', 'FastAPI `Depends()` / route decorator', 'HTML template', 'settings.py'], ['Global Middleware', 'FastAPI `Depends()` / route decorator', 'HTML', 'settings.py'], 1, '`Depends()` / route decorator.', 'Per-route dependencies (`Depends()`).'),
    ],
    homework: hw('Backend Middleware To‘plami', 'Request-ID, CORS, Timing & Rate-Limit Middleware', '`X-Request-ID` yaratuvchi, aniq originli CORS qo‘shuvchi, `X-Process-Time-Ms` o‘lchovchi va IP bo‘yicha `429 Retry-After` qaytaruvchi 4 qatlamli middleware zanjirini tuzing.', 'Compose a 4-layer middleware stack adding `X-Request-ID`, strict CORS headers, `X-Process-Time-Ms` timing, and per-IP `429` rate limiting.', ['4 ta mustaqil middleware funksiyasi', 'Onion tartibi va 429/CORS testlari'], ['4 composable middlewares', 'Test onion order, CORS & 429'], 'Each middleware accepts `next_handler` and returns a wrapped `(req) -> (status, headers, body)` function.', 'Clean composable pipeline.', 'Global `500` xato ushlagich qatlamini ham qo‘shing.', 'Add global 500 wrapper.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-11',
    courseId: 'web_backend',
    moduleId: 'c14_m4',
    order: 11,
    titleUz: 'Background Tasks va Queues — Celery, Redis, Retries va Idempotency',
    titleEn: 'Background Tasks & Message Queues: Workers, Retries & Idempotency',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-14-10'],
    conceptId: 'be_background_tasks',
    whyUz: "Foydalanuvchi \"Buyurtmani tasdiqlash\" tugmasini bosganda API unga 5 soniya PDF chek yasab, Email jo‘natib, rasm o‘lchamini kichraytirib kutib tursa — HTTP so‘rov timeout bo‘lib yiqiladi! Og‘ir ishlarni **`202 Accepted` bilan navbatga (Queue) tashlab** darhol javob berish backendni chaqmoqdek tez va chidamli qiladi.",
    whyEn: 'Offload slow email, PDF, and webhook work out of the HTTP request lifecycle: contrast in-process `BackgroundTasks` with durable broker-backed Celery/RQ/ARQ queues, exponential backoff retries, Idempotency keys, and Dead-Letter Queues (DLQ).',
    analogyUz: "**Sinxron HTTP** — kafeda oshpaz sizning palovingiz pishguncha kassa navbatini to‘xtatib kutib turishi! **Message Queue (Redis/RabbitMQ + Worker)** — kassir sizga darhol chek (`202 Accepted, job_id=42`) beradi, buyurtma oshxona lentasiga tushadi va bo‘sh oshpazlar (Workerlar) uni orqada bajaradi!",
    analogyEn: 'A message queue acts like a kitchen ticket rail: the API hands back `202 Accepted` immediately while separate worker processes pick up tickets reliably—even across restarts.',
    stopsUz: "Background tasklarda 3 ta xavfli xato: 1) **FastAPI `BackgroundTasks` muhim to‘lov/email uchun ishonchsiz**: server restart bo‘lsa xotiradagi tasklar yo‘qoladi — muhim ishlar uchun **Redis + Celery/ARQ/RQ** ishlating! 2) **ORM obyektini emas, faqat `order_id` ni navbatga yuboring** (worker o‘z yangi DB sessiyasidan o‘qiydi). 3) Har bir task **Idempotent** bo‘lsin (2 marta ishlasa ham mijozga 2 ta email/yechim ketmasin!).",
    stopsEn: 'In-process `BackgroundTasks` vanish on server restarts—use durable Redis/RabbitMQ workers (Celery/ARQ) for critical jobs. Pass entity IDs (never live ORM objects) to workers, and make tasks idempotent.',
    objUz: ['Sinxron API (`200`) vs Asinxron Job (`202 Accepted` + Status polling)', 'In-Process `BackgroundTasks` vs Durable Broker (`Celery` / `ARQ` + `Redis`) farqi', 'Retry with Exponential Backoff, Dead-Letter Queue (DLQ) va Task Idempotency'],
    objEn: ['Return `202 Accepted` with job IDs for long-running work', 'Contrast in-memory `BackgroundTasks` with durable broker queues', 'Implement bounded retries, Dead-Letter Queues (DLQ), and idempotent consumers'],
    theoryUz: `### 1. \`202 Accepted\` Pattern
1. \`POST /reports\` -> DB da \`jobs\` qatori (\`status="pending"\`) yaratiladi -> **\`202 Accepted {"job_id": "j1"}\`** qaytariladi.
2. Mijoz \`GET /jobs/j1\` bilan natijani tekshiradi.
### 2. \`BackgroundTasks\` vs Celery/Redis
- \`BackgroundTasks\`: bitta Uvicorn jarayoni ichida (tez, lekin server o‘chsa yo‘qoladi!).
- **Celery / ARQ + Redis/RabbitMQ**: alohida Worker konteynerlar, qayta urinish, navbat saqlanishi.
### 3. Idempotent Worker & Dead-Letter Queue (DLQ)
Worker 1-marta muvaffaqiyatli yuborib, \`ack\` dan oldin o‘chib qolsa, task 2-marta kelishi mumkin — \`sent_keys\` / DB holati bilan dublikatni to‘xtating! \`max_retries=3\` dan keyin ham yiqilsa — **DLQ** ga o‘tkazing!`,
    theoryEn: `### 1. The \`202 Accepted\` Async Job Flow
Persist a pending job record, enqueue its ID, return \`202 Accepted\`, and expose \`GET /jobs/{id}\` for status/result polling.
### 2. In-Process vs Durable Broker Queues
In-process \`BackgroundTasks\` fit trivial fire-and-forget logs; durable queues (Redis + Celery/ARQ) survive crashes and scale horizontally across workers.
### 3. Retries, Idempotency & DLQ
Bound retries with exponential backoff, enforce idempotency via DB status checks, and route permanently failing jobs to a Dead-Letter Queue (DLQ) for inspection.`,
    examples: [
      ex('Misol 1: Durable Job Queue + Bounded Retries + Dead-Letter Queue (DLQ)', 'Example 1: Job Queue with Retries & Dead-Letter Queue', `from collections import deque

queue = deque([{"id": "j1", "kind": "email", "attempts": 0}, {"id": "j2", "kind": "bad_pdf", "attempts": 0}])
dlq, done = [], []
MAX_RETRIES = 2

while queue:
    job = queue.popleft()
    job["attempts"] += 1
    try:
        if job["kind"] == "bad_pdf":
            raise RuntimeError("corrupt input")
        done.append(job["id"])
    except Exception as err:
        if job["attempts"] <= MAX_RETRIES:
            queue.append(job)
        else:
            dlq.append({"id": job["id"], "error": str(err)})

print("Done:", done, "| DLQ:", dlq)`, `Done: ['j1'] | DLQ: [{'id': 'j2', 'error': 'corrupt input'}]`, 'Qayta urinishlar chegarasidan oshgan buzuq vazifa cheksiz aylanmasdan Dead-Letter Queue ga o‘tkazildi.', 'Failing jobs retry up to `MAX_RETRIES` before moving safely into the Dead-Letter Queue.'),
      ex('Misol 2: Worker Idempotency (Dublikat Xabar Oldini Olish)', 'Example 2: Idempotent Worker Execution', `processed_keys: set[str] = set()
sent_emails: list[str] = []

def send_welcome_task(idempotency_key: str, email: str) -> str:
    if idempotency_key in processed_keys:
        return "skipped_duplicate"
    processed_keys.add(idempotency_key)
    sent_emails.append(email)
    return "sent"

print(send_welcome_task("welcome:u1", "ali@uz.dev"))
print(send_welcome_task("welcome:u1", "ali@uz.dev"))
print("Emails actually sent:", sent_emails)`, `sent\nskipped_duplicate\nEmails actually sent: ['ali@uz.dev']`, 'Xabar navbatdan tasodifan 2 marta yetkazilsa ham, mijozga faqat 1 ta email ketdi!', 'Idempotency keys prevent duplicate side effects under at-least-once queue delivery.'),
      ex('Misol 3: `202 Accepted` Job Status Machine', 'Example 3: Async Job Lifecycle (`pending` -> `done`)', `jobs = {}
def submit_export(jid: str) -> tuple[int, dict]:
    jobs[jid] = {"status": "pending", "result": None}
    return 202, {"job_id": jid, "status": "pending"}

def run_worker(jid: str):
    jobs[jid] = {"status": "completed", "result": "/downloads/r.csv"}

print("POST:", submit_export("j99"))
run_worker("j99")
print("GET:", jobs["j99"])`, `POST: (202, {'job_id': 'j99', 'status': 'pending'})\nGET: {'status': 'completed', 'result': '/downloads/r.csv'}`, 'Mijoz `202` ni darhol olib, keyin `GET` orqali natijani oladi.', 'Decouples HTTP response latency from heavy background execution.'),
    ],
    traceTitleUz: 'Queue Retry -> DLQ izi',
    traceTitleEn: 'Tracing Worker Retry & DLQ',
    traceCode: `job={"id":"j2", attempts:0}, MAX_RETRIES=2`,
    traceSteps: [
      traceStep(1, 'Attempt 1', 'attempts=1, fails -> requeue', 'Qayta navbatga qo‘yildi', 'Requeued after failure 1'),
      traceStep(2, 'Attempt 2', 'attempts=2, fails -> requeue', 'Ikkinchi urinish ham yiqildi', 'Requeued after failure 2'),
      traceStep(3, 'Attempt 3', 'attempts=3 > MAX -> DLQ', 'DLQ ga ajratildi', 'Moved to DLQ'),
    ],
    commonMistakes: [
      mistake('Worker ga `User` SQLAlchemy ORM obyektini to‘g‘ridan-to‘g‘ri uzatish', 'Passing Live ORM Objects into Task Queues', `# Celery serializes payloads to JSON—passing ORM objects fails or leaks stale DB state!`, 'Serialization TypeError / stale data', `print("Pass only primitive IDs like order_id=42 and reload inside the worker!")`, 'Navbatga faqat `id` yuboring, worker esa o‘zi DB dan yangi sessiyada yuklab oladi.', 'Task payloads must be small JSON-serializable IDs, not live ORM instances.', 'Faqat `entity_id` yuboring.', 'Enqueue primitive IDs only.'),
      mistake('`max_retries` siz cheksiz qayta urinish yozib navbatni tiqib qo‘yish', 'Infinite Unbounded Retries Poisoning the Queue', `# A corrupt task retrying forever fills CPU and blocks healthy tasks in the queue!`, 'Poison-pill outage blocking healthy jobs', `print("Always bound max_retries + exponential backoff + Dead-Letter Queue!")`, 'Buzuq task (`poison pill`) cheksiz aylanib qolmasligi uchun DLQ shart.', 'Unbounded retries turn one bad payload into a queue outage; cap retries and move failures to DLQ.', '`max_retries` va DLQ ishlating.', 'Cap retries and route to DLQ.'),
    ],
    compareTitleUz: 'FastAPI `BackgroundTasks` vs Celery/ARQ + Redis',
    compareTitleEn: 'In-Process `BackgroundTasks` vs Durable Brokers',
    compareUz: ['`BackgroundTasks`: engil va yo‘qolishi qo‘rqinchli bo‘lmagan ishlar (metrika, kichik log).', 'Celery / ARQ + Redis: to‘lov, email, hisobotlar — restartga chidamli, retry/DLQ li va gorizontal kengayuvchi workerlar.'],
    compareEn: ['`BackgroundTasks`: lightweight, non-critical post-response tasks.', 'Celery/ARQ + Redis: durable, retryable, horizontally scalable queues for critical business work.'],
    compareSummaryUz: 'Og‘ir ishlarni `202 Accepted` bilan navbatga chiqaring, broker ga faqat primitive ID yuboring, taskni idempotent qiling va cheklangan retry + DLQ qo‘ying.',
    compareSummaryEn: 'Offload slow work via `202 Accepted`, pass primitive IDs to durable queues, enforce idempotency, and pair bounded retries with a DLQ.',
    practiceTasks: [
      pt('p1411_1', '1-mashq: `202 Accepted` Job yaratish', 'Task 1: Return 202 Accepted', 'Jobni `"queued"` holatda saqlab `202` qaytaring.', 'Enqueue job and return 202.', `jobs = {}\ndef enqueue(jid):\n    jobs[jid] = "queued"\n    return 202, {"job_id": jid}\nprint(enqueue("job-7"))`, "(202, {'job_id': 'job-7'})", 'Store status and return 202', 'Prints 202 tuple.'),
      pt('p1411_2', '2-mashq: DLQ ga ko‘chirish', 'Task 2: Dead-Letter Overflow', '`attempts >= 3` bo‘lsa DLQ ro‘yxatiga qo‘shing.', 'Move poisoned task to DLQ.', `dlq, q = [], []\ndef handle(job, ok):\n    if not ok:\n        job["tries"] += 1\n        (dlq if job["tries"] >= 3 else q).append(job)\njob = {"id": 1, "tries": 2}\nhandle(job, False)\nprint("DLQ len:", len(dlq))`, 'DLQ len: 1', 'Route after 3 failures', 'Prints DLQ len: 1.'),
      pt('p1411_3', '3-mashq: Idempotent Task Guard', 'Task 3: Skip Duplicate Delivery', '`seen` to‘plami bilan taskni faqat 1 marta bajaring.', 'Deduplicate task run.', `seen, count = set(), 0\ndef run(k):\n    global count\n    if k not in seen: seen.add(k); count += 1\nrun("k1"); run("k1")\nprint(count)`, '1', 'Check key in seen set', 'Prints 1.'),
      pt('p1411_4', '4-mashq: Backoff hisoblash', 'Task 4: Exponential Backoff', 'Urinish `n=1,2,3` uchun `2 ** (n-1)` kechikishni chiqaring.', 'Compute backoff delays.', `print([2 ** (n - 1) for n in (1, 2, 3, 4)])`, '[1, 2, 4, 8]', '2 ** (n - 1)', 'Prints [1, 2, 4, 8].'),
      pt('p1411_5', '5-mashq: Primitive ID Payload', 'Task 5: JSON-Safe Task Args', 'Job payloadini JSON serialize qilib tekshiring.', 'Verify JSON-safe payload.', `import json\nprint(json.dumps({"task": "send_receipt", "order_id": 42}))`, '{"task": "send_receipt", "order_id": 42}', 'Serialize IDs only', 'Prints JSON payload.'),
    ],
    quiz: [
      q('q1411_1', 'Og‘ir PDF/Email vazifasini qabul qilgan API darhol qaysi HTTP statusni qaytarishi to‘g‘ri?', 'Best HTTP status returned immediately when enqueueing an async background job?', ['200 OK', '202 Accepted', '408 Timeout', '503'], ['200 OK', '202 Accepted', '408 Timeout', '503'], 1, '`202 Accepted`.', '`202 Accepted`.'),
      q('q1411_2', 'Server qayta ishga tushganda xotiradagi `BackgroundTasks` ning asosiy kamchiligi?', 'Primary limitation of in-process `BackgroundTasks` compared to Redis/Celery?', ['Sekin JSON', 'Server restart yoki crash bo‘lsa bajarilmagan vazifalar butunlay yo‘qoladi', 'Python 3.12 kerak', 'CORS buziladi'], ['Slow JSON', 'Queued in-memory tasks are lost forever if the server process restarts or crashes', 'Python 3.12', 'CORS'], 1, 'Process o‘chsa tasklar yo‘qoladi.', 'Lost on process crash/restart.'),
      q('q1411_3', 'Qayta urinishlar (`max_retries`) tugagandan keyin ham yiqilgan xabarlar qayerga o‘tkaziladi?', 'Where do permanently failing tasks go after exhausting `max_retries`?', ['O‘chirib yuboriladi', 'Dead-Letter Queue (DLQ) ga tekshirish uchun', 'Browserga', 'DNS ga'], ['Deleted silently', 'Dead-Letter Queue (DLQ) for inspection and replay', 'Browser', 'DNS'], 1, 'Dead-Letter Queue (DLQ).', 'Dead-Letter Queue (DLQ).'),
      q('q1411_4', 'Nima uchun Celery/RQ taskiga `User` ORM obyekti emas, faqat `user_id` yuboriladi?', 'Why pass `user_id` instead of a live ORM `User` object to background workers?', ['Qisqaroq', 'ORM obyekt JSON bo‘lmaydi va worker ishga tushguncha eskirib qolishi mumkin', 'SQL taqiqlaydi', 'CORS'], ['Shorter', 'ORM objects aren’t cleanly JSON-serializable and become stale before worker execution', 'SQL', 'CORS'], 1, 'Serialization va stale-state xavfi.', 'JSON safety and fresh DB reads.'),
      q('q1411_5', 'Bir xil `email:order_9` taski 2 marta yetkazilganda mijozga faqat 1 ta xat ketishi qanday xossa?', 'Property ensuring a task executing multiple times produces the same side effect as once?', ['Polymorphism', 'Idempotency', 'Concurrency', 'Sharding'], ['Polymorphism', 'Idempotency', 'Concurrency', 'Sharding'], 1, 'Idempotency.', 'Idempotency.'),
    ],
    homework: hw('Resilient Async Job Worker Dvigateli', 'Broker Queue with Retries, Idempotency & DLQ', '`submit_job` (`202 Accepted`), `idempotency_key` tekshiruvi, `max_retries` bilan exponential backoff jadvali va yiqilgan vazifalarni `DLQ` ga oluvchi worker tizimini yozing.', 'Build a queue runner supporting `202 Accepted` submission, idempotency deduplication, bounded exponential backoff, and Dead-Letter Queue isolation.', ['Idempotent execution + bounded retries + DLQ', 'Pending -> Completed/Failed holatlari'], ['Idempotency + retries + DLQ', 'Full job state machine'], 'Track attempts count on each job and check idempotency key before side effects.', 'Durable worker logic.', 'Dead-letterdan taskni tuzatib qayta ishga tushiruvchi `replay_dlq()` funksiyasini qo‘shing.', 'Add replay_dlq().', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-12',
    courseId: 'web_backend',
    moduleId: 'c14_m4',
    order: 12,
    titleUz: 'To‘liq Backend Loyiha — Layered API, Auth, DB, Middleware va Tests',
    titleEn: 'Full-Stack Backend Capstone: Layered API, Auth, SQLite & Integration Tests',
    difficulty: 'advanced',
    estimatedMinutes: 45,
    prerequisites: ['PY-14-11'],
    conceptId: 'be_capstone',
    whyUz: "Endi 14-kursda o‘rgangan barcha qismlarni — **Settings, Layered Architecture (Router -> Service -> Repo), Schema Validation, Salted Scrypt Auth, RBAC/Anti-IDOR, Middleware (RequestID + Rate Limit), va Integration Tests** — yagona ishlaydigan Backend tizimiga yig‘amiz!",
    whyEn: 'Unite every layer of modern backend engineering into one cohesive, testable application: Config, SQLite Repository, Service domain errors, Scrypt Auth & RBAC, Middleware stack, Async Jobs, and automated end-to-end integration tests.',
    analogyUz: "**To‘liq Backend Loyiha** — bu avtomobil zavodidagi barcha detallarni (dvigatel=DB/Repo, uzatma=Service, tormoz=Auth/RBAC, rul=Router, datchiklar=Middleware, sinov maydoni=Tests) yig‘ib, yo‘lda haydab tekshirib ko‘rishdir!",
    analogyEn: 'Think of this capstone as final vehicle assembly and track testing: wiring Engine (Repo), Transmission (Service), Brakes (Auth/RBAC), Steering (Router), Telemetry (Middleware), and Crash Tests together.',
    stopsUz: "Yakuniy backend loyihasida tekshiruv ro‘yxati: 1) **Happy path** dan tashqari albatta **`401`**, **`403` (IDOR)**, **`422` (Mass Assignment)** va **`409` (Conflict)** integration testlarini yozing! 2) Har test yangi izolyatsiyalangan DB (`:memory:`) da yursin. 3) Hech qayerda `password_hash` chiqmasin!",
    stopsEn: 'Verify not just `200`/`201` happy paths in your integration suite, but also `401` unauthenticated, `403` IDOR attempts, `422` extra-field rejections, and `409` duplicate conflicts against isolated `:memory:` DBs.',
    objUz: ['Barcha backend qatlamlarini circular-importsiz yagona ilovaga (`create_app`) birlashtirish', 'User Register/Login + Task CRUD (IDOR himoyasi bilan) + Async Export jobni qurish', 'Kamida 5 ta end-to-end integration test (`201`, `401`, `403`, `422`, `409`) bilan tizimni tasdiqlash'],
    objEn: ['Assemble Config, DB Schema, Repository, Service, Auth, Middleware, and Routes in `create_app()`', 'Implement Register/Login, IDOR-safe Task CRUD, and `202` async jobs', 'Verify all happy and error HTTP statuses via isolated integration tests'],
    theoryUz: `### 1. Loyiha Modullari Xaritasi
- \`config.py\`: Fail-fast \`Settings\`
- \`db.py\`: SQLite sxema + Unit-of-Work ulanish
- \`security.py\`: \`scrypt\` + HMAC token
- \`services.py\`: \`AuthService\`, \`TaskService\` (\`NotFound\`, \`Forbidden\`, \`Conflict\`)
- \`app.py\`: Middleware + Routerlar (\`/v1/auth/register\`, \`/v1/tasks\`, \`/ready\`)
### 2. Integration Test Piramidasi
Real HTTP router funksiyasiga JSON yuborib, status kod + response JSON + DB holatini birga assert qiling!`,
    theoryEn: `### 1. Cohesive Project Layout
Separate \`config\`, \`db\`, \`security\`, \`services\`, \`middleware\`, and \`routes\` inside a clean \`create_app(settings)\` factory.
### 2. End-to-End Test Coverage
Exercise the full request path through middleware, validation, domain rules, and SQLite persistence for \`201\`, \`200\`, \`401\`, \`403\`, \`409\`, and \`422\`.`,
    examples: [
      ex('Misol 1: To‘liq Mini-Backend (`create_app` + Auth + IDOR-Safe CRUD + Tests)', 'Example 1: End-to-End Tested Mini Backend', `import hashlib, hmac, secrets, sqlite3

class DomainError(Exception):
    def __init__(self, code: int, msg: str):
        self.code, self.msg = code, msg

def create_app():
    conn = sqlite3.connect(":memory:")
    conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, pw_hash TEXT)")
    conn.execute("CREATE TABLE tasks (id INTEGER PRIMARY KEY, owner_id INT, title TEXT)")
    tokens: dict[str, int] = {}

    def hash_pw(pw: str) -> str:
        s = secrets.token_hex(8)
        d = hashlib.scrypt(pw.encode(), salt=s.encode(), n=1024, r=8, p=1).hex()
        return f"{s}\${d}"

    def dispatch(method: str, path: str, body: dict | None = None, token: str | None = None) -> tuple[int, dict]:
        body = body or {}
        try:
            if (method, path) == ("POST", "/v1/register"):
                email = str(body.get("email", "")).strip().lower()
                pw = str(body.get("password", ""))
                if "@" not in email or len(pw) < 6:
                    raise DomainError(422, "Invalid email or short password")
                try:
                    cur = conn.execute("INSERT INTO users (email, pw_hash) VALUES (?, ?)", (email, hash_pw(pw)))
                    conn.commit()
                except sqlite3.IntegrityError:
                    raise DomainError(409, "Email already registered")
                tok = f"tok_{cur.lastrowid}"
                tokens[tok] = cur.lastrowid
                return 201, {"id": cur.lastrowid, "email": email, "token": tok}

            uid = tokens.get(token or "")
            if not uid:
                raise DomainError(401, "Unauthorized")

            if (method, path) == ("POST", "/v1/tasks"):
                title = str(body.get("title", "")).strip()
                if not title:
                    raise DomainError(422, "Title required")
                cur = conn.execute("INSERT INTO tasks (owner_id, title) VALUES (?, ?)", (uid, title))
                conn.commit()
                return 201, {"id": cur.lastrowid, "title": title}

            if method == "GET" and path.startswith("/v1/tasks/"):
                tid = int(path.rsplit("/", 1)[-1])
                row = conn.execute("SELECT id, owner_id, title FROM tasks WHERE id=?", (tid,)).fetchone()
                if not row:
                    raise DomainError(404, "Task not found")
                if row[1] != uid:
                    raise DomainError(403, "Forbidden (IDOR blocked)")
                return 200, {"id": row[0], "title": row[2]}
            return 404, {"error": "Route not found"}
        except DomainError as e:
            return e.code, {"error": e.msg}

    return dispatch

api = create_app()
s1, u1 = api("POST", "/v1/register", {"email": "ali@uz.dev", "password": "secret123"})
s2, u2 = api("POST", "/v1/register", {"email": "vali@uz.dev", "password": "secret123"})
st_task, task = api("POST", "/v1/tasks", {"title": "Deploy API"}, token=u1["token"])
st_idor, _ = api("GET", f"/v1/tasks/{task['id']}", token=u2["token"])
st_dup, _ = api("POST", "/v1/register", {"email": "ali@uz.dev", "password": "secret123"})
print(s1, st_task, st_idor, st_dup)`, `201 201 403 409`, 'Bitta ixcham backendda Register (`201`), Duplicate Conflict (`409`), Task yaratish (`201`) va boshqa user o‘qimoqchi bo‘lganda `403` IDOR himoyasi ishladi!', 'Demonstrates `201` creation, `403` IDOR rejection, and `409` uniqueness enforcement end-to-end.'),
      ex('Misol 2: `/ready` DB + `/health` Integratsion Tekshiruvi', 'Example 2: App Factory Health & Readiness Probes', `def check_probes(db_ok: bool) -> dict:
    return {"health": 200, "ready": 200 if db_ok else 503}

print(check_probes(True), check_probes(False))`, `{'health': 200, 'ready': 200} {'health': 200, 'ready': 503}`, 'DB ishlamasa ham `/health` jarayon tirikligini (`200`), `/ready` esa trafik ololmasligini (`503`) bildiradi.', 'Distinguishes process liveness from downstream DB readiness.'),
      ex('Misol 3: Test Isolation (`assert` Suite)', 'Example 3: Isolated Integration Test Assertions', `def create_app():
    tokens: dict[str, int] = {}
    def dispatch(method: str, path: str, body: dict | None = None, token: str | None = None) -> tuple[int, dict]:
        body = body or {}
        if (method, path) == ("POST", "/v1/register"):
            if "@" not in str(body.get("email", "")) or len(str(body.get("password", ""))) < 6:
                return 422, {"error": "Invalid"}
            return 201, {"token": "tok_1"}
        if not tokens.get(token or ""):
            return 401, {"error": "Unauthorized"}
        return 200, {"ok": True}
    return dispatch

t_api = create_app()
assert t_api("GET", "/v1/tasks/1")[0] == 401
assert t_api("POST", "/v1/register", {"email": "bad", "password": "1"})[0] == 422
print("Security boundary assertions passed!")`, `Security boundary assertions passed!`, 'Har bir test alohida `create_app()` bilan ishlaydi va bir-biriga ta’sir qilmaydi.', 'Fresh factory apps keep integration tests 100% isolated.'),
    ],
    traceTitleUz: 'To‘liq API So‘rovi Oqimi Trace',
    traceTitleEn: 'Tracing End-to-End Request Lifecycle',
    traceCode: `api("GET", "/v1/tasks/1", token=u2["token"])`,
    traceSteps: [
      traceStep(1, 'Auth Check', 'uid = 2', 'Token u2 (Vali) sifatida tasdiqlandi', 'Authenticated as Vali'),
      traceStep(2, 'DB Fetch', 'task(id=1, owner_id=1)', 'Topshiriq Ali (id=1) ga tegishli', 'Loaded task owned by Ali'),
      traceStep(3, 'Ownership Guard', '1 != 2 -> DomainError(403)', 'IDOR aniqlandi va 403 qaytdi', 'Blocked with 403'),
    ],
    commonMistakes: [
      mistake('Barcha testlarni bitta umumiy fayl DB da ketma-ketlikka bog‘lab yozish', 'Coupling Integration Tests to Shared Mutable DB State', `# If test_2 depends on user created in test_1, running test_2 alone fails!`, 'Flaky order-dependent test suite', `print("Give each test its own fresh :memory: SQLite DB via create_app()!")`, 'Har bir test mustaqil bo‘lishi kerak.', 'Use fresh in-memory fixtures so tests pass in any order.', 'Har testga toza `create_app()` bering.', 'Isolate state per test.'),
      mistake('`register` da duplicate email `IntegrityError` ni tutmay `500` qaytarish', 'Letting Unique Email Violation Crash with 500', `# Uncaught IntegrityError turns a normal user duplicate email (409) into a 500 alarm!`, 'False 500 server crash on duplicate signup', `print("Catch IntegrityError on email insert and map cleanly to 409 Conflict!")`, 'Takroriy email — mijoz konflikti (`409`), server qulashi emas.', 'Map unique constraint violations to `409 Conflict`.', '`IntegrityError` -> `409` qiling.', 'Map unique errors to `409`.'),
    ],
    compareTitleUz: 'Unit Test (Service) vs Integration Test (API + DB)',
    compareTitleEn: 'Unit Tests vs End-to-End Integration Tests',
    compareUz: ['Unit test: bitta funksiyani (masalan chegirma formulasini) millisekundda tekshiradi.', 'Integration test: HTTP Router + Validatsiya + Service + SQLite/Postgres hammasini birga tekshiradi (`401`, `403`, `409`, `422`, `201`).'],
    compareEn: ['Unit tests: sub-millisecond verification of pure domain helpers.', 'Integration tests: verify wiring across routes, auth, validation, and real SQL queries.'],
    compareSummaryUz: 'To‘liq backendda qatlamlarni `create_app()` da ulang va `201`/`401`/`403`/`409`/`422` holatlarini izolyatsiyalangan testlarda tekshiring.',
    compareSummaryEn: 'Assemble all backend layers in `create_app()` and assert `201`, `401`, `403`, `409`, and `422` paths in isolated integration tests.',
    practiceTasks: [
      pt('p1412_1', '1-mashq: `409` Duplicate Conflict', 'Task 1: Handle Unique Conflict', '`sqlite3.IntegrityError` ni tutib `409` qaytaring.', 'Catch IntegrityError as 409.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (email TEXT UNIQUE)")\nc.execute("INSERT INTO u VALUES ('a@b.uz')")\ntry:\n    c.execute("INSERT INTO u VALUES ('a@b.uz')")\n    st = 201\nexcept sqlite3.IntegrityError:\n    st = 409\nprint(st)`, '409', 'Catch sqlite3.IntegrityError', 'Prints 409.'),
      pt('p1412_2', '2-mashq: `password_hash` ni olib tashlash', 'Task 2: Safe User DTO', 'User yozuvidan faqat `id` va `email` qaytaring.', 'Strip password_hash.', `u = {"id": 1, "email": "a@b.uz", "pw_hash": "xxx"}\nprint({k: u[k] for k in ("id", "email")})`, "{'id': 1, 'email': 'a@b.uz'}", 'Allowlist public keys', 'Prints safe DTO.'),
      pt('p1412_3', '3-mashq: `404` vs `403` tekshiruvi', 'Task 3: NotFound vs Forbidden', 'Yozuv yo‘q -> `404`, egasi boshqa -> `403`.', 'Return 404 or 403.', `def check(row, uid): return 404 if not row else (403 if row["owner"] != uid else 200)\nprint(check(None, 1), check({"owner": 2}, 1), check({"owner": 1}, 1))`, '404 403 200', 'Check None before owner', 'Prints 404 403 200.'),
      pt('p1412_4', '4-mashq: Pagination `LIMIT/OFFSET`', 'Task 4: Paginate Tasks', '`page=2, size=2` uchun `[10,20,30,40,50]` dan `[30, 40]` oling.', 'Slice page 2.', `items = [10, 20, 30, 40, 50]\npage, size = 2, 2\nprint(items[(page - 1) * size : page * size])`, '[30, 40]', '(page-1)*size slice', 'Prints [30, 40].'),
      pt('p1412_5', '5-mashq: Error Envelope Format', 'Task 5: Standard Error JSON', 'Barcha xatolarni `{"status": code, "detail": msg}` qilib chiqaring.', 'Format uniform error.', `def err(c, m): return {"status": c, "detail": m}\nprint(err(422, "Invalid body"))`, "{'status': 422, 'detail': 'Invalid body'}", 'Return standard dict', 'Prints error dict.'),
    ],
    quiz: [
      q('q1412_1', 'Duplicate email bilan ro‘yxatdan o‘tishda DB `IntegrityError` ko‘tarsa API qaysi statusni qaytarishi kerak?', 'Correct HTTP status when a unique email constraint triggers `IntegrityError`?', ['500', '409 Conflict', '401', '200'], ['500', '409 Conflict', '401', '200'], 1, '`409 Conflict`.', '`409 Conflict`.'),
      q('q1412_2', 'Integration testlar nima uchun har safar toza `:memory:` yoki test DB yaratishi kerak?', 'Why isolate DB state for every integration test?', ['Kattaroq DB', 'Testlar bajarilish tartibiga bog‘liq bo‘lmasligi (flaky bo‘lmasligi) uchun', 'Docker uchun', 'SQL tezligi'], ['Bigger DB', 'Keeps tests deterministic and independent of execution order', 'Docker', 'SQL speed'], 1, 'Tartibdan mustaqil va deterministic testlar.', 'Prevents flaky coupled tests.'),
      q('q1412_3', 'Endpointga `token` umuman yuborilmaganda qaysi status qaytadi?', 'Status when no authentication credentials are provided?', ['403', '401 Unauthorized', '404', '422'], ['403', '401 Unauthorized', '404', '422'], 1, '`401 Unauthorized`.', '`401 Unauthorized`.'),
      q('q1412_4', 'Tashqi API dan foydalanuvchi o‘z profilini o‘qiganda qaysi maydon HECH QACHON qaytmasligi kerak?', 'Field that must NEVER be included in user API JSON responses?', ['id', 'email', 'password_hash / secret salts', 'created_at'], ['id', 'email', 'password_hash / secret salts', 'created_at'], 2, '`password_hash`.', '`password_hash`.'),
      q('q1412_5', 'FastAPI/Backend loyihasida `create_app()` patterni nimaga xizmat qiladi?', 'Role of `create_app()` in backend projects?', ['HTML bezash', 'Konfiguratsiya va test ilovalarini toza konstruksiya qilish', 'CSS yuklash', 'Email yuborish'], ['HTML', 'Builds configurable isolated app instances cleanly for dev, prod, and testing', 'CSS', 'Email'], 1, 'Konfiguratsiya va test izolyatsiyasi.', 'Configurable, testable app construction.'),
    ],
    homework: hw('Mini Task Manager REST Backend (To‘liq Loyiha)', 'Complete Layered Task Manager Backend', 'Yuqoridagi `create_app()` loyihasiga `PATCH /v1/tasks/{id}`, `DELETE /v1/tasks/{id}` (IDOR himoyasi bilan), `GET /v1/tasks?limit=...&offset=...` pagination va 8 ta integration test asserti qo‘shing.', 'Extend the mini backend with `PATCH` (partial update), `DELETE`, pagination on `GET /v1/tasks`, and 8 assertions covering `200`, `201`, `204`, `401`, `403`, `404`, `409`, and `422`.', ['PATCH, DELETE, Pagination', '8 ta to‘liq integration test'], ['PATCH, DELETE, Pagination', '8 full integration assertions'], 'Reuse ownership checks in PATCH and DELETE before mutating SQLite rows.', 'Production-style mini backend.', 'Async export `/v1/tasks/export` (`202 Accepted`) ni ham ulang.', 'Add 202 export endpoint.', 35),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-13',
    courseId: 'web_backend',
    moduleId: 'c14_m4',
    order: 13,
    titleUz: 'Docker, Production Deploy, Security Hardening va Review #32',
    titleEn: 'Docker, Production Deployment, Security Hardening & Review #32',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-14-12'],
    conceptId: 'be_docker_deploy',
    whyUz: "Kod \"Mening kompyuterimda ishladi\" degan gap production da o‘tmaydi! **Docker** sizning Python versiyangiz, `pyproject.toml`/`requirements.txt` bog‘liqliklaringiz va server muhitini bitta deterministik konteynerga muhrlaydi. Multi-stage `Dockerfile`, non-root user, Gunicorn/Uvicorn workerlar va Security Checklist — junior dan professional backendchiga o‘tish ko‘prigidir!",
    whyEn: 'Package backends reproducibly with multi-stage Dockerfiles, `.dockerignore`, non-root `USER`, reverse-proxy TLS termination (Nginx/Caddy) in front of Gunicorn+Uvicorn workers, graceful SIGTERM shutdown, and OWASP security hardening.',
    analogyUz: "**Docker konteyner** — xalqaro yuk konteyneri: ichida Python, kutubxonalar va kodingiz bir xil standart qutiga joylanadi; endi uni Toshkentdagi noutbukda ham, Frankfurt/AWS serverida ham aynan bir xil ishga tushirasiz!",
    analogyEn: 'A Docker container is a standardized shipping container: your app and exact Python runtime run identically on your laptop and on cloud servers.',
    stopsUz: "Docker & Production da 4 muhim qoida: 1) Konteyner ichida **`root` sifatida yurmang** — `Dockerfile` da `USER appuser` yarating! 2) **`.dockerignore`** qo‘ying (`.git`, `.venv`, `.env`, `__pycache__` imijga kirmasin!). 3) Image layer keshini tezlatish uchun avval **`COPY requirements.txt` -> `pip install`**, keyin **`COPY . .`** yozing! 4) Secrets ni `ENV` ga hardcode qilmang — runtime da bering!",
    stopsEn: 'Create a non-root `USER` in Dockerfiles, add `.dockerignore` (never bake `.env` or `.git` into images), copy `requirements.txt` before source code for layer caching, and pass secrets strictly at runtime.',
    objUz: ['Multi-stage `Dockerfile`, `.dockerignore`, layer caching va non-root `USER` yozish', 'Gunicorn + Uvicorn workers (`gunicorn -k uvicorn.workers.UvicornWorker`) va Nginx reverse proxy arxitekturasi', 'Graceful shutdown (`SIGTERM`), Security headers va Backend Portfolio taqdimoti'],
    objEn: ['Author cached, minimal non-root Dockerfiles with `.dockerignore`', 'Combine Nginx/Caddy reverse proxies with Gunicorn/Uvicorn worker processes', 'Handle `SIGTERM` gracefully and present backends cleanly in a developer portfolio'],
    theoryUz: `### 1. To‘g‘ri \`Dockerfile\` Tuzilishi
\`\`\`dockerfile
FROM python:3.12-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN useradd -m appuser
COPY --chown=appuser:appuser . .
USER appuser
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:8000"]
\`\`\`
### 2. Layer Caching & \`.dockerignore\`
Agar \`COPY . .\` ni \`pip install\` dan OLDIN qo‘ysangiz, 1 qator kod o‘zgarganda ham hamma paketlar qaytadan yuklanadi! \`.dockerignore\` esa \`.env\` sirlarini imijdan tashqarida ushlaydi.
### 3. Production Worker Model & Reverse Proxy
Internet -> **Nginx / Caddy** (TLS/HTTPS, gzip, static) -> **Gunicorn** (worker jarayonlarni boshqaradi) -> **UvicornWorker** (ASGI async).
### 4. Backend Portfolio Checklist
Har bir GitHub loyihada: arxitektura sxemasi, \`docker compose up\`, OpenAPI misollari, test natijalari va \`.env.example\`!`,
    theoryEn: `### 1. Hardened \`Dockerfile\` Anatomy
Use \`python:3.12-slim\`, install dependencies before copying source code for layer cache hits, add \`.dockerignore\`, and switch to a non-root \`USER\`.
### 2. Reverse Proxy + Process Manager
Terminate TLS/HTTPS at Nginx/Caddy/ALB in front of Gunicorn + \`UvicornWorker\` processes; listen for \`SIGTERM\` to drain active requests gracefully.
### 3. Production Security Checklist
No \`debug=True\`, no committed \`.env\`, parameterized SQL, strict CORS origins, rate limiting, and \`/health\` + \`/ready\` probes.`,
    examples: [
      ex('Misol 1: Docker Layer Cache & `.dockerignore` Tekshiruvchi', 'Example 1: Dockerfile Security & Cache Linter', `def lint_dockerfile(lines: list[str]) -> list[str]:
    issues = []
    text = "\\n".join(lines)
    if "USER " not in text or "USER root" in text.splitlines()[-1]:
        issues.append("Missing non-root USER")
    idx_req = next((i for i, l in enumerate(lines) if "requirements.txt" in l), 999)
    idx_copy_all = next((i for i, l in enumerate(lines) if l.strip().startswith("COPY . ")), -1)
    if idx_copy_all != -1 and idx_copy_all < idx_req:
        issues.append("COPY . . appears before requirements.txt (breaks Docker layer cache!)")
    return issues

bad = ["FROM python:3.12", "COPY . .", "COPY requirements.txt .", "RUN pip install -r requirements.txt"]
good = ["FROM python:3.12-slim", "COPY requirements.txt .", "RUN pip install -r requirements.txt", "COPY . .", "USER appuser"]
print("Bad issues:", lint_dockerfile(bad))
print("Good issues:", lint_dockerfile(good))`, `Bad issues: ['Missing non-root USER', 'COPY . . appears before requirements.txt (breaks Docker layer cache!)']\nGood issues: []`, 'Yaxshi Dockerfile avval `requirements.txt` ni nusxalab keshlaydi va non-root `USER` bilan ishlaydi.', 'Checks Dockerfiles for non-root execution and proper dependency layer caching order.'),
      ex('Misol 2: Production Security Readiness Auditor', 'Example 2: Pre-Deploy Security & Config Checklist', `def audit_prod_config(cfg: dict) -> list[str]:
    fails = []
    if cfg.get("DEBUG"): fails.append("DEBUG must be False")
    if "*" in cfg.get("CORS_ORIGINS", []): fails.append("CORS wildcard forbidden")
    if len(cfg.get("SECRET_KEY", "")) < 32: fails.append("SECRET_KEY too short")
    return fails

print("Unsafe:", audit_prod_config({"DEBUG": True, "CORS_ORIGINS": ["*"], "SECRET_KEY": "123"}))
print("Ready:", audit_prod_config({"DEBUG": False, "CORS_ORIGINS": ["https://app.uz"], "SECRET_KEY": "a" * 32}))`, `Unsafe: ['DEBUG must be False', 'CORS wildcard forbidden', 'SECRET_KEY too short']\nReady: []`, 'Deploydan oldingi avtomatik tekshiruv `DEBUG=True`, wildcard CORS va kalta `SECRET_KEY` ni darhol ushlaydi.', 'Automated pre-flight checks catch misconfigured debug flags, CORS wildcards, and weak secrets.'),
      ex('Misol 3: Graceful Shutdown (`SIGTERM`) Draining', 'Example 3: Graceful Request Draining', `shutting_down = False
in_flight = 2

def accept_new_request() -> int:
    return 503 if shutting_down else 200

shutting_down = True
print("New traffic during SIGTERM:", accept_new_request(), "| Finishing active:", in_flight)`, `New traffic during SIGTERM: 503 | Finishing active: 2`, 'Shutdown boshlanganda yangi so‘rovlar `503` bilan boshqa serverga yo‘naltiriladi, faol so‘rovlar esa tugatib olinadi.', 'During `SIGTERM`, reject new traffic (`503`) while letting in-flight requests finish cleanly.'),
    ],
    traceTitleUz: 'Docker Layer Caching & Production Oqimi',
    traceTitleEn: 'Tracing Container Build & Runtime',
    traceCode: `# 1. .dockerignore excludes .env -> 2. pip install -> 3. USER appuser -> 4. Gunicorn`,
    traceSteps: [
      traceStep(1, '.dockerignore', 'skips .git, .env, .venv', 'Sirlar imijga kirmadi', 'Excluded secrets from build context'),
      traceStep(2, 'COPY requirements.txt + pip', 'cached layer', 'Kod o‘zgarsa ham keshdan olindi', 'Reused cached dependency layer'),
      traceStep(3, 'USER appuser + CMD', 'non-root Gunicorn', 'Xavfsiz workerlar ishga tushdi', 'Started non-root production workers'),
    ],
    commonMistakes: [
      mistake('`.env` faylini `.dockerignore` ga qo‘shmay Docker imij ichiga pishirib yuborish', 'Baking .env Secrets into Docker Images', `# Anyone who pulls your Docker image can read baked-in .env secrets with docker history!`, 'Exposed DB/API keys inside image layers', `print("Add .env and .git to .dockerignore; inject secrets at runtime via env vars!")`, 'Docker imijida sirlar saqlanmaydi — faqat ishga tushirishda (`docker run -e` / Secret Manager) beriladi.', 'Baked `.env` files stay in image layers; exclude via `.dockerignore` and pass at runtime.', '`.dockerignore` ga `.env` yozing.', 'Ignore `.env` in `.dockerignore`.'),
      mistake('Docker konteynerni sukut bo‘yicha `root` foydalanuvchida ishlatish', 'Running Container Processes as root', `# If an attacker exploits an app bug inside a root container, privilege escalation risk jumps!`, 'Root privilege exposure', `print("Always add useradd + USER appuser in your Dockerfile!")`, '`USER appuser` eng kam huquq (Least Privilege) tamoyilini taʼminlaydi.', 'Always drop privileges to a non-root user inside production containers.', 'Non-root `USER` qo‘shing.', 'Switch to non-root `USER`.'),
    ],
    compareTitleUz: 'Development (`uvicorn --reload`) vs Production (`gunicorn` + `Nginx`)',
    compareTitleEn: 'Dev Reload Server vs Production Stack',
    compareUz: ['Dev (`uvicorn --reload` / `flask --debug`): bitta jarayon, fayl o‘zgarsa qayta yuklanadi, faqat noutbuk uchun.', 'Production (`Nginx -> Gunicorn -> N workers`): ko‘p CPU yadro, TLS HTTPS, timeout nazorati va non-root konteyner.'],
    compareEn: ['Dev server: single-process hot reload for local coding only.', 'Production stack: TLS reverse proxy + multi-worker Gunicorn process manager inside a non-root container.'],
    compareSummaryUz: 'Loyihani `.dockerignore`, keshlangan non-root `Dockerfile`, `Gunicorn` workerlari va pre-deploy xavfsizlik tekshiruvi bilan yakunlang.',
    compareSummaryEn: 'Ship backends in cached non-root Docker images with `.dockerignore`, multi-worker Gunicorn/Uvicorn, and automated security audits.',
    practiceTasks: [
      pt('p1413_1', '1-mashq: `.dockerignore` auditori', 'Task 1: Check .dockerignore', 'Majburiy `.env`, `.git`, `.venv` borligini tekshiring.', 'Verify ignored patterns.', `req = {".env", ".git", ".venv"}\ncfg = {".env", ".git"}\nprint("Missing:", sorted(req - cfg))`, "Missing: ['.venv']", 'Set difference req - cfg', "Prints Missing: ['.venv']."),
      pt('p1413_2', '2-mashq: Workerlar soni formulasi', 'Task 2: Calculate Gunicorn Workers', 'Formula `(2 * cores) + 1` ni `cores = 2, 4` uchun hisoblang.', 'Compute worker count.', `def workers(c): return (2 * c) + 1\nprint(workers(2), workers(4))`, '5 9', '2*cores + 1', 'Prints 5 9.'),
      pt('p1413_3', '3-mashq: Non-root `USER` tekshiruvi', 'Task 3: Non-Root Dockerfile Check', 'Oxirgi `USER` qatori `root` emasligini tekshiring.', 'Check Dockerfile USER.', `def ok_user(lines): return any(l.startswith("USER ") and not l.endswith("root") for l in lines)\nprint(ok_user(["FROM py", "USER appuser"]), ok_user(["FROM py"]))`, 'True False', 'Check USER line', 'Prints True False.'),
      pt('p1413_4', '4-mashq: Security Headers Builder', 'Task 4: Security Headers', '`X-Content-Type-Options: nosniff` va `X-Frame-Options: DENY` qo‘shing.', 'Attach security headers.', `hdrs = {"Content-Type": "application/json"}\nhdrs.update({"X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY"})\nprint(len(hdrs), hdrs["X-Frame-Options"])`, '3 DENY', 'Update headers dict', 'Prints 3 DENY.'),
      pt('p1413_5', '5-mashq: Secret Redactor (Log xavfsizligi)', 'Task 5: Redact Secrets in Logs', '`DATABASE_URL` parolini `***` bilan yashiring.', 'Redact password in URL.', `import re\nu = "postgres://admin:SuperSecret@db:5432/app"\nprint(re.sub(r":([^:@]+)@", ":***@", u))`, 'postgres://admin:***@db:5432/app', 'Regex mask password before @', 'Prints redacted DSN.'),
    ],
    quiz: [
      q('q1413_1', '`Dockerfile` da `COPY requirements.txt .` va `pip install` ni `COPY . .` dan OLDIN yozish nimaga kerak?', 'Why run `COPY requirements.txt` + `pip install` BEFORE `COPY . .` in a Dockerfile?', ['Xotira kamayadi', 'Kodingiz o‘zgarganda Docker keshdan foydalanib paketlarni qaytadan yuklamaydi', 'Majburiy sintaksis', 'Root uchun'], ['Less RAM', 'Enables Docker layer caching so code edits don’t trigger full `pip install` rebuilds', 'Mandatory', 'Root'], 1, 'Layer caching tezligi uchun.', 'Docker build cache efficiency.'),
      q('q1413_2', '`.env` va `.git` ni Docker build kontekstidan chiqarib tashlash uchun qaysi fayl ishlatiladi?', 'File that excludes `.env`, `.git`, and `.venv` from Docker builds?', ['.gitignore', '.dockerignore', 'pyproject.toml', 'compose.yml'], ['.gitignore', '.dockerignore', 'pyproject.toml', 'compose.yml'], 1, '`.dockerignore`.', '`.dockerignore`.'),
      q('q1413_3', 'Nima uchun Docker konteyner ichida `USER appuser` yaratib ishlatish tavsiya etiladi?', 'Why run container processes as a non-root `USER`?', ['Tezroq', 'Least Privilege: ilova buzilsa ham hujumchi konteyner ichida root bo‘la olmaydi', 'Port 80 uchun', 'Pip talabi'], ['Faster', 'Principle of least privilege reduces blast radius if the app is compromised', 'Port 80', 'Pip'], 1, 'Xavfsizlik (Least Privilege).', 'Limits container compromise impact.'),
      q('q1413_4', 'Production FastAPI ilovasida Nginx/Caddy reverse proxy ortida ko‘p CPU yadroli workerlarni kim boshqaradi?', 'Common production process manager spawning multiple `UvicornWorker` processes?', ['uvicorn --reload', 'Gunicorn (`gunicorn -k uvicorn.workers.UvicornWorker`)', 'python -m http.server', 'flask run'], ['uvicorn --reload', 'Gunicorn with `UvicornWorker`', 'http.server', 'flask run'], 1, 'Gunicorn + UvicornWorker.', 'Gunicorn managing UvicornWorkers.'),
      q('q1413_5', 'Konteyner `SIGTERM` signali olganda "Graceful Shutdown" nimani anglatadi?', 'What does graceful shutdown mean when receiving `SIGTERM`?', ['Darhol kill -9', 'Yangi so‘rovlarni to‘xtatib, ishlayotgan faol so‘rovlarni va DB ulanishlarini toza yakunlash', 'Bazani o‘chirish', 'Restart'], ['Instant kill', 'Stop accepting new traffic while finishing in-flight requests and closing DB pools cleanly', 'Drop DB', 'Restart'], 1, 'Faol so‘rovlarni toza yakunlab chiqish.', 'Draining active requests cleanly.'),
    ],
    homework: hw('Production Deploy Audit & Dockerfile Tekshiruvchi', 'Container & Production Readiness Suite', 'Ilova `Dockerfile` ini (cache tartibi, `slim` imij, non-root `USER`), `.dockerignore` ni va `Settings` xavfsizligini (`DEBUG=False`, 32+ belgili secret, explicit CORS) tekshiruvchi Python pre-deploy audit skriptini yozing.', 'Write a production-readiness CLI auditor verifying Dockerfile cache ordering and non-root `USER`, `.dockerignore` completeness, and hardened runtime configuration.', ['Dockerfile + .dockerignore + Config audit', 'Xato va muvaffaqiyat testlari'], ['Full Dockerfile + config audit', 'Pass & fail assertions'], 'Parse lines cleanly and assert zero security/caching violations on a passing template.', 'Production readiness gate.', '14-kurs yakuni — keyingi bosqichda Automation va System Programming ga o‘tamiz!', 'Prepare for Course 15 Automation next.', 25),
    reviewCheckpoint: review(
      32,
      'Review Loyiha #32: 14-Kurs Yakuniy Backend & Production Hardening!',
      'Review Project #32: Course 14 Capstone Backend & Security Audit!',
      'Backend Development kursini yakunladingiz! Endi mini-backendning pre-deploy xavfsizlik/Docker auditini va integratsion testlarini bitta release tekshiruvida birlashtiring.',
      'Complete Course 14! Run a unified pre-release gate combining Dockerfile security checks, runtime config validation, and backend API tests.',
      ['Dockerfile non-root + cache order check', 'Strict prod `Settings` validation', 'Graceful shutdown + `/ready` check'],
      ['Dockerfile + cache validation', 'Prod config check', 'Readiness + shutdown behavior'],
      `def release_gate(dockerfile: list[str], env: dict, db_ok: bool) -> tuple[bool, list[str]]:
    errors = []
    if not any(l.strip().startswith("USER ") and "root" not in l for l in dockerfile):
        errors.append("Container runs as root")
    if env.get("DEBUG") != "0":
        errors.append("DEBUG must be 0")
    if len(env.get("SECRET_KEY", "")) < 32:
        errors.append("Weak SECRET_KEY")
    if not db_ok:
        errors.append("DB not ready")
    return (len(errors) == 0), errors

print("Bad release:", release_gate(["FROM python:3.12"], {"DEBUG": "1"}, False))
print("Prod release:", release_gate(["FROM python:3.12-slim", "USER appuser"], {"DEBUG": "0", "SECRET_KEY": "k"*32}, True))
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),
];
