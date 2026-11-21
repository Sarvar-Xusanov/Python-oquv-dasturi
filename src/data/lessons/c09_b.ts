import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C09_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-09-07',
    courseId: 'oop',
    moduleId: 'c09_m3',
    order: 7,
    titleUz: 'Inheritance — merosxo‘rlik va super() va Review #19',
    titleEn: 'Inheritance, super() & MRO (+ Review #19)',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-09-06'],
    conceptId: 'oop_inheritance',
    whyUz: "Har safar `AdminUser`, `InstructorUser`, `StudentUser` uchun `name`, `email`, `login()` kodlarini nusxalab yozish xatoga olib keladi. **Inheritance (merosxo‘rlik)** umumiy bazani (`User`) 1 marta yozib, voris klasslarda (`class Admin(User):`) uni kengaytirish imkonini beradi!",
    whyEn: 'Inheritance lets child classes reuse and specialize parent state and methods cleanly while calling `super()` to respect C3 Method Resolution Order (MRO).',
    analogyUz: "`Parent` (Ota klass) — bu standart smartfon platformasi (qo‘ng‘iroq, ekran, batareya). `Child` (Voris klass) — esa undagi tayyor tizimni meros olib, ustiga qo‘shimcha Pro kamera va stilus qo‘shadigan yangi model!",
    analogyEn: 'A child class inherits the core chassis of its parent class and overrides or extends specific capabilities without duplicating the base code.',
    stopsUz: "Voris `__init__` yozganda **`super().__init__(...)`** ni chaqirishni unutmang — aks holda ota klass atributlari yaratilmaydi! Ko‘p merosxo‘rlik (multiple inheritance) da `Parent.__init__(self)` emas, doim **`super()`** ishlating, chunki u **MRO (C3 linearization)** bo‘yicha har bir klassni aynan 1 marta chaqiradi.",
    stopsEn: 'Always call `super().__init__(...)` instead of hardcoding `Parent.__init__(self)` so cooperative multiple inheritance and MRO work without skipping or double-calling parents.',
    objUz: ['`class Child(Parent):` sintaksisi bilan meros olish va metod override qilish', '`super().__init__()` va `super().method()` bilan ota mantiqini kengaytirish', '`Cls.__mro__` (Method Resolution Order) zanjirini o‘qish'],
    objEn: ['Subclass parents with `class Child(Parent):` and override methods', 'Extend parent logic cleanly with `super()`', 'Inspect `__mro__` and test `issubclass()` / `isinstance()`'],
    theoryUz: `### 1. Merosxo‘rlik Sintaksisi (\`Is-A\` munosabati)
\`class Dog(Animal):\` — it bu hayvon (\`Dog is-a Animal\`). Voris klass otaning barcha umumiy metod va atributlariga ega bo‘ladi.
### 2. Method Overriding va \`super()\`
Voris klass ota metodini qayta yozishi (override) va ichida \`super().method()\` orqali asl ota mantiqini ham ishlatishi mumkin.
### 3. \`super().__init__()\` Qoidasi
Voris \`__init__\` ota \`__init__\` ni berkitib qo‘yadi; shuning uchun ota atributlari o‘rnatilishi uchun albatta \`super().__init__(...)\` chaqiriladi.
### 4. MRO (Method Resolution Order)
Ko‘p merosxo‘rlikda Python C3 algoritmi bo‘yicha \`Child.mro()\` tartibida atribut qidiradi (Diamond problem yechimi).
### 5. \`isinstance()\` vs \`issubclass()\`
\`isinstance(d, Animal)\` -> \`True\`; \`issubclass(Dog, Animal)\` -> \`True\`.`,
    theoryEn: `### 1. Subclassing (\`Is-A\` Relationship)
\`class Child(Parent):\` inherits parent attributes and methods and allows targeted specialization.
### 2. Method Overriding & \`super()\`
Override a method in the subclass and call \`super().method()\` to extend rather than completely discard parent behavior.
### 3. Cooperative \`super().__init__()\`
When a subclass defines \`__init__\`, always delegate base initialization via \`super().__init__(...)\`.
### 4. Method Resolution Order (MRO)
Python uses C3 linearization (\`Cls.__mro__\`) to resolve method lookups deterministically across inheritance diamonds.
### 5. Runtime Checks
Use \`isinstance(obj, Base)\` for instances and \`issubclass(Sub, Base)\` for classes.`,
    examples: [
      ex('Misol 1: `super().__init__()` va metodni kengaytirish', 'Example 1: Extending with super()', `class Employee:\n    def __init__(self, name: str, base_pay: int):\n        self.name = name\n        self.base_pay = base_pay\n    def pay(self) -> int:\n        return self.base_pay\n\nclass Manager(Employee):\n    def __init__(self, name: str, base_pay: int, bonus: int):\n        super().__init__(name, base_pay)\n        self.bonus = bonus\n    def pay(self) -> int:\n        return super().pay() + self.bonus\n\nm = Manager("Dilnoza", 5000, 1200)\nprint(m.name, m.pay(), isinstance(m, Employee))`, `Dilnoza 6200 True`, '`Manager` ota maoshini `super().pay()` bilan olib ustiga bonus qo‘shdi.', '`Manager` delegates base initialization and salary lookup via `super()`.'),
      ex('Misol 2: MRO (Method Resolution Order) Diamond zanjiri', 'Example 2: Diamond MRO Inspection', `class A:\n    def who(self): return ["A"]\nclass B(A):\n    def who(self): return ["B"] + super().who()\nclass C(A):\n    def who(self): return ["C"] + super().who()\nclass D(B, C):\n    def who(self): return ["D"] + super().who()\n\nprint([cls.__name__ for cls in D.__mro__[:4]])\nprint(D().who())`, `['D', 'B', 'C', 'A']\n['D', 'B', 'C', 'A']`, '`super()` MRO tartibi bo‘yicha `A` ni ikki marta emas, faqat 1 marta chaqiradi.', 'Cooperative `super()` traverses the C3 MRO cleanly without duplicating `A`.'),
      ex('Misol 3: `issubclass` tekshiruvi', 'Example 3: issubclass Hierarchy Check', `class Vehicle: pass\nclass ElectricCar(Vehicle): pass\n\nprint(issubclass(ElectricCar, Vehicle), issubclass(Vehicle, ElectricCar))`, `True False`, '`issubclass(Sub, Base)` meros zanjirini tekshiradi.', '`issubclass()` inspects class-level inheritance relationships.'),
    ],
    traceTitleUz: 'Override va `super()` chaqiruv izi',
    traceTitleEn: 'Tracing super() Dispatch',
    traceCode: `class Base:\n    def greet(self): return "Hi"\nclass Sub(Base):\n    def greet(self): return super().greet() + "!"\nprint(Sub().greet())`,
    traceSteps: [
      traceStep(1, 'Sub().greet()', 'Sub.greet', 'Voris metodi boshlandi', 'Entered Sub.greet'),
      traceStep(2, 'super().greet()', 'Base.greet -> "Hi"', 'MRO bo‘yicha keyingi klass chaqirildi', 'Dispatched to Base.greet'),
      traceStep(3, 'print(...)', 'Hi!', 'Kengaytirilgan natija', 'Printed Hi!', 'Hi!'),
    ],
    commonMistakes: [
      mistake('Voris `__init__` da `super().__init__()` ni unutish', 'Forgetting super().__init__() in Subclass', `class User:\n    def __init__(self, name): self.name = name\nclass Admin(User):\n    def __init__(self, name, level): self.level = level\ntry:\n    print(Admin("Ali", 1).name)\nexcept AttributeError as e:\n    print("ERR:", e)`, "ERR: 'Admin' object has no attribute 'name'", `class User:\n    def __init__(self, name): self.name = name\nclass Admin(User):\n    def __init__(self, name, level):\n        super().__init__(name)\n        self.level = level\nprint(Admin("Ali", 1).name)`, 'Voris `__init__` ota `__init__` ni bekor qiladi; `super()` chaqirilmasa `self.name` yo‘qoladi.', 'Defining `__init__` on a subclass shadows the parent `__init__`.', 'Har doim birinchi qatorlarda `super().__init__(...)` chaqiring.', 'Call `super().__init__(...)` inside subclass `__init__`.'),
      mistake('Juda chuqur 5-6 qavatli meros daraxti yasash', 'Deep Fragile Inheritance Hierarchies', `# A -> B -> C -> D -> E breaks easily when Base changes`, 'Tight coupling across layers', `print("Keep inheritance shallow (1-2 levels) and use Composition for extra parts!")`, 'Chuqur meros ota klassdagi kichik o‘zgarishda hamma vorislarni sindiradi.', 'Deep inheritance creates brittle base-class coupling.', 'Merosni 1-2 darajada saqlang, qolganini Composition bilan qo‘shing.', 'Keep hierarchies shallow and prefer composition.'),
    ],
    compareTitleUz: 'Method Override vs To‘liq Yangi Metod',
    compareTitleEn: 'Overriding with super() vs Full Replacement',
    compareUz: ['`super().method()` + qo‘shimcha: ota qoidalarini saqlab xulqni boyitish (logging, bonus, extra check).', 'To‘liq override (`super()` siz): ota xatti-harakatini butunlay almashtirish zarur bo‘lganda.'],
    compareEn: ['Extend with `super()`: preserve base invariants while adding behavior.', 'Full override: replace parent behavior intentionally.'],
    compareSummaryUz: 'Umumiy `is-a` iyerarxiyalarda merosxo‘rlik va `super()` ishlating; ko‘p rol aralashganda esa Composition afzal.',
    compareSummaryEn: 'Use shallow inheritance with cooperative `super()` for strict `is-a` relationships.',
    practiceTasks: [
      pt('p0907_1', '1-mashq: Oddiy voris klass', 'Task 1: Basic Subclass', '`Animal.speak()` -> `"..."` dan meros olib `Cat.speak()` -> `"Meow"` yozing.', 'Override speak on Cat.', `class Animal:\n    def speak(self): return "..."\nclass Cat(Animal):\n    def speak(self): return "Meow"\nprint(Cat().speak())`, 'Meow', 'class Cat(Animal):', 'Prints Meow.'),
      pt('p0907_2', '2-mashq: `super().__init__`', 'Task 2: Delegate with super', '`Person(name)` va `Student(Person)` ga `grade` qo‘shing.', 'Call super().__init__(name).', `class Person:\n    def __init__(self, name): self.name = name\nclass Student(Person):\n    def __init__(self, name, grade):\n        super().__init__(name)\n        self.grade = grade\ns = Student("Madina", 5)\nprint(s.name, s.grade)`, 'Madina 5', 'super().__init__(name)', 'Prints Madina 5.'),
      pt('p0907_3', '3-mashq: `super().info()` kengaytirish', 'Task 3: Extend Method Output', 'Ota `info()` `"User"` qaytarsin, `VIP.info()` `super().info() + "+VIP"` qilsin.', 'Extend parent method.', `class U:\n    def info(self): return "User"\nclass VIP(U):\n    def info(self): return super().info() + "+VIP"\nprint(VIP().info())`, 'User+VIP', 'super().info() + "+VIP"', 'Prints User+VIP.'),
      pt('p0907_4', '4-mashq: `issubclass` va `isinstance`', 'Task 4: Check Hierarchy', '`issubclass(bool, int)` natijasini chiqaring.', 'Verify bool inherits int.', `print(issubclass(bool, int), isinstance(True, int))`, 'True True', 'bool is a subclass of int!', 'Prints True True.'),
      pt('p0907_5', '5-mashq: `__mro__` ro‘yxati', 'Task 5: Read MRO', '`class X: pass`, `class Y(X): pass` uchun `[c.__name__ for c in Y.__mro__]` chiqaring.', 'Inspect Y.__mro__.', `class X: pass\nclass Y(X): pass\nprint([c.__name__ for c in Y.__mro__])`, "['Y', 'X', 'object']", 'Y -> X -> object', 'Prints MRO list.'),
    ],
    quiz: [
      q('q0907_1', 'Voris klassdan ota klassning `__init__` yoki metodini chaqirish uchun nima ishlatiladi?', 'Built-in used to invoke parent methods cooperatively?', ['parent()', 'base()', 'super()', 'self.parent()'], ['parent()', 'base()', 'super()', 'self.parent()'], 2, '`super()` MRO bo‘yicha keyingi klassga murojaat qiladi.', '`super()` dispatches along MRO.'),
      q('q0907_2', 'Python ko‘p merosxo‘rlikda metodlarni qaysi tartibda qidiradi?', 'Order Python uses to resolve attributes in inheritance?', ['Random', 'C3 MRO (__mro__)', 'Alphabetical', 'Reverse import order'], ['Random', 'C3 MRO (__mro__)', 'Alphabetical', 'Reverse import order'], 1, 'C3 Linearization (`__mro__`).', 'C3 MRO.'),
      q('q0907_3', 'Voris klassda `__init__` yozilib `super().__init__()` chaqirilmasa nima bo‘ladi?', 'What happens if subclass defines `__init__` without calling `super().__init__()`?', ['Avtomatik chaqiriladi', 'Ota `__init__` ishlamaydi va ota atributlari yaratilmaydi', 'SyntaxError chiqadi', 'Dastur muzlaydi'], ['Called automatically', 'Parent __init__ does not run', 'SyntaxError', 'Hangs'], 1, 'Ota `__init__` avtomatik chaqirilmaydi.', 'Parent `__init__` is skipped.'),
      q('q0907_4', 'Python da `issubclass(bool, int)` natijasi nima?', 'What does `issubclass(bool, int)` return?', ['False', 'True', 'TypeError', 'None'], ['False', 'True', 'TypeError', 'None'], 1, '`bool` `int` dan meros oladi (`True`).', '`bool` inherits from `int`.'),
      q('q0907_5', 'Har bir Python klassi oxir-oqibat qaysi bazaviy klassdan meros oladi?', 'Root base class of all new-style classes in Python 3?', ['Base', 'Root', 'object', 'type'], ['Base', 'Root', 'object', 'type'], 2, '`object`.', '`object`.'),
    ],
    homework: hw('Xodimlar Iyerarxiyasi', 'Staff Payroll Inheritance', '`Staff(name, base)` bazaviy klassi va undan meros oluvchi `Developer(Staff)` (bonus qo‘shiladi) hamda `Intern(Staff)` (soatlik to‘lov) klasslarini yozib, umumiy `total_payroll(members)` hisoblang.', 'Build `Staff`, `Developer`, and `Intern` using `super().__init__()` and compute combined payroll.', ['super().__init__() to‘g‘ri ishlashi', 'total_payroll polimorf tarzda `.calc_pay()` chaqirishi'], ['Use super().__init__()', 'Compute total payroll across subclasses'], 'for m in members: total += m.calc_pay()', 'Polymorphic sum.', '`__repr__` ham qo‘shing.', 'Add `__repr__`.', 25),
    reviewCheckpoint: review(
      19,
      'Review Loyiha #19: Bank Hisoblari Iyerarxiyasi (OOP 1–7 darslar)',
      'Review Project #19: Bank Account Inheritance System',
      '95-dars marrasi! Encapsulation (`@property`) va Merosxo‘rlik (`super()`) ni birlashtirib, `Account` bazasi asosida `SavingsAccount` (foiz qo‘shadigan) va `CheckingAccount` (komissiyali) tizimini quring.',
      '95-lesson milestone! Combine properties and inheritance (`SavingsAccount` + `CheckingAccount`) with `super()` validation.',
      ['`Account` bazaviy klassida `@property balance` himoyasi', '`SavingsAccount.apply_interest(rate)` metodi', '`CheckingAccount.withdraw()` da komissiya bilan `super().withdraw()`'],
      ['Encapsulated `Account` base class', '`SavingsAccount` interest calculation', '`CheckingAccount` fee via `super().withdraw()`'],
      `class Account:
    def __init__(self, owner: str, balance: float):
        self.owner = owner
        self._balance = balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount

    def withdraw(self, amount: float) -> None:
        if amount <= 0 or amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount

    @property
    def balance(self) -> float:
        return self._balance

class SavingsAccount(Account):
    def apply_interest(self, rate: float) -> None:
        self.deposit(round(self.balance * rate, 2))

s = SavingsAccount("Aziza", 1000.0)
s.apply_interest(0.05)
print(s.owner, s.balance)
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-09-08',
    courseId: 'oop',
    moduleId: 'c09_m4',
    order: 8,
    titleUz: 'Polymorphism — polimorfizm va Duck Typing',
    titleEn: 'Polymorphism, Duck Typing & Protocol',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-09-07'],
    conceptId: 'oop_polymorphism',
    whyUz: "To‘lov tizimingizda Click, Payme, Stripe, Naqd — 4 ta har xil to‘lov turi bor. Agar har birini `if method == 'click': ... elif method == 'payme': ...` deb yozsangiz, kod kengayganda portlaydi. **Polymorphism** esa barchasiga yagona `.pay(amount)` interfeysini berib, `if/elif` zanjirini yo‘q qiladi!",
    whyEn: 'Polymorphism allows a single function to operate uniformly across different object types exposing the same method contract—either via inheritance or Python Duck Typing / `typing.Protocol`.',
    analogyUz: "Elektr rozetkasi choynak ham, noutbuk ham, lampa ham qabul qiladi — rozetkaga ichkarida nima borligi qiziq emas, faqat **vilkasi standartga mos bo‘lsa** bas (**Duck Typing**)! ",
    analogyEn: 'A power outlet works with lamps, kettles, and laptops alike—it cares only that the plug fits the interface, not the internal brand.',
    stopsUz: "Python da polimorfizm **majburiy umumiy ota klass talab qilmaydi**! *\"If it walks like a duck and quacks like a duck, it’s a duck.\"* Statik tiplash (`mypy`/`pyright`) uchun esa `typing.Protocol` strukturaviy polimorfizmni tekshiradi.",
    stopsEn: 'Python polymorphism does not strictly require sharing a base class; Duck Typing and `typing.Protocol` verify structural behavior without rigid inheritance coupling.',
    objUz: ['Bir xil metod nomini turli klasslarda har xil amalga oshirish', 'Duck Typing: umumiy ota klasssiz polimorf funksiyalar yozish', '`typing.Protocol` orqali strukturaviy shartnomani (interface) hujjatlashtirish'],
    objEn: ['Implement polymorphic dispatch across unrelated or related classes', 'Leverage Python Duck Typing cleanly', 'Define structural contracts using `typing.Protocol`'],
    theoryUz: `### 1. Polimorfizm Nima?
"Ko‘p shakllilik" — bitta funksiya yoki sikl turli obyektlar ustida ularning turini \`if/elif\` bilan tekshirmasdan bitta metod (\`.render()\`, \`.pay()\`) orqali ishlashi.
### 2. Inheritance Polimorfizmi vs Duck Typing
- **Inheritance**: barcha vorislar umumiy ota metodini override qiladi.
- **Duck Typing**: klasslar umuman qarindosh bo‘lmasa ham, bir xil \`send(msg)\` metodiga ega bo‘lsa kifoya!
### 3. Operator Polimorfizmi
\`+\` operatori \`int\` ni qo‘shadi, \`str\` va \`list\` ni birlashtiradi — bu ham polimorfizm!
### 4. \`typing.Protocol\` (Structural Subtyping)
\`\`\`python
from typing import Protocol
class Notifier(Protocol):
    def send(self, text: str) -> str: ...
\`\`\`
### 5. Keng tarqalgan xato
Polimorf obyektlar oldida \`if isinstance(x, Email): ... elif isinstance(x, SMS): ...\` yozib polimorfizm maʼnosini yo‘qqa chiqarish.`,
    theoryEn: `### 1. What Is Polymorphism?
Write generic caller code that invokes \`.export()\` or \`.pay()\` uniformly without branching on concrete object classes.
### 2. Duck Typing
In Python, an object only needs the expected methods—no forced shared base class required.
### 3. Built-in Polymorphism
\`len()\`, \`+\`, and \`for x in obj\` are polymorphic across lists, dicts, strings, and custom classes.
### 4. \`typing.Protocol\`
Define structural interfaces statically checked by type checkers without runtime inheritance.
### 5. Type-Branching Anti-Pattern
Replacing polymorphic dispatch with \`if isinstance(x, A): ... elif isinstance(x, B): ...\` defeats Open/Closed design.`,
    examples: [
      ex('Misol 1: Duck Typing to‘lov protsessorlari', 'Example 1: Duck-Typed Payment Processors', `class CardPay:\n    def pay(self, amt: int) -> str:\n        return f"Card charged {amt}"\n\nclass WalletPay:\n    def pay(self, amt: int) -> str:\n        return f"Wallet debited {amt}"\n\ndef checkout(processor, amount: int) -> None:\n    print(processor.pay(amount))\n\nfor p in [CardPay(), WalletPay()]:\n    checkout(p, 50000)`, `Card charged 50000\nWallet debited 50000`, '`CardPay` va `WalletPay` umumiy ota klassga ega emas, lekin `checkout()` ikkalasi bilan birdek ishlaydi!', 'Unrelated classes work seamlessly inside `checkout()` via Duck Typing.'),
      ex('Misol 2: `typing.Protocol` bilan strukturaviy kontrakt', 'Example 2: Structural Typing with Protocol', `from typing import Protocol\n\nclass Drawable(Protocol):\n    def draw(self) -> str: ...\n\nclass Circle:\n    def draw(self) -> str: return "O"\n\nclass Square:\n    def draw(self) -> str: return "[]"\n\ndef render(shapes: list[Drawable]) -> str:\n    return " ".join(s.draw() for s in shapes)\n\nprint(render([Circle(), Square()]))`, `O []`, '`Protocol` voris olishni majbur qilmasdan interfeys shartnomasini belgilaydi.', '`Protocol` documents the required method contract cleanly.'),
      ex('Misol 3: Built-in `len()` polimorfizmi', 'Example 3: Polymorphic Built-ins', `for item in ["abc", [1, 2, 3, 4], {"k": 1}]:\n    print(type(item).__name__, len(item))`, `str 3\nlist 4\ndict 1`, 'Bitta `len()` funksiyasi `__len__` ga ega har qanday tur bilan ishlaydi.', '`len()` dispatches polymorphically via each object’s `__len__`.'),
    ],
    traceTitleUz: 'Polimorf dispatch izi',
    traceTitleEn: 'Tracing Polymorphic Loop',
    traceCode: `class A:\n    def run(self): return 1\nclass B:\n    def run(self): return 2\nprint([x.run() for x in (A(), B())])`,
    traceSteps: [
      traceStep(1, 'x = A()', 'A.run()', '1-element A.run() chaqirdi', 'Called A.run()'),
      traceStep(2, 'x = B()', 'B.run()', '2-element B.run() chaqirdi', 'Called B.run()'),
      traceStep(3, 'print(...)', '[1, 2]', 'Natija yig‘ildi', 'Printed [1, 2]', '[1, 2]'),
    ],
    commonMistakes: [
      mistake('Polimorfizm o‘rniga `if isinstance(...)` zanjiri yozish', 'Type-Switching Instead of Polymorphism', `class SMS: pass\nclass Email: pass\ndef send_bad(ch):\n    if isinstance(ch, SMS): return "sms"\n    elif isinstance(ch, Email): return "email"\nprint(send_bad(SMS()))`, 'Requires editing send_bad for every new channel!', `class SMS:\n    def send(self): return "sms"\nclass Email:\n    def send(self): return "email"\ndef send_ok(ch): return ch.send()\nprint(send_ok(SMS()), send_ok(Email()))`, 'Yangi kanal (Telegram) qo‘shilsa `send_bad` ni qayta tahrirlashga to‘g‘ri keladi.', 'Type-switching violates the Open/Closed principle.', 'Har bir kanalga bir xil `.send()` metodini bering.', 'Give every channel a uniform `.send()` method.'),
      mistake('Metod nomlarini moslashtirmaslik', 'Mismatched Method Names Breaking Duck Typing', `class JsonExp:\n    def export_json(self): return "{}"\n# A caller expecting .export() will raise AttributeError!`, 'AttributeError on polymorphic call', `class JsonExp:\n    def export(self): return "{}"\nprint(JsonExp().export())`, 'Duck typing ishlashi uchun metod imzosi (nomi va parametrlari) bir xil bo‘lishi shart.', 'Polymorphic callers require identical method names and signatures.', 'Umumiy shartnomani `Protocol` bilan aniq belgilang.', 'Standardize signatures with a `Protocol`.'),
    ],
    compareTitleUz: 'Duck Typing (`Protocol`) vs `isinstance()` Shoxlari',
    compareTitleEn: 'Polymorphism vs `if isinstance()` Branches',
    compareUz: ['Polimorfizm / `Protocol`: yangi klass qo‘shishda mavjud funksiyalarga tegilmaydi (Open/Closed).', '`isinstance()` zanjiri: faqat deserializatsiya yoki tashqi xom ma’lumot parsingda kamdan-kam kerak.'],
    compareEn: ['Polymorphism / `Protocol`: extend behavior by adding new classes without editing callers.', '`isinstance()` branching: couples caller to every concrete type.'],
    compareSummaryUz: 'Python da metod shartnomasiga tayaning (`Protocol`/Duck Typing) — yangi turlarni `if/elif` siz ulang.',
    compareSummaryEn: 'Design around shared method contracts (`Protocol` / Duck Typing) instead of concrete type switches.',
    practiceTasks: [
      pt('p0908_1', '1-mashq: Duck Typing funksiyasi', 'Task 1: Duck-Typed Helper', '`Dog` va `Robot` klasslariga `.sound()` berib `make_noise(obj)` yozing.', 'Call .sound() polymorphically.', `class Dog:\n    def sound(self): return "Woof"\nclass Robot:\n    def sound(self): return "Beep"\ndef make_noise(obj): return obj.sound()\nprint(make_noise(Dog()), make_noise(Robot()))`, 'Woof Beep', 'Return obj.sound()', 'Prints Woof Beep.'),
      pt('p0908_2', '2-mashq: Siklda polimorf hisoblash', 'Task 2: Polymorphic Area Sum', '`Square(side)` va `Rect(w, h)` uchun `.area()` yozib yig‘indisini toping.', 'Sum areas polymorphically.', `class Square:\n    def __init__(self, s): self.s = s\n    def area(self): return self.s * self.s\nclass Rect:\n    def __init__(self, w, h): self.w, self.h = w, h\n    def area(self): return self.w * self.h\nprint(sum(x.area() for x in [Square(3), Rect(2, 5)]))`, '19', '9 + 10 = 19', 'Prints 19.'),
      pt('p0908_3', '3-mashq: `Protocol` bilan funksiya', 'Task 3: Protocol Annotation', '`Formatter(Protocol)` bilan `PlainFmt` va `UpperFmt` yarating.', 'Use typing.Protocol.', `from typing import Protocol\nclass Fmt(Protocol):\n    def apply(self, s: str) -> str: ...\nclass Upper:\n    def apply(self, s: str) -> str: return s.upper()\ndef run(f: Fmt, s: str) -> str: return f.apply(s)\nprint(run(Upper(), "py"))`, 'PY', 'Implement apply(self, s)', 'Prints PY.'),
      pt('p0908_4', '4-mashq: Polimorf eksport', 'Task 4: Exporters List', '`CSVExp` va `TXTExp` da `.dump([1, 2])` natijalarini chiqaring.', 'Call .dump() in loop.', `class CSVExp:\n    def dump(self, xs): return ",".join(map(str, xs))\nclass TXTExp:\n    def dump(self, xs): return " ".join(map(str, xs))\nprint([e.dump([1, 2]) for e in (CSVExp(), TXTExp())])`, "['1,2', '1 2']", 'Two dump implementations', 'Prints formatted list.'),
      pt('p0908_5', '5-mashq: `+` operatori polimorfizmi', 'Task 5: Operator Polymorphism', '`2 + 3` va `"2" + "3"` natijasini bir qatorda chiqaring.', 'Show + polymorphism.', `print(2 + 3, "2" + "3")`, '5 23', 'int vs str addition', 'Prints 5 23.'),
    ],
    quiz: [
      q('q0908_1', 'Python da "Duck Typing" nimani anglatadi?', 'What does Duck Typing mean in Python?', ['Faqat o‘rdaklar klassi', 'Obyektning aniq klassi emas, kerakli metod/xususiyatlarga egaligi muhim', 'Majburiy ota klass kerak', 'Faqat int ishlatish'], ['Duck class only', 'Compatibility depends on expected methods/behavior rather than explicit class hierarchy', 'Strict parent required', 'Ints only'], 1, 'Obyekt kerakli metodga ega bo‘lsa kifoya.', 'Behavior over explicit class heritage.'),
      q('q0908_2', '`typing.Protocol` nima uchun ishlatiladi?', 'What is `typing.Protocol` used for?', ['Tarmoq protokoli ochish', 'Strukturaviy (Duck Typing) interfeys shartnomasini static tiplash uchun', 'SQL yozish', 'Thread yaratish'], ['Network sockets', 'Static structural subtyping contracts', 'SQL', 'Threading'], 1, 'Strukturaviy interfeyslar uchun.', 'Structural subtyping interfaces.'),
      q('q0908_3', 'Polimorfizm qaysi yomon odatdan xalos qiladi?', 'Which anti-pattern does polymorphism eliminate?', ['`for` siklidan', 'Har bir tur uchun uzun `if isinstance(...) / elif` zanjiridan', 'Funksiyalardan', 'Type hintlardan'], ['for loops', 'Long `if isinstance(...) / elif` switches', 'Functions', 'Type hints'], 1, 'Uzun `if isinstance(...)` shoxlaridan.', 'Type-checking switches.'),
      q('q0908_4', 'Duck Typing ishlatish uchun ikki klass bitta ota klassdan meros olishi shartmi?', 'Must two classes share a parent class to work with Duck Typing?', ['Ha, albatta', 'Yo‘q, bir xil metod imzosiga ega bo‘lishi kifoya', 'Faqat dataclass da', 'Faqat Python 2 da'], ['Yes always', 'No, matching method signatures suffice', 'Dataclasses only', 'Python 2 only'], 1, 'Yo‘q, metod imzosi mos bo‘lsa kifoya.', 'No inheritance required.'),
      q('q0908_5', 'Built-in `len(x)` har xil turlarda ishlashi qaysi tamoyilga misol?', '`len(x)` working on strings, lists, and dicts demonstrates:', ['Recursion', 'Polymorphism', 'Compilation', 'Global Scope'], ['Recursion', 'Polymorphism', 'Compilation', 'Global Scope'], 1, 'Polimorfizm.', 'Polymorphism.'),
    ],
    homework: hw('Polimorf Bildirishnomalar Dvigateli', 'Polymorphic Notification Dispatcher', '`Notifier` `Protocol` ini yarating va undan meros olmaydigan `EmailNotifier`, `TelegramNotifier`, `LogNotifier` klasslarini yozing; `broadcast(notifiers, msg)` hammasiga xabar yuborsin.', 'Define a `Notifier` `Protocol` and three independent notifier classes, then write `broadcast(notifiers, msg)`.', ['Hech qanday if/isinstance ishlatilmasin', 'Barcha klasslar `.send(msg)` ni amalga oshirsin'], ['Zero isinstance branches', 'Uniform `.send(msg)` method'], 'return [n.send(msg) for n in notifiers]', 'List comprehension dispatch.', 'Xatoga chidamli (`try/except`) versiyasini qo‘shing.', 'Add fault-tolerant delivery.', 20),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-09-09',
    courseId: 'oop',
    moduleId: 'c09_m4',
    order: 9,
    titleUz: 'Abstraction — abstraksiya va abc.ABC',
    titleEn: 'Abstraction with abc.ABC & @abstractmethod',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-09-08'],
    conceptId: 'oop_abstraction',
    whyUz: "Agar hamkasbingiz yangi `StorageBackend` (masalan `S3Storage`) yozayotib `.save()` metodini yozishni unutib qo‘ysa, oddiy klassda xato faqat ish paytida chiqadi. **`abc.ABC` va `@abstractmethod`** esa kerakli metod yozilmaguncha klassdan obyekt yaratishga umuman ruxsat bermaydi!",
    whyEn: 'Abstract Base Classes (`abc.ABC` + `@abstractmethod`) enforce architectural contracts at instantiation time, preventing incomplete subclasses from running in production.',
    analogyUz: "**Abstract Base Class (ABC)** — bu litsenziya blankasi: \"Chiqindi tashuvchi mashina bo‘lmoqchimisan? Unda albatta `load()` va `unload()` funksiyasi bo‘lishi shart — bo‘lmasa zavoddan chiqarmayman!\"",
    analogyEn: 'An ABC is a mandatory certification checklist: you cannot instantiate a subclass until every `@abstractmethod` is implemented.',
    stopsUz: "1) `ABC` klassining o‘zidan bevosita obyekt yaratib bo‘lmaydi (`TypeError`). 2) Har bir `@abstractmethod` ni voris klass amalga oshirishi shart. 3) Abstrakt klass ichida umumiy yordamchi oddiy metodlar ham bo‘lishi mumkin (bu uni `Protocol` dan farqlaydi!).",
    stopsEn: 'An ABC cannot be instantiated directly if any `@abstractmethod` remains unimplemented. Unlike pure `Protocol`s, ABCs can also bundle shared concrete helper methods.',
    objUz: ['`from abc import ABC, abstractmethod` bilan abstrakt bazaviy klass yozish', 'To‘liq amalga oshirilmagan voris klassda `TypeError` himoyasini ko‘rish', 'Umumiy tayyor metod + `@abstractmethod` birgalikda (Template Method) ishlatish'],
    objEn: ['Define `ABC` subclasses with `@abstractmethod` contracts', 'Verify `TypeError` guards against incomplete instantiation', 'Combine shared concrete helpers with abstract hooks'],
    theoryUz: `### 1. Abstraksiya Nima?
Foydalanuvchiga murakkab ichki tafsilotlarni yashirib, faqat **"nima qilishi kerak"** degan toza shartnomani ko‘rsatish.
### 2. \`abc.ABC\` va \`@abstractmethod\`
\`\`\`python
from abc import ABC, abstractmethod
class Exporter(ABC):
    @abstractmethod
    def export(self, data: dict) -> str: ...
\`\`\`
### 3. Instantiation Himoyasi
\`Exporter()\` yoki \`export()\` metodini yozmagan voris \`BadExporter()\` chaqirilganda Python darhol \`TypeError: Can't instantiate abstract class\` chiqaradi!
### 4. Template Method Pattern
Abstrakt klass ichida umumiy oqimni yozib, faqat o‘zgaruvchi bosqichni \`@abstractmethod\` qilib qoldirish mumkin!
### 5. \`Protocol\` vs \`ABC\`
- **Protocol**: meros shart emas, faqat static type checking.
- **ABC**: qatʼiy runtime tekshiruv + umumiy kodni meros berish.`,
    theoryEn: `### 1. Abstraction Principle
Hide implementation mechanics behind a minimal, mandatory interface contract.
### 2. \`abc.ABC\` & \`@abstractmethod\`
Mark required methods with \`@abstractmethod\` on classes inheriting \`ABC\`.
### 3. Runtime Enforcement
Instantiating the ABC or any incomplete subclass raises \`TypeError\` immediately.
### 4. Shared Concrete Helpers
ABCs can define concrete template methods that call \`self.abstract_hook()\`.
### 5. Choosing \`ABC\` vs \`Protocol\`
Use \`Protocol\` for loose duck typing; use \`ABC\` when sharing base implementation + enforcing runtime checks.`,
    examples: [
      ex('Misol 1: `ABC` va `TypeError` himoyasi', 'Example 1: Runtime Guard on Incomplete Subclass', `from abc import ABC, abstractmethod\n\nclass Serializer(ABC):\n    @abstractmethod\n    def dumps(self, obj: dict) -> str: ...\n\nclass Broken(Serializer):\n    pass\n\nclass JsonLike(Serializer):\n    def dumps(self, obj: dict) -> str:\n        return str(obj)\n\ntry:\n    Broken()\nexcept TypeError:\n    print("Blocked incomplete subclass!")\nprint(JsonLike().dumps({"ok": True}))`, `Blocked incomplete subclass!\n{'ok': True}`, '`Broken` klassi `dumps` ni yozmagani uchun darhol bloklandi.', '`Broken()` fails fast with `TypeError`, while `JsonLike` succeeds.'),
      ex('Misol 2: Template Method (Umumiy metod + Abstract hook)', 'Example 2: Concrete Template + Abstract Step', `from abc import ABC, abstractmethod\n\nclass Report(ABC):\n    def generate(self, items: list[str]) -> str:\n        return f"[{self.header()}] " + ", ".join(items)\n    @abstractmethod\n    def header(self) -> str: ...\n\nclass SalesReport(Report):\n    def header(self) -> str:\n        return "SALES"\n\nprint(SalesReport().generate(["A", "B"]))`, `[SALES] A, B`, '`generate()` umumiy mantiqni beradi, `header()` esa vorisga majburiy qoldiriladi.', 'Concrete `generate()` orchestrates the flow while subclasses implement `header()`.'),
      ex('Misol 3: `super()` bilan abstrakt metodga default hook qo‘shish', 'Example 3: Abstract Method with Base Logic', `from abc import ABC, abstractmethod\n\nclass Plugin(ABC):\n    @abstractmethod\n    def name(self) -> str:\n        return "plugin"\n\nclass AuthPlugin(Plugin):\n    def name(self) -> str:\n        return super().name() + ":auth"\n\nprint(AuthPlugin().name())`, `plugin:auth`, 'Abstrakt metod ichida ham `super()` orqali chaqiriladigan default kod bo‘lishi mumkin.', 'Abstract methods can still hold base helper logic accessed via `super()`.'),
    ],
    traceTitleUz: 'Abstrakt tekshiruv izi',
    traceTitleEn: 'Tracing ABC Check',
    traceCode: `from abc import ABC, abstractmethod\nclass Shape(ABC):\n    @abstractmethod\n    def area(self) -> int: ...\nclass Unit(Shape):\n    def area(self) -> int: return 1\nprint(Unit().area())`,
    traceSteps: [
      traceStep(1, 'Shape.__abstractmethods__', "{'area'}", 'Shape abstrakt metodga ega', 'Shape tracks abstract methods'),
      traceStep(2, 'Unit.__abstractmethods__', 'frozenset()', 'Unit barcha metodni yozdi', 'Unit cleared abstract set'),
      traceStep(3, 'print(Unit().area())', '1', 'Muvaffaqiyatli ishladi', 'Printed 1', '1'),
    ],
    commonMistakes: [
      mistake('`ABC` dan meros olmasdan `@abstractmethod` ishlatish', 'Using @abstractmethod Without Inheriting ABC', `from abc import abstractmethod\nclass Base:\n    @abstractmethod\n    def go(self): pass\nb = Base()\nprint("Created Base without error!")`, 'Fails silently — Base() is NOT blocked!', `from abc import ABC, abstractmethod\nclass Base(ABC):\n    @abstractmethod\n    def go(self): pass\ntry:\n    Base()\nexcept TypeError:\n    print("Now properly blocked!")`, '`ABC` (yoki `ABCMeta`) bo‘lmasa `@abstractmethod` hech qanday himoya qilmaydi!', 'Without `ABC` metaclass, `@abstractmethod` is ignored at instantiation.', 'Doim `class Base(ABC):` deb yozing.', 'Always inherit from `abc.ABC`.'),
      mistake('Abstrakt metod nomi vorisda xato yozilishi', 'Typo in Overriding Abstract Method', `# def seralize(self): instead of serialize(self): stays abstract!`, 'TypeError upon instantiating child class', `print("Match the exact abstract method name and signature!")`, 'Bir harf xato bo‘lsa voris klass hali ham abstrakt bo‘lib qolaveradi.', 'A misspelled method name leaves the abstract method unimplemented.', 'IDE/mypy tekshiruvini yoqing.', 'Verify signatures with a type checker.'),
    ],
    compareTitleUz: '`abc.ABC` vs `typing.Protocol`',
    compareTitleEn: '`abc.ABC` vs `typing.Protocol`',
    compareUz: ['`abc.ABC`: runtime da `TypeError` bilan himoyalaydi va tayyor yordamchi metodlarni meros beradi.', '`typing.Protocol`: merossiz duck-typing va static type-checker uchun yengil interfeys.'],
    compareEn: ['`abc.ABC`: runtime instantiation check + shared base methods.', '`typing.Protocol`: structural typing without inheritance.'],
    compareSummaryUz: 'Umumiy kod va majburiy runtime shartnoma kerak bo‘lsa `ABC`, yengil strukturaviy shartnoma uchun `Protocol` ishlating.',
    compareSummaryEn: 'Use `ABC` when sharing concrete template code with runtime enforcement; use `Protocol` for duck-typed interfaces.',
    practiceTasks: [
      pt('p0909_1', '1-mashq: `ABC` ni bloklash', 'Task 1: Verify ABC Blocks Instantiation', '`Job(ABC)` da `@abstractmethod def run(self): ...` yozib `Job()` `TypeError` berishini tuting.', 'Catch TypeError on ABC().', `from abc import ABC, abstractmethod\nclass Job(ABC):\n    @abstractmethod\n    def run(self): ...\ntry:\n    Job()\nexcept TypeError:\n    print("blocked")`, 'blocked', 'Inherits ABC', 'Prints blocked.'),
      pt('p0909_2', '2-mashq: To‘liq voris klass', 'Task 2: Concrete Subclass', '`CleanJob(Job)` `run()` -> `"done"` yozib chiqaring.', 'Implement run() on CleanJob.', `from abc import ABC, abstractmethod\nclass Job(ABC):\n    @abstractmethod\n    def run(self): ...\nclass CleanJob(Job):\n    def run(self): return "done"\nprint(CleanJob().run())`, 'done', 'Implement def run(self)', 'Prints done.'),
      pt('p0909_3', '3-mashq: Template Method', 'Task 3: Concrete + Abstract', '`Formatter(ABC)` da `format(x)` `f"<{self.tag()}:{x}>"` qaytarsin, `TagFmt.tag()` -> `"py"`.', 'Implement Template Method.', `from abc import ABC, abstractmethod\nclass Fmt(ABC):\n    def format(self, x): return f"<{self.tag()}:{x}>"\n    @abstractmethod\n    def tag(self): ...\nclass TagFmt(Fmt):\n    def tag(self): return "py"\nprint(TagFmt().format("ok"))`, '<py:ok>', 'Calls self.tag()', 'Prints <py:ok>.'),
      pt('p0909_4', '4-mashq: `__abstractmethods__`', 'Task 4: Inspect Abstract Set', '`sorted(Job.__abstractmethods__)` ni chiqaring.', 'Print abstract method names.', `from abc import ABC, abstractmethod\nclass Job(ABC):\n    @abstractmethod\n    def a(self): ...\n    @abstractmethod\n    def b(self): ...\nprint(sorted(Job.__abstractmethods__))`, "['a', 'b']", 'Job.__abstractmethods__', "Prints ['a', 'b']."),
      pt('p0909_5', '5-mashq: `@property` + `@abstractmethod`', 'Task 5: Abstract Property', '`Config(ABC)` da `@property @abstractmethod def env(self): ...` yozib `DevConfig` yarating.', 'Combine @property and @abstractmethod.', `from abc import ABC, abstractmethod\nclass Cfg(ABC):\n    @property\n    @abstractmethod\n    def env(self): ...\nclass Dev(Cfg):\n    @property\n    def env(self): return "dev"\nprint(Dev().env)`, 'dev', '@property above @abstractmethod', 'Prints dev.'),
    ],
    quiz: [
      q('q0909_1', 'Abstrakt klass yoki chala vorisdan obyekt yaratmoqchi bo‘lsak Python qaysi xatoni chiqaradi?', 'Exception raised when instantiating an abstract class?', ['ValueError', 'TypeError', 'RuntimeError', 'NotImplementedError'], ['ValueError', 'TypeError', 'RuntimeError', 'NotImplementedError'], 1, '`TypeError: Can\'t instantiate abstract class...`', '`TypeError`.'),
      q('q0909_2', '`@abstractmethod` ishlashi uchun klass nimadan meros olishi shart?', 'What must a class inherit so `@abstractmethod` is enforced?', ['object', 'abc.ABC', 'Protocol', 'Enum'], ['object', 'abc.ABC', 'Protocol', 'Enum'], 1, '`abc.ABC`.', '`abc.ABC`.'),
      q('q0909_3', 'Abstrakt klass ichida oddiy (tayyor) metodlar ham bo‘lishi mumkinmi?', 'Can an `ABC` contain concrete non-abstract methods?', ['Yo‘q', 'Ha (Template Method pattern)', 'Faqat __init__', 'Faqat staticmethod'], ['No', 'Yes (e.g., Template Method)', '__init__ only', 'staticmethod only'], 1, 'Ha, tayyor metodlar meros qilib berilishi mumkin.', 'Yes, concrete helpers work naturally.'),
      q('q0909_4', '`@property` va `@abstractmethod` birga yozilganda qaysi biri tepada turadi?', 'When stacking `@property` and `@abstractmethod`, which goes on top?', ['@abstractmethod', '@property', 'Farqi yo‘q', 'Birga bo‘lmaydi'], ['@abstractmethod', '@property', 'Order irrelevant', 'Not allowed'], 1, '`@property` eng tepada, `@abstractmethod` pastida.', '`@property` outermost, `@abstractmethod` innermost.'),
      q('q0909_5', 'Merossiz faqat strukturaviy tiplash kerak bo‘lsa nima qulay?', 'For structural typing without inheritance, which tool is best?', ['ABC', 'typing.Protocol', 'super()', 'slots'], ['ABC', 'typing.Protocol', 'super()', 'slots'], 1, '`typing.Protocol`.', '`typing.Protocol`.'),
    ],
    homework: hw('Storage Backend Abstraksiyasi', 'Pluggable Storage ABC', '`StorageBackend(ABC)` (`save(key, val)` va `load(key)` abstrakt metodlari) hamda `MemoryStorage` va `PrefixedMemoryStorage` vorislarini yozing.', 'Create `StorageBackend(ABC)` with abstract `save`/`load` and build two concrete backends passing shared tests.', ['ABC + @abstractmethod', 'Chala klass yaratilganda TypeError testi'], ['Use ABC + @abstractmethod', 'Test TypeError on incomplete child'], 'class MemoryStorage(StorageBackend): ...', 'Dict-backed storage.', 'JSON eksport qiluvchi `dump_all()` konkret metodini `ABC` ga qo‘shing.', 'Add concrete `dump_all()` to ABC.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-09-10',
    courseId: 'oop',
    moduleId: 'c09_m4',
    order: 10,
    titleUz: 'Composition — kompozitsiya va Mixin lar',
    titleEn: 'Composition Over Inheritance & Mixins',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-09-09'],
    conceptId: 'oop_composition',
    whyUz: "Mashinada dvigatel bor — lekin mashina dvigatel **emas** (`Car` does NOT inherit `Engine`!). Katta loyihalarda hamma narsani merosxo‘rlik bilan ulash kodni qotirib qo‘yadi. **Composition (\"has-a\")** esa obyektlarni LEGO kabi alohida qismlardan yig‘ish imkonini beradi!",
    whyEn: 'Composition ("has-a") assembles complex objects out of replaceable collaborator parts instead of rigid deep inheritance trees ("is-a").',
    analogyUz: "**Inheritance**: siz ota-onangizdan ko‘z rangini meros olasiz (o‘zgartirib bo‘lmaydi). **Composition**: mashina dvigateli (`self.engine = ElectricEngine()`) — xohlagan payt uni `HybridEngine()` ga almashtirib qo‘yish mumkin (Dependency Injection)!",
    analogyEn: 'Inheritance welds parts permanently together; composition snaps modular components (`self.engine`) in so they can be swapped or mocked cleanly.',
    stopsUz: "Dasturiy muhandislik oltin qoidasi: **\"Favor composition over inheritance\"**. Merosxo‘rlikni faqat haqiqiy **\"is-a\"** munosabatlarda (1-2 qavat), boshqa hollarda esa **\"has-a\"** (`self.logger`, `self.repo`, `self.mailer`) kompozitsiyasini ishlating! **Mixins** esa holat saqlamaydigan kichik qo‘shimcha qobiliyat klasslaridir (`JsonMixin`).",
    stopsEn: 'Favor composition over inheritance: model "has-a" collaborators via injected attributes (`self.repo`, `self.notifier`) for easy testing and swapping.',
    objUz: ['`"is-a"` (Inheritance) vs `"has-a"` (Composition) farqini qo‘llash', 'Dependency Injection orqali qismlarni almashtirish (Real vs Mock)', 'Stateless Mixin klasslar (`TimestampMixin`, `DictMixin`) yaratish'],
    objEn: ['Distinguish "is-a" inheritance from "has-a" composition', 'Inject swappable collaborators (e.g. mock notifier in tests)', 'Build small stateless Mixin classes safely'],
    theoryUz: `### 1. "Is-A" vs "Has-A"
- \`Manager is-a Employee\` -> Merosxo‘rlik.
- \`OrderService has-a PaymentGateway\` -> **Kompozitsiya** (\`self.gateway = gateway\`).
### 2. Dependency Injection (DI)
Qismni klass ichida qattiq yaratmasdan (\`self.db = PostgresDB()\`), tashqaridan parametr qilib uzatish (\`def __init__(self, db):\`) testlashda \`FakeDB()\` berishga imkon ochadi!
### 3. Kompozitsiyaning 3 Afzalligi
1. Run-time da qismlarni almashtirish mumkin.
2. Ota klass o‘zgarganda sinmaydi.
3. Har bir komponentni alohida test qilish oson.
### 4. Mixins Nima?
O‘zining \`__init__\` holatiga ega bo‘lmagan, faqat qo‘shimcha metod beradigan yengil klass (\`class JsonMixin:\`).
### 5. Keng tarqalgan xato
\`class Car(Engine, Wheels, GPS):\` deb mantiqsiz ko‘p merosxo‘rlik qilish.`,
    theoryEn: `### 1. "Is-A" vs "Has-A"
Model taxonomy with inheritance; model capabilities and dependencies with composition.
### 2. Dependency Injection
Accept collaborators via \`__init__(self, gateway)\` rather than hardcoding concrete dependencies inside constructors.
### 3. Why Composition Scales
Easy mocking in unit tests, runtime strategy swapping, zero fragile-base-class coupling.
### 4. Mixin Classes
Stateless helper classes (no \`__init__\`) providing focused reusable methods like serialization or logging.
### 5. Misusing Multiple Inheritance
Never inherit from parts (\`class Car(Engine)\`)—compose them (\`self.engine = engine\`).`,
    examples: [
      ex('Misol 1: Kompozitsiya va Dependency Injection', 'Example 1: Swappable Collaborators via DI', `class ConsoleLog:\n    def write(self, msg: str) -> str: return f"[LOG] {msg}"\n\nclass SilentLog:\n    def write(self, msg: str) -> str: return ""\n\nclass OrderService:\n    def __init__(self, logger):\n        self.logger = logger\n    def place(self, item: str) -> str:\n        return self.logger.write(f"Ordered {item}")\n\nprint(OrderService(ConsoleLog()).place("Laptop"))\nprint(repr(OrderService(SilentLog()).place("Laptop")))`, `[LOG] Ordered Laptop\n''`, 'Bir xil `OrderService` turli logger obyektlari bilan hech qanday kod o‘zgartirmay ishlaydi.', 'Injecting different logger objects changes behavior cleanly without subclassing `OrderService`.'),
      ex('Misol 2: Stateless `ReprMixin`', 'Example 2: Lightweight Stateless Mixin', `class DictMixin:\n    def to_dict(self) -> dict:\n        return dict(self.__dict__)\n\nclass User(DictMixin):\n    def __init__(self, name: str, role: str):\n        self.name = name\n        self.role = role\n\nprint(User("Javohir", "dev").to_dict())`, `{'name': 'Javohir', 'role': 'dev'}`, '`DictMixin` hech qanday `__init__` siz barcha klasslarga `.to_dict()` qobiliyati qo‘shadi.', '`DictMixin` adds serialization behavior cleanly with zero state coupling.'),
      ex('Misol 3: Strategiya almashtirish (Strategy Pattern)', 'Example 3: Composed Pricing Strategy', `class FlatDiscount:\n    def calc(self, total: float) -> float: return total - 10\nclass PercentDiscount:\n    def calc(self, total: float) -> float: return total * 0.8\n\nclass Cart:\n    def __init__(self, total: float, discount):\n        self.total = total\n        self.discount = discount\n    def final_price(self) -> float:\n        return self.discount.calc(self.total)\n\nprint(Cart(100, FlatDiscount()).final_price(), Cart(100, PercentDiscount()).final_price())`, `90 80.0`, 'Chegirma strategiyasini kompozitsiya orqali bir qatorda almashtirish mumkin.', 'Composing strategy objects eliminates inheritance explosion (`FlatCart`, `PercentCart`).'),
    ],
    traceTitleUz: 'Kompozitsiya delegatsiya izi',
    traceTitleEn: 'Tracing Composed Delegation',
    traceCode: `class Engine:\n    def start(self): return "vroom"\nclass Car:\n    def __init__(self, eng): self.eng = eng\n    def drive(self): return self.eng.start()\nprint(Car(Engine()).drive())`,
    traceSteps: [
      traceStep(1, 'Car(Engine())', 'car.eng = Engine()', 'Komponent ichkariga uzatildi', 'Injected Engine collaborator'),
      traceStep(2, 'car.drive()', 'self.eng.start()', 'Car vazifani Engine ga uzatdi', 'Delegated to Engine.start()'),
      traceStep(3, 'print(...)', 'vroom', 'Natija chiqdi', 'Printed vroom', 'vroom'),
    ],
    commonMistakes: [
      mistake('`class Car(Engine):` deb mantiqsiz meros olish', 'Inheriting a Part Instead of Composing It', `class Engine:\n    def rpm(self): return 3000\nclass Car(Engine): pass\n# A Car IS NOT an Engine!`, 'Confusing hierarchy — Car exposes raw Engine internals', `class Engine:\n    def rpm(self): return 3000\nclass Car:\n    def __init__(self, eng): self.eng = eng\nprint(Car(Engine()).eng.rpm())`, 'Mashina dvigatel emas, mashinada dvigatel bor (`has-a`).', 'A Car has-an Engine; it is not an Engine.', 'Qismlarni `self.part = part` qilib kompozitsiya qiling.', 'Compose parts via attributes.'),
      mistake('Mixin ichida `__init__` yozib MRO ni chalkashtirish', 'Stateful Mixin Defining __init__', `# Writing __init__ inside mixins often collides with super() arguments!`, 'TypeError during multiple inheritance', `print("Keep Mixins stateless — add methods only!")`, 'Mixin lar holatsiz (stateless) bo‘lishi kerak.', 'Keep mixins focused on stateless helper methods.', 'Mixin ga `__init__` qo‘shmang.', 'Avoid `__init__` in mixins.'),
    ],
    compareTitleUz: 'Inheritance (`is-a`) vs Composition (`has-a`)',
    compareTitleEn: 'Inheritance vs Composition',
    compareUz: ['Inheritance: haqiqiy taksonomiya (`SavingsAccount` bu `Account`).', 'Composition: qismlar/servislarni ulash (`AuthService` da `repo` va `hasher` bor).'],
    compareEn: ['Inheritance: strict taxonomy (`is-a`).', 'Composition: modular assembly (`has-a`) + effortless testing/mocking.'],
    compareSummaryUz: 'Ikkilanganda doim Composition (`self.component`) tanlang — u moslashuvchan, modulli va testga qulay.',
    compareSummaryEn: 'When in doubt, choose Composition (`has-a`) with Dependency Injection.',
    practiceTasks: [
      pt('p0910_1', '1-mashq: Oddiy kompozitsiya', 'Task 1: Laptop Has CPU', '`CPU("M3")` obyektini `Laptop(cpu)` ga uzatib `laptop.cpu.model` chiqaring.', 'Compose CPU into Laptop.', `class CPU:\n    def __init__(self, model): self.model = model\nclass Laptop:\n    def __init__(self, cpu): self.cpu = cpu\nprint(Laptop(CPU("M3")).cpu.model)`, 'M3', 'self.cpu = cpu', 'Prints M3.'),
      pt('p0910_2', '2-mashq: Strategy almashtirish', 'Task 2: Swappable Tax Strategy', '`NoTax` (`0`) va `VatTax` (`0.12`) ni `Invoice` ga uzating.', 'Inject tax calculator.', `class NoTax:\n    def calc(self, x): return x\nclass VatTax:\n    def calc(self, x): return round(x * 1.12, 2)\nclass Invoice:\n    def __init__(self, amt, tax): self.amt, self.tax = amt, tax\n    def total(self): return self.tax.calc(self.amt)\nprint(Invoice(100, NoTax()).total(), Invoice(100, VatTax()).total())`, '100 112.0', 'Inject tax object', 'Prints 100 112.0.'),
      pt('p0910_3', '3-mashq: Stateless Mixin', 'Task 3: KeysMixin', '`KeysMixin` klassiga `keys_count()` (`len(self.__dict__)`) yozing.', 'Create stateless KeysMixin.', `class KeysMixin:\n    def keys_count(self): return len(self.__dict__)\nclass Item(KeysMixin):\n    def __init__(self, a, b): self.a, self.b = a, b\nprint(Item(1, 2).keys_count())`, '2', 'len(self.__dict__)', 'Prints 2.'),
      pt('p0910_4', '4-mashq: Delegatsiya', 'Task 4: Delegate Method', '`Printer` da `out()`, `Report(printer)` da `publish()` -> `printer.out()` yozing.', 'Delegate publish to printer.', `class Printer:\n    def out(self, s): return f"P:{s}"\nclass Report:\n    def __init__(self, p): self.p = p\n    def publish(self, s): return self.p.out(s)\nprint(Report(Printer()).publish("ok"))`, 'P:ok', 'self.p.out(s)', 'Prints P:ok.'),
      pt('p0910_5', '5-mashq: Test Fake/Mock kiritish', 'Task 5: Inject Fake Repo', '`FakeRepo` lug‘at bilan `Service(repo)` ni test qiling.', 'Inject fake dictionary repo.', `class FakeRepo:\n    def get(self, k): return {"u1": "Ali"}[k]\nclass Svc:\n    def __init__(self, r): self.r = r\n    def greet(self, k): return "Hi " + self.r.get(k)\nprint(Svc(FakeRepo()).greet("u1"))`, 'Hi Ali', 'Pass FakeRepo instance', 'Prints Hi Ali.'),
    ],
    quiz: [
      q('q0910_1', 'Kompozitsiya qaysi munosabatni ifodalaydi?', 'Which relationship does Composition model?', ['is-a', 'has-a', 'cannot-be', 'inherits-from'], ['is-a', 'has-a', 'cannot-be', 'inherits-from'], 1, '"has-a" (bor/egadir).', '"has-a".'),
      q('q0910_2', 'Dependency Injection nima uchun foydali?', 'Main benefit of Dependency Injection?', ['Kodni sekinlashtirish', 'Real bazalar o‘rniga testda Fake/Mock obyektlarni oson uzatish', 'Global o‘zgaruvchi ko‘paytirish', 'Merosni majburlash'], ['Slower runtime', 'Easy swapping and mocking of dependencies in tests', 'More globals', 'Force inheritance'], 1, 'Almashtirish va unit testlash osonligi.', 'Easy testing and swapping.'),
      q('q0910_3', 'Yaxshi Mixin klass qanday bo‘lishi kerak?', 'Characteristic of a clean Mixin class?', ['Katta __init__ ga ega', 'Holatsiz (stateless), faqat qo‘shimcha metodlar beruvchi kichik klass', 'Faqat bitta global o‘zgaruvchi', 'Database ulanishi'], ['Heavy __init__', 'Small, stateless helper methods', 'Global state', 'DB connection'], 1, 'Holatsiz, kichik metodlar to‘plami.', 'Stateless helper methods.'),
      q('q0910_4', '"Favor composition over inheritance" qoidasi nimani anglatadi?', 'What does "Favor composition over inheritance" advise?', ['Hech qachon class yozmaslik', 'Qism va xizmatlarni meros olish o‘rniga atribut sifatida ulash', 'Faqat bitta fayl', 'Dunder metodlarni o‘chirish'], ['Avoid classes', 'Compose parts as attributes instead of deep inheritance', 'Single file only', 'Avoid dunders'], 1, 'Meros daraxtini chuqurlashtirmasdan kompozitsiya ishlatish.', 'Use composed parts instead of deep trees.'),
      q('q0910_5', '`OrderService` ga `PaymentGateway` ni `__init__` orqali berish nima deyiladi?', 'Passing `PaymentGateway` into `OrderService.__init__` is called:', ['Recursion', 'Dependency Injection', 'Monkey Patching', 'Shadowing'], ['Recursion', 'Dependency Injection', 'Monkey Patching', 'Shadowing'], 1, 'Dependency Injection.', 'Dependency Injection.'),
    ],
    homework: hw('Modular Order Pipeline', 'Composable Order Service', '`OrderService(repo, notifier, discount)` klassini kompozitsiya va Dependency Injection asosida tuzing; `InMemoryRepo`, `ListNotifier` va `PercentDiscount` komponentlarini ulab buyurtma oqimini ishga tushiring.', 'Compose `OrderService` with injected `repo`, `notifier`, and `discount` collaborators and verify full execution.', ['3 ta alohida komponent', 'Hech qanday merosxo‘rlik ishlatilmasin'], ['3 injected collaborators', 'Pure composition'], 'self.repo.save(...); self.notifier.send(...)', 'Delegate to components.', 'Testda `FakeDiscount` bilan 0% chegirma ssenariysini ham tekshiring.', 'Verify 0% strategy in tests.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-09-11',
    courseId: 'oop',
    moduleId: 'c09_m5',
    order: 11,
    titleUz: 'Magic / Dunder Methods va @dataclass',
    titleEn: 'Dunder Methods & @dataclass',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-09-10'],
    conceptId: 'oop_dunder_dataclass',
    whyUz: "O‘zingiz yaratgan `Money(100, 'USD')` obyektini `print()` qilsangiz `<Money object at 0x...>` chiqadi, `Money(100, 'USD') == Money(100, 'USD')` esa `False` beradi! **Dunder (Magic) metodlar** (`__repr__`, `__eq__`, `__lt__`, `__add__`, `__len__`) va **`@dataclass`** sizning klasslaringizni xuddi Python ning built-in turlari kabi tabiiy qiladi!",
    whyEn: 'Dunder methods (`__repr__`, `__str__`, `__eq__`, `__lt__`, `__len__`) let custom objects integrate natively with `print()`, `==`, `<`, `len()`, and `sorted()`, while `@dataclass` eliminates boilerplate.',
    analogyUz: "**Dunder metodlar** — Python tilining maxfiy rozetkalari! Siz `__len__` ni ulasangiz `len(obj)` ishlaydi, `__lt__` ni ulasangiz `sorted(objs)` avtomatik tartiblaydi; **`@dataclass`** esa bularni siz uchun avtomatik generatsiya qilib beruvchi generator!",
    analogyEn: 'Dunder methods are Python’s protocol hooks—implement `__len__` and `len()` works; `@dataclass` auto-generates `__init__`, `__repr__`, and `__eq__`.',
    stopsUz: "`__repr__` — dasturchi/debugging uchun aniq tasvir (har doim yozing!), `__str__` — foydalanuvchi uchun chiroyli matn. Data-modellar uchun esa qo‘lda `__init__`/`__repr__`/`__eq__` yozmasdan **`@dataclass`** (yoki `@dataclass(frozen=True, order=True)`) ishlating!",
    stopsEn: 'Always define `__repr__` for unambiguous debugging output. For data-holding classes, prefer `@dataclass` (and `frozen=True` for immutable value objects / hashability).',
    objUz: ['`__repr__` va `__str__` farqini bilish', '`__eq__`, `__lt__`, `__add__`, `__len__` bilan operator overloading yozish', '`@dataclass(frozen=True, order=True)` va `field(default_factory=list)` ishlatish'],
    objEn: ['Distinguish `__repr__` vs `__str__`', 'Implement `__eq__`, `__lt__`, `__len__`, and `__add__`', 'Use `@dataclass(frozen=True)` and `field(default_factory=...)`'],
    theoryUz: `### 1. \`__repr__\` vs \`__str__\`
- \`__repr__(self)\`: \`Point(x=2, y=3)\` — debugging, \`repr()\`, ro‘yxat ichida ko‘rinadi.
- \`__str__(self)\`: \`(2, 3)\` — \`print(p)\`, \`str(p)\` chaqirilganda.
### 2. Taqqoslash va Arifmetik Dunderlar
\`__eq__\` (\`==\`), \`__lt__\` (\`<\` va \`sorted()\`), \`__add__\` (\`+\`), \`__len__\` (\`len()\`), \`__contains__\` (\`in\`).
### 3. \`__eq__\` da \`NotImplemented\` Qaytarish
Boshqa tur bilan solishtirilganda \`if not isinstance(other, Money): return NotImplemented\` yozish Python ga o‘ng tomon metodini sinab ko‘rish imkonini beradi.
### 4. \`@dataclass\` Sehrli Dekoratori
\`__init__\`, \`__repr__\`, \`__eq__\` ni avtomatik yozib beradi!
### 5. Mutable Default Xatosi \`@dataclass\` da
Ro‘yxat/lug‘at uchun doim \`tags: list[str] = field(default_factory=list)\` yozing (\`tags: list = []\` esa Python da \`ValueError\` chiqaradi!).`,
    theoryEn: `### 1. \`__repr__\` vs \`__str__\`
\`__repr__\` targets developers and containers (\`[obj]\`); \`__str__\` targets end-user formatting (\`print(obj)\`).
### 2. Rich Comparisons & Containers
Implement \`__eq__\`, \`__lt__\` (enables \`sorted()\`), \`__add__\`, and \`__len__\`.
### 3. Return \`NotImplemented\` on Type Mismatch
In \`__eq__\` / \`__add__\`, return \`NotImplemented\` (not \`False\` or \`raise\`) when \`other\` is an unrelated type.
### 4. \`@dataclass\` Boilerplate Elimination
Automatically generates \`__init__\`, \`__repr__\`, \`__eq__\`, plus optional \`order=True\` and \`frozen=True\`.
### 5. Mutable Fields in \`@dataclass\`
Use \`field(default_factory=list)\`—\`@dataclass\` explicitly raises \`ValueError\` on bare mutable defaults.`,
    examples: [
      ex('Misol 1: `__repr__`, `__add__` va `__eq__`', 'Example 1: Custom Value Object Dunders', `class Vector:\n    def __init__(self, x: int, y: int):\n        self.x, self.y = x, y\n    def __repr__(self) -> str:\n        return f"Vector({self.x}, {self.y})"\n    def __add__(self, other):\n        if not isinstance(other, Vector): return NotImplemented\n        return Vector(self.x + other.x, self.y + other.y)\n    def __eq__(self, other) -> bool:\n        if not isinstance(other, Vector): return NotImplemented\n        return (self.x, self.y) == (other.x, other.y)\n\nv = Vector(1, 2) + Vector(3, 4)\nprint(v, v == Vector(4, 6))`, `Vector(4, 6) True`, 'Dunder metodlar tufayli `Vector` `+`, `==` va `print()` bilan tabiiy ishlaydi.', 'Dunders integrate `Vector` seamlessly with `+`, `==`, and `print()`.'),
      ex('Misol 2: `@dataclass(frozen=True, order=True)`', 'Example 2: Immutable Ordered Dataclass', `from dataclasses import dataclass, field\n\n@dataclass(frozen=True, order=True)\nclass Task:\n    priority: int\n    title: str\n    tags: tuple[str, ...] = ()\n\ntasks = [Task(2, "Tests"), Task(1, "Security")]\nprint(sorted(tasks))`, `[Task(priority=1, title='Security', tags=()), Task(priority=2, title='Tests', tags=())]`, '`order=True` avtomatik `sorted()` ni yoqadi, `frozen=True` esa obyektlarni o‘zgarmas (immutable) qiladi.', '`@dataclass(frozen=True, order=True)` gives immutability, `__repr__`, and sorting automatically.'),
      ex('Misol 3: `field(default_factory=list)` bilan ro‘yxat maydoni', 'Example 3: Safe Mutable Field Default', `from dataclasses import dataclass, field\n\n@dataclass\nclass Group:\n    name: str\n    members: list[str] = field(default_factory=list)\n\ng1, g2 = Group("A"), Group("B")\ng1.members.append("Ali")\nprint(g1.members, g2.members)`, `['Ali'] []`, '`default_factory=list` har bir obyekt uchun alohida ro‘yxat yaratadi.', '`default_factory=list` ensures independent mutable containers per instance.'),
    ],
    traceTitleUz: 'Operator overloading izi',
    traceTitleEn: 'Tracing __len__ & __add__',
    traceCode: `class Bag:\n    def __init__(self, items): self.items = items\n    def __len__(self): return len(self.items)\nb = Bag([10, 20, 30])\nprint(len(b))`,
    traceSteps: [
      traceStep(1, 'b = Bag([10, 20, 30])', 'b.items = [10,20,30]', 'Obyekt yaratildi', 'Created Bag'),
      traceStep(2, 'len(b)', 'b.__len__()', 'Python ichkarida __len__ chaqirdi', 'Dispatched len() -> __len__()'),
      traceStep(3, 'print(...)', '3', 'Uzunlik chiqdi', 'Printed 3', '3'),
    ],
    commonMistakes: [
      mistake('`@dataclass` da `items: list[str] = []` yozish', 'Bare Mutable Default in @dataclass', `from dataclasses import dataclass\ntry:\n    @dataclass\n    class Bad:\n        items: list = []\nexcept ValueError as e:\n    print("Dataclass blocked:", type(e).__name__)`, 'Dataclass blocked: ValueError', `from dataclasses import dataclass, field\n@dataclass\nclass Good:\n    items: list = field(default_factory=list)\nprint(Good())`, '`@dataclass` umumiy mutable ro‘yxat tuzog‘idan himoya qilish uchun darhol `ValueError` beradi.', 'Dataclasses reject bare mutable defaults with `ValueError`.', '`field(default_factory=list)` ishlating.', 'Always use `field(default_factory=list)`.'),
      mistake('`__str__` ni yozib `__repr__` ni unutish', 'Defining __str__ Without __repr__', `class Item:\n    def __str__(self): return "Item"\nprint([Item()])`, '[<__main__.Item object at 0x...>]', `class Item:\n    def __repr__(self): return "Item()"\nprint([Item()])`, 'Ro‘yxat ichida `__str__` emas, `__repr__` ko‘rinadi; `__repr__` yozilsa `print(x)` ham undan foydalanadi!', 'Containers call `__repr__`, and `str()` falls back to `__repr__` automatically.', 'Avval har doim `__repr__` yozing.', 'Always implement `__repr__` first.'),
    ],
    compareTitleUz: 'Oddiy `class` vs `@dataclass`',
    compareTitleEn: 'Manual Class vs `@dataclass`',
    compareUz: ['`@dataclass`: DTO, config, value object, API schema kabi ma’lumot tashuvchi klasslar (90% holatda).', 'Qo‘lda `class`: murakkab `__init__` resurs boshqaruvi yoki maxsus metaklass kerak bo‘lganda.'],
    compareEn: ['`@dataclass`: ideal for data models, configs, and immutable value objects.', 'Manual `class`: when custom initialization orchestration or non-field setup dominates.'],
    compareSummaryUz: 'Data-modellarda `@dataclass` ishlating; operator va built-in integratsiya uchun esa dunder metodlarni (`__repr__`, `__len__`, `__lt__`) qo‘shing.',
    compareSummaryEn: 'Use `@dataclass` to eliminate boilerplate and implement dunder protocols when integrating with Python built-ins.',
    practiceTasks: [
      pt('p0911_1', '1-mashq: `__repr__` yozish', 'Task 1: Implement __repr__', '`Point(3, 4)` `print(Point(3, 4))` da `"Point(3, 4)"` chiqarsin.', 'Define __repr__ on Point.', `class Point:\n    def __init__(self, x, y): self.x, self.y = x, y\n    def __repr__(self): return f"Point({self.x}, {self.y})"\nprint(Point(3, 4))`, 'Point(3, 4)', 'Return f"Point({self.x}, {self.y})"', 'Prints Point(3, 4).'),
      pt('p0911_2', '2-mashq: `__len__` va `len()`', 'Task 2: Implement __len__', '`Deck([1, 2, 3])` uchun `len(deck)` `3` qaytarsin.', 'Implement __len__.', `class Deck:\n    def __init__(self, cards): self.cards = cards\n    def __len__(self): return len(self.cards)\nprint(len(Deck([1, 2, 3])))`, '3', 'len(self.cards)', 'Prints 3.'),
      pt('p0911_3', '3-mashq: `@dataclass` tenglik', 'Task 3: Dataclass Equality', '`@dataclass class Tag: name: str` da `Tag("py") == Tag("py")` chiqaring.', 'Test generated __eq__.', `from dataclasses import dataclass\n@dataclass\nclass Tag:\n    name: str\nprint(Tag("py") == Tag("py"))`, 'True', '@dataclass generates __eq__', 'Prints True.'),
      pt('p0911_4', '4-mashq: `frozen=True` himoyasi', 'Task 4: Frozen Dataclass', 'O‘zgarmas dataclass maydonini o‘zgartirishga urinib `FrozenInstanceError` tuting.', 'Catch FrozenInstanceError.', `from dataclasses import dataclass, FrozenInstanceError\n@dataclass(frozen=True)\nclass Cfg: port: int\nc = Cfg(8000)\ntry:\n    c.port = 9000\nexcept FrozenInstanceError:\n    print("immutable")`, 'immutable', '@dataclass(frozen=True)', 'Prints immutable.'),
      pt('p0911_5', '5-mashq: `field(default_factory=list)`', 'Task 5: Safe List Field', '`Cart` dataclassiga `items: list[str] = field(default_factory=list)` bering.', 'Use default_factory=list.', `from dataclasses import dataclass, field\n@dataclass\nclass Cart:\n    items: list[str] = field(default_factory=list)\nc = Cart()\nc.items.append("pen")\nprint(c.items)`, "['pen']", 'field(default_factory=list)', "Prints ['pen']."),
    ],
    quiz: [
      q('q0911_1', 'Ro‘yxat ichidagi obyektlarni `[obj1, obj2]` chop qilganda qaysi metod chaqiriladi?', 'Which dunder method formats objects inside a list `[obj1, obj2]`?', ['__str__', '__repr__', '__name__', '__print__'], ['__str__', '__repr__', '__name__', '__print__'], 1, '`__repr__`.', '`__repr__`.'),
      q('q0911_2', '`@dataclass` avtomatik ravishda qaysi metodlarni yaratib beradi?', 'Which methods does `@dataclass` generate by default?', ['Faqat __str__', '__init__, __repr__, __eq__', 'Faqat __len__', '__hash__ va __lt__'], ['__str__ only', '__init__, __repr__, __eq__', '__len__ only', '__hash__ & __lt__'], 1, '`__init__`, `__repr__`, `__eq__`.', '`__init__`, `__repr__`, `__eq__`.'),
      q('q0911_3', '`@dataclass` da bo‘sh ro‘yxat default qiymati qanday yoziladi?', 'How must a mutable list default be declared in a `@dataclass`?', ['items: list = []', 'items: list = field(default_factory=list)', 'items: list = None()', 'items: []'], ['items: list = []', 'items: list = field(default_factory=list)', 'items: list = None()', 'items: []'], 1, '`field(default_factory=list)`.', '`field(default_factory=list)`.'),
      q('q0911_4', 'Obyektni o‘zgarmas (immutable) va `dict` kalitiga yaroqli qilish uchun `@dataclass` ga nima beriladi?', 'Flag making a dataclass immutable?', ['readonly=True', 'frozen=True', 'const=True', 'lock=True'], ['readonly=True', 'frozen=True', 'const=True', 'lock=True'], 1, '`frozen=True`.', '`frozen=True`.'),
      q('q0911_5', '`__eq__` ichida `other` noto‘g‘ri turda bo‘lsa nima qaytarish tavsiya etiladi?', 'What should `__eq__` return when `other` is an incompatible type?', ['None', 'NotImplemented', '-1', 'raise ValueError'], ['None', 'NotImplemented', '-1', 'raise ValueError'], 1, '`NotImplemented`.', '`NotImplemented`.'),
    ],
    homework: hw('Money Value Object', 'Immutable Money Class', '`@dataclass(frozen=True)` da `Money(amount: int, currency: str)` yarating: `__add__` bir xil valyutani qo‘shsin (har xil valyutada `ValueError`), `__str__` `"100 USD"` chiqarsin, va `sorted()` ishlashi uchun `order=True` yoqing.', 'Build an immutable `Money(amount, currency)` value object supporting currency-checked `+`, sorting, and `__str__`.', ['frozen=True', 'Valyuta mos bo‘lmasa ValueError'], ['Immutable frozen=True', 'Reject mismatched currency addition'], 'if self.currency != other.currency: raise ValueError(...)', 'Check currency equality.', 'Konvertatsiya metodi `.to(rate, target_currency)` qo‘shing.', 'Add currency conversion method.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),

  makeLesson({
    id: 'PY-09-12',
    courseId: 'oop',
    moduleId: 'c09_m5',
    order: 12,
    titleUz: 'OOP asosida katta loyiha yaratish (Capstone) va Review #20',
    titleEn: 'OOP Capstone Architecture (+ Review #20)',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-09-11'],
    conceptId: 'oop_capstone',
    whyUz: "Endi `Encapsulation`, `Inheritance`, `Polymorphism`, `Abstraction`, `Composition` va `@dataclass` larning barchasini bitta haqiqiy domen — **Kutubxona / LMS Boshqaruv Tizimi** da birlashtiramiz! Haqiqiy senior kod klasslarni alohida mas’uliyat (Single Responsibility) bo‘yicha ajratishdan boshlanadi.",
    whyEn: 'Combine all OOP pillars—dataclasses, ABCs, composition, properties, and polymorphic pricing/notifications—into a modular, testable capstone system.',
    analogyUz: "Bu xuddi bitta orkestrga o‘xshaydi: Har bir musiqachi (`Book`, `Member`, `FinePolicy`, `Repository`) o‘z asbobini aniq chaladi, `LibraryService` dirijyori esa ularni kompozitsiya orqali boshqaradi!",
    analogyEn: 'Each domain class plays a focused single role (`Entity`, `Policy`, `Repository`), while the service layer orchestrates them cleanly via composition.',
    stopsUz: "**God Class anti-pattern** dan saqlaning! Bitta `Library` klassiga ham kitob saqlash, ham jarima hisoblash, ham email yuborishni tiqmang — ularni `FinePolicy (ABC)`, `Catalog`, `LibraryService` ga bo‘ling!",
    stopsEn: 'Avoid the "God Class" anti-pattern—split persistence (`Repository`), business rules (`Policy`), and orchestration (`Service`) into focused single-responsibility classes.',
    objUz: ['Domain Entities (`@dataclass`), Policies (`ABC`), Repository va Service qatlamlarini ajratish', 'Barcha OOP tamoyillarini 1 ta yaxlit arxitekturada birlashtirish', 'Dependency Injection bilan OOP tizimni unit-test qilish'],
    objEn: ['Separate Domain Models, Strategy/Policy ABCs, Repositories, and Services', 'Integrate encapsulation, inheritance, polymorphism, and composition cohesively', 'Test the composed system using in-memory fakes'],
    theoryUz: `### 1. Toza OOP Arxitektura Qatlamlari
1. **Entities (\`@dataclass\`)**: \`Book\`, \`Member\`, \`LoanRecord\`.
2. **Policies (\`ABC\`)**: \`FinePolicy\` (\`StandardFine\`, \`StudentFine\`).
3. **Repository**: ma’lumot saqlash (\`InMemoryCatalog\`).
4. **Service**: biznes oqimini kompozitsiya bilan boshqaradi.
### 2. SOLID dan 2 ta Eng Muhim Tamoyil
- **S (Single Responsibility)**: har bir klassning 1 ta aniq sababi bor.
- **O (Open/Closed)**: yangi jarima qoidasi qo‘shish uchun \`LibraryService\` ni o‘zgartirish shart emas!
### 3. Invariant Himoyasi
Kitob nusxasi \`available <= 0\` bo‘lganda \`borrow()\` aniq \`ValueError\` chiqaradi.
### 4. Keng tarqalgan xato
Hamma biznes mantiq va SQL/print larni bitta 500-qatorlik \`GodClass\` ga yig‘ib tashlash.`,
    theoryEn: `### 1. Layered OOP Design
Entities (\`@dataclass\`), Policies (\`ABC\`), Repositories, and Services separate data, rules, storage, and orchestration.
### 2. Single Responsibility & Open/Closed
Each class has one reason to change; new discount/fine strategies plug in without altering the core service.
### 3. Domain Invariants
Model methods enforce stock and state limits (\`available > 0\`) directly.
### 4. Avoiding the God Class
Never cram storage, notifications, and calculation into one monolithic class.`,
    examples: [
      ex('Misol 1: Entity + Policy ABC + Service Kompozitsiyasi', 'Example 1: Layered OOP Mini-Library', `from abc import ABC, abstractmethod\nfrom dataclasses import dataclass\n\n@dataclass\nclass Book:\n    isbn: str\n    title: str\n    copies: int\n\nclass FinePolicy(ABC):\n    @abstractmethod\n    def fee(self, late_days: int) -> int: ...\n\nclass StandardFine(FinePolicy):\n    def fee(self, late_days: int) -> int: return max(0, late_days) * 500\n\nclass LibraryService:\n    def __init__(self, fine_policy: FinePolicy):\n        self.books: dict[str, Book] = {}\n        self.fine_policy = fine_policy\n    def add(self, book: Book) -> None:\n        self.books[book.isbn] = book\n    def borrow(self, isbn: str) -> str:\n        b = self.books[isbn]\n        if b.copies <= 0: raise ValueError("Out of stock")\n        b.copies -= 1\n        return f"Borrowed {b.title} (left: {b.copies})"\n\nsvc = LibraryService(StandardFine())\nsvc.add(Book("978-1", "Clean Python", 2))\nprint(svc.borrow("978-1"))\nprint("3 days fine:", svc.fine_policy.fee(3))`, `Borrowed Clean Python (left: 1)\n3 days fine: 1500`, 'Entity (`Book`), Policy (`StandardFine`) va Service (`LibraryService`) toza ajratildi.', 'Entities, policy contracts, and service orchestration cleanly collaborate.'),
      ex('Misol 2: Yangi `StudentFine` siyosatini kodni buzmay ulash', 'Example 2: Plugging New Policy via Open/Closed', `class StudentFine:\n    def fee(self, late_days: int) -> int: return max(0, late_days) * 200\n\nprint("Student 3 days:", StudentFine().fee(3))`, `Student 3 days: 600`, '`LibraryService` ni o‘zgartirmay yangi siyosatni uzatish mumkin.', 'New policies plug into the service without touching existing code.'),
      ex('Misol 3: Invariant himoyasi (`copies == 0`)', 'Example 3: Stock Invariant Check', `def checkout(copies: int):\n    if copies <= 0:\n        raise ValueError("No copies left")\n    return copies - 1\n\ntry:\n    checkout(0)\nexcept ValueError as e:\n    print("Guard caught:", e)`, `Guard caught: No copies left`, 'Biznes qoida buzilganda aniq xato chiqadi.', 'Domain guard catches invalid state transitions immediately.'),
    ],
    traceTitleUz: 'Service qatlami oqimi',
    traceTitleEn: 'Tracing Service Orchestration',
    traceCode: `class Repo:\n    def __init__(self): self.n = 1\nclass Svc:\n    def __init__(self, r): self.r = r\n    def take(self): self.r.n -= 1; return self.r.n\nprint(Svc(Repo()).take())`,
    traceSteps: [
      traceStep(1, 'Svc(Repo())', 'svc.r.n = 1', 'Repository service ga ulandi', 'Injected repo'),
      traceStep(2, 'svc.take()', 'svc.r.n = 0', 'Holat yangilandi', 'Decremented stock'),
      traceStep(3, 'print(...)', '0', 'Natija chiqdi', 'Printed 0', '0'),
    ],
    commonMistakes: [
      mistake('Bitta 500 qatorlik God Class yozish', 'God Class Coupling Everything', `# Putting HTTP, SQL, Email, and Fee math inside one class makes tests impossible!`, 'Tightly coupled monolith', `print("Split Entities, Policies (ABC), Repo, and Service!")`, 'Hamma mas’uliyat bitta klassga yig‘ilsa o‘zgartirish va testlash qiyinlashadi.', 'Monolithic classes resist testing and reuse.', 'Mas’uliyatlarni kichik hamkor klasslarga bo‘ling.', 'Decompose responsibilities across small classes.'),
      mistake('Biznes metodlarda `print()` bilan xato ko‘rsatib `raise` qilmaslik', 'Printing Errors Instead of Raising Exceptions', `def take(stock):\n    if stock <= 0: print("err")  # Caller thinks it succeeded!`, 'Silent state corruption', `def take(stock):\n    if stock <= 0: raise ValueError("empty")\n    return stock - 1\nprint("Raise explicit errors!")`, '`print("error")` dastur oqimini to‘xtatmaydi; chaqiruvchi muvaffaqiyat deb o‘ylaydi.', 'Printing instead of raising hides failures from callers.', 'Qoida buzilganda `raise ValueError(...)` qiling.', 'Raise domain exceptions on invalid actions.'),
    ],
    compareTitleUz: 'God Class vs Layered OOP',
    compareTitleEn: 'God Class vs Layered OOP',
    compareUz: ['God Class: tez boshlanadi, lekin 200 qatordan keyin o‘zgartirib bo‘lmay qoladi.', 'Layered OOP (Entity + ABC Policy + Repo + Service): modulli, testlanadigan va kengaytiriladigan.'],
    compareEn: ['God Class: quick start, unmaintainable later.', 'Layered OOP: clear boundaries, testable modules, Open/Closed extensibility.'],
    compareSummaryUz: 'Kurs 9 yakunida har bir yangi loyihani Entity + Policy + Repo + Service tamoyilida loyihalang.',
    compareSummaryEn: 'Structure OOP projects into Entities, Policy interfaces, Repositories, and Services.',
    practiceTasks: [
      pt('p0912_1', '1-mashq: Entity `@dataclass`', 'Task 1: LoanRecord Dataclass', '`@dataclass class Loan: user: str; book: str` yarating.', 'Create Loan dataclass.', `from dataclasses import dataclass\n@dataclass\nclass Loan:\n    user: str\n    book: str\nprint(Loan("Ali", "Python"))`, "Loan(user='Ali', book='Python')", '@dataclass fields', 'Prints Loan.'),
      pt('p0912_2', '2-mashq: Policy `ABC`', 'Task 2: DiscountPolicy ABC', '`DiscountPolicy(ABC)` va `VipDiscount` (`* 0.9`) yozing.', 'Create ABC and VipDiscount.', `from abc import ABC, abstractmethod\nclass Policy(ABC):\n    @abstractmethod\n    def apply(self, p: int) -> int: ...\nclass Vip(Policy):\n    def apply(self, p: int) -> int: return int(p * 0.9)\nprint(Vip().apply(100))`, '90', 'Inherit Policy', 'Prints 90.'),
      pt('p0912_3', '3-mashq: InMemory Repo', 'Task 3: Dict Repository', '`Repo` ga `save(k, v)` va `get(k)` qo‘shing.', 'Build simple Repo.', `class Repo:\n    def __init__(self): self._d = {}\n    def save(self, k, v): self._d[k] = v\n    def get(self, k): return self._d.get(k)\nr = Repo(); r.save("a", 1)\nprint(r.get("a"), r.get("b"))`, '1 None', 'self._d.get(k)', 'Prints 1 None.'),
      pt('p0912_4', '4-mashq: Service + Invariant', 'Task 4: Stock Guard', '`Stock(1)` dan 2 marta yechilganda `ValueError` tuting.', 'Guard zero stock.', `class Stock:\n    def __init__(self, n): self.n = n\n    def take(self):\n        if self.n <= 0: raise ValueError("empty")\n        self.n -= 1\ns = Stock(1); s.take()\ntry:\n    s.take()\nexcept ValueError as e:\n    print(e)`, 'empty', 'Check self.n <= 0', 'Prints empty.'),
      pt('p0912_5', '5-mashq: To‘liq integratsiya', 'Task 5: End-to-End Flow', '`Billing(Vip()).charge(200)` -> `180` chiqaring.', 'Wire Policy into Billing.', `class Vip:\n    def apply(self, p): return int(p * 0.9)\nclass Billing:\n    def __init__(self, pol): self.pol = pol\n    def charge(self, p): return self.pol.apply(p)\nprint(Billing(Vip()).charge(200))`, '180', 'self.pol.apply(p)', 'Prints 180.'),
    ],
    quiz: [
      q('q0912_1', 'Bitta klass ichiga DB, UI, hisob-kitob va email ni yig‘ish anti-patterni nima deb ataladi?', 'Anti-pattern of putting all responsibilities into one giant class?', ['Singleton', 'God Class', 'Factory', 'Decorator'], ['Singleton', 'God Class', 'Factory', 'Decorator'], 1, 'God Class anti-patterni.', 'God Class.'),
      q('q0912_2', 'SOLID dagi "S" (Single Responsibility) nimani anglatadi?', 'What does Single Responsibility mean?', ['Bitta fayl', 'Har bir klass bitta aniq mas’uliyatga javob berishi', 'Faqat 1 ta metod', 'Meros olmaslik'], ['One file', 'A class should have one clear responsibility/reason to change', 'One method max', 'No inheritance'], 1, 'Yagona mas’uliyat tamoyili.', 'One clear responsibility.'),
      q('q0912_3', 'Ma’lumot saqlash qatlami odatda qanday nomlanadi?', 'Layer responsible for data persistence/lookup?', ['Controller', 'Repository', 'Decorator', 'Iterator'], ['Controller', 'Repository', 'Decorator', 'Iterator'], 1, '`Repository`.', '`Repository`.'),
      q('q0912_4', 'Open/Closed tamoyiliga ko‘ra yangi chegirma turini qanday qo‘shish kerak?', 'How to add a new discount rule following Open/Closed?', ['Service ichiga yangi `elif` yozib', 'Yangi Policy/Strategy klass yozib Service ga uzatish orqali', 'Global flag ochib', 'print() qo‘shib'], ['Add elif inside Service', 'Create a new Policy class and inject it', 'Global flag', 'Add print()'], 1, 'Yangi Policy klassini uzatish orqali.', 'Add new Policy and inject it.'),
      q('q0912_5', 'Biznes qoidasi buzilganda (masalan stock=0) klass nima qilishi kerak?', 'When a domain invariant is violated, a method should:', ['print("xato") qilib davom etish', 'Aniq Exception (`ValueError`) ko‘tarish', 'None qaytarish', 'Dasturni kill qilish'], ['print and continue', 'Raise an explicit exception (`ValueError`)', 'Return None silently', 'Kill process'], 1, 'Aniq Exception (`raise ValueError`) ko‘tarish.', 'Raise an explicit exception.'),
    ],
    homework: hw('Kurs 9 Bitiruv Loyihasi: Elektron Do‘kon OOP Dvigateli', 'Course 9 Capstone: E-Commerce OOP Engine', '`Product` (`@dataclass`), `CartItem`, `PricingPolicy(ABC)` (`RegularPricing`, `SeasonalSale`), `InventoryRepo` va `CheckoutService` dan iborat to‘liq OOP do‘kon tizimini yozing.', 'Build a modular OOP store engine combining `Product`, `PricingPolicy(ABC)`, `InventoryRepo`, and `CheckoutService` with unit assertions.', ['Barcha 4 OOP ustuni amalda ko‘rinsin', '5 ta assert unit-test'], ['Apply all 4 OOP pillars', 'Include 5 assertions'], 'Compose PricingPolicy + InventoryRepo inside CheckoutService.', 'Clean layered design.', 'Chek (receipt) chiqaruvchi `__str__` qo‘shing.', 'Add formatted receipt.', 35),
    reviewCheckpoint: review(
      20,
      'Review Loyiha #20: Kurs 9 (OOP) Yakuniy Tizimi (100-dars Marrasi!)',
      'Review Project #20: Course 9 OOP Milestone (100th Lesson!)',
      '100 ta dars marrasi muborak! Kurs 9 dagi barcha OOP tamoyillarini (`@dataclass`, `@property`, `ABC`, `Composition`, `Dunder`) birlashtirib, Mini-Bank va Do‘kon to‘lov dvigatelini ishga tushiring.',
      '100-lesson milestone! Integrate `@dataclass`, `@property`, `ABC`, Composition, and Dunder methods in one clean OOP system.',
      ['`@dataclass(frozen=True) class Money`', '`PaymentMethod(ABC)` va `CardPayment` / `CashPayment`', '`CheckoutService` da Dependency Injection va zaxira nazorati'],
      ['Immutable `Money` dataclass', '`PaymentMethod(ABC)` polymorphic handlers', '`CheckoutService` using injected strategy'],
      `from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass(frozen=True)
class Money:
    uzs: int
    def __add__(self, other: "Money") -> "Money":
        return Money(self.uzs + other.uzs)

class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, total: Money) -> str: ...

class CardPayment(PaymentMethod):
    def pay(self, total: Money) -> str:
        return f"Paid {total.uzs} UZS by Card"

class CheckoutService:
    def __init__(self, method: PaymentMethod):
        self.method = method
    def complete(self, items: list[Money]) -> str:
        total = Money(sum(i.uzs for i in items))
        return self.method.pay(total)

print(CheckoutService(CardPayment()).complete([Money(15000), Money(25000)]))
`,
    ),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),
];
