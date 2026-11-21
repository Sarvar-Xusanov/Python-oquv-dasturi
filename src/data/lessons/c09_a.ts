import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C09_PART1_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-09-01',
    courseId: 'oop',
    moduleId: 'c09_m1',
    order: 1,
    titleUz: 'OOP nima va nima uchun kerak?',
    titleEn: 'Why Object-Oriented Programming (OOP)? Modeling Data + Behavior',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-08-12'],
    conceptId: 'oop_intro',
    whyUz: "Oddiy lug‘at va funksiyalar 50 qatorgacha yetadi, lekin 50 ta foydalanuvchi, bank hisobi, buyurtma va to‘lov qoidasi aralashganda ma’lumot (`dict`) bilan uni o‘zgartiruvchi kod (`def`) ajralib ketadi. OOP ma’lumot va harakatni bitta **Obyekt** ichida birlashtiradi!",
    whyEn: 'Procedural dicts and loose functions scatter business rules. OOP bundles state (attributes) and behavior (methods) into cohesive domain objects.',
    analogyUz: "Procedural kod — bu stol ustidagi bo‘sh anketa qog‘ozlari (`{\"balans\": 100}`) va alohida qoidalar papkasi (kim xohlasa `balans = -999` qilib buzib qo‘yishi mumkin). **OOP** — esa puli ham, \"yechib olish\" qoidasi ham o‘z ichida muhrlangan aqlli bank kartasi!",
    analogyEn: 'Procedural dicts leave data exposed for any function to corrupt; OOP pairs the data and its validity rules inside one self-contained object.',
    stopsUz: "OOP har doim ham majburiy emas! Oddiy matematik formula yoki 20 qatorli ETL skript uchun oddiy funksiya yetarli; **uzoq umrli holat (state) + qoidalar** (User, BankAccount, GameEntity, APIClient) uchun esa OOP tengsiz!",
    stopsEn: 'Don’t force classes onto simple stateless utilities—use OOP when encapsulating persistent state together with invariant-enforcing behavior.',
    objUz: ['Procedural (data + functions separate) vs OOP (data + methods bundled) farqini ko‘rish', 'OOP ning 4 ta ustunini (Encapsulation, Inheritance, Polymorphism, Abstraction) umumiy tushunish', 'Qachon oddiy funksiya, qachon `class` yozish kerakligini ajratish'],
    objEn: ['Contrast procedural dict+function code against cohesive OOP classes', 'Preview the 4 pillars of OOP (Encapsulation, Inheritance, Polymorphism, Abstraction)', 'Decide cleanly between plain functions and classes'],
    theoryUz: `### 1. Procedural Muammosi
\`account = {"owner": "Ali", "balance": 100}\` da ixtiyoriy joyda \`account["balance"] = -500\` deb qoidani buzish mumkin.
### 2. OOP Yondashuvi: Holat + Xulq-Atvor
\`BankAccount\` sinfi ichida ham \`balance\` ma’lumoti, ham \`deposit()\` / \`withdraw()\` tekshiruvlari birga yashaydi!
### 3. OOP ning 4 ta Asosiy Ustuni
1. **Encapsulation**: ma’lumot va qoidani bir joyda yashirish/himoyalash
2. **Inheritance**: umumiy xususiyatlarni meros olish
3. **Polymorphism**: bir xil metod nomi, har xil obyektda o‘zicha ishlashi
4. **Abstraction**: murakkab ichki mexanizmni oddiy interfeys ortida berkitish
### 4. Python da Hamma Narsa Obyekt!
\`"salom".upper()\`, \`[1, 2].append(3)\`, hatto \`def\` funksiyalari ham Python da obyektlardir!
### 5. Keng tarqalgan xato
Hech qanday holat saqlamaydigan 1 ta funksiyani bekorga \`class Helper:\` ichiga tiqish.`,
    theoryEn: `### 1. Limits of Loose Dicts
Raw dicts cannot enforce invariants on their own mutations.
### 2. Objects = State + Behavior
Bundle attributes and validation methods in one class.
### 3. The 4 Pillars of OOP
Encapsulation, Inheritance, Polymorphism, Abstraction.
### 4. Everything Is an Object in Python
Strings, lists, ints, and functions are all class instances.
### 5. Over-Engineering Trap
Avoid single-method "God/Util" classes when a plain function is cleaner.`,
    examples: [
      ex('Misol 1: Procedural dict vs OOP BankAccount himoyasi', 'Example 1: Procedural Dict vs OOP Class', `class BankAccount:\n    def __init__(self, owner: str, balance: float = 0):\n        self.owner = owner\n        self.balance = balance\n    def withdraw(self, amt: float) -> None:\n        if amt <= 0 or amt > self.balance:\n            raise ValueError("Invalid withdrawal")\n        self.balance -= amt\n\nacc = BankAccount("Aziz", 100)\nacc.withdraw(40)\nprint(acc.owner, "balance:", acc.balance)`, `Aziz balance: 60`, 'Balans va yechish qoidasi bitta `BankAccount` obyektida himoyalangan.', 'State and withdrawal invariant stay bundled inside `BankAccount`.'),
      ex('Misol 2: Python da hamma narsa obyekt ekanini ko‘rish', 'Example 2: Everything Is an Object', `for val in [42, "py", [1, 2], len]:\n    print(type(val).__name__, "isinstance object?", isinstance(val, object))`, `int isinstance object? True\nstr isinstance object? True\nlist isinstance object? True\nbuiltin_function_or_method isinstance object? True`, 'Python dagi barcha qiymatlar umumiy `object` bazasidan kelib chiqadi.', 'Every Python value is an instance of a class inheriting from `object`.'),
      ex('Misol 3: Bir nechta mustaqil obyektlar', 'Example 3: Independent Object Instances', `class Counter:\n    def __init__(self, name: str):\n        self.name = name\n        self.val = 0\n    def inc(self):\n        self.val += 1\n\nc1, c2 = Counter("clicks"), Counter("views")\nc1.inc(); c1.inc(); c2.inc()\nprint(c1.val, c2.val)`, `2 1`, 'Har bir obyekt o‘zining alohida holatini saqlaydi.', 'Each instance maintains isolated state.'),
    ],
    traceTitleUz: 'Obyekt holati va metodi izi',
    traceTitleEn: 'Tracing Object State Transition',
    traceCode: `class Box:\n    def __init__(self, n):\n        self.n = n\n    def add(self, k):\n        self.n += k\n\nb = Box(10)\nb.add(5)\nprint(b.n)`,
    traceSteps: [
      traceStep(1, 'b = Box(10)', 'b.n = 10', 'Obyekt yaratildi', 'Created Box instance'),
      traceStep(2, 'b.add(5)', 'b.n = 15', 'Metod ichki holatni yangiladi', 'Updated instance attribute'),
      traceStep(3, 'print(b.n)', '15', 'Natija chiqdi', 'Printed 15', '15'),
    ],
    commonMistakes: [
      mistake('Stateless oddiy funksiyani bekorga `class` ga o‘rash', 'Needless Wrapper Class Anti-Pattern', `class MathHelper:\n    def add(self, a, b):\n        return a + b\nprint(MathHelper().add(2, 3))`, 'Unnecessary boilerplate with zero stored state', `def add(a: int, b: int) -> int:\n    return a + b\nprint(add(2, 3))`, 'Hech qanday `self` holati bo‘lmagan class — shunchaki niqoblangan funksiya.', 'A class with no state and one method should be a plain function.', 'Holat + qoidalar bo‘lgandagina `class` yarating.', 'Use `class` when modeling state + behavior.'),
      mistake('Obyekt atributlarini to‘g‘ridan-to‘g‘ri qoidasiz o‘zgartirish', 'Bypassing Class Rules Directly', `# Directly writing acc.balance = -500 breaks domain invariants!`, 'Corrupts object invariants', `print("Expose methods like deposit()/withdraw() that enforce rules!")`, 'Metodlar validatsiya qiladi, tashqi to‘g‘ridan-to‘g‘ri yozish esa chetlab o‘tadi.', 'Raw writes bypass invariant checks.', 'O‘zgarishlarni metodlar orqali boshqaring.', 'Route mutations through validating methods.'),
    ],
    compareTitleUz: 'Procedural (`dict` + `def`) vs OOP (`class`)',
    compareTitleEn: 'Procedural vs OOP',
    compareUz: ['Procedural: oddiy transformatsiyalar, bir martalik skriptlar, ETL konveyerlar.', 'OOP: holat saqlovchi uzoq umrli obyektlar (User, Cart, Engine, API Client).'],
    compareEn: ['Procedural: pure transforms and simple scripts.', 'OOP: stateful entities enforcing domain invariants over time.'],
    compareSummaryUz: 'Stateless hisoblarda `def`, holat va qoidalar birlashgan modellar uchun esa OOP (`class`) ishlating.',
    compareSummaryEn: 'Use plain functions for stateless transforms and OOP classes for stateful domain entities.',
    practiceTasks: [
      pt('p0901_1', '1-mashq: `isinstance(..., object)`', 'Task 1: Everything Is Object', '`isinstance("py", object)` va `isinstance(len, object)` ni chiqaring.', 'Verify built-ins inherit object.', `print(isinstance("py", object), isinstance(len, object))`, 'True True', 'All values inherit from object.', 'Prints True True.'),
      pt('p0901_2', '2-mashq: Oddiy holatli `class`', 'Task 2: Simple Stateful Class', '`Lamp` klassiga `on=False` va `toggle()` yozing.', 'Build toggling Lamp class.', `class Lamp:\n    def __init__(self):\n        self.on = False\n    def toggle(self):\n        self.on = not self.on\nl = Lamp()\nl.toggle()\nprint(l.on)`, 'True', 'self.on = not self.on', 'Prints True.'),
      pt('p0901_3', '3-mashq: Ikki mustaqil nusxa', 'Task 3: Two Instances', 'Ikkita `Lamp` yaratib faqat bittasini yoqing.', 'Verify instance isolation.', `class Lamp:\n    def __init__(self): self.on = False\n    def turn_on(self): self.on = True\na, b = Lamp(), Lamp()\na.turn_on()\nprint(a.on, b.on)`, 'True False', 'Two distinct objects.', 'Prints True False.'),
      pt('p0901_4', '4-mashq: Qoida himoyasi', 'Task 4: Invariant Guard', '`Score` klassi manfiy ballga `ValueError` bersin.', 'Reject negative score.', `class Score:\n    def __init__(self, v):\n        if v < 0: raise ValueError("neg")\n        self.v = v\ntry:\n    Score(-5)\nexcept ValueError as e:\n    print(e)`, 'neg', 'raise ValueError in __init__', 'Prints neg.'),
      pt('p0901_5', '5-mashq: `type().__name__`', 'Task 5: Inspect Class Name', '`type(10).__name__` va `type({}).__name__` chiqaring.', 'Print built-in class names.', `print(type(10).__name__, type({}).__name__)`, 'int dict', 'type(x).__name__', 'Prints int dict.'),
    ],
    quiz: [
      q('q0901_1', 'OOP dasturlashning asosiy g‘oyasi nima?', 'Core idea of Object-Oriented Programming?', ['Hamma kodni bitta qatorga yozish', 'Ma’lumot (state) va uni boshqaruvchi metodlarni bitta obyektda birlashtirish', 'Faqat global o‘zgaruvchilar', 'Funksiyalarni o‘chirish'], ['One-liners', 'Bundling state and behavior together inside objects', 'Globals only', 'Removing functions'], 1, 'Ma’lumot va metodlarni birlashtirish.', 'Bundling state and behavior.'),
      q('q0901_2', 'Qaysi 4 ta tushuncha OOP ning 4 ustuni hisoblanadi?', 'Which 4 concepts are the pillars of OOP?', ['List, Dict, Set, Tuple', 'Encapsulation, Inheritance, Polymorphism, Abstraction', 'Try, Except, Else, Finally', 'Git, Pip, Venv, Ruff'], ['List, Dict, Set, Tuple', 'Encapsulation, Inheritance, Polymorphism, Abstraction', 'Try, Except, Else, Finally', 'Git, Pip, Venv, Ruff'], 1, 'Encapsulation, Inheritance, Polymorphism, Abstraction.', 'The 4 OOP pillars.'),
      q('q0901_3', 'Python da `int`, `str`, `list` va funksiyalar `object` dan meros oladimi?', 'Are ints, strings, lists, and functions all objects in Python?', ['Yo‘q', 'Ha, barchasi object', 'Faqat class lar', 'Faqat str'], ['No', 'Yes, everything is an object', 'Only user classes', 'Only strings'], 1, 'Ha, hamma narsa `object`.', 'Yes, everything is an object.'),
      q('q0901_4', 'Qachon `class` o‘rniga oddiy funksiya yozish yaxshiroq?', 'When is a plain function better than a class?', ['Hech qanday holat (state) saqlamaydigan oddiy hisob-kitoblarda', 'Har doim', 'Database modellarida', 'Foydalanuvchi profilida'], ['Stateless utility calculations', 'Always', 'DB models', 'User entities'], 0, 'Stateless utilitalar uchun oddiy `def` toza.', 'Use plain functions for stateless utilities.'),
      q('q0901_5', 'OOP ning qaysi ustuni ichki murakkablikni yashirib sodda interfeys beradi?', 'Which OOP pillar hides internal complexity behind a clean interface?', ['Abstraction', 'Recursion', 'Unpacking', 'Slicing'], ['Abstraction', 'Recursion', 'Unpacking', 'Slicing'], 0, 'Abstraction.', 'Abstraction.'),
    ],
    homework: hw('Procedural Kodni OOP ga O‘girish', 'Refactor Procedural Cart to OOP', 'Oddiy `cart = []` va alohida funksiyalarni `ShoppingCart` klassiga aylantiring: `.add_item(name, price, qty)`, `.total()` va manfiy narx/miqdorda `ValueError` chiqarsin.', 'Refactor loose cart functions into a `ShoppingCart` class enforcing positive prices/quantities and computing `.total()`.', ['Validatsiya metodlar ichida', 'Kamida 2 ta alohida savat obyekti'], ['Validate inputs in methods', 'Test 2 separate carts'], 'if price <= 0 or qty <= 0: raise ValueError(...)', 'Guard invariants.', 'Chegirma (`apply_coupon`) metodini ham qo‘shing.', 'Add discount method.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-09-02',
    courseId: 'oop',
    moduleId: 'c09_m1',
    order: 2,
    titleUz: 'Class va Object — qolipdan nusxa yaratish va Review #18',
    titleEn: 'Classes & Objects: Blueprints, Instances & Review #18',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-09-01'],
    conceptId: 'class_object',
    whyUz: "`class` — bu meʼmorning uy chizmasi (blueprint). Bitta chizmadan 100 ta alohida uy (`Object` / `Instance`) qurishingiz mumkin: har biri alohida manzilga (`id()`) va o‘z rangiga ega bo‘ladi!",
    whyEn: 'A `class` is the blueprint; instantiating it (`User(...)`) constructs independent runtime objects (`instances`) checked via `isinstance()`.',
    analogyUz: "`class Car:` — bu zavod chizmasi (bitta). `car1 = Car()`, `car2 = Car()` — esa chizma asosida chiqqan 2 ta haqiqiy mashina: birining oynasi sinsa ikkinchisiga taʼsir qilmaydi!",
    analogyEn: '`class Car:` is the blueprint; `car1` and `car2` are separate cars rolled off the factory line.',
    stopsUz: "PEP 8 bo‘yicha **Class nomlari har doim `PascalCase`** (`BankAccount`, `UserProfile`) da, funksiya va obyekt o‘zgaruvchilari esa `snake_case` (`user_profile`) da yoziladi! Shuningdek `type(x) == Parent` o‘rniga doim **`isinstance(x, Parent)`** ishlating!",
    stopsEn: 'PEP 8 uses `PascalCase` for class names and `snake_case` for instances. Prefer `isinstance(obj, Class)` over `type(obj) == Class` so subclasses match cleanly.',
    objUz: ['`PascalCase` bilan `class` eʼlon qilish va nusxa (instance) yaratish', '`isinstance(obj, Cls)` vs `type(obj) is Cls` farqini bilish', 'Obyektlar xotirada mustaqil (`obj1 is obj2` -> `False`) ekanini ko‘rish'],
    objEn: ['Declare `PascalCase` classes and instantiate objects', 'Prefer `isinstance()` over exact `type()` checks', 'Observe object identity (`is`) and instance namespaces (`__dict__`)'],
    theoryUz: `### 1. Class va Instance Farqi
- **Class**: \`class Student:\` — shablon (xotirada 1 marta taʼriflanadi).
- **Object / Instance**: \`s1 = Student("Ali")\` — chizmadan yaratilgan jonli obyekt.
### 2. PEP 8 Nomlash Qoidasi
Klasslar: \`PascalCase\` (\`HTTPClient\`, \`OrderItem\`). O‘zgaruvchilar: \`snake_case\` (\`order_item\`).
### 3. \`isinstance()\` vs \`type() ==\`
\`isinstance(dog, Animal)\` merosxo‘rlikni ham hisobga olib \`True\` beradi; \`type(dog) is Animal\` esa \`False\` beradi!
### 4. \`obj.__dict__\`
Har bir oddiy Python obyekti o‘z atributlarini ichki \`__dict__\` lug‘atida saqlaydi!
### 5. Keng tarqalgan xato
Klassni chaqirishda qavslarni \`s = Student\` deb unutib, nusxa o‘rniga klassning o‘zini o‘zgaruvchiga berib qo‘yish.`,
    theoryEn: `### 1. Blueprint vs Instance
\`class User:\` defines the blueprint; \`u = User(...)\` allocates an independent instance.
### 2. PEP 8 Naming
Use \`PascalCase\` for classes, \`snake_case\` for instances and methods.
### 3. \`isinstance()\` vs \`type()\`
\`isinstance()\` respects inheritance hierarchies; \`type()\` ignores subclasses.
### 4. Instance \`__dict__\`
Objects store their instance attributes inside \`obj.__dict__\`.
### 5. Missing Parentheses
Writing \`u = User\` aliases the class itself rather than creating an object.`,
    examples: [
      ex('Misol 1: Class dan bir nechta Object va `__dict__`', 'Example 1: Instantiation & __dict__', `class CourseCard:\n    def __init__(self, code: str, title: str):\n        self.code = code\n        self.title = title\n\nc1 = CourseCard("PY-09", "OOP")\nc2 = CourseCard("PY-10", "Advanced")\nprint("Same object?", c1 is c2, "| isinstance?", isinstance(c1, CourseCard))\nprint("c1 dict:", c1.__dict__)`, `Same object? False | isinstance? True\nc1 dict: {'code': 'PY-09', 'title': 'OOP'}`, 'Har bir obyekt alohida xotira va o‘z `__dict__` lug‘atiga ega.', 'Each instance owns an isolated `__dict__` namespace.'),
      ex('Misol 2: `isinstance()` bilan ko‘p tur tekshiruvi', 'Example 2: isinstance with Tuples & Subclasses', `class Base: pass\nclass Child(Base): pass\n\nobj = Child()\nprint("type is Base?", type(obj) is Base)\nprint("isinstance Base?", isinstance(obj, Base))`, `type is Base? False\nisinstance Base? True`, '`isinstance()` merosxo‘rlikni to‘g‘ri taniydi.', '`isinstance()` recognizes subclass relationships accurately.'),
      ex('Misol 3: Dinamik sinf nomi va ro‘yxatda obyektlar', 'Example 3: Collection of Objects', `class Tag:\n    def __init__(self, label: str):\n        self.label = label\n\ntags = [Tag("python"), Tag("oop")]\nprint([t.label for t in tags])`, `['python', 'oop']`, 'Obyektlarni ro‘yxat va lug‘atlarda saqlab siklda boshqarish oson.', 'Collections of custom objects compose naturally with comprehensions.'),
    ],
    traceTitleUz: 'Instantiation izi',
    traceTitleEn: 'Tracing Object Creation',
    traceCode: `class Dog:\n    def __init__(self, name):\n        self.name = name\nd = Dog("Rex")\nprint(d.name, isinstance(d, Dog))`,
    traceSteps: [
      traceStep(1, 'd = Dog("Rex")', 'alloc instance', 'Yangi obyekt xotirada ochildi', 'Allocated new Dog instance'),
      traceStep(2, '__init__(d, "Rex")', "d.name = 'Rex'", 'Atribut biriktirildi', 'Set instance attribute'),
      traceStep(3, 'print(...)', 'Rex True', 'Natija chiqdi', 'Printed Rex True', 'Rex True'),
    ],
    commonMistakes: [
      mistake('Qavssiz klass yozib obyekt yaratdim deb o‘ylash', 'Forgetting Parentheses on Instantiation', `class User:\n    def __init__(self): self.name = "Ali"\nu = User\nprint(u.name)`, "AttributeError: type object 'User' has no attribute 'name'", `class User:\n    def __init__(self): self.name = "Ali"\nu = User()\nprint(u.name)`, '`u = User` yangi obyekt yaratmaydi — klassning o‘zini ko‘rsatadi.', 'Without `()`, `u` references the class blueprint itself.', 'Obyekt yaratishda doim `User()` deb qavs qo‘ying.', 'Always include `()` when instantiating.'),
      mistake('Klass nomini kichik harfda (`class user_profile:`) yozish', 'Lowercase Class Name Violation', `# class user_profile: breaks PEP 8 distinction between functions and classes`, 'Confuses callers reading user_profile()', `class UserProfile:\n    pass\nprint(UserProfile.__name__)`, 'PEP 8 bo‘yicha funksiyalar `snake_case`, klasslar `PascalCase` bo‘ladi.', 'PEP 8 separates `PascalCase` classes from `snake_case` functions.', '`UserProfile` kabi `PascalCase` ishlating.', 'Name classes in `PascalCase`.'),
    ],
    compareTitleUz: '`isinstance(x, Cls)` vs `type(x) == Cls`',
    compareTitleEn: '`isinstance()` vs `type() ==`',
    compareUz: ['`isinstance(x, Cls)`: merosxo‘r klasslarni va `isinstance(x, (int, float))` tuple larni qo‘llaydi (tavsiya!).', '`type(x) is Cls`: faqat aniq o‘sha klassni tekshirish kerak bo‘lgan kamyob holatlarda.'],
    compareEn: ['`isinstance()`: respects subclasses and accepts tuple of types (standard).', '`type() is`: exact-class match only.'],
    compareSummaryUz: 'Tur tekshirishda doim `isinstance()` va klass nomlarida `PascalCase` qoidasiga amal qiling.',
    compareSummaryEn: 'Use `PascalCase` for class names and `isinstance()` for type checks.',
    practiceTasks: [
      pt('p0902_1', '1-mashq: Obyekt yaratish', 'Task 1: Instantiate Book', '`Book(title)` klassidan `b = Book("Python")` yaratib `b.title` chiqaring.', 'Create Book instance.', `class Book:\n    def __init__(self, title):\n        self.title = title\nb = Book("Python")\nprint(b.title)`, 'Python', 'Book("Python")', 'Print b.title.'),
      pt('p0902_2', '2-mashq: `isinstance`', 'Task 2: Check isinstance', '`isinstance(b, Book)` ni chiqaring.', 'Verify isinstance.', `class Book: pass\nb = Book()\nprint(isinstance(b, Book))`, 'True', 'isinstance(b, Book)', 'Prints True.'),
      pt('p0902_3', '3-mashq: Mustaqil identifikatsiya', 'Task 3: Distinct Objects', '`Book() is Book()` `False` chiqishini tasdiqlang.', 'Verify two instances differ.', `class Book: pass\nprint(Book() is Book())`, 'False', 'Two separate allocations.', 'Prints False.'),
      pt('p0902_4', '4-mashq: `.__dict__` tekshiruvi', 'Task 4: Inspect __dict__', '`Box(5)` obyektining `.__dict__` ini chiqaring.', 'Print instance __dict__.', `class Box:\n    def __init__(self, x): self.x = x\nprint(Box(5).__dict__)`, "{'x': 5}", 'Box(5).__dict__', 'Prints dict.'),
      pt('p0902_5', '5-mashq: Tuple bilan `isinstance`', 'Task 5: Tuple Type Check', '`isinstance(3.5, (int, float))` chiqaring.', 'Check numeric tuple.', `print(isinstance(3.5, (int, float)))`, 'True', '(int, float)', 'Prints True.'),
    ],
    quiz: [
      q('q0902_1', 'PEP 8 bo‘yicha Python klass nomlari qaysi uslubda yoziladi?', 'PEP 8 naming convention for classes?', ['snake_case', 'PascalCase', 'UPPER_CASE', 'kebab-case'], ['snake_case', 'PascalCase', 'UPPER_CASE', 'kebab-case'], 1, '`PascalCase` (CapWords).', '`PascalCase`.'),
      q('q0902_2', 'Obyekt sinfning yoki uning vorisining nusxasi ekanini tekshirishning to‘g‘ri usuli?', 'Recommended function to check object class membership?', ['type(x) == Cls', 'isinstance(x, Cls)', 'x.class == Cls', 'is_a(x, Cls)'], ['type(x) == Cls', 'isinstance(x, Cls)', 'x.class == Cls', 'is_a(x, Cls)'], 1, '`isinstance(x, Cls)`.', '`isinstance(x, Cls)`.'),
      q('q0902_3', 'Har bir obyektning o‘z atributlari qaysi ichki lug‘atda saqlanadi?', 'Internal dictionary storing an object’s instance attributes?', ['__vars__', '__dict__', '__attrs__', '__self__'], ['__vars__', '__dict__', '__attrs__', '__self__'], 1, '`__dict__`.', '`__dict__`.'),
      q('q0902_4', '`a = Car()` va `b = Car()` uchun `a is b` natijasi?', 'Result of `a is b` for two `Car()` calls?', ['True', 'False', 'None', 'Error'], ['True', 'False', 'None', 'Error'], 1, 'Har biri alohida obyekt -> `False`.', 'Two distinct objects -> `False`.'),
      q('q0902_5', '`u = User` (qavssiz) yozish nima qiladi?', 'What does `u = User` without `()` do?', ['Yangi obyekt yaratadi', 'Klassning o‘ziga havola beradi (alias)', 'Xato chiqaradi', 'None beradi'], ['Creates instance', 'Aliases the class object itself', 'Raises error', 'Returns None'], 1, 'Klass obyektining o‘zini beradi.', 'References the class itself.'),
    ],
    homework: hw('Talabalar Ro‘yxati Modellari', 'Student Record Class', '`Student(name, group, grades=None)` klassini tuzib, 3 ta talaba obyektini yarating, `isinstance` bilan tekshiring va har birining `.__dict__` holatini chiqaring.', 'Define `Student(name, group, grades=None)` (using `None` sentinel), create 3 instances, and print each instance’s state.', ['PascalCase klass nomi', 'grades=None sentinel'], ['Use PascalCase', 'Safe None sentinel for grades'], 'self.grades = [] if grades is None else grades.copy()', 'Avoid shared lists.', 'Eng yaxshi talabani `max(students, key=...)` bilan toping.', 'Find top student with `max()`.', 20),
    reviewCheckpoint: review(
      18,
      'Review Loyiha #18: Mahsulot Katalogi Obyektlari (Course 8 + OOP Kirish)',
      'Review Project #18: Typed OOP Catalog Entities',
      '90-dars marrasi! Loyiha tuzilmasi, Type Hints va ilk OOP klasslarini birlashtirib, katalog mahsulotlarini obyektlar ko‘rinishida boshqaruvchi mini-dvigatel yarating.',
      '90-lesson milestone! Combine typed modules and OOP classes to manage a structured product catalog.',
      ['`Product(sku: str, title: str, price: float)` klassi', 'Manfiy narxda `ValueError` validatsiyasi', 'Obyektlar ro‘yxatini narx bo‘yicha `sorted(..., key=lambda p: p.price)` saralash'],
      ['Typed `Product` class', 'Reject non-positive prices with `ValueError`', 'Sort instances cleanly by `.price`'],
      `class Product:
    def __init__(self, sku: str, title: str, price: float) -> None:
        if price <= 0:
            raise ValueError("Price must be positive")
        self.sku = sku
        self.title = title
        self.price = price

items = [Product("P1", "Keyboard", 49.0), Product("P2", "Mouse", 19.5)]
for item in sorted(items, key=lambda p: p.price):
    print(f"{item.sku}: {item.title} = {item.price}")`,
    ),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-09-03',
    courseId: 'oop',
    moduleId: 'c09_m2',
    order: 3,
    titleUz: 'Attributes va Methods — obyekt xususiyatlari va harakatlari',
    titleEn: 'Attributes & Methods: Instance, Class & Static Methods',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-09-02'],
    conceptId: 'attributes_methods',
    whyUz: "Klass ichida 3 xil metod yozish mumkin: oddiy **instance method (`self`)**, muqobil konstruktor **class method (`@classmethod`, `cls`)** va yordamchi **static method (`@staticmethod`)**. Ularni to‘g‘ri ajratish professional OOP kodining belgisidir!",
    whyEn: 'Distinguishing instance methods (`self`), `@classmethod` alternative constructors (`cls`), and `@staticmethod` helpers keeps object APIs clean and extensible.',
    analogyUz: "`self` metodi — bu bitta aniq mashinani haydash (`car.drive()`). `@classmethod` — bu zavoddan maxsus model buyurtma qilish (`Car.from_json(raw)`). `@staticmethod` — esa ustaxonadagi umumiy formula (`Car.km_to_miles(100)`).",
    analogyEn: 'Instance methods operate on *this* car; `@classmethod` builds a car from another format (`cls(...)`); `@staticmethod` is a related utility formula.',
    stopsUz: "Har bir instance metodining 1-parametri **albatta `self`** bo‘lishi shart! `obj.method(x)` yozganingizda Python uni yashirincha `Class.method(obj, x)` ga aylantiradi — agar `def method():` deb `self` yozmasangiz `TypeError: takes 0 positional arguments but 1 was given` chiqadi!",
    stopsEn: 'Every instance method receives the instance automatically as its first argument (`self`). Omitting `self` raises `TypeError: takes 0 positional arguments but 1 was given`.',
    objUz: ['Data attributes (`self.x`) va Instance methods (`def act(self):`) yozish', '`@classmethod` (`cls`) bilan muqobil konstruktorlar (`from_string`, `from_dict`) yaratish', '`@staticmethod` bilan obyektga bog‘liq lekin `self`/`cls` siz yordamchi funksiyalar yozish'],
    objEn: ['Define instance attributes and methods taking `self`', 'Build alternative constructors via `@classmethod` (`cls`)', 'Place stateless class-scoped helpers in `@staticmethod`'],
    theoryUz: `### 1. Instance Method (\`self\`)
Obyekt holatini (\`self.balance\`) o‘qiydi yoki o‘zgartiradi: \`def deposit(self, amt): ...\`.
### 2. \`@classmethod\` (\`cls\`) — Muqobil Konstruktor
\`cls\` — bu klassning o‘zi (\`User\`, yoki merosxo‘r \`Admin\`). \`User.from_csv("Ali,22")\` kabi qo‘shimcha yaratish yo‘llari uchun ideal!
### 3. \`@staticmethod\` — Bog‘liq Yordamchi
\`self\` ham, \`cls\` ham olmaydi — shunchaki shu klass mavzusiga tegishli tekshiruv (\`User.is_valid_email(s)\`).
### 4. Keng tarqalgan xato
Metod ichida \`self\` ni unutish (\`def show():\`) -> \`TypeError\`.`,
    theoryEn: `### 1. Instance Methods (\`self\`)
Read or mutate per-instance state via \`self\`.
### 2. \`@classmethod\` (\`cls\`)
Receives the class itself—ideal for alternative constructors like \`from_dict()\` that work properly with subclasses.
### 3. \`@staticmethod\`
Namespace-scoped utility taking neither \`self\` nor \`cls\`.
### 4. Pitfall
Forgetting \`self\` in method signatures causes \`TypeError\` on call.`,
    examples: [
      ex('Misol 1: Instance, `@classmethod` va `@staticmethod` bir klassda', 'Example 1: All 3 Method Kinds Together', `class Temperature:\n    def __init__(self, celsius: float):\n        self.celsius = celsius\n\n    def to_fahrenheit(self) -> float:\n        return round(self.celsius * 9 / 5 + 32, 1)\n\n    @classmethod\n    def from_fahrenheit(cls, f: float):\n        return cls(round((f - 32) * 5 / 9, 1))\n\n    @staticmethod\n    def is_freezing(celsius: float) -> bool:\n        return celsius <= 0\n\nt = Temperature.from_fahrenheit(68)\nprint("C:", t.celsius, "| F:", t.to_fahrenheit(), "| Freezing(-2)?", Temperature.is_freezing(-2))`, `C: 20.0 | F: 68.0 | Freezing(-2)? True`, '`from_fahrenheit` `cls(...)` orqali yangi `Temperature` obyektini yaratdi.', '`@classmethod` built an instance from Fahrenheit; `@staticmethod` checked threshold.'),
      ex('Misol 2: Method Chaining (`return self`)', 'Example 2: Fluent Method Chaining', `class QueryBuilder:\n    def __init__(self, table: str):\n        self.table = table\n        self.filters = []\n    def where(self, cond: str):\n        self.filters.append(cond)\n        return self\n    def build(self) -> str:\n        return f"SELECT * FROM {self.table} WHERE " + " AND ".join(self.filters)\n\nsql = QueryBuilder("users").where("active=1").where("age>=18").build()\nprint(sql)`, `SELECT * FROM users WHERE active=1 AND age>=18`, '`return self` metodlarni zanjir qilib chaqirishga imkon beradi.', 'Returning `self` supports fluent `.where().where()` chaining.'),
      ex('Misol 3: `cls` merosxo‘rlikda ham ishlashi', 'Example 3: Subclass-Safe @classmethod', `class User:\n    def __init__(self, name: str): self.name = name\n    @classmethod\n    def from_str(cls, s: str): return cls(s.strip())\n\nclass Admin(User): pass\n\na = Admin.from_str("  Zarina  ")\nprint(a.name, type(a).__name__)`, `Zarina Admin`, '`cls` ishlatilgani uchun `Admin.from_str(...)` aynan `Admin` obyektini qaytardi!', '`cls(...)` automatically constructs `Admin` when called on the subclass.'),
    ],
    traceTitleUz: '`self` yashirin uzatilishi izi',
    traceTitleEn: 'Tracing Implicit self Binding',
    traceCode: `class K:\n    def hi(self, x): return f"{type(self).__name__}:{x}"\nk = K()\nprint(k.hi(7))`,
    traceSteps: [
      traceStep(1, 'k.hi(7)', 'K.hi(k, 7)', 'Python k ni avtomatik self ga uzatdi', 'Bound k to self automatically'),
      traceStep(2, 'return "K:7"', 'K:7', 'Natija qaytdi', 'Returned K:7', 'K:7'),
    ],
    commonMistakes: [
      mistake('Instance metodida `self` parametrini yozmaslik', 'Missing self in Method Definition', `class Bot:\n    def ping():\n        return "pong"\nBot().ping()`, 'TypeError: Bot.ping() takes 0 positional arguments but 1 was given', `class Bot:\n    def ping(self):\n        return "pong"\nprint(Bot().ping())`, 'Obyekt orqali chaqirilganda Python birinchi argument qilib obyektni (`self`) beradi.', 'Instance calls pass the instance as arg 1 automatically.', 'Instance metodlariga har doim `self` qo‘ying.', 'Always include `self` as first parameter.'),
      mistake('Muqobil konstruktorda `cls(...)` o‘rniga klass nomini hardcode qilish', 'Hardcoding Class Name in @classmethod', `class Base:\n    @classmethod\n    def make(cls): return Base()  # Breaks subclasses!`, 'Returns Base instead of Child subclass', `class Base:\n    @classmethod\n    def make(cls): return cls()\nclass Child(Base): pass\nprint(type(Child.make()).__name__)`, '`Base()` yozsangiz `Child.make()` ham `Base` qaytarib qo‘yadi.', 'Hardcoding `Base()` breaks polymorphic factory calls.', 'Doim `cls(...)` chaqiring.', 'Always instantiate via `cls(...)`.'),
    ],
    compareTitleUz: 'Instance vs `@classmethod` vs `@staticmethod`',
    compareTitleEn: 'Instance vs `@classmethod` vs `@staticmethod`',
    compareUz: ['Instance (`self`): obyekt ma’lumotlari bilan ishlaganda.', '`@classmethod` (`cls`): muqobil konstruktorlar (`from_json`, `from_env`) uchun.', '`@staticmethod`: `self` va `cls` kerak bo‘lmagan bog‘liq yordamchi formula uchun.'],
    compareEn: ['Instance (`self`): operates on object state.', '`@classmethod` (`cls`): alternative constructors & class-level state.', '`@staticmethod`: related stateless helper.'],
    compareSummaryUz: 'Holatga teginsa instance metod, muqobil yaratuvchi bo‘lsa `@classmethod`, holatsiz yordamchi bo‘lsa `@staticmethod` tanlang.',
    compareSummaryEn: 'Choose instance methods for state, `@classmethod` for factory constructors, and `@staticmethod` for stateless helpers.',
    practiceTasks: [
      pt('p0903_1', '1-mashq: Instance method', 'Task 1: Instance Method', '`Rect(w, h)` klassiga `.area()` metodi yozib `Rect(4, 5).area()` chiqaring.', 'Add .area() method.', `class Rect:\n    def __init__(self, w, h): self.w, self.h = w, h\n    def area(self): return self.w * self.h\nprint(Rect(4, 5).area())`, '20', 'def area(self):', 'Prints 20.'),
      pt('p0903_2', '2-mashq: `@classmethod` konstruktor', 'Task 2: from_pair @classmethod', '`Point(x, y)` ga `from_str("3,4")` `@classmethod` yozing.', 'Create Point via from_str.', `class Point:\n    def __init__(self, x, y): self.x, self.y = x, y\n    @classmethod\n    def from_str(cls, s):\n        x, y = (int(v) for v in s.split(","))\n        return cls(x, y)\np = Point.from_str("3,4")\nprint(p.x + p.y)`, '7', 'return cls(x, y)', 'Prints 7.'),
      pt('p0903_3', '3-mashq: `@staticmethod`', 'Task 3: Static Helper', '`Validator.is_pin("1234")` (4 ta raqam) `@staticmethod` yozing.', 'Write static is_pin check.', `class Validator:\n    @staticmethod\n    def is_pin(s: str) -> bool:\n        return len(s) == 4 and s.isdigit()\nprint(Validator.is_pin("1234"), Validator.is_pin("12a4"))`, 'True False', '@staticmethod without self/cls', 'Prints True False.'),
      pt('p0903_4', '4-mashq: Method chaining', 'Task 4: Chaining return self', '`Acc()` klassida `.add(5).add(3).val` ni chiqaring.', 'Chain add() via return self.', `class Acc:\n    def __init__(self): self.val = 0\n    def add(self, n): self.val += n; return self\nprint(Acc().add(5).add(3).val)`, '8', 'return self', 'Prints 8.'),
      pt('p0903_5', '5-mashq: `cls` voris sinfda', 'Task 5: Subclass cls Check', '`Child` `Parent` dan meros olib `Parent.create()` qilsa `Child` qaytishini tasdiqlang.', 'Verify cls creates Child.', `class Parent:\n    @classmethod\n    def create(cls): return cls()\nclass Child(Parent): pass\nprint(isinstance(Child.create(), Child))`, 'True', 'cls() inside @classmethod', 'Prints True.'),
    ],
    quiz: [
      q('q0903_1', 'Instance metodining birinchi parametri standartda nima deb nomlanadi?', 'Standard first parameter name for instance methods?', ['this', 'self', 'cls', 'obj'], ['this', 'self', 'cls', 'obj'], 1, '`self`.', '`self`.'),
      q('q0903_2', 'Muqobil konstruktorlar (`User.from_dict(...)`) yaratish uchun qaysi dekorator ishlatiladi?', 'Decorator used for alternative constructors?', ['@staticmethod', '@classmethod', '@property', '@init'], ['@staticmethod', '@classmethod', '@property', '@init'], 1, '`@classmethod` (`cls` oladi).', '`@classmethod`.'),
      q('q0903_3', '`@staticmethod` birinchi argument sifatida `self` yoki `cls` oladimi?', 'Does `@staticmethod` receive `self` or `cls` implicitly?', ['self oladi', 'cls oladi', 'Hech qaysinisini olmaydi', 'Ikkalasini'], ['Receives self', 'Receives cls', 'Receives neither', 'Both'], 2, 'Hech qaysinisini olmaydi — oddiy funksiyadek ishlaydi.', 'Receives neither.'),
      q('q0903_4', 'Method chaining (`builder.add(1).add(2)`) ishlashi uchun metod oxirida nima qaytarishi kerak?', 'What must a method return to support chaining?', ['None', 'True', 'self', 'cls'], ['None', 'True', 'self', 'cls'], 2, '`return self`.', '`return self`.'),
      q('q0903_5', '`obj.run()` chaqirilganda `self` unutib qoldirilgan bo‘lsa qaysi xato chiqadi?', 'Error when calling `obj.run()` on `def run():` missing `self`?', ['NameError', 'TypeError', 'AttributeError', 'ValueError'], ['NameError', 'TypeError', 'AttributeError', 'ValueError'], 1, '`TypeError: takes 0 positional arguments but 1 was given`.', '`TypeError`.'),
    ],
    homework: hw('`Money` Valyuta Klassi (`@classmethod` + Chaining)', 'Money Value Class', '`Money(amount: float, currency="UZS")` klassini yozing: `from_string("1500 UZS")` `@classmethod`, `is_positive()` `@staticmethod` va `add_fee(pct)` zanjir metodini qo‘shing.', 'Implement `Money` with `@classmethod from_string`, `@staticmethod is_valid_code`, and fluent `.apply_tax(pct)` chaining.', ['@classmethod va @staticmethod', 'Fluent return self'], ['Use classmethod & staticmethod', 'Return self on apply_tax'], 'amt_s, cur = raw.split()', 'Parse string cleanly.', 'Valyuta kodi 3 ta katta harf ekanini tekshiring.', 'Validate 3-letter currency code.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-09-04',
    courseId: 'oop',
    moduleId: 'c09_m2',
    order: 4,
    titleUz: '`__init__` va `self` — obyekt tug‘ilishi va validatsiya',
    titleEn: '`__init__` & `self`: Initialization, Validation & `__slots__`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-09-03'],
    conceptId: 'init_and_self',
    whyUz: "`__init__` — yangi obyekt dunyoga kelishi bilanoq uning boshlang‘ich holatini sozlaydigan va noto‘g‘ri ma’lumotlarni (`age=-5`, bo‘sh ism) darrov to‘xtatadigan darvozabondir!",
    whyEn: '`__init__` initializes each new instance via `self`, validates invariants immediately upon creation, and never returns a value (`-> None`).',
    analogyUz: "`__init__` — bu tug‘ruqxonadagi hujjat rasmiylashtirish: bola (`self`) allaqachon tug‘ilgan (`__new__` yaratgan), `__init__` esa uning ismi va tug‘ilgan yilini yozib tayyorlaydi!",
    analogyEn: '`__new__` creates the blank object; `__init__` fills out its initial state on `self` and returns `None`.',
    stopsUz: "1) `__init__` har doim **`None` qaytarishi shart** — agar `return 42` yoki `return self` yozsangiz **`TypeError: __init__() should return None`** beradi! 2) `__init__` da ham mutable default (`tags=[]`) TAQIQLANGAN — `tags=None` ishlating!",
    stopsEn: '`__init__` MUST return `None` (never `return self`)—returning anything else raises `TypeError`. Never put mutable defaults (`items=[]`) in `__init__` either!',
    objUz: ['`__init__(self, ...)` da boshlang‘ich atributlar va validatsiya yozish', '`__init__` dan `None` dan boshqa narsa qaytarmaslik qoidasini bilish', 'Ko‘p obyektlar uchun xotirani tejovchi `__slots__` asosini ko‘rish'],
    objEn: ['Initialize and validate attributes cleanly inside `__init__`', 'Never return non-`None` values from `__init__`', 'Optimize high-volume small objects with `__slots__`'],
    theoryUz: `### 1. \`__init__\` Qanday Ishlaydi?
\`User("Ali")\` chaqirilganda:
1. Python yangi bo‘sh \`User\` obyektini yaratadi (\`__new__\`)
2. Avtomatik \`User.__init__(yangi_obyekt, "Ali")\` ni chaqiradi
3. Barcha atributlarni \`self.name = ...\` qilib biriktiradi
### 2. \`__init__\` Hech Narsa Qaytarmaydi!
\`def __init__(self, x) -> None:\` — \`return self\` yozsangiz ham \`TypeError\` chiqadi!
### 3. \`__init__\` Ichida Validatsiya + \`None\` Sentinel
\`\`\`python
class Playlist:
    def __init__(self, title: str, songs: list[str] | None = None) -> None:
        if not title.strip():
            raise ValueError("Title required")
        self.title = title.strip()
        self.songs = [] if songs is None else songs.copy()
\`\`\`
### 4. \`__slots__\` (Xotirani Tejash)
Millionlab \`Point(x, y)\` obyekt yaratganda \`__slots__ = ("x", "y")\` yozilsa, har bir obyekt uchun \`__dict__\` ochilmaydi va RAM 40-50% tejaladi!
### 5. Keng tarqalgan xato
\`__init__\` da \`return self\` yozish yoki \`songs=[]\` default berish.`,
    theoryEn: `### 1. Lifecycle: \`__new__\` -> \`__init__\`
Python allocates the object, invokes \`__init__(self, ...)\`, and hands the object back to the caller.
### 2. Strict \`None\` Return
Returning anything except \`None\` from \`__init__\` raises \`TypeError\`.
### 3. Validation & \`None\` Sentinels
Reject invalid states immediately and copy mutable inputs cleanly.
### 4. Memory Optimization with \`__slots__\`
Declare \`__slots__ = ("x", "y")\` to omit per-instance \`__dict__\`.`,
    examples: [
      ex('Misol 1: Validatsiyali va `None` sentineli bor `__init__`', 'Example 1: Validated __init__ with None Sentinel', `class Playlist:\n    def __init__(self, title: str, tracks: list[str] | None = None) -> None:\n        if not title.strip():\n            raise ValueError("Empty title")\n        self.title = title.strip()\n        self.tracks = [] if tracks is None else tracks.copy()\n\np1 = Playlist("Chill")\np2 = Playlist("Code")\np1.tracks.append("Track A")\nprint("p1:", p1.tracks, "| p2:", p2.tracks)`, `p1: ['Track A'] | p2: []`, 'Har bir pleylist mustaqil `tracks` ro‘yxatini oldi.', 'Each instance initialized an independent `tracks` list.'),
      ex('Misol 2: `self.x = x` ni unutish vs to‘g‘ri bog‘lash', 'Example 2: Binding Attributes to self', `class Wallet:\n    def __init__(self, owner: str, balance: float = 0.0) -> None:\n        if balance < 0:\n            raise ValueError("Negative balance")\n        self.owner = owner\n        self.balance = balance\n\nw = Wallet("Lola", 250.0)\nprint(w.owner, w.balance)`, `Lola 250.0`, '`self.` bilan yozilgan nomlar obyektda saqlanib qoladi.', 'Assigning to `self.<attr>` persists fields on the instance.'),
      ex('Misol 3: `__slots__` bilan ixcham obyekt', 'Example 3: Compact Memory with __slots__', `class Point:\n    __slots__ = ("x", "y")\n    def __init__(self, x: int, y: int) -> None:\n        self.x = x\n        self.y = y\n\np = Point(3, 4)\nprint(p.x, p.y, "| has __dict__?", hasattr(p, "__dict__"))`, `3 4 | has __dict__? False`, '`__slots__` tufayli `__dict__` yaratilmadi va xotira tejaldi.', '`__slots__` eliminated per-instance `__dict__` overhead.'),
    ],
    traceTitleUz: '`__init__` bajarilish izi',
    traceTitleEn: 'Tracing __init__ Execution',
    traceCode: `class User:\n    def __init__(self, name):\n        self.name = name.title()\n\nu = User("ali")\nprint(u.name)`,
    traceSteps: [
      traceStep(1, 'User("ali")', 'alloc raw object', 'Bo‘sh obyekt yaratildi', 'Allocated instance'),
      traceStep(2, 'self.name = name.title()', "u.name = 'Ali'", '__init__ maydonni normallashtirdi', 'Normalized attribute'),
      traceStep(3, 'print(u.name)', 'Ali', 'Chop etildi', 'Printed Ali', 'Ali'),
    ],
    commonMistakes: [
      mistake('`__init__` dan `return self` qaytarish', 'Returning Value from __init__', `class Bad:\n    def __init__(self, x):\n        self.x = x\n        return self\nBad(1)`, 'TypeError: __init__() should return None, not Bad', `class Good:\n    def __init__(self, x) -> None:\n        self.x = x\nprint(Good(1).x)`, '`__init__` hech narsa qaytarmaydi — Python o‘zi obyektni qaytaradi.', '`__init__` must implicitly return `None`.', '`__init__` dan `return <qiymat>` ni olib tashlang.', 'Never return values from `__init__`.'),
      mistake('`self.x = x` o‘rniga `x = x` yozib qo‘yish', 'Forgetting self. Prefix in __init__', `class Bug:\n    def __init__(self, x):\n        x = x\nprint(Bug(5).x)`, "AttributeError: 'Bug' object has no attribute 'x'", `class Fix:\n    def __init__(self, x):\n        self.x = x\nprint(Fix(5).x)`, '`self.` siz `x` faqat lokal o‘zgaruvchi bo‘lib funksiyadan keyin o‘chib ketadi.', 'Without `self.`, `x` vanishes when `__init__` exits.', 'Obyektda qolishi kerak hamma maydonga `self.` qo‘ying.', 'Prefix instance attributes with `self.`.'),
    ],
    compareTitleUz: 'Oddiy `__dict__` klass vs `__slots__`',
    compareTitleEn: 'Standard Class vs `__slots__`',
    compareUz: ['Oddiy klass: moslashuvchan, dinamik atribut qo‘shish mumkin.', '`__slots__`: minglab/millionlab kichik yozuvlarda (2D nuqtalar, tokenlar) RAM ni tejaydi va noto‘g‘ri typo atribut qo‘shilishini bloklaydi.'],
    compareEn: ['Standard class: flexible dynamic attributes via `__dict__`.', '`__slots__`: lower memory overhead and typo protection for high-volume objects.'],
    compareSummaryUz: 'Odatiy klasslarda standart `__init__` (`-> None`), ko‘p sonli kichik ma’lumot obyektlarida esa `__slots__` ishlating.',
    compareSummaryEn: 'Keep `__init__` returning `None` with immediate validation; add `__slots__` for high-volume value objects.',
    practiceTasks: [
      pt('p0904_1', '1-mashq: Validatsiya', 'Task 1: Validate in __init__', '`Circle(r)` `r <= 0` bo‘lsa `ValueError` ko‘tarsin.', 'Guard radius > 0.', `class Circle:\n    def __init__(self, r):\n        if r <= 0: raise ValueError("bad r")\n        self.r = r\ntry:\n    Circle(0)\nexcept ValueError as e:\n    print(e)`, 'bad r', 'if r <= 0: raise', 'Prints bad r.'),
      pt('p0904_2', '2-mashq: `None` sentinel', 'Task 2: Safe List Field', '`Bag(items=None)` da `Bag().items` mustaqil ekanini tekshiring.', 'Use None sentinel in __init__.', `class Bag:\n    def __init__(self, items=None):\n        self.items = [] if items is None else items.copy()\na, b = Bag(), Bag()\na.items.append(1)\nprint(a.items, b.items)`, '[1] []', '[] if items is None', 'Prints [1] [].'),
      pt('p0904_3', '3-mashq: `TypeError` return test', 'Task 3: Non-None __init__', '`return 1` yozilgan `__init__` `TypeError` berishini tuting.', 'Catch __init__ return TypeError.', `class Bad:\n    def __init__(self): return 1\ntry:\n    Bad()\nexcept TypeError:\n    print("caught")`, 'caught', 'except TypeError', 'Prints caught.'),
      pt('p0904_4', '4-mashq: `__slots__`', 'Task 4: Test __slots__', '`__slots__ = ("a",)` li klassda yo‘q `.b = 2` tayinlash `AttributeError` berishini tuting.', 'Verify __slots__ blocks typo attrs.', `class S:\n    __slots__ = ("a",)\n    def __init__(self, a): self.a = a\ns = S(1)\ntry:\n    s.b = 2\nexcept AttributeError:\n    print("blocked")`, 'blocked', 's.b = 2 raises AttributeError', 'Prints blocked.'),
      pt('p0904_5', '5-mashq: Normallashtirish', 'Task 5: Normalize Input', '`User(email)` `self.email` ni `.strip().lower()` qilib saqlasin.', 'Normalize email in __init__.', `class User:\n    def __init__(self, email: str) -> None:\n        self.email = email.strip().lower()\nprint(User("  ALI@UZ.DEV ").email)`, 'ali@uz.dev', 'email.strip().lower()', 'Prints ali@uz.dev.'),
    ],
    quiz: [
      q('q0904_1', '`__init__` metodi nimani qaytarishi shart?', 'What must `__init__` return?', ['self', 'True', 'None', 'dict'], ['self', 'True', 'None', 'dict'], 2, 'Faqat `None`.', 'Always `None`.'),
      q('q0904_2', '`__init__` dan `return self` yozilsa qaysi xato chiqadi?', 'Error raised if `__init__` executes `return self`?', ['ValueError', 'TypeError', 'SyntaxError', 'InitError'], ['ValueError', 'TypeError', 'SyntaxError', 'InitError'], 1, '`TypeError`.', '`TypeError`.'),
      q('q0904_3', '`__init__(self, tags=[])` nima uchun xavfli?', 'Why is `def __init__(self, tags=[])` dangerous?', ['SyntaxError', 'Barcha obyektlar bitta ro‘yxatni baham ko‘radi', 'Sekin', 'Tuple bo‘ladi'], ['SyntaxError', 'All instances share the same default list', 'Slow', 'Becomes tuple'], 1, 'Mutable default barcha nusxalarda umumiy bo‘lib qoladi.', 'Shared mutable default across instances.'),
      q('q0904_4', '`__slots__` ning asosiy foydasi?', 'Primary benefit of `__slots__`?', ['Fayl o‘qish', '__dict__ ochmasdan xotirani tejash', 'JSON aylantirish', 'Meros olish'], ['File I/O', 'Reduces per-instance memory by omitting __dict__', 'JSON export', 'Inheritance'], 1, 'Xotirani tejaydi.', 'Saves RAM by skipping `__dict__`.'),
      q('q0904_5', 'Yangi obyektni xotirada ajratadigan metod (`__init__` dan OLDIN)?', 'Method that allocates the instance before `__init__`?', ['__create__', '__new__', '__alloc__', '__start__'], ['__create__', '__new__', '__alloc__', '__start__'], 1, '`__new__`.', '`__new__`.'),
    ],
    homework: hw('Bank Mijoz Profili (`__init__` + Validatsiya + `__slots__`)', 'Strict Profile Class', '`Customer(name: str, email: str, tags: list[str] | None = None)` klassini tuzing: `__slots__`, `email` da `@` borligini tekshirish, bo‘sh `name` ni rad etish va `tags=None` xavfsiz sentinel bo‘lsin.', 'Implement `Customer` with `__slots__`, email/name validation in `__init__`, and `None` sentinel for `tags`.', ['__slots__ qo‘llash', 'ValueError validatsiyasi'], ['Use __slots__', 'Validate inputs'], '__slots__ = ("name", "email", "tags")', 'Declare all slots.', 'Noto‘g‘ri email berib `ValueError` tutishni test qiling.', 'Test invalid email rejection.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-CS50P-001'],
  }),

  makeLesson({
    id: 'PY-09-05',
    courseId: 'oop',
    moduleId: 'c09_m2',
    order: 5,
    titleUz: 'Instance vs Class Variables — xotira taqsimoti va tuzoqlar',
    titleEn: 'Instance vs Class Variables: Lookup Order & Shared-State Traps',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-09-04'],
    conceptId: 'instance_vs_class_vars',
    whyUz: "Nima uchun `class Dog: tricks = []` deb yozganingizda bitta kuchukka o‘rgatilgan tryuk **barcha** kuchuklarda paydo bo‘lib qoladi? Chunki **Class Variable** hamma obyektlar uchun bitta umumiy o‘zgaruvchidir!",
    whyEn: 'Class attributes are shared across every instance; mutable class attributes (`tricks = []`) cause silent cross-instance corruption unless assigned on `self` in `__init__`.',
    analogyUz: "**Class Variable** — bu sinfxona devoridagi umumiy soat (hamma o‘quvchi bitta soatni ko‘radi). **Instance Variable** — bu har bir o‘quvchining qo‘lidagi shaxsiy daftari!",
    analogyEn: 'A class variable is the shared classroom clock on the wall; instance variables are each student’s private notebook.',
    stopsUz: "1) **Mutable** (`list`, `dict`, `set`) turdagi o‘zgaruvchilarni HECH QACHON class variable qilib joyida `.append()` qilmang — uni `__init__` ichida `self.items = []` qiling! 2) `self.tax_rate = 0.2` deb instance orqali tayinlasangiz, u Class variable ni o‘zgartirmaydi — faqat o‘sha bitta obyektda **yangi instance atribut** ochib yopib (shadowing) qo‘yadi!",
    stopsEn: 'Never mutate a class-level list/dict via `self.items.append()`—it affects all instances! Conversely, `self.rate = 0.2` creates a shadow instance attribute without updating `Class.rate`.',
    objUz: ['Class variables (`RATE = 0.12`, `count = 0`) vs Instance variables (`self.name`) farqini bilish', 'Atribut qidiruv tartibi (`instance.__dict__` -> `Class.__dict__` -> `Parents`) ni tushunish', 'Mutable class variable tuzog‘ini va shadowing ni oldini olish'],
    objEn: ['Distinguish shared class variables from per-instance variables', 'Trace Python attribute lookup: instance -> class -> base classes', 'Prevent mutable class-attribute sharing and accidental shadowing'],
    theoryUz: `### 1. Class Variable vs Instance Variable
- **Class Variable**: klass tanasida (\`class User: role = "member"\`) — konstanta va umumiy hisoblagichlar (\`User.count += 1\`) uchun!
- **Instance Variable**: \`__init__\` ichida \`self.name = name\` — har bir obyektning shaxsiy ma’lumoti.
### 2. Qidiruv Tartibi (\`obj.attr\`)
Python avval \`obj.__dict__\` dan qaraydi; topilmasa \`type(obj).__dict__\` (Klass) dan oladi!
### 3. Shadowing Tuzog‘i
\`u1.role = "vip"\` yozsangiz, \`User.role\` o‘zgarmaydi — faqat \`u1.__dict__["role"] = "vip"\` yaratiladi. Hammani o‘zgartirish uchun \`User.role = ...\` yozing.
### 4. Eng Katta Xato: \`class Cart: items = []\`
\`c1.items.append("Book")\` qilsangiz \`c2.items\` da ham \`"Book"\` chiqib qoladi! Har doim \`self.items = []\` ni \`__init__\` da oching.`,
    theoryEn: `### 1. Shared vs Per-Instance State
Class vars live on the class (great for constants and instance counters); instance vars live on \`self\`.
### 2. Attribute Lookup Chain
Instance \`__dict__\` -> Class \`__dict__\` -> Parent classes.
### 3. Shadowing via \`self.var =\`
Assigning \`obj.var = val\` creates an instance attribute shadowing the class variable.
### 4. Mutable Class Var Bug
\`items = []\` at class level shares one list across all instances!`,
    examples: [
      ex('Misol 1: Class counter va konstanta', 'Example 1: Shared Counter & Class Constant', `class Ticket:\n    TAX = 0.1\n    total_issued = 0\n\n    def __init__(self, price: float):\n        self.price = price\n        Ticket.total_issued += 1\n\n    def final_price(self) -> float:\n        return round(self.price * (1 + self.TAX), 2)\n\nt1, t2 = Ticket(100), Ticket(200)\nprint("Issued:", Ticket.total_issued, "| t1:", t1.final_price(), "| t2:", t2.final_price())`, `Issued: 2 | t1: 110.0 | t2: 220.0`, '`Ticket.total_issued` barcha nusxalarni sanadi; `self.price` har birida alohida!', 'Class counter tracked all instances while prices stayed per-instance.'),
      ex('Misol 2: Mutable Class Variable xatosi vs `__init__` yechimi', 'Example 2: Avoiding Shared Mutable Class List', `class GoodDog:\n    def __init__(self, name: str):\n        self.name = name\n        self.tricks = []  # Har bir obyekt uchun alohida!\n\nd1, d2 = GoodDog("Rex"), GoodDog("Max")\nd1.tricks.append("sit")\nprint("d1:", d1.tricks, "| d2:", d2.tricks)`, `d1: ['sit'] | d2: []`, '`__init__` ichida `self.tricks = []` yozilgani uchun `d2` toza qoldi.', 'Creating `self.tricks = []` in `__init__` isolated each instance.'),
      ex('Misol 3: Class variable shadowing vs Class orqali yangilash', 'Example 3: Shadowing vs Updating Class Var', `class Config:\n    timeout = 5\n\nc1, c2 = Config(), Config()\nc1.timeout = 30  # Faqat c1 da shadow yaratadi!\nprint("c1:", c1.timeout, "| c2:", c2.timeout, "| Class:", Config.timeout)`, `c1: 30 | c2: 5 | Class: 5`, '`c1.timeout = 30` faqat `c1.__dict__` ga yozildi, `Config.timeout` o‘zgarmadi.', '`c1.timeout = 30` shadowed the class variable on `c1` only.'),
    ],
    traceTitleUz: 'Atribut qidiruvi va shadowing izi',
    traceTitleEn: 'Tracing Class Var Shadowing',
    traceCode: `class A: x = 1\na, b = A(), A()\na.x = 9\nprint(a.x, b.x, A.x)`,
    traceSteps: [
      traceStep(1, 'a.x = 9', "a.__dict__={'x': 9}", 'Faqat a da lokal x ochildi', 'Created shadow on a'),
      traceStep(2, 'b.x -> lookup', 'b.__dict__ empty -> A.x=1', 'b klassdan o‘qidi', 'b fell back to A.x', '9 1 1'),
    ],
    commonMistakes: [
      mistake('`class Cart: items = []` deb mutable class atribut yozish', 'Mutable List as Class Attribute', `class BuggyCart:\n    items = []\nc1, c2 = BuggyCart(), BuggyCart()\nc1.items.append("Apple")\nprint(c2.items)`, "Unexpectedly prints ['Apple'] on c2!", `class SafeCart:\n    def __init__(self):\n        self.items = []\nc1, c2 = SafeCart(), SafeCart()\nc1.items.append("Apple")\nprint(c1.items, c2.items)`, 'Class darajasidagi `[]` barcha obyektlar orasida umumiy qoladi.', 'Class-level `[]` is shared across all instances.', 'Mutable maydonlarni faqat `__init__` ichida `self.items = []` qiling.', 'Initialize mutable fields inside `__init__`.'),
      mistake('Hisoblagichni `self.count += 1` bilan oshirish', 'Shadowing Counter via self.count += 1', `class Item:\n    count = 0\n    def __init__(self): self.count += 1\na, b = Item(), Item()\nprint(Item.count)`, 'Prints 0! Created shadow instance attrs instead', `class Item:\n    count = 0\n    def __init__(self): Item.count += 1\na, b = Item(), Item()\nprint(Item.count)`, '`self.count += 1` avval `Item.count` ni o‘qib, natijani `self.__dict__` ga yozadi!', '`self.count += 1` reads class var then writes a new instance shadow.', 'Class o‘zgaruvchisini `ClassName.var` (yoki `cls.var`) bilan yangilang.', 'Mutate via `ClassName.count` or `type(self).count`.'),
    ],
    compareTitleUz: 'Class Variable vs Instance Variable',
    compareTitleEn: 'Class Variable vs Instance Variable',
    compareUz: ['Class Variable: o‘zgarmas konstantalar (`TAX = 0.12`), enum-like qiymatlar va umumiy hisoblagichlar.', 'Instance Variable (`self.x`): har bir obyektga xos holat va barcha mutable kolleksiyalar (`list`, `dict`).'],
    compareEn: ['Class variable: shared read-only defaults/constants and class counters.', 'Instance variable: per-object state and all mutable collections.'],
    compareSummaryUz: 'Mutable kolleksiyalarni doim `__init__` da `self.` ga, konstantalarni esa klass tanasiga qo‘ying.',
    compareSummaryEn: 'Put constants on the class and all mutable/per-object state on `self` in `__init__`.',
    practiceTasks: [
      pt('p0905_1', '1-mashq: Class counter', 'Task 1: Count Created Objects', '`Node` klassida `Node.total` orqali nechta obyekt yaratilganini sanang.', 'Count instances via Node.total.', `class Node:\n    total = 0\n    def __init__(self): Node.total += 1\nNode(); Node(); Node()\nprint(Node.total)`, '3', 'Node.total += 1', 'Prints 3.'),
      pt('p0905_2', '2-mashq: Mutable tuzoqni tuzatish', 'Task 2: Fix Shared List', '`Team` klassida `members` ni `__init__` da ochib `t1`, `t2` mustaqilligini chiqaring.', 'Isolate members per Team.', `class Team:\n    def __init__(self): self.members = []\nt1, t2 = Team(), Team()\nt1.members.append("Ali")\nprint(len(t1.members), len(t2.members))`, '1 0', 'self.members = [] in __init__', 'Prints 1 0.'),
      pt('p0905_3', '3-mashq: Shadowing tekshiruvi', 'Task 3: Shadowing Check', '`class C: rate = 1` da `c = C(); c.rate = 5` dan keyin `c.rate, C.rate` chiqaring.', 'Observe instance shadow.', `class C:\n    rate = 1\nc = C()\nc.rate = 5\nprint(c.rate, C.rate)`, '5 1', 'c.rate shadows only c.', 'Prints 5 1.'),
      pt('p0905_4', '4-mashq: `self.CONST` o‘qish', 'Task 4: Read Class Constant', '`Order` da `FEE = 5` va `self.amt + self.FEE` chiqaring.', 'Read class constant via self.', `class Order:\n    FEE = 5\n    def __init__(self, amt): self.amt = amt\n    def total(self): return self.amt + self.FEE\nprint(Order(20).total())`, '25', 'Read immutable FEE.', 'Prints 25.'),
      pt('p0905_5', '5-mashq: `__dict__` qidiruvi', 'Task 5: Attribute Dicts', '`class X: k = 1` da `x = X()` uchun `"k" in x.__dict__, "k" in X.__dict__` chiqaring.', 'Check dict locations.', `class X:\n    k = 1\nx = X()\nprint("k" in x.__dict__, "k" in X.__dict__)`, 'False True', 'Class attr lives on X.__dict__.', 'Prints False True.'),
    ],
    quiz: [
      q('q0905_1', '`class Dog: tricks = []` yozishda qanday muammo bor?', 'Bug in `class Dog: tricks = []`?', ['SyntaxError', 'Barcha Dog obyektlari bitta ro‘yxatga qo‘shib boradi', 'tricking ishlamaydi', 'Xotira kamayadi'], ['SyntaxError', 'All Dog instances share one tricks list', 'Method fails', 'Saves RAM'], 1, 'Mutable class variable hamma nusxalar uchun umumiy.', 'Shared across all instances.'),
      q('q0905_2', '`self.count += 1` klass atributi `count = 0` ni yangilaydimi?', 'Does `self.count += 1` update `Class.count`?', ['Ha', 'Yo‘q, yangi instance atributi yaratib yashiradi (shadowing)', 'Xato beradi', 'None qiladi'], ['Yes', 'No, creates an instance shadow attribute', 'Error', 'Sets None'], 1, 'Faqat shu obyektda instance attribute ochadi.', 'Shadows on `self` only.'),
      q('q0905_3', 'Python `obj.attr` ni qayerdan qidirishni boshlaydi?', 'First place Python looks for `obj.attr`?', ['Global scope', 'obj.__dict__ (instance)', 'Class.__dict__', 'Parent class'], ['Global scope', 'obj.__dict__ (instance)', 'Class.__dict__', 'Parent class'], 1, 'Avval obyektning o‘z `__dict__` idan.', 'Instance `__dict__` first.'),
      q('q0905_4', 'Yaratilgan obyektlar sonini hisoblash uchun klass o‘zgaruvchisini qanday oshirish to‘g‘ri?', 'Correct way to increment shared instance counter?', ['self.count += 1', 'ClassName.count += 1', 'count += 1', 'global count'], ['self.count += 1', 'ClassName.count += 1', 'count += 1', 'global count'], 1, '`ClassName.count += 1` (yoki `type(self).count += 1`).', '`ClassName.count += 1`.'),
      q('q0905_5', 'Klass darajasida qaysi turdagi ma’lumot saqlash eng xavfsiz?', 'Safest kind of data to keep as class variables?', ['Bo‘sh list []', 'O‘zgarmas konstantalar (TAX = 0.12)', 'Foydalanuvchi savati dict {}', 'Ochiq fayl'], ['Empty list []', 'Immutable constants (TAX = 0.12)', 'User cart dict {}', 'Open file'], 1, 'O‘zgarmas (immutable) konstantalar.', 'Immutable constants.'),
    ],
    homework: hw('Bank Filiali Hisoblagichi (Class vs Instance State)', 'Branch Counter & Wallet', '`BankCard(owner)` klassini tuzing: har bir karta avtomatik ketma-ket `card_id` (`1, 2, 3...`) ni class hisoblagichidan olsin, lekin o‘zining mustaqil `transactions = []` tarixiga ega bo‘lsin.', 'Implement `BankCard(owner)` assigning sequential `card_id` from a class counter while keeping `transactions` strictly per-instance.', ['Class counter card_id uchun', 'self.transactions = [] __init__ da'], ['Class counter for ID', 'Instance transactions list'], 'BankCard._next_id += 1; self.card_id = BankCard._next_id', 'Assign unique ID cleanly.', 'Jami chiqarilgan kartalar sonini `@classmethod` orqali qaytaring.', 'Add `@classmethod total_issued(cls)`.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-09-06',
    courseId: 'oop',
    moduleId: 'c09_m3',
    order: 6,
    titleUz: 'Encapsulation — ma’lumotni himoyalash va `@property`',
    titleEn: 'Encapsulation: `_protected`, `__private` Mangling & `@property`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-09-05'],
    conceptId: 'encapsulation',
    whyUz: "Mijoz kodida `user.age = -50` yoki `account.balance = 9999999` deb yozib qo‘yishning oldini qanday olasiz? Python'da **Encapsulation** va **`@property` / `@setter`** tashqaridan oddiy `user.age` dek ko‘rinib, ichkarida qatʼiy tekshiruv bajaradi!",
    whyEn: 'Encapsulation protects object invariants from invalid external writes—Python achieves this cleanly with `_internal` conventions and `@property` getters/setters.',
    analogyUz: "`@property` — bu avtomobilning tezlik o‘lchagichi va gaz pedali: siz tashqaridan oddiy `car.speed` deb o‘qiysiz yoki o‘zgartirasiz, lekin ichkaridagi kontroller (`@speed.setter`) 300 km/soatdan oshishiga yoki manfiy bo‘lishiga yo‘l qo‘ymaydi!",
    analogyEn: '`@property` gives callers simple `obj.attr` syntax while your setter silently validates every read and write underneath.',
    stopsUz: "1) Java/C++ dagi kabi `get_age()` / `set_age()` metodlari yozish Pythonic emas — Python da `@property` ishlatiladi! 2) `@property` ichida **`return self.age`** deb o‘zini chaqirsangiz cheksiz rekursiya (`RecursionError`) beradi — ichki saqlash nomi albatta **`self._age`** (pastki chiziqli) bo‘lishi shart!",
    stopsEn: 'Inside a `@property` getter/setter, ALWAYS store the backing value in `self._attr` (with leading underscore)—reading/writing `self.attr` triggers infinite recursion (`RecursionError`)!',
    objUz: ['`_protected` (konvensiya) vs `__private` (name mangling `_Class__attr`) farqini bilish', '`@property` (read-only yoki computed) va `@x.setter` (validatsiyali yozish) yaratish', '`@property` da cheksiz rekursiya tuzog‘idan qochish'],
    objEn: ['Understand `_protected` convention and `__private` name mangling', 'Build read-only, computed, and validated properties via `@property`', 'Avoid infinite recursion inside property getters/setters via `self._backing`'],
    theoryUz: `### 1. Python da Ko‘rinish Darajalari
- \`self.name\` — **Public** (hamma foydalanadi)
- \`self._balance\` — **Protected** ("Ichki maydon, tashqaridan tegmang" kelishuvi)
- \`self.__pin\` — **Name Mangling** (Python uni \`_Card__pin\` ga aylantiradi — merosxo‘r klasslarda nom to‘qnashuvini oldini olish uchun)
### 2. \`@property\` va \`@setter\` (Pythonic Encapsulation!)
\`\`\`python
class Account:
    def __init__(self, balance: float) -> None:
        self.balance = balance  # Setter ni ishga tushiradi!

    @property
    def balance(self) -> float:
        return self._balance

    @balance.setter
    def balance(self, value: float) -> None:
        if value < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = value
\`\`\`
### 3. Read-Only (Faqat O‘qiladigan) Property
Faqat \`@property\` yozib \`@setter\` yozmasangiz, \`obj.area = 10\` \`AttributeError\` beradi!
### 4. Keng tarqalgan xato
\`@property def age(self): return self.age\` -> \`RecursionError\` (doim \`self._age\` ishlating!).`,
    theoryEn: `### 1. Visibility Conventions
\`public\`, \`_protected\` (internal convention), \`__private\` (name-mangled to \`_Class__attr\` to avoid subclass collisions).
### 2. \`@property\` & \`@setter\`
Start simple with public attributes; upgrade transparently to \`@property\` validation without breaking callers.
### 3. Read-Only & Computed Properties
Omit \`@setter\` to create read-only or dynamically computed attributes (\`rect.area\`).
### 4. Recursion Trap
Always store backing data in \`self._name\`, never \`self.name\`.`,
    examples: [
      ex('Misol 1: Validatsiyali `@property` + `@setter` (`__init__` ham ishlatadi!)', 'Example 1: Validated Property Getter/Setter', `class Product:\n    def __init__(self, name: str, price: float) -> None:\n        self.name = name\n        self.price = price\n\n    @property\n    def price(self) -> float:\n        return self._price\n\n    @price.setter\n    def price(self, val: float) -> None:\n        if val <= 0:\n            raise ValueError("Price must be > 0")\n        self._price = round(float(val), 2)\n\np = Product("Book", 12.345)\nprint("Valid:", p.price)\ntry:\n    p.price = -5\nexcept ValueError as e:\n    print("Blocked:", e)`, `Valid: 12.35\nBlocked: Price must be > 0`, '`__init__` ham `self.price = price` orqali setterni avtomatik tekshirdi.', 'Even `__init__` routed through the validating setter automatically.'),
      ex('Misol 2: Read-Only hisoblanuvchi `@property`', 'Example 2: Read-Only Computed Property', `class Rectangle:\n    def __init__(self, w: float, h: float) -> None:\n        self.w = w\n        self.h = h\n    @property\n    def area(self) -> float:\n        return self.w * self.h\n\nr = Rectangle(5, 4)\nprint("Area:", r.area)\nr.w = 10\nprint("Updated Area:", r.area)`, `Area: 20\nUpdated Area: 40`, '`r.w` o‘zgarganda `r.area` doim dolzarb qiymatni hisoblab beradi va tashqaridan `r.area = 99` qilib bo‘lmaydi.', 'Computed `@property` stays up-to-date and prevents direct assignment.'),
      ex('Misol 3: `__private` Name Mangling (`_Cls__attr`)', 'Example 3: Understanding Name Mangling', `class Vault:\n    def __init__(self, pin: str) -> None:\n        self.__pin = pin\n    def check(self, guess: str) -> bool:\n        return guess == self.__pin\n\nv = Vault("7788")\nprint("Check:", v.check("7788"), "| Mangled key exists?", "_Vault__pin" in v.__dict__)`, `Check: True | Mangled key exists? True`, '`__pin` nomi `_Vault__pin` ko‘rinishida o‘zgartirilgan (mangled).', 'Double underscore mangles attribute name to `_Vault__pin`.'),
    ],
    traceTitleUz: '`@property` va `@setter` izi',
    traceTitleEn: 'Tracing Property Setter Validation',
    traceCode: `class User:\n    def __init__(self, age): self.age = age\n    @property\n    def age(self): return self._age\n    @age.setter\n    def age(self, v):\n        if v < 0: raise ValueError("neg")\n        self._age = v\n\nu = User(20)\nprint(u.age)`,
    traceSteps: [
      traceStep(1, 'self.age = 20', 'calls @age.setter(20)', '__init__ setterni chaqirdi', 'Invoked setter from __init__'),
      traceStep(2, 'self._age = 20', '_age=20', 'Ichki _age ga yozildi', 'Stored in _age'),
      traceStep(3, 'u.age', 'calls @property -> 20', 'Getter qaytardi', 'Getter returned 20', '20'),
    ],
    commonMistakes: [
      mistake('`@property` ichida `self._name` o‘rniga `self.name` ishlatish', 'Infinite Recursion in Property', `class Bad:\n    @property\n    def age(self): return self.age\n    @age.setter\n    def age(self, v): self.age = v`, 'RecursionError: maximum recursion depth exceeded', `class Good:\n    def __init__(self, v): self.age = v\n    @property\n    def age(self): return self._age\n    @age.setter\n    def age(self, v): self._age = v\nprint(Good(21).age)`, '`self.age` yana o‘sha `@property` ni qayta chaqiradi!', '`self.age` invokes the property getter/setter recursively.', 'Ichki saqlash uchun `self._age` (pastki chiziqli) ishlating.', 'Always back properties with `self._attr`.'),
      mistake('Setter yo‘q `@property` ga qiymat tayinlashga urinish', 'Assigning to Read-Only Property', `class Box:\n    @property\n    def id(self): return 1\nb = Box()\nb.id = 2`, "AttributeError: property 'id' of 'Box' object has no setter", `class Box:\n    def __init__(self, id_val): self._id = id_val\n    @property\n    def id(self): return self._id\nprint(Box(1).id)`, '`@x.setter` yozilmagan property faqat o‘qish (read-only) uchun.', 'Properties without setters reject direct assignment.', 'O‘zgartirish kerak bo‘lsa `@id.setter` qo‘shing.', 'Add a setter only if mutation should be allowed.'),
    ],
    compareTitleUz: '`get_x()`/`set_x()` metodlar vs `@property`',
    compareTitleEn: 'Java-style Getters/Setters vs `@property`',
    compareUz: ['`get_x()` / `set_x()`: Pythonic emas, keyinroq validatsiya qo‘shishda barcha chaqiruvlarni o‘zgartirish kerak.', '`@property`: tashqaridan oddiy `obj.x` kabi qulay va istalgan vaqt validatsiyali setterni ulash mumkin!'],
    compareEn: ['`get_x()/set_x()`: verbose Java-style boilerplate.', '`@property`: keeps clean `obj.x` access while supporting validation under the hood.'],
    compareSummaryUz: 'Python da atributlarni `@property` va `@setter` orqali kapsulalang va backing maydonni `self._attr` deb nomlang.',
    compareSummaryEn: 'Use `@property` + `@setter` with `self._attr` backing storage for clean Pythonic encapsulation.',
    practiceTasks: [
      pt('p0906_1', '1-mashq: Read-only `@property`', 'Task 1: Read-Only Property', '`Circle(r)` da `diameter` `@property` (`2 * r`) yozib chiqaring.', 'Compute diameter property.', `class Circle:\n    def __init__(self, r): self.r = r\n    @property\n    def diameter(self): return 2 * self.r\nprint(Circle(5).diameter)`, '10', '@property def diameter(self):', 'Prints 10.'),
      pt('p0906_2', '2-mashq: Validatsiyali setter', 'Task 2: Validated Setter', '`Temp(c)` da `c < -273.15` da `ValueError` ko‘tarsin.', 'Reject below absolute zero.', `class Temp:\n    def __init__(self, c): self.c = c\n    @property\n    def c(self): return self._c\n    @c.setter\n    def c(self, v):\n        if v < -273.15: raise ValueError("too cold")\n        self._c = v\ntry:\n    Temp(-300)\nexcept ValueError as e:\n    print(e)`, 'too cold', 'Use _c backing field.', 'Prints too cold.'),
      pt('p0906_3', '3-mashq: Read-only ni o‘zgartirish xatosi', 'Task 3: Catch Read-Only Write', 'Settersiz `@property` ga yozib `AttributeError` tuting.', 'Catch AttributeError on read-only property.', `class Ro:\n    @property\n    def v(self): return 1\nr = Ro()\ntry:\n    r.v = 2\nexcept AttributeError:\n    print("readonly")`, 'readonly', 'No @v.setter defined.', 'Prints readonly.'),
      pt('p0906_4', '4-mashq: Name mangling', 'Task 4: Name Mangling Check', '`class S: def __init__(self): self.__k = 9` da `"_S__k" in S().__dict__` chiqaring.', 'Verify mangled attribute.', `class S:\n    def __init__(self): self.__k = 9\nprint("_S__k" in S().__dict__)`, 'True', '_ClassName__attr', 'Prints True.'),
      pt('p0906_5', '5-mashq: `email` normallashtirish setteri', 'Task 5: Normalizing Setter', '`Account` setteri `email` ni `.strip().lower()` qilsin.', 'Normalize email inside setter.', `class Account:\n    def __init__(self, email): self.email = email\n    @property\n    def email(self): return self._email\n    @email.setter\n    def email(self, v): self._email = v.strip().lower()\na = Account(" A@B.UZ ")\nprint(a.email)`, 'a@b.uz', 'Setter runs in __init__ too.', 'Prints a@b.uz.'),
    ],
    quiz: [
      q('q0906_1', '`@property` ichida qiymatni `self._age` o‘rniga `self.age` da saqlasak nima bo‘ladi?', 'What happens reading/writing `self.age` inside `@property def age`?', ['Tezroq', 'Cheksiz rekursiya (RecursionError)', 'SyntaxError', 'None'], ['Faster', 'Infinite recursion (RecursionError)', 'SyntaxError', 'None'], 1, '`RecursionError`!', '`RecursionError`!'),
      q('q0906_2', '`class Card: self.__pin = "1234"` qaysi nom bilan `__dict__` da saqlanadi?', 'Mangled key name for `self.__pin` in `Card`?', ['__pin', '_pin', '_Card__pin', 'Card__pin'], ['__pin', '_pin', '_Card__pin', 'Card__pin'], 2, '`_Card__pin`.', '`_Card__pin`.'),
      q('q0906_3', 'Faqat o‘qiladigan (read-only) property qanday yaratiladi?', 'How to create a read-only property?', ['@readonly', 'Faqat @property yozib, @setter yozmasdan', 'private def', 'const'], ['@readonly', 'Define @property without @attr.setter', 'private def', 'const'], 1, '`@setter` siz `@property`.', '`@property` without a setter.'),
      q('q0906_4', '`__init__` ichida `self.price = price` yozilsa `@price.setter` ishlaydimi?', 'Does `self.price = price` in `__init__` invoke `@price.setter`?', ['Yo‘q', 'Ha, avtomatik chaqiriladi', 'Faqat 2-marta', 'Xato beradi'], ['No', 'Yes, triggers the setter automatically', 'Only on 2nd write', 'Error'], 1, 'Ha, yaratilishidayoq validatsiya ishlaydi!', 'Yes, runs validation right at initialization.'),
      q('q0906_5', 'Python da `_balance` (bitta pastki chiziq) nimani anglatadi?', 'Meaning of single leading underscore `_balance` in Python?', ['Qatʼiy bloklangan', 'Ichki/protected maydon ekanini bildiruvchi konvensiya', 'Global', 'Konstanta'], ['Hard compiler lock', 'Protected internal-use convention', 'Global', 'Constant'], 1, 'Ichki maydon konvensiyasi.', 'Protected internal convention.'),
    ],
    homework: hw('Kapsulalangan Bank Hisobi (`@property` + Read-Only)', 'Encapsulated Account Class', '`SecureAccount(owner, balance=0)` klassini tuzing: `balance` manfiy bo‘lishiga yo‘l qo‘ymaydigan `@property/@setter`, faqat o‘qiladigan (`read-only`) `status` property (`"Active"` / `"Empty"`) va `deposit`/`withdraw` metodlarini yozing.', 'Implement `SecureAccount` with validated `balance` `@property/@setter`, read-only computed `status`, and `deposit`/`withdraw` methods.', ['@property va @balance.setter', 'Read-only status property'], ['Use @property/@setter', 'Read-only status property'], 'self._balance', 'Use underscore backing attribute.', 'Manfiy balans berib `ValueError` tutishni ham test qiling.', 'Test negative-balance rejection.', 25),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),
];
