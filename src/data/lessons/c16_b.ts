import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C16_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-16-07',
    courseId: 'data_science',
    moduleId: 'c16_m2',
    order: 7,
    titleUz: 'Data Analysis — Agregatsiya, Rolling Windows, Ranking va Cohort Tahlili',
    titleEn: 'Data Analysis: Multi-Key Aggregation, Rolling Windows, Ranking & Cohorts',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-16-06'],
    conceptId: 'ds_analysis',
    whyUz: "Jadvalni tozalash va masshtablash tayyorgarlik xolos — haqiqiy qiymat **tahlil** dan chiqadi! Biznes rahbarlari doim 4 ta savol beradi: eng ko‘p daromad keltirayotgan segmentlar (**Top-N & Pareto 80/20**), kunlik shovqinni yumshatuvchi tendensiya (**Rolling Moving Average**), o‘tgan oyga nisbatan o‘sish (**MoM / YoY Delta**) va mijozlarning qayta qaytishi (**Cohort Retention**).",
    whyEn: 'Turn clean tables into executive business insights: multi-dimensional aggregations, 7-day rolling averages to smooth noise, period-over-period growth deltas, Pareto 80/20 contribution shares, and user cohort retention matrices.',
    analogyUz: "**Rolling Window (sirpanuvchi oyna)** — avtomobil spidometriga o‘xshaydi: 1 soniyalik sakrashga emas, oxirgi 7 kunlik o‘rtacha tezlikka qarab haqiqiy yo‘nalishni ko‘rasiz!",
    analogyEn: 'A rolling average works like a smooth speedometer rather than jumpy instant GPS pings—averaging trailing windows reveals the true underlying trend.',
    stopsUz: "Data Analysis da 3 ta klassik tuzoq: 1) **Simpson Paradox**: umumiy o‘rtacha ijobiy ko‘rinishi mumkin, lekin har bir segment ichida pasayish bo‘lishi mumkin — doim segmentlar bo‘yicha kesib tekshiring! 2) **O‘rtachaning o‘rtachasini olish (Mean of Means)**: har xil o‘lchamdagi guruhlar o‘rtachasini oddiy qo‘shib bo‘lish xato — doim **weighted average** (`sum(revenue) / sum(orders)`) hisoblang! 3) Rolling oynaning birinchi `k-1` kunida to‘liq oyna yo‘qligini (`min_periods`) belgilang.",
    stopsEn: 'Beware Simpson’s Paradox (aggregated trends reversing inside segments), never average group averages without weighting (`total_sum / total_count`), and handle partial boundaries on rolling windows explicitly.',
    objUz: ['Multi-key segmentatsiya va Pareto (80/20) ulush hisoblash', 'Rolling Moving Average (sirpanuvchi oyna) va Period-over-Period (%) o‘sish', 'Weighted Average vs Mean of Means xatosi hamda Cohort Retention matritsasi'],
    objEn: ['Compute segment contribution shares and Pareto rankings', 'Calculate trailing rolling averages and period-over-period percentage growth', 'Avoid unweighted mean-of-means traps and build cohort retention summaries'],
    theoryUz: `### 1. Pareto (Ulush va Kumulyativ %)
Har bir mahsulot daromadini jami daromadga bo‘lib (\`share %\`) kamayish tartibida saralasangiz, ko‘pincha 20% tovar 80% daromad beradi.
### 2. Rolling Window & Delta (%)
\`rolling_3[i] = sum(xs[i-2:i+1]) / 3\`; o‘sish: \`(new - old) / old * 100\`.
### 3. Weighted Average vs Unweighted
Guruh A (100 buyurtma, $10) va B (2 buyurtma, $100) o‘rtachasi \`(10+100)/2 = $55\` EMAS! Haqiqiy AOV = \`(1000+200)/102 = $11.76\`!`,
    theoryEn: `### 1. Contribution Shares & Cumulative Pareto
Sort segments descending by revenue share and track cumulative percentage to isolate top growth drivers.
### 2. Rolling Windows & Growth Deltas
Smooth spiky daily metrics with trailing moving averages and quantify change via \`(curr - prev) / prev\`.
### 3. Weighted Averages (Avoiding Mean-of-Means)
Always aggregate numerators and denominators separately before dividing across unequal group sizes.`,
    examples: [
      ex('Misol 1: 3-Kunlik Rolling Average & O‘sish (%)', 'Example 1: 3-Day Rolling Average & Period Growth', `sales = [100, 120, 140, 180]
rolling = [round(sum(sales[i - 2 : i + 1]) / 3, 1) for i in range(2, len(sales))]
pct_change = [round((sales[i] - sales[i - 1]) / sales[i - 1] * 100, 1) for i in range(1, len(sales))]
print("Rolling-3:", rolling)
print("Daily % :", pct_change)`, `Rolling-3: [120.0, 146.7]\nDaily % : [20.0, 16.7, 28.6]`, 'Rolling oyna kunlik tebranishlarni yumshatdi, `pct_change` esa har kunlik o‘sish foizini ko‘rsatdi.', 'Computes trailing 3-day moving averages and day-over-day growth rates.'),
      ex('Misol 2: Weighted Average (Mean-of-Means Xatosini Tuzatish)', 'Example 2: True Weighted Average vs Naive Group Mean', `groups = [{"orders": 100, "rev": 1000}, {"orders": 2, "rev": 200}]
naive_avg = sum(g["rev"] / g["orders"] for g in groups) / len(groups)
true_aov = round(sum(g["rev"] for g in groups) / sum(g["orders"] for g in groups), 2)
print("Naive (WRONG):", naive_avg, "| True Weighted AOV:", true_aov)`, `Naive (WRONG): 55.0 | True Weighted AOV: 11.76`, 'Guruh o‘rtachalarini oddiy bo‘lish `$55` deb aldaydi; haqiqiy o‘rtacha chek `$11.76`.', 'Prevents unweighted mean-of-means distortion across unequal sample counts.'),
      ex('Misol 3: Top-N Ranking va Kumulyativ Ulush (%)', 'Example 3: Top Categories & Cumulative Share', `rev = [("Phones", 500), ("Laptops", 300), ("Cases", 200)]
total = sum(v for _, v in rev)
cum = 0
report = []
for name, val in rev:
    cum += val
    report.append((name, round(val / total * 100, 1), round(cum / total * 100, 1)))
print(report)`, `[('Phones', 50.0, 50.0), ('Laptops', 30.0, 80.0), ('Cases', 20.0, 100.0)]`, 'Ikki kategoriya (Phones + Laptops) jami daromadning 80% ini ta’minlamoqda.', 'Calculates individual and cumulative Pareto revenue contribution percentages.'),
    ],
    traceTitleUz: 'Rolling Window & Weighted AOV Trace',
    traceTitleEn: 'Tracing Rolling & Weighted Aggregations',
    traceCode: `sales=[100,120,140] -> rolling=(100+120+140)/3`,
    traceSteps: [
      traceStep(1, 'Slice window [0:3]', '[100, 120, 140]', '3 kunlik oyna olindi', 'Selected 3-element window'),
      traceStep(2, 'Mean', '120.0', 'Sirpanuvchi o‘rtacha hisoblandi', 'Computed window average'),
    ],
    commonMistakes: [
      mistake('Guruhlar o‘rtachasining o‘rtachasini (Mean of Means) olish', 'Averaging Pre-Aggregated Group Means Directly', `# Averaging city averages treats a 2-order town equally with a 10,000-order metropolis!`, 'Severely distorted KPIs', `print("Always recompute sum(total_rev) / sum(total_orders) for global averages!")`, 'Umumiy o‘rtacha uchun jami suratni jami maxrajga bo‘ling.', 'Sum numerators and denominators separately rather than averaging averages.', 'Weighted average ishlating.', 'Use weighted averages.'),
      mistake('Oldingi davr `prev == 0` bo‘lganda `% o‘sish` da `ZeroDivisionError` olish', 'Dividing by Zero in Growth Rate Calculations', `# (curr - 0) / 0 crashes automated KPI jobs whenever a new product had 0 prior sales!`, 'ZeroDivisionError in analytics job', `def safe_growth(curr, prev): return None if prev == 0 else (curr - prev) / prev\nprint("Safe growth when prev=0:", safe_growth(50, 0))`, 'Maxraj nol bo‘lsa `None` yoki `inf` guard qo‘ying.', 'Guard against `prev == 0` in percentage-change calculations.', 'Nolga bo‘lishdan himoyalaning.', 'Guard zero denominators.'),
    ],
    compareTitleUz: 'Period Comparison vs Rolling Window vs Cohort Analysis',
    compareTitleEn: 'Analytical Techniques Compared',
    compareUz: ['MoM / YoY Delta: ikki davr orasidagi tez o‘sish/tushish sur’atini o‘lchaydi.', 'Rolling Window: kunlik shovqinni tekislab asosiy trendni ko‘rsatadi.', 'Cohort Analysis: bir vaqtda kirgan mijozlar guruhi keyingi oylarda necha % qolganini ochadi.'],
    compareEn: ['Period Delta: quantifies MoM/YoY velocity.', 'Rolling Window: smooths short-term noise into clean trend lines.', 'Cohort Retention: tracks repeat engagement by signup cohort over time.'],
    compareSummaryUz: 'Segmentlar kesimida kumulyativ ulush, rolling trend va vaznli (weighted) o‘rtachalardan foydalaning; Simpson paradoksiga chalg‘imang.',
    compareSummaryEn: 'Combine segment shares, rolling averages, cohort retention, and weighted denominators while checking subgroup trends.',
    practiceTasks: [
      pt('p1607_1', '1-mashq: 2-Kunlik Rolling Average', 'Task 1: Rolling-2 Mean', '`[10, 20, 30, 50]` uchun 2-elementli rolling o‘rtachalar chiqaring.', 'Compute 2-period rolling mean.', `xs = [10, 20, 30, 50]\nprint([(xs[i-1] + xs[i]) / 2 for i in range(1, len(xs))])`, '[15.0, 25.0, 40.0]', 'Average pairs', 'Prints [15.0, 25.0, 40.0].'),
      pt('p1607_2', '2-mashq: O‘sish Foizi (Growth %)', 'Task 2: Safe Growth Rate', '`80` dan `100` ga o‘sish necha foiz?', 'Compute % growth.', `print(round((100 - 80) / 80 * 100, 1))`, '25.0', '(new - old) / old * 100', 'Prints 25.0.'),
      pt('p1607_3', '3-mashq: Weighted Average', 'Task 3: Weighted Score', '(vazn=3, ball=90) va (vazn=1, ball=50) ning vaznli o‘rtachasini toping.', 'Compute weighted mean.', `print((3 * 90 + 1 * 50) / (3 + 1))`, '80.0', 'sum(w*x)/sum(w)', 'Prints 80.0.'),
      pt('p1607_4', '4-mashq: Top-2 Mahsulotni Ajratish', 'Task 4: Top-2 Ranking', '`{"A": 40, "B": 90, "C": 70}` dan eng katta 2 tasini chiqaring.', 'Extract top 2 keys.', `d = {"A": 40, "B": 90, "C": 70}\nprint(sorted(d, key=d.get, reverse=True)[:2])`, "['B', 'C']", 'Sort descending slice [:2]', "Prints ['B', 'C']."),
      pt('p1607_5', '5-mashq: Cohort Retention %', 'Task 5: Retention Rate', 'Yanvar kohortasida 200 mijozdan 2-oyda 70 tasi qaytsa retention % qancha?', 'Compute retention %.', `print(round(70 / 200 * 100, 1))`, '35.0', 'active / cohort_size * 100', 'Prints 35.0.'),
    ],
    quiz: [
      q('q1607_1', 'Umumiy jadvalda ijobiy ko‘ringan trend ichki kichik segmentlarning har birida teskari salbiy bo‘lib chiqishi nima deyiladi?', 'Phenomenon where subgroup trends reverse when combined into a single aggregate?', ['Overfitting', 'Simpson’s Paradox', 'Normalization', 'Broadcasting'], ['Overfitting', 'Simpson’s Paradox', 'Normalization', 'Broadcasting'], 1, 'Simpson Paradoksi.', 'Simpson’s Paradox.'),
      q('q1607_2', 'Turli hajmdagi shaharlarning umumiy o‘rtacha chekini hisoblashning TO‘G‘RI yo‘li?', 'Correct way to compute global Average Order Value across unequally sized cities?', ['Shahar o‘rtachalarini qo‘shib shaharlar soniga bo‘lish', 'Jami daromadni jami buyurtmalar soniga bo‘lish (Weighted Average)', 'Median', 'Max'], ['Average city AOVs', 'Divide total global revenue by total global orders (Weighted Average)', 'Median', 'Max'], 1, 'Vaznli o‘rtacha (`sum(rev)/sum(cnt)`).', 'Weighted ratio of global totals.'),
      q('q1607_3', 'Kunlik savdodagi tasodifiy shovqinni yumshatib asosiy yo‘nalishni ko‘rsatuvchi usul?', 'Method smoothing noisy daily time-series fluctuations to show the underlying trend?', ['Sorting', 'Rolling / Moving Average', 'One-Hot Encoding', 'Hashing'], ['Sorting', 'Rolling / Moving Average', 'One-Hot Encoding', 'Hashing'], 1, 'Rolling Moving Average.', 'Rolling / Moving Average.'),
      q('q1607_4', 'Birinchi 20% mahsulot umumiy daromadning ~80% ini berishi tahlilda nima deb ataladi?', 'Principle where roughly 20% of items drive 80% of outcomes?', ['Binary Search', 'Pareto Principle (80/20)', 'Big O', 'CRUD'], ['Binary Search', 'Pareto Principle (80/20)', 'Big O', 'CRUD'], 1, 'Pareto qoidasi.', 'Pareto Principle.'),
      q('q1607_5', 'Yanvar oyida ro‘yxatdan o‘tgan foydalanuvchilarning 1, 2, 3-oylarda necha foizi faol qolganini o‘lchaydigan tahlil?', 'Analysis tracking repeat activity over time grouped by user signup period?', ['Linear Regression', 'Cohort Retention Analysis', 'Web Scraping', 'Unit Testing'], ['Linear Regression', 'Cohort Retention Analysis', 'Web Scraping', 'Unit Testing'], 1, 'Cohort Retention Analysis.', 'Cohort Retention Analysis.'),
    ],
    homework: hw('E-Commerce Rolling, Pareto & Cohort Engine', 'Business Analytics KPI & Cohort Suite', 'Kunlik savdo ketma-ketligidan 3-kunlik rolling average, MoM o‘sish %, Pareto Top-N mahsulot ulushi va foydalanuvchi kohortasi retention foizini hisoblovchi analitik modul yarating.', 'Build an analytical suite computing 3-day moving averages, safe growth deltas, cumulative Pareto product revenue shares, and signup cohort retention rates.', ['Rolling + Growth% + Pareto', 'Cohort retention matrix'], ['Rolling + Growth + Pareto', 'Cohort matrix'], 'Handle `prev == 0` gracefully and always weight global ratios by count.', 'Executive-grade analytics module.', 'Keyingi darsda natijalarni Matplotlib bilan chizamiz!', 'Visualize metrics next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-16-08',
    courseId: 'data_science',
    moduleId: 'c16_m3',
    order: 8,
    titleUz: 'Matplotlib — OOP (`fig, ax`) API, Grafik Turlari va Professional Bezash',
    titleEn: 'Matplotlib: Figure/Axes OOP Architecture, Chart Types & Visual Hygiene',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-16-07'],
    conceptId: 'ds_matplotlib',
    whyUz: "Bir qarashdagi yaxshi grafik 1000 qator jadvaldan tezroq tushuniladi! **Matplotlib** Python ning barcha grafik kutubxonalarining (Seaborn, Pandas `.plot()`) asosiy dvigatelidir. Eng muhim sir: tez-tez chalg‘ituvchi `plt.plot()` o‘rniga **OOP (`fig, ax = plt.subplots()`)** API dan foydalanish va har doim o‘q nomlari, birliklar hamda to‘g‘ri grafik turini tanlash!",
    whyEn: 'Master Matplotlib’s object-oriented `Figure` / `Axes` API: selecting the right chart (line for time, bar for categories, histogram for distributions, scatter for pairs), customizing ticks/legends/annotations, and avoiding 3D/truncated-axis distortion.',
    analogyUz: "**`Figure`** — bu butun rasm ramkasi (A4 varaq), **`Axes`** esa uning ichidagi bitta grafik katagi (koordinata o‘qlari bilan). Bitta `Figure` ichida 2x2 ta `Axes` (subplot) joylash mumkin!",
    analogyEn: 'A `Figure` is the entire canvas sheet; each `Axes` is an individual plot frame with its own x/y axes, title, and data.',
    stopsUz: "Matplotlib da 3 ta professional standart: 1) **`plt.plot()` (Pyplot global state) emas, `fig, ax = plt.subplots(figsize=(8, 4))`** (OOP API) yozing — ko‘p grafikli dashboardlarda adashmaysiz! 2) **Bar chart Y-o‘qini 0 dan boshlang** (aks holda 98 vs 100 ustunlar 10x farqli ko‘rinib yolg‘on tasavvur beradi!). 3) Har bir grafikda aniq **Sarlavha (`ax.set_title`)**, **Birlikli o‘q nomlari (`xlabel`, `ylabel`)** va **`fig.tight_layout()`** bo‘lsin (sandboxda biz SVG/ASCII chart + Matplotlib chart spec builder bilan mashq qilamiz!).",
    stopsEn: 'Always prefer `fig, ax = plt.subplots()` over global `plt.*` state, keep bar-chart baselines at zero to prevent visual exaggeration, and label units clearly.',
    objUz: ['`Figure` vs `Axes` arxitekturasi va `fig, ax = plt.subplots(nrows, ncols)`', '4 asosiy grafik: Line (vaqt), Bar (kategoriya), Histogram (taqsimot), Scatter (bog‘liqlik)', 'Visual Hygiene: zero-baseline bar charts, `dpi=300`, `tight_layout()`, SVG/ASCII plot rendering'],
    objEn: ['Use the Matplotlib OOP `Figure` / `Axes` API cleanly', 'Match chart types to data semantics (Line, Bar, Histogram, Scatter)', 'Apply visual hygiene: zero bar baselines, clear units, non-overlapping labels'],
    theoryUz: `### 1. OOP API (\`fig, ax = plt.subplots()\`)
\`\`\`python
fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(months, revenue, marker="o", label="2026")
ax.set_title("Oylik Daromad ($)")
ax.set_xlabel("Oy"); ax.set_ylabel("USD")
ax.legend(); fig.tight_layout()
fig.savefig("revenue.png", dpi=300)
\`\`\`
### 2. Qaysi Grafik Qachon?
- **Line**: Vaqt davomidagi trend (\`Jan..Dec\`).
- **Bar / Horizontal Bar**: Kategoriyalarni taqqoslash (\`Toshkent vs Samarqand\`).
- **Histogram**: Bitta sonli ustunning taqsimot shakli (binlar).
- **Scatter**: Ikki uzluksiz son orasidagi korrelyatsiya (\`area vs price\`).`,
    theoryEn: `### 1. The OOP \`Figure\` / \`Axes\` Pattern
Call \`fig, ax = plt.subplots()\` and invoke methods directly on \`ax\` (\`ax.plot\`, \`ax.set_title\`, \`ax.set_xlabel\`), finishing with \`fig.tight_layout()\`.
### 2. Chart Selection Matrix
- **Line**: Time trends.
- **Bar**: Categorical comparisons (zero baseline required!).
- **Histogram**: Single numeric distribution binned into intervals.
- **Scatter**: Bivariate relationships & outliers.`,
    examples: [
      ex('Misol 1: Pure-Python Bar Chart Renderer (Zero-Baseline Proportsiya)', 'Example 1: Proportional Horizontal Bar Chart Renderer', `data = [("Toshkent", 400), ("Samarqand", 250), ("Buxoro", 150)]
mx = max(v for _, v in data)
for city, val in data:
    bars = "#" * round(val / mx * 16)
    print(f"{city:<10} | {bars:<16} {val}")`, `Toshkent   | ################ 400\nSamarqand  | ##########       250\nBuxoro     | ######           150`, 'Har bir ustun uzunligi `0` dan proporsional hisoblandi — bu halol vizual taqqoslash beradi.', 'Renders zero-baselined proportional bars ensuring truthful visual magnitude comparison.'),
      ex('Misol 2: Histogram Binning (Taqsimotni Intervalga Bo‘lish)', 'Example 2: Computing Histogram Bins & Frequencies', `scores = [52, 58, 63, 71, 74, 78, 85, 92, 95]
bins = {"50-69": 0, "70-89": 0, "90-100": 0}
for s in scores:
    key = "50-69" if s < 70 else ("70-89" if s < 90 else "90-100")
    bins[key] += 1
print("Histogram counts:", bins)`, `Histogram counts: {'50-69': 3, '70-89': 4, '90-100': 2}`, 'Histogram sonlarni teng oraliq qutilarga (bins) joylab chastotasini sanaydi.', 'Bins continuous scores into intervals to show distribution density.'),
      ex('Misol 3: `Figure` + `Axes` Matplotlib Plot Spec & SVG Generatori', 'Example 3: Matplotlib-Style Figure/Axes Config & SVG Line', `class Axes:
    def __init__(self, title):
        self.title, self.series = title, []
    def plot(self, x, y, label):
        self.series.append((label, list(zip(x, y))))
    def spec(self):
        return {"title": self.title, "series": self.series}

ax = Axes("Oylik Savdo")
ax.plot(["Jan", "Feb", "Mar"], [10, 15, 22], label="USD_k")
print(ax.spec())`, `{'title': 'Oylik Savdo', 'series': [('USD_k', [('Jan', 10), ('Feb', 15), ('Mar', 22)])]}`, '`Axes` obyekti grafik sarlavhasi va ma’lumot seriyasini kapsulalaydi.', 'Demonstrates Matplotlib OOP `Axes` composition collecting titled series.'),
    ],
    traceTitleUz: 'Figure -> Axes -> Labels -> Save Trace',
    traceTitleEn: 'Tracing Matplotlib OOP Workflow',
    traceCode: `fig, ax = subplots() -> ax.bar() -> tight_layout()`,
    traceSteps: [
      traceStep(1, 'subplots()', 'Figure + Axes', 'Varaq va o‘q katagi yaratildi', 'Created canvas & plot frame'),
      traceStep(2, 'ax.bar() + set_title', 'labeled plot', 'Grafik va nomlar qo‘shildi', 'Drew bars & set labels'),
      traceStep(3, 'tight_layout() + savefig', '300 DPI PNG/SVG', 'Matnlar ustma-ust tushmadi', 'Avoided clipped text & exported'),
    ],
    commonMistakes: [
      mistake('Bar Chart Y-o‘qini `0` o‘rniga `95` dan boshlab farqni sunʼiy kattalashtirish', 'Truncating Bar Chart Y-Axis Baseline Away From Zero', `# Setting ax.set_ylim(98, 102) makes 101 look 3x taller than 99—a classic misleading chart!`, 'Deceptive visual distortion', `print("Keep Bar chart Y-axes starting at 0; use Line charts with zoomed scales if small deltas matter!")`, 'Bar chart larda doim `0` chizig‘idan boshlang.', 'Bar lengths encode total magnitude from zero; truncate baselines only on line charts when annotated.', 'Bar o‘qini 0 dan boshlang.', 'Start bar charts at 0.'),
      mistake('Ko‘p kategoriyali pie chart (12 bo‘lak) chizish', 'Using Pie Charts for Many Similar Categories', `# Human eyes cannot compare 12 pie slice angles accurately; sorted horizontal bars are much clearer!`, 'Unreadable cluttered visuals', `print("Prefer sorted horizontal bar charts (barh) whenever comparing >3 categories!")`, '3 tadan ko‘p kategoriya uchun tartiblangan gorizontal `barh` chizing.', 'Replace multi-slice pie charts with sorted horizontal bar charts (`ax.barh`).', 'Saralangan `barh` ishlating.', 'Use sorted `barh`.'),
    ],
    compareTitleUz: 'Line vs Bar vs Histogram vs Scatter',
    compareTitleEn: 'Choosing the Right Chart Type',
    compareUz: ['Line: vaqt bo‘yicha uzluksiz o‘zgarish.', 'Bar / Barh: diskret kategoriyalarni solishtirish.', 'Histogram: bitta o‘zgaruvchining taqsimot zichligi.', 'Scatter: ikkita raqamli o‘zgaruvchi bog‘liqligi.'],
    compareEn: ['Line: trends over continuous time.', 'Bar: discrete category magnitudes.', 'Histogram: numeric frequency distribution.', 'Scatter: bivariate correlation & outliers.'],
    compareSummaryUz: 'OOP `fig, ax = plt.subplots()` dan foydalaning, ma’lumot turiga mos grafik tanlang, bar o‘qini 0 dan boshlang va barcha o‘qlarni birliklari bilan nomlang.',
    compareSummaryEn: 'Build charts via `fig, ax = plt.subplots()`, match chart types to data, honor zero baselines for bars, and label all axes with units.',
    practiceTasks: [
      pt('p1608_1', '1-mashq: Proportional Bar Satrlari', 'Task 1: Scale Bar Widths', '`max_val=100`, kenglik `10` da `50` va `100` uchun `*` uzunligini chiqaring.', 'Compute bar strings.', `print(["*" * round(v / 100 * 10) for v in (50, 100)])`, "['*****', '**********']", 'round(v/max*width)', 'Prints scaled bars.'),
      pt('p1608_2', '2-mashq: Histogram Bin Hisobi', 'Task 2: Count Bin Frequencies', '`[5, 12, 18, 25]` dan `<15` va `>=15` binlarini sanang.', 'Count 2 bins.', `xs = [5, 12, 18, 25]\nprint({"<15": sum(x < 15 for x in xs), ">=15": sum(x >= 15 for x in xs)})`, "{'<15': 2, '>=15': 2}", 'Sum booleans per bin', 'Prints bin counts.'),
      pt('p1608_3', '3-mashq: Scatter Koordinata Juftliklari', 'Task 3: Pair X & Y Coordinates', '`x=[1, 2]` va `y=[10, 25]` dan nuqtalar ro‘yxatini yasang.', 'Zip x and y.', `print(list(zip([1, 2], [10, 25])))`, '[(1, 10), (2, 25)]', 'zip(x, y)', 'Prints coordinate pairs.'),
      pt('p1608_4', '4-mashq: Min-Max SVG Y-Koordinata Mapping', 'Task 4: Map Value to SVG Y', 'Balandlik `100` da qiymat `0 -> y=100`, `max=50 -> y=0` mapping yozing (25 -> 50.0).', 'Invert Y for SVG canvas.', `def svg_y(val, mx, h=100): return round(h - (val / mx) * h, 1)\nprint(svg_y(25, 50))`, '50.0', 'h - (val / mx) * h', 'Prints 50.0.'),
      pt('p1608_5', '5-mashq: Grafik Turini Tanlash', 'Task 5: Pick Optimal Chart Type', '`"over_time"` -> `"line"`, `"distribution"` -> `"hist"`, boshqa -> `"bar"`.', 'Map task to chart type.', `def pick(t): return {"over_time": "line", "distribution": "hist"}.get(t, "bar")\nprint(pick("over_time"), pick("distribution"))`, 'line hist', 'Lookup dictionary', 'Prints line hist.'),
    ],
    quiz: [
      q('q1608_1', 'Matplotlib da professional ko‘p-grafikli kod yozishning tavsiya etilgan OOP usuli?', 'Recommended OOP Matplotlib pattern creating canvas and plot frame?', ['plt.plot() global', 'fig, ax = plt.subplots()', 'plot.make()', 'canvas.open()'], ['plt.plot()', 'fig, ax = plt.subplots()', 'plot.make()', 'canvas.open()'], 1, '`fig, ax = plt.subplots()`.', '`fig, ax = plt.subplots()`.'),
      q('q1608_2', 'Bitta raqamli ustunning (masalan imtihon ballari) taqsimot shaklini ko‘rish uchun qaysi grafik chiziladi?', 'Best chart type for visualizing the distribution of a single numeric variable?', ['Pie chart', 'Histogram', 'Line chart', 'Radar'], ['Pie chart', 'Histogram', 'Line chart', 'Radar'], 1, 'Histogram.', 'Histogram.'),
      q('q1608_3', 'Nima uchun Bar chart da Y-o‘qini 0 dan boshlash muhim?', 'Why must bar charts start their numeric baseline at 0?', ['Xotira tejaydi', 'Ustun uzunliklari miqdorlarni yolg‘on kattalashtirmasdan halol solishtirishi uchun', 'Rang chiroyli', 'SVG sharti'], ['Saves RAM', 'Bar lengths visually encode magnitude; non-zero baselines distort ratios misleadingly', 'Color', 'SVG rule'], 1, 'Vizual halollik uchun.', 'Honest magnitude comparison.'),
      q('q1608_4', 'Ikki o‘zgaruvchi (`uy maydoni` vs `uy narxi`) orasidagi bog‘liqlik va outlierlarni ko‘rsatuvchi grafik?', 'Chart plotting paired points to reveal correlation and outliers?', ['Bar', 'Scatter Plot', 'Pie', 'Treemap'], ['Bar', 'Scatter Plot', 'Pie', 'Treemap'], 1, 'Scatter Plot.', 'Scatter Plot.'),
      q('q1608_5', 'Grafik sarlavhalari va o‘q yozuvlari rasm chetida kesilib qolmasligi uchun chaqiriladigan Matplotlib metodi?', 'Matplotlib call preventing axis labels and titles from overlapping or clipping?', ['fig.clean()', 'fig.tight_layout()', 'ax.fix()', 'plt.crop()'], ['fig.clean()', 'fig.tight_layout()', 'ax.fix()', 'plt.crop()'], 1, '`fig.tight_layout()`.', '`fig.tight_layout()`.'),
    ],
    homework: hw('SVG & Terminal Chart Generator', 'Matplotlib-Style SVG & ASCII Visualizer', 'Kiritilgan kategoriya va vaqt seriyasi ma’lumotlaridan ham terminal ASCII `barh` grafigi, ham toza `<svg>` chizuvchi (`Axes` OOP API simulyatori) yozing.', 'Implement a lightweight OOP `Axes` chart generator producing zero-baselined terminal bar charts, histogram bins, and valid SVG polylines with axis titles.', ['OOP Axes + Barh + Histogram', 'SVG Polyline export'], ['OOP Axes + SVG + Barh', 'Zero-baseline labels'], 'Invert SVG Y coordinates (`height - scaled`) since SVG y=0 is at the top.', 'Clean visual abstraction.', 'Keyingi darsda Seaborn statistik vizualizatsiyasini o‘rganamiz.', 'Explore Seaborn next.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-16-09',
    courseId: 'data_science',
    moduleId: 'c16_m3',
    order: 9,
    titleUz: 'Seaborn — Statistik Vizualizatsiya, Boxplot, Correlation Heatmap va Faceting',
    titleEn: 'Seaborn: Statistical Plots, Boxplots, Heatmaps & Faceted Multi-Variables',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-16-08'],
    conceptId: 'ds_seaborn',
    whyUz: "Matplotlib har bir chiziqni qo‘lda bo‘yashni so‘raydi; **Seaborn (`sns`)** esa to‘g‘ridan-to‘g‘ri Pandas `DataFrame` ustun nomlari (`x='city'`, `y='price'`, `hue='plan'`) bilan ishlab, bir qatorda **Boxplot, Violinplot, KDE zichlik egri chizig‘i va Correlation Heatmap** chizib beradi!",
    whyEn: 'Use Seaborn on top of Matplotlib to visualize multi-dimensional Pandas DataFrames effortlessly: histograms with KDE, box/violin distributions across categories, correlation heatmaps, `hue`/`col` faceting, and colorblind-safe palettes.',
    analogyUz: "**Matplotlib** — bu bo‘yoq cho‘tkasi va xolst; **Seaborn** — tayyor ilmiy andozalar: birgina `hue='plan'` desangiz, barcha ranglar va legendani avtomatik chizadi!",
    analogyEn: 'Matplotlib provides raw drawing primitives; Seaborn adds DataFrame-aware statistical templates where `hue` and `col` split dimensions automatically.',
    stopsUz: "Seaborn da 3 ta professional bilim: 1) **Correlation Heatmap faqat chiziqli (Pearson `r`) bog‘liqlikni o‘lchaydi** — `r = 0` bo‘lsa ham `y = x²` kabi kuchli nochiziqli bog‘liqlik bo‘lishi mumkin! 2) **Boxplot median va `1.5*IQR` outlierlarni ochadi**, lekin **bimodal** (ikki tepali) taqsimotni yashiradi — shubha bo‘lsa **`violinplot` yoki `histplot(kde=True)`** bilan tekshiring! 3) Rang palitrasida **`viridis` / `colorblind`** tanlang (qizil-yashil ko‘rlikka mos!).",
    stopsEn: 'Remember correlation heatmaps detect only linear Pearson associations, boxplots hide bimodal peaks (check `violinplot`/`kde`), and `hue`/`col` let you slice multivariate views safely with colorblind-friendly palettes.',
    objUz: ['`histplot(kde=True)`, `boxplot` vs `violinplot`, va `sns.heatmap(corr, annot=True)`', 'Multivariate vizualizatsiya: `hue` (rang) va `FacetGrid` (`col` / `row`)', 'Colorblind-safe palitralar va Pearson Korrelyatsiya Matritsasini qo‘lda hisoblash'],
    objEn: ['Compare `histplot(kde=True)`, `boxplot`, `violinplot`, and `heatmap`', 'Encode extra dimensions cleanly with `hue` and `FacetGrid` (`col`/`row`)', 'Compute Pearson correlation matrices for numeric features'],
    theoryUz: `### 1. Taqsimot Grafiklari
- \`sns.histplot(df, x="price", hue="plan", kde=True)\` — taqsimot shakli va silliq egri chiziq.
- \`sns.boxplot(df, x="city", y="price")\` — Median, Q1–Q3 quti va outlier nuqtalari.
- \`sns.violinplot(...)\` — Boxplot + zichlik (ikki tepali taqsimotni yashirmaydi!).
### 2. Correlation Heatmap
\`corr = df.corr(numeric_only=True)\`; \`sns.heatmap(corr, annot=True, cmap="coolwarm", center=0)\` -> \`-1..+1\` oralig‘idagi bog‘liqlik xaritasi!
### 3. Faceting (\`sns.relplot(..., col="quarter", hue="region")\`)
Bitta chizmaga 6 ta chiziq tiqish o‘rniga kichik jadvalli oynalarga (\`Small Multiples\`) bo‘ling.`,
    theoryEn: `### 1. Distribution Plots
- \`histplot(..., kde=True)\`: binned counts + smooth density curve.
- \`boxplot\`: quartiles, median, and \`1.5 * IQR\` outliers.
- \`violinplot\`: reveals multimodal peaks hidden inside a simple box.
### 2. Correlation Heatmaps
Compute pairwise Pearson \`r\` in \`[-1, +1]\` and render \`sns.heatmap(corr, annot=True, center=0)\`.
### 3. Multivariate Faceting
Pass \`hue=\` for color grouping or \`col=\` (Small Multiples) to avoid spaghetti lines.`,
    examples: [
      ex('Misol 1: Pearson Korrelyatsiya Matritsasi (Heatmap Asosi)', 'Example 1: Computing Pairwise Pearson Correlation Matrix', `import math

def pearson(xs, ys):
    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
    num = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    den = math.sqrt(sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys))
    return round(num / den, 2) if den else 0.0

area = [50, 70, 90, 110]
price = [100, 140, 180, 220]
age = [30, 20, 10, 5]
print("r(area, price):", pearson(area, price), "| r(area, age):", pearson(area, age))`, `r(area, price): 1.0 | r(area, age): -0.99`, 'Maydon va narx kuchli musbat (`+1.0`), yosh bilan esa manfiy (`-0.99`) bog‘langan.', 'Computes Pearson `r` matrix values underlying `sns.heatmap(df.corr())`.'),
      ex('Misol 2: Boxplot Statistikasi (`min_fence`, `Q1`, `median`, `Q3`, `max_fence`)', 'Example 2: Five-Number Boxplot Summary', `vals = [10, 12, 14, 15, 18, 20, 22, 24]
q1, med, q3 = vals[2], (vals[3] + vals[4]) / 2, vals[6]
print({"Q1": q1, "Median": med, "Q3": q3, "IQR": q3 - q1})`, `{'Q1': 14, 'Median': 16.5, 'Q3': 22, 'IQR': 8}`, 'Seaborn `boxplot` aynan shu 5 ko‘rsatkich va `1.5*IQR` mo‘ylovlarini chizadi.', 'Extracts the quartiles and IQR underlying Seaborn boxplots.'),
      ex('Misol 3: `hue` & `col` Facet Guruhlash (Small Multiples)', 'Example 3: Grouping by Facet (`col`) & Hue', `from collections import defaultdict

rows = [("Q1", "Pro", 200), ("Q1", "Free", 50), ("Q2", "Pro", 250)]
facets = defaultdict(dict)
for qtr, plan, val in rows:
    facets[qtr][plan] = val
print("Faceted view:", dict(facets))`, `Faceted view: {'Q1': {'Pro': 200, 'Free': 50}, 'Q2': {'Pro': 250}}`, '`col="quarter"` har chorak uchun alohida panel, `hue="plan"` esa har panelda rang ajratadi.', 'Simulates `FacetGrid` small-multiples grouping by column facet and color hue.'),
    ],
    traceTitleUz: 'Correlation Heatmap Pipeline Trace',
    traceTitleEn: 'Tracing Seaborn Heatmap Pipeline',
    traceCode: `df.corr(numeric_only=True) -> heatmap(center=0)`,
    traceSteps: [
      traceStep(1, 'numeric_only=True', 'select float/int cols', 'Matn ustunlari chetlatildi', 'Excluded non-numeric columns'),
      traceStep(2, 'Pearson r', '[-1.0 .. +1.0]', 'Juftlik korrelyatsiyasi hisoblandi', 'Computed pairwise correlation'),
    ],
    commonMistakes: [
      mistake('`sns.heatmap` da `center=0` qo‘ymaslik (rang shkalasi adashtiradi)', 'Forgetting Diverging Center=0 on Correlation Heatmaps', `# Without center=0 and vmin=-1, vmax=1, r=0.0 can look bright red or dark blue!`, 'Misread correlation strengths', `print("Always pass vmin=-1, vmax=1, center=0, annot=True on correlation heatmaps!")`, '`corr` xaritada `vmin=-1, vmax=1, center=0, annot=True` bering.', 'Fix scale bounds (`vmin=-1, vmax=1, center=0`) so zero correlation always maps to neutral color.', '`center=0` qo‘ying.', 'Pass `center=0`.'),
      mistake('Bimodal taqsimotni faqat Boxplot bilan ko‘rib o‘rtadagi bo‘shliqni ko‘rmaslik', 'Relying Only on Boxplots When Data Is Bimodal', `# [10, 10, 90, 90] has median=50 even though almost NO observations occur near 50!`, 'Hidden bimodal peaks', `print("Verify boxplots with violinplot() or histplot(kde=True) to see distribution shape!")`, 'Shakl muhim bo‘lsa `violinplot` yoki `kde` bilan tekshiring.', 'Check shape via `violinplot` or `histplot(kde=True)` so multimodal clusters aren’t masked.', '`violinplot`/`kde` ko‘ring.', 'Check `violinplot`/`kde`.'),
    ],
    compareTitleUz: 'Matplotlib vs Seaborn',
    compareTitleEn: 'Matplotlib vs Seaborn',
    compareUz: ['Matplotlib: past darajali to‘liq nazorat, maxsus aniq grafiklar, `ax` sozlamalari.', 'Seaborn: DataFrame-ga mos statistik grafiklar (`hue`, `col`, `boxplot`, `heatmap`) bir qatorda.'],
    compareEn: ['Matplotlib: low-level full styling & custom canvas control.', 'Seaborn: high-level DataFrame-aware statistical plots (`hue`, `col`, `heatmap`).'],
    compareSummaryUz: 'Statistik taqsimot va ko‘p o‘lchamli korrelyatsiyalarni Seaborn (`boxplot`, `violinplot`, `heatmap`, `col`/`hue`) da chizib, yakuniy sayqalni Matplotlib `ax` da bering.',
    compareSummaryEn: 'Use Seaborn for statistical distributions, correlation heatmaps, and faceted small multiples, then fine-tune details via its Matplotlib `Axes`.',
    practiceTasks: [
      pt('p1609_1', '1-mashq: Pearson Korrelyatsiya (`r`)', 'Task 1: Pearson Correlation', '`[1, 2, 3]` va `[2, 4, 6]` orasidagi Pearson `r` ni toping.', 'Compute Pearson r.', `import math\nxs, ys = [1, 2, 3], [2, 4, 6]\nmx, my = 2.0, 4.0\nnum = sum((x-mx)*(y-my) for x,y in zip(xs,ys))\nden = math.sqrt(sum((x-mx)**2 for x in xs)*sum((y-my)**2 for y in ys))\nprint(round(num/den, 2))`, '1.0', 'cov / (std_x * std_y)', 'Prints 1.0.'),
      pt('p1609_2', '2-mashq: Boxplot Mo‘ylov Chegaralari (Whiskers)', 'Task 2: Boxplot Outlier Fences', '`Q1=20, Q3=40` bo‘lsa `1.5*IQR` pastki va yuqori chegarasini toping.', 'Compute fences.', `q1, q3 = 20, 40; iqr = q3 - q1\nprint((q1 - 1.5 * iqr, q3 + 1.5 * iqr))`, '(-10.0, 70.0)', 'Q1 - 1.5*IQR, Q3 + 1.5*IQR', 'Prints (-10.0, 70.0).'),
      pt('p1609_3', '3-mashq: Bimodal Tuzog‘ini Ko‘rish', 'Task 3: Bimodal Median Check', '`[10, 10, 90, 90]` medianasini hisoblang.', 'Compute bimodal median.', `v = [10, 10, 90, 90]\nprint((v[1] + v[2]) / 2)`, '50.0', 'Middle pair average', 'Prints 50.0.'),
      pt('p1609_4', '4-mashq: ASCII Heatmap Simga', 'Task 4: Correlation Intensity Symbol', '`r >= 0.7 -> "+"`, `r <= -0.7 -> "-"`, else `"."` qaytaring.', 'Classify correlation sign.', `def sym(r): return "+" if r >= 0.7 else ("-" if r <= -0.7 else ".")\nprint([sym(x) for x in (0.9, 0.1, -0.8)])`, "['+', '.', '-']", 'Threshold +/-0.7', "Prints ['+', '.', '-']."),
      pt('p1609_5', '5-mashq: `hue` Bo‘yicha Guruhlash', 'Task 5: Hue Series Splitter', 'Qiymatlarni `hue` kaliti bo‘yicha dict ga yig‘ing.', 'Split values by hue.', `from collections import defaultdict\nd = defaultdict(list)\nfor h, v in [("pro", 10), ("free", 2), ("pro", 15)]: d[h].append(v)\nprint(dict(d))`, "{'pro': [10, 15], 'free': [2]}", 'Group into lists by hue', "Prints {'pro': [10, 15], 'free': [2]}."),
    ],
    quiz: [
      q('q1609_1', 'Seaborn `boxplot` dan ko‘ra ikki tepali (bimodal) taqsimotni yaxshiroq ko‘rsatadigan grafik?', 'Seaborn plot revealing bimodal distributions that a simple boxplot hides?', ['Barplot', 'Violinplot / Histplot(kde=True)', 'Pie', 'Scatter'], ['Barplot', 'Violinplot / Histplot(kde=True)', 'Pie', 'Scatter'], 1, '`violinplot` yoki `histplot(kde=True)`.', '`violinplot` or `histplot(kde=True)`.'),
      q('q1609_2', 'Seaborn da jadval ustunini ranglar bo‘yicha avtomatik guruhlab alohida chiziq chizadigan parametr?', 'Seaborn parameter splitting data colors automatically by a category column?', ['color_by', 'hue', 'group', 'split'], ['color_by', 'hue', 'group', 'split'], 1, '`hue`.', '`hue`.'),
      q('q1609_3', 'Pearson Correlation (`r`) matritsasida nol (`0`) har doim neytral rangda turishi uchun `sns.heatmap` ga nima beriladi?', 'Heatmap argument anchoring zero correlation cleanly to the neutral midpoint color?', ['zero=True', 'center=0 (va vmin=-1, vmax=1)', 'middle=0', 'bias=0'], ['zero=True', 'center=0 (with vmin=-1, vmax=1)', 'middle=0', 'bias=0'], 1, '`center=0`, `vmin=-1`, `vmax=1`.', '`center=0` with `[-1, 1]` bounds.'),
      q('q1609_4', 'Bitta grafikda 8 ta chiziq chatishib ketganda Small Multiples yaratuvchi Seaborn parametri?', 'Parameter splitting a crowded chart into separate side-by-side subplot panels?', ['hue', 'col / row', 'size', 'alpha'], ['hue', 'col / row', 'size', 'alpha'], 1, '`col=` yoki `row=`.', '`col=` or `row=`.'),
      q('q1609_5', 'Pearson `r = 0.0` chiqsa, ikki o‘zgaruvchi orasida hech qanday bog‘liqlik yo‘q deyish to‘g‘rimi?', 'Does Pearson `r = 0.0` prove zero relationship between two variables?', ['Ha, doim', 'Yo‘q! Pearson faqat CHIZIQLI bog‘liqlikni o‘lchaydi (`y = x^2` da `r=0` chiqishi mumkin)', 'Ha, agar N>100', 'Faqat matnda'], ['Yes always', 'No—Pearson detects only linear trends; strong nonlinear links like y=x^2 can yield r=0', 'If N>100', 'Text only'], 1, 'Pearson faqat chiziqli bog‘liqlikni ko‘radi.', 'Linear association only.'),
    ],
    homework: hw('Correlation Matrix & Statistical Visual Profiler', 'Seaborn-Style Correlation & Boxplot Engine', 'Ko‘p ustunli dataset uchun juftlik Pearson korrelyatsiya matritsasini (`r` va ASCII heatmap belgisi) hamda har bir `hue` guruhi uchun Boxplot 5-son xulosasini chiqaruvchi profiler yozing.', 'Build a statistical visual profiler outputting a pairwise Pearson correlation matrix (with ASCII heatmap intensity symbols) and per-hue 5-number boxplot summaries.', ['Pairwise correlation matrix', 'Per-hue boxplot stats + outlier check'], ['Correlation heatmap data', 'Boxplot 5-number summary'], 'Reuse a clean `pearson(xs, ys)` helper across all numeric column pairs.', 'Statistical visualization core.', 'Keyingi darsda Statistika va A/B testlarga o‘tamiz!', 'Statistics & A/B testing next.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-16-10',
    courseId: 'data_science',
    moduleId: 'c16_m4',
    order: 10,
    titleUz: 'Statistika Asoslari — Taqsimot, Variance/StdDev, Korrelyatsiya va Gipoteza Testi',
    titleEn: 'Applied Statistics: Central Tendency, Variance, Correlation vs Causation & Hypothesis Testing',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-16-09'],
    conceptId: 'ds_statistics',
    whyUz: "Data Science ni oddiy hisobotchilikdan ajratadigan narsa — **statistika**! Sayt dizaynini o‘zgartirganda konversiya `4.0%` dan `4.5%` ga chiqsa, bu **haqiqiy yaxshilanishmi** yoki **tasodifiy shovqinmi**? Buni `Mean vs Median`, `Variance/StdDev`, `Confidence Interval` va `A/B test (p-value)` hal qiladi!",
    whyEn: 'Apply descriptive and inferential statistics in Python (`statistics` module): Mean vs Median under skew, Variance & Standard Deviation, Z-scores, Confidence Intervals, Correlation vs Causation (confounders), and A/B hypothesis testing (`p < 0.05`).',
    analogyUz: "**p-value** — suddagi aybsizlik prezumpsiyasi: «Agar A va B versiya aslida bir xil bo‘lganda (Null Hypothesis), bunday katta farq **tasodifan** chiqish ehtimoli necha foiz?» Agar `< 5%` (`p < 0.05`) bo‘lsa — tasodif emas, haqiqiy effekt bor!",
    analogyEn: 'A `p-value` measures how surprising the observed difference is if there were truly no effect (`H0`); below `0.05` rejects pure random luck.',
    stopsUz: "Statistikada 4 ta eng qimmat xato: 1) **Correlation != Causation**: yozda muzqaymoq sotuvi ham, cho‘kishlar ham oshadi — sababchi uchinchi omil (**Confounder** = issiq havo)! 2) **Statistical Significance vs Practical Significance**: 10 million foydalanuvchida `+0.01%` o‘sish `p=0.001` chiqishi mumkin, lekin biznesga foydasi yo‘q! 3) **Sample vs Population StdDev**: butun populyatsiya uchun `pstdev` (`/ N`), tanlanma uchun `stdev` (`/ (N-1)` — Bessel tuzatishi)! 4) A/B testda **Peeking (muddatidan oldin to‘xtatish)** false positive ni keskin oshiradi!",
    stopsEn: 'Never confuse correlation with causation (check confounders), separate `stdev` (`N-1`) from `pstdev` (`N`), evaluate practical effect size alongside `p-values`, and never peek-stop A/B tests early.',
    objUz: ['Mean vs Median, Variance/StdDev (`stdev` vs `pstdev`), Z-score va Confidence Interval', 'Correlation vs Causation va yashirin uchinchi omillar (Confounders)', 'A/B Test mantiqi: `H0`, `p-value < 0.05`, Two-Proportion Z-test va Type I/II xatolar'],
    objEn: ['Compute mean, median, `stdev`/`pstdev`, and 95% confidence intervals', 'Identify confounders distinguishing correlation from causation', 'Run a two-proportion A/B Z-test and distinguish Type I vs Type II errors'],
    theoryUz: `### 1. Markaz va Tarqoqlik (\`statistics\`)
- **Variance** \`σ² = Σ(x - μ)² / N\`, **StdDev** \`σ = √σ²\`.
- Tanlanmada (\`statistics.stdev\`) \`N - 1\` ga bo‘linadi (Bessel correction).
### 2. Korrelyatsiya != Sababiyat (Causation)
Yashirin **Confounder** omil ikkala ko‘rsatkichga bir vaqtda ta’sir qilishi mumkin. Haqiqiy sababiyatni faqat **Randomized Controlled Trial (A/B test)** isbotlaydi!
### 3. A/B Test (Gipoteza Tekshiruvi)
- \`H0\` (Null): Farq yo‘q (\`p_A == p_B\`).
- \`Z = (p_B - p_A) / SE\` -> agar \`|Z| >= 1.96\` bo‘lsa, 95% ishonch bilan (\`p < 0.05\`) farq statistik jihatdan muhim!`,
    theoryEn: `### 1. Spread & Sampling
Use \`statistics.stdev\` (\`N - 1\`) for samples and \`statistics.pstdev\` (\`N\`) for full populations.
### 2. Correlation vs Causation
Confounders create spurious correlations; randomized controlled experiments (A/B tests) isolate true causal effects.
### 3. Hypothesis Testing & A/B Z-Test
Under \`H0: p_B = p_A\`, compute pooled standard error \`SE\` and Z-score; \`|Z| >= 1.96\` corresponds to two-sided \`p < 0.05\`.`,
    examples: [
      ex('Misol 1: Stdlib `statistics` (`mean`, `median`, `stdev`, `pstdev`)', 'Example 1: Sample vs Population Standard Deviation', `import statistics

xs = [10, 12, 14, 16, 18]
print("Mean:", statistics.mean(xs), "| Median:", statistics.median(xs))
print("Sample stdev:", round(statistics.stdev(xs), 2), "| Pop pstdev:", round(statistics.pstdev(xs), 2))`, `Mean: 14 | Median: 14\nSample stdev: 3.16 | Pop pstdev: 2.83`, 'Tanlanma (`N-1`) standart og‘ishi `3.16`, populyatsiyaniki (`N`) esa `2.83` chiqdi.', '`statistics.stdev` applies `N-1` Bessel correction while `pstdev` divides by `N`.'),
      ex('Misol 2: A/B Test Ikki Proporsiya Z-Testi (`|Z| >= 1.96`?)', 'Example 2: Two-Proportion A/B Z-Test', `import math

n_a, conv_a = 1000, 100  # 10.0%
n_b, conv_b = 1000, 140  # 14.0%
p_a, p_b = conv_a / n_a, conv_b / n_b
p_pool = (conv_a + conv_b) / (n_a + n_b)
se = math.sqrt(p_pool * (1 - p_pool) * (1 / n_a + 1 / n_b))
z = (p_b - p_a) / se
print(f"Z = {z:.2f} | Significant (95%)? {abs(z) >= 1.96}")`, `Z = 2.75 | Significant (95%)? True`, '`Z = 2.75 >= 1.96` bo‘lgani uchun 10% -> 14% o‘sish tasodif emas, statistik ahamiyatli!', 'Computes pooled SE and Z-score confirming `p < 0.05` statistical significance.'),
      ex('Misol 3: 95% Ishonch Oralig‘i (Confidence Interval)', 'Example 3: 95% Confidence Interval Calculation', `import math, statistics

xs = [48, 50, 52, 50, 50]
mu = statistics.mean(xs)
se = statistics.stdev(xs) / math.sqrt(len(xs))
ci_low, ci_high = round(mu - 1.96 * se, 2), round(mu + 1.96 * se, 2)
print(f"95% CI: [{ci_low}, {ci_high}]")`, `95% CI: [48.76, 51.24]`, '95% ishonch oralig‘i haqiqiy o‘rtacha `[48.76, 51.24]` orasida ekanini ko‘rsatadi.', 'Estimates the 95% confidence bounds around the sample mean.'),
    ],
    traceTitleUz: 'A/B Test (H0 -> Z-score -> Decision) Trace',
    traceTitleEn: 'Tracing Two-Proportion A/B Test',
    traceCode: `A(100/1000) vs B(140/1000) -> Z = 2.75`,
    traceSteps: [
      traceStep(1, 'p_pool & SE', '0.12 -> SE=0.0145', 'Umumiy standart xato topildi', 'Computed pooled standard error'),
      traceStep(2, '(p_b - p_a) / SE', 'Z = 2.75', '1.96 chegarasidan oshdi', 'Exceeded 95% Z threshold'),
      traceStep(3, 'Decision', 'Reject H0', 'B varianti g‘olib!', 'Statistically significant win'),
    ],
    commonMistakes: [
      mistake('Korrelyatsiyani sababiyat (Causation) deb qabul qilish', 'Confusing Correlation With Causation (Ignoring Confounders)', `# Ice cream sales correlate strongly with sunburns (r=0.95), NOT because ice cream burns skin!`, 'Wrong product or medical decisions', `print("Check confounders (e.g., hot summer weather) and run A/B randomized experiments!")`, 'Uchinchi yashirin omil (confounder) ni tekshiring va A/B test o‘tkazing.', 'Look for confounders and rely on randomized experiments to establish causality.', 'Confounder ni tekshiring.', 'Check for confounders.'),
      mistake('A/B testni kerakli sample to‘lmasdan ertaroq to‘xtatib g‘olib eʼlon qilish (Peeking)', 'Stopping an A/B Test Early on Transient Spikes (Peeking)', `# Checking p-value every hour and stopping the moment p < 0.05 inflates false positives above 25%!`, 'Broken A/B rollouts', `print("Pre-commit sample size N before launching A/B tests—never stop early on peeks!")`, 'Testdan oldin zarur `N` ni belgilang va muddatidan oldin to‘xtatmang.', 'Lock the sample size before starting and evaluate only once the target N is reached.', 'Sample size ni oldindan belgilang.', 'Pre-commit sample size N.'),
    ],
    compareTitleUz: 'Mean vs Median & Type I vs Type II Error',
    compareTitleEn: 'Statistical Concepts Compared',
    compareUz: ['Mean vs Median: simmetrik ma’lumotda Mean, outlier/skew bor joyda Median.', 'Type I Error (False Positive): aslida farq yo‘q joyda "bor" deb aldanish (`alpha=0.05`).', 'Type II Error (False Negative): haqiqiy yaxshilanishni ko‘rmay qolish (`1 - power`).'],
    compareEn: ['Mean vs Median: symmetric vs outlier/skew resistance.', 'Type I Error: false positive rejecting a true H0.', 'Type II Error: false negative missing a real improvement.'],
    compareSummaryUz: 'Skew bo‘lsa Median va `stdev` ishlating, korrelyatsiyadan sababiyat yasamang, va A/B testlarda ham `p-value`, ham amaliy effekt hajmini o‘lchang.',
    compareSummaryEn: 'Pair `stdev`/`CI` with robust medians, verify confounders before claiming causation, and evaluate both statistical and practical significance in A/B tests.',
    practiceTasks: [
      pt('p1610_1', '1-mashq: `statistics.stdev` vs `pstdev`', 'Task 1: Sample vs Population Stdev', '`[2, 4, 4, 4, 5, 5, 7, 9]` uchun `round(pstdev, 2)` hisoblang.', 'Compute pstdev.', `import statistics\nprint(round(statistics.pstdev([2, 4, 4, 4, 5, 5, 7, 9]), 2))`, '2.0', 'statistics.pstdev', 'Prints 2.0.'),
      pt('p1610_2', '2-mashq: 95% Z-Chegara Tekshiruvi', 'Task 2: Significance Threshold', '`Z = 2.15` uchun `abs(z) >= 1.96` natijasini chiqaring.', 'Check Z >= 1.96.', `print(abs(2.15) >= 1.96)`, 'True', 'Compare |Z| >= 1.96', 'Prints True.'),
      pt('p1610_3', '3-mashq: Standard Error (`sigma / sqrt(N)`)', 'Task 3: Standard Error', '`sigma=10, N=100` bo‘lsa `SE` necha?', 'Compute SE.', `import math\nprint(10 / math.sqrt(100))`, '1.0', 'sigma / math.sqrt(n)', 'Prints 1.0.'),
      pt('p1610_4', '4-mashq: Amaliy Effekt (Relative Lift %)', 'Task 4: Relative Lift %', 'Konversiya `5%` dan `6%` ga oshsa nisbiy o‘sish (Relative Lift %) necha?', 'Compute relative lift.', `print(round((0.06 - 0.05) / 0.05 * 100, 1))`, '20.0', '(p_b - p_a) / p_a * 100', 'Prints 20.0.'),
      pt('p1610_5', '5-mashq: Variance Hisoblash', 'Task 5: Sample Variance', '`[10, 20, 30]` ning `statistics.variance` ini toping.', 'Compute variance.', `import statistics\nprint(statistics.variance([10, 20, 30]))`, '100', 'statistics.variance', 'Prints 100.'),
    ],
    quiz: [
      q('q1610_1', 'Nima uchun `statistics.stdev` (tanlanma) bo‘luvchi sifatida `N` o‘rniga `N - 1` ishlatadi?', 'Why does sample standard deviation divide by `N - 1` instead of `N`?', ['Tezroq', 'Bessel tuzatishi — kichik tanlanmada dispersiyani kamaytirib baholamaslik uchun', 'Python xatosi', 'Nol chiqmasligi uchun'], ['Faster', 'Bessel correction preventing underestimation of true population variance', 'Bug', 'Avoid zero'], 1, 'Bessel tuzatishi.', 'Bessel’s correction.'),
      q('q1610_2', 'Ikki ko‘rsatkich birga oshsa (`r = 0.92`), lekin ikkalasini uchinchi yashirin sababchi boshqarayotgan bo‘lsa, u uchinchi omil nima deyiladi?', 'Hidden third variable causing spurious correlation between two variables?', ['Outlier', 'Confounder (chalkashtiruvchi omil)', 'Standard Error', 'Gradient'], ['Outlier', 'Confounder variable', 'Standard Error', 'Gradient'], 1, 'Confounder.', 'Confounder.'),
      q('q1610_3', '95% ishonch darajasida (`alpha = 0.05`, ikki tomonlama) kritik Z qiymati nechaga teng?', 'Two-sided critical Z-score threshold for 95% confidence (`p < 0.05`)?', ['1.0', '1.96', '3.14', '0.5'], ['1.0', '1.96', '3.14', '0.5'], 1, '`1.96`.', '`1.96`.'),
      q('q1610_4', 'Aslida A va B versiya bir xil bo‘lsa-da, "B yaxshiroq!" deb xato g‘olib chiqarish qaysi turdagi statistik xato?', 'Rejecting a true Null Hypothesis (false positive alarm) in hypothesis testing?', ['Type I Error (False Positive)', 'Type II Error', 'Overfitting', 'Bias'], ['Type I Error (False Positive)', 'Type II Error', 'Overfitting', 'Bias'], 1 - 1, 'Type I Error.', 'Type I Error.'),
      q('q1610_5', 'A/B testda `p-value = 0.001` chiqsa, lekin o‘sish atigi `+$0.001` bo‘lsa qanday xulosa chiqariladi?', 'Conclusion when an A/B test is statistically significant (`p=0.001`) yet yields `+$0.001` lift?', ['Darhol joriy etish', 'Statistik ahamiyatli, lekin amaliy (biznes) ahamiyati yo‘q!', 'Xato ma’lumot', 'Model o‘qitish'], ['Ship now', 'Statistically significant but practically negligible for the business!', 'Bad data', 'Train ML'], 1, 'Statistik vs amaliy ahamiyat farqi.', 'Statistically significant yet practically negligible.'),
    ],
    homework: hw('A/B Experiment Calculator & Statistical Auditor', 'Statistically Rigorous A/B Decision Engine', 'A va B guruhlari soni + konversiyalari asosida `p_a`, `p_b`, Relative Lift %, Pooled SE, Z-score, 95% Confidence Interval va yakuniy "Ship / Hold" qarorini chiqaruvchi modul yozing.', 'Build an A/B evaluation engine outputting conversion rates, relative lift %, pooled SE, Z-score, 95% CIs, and a practical/statistical launch recommendation.', ['A/B Z-test + Lift + 95% CI', 'Ship vs Hold decision'], ['Z-test + Lift + CI', 'Decision gate'], 'Combine `abs(z) >= 1.96` with a minimum practical lift threshold (e.g. >= 5% lift).', 'Rigorous experiment analysis.', 'Review #36 bilan Data Science statistika poydevorini mustahkamlang!', 'Complete Review #36.', 25),
    reviewCheckpoint: review(
      36,
      'Review Loyiha #36: Vizualizatsiya + Statistika + A/B Qaror Engine!',
      'Review Project #36: Visual & Statistical Decision Pipeline!',
      '16-kurs 2-yarmini yakunlang: Rolling trend + Pearson korrelyatsiya + Boxplot 5-son tahlili va A/B test Z-baholashini bitta hisobotga birlashtiring.',
      'Combine rolling trends, correlation checks, boxplot distribution metrics, and an A/B two-proportion Z-test into one executive decision report.',
      ['Rolling + Correlation + Boxplot', 'A/B Z-test & 95% CI decision'],
      ['Rolling + Corr + Boxplot', 'A/B Z-test decision'],
      `import math, statistics\n# Rolling-3 + Pearson r + A/B Z-test pipeline!\nprint("Review #36 Stats & Viz Engine Ready")`,
    ),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-16-11',
    courseId: 'data_science',
    moduleId: 'c16_m4',
    order: 11,
    titleUz: 'Exploratory Data Analysis (EDA) — Tizimli Tadqiqot, Segmentlar va Anomaliya Ovchi',
    titleEn: 'Exploratory Data Analysis (EDA): Univariate, Bivariate & Anomaly Hunting',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-16-10'],
    conceptId: 'ds_eda',
    whyUz: "ML model o‘qitishdan yoki rahbariyatga hisobot berishdan OLDIN ma’lumotning «ichki xarakterini» ochish — **EDA (Exploratory Data Analysis)** dir! Tartibsiz grafik chizish o‘rniga kuchli analitiklar 3 bosqichda ishlaydi: **Univariate (har ustun alohida) -> Bivariate (juftliklar) -> Multivariate / Anomaliya tekshiruvi**.",
    whyEn: 'Execute disciplined Exploratory Data Analysis (EDA): audit data quality and leakage, analyze univariate distributions & cardinality, uncover bivariate segments, and log concrete hypotheses for modeling or business action.',
    analogyUz: "**EDA** — shifokor ko‘rigi: bemorga dori (ML model) yozishdan oldin harorat, qon bosimi (Univariate) va birga o‘zgaruvchi tahlillarni (Bivariate) tekshirasiz!",
    analogyEn: 'EDA is a medical checkup before prescribing treatment—measuring single vitals, comparing paired symptoms, and catching red flags early.',
    stopsUz: "EDA da 3 ta oltin odat: 1) **Target Leakage ni EDA dayoq tuting** — masalan, «mijoz ketadimi?» (`churn`) ustuni bilan `cancel_reason` (`r = 0.99`) birga tursa, model kelajakdagi ma’lumotni o‘g‘irlaydi! 2) **Sentinel qiymatlarni tekshiring**: `age = 999`, `salary = -1`, `zip = 00000` ko‘pincha tizimdagi yashirin `NULL` dir! 3) Har bir EDA sessiyasi oxirida aniq **Insights & Next Actions ro‘yxati** yozing!",
    stopsEn: 'Hunt for sentinel fake numbers (`999`, `-1`), spot target leakage columns during EDA before modeling, and conclude every EDA notebook with prioritized insights and actions.',
    objUz: ['3 bosqichli EDA sikli: Data Quality -> Univariate -> Bivariate/Multivariate', 'Yashirin Sentinel qiymatlar (`999`, `-1`), yuqori kardinalitet (`unique == N`) va Skew tekshiruvi', 'Data Leakage belgilarini EDA bosqichida aniqlash'],
    objEn: ['Structure EDA sequentially: Audit -> Univariate -> Bivariate -> Hypotheses', 'Detect sentinel fake numbers (`-1`, `999`), ID cardinality, and distribution skew', 'Flag suspicious target leakage features prior to ML modeling'],
    theoryUz: `### 1. Univariate Tahlil
- Sonli: \`min\`, \`median\`, \`max\`, skew, \`0\` yoki manfiy ulushi.
- Kategorik: \`nunique()\` (agar \`nunique == len(rows)\` bo‘lsa — bu ID ustun!) va top qiymatlar.
### 2. Bivariate & Segment Tahlil
\`groupby("segment")[target].mean()\` -> qaysi segmentda muammo eng katta?
### 3. Leakage & Sentinel Tekshiruvi
\`age = -1\` yoki \`999\`, hamda kelajak hodisasini oshkor qiluvchi ustunlar (\`refund_issued_at\`) ni olib tashlang.`,
    theoryEn: `### 1. Univariate Profiling
Check numeric range, skew, zero ratios, and categorical cardinality (\`nunique == N\` signals non-predictive IDs).
### 2. Bivariate Slicing
Slice KPIs across categories (\`groupby(segment)[target].mean()\`) to pinpoint high-impact drivers.
### 3. Sentinel & Leakage Detection
Flag placeholder codes (\`-1\`, \`999\`) and future-timestamp features leaking the target label.`,
    examples: [
      ex('Misol 1: Avtomatik EDA Column Profiler (`nunique`, `zeros`, `min/max`)', 'Example 1: Automated Univariate EDA Profiler', `ages = [22, 25, -1, 30, 999, 28]
valid = [a for a in ages if 0 <= a <= 120]
sentinels = [a for a in ages if a not in valid]
print("Valid:", valid, "| Suspicious sentinels:", sentinels)`, `Valid: [22, 25, 30, 28] | Suspicious sentinels: [-1, 999]`, 'EDA profili darhol `-1` va `999` sentinel xatolarini o‘rtacha hisoblashdan oldin ajratdi.', 'Flags impossible sentinel values (`-1`, `999`) before summary stats get corrupted.'),
      ex('Misol 2: High-Cardinality ID Ustunini Aniqlash', 'Example 2: Detecting Non-Predictive ID Columns', `rows = [{"uid": "u1", "city": "Toshkent"}, {"uid": "u2", "city": "Toshkent"}, {"uid": "u3", "city": "Buxoro"}]
for col in ("uid", "city"):
    uniq_ratio = len({r[col] for r in rows}) / len(rows)
    print(col, "unique_ratio:", round(uniq_ratio, 2), "-> ID-like?" , uniq_ratio == 1.0)`, `uid unique_ratio: 1.0 -> ID-like? True\ncity unique_ratio: 0.67 -> ID-like? False`, 'Unikallik nisbati `1.0` bo‘lgan ustun (`uid`) odatda identifikator bo‘lib, statistik umumlashmaydi.', 'Identifies unique ID columns via cardinality ratio (`nunique / n == 1.0`).'),
      ex('Misol 3: Bivariate Churn Segment Kesimi', 'Example 3: Bivariate Segment Churn Rate', `from collections import defaultdict

users = [("free", 1), ("free", 1), ("free", 0), ("pro", 0), ("pro", 0)]
seg = defaultdict(list)
for plan, churn in users:
    seg[plan].append(churn)
rates = {k: round(sum(v) / len(v) * 100, 1) for k, v in seg.items()}
print("Churn % by plan:", rates)`, `Churn % by plan: {'free': 66.7, 'pro': 0.0}`, 'Bivariate kesim Free tarifda ketish `66.7%`, Pro da esa `0%` ekanini ochib berdi.', 'Surfaces strong bivariate signal by grouping target outcomes across segments.'),
    ],
    traceTitleUz: 'EDA 3-Bosqichli Tekshiruv Trace',
    traceTitleEn: 'Tracing Structured EDA Flow',
    traceCode: `Univariate(sentinels) -> Bivariate(churn by plan) -> Hypothesis`,
    traceSteps: [
      traceStep(1, 'Univariate scan', 'found -1, 999; uid=ID', 'Shubhali va ID ustunlar topildi', 'Caught sentinels & ID columns'),
      traceStep(2, 'Bivariate slice', 'free churn=66.7%', 'Asosiy segment farqi aniqlandi', 'Found high-churn segment'),
    ],
    commonMistakes: [
      mistake('`age = -1` yoki `999` larni ko‘rmay `df["age"].mean()` chiqarish', 'Averaging Unfiltered Sentinel Codes Like -1 or 999', `# Legacy databases store missing ages as 999 or -1, distorting mean age silently!`, 'Absurd KPI metrics', `print("Inspect min/max histograms during EDA to convert sentinel codes into None!")`, 'Har bir ustunning `min`/`max` va nol ulushini EDA da albatta tekshiring.', 'Inspect `min`/`max` distributions first and map sentinel codes (`-1`, `999`) to `None`.', 'Sentinel qiymatlarni tekshiring.', 'Check min/max for sentinels.'),
      mistake('Kelajak hodisasini (`cancel_reason`) ML/EDA bashoratiga qo‘shib qo‘yish', 'Leaving Target-Leaking Columns Inside Features', `# Predicting churn from "cancellation_email_sent" yields 99% fake accuracy—useless in production!`, 'Useless leaky models', `print("Ask during EDA: Was this column known BEFORE the prediction timestamp?")`, 'Har bir ustun bashorat paytida ma’lum bo‘lgan-bo‘lmaganini tekshiring.', 'Verify every candidate feature existed chronologically prior to the target event.', 'Vaqt chizig‘ini tekshiring.', 'Check temporal leakage.'),
    ],
    compareTitleUz: 'Univariate vs Bivariate vs Multivariate EDA',
    compareTitleEn: 'EDA Analysis Levels',
    compareUz: ['Univariate: bitta ustun shakli, sentinellar, kardinalitet.', 'Bivariate: ikki ustun munosabati (segment x KPI, scatter/corr).', 'Multivariate: uch va undan ko‘p omil kesishuvi (Simpson paradoksini ochadi).'],
    compareEn: ['Univariate: single-column distributions, sentinels, and cardinality.', 'Bivariate: pairwise group comparisons & correlations.', 'Multivariate: interacting controls exposing confounding or Simpson’s paradox.'],
    compareSummaryUz: 'Tartibli EDA ni Quality Audit -> Univariate -> Bivariate ketma-ketligida olib boring, sentinel va ID/leakage ustunlarni ajrating.',
    compareSummaryEn: 'Run structured EDA (Audit -> Univariate -> Bivariate -> Hypotheses), filtering sentinel placeholders, ID columns, and leakage.',
    practiceTasks: [
      pt('p1611_1', '1-mashq: Sentinel Filtrlash (`0..120`)', 'Task 1: Filter Valid Ages', '`[18, -99, 25, 999]` dan faqat `[0, 120]` yoshlarni ajrating.', 'Keep realistic ages.', `print([a for a in (18, -99, 25, 999) if 0 <= a <= 120])`, '[18, 25]', 'Bounds check 0 <= a <= 120', 'Prints [18, 25].'),
      pt('p1611_2', '2-mashq: Kardinalitet Nisbati', 'Task 2: Unique Ratio Check', '`["a", "b", "a", "b"]` ning `nunique / len` nisbatini chiqaring.', 'Compute uniqueness ratio.', `xs = ["a", "b", "a", "b"]\nprint(len(set(xs)) / len(xs))`, '0.5', 'len(set)/len', 'Prints 0.5.'),
      pt('p1611_3', '3-mashq: Bivariate Segment O‘rtachasi', 'Task 3: Segment Mean', '`[("vip", 100), ("vip", 200), ("reg", 40)]` da `"vip"` o‘rtachasini toping.', 'Compute VIP mean.', `v = [x for s, x in [("vip", 100), ("vip", 200), ("reg", 40)] if s == "vip"]\nprint(sum(v) / len(v))`, '150.0', 'Filter segment then average', 'Prints 150.0.'),
      pt('p1611_4', '4-mashq: Zero Inflation Tekshiruvi', 'Task 4: Zero Ratio Check', '`[0, 0, 0, 50, 100]` ustunida `0` lar foizini hisoblang.', 'Compute zero fraction.', `xs = [0, 0, 0, 50, 100]\nprint(round(xs.count(0) / len(xs) * 100, 1))`, '60.0', 'count(0) / len * 100', 'Prints 60.0.'),
      pt('p1611_5', '5-mashq: ID Ustunini Chetlatish', 'Task 5: Drop ID Columns', 'Unikalligi 100% bo‘lgan ustun nomini ro‘yxatdan chiqarib tashlang.', 'Exclude ID-like columns.', `cols = {"id": [1, 2, 3], "plan": ["a", "a", "b"]}\nprint([k for k, v in cols.items() if len(set(v)) < len(v)])`, "['plan']", 'Drop where len(set(v)) == len(v)', "Prints ['plan']."),
    ],
    quiz: [
      q('q1611_1', 'Qadimgi tizimlarda bo‘sh yosh o‘rniga yozilgan `-1` yoki `999` kabi soxta kodlar nima deb ataladi?', 'Placeholder codes like `-1` or `999` representing hidden missing values?', ['Outlier', 'Sentinel qiymatlar (Sentinel values)', 'Noise', 'Hyperparameter'], ['Outlier', 'Sentinel values', 'Noise', 'Hyperparameter'], 1, 'Sentinel qiymatlar.', 'Sentinel values.'),
      q('q1611_2', 'Agar matn ustunida `nunique() == len(df)` (100% unikal) bo‘lsa, u odatda qanday ustun?', 'If `nunique() == len(df)` for a string column, what is it likely to be?', ['Target', 'Identifikator (ID) ustuni — modelga kiritilmasligi kerak', 'Boolean', 'Numeric'], ['Target', 'Unique identifier (ID) column that cannot generalize', 'Boolean', 'Numeric'], 1, 'ID ustuni.', 'Unique identifier column.'),
      q('q1611_3', 'Mijoz ketishini bashorat qilishda `cancel_reason` ustunini kiritish qanday jiddiy xato?', 'Major flaw when predicting churn using a `cancellation_email_sent` column?', ['Underfitting', 'Data / Target Leakage (kelajak ma’lumotini sizdirish)', 'Broadcasting', 'Over-indexing'], ['Underfitting', 'Target / Data Leakage', 'Broadcasting', 'Over-indexing'], 1, 'Target Leakage.', 'Target / Data Leakage.'),
      q('q1611_4', 'EDA ning to‘g‘ri tartiblangan bosqichlari?', 'Disciplined Exploratory Data Analysis progression?', ['Deploy -> Plot', 'Data Audit -> Univariate -> Bivariate/Multivariate -> Gipotezalar', 'Train -> Test', 'Clean only'], ['Deploy -> Plot', 'Audit -> Univariate -> Bivariate/Multivariate -> Hypotheses', 'Train -> Test', 'Clean only'], 1, 'Audit -> Univariate -> Bivariate -> Gipotezalar.', 'Audit -> Univariate -> Bivariate -> Hypotheses.'),
      q('q1611_5', 'Nima uchun EDA da nollar ulushi (`zero_ratio`) alohida tekshiriladi?', 'Why check the percentage of zeros during univariate EDA?', ['Tezroq', 'Zero-inflated ustunlar o‘rtachani pasaytirib yashirin nollar/xatolarni bildirishi mumkin', 'Memory', 'Syntax'], ['Faster', 'Zero-inflated distributions pull down averages and signal missing/inactive cohorts', 'Memory', 'Syntax'], 1, 'Zero-inflation taqsimotni keskin o‘zgartiradi.', 'Zero-inflation skews metrics and signals inactive cohorts.'),
    ],
    homework: hw('Avtomatik EDA Diagnostika Profili', 'Automated EDA Profiling Engine', 'Har qanday jadval (`list[dict]`) ni qabul qilib: har bir ustun uchun `null%`, `unique_ratio` (ID flag), `zero%`, shubhali sentinellar va Bivariate target kesimini chiqaruvchi EDA hisobot generatori tuzing.', 'Build an automated EDA profiler reporting per-column null %, uniqueness ratio (flagging IDs), zero-inflation %, suspicious numeric sentinels, and bivariate target segment means.', ['Univariate + Sentinel + ID check', 'Bivariate target segment report'], ['Full EDA profiler', 'Bivariate slice summary'], 'Separate numeric vs categorical profiling cleanly before computing bivariate segment rates.', 'Reusable EDA toolkit.', 'Keyingi darsda 16-kursni katta Real Data loyihasi bilan yakunlaymiz!', 'Complete the Capstone next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-16-12',
    courseId: 'data_science',
    moduleId: 'c16_m4',
    order: 12,
    titleUz: 'Real Data Analysis Loyihasi — E-Commerce Churn & Revenue End-to-End Capstone',
    titleEn: 'Real Data Analysis Capstone: End-to-End E-Commerce Revenue & Retention Report',
    difficulty: 'advanced',
    estimatedMinutes: 40,
    prerequisites: ['PY-16-11'],
    conceptId: 'ds_capstone',
    whyUz: "16-kursning barcha ko‘nikmalarini bitta haqiqiy biznes loyihasida birlashtirish vaqti keldi! Siz xom CSV ma’lumotidan boshlab **Ingest & Raw Hash -> Clean (Deduplicate + Impute + Outlier Cap) -> Segment KPI + Pareto + Pearson r -> Executive Action Report** quvurini 0 dan oxirigacha qurib, portfolio va suhbat uchun tayyor loyiha yaratasiz!",
    whyEn: 'Assemble a production-grade end-to-end Data Science analysis pipeline: raw CSV ingestion & checksum -> deterministic cleaning & deduplication -> weighted KPIs, Pareto revenue leaders & statistical correlations -> actionable executive decision summary.',
    analogyUz: "**Real Data Capstone** — orkestr konserti: NumPy vektor hisoblari, Pandas tozalash, Statistika tekshiruvi va EDA xulosalari hammasi bir ohangda biznes qaroriga xizmat qiladi!",
    analogyEn: 'A capstone pipeline brings ingestion, reproducible cleaning, statistical checks, and insight framing together into one reliable, automated report.',
    stopsUz: "Portfolio loyihasida ish beruvchilar qaraydigan 3 narsa: 1) **Reproducibility**: skript har safar xom fayldan xatosiz qayta yuradimi? 2) **Audit Trail**: nechta dublikat va `NaN` tozalangani hisobotda ko‘rinadimi? 3) **So What? (Biznes Qaror)**: shunchaki «o‘rtacha $50» emas, balki **«Pro foydalanuvchilar 3x ko‘p daromad beradi va 7-kun onboarding ni kuchaytirish kerak»** kabi aniq tavsiya!",
    stopsEn: 'Make your capstone employer-ready: ensure deterministic end-to-end execution from raw data, emit a transparent cleaning audit log, and conclude with concrete business recommendations ("So what?").',
    objUz: ['To‘liq Data Pipeline arxitekturasi: `ingest -> clean -> analyze -> recommend`', 'Audit metrikalari bilan xom ma’lumot sifatini isbotlash', 'Biznes darajadagi Executive Summary (KPI + Top Segment + Correlation + Tavsiya)'],
    objEn: ['Build an end-to-end `ingest -> clean -> analyze -> recommend` pipeline', 'Track transparent cleaning audit counts alongside KPIs', 'Translate numbers into crisp executive business recommendations'],
    theoryUz: `### Capstone Quvur Arxitekturasi
1. **Ingest**: Xom CSV ni o‘qish, \`sha256\` nazorat xeshi.
2. **Clean**: \`strip().title()\`, \`id\` bo‘yicha \`keep="last"\`, narxdagi manfiy/bo‘shlarni median bilan tuzatish.
3. **Analyze**: Weighted AOV, shahar/tarif Pareto ulushi, davomiylik vs xarajat korrelyatsiyasi.
4. **Communicate**: JSON + odam o‘qiydigan aniq biznes qaror!`,
    theoryEn: `### End-to-End Capstone Architecture
1. **Ingest**: Parse raw CSV and record SHA-256 fingerprint.
2. **Clean**: Standardize text, deduplicate \`keep="last"\`, impute invalid/missing values with median.
3. **Analyze**: Weighted KPIs, Pareto revenue shares, and Pearson correlation checks.
4. **Communicate**: Structured JSON metrics + concrete executive action plan.`,
    examples: [
      ex('Misol 1: Capstone To‘liq Ingest -> Clean -> Pareto Pipeline', 'Example 1: Full Mini E-Commerce Analytics Pipeline', `import csv, hashlib, io, statistics

raw = """oid,city,plan,total
1, toshkent ,pro,200
1,Toshkent,pro,250
2,Buxoro,free,
3,Toshkent,pro,150"""
h = hashlib.sha256(raw.encode()).hexdigest()[:8]
dedup = {}
for r in csv.DictReader(io.StringIO(raw)):
    dedup[r["oid"]] = {"city": r["city"].strip().title(), "plan": r["plan"], "total": float(r["total"]) if r["total"] else None}

valid_vals = [v["total"] for v in dedup.values() if v["total"] is not None]
med = statistics.median(valid_vals)
for v in dedup.values():
    if v["total"] is None:
        v["total"] = med

rev = sum(v["total"] for v in dedup.values())
print(f"Hash={h} | CleanRows={len(dedup)} | TotalRev={rev} | WeightedAOV={round(rev/len(dedup), 1)}")`, `Hash=9bfe63ad | CleanRows=3 | TotalRev=600.0 | WeightedAOV=200.0`, 'Xom CSV dan checksum, deduplikatsiya, median imputatsiya va yakuniy KPI bir skriptda bajarildi.', 'Runs raw checksum, deduplication, median imputation, and weighted KPIs end-to-end.'),
      ex('Misol 2: Executive Recommendation Rule Engine', 'Example 2: Translating Metrics Into Business Actions', `def advise(churn_free: float, churn_pro: float) -> str:
    if churn_free > churn_pro * 2:
        return f"ACTION: Free churn ({churn_free:.0%}) is >2x Pro ({churn_pro:.0%}); prioritize Day-3 onboarding nudges."
    return "STATUS: Retention balanced across tiers."

print(advise(0.45, 0.12))`, `ACTION: Free churn (45%) is >2x Pro (12%); prioritize Day-3 onboarding nudges.`, 'Yaxshi tahlilchi raqamlarni aniq biznes harakatiga aylantiradi.', 'Converts analytical comparisons into prioritized product recommendations.'),
      ex('Misol 3: Audit Summary Contract (`raw -> dropped -> clean`)', 'Example 3: Transparent Data Quality Audit Log', `audit = {"raw_rows": 4, "dedup_dropped": 1, "nulls_imputed": 1, "clean_rows": 3}
assert audit["raw_rows"] - audit["dedup_dropped"] == audit["clean_rows"]
print("Pipeline Audit PASSED:", audit)`, `Pipeline Audit PASSED: {'raw_rows': 4, 'dedup_dropped': 1, 'nulls_imputed': 1, 'clean_rows': 3}`, 'Audit logi hech qanday qator izsiz yo‘qolmaganini matematik tekshiradi.', 'Verifies row-count conservation across ingestion and cleaning stages.'),
    ],
    traceTitleUz: 'Capstone End-to-End Trace',
    traceTitleEn: 'Tracing End-to-End Capstone Execution',
    traceCode: `raw(4) -> dedup(3) -> impute_median(200) -> KPI(600)`,
    traceSteps: [
      traceStep(1, 'Ingest & Hash', '4 rows, sha256', 'Xom CSV yuklandi', 'Loaded & fingerprinted raw data'),
      traceStep(2, 'Clean & Impute', '3 rows, total=600', 'Dublikat va null tuzatildi', 'Deduplicated & imputed median'),
      traceStep(3, 'KPI & Advise', 'AOV=200.0 + Action', 'Qaror shakllantirildi', 'Emitted actionable KPI report'),
    ],
    commonMistakes: [
      mistake('Tahlilni faqat "o‘rtacha narx = $200" deb harakatsiz tugatish', 'Stopping Analysis Without Actionable Recommendations', `# Reporting raw numbers without explaining why they moved or what team should do leaves insight unused!`, 'Ignored analytical reports', `print("Always end capstone reports with Top Finding + Business Impact + Recommended Next Step!")`, 'Hisobot oxirida aniq biznes tavsiya ("So What?") yozing.', 'Pair every key metric with its likely driver and a concrete next action.', '"So What?" xulosasini qo‘shing.', 'Add actionable takeaways.'),
      mistake('Clean bosqichida nechta qator o‘chirilganini qayd etmaslik', 'Dropping or Imputing Rows Silently Without an Audit Log', `# If 40% of rows were dropped silently due to bugs, executive dashboards show half the real revenue!`, 'Silent metric distortion', `print("Emit a raw_rows vs clean_rows vs imputed_count audit dictionary on every pipeline run!")`, 'Har bir quvurda `raw_rows`, `dropped`, `imputed` audit hisobotini chiqaring.', 'Log row conservation metrics on every pipeline run so quality drops never hide.', 'Audit hisobotini chiqaring.', 'Log pipeline audit counts.'),
    ],
    compareTitleUz: 'Ad-hoc Notebook vs Production Data Pipeline',
    compareTitleEn: 'Ad-hoc Exploration vs Production Pipeline',
    compareUz: ['Ad-hoc Notebook: tez EDA, gipoteza sinash va grafiklar uchun zo‘r.', 'Production Script/Module: modulli funksiyalar, deterministic seed, audit log va qayta yuritishga tayyor!'],
    compareEn: ['Ad-hoc Notebook: great for quick exploration & visual hypotheses.', 'Production Pipeline: modular tested functions, deterministic seeds, audit logs, and automated execution.'],
    compareSummaryUz: 'End-to-end loyihada `ingest -> clean -> stats -> executive action` zanjirini to‘liq avtomatlashtiring va 17-kurs AI/ML ga o‘ting!',
    compareSummaryEn: 'Package ingestion, deterministic cleaning, weighted KPIs, audit logs, and clear recommendations into a reproducible capstone ready for Course 17 (AI & ML)!',
    practiceTasks: [
      pt('p1612_1', '1-mashq: Audit Balans Tekshiruvi', 'Task 1: Audit Conservation Check', '`raw=100, dropped=7` bo‘lsa `clean` sonini chiqaring.', 'Verify clean row count.', `raw, dropped = 100, 7\nprint(raw - dropped)`, '93', 'raw - dropped', 'Prints 93.'),
      pt('p1612_2', '2-mashq: Shahar Ulushi (%)', 'Task 2: Top City Revenue Share', 'Toshkent `750`, jami `1000` bo‘lsa ulush % ni chiqaring.', 'Compute city share %.', `print(round(750 / 1000 * 100, 1))`, '75.0', 'part / total * 100', 'Prints 75.0.'),
      pt('p1612_3', '3-mashq: Mediana Imputatsiya', 'Task 3: Replace None with Median', '`[10, None, 30, 50]` da `None` ni median (`30`) ga almashtiring.', 'Impute median.', `import statistics\nxs = [10, None, 30, 50]\nm = int(statistics.median([x for x in xs if x is not None]))\nprint([m if x is None else x for x in xs])`, '[10, 30, 30, 50]', 'Compute median of non-None', 'Prints [10, 30, 30, 50].'),
      pt('p1612_4', '4-mashq: Decision Threshold Gate', 'Task 4: Automated Alert Rule', 'Churn `>= 0.30` bo‘lsa `"ALERT"`, aks holda `"OK"` chiqaring (`0.35`).', 'Emit alert rule.', `print("ALERT" if 0.35 >= 0.30 else "OK")`, 'ALERT', 'Threshold check', 'Prints ALERT.'),
      pt('p1612_5', '5-mashq: JSON Report Serialization', 'Task 5: Export Sorted JSON Summary', '`{"aov": 200, "rows": 3}` ni sorted JSON stringga aylantiring.', 'Serialize JSON report.', `import json\nprint(json.dumps({"aov": 200, "rows": 3}, sort_keys=True))`, '{"aov": 200, "rows": 3}', 'json.dumps(..., sort_keys=True)', 'Prints deterministic JSON.'),
    ],
    quiz: [
      q('q1612_1', 'Data Analytics quvurida `raw_rows - dedup_dropped == clean_rows` tekshiruvi nima uchun kerak?', 'Why assert row-count conservation in a cleaning audit log?', ['Tezlik', 'Ma’lumotlar kod xatosi sababli jimgina yo‘qolib ketmasligini kafolatlash uchun', 'SQL talabi', 'GPU'], ['Speed', 'Guarantees rows are never silently dropped or multiplied without audit visibility', 'SQL', 'GPU'], 1, 'Shaffof ma’lumot nazorati.', 'Transparent auditability.'),
      q('q1612_2', 'Data Science loyihasi taqdimotini kuchaytiradigan eng muhim yakuniy qism?', 'Most valuable final section of a business data analysis report?', ['Barcha importlar', '"So What?" — o‘lchangan raqamlarga tayangan aniq biznes harakati va tavsiyalar', 'Font nomi', 'CPU modeli'], ['Imports', 'Actionable recommendations tied directly to observed metrics', 'Fonts', 'CPU'], 1, 'Aniq biznes tavsiyasi.', 'Actionable recommendations.'),
      q('q1612_3', 'Tadqiqotchi Jupyter Notebook dagi tajribani har oyda avtomatik ishlaydigan holatga keltirish uchun nima qiladi?', 'How to turn an exploratory notebook into a reliable recurring pipeline?', ['Screenshot olish', 'Tozalash va tahlilni determinant funksiyali Python moduliga ajratib testlash', 'Excel ga ko‘chirish', 'Qayta yozmaslik'], ['Screenshot', 'Refactor steps into deterministic tested Python pipeline functions', 'Excel', 'Skip'], 1, 'Modulli determinant skriptga aylantirish.', 'Refactor into tested deterministic modules.'),
      q('q1612_4', 'E-commerce AOV ni hisoblaganda shaharlar hajmi turlicha bo‘lsa qaysi ko‘rsatkich to‘g‘ri?', 'Correct global AOV metric across cities with unequal order counts?', ['Unweighted mean', 'Weighted Average (`sum(revenue) / sum(orders)`)', 'Mode', 'Min'], ['Unweighted mean', 'Weighted Average (`sum(revenue) / sum(orders)`)', 'Mode', 'Min'], 1, 'Weighted Average.', 'Weighted Average.'),
      q('q1612_5', '16-kursni tugatgach, ma’lumot asosida kelajakni bashorat qiluvchi model qurish qaysi sohaga o‘tadi?', 'Next discipline building predictive models on top of cleaned features?', ['CSS Styling', 'Artificial Intelligence & Machine Learning (17-kurs)', 'Bios', 'SMTP'], ['CSS', 'Artificial Intelligence & Machine Learning (Course 17)', 'BIOS', 'SMTP'], 1, 'AI & Machine Learning (17-kurs).', 'AI & Machine Learning (Course 17).'),
    ],
    homework: hw('16-Kurs Yakuniy Data Analytics Loyihasi', 'Full E-Commerce Revenue & Retention Capstone', 'Xom CSV ma’lumotlaridan checksum olish, matn/valyuta normallashtirish, deduplikatsiya, median imputatsiya, weighted KPI lar, shahar Pareto ulushi, davomiylik-xarajat Pearson korrelyatsiyasi va yakuniy JSON + Executive tavsiya hisobotini chiqaruvchi to‘liq skript yozing.', 'Build a complete capstone script running SHA-256 raw verification, text/currency cleaning, deduplication, median imputation, weighted KPIs, Pareto ranking, Pearson correlation, and an executive JSON recommendation summary.', ['Ingest + Clean + Audit + KPI + Corr', 'Executive Recommendation JSON'], ['Full end-to-end capstone', 'Executive action JSON'], 'Structure the script cleanly into `ingest()`, `clean()`, `analyze()`, and `recommend()` stages.', 'Portfolio-ready Data Science capstone!', '17-kurs: Artificial Intelligence va Machine Learning ga xush kelibsiz!', 'Advance to Course 17: AI & ML!', 35),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),
];
