import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C17_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-17-01',
    courseId: 'ai_ml',
    moduleId: 'c17_m1',
    order: 1,
    titleUz: 'Artificial Intelligence Tushunchasi — AI vs ML vs Deep Learning va Qachon AI Kerak Emas',
    titleEn: 'Artificial Intelligence Foundations: AI vs ML vs Deep Learning & When NOT to Use AI',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-16-12'],
    conceptId: 'ai_intro',
    whyUz: "«Har joyga AI qo‘shamiz!» shiori ko‘pincha qimmat xatoga aylanadi. Haqiqiy muhandis **AI (keng maydon) -> Machine Learning (ma’lumotdan o‘rganish) -> Deep Learning (ko‘p qatlamli neyron tarmoqlar)** ierarxiyasini aniq ajratadi va oddiy `if/else` qoida yoki SQL so‘rovi yetarli bo‘lgan joyda ML ishlatmaydi!",
    whyEn: 'Understand the AI -> Machine Learning -> Deep Learning -> Generative AI hierarchy, contrast deterministic rule engines against learned statistical models, and recognize when simple rules beat complex AI.',
    analogyUz: "**Anʼanaviy Dasturlash**: Qoidalar + Ma’lumot -> Javob (`if price > 100`). **Machine Learning**: Tarixiy Ma’lumot + Javoblar -> Qoidalar (Model)! Lekin `2 + 2` yoki soliq formulasini ML ga o‘qitish kerak emas — qoida aniq va 100% deterministik!",
    analogyEn: 'Classic software turns explicit Rules + Data into Answers; Machine Learning learns hidden Rules from historical Data + Answers—use classic rules whenever exact formulas already exist.',
    stopsUz: "AI loyihasidan oldingi 3 ta muhim filtr: 1) **Deterministik qoidalar yetarlimi?** Masalan, parol uzunligi yoki soliq stavkasi uchun ML mutlaqo ortiqcha! 2) **Yaxshi tarixiy ma’lumot bormi?** Ma’lumotsiz ML ishlamaydi («Garbage In, Garbage Out»). 3) **Baseline (oddiy asos) dan boshlang**: avval oddiy qoida yoki chiziqli modelni o‘lchab ko‘ring, murakkab model faqat o‘lchanadigan foyda bersa o‘ting!",
    stopsEn: 'Never jump straight to deep learning: ask whether deterministic rules solve the problem cleanly, verify you have labeled historical data, and always benchmark against a simple baseline first.',
    objUz: ['AI > Machine Learning > Deep Learning > Generative AI konsentrik doiralari', 'Deterministic Rule-Based Systems vs Learned ML Models', 'Qachon ML ishlatmaslik kerak + Baseline-First tamoyili'],
    objEn: ['Map the concentric hierarchy: AI -> Machine Learning -> Deep Learning -> GenAI', 'Contrast deterministic rule engines with statistical ML learning', 'Evaluate problem suitability and build simple baselines before ML'],
    theoryUz: `### 1. AI -> ML -> Deep Learning
- **AI**: Inson aqlini talab qiluvchi vazifalarni bajaruvchi har qanday tizim (shaxmat qoidalari ham, LLM ham!).
- **ML**: Qoidalarni qo‘lda yozmasdan, ma’lumotdan parametr o‘rganuvchi algoritmlar (Linear Regression, Random Forest).
- **Deep Learning**: Tasvir, ovoz va matn uchun ko‘p qatlamli neyron tarmoqlar (PyTorch).
### 2. Qoidali Tizim vs ML
Aniq formula bor joyda (soliq, validatsiya) qoida yozing; yuzlab noaniq belgilar (spam, kredit skoring, tasvir) da ML ishlating!`,
    theoryEn: `### 1. The AI Hierarchy
AI encompasses all intelligent behavior (including expert rules); ML learns patterns from data; Deep Learning stacks multi-layer neural networks; Generative AI models new text/images/code.
### 2. Rules vs ML
Use deterministic rules for exact policies and ML where manual \`if/elif\` rules fail to scale across messy high-dimensional inputs.`,
    examples: [
      ex('Misol 1: Rule-Based vs Data-Driven (Learned Threshold) Taqqoslash', 'Example 1: Deterministic Rule vs Learned Threshold', `temps = [15, 22, 34, 38]
rule_alerts = [t > 30 for t in temps]
learned_cutoff = (22 + 34) / 2  # boundary learned midway between safe & danger examples
ml_style = [t >= learned_cutoff for t in temps]
print("Rule alerts:", rule_alerts, "| Learned cutoff:", learned_cutoff, "| ML-style:", ml_style)`, `Rule alerts: [False, False, True, True] | Learned cutoff: 28.0 | ML-style: [False, False, True, True]`, 'Qoida `t > 30` oldindan yozildi; ML esa misollar orasidan `28.0` chegarasini o‘zi topdi.', 'Contrasts an explicit human rule against a decision boundary inferred from labeled samples.'),
      ex('Misol 2: Baseline-First — Oddiy O‘rtacha Bashorat (Dummy Regressor)', 'Example 2: Baseline Predictor Before Complex AI', `train_prices = [100, 120, 140, 160]
baseline_pred = sum(train_prices) / len(train_prices)
actual_test = [135, 125]
mae = sum(abs(y - baseline_pred) for y in actual_test) / len(actual_test)
print("Baseline guess:", baseline_pred, "| Baseline MAE:", mae)`, `Baseline guess: 130.0 | Baseline MAE: 5.0`, 'Har qanday murakkab AI model shu oddiy `MAE = 5.0` bazaviy natijadan yaxshiroq chiqishi shart!', 'Establishes a simple mean-predictor benchmark that any ML model must beat.'),
      ex('Misol 3: AI Suitability Checklist', 'Example 3: Engineering Rule vs ML Router', `def choose_approach(has_exact_formula: bool, labeled_rows: int) -> str:
    if has_exact_formula:
        return "Deterministic Rule Engine"
    return "Machine Learning" if labeled_rows >= 500 else "Collect Data + Rule Baseline"

print(choose_approach(True, 10000), "|", choose_approach(False, 2000))`, `Deterministic Rule Engine | Machine Learning`, 'Aniq formula bo‘lsa hech qachon ML ishlatmang; formulasi noaniq va ko‘p ma’lumotli vazifada ML tanlang.', 'Routes tasks with exact specs to deterministic code and complex pattern tasks with data to ML.'),
    ],
    traceTitleUz: 'Traditional Code vs ML Paradigm Trace',
    traceTitleEn: 'Tracing Rule Engine vs ML Flow',
    traceCode: `Code: (Rules + Data) -> Answer | ML: (Answers + Data) -> Model`,
    traceSteps: [
      traceStep(1, 'Traditional Software', 'if tax > 0: ...', 'Inson qoidani kodlaydi', 'Human writes explicit logic'),
      traceStep(2, 'Machine Learning', 'fit(X, y) -> weights', 'Algoritm qonuniyatni o‘zi topadi', 'Algorithm learns parameters'),
    ],
    commonMistakes: [
      mistake('Oddiy deterministik biznes qoidasi (`if balance < 0`) uchun ML o‘qitish', 'Using Machine Learning Where a Simple Deterministic Rule Works', `# Training a neural network to check whether an email contains "@" wastes time and adds bugs!`, 'Unnecessary complexity & silent edge failures', `print("Reserve ML for fuzzy patterns; keep deterministic policies in pure unit-tested Python!")`, 'Aniq qoidali joyda sof Python `if` + unit test yozing.', 'Use plain tested Python rules whenever exact business logic exists.', 'Oddiy qoida yetarli bo‘lsa ML yozmang.', 'Prefer simple rules first.'),
      mistake('Bazaviy (Baseline) modelni o‘lchamasdan to‘g‘ridan-to‘g‘ri murakkab AI ga sakrash', 'Skipping Simple Baselines Before Trying Deep Models', `# Without a dummy/rule baseline, you don't even know if your complex model added real value!`, 'Wasted weeks on zero-gain models', `print("Always measure a 5-line Baseline first—ship complexity only if it beats the baseline cleanly!")`, 'Avval oddiy baseline MAE/Accuracy o‘lchang, keyin ML ni solishtiring.', 'Measure a trivial baseline first and validate every added model complexity against it.', 'Avval Baseline o‘lchang.', 'Benchmark a baseline first.'),
    ],
    compareTitleUz: 'AI vs Machine Learning vs Deep Learning',
    compareTitleEn: 'AI vs ML vs Deep Learning',
    compareUz: ['AI: aqlli harakat qiluvchi istalgan tizim (qoidalar, qidiruv, ML, LLM).', 'Machine Learning: jadvalli ma’lumotlarda yuqori samarali statistik o‘rganish.', 'Deep Learning: rasm, audio, matn kabi xom signallar uchun chuqur neyron tarmoqlar.'],
    compareEn: ['AI: broad umbrella covering rules, search, and learning.', 'Machine Learning: statistical models excelling on tabular data.', 'Deep Learning: multi-layer neural networks excelling on images, audio, and language.'],
    compareSummaryUz: 'AI > ML > DL ierarxiyasini tushuning, aniq qoida yetarli joyda ML qo‘shmang va doim Baseline natijadan boshlang.',
    compareSummaryEn: 'Distinguish AI, ML, and DL clearly; reject unnecessary ML when rules suffice, and benchmark against simple baselines first.',
    practiceTasks: [
      pt('p1701_1', '1-mashq: Paradigm Klasifikatori', 'Task 1: Rule vs ML Selector', '`"tax_formula"` -> `"Rule"`, `"spam_filter"` -> `"ML"` chiqaring.', 'Select Rule vs ML.', `def kind(t): return "Rule" if "formula" in t else "ML"\nprint(kind("tax_formula"), kind("spam_filter"))`, 'Rule ML', 'Check formula keyword', 'Prints Rule ML.'),
      pt('p1701_2', '2-mashq: Dummy Baseline Regressor', 'Task 2: Mean Baseline Guess', '`[10, 20, 30, 40]` uchun bazaviy o‘rtacha bashoratni chiqaring.', 'Compute mean baseline.', `ys = [10, 20, 30, 40]\nprint(sum(ys) / len(ys))`, '25.0', 'Mean of targets', 'Prints 25.0.'),
      pt('p1701_3', '3-mashq: Majority Class Baseline', 'Task 3: Most-Frequent Class Baseline', '`[0, 1, 0, 0, 1]` da ko‘p uchraydigan klass va uning accuracy sini chiqaring.', 'Majority class accuracy.', `y = [0, 1, 0, 0, 1]\nmaj = max(set(y), key=y.count)\nprint(maj, y.count(maj) / len(y))`, '0 0.6', 'Mode accuracy', 'Prints 0 0.6.'),
      pt('p1701_4', '4-mashq: Baseline Ustidan O‘sish (Lift)', 'Task 4: Model Improvement Over Baseline', 'Baseline MAE `10.0`, ML MAE `6.5` bo‘lsa xato necha % kamaydi?', 'Compute error reduction %.', `print(round((10.0 - 6.5) / 10.0 * 100, 1))`, '35.0', '(base - ml) / base * 100', 'Prints 35.0.'),
      pt('p1701_5', '5-mashq: Garbage-In Quality Gate', 'Task 5: Minimum Clean Ratio Check', 'Toza qatorlar ulushi `>= 0.8` bo‘lsa `"READY"`, aks holda `"CLEAN_FIRST"`.', 'Gate dataset readiness.', `def gate(ratio): return "READY" if ratio >= 0.8 else "CLEAN_FIRST"\nprint(gate(0.85), gate(0.5))`, 'READY CLEAN_FIRST', 'Threshold 0.8', 'Prints READY CLEAN_FIRST.'),
    ],
    quiz: [
      q('q1701_1', 'Anʼanaviy dasturlash bilan Machine Learning ning asosiy kirish-chiqish farqi?', 'Core input/output difference between traditional programming and Machine Learning?', ['Hech qanday', 'Anʼanaviy: Qoida+Data -> Javob; ML: Data+Javob -> O‘rganilgan Model(Qoida)', 'ML Python emas', 'Tezlik'], ['None', 'Traditional: Rules+Data -> Answers; ML: Data+Answers -> Learned Rules', 'Not Python', 'Speed'], 1, 'ML qoidani ma’lumot va javoblardan o‘rganadi.', 'ML induces rules from data + outcomes.'),
      q('q1701_2', 'Qaysi vazifa uchun Machine Learning o‘rniga oddiy deterministik Python `if/else` yozish TO‘G‘RI?', 'Which task should use a deterministic rule instead of Machine Learning?', ['Yuzni tanish', 'Qonun bo‘yicha 12% QQS solig‘ini hisoblash', 'Spam aniqlash', 'Nutq matnga'], ['Face ID', 'Calculating fixed 12% VAT tax law', 'Spam filter', 'Speech-to-text'], 1, 'Aniq qonuniy formula deterministik kodda yoziladi.', 'Exact statutory formulas belong in deterministic code.'),
      q('q1701_3', 'AI > ML > DL ierarxiyasida eng tor ichki qism qaysi?', 'Innermost subset inside AI > Machine Learning > Deep Learning?', ['AI', 'Deep Learning (ko‘p qatlamli neyron tarmoqlar)', 'SQL', 'Statistics'], ['AI', 'Deep Learning', 'SQL', 'Statistics'], 1, 'Deep Learning — ML ning bir bo‘limi, ML esa AI ning bir bo‘limi.', 'Deep Learning sits inside ML inside AI.'),
      q('q1701_4', 'Murakkab ML modelini qurishdan oldin nima uchun 5-qatorli Baseline model baholanadi?', 'Why measure a trivial Baseline model before building complex ML models?', ['Chiroy uchun', 'Yangi murakkab model haqiqatan ham foyda berganini solishtirish uchun', 'GPU talabi', 'JSON'], ['Looks', 'Establishes a concrete floor proving added complexity actually improves performance', 'GPU', 'JSON'], 1, 'Taraqqiyotni o‘lchash chegarasi.', 'Objective benchmark floor.'),
      q('q1701_5', '«Garbage In, Garbage Out» tamoyili ML da nimani anglatadi?', 'What does "Garbage In, Garbage Out" mean in Machine Learning?', ['Tezlik', 'Kirish ma’lumotlari shovqinli/xato bo‘lsa, eng kuchli model ham noto‘g‘ri bashorat beradi', 'RAM', 'Cloud'], ['Speed', 'Dirty or mislabeled training data yields unreliable predictions regardless of model complexity', 'RAM', 'Cloud'], 1, 'Model sifati ma’lumot sifatiga bog‘liq.', 'Model quality is bounded by data quality.'),
    ],
    homework: hw('Baseline & Suitability Assessor', 'AI Suitability & Baseline Benchmark Utility', 'Har qanday muammo uchun deterministik qoida yetarlimi yoki ML kerakligini tekshiruvchi, shuningdek Dummy Mean/Majority Baseline MAE va Accuracy sini hisoblovchi modul yozing.', 'Write a diagnostic module classifying rule-based vs ML problems and computing dummy mean-regression MAE plus majority-class baseline accuracy.', ['Suitability Gate + Mean/Majority Baselines', 'Lift calculation over baseline'], ['Rule vs ML gate', 'Baseline MAE & Accuracy'], 'Compute baseline error metrics first so later models have a concrete target to beat.', 'Disciplined ML engineering start.', 'Keyingi darsda ML qanday qilib Loss Function ni minimallashtirishini ko‘ramiz!', 'Learn ML optimization next.', 20),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-17-02',
    courseId: 'ai_ml',
    moduleId: 'c17_m1',
    order: 2,
    titleUz: 'Machine Learning Asoslari — Features (`X`), Target (`y`), Loss Function va Gradient Descent',
    titleEn: 'How Machine Learning Works: Features, Targets, Loss & Gradient Descent',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-17-01'],
    conceptId: 'ml_mechanics',
    whyUz: "ML model «sehrli qora quti» emas! Har qanday ML o‘qitish atigi 4 ta matematik g‘ildirak ustida aylanadi: 1) Parametrli taxmin (**Prediction `ŷ = w·x + b`**), 2) Xatolik o‘lchovi (**Loss Function**), 3) Xatoni kamaytirish yo‘nalishi (**Gradient**), 4) Qadamlab tuzatish (**Gradient Descent `w -= lr * grad`**). Buni 15 qator Python da ko‘rsangiz, Scikit-learn dan PyTorch gacha hammasini tushunasiz!",
    whyEn: 'Demystify the core optimization loop behind Machine Learning: features `X`, targets `y`, hypothesis parameters `w/b`, Mean Squared Error loss, gradient descent weight updates (`learning_rate`), and Generalization vs Memorization.',
    analogyUz: "**Gradient Descent** — ko‘zi bog‘langan odamning tumanli tog‘dan vodiyga tushishi: har qadamda oyog‘i ostidagi qiyalikni (gradient) sezib, pastga qarab `learning_rate` kattalikda qadam tashlaydi. Qadam juda katta bo‘lsa — qarama-qarshi qiyaga uchib ketadi (diverge!); juda kichik bo‘lsa — tushishi abadiy cho‘ziladi!",
    analogyEn: 'Gradient descent is walking downhill in fog: feel the local slope (gradient) and step downhill scaled by `learning_rate` until reaching the lowest loss valley.',
    stopsUz: "ML mexanikasida 3 ta asosiy tushuncha: 1) **Memorization != Generalization**: o‘quv mashqlarini yodlab olgan (`train_error = 0`) talaba imtihonda (`test_error` katta) yiqiladi — **Overfitting**! 2) **Learning Rate (`lr`)**: juda katta (`lr=1.0`) Loss ni portlatib `inf`/`nan` qiladi; juda kichik (`lr=1e-8`) esa deyarli siljimaydi! 3) **Loss != Business Metric**: model uzluksiz MSE/Cross-Entropy ni minimallashtiradi, lekin siz biznesda Accuracy, F1 yoki foydani o‘lchaysiz!",
    stopsEn: 'Training aims for **generalization** on unseen data rather than memorizing training rows (`overfitting`), tuning `learning_rate` to avoid divergence or stalls, and pairing smooth losses with business metrics.',
    objUz: ['`X` (Features matritsa), `y` (Target vektor) va Model parametrlari (`w`, `b`)', 'Loss Function (MSE) va sof Python da **Gradient Descent** o‘qitish sikli', 'Learning Rate (`lr`) ta’siri hamda Underfitting vs Good Fit vs Overfitting'],
    objEn: ['Define feature matrix `X`, target `y`, weights `w`, and bias `b`', 'Implement a gradient descent loop minimizing MSE in pure Python', 'Diagnose `learning_rate` instability and Underfitting vs Overfitting'],
    theoryUz: `### 1. O‘qitish Sikli (4 Qadam)
1. **Forward**: \`y_hat = w * x + b\`
2. **Loss**: \`MSE = mean((y_hat - y) ** 2)\`
3. **Gradient**: \`dw = (2/N) * sum((y_hat - y) * x)\`, \`db = (2/N) * sum(y_hat - y)\`
4. **Update**: \`w -= lr * dw\`, \`b -= lr * db\`
### 2. Generalization (Umumlashtirish)
Maqsad — ilgari ko‘rmagan \`Test\` ma’lumotlarda xatoni kamaytirish!`,
    theoryEn: `### 1. The Optimization Loop
Predict \`y_hat = w*x + b\` -> Measure MSE loss -> Compute gradients \`dw, db\` -> Step \`w -= lr * dw\`.
### 2. Generalization Trade-Off
- **Underfitting**: model too simple; high train AND test error.
- **Overfitting**: memorizes training noise; low train error, high test error.`,
    examples: [
      ex('Misol 1: Sof Python da Haqiqiy Gradient Descent (`y = 2x + 1` ni O‘rganish)', 'Example 1: Pure-Python Gradient Descent Learning y = 2x + 1', `xs, ys = [1.0, 2.0, 3.0, 4.0], [3.0, 5.0, 7.0, 9.0]
w, b, lr = 0.0, 0.0, 0.05
n = len(xs)
for _ in range(300):
    preds = [w * x + b for x in xs]
    dw = (2 / n) * sum((yh - y) * x for yh, y, x in zip(preds, ys, xs))
    db = (2 / n) * sum(yh - y for yh, y in zip(preds, ys))
    w -= lr * dw
    b -= lr * db

print(f"Learned w={w:.2f}, b={b:.2f} (true: w=2.00, b=1.00)")`, `Learned w=2.00, b=1.00 (true: w=2.00, b=1.00)`, 'Hech qanday kutubxonasiz 300 ta gradient qadami `w=2.0, b=1.0` parametrlarini aniq topdi!', 'Learns exact parameters `w=2.0, b=1.0` from scratch via 300 MSE gradient descent steps.'),
      ex('Misol 2: Overfitting vs Underfitting Diagnostik Chizmasi (Train vs Val Error)', 'Example 2: Diagnosing Underfit vs Good Fit vs Overfit', `def diagnose(train_err: float, val_err: float) -> str:
    if train_err > 0.25 and val_err > 0.25:
        return "Underfitting (high bias)"
    if val_err - train_err > 0.15:
        return "Overfitting (high variance)"
    return "Good Generalization"

print(diagnose(0.35, 0.38), "|", diagnose(0.01, 0.30), "|", diagnose(0.05, 0.07))`, `Underfitting (high bias) | Overfitting (high variance) | Good Generalization`, 'Train va Val xatolarini taqqoslash modelning qayerda muammosi borligini darhol ko‘rsatadi.', 'Compares train vs validation errors to identify bias vs variance issues cleanly.'),
      ex('Misol 3: Learning Rate Juda Katta Bo‘lganda Loss Portlashi', 'Example 3: Observing Divergence When Learning Rate Is Too High', `w, x, y_true = 1.0, 3.0, 6.0
for lr in (0.05, 0.5):
    wt = w
    for _ in range(3):
        grad = 2 * (wt * x - y_true) * x
        wt -= lr * grad
    print(f"lr={lr} -> after 3 steps w={round(wt, 2)}")`, `lr=0.05 -> after 3 steps w=2.0\nlr=0.5 -> after 3 steps w=514.0`, '`lr=0.05` da `w=2.0` ga chiroyli yaqinlashdi; `lr=0.5` da esa `514.0` ga portlab ketdi!', 'Shows stable convergence at `lr=0.05` vs explosive divergence at `lr=0.5`.'),
    ],
    traceTitleUz: '1-Qadam Gradient Descent Trace',
    traceTitleEn: 'Tracing One Gradient Descent Step',
    traceCode: `w=0, b=0, x=2, y=5, lr=0.1 -> update w, b`,
    traceSteps: [
      traceStep(1, 'Forward', 'y_hat = 0*2 + 0 = 0', 'Taxmin hisoblandi', 'Predicted 0'),
      traceStep(2, 'Gradient', 'err=-5 -> dw=-20, db=-10', 'Yo‘nalish va og‘ish topildi', 'Computed slope gradients'),
      traceStep(3, 'Step Update', 'w=2.0, b=1.0', 'Og‘irliklar xatoni kamaytirdi', 'Stepped opposite to gradient'),
    ],
    commonMistakes: [
      mistake('Model sifatini faqat Training set dagi natija bilan maqtanish', 'Reporting Training Score as Proof of Model Accuracy', `# Evaluating a memorized decision tree on its own training set gives 100% even if it fails completely in production!`, 'Catastrophic production failure', `print("Never judge generalization on train data—evaluate exclusively on unseen test/validation splits!")`, 'Har doim model ko‘rmagan Test/Validation ma’lumotlarda baholang.', 'Evaluate generalization strictly on held-out unseen validation or test splits.', 'Faqat ko‘rilmagan Test da baholang.', 'Score on unseen test data.'),
      mistake('`Learning Rate` haddan tashqari katta bo‘lib `Loss = NaN` ga chiqib ketish', 'Choosing Too High a Learning Rate Causing NaN Divergence', `# Large lr steps overshoot the minimum, doubling error each iteration until float overflow -> NaN!`, 'Diverging NaN loss', `print("If loss grows or hits NaN, drop learning_rate by 3x-10x and inspect feature scaling!")`, 'Loss oshsa `lr` ni 10x kamaytiring va featurelarni masshtablang.', 'Lower `learning_rate` and scale features when loss oscillates or diverges.', 'Loss oshsa `lr` ni tushiring.', 'Reduce `learning_rate` if loss grows.'),
    ],
    compareTitleUz: 'Underfitting (Bias) vs Overfitting (Variance)',
    compareTitleEn: 'Bias-Variance Tradeoff',
    compareUz: ['Underfitting: model juda sodda — train ham, test ham yomon (ko‘proq feature/murakkablik kerak).', 'Overfitting: model shovqinni yodlab olgan — train zo‘r, test yomon (ko‘proq data, regularization, oddiyroq model kerak).'],
    compareEn: ['Underfitting (High Bias): misses real signal on both train and test.', 'Overfitting (High Variance): memorizes training noise; degrades on unseen test rows.'],
    compareSummaryUz: 'ML — loss funksiyani gradient descent orqali kamaytirib, training shovqinini emas, umumiy qonuniyatni (Generalization) o‘rganishdir.',
    compareSummaryEn: 'ML fits parameters via gradient descent to minimize loss while balancing complexity to generalize rather than overfit training noise.',
    practiceTasks: [
      pt('p1702_1', '1-mashq: Chiziqli Model Bashorati', 'Task 1: Linear Forward Pass', '`w=2.5, b=1.0` bo‘lsa `x=[2, 4]` uchun bashoratlarni chiqaring.', 'Compute w*x + b.', `w, b = 2.5, 1.0\nprint([w * x + b for x in (2, 4)])`, '[6.0, 11.0]', 'w*x + b', 'Prints [6.0, 11.0].'),
      pt('p1702_2', '2-mashq: Mean Squared Error (MSE)', 'Task 2: Compute MSE Loss', '`y_true=[3, 5]` va `y_pred=[2, 7]` uchun MSE ni toping.', 'Calculate MSE.', `yt, yp = [3, 5], [2, 7]\nprint(sum((a - b) ** 2 for a, b in zip(yt, yp)) / len(yt))`, '2.5', 'mean((y - yh)^2)', 'Prints 2.5.'),
      pt('p1702_3', '3-mashq: Bitta Gradient Step', 'Task 3: Single Weight Update Step', '`w=1.0, dw=-4.0, lr=0.1` bo‘lsa yangi `w` ni hisoblang.', 'Update weight.', `w, dw, lr = 1.0, -4.0, 0.1\nprint(round(w - lr * dw, 2))`, '1.4', 'w - lr * dw', 'Prints 1.4.'),
      pt('p1702_4', '4-mashq: Overfitting Detektori', 'Task 4: Overfit Flag', '`train_acc=0.99, test_acc=0.65` bo‘lsa gap > 0.15 ni tekshiring.', 'Check overfitting gap.', `print((0.99 - 0.65) > 0.15)`, 'True', 'Compare train - test gap', 'Prints True.'),
      pt('p1702_5', '5-mashq: Dot Product Ko‘p-Feature Forward', 'Task 5: Multi-Feature Dot Product', '`w=[2, -1], x=[3, 4], b=5` bo‘lsa `sum(wi*xi) + b` ni toping.', 'Compute linear dot + bias.', `print(sum(wi * xi for wi, xi in zip([2, -1], [3, 4])) + 5)`, '7', 'dot(w, x) + b', 'Prints 7.'),
    ],
    quiz: [
      q('q1702_1', 'Gradient Descent da `w -= lr * dw` formulasida nega minus (`-`) belgisi ishlatiladi?', 'Why subtract the gradient (`w -= lr * dw`) in Gradient Descent?', ['Tezroq', 'Gradient o‘sish yo‘nalishini ko‘rsatadi; xatoni KAMAYTIRISH uchun teskari tomonga yurish kerak', 'Python talabi', 'Bias'], ['Faster', 'Gradient points uphill; subtracting steps downhill to minimize loss', 'Syntax', 'Bias'], 1, 'Xatoni kamaytirish (pastga tushish) uchun.', 'Step downhill opposite gradient.'),
      q('q1702_2', 'Model training ma’lumotida `99%`, lekin test ma’lumotida atigi `62%` aniqlik bersa bu nima?', 'Diagnosis when training accuracy is `99%` yet unseen test accuracy is `62%`?', ['Underfitting', 'Overfitting (shovqinni yodlab olish)', 'Zero Bias', 'Scaling'], ['Underfitting', 'Overfitting', 'Zero Bias', 'Scaling'], 1, 'Overfitting.', 'Overfitting.'),
      q('q1702_3', 'Ikkala ko‘rsatkich (`train_error` ham, `test_error` ham juda baland) yomon bo‘lsa muammo nimada?', 'Diagnosis when BOTH training error and test error remain unacceptably high?', ['Underfitting (High Bias — model juda sodda)', 'Overfitting', 'Data Leak', 'Good Fit'], ['Underfitting (High Bias)', 'Overfitting', 'Data Leak', 'Good Fit'], 1 - 1, 'Underfitting (High Bias).', 'Underfitting (High Bias).'),
      q('q1702_4', 'Learning Rate (`lr`) haddan tashqari katta bo‘lganda ko‘pincha nima sodir bo‘ladi?', 'What happens when `learning_rate` is chosen much too large?', ['Aniqlik 100%', 'Qadamlar minimumdan sakrab o‘tib, Loss ortib ketadi (`inf`/`NaN`)', 'CPU sovuydi', 'Hech narsa'], ['100% acc', 'Steps overshoot the valley and loss diverges toward infinity/NaN', 'Cools CPU', 'Nothing'], 1, 'Loss tebranib portlab ketadi.', 'Loss overshoots and diverges.'),
      q('q1702_5', 'ML modelini o‘qitishdan asosiy maqsad nima?', 'Primary goal of training a Machine Learning model?', ['Training jadvalni yodlash', 'Ko‘rilmagan yangi ma’lumotlarda to‘g‘ri ishlash (Generalization)', 'Eng uzun kod', 'Eng katta fayl'], ['Memorize train set', 'Generalize accurately to unseen future data', 'Longest code', 'Largest file'], 1, 'Generalization.', 'Generalization.'),
    ],
    homework: hw('Sof Python Gradient Descent Regressor', 'From-Scratch Gradient Descent Trainer', 'Har qanday `(xs, ys)` juftligi uchun MSE Loss tarixini yozib boruvchi, `lr` portlashini tutib oluvchi va `epochs` yakunida o‘rganilgan `(w, b)` ni qaytaruvchi `LinearGDTrainer` tuzing.', 'Implement a `LinearGDTrainer` from scratch in pure Python logging MSE loss every 50 epochs, detecting divergence, and converging onto `(w, b)` parameters.', ['MSE + Gradient Descent + Divergence Guard', 'Predict on new test points'], ['Pure-Python GD trainer', 'Test MSE evaluation'], 'Track previous loss to detect divergence early if `lr` is too high.', 'True deep understanding of ML internals.', 'Review #37 dan oldin Supervised vs Unsupervised ni farqlaymiz!', 'Learn paradigms next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-03',
    courseId: 'ai_ml',
    moduleId: 'c17_m1',
    order: 3,
    titleUz: 'Supervised vs Unsupervised Learning — Paradigmalar va To‘g‘ri Masala Tanlash',
    titleEn: 'Supervised vs Unsupervised (and Reinforcement) Learning Paradigms',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-17-02'],
    conceptId: 'ml_paradigms',
    whyUz: "Mijozlarni «Premium / Standard» deb segmentlarga ajratmoqchisiz — lekin oldindan tayyor yorliq (`label`) yo‘q! Bu Supervised emas, **Unsupervised Clustering** dir! Muammoning **Supervised (Regression / Classification)**, **Unsupervised (Clustering / Dimensionality Reduction / Anomaly)** yoki **Reinforcement Learning** ekanini to‘g‘ri aniqlash to‘g‘ri algoritmni birinchi kundanoq tanlash demakdir.",
    whyEn: 'Distinguish Supervised learning (labeled Regression & Classification) from Unsupervised learning (unlabeled Clustering, Anomaly Detection, Dimensionality Reduction) and Reinforcement Learning (sequential reward optimization).',
    analogyUz: "**Supervised Learning** — ustozli dars: har savolning to‘g‘ri javobi (`y`) bor! **Unsupervised Learning** — ustozsiz kashfiyot: javoblar yo‘q, siz o‘xshash narsalarni o‘zingiz guruhlaysiz (Clustering)! **Reinforcement Learning** — o‘yin o‘ynash: harakat qilasiz va ball (reward) yoki jarima olasiz!",
    analogyEn: 'Supervised learning learns with teacher-provided answer keys; Unsupervised discovers hidden groups without labels; Reinforcement learns policies through trial-and-reward feedback.',
    stopsUz: "Muammoni turkumlashda 3 ta tez tekshiruv: 1) **Target `y` ustuni bormi?** Bor -> **Supervised**. Yo‘q -> **Unsupervised**! 2) Supervised ichida `y` uzluksiz son (`price = 145000.5`) bo‘lsa -> **Regression**; chekli toifalar (`spam/ham`, `cat/dog`) bo‘lsa -> **Classification**! 3) Ba’zan **Unsupervised -> Supervised** birga ishlaydi: avval K-Means bilan mijoz segmenti topilib, keyin yangi mijoz qaysi segmentga tushishi bashorat qilinadi.",
    stopsEn: 'Ask first: do labels `y` exist? Yes -> Supervised (continuous `y` = Regression, discrete `y` = Classification); No -> Unsupervised (Clustering, PCA, Anomaly Detection); sequential interactive actions -> Reinforcement Learning.',
    objUz: ['Supervised Learning: **Regression** (son bashorat) vs **Classification** (toifa)', 'Unsupervised Learning: **Clustering**, **Dimensionality Reduction (PCA)**, **Anomaly Detection**', 'Reinforcement Learning (State, Action, Reward) va muammo-algoritm xaritasi'],
    objEn: ['Separate Regression vs Classification within Supervised learning', 'Identify Clustering, Anomaly Detection, and Dimensionality Reduction in Unsupervised tasks', 'Recognize Reinforcement Learning loops (Agent, Environment, Reward)'],
    theoryUz: `### 1. Supervised Learning (\`(X, y)\` juftliklar)
- **Regression**: Uy narxi, harorat, savdo hajmi (uzluksiz son).
- **Classification**: Spam/Not Spam (Binary) yoki Mushuk/It/Qush (Multiclass).
### 2. Unsupervised Learning (Faqat \`X\`, \`y\` yo‘q!)
- **Clustering**: Mijozlarni o‘xshash xulq-atvor guruhlariga bo‘lish (K-Means).
- **Anomaly Detection**: G‘alati bank tranzaksiyasini tutish.
- **Dimensionality Reduction**: 100 ustunni 2 ta asosiy komponentga (PCA) siqish.
### 3. Reinforcement Learning
Robot yoki o‘yin agenti harakat qiladi va muhitdan mukofot (\`reward\`) oladi.`,
    theoryEn: `### 1. Supervised (\`X -> y\`)
Regression predicts continuous scalars; Classification assigns discrete class labels.
### 2. Unsupervised (\`X\` only)
Clustering discovers natural groups; Anomaly Detection flags rare outliers; PCA compresses correlated dimensions.
### 3. Reinforcement Learning
An agent selects actions in an environment to maximize cumulative long-term reward.`,
    examples: [
      ex('Misol 1: Muammoni ML Turiga Ajratuvchi Router', 'Example 1: ML Task Paradigm Classifier', `def classify_ml_task(has_labels: bool, target_type: str = "", sequential_reward: bool = False) -> str:
    if sequential_reward:
        return "Reinforcement Learning"
    if not has_labels:
        return "Unsupervised (Clustering / Anomaly)"
    return "Supervised: Regression" if target_type == "continuous" else "Supervised: Classification"

print(classify_ml_task(True, "continuous"))
print(classify_ml_task(True, "category"))
print(classify_ml_task(False))`, `Supervised: Regression\nSupervised: Classification\nUnsupervised (Clustering / Anomaly)`, 'Yorliq bor-yo‘qligi va `target` turi bir zumda to‘g‘ri ML yo‘nalishini aniqlaydi.', 'Routes real-world problem statements cleanly into Regression, Classification, Unsupervised, or RL.'),
      ex('Misol 2: Unsupervised Clustering Natijasini Tekshirish (Centroids)', 'Example 2: Nearest-Centroid Unsupervised Grouping', `centers = {"budget": 20, "premium": 200}
spends = [15, 30, 185, 220]
clusters = [min(centers, key=lambda c: abs(s - centers[c])) for s in spends]
print("Assigned clusters (no prior labels):", clusters)`, `Assigned clusters (no prior labels): ['budget', 'budget', 'premium', 'premium']`, 'Oldindan yorliq berilmasdan nuqtalar eng yaqin markaz atrofiga guruhlandi.', 'Demonstrates label-free cluster assignment based purely on feature proximity.'),
      ex('Misol 3: Anomaly Detection (Z-Score > 2.5 Chegarasi)', 'Example 3: Unsupervised Z-Score Anomaly Flagging', `import statistics

txns = [10, 12, 11, 9, 10, 95]
mu, sd = statistics.mean(txns[:-1]), statistics.stdev(txns[:-1])
flags = [x for x in txns if abs(x - mu) / sd > 3.0]
print("Normal baseline mu/sd:", mu, round(sd, 2), "| Anomalies:", flags)`, `Normal baseline mu/sd: 10.4 1.14 | Anomalies: [95]`, 'Firibgarlik belgilari yorliqlanmagan bo‘lsa ham, me’yordan >3 std uzoq tranzaksiya ajralib chiqdi.', 'Detects extreme anomalies statistically without needing pre-labeled fraud tags.'),
    ],
    traceTitleUz: 'ML Task Selector Decision Tree Trace',
    traceTitleEn: 'Tracing ML Paradigm Decision Flow',
    traceCode: `has_labels? -> Yes -> continuous? -> Regression : Classification`,
    traceSteps: [
      traceStep(1, 'Check labels', 'has_labels == False', 'Yorliq yo‘q -> Unsupervised', 'Unlabeled -> Unsupervised'),
      traceStep(2, 'Check labels == True', 'continuous vs discrete', 'Son -> Regression, Toifa -> Classification', 'Numeric vs Categorical target'),
    ],
    commonMistakes: [
      mistake('Kategorik kod (`city_id = 1, 2, 3`) ni uzluksiz son deb o‘ylab Linear Regression ga berish', 'Treating Numeric Category Codes as Continuous Regression Targets', `# Predicting zip_code (10001..90210) with Linear Regression outputs fake averages like 50105.5!`, 'Nonsensical fractional category predictions', `print("Treat discrete class IDs as Classification (never continuous Regression)!")`, 'Kodlar son ko‘rinishida bo‘lsa ham (`1, 2, 3`), ular toifa bo‘lsa Classification ishlating.', 'Use Classification for discrete numeric IDs; only true quantities belong in Regression.', 'Toifa ID larini Classification qiling.', 'Use Classification for class IDs.'),
      mistake('Unsupervised Clustering ga aniqlik (`Accuracy`) hisoblamoqchi bo‘lish', 'Expecting Supervised Accuracy Without Ground-Truth Labels', `# Clustering has no true labels y—you evaluate Silhouette Score or business coherence instead of Accuracy!`, 'Metric confusion', `print("Evaluate Clustering via Silhouette/Inertia or domain inspection, not supervised accuracy!")`, 'Yorliq bo‘lmaganda Accuracy o‘rniga Silhouette Score / Inertia o‘lchanadi.', 'Evaluate unsupervised clustering using Silhouette Score or Inertia rather than accuracy.', 'Yorliqsiz Accuracy bo‘lmaydi.', 'Use Silhouette, not Accuracy.'),
    ],
    compareTitleUz: 'Supervised vs Unsupervised vs Reinforcement',
    compareTitleEn: 'ML Learning Paradigms Compared',
    compareUz: ['Supervised: `(X, y)` yorliqli ma’lumot; Regression (son) va Classification (toifa).', 'Unsupervised: faqat `X`; Clustering, Anomaly Detection, PCA.', 'Reinforcement: agent muhitda harakat qilib mukofotni maksimallashtiradi.'],
    compareEn: ['Supervised: labeled `(X, y)` -> Regression or Classification.', 'Unsupervised: unlabeled `X` -> Clustering, Anomaly, or PCA.', 'Reinforcement: sequential trial-and-error maximizing cumulative reward.'],
    compareSummaryUz: 'Avval yorliq (`y`) bor-yo‘qligini va `y` ning turini tekshiring, shunda Supervised (Regression/Classification) yoki Unsupervised (Clustering/Anomaly) darhol ravshan bo‘ladi.',
    compareSummaryEn: 'Verify whether ground-truth labels `y` exist and whether `y` is continuous or discrete before picking algorithms or evaluation metrics.',
    practiceTasks: [
      pt('p1703_1', '1-mashq: Regression vs Classification', 'Task 1: Target Type Check', '`y=[120.5, 99.0]` va `y=["spam", "ham"]` turlarini chiqaring.', 'Classify target types.', `def t(y): return "Regression" if isinstance(y[0], float) else "Classification"\nprint(t([120.5, 99.0]), t(["spam", "ham"]))`, 'Regression Classification', 'Inspect target value type', 'Prints Regression Classification.'),
      pt('p1703_2', '2-mashq: Unsupervised Flag', 'Task 2: Check Label Presence', '`y = None` bo‘lsa `"Unsupervised"`, aks holda `"Supervised"` qaytaring.', 'Route by label presence.', `def mode(y): return "Unsupervised" if y is None else "Supervised"\nprint(mode(None), mode([0, 1]))`, 'Unsupervised Supervised', 'Check y is None', 'Prints Unsupervised Supervised.'),
      pt('p1703_3', '3-mashq: Eng Yaqin Klaster Markazi', 'Task 3: 1D Cluster Assignment', 'Markazlar `[10, 50]` bo‘lsa `18` va `42` qaysi klaster indeksiga (`0` yoki `1`) tushadi?', 'Assign nearest centroid index.', `cs = [10, 50]\nprint([min(range(2), key=lambda i: abs(x - cs[i])) for x in (18, 42)])`, '[0, 1]', 'argmin abs(x - center)', 'Prints [0, 1].'),
      pt('p1703_4', '4-mashq: Binary vs Multiclass', 'Task 4: Class Cardinality', '2 ta klass -> `"Binary"`, >2 klass -> `"Multiclass"` chiqaring.', 'Detect binary vs multiclass.', `def kind(ys): return "Binary" if len(set(ys)) == 2 else "Multiclass"\nprint(kind([0, 1, 0]), kind(["A", "B", "C"]))`, 'Binary Multiclass', 'Count distinct classes', 'Prints Binary Multiclass.'),
      pt('p1703_5', '5-mashq: RL Reward Yig‘indisi', 'Task 5: Cumulative RL Return', 'Mukofotlar `[1, -1, 5, 10]` ning jami rewardini hisoblang.', 'Sum RL rewards.', `print(sum([1, -1, 5, 10]))`, '15', 'sum(rewards)', 'Prints 15.'),
    ],
    quiz: [
      q('q1703_1', 'Uyning ertangi narxini (masalan `$142,500`) bashorat qilish qaysi turdagi masala?', 'Predicting a house’s continuous price (`$142,500`) is what ML task?', ['Clustering', 'Supervised: Regression', 'Dimensionality Reduction', 'RL'], ['Clustering', 'Supervised: Regression', 'Dimensionality Reduction', 'RL'], 1, 'Uzluksiz son = Supervised Regression.', 'Supervised Regression.'),
      q('q1703_2', 'Oldindan hech qanday yorliqsiz mijozlarni 4 ta o‘xshash xulq guruhiga bo‘lish qaysi paradigma?', 'Grouping customers into 4 behavioral segments without pre-existing labels?', ['Linear Regression', 'Unsupervised: Clustering', 'Binary Classification', 'Logistic Regression'], ['Linear Regression', 'Unsupervised: Clustering', 'Binary Classification', 'Logistic Regression'], 1, 'Unsupervised Clustering.', 'Unsupervised Clustering.'),
      q('q1703_3', 'Bank kartasidagi odatiy xarajatlardan keskin farq qiluvchi shubhali amalni yorliqsiz topish?', 'Detecting unusual credit-card transactions without labeled examples?', ['PCA', 'Anomaly Detection', 'Regression', 'One-Hot'], ['PCA', 'Anomaly Detection', 'Regression', 'One-Hot'], 1, 'Anomaly Detection.', 'Anomaly Detection.'),
      q('q1703_4', '100 ta bir-biriga bog‘liq ustunni eng muhim 2 o‘lchamga tushirish (siqish) usuli?', 'Unsupervised technique compressing 100 correlated features down to 2 axes?', ['K-Means', 'Dimensionality Reduction (masalan PCA)', 'Decision Tree', 'Gradient Descent'], ['K-Means', 'Dimensionality Reduction (e.g., PCA)', 'Decision Tree', 'Gradient Descent'], 1, 'Dimensionality Reduction (PCA).', 'Dimensionality Reduction (PCA).'),
      q('q1703_5', 'Shaxmat o‘ynovchi dastur har yurishdan keyin g‘alaba/mag‘lubiyat mukofoti (`reward`) orqali strategiya o‘rgansa bu nima?', 'Paradigm where a game-playing agent learns via trial actions and cumulative rewards?', ['Supervised', 'Reinforcement Learning', 'PCA', 'ETL'], ['Supervised', 'Reinforcement Learning', 'PCA', 'ETL'], 1, 'Reinforcement Learning.', 'Reinforcement Learning.'),
    ],
    homework: hw('ML Masala Klassifikatori & Review #37', 'ML Task Blueprint & Paradigm Advisor', 'Kiritilgan 5 ta biznes tavsifi (`target`, `labels`, `sequential`) asosida avtomatik tarzda Regression, Classification, Clustering, Anomaly Detection yoki RL turini hamda mos metrikalarni tavsiya qiluvchi dastur tuzing.', 'Build an interactive ML problem-framing advisor classifying problem specs into Regression, Binary/Multiclass Classification, Clustering, Anomaly Detection, or RL with appropriate evaluation metrics.', ['Paradigm router + Metric recommender', 'Z-score anomaly + Nearest centroid demo'], ['Task router', 'Metric matcher'], 'Check label presence first, then check target cardinality/type or sequential rewards.', 'Solid ML problem framing.', 'Review #37 loyihasi bilan 17-kurs 1-bo‘limini yakunlang!', 'Complete Review #37.', 25),
    reviewCheckpoint: review(
      37,
      'Review Loyiha #37: Baseline + Gradient Descent + ML Paradigm Router!',
      'Review Project #37: ML Mechanics & Problem-Framing Engine!',
      '17-kurs 1-bo‘limini mustahkamlang: muammoni to‘g‘ri ML turiga ajrating, bazaviy Baseline MAE o‘lchang va sof Python Gradient Descent bilan model o‘qiting.',
      'Combine paradigm routing, dummy baseline evaluation, and pure-Python MSE gradient descent training in one self-contained script.',
      ['Paradigm router + Dummy baseline', 'Pure-Python Gradient Descent trainer'],
      ['Paradigm router', 'Gradient descent loop'],
      `# Review #37: Baseline + Pure-Python GD + Task Router\nprint("Review #37 AI/ML Foundations Ready")`,
    ),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-04',
    courseId: 'ai_ml',
    moduleId: 'c17_m2',
    order: 4,
    titleUz: 'Dataset va Features — Feature Matrix `(N, D)`, Feature Engineering va Leakage Himoyasi',
    titleEn: 'Datasets & Feature Engineering: Matrix `(N, D)`, Feature Types & Anti-Leakage',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-17-03'],
    conceptId: 'ml_features',
    whyUz: "Tajribali ML muhandislar shunday deydi: **«Yaxshi Feature Engineering oddiy modelni ham yulduzga aylantiradi; yomon featurelar esa eng kuchli algoritmni ham chalg‘itadi!»** Scikit-learn ga kiruvchi ma’lumot har doim 2 o‘lchamli **`X` matritsa (`(N_samples, D_features)`)** va 1D **`y` target** ko‘rinishida bo‘lishi kerak — matn/sanalarni sonli signallarga aylantirish san’atini o‘rganamiz.",
    whyEn: 'Structure tabular ML datasets cleanly: separate 2D feature matrix `X` `(N, D)` from 1D target `y`, classify numeric/ordinal/nominal/cyclical features, engineer domain ratios/interactions, and strip leakage/ID columns.',
    analogyUz: "**Features (`X`)** — shifokor tahlil qog‘ozidagi ustunlar (`yosh`, `harorat`, `vazn`), **`y`** esa tashxis. Yangi **Domain Feature** yaratish (`BMI = vazn / bo‘y²`) modelga yashirin bog‘liqlikni tayyor holda berib, aniqlikni keskin oshiradi!",
    analogyEn: 'Features `X` are the structured vitals on a chart; engineering ratios like `BMI = weight / height^2` gives linear and tree models direct physical signal.',
    stopsUz: "Feature tayyorlashda 3 ta oltin qoida: 1) **`X` shape `(N, 1)` bo‘lishi kerak** — bitta feature bo‘lsa ham 1D ro‘yxat `[1, 2, 3]` emas, 2D `[[1], [2], [3]]`! 2) **ID va kelajak ustunlarini (`user_id`, `refund_date`) chiqaring**: model ID larni yodlab olib real hayotda ishlamaydi! 3) **Nominal vs Ordinal**: shaharlar (`Toshkent, Buxoro`) da tartib yo‘q -> **One-Hot**; darajalar (`Junior < Mid < Senior`) da tartib bor -> **Ordinal (`0, 1, 2`)**!",
    stopsEn: 'Keep `X` strictly 2D `(N, D)`, remove opaque IDs and future leakage columns, use ordinal integers only when order is real (`Junior < Mid < Senior`), and one-hot encode unordered nominal categories.',
    objUz: ['`X` (2D `(N, D)`) vs `y` (1D `(N,)`) shakl standarti', '4 feature turi: Continuous, Ordinal, Nominal (One-Hot), va Cyclical (`sin`/`cos`)', 'Domain Feature Engineering (`ratio`, `diff`, `log1p`) va Target Leakage auditi'],
    objEn: ['Enforce 2D `X` `(N, D)` and 1D `y` `(N,)` dataset shapes', 'Encode continuous, ordinal, nominal, and cyclical features appropriately', 'Create domain ratios and detect ID or temporal target leakage columns'],
    theoryUz: `### 1. \`X\` va \`y\` Shakli
Har bir qator = 1 ta namuna (\`sample\`), har bir ustun = 1 ta belgi (\`feature\`).
### 2. Feature Turlari
- **Continuous**: narx, masofa (masshtablanadi).
- **Ordinal**: \`S < M < L\` -> \`0, 1, 2\`.
- **Nominal**: \`red, blue, green\` -> One-Hot \`[1,0,0]\` (chunki \`blue > red\` degan tartib yo‘q!).
- **Domain Ratio**: \`price_per_sqm = price / area_m2\`.
### 3. Cyclical Time Features
Soat \`23:00\` va \`00:00\` aslida yonma-yon! \`sin(2π*h/24)\`, \`cos(2π*h/24)\` davriylikni saqlaydi!`,
    theoryEn: `### 1. Feature Matrix \`(N, D)\`
Rows are independent observations; columns are numerical feature signals.
### 2. Categorical & Cyclical Encoding
Map ordered categories (\`S < M < L\`) to \`0, 1, 2\`; one-hot encode unordered categories; encode wrap-around clocks via \`sin\`/\`cos\`.
### 3. Leakage Removal
Drop opaque IDs and post-outcome timestamps before calling \`.fit()\`.`,
    examples: [
      ex('Misol 1: Raw Dictionarydan `(X, y)` Matritsa va Domain Feature Yasash', 'Example 1: Feature Extraction + Domain Ratio Engineering', `rows = [
    {"uid": 101, "area": 50, "rooms": 2, "level": "mid", "price": 60000},
    {"uid": 102, "area": 100, "rooms": 4, "level": "high", "price": 140000},
]
rank = {"low": 0, "mid": 1, "high": 2}
X = [[r["area"], r["rooms"], round(r["area"] / r["rooms"], 1), rank[r["level"]]] for r in rows]
y = [r["price"] for r in rows]
print("X shape:", (len(X), len(X[0])), "| X:", X, "| y:", y)`, `X shape: (2, 4) | X: [[50, 2, 25.0, 1], [100, 4, 25.0, 2]] | y: [60000, 140000]`, '`uid` chiqarib tashlandi, `area/rooms` yangi domain feature qo‘shildi va `level` ordinal `1, 2` ga aylandi.', 'Drops opaque IDs, adds engineered `area/rooms`, encodes ordinal tier, and emits 2D `X` + 1D `y`.'),
      ex('Misol 2: Cyclical Encoding (`hour = 23` va `hour = 0` Yonma-Yonligi)', 'Example 2: Cyclical Sin/Cos Time Encoding', `import math

def encode_hour(h: int) -> tuple[float, float]:
    angle = 2 * math.pi * h / 24
    return (round(math.sin(angle), 3), round(math.cos(angle), 3))

print("h=0 :", encode_hour(0))
print("h=23:", encode_hour(23))`, `h=0 : (0.0, 1.0)\nh=23: (-0.259, 0.966)`, 'Oddiy son sifatida `23` va `0` juda uzoq ko‘rinadi; `sin/cos` ularni soat aylanasi bo‘ylab yonma-yon joylaydi!', 'Preserves circular continuity between 23:00 and 00:00 via `sin`/`cos` coordinates.'),
      ex('Misol 3: One-Hot Nominal Encoding (Tartibsiz Toifalar)', 'Example 3: One-Hot Encoding Nominal Categories', `vocab = ("card", "cash", "qr")
def one_hot(val: str) -> list[int]:
    return [int(val == c) for c in vocab]

print("cash ->", one_hot("cash"), "| qr ->", one_hot("qr"))`, `cash -> [0, 1, 0] | qr -> [0, 0, 1]`, 'One-hot vektor to‘lov turlari orasida soxta `qr > cash > card` tartibini kiritmaydi.', 'Encodes unordered categories cleanly without imposing artificial integer rank.'),
    ],
    traceTitleUz: 'Raw Dict -> Engineered (X, y) Matrix Trace',
    traceTitleEn: 'Tracing Feature Matrix Construction',
    traceCode: `row(uid, area, rooms, level, price) -> X[4], y`,
    traceSteps: [
      traceStep(1, 'Drop uid & y', 'exclude uid, target', 'ID va target X dan ajratildi', 'Isolated non-predictive ID & target'),
      traceStep(2, 'Engineer ratio', 'area / rooms = 25.0', 'Domain nisbat yaratildi', 'Computed room density ratio'),
      traceStep(3, 'Encode ordinal', 'mid -> 1', 'Tartibli toifa sonlandi', 'Mapped ordinal tier'),
    ],
    commonMistakes: [
      mistake('Shahar nomlarini (`Toshkent=0, Samarqand=1, Buxoro=2`) Ordinal qilib berish', 'Integer-Encoding Unordered Nominal Categories', `# Encoding Tashkent=0, Samarkand=1, Bukhara=2 tricks linear models into computing Bukhara = 2 * Samarkand!`, 'Biased artificial ordering', `print("Use One-Hot encoding for unordered categories; reserve 0,1,2 strictly for ordered ranks!")`, 'Tartib bo‘lmagan nomlarga One-Hot, tartibli darajalarga Ordinal bering.', 'Reserve ordinal integers strictly for ordered levels; one-hot encode nominal labels.', 'Tartibsiz nomlarga One-Hot bering.', 'One-hot encode nominal strings.'),
      mistake('Bitta featureli `X` ni 2D `[[x1], [x2]]` o‘rniga 1D `[x1, x2]` qilib uzatish', 'Passing a 1D Array for Single-Feature X Instead of (N, 1)', `# Scikit-learn model.fit([1, 2, 3], y) raises ValueError: Expected 2D array, got 1D array instead!`, 'ValueError: Expected 2D array', `xs = [1, 2, 3]\nX_2d = [[x] for x in xs]\nprint("Valid 2D X shape:", (len(X_2d), len(X_2d[0])))`, '`X` doim 2D `[[x] for x in xs]` shaklida bo‘lsin.', 'Always reshape single-feature `X` into 2D `(N, 1)`.', '`X` ni 2D qiling.', 'Reshape `X` to 2D `(N, 1)`.'),
    ],
    compareTitleUz: 'Ordinal Encoding vs One-Hot Encoding vs Cyclical',
    compareTitleEn: 'Feature Encoding Strategies',
    compareUz: ['Ordinal (`0, 1, 2`): faqat tabiiy tartibi bor darajalar (`S < M < L`).', 'One-Hot (`[1,0,0]`): tartibsiz nomlar (`city`, `payment_type`); juda ko‘p kategoriya bo‘lsa top-K + `"Other"` qiling.', 'Cyclical (`sin/cos`): soat, hafta kuni, oy kabi aylanuvchi vaqt belgilari.'],
    compareEn: ['Ordinal: preserves natural ordering (`Low < Med < High`).', 'One-Hot: safe for unordered categories.', 'Cyclical: captures wrap-around periodicity for time units.'],
    compareSummaryUz: 'ID va kelajak leakage ustunlarini olib tashlang, `X` ni 2D `(N, D)` shaklida tuzing va har bir feature turiga mos kodlashni tanlang.',
    compareSummaryEn: 'Drop IDs/leakage, shape `X` cleanly as `(N, D)`, engineer domain ratios, and match ordinal/one-hot/cyclical encoders to feature semantics.',
    practiceTasks: [
      pt('p1704_1', '1-mashq: 1D -> 2D `(N, 1)` Reshape', 'Task 1: Reshape X to 2D', '`[10, 20, 30]` ni `[[10], [20], [30]]` 2D matritsaga o‘giring.', 'Reshape 1D to 2D.', `print([[x] for x in (10, 20, 30)])`, '[[10], [20], [30]]', 'List of 1-element lists', 'Prints 2D matrix.'),
      pt('p1704_2', '2-mashq: Ordinal Daraja Kodlash', 'Task 2: Ordinal Tier Map', '`["low", "high", "mid"]` ni `{"low":0,"mid":1,"high":2}` ga o‘giring.', 'Ordinal encode.', `m = {"low": 0, "mid": 1, "high": 2}\nprint([m[k] for k in ("low", "high", "mid")])`, '[0, 2, 1]', 'Map via dict', 'Prints [0, 2, 1].'),
      pt('p1704_3', '3-mashq: Domain Ratio Feature', 'Task 3: Debt-to-Income Ratio', '`debt=300, income=1500` uchun nisbatni (`round(..., 2)`) toping.', 'Compute ratio feature.', `print(round(300 / 1500, 2))`, '0.2', 'debt / income', 'Prints 0.2.'),
      pt('p1704_4', '4-mashq: One-Hot Encoding', 'Task 4: One-Hot Vector', '`cats=("A", "B", "C")` da `"B"` uchun one-hot vektor chiqaring.', 'One-hot encode B.', `print([int("B" == c) for c in ("A", "B", "C")])`, '[0, 1, 0]', 'Equality to int', 'Prints [0, 1, 0].'),
      pt('p1704_5', '5-mashq: Cyclical 12-Oy Sinusi', 'Task 5: Cyclical Month Sin', '6-oy (`pi` burchak) uchun `round(math.sin(2*pi*6/12), 2)` ni toping.', 'Compute cyclical sin.', `import math\nprint(round(math.sin(2 * math.pi * 6 / 12), 2))`, '0.0', 'sin(pi) = 0', 'Prints 0.0.'),
    ],
    quiz: [
      q('q1704_1', 'Scikit-learn ga `model.fit(X, y)` chaqirganda `X` matritsasi qaysi shaklda bo‘lishi shart?', 'Required shape of feature matrix `X` passed into `model.fit(X, y)`?', ['1D vektor (N,)', '2D matritsa (N_samples, D_features)', '3D kub', 'Dict'], ['1D (N,)', '2D matrix (N_samples, D_features)', '3D tensor', 'Dict'], 1, 'Har doim 2D `(N, D)`.', '2D `(N_samples, D_features)`.'),
      q('q1704_2', 'Tartibi yo‘q shahar nomlari (`Toshkent, Samarqand, Buxoro`) ni `0, 1, 2` deb kodlashning xatosi?', 'Flaw of integer-encoding unordered cities as `0, 1, 2`?', ['Tez', 'Model Buxoro (2) > Samarqand (1) degan soxta matematik tartibni o‘rganadi', 'Xotira', 'None'], ['Fast', 'Imposes false numeric ordering (e.g., Bukhara > Samarkand)', 'RAM', 'None'], 1, 'Soxta tartib kiritadi (One-Hot kerak).', 'Imposes artificial ordinal rank.'),
      q('q1704_3', 'So‘at `23` bilan `0` ning yonma-yon ekanligini yo‘qotmay kodlash usuli?', 'Encoding preserving wrap-around closeness between hour `23` and hour `0`?', ['MinMax', 'Cyclical Sin/Cos encoding', 'Binary', 'Drop'], ['MinMax', 'Cyclical Sin/Cos encoding', 'Binary', 'Drop'], 1, 'Cyclical Sin/Cos encoding.', 'Cyclical Sin/Cos encoding.'),
      q('q1704_4', 'Nima uchun `customer_id` yoki `order_uuid` ustuni ML feature matritsasidan olib tashlanadi?', 'Why drop `customer_id` or UUID columns before training ML models?', ['Sekin', 'Unikal ID lar yangi mijozlarga umumlashmaydi — faqat training ni yodlashga olib keladi', 'JSON', 'Null'], ['Slow', 'Arbitrary IDs cannot generalize to new users and induce overfitting', 'JSON', 'Null'], 1, 'Generalization bermaydi.', 'Opaque IDs induce memorization.'),
      q('q1704_5', 'Ikkita xom ustundan (`price` va `area`) yangi `price_per_sqm` ustuni yasash jarayoni?', 'Creating `price_per_sqm = price / area` from raw columns?', ['Cleaning', 'Feature Engineering', 'Clustering', 'Deployment'], ['Cleaning', 'Feature Engineering', 'Clustering', 'Deployment'], 1, 'Feature Engineering.', 'Feature Engineering.'),
    ],
    homework: hw('Tabular Feature Matrix Builder', 'Clean (X, y) Feature Engineering Pipeline', 'Xom yozuvlar ro‘yxatidan `id`/leakage ustunlarini chiqarib tashlovchi, ordinal & one-hot & cyclical soat belgilarini kodlovchi va 2D `(N, D)` `X` hamda 1D `y` qaytaruvchi `build_feature_matrix()` funksiyasini yozing.', 'Implement `build_feature_matrix(records)` dropping IDs/leakage, engineering domain ratios, encoding ordinal/one-hot/cyclical features, and returning `(X_2d, y_1d)`.', ['Ordinal + One-Hot + Cyclical + Domain Ratio', 'Strict 2D X / 1D y validation'], ['Multi-type feature builder', '2D X verification'], 'Maintain deterministic column ordering across one-hot categories.', 'Clean ML feature builder.', 'Keyingi darsda Train/Test split va Data Leakage oldini olishni o‘rganamiz!', 'Prevent leakage next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-05',
    courseId: 'ai_ml',
    moduleId: 'c17_m2',
    order: 5,
    titleUz: 'Data Preprocessing — Train/Test Split, Scaling (`fit` vs `transform`) va Leakage Oldini Olish',
    titleEn: 'Preprocessing & Data Leakage: Split FIRST, `fit_transform` on Train, `transform` on Test',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-17-04'],
    conceptId: 'ml_preprocessing',
    whyUz: "Eng tajribali data scientistlar ham bir marta bo‘lsa-da **Data Leakage** tuzog‘iga tushgan! Agar butun jadvalning o‘rtachasi (`mean`) va `std` ini hisoblab scaling qilib, **keyin** `train_test_split` qilsangiz, Test ma’lumotlari haqidagi sirli statistikani modelga oldindan ko‘rsatib qo‘yasiz! Oltin qoida: **AVVAL bo‘ling (`split`), KEYIN faqat `Train` da `.fit()` qiling!**",
    whyEn: 'Eliminate data leakage completely: split Train/Val/Test FIRST (using stratified or time-based splits as required), then fit scalers and imputers exclusively on Train and apply `.transform()` only to Val/Test.',
    analogyUz: "**`fit` vs `transform`**: Imtihonga tayyorlanayotganda (`Train`) formulalarni o‘rganasiz (`fit_transform`); haqiqiy imtihonda (`Test`) esa o‘zingiz o‘rgangan formulani shunchaki qo‘llaysiz (`transform`), imtihon varaqasidan nusxa ko‘chirmaysiz!",
    analogyEn: 'Fit preprocessing statistics (`mean`, `std`, `median`) exclusively on the training study set, then apply those frozen parameters via `.transform()` to the unseen test exam.',
    stopsUz: "Preprocessing da 4 ta oltin qoida: 1) **AVVAL `train_test_split(random_state=42)`**, KEYIN barcha Imputation/Scaling/Encoding! 2) `Train` da **`scaler.fit_transform(X_train)`**, `Test` da esa **FAQAT `scaler.transform(X_test)`** (`fit` QILMANG!). 3) Klasslar nomutanosib bo‘lsa (`95% vs 5%`), **`stratify=y`** bering! 4) Vaqt ketma-ketligi (`stock`, `sales`) da **hech qachon tasodifiy aralashtirmang (`shuffle=False`)** — kelajak bilan o‘tmishni bashorat qilib bo‘lmaydi!",
    stopsEn: 'Always split Train/Test FIRST, call `.fit_transform()` only on Train and `.transform()` only on Test, pass `stratify=y` for imbalanced classes, and keep chronological splits unshuffled (`shuffle=False`) for time series.',
    objUz: ['Train / Validation / Test split vazifalari va `stratify=y` vs Time-Based Split', 'Nega `fit` Train da, `transform` Test da chaqiriladi (Data Leakage isboti)', 'Stdlib bilan `StandardScaler` (`mean`, `std`) va `SimpleImputer` (`median`) yozish'],
    objEn: ['Separate Train, Validation, and Test splits plus stratified vs temporal splitting', 'Prove how global preprocessing leaks test distribution stats', 'Implement `fit()` / `transform()` scalers and imputers cleanly in pure Python'],
    theoryUz: `### 1. Oltin Tartib
\`\`\`
Raw -> Train/Test Split -> [Train: scaler.fit_transform] -> Model.fit
                        -> [Test : scaler.transform]     -> Model.predict
\`\`\`
### 2. \`fit\` vs \`transform\`
- \`fit(X_train)\`: faqat \`mu_train\` va \`sd_train\` ni saqlaydi.
- \`transform(X_test)\`: o‘sha \`mu_train\` va \`sd_train\` bilan bo‘ladi — Test ning hech qanday siri kirmaydi!
### 3. Time-Series Split
Vaqt ma’lumotlarida \`Jan..Oct -> Train\`, \`Nov..Dec -> Test\` (tasodifiy aralashtirish taqiqlangan!).`,
    theoryEn: `### 1. The Leakage-Free Order
Split BEFORE imputing, scaling, oversampling, or selecting features.
### 2. \`fit_transform\` vs \`transform\`
Freeze training \`mean\` / \`std\` / \`median\` during \`.fit(X_train)\` and apply those frozen stats to \`X_test\` via \`.transform(X_test)\`.
### 3. Temporal & Stratified Splitting
Preserve class proportions with \`stratify=y\` on classification, and freeze chronological cutoffs (\`shuffle=False\`) on forecasting.`,
    examples: [
      ex('Misol 1: Leakage-Free `StandardScaler` (`fit` on Train, `transform` on Test)', 'Example 1: Implementing Leakage-Free StandardScaler', `import math, statistics

class StandardScaler:
    def fit(self, xs: list[float]):
        self.mu = statistics.mean(xs)
        self.sd = statistics.pstdev(xs) or 1.0
        return self
    def transform(self, xs: list[float]) -> list[float]:
        return [round((x - self.mu) / self.sd, 2) for x in xs]

train, test = [10.0, 20.0, 30.0], [40.0]
scaler = StandardScaler().fit(train)
print("Train scaled:", scaler.transform(train), "| Test scaled:", scaler.transform(test))`, `Train scaled: [-1.22, 0.0, 1.22] | Test scaled: [2.45]`, '`test = [40.0]` ham `train` ning o‘rtachasi (`20.0`) bilan masshtablandi — Test ning qiymati Train ga sizib kirmadi!', 'Freezes training mean and std during `.fit()` and applies them blindly to unseen test points.'),
      ex('Misol 2: Deterministik Seedli `train_test_split`', 'Example 2: Reproducible Seeded Train/Test Split', `import random

def split_xy(X, y, test_ratio=0.2, seed=42):
    idx = list(range(len(X)))
    random.Random(seed).shuffle(idx)
    cut = int(len(idx) * (1 - test_ratio))
    return [X[i] for i in idx[:cut]], [X[i] for i in idx[cut:]], [y[i] for i in idx[:cut]], [y[i] for i in idx[cut:]]

X_tr, X_te, y_tr, y_te = split_xy([1, 2, 3, 4, 5], [10, 20, 30, 40, 50])
print("Train:", X_tr, "| Test:", X_te)`, `Train: [4, 2, 3, 5] | Test: [1]`, '`random.Random(seed)` har safar bir xil Train/Test bo‘linishini kafolatlaydi.', 'Produces reproducible Train/Test splits via fixed `random_state` seed.'),
      ex('Misol 3: Time-Series Split (Shuffle Taqiqlangan!)', 'Example 3: Chronological Time-Series Split', `months = ["Jan", "Feb", "Mar", "Apr", "May"]
train_t, test_t = months[:3], months[3:]
print("Past Train:", train_t, "| Future Test:", test_t)`, `Past Train: ['Jan', 'Feb', 'Mar'] | Future Test: ['Apr', 'May']`, 'Vaqt seriyasida kelajak oylari faqat Test da turishi shart — o‘tmishdan kelajak bashorat qilinadi!', 'Splits sequentially without shuffling so future observations never leak backward into training.'),
    ],
    traceTitleUz: 'Zero-Leakage Fit vs Transform Trace',
    traceTitleEn: 'Tracing Train/Test Split Preprocessing',
    traceCode: `split(seed=42) -> fit(X_train) -> transform(X_test)`,
    traceSteps: [
      traceStep(1, 'Split FIRST', 'Train=[10,20,30], Test=[40]', 'Test izolyatsiya qilindi', 'Isolated test data first'),
      traceStep(2, 'scaler.fit(Train)', 'mu=20.0, sd=8.16', 'Parametrlar faqat Train dan', 'Learned stats from train only'),
      traceStep(3, 'scaler.transform(Test)', '[2.45]', 'Test xolis baholandi', 'Transformed test cleanly'),
    ],
    commonMistakes: [
      mistake('`train_test_split` dan OLDIN `scaler.fit_transform(X_all)` qilib yuborish', 'Fitting Scalers or Imputers Before Splitting Train/Test', `# Fitting scaler on the whole dataset leaks Test mean/min/max into Train—inflating CV scores falsely!`, 'Data Leakage & optimistic offline metrics', `print("Always run train_test_split FIRST, then call fit_transform(X_train) and transform(X_test)!")`, 'Har doim split -> `fit_transform(X_train)` -> `transform(X_test)` tartibini saqlang.', 'Split BEFORE scaling/imputing so test statistics never touch training weights.', 'Avval split, keyin fit!', 'Split before calling `.fit()`.'),
      mistake('`X_test` ustida yana `.fit_transform(X_test)` chaqirib yuborish', 'Calling fit_transform Instead of transform on Test Data', `# Calling scaler.fit_transform(X_test) re-centers test data around a different zero—breaking predictions!`, 'Shifted broken test predictions', `print("Call .transform(X_test) ONLY—never .fit_transform(X_test)!")`, 'Test to‘plamida FAQAT `.transform()` chaqiring.', 'Use `.transform(X_test)` strictly so test features sit on the exact training scale.', 'Test da faqat `.transform()`.', 'Only `.transform()` on test.'),
    ],
    compareTitleUz: 'Random Split vs Stratified Split vs Time Split',
    compareTitleEn: 'Train/Test Splitting Strategies',
    compareUz: ['Random Split: muvozanatli mustaqil jadval ma’lumotlari uchun.', 'Stratified Split (`stratify=y`): kam uchraydigan klasslar (masalan 3% firibgarlik) Test da yo‘qolib ketmasligi uchun.', 'Time Split (`shuffle=False`): vaqtga bog‘liq savdo/ob-havo/birja bashoratlari uchun.'],
    compareEn: ['Random Split: balanced independent rows.', 'Stratified Split: preserves rare-class ratios across train and test.', 'Time Split: prevents future leakage in chronological forecasting.'],
    compareSummaryUz: 'Split ni birinchi qiling, `Train` da `.fit_transform()`, `Test` da faqat `.transform()` chaqiring va nomutanosib/vaqt ma’lumotlarida `stratify`/chronological split ishlating.',
    compareSummaryEn: 'Split first, `.fit()` strictly on Train and `.transform()` on Test, and pick stratified or chronological splits appropriately.',
    practiceTasks: [
      pt('p1705_1', '1-mashq: `fit` Parametrini Saqlash', 'Task 1: Fit Mean & Transform', 'Train `[10, 30]` dan `mu=20` olib, Test `[50]` dan `x - mu` ni hisoblang.', 'Center using train mean.', `tr, te = [10, 30], [50]\nmu = sum(tr) / len(tr)\nprint([x - mu for x in te])`, '[30.0]', 'Subtract train mean only', 'Prints [30.0].'),
      pt('p1705_2', '2-mashq: Leakage-Free Median Imputer', 'Task 2: Impute Using Train Median', 'Train `[10, 20, 30]` medianasi bilan Test `[None, 40]` ni to‘ldiring.', 'Impute test with train median.', `import statistics\nmed = int(statistics.median([10, 20, 30]))\nprint([med if x is None else x for x in (None, 40)])`, '[20, 40]', 'Compute median on train only', 'Prints [20, 40].'),
      pt('p1705_3', '3-mashq: 80/20 Bo‘linish Indeksi', 'Task 3: Train/Test Split Index', '100 qatorning 80% Train nechta qator bo‘ladi?', 'Compute split cutoff.', `print(int(100 * 0.8))`, '80', 'int(N * 0.8)', 'Prints 80.'),
      pt('p1705_4', '4-mashq: `sd == 0` Himoyasi', 'Task 4: Zero Variance Guard', 'Konstanta ustunda `sd = 0.0` bo‘lsa `sd or 1.0` nima beradi?', 'Guard zero std.', `sd = 0.0\nprint((10 - 10) / (sd or 1.0))`, '0.0', 'sd or 1.0 prevents ZeroDivisionError', 'Prints 0.0.'),
      pt('p1705_5', '5-mashq: O‘tmish -> Kelajak Kesish', 'Task 5: Temporal Cutoff', '`[2022, 2023, 2024, 2025]` dan `<= 2024` ni Train qiling.', 'Split years chronologically.', `yrs = [2022, 2023, 2024, 2025]\nprint([y for y in yrs if y <= 2024], [y for y in yrs if y > 2024])`, '[2022, 2023, 2024] [2025]', 'Filter by year boundary', 'Prints [2022, 2023, 2024] [2025].'),
    ],
    quiz: [
      q('q1705_1', 'Data Leakage oldini olish uchun `train_test_split` qachon bajarilishi SHART?', 'When MUST `train_test_split` run relative to scaling and imputation?', ['Oxirida', 'Eng AVVAL — har qanday imputer/scaler/feature-selection dan oldin', 'Deployment da', 'Farqi yo‘q'], ['At the end', 'FIRST—before any imputation, scaling, or feature selection', 'At deploy', 'Anytime'], 1, 'Eng birinchi qadam.', 'Always split FIRST.'),
      q('q1705_2', '`StandardScaler` ning `X_test` ga qo‘llanadigan TO‘G‘RI metodi?', 'Correct scaler method to call on unseen `X_test` data?', ['fit_transform(X_test)', 'transform(X_test)', 'fit(X_test)', 'reset()'], ['fit_transform(X_test)', 'transform(X_test)', 'fit(X_test)', 'reset()'], 1, 'Faqat `.transform(X_test)`.', '`.transform(X_test)` only.'),
      q('q1705_3', 'Firibgarlik (`fraud`) atigi 2% bo‘lgan datasetda Train va Test da ham 2% qolishini ta’minlovchi parametr?', '`train_test_split` argument preserving imbalanced class percentages across both splits?', ['shuffle=False', 'stratify=y', 'balance=True', 'seed=0'], ['shuffle=False', 'stratify=y', 'balance=True', 'seed=0'], 1, '`stratify=y`.', '`stratify=y`.'),
      q('q1705_4', 'Kelasi haftadagi elektr sarfini bashorat qiluvchi vaqt seriyasida `shuffle=True` qilishning zarari?', 'Why is `shuffle=True` dangerous when splitting time-series data?', ['Sekin', 'Kelajakdagi ma’lumotlar training ichiga tushib Temporal Leakage yaratadi', 'RAM', 'TypeError'], ['Slow', 'Allows future observations to leak into training past periods', 'RAM', 'TypeError'], 1, 'Temporal Data Leakage.', 'Temporal Data Leakage.'),
      q('q1705_5', 'Model final imtihonidan (Test) keyin yana giperparametrlarni Test ga qarab qayta sozlasangiz nima bo‘ladi?', 'What breaks if you repeatedly tune hyperparameters directly against the final Test set?', ['Tezroq', 'Test to‘plamiga Overfit bo‘lib haqiqiy xolis baho yo‘qoladi (Validation set kerak!)', 'Yaxshilanadi', 'Hech narsa'], ['Faster', 'You overfit to the test set; always tune on a separate Validation/CV split', 'Improves', 'Nothing'], 1, 'Test ni oxirgi marta bir marta baholash uchun saqlang; sozlash Validation/CV da bo‘ladi.', 'Tune on Validation/CV so Test stays strictly held-out.'),
    ],
    homework: hw('Zero-Leakage Preprocessing Engine', 'Leakage-Proof Pipeline Preprocessor', 'Train/Test split (`seed` li), `Train` da `.fit()` qilib `Test` da `.transform()` qiluvchi `MedianImputer` hamda `StandardScaler` klasslarini birlashtirgan preprocessor yozing.', 'Implement a leakage-proof preprocessor splitting `(X, y)` first, fitting `MedianImputer` + `StandardScaler` exclusively on Train, and transforming Test with frozen training statistics.', ['Seeded Split + MedianImputer + StandardScaler', 'Leakage test verification'], ['Leakage-free preprocessor', 'Unit assertion test'], 'Store learned medians, means, and stds on `self` inside `.fit()` and raise if `.transform()` runs before `.fit()`.', 'Rock-solid preprocessing.', 'Keyingi darsda Scikit-learn Pipeline va Cross-Validation ni o‘rganamiz!', 'Learn sklearn Pipelines next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-06',
    courseId: 'ai_ml',
    moduleId: 'c17_m2',
    order: 6,
    titleUz: 'Scikit-learn — Yagona `fit/predict` API, `Pipeline`, `ColumnTransformer` va Cross-Validation',
    titleEn: 'Scikit-learn Architecture: Estimator API, Pipelines, ColumnTransformer & K-Fold CV',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-17-05'],
    conceptId: 'ml_sklearn',
    whyUz: "Scikit-learn nima uchun dunyodagi eng mashhur jadvalli ML kutubxonasi? Chunki barcha 100+ algoritm — chiziqli regressiyadan Random Forest gacha — bitta yagona **`fit(X, y)` -> `predict(X)` -> `score(X, y)`** interfeysida ishlaydi! Bundan tashqari, **`Pipeline`** va **`K-Fold Cross-Validation`** barcha preprocessing + modelni bitta xavfsiz qutiga joylab Data Leakage ni nolga tushiradi!",
    whyEn: 'Master Scikit-learn’s uniform Estimator API (`fit`/`predict`/`transform`), compose leak-free `Pipeline` + `ColumnTransformer` workflows, and evaluate stability reliably via `K-Fold` cross-validation.',
    analogyUz: "**Scikit-learn `Pipeline`** — avtomobil zavodi konveyeri: xom temir (`X`) kiradi -> tozalash (`Imputer`) -> bo‘yash (`Scaler`) -> dvigatel (`Model`) bir tekisda o‘tadi. Konveyerning yaxshi tomoni: K-Fold Cross-Validation ning har bir bukilishida `fit` faqat o‘sha fold ning Train qismida avtomatik ishlaydi!",
    analogyEn: 'A Scikit-learn `Pipeline` chains preprocessing steps and the final estimator into one object so cross-validation fits every transformer strictly inside each training fold.',
    stopsUz: "Scikit-learn da 3 ta senior odat: 1) **`Pipeline([...])` ishlating** — har doim imputer, scaler va modelni bitta `Pipeline` ga soling! 2) Raqamli va kategorik ustunlar aralash bo‘lsa **`ColumnTransformer`** ishlating! 3) Bitta tasodifiy 80/20 bo‘linish ba’zan omadli/omadsiz chiqishi mumkin — **`K-Fold Cross-Validation` (`cv=5`)** orqali 5 ta turli fold natijasining o‘rtachasi + `std` ini ko‘ring!",
    stopsEn: 'Wrap imputers, encoders, scalers, and estimators inside `Pipeline` + `ColumnTransformer` so cross-validation fits each step inside training folds cleanly with zero leakage.',
    objUz: ['Scikit-learn Unified Estimator API (`Transformer` vs `Predictor`)', '`Pipeline` & `ColumnTransformer` bilan xavfsiz avtomatizatsiya', '`K-Fold Cross-Validation` (`cv=5`, mean +/- std) simulyatsiyasi va `joblib` saqlash'],
    objEn: ['Navigate Scikit-learn’s uniform `fit`/`transform`/`predict`/`score` API', 'Chain mixed column preprocessing and modeling inside `Pipeline` & `ColumnTransformer`', 'Run 5-Fold Cross-Validation (`mean +/- std`) without fold leakage'],
    theoryUz: `### 1. Yagona Estimator Interfeysi
- **Transformer**: \`.fit(X)\` -> \`.transform(X)\` (\`StandardScaler\`, \`OneHotEncoder\`).
- **Predictor**: \`.fit(X, y)\` -> \`.predict(X)\` (\`LinearRegression\`, \`RandomForestClassifier\`).
### 2. \`Pipeline\` & \`ColumnTransformer\`
\`\`\`python
pipe = Pipeline([("scaler", StandardScaler()), ("clf", LogisticRegression())])
\`\`\`
\`cross_val_score(pipe, X, y, cv=5)\` har foldda faqat 4 ta Train foldda \`fit\` qiladi!
### 3. Production Modelni Saqlash
\`joblib.dump(pipe, "model.joblib")\` — ham scaler, ham model bitta faylda saqlanadi!`,
    theoryEn: `### 1. Unified Estimator Contract
Every transformer exposes \`fit\`/\`transform\`; every predictor exposes \`fit\`/\`predict\`/\`score\`.
### 2. \`Pipeline\` + \`ColumnTransformer\`
Apply \`StandardScaler\` to numeric columns and \`OneHotEncoder(handle_unknown="ignore")\` to categorical columns seamlessly inside one serializable object.
### 3. K-Fold Cross-Validation
Evaluate \`K\` rotating validation splits to measure both average score and variance across folds.`,
    examples: [
      ex('Misol 1: Pure-Python `Pipeline([Scaler, MeanRegressor])` Arxitekturasi', 'Example 1: Scikit-learn Style Pipeline Composition', `class MiniScaler:
    def fit_transform(self, xs):
        self.mu = sum(xs) / len(xs)
        return [x - self.mu for x in xs]
    def transform(self, xs):
        return [x - self.mu for x in xs]

class MiniPipeline:
    def __init__(self, steps):
        self.steps = steps
    def fit(self, X, y):
        cur = X
        for _, step in self.steps[:-1]:
            cur = step.fit_transform(cur)
        self.steps[-1][1].fit(cur, y)
        return self
    def predict(self, X):
        cur = X
        for _, step in self.steps[:-1]:
            cur = step.transform(cur)
        return self.steps[-1][1].predict(cur)

class MeanReg:
    def fit(self, X, y): self.m = sum(y) / len(y)
    def predict(self, X): return [self.m for _ in X]

pipe = MiniPipeline([("scaler", MiniScaler()), ("reg", MeanReg())]).fit([1, 2, 3], [10, 20, 30])
print("Pipeline predictions:", pipe.predict([5, 6]))`, `Pipeline predictions: [20.0, 20.0]`, '`MiniPipeline` ketma-ket transformerlarni train qilib, keyin yakuniy modelga uzatdi.', 'Composes sequential transformers and final predictor behind a single `.fit()` / `.predict()` API.'),
      ex('Misol 2: 3-Fold Cross-Validation Sikli (Leakage-Free Baholash)', 'Example 2: 3-Fold Cross-Validation Loop', `data = [10, 20, 30, 40, 50, 60]  # 6 samples -> 3 folds of 2
scores = []
for k in range(3):
    s, e = k * 2, k * 2 + 2
    val = data[s:e]
    tr = data[:s] + data[e:]
    pred = sum(tr) / len(tr)
    mae = sum(abs(v - pred) for v in val) / len(val)
    scores.append(round(mae, 1))

print("Fold MAEs:", scores, "| Avg MAE:", round(sum(scores) / len(scores), 1))`, `Fold MAEs: [30.0, 5.0, 30.0] | Avg MAE: 21.7`, 'Har bir fold navbatma-navbat Validation bo‘ldi va 3 ta bahoning o‘rtachasi chiqarildi.', 'Demonstrates rotating K-Fold cross-validation computing per-fold and average MAE.'),
      ex('Misol 3: `handle_unknown="ignore"` Himoyasi (Yangi Kategoriya Kelganda)', 'Example 3: Safe Handling of Unseen Test Categories', `known = {"Toshkent": [1, 0], "Buxoro": [0, 1]}
def encode_safe(city: str) -> list[int]:
    return known.get(city, [0, 0])  # handle_unknown="ignore"

print("Buxoro:", encode_safe("Buxoro"), "| NewCity:", encode_safe("Xiva"))`, `Buxoro: [0, 1] | NewCity: [0, 0]`, '`handle_unknown="ignore"` production da yangi shahar kelganda API ni yiqitmay `[0, 0]` beradi.', 'Prevents inference crashes when unseen categories arrive in production.'),
    ],
    traceTitleUz: 'Pipeline.fit() & K-Fold CV Trace',
    traceTitleEn: 'Tracing Pipeline Inside Cross-Validation',
    traceCode: `for fold in range(K): pipe.fit(train_fold) -> score(val_fold)`,
    traceSteps: [
      traceStep(1, 'Split Fold k', '4 folds train, 1 fold val', 'Ma’lumot K ga bo‘lindi', 'Partitioned fold K'),
      traceStep(2, 'Pipeline.fit', 'fit scaler -> fit model', 'Faqat train foldda o‘qitildi', 'Fit strictly inside train fold'),
      traceStep(3, 'Pipeline.score', 'predict(val) -> mean +/- std', 'Barcha K natija jamlandi', 'Aggregated K validation scores'),
    ],
    commonMistakes: [
      mistake('OneHotEncoder da `handle_unknown="ignore"` qo‘ymay production da `ValueError` olish', 'Omitting handle_unknown="ignore" on Categorical Encoders', `# If a new city like "Navoiy" appears in production, default OneHotEncoder crashes with ValueError!`, 'Production API 500 crashes', `print("Set OneHotEncoder(handle_unknown='ignore') inside ColumnTransformer!")`, '`OneHotEncoder(handle_unknown="ignore")` parametrini doim yoqing.', 'Configure `handle_unknown="ignore"` so novel production categories encode safely to zero vectors.', '`handle_unknown="ignore"` bering.', 'Set `handle_unknown="ignore"`.'),
      mistake('Modelni saqlaganda faqat modelni saqlab `scaler` ni unutib qo‘yish', 'Saving the Trained Estimator Without Its Preprocessing Scaler', `# Saving only RandomForest without the Pipeline/Scaler passes raw unscaled inputs at inference time!`, 'Garbage predictions in production', `print("Save the ENTIRE Pipeline via joblib.dump(pipe, 'model.joblib')—never the bare estimator!")`, 'Doim butun `Pipeline` obyektini bitta `.joblib` faylga saqlang.', 'Serialize the entire `Pipeline` together rather than just the final estimator.', 'Butun `Pipeline` ni saqlang.', 'Save the full `Pipeline`.'),
    ],
    compareTitleUz: 'Single 80/20 Split vs K-Fold Cross-Validation',
    compareTitleEn: 'Single Split vs K-Fold CV',
    compareUz: ['Single Split: juda tez — million qatorli katta datasetlar uchun qulay.', 'K-Fold (`cv=5`): har bir qator ham o‘qishda, ham testda qatnashadi — kichik/o‘rta datasetda ancha ishonchli `mean +/- std` beradi.'],
    compareEn: ['Single Split: fast for massive datasets.', 'K-Fold CV: evaluates all data across `K` rotations for lower-variance model selection.'],
    compareSummaryUz: 'Barcha preprocessing + modelni `Pipeline` + `ColumnTransformer` ga o‘rang, `cv=5` bilan tekshiring va butun `Pipeline` ni saqlang.',
    compareSummaryEn: 'Package preprocessing and modeling into a `Pipeline` + `ColumnTransformer`, validate via `K-Fold` CV, and serialize the full pipeline.',
    practiceTasks: [
      pt('p1706_1', '1-mashq: Transformer vs Predictor API', 'Task 1: Check Method Role', '`["fit_transform", "predict"]` qaysi biri Transformer ga xos?', 'Pick Transformer method.', `print("fit_transform -> Transformer | predict -> Predictor")`, 'fit_transform -> Transformer | predict -> Predictor', 'Identify API roles', 'Prints role mapping.'),
      pt('p1706_2', '2-mashq: K-Fold Mean +/- Std', 'Task 2: Cross-Val Mean Score', '5 fold ballari `[0.80, 0.82, 0.84, 0.81, 0.83]` ning o‘rtachasini chiqaring.', 'Compute CV mean.', `s = [0.80, 0.82, 0.84, 0.81, 0.83]\nprint(round(sum(s) / len(s), 2))`, '0.82', 'mean(scores)', 'Prints 0.82.'),
      pt('p1706_3', '3-mashq: Unknown Category Safe Lookup', 'Task 3: Handle Unseen Category', '`{"a": 1}` lug‘atdan `"z"` ni `handle_unknown` tarzida `-1` bilan oling.', 'Safe unseen fallback.', `print({"a": 1}.get("z", -1))`, '-1', 'dict.get default', 'Prints -1.'),
      pt('p1706_4', '4-mashq: Fold Hajmi Hisoblash', 'Task 4: Compute Fold Size', '100 qator `cv=5` da har bir validation fold nechta qator oladi?', 'Compute fold size.', `print(100 // 5)`, '20', 'N // K', 'Prints 20.'),
      pt('p1706_5', '5-mashq: Pipeline Qadamlar Sonini Tekshirish', 'Task 5: Pipeline Step Names', '`steps = [("imp", 1), ("scl", 2), ("clf", 3)]` qadam nomlarini chiqaring.', 'List step names.', `steps = [("imp", 1), ("scl", 2), ("clf", 3)]\nprint([name for name, _ in steps])`, "['imp', 'scl', 'clf']", 'Extract tuple first elements', "Prints ['imp', 'scl', 'clf']."),
    ],
    quiz: [
      q('q1706_1', 'Scikit-learn `Pipeline` ning Data Leakage ga qarshi eng katta foydasi?', 'Biggest anti-leakage advantage of wrapping transformers and estimator inside a `Pipeline`?', ['Tez', 'Cross-Validation ning har foldida `fit` faqat o‘sha fold Train qismida avtomatik bajariladi', 'GPU', 'HTML'], ['Fast', 'Fits transformers strictly inside each CV training fold automatically', 'GPU', 'HTML'], 1, 'Har foldda leak-free fit/transform.', 'Automatic fold-isolated fitting.'),
      q('q1706_2', 'Jadvalning raqamli ustunlariga `StandardScaler`, matn ustunlariga `OneHotEncoder` qo‘llaydigan Scikit-learn klassi?', 'Scikit-learn utility routing numeric and categorical columns to separate transformers?', ['GridSearch', 'ColumnTransformer', 'Splitter', 'Dumper'], ['GridSearch', 'ColumnTransformer', 'Splitter', 'Dumper'], 1, '`ColumnTransformer`.', '`ColumnTransformer`.'),
      q('q1706_3', 'Production ga modelni deploy qilganda nima saqlanishi (`joblib.dump`) kerak?', 'What should be serialized with `joblib.dump` for production inference?', ['Faqat model', 'Butun `Pipeline` (Imputer + Encoder + Scaler + Model birga)', 'Faqat CSV', 'Faqat y_test'], ['Model only', 'The full `Pipeline` including preprocessing transformers + estimator', 'CSV only', 'y_test'], 1, 'Butun `Pipeline` birga saqlanadi.', 'Full Pipeline together.'),
      q('q1706_4', 'K-Fold Cross-Validation (`cv=5`) da model nechta marta o‘qitiladi?', 'How many training runs occur during 5-Fold Cross-Validation?', ['1', '5 marta (har biri 4/5 qismda o‘qib 1/5 qismda baholanadi)', '10', '25'], ['1', '5 times (each on 4/5 train, scored on held-out 1/5)', '10', '25'], 1, '5 marta.', '5 times.'),
      q('q1706_5', 'Test yoki Production da yangi noma’lum kategoriya kelib qolmasdan xato bermaslik uchun `OneHotEncoder` parametri?', '`OneHotEncoder` parameter preventing crashes when unseen categories appear in inference?', ['unknown="fail"', 'handle_unknown="ignore"', 'skip=True', 'null=0'], ['unknown="fail"', 'handle_unknown="ignore"', 'skip=True', 'null=0'], 1, '`handle_unknown="ignore"`.', '`handle_unknown="ignore"`.'),
    ],
    homework: hw('Mini Scikit-learn Pipeline & 5-Fold CV Engine', 'Pure-Python Estimator Pipeline & K-Fold Evaluator', 'Scikit-learn API siga o‘xshash `Transformer`, `Pipeline` va `cross_val_score(pipe, X, y, cv=5)` funksiyalarini sof Python da yozib, 5-fold o‘rtacha xatoni hisoblang.', 'Implement Scikit-learn-compatible `StandardScaler`, `MeanRegressor`, `Pipeline`, and `cross_val_score(..., cv=5)` in pure Python with zero fold leakage.', ['Pipeline([("scaler", ...), ("model", ...)])', '5-Fold CV loop'], ['Sklearn-style Pipeline', '5-fold CV evaluator'], 'Clone or re-instantiate the pipeline inside every fold iteration so fold states never bleed across.', 'Deep mastery of sklearn design.', 'Keyingi darsda Regression modellarini chuqur o‘rganamiz!', 'Explore Regression next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-17-07',
    courseId: 'ai_ml',
    moduleId: 'c17_m3',
    order: 7,
    titleUz: 'Regression — Chiziqli Model, MSE / RMSE / MAE / R² Metrikalari va Regularization',
    titleEn: 'Regression Models: Linear Fit, MSE/RMSE/MAE/R² Metrics, Residuals & Regularization',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-17-06'],
    conceptId: 'ml_regression',
    whyUz: "Uy narxi, yetkazib berish vaqti yoki oylik daromad — bularning barchasi **Regression** masalasidir! Kuchli ML muhandis nafaqat chiziq o‘tkazishni, balki **MAE vs RMSE** farqini (outlierlarga sezgirlik!), **R² (Coefficient of Determination)** nimani bildirishini va ko‘p ustunli overfittingni **Ridge (`L2`) / Lasso (`L1`)** bilan jilovlashni ham biladi.",
    whyEn: 'Master regression modeling and diagnostics: Ordinary Least Squares / Gradient Descent, comparing MAE vs MSE/RMSE vs R², checking residuals for nonlinearity/heteroscedasticity, and preventing overfitting with Ridge (L2) and Lasso (L1).',
    analogyUz: "**MAE** — oddiy o‘rtacha xato (`|$100|`); **RMSE** — katta xatolarni kvadratga oshirib qattiq jazolovchi hakam (`($1000)²`!). Agar bitta katta xato siz uchun halokatli bo‘lsa — **RMSE** ishlating; outlierlarga chidamli o‘rtacha xato kerak bo‘lsa — **MAE**!",
    analogyEn: 'MAE weights all errors linearly; RMSE squares errors before averaging, penalizing occasional massive misses heavily.',
    stopsUz: "Regression da 3 ta muhim nuqta: 1) **R² manfiy ham bo‘lishi mumkin!** Agar model `mean(y)` chizig‘idan ham yomonroq ishlasa `R² < 0` chiqadi (`R² = 1.0` — ideal)! 2) **Residual (`y - ŷ`) grafigini tekshiring**: agar qoldiqlar U-shaklida bo‘lsa — ma’lumot nochiziqli (`x²` polynomial yoki Tree kerak)! 3) **Ridge (`L2`) vs Lasso (`L1`)**: `L1` keraksiz ustun og‘irliklarini aniq `0` qilib feature selection bajaradi; `L2` esa hamma og‘irlikni kichik va barqaror ushlaydi.",
    stopsEn: 'Interpret `R²` (`1.0` ideal, `0.0` mean baseline, `< 0` worse than baseline), inspect residual patterns for missed nonlinearity, and choose Ridge (L2 stability) vs Lasso (L1 sparsity).',
    objUz: ['Least Squares yopiq formula (`cov/var`) & Gradient Descent bilan Linear Regression', '4 Regression metrikasi: **MAE**, **MSE**, **RMSE**, va **R² Score**', 'Residual tahlil va Regularization: **Ridge (`L2`)** vs **Lasso (`L1`)**'],
    objEn: ['Compute OLS slope/intercept and evaluate MAE, MSE, RMSE, and R²', 'Diagnose nonlinearity from prediction residuals (`y - y_hat`)', 'Contrast Ridge (L2) weight shrinkage with Lasso (L1) feature selection'],
    theoryUz: `### 1. Chiziqli Regressiya (OLS 1D)
\`w = Σ((x - x̄)(y - ȳ)) / Σ((x - x̄)²)\`, \`b = ȳ - w·x̄\`.
### 2. Metrikalar
- **MAE**: \`mean(|y - ŷ|)\` — tushunarli birlik, outlierga chidamli.
- **RMSE**: \`sqrt(mean((y - ŷ)²))\` — katta xatoni kuchli jazolaydi.
- **R²**: \`1 - (SS_res / SS_tot)\` — tushuntirilgan dispersiya ulushi (\`1.0\` mukammal).
### 3. Regularization (Overfittingga qarshi)
- **Ridge (L2)**: \`Loss + λ·Σw²\` -> og‘irliklarni kichraytiradi.
- **Lasso (L1)**: \`Loss + λ·Σ|w|\` -> foydasiz ustunlarni \`0\` ga tushiradi!`,
    theoryEn: `### 1. Closed-Form 1D OLS
\`slope = sum((x - mx)*(y - my)) / sum((x - mx)**2)\`, \`intercept = my - slope * mx\`.
### 2. Error Metrics
MAE measures average magnitude; RMSE penalizes large errors; \`R² = 1 - SS_res / SS_tot\` captures explained variance.
### 3. Regularization
Ridge (\`L2\`) shrinks correlated coefficients smoothly; Lasso (\`L1\`) drives irrelevant feature weights strictly to \`0\`.`,
    examples: [
      ex('Misol 1: Yopiq Formula (OLS) Bilan Linear Regression va Bashorat', 'Example 1: Exact 1D Ordinary Least Squares Fit', `xs, ys = [1, 2, 3, 4], [2, 4, 6, 8]
mx, my = sum(xs) / len(xs), sum(ys) / len(ys)
w = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
b = my - w * mx
print(f"w={w}, b={b} | predict(x=5)={w * 5 + b}")`, `w=2.0, b=0.0 | predict(x=5)=10.0`, 'OLS formulasi bitta qadamda aniq chiziqli koeffitsientlarni topib `x=5 -> 10.0` bashorat qildi.', 'Computes closed-form OLS weights directly without iteration loops.'),
      ex('Misol 2: MAE vs RMSE vs R² Score Hisoblash', 'Example 2: Evaluating MAE, RMSE, and R² Score', `import math

y_true = [10, 20, 30]
y_pred = [12, 18, 36]  # last error is 6 -> penalizes RMSE!
mae = sum(abs(t - p) for t, p in zip(y_true, y_pred)) / len(y_true)
rmse = math.sqrt(sum((t - p) ** 2 for t, p in zip(y_true, y_pred)) / len(y_true))
my = sum(y_true) / len(y_true)
r2 = 1 - sum((t - p) ** 2 for t, p in zip(y_true, y_pred)) / sum((t - my) ** 2 for t in y_true)
print(f"MAE={mae:.2f} | RMSE={rmse:.2f} | R2={r2:.2f}")`, `MAE=3.33 | RMSE=3.83 | R2=0.78`, 'Oxirgi katta xato (`6`) tufayli `RMSE (3.83)` `MAE (3.33)` dan kattaroq chiqdi; `R² = 0.78` yaxshi moslik.', 'Shows RMSE amplifying larger residuals relative to MAE while R² scores explained variance.'),
      ex('Misol 3: L2 (Ridge) Penalty Ta’siri Katta Og‘irlikka', 'Example 3: Ridge (L2) vs Lasso (L1) Penalty Calculation', `weights = [0.5, 4.0, -0.1]
lam = 0.1
l2_pen = round(lam * sum(w ** 2 for w in weights), 3)
l1_pen = round(lam * sum(abs(w) for w in weights), 3)
print("L2 penalty:", l2_pen, "| L1 penalty:", l1_pen)`, `L2 penalty: 1.626 | L1 penalty: 0.46`, 'L2 (`w²`) katta `4.0` og‘irlikni juda kuchli jazolaydi; L1 esa kichik `0.1` ni nolga tortadi.', 'Quantifies L2 squared shrinkage vs L1 linear sparsity penalty.'),
    ],
    traceTitleUz: 'OLS Fit -> Predict -> R² Evaluation Trace',
    traceTitleEn: 'Tracing Regression Fit & Metrics',
    traceCode: `OLS(xs, ys) -> (w=2, b=0) -> R2 = 1 - SS_res/SS_tot`,
    traceSteps: [
      traceStep(1, 'Compute covariance & var', 'w=2.0, b=0.0', 'Chiziq koeffitsientlari topildi', 'Solved slope & intercept'),
      traceStep(2, 'Compute residuals', 't - p', 'Xatolar vektori olindi', 'Evaluated prediction errors'),
      traceStep(3, 'Evaluate R2', '0.78 (good fit)', 'Dispersiyaning 78% izohlandi', 'Explained 78% variance'),
    ],
    commonMistakes: [
      mistake('Bitta outlier bor uy narxlari datasetida MAE va RMSE farqini tekshirmaslik', 'Ignoring Outlier Amplification When Reporting RMSE Alone', `# A single $5M mansion misprediction raises RMSE 10x even if 99% of normal homes are predicted within $5k!`, 'Skewed model selection', `print("Track BOTH MAE and RMSE: if RMSE >> MAE, investigate a few huge outlier errors!")`, 'Har doim ham `MAE`, ham `RMSE` ni birga ko‘ring — ularning farqi outlierlarni fosh qiladi.', 'Inspect both MAE and RMSE side-by-side; a wide gap flags extreme prediction outliers.', 'MAE va RMSE ni birga o‘lchang.', 'Report both MAE and RMSE.'),
      mistake('`R²` ni klassifikatsiyada yoki `> 1` bo‘ladi deb o‘ylash', 'Misinterpreting Negative R² or Bounded Range', `# R2 can drop below 0 whenever predictions are worse than simply guessing the constant mean(y)!`, 'Metric misinterpretation', `print("R2 max is 1.0, predicting mean(y) yields 0.0, and worse models score negative R2!")`, '`R² = 0` — doimiy o‘rtacha bashorat; `< 0` — o‘rtachadan ham yomon model.', 'Understand `R²`: `1.0` = perfect, `0.0` = mean baseline, `< 0` = worse than guessing average.', '`R² < 0` bo‘lishi mumkin.', '`R²` can be negative.'),
    ],
    compareTitleUz: 'MAE vs RMSE & Ridge (L2) vs Lasso (L1)',
    compareTitleEn: 'Regression Metrics & Regularizers',
    compareUz: ['MAE vs RMSE: outlier chidamli (`MAE`) vs katta xatoni qattiq jazolash (`RMSE`).', 'Ridge (`L2`): barcha featurelar foydali va korrelyatsiyalangan bo‘lganda barqarorlashtiradi.', 'Lasso (`L1`): keraksiz ustunlarni aniq `0` qilib avtomatik feature tanlaydi.'],
    compareEn: ['MAE vs RMSE: robust average vs large-error penalty.', 'Ridge (L2): stabilizes correlated weights smoothly.', 'Lasso (L1): zeroes out useless features for sparsity.'],
    compareSummaryUz: 'OLS yoki Gradient Descent bilan model qurib, MAE + RMSE + R² + Residual grafigini tekshiring va overfittingda Ridge/Lasso qo‘llang.',
    compareSummaryEn: 'Fit regression models cleanly, diagnose residuals with MAE/RMSE/R², and regularize high-dimensional features with Ridge or Lasso.',
    practiceTasks: [
      pt('p1707_1', '1-mashq: MAE Hisoblash', 'Task 1: Compute MAE', '`y=[10, 20]`, `pred=[12, 16]` uchun MAE ni toping.', 'Calculate MAE.', `print(sum(abs(a - b) for a, b in zip([10, 20], [12, 16])) / 2)`, '3.0', 'mean(|y - yh|)', 'Prints 3.0.'),
      pt('p1707_2', '2-mashq: RMSE Hisoblash', 'Task 2: Compute RMSE', '`errors = [3, 4]` kvadratlar o‘rtachasining ildizini (RMSE) toping.', 'Calculate RMSE.', `import math\nprint(round(math.sqrt((3**2 + 4**2) / 2), 2))`, '3.54', 'sqrt(mean(e^2))', 'Prints 3.54.'),
      pt('p1707_3', '3-mashq: Ideal `R² = 1.0`', 'Task 3: Compute R² Score', '`y=[2, 4, 6]`, `pred=[2, 4, 6]` da `R²` necha?', 'Compute R².', `yt, yp = [2, 4, 6], [2, 4, 6]\nmy = sum(yt)/3\nprint(1 - sum((a-b)**2 for a,b in zip(yt,yp)) / sum((a-my)**2 for a in yt))`, '1.0', '1 - SS_res / SS_tot', 'Prints 1.0.'),
      pt('p1707_4', '4-mashq: Yomon Modelda Manfiy `R²`', 'Task 4: Negative R² Example', '`yt=[10, 20]`, `yp=[0, 30]` uchun `R²` hisoblang (`my=15`).', 'Compute negative R².', `yt, yp = [10, 20], [0, 30]\nmy = 15\nprint(1 - sum((a-b)**2 for a,b in zip(yt,yp)) / sum((a-my)**2 for a in yt))`, '-3.0', 'Worse than mean baseline -> R2 < 0', 'Prints -3.0.'),
      pt('p1707_5', '5-mashq: Residuals (Qoldiqlar)', 'Task 5: Compute Residuals', '`yt=[10, 25, 30]`, `yp=[12, 20, 30]` qoldiqlarini (`y - yh`) chiqaring.', 'Compute y - y_hat.', `print([t - p for t, p in zip([10, 25, 30], [12, 20, 30])])`, '[-2, 5, 0]', 'y_true - y_pred', 'Prints [-2, 5, 0].'),
    ],
    quiz: [
      q('q1707_1', 'Qaysi regression metrikasi bitta katta xatoni (outlier) kvadratga oshirib eng qattiq jazolaydi?', 'Regression metric penalizing occasional large errors quadratically?', ['MAE', 'RMSE (Root Mean Squared Error)', 'Accuracy', 'Precision'], ['MAE', 'RMSE', 'Accuracy', 'Precision'], 1, 'RMSE.', 'RMSE.'),
      q('q1707_2', 'Model faqat doimiy o‘rtacha qiymat (`mean(y)`) ni bashorat qilganidan ham yomon ishlasa `R²` necha bo‘ladi?', 'What happens to `R²` when predictions perform worse than constantly predicting `mean(y)`?', ['1.0', 'Manfiy (`R² < 0`)', '0.5', '100'], ['1.0', 'Negative (`R² < 0`)', '0.5', '100'], 1, 'Manfiy (`R² < 0`).', 'Negative (`R² < 0`).'),
      q('q1707_3', 'Keraksiz ustun og‘irliklarini aniq `0` ga tushirib avtomatik feature selection qiladigan regularizatsiya?', 'Regularization penalty driving uninformative feature weights strictly to `0`?', ['Ridge (L2)', 'Lasso (L1)', 'Dropout', 'MinMax'], ['Ridge (L2)', 'Lasso (L1)', 'Dropout', 'MinMax'], 1, 'Lasso (`L1`).', 'Lasso (`L1`).'),
      q('q1707_4', 'Chiziqli model bashoratidan qolgan xatolar (`y - ŷ`) yaqqol U-shaklida egri chiqsa nimani bildiradi?', 'What does a U-shaped curve pattern in regression residuals indicate?', ['Mukammal model', 'Ma’lumotda nochiziqli bog‘liqlik bor — polynomial belgilar (`x²`) yoki tree model kerak', 'Data leak', 'Zero bias'], ['Perfect fit', 'Unmodeled nonlinearity requiring polynomial terms or nonlinear models', 'Leak', 'Zero bias'], 1, 'Nochiziqli bog‘liqlik qolib ketgan.', 'Missed nonlinearity.'),
      q('q1707_5', 'Asl birliklar bilan bir xil o‘lchovda (masalan `$`) va outlierlarga chidamli xato metrikasi?', 'Error metric in target units robust against extreme outliers?', ['R²', 'MAE (Mean Absolute Error)', 'MSE', 'F1'], ['R²', 'MAE', 'MSE', 'F1'], 1, 'MAE.', 'MAE.'),
    ],
    homework: hw('OLS Linear Regression & Diagnostic Reporter', 'Complete Regression Fit & Metrics Suite', 'Berilgan 1D `(xs, ys)` nuqtalarida OLS (`w, b`) ni hisoblovchi, MAE / RMSE / R² metrikalarini va residual ro‘yxatini chiqaruvchi modul yozing.', 'Build a regression evaluator computing closed-form 1D OLS parameters `(w, b)`, MAE, RMSE, R², and residual lists to spot outliers.', ['OLS fit + MAE + RMSE + R²', 'Outlier residual warning check'], ['OLS + Full metrics', 'Residual outlier check'], 'Guard division by zero in `SS_tot == 0` when all `y` targets are identical.', 'Complete regression toolkit.', 'Keyingi qismda Classification, Clustering, Evaluation, PyTorch va AI API larni yakunlaymiz!', 'Classification & Deep Learning next.', 25),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),
];
