import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C16_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-16-01',
    courseId: 'data_science',
    moduleId: 'c16_m1',
    order: 1,
    titleUz: 'Data Science Nima? — Data Lifecycle, Savol Qo‘yish va Reproducibility',
    titleEn: 'What Is Data Science? Lifecycle, Framing Questions & Reproducibility',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-15-10'],
    conceptId: 'ds_intro',
    whyUz: "Data Science — bu shunchaki grafik chizish yoki ML model chaqirish emas! U **to‘g‘ri biznes savolini qo‘yish -> xom ma’lumotni yig‘ish va tozalash -> tahlil (EDA) -> aniq qaror chiqarish** siklidir. Xom ma’lumotning 80% qismi shovqinli bo‘ladi; shuning uchun metodologiya va **Reproducibility** (qayta takrorlanuvchanlik) hamma narsadan ustun!",
    whyEn: 'Understand the end-to-end Data Science lifecycle (CRISP-DM: Question -> Ingest -> Clean -> Analyze -> Communicate), reproducibility with fixed seeds & raw-data immutability, and avoiding survivorship bias.',
    analogyUz: "**Data Science** — bu detektivlik: xom dalillar (CSV/SQL loglar) kir, chalkash va chala bo‘ladi. Detektiv avval dalilni buzmasdan nusxasini oladi (Raw Data Immutability), so‘ng soxtalarini tozalab haqiqiy sababni topadi!",
    analogyEn: 'Data science is detective work: never alter the original raw evidence, clean a reproducible pipeline copy, test hypotheses against controls, and state uncertainty honestly.',
    stopsUz: "Data Science da 3 oltin qoida: 1) **Xom ma’lumot (`data/raw/`) ni HECH QACHON qo‘lda Excel da tahrirlamang** — barcha tozalash Python skriptida (`data/processed/`) takrorlanuvchi bo‘lsin! 2) **Survivorship Bias** dan saqlaning: faqat saqlanib qolgan/mijoz bo‘lganlarni ko‘rib, ketib qolganlarni unutish xato xulosa beradi! 3) Har bir tasodifiy sample uchun **`seed` ni qatʼiy belgilang**!",
    stopsEn: 'Never edit `data/raw/` files manually—keep all transformations scripted and reproducible with fixed random seeds, and watch out for survivorship and selection biases.',
    objUz: ['CRISP-DM / Data Lifecycle 5 bosqichi (Frame -> Collect -> Clean -> Analyze -> Act)', 'Raw Data Immutability va Deterministic Reproducibility (`random.seed`)', 'Data Science vs Data Analytics vs Data Engineering rollari va Survivorship Bias'],
    objEn: ['Trace the 5-stage Data Science lifecycle from question to decision', 'Preserve immutable raw datasets and reproducible seeded pipelines', 'Distinguish Data Analyst, Data Scientist, and Data Engineer roles plus selection bias'],
    theoryUz: `### 1. Data Science Hayot Sikli
1. **Business Question**: "Nega 7-kundan keyin foydalanuvchilar tizimdan chiqib ketmoqda?"
2. **Collect**: SQL, CSV, API loglar.
3. **Clean**: \`NaN\`, dublikat va xato turlarni tuzatish.
4. **Explore & Model (EDA)**: statistika, grafik, bashorat.
5. **Communicate**: aniq KPI va harakat rejasi!
### 2. Reproducibility (Takrorlanuvchanlik)
\`raw\` papka faqat o‘qish uchun (read-only); \`random.seed(42)\` natijani har safar bir xil qiladi.
### 3. Survivorship Bias
Urush samolyotlarining qaytib kelganlaridagi o‘q izlariga qarab zirh qo‘yish xato — chunki urib tushirilgan samolyotlar qaytmagan!`,
    theoryEn: `### 1. The Data Lifecycle
Frame measurable questions -> Collect raw data -> Clean reproducibly -> Analyze/Model -> Communicate actionable insights.
### 2. Reproducibility
Treat \`data/raw/\` as read-only and fix random seeds so colleagues reproduce identical metrics.
### 3. Cognitive & Data Biases
Watch for survivorship bias (measuring only survivors) and missing denominators.`,
    examples: [
      ex('Misol 1: Reproducible Pipeline & SHA-256 Raw Data Tekshiruvi', 'Example 1: Seeded Sampling & Raw Integrity Check', `import hashlib, random

raw_csv = "id,score\\n1,85\\n2,90\\n3,78\\n4,95"
raw_hash = hashlib.sha256(raw_csv.encode()).hexdigest()[:12]
rng = random.Random(42)
rows = [line.split(",") for line in raw_csv.splitlines()[1:]]
sample = rng.sample(rows, 2)
print("Raw fingerprint:", raw_hash, "| Deterministic sample:", sample)`, `Raw fingerprint: 3fbdce520839 | Deterministic sample: [['1', '85'], ['4', '95']]`, 'SHA-256 xom ma’lumot o‘zgarmaganini kafolatlaydi, `Random(42)` esa bir xil sample beradi.', 'Fingerprinting raw inputs and seeding RNGs guarantees exact experiment reproducibility.'),
      ex('Misol 2: Survivorship Bias Tuzog‘ini Sonlarda Ko‘rish', 'Example 2: Exposing Survivorship Bias', `started = 1000
finished_course = [{"score": 95}, {"score": 90}]  # Only survivors!
true_completion_rate = len(finished_course) / started
print(f"Survivor avg looks great: 92.5%, but true completion rate = {true_completion_rate:.1%}")`, `Survivor avg looks great: 92.5%, but true completion rate = 0.2%`, 'Faqat yakunlaganlarga qarasangiz 92.5% a’lo ko‘rinadi, aslida esa 1000 tadan 998 kishi tashlab ketgan!', 'Evaluating only surviving records hides massive funnel drop-off.'),
      ex('Misol 3: Descriptive vs Diagnostic vs Predictive Savollar', 'Example 3: Framing Analytical Questions', `questions = {
    "descriptive": "O'tgan oyda nechta mijoz ro'yxatdan o'tdi?",
    "diagnostic": "Nega 3-kunda chiqib ketish oshdi?",
    "predictive": "Kelasi oy necha foiz mijoz obunani yangilaydi?",
}
print(list(questions.keys()))`, `['descriptive', 'diagnostic', 'predictive']`, 'Har bir tahlil turi aniq o‘lchanadigan biznes savolidan boshlanadi.', 'Strong analysis matches question framing to descriptive, diagnostic, or predictive goals.'),
    ],
    traceTitleUz: 'Reproducible Pipeline Trace',
    traceTitleEn: 'Tracing Reproducible Data Pipeline',
    traceCode: `raw -> hash_check -> seeded_sample(42) -> metrics`,
    traceSteps: [
      traceStep(1, 'data/raw/ check', 'sha256 verified', 'Xom ma’lumot o‘zgarmagan', 'Verified immutable raw input'),
      traceStep(2, 'random.Random(42)', 'fixed state', 'Qayta yuritganda bir xil natija', 'Deterministic RNG'),
    ],
    commonMistakes: [
      mistake('Xom CSV faylini Excel da qo‘lda ochib qator o‘chirish', 'Manually Editing Raw Data Files in Excel', `# Hand-editing raw.csv destroys auditability and corrupts dates like '10-05' into 'Oct 5'!`, 'Irreproducible results & silent date corruption', `print("Keep raw/ read-only and perform every clean step in Python scripts!")`, 'Qo‘lda tahrirlashni keyingi oy qayta takrorlab bo‘lmaydi; barcha tozalash kodda bo‘lsin.', 'Manual spreadsheet edits cannot be audited or reproduced; script all cleaning in Python.', 'Xom faylga tegmang.', 'Keep raw data immutable.'),
      mistake('Faqat qolgan foydalanuvchilar bilan o‘rtacha hisoblab Survivorship Bias ga tushish', 'Measuring Only Survivors Without Total Denominator', `# Averaging test scores of graduates ignores the 80% who dropped out early!`, 'Misleadingly rosy KPIs', `print("Always track the full cohort denominator from day 0!")`, 'Boshlang‘ich jami son (`denominator`) ni doim hisobga oling.', 'Track the full starting denominator rather than analyzing survivors alone.', 'To‘liq cohort ni o‘lchang.', 'Include full cohort denominator.'),
    ],
    compareTitleUz: 'Data Analyst vs Data Scientist vs Data Engineer',
    compareTitleEn: 'Data Roles Compared',
    compareUz: ['Data Engineer: ETL quvurlari, omborlar (SQL/Airflow/Spark) — toza ma’lumot yetkazadi.', 'Data Analyst: SQL/Pandas/BI dashboardlar — biznesga hisobot va tushuncha beradi.', 'Data Scientist: statistika, eksperimentlar (A/B) va ML bashorat modellari quradi.'],
    compareEn: ['Data Engineer: builds reliable ETL ingestion & warehouses.', 'Data Analyst: transforms metrics into dashboards and insights.', 'Data Scientist: designs statistical tests and predictive ML models.'],
    compareSummaryUz: 'Har doim o‘lchanadigan savoldan boshlang, xom ma’lumotni o‘zgarmas saqlang, `seed` bering va Survivorship Bias dan ehtiyot bo‘ling.',
    compareSummaryEn: 'Start from measurable questions, keep raw data immutable, seed randomness, and guard against survivorship bias.',
    practiceTasks: [
      pt('p1601_1', '1-mashq: Deterministic Sample', 'Task 1: Seeded Sampling', '`random.Random(7).sample([10, 20, 30, 40], 2)` natijasini chiqaring.', 'Sample reproducibly.', `import random\nprint(random.Random(7).sample([10, 20, 30, 40], 2))`, '[30, 10]', 'Use random.Random(7)', 'Prints [30, 10].'),
      pt('p1601_2', '2-mashq: Conversion Denominator', 'Task 2: Full Cohort Rate', '200 kirgandan 50 tasi xarid qilganda konversiya % ni hisoblang.', 'Compute conversion rate.', `print(f"{50 / 200:.1%}")`, '25.0%', 'Divide by full denominator', 'Prints 25.0%.'),
      pt('p1601_3', '3-mashq: Raw Data Checksum', 'Task 3: SHA-256 Checksum', '`"id,val\\n1,9"` xeshining birinchi 8 ta belgisini oling.', 'Hash raw string.', `import hashlib\nprint(hashlib.sha256(b"id,val\\n1,9").hexdigest()[:8])`, '5a27ea35', 'sha256(...).hexdigest()[:8]', 'Prints 8-char hash.'),
      pt('p1601_4', '4-mashq: Savol Turini Tasniflash', 'Task 4: Classify Question', '`"Nega sotuv tushdi?"` -> `"diagnostic"` qaytaring.', 'Classify question.', `def kind(q): return "diagnostic" if "Nega" in q else "descriptive"\nprint(kind("Nega sotuv tushdi?"))`, 'diagnostic', 'Check keyword', 'Prints diagnostic.'),
      pt('p1601_5', '5-mashq: Immutable Raw Path', 'Task 5: Raw vs Processed Path', '`Path("data/raw/a.csv")` dan `data/processed/a_clean.csv` yasang.', 'Build processed path.', `from pathlib import Path\np = Path("data/raw/a.csv")\nprint((p.parent.parent / "processed" / f"{p.stem}_clean{p.suffix}").as_posix())`, 'data/processed/a_clean.csv', 'Derive processed path without overwriting raw', 'Prints processed path.'),
    ],
    quiz: [
      q('q1601_1', 'Nima uchun `data/raw/` papkasidagi fayllarni hech qachon qo‘lda tahrirlamaslik kerak?', 'Why treat `data/raw/` files as strictly immutable?', ['Disk tejash', 'Har qanday tozalash Python skriptida qayta takrorlanishi va audit qilinishi uchun', 'JSON talabi', 'Excel sekin'], ['Save disk', 'Ensures every transformation is scripted, auditable, and reproducible', 'JSON', 'Excel slow'], 1, 'Takrorlanuvchanlik (Reproducibility) va audit.', 'Auditability & reproducibility.'),
      q('q1601_2', 'Faqat bitirgan talabalarning o‘rtacha bahosini olib, kursni tashlab ketgan 80% ni unutish qanday xato?', 'Bias from analyzing only survivors while ignoring dropouts?', ['Overfitting', 'Survivorship Bias (Selection Bias)', 'Data Leakage', 'Multicollinearity'], ['Overfitting', 'Survivorship Bias (Selection Bias)', 'Data Leakage', 'Multicollinearity'], 1, 'Survivorship Bias.', 'Survivorship Bias.'),
      q('q1601_3', 'Eksperiment va tasodifiy tanlash har safar bir xil natija berishi uchun nima belgilanadi?', 'What makes stochastic sampling reproducible across runs?', ['Timeout', 'Random Seed (`seed=42`)', 'Cache header', 'ENV=prod'], ['Timeout', 'Random Seed (`seed=42`)', 'Cache', 'ENV'], 1, 'Random Seed.', 'Random Seed.'),
      q('q1601_4', 'ETL quvurlari va ma’lumot omborlarini qurishga ixtisoslashgan mutaxassis?', 'Role focused on building reliable data ingestion pipelines and warehouses?', ['UI Designer', 'Data Engineer', 'QA', 'DevRel'], ['UI Designer', 'Data Engineer', 'QA', 'DevRel'], 1, 'Data Engineer.', 'Data Engineer.'),
      q('q1601_5', 'CRISP-DM jarayonining eng birinchi bosqichi?', 'First step of the Data Science lifecycle?', ['Deep Learning', 'Biznes muammo va o‘lchanadigan savolni aniqlash', 'Matplotlib chizish', 'Deploy'], ['Deep Learning', 'Framing the business problem & measurable question', 'Plotting', 'Deploy'], 1, 'Savol va maqsadni aniqlash.', 'Framing the business question.'),
    ],
    homework: hw('Reproducible Experiment & Cohort Tracker', 'Reproducible Data Pipeline Charter', 'Xom CSV satridan SHA-256 nazorat xeshini hisoblovchi, `data/raw/` ga tegmasdan tozalangan nusxa yaratuvchi, fixed `seed=42` bilan sample oluvchi va to‘liq cohort konversiyasini hisoblovchi pipeline tuzing.', 'Write a reproducible pipeline script computing a SHA-256 fingerprint of raw CSV input, seeding a deterministic sample, and reporting full-cohort retention without survivorship bias.', ['Raw fingerprint + seeded sample', 'Full-cohort denominator check'], ['Fingerprint + seed', 'Full cohort rate'], 'Never mutate the raw input variable; emit a cleaned derived structure.', 'Clean scientific workflow.', 'Natijalarni JSON metadata bilan saqlang.', 'Save run metadata JSON.', 20),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-16-02',
    courseId: 'data_science',
    moduleId: 'c16_m1',
    order: 2,
    titleUz: 'NumPy — N-O‘lchamli Massivlar, Vektorizatsiya, Broadcasting va Views',
    titleEn: 'NumPy Foundations: ndarrays, Vectorization, Broadcasting & Views vs Copies',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-16-01'],
    conceptId: 'ds_numpy',
    whyUz: "Oddiy Python `list` da 1 million sonni ko‘paytirish `for` sikli va har bir obyekt uchun pointer tekshiruvi tufayli 50–100x sekin! **NumPy (`ndarray`)** sonlarni xotirada bir xil `dtype` (C-massiv) sifatida yonma-yon joylaydi va **Vectorization** + **Broadcasting** orqali SIMD CPU buyruqlarida bir zumda hisoblaydi.",
    whyEn: 'Understand why NumPy `ndarray` outperforms Python lists by 50–100x: contiguous homogeneous memory (`dtype`), element-wise vectorization (`a * 2 + b`), broadcasting rules, axis reductions (`axis=0` vs `axis=1`), and slicing views vs copies.',
    analogyUz: "**Python `list`** — har biri alohida konvertda turgan 1 millionta turli qog‘oz (har birini ochib \"bu sonmi?\" deb tekshirasiz). **NumPy `ndarray`** — bir xil o‘lchamdagi 1 millionta g‘isht yonma-yon taxlangan: traktor (CPU Vector Engine) hammasini bir surishda hisoblaydi!",
    analogyEn: 'A Python list stores scattered boxed pointers; a NumPy `ndarray` packs identical numbers side by side so CPU vector instructions operate across the entire block at once.',
    stopsUz: "NumPy da 3 muhim qoida (sandboxda tashqi `numpy` yo‘qligi uchun biz stdlib `array`/`math` + sof Python vektor simulyatorlari bilan NumPy qoidalarini mashq qilamiz!): 1) **`arr[1:4]` slice yangi nusxa emas, VIEW qaytaradi** — slice ni o‘zgartirsangiz asl massiv ham o‘zgaradi (mustaqil nusxa uchun `.copy()` ishlating)! 2) **`axis=0` (ustunlar bo‘ylab pastga) vs `axis=1` (qatorlar bo‘ylab o‘ngga)** ni adashtirmang! 3) Python `for` sikli o‘rniga vektor operatsiya (`a * b`) yozing!",
    stopsEn: 'Remember three NumPy fundamentals: slicing creates a shared-memory **view** (call `.copy()` when mutating safely), `axis=0` reduces down rows (per column) while `axis=1` reduces across columns (per row), and broadcasting matches trailing dimensions.',
    objUz: ['Python `list` vs NumPy `ndarray` (`dtype`, `shape`, contiguous RAM) farqi', 'Vectorization & Broadcasting qoidalari (`(3, 4) + (4,)` ishlaydi!)', '`axis=0` vs `axis=1` agregatsiyasi va Slice View vs `.copy()` xotira tuzog‘i'],
    objEn: ['Contrast Python `list` pointers with contiguous typed `ndarray` buffers', 'Apply NumPy vectorization and trailing-dimension broadcasting rules', 'Distinguish `axis=0` vs `axis=1` reductions and slicing views vs `.copy()`'],
    theoryUz: `### 1. Kontiguus Xotira (\`dtype\` + \`shape\`)
\`np.array([1, 2, 3], dtype=np.int32)\` — har element aniq 4 bayt, ortiqcha PyObject boshi yo‘q! Stdlib \`array.array('d', ...)\` ham shunday ixcham C-massivdir.
### 2. Broadcasting Qoidasi
Ikki massiv shakli o‘ngdan chapga solishtiriladi: o‘lchamlar teng bo‘lsa yoki biri \`1\` bo‘lsa — kengayadi! Masalan \`(3, 2) + (2,)\` -> \`(2,)\` har 3 qatorga qo‘shiladi!
### 3. \`axis=0\` vs \`axis=1\`
2D matritsada: \`axis=0\` — **ustunlar** yig‘indisi; \`axis=1\` — **qatorlar** yig‘indisi!
### 4. View vs Copy
NumPy da \`b = a[1:3]\` xotirani bo‘lishadi (\`view\`); \`b[0] = 99\` \`a\` ni ham o‘zgartiradi!`,
    theoryEn: `### 1. Homogeneous Contiguous Memory
Fixed \`dtype\` arrays eliminate per-element Python object headers and enable SIMD vectorization.
### 2. Broadcasting Rules
Compare shapes right-to-left: dimensions are compatible when equal or when one equals \`1\`.
### 3. Axis Semantics
In a 2D array \`(rows, cols)\`, \`axis=0\` collapses rows (one result per column), while \`axis=1\` collapses columns (one result per row).
### 4. Views vs Copies
Basic NumPy slices share the underlying buffer; invoke \`.copy()\` to avoid accidental aliasing.`,
    examples: [
      ex('Misol 1: Vektor Operatsiya va Broadcasting Simulyatsiyasi (`Matrix + Row Vector`)', 'Example 1: Matrix + Row Vector Broadcasting', `matrix = [[10, 20, 30], [40, 50, 60]]  # shape (2, 3)
bonus  = [1, 2, 3]                       # shape (3,) -> broadcasts across rows

broadcasted = [[val + b for val, b in zip(row, bonus)] for row in matrix]
print("Broadcasted (2,3) + (3,):", broadcasted)`, `Broadcasted (2,3) + (3,): [[11, 22, 33], [41, 52, 63]]`, '`bonus` (`(3,)`) avtomatik har bir qatorning 3 ustuniga qo‘shildi.', 'Demonstrates NumPy trailing-dimension `(2, 3) + (3,)` broadcasting.'),
      ex('Misol 2: 2D Matritsada `axis=0` (Ustun) vs `axis=1` (Qator) Yig‘indisi', 'Example 2: Axis=0 (Column) vs Axis=1 (Row) Reduction', `m = [[1, 2, 3], [4, 5, 6]]  # 2 rows x 3 cols
axis_0_col_sums = [sum(m[r][c] for r in range(len(m))) for c in range(len(m[0]))]
axis_1_row_sums = [sum(row) for row in m]
print("axis=0 (per column):", axis_0_col_sums)
print("axis=1 (per row):", axis_1_row_sums)`, `axis=0 (per column): [5, 7, 9]\naxis=1 (per row): [6, 15]`, '`axis=0` ustunlarni (`[5, 7, 9]`), `axis=1` esa qatorlarni (`[6, 15]`) jamlaydi.', '`axis=0` sums down columns; `axis=1` sums across each row.'),
      ex('Misol 3: Stdlib `array("d")` va Dot Product (Kosayin/ML Poydevori)', 'Example 3: Compact Typed `array` & Vector Dot Product', `from array import array

weights = array("d", [0.5, 1.5, -2.0])
features = array("d", [4.0, 2.0, 1.0])
dot = sum(w * x for w, x in zip(weights, features))
print("Typecode:", weights.typecode, "| Dot product:", dot)`, `Typecode: d | Dot product: 3.0`, 'Stdlib `array("d")` bir xil turdagi floatlarni ixcham C-xotirada saqlaydi; dot product ML ning asosiy amalidir.', '`array("d")` stores dense C doubles, and `dot(w, x)` underpins ML predictions.'),
    ],
    traceTitleUz: 'Broadcasting Shape Check (`(3, 4)` + `(4,)`)',
    traceTitleEn: 'Tracing NumPy Broadcasting Rules',
    traceCode: `can_broadcast((3, 4), (4,))`,
    traceSteps: [
      traceStep(1, 'Rightmost dim', '4 == 4 -> OK', 'Oxirgi o‘lchamlar teng', 'Trailing dims match'),
      traceStep(2, 'Next dim (pad 1)', '3 vs 1 -> broadcasts to 3', '1 o‘lchami 3 ga kengayadi', 'Broadcasts 1 across 3'),
    ],
    commonMistakes: [
      mistake('NumPy slice (`sub = arr[1:3]`) ni `.copy()` qilmay o‘zgartirish', 'Mutating a NumPy Slice View Accidentally', `# In NumPy, sub = arr[1:3]; sub[:] = 0 overwrites the original arr too because slices are views!`, 'Silent corruption of source array', `arr = [10, 20, 30, 40]\ncopy_slice = arr[1:3].copy()\ncopy_slice[0] = 99\nprint("Original safe:", arr, "| Copy:", copy_slice)`, 'Mustaqil o‘zgartirish uchun doim `.copy()` chaqiring.', 'NumPy basic slicing returns a shared-memory view—call `.copy()` before mutating.', '`.copy()` ishlating.', 'Call `.copy()`.'),
      mistake('`axis=0` va `axis=1` ni teskari qo‘llash', 'Swapping axis=0 and axis=1 in 2D Reductions', `# Calling mean(axis=1) when you wanted per-column averages averages across columns instead!`, 'Wrong matrix shape output', `print("axis=0 collapses rows -> 1 value per column; axis=1 collapses cols -> 1 value per row!")`, '`axis=0` = pastga (ustunlar), `axis=1` = o‘ngga (qatorlar).', '`axis=0` reduces vertically per column; `axis=1` reduces horizontally per row.', 'O‘q yo‘nalishini eslab qoling.', 'Check output shape after reducing.'),
    ],
    compareTitleUz: 'Python `list` vs NumPy `ndarray`',
    compareTitleEn: 'Python `list` vs NumPy `ndarray`',
    compareUz: ['Python `list`: har xil turlar (`[1, "a", True]`), o‘sishga qulay, lekin matematikada sekin.', 'NumPy `ndarray`: yagona `dtype`, Broadcasting, `axis` agregatsiyalari va 50–100x tez vektor matematika.'],
    compareEn: ['Python `list`: heterogeneous flexible containers; slow element loops.', 'NumPy `ndarray`: fixed `dtype`, SIMD vectorization, broadcasting, and matrix math.'],
    compareSummaryUz: 'NumPy da vectorized operatsiyalar yozing, o‘ngdan-chapga broadcasting va `axis=0/1` qoidasini biling hamda slice da `.copy()` ni unutmang.',
    compareSummaryEn: 'Favor vectorized math over Python loops, align shapes right-to-left for broadcasting, verify `axis=0/1`, and use `.copy()` when mutating slices.',
    practiceTasks: [
      pt('p1602_1', '1-mashq: Broadcasting Moslik Tekshiruvi', 'Task 1: Broadcasting Compatibility', '`(3, 4)` va `(4,)` mos kelishini, `(3, 4)` va `(3,)` mos kelmasligini tekshiring.', 'Check broadcast rules.', `def can_bc(a, b):\n    la, lb = len(a), len(b)\n    pa = (1,) * max(0, lb - la) + a; pb = (1,) * max(0, la - lb) + b\n    return all(x == y or x == 1 or y == 1 for x, y in zip(pa, pb))\nprint(can_bc((3, 4), (4,)), can_bc((3, 4), (3,)))`, 'True False', 'Align right-to-left padding with 1s', 'Prints True False.'),
      pt('p1602_2', '2-mashq: Element-Wise Vektor Qo‘shish', 'Task 2: Vectorized Add', '`[1, 2, 3]` va `[10, 20, 30]` ni elementma-element qo‘shing.', 'Add two vectors.', `print([x + y for x, y in zip([1, 2, 3], [10, 20, 30])])`, '[11, 22, 33]', 'zip two lists', 'Prints [11, 22, 33].'),
      pt('p1602_3', '3-mashq: `axis=0` Ustun O‘rtachalari', 'Task 3: Column Means (axis=0)', '`[[2, 4], [6, 8]]` matritsa ustunlari o‘rtachasini toping.', 'Compute column means.', `m = [[2, 4], [6, 8]]\nprint([sum(r[c] for r in m) / len(m) for c in range(len(m[0]))])`, '[4.0, 6.0]', 'Average down rows per column', 'Prints [4.0, 6.0].'),
      pt('p1602_4', '4-mashq: Boolean Masking (`arr[arr > 5]`)', 'Task 4: Boolean Mask Filter', '`[2, 8, 4, 10, 5]` dan `> 5` elementlarni ajrating.', 'Filter by boolean mask.', `arr = [2, 8, 4, 10, 5]\nprint([x for x in arr if x > 5])`, '[8, 10]', 'Filter values > 5', 'Prints [8, 10].'),
      pt('p1602_5', '5-mashq: Dot Product (Skalyar Ko‘paytma)', 'Task 5: Vector Dot Product', '`[1, 2, 3]` va `[4, 5, 6]` dot productini hisoblang.', 'Compute dot product.', `print(sum(a * b for a, b in zip([1, 2, 3], [4, 5, 6])))`, '32', 'sum(a*b)', 'Prints 32.'),
    ],
    quiz: [
      q('q1602_1', 'Nima uchun NumPy massivlari millionlab sonlarni hisoblashda Python `list` dan 50–100x tezroq?', 'Why are NumPy arrays 50-100x faster than Python lists for math?', ['Internetdan foydalanadi', 'Bir xil `dtype` li qo‘shni C-xotira (contiguous) va SIMD vektorizatsiyasi sababli', 'Kesh', 'GIL o‘chadi'], ['Internet', 'Contiguous homogeneous `dtype` memory enabling C/SIMD vectorization', 'Cache', 'No GIL'], 1, 'Kontiguus xotira va SIMD vektorizatsiya.', 'Contiguous homogeneous memory & SIMD.'),
      q('q1602_2', 'Shape `(4, 3)` matritsaga qaysi shakldagi vektor Broadcasting orqali qo‘shila oladi?', 'Which vector shape broadcasts cleanly onto a `(4, 3)` matrix?', ['(4,)', '(3,)', '(2,)', '(5,)'], ['(4,)', '(3,)', '(2,)', '(5,)'], 1, '`(3,)` (o‘ng o‘lcham 3 ga teng!).', '`(3,)` matches trailing dimension 3.'),
      q('q1602_3', '2D massivda `arr.sum(axis=0)` nimani hisoblaydi?', 'What does `arr.sum(axis=0)` compute on a 2D array?', ['Bitta umumiy summa', 'Har bir ustun (column) bo‘yicha yig‘indini', 'Har bir qator yig‘indisini', 'Diagonal'], ['Total scalar', 'Sum down rows (one value per column)', 'Sum per row', 'Diagonal'], 1, 'Har bir ustun yig‘indisini.', 'Per-column sums.'),
      q('q1602_4', 'NumPy da `b = a[1:4]` slice yaratib `b[0] = 99` qilsangiz `a` ga nima bo‘ladi?', 'What happens to `a` if you slice `b = a[1:4]` in NumPy and set `b[0] = 99`?', ['Hech narsa', '`a[1]` ham `99` ga o‘zgaradi, chunki slice — view!', 'Xato beradi', 'None'], ['Nothing', '`a[1]` also becomes `99` because NumPy slices return shared views!', 'Error', 'None'], 1, 'Slice view bo‘lgani uchun `a[1]` ham o‘zgaradi.', 'Slice shares memory (use `.copy()`).'),
      q('q1602_5', '`np.where(x > 0, x, 0)` yoki `x[x > 5]` qanday texnika?', 'Technique selecting elements using a True/False condition array?', ['Recursion', 'Boolean Masking / Vectorized Filtering', 'Hashing', 'Inheritance'], ['Recursion', 'Boolean Masking', 'Hashing', 'Inheritance'], 1, 'Boolean Masking.', 'Boolean Masking.'),
    ],
    homework: hw('Mini Pure-Python Vektor & Matritsa Dvigateli', 'Mini ndarray Vector Engine', 'NumPy tamoyillarini namoyish etuvchi `Vector2D` klassini yozing: `shape`, element-wise `+`/`*`, `(rows, cols) + (cols,)` broadcasting, `sum(axis=0/1)`, `dot` va `.copy()` izolyatsiyasi.', 'Build a mini `Matrix` class supporting `shape`, `sum(axis=0/1)`, row-vector broadcasting, dot products, boolean masking, and independent `.copy()`.', ['axis=0/1 + broadcasting + masking', 'Copy isolation testi'], ['axis=0/1 + broadcast + mask', 'Copy isolation test'], 'Validate trailing dimension equality for broadcasting.', 'Solid numerical core.', 'Z-score normalizatsiyasini (`(x - mean) / std`) vektor tarzda qo‘shing.', 'Add vectorized Z-score.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-16-03',
    courseId: 'data_science',
    moduleId: 'c16_m1',
    order: 3,
    titleUz: 'Pandas Asoslari — Tabular Tahlil, CSV/JSON Yuklash va Tezkor Ko‘zdan Kechirish',
    titleEn: 'Pandas Foundations: Tabular Data, Ingestion & First-Look Inspection',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-16-02'],
    conceptId: 'ds_pandas',
    whyUz: "NumPy faqat bir xil turdagi raqamli massivlar uchun ajoyib, lekin real dunyo jadvallarida (`orders.csv`, SQL natijalari) ham sana, ham matn (`\"Toshkent\"`), ham narx (`float`), ham `NULL` lar aralash keladi! **Pandas** Python da Excel va SQL kuchini birlashtiruvchi asosiy tabular tahlil kutubxonasidir.",
    whyEn: 'Master the Pandas tabular analysis workflow: loading CSV/JSON/Parquet with explicit `dtype` & `parse_dates`, inspecting shape/types/nulls immediately (`head`, `info`, `describe`, `isna().sum()`), and avoiding `iterrows()` slowness.',
    analogyUz: "**Pandas** — bu dasturlashtiriladigan super-Excel: 1 million qatorli jadvalni ham bir zumda yuklaydi, qaysi ustunda nechta `NaN` borligini sanaydi va filtr/saralashni kodda takrorlanuvchi qiladi!",
    analogyEn: 'Pandas is a programmable super-spreadsheet that ingests millions of mixed-type rows, summarizes schema health instantly, and keeps transformations 100% scripted.',
    stopsUz: "Pandas da 3 ta muhim odat: 1) Yuklash bilanoq 4 ta tekshiruvni qiling: **`.shape`**, **`.dtypes` / `.info()`**, **`.isna().sum()`**, **`.head()`**! 2) **`for idx, row in df.iterrows():`** yozmang — 100x sekin va setting-with-copy xatosini keltirib chiqaradi (o‘rniga vektorli ustun amallari yozing!). 3) Katta jadval uchun `usecols=[...]` va to‘g‘ri `dtype` bering (`category` matnlar uchun RAM ni 10x tejaydi!).",
    stopsEn: 'Inspect every ingested table with `shape`, `dtypes`/`info`, `isna().sum()`, and `head` before analyzing. Avoid slow `iterrows()` loops in favor of vectorized column expressions.',
    objUz: ['CSV/JSON/Parquet yuklash parametrlari (`usecols`, `dtype`, `parse_dates`, `na_values`)', 'Tahlildan oldingi 4 diagnostika: `shape`, `dtypes`, `isna().sum()`, `describe()`', 'Nega `iterrows()` sekin va vektorli ustun hisobi qanday yoziladi'],
    objEn: ['Load tabular data cleanly with explicit `dtype`, `usecols`, and `na_values`', 'Audit newly loaded tables (`shape`, `dtypes`, `isna().sum()`, `describe()`)', 'Replace slow `iterrows()` row loops with vectorized column operations'],
    theoryUz: `### 1. Ingestion Best Practices
- \`pd.read_csv("orders.csv", usecols=["id", "city", "total"], parse_dates=["created_at"])\`
- Katta tahlillarda CSV o‘rniga **Parquet** (ustunli, siqilgan, turlari saqlangan) 10x tezroq!
### 2. Birinchi 30 Soniyalik Audit
1. \`df.shape\` -> nechta qator, nechta ustun?
2. \`df.info()\` -> turlar \`object\` (yashirin matn!) bo‘lib qolmaganmi?
3. \`df.isna().sum()\` -> bo‘sh qiymatlar qayerda?
4. \`df.describe()\` -> min/max da mantiqsiz qiymat (masalan \`age = -5\`) bormi?
### 3. \`iterrows()\` Antipatterni
100,000 qatorni \`iterrows()\` da aylanish soniyalar oladi; \`df["tax"] = df["price"] * 0.12\` esa millisekundda bitadi!`,
    theoryEn: `### 1. Clean Ingestion
Pass \`usecols\`, \`parse_dates\`, and \`na_values\` on \`read_csv\`, or prefer **Parquet** for fast, typed analytics storage.
### 2. The 30-Second Schema Audit
Verify \`shape\`, \`dtypes\`, \`isna().sum()\`, and \`describe()\` min/max sanity before computing KPIs.
### 3. Vectorized Column Math Over \`iterrows()\`
Operate directly on column vectors (\`df["net"] = df["price"] * (1 - df["disc"])\`) rather than row-by-row Python loops.`,
    examples: [
      ex('Misol 1: Stdlib `csv` Ustida Pandas-Style `info()` & `isna().sum()` Auditori', 'Example 1: Pandas-Style Table Schema & Null Audit', `import csv, io

raw = """id,city,amount
1,Toshkent,120
2,Samarqand,
3,,85"""
rows = list(csv.DictReader(io.StringIO(raw)))
cols = list(rows[0].keys())
null_counts = {c: sum(1 for r in rows if not r[c].strip()) for c in cols}
print("Shape:", (len(rows), len(cols)), "| Nulls:", null_counts)`, `Shape: (3, 3) | Nulls: {'id': 0, 'city': 1, 'amount': 1}`, 'Tahlil boshida jadval o‘lchami (`shape`) va har ustundagi bo‘sh qiymatlar (`isna().sum()`) tekshiriladi.', 'Mirrors `df.shape` and `df.isna().sum()` immediately after CSV ingestion.'),
      ex('Misol 2: `describe()` Statistik Xulosa (`count`, `min`, `mean`, `max`)', 'Example 2: Numeric Column Describe Summary', `vals = [100, 150, 200, 350]
summary = {"count": len(vals), "min": min(vals), "mean": sum(vals) / len(vals), "max": max(vals)}
print("describe():", summary)`, `describe(): {'count': 4, 'min': 100, 'mean': 200.0, 'max': 350}`, '`describe()` anomal min/max qiymatlarni darhol ko‘rsatib beradi.', 'Numeric summary stats reveal scale, spread, and suspicious extremes.'),
      ex('Misol 3: `usecols` + Vektorli Ustun Hisoblash (`net = gross * 0.88`)', 'Example 3: Columnar Projection & Vector Math', `records = [{"id": 1, "gross": 100, "extra": "x"}, {"id": 2, "gross": 250, "extra": "y"}]
projected = [{"id": r["id"], "net": round(r["gross"] * 0.88, 2)} for r in records]
print("Projected:", projected)`, `Projected: [{'id': 1, 'net': 88.0}, {'id': 2, 'net': 220.0}]`, 'Kerakli ustunlarni oldindan ajratish (`usecols`) xotirani tejaydi.', 'Reading only needed columns reduces RAM usage on wide tables.'),
    ],
    traceTitleUz: 'Pandas Ingestion -> Audit -> Transform Trace',
    traceTitleEn: 'Tracing Tabular Ingestion Workflow',
    traceCode: `read_csv(usecols) -> check shape/nulls -> vectorized col`,
    traceSteps: [
      traceStep(1, 'usecols projection', 'only needed cols', 'Ortiqcha ustunlar tashlandi', 'Dropped unused columns'),
      traceStep(2, 'isna().sum()', 'city:1, amount:1', 'Bo‘sh qiymatlar aniqlandi', 'Counted nulls per column'),
      traceStep(3, 'vectorized net', 'gross * 0.88', 'Har qatorga bir vaqtda qo‘llandi', 'Computed column vector'),
    ],
    commonMistakes: [
      mistake('100,000 qatorni `for idx, row in df.iterrows():` da aylanish', 'Iterating Large DataFrames with df.iterrows()', `# df.iterrows() constructs a new Series object per row—100x slower than vectorized math!`, 'Minutes of wasted CPU time', `print("Replace iterrows() with vectorized column arithmetic or np.where()!")`, 'Vektorli ustun formulasi yoki `np.where()` ishlating.', 'Replace `iterrows()` with vectorized column ops or `np.where()`.', 'Vektorli amallardan foydalaning.', 'Use vectorized column math.'),
      mistake('`df.dtypes` ni tekshirmasdan string `"120"` raqamlarni `int` deb o‘ylash', 'Ignoring object Dtype Caused by Dirty Strings', `# A single "N/A" string turns an entire numeric column into object dtype, breaking .mean()!`, 'TypeError / broken aggregations', `print("Pass na_values=['N/A', ''] and inspect df.dtypes right after loading!")`, 'Yuklagandan darhol `dtypes` va `isna().sum()` ni tekshiring.', 'Check `dtypes` after loading and normalize sentinel strings (`"N/A"`) to nulls.', '`dtypes` va `na_values` ni tekshiring.', 'Check `dtypes` and `na_values`.'),
    ],
    compareTitleUz: 'CSV vs Parquet (Analytics Fayl Formati)',
    compareTitleEn: 'CSV vs Parquet',
    compareUz: ['CSV: matnli, odam o‘qiy oladi, lekin katta, sekin va turlarni (`int`/`datetime`) yo‘qotadi.', 'Parquet: ustunli binar format, 5–10x kichik, `dtype` larni saqlaydi, faqat kerakli ustunni o‘qiydi.'],
    compareEn: ['CSV: human-readable text; bulky, slow, and lacks native type schemas.', 'Parquet: compressed columnar binary; preserves schemas and reads selected columns 10x faster.'],
    compareSummaryUz: 'Har yangi jadvalda `shape`, `dtypes`, `isna().sum()` va `describe()` auditini o‘tkazing, katta tahlilda Parquet va vektorli ustunlardan foydalaning.',
    compareSummaryEn: 'Audit new tables with `shape`, `dtypes`, `isna().sum()`, and `describe()`, and favor Parquet + vectorized column math over `iterrows()`.',
    practiceTasks: [
      pt('p1603_1', '1-mashq: `isna().sum()` Hisoblagich', 'Task 1: Column Null Counter', 'Ustunlardagi `None`/`""` sonini sanang.', 'Count nulls per column.', `rows = [{"a": "1", "b": ""}, {"a": "", "b": "2"}]\nprint({k: sum(1 for r in rows if not r[k]) for k in ("a", "b")})`, "{'a': 1, 'b': 1}", 'Count empty per column', "Prints {'a': 1, 'b': 1}."),
      pt('p1603_2', '2-mashq: `usecols` Filtrlash', 'Task 2: Select usecols', 'Faqat `("id", "total")` ustunlarini qoldiring.', 'Project two columns.', `rows = [{"id": 1, "secret": "x", "total": 50}]\nprint([{k: r[k] for k in ("id", "total")} for r in rows])`, "[{'id': 1, 'total': 50}]", 'Dict comprehension over cols', "Prints [{'id': 1, 'total': 50}]."),
      pt('p1603_3', '3-mashq: `na_values` Sentinel Tozalash', 'Task 3: Map N/A to None', '`"N/A"` va `"-"` ni `None` ga aylantiring.', 'Normalize sentinel nulls.', `raw = ["10", "N/A", "-", "25"]\nprint([None if v in {"N/A", "-"} else int(v) for v in raw])`, '[10, None, None, 25]', 'Map sentinel strings to None', 'Prints [10, None, None, 25].'),
      pt('p1603_4', '4-mashq: `describe()` Statistikasi', 'Task 4: Basic Describe', '`[10, 20, 30]` ning `count`, `min`, `mean`, `max` ini chiqaring.', 'Compute summary dict.', `xs = [10, 20, 30]\nprint({"count": len(xs), "min": min(xs), "mean": sum(xs)/len(xs), "max": max(xs)})`, "{'count': 3, 'min': 10, 'mean': 20.0, 'max': 30}", 'Build summary dictionary', 'Prints summary stats.'),
      pt('p1603_5', '5-mashq: `shape` Tekshiruvi', 'Task 5: Compute (rows, cols)', '3 qator, 4 ustunli jadval `shape` ni chiqaring.', 'Return table shape.', `tbl = [[1, 2, 3, 4]] * 3\nprint((len(tbl), len(tbl[0])))`, '(3, 4)', '(len(tbl), len(tbl[0]))', 'Prints (3, 4).'),
    ],
    quiz: [
      q('q1603_1', 'Yangi CSV yuklangandan keyin har ustundagi bo‘sh (`NaN`) qiymatlar sonini ko‘rsatadigan Pandas ifodasi?', 'Pandas expression counting missing values per column?', ['df.shape()', 'df.isna().sum()', 'df.head()', 'df.drop()'], ['df.shape()', 'df.isna().sum()', 'df.head()', 'df.drop()'], 1, '`df.isna().sum()`.', '`df.isna().sum()`.'),
      q('q1603_2', 'Nima uchun katta DataFrame larda `df.iterrows()` dan qochish kerak?', 'Why avoid `df.iterrows()` on large DataFrames?', ['Syntax xato', 'Har qatorda Python Series yasab vektorli amallardan 50-100x sekin ishlaydi', 'JSON kerak', 'SQL'], ['Syntax error', 'Constructs a Series per row—orders of magnitude slower than vectorized column ops', 'JSON', 'SQL'], 1, 'Juda sekin bo‘lgani uchun.', 'Orders of magnitude slower than vectorization.'),
      q('q1603_3', 'CSV dan faqat 3 ta kerakli ustunni o‘qib RAM ni tejaydigan `read_csv()` parametri?', '`read_csv()` parameter loading only specified columns into RAM?', ['only_cols', 'usecols', 'filter', 'drop'], ['only_cols', 'usecols', 'filter', 'drop'], 1, '`usecols`.', '`usecols`.'),
      q('q1603_4', 'Ma’lumot turlarini (`int`, `datetime`) saqlaydigan va CSV dan 5-10x tez/ixcham ustunli fayl formati?', 'Columnar binary file format faster and smaller than CSV that preserves schemas?', ['TXT', 'Parquet', 'XML', 'YAML'], ['TXT', 'Parquet', 'XML', 'YAML'], 1, 'Apache Parquet.', 'Apache Parquet.'),
      q('q1603_5', 'Takrorlanuvchi shahar nomlari (`"Toshkent"`, `"Samarqand"`) ustunini Pandas da xotirada siqish turi?', 'Pandas dtype compressing repeated string labels like city names?', ['float64', 'category', 'object', 'bool'], ['float64', 'category', 'object', 'bool'], 1, '`category` dtype.', '`category` dtype.'),
    ],
    homework: hw('CSV Ingestion & Schema Auditor', 'Pandas-Style Table Audit Engine', 'CSV yuklab `na_values` (`""`, `"N/A"`, `"null"`) ni `None` ga aylantiruvchi, `shape`, har ustun turi, `isna().sum()` va raqamli ustunlar uchun `describe()` hisobotini chiqaruvchi auditor tuzing.', 'Build a table auditor converting sentinel strings to `None`, reporting `(rows, cols)` shape, inferred types, per-column null counts, and `min/mean/max` stats.', ['shape + dtypes + nulls + describe', 'Sentinel na_values tozalash'], ['Full schema & null audit', 'Sentinel null handling'], 'Infer numeric types per column ignoring None entries before running summary stats.', 'Solid data audit.', 'Parquet vs CSV xotira tejash hisob-kitobini izohda yozing.', 'Document Parquet benefits.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-16-04',
    courseId: 'data_science',
    moduleId: 'c16_m1',
    order: 4,
    titleUz: 'DataFrames va Series — `.loc` vs `.iloc`, Filtrlar, `groupby` va `merge`',
    titleEn: 'DataFrames & Series: `.loc` vs `.iloc`, Masking, `groupby` & `merge`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-16-03'],
    conceptId: 'ds_df_series',
    whyUz: "Data Science ning kundalik 90% ishi aynan 4 ta operatsiyada: 1) **`Series` vs `DataFrame`** bilan ishlash, 2) **`.loc` (label) vs `.iloc` (pozitsiya)** orqali kesish, 3) Murakkab shartlar bilan qator filtrlash, 4) SQL `GROUP BY` va `JOIN` kabi **`groupby().agg()`** hamda **`pd.merge()`**!",
    whyEn: 'Master core tabular manipulation: contrast 1D `Series` and 2D `DataFrame`, index safely with `.loc` vs `.iloc` (preventing `SettingWithCopyWarning`), write compound boolean masks, aggregate via `groupby().agg()`, and join tables cleanly with `merge()`.',
    analogyUz: "**`Series`** — bu bitta ustun (index + qiymatlar); **`DataFrame`** — bir nechta `Series` ustunlaridan yig‘ilgan to‘liq jadval. **`.loc`** = ism/label bo‘yicha chaqirish (`row_id=\"u1\"`), **`.iloc`** = o‘rindagi tartib raqami (`0, 1, 2`) bo‘yicha olish!",
    analogyEn: 'A `Series` is a single labeled column; a `DataFrame` aligns multiple `Series` columns on shared row labels. `.loc` selects by label while `.iloc` selects by integer position.',
    stopsUz: "DataFrame da 4 ta eng ko‘p uchraydigan xato: 1) **Chained Indexing (`df[df.a > 0]['b'] = 1`)** yozmang — `SettingWithCopyWarning` chiqadi va asl jadval o‘zgarmay qolishi mumkin! Doim **`df.loc[df['a'] > 0, 'b'] = 1`** ishlating! 2) Boolean filtrda Python `and`/`or` emas, **qavslar bilan `&`, `|`, `~`** yozing (`(df.a > 5) & (df.b == 'x')`)! 3) `.iloc[0:3]` oxirgi 3 ni **olmaydi**, `.loc['a':'c']` esa `'c'` ni **oladi**! 4) `merge()` qilganda **many-to-many portlash (row explosion)** ni `validate='many_to_one'` bilan nazorat qiling!",
    stopsEn: 'Never chain-assign (`df[mask]["col"] = val`)—always use `df.loc[mask, "col"] = val`. Combine DataFrame filters with parentheses and `&` / `|` / `~` (never `and`/`or`), and pass `validate=` on `merge()` to catch accidental row explosions.',
    objUz: ['`Series` (1D + Index) va `DataFrame` (2D ustunlar lug‘ati) strukturasi', '`.loc` (label, inclusive slice) vs `.iloc` (position, exclusive) va `SettingWithCopyWarning` yechimi', 'Compound Boolean Masks (`&`, `|`), `.groupby().agg()` va `.merge(..., how="left")`'],
    objEn: ['Distinguish `Series` vs `DataFrame` alignment', 'Select and assign safely via `.loc` vs `.iloc` without chained indexing', 'Aggregate with `groupby().agg()` and join tables cleanly with `merge()`'],
    theoryUz: `### 1. \`Series\` vs \`DataFrame\`
\`Series\` — indeksga ega 1D ustun; \`DataFrame\` — bir xil indeksli ustunlar to‘plami.
### 2. \`.loc\` vs \`.iloc\`
- \`.loc[row_label, col_label]\` — **label** bilan, kesishda oxiri **kiradi**!
- \`.iloc[row_pos, col_pos]\` — **0-indeks** bilan, kesishda oxiri **kirmaydi**!
- O‘zgartirishda faqat \`df.loc[mask, "col"] = new_val\` ishlating!
### 3. \`groupby().agg()\` (Split-Apply-Combine)
1. **Split**: \`city\` bo‘yicha guruhlash.
2. **Apply**: \`sum\`, \`mean\`, \`count\`.
3. **Combine**: yangi xulosa jadval!
### 4. \`pd.merge(orders, users, on="user_id", how="left", validate="many_to_one")\`
\`validate=\` parametrini berish dublikat kalit sababli qatorlar 2 baravar ko‘payib ketishini darhol to‘xtatadi!`,
    theoryEn: `### 1. \`.loc\` vs \`.iloc\`
\`.loc\` indexes by label (inclusive end slices); \`.iloc\` indexes by integer position (exclusive end). Never chain brackets when assigning.
### 2. Compound Masks
Parenthesize conditions and combine via \`&\`, \`|\`, \`~\`.
### 3. Split-Apply-Combine (\`groupby().agg()\`)
Group rows by key, compute named aggregations (\`revenue=("total", "sum")\`), and emit clean summary tables.
### 4. Relational Joins (\`merge\`)
Specify \`how="inner" | "left"\` and guard cardinality with \`validate="many_to_one"\`.`,
    examples: [
      ex('Misol 1: Split-Apply-Combine (`groupby("city").agg(total, count)`)', 'Example 1: GroupBy Aggregation Engine', `from collections import defaultdict

orders = [
    {"city": "Toshkent", "total": 120},
    {"city": "Samarqand", "total": 80},
    {"city": "Toshkent", "total": 180},
]
groups = defaultdict(list)
for o in orders:
    groups[o["city"]].append(o["total"])

agg = {c: {"count": len(vs), "sum": sum(vs), "avg": sum(vs) / len(vs)} for c, vs in sorted(groups.items())}
print(agg)`, `{'Samarqand': {'count': 1, 'sum': 80, 'avg': 80.0}, 'Toshkent': {'count': 2, 'sum': 300, 'avg': 150.0}}`, 'Split-Apply-Combine guruhlash har bir shahar bo‘yicha soni, summasi va o‘rtachasini chiqardi.', 'Implements Pandas-style split-apply-combine aggregation by grouping key.'),
      ex('Misol 2: `LEFT JOIN` (`merge`) + `validate="many_to_one"` Himoyasi', 'Example 2: Left Merge with Cardinality Validation', `users = {1: "Ali", 2: "Vali"}  # unique PK -> safe many_to_one
orders = [{"oid": 10, "uid": 1}, {"oid": 11, "uid": 99}]

joined = [{**o, "user_name": users.get(o["uid"], None)} for o in orders]
print("Left join:", joined)`, `Left join: [{'oid': 10, 'uid': 1, 'user_name': 'Ali'}, {'oid': 11, 'uid': 99, 'user_name': None}]`, 'Left merge o‘ng jadvalda user topilmasa ham buyurtma `11` ni saqlab `None` qo‘yadi.', 'Left join preserves all left rows even when right lookup key `99` is absent.'),
      ex('Misol 3: `.loc` Shartli Tayinlash (Chained Indexing siz)', 'Example 3: Single-Step Conditional Assignment (.loc)', `df = [{"tier": "free", "spend": 600}, {"tier": "free", "spend": 100}]
for row in df:
    if row["spend"] >= 500:
        row["tier"] = "vip"
print("Updated DF:", df)`, `Updated DF: [{'tier': 'vip', 'spend': 600}, {'tier': 'free', 'spend': 100}]`, 'Bitta qadamda shart bilan tayinlash `SettingWithCopyWarning` ni chetlab o‘tadi.', 'Single-step `.loc[mask, col] = val` updates the original DataFrame directly.'),
    ],
    traceTitleUz: 'GroupBy (Split-Apply-Combine) Trace',
    traceTitleEn: 'Tracing Split-Apply-Combine',
    traceCode: `groupby("city").agg(sum, count)`,
    traceSteps: [
      traceStep(1, 'Split', 'Toshkent:[120,180], Sam:[80]', 'Kalit bo‘yicha guruhlandi', 'Split into per-key buckets'),
      traceStep(2, 'Apply', 'sum & len', 'Agregatsiya hisoblandi', 'Computed sum & count'),
      traceStep(3, 'Combine', 'summary table', 'Natija birlashtirildi', 'Combined into result'),
    ],
    commonMistakes: [
      mistake('`df[df["a"] > 0]["b"] = 10` (Chained Indexing) yozish', 'Chained Indexing Causing SettingWithCopyWarning', `# df[df["a"] > 0] may return a temporary copy—assigning ["b"] = 10 fails to update df!`, 'SettingWithCopyWarning & lost updates', `print("Always combine selector and column in ONE call: df.loc[df['a'] > 0, 'b'] = 10!")`, 'Ikkita qavs `[][]` o‘rniga bitta `df.loc[mask, col]` yozing.', 'Always use single-step `df.loc[mask, col] = val` instead of chained brackets.', '`df.loc[mask, col]` ishlating.', 'Use `df.loc[mask, col]`.'),
      mistake('`merge()` da takroriy kalitlarni tekshirmay qatorlarni portlatib yuborish', 'Unchecked Many-to-Many Merge Exploding Row Counts', `# Merging two tables with duplicate join keys multiplies rows M*N times, doubling revenue sums!`, 'Silent 2x-10x inflated KPIs', `print("Pass validate='many_to_one' (or assert len(merged) == len(left)) after every left join!")`, 'Left join dan keyin qatorlar soni o‘zgarmaganini tekshiring (`validate=`).', 'Check row counts or pass `validate=` to `merge()` to catch accidental key duplicates.', '`validate=` qo‘ying.', 'Pass `validate=` on merges.'),
    ],
    compareTitleUz: '`.loc` (Label) vs `.iloc` (Integer Position)',
    compareTitleEn: '`.loc` vs `.iloc`',
    compareUz: ['`.loc["a":"c"]`: indeks nomi (label) bo‘yicha va oxirgi `"c"` **kiradi**.', '`.iloc[0:3]`: 0-asosli butun son pozitsiyasi bo‘yicha va oxirgi `3` **kirmaydi**.'],
    compareEn: ['`.loc`: label-based; end label in slice is inclusive.', '`.iloc`: 0-based integer position; end index in slice is exclusive.'],
    compareSummaryUz: 'DataFrame da tayinlash uchun `.loc[mask, col]`, filtrlashda qavslangan `&`/`|`, guruhlashda `groupby().agg()`, birlashtirishda `merge(..., validate=)` ishlating.',
    compareSummaryEn: 'Use `.loc[mask, col]` for updates, parenthesized `&`/`|` filters, `groupby().agg()`, and `merge(..., validate=)` for safe joins.',
    practiceTasks: [
      pt('p1604_1', '1-mashq: Compound Filter (`&`)', 'Task 1: Compound Row Filter', '`city == "UZ" and amount >= 100` shartli qatorlarni ajrating.', 'Filter by two conditions.', `rows = [{"c": "UZ", "a": 150}, {"c": "UZ", "a": 40}, {"c": "US", "a": 200}]\nprint([r for r in rows if r["c"] == "UZ" and r["a"] >= 100])`, "[{'c': 'UZ', 'a': 150}]", 'Compound boolean condition', 'Prints matching row.'),
      pt('p1604_2', '2-mashq: `groupby().sum()`', 'Task 2: GroupBy Sum', 'Kategoriya bo‘yicha summalarni hisoblang.', 'Group and sum.', `from collections import defaultdict\nd = defaultdict(int)\nfor k, v in [("A", 10), ("B", 5), ("A", 20)]: d[k] += v\nprint(dict(sorted(d.items())))`, "{'A': 30, 'B': 5}", 'defaultdict sum', "Prints {'A': 30, 'B': 5}."),
      pt('p1604_3', '3-mashq: Left Join & Unmatched', 'Task 3: Left Join Lookup', 'O‘ng jadvalda yo‘q kalitga `"Guest"` bering.', 'Left join fallback.', `u = {1: "Ali"}\nprint([u.get(oid, "Guest") for oid in (1, 2)])`, "['Ali', 'Guest']", 'dict.get default', "Prints ['Ali', 'Guest']."),
      pt('p1604_4', '4-mashq: `.iloc` vs `.loc` Slicing', 'Task 4: Slice Contrast', 'List `["a", "b", "c"]` dan `0:2` (iloc) va label `a..c` natijasini ko‘rsating.', 'Contrast slice bounds.', `xs = ["a", "b", "c"]\nprint("iloc[0:2]:", xs[0:2], "| loc a..c len:", len(xs[0:3]))`, "iloc[0:2]: ['a', 'b'] | loc a..c len: 3", 'Exclusive vs inclusive slice', 'Prints both bounds.'),
      pt('p1604_5', '5-mashq: `validate="many_to_one"` Check', 'Task 5: Check Unique Right Keys', 'O‘ng jadval kalitlari noyob ekanini tasdiqlang.', 'Validate unique join keys.', `right_keys = [1, 2, 2]\nprint("Unique?", len(right_keys) == len(set(right_keys)))`, 'Unique? False', 'Compare len vs len(set)', 'Prints Unique? False.'),
    ],
    quiz: [
      q('q1604_1', '`df[df["age"] > 18]["status"] = "adult"` yozishda nima uchun xavfli ogohlantirish chiqadi?', 'Why does `df[df["age"] > 18]["status"] = "adult"` trigger `SettingWithCopyWarning`?', ['Xotira yetmaydi', 'Chained indexing copy qaytarib asl DataFrame ni o‘zgartirmay qolishi mumkin (`.loc` kerak)', 'SyntaxError', 'SQL kerak'], ['OOM', 'Chained indexing may mutate a temporary copy instead of `df` (use `.loc[mask, col]`)', 'Syntax', 'SQL'], 1, 'Chained indexing o‘rniga `.loc[mask, col]` ishlating.', 'Use single-step `.loc[mask, col]`.'),
      q('q1604_2', 'Pandas da `.loc` va `.iloc` orasidagi asosiy farq?', 'Key difference between `.loc` and `.iloc` in Pandas?', ['Bir xil', '`.loc` indeks nomi (label, oxiri kiradi) bo‘yicha, `.iloc` esa butun son pozitsiyasi (oxiri kirmaydi) bo‘yicha oladi', 'Faqat ustunlar', '`.iloc` tezroq'], ['Identical', '`.loc` selects by label (inclusive slices); `.iloc` selects by integer position (exclusive slices)', 'Cols only', 'Faster'], 1, 'Label vs integer pozitsiya.', 'Label vs integer position.'),
      q('q1604_3', 'Pandas DataFrame ni 2 ta shart bilan filtrlashda qaysi mantiqiy operatorlar ishlatiladi?', 'Logical operators used inside Pandas boolean mask expressions?', ['and / or / not', '& / | / ~ (qavslar bilan)', '&& / ||', 'xor'], ['and / or / not', '& / | / ~ with parentheses', '&& / ||', 'xor'], 1, 'Qavslar ichida `&`, `|`, `~`.', 'Bitwise `&`, `|`, `~` with parentheses.'),
      q('q1604_4', '`pd.merge()` da kalit dublikatlari tufayli qatorlar portlab ketishini ushlaydigan parametr?', '`pd.merge()` parameter enforcing expected join cardinality like `many_to_one`?', ['unique=True', 'validate="many_to_one"', 'strict=True', 'limit=1'], ['unique=True', 'validate="many_to_one"', 'strict=True', 'limit=1'], 1, '`validate=`.', '`validate=`.'),
      q('q1604_5', '`groupby()` ning 3 bosqichli modeli qanday ataladi?', 'Classic 3-step conceptual model behind `groupby()`?', ['Map-Filter-Zip', 'Split-Apply-Combine', 'Read-Eval-Print', 'Encode-Decode'], ['Map-Filter-Zip', 'Split-Apply-Combine', 'REPL', 'Encode-Decode'], 1, 'Split-Apply-Combine.', 'Split-Apply-Combine.'),
    ],
    homework: hw('Mini DataFrame (`groupby`, `merge`, `.loc`) Dvigateli', 'Mini DataFrame Query Engine', 'Qatorlar ro‘yxati ustida `filter()`, `.loc` uslubidagi shartli yangilash, `groupby(col).agg(sum, mean, count)` va `left_merge(..., validate_unique_right=True)` ni bajaruvchi kichik `MiniDF` klassi yozing.', 'Implement a `MiniDF` class supporting boolean masking, single-step conditional column updates, `groupby().agg(sum, count, avg)`, and validated left merges.', ['groupby + validated merge + filter', 'Duplicate key xatosini ushlash testi'], ['groupby + validated merge', 'Test catching duplicate join key'], 'Raise ValueError in left_merge if the right table has duplicate join keys.', 'Clean DataFrame core.', 'Natijani saralangan jadval ko‘rinishida chiqaring.', 'Sort aggregated output.', 25),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-16-05',
    courseId: 'data_science',
    moduleId: 'c16_m2',
    order: 5,
    titleUz: 'Data Cleaning — Missing (`NaN`), Dublikatlar, Turlar, Outliers va Review #35',
    titleEn: 'Data Cleaning: Missing Values, Duplicates, Casting, Outliers & Review #35',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-16-04'],
    conceptId: 'ds_cleaning',
    whyUz: "Real datasetlarda bo‘sh kataklar (`NaN`), dublikat buyurtmalar, `\"$1,200\"` matnli narxlar, turlicha shahar nomlari (`\"toshkent\"` vs `\"Toshkent \"`) va xato kiritilgan **Outlier** (`age = 999`) lar to‘lib yotadi! \"Garbage In, Garbage Out\" — toza bo‘lmagan ma’lumot eng zo‘r ML modelni ham chalg‘itadi!",
    whyEn: 'Master rigorous data cleaning: decide cleanly between dropping vs imputing missing values (mean vs median), deduplicate on business keys, normalize messy strings/currencies, and detect outliers via IQR.',
    analogyUz: "**Data Cleaning** — bu meva sharbati chiqarishdan oldin chirigan, qumli va bargli mevalarni saralash: qumni maydalab qo‘shsangiz sharbat ichib bo‘lmaydi!",
    analogyEn: 'Data cleaning washes dirt and removes rotten fruit before pressing juice—skipping it spoils every downstream metric and ML model.',
    stopsUz: "Tozalashda 3 oltin qoida: 1) **Outlierlar bor ustunda `NaN` ni Mean (o‘rtacha) bilan emas, Median (o‘rta qiymat) bilan to‘ldiring** (1 ta `1,000,000` maosh mean ni buzadi!). 2) **`drop_duplicates()`** chaqirganda `keep='last'` (eng yangi yozuvni qoldirish) va aniq `subset=['order_id']` bering! 3) Har bir tashlangan/to‘ldirilgan qator sonini **Audit Log** da yozib boring!",
    stopsEn: 'Prefer median imputation over mean when outliers or skewed distributions exist, specify explicit `subset=` and `keep=` rules on deduplication, and log every dropped/imputed row count.',
    objUz: ['Missing data (`dropna` vs `fillna` — mean vs median vs `"Unknown"` vs forward-fill)', 'Dublikatlarni biznes kalit (`subset`) bo‘yicha tozalash va String/Currency normallashtirish', 'IQR (`Q1 - 1.5*IQR .. Q3 + 1.5*IQR`) yordamida Outlierlarni aniqlash va audit qilish'],
    objEn: ['Choose among dropping, median/mode imputation, or category `"Unknown"` for missing data', 'Deduplicate records safely by business keys (`keep="last"`) and standardize messy text', 'Detect extreme numerical outliers using the Interquartile Range (IQR) rule'],
    theoryUz: `### 1. Missing Data (\`NaN\` / \`None\`) Strategiyalari
- **Drop**: ustunning >70% qismi bo‘sh bo‘lsa yoki target (\`y\`) yo‘q bo‘lsa.
- **Median Impute**: raqamli ustunda outlierlar bo‘lsa (Mean o‘rniga!).
- **Mode / \`"Unknown"\`**: kategoriyali ustunlar uchun (\`city\` -> \`"Unknown"\`).
### 2. Dublikatlar va Matn Normallashtirish
\`.str.strip().str.lower()\` bilan \`"Toshkent "\` va \`"toshkent"\` ni birlashtiring; \`drop_duplicates(subset=["tx_id"], keep="last")\`.
### 3. IQR Outlier Aniqlash
\`IQR = Q3 - Q1\`; chegara: \`[Q1 - 1.5*IQR, Q3 + 1.5*IQR]\`. Chegaradan tashqari qiymat **xato** (\`age=999\`) bo‘lsa tozalanadi, **haqiqiy VIP mijoz** bo‘lsa Capping (Winsorization) qilinadi!`,
    theoryEn: `### 1. Handling Missing Values
Drop only when data is sparse or target-less; impute skewed numeric features with **median** and categorical nulls with **mode** or \`"Unknown"\`.
### 2. Text & Duplicate Hygiene
Trim/case-fold strings before grouping and deduplicate by stable business IDs (\`keep="last"\`).
### 3. IQR Outlier Detection
Compute \`IQR = Q3 - Q1\`; inspect values outside \`[Q1 - 1.5*IQR, Q3 + 1.5*IQR]\` before dropping or capping.`,
    examples: [
      ex('Misol 1: Skewed Ustunda Median vs Mean Imputatsiya', 'Example 1: Median Imputation Resisting Extreme Outliers', `salaries = [1000, 1200, 1100, 1300, 50000, None]
valid = sorted(x for x in salaries if x is not None)
mean_val = sum(valid) / len(valid)
mid = len(valid) // 2
median_val = valid[mid] if len(valid) % 2 else (valid[mid - 1] + valid[mid]) / 2
print("Mean (distorted):", mean_val, "| Median (robust):", median_val)`, `Mean (distorted): 10920.0 | Median (robust): 1200`, 'Bitta 50,000 outlier o‘rtacha qiymatni 10,920 gacha ko‘tarib yubordi; Median esa haqiqiy markaz `1200` ni saqladi!', 'A single outlier inflates the mean to 10,920, whereas the median remains robust at 1,200.'),
      ex('Misol 2: Matn Normallashtirish + Business-Key Deduplikatsiya (`keep="last"`)', 'Example 2: Case-Fold & Deduplicate Keep-Last', `raw = [
    {"id": 1, "city": "  toshkent "},
    {"id": 2, "city": "Samarqand"},
    {"id": 1, "city": "Toshkent"},  # newer update
]
dedup = {}
for r in raw:
    dedup[r["id"]] = {"id": r["id"], "city": r["city"].strip().title()}
print("Cleaned rows:", list(dedup.values()))`, `Cleaned rows: [{'id': 1, 'city': 'Toshkent'}, {'id': 2, 'city': 'Samarqand'}]`, 'Bir xil `id=1` bo‘yicha eng oxirgi yozuv qoldirildi va shahar nomi bir xil formatga keltirildi.', 'Deduplicates by primary key (`keep="last"`) while normalizing inconsistent whitespace/casing.'),
      ex('Misol 3: IQR Qoidasi bilan Outlier Aniqlash', 'Example 3: IQR Outlier Fence Check', `vals = [10, 12, 13, 14, 15, 16, 18, 200]  # sorted
q1, q3 = vals[len(vals) // 4], vals[(3 * len(vals)) // 4]
iqr = q3 - q1
hi = q3 + 1.5 * iqr
outliers = [x for x in vals if x > hi]
print(f"Q1={q1}, Q3={q3}, upper={hi}, outliers={outliers}")`, `Q1=13, Q3=18, upper=25.5, outliers=[200]`, '`200` qiymati `Q3 + 1.5 * IQR` (`25.5`) dan ancha katta bo‘lgani uchun outlier sifatida ajratildi.', 'Flags extreme values exceeding `Q3 + 1.5 * IQR` cleanly.'),
    ],
    traceTitleUz: 'Cleaning Pipeline (Normalize -> Deduplicate -> Impute) Trace',
    traceTitleEn: 'Tracing Data Cleaning Pipeline',
    traceCode: `raw -> strip().title() -> dedup(keep="last") -> fillna(median)`,
    traceSteps: [
      traceStep(1, 'Normalize strings', '" toshkent " -> "Toshkent"', 'Matn formatlandi', 'Standardized casing'),
      traceStep(2, 'Deduplicate id', '3 rows -> 2 rows', 'Dublikat olib tashlandi', 'Kept latest per ID'),
      traceStep(3, 'Impute nulls', 'None -> median', 'Bo‘sh joy median bilan to‘ldi', 'Filled missing with median'),
    ],
    commonMistakes: [
      mistake('Outlierlar bor ustundagi `NaN` larni Mean (o‘rtacha) bilan to‘ldirish', 'Imputing Skewed Data with Mean Instead of Median', `# Filling missing house prices with mean($5M because of 2 palaces) biases normal houses!`, 'Skewed downstream KPIs & models', `print("Use median imputation for skewed numerical columns with outliers!")`, 'Ko‘chmas mulk va maosh kabi ustunlarda doim Median ishlating.', 'Always prefer median over mean for skewed distributions.', 'Median bilan to‘ldiring.', 'Use median imputation.'),
      mistake('Shahar nomlarini `.strip().lower()` qilmasdan `groupby` qilish', 'Grouping Uncleaned Dirty Strings', `# "Toshkent", "toshkent", and "Toshkent " create 3 fake separate groups in groupby()!`, 'Fragmented broken categories', `print("Always strip() and normalize casing before grouping text columns!")`, 'Bo‘sh joy va harf katta-kichikligini guruhlashdan OLDIN tozalang.', 'Normalize whitespace and casing prior to grouping.', 'Oldin `.strip()` + case-normalize qiling.', 'Normalize strings first.'),
    ],
    compareTitleUz: 'Drop Rows (`dropna`) vs Impute (`fillna`) vs Capping',
    compareTitleEn: 'Dropping vs Imputing vs Capping Outliers',
    compareUz: ['`dropna`: faqat bo‘sh qatorlar juda kam (<5%) yoki target yo‘q bo‘lganda.', '`fillna(median / "Unknown")`: ma’lumot hajmini yo‘qotmasdan tozalash.', 'Capping (Winsorization): outlierni o‘chirmay chegara qiymatga qisish.'],
    compareEn: ['`dropna`: when nulls are tiny (<5%) or label `y` itself is missing.', '`fillna`: preserves row counts via median or `"Unknown"`.', 'Capping: clamps extreme values to upper/lower fences rather than deleting rows.'],
    compareSummaryUz: 'Matnlarni tozalab `keep="last"` bilan dublikatlarni olib tashlang, `NaN` larni skewga qarab Median/`"Unknown"` bilan to‘ldiring va IQR bilan outlierlarni tekshiring.',
    compareSummaryEn: 'Standardize strings, deduplicate on business keys (`keep="last"`), impute skewed nulls with median, and audit outliers via IQR.',
    practiceTasks: [
      pt('p1605_1', '1-mashq: Median Hisoblash', 'Task 1: Compute Median', '`[10, 500, 20, 30]` tartiblangan medianasini chiqaring.', 'Compute median.', `v = sorted([10, 500, 20, 30])\nm = len(v) // 2\nprint((v[m - 1] + v[m]) / 2)`, '25.0', 'Average two middle values', 'Prints 25.0.'),
      pt('p1605_2', '2-mashq: Kategoriya `"Unknown"` Fillna', 'Task 2: Fill Missing Category', '`None` va `""` shaharlarni `"Unknown"` bilan almashtiring.', 'Impute Unknown.', `cities = ["Toshkent", None, " ", "Buxoro"]\nprint([c.strip() if c and c.strip() else "Unknown" for c in cities])`, "['Toshkent', 'Unknown', 'Unknown', 'Buxoro']", 'Check c and c.strip()', 'Prints cleaned cities.'),
      pt('p1605_3', '3-mashq: Dublikat Olish (`keep="last"`)', 'Task 3: Deduplicate Keep-Last', '`[(1, "old"), (2, "ok"), (1, "new")]` dan oxirgi qiymatlarni saqlang.', 'Keep last per ID.', `d = {}\nfor k, v in [(1, "old"), (2, "ok"), (1, "new")]: d[k] = v\nprint(d)`, "{1: 'new', 2: 'ok'}", 'Dict overwrite keeps last', "Prints {1: 'new', 2: 'ok'}."),
      pt('p1605_4', '4-mashq: Narx Satrini Floatga O‘girish', 'Task 4: Parse Messy Currency', '`"$1,450.50"` ni `1450.5` floatga aylantiring.', 'Parse currency string.', `print(float("$1,450.50".replace("$", "").replace(",", "")))`, '1450.5', 'Strip $ and ,', 'Prints 1450.5.'),
      pt('p1605_5', '5-mashq: Winsorize / Capping', 'Task 5: Cap Values to Fence', '`[5, 12, 999]` qiymatlarini `[0, 100]` oralig‘iga qising (`clamp`).', 'Cap outliers to bounds.', `print([max(0, min(x, 100)) for x in [5, 12, 999]])`, '[5, 12, 100]', 'max(0, min(x, 100))', 'Prints [5, 12, 100].'),
    ],
    quiz: [
      q('q1605_1', 'Ichida ekstremal katta outlier (`50,000`) bor maosh ustunidagi `None` larni qaysi ko‘rsatkich bilan to‘ldirish xavfsizroq?', 'Better imputation metric for a skewed salary column containing extreme outliers?', ['Mean (o‘rtacha)', 'Median (o‘rta qiymat)', 'Max', '0'], ['Mean', 'Median', 'Max', '0'], 1, 'Median outlierlarga chidamli.', 'Median resists extreme outliers.'),
      q('q1605_2', 'Bir xil `order_id` ning eski va yangi nusxasi kelganda yangisini qoldirish uchun `drop_duplicates` ga qaysi argument beriladi?', 'Argument to `drop_duplicates()` keeping the newest later row?', ['keep="first"', 'keep="last"', 'keep=False', 'latest=True'], ['keep="first"', 'keep="last"', 'keep=False', 'latest=True'], 1, '`keep="last"`.', '`keep="last"`.'),
      q('q1605_3', 'IQR outlier aniqlash formulasida yuqori chegara qanday hisoblanadi?', 'Upper outlier fence formula using the Interquartile Range (IQR)?', ['Q3 + IQR', 'Q3 + 1.5 * IQR', 'Mean + 0.5', 'Max / 2'], ['Q3 + IQR', 'Q3 + 1.5 * IQR', 'Mean + 0.5', 'Max / 2'], 1, '`Q3 + 1.5 * IQR`.', '`Q3 + 1.5 * IQR`.'),
      q('q1605_4', '`" toshkent "` va `"Toshkent"` guruhlashda ajralib ketmasligi uchun oldin nima qilinadi?', 'Step needed before grouping dirty city strings like `" toshkent "` and `"Toshkent"`?', ['Drop', '`.strip()` va bir xil harf registriga (`.title()`/`.lower()`) keltirish', 'Sort', 'Hash'], ['Drop', 'Trim whitespace (`.strip()`) and normalize casing before grouping', 'Sort', 'Hash'], 1, '`.strip()` va case normalizatsiya.', 'Strip and case-normalize.'),
      q('q1605_5', 'Ekstremal haqiqiy qiymatni butunlay o‘chirib tashlamasdan yuqori chegaraga tushirib qo‘yish usuli?', 'Technique clamping extreme outliers to a boundary instead of dropping rows?', ['Imputation', 'Capping / Winsorization', 'Deduplication', 'One-Hot'], ['Imputation', 'Capping / Winsorization', 'Deduplication', 'One-Hot'], 1, 'Capping / Winsorization.', 'Capping / Winsorization.'),
    ],
    homework: hw('Bozor Ma’lumotlarini Tozalash & Audit Pipeline', 'Automated Data Cleaning & Audit Pipeline', 'Kir, dublikat, narx matni (`"$1,200"`), bo‘sh qiymat va outlierli xom yozuvlarni tozalovchi, IQR chegarasiga qisuvchi (cap) hamda nechta dublikat/null tuzatilgani haqida audit log qaytaruvchi funksiya yozing.', 'Write a deterministic cleaning pipeline normalizing currency/city strings, deduplicating by ID (`keep="last"`), imputing skewed nulls with median, capping IQR outliers, and emitting a cleaning audit log.', ['Normalize + Dedup + Median Impute + IQR Cap', 'Cleaning Audit Report'], ['Full clean pipeline', 'Audit report dict'], 'Order steps: normalize strings -> deduplicate -> parse numbers -> compute median & IQR -> impute & cap.', 'Production ETL cleaner.', 'Review #35 loyihasi bilan mustahkamlang!', 'Integrate with Review #35.', 25),
    reviewCheckpoint: review(
      35,
      'Review Loyiha #35: Ingestion Audit + GroupBy + Data Cleaning Pipeline!',
      'Review Project #35: End-to-End Tabular Clean & GroupBy Engine!',
      '16-kurs 1-yarmini yakunlang: xom CSV dan null auditi, matn normallashtirish, `keep="last"` deduplikatsiya, median imputatsiya va shaharlar bo‘yicha `groupby` yig‘indisini bitta pipeline da bajaring.',
      'Complete Course 16 Part 1! Run CSV ingestion, null auditing, string normalization, `keep="last"` deduplication, median imputation, and `groupby` revenue summaries together.',
      ['Null & Schema Audit', 'Dedup + String/Number Cleaning', 'Shaharlar bo‘yicha GroupBy Sum & Avg'],
      ['Null audit', 'Dedup + Clean', 'GroupBy summary'],
      `import csv, io
from collections import defaultdict

RAW_CSV = """order_id,city,amount
1, toshkent ,$100
2,Samarqand,
1,Toshkent,$150
3,samarqand,$50"""

dedup = {}
for r in csv.DictReader(io.StringIO(RAW_CSV)):
    amt = int(r["amount"].replace("$", "")) if r["amount"].strip() else None
    dedup[r["order_id"]] = {"city": r["city"].strip().title(), "amount": amt}

valid_amts = sorted(v["amount"] for v in dedup.values() if v["amount"] is not None)
median = valid_amts[len(valid_amts) // 2]

by_city = defaultdict(list)
for row in dedup.values():
    val = row["amount"] if row["amount"] is not None else median
    by_city[row["city"]].append(val)

print("Median used:", median)
print("City totals:", {c: sum(vs) for c, vs in sorted(by_city.items())})
`,
    ),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-16-06',
    courseId: 'data_science',
    moduleId: 'c16_m2',
    order: 6,
    titleUz: 'Data Transformation — Scaling, Binning, Date Features va Pivot Reshaping',
    titleEn: 'Data Transformation: Scaling, Binning, Date Extraction & Pivot Tables',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-16-05'],
    conceptId: 'ds_transformation',
    whyUz: "Tozalangan ma’lumot hali ham modellashtirish yoki hisobot uchun tayyor emas: masalan, bir ustun `0..1` oralig‘ida, ikkinchisi `1,000,000..50,000,000` so‘m! Bundan tashqari, `\"2026-05-14\"` sanasidan hafta kuni, `age` dan yosh guruhlari (**Binning**), yoki satrlardan **Pivot Table** yasash **Data Transformation** bosqichining yuragidir.",
    whyEn: 'Transform cleaned data for analytics and ML: normalize features (Min-Max & Z-score), bin continuous numbers into discrete tiers (`pd.cut`/`qcut`), derive calendar features from ISO dates, and reshape long tables into Pivot matrices.',
    analogyUz: "**Data Transformation** — bu mahsulotlarni qadoqlash: tarozi grammda ham, tonnada ham bo‘lsa solishtirib bo‘lmaydi — hammasini bitta shkalaga (Scaling) keltirasiz, yoshlarni \"18–25\", \"26–35\" qutilariga solasiz (Binning) va Excel Pivot jadvaliga yigasiz!",
    analogyEn: 'Transformation packages clean ingredients into consistent formats: scaling puts features on comparable units, binning groups numbers into tiers, and pivoting summarizes cross-tab matrices.',
    stopsUz: "Transformatsiyada 3 muhim qoida: 1) **Log1p transform (`math.log1p(x)`)** kuchli o‘ngga cho‘zilgan (narxlar, ko‘rishlar soni) ustunlarni chiroyli simmetrik qiladi (`x=0` da ham sinmaydi!). 2) **`pd.cut` (teng kenglikdagi oraliqlar) vs `pd.qcut` (har guruhda teng odam soni — kvantil)** farqini biling! 3) Pivot jadvalda bo‘sh kataklarni `fill_value=0` bilan to‘ldiring!",
    stopsEn: 'Use `math.log1p(x)` to compress heavily right-skewed nonnegative distributions safely, distinguish equal-width (`cut`) from equal-count (`qcut`) binning, and specify `fill_value=0` when building pivot matrices.',
    objUz: ['Min-Max `[0, 1]`, Z-Score `(x - μ) / σ` va `log1p` transformatsiyalari', 'Equal-width Binning vs Quantile Binning (`cut` vs `qcut`)', 'Sana ustunidan feature ajratish (`year`, `month`, `is_weekend`) va Long -> Wide Pivot Table'],
    objEn: ['Compute Min-Max, Z-Score, and `log1p` numerical scalings', 'Contrast equal-width vs quantile binning', 'Extract calendar features from ISO dates and pivot long records into wide cross-tabs'],
    theoryUz: `### 1. Masshtablash (Scaling & Log)
- **Min-Max**: \`(x - min) / (max - min)\` -> \`[0, 1]\` (chegara aniq bo‘lganda).
- **Z-Score (Standard)**: \`(x - mean) / std\` -> o‘rtacha \`0\`, std \`1\`.
- **\`log1p(x)\`**: \`ln(1 + x)\` — \`10\` dan \`10,000,000\` gacha tarqalgan summalar uchun!
### 2. Binning (Guruhlash)
\`age=23\` -> \`"18-25"\`. \`cut\` oraliq kengligini, \`qcut\` har qutidagi element sonini tenglaydi.
### 3. Date Extraction & Pivot Reshaping
\`datetime.fromisoformat(s)\` -> \`month\`, \`weekday() >= 5\` (weekend!). Pivot jadval \`(row=city, col=month, val=sum)\` matritsasini tuzadi.`,
    theoryEn: `### 1. Numeric Scaling & Log Transforms
Min-Max bounds values to \`[0, 1]\`; Z-score centers at zero mean & unit variance; \`log1p\` tames heavy right-skew safely even at \`0\`.
### 2. Discretization (Binning)
Map continuous metrics into readable tiers (\`Low\`/\`Med\`/\`High\`) using domain thresholds or quantiles.
### 3. Date Features & Pivoting
Derive \`month\` / \`is_weekend\` from ISO strings and pivot long event logs into readable cross-tab summary grids.`,
    examples: [
      ex('Misol 1: Min-Max, Z-Score va `math.log1p` Transformatsiyalari', 'Example 1: Min-Max, Z-Score & Log1p Scaling', `import math, statistics

xs = [0.0, 10.0, 20.0, 50.0]
mn, mx = min(xs), max(xs)
mu, sd = statistics.mean(xs), statistics.pstdev(xs)
minmax = [round((x - mn) / (mx - mn), 2) for x in xs]
zscore = [round((x - mu) / sd, 2) for x in xs]
logs   = [round(math.log1p(x), 2) for x in xs]
print("MinMax:", minmax)
print("ZScore:", zscore)
print("Log1p :", logs)`, `MinMax: [0.0, 0.2, 0.4, 1.0]\nZScore: [-1.07, -0.53, 0.0, 1.6]\nLog1p : [0.0, 2.4, 3.04, 3.93]`, 'Turli transformatsiyalar bir xil sonlarning shkalasini har xil ehtiyojga moslashtiradi.', 'Applies Min-Max, Z-score standardization, and `log1p` skew compression cleanly.'),
      ex('Misol 2: ISO Sanadan Calendar Featurelar va Binning', 'Example 2: Calendar Extraction & Age Binning', `from datetime import date

def featurize(iso: str, age: int) -> dict:
    d = date.fromisoformat(iso)
    tier = "youth" if age < 25 else ("adult" if age < 50 else "senior")
    return {"month": d.month, "is_weekend": d.weekday() >= 5, "age_tier": tier}

print(featurize("2026-05-16", 22))  # Saturday`, `{'month': 5, 'is_weekend': True, 'age_tier': 'youth'}`, '`date.fromisoformat()` dan hafta oxiri (`is_weekend`) va yosh guruhi ajratib olindi.', 'Extracts calendar signals and categorical bins from raw ISO dates and ages.'),
      ex('Misol 3: Long -> Wide Pivot Table (`fill_value=0`)', 'Example 3: Long-to-Wide Pivot Cross-Tab', `from collections import defaultdict

events = [("Toshkent", "Jan", 100), ("Toshkent", "Feb", 150), ("Buxoro", "Jan", 80)]
grid = defaultdict(lambda: defaultdict(int))
months = sorted({m for _, m, _ in events})
for city, mon, amt in events:
    grid[city][mon] += amt

pivot = {city: {m: grid[city][m] for m in months} for city in sorted(grid)}
print("Pivot:", pivot)`, `Pivot: {'Buxoro': {'Feb': 0, 'Jan': 80}, 'Toshkent': {'Feb': 150, 'Jan': 100}}`, 'Buxoro da `Feb` ma’lumoti bo‘lmasa ham Pivot jadvalda `fill_value=0` qo‘yildi.', 'Reshapes long transactions into a complete `(city x month)` pivot grid defaulting missing cells to `0`.'),
    ],
    traceTitleUz: 'Scaling -> Binning -> Pivot Trace',
    traceTitleEn: 'Tracing Data Transformation',
    traceCode: `xs = [0, 10, 20, 50] -> MinMax`,
    traceSteps: [
      traceStep(1, 'min=0, max=50', 'range=50', 'Oraliq topildi', 'Computed denominator'),
      traceStep(2, '(x - 0) / 50', '[0.0, 0.2, 0.4, 1.0]', '[0, 1] oralig‘iga tushdi', 'Normalized to [0, 1]'),
    ],
    commonMistakes: [
      mistake('`math.log(x)` ni `x = 0` bor ustunda chaqirib `ValueError` olish', 'Calling math.log(x) on Columns Containing Zeros', `# math.log(0) raises ValueError: math domain error!`, 'ValueError: math domain error', `import math\nprint("Always use math.log1p(x) ->", round(math.log1p(0), 2))`, 'Noldan boshlanuvchi ustunlarda doim `math.log1p(x)` (`ln(1+x)`) ishlating.', 'Always use `log1p(x)` (`log(1 + x)`) when `0` values can occur.', '`log1p` ishlating.', 'Use `log1p`.'),
      mistake('Pivot jadvalda bo‘sh kataklarni `0` bilan to‘ldirmay `NaN + 10 = NaN` chiqarish', 'Leaving NaN Cells Unfilled in Pivot Tables', `# Adding across pivot columns with NaN cells turns row totals into NaN!`, 'NaN propagation across totals', `print("Pass fill_value=0 when creating pivot tables for counts/revenues!")`, 'Yig‘indi/son jadvallarida `fill_value=0` qo‘ying.', 'Fill absent pivot cells with `0` for count and revenue summaries.', '`fill_value=0` bering.', 'Set `fill_value=0`.'),
    ],
    compareTitleUz: 'Min-Max `[0, 1]` vs Z-Score vs `log1p`',
    compareTitleEn: 'Min-Max vs Z-Score vs Log1p',
    compareUz: ['Min-Max: barcha qiymatlarni qatʼiy `[0, 1]` ga siqadi (outlierlarga sezgir!).', 'Z-Score: o‘rtacha `0`, std `1` (normal taqsimot va chiziqli/neyron modellar uchun).', '`log1p`: kuchli o‘ngga cho‘zilgan daromad/narx taqsimotini muvozanatlashtiradi.'],
    compareEn: ['Min-Max: bounded `[0, 1]` scaling; sensitive to outliers.', 'Z-Score: zero-mean unit-variance standardization.', '`log1p`: compresses right-skewed positive metrics safely.'],
    compareSummaryUz: 'Ustunlarni muammoga mos ravishda Min-Max/Z-score/`log1p` bilan masshtablang, sanalardan calendar belgilarni ajrating va `fill_value=0` bilan pivot qiling.',
    compareSummaryEn: 'Apply Min-Max, Z-score, or `log1p` appropriately, derive weekend/month features from dates, and pivot long logs with `fill_value=0`.',
    practiceTasks: [
      pt('p1606_1', '1-mashq: Min-Max Scaling', 'Task 1: Min-Max Scale', '`[10, 20, 30]` ni `[0.0, 0.5, 1.0]` ga o‘giring.', 'Scale to [0, 1].', `xs = [10, 20, 30]\nmn, mx = min(xs), max(xs)\nprint([(x - mn) / (mx - mn) for x in xs])`, '[0.0, 0.5, 1.0]', '(x - min) / (max - min)', 'Prints [0.0, 0.5, 1.0].'),
      pt('p1606_2', '2-mashq: `math.log1p` Xavfsiz Log', 'Task 2: Safe log1p', '`[0, 9]` uchun `round(math.log1p(x), 2)` hisoblang.', 'Compute log1p.', `import math\nprint([round(math.log1p(x), 2) for x in (0, 9)])`, '[0.0, 2.3]', 'math.log1p', 'Prints [0.0, 2.3].'),
      pt('p1606_3', '3-mashq: Weekend Aniqlash', 'Task 3: Weekend Detector', '`"2026-05-17"` (Yakshanba) va `"2026-05-18"` (Dushanba) uchun `is_weekend` chiqaring.', 'Check weekend.', `from datetime import date\nprint([date.fromisoformat(s).weekday() >= 5 for s in ("2026-05-17", "2026-05-18")])`, '[True, False]', 'weekday() >= 5', 'Prints [True, False].'),
      pt('p1606_4', '4-mashq: Binning (Low / Mid / High)', 'Task 4: Discretize Scores', '`[45, 75, 95]` ni `<60 -> Low`, `<85 -> Mid`, else `High` qiling.', 'Bin scores.', `def b(s): return "Low" if s < 60 else ("Mid" if s < 85 else "High")\nprint([b(x) for x in (45, 75, 95)])`, "['Low', 'Mid', 'High']", 'Tiered conditional', "Prints ['Low', 'Mid', 'High']."),
      pt('p1606_5', '5-mashq: One-Hot Encoding (Manual)', 'Task 5: One-Hot Map', '`["red", "blue"]` dan `{"red": 1, "blue": 0}` vektor yasang.', 'One-hot encode.', `cats = ("red", "blue")\nprint([{c: int(x == c) for c in cats} for x in ("red", "blue")])`, "[{'red': 1, 'blue': 0}, {'red': 0, 'blue': 1}]", 'Compare equality -> int', 'Prints one-hot dicts.'),
    ],
    quiz: [
      q('q1606_1', 'Qiymatlari `0` dan boshlanadigan kuchli o‘ngga cho‘zilgan narxlar ustuniga qaysi log funksiyasi xavfsiz?', 'Log transform safe when columns include `0`?', ['math.log(x)', 'math.log1p(x) (`ln(1 + x)`)', 'x ** 0', 'abs(x)'], ['math.log(x)', 'math.log1p(x) (`ln(1 + x)`)', 'x ** 0', 'abs(x)'], 1, '`math.log1p(x)`.', '`math.log1p(x)`.'),
      q('q1606_2', 'Z-Score standartlashtirish (`(x - mean) / std`) dan keyin ustunning o‘rtacha qiymati nechaga teng bo‘ladi?', 'Mean of a column after Z-Score standardization?', ['1', '0', '0.5', '100'], ['1', '0', '0.5', '100'], 1, '`0` (standart og‘ishi esa `1`).', '`0`.'),
      q('q1606_3', 'Pandas da `pd.cut` va `pd.qcut` orasidagi farq?', 'Difference between `pd.cut` and `pd.qcut`?', ['Bir xil', '`cut` teng kenglikdagi oraliqlarga, `qcut` esa teng elementlar soniga (kvantil) bo‘ladi', 'cut faqat matn', 'qcut sekin'], ['Same', '`cut` creates equal-width intervals; `qcut` creates equal-count quantile buckets', 'Text only', 'Slow'], 1, 'Teng kenglik vs teng sonli kvantillar.', 'Equal-width vs equal-frequency buckets.'),
      q('q1606_4', 'Python `date.weekday()` dam olish kunlari (Shanba, Yakshanba) uchun qaysi qiymatlarni qaytaradi?', 'Values returned by Python `date.weekday()` for Saturday and Sunday?', ['0, 1', '5, 6', '6, 7', '-1, 0'], ['0, 1', '5, 6', '6, 7', '-1, 0'], 1, '`5` (Shanba) va `6` (Yakshanba).', '`5` and `6`.'),
      q('q1606_5', 'Long jadvaldan Wide Pivot jadval yasaganda bo‘sh kataklarga `NaN` o‘rniga nol qo‘yish parametri?', 'Pivot table argument replacing missing cross-tab cells with `0`?', ['default=0', 'fill_value=0', 'zero=True', 'na=0'], ['default=0', 'fill_value=0', 'zero=True', 'na=0'], 1, '`fill_value=0`.', '`fill_value=0`.'),
    ],
    homework: hw('Feature Engineering & Pivot Transformer', 'Tabular Feature Engineering Pipeline', 'Xom tranzaksiya jadvalidan Min-Max normalizatsiya, `log1p(amount)`, ISO sanadan `month` + `is_weekend`, xarajat darajasi (`Low/Mid/High` binning) va `(city x month)` Pivot jadvalini yasovchi transformator tuzing.', 'Build a transformer deriving Min-Max & `log1p` scales, calendar features (`month`, `is_weekend`), spend tiers, and a `fill_value=0` `(city x month)` pivot table.', ['Scaling + Binning + Date features', 'Long -> Wide Pivot matrix'], ['Scaling + Binning + Dates', 'Pivot matrix'], 'Avoid division by zero in Min-Max when max == min.', 'Solid feature transformer.', 'Keyingi qismda Matplotlib/Seaborn vizualizatsiya va Statistik tahlilga o‘tamiz.', 'Analyze & visualize next.', 20),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),
];
