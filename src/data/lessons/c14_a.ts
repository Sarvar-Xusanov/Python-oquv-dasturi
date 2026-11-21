import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C14_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-14-01',
    courseId: 'web_backend',
    moduleId: 'c14_m1',
    order: 1,
    titleUz: 'Backend Architecture — Layered Design, Config va Health Checks',
    titleEn: 'Backend Architecture: Routes -> Services -> Repositories & 12-Factor Config',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['PY-13-12'],
    conceptId: 'be_architecture',
    whyUz: "Ko‘p yangi dasturchilar hamma SQL, validatsiya, parol xeshlash va HTTP kodlarini bitta `app.py` dagi `@app.post(\"/orders\")` funksiyasi ichiga yozib tashlaydi! 20 ta endpointdan keyin loyiha qo‘l urib bo‘lmas darajada chalkashib ketadi. **Layered Architecture** (Router -> Service -> Repository -> DB) backendni toza va testlanadigan qiladi!",
    whyEn: 'Structure production Python backends into clean Router -> Service -> Repository layers, manage secrets via `os.environ` (12-Factor), and expose `/health` + `/ready` probes.',
    analogyUz: "**Layered Backend** — zamonaviy restoran: **Router** = qabulxona (buyurtmani tekshiradi va JSON javob qaytaradi); **Service** = bosh oshpaz (biznes qoidalar: chegirma, balans); **Repository** = omborchi (SQL/DB bilan gaplashadi). Ofitsiant o‘zi muzlatkichni kavlamaydi!",
    analogyEn: 'Routers speak HTTP, Services enforce business rules, and Repositories speak SQL—keeping each layer independently testable.',
    stopsUz: "2 ta qatʼiy Backend qoidasi: 1) **Router funksiyasida hech qachon SQL yozmang**, **Service da esa `HTTPException` / status kodlarga qaram bo‘lmang** (Service Python biznes xatosi `InsufficientFundsError` ko‘tarsin, Router esa uni `409` ga aylantirsin!). 2) Sirlar (DB paroli, JWT secret) kodda emas, **Environment Variables** da turishi shart.",
    stopsEn: 'Keep SQL out of HTTP routers and HTTP status codes out of Services: let Services raise domain exceptions mapped to HTTP codes by routers/exception handlers. Load all secrets from environment variables.',
    objUz: ['Router (HTTP) -> Service (Domain Logic) -> Repository (Persistence) qatlamlarini ajratish', 'Domain Exception larni HTTP status kodlarga markazlashgan holda xaritalash', '12-Factor Config va `/health` (liveness) vs `/ready` (DB readiness) endpointlarini bilish'],
    objEn: ['Separate Router, Service, and Repository responsibilities', 'Translate domain exceptions into HTTP status codes at the boundary', 'Implement 12-factor config validation and `/health` vs `/ready` probes'],
    theoryUz: `### 1. Uch Qatlamli Arxitektura
- **Router / Controller**: JSON parse/validatsiya, \`Service\` ni chaqirish, HTTP status qaytarish.
- **Service**: biznes invariantlar (balans yetarlimi, chegirma bormi). HTTP haqida bilmaydi!
- **Repository**: SQL/ORM so‘rovlar.
### 2. Domain Exceptions -> HTTP Status Mapping
Service \`DomainError\` (\`NotFoundError\`, \`ConflictError\`) tashlaydi; global error handler ularni \`404\`, \`409\` ga o‘giradi — shunda bir xil biznes servisni ham Web API da, ham CLI da ishlatish mumkin!
### 3. 12-Factor App Config
\`DATABASE_URL\`, \`SECRET_KEY\` lar muhit o‘zgaruvchilaridan \`dataclass\` configga yuklanib, startda bo‘sh bo‘lsa **fail-fast** to‘xtaydi.
### 4. \`/health\` vs \`/ready\`
\`/health\` — jarayon tirik; \`/ready\` — DB ulanishi ham tayyor (Kubernetes/Load Balancer uchun!).`,
    theoryEn: `### 1. Router -> Service -> Repository
Routers handle HTTP, Services enforce domain rules, and Repositories isolate persistence.
### 2. Domain Errors at the Boundary
Services raise framework-agnostic exceptions; boundary middleware maps them to HTTP \`404\`/\`409\`/\`422\`.
### 3. Fail-Fast Configuration
Validate required env settings at startup rather than crashing mid-request hours later.
### 4. Liveness (\`/health\`) vs Readiness (\`/ready\`)
Liveness checks process responsiveness; readiness verifies downstream DB connectivity.`,
    examples: [
      ex('Misol 1: Uch Qatlamli Layered Backend (Router -> Service -> Repo)', 'Example 1: Clean 3-Layer Backend', `class NotFoundError(Exception): pass\n\nclass UserRepo:\n    def __init__(self): self._users = {1: {"id": 1, "name": "Ali"}}\n    def get(self, uid: int) -> dict | None: return self._users.get(uid)\n\nclass UserService:\n    def __init__(self, repo: UserRepo): self.repo = repo\n    def rename(self, uid: int, new_name: str) -> dict:\n        u = self.repo.get(uid)\n        if not u: raise NotFoundError(f"User {uid} not found")\n        u["name"] = new_name.strip()\n        return u\n\ndef user_patch_route(svc: UserService, uid: int, body: dict) -> tuple[int, dict]:\n    try:\n        return 200, svc.rename(uid, body["name"])\n    except NotFoundError as e:\n        return 404, {"error": str(e)}\n\nsvc = UserService(UserRepo())\nprint(user_patch_route(svc, 1, {"name": " Vali "}))\nprint(user_patch_route(svc, 9, {"name": "X"}))`, `(200, {'id': 1, 'name': 'Vali'})\n(404, {'error': 'User 9 not found'})`, 'Service HTTP haqida hech narsa bilmaydi — faqat `NotFoundError` ko‘tardi, Router esa `404` qaytardi.', 'Service raises domain `NotFoundError`; the Router maps it cleanly to HTTP `404`.'),
      ex('Misol 2: Fail-Fast App Config (`Settings.from_env`)', 'Example 2: Fail-Fast Configuration Loader', `from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Settings:\n    db_url: str\n    debug: bool = False\n    @classmethod\n    def from_mapping(cls, env: dict[str, str]) -> "Settings":\n        db = env.get("DATABASE_URL", "").strip()\n        if not db: raise RuntimeError("Missing required DATABASE_URL")\n        return cls(db_url=db, debug=env.get("DEBUG") == "1")\n\nprint(Settings.from_mapping({"DATABASE_URL": "sqlite:///app.db", "DEBUG": "0"}))`, `Settings(db_url='sqlite:///app.db', debug=False)`, 'Majburiy sozlamalar dastur ishga tushgan zahoti tekshiriladi.', 'Validates mandatory configuration upfront at startup.'),
      ex('Misol 3: `/health` vs `/ready` Probe', 'Example 3: Liveness & Readiness Probes', `def readiness(db_ping_ok: bool) -> tuple[int, dict]:\n    return (200, {"status": "ready"}) if db_ping_ok else (503, {"status": "degraded"})

print(readiness(True), readiness(False))`, `(200, {'status': 'ready'}) (503, {'status': 'degraded'})`, 'DB uzilganda `/ready` `503` qaytarib Load Balancerni ogohlantiradi.', 'Readiness checks return `503` when dependencies are down so traffic routes to healthy nodes.'),
    ],
    traceTitleUz: '3-qatlamli chaqiruv izi',
    traceTitleEn: 'Tracing Router -> Service -> Repo',
    traceCode: `user_patch_route(svc, 9, {"name": "X"})`,
    traceSteps: [
      traceStep(1, 'Router', 'calls svc.rename(9, "X")', 'HTTP qatlami servisga uzatdi', 'Router called service'),
      traceStep(2, 'Service -> Repo', 'repo.get(9) -> None', 'Topilmagani uchun NotFoundError', 'Raised NotFoundError'),
      traceStep(3, 'Router catch', 'return (404, ...)', 'Domain xatosi HTTP 404 ga o‘girildi', 'Mapped to 404'),
    ],
    commonMistakes: [
      mistake('Barcha SQL va biznes mantiqni bitta Router funksiyasiga ("Fat Controller") tiqish', 'Fat Controllers Mixing SQL, Logic & HTTP', `# Writing raw SQL, discount math, and email sending inside @app.post("/orders") makes unit testing impossible!`, 'Untestable spaghetti backend', `print("Keep Routers thin -> delegate to Service -> delegate SQL to Repository!")`, 'Fat Controller ni HTTP serversiz test qilib bo‘lmaydi.', 'Fat handlers couple HTTP transport directly to SQL queries.', 'Router -> Service -> Repo qilib ajrating.', 'Split into Router, Service, Repository.'),
      mistake('`SECRET_KEY = "dev123"` kabi sirlarni Git kodiga hardcode qilish', 'Hardcoding Secrets in Source Code', `# Committing DB passwords or API keys into config.py leaks credentials into Git history!`, 'Exposed production secrets', `print("Load secrets from environment variables and fail fast if missing!")`, 'Git tarixiga tushgan parol hamma nusxalarda qolib ketadi.', 'Committed secrets persist in Git history.', 'Env o‘zgaruvchilardan o‘qing.', 'Load from environment variables.'),
    ],
    compareTitleUz: 'Fat Controller vs Layered Architecture',
    compareTitleEn: 'Fat Controller vs Layered Architecture',
    compareUz: ['Fat Controller: 1 faylli kichik skriptda tez, lekin 5+ endpointda testlab bo‘lmaydi.', 'Layered (Router -> Service -> Repo): testlash oson, qayta ishlatiladi (CLI + Web + Queue), aniq chegaralar.'],
    compareEn: ['Fat Controller: fast for throwaway scripts; breaks down quickly.', 'Layered: clean boundaries, effortless unit testing, reusable business services.'],
    compareSummaryUz: 'Har bir backend loyihani Router -> Service -> Repository qatlamlariga bo‘ling, Domain xatolarini HTTP ga o‘giring va config ni startda tekshiring.',
    compareSummaryEn: 'Split backends into thin Routers, framework-free Services, and Repositories, backed by fail-fast env configuration.',
    practiceTasks: [
      pt('p1401_1', '1-mashq: Domain Error -> HTTP Mapping', 'Task 1: Exception Mapper', '`ConflictError` -> `409`, `NotFoundError` -> `404` qaytaruvchi funksiya yozing.', 'Map domain exceptions.', `class ConflictError(Exception): pass\nclass NotFoundError(Exception): pass\ndef to_http(err):\n    if isinstance(err, NotFoundError): return 404\n    if isinstance(err, ConflictError): return 409\n    return 500\nprint(to_http(NotFoundError()), to_http(ConflictError()))`, '404 409', 'isinstance mapping', 'Prints 404 409.'),
      pt('p1401_2', '2-mashq: Fail-Fast Config', 'Task 2: Require Env Secret', '`SECRET_KEY` bo‘sh bo‘lsa `RuntimeError` ko‘taring.', 'Reject empty SECRET_KEY.', `def load_key(env):\n    k = env.get("SECRET_KEY", "").strip()\n    if not k: raise RuntimeError("missing key")\n    return k\ntry:\n    load_key({})\nexcept RuntimeError as e:\n    print(e)`, 'missing key', 'Check stripped env value', 'Prints missing key.'),
      pt('p1401_3', '3-mashq: `/ready` DB tekshiruvi', 'Task 3: Readiness Probe', 'SQLite `SELECT 1` ishlasa `200`, aks holda `503` qaytaring.', 'Ping DB for readiness.', `import sqlite3\nc = sqlite3.connect(":memory:")\nok = c.execute("SELECT 1").fetchone()[0] == 1\nprint(200 if ok else 503)`, '200', 'SELECT 1 check', 'Prints 200.'),
      pt('p1401_4', '4-mashq: Yupqa Router (Thin Route)', 'Task 4: Thin Route Delegation', 'Router faqat `service.calc(body["x"])` ni chaqirib `200` qaytarsin.', 'Delegate to service.', `class Svc:\n    def calc(self, x): return {"double": x * 2}\ndef route(svc, body): return 200, svc.calc(body["x"])\nprint(route(Svc(), {"x": 7}))`, "(200, {'double': 14})", 'Router delegates directly', "Prints (200, {'double': 14})."),
      pt('p1401_5', '5-mashq: Structured Log Context', 'Task 5: JSON Request Log', '`request_id`, `method`, `status` ni JSON log qatoriga formatlang.', 'Emit structured JSON log.', `import json\nprint(json.dumps({"req_id": "r1", "method": "GET", "status": 200}))`, '{"req_id": "r1", "method": "GET", "status": 200}', 'json.dumps log dict', 'Prints JSON log.'),
    ],
    quiz: [
      q('q1401_1', 'Uch qatlamli backend arxitekturasida SQL so‘rovlar qaysi qatlamda yashashi kerak?', 'Where should SQL queries reside in a 3-layer backend?', ['Router ichida', 'Service ichida', 'Repository qatlamida', 'Config faylida'], ['Router', 'Service', 'Repository layer', 'Config'], 2, 'Repository qatlamida.', 'Repository layer.'),
      q('q1401_2', 'Nima uchun Service qatlami `HTTPException(404)` o‘rniga o‘zining `NotFoundError` domain xatosini ko‘tarishi afzal?', 'Why should Services raise domain exceptions instead of HTTP status errors?', ['Tezroq', 'Biznes mantiqni HTTP transportdan ajratib CLI/Worker/API da qayta ishlatish va oson testlash uchun', 'Syntax qulay', 'Flask talabi'], ['Faster', 'Keeps business logic transport-agnostic (reusable across CLI, workers, APIs)', 'Syntax', 'Flask rule'], 1, 'Transport-agnostic qayta ishlatish va toza testlash uchun.', 'Decouples domain rules from HTTP.'),
      q('q1401_3', 'Kubernetes / Load Balancer da `/ready` (Readiness) endpointi DB o‘chganda qaysi statusni qaytarishi kerak?', 'Status `/ready` should return when the database connection fails?', ['200 OK', '503 Service Unavailable', '404 Not Found', '301 Redirect'], ['200 OK', '503 Service Unavailable', '404 Not Found', '301 Redirect'], 1, '`503 Service Unavailable`.', '`503 Service Unavailable`.'),
      q('q1401_4', '12-Factor App tamoyiliga ko‘ra DB parollari va API secretlar qayerda saqlanadi?', 'Where should DB passwords and secrets live per 12-Factor config?', ['Python kodida konstanta sifatida', 'Environment variables (muhit o‘zgaruvchilari) da', 'Git README da', 'HTML da'], ['Python source constants', 'Environment variables', 'Git README', 'HTML'], 1, 'Environment variables da.', 'Environment variables.'),
      q('q1401_5', 'Backend dastur ishga tushayotganda majburiy `SECRET_KEY` yo‘q bo‘lsa nima qilishi kerak?', 'Best startup behavior when a mandatory `SECRET_KEY` env var is missing?', ['Bo‘sh satr bilan davom etish', 'Darhol xato ko‘tarib to‘xtash (Fail-Fast)', 'Default "123" qo‘yish', 'Print qilib o‘tish'], ['Continue empty', 'Fail fast on startup with a clear error', 'Use "123"', 'Ignore'], 1, 'Darhol Fail-Fast to‘xtash.', 'Fail fast at startup.'),
    ],
    homework: hw('3-Qatlamli Mini-Backend Skeleti', '3-Layer Wallet Service', 'Fail-fast `Settings`, `SQLiteAccountRepo`, HTTP-mustaqil `WalletService` (`InsufficientFundsError`, `AccountMissingError`) va domain xatolarni `400`/`404`/`409` ga o‘giruvchi `WalletRouter` yozing.', 'Build a clean 3-layer `Wallet` backend with fail-fast `Settings`, SQLite repository, domain exceptions in `WalletService`, and an HTTP router mapping exceptions to `404`/`409`/`200`.', ['Router -> Service -> Repo qatlamlari', 'Domain exceptionlar + /ready tekshiruvi'], ['Strict 3-layer separation', 'Domain exceptions + /ready probe'], 'Raise domain exceptions in WalletService; catch them only in WalletRouter.', 'Clean boundaries.', 'Structured JSON logging ham qo‘shing.', 'Add JSON request logs.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-02',
    courseId: 'web_backend',
    moduleId: 'c14_m1',
    order: 2,
    titleUz: 'Flask Asoslari — App Factory, Blueprints va WSGI',
    titleEn: 'Flask Foundations: WSGI, App Factory & Modular Blueprints',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-14-01'],
    conceptId: 'be_flask',
    whyUz: "**Flask** — Python dunyosining eng yengil va mashhur mikro-frameworklaridan biri: mikroservislar, tez prototiplar va ichki admin panellarda hali ham millionlab serverlarda ishlaydi. Lekin uni bitta global `app = Flask(__name__)` da emas, **App Factory (`create_app()`) + Blueprints** bilan yozish muhim!",
    whyEn: 'Master Flask’s WSGI request/response model, Application Factory (`create_app()`), modular `Blueprint` routing, and production serving with Gunicorn instead of `app.run(debug=True)`.',
    analogyUz: "**Flask** — yengil sport mashinasi shassisi: kerakli qismlarni (DB, Auth, ORM) o‘zingiz tanlab o‘rnatasiz; **Blueprints** esa alohida g‘ildirak va tizim bloklari bo‘lib, har bir bo‘lim (`auth`, `orders`) o‘z faylida toza turadi!",
    analogyEn: 'Flask is a minimal WSGI core where you plug in only what you need, organizing endpoints cleanly into modular Blueprints via `create_app()`.',
    stopsUz: "Production da **ASLO `app.run(debug=True)`** ishlatmang — Werkzeug reloader debug rejimida brauzerda kod bajaruvchi konsolni ochishi mumkin va 1 ta single-thread dev serverdir! Production da **Gunicorn (`gunicorn -w 4 'app:create_app()'`)** ishlating. Global `app` o‘rniga esa `create_app(test_config=...)` testlashni osonlashtiradi!",
    stopsEn: 'Never deploy Flask’s built-in development server or `debug=True` to production (security & concurrency risk)—serve `create_app()` behind Gunicorn/Waitress WSGI workers.',
    objUz: ['WSGI (`environ, start_response`) asosiy mexanizmini tushunish', '`create_app()` App Factory va `Blueprint` modul tuzilmasini bilish', 'Request Lifecycle (`before_request`, `teardown_request`) va production Gunicorn deployini bilish'],
    objEn: ['Understand the Python WSGI callable contract', 'Structure Flask apps with `create_app()` factories and `Blueprint`s', 'Avoid `debug=True` in production and run via Gunicorn'],
    theoryUz: `### 1. WSGI Nima?
Web Server Gateway Interface (PEP 3333) — sinxron Python web ilovalari (Flask, Django) va serverlar (Gunicorn) orasidagi standart protokol: \`def app(environ, start_response): ...\`.
### 2. Application Factory (\`create_app()\`)
Global \`app = Flask(__name__)\` o‘rniga \`def create_app(config=None):\` yozish:
- Circular import larni yo‘qotadi.
- Pytest da har test uchun alohida \`create_app({"TESTING": True})\` yaratishga imkon beradi!
### 3. Blueprints (\`bp = Blueprint("orders", __name__, url_prefix="/v1/orders")\`)
Yuzlab endpointni bitta faylga yig‘masdan domen modullariga bo‘ladi.
### 4. Production Server: Gunicorn
Dev: \`flask run --debug\`; Production: \`gunicorn -w 4 "myapp:create_app()"\`.`,
    theoryEn: `### 1. WSGI Protocol
Synchronous \`callable(environ, start_response)\` interface bridging Gunicorn workers to Flask/Django.
### 2. Application Factory (\`create_app()\`)
Constructs fresh app instances per config—eliminating circular imports and enabling isolated \`pytest\` test clients.
### 3. Blueprints
Group related routes, error handlers, and URL prefixes cleanly into domain modules.
### 4. Production WSGI Deployment
Never ship \`debug=True\`; deploy behind \`gunicorn -w 4 "pkg:create_app()"\`.`,
    examples: [
      ex('Misol 1: Pure-Python Mini WSGI + Blueprint App Factory (Flask mexanizmi)', 'Example 1: WSGI & Blueprint Pattern Simulation', `class MiniBlueprint:\n    def __init__(self, prefix: str):\n        self.prefix = prefix\n        self.routes: dict[tuple[str, str], object] = {}\n    def route(self, method: str, path: str):\n        def dec(fn):\n            self.routes[(method, self.prefix + path)] = fn\n            return fn\n        return dec\n\nclass MiniFlaskApp:\n    def __init__(self, config: dict):\n        self.config = config\n        self.routes: dict[tuple[str, str], object] = {}\n    def register_blueprint(self, bp: MiniBlueprint):\n        self.routes.update(bp.routes)\n    def test_client_get(self, path: str):\n        fn = self.routes.get(("GET", path))\n        return fn() if fn else (404, {"error": "Not found"})\n\nusers_bp = MiniBlueprint("/v1/users")\n@users_bp.route("GET", "/me")\ndef me(): return (200, {"user": "Aziz"})\n\ndef create_app(testing: bool = False) -> MiniFlaskApp:\n    app = MiniFlaskApp({"TESTING": testing})\n    app.register_blueprint(users_bp)\n    return app\n\napp = create_app(testing=True)\nprint("TESTING?", app.config["TESTING"], "| /v1/users/me ->", app.test_client_get("/v1/users/me"))`, `TESTING? True | /v1/users/me -> (200, {'user': 'Aziz'})`, 'Flask ning `create_app()` + `Blueprint` + `@bp.route` arxitekturasi shu tarzda ishlaydi.', 'Illustrates how `create_app()` wires modular `Blueprint` routes into a testable app.'),
      ex('Misol 2: WSGI `environ` va `start_response` shartnomasi', 'Example 2: Raw WSGI Callable Contract', `def wsgi_app(environ: dict, start_response):\n    status = "200 OK"\n    start_response(status, [("Content-Type", "text/plain")])\n    return [f"Hello {environ['PATH_INFO']}".encode("utf-8")]\n\ncaptured = []\nbody = wsgi_app({"PATH_INFO": "/health"}, lambda st, hdrs: captured.append((st, hdrs)))\nprint(captured[0][0], body[0].decode())`, `200 OK Hello /health`, 'Har bir WSGI server (Gunicorn) aynan shunday `environ` lug‘ati va `start_response` callbackini chaqiradi.', 'Every WSGI server invokes the app callable with `environ` and `start_response`.'),
      ex('Misol 3: `teardown_request` DB tozalash naqshi', 'Example 3: Request Teardown Pattern', `closed = False\ndef run_with_teardown(handler, teardown):\n    try:\n        return handler()\n    finally:\n        teardown()\n\ndef close_db():\n    global closed\n    closed = True\n\nres = run_with_teardown(lambda: "ok", close_db)\nprint(res, "| DB closed?", closed)`, `ok | DB closed? True`, '`teardown_request` so‘rov xato bilan tugasa ham DB ulanishini albatta yopadi.', 'Teardown hooks guarantee per-request DB cleanup even on exceptions.'),
    ],
    traceTitleUz: 'App Factory + Blueprint izi',
    traceTitleEn: 'Tracing create_app & Blueprint Dispatch',
    traceCode: `app = create_app(testing=True)\napp.test_client_get("/v1/users/me")`,
    traceSteps: [
      traceStep(1, 'create_app(testing=True)', 'config={TESTING:True}', 'Test muhiti bilan ilova yaratildi', 'Built isolated app instance'),
      traceStep(2, 'register_blueprint(users_bp)', 'routes[/v1/users/me]', 'Blueprint prefix ulandi', 'Mounted blueprint routes'),
      traceStep(3, 'GET /v1/users/me', '200 {"user":"Aziz"}', 'Handler natija qaytardi', 'Dispatched handler', "(200, {'user': 'Aziz'})"),
    ],
    commonMistakes: [
      mistake('Production serverda `app.run(debug=True)` ishlatib qo‘yish', 'Running Flask debug=True in Production', `# Flask debug=True exposes an interactive traceback debugger allowing remote code execution if leaked!`, 'Remote Code Execution & single-process bottleneck', `print("Deploy Flask with Gunicorn: gunicorn -w 4 'app:create_app()'!")`, 'Debug rejimi xato sahifasida interaktiv Python konsol beradi va ishlab chiqarish uchun xavfli.', '`debug=True` enables the Werkzeug pin-protected debugger and single-process dev server.', 'Production da Gunicorn ishlating.', 'Run Gunicorn with `debug=False`.'),
      mistake('Circular import muammosini global `app` bilan keltirib chiqarish', 'Circular Imports with Global app = Flask()', `# importing routes at top of app.py while routes.py imports 'app' causes ImportError!`, 'ImportError: partially initialized module', `print("Use create_app() factory and register Blueprints inside it!")`, '`create_app()` ichida blueprintlarni import qilish/ulash circular importni yo‘qotadi.', 'Registering Blueprints inside `create_app()` prevents circular imports.', '`create_app()` factory naqshini ishlating.', 'Use the App Factory pattern.'),
    ],
    compareTitleUz: 'Flask (`WSGI`) vs FastAPI (`ASGI`)',
    compareTitleEn: 'Flask vs FastAPI',
    compareUz: ['Flask: sodda sinxron WSGI mikro-framework, ulkan kengaytma ekotizimi, tez prototiplar.', 'FastAPI: zamonaviy `async/await` ASGI, avtomatik Pydantic validatsiya va Swagger/OpenAPI.'],
    compareEn: ['Flask: mature synchronous WSGI micro-framework.', 'FastAPI: async ASGI with built-in Pydantic validation and OpenAPI docs.'],
    compareSummaryUz: 'Flask loyihalarida doim `create_app()` App Factory, modulli `Blueprint` lar va productionda `gunicorn` ishlating.',
    compareSummaryEn: 'Structure Flask apps with `create_app()` factories and `Blueprint`s, and deploy behind Gunicorn with `debug=False`.',
    practiceTasks: [
      pt('p1402_1', '1-mashq: WSGI callable', 'Task 1: Minimal WSGI App', '`environ["REQUEST_METHOD"]` ni qaytaruvchi minimal WSGI funksiyasini chaqiring.', 'Invoke minimal WSGI callable.', `def app(env, start):\n    start("200 OK", [])\n    return [env["REQUEST_METHOD"].encode()]\nprint(app({"REQUEST_METHOD": "GET"}, lambda s, h: None)[0].decode())`, 'GET', 'Call with environ & start_response', 'Prints GET.'),
      pt('p1402_2', '2-mashq: Blueprint URL Prefiksi', 'Task 2: Mount Blueprint Prefix', 'Prefix `"/api"` va path `"/items"` ni birlashtirib ro‘yxatga oling.', 'Join prefix and path.', `def mount(prefix, path): return f"{prefix.rstrip('/')}/{path.lstrip('/')}"\nprint(mount("/api", "/items"))`, '/api/items', 'Strip slashes cleanly', 'Prints /api/items.'),
      pt('p1402_3', '3-mashq: App Factory test izolyatsiyasi', 'Task 3: Isolated Test App', '`create_app({"TESTING": True})` 2 marta chaqirilganda mustaqil obyektlar bersin.', 'Verify distinct factory apps.', `def create_app(cfg): return {"cfg": cfg, "routes": {}}\na, b = create_app({"TESTING": True}), create_app({"TESTING": False})\nprint(a is not b, a["cfg"]["TESTING"])`, 'True True', 'Factory returns fresh dict', 'Prints True True.'),
      pt('p1402_4', '4-mashq: `teardown` xato chiqqanda ham yopishi', 'Task 4: Guaranteed Teardown', 'Handler xato ko‘targanda ham `closed` True bo‘lishini tekshiring.', 'Verify finally cleanup.', `closed = False\ntry:\n    raise ValueError()\nexcept ValueError:\n    pass\nfinally:\n    closed = True\nprint(closed)`, 'True', 'finally cleanup', 'Prints True.'),
      pt('p1402_5', '5-mashq: `404` JSON Error Handler', 'Task 5: JSON Error Handler', 'Topilmagan yo‘lda HTML emas JSON `{"error": "Not Found"}` qaytaring.', 'Return JSON 404.', `routes = {"/ok": lambda: (200, {"ok": True})}\nprint(routes.get("/nope", lambda: (404, {"error": "Not Found"}))())`, "(404, {'error': 'Not Found'})", 'Fallback 404 handler', 'Prints JSON 404.'),
    ],
    quiz: [
      q('q1402_1', 'Flask qaysi Python standart veb-server interfeysiga asoslanadi?', 'Which Python web gateway interface does Flask implement?', ['ASGI', 'WSGI (PEP 3333)', 'gRPC', 'CGI'], ['ASGI', 'WSGI (PEP 3333)', 'gRPC', 'CGI'], 1, 'WSGI.', 'WSGI.'),
      q('q1402_2', 'Flask da `create_app()` Application Factory naqshining asosiy afzalligi?', 'Main advantage of Flask’s `create_app()` Application Factory pattern?', ['HTML ni tezlashtiradi', 'Circular importlarni oldini oladi va testlar uchun alohida konfiguratsiyali app yaratadi', 'SQL ni o‘chiradi', 'Debug rejimini yoqadi'], ['Faster HTML', 'Avoids circular imports and builds isolated per-config test instances', 'Drops SQL', 'Enables debug'], 1, 'Circular importni yo‘qotadi va test izolyatsiyasi beradi.', 'Avoids circular imports and simplifies testing.'),
      q('q1402_3', 'Flask da marshrutlarni domen modullariga (`/auth`, `/orders`) ajratish vositasi?', 'Flask abstraction for modularizing routes into separate domain components?', ['Middleware', 'Blueprint', 'Serializer', 'ModelView'], ['Middleware', 'Blueprint', 'Serializer', 'ModelView'], 1, '`Blueprint`.', '`Blueprint`.'),
      q('q1402_4', 'Nima uchun production serverda `app.run(debug=True)` ishlatish xavfli?', 'Why must `app.run(debug=True)` NEVER be used in production?', ['Sekin SQL', 'Interaktiv debugger konsoli xavfsizlik teshigi ochadi va u dev serverdir', 'JSON buziladi', 'Port 80 ishlamaydi'], ['Slow SQL', 'Werkzeug interactive debugger exposes code execution risk on a single-process dev server', 'Breaks JSON', 'Port 80'], 1, 'Xavfsizlik xavfi + dev server.', 'Security risk + dev-only server.'),
      q('q1402_5', 'So‘rov tugagach (xato chiqsa ham) DB ulanishini yopish uchun qaysi Flask hooki ishlatiladi?', 'Flask hook guaranteed to run at request end even after exceptions?', ['before_request', 'teardown_request / teardown_appcontext', 'after_login', 'on_start'], ['before_request', 'teardown_request / teardown_appcontext', 'after_login', 'on_start'], 1, '`teardown_request` / `teardown_appcontext`.', '`teardown_request` / `teardown_appcontext`.'),
    ],
    homework: hw('Mini-Flask Blueprint & WSGI Router', 'WSGI Blueprint Micro-Framework', '`create_app()` factory, ikkita `Blueprint` (`/v1/health` va `/v1/notes`), `before_request` logging va `teardown_request` SQLite ulanish yopuvchini qo‘llab-quvvatlovchi WSGI mini-ilovasini yozing.', 'Implement a pure-Python WSGI mini-framework supporting `create_app()`, `Blueprint` prefixes, JSON error handlers, and guaranteed `teardown` DB cleanup.', ['WSGI environ/start_response', '2 ta Blueprint + teardown DB cleanup'], ['WSGI compliant', '2 Blueprints + teardown hook'], 'Mount blueprint routes onto app router and execute teardown in finally.', 'Clean WSGI lifecycle.', 'Test client bilan 4 ta integratsion assert yozing.', 'Add 4 client assertions.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-03',
    courseId: 'web_backend',
    moduleId: 'c14_m1',
    order: 3,
    titleUz: 'Django Asoslari — MVT, ORM, Migrations, Admin va Review #30',
    titleEn: 'Django Foundations: Batteries-Included MVT, ORM & Migrations (+ Review #30)',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-14-02'],
    conceptId: 'be_django',
    whyUz: "Flaskda hamma narsani (ORM, Admin, Auth, Migrations) noldan ulab chiqish kerak bo‘lsa, **Django** \"Batteries-Included\" tamoyili bilan tayyor ORM, avtomatik Admin panel, CSRF/Auth himoyasi va kuchli **Migrations (`makemigrations` + `migrate`)** tizimini beradi — Instagram, Spotify va Pinterest kabi gigantlar aynan shunday qurilgan!",
    whyEn: 'Explore Django’s "batteries-included" MVT architecture (Model-View-Template), ORM QuerySets (`select_related` against N+1), schema Migrations, built-in Admin, and CSRF security.',
    analogyUz: "**Flask** — bo‘sh kvartira (mebelni o‘zingiz tanlab olib kelasiz). **Django** — to‘liq jihozlangan aqlli uy: oshxona (ORM), xavfsizlik eshigi (Auth + CSRF), boshqaruv pulti (Admin) va taʼmir jurnali (Migrations) tayyor turibdi!",
    analogyEn: 'Flask hands you an empty studio; Django delivers a full smart home with ORM, Auth, CSRF defense, Admin dashboard, and database Migrations built in.',
    stopsUz: "Django da 2 muhim qoida: 1) **`N+1 Query` muammosi**: template yoki serializerda `for book in Book.objects.all(): print(book.author.name)` yozsangiz har kitob uchun alohida SQL ketadi — Foreign Key uchun **`select_related('author')`**, Many-to-Many uchun **`prefetch_related('tags')`** ishlating! 2) `makemigrations` yaratgan fayllarni albatta **Git ga commit qiling**!",
    stopsEn: 'Always guard Django ORM loops with `select_related()` (for ForeignKey/OneToOne) and `prefetch_related()` (for ManyToMany) to eliminate N+1 queries, and commit generated migration files to Git.',
    objUz: ['Django MVT (Model -> View -> Template/DRF Serializer) oqimini bilish', 'Django ORM (`filter`, `exclude`, `Q`, `F()`, `select_related`, `prefetch_related`) mantiqini tushunish', 'Schema Migrations (`makemigrations` -> `migrate`) va Built-in Admin / CSRF himoyasini bilish'],
    objEn: ['Explain Django’s MVT lifecycle and app modularity', 'Eliminate N+1 queries with `select_related()` and `prefetch_related()`', 'Manage schema changes via `makemigrations`/`migrate` and built-in Auth/Admin'],
    theoryUz: `### 1. Django MVT Arxitekturasi
- **Model**: DB jadvali Python klassi sifatida (\`class Course(models.Model):\`).
- **View**: so‘rovni qabul qilib biznes mantiqni bajaradi (Django REST Framework da \`APIView\`/\`ViewSet\`).
- **Template** (yoki **DRF JSON Serializer**): HTML yoki JSON natija chiqaradi.
### 2. Django ORM & N+1 Himoyasi
- \`Course.objects.filter(stage="adv").order_by("-id")\` — QuerySet **lazy (dangasa)**, faqat kerak bo‘lganda SQL yuboradi!
- \`F("views") + 1\`: race condition siz bazaning o‘zida atomik oshiradi!
- **\`select_related("author")\`**: SQL \`JOIN\` qiladi (FK uchun).
- **\`prefetch_related("tags")\`**: 2 ta tezkor \`WHERE id IN (...)\` so‘rovi bilan M2M ni yig‘adi.
### 3. Migrations (Versiyalangan Sxema)
\`python manage.py makemigrations\` (reja fayli yaratadi) -> \`python manage.py migrate\` (bazaga qo‘llaydi).
### 4. Built-in Security & Admin
Avtomatik SQL Injection himoyasi, PBKDF2/Argon2 parol xeshlash, CSRF tokenlari va \`@admin.register\` boshqaruv paneli!`,
    theoryEn: `### 1. MVT Architecture
**Models** map tables, **Views** orchestrate logic (or DRF APIs), and **Templates/Serializers** render HTML or JSON.
### 2. Lazy QuerySets & N+1 Prevention
\`QuerySet\`s evaluate lazily; use \`F()\` expressions for atomic DB-side updates, \`select_related()\` for FK JOINs, and \`prefetch_related()\` for M2M prefetching.
### 3. Migrations
\`makemigrations\` records declarative schema diffs into Python files tracked in Git; \`migrate\` applies them safely in order.
### 4. Batteries Included
Admin UI, Auth, CSRF middleware, and automatic SQL parameterization ship out of the box.`,
    examples: [
      ex('Misol 1: Lazy QuerySet va N+1 vs `select_related` SQL farqi', 'Example 1: N+1 Loop vs Eager select_related Simulation', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE authors (id INT PRIMARY KEY, name TEXT)")\nc.execute("CREATE TABLE books (id INT PRIMARY KEY, title TEXT, aid INT)")\nc.executemany("INSERT INTO authors VALUES (?, ?)", [(1, "Ali"), (2, "Vali")])\nc.executemany("INSERT INTO books VALUES (?, ?, ?)", [(10, "Py", 1), (11, "SQL", 2)])\n\n# select_related('author') turns N+1 queries into 1 single JOIN query:\nrows = c.execute("SELECT b.title, a.name FROM books b JOIN authors a ON b.aid = a.id ORDER BY b.id").fetchall()\nprint("1-query select_related:", rows)`, `1-query select_related: [('Py', 'Ali'), ('SQL', 'Vali')]`, '`select_related()` tashqi kalitlarni 1 ta SQL `JOIN` so‘rovida olib N+1 muammosini yo‘qotadi.', '`select_related()` collapses N+1 per-row queries into a single `JOIN`.'),
      ex('Misol 2: Migratsiya tarixi (`migrations` jadvali) mexanizmi', 'Example 2: Schema Migration Runner Pattern', `import sqlite3\n\nMIGRATIONS = [\n    ("0001_initial", "CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT)"),\n    ("0002_add_price", "ALTER TABLE items ADD COLUMN price INT NOT NULL DEFAULT 0"),\n]\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE IF NOT EXISTS django_migrations (name TEXT PRIMARY KEY)")\napplied = {r[0] for r in c.execute("SELECT name FROM django_migrations")}\nran = []\nfor name, sql in MIGRATIONS:\n    if name not in applied:\n        c.execute(sql); c.execute("INSERT INTO django_migrations VALUES (?)", (name,))\n        ran.append(name)\nprint("Applied migrations:", ran)`, `Applied migrations: ['0001_initial', '0002_add_price']`, 'Har bir migratsiya fayli bazada faqat 1 marta bajarilishi `django_migrations` jadvali orqali nazorat qilinadi.', 'Tracks applied migration IDs so schema updates run cleanly and idempotently.'),
      ex('Misol 3: Atomik `F("stock") - 1` yangilash naqshi', 'Example 3: Race-Free Atomic F() Update', `import sqlite3\n\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT, price INT)")\nc.execute("INSERT INTO items (name, price) VALUES ('Book', 100)")\nc.execute("UPDATE items SET price = price + 25 WHERE name = 'Book'")\nprint("Atomic DB price:", c.execute("SELECT price FROM items WHERE name='Book'").fetchone()[0])`, `Atomic DB price: 125`, 'Qiymatni Python ga olib `+= 25` qilib qayta yozmasdan, bazaning o‘zida atomik oshirish race condition ni oldini oladi.', 'Updating columns directly in SQL (`F("price") + 25`) prevents lost-update race conditions.'),
    ],
    traceTitleUz: 'Django Request -> MVT -> Migration izi',
    traceTitleEn: 'Tracing MVT & Migration Apply',
    traceCode: `# makemigrations -> 0001_initial.py -> migrate -> check django_migrations`,
    traceSteps: [
      traceStep(1, 'URL Dispatcher', 'maps /courses/ -> View', 'Yo‘nalish View ga uzatildi', 'Routed URL to View'),
      traceStep(2, 'ORM + select_related', '1 SQL JOIN', 'N+1 siz ma’lumot olindi', 'Fetched joined QuerySet'),
      traceStep(3, 'Response', 'JSON / Template', 'Javob mijozga qaytdi', 'Rendered response'),
    ],
    commonMistakes: [
      mistake('Template/Loop ichida FK o‘qib N+1 query yaratish', 'Triggering N+1 Queries Without select_related', `# for order in Order.objects.all(): order.user.email fires 1000 extra SQL queries!`, '1,001 DB roundtrips for 1,000 rows', `print("Always chain .select_related('user') for FK and .prefetch_related('items') for M2M!")`, 'Har sikl qadamida bog‘liq jadvalga yashirin `SELECT` ketadi.', 'Lazy attribute access inside loops triggers N extra queries.', '`select_related()` / `prefetch_related()` qo‘shing.', 'Eager-load relations.'),
      mistake('`migrations/` fayllarini `.gitignore` ga qo‘shib Git ga kiritmaslik', 'Git-Ignoring Django Migration Files', `# Ignoring migrations/ breaks team schema history and production deployments!`, 'Production DB out of sync with models', `print("Always commit generated migration files to Git!")`, 'Migratsiyalar jamoa va server bazasini bir xil holatda ushlab turadi.', 'Migration files are the source of truth for schema evolution.', 'Migratsiya fayllarini Git da saqlang.', 'Commit migrations to version control.'),
    ],
    compareTitleUz: 'Flask vs Django',
    compareTitleEn: 'Flask vs Django',
    compareUz: ['Flask: minimal yengil yadro, kichik mikroservis va maxsus stek uchun.', 'Django (+ DRF): ORM, Admin, Auth, Migrations tayyor — to‘liq veb-platforma, SaaS va CMS lar uchun eng tez start.'],
    compareEn: ['Flask: lightweight micro-core for custom/small microservices.', 'Django: batteries-included monoliths, admin dashboards, and DRF APIs.'],
    compareSummaryUz: 'Django da ORM QuerySet larni `select_related`/`prefetch_related` va `F()` bilan yozing, sxema o‘zgarishlarini esa `migrations` orqali Git da saqlang.',
    compareSummaryEn: 'Pair Django’s MVT and Migrations with `select_related`/`prefetch_related` and atomic `F()` updates to scale cleanly.',
    practiceTasks: [
      pt('p1403_1', '1-mashq: Idempotent Migration Runner', 'Task 1: Apply Migrations Once', '2 marta `run_migrations()` chaqirilganda 2-safar 0 ta migratsiya yurishini ko‘rsating.', 'Run migrations idempotently.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE migs (id TEXT PRIMARY KEY)")\ndef run():\n    done = {r[0] for r in c.execute("SELECT id FROM migs")}\n    ran = 0\n    for m, sql in [("001", "CREATE TABLE a (x INT)")]:\n        if m not in done: c.execute(sql); c.execute("INSERT INTO migs VALUES (?)", (m,)); ran += 1\n    return ran\nprint(run(), run())`, '1 0', 'Track applied IDs', 'Prints 1 0.'),
      pt('p1403_2', '2-mashq: `select_related` JOIN bitta so‘rov', 'Task 2: Single-Query JOIN', '`orders` va `users` ni bitta `JOIN` bilan chiqaring.', 'Avoid N+1 with JOIN.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE u (id INT, n TEXT)"); c.execute("CREATE TABLE o (id INT, uid INT)")\nc.execute("INSERT INTO u VALUES (1, 'Ali')"); c.execute("INSERT INTO o VALUES (10, 1)")\nprint(c.execute("SELECT o.id, u.n FROM o JOIN u ON u.id=o.uid").fetchall())`, "[(10, 'Ali')]", 'JOIN u ON u.id=o.uid', "Prints [(10, 'Ali')]."),
      pt('p1403_3', '3-mashq: `F()` atomik increment', 'Task 3: Atomic DB Increment', 'SQL `UPDATE ... SET views = views + 1` bilan sanagichni oshiring.', 'Atomic SQL increment.', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE p (id INT, views INT)"); c.execute("INSERT INTO p VALUES (1, 10)")\nc.execute("UPDATE p SET views = views + 1 WHERE id = 1")\nprint(c.execute("SELECT views FROM p WHERE id=1").fetchone()[0])`, '11', 'views = views + 1', 'Prints 11.'),
      pt('p1403_4', '4-mashq: CSRF token tekshiruvi', 'Task 4: Constant-Time CSRF Verify', 'Session CSRF va form CSRF ni `hmac.compare_digest` bilan tekshiring.', 'Verify CSRF token.', `import hmac\nprint(hmac.compare_digest("csrf_1", "csrf_1"), hmac.compare_digest("csrf_1", "bad"))`, 'True False', 'hmac.compare_digest', 'Prints True False.'),
      pt('p1403_5', '5-mashq: Lazy QuerySet Slice', 'Task 5: LIMIT Slice Query', 'Faqat kerakli `[:2]` qatorni `LIMIT 2` bilan oling.', 'Simulate QuerySet[:2].', `import sqlite3\nc = sqlite3.connect(":memory:")\nc.execute("CREATE TABLE t (x INT)"); c.executemany("INSERT INTO t VALUES (?)", [(1,),(2,),(3,)])\nprint([r[0] for r in c.execute("SELECT x FROM t ORDER BY x LIMIT 2")])`, '[1, 2]', 'ORDER BY x LIMIT 2', 'Prints [1, 2].'),
    ],
    quiz: [
      q('q1403_1', 'Django qaysi arxitektura naqshiga asoslanadi?', 'Architectural pattern used by Django?', ['MVC', 'MVT (Model-View-Template)', 'MVVM', 'Actor'], ['MVC', 'MVT (Model-View-Template)', 'MVVM', 'Actor'], 1, 'MVT (Model-View-Template).', 'MVT.'),
      q('q1403_2', 'Django ORM da ForeignKey bog‘lanishida N+1 muammosini 1 ta SQL JOIN bilan yechadigan metod?', 'Django QuerySet method eliminating FK N+1 queries via SQL JOIN?', ['prefetch_related()', 'select_related()', 'join_all()', 'lazy_load()'], ['prefetch_related()', 'select_related()', 'join_all()', 'lazy_load()'], 1, '`select_related()`.', '`select_related()`.'),
      q('q1403_3', 'Modelga yangi maydon qo‘shganda Django da bajariladigan ikkita ketma-ket buyruq?', 'Two sequential Django CLI commands to create and apply schema migrations?', ['migrate -> init', 'makemigrations -> migrate', 'create -> push', 'syncdb -> run'], ['migrate -> init', 'makemigrations -> migrate', 'create -> push', 'syncdb -> run'], 1, '`makemigrations` -> `migrate`.', '`makemigrations` -> `migrate`.'),
      q('q1403_4', 'Bazadagi `views` sonini Python ga tortmasdan race-condition siz +1 oshirish vositasi?', 'Django ORM expression performing atomic DB-side column updates?', ['Q()', 'F("views") + 1', 'Sum()', 'Raw()'], ['Q()', 'F("views") + 1', 'Sum()', 'Raw()'], 1, '`F()` expression.', '`F()` expression.'),
      q('q1403_5', 'Django `makemigrations` yaratgan Python migratsiya fayllari Git ga commit qilinishi kerakmi?', 'Should Django’s generated migration files be committed to Git?', ['Yo‘q, .gitignore ga qo‘shiladi', 'Ha, ular sxema tarixining asosiy manbaidir', 'Faqat prod da', 'Faqat 1-fayl'], ['No', 'Yes, they track authoritative schema evolution across environments', 'Prod only', 'First only'], 1, 'Ha, albatta Git ga commit qilinadi.', 'Yes, always commit migrations.'),
    ],
    homework: hw('Django-Style Migration + ORM QuerySet Simulyatori', 'Mini Django Migration & Query Engine', 'SQLite ustida versiyalangan `MIGRATIONS` ro‘yxatini (up/idempotent tracking) va N+1 siz `select_related` JOIN hamda atomik `F()` increment funksiyalarini amalga oshiring.', 'Build a mini migration runner tracking applied versions in SQLite plus single-query `select_related` JOIN and atomic increment helpers.', ['Idempotent migration runner', '1-query JOIN va atomic update'], ['Idempotent migrations', 'JOIN + atomic update'], 'Track migration names in a dedicated table inside a transaction.', 'Atomic schema tracking.', 'Rollback (`down`) qo‘llab-quvvatlashini ham qo‘shib ko‘ring.', 'Add down migration.', 25),
    reviewCheckpoint: review(
      30,
      'Review Loyiha #30: Layered Architecture + WSGI Blueprint + Migrations (150-dars Marrasi!)',
      'Review Project #30: Layered Backend & Idempotent Migrations (150th Lesson!)',
      '150-dars marrasi! Router -> Service -> Repository qatlamlari, App Factory + Blueprint marshrutlash va versiyalangan SQLite migratsiya dvigatelini bitta tizimda birlashtiring.',
      '150-lesson milestone! Unify 3-layer architecture (Router/Service/Repo), App Factory routing, and idempotent DB migrations.',
      ['Idempotent `migrations` jadvali', 'Domain Error -> `404`/`200` Router mapping', 'SQLite `Repository` + `Service`'],
      ['Idempotent schema migrations', 'Domain exception to HTTP mapping', 'Clean 3-layer separation'],
      `import sqlite3

class NotFound(Exception): pass

def migrate(conn: sqlite3.Connection):
    conn.execute("CREATE TABLE IF NOT EXISTS migs (id TEXT PRIMARY KEY)")
    done = {r[0] for r in conn.execute("SELECT id FROM migs")}
    if "001_courses" not in done:
        conn.execute("CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT NOT NULL)")
        conn.execute("INSERT INTO migs VALUES ('001_courses')")

class CourseRepo:
    def __init__(self, conn): self.conn = conn
    def get(self, cid: int):
        r = self.conn.execute("SELECT id, title FROM courses WHERE id=?", (cid,)).fetchone()
        return {"id": r[0], "title": r[1]} if r else None

class CourseService:
    def __init__(self, repo): self.repo = repo
    def fetch(self, cid: int):
        c = self.repo.get(cid)
        if not c: raise NotFound("Course missing")
        return c

def route_get(svc, cid: int):
    try: return 200, svc.fetch(cid)
    except NotFound as e: return 404, {"error": str(e)}

conn = sqlite3.connect(":memory:")
migrate(conn)
conn.execute("INSERT INTO courses (title) VALUES ('Backend 14')")
svc = CourseService(CourseRepo(conn))
print(route_get(svc, 1), route_get(svc, 99))
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-04',
    courseId: 'web_backend',
    moduleId: 'c14_m1',
    order: 4,
    titleUz: 'FastAPI Asoslari — ASGI, Async, OpenAPI/Swagger va Dependency Injection',
    titleEn: 'FastAPI Foundations: ASGI, Async Concurrency, OpenAPI & Dependency Injection',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-14-03'],
    conceptId: 'be_fastapi',
    whyUz: "Zamonaviy Python backendlarining yulduzi — **FastAPI**! U Python Type Hints (`int`, `Pydantic`) dan foydalanib bir vaqtda 3 ta ishni avtomatik bajaradi: 1) So‘rovlarni tekshiradi (Validation), 2) **Swagger / OpenAPI** hujjatini noldan chizib beradi, 3) **ASGI (`async def`)** bilan yuqori tezlikda ishlaydi!",
    whyEn: 'Understand FastAPI’s async ASGI foundation (Uvicorn), automatic Type-Hint validation & OpenAPI generation, Dependency Injection (`Depends()`), and the `def` vs `async def` threadpool trap.',
    analogyUz: "**FastAPI** — Type Hints ni o‘qib o‘zi hujjat va tekshiruv quradigan aqlli zavod: siz `def get_item(item_id: int):` deb yozishingiz bilanoq, u `\"abc\"` kelganda avtomatik `422` qaytaradi va `/docs` sahifasini tayyorlab qo‘yadi!",
    analogyEn: 'FastAPI inspects your Python type annotations to validate payloads, generate interactive `/docs` OpenAPI schemas, and wire dependencies automatically.',
    stopsUz: "FastAPI dagi **№1 xato**: `async def` endpoint ichida oddiy sinxron bloklovchi `time.sleep()` yoki `psycopg2`/`sqlite3` chaqirish — bu **butun ASGI Event Loop ni muzlatadi**! FastAPI da qoida oddiy: **I/O bloklovchi (sync DB/requests) bo‘lsa oddiy `def` yozing** (FastAPI uni avtomatik threadpool da yuritadi!), faqat **`await`-li async kutubxona** (`httpx.AsyncClient`, `asyncpg`) bo‘lsagina `async def` yozing!",
    stopsEn: 'CRITICAL FASTAPI RULE: Only use `async def` if your handler awaits non-blocking async I/O. If calling synchronous blocking DB drivers or `requests`, define a plain `def` route so FastAPI runs it safely in an AnyIO worker threadpool without freezing the event loop.',
    objUz: ['ASGI (`async/await`) vs WSGI farqini va Uvicorn rolini bilish', 'FastAPI da `def` (threadpool) vs `async def` (event loop) tanlash qoidasini qo‘llash', 'Dependency Injection (`Depends`) va avtomatik OpenAPI (`/docs`) mexanizmini tushunish'],
    objEn: ['Contrast ASGI async execution against synchronous WSGI', 'Choose correctly between `def` and `async def` route handlers', 'Model Dependency Injection (`Depends`) with generator cleanup (`yield`)'],
    theoryUz: `### 1. ASGI va Uvicorn
ASGI (Asynchronous Server Gateway Interface) bir jarayonda minglab parallel \`await\` so‘rovlarni va WebSocket larni ko‘taradi (\`uvicorn main:app\`).
### 2. \`def\` vs \`async def\` Oltin Qoidasi (FastAPI)
- **\`async def\`**: faqat ichida haqiqiy \`await\` (masalan \`httpx.AsyncClient\`, \`SQLAlchemy AsyncSession\`) ishlatilsa!
- **\`def\`**: ichida sinxron \`sqlite3\`, \`requests\`, \`time.sleep\` bo‘lsa — FastAPI uni avtomatik **threadpool** da ishlatadi!
### 3. Dependency Injection (\`Depends\`)
\`def get_db(): db = open_db(); try: yield db; finally: db.close()\` — FastAPI so‘rovdan oldin ochadi va javobdan keyin albatta yopadi!
### 4. Avtomatik OpenAPI (\`/docs\`, \`/openapi.json\`)
Type annotatsiyalaridan jonli interaktiv API dokumentatsiya yaratiladi.`,
    theoryEn: `### 1. ASGI & Uvicorn
ASGI adds native \`async/await\`, HTTP/2, and WebSockets on top of Python’s event loop.
### 2. \`def\` vs \`async def\` Rule
Use \`async def\` with \`await\`-capable async libraries; use plain \`def\` for blocking sync drivers so FastAPI dispatches to a threadpool safely.
### 3. Generator Dependencies (\`Depends\`)
\`yield\` dependencies provide clean per-request DB session setup and guaranteed \`finally\` teardown.
### 4. Automatic OpenAPI (\`/docs\`)
Function signatures and Pydantic models drive interactive Swagger UI automatically.`,
    examples: [
      ex('Misol 1: FastAPI-uslubidagi `Depends` (`yield` bilan) va Async Dispatch', 'Example 1: Dependency Injection with yield Teardown', `import asyncio\nfrom contextlib import contextmanager\n\nevents = []\n\n@contextmanager\ndef get_db_dep():\n    events.append("open_db")\n    try:\n        yield {"db": "conn_1"}\n    finally:\n        events.append("close_db")\n\nasync def get_profile(db: dict) -> dict:\n    await asyncio.sleep(0)\n    events.append(f"query:{db['db']}")\n    return {"ok": True}\n\nasync def simulate_request():\n    with get_db_dep() as db:\n        res = await get_profile(db)\n        print("Response:", res)\n\nasyncio.run(simulate_request())\nprint("Lifecycle:", events)`, `Response: {'ok': True}\nLifecycle: ['open_db', 'query:conn_1', 'close_db']`, '`yield` dependency xuddi kontekst menejerdek ulanishni ochib, endpoint tugagach albatta yopadi.', '`yield` dependencies open resources before the route and tear them down cleanly afterward.'),
      ex('Misol 2: `inspect.signature` bilan avtomatik Type Hint Validatsiyasi (FastAPI siri)', 'Example 2: Type-Annotation Auto-Validation', `import inspect\n\ndef get_course(course_id: int, limit: int = 10) -> dict:\n    return {"course_id": course_id, "limit": limit}\n\ndef call_typed(fn, raw_params: dict):\n    sig = inspect.signature(fn)\n    bound = {}\n    for name, param in sig.parameters.items():\n        val = raw_params.get(name, param.default)\n        try:\n            bound[name] = param.annotation(val)\n        except (ValueError, TypeError):\n            return 422, {"detail": f"Invalid int for {name}"}\n    return 200, fn(**bound)\n\nprint(call_typed(get_course, {"course_id": "14"}))\nprint(call_typed(get_course, {"course_id": "abc"}))`, `(200, {'course_id': 14, 'limit': 10})\n(422, {'detail': 'Invalid int for course_id'})`, 'FastAPI ham xuddi shunday `inspect.signature` + Pydantic orqali `"14"` ni `14` ga o‘giradi va `"abc"` da `422` beradi.', 'FastAPI inspects function annotations to coerce valid strings (`"14"`) and return `422` on invalid types.'),
      ex('Misol 3: `def` vs `async def` Event Loop Tekshiruvi', 'Example 3: Offloading Blocking Handler via to_thread', `import asyncio\n\ndef sync_db_query() -> str:\n    return "sync_ok"\n\nasync def dispatch(fn):\n    if asyncio.iscoroutinefunction(fn):\n        return await fn()\n    return await asyncio.to_thread(fn)\n\nprint(asyncio.run(dispatch(sync_db_query)))`, `sync_ok`, 'FastAPI oddiy `def` handlerlarni avtomatik worker thread (`to_thread`) da yuritadi!', 'FastAPI detects plain `def` endpoints via `iscoroutinefunction` and runs them in a worker threadpool.'),
    ],
    traceTitleUz: 'FastAPI ASGI + DI izi',
    traceTitleEn: 'Tracing Dependency & Validation',
    traceCode: `# Request -> Depends(get_db) -> coerce path param -> await endpoint -> teardown`,
    traceSteps: [
      traceStep(1, 'Depends(get_db)', 'open_db -> yield db', 'Dependency ochildi', 'Entered yield dependency'),
      traceStep(2, 'Validate signature', 'course_id="14" -> 14', 'Type hint tekshirildi', 'Coerced int parameter'),
      traceStep(3, 'finally teardown', 'close_db', 'Resurs yopildi', 'Closed dependency cleanly'),
    ],
    commonMistakes: [
      mistake('`async def` ichida sinxron `time.sleep()` yoki `requests.get()` ishlatish', 'Blocking Calls Inside async def FastAPI Routes', `# async def route(): requests.get(...) BLOCKS the single Uvicorn event loop for all users!`, 'Server stalls all concurrent requests', `print("Use plain def for sync I/O, or async def with httpx.AsyncClient!")`, 'Bloklovchi sync I/O `async def` ichida hamma parallel foydalanuvchilarni to‘xtatadi.', 'Blocking I/O inside `async def` stalls the shared event loop.', 'Sync driverlarda oddiy `def` yozing.', 'Use plain `def` for synchronous I/O.'),
      mistake('`Depends` ichida `yield` dan keyin `try/finally` qo‘ymaslik', 'Omitting try/finally in Yield Dependencies', `# Without try/finally, a 4xx/5xx error skips DB session cleanup!`, 'Leaked DB connections', `print("Always wrap yield inside try: ... finally: db.close()!")`, 'Endpoint ichida xato chiqsa `finally` siz DB ulanishi ochiq qoladi.', 'Exceptions skip post-`yield` cleanup unless wrapped in `finally`.', '`try: yield db finally: db.close()` yozing.', 'Wrap `yield` in `try/finally`.'),
    ],
    compareTitleUz: 'Flask (`WSGI`) vs Django (`MVT`) vs FastAPI (`ASGI`)',
    compareTitleEn: 'Comparing the Big 3 Python Frameworks',
    compareUz: ['Flask: minimal mikroservislar, sinxron WSGI, maksimal erkinlik.', 'Django: tayyor Admin/ORM/Migrations, yirik content/SaaS tizimlar.', 'FastAPI: tezkor async JSON API, ML/AI model xizmatlari, avtomatik Swagger/Pydantic.'],
    compareEn: ['Flask: lightweight sync micro-core.', 'Django: batteries-included platform (Admin, ORM, Auth).', 'FastAPI: high-throughput async JSON/AI APIs with OpenAPI + Pydantic.'],
    compareSummaryUz: 'FastAPI da type hintlar bilan avtomatik `422` validatsiya/Swagger oling, `yield` + `try/finally` DI yozing va sync I/O uchun oddiy `def` ishlating.',
    compareSummaryEn: 'In FastAPI, leverage type hints for OpenAPI/422 validation, use `try/finally` around `yield` dependencies, and reserve `async def` for non-blocking `await` calls.',
    practiceTasks: [
      pt('p1404_1', '1-mashq: `inspect.iscoroutinefunction`', 'Task 1: Detect Async Handler', 'Sync va async funksiyani `asyncio.iscoroutinefunction` bilan ajrating.', 'Check async vs sync function.', `import asyncio\ndef s(): pass\nasync def a(): pass\nprint(asyncio.iscoroutinefunction(s), asyncio.iscoroutinefunction(a))`, 'False True', 'asyncio.iscoroutinefunction', 'Prints False True.'),
      pt('p1404_2', '2-mashq: Signature bilan `int` coercion', 'Task 2: Coerce Annotated Arg', '`"25"` satrini funksiya annotatsiyasi (`int`) orqali `25` ga o‘giring.', 'Use __annotations__.', `def f(x: int): return x + 1\nval = f.__annotations__["x"]("25")\nprint(f(val))`, '26', 'f.__annotations__["x"]("25")', 'Prints 26.'),
      pt('p1404_3', '3-mashq: `yield` Dependency `finally`', 'Task 3: Safe Yield Dependency', 'Xato yuz berganda ham `finally` yopilishini tasdiqlang.', 'Test yield teardown.', `from contextlib import contextmanager\nst = []\n@contextmanager\ndef dep():\n    st.append("open")\n    try: yield "res"\n    finally: st.append("close")\ntry:\n    with dep(): raise RuntimeError()\nexcept RuntimeError: pass\nprint(st)`, "['open', 'close']", 'try: yield finally:', "Prints ['open', 'close']."),
      pt('p1404_4', '4-mashq: Sync handler `to_thread` da', 'Task 4: Run Sync in Threadpool', '`def work(): return 42` ni `asyncio.to_thread` bilan chaqiring.', 'Offload sync handler.', `import asyncio\ndef work(): return 42\nprint(asyncio.run(asyncio.to_thread(work)))`, '42', 'asyncio.to_thread(work)', 'Prints 42.'),
      pt('p1404_5', '5-mashq: OpenAPI Schema kalitlari', 'Task 5: Minimal OpenAPI Dict', 'Minimal OpenAPI 3.1 `{"openapi": "3.1.0", "paths": {"/health": ...}}` tuzing.', 'Build OpenAPI skeleton.', `spec = {"openapi": "3.1.0", "paths": {"/health": {"get": {"responses": {"200": {}}}}}}\nprint(spec["openapi"], list(spec["paths"].keys()))`, "3.1.0 ['/health']", 'OpenAPI dict structure', 'Prints OpenAPI metadata.'),
    ],
    quiz: [
      q('q1404_1', 'FastAPI qaysi server interfeysi va serveri ustida ishlaydi?', 'Which interface and server back FastAPI?', ['WSGI + Gunicorn only', 'ASGI + Uvicorn', 'CGI + Apache', 'Socket + FTP'], ['WSGI + Gunicorn only', 'ASGI + Uvicorn', 'CGI + Apache', 'Socket + FTP'], 1, 'ASGI + Uvicorn.', 'ASGI + Uvicorn.'),
      q('q1404_2', 'FastAPI endpointida oddiy sinxron `sqlite3` yoki `requests.get()` ishlatilganda funksiyani qanday eʼlon qilish kerak?', 'How should a FastAPI route using blocking sync `requests` or `sqlite3` be defined?', ['async def', 'Oddiy `def` (shunda FastAPI uni threadpool da xavfsiz yuritadi)', 'static def', 'lambda'], ['async def', 'Plain `def` so FastAPI dispatches it to a worker threadpool', 'static def', 'lambda'], 1, 'Oddiy `def`!', 'Plain `def`.'),
      q('q1404_3', 'FastAPI da `Depends()` bilan DB sessiyasini ochib, so‘rov oxirida xatosiz yopish sintaksisi?', 'How do FastAPI `Depends()` functions guarantee teardown cleanup?', ['return db', 'try: yield db finally: db.close()', 'global db', 'del db'], ['return db', 'try: yield db finally: db.close()', 'global db', 'del db'], 1, '`try: yield db finally: db.close()`.', '`try/yield/finally`.'),
      q('q1404_4', 'FastAPI parametr turi (`item_id: int`) ga `"abc"` kelganda avtomatik qaysi status kodni qaytaradi?', 'Status code FastAPI automatically returns when `item_id: int` receives `"abc"`?', ['400', '404', '422 Unprocessable Entity', '500'], ['400', '404', '422 Unprocessable Entity', '500'], 2, '`422 Unprocessable Entity`.', '`422`.'),
      q('q1404_5', 'FastAPI avtomatik Swagger hujjatlarini qaysi standart asosida generatsiya qiladi?', 'Specification standard powering FastAPI’s `/docs` UI?', ['WSDL', 'OpenAPI', 'GraphQL', 'gRPC'], ['WSDL', 'OpenAPI', 'GraphQL', 'gRPC'], 1, 'OpenAPI.', 'OpenAPI.'),
    ],
    homework: hw('FastAPI-Style Micro-Engine', 'Typed ASGI Route & DI Engine', '`inspect.signature` asosida avtomatik type coercion (`422` xato bilan!), `try/finally` `yield` Dependency Injection va `iscoroutinefunction` bilan sync/async marshrutizator yozing.', 'Build a mini FastAPI-like dispatcher using `inspect.signature` for `422` validation, `yield` DI lifecycle hooks, and `asyncio.to_thread` offloading for sync `def` handlers.', ['Sync def va async def qo‘llab-quvvatlashi', '422 validatsiya va DI teardown testlari'], ['Handle both sync and async routes', 'Test 422 errors & DI teardown'], 'Inspect signature annotations to coerce query/path strings.', 'Clean typed dispatch.', 'Minimal `/openapi.json` generator funksiyasini ham qo‘shing.', 'Add `/openapi.json` generator.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-05',
    courseId: 'web_backend',
    moduleId: 'c14_m2',
    order: 5,
    titleUz: 'Routing, Endpoints, Path/Query Parametrlari va Route Tartibi',
    titleEn: 'Routing Mechanics: Path/Query Parameters, Precedence & 405 Method Checks',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-14-04'],
    conceptId: 'be_routing',
    whyUz: "Nima uchun `/users/me` endpointini `/users/{user_id}` dan KEYIN yozsangiz, `/users/me` so‘rovi `422: \"me\" is not a valid int` xatosini beradi? **Route Precedence (tartibi)**, trailing slashlar va **`405 Method Not Allowed`** javoblarini tushunish har bir backend muhandisining kundalik ko‘nikmasidir!",
    whyEn: 'Master route matching order (static `/users/me` before parameterized `/users/{id}`), path vs query typing, and returning `405 Method Not Allowed` with `Allow` headers instead of `404`.',
    analogyUz: "**Router jadvali** — tepadan pastga tekshiriladigan eshiklar ro‘yxati: agar universal eshik (`/users/{id}`) boshida tursa, maxsus eshik (`/users/me`) ga hech qachon navbat yetmaydi!",
    analogyEn: 'A router checks patterns top-to-bottom—put specific static routes (`/users/me`) before wildcard patterns (`/users/{id}`) so they aren’t shadowed.',
    stopsUz: "Routing da 3 ta klassik tuzoq: 1) **Aniq static yo‘llar (`/users/me`, `/items/featured`) doim dinamik (`/users/{id}`) dan OLDIN** ro‘yxatdan o‘tkazilishi kerak! 2) Yo‘l bor, lekin HTTP metod noto‘g‘ri (`POST /health` faqat `GET` bo‘lsa) -> `404` emas, **`405 Method Not Allowed`** (+ `Allow: GET`) qaytaring! 3) Path parametrlarini to‘g‘ri turga (`int` / `UUID`) cheklang.",
    stopsEn: 'Register literal routes (`/users/me`) before parameterized ones (`/users/{id}`). When a path matches but the HTTP method does not, return `405 Method Not Allowed` with an `Allow` header rather than `404`.',
    objUz: ['Static vs Dynamic route precedence (`/users/me` oldin `/users/{id}` keyin) ni bilish', 'Path params (majburiy resurs ID) vs Query params (`page: int = 1`, `tag: str | None = None`) ajratish', 'Yo‘l mos kelib metod mos kelmaganda `405` + `Allow` sarlavhasini qaytarish'],
    objEn: ['Order literal routes ahead of parameterized patterns', 'Separate path parameters from optional/defaulted query parameters', 'Distinguish `404 Not Found` from `405 Method Not Allowed`'],
    theoryUz: `### 1. Route Precedence (Tartib Qoidasi)
\`\`\`python
GET /users/me        # 1-o‘rinda (literal!)
GET /users/{user_id} # 2-o‘rinda (dinamik)
\`\`\`
Aks holda \`"me"\` \`user_id\` ga tushib \`422\` beradi!
### 2. \`404 Not Found\` vs \`405 Method Not Allowed\`
- Path umuman topilmasa -> **\`404\`**.
- Path topildi, lekin faqat \`GET\` bor-u mijoz \`DELETE\` yuborsa -> **\`405\`** + \`Allow: GET\`!
### 3. Path Params vs Query Params
Path: \`/courses/{course_id}\` (majburiy). Query: \`?limit=20&q=oop\` (ixtiyoriy, default qiymatli).
### 4. Trailing Slash (\`/items\` vs \`/items/\`)
Butun API bo‘yicha bitta standartni tanlang (masalan doim oxirgi \`/\` siz \`/v1/items\`) va aralash yozmang!`,
    theoryEn: `### 1. Route Matching Precedence
Evaluate static segments before parameterized placeholders (\`/users/me\` before \`/users/{id}\`).
### 2. \`404\` vs \`405\`
Return \`404\` if no route pattern matches the path; return \`405\` with \`Allow\` if the path matches other HTTP methods.
### 3. Path vs Query Parameters
Path parameters identify the resource; query parameters provide defaults/filters.
### 4. Trailing Slash Consistency
Standardize one convention (e.g., no trailing slash) across all endpoints.`,
    examples: [
      ex('Misol 1: Route Precedence & `405 Method Not Allowed` Routeri', 'Example 1: Ordered Router with 405 Support', `import re\n\nclass Router:\n    def __init__(self):\n        self.routes: list[tuple[str, str, object]] = []\n    def add(self, method: str, pattern: str, fn):\n        self.routes.append((method, pattern, fn))\n    def dispatch(self, method: str, path: str):\n        allowed = []\n        for m, pat, fn in self.routes:\n            if match := re.fullmatch(pat, path):\n                if m == method:\n                    return 200, {}, fn(*match.groups())\n                allowed.append(m)\n        if allowed:\n            return 405, {"Allow": ", ".join(sorted(set(allowed)))}, {"error": "Method Not Allowed"}\n        return 404, {}, {"error": "Not Found"}\n\nr = Router()\nr.add("GET", r"/users/me", lambda: {"me": True})\nr.add("GET", r"/users/(\\d+)", lambda uid: {"uid": int(uid)})\nprint(r.dispatch("GET", "/users/me"))\nprint(r.dispatch("GET", "/users/7"))\nprint(r.dispatch("DELETE", "/users/me"))`, `(200, {}, {'me': True})\n(200, {}, {'uid': 7})\n(405, {'Allow': 'GET'}, {'error': 'Method Not Allowed'})`, 'Literal `/users/me` birinchi turgani uchun to‘g‘ri ushlandi, `DELETE` da esa `405 Allow: GET` qaytdi.', 'Static `/users/me` matches first, numeric IDs match second, and wrong verbs return `405`.'),
      ex('Misol 2: Path Template Compiler (`/items/{id}` -> Regex)', 'Example 2: Converting {param} Templates to Regex', `import re\n\ndef compile_path(tmpl: str) -> str:\n    return re.sub(r"\\{(\\w+)\\}", r"(?P<\\1>[^/]+)", tmpl)\n\npat = compile_path("/courses/{cid}/lessons/{lid}")\nm = re.fullmatch(pat, "/courses/py14/lessons/5")\nprint(m.groupdict())`, `{'cid': 'py14', 'lid': '5'}`, '`{param}` shablonlari named regex guruhlariga aylanadi.', 'Route compilers convert `{param}` placeholders into named regex captures.'),
      ex('Misol 3: Query Params Default & Boolean Parsing', 'Example 3: Query Defaults & Bool Coercion', `def list_items(page: int = 1, active: str = "true") -> dict:\n    is_active = active.lower() in {"1", "true", "yes"}\n    return {"page": page, "active": is_active}\n\nprint(list_items(), list_items(3, "false"))`, `{'page': 1, 'active': True} {'page': 3, 'active': False}`, 'Boolean query parametrlar satr kelishi sababli ehtiyotkorlik bilan parse qilinadi.', 'Explicitly parse string booleans (`"true"`/`"false"`) rather than `bool("false")` (`True`!).'),
    ],
    traceTitleUz: 'Route matching va 405 izi',
    traceTitleEn: 'Tracing Route Precedence',
    traceCode: `r.dispatch("DELETE", "/users/me")`,
    traceSteps: [
      traceStep(1, 'Match /users/me', 'path matches, method != DELETE', 'allowed=["GET"] yig‘ildi', 'Recorded allowed=["GET"]'),
      traceStep(2, 'No exact method match', 'allowed non-empty -> 405', '405 + Allow: GET qaytdi', 'Returned 405 Allow: GET'),
    ],
    commonMistakes: [
      mistake('`/users/{id}` ni `/users/me` dan oldin yozish', 'Shadowing Static Route with Dynamic {id}', `# Placing /users/{id} before /users/me causes /users/me to match {id}="me" -> 422 error!`, 'Unreachable /users/me endpoint', `print("Always declare literal /users/me BEFORE dynamic /users/{id}!")`, 'Router tepadan pastga birinchi moslikni oladi.', 'First-match routing lets `{id}` swallow `"me"`.', 'Static yo‘llarni tepaga qo‘ying.', 'Put literal routes first.'),
      mistake('Query boolean uchun `bool("false")` ishlatish (`True` chiqadi!)', 'Using bool("false") for Query Strings', `print("Python bool('false') is:", bool("false"))  # Non-empty string is ALWAYS True!`, 'bool("false") evaluates to True!', `print("Compare q.lower() in {'true', '1', 'yes'}!")`, 'Python da bo‘sh bo‘lmagan har qanday satr (`"false"`, `"0"`) `bool()` da `True` beradi!', 'Any non-empty string in Python is truthy.', 'Satr qiymatini aniq solishtiring.', 'Parse `"true"`/`"false"` explicitly.'),
    ],
    compareTitleUz: 'Path Params vs Query Params',
    compareTitleEn: 'Path Params vs Query Params',
    compareUz: ['Path (`/courses/{id}`): resurs identifikatori, tartib va nomga bog‘liq, majburiy.', 'Query (`?stage=adv&page=2`): ixtiyoriy filtrlar, saralash, default qiymatlar.'],
    compareEn: ['Path: required resource identity in URI hierarchy.', 'Query: optional filtering, sorting, and defaults.'],
    compareSummaryUz: 'Aniq yo‘llarni dinamik `{id}` dan oldin joylashtiring, `405 Allow` ni qaytaring va `bool("false")` tuzog‘idan saqlaning.',
    compareSummaryEn: 'Order static routes before `{id}` patterns, emit `405` + `Allow` on wrong HTTP methods, and parse boolean query strings explicitly.',
    practiceTasks: [
      pt('p1405_1', '1-mashq: Route Precedence tekshiruvi', 'Task 1: Static Before Dynamic', '`["/users/me", "/users/{id}"]` tartibida `"/users/me"` aynan 1-qoidaga tushishini chiqaring.', 'Match static route first.', `routes = ["/users/me", "/users/{id}"]\nprint(next(r for r in routes if r == "/users/me" or "{id}" in r))`, '/users/me', 'Static listed first', 'Prints /users/me.'),
      pt('p1405_2', '2-mashq: `405` + `Allow` sarlavhasi', 'Task 2: 405 Method Not Allowed', '`"/ping"` faqat `{"GET", "HEAD"}` ni qabul qilsa `POST` da `405` va saralangan `Allow` chiqaring.', 'Return 405 + Allow.', `allowed = {"GET", "HEAD"}\nprint(405, ", ".join(sorted(allowed)))`, '405 GET, HEAD', 'sorted(allowed)', 'Prints 405 GET, HEAD.'),
      pt('p1405_3', '3-mashq: `{slug}` Path Template parseri', 'Task 3: Named Path Captures', '`r"/books/(?P<slug>[a-z0-9-]+)"` bilan `"/books/clean-py"` ni ajrating.', 'Extract slug param.', `import re\nprint(re.fullmatch(r"/books/(?P<slug>[a-z0-9-]+)", "/books/clean-py").groupdict())`, "{'slug': 'clean-py'}", 'Named group slug', "Prints {'slug': 'clean-py'}."),
      pt('p1405_4', '4-mashq: Xavfsiz Query Boolean', 'Task 4: Parse Query Bool', '`"false"`, `"0"`, `"true"` uchun to‘g‘ri boolean qaytaring.', 'Parse boolean strings.', `def qbool(s): return s.lower() in {"true", "1", "yes"}\nprint(qbool("false"), qbool("0"), qbool("true"))`, 'False False True', 'Check lower() in truthy set', 'Prints False False True.'),
      pt('p1405_5', '5-mashq: Trailing slash normallashtirish', 'Task 5: Normalize Trailing Slash', '`"/v1/orders/"` ni `"/v1/orders"` ga normallashtiring (ildiz `"/"` ni saqlab).', 'Strip trailing slash.', `def norm(p): return "/" if p == "/" else p.rstrip("/")\nprint(norm("/"), norm("/v1/orders/"))`, '/ /v1/orders', 'Keep "/" untouched', 'Prints / /v1/orders.'),
    ],
    quiz: [
      q('q1405_1', '`/users/{id}` dan KEYIN emas, OLDIN yozilishi shart bo‘lgan endpoint qaysi?', 'Which route MUST be registered BEFORE `/users/{id}`?', ['/posts', '/users/me', '/users/{id}/orders', '/health'], ['/posts', '/users/me', '/users/{id}/orders', '/health'], 1, '`/users/me` (static yo‘l).', '`/users/me`.'),
      q('q1405_2', 'Yo‘l (`/v1/items`) mavjud, lekin u faqat `GET` ni qo‘llab, mijoz `POST` yuborsa qaysi status qaytariladi?', 'Status code when a valid path does not support the requested HTTP method?', ['404', '405 Method Not Allowed (+ Allow header)', '400', '501'], ['404', '405 Method Not Allowed (+ Allow header)', '400', '501'], 1, '`405 Method Not Allowed`.', '`405`.'),
      q('q1405_3', 'Python da `bool("false")` nimani qaytaradi?', 'What does `bool("false")` evaluate to in Python?', ['False', 'True (chunki bo‘sh bo‘lmagan satr)', 'None', 'ValueError'], ['False', 'True (non-empty string is truthy!)', 'None', 'ValueError'], 1, '`True`! Shuning uchun query boollarni qo‘lda solishtirish kerak.', '`True`!'),
      q('q1405_4', 'Majburiy resurs ID si odatda qayerda uzatiladi?', 'Required resource identifiers belong in:', ['Query param', 'Path parameter (`/items/{id}`)', 'Cookie', 'User-Agent'], ['Query param', 'Path parameter (`/items/{id}`)', 'Cookie', 'User-Agent'], 1, 'Path parameter da.', 'Path parameter.'),
      q('q1405_5', '`405 Method Not Allowed` javobi bilan qaysi sarlavhani qaytarish HTTP standartidir?', 'Required HTTP response header paired with `405 Method Not Allowed`?', ['Accept', 'Allow', 'Location', 'ETag'], ['Accept', 'Allow', 'Location', 'ETag'], 1, '`Allow`.', '`Allow`.'),
    ],
    homework: hw('Path & Query Router Engine', 'Compiled REST Router with 405 & Query Coercion', '`{id:int}` va `{slug}` shablonlarini regexga kompilyatsiya qiluvchi, route tartibini tekshiruvchi, query bool/int coercion qiluvchi hamda `404`/`405 Allow`/`422` qaytaruvchi `MiniRouter` yozing.', 'Build a `MiniRouter` compiling `{id:int}` and `{slug}` templates, checking typed query params (`bool` safely parsed), and emitting `200`/`404`/`405 Allow`/`422`.', ['{id:int} -> \\d+ va 405 Allow', 'bool("false") -> False testi'], ['Typed path segments + 405 Allow', 'Safe query boolean coercion'], 'Compile {name:int} to (?P<name>\\d+) and check allowed methods per path.', 'Clean router compiler.', 'Route conflict (ikki xil nomli bir xil shablon) aniqlovchi tekshiruv qo‘shing.', 'Detect colliding route patterns.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-06',
    courseId: 'web_backend',
    moduleId: 'c14_m2',
    order: 6,
    titleUz: 'Request Validation va Custom Error Contracts',
    titleEn: 'Request Validation, Coercion vs Strictness & Error Contracts',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-14-05'],
    conceptId: 'be_validation',
    whyUz: "Agar foydalanuvchi `{\"age\": -5, \"role\": \"superadmin\", \"unknown_field\": 123}` yuborsa, uni to‘g‘ridan-to‘g‘ri ORM/DB ga uzatish **Mass Assignment** hujumiga va ma’lumot buzilishiga olib keladi! **Request Validation** barcha kirishlarni darvozadayoq tekshirib, aniq maydon-xatolar ro‘yxatini (`422`) qaytaradi.",
    whyEn: 'Validate request bodies at the API boundary against allowlisted fields (blocking Mass Assignment), enforce cross-field invariants, and return structured `422` per-field errors.',
    analogyUz: "**Request Validation** — bu aeroportdagi bojxona tekshiruvi: sumka hajmi katta bo‘lsa (`Payload Too Large`), ichida ruxsatsiz buyum (`extra='forbid'` / `role` maydoni!) bo‘lsa, u ichkariga (Service/DB ga) umuman kiritilmaydi!",
    analogyEn: 'Boundary validation inspects luggage at the gate: rejecting unknown fields (mass assignment), out-of-range numbers, and invalid cross-field combinations with structured `422` details.',
    stopsUz: "Validatsiyada 3 muhim himoya: 1) **Mass Assignment himoyasi**: hech qachon `User(**request_json)` qilib xom lug‘atni modelga bermang — faqat **ruxsat etilgan (allowlisted)** maydonlarni oling! 2) Bitta xatoda to‘xtab qolmay, barcha maydon xatolarini (`[{\"field\": \"email\", \"msg\": ...}]`) yig‘ib qaytaring! 3) Maxfiy maydonlarni (parol) xato xabariga qo‘shib yubormang!",
    stopsEn: 'NEVER unpack untrusted JSON (`Model(**body)`) directly into DB records (Mass Assignment vulnerability). Collect all field errors together in one `422` response and omit sensitive raw input values from error messages.',
    objUz: ['Maydon darajasidagi (field-level) va maydonlararo (cross-field: `end_date > start_date`) validatsiya yozish', 'Mass Assignment hujumi nima va allowlist / `extra="forbid"` uni qanday to‘sishini bilish', '422 Unprocessable Entity maydon-xatolar kontraktini tuzish'],
    objEn: ['Validate field constraints and cross-field invariants together', 'Prevent Mass Assignment via explicit allowlists', 'Emit unified `422` structured error arrays (`[{loc, msg}]`)'],
    theoryUz: `### 1. Darvoza (Boundary) Validatsiyasi
Service qatlamiga kiradigan barcha ma’lumot avval tozalanishi (strip), turga tekshirilishi va biznes chegaralardan (\`1 <= qty <= 100\`) o‘tishi shart.
### 2. Mass Assignment Xavfi
\`user.update(request_json)\` — agar foydalanuvchi \`{"name": "Ali", "is_admin": true}\` yuborsa, o‘zini admin qilib oladi! Yechim: **Schema allowlist** (faqat \`{"name"}\` qabul qilinadi, ortiqcha maydonlar tashlanadi yoki \`422\` bilan rad etiladi).
### 3. Cross-Field Validation
\`start_date < end_date\` yoki \`password == confirm_password\` kabi bog‘liq maydonlarni birga tekshirish.
### 4. To‘liq \`422\` Xato Kontrakti
\`{"status": 422, "errors": [{"loc": "price", "msg": "must be > 0"}, ...]}\` — frontend bir vaqtda barcha qizil maydonlarni ko‘rsata oladi!`,
    theoryEn: `### 1. Boundary Validation
Sanitize, type-check, and range-check inputs before they ever reach Services or Databases.
### 2. Mass Assignment Defense
Never blindly apply arbitrary keys from \`request.json\`; filter strictly through an explicit field allowlist.
### 3. Cross-Field Rules
Check coupled invariants (\`end > start\`, \`discount <= price\`) cleanly after single-field checks pass.
### 4. Collecting All Errors
Aggregate every invalid field into \`errors: [{loc, msg}]\` so UIs highlight all issues in one pass.`,
    examples: [
      ex('Misol 1: Allowlist + Mass Assignment himoyasi + `422` yig‘uvchi', 'Example 1: Strict Validator Blocking Extra & Bad Fields', `def validate_booking(payload: dict) -> tuple[int, dict]:\n    allowed = {"room", "nights", "start_day", "end_day"}\n    errors = []\n    extra = sorted(set(payload.keys()) - allowed)\n    if extra:\n        errors.append({"loc": extra[0], "msg": "Extra field not permitted"})\n    nights = payload.get("nights")\n    if not isinstance(nights, int) or isinstance(nights, bool) or not (1 <= nights <= 30):\n        errors.append({"loc": "nights", "msg": "Must be integer 1..30"})\n    s, e = payload.get("start_day"), payload.get("end_day")\n    if isinstance(s, int) and isinstance(e, int) and e <= s:\n        errors.append({"loc": "end_day", "msg": "Must be after start_day"})\n    if errors:\n        return 422, {"status": 422, "errors": errors}\n    return 200, {k: payload[k] for k in allowed if k in payload}\n\nprint(validate_booking({"room": "A", "nights": 0, "start_day": 10, "end_day": 5, "is_admin": True}))`, `(422, {'status': 422, 'errors': [{'loc': 'is_admin', 'msg': 'Extra field not permitted'}, {'loc': 'nights', 'msg': 'Must be integer 1..30'}, {'loc': 'end_day', 'msg': 'Must be after start_day'}]})`, 'Bitta tekshiruvda ham ortiqcha `is_admin` (Mass Assignment), ham `nights=0`, ham `end_day <= start_day` ushlandi!', 'Catches mass-assignment extra keys, integer range errors, and cross-field failures in one `422` response.'),
      ex('Misol 2: Python da `isinstance(True, int)` tuzog‘i!', 'Example 2: The isinstance(True, int) Validation Gotcha', `print("isinstance(True, int):", isinstance(True, int))\ndef is_real_int(v) -> bool:\n    return isinstance(v, int) and not isinstance(v, bool)\nprint("is_real_int(True):", is_real_int(True), "| is_real_int(5):", is_real_int(5))`, `isinstance(True, int): True\nis_real_int(True): False | is_real_int(5): True`, 'JSON dan `true` kelganda Python `isinstance(True, int)` ni `True` beradi — shuning uchun `not isinstance(v, bool)` shart!', '`bool` subclasses `int` in Python, so guard strict integer checks with `and not isinstance(v, bool)`.'),
      ex('Misol 3: Matnni tozalash (Sanitization) + Bo‘sh string tekshiruvi', 'Example 3: Strip & Reject Blank Strings', `def clean_name(raw: str) -> str:\n    cleaned = raw.strip()\n    if not cleaned: raise ValueError("blank name")\n    return cleaned\nprint(repr(clean_name("  Aziza  ")))`, `'Aziza'`, 'Faqat bo‘sh joylardan (`"   "`) iborat nom `.strip()` dan keyin bo‘sh chiqib rad etiladi.', 'Trim whitespace first so `"   "` is properly rejected as blank.'),
    ],
    traceTitleUz: 'Boundary validatsiya izi',
    traceTitleEn: 'Tracing Multi-Error Validation',
    traceCode: `validate_booking({"nights": 0, "is_admin": True})`,
    traceSteps: [
      traceStep(1, 'Check extra keys', 'extra=["is_admin"]', 'Ruxsatsiz maydon qo‘shildi', 'Flagged extra field'),
      traceStep(2, 'Check nights', '0 not in 1..30', 'Diapazon xatosi qo‘shildi', 'Flagged range error'),
      traceStep(3, 'Return 422', '2 errors collected', 'Barcha xatolar birdan qaytdi', 'Returned all errors'),
    ],
    commonMistakes: [
      mistake('`user_dict.update(request_json)` bilan Mass Assignment teshigi ochish', 'Unfiltered Dict Update (Mass Assignment)', `user = {"name": "Ali", "role": "user"}\nuser.update({"name": "Ali", "role": "admin"})  # Attacker escalated role!\nprint("Hacked user:", user)`, 'Privilege escalation to admin!', `ALLOWED = {"name"}\nuser = {"name": "Ali", "role": "user"}\nuser.update({k: v for k, v in {"name": "Vali", "role": "admin"}.items() if k in ALLOWED})\nprint("Safe user:", user)`, 'So‘rov tanasini filtrsiz modelga yozish foydalanuvchiga `role`/`balance` ni o‘zgartirish imkonini beradi.', 'Unfiltered payload unpacking lets attackers overwrite protected fields like `role`.', 'Faqat allowlist dagi maydonlarni qabul qiling.', 'Filter strictly by an allowlist.'),
      mistake('`isinstance(val, int)` bilan `True`/`False` ni haqiqiy son deb qabul qilish', 'Accepting JSON Boolean true as Integer 1', `# In Python True + 5 == 6 because bool inherits from int!`, 'Accepts JSON `true` as quantity=1', `print("Always write: isinstance(v, int) and not isinstance(v, bool)!")`, 'JSON da `{"qty": true}` yuborilsa `isinstance(True, int)` True chiqadi!', '`isinstance(True, int)` is `True` in Python.', '`not isinstance(v, bool)` qo‘shing.', 'Exclude `bool` explicitly.'),
    ],
    compareTitleUz: 'Fail-Fast (1-xatoda to‘xtash) vs Collect-All Errors',
    compareTitleEn: 'Fail-Fast vs Collect-All Validation',
    compareUz: ['Fail-Fast: dastlabki autentifikatsiya (`401`) yoki body hajmi (`413`) da.', 'Collect-All (`422`): forma/API JSON maydonlarida foydalanuvchi barcha xatolarni bir urinishda tuzatishi uchun.'],
    compareEn: ['Fail-fast: auth, content-type, payload size gates.', 'Collect-all: form/JSON schemas so callers fix every field in one roundtrip.'],
    compareSummaryUz: 'API chegarasida allowlist bilan Mass Assignment ni to‘sing, `bool` ni `int` dan ajrating va `422` da barcha maydon xatolarini jamlab qaytaring.',
    compareSummaryEn: 'Block mass assignment with allowlists, guard `int` checks against `bool`, and collect all `422` field & cross-field errors.',
    practiceTasks: [
      pt('p1406_1', '1-mashq: Allowlist bilan Mass Assignment himoyasi', 'Task 1: Filter Allowlisted Keys', '`{"name": "Ali", "is_admin": True, "age": 20}` dan faqat `{"name", "age"}` ni qoldiring.', 'Filter allowed fields.', `p = {"name": "Ali", "is_admin": True, "age": 20}\nprint({k: p[k] for k in ("name", "age") if k in p})`, "{'name': 'Ali', 'age': 20}", 'Allowlist dict comprehension', 'Prints filtered dict.'),
      pt('p1406_2', '2-mashq: `bool` ni `int` dan ajratish', 'Task 2: Strict Int Guard', '`True`, `False`, `10` uchun `is_strict_int` natijasini chiqaring.', 'Reject booleans.', `def ok(v): return isinstance(v, int) and not isinstance(v, bool)\nprint(ok(True), ok(False), ok(10))`, 'False False True', 'and not isinstance(v, bool)', 'Prints False False True.'),
      pt('p1406_3', '3-mashq: Cross-field sana oralig‘i', 'Task 3: Cross-Field Date Order', '`start="2026-05-10"`, `end="2026-05-05"` da xato qaytaring.', 'Validate end > start.', `def check_dates(s, e): return "ok" if e > s else "end must be after start"\nprint(check_dates("2026-05-10", "2026-05-05"))`, 'end must be after start', 'Compare e > s', 'Prints error message.'),
      pt('p1406_4', '4-mashq: Extra field aniqlash', 'Task 4: Reject Unknown Keys', '`extra = set(body) - allowed` bo‘lsa xato ro‘yxatiga qo‘shing.', 'Detect forbidden extra keys.', `allowed, body = {"title"}, {"title": "Hi", "hack": 1}\nprint(sorted(set(body) - allowed))`, "['hack']", 'set(body) - allowed', "Prints ['hack']."),
      pt('p1406_5', '5-mashq: Blank string rad etish', 'Task 5: Strip & Reject Blank', '`"   "` da `422`, `" ok "` da `"ok"` qaytaring.', 'Trim and validate non-empty.', `def clean(s): return (200, t) if (t := s.strip()) else (422, "blank")\nprint(clean("   "), clean(" ok "))`, "(422, 'blank') (200, 'ok')", 'Check stripped string truthiness', 'Prints tuple.'),
    ],
    quiz: [
      q('q1406_1', 'Foydalanuvchi JSON da `{"name": "Ali", "is_admin": true}` yuborib o‘zini admin qilib olishi qanday hujum?', 'Vulnerability when unfiltered request JSON overwrites protected attributes like `is_admin`?', ['XSS', 'Mass Assignment', 'CSRF', 'Clickjacking'], ['XSS', 'Mass Assignment', 'CSRF', 'Clickjacking'], 1, 'Mass Assignment zaifligi.', 'Mass Assignment.'),
      q('q1406_2', 'Python da `isinstance(True, int)` natijasi nima bo‘ladi?', 'What does `isinstance(True, int)` return in Python?', ['False', 'True (`bool` `int` dan meros oladi)', 'TypeError', 'None'], ['False', 'True (`bool` subclasses `int`)', 'TypeError', 'None'], 1, '`True`! Shuning uchun `not isinstance(v, bool)` kerak.', '`True`!'),
      q('q1406_3', 'So‘rov validatsiyasida xatolarni qaytarish uchun eng mos HTTP status?', 'Standard HTTP status code for schema/field validation failures?', ['401', '403', '422 Unprocessable Entity', '500'], ['401', '403', '422 Unprocessable Entity', '500'], 2, '`422 Unprocessable Entity`.', '`422`.'),
      q('q1406_4', '`start_date < end_date` kabi ikki maydon orasidagi qoida nima deyiladi?', 'Validation rules spanning multiple fields together are called:', ['Type coercion', 'Cross-field validation', 'Hashing', 'Serialization'], ['Type coercion', 'Cross-field validation', 'Hashing', 'Serialization'], 1, 'Cross-field validation.', 'Cross-field validation.'),
      q('q1406_5', 'Forma/JSON validatsiyasida 1-xatodan keyin ham qolgan maydonlarni tekshirish nima uchun foydali?', 'Why collect all field errors into one `422` payload instead of stopping at the first error?', ['Tezroq', 'Mijoz barcha xato maydonlarni bitta urinishda tuzata oladi', 'Kichikroq JSON', 'DB tejaydi'], ['Faster', 'Callers see and fix every invalid field in one roundtrip', 'Smaller JSON', 'Saves DB'], 1, 'Bitta so‘rovda barcha xatolarni ko‘rsatish uchun.', 'Improves DX/UX in one roundtrip.'),
    ],
    homework: hw('Declarative Schema Validator Dvigateli', 'Custom Declarative Schema Validator', '`Field(type, min_val=..., max_val=..., strip=True)` va `extra="forbid"` hamda `@cross_validator` ni qo‘llab-quvvatlovchi, barcha xatolarni `422` ro‘yxatiga yig‘uvchi kichik validator klass yozing.', 'Implement a declarative `Schema` validator with `extra="forbid"`, whitespace stripping, strict `int` vs `bool` checks, integer bounds, and cross-field rules outputting `422` error lists.', ['extra="forbid" + strict int + cross-field', 'Kamida 5 ta test asserti'], ['Forbid extras + strict int + cross-field', '5 test assertions'], 'Loop over declared schema fields, collect errors, then run cross-field hook.', 'Clean validator engine.', 'Keyingi darsda buni Pydantic v2 qanday avtomatlashtirishini ko‘ring.', 'Compare with Pydantic v2 next lesson.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-14-07',
    courseId: 'web_backend',
    moduleId: 'c14_m2',
    order: 7,
    titleUz: 'Pydantic — Schemas, Field Constraints, Model Validators va Settings',
    titleEn: 'Pydantic v2: BaseModel, Field(), Model Validators & BaseSettings',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-14-06'],
    conceptId: 'be_pydantic',
    whyUz: "Har bir endpoint uchun 50 qator `isinstance` va `if` yozish o‘rniga **Pydantic v2** Rust tilida yozilgan yadro bilan bir zumda validatsiya, deserializatsiya, `ConfigDict(extra='forbid')` va JSON Schema generatsiyasini bajaradi! FastAPI, LangChain va zamonaviy Python ekotizimi aynan Pydantic ustida qurilgan.",
    whyEn: 'Replace boilerplate manual validation with Pydantic v2 patterns: `BaseModel`, `Field()` constraints, `ConfigDict(extra="forbid", strict=...)`, `@field_validator` / `@model_validator`, and separate Create/Read/Update schemas.',
    analogyUz: "**Pydantic BaseModel** — bu laboratoriya skaneri: oddiy Python type hint laringiz (`age: int = Field(ge=0, le=120)`) ni ko‘rib, kirgan xom JSON ni avtomatik tozalaydi, tekshiradi va toza Python obyektiga aylantirib beradi!",
    analogyEn: 'Pydantic turns standard Python type hints plus `Field()` bounds into a high-speed boundary scanner that parses, validates, and serializes data.',
    stopsUz: "Pydantic da 3 ta professional odat: 1) **Input va Output schemalarni ajrating**: `UserCreate` (ichida `password` bor), `UserOut` (ichida `password_hash` YO‘Q!), `UserPatch` (hamma maydon `| None = None`). 2) **`model_config = ConfigDict(extra='forbid')`** bilan ortiqcha maydonlarni bloklang! 3) `strict=False` (default) da `\"42\"` -> `42` ga aylanadi (`lax` coercion); qatʼiy kerak joyda `StrictInt` ishlating!",
    stopsEn: 'Always split `Create`, `Update` (optional fields), and `PublicOut` (never exposing `password_hash`) schemas. Use `ConfigDict(extra="forbid")` to reject unknown keys.',
    objUz: ['`BaseModel` + `Field(min_length=..., gt=..., pattern=...)` strukturasi va `model_dump()`/`model_validate()` ni bilish', '`@field_validator` (1 maydon) va `@model_validator(mode="after")` (ko‘p maydon) farqini qo‘llash', 'Create / Update / Response (`from_attributes=True`) schemalarini ajratish va `SecretStr` ishlatish'],
    objEn: ['Define `BaseModel` schemas with `Field()` bounds and `ConfigDict`', 'Write `@field_validator` and cross-field `@model_validator` hooks', 'Separate `Create`, `Patch`, and `PublicOut` schemas cleanly'],
    theoryUz: `### 1. Pydantic v2 Asosiy API
- \`UserCreate.model_validate(raw_dict)\` (yoki \`model_validate_json(raw_str)\`).
- \`user.model_dump()\` / \`user.model_dump(exclude_unset=True)\` (**\`PATCH\` da juda muhim** — faqat mijoz yuborgan maydonlarni olish!).
- \`ConfigDict(extra="forbid", str_strip_whitespace=True, from_attributes=True)\`.
### 2. \`Field()\` Cheklovlari
\`price_cents: int = Field(gt=0)\`, \`sku: str = Field(min_length=3, max_length=20)\`.
### 3. Validatorlar
- \`@field_validator("email")\`: bitta maydonni normallashtirish (\`v.lower()\`).
- \`@model_validator(mode="after")\`: \`self.end_date > self.start_date\` kabi maydonlararo shart.
### 4. Create / Update / Out Uchligi
\`UserCreate\` -> \`password\` bor; \`UserOut\` -> \`id\`, \`email\` bor, \`password\` mutlaqo YO‘Q!`,
    theoryEn: `### 1. Pydantic v2 Core Methods
\`model_validate\`, \`model_validate_json\`, \`model_dump(exclude_unset=True)\` (essential for \`PATCH\`), and \`ConfigDict\`.
### 2. \`Field()\` Constraints
Declarative bounds: \`gt\`, \`ge\`, \`lt\`, \`le\`, \`min_length\`, \`max_length\`, \`pattern\`.
### 3. Field & Model Validators
\`@field_validator\` normalizes single fields; \`@model_validator(mode="after")\` verifies cross-field invariants.
### 4. Schema Separation & \`from_attributes=True\`
Never reuse a single model for input creation, partial \`PATCH\`, and public output.`,
    examples: [
      ex('Misol 1: Pydantic-uslubidagi `Create` vs `Patch(exclude_unset)` vs `Out`', 'Example 1: Create / Patch(exclude_unset) / Out Separation', `from dataclasses import dataclass\n\n@dataclass\nclass UserPatch:\n    name: str | None = None\n    bio: str | None = None\n    def model_dump(self, exclude_unset: bool = False, provided: set[str] | None = None) -> dict:\n        d = {"name": self.name, "bio": self.bio}\n        if exclude_unset and provided is not None:\n            return {k: d[k] for k in provided if k in d}\n        return d\n\npatch = UserPatch(name="Aziz")\nprint("Full dump (DANGEROUS for PATCH!):", patch.model_dump())\nprint("exclude_unset=True (SAFE):", patch.model_dump(exclude_unset=True, provided={"name"}))`, `Full dump (DANGEROUS for PATCH!): {'name': 'Aziz', 'bio': None}\nexclude_unset=True (SAFE): {'name': 'Aziz'}`, '`PATCH` so‘rovida `exclude_unset=True` ishlatilmasa, yuborilmagan `bio` ustuni tasodifan `None` ga o‘chib ketadi!', 'Using `exclude_unset=True` ensures `PATCH` only updates fields actually sent by the client.'),
      ex('Misol 2: `UserOut` maxfiy `password_hash` ni yashirishi', 'Example 2: Output Schema Filtering Sensitive Fields', `db_row = {"id": 1, "email": "ali@uz.dev", "password_hash": "scrypt$secret"}\nOUT_FIELDS = ("id", "email")\npublic_out = {k: db_row[k] for k in OUT_FIELDS}\nprint("Safe UserOut:", public_out)`, `Safe UserOut: {'id': 1, 'email': 'ali@uz.dev'}`, '`UserOut` response model har doim `password_hash` ni filtrlab tashlaydi.', 'Separate output schemas guarantee secrets never leak in JSON responses.'),
      ex('Misol 3: Strict vs Lax Coercion (`"42"` vs `True`)', 'Example 3: Lax vs Strict Field Coercion', `def coerce_int(val, strict: bool = False) -> int:\n    if isinstance(val, bool) or (strict and not isinstance(val, int)):\n        raise ValueError("Invalid int")\n    return int(val)\n\nprint("lax '42':", coerce_int("42", strict=False))\ntry:\n    coerce_int("42", strict=True)\nexcept ValueError:\n    print("strict '42' rejected!")`, `lax '42': 42\nstrict '42' rejected!`, '`lax` rejimida query string `"42"` ni `42` ga o‘girish qulay; `strict=True` esa faqat haqiqiy `int` ni oladi.', 'Choose lax coercion for query strings or `strict=True` when exact JSON types matter.'),
    ],
    traceTitleUz: '`PATCH exclude_unset` izi',
    traceTitleEn: 'Tracing exclude_unset=True',
    traceCode: `patch = UserPatch(name="Aziz") # client sent {"name": "Aziz"}`,
    traceSteps: [
      traceStep(1, 'model_dump()', '{name:"Aziz", bio:None}', 'Yuborilmagan bio=None chiqdi!', 'Included default bio=None'),
      traceStep(2, 'model_dump(exclude_unset=True)', '{name:"Aziz"}', 'Faqat mijoz yuborgan maydon qoldi', 'Emitted only client-sent fields'),
    ],
    commonMistakes: [
      mistake('`PATCH` endpointda `model.model_dump()` ni `exclude_unset=True` siz DB ga yozish', 'Dumping Default None Values in PATCH Handlers', `# model.model_dump() without exclude_unset=True overwrites untouched DB columns with None!`, 'Wipes existing user profile fields', `print("Always call model.model_dump(exclude_unset=True) on PATCH payloads!")`, 'Mijoz faqat `{"name": "New"}` yuborganda `bio: None` bilan eski bio ni o‘chirib yuborasiz!', 'Unspecified optional fields default to `None` unless `exclude_unset=True` is passed.', '`exclude_unset=True` ishlating.', 'Pass `exclude_unset=True`.'),
      mistake('DB ORM modelini yoki `password_hash` li dictni to‘g‘ridan-to‘g‘ri API dan qaytarish', 'Returning Raw DB Models Without an Output Schema', `# Returning raw DB records often leaks password_hash, internal flags, or tokens!`, 'Sensitive data exposure', `print("Define an explicit UserOut response schema excluding secrets!")`, 'Response schema (`UserOut`) maxfiy maydonlarni avtomatik kesib tashlaydi.', 'Always serialize through an explicit public output schema.', '`UserOut` response modelini belgilang.', 'Use a dedicated `UserOut` schema.'),
    ],
    compareTitleUz: '`@dataclass` vs `TypedDict` vs Pydantic `BaseModel`',
    compareTitleEn: '`@dataclass` vs `TypedDict` vs Pydantic',
    compareUz: ['`TypedDict`: nol-overhead static dict tiplash (validatsiya yo‘q).', '`@dataclass`: tez ichki domen obyektlari (kutubxonasiz stdlib).', 'Pydantic `BaseModel`: API kirish/chiqish validatsiyasi, coercion, `exclude_unset`, OpenAPI va env config (`BaseSettings`).'],
    compareEn: ['`TypedDict`: zero-cost static typing for dicts.', '`@dataclass`: clean stdlib internal entities.', 'Pydantic `BaseModel`: untrusted boundary validation, coercion, and OpenAPI schema generation.'],
    compareSummaryUz: 'Pydantic da `Create` / `Update (exclude_unset=True)` / `Out` schemalarini ajrating va `extra="forbid"` bilan mass assignment ni bloklang.',
    compareSummaryEn: 'Split Pydantic `Create`, `Patch` (`exclude_unset=True`), and `Out` schemas, and set `extra="forbid"` on untrusted inputs.',
    practiceTasks: [
      pt('p1407_1', '1-mashq: `Out` schema filtri', 'Task 1: Redact Secret Fields', '`{"id": 1, "email": "a@b.uz", "password_hash": "x"}` dan `UserOut` (`id`, `email`) ajrating.', 'Filter output fields.', `row = {"id": 1, "email": "a@b.uz", "password_hash": "x"}\nprint({k: row[k] for k in ("id", "email")})`, "{'id': 1, 'email': 'a@b.uz'}", 'Select public fields only', 'Prints safe dict.'),
      pt('p1407_2', '2-mashq: `exclude_unset` PATCH simulyatsiyasi', 'Task 2: Exclude Unset Fields', '`sent = {"bio": "Dev"}` dan faqat yuborilgan maydonlarni eski yozuvga yangilang.', 'Patch only sent fields.', `db = {"name": "Ali", "bio": "Old"}\nsent = {"bio": "Dev"}\ndb.update(sent)\nprint(db)`, "{'name': 'Ali', 'bio': 'Dev'}", 'Update only provided keys', 'Prints updated dict.'),
      pt('p1407_3', '3-mashq: `str_strip_whitespace` normallashtirish', 'Task 3: Strip & Lowercase Email', '`@field_validator` kabi `"  ALI@UZ.DEV  "` ni tozalang.', 'Normalize email field.', `def norm_email(s): return s.strip().lower()\nprint(norm_email("  ALI@UZ.DEV  "))`, 'ali@uz.dev', 'strip().lower()', 'Prints ali@uz.dev.'),
      pt('p1407_4', '4-mashq: `Field(gt=0, le=100)` tekshiruvi', 'Task 4: Numeric Field Bounds', '`0 < x <= 100` shartini `0`, `50`, `101` da tekshiring.', 'Check numeric bounds.', `def ok(x): return 0 < x <= 100\nprint(ok(0), ok(50), ok(101))`, 'False True False', '0 < x <= 100', 'Prints False True False.'),
      pt('p1407_5', '5-mashq: `extra="forbid"` xabari', 'Task 5: Forbid Unknown Keys', '`allowed = {"sku"}` da `{"sku": "A", "role": "admin"}` kelganda `"role"` xatosini qaytaring.', 'Reject extra keys.', `allowed, body = {"sku"}, {"sku": "A", "role": "admin"}\nprint("extra:", sorted(set(body) - allowed))`, "extra: ['role']", 'set(body) - allowed', "Prints extra: ['role']."),
    ],
    quiz: [
      q('q1407_1', '`PATCH` so‘rovida yuborilmagan optional maydonlar `None` bo‘lib bazani buzmasligi uchun Pydantic da qaysi parametr ishlatiladi?', 'Parameter passed to `.model_dump()` in `PATCH` endpoints so omitted fields aren’t overwritten?', ['strict=True', 'exclude_unset=True', 'include_all=False', 'by_alias=True'], ['strict=True', 'exclude_unset=True', 'include_all=False', 'by_alias=True'], 1, '`model.model_dump(exclude_unset=True)`.', '`exclude_unset=True`.'),
      q('q1407_2', 'Ortiqcha nomaʼlum kalitlarni (`is_admin`) darhol rad etish uchun Pydantic `ConfigDict` ga nima yoziladi?', '`ConfigDict` setting rejecting unknown extra fields in Pydantic v2?', ['extra="ignore"', 'extra="forbid"', 'strict=False', 'frozen=True'], ['extra="ignore"', 'extra="forbid"', 'strict=False', 'frozen=True'], 1, '`extra="forbid"`.', '`extra="forbid"`.'),
      q('q1407_3', 'Nima uchun `UserCreate` va `UserOut` schemalari alohida yoziladi?', 'Why separate `UserCreate` and `UserOut` Pydantic schemas?', ['Fayl ko‘paytirish', 'Kirishda `password` qabul qilinadi, chiqishda esa `password_hash` hech qachon qaytarilmaydi', 'Tezlik uchun', 'SQL talabi'], ['More files', 'Input accepts `password` while output hides `password_hash` and exposes `id`', 'Speed', 'SQL'], 1, 'Maxfiy maydonlar response da chiqib ketmasligi uchun.', 'Prevents leaking sensitive fields.'),
      q('q1407_4', 'Bir nechta maydonni birga tekshirish (`password == confirm`) uchun Pydantic v2 da qaysi dekorator ishlatiladi?', 'Pydantic v2 decorator for cross-field invariants?', ['@field_validator', '@model_validator(mode="after")', '@property', '@dataclass'], ['@field_validator', '@model_validator(mode="after")', '@property', '@dataclass'], 1, '`@model_validator(mode="after")`.', '`@model_validator(mode="after")`.'),
      q('q1407_5', 'SQLAlchemy/ORM obyektidan (`user.email`) Pydantic model yaratish uchun `ConfigDict` da qaysi bayroq yoqiladi?', '`ConfigDict` flag enabling `Model.model_validate(orm_obj)` from object attributes?', ['from_dict=True', 'from_attributes=True', 'orm=False', 'use_enum=True'], ['from_dict=True', 'from_attributes=True', 'orm=False', 'use_enum=True'], 1, '`from_attributes=True`.', '`from_attributes=True`.'),
    ],
    homework: hw('Pydantic-Style Create / Patch / Out Moduli', 'Schema Contract Suite', 'Stdlib da `CreateUserSchema` (`extra="forbid"`, email normalizatsiya, parol uzunligi >= 8), `PatchUserSchema` (`exclude_unset=True`) va `UserOutSchema` (`password_hash` ni kesib tashlovchi `from_attributes`) uchligini yozing.', 'Build a complete `Create` / `Patch (exclude_unset)` / `Out (redacting password_hash)` schema trio with `extra="forbid"` and cross-field password confirmation validation.', ['Create, Patch(exclude_unset), Out schemalari', 'Mass assignment va PATCH overwrite testlari'], ['All 3 schemas', 'Test mass assignment & partial PATCH'], 'Track provided field keys explicitly for exclude_unset.', 'Clean schema pattern.', 'Environment `Settings` validatsiyasi bilan bog‘lang.', 'Connect with startup Settings.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),
];
