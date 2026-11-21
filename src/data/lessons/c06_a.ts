import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C06_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-06-01',
    courseId: 'files_io',
    moduleId: 'c06_m1',
    order: 1,
    titleUz: 'File Handling asoslari — doimiy xotira va UTF-8',
    titleEn: 'File Handling Foundations: Streams, Paths & UTF-8 Encoding',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-05-12'],
    conceptId: 'file_handling_basics',
    whyUz: "Hozirgacha o‘zgaruvchilardagi hamma ma’lumot dastur tugashi bilan RAM dan o‘chib ketardi. Haqiqiy dasturlar foydalanuvchi yozuvlari, loglar, CSV/JSON bazalarni diskdagi **fayllarda** doimiy saqlaydi.",
    whyEn: 'RAM vanishes on exit; File I/O persists logs, configs, reports, and datasets durably on disk across program runs.',
    analogyUz: "RAM — bu stol ustidagi qoralama daftar (kompyuter o‘chsa tozalanadi). Diskdagi fayl esa arxiv javonidagi muhrlangan jild; `encoding=\"utf-8\"` esa o‘zbek/ingliz harflarini to‘g‘ri o‘qiydigan alifbo kaliti.",
    analogyEn: 'RAM is a scratchpad wiped at power-off; files are filing cabinets on disk, and `encoding="utf-8"` is the alphabet key that decodes Unicode cleanly.',
    stopsUz: "Windows da `encoding=\"utf-8\"` ko‘rsatmasangiz, Python eski tizim kodirovkasini (`cp1251` / `cp1252`) ishlatib o‘zbekcha `o‘`, `g‘` yoki emojilarda `UnicodeDecodeError` / `UnicodeEncodeError` chiqaradi!",
    stopsEn: 'Always pass `encoding="utf-8"` on text files; omitting it uses OS locale defaults (like `cp1252` on Windows) and crashes on Unicode text.',
    objUz: ['Matn (`text`) va ikkilik (`binary`) fayl oqimlari farqini tushunish', 'Nima uchun har doim `encoding="utf-8"` yozish shartligini bilish', 'Relative vs Absolute yo‘llar hamda OS qator tugashi (`\\n` vs `\\r\\n`) ni ajratish'],
    objEn: ['Distinguish text streams (`str`) from binary streams (`bytes`)', 'Enforce `encoding="utf-8"` for cross-platform safety', 'Compare relative and absolute paths cleanly'],
    theoryUz: `### 1. Fayl Nima?
Diskdagi nomlangan baytlar ketma-ketligi. Dastur faylni ochganda OS **file descriptor** (oqim ko‘rsatkichi) ajratadi.
### 2. Text vs Binary Oqimlar
- **Text mode** (\`"r"\`, \`"w"\`): baytlarni avtomatik \`str\` ga dekodlaydi (\`encoding="utf-8"\`) va \`\\r\\n\` ni \`\\n\` ga moslaydi.
- **Binary mode** (\`"rb"\`, \`"wb"\`): rasmlar, PDF, ZIP uchun xom \`bytes\` qaytaradi (encoding olmaydi!).
### 3. Nima Uchun \`encoding="utf-8"\` Majburiy?
Linux/macOS standartda UTF-8 ishlatsa, Windows eski codepage ishlatishi mumkin. Yagona kross-platforma standart — **UTF-8**.
### 4. Nisbiy (Relative) vs Mutlaq (Absolute) Yo‘l
\`data/users.txt\` — joriy papkaga nisbatan; \`/app/data/users.txt\` — ildizdan boshlab mutlaq yo‘l.
### 5. Keng tarqalgan xato
\`open("uz_text.txt")\` da \`encoding="utf-8"\` yozmaslik va Windows da krill/lotin belgilarida xato olish.`,
    theoryEn: `### 1. Files & OS Descriptors
Opening a file requests a file handle from the OS kernel.
### 2. Text vs Binary Mode
Text mode decodes bytes into \`str\` via encoding; binary mode (\`b\`) reads raw \`bytes\`.
### 3. Why Always \`encoding="utf-8"\`
Prevents platform-dependent \`UnicodeDecodeError\` crashes on Windows.
### 4. Relative vs Absolute Paths
Prefer \`pathlib.Path\` over brittle string concatenation.
### 5. In-Memory Simulation (\`io.StringIO\`)
Python’s \`io.StringIO\` behaves identically to a text file handle—great for unit tests!`,
    examples: [
      ex('Misol 1: `tempfile` bilan xavfsiz fayl yaratish va UTF-8 o‘qish', 'Example 1: Safe Temp File with UTF-8', `import tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as tmp:\n    p = Path(tmp) / "salom.txt"\n    p.write_text("O‘zbekiston — Python!", encoding="utf-8")\n    print(p.read_text(encoding="utf-8"))`, `O‘zbekiston — Python!`, 'UTF-8 tufayli maxsus tirnoq va tire belgilari xatosiz saqlandi.', 'UTF-8 preserved Unicode punctuation accurately across write/read.'),
      ex('Misol 2: `io.StringIO` bilan fayl oqimini simulyatsiya qilish', 'Example 2: File-Like Text Stream (StringIO)', `import io\n\nbuf = io.StringIO("line1\\nline2\\n")\nlines = [line.strip() for line in buf]\nprint(lines)`, `['line1', 'line2']`, '`StringIO` haqiqiy fayl obyektidek `.readline()` va iteratsiyani qo‘llaydi.', '`StringIO` exposes the exact same file stream protocol in memory.'),
      ex('Misol 3: Text (`str`) vs Binary (`bytes`) encode/decode', 'Example 3: UTF-8 Bytes vs String', `text = "Py-2026"\nraw = text.encode("utf-8")\nprint(type(raw).__name__, len(raw), raw.decode("utf-8"))`, `bytes 7 Py-2026`, 'Matn diskda bayt (`bytes`) shaklida saqlanadi.', 'Text encodes to raw UTF-8 bytes before hitting storage.'),
    ],
    traceTitleUz: 'Text encode/decode oqimi',
    traceTitleEn: 'Tracing UTF-8 Encode/Decode',
    traceCode: `b = "Salom".encode("utf-8")\nprint(b, b.decode("utf-8"))`,
    traceSteps: [
      traceStep(1, '"Salom".encode("utf-8")', "b'Salom'", 'Str baytlarga o‘girildi', 'Encoded str to UTF-8 bytes'),
      traceStep(2, 'b.decode("utf-8")', '"Salom"', 'Baytlar yana matnga qaytdi', 'Decoded back to str', "b'Salom' Salom"),
    ],
    commonMistakes: [
      mistake('`encoding="utf-8"` ni unutish', 'Omitting encoding="utf-8"', `with open("log.txt", "w") as f:\n    f.write("O‘zbek")`, 'May fail with UnicodeEncodeError on cp1252 Windows systems', `import tempfile, pathlib\nwith tempfile.TemporaryDirectory() as d:\n    p = pathlib.Path(d) / "log.txt"\n    with open(p, "w", encoding="utf-8") as f:\n        f.write("O‘zbek")\n    print(open(p, encoding="utf-8").read())`, 'Har doim tizim kodirovkasiga tayanmang.', 'System default encodings vary across OS locales.', 'Matn fayllarida doim `encoding="utf-8"` bering.', 'Always specify `encoding="utf-8"`.'),
      mistake('Yo‘llarni `+ "\\\\"` bilan qo‘lda ulash', 'Hardcoding Backslashes', `path = "data\\\\users.txt"`, 'Breaks on Linux/macOS or creates \\u escapes', `from pathlib import Path\npath = Path("data") / "users.txt"\nprint(path.as_posix())`, 'Windows va Linux separatorlari har xil (`\\` vs `/`).', 'OS separators differ; raw backslashes trigger escapes.', '`pathlib.Path("data") / "users.txt"` ishlating.', 'Use `pathlib.Path` `/` operator.'),
    ],
    compareTitleUz: 'Text Mode (`"r"`) vs Binary Mode (`"rb"`)',
    compareTitleEn: 'Text Mode vs Binary Mode',
    compareUz: ['Text Mode (`"r"`, `"w"`): matn, CSV, JSON, loglar uchun — `str` va `encoding="utf-8"`.', 'Binary Mode (`"rb"`, `"wb"`): rasm, audio, PDF, pickle uchun — xom `bytes`.'],
    compareEn: ['Text mode: logs, JSON, CSV; yields `str` using `encoding="utf-8"`.', 'Binary mode: images, PDFs, archives; yields raw `bytes`.'],
    compareSummaryUz: 'Matn fayllari uchun doim text mode + `encoding="utf-8"`, media/arxivlar uchun binary mode tanlang.',
    compareSummaryEn: 'Use text mode with UTF-8 for human-readable files and binary mode for raw payloads.',
    practiceTasks: [
      pt('p0601_1', '1-mashq: UTF-8 Encode', 'Task 1: UTF-8 Bytes', '`"Ali"` matnini `.encode("utf-8")` qilib uzunligini chiqaring.', 'Print byte length of "Ali".', `print(len("Ali".encode("utf-8")))`, '3', '.encode("utf-8")', 'Check len().'),
      pt('p0601_2', '2-mashq: `StringIO` o‘qish', 'Task 2: Read StringIO', '`io.StringIO("a\\nb")` dan satrlar sonini chiqaring.', 'Count lines from StringIO.', `import io\ns = io.StringIO("a\\nb")\nprint(len(s.readlines()))`, '2', 's.readlines()', 'Count lines.'),
      pt('p0601_3', '3-mashq: Temp fayl yozish', 'Task 3: Temp Write & Read', '`tempfile.TemporaryDirectory()` da `a.txt` yozib UTF-8 bilan o‘qing.', 'Write and read back via Path.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as t:\n    f = Path(t) / "a.txt"\n    f.write_text("Salom", encoding="utf-8")\n    print(f.read_text(encoding="utf-8"))`, 'Salom', 'write_text + read_text', 'Use UTF-8.'),
      pt('p0601_4', '4-mashq: Baytdan matnga', 'Task 4: Decode Bytes', '`b"Python".decode("utf-8")` ni chiqaring.', 'Decode bytes literal.', `print(b"Python".decode("utf-8"))`, 'Python', '.decode("utf-8")', 'Print decoded string.'),
      pt('p0601_5', '5-mashq: Path birlashtirish', 'Task 5: Posix Path', '`Path("logs") / "app.log"` ning `.as_posix()` qiymatini chiqaring.', 'Join path cleanly.', `from pathlib import Path\nprint((Path("logs") / "app.log").as_posix())`, 'logs/app.log', 'Path("logs") / "app.log"', 'Print .as_posix().'),
    ],
    quiz: [
      q('q0601_1', 'Matn fayllarini ochishda qaysi kodirovka standart sifatida tavsiya etiladi?', 'Recommended text encoding standard?', ['ascii', 'utf-8', 'cp1251', 'latin1'], ['ascii', 'utf-8', 'cp1251', 'latin1'], 1, '`encoding="utf-8"`.', '`utf-8`.'),
      q('q0601_2', 'Binary rejimda (`"rb"`) fayldan qanday turdagi ma’lumot o‘qiladi?', 'Return type when reading in `"rb"` mode?', ['str', 'bytes', 'list', 'int'], ['str', 'bytes', 'list', 'int'], 1, 'Xom `bytes`.', 'Raw `bytes`.'),
      q('q0601_3', 'Binary rejimda `encoding="utf-8"` parametrini berish mumkinmi?', 'Can `encoding=` be passed in binary mode?', ['Ha', 'Yo‘q, ValueError beradi', 'Faqat Windows da', 'Faqat yozishda'], ['Yes', 'No, raises ValueError', 'Windows only', 'Write only'], 1, 'Yo‘q, `ValueError: binary mode doesn’t take an encoding argument`.', 'Raises `ValueError`.'),
      q('q0601_4', 'Diskdagi fayl nima uchun RAM dagi o‘zgaruvchidan farq qiladi?', 'Key advantage of files over RAM variables?', ['Tezroq', 'Dastur yopilgach ham saqlanib qoladi (persistent)', 'Faqat int saqlaydi', 'O‘chib ketadi'], ['Faster', 'Persists after program exits', 'Ints only', 'Volatile'], 1, 'Doimiy saqlanish (persistence).', 'Persistence across restarts.'),
      q('q0601_5', 'Testlarda xotira ichida fayl oqimini simulyatsiya qiluvchi standart klass?', 'In-memory text file stream in stdlib?', ['io.StringIO', 'sys.File', 'os.Buffer', 'json.Stream'], ['io.StringIO', 'sys.File', 'os.Buffer', 'json.Stream'], 0, '`io.StringIO`.', '`io.StringIO`.'),
    ],
    homework: hw('UTF-8 Kodlash va Oqim Tahlili', 'UTF-8 Byte Inspector', 'O‘zbekcha va emojili 3 ta matnni `utf-8` ga o‘girib ularning belgilar soni (`len(s)`) vs bayt uzunligi (`len(b)`) farqini ko‘rsatuvchi skript yozing.', 'Compare character length vs UTF-8 byte length across Unicode Uzbek strings and emojis.', ['encoding="utf-8" ishlatilsin', 'Qayta decode qilib tengligini tekshiring'], ['Use utf-8', 'Verify round-trip decode'], 'b = s.encode("utf-8"); assert b.decode("utf-8") == s', 'Compare len(s) and len(b).', 'Natijani `io.StringIO` oqimiga yozib qayta o‘qing.', 'Write report to `StringIO` and read back.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-06-02',
    courseId: 'files_io',
    moduleId: 'c06_m1',
    order: 2,
    titleUz: 'Fayllarni ochish, rejimlar (`r/w/a/x`) va yopish',
    titleEn: 'Opening & Closing Files: Modes (`r`, `w`, `a`, `x`) & Resource Leaks',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-06-01'],
    conceptId: 'open_close_modes',
    whyUz: "`open(\"users.txt\", \"w\")` deb yozganingizda fayldagi BARCHA eski ma’lumot bir lahzada o‘chib ketishini bilmasangiz, ishlab chiqarishdagi muhim fayllarni yo‘qotishingiz mumkin!",
    whyEn: 'Understanding `r`, `w`, `a`, and `x` open modes prevents accidental file truncation and OS file-descriptor leaks.',
    analogyUz: "`\"r\"` — faqat o‘qish (muzey eksponati); `\"w\"` — doskani artib **noldan** yozish (truncate); `\"a\"` — daftar oxiridan davom ettirish (append); `\"x\"` — faqat bo‘sh stolga yangi daftar qo‘yish (bor bo‘lsa rad etadi).",
    analogyEn: '`r` reads only; `w` wipes the slate clean; `a` appends at the end; `x` creates exclusively if missing.',
    stopsUz: "1) `\"w\"` mavjud faylni **bo‘shatib (truncate)** tashlaydi! 2) `f = open(...)` qilib `f.close()` ni unutsangiz (yoki o‘rtada xato chiqsa), ma’lumot diskka yozilmay (bufferda) qolishi va OS file descriptor limiti tugashi mumkin!",
    stopsEn: '`w` truncates existing files immediately; unclosed file handles risk unflushed buffers and descriptor exhaustion.',
    objUz: ['`r`, `w`, `a`, `x` va `+` (`r+`, `a+`) rejimlarini aniq farqlash', '`f.close()` va `try ... finally: f.close()` mexanizmini tushunish', '`FileNotFoundError` va `FileExistsError` xatolarini boshqarish'],
    objEn: ['Choose accurately among `r`, `w`, `a`, `x`, and `+` modes', 'Ensure deterministic closing with `try/finally` (motivating `with`)', 'Handle missing/existing file errors cleanly'],
    theoryUz: `### 1. Asosiy Ochish Rejimlari
| Rejim | Vazifasi | Fayl yo‘q bo‘lsa | Fayl bor bo‘lsa |
|---|---|---|---|
| \`"r"\` | O‘qish (default) | \`FileNotFoundError\` | Boshidan o‘qiydi |
| \`"w"\` | Yozish (overwrite) | Yangi yaratadi | **Eskisini o‘chiradi!** |
| \`"a"\` | Qo‘shish (append) | Yangi yaratadi | Oxiriga qo‘shadi |
| \`"x"\` | Exclusive create | Yangi yaratadi | \`FileExistsError\` |
### 2. Nima Uchun \`f.close()\` Shart?
Python yozishni tezlatish uchun ma’lumotni avval **buffer** ga yig‘adi. \`f.close()\` buffer ni diskka to‘kadi (flush) va OS resursini bo‘shatadi.
### 3. \`try / finally\` Himoyasi
\`f.close()\` dan oldin xato yuz bersa fayl ochiq qoladi. Shuning uchun \`try: ... finally: f.close()\` (yoki keyingi darsdagi \`with\`) ishlatiladi!
### 4. \`f.closed\` Atributi
Fayl yopilganmi yo‘qmi \`f.closed\` (\`True/False\`) bilan tekshiriladi.
### 5. Keng tarqalgan xato
Ma’lumot qo‘shmoqchi bo‘lib \`"a"\` o‘rniga \`"w"\` yozib qo‘yish.`,
    theoryEn: `### 1. Core File Modes
\`r\` (read), \`w\` (create/truncate), \`a\` (create/append), \`x\` (exclusive create failing if exists).
### 2. Why Closing Matters
Flushes write buffers to disk and frees OS file descriptors.
### 3. \`try / finally\` Pattern
Ensures \`f.close()\` runs even when exceptions occur before \`with\` syntax.
### 4. Inspecting State
Check \`f.closed\` to verify stream closure.
### 5. Truncation Risk
Opening with \`"w"\` immediately erases existing file contents.`,
    examples: [
      ex('Misol 1: `"w"` vs `"a"` rejimlar farqi', 'Example 1: Write vs Append Modes', `import tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as tmp:\n    p = Path(tmp) / "notes.txt"\n    f = open(p, "w", encoding="utf-8")\n    f.write("1-qator\\n")\n    f.close()\n    f = open(p, "a", encoding="utf-8")\n    f.write("2-qator\\n")\n    f.close()\n    print(p.read_text(encoding="utf-8").strip())`, `1-qator\n2-qator`, '`"w"` birinchi qatorni yaratdi, `"a"` esa eskisini o‘chirmay 2-qatorni qo‘shdi.', '`"w"` created the file; `"a"` preserved line 1 and appended line 2.'),
      ex('Misol 2: `"x"` eksklyuziv yaratish va `FileExistsError`', 'Example 2: Exclusive Mode "x"', `import tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as tmp:\n    p = Path(tmp) / "lock.txt"\n    open(p, "x", encoding="utf-8").close()\n    try:\n        open(p, "x", encoding="utf-8")\n    except FileExistsError:\n        print("Already exists! Protected from overwrite.")`, `Already exists! Protected from overwrite.`, '`"x"` mavjud faylni tasodifan ustidan yozib yuborishdan saqlaydi.', 'Mode `"x"` raises `FileExistsError` if target exists.'),
      ex('Misol 3: `try / finally` bilan kafolatlangan yopish', 'Example 3: Guaranteed Close via finally', `import io\nf = io.StringIO("data")\ntry:\n    print("Read:", f.read(), "| Closed yet?", f.closed)\nfinally:\n    f.close()\nprint("After finally closed?", f.closed)`, `Read: data | Closed yet? False\nAfter finally closed? True`, '`finally` bloki har qanday holatda `f.close()` ni chaqiradi.', '`finally` guarantees handle release even on errors.'),
    ],
    traceTitleUz: 'Fayl yopilish holati izi',
    traceTitleEn: 'Tracing File Handle Lifecycle',
    traceCode: `import io\nf = io.StringIO("ok")\nprint(f.closed)\nf.close()\nprint(f.closed)`,
    traceSteps: [
      traceStep(1, 'f = io.StringIO("ok")', 'closed=False', 'Oqim ochildi', 'Stream opened'),
      traceStep(2, 'print(f.closed)', 'False', 'Hali ochiq', 'Still open', 'False'),
      traceStep(3, 'f.close()', 'closed=True', 'Oqim yopildi', 'Stream closed'),
      traceStep(4, 'print(f.closed)', 'True', 'Yopilgani tasdiqlandi', 'Confirmed closed', 'True'),
    ],
    commonMistakes: [
      mistake('Log qo‘shishda `"w"` ishlatib eski loglarni o‘chirib yuborish', 'Overwriting Logs with Mode "w"', `open("app.log", "w")`, 'Erases all previous log history immediately!', `# Use "a" to preserve history\nmode = "a"`, '`"w"` har ochilganda faylni 0 bayt qiladi.', '`"w"` truncates on open.', 'Tarix saqlashda doim `"a"` (append) ishlating.', 'Use `"a"` for appending.'),
      mistake('`f.close()` ni qavssiz yozish (`f.close`)', 'Forgetting Parentheses on f.close()', `f.close`, 'Does nothing—only references the method!', `import io\nf = io.StringIO("a")\nf.close()\nprint(f.closed)`, '`f.close` bu metodga havola, chaqiruv emas.', '`f.close` without `()` never closes the file.', 'Keyingi darsda o‘rganiladigan `with` avtomatik yopadi.', 'Prefer `with` context managers.'),
    ],
    compareTitleUz: '`"w"` vs `"a"` vs `"x"`',
    compareTitleEn: '`"w"` vs `"a"` vs `"x"`',
    compareUz: ['`"w"`: faylni noldan yozish (eski tarkib o‘chadi).', '`"a"`: oxiridan qo‘shib borish (loglar uchun).', '`"x"`: faqat yangi bo‘lsa yaratish (ustiga yozishni taqiqlaydi).'],
    compareEn: ['`"w"`: overwrite/truncate.', '`"a"`: append at EOF.', '`"x"`: fail safely if file already exists.'],
    compareSummaryUz: 'Qayta yozishda `"w"`, qo‘shishda `"a"`, mavjud faylni himoyalashda `"x"` tanlang.',
    compareSummaryEn: 'Choose `"w"` to replace, `"a"` to append, and `"x"` to guard against overwriting.',
    practiceTasks: [
      pt('p0602_1', '1-mashq: `"w"` va `"a"`', 'Task 1: Write then Append', 'Temp faylga `"w"` bilan `"1"`, `"a"` bilan `"2"` yozib o‘qing.', 'Write 1 then append 2.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as t:\n    p = Path(t) / "f.txt"\n    f = open(p, "w", encoding="utf-8"); f.write("1"); f.close()\n    f = open(p, "a", encoding="utf-8"); f.write("2"); f.close()\n    print(p.read_text(encoding="utf-8"))`, '12', 'Open "w" then "a".', 'Close handles.'),
      pt('p0602_2', '2-mashq: `"x"` xatosi', 'Task 2: Exclusive Error', 'Mavjud temp faylni `"x"` bilan ochib `FileExistsError` tuting.', 'Catch FileExistsError on mode "x".', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as t:\n    p = Path(t) / "x.txt"\n    open(p, "w", encoding="utf-8").close()\n    try:\n        open(p, "x", encoding="utf-8")\n    except FileExistsError:\n        print("exists")`, 'exists', 'try/except FileExistsError', 'Test mode "x".'),
      pt('p0602_3', '3-mashq: Yo‘q faylni `"r"` qilish', 'Task 3: Missing Read', 'Mavjud bo‘lmagan faylni `"r"` bilan ochishda `FileNotFoundError` tuting.', 'Catch FileNotFoundError.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as t:\n    try:\n        open(Path(t) / "nope.txt", "r", encoding="utf-8")\n    except FileNotFoundError:\n        print("missing")`, 'missing', 'except FileNotFoundError', 'Handle cleanly.'),
      pt('p0602_4', '4-mashq: `f.closed` tekshiruvi', 'Task 4: Check Closed', '`StringIO` ni `try/finally` da yopib `f.closed` ni chiqaring.', 'Close in finally and print f.closed.', `import io\nf = io.StringIO("x")\ntry:\n    pass\nfinally:\n    f.close()\nprint(f.closed)`, 'True', 'finally: f.close()', 'Print f.closed.'),
      pt('p0602_5', '5-mashq: `"w"` truncate', 'Task 5: Mode w Overwrite', 'Oldin `"hello"`, keyin `"w"` bilan `"ok"` yozib natijani chiqaring.', 'Verify "w" overwrites old content.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as t:\n    p = Path(t) / "o.txt"\n    p.write_text("hello", encoding="utf-8")\n    f = open(p, "w", encoding="utf-8"); f.write("ok"); f.close()\n    print(p.read_text(encoding="utf-8"))`, 'ok', 'Mode "w" truncates.', 'Read back "ok".'),
    ],
    quiz: [
      q('q0602_1', 'Mavjud faylning mazmunini o‘chirib yangidan yozadigan rejim?', 'Mode that truncates an existing file?', ['r', 'w', 'a', 'x'], ['r', 'w', 'a', 'x'], 1, '`"w"` (write).', '`"w"`.'),
      q('q0602_2', 'Fayl allaqachon bor bo‘lsa `FileExistsError` beradigan rejim?', 'Mode raising `FileExistsError` if file exists?', ['r', 'w', 'a', 'x'], ['r', 'w', 'a', 'x'], 3, '`"x"` (exclusive create).', '`"x"`.'),
      q('q0602_3', 'Fayl oxiriga ma’lumot qo‘shib borish rejimi?', 'Mode for appending to end of file?', ['r', 'w', 'a', 'b'], ['r', 'w', 'a', 'b'], 2, '`"a"` (append).', '`"a"`.'),
      q('q0602_4', '`open("a.txt")` rejim ko‘rsatilmasa standart qaysi rejimda ochadi?', 'Default mode when omitted in `open("a.txt")`?', ['w', 'r', 'a', 'rb'], ['w', 'r', 'a', 'rb'], 1, 'Standart rejim `"r"` (text read).', 'Default is `"r"`.'),
      q('q0602_5', 'Nima uchun `f.close()` zarur?', 'Why must open file handles be closed?', ['Buffer diskka yozilishi va OS resursi bo‘shashi uchun', 'Fayl nomini o‘zgartirish uchun', 'Tezlikni sekinlatish uchun', 'Shart emas'], ['Flush buffers & free OS descriptors', 'Rename file', 'Slow execution', 'Optional'], 0, 'Buferni to‘kish va descriptor bo‘shatish uchun.', 'Flushes buffers and frees handles.'),
    ],
    homework: hw('Xavfsiz Log Yozuvchi Sikli', 'Safe Mode Logger', '`tempfile.TemporaryDirectory()` ichida `events.log` faylini avval `"x"` bilan yarating, keyin `"a"` bilan 3 ta hodisa yozib o‘qing.', 'Inside a temp dir, create `events.log` with `"x"`, append 3 lines with `"a"`, and read back.', ['try/finally bilan close()', '"x" va "a" rejimlari'], ['Use try/finally close()', 'Use both "x" and "a"'], 'open(p, "x", encoding="utf-8").close()', 'Create exclusively first.', 'Qayta `"x"` bilan ochishga urinib `FileExistsError` ni tuting.', 'Test duplicate `"x"` guard.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-FCC-001'],
  }),

  makeLesson({
    id: 'PY-06-03',
    courseId: 'files_io',
    moduleId: 'c06_m2',
    order: 3,
    titleUz: 'Faylga yozish va o‘qish — `.read()`, `.readline()`, `.write()`',
    titleEn: 'Reading & Writing Files: Streaming vs Full Read, Cursor & Seek',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-06-02'],
    conceptId: 'file_read_write',
    whyUz: "10 GB hajmli server log faylini `f.read()` bilan o‘qishga urinsangiz dasturingiz butun RAM ni to‘ldirib qulaydi (`MemoryError`)! Har bir fayl hajmiga mos o‘qish usulini tanlash shart.",
    whyEn: 'Calling `.read()` on a multi-gigabyte log blows up RAM. Knowing when to stream line-by-line vs read whole files keeps services reliable.',
    analogyUz: "`f.read()` — bu 500 betlik kitobni bir martada skanerlab olish. `for line in f:` — esa kitobni betma-bet o‘qib borish (faqat 1 ta bet xotirada turadi!).",
    analogyEn: '`.read()` loads the entire book onto your desk; `for line in f:` reads one page at a time using O(1) memory.',
    stopsUz: "1) `f.read()` o‘qib bo‘lgach **fayl kursori** oxirida (EOF) turadi — ikkinchi marta `f.read()` chaqirsangiz `\"\"` (bo‘sh string) qaytaradi (`f.seek(0)` kerak)! 2) `f.write()` avtomatik `\\n` qo‘shmaydi!",
    stopsEn: 'After `.read()`, the file cursor sits at EOF so a second `.read()` returns `""` unless you call `.seek(0)`. Also `.write()` does NOT add `\\n` automatically.',
    objUz: ['`.read()`, `.readline()`, `.readlines()` va xotira-tejamkor `for line in f:` farqini bilish', 'Fayl kursori (`.tell()`, `.seek(0)`) qanday siljishini tushunish', '`.write()` va `.writelines()` yordamida satrlar yozish (`\\n` qo‘shish)'],
    objEn: ['Contrast `.read()`, `.readline()`, `.readlines()`, and `for line in f:`', 'Move the stream cursor with `.seek(0)` and `.tell()`', 'Write lines cleanly with `.write()` and explicit `\\n`'],
    theoryUz: `### 1. O‘qish Usullari Taqqoslanishi
- \`f.read()\`: butun faylni bitta \`str\` qilib oladi (kichik config/JSON uchun).
- \`f.readline()\`: faqat keyingi 1 ta satrni o‘qiydi.
- \`f.readlines()\`: hamma satrni \`list[str]\` qiladi (xotira sarflaydi).
- \`for line in f:\`: **eng yaxshi usul** — har safar faqat 1 ta satrni xotirada ushlab oqim bilan o‘qiydi (O(1) RAM)!
### 2. Oxiridagi \`\\n\` ni Tozalash
Har bir satr oxirida \`\\n\` bo‘ladi -> \`line.rstrip("\\n")\` yoki \`line.strip()\` bilan tozalang.
### 3. Kursor va \`.seek(0)\`
Fayl o‘qilgach kursor oxirida turadi. Qaytadan boshidan o‘qish uchun \`f.seek(0)\` chaqiriladi.
### 4. Yozish: \`.write()\` va \`.writelines()\`
\`f.write("A"); f.write("B")\` -> \`"AB"\` yozadi! Yangi qator uchun \`"A\\n"\` yoki \`print(..., file=f)\` ishlating.
### 5. Keng tarqalgan xato
Kursor EOF ga yetganidan keyin \`.seek(0)\` siz yana \`.read()\` chaqirib bo‘sh natija olish.`,
    theoryEn: `### 1. Reading Methods
\`.read()\` loads everything; \`.readline()\` reads one line; \`for line in f:\` streams line-by-line in O(1) RAM.
### 2. Stripping Newlines
Call \`line.strip()\` or \`line.rstrip("\\n")\` when parsing lines.
### 3. Stream Cursor & \`.seek(0)\`
Reading advances the cursor to EOF; reset with \`.seek(0)\` to re-read.
### 4. Writing Lines
\`.write()\` and \`.writelines()\` do not insert \`\\n\` automatically.
### 5. Exhausted Stream Trap
Calling \`.read()\` twice returns \`""\` on the second call without \`.seek(0)\`.`,
    examples: [
      ex('Misol 1: Oqimli (`for line in f`) o‘qish va tozalash', 'Example 1: Streaming Lines Efficiently', `import io\nf = io.StringIO("Ali,90\\nZarina,95\\n")\nfor line in f:\n    name, score = line.strip().split(",")\n    print(f"{name} -> {score}")`, `Ali -> 90\nZarina -> 95`, 'Har bir satr birma-bir o‘qilib `.strip()` bilan tozalandi.', 'Streamed and parsed lines with O(1) memory footprint.'),
      ex('Misol 2: Kursor siljishi (`tell` va `seek(0)`)', 'Example 2: Cursor Position & seek(0)', `import io\nf = io.StringIO("ABC")\nprint("1st read:", f.read())\nprint("2nd read:", repr(f.read()), "| pos:", f.tell())\nf.seek(0)\nprint("After seek(0):", f.read())`, `1st read: ABC\n2nd read: '' | pos: 3\nAfter seek(0): ABC`, '2-o‘qish EOF da `""` qaytardi, `seek(0)` kursorni boshiga qaytardi.', '`seek(0)` rewound cursor back to byte offset 0.'),
      ex('Misol 3: `.writelines()` bilan `\\n` qo‘shish', 'Example 3: Writing Multiple Lines', `import io\nbuf = io.StringIO()\nrows = ["one", "two", "three"]\nbuf.writelines(f"{r}\\n" for r in rows)\nbuf.seek(0)\nprint(buf.read().strip())`, `one\ntwo\nthree`, 'Har bir satr oxiriga `\\n` generator ichida qo‘shildi.', 'Explicit newline added to each record via `writelines`.'),
    ],
    traceTitleUz: 'Fayl kursori (EOF) izi',
    traceTitleEn: 'Tracing Stream Cursor',
    traceCode: `import io\nf = io.StringIO("Hi")\na = f.read(1)\nb = f.read(1)\nprint(a, b, f.tell())`,
    traceSteps: [
      traceStep(1, 'f.read(1)', 'a="H", pos=1', '1-belgi o‘qildi', 'Read first char'),
      traceStep(2, 'f.read(1)', 'b="i", pos=2', '2-belgi o‘qildi', 'Read second char'),
      traceStep(3, 'print(a, b, f.tell())', 'H i 2', 'Kursor oxirida (2)', 'Cursor at offset 2', 'H i 2'),
    ],
    commonMistakes: [
      mistake('`f.read()` ni 2 marta chaqirib bo‘sh string olish', 'Double .read() Without seek(0)', `import io\nf = io.StringIO("Hello")\n_ = f.read()\nprint(repr(f.read()))`, "Prints '' (empty string)", `import io\nf = io.StringIO("Hello")\n_ = f.read()\nf.seek(0)\nprint(f.read())`, '1-`.read()` kursorni oxiriga olib borib qo‘ydi.', 'First `.read()` moved cursor to EOF.', 'Qayta o‘qishdan oldin `f.seek(0)` chaqiring.', 'Call `f.seek(0)` to rewind.'),
      mistake('`writelines(["a", "b"])` qator tashlaydi deb o‘ylash', 'Expecting Newlines from writelines()', `import io\nf = io.StringIO()\nf.writelines(["a", "b"])\nf.seek(0)\nprint(f.read())`, 'Prints ab concatenated on one line', `import io\nf = io.StringIO()\nf.writelines(["a\\n", "b\\n"])\nf.seek(0)\nprint(f.read().strip())`, '`writelines()` avtomatik `\\n` qo‘shmaydi.', '`writelines()` writes strings verbatim without `\\n`.', 'Har satrga `"\\n"` qo‘shib yozing.', 'Append `"\\n"` to each item.'),
    ],
    compareTitleUz: '`f.read()` vs `f.readlines()` vs `for line in f:`',
    compareTitleEn: '`read()` vs `readlines()` vs Line Streaming',
    compareUz: ['`f.read()`: kichik faylni bitta stringda olish uchun.', '`f.readlines()`: kichik ro‘yxat (indekslash kerak bo‘lsa).', '`for line in f:`: katta fayllarda O(1) RAM uchun **eng yaxshi standart**.'],
    compareEn: ['`read()`: whole small files.', '`readlines()`: small files needing list indexing.', '`for line in f:`: best practice for large files (O(1) memory).'],
    compareSummaryUz: 'Katta matn/log fayllarni har doim `for line in f:` bilan satrma-satr o‘qing.',
    compareSummaryEn: 'Stream multi-line files using `for line in f:` instead of loading everything into RAM.',
    practiceTasks: [
      pt('p0603_1', '1-mashq: `.read(n)` bilan bo‘laklash', 'Task 1: Read N Chars', '`io.StringIO("Python")` dan birinchi 2 ta belgini o‘qib chiqaring.', 'Read first 2 chars.', `import io\nf = io.StringIO("Python")\nprint(f.read(2))`, 'Py', 'f.read(2)', 'Pass count 2.'),
      pt('p0603_2', '2-mashq: `.seek(0)`', 'Task 2: Rewind with seek', '`f.read()` qilgach `f.seek(0)` bilan yana o‘qing.', 'Read twice using seek(0).', `import io\nf = io.StringIO("OK")\n_ = f.read()\nf.seek(0)\nprint(f.read())`, 'OK', 'f.seek(0)', 'Rewind cursor.'),
      pt('p0603_3', '3-mashq: Satrma-satr sanash', 'Task 3: Stream Lines', '`io.StringIO("a\\nb\\nc")` ni `for line in f:` bilan sanang.', 'Count lines via streaming.', `import io\nf = io.StringIO("a\\nb\\nc")\nc = 0\nfor _ in f:\n    c += 1\nprint(c)`, '3', 'for _ in f:', 'Count iterations.'),
      pt('p0603_4', '4-mashq: `\\n` tozalash', 'Task 4: Strip Newlines', '`io.StringIO("hi\\n")` dan `.readline().strip()` chiqaring.', 'Read and strip one line.', `import io\nf = io.StringIO("hi\\n")\nprint(f.readline().strip())`, 'hi', 'f.readline().strip()', 'Strip newline.'),
      pt('p0603_5', '5-mashq: `.write()` qaytaradigan son', 'Task 5: write() Return Value', '`io.StringIO().write("hello")` qaytargan belgilar sonini chiqaring.', 'Print return value of write().', `import io\nprint(io.StringIO().write("hello"))`, '5', 'write() returns char count.', 'Print result.'),
    ],
    quiz: [
      q('q0603_1', '10 GB faylni RAM ni to‘ldirmasdan o‘qishning eng to‘g‘ri usuli?', 'Best way to read a 10 GB file safely?', ['f.read()', 'f.readlines()', 'for line in f:', 'list(f)'], ['f.read()', 'f.readlines()', 'for line in f:', 'list(f)'], 2, '`for line in f:` har safar 1 satr o‘qiydi.', '`for line in f:` streams line-by-line.'),
      q('q0603_2', 'Fayl oxirigacha o‘qilgandan keyin kursorni boshiga qaytarish metodi?', 'Method to rewind file cursor to start?', ['f.reset()', 'f.seek(0)', 'f.rewind()', 'f.top()'], ['f.reset()', 'f.seek(0)', 'f.rewind()', 'f.top()'], 1, '`f.seek(0)`.', '`f.seek(0)`.'),
      q('q0603_3', '`f.write("A")` avtomatik yangi qator (`\\n`) qo‘shadimi?', 'Does `f.write("A")` append a newline?', ['Ha', 'Yo‘q', 'Faqat Windows da', 'Faqat StringIO da'], ['Yes', 'No', 'Windows only', 'StringIO only'], 1, 'Yo‘q, `"\\n"` ni qo‘lda qo‘shish kerak.', 'No, must include `"\\n"`.'),
      q('q0603_4', '`f.tell()` nimani qaytaradi?', 'What does `f.tell()` return?', ['Fayl hajmini', 'Joriy kursor pozitsiyasini', 'Satrlar sonini', 'Fayl nomini'], ['File size', 'Current cursor byte offset', 'Line count', 'Filename'], 1, 'Kursorning joriy o‘rnini.', 'Current stream position.'),
      q('q0603_5', 'Fayl oxiriga yetgach `f.read()` nimani qaytaradi?', 'What does `f.read()` return at EOF?', ['None', 'Bo‘sh string ""', 'EOFError', 'False'], ['None', 'Empty string ""', 'EOFError', 'False'], 1, 'Bo‘sh string `""`.', 'Empty string `""`.'),
    ],
    homework: hw('Oqimli Log Filtrlovchi Skript', 'Streaming Log Filter', 'Virtual fayl (`StringIO` yoki temp fayl) dagi 6 qatorli logdan faqat `ERROR` va `WARN` satrlarni RAM ga hammasini yuklamay `for line in src:` orqali ikkinchi oqimga ko‘chiring.', 'Stream-filter `ERROR` and `WARN` lines from source stream to output stream using `for line in src:` without `.read()`.', ['for line in src: ishlatilsin', 'Outputda jami filtrlangan satrlar soni ko‘rsatilsin'], ['Stream line-by-line', 'Report matched count'], 'if line.startswith(("ERROR", "WARN")): dst.write(line)', 'Filter cleanly.', 'Har satr boshiga tartib raqamini ham qo‘shib yozing.', 'Prepend line numbers.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-06-04',
    courseId: 'files_io',
    moduleId: 'c06_m2',
    order: 4,
    titleUz: '`with` operatori (Context Manager) va Review #12',
    titleEn: 'The `with` Context Manager Protocol & Review #12',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-06-03'],
    conceptId: 'with_context_manager',
    whyUz: "`f = open(...)` va `f.close()` ni qo‘lda yozishda bitta kichik xato (`ZeroDivisionError` yoki `return`) chiqsa fayl ochiq qolib ketadi. Python'ning `with open(...) as f:` bloki faylni har qanday holatda — xato chiqsa ham — **kafolatli yopadi**!",
    whyEn: 'The `with` statement guarantees resource cleanup via `__enter__`/`__exit__`, even when exceptions or early returns happen inside the block.',
    analogyUz: "`with` — bu avtomatik sensorli eshik: ichkariga kirasiz (`__enter__`), ishingizni bitirasiz (yoki shoshilib chiqib ketasiz / yiqilasiz), eshik esa sizni kutmay o‘zi **avtomatik** (`__exit__`) yopiladi!",
    analogyEn: '`with` is an automatic spring-loaded door: whether you walk out normally or trip inside (exception), it closes behind you automatically.',
    stopsUz: "`with open(...) as f:` dan **tashqariga chiqqaningizdan keyin** `f` hali nom sifatida mavjud bo‘ladi, lekin u yopilgan bo‘ladi (`f.closed == True`) — tashqarida `f.read()` qilsangiz **`ValueError: I/O operation on closed file`** chiqadi!",
    stopsEn: 'Outside the `with` block the handle is already closed—calling `f.read()` afterward raises `ValueError: I/O operation on closed file`.',
    objUz: ['`with open(...) as f:` kontekst menejeri afzalliklarini bilish', 'Bir `with` da bir nechta faylni (o‘qish + yozish) ochish', 'Ichki `__enter__` / `__exit__` protokolini va `with` dan tashqarida xatoni tushunish'],
    objEn: ['Use `with open(...) as f:` as the universal Python standard', 'Open multiple files cleanly inside one parenthesized `with (...)` block', 'Understand `__enter__`/`__exit__` lifecycle and closed-file errors'],
    theoryUz: `### 1. \`with\` Nima Qiladi?
\`with open(path, "r", encoding="utf-8") as f:\` ichida blok tugashi bilan (hatto \`return\` yoki exception bo‘lsa ham) Python avtomatik \`f.__exit__()\` -> \`f.close()\` chaqiradi.
### 2. Bir Vaqtda Ikkita Fayl Ochish
\`\`\`python
with (
    open(src, "r", encoding="utf-8") as fin,
    open(dst, "w", encoding="utf-8") as fout,
):
    for line in fin:
        fout.write(line.upper())
\`\`\`
### 3. \`with\` Ichida Xato Chiqsa Nima Bo‘ladi?
Avval \`f.close()\` bajariladi (ma’lumot yo‘qolmaydi), keyin xato tashqariga uzatiladi.
### 4. Kontekst Menejerlar Faqat Fayllar Uchun Emas!
Keyinchalik DB ulanishlari (\`sqlite3\`), Lock lar, \`tempfile.TemporaryDirectory()\` ham \`with\` bilan ishlaydi.
### 5. Keng tarqalgan xato
\`with\` blokidan tashqarida (indentatsiya chiqib ketib) \`f.read()\` chaqirish -> \`ValueError: I/O operation on closed file\`.`,
    theoryEn: `### 1. Automatic Cleanup
\`with\` calls \`__enter__()\` on entry and guarantees \`__exit__()\` on exit, normal or exceptional.
### 2. Multi-File Contexts
Open source and destination streams together in one parenthesized \`with (...) as ..., (...) as ...:\`.
### 3. Exception Safety
\`__exit__\` flushes and closes files before the exception propagates outward.
### 4. Beyond Files
Locks, DB transactions, HTTP sessions, and temp dirs all implement the same context-manager protocol.
### 5. Post-Block Access Error
Reading \`f\` outside the \`with\` block triggers \`ValueError: I/O operation on closed file\`.`,
    examples: [
      ex('Misol 1: `with` bilan yozish va avtomatik yopilish', 'Example 1: Guaranteed Close with `with`', `import tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as tmp:\n    p = Path(tmp) / "hello.txt"\n    with open(p, "w", encoding="utf-8") as f:\n        f.write("Context Manager!")\n    print("Closed after with:", f.closed)\n    with open(p, "r", encoding="utf-8") as f:\n        print("Content:", f.read())`, `Closed after with: True\nContent: Context Manager!`, '`with` blokidan chiqishi bilanoq `f.closed` avtomatik `True` bo‘ldi.', 'Handle automatically closed upon exiting the `with` block.'),
      ex('Misol 2: Bitta `with` da bir nechta oqim (Copy/Transform)', 'Example 2: Parenthesized Multi-Stream Copy', `import io\nsrc = io.StringIO("alpha\\nbeta\\n")\ndst = io.StringIO()\nwith src as fin:\n    for line in fin:\n        dst.write(line.upper())\nprint("Source closed:", src.closed)\nprint(dst.getvalue().strip())`, `Source closed: True\nALPHA\nBETA`, 'Ma’lumot bir oqimdan ikkinchisiga katta harflarga o‘girilib ko‘chirildi.', 'Transformed stream cleanly and closed source automatically.'),
      ex('Misol 3: Xato yuz berganda ham `with` yopadi', 'Example 3: Cleanup Despite Exception', `import io\nf = io.StringIO("x")\ntry:\n    with f:\n        raise RuntimeError("boom")\nexcept RuntimeError:\n    print("Error caught! Closed anyway?", f.closed)`, `Error caught! Closed anyway? True`, 'Ichkarida `RuntimeError` chiqqaniga qaramay fayl yopildi.', 'Exception inside `with` still ran cleanup `__exit__`.'),
    ],
    traceTitleUz: '`with` bloki hayot sikli izi',
    traceTitleEn: 'Tracing `with` Context Lifecycle',
    traceCode: `import io\nwith io.StringIO("data") as f:\n    val = f.read()\nprint(val, f.closed)`,
    traceSteps: [
      traceStep(1, 'with io.StringIO("data") as f:', '__enter__()', 'Oqim ochildi va f ga bog‘landi', 'Entered context manager'),
      traceStep(2, 'val = f.read()', 'val="data"', 'Blok ichida o‘qildi', 'Read inside block'),
      traceStep(3, '(exit block)', '__exit__() -> close', 'Avtomatik yopildi', 'Exited and closed'),
      traceStep(4, 'print(val, f.closed)', 'data True', 'Natija chiqdi', 'Confirmed closed', 'data True'),
    ],
    commonMistakes: [
      mistake('`with` blokidan tashqarida faylni o‘qish', 'Using File Handle Outside with Block', `import io\nwith io.StringIO("hi") as f:\n    pass\nprint(f.read())`, 'ValueError: I/O operation on closed file', `import io\nwith io.StringIO("hi") as f:\n    text = f.read()\nprint(text)`, '`with` tugashi bilan `f` yopiladi.', 'Exiting `with` immediately closes `f`.', 'Kerakli ma’lumotni `with` ichida o‘qib o‘zgaruvchiga oling.', 'Read needed data before exiting the `with` block.'),
      mistake('`with` bor joyda ham `open()` ni yopishni unutib qo‘yish', 'Opening Without with', `f = open("a.txt", "w")\nf.write("data")`, 'Risk of buffered loss or leaked descriptor', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    with open(Path(d) / "a.txt", "w", encoding="utf-8") as f:\n        f.write("data")\n    print("Saved safely")`, 'Qo‘lda `open/close` yozish o‘rniga doim `with` ishlating.', 'Always wrap file handles in `with`.', 'Har bir `open()` oldida `with` bo‘lsin.', 'Prefix every `open()` with `with`.'),
    ],
    compareTitleUz: '`open/close` vs `with open(...)`',
    compareTitleEn: 'Manual `close()` vs `with`',
    compareUz: ['Manual `open/close`: uzun `try/finally`, unutib qo‘yish xavfi katta.', '`with open(...) as f:`: qisqa, xato chiqqanda ham 100% yopadigan Python standarti.'],
    compareEn: ['Manual `close()`: verbose and error-prone.', '`with`: concise, exception-safe Python standard.'],
    compareSummaryUz: 'Python dasturlashda fayl va resurslarni **har doim** `with` operatori bilan oching.',
    compareSummaryEn: 'Always manage files and external resources with `with` context managers.',
    practiceTasks: [
      pt('p0604_1', '1-mashq: `with` + `StringIO`', 'Task 1: Safe Read', '`with io.StringIO("hello") as f:` ichida o‘qib chiqaring.', 'Read inside with.', `import io\nwith io.StringIO("hello") as f:\n    print(f.read())`, 'hello', 'Read inside indented block.', 'Print text.'),
      pt('p0604_2', '2-mashq: Yopilganini tekshirish', 'Task 2: Check Closed After with', '`with io.StringIO("a") as f: pass` dan keyin `f.closed` chiqaring.', 'Verify f.closed is True.', `import io\nwith io.StringIO("a") as f:\n    pass\nprint(f.closed)`, 'True', 'Inspect f.closed after block.', 'Prints True.'),
      pt('p0604_3', '3-mashq: Xatoda ham yopish', 'Task 3: Exception Safety', '`with` ichida `1/0` qilib `ZeroDivisionError` tuting va `f.closed` chiqaring.', 'Verify cleanup on ZeroDivisionError.', `import io\nf = io.StringIO("x")\ntry:\n    with f:\n        _ = 1 / 0\nexcept ZeroDivisionError:\n    print(f.closed)`, 'True', 'Wrap with in try/except.', 'Print f.closed.'),
      pt('p0604_4', '4-mashq: Temp fayl yozish-o‘qish', 'Task 4: Temp with open', 'Temp papkada `with open(..., "w")` yozib, `with open(..., "r")` o‘qing.', 'Write and read using with open.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    p = Path(d) / "t.txt"\n    with open(p, "w", encoding="utf-8") as f:\n        f.write("42")\n    with open(p, "r", encoding="utf-8") as f:\n        print(f.read())`, '42', 'Specify encoding="utf-8".', 'Read inside second with.'),
      pt('p0604_5', '5-mashq: Yopiq fayl xatosi', 'Task 5: Catch Closed Error', 'Yopilgan `f` dan o‘qishga urinib `ValueError` tuting.', 'Catch ValueError on closed stream.', `import io\nwith io.StringIO("a") as f:\n    pass\ntry:\n    f.read()\nexcept ValueError:\n    print("closed error")`, 'closed error', 'except ValueError', 'Test closed stream.'),
    ],
    quiz: [
      q('q0604_1', '`with` bloki tugaganda fayl bilan nima sodir bo‘ladi?', 'What happens when a `with` block exits?', ['Ochiq qoladi', 'Avtomatik yopiladi (__exit__)', 'O‘chib ketadi', 'Xato beradi'], ['Stays open', 'Automatically closes via __exit__', 'Deleted', 'Raises error'], 1, 'Avtomatik yopiladi.', 'Automatically closes.'),
      q('q0604_2', '`with` bloki ichida xato (Exception) chiqsa fayl yopiladimi?', 'Does `with` close the file if an exception occurs?', ['Yo‘q', 'Ha, baribir yopiladi', 'Faqat ValueError da', 'Faqat try bo‘lsa'], ['No', 'Yes, always', 'ValueError only', 'Only with try'], 1, 'Ha, `__exit__` baribir ishlaydi.', 'Yes, `__exit__` always runs.'),
      q('q0604_3', '`with` dan tashqarida yopilgan faylga `f.read()` qilsak nima chiqadi?', 'Calling `f.read()` after `with` exits raises?', ['EOFError', 'ValueError', 'IOError', 'KeyError'], ['EOFError', 'ValueError', 'IOError', 'KeyError'], 1, '`ValueError: I/O operation on closed file`.', '`ValueError`.'),
      q('q0604_4', 'Kontekst menejer qaysi ikki magic metodga tayanadi?', 'Which two dunder methods power `with`?', ['__init__ / __del__', '__enter__ / __exit__', '__open__ / __close__', '__start__ / __stop__'], ['__init__ / __del__', '__enter__ / __exit__', '__open__ / __close__', '__start__ / __stop__'], 1, '`__enter__` va `__exit__`.', '`__enter__` and `__exit__`.'),
      q('q0604_5', 'Bitta `with` da ikkita fayl ochish mumkinmi?', 'Can one `with` open two files?', ['Yo‘q', 'Ha, vergul bilan ajratib', 'Faqat 1 ta', 'Faqat binary da'], ['No', 'Yes, comma-separated', 'Only 1', 'Binary only'], 1, 'Ha, `with open(a) as f1, open(b) as f2:`.', 'Yes, comma-separated.'),
    ],
    homework: hw('Xavfsiz Fayl Nusxalovchi (`with` + Streaming)', 'Streaming File Transformer', 'Manba temp faylga 5 ta matn qator yozing, so‘ng bitta `with (...)` ichida ham o‘qish, ham katta harflarga o‘girib ikkinchi faylga yozish funksiyasini tuzing.', 'Write 5 lines to a source file, then stream-transform them to uppercase into a destination file using one multi-file `with`.', ['Bitta with da 2 ta fayl', 'for line in fin: oqimi'], ['Open both in one with', 'Stream line-by-line'], 'with open(src, "r", encoding="utf-8") as fin, open(dst, "w", encoding="utf-8") as fout:', 'Stream lines cleanly.', 'Bo‘sh qatorlarni tashlab ketuvchi filtr qo‘shing.', 'Skip blank lines during copy.', 20),
    reviewCheckpoint: review(
      12,
      'Review Loyiha #12: Type-Safe & Context-Safe Matn Arxivchisi (Course 5 + Course 6)',
      'Review Project #12: Typed Streaming Log Cleaner',
      '60-dars marrasi! Type Hints, Docstrings, `with` Context Manager va satrma-satr oqimli fayl qayta ishlashni birlashtiring.',
      '60-lesson milestone! Combine typed functions, docstrings, `with` managers, and streaming file I/O.',
      ['`filter_logs(src_path, dst_path, level: str) -> int` typed funksiyasi', '`with open(..., encoding="utf-8")` va oqimli o‘qish', 'Yozilgan satrlar sonini qaytarish'],
      ['Typed `filter_logs(src, dst, level) -> int`', 'Safe `with` + UTF-8 streaming', 'Return count of exported lines'],
      `import tempfile
from pathlib import Path

def filter_logs(src: Path, dst: Path, level: str = "ERROR") -> int:
    """Copy matching log lines from src to dst and return match count."""
    count = 0
    with (
        open(src, "r", encoding="utf-8") as fin,
        open(dst, "w", encoding="utf-8") as fout,
    ):
        for line in fin:
            if line.startswith(level):
                fout.write(line)
                count += 1
    return count

with tempfile.TemporaryDirectory() as tmp:
    raw = Path(tmp) / "raw.log"
    out = Path(tmp) / "err.log"
    raw.write_text("INFO Boot\\nERROR DB timeout\\nINFO OK\\nERROR Retry\\n", encoding="utf-8")
    n = filter_logs(raw, out, "ERROR")
    print("Exported:", n)
    print(out.read_text(encoding="utf-8").strip())`,
    ),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-06-05',
    courseId: 'files_io',
    moduleId: 'c06_m2',
    order: 5,
    titleUz: 'TXT fayllar — matn parsing, konfiguratsiya va hisobotlar',
    titleEn: 'Working with TXT Files: Parsing Logs, `.env` Configs & Reports',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-06-04'],
    conceptId: 'txt_files',
    whyUz: "`.txt`, `.log`, `.env`, `.ini` kabi oddiy matn fayllari har qanday server va tizimda uchraydi. Ulardan izoh (`#`) va bo‘sh satrlarni chiqarib tashlab toza ma’lumot yig‘ish kundalik amaliyotdir.",
    whyEn: 'Plain-text files (`.txt`, `.log`, `.env`) require resilient line parsing: skipping blanks/comments and splitting key-value pairs cleanly.',
    analogyUz: "TXT faylni o‘qish — bu gazeta o‘qishga o‘xshaydi: bo‘sh hoshiyalarni (`not line.strip()`) va qizil izohlarni (`line.startswith('#')`) tashlab o‘tib, faqat foydali satrlarni ajratib olasiz.",
    analogyEn: 'Parsing `.txt` configs skips blank margins and `#` margin notes to extract clean `key=value` entries.',
    stopsUz: "Key=Value (masalan `URL=https://site.uz?a=1`) ni `line.split(\"=\")` qilsangiz, qiymat ichidagi ikkinchi `=` tufayli 3 bo‘lakka bo‘linib unpacking `ValueError` beradi! Doim **`line.split(\"=\", 1)`** (maxsplit=1) yozing!",
    stopsEn: 'Always split `key=value` lines with `.split("=", 1)` so an `=` inside the value never causes a `ValueError`!',
    objUz: ['Bo‘sh satr va `#` izohlarni `continue` bilan toza o‘tkazib yuborish', '`split(delim, 1)` bilan `key=value` konfiguratsiya fayllarini xavfsiz tahlil qilish', '`.txt` faylga `print(..., file=f)` va `writelines()` bilan hisobot yozish'],
    objEn: ['Skip blank lines and `#` comments cleanly during streaming', 'Parse `key=value` lines safely using `split("=", 1)`', 'Generate formatted `.txt` summaries cleanly'],
    theoryUz: `### 1. Toza Satr Tahlili Shablon
\`\`\`python
for raw in f:
    line = raw.strip()
    if not line or line.startswith("#"):
        continue
\`\`\`
### 2. \`split("=", 1)\` Qoidasi
\`TOKEN=abc=123\` kabi satrda oddiy \`.split("=")\` 3 ta qism beradi. \`.split("=", 1)\` esa **maksimum 1 marta** bo‘lib \`["TOKEN", "abc=123"]\` qaytaradi!
### 3. \`print(..., file=f)\` Usuli
\`print(f"{name}: {score}", file=f)\` — \`f.write()\` dan farqli ravishda avtomatik \`\\n\` qo‘yadi va istalgan turni stringga aylantiradi.
### 4. Keng tarqalgan xato
Fayl oxirida \`\\n\` bo‘sh qator qolsa \`.split("=")\` 1 elementli list berib \`ValueError\` chiqarishi — \`if "=" not in line: continue\` bilan himoyalaning.`,
    theoryEn: `### 1. Standard Line Normalization
Strip whitespace and skip empty or \`#\`-comment lines first.
### 2. Safe \`split("=", 1)\`
Limits splits so values containing \`=\` (e.g., Base64 tokens or URLs) stay intact.
### 3. Formatting with \`print(..., file=f)\`
Adds newlines and string conversion automatically.
### 4. Guard Malformed Lines
Check \`if "=" not in line:\` before unpacking.`,
    examples: [
      ex('Misol 1: `.env` uslubidagi konfiguratsiya parseri', 'Example 1: Parsing Key=Value Configs', `import io\ncfg_text = "# Server settings\\n\\nHOST=localhost\\nTOKEN=abc=xyz==\\n"\ncfg = {}\nfor raw in io.StringIO(cfg_text):\n    line = raw.strip()\n    if not line or line.startswith("#") or "=" not in line:\n        continue\n    k, v = line.split("=", 1)\n    cfg[k.strip()] = v.strip()\nprint(cfg)`, `{'HOST': 'localhost', 'TOKEN': 'abc=xyz=='}`, '`split("=", 1)` tufayli `TOKEN` ichidagi `=` belgilari buzilmadi.', 'Used `split("=", 1)` to preserve trailing `=` characters in token.'),
      ex('Misol 2: `print(..., file=f)` bilan hisobot yozish', 'Example 2: Writing Report via print(file=f)', `import io\nout = io.StringIO()\nscores = [("Ali", 95), ("Lola", 88)]\nfor name, val in scores:\n    print(f"{name:<6} | {val}", file=out)\nprint(out.getvalue().strip())`, `Ali    | 95\nLola   | 88`, '`print(..., file=out)` avtomatik format va `\\n` qo‘shdi.', '`print(..., file=out)` formatted aligned rows automatically.'),
      ex('Misol 3: Matn fayldagi so‘zlar statistikasi', 'Example 3: TXT Word Frequency', `import io\ntext = "Python is fast\\nPython is clean\\n"\nwords = io.StringIO(text).read().lower().split()\nprint("Total words:", len(words), "| Python count:", words.count("python"))`, `Total words: 6 | Python count: 2`, '`.split()` barcha bo‘shliq va `\\n` lar bo‘yicha toza bo‘ladi.', '`.split()` handles spaces and newlines uniformly.'),
    ],
    traceTitleUz: 'TXT parser filtratsiyasi izi',
    traceTitleEn: 'Tracing TXT Config Parser',
    traceCode: `lines = ["# comment", "", "PORT=8000"]\ncfg = {}\nfor l in lines:\n    if l and not l.startswith("#"):\n        k, v = l.split("=", 1)\n        cfg[k] = v\nprint(cfg)`,
    traceSteps: [
      traceStep(1, '"# comment"', 'skipped', 'Izoh tashlab ketildi', 'Skipped comment'),
      traceStep(2, '""', 'skipped', 'Bo‘sh satr o‘tkazildi', 'Skipped empty line'),
      traceStep(3, '"PORT=8000"', "{'PORT': '8000'}", 'Kalit-qiymat saqlandi', 'Parsed key/value', "{'PORT': '8000'}"),
    ],
    commonMistakes: [
      mistake('`split("=")` da maxsplit=1 bermaslik', 'Splitting Values Containing =', `line = "KEY=a=b"\nk, v = line.split("=")`, 'ValueError: too many values to unpack', `line = "KEY=a=b"\nk, v = line.split("=", 1)\nprint(k, v)`, 'Qiymat ichida `=` bo‘lsa 3 ta bo‘lak chiqadi.', 'Extra `=` characters break two-way unpacking.', 'Har doim `.split("=", 1)` yozing.', 'Always pass `1` as maxsplit.'),
      mistake('Bo‘sh satrlarni filtrlamasdan unpacking qilish', 'Unpacking Blank Trailing Lines', `for l in ["A=1", ""]:\n    k, v = l.split("=", 1)`, 'ValueError: not enough values to unpack', `for l in ["A=1", ""]:\n    if "=" in l:\n        k, v = l.split("=", 1)\n        print(k, v)`, 'Fayl oxiridagi bo‘sh satr 1 ta element beradi.', 'Blank lines produce single-element splits.', '`if not line:` va `if "=" not in line:` qo‘ying.', 'Skip empty/malformed lines first.'),
    ],
    compareTitleUz: '`f.write(f"...\\n")` vs `print(..., file=f)`',
    compareTitleEn: '`f.write()` vs `print(..., file=f)`',
    compareUz: ['`f.write()`: tezroq va aniq string oqimlari uchun (o‘zingiz `\\n` qo‘shasiz).', '`print(..., file=f)`: hisobot va loglarda `\\n` + stringga aylantirish avtomatik.'],
    compareEn: ['`f.write()`: raw explicit string writes.', '`print(..., file=f)`: convenient formatted reporting with automatic newline.'],
    compareSummaryUz: 'Config parserlarda `strip()`, izoh/bo‘sh satr filtri va `split("=", 1)` uchligini qo‘llang.',
    compareSummaryEn: 'Pair `.strip()`, blank/comment skipping, and `.split("=", 1)` for resilient text parsing.',
    practiceTasks: [
      pt('p0605_1', '1-mashq: `split("=", 1)`', 'Task 1: maxsplit=1', '`"TOKEN=x=y=="` ni `split("=", 1)` bilan bo‘lib chiqaring.', 'Split preserving inner =.', `print("TOKEN=x=y==".split("=", 1))`, "['TOKEN', 'x=y==']", '.split("=", 1)', 'Pass 1 as maxsplit.'),
      pt('p0605_2', '2-mashq: Izoh va bo‘sh satr filtri', 'Task 2: Filter Comments', '`["# hi", "", "ok"]` dan toza satrlar ro‘yxatini chiqaring.', 'Keep non-empty non-comment lines.', `rows = ["# hi", "", "ok"]\nprint([r for r in rows if r.strip() and not r.startswith("#")])`, "['ok']", 'Check strip and startswith("#").', 'Filter rows.'),
      pt('p0605_3', '3-mashq: `print(file=f)`', 'Task 3: print to Stream', '`io.StringIO()` ga `print("row1", file=f)` yozib `.getvalue().strip()` chiqaring.', 'Use print(file=f).', `import io\nf = io.StringIO()\nprint("row1", file=f)\nprint(f.getvalue().strip())`, 'row1', 'print(..., file=f)', 'Inspect getvalue().'),
      pt('p0605_4', '4-mashq: So‘zlar soni', 'Task 4: Word Count', '`io.StringIO("a b\\nc")` ichidagi jami so‘zlar sonini chiqaring.', 'Count whitespace-separated words.', `import io\nprint(len(io.StringIO("a b\\nc").read().split()))`, '3', '.read().split()', 'Count len.'),
      pt('p0605_5', '5-mashq: Log darajasini sanash', 'Task 5: Count ERROR Lines', '`io.StringIO("INFO a\\nERROR b\\nERROR c")` da `ERROR` sonini chiqaring.', 'Count lines starting with ERROR.', `import io\nprint(sum(1 for l in io.StringIO("INFO a\\nERROR b\\nERROR c") if l.startswith("ERROR")))`, '2', 'startswith("ERROR")', 'Sum matches.'),
    ],
    quiz: [
      q('q0605_1', '`"A=1=2".split("=", 1)` natijasi nima?', 'Output of `"A=1=2".split("=", 1)`?', ['["A", "1", "2"]', '["A", "1=2"]', '["A=1", "2"]', 'Error'], ['["A", "1", "2"]', '["A", "1=2"]', '["A=1", "2"]', 'Error'], 1, 'Maksimum 1 marta bo‘ladi: `["A", "1=2"]`.', 'Splits once: `["A", "1=2"]`.'),
      q('q0605_2', 'Config faylda izoh va bo‘sh satrni o‘tkazib yuboruvchi eng toza tekshiruv?', 'Clean check to skip blank & `#` lines?', ['if line == None:', 'if not line or line.startswith("#"):', 'if len(line) > 0:', 'if "#" in line:'], ['if line == None:', 'if not line or line.startswith("#"):', 'if len(line) > 0:', 'if "#" in line:'], 1, '`if not line or line.startswith("#"):`.', '`if not line or line.startswith("#"):`.'),
      q('q0605_3', '`print(x, file=f)` va `f.write(x)` orasidagi asosiy farq?', 'Key difference of `print(x, file=f)` vs `f.write(x)`?', ['print faqat str oladi', 'print avtomatik str() va \\n qo‘shadi', 'f.write tezroq o‘qiydi', 'Farqi yo‘q'], ['print takes str only', 'print auto-converts & appends \\n', 'f.write reads', 'Identical'], 1, '`print` avtomatik stringga aylantirib `\\n` qo‘shadi.', '`print` auto-formats and adds `\\n`.'),
      q('q0605_4', '`.strip()` ning o‘rniga faqat oxirgi `\\n` ni olib tashlash metodi?', 'Strip only trailing newline without touching leading spaces?', ['.lstrip()', '.rstrip("\\n")', '.trim()', '.cut()'], ['.lstrip()', '.rstrip("\\n")', '.trim()', '.cut()'], 1, '`.rstrip("\\n")`.', '`.rstrip("\\n")`.'),
      q('q0605_5', '`text.split()` argument berilmasa nima bo‘yicha bo‘ladi?', 'What does `text.split()` split on with no arguments?', ['Faqat bitta bo‘shliq', 'Istalgan bo‘shliq, tab va \\n ketma-ketligi', 'Faqat vergul', 'Har bir harf'], ['Single space only', 'Any run of whitespace/tabs/newlines', 'Comma', 'Each char'], 1, 'Barcha whitespace belgilari bo‘yicha.', 'Any consecutive whitespace.'),
    ],
    homework: hw('`.env` Konfiguratsiya Parseri', '.env File Parser', 'Izohlar, bo‘sh satrlar va `=` belgisini o‘z ichiga olgan tokenlari bor virtual `.env` faylini temp papkaga yozib, uni `dict[str, str]` ga o‘giruvchi `load_env(path)` funksiyasini tuzing.', 'Write a `load_env(path)` function parsing comments, blank lines, and multi-`=` values cleanly into a `dict[str, str]`.', ['encoding="utf-8"', 'split("=", 1)', 'Type hints + docstring'], ['Use utf-8', 'Use split("=", 1)', 'Typed + documented'], 'if not line or line.startswith("#") or "=" not in line: continue', 'Guard malformed lines.', 'Raqamli qiymatlarni (`PORT=8080`) avtomatik `int` ga aylantiruvchi opsiyani qo‘shing.', 'Auto-cast integer digits.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),
];
