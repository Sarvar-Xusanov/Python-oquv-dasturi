import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C17_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-17-08',
    courseId: 'ai_ml',
    moduleId: 'c17_m3',
    order: 8,
    titleUz: 'Classification — Logistic Regression (Sigmoid), Decision Trees va Random Forest',
    titleEn: 'Classification Algorithms: Sigmoid Probabilities, Decision Trees & Random Forest',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-17-07'],
    conceptId: 'ml_classification',
    whyUz: "«Bu xabar spammi?», «Mijoz kreditni qaytaradimi?», «Bu rasm qaysi toifa?» — biznesdagi ML loyihalarning yarmidan ko‘pi **Classification** dir! Linear Regression dan farqli o‘laroq, **Logistic Regression** Sigmoid funksiyasi bilan `0..1` ehtimollik chiqaradi; **Decision Tree** esa `Gini` / `Entropy` bilan `if/else` savollariga bo‘ladi; **Random Forest** yuzlab daraxtlarni ovozga qo‘yib eng barqaror jadval modelini beradi!",
    whyEn: 'Master classification algorithms: Logistic Regression (sigmoid probabilities & log-loss), Decision Trees (Gini impurity splits & max_depth pruning), KNN distance scaling, and Random Forest bagging ensembles.',
    analogyUz: "**Decision Tree** — bu 1 ta «20 savol» o‘yini o‘ynayotgan shifokor (`harorat > 38?`). **Random Forest** esa har biri turli ma’lumot bo‘lagini ko‘rgan 100 ta shifokorning **ko‘pchilik ovozi** — bitta daraxt adashsa ham, o‘rmon to‘g‘ri qaror chiqaradi!",
    analogyEn: 'A single Decision Tree memorizes quirks easily; a Random Forest averages votes across 100 diverse trees trained on random subsets to slash variance.',
    stopsUz: "Classification da 3 ta asosiy qoida: 1) **Logistic Regression nomi «Regression» bo‘lsa ham, u CLASSIFIER** (`sigmoid(z)` ehtimollik qaytaradi)! 2) **Decision Tree `max_depth` cheklanmasa training ni 100% yodlaydi (Overfit)**! 3) **Random Forest & XGBoost** uchun featurelarni scaling qilish shart emas (daraxt faqat `x > threshold` solishtiradi), lekin **Logistic Regression va KNN** da scaling SHART!",
    stopsEn: 'Remember Logistic Regression is a classifier via `sigmoid(z)`, unpruned Decision Trees overfit unless bounded by `max_depth` / `min_samples_leaf`, and KNN/Logistic Regression require scaled features whereas trees do not.',
    objUz: ['Sigmoid (`1 / (1 + e^-z)`) ehtimollik va Threshold (`0.5`) qarori', 'Decision Tree **Gini Impurity** (`1 - Σp_i²`) va `max_depth` bilan pruning', 'Random Forest (Bagging) va **Linear/KNN (scaling shart)** vs **Trees (scaling shart emas)**'],
    objEn: ['Compute Sigmoid probabilities and thresholded binary predictions', 'Evaluate Decision Tree node Gini impurity and `max_depth` pruning', 'Compare Logistic Regression, KNN, Decision Trees, and Random Forests'],
    theoryUz: `### 1. Logistic Regression (\`sigmoid\`)
\`p = 1 / (1 + exp(-z))\`, bu yerda \`z = w·x + b\`. Agar \`p >= 0.5\` -> klass \`1\`. Loss funksiyasi: **Log-Loss (Binary Cross-Entropy)**.
### 2. Decision Tree & Gini Impurity
Toza tugun: \`Gini = 1 - Σ(p_i²) = 0.0\`; 50/50 aralash tugun: \`Gini = 0.5\`.
### 3. Random Forest
Bootstrap namunalar + tasodifiy ustunlar ustida ko‘plab daraxtlar -> ko‘pchilik ovozi (\`Hard/Soft Voting\`).`,
    theoryEn: `### 1. Sigmoid Classification
\`sigmoid(z) = 1 / (1 + exp(-z))\` maps linear scores \`z\` cleanly into probabilities \`(0, 1)\`.
### 2. Gini Impurity
\`Gini = 1 - sum(p_i^2)\` measures node mixture (\`0\` = pure single class, \`0.5\` = 50/50 binary split).
### 3. Ensembles (Random Forest)
Bagging averages independent trees over bootstrapped rows and feature subsets, dramatically lowering variance.`,
    examples: [
      ex('Misol 1: Logistic Sigmoid Funksiyasi & Ehtimollik Chegarasi', 'Example 1: Logistic Sigmoid Probabilities', `import math

def sigmoid(z: float) -> float:
    return round(1 / (1 + math.exp(-z)), 3)

scores = [-2.0, 0.0, 2.0]
probs = [sigmoid(z) for z in scores]
preds = [int(p >= 0.5) for p in probs]
print("Probs:", probs, "| Preds:", preds)`, `Probs: [0.119, 0.5, 0.881] | Preds: [0, 1, 1]`, 'Sigmoid har qanday manfiy/musbat sonni `[0, 1]` ehtimollikka aylantiradi.', 'Maps raw linear logits smoothly into `[0, 1]` classification probabilities.'),
      ex('Misol 2: Decision Tree Gini Impurity Hisoblash', 'Example 2: Node Gini Impurity Calculation', `def gini(counts: list[int]) -> float:
    tot = sum(counts)
    return round(1 - sum((c / tot) ** 2 for c in counts), 3)

print("Pure [5, 0]:", gini([5, 0]), "| Mixed [3, 3]:", gini([3, 3]))`, `Pure [5, 0]: 0.0 | Mixed [3, 3]: 0.5`, 'Bir xil klassli tugun `Gini = 0.0`, teng aralash tugun esa maksimal `Gini = 0.5` beradi.', 'Confirms pure nodes yield Gini `0.0` while balanced binary splits yield `0.5`.'),
      ex('Misol 3: Random Forest Ansambl Ovoz Berishi (Soft Voting)', 'Example 3: Soft Voting Across 3 Trees', `tree_probs = [0.80, 0.70, 0.30]
avg_prob = round(sum(tree_probs) / len(tree_probs), 2)
print("Ensemble avg prob:", avg_prob, "-> Class:", int(avg_prob >= 0.5))`, `Ensemble avg prob: 0.6 -> Class: 1`, '3-daraxt adashib `0.30` bersa ham, ansamblning o‘rtacha ehtimoli `0.60` -> to‘g‘ri `1` chiqardi!', 'Demonstrates ensemble averaging reducing individual tree variance errors.'),
    ],
    traceTitleUz: 'Logistic Sigmoid & Threshold Trace',
    traceTitleEn: 'Tracing Logistic Classification',
    traceCode: `z=2.0 -> sigmoid(z)=0.881 -> >=0.5 -> class 1`,
    traceSteps: [
      traceStep(1, 'Linear score z', '2.0', 'Og‘irliklar yig‘indisi olindi', 'Computed logit score'),
      traceStep(2, 'Sigmoid', '0.881', 'Ehtimollikka aylantirildi', 'Converted logit to probability'),
      traceStep(3, 'Threshold 0.5', '1', 'Sinf aniqlandi', 'Assigned binary label'),
    ],
    commonMistakes: [
      mistake('Decision Tree da `max_depth` qo‘ymay training da `100%`, test da `60%` olish', 'Training Unconstrained Decision Trees Without max_depth', `# Unbounded DecisionTreeClassifier splits down to 1 sample per leaf, memorizing every training noise point!`, 'Severe overfitting', `print("Tune max_depth (e.g., 3-10) & min_samples_leaf, or switch to RandomForest!")`, '`max_depth` va `min_samples_leaf` ni cheklang yoki RandomForest ishlating.', 'Prune Decision Trees via `max_depth`/`min_samples_leaf` or bag with Random Forest.', '`max_depth` ni cheklang.', 'Limit `max_depth`.'),
      mistake('Logistic Regression va KNN ni feature scaling qilmasdan o‘qitish', 'Feeding Unscaled Features to KNN or Logistic Regression', `# Income (0..100,000) completely dominates Age (18..80) in Euclidean KNN distances!`, 'Ignored small-scale features', `print("Always wrap KNN, SVM, and LogisticRegression with StandardScaler inside a Pipeline!")`, 'KNN, SVM va LogisticRegression dan oldin `StandardScaler` qo‘ying.', 'Scale numeric features before KNN or Logistic Regression so large units don’t dominate.', 'Scaling qo‘ying.', 'Scale features for KNN/LogReg.'),
    ],
    compareTitleUz: 'Logistic Regression vs Decision Tree vs Random Forest',
    compareTitleEn: 'Classification Models Compared',
    compareUz: ['Logistic Regression: tez, tushunarli ehtimollik (`coef_`), scaling shart, chiziqli chegara.', 'Decision Tree: `if/else` qoidalari ko‘rinadi, scaling shart emas, lekin yolg‘iz o‘zi tez overfit bo‘ladi.', 'Random Forest: jadvalli ma’lumotlarda yuqori aniqlik, outlier va shovqinga juda barqaror.'],
    compareEn: ['Logistic Regression: fast, calibrated linear probabilities; needs scaling.', 'Decision Tree: interpretable rules; no scaling needed; overfits unless pruned.', 'Random Forest: robust tabular ensemble accuracy with low variance.'],
    compareSummaryUz: 'Logistic Regression da Sigmoid ehtimollik + scaling, Decision Tree da Gini + `max_depth`, jadvalli yuqori aniqlik uchun esa Random Forest dan foydalaning.',
    compareSummaryEn: 'Use scaled Logistic Regression for calibrated baselines, pruned Decision Trees for readable rules, and Random Forests for strong tabular accuracy.',
    practiceTasks: [
      pt('p1708_1', '1-mashq: Sigmoid `z = 0.0`', 'Task 1: Sigmoid at Zero', '`z = 0.0` da `1 / (1 + math.exp(-z))` qiymatini chiqaring.', 'Compute sigmoid(0).', `import math\nprint(1 / (1 + math.exp(0)))`, '0.5', '1 / (1 + 1)', 'Prints 0.5.'),
      pt('p1708_2', '2-mashq: Gini Impurity Sof Tugun', 'Task 2: Gini for [4, 1]', '`[4, 1]` sinflar bo‘linishida Gini qiymatini (`round(..., 2)`) toping.', 'Compute Gini.', `print(round(1 - ((4 / 5) ** 2 + (1 / 5) ** 2), 2))`, '0.32', '1 - (0.8^2 + 0.2^2)', 'Prints 0.32.'),
      pt('p1708_3', '3-mashq: Hard Voting Ansambl', 'Task 3: Majority Class Vote', '5 daraxt ovozi `[1, 0, 1, 1, 0]` ning ko‘pchilik natijasini toping.', 'Compute majority vote.', `v = [1, 0, 1, 1, 0]\nprint(int(sum(v) > len(v) / 2))`, '1', 'Majority wins', 'Prints 1.'),
      pt('p1708_4', '4-mashq: Maxsus Threshold `0.7`', 'Task 4: High-Confidence Threshold', 'Ehtimolliklar `[0.65, 0.85]` dan `>= 0.7` bo‘lganlarini `1` qiling.', 'Apply 0.7 cutoff.', `print([int(p >= 0.7) for p in (0.65, 0.85)])`, '[0, 1]', 'Threshold 0.7', 'Prints [0, 1].'),
      pt('p1708_5', '5-mashq: Evklid Masofasi (KNN)', 'Task 5: 2D Euclidean Distance', '`(0, 0)` va `(3, 4)` nuqtalar orasidagi masofani toping.', 'Compute Euclidean distance.', `import math\nprint(math.hypot(3 - 0, 4 - 0))`, '5.0', 'math.hypot(dx, dy)', 'Prints 5.0.'),
    ],
    quiz: [
      q('q1708_1', 'Logistic Regression qaysi funksiya yordamida chiziqli natijani `[0, 1]` ehtimollikka aylantiradi?', 'Function used by Logistic Regression to squash linear logits into `(0, 1)` probabilities?', ['ReLU', 'Sigmoid (`1 / (1 + e^-z)`)', 'Gini', 'Euclidean'], ['ReLU', 'Sigmoid (`1 / (1 + e^-z)`)', 'Gini', 'Euclidean'], 1, 'Sigmoid funksiyasi.', 'Sigmoid function.'),
      q('q1708_2', 'Decision Tree tugunida barcha namunalar faqat bitta klassga tegishli bo‘lsa Gini Impurity nechaga teng?', 'Gini Impurity of a perfectly pure Decision Tree node containing only one class?', ['1.0', '0.0', '0.5', '-1.0'], ['1.0', '0.0', '0.5', '-1.0'], 1, '`0.0` (mutlaqo toza).', '`0.0`.'),
      q('q1708_3', 'Qaysi algoritm featurelarni scaling (`StandardScaler`) qilishni TALAB QILMAYDI?', 'Which algorithm does NOT strictly require numeric feature scaling?', ['KNN', 'Random Forest / Decision Tree', 'Logistic Regression', 'SVM'], ['KNN', 'Random Forest / Decision Tree', 'Logistic Regression', 'SVM'], 1, 'Tree-based modellar faqat chegara (`x > t`) tekshiradi.', 'Tree models split monotonically on single feature thresholds.'),
      q('q1708_4', 'Random Forest bitta Decision Tree dan nega odatda barqarorroq va aniqroq ishlaydi?', 'Why does Random Forest generalize much better than a single deep Decision Tree?', ['Chunki 1 qator', 'Ko‘plab turli daraxtlarning o‘rtacha ovozi individual shovqin/overfittingni so‘ndiradi (Bagging)', 'GPU', 'Linear'], ['1 line', 'Averaging many randomized trees reduces variance and cancels individual overfitting quirks', 'GPU', 'Linear'], 1, 'Bagging variance ni kamaytiradi.', 'Bagging slashes variance.'),
      q('q1708_5', 'Decision Tree overfittingini cheklaydigan eng asosiy giperparametr?', 'Primary Decision Tree hyperparameter limiting tree depth to curb overfitting?', ['n_jobs', 'max_depth', 'random_state', 'verbose'], ['n_jobs', 'max_depth', 'random_state', 'verbose'], 1, '`max_depth`.', '`max_depth`.'),
    ],
    homework: hw('Classification Suite & Review #38', 'Sigmoid, Gini & Ensemble Voting Lab', 'Sof Python da Sigmoid + Log-Loss hisoblagich, Decision Tree Gini splitter va 5 ta daraxt ehtimollarini Soft-Voting bilan birlashtiruvchi ansambl klassifikatori yozing.', 'Build a pure-Python classification toolkit computing sigmoid probabilities, Gini split gain, and soft-voting ensemble decisions.', ['Sigmoid + Gini split evaluator', 'Soft-voting ensemble + Review #38'], ['Sigmoid + Gini + Ensemble', 'Review #38 deliverable'], 'Compute weighted child Gini `(nL/N)*gL + (nR/N)*gR` to pick the cleanest split.', 'Strong classification fundamentals.', 'Review #38 loyihasini yakunlab Clustering ga o‘ting!', 'Complete Review #38.', 25),
    reviewCheckpoint: review(
      38,
      'Review Loyiha #38: Feature Pipeline + OLS Regression + Classification Ansambli!',
      'Review Project #38: Complete Supervised ML Modeling Suite!',
      '17-kurs 2–3-bo‘limlarini yakunlang: Leakage-free `StandardScaler` -> OLS Regression (MAE/RMSE/R²) va Sigmoid + Gini Classification ansamblini yagona modulda sinang.',
      'Combine leakage-free scaling, closed-form OLS regression metrics, and Sigmoid + Gini ensemble classification into one tested Python workbench.',
      ['Leakage-free scaler + OLS metrics', 'Sigmoid classifier + Gini splitter'],
      ['Scaler + OLS suite', 'Classifier + Gini suite'],
      `import math\n# Review #38: Supervised Regression & Classification Pipeline\nprint("Review #38 Supervised ML Suite Ready")`,
    ),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-09',
    courseId: 'ai_ml',
    moduleId: 'c17_m3',
    order: 9,
    titleUz: 'Clustering — K-Means Algoritmi, Centroid Yangilanishi, Elbow Method va Scaling Sharti',
    titleEn: 'Clustering: K-Means Optimization, Elbow Method, Silhouette & Scaling',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-17-08'],
    conceptId: 'ml_clustering',
    whyUz: "Har doim ham tayyor mijoz guruhlari (`VIP`, `Churned`) bo‘lmaydi! **K-Means Clustering** yorliqsiz (`y` siz) ma’lumotlardan o‘xshash segmentlarni avtomatik kashf qiladi: boshlang‘ich `K` ta markaz (`centroid`) qo‘yadi, nuqtalarni eng yaqin markazga biriktiradi va markazlarni guruh o‘rtachasiga ko‘chirib boradi!",
    whyEn: 'Implement K-Means clustering from first principles: iterative assignment & centroid recalculation until convergence, choosing `K` via Elbow (Inertia) and Silhouette scores, and scaling features before computing Euclidean distances.',
    analogyUz: "**K-Means** — shaharda `K` ta pochta bo‘limi ochishga o‘xshaydi: avval taxminan 3 ta nuqta qo‘yasiz, har bir uy eng yaqin bo‘limga birikadi, keyin har bo‘lim o‘z uylarining geometrik o‘rtasiga ko‘chadi — to markazlar joyidan siljimay qolguncha!",
    analogyEn: 'K-Means places `K` post offices, assigns each home to its closest hub, relocates every hub to its assigned homes’ center of gravity, and repeats until assignments stabilize.',
    stopsUz: "K-Means da 3 ta majburiy qoida: 1) **Scaling SHART!** Agar `daromad = $2000` va `yosh = 30` bo‘lsa, scaling qilmasangiz K-Means yoshni butunlay e’tiborsiz qoldirib faqat daromad bo‘yicha klasterlaydi! 2) **Inertia (WCSS) har doim `K` oshgani sari kamayadi** — shuning uchun minimal emas, **Elbow (tirsak burilishi)** yoki **Silhouette Score (`-1..+1`)** ga qarang! 3) Natija boshlang‘ich nuqtalarga bog‘liq -> doim **`n_init='auto'`, `random_state=42`** ishlating!",
    stopsEn: 'Always standardize features before K-Means so large-magnitude columns don’t crush small ones, pick `K` via Elbow inflection + Silhouette score rather than raw minimum inertia, and fix `random_state`.',
    objUz: ['K-Means 2 qadamli sikli: **Assign to Nearest Centroid -> Recompute Centroid Mean**', 'Inertia (WCSS), **Elbow Method** va **Silhouette** tushunchasi', 'Nega K-Means oldidan **StandardScaler** majburiy va klasterlarni biznes nomlash'],
    objEn: ['Code the iterative K-Means assignment and centroid update loop in pure Python', 'Use Inertia (Elbow Method) and Silhouette intuition to select optimal `K`', 'Understand why feature scaling is mandatory prior to distance-based clustering'],
    theoryUz: `### 1. K-Means Sikli
1. \`K\` ta markazni (\`centroids\`) boshlash.
2. **Assign**: Har nuqtani Evklid masofasi eng kichik centroidga biriktirish.
3. **Update**: Har klaster markazini o‘z a’zolarining o‘rtacha koordinatasiga ko‘chirish.
4. Markazlar o‘zgarmasa to‘xtash (\`converged\`)!
### 2. To‘g‘ri \`K\` Tanlash
- **Inertia (WCSS)**: nuqtalardan markazgacha kvadrat masofalar yig‘indisi. \`K\` oshsa kamayadi -> keskin sinish nuqtasi = **Elbow**.
- **Silhouette Score**: klaster ichki zichligi vs qo‘shni klasterdan uzoqligi (\`+1\` eng yaxshi).`,
    theoryEn: `### 1. The K-Means Loop
Initialize \`K\` centroids -> Assign each point to nearest centroid -> Recompute each centroid as the mean of assigned points -> Repeat until convergence.
### 2. Choosing \`K\`
Inspect Inertia (within-cluster sum of squares) for the **Elbow** bend and maximize **Silhouette Score** (\`[-1, 1]\`).`,
    examples: [
      ex('Misol 1: Sof Python da 2D K-Means Klasterlash (`K=2`)', 'Example 1: Pure-Python 2D K-Means Convergence', `points = [(1.0, 1.0), (1.5, 2.0), (8.0, 8.0), (9.0, 9.0)]
centroids = [(1.0, 1.0), (9.0, 9.0)]

for _ in range(5):
    clusters = [[], []]
    for x, y in points:
        d0 = (x - centroids[0][0]) ** 2 + (y - centroids[0][1]) ** 2
        d1 = (x - centroids[1][0]) ** 2 + (y - centroids[1][1]) ** 2
        clusters[0 if d0 <= d1 else 1].append((x, y))
    centroids = [
        (round(sum(p[0] for p in c) / len(c), 2), round(sum(p[1] for p in c) / len(c), 2))
        for c in clusters
    ]

print("Converged centroids:", centroids, "| Clusters:", clusters)`, `Converged centroids: [(1.25, 1.5), (8.5, 8.5)] | Clusters: [[(1.0, 1.0), (1.5, 2.0)], [(8.0, 8.0), (9.0, 9.0)]]`, 'Atigi 5 iteratsiyada markazlar haqiqiy guruhlar markaziga `(1.25, 1.5)` va `(8.5, 8.5)` ga joylashdi!', 'Converges two 2D centroids cleanly onto both natural spatial groups.'),
      ex('Misol 2: Inertia (WCSS) & Elbow Method Tushunchasi', 'Example 2: Computing Within-Cluster Inertia (WCSS)', `def inertia(clusters, centroids):
    total = 0.0
    for c, (cx, cy) in zip(clusters, centroids):
        total += sum((x - cx) ** 2 + (y - cy) ** 2 for x, y in c)
    return round(total, 3)

c = [[(1.0, 1.0), (1.5, 2.0)], [(8.0, 8.0), (9.0, 9.0)]]
print("K=2 Inertia (WCSS):", inertia(c, [(1.25, 1.5), (8.5, 8.5)]))`, `K=2 Inertia (WCSS): 1.625`, 'WCSS har klaster markazidan nuqtalargacha kvadrat masofalar yig‘indisini o‘lchaydi.', 'Calculates WCSS inertia used to spot the Elbow inflection as K increases.'),
      ex('Misol 3: Klasterlarni Biznes Tilda Nomlash (Profiling)', 'Example 3: Business Naming of Discovered Clusters', `cluster_profiles = {0: {"avg_spend": 18, "freq": 1}, 1: {"avg_spend": 450, "freq": 12}}
names = {k: ("VIP Loyal" if v["avg_spend"] > 200 else "Occasional Buyer") for k, v in cluster_profiles.items()}
print("Named segments:", names)`, `Named segments: {0: 'Occasional Buyer', 1: 'VIP Loyal'}`, 'K-Means raqamli ID (`0, 1`) beradi; analitik har klaster o‘rtachasiga qarab biznes nom beradi!', 'Interprets raw numeric cluster IDs into actionable marketing personas.'),
    ],
    traceTitleUz: 'K-Means (Assign -> Update -> Converge) Trace',
    traceTitleEn: 'Tracing K-Means Optimization Step',
    traceCode: `points -> assign nearest centroid -> average cluster -> update`,
    traceSteps: [
      traceStep(1, 'Init K=2 centroids', '(1,1) & (9,9)', 'Boshlang‘ich markazlar olindi', 'Initialized starting centroids'),
      traceStep(2, 'Assign points', '2 per cluster', 'Har nuqta eng yaqin markazga', 'Assigned points by Euclidean dist'),
      traceStep(3, 'Update means', '(1.25,1.5) & (8.5,8.5)', 'Markazlar o‘rtachaga ko‘chdi', 'Moved centroids to cluster means'),
    ],
    commonMistakes: [
      mistake('Scaling qilmasdan `yosh` (20..60) va `daromad` (500..10000) ni K-Means ga berish', 'Running K-Means Without Scaling Mixed-Unit Features', `# Income distances (~5,000) crush Age distances (~20), making K-Means ignore Age completely!`, 'Meaningless skewed clusters', `print("Standardize features with StandardScaler before calling KMeans!")`, 'Masofaga asoslangan algoritmlardan (K-Means, KNN) oldin doim scaling qiling.', 'Scale features before Euclidean K-Means so every dimension contributes fairly.', 'K-Means oldidan scaling qiling.', 'Scale features before K-Means.'),
      mistake('Inertia eng kichik bo‘ldi deb `K = N` (har nuqta alohida klaster) ni tanlash', 'Picking K Simply by Minimizing Raw Inertia', `# Inertia drops all the way to 0 when K equals the number of rows—completely useless clusters!`, 'Over-fragmented clusters', `print("Pick K at the Elbow bend or maximum Silhouette Score, never raw minimum inertia!")`, 'Inertia tirsak sinish nuqtasi (`Elbow`) va Silhouette maksimali bilan `K` tanlang.', 'Use the Elbow bend and Silhouette Score rather than raw minimum inertia to choose `K`.', 'Elbow va Silhouette ga qarang.', 'Use Elbow & Silhouette.'),
    ],
    compareTitleUz: 'K-Means vs DBSCAN (Density Clustering)',
    compareTitleEn: 'K-Means vs DBSCAN',
    compareUz: ['K-Means: tez, soddaligi yuqori, lekin `K` ni oldindan berish kerak va yumaloq klasterlarni yaxshi ajratadi.', 'DBSCAN: `K` berilmaydi, ixtiyoriy shakldagi klasterlarni topadi va shovqin (outlier `-1`) ni alohida belgilaydi.'],
    compareEn: ['K-Means: fast and simple; requires specifying `K`; assumes spherical clusters.', 'DBSCAN: infers cluster count automatically, handles arbitrary shapes, and flags noise outliers.'],
    compareSummaryUz: 'K-Means dan oldin featurelarni masshtablang, Assign/Update siklini biling, Elbow & Silhouette bilan `K` tanlang va klasterlarni biznes tilida talqin qiling.',
    compareSummaryEn: 'Standardize features prior to K-Means, select `K` via Elbow & Silhouette analysis, and profile resulting clusters into meaningful segments.',
    practiceTasks: [
      pt('p1709_1', '1-mashq: Kvadrat Evklid Masofasi', 'Task 1: Squared Euclidean Distance', '`(1, 2)` va `(4, 6)` orasidagi kvadrat masofani toping.', 'Compute squared distance.', `print((4 - 1) ** 2 + (6 - 2) ** 2)`, '25', 'dx^2 + dy^2', 'Prints 25.'),
      pt('p1709_2', '2-mashq: Yangi Centroid Hisoblash', 'Task 2: Recompute 2D Centroid', '`[(2, 4), (6, 8), (4, 6)]` klasterining markazini toping.', 'Compute cluster centroid.', `pts = [(2, 4), (6, 8), (4, 6)]\nprint((sum(p[0] for p in pts) / 3, sum(p[1] for p in pts) / 3))`, '(4.0, 6.0)', 'Average x and y', 'Prints (4.0, 6.0).'),
      pt('p1709_3', '3-mashq: 1D WCSS Inertia', 'Task 3: 1D Cluster Inertia', 'Markaz `5.0`, nuqtalar `[3, 5, 7]` bo‘lsa kvadrat xatolar yig‘indisini toping.', 'Compute 1D inertia.', `print(sum((x - 5.0) ** 2 for x in (3, 5, 7)))`, '8.0', 'sum((x - mu)^2)', 'Prints 8.0.'),
      pt('p1709_4', '4-mashq: Eng Yaqin Centroid Indeksi', 'Task 4: Nearest Centroid Index', '1D markazlar `[10, 50, 90]` da `x=54` ga eng yaqin indeksni toping.', 'Find closest centroid.', `cs = [10, 50, 90]\nprint(min(range(3), key=lambda i: abs(54 - cs[i])))`, '1', 'argmin distance', 'Prints 1.'),
      pt('p1709_5', '5-mashq: Elbow Tirsak Tekshiruvi', 'Task 5: Largest Inertia Drop', 'Inertialar `[100, 30, 22, 18]` da eng katta tushish qaysi o‘tishda?', 'Find largest drop.', `w = [100, 30, 22, 18]\ndrops = [w[i] - w[i + 1] for i in range(len(w) - 1)]\nprint("Best K transition index:", drops.index(max(drops)) + 2)`, 'Best K transition index: 2', 'Largest drop from K=1 to K=2', 'Prints index 2.'),
    ],
    quiz: [
      q('q1709_1', 'K-Means algoritmi har iteratsiyada qaysi 2 asosiy qadamni takrorlaydi?', 'What two core steps alternate inside every K-Means iteration?', ['Sort & Hash', '1) Nuqtalarni eng yaqin centroidga biriktirish; 2) Centroidlarni guruh o‘rtachasiga ko‘chirish', 'Gradient & ReLU', 'Join & Split'], ['Sort & Hash', '1) Assign points to nearest centroid; 2) Recompute centroids as cluster means', 'Gradient', 'Join'], 1, 'Assign -> Update.', 'Assign -> Update centroids.'),
      q('q1709_2', 'Nima uchun K-Means chaqirishdan OLDIN `StandardScaler` ishlatish shart?', 'Why is `StandardScaler` essential before running K-Means?', ['Tezroq', 'Evklid masofasida katta shkalali ustun (`$10,000`) kichik ustunni (`yosh`) bosib ketmasligi uchun', 'JSON', 'SQL'], ['Faster', 'Prevents large-scale units from dominating Euclidean distance over small-scale columns', 'JSON', 'SQL'], 1, 'Masofa o‘lchovi shkalaga sezgir.', 'Euclidean distance is scale-sensitive.'),
      q('q1709_3', 'Inertia (WCSS) `K` ko‘paygani sari nima bo‘ladi?', 'How does within-cluster Inertia behave as `K` increases toward `N`?', ['Oshadi', 'Doimiy kamayadi (hatto `K=N` da `0` ga tushadi)', 'O‘zgarmaydi', 'Manfiy'], ['Increases', 'Monotonically decreases toward 0 when K equals sample count', 'Constant', 'Negative'], 1, 'Kamayib boradi -> Elbow ko‘riladi.', 'Decreases monotonically -> use Elbow/Silhouette.'),
      q('q1709_4', 'Silhouette Score qiymati qaysi oraliqda bo‘ladi va qanday qiymat eng yaxshi klasterlashni bildiradi?', 'Range and optimal value of the Silhouette Score?', ['[0, 100], 0', '[-1, +1], +1 ga yaqin qiymat (zich va yaxshi ajralgan klasterlar)', '(-inf, 0)', '10..50'], ['[0, 100]', '[-1, +1], values near +1 indicate dense, well-separated clusters', '(-inf, 0)', '10..50'], 1, '`[-1, +1]`, `+1` ideal.', '`[-1, +1]`, near `+1` ideal.'),
      q('q1709_5', 'Yumaloq bo‘lmagan shakldagi klasterlarni topib, shovqin nuqtalarni (`-1`) ajratuvchi clustering algoritmi?', 'Density-based clustering method handling non-spherical shapes and flagging noise outliers?', ['Linear Regression', 'DBSCAN', 'Ridge', 'KNN'], ['Linear Regression', 'DBSCAN', 'Ridge', 'KNN'], 1, 'DBSCAN.', 'DBSCAN.'),
    ],
    homework: hw('Pure-Python K-Means & Elbow Profiler', 'From-Scratch K-Means & Inertia Selector', 'Ixtiyoriy 2D nuqtalar ro‘yxatini `K=1..4` gacha K-Means bilan klasterlab, har bir `K` uchun WCSS Inertiasini chiqaruvchi va Elbow `K` ni taklif qiluvchi skript yozing.', 'Implement pure-Python K-Means clustering sweeping `K = 1..4`, computing converged centroids, reporting WCSS inertia per `K`, and recommending the Elbow inflection.', ['K-Means convergence loop', 'K=1..4 Inertia Sweep'], ['Converged centroids', 'Elbow inertia table'], 'Normalize coordinates (StandardScaler) before computing Euclidean distances.', 'Crisp unsupervised ML skill.', 'Keyingi darsda Model Training va Hyperparameter Tuning ga o‘tamiz!', 'Tuning & learning curves next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-10',
    courseId: 'ai_ml',
    moduleId: 'c17_m4',
    order: 10,
    titleUz: 'Model Training — Learning Curves, Early Stopping, Grid/Random Search va Class Balance',
    titleEn: 'Model Training Mastery: Learning Curves, Early Stopping & Hyperparameter Search',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-17-09'],
    conceptId: 'ml_training',
    whyUz: "Modelni bir marta `.fit()` qilish bu faqat boshlanishi! Kuchli ML muhandis **Parameters** (model ichidan o‘rganadigan `w, b`) vs **Hyperparameters** (siz tashqaridan beradigan `max_depth`, `lr`, `C`) ni ajratadi, **Learning Curves** orqali Overfit/Underfit ni o‘qiydi, **Early Stopping** bilan ortiqcha epoxalarni to‘xtatadi va **Randomized Search** bilan eng yaxshi sozlamani topadi!",
    whyEn: 'Master practical model training: distinguish learned parameters from tuned hyperparameters, diagnose bias/variance from Train/Val learning curves, enforce Early Stopping with `patience`, compare Grid vs Random Search, and handle class imbalance.',
    analogyUz: "**Parameters** — mashina o‘rganish paytida rul va gazni boshqarishni o‘zi moslaydigan harakatlar (`w, b`). **Hyperparameters** — siz poygadan OLDIN sozlaydigan uzatmalar qutisi va shina bosimi (`max_depth`, `learning_rate`). Siz imtihonga qarab sozlamaysiz — **Validation / CV** ga qarab sozlaysiz!",
    analogyEn: 'Parameters are weights adjusted internally during `.fit()`; hyperparameters are architectural settings chosen externally via Validation/CV tuning.',
    stopsUz: "Training jarayonidagi 3 ta professional usul: 1) **Early Stopping (`patience=3`)**: agar Validation Loss ketma-ket 3 epoxada yaxshilanmasa (balki oshishni boshlasa!), darhol to‘xtang va **eng yaxshi eng past Val Loss dagi checkpointni saqlab qoling**! 2) **Random Search ko‘pincha Grid Search dan ustun**: 2 ta muhim parametrga kengroq qiymatlar sinashga imkon beradi! 3) **Nomutanosib klasslar (`95% vs 5%`)** da dublikat ko‘paytirishdan oldin `class_weight='balanced'` sinab ko‘ring!",
    stopsEn: 'Use Early Stopping with patience to restore the best validation checkpoint before overfitting, prefer Randomized Search over exhaustive grids in larger search spaces, and apply `class_weight="balanced"` on imbalanced classification.',
    objUz: ['Learned Parameters (`w, b`) vs Hyperparameters (`lr`, `max_depth`, `C`)', 'Learning Curves (Train Loss vs Val Loss) tahlili & **Early Stopping** checkpointing', 'Grid Search vs Randomized Search va Imbalanced Data (`class_weight="balanced"`)'],
    objEn: ['Separate learned parameters from external hyperparameters', 'Implement Early Stopping with validation patience and best-epoch tracking', 'Compare Grid vs Random hyperparameter search and balanced class weighting'],
    theoryUz: `### 1. Early Stopping
\`train_loss\` tushishda davom etib, \`val_loss\` ko‘tarila boshlagan nuqta = Overfitting boshlanishi! \`patience\` epoxa kutib eng yaxshi checkpointga qaytamiz.
### 2. Grid Search vs Randomized Search
- **Grid Search**: barcha kombinatsiyalar (\`3 x 3 = 9\`) — kichik fazoda yaxshi.
- **Randomized Search**: tasodifiy \`N\` ta namuna — ko‘p parametrda ancha samarali!
### 3. Class Weight Balancing
\`weight_c = N_total / (2 * N_c)\` -> kam sonli klass xatolariga kattaroq jarima beradi!`,
    theoryEn: `### 1. Early Stopping
Monitor validation loss per epoch; snapshot the best weights and halt training if no improvement occurs for \`patience\` epochs.
### 2. Grid vs Randomized Search
Grid Search checks every combination; Randomized Search samples diverse configurations far more efficiently when only some hyperparameters dominate.
### 3. Class Weighting
Inverse class-frequency weights penalize minority-class mistakes proportionally higher during training.`,
    examples: [
      ex('Misol 1: Early Stopping (`patience=2`) + Best Checkpoint Tiklash', 'Example 1: Early Stopping Simulator', `val_losses = [0.80, 0.55, 0.42, 0.44, 0.48, 0.52]
best_loss, best_epoch, wait, patience = float("inf"), -1, 0, 2
stopped_at = None

for epoch, loss in enumerate(val_losses):
    if loss < best_loss:
        best_loss, best_epoch, wait = loss, epoch, 0
    else:
        wait += 1
        if wait >= patience:
            stopped_at = epoch
            break

print(f"Stopped at epoch {stopped_at} | Restoring best epoch {best_epoch} (val_loss={best_loss})")`, `Stopped at epoch 4 | Restoring best epoch 2 (val_loss=0.42)`, '`val_loss` 2-epoxadan keyin osha boshlagani uchun `patience=2` bilan 4-epoxada to‘xtalib, eng yaxshi 2-epoxa saqlandi!', 'Halts training after 2 non-improving epochs and restores the optimal epoch-2 checkpoint.'),
      ex('Misol 2: Grid Search Kombinatsiyalarini Aylanish', 'Example 2: Hyperparameter Grid Search Selection', `candidates = [(d, lr, round(0.75 + 0.02 * d - abs(lr - 0.1), 3)) for d in (2, 4) for lr in (0.05, 0.1)]
best = max(candidates, key=lambda t: t[2])
print("All CV scores:", candidates)
print("Best (depth, lr, cv_score):", best)`, `All CV scores: [(2, 0.05, 0.74), (2, 0.1, 0.79), (4, 0.05, 0.78), (4, 0.1, 0.83)]\nBest (depth, lr, cv_score): (4, 0.1, 0.83)`, 'Har bir `(depth, lr)` juftligi Cross-Validation balli bo‘yicha taqqoslanib eng yuqorisi tanlandi.', 'Evaluates candidate hyperparameter tuples on validation score and selects the top config.'),
      ex('Misol 3: `class_weight="balanced"` Og‘irliklarini Hisoblash', 'Example 3: Computing Balanced Class Weights', `counts = {0: 90, 1: 10}
total = sum(counts.values())
weights = {c: round(total / (len(counts) * cnt), 2) for c, cnt in counts.items()}
print("Balanced weights:", weights)`, `Balanced weights: {0: 0.56, 1: 5.0}`, '10% lik kam uchraydigan klass xatosi treningda `5.0 / 0.56 ≈ 9x` kuchliroq jazolandi!', 'Computes inverse-frequency weights so rare minority samples aren’t ignored during fitting.'),
    ],
    traceTitleUz: 'Early Stopping Loop Trace',
    traceTitleEn: 'Tracing Early Stopping Checkpoints',
    traceCode: `val_losses = [0.80, 0.55, 0.42, 0.44, 0.48], patience=2`,
    traceSteps: [
      traceStep(1, 'Epoch 2', 'best=0.42, wait=0', 'Yangi rekord saqlandi', 'Saved best checkpoint'),
      traceStep(2, 'Epoch 3', '0.44 > 0.42 -> wait=1', 'Yaxshilanmadi (sabrlilik 1)', 'Patience counter incremented'),
      traceStep(3, 'Epoch 4', '0.48 > 0.42 -> wait=2 -> STOP', 'To‘xtadi, Epoch 2 tiklandi', 'Halted & restored Epoch 2'),
    ],
    commonMistakes: [
      mistake('Oversampling (SMOTE) ni `train_test_split` dan OLDIN qilib yuborish', 'Applying SMOTE or Oversampling Before Splitting Train/Test', `# Oversampling the full dataset puts near-identical synthetic clones in BOTH Train and Test—fake 99% accuracy!`, 'Catastrophic data leakage', `print("Oversample ONLY inside the training fold—never before splitting Train and Test!")`, 'Oversampling/SMOTE faqat `X_train` ichida (yoki CV fold ichida) bajarilishi shart.', 'Apply oversampling strictly inside training folds after splitting off Test.', 'Oversampling faqat Train da bo‘lsin.', 'Oversample train fold only.'),
      mistake('Early Stopping dan keyin eng yaxshi (`best_epoch`) o‘rniga oxirgi overfit bo‘lgan epoxani saqlash', 'Keeping Final Epoch Weights Instead of Best Validation Checkpoint', `# By the time patience expires, the last epoch weights have already drifted slightly worse than best_epoch!`, 'Suboptimal deployed weights', `print("Snapshot weights whenever val_loss improves, and restore that best snapshot on stop!")`, 'To‘xtaganda oxirgi emas, `best_loss` qayd etilgan checkpointni tiklang.', 'Restore the saved best-validation weights when Early Stopping triggers.', 'Eng yaxshi checkpointni tiklang.', 'Restore best checkpoint.'),
    ],
    compareTitleUz: 'Grid Search vs Randomized Search',
    compareTitleEn: 'Grid Search vs Randomized Search',
    compareUz: ['Grid Search: 2–3 parametrli kichik to‘plamda barcha nuqtalarni tekshiradi (kombinatsiyalar eksponensial oshadi!).', 'Randomized Search: bir xil byudjetda har bir muhim parametrning ko‘proq noyob qiymatlarini sinaydi.'],
    compareEn: ['Grid Search: exhaustive over small parameter sets; scales poorly in high dimensions.', 'Randomized Search: explores wider continuous intervals at fixed compute budget.'],
    compareSummaryUz: 'Training vs Validation egri chizig‘ini kuzating, `Early Stopping (patience)` bilan eng yaxshi checkpointni saqlang va CV ichida Grid/Random Search qo‘llang.',
    compareSummaryEn: 'Track train/val learning curves, enforce Early Stopping with best-checkpoint restoration, and tune hyperparameters cleanly inside cross-validation.',
    practiceTasks: [
      pt('p1710_1', '1-mashq: Parameter vs Hyperparameter', 'Task 1: Classify Model Configs', '`"weight_w"`, `"max_depth"` qaysi biri Hyperparameter?', 'Identify hyperparameter.', `print("weight_w -> Learned Parameter | max_depth -> Hyperparameter")`, 'weight_w -> Learned Parameter | max_depth -> Hyperparameter', 'Distinguish learned vs chosen', 'Prints classification.'),
      pt('p1710_2', '2-mashq: Grid Kombinatsiyalar Soni', 'Task 2: Count Grid Trials', '3 ta `lr` x 4 ta `depth` x `cv=5` jami nechta model o‘qitiladi?', 'Count total fits.', `print(3 * 4 * 5)`, '60', '3 * 4 * 5', 'Prints 60.'),
      pt('p1710_3', '3-mashq: Balanced Class Weight', 'Task 3: Minority Class Weight', 'Jami 100 ta (`95` ta 0, `5` ta 1) da `1` klassi vazni (`100 / (2 * 5)`) necha?', 'Compute class weight.', `print(100 / (2 * 5))`, '10.0', 'N / (2 * count)', 'Prints 10.0.'),
      pt('p1710_4', '4-mashq: Best Validation Epoch', 'Task 4: Argmin Best Epoch', '`[0.9, 0.4, 0.5, 0.6]` dan eng kichik val loss epoxa indeksini toping.', 'Find best epoch index.', `v = [0.9, 0.4, 0.5, 0.6]\nprint(v.index(min(v)))`, '1', 'index of min', 'Prints 1.'),
      pt('p1710_5', '5-mashq: Overfit Nuqtasini Aniqlash', 'Task 5: Train vs Val Gap Check', 'Train loss tushib (`0.05`), Val loss oshsa (`0.60`) qaysi holat?', 'Identify curve state.', `print("Overfitting" if 0.60 - 0.05 > 0.2 else "Healthy")`, 'Overfitting', 'Check diverging gap', 'Prints Overfitting.'),
    ],
    quiz: [
      q('q1710_1', 'Qaysi biri model `.fit()` paytida o‘zi o‘rganadigan PARAMETER hisoblanadi?', 'Which item is a learned internal PARAMETER updated during `.fit()`?', ['max_depth', 'Chiziqli og‘irliklar `w` va bias `b`', 'learning_rate', 'n_estimators'], ['max_depth', 'Model weights `w` and bias `b`', 'learning_rate', 'n_estimators'], 1, '`w` va `b` ichki parametrlar.', 'Weights & biases are learned parameters.'),
      q('q1710_2', 'Early Stopping `patience=3` da Validation Loss 4-epoxada ham yaxshilanmasa nima qilinadi?', 'Action taken when Early Stopping triggers after `patience` non-improving epochs?', ['Epoch 0 ga qaytish', 'Trening to‘xtatiladi va eng past `val_loss` bergan saqlangan checkpoint tiklanadi', 'Test data qo‘shish', 'lr=10'], ['Reset to 0', 'Halt training and restore the best previously saved validation checkpoint', 'Add test', 'lr=10'], 1, 'To‘xtatish + best checkpoint tiklash.', 'Stop & restore best validation checkpoint.'),
      q('q1710_3', 'Ko‘p giperparametrli fazoda cheklangan vaqt bilan nega ko‘pincha Randomized Search Grid Search dan yaxshiroq?', 'Why does Randomized Search often beat Grid Search under a fixed trial budget?', ['Hech qachon', 'Muhim parametrlarning ko‘proq noyob qiymatlarini sinab ko‘rish imkonini beradi', 'Tezlik 1000x', 'CSV'], ['Never', 'Samples diverse unique values for key hyperparameters rather than wasting trials on redundant grid corners', '1000x', 'CSV'], 1, 'Muhim o‘qlarda ko‘proq noyob nuqta sinaydi.', 'Better coverage of influential dimensions.'),
      q('q1710_4', '98% salbiy va 2% ijobiy (fraud) datasetda kam uchraydigan klass xatolariga katta jarima berish usuli?', 'Clean built-in sklearn approach to penalize minority class errors higher on imbalanced data?', ['Accuracy', 'class_weight="balanced"', 'drop(y==0)', 'shuffle=False'], ['Accuracy', 'class_weight="balanced"', 'drop(y==0)', 'shuffle=False'], 1, '`class_weight="balanced"`.', '`class_weight="balanced"`.'),
      q('q1710_5', 'Nima uchun giperparametrlarni `Test` setiga qarab emas, `Validation / CV` ga qarab tanlash kerak?', 'Why tune hyperparameters on Validation / CV rather than the final Test set?', ['Test kichik', 'Test ga qarab tanlash Test ma’lumotiga yashirin overfitting yaratadi', 'Syntax', 'GPU'], ['Small', 'Repeatedly tuning against Test leaks test info and biases final evaluation', 'Syntax', 'GPU'], 1, 'Test xolis final baho uchun saqlanishi shart.', 'Prevents test-set overfitting.'),
    ],
    homework: hw('Early Stopping & Hyperparameter Tuner', 'Early Stopping & Balanced Weight Simulator', 'Validation loss ketma-ketligida `patience=3` bilan Early Stopping + best checkpoint tiklovchi hamda `(max_depth, lr)` grid dan eng yaxshi CV sozlamani tanlovchi tuner yozing.', 'Implement an Early Stopping controller (`patience`, best checkpoint restoration) paired with a pure-Python hyperparameter CV grid tuner and balanced class-weight calculator.', ['EarlyStopping controller + Best checkpoint', 'CV tuner + class_weight'], ['EarlyStopping + Tuner', 'Class weight calculator'], 'Track `best_score`, `best_config`, and `wait` explicitly across epochs.', 'Production training discipline.', 'Keyingi darsda Model Evaluation (Precision, Recall, F1, Confusion Matrix) ni o‘rganamiz!', 'Evaluation metrics next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-11',
    courseId: 'ai_ml',
    moduleId: 'c17_m4',
    order: 11,
    titleUz: 'Model Evaluation — Accuracy Paradox, Confusion Matrix, Precision / Recall / F1 va Threshold',
    titleEn: 'Model Evaluation: Accuracy Paradox, Confusion Matrix, Precision/Recall/F1 & Threshold Tuning',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-17-10'],
    conceptId: 'ml_evaluation',
    whyUz: "Tasavvur qiling, siz saraton yoki bank firibgarligi modeli yozdingiz va **«99% Accuracy!»** chiqdi — aslida esa ma’lumotning 99% i sog‘lom bo‘lib, model **hammaga \"sog‘lom\" deb javob bermoqda** (barcha bemorlarni o‘tkazib yuboryapti!). Bu **Accuracy Paradox** dir! Haqiqiy ML baholash **Confusion Matrix (`TP, FP, FN, TN`), Precision, Recall, F1-Score va Decision Threshold tuning** bilan qilinadi.",
    whyEn: 'Master classification evaluation beyond naive Accuracy: dissect Confusion Matrices (`TP, FP, FN, TN`), balance Precision vs Recall via `F1-score`, handle the Accuracy Paradox on rare events, and tune decision thresholds.',
    analogyUz: "**Precision** — «Chalingan yong‘in signalining necha foizi HAQIQIY yong‘in?» (soxta vahimalardan saqlanish). **Recall** — «Haqiqiy yong‘inlarning necha foizini TUTIB OLDIK?» (hech birini o‘tkazib yubormaslik)! Kasallik va firibgarlikda **Recall** hayot-mamot; spamda esa **Precision** muhim (muhim xat spamga tushmasin)!",
    analogyEn: 'Precision asks "When the alarm rings, how often is it real?"; Recall asks "Of all real emergencies, how many did we catch?"',
    stopsUz: "Evaluation da 3 ta qoida: 1) **Nomutanosib klasslarda HECH QACHON yolg‘iz `Accuracy` ga ishonmang** — har doim `Precision`, `Recall`, `F1` va `PR-AUC` ko‘ring! 2) **`Threshold = 0.5` qonun emas**: `0.3` ga tushirsangiz Recall oshadi (ko‘proq kasallik tutasiz), `0.8` ga ko‘tarsangiz Precision oshadi! 3) `TP = FP = 0` bo‘lganda `0 / 0` `ZeroDivisionError` dan himoyalaning!",
    stopsEn: 'Never trust raw Accuracy on imbalanced targets; inspect TP/FP/FN/TN confusion counts, adjust classification thresholds away from default `0.5` to trade Precision vs Recall, and guard `0/0` metric denominators.',
    objUz: ['**Accuracy Paradox** va **Confusion Matrix** (`TP`, `FP`, `FN`, `TN`)', '**Precision**, **Recall**, **F1-Score** (`2*P*R / (P+R)`) formulalari va biznes tanlovi', '**Threshold Tuning** (`0.3` vs `0.5` vs `0.8`) orqali Precision-Recall muvozanati'],
    objEn: ['Expose the Accuracy Paradox and compute TP/FP/FN/TN confusion counts', 'Calculate Precision, Recall, and F1-Score cleanly in Python', 'Tune probability decision thresholds to align with asymmetric business error costs'],
    theoryUz: `### 1. Confusion Matrix
- **TP**: To‘g‘ri ijobiy. **TN**: To‘g‘ri salbiy.
- **FP (Type I)**: Soxta signal ("spam emas xatni spam dedi").
- **FN (Type II)**: O‘tkazib yuborish ("kasal odamni sog‘lom dedi").
### 2. Precision, Recall, F1
- \`Precision = TP / (TP + FP)\`
- \`Recall    = TP / (TP + FN)\`
- \`F1        = 2 * Precision * Recall / (Precision + Recall)\` (garmonik o‘rta!)`,
    theoryEn: `### 1. Confusion Matrix Counts
Track True Positives (\`TP\`), False Positives (\`FP\`), False Negatives (\`FN\`), and True Negatives (\`TN\`).
### 2. Core Metrics
- \`Precision = TP / (TP + FP)\`
- \`Recall = TP / (TP + FN)\`
- \`F1 = 2 * P * R / (P + R)\` (harmonic mean punishing lopsided Precision/Recall).`,
    examples: [
      ex('Misol 1: Confusion Matrix, Precision, Recall & F1 (Zero-Division Himoyasi Bilan)', 'Example 1: Computing Confusion Matrix & F1-Score', `y_true = [1, 1, 1, 0, 0, 0]
y_pred = [1, 1, 0, 1, 0, 0]

tp = sum(t == 1 and p == 1 for t, p in zip(y_true, y_pred))
fp = sum(t == 0 and p == 1 for t, p in zip(y_true, y_pred))
fn = sum(t == 1 and p == 0 for t, p in zip(y_true, y_pred))
tn = sum(t == 0 and p == 0 for t, p in zip(y_true, y_pred))

prec = tp / (tp + fp) if (tp + fp) else 0.0
rec  = tp / (tp + fn) if (tp + fn) else 0.0
f1   = 2 * prec * rec / (prec + rec) if (prec + rec) else 0.0
print(f"TP={tp} FP={fp} FN={fn} TN={tn} | P={prec:.2f} R={rec:.2f} F1={f1:.2f}")`, `TP=2 FP=1 FN=1 TN=2 | P=0.67 R=0.67 F1=0.67`, 'Barcha 4 katak (`TP, FP, FN, TN`) hamda Precision, Recall va F1 aniq hisoblandi.', 'Computes complete confusion counts and safe Precision, Recall, and F1 metrics.'),
      ex('Misol 2: Accuracy Paradoxni Fosh Qilish (99% Accuracy = 0.0 F1!)', 'Example 2: Exposing the Accuracy Paradox', `y_true = [0] * 99 + [1]  # 1% fraud
y_pred = [0] * 100      # naive always-zero model!
acc = sum(t == p for t, p in zip(y_true, y_pred)) / 100
tp = sum(t == 1 and p == 1 for t, p in zip(y_true, y_pred))
print(f"Accuracy={acc:.0%} (LOOKS GREAT!) | Recall/TP={tp} (CAUGHT ZERO FRAUDS!)")`, `Accuracy=99% (LOOKS GREAT!) | Recall/TP=0 (CAUGHT ZERO FRAUDS!)`, 'Model bitta ham firibgarlikni tutmadi, lekin Accuracy 99% chiqib ko‘zni aldayapti!', 'Demonstrates why 99% Accuracy fails completely when positive events occur rarely.'),
      ex('Misol 3: Decision Threshold Tuning (`0.3` vs `0.7`)', 'Example 3: Tuning Classification Threshold', `probs  = [0.2, 0.4, 0.6, 0.9]
y_true = [0, 1, 0, 1]
for th in (0.35, 0.75):
    preds = [int(p >= th) for p in probs]
    tp = sum(t == 1 and p == 1 for t, p in zip(y_true, preds))
    fp = sum(t == 0 and p == 1 for t, p in zip(y_true, preds))
    fn = sum(t == 1 and p == 0 for t, p in zip(y_true, preds))
    print(f"Threshold {th}: TP={tp}, FP={fp}, FN={fn}")`, `Threshold 0.35: TP=2, FP=1, FN=0\nThreshold 0.75: TP=1, FP=0, FN=1`, 'Threshold `0.35` barcha ijobiyni tutdi (`FN=0`, 100% Recall); `0.75` esa soxta signalni nolga tushirdi (`FP=0`, 100% Precision)!', 'Shows directly how lowering threshold boosts Recall while raising it boosts Precision.'),
    ],
    traceTitleUz: 'Threshold -> Confusion Matrix -> F1 Trace',
    traceTitleEn: 'Tracing Evaluation Metrics',
    traceCode: `probs -> threshold(0.35) -> TP=2, FP=1, FN=0 -> Recall=1.0`,
    traceSteps: [
      traceStep(1, 'Apply threshold', '0.35', 'Ehtimollar 0/1 ga o‘girildi', 'Binarized predicted probabilities'),
      traceStep(2, 'Count TP/FP/FN', '2, 1, 0', 'Matritsa to‘ldirildi', 'Built confusion matrix'),
      traceStep(3, 'Precision & Recall', 'P=0.67, R=1.0', 'Biznesga mos trade-off', 'Quantified Precision-Recall'),
    ],
    commonMistakes: [
      mistake('1% firibgarlik datasetida modelni `Accuracy = 99%` deb qabul qilish', 'Accepting Naive High Accuracy on Imbalanced Datasets', `# A model predicting constant 0 achieves 99% accuracy yet 0.00 Recall on real fraud cases!`, 'Zero minority-class detection', `print("Always report Precision, Recall, F1, and PR-AUC on imbalanced datasets!")`, 'Nomutanosib klasslarda Accuracy o‘rniga F1, Recall va PR-AUC ko‘ring.', 'Inspect Precision, Recall, F1, and PR-AUC instead of raw Accuracy on rare classes.', 'Imbalanced da F1/Recall ko‘ring.', 'Check F1/Recall on rare classes.'),
      mistake('`Recall = 1.0, Precision = 0.02` bo‘lganda o‘rtacha `0.51` deb o‘ylash', 'Using Arithmetic Average Instead of Harmonic F1', `# Arithmetic mean of 1.0 and 0.02 is 0.51 (misleading!), whereas F1 harmonic mean is only 0.04!`, 'Misleading model scoring', `p, r = 0.02, 1.0\nprint("Arithmetic:", (p + r) / 2, "| True F1:", round(2 * p * r / (p + r), 3))`, 'F1 garmonik o‘rta bo‘lib bir tomonlama yomon natijani qattiq jazolaydi.', 'F1 uses the harmonic mean specifically to penalize lopsided Precision/Recall extremes.', 'Garmonik F1 ishlating.', 'Use harmonic F1.'),
    ],
    compareTitleUz: 'Precision vs Recall vs F1 vs Threshold Tuning',
    compareTitleEn: 'Classification Metrics Compared',
    compareUz: ['Precision (`TP/(TP+FP)`): Soxta signal qimmat bo‘lganda (Spam filtri, Sud ayblovi).', 'Recall (`TP/(TP+FN)`): O‘tkazib yuborish xavfli bo‘lganda (Saraton skriningi, Bank firibgarligi).', 'F1-Score: Ikkalasi ham muhim bo‘lganda garmonik balans.'],
    compareEn: ['Precision: critical when False Positives hurt (spam filters).', 'Recall: critical when False Negatives hurt (medical/fraud screening).', 'F1: harmonic balance of Precision and Recall.'],
    compareSummaryUz: 'TP/FP/FN/TN matritsani chiqaring, Accuracy Paradoxga aldanmang, va biznes xarajatiga mos Threshold hamda Precision/Recall/F1 ni tanlang.',
    compareSummaryEn: 'Compute full TP/FP/FN/TN matrices, ignore deceptive raw accuracy on imbalanced labels, and tune thresholds around Precision, Recall, and F1.',
    practiceTasks: [
      pt('p1711_1', '1-mashq: Precision Hisoblash', 'Task 1: Compute Precision', '`TP=8, FP=2` bo‘lsa Precision necha?', 'Compute Precision.', `print(8 / (8 + 2))`, '0.8', 'TP / (TP + FP)', 'Prints 0.8.'),
      pt('p1711_2', '2-mashq: Recall Hisoblash', 'Task 2: Compute Recall', '`TP=8, FN=12` bo‘lsa Recall necha?', 'Compute Recall.', `print(8 / (8 + 12))`, '0.4', 'TP / (TP + FN)', 'Prints 0.4.'),
      pt('p1711_3', '3-mashq: Garmonik F1-Score', 'Task 3: Harmonic F1', '`P=0.8, R=0.5` uchun F1 (`round(..., 2)`) hisoblang.', 'Compute F1.', `p, r = 0.8, 0.5\nprint(round(2 * p * r / (p + r), 2))`, '0.62', '2*P*R / (P+R)', 'Prints 0.62.'),
      pt('p1711_4', '4-mashq: Zero-Denominator Guard', 'Task 4: Safe Precision at TP=FP=0', '`TP=0, FP=0` bo‘lsa `0.0` qaytaruvchi xavfsiz funksiya yozing.', 'Guard 0/0 precision.', `tp, fp = 0, 0\nprint(tp / (tp + fp) if (tp + fp) else 0.0)`, '0.0', 'Conditional denominator check', 'Prints 0.0.'),
      pt('p1711_5', '5-mashq: Threshold O‘zgartirish', 'Task 5: Apply Custom Threshold 0.6', '`[0.45, 0.65, 0.80]` uchun `threshold=0.6` bashoratlarini chiqaring.', 'Binarize at 0.6.', `print([int(p >= 0.6) for p in (0.45, 0.65, 0.80)])`, '[0, 1, 1]', 'p >= 0.6', 'Prints [0, 1, 1].'),
    ],
    quiz: [
      q('q1711_1', '99% i sog‘lom bo‘lgan datasetda hammaga "sog‘lom" degan modelning 99% chiqishi nima deb ataladi?', 'Trap where a trivial majority predictor scores 99% accuracy on rare-class data?', ['Gradient Descent', 'Accuracy Paradox', 'Bagging', 'Scaling'], ['Gradient Descent', 'Accuracy Paradox', 'Bagging', 'Scaling'], 1, 'Accuracy Paradox.', 'Accuracy Paradox.'),
      q('q1711_2', 'Saraton kasalligini erta aniqlashda birorta ham kasal bemorni o‘tkazib yubormaslik (`FN` ni minimallashtirish) uchun qaysi metrika ustun?', 'Metric to prioritize in medical screening so positive cases aren’t missed (`FN` minimized)?', ['Specificity', 'Recall (`TP / (TP + FN)`)', 'Accuracy', 'MSE'], ['Specificity', 'Recall (`TP / (TP + FN)`)', 'Accuracy', 'MSE'], 1, 'Recall.', 'Recall.'),
      q('q1711_3', 'Muhim ish xatini tasodifan "Spam" papkasiga tashlab yubormaslik (`FP` ni kamaytirish) uchun qaysi metrika ustun?', 'Metric to prioritize in spam filtering so legitimate emails aren’t falsely blocked (`FP` low)?', ['Recall', 'Precision (`TP / (TP + FP)`)', 'R²', 'Inertia'], ['Recall', 'Precision (`TP / (TP + FP)`)', 'R²', 'Inertia'], 1, 'Precision.', 'Precision.'),
      q('q1711_4', 'Nima uchun F1-Score Precision va Recall ning oddiy o‘rtachasi emas, garmonik o‘rtachasini oladi?', 'Why does F1 use the harmonic mean rather than a simple arithmetic average of Precision and Recall?', ['Tez', 'Agar biri juda past (`0.05`), ikkinchisi `1.0` bo‘lsa F1 past chiqib balansni talab qiladi', 'Python sharti', 'Square root'], ['Fast', 'Harmonic mean heavily penalizes extreme imbalance between Precision and Recall', 'Syntax', 'Sqrt'], 1, 'Muvozanatsiz modelni jazolaydi.', 'Penalizes lopsided Precision/Recall.'),
      q('q1711_5', 'Ehtimollik chegarasini (Threshold) `0.5` dan `0.25` ga tushirsangiz odatda nima oshadi?', 'What typically increases when lowering the decision threshold from `0.5` to `0.25`?', ['Precision', 'Recall (ko‘proq ijobiy tutasiz, lekin `FP` ham oshishi mumkin)', 'Specificity', 'MSE'], ['Precision', 'Recall (catches more positives, usually at higher FP)', 'Specificity', 'MSE'], 1, 'Recall oshadi.', 'Recall increases.'),
    ],
    homework: hw('Classification Evaluator & Optimal F1 Threshold Finder', 'Confusion Matrix & F1 Threshold Optimizer', 'Ehtimolliklar `[0.1..0.9]` va haqiqiy `y_true` ro‘yxati berilganda `threshold = 0.2, 0.4, 0.6, 0.8` larni sinab, har biri uchun `TP/FP/FN/TN`, Precision, Recall, F1 chiqaruvchi va eng yuqori F1 bergan thresholdni tanlovchi skript yozing.', 'Write a threshold sweep evaluator computing `(TP, FP, FN, TN)`, Precision, Recall, and F1 across thresholds `0.2..0.8` and selecting the F1-maximizing cutoff.', ['TP/FP/FN/TN + P/R/F1 sweep', 'Safe 0/0 denominator handling'], ['Threshold sweep metrics', 'F1-optimal cutoff selector'], 'Wrap all ratio divisions in zero-denominator guards.', 'Practical evaluation engineering.', 'Keyingi bo‘limda Neural Networks, PyTorch va AI API larni o‘rganamiz!', 'Deep Learning next!', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-12',
    courseId: 'ai_ml',
    moduleId: 'c17_m5',
    order: 12,
    titleUz: 'Neural Networks Asoslari — Perceptron, Activation Functions (`ReLU`/`Softmax`) va Backprop',
    titleEn: 'Neural Networks from Scratch: Perceptrons, Non-Linear Activations & Backpropagation',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-17-11'],
    conceptId: 'dl_neural_nets',
    whyUz: "ChatGPT ham, kompyuter ko‘rishi ham oddiy **Perceptron** neyronlarining ko‘p qatlamli tarmog‘i (**MLP / Deep Neural Network**) dan tashkil topgan! Eng hayratlanarli sir: agar qatlamlar orasiga **nochiziqli Activation Function (`ReLU`)** qo‘ymasangiz, 100 ta qatlam ham bitta oddiy chiziqqa (`Linear`) qisqarib qoladi! Bugun **Forward Pass -> ReLU/Softmax -> Backpropagation Chain Rule** ni sof Python da ko‘ramiz.",
    whyEn: 'Build deep learning intuition from first principles: dot-product perceptrons, why nonlinear activations (`ReLU`, `Sigmoid`, `Softmax`) prevent layer collapse, multi-layer forward passes, and the Backpropagation Chain Rule.',
    analogyUz: "**Neyron tarmoq** — kompaniya bo‘limlari zanjiri: xom ma’lumot 1-qatlamdagi oddiy qirralarni, 2-qatlamdagi ko‘z-burunni, oxirgi qatlam esa butun inson yuzini taniydi. **Backpropagation** esa yakuniy xato kelganda zanjir bo‘ylab orqaga yurib («kim necha foiz aybdor?») har bir og‘irlikni tuzatishdir!",
    analogyEn: 'Forward pass extracts progressively richer features layer by layer; Backpropagation applies the calculus Chain Rule backward from the loss to assign exact blame (`dLoss/dw`) to every weight.',
    stopsUz: "Neural Networks da 3 ta asosiy qoida: 1) **Activation (`ReLU`) bo‘lmasa ko‘p qatlamning foydasi YO‘Q**: `W2(W1·x) = (W2·W1)·x` yana oddiy chiziqli modelga aylanadi! 2) **Yashirin qatlamlarda `ReLU = max(0, z)`**, ko‘p-klassli chiqishda esa **`Softmax`** (yig‘indisi `1.0` ehtimolliklar) ishlatiladi! 3) **Og‘irliklarni 0 dan boshlamang!** Hamma og‘irlik `0` bo‘lsa barcha neyronlar bir xil bo‘lib qoladi (**Symmetry Breaking** uchun kichik tasodifiy sonlar kerak!).",
    stopsEn: 'Never stack dense layers without nonlinear activations (`ReLU`) or they collapse mathematically to one linear layer; use `Softmax` for multi-class output probabilities; never zero-initialize hidden weights.',
    objUz: ['Perceptron matematikasi (`z = w·x + b`, `a = activation(z)`) va Symmetry Breaking', 'Activation Funksiyalari: **ReLU** (`max(0, x)`), **Sigmoid**, va **Softmax** (`exp(z_i) / Σexp`)', 'Multi-Layer Perceptron (MLP) **Forward Pass** va **Backpropagation Chain Rule**'],
    objEn: ['Compute perceptron dot products + nonlinear activations (`ReLU`, `Sigmoid`, `Softmax`)', 'Explain why stacking linear layers without ReLU collapses into a single linear transform', 'Trace a scalar Backpropagation Chain Rule gradient step in pure Python'],
    theoryUz: `### 1. Nega Activation Function Kerak?
Chiziqli qatlamlar kompozitsiyasi baribir chiziqli! \`ReLU(z) = max(0.0, z)\` murakkab egri chegaralarni o‘rganish imkonini beradi va gradient yo‘qolishini kamaytiradi.
### 2. Softmax (Ko‘p-Klass Chiqish)
\`probs[i] = exp(z[i] - max_z) / sum(exp(z - max_z))\` -> barcha ehtimolliklar musbat va yig‘indisi \`1.0\`!
### 3. Backpropagation (Chain Rule)
\`dL/dw = (dL/dy_hat) * (dy_hat/dz) * (dz/dw)\` — lokal hosilalarni zanjir qilib ko‘paytirish!`,
    theoryEn: `### 1. Why Nonlinear Activations Matter
Without \`ReLU\`/\`GELU\`, \`W2 @ (W1 @ x)\` collapses into a single matrix multiply. \`ReLU(x) = max(0, x)\` introduces piecewise nonlinearity efficiently.
### 2. Numerically Stable Softmax
Subtract \`max(logits)\` before \`exp()\` to avoid float overflow while mapping logits into probabilities summing to \`1.0\`.
### 3. Backpropagation via Chain Rule
Multiply local derivatives backward from the scalar loss to update every hidden weight.`,
    examples: [
      ex('Misol 1: `ReLU` va Numerically Stable `Softmax` Sof Python da', 'Example 1: ReLU & Stable Softmax Implementations', `import math

def relu(xs):
    return [max(0.0, x) for x in xs]

def softmax(logits):
    m = max(logits)
    exps = [math.exp(z - m) for z in logits]
    s = sum(exps)
    return [round(e / s, 3) for e in exps]

print("ReLU:", relu([-3.0, 0.0, 2.5]))
probs = softmax([2.0, 1.0, 0.1])
print("Softmax probs:", probs, "| Sum:", round(sum(probs), 2))`, `ReLU: [0.0, 0.0, 2.5]\nSoftmax probs: [0.659, 0.242, 0.099] | Sum: 1.0`, '`max(logits)` ni ayirish `exp(1000)` Overflow xatosining oldini oladi; chiqish yig‘indisi aniq `1.0`.', 'Applies ReLU clipping and shift-invariant Softmax probabilities summing to `1.0`.'),
      ex('Misol 2: 2-Qatlamli MLP Forward Pass (`Input(2) -> Hidden(2, ReLU) -> Output(1)`)', 'Example 2: Two-Layer MLP Forward Pass', `x = [1.0, 2.0]
W1, b1 = [[1.0, -1.0], [0.5, 1.0]], [0.0, 0.0]
h = [max(0.0, sum(wi * xi for wi, xi in zip(w_row, x)) + bi) for w_row, bi in zip(W1, b1)]
w2, b2 = [2.0, 1.0], 0.5
y_hat = sum(wi * hi for wi, hi in zip(w2, h)) + b2
print("Hidden ReLU:", h, "| Final y_hat:", y_hat)`, `Hidden ReLU: [0.0, 2.5] | Final y_hat: 3.0`, 'Birinchi neyron manfiy chiqdi va ReLU uni `0.0` ga o‘chirdi; ikkinchi neyron `2.5` signali uzatdi.', 'Executes a 2-layer MLP forward pass cleanly without third-party tensors.'),
      ex('Misol 3: Chain Rule Backprop (`y = (w * x - target)^2`)', 'Example 3: Scalar Backpropagation Chain Rule', `x, w, y_true, lr = 3.0, 1.0, 9.0, 0.05
# Forward: z = w*x = 3.0, loss = (z - 9)^2 = 36
z = w * x
dloss_dz = 2 * (z - y_true)   # -12.0
dz_dw = x                     # 3.0
dloss_dw = dloss_dz * dz_dw   # Chain Rule: -36.0
w_new = w - lr * dloss_dw
print("dL/dw:", dloss_dw, "| Updated w:", w_new)`, `dL/dw: -36.0 | Updated w: 2.8`, 'Chain rule `dL/dz * dz/dw` orqali `w` `1.0` dan haqiqiy `3.0` ga yaqinlashib `2.8` bo‘ldi!', 'Demonstrates exact backward gradient flow using the calculus Chain Rule.'),
    ],
    traceTitleUz: 'MLP Forward & Chain Rule Trace',
    traceTitleEn: 'Tracing MLP Forward & Backprop',
    traceCode: `x=[1,2] -> Hidden ReLU=[0.0, 2.5] -> Out=3.0`,
    traceSteps: [
      traceStep(1, 'Hidden linear + ReLU', '[max(0,-1), max(0,2.5)] -> [0.0, 2.5]', 'Manfiy aktivatsiya nollandi', 'ReLU suppressed negative signal'),
      traceStep(2, 'Output linear', '2*0 + 1*2.5 + 0.5 = 3.0', 'Chiqish hisoblandi', 'Computed network output'),
      traceStep(3, 'Backprop dL/dw', 'dL/dz * dz/dw', 'Zanjir qoidasi bilan gradient', 'Propagated chain-rule gradients'),
    ],
    commonMistakes: [
      mistake('Barcha yashirin qatlam og‘irliklarini `0.0` bilan boshlash', 'Zero-Initializing All Hidden Layer Weights', `# If all hidden weights start at 0, every neuron computes identical outputs and gradients—never diversifying!`, 'Dead symmetric hidden layer', `print("Initialize weights with small random distributions (Xavier/He), NEVER all zeros!")`, 'Og‘irliklarni doim kichik tasodifiy qiymatlar (Xavier/He init) bilan boshlang.', 'Break symmetry with small random weight initialization (Xavier/He) rather than zeros.', 'Tasodifiy init ishlating.', 'Use random weight initialization.'),
      mistake('`Softmax` da katta logitlar uchun `max(logits)` ayirmasdan `OverflowError` olish', 'Computing Softmax Without Subtracting max(logits)', `# math.exp(1000) raises OverflowError: math range error!`, 'OverflowError / NaN in Softmax', `print("Always shift logits by subtracting max(logits) before taking exp() in Softmax!")`, 'Barqarorlik uchun `exp(z - max(z))` yozing.', 'Subtract `max(logits)` prior to exponentiation to prevent numerical overflow.', '`z - max(z)` ishlating.', 'Use shift-invariant `z - max(z)`.'),
    ],
    compareTitleUz: 'ReLU vs Sigmoid vs Softmax',
    compareTitleEn: 'Activation Functions Compared',
    compareUz: ['`ReLU`: yashirin qatlamlar standarti (`max(0, x)`), tez va gradientni so‘ndirmaydi.', '`Sigmoid`: ikkilik (Binary) chiqish qatlamida `[0, 1]` ehtimollik beradi.', '`Softmax`: ko‘p klassli chiqish qatlamida barcha ehtimollar yig‘indisini `1.0` qiladi.'],
    compareEn: ['`ReLU`: default hidden-layer activation avoiding vanishing gradients.', '`Sigmoid`: binary output probability.', '`Softmax`: normalized multi-class probability distribution.'],
    compareSummaryUz: 'Yashirin qatlamlarda `ReLU`, ko‘p-klass chiqishda shift-invariant `Softmax`, og‘irliklarda tasodifiy init va o‘qitishda Backpropagation Chain Rule dan foydalaning.',
    compareSummaryEn: 'Pair hidden `ReLU` nonlinearities with shift-invariant `Softmax` multi-class outputs, random weight init, and Chain Rule backpropagation.',
    practiceTasks: [
      pt('p1712_1', '1-mashq: ReLU Funksiyasi', 'Task 1: ReLU Activation', '`[-5, 0, 3, -1, 7]` ga ReLU qo‘llang.', 'Apply ReLU.', `print([max(0, x) for x in (-5, 0, 3, -1, 7)])`, '[0, 0, 3, 0, 7]', 'max(0, x)', 'Prints [0, 0, 3, 0, 7].'),
      pt('p1712_2', '2-mashq: Shift-Invariant Softmax', 'Task 2: Stable Softmax', '`[10, 10]` logitlari uchun Softmax ehtimollarini chiqaring.', 'Compute Softmax.', `import math\nls = [10, 10]; m = max(ls); exps = [math.exp(x - m) for x in ls]\nprint([round(e / sum(exps), 2) for e in exps])`, '[0.5, 0.5]', 'Equal logits -> 0.5, 0.5', 'Prints [0.5, 0.5].'),
      pt('p1712_3', '3-mashq: 1-Neyron Dot + ReLU', 'Task 3: Single Neuron Output', '`x=[2, -1], w=[3, 4], b=-1` da ReLU chiqishini toping.', 'Compute neuron output.', `z = 2 * 3 + (-1) * 4 - 1\nprint(max(0, z))`, '1', 'max(0, dot + b)', 'Prints 1.'),
      pt('p1712_4', '4-mashq: Chain Rule Gradient', 'Task 4: Multiply Local Derivatives', '`dL/dy = 4.0`, `dy/dz = 0.5`, `dz/dw = 3.0` bo‘lsa `dL/dw` necha?', 'Compute dL/dw.', `print(4.0 * 0.5 * 3.0)`, '6.0', 'Multiply chain derivatives', 'Prints 6.0.'),
      pt('p1712_5', '5-mashq: Ko‘p-Qatlam Parametrlar Soni', 'Task 5: Count Dense Layer Params', '`Input(4) -> Hidden(3)` qatlamda `4*3` og‘irlik + `3` bias jami nechta parametr?', 'Count layer parameters.', `print(4 * 3 + 3)`, '15', 'in * out + out', 'Prints 15.'),
    ],
    quiz: [
      q('q1712_1', 'Neyron tarmoqning yashirin qatlamlari orasiga `ReLU` kabi nochiziqli funksiya qo‘yilmasa nima bo‘ladi?', 'What happens if multi-layer neural networks omit nonlinear activations like ReLU?', ['Tezlashadi', 'Barcha qatlamlar matematik jihatdan bitta oddiy chiziqli modelga qisqarib qoladi', 'Overfit 100%', 'Softmax ishlamaydi'], ['Faster', 'All stacked layers collapse mathematically into one simple linear transformation', 'Overfits', 'No softmax'], 1, 'Chiziqli qatlamlar yig‘indisi faqat chiziqli bo‘lib qoladi.', 'Collapses to single linear layer.'),
      q('q1712_2', '10 ta klassli tasniflashda chiqish ehtimollari yig‘indisini `1.0` qiluvchi funksiya?', 'Output layer function normalizing raw logits for 10 classes into probabilities summing to 1.0?', ['ReLU', 'Softmax', 'Gini', 'MSE'], ['ReLU', 'Softmax', 'Gini', 'MSE'], 1, 'Softmax.', 'Softmax.'),
      q('q1712_3', 'Backpropagation orqali `w` og‘irligigacha gradientni yetkazishda qaysi matematik qoida ishlatiladi?', 'Calculus rule propagating error derivatives backward through stacked layers?', ['Pythagoras', 'Chain Rule (Zanjir qoidasi)', 'Bayes Theorem', 'Euler'], ['Pythagoras', 'Calculus Chain Rule', 'Bayes', 'Euler'], 1, 'Chain Rule.', 'Chain Rule.'),
      q('q1712_4', 'Nima uchun yashirin qatlam og‘irliklari barchasi `0.0` qilib boshlanmaydi?', 'Why must hidden weights NOT all be initialized to `0.0`?', ['Overflow', 'Symmetry muammosi: hamma neyron bir xil gradient olib bir-biridan farqlana olmaydi', 'RAM', 'TypeError'], ['Overflow', 'Symmetry trap: every hidden neuron learns identical weights forever', 'RAM', 'TypeError'], 1, 'Symmetry Breaking kerak.', 'Breaks neuron symmetry.'),
      q('q1712_5', '`Softmax` hisoblashda `exp(1000)` Overflow xatosidan qochish usuli?', 'Trick preventing numerical overflow when computing Softmax on large logits?', ['exp(z * 2)', 'Har bir logitdan `max(logits)` ni ayirish (`exp(z - max(z))`)', 'abs(z)', 'log(z)'], ['exp(2z)', 'Subtract `max(logits)` before exponentiating (`exp(z - max(z))`)', 'abs(z)', 'log(z)'], 1, '`z - max(z)`.', 'Shift by `max(logits)`.'),
    ],
    homework: hw('Mini Pure-Python MLP & Backprop Engine', 'Pure-Python 2-Layer Neural Net Forward/Backprop', 'Sof Python da `DenseLayer(in, out)`, `relu()`, `softmax()` va 1 ta og‘irlik ustida Chain Rule Backpropagation yangilanishini ko‘rsatuvchi kichik MLP moduli yozing.', 'Implement a pure-Python 2-layer MLP (`relu` hidden, shift-invariant `softmax` output) plus a verified Chain Rule gradient descent step reducing squared error.', ['2-layer forward pass + Stable Softmax', 'Chain-rule backprop weight update'], ['MLP Forward + Softmax', 'Chain rule step'], 'Initialize weights with small non-zero deterministic values (`random.Random(42)`) so hidden neurons break symmetry.', 'Core Deep Learning intuition.', 'Keyingi darsda PyTorch (`nn.Module`) arxitekturasini o‘rganamiz!', 'PyTorch deep learning next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-13',
    courseId: 'ai_ml',
    moduleId: 'c17_m5',
    order: 13,
    titleUz: 'Deep Learning va PyTorch — `Tensor`, `nn.Module`, Autograd va Training Sikli (`zero_grad`)',
    titleEn: 'Deep Learning with PyTorch: Tensors, Autograd, `nn.Module` & the Training Loop',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-17-12'],
    conceptId: 'dl_pytorch',
    whyUz: "PyTorch bugun ham tadqiqotda (OpenAI/Meta), ham production Deep Learning da 1-raqamli standartdir! Chunki PyTorch oddiy **Pythonic OOP (`nn.Module`)** va avtomatik hosila olish (**Autograd: `loss.backward()`**) bilan GPU da millionlab parametrlarni o‘qitadi. Bugun har bir PyTorch loyihasining yuragi — **`zero_grad() -> forward -> loss -> backward() -> step()`** 5-qadamli siklini va `eval()` / `no_grad()` sirlarini mukammal o‘zlashtiramiz!",
    whyEn: 'Master the PyTorch Deep Learning architecture: N-dimensional GPU-ready tensors, `Autograd` dynamic graphs, composing layers inside `nn.Module`, the canonical 5-step training loop (`zero_grad -> forward -> loss -> backward -> step`), and `model.eval()` + `torch.no_grad()` inference.',
    analogyUz: "**PyTorch `Autograd`** — har bir matematik amalni yozib boruvchi aqlli kamera: siz `y = w * x` hisoblaganingizda u orqaga yo‘lni eslab qoladi; `loss.backward()` deganingizda zanjir qoidasini (Backprop) o‘zi avtomatik hisoblab `.grad` ga qo‘yadi!",
    analogyEn: 'PyTorch Autograd records operations on tensors dynamically so calling `loss.backward()` populates every trainable parameter’s `.grad` automatically.',
    stopsUz: "PyTorch da 4 ta eng mashhur xato: 1) **`optimizer.zero_grad()` ni unutish!** PyTorch gradientlarni avtomatik **qo‘shib boradi (`+=`)**; har batch boshida `zero_grad()` chaqirmasangiz gradientlar yig‘ilib model buziladi! 2) **Inference/Validation da `model.eval()` va `with torch.no_grad():` ni unutish** — Dropout o‘chmaydi va RAM gradient grafigiga to‘lib ketadi! 3) **Tensor va Model bitta `device` (`cuda` vs `cpu`) da bo‘lishi shart**! 4) **PyTorch ning `nn.CrossEntropyLoss` i o‘zi ichida Softmax bajaradi** — model oxiriga yana `Softmax()` qo‘ymang!",
    stopsEn: 'Never forget `optimizer.zero_grad()` (PyTorch accumulates gradients by default), switch to `model.eval()` + `with torch.no_grad():` during validation/inference, match tensor/model devices, and pass raw logits to `nn.CrossEntropyLoss`.',
    objUz: ['`Tensor` (shape, dtype, device CPU/GPU) va `Autograd` (`requires_grad`, `.backward()`)', '`nn.Module` (`__init__` qatlamlar + `forward()`) OOP tuzilmasi', '5-qadamli **PyTorch Training Loop** + `model.eval()` / `torch.no_grad()`'],
    objEn: ['Understand PyTorch `Tensor` shapes/devices and Autograd `.backward()`', 'Design clean models subclassing `nn.Module` with `__init__` and `forward()`', 'Execute the 5-step PyTorch training loop and proper `eval()` + `no_grad()` inference'],
    theoryUz: `### 1. \`nn.Module\` Andozasi
\`\`\`python
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(4, 16), nn.ReLU(), nn.Linear(16, 2))
    def forward(self, x):
        return self.net(x)  # raw logits -> CrossEntropyLoss!
\`\`\`
### 2. Kanonik 5-Qadamli Training Sikli
1. \`optimizer.zero_grad()\` — eski gradientlarni tozalash.
2. \`logits = model(xb)\` — forward pass.
3. \`loss = loss_fn(logits, yb)\` — xatoni hisoblash.
4. \`loss.backward()\` — autograd bilan hosila olish.
5. \`optimizer.step()\` — Adam/SGD og‘irlik yangilashi!
### 3. Validation / Inference Rejimi
\`model.eval()\` (Dropout/BatchNorm ni qulflaydi) + \`with torch.no_grad():\` (RAM ni tejaydi!).`,
    theoryEn: `### 1. Composing \`nn.Module\`
Define layers inside \`__init__\` (calling \`super().__init__()\`) and wire computation inside \`forward(self, x)\`. Emit raw logits directly to \`CrossEntropyLoss\`.
### 2. The 5-Step Training Loop
\`optimizer.zero_grad()\` -> \`out = model(x)\` -> \`loss = criterion(out, y)\` -> \`loss.backward()\` -> \`optimizer.step()\`.
### 3. Evaluation Mode
Always switch \`model.eval()\` and wrap validation/inference inside \`with torch.no_grad():\`.`,
    examples: [
      ex('Misol 1: Pure-Python Autograd `Value` Klassi (PyTorch `backward()` Mexanizmi!)', 'Example 1: Mini Autograd Engine Mirroring PyTorch `.backward()`', `class Scalar:
    def __init__(self, val, grad=0.0):
        self.val, self.grad = val, grad

# Simulate y = (w * x - target)^2 with zero_grad -> backward -> step
w, x, target, lr = Scalar(1.0), 2.0, 6.0, 0.1
for epoch in range(2):
    w.grad = 0.0  # CRITICAL: optimizer.zero_grad()!
    loss = (w.val * x - target) ** 2
    w.grad += 2 * (w.val * x - target) * x  # loss.backward()
    w.val -= lr * w.grad                    # optimizer.step()
    print(f"Epoch {epoch}: loss={round(loss, 2)}, w={round(w.val, 2)}")`, `Epoch 0: loss=16.0, w=2.6\nEpoch 1: loss=0.64, w=2.92`, '`w.grad = 0.0` (`zero_grad()`) chaqirilgani uchun har epoxada gradient toza hisoblandi va `loss` `16.0` dan `0.64` ga tushdi!', 'Illustrates why `zero_grad -> forward -> loss -> backward -> step` drives loss smoothly toward zero.'),
      ex('Misol 2: `nn.Module` Uslubida `train()` vs `eval()` Holat Boshqaruvi', 'Example 2: PyTorch `Module.train()` vs `eval()` Mode Toggle', `class MiniModule:
    def __init__(self):
        self.training = True
    def train(self): self.training = True
    def eval(self):  self.training = False
    def forward(self, x):
        return f"dropout_active={self.training} | out={x * 2}"

m = MiniModule()
print("Train:", m.forward(5))
m.eval()
print("Eval :", m.forward(5))`, `Train: dropout_active=True | out=10\nEval : dropout_active=False | out=10`, '`model.eval()` chaqirilganda Dropout va BatchNorm inference rejimiga o‘tadi.', 'Shows how `model.eval()` disables training-only regularization during validation/inference.'),
      ex('Misol 3: `zero_grad()` Unutilganda Gradient To‘planib Qolish Xatosi!', 'Example 3: Why Forgetting `zero_grad()` Corrupts Weights', `grad_bug = 0.0
for step in range(3):
    # Forgot zero_grad()! Gradients accumulate across batches!
    grad_bug += 2.0
    print(f"Step {step} corrupted accumulated grad:", grad_bug)`, `Step 0 corrupted accumulated grad: 2.0\nStep 1 corrupted accumulated grad: 4.0\nStep 2 corrupted accumulated grad: 6.0`, '`zero_grad()` bo‘lmasa eski batch gradientlari yangisiga qo‘shilib ketadi!', 'Proves how omitting `optimizer.zero_grad()` causes runaway gradient accumulation.'),
    ],
    traceTitleUz: 'PyTorch 5-Qadamli Training Loop Trace',
    traceTitleEn: 'Tracing PyTorch Training Iteration',
    traceCode: `zero_grad() -> model(x) -> loss -> backward() -> step()`,
    traceSteps: [
      traceStep(1, 'optimizer.zero_grad()', 'all .grad = 0', 'Oldingi qadam gradienti tozalandi', 'Cleared stale gradients'),
      traceStep(2, 'loss.backward()', 'populated p.grad', 'Autograd hosilalarni hisobladi', 'Computed backward gradients'),
      traceStep(3, 'optimizer.step()', 'updated weights', 'Adam/SGD parametrlarni surdi', 'Applied weight step'),
    ],
    commonMistakes: [
      mistake('`optimizer.zero_grad()` ni sikl ichida yozmaslik', 'Omitting optimizer.zero_grad() Inside the Training Loop', `# PyTorch adds new gradients onto existing .grad buffers—forgetting zero_grad() corrupts updates!`, 'Oscillating diverging training loss', `print("Always invoke optimizer.zero_grad() before computing the next backward pass!")`, 'Har batch da `backward()` dan oldin `optimizer.zero_grad()` chaqiring.', 'Call `optimizer.zero_grad()` at the start of every training batch.', '`zero_grad()` ni unutmang.', 'Call `optimizer.zero_grad()`.'),
      mistake('Inference da `model.eval()` va `torch.no_grad()` yozmaslik', 'Running Validation or Serving Without model.eval() & torch.no_grad()', `# Leaving model in train mode keeps random Dropout active and wastes GPU RAM building autograd graphs!`, 'Noisy predictions & OOM crashes', `print("Wrap validation and serving inside model.eval() + with torch.no_grad():!")`, 'Test va API inference da `model.eval()` hamda `with torch.no_grad():` qo‘ying.', 'Always enable `model.eval()` and `torch.no_grad()` for deterministic, memory-lean inference.', '`eval()` + `no_grad()` ishlating.', 'Use `eval()` + `no_grad()`.'),
    ],
    compareTitleUz: 'Scikit-learn vs PyTorch',
    compareTitleEn: 'Scikit-learn vs PyTorch',
    compareUz: ['Scikit-learn: jadvalli ma’lumotlar (CSV/SQL), tez `fit/predict`, Random Forest / Gradient Boosting da eng zo‘r.', 'PyTorch: rasm, matn, audio, maxsus loss va GPU da ko‘p qatlamli Deep Learning arxitekturalari uchun eng zo‘r.'],
    compareEn: ['Scikit-learn: unmatched for fast tabular classical ML (trees, boosting, linear pipelines).', 'PyTorch: standard for deep neural networks, vision, NLP, custom losses, and GPU acceleration.'],
    compareSummaryUz: 'PyTorch da `nn.Module` tuzing, `zero_grad -> forward -> loss -> backward -> step` siklini yozing va inference da `model.eval()` + `torch.no_grad()` ishlating.',
    compareSummaryEn: 'Structure layers in `nn.Module`, run the 5-step `zero_grad -> forward -> loss -> backward -> step` loop, and infer under `model.eval()` + `torch.no_grad()`.',
    practiceTasks: [
      pt('p1713_1', '1-mashq: 5-Qadamli PyTorch Sikli Tartibi', 'Task 1: Canonical Loop Order', '5 ta PyTorch trening bosqichini to‘g‘ri tartibda chiqaring.', 'Print 5-step sequence.', `print(["zero_grad", "forward", "loss", "backward", "step"])`, "['zero_grad', 'forward', 'loss', 'backward', 'step']", '5 canonical PyTorch steps', 'Prints exact order.'),
      pt('p1713_2', '2-mashq: Batch Tensor Shape', 'Task 2: Batch Tensor Shape', '32 ta rasm (3 kanal, 64x64) PyTorch NCHW tensor shaklini chiqaring.', 'Format NCHW tuple.', `print((32, 3, 64, 64))`, '(32, 3, 64, 64)', 'Batch x Channels x H x W', 'Prints (32, 3, 64, 64).'),
      pt('p1713_3', '3-mashq: Gradient Accumulation Tozalash', 'Task 3: Resetting Grad to Zero', '`grad=5.0` ni `zero_grad` bilan `0.0` qilib yangi `1.5` qo‘shing.', 'Simulate zero_grad.', `g = 5.0; g = 0.0; g += 1.5\nprint(g)`, '1.5', 'Reset before accumulate', 'Prints 1.5.'),
      pt('p1713_4', '4-mashq: Total Batches Per Epoch', 'Task 4: Batches Per Epoch', '100 ta namuna, `batch_size=32` (`drop_last=False`) da nechta batch bo‘ladi?', 'Compute ceiling batches.', `import math\nprint(math.ceil(100 / 32))`, '4', 'math.ceil(N / batch_size)', 'Prints 4.'),
      pt('p1713_5', '5-mashq: CrossEntropy Logit Argmax', 'Task 5: Predicted Class From Raw Logits', 'Logitlar `[1.2, 4.5, 0.3]` dan eng katta klass indeksini (`argmax`) toping.', 'Find argmax class.', `logits = [1.2, 4.5, 0.3]\nprint(logits.index(max(logits)))`, '1', 'index of max logit', 'Prints 1.'),
    ],
    quiz: [
      q('q1713_1', 'PyTorch trening siklida `loss.backward()` dan oldin chaqiriladigan majburiy amal?', 'Mandatory call resetting accumulated `.grad` buffers before the next backward pass?', ['model.eval()', 'optimizer.zero_grad()', 'torch.save()', 'detach()'], ['model.eval()', 'optimizer.zero_grad()', 'torch.save()', 'detach()'], 1, '`optimizer.zero_grad()`.', '`optimizer.zero_grad()`.'),
      q('q1713_2', 'Validation yoki Production inference paytida Dropout ni o‘chirib xotirani tejaydigan juftlik?', 'PyTorch pair disabling Dropout/BatchNorm updates and skipping autograd memory during inference?', ['model.train()', 'model.eval() va with torch.no_grad():', 'zero_grad()', 'cuda()'], ['model.train()', 'model.eval() with torch.no_grad():', 'zero_grad()', 'cuda()'], 1, '`model.eval()` + `with torch.no_grad():`.', '`model.eval()` + `torch.no_grad()`.'),
      q('q1713_3', 'PyTorch da `nn.CrossEntropyLoss()` ishlatilganda modelning oxirgi qatlamida `Softmax` qo‘yish kerakmi?', 'Should your model apply `Softmax` before passing outputs into `nn.CrossEntropyLoss()`?', ['Ha, albatta', 'Yo‘q! `CrossEntropyLoss` o‘zi ichida barqaror `LogSoftmax` bajaradi — xom logit bering', 'Faqat GPU da', 'Faqat batch=1'], ['Yes', 'No—CrossEntropyLoss applies LogSoftmax internally; pass raw logits', 'GPU only', 'Batch 1'], 1, 'Xom logit (raw logits) beriladi.', 'Pass raw logits directly.'),
      q('q1713_4', 'Tensorlarni saqlab avtomatik hosila hisoblovchi PyTorch mexanizmi?', 'PyTorch engine tracking tensor operations to compute backward derivatives automatically?', ['Pickler', 'Autograd', 'DataLoader', 'CUDA'], ['Pickler', 'Autograd', 'DataLoader', 'CUDA'], 1, 'Autograd.', 'Autograd.'),
      q('q1713_5', 'Kichik/o‘rta jadvalli CSV ma’lumotlarda odatda qaysi biri Deep Learning dan tezroq va aniqroq?', 'Which toolkit typically beats deep neural networks in speed and accuracy on tabular CSV data?', ['PyTorch CNN', 'Scikit-learn / Gradient Boosted Trees (Random Forest, XGBoost)', 'RNN', 'GAN'], ['CNN', 'Scikit-learn / Tree Ensembles (Random Forest, XGBoost)', 'RNN', 'GAN'], 1, 'Tree-based modellar jadvallarda ustun.', 'Tree ensembles dominate tabular data.'),
    ],
    homework: hw('Mini PyTorch Training Engine Simulator', 'PyTorch-Style nn.Module & 5-Step Trainer', 'Sof Python da `LinearScalar` moduli (`train()` / `eval()` rejimlari), `zero_grad()`, `backward()` va `step()` metodlari bilan 5-epoxalik trening siklini amalga oshirib validation loss ni chop eting.', 'Implement a pure-Python PyTorch-style `Module` with `train()`/`eval()`, `zero_grad()`, `backward()`, and `step()` over 5 epochs plus a `no_grad` evaluation pass.', ['zero_grad -> forward -> loss -> backward -> step', 'eval() validation mode check'], ['5-step training loop', 'Eval pass'], 'Reset `.grad = 0.0` at the start of every training iteration before computing `backward()`.', 'Full PyTorch training lifecycle.', '17-kursning va butun Python Mastery ning so‘nggi darsi — AI API & Aqlli Dasturlarga o‘ting!', 'Final capstone lesson next!', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-14',
    courseId: 'ai_ml',
    moduleId: 'c17_m5',
    order: 14,
    titleUz: 'AI API va Aqlli Dasturlar Yaratish — Server Proxy, Structured JSON, RAG va Prompt Xavfsizligi',
    titleEn: 'Building Production AI Applications: Server Proxies, Structured JSON, RAG & Safety Guardrails',
    difficulty: 'advanced',
    estimatedMinutes: 40,
    prerequisites: ['PY-17-13'],
    conceptId: 'ai_apps_capstone',
    whyUz: "Bugungi kunda Python dasturchi sifatida eng talabgir ko‘nikma — tayyor katta modellarni (Gemini, LLM lar) haqiqiy **xavfsiz, ishonchli Python backend ilovasiga** integratsiya qilish! Buning uchun: 1) API kalitini brauzerda emas **server-side `/api/*` proksida** saqlash, 2) LLM dan erkin matn emas, **Structured JSON (`Pydantic` schema)** olish, 3) O‘z kompaniya hujjatlaridan aniq javob beruvchi **RAG (Embeddings + Cosine Similarity)** qurish, va 4) **Prompt Injection, Timeout va Cost Limit** larni qo‘yish kerak!",
    whyEn: 'Architect production AI features in Python: server-side API key isolation, deterministic Structured JSON outputs with validation retries, Retrieval-Augmented Generation (RAG via chunking & Cosine Similarity), and defenses against prompt injection, rate limits, and hallucinations.',
    analogyUz: "**LLM API** — bu juda aqlli, lekin ba’zan tasavvur qilib to‘qib yuboradigan (Hallucination) konsultant. **RAG** uning qo‘liga kompaniyangizning rasmiy qo‘llanmasini tutqazadi; **Structured JSON Schema** esa javobni aniq shaklga solib kodingiz yiqilmasligini kafolatlaydi!",
    analogyEn: 'RAG hands the LLM verified reference chunks instead of letting it guess from memory; Structured JSON schemas force outputs into validated Python objects before downstream execution.',
    stopsUz: "Production AI ilovada 4 ta qatʼiy qoida: 1) **API Key HECH QACHON frontend (`Vite`/`React`) ga chiqmasin** — faqat Python backend `os.environ` da tursin! 2) **JSON.loads()` ni `try/except` va schema validator bilan o‘rang** — LLM dan chiqqan matnga ko‘r-ko‘rona ishonmang! 3) **Prompt Injection dan himoyalaning**: foydalanuvchi matnini tizim ko‘rsatmalari (`system_instruction`) bilan aralashtirmang va hech qachon tasdiqlanmagan `exec()`/`SQL` yurgizmang! 4) **Timeouts + Retry (`429`) + Token/Cost limit** o‘rnating!",
    stopsEn: 'Keep LLM API keys strictly in backend `process.env`/`os.environ` proxies, validate all model outputs against typed JSON schemas, isolate untrusted user text from system instructions, and enforce timeouts, rate-limit retries, and token budgets.',
    objUz: ['Server-side AI Proxy xavfsizligi (kalit siri, rate limit, timeout)', '**Structured Outputs (JSON Schema)** va parse-retry mexanizmi', '**RAG (Chunking -> Embeddings -> Cosine Similarity Top-K)** sof Python da + Prompt Injection himoyasi'],
    objEn: ['Isolate AI API keys behind authenticated server proxies with timeouts and cost limits', 'Parse and validate Structured JSON responses safely with retry fallbacks', 'Implement Chunking + Cosine Similarity Top-K retrieval for RAG and guard against prompt injection'],
    theoryUz: `### 1. Server-Side AI Proxy
Brauzer -> \`POST /api/analyze\` -> Python Backend (\`os.environ["API_KEY"]\`) -> AI SDK -> Validated JSON javob!
### 2. RAG (Retrieval-Augmented Generation)
1. Hujjatlarni kichik bo‘laklarga (**Chunks**) bo‘lish.
2. Har bo‘lak uchun vektor (**Embedding**) olish.
3. Savolga **Cosine Similarity** bo‘yicha Top-K eng yaqin bo‘lakni topib kontekstga qo‘shish!
### 3. Structured Outputs & Safety
Schema (\`required fields + types\`) tekshiruvi, token budjeti (\`max_tokens\`) va foydalanuvchi matnini sanitizatsiya qilish.`,
    theoryEn: `### 1. Server-Side Proxy Architecture
Keep secrets in backend env vars, validate user inputs/quotas on your Python API route, and strip unsafe fields before responding.
### 2. RAG Pipeline
Chunk documents -> Embed chunks & user query -> Rank via Cosine Similarity \`dot(a,b) / (||a|| * ||b||)\` -> Ground prompt with Top-K verified snippets.
### 3. Reliability & Safety
Validate returned JSON strictly, never pass model output into \`eval\`/\`exec\` or raw SQL, and bound latency with timeouts.`,
    examples: [
      ex('Misol 1: RAG Asosi — Cosine Similarity Top-K Hujjat Qidiruvi', 'Example 1: Pure-Python Cosine Similarity RAG Retriever', `import math

def cosine(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    return round(dot / (na * nb), 3) if na and nb else 0.0

docs = [("refund_policy.md", [0.9, 0.1]), ("pricing.md", [0.1, 0.9])]
query_vec = [0.85, 0.15]
ranked = sorted(((cosine(query_vec, v), name) for name, v in docs), reverse=True)
print("Top RAG match:", ranked[0])`, `Top RAG match: (0.998, 'refund_policy.md')`, 'Cosine Similarity savol vektoriga eng yaqin (`0.998`) rasmiy hujjatni birinchi o‘ringa chiqardi!', 'Ranks embedded document chunks by Cosine Similarity to ground LLM responses cleanly.'),
      ex('Misol 2: Structured AI JSON Javobini Validatsiya Qilish', 'Example 2: Validating Structured JSON AI Output', `import json

def parse_ai_ticket(raw_json: str) -> dict:
    data = json.loads(raw_json)
    if data.get("priority") not in {"low", "high"} or not isinstance(data.get("summary"), str):
        raise ValueError("Schema validation failed")
    return data

print("Validated:", parse_ai_ticket('{"priority": "high", "summary": "Card declined"}'))`, `Validated: {'priority': 'high', 'summary': 'Card declined'}`, 'LLM chiqishini darhol ishlatmasdan qatʼiy schema bo‘yicha tekshirish production xatolarini to‘xtatadi.', 'Validates untrusted model JSON outputs against allowed enums and field types.'),
      ex('Misol 3: Hujjatni Overlap Bilan Bo‘laklash (RAG Text Chunker)', 'Example 3: Sliding-Window Text Chunking for RAG', `def chunk_words(words: list[str], size: int = 4, overlap: int = 1) -> list[list[str]]:
    step = size - overlap
    return [words[i : i + size] for i in range(0, len(words), step) if len(words[i : i + size]) > overlap or i == 0]

text = "Python Mastery 17 kurs 196 dars toliq nazariya".split()
print("Chunks:", chunk_words(text))`, `Chunks: [['Python', 'Mastery', '17', 'kurs'], ['kurs', '196', 'dars', 'toliq'], ['toliq', 'nazariya']]`, '1 so‘zlik overlap gaplar bo‘lak chegarasida uzilib qolishining oldini oladi.', 'Splits documents into overlapping chunks preserving context across split boundaries.'),
    ],
    traceTitleUz: 'Secure RAG + Structured JSON Flow Trace',
    traceTitleEn: 'Tracing Secure AI API Request',
    traceCode: `Query -> Backend Proxy -> RAG Top-K -> LLM JSON -> Schema Check`,
    traceSteps: [
      traceStep(1, 'Backend Proxy', 'API key stays in server env', 'Kalit brauzerga chiqmadi', 'Protected API credentials'),
      traceStep(2, 'Cosine RAG', 'Top-1: refund_policy.md', 'Rasmiy fakt topildi', 'Retrieved grounded context'),
      traceStep(3, 'JSON Schema Guard', 'priority=high valid', 'Natija xavfsiz tekshirildi', 'Validated structured payload'),
    ],
    commonMistakes: [
      mistake('AI API kalitini Frontend React/JS kodida yoki `.env` ni `VITE_` bilan ochib qo‘yish', 'Exposing Secret AI API Keys Inside Frontend Browser Code', `# Any variable bundled into React/browser DevTools can be stolen in 5 seconds and drained!`, 'Stolen API keys & huge bills', `print("Call AI APIs strictly from server-side /api/* routes reading os.environ!")`, 'API kalitlarni faqat backend server muhitida saqlang (`VITE_` qilmang!).', 'Keep AI API keys strictly inside backend server routes—never bundle into client JS.', 'Kalit faqat serverda tursin.', 'Keep API keys server-side only.'),
      mistake('LLM javobini tekshirmasdan to‘g‘ridan-to‘g‘ri SQL yoki `eval()` ga uzatish', 'Executing Unsanitized LLM Outputs in SQL or eval()', `# Prompt injection can trick an LLM into emitting malicious SQL or shell commands if executed raw!`, 'RCE / SQL Injection vulnerabilities', `print("Treat all LLM outputs as untrusted input: parse strict JSON schemas & use parameterized tools!")`, 'LLM javobi ham ishonchsiz tashqi ma’lumotdir — faqat schema va ruxsat etilgan toollarni ishlating.', 'Treat LLM outputs as untrusted text: validate strict schemas and never `eval`/`exec` raw text.', 'Hech qachon `eval()`/`exec()` qilmang.', 'Never `eval()` LLM outputs.'),
    ],
    compareTitleUz: 'Prompt Engineering vs RAG vs Fine-Tuning',
    compareTitleEn: 'Adapting LLMs Compared',
    compareUz: ['Prompt Engineering: uslub, format va rol berish — eng tez va tekin boshlanish.', 'RAG (Retrieval): yangi/xususiy hujjatlar (PDF, bazalar) bo‘yicha aniq faktli javoblar — hallucinationni keskin kamaytiradi.', 'Fine-Tuning: modelning maxsus ohang/vazifa xatti-harakatini o‘zgartirish — eng qimmat va oxirgi chora.'],
    compareEn: ['Prompt Engineering: steers formatting & instructions instantaneously.', 'RAG: grounds answers dynamically in live private knowledge bases.', 'Fine-Tuning: updates model weights for specialized style/tasks when prompts & RAG aren’t enough.'],
    compareSummaryUz: 'Tabriklaymiz — siz 17-kurs va 196 ta Python Mastery darsini yakunladingiz! Xavfsiz Backend AI proksi, RAG va Structured JSON bilan professional AI muhandisga aylandingiz!',
    compareSummaryEn: 'Congratulations on completing all 17 courses and 196 lessons of Python Mastery—you are ready to ship secure, data-driven, AI-powered Python systems!',
    practiceTasks: [
      pt('p1714_1', '1-mashq: Cosine Similarity Bir Xil Vektor', 'Task 1: Identical Vector Cosine', '`[1, 1]` va `[2, 2]` vektorlarining Cosine Similarity si necha?', 'Compute cosine similarity.', `import math\na, b = [1, 1], [2, 2]\nprint(round(sum(x*y for x,y in zip(a,b)) / (math.hypot(*a)*math.hypot(*b)), 2))`, '1.0', 'Parallel vectors have cosine 1.0', 'Prints 1.0.'),
      pt('p1714_2', '2-mashq: Orthogonal (0) Vektorlar', 'Task 2: Orthogonal Cosine', '`[1, 0]` va `[0, 1]` dot productini toping.', 'Dot product of orthogonal vectors.', `print(1 * 0 + 0 * 1)`, '0', 'Perpendicular -> 0', 'Prints 0.'),
      pt('p1714_3', '3-mashq: Structured JSON Validation', 'Task 3: Validate Required Keys', '`{"ok": True, "score": 9}` da `"ok"` va `"score"` borligini tekshiring.', 'Check required keys.', `d = {"ok": True, "score": 9}\nprint({"ok", "score"}.issubset(d))`, 'True', 'issubset check', 'Prints True.'),
      pt('p1714_4', '4-mashq: Token Budjeti Chegarasi', 'Task 4: Enforce Token Budget', '`tokens = 4500`, `limit = 4000` bo‘lsa `"REJECT"` chiqaring.', 'Check token limit.', `print("REJECT" if 4500 > 4000 else "ALLOW")`, 'REJECT', 'Check limit', 'Prints REJECT.'),
      pt('p1714_5', '5-mashq: RAG Top-2 Kesish', 'Task 5: Pick Top-2 Chunks', '`[(0.4, "c1"), (0.9, "c2"), (0.7, "c3")]` dan eng yuqori 2 tasini oling.', 'Select top-2 chunks.', `scored = [(0.4, "c1"), (0.9, "c2"), (0.7, "c3")]\nprint([name for _, name in sorted(scored, reverse=True)[:2]])`, "['c2', 'c3']", 'Sort descending slice [:2]', "Prints ['c2', 'c3']."),
    ],
    quiz: [
      q('q1714_1', 'Brauzer + Backend ilovada AI API kaliti qayerda saqlanishi SHART?', 'Where MUST secret AI API keys reside in web applications?', ['React state', 'Backend server muhitida (`os.environ`) — faqat `/api/*` proksi orqali', 'localStorage', 'GitHub README'], ['React state', 'Backend server environment behind `/api/*` proxy routes', 'localStorage', 'README'], 1, 'Faqat server-side muhitda.', 'Backend server environment only.'),
      q('q1714_2', 'Kompaniyaning yangi ichki PDF hujjatlari asosida faktli javob berish va hallucinationni kamaytirish uchun eng to‘g‘ri arxitektura?', 'Best architecture grounding an LLM on live private documents to curb hallucinations?', ['Fine-tuning', 'RAG (Chunking + Embeddings + Cosine Similarity Retrieval)', 'Temp=2.0', 'Regex'], ['Fine-tuning', 'RAG (Retrieval-Augmented Generation)', 'Temp=2.0', 'Regex'], 1, 'RAG.', 'RAG.'),
      q('q1714_3', 'Ikki hujjat vektori mutlaqo qarama-qarshi emas, bir xil yo‘nalishda bo‘lsa Cosine Similarity nechaga yaqin?', 'Cosine Similarity value when two normalized embedding vectors point in the exact same direction?', ['0.0', '1.0', '-1.0', '100'], ['0.0', '1.0', '-1.0', '100'], 1, '`1.0`.', '`1.0`.'),
      q('q1714_4', 'Nima uchun LLM javobini ilova logikasida ishlatishdan oldin Pydantic / JSON Schema bilan tekshirish kerak?', 'Why validate LLM JSON responses with a strict schema before downstream code uses them?', ['Rang uchun', 'LLM noto‘g‘ri tur yoki etishmayotgan maydon qaytarganda tizim yiqilmasligi uchun', 'CPU', 'CSS'], ['Color', 'Guarantees required fields/types before downstream logic executes', 'CPU', 'CSS'], 1, 'Ishonchli tiplar va xatolardan himoya.', 'Schema safety & type guarantees.'),
      q('q1714_5', 'Foydalanuvchi matni orqali tizim ko‘rsatmalarini buzib yuborishga urinish (`"Ignore previous instructions..."`) qaysi xavf turi?', 'Security risk where untrusted user input tries to hijack model system instructions?', ['Overfitting', 'Prompt Injection', 'Broadcasting', 'Gradient Vanishing'], ['Overfitting', 'Prompt Injection', 'Broadcasting', 'Gradient Vanishing'], 1, 'Prompt Injection.', 'Prompt Injection.'),
    ],
    homework: hw('Python Mastery Yakuniy Bitiruv Loyihasi & Review #39', 'Grand Capstone: Secure RAG + JSON Validator + ML Evaluator', 'Overlap bilan Chunking, Cosine Similarity Top-K RAG qidiruvi, Structured JSON Schema tekshiruvi va token budjeti himoyasini bitta to‘liq Python AI Backend modulida jamlang.', 'Assemble Python Mastery’s grand finale combining overlapping text chunking, Cosine Similarity Top-K retrieval, strict JSON schema validation, and token-budget guardrails.', ['Chunking + Cosine RAG + Schema Guard', 'Review #39 Grand Capstone'], ['End-to-end RAG module', 'Grand Capstone complete'], 'Guard zero-norm vectors in `cosine()` and validate every required JSON key & type.', 'Congratulations—Python Mastery complete!', 'Barcha 17 kurs va 196 dars yakunlandi — haqiqiy Python muhandis bo‘lishingiz bilan tabriklaymiz!', 'All 17 courses & 196 lessons complete!', 40),
    reviewCheckpoint: review(
      39,
      'Review Loyiha #39 (YAKUNIY): Secure RAG + PyTorch Loop + AI Guardrails!',
      'Review Project #39 (FINAL CAPSTONE): End-to-End AI Engineering Suite!',
      '17-kurs va barcha 196 ta Python Mastery darsini yakunlang: Chunking -> Cosine Similarity RAG -> Strict JSON Validator -> Token Guardrail zanjirini ishga tushiring!',
      'Complete Python Mastery’s 39th and final checkpoint by integrating overlapping chunking, Cosine Similarity retrieval, JSON schema validation, and budget guardrails.',
      ['Overlapping chunker + Cosine Top-K', 'Strict JSON schema & token budget gate'],
      ['Chunker + Cosine Top-K', 'Schema & budget gates'],
      `import json, math\n# Review #39 (FINAL): 17 Courses, 196 Lessons Complete!\nprint("Python Mastery Capstone #39: All Systems Ready!")`,
    ),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),
];
