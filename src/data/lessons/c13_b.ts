import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C13_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-13-07',
    courseId: 'http_apis',
    moduleId: 'c13_m3',
    order: 7,
    titleUz: 'JSON API va Content Negotiation',
    titleEn: 'JSON APIs, Content Negotiation & Error Envelopes',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-13-06'],
    conceptId: 'net_json_api',
    whyUz: "Har bir endpoint boshqacha javob qaytarsa (`{\"err\": ...}`, boshqasida `\"Not found\"` matni, uchinchisida camelCase vs snake_case), frontend va mobil dasturchilar har bir endpoint uchun alohida kod yozishga majbur bo‘ladi! Yagona **JSON Envelope**, `Content-Type` va **RFC 9457 Problem Details** API larni professional qiladi.",
    whyEn: 'Design clean JSON APIs with `Content-Type: application/json`, ISO-8601 UTC dates, consistent naming, and standardized RFC 9457 Problem Details error payloads.',
    analogyUz: "**Content Negotiation** — restoranda mijozning \"Menga o‘zbek tilidagi menyuni bering\" (`Accept: application/json`) deyishi, ofitsiantning esa \"Mana, o‘zbek tilida\" (`Content-Type: application/json`) deb javob berishidir!",
    analogyEn: 'The client states preferred formats via `Accept`, and the server declares what it returned via `Content-Type` (or rejects unsupported formats with `415` / `406`).',
    stopsUz: "JSON API da 3 oltin qoida: 1) **`Content-Type: application/json`** tekshirilmagan yoki buzilgan JSON kelganda `500` emas, **`400 Bad Request`** (yoki noto‘g‘ri media turda **`415 Unsupported Media Type`**) qaytaring! 2) Sanalar doim **ISO-8601 UTC (`2026-11-20T09:00:00Z`)** bo‘lsin. 3) Python backendda snake_case (`created_at`) standartini izchil saqlang!",
    stopsEn: 'Return `400` on malformed JSON and `415 Unsupported Media Type` when `Content-Type` is wrong—never `500`. Serialize all timestamps as UTC ISO-8601 strings and keep JSON field casing consistent.',
    objUz: ['`Accept` (mijoz xohishi) va `Content-Type` (yuborilgan format) bilan Content Negotiation', 'Noto‘g‘ri JSON (`JSONDecodeError` -> `400`) va noto‘g‘ri MIME (`415`) ni to‘g‘ri boshqarish', 'Yagona JSON javob va RFC 9457 Problem Details (`type`, `title`, `status`, `detail`) tuzish'],
    objEn: ['Negotiate `Accept` and validate `Content-Type` (`415` / `406`)', 'Catch `json.JSONDecodeError` as `400 Bad Request` rather than `500`', 'Structure consistent pagination and RFC 9457 error envelopes'],
    theoryUz: `### 1. \`Content-Type\` vs \`Accept\`
- **Content-Type**: men hozir body ichida qaysi formatni yuboryapman (\`application/json\`).
- **Accept**: men javobda qaysi formatni kutaman (\`application/json\`).
Noto‘g‘ri \`Content-Type\` kelsa -> **\`415 Unsupported Media Type\`**.
### 2. \`json.loads()\` Xatolarini Tutish
Buzilgan JSON (\`"{bad"\`) kelganda server \`500\` tashlab yiqilmasligi, balki \`try/except json.JSONDecodeError:\` bilan **\`400 Bad Request\`** qaytarishi kerak!
### 3. RFC 9457 Problem Details Error Envelope
\`\`\`json
{"type": "https://api.uz/errors/not-found", "title": "Not Found", "status": 404, "detail": "User 99 missing"}
\`\`\`
### 4. JSON Cheklovlari
JSON da \`datetime\`, \`Decimal\` va \`NaN\` yo‘q! Pul uchun integer tiyin/cent yoki string, vaqt uchun ISO-8601 UTC ishlating.`,
    theoryEn: `### 1. Content Negotiation Headers
Validate incoming \`Content-Type\` (return \`415\` if not \`application/json\`) and inspect \`Accept\` (\`406\` if incompatible).
### 2. Graceful JSON Parsing
Wrap \`json.loads()\` in \`try/except json.JSONDecodeError\` to return \`400 Bad Request\` instead of crashing with \`500\`.
### 3. Standardized Error Envelope (RFC 9457)
Return uniform \`{type, title, status, detail}\` JSON error payloads across all endpoints.
### 4. JSON Serialization Hygiene
Serialize datetimes to UTC ISO-8601 strings and avoid NaN/Infinity or binary floats for money.`,
    examples: [
      ex('Misol 1: `Content-Type` (`415`) va `JSONDecodeError` (`400`) Handler', 'Example 1: Strict JSON Input Guard', `import json\n\ndef parse_json_request(headers: dict[str, str], body: str) -> tuple[int, dict]:\n    ct = {k.lower(): v for k, v in headers.items()}.get("content-type", "")\n    if "application/json" not in ct:\n        return 415, {"title": "Unsupported Media Type", "status": 415}\n    try:\n        return 200, json.loads(body)\n    except json.JSONDecodeError as e:\n        return 400, {"title": "Malformed JSON", "status": 400, "detail": e.msg}\n\nprint(parse_json_request({"Content-Type": "text/plain"}, "{}"))\nprint(parse_json_request({"Content-Type": "application/json"}, "{bad"))\nprint(parse_json_request({"Content-Type": "application/json"}, \'{"ok": true}\'))`, `(415, {'title': 'Unsupported Media Type', 'status': 415})\n(400, {'title': 'Malformed JSON', 'status': 400, 'detail': 'Expecting property name enclosed in double quotes'})\n(200, {'ok': True})`, 'Noto‘g‘ri Content-Type `415`, buzilgan JSON esa `500` emas `400` qaytardi.', 'Separates media-type rejection (`415`), malformed JSON (`400`), and valid parsing (`200`).'),
      ex('Misol 2: Yagona Pagination Envelope (`items` + `meta`)', 'Example 2: Paginated JSON Envelope', `import json\n\ndef paginated_response(items: list, page: int, total: int) -> str:\n    return json.dumps({"data": items, "meta": {"page": page, "total": total}})\n\nprint(paginated_response([{"id": 1}], 1, 25))`, `{"data": [{"id": 1}], "meta": {"page": 1, "total": 25}}`, 'Frontend jami sahifalar sonini `meta` dan darhol oladi.', 'Wrapping collections in `{data, meta}` keeps pagination metadata consistent.'),
      ex('Misol 3: UTC ISO-8601 Serializer (`default=`)', 'Example 3: Custom JSON Datetime Serializer', `from datetime import datetime, timezone\nimport json\n\ndef json_default(obj):\n    if isinstance(obj, datetime):\n        return obj.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")\n    raise TypeError(type(obj))\n\ndt = datetime(2026, 5, 1, 14, 30, tzinfo=timezone.utc)\nprint(json.dumps({"created_at": dt}, default=json_default))`, `{"created_at": "2026-05-01T14:30:00Z"}`, '`json.dumps(..., default=...)` Python `datetime` obyektini xalqaro UTC ISO-8601 formatiga o‘giradi.', 'Custom `default=` serializer emits clean UTC ISO-8601 timestamps.'),
    ],
    traceTitleUz: 'JSON request validatsiya izi',
    traceTitleEn: 'Tracing JSON Media-Type Check',
    traceCode: `# check Content-Type -> json.loads -> 200 or 400/415`,
    traceSteps: [
      traceStep(1, 'check Content-Type', 'application/json', 'Media tur tasdiqlandi', 'Verified JSON Content-Type'),
      traceStep(2, 'json.loads(body)', 'dict or JSONDecodeError', 'JSON tahlil qilindi', 'Parsed or caught 400'),
    ],
    commonMistakes: [
      mistake('Buzilgan JSON kelganda `json.loads` xatosini tutmasdan `500` chiqarish', 'Letting JSONDecodeError Crash with 500', `# Uncaught json.JSONDecodeError looks like a server outage (500) even though client sent invalid syntax (400)!`, 'Noisy 500 alerts on bad client input', `print("Catch json.JSONDecodeError and return 400 Bad Request!")`, 'Mijoz yuborgan buzuq sintaksis server xatosi (`500`) emas, `400 Bad Request`!', 'Client syntax errors must return `400`, never `500`.', '`JSONDecodeError` ni ushlab `400` qaytaring.', 'Catch `JSONDecodeError` -> `400`.'),
      mistake('`json.dumps` da `allow_nan=True` tufayli `NaN` chiqib ketishi', 'Emitting Non-Standard NaN in JSON', `import json\ntry:\n    json.dumps({"x": float("nan")}, allow_nan=False)\nexcept ValueError:\n    print("Blocked non-standard NaN!")`, 'Strict JSON forbids NaN/Infinity', `print("Use allow_nan=False when serializing numeric analytics to JSON!")`, 'Standart RFC 8259 JSON da `NaN` va `Infinity` mavjud emas — JS `JSON.parse` yiqiladi!', 'RFC 8259 JSON rejects `NaN` and `Infinity`; `JSON.parse()` in browsers throws.', 'Doim `allow_nan=False` ishlating.', 'Pass `allow_nan=False`.'),
    ],
    compareTitleUz: 'Yalang‘och Array `[...]` vs Envelope `{"data": [...], "meta": {...}}`',
    compareTitleEn: 'Bare JSON Array vs `{data, meta}` Envelope',
    compareUz: ['Yalang‘och `[...]`: oddiy statik ro‘yxat (keyinchalik pagination/total qo‘shish qiyin — breaking change!).', 'Envelope `{"data": [...], "meta": {...}}`: pagination, cursor, versiya qo‘shish uchun moslashuvchan.'],
    compareEn: ['Bare `[...]`: breaks backwards compatibility when adding pagination metadata later.', '`{data, meta}` envelope: future-proof for pagination and cursors.'],
    compareSummaryUz: 'JSON API larda `Content-Type`/`Accept` ni tekshiring, `JSONDecodeError` ga `400` bering va RFC 9457 xato formatini standartlashtiring.',
    compareSummaryEn: 'Enforce `Content-Type` (`415`), return `400` on invalid JSON, and standardize `{data, meta}` and RFC 9457 error envelopes.',
    practiceTasks: [
      pt('p1307_1', '1-mashq: `415` Content-Type himoyasi', 'Task 1: Reject Wrong Content-Type', '`Content-Type` `"application/json"` bo‘lmasa `415` qaytaring.', 'Return 415 for text/plain.', `def check_ct(ct): return 200 if "application/json" in ct.lower() else 415\nprint(check_ct("text/html"), check_ct("application/json; charset=utf-8"))`, '415 200', 'Check substring in lower()', 'Prints 415 200.'),
      pt('p1307_2', '2-mashq: `JSONDecodeError` -> `400`', 'Task 2: Graceful 400 on Bad JSON', '`"{oops"` kelganda `400` qaytaruvchi helper yozing.', 'Catch JSONDecodeError.', `import json\ndef parse(s):\n    try: return 200, json.loads(s)\n    except json.JSONDecodeError: return 400, {"error": "bad json"}\nprint(parse("{oops"))`, "(400, {'error': 'bad json'})", 'except json.JSONDecodeError', 'Prints 400 error tuple.'),
      pt('p1307_3', '3-mashq: `allow_nan=False` tekshiruvi', 'Task 3: Forbid NaN JSON', '`float("nan")` da `allow_nan=False` `ValueError` berishini ko‘rsating.', 'Reject NaN in JSON.', `import json\ntry:\n    json.dumps({"v": float("nan")}, allow_nan=False)\nexcept ValueError:\n    print("nan blocked")`, 'nan blocked', 'allow_nan=False', 'Prints nan blocked.'),
      pt('p1307_4', '4-mashq: RFC 9457 Error Envelope', 'Task 4: Problem Details Builder', '`problem(404, "Not Found", "Item 3 missing")` lug‘atini chiqaring.', 'Build RFC 9457 dict.', `def problem(st, title, detail): return {"title": title, "status": st, "detail": detail}\nprint(problem(404, "Not Found", "Missing"))`, "{'title': 'Not Found', 'status': 404, 'detail': 'Missing'}", 'Return standardized dict', 'Prints Problem Details.'),
      pt('p1307_5', '5-mashq: UTC ISO-8601 `default=`', 'Task 5: Datetime JSON Default', '`datetime(2026, 1, 2, tzinfo=timezone.utc)` ni JSON ga o‘giring.', 'Serialize UTC datetime.', `from datetime import datetime, timezone\nimport json\ndt = datetime(2026, 1, 2, tzinfo=timezone.utc)\nprint(json.dumps({"ts": dt}, default=lambda d: d.strftime("%Y-%m-%dT%H:%M:%SZ")))`, '{"ts": "2026-01-02T00:00:00Z"}', 'json.dumps default=', 'Prints JSON UTC timestamp.'),
    ],
    quiz: [
      q('q1307_1', 'Client `Content-Type: text/plain` bilan JSON endpointga so‘rov yuborsa qaysi status qaytarish to‘g‘ri?', 'Best status code when a JSON-only endpoint receives `Content-Type: text/plain`?', ['200', '404', '415 Unsupported Media Type', '500'], ['200', '404', '415 Unsupported Media Type', '500'], 2, '`415 Unsupported Media Type`.', '`415 Unsupported Media Type`.'),
      q('q1307_2', 'Buzilgan JSON satri (`"{bad"`) kelganda qaysi status qaytarilishi kerak?', 'Status code when incoming JSON fails `json.loads()`?', ['500', '400 Bad Request', '401', '204'], ['500', '400 Bad Request', '401', '204'], 1, '`400 Bad Request`.', '`400 Bad Request`.'),
      q('q1307_3', '`Accept` va `Content-Type` sarlavhalari orasidagi farq?', 'Difference between `Accept` and `Content-Type` headers?', ['Bir xil', '`Content-Type` yuborilayotgan body formatini, `Accept` esa javobda kutilayotgan formatni bildiradi', 'Accept faqat POST da', 'Content-Type faqat GET da'], ['Same', '`Content-Type` describes the payload sent; `Accept` specifies preferred response formats', 'POST only', 'GET only'], 1, '`Content-Type` body turi, `Accept` kutilgan javob turi.', '`Content-Type` = sent; `Accept` = wanted.'),
      q('q1307_4', 'Nima uchun `json.dumps(..., allow_nan=False)` ishlatish xavfsizroq?', 'Why pass `allow_nan=False` to `json.dumps()`?', ['Tezroq', 'RFC 8259 JSON standarti `NaN`/`Infinity` ni qo‘llamaydi va JS `JSON.parse` yiqiladi', 'ASCII qiladi', 'Qisqartiradi'], ['Faster', 'Standard RFC 8259 JSON forbids `NaN`/`Infinity`, which break strict parsers', 'ASCII', 'Compact'], 1, 'Strict JSON parsers `NaN` da xato beradi.', 'Prevents non-standard NaN.'),
      q('q1307_5', 'API da vaqt maydonlari (`created_at`) uchun eng ishonchli format?', 'Standard format for timestamps in JSON APIs?', ['Mahalliy soat matni', 'UTC ISO-8601 (`2026-11-20T09:00:00Z`)', 'Faqat kun', 'Float'], ['Local string', 'UTC ISO-8601 (`YYYY-MM-DDTHH:MM:SSZ`)', 'Day only', 'Float'], 1, 'UTC ISO-8601.', 'UTC ISO-8601.'),
    ],
    homework: hw('Content-Negotiating JSON Middleware', 'Strict JSON API Envelope Handler', '`Accept`, `Content-Type`, `json.loads(..., parse_constant=...)`, `allow_nan=False` va RFC 9457 Problem Details xato formatini qo‘llovchi universal `handle_json_api(headers, body, handler)` wrapperini yozing.', 'Build a `handle_json_api` wrapper validating `Content-Type` (`415`), `Accept` (`406`), `JSONDecodeError` (`400`), and formatting errors per RFC 9457.', ['415, 406, 400 va 200 testlari', 'allow_nan=False'], ['Test 415, 406, 400, 200', 'Enforce allow_nan=False'], 'Wrap handler exceptions cleanly into RFC 9457 dict.', 'Consistent API envelope.', 'ETag kesh (`304 Not Modified`) tekshiruvini ham qo‘shing.', 'Add ETag 304 support.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-08',
    courseId: 'http_apis',
    moduleId: 'c13_m3',
    order: 8,
    titleUz: 'Python HTTP Clientlar (requests / httpx) — Timeout, Session va Backoff Retry',
    titleEn: 'HTTP Clients (requests & httpx): Timeouts, Sessions & Exponential Backoff',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-13-07'],
    conceptId: 'net_http_clients',
    whyUz: "Production da tashqi API chaqiruvlarning №1 qulash sababi: **`requests.get(url)` ni `timeout=` siz chaqirish!** Agar tashqi server osilib qolsa, sizning Python workeringiz abadiy muzlab qoladi va butun sayt yiqiladi! To‘g‘ri HTTP klient **timeout**, **connection pooling (`Session`)**, **`raise_for_status()`** va **Exponential Backoff Retry** ga ega bo‘ladi.",
    whyEn: 'Write resilient Python HTTP clients using `Session` / `httpx.Client` connection pooling, mandatory `(connect, read)` timeouts, `raise_for_status()`, and jittered exponential backoff retries.',
    analogyUz: "**Timeout siz `requests.get()`** — telefonda javob bermayotgan raqamni soatlab uzmasdan kutib turish (qolgan hamma qo‘ng‘iroqlar bloklanadi!). **Exponential Backoff** — band raqamga 1s, 2s, 4s (+ biroz tasodifiy jitter) kutib qayta terish!",
    analogyEn: 'A missing timeout hangs your worker forever; exponential backoff with jitter backs off (`1s, 2s, 4s`) so retries don’t overwhelm a recovering server.',
    stopsUz: "Har bir `requests` / `httpx` chaqiruvida 4 majburiy qoida: 1) Doim **`timeout=(3.0, 10.0)`** bering (requests da sukut bo‘yicha `timeout=None` — CHEKSIZ!). 2) Bir xil hostga ko‘p so‘rovda **`requests.Session()`** / **`httpx.Client()`** ishlating (TCP+TLS qayta ulanmaydi). 3) **`resp.raise_for_status()`** chaqiring (`requests` 404/500 da avtomatik xato ko‘tarmaydi!). 4) Faqat `429`/`5xx`/Timeout da retry qiling (`400`/`404` ni emas!).",
    stopsEn: '`requests` defaults to `timeout=None` (infinite wait) and does NOT raise on `4xx`/`5xx` unless you call `resp.raise_for_status()`. Reuse `Session()`/`httpx.Client()` for keep-alive pooling and only retry transient `429`/`5xx`/timeouts.',
    objUz: ['`timeout=(connect, read)` va `Session()` / `httpx.Client()` keep-alive ahamiyatini bilish', '`resp.raise_for_status()` bilan 4xx/5xx xatolarni o‘tkazib yubormaslik', 'Exponential Backoff + Jitter bilan faqat vaqtinchalik xatolarni (`429`, `502`, `503`) qayta urinish'],
    objEn: ['Enforce explicit `(connect, read)` timeouts and reuse `Session`/`httpx.Client` pools', 'Call `raise_for_status()` to catch `4xx`/`5xx` failures cleanly', 'Implement jittered exponential backoff retrying only `429`/`5xx`/timeouts'],
    theoryUz: `### 1. \`requests\` vs \`httpx\`
- **\`requests\`**: klassik sinxron HTTP klient (\`with requests.Session() as s:\`).
- **\`httpx\`**: zamonaviy sync + **async** (\`async with httpx.AsyncClient() as c:\`) va HTTP/2 qo‘llab-quvvatlaydi (FastAPI testlari ham \`httpx\` da!).
### 2. \`timeout\` Majburiyligi
\`requests.get(url, timeout=(3.0, 10.0))\` — ulanishga 3s, javob o‘qishga 10s limit.
### 3. \`raise_for_status()\`
\`requests\` 404 yoki 500 kelsa ham oddiy \`Response\` qaytaradi; \`resp.raise_for_status()\` 4xx/5xx da \`HTTPError\` ko‘taradi!
### 4. Exponential Backoff + Jitter
Kutish vaqti: \`base * (2 ** attempt) + random_jitter\`. Faqat \`429\`, \`500\`, \`502\`, \`503\`, \`504\` yoki tarmoq timeoutlarida retry qilinadi (\`400\`, \`401\`, \`404\` da ASLO retry qilmang!).`,
    theoryEn: `### 1. \`requests\` vs \`httpx\`
\`requests\` is synchronous; \`httpx\` supports both sync (\`Client\`) and async (\`AsyncClient\`) plus HTTP/2.
### 2. Always Specify \`timeout\`
Never rely on \`requests\`’s infinite default timeout; pass \`timeout=(connect, read)\` (or \`httpx.Timeout(10.0, connect=3.0)\`).
### 3. Always Call \`raise_for_status()\`
\`4xx\`/\`5xx\` responses do not throw automatically—call \`resp.raise_for_status()\` before \`.json()\`.
### 4. Transient-Only Exponential Backoff
Retry only \`429\`/\`5xx\`/timeouts with \`base * 2**attempt + jitter\`, never deterministic \`400\`/\`404\` errors.`,
    examples: [
      ex('Misol 1: Exponential Backoff + Transient Error Retry Simulyatori', 'Example 1: Resilient Client Retry Pattern', `import random\nrandom.seed(42)\n\nclass MockResponse:\n    def __init__(self, status: int, data: dict):\n        self.status_code, self._data = status, data\n    def raise_for_status(self):\n        if self.status_code >= 400:\n            raise RuntimeError(f"HTTP {self.status_code}")\n    def json(self): return self._data\n\ndef fetch_with_retry(transport, max_attempts: int = 4):\n    delays = []\n    for attempt in range(max_attempts):\n        resp = transport()\n        if resp.status_code in (429, 502, 503, 504) and attempt < max_attempts - 1:\n            delay = round(0.5 * (2 ** attempt) + random.uniform(0, 0.1), 3)\n            delays.append(delay)\n            continue\n        resp.raise_for_status()\n        return resp.json(), delays\n\nseq = iter([MockResponse(503, {}), MockResponse(503, {}), MockResponse(200, {"ok": True})])\nprint(fetch_with_retry(lambda: next(seq)))`, `({'ok': True}, [0.564, 1.003])`, '2 ta `503` dan keyin exponential kutish bilan 3-urinishda muvaffaqiyatli natija olindi.', 'Backs off exponentially on transient `503` responses and succeeds on attempt 3.'),
      ex('Misol 2: `404` ni qayta urinmasdan darhol to‘xtatish', 'Example 2: Failing Fast on Deterministic 4xx', `def should_retry_status(code: int) -> bool:\n    return code in {429, 500, 502, 503, 504}\n\nprint("400 retry?", should_retry_status(400), "| 429 retry?", should_retry_status(429))`, `400 retry? False | 429 retry? True`, '`400`/`404` da 5 marta urinish foydasiz — darhol xato qaytarish kerak.', 'Never waste retries on client-side `400`/`401`/`404` errors.'),
      ex('Misol 3: Connection Reuse (`Session` vs One-Off)', 'Example 3: Session Keep-Alive Pooling', `class MockSession:\n    def __init__(self): self.handshakes = 0; self.connected = False\n    def get(self, path: str) -> str:\n        if not self.connected: self.handshakes += 1; self.connected = True\n        return f"200 {path}"\n\ns = MockSession()\nfor p in ["/a", "/b", "/c"]: s.get(p)\nprint("Total TCP/TLS handshakes for 3 calls:", s.handshakes)`, `Total TCP/TLS handshakes for 3 calls: 1`, '`Session` / `httpx.Client` Keep-Alive ulanishini saqlab 3 ta so‘rovda atigi 1 marta handshake qiladi.', 'Keep-alive pooling avoids repeating expensive TCP/TLS handshakes per request.'),
    ],
    traceTitleUz: 'Backoff Retry sikli izi',
    traceTitleEn: 'Tracing Retry & raise_for_status',
    traceCode: `# attempt 0 -> 503 (sleep ~0.5s) -> attempt 1 -> 200 -> return json`,
    traceSteps: [
      traceStep(1, 'attempt 0: status=503', 'transient -> backoff', '503 qayta urinish ro‘yxatida', 'Transient 503 -> wait 0.5s'),
      traceStep(2, 'attempt 1: status=200', 'raise_for_status ok', '200 javob muvaffaqiyatli o‘tdi', 'Returned JSON payload'),
    ],
    commonMistakes: [
      mistake('`requests.get(url)` da `timeout=` bermaslik', 'Calling requests.get() Without Timeout', `# requests.get("https://slow-api.example") waits FOREVER by default (timeout=None)!`, 'Thread/worker hang until OS kills process', `print("Always pass explicit timeout=(3.0, 10.0) on EVERY HTTP client call!")`, '`requests` kutubxonasida sukut bo‘yicha timeout **cheksiz**!', '`requests` has no default timeout (`None`), risking permanent worker hangs.', 'Har doim `timeout=(connect, read)` yozing.', 'Always supply an explicit `timeout`.'),
      mistake('`resp.raise_for_status()` chaqirmasdan `resp.json()` qilish', 'Forgetting resp.raise_for_status() Before .json()', `# On 502 Bad Gateway HTML page, resp.json() crashes with JSONDecodeError hiding the 502!`, 'Masked HTTP errors', `print("Call resp.raise_for_status() BEFORE parsing resp.json()!")`, 'HTML xato sahifasida `resp.json()` haqiqiy status kodni yashirib `JSONDecodeError` beradi.', 'Parsing error pages hides the real HTTP status code.', 'Avval `resp.raise_for_status()` chaqiring.', 'Call `resp.raise_for_status()` first.'),
    ],
    compareTitleUz: '`requests` vs `httpx`',
    compareTitleEn: '`requests` vs `httpx`',
    compareUz: ['`requests` + `Session()`: oddiy sinxron skriptlar va keng ekotizim uchun.', '`httpx` + `AsyncClient`: `async/await` backendlar (FastAPI), HTTP/2 va zamonaviy `Timeout` obyekti uchun.'],
    compareEn: ['`requests`: rock-solid synchronous client with `Session()`.', '`httpx`: drop-in sync + `async/await` support, HTTP/2, and built-in default 5s timeout!'],
    compareSummaryUz: 'Python HTTP klientlarida doim `Session`/`httpx.Client`, `timeout=(3, 10)`, `raise_for_status()` va transient-only exponential backoff ishlating.',
    compareSummaryEn: 'Reuse `Session`/`httpx.Client` pools, always set `timeout`, call `raise_for_status()`, and retry only transient `429`/`5xx` with jittered backoff.',
    practiceTasks: [
      pt('p1308_1', '1-mashq: `raise_for_status` simulyatsiyasi', 'Task 1: Status Guard', 'Status >= 400 da `ValueError` ko‘taruvchi `check_status(code)` yozing.', 'Raise on >= 400.', `def check_status(c):\n    if c >= 400: raise ValueError(f"HTTP {c}")\n    return "ok"\ntry:\n    check_status(502)\nexcept ValueError as e:\n    print(e)`, 'HTTP 502', 'if c >= 400', 'Prints HTTP 502.'),
      pt('p1308_2', '2-mashq: Exponential Backoff formulasi', 'Task 2: Compute Backoff Schedule', '0, 1, 2 urinishlar uchun `0.5 * (2 ** attempt)` ro‘yxatini chiqaring.', 'Compute backoff delays.', `print([0.5 * (2 ** i) for i in range(3)])`, '[0.5, 1.0, 2.0]', '0.5 * (2 ** i)', 'Prints [0.5, 1.0, 2.0].'),
      pt('p1308_3', '3-mashq: Transient vs Non-Transient filter', 'Task 3: Retry Filter', '`[400, 401, 404, 429, 503]` dan retry qilinadiganlarini chiqaring.', 'Filter retryable codes.', `print([c for c in [400, 401, 404, 429, 503] if c in {429, 500, 502, 503, 504}])`, '[429, 503]', 'Check retry set', 'Prints [429, 503].'),
      pt('p1308_4', '4-mashq: `Retry-After` sarlavhasini o‘qish', 'Task 4: Respect Retry-After Header', '`429` da `Retry-After: "3"` bo‘lsa kutish vaqtini `int` qilib oling.', 'Parse Retry-After header.', `hdrs = {"Retry-After": "3"}\nprint(int(hdrs.get("Retry-After", 1)))`, '3', 'hdrs.get("Retry-After")', 'Prints 3.'),
      pt('p1308_5', '5-mashq: Timeout tuple tekshiruvi', 'Task 5: Validate Timeout Tuple', '`timeout=(3.0, 10.0)` da har ikki son musbat ekanini tekshiring.', 'Validate connect & read timeout.', `t = (3.0, 10.0)\nprint(all(v > 0 for v in t) and len(t) == 2)`, 'True', 'connect > 0 and read > 0', 'Prints True.'),
    ],
    quiz: [
      q('q1308_1', '`requests.get("https://api.uz")` da `timeout=` ko‘rsatilmasa sukut bo‘yicha qancha kutadi?', 'Default timeout when calling `requests.get(url)` without `timeout=`?', ['5 soniya', '30 soniya', 'Cheksiz (`None` — server javob bermasa abadiy muzlaydi)', '1 soniya'], ['5s', '30s', 'Infinite (`None` — hangs forever if server stalls)', '1s'], 2, 'Cheksiz (`None`).', 'Infinite (`None`).'),
      q('q1308_2', '`requests` da `404` yoki `500` kelganda avtomatik Python Exception ko‘taruvchi metod?', 'Method on a `requests.Response` that raises `HTTPError` on 4xx/5xx?', ['resp.validate()', 'resp.raise_for_status()', 'resp.check_ok()', 'resp.throw()'], ['resp.validate()', 'resp.raise_for_status()', 'resp.check_ok()', 'resp.throw()'], 1, '`resp.raise_for_status()`.', '`resp.raise_for_status()`.'),
      q('q1308_3', 'Qaysi status kodlari kelganda Exponential Backoff bilan qayta urinish (retry) MANTIQLI?', 'Which HTTP status codes should an HTTP client retry with backoff?', ['400 va 404', '429 va 5xx (502, 503, 504)', '401 va 403', '200'], ['400 and 404', '429 and transient 5xx (502, 503, 504)', '401 and 403', '200'], 1, 'Vaqtinchalik `429` va `5xx`.', '`429` and transient `5xx`.'),
      q('q1308_4', 'Nima uchun backoff vaqtiga tasodifiy "Jitter" qo‘shiladi?', 'Why add random jitter to exponential backoff delays?', ['Kodni qiyinlashtirish', 'Hamma mijozlar bir soniyada qayta urinib serverni qulatmasligi (thundering herd) uchun', 'Xavfsizlik', 'JSON uchun'], ['Complexity', 'Avoids thundering herd spikes where all clients retry simultaneously', 'Crypto', 'JSON'], 1, 'Thundering herd muammosini oldini oladi.', 'Prevents synchronized retry spikes.'),
      q('q1308_5', 'Bir xil API ga 100 ta so‘rov yuborganda `requests.Session()` / `httpx.Client()` ning asosiy foydasi?', 'Main performance gain of reusing `requests.Session()` / `httpx.Client()`?', ['Shifrlashni o‘chiradi', 'TCP va TLS ulanishlarini Keep-Alive bilan qayta ishlatadi (connection pooling)', 'JSON siqadi', 'DNS o‘chiradi'], ['No TLS', 'Reuses persistent TCP/TLS connections via keep-alive pooling', 'Compresses JSON', 'No DNS'], 1, 'TCP/TLS connection pooling.', 'TCP/TLS connection pooling.'),
    ],
    homework: hw('Resilient API Client Wrapper', 'Mockable Retry + Circuit Client', 'Transport funksiyasi ustida `timeout` tekshiruvi, `raise_for_status()`, `Retry-After` hurmat qilish, jittered exponential backoff va 3 ta ketma-ket 5xx da ochiladigan oddiy **Circuit Breaker** yozing.', 'Implement a resilient `ApiClient` wrapper supporting `raise_for_status()`, `Retry-After` handling, jittered exponential backoff on `429`/`5xx`, and a simple 3-failure circuit breaker.', ['4xx (400/404) da retry qilmaslik', '429/503 da retry + backoff bilan muvaffaqiyat testi'], ['Fail fast on 400/404', 'Retry 429/503 cleanly'], 'Check status in {429, 502, 503, 504} before sleeping/retrying.', 'Clean retry state machine.', 'Real loyihalarda `httpx.AsyncClient` bilan bir xil shablonni ishlating.', 'Adapt pattern for `httpx.AsyncClient`.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-09',
    courseId: 'http_apis',
    moduleId: 'c13_m3',
    order: 9,
    titleUz: 'REST API Dizayn Tamoyillari, Versiyalash va Cursor Pagination',
    titleEn: 'REST API Design: Resource URLs, Filtering, Versioning & Cursor Pagination',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-13-08'],
    conceptId: 'net_rest_design',
    whyUz: "Yomon API: `POST /getAllUsers`, `GET /createOrder`, `POST /deleteUserById` (URL da feʼllar va noto‘g‘ri metodlar!). Professional **REST API** da URL — **ko‘plikdagi otlar (nouns)** (`/v1/orders/{id}/items`), harakatni esa **HTTP metodlari** (`GET`, `POST`, `PATCH`, `DELETE`) belgilaydi!",
    whyEn: 'Design intuitive, backward-compatible REST APIs using plural resource nouns, `/v1` versioning, filtering/sorting query parameters, and cursor pagination.',
    analogyUz: "**REST URL** — fayl papka manzili (otlar: `/v1/courses/9/lessons`), **HTTP Metod** — esa o‘sha papka ustidagi harakat (`GET` o‘qi, `POST` yarat, `PATCH` tahrirla, `DELETE` o‘chir)!",
    analogyEn: 'REST URLs name resources as plural nouns; HTTP verbs specify the action on those nouns.',
    stopsUz: "REST dizaynida 3 qoida: 1) URL da feʼl (`getUsers`, `deleteBook`) yozmang — ko‘plik ot (`/v1/users`, `/v1/books/{id}`) yozing. 2) Yangi va eski mijozlar sinmasligi uchun API ni **`/api/v1/...`** bilan versiyalang. 3) Dinamik katta ro‘yxatlarda `OFFSET` o‘rniga **Cursor Pagination** (`?cursor=last_id&limit=20`) ishlating — chunki `OFFSET` yangi element qo‘shilganda takroriy/tushib qolgan qatorlar beradi!",
    stopsEn: 'Use plural nouns (`/v1/books/{id}`) instead of verb URLs (`/getBook`). Version APIs (`/v1`), and prefer cursor pagination (`?after_id=...&limit=...`) over `OFFSET` on live feeds so new inserts don’t shift pages.',
    objUz: ['RESTful URL dizayni: ko‘plik otlar + HTTP metodlari + ichma-ich resurslar', 'API Versiyalash (`/v1/...`) va Backward Compatibility qoidalari', 'Cursor (Keyset) Pagination vs Offset Pagination farqini Python da amalga oshirish'],
    objEn: ['Design clean plural-noun REST endpoints and nested sub-resources', 'Apply `/v1` versioning and additive non-breaking evolution', 'Implement cursor-based pagination (`next_cursor`) cleanly'],
    theoryUz: `### 1. RESTful Resurs Nomlash
- \`GET /v1/courses\` — ro‘yxat
- \`POST /v1/courses\` — yangisini yaratish
- \`GET /v1/courses/14\` — bittasini olish
- \`PATCH /v1/courses/14\` — qisman yangilash
- \`DELETE /v1/courses/14\` — o‘chirish
(Maxsus amallar uchun resurs ostida: \`POST /v1/orders/42/cancel\`).
### 2. Filtrlash, Saralash va Maydon Tanlash
\`GET /v1/courses?stage=advanced&sort=-enrolled&limit=10\`.
### 3. Cursor Pagination (\`after_id\`)
\`OFFSET\` sahifalar orasida yangi yozuv qo‘shilsa elementni 2 marta qaytaradi! Cursor esa \`id > cursor\` bo‘yicha \`limit + 1\` o‘qib \`has_more\` va \`next_cursor\` ni aniq beradi!
### 4. Backward-Compatible O‘zgarishlar
Yangi ixtiyoriy maydon qo‘shish — xavfsiz; mavjud maydon nomini/turini o‘zgartirish esa **breaking change** (\`/v2\` talab qiladi!).`,
    theoryEn: `### 1. Plural Resource URIs + HTTP Verbs
Map CRUD cleanly to \`/v1/resources\` and \`/v1/resources/{id}\`; model non-CRUD state transitions as action sub-resources (\`POST /v1/orders/{id}/cancel\`).
### 2. Filtering & Sorting Query Conventions
\`?status=paid&sort=-created_at\`.
### 3. Cursor Pagination (\`limit + 1\` Trick)
Fetch \`limit + 1\` items where \`id > cursor\` to detect \`has_more\` and return \`next_cursor\` without drift on live writes.
### 4. Evolution Without Breaking Clients
Adding optional fields is safe; renaming or removing fields requires a \`/v2\` prefix.`,
    examples: [
      ex('Misol 1: `limit + 1` usulida Cursor Pagination', 'Example 1: Cursor Pagination with limit + 1', `items = [{"id": i, "name": f"Item {i}"} for i in range(1, 8)]\n\ndef get_page(cursor: int = 0, limit: int = 3) -> dict:\n    matched = [x for x in items if x["id"] > cursor][:limit + 1]\n    has_more = len(matched) > limit\n    page_items = matched[:limit]\n    next_cursor = page_items[-1]["id"] if (has_more and page_items) else None\n    return {"data": page_items, "next_cursor": next_cursor}\n\np1 = get_page(0, 3)\np2 = get_page(p1["next_cursor"], 3)\nprint("p1 ids:", [x["id"] for x in p1["data"]], "next:", p1["next_cursor"])\nprint("p2 ids:", [x["id"] for x in p2["data"]], "next:", p2["next_cursor"])`, `p1 ids: [1, 2, 3] next: 3\np2 ids: [4, 5, 6] next: 6`, '`limit + 1` ta olish alohida `SELECT COUNT(*)` qilmasdan `next_cursor` bor-yo‘qligini aniq aniqlaydi.', 'Fetching `limit + 1` items determines `has_more` and `next_cursor` without a separate `COUNT(*)`.'),
      ex('Misol 2: RESTful Endpointlar Jadvali', 'Example 2: RESTful Route Convention', `REST_ROUTES = [\n    ("GET", "/v1/books", "list"),\n    ("POST", "/v1/books", "create"),\n    ("GET", "/v1/books/{id}", "detail"),\n    ("PATCH", "/v1/books/{id}", "update"),\n    ("DELETE", "/v1/books/{id}", "delete"),\n]\nprint(len(REST_ROUTES), REST_ROUTES[3])`, `5 ('PATCH', '/v1/books/{id}', 'update')`, 'Harakat URL matnida emas, HTTP metodida ifodalanadi.', 'HTTP methods express the verb while URIs remain plural nouns.'),
      ex('Misol 3: `sort=-price,name` parseri', 'Example 3: Multi-Field Sort Spec Parser', `def parse_sort(spec: str) -> list[tuple[str, bool]]:\n    return [(f.lstrip("-"), f.startswith("-")) for f in spec.split(",") if f]\n\nprint(parse_sort("-score,name"))`, `[('score', True), ('name', False)]`, 'Minus `-` belgisi kamayish (`DESC`) tartibini ixcham bildiradi.', 'Prefixing `-` cleanly encodes descending sort direction.'),
    ],
    traceTitleUz: 'Cursor pagination `limit + 1` izi',
    traceTitleEn: 'Tracing Cursor Pagination',
    traceCode: `# 7 items total, cursor=3, limit=3 -> slice [4, 5, 6, 7] (len 4 > 3) -> next_cursor=6`,
    traceSteps: [
      traceStep(1, 'filter id > 3', '[4, 5, 6, 7]', 'limit+1 (4 ta) olindi', 'Fetched 4 items'),
      traceStep(2, 'len > 3 -> has_more=True', 'page=[4, 5, 6]', 'Oxirgi ID next_cursor=6', 'Set next_cursor=6', '[4, 5, 6] -> 6'),
    ],
    commonMistakes: [
      mistake('URL manzilida feʼllar yozish (`POST /getUsers`, `GET /deleteBook/5`)', 'Using Verbs in REST Resource URLs', `# RPC-style /getUsers or /createOrder mixes verbs into URLs alongside HTTP methods!`, 'Inconsistent non-RESTful endpoints', `print("Use plural nouns /v1/users + HTTP verbs GET/POST/PATCH/DELETE!")`, 'HTTP metodining o‘zi feʼl vazifasini bajaradi.', 'The HTTP method is already the verb; URIs should name resources.', 'Ko‘plik otlar `/v1/users` yozing.', 'Use plural resource nouns.'),
      mistake('Jonli lentada (`feed`) `OFFSET` ishlatib dublikat/tushib qolgan postlar ko‘rish', 'Using OFFSET Pagination on Rapidly Mutating Feeds', `# Inserting 2 new posts while user reads page 1 shifts OFFSET page 2, duplicating 2 items!`, 'Duplicate items across pages', `print("Use Cursor Pagination (?after_id=last_id&limit=20) on live feeds!")`, 'Yangi qatorlar qo‘shilganda `OFFSET` siljib ketadi.', 'Concurrent inserts shift `OFFSET` boundaries.', 'Cursor pagination (`after_id`) ishlating.', 'Use cursor pagination.'),
    ],
    compareTitleUz: 'Offset Pagination vs Cursor Pagination',
    compareTitleEn: 'Offset vs Cursor Pagination',
    compareUz: ['Offset (`?page=2&limit=20`): admin jadvallarda aniq sahifa raqamiga sakrash kerak bo‘lganda.', 'Cursor (`?cursor=105&limit=20`): katta jadvallar, mobil scroll va jonli ma’lumotlarda tez va dublikatsiz!'],
    compareEn: ['Offset: jumping to arbitrary page numbers in static admin tables.', 'Cursor: drift-free O(log n) infinite feeds and high-scale APIs.'],
    compareSummaryUz: 'REST API da `/v1/nouns`, HTTP metodlari va katta ro‘yxatlar uchun `limit + 1` Cursor Pagination qo‘llang.',
    compareSummaryEn: 'Design `/v1/plural-nouns` routes, keep updates additive, and paginate live feeds with `limit + 1` cursors.',
    practiceTasks: [
      pt('p1309_1', '1-mashq: Cursor Pagination funksiyasi', 'Task 1: Cursor Page', '`[1,2,3,4,5]` dan `cursor=2, limit=2` uchun `[3, 4]` va `next_cursor=4` qaytaring.', 'Implement cursor slice.', `xs = [1, 2, 3, 4, 5]\nm = [x for x in xs if x > 2][:3]\nprint(m[:2], m[1] if len(m) > 2 else None)`, '[3, 4] 4', 'Take limit+1 items', 'Prints [3, 4] 4.'),
      pt('p1309_2', '2-mashq: REST URL dizayni', 'Task 2: Build REST URLs', 'Resurs nomi `"orders"` dan list va detail yo‘llarini tuzing.', 'Format REST paths.', `res = "orders"\nprint(f"/v1/{res}", f"/v1/{res}/{{id}}")`, '/v1/orders /v1/orders/{id}', 'Plural resource + /v1', 'Prints REST URLs.'),
      pt('p1309_3', '3-mashq: Sort parametr parseri', 'Task 3: Parse Sort Spec', '`"-created_at,id"` dan `[("created_at", "DESC"), ("id", "ASC")]` oling.', 'Parse sort directions.', `print([(s.lstrip("-"), "DESC" if s.startswith("-") else "ASC") for s in "-created_at,id".split(",")])`, "[('created_at', 'DESC'), ('id', 'ASC')]", 'Check leading -', 'Prints sort pairs.'),
      pt('p1309_4', '4-mashq: Breaking vs Non-Breaking tekshiruvi', 'Task 4: Schema Compatibility Check', 'Oldingi kalitlar to‘plami yangisida to‘liq saqlanganini tekshiring (`old <= new`).', 'Check backward compatibility.', `old_fields = {"id", "name"}\nnew_fields = {"id", "name", "bio"}\nprint(old_fields <= new_fields)`, 'True', 'Subset check <=', 'Prints True.'),
      pt('p1309_5', '5-mashq: `limit` chegaralash (clamp)', 'Task 5: Clamp Page Size', 'Foydalanuvchi `limit=10000` so‘rasa maksimal `100` ga cheklang.', 'Clamp max limit=100.', `def clamp(lim): return max(1, min(lim, 100))\nprint(clamp(0), clamp(15), clamp(999))`, '1 15 100', 'max(1, min(lim, 100))', 'Prints 1 15 100.'),
    ],
    quiz: [
      q('q1309_1', 'Qaysi URL REST API tamoyillariga eng mos keladi?', 'Which endpoint follows RESTful resource-naming conventions?', ['POST /createNewOrder', 'GET /getOrderById?id=5', 'POST /v1/orders va GET /v1/orders/5', 'GET /orders/delete/5'], ['POST /createNewOrder', 'GET /getOrderById?id=5', 'POST /v1/orders and GET /v1/orders/5', 'GET /orders/delete/5'], 2, 'Ko‘plik otlar + HTTP metodlari.', 'Plural nouns + HTTP verbs.'),
      q('q1309_2', 'Cursor pagination da `limit + 1` ta yozuv o‘qishning sababi nima?', 'Why fetch `limit + 1` rows in Cursor Pagination?', ['Keshlash uchun', 'Alohida `COUNT(*)` so‘rovisiz keyingi sahifa (`has_more`) borligini aniqlash uchun', 'Sortlash uchun', 'Xavfsizlik uchun'], ['Caching', 'Detects `has_more` cleanly without running an expensive `COUNT(*)` query', 'Sorting', 'Security'], 1, 'Alohida `COUNT(*)` siz `has_more` ni aniqlaydi.', 'Checks `has_more` without `COUNT(*)`.'),
      q('q1309_3', 'Mavjud `/v1` API ga buzuvchi o‘zgarish (breaking change) qaysi biri?', 'Which API change is a BREAKING change requiring a new `/v2` version?', ['Ixtiyoriy yangi maydon qo‘shish', 'Mavjud JSON maydon nomini o‘zgartirish yoki o‘chirish', 'Yangi endpoint qo‘shish', 'Documentation yangilash'], ['Adding optional field', 'Renaming or removing an existing JSON response field', 'Adding new endpoint', 'Updating docs'], 1, 'Mavjud maydonni o‘chirish/nomini o‘zgartirish.', 'Renaming/removing existing fields.'),
      q('q1309_4', 'Mijoz `?limit=999999` yuborib server RAM ini to‘ldirmasligi uchun nima qilinadi?', 'How should APIs guard against `?limit=999999` DoS requests?', ['Eʼtiborsiz qoldirish', 'Server tomonda `min(limit, MAX_LIMIT)` bilan chegaralash (clamping)', '500 qaytarish', 'Faylga yozish'], ['Ignore', 'Clamp or reject `limit` to a strict upper bound (e.g. max 100)', 'Return 500', 'Write disk'], 1, 'Maksimal `limit` bilan chegaralash.', 'Clamp to max limit.'),
      q('q1309_5', 'Jonli yangilanib turadigan ijtimoiy tarmoq lentasida nima uchun Cursor `OFFSET` dan ustun?', 'Why does Cursor Pagination beat `OFFSET` on live feeds?', ['Chiroyliroq URL', 'Yangi yozuvlar qo‘shilganda sahifalar siljib dublikat chiqishini va katta `OFFSET` sekinligini yo‘qotadi', 'SQLite ruxsat bermaydi', 'JSON kichrayadi'], ['Prettier URL', 'Avoids page-drift duplicates on new inserts and O(n) large-offset scans', 'SQLite limit', 'Smaller JSON'], 1, 'Dublikat va katta offset sekinligini yo‘qotadi.', 'Prevents drift duplicates and slow scans.'),
    ],
    homework: hw('RESTful Cursor-Paginated Courses API', 'REST v1 Courses Endpoint', 'SQLite jadvali ustida `/v1/courses` (`GET` filter + `sort` + `limit+1` cursor pagination, `POST` create `201`, `PATCH` `200`, `DELETE` `204`) REST mini-dvigatelini yozing.', 'Build a RESTful `/v1/courses` router backed by SQLite implementing filtering, `-field` sorting, `limit+1` cursor pagination, and `201`/`200`/`204`/`404` responses.', ['limit+1 cursor pagination', 'Plural REST routes + HTTPStatus'], ['limit+1 cursor pagination', 'REST nouns + HTTPStatus'], 'Query WHERE id > ? ORDER BY id LIMIT ? with limit + 1.', 'Fast keyset cursor.', 'Schema backward-compatibility tekshiruvini ham qo‘shing.', 'Add schema compatibility test.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-10',
    courseId: 'http_apis',
    moduleId: 'c13_m4',
    order: 10,
    titleUz: 'Authentication va API Keys — Constant-Time Compare va Scopes (+ Review #29)',
    titleEn: 'API Authentication: API Keys, Hashing & Constant-Time Checks (+ Review #29)',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-13-09'],
    conceptId: 'net_auth_apikeys',
    whyUz: "Agar API kalitlarni bazada ochiq matn (plaintext) da saqlasangiz, bitta SQL backup sizib chiqsa hamma mijozlar kalitlari o‘g‘irlanadi! Va agar kalitni oddiy `==` bilan solishtirsangiz, **Timing Attack** orqali baytma-bayt topib olish mumkin. Professional tizimlar **Prefix + SHA-256 hash** va **`hmac.compare_digest()`** dan foydalanadi!",
    whyEn: 'Distinguish Authentication (401) from Authorization (403), store API keys hashed with SHA-256 + visible prefix, and verify credentials using constant-time `hmac.compare_digest`.',
    analogyUz: "**Plaintext API Key bazada** — mehmonxonadagi hamma xonalar kalitlarining dublikatini devorga ilib qo‘yish. **Hashed API Key** — devorda faqat qulf barmoq izi (SHA-256) turadi, haqiqiy kalit (`sk_live_...`) esa yaratilganda mijozga atigi **1 marta** ko‘rsatiladi!",
    analogyEn: 'Store only the cryptographic digest of an API key—never the raw key—after showing the generated token to the user once at creation.',
    stopsUz: "1) **Authentication** = *Siz kimsiz?* (`401`); **Authorization** = *Bu amalni bajarishga ruxsatingiz bormi?* (`403`, Scopes/RBAC). 2) API kalitlarni `==` emas, har doim **`hmac.compare_digest(a, b)`** bilan tekshiring (timing attack himoyasi!). 3) Kalitni yaratishda `secrets.token_urlsafe(32)` ishlating (`random` EMAS!).",
    stopsEn: 'Generate tokens with `secrets.token_urlsafe()` (never `random`), store only `hashlib.sha256` digests in the database, and compare hashes/tokens using `hmac.compare_digest()`.',
    objUz: ['Authentication (`401`) vs Authorization (`403` + Scopes) ni ajratish', '`secrets` bilan API key yaratish va bazada faqat SHA-256 hash saqlash', '`hmac.compare_digest` va `Authorization: Bearer ...` / `X-API-Key` sarlavhalarini qo‘llash'],
    objEn: ['Separate Authentication (`401`) from Scope Authorization (`403`)', 'Generate tokens via `secrets` and store only SHA-256 hashes', 'Verify tokens in constant time with `hmac.compare_digest`'],
    theoryUz: `### 1. AuthN vs AuthZ
- **Authentication (AuthN)**: shaxsni tasdiqlash (API Key / JWT / Cookie). Yo‘q/xato bo‘lsa -> **\`401\`**.
- **Authorization (AuthZ)**: huquqlarni (\`scopes: ["read:orders", "write:orders"]\`) tekshirish. Yetarli bo‘lmasa -> **\`403\`**.
### 2. Xavfsiz API Kalit Hayot Sikli
1. Yaratish: \`raw = "sk_live_" + secrets.token_urlsafe(24)\` (foydalanuvchiga 1 marta ko‘rsatiladi).
2. Bazada saqlash: \`prefix = raw[:12]\` (UI da ko‘rsatish uchun) + \`key_hash = hashlib.sha256(raw.encode()).hexdigest()\`.
### 3. \`hmac.compare_digest(a, b)\`
Oddiy \`==\` birinchi farqli baytdayoq to‘xtaydi (Timing Attack); \`compare_digest\` har doim bir xil vaqt oladi!
### 4. Key Rotation & Expiration
Kalitga \`expires_at\` va \`revoked_at\` qo‘yib, nol-uzilishsiz almashtirish (rotation) qilinadi.`,
    theoryEn: `### 1. AuthN (\`401\`) vs AuthZ (\`403\`)
AuthN verifies identity; AuthZ verifies scopes/permissions.
### 2. Secure Key Lifecycle
Generate via \`secrets.token_urlsafe()\`, return plaintext once, and store \`(prefix, sha256_hash, scopes)\` in the DB.
### 3. Constant-Time Verification
Use \`hmac.compare_digest()\` instead of \`==\` to block timing side-channel leaks.
### 4. Scopes & Rotation
Principle of Least Privilege: grant minimal scopes (\`read:items\`) and support key revocation/rotation.`,
    examples: [
      ex('Misol 1: `secrets` + SHA-256 + `hmac.compare_digest` bilan API Key Xizmati', 'Example 1: Hashed API Key Store & Scope Check', `import hashlib, hmac, secrets\n\ndef hash_key(raw: str) -> str:\n    return hashlib.sha256(raw.encode("utf-8")).hexdigest()\n\nraw_key = "sk_test_" + secrets.token_urlsafe(16)\ndb_keys = {\n    hash_key(raw_key): {"owner": "svc_billing", "scopes": {"read:orders"}}\n}\n\ndef authorize(token: str | None, needed_scope: str) -> tuple[int, str]:\n    if not token:\n        return 401, "Missing token"\n    cand_hash = hash_key(token)\n    for stored_hash, meta in db_keys.items():\n        if hmac.compare_digest(cand_hash, stored_hash):\n            if needed_scope not in meta["scopes"]:\n                return 403, "Insufficient scope"\n            return 200, meta["owner"]\n    return 401, "Invalid token"\n\nprint(authorize(None, "read:orders"))\nprint(authorize("sk_wrong", "read:orders"))\nprint(authorize(raw_key, "write:orders"))\nprint(authorize(raw_key, "read:orders"))`, `(401, 'Missing token')\n(401, 'Invalid token')\n(403, 'Insufficient scope')\n(200, 'svc_billing')`, 'Bazada xom kalit emas, faqat SHA-256 xeshi saqlandi; tekshiruv esa `hmac.compare_digest` bilan o‘tdi.', 'Stores only SHA-256 hashes, verifies in constant time, and separates `401` vs `403` cleanly.'),
      ex('Misol 2: `Authorization: Bearer <token>` sarlavhasini ajratish', 'Example 2: Extracting Bearer Token Safely', `def extract_bearer(auth_header: str | None) -> str | None:\n    if not auth_header:\n        return None\n    parts = auth_header.split(None, 1)\n    if len(parts) == 2 and parts[0].lower() == "bearer":\n        return parts[1].strip()\n    return None\n\nprint(extract_bearer("Bearer tok_123"), extract_bearer("Basic abc"))`, `tok_123 None`, 'Faqat `Bearer` sxemasini qabul qilib tokenni toza ajratib oladi.', 'Parses `Bearer <token>` case-insensitively and rejects other schemes.'),
      ex('Misol 3: `len(secrets.token_urlsafe(24))` kriptografik tasodifiylik', 'Example 3: Cryptographic Token Entropy', `import secrets\nt1, t2 = secrets.token_urlsafe(24), secrets.token_urlsafe(24)\nprint("unique?", t1 != t2, "| len >= 32?", len(t1) >= 32)`, `unique? True | len >= 32? True`, '`secrets` CSPRNG (kriptografik xavfsiz tasodifiy generator) dan foydalanadi.', '`secrets` provides cryptographically strong random tokens.'),
    ],
    traceTitleUz: 'API Key AuthN -> AuthZ izi',
    traceTitleEn: 'Tracing AuthN & Scope Check',
    traceCode: `authorize(raw_key, "write:orders")`,
    traceSteps: [
      traceStep(1, 'sha256(raw_key)', 'cand_hash', 'Kirish kaliti xeshlandi', 'Hashed candidate token'),
      traceStep(2, 'hmac.compare_digest', 'True (svc_billing)', 'AuthN muvaffaqiyatli o‘tdi', 'Authenticated via constant-time compare'),
      traceStep(3, '"write:orders" in scopes', 'False -> 403', 'Huquq yetarli emas -> 403', 'Rejected with 403 Forbidden'),
    ],
    commonMistakes: [
      mistake('Token yaratishda `secrets` o‘rniga `random` modulini ishlatish', 'Generating API Keys with random Instead of secrets', `# random.randint / random.choice uses Mersenne Twister which is predictable!`, 'Predictable guessable tokens', `import secrets\nprint("Generated safe prefix:", secrets.token_hex(4)[:0] + "uses secrets!")`, '`random` moduli statistik/simulyatsiyalar uchun — xavfsizlik tokenlarini taxmin qilib olish mumkin.', 'Standard `random` is not cryptographically secure.', 'Token/parol reset kodlarida doim `secrets` ishlating.', 'Always use the `secrets` module.'),
      mistake('Bazada API kalitlarini ochiq matnda (`raw_key`) saqlash', 'Storing Plaintext API Keys in the Database', `# Storing raw API keys means any DB read leak compromises every client account!`, 'Mass credential compromise', `print("Hash API keys with SHA-256 and display raw key once upon creation!")`, 'Parollar va yuqori entropiyali API kalitlar bazada xeshlangan holda turishi kerak.', 'Database dumps should never reveal usable plaintext API keys.', 'Bazada `hashlib.sha256` xeshini saqlang.', 'Store SHA-256 digests only.'),
    ],
    compareTitleUz: 'API Keys vs User Sessions/JWT',
    compareTitleEn: 'API Keys vs User Sessions/JWT',
    compareUz: ['API Keys: server-to-server (M2M), CLI, skriptlar va uchinchi tomon integratsiyalari uchun.', 'JWT / Sessions: brauzer/mobil ilova foydalanuvchilarining login sessiyalari uchun.'],
    compareEn: ['API Keys: machine-to-machine services, webhooks, CLI clients.', 'JWT / Sessions: end-user login flows with short-lived access + refresh tokens.'],
    compareSummaryUz: 'API kalitlarni `secrets` bilan yarating, SHA-256 xeshda saqlang, `hmac.compare_digest` bilan tekshiring va `401` vs `403` ni ajrating.',
    compareSummaryEn: 'Generate API keys with `secrets`, store SHA-256 hashes, verify via `hmac.compare_digest`, and enforce least-privilege scopes (`403`).',
    practiceTasks: [
      pt('p1310_1', '1-mashq: `hmac.compare_digest`', 'Task 1: Constant-Time Verify', '`hmac.compare_digest("abc", "abc")` va `"abc", "abd"` ni chiqaring.', 'Verify constant-time compare.', `import hmac\nprint(hmac.compare_digest("abc", "abc"), hmac.compare_digest("abc", "abd"))`, 'True False', 'hmac.compare_digest', 'Prints True False.'),
      pt('p1310_2', '2-mashq: Bearer Token ajratish', 'Task 2: Extract Bearer', '`"Bearer my_tok"` dan `"my_tok"` ni ajrating.', 'Extract bearer token.', `hdr = "Bearer my_tok"\nprint(hdr.split()[1] if hdr.lower().startswith("bearer ") else None)`, 'my_tok', 'Split after Bearer', 'Prints my_tok.'),
      pt('p1310_3', '3-mashq: SHA-256 xesh uzunligi', 'Task 3: Hash API Key', '`hashlib.sha256(b"sk_123").hexdigest()` uzunligi 64 ekanini tekshiring.', 'Check SHA-256 hex length.', `import hashlib\nprint(len(hashlib.sha256(b"sk_123").hexdigest()))`, '64', 'sha256(...).hexdigest()', 'Prints 64.'),
      pt('p1310_4', '4-mashq: Scope ruxsat tekshiruvi', 'Task 4: Scope Guard', 'Mijozda `{"read:books"}` bo‘lsa `"write:books"` uchun `403` qaytaring.', 'Enforce scope -> 403.', `def authz(scopes, req): return 200 if req in scopes else 403\nprint(authz({"read:books"}, "read:books"), authz({"read:books"}, "write:books"))`, '200 403', 'req in scopes', 'Prints 200 403.'),
      pt('p1310_5', '5-mashq: `secrets.token_urlsafe` unikaligi', 'Task 5: Unique Secrets Tokens', 'Ikki marta chaqirilgan `secrets.token_urlsafe(16)` teng emasligini chiqaring.', 'Generate distinct tokens.', `import secrets\nprint(secrets.token_urlsafe(16) != secrets.token_urlsafe(16))`, 'True', 'secrets.token_urlsafe', 'Prints True.'),
    ],
    quiz: [
      q('q1310_1', 'API kalit yoki reset token yaratishda `random` o‘rniga qaysi standart modul ishlatilishi SHART?', 'Standard library module required for generating secure API keys and tokens?', ['random', 'secrets', 'math', 'uuid1'], ['random', 'secrets', 'math', 'uuid1'], 1, '`secrets` moduli.', '`secrets`.'),
      q('q1310_2', 'Token yoki HMAC imzolarini tekshirishda `==` o‘rniga nima uchun `hmac.compare_digest()` ishlatiladi?', 'Why use `hmac.compare_digest()` instead of `==` when checking secrets?', ['Qisqaroq', 'Timing Attack (vaqt farqi orqali baytma-bayt taxmin qilish) ning oldini oladi', 'Case-insensitive', 'Tezroq'], ['Shorter', 'Prevents timing side-channel attacks by running in constant time', 'Case-insensitive', 'Faster'], 1, 'Timing side-channel hujumini to‘xtatadi.', 'Constant-time defense against timing attacks.'),
      q('q1310_3', 'Bazada API kaliti qanday saqlanishi kerak?', 'How should API keys be stored in your database?', ['Ochiq matnda', 'Faqat bir marta ko‘rsatilib, bazada kriptografik xeshi (`SHA-256`) saqlanadi', 'Base64 da', 'Query string da'], ['Plaintext', 'Shown once on creation, stored strictly as a SHA-256 digest', 'Base64', 'URL query'], 1, 'Faqat xeshlangan holda.', 'Hashed digest only.'),
      q('q1310_4', 'To‘g‘ri API kaliti kiritilgan, lekin `write:billing` scope i yo‘q bo‘lsa qaysi status qaytariladi?', 'Status code when a valid API key lacks the required `write:billing` scope?', ['401', '403 Forbidden', '404', '422'], ['401', '403 Forbidden', '404', '422'], 1, '`403 Forbidden`.', '`403 Forbidden`.'),
      q('q1310_5', 'Foydalanuvchi parollari (past entropiya) va tasodifiy 256-bit API kalitlari xeshlashdagi farq?', 'Difference between hashing user passwords vs 256-bit random API keys?', ['Farqi yo‘q', 'Parollar uchun sekin KDF (`scrypt`/`Argon2`/`bcrypt`), 256-bit random kalitlar uchun esa `SHA-256` yetarli', 'Ikkalasiga MD5', 'Base64 yetarli'], ['None', 'User passwords need slow salted KDF (`scrypt`/`Argon2`); high-entropy random API keys can use `SHA-256`', 'MD5', 'Base64'], 1, 'Parollar uchun sekin KDF, 256-bit random kalitlar uchun `SHA-256`.', 'Slow KDF for passwords; SHA-256 for high-entropy keys.'),
    ],
    homework: hw('API Key Management Service', 'Hashed API Key Vault', 'SQLite da `api_keys(id, prefix, key_hash UNIQUE, scopes, revoked_at)` jadvalini tuzib, `create_key(scopes)`, `verify_key(raw_key, required_scope)` (`hmac.compare_digest` bilan!) va `revoke_key(prefix)` funksiyalarini yozing.', 'Build a SQLite-backed API Key service storing `prefix` and `sha256` hashes, verifying scopes via `hmac.compare_digest` (`401`/`403`/`200`), and supporting key revocation.', ['Hech qayerda raw_key bazaga yozilmasin', '401, 403, revoked va 200 testlari'], ['Never store raw key in DB', 'Test 401, 403, revoked, and 200'], 'Store hashlib.sha256(raw.encode()).hexdigest().', 'Constant-time verify.', 'Key rotation (eski kalitni 24 soatdan keyin o‘chirish) funksiyasini qo‘shing.', 'Add key rotation.', 25),
    reviewCheckpoint: review(
      29,
      'Review Loyiha #29: JSON Guard + Resilient Retry + Hashed API Key Auth (145-dars Marrasi!)',
      'Review Project #29: Secure JSON Gateway with Hashed Auth (145th Lesson!)',
      '145-dars marrasi! `Content-Type` (`415`), `JSONDecodeError` (`400`), `secrets` + SHA-256 + `hmac.compare_digest` AuthN/AuthZ (`401`/`403`) va `limit+1` cursor paginationni bitta API Gateway da birlashtiring.',
      '145-lesson milestone! Combine strict JSON validation (`415`/`400`), constant-time SHA-256 API key auth (`401`/`403`), and cursor pagination in one gateway handler.',
      ['`hmac.compare_digest` + Scope tekshiruvi', '`Content-Type: application/json` va `JSONDecodeError` himoyasi', 'RFC 9457 error envelope va `200` javobi'],
      ['Constant-time hashed key auth', 'Strict JSON & media-type guard', 'Unified RFC 9457 error format'],
      `import hashlib, hmac, json, secrets

raw = "sk_live_" + secrets.token_urlsafe(12)
vault = {hashlib.sha256(raw.encode()).hexdigest(): {"read"}}

def gateway(headers: dict, body: str) -> tuple[int, dict]:
    h = {k.lower(): v for k, v in headers.items()}
    tok = h.get("authorization", "").removeprefix("Bearer ").strip()
    if not tok:
        return 401, {"title": "Unauthorized", "status": 401}
    cand = hashlib.sha256(tok.encode()).hexdigest()
    scopes = next((sc for k_h, sc in vault.items() if hmac.compare_digest(cand, k_h)), None)
    if scopes is None:
        return 401, {"title": "Invalid Key", "status": 401}
    if "read" not in scopes:
        return 403, {"title": "Forbidden", "status": 403}
    if "application/json" not in h.get("content-type", ""):
        return 415, {"title": "Unsupported Media Type", "status": 415}
    try:
        return 200, {"ok": True, "payload": json.loads(body)}
    except json.JSONDecodeError:
        return 400, {"title": "Bad JSON", "status": 400}

print(gateway({"Authorization": f"Bearer {raw}", "Content-Type": "application/json"}, '{"page": 1}'))
print(gateway({"Authorization": "Bearer wrong", "Content-Type": "application/json"}, "{}"))
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-11',
    courseId: 'http_apis',
    moduleId: 'c13_m4',
    order: 11,
    titleUz: 'JWT (JSON Web Tokens) va OAuth 2.0 Asoslari',
    titleEn: 'JWT Internals (Header.Payload.Signature) & OAuth 2.0 Flows',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-13-10'],
    conceptId: 'net_jwt_oauth',
    whyUz: "Har bir so‘rovda bazadan sessiya tekshirmasdan foydalanuvchini tanish uchun **JWT (JSON Web Token)**, Google/GitHub orqali kirish (\"Sign in with Google\") uchun esa **OAuth 2.0** ishlatiladi! Lekin eng katta xato: odamlar JWT ni \"shifrlangan\" deb o‘ylab, ichiga maxfiy parol yozib qo‘yadi!",
    whyEn: 'Build and verify HS256 JWT tokens from scratch using `base64.urlsafe_b64encode` and `hmac`, enforce `exp`/`alg` checks against `alg=none` attacks, and trace OAuth 2.0 Authorization Code + PKCE.',
    analogyUz: "**JWT** — bu muhrlangan, lekin **shaffof plastik konvertdagi** ruxsatnoma: konvert ichidagi ma’lumot (`Payload`: `user_id`, `role`, `exp`) ni hamma Base64 dan o‘qiy oladi (**imzolanmagan emas, shifrlanmagan!**), lekin qalbaki o‘zgartirilsa oxiridagi **HMAC/RSA muhr (Signature)** darhol fosh qiladi!",
    analogyEn: 'A JWT is a signed transparent pass—anyone can base64-decode the Header and Payload, so never put secrets inside, while the Signature proves nobody tampered with it.',
    stopsUz: "JWT da 3 hayotiy xavfsizlik qoidasi: 1) JWT **SIGNED (imzolangan), NOT ENCRYPTED (shifrlanmagan)** — payload ichiga parol yoki karta raqami qo‘ymang! 2) Tekshiruvda doim ruxsat etilgan algoritmni (**`algorithms=[\"HS256\"]`**) qatʼiy belgilang — `alg: none` hujumidan himoyalanasiz! 3) **`exp` (muddati)** ni majburiy tekshiring va muddatni qisqa (15 daqiqa + Refresh Token) saqlang!",
    stopsEn: 'JWT payloads are Base64URL-encoded, NOT encrypted—never store secrets inside claims. Always pin allowed verification algorithms (blocking `alg: "none"`) and strictly check `exp` expiration.',
    objUz: ['JWT ning 3 qismi (`header.payload.signature`) ni Python `base64` + `hmac` bilan noldan yasash va tekshirish', '`alg=none` hujumi, `exp` muddati va payload ochiq o‘qilishi xavfini bilish', 'OAuth 2.0 Authorization Code + PKCE oqimi va `state` (CSRF himoyasi) vazifasini tushunish'],
    objEn: ['Encode and verify `HS256` JWTs using stdlib `base64` + `hmac`', 'Prevent `alg: none` bypasses, enforce `exp`, and keep secrets out of claims', 'Trace OAuth 2.0 Authorization Code + PKCE and `state` CSRF verification'],
    theoryUz: `### 1. JWT Tuzilishi (\`header.payload.signature\`)
1. **Header**: \`{"alg": "HS256", "typ": "JWT"}\` -> Base64URL.
2. **Payload (Claims)**: \`{"sub": "u42", "role": "student", "exp": 1790000000}\` -> Base64URL (**har kim dekodlay oladi!**).
3. **Signature**: \`HMAC_SHA256(secret, header_b64 + "." + payload_b64)\`.
### 2. JWT Xavfsizligi
- Payload ga maxfiy ma’lumot yozmang.
- \`alg\` ni qatʼiy \`"HS256"\` ga tekshiring (\`alg: "none"\` hujumi tarixda mashhur zaiflik bo‘lgan!).
- \`hmac.compare_digest()\` bilan imzoni tekshiring va \`now >= exp\` ni rad eting.
### 3. OAuth 2.0 Authorization Code + PKCE
Foydalanuvchi parolini tashqi ilovaga bermaydi: Brauzer -> Provider login -> \`code\` + \`state\` qaytadi -> Backend (yoki PKCE verifier) \`code\` ni **Access Token** ga almashtiradi! (\`state\` CSRF hujumini to‘xtatadi).`,
    theoryEn: `### 1. JWT Anatomy (\`header.payload.signature\`)
Base64URL-encoded Header and Payload joined by \`.\`, signed with HMAC-SHA256 or RSA/ECDSA.
### 2. Critical JWT Defenses
Treat claims as readable plaintext, enforce an explicit algorithm allowlist (rejecting \`alg: "none"\`), verify signatures in constant time, and enforce short \`exp\` TTLs.
### 3. OAuth 2.0 Authorization Code + PKCE
Delegates login safely without sharing passwords; uses \`state\` for CSRF protection and PKCE \`code_verifier\` to prevent code interception.`,
    examples: [
      ex('Misol 1: Pure Stdlib HS256 JWT Yaratish va Tekshirish', 'Example 1: Build & Verify HS256 JWT with Stdlib', `import base64, hashlib, hmac, json\n\ndef b64u_enc(data: bytes) -> str:\n    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()\n\ndef b64u_dec(text: str) -> bytes:\n    pad = "=" * (-len(text) % 4)\n    return base64.urlsafe_b64decode(text + pad)\n\ndef sign_jwt(payload: dict, secret: bytes) -> str:\n    h = b64u_enc(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())\n    p = b64u_enc(json.dumps(payload, separators=(",", ":")).encode())\n    msg = f"{h}.{p}".encode()\n    sig = b64u_enc(hmac.new(secret, msg, hashlib.sha256).digest())\n    return f"{h}.{p}.{sig}"\n\ndef verify_jwt(token: str, secret: bytes, now: int) -> dict:\n    h_b64, p_b64, s_b64 = token.split(".")\n    hdr = json.loads(b64u_dec(h_b64))\n    if hdr.get("alg") != "HS256":\n        raise ValueError("Disallowed alg")\n    expected_sig = b64u_enc(hmac.new(secret, f"{h_b64}.{p_b64}".encode(), hashlib.sha256).digest())\n    if not hmac.compare_digest(s_b64, expected_sig):\n        raise ValueError("Bad signature")\n    claims = json.loads(b64u_dec(p_b64))\n    if now >= claims["exp"]:\n        raise ValueError("Token expired")\n    return claims\n\nSECRET = b"super_secret_32_bytes_key"\ntok = sign_jwt({"sub": "42", "exp": 2000}, SECRET)\nprint("Verified claims:", verify_jwt(tok, SECRET, now=1500))`, `Verified claims: {'sub': '42', 'exp': 2000}`, 'Uch qismli JWT token HMAC-SHA256 imzosi, `alg == "HS256"` va `exp` bilan xavfsiz tekshirildi.', 'Verifies algorithm allowlist, constant-time HMAC signature, and `exp` timestamp.'),
      ex('Misol 2: Payload ochiq o‘qilishi + Tamperingni fosh qilish', 'Example 2: Payload Readability & Tamper Rejection', `import base64, hashlib, hmac, json\n\ndef b64u_enc(data: bytes) -> str:\n    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()\n\ndef verify_sig(token: str, secret: bytes) -> None:\n    h, p, s = token.split(".")\n    exp_s = b64u_enc(hmac.new(secret, f"{h}.{p}".encode(), hashlib.sha256).digest())\n    if not hmac.compare_digest(s, exp_s):\n        raise ValueError("Bad signature")\n\nSECRET = b"super_secret_32_bytes_key"\nh = b64u_enc(json.dumps({"alg": "HS256"}).encode())\np = b64u_enc(json.dumps({"sub": "42", "exp": 2000}).encode())\nsig = b64u_enc(hmac.new(SECRET, f"{h}.{p}".encode(), hashlib.sha256).digest())\ntampered_payload = b64u_enc(json.dumps({"sub": "42", "role": "admin", "exp": 2000}).encode())\nforged = f"{h}.{tampered_payload}.{sig}"\ntry:\n    verify_sig(forged, SECRET)\nexcept ValueError as e:\n    print("Tampering caught:", e)`, `Tampering caught: Bad signature`, 'Payload ichidagi `"role": "admin"` ni o‘zgartirish bilan imzo mos kelmay darhol fosh bo‘ldi!', 'Modifying a single claim breaks the HMAC signature immediately.'),
      ex('Misol 3: OAuth 2.0 PKCE (`code_challenge = sha256(verifier)`)', 'Example 3: OAuth 2.0 PKCE Challenge', `import base64, hashlib, secrets\n\nverifier = secrets.token_urlsafe(32)\nchallenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()\nprint("PKCE challenge verified?", base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode() == challenge)`, `PKCE challenge verified? True`, 'PKCE authorization code o‘g‘irlansa ham `code_verifier` siz uni token ga almashtirib bo‘lmasligini kafolatlaydi.', 'PKCE binds the authorization code to a client-held `code_verifier`.'),
    ],
    traceTitleUz: 'JWT verification izi',
    traceTitleEn: 'Tracing JWT Verification Order',
    traceCode: `verify_jwt(tok, SECRET, now=1500)`,
    traceSteps: [
      traceStep(1, 'Check header["alg"]', 'alg == "HS256"', 'alg=none hujumi bloklandi', 'Verified pinned algorithm'),
      traceStep(2, 'hmac.compare_digest', 'sig matches', 'Imzo tasdiqlandi', 'Signature matched'),
      traceStep(3, 'now < claims["exp"]', '1500 < 2000', 'Muddat yaroqli -> claims qaytdi', 'Not expired -> accepted'),
    ],
    commonMistakes: [
      mistake('JWT payload ichiga parol yoki shaxsiy sir yozish', 'Storing Secrets Inside JWT Claims', `# Base64URL is encoding, NOT encryption — anyone with the token can decode the middle part!`, 'Exposes sensitive data to clients/logs', `print("Keep JWT claims minimal (sub, role, exp) — NEVER passwords or API secrets!")`, 'Base64 shifrlash emas, oddiy kodlashdir.', 'Base64URL is trivially reversible by anyone holding the token.', 'JWT da faqat `sub`, `role`, `exp` saqlang.', 'Store only non-secret claims.'),
      mistake('`alg` sarlavhasini tekshirmaslik (`alg: "none"` zaifligi)', 'Trusting Unpinned Token Header Algorithm', `# Attackers set {"alg": "none"} and strip the signature if server trusts header["alg"] blindly!`, 'Complete authentication bypass', `print("Always pin allowed algorithms explicitly (e.g., alg == 'HS256')!")`, 'Server token ichidagi `alg` ga ko‘r-ko‘rona ishonmasligi shart.', 'Never let the incoming token header choose `"none"` verification.', 'Ruxsat etilgan algoritmni serverda qatʼiy belgilang.', 'Pin allowed algorithms server-side.'),
    ],
    compareTitleUz: 'Opaque Server Session (Redis) vs JWT',
    compareTitleEn: 'Server Session vs Stateless JWT',
    compareUz: ['Server Session + Cookie: darhol bekor qilish (revoke/logout) oson, brauzer ilovalar uchun juda xavfsiz.', 'JWT: servislararo stateless tekshiruv (`sub`, `exp`) uchun qulay (lekin qisqa `exp` + Refresh Token shart!).'],
    compareEn: ['Server Session: instant revocation on logout/breach.', 'JWT: stateless verification across microservices (use short `exp` + refresh rotation).'],
    compareSummaryUz: 'JWT shifrlangan emas, imzolangandir; doim `alg` ni pin qiling, `exp` ni tekshiring va OAuth 2.0 da `state` + PKCE qo‘llang.',
    compareSummaryEn: 'Remember JWTs are signed (not encrypted): pin algorithms, check `exp`, verify signatures in constant time, and use `state` + PKCE in OAuth 2.0.',
    practiceTasks: [
      pt('p1311_1', '1-mashq: Base64URL encode/decode', 'Task 1: Base64URL Round-Trip', '`b"hello"` ni Base64URL (`rstrip(b"=")`) qilib qaytadan dekodlang.', 'Encode and decode Base64URL.', `import base64\ne = base64.urlsafe_b64encode(b"hello").rstrip(b"=").decode()\npad = "=" * (-len(e) % 4)\nprint(e, base64.urlsafe_b64decode(e + pad).decode())`, 'aGVsbG8 hello', 'Pad to multiple of 4', 'Prints aGVsbG8 hello.'),
      pt('p1311_2', '2-mashq: JWT qismlarini ajratish', 'Task 2: Split 3 JWT Segments', '`"a.b.c"` tokeni 3 ta qismdan iboratligini tekshiring.', 'Verify 3 dot segments.', `parts = "hdr.pay.sig".split(".")\nprint(len(parts) == 3, parts[1])`, 'True pay', 'split(".") length 3', 'Prints True pay.'),
      pt('p1311_3', '3-mashq: `alg == "none"` ni bloklash', 'Task 3: Reject alg=none', '`{"alg": "none"}` headerda `ValueError` ko‘taring.', 'Reject non-HS256 alg.', `def chk(h):\n    if h.get("alg") != "HS256": raise ValueError("bad alg")\ntry:\n    chk({"alg": "none"})\nexcept ValueError as e:\n    print(e)`, 'bad alg', 'Check h.get("alg") == "HS256"', 'Prints bad alg.'),
      pt('p1311_4', '4-mashq: `exp` muddat tekshiruvi', 'Task 4: Check Token Expiry', '`exp = 1000` va `now = 1005` da token eskirganini aniqlang.', 'Reject expired token.', `def expired(exp, now): return now >= exp\nprint(expired(1000, 999), expired(1000, 1005))`, 'False True', 'now >= exp', 'Prints False True.'),
      pt('p1311_5', '5-mashq: OAuth `state` CSRF tekshiruvi', 'Task 5: Verify OAuth State', '`expected_state` va callback `state` ni `hmac.compare_digest` bilan solishtiring.', 'Verify OAuth state.', `import hmac\nprint(hmac.compare_digest("st_99", "st_99"), hmac.compare_digest("st_99", "evil"))`, 'True False', 'hmac.compare_digest', 'Prints True False.'),
    ],
    quiz: [
      q('q1311_1', 'JWT tokenning o‘rta qismi (`Payload`) shifrlangan bo‘ladimi?', 'Is the Payload section of a standard signed JWT encrypted?', ['Ha, AES bilan', 'Yo‘q, u shunchaki Base64URL bilan kodlangan — tokenni olgan har kim o‘qiy oladi', 'Ha, SHA-256 bilan', 'Faqat HS256 da'], ['Yes AES', 'No, it is only Base64URL-encoded and readable by anyone holding the token', 'Yes SHA-256', 'HS256 only'], 1, 'Yo‘q, faqat Base64URL kodlangan!', 'No, merely Base64URL-encoded.'),
      q('q1311_2', 'JWT tekshiruvchisida ruxsat etilgan algoritmni (`HS256`) qatʼiy ko‘rsatmaslik qaysi hujumga ochiq?', 'Vulnerability if a JWT verifier blindly accepts `header["alg"]`?', ['SQL Injection', '`alg: "none"` (imzosiz qalbaki token qabul qilish)', 'XSS', 'ReDoS'], ['SQLi', '`alg: "none"` signature-bypass attack', 'XSS', 'ReDoS'], 1, '`alg: "none"` hujumiga.', '`alg: "none"` signature bypass.'),
      q('q1311_3', 'JWT ning uchta nuqta (`.`) bilan ajratilgan qismlari tartibi?', 'Correct order of the three dot-separated parts of a JWT?', ['Payload.Header.Sig', 'Header.Payload.Signature', 'Signature.Header.Payload', 'User.Exp.Secret'], ['Payload.Header.Sig', 'Header.Payload.Signature', 'Signature.Header.Payload', 'User.Exp.Secret'], 1, '`Header.Payload.Signature`.', '`Header.Payload.Signature`.'),
      q('q1311_4', 'OAuth 2.0 redirect jarayonida `state` parametri nima uchun ishlatiladi?', 'Purpose of the `state` parameter in OAuth 2.0 authorization redirects?', ['Tezlatish', 'CSRF (Cross-Site Request Forgery) hujumidan himoyalanish', 'Shifrlash', 'Caching'], ['Speed', 'Protects callback flow against CSRF attacks', 'Encryption', 'Caching'], 1, 'CSRF himoyasi.', 'CSRF protection.'),
      q('q1311_5', 'Nima uchun JWT `exp` muddati qisqa (masalan 15 daqiqa) qilinadi?', 'Why keep JWT access token `exp` lifetimes short?', ['Xotira tejash', 'Stateless JWT ni bekor qilish qiyin bo‘lgani uchun o‘g‘irlangan token tez eskirishi kerak', 'Base64 limiti', 'HTTPS talabi'], ['RAM', 'Stateless JWTs are hard to revoke immediately, so short TTLs limit theft exposure', 'Base64 limit', 'HTTPS'], 1, 'Stateless JWT ni darhol bekor qilish qiyinligi sababli.', 'Limits window if stolen.'),
    ],
    homework: hw('Mini JWT Auth & Refresh Token Tizimi', 'JWT Issuer & Verifier Service', 'Stdlib `base64`, `hmac`, `hashlib`, `secrets` bilan `issue_tokens(user_id, secret)` (qisqa access JWT + refresh token) va `verify_access_token(token, secret, now)` (alg pin, imzo, `exp`, `nbf` tekshiruvlari) ni yozing.', 'Implement a complete HS256 JWT issuer and verifier supporting `sub`, `role`, `exp`, pinned `alg`, tampered signature rejection, and expired token handling.', ['Base64URL + HMAC-SHA256', 'alg=none, tampered, expired testlari'], ['Pure stdlib HS256', 'Test alg=none, tampered, expired'], 'Check header["alg"] == "HS256" and hmac.compare_digest() before trusting claims.', 'Strict JWT validation.', 'Kurs 13 yakuniy darsiga tayyorlaning.', 'Prepare for Lesson 12 capstone.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-12',
    courseId: 'http_apis',
    moduleId: 'c13_m4',
    order: 12,
    titleUz: 'API Yaratish va Undan Foydalanish (End-to-End Router + Client + Webhook)',
    titleEn: 'End-to-End HTTP APIs: Routing, Webhooks & Client Integration',
    difficulty: 'advanced',
    estimatedMinutes: 40,
    prerequisites: ['PY-13-11'],
    conceptId: 'net_api_capstone',
    whyUz: "Kurs 13 ning barcha bo‘laklari — HTTP Method/Status, JSON Envelope, Cursor Pagination, Rate Limiting, HMAC Webhook imzosi va Retry-qiluvchi Client — endi **bitta yaxlit End-to-End API + Client tizimiga** birlashadi! Bu sizni 14-kursdagi Flask, Django va FastAPI frameworklariga 100% tayyorlaydi.",
    whyEn: 'Integrate routing, JSON schema validation, HS256 auth, token-bucket rate limiting (`429`), HMAC webhook signing, and a retrying HTTP client in one end-to-end capstone.',
    analogyUz: "Framework (`FastAPI` / `Flask`) ishlatishdan oldin qo‘lda bitta mini-router va klientni yig‘ib ko‘rish — avtomat uzatmali mashinani haydashdan oldin dvigatel qanday ishlashini bilishdek gap: ichidagi har bir xatoni ko‘zingiz bilan ko‘rasiz!",
    analogyEn: 'Wiring routing, auth, rate limiting, and webhook signing manually once makes FastAPI and Django frameworks transparent rather than magic.',
    stopsUz: "Webhook qabul qilayotganda 2 oltin qoida: 1) Imzoni (**`X-Signature`**) parsingdan oldingi **xom baytlar (`raw_body`)** ustida `hmac.compare_digest` bilan tekshiring (`json.dumps(parsed)` tartibi o‘zgarib ketishi mumkin!). 2) Rate-limiting (`429`) javobida `Retry-After` sarlavhasini bering.",
    stopsEn: 'Always verify webhook HMAC signatures against the exact raw request bytes before JSON parsing (re-serializing JSON alters whitespace/key order). Include `Retry-After` headers on `429` responses.',
    objUz: ['Path parametrli mini REST router (`GET/POST/DELETE`) yozish', 'Rate Limiter (`429 Too Many Requests` + `Retry-After`) va Webhook HMAC verification yozish', 'End-to-end API Server + Retrying Client testlarini bog‘lash'],
    objEn: ['Route path-parameterized endpoints cleanly in pure Python', 'Implement per-client rate limiting (`429`) and raw-body HMAC webhook checks', 'Exercise an end-to-end client-server contract with integration assertions'],
    theoryUz: `### 1. End-to-End API Request Oqimi
\`Request\` -> **Rate Limiter (\`429\`)** -> **Auth / JWT (\`401\`/\`403\`)** -> **Content-Type & JSON (\`415\`/\`400\`)** -> **Route Handler (\`200\`/\`201\`/\`404\`)** -> **JSON Response**.
### 2. Webhook Xavfsizligi (Raw Body HMAC)
To‘lov tizimi (Payme/Stripe) serveringizga \`POST /webhooks/payment\` yuborganda, haqiqiy ekanini \`hmac.new(secret, raw_body_bytes, sha256)\` bilan tekshiring — va qayta kelgan bir xil \`event_id\` ni idempotent o‘tkazib yuboring!
### 3. Rate Limiting (Fixed Window / Token Bucket)
Foydalanuvchi/IP limiti oshganda \`429\` + \`{"Retry-After": "10"}\` qaytarish serverni suiisteʼmol va DDoS dan saqlaydi.`,
    theoryEn: `### 1. Full Request Pipeline
Rate Limit (\`429\`) -> Auth (\`401\`/\`403\`) -> JSON Parse (\`415\`/\`400\`) -> Business Handler (\`200\`/\`201\`/\`404\`).
### 2. Webhook Signature Verification
Compute HMAC-SHA256 over the exact raw request bytes and deduplicate \`event_id\`s idempotently.
### 3. Rate Limiting (\`429\`)
Track request budgets per client and emit \`Retry-After\` on exhaustion.`,
    examples: [
      ex('Misol 1: Mini REST API Server + Rate Limiter + Client Integratsiyasi', 'Example 1: End-to-End Mini API & Client', `import json, re\n\nclass MiniAPI:\n    def __init__(self, limit: int = 3):\n        self.notes: dict[int, dict] = {}\n        self.hits: dict[str, int] = {}\n        self.limit = limit\n    def handle(self, client: str, method: str, path: str, body: str = "") -> tuple[int, dict, dict]:\n        self.hits[client] = self.hits.get(client, 0) + 1\n        if self.hits[client] > self.limit:\n            return 429, {"Retry-After": "5"}, {"title": "Too Many Requests", "status": 429}\n        if method == "POST" and path == "/v1/notes":\n            data = json.loads(body)\n            nid = len(self.notes) + 1\n            self.notes[nid] = {"id": nid, "text": data["text"]}\n            return 201, {"Location": f"/v1/notes/{nid}"}, self.notes[nid]\n        if m := re.fullmatch(r"/v1/notes/(\\d+)", path):\n            nid = int(m.group(1))\n            if method == "GET":\n                return (200, {}, self.notes[nid]) if nid in self.notes else (404, {}, {"status": 404})\n        return 404, {}, {"status": 404}\n\napi = MiniAPI(limit=3)\nprint(api.handle("c1", "POST", "/v1/notes", \'{"text":"Learn HTTP"}\'))\nprint(api.handle("c1", "GET", "/v1/notes/1"))\nprint(api.handle("c1", "GET", "/v1/notes/99")[0])\nprint(api.handle("c1", "GET", "/v1/notes/1")[:2])`, `(201, {'Location': '/v1/notes/1'}, {'id': 1, 'text': 'Learn HTTP'})\n(200, {}, {'id': 1, 'text': 'Learn HTTP'})\n404\n(429, {'Retry-After': '5'})`, 'Bitta toza sinfda routing, `201 Location`, `404` va 4-so‘rovda `429 Retry-After` hammasi ishladi!', 'Unifies routing, status codes, `Location` header, and `429 Retry-After` rate limiting.'),
      ex('Misol 2: Webhook Raw-Body HMAC Tekshiruvi', 'Example 2: Verifying Raw Webhook Signatures', `import hashlib, hmac\n\nWH_SECRET = b"whsec_live_123"\ndef verify_webhook(raw_body: bytes, sig_header: str) -> bool:\n    expected = hmac.new(WH_SECRET, raw_body, hashlib.sha256).hexdigest()\n    return hmac.compare_digest(expected, sig_header)\n\nbody = b\'{"event_id":"ev_1","paid":true}\'\nsig = hmac.new(WH_SECRET, body, hashlib.sha256).hexdigest()\nprint("valid?", verify_webhook(body, sig), "| tampered?", verify_webhook(b\'{"paid":false}\', sig))`, `valid? True | tampered? False`, 'Webhook imzosi asl baytlar (`raw_body`) ustida tekshirildi.', 'Verifies webhook authenticity directly against raw payload bytes.'),
      ex('Misol 3: Client `429` ni ko‘rib avtomatik kutish va o‘tish', 'Example 3: Client Handling 429 Retry-After', `resp_status, hdrs = 429, {"Retry-After": "5"}\nwait_s = int(hdrs["Retry-After"]) if resp_status == 429 else 0\nprint("Client waits seconds:", wait_s)`, `Client waits seconds: 5`, 'Mijoz server bergan `Retry-After` qiymatiga bo‘ysunadi.', 'Well-behaved clients honor the server’s `Retry-After` hint.'),
    ],
    traceTitleUz: 'End-to-end API pipeline izi',
    traceTitleEn: 'Tracing Full Request Pipeline',
    traceCode: `api.handle("c1", "POST", "/v1/notes", '{"text":"hi"}')`,
    traceSteps: [
      traceStep(1, 'Rate Limit', 'hits=1 <= 3', 'Limit ichida', 'Under rate limit'),
      traceStep(2, 'Route Match', 'POST /v1/notes', 'Handler topildi', 'Matched POST route'),
      traceStep(3, 'Create & Respond', '201 + Location', 'Yangi resurs qaytdi', 'Returned 201 Created'),
    ],
    commonMistakes: [
      mistake('Webhook HMAC ni `json.dumps(parsed)` ustida hisoblash', 'Computing Webhook HMAC Over Re-Serialized JSON', `# json.loads() then json.dumps() changes spaces/key order, breaking the sender's HMAC!`, 'Valid webhooks falsely rejected as 401', `print("Always hash the exact raw request bytes BEFORE json.loads()!")`, 'JSON qayta formatlanganda bo‘shliq va kalit tartibi o‘zgarishi mumkin.', 'Re-serializing parsed JSON alters bytes and breaks HMAC signatures.', 'Xom `raw_body: bytes` ustida `hmac.new()` hisoblang.', 'Hash raw request bytes first.'),
      mistake('Rate Limit oshganda `500` qaytarib `Retry-After` bermaslik', 'Returning 500 Without Retry-After on Rate Limits', `# Returning 500 makes clients retry aggressively instead of backing off!`, 'Thundering retry storm', `print("Return 429 Too Many Requests with Retry-After header!")`, 'Mijoz 500 ko‘rsa darhol qayta uraveradi, 429 + `Retry-After` da esa kutadi.', 'Clients back off cleanly only on `429` + `Retry-After`.', '`429` + `Retry-After` qaytaring.', 'Return `429` with `Retry-After`.'),
    ],
    compareTitleUz: 'Qo‘lda Router vs Framework (`FastAPI`/`Flask`/`Django`)',
    compareTitleEn: 'Raw Python API vs Web Frameworks',
    compareUz: ['Qo‘lda router: HTTP mexanizmini chuqur tushunish va nol bog‘liqlikli (zero-dep) mini-servislar uchun.', 'Framework (`FastAPI` / `Django` / `Flask`): avtomatik OpenAPI, DI, Pydantic validatsiya va async ASGI server (14-kurs!).'],
    compareEn: ['Manual router: clarifies protocol mechanics and serves tiny zero-dep tools.', 'Frameworks: production routing, OpenAPI docs, Pydantic validation, and middleware.'],
    compareSummaryUz: 'Kurs 13 yakunlandi: endi siz HTTP protokoli, REST, Auth, JWT, Webhook va Client retry larni ichidan bilgan holda 14-kurs Backend Frameworklariga o‘tishga tayyorsiz!',
    compareSummaryEn: 'You now understand HTTP, REST, JSON contracts, resilient clients, API keys, JWT/OAuth, and webhooks end-to-end—ready for Course 14 Backend Frameworks.',
    practiceTasks: [
      pt('p1312_1', '1-mashq: Path parametrli Regex Route', 'Task 1: Regex Path Param', '`r"/v1/users/(\\d+)"` bilan `"/v1/users/42"` dan `42` ni ajrating.', 'Extract numeric path ID.', `import re\nm = re.fullmatch(r"/v1/users/(\\d+)", "/v1/users/42")\nprint(int(m.group(1)))`, '42', 're.fullmatch + int(m.group(1))', 'Prints 42.'),
      pt('p1312_2', '2-mashq: Fixed-Window Rate Limiter', 'Task 2: Rate Limit Counter', '`limit=2` bo‘lganda 1, 2 -> `200`, 3-so‘rov -> `429` qaytaring.', 'Return 429 on 3rd call.', `hits, lim = 0, 2\nout = []\nfor _ in range(3):\n    hits += 1\n    out.append(429 if hits > lim else 200)\nprint(out)`, '[200, 200, 429]', 'hits > lim', 'Prints [200, 200, 429].'),
      pt('p1312_3', '3-mashq: Webhook raw-body HMAC', 'Task 3: Webhook HMAC Sign & Check', '`b"event=paid"` baytlari uchun HMAC imzo yaratib tekshiring.', 'Sign and verify raw bytes.', `import hashlib, hmac\ns, b = b"sec", b"event=paid"\nsig = hmac.new(s, b, hashlib.sha256).hexdigest()\nprint(hmac.compare_digest(sig, hmac.new(s, b, hashlib.sha256).hexdigest()))`, 'True', 'Hash raw bytes directly', 'Prints True.'),
      pt('p1312_4', '4-mashq: Idempotent Webhook `event_id`', 'Task 4: Deduplicate Webhook Events', 'Bir xil `ev_1` webhook ikki marta kelganda faqat 1 marta qayta ishlang.', 'Skip duplicate event_id.', `seen, processed = set(), []\nfor ev in ["ev_1", "ev_1", "ev_2"]:\n    if ev not in seen: seen.add(ev); processed.append(ev)\nprint(processed)`, "['ev_1', 'ev_2']", 'Check ev not in seen', "Prints ['ev_1', 'ev_2']."),
      pt('p1312_5', '5-mashq: `201` + `Location` sarlavhasi', 'Task 5: 201 Created Header', 'Yaratilgan ID `5` uchun `Location` sarlavhasini formatlang.', 'Format Location header.', `nid = 5\nprint({"Location": f"/v1/items/{nid}"})`, "{'Location': '/v1/items/5'}", 'f"/v1/items/{nid}"', 'Prints Location dict.'),
    ],
    quiz: [
      q('q1312_1', 'Webhook HMAC imzosi nima uchun `json.loads()` dan OLDIN xom baytlar (`raw_body`) ustida tekshiriladi?', 'Why verify webhook HMAC signatures on raw bytes before `json.loads()`?', ['Tezroq', 'JSON ni qayta `json.dumps()` qilish bo‘shliq va kalit tartibini o‘zgartirib imzoni buzishi mumkin', 'Xotira tejaydi', 'Majburiy emas'], ['Faster', 'Re-serializing parsed JSON can alter formatting/key order and break signature verification', 'Saves RAM', 'Optional'], 1, 'Qayta serializatsiya baytlarni o‘zgartiradi.', 'Re-serialization alters exact bytes.'),
      q('q1312_2', 'API Rate Limiter chegaradan oshganda qaysi status va sarlavhani qaytarishi kerak?', 'Status code and header returned when a rate limit is exceeded?', ['403 + Host', '429 Too Many Requests + Retry-After', '500 + Timeout', '404 + Location'], ['403 + Host', '429 Too Many Requests + Retry-After', '500 + Timeout', '404 + Location'], 1, '`429` va `Retry-After`.', '`429` + `Retry-After`.'),
      q('q1312_3', 'Xuddi o‘sha Webhook xabari tarmoq sabab 2 marta yuborilganda uni xavfsiz o‘tkazib yuborish?', 'Handling duplicate webhook deliveries safely by tracking `event_id` is called:', ['Sharding', 'Idempotent event processing', 'Polling', 'Caching'], ['Sharding', 'Idempotent event processing', 'Polling', 'Caching'], 1, 'Idempotent qayta ishlash.', 'Idempotent processing.'),
      q('q1312_4', 'HTTP `POST` orqali yangi resurs (`/v1/notes/7`) yaratilganda qaysi javob sarlavhasi uning manzilini ko‘rsatadi?', 'Response header pointing to the newly created resource URI in `201 Created`?', ['Target', 'Location', 'Redirect', 'Path'], ['Target', 'Location', 'Redirect', 'Path'], 1, '`Location`.', '`Location`.'),
      q('q1312_5', 'To‘liq API so‘rov quvurida (pipeline) Rate Limiting odatda qayerda tekshiriladi?', 'Where does Rate Limiting typically sit in an API request pipeline?', ['DB commitdan keyin', 'Handler/DB dan oldin, iloji boricha erta (middleware qatlamida)', 'Javobdan keyin', 'Faqat DELETE da'], ['After DB commit', 'Early in middleware before heavy handler/DB work', 'After response', 'DELETE only'], 1, 'Erta (middleware qatlamida).', 'Early in middleware.'),
    ],
    homework: hw('Kurs 13 Yakuniy Loyiha: API Server + Webhook + Retrying Client', 'Course 13 End-to-End APICapstone', 'SQLite bilan bog‘langan `/v1/orders` mini REST API (JWT auth, rate limit `429`, cursor pagination), HMAC webhook qabul qilgich va `429`/`503` larni exponential backoff bilan qayta urinib o‘tadigan Client yozing.', 'Build an end-to-end SQLite-backed `/v1/orders` API (JWT auth, rate limiter, cursor pagination, raw-body HMAC webhook handler) paired with a retrying client test suite.', ['JWT Auth + Rate Limiter + Webhook HMAC + Cursor Pagination', 'End-to-end client-server assertlari'], ['Full pipeline + webhook + cursor', 'End-to-end assertions'], 'Compose Course 13 modules cleanly into server.handle() and client.request().', 'Full integration.', 'Kurs 14 (Backend Development — Flask, Django, FastAPI) ga tayyorlaning.', 'Ready for Course 14.', 35),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),
];
