import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C06_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-06-06',
    courseId: 'files_io',
    moduleId: 'c06_m3',
    order: 6,
    titleUz: 'CSV fayllar — jadvallar bilan ishlash (`csv` moduli)',
    titleEn: 'Working with CSV Files: `csv.reader`, `DictReader` & `DictWriter`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-06-05'],
    conceptId: 'csv_files',
    whyUz: "Agar CSV satrini oddiy `line.split(\",\")` bilan bo‘lsangiz, `\"Toshkent, Chilonzor\",2026` kabi qo‘shtirnoq ichidagi vergul hamma ustunlarni buzib yuboradi! Python'ning standart `csv` moduli RFC-standart jadvallarni bexato tahlil qiladi.",
    whyEn: 'Naive `line.split(",")` breaks whenever quoted fields contain commas (`"Toshkent, UZ",100`). Python’s `csv` module handles quoting, escaping, and column headers reliably.',
    analogyUz: "`csv.reader` ustunlarni indeks (`row[0]`) bilan o‘qiydi. `csv.DictReader` esa birinchi qatorni (header) kalit qilib, har bir qatorni tayyor lug‘at (`row[\"price\"]`) qilib beradi!",
    analogyEn: '`csv.reader` returns positional lists; `csv.DictReader` turns the header row into dictionary keys for readable field access.',
    stopsUz: "CSV fayl ochishda har doim **`newline=\"\"`** bering (`open(path, \"w\", newline=\"\", encoding=\"utf-8\")`)! Aks holda Windows da har bir qatordan keyin ortiqcha bo‘sh satr yozilib qoladi. Shuningdek CSV hamma qiymatlarni **`str`** ko‘rinishida qaytaradi — sonlarni `int()`/`float()` qiling!",
    stopsEn: 'Always pass `newline=""` to `open()` for `csv` files to prevent blank rows on Windows, and cast numeric string fields via `int()`/`float()`.',
    objUz: ['`csv.reader` va `csv.DictReader` yordamida ustunli ma’lumotlarni o‘qish', '`csv.DictWriter` bilan `writeheader()` va `writerows()` yozish', 'Nima uchun `newline=""` va qo‘lda `.split(",")` qilmaslik kerakligini bilish'],
    objEn: ['Parse tabular records cleanly using `csv.reader` and `csv.DictReader`', 'Export dicts via `csv.DictWriter` with `writeheader()`', 'Avoid manual `.split(",")` and remember `newline=""`'],
    theoryUz: `### 1. Nima Uchun \`line.split(",")\` Yetarli Emas?
\`"Aliyev, Aziz",95\` da oddiy \`.split(",")\` 3 ta bo‘lak beradi. \`csv\` moduli esa qo‘shtirnoqlarni tushunib 2 ta ustun beradi!
### 2. \`csv.DictReader\` Afzalligi
Ustunlar o‘rni almashib ketsa ham \`row["name"]\` ishlayveradi. Eslatma: barcha qiymatlar \`str\` qaytadi.
### 3. \`csv.DictWriter\` va \`newline=""\`
\`\`\`python
with open(path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerows(rows)
\`\`\`
### 4. Keng tarqalgan xato
\`csv.DictWriter\` da \`writeheader()\` ni unutish yoki \`newline=""\` bermaslik.`,
    theoryEn: `### 1. Why \`split(",")\` Fails
Quoted commas and embedded newlines break naive string splitting; \`csv\` implements proper RFC 4180 quoting.
### 2. \`DictReader\` for Resilient Code
Access columns by header name (\`row["price"]\`) instead of brittle integer offsets.
### 3. \`DictWriter\` & \`newline=""\`
Always open with \`newline=""\` and call \`writer.writeheader()\` once before \`writerows()\`.
### 4. Explicit Type Casting
CSV cells always read as \`str\`—cast explicitly before math.`,
    examples: [
      ex('Misol 1: `csv.DictReader` bilan qo‘shtirnoqli vergulni to‘g‘ri o‘qish', 'Example 1: DictReader with Quoted Commas', `import csv, io\nraw = 'name,city,score\\n"Ali, B.","Toshkent, UZ",92\\n"Lola",Samarkand,98\\n'\nreader = csv.DictReader(io.StringIO(raw))\nfor row in reader:\n    print(row["name"], "->", int(row["score"]) + 2)`, `Ali, B. -> 94\nLola -> 100`, 'Qo‘shtirnoq ichidagi vergullar ustunlarni buzmagan holda o‘qildi.', '`DictReader` parsed quoted commas cleanly and cast `score` to `int`.'),
      ex('Misol 2: `csv.DictWriter` bilan jadval eksporti', 'Example 2: Exporting CSV with DictWriter', `import csv, io\nbuf = io.StringIO()\nrows = [{"item": "Pen", "qty": 3}, {"item": "Book", "qty": 2}]\nwriter = csv.DictWriter(buf, fieldnames=["item", "qty"], lineterminator="\\n")\nwriter.writeheader()\nwriter.writerows(rows)\nprint(buf.getvalue().strip())`, `item,qty\nPen,3\nBook,2`, '`writeheader()` sarlavhani, `writerows()` barcha qatorlarni yozdi.', 'Header plus rows serialized cleanly into standard CSV.'),
      ex('Misol 3: `csv.reader` bilan jami yig‘indi', 'Example 3: Aggregating CSV Column', `import csv, io\ndata = "product,price\\nTea,15.5\\nCoffee,24.5\\n"\nreader = csv.reader(io.StringIO(data))\nheader = next(reader)\ntotal = sum(float(row[1]) for row in reader)\nprint(header[1], "total:", total)`, `price total: 40.0`, '`next(reader)` sarlavha qatorini o‘tkazib yubordi.', 'Skipped header via `next(reader)` before summing column 1.'),
    ],
    traceTitleUz: '`DictReader` qator o‘qish izi',
    traceTitleEn: 'Tracing csv.DictReader',
    traceCode: `import csv, io\nr = csv.DictReader(io.StringIO("a,b\\n1,2\\n"))\nprint(next(r))`,
    traceSteps: [
      traceStep(1, 'Header read: "a,b"', 'fieldnames=["a","b"]', '1-satr kalit bo‘ldi', 'Parsed header row'),
      traceStep(2, 'next(r)', "{'a': '1', 'b': '2'}", '2-satr dict ga aylandi', 'Mapped values to strings', "{'a': '1', 'b': '2'}"),
    ],
    commonMistakes: [
      mistake('CSV ni `.split(",")` bilan tahlil qilish', 'Naive String Split on CSV', `line = '"Toshkent, UZ",100'\nprint(line.split(","))`, 'Splits into 3 broken columns instead of 2!', `import csv, io\nprint(next(csv.reader(io.StringIO('"Toshkent, UZ",100'))))`, 'Qo‘shtirnoq ichidagi vergul ustunlar sonini oshirib yuboradi.', 'Embedded commas break naive `.split(",")`.', 'Har doim standart `csv` modulini ishlating.', 'Always use the `csv` module.'),
      mistake('CSV dan o‘qilgan sonlarni `int/float` qilmaslik', 'Forgetting CSV Values Are Strings', `import csv, io\nrow = next(csv.DictReader(io.StringIO("x\\n5")))\nprint(row["x"] + 1)`, 'TypeError: can only concatenate str (not "int") to str', `import csv, io\nrow = next(csv.DictReader(io.StringIO("x\\n5")))\nprint(int(row["x"]) + 1)`, 'CSV matn fayli bo‘lgani uchun hamma kataklar `str` bo‘ladi.', 'All CSV fields arrive as `str`.', 'Arifmetikadan oldin `int()` yoki `float()` qiling.', 'Cast strings before arithmetic.'),
    ],
    compareTitleUz: '`csv.reader` vs `csv.DictReader`',
    compareTitleEn: '`csv.reader` vs `csv.DictReader`',
    compareUz: ['`csv.reader`: kam xotira, header siz yoki ustun tartibi qatʼiy bo‘lsa.', '`csv.DictReader`: o‘qilishi oson (`row["email"]`), ustunlar o‘rni o‘zgarsa ham buzilmaydi.'],
    compareEn: ['`csv.reader`: minimal overhead for headerless fixed columns.', '`csv.DictReader`: readable field names resilient to column reordering.'],
    compareSummaryUz: 'Sarlavhali jadvallarda har doim `csv.DictReader` va `csv.DictWriter` ni tanlang.',
    compareSummaryEn: 'Prefer `DictReader`/`DictWriter` whenever CSV files include header rows.',
    practiceTasks: [
      pt('p0606_1', '1-mashq: `DictReader` bilan o‘qish', 'Task 1: Read CSV Dicts', '`"k,v\\nx,10\\ny,20"` dan `v` lar yig‘indisini chiqaring.', 'Sum column v via DictReader.', `import csv, io\nr = csv.DictReader(io.StringIO("k,v\\nx,10\\ny,20"))\nprint(sum(int(x["v"]) for x in r))`, '30', 'int(x["v"])', 'Use DictReader.'),
      pt('p0606_2', '2-mashq: Qo‘shtirnoqli vergul', 'Task 2: Quoted Comma', '`csv.reader` bilan `\'"a,b",c\'` ni o‘qib `len(row)` chiqaring.', 'Verify column count is 2.', `import csv, io\nrow = next(csv.reader(io.StringIO('"a,b",c')))\nprint(len(row))`, '2', 'csv.reader parses quotes.', 'Print len(row).'),
      pt('p0606_3', '3-mashq: `DictWriter`', 'Task 3: Write Header & Row', '`DictWriter` bilan `[{"id": 1}]` yozib `.getvalue().strip()` chiqaring.', 'Serialize dict row.', `import csv, io\nb = io.StringIO()\nw = csv.DictWriter(b, fieldnames=["id"], lineterminator="\\n")\nw.writeheader()\nw.writerow({"id": 1})\nprint(b.getvalue().strip())`, 'id\n1', 'writeheader() + writerow()', 'Print output.'),
      pt('p0606_4', '4-mashq: Sarlavhani o‘tkazish', 'Task 4: Skip Header', '`csv.reader` da `next(r)` dan keyingi qatorlar sonini chiqaring.', 'Count data rows after header.', `import csv, io\nr = csv.reader(io.StringIO("h\\na\\nb"))\nnext(r)\nprint(len(list(r)))`, '2', 'next(r) skips header.', 'Count remaining.'),
      pt('p0606_5', '5-mashq: Nuqtali-vergul delimiter', 'Task 5: Semicolon Delimiter', '`"a;b\\n1;2"` ni `delimiter=";"` bilan o‘qib `"b"` ni chiqaring.', 'Use delimiter=";".', `import csv, io\nr = csv.DictReader(io.StringIO("a;b\\n1;2"), delimiter=";")\nprint(next(r)["b"])`, '2', 'delimiter=";"', 'Print next(r)["b"].'),
    ],
    quiz: [
      q('q0606_1', 'CSV fayl ochishda nima uchun `newline=""` yoziladi?', 'Why pass `newline=""` when opening CSV files?', ['Tezlik uchun', 'Windows da qo‘shimcha bo‘sh satrlar yozilmasligi uchun', 'UTF-8 uchun', 'Shart emas'], ['Speed', 'Prevent blank rows across OS line endings', 'For UTF-8', 'Optional'], 1, '`csv` moduli o‘zi qator tugashini boshqaradi.', 'Lets `csv` handle newlines cleanly.'),
      q('q0606_2', '`csv.DictReader` katak qiymatlarini qaysi turda qaytaradi?', 'Data type of values returned by `DictReader`?', ['int/str aralash', 'Har doim str', 'bytes', 'float'], ['Auto-typed', 'Always str', 'bytes', 'float'], 1, 'Har doim `str`.', 'Always `str`.'),
      q('q0606_3', '`DictWriter` da ustun nomlarini 1-satrga yozish metodi?', 'Method on `DictWriter` writing header row?', ['.header()', '.writeheader()', '.put_keys()', '.init()'], ['.header()', '.writeheader()', '.put_keys()', '.init()'], 1, '`.writeheader()`.', '`.writeheader()`.'),
      q('q0606_4', 'Yevropa CSV larida `;` ajratuvchi bo‘lsa qaysi parametr beriladi?', 'Parameter for semicolon-delimited CSV?', ['sep=";"', 'split=";"', 'delimiter=";"', 'char=";"'], ['sep=";"', 'split=";"', 'delimiter=";"', 'char=";"'], 2, '`delimiter=";"`.', '`delimiter=";"`.'),
      q('q0606_5', 'Nima uchun `line.split(",")` CSV uchun yaroqsiz?', 'Why avoid `line.split(",")` for CSV?', ['Sekin', 'Qo‘shtirnoq ichidagi vergullarda ustunlar buziladi', 'Str bermaydi', 'Xotira yeydi'], ['Slow', 'Breaks on commas inside quoted fields', 'No strings', 'High memory'], 1, 'Quoted vergullarni ajrata olmaydi.', 'Breaks on quoted commas.'),
    ],
    homework: hw('Sotuvlar CSV Analizatori va Eksporti', 'CSV Sales Aggregator', 'Temp papkada `sales.csv` faylini `DictWriter` bilan yarating (kamida 4 ta yozuv, qo‘shtirnoqli mahsulot nomi bilan), so‘ng `DictReader` bilan o‘qib umumiy daromadni `summary.csv` ga yozing.', 'Write `sales.csv` with `DictWriter`, read it via `DictReader`, compute category revenue, and export `summary.csv`.', ['newline="" + encoding="utf-8"', 'int()/float() casting', 'Qo‘shtirnoqli maydon testi'], ['Use newline="" and utf-8', 'Cast numeric values', 'Include quoted field'], 'revenue = float(row["price"]) * int(row["qty"])', 'Aggregate per category.', 'Eng daromadli kategoriyani konsolga chiqaring.', 'Print top category.', 25),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-06-07',
    courseId: 'files_io',
    moduleId: 'c06_m3',
    order: 7,
    titleUz: 'JSON format — API va sozlamalar tili (`json` moduli)',
    titleEn: 'Working with JSON: Serialization, `dump`/`dumps` & `ensure_ascii=False`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-06-06'],
    conceptId: 'json_files',
    whyUz: "JSON — zamonaviy veb, REST API, konfiguratsiya fayllari va NoSQL bazalarning universal tili. Python `dict`/`list` larini JSON ga va aksincha aylantirishni bilmasdan zamonaviy backend yozib bo‘lmaydi.",
    whyEn: 'JSON is the universal interchange format for APIs, webhooks, and configs. Python’s `json` module converts between JSON text/files and native dicts/lists.',
    analogyUz: "`json.dumps` / `dump` — bu Python obyektini pochta qutisiga jo‘natish uchun standart xalqaro paketga (string/fayl) qadoqlash; `loads` / `load` — kelgan paketni qayta Python `dict` ga ochish.",
    analogyEn: '`dumps`/`dump` packs Python dicts into portable JSON text/files; `loads`/`load` unpacks JSON back into Python dicts.',
    stopsUz: "1) `dump`/`load` — **fayl** bilan, `dumps`/`loads` (`s` = string) — **string** bilan ishlaydi! 2) O‘zbek/Kirill harflarini `\\u0430` kabi buzib yubormaslik uchun **`ensure_ascii=False`** bering! 3) `set` va `datetime` to‘g‘ridan-to‘g‘ri JSON bo‘lmaydi (`TypeError`)!",
    stopsEn: '`dump`/`load` work on file streams while `dumps`/`loads` work on strings. Pass `ensure_ascii=False` for readable Unicode, and note `set`/`datetime` are not JSON-serializable directly.',
    objUz: ['`json.dumps()` / `json.loads()` (strings) va `json.dump()` / `json.load()` (files) farqini bilish', 'Chiroyli formatlash uchun `indent=2, ensure_ascii=False` qo‘llash', 'JSON <-> Python tur jadvalini va `json.JSONDecodeError` ni ushlashni o‘rganish'],
    objEn: ['Distinguish string functions (`dumps`/`loads`) from file functions (`dump`/`load`)', 'Format readable UTF-8 JSON with `indent=2, ensure_ascii=False`', 'Handle `JSONDecodeError` and unsupported Python types (`set`, `datetime`)'],
    theoryUz: `### 1. Python <-> JSON Tur Xaritasi
| Python | JSON |
|---|---|
| \`dict\` | \`object {...}\` |
| \`list\`, \`tuple\` | \`array [...]\` |
| \`str\` | \`string "..."\` |
| \`int\`, \`float\` | \`number\` |
| \`True / False\` | \`true / false\` |
| \`None\` | \`null\` |
### 2. \`dump(s)\` vs \`load(s)\` Eslab Qolish Qoidasi
Oxirida **\`s\`** harfi borlari = **\`s\`tring** (\`dumps\`, \`loads\`); **\`s\`** sizlari = **fayl** (\`dump(data, f)\`, \`load(f)\`).
### 3. O‘zbekcha Matn Uchun \`ensure_ascii=False\`
Standart \`json.dumps({"city": "O‘sh"})\` Unicode ni \`\\u2018\` ga aylantiradi. \`ensure_ascii=False, indent=2\` toza o‘qiladigan fayl yaratadi!
### 4. Keng tarqalgan xato
\`json.dumps({1, 2, 3})\` (\`set\`) -> \`TypeError: Object of type set is not JSON serializable\`. Avval \`sorted(s)\` yoki \`list(s)\` ga o‘giring. Noto‘g‘ri JSON da \`json.JSONDecodeError\` tuting.`,
    theoryEn: `### 1. Type Mapping
\`dict->{}\`, \`list/tuple->[]\`, \`True/False->true/false\`, \`None->null\`.
### 2. \`dump\`/\`load\` vs \`dumps\`/\`loads\`
The trailing \`s\` stands for **s**tring; without \`s\`, pass a file object.
### 3. Readable UTF-8 Output
Pass \`indent=2, ensure_ascii=False\` when writing configs or Uzbek text.
### 4. Common Errors
Sets/datetimes raise \`TypeError\` unless converted; invalid JSON raises \`json.JSONDecodeError\`.`,
    examples: [
      ex('Misol 1: `dumps` (`indent=2`, `ensure_ascii=False`) va `loads`', 'Example 1: String Serialization & Parsing', `import json\nuser = {"name": "O‘tkir", "active": True, "note": None, "tags": ("py", "api")}\ntext = json.dumps(user, indent=2, ensure_ascii=False)\nprint(text)\nparsed = json.loads(text)\nprint("Type of tags:", type(parsed["tags"]).__name__)`, `{\n  "name": "O‘tkir",\n  "active": true,\n  "note": null,\n  "tags": [\n    "py",\n    "api"\n  ]\n}\nType of tags: list`, '`True`->`true`, `None`->`null`, `tuple` esa JSON orqali `list` bo‘lib qaytdi.', 'Preserved Uzbek apostrophe cleanly; tuple deserialized back as list.'),
      ex('Misol 2: Faylga `json.dump` va `json.load`', 'Example 2: File Persistence with dump/load', `import json, tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as tmp:\n    p = Path(tmp) / "cfg.json"\n    with open(p, "w", encoding="utf-8") as f:\n        json.dump({"theme": "dark", "limit": 50}, f, indent=2)\n    with open(p, "r", encoding="utf-8") as f:\n        loaded = json.load(f)\n    print(loaded["theme"], loaded["limit"])`, `dark 50`, 'Fayl oqimiga to‘g‘ridan-to‘g‘ri yozildi va o‘qildi.', 'Serialized and restored dict cleanly via `dump` and `load`.'),
      ex('Misol 3: Buzilgan JSON da `JSONDecodeError` tutish', 'Example 3: Handling Invalid JSON', `import json\nbad_payload = "{name: Ali}"  # qo'shtirnoqsiz kalit xato!\ntry:\n    json.loads(bad_payload)\nexcept json.JSONDecodeError as err:\n    print("Invalid JSON line:", err.lineno, "col:", err.colno)`, `Invalid JSON line: 1 col: 2`, 'JSON kalitlari faqat ikkitalik qo‘shtirnoq `"` bilan yozilishi shart.', 'Caught malformed JSON gracefully using `json.JSONDecodeError`.'),
    ],
    traceTitleUz: 'JSON round-trip izi',
    traceTitleEn: 'Tracing JSON Round-Trip',
    traceCode: `import json\ns = json.dumps({"ok": True, "v": None})\nprint(s)\nprint(json.loads(s)["v"])`,
    traceSteps: [
      traceStep(1, 'json.dumps(...)', '{"ok": true, "v": null}', 'Python True/None -> JSON true/null', 'Serialized to JSON'),
      traceStep(2, 'json.loads(s)["v"]', 'None', 'null yana Python None ga qaytdi', 'Restored Python None', 'None'),
    ],
    commonMistakes: [
      mistake('`json.load(json_string)` deb string berish', 'Passing String to json.load()', `import json\nprint(json.load('{"a": 1}'))`, "AttributeError: 'str' object has no attribute 'read'", `import json\nprint(json.loads('{"a": 1}'))`, '`json.load` fayl kutadi; string uchun `json.loads` kerak.', '`load` reads file objects; `loads` reads strings.', 'String uchun har doim oxirida `s` borini (`loads`/`dumps`) chaqiring.', 'Use `loads`/`dumps` for strings.'),
      mistake('`set` ni to‘g‘ridan-to‘g‘ri `json.dumps` qilish', 'Serializing a Set Directly', `import json\njson.dumps({"tags": {"py", "sql"}})`, 'TypeError: Object of type set is not JSON serializable', `import json\nprint(json.dumps({"tags": sorted({"py", "sql"})}))`, 'JSON da `set` turi yo‘q, faqat `array` (`list`) bor.', 'JSON has arrays (`list`), not sets.', '`list()` yoki `sorted()` ga aylantiring.', 'Convert sets to `sorted(...)` or `list(...)`.'),
    ],
    compareTitleUz: 'CSV vs JSON',
    compareTitleEn: 'CSV vs JSON',
    compareUz: ['CSV: bir xil ustunli katta jadvallar (Excel, SQL eksport) uchun ixcham.', 'JSON: ichma-ich tuzilmalar, lug‘atlar, massivlar va veb API lar uchun standart.'],
    compareEn: ['CSV: flat uniform spreadsheets and bulk tables.', 'JSON: nested objects, APIs, and heterogeneous configs.'],
    compareSummaryUz: 'Jadval ma’lumotlari uchun CSV, ierarxik konfiguratsiya va API lar uchun JSON tanlang.',
    compareSummaryEn: 'Choose CSV for flat tables and JSON for hierarchical objects and APIs.',
    practiceTasks: [
      pt('p0607_1', '1-mashq: `json.loads`', 'Task 1: Parse JSON String', "`'{\"x\": 10, \"ok\": true}'` ni parse qilib `\"ok\"` qiymatini chiqaring.", 'Parse JSON and print ok.', `import json\nprint(json.loads('{"x": 10, "ok": true}')["ok"])`, 'True', 'json.loads(...)', 'Access ["ok"].'),
      pt('p0607_2', '2-mashq: `json.dumps`', 'Task 2: Serialize Dict', '`{"a": None, "b": False}` ni `json.dumps()` bilan chiqaring.', 'Dump Python dict to JSON string.', `import json\nprint(json.dumps({"a": None, "b": False}))`, '{"a": null, "b": false}', 'json.dumps(...)', 'Observe null/false.'),
      pt('p0607_3', '3-mashq: `ensure_ascii=False`', 'Task 3: Unicode Safe Dump', '`{"uz": "O‘zbek"}` ni `ensure_ascii=False` bilan chiqaring.', 'Preserve Unicode apostrophe.', `import json\nprint(json.dumps({"uz": "O‘zbek"}, ensure_ascii=False))`, '{"uz": "O‘zbek"}', 'ensure_ascii=False', 'Keep Unicode intact.'),
      pt('p0607_4', '4-mashq: `JSONDecodeError`', 'Task 4: Catch Bad JSON', '`"{bad"` ni `json.loads` qilib `JSONDecodeError` tuting.', 'Catch invalid JSON.', `import json\ntry:\n    json.loads("{bad")\nexcept json.JSONDecodeError:\n    print("bad json")`, 'bad json', 'except json.JSONDecodeError', 'Print "bad json".'),
      pt('p0607_5', '5-mashq: Set -> List JSON', 'Task 5: Serialize Set', '`sorted({3, 1})` ni JSON ga o‘girib chiqaring.', 'Serialize sorted set.', `import json\nprint(json.dumps(sorted({3, 1})))`, '[1, 3]', 'Convert set via sorted()', 'Dump list.'),
    ],
    quiz: [
      q('q0607_1', 'Python stringidan JSON obyektini o‘qish funksiyasi?', 'Function parsing JSON from a string?', ['json.load', 'json.loads', 'json.read', 'json.parse'], ['json.load', 'json.loads', 'json.read', 'json.parse'], 1, '`json.loads` (`s` = string).', '`json.loads`.'),
      q('q0607_2', 'Python `None` JSON ga o‘tganda nima bo‘ladi?', 'Python `None` becomes what in JSON?', ['undefined', 'none', 'null', 'false'], ['undefined', 'none', 'null', 'false'], 2, '`null`.', '`null`.'),
      q('q0607_3', 'Kirill/O‘zbek harflarini `\\uXXXX` qilmay asl holida yozish parametri?', 'Parameter preserving raw Unicode in `json.dumps`?', ['utf8=True', 'raw=True', 'ensure_ascii=False', 'unicode=True'], ['utf8=True', 'raw=True', 'ensure_ascii=False', 'unicode=True'], 2, '`ensure_ascii=False`.', '`ensure_ascii=False`.'),
      q('q0607_4', 'Qaysi Python turi to‘g‘ridan-to‘g‘ri `json.dumps` bo‘lmaydi?', 'Which type fails direct `json.dumps`?', ['tuple', 'dict', 'set', 'bool'], ['tuple', 'dict', 'set', 'bool'], 2, '`set` (`TypeError`).', '`set`.'),
      q('q0607_5', 'Buzilgan JSON matnida qaysi xato ko‘tariladi?', 'Exception raised on malformed JSON?', ['SyntaxError', 'json.JSONDecodeError', 'KeyError', 'IOError'], ['SyntaxError', 'json.JSONDecodeError', 'KeyError', 'IOError'], 1, '`json.JSONDecodeError`.', '`json.JSONDecodeError`.'),
    ],
    homework: hw('JSON Sozlamalar Ombori (`load`/`save`)', 'JSON Settings Store', 'Temp papkada `settings.json` faylini `ensure_ascii=False, indent=2` bilan saqlaydigan `save_settings` va buzilgan/yo‘q faylda default qaytaradigan `load_settings` funksiyalarini tuzing.', 'Implement `save_settings(path, data)` and `load_settings(path, defaults)` handling missing or corrupted JSON files gracefully.', ['dump / load ishlatilsin', 'FileNotFoundError va JSONDecodeError tutish'], ['Use json.dump/load', 'Handle missing & corrupt files'], 'except (FileNotFoundError, json.JSONDecodeError): return defaults.copy()', 'Fallback cleanly.', 'Sozlamani yangilab qayta yuklashni ham sinang.', 'Verify update persistence.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-06-08',
    courseId: 'files_io',
    moduleId: 'c06_m3',
    order: 8,
    titleUz: 'Binary Files — bayt oqimlari, PNG/PDF sarlavhasi va `struct`',
    titleEn: 'Binary Files: `bytes`, `bytearray`, Magic Headers & `io.BytesIO`',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-06-07'],
    conceptId: 'binary_files',
    whyUz: "Rasmlar (PNG/JPEG), PDF, audio, ZIP arxivlar va tarmoq paketlari oddiy matn emas — ular xom **baytlar (`0..255`)**! Fayl haqiqatan PNG ekanini `.png` kengaytmasiga ishonib emas, uning birinchi **magic bytes** sarlavhasidan tekshirish xavfsizlikda hal qiluvchi ahamiyatga ega.",
    whyEn: 'Images, PDFs, archives, and network frames are raw binary bytes. Inspecting magic-byte signatures in binary mode (`"rb"`) verifies true file formats reliably.',
    analogyUz: "Matn fayli (`\"r\"`) — bu o‘zbek tilida yozilgan xat (uni harfga tarjima qilib o‘qiysiz). Binary fayl (`\"rb\"`) — bu raqamli surat yoki musiqa fayli: uni matnga aylantirsangiz chalkash belgilar chiqadi, shuning uchun xom baytlar (`b'...'`) bilan ishlanadi.",
    analogyEn: 'Text mode translates bytes into letters; binary mode reads raw byte values `0..255` untouched so media and headers stay intact.',
    stopsUz: "1) Binary rejimda (`\"rb\"`, `\"wb\"`) **`encoding=`** yozilmaydi (`ValueError`)! 2) `bytes` **immutable** (o‘zgarmas), agar baytni joyida o‘zgartirmoqchi bo‘lsangiz `bytearray` kerak!",
    stopsEn: 'Never pass `encoding=` to `"rb"`/`"wb"` modes. Also remember `bytes` is immutable—use `bytearray` for in-place byte mutation.',
    objUz: ['`"rb"` / `"wb"` rejimlari, `bytes` vs `bytearray` va `io.BytesIO` ni tushunish', 'Faylning dastlabki **Magic Bytes** imzosini (`\\x89PNG`, `%PDF`) tekshirish', '`chunk` (bo‘laklab o‘qish: `f.read(4096)`) va `struct.pack` asoslarini bilish'],
    objEn: ['Use `"rb"`/`"wb"`, `bytes`, `bytearray`, and `io.BytesIO` cleanly', 'Inspect file magic bytes (`PNG`, `PDF`, `PK` ZIP) to verify file types', 'Stream large binary payloads in fixed byte chunks'],
    theoryUz: `### 1. \`bytes\` va Binary Mode (\`"rb"\` / \`"wb"\`)
\`b"\\x89PNG"\` — har bir element \`0..255\` oralig‘idagi butun son (\`raw[0]\` -> \`137\`). \`"rb"\` va \`"wb"\` da \`encoding=\` berilmaydi!
### 2. \`bytes\` (Immutable) vs \`bytearray\` (Mutable)
\`b = bytearray(b"ABC"); b[0] = 90\` -> \`bytearray(b'ZBC')\`.
### 3. Magic Bytes (Fayl Imzosi) Tekshiruvi
Foydalanuvchi \`malware.exe\` ni \`avatar.png\` deb yuklashi mumkin. Dastlabki 4–8 bayt haqiqiy turni fosh qiladi:
- PNG: \`b"\\x89PNG\\r\\n\\x1a\\n"\`
- PDF: \`b"%PDF"\`
- ZIP: \`b"PK\\x03\\x04"\`
### 4. Bo‘laklab (Chunked) O‘qish
Katta videoni RAM ga yuklamaslik uchun \`while chunk := f.read(65536): ...\` yoziladi.
### 5. Keng tarqalgan xato
Rasm/ZIP faylni oddiy \`"r"\` (text mode) da ochish -> \`UnicodeDecodeError\`.`,
    theoryEn: `### 1. \`bytes\` & Binary Modes
\`b"..."\` holds integers \`0..255\`. Binary \`open()\` never takes \`encoding=\`.
### 2. \`bytes\` vs \`bytearray\`
\`bytes\` is immutable; \`bytearray\` allows in-place byte updates.
### 3. Magic Byte Signatures
Inspect the first bytes (\`b"\\x89PNG"\`, \`b"%PDF"\`) rather than trusting file extensions.
### 4. Chunked Streaming
Read large binaries in chunks using the walrus operator \`while chunk := f.read(4096):\`.
### 5. Text-Mode Binary Bug
Opening binary data without \`b\` causes \`UnicodeDecodeError\`.`,
    examples: [
      ex('Misol 1: Magic Bytes bilan haqiqiy fayl turini aniqlash', 'Example 1: Detecting File Type via Magic Bytes', `def detect_kind(header: bytes) -> str:\n    if header.startswith(b"\\x89PNG"):\n        return "PNG Image"\n    if header.startswith(b"%PDF"):\n        return "PDF Document"\n    if header.startswith(b"PK\\x03\\x04"):\n        return "ZIP Archive"\n    return "Unknown"\n\nprint(detect_kind(b"\\x89PNG\\r\\n\\x1a\\n..."), detect_kind(b"%PDF-1.7"))`, `PNG Image PDF Document`, 'Fayl kengaytmasiga qaramay dastlabki baytlardan haqiqiy format aniqlandi.', 'Identified real file formats from binary header signatures.'),
      ex('Misol 2: `tempfile` da `"wb"` / `"rb"` va chunked o‘qish', 'Example 2: Binary Write & Chunked Read', `import tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as tmp:\n    p = Path(tmp) / "data.bin"\n    with open(p, "wb") as f:\n        f.write(b"ABCDEFGH")\n    chunks = []\n    with open(p, "rb") as f:\n        while chunk := f.read(3):\n            chunks.append(chunk)\n    print(chunks)`, `[b'ABC', b'DEF', b'GH']`, 'Walrus operatori `:=` yordamida 3 baytli bo‘laklar bilan o‘qildi.', 'Streamed binary file in 3-byte chunks cleanly.'),
      ex('Misol 3: `bytearray` va `struct.pack`', 'Example 3: Mutable bytearray & struct', `import struct\npacket = struct.pack(">HH", 1, 258)\nmutable = bytearray(packet)\nmutable[0] = 9\nprint(list(packet), "->", list(mutable))`, `[0, 1, 1, 2] -> [9, 1, 1, 2]`, '`struct.pack` sonlarni tarmoq/binary baytlarga aylantirdi.', 'Packed big-endian shorts and mutated byte 0 via `bytearray`.'),
    ],
    traceTitleUz: 'Chunked binary o‘qish izi',
    traceTitleEn: 'Tracing Chunked Binary Read',
    traceCode: `import io\nf = io.BytesIO(b"12345")\nprint(f.read(2), f.read(2), f.read(2))`,
    traceSteps: [
      traceStep(1, 'f.read(2)', "b'12'", 'Dastlabki 2 bayt', 'First 2 bytes'),
      traceStep(2, 'f.read(2)', "b'34'", 'Keyingi 2 bayt', 'Next 2 bytes'),
      traceStep(3, 'f.read(2)', "b'5'", 'Oxirgi 1 bayt qoldi', 'Final 1 byte', "b'12' b'34' b'5'"),
    ],
    commonMistakes: [
      mistake('`"rb"` rejimida `encoding="utf-8"` berish', 'Passing encoding= in Binary Mode', `import io\nopen("x.bin", "rb", encoding="utf-8")`, "ValueError: binary mode doesn't take an encoding argument", `# Always omit encoding= when 'b' is in mode\nmode = "rb"`, 'Binary rejim baytlarni matnga aylantirmaydi.', 'Binary mode reads raw bytes without decoding.', '`"rb"` / `"wb"` da `encoding=` ni olib tashlang.', 'Omit `encoding=` for binary streams.'),
      mistake('`bytes` elementini joyida o‘zgartirishga urinish', 'Mutating Immutable bytes', `b = b"abc"\nb[0] = 65`, "TypeError: 'bytes' object does not support item assignment", `b = bytearray(b"abc")\nb[0] = 65\nprint(bytes(b))`, '`bytes` xuddi `str` kabi o‘zgarmasdir.', '`bytes` is immutable like `str`.', 'O‘zgartirish uchun `bytearray` ishlating.', 'Use `bytearray` for mutable byte buffers.'),
    ],
    compareTitleUz: '`bytes` vs `bytearray`',
    compareTitleEn: '`bytes` vs `bytearray`',
    compareUz: ['`bytes`: o‘zgarmas, hashable (dict kaliti bo‘la oladi), o‘qish va imzolar uchun.', '`bytearray`: joyida tahrirlash va protokol buferlari uchun.'],
    compareEn: ['`bytes`: immutable, hashable binary sequence.', '`bytearray`: mutable in-place byte buffer.'],
    compareSummaryUz: 'O‘zgarmas binary ma’lumotlar uchun `bytes`, baytma-bayt yig‘ish/tahrirlash uchun `bytearray` tanlang.',
    compareSummaryEn: 'Use `bytes` by default and `bytearray` only when mutating byte buffers in place.',
    practiceTasks: [
      pt('p0608_1', '1-mashq: Bayt qiymati', 'Task 1: Byte Indexing', '`b"AZ"[0]` va `b"AZ"[1]` ASCII kodlarini chiqaring.', 'Print byte ints at 0 and 1.', `b = b"AZ"\nprint(b[0], b[1])`, '65 90', 'Indexing bytes yields int 0..255.', 'Print b[0], b[1].'),
      pt('p0608_2', '2-mashq: `BytesIO` magic check', 'Task 2: Check PDF Signature', '`io.BytesIO(b"%PDF-1.4")`: `.read(4) == b"%PDF"` ni chiqaring.', 'Check PDF magic bytes.', `import io\nf = io.BytesIO(b"%PDF-1.4")\nprint(f.read(4) == b"%PDF")`, 'True', 'read(4) == b"%PDF"', 'Verify signature.'),
      pt('p0608_3', '3-mashq: `bytearray` tahriri', 'Task 3: Mutate bytearray', '`ba = bytearray(b"hi"); ba[0] = 72` ni `bytes(ba)` qilib chiqaring.', 'Mutate byte 0 to H (72).', `ba = bytearray(b"hi")\nba[0] = 72\nprint(ba.decode("ascii"))`, 'Hi', 'ba[0] = 72', 'Decode to string.'),
      pt('p0608_4', '4-mashq: Hex ko‘rinishi', 'Task 4: Hex Representation', '`b"\\x01\\x0f".hex()` ni chiqaring.', 'Print hex string.', `print(b"\\x01\\x0f".hex())`, '010f', '.hex()', 'Use .hex().'),
      pt('p0608_5', '5-mashq: Temp binary yozish', 'Task 5: Temp Binary Write', 'Temp papkada `a.bin` ga `b"\\x00\\xff"` yozib hajmini chiqaring.', 'Write 2 bytes and print len.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    p = Path(d) / "a.bin"\n    p.write_bytes(b"\\x00\\xff")\n    print(len(p.read_bytes()))`, '2', 'write_bytes / read_bytes', 'Print len.'),
    ],
    quiz: [
      q('q0608_1', '`b"A"[0]` nimani qaytaradi?', 'What does `b"A"[0]` return?', ['b"A"', '"A"', '65', 'Error'], ['b"A"', '"A"', '65', 'Error'], 2, 'Butun son ASCII/bayt qiymatini (`65`).', 'Integer `65`.'),
      q('q0608_2', 'Qaysi bayt turi o‘zgaruvchan (mutable)?', 'Which binary type is mutable?', ['bytes', 'bytearray', 'str', 'tuple'], ['bytes', 'bytearray', 'str', 'tuple'], 1, '`bytearray`.', '`bytearray`.'),
      q('q0608_3', 'PDF faylning boshidagi magic signature qanday?', 'Standard PDF magic header bytes?', ['b"%PDF"', 'b"PDF0"', 'b"PK"', 'b"GIF"'], ['b"%PDF"', 'b"PDF0"', 'b"PK"', 'b"GIF"'], 0, '`b"%PDF"`.', '`b"%PDF"`.'),
      q('q0608_4', 'Binary rejimda `encoding="utf-8"` bersak nima bo‘ladi?', 'What happens passing `encoding=` with `"rb"`?', ['UTF-8 o‘qiydi', 'ValueError chiqaradi', 'Ignore qiladi', 'str qaytaradi'], ['Reads UTF-8', 'Raises ValueError', 'Ignored', 'Returns str'], 1, '`ValueError`.', '`ValueError`.'),
      q('q0608_5', 'Katta rasm yoki video faylni Xotira (RAM) tejab o‘qish usuli?', 'Memory-safe way to read large binary files?', ['f.read()', 'while chunk := f.read(4096):', 'f.readlines()', 'str(f)'], ['f.read()', 'while chunk := f.read(4096):', 'f.readlines()', 'str(f)'], 1, 'Ruxsat etilgan chunk hajmi bilan bo‘laklab o‘qish.', 'Chunked loop with fixed buffer size.'),
    ],
    homework: hw('Yuklangan Fayl Imzosi Tekshiruvchisi', 'Upload Magic-Byte Validator', '`verify_upload(filename, raw_bytes)` funksiyasini tuzing: `.png` va `.pdf` fayllarning kengaytmasi ularning haqiqiy magic bytes (`b"\\x89PNG"`, `b"%PDF"`) ga mos kelishini tekshirsin.', 'Implement `verify_upload(filename, raw_bytes)` ensuring `.png` and `.pdf` files match true magic signatures.', ['b"\\x89PNG" va b"%PDF" tekshiruvi', 'Soxta kengaytmali faylni rad etish'], ['Check PNG & PDF magic headers', 'Reject spoofed extensions'], 'raw_bytes.startswith(b"%PDF")', 'Match extension vs header.', 'Temp papkaga 2 ta test fayl yozib tekshiring.', 'Test valid and spoofed temp files.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-06-09',
    courseId: 'files_io',
    moduleId: 'c06_m4',
    order: 9,
    titleUz: '`pathlib` bilan zamonaviy ishlash va Review #13',
    titleEn: 'Modern Path Handling with `pathlib.Path` & Review #13',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-06-08'],
    conceptId: 'pathlib_module',
    whyUz: "Eski `os.path.join(os.path.dirname(...), \"a\")` o‘rniga Python 3.4+ dan beri obyektga yo‘naltirilgan **`pathlib.Path`** standarti ishlatiladi: yo‘l qo‘shish `/` operatori bilan yoziladi va Windows/Linux/macOS da birdek ishlaydi!",
    whyEn: '`pathlib.Path` replaces clumsy `os.path` string manipulation with clean object-oriented path joins (`/`), metadata properties, and globbing.',
    analogyUz: "`os.path` — bu manzilni oddiy matn bo‘laklarini skotch bilan yopishtirib yasash. `pathlib.Path` — esa har bir xonasi (`.name`, `.stem`, `.suffix`, `.parent`) tayyor aqlli GPS navigator!",
    analogyEn: '`os.path` glues path strings together; `pathlib.Path` is a structured object exposing `.name`, `.stem`, `.suffix`, `.parent`, and `.glob()`.',
    stopsUz: "`p.mkdir(parents=True, exist_ok=True)` — agar oraliq papkalar ham yo‘q bo‘lsa hammasini yaratadi va papka allaqachon mavjud bo‘lsa xato bermaydi!",
    stopsEn: 'Always pass `parents=True, exist_ok=True` to `.mkdir()` so missing parent dirs are created and existing dirs do not raise `FileExistsError`.',
    objUz: ['`Path` obyektini `/` bilan qurish va `.name`, `.stem`, `.suffix`, `.parent`, `.parts` atributlarini o‘qish', '`.exists()`, `.is_file()`, `.is_dir()`, `.mkdir(parents=True, exist_ok=True)` metodlarini qo‘llash', '`.glob("*.py")` va rekursiv `.rglob("*.py")` bilan fayllarni qidirish'],
    objEn: ['Build cross-platform paths with `/` and inspect `.name`, `.stem`, `.suffix`, `.parent`', 'Create nested directories safely via `.mkdir(parents=True, exist_ok=True)`', 'Search directory trees cleanly using `.glob()` and `.rglob()`'],
    theoryUz: `### 1. \`/\` Operatori Bilan Yo‘l Qurish
\`base = Path("project") / "data" / "report.csv"\`. Matn stringi emas, aqlli \`Path\` obyekti!
### 2. Muhim Atributlar (\`"logs/app_v2.tar.gz"\` misolida)
- \`.name\` -> \`"report.csv"\`
- \`.stem\` -> \`"report"\` (kengaytmasiz nom)
- \`.suffix\` -> \`".csv"\`
- \`.parent\` -> \`Path("project/data")\`
- \`.with_suffix(".json")\` -> \`Path("project/data/report.json")\`
### 3. Papka Yaratish va Qidirish
\`folder.mkdir(parents=True, exist_ok=True)\`.
\`folder.glob("*.py")\` — faqat shu papkadagi \`.py\` fayllar; \`folder.rglob("*.py")\` — **barcha ichki papkalardan** rekursiv qidiradi!
### 4. Tezkor O‘qish / Yozish Metodlari
Kichik fayllar uchun: \`p.write_text("hi", encoding="utf-8")\` va \`p.read_text(encoding="utf-8")\`.
### 5. Keng tarqalgan xato
\`p.mkdir()\` ga \`parents=True, exist_ok=True\` bermay \`FileNotFoundError\` yoki \`FileExistsError\` olish.`,
    theoryEn: `### 1. Path Construction with \`/\`
\`Path("data") / "2026" / "sales.csv"\` works across Windows and POSIX.
### 2. Path Anatomy
\`.name\`, \`.stem\`, \`.suffix\`, \`.parent\`, \`.with_suffix(".bak")\`.
### 3. Directories & Globbing
Use \`.mkdir(parents=True, exist_ok=True)\`; use \`.glob()\` (shallow) vs \`.rglob()\` (recursive).
### 4. Convenience Helpers
\`.read_text(encoding="utf-8")\` and \`.write_text(..., encoding="utf-8")\` for small files.
### 5. Pitfall
Bare \`.mkdir()\` fails if parent folders are missing or target already exists.`,
    examples: [
      ex('Misol 1: `Path` atributlari va `.with_suffix()`', 'Example 1: Inspecting Path Parts', `from pathlib import Path\np = Path("exports") / "2026" / "report.csv"\nprint("Name:", p.name, "| Stem:", p.stem, "| Suffix:", p.suffix)\nprint("Parent:", p.parent.as_posix())\nprint("JSON:", p.with_suffix(".json").as_posix())`, `Name: report.csv | Stem: report | Suffix: .csv\nParent: exports/2026\nJSON: exports/2026/report.json`, 'String kesish (`split(".")`) siz fayl nomining hamma qismlari olindi.', 'Extracted filename parts and swapped extension safely.'),
      ex('Misol 2: `mkdir(parents=True, exist_ok=True)` va `.rglob()`', 'Example 2: Creating Nested Dirs & Recursive Glob', `import tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as tmp:\n    root = Path(tmp)\n    sub = root / "a" / "b"\n    sub.mkdir(parents=True, exist_ok=True)\n    (root / "top.py").write_text("x=1", encoding="utf-8")\n    (sub / "deep.py").write_text("y=2", encoding="utf-8")\n    found = sorted(f.name for f in root.rglob("*.py"))\n    print("Found .py:", found)`, `Found .py: ['deep.py', 'top.py']`, '`.rglob("*.py")` ichki `a/b` papkadagi faylni ham topdi!', 'Recursive glob discovered `.py` files across nested folders.'),
      ex('Misol 3: Fayl vs Papkani ajratish', 'Example 3: Filtering Files vs Directories', `import tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as tmp:\n    root = Path(tmp)\n    (root / "docs").mkdir()\n    (root / "a.txt").write_text("1", encoding="utf-8")\n    files = [x.name for x in root.iterdir() if x.is_file()]\n    dirs = [x.name for x in root.iterdir() if x.is_dir()]\n    print("Files:", files, "| Dirs:", dirs)`, `Files: ['a.txt'] | Dirs: ['docs']`, '`.iterdir()` + `.is_file()` / `.is_dir()` toza ajratadi.', 'Separated files from subdirectories cleanly via `iterdir()`.'),
    ],
    traceTitleUz: 'Path transformatsiya izi',
    traceTitleEn: 'Tracing pathlib Transformations',
    traceCode: `from pathlib import Path\np = Path("a/b/c.txt")\nprint(p.parent.name, p.stem, p.suffix)`,
    traceSteps: [
      traceStep(1, 'p.parent.name', 'b', 'Ota papka nomi', 'Parent folder name'),
      traceStep(2, 'p.stem', 'c', 'Kengaytmasiz nom', 'Stem without suffix'),
      traceStep(3, 'p.suffix', '.txt', 'Kengaytma', 'Extension', 'b c .txt'),
    ],
    commonMistakes: [
      mistake('`mkdir()` ga `parents=True, exist_ok=True` bermaslik', 'Bare mkdir() Failures', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    (Path(d) / "x" / "y").mkdir()`, 'FileNotFoundError: missing parent folder "x"', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    sub = Path(d) / "x" / "y"\n    sub.mkdir(parents=True, exist_ok=True)\n    print(sub.is_dir())`, 'Oraliq papka yo‘q bo‘lsa oddiy `.mkdir()` yiqiladi.', 'Bare `.mkdir()` cannot create intermediate parents.', 'Har doim `mkdir(parents=True, exist_ok=True)` yozing.', 'Always use `parents=True, exist_ok=True`.'),
      mistake('`.glob("*.py")` ichki papkalarni ham qidiradi deb o‘ylash', 'Expecting .glob() to Recurse', `# .glob("*.py") checks only immediate children`, 'Misses files in subdirectories', `from pathlib import Path\nprint(Path("a/b.py").match("*.py"))`, '`.glob()` faqat 1-qavatni qaraydi; rekursiv qidiruv uchun `.rglob()` kerak.', '`.glob()` is shallow unless `**/*.py` or `.rglob()` is used.', 'Ichki papkalar uchun `.rglob("*.py")` ishlating.', 'Use `.rglob()` for nested search.'),
    ],
    compareTitleUz: '`os.path` vs `pathlib.Path`',
    compareTitleEn: '`os.path` vs `pathlib.Path`',
    compareUz: ['`os.path`: eski string-asosli funksiyalar (ichma-ich chaqiruvlar noqulay).', '`pathlib.Path`: Python 3 zamonaviy OOP standarti (`/` operatori, `.glob`, `.read_text`).'],
    compareEn: ['`os.path`: legacy procedural string functions.', '`pathlib.Path`: modern OOP standard with `/` operator and built-in helpers.'],
    compareSummaryUz: 'Yangi Python kodlarida yo‘llar uchun har doim `pathlib.Path` dan foydalaning.',
    compareSummaryEn: 'Standardize on `pathlib.Path` for all filesystem path manipulation.',
    practiceTasks: [
      pt('p0609_1', '1-mashq: `.stem` va `.suffix`', 'Task 1: Stem & Suffix', '`Path("data/sales.csv")` ning `.stem` va `.suffix` ini chiqaring.', 'Print stem and suffix.', `from pathlib import Path\np = Path("data/sales.csv")\nprint(p.stem, p.suffix)`, 'sales .csv', 'p.stem, p.suffix', 'Inspect Path attributes.'),
      pt('p0609_2', '2-mashq: `.with_suffix()`', 'Task 2: Change Extension', '`Path("a.txt").with_suffix(".bak")` ni `.as_posix()` qilib chiqaring.', 'Swap extension to .bak.', `from pathlib import Path\nprint(Path("a.txt").with_suffix(".bak").as_posix())`, 'a.bak', 'with_suffix(".bak")', 'Print as_posix().'),
      pt('p0609_3', '3-mashq: Rekursiv `.mkdir()`', 'Task 3: Nested mkdir', 'Temp papkada `a/b/c` yaratib `.is_dir()` ni chiqaring.', 'Create nested a/b/c safely.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as t:\n    d = Path(t) / "a" / "b" / "c"\n    d.mkdir(parents=True, exist_ok=True)\n    print(d.is_dir())`, 'True', 'parents=True, exist_ok=True', 'Verify is_dir().'),
      pt('p0609_4', '4-mashq: `.rglob()`', 'Task 4: Recursive Glob', 'Temp papkada 2 ta `.json` fayl yaratib `.rglob("*.json")` sonini chiqaring.', 'Count nested .json files via rglob.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as t:\n    r = Path(t)\n    (r / "sub").mkdir()\n    (r / "1.json").write_text("{}", encoding="utf-8")\n    (r / "sub" / "2.json").write_text("{}", encoding="utf-8")\n    print(len(list(r.rglob("*.json"))))`, '2', 'list(r.rglob("*.json"))', 'Count matches.'),
      pt('p0609_5', '5-mashq: `Path` va `/`', 'Task 5: Slash Join', '`(Path("api") / "v1" / "users").as_posix()` ni chiqaring.', 'Join 3 segments with /.', `from pathlib import Path\nprint((Path("api") / "v1" / "users").as_posix())`, 'api/v1/users', 'Path("api") / "v1" / "users"', 'Use / operator.'),
    ],
    quiz: [
      q('q0609_1', '`Path("dir/file.tar.gz").suffix` nimani qaytaradi?', 'What does `Path("dir/file.tar.gz").suffix` return?', ['.tar.gz', '.gz', 'file', 'tar'], ['.tar.gz', '.gz', 'file', 'tar'], 1, 'Oxirgi kengaytma `".gz"` (hammasi uchun `.suffixes`).', 'Final suffix `".gz"` (`.suffixes` for all).'),
      q('q0609_2', 'Barcha oraliq papkalarni ham yaratib, mavjud bo‘lsa xato bermaydigan chaqiruv?', 'Arguments to create missing parents without error if existing?', ['force=True', 'parents=True, exist_ok=True', 'recursive=True', 'safe=True'], ['force=True', 'parents=True, exist_ok=True', 'recursive=True', 'safe=True'], 1, '`parents=True, exist_ok=True`.', '`parents=True, exist_ok=True`.'),
      q('q0609_3', 'Ichki papkalarni ham aylanib fayl qidiruvchi `Path` metodi?', 'Method searching subdirectories recursively?', ['.glob()', '.rglob()', '.find()', '.walk_all()'], ['.glob()', '.rglob()', '.find()', '.walk_all()'], 1, '`.rglob()`.', '`.rglob()`.'),
      q('q0609_4', '`Path("a.txt").stem` qiymati nima?', 'Value of `Path("a.txt").stem`?', ['.txt', 'a.txt', 'a', 'None'], ['.txt', 'a.txt', 'a', 'None'], 2, '`"a"` (kengaytmasiz fayl nomi).', '`"a"`.'),
      q('q0609_5', '`pathlib.Path` da segmentlarni ulash operatori?', 'Operator joining `Path` segments?', ['+', '&', '/', '->'], ['+', '&', '/', '->'], 2, '`/` operatori.', '`/` operator.'),
    ],
    homework: hw('Loyiha Fayllari Inventarizatori (`pathlib` + JSON)', 'Project Asset Scanner', 'Temp papkada ichma-ich papkalar va `.py`/`.txt`/`.json` fayllar daraxtini yarating, so‘ng `.rglob("*")` bilan kengaytmalar bo‘yicha statistikani hisoblab `inventory.json` ga saqlang.', 'Build a nested temp workspace, scan all files via `.rglob("*")`, count files by extension, and export `inventory.json`.', ['pathlib.Path + rglob', 'json.dump + ensure_ascii=False'], ['Use Path.rglob', 'Export JSON inventory'], 'if p.is_file(): counts[p.suffix or "<none>"] += 1', 'Skip directories when counting.', 'Eng katta hajmli (`p.stat().st_size`) faylni ham hisobotga qo‘shing.', 'Report largest file via `.stat().st_size`.', 25),
    reviewCheckpoint: review(
      13,
      'Review Loyiha #13: CSV -> JSON Konvertori (`pathlib` + `csv` + `json`)',
      'Review Project #13: CSV-to-JSON Pipeline',
      '65-dars marrasi! `pathlib`, `csv.DictReader` va `json.dump` ni birlashtirib, jadval ma’lumotlarini tekshirib JSON arxivga aylantiruvchi konveyer quring.',
      '65-lesson milestone! Combine `pathlib`, `csv.DictReader`, and `json.dump` into an end-to-end data format converter.',
      ['Temp papkada `users.csv` yaratish', '`DictReader` bilan o‘qib raqamlarni `int` ga o‘girish', '`path.with_suffix(".json")` fayliga `indent=2, ensure_ascii=False` bilan yozish'],
      ['Create `users.csv` via `Path`', 'Parse and cast numeric fields with `DictReader`', 'Export cleanly to `.with_suffix(".json")`'],
      `import csv, json, tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    csv_path = Path(tmp) / "users.csv"
    csv_path.write_text("name,score\\nAziz,95\\nO‘tkir,89\\n", encoding="utf-8")
    with open(csv_path, "r", newline="", encoding="utf-8") as f:
        records = [{"name": r["name"], "score": int(r["score"])} for r in csv.DictReader(f)]
    json_path = csv_path.with_suffix(".json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    print("Converted:", json_path.name)
    print(json_path.read_text(encoding="utf-8"))`,
    ),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-06-10',
    courseId: 'files_io',
    moduleId: 'c06_m4',
    order: 10,
    titleUz: 'Fayllar va papkalarni boshqarish — xavfsizlik, Atomic Write va Temp fayllar',
    titleEn: 'Managing Files & Folders: Safe Renames, Atomic Writes & Path Security',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-06-09'],
    conceptId: 'file_folder_management',
    whyUz: "Agar faylga yozayotganingizda elektr o‘chsa yoki disk to‘lsa, yarim yozilgan fayl buzilib qoladi! Bundan tashqari foydalanuvchidan `../../etc/passwd` kabi nom kelsa (**Path Traversal** hujumi) serveringiz xavf ostida qoladi.",
    whyEn: 'Production file management requires atomic write-and-replace patterns (avoiding half-written corrupt files), safe deletion (`unlink(missing_ok=True)`), and path-traversal guards.',
    analogyUz: "**Atomic Write** — bu muhim hujjatning eski nusxasini o‘chirmay turib, avval qoralamada (`config.json.tmp`) to‘liq yozib bitirish, keyin esa bitta tez harakatda (`.replace()`) asl o‘rniga almashtirishdir!",
    analogyEn: 'Atomic writes draft the new document as `.tmp` first, then swap it onto the target in one indivisible `.replace()` step.',
    stopsUz: "Foydalanuvchi kiritgan fayl nomini `base_dir / user_input` ga ulagandan keyin **`.resolve()`** qilib, uning haqiqatan `base_dir` ichida ekanini (`.is_relative_to(base_dir)`) tekshirmasangiz **Path Traversal** zaifligi yuzaga keladi!",
    stopsEn: 'Always resolve untrusted user filenames (`target = (base / name).resolve()`) and verify `target.is_relative_to(base.resolve())` before touching disk!',
    objUz: ['`Path.rename()`, `Path.replace()`, `Path.unlink(missing_ok=True)` bilan fayllarni boshqarish', 'Yarim yozilgan fayl buzilishini oldini oluvchi **Atomic Write** naqshini yozish', '`.resolve()` + `.is_relative_to()` bilan Path Traversal (`../`) hujumidan himoyalanish'],
    objEn: ['Move, replace, and safely remove files using `pathlib.Path`', 'Prevent partial corruption with the temp-write + `.replace()` atomic pattern', 'Block path-traversal attacks using `.resolve()` and `.is_relative_to()`'],
    theoryUz: `### 1. Fayl Ko‘chirish va O‘chirish (\`pathlib\`)
- \`src.rename(dst)\` / \`src.replace(dst)\` — atomik almashtirish.
- \`p.unlink(missing_ok=True)\` — fayl yo‘q bo‘lsa ham \`FileNotFoundError\` bermay xavfsiz o‘chiradi!
### 2. Atomic Write Naqshi
To‘g‘ridan-to‘g‘ri \`open("db.json", "w")\` da jarayon uzilsa fayl buziladi. To‘g‘ri yo‘l:
1. \`tmp = target.with_suffix(".tmp")\` ga to‘liq yozing
2. \`tmp.replace(target)\` bilan atomik almashtiring!
### 3. Path Traversal (\`../../\`) Himoyasi
\`safe_join(root, user_name)\`:
\`\`\`python
resolved = (root / user_name).resolve()
if not resolved.is_relative_to(root.resolve()):
    raise ValueError("Unsafe path!")
\`\`\`
### 4. \`tempfile\` Moduli
Vaqtinchalik fayl va papkalar avtomatik tozalanishi uchun \`with tempfile.TemporaryDirectory() as tmp:\`.
### 5. Keng tarqalgan xato
\`p.unlink()\` ni \`missing_ok=True\` siz chaqirish yoki user nomini \`.resolve()\` siz ochish.`,
    theoryEn: `### 1. Safe Lifecycle Methods
\`.replace(dst)\` overwrites atomically; \`.unlink(missing_ok=True)\` deletes safely.
### 2. Atomic Write Pattern
Write to \`target.with_suffix(".tmp")\` completely before calling \`.replace(target)\`.
### 3. Blocking Path Traversal
Resolve both \`base\` and \`target\`, then assert \`target.is_relative_to(base)\`.
### 4. Ephemeral Workspaces
Use \`tempfile.TemporaryDirectory()\` so test/scratch files auto-clean.
### 5. Pitfall
Validating raw strings instead of resolved canonical paths leaves \`../\` bypasses open.`,
    examples: [
      ex('Misol 1: Atomic Write (`.tmp` -> `.replace()`)', 'Example 1: Atomic Write Pattern', `import json, tempfile\nfrom pathlib import Path\n\ndef atomic_save_json(target: Path, data: dict) -> None:\n    tmp_file = target.with_suffix(".tmp")\n    tmp_file.write_text(json.dumps(data, indent=2), encoding="utf-8")\n    tmp_file.replace(target)\n\nwith tempfile.TemporaryDirectory() as d:\n    cfg = Path(d) / "state.json"\n    atomic_save_json(cfg, {"version": 2, "status": "ok"})\n    print(cfg.read_text(encoding="utf-8").strip())`, `{\n  "version": 2,\n  "status": "ok"\n}`, 'Ma’lumot avval `.tmp` ga yozilib keyin bitta `.replace()` bilan almashtirildi.', 'Temp write + `.replace()` protects against torn/partial files.'),
      ex('Misol 2: Path Traversal (`../`) himoyasi', 'Example 2: Guarding Against Path Traversal', `import tempfile\nfrom pathlib import Path\n\ndef safe_path(base: Path, user_name: str) -> Path:\n    root = base.resolve()\n    target = (root / user_name).resolve()\n    if not target.is_relative_to(root):\n        raise ValueError("Blocked path traversal!")\n    return target\n\nwith tempfile.TemporaryDirectory() as d:\n    base = Path(d)\n    print("Safe:", safe_path(base, "notes.txt").name)\n    try:\n        safe_path(base, "../../secret.txt")\n    except ValueError as err:\n        print("Alert:", err)`, `Safe: notes.txt\nAlert: Blocked path traversal!`, '`.resolve()` va `.is_relative_to()` yordamida tashqariga chiqish urinishi bloklandi.', 'Resolved path containment check blocked directory escape.'),
      ex('Misol 3: `unlink(missing_ok=True)` va tartibli tozalash', 'Example 3: Safe Cleanup with unlink', `import tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as d:\n    p = Path(d) / "cache.txt"\n    p.write_text("temp", encoding="utf-8")\n    p.unlink(missing_ok=True)\n    p.unlink(missing_ok=True)  # 2-marta ham xato bermaydi!\n    print("Exists after unlink:", p.exists())`, `Exists after unlink: False`, '`missing_ok=True` fayl allaqachon o‘chirilgan bo‘lsa ham dasturni yiqitmaydi.', '`missing_ok=True` makes deletion cleanly idempotent.'),
    ],
    traceTitleUz: 'Atomic replace izi',
    traceTitleEn: 'Tracing Atomic Write',
    traceCode: `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    t = Path(d) / "a.txt"\n    tmp = Path(d) / "a.tmp"\n    tmp.write_text("v2", encoding="utf-8")\n    tmp.replace(t)\n    print(t.read_text(encoding="utf-8"), tmp.exists())`,
    traceSteps: [
      traceStep(1, 'tmp.write_text("v2")', 'a.tmp="v2"', 'Yangi versiya vaqtinchalik faylga yozildi', 'Wrote staging file'),
      traceStep(2, 'tmp.replace(t)', 'a.txt="v2"', 'Atomik almashtirish bajarildi', 'Replaced target atomically'),
      traceStep(3, 'print(...)', 'v2 False', 'a.tmp yo‘qoldi, a.txt yangilandi', 'Target updated cleanly', 'v2 False'),
    ],
    commonMistakes: [
      mistake('Foydalanuvchi fayl nomini tekshirmasdan `base / name` qilish', 'Unchecked Path Traversal Vulnerability', `from pathlib import Path\np = Path("/srv/uploads") / "../config.py"\nprint(p.resolve().as_posix())`, 'Escapes /srv/uploads into /srv/config.py!', `from pathlib import Path\nbase = Path("uploads").resolve()\ntarget = (base / "../secret.py").resolve()\nprint("Allowed?", target.is_relative_to(base))`, 'Nisbiy `../` yuqori papkaga chiqib ketadi.', 'Relative `..` segments escape the sandbox folder.', 'Doim `.resolve()` dan keyin `.is_relative_to(base)` tekshiring.', 'Always check `.is_relative_to(base.resolve())`.'),
      mistake('`p.unlink()` da fayl bor-yo‘qligini tekshirmaslik', 'Uncaught FileNotFoundError on unlink()', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    (Path(d) / "none.txt").unlink()`, 'FileNotFoundError', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    (Path(d) / "none.txt").unlink(missing_ok=True)\n    print("Cleaned safely")`, 'Fayl yo‘q bo‘lsa `unlink()` xato otadi.', '`unlink()` raises if file is absent by default.', '`missing_ok=True` parametrini bering.', 'Pass `missing_ok=True`.'),
    ],
    compareTitleUz: 'To‘g‘ridan-to‘g‘ri yozish vs Atomic Write',
    compareTitleEn: 'Direct Overwrite vs Atomic Write',
    compareUz: ['To‘g‘ridan-to‘g‘ri `open(..., "w")`: yozish o‘rtasida uzilish bo‘lsa fayl yarim va buzuq qoladi.', 'Atomic Write (`.tmp` + `.replace()`): eski yoki to‘liq yangi fayl kafolatlanadi.'],
    compareEn: ['Direct overwrite: risk of half-written corrupted files on crash.', 'Atomic `.tmp` + `.replace()`: all-or-nothing durability.'],
    compareSummaryUz: 'Muhim JSON/sozlama fayllarini har doim `.tmp` + `.replace()` bilan atomik saqlang.',
    compareSummaryEn: 'Use `.tmp` + `.replace()` for critical configs and state files.',
    practiceTasks: [
      pt('p0610_1', '1-mashq: Atomik almashtirish', 'Task 1: Replace File', 'Temp papkada `old.txt` ni `.tmp` fayl bilan `.replace()` qiling.', 'Replace target atomically.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    dst = Path(d) / "a.txt"\n    src = Path(d) / "a.tmp"\n    dst.write_text("v1", encoding="utf-8")\n    src.write_text("v2", encoding="utf-8")\n    src.replace(dst)\n    print(dst.read_text(encoding="utf-8"))`, 'v2', 'src.replace(dst)', 'Print target text.'),
      pt('p0610_2', '2-mashq: `unlink(missing_ok=True)`', 'Task 2: Safe Unlink', 'Mavjud bo‘lmagan faylga `.unlink(missing_ok=True)` chaqirib `"ok"` chiqaring.', 'Call unlink safely.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    (Path(d) / "x.txt").unlink(missing_ok=True)\n    print("ok")`, 'ok', 'missing_ok=True', 'Prints ok.'),
      pt('p0610_3', '3-mashq: Traversal tekshiruvi', 'Task 3: is_relative_to', '`Path("box").resolve()` ga `../hack` xavfli ekanini tekshiring.', 'Check traversal returns False.', `from pathlib import Path\nroot = Path("box").resolve()\ntarget = (root / "../hack").resolve()\nprint(target.is_relative_to(root))`, 'False', 'target.is_relative_to(root)', 'Prints False.'),
      pt('p0610_4', '4-mashq: Fayl nomini o‘zgartirish', 'Task 4: Rename File', 'Temp papkada `a.txt` ni `b.txt` ga `.rename()` qilib `.exists()` chiqaring.', 'Rename a.txt to b.txt.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    a = Path(d) / "a.txt"\n    b = Path(d) / "b.txt"\n    a.write_text("hi", encoding="utf-8")\n    a.rename(b)\n    print(a.exists(), b.exists())`, 'False True', 'a.rename(b)', 'Print existence.'),
      pt('p0610_5', '5-mashq: Temp papka auto-clean', 'Task 5: TemporaryDirectory', '`with tempfile.TemporaryDirectory() as t:` dan chiqqach `Path(t).exists()` chiqaring.', 'Verify auto cleanup.', `import tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as t:\n    saved = Path(t)\nprint(saved.exists())`, 'False', 'Check after with block.', 'Prints False.'),
    ],
    quiz: [
      q('q0610_1', 'Faylni xavfsiz atomik saqlash ketma-ketligi?', 'Correct atomic write sequence?', ['To‘g‘ridan-to‘g‘ri open("w")', 'Avval .tmp ga yozib, keyin .replace(target)', 'Avval o‘chirib keyin yozish', 'append qilish'], ['Direct open("w")', 'Write .tmp then .replace(target)', 'Delete first', 'Append'], 1, 'Temp faylga yozib `.replace()` qilish.', 'Stage in `.tmp` then `.replace()`.'),
      q('q0610_2', 'Path Traversal (`../../`) hujumini to‘sishning to‘g‘ri usuli?', 'Reliable way to prevent Path Traversal?', ['".." ni str dan izlash', '.resolve() qilib .is_relative_to(base) tekshirish', 'Faqat suffix tekshirish', 'try/except'], ['Check substring ".."', 'Resolve and verify .is_relative_to(base)', 'Suffix only', 'try/except'], 1, 'Kanonik `.resolve()` + `.is_relative_to()`.', 'Canonical `.resolve()` + `.is_relative_to()`.'),
      q('q0610_3', '`p.unlink(missing_ok=True)` nima qiladi?', 'Behavior of `p.unlink(missing_ok=True)`?', ['Papkani o‘chiradi', 'Fayl yo‘q bo‘lsa ham xato bermay o‘chiradi', 'Faylni yashiradi', 'Nusxa oladi'], ['Deletes directory', 'Deletes file without error if missing', 'Hides file', 'Copies file'], 1, 'Yo‘q faylda `FileNotFoundError` otmaydi.', 'Idempotent delete.'),
      q('q0610_4', '`with tempfile.TemporaryDirectory() as d:` tugagach nima bo‘ladi?', 'What happens when `TemporaryDirectory()` context exits?', ['Diskda qoladi', 'Papka va ichidagi hamma fayl avtomatik o‘chiriladi', 'Faqat bo‘sh bo‘lsa o‘chadi', 'Rename bo‘ladi'], ['Persists', 'Auto-deletes dir and contents', 'Only if empty', 'Renames'], 1, 'Avtomatik tozalanadi.', 'Automatically deleted.'),
      q('q0610_5', 'Fayl hajmini baytlarda olish uchun `Path` da qaysi chaqiruv ishlatiladi?', 'How to get file size in bytes on `Path`?', ['p.size()', 'p.stat().st_size', 'len(p)', 'p.bytes()'], ['p.size()', 'p.stat().st_size', 'len(p)', 'p.bytes()'], 1, '`p.stat().st_size`.', '`p.stat().st_size`.'),
    ],
    homework: hw('6-Kurs Yakuniy Xavfsiz Fayl Ombori', 'Course 6 Safe File Vault', 'Temp papkada kichik `FileVault` funksiyalarini tuzing: `safe_write(root, rel_name, text)` Path Traversal ni bloklasin va faylni `.tmp` + `.replace()` bilan atomik saqlasin, `cleanup(root, rel_name)` esa `unlink(missing_ok=True)` bilan o‘chirsin.', 'Implement `safe_write(root, rel_name, text)` (traversal guard + atomic write) and `cleanup(root, rel_name)` using `pathlib` inside a temp directory.', ['Traversal testi ("../evil.txt")', 'Atomic write testi', 'Idempotent cleanup testi'], ['Block traversal', 'Use atomic .tmp + .replace', 'Idempotent unlink'], 'if not target.is_relative_to(root.resolve()): raise ValueError("Unsafe")', 'Guard before writing.', 'Barcha fayllar ro‘yxati va hajmini JSON hisobotga yozing.', 'Export summary JSON.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),
];
