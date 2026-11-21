import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C01_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-01-01',
    courseId: 'computer_literacy',
    moduleId: 'c01_m1',
    order: 1,
    titleUz: 'Kompyuter va operatsion tizim qanday ishlaydi?',
    titleEn: 'How Computers and Operating Systems Work',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: [],
    conceptId: 'computer_os_basics',
    whyUz: "Dastur yozganingizda Python kodingiz RAM, CPU va disk bilan bevosita ishlaydi. Uskuna qismlarini bilish xotira xatolari va sekinlik sabablarini tez tushunishga yordam beradi.",
    whyEn: 'Every Python script relies on CPU cycles, RAM allocation, and OS file descriptors. Understanding hardware and OS boundaries helps you debug memory and speed issues effortlessly.',
    analogyUz: "Kompyuterni oshxonaga o'xshating: CPU — oshpaz (buyruqlarni bajaradi), RAM — ishchi stol (hozir kerakli masalliqlar turadi, elektr o'chsa tozalanadi), SSD/HDD — ombor (ma'lumotlar doimiy saqlanadi), OS esa — boshqaruvchi.",
    analogyEn: 'Think of a computer as a kitchen: CPU is the chef, RAM is the prep counter (fast but cleared when powered off), SSD is the pantry (permanent storage), and the OS is the kitchen manager.',
    stopsUz: "Haqiqiy CPU soniyasiga milliardlab ikkilik (0 va 1) operatsiyalarni bajaradi va OS virtual xotira orqali SSD ning bir qismini RAM kabi ko'rsatishi mumkin.",
    stopsEn: 'Real CPUs execute billions of binary instructions per second, and operating systems use virtual memory paging beyond this kitchen metaphor.',
    objUz: [
      'CPU, RAM, SSD/HDD va Kirish-Chiqish (I/O) qurilmalari vazifasini tushunish',
      'Operatsion tizim (Windows, macOS, Linux) dasturlarni qanday boshqarishini bilish',
      'Bit, Bayt, KB, MB, GB birliklarini hisoblay olish',
      'Python ichida tizim va xotira maʼlumotlarini tekshirish',
    ],
    objEn: [
      'Explain the roles of CPU, RAM, SSD/HDD, and I/O devices',
      'Understand how an OS schedules processes and protects memory',
      'Convert between Bits, Bytes, KB, MB, and GB accurately',
      'Inspect platform and object byte sizes using Python stdlib',
    ],
    theoryUz: `### 1. Kompyuter arxitekturasi (Von Neumann modeli)
Har qanday zamonaviy kompyuter to'rt asosiy ustun asosida ishlaydi:
- **CPU (Markaziy protsessor)**: mantiqiy va arifmetik buyruqlarni bajaruvchi "miya".
- **RAM (Tezkor xotira)**: hozir ishlayotgan dasturlar va o'zgaruvchilar saqlanadigan juda tezkor, lekin vaqtinchalik xotira.
- **SSD / HDD (Doimiy xotira)**: fayllar va \`.py\` kodlaringiz elektr o'chganda ham saqlanadigan joy.
- **I/O (Kiritish/Chiqarish)**: klaviatura, ekran, tarmoq kartasi.

\`\`\`
+-------------------+       +-------------------+
|   Kiritish (I/O)  | ----> |       CPU         | ----> Chiqarish (Ekran/Disk)
+-------------------+       |  (Buyruq bajarish)|
                            +-------------------+
                                   ^     |
                                   |     v
                            +-------------------+
                            | RAM (Tezkor xot.) | <===> SSD (Doimiy saqlash)
                            +-------------------+
\`\`\`

### 2. Ma'lumot qanday o'lchanadi? (Bit va Bayt)
Kompyuter faqat **0** va **1** ni tushunadi. Bitta 0 yoki 1 — **1 bit**. **8 bit = 1 bayt (Byte)** bo'lib, bitta oddiy belgini (\`'A'\`) saqlashga yetadi.
| Birlik | Qiymati | Hayotiy misol |
|---|---|---|
| 1 Bit | 0 yoki 1 | Bitta mantiqiy bayroq (True/False) |
| 1 Byte | 8 bit | Bitta ASCII harf (\`'P'\`) |
| 1 KB | 1024 Byte | Yarim sahifa matn |
| 1 MB | 1024 KB | Kichik kod bazasi yoki rasm |
| 1 GB | 1024 MB | Operatsion tizim yoki katta dataset |

### 3. Operatsion tizim (OS) nima qiladi?
**Windows**, **macOS** va **Linux** — operatsion tizimlardir. OS:
1. **Jarayonlarni (Processes)** navbatma-navbat CPU da ishlatadi;
2. Har bir dasturga **alohida RAM hududi** ajratadi;
3. **Fayl tizimi (File System)** orqali papka va fayllarni tartibga soladi.

### 4. Dastur ishga tushganda nima sodir bo'ladi?
Siz \`python app.py\` deganingizda OS \`app.py\` ni **SSD** dan o'qib **RAM** ga yuklaydi, Python interpreter kodni baytkodga o'giradi va **CPU** ga uzatadi.

### 5. Keng tarqalgan xatolar
O'zgaruvchilar **RAM** da yashaydi, dastur tugashi bilan o'chadi; faqat diskka yozilgan fayllargina **SSD** da saqlanib qoladi.`,
    theoryEn: `### 1. Computer Architecture (Von Neumann Model)
Every modern computer rests on four core pillars:
- **CPU**: fetches, decodes, and executes instructions.
- **RAM**: ultra-fast volatile workspace holding active programs and variables.
- **SSD / HDD**: persistent storage retaining files across power cycles.
- **I/O Devices**: keyboard, display, network interface.

### 2. Measuring Information: Bits & Bytes
Transistors store **0** or **1** (1 bit). **8 bits = 1 Byte**, holding one ASCII character.
| Unit | Size | Real Example |
|---|---|---|
| 1 Bit | 0 or 1 | Single boolean flag |
| 1 Byte | 8 bits | One ASCII character |
| 1 KB | 1024 Bytes | Short text snippet |
| 1 MB | 1024 KB | Compressed photo |
| 1 GB | 1024 MB | OS memory footprint |

### 3. What Does an Operating System Do?
**Windows**, **macOS**, and **Linux** schedule processes on the CPU, isolate RAM between apps, and enforce file system permissions.

### 4. Execution Lifecycle
When running \`python app.py\`, the OS loads the file from **SSD into RAM**, spawns the Python process, and routes \`print()\` output to stdout.

### 5. Practical Pitfalls
Variables live in volatile **RAM** and vanish when a script exits. Durable state must be written to files or databases on SSD.`,
    examples: [
      ex('Misol 1: Xotira birliklarini hisoblash', 'Example 1: Computing Storage Units', `kb = 1024\nmb = kb * 1024\ngb = mb * 1024\nprint(f"1 KB = {kb} B")\nprint(f"1 MB = {mb} B")\nprint(f"1 GB = {gb} B")`, `1 KB = 1024 B\n1 MB = 1048576 B\n1 GB = 1073741824 B`, "Ikkilik sanoq tizimida har bir keyingi birlik 1024 (2^10) ga ko'payadi.", 'In binary storage sizing, each tier scales by 1024.'),
      ex('Misol 2: Python obyektlarining RAM dagi hajmi', 'Example 2: Inspecting RAM Size with sys.getsizeof', `import sys\nnumber = 42\ntext = "Python"\nitems = [1, 2, 3, 4]\nprint("int bytes > 0:", sys.getsizeof(number) > 0)\nprint("str > int:", sys.getsizeof(text) > sys.getsizeof(number))\nprint("list > str:", sys.getsizeof(items) > sys.getsizeof(text))`, `int bytes > 0: True\nstr > int: True\nlist > str: True`, '`sys.getsizeof()` Python obyekti RAM da egallagan baytlar sonini qaytaradi.', '`sys.getsizeof()` inspects the RAM footprint in bytes of each object.'),
      ex('Misol 3: Operatsion tizim va arxitektura maʼlumoti', 'Example 3: Inspecting OS & CPU Core Count', `import os\nimport sys\nprint("Byte order:", sys.byteorder)\nprint("CPU cores >= 1:", (os.cpu_count() or 1) >= 1)\nprint("OS name:", os.name)`, `Byte order: little\nCPU cores >= 1: True\nOS name: posix`, 'Python `os` va `sys` modullari orqali kompyuterning OS va CPU xususiyatlarini aniqlaydi.', 'Python inspects host architecture and OS family via `os` and `sys`.'),
    ],
    traceTitleUz: 'Xotira hajmini qadamma-qadam hisoblash',
    traceTitleEn: 'Step-by-Step Memory Calculation Trace',
    traceCode: `bytes_per_char = 1\nword = "Salom"\ntotal_bytes = len(word) * bytes_per_char\ntotal_bits = total_bytes * 8\nprint(total_bytes, total_bits)`,
    traceSteps: [
      traceStep(1, 'bytes_per_char = 1', 'bytes_per_char=1', 'Har bir belgi uchun 1 bayt', '1 byte per ASCII char'),
      traceStep(2, 'word = "Salom"', 'word="Salom"', '5 ta belgili matn RAM da yaratildi', '5-char string allocated'),
      traceStep(3, 'total_bytes = len(word) * bytes_per_char', 'total_bytes=5', '5 bayt hisoblandi', '5 bytes computed'),
      traceStep(4, 'total_bits = total_bytes * 8', 'total_bits=40', '40 bit ga aylantirildi', 'Converted to 40 bits'),
      traceStep(5, 'print(total_bytes, total_bits)', '5 40', 'Natija stdout ga chiqdi', 'Printed to stdout', '5 40'),
    ],
    commonMistakes: [
      mistake('RAM va SSD vazifasini adashtirish', 'Confusing Volatile RAM with Persistent Disk', `score = 100\n# Dastur tugadi, diskka yozilmadi`, 'Data lost after script exits', `with open("score.txt", "w") as f:\n    f.write("100")`, 'RAM jarayon tugashi bilan tozalanadi.', 'RAM is cleared when the process ends.', "Doimiy ma'lumotni fayl yoki bazaga yozing.", 'Persist durable data to files or DB.'),
      mistake('Bit (b) va Bayt (B) ni almashtirish', 'Mixing up Bits (b) and Bytes (B)', `internet_mbps = 80\ndownload_MB_per_sec = internet_mbps`, '8x wrong estimate', `internet_mbps = 80\ndownload_MB_per_sec = internet_mbps / 8`, 'Tarmoq tezligi bit/s da, fayl hajmi Bayt da o‘lchanadi.', 'Bandwidth is in bits; file size is in Bytes.', 'Mbps ni 8 ga bo‘ling.', 'Divide Mbps by 8 for MB/s.'),
    ],
    compareTitleUz: 'RAM vs SSD/HDD taqqoslash',
    compareTitleEn: 'Comparing RAM vs SSD/HDD',
    compareUz: ['Tezlik: RAM nanosoniya darajasida tez.', 'Saqlanish: RAM vaqtinchalik, SSD doimiy.', 'Hajm: 8–32 GB RAM vs 256–1024 GB SSD.'],
    compareEn: ['Speed: RAM is orders of magnitude faster.', 'Persistence: RAM clears on power-off; SSD retains data.', 'Capacity: 8–32 GB RAM vs 256–1024 GB SSD.'],
    compareSummaryUz: "Ishlayotgan o'zgaruvchilar RAM da, doimiy fayllar SSD da saqlanadi.",
    compareSummaryEn: 'Active state lives in RAM; durable files live on SSD.',
    practiceTasks: [
      pt('p0101_1', '1-mashq: Baytdan bitga', 'Task 1: Bytes to Bits', "16 bayt nechta bit bo'lishini chiqaring.", 'Calculate bits in 16 bytes.', `bytes_count = 16\nprint(bytes_count * 8)`, '128', '8 ga ko‘paytiring.', 'Multiply by 8.'),
      pt('p0101_2', '2-mashq: MB dan KB ga', 'Task 2: MB to KB', '5 MB nechta KB ekanini chiqaring.', 'Calculate KB in 5 MB.', `mb = 5\nprint(mb * 1024)`, '5120', '1024 ga ko‘paytiring.', 'Multiply by 1024.'),
      pt('p0101_3', '3-mashq: Bayt tartibi', 'Task 3: Endianness', '`sys.byteorder` ni chiqaring.', 'Print `sys.byteorder`.', `import sys\nprint(sys.byteorder)`, 'little', 'sys.byteorder.', 'Use sys.byteorder.'),
      pt('p0101_4', '4-mashq: Internet tezligi', 'Task 4: MB/s Speed', '160 Mbps nechta MB/s?', 'Calculate MB/s for 160 Mbps.', `mbps = 160\nprint(mbps // 8)`, '20', '8 ga bo‘ling.', 'Divide by 8.'),
      pt('p0101_5', '5-mashq: Matn uzunligi', 'Task 5: Word Length', "`'Olimpiada'` uzunligini chiqaring.", "Print length of `'Olimpiada'`.", `word = "Olimpiada"\nprint(len(word))`, '9', 'len().', 'Use len().'),
    ],
    quiz: [
      q('q0101_1', 'Elektr o‘chganda qaysi xotira tozalanadi?', 'Which memory loses data on power-off?', ['SSD', 'RAM', 'Flash', 'HDD'], ['SSD', 'RAM', 'Flash', 'HDD'], 1, 'RAM vaqtinchalik xotira.', 'RAM is volatile memory.'),
      q('q0101_2', '1 Bayt nechta bit?', 'How many bits in 1 Byte?', ['4', '8', '16', '32'], ['4', '8', '16', '32'], 1, '1 Bayt = 8 bit.', '1 Byte = 8 bits.'),
      q('q0101_3', 'Buyruqlarni bevosita kim bajaradi?', 'Which component executes instructions?', ['CPU', 'Monitor', 'SSD', 'Router'], ['CPU', 'Monitor', 'SSD', 'Router'], 0, 'CPU bajaradi.', 'The CPU executes instructions.'),
      q('q0101_4', 'OS ning asosiy vazifasi?', 'Primary role of an OS?', ['Faqat dizayn', 'Apparat va jarayonlarni boshqarish', 'Faqat Wi-Fi', 'Hech narsa'], ['UI only', 'Manage hardware and processes', 'Wi-Fi only', 'None'], 1, 'OS resurslarni boshqaradi.', 'OS manages processes, RAM, and files.'),
      q('q0101_5', '2 KB nechta bayt?', 'How many bytes in 2 KB?', ['2000', '2048', '1024', '256'], ['2000', '2048', '1024', '256'], 1, '2 * 1024 = 2048.', '2 * 1024 = 2048.'),
    ],
    homework: hw('Kompyuter resurslari pasporti', 'System Storage Calculator', '512 MB faylni 100 Mbps tezlikda yuklash vaqtini hisoblang.', 'Calculate download time in seconds for 512 MB at 100 Mbps.', ['Bayt/bit konversiyasi to‘g‘ri bo‘lsin', 'f-string bilan chiqaring'], ['Accurate bit/byte conversion', 'Format with f-string'], '512 * 8 / 100.', 'Multiply MB by 8 then divide by Mbps.', 'GB va TB konversiyasini ham qo‘shing.', 'Add GB/TB support.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-01-02',
    courseId: 'computer_literacy',
    moduleId: 'c01_m1',
    order: 2,
    titleUz: 'Dasturlash nima va u nima uchun kerak?',
    titleEn: 'What Is Programming and Why Does It Matter?',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-01-01'],
    conceptId: 'what_is_programming',
    whyUz: "Dasturlash — bu kompyuterga aniq va mantiqiy ko'rsatmalar ketma-ketligini yozib berish san'ati.",
    whyEn: 'Programming is translating human intent into unambiguous step-by-step instructions.',
    analogyUz: "Dastur taom retseptiga o'xshaydi: masalliqlar (Input), harakatlar (Algoritm) va tayyor taom (Output).",
    analogyEn: 'A program is like a strict cooking recipe: inputs, ordered algorithm steps, and deterministic output.',
    stopsUz: "Inson oshpaz 'biroz tuz' desa tushunadi; kompyuterga aniq raqam va shart kerak.",
    stopsEn: 'Humans guess vague instructions; computers execute exact rules literally.',
    objUz: ['Dastur va Algoritm tushunchalarini bilish', 'Input → Process → Output (IPO) modelini qo‘llash', 'Dasturlash sohalarini ajratish'],
    objEn: ['Define programming and algorithms', 'Apply the Input → Process → Output model', 'Identify major software domains'],
    theoryUz: `### 1. Dasturlash tushunchasi
**Dasturlash** — bu muammoni kichik mantiqiy qadamlarga bo'lib, aniq buyruqlar shaklida yozishdir.
### 2. Algoritm — dasturning yuragi
Algoritm — chekli va aniq qadamlar ketma-ketligi (masalan, bankomat algoritmi: Karta → PIN → Balans → Pul).
### 3. Input → Process → Output (IPO) modeli
\`\`\`
[ KIRISH (Input) ] ---> [ QAYTA ISHLASH (Process) ] ---> [ NATIJA (Output) ]
\`\`\`
### 4. Nima uchun dasturlash kerak?
- **Avtomatlashtirish**: soatlab ishni soniyalarda bajarish.
- **Masshtab**: millionlab foydalanuvchiga xizmat ko‘rsatish.
- **Aniqlik**: 24/7 xatosiz hisoblash.
### 5. Yaxshi dastur sifatlari
O'qilishi oson, tushunarli nomlangan va noto'g'ri kiritmalarni tekshiradigan kod.`,
    theoryEn: `### 1. What Is Programming?
Breaking a problem into unambiguous sequential steps that execute deterministically.
### 2. Algorithms
A finite ordered procedure converting inputs into an output.
### 3. Input → Process → Output (IPO)
Every script reads Input, runs Process logic, and emits Output.
### 4. Why Learn Programming?
Automation, scale across millions of requests, and consistent precision.
### 5. Clean Code Habits
Readable naming, logical step order, and clear outputs.`,
    examples: [
      ex('Misol 1: IPO chegirma kalkulyatori', 'Example 1: IPO Discount Calculator', `price = 120000\ndiscount_rate = 0.15\nfinal_price = int(price * (1 - discount_rate))\nprint("Yakuniy narx:", final_price)`, `Yakuniy narx: 102000`, 'Input -> Process -> Output sxemasi.', 'Demonstrates IPO cleanly.'),
      ex('Misol 2: Oylik jamg‘arma hisobi', 'Example 2: Monthly Savings Projection', `daily = 25000\ndays = 30\nprint("Jami:", daily * days)`, `Jami: 750000`, 'Takroriy hisob-kitobni avtomatlashtirish.', 'Automates repetitive math.'),
      ex('Misol 3: Shartli qaror algoritmi', 'Example 3: Decision Algorithm', `battery = 18\nstatus = "Quvvatlang" if battery < 20 else "Yetarli"\nprint("Holat:", status)`, `Holat: Quvvatlang`, 'Kirish qiymatiga ko‘ra tarmoqlanish.', 'Branches on threshold condition.'),
    ],
    traceTitleUz: 'IPO jarayonini kuzatish',
    traceTitleEn: 'Tracing an IPO Flow',
    traceCode: `a = 10\nb = 20\ns = a + b\navg = s / 2\nprint(avg)`,
    traceSteps: [
      traceStep(1, 'a = 10', 'a=10', 'Kirish 1', 'Input 1'),
      traceStep(2, 'b = 20', 'b=20', 'Kirish 2', 'Input 2'),
      traceStep(3, 's = a + b', 's=30', 'Yig‘indi', 'Sum'),
      traceStep(4, 'avg = s / 2', 'avg=15.0', 'O‘rtacha', 'Average'),
      traceStep(5, 'print(avg)', '15.0', 'Chiqish', 'Output', '15.0'),
    ],
    commonMistakes: [
      mistake('Buyruqlar tartibini buzish', 'Using Variables Before Definition', `print(total)\ntotal = 5 + 3`, 'NameError', `total = 5 + 3\nprint(total)`, 'Python yuqoridan pastga ketma-ket o‘qiydi.', 'Python runs top-to-bottom.', 'O‘zgaruvchini avval aniqlang.', 'Define before use.'),
      mistake('Natijani chiqarmaslik', 'Computing Without Output', `x = 10 * 2`, 'Blank screen', `x = 10 * 2\nprint(x)`, 'Ekranga chiqarish uchun print() kerak.', 'Use print() to display output.', 'Har doim natijani chop eting.', 'Always emit expected output.'),
    ],
    compareTitleUz: 'Qo‘lda bajarish vs Dasturlash',
    compareTitleEn: 'Manual Work vs Programming',
    compareUz: ['Bir martalik mayda ish: qo‘lda tez.', 'Takroriy yoki katta hajmli ish: dasturlash 1000x tez.'],
    compareEn: ['Trivial one-off edit: manual works.', 'Repetitive or large data: scripting dominates.'],
    compareSummaryUz: 'Takrorlanadigan har qanday raqamli ishni Python bilan avtomatlashtiring.',
    compareSummaryEn: 'Automate any digital workflow you perform repeatedly.',
    practiceTasks: [
      pt('p0102_1', '1-mashq: Yuzani topish', 'Task 1: Area', '7 * 4 ni chiqaring.', 'Print 7 * 4.', `w = 7\nh = 4\nprint(w * h)`, '28', 'w * h.', 'Multiply.'),
      pt('p0102_2', '2-mashq: Yosh hisoblash', 'Task 2: Age', '2026 - 2004.', 'Print 2026 - 2004.', `print(2026 - 2004)`, '22', 'Ayiring.', 'Subtract.'),
      pt('p0102_3', '3-mashq: Soatdan daqiqa', 'Task 3: Minutes', '3 * 60.', 'Convert 3h to min.', `print(3 * 60)`, '180', '60 ga ko‘paytiring.', 'Multiply by 60.'),
      pt('p0102_4', '4-mashq: O‘rtacha ball', 'Task 4: Average', '(80 + 90) / 2.', 'Average of 80 & 90.', `print((80 + 90) / 2)`, '85.0', 'Qavs ishlating.', 'Use parentheses.'),
      pt('p0102_5', '5-mashq: Xabar', 'Task 5: Greeting', 'Salom Python chiqaring.', 'Print Salom Python.', `print("Salom Python")`, 'Salom Python', 'print().', 'Call print().'),
    ],
    quiz: [
      q('q0102_1', 'Algoritm nima?', 'What is an algorithm?', ['Monitor', 'Aniq qadamlar ketma-ketligi', 'Kabel', 'Klaviatura'], ['Monitor', 'Finite step-by-step procedure', 'Cable', 'Keyboard'], 1, 'Algoritm — qadamlar rejasi.', 'Finite ordered steps.'),
      q('q0102_2', 'IPO dagi P nima?', 'What is P in IPO?', ['Print', 'Process', 'Pause', 'Power'], ['Print', 'Process', 'Pause', 'Power'], 1, 'Input -> Process -> Output.', 'Process.'),
      q('q0102_3', 'Python kodni qaysi tartibda bajaradi?', 'Execution order in Python?', ['Tasodifiy', 'Yuqoridan pastga', 'Pastdan yuqoriga', 'Alifbo'], ['Random', 'Top-to-bottom', 'Bottom-up', 'Alphabetical'], 1, 'Yuqoridan pastga.', 'Top-to-bottom.'),
      q('q0102_4', 'Kirish (Input) ga misol?', 'Example of Input?', ['Foydalanuvchi kiritgan son', 'Printer', 'CPU issiqligi', 'Monitor'], ['User-entered number', 'Printer', 'CPU heat', 'Monitor'], 0, 'Foydalanuvchi maʼlumoti.', 'User input.'),
      q('q0102_5', 'Dasturlashning eng katta kuchi?', 'Greatest strength of code?', ['Avtomatlashtirish', 'Faqat o‘yin', 'Sekinlash', 'Elektr'], ['Automation at scale', 'Games only', 'Slowdown', 'Power'], 0, 'Avtomatlashtirish.', 'Automation.'),
    ],
    homework: hw('Kundalik byudjet algoritmi', 'Daily Budget Algorithm', 'Oylik daromad va 3 xarajatdan qolgan jamg‘armani hisoblang.', 'Compute savings after 3 expenses.', ['4 ta o‘zgaruvchi', 'Aniq chiqish'], ['4 variables', 'Clean print'], 'income - (a + b + c).', 'Subtract expenses.', 'Foiz ulushini qo‘shing.', 'Add savings %.', 15),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-01-03',
    courseId: 'computer_literacy',
    moduleId: 'c01_m2',
    order: 3,
    titleUz: 'Programming Language va Python tarixi',
    titleEn: 'Programming Languages & Python History',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-01-02'],
    conceptId: 'python_history',
    whyUz: "Nima uchun Python bugun AI, Backend va Data sohalarida 1-o'rinda ekanligini tushunish o'quv yo'lingizni aniq belgilaydi.",
    whyEn: 'Knowing why Python leads AI, backend, and automation explains its ecosystem and design philosophy.',
    analogyUz: "C++ — mexanik poyga mashinasi; Python — zamonaviy aqlli elektromobil: tez o'rganiladi va juda kuchli.",
    analogyEn: 'C++ is a manual race car; Python is a smart modern EV: productive and versatile.',
    stopsUz: "Python og'ir hisob-kitoblarda (NumPy/PyTorch) ichkarida C/C++ kodini chaqiradi.",
    stopsEn: 'Python stays fast in AI/data because NumPy and PyTorch run compiled C/C++ kernels.',
    objUz: ['Past va yuqori darajali tillarni ajratish', 'Guido van Rossum va 1991-yil tarixini bilish', 'Zen of Python (PEP 20) ni qo‘llash'],
    objEn: ['Contrast low vs high-level languages', 'Know Python origin (1991)', 'Apply PEP 20 principles'],
    theoryUz: `### 1. Tillar darajalari
**Machine Code (0/1)** -> **Assembly** -> **Yuqori darajali tillar (Python, JS, Java)**.
### 2. Python tarixi
1991-yilda **Guido van Rossum** tomonidan yaratilgan (nomi *Monty Python's Flying Circus* shousidan). Bugun standart — **Python 3.10+**.
### 3. Qo‘llanilish sohalari
- **Web Backend**: FastAPI, Django
- **Data Science**: NumPy, Pandas
- **AI / ML**: PyTorch, Scikit-learn
- **Automation**: Selenium, BeautifulSoup
### 4. Zen of Python (PEP 20)
*Readability counts. Simple is better than complex. Explicit is better than implicit.*
### 5. Keng tarqalgan xatolar
Eski Python 2 sintaksisi (\`print "hi"\`) dan foydalanish.`,
    theoryEn: `### 1. Language Tiers
Machine code -> Assembly -> High-level languages (Python, JS, C#).
### 2. Python History
Created by **Guido van Rossum** (1991), named after Monty Python. Modern standard: **Python 3.10+**.
### 3. Domains
FastAPI/Django (Web), Pandas/NumPy (Data), PyTorch (AI), Playwright (Automation).
### 4. Zen of Python (PEP 20)
Readability counts; simple beats complex.
### 5. Pitfalls
Avoid obsolete Python 2 tutorials.`,
    examples: [
      ex('Misol 1: Python 3 versiyasini tekshirish', 'Example 1: Checking Python 3', `import sys\nprint("Major:", sys.version_info.major)\nprint("Python 3+:", sys.version_info.major >= 3)`, `Major: 3\nPython 3+: True`, 'Zamonaviy loyihalar Python 3 da yoziladi.', 'Modern code targets Python 3.'),
      ex('Misol 2: Zen of Python qoidalari', 'Example 2: Zen Rules', `rules = ["Readability counts.", "Simple is better than complex."]\nfor i, r in enumerate(rules, 1):\n    print(f"{i}. {r}")`, `1. Readability counts.\n2. Simple is better than complex.`, 'PEP 20 soddalik va ravshanlikni qadrlaydi.', 'PEP 20 prioritizes clarity.'),
      ex('Misol 3: Python ekotizimi xaritasi', 'Example 3: Ecosystem Map', `eco = {"Backend": "FastAPI", "AI": "PyTorch"}\nfor k, v in eco.items():\n    print(k, "->", v)`, `Backend -> FastAPI\nAI -> PyTorch`, 'Bir til — ko‘p soha.', 'One language across major domains.'),
    ],
    traceTitleUz: 'Versiya tekshiruvi izi',
    traceTitleEn: 'Version Check Trace',
    traceCode: `major = 3\nminor = 12\nok = (major == 3 and minor >= 10)\nprint(ok)`,
    traceSteps: [
      traceStep(1, 'major = 3', 'major=3', 'Asosiy versiya', 'Major version'),
      traceStep(2, 'minor = 12', 'minor=12', 'Kichik versiya', 'Minor version'),
      traceStep(3, 'ok = ...', 'ok=True', 'Moslik tekshirildi', 'Checked compatibility'),
      traceStep(4, 'print(ok)', 'True', 'Natija', 'Printed', 'True'),
    ],
    commonMistakes: [
      mistake('Python 2 print yozish', 'Python 2 Print Syntax', `print "Hello"`, 'SyntaxError', `print("Hello")`, 'Python 3 da qavs shart.', 'Python 3 requires parentheses.', 'Doim `print(...)` yozing.', 'Always use `print(...)`.'),
      mistake('Bir qatorda ko‘p nuqta-vergul', 'Cramming One-Liners', `x=1;y=2;print(x+y)`, 'Poor readability', `x = 1\ny = 2\nprint(x + y)`, 'O‘qilishni yomonlashtiradi.', 'Hurts readability.', 'Har buyruqqa alohida qator.', 'One statement per line.'),
    ],
    compareTitleUz: 'Python vs C++ vs JavaScript',
    compareTitleEn: 'Python vs C++ vs JavaScript',
    compareUz: ['Python: AI/Backend/Data yetakchisi.', 'C++: o‘yin dvigatellari va tizimlar.', 'JS: brauzer frontendi.'],
    compareEn: ['Python: AI/Backend/Data leader.', 'C++: systems & engines.', 'JS: web browser runtime.'],
    compareSummaryUz: 'Python birinchi til va ko‘p soha uchun eng tezkor tanlov.',
    compareSummaryEn: 'Python gives the highest productivity across industries.',
    practiceTasks: [
      pt('p0103_1', '1-mashq: Python yoshi', 'Task 1: Age', '2026 - 1991.', 'Print 2026 - 1991.', `print(2026 - 1991)`, '35', 'Ayiring.', 'Subtract.'),
      pt('p0103_2', '2-mashq: Yaratuvchi', 'Task 2: Creator', 'Guido nomini chiqaring.', 'Print Guido van Rossum.', `print("Guido van Rossum")`, 'Guido van Rossum', 'print().', 'Use print().'),
      pt('p0103_3', '3-mashq: Python 3', 'Task 3: Print 3', 'Salom Python 3.', 'Print Salom Python 3.', `print("Salom Python 3")`, 'Salom Python 3', 'Qavslar.', 'Parentheses.'),
      pt('p0103_4', '4-mashq: Soha soni', 'Task 4: Count', 'len(["Web", "AI", "Data"]).', 'Count list length.', `print(len(["Web", "AI", "Data"]))`, '3', 'len().', 'Use len().'),
      pt('p0103_5', '5-mashq: Upper', 'Task 5: Uppercase', '`zen` ni katta harfda.', 'Print `zen` upper.', `print("zen".upper())`, 'ZEN', '.upper().', 'Use .upper().'),
    ],
    quiz: [
      q('q0103_1', 'Python yaratuvchisi kim?', 'Who created Python?', ['Torvalds', 'Guido van Rossum', 'Gosling', 'Ritchie'], ['Torvalds', 'Guido van Rossum', 'Gosling', 'Ritchie'], 1, 'Guido van Rossum.', 'Guido van Rossum.'),
      q('q0103_2', 'Nomi nimadan olingan?', 'Origin of the name Python?', ['Ilon', 'Monty Python shousi', 'Shahar', 'Formula'], ['Snake', 'Monty Python comedy show', 'City', 'Math'], 1, 'BBC komediya shousi.', 'Monty Python comedy show.'),
      q('q0103_3', 'PEP 20 nimani urg‘ulaydi?', 'What does PEP 20 stress?', ['O‘qilish va soddalik', 'Yashirin kod', 'Izohsiz kod', 'Sekinlik'], ['Readability & simplicity', 'Obfuscation', 'No comments', 'Slowness'], 0, 'Readability counts.', 'Readability counts.'),
      q('q0103_4', 'Eskirgan versiya qaysi?', 'Retired version?', ['Python 2', 'Python 3.11', 'Python 3.12', 'Python 3.13'], ['Python 2', 'Python 3.11', 'Python 3.12', 'Python 3.13'], 0, 'Python 2.', 'Python 2.'),
      q('q0103_5', 'AI da mashhur kutubxona?', 'Popular AI framework?', ['PyTorch', 'CSS', 'HTML', 'XML'], ['PyTorch', 'CSS', 'HTML', 'XML'], 0, 'PyTorch.', 'PyTorch.'),
    ],
    homework: hw('Python sohalar xaritasi', 'Python Ecosystem Map', '3 ta soha va kutubxonasini jadval qilib chiqaring.', 'Print 3 domains and libraries.', ['Dictionary ishlating', 'Chiroyli formatlang'], ['Use a dict', 'Clean format'], 'for k, v in d.items().', 'Loop dict.', 'Maqsadingizni qo‘shing.', 'Add personal goal.', 15),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-01-04',
    courseId: 'computer_literacy',
    moduleId: 'c01_m2',
    order: 4,
    titleUz: 'Interpreter va Compiler farqi',
    titleEn: 'Interpreters vs Compilers (and Python Bytecode)',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-01-03'],
    conceptId: 'interpreter_vs_compiler',
    whyUz: "SyntaxError va Runtime Error qachon chiqishini tushunish debugging tezligingizni oshiradi.",
    whyEn: 'Understanding bytecode compilation and PVM execution clarifies SyntaxError vs Runtime errors.',
    analogyUz: "Kompilyator butun kitobni oldindan tarjima qiladi; Interpreter sinxron tarjimon kabi gapma-gap o'giradi.",
    analogyEn: 'A compiler translates the whole book first; an interpreter translates live step-by-step.',
    stopsUz: "CPython gibrid: avval `.pyc` baytkodga kompilyatsiya qiladi, so'ng PVM bajaradi.",
    stopsEn: 'CPython compiles source to `.pyc` bytecode first, then interprets on the PVM.',
    objUz: ['Compiler vs Interpreter farqini bilish', '`.py` → Bytecode → PVM zanjirini tushunish', 'Syntax vs Runtime xatolarni ajratish'],
    objEn: ['Contrast compilers and interpreters', 'Trace `.py` -> Bytecode -> PVM', 'Distinguish SyntaxError from runtime errors'],
    theoryUz: `### 1. Tarjima zarurati
CPU faqat 0/1 tushunadi.
### 2. Compiler (C/C++/Rust)
Kod to'liq mashina kodiga aylanadi. Juda tez, lekin har safar build shart.
### 3. CPython Bytecode + PVM
\`\`\`
main.py ---> [ Compiler ] ---> Bytecode (.pyc) ---> [ PVM ] ---> Natija
\`\`\`
### 4. \`dis\` va \`compile()\`
Standart \`dis\` moduli baytkod buyruqlarini ko‘rsatadi.
### 5. SyntaxError vs Runtime Error
Sintaksis xatosi bo‘lsa kodning **birinchi qatori ham** ishlamaydi.`,
    theoryEn: `### 1. Why Translation Is Needed
CPUs execute binary machine opcodes.
### 2. Ahead-of-Time Compilers (C/C++/Rust)
Produce fast native executables.
### 3. CPython Pipeline
Source -> Compiler (checks syntax, emits bytecode) -> PVM loop.
### 4. Bytecode Inspection
Use \`compile()\` and \`dis\`.
### 5. Error Timing
SyntaxError stops before line 1; Runtime errors happen at the failing line.`,
    examples: [
      ex('Misol 1: `compile()` va constant folding', 'Example 1: compile() & Constant Folding', `c = compile("x = 2 + 3", "<demo>", "exec")\nprint("Name:", c.co_name)\nprint("Consts:", c.co_consts)`, `Name: <module>\nConsts: (5, None)`, 'Python 2+3 ni kompilyatsiya paytidayoq 5 ga aylantiradi.', 'Constant folding evaluates 2+3 at compile time.'),
      ex('Misol 2: `dis` bilan baytkod soni', 'Example 2: Disassembling Bytecode', `import dis\ndef add(a, b):\n    return a + b\ninstrs = list(dis.get_instructions(add))\nprint("Count > 0:", len(instrs) > 0)\nprint("First:", instrs[0].opname)`, `Count > 0: True\nFirst: RESUME`, 'Har bir funksiya PVM buyruqlariga bo‘linadi.', 'Functions compile to bytecode ops.'),
      ex('Misol 3: Syntax tekshirish', 'Example 3: Catching SyntaxError Early', `for s in ["x = 1 + 2", "x = 1 +"]:\n    try:\n        compile(s, "<t>", "exec")\n        print("Valid:", s)\n    except SyntaxError:\n        print("SyntaxError:", s)`, `Valid: x = 1 + 2\nSyntaxError: x = 1 +`, 'SyntaxError bajarilishdan oldin ushlanadi.', 'Caught before execution.'),
    ],
    traceTitleUz: 'Baytkod bajarilishi',
    traceTitleEn: 'Bytecode Execution Trace',
    traceCode: `print("1-qator")\nx = 10 // 2\nprint("Natija:", x)`,
    traceSteps: [
      traceStep(1, 'Compile', 'Syntax OK', 'Sintaksis tekshirildi', 'Syntax verified'),
      traceStep(2, 'print("1-qator")', '-', '1-qator chiqdi', 'Line 1 output', '1-qator'),
      traceStep(3, 'x = 10 // 2', 'x=5', 'Hisoblandi', 'Computed'),
      traceStep(4, 'print("Natija:", x)', 'x=5', '2-chiqish', 'Line 2 output', 'Natija: 5'),
    ],
    commonMistakes: [
      mistake('Keyingi qatordagi SyntaxError', 'Later SyntaxError Stops Line 1', `print("Hi")\nif True\n    print("X")`, 'SyntaxError (hech narsa chiqmaydi)', `print("Hi")\nif True:\n    print("OK")`, 'Parser avval butun faylni tekshiradi.', 'Parser checks the entire module first.', '`:` va qavslarni tekshiring.', 'Check colons and brackets.'),
      mistake('`__pycache__` dan qo‘rqish', 'Deleting __pycache__ Repeatedly', `# __pycache__/main.cpython-312.pyc`, 'Noisy git status', `# .gitignore ga __pycache__/ qo'shing`, 'Bu importni tezlatuvchi kesh.', 'Cached bytecode for faster imports.', '.gitignore da yashiring.', 'Ignore in `.gitignore`.'),
    ],
    compareTitleUz: 'Compiled vs Interpreted',
    compareTitleEn: 'Compiled vs Interpreted',
    compareUz: ['C++: maksimal CPU tezligi.', 'Python: tezkor rivojlantirish va kross-platforma.'],
    compareEn: ['C++: max runtime throughput.', 'Python: rapid iteration and portability.'],
    compareSummaryUz: 'Python gibrid baytkod+PVM modeli tez rivojlantirish uchun ideal.',
    compareSummaryEn: 'Bytecode + PVM delivers fast development and portability.',
    practiceTasks: [
      pt('p0104_1', '1-mashq: co_names', 'Task 1: co_names', "`compile('a=1','','exec').co_names`.", 'Print co_names.', `c = compile("a = 1", "", "exec")\nprint(c.co_names)`, "('a',)", 'c.co_names.', 'Access co_names.'),
      pt('p0104_2', '2-mashq: Constant folding', 'Task 2: Constant Folding', "`compile('x=10*5','','exec').co_consts`.", 'Print co_consts.', `c = compile("x = 10 * 5", "", "exec")\nprint(c.co_consts)`, '(50, None)', 'co_consts.', 'Access co_consts.'),
      pt('p0104_3', '3-mashq: Syntax OK', 'Task 3: Validate Syntax', 'To‘g‘ri kodni compile qilib OK chiqaring.', 'Compile loop and print OK.', `compile("for i in range(3): pass", "", "exec")\nprint("OK")`, 'OK', 'compile().', 'Call compile().'),
      pt('p0104_4', '4-mashq: co_code', 'Task 4: co_code Length', "`def f(): return 1` ning `len(f.__code__.co_code) > 0`.", 'Check bytecode exists.', `def f():\n    return 1\nprint(len(f.__code__.co_code) > 0)`, 'True', '__code__.co_code.', 'Inspect __code__.'),
      pt('p0104_5', '5-mashq: eval()', 'Task 5: eval()', "`eval('7 + 8')`.", 'Evaluate 7 + 8.', `print(eval("7 + 8"))`, '15', 'eval().', 'Use eval().'),
    ],
    quiz: [
      q('q0104_1', 'CPython kodni avval nimaga aylantiradi?', 'CPython compiles source into what format?', ['.exe', 'Bytecode (.pyc)', 'HTML', 'SQL'], ['.exe', 'Bytecode (.pyc)', 'HTML', 'SQL'], 1, 'Bytecode (.pyc).', 'Bytecode.'),
      q('q0104_2', 'SyntaxError qachon chiqadi?', 'When is SyntaxError caught?', ['Bajarishdan oldin', 'Oxirida', 'Hech qachon', 'Faqat debugda'], ['Before execution starts', 'At end', 'Never', 'Debug only'], 0, 'Parsing bosqichida.', 'During parsing.'),
      q('q0104_3', 'PVM nima?', 'What is PVM?', ['Python Virtual Machine', 'Private Video', 'Public Map', 'None'], ['Python Virtual Machine', 'Private Video', 'Public Map', 'None'], 0, 'Python Virtual Machine.', 'Python Virtual Machine.'),
      q('q0104_4', '`__pycache__` vazifasi?', 'Role of `__pycache__`?', ['Importni tezlatish', 'Parol saqlash', 'Log yozish', 'Hech narsa'], ['Cache bytecode for fast imports', 'Store passwords', 'Logs', 'None'], 0, 'Baytkodni keshlaydi.', 'Caches `.pyc`.'),
      q('q0104_5', 'Baytkodni qaysi modul ko‘rsatadi?', 'Which module disassembles bytecode?', ['math', 'dis', 'json', 'os'], ['math', 'dis', 'json', 'os'], 1, '`dis`.', '`dis`.'),
    ],
    homework: hw('Mini Sintaksis Tekshirgich', 'Mini Syntax Validator', '`compile()` bilan 4 ta kod snippetini tekshiring.', 'Check 4 code snippets via `compile()`.', ['Valid/SyntaxError ajrating', 'try/except ishlating'], ['Report Valid/SyntaxError', 'Use try/except'], 'except SyntaxError as e:', 'Catch SyntaxError.', 'Qator raqamini ham chiqaring.', 'Print `e.lineno`.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-DOCS-001'],
  }),
  makeLesson({
    id: 'PY-01-05',
    courseId: 'computer_literacy',
    moduleId: 'c01_m3',
    order: 5,
    titleUz: 'Python o‘rnatish va sozlash',
    titleEn: 'Installing and Configuring Python Properly',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-01-04'],
    conceptId: 'python_installation',
    whyUz: "Dasturchilarning 80% ilk muammosi noto'g'ri o'rnatish — ayniqsa Windows'da 'Add python.exe to PATH' katagini belgilamaslikdan kelib chiqadi.",
    whyEn: 'Most beginner setup blockers come from missing PATH configuration or using an outdated Python executable.',
    analogyUz: "PATH o'zgaruvchisi — bu telefoningizdagi tezkor terish ro'yxati: agar python manzili PATH ga qo'shilgan bo'lsa, terminalni qaysi papkadan ochmang, kompyuter uni darhol topadi.",
    analogyEn: 'PATH is like speed-dial for your terminal: if Python is listed in PATH, typing `python` works from any folder.',
    stopsUz: "Bir kompyuterda bir nechta Python versiyasi bo'lishi mumkin; shuning uchun Windows da `py -3`, macOS/Linux da `python3` aniqroq ishlaydi.",
    stopsEn: 'Multiple Python versions can coexist; use `py -3` on Windows or `python3` on macOS/Linux.',
    objUz: ['Windows/macOS/Linux da rasmiy Python 3 ni o‘rnatish', 'PATH muhit o‘zgaruvchisi rolini tushunish', '`python --version` va `sys.version_info` ni tekshirish'],
    objEn: ['Install official Python 3 on Windows/macOS/Linux', 'Explain why Add Python to PATH matters', 'Verify version via CLI and `sys.version_info`'],
    theoryUz: `### 1. Rasmiy manba: python.org
Har doim **python.org/downloads** dan barqaror **Python 3.12+** versiyasini yuklab oling.
### 2. Windows da OLTIN qoida
O'rnatuvchidagi **"Add python.exe to PATH"** katagini albatta belgilang! Aks holda \`'python' is not recognized\` xatosi chiqadi.
### 3. macOS va Linux
- **macOS**: \`brew install python\`
- **Ubuntu/Debian**: \`sudo apt install python3 python3-pip python3-venv\`
### 4. Tekshirish buyruqlari
\`python3 --version\` va \`pip --version\` buyruqlarini yangi terminalda sinang.
### 5. Module shadowing xatosi
Faylingizni hech qachon \`math.py\`, \`json.py\`, \`random.py\` deb nomlamang — aks holda standart kutubxonani to'sib qo'yasiz!`,
    theoryEn: `### 1. Download from python.org
Always download Python **3.12+** from **python.org/downloads**.
### 2. The Golden Windows Rule
Check **"Add python.exe to PATH"** on step 1 of the installer.
### 3. macOS & Linux
Use \`brew install python\` (macOS) or \`apt install python3 python3-pip python3-venv\` (Ubuntu).
### 4. Verification
Run \`python3 --version\` and \`pip --version\` in a fresh terminal.
### 5. Avoid Module Shadowing
Never name scripts \`math.py\`, \`random.py\`, or \`json.py\`.`,
    examples: [
      ex('Misol 1: Versiya tuple taqqoslash', 'Example 1: Semantic Version Tuple Check', `import sys\nsupported = sys.version_info >= (3, 10)\nprint("Python 3.10+:", supported)`, `Python 3.10+: True`, '`sys.version_info` versiya talabini aniq tekshiradi.', '`sys.version_info` checks minimum Python version cleanly.'),
      ex('Misol 2: Standart modullar tayyorligi', 'Example 2: Verifying Stdlib Modules', `import json, math, pathlib\nprint("Stdlib OK:", hasattr(json, "dumps") and hasattr(math, "sqrt"))`, `Stdlib OK: True`, 'To‘g‘ri o‘rnatilgan Python yuzlab modullar bilan keladi.', 'Valid Python ships with batteries-included stdlib.'),
      ex('Misol 3: Default encoding', 'Example 3: UTF-8 Encoding Check', `import sys\nprint("Encoding:", sys.getdefaultencoding())`, `Encoding: utf-8`, 'Zamonaviy Python 3 matnlarni UTF-8 da saqlaydi.', 'Python 3 uses UTF-8 by default.'),
    ],
    traceTitleUz: 'Versiya mosligini tekshirish',
    traceTitleEn: 'Tracing Version Compatibility',
    traceCode: `current = (3, 12)\nminimum = (3, 10)\nok = current >= minimum\nprint(ok)`,
    traceSteps: [
      traceStep(1, 'current = (3, 12)', 'current=(3, 12)', 'Joriy versiya', 'Current version'),
      traceStep(2, 'minimum = (3, 10)', 'minimum=(3, 10)', 'Minimal talab', 'Minimum required'),
      traceStep(3, 'ok = current >= minimum', 'ok=True', 'Taqqoslash natijasi', 'Evaluated True'),
      traceStep(4, 'print(ok)', 'True', 'Natija chiqdi', 'Printed', 'True'),
    ],
    commonMistakes: [
      mistake('PATH ga qo‘shmaslik', 'Skipping PATH on Windows', `python --version\n# 'python' is not recognized`, 'CommandNotFound', `# Installer da "Add python.exe to PATH" ni belgilang`, 'Terminal Python yo‘lini topolmaydi.', 'Shell cannot locate `python.exe`.', 'Yangi terminal oynasi ochib tekshiring.', 'Open a fresh terminal window.'),
      mistake('Faylni `math.py` deb nomlash', 'Shadowing Stdlib Module Names', `# math.py ichida: import math`, 'AttributeError / circular import', `# calc_demo.py deb nomlang`, 'O‘z faylingiz standart modulni yopib qo‘yadi.', 'Local file shadows the standard library.', 'Aniq loyihaga xos fayl nomlari bering.', 'Use descriptive script names.'),
    ],
    compareTitleUz: 'Mahalliy Python vs Onlayn Sandbox',
    compareTitleEn: 'Local Python vs Online Sandbox',
    compareUz: ['Mahalliy Python: katta loyiha, pip va Docker uchun zarur.', 'Code Lab: dars misollarini darhol sinash uchun qulay.'],
    compareEn: ['Local Python: required for full projects and pip packages.', 'Code Lab: instant zero-setup learning sandbox.'],
    compareSummaryUz: 'Nazariyani Code Lab da sinang, katta loyihalarni mahalliy Python da quring.',
    compareSummaryEn: 'Experiment in Code Lab and build multi-file projects locally.',
    practiceTasks: [
      pt('p0105_1', '1-mashq: Versiya taqqoslash', 'Task 1: Tuple Compare', '(3, 12) >= (3, 8) ni chiqaring.', 'Print (3, 12) >= (3, 8).', `print((3, 12) >= (3, 8))`, 'True', 'Tuple comparison.', 'Compare tuples.'),
      pt('p0105_2', '2-mashq: math.sqrt', 'Task 2: Math Test', 'int(math.sqrt(81)) ni chiqaring.', 'Print int(math.sqrt(81)).', `import math\nprint(int(math.sqrt(81)))`, '9', 'math.sqrt.', 'Use math.sqrt.'),
      pt('p0105_3', '3-mashq: Major versiya', 'Task 3: Major Version', 'sys.version_info.major ni chiqaring.', 'Print major version.', `import sys\nprint(sys.version_info.major)`, '3', 'sys.version_info.major.', 'Access .major.'),
      pt('p0105_4', '4-mashq: Xavfsiz nom', 'Task 4: Safe Filename', '"calculator.py" != "math.py" ni chiqaring.', 'Check filename safety.', `print("calculator.py" != "math.py")`, 'True', '!= operatori.', 'Use !=.'),
      pt('p0105_5', '5-mashq: UTF-8', 'Task 5: Encoding', 'sys.getdefaultencoding() ni chiqaring.', 'Print default encoding.', `import sys\nprint(sys.getdefaultencoding())`, 'utf-8', 'sys.getdefaultencoding().', 'Call sys.getdefaultencoding().'),
    ],
    quiz: [
      q('q0105_1', 'Windows da o‘rnatishda qaysi belgi majburiy?', 'Crucial Windows installer option?', ['Dark Mode', 'Add python.exe to PATH', 'Install Docs', 'Disable pip'], ['Dark Mode', 'Add python.exe to PATH', 'Install Docs', 'Disable pip'], 1, 'PATH ga qo‘shish shart.', 'Add to PATH is critical.'),
      q('q0105_2', 'Nega faylni `random.py` deb nomlash xato?', 'Why avoid naming a file `random.py`?', ['Xato bermaydi', 'Standart `random` modulini to‘sib qo‘yadi', 'Fayl kattalashadi', 'RAM to‘ladi'], ['No issue', 'Shadows stdlib random module', 'File grows', 'Fills RAM'], 1, 'Module shadowing.', 'Module shadowing.'),
      q('q0105_3', 'Linux/Mac da Python 3 tekshirish?', 'Check Python 3 on macOS/Linux?', ['python3 --version', 'py --off', 'check py', 'node -v'], ['python3 --version', 'py --off', 'check py', 'node -v'], 0, 'python3 --version.', 'python3 --version.'),
      q('q0105_4', '`sys.version_info` nima beradi?', 'What does `sys.version_info` return?', ['Versiya qismlarini', 'RAM hajmini', 'IP manzilni', 'Sana'], ['Version components', 'RAM size', 'IP address', 'Date'], 0, 'major, minor, micro.', 'Version tuple.'),
      q('q0105_5', 'Rasmiy Python sayti?', 'Official Python site?', ['python.org', 'python.net', 'py.uz', 'learnpy.com'], ['python.org', 'python.net', 'py.uz', 'learnpy.com'], 0, 'python.org.', 'python.org.'),
    ],
    homework: hw('Muhit Diagnostika Skripti', 'Environment Health Script', 'Python >= 3.10 va UTF-8 ekanini tekshiruvchi skript yozing.', 'Verify Python >= 3.10 and UTF-8 encoding.', ['PASS/FAIL chiqaring', 'json va math import qiling'], ['Print PASS/FAIL', 'Import json and math'], 'sys.version_info >= (3, 10).', 'Check sys.version_info.', 'Yakuniy tayyorlik xulosasi chiqaring.', 'Add readiness banner.', 20),
    reviewCheckpoint: review(
      1,
      '1-Review Loyiha: Kompyuter & Muhit Diagnostika Paneli',
      'Review Project #1: System & Python Environment Inspector',
      '1–5 darslar bo‘yicha xotira hisoblagich, Python 3.10+ tekshiruvi va `compile()` sintaksis validatorini birlashtiring.',
      'Combine lessons 1–5 into a system memory calculator, Python readiness checker, and syntax validator.',
      ['1) Bayt -> MB konverter', '2) Python 3.10+ va UTF-8 tekshiruvi', '3) `compile()` sintaksis validator'],
      ['1) Bytes -> MB converter', '2) Python 3.10+ & UTF-8 check', '3) `compile()` syntax validator'],
      `import sys\ndef bytes_to_mb(b: int) -> float:\n    return round(b / (1024 * 1024), 2)\nprint("Python 3.10+:", sys.version_info >= (3, 10))\nprint("5 MB ->", bytes_to_mb(5_242_880))`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-01-06',
    courseId: 'computer_literacy',
    moduleId: 'c01_m3',
    order: 6,
    titleUz: 'VS Code / PyCharm bilan ishlash',
    titleEn: 'Working Efficiently in VS Code & PyCharm',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-01-05'],
    conceptId: 'ide_workflow',
    whyUz: 'Professional dasturchilar kodni xatolarni oldindan ko‘rsatadigan, avtoto‘ldirish beradigan IDE/muharrirlarda yozadi.',
    whyEn: 'IDEs provide type checking, autocomplete, integrated terminal, and debugging workflows.',
    analogyUz: "Notepad — oddiy qog'oz; VS Code/PyCharm — xatolarni ko'rsatib turuvchi aqlli muharrir.",
    analogyEn: 'Notepad is blank paper; VS Code/PyCharm is a smart cockpit with live instruments.',
    stopsUz: 'IDE sizning o‘rningizga algoritm tuzmaydi — faqat kodlash va xato topishni tezlashtiradi.',
    stopsEn: 'An IDE speeds up editing and debugging, but you design the logic.',
    objUz: ['VS Code va PyCharm farqini bilish', 'Python/Pylance va Auto Save sozlash', 'Asosiy shortcutlarni ishlatish'],
    objEn: ['Compare VS Code and PyCharm', 'Configure Python/Pylance and Auto Save', 'Use productivity shortcuts'],
    theoryUz: `### 1. VS Code vs PyCharm
**VS Code**: yengil va ko‘p tilli; **PyCharm**: Python ga ixtisoslashgan kuchli IDE.
### 2. Muhim sozlamalar
1) **Python** + **Pylance** kengaytmalari; 2) Interpreter tanlash; 3) **Auto Save**.
### 3. Tezkor tugmalar
\`Ctrl+S\` saqlash · \`Ctrl+/\` comment · \`Ctrl+\`\` terminal · \`F5\` debug.
### 4. Linter & Formatter (Ruff/Black)
Kod uslubini avtomatik PEP 8 ga keltiradi.
### 5. Eng katta xato
Faylni saqlamasdan terminalda ishlatish!`,
    theoryEn: `### 1. VS Code vs PyCharm
VS Code is lightweight and extensible; PyCharm offers deep out-of-the-box Python refactoring.
### 2. Setup
Install Microsoft Python + Pylance, select interpreter, enable Auto Save.
### 3. Shortcuts
\`Ctrl+S\` Save · \`Ctrl+/\` Comment · \`Ctrl+\`\` Terminal · \`F5\` Debug.
### 4. Formatting
Use Ruff or Black for PEP 8 compliance.
### 5. Classic Trap
Running unsaved editor buffers from terminal.`,
    examples: [
      ex('Misol 1: PEP 8 toza funksiya', 'Example 1: Clean Typed Function', `def greet_student(name: str, course: str) -> str:\n    return f"{name} -> {course}"\nprint(greet_student("Aziza", "Python"))`, `Aziza -> Python`, 'Type hints Pylance avtoto‘ldirishini kuchaytiradi.', 'Type hints power IDE autocomplete.'),
      ex('Misol 2: `.py` fayllarni ajratish', 'Example 2: Filtering .py Files', `files = ["main.py", "README.md", "utils.py"]\nprint([f for f in files if f.endswith(".py")])`, `['main.py', 'utils.py']`, 'IDE `.py` kengaytmasidan tilni aniqlaydi.', 'IDEs activate Python mode for `.py` files.'),
      ex('Misol 3: Docstring yordam oynasi', 'Example 3: Inspecting Docstring', `def add_tax(p: float) -> float:\n    """QQS qo'shadi."""\n    return round(p * 1.12, 2)\nprint(add_tax.__doc__)\nprint(add_tax(1000))`, `QQS qo'shadi.\n1120.0`, 'IDE hover oynasida `__doc__` matni chiqadi.', 'IDE hover popups read `__doc__`.'),
    ],
    traceTitleUz: 'Funksiyani tekshirish izi',
    traceTitleEn: 'Function Invocation Trace',
    traceCode: `def sq(n: int) -> int:\n    return n * n\nres = sq(6)\nprint(res)`,
    traceSteps: [
      traceStep(1, 'def sq(n: int) -> int:', 'sq=<fn>', 'Funksiya yaratildi', 'Defined function'),
      traceStep(2, 'res = sq(6)', 'res=36', 'Chaqirildi va qaytdi', 'Evaluated 36'),
      traceStep(3, 'print(res)', '36', 'Chiqish', 'Output', '36'),
    ],
    commonMistakes: [
      mistake('Saqlamasdan ishga tushirish', 'Running Unsaved Files', `# Tahrirlandi, Ctrl+S bosilmadi`, 'Old output', `# Auto Save ni yoqing`, 'Terminal diskdagi faylni o‘qiydi.', 'Terminal reads saved disk file.', 'Auto Save yoqing.', 'Enable Auto Save.'),
      mistake('`.py` kengaytmasi yo‘qligi', 'Missing .py Extension', `# Fayl: app`, 'Plain text mode', `# Fayl: app.py`, '`.py` bo‘lmasa IDE Python ni tanimaydi.', 'Editors require `.py` extension.', '`.py` bilan saqlang.', 'Save with `.py`.'),
    ],
    compareTitleUz: 'VS Code vs PyCharm',
    compareTitleEn: 'VS Code vs PyCharm',
    compareUz: ['VS Code: yengil, Docker/Web/Python hammasiga mos.', 'PyCharm: yirik Python backendlar uchun kuchli refactoring.'],
    compareEn: ['VS Code: lightweight multi-language powerhouse.', 'PyCharm: deep Python-first refactoring IDE.'],
    compareSummaryUz: 'Boshlash uchun VS Code + Python/Pylance eng tezkor tanlov.',
    compareSummaryEn: 'VS Code with Python/Pylance is the best lightweight starter.',
    practiceTasks: [
      pt('p0106_1', '1-mashq: `.py` tekshiruvi', 'Task 1: .py Check', '"app.py".endswith(".py") ni chiqaring.', 'Check .py suffix.', `print("app.py".endswith(".py"))`, 'True', '.endswith().', 'Use .endswith().'),
      pt('p0106_2', '2-mashq: Docstring', 'Task 2: Docstring', 'Funksiya `__doc__` ini chiqaring.', 'Print `__doc__`.', `def hi():\n    """Salom"""\nprint(hi.__doc__)`, 'Salom', '__doc__.', 'Access __doc__.'),
      pt('p0106_3', '3-mashq: 4 probel', 'Task 3: Indent', '4 ta probel bilan Indented chiqaring.', 'Print Indented inside if.', `if True:\n    print("Indented")`, 'Indented', '4 probel.', '4 spaces.'),
      pt('p0106_4', '4-mashq: Annotations', 'Task 4: Annotations', 'Qaytarish turini chiqaring.', 'Print return annotation name.', `def d(x: int) -> int:\n    return x * 2\nprint(d.__annotations__["return"].__name__)`, 'int', '__annotations__.', 'Inspect __annotations__.'),
      pt('p0106_5', '5-mashq: Izoh', 'Task 5: Comment', 'Izohdan keyin 10+5 chiqaring.', 'Comment then print 10+5.', `# Izoh\nprint(10 + 5)`, '15', '# ishlating.', 'Use #.'),
    ],
    quiz: [
      q('q0106_1', 'VS Code da Python uchun asosiy kengaytma?', 'Core Python extension in VS Code?', ['HTML', 'Python + Pylance', 'PDF', 'Paint'], ['HTML', 'Python + Pylance', 'PDF', 'Paint'], 1, 'Python + Pylance.', 'Python + Pylance.'),
      q('q0106_2', 'Saqlash shortcuti?', 'Save shortcut?', ['Ctrl+S / Cmd+S', 'Ctrl+Q', 'Alt+F4', 'Esc'], ['Ctrl+S / Cmd+S', 'Ctrl+Q', 'Alt+F4', 'Esc'], 0, 'Ctrl+S / Cmd+S.', 'Ctrl+S / Cmd+S.'),
      q('q0106_3', 'PEP 8 chekinish?', 'PEP 8 indent width?', ['2', '4', '6', '8'], ['2', '4', '6', '8'], 1, '4 probel.', '4 spaces.'),
      q('q0106_4', 'Nega `.py` kerak?', 'Why use `.py`?', ['IDE tilni tanishi uchun', 'Internet uchun', 'RAM uchun', 'Dizayn'], ['IDE language recognition', 'Internet', 'RAM', 'Design'], 0, 'IDE `.py` dan taniydi.', 'IDEs detect Python via `.py`.'),
      q('q0106_5', 'Yengil muharrir?', 'Lighter multi-language editor?', ['VS Code', 'Word', 'Excel', 'Paint'], ['VS Code', 'Word', 'Excel', 'Paint'], 0, 'VS Code.', 'VS Code.'),
    ],
    homework: hw('VS Code ish muhiti', 'Configure VS Code Workspace', '`main.py` ochib Auto Save va type-hint li funksiya sozlang.', 'Set up `main.py` with Auto Save and typed function.', ['4-probel chekinish', 'Docstring bo‘lsin'], ['4-space indent', 'Add docstring'], 'Interpreter tanlang.', 'Select interpreter.', 'Ruff o‘rnating.', 'Try Ruff.', 15),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-01-07',
    courseId: 'computer_literacy',
    moduleId: 'c01_m4',
    order: 7,
    titleUz: 'Terminal va Command Line asoslari',
    titleEn: 'Terminal & Command Line (CLI) Fundamentals',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    prerequisites: ['PY-01-06'],
    conceptId: 'terminal_cli',
    whyUz: 'Serverlar, Git, venv, Docker va avtomatlashtirish skriptlari asosan Terminal (CLI) orqali boshqariladi.',
    whyEn: 'Servers, Git, virtualenvs, and automation rely heavily on CLI workflows.',
    analogyUz: "GUI — rasmlarni bosish; CLI — tez va aniq buyruq berish.",
    analogyEn: 'GUI is clicking menus; CLI is issuing direct repeatable commands.',
    stopsUz: '`rm` buyrug‘i faylni Savatga emas, butunlay o‘chiradi.',
    stopsEn: 'CLI `rm` removes files permanently without Trash.',
    objUz: ['`pwd`, `ls`, `cd`, `mkdir` buyruqlarini bilish', 'Absolute vs Relative yo‘llarni ajratish', '`pathlib.Path` dan foydalanish'],
    objEn: ['Navigate using `pwd`, `ls`, `cd`, `mkdir`', 'Contrast absolute vs relative paths', 'Build portable paths with `pathlib.Path`'],
    theoryUz: `### 1. Terminal nima?
OS bilan matnli buyruqlar orqali muloqot (Bash, Zsh, PowerShell).
### 2. 6 ta asosiy buyruq
\`pwd\` (turgan papka), \`ls\`/\`dir\` (ro‘yxat), \`cd\` (kirish / \`cd ..\` orqaga), \`mkdir\` (yaratish), \`python3 main.py\`, \`clear\`.
### 3. Nisbiy vs Mutlaq yo‘l
Mutlaq (\`/app/main.py\`), Nisbiy (\`./src/main.py\`).
### 4. Tab Autocomplete
Fayl nomini yozishda \`Tab\` ni bosing.
### 5. Keng tarqalgan xato
Noto‘g‘ri papkada turib \`python main.py\` deyish.`,
    theoryEn: `### 1. What Is CLI?
Text shell interface (Bash, Zsh, PowerShell).
### 2. Core Commands
\`pwd\`, \`ls\`, \`cd\`, \`mkdir\`, \`python3\`, \`clear\`.
### 3. Absolute vs Relative Paths
Absolute starts from root; relative starts from \`pwd\`.
### 4. Tab Completion
Press \`Tab\` to complete filenames accurately.
### 5. Classic Mistake
Running scripts from the wrong working directory.`,
    examples: [
      ex('Misol 1: `pathlib.Path` birlashtirish', 'Example 1: Joining Paths with pathlib', `from pathlib import Path\nscript = Path("my_app") / "src" / "main.py"\nprint(script.as_posix())\nprint(script.name)`, `my_app/src/main.py\nmain.py`, '`/` operatori kross-platforma yo‘l yasaydi.', '`/` joins paths cleanly across OSes.'),
      ex('Misol 2: Stem va Suffix', 'Example 2: Stem & Suffix', `from pathlib import Path\np = Path("scripts/analyze.py")\nprint(p.stem, p.suffix)`, `analyze .py`, '`.stem` nomni, `.suffix` kengaytmani beradi.', 'Extract base name and extension.'),
      ex('Misol 3: CLI argumentlari', 'Example 3: Parsing sys.argv Simulation', `def parse_cli(argv):\n    return argv[0], argv[1:]\nprint(parse_cli(["app.py", "--fast", "data.csv"]))`, `('app.py', ['--fast', 'data.csv'])`, 'Birinchi element skript nomi, qolgani argumentlar.', '`argv[0]` is script, `argv[1:]` are flags/args.'),
    ],
    traceTitleUz: 'Path tahlili izi',
    traceTitleEn: 'Tracing Path Components',
    traceCode: `from pathlib import Path\np = Path("src/app.py")\nprint(p.parent, p.name)`,
    traceSteps: [
      traceStep(1, 'p = Path("src/app.py")', 'Path("src/app.py")', 'Path yaratildi', 'Path created'),
      traceStep(2, 'p.parent, p.name', 'src, app.py', 'Qismlar ajratildi', 'Split parent & name'),
      traceStep(3, 'print(...)', 'src app.py', 'Chiqish', 'Output', 'src app.py'),
    ],
    commonMistakes: [
      mistake('Noto‘g‘ri papkada run qilish', 'Wrong Working Directory', `python main.py # not in pwd`, 'No such file or directory', `cd project && python main.py`, 'Shell faqat joriy papkadan qidiradi.', 'Relative path starts at `pwd`.', 'Avval `ls` tekshiring.', 'Check `ls` first.'),
      mistake('Bo‘sh joyli papka nomlari', 'Unquoted Spaces in Folder Names', `cd My Folder`, 'Too many arguments', `cd "My Folder" # yoki my_folder`, 'Bo‘sh joy argumentni ajratadi.', 'Spaces split shell args.', '`snake_case` nom bering.', 'Prefer `snake_case`.'),
    ],
    compareTitleUz: 'Absolute vs Relative Path',
    compareTitleEn: 'Absolute vs Relative Path',
    compareUz: ['Absolute: faqat bitta kompyuterga bog‘liq.', 'Relative: barcha kompyuterda ishlaydi.'],
    compareEn: ['Absolute: machine-specific.', 'Relative: portable across teams.'],
    compareSummaryUz: 'Loyihalarda doim nisbiy yo‘llardan foydalaning.',
    compareSummaryEn: 'Always prefer relative paths in codebases.',
    practiceTasks: [
      pt('p0107_1', '1-mashq: Path qo‘shish', 'Task 1: Join Path', 'Path("data") / "users.json" ni chiqaring.', 'Print as_posix() of data/users.json.', `from pathlib import Path\nprint((Path("data") / "users.json").as_posix())`, 'data/users.json', '/ ishlating.', 'Use /.'),
      pt('p0107_2', '2-mashq: Suffix', 'Task 2: Suffix', 'report.csv kengaytmasini chiqaring.', 'Print suffix of report.csv.', `from pathlib import Path\nprint(Path("report.csv").suffix)`, '.csv', '.suffix.', 'Use .suffix.'),
      pt('p0107_3', '3-mashq: Stem', 'Task 3: Stem', 'lesson_01.py stemini chiqaring.', 'Print stem of lesson_01.py.', `from pathlib import Path\nprint(Path("lesson_01.py").stem)`, 'lesson_01', '.stem.', 'Use .stem.'),
      pt('p0107_4', '4-mashq: is_absolute', 'Task 4: is_absolute', 'Path("app.py").is_absolute() ni chiqaring.', 'Check is_absolute.', `from pathlib import Path\nprint(Path("app.py").is_absolute())`, 'False', '.is_absolute().', 'Call .is_absolute().'),
      pt('p0107_5', '5-mashq: Argv soni', 'Task 5: Flags Count', 'Argumentlar sonini chiqaring.', 'Count args after script name.', `argv = ["main.py", "--dry", "--fast"]\nprint(len(argv[1:]))`, '2', 'len(argv[1:]).', 'Slice argv[1:].'),
    ],
    quiz: [
      q('q0107_1', 'Joriy papkani ko‘rsatuvchi buyruq?', 'Command for working directory?', ['cd', 'pwd', 'mkdir', 'rm'], ['cd', 'pwd', 'mkdir', 'rm'], 1, '`pwd`.', '`pwd`.'),
      q('q0107_2', 'Ota papkaga qaytish?', 'Move one directory up?', ['cd .', 'cd ..', 'ls ..', 'up'], ['cd .', 'cd ..', 'ls ..', 'up'], 1, '`cd ..`.', '`cd ..`.'),
      q('q0107_3', 'Papka yaratish?', 'Create directory?', ['mkdir', 'pwd', 'cat', 'echo'], ['mkdir', 'pwd', 'cat', 'echo'], 0, '`mkdir`.', '`mkdir`.'),
      q('q0107_4', 'Nisbiy yo‘l afzalligi?', 'Why relative paths?', ['Portativlik', 'Faqat Windows', 'Tez internet', 'Yo‘q'], ['Portability across machines', 'Windows only', 'Speed', 'None'], 0, 'Har kompyuterda ishlaydi.', 'Portable.'),
      q('q0107_5', 'Autocomplete tugmasi?', 'Autocomplete key?', ['Tab', 'Shift', 'Esc', 'Alt'], ['Tab', 'Shift', 'Esc', 'Alt'], 0, '`Tab`.', '`Tab`.'),
    ],
    homework: hw('Terminalda papka tuzilmasi', 'CLI Directory Exercise', '`mkdir python_practice && cd python_practice` bilan `src/hello.py` yarating.', 'Create `python_practice/src/hello.py` via CLI.', ['pwd va ls bilan tekshiring', 'Nisbiy yo‘l bilan ishga tushiring'], ['Check pwd/ls', 'Run relative'], 'snake_case ishlating.', 'Use snake_case.', 'Path.parts ni chop eting.', 'Print Path.parts.', 15),
    relatedVideos: ['VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-01-08',
    courseId: 'computer_literacy',
    moduleId: 'c01_m4',
    order: 8,
    titleUz: 'Birinchi Python dasturini yaratish',
    titleEn: 'Creating and Running Your First Python Program',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    prerequisites: ['PY-01-07'],
    conceptId: 'first_python_program',
    whyUz: 'Nazariyadan amaliyotga o‘tib ilk `.py` skriptingizni xatosiz (Exit Code 0) ishga tushirasiz.',
    whyEn: 'Writing and running your first complete `.py` script confirms your end-to-end toolchain.',
    analogyUz: "Birinchi mustaqil parvoz kabi — qisqa, lekin barcha tizimlar ishlashini ko'rsatadi.",
    analogyEn: 'Like a pilot’s first solo takeoff: simple yet proves all systems work together.',
    stopsUz: 'Katta tizimlar ham shu ilk `.py` fayl va `print()` dan boshlanadi.',
    stopsEn: 'Complex platforms start from the same `.py` execution entry point.',
    objUz: ['Birinchi `.py` dasturini yaratish', 'F-string va arifmetikani birlashtirish', 'Exit Code 0 maʼnosini bilish'],
    objEn: ['Write and execute your first `.py` program', 'Combine f-strings and math', 'Understand Exit Code 0'],
    theoryUz: `### 1. Ilk dastur anatomiyasi
\`print()\` va o'zgaruvchilar yordamida foydali natija chiqaramiz.
### 2. F-string bilan tanishuv
\`f"Salom, {name}!"\` eng toza formatlash usuli.
### 3. Edit → Save → Run
\`hello.py\` yozish -> saqlash -> \`python3 hello.py\` -> **Exit Code 0**.
### 4. REPL vs \`.py\` Script
REPL tezkor sinov uchun, \`.py\` esa saqlanadigan haqiqiy dastur uchun.
### 5. Tabriklaymiz!
1-kurs yakunlandi — 2-kurs **Python Fundamentals** ga tayyorsiz.`,
    theoryEn: `### 1. Anatomy of Your First Script
Combine variables, arithmetic, and \`print()\`.
### 2. F-Strings
\`f"Hello, {name}!"\` cleanly formats variables.
### 3. Edit -> Save -> Run
Exit Code 0 signals clean completion.
### 4. REPL vs \`.py\` Scripts
Use REPL for quick tests and \`.py\` files for reusable scripts.
### 5. Course Complete!
You are ready for Course 2: Python Fundamentals.`,
    examples: [
      ex('Misol 1: Hello World', 'Example 1: Welcome Banner', `print("Assalomu alaykum, Python!")\nprint("1-kurs tugadi.")`, `Assalomu alaykum, Python!\n1-kurs tugadi.`, 'Har `print()` yangi qator chiqaradi.', 'Each `print()` emits a line.'),
      ex('Misol 2: F-string vizitka', 'Example 2: F-String Card', `learner = "Jasur"\ntopics = 8\nprint(f"{learner}: {topics} ta mavzu tugadi!")`, `Jasur: 8 ta mavzu tugadi!`, 'F-string `{}` ichidagi qiymatni qo‘yadi.', 'Interpolates values inside `{}`.'),
      ex('Misol 3: Progress foizi', 'Example 3: Progress Calculator', `done = 1\ntotal = 17\npct = round((done / total) * 100, 1)\nprint(f"Progress: {pct}%")`, `Progress: 5.9%`, 'O‘zgaruvchi + bo‘lish + yaxlitlash.', 'Combines math and formatting.'),
    ],
    traceTitleUz: 'Ilk dastur izi',
    traceTitleEn: 'First Program Trace',
    traceCode: `name = "Diyor"\nlessons = 8\nprint(f"{name}: {lessons} dars")`,
    traceSteps: [
      traceStep(1, 'name = "Diyor"', 'name="Diyor"', 'Matn saqlandi', 'String stored'),
      traceStep(2, 'lessons = 8', 'lessons=8', 'Son saqlandi', 'Int stored'),
      traceStep(3, 'print(...)', '-', 'Chiqish', 'Output', 'Diyor: 8 dars'),
    ],
    commonMistakes: [
      mistake('Yopilmagan qo‘shtirnoq', 'Unclosed String Quote', `print("Salom)`, 'SyntaxError', `print("Salom")`, 'Qo‘shtirnoq yopilishi shart.', 'Quotes must close.', 'Juft qilib yozing.', 'Always match quotes.'),
      mistake('`f` harfini unutish', 'Forgetting f in F-String', `x = 10\nprint("x={x}")`, 'Prints {x} literally', `x = 10\nprint(f"x={x}")`, '`f` bo‘lmasa `{x}` oddiy matn bo‘ladi.', 'Without `f`, braces are literal.', '`f"..."` yozing.', 'Prefix with `f`.'),
    ],
    compareTitleUz: 'REPL vs `.py` Skript',
    compareTitleEn: 'REPL vs `.py` Script',
    compareUz: ['REPL: 1-qatorli sinov.', '`.py`: saqlanadigan dastur.'],
    compareEn: ['REPL: quick checks.', '`.py`: reusable programs.'],
    compareSummaryUz: 'Haqiqiy dasturlarni `.py` faylda saqlang.',
    compareSummaryEn: 'Save real programs in `.py` files.',
    practiceTasks: [
      pt('p0108_1', '1-mashq: Hello', 'Task 1: Hello', 'Hello, Python Mastery! chiqaring.', 'Print Hello, Python Mastery!.', `print("Hello, Python Mastery!")`, 'Hello, Python Mastery!', 'print().', 'Use print().'),
      pt('p0108_2', '2-mashq: F-string', 'Task 2: F-String', 'Manzil: Toshkent chiqaring.', 'Print Manzil: Toshkent.', `city = "Toshkent"\nprint(f"Manzil: {city}")`, 'Manzil: Toshkent', 'f-string.', 'Use f-string.'),
      pt('p0108_3', '3-mashq: Ikki qator', 'Task 3: Two Lines', '1 va 2 ni alohida chiqaring.', 'Print 1 and 2.', `print(1)\nprint(2)`, '1\n2', '2 marta print().', 'Two print calls.'),
      pt('p0108_4', '4-mashq: Arifmetika', 'Task 4: Inline Math', 'Natija: 60 chiqaring.', 'Print Natija: 60.', `print(f"Natija: {5 * 12}")`, 'Natija: 60', '5 * 12.', 'Use {5 * 12}.'),
      pt('p0108_5', '5-mashq: OK belgisi', 'Task 5: Banner', '1-kurs: OK chiqaring.', 'Print 1-kurs: OK.', `s = "OK"\nprint(f"1-kurs: {s}")`, '1-kurs: OK', 'f-string.', 'Use f-string.'),
    ],
    quiz: [
      q('q0108_1', 'Python skript kengaytmasi?', 'Python script extension?', ['.txt', '.py', '.pt', '.exe'], ['.txt', '.py', '.pt', '.exe'], 1, '`.py`.', '`.py`.'),
      q('q0108_2', '`print(f"{2 + 3}")` natijasi?', 'Output of `print(f"{2 + 3}")`?', ['{2 + 3}', '5', '23', 'Error'], ['{2 + 3}', '5', '23', 'Error'], 1, '5.', '5.'),
      q('q0108_3', 'Muvaffaqiyatli exit code?', 'Success exit code?', ['1', '0', '-1', '404'], ['1', '0', '-1', '404'], 1, '0.', '0.'),
      q('q0108_4', 'REPL kamchiligi?', 'REPL drawback?', ['Saqlanmaydi', 'Sekin', 'Son yo‘q', 'Xato yo‘q'], ['Does not persist code', 'Slow', 'No numbers', 'No errors'], 0, 'Saqlanmaydi.', 'Not saved.'),
      q('q0108_5', '`print("Salom)` xatosi?', 'Error in `print("Salom)`?', ['TypeError', 'SyntaxError', 'NameError', 'ValueError'], ['TypeError', 'SyntaxError', 'NameError', 'ValueError'], 1, 'SyntaxError.', 'SyntaxError.'),
    ],
    homework: hw('Shaxsiy Maqsad Vizitkasi', 'Personal Learning Card', 'Ismingiz, maqsadingiz va kunlik daqiqangizni chiqaring.', 'Print your name, goal, and daily target.', ['4 ta o‘zgaruvchi', 'Chiroyli ramka'], ['4 variables', 'ASCII border'], '"=" * 40 ishlating.', 'Use "=" * 40.', 'Oylik soatni ham hisoblang.', 'Compute monthly hours.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-FCC-001'],
  }),
];
