import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C08_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-08-01',
    courseId: 'modules_packages',
    moduleId: 'c08_m1',
    order: 1,
    titleUz: 'Module tushunchasi va `if __name__ == "__main__":` siri',
    titleEn: 'Modules & the `if __name__ == "__main__":` Guard',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-07-10'],
    conceptId: 'modules_concept',
    whyUz: "Har bir `.py` fayl — bu tayyor **Modul**. Lekin bir fayldan funksiya import qilganingizda uning pastidagi test `print()` lar ham beixtiyor ishlab ketishi mumkin — buning oldini aynan `if __name__ == \"__main__\":` oladi!",
    whyEn: 'Every `.py` file is a module. Guarding script entry points with `if __name__ == "__main__":` lets files work cleanly both as reusable libraries and runnable scripts.',
    analogyUz: "`__name__` — bu xodimning bugungi roli: fayl to‘g‘ridan-to‘g‘ri ishga tushirilsa u \"Bosh ijrochi\" (`\"__main__\"`), import qilinsa esa \"Yordamchi kutubxona\" (o‘z nomi) rolida bo‘ladi.",
    analogyEn: '`__name__` tells a file whether it was launched directly (`"__main__"`) or imported as a helper library (its module name).',
    stopsUz: "Har bir Python moduli birinchi marta `import` qilinganda **`sys.modules`** keshiga saqlanadi va ichidagi top-level kod bir marta bajariladi! Shu sababli import qilinadigan faylda himoyasiz top-level ishga tushirish kodlari bo‘lmasligi shart.",
    stopsEn: 'Python executes top-level module code once upon first import and caches it in `sys.modules`. Always wrap runnable entry logic inside `if __name__ == "__main__":`.',
    objUz: ['Modul (`.py` fayl) va uning namespace izolatsiyasini tushunish', '`__name__` qiymati to‘g‘ridan-to‘g‘ri vs `import` paytida qanday o‘zgarishini bilish', '`sys.modules` keshlash mexanizmini ko‘rish'],
    objEn: ['Understand `.py` files as isolated module namespaces', 'Use `if __name__ == "__main__":` for dual script/library files', 'Observe Python’s `sys.modules` import cache'],
    theoryUz: `### 1. Modul Nima?
Istalgan \`utils.py\` fayli Python uchun bir moduldir. U o‘z o‘zgaruvchilari va funksiyalari uchun alohida **namespace** yaratadi.
### 2. \`__name__\` Sihri
- \`python app.py\` deb yurgizsangiz: \`__name__ == "__main__"\`.
- Boshqa faylda \`import app\` qilsangiz: \`app.__name__ == "app"\`.
### 3. \`if __name__ == "__main__":\` Qolipi
Asosiy \`main()\` chaqiruvlarini shu blok ichiga joylashtiring.
### 4. \`sys.modules\` Keshi
Bir xil modul 10 ta faylda \`import\` qilinsa ham, Python uni faqat **1 marta** yuklaydi va \`sys.modules\` dan qayta beradi.
### 5. Keng tarqalgan xato
Kutubxona faylida \`if __name__ == "__main__":\` qo‘ymay \`import\` paytida testlar ishga tushib ketishi.`,
    theoryEn: `### 1. What Is a Module?
A \`.py\` file acting as an isolated namespace.
### 2. Dual-Mode \`__name__\`
Equals \`"__main__"\` when run directly, or module name when imported.
### 3. Entry-Point Guard
Place CLI demos and \`main()\` inside \`if __name__ == "__main__":\`.
### 4. \`sys.modules\` Cache
Modules load once per process.
### 5. Pitfall
Unguarded top-level side effects execute on import.`,
    examples: [
      ex('Misol 1: `__name__` va `sys.modules`', 'Example 1: __name__ & sys.modules', `import json, math, sys\nprint("Script:", __name__, "| math:", math.__name__)\nprint("Cached?", "json" in sys.modules)`, `Script: __main__ | math: math\nCached? True`, 'To‘g‘ridan-to‘g‘ri ishlagan skript `"__main__"`, import qilingan modullar esa o‘z nomida!', 'Main script uses `"__main__"`; imported modules keep their own names.'),
      ex('Misol 2: `importlib` bilan temp modulni import qilish', 'Example 2: Dynamic Temp Module Import', `import importlib.util, tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    mod_path = Path(d) / "calc_mod.py"\n    mod_path.write_text('def add(a, b): return a + b\\nMOD_NAME = __name__\\nif __name__ == "__main__":\\n    print("SKIP")', encoding="utf-8")\n    spec = importlib.util.spec_from_file_location("calc_mod", mod_path)\n    mod = importlib.util.module_from_spec(spec)\n    spec.loader.exec_module(mod)\n    print("Imported:", mod.MOD_NAME, "| Sum:", mod.add(2, 3))`, `Imported: calc_mod | Sum: 5`, 'Import qilinganda `if __name__ == "__main__":` bloki ishlamadi!', 'Entry guard stayed silent during import.'),
      ex('Misol 3: `dir()` bilan modul atributlari', 'Example 3: Inspecting Module Exports', `import json\nprint("Has loads?", "loads" in dir(json))`, `Has loads? True`, '`dir(mod)` modul ichidagi barcha nomlarni ko‘rsatadi.', '`dir()` lists attributes exposed in a module namespace.'),
    ],
    traceTitleUz: '`__name__` tekshiruvi izi',
    traceTitleEn: 'Tracing __name__ Guard',
    traceCode: `def helper(): return "ok"\nif __name__ == "__main__":\n    print(__name__, helper())`,
    traceSteps: [
      traceStep(1, 'def helper()', 'bound', 'Funksiya yuklandi', 'Defined helper'),
      traceStep(2, '__name__ == "__main__"', 'True', 'To‘g‘ridan-to‘g‘ri run tasdiqlandi', 'Direct run matched'),
      traceStep(3, 'print(...)', '__main__ ok', 'Asosiy blok ishladi', 'Ran main block', '__main__ ok'),
    ],
    commonMistakes: [
      mistake('`if __name__ == "__main__":` qo‘shmay top-level kod yozish', 'Unguarded Top-Level Script Execution', `# helper.py\ndef clean(x): return x.strip()\nprint("Runs on import!")`, 'Side effects run during import/testing!', `def clean(x):\n    return x.strip()\nif __name__ == "__main__":\n    print(clean(" hi "))`, 'Import qiluvchi fayllar ham o‘sha `print()` ni ko‘rib qoladi.', 'Top-level calls execute on import.', 'Demo va `main()` ni `if __name__ == "__main__":` ostiga oling.', 'Always guard entry code.'),
      mistake('`"__main__"` da bitta pastki chiziq `_main_` yozish', 'Typo in __name__ == "__main__"', `if __name__ == "_main_":\n    print("Never runs")`, 'Condition evaluates False silently!', `if __name__ == "__main__":\n    print("Runs!")`, 'Ikkala tomonda ham **ikkita** pastki chiziq (`__`) shart.', 'Requires double underscores on both sides.', '`"__main__"` yozilishini tekshiring.', 'Use double underscores.'),
    ],
    compareTitleUz: 'Script vs Library Module',
    compareTitleEn: 'Executable Script vs Reusable Module',
    compareUz: ['Library Module: faqat `def`, `class`, konstanta.', 'Dual-Mode Module: tepada `def/class`, pastda `if __name__ == "__main__": main()`.'],
    compareEn: ['Library: pure definitions.', 'Dual-mode: definitions + `if __name__ == "__main__": main()`.'],
    compareSummaryUz: 'Har bir `.py` faylni import uchun toza va `if __name__ == "__main__":` bilan ishga tushuvchi qilib yozing.',
    compareSummaryEn: 'Keep module top-level pure and guard script execution with `if __name__ == "__main__":`.',
    practiceTasks: [
      pt('p0801_1', '1-mashq: `__name__`', 'Task 1: Check __name__', '`if __name__ == "__main__": print("entry")` chiqaring.', 'Guard print with __main__.', `if __name__ == "__main__":\n    print("entry")`, 'entry', 'Double underscores.', 'Prints entry.'),
      pt('p0801_2', '2-mashq: `math.__name__`', 'Task 2: Imported Name', '`import math` -> `math.__name__` chiqaring.', 'Print math.__name__.', `import math\nprint(math.__name__)`, 'math', 'math.__name__', 'Prints math.'),
      pt('p0801_3', '3-mashq: `sys.modules`', 'Task 3: Cache Check', '`"sys" in sys.modules` ni chiqaring.', 'Verify sys in sys.modules.', `import sys\nprint("sys" in sys.modules)`, 'True', '"sys" in sys.modules', 'Prints True.'),
      pt('p0801_4', '4-mashq: `dir()`', 'Task 4: Introspection', '`"loads" in dir(json)` ni chiqaring.', 'Check loads in dir(json).', `import json\nprint("loads" in dir(json))`, 'True', '"loads" in dir(json)', 'Prints True.'),
      pt('p0801_5', '5-mashq: `main()` guard', 'Task 5: main() Guard', '`def main(): print("ok")` ni `__main__` dan chaqiring.', 'Call main() inside guard.', `def main():\n    print("ok")\nif __name__ == "__main__":\n    main()`, 'ok', 'if __name__ == "__main__": main()', 'Prints ok.'),
    ],
    quiz: [
      q('q0801_1', 'Fayl `python app.py` bilan ishga tushsa `__name__` qiymati?', 'Value of `__name__` when running directly?', ['"app"', '"__main__"', '"__app__"', 'None'], ['"app"', '"__main__"', '"__app__"', 'None'], 1, '`"__main__"`.', '`"__main__"`.'),
      q('q0801_2', '`helper.py` import qilinsa `helper.__name__` nima bo‘ladi?', 'Value of `helper.__name__` when imported?', ['"__main__"', '"helper"', '"helper.py"', 'None'], ['"__main__"', '"helper"', '"helper.py"', 'None'], 1, '`"helper"`.', '`"helper"`.'),
      q('q0801_3', 'Python yuklangan modullarni qayerda keshlaydi?', 'Where does Python cache loaded modules?', ['sys.cache', 'sys.modules', 'os.modules', 'globals()'], ['sys.cache', 'sys.modules', 'os.modules', 'globals()'], 1, '`sys.modules`.', '`sys.modules`.'),
      q('q0801_4', '`if __name__ == "__main__":` vazifasi?', 'Purpose of `if __name__ == "__main__":`?', ['Tezlatish', 'Import paytida skript kodi ishlab ketmasligi uchun', 'Xato tutish', 'Type check'], ['Speed', 'Prevent script execution on import', 'Catch errors', 'Type check'], 1, 'Importda side-effect oldini oladi.', 'Avoids side effects on import.'),
      q('q0801_5', 'Modul ichidagi nomlarni ko‘rish funksiyasi?', 'Built-in listing attributes of a module?', ['list()', 'dir()', 'vars()', 'keys()'], ['list()', 'dir()', 'vars()', 'keys()'], 1, '`dir(module)`.', '`dir(module)`.'),
    ],
    homework: hw('Ikki Rejimli CLI/Kutubxona Moduli', 'Dual-Mode Module Pattern', 'Temp papkada `text_tools.py` faylini `__name__ == "__main__"` bilan yaratib, `importlib` orqali import qilib guard ishlamaganini tasdiqlang.', 'Create `text_tools.py` in temp dir with `__main__` guard and test importing via `importlib`.', ['__main__ guard', 'importlib testi'], ['Include __main__ guard', 'Test via importlib'], 'spec = importlib.util.spec_from_file_location("text_tools", p)', 'Execute module cleanly.', 'Modul docstringini qo‘shing.', 'Add module docstring.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-08-02',
    courseId: 'modules_packages',
    moduleId: 'c08_m1',
    order: 2,
    titleUz: '`import` va `from` — nomlar to‘qnashuvi hamda Circular Import',
    titleEn: '`import`, `from ... import`, Aliases (`as`) & Circular Imports',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-08-01'],
    conceptId: 'import_from',
    whyUz: "Har bir loyihada `from module import *` yozish o‘zgaruvchilarni yashirincha ustidan yozib yuboradi, ikkita fayl bir-birini import qilganda esa mashhur **Circular Import (`ImportError`)** xatosi chiqadi!",
    whyEn: 'Choosing cleanly between `import mod`, `from mod import item`, and `as` aliases avoids namespace collisions and circular import deadlocks.',
    analogyUz: "`import math` — bu kitobni aniq `math.sqrt` javonidan olish. `from math import *` — esa butun kutubxonani stolga to‘kish (siz yozgan nomlarni yopib qo‘yadi!).",
    analogyEn: '`import math` keeps a clear `math.` namespace shelf; `from math import *` dumps everything onto your desk.',
    stopsUz: "**`from module import *`** ishlab chiqarish kodida **TAQIQLANADI**! Circular Import (`a.py -> b.py -> a.py`) muammosini esa umumiy modellarni 3-faylga (`common.py`) chiqarib hal qiling.",
    stopsEn: 'Never use `from mod import *` in production code. Resolve circular imports by extracting shared models into a third module.',
    objUz: ['`import m`, `import m as alias`, `from m import x, y` farqlarini bilish', 'Wildcard `from m import *` xavfini tushunish', 'Circular Import sababi va 3-modul (`common.py`) yechimini qo‘llash'],
    objEn: ['Use `import mod`, `import mod as alias`, and `from mod import obj`', 'Avoid `from mod import *` namespace pollution', 'Break circular imports by extracting shared dependencies'],
    theoryUz: `### 1. Import Shakllari
- \`import math\` (eng toza namespace!)
- \`import datetime as dt\` (qisqa alias)
- \`from pathlib import Path\` (tez-tez ishlatiladigan sinflar)
- \`from math import *\` -> **YOMON**!
### 2. Nomlar To‘qnashuvi va \`as\`
\`from json import loads as json_loads\`.
### 3. Circular Import Muammosi
\`a.py\` <-> \`b.py\` o‘zaro tepada import qilsa \`ImportError\` beradi; umumiy kodni \`common.py\` ga ajrating.
### 4. PEP 8 Import Tartibi
1) Stdlib -> 2) Third-party -> 3) Local modules.`,
    theoryEn: `### 1. Import Forms
\`import mod\`, \`import mod as alias\`, \`from mod import obj\`. Never \`from mod import *\`.
### 2. Resolving Name Collisions
Use \`as\` aliases.
### 3. Breaking Circular Imports
Extract shared definitions into a third module so imports stay acyclic.
### 4. PEP 8 Grouping
Stdlib, third-party, then local imports.`,
    examples: [
      ex('Misol 1: Namespace tozaligi (`import` vs `as`)', 'Example 1: Explicit Namespaces & Aliases', `import datetime as dt\nfrom math import ceil, floor\ntoday = dt.date(2026, 11, 20)\nprint(today.isoformat(), ceil(4.2), floor(4.8))`, `2026-11-20 5 4`, 'Standard alias (`dt`) va aniq nomlar kodni ravon qildi.', 'Clear `dt` alias and explicit `ceil`/`floor` imports.'),
      ex('Misol 2: `as` bilan nom to‘qnashuvini hal qilish', 'Example 2: Disambiguating with as', `from json import dumps as to_json\nfrom html import escape as html_escape\nprint(to_json({"text": html_escape("<b>Hi</b>")}))`, `{"text": "&lt;b&gt;Hi&lt;/b&gt;"}`, 'Ikkala funksiya ham tushunarli nomlar bilan import qilindi.', 'Aliases kept distinct helpers clear.'),
      ex('Misol 3: `importlib.import_module` dinamik importi', 'Example 3: Programmatic Import', `import importlib\nmod = importlib.import_module("statistics")\nprint("Mean:", mod.mean([10, 20, 30]))`, `Mean: 20`, 'Plagin tizimlarida modul nomi stringdan yuklanadi.', 'Loaded module dynamically using `importlib`.'),
    ],
    traceTitleUz: 'Import namespace izi',
    traceTitleEn: 'Tracing Import Binding',
    traceCode: `from math import sqrt as sq\nprint(int(sq(81)))`,
    traceSteps: [
      traceStep(1, 'from math import sqrt as sq', 'sq=<builtin>', 'sq nomiga bog‘landi', 'Bound sqrt under alias sq'),
      traceStep(2, 'print(int(sq(81)))', '9', 'Natija chiqdi', 'Printed 9', '9'),
    ],
    commonMistakes: [
      mistake('`from mod import *` bilan built-in ni ustiga yozish', 'Wildcard Import Shadowing', `# from math import *  -> overwrites built-in pow()!`, 'Quietly replaces built-ins', `import math\nprint("Built-in:", pow(2, 3, 5), "| math:", math.pow(2, 3))`, '`math.pow()` 3-argument qabul qilmaydi!', 'Wildcard import shadows built-in `pow(a, b, mod)`.', 'Aniq `import math` yoki `from math import sqrt` yozing.', 'Import explicitly.'),
      mistake('Ikki fayl bir-birini tepada import qilishi', 'Top-Level Circular Import', `# a.py imports b; b.py imports a -> ImportError`, 'ImportError on partially initialized module', `print("Move shared definitions to common.py!")`, 'A -> B -> A sikli modul yuklashini bloklaydi.', 'Mutual top-level imports fail.', 'Umumiy kodni 3-faylga chiqaring.', 'Extract shared definitions.'),
    ],
    compareTitleUz: '`import module` vs `from module import item`',
    compareTitleEn: '`import mod` vs `from mod import item`',
    compareUz: ['`import mod`: nom to‘qnashuvi nol, qayerdan kelgani aniq (`json.loads`).', '`from mod import Item`: tez-tez ishlatiladigan sinflar uchun ixcham.'],
    compareEn: ['`import mod`: explicit origin, zero collisions.', '`from mod import Item`: concise for frequent symbols.'],
    compareSummaryUz: '`import mod` yoki aniq `from mod import X` ishlating — hech qachon `*` ishlatmang!',
    compareSummaryEn: 'Use `import mod` or explicit `from mod import X`; ban `import *`.',
    practiceTasks: [
      pt('p0802_1', '1-mashq: `as` alias', 'Task 1: Alias Import', '`import statistics as st` bilan `st.median([1, 9, 3])` chiqaring.', 'Use alias st.', `import statistics as st\nprint(st.median([1, 9, 3]))`, '3', 'import statistics as st', 'Print median.'),
      pt('p0802_2', '2-mashq: Aniq `from` import', 'Task 2: Explicit Import', '`from collections import Counter` bilan `Counter("aba")["a"]` chiqaring.', 'Import Counter explicitly.', `from collections import Counter\nprint(Counter("aba")["a"])`, '2', 'from collections import Counter', 'Prints 2.'),
      pt('p0802_3', '3-mashq: Funksiya aliasi', 'Task 3: Rename Symbol', '`from math import factorial as fact` bilan `fact(5)` chiqaring.', 'Alias factorial as fact.', `from math import factorial as fact\nprint(fact(5))`, '120', 'as fact', 'Prints 120.'),
      pt('p0802_4', '4-mashq: Built-in ni saqlash', 'Task 4: Preserve pow', '`import math` bilan `pow(2, 3, 3)` chiqaring.', 'Keep 3-arg built-in pow.', `import math\nprint(pow(2, 3, 3))`, '2', 'Do not use import *.', 'Prints 2.'),
      pt('p0802_5', '5-mashq: `importlib`', 'Task 5: Dynamic Import', '`importlib.import_module("json").dumps([1, 2])` chiqaring.', 'Import json dynamically.', `import importlib\nj = importlib.import_module("json")\nprint(j.dumps([1, 2]))`, '[1, 2]', 'importlib.import_module', 'Prints [1, 2].'),
    ],
    quiz: [
      q('q0802_1', 'Nima uchun `from module import *` yomon amaliyot?', 'Why avoid `from module import *`?', ['Kod ishlamaydi', 'Nomlar to‘qnashuvi va noaniqlik keltiradi', 'Sekinroq', '1 ta nom oladi'], ['Breaks runtime', 'Causes hidden name collisions', 'Slow', '1 name'], 1, 'Nomlarni yashirincha ustidan yozadi.', 'Causes hidden shadowing.'),
      q('q0802_2', 'Circular import ni hal qilishning eng toza usuli?', 'Cleanest fix for circular imports?', ['import *', 'Umumiy kodni 3-modulga ajratish', '1 faylga qo‘shish', 'try/except'], ['Use import *', 'Extract shared code to a 3rd module', 'Merge files', 'try/except'], 1, 'Umumiy kodni 3-modulga ajratish.', 'Extract shared dependencies.'),
      q('q0802_3', 'PEP 8 importlar tartibi?', 'PEP 8 import order?', ['Local -> Third-party -> Stdlib', 'Stdlib -> Third-party -> Local', 'Alifbo', 'Farqi yo‘q'], ['Local -> Third-party -> Stdlib', 'Stdlib -> Third-party -> Local', 'Alpha', 'Any'], 1, 'Stdlib -> Third-party -> Local.', 'Stdlib, third-party, local.'),
      q('q0802_4', 'Bir xil nomli funksiyani qayta nomlash kalit so‘zi?', 'Keyword aliasing imported symbol?', ['rename', 'alias', 'as', 'from'], ['rename', 'alias', 'as', 'from'], 2, '`as`.', '`as`.'),
      q('q0802_5', 'Stringdan dinamik modul yuklash moduli?', 'Stdlib module for dynamic imports?', ['importlib', 'syslib', 'loader', 'pkgutil'], ['importlib', 'syslib', 'loader', 'pkgutil'], 0, '`importlib`.', '`importlib`.'),
    ],
    homework: hw('Circular Importni Hal Qilish Refaktori', 'Break Circular Import Lab', '3 ta fayl (`models.py`, `users.py`, `orders.py`) ni DAG tartibida temp papkada yaratib xatosiz import qiling.', 'Create acyclic `models.py`, `users.py`, `orders.py` in temp dir and import cleanly.', ['3 ta DAG fayl', 'Circular xatosiz'], ['3 acyclic files', 'No circular error'], 'sys.path.insert(0, str(tmp))', 'Cleanup sys.path after test.', 'PEP 8 import guruhlarini saqlang.', 'Follow PEP 8 grouping.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-08-03',
    courseId: 'modules_packages',
    moduleId: 'c08_m1',
    order: 3,
    titleUz: 'O‘z modulimizni yaratish, `__all__` va `sys.path`',
    titleEn: 'Authoring Your Own Module: Public API (`__all__`) & `sys.path`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-08-02'],
    conceptId: 'custom_module',
    whyUz: "Katta loyihalar `validators.py`, `pricing.py`, `storage.py` kabi kichik modullarga bo‘linadi. `__all__` va `_private` nomlar public API ni aniq belgilaydi.",
    whyEn: 'Splitting monoliths into cohesive modules with clear public exports (`__all__` and `_private` naming) keeps large apps maintainable.',
    analogyUz: "`_helper()` — ombor eshigi; `__all__` — vitrinadagi rasmiy mahsulotlar ro‘yxati!",
    analogyEn: '`_helper` marks internals; `__all__` declares the official public API catalog.',
    stopsUz: "Hech qachon faylingizga standart kutubxona nomini (`random.py`, `json.py`, `email.py`) bermang — `sys.path[0]` da turgani uchun stdlib ni yopib qo‘yadi (Module Shadowing)!",
    stopsEn: 'Never name a file `json.py`, `random.py`, or `email.py`—your local folder shadows the stdlib module on `sys.path[0]`.',
    objUz: ['`_private` va `__all__` bilan public API belgilash', '`sys.path` qidiruv tartibini bilish', 'Stdlib module shadowing dan qochish'],
    objEn: ['Separate `_private` helpers from `__all__` exports', 'Understand `sys.path` lookup priority', 'Avoid shadowing stdlib filenames'],
    theoryUz: `### 1. Modul Nomlash
Fayl nomi \`snake_case.py\` (\`my-utils.py\` emas!).
### 2. \`_private\` va \`__all__\`
\`__all__ = ["add_tax"]\` public API ni eʼlon qiladi.
### 3. \`sys.path\` Tartibi
1. Joriy papka -> 2. Stdlib -> 3. \`site-packages\`.
### 4. Stdlib Shadowing
\`json.py\` yoki \`random.py\` nomi standart kutubxonani yopadi!`,
    theoryEn: `### 1. Naming
Always \`snake_case.py\`.
### 2. Encapsulation
Use \`_\` prefix and \`__all__\`.
### 3. \`sys.path\`
Local directory -> Stdlib -> \`site-packages\`.
### 4. Avoid Shadowing
Do not name files \`json.py\`, \`csv.py\`, or \`random.py\`.`,
    examples: [
      ex('Misol 1: `__all__` li temp modul yuklash', 'Example 1: Custom Module with __all__', `import importlib.util, tempfile\nfrom pathlib import Path\ncode = '__all__ = ["add_tax"]\\n_RATE = 0.12\\ndef add_tax(p): return round(p * (1 + _RATE), 2)'\nwith tempfile.TemporaryDirectory() as d:\n    p = Path(d) / "pricing_mod.py"\n    p.write_text(code, encoding="utf-8")\n    s = importlib.util.spec_from_file_location("pricing_mod", p)\n    m = importlib.util.module_from_spec(s)\n    s.loader.exec_module(m)\n    print("Exports:", m.__all__, "| Total:", m.add_tax(100))`, `Exports: ['add_tax'] | Total: 112.0`, '`__all__` public API ni aniq belgiladi.', '`__all__` declared official exports cleanly.'),
      ex('Misol 2: `sys.path` tekshiruvi', 'Example 2: Inspecting sys.path', `import sys\nprint(isinstance(sys.path, list), len(sys.path) > 0)`, `True True`, 'Python modullarni `sys.path` dan izlaydi.', 'Python searches `sys.path` entries.'),
      ex('Misol 3: Modul metadatasi', 'Example 3: Module Metadata', `import json\nprint(hasattr(json, "__file__"), bool(json.__doc__))`, `True True`, 'Har bir modul `__file__` va `__doc__` ga ega.', 'Modules expose `__file__` and `__doc__`.'),
    ],
    traceTitleUz: 'Modul yuklanish izi',
    traceTitleEn: 'Tracing Module Resolution',
    traceCode: `import json, sys\nprint("json" in sys.modules, hasattr(json, "loads"))`,
    traceSteps: [
      traceStep(1, 'import json', 'sys.modules["json"]', 'Keshdan/sys.path dan yuklandi', 'Loaded json'),
      traceStep(2, 'hasattr(json, "loads")', 'True', 'Atribut tasdiqlandi', 'Confirmed loads', 'True True'),
    ],
    commonMistakes: [
      mistake('Faylni `random.py` deb nomlash', 'Stdlib Module Shadowing', `# random.py in project folder shadows Python's built-in random module!`, 'AttributeError on random.randint', `print("Use unique names like app_random.py")`, 'Joriy papka `sys.path[0]` da turadi.', 'Local dir precedes stdlib.', 'Stdlib nomlarini bermang.', 'Avoid stdlib filenames.'),
      mistake('Modul nomida defis `-` ishlatish', 'Hyphen in Filename', `# import my-utils -> SyntaxError`, 'SyntaxError', `print("Use underscores: my_utils.py")`, 'Defis ayirish operatoridir.', 'Hyphens are invalid identifiers.', '`snake_case.py` yozing.', 'Use underscores.'),
    ],
    compareTitleUz: 'Monolit fayl vs Ajratilgan modullar',
    compareTitleEn: 'Monolith vs Modules',
    compareUz: ['Monolit: kichik skriptlar uchun.', 'Modullar: testlash, qayta ishlatish va jamoaviy ish uchun.'],
    compareEn: ['Monolith: tiny scripts.', 'Modules: scalable, testable apps.'],
    compareSummaryUz: 'Unique `snake_case.py` nomlar, `_` private va `__all__` dan foydalaning.',
    compareSummaryEn: 'Use unique `snake_case` filenames, `_` privates, and `__all__`.',
    practiceTasks: [
      pt('p0803_1', '1-mashq: `__all__`', 'Task 1: __all__', '`__all__ = ["ping"]` ni chiqaring.', 'Print __all__.', `__all__ = ["ping"]\nprint(__all__)`, "['ping']", '__all__ = ["ping"]', 'Prints list.'),
      pt('p0803_2', '2-mashq: Identifier check', 'Task 2: Valid Name', '`"my_utils".isidentifier()` va `"my-utils".isidentifier()` chiqaring.', 'Check identifier validity.', `print("my_utils".isidentifier(), "my-utils".isidentifier())`, 'True False', '.isidentifier()', 'Prints True False.'),
      pt('p0803_3', '3-mashq: Private filtri', 'Task 3: Public Filter', '`["_a", "b"]` dan `_` sizlarni chiqaring.', 'Filter public symbols.', `print([n for n in ["_a", "b"] if not n.startswith("_")])`, "['b']", 'not n.startswith("_")', 'Prints ["b"].'),
      pt('p0803_4', '4-mashq: `sys.path`', 'Task 4: sys.path Type', '`isinstance(sys.path, list)` chiqaring.', 'Check sys.path.', `import sys\nprint(isinstance(sys.path, list))`, 'True', 'sys.path', 'Prints True.'),
      pt('p0803_5', '5-mashq: Temp modul', 'Task 5: Temp Module', 'Temp fayl `VER = 2` yuklab `2` chiqaring.', 'Load temp module.', `import importlib.util, tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as d:\n    p = Path(d) / "c_m.py"\n    p.write_text("VER = 2", encoding="utf-8")\n    s = importlib.util.spec_from_file_location("c_m", p)\n    m = importlib.util.module_from_spec(s)\n    s.loader.exec_module(m)\n    print(m.VER)`, '2', 'importlib.util', 'Print VER.'),
    ],
    quiz: [
      q('q0803_1', 'Qaysi fayl nomi yaroqsiz?', 'Invalid module filename?', ['user_utils.py', 'auth2.py', 'user-utils.py', '_helpers.py'], ['user_utils.py', 'auth2.py', 'user-utils.py', '_helpers.py'], 2, '`user-utils.py`.', '`user-utils.py`.'),
      q('q0803_2', '`json.py` yaratish nimaga olib keladi?', 'Creating local `json.py` causes?', ['Tezlik', 'Stdlib json ni yopadi (shadowing)', 'Xato yo‘q', 'Auto merge'], ['Speed', 'Shadows stdlib json', 'No issue', 'Auto merge'], 1, 'Module shadowing.', 'Shadows stdlib `json`.'),
      q('q0803_3', '`__all__` vazifasi?', 'Purpose of `__all__`?', ['Xato tutish', 'Public export nomlarini belgilash', 'Hajm', 'Tezlik'], ['Errors', 'Declare public exports', 'Size', 'Speed'], 1, 'Public export ro‘yxati.', 'Declares public exports.'),
      q('q0803_4', 'Private nom belgisi?', 'Prefix for private helpers?', ['$', '@', '_', '!'], ['$', '@', '_', '!'], 2, '`_`.', '`_`.'),
      q('q0803_5', 'Import qidiruv papkalari ro‘yxati?', 'Module search path list?', ['os.dirs', 'sys.path', 'sys.import', 'path.DIRS'], ['os.dirs', 'sys.path', 'sys.import', 'path.DIRS'], 1, '`sys.path`.', '`sys.path`.'),
    ],
    homework: hw('Mini Formatlovchi Moduli', 'Custom Module Export Lab', '`uz_format.py` modulini `__all__`, `_clean_num` va `format_uzs` bilan yaratib `importlib` orqali test qiling.', 'Create `uz_format.py` with `__all__` and `_helper` and import via `importlib`.', ['__all__ va _helper', 'Module docstring'], ['Define __all__ and _helper', 'Add docstring'], 'return f"{_clean_num(amount):,} so‘m"', 'Format cleanly.', 'Assert bilan tekshiring.', 'Add assertions.', 20),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-08-04',
    courseId: 'modules_packages',
    moduleId: 'c08_m1',
    order: 4,
    titleUz: 'Python Standard Library ("Batteries Included") va Review #16',
    titleEn: 'Python Standard Library Powerhouses & Review #16',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-08-03'],
    conceptId: 'standard_library',
    whyUz: "Python \"Batteries Included\" kutubxonasida sana (`datetime`), kriptoxavfsiz token (`secrets`), chastota (`collections.Counter`), statistika va SHA-256 (`hashlib`) tayyor holda keladi!",
    whyEn: 'Python’s "Batteries Included" stdlib handles dates (`datetime`), CSPRNG tokens (`secrets`), counting (`collections`), statistics, and hashing with zero dependencies.',
    analogyUz: "Standard Library — bu yangi uy bilan keladigan jihozlangan ustaxona: tashqaridan `pip install` qilmasdan ham ko‘plab asosiy asboblar (`datetime`, `secrets`, `collections`) tayyor!",
    analogyEn: 'The Standard Library is a built-in toolkit—reach for `datetime`, `secrets`, `collections`, and `hashlib` before adding third-party dependencies.',
    stopsUz: "Parol/OTP/API token yaratishda **HECH QACHON `random` ishlatmang** — faqat **`secrets`** (`secrets.token_urlsafe(32)`)! Shuningdek `datetime.utcnow()` o‘rniga **`datetime.now(timezone.utc)`** ishlating!",
    stopsEn: 'NEVER use `random` for tokens/OTPs—use `secrets`! Also use timezone-aware `datetime.now(timezone.utc)` instead of deprecated `utcnow()`.',
    objUz: ['`datetime` (`timezone.utc`, `timedelta`) bilan ishlash', '`random` vs `secrets` xavfsizlik farqini bilish', '`collections.Counter`, `defaultdict`, `statistics` va `hashlib` ni qo‘llash'],
    objEn: ['Compute UTC dates and durations with `datetime` and `timedelta`', 'Distinguish `random` from crypto-safe `secrets`', 'Apply `Counter`, `defaultdict`, `statistics`, and `hashlib`'],
    theoryUz: `### 1. \`datetime\` va \`timezone.utc\`
\`datetime.now(timezone.utc)\` va \`timedelta(days=7)\` ishlating.
### 2. \`random\` vs \`secrets\`
\`random\` — o‘yin/test; \`secrets\` — token/parol/OTP!
### 3. \`collections\`
\`Counter(items).most_common(3)\` va \`defaultdict(list)\`.
### 4. \`statistics\` va \`hashlib\`
\`statistics.mean\`, \`median\`; \`hashlib.sha256(b"...").hexdigest()\`.`,
    theoryEn: `### 1. Timezone-Aware \`datetime\`
Use \`timezone.utc\` and \`timedelta\`.
### 2. \`random\` vs \`secrets\`
Use \`secrets\` for all security tokens and OTPs.
### 3. \`collections\`
\`Counter\` and \`defaultdict\` simplify aggregation.
### 4. \`statistics\` & \`hashlib\`
Built-in math stats and SHA-256 digests.`,
    examples: [
      ex('Misol 1: `datetime` + `timezone.utc` + `timedelta`', 'Example 1: UTC Dates & Timedelta', `from datetime import datetime, timedelta, timezone\nbase = datetime(2026, 11, 20, 12, 0, tzinfo=timezone.utc)\nexpires = base + timedelta(days=7)\nprint(base.strftime("%Y-%m-%d"), "->", expires.strftime("%Y-%m-%d"))`, `2026-11-20 -> 2026-11-27`, 'Timezone-aware UTC sana va 7 kunlik muddat hisoblandi.', 'Computed deterministic 7-day UTC expiry.'),
      ex('Misol 2: `Counter` va `defaultdict`', 'Example 2: Counter & defaultdict', `from collections import Counter, defaultdict\nevents = ["login", "view", "login", "buy", "login", "view"]\nprint("Top2:", Counter(events).most_common(2))\ng = defaultdict(list)\nfor w in ["go", "py", "rust"]:\n    g[len(w)].append(w)\nprint("Grouped:", dict(g))`, `Top2: [('login', 3), ('view', 2)]\nGrouped: {2: ['go', 'py'], 4: ['rust']}`, 'Chastota tahlili va guruhlash 4 qatorda bajarildi.', 'Aggregated counts and groups cleanly.'),
      ex('Misol 3: `secrets` token va `hashlib.sha256`', 'Example 3: Crypto Tokens & SHA-256', `import hashlib, secrets\ntoken = secrets.token_hex(16)\ndigest = hashlib.sha256(b"python-mastery").hexdigest()\nprint("Token len:", len(token), "| SHA256 len:", len(digest), "| Same?", digest == hashlib.sha256(b"python-mastery").hexdigest())`, `Token len: 32 | SHA256 len: 64 | Same? True`, '32 belgili xavfsiz hex token va 64 belgili deterministik SHA-256 xeshi olindi.', 'Generated 32-char secure token and deterministic 64-char SHA-256 hash.'),
    ],
    traceTitleUz: 'Counter va hashlib izi',
    traceTitleEn: 'Tracing Counter',
    traceCode: `from collections import Counter\nprint(Counter("abracadabra").most_common(2))`,
    traceSteps: [
      traceStep(1, 'Counter("abracadabra")', "{'a': 5, 'b': 2, 'r': 2, ...}", 'Harflar sanaldi', 'Counted chars'),
      traceStep(2, '.most_common(2)', "[('a', 5), ('b', 2)]", 'Top 2 olindi', 'Returned top 2', "[('a', 5), ('b', 2)]"),
    ],
    commonMistakes: [
      mistake('OTP/Token uchun `random` ishlatish', 'Using random for Security Tokens', `import random\n# random.randint(100000, 999999) is predictable!`, 'Cryptographically weak PRNG', `import secrets\ncode = secrets.randbelow(900000) + 100000\nprint("6-digit OTP generated:", 100000 <= code <= 999999)`, '`random` Mersenne Twister bashorat qilinishi mumkin.', '`random` is not cryptographically secure.', 'Token va OTP uchun faqat `secrets` ishlating.', 'Use `secrets` for all security randomness.'),
      mistake('Eski `datetime.utcnow()` ishlatish', 'Deprecated Naive utcnow()', `# datetime.utcnow() lacks tzinfo and warns in Python 3.12+`, 'Naive datetime causes timezone offset bugs', `from datetime import datetime, timezone\nnow = datetime.now(timezone.utc)\nprint("TZ:", now.tzinfo)`, 'Naive `utcnow()` da `tzinfo` yo‘q.', 'Naive datetimes cause subtle bugs.', 'Doim `datetime.now(timezone.utc)` yozing.', 'Use `datetime.now(timezone.utc)`.'),
    ],
    compareTitleUz: '`random` vs `secrets`',
    compareTitleEn: '`random` vs `secrets`',
    compareUz: ['`random`: o‘yinlar, simulyatsiyalar, deterministik `random.seed()` testlari.', '`secrets`: API kalitlar, parol reset tokenlari, sessiya ID lari.'],
    compareEn: ['`random`: games, simulations, reproducible `seed()` experiments.', '`secrets`: tokens, passwords, OTPs, session IDs.'],
    compareSummaryUz: 'Simulyatsiyada `random`, xavfsizlikda faqat `secrets` tanlang.',
    compareSummaryEn: 'Use `random` for simulations and `secrets` for security.',
    practiceTasks: [
      pt('p0804_1', '1-mashq: `Counter.most_common`', 'Task 1: Top Word', '`Counter(["a", "b", "a"]).most_common(1)` chiqaring.', 'Find top item.', `from collections import Counter\nprint(Counter(["a", "b", "a"]).most_common(1))`, "[('a', 2)]", 'most_common(1)', 'Print result.'),
      pt('p0804_2', '2-mashq: `timedelta`', 'Task 2: Add 5 Days', '`date(2026, 1, 1) + timedelta(days=5)` ni `.isoformat()` qiling.', 'Add 5 days.', `from datetime import date, timedelta\nprint((date(2026, 1, 1) + timedelta(days=5)).isoformat())`, '2026-01-06', 'timedelta(days=5)', 'Prints 2026-01-06.'),
      pt('p0804_3', '3-mashq: `secrets.token_hex`', 'Task 3: Secure Token Length', '`len(secrets.token_hex(8))` chiqaring (`16`).', 'Check 8-byte hex token length.', `import secrets\nprint(len(secrets.token_hex(8)))`, '16', '8 bytes = 16 hex chars.', 'Prints 16.'),
      pt('p0804_4', '4-mashq: `hashlib.sha256`', 'Task 4: SHA-256 Length', '`len(hashlib.sha256(b"hi").hexdigest())` chiqaring.', 'Check SHA-256 digest length.', `import hashlib\nprint(len(hashlib.sha256(b"hi").hexdigest()))`, '64', '256 bits = 64 hex chars.', 'Prints 64.'),
      pt('p0804_5', '5-mashq: `statistics.median`', 'Task 5: Median', '`statistics.median([10, 2, 30])` chiqaring.', 'Compute median.', `import statistics\nprint(statistics.median([10, 2, 30]))`, '10', 'statistics.median', 'Prints 10.'),
    ],
    quiz: [
      q('q0804_1', 'API token yoki parol tiklash kodi yaratish uchun to‘g‘ri modul?', 'Correct module for API tokens or OTPs?', ['random', 'math', 'secrets', 'uuid1'], ['random', 'math', 'secrets', 'uuid1'], 2, '`secrets` kriptoxavfsiz tasodifiy sonlar beradi.', '`secrets` provides CSPRNG values.'),
      q('q0804_2', 'Python 3.12+ da UTC hozirgi vaqtni olishning to‘g‘ri usuli?', 'Recommended UTC timestamp in Python 3.12+?', ['datetime.utcnow()', 'datetime.now(timezone.utc)', 'time.gmtime()', 'date.today()'], ['datetime.utcnow()', 'datetime.now(timezone.utc)', 'time.gmtime()', 'date.today()'], 1, '`datetime.now(timezone.utc)`.', '`datetime.now(timezone.utc)`.'),
      q('q0804_3', 'Elementlar sonini sanash uchun tayyor `collections` klassi?', 'Class in `collections` for counting frequencies?', ['ChainMap', 'Counter', 'deque', 'OrderedDict'], ['ChainMap', 'Counter', 'deque', 'OrderedDict'], 1, '`Counter`.', '`Counter`.'),
      q('q0804_4', '`hashlib.sha256(...).hexdigest()` necha belgili satr qaytaradi?', 'Character length of SHA-256 `hexdigest()`?', ['32', '40', '64', '128'], ['32', '40', '64', '128'], 2, '256 bit = 64 hex belgi.', '64 hex characters.'),
      q('q0804_5', '`defaultdict(list)` nima qiladi?', 'What does `defaultdict(list)` do on missing key access?', ['KeyError beradi', 'None qaytaradi', 'Avtomatik yangi [] yaratib qaytaradi', 'Xato o‘chiradi'], ['KeyError', 'None', 'Auto-initializes a fresh []', 'Deletes key'], 2, 'Avtomatik bo‘sh `[]` yaratadi.', 'Auto-creates `[]`.'),
    ],
    homework: hw('Stdlib Bilimlar Jamlanmasi', 'Stdlib Power Utility', '`datetime`, `secrets`, `Counter` va `statistics` modullarini bitta skriptda ishlatib, talabalar faolligi statistikasi va xavfsiz sessiya tokeni yarating.', 'Combine `datetime`, `secrets`, `Counter`, and `statistics` to summarize user activity and issue a secure session token.', ['4 ta stdlib moduli', 'timezone.utc + secrets'], ['Use 4 stdlib modules', 'Use timezone.utc + secrets'], 'expires = datetime.now(timezone.utc) + timedelta(hours=2)', 'Build UTC expiry.', 'Token xeshini (`sha256`) saqlab tekshiring.', 'Hash token via sha256.', 20),
    reviewCheckpoint: review(
      16,
      'Review Loyiha #16: Stdlib Telemetry & Secure Token Engine (80-Dars Marrasi)',
      'Review Project #16: Stdlib Telemetry & Token Auditor',
      '80-dars marrasi! Hech qanday tashqi kutubxonasiz faqat Python Standard Library (`collections.Counter`, `statistics`, `datetime`, `secrets`, `hashlib`) yordamida xavfsiz log va sessiya tahlilchisini quring.',
      '80-lesson milestone! Build a zero-dependency telemetry analyzer and secure token issuer purely with Python’s Standard Library.',
      ['`Counter` bilan top-2 eventlarni topish', '`statistics.mean` bilan o‘rtacha javob vaqtini hisoblash', '`secrets.token_urlsafe` + `sha256` + `timezone.utc` muddati'],
      ['Rank top events via `Counter`', 'Compute mean latency via `statistics.mean`', 'Issue & hash secure UTC-expiring tokens'],
      `import hashlib, secrets, statistics
from collections import Counter
from datetime import datetime, timedelta, timezone

events = ["GET /home", "POST /login", "GET /home", "GET /api"]
latencies_ms = [12, 48, 15, 25]
token = secrets.token_urlsafe(16)
token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
exp = datetime(2026, 11, 20, tzinfo=timezone.utc) + timedelta(days=1)

print("Top endpoint:", Counter(events).most_common(1)[0])
print("Avg latency ms:", statistics.mean(latencies_ms))
print("Hash len:", len(token_hash), "| Expires:", exp.strftime("%Y-%m-%d"))`,
    ),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-08-05',
    courseId: 'modules_packages',
    moduleId: 'c08_m2',
    order: 5,
    titleUz: 'Packages — papkalar daraxtida modullarni tashkil etish',
    titleEn: 'Packages: `__init__.py`, Subpackages & Relative Imports',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-08-04'],
    conceptId: 'packages_concept',
    whyUz: "Loyihada 20 ta `.py` fayl bo‘lganda hammasi bitta papkada tursa chalkashlik boshlanadi. **Package** — bu `__init__.py` orqali birlashtirilgan modullar papkasidir (`app/auth/jwt.py`, `app/db/models.py`).",
    whyEn: 'Packages group related modules into nested folder hierarchies (`app/auth/jwt.py`) with `__init__.py` controlling package initialization and re-exports.',
    analogyUz: "Modul — bu bitta kitob; **Package** — bu bo‘limlarga bo‘lingan javon (`app/auth/`). `__init__.py` — esa javon oldidagi mundarija bo‘lib, ichkaridagi muhim narsalarni tashqariga qisqa yo‘l bilan chiqaradi!",
    analogyEn: 'A module is one book; a package is a labeled bookshelf (`app/auth/`) whose `__init__.py` serves as the front index.',
    stopsUz: "Paket ichidagi faylda relative import (`from .utils import clean`) ishlatilsa, o‘sha faylni to‘g‘ridan-to‘g‘ri `python pkg/sub.py` deb yurgizib bo‘lmaydi (`ImportError: attempted relative import with no known parent package`)! Paketni doim **`python -m pkg.sub`** tarzida ishga tushiring!",
    stopsEn: 'Never execute a submodule file directly (`python pkg/sub.py`) when it uses relative imports—run it via **`python -m pkg.sub`** from the project root!',
    objUz: ['Regular package (`__init__.py` bor) vs Namespace package farqini tushunish', '`__init__.py` da qulay re-export yozish (`from .core import Engine`)', 'Absolute (`from mypkg.utils import f`) vs Relative (`from .utils import f`) importlarni va `python -m` ni bilish'],
    objEn: ['Structure regular packages with `__init__.py` and clean subpackages', 'Re-export key symbols cleanly in `__init__.py`', 'Contrast absolute vs relative imports and run modules with `python -m`'],
    theoryUz: `### 1. Package Tuzilmasi
\`\`\`text
shop/
  __init__.py
  pricing.py
  orders/
    __init__.py
    invoice.py
\`\`\`
### 2. \`__init__.py\` Nima Uchun Kerak?
1) Papkani aniq regular package qiladi.
2) Qulay API re-export: \`shop/__init__.py\` da \`from .pricing import calc_total\` yozsangiz, tashqarida \`from shop import calc_total\` ishlaydi!
### 3. Absolute vs Relative Import
- **Absolute**: \`from shop.pricing import calc_total\` (PEP 8 tavsiya etadi!)
- **Relative**: \`from .pricing import calc_total\` (1 nuqta — shu papka), \`from ..models import Item\` (2 nuqta — ota papka).
### 4. \`python -m package.module\`
Relative importlar faqat \`-m\` (module mode) da to‘g‘ri ishlaydi!`,
    theoryEn: `### 1. Package Layout
Nested directories containing \`__init__.py\`.
### 2. Re-exports in \`__init__.py\`
Surface internal submodule symbols at the package root cleanly.
### 3. Absolute vs Relative Imports
PEP 8 prefers absolute imports (\`from pkg.sub import x\`); relative dots (\`.\`, \`..\`) tie neatly inside refactoring subpackages.
### 4. Running via \`python -m\`
Required when executing submodules containing relative imports.`,
    examples: [
      ex('Misol 1: Temp papkada real Package (`__init__.py` + submodule) yaratib import qilish', 'Example 1: Creating & Importing a Package', `import sys, tempfile\nfrom pathlib import Path\n\nwith tempfile.TemporaryDirectory() as root:\n    pkg = Path(root) / "minishop"\n    pkg.mkdir()\n    (pkg / "math_ops.py").write_text("def double(x): return x * 2", encoding="utf-8")\n    (pkg / "__init__.py").write_text("from .math_ops import double\\n__all__ = ['double']", encoding="utf-8")\n    sys.path.insert(0, root)\n    try:\n        import minishop\n        print("Re-exported:", minishop.double(21), "| pkg:", minishop.__package__)\n    finally:\n        sys.path.remove(root)\n        sys.modules.pop("minishop", None)\n        sys.modules.pop("minishop.math_ops", None)`, `Re-exported: 42 | pkg: minishop`, '`__init__.py` ichidagi relative import `double` ni `minishop` darajasiga chiqardi.', '`__init__.py` re-exported `double` cleanly from `.math_ops`.'),
      ex('Misol 2: `importlib.resources` / paket tuzilma tekshiruvi', 'Example 2: Checking Package Attributes', `import collections\nprint("Package:", collections.__package__, "| Has __path__?", hasattr(collections, "__path__"))`, `Package: collections | Has __path__? True`, 'Oddiy moduldan farqli o‘laroq, **package** da `__path__` atributi mavjud bo‘ladi.', 'Packages expose `__path__`, unlike single-file modules.'),
      ex('Misol 3: Absolute import afzalligi (PEP 8)', 'Example 3: Absolute Submodule Access', `import xml.etree.ElementTree as ET\nel = ET.Element("item", id="1")\nprint(el.tag, el.attrib)`, `item {'id': '1'}`, 'Stdlib da ham `xml.etree.ElementTree` ko‘rinishidagi subpackage ierarxiyasi ishlatiladi.', 'Subpackages organize large libraries cleanly via dotted paths.'),
    ],
    traceTitleUz: 'Package import izi',
    traceTitleEn: 'Tracing Package __init__.py Load',
    traceCode: `import collections.abc as cabc\nprint(cabc.__package__, hasattr(cabc, "Mapping"))`,
    traceSteps: [
      traceStep(1, 'import collections.abc', 'loads collections/__init__.py first', 'Avval ota __init__.py yuklandi', 'Loaded parent package first'),
      traceStep(2, 'collections.abc', '__package__="collections"', 'Submodul bog‘landi', 'Bound subpackage module', 'collections True'),
    ],
    commonMistakes: [
      mistake('Relative importli faylni `python pkg/sub.py` deb to‘g‘ridan-to‘g‘ri yurgizish', 'Running Submodule Script Directly', `# python pkg/sub.py with "from .helper import f" -> ImportError!`, 'ImportError: attempted relative import with no known parent package', `print("Always run packages from root as: python -m pkg.sub")`, 'To‘g‘ridan-to‘g‘ri run qilganda `__package__` `None` bo‘ladi.', 'Direct script execution sets `__package__ = None`.', 'Har doim ildiz papkadan `python -m pkg.sub` yurgizing.', 'Execute via `python -m pkg.sub`.'),
      mistake('`__init__.py` ichiga og‘ir ishlar (DB ulanish, HTTP so‘rov) qo‘yish', 'Heavy Side Effects in __init__.py', `# __init__.py running connect_db() slows every single test import!`, 'Slow imports and fragile circular errors', `print("Keep __init__.py minimal: clean re-exports and version constants only!")`, '`__init__.py` har qanday ichki modul import qilinganda birinchi ishga tushadi.', '`__init__.py` executes whenever any submodule is imported.', '`__init__.py` ni faqat re-export va metadata uchun ishlating.', 'Keep `__init__.py` lightweight.'),
    ],
    compareTitleUz: 'Absolute Import vs Relative Import',
    compareTitleEn: 'Absolute vs Relative Imports',
    compareUz: ['Absolute (`from shop.orders import pay`): har doim aniq, PEP 8 tavsiya etadi, to‘g‘ridan-to‘g‘ri skriptlarda ham ishlaydi.', 'Relative (`from .orders import pay`): ichki subpackage ni ko‘chirganda qulay, lekin `python -m` talab qiladi.'],
    compareEn: ['Absolute: clear full path, PEP 8 default.', 'Relative: concise intra-package paths, requires `-m` execution.'],
    compareSummaryUz: 'Asosiy kodda absolute import (`from mypkg.sub import fn`), `__init__.py` da qisqa relative re-export ishlating.',
    compareSummaryEn: 'Use absolute imports across modules and concise relative imports inside `__init__.py`.',
    practiceTasks: [
      pt('p0805_1', '1-mashq: `__path__` tekshiruvi', 'Task 1: Check __path__', '`import csv, json`: qaysi birida `__path__` borligini chiqaring.', 'Packages have __path__.', `import csv, json\nprint(hasattr(csv, "__path__"), hasattr(json, "__path__"))`, 'False True', 'csv is a module, json is a package.', 'Prints False True.'),
      pt('p0805_2', '2-mashq: Subpackage import', 'Task 2: Dotted Import', '`from email.utils import parseaddr` bilan `parseaddr("Ali <ali@uz.dev>")[1]` ni chiqaring.', 'Extract email address from subpackage.', `from email.utils import parseaddr\nprint(parseaddr("Ali <ali@uz.dev>")[1])`, 'ali@uz.dev', 'parseaddr(...)[1]', 'Prints ali@uz.dev.'),
      pt('p0805_3', '3-mashq: Temp package yaratish', 'Task 3: Temp Package', 'Temp papkada `p1/__init__.py` (`X = 7`) yaratib import qiling.', 'Import temp package.', `import sys, tempfile\nfrom pathlib import Path\nwith tempfile.TemporaryDirectory() as r:\n    (Path(r) / "p1").mkdir()\n    (Path(r) / "p1" / "__init__.py").write_text("X = 7", encoding="utf-8")\n    sys.path.insert(0, r)\n    try:\n        import p1\n        print(p1.X)\n    finally:\n        sys.path.remove(r)\n        sys.modules.pop("p1", None)`, '7', 'Create p1/__init__.py', 'Prints 7.'),
      pt('p0805_4', '4-mashq: `__package__` atributi', 'Task 4: Inspect __package__', '`import email.message` da `email.message.__package__` ni chiqaring.', 'Print subpackage parent name.', `import email.message\nprint(email.message.__package__)`, 'email', 'email.message.__package__', 'Prints email.'),
      pt('p0805_5', '5-mashq: Relative import nuqtalari', 'Task 5: Relative Dot Rule', '`from .a import b` va `from ..c import d` nimani bildirishini stringda chiqaring.', 'Verify dot meanings.', `dots = {".": "same", "..": "parent"}\nprint(dots["."], dots[".."])`, 'same parent', '1 dot = same, 2 dots = parent.', 'Print values.'),
    ],
    quiz: [
      q('q0805_1', 'Oddiy Python paketini (regular package) belgilovchi maxsus fayl?', 'File marking a directory as a regular Python package?', ['package.json', '__init__.py', 'mod.py', 'setup.ini'], ['package.json', '__init__.py', 'mod.py', 'setup.ini'], 1, '`__init__.py`.', '`__init__.py`.'),
      q('q0805_2', 'Relative import (`from .utils import f`) ishlatilgan submodulni qanday ishga tushirish shart?', 'How to execute a submodule containing relative imports?', ['python pkg/sub.py', 'python -m pkg.sub', 'python sub.py', 'import *'], ['python pkg/sub.py', 'python -m pkg.sub', 'python sub.py', 'import *'], 1, '`python -m pkg.sub` tarzida.', '`python -m pkg.sub`.'),
      q('q0805_3', 'Qaysi atribut paket (`package`) ni oddiy `.py` moduldan ajratadi?', 'Attribute present on packages but absent on plain file modules?', ['__name__', '__doc__', '__path__', '__file__'], ['__name__', '__doc__', '__path__', '__file__'], 2, '`__path__`.', '`__path__`.'),
      q('q0805_4', '`from ..models import User` dagi ikkita nuqta `..` nimani anglatadi?', 'What does `..` mean in `from ..models import User`?', ['Hozirgi papka', 'Bir pog‘ona yuqori (ota) papka', 'Ildiz disk', 'Xato sintaksis'], ['Current dir', 'Parent package', 'Root drive', 'Invalid'], 1, 'Ota (parent) paket.', 'Parent package.'),
      q('q0805_5', 'PEP 8 qaysi import uslubini standart sifatida tavsiya qiladi?', 'Import style recommended by PEP 8?', ['Wildcard *', 'Absolute importlar', 'Relative faqat', 'Inline'], ['Wildcard *', 'Absolute imports', 'Relative only', 'Inline'], 1, 'Absolute importlar.', 'Absolute imports.'),
    ],
    homework: hw('Ko‘p Qatlamli `myapp` Paketini Qurish', 'Build Nested Package Layout', 'Temp papkada `myapp/__init__.py`, `myapp/core/calc.py` va `myapp/utils/fmt.py` strukturasi bilan real subpackage yarating va `sys.path` orqali `from myapp import ...` bilan test qiling.', 'Create `myapp/__init__.py`, `myapp/core/calc.py`, and `myapp/utils/fmt.py` in temp dir with clean re-exports and import tests.', ['2 ta subpackage', 'Re-export __init__.py da'], ['2 subpackages', 'Clean re-exports'], 'from .core.calc import add', 'Re-export cleanly.', 'Test tugagach `sys.path` va `sys.modules` ni tozalang.', 'Clean sys.path in finally.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-08-06',
    courseId: 'modules_packages',
    moduleId: 'c08_m2',
    order: 6,
    titleUz: '`pip` — PyPI ekotizimi, Semantic Versioning va paket xavfsizligi',
    titleEn: '`pip` Package Manager, PyPI, SemVer & Supply-Chain Safety',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-08-05'],
    conceptId: 'pip_package_manager',
    whyUz: "PyPI (Python Package Index) da 500 000+ tayyor kutubxona bor (`fastapi`, `pytest`, `pandas`, `httpx`). Lekin noto‘g‘ri `pip` buyrug‘i yoki `typosquatting` (soxta nomli paket) loyihangizni buzishi mumkin!",
    whyEn: '`pip` connects Python to 500,000+ PyPI packages. Mastering `python -m pip`, Semantic Versioning (`MAJOR.MINOR.PATCH`), and lockfiles keeps builds reproducible.',
    analogyUz: "**PyPI** — bu Python dasturchilari uchun ulkan ilovalar do‘koni; **`pip`** — esa paketlarni xavfsiz yuklab, versiyalar mosligini tekshirib o‘rnatuvchi menejer!",
    analogyEn: 'PyPI is the Python library store; `pip` is the package installer managing downloads, dependencies, and version compatibility.',
    stopsUz: "Har doim oddiy `pip install ...` o‘rniga **`python -m pip install ...`** yozing! Shunda tizimdagi boshqa Python versiyasiga emas, aynan hozirgi faol `python` (va `venv`) muhitiga o‘rnatilishiga 100% kafolat bo‘ladi.",
    stopsEn: 'Always run `python -m pip install ...` instead of bare `pip install` so packages install strictly into your active Python/venv interpreter.',
    objUz: ['`python -m pip install`, `uninstall`, `list`, `show`, `freeze` buyruqlarini bilish', 'Semantic Versioning (`MAJOR.MINOR.PATCH`) va versiya chegaralarini (`==`, `>=`, `<`, `~=`) o‘qish', '`importlib.metadata` bilan o‘rnatilgan paket versiyalarini tekshirish va typosquatting xavfini bilish'],
    objEn: ['Use `python -m pip` commands (`install`, `list`, `show`, `freeze`, `uninstall`)', 'Interpret Semantic Versioning (`MAJOR.MINOR.PATCH`) and specifiers (`==`, `~=`, `<`)', 'Inspect installed distributions via `importlib.metadata` and guard against typosquatting'],
    theoryUz: `### 1. Asosiy \`pip\` Buyruqlari (Terminalda)
- \`python -m pip install fastapi\` — o‘rnatish
- \`python -m pip install "httpx>=0.27,<1.0"\` — versiya oralig‘i bilan
- \`python -m pip list\` / \`pip show pytest\` — tekshirish
- \`python -m pip freeze > requirements.txt\` — aniq versiyalarni saqlash
### 2. Semantic Versioning (\`MAJOR.MINOR.PATCH\`, masalan \`2.14.1\`)
- **MAJOR** (\`2 -> 3\`): eski kodni buzuvchi (breaking) o‘zgarish
- **MINOR** (\`14 -> 15\`): yangi imkoniyat (eski kod ishlayveradi)
- **PATCH** (\`1 -> 2\`): faqat bug-fix va xavfsizlik yamog‘i
### 3. Versiya Chegaralari
- \`==2.1.0\`: qatʼiy bitta versiya
- \`~=2.1.0\`: \`>=2.1.0, <2.2.0\` (patch yangilanishlar xavfsiz!)
- \`>=2.0,<3.0\`: 3.0 breaking o‘zgarishdan himoya
### 4. Typosquatting Xavfi
\`pip install reqeusts\` (noto‘g‘ri imlo!) zararli paket o‘rnatishi mumkin — nomini PyPI da doim tekshiring!`,
    theoryEn: `### 1. Core \`python -m pip\` Commands
\`install\`, \`uninstall\`, \`list\`, \`show\`, \`freeze\`, \`check\`.
### 2. Semantic Versioning (\`MAJOR.MINOR.PATCH\`)
MAJOR breaks compatibility; MINOR adds backward-compatible features; PATCH fixes bugs/security.
### 3. Version Specifiers
\`==\` (exact pin), \`~=\` (compatible release), \`>=x,<y\` (upper-bounded range).
### 4. Inspecting Metadata in Code
Use \`importlib.metadata.version("pip")\` cleanly in Python 3.8+.`,
    examples: [
      ex('Misol 1: `importlib.metadata` bilan muhit paketlarini tekshirish', 'Example 1: Checking Installed Package Versions', `from importlib import metadata\n\ndists = sorted(d.metadata["Name"] for d in metadata.distributions())\nprint("Distributions list ok:", isinstance(dists, list))\nprint("Count >= 0:", len(dists) >= 0)`, `Distributions list ok: True\nCount >= 0: True`, '`importlib.metadata` Python 3.8+ da o‘rnatilgan paketlar va versiyalarini o‘qiydi.', '`importlib.metadata` queries installed package metadata cleanly.'),
      ex('Misol 2: SemVer versiya taqqoslash mantiqi', 'Example 2: Parsing Semantic Versions', `def parse_semver(ver: str) -> tuple[int, int, int]:\n    major, minor, patch = (int(x) for x in ver.split("."))\n    return (major, minor, patch)\n\ncur = parse_semver("2.14.1")\nprint("Compatible with >=2.10,<3.0?", (2, 10, 0) <= cur < (3, 0, 0))`, `Compatible with >=2.10,<3.0? True`, 'Tuple taqqoslash `MAJOR.MINOR.PATCH` tartibini aniq tekshiradi.', 'Numeric tuple comparison evaluates SemVer ranges accurately.'),
      ex('Misol 3: `pip` CLI buyruqlar shablonini tuzish (`shlex`)', 'Example 3: Safe pip Command Templates', `import shlex\ncmds = [\n    "python -m pip install --upgrade pip",\n    "python -m pip install 'fastapi>=0.110,<1.0'",\n    "python -m pip check",\n]\nfor c in cmds:\n    print(shlex.split(c))`, `['python', '-m', 'pip', 'install', '--upgrade', 'pip']\n['python', '-m', 'pip', 'install', 'fastapi>=0.110,<1.0']\n['python', '-m', 'pip', 'check']`, '`python -m pip` va `pip check` bog‘liqliklar mosligini tekshiradi.', 'Standard safe `python -m pip` workflow commands.'),
    ],
    traceTitleUz: 'SemVer taqqoslash izi',
    traceTitleEn: 'Tracing SemVer Range Check',
    traceCode: `v = tuple(int(x) for x in "1.4.2".split("."))\nprint((1, 4, 0) <= v < (1, 5, 0))`,
    traceSteps: [
      traceStep(1, '"1.4.2".split(".")', '(1, 4, 2)', 'Int tuple ga o‘girildi', 'Parsed integer tuple'),
      traceStep(2, '(1, 4, 0) <= (1, 4, 2) < (1, 5, 0)', 'True', 'Compatible ~=1.4.0 sharti bajarildi', 'Matched ~=1.4.0 range', 'True'),
    ],
    commonMistakes: [
      mistake('`pip` o‘rniga `python -m pip` ishlatmaslik', 'Running Bare pip Across Multiple Pythons', `# Bare 'pip install pkg' may target global Python 3.10 instead of active venv 3.12!`, 'ModuleNotFoundError when running python app.py', `print("Always run: python -m pip install <package>")`, 'Bir nechta Python versiyasi bo‘lganda bare `pip` boshqa muhitga o‘rnatishi mumkin.', 'Bare `pip` can point to a different Python installation.', '`python -m pip` shaklini odat qiling.', 'Always prefix with `python -m`.'),
      mistake('Tashqi paketlarni versiyasiz (`fastapi`) qoldirish', 'Unpinned Production Dependencies', `# requirements.txt with just 'fastapi' may auto-upgrade to breaking major v2!`, 'Unexpected production breakage on fresh deploy', `print("Pin ranges or exact versions: fastapi>=0.110,<1.0")`, 'Vaqt o‘tib yangi MAJOR versiya eski kodingizni buzishi mumkin.', 'Unbounded specs pull breaking MAJOR releases.', 'Kamida `<NEXT_MAJOR` chegarasini qo‘ying.', 'Add upper bounds or exact locks.'),
    ],
    compareTitleUz: '`pip install pkg` vs `python -m pip install pkg`',
    compareTitleEn: '`pip` vs `python -m pip`',
    compareUz: ['`pip`: PATH dagi birinchi `pip` ni chaqiradi (baʼzan noto‘g‘ri Python!).', '`python -m pip`: aynan hozirgi `python` ga bog‘liq `pip` ni kafolatli chaqiradi.'],
    compareEn: ['`pip`: uses whichever executable PATH resolves first.', '`python -m pip`: guaranteed match with your active Python interpreter.'],
    compareSummaryUz: 'Har doim `python -m pip` dan foydalaning va versiyalarni SemVer qoidasiga ko‘ra chegaralang.',
    compareSummaryEn: 'Standardize on `python -m pip` and bound dependencies via Semantic Versioning.',
    practiceTasks: [
      pt('p0806_1', '1-mashq: SemVer parse', 'Task 1: Parse SemVer', '`"3.12.4"` ni `(3, 12, 4)` tuple ga o‘girib chiqaring.', 'Parse SemVer string to int tuple.', `print(tuple(int(x) for x in "3.12.4".split(".")))`, '(3, 12, 4)', 'Split and int().', 'Prints (3, 12, 4).'),
      pt('p0806_2', '2-mashq: `~=` oralig‘i', 'Task 2: Compatible Release ~=', '`(2, 1, 9)` versiya `~=2.1.0` (`>=2.1.0, <2.2.0`) ga kirishini tekshiring.', 'Check ~=2.1.0 match.', `v = (2, 1, 9)\nprint((2, 1, 0) <= v < (2, 2, 0))`, 'True', 'Check tuple range.', 'Prints True.'),
      pt('p0806_3', '3-mashq: `importlib.metadata`', 'Task 3: Distributions Count', '`len(list(metadata.distributions())) >= 0` ni chiqaring.', 'Check distributions list.', `from importlib import metadata\nprint(len(list(metadata.distributions())) >= 0)`, 'True', 'metadata.distributions()', 'Prints True.'),
      pt('p0806_4', '4-mashq: Buyruq shakllantirish', 'Task 4: Safe pip Command', '`pkgs = ["pytest", "httpx"]` uchun `"python -m pip install pytest httpx"` chiqaring.', 'Build python -m pip command.', `pkgs = ["pytest", "httpx"]\nprint("python -m pip install " + " ".join(pkgs))`, 'python -m pip install pytest httpx', 'Join pkgs.', 'Print command.'),
      pt('p0806_5', '5-mashq: Major o‘zgarish filtri', 'Task 5: Detect Breaking Bump', '`old=(1,4,2)`, `new=(2,0,0)` da `new[0] > old[0]` chiqaring.', 'Check major version bump.', `old, new = (1, 4, 2), (2, 0, 0)\nprint(new[0] > old[0])`, 'True', 'Compare index 0.', 'Prints True.'),
    ],
    quiz: [
      q('q0806_1', 'SemVer (`2.14.1`) dagi `2` raqami nimani bildiradi?', 'What does `2` represent in `2.14.1`?', ['Patch', 'Minor', 'Major (breaking o‘zgarishlar)', 'Beta'], ['Patch', 'Minor', 'Major (breaking changes)', 'Beta'], 2, 'MAJOR versiya.', 'MAJOR version.'),
      q('q0806_2', 'Nima uchun `python -m pip install ...` buyrug‘i afzal?', 'Why prefer `python -m pip install`?', ['Tezroq', 'Aynan hozirgi Python/venv muhitiga o‘rnatishini kafolatlaydi', 'Internet siz ishlaydi', 'Sudo so‘raydi'], ['Faster', 'Guarantees target matches active Python/venv', 'Offline', 'Uses sudo'], 1, 'Faol Python muhiti bilan 100% mos tushadi.', 'Targets exact active Python interpreter.'),
      q('q0806_3', '`pip freeze` buyrug‘ining vazifasi?', 'What does `pip freeze` output?', ['Paketlarni o‘chiradi', 'O‘rnatilgan paketlar va aniq versiyalar ro‘yxatini', 'Xeshlarni', 'Testlarni'], ['Uninstalls', 'Exact pinned packages and versions', 'Hashes', 'Tests'], 1, 'O‘rnatilgan paketlarning `name==version` ro‘yxatini.', 'Exact `name==version` list.'),
      q('q0806_4', '`~=1.4.2` versiya spetsifikatsiyasi qaysi oraliqni bildiradi?', 'What range does `~=1.4.2` allow?', ['>=1.4.2, <2.0.0', '>=1.4.2, <1.5.0', '==1.4.2', '<1.4.2'], ['>=1.4.2, <2.0.0', '>=1.4.2, <1.5.0', '==1.4.2', '<1.4.2'], 1, '`>=1.4.2, <1.5.0` (faqat patch yangilanishlar).', '`>=1.4.2, <1.5.0`.'),
      q('q0806_5', 'Paket nomini 1 harf xato yozganda zararli paket tushib qolishi qanday ataladi?', 'Malicious lookalike package name attack is called?', ['SQL Injection', 'Typosquatting', 'Phishing', 'Overflow'], ['SQL Injection', 'Typosquatting', 'Phishing', 'Overflow'], 1, 'Typosquatting.', 'Typosquatting.'),
    ],
    homework: hw('SemVer Tekshiruvchi va `requirements` Tahlilchisi', 'SemVer & Requirements Validator', 'Berilgan `requirements` satrlari (`"fastapi>=0.110,<1.0"`, `"pytest==8.2.0"`) ni tahlil qilib, paket nomi va versiya chegaralarini ajratuvchi hamda hozirgi versiyani tekshiruvchi skript tuzing.', 'Write a parser for `requirements.txt` specs (`"fastapi>=0.110,<1.0"`, `"pytest==8.2.0"`) extracting package names and validating candidate SemVer tuples.', ['SemVer tuple solishtirish', 'Kamida 3 ta test spetsifikatsiyasi'], ['Compare SemVer tuples', 'Test 3+ specs'], 'tuple(int(p) for p in ver.split("."))', 'Convert string versions to tuples.', 'Komment (`#`) va bo‘sh satrlarni eʼtiborsiz qoldiring.', 'Ignore blank/comment lines.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),
];
