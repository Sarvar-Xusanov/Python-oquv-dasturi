import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C13_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-13-01',
    courseId: 'http_apis',
    moduleId: 'c13_m1',
    order: 1,
    titleUz: 'Internet qanday ishlaydi? IP, DNS, TCP/IP va Portlar',
    titleEn: 'How the Internet Works: IP Addresses, DNS, TCP/IP & Ports',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-12-10'],
    conceptId: 'net_internet_basics',
    whyUz: "Har safar brauzerga `api.example.com` yozganingizda yoki Python da API chaqirganingizda, soniyaning mingdan bir qismida **DNS**, **IP**, **TCP** va **Port** zanjiri ishga tushadi. Tarmoq asoslarini bilmagan backend dasturchi esa `ConnectionRefusedError` yoki `Timeout` xatolarini ko‘r-ko‘rona qidirib o‘tiradi!",
    whyEn: 'Demystify how domains resolve via DNS to IPv4/IPv6 addresses, why TCP guarantees reliable ordered delivery over packets, and how Ports route traffic to specific processes.',
    analogyUz: "**IP manzil** — bu shahardagi uyning ko‘cha va uy raqami (`93.184.216.34`). **DNS** — telefon kontaktlari daftari (ism `example.com` ni raqamga aylantiradi). **Port** (`80`, `443`, `5432`) — esa ko‘p qavatli binodagi aniq xonadon raqami (qaysi dastur eshitib turgani)!",
    analogyEn: 'An IP is the street address, DNS is the phonebook turning domain names into IPs, and a Port is the exact apartment number inside the server.',
    stopsUz: "`localhost` va `127.0.0.1` — **loopback** (faqat sizning kompyuteringiz ichidan ulanish mumkin!), **`0.0.0.0`** esa serverni barcha tarmoq interfeyslarida tinglash (Docker/cloud deploy da juda muhim!). Shuningdek `0..1023` — tizim portlari (HTTP `80`, HTTPS `443`, SSH `22`).",
    stopsEn: '`127.0.0.1` (`localhost`) accepts local-only loopback connections; binding a server to `0.0.0.0` exposes it across all container/host interfaces.',
    objUz: ['IPv4/IPv6 va `127.0.0.1` (localhost) vs `0.0.0.0` farqini Python `ipaddress` da tekshirish', 'DNS (Domain Name System) va A / AAAA / CNAME yozuvlari vazifasini bilish', 'TCP (ishonchli ketma-ket) vs UDP (tez, kafolatsiz) hamda mashhur portlarni (`80`, `443`, `5432`, `6379`) bilish'],
    objEn: ['Inspect IPv4/IPv6 addresses and loopback/private ranges via stdlib `ipaddress`', 'Explain DNS resolution (A, AAAA, CNAME, TTL)', 'Contrast TCP vs UDP and recognize standard service ports'],
    theoryUz: `### 1. Paketlar va IP Manzil
Internet ma’lumotlarni kichik paketlarga bo‘lib yuboradi. IPv4 (32-bit: \`192.168.1.1\`), IPv6 (128-bit: \`::1\`). \`127.0.0.1\` — loopback, \`10.x\`/\`192.168.x\` — xususiy tarmoqlar.
### 2. DNS — Domen Nomidan IP ga
\`A\` (IPv4), \`AAAA\` (IPv6), \`CNAME\` (alias), \`MX\` (email). Kesh muddati **TTL** bilan boshqariladi.
### 3. TCP vs UDP
- **TCP**: 3-way handshake (\`SYN -> SYN-ACK -> ACK\`), yo‘qolgan paketlarni qayta yuboradi, tartibni saqlaydi -> HTTP, PostgreSQL, SSH.
- **UDP**: tezkor, handshakesiz -> video qo‘ng‘iroq, o‘yinlar, DNS.
### 4. Mashhur Portlar
\`22\` (SSH), \`53\` (DNS), \`80\` (HTTP), \`443\` (HTTPS), \`5432\` (PostgreSQL), \`6379\` (Redis), \`3000\`/\`8000\` (Dev serverlar).`,
    theoryEn: `### 1. IPv4 / IPv6 & Special Ranges
IPv4 (32-bit dotted quads) vs IPv6 (128-bit hex). \`127.0.0.1\` (\`localhost\`) is loopback; \`0.0.0.0\` binds all interfaces.
### 2. DNS Records & Caching
\`A\` (IPv4), \`AAAA\` (IPv6), \`CNAME\` (alias) cached up to their \`TTL\`.
### 3. TCP vs UDP
**TCP** performs a 3-way handshake (\`SYN\`, \`SYN-ACK\`, \`ACK\`) for reliable ordered streams; **UDP** trades reliability for minimal latency.
### 4. Standard Ports
\`80\` HTTP, \`443\` HTTPS, \`5432\` Postgres, \`6379\` Redis, \`3000\`/\`8000\` app servers.`,
    examples: [
      ex('Misol 1: `ipaddress` bilan Loopback, Private va Public IP ni ajratish', 'Example 1: Classifying IPs with stdlib ipaddress', `import ipaddress\n\nfor raw in ["127.0.0.1", "192.168.1.10", "93.184.216.34", "::1"]:\n    ip = ipaddress.ip_address(raw)\n    print(f"{raw:15} v{ip.version} loopback={ip.is_loopback} private={ip.is_private}")`, `127.0.0.1       v4 loopback=True private=True\n192.168.1.10    v4 loopback=False private=True\n93.184.216.34   v4 loopback=False private=False\n::1             v6 loopback=True private=True`, '`ipaddress` moduli IPv4/IPv6 manzillari va tarmoq turlarini xatosiz tekshiradi.', 'Python’s `ipaddress` validates IPv4/IPv6 formats and range flags cleanly.'),
      ex('Misol 2: Xizmat -> Standart Portlar Xaritasi', 'Example 2: Well-Known Ports & Services', `PORTS = {"http": 80, "https": 443, "postgres": 5432, "redis": 6379}\nfor svc in ["http", "https", "postgres"]:\n    print(svc, "->", PORTS[svc], "privileged?" , PORTS[svc] < 1024)`, `http -> 80 privileged? True\nhttps -> 443 privileged? True\npostgres -> 5432 privileged? False`, '0–1023 oralig‘idagi portlar tizimli (privileged) portlar hisoblanadi.', 'Ports below 1024 are well-known privileged system ports.'),
      ex('Misol 3: Mini DNS Resolver & TTL Simulyatori', 'Example 3: Local DNS Cache Lookup Simulation', `dns_records = {"api.shop.uz": ("A", "203.0.113.10", 60)}\nhost = "api.shop.uz"\nrec_type, ip, ttl = dns_records[host]\nprint(f"Resolved {host} ({rec_type}) -> {ip} [TTL={ttl}s]")`, `Resolved api.shop.uz (A) -> 203.0.113.10 [TTL=60s]`, 'DNS mijoz uchun domen nomini TTL muddatli IP manzilga tarjima qiladi.', 'DNS maps human-readable hostnames into IP addresses cached for TTL seconds.'),
    ],
    traceTitleUz: 'So‘rovning tarmoq bo‘ylab yo‘li',
    traceTitleEn: 'Tracing DNS -> TCP -> Port Delivery',
    traceCode: `# Client -> "https://api.uz:443/users"`,
    traceSteps: [
      traceStep(1, 'DNS Lookup', 'api.uz -> 203.0.113.5', 'Domen IP ga tarjima qilindi', 'Resolved domain to IP'),
      traceStep(2, 'TCP Handshake', 'SYN -> SYN-ACK -> ACK', 'Ishonchli kanal ochildi', 'Established reliable TCP stream'),
      traceStep(3, 'Target Port 443', 'HTTPS server process', '443-portdagi server qabul qildi', 'Routed to port 443 process'),
    ],
    commonMistakes: [
      mistake('Docker konteynerida serverni `127.0.0.1` ga bog‘lab tashqaridan kira olmaslik', 'Binding Container Server to 127.0.0.1 Instead of 0.0.0.0', `# Binding to 127.0.0.1 inside Docker makes the app unreachable from outside the container!`, 'Connection refused from host/proxy', `print("Bind dev/container servers to 0.0.0.0 (all interfaces) when exposing ports!")`, 'Konteyner ichidagi `127.0.0.1` faqat konteynerning o‘ziga ko‘rinadi.', '`127.0.0.1` inside a container isolates the socket from external host traffic.', 'Konteyner ichida `0.0.0.0` ga bog‘lang.', 'Bind to `0.0.0.0` inside containers.'),
      mistake('IPv4 matnini oddiy `len(s.split(".")) == 4` deb tekshirish', 'Naive String Check for IP Addresses', `print("Bad IP check passes '999.999.1.1'!")`, 'Accepts invalid octets > 255', `import ipaddress\ntry:\n    ipaddress.ip_address("999.1.1.1")\nexcept ValueError:\n    print("ipaddress rejected invalid IP!")`, 'Har bir oktet 0..255 oralig‘ida bo‘lishi shart.', 'Naive dot splitting misses out-of-range octets.', 'Doim `ipaddress.ip_address()` ishlating.', 'Validate IPs with `ipaddress.ip_address()`.'),
    ],
    compareTitleUz: 'TCP vs UDP',
    compareTitleEn: 'TCP vs UDP',
    compareUz: ['TCP: 3-way handshake, kafolatlangan yetkazish va tartib (REST API, DB, File transfer).', 'UDP: tezkor, handshakesiz, yo‘qolgan paketni qayta so‘ramaydi (Zoom video, DNS, o‘yinlar).'],
    compareEn: ['TCP: reliable, ordered stream with handshake (HTTP, SQL, SSH).', 'UDP: low-latency datagrams without retransmission (streaming, DNS, gaming).'],
    compareSummaryUz: 'DNS domenni IP ga, TCP/Port esa paketlarni aniq dasturgacha yetkazib beradi; IP larni `ipaddress` bilan tekshiring.',
    compareSummaryEn: 'DNS resolves names to IPs, TCP guarantees ordered delivery to a Port, and `ipaddress` validates addresses cleanly.',
    practiceTasks: [
      pt('p1301_1', '1-mashq: IPv4 tekshiruvi', 'Task 1: Validate IPv4', '`ipaddress.ip_address` bilan `"10.0.0.5"` xususiy (private) ekanini chiqaring.', 'Check is_private.', `import ipaddress\nprint(ipaddress.ip_address("10.0.0.5").is_private)`, 'True', 'ipaddress.ip_address(...).is_private', 'Prints True.'),
      pt('p1301_2', '2-mashq: Subnet (`ip_network`) tekshiruvi', 'Task 2: CIDR Membership', '`192.168.1.42` `192.168.1.0/24` tarmog‘iga kirishini tekshiring.', 'Check IP in CIDR.', `import ipaddress\nnet = ipaddress.ip_network("192.168.1.0/24")\nprint(ipaddress.ip_address("192.168.1.42") in net)`, 'True', 'ip in net', 'Prints True.'),
      pt('p1301_3', '3-mashq: Noto‘g‘ri IP ni tutish', 'Task 3: Reject Bad IP', '`"300.0.0.1"` uchun `ValueError` tuting.', 'Catch ValueError.', `import ipaddress\ntry:\n    ipaddress.ip_address("300.0.0.1")\nexcept ValueError:\n    print("invalid ip")`, 'invalid ip', 'try/except ValueError', 'Prints invalid ip.'),
      pt('p1301_4', '4-mashq: IPv6 loopback', 'Task 4: IPv6 Loopback', '`"::1"` ning versiyasi va `is_loopback` xossasini chiqaring.', 'Inspect ::1.', `import ipaddress\nip = ipaddress.ip_address("::1")\nprint(ip.version, ip.is_loopback)`, '6 True', 'version == 6', 'Prints 6 True.'),
      pt('p1301_5', '5-mashq: Port chegarasi tekshiruvi', 'Task 5: Valid Port Guard', '`1 <= port <= 65535` funksiyasini `80`, `0`, `70000` da sinang.', 'Validate TCP port bounds.', `def ok_port(p: int) -> bool: return 1 <= p <= 65535\nprint(ok_port(80), ok_port(0), ok_port(70000))`, 'True False False', '1 <= p <= 65535', 'Prints True False False.'),
    ],
    quiz: [
      q('q1301_1', 'Domen nomini (`example.com`) IP manzilga aylantirib beruvchi tizim?', 'System translating domain names like `example.com` into IP addresses?', ['HTTP', 'DNS (Domain Name System)', 'SSH', 'ORM'], ['HTTP', 'DNS (Domain Name System)', 'SSH', 'ORM'], 1, 'DNS.', 'DNS.'),
      q('q1301_2', 'TCP ulanish o‘rnatishdagi dastlabki 3 qadamli kelishuv nima deb ataladi?', 'Initial connection setup sequence in TCP?', ['2-way ping', '3-way handshake (SYN, SYN-ACK, ACK)', 'DNS lookup', 'TLS close'], ['2-way ping', '3-way handshake (SYN, SYN-ACK, ACK)', 'DNS lookup', 'TLS close'], 1, '3-way handshake.', '3-way handshake.'),
      q('q1301_3', 'HTTPS va PostgreSQL ning standart portlari ketma-ket qaysilar?', 'Standard default ports for HTTPS and PostgreSQL respectively?', ['80 va 3306', '443 va 5432', '22 va 6379', '3000 va 8000'], ['80 and 3306', '443 and 5432', '22 and 6379', '3000 and 8000'], 1, 'HTTPS `443`, PostgreSQL `5432`.', '`443` and `5432`.'),
      q('q1301_4', 'Docker konteyneri ichidagi veb-server tashqaridan ko‘rinishi uchun qaysi IP ga bog‘lanishi kerak?', 'IP address a server inside a Docker container must bind to for external access?', ['127.0.0.1', '0.0.0.0', '192.168.0.0', '255.255.255.255'], ['127.0.0.1', '0.0.0.0', '192.168.0.0', '255.255.255.255'], 1, '`0.0.0.0` (barcha interfeyslar).', '`0.0.0.0`.'),
      q('q1301_5', 'TCP ning UDP dan asosiy farqi nima?', 'Key difference between TCP and UDP?', ['TCP tezroq', 'TCP paketlar yetib borishi va tartibini kafolatlaydi; UDP kafolatsiz, lekin minimal kechikishli', 'UDP shifrlangan', 'Farqi yo‘q'], ['TCP is faster', 'TCP guarantees ordered reliable delivery; UDP is connectionless with minimal latency', 'UDP encrypted', 'None'], 1, 'TCP ishonchli va tartibli; UDP tez va kafolatsiz.', 'TCP reliable; UDP low-latency.'),
    ],
    homework: hw('IP Allowlist & CIDR Validator', 'IP Allowlist Firewall Checker', 'Python `ipaddress` moduli yordamida admin panelga faqat ruxsat etilgan CIDR tarmoqlaridan (`10.0.0.0/8`, `127.0.0.1/32`) kirishga ruxsat beruvchi va public IP larni bloklovchi `is_allowed_ip(ip_str, allowlist)` funksiyasini yozing.', 'Write `is_allowed_ip(ip_str, cidrs)` using `ipaddress` to permit trusted private/loopback CIDRs while blocking malformed or public IPs.', ['ipaddress.ip_address va ip_network', 'Noto‘g‘ri IP da False qaytarish'], ['Use ipaddress module', 'Gracefully reject invalid strings'], 'Parse ValueError cleanly and check any(ip in net for net in nets).', 'Safe CIDR checks.', 'IPv6 `::1/128` qo‘llab-quvvatlashini ham qo‘shing.', 'Add IPv6 support.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-02',
    courseId: 'http_apis',
    moduleId: 'c13_m1',
    order: 2,
    titleUz: 'Client va Server Arxitekturasi (Stateless, Concurrency va Reverse Proxy)',
    titleEn: 'Client-Server Architecture: Statelessness, Workers & Reverse Proxies',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-13-01'],
    conceptId: 'net_client_server',
    whyUz: "Nima uchun bitta backend server bir vaqtda 10,000 foydalanuvchiga xizmat qila oladi, lekin agar server foydalanuvchi savatini Python `dict = {}` global o‘zgaruvchisida saqlasa, 2-server qo‘shilganda savat yo‘qolib qoladi? **Client-Server** va **Stateless** arxitektura — masshtablanadigan (scalable) tizimlarning asosi!",
    whyEn: 'Understand Request/Response cycles, why stateless servers scale horizontally across load balancers (Nginx) and workers (Gunicorn/Uvicorn), and why client trust is never security.',
    analogyUz: "**Stateful server** — xotirasida faqat 1 ta ofitsiant hamma mijoz buyurtmasini boshida saqlab yurishi (boshqa ofitsiant kelsa hech narsa bilmaydi!). **Stateless server** — har bir buyurtma qog‘ozida stol raqami/token bor va hamma yozuv umumiy oshxona doskasida (Database/Redis) turadi!",
    analogyEn: 'A stateful server traps user state in local RAM; a stateless server carries a token per request and stores shared state in PostgreSQL or Redis so any worker can serve it.',
    stopsUz: "Ikki muhim xavfsizlik/arxitektura qoidasi: 1) **Never trust the client!** Brauzer/mobil ilova yuborgan narx, rol (`is_admin: true`) yoki balansni har doim **serverda** qayta tekshiring! 2) Server jarayoni xotirasida (`GLOBAL_CART = {}`) sessiya saqlamang — ko‘p worker (`uvicorn --workers 4`) rejimida so‘rovlar boshqa jarayonga tushib qoladi!",
    stopsEn: 'Never trust client-supplied prices, roles, or IDs without server verification, and never store user sessions in local process globals—multi-worker deployments route requests across separate processes.',
    objUz: ['Client (so‘rov yuboruvchi) vs Server (tinglovchi/javob beruvchi) rollarini bilish', 'Stateless backend + tashqi Database/Redis vs Stateful RAM muammosini tushunish', 'Reverse Proxy (Nginx) -> Load Balancer -> App Workers (Uvicorn) zanjirini tasavvur qilish'],
    objEn: ['Trace Client-Server request/response ownership', 'Design stateless handlers backed by shared DB/Redis instead of process memory', 'Explain Reverse Proxies (TLS termination, static files, load balancing)'],
    theoryUz: `### 1. Client vs Server
- **Client**: brauzer, mobil ilova, CLI yoki boshqa microservice (\`httpx\`/\`requests\`) — muloqotni boshlaydi.
- **Server**: portda kutib turadi, validatsiya qiladi, DB ga murojaat qiladi va javob qaytaradi.
### 2. Stateless Tamoyili (Horizontal Scaling)
Agar sessiya ma’lumoti bitta Python jarayoni RAM ida tursa, 4 ta worker (\`--workers 4\`) da 75% so‘rovlar "siz kim?" deb xato beradi! Stateless server holatni **DB/Redis/JWT** ga chiqaradi.
### 3. Reverse Proxy (Nginx / Caddy / Cloudflare)
Tashqi trafik avval Reverse Proxy ga keladi (HTTPS/TLS shifrdan yechish, gzip, rate limit, static fayllar), so‘ng Python app serverga (\`Uvicorn\`/\`Gunicorn\`) uzatiladi.
### 4. Never Trust the Client
Foydalanuvchi \`curl\` bilan \`{"price": 1, "role": "admin"}\` yuborishi mumkin — hamma hisob-kitob va ruxsat tekshiruvi serverda bajariladi!`,
    theoryEn: `### 1. Client vs Server Roles
Clients initiate requests; servers listen, authenticate, enforce business rules, and respond.
### 2. Statelessness Enables Scaling
Keeping state in external DB/Redis or signed tokens lets any worker behind a load balancer serve any request.
### 3. Reverse Proxy & App Workers
Nginx/Cloudflare handle TLS termination and buffering before forwarding to Uvicorn/Gunicorn workers.
### 4. Never Trust Client Input
Always recompute totals and verify permissions on the server.`,
    examples: [
      ex('Misol 1: Multi-Worker da Stateful RAM xatosi vs Stateless Store', 'Example 1: Why Process-Local State Breaks Multi-Worker', `worker1_ram = {}\nworker2_ram = {}\nshared_db = {"tok_1": "Ali"}\n\nworker1_ram["tok_1"] = "Ali"  # Saved only in worker 1!\nprint("Worker 2 stateful lookup:", worker2_ram.get("tok_1"))\nprint("Worker 2 shared DB lookup:", shared_db.get("tok_1"))`, `Worker 2 stateful lookup: None\nWorker 2 shared DB lookup: Ali`, '2-worker kelgan so‘rovda 1-worker xotirasini ko‘ra olmaydi; umumiy DB esa hamma workerga ko‘rinadi.', 'Process-local RAM fails when a load balancer routes the next request to worker 2.'),
      ex('Misol 2: Never Trust Client — Narxni server katalogidan olish', 'Example 2: Server-Side Price Verification', `CATALOG = {"laptop": 1200, "mouse": 25}\nclient_payload = {"sku": "laptop", "qty": 2, "price": 1}  # Tampered price!\ntotal = CATALOG[client_payload["sku"]] * client_payload["qty"]\nprint("Server verified total:", total)`, `Server verified total: 2400`, 'Server mijoz yuborgan `price: 1` ni eʼtiborsiz qoldirib katalogdan haqiqiy narxni oldi.', 'Always compute authoritative totals on the server using catalog prices.'),
      ex('Misol 3: Round-Robin Load Balancer Simulyatori', 'Example 3: Round-Robin Worker Dispatch', `workers = ["w1", "w2", "w3"]\nrouted = [workers[i % len(workers)] for i in range(5)]\nprint(routed)`, `['w1', 'w2', 'w3', 'w1', 'w2']`, 'Load Balancer so‘rovlarni mavjud workerlar orasida teng taqsimlaydi.', 'Round-robin balancing distributes requests evenly across stateless workers.'),
    ],
    traceTitleUz: 'Reverse Proxy -> App Server oqimi',
    traceTitleEn: 'Tracing Reverse Proxy Request Flow',
    traceCode: `# Browser -> HTTPS(443) Nginx -> HTTP(8000) Uvicorn -> PostgreSQL`,
    traceSteps: [
      traceStep(1, 'Nginx (Reverse Proxy)', 'TLS decrypted', 'HTTPS sertifikat Nginx da yechildi', 'Terminated TLS at proxy'),
      traceStep(2, 'Uvicorn Worker', 'Stateless handler', 'Worker DB/Redis dan holatni oldi', 'Stateless worker checked DB'),
      traceStep(3, 'Response', '200 OK JSON', 'Javob mijozga qaytarildi', 'Returned JSON response'),
    ],
    commonMistakes: [
      mistake('Mijoz yuborgan `user_id`, `role` yoki `price` ga ishonib qolish', 'Trusting Client-Supplied Totals or Roles', `# Charging client_data["total"] lets anyone buy a $1000 item for $0.01 via curl!`, 'Critical business logic exploit', `print("Look up price from DB and derive user_id from verified server auth token!")`, 'Har qanday brauzer DevTools yoki `curl` so‘rov tanasini xohlagancha o‘zgartira oladi.', 'Attackers trivially tamper with JSON request payloads.', 'Narx va foydalanuvchi ID sini faqat serverda aniqlang.', 'Derive prices and identities strictly on the server.'),
      mistake('Global Python `dict` da login sessiyalarini saqlash', 'Storing Sessions in Global Process Dict', `# Works with 1 dev server, silently logs users out under 4 Gunicorn workers!`, 'Intermittent 401 errors in production', `print("Use Redis, SQLite/Postgres, or signed tokens for session state!")`, 'Ko‘p worker jarayonlari xotirani baham ko‘rmaydi.', 'Multiple worker processes have isolated memory spaces.', 'Tashqi store (Redis/DB) ishlating.', 'Store shared state externally.'),
    ],
    compareTitleUz: 'Stateful Server vs Stateless Server',
    compareTitleEn: 'Stateful vs Stateless Architecture',
    compareUz: ['Stateful RAM: tez prototip, lekin 1 ta jarayon bilan cheklangan va restartda yo‘qoladi.', 'Stateless Server + DB/Redis: istalgancha server qo‘shish (horizontal scaling) va nol-yo‘qotishli restart.'],
    compareEn: ['Stateful RAM: single-process limit; lost on deploy/crash.', 'Stateless + external store: horizontal scaling, load balancing, resilient deploys.'],
    compareSummaryUz: 'Stateless server yozing, shared holatni DB/Redis ga chiqaring va mijoz kiritgan qiymatlarga hech qachon ko‘r-ko‘rona ishonmang.',
    compareSummaryEn: 'Keep application servers stateless backed by DB/Redis, route through a reverse proxy, and verify all business inputs server-side.',
    practiceTasks: [
      pt('p1302_1', '1-mashq: Serverda narx hisoblash', 'Task 1: Ignore Client Price', 'Katalogdan `{"book": 30}` narxini olib `qty=3` uchun summani hisoblang (client `price=1` ni inkor eting).', 'Compute server total.', `cat = {"book": 30}\npayload = {"item": "book", "qty": 3, "price": 1}\nprint(cat[payload["item"]] * payload["qty"])`, '90', 'Use cat[item] * qty', 'Prints 90.'),
      pt('p1302_2', '2-mashq: Round-Robin taqsimlash', 'Task 2: Round-Robin Balancer', '6 ta so‘rovni 2 ta workerga (`A`, `B`) navbatma-navbat taqsimlang.', 'Distribute 6 requests.', `w = ["A", "B"]\nprint([w[i % 2] for i in range(6)])`, "['A', 'B', 'A', 'B', 'A', 'B']", 'w[i % 2]', 'Prints alternating list.'),
      pt('p1302_3', '3-mashq: Shared Store vs Worker RAM', 'Task 3: Shared Session Lookup', '2 ta worker umumiy `shared` lug‘atdan token o‘qishini ko‘rsating.', 'Read from shared store.', `shared = {"s1": "user1"}\nw1 = lambda t: shared.get(t)\nw2 = lambda t: shared.get(t)\nprint(w1("s1"), w2("s1"))`, 'user1 user1', 'Both query shared dict', 'Prints user1 user1.'),
      pt('p1302_4', '4-mashq: `qty <= 0` validatsiyasi', 'Task 4: Reject Negative Qty', 'Manfiy miqdor kelganda `ValueError` ko‘taring.', 'Guard positive quantity.', `def order(qty):\n    if qty <= 0: raise ValueError("bad qty")\n    return qty * 10\ntry:\n    order(-2)\nexcept ValueError as e:\n    print(e)`, 'bad qty', 'if qty <= 0', 'Prints bad qty.'),
      pt('p1302_5', '5-mashq: X-Forwarded-For proxy sarlavhasi', 'Task 5: Read Real Client IP', '`"10.0.0.1, 172.16.0.5"` sarlavhasidan birinchi real mijoz IP sini ajrating.', 'Extract first proxy IP.', `hdr = "203.0.113.9, 10.0.0.5"\nprint(hdr.split(",")[0].strip())`, '203.0.113.9', 'First entry before comma', 'Prints 203.0.113.9.'),
    ],
    quiz: [
      q('q1302_1', '"Stateless server" nimani anglatadi?', 'What does a "stateless" backend server mean?', ['Bazasi yo‘q', 'Server foydalanuvchi sessiya holatini o‘zining lokal RAM ida saqlamaydi — har so‘rov mustaqil ishlanadi', 'Hech qachon javob bermaydi', 'Faqat HTML qaytaradi'], ['No database', 'Server holds no user session state in local process RAM across requests', 'No responses', 'HTML only'], 1, 'Lokal jarayon RAM ida sessiya saqlamaydi.', 'No process-local session state.'),
      q('q1302_2', 'Nima uchun mijoz (brauzer/app) yuborgan `total_price` yoki `is_admin` ga ishonish xavfli?', 'Why is trusting `total_price` or `is_admin` sent by the client dangerous?', ['Chunki JSON sekin', 'Foydalanuvchi so‘rovni `curl` yoki DevTools da osongina o‘zgartirib yuborishi mumkin', 'CORS xato chiqaradi', 'Port yopiladi'], ['Slow JSON', 'Clients can trivially forge arbitrary request payloads', 'CORS error', 'Closes port'], 1, 'Mijoz payloadni o‘zgartira oladi — server tekshirishi shart.', 'Clients control their own payload.'),
      q('q1302_3', 'Nginx kabi Reverse Proxy ning asosiy vazifalaridan biri qaysi?', 'Primary role of a Reverse Proxy like Nginx in front of FastAPI/Uvicorn?', ['Python kodini kompilyatsiya qilish', 'TLS/HTTPS termination, static fayllar va Load Balancing', 'SQL yozish', 'Git commit'], ['Compile Python', 'TLS termination, static serving, rate limiting, and load balancing', 'SQL', 'Git'], 1, 'TLS termination va Load Balancing.', 'TLS termination and load balancing.'),
      q('q1302_4', '4 ta Uvicorn worker ishlayotgan serverda global Python `dict` ga sessiya saqlansa nima bo‘ladi?', 'What breaks if you store login sessions in a Python global `dict` with 4 Uvicorn workers?', ['Tezlashadi', 'Boshqa workerga tushgan so‘rov sessiyani topa olmaydi', 'Xotira 4x ortadi xolos', 'Hech narsa'], ['Faster', 'Requests routed to the other 3 workers will miss the session', 'Only RAM', 'Nothing'], 1, 'Boshqa workerlar uni ko‘rmaydi.', 'Isolated worker memory misses sessions.'),
      q('q1302_5', 'Client-Server modelida muloqotni kim boshlaydi?', 'Who initiates communication in the HTTP Client-Server model?', ['Server', 'Client (mijoz)', 'Database', 'Router'], ['Server', 'The Client', 'Database', 'Router'], 1, 'Client so‘rov (Request) bilan boshlaydi.', 'The Client initiates requests.'),
    ],
    homework: hw('Stateless Load-Balanced API Simulyatori', 'Stateless Worker Cluster Simulator', '3 ta mustaqil `Worker` va bitta umumiy `SharedStore` hamda `LoadBalancer` tuzib, har bir worker so‘rov narxini katalogdan qayta hisoblaydigan va sessiyani `SharedStore` dan tekshiradigan simulyatsiya yozing.', 'Simulate a 3-worker round-robin cluster reading auth sessions from a shared store and computing order totals strictly from server-side catalog prices.', ['3 ta worker + shared store', 'Client price tampering ni rad etish testi'], ['3 workers + shared store', 'Reject tampered client prices'], 'Route requests round-robin and verify token in shared_store.', 'Stateless cluster.', 'Rate-limiting hisoblagichini ham `SharedStore` ga qo‘shing.', 'Add shared rate counter.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-03',
    courseId: 'http_apis',
    moduleId: 'c13_m1',
    order: 3,
    titleUz: 'HTTP va HTTPS — TLS, Shifrlash va Sertifikatlar',
    titleEn: 'HTTP vs HTTPS: TLS Encryption, Certificates & Security',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-13-02'],
    conceptId: 'net_http_https',
    whyUz: "Oddiy `HTTP` da parol va tokenlaringiz tarmoq bo‘ylab ochiq matn (plaintext) ko‘rinishida uchadi — kafe Wi-Fi dagi har kim o‘qiy oladi! **`HTTPS` (`HTTP + TLS`)** esa aloqani uchta qatlam bilan himoyalaydi: Maxfiylik (Encryption), Butunlik (Integrity) va Haqiqiylik (Authentication).",
    whyEn: 'Learn why plain HTTP leaks credentials, how HTTPS uses TLS asymmetric handshakes + symmetric session keys + CA certificates, and why disabling SSL verification (`verify=False`) breaks security.',
    analogyUz: "**HTTP** — ochiq pochta otkritkasi: pochta bo‘ylab hamma o‘qishi va o‘zgartirishi mumkin. **HTTPS (TLS)** — muhrlangan va faqat haqiqiy egasining pasporti (Sertifikat) tekshirilgan seyf-konvert!",
    analogyEn: 'HTTP is an open postcard anyone on the network can read; HTTPS is an encrypted armored envelope backed by verified server identity certificates.',
    stopsUz: "Production kodda ASLO `verify=False` (`ssl._create_unverified_context`) yozmang! Sertifikatni tekshirishni o‘chirish shifrlash foydasini nolga tushirib, **Man-in-the-Middle (MITM)** hujumiga eshik ochadi! Shuningdek `http://` havolalarni `https://` ga yo‘naltirish va **HSTS** sarlavhasidan foydalaning.",
    stopsEn: 'Never disable certificate checks (`verify=False`) in production—without identity verification, TLS is vulnerable to Man-in-the-Middle attacks.',
    objUz: ['HTTPS ning 3 ustuni (Encryption, Integrity, Certificate Auth) ni bilish', 'TLS Handshake da Asymmetric (kalit almashish) + Symmetric (tezkor ma’lumot) birikishini tushunish', '`hmac` va `hashlib` bilan shifrlash/butunlik tekshiruvi hamda `verify=False` xavfini ko‘rish'],
    objEn: ['Explain Encryption, Integrity, and CA Certificate Authentication in TLS', 'Understand why TLS pairs asymmetric key exchange with fast symmetric ciphers', 'Avoid `verify=False` and apply HSTS + HTTPS hygiene'],
    theoryUz: `### 1. Oddiy HTTP Xavfi
Wi-Fi router, ISP yoki proksi paket ichidagi \`Authorization: Bearer ...\` va cookie larni ochiq ko‘radi (eavesdropping) yoki o‘zgartiradi (tampering).
### 2. HTTPS (TLS) Nima Beradi?
1. **Encryption (Maxfiylik)**: tashqaridan shifrlangan baytlar ko‘rinadi.
2. **Integrity (Butunlik)**: yo‘lda 1 bit o‘zgartirilsa MAC/AEAD tekshiruvi rad etadi.
3. **Authentication (Haqiqiylik)**: CA (Certificate Authority) imzolagan SSL/TLS sertifikati aynan \`api.bank.uz\` bilan gaplashayotganingizni isbotlaydi!
### 3. Nima Uchun TLS Ham Asymmetric, Ham Symmetric Ishlatadi?
Asymmetric (RSA/ECDH) sekin, lekin oldindan umumiy kalitsiz xavfsiz sessiya kalitini kelishib olishga zo‘r; keyin esa barcha trafik o‘sha sessiya kaliti bilan chaqqon Symmetric (AES-GCM / ChaCha20) da shifrlanadi!
### 4. \`verify=False\` Taqiqi
\`requests.get(url, verify=False)\` sertifikatni tekshirmaydi — MITM hujumchi soxta sertifikat bilan hamma trafikni o‘qib oladi!`,
    theoryEn: `### 1. Plain HTTP Risks
Exposes cookies, API keys, and payloads to passive sniffing and active injection on untrusted networks.
### 2. Three Guarantees of TLS/HTTPS
**Confidentiality** (encryption), **Integrity** (authenticated AEAD tags), and **Identity** (CA-signed X.509 certificates).
### 3. Hybrid TLS Handshake
Asymmetric cryptography negotiates an ephemeral shared session key safely; symmetric ciphers (AES-GCM / ChaCha20) then encrypt bulk data fast.
### 4. Never Bypass Verification
Passing \`verify=False\` silently accepts rogue attacker certificates (MITM).`,
    examples: [
      ex('Misol 1: Plain HTTP vs HTTPS HMAC Butunlik Tekshiruvi', 'Example 1: Message Integrity Check with HMAC', `import hmac, hashlib\n\nsecret = b"tls_session_key"\npayload = b"GET /balance"\ntag = hmac.new(secret, payload, hashlib.sha256).hexdigest()\n\ntampered = b"GET /transfer"\nvalid_orig = hmac.compare_digest(tag, hmac.new(secret, payload, hashlib.sha256).hexdigest())\nvalid_hack = hmac.compare_digest(tag, hmac.new(secret, tampered, hashlib.sha256).hexdigest())\nprint("orig valid?", valid_orig, "| tampered valid?", valid_hack)`, `orig valid? True | tampered valid? False`, 'Yo‘lda birgina so‘z o‘zgartirilsa HMAC butunlik tekshiruvi darhol rad etadi.', 'Cryptographic authentication tags immediately reject in-transit payload tampering.'),
      ex('Misol 2: Xavfsiz HTTP Security Sarlavhalari (HSTS)', 'Example 2: Standard HTTPS Security Headers', `sec_headers = {\n    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",\n    "X-Content-Type-Options": "nosniff",\n    "X-Frame-Options": "DENY",\n}\nprint(sorted(sec_headers.keys()))`, `['Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options']`, 'HSTS brauzerga kelajakda har doim faqat `https://` ishlatishni buyuradi.', 'HSTS instructs browsers to enforce HTTPS automatically on future visits.'),
      ex('Misol 3: URL sxemasi `https://` majburiyati tekshiruvi', 'Example 3: Enforcing HTTPS Scheme', `def require_https(url: str) -> str:\n    if not url.startswith("https://"):\n        raise ValueError("Insecure scheme: HTTPS required")\n    return url\n\ntry:\n    require_https("http://api.site.uz")\nexcept ValueError as e:\n    print("Blocked:", e)`, `Blocked: Insecure scheme: HTTPS required`, 'Tashqi API va webhook manzillarida faqat `https://` qabul qilinishi kerak.', 'Reject plain `http://` endpoints for sensitive API calls and webhooks.'),
    ],
    traceTitleUz: 'TLS Handshake va sessiya izi',
    traceTitleEn: 'Tracing Hybrid TLS Handshake',
    traceCode: `# ClientHello -> Server Certificate (CA verified) -> Shared Session Key -> Encrypted HTTP`,
    traceSteps: [
      traceStep(1, 'ClientHello + ServerCert', 'Verify CA signature', 'Sertifikat haqiqiyligi tekshirildi', 'Verified CA chain'),
      traceStep(2, 'Key Exchange (ECDH)', 'ephemeral session key', 'Umumiy sessiya kaliti yaratildi', 'Derived symmetric session key'),
      traceStep(3, 'Encrypted HTTP', 'AES-GCM / ChaCha20', 'Barcha HTTP sarlavha va body shifrlandi', 'Encrypted HTTP stream'),
    ],
    commonMistakes: [
      mistake('SSL xatosini yechish uchun `verify=False` yozib qo‘yish', 'Silencing Cert Errors with verify=False', `# requests.get("https://...", verify=False) disables MITM protection completely!`, 'Accepts spoofed attacker certificates', `print("Fix local CA bundle or certifi instead of setting verify=False!")`, '`verify=False` sertifikat tekshiruvini o‘chirib har qanday hujumchini "haqiqiy server" deb qabul qiladi.', 'Disabling verification lets any MITM attacker intercept traffic.', 'Hech qachon `verify=False` qoldirmang — CA bundle ni yangilang.', 'Keep certificate verification enabled.'),
      mistake('URL manzilidan `https://` o‘rniga `http://` da token yuborish', 'Sending Bearer Tokens Over Plain http://', `# Sending Authorization: Bearer secret over http:// leaks the token in plain text!`, 'Credential theft on public Wi-Fi', `print("Enforce https:// and HSTS for all authenticated endpoints!")`, 'Ochiq `http://` da yuborilgan cookie va Bearer tokenlar shifrlanmaydi.', 'Plain `http://` transmits auth headers in cleartext.', 'Faqat `https://` ishlating.', 'Enforce `https://`.'),
    ],
    compareTitleUz: 'Asymmetric vs Symmetric Encryption (TLS da)',
    compareTitleEn: 'Asymmetric vs Symmetric in TLS',
    compareUz: ['Asymmetric (RSA/ECDSA/ECDH): kalit almashish va sertifikat imzosini tekshirish uchun (sekinroq).', 'Symmetric (AES-GCM/ChaCha20): asosiy HTTP ma’lumotlarini shifrlash uchun (juda tez).'],
    compareEn: ['Asymmetric: used during the TLS handshake for authentication and key agreement.', 'Symmetric: used after the handshake to encrypt bulk HTTP traffic at wire speed.'],
    compareSummaryUz: 'HTTPS shifrlash + butunlik + sertifikat tasdig‘ini beradi; doim `https://` ishlating va `verify=False` dan saqlaning.',
    compareSummaryEn: 'HTTPS provides confidentiality, integrity, and identity via hybrid TLS—always enforce `https://` and never disable verification.',
    practiceTasks: [
      pt('p1303_1', '1-mashq: `https://` sxema tekshiruvi', 'Task 1: Enforce HTTPS URL', 'URL `https://` bilan boshlanmasa `ValueError` ko‘taring.', 'Reject non-HTTPS URLs.', `def check(u: str):\n    if not u.startswith("https://"): raise ValueError("https only")\n    return "ok"\nprint(check("https://a.uz"))`, 'ok', 'u.startswith("https://")', 'Prints ok.'),
      pt('p1303_2', '2-mashq: `hmac.compare_digest` butunlik', 'Task 2: Constant-Time Digest Verify', 'O‘zgarmagan va o‘zgartirilgan xabarni `hmac.compare_digest` bilan tekshiring.', 'Verify HMAC integrity.', `import hmac, hashlib\nk = b"k"\nt = hmac.new(k, b"hi", hashlib.sha256).digest()\nprint(hmac.compare_digest(t, hmac.new(k, b"hi", hashlib.sha256).digest()))`, 'True', 'hmac.compare_digest', 'Prints True.'),
      pt('p1303_3', '3-mashq: HSTS sarlavhasini tekshirish', 'Task 3: Verify HSTS Header', 'Lug‘atda `"strict-transport-security"` (case-insensitive) borligini tekshiring.', 'Check HSTS header.', `hdrs = {"Strict-Transport-Security": "max-age=31536000"}\nprint(any(k.lower() == "strict-transport-security" for k in hdrs))`, 'True', 'Compare k.lower()', 'Prints True.'),
      pt('p1303_4', '4-mashq: `http://` -> `https://` redirect', 'Task 4: Upgrade HTTP URL', '`http://` prefiksini `https://` ga almashtiring.', 'Upgrade URL scheme.', `u = "http://site.uz/api"\nprint("https://" + u[7:] if u.startswith("http://") else u)`, 'https://site.uz/api', 'Replace leading http://', 'Prints https://site.uz/api.'),
      pt('p1303_5', '5-mashq: Sertifikat muddati tekshiruvi', 'Task 5: Cert Expiry Check', '2026-12-31 muddatli sertifikat 2026-11-20 da yaroqliligini solishtiring.', 'Compare ISO dates.', `print("2026-11-20" < "2026-12-31")`, 'True', 'ISO-8601 string compare', 'Prints True.'),
    ],
    quiz: [
      q('q1303_1', 'HTTPS ning oddiy HTTP dan tashqari taʼminlaydigan 3 ta asosiy kafolati?', 'Three core guarantees added by HTTPS (TLS)?', ['Tezlik, HTML, CSS', 'Encryption (Maxfiylik), Integrity (Butunlik), Authentication (Sertifikat)', 'SQL, JSON, XML', 'Caching, Cookies, DNS'], ['Speed, HTML, CSS', 'Encryption, Integrity, and Certificate Authentication', 'SQL, JSON, XML', 'Caching, Cookies, DNS'], 1, 'Encryption, Integrity va Authentication.', 'Encryption, Integrity, Authentication.'),
      q('q1303_2', 'Nima uchun Python da `verify=False` bilan HTTPS so‘rov yuborish xavfli?', 'Why is setting `verify=False` on an HTTPS client dangerous?', ['Tezlikni pasaytiradi', 'Sertifikat tekshirilmaydi va Man-in-the-Middle (MITM) hujumiga yo‘l ochiladi', 'JSON buziladi', 'Port o‘zgaradi'], ['Slower', 'Disables certificate validation, allowing Man-in-the-Middle attacks', 'Breaks JSON', 'Changes port'], 1, 'MITM hujumiga ochiq qoladi.', 'Exposes traffic to MITM.'),
      q('q1303_3', 'TLS Handshake dan so‘ng asosiy ma’lumotlarni tez shifrlash uchun qaysi turdagi kriptografiya ishlatiladi?', 'Which cipher type encrypts bulk HTTP data fast after the TLS handshake?', ['Asymmetric RSA', 'Symmetric (AES-GCM / ChaCha20)', 'Base64', 'MD5'], ['Asymmetric RSA', 'Symmetric (AES-GCM / ChaCha20)', 'Base64', 'MD5'], 1, 'Tezkor Symmetric shifrlash (AES-GCM / ChaCha20).', 'Symmetric ciphers.'),
      q('q1303_4', 'Brauzerga saytga faqat HTTPS orqali ulanishni majburlovchi javob sarlavhasi?', 'HTTP response header telling browsers to enforce HTTPS?', ['Content-Type', 'Strict-Transport-Security (HSTS)', 'Accept-Encoding', 'ETag'], ['Content-Type', 'Strict-Transport-Security (HSTS)', 'Accept-Encoding', 'ETag'], 1, 'HSTS (`Strict-Transport-Security`).', 'HSTS.'),
      q('q1303_5', 'Sertifikat haqiqiyligini kim tasdiqlab imzolaydi?', 'Who issues and signs trusted TLS server certificates?', ['DNS server', 'CA (Certificate Authority)', 'SQLite', 'Client browser'], ['DNS', 'Certificate Authority (CA)', 'SQLite', 'Client browser'], 1, 'Certificate Authority (CA).', 'Certificate Authority (CA).'),
    ],
    homework: hw('HTTPS Security Auditor Helper', 'TLS & Header Security Validator', 'Berilgan API URL va response headers lug‘atini tekshirib `https://` sxemasi, `Strict-Transport-Security`, `X-Content-Type-Options` borligini tekshiruvchi `audit_endpoint(url, headers)` funksiyasini yozing.', 'Write `audit_endpoint(url, headers)` returning security warnings if `https://` or essential headers (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`) are missing.', ['Case-insensitive header tekshiruvi', 'Barcha xavfsizlik holatlarida assertlar'], ['Case-insensitive header checks', 'Assert passing and failing cases'], 'Normalize header keys via {k.lower(): v for k, v in headers.items()}.', 'Lowercase header keys.', 'HMAC imzo tekshiruvini ham integratsiya qiling.', 'Add HMAC webhook verification.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-04',
    courseId: 'http_apis',
    moduleId: 'c13_m2',
    order: 4,
    titleUz: 'HTTP Request va Response Tuzilishi (Headers, Query Params va Body)',
    titleEn: 'HTTP Anatomy: Start Line, Headers, Query Params & Body',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-13-03'],
    conceptId: 'net_http_anatomy',
    whyUz: "Brauzer yoki `requests`/`FastAPI` orqali yuboriladigan har bir HTTP xabar oddiy matnli tuzilmaga ega: **Start Line** (`GET /items?page=2 HTTP/1.1`), **Headers** (`Content-Type`, `Authorization`), bo‘sh qator (`\\r\\n`) va ixtiyoriy **Body** (`JSON`). Buni bilish API xatolarini darhol tushunish imkonini beradi!",
    whyEn: 'Break down raw HTTP/1.1 Request and Response structure—start lines, case-insensitive headers, URL query/path separation, and Content-Type body serialization.',
    analogyUz: "**HTTP Request** — bu rasmiy xat: **Konvert usti** = Method + Path + Query (`GET /search?q=python`); **Yorliqlar** = Headers (`Accept: application/json`); **Ichidagi maktub** = Body (`{\"name\": \"Ali\"}`)!",
    analogyEn: 'An HTTP message pairs a request/status line, case-insensitive header metadata, a blank line separator, and an optional body payload.',
    stopsUz: "2 ta muhim qoida: 1) HTTP header nomlari **case-insensitive** (`Content-Type` == `content-type`) — doim `.lower()` bilan tekshiring! 2) **`GET` so‘rovlariga Body qo‘ymang** (ko‘p proksi va serverlar tashlab yuboradi) — parametrlarni query string `?page=2&limit=10` ga yozing, maxfiy tokenlarni esa URL ga emas **Header** ga qo‘ying!",
    stopsEn: 'HTTP header names are case-insensitive—normalize keys when parsing. Never send request bodies in `GET` requests, and never put passwords/API keys inside URL query strings (they leak into server logs!).',
    objUz: ['HTTP Request (Method, Target, Version, Headers, Body) va Response (Status, Headers, Body) qismlarini o‘qish', 'Path params (`/users/42`) vs Query params (`?sort=desc`) vs JSON Body farqini bilish', 'HTTP header nomlarining case-insensitive ekanini va URL da maxfiy kalit yubormaslikni bilish'],
    objEn: ['Parse raw HTTP start lines, headers, and bodies', 'Choose properly between path parameters, query parameters, and request bodies', 'Normalize case-insensitive headers and keep secrets out of URLs'],
    theoryUz: `### 1. HTTP Request Tuzilishi
\`\`\`http
POST /api/orders HTTP/1.1
Host: api.shop.uz
Content-Type: application/json
Authorization: Bearer tok_123

{"sku": "PY-BOOK", "qty": 2}
\`\`\`
### 2. HTTP Response Tuzilishi
\`\`\`http
HTTP/1.1 201 Created
Content-Type: application/json

{"order_id": 101}
\`\`\`
### 3. Path vs Query vs Body vs Headers
- **Path (\`/users/42\`)**: aniq resursni identifikatsiya qilish.
- **Query (\`?page=2&sort=asc\`)**: filtrlash, saralash, pagination.
- **Body**: yangi/yangilanayotgan ma’lumot (\`POST\`/\`PUT\`/\`PATCH\`).
- **Headers**: \`Content-Type\`, \`Accept\`, \`Authorization\`.
### 4. URL Encoding & Secrets
Bo‘shliq/maxsus belgilar \`%20\` ga kodlanadi; parol/token ASLO URL query da yuborilmaydi (server loglariga tushib qoladi!).`,
    theoryEn: `### 1. Request Message Anatomy
Start line (\`METHOD /path?query HTTP/1.1\`), case-insensitive headers, blank \`\\r\\n\` line, optional body.
### 2. Response Message Anatomy
Status line (\`HTTP/1.1 200 OK\`), response headers (\`Content-Type\`), blank line, optional payload.
### 3. Parameter Placement
Path for resource IDs, Query for filtering/pagination, Body for payloads, Headers for auth & content negotiation.
### 4. Security Hygiene
Never place tokens or passwords in URL query strings—access logs record URLs in plaintext.`,
    examples: [
      ex('Misol 1: Xom HTTP Request matnini parse qilish', 'Example 1: Parsing Raw HTTP Request Text', `import json\n\nraw = "POST /items?env=prod HTTP/1.1\\r\\nHost: api.uz\\r\\nContent-Type: application/json\\r\\n\\r\\n{\\"qty\\": 3}"\nhead, body = raw.split("\\r\\n\\r\\n", 1)\nlines = head.split("\\r\\n")\nmethod, target, version = lines[0].split()\nhdrs = {k.strip().lower(): v.strip() for k, v in (ln.split(":", 1) for ln in lines[1:])}\nprint(method, target, hdrs["content-type"], json.loads(body))`, `POST /items?env=prod application/json {'qty': 3}`, '`\\r\\n\\r\\n` sarlavhalar va body ni ajratadi; sarlavha kalitlari `.lower()` qilindi.', 'Splits headers from the JSON body cleanly while normalizing header keys to lowercase.'),
      ex('Misol 2: Query String parser (`?a=1&b=2`)', 'Example 2: Pure-Python Query String Parser', `def parse_query(qs: str) -> dict[str, str]:\n    if not qs: return {}\n    return dict(part.split("=", 1) for part in qs.lstrip("?").split("&") if "=" in part)\n\nprint(parse_query("?page=2&sort=desc"))`, `{'page': '2', 'sort': 'desc'}`, 'Query parametrlari `?` dan keyin `&` bilan ajraladi.', 'Query parameters encode key-value filters after `?`.'),
      ex('Misol 3: HTTP Response Builder', 'Example 3: Formatting Valid HTTP Response', `import json\n\ndef http_json(status: int, reason: str, data: dict) -> str:\n    body = json.dumps(data)\n    return f"HTTP/1.1 {status} {reason}\\r\\nContent-Type: application/json\\r\\nContent-Length: {len(body.encode())}\\r\\n\\r\\n{body}"\n\nresp = http_json(201, "Created", {"id": 7})\nprint(resp.splitlines()[0], "|", resp.splitlines()[-1])`, `HTTP/1.1 201 Created | {"id": 7}`, '`Content-Length` bayt uzunligini (`len(body.encode())`) aniq ko‘rsatadi.', '`Content-Length` measures UTF-8 byte length accurately.'),
    ],
    traceTitleUz: 'HTTP xabarni ajratish izi',
    traceTitleEn: 'Tracing HTTP Parse',
    traceCode: `head, body = raw.split("\\r\\n\\r\\n", 1)`,
    traceSteps: [
      traceStep(1, 'Split on \\r\\n\\r\\n', 'head | body', 'Bo‘sh qator body ni ajratdi', 'Separated header block and body'),
      traceStep(2, 'lines[0].split()', 'POST /items HTTP/1.1', 'Start line ajratildi', 'Parsed start line'),
      traceStep(3, 'json.loads(body)', "{'qty': 3}", 'Body JSON ga o‘girildi', 'Parsed JSON body'),
    ],
    commonMistakes: [
      mistake('Header kalitlarini katta-kichik harfga qarab aniq solishtirish (`hdrs["Content-Type"]`)', 'Case-Sensitive Header Lookup', `hdrs = {"content-type": "application/json"}\nprint("Case-sensitive lookup fails:", hdrs.get("Content-Type"))`, 'Returns None even though header exists!', `norm = {k.lower(): v for k, v in hdrs.items()}\nprint("Normalized lookup:", norm.get("content-type"))`, 'HTTP/2 barcha headerlarni kichik harfda yuboradi — doim `.lower()` qiling!', 'HTTP/2 lowercases header names automatically—case-sensitive lookups fail.', 'Header kalitlarini `.lower()` qilib o‘qing.', 'Lowercase header keys before lookup.'),
      mistake('API kaliti yoki parolni URL query `?api_key=secret` da yuborish', 'Leaking Secrets in URL Query Strings', `# https://api.uz/data?api_key=SECRET gets logged in Nginx logs, proxies, and browser history!`, 'Exposed secret in plain logs', `print("Send API keys in Authorization / X-API-Key HTTP headers over HTTPS!")`, 'URL lar barcha proksi va access loglarga yoziladi.', 'URLs are logged in server access logs and browser history.', 'Tokenlarni `Authorization` sarlavhasida yuboring.', 'Place tokens in HTTP headers.'),
    ],
    compareTitleUz: 'Query Params vs Path Params vs Body',
    compareTitleEn: 'Query vs Path vs Body',
    compareUz: ['Path (`/users/42`): majburiy resurs identifikatori.', 'Query (`?page=2&q=py`): ixtiyoriy filtr, qidiruv, tartiblash.', 'Body (`{"name": ...}`): katta JSON ma’lumot yaratish/yangilash (`POST`/`PUT`/`PATCH`).'],
    compareEn: ['Path: identifies specific resource.', 'Query: filters, sorts, paginates.', 'Body: structured create/update payloads.'],
    compareSummaryUz: 'HTTP xabar tuzilishini, `.lower()` sarlavha qoidasini va URL query da sir saqlamaslikni doim yodda tuting.',
    compareSummaryEn: 'Normalize HTTP headers case-insensitively, separate path/query/body cleanly, and keep secrets out of URLs.',
    practiceTasks: [
      pt('p1304_1', '1-mashq: Start Line ajratish', 'Task 1: Parse Start Line', '`"GET /users/5 HTTP/1.1"` dan method, path va version ni ajrating.', 'Split start line.', `m, p, v = "GET /users/5 HTTP/1.1".split()\nprint(m, p, v)`, 'GET /users/5 HTTP/1.1', '.split()', 'Prints 3 parts.'),
      pt('p1304_2', '2-mashq: Case-insensitive Headerlar', 'Task 2: Normalize Headers', '`["Host: a.uz", "CONTENT-TYPE: text/plain"]` dan kichik harfli lug‘at tuzing.', 'Lowercase header keys.', `lines = ["Host: a.uz", "CONTENT-TYPE: text/plain"]\nh = {k.strip().lower(): v.strip() for k, v in (l.split(":", 1) for l in lines)}\nprint(h["content-type"])`, 'text/plain', 'k.strip().lower()', 'Prints text/plain.'),
      pt('p1304_3', '3-mashq: Path va Query ni ajratish', 'Task 3: Split Path and Query', '`"/search?q=py&limit=5"` ni `path` va `query` ga ajrating.', 'Split on ?.', `path, qs = "/search?q=py&limit=5".split("?", 1)\nprint(path, qs)`, '/search q=py&limit=5', 'split("?", 1)', 'Prints path and query.'),
      pt('p1304_4', '4-mashq: JSON `Content-Length` baytlari', 'Task 4: UTF-8 Byte Content-Length', '`{"hi": "o‘"}` JSON satri bayt uzunligini (`len(...encode())`) chiqaring.', 'Compute UTF-8 Content-Length.', `import json\nb = json.dumps({"msg": "salom"}).encode("utf-8")\nprint(len(b))`, '16', 'len(b)', 'Prints 16.'),
      pt('p1304_5', '5-mashq: `Accept` Content Negotiation', 'Task 5: Check Accept Header', '`Accept` ichida `"application/json"` borligini tekshiring.', 'Check JSON acceptance.', `acc = "text/html, application/json"\nprint("application/json" in acc.lower())`, 'True', 'in acc.lower()', 'Prints True.'),
    ],
    quiz: [
      q('q1304_1', 'HTTP xabarida sarlavhalar (Headers) va Body ni qaysi belgi ajratadi?', 'Delimiter separating HTTP headers from the message body?', ['Bitta vergul', 'Bo‘sh qator (`\\r\\n\\r\\n`)', 'Nuqtali vergul', '---'], ['Single comma', 'An empty line (`\\r\\n\\r\\n`)', 'Semicolon', '---'], 1, 'Bo‘sh qator (`\\r\\n\\r\\n`).', 'Empty line `\\r\\n\\r\\n`.'),
      q('q1304_2', 'HTTP Header nomlari (`Content-Type` vs `content-type`) qanday solishtirilishi kerak?', 'Are HTTP header field names case-sensitive or case-insensitive?', ['Case-sensitive', 'Case-insensitive (kichik/katta harf farqsiz)', 'Faqat katta harf', 'Faqat HTTP/1 da'], ['Case-sensitive', 'Case-insensitive', 'Uppercase only', 'HTTP/1 only'], 1, 'Case-insensitive!', 'Case-insensitive.'),
      q('q1304_3', 'API kaliti yoki parolni URL query (`?token=123`) orqali yuborishning zarari?', 'Why must secrets NEVER be sent in URL query parameters?', ['Syntax xato', 'URL lar server/proxy loglarida va brauzer tarixida ochiq saqlanib qoladi', 'Sekin', 'JSON buziladi'], ['Syntax error', 'URLs are logged in plaintext by proxies, servers, and browser history', 'Slow', 'Breaks JSON'], 1, 'Loglarda va brauzer tarixida ochiq saqlanadi.', 'Logged in plaintext.'),
      q('q1304_4', 'Pagination va filtrlash parametrlari (`?page=2&limit=20`) qayerga yoziladi?', 'Where do filtering and pagination parameters belong?', ['Path', 'Query string (`?page=2&limit=20`)', 'Status line', 'Cookie'], ['Path', 'Query string', 'Status line', 'Cookie'], 1, 'Query string da.', 'Query string.'),
      q('q1304_5', 'HTTP `Content-Length` sarlavhasi nimani o‘lchaydi?', 'What does the `Content-Length` header measure?', ['Satrdagi belgilar sonini', 'Body ning aniq baytlar (bytes) uzunligini', 'Sarlavhalar sonini', 'Vaqtini'], ['Character count', 'Exact byte length of the HTTP body', 'Header count', 'Latency'], 1, 'Body ning bayt uzunligini.', 'Byte length of body.'),
    ],
    homework: hw('Mini HTTP/1.1 Parser va Builder', 'Raw HTTP Message Parser', 'Xom HTTP Request matnini qabul qilib `method`, `path`, `query` (dict), `headers` (lowercase dict) va `json_body` ni ajratib beruvchi `parse_http_request(raw: str)` funksiyasini yozing.', 'Implement `parse_http_request(raw)` parsing method, path, query dict, case-insensitive headers dict, and optional JSON body.', ['Case-insensitive headerlar', 'GET (bodysiz) va POST (JSON bodyli) testlari'], ['Lowercased header dict', 'Test bodyless GET and JSON POST'], 'Split on \\r\\n\\r\\n, handle empty body safely.', 'Parse cleanly.', 'Noto‘g‘ri HTTP xabarda aniq `ValueError` chiqaring.', 'Validate malformed requests.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-05',
    courseId: 'http_apis',
    moduleId: 'c13_m2',
    order: 5,
    titleUz: 'HTTP Methods (GET, POST, PUT, PATCH, DELETE) va Idempotency (+ Review #28)',
    titleEn: 'HTTP Methods, Safety & Idempotency (+ Review #28)',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-13-04'],
    conceptId: 'net_http_methods',
    whyUz: "Agar to‘lov tizimingiz `GET /pay?amount=100` bo‘lsa, brauzer oldindan yuklashi (prefetch) yoki search botlar foydalanuvchi pulini yechib yuborishi mumkin! Va agar tarmoq uzilganda retry qilinsa, **`POST`** ikkita buyurtma ochadi, **`PUT`** esa **Idempotent** bo‘lib bitta natija qoldiradi!",
    whyEn: 'Master HTTP method semantics (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), Safe vs Idempotent guarantees, and why retries + `Idempotency-Key` matter in distributed systems.',
    analogyUz: "**Safe (`GET`)** — muzey oynasidan qarash (hech narsani o‘zgartirmaydi). **Idempotent (`PUT`, `DELETE`)** — lift tugmasini 5 marta bossangiz ham natija bitta (3-qavatga chiqish). **Non-Idempotent (`POST`)** — \"hisobdan $10 yech\" tugmasi: 5 marta bossangiz 5 marta pul ketadi!",
    analogyEn: 'Safe methods never mutate state (`GET`); Idempotent methods produce the same server state if repeated (`PUT`, `DELETE`); `POST` creates a new effect each time.',
    stopsUz: "1) **`GET` hech qachon ma’lumotni o‘zgartirmasin (Safe)**! 2) **`PUT` vs `PATCH`**: `PUT` butun resursni to‘liq almashtiradi (idempotent), `PATCH` esa faqat ko‘rsatilgan maydonlarni qisman yangilaydi! 3) To‘lov `POST` so‘rovlarida qayta urinish (retry) ikki marta yechmasligi uchun **`Idempotency-Key`** sarlavhasi ishlatiladi.",
    stopsEn: 'Never mutate server state in `GET` handlers. Use `PUT` for full replacement (idempotent) and `PATCH` for partial updates. Protect non-idempotent `POST` operations like payments with an `Idempotency-Key` header.',
    objUz: ['`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` vazifalarini aniq bilish', '**Safe** (`GET`, `HEAD`) vs **Idempotent** (`GET`, `PUT`, `DELETE`) jadvalini qo‘llash', 'Retry xavfsizligi uchun `Idempotency-Key` mexanizmini Python da yozish'],
    objEn: ['Distinguish `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` semantics', 'Classify methods by Safe and Idempotent guarantees', 'Implement an `Idempotency-Key` deduplication guard for `POST` retries'],
    theoryUz: `### 1. 5 Asosiy HTTP Metod
- **GET**: o‘qish (Safe + Idempotent).
- **POST**: yangi resurs yaratish / amal bajarish (Unsafe, **Not Idempotent**).
- **PUT**: resursni **to‘liq** almashtirish (Unsafe, **Idempotent**).
- **PATCH**: resursni **qisman** yangilash (masalan faqat \`email\`).
- **DELETE**: o‘chirish (Unsafe, **Idempotent**).
### 2. Idempotency Nima Uchun Muhim?
Tarmoq uzilganda mijoz so‘rovni qayta yuboradi (retry). \`PUT\`/\`DELETE\` xavfsiz takrorlanadi; \`POST\` esa ikkita dublikat yaratmasligi uchun \`Idempotency-Key: uuid\` bilan keshlanadi!
### 3. \`PUT\` vs \`PATCH\`
\`PUT /users/1 {"name": "Ali"}\` — boshqa maydonlarni o‘chirishi/default qilishi kerak; \`PATCH /users/1 {"name": "Ali"}\` — faqat \`name\` ni yangilaydi!`,
    theoryEn: `### 1. Core HTTP Methods
\`GET\` (read), \`POST\` (create/action), \`PUT\` (full replace), \`PATCH\` (partial update), \`DELETE\` (remove).
### 2. Safe vs Idempotent Matrix
- **Safe & Idempotent**: \`GET\`, \`HEAD\`, \`OPTIONS\`.
- **Unsafe & Idempotent**: \`PUT\`, \`DELETE\`.
- **Unsafe & Non-Idempotent**: \`POST\` (protect retries with \`Idempotency-Key\`).
### 3. \`PUT\` vs \`PATCH\`
\`PUT\` replaces the entire resource representation; \`PATCH\` modifies only provided fields.`,
    examples: [
      ex('Misol 1: `PUT` (to‘liq) vs `PATCH` (qisman) + `DELETE` (idempotent)', 'Example 1: PUT vs PATCH vs Idempotent DELETE', `store = {1: {"name": "Ali", "role": "student"}}\n\n# PATCH updates only supplied fields:\nstore[1].update({"role": "mentor"})\nprint("after PATCH:", store[1])\n\n# PUT replaces entire resource:\nstore[1] = {"name": "Ali", "role": "admin"}\nprint("after PUT:", store[1])\n\n# DELETE idempotency (second call leaves store identical):\nstore.pop(1, None)\nstore.pop(1, None)\nprint("after 2x DELETE:", store)`, `after PATCH: {'name': 'Ali', 'role': 'mentor'}\nafter PUT: {'name': 'Ali', 'role': 'admin'}\nafter 2x DELETE: {}`, '`PATCH` qisman maydonni yangiladi, `PUT` butun obyektni almashtirdi, `DELETE` 2 marta chaqirilsa ham natija o‘zgarmadi.', 'Demonstrates partial `PATCH`, full replacement `PUT`, and idempotent `DELETE`.'),
      ex('Misol 2: `POST` da `Idempotency-Key` himoyasi', 'Example 2: Idempotency-Key for Safe POST Retries', `seen_keys: dict[str, dict] = {}\norders: list[dict] = []\n\ndef create_order(idem_key: str, item: str) -> dict:\n    if idem_key in seen_keys:\n        return seen_keys[idem_key]\n    order = {"id": len(orders) + 1, "item": item}\n    orders.append(order)\n    seen_keys[idem_key] = order\n    return order\n\no1 = create_order("req-99", "Book")\no2 = create_order("req-99", "Book")  # Network retry!\nprint("same order?", o1 == o2, "| total created:", len(orders))`, `same order? True | total created: 1`, 'Tarmoq uzilib qayta yuborilgan `POST` bitta kalit tufayli 2 marta buyurtma yaratmadi.', 'Caching by `Idempotency-Key` guarantees retries return the original response without duplicating orders.'),
      ex('Misol 3: Safe & Idempotent Jadval Tekshiruvi', 'Example 3: Safe & Idempotent Matrix', `SPECS = {\n    "GET": (True, True), "POST": (False, False),\n    "PUT": (False, True), "DELETE": (False, True),\n}\nfor m, (safe, idem) in SPECS.items():\n    print(f"{m:6} safe={safe!s:5} idempotent={idem}")`, `GET    safe=True  idempotent=True\nPOST   safe=False idempotent=False\nPUT    safe=False idempotent=True\nDELETE safe=False idempotent=True`, 'Har bir HTTP metodining rasmiy RFC kafolatlari.', 'Standard RFC 9110 safety and idempotency guarantees.'),
    ],
    traceTitleUz: 'Idempotency-Key retry izi',
    traceTitleEn: 'Tracing Idempotent Retry',
    traceCode: `create_order("k1", "Pen") # creates id=1\ncreate_order("k1", "Pen") # returns cached id=1`,
    traceSteps: [
      traceStep(1, '1st POST (k1)', 'not in seen_keys', 'Yangi buyurtma id=1 yaratildi', 'Created order #1'),
      traceStep(2, 'Retry POST (k1)', 'found in seen_keys', 'Keshdan id=1 qaytarildi', 'Returned cached #1'),
    ],
    commonMistakes: [
      mistake('Ma’lumotni o‘zgartiradigan yoki o‘chiradigan amalni `GET` ga qo‘yish', 'Mutating Server State Inside a GET Endpoint', `# GET /delete_user?id=5 can be triggered accidentally by link prefetchers or crawlers!`, 'Accidental data deletion on page load', `print("Reserve GET strictly for Safe read-only queries; use POST/DELETE for mutations!")`, '`GET` so‘rovlari keshlanadi, prefetch qilinadi va CSRF ga juda zaif.', 'Crawlers and browser preloaders follow `GET` links automatically.', 'O‘zgartirish uchun faqat `POST`/`PUT`/`PATCH`/`DELETE` ishlating.', 'Keep `GET` strictly read-only.'),
      mistake('Qisman yangilash uchun `PUT` ishlatib qolgan maydonlarni o‘chirib yuborish', 'Using PUT for Partial Updates', `# PUT {"email": "new@x.uz"} without 'name' replaces the whole record and wipes 'name'!`, 'Data loss on omitted fields', `print("Use PATCH for partial field updates, PUT for full resource replacement!")`, '`PUT` to‘liq almashtirish degani.', '`PUT` means full replacement by HTTP spec.', 'Qisman tahrirda `PATCH` ishlating.', 'Use `PATCH` for partial updates.'),
    ],
    compareTitleUz: '`POST` vs `PUT` vs `PATCH`',
    compareTitleEn: '`POST` vs `PUT` vs `PATCH`',
    compareUz: ['`POST`: yangi resurs yaratish (ID ni server beradi), idempotent emas.', '`PUT`: aniq URL dagi (`/items/5`) resursni to‘liq almashtirish, idempotent.', '`PATCH`: aniq resursning faqat yuborilgan maydonlarini yangilash.'],
    compareEn: ['`POST`: server assigns new resource ID; non-idempotent.', '`PUT`: full replacement at target URI; idempotent.', '`PATCH`: partial field update at target URI.'],
    compareSummaryUz: '`GET` ni faqat o‘qishga, `PUT`/`PATCH`/`DELETE` ni idempotent yangilashga, `POST` da esa `Idempotency-Key` himoyasiga tayaning.',
    compareSummaryEn: 'Keep `GET` safe, distinguish `PUT` (full) vs `PATCH` (partial), and guard `POST` retries with `Idempotency-Key`.',
    practiceTasks: [
      pt('p1305_1', '1-mashq: `Idempotency-Key` himoyasi', 'Task 1: Idempotent POST', 'Bir xil `"key-1"` bilan 2 marta chaqirilganda faqat 1 ta yozuv qo‘shilsin.', 'Deduplicate by Idempotency-Key.', `cache, db = {}, []\ndef post(k, v):\n    if k not in cache: db.append(v); cache[k] = len(db)\n    return cache[k]\nprint(post("k1", "A"), post("k1", "A"), len(db))`, '1 1 1', 'Check k in cache', 'Prints 1 1 1.'),
      pt('p1305_2', '2-mashq: `PATCH` qisman yangilash', 'Task 2: Partial PATCH', '`{"a": 1, "b": 2}` ga `{"b": 9}` PATCH qiling.', 'Patch dict partially.', `rec = {"a": 1, "b": 2}\npatch = {"b": 9}\nrec.update(patch)\nprint(rec)`, "{'a': 1, 'b': 9}", 'rec.update(patch)', "Prints {'a': 1, 'b': 9}."),
      pt('p1305_3', '3-mashq: `PUT` to‘liq almashtirish', 'Task 3: Full PUT Replace', '`{"a": 1, "b": 2}` ni `PUT {"a": 5}` bilan to‘liq almashtiring.', 'Replace dict cleanly.', `store = {1: {"a": 1, "b": 2}}\nstore[1] = {"a": 5}\nprint(store[1])`, "{'a': 5}", 'Full assignment', "Prints {'a': 5}."),
      pt('p1305_4', '4-mashq: `GET` metodini tekshirish', 'Task 4: Enforce Safe GET', '`GET` dan tashqari metodlarda `allowed` False chiqaring.', 'Check safe methods.', `def is_safe(m): return m in {"GET", "HEAD", "OPTIONS"}\nprint(is_safe("GET"), is_safe("POST"))`, 'True False', 'GET, HEAD, OPTIONS', 'Prints True False.'),
      pt('p1305_5', '5-mashq: Idempotent `DELETE`', 'Task 5: Idempotent Delete', '3 marta `DELETE` dan keyin lug‘at bo‘sh va xatosiz bo‘lsin.', 'Delete idempotently.', `d = {10: "x"}\nfor _ in range(3): d.pop(10, None)\nprint(d)`, '{}', 'd.pop(10, None)', 'Prints {}.'),
    ],
    quiz: [
      q('q1305_1', 'Qaysi HTTP metodi Safe ham, Idempotent ham EMAS?', 'Which HTTP method is neither Safe nor Idempotent?', ['GET', 'PUT', 'POST', 'DELETE'], ['GET', 'PUT', 'POST', 'DELETE'], 2, '`POST`.', '`POST`.'),
      q('q1305_2', 'Foydalanuvchi profilining faqat `phone` maydonini yangilash uchun eng to‘g‘ri metod?', 'Best HTTP method to update only the `phone` field of a user profile?', ['GET', 'POST', 'PATCH', 'HEAD'], ['GET', 'POST', 'PATCH', 'HEAD'], 2, '`PATCH`.', '`PATCH`.'),
      q('q1305_3', 'Idempotent metod nimani kafolatlaydi?', 'What does an idempotent HTTP method guarantee?', ['Har doim 200 qaytaradi', 'Aynan bir xil so‘rovni N marta qayta yuborish server holatini 1 martanikidan boshqacha qilmaydi', 'Shifrlangan bo‘ladi', 'Hech qachon DB ga yozmaydi'], ['Always 200', 'Repeating the identical request produces the same server state as sending it once', 'Encrypted', 'Read-only'], 1, 'Takrorlash server holatini qo‘shimcha o‘zgartirmaydi.', 'Repeated calls have the same side effect as one.'),
      q('q1305_4', 'To‘lov `POST` so‘rovi tarmoq xatosidan qayta yuborilganda ikki marta yechilishini oldini oluvchi sarlavha?', 'Header protecting retried `POST` requests against duplicate charges?', ['Cache-Control', 'Idempotency-Key', 'Accept', 'User-Agent'], ['Cache-Control', 'Idempotency-Key', 'Accept', 'User-Agent'], 1, '`Idempotency-Key`.', '`Idempotency-Key`.'),
      q('q1305_5', 'Nima uchun ma’lumot o‘chiradigan endpoint ni `GET /users/5/delete` qilib yasash taqiqlanadi?', 'Why must `GET /users/5/delete` never be used to delete data?', ['URL uzun', 'Brauzer prefetch, crawler va link tekshiruvchilar `GET` ni avtomatik chaqirib yuboradi', 'JSON ishlamaydi', 'HTTPS ruxsat bermaydi'], ['URL too long', 'Crawlers and browser preloaders trigger `GET` links automatically', 'No JSON', 'HTTPS forbids'], 1, '`GET` Safe (faqat o‘qish) bo‘lishi shart.', '`GET` must remain side-effect free.'),
    ],
    homework: hw('HTTP Method Router & Idempotency Store', 'Idempotent Mini HTTP Dispatcher', 'SQLite yoki dict ustida `GET`, `POST` (`Idempotency-Key` bilan!), `PUT`, `PATCH`, `DELETE` metodlarini bajaradigan mini router yozing.', 'Build a mini HTTP request dispatcher handling `GET`, `POST` (with `Idempotency-Key` caching), `PUT`, `PATCH`, and `DELETE` over an in-memory resource map.', ['5 ta HTTP metodning barchasi', 'POST retry Idempotency-Key testi'], ['All 5 HTTP methods', 'Verify retry deduplication'], 'Store seen keys in a dict keyed by (method, path, idem_key).', 'Cache POST responses.', '`OPTIONS` so‘rovi uchun ruxsat etilgan metodlarni qaytaring.', 'Return `Allow` methods for `OPTIONS`.', 25),
    reviewCheckpoint: review(
      28,
      'Review Loyiha #28: DNS/TLS + HTTP Request Parser & Idempotent Router (140-dars Marrasi!)',
      'Review Project #28: Secure HTTP Parser & Idempotent Dispatcher (140th Lesson!)',
      '140-dars marrasi! `https://` tekshiruvi, xom HTTP Request parseri va `Idempotency-Key` himoyali `POST/PATCH/DELETE` marshrutizatorini bitta modulda birlashtiring.',
      '140-lesson milestone! Combine HTTPS scheme checks, case-insensitive HTTP header parsing, and an idempotent HTTP dispatcher in one cohesive script.',
      ['`https://` + `ipaddress` tekshiruvi', 'Case-insensitive header + JSON body parser', '`Idempotency-Key` bilan xavfsiz `POST` retry'],
      ['HTTPS & IP validation', 'Normalized header & JSON parser', 'Idempotent `POST` retry protection'],
      `import json

idem_cache = {}
items = {}

def dispatch(method: str, path: str, headers: dict, body: str = "") -> tuple[int, dict]:
    h = {k.lower(): v for k, v in headers.items()}
    if method == "POST":
        key = h.get("idempotency-key")
        if key and key in idem_cache:
            return idem_cache[key]
        data = json.loads(body)
        new_id = len(items) + 1
        items[new_id] = data
        res = (201, {"id": new_id, **data})
        if key: idem_cache[key] = res
        return res
    return (405, {"error": "Method not allowed"})

r1 = dispatch("POST", "/orders", {"Idempotency-Key": "abc"}, '{"sku": "PY"}')
r2 = dispatch("POST", "/orders", {"idempotency-key": "abc"}, '{"sku": "PY"}')
print("Retry identical?", r1 == r2, "| count:", len(items))
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-13-06',
    courseId: 'http_apis',
    moduleId: 'c13_m2',
    order: 6,
    titleUz: 'HTTP Status Codes — 2xx, 3xx, 4xx va 5xx Standartlari',
    titleEn: 'HTTP Status Codes: 2xx, 3xx, 4xx & 5xx Contracts',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-13-05'],
    conceptId: 'net_status_codes',
    whyUz: "Har bir xatoda `200 OK {\"error\": \"Not found\"}` qaytarish — bu monitoring tizimlarini, HTTP keshlarini va frontend klientlarni aldab qo‘yadigan eng yomon API odatidir! Python `http.HTTPStatus` bilan **2xx, 3xx, 4xx, 5xx** kodlarini aniq ishlatish toza API shartnomasining yuragi hisoblanadi.",
    whyEn: 'Communicate API outcomes accurately using `http.HTTPStatus` across 2xx success, 3xx redirects, 4xx client errors (401 vs 403, 404, 409, 422, 429), and 5xx server failures.',
    analogyUz: "**HTTP Status Code** — shifoxona tez yordam svetofori: **2xx** (Hammasi joyida), **3xx** (Boshqa eshikka boring), **4xx** (Siz noto‘g‘ri hujjat berdingiz / ruxsatingiz yo‘q — mijoz aybi), **5xx** (Server ichida nosozlik — backend muhandis aybi)!",
    analogyEn: '2xx means success, 3xx means go elsewhere, 4xx means the client sent a bad/unauthorized request, and 5xx means the server broke.',
    stopsUz: "Eng ko‘p adashtiriladigan 3 ta juftlik: 1) **`401 Unauthorized`** = *Siz kimsiz? Token yo‘q/eskirgan (Unauthenticated)* vs **`403 Forbidden`** = *Sizni taniyman, lekin bu admin sahifasiga haqqingiz yo‘q (Unauthorized)*! 2) **`400` / `422`**: sintaksis/sxema xato. 3) **`409 Conflict`**: email allaqachon band! 4) **`429 Too Many Requests`**: rate limit + `Retry-After`!",
    stopsEn: '`401` means unauthenticated (missing/invalid credentials); `403` means authenticated but forbidden from this resource. Use `409` for duplicate conflicts, `422` for schema validation errors, and `429` for rate limits.',
    objUz: ['2xx (`200`, `201`, `204`), 3xx (`301`, `302`, `304`), 4xx (`400`, `401`, `403`, `404`, `409`, `422`, `429`), 5xx (`500`, `502`, `503`, `504`) kodlarini ajratish', '`401` vs `403` va `200` vs `201` vs `204` (`No Content` — body bo‘sh!) farqini qo‘llash', 'Python `from http import HTTPStatus` enumidan foydalanish'],
    objEn: ['Apply 2xx, 3xx, 4xx, and 5xx codes accurately across API endpoints', 'Distinguish `401` vs `403`, `404` vs `409`, and `201` vs `204`', 'Use stdlib `http.HTTPStatus` constants cleanly'],
    theoryUz: `### 1. 5 Ta Status Sinfi
- **1xx**: Informational (\`101 Switching Protocols\` WebSocket).
- **2xx (Muvaffaqiyat)**: \`200 OK\`, \`201 Created\` (+ \`Location\` header), \`204 No Content\` (**body bo‘lmaydi!**, masalan \`DELETE\`).
- **3xx (Yo‘naltirish)**: \`301\` doimiy, \`302\`/\`307\` vaqtinchalik, \`304 Not Modified\` (kesh).
- **4xx (Mijoz xatosi)**: \`400 Bad Request\`, \`401 Unauthorized\` (login qilmagan), \`403 Forbidden\` (huquqi yo‘q), \`404 Not Found\`, \`409 Conflict\` (dublikat), \`422 Unprocessable Entity\` (validatsiya), \`429 Too Many Requests\`.
- **5xx (Server xatosi)**: \`500 Internal Server Error\`, \`502 Bad Gateway\`, \`503 Service Unavailable\`, \`504 Gateway Timeout\`.
### 2. \`from http import HTTPStatus\`
Sehrlangan raqam \`404\` o‘rniga \`HTTPStatus.NOT_FOUND\` yozish kodni o‘qimli qiladi.`,
    theoryEn: `### 1. The Five Status Classes
- **2xx**: \`200 OK\`, \`201 Created\`, \`204 No Content\` (must have an empty body).
- **3xx**: \`301 Moved Permanently\`, \`304 Not Modified\`, \`307 Temporary Redirect\`.
- **4xx**: \`400 Bad Request\`, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`409 Conflict\`, \`422 Unprocessable Content\`, \`429 Too Many Requests\`.
- **5xx**: \`500 Internal Server Error\`, \`502 Bad Gateway\`, \`503 Service Unavailable\`, \`504 Gateway Timeout\`.
### 2. Stdlib \`http.HTTPStatus\`
Readable enum (\`HTTPStatus.CREATED == 201\`) avoiding magic numbers.`,
    examples: [
      ex('Misol 1: `http.HTTPStatus` bilan API javob qaror qabul qilgichi', 'Example 1: Mapping Outcomes with HTTPStatus', `from http import HTTPStatus\n\ndef handle_login(token: str | None, role: str, target_admin: bool) -> int:\n    if not token:\n        return HTTPStatus.UNAUTHORIZED      # 401\n    if target_admin and role != "admin":\n        return HTTPStatus.FORBIDDEN         # 403\n    return HTTPStatus.OK                    # 200\n\nprint(handle_login(None, "user", True), handle_login("t", "user", True), handle_login("t", "admin", True))`, `401 403 200`, 'Token bo‘lmasa `401`, rol yetmasa `403`, hammasi to‘g‘ri bo‘lsa `200` qaytadi.', 'Distinguishes missing credentials (`401`) from insufficient permissions (`403`).'),
      ex('Misol 2: `201 Created`, `204 No Content` va `409 Conflict`', 'Example 2: 201, 204 & 409 Lifecycle', `from http import HTTPStatus\n\nusers = {"ali@uz.dev"}\ndef register(email: str) -> tuple[int, dict | None]:\n    if "@" not in email:\n        return int(HTTPStatus.UNPROCESSABLE_ENTITY), {"error": "Invalid email"}\n    if email in users:\n        return int(HTTPStatus.CONFLICT), {"error": "Email already exists"}\n    users.add(email)\n    return int(HTTPStatus.CREATED), {"email": email}\n\nprint(register("bad"), register("ali@uz.dev"), register("vali@uz.dev"))`, `(422, {'error': 'Invalid email'}) (409, {'error': 'Email already exists'}) (201, {'email': 'vali@uz.dev'})`, 'Validatsiya xatosiga `422`, dublikatga `409`, yangi yaratishga `201` qaytariladi.', 'Returns semantic codes (`422`, `409`, `201`) instead of wrapping errors in `200`.'),
      ex('Misol 3: `HTTPStatus` sinfini tekshirish (retryable 5xx/429)', 'Example 3: Identifying Retryable Status Codes', `from http import HTTPStatus\n\ndef should_retry(code: int) -> bool:\n    return code == HTTPStatus.TOO_MANY_REQUESTS or 500 <= code < 600\n\nprint(should_retry(404), should_retry(429), should_retry(503))`, `False True True`, '`404` yoki `400` ni retry qilish befoyda; `429` va `5xx` larni esa backoff bilan qayta urinish mumkin.', 'Clients retry transient `429`/`5xx` failures, never deterministic `4xx` errors.'),
    ],
    traceTitleUz: 'Status code qaror daraxti izi',
    traceTitleEn: 'Tracing 401 vs 403 vs 409',
    traceCode: `# check auth -> check role -> check duplicate -> 201`,
    traceSteps: [
      traceStep(1, 'no token', '401 Unauthorized', 'Autentifikatsiya yo‘q', 'Unauthenticated'),
      traceStep(2, 'role != admin', '403 Forbidden', 'Ruxsat yetarli emas', 'Forbidden'),
      traceStep(3, 'email exists', '409 Conflict', 'Resurs allaqachon bor', 'Duplicate conflict'),
    ],
    commonMistakes: [
      mistake('Xato paytida ham `200 OK` bilan `{"ok": false}` qaytarish', 'Returning 200 OK for Error Payloads', `# Returning HTTP 200 with {"error": "Not found"} tricks HTTP clients, caches, and monitoring!`, 'Broken HTTP semantics & alerting', `print("Return proper 4xx/5xx status codes so clients and logs detect failures!")`, 'Monitoring vositalari 200 ni muvaffaqiyat deb hisoblaydi.', 'Proxies, caches, and monitoring treat `200` as healthy success.', 'Xatolar uchun mos `4xx`/`5xx` status kodini qaytaring.', 'Return real `4xx`/`5xx` codes.'),
      mistake('`204 No Content` javobiga JSON body qo‘shish', 'Attaching a Response Body to 204 No Content', `# Per HTTP spec, 204 responses MUST NOT include a message body!`, 'Protocol violation / client parse hang', `print("Return empty body with 204 No Content, or return 200 OK with JSON!")`, 'HTTP standarti bo‘yicha `204` javobida tana (body) bo‘lmasligi shart.', 'RFC 9110 forbids a response body on `204 No Content`.', 'Body qaytarmoqchi bo‘lsangiz `200 OK`, bo‘sh qoldirsangiz `204` bering.', 'Omit the body on `204`.'),
    ],
    compareTitleUz: '`401 Unauthorized` vs `403 Forbidden` & `409` vs `422`',
    compareTitleEn: 'Key 4xx Status Pairs',
    compareUz: ['`401` (kim ekaning nomaʼlum / token yo‘q) vs `403` (tanilgan, lekin huquqi yo‘q).', '`409` (biznes holat ziddiyati — dublikat email, stock=0) vs `422` (maydon formati noto‘g‘ri).'],
    compareEn: ['`401` unauthenticated vs `403` forbidden.', '`409` state conflict (duplicate/out-of-stock) vs `422` validation failure.'],
    compareSummaryUz: '`http.HTTPStatus` bilan aniq 2xx/3xx/4xx/5xx kodlarini qaytaring — ayniqsa 401/403, 409/422 va 201/204 farqini saqlang.',
    compareSummaryEn: 'Use `http.HTTPStatus` consistently—keeping `401`/`403`, `409`/`422`, and `201`/`204` semantics crisp.',
    practiceTasks: [
      pt('p1306_1', '1-mashq: `HTTPStatus` enum qiymatlari', 'Task 1: HTTPStatus Codes', '`CREATED`, `NO_CONTENT`, `CONFLICT` raqamlarini chiqaring.', 'Print HTTPStatus integer values.', `from http import HTTPStatus\nprint(int(HTTPStatus.CREATED), int(HTTPStatus.NO_CONTENT), int(HTTPStatus.CONFLICT))`, '201 204 409', 'HTTPStatus enums', 'Prints 201 204 409.'),
      pt('p1306_2', '2-mashq: `401` vs `403` tekshiruvi', 'Task 2: Auth Status Mapper', 'Token bo‘lmasa `401`, rol `"guest"` bo‘lsa `403` qaytaring.', 'Return 401 or 403.', `def check(tok, role):\n    if not tok: return 401\n    if role != "admin": return 403\n    return 200\nprint(check("", "admin"), check("t", "guest"), check("t", "admin"))`, '401 403 200', 'Check token before role', 'Prints 401 403 200.'),
      pt('p1306_3', '3-mashq: `409 Conflict` dublikatda', 'Task 3: Duplicate Email -> 409', 'Mavjud email kelganda `409`, yangisida `201` qaytaring.', 'Return 409 on duplicate.', `db = {"a@b.uz"}\ndef reg(e): return 409 if e in db else 201\nprint(reg("a@b.uz"), reg("c@b.uz"))`, '409 201', '409 if in db', 'Prints 409 201.'),
      pt('p1306_4', '4-mashq: `429` va `5xx` retry filtri', 'Task 4: Filter Retryable Codes', '`[200, 404, 429, 502]` dan qayta urinish mumkin bo‘lganlarini ajrating.', 'Filter 429 and 5xx.', `codes = [200, 404, 429, 502]\nprint([c for c in codes if c == 429 or 500 <= c < 600])`, '[429, 502]', 'c == 429 or 500 <= c < 600', 'Prints [429, 502].'),
      pt('p1306_5', '5-mashq: `HTTPStatus(422).phrase`', 'Task 5: Lookup Status Phrase', '`HTTPStatus(404).phrase` va `HTTPStatus(201).phrase` ni chiqaring.', 'Print status phrases.', `from http import HTTPStatus\nprint(HTTPStatus(404).phrase, "|", HTTPStatus(201).phrase)`, 'Not Found | Created', '.phrase attribute', 'Prints Not Found | Created.'),
    ],
    quiz: [
      q('q1306_1', 'Foydalanuvchi tizimga kirgan (authenticated), lekin admin bo‘limiga ruxsati yo‘q bo‘lsa qaysi status qaytariladi?', 'Status code when an authenticated user lacks permission for an admin endpoint?', ['401 Unauthorized', '403 Forbidden', '404 Not Found', '409 Conflict'], ['401 Unauthorized', '403 Forbidden', '404 Not Found', '409 Conflict'], 1, '`403 Forbidden`.', '`403 Forbidden`.'),
      q('q1306_2', 'Yangi resurs yaratilganda (`POST`) va o‘chirilganda (`DELETE`, bodysiz) mos ravishda qaysi 2xx kodlar ideal?', 'Ideal 2xx status codes for creating a resource (`POST`) and bodyless `DELETE`?', ['200 va 200', '201 Created va 204 No Content', '301 va 404', '202 va 500'], ['200 and 200', '201 Created and 204 No Content', '301 and 404', '202 and 500'], 1, '`201 Created` va `204 No Content`.', '`201` and `204`.'),
      q('q1306_3', 'Ro‘yxatdan o‘tishda allaqachon mavjud email kiritilganda qaysi 4xx status mos?', 'Most accurate status code when registering an already-taken email?', ['400', '409 Conflict', '500', '302'], ['400', '409 Conflict', '500', '302'], 1, '`409 Conflict`.', '`409 Conflict`.'),
      q('q1306_4', 'Rate-limit oshib ketganda qaysi status kodi qaytariladi?', 'Status code returned when a client exceeds rate limits?', ['403', '422', '429 Too Many Requests', '504'], ['403', '422', '429 Too Many Requests', '504'], 2, '`429 Too Many Requests`.', '`429 Too Many Requests`.'),
      q('q1306_5', 'Qaysi status sinfi (4xx vs 5xx) backend server/upstream nosozligini bildiradi?', 'Which status class indicates a server or upstream gateway failure?', ['3xx', '4xx', '5xx', '2xx'], ['3xx', '4xx', '5xx', '2xx'], 2, '`5xx`.', '`5xx`.'),
    ],
    homework: hw('API Status Code Policy Mapper', 'HTTP Status Decision Engine', '`http.HTTPStatus` dan foydalanib, `auth`, `role`, `validation_errors`, `conflict`, `rate_limited`, `deleted` ssenariylarini tegishli HTTP status kodi va RFC error JSON obyekti (`{"code": ..., "message": ...}`) ga aylantiruvchi funksiya yozing.', 'Build a response builder mapping auth, RBAC, validation, conflict, rate-limit, and deletion outcomes to accurate `HTTPStatus` codes and standardized error envelopes.', ['http.HTTPStatus enum ishlatilishi', '204 da body None qaytishi'], ['Use http.HTTPStatus', 'Enforce empty body for 204'], 'Return (HTTPStatus.NO_CONTENT, None) for deletions.', 'Strict HTTP contract.', '429 javobiga `Retry-After` sarlavhasini ham qo‘shing.', 'Add Retry-After header.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),
];
