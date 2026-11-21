import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C07_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-07-06',
    courseId: 'errors_testing',
    moduleId: 'c07_m3',
    order: 6,
    titleUz: '`raise` orqali xato chiqarish va Exception Chaining',
    titleEn: 'Raising Exceptions (`raise`), Re-raising & `raise ... from err`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-07-05'],
    conceptId: 'raise_exceptions',
    whyUz: "Funksiya manfiy yosh yoki nolga teng narx qabul qilganda jimgina `None` qaytarib ketishi xatoni uzoqqa yashiradi (silent failure). `raise ValueError(...)` — noto‘g‘ri kirishni darrov to‘xtatish (Fail Fast) vositasidir.",
    whyEn: 'Fail-fast validation raises descriptive exceptions (`raise ValueError(...)`) when contracts break, and `raise ... from err` preserves original root causes across layers.',
    analogyUz: "`raise` — bu zavod konveyeridagi favqulodda to‘xtatish tugmasi: sifatsiz detal kirsa keyingi bo‘limga o‘tkazmasdan signal chaladi; `raise ... from err` esa asl buzilish dalilini ham ilova qilib beradi!",
    analogyEn: '`raise` pulls the emergency stop cord at the contract boundary; `raise ... from err` attaches the original defect slip to the report.',
    stopsUz: "Xatoni ushlab qayta uzatmoqchi bo‘lsangiz (`logging` qilgach), **`raise`** (argumentsiz) yozing — bu asl traceback ni saqlab qoladi! Shuningdek `raise ValueError(...) from err` zanjirida `__cause__` saqlanadi.",
    stopsEn: 'Inside an `except` block, bare `raise` re-raises the active exception with its original traceback; `raise NewErr(...) from err` links `__cause__`.',
    objUz: ['Validatsiyada mos keluvchi (`ValueError`, `TypeError`) xatolarni `raise` qilish', 'Bare `raise` bilan log yozgach asl xatoni yuqoriga uzatish', '`raise NewError(...) from err` (Exception Chaining) va `from None` farqini bilish'],
    objEn: ['Raise standard `ValueError`/`TypeError` in contract guards', 'Re-raise active errors cleanly via bare `raise`', 'Chain contextual exceptions with `raise ... from err`'],
    theoryUz: `### 1. \`raise\` Qachon Ishlatiladi?
\`\`\`python
def set_age(age: int) -> int:
    if not isinstance(age, int):
        raise TypeError("age must be int")
    if not 0 <= age <= 150:
        raise ValueError("age must be 0..150")
    return age
\`\`\`
### 2. Bare \`raise\` (Re-Raising)
Xatoni ushlab logga yozib, lekin baribir chaqiruvchiga uzatish uchun \`except\` ichida faqat \`raise\` yoziladi.
### 3. \`raise ... from err\` (Exception Chaining)
Pastki qatlamdagi texnik xatoni (\`KeyError\`) yuqori qatlam xatosiga (\`ValueError\`) o‘rab asl sababni (\`__cause__\`) yo‘qotmaslik uchun: \`raise ValueError("Missing config") from err\`.
### 4. Keng tarqalgan xato
\`raise "Error message"\` (string raise qilish — Python 3 da \`TypeError: exceptions must derive from BaseException\`) yoki hamma joyda umumiy \`Exception\` otish.`,
    theoryEn: `### 1. Explicit Contract Validation
Raise \`TypeError\` for bad types and \`ValueError\` for invalid domain values.
### 2. Bare \`raise\`
Logs/cleans up then rethrows the exact active exception and traceback.
### 3. Explicit Chaining (\`from err\`)
Translates low-level failures into domain errors while keeping \`__cause__\` intact.
### 4. Pitfalls
You cannot \`raise "text"\`; always instantiate an \`Exception\` subclass.`,
    examples: [
      ex('Misol 1: Fail-Fast validatsiya (`TypeError` & `ValueError`)', 'Example 1: Fail-Fast Input Validation', `def calc_discount(price: float, pct: float) -> float:\n    if not isinstance(price, (int, float)):\n        raise TypeError("price must be numeric")\n    if not 0 <= pct <= 100:\n        raise ValueError("pct must be 0..100")\n    return round(price * (1 - pct / 100), 2)\n\nprint(calc_discount(200, 15))\ntry:\n    calc_discount(200, 150)\nexcept ValueError as e:\n    print("Caught:", e)`, `170.0\nCaught: pct must be 0..100`, 'Chegaradan tashqari foiz darrov aniq xabar bilan to‘xtatildi.', 'Invalid percentage failed fast with descriptive `ValueError`.'),
      ex('Misol 2: `raise ... from err` bilan sababni saqlash', 'Example 2: Exception Chaining with from', `def load_port(cfg: dict) -> int:\n    try:\n        return int(cfg["port"])\n    except (KeyError, ValueError) as err:\n        raise RuntimeError("Invalid server config") from err\n\ntry:\n    load_port({"port": "abc"})\nexcept RuntimeError as e:\n    print("Top:", e, "| Cause:", type(e.__cause__).__name__)`, `Top: Invalid server config | Cause: ValueError`, '`__cause__` tufayli ham biznes xabari, ham asl `ValueError` saqlandi!', 'Preserved original `ValueError` inside `__cause__`.'),
      ex('Misol 3: Bare `raise` bilan log + re-raise', 'Example 3: Log and Re-raise', `def risky():\n    try:\n        return 10 // 0\n    except ZeroDivisionError:\n        print("Logged zero-div!")\n        raise\n\ntry:\n    risky()\nexcept ZeroDivisionError:\n    print("Handled by caller")`, `Logged zero-div!\nHandled by caller`, 'Bare `raise` xatoni yutmasdan yuqoriga uzatdi.', 'Bare `raise` logged the event and propagated cleanly.'),
    ],
    traceTitleUz: 'Exception chaining izi',
    traceTitleEn: 'Tracing raise ... from err',
    traceCode: `try:\n    try:\n        int("x")\n    except ValueError as e:\n        raise RuntimeError("cfg") from e\nexcept RuntimeError as top:\n    print(top, "<-", type(top.__cause__).__name__)`,
    traceSteps: [
      traceStep(1, 'int("x")', 'ValueError', 'Ichki xato chiqdi', 'Inner ValueError raised'),
      traceStep(2, 'raise RuntimeError("cfg") from e', '__cause__=e', 'Zanjirlandi va tashqariga chiqdi', 'Chained cause'),
      traceStep(3, 'print(...)', 'cfg <- ValueError', 'Ikkala xato ham ko‘rindi', 'Printed top and cause', 'cfg <- ValueError'),
    ],
    commonMistakes: [
      mistake('String ni `raise` qilishga urinish', 'Raising a Raw String', `raise "Invalid input"`, 'TypeError: exceptions must derive from BaseException', `try:\n    raise ValueError("Invalid input")\nexcept ValueError as e:\n    print(e)`, 'Python 3 da faqat `Exception` merosxo‘ri bo‘lgan obyektlar raise qilinadi.', 'Only `Exception` subclasses can be raised.', 'Har doim `raise ValueError("...")` kabi klass yarating.', 'Instantiate an exception class.'),
      mistake('`except` da bare `raise` o‘rniga `raise Exception(e)` deb traceback ni yo‘qotish', 'Replacing Active Error with Generic Exception', `try:\n    1 / 0\nexcept ZeroDivisionError as e:\n    raise Exception(e)`, 'Loses original ZeroDivisionError type & stack', `try:\n    1 / 0\nexcept ZeroDivisionError:\n    raise`, 'Oddiy `raise` asl xato turini va stack trace ni to‘liq saqlaydi.', 'Bare `raise` preserves original type and traceback.', 'Qayta uzatishda faqat `raise` yozing.', 'Use bare `raise` to rethrow.'),
    ],
    compareTitleUz: '`return None` vs `raise ValueError`',
    compareTitleEn: '`return None` vs `raise ValueError`',
    compareUz: ['`return None`: "topilmadi" tabiiy holat bo‘lgan qidiruvlarda (`dict.get`, `find_user`).', '`raise ValueError`: noto‘g‘ri argument / biznes qoidasi buzilganida (jim qolmaslik uchun).'],
    compareEn: ['`return None`: legitimate absence in lookup helpers.', '`raise ValueError`: invalid inputs or violated contracts (fail-fast).'],
    compareSummaryUz: 'Qidiruvda `None` qaytaring, buzilgan kontrakt va noto‘g‘ri qiymatlarda esa `raise` qiling.',
    compareSummaryEn: 'Return `None` for normal misses; `raise` for contract violations.',
    practiceTasks: [
      pt('p0706_1', '1-mashq: Manfiy sonni rad etish', 'Task 1: Raise ValueError', '`check_pos(n)` manfiy sonda `ValueError` ko‘tarsin; `-3` da ushlab `"neg"` chiqaring.', 'Raise ValueError on negative.', `def check_pos(n):\n    if n < 0:\n        raise ValueError("neg")\n    return n\ntry:\n    check_pos(-3)\nexcept ValueError as e:\n    print(e)`, 'neg', 'raise ValueError("neg")', 'Catch and print e.'),
      pt('p0706_2', '2-mashq: `TypeError` tekshiruvi', 'Task 2: Raise TypeError', '`require_str(x)` `str` bo‘lmasa `TypeError` ko‘tarsin.', 'Raise TypeError if not str.', `def require_str(x):\n    if not isinstance(x, str):\n        raise TypeError("bad type")\n    return x\ntry:\n    require_str(12)\nexcept TypeError as e:\n    print(e)`, 'bad type', 'isinstance(x, str)', 'Test 12.'),
      pt('p0706_3', '3-mashq: Bare `raise`', 'Task 3: Bare raise', '`except ValueError:` ichida `"log"` chiqarib bare `raise` qiling.', 'Log and re-raise ValueError.', `try:\n    try:\n        int("a")\n    except ValueError:\n        print("log")\n        raise\nexcept ValueError:\n    print("caught")`, 'log\ncaught', 'Bare raise', 'Verify both prints.'),
      pt('p0706_4', '4-mashq: `from err` zanjiri', 'Task 4: Exception Chaining', '`KeyError` ni `ValueError` ga `from err` bilan o‘rab `__cause__` turini chiqaring.', 'Chain ValueError from KeyError.', `try:\n    try:\n        _ = {}["k"]\n    except KeyError as err:\n        raise ValueError("wrap") from err\nexcept ValueError as e:\n    print(type(e.__cause__).__name__)`, 'KeyError', 'raise ... from err', 'Print __cause__ name.'),
      pt('p0706_5', '5-mashq: `from None` zanjirni yashirish', 'Task 5: Suppress Context', '`raise ValueError("clean") from None` da `__cause__` ni chiqaring.', 'Suppress cause with from None.', `try:\n    try:\n        1 / 0\n    except ZeroDivisionError:\n        raise ValueError("clean") from None\nexcept ValueError as e:\n    print(e, e.__cause__)`, 'clean None', 'from None', 'Verify __cause__ is None.'),
    ],
    quiz: [
      q('q0706_1', '`raise "xato"` Python 3 da nima beradi?', 'What happens on `raise "xato"` in Python 3?', ['ValueError', 'TypeError', 'SyntaxError', 'StringError'], ['ValueError', 'TypeError', 'SyntaxError', 'StringError'], 1, '`TypeError: exceptions must derive from BaseException`.', '`TypeError`.'),
      q('q0706_2', '`except` ichida asl xatoni o‘zgartirmay qayta ko‘tarish usuli?', 'How to re-raise the active exception cleanly?', ['raise e', 'raise', 'throw', 'return e'], ['raise e', 'raise', 'throw', 'return e'], 1, 'Argumentsiz bare `raise`.', 'Bare `raise`.'),
      q('q0706_3', '`raise NewError() from old_err` nimani saqlaydi?', 'What does `raise NewError() from old_err` attach?', ['__doc__', '__cause__', '__name__', '__slots__'], ['__doc__', '__cause__', '__name__', '__slots__'], 1, 'Asl xatoni `__cause__` da saqlaydi.', 'Sets `__cause__` to `old_err`.'),
      q('q0706_4', 'Funksiya parametri noto‘g‘ri turda bo‘lganda qaysi xato ko‘tariladi?', 'Best standard exception when argument type is wrong?', ['ValueError', 'TypeError', 'KeyError', 'IndexError'], ['ValueError', 'TypeError', 'KeyError', 'IndexError'], 1, '`TypeError`.', '`TypeError`.'),
      q('q0706_5', 'Xatolar zanjirini (context) yashirib toza xabar chiqarish sintaksisi?', 'Syntax to suppress exception chaining context?', ['from False', 'from None', 'without context', 'suppress'], ['from False', 'from None', 'without context', 'suppress'], 1, '`raise NewError(...) from None`.', '`from None`.'),
    ],
    homework: hw('Bank O‘tkazmasi Kontrakt Validatori', 'Fail-Fast Transfer Guard', '`transfer(balance: float, amount: float) -> float` funksiyasini tuzing: `TypeError` (son bo‘lmasa), `ValueError` (`amount <= 0` yoki balans yetmasa) ko‘tarsin va tashqi chaqiruvchi ularni `from` zanjiri bilan `RuntimeError` ga o‘rasin.', 'Build `transfer(balance, amount)` with `TypeError`/`ValueError` guards plus a caller wrapper demonstrating `raise RuntimeError(...) from err`.', ['isinstance tekshiruvi', 'raise ... from err zanjiri'], ['Type and range guards', 'Exception chaining'], 'raise ValueError("Insufficient funds")', 'Fail fast cleanly.', 'Har ikki xato ssenariysini test qiling.', 'Test both guard branches.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-07-07',
    courseId: 'errors_testing',
    moduleId: 'c07_m3',
    order: 7,
    titleUz: 'Custom Exceptions — shaxsiy biznes xatolari ierarxiyasi',
    titleEn: 'Custom Exceptions: Domain Hierarchies & Structured Error Metadata',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-07-06'],
    conceptId: 'custom_exceptions',
    whyUz: "To‘lov tizimingizda balans yetishmasligi (`InsufficientFundsError`) ham, karta muddati o‘tgani (`CardExpiredError`) ham oddiy `ValueError` bo‘lib kelsa, API ularni ajratib mijozga to‘g‘ri HTTP status (`402` vs `400`) bera olmaydi!",
    whyEn: 'Domain-specific exceptions (`AppError -> PaymentError -> InsufficientFundsError`) let callers distinguish business failures cleanly and map them to HTTP statuses or retries.',
    analogyUz: "Custom Exception — bu shifoxonadagi aniq tashxis kodlari: hamma narsaga \"kasal\" (`ValueError`) deyish o‘rniga, aniq bo‘lim (`PaymentError`) va aniq tashxis (`InsufficientFundsError`) qo‘yilsa, har bir bo‘lim o‘z muolajasini qiladi.",
    analogyEn: 'Custom exceptions act like triage codes: callers can catch the whole category (`PaymentError`) or one exact failure (`InsufficientFundsError`).',
    stopsUz: "Shaxsiy xato sinfi **har doim `Exception` dan** (yoki uning merosxo‘ridan) meros olishi shart — hech qachon `BaseException` dan meros olmang, aks holda `except Exception:` uni tuta olmaydi!",
    stopsEn: 'Always inherit custom exceptions from `Exception` (never `BaseException`) so standard `except Exception:` handlers catch them safely.',
    objUz: ['`class AppError(Exception): pass` bilan domain xatolar ierarxiyasini yaratish', 'Qo‘shimcha maydonlar (`code`, `status_code`, `detail`) saqlaydigan `__init__` yozish', 'Bitta ota xato (`except PaymentError:`) orqali barcha kichik xatolarni guruhlab ushlash'],
    objEn: ['Design clean custom exception hierarchies rooted in `Exception`', 'Attach structured attributes (`code`, `status_code`) via `__init__`', 'Catch base domain exceptions polymorphically across modules'],
    theoryUz: `### 1. Eng Oddiy Custom Exception
\`\`\`python
class AuthError(Exception):
    """Base error for authentication failures."""

class TokenExpiredError(AuthError):
    pass
\`\`\`
### 2. Nima Uchun \`BaseException\` Dan Meros Olinmaydi?
\`KeyboardInterrupt\` va \`SystemExit\` \`BaseException\` dan meros oladi. Sizning biznes xatolaringiz \`Exception\` ostida turishi shart!
### 3. Metadata (Kod va Ma’lumot) Saqlovchi Exception
\`super().__init__(message)\` ni chaqirib, qo‘shimcha \`self.status_code\` va \`self.field\` saqlash mumkin — FastAPI/Django error handlerlar aynan shunday ishlaydi!
### 4. Ierarxiya Foydasi
\`except AuthError:\` barcha \`TokenExpiredError\`, \`InvalidRoleError\` larni tutadi; \`except TokenExpiredError:\` esa faqat bittasiga alohida javob (masalan refresh token) beradi!
### 5. Keng tarqalgan xato
\`super().__init__(message)\` ni unutib, xato xabari \`str(err)\` bo‘sh qolib ketishi.`,
    theoryEn: `### 1. Domain Hierarchy
Root \`class DomainError(Exception): pass\` with specific subclasses.
### 2. Always Subclass \`Exception\`
Reserve \`BaseException\` strictly for system exits/interrupts.
### 3. Structured Payloads
Store attributes like \`self.code\` or \`self.status\` alongside \`super().__init__(msg)\`.
### 4. Polymorphic Catching
Callers can catch either the parent \`DomainError\` or specific leaf classes.
### 5. Forgetting \`super().__init__\`
Always call \`super().__init__(message)\` in custom \`__init__\`.`,
    examples: [
      ex('Misol 1: To‘lov tizimi xatolar ierarxiyasi', 'Example 1: Payment Exception Hierarchy', `class PaymentError(Exception):\n    pass\n\nclass InsufficientFundsError(PaymentError):\n    def __init__(self, needed: float, balance: float):\n        super().__init__(f"Need {needed}, have {balance}")\n        self.needed = needed\n        self.balance = balance\n\ntry:\n    raise InsufficientFundsError(150, 40)\nexcept PaymentError as err:\n    print(type(err).__name__, "|", err, "| deficit:", err.needed - err.balance)`, `InsufficientFundsError | Need 150, have 40 | deficit: 110`, 'Ham ota sinf `PaymentError` ushladi, ham qo‘shimcha maydonlar o‘qildi.', 'Caught leaf error via parent `PaymentError` and read structured attributes.'),
      ex('Misol 2: HTTP status kodli API xatosi', 'Example 2: Structured API Error Class', `class AppHTTPException(Exception):\n    def __init__(self, status_code: int, message: str):\n        super().__init__(message)\n        self.status_code = status_code\n\ntry:\n    raise AppHTTPException(404, "Course not found")\nexcept AppHTTPException as e:\n    print(f"HTTP {e.status_code}: {e}")`, `HTTP 404: Course not found`, 'Backend API larda biznes xatolarini JSON javobga aylantirish uchun standart yondashuv.', 'Structured status code simplifies central API error formatting.'),
      ex('Misol 3: Turli xatolarga turlicha reaksiya', 'Example 3: Selective Subclass Handling', `class ValidationError(Exception): pass\nclass RateLimitError(Exception): pass\n\nfor exc in (RateLimitError("Wait 5s"), ValidationError("Bad email")):\n    try:\n        raise exc\n    except RateLimitError as e:\n        print("RETRY:", e)\n    except ValidationError as e:\n        print("FIX INPUT:", e)`, `RETRY: Wait 5s\nFIX INPUT: Bad email`, 'Har bir biznes xatosi o‘ziga mos harakatni ishga tushirdi.', 'Mapped different domain errors to retry vs user-fix workflows.'),
    ],
    traceTitleUz: 'Custom Exception meros izi',
    traceTitleEn: 'Tracing Custom Hierarchy Match',
    traceCode: `class AppErr(Exception): pass\nclass NotFoundErr(AppErr): pass\ntry:\n    raise NotFoundErr("404")\nexcept AppErr as e:\n    print(isinstance(e, Exception), e)`,
    traceSteps: [
      traceStep(1, 'raise NotFoundErr("404")', 'NotFoundErr', 'Merosxo‘r xato otildi', 'Raised subclass'),
      traceStep(2, 'except AppErr as e:', 'matched!', 'Ota sinf AppErr uni tutdi', 'Caught via base AppErr'),
      traceStep(3, 'print(...)', 'True 404', 'Exception vorisi ekani tasdiqlandi', 'Verified inheritance', 'True 404'),
    ],
    commonMistakes: [
      mistake('`BaseException` dan meros olish', 'Inheriting from BaseException', `class BadErr(BaseException): pass\ntry:\n    raise BadErr("oops")\nexcept Exception:\n    print("Won't catch!")`, 'Bypasses except Exception: and crashes!', `class GoodErr(Exception): pass\ntry:\n    raise GoodErr("oops")\nexcept Exception as e:\n    print("Caught cleanly:", e)`, '`except Exception:` `BaseException` ni tutmaydi.', 'Standard handlers catch `Exception`, not `BaseException`.', 'Doim `(Exception)` dan meros oling.', 'Inherit from `Exception`.'),
      mistake('Custom `__init__` da `super().__init__()` ni unutish', 'Omitting super().__init__(msg)', `class MyErr(Exception):\n    def __init__(self, code):\n        self.code = code\nprint(repr(str(MyErr(400))))`, 'Prints empty string "" for str(err)', `class MyErr(Exception):\n    def __init__(self, code, msg):\n        super().__init__(msg)\n        self.code = code\nprint(str(MyErr(400, "Bad")))`, '`super().__init__(msg)` xato xabarini o‘rnatadi.', '`super().__init__(msg)` populates standard error string.', 'Har doim `super().__init__(...)` chaqiring.', 'Call `super().__init__(msg)`.'),
    ],
    compareTitleUz: 'Standard `ValueError` vs Custom `InsufficientFundsError`',
    compareTitleEn: 'Built-in Exceptions vs Custom Domain Exceptions',
    compareUz: ['Built-in (`ValueError`, `TypeError`): umumiy yordamchi funksiyalar va kutubxonalarda.', 'Custom (`DomainError -> SpecificError`): biznes qoidalari, API xato kodlari va katta ilovalar uchun.'],
    compareEn: ['Built-in: generic utility validation.', 'Custom hierarchy: domain workflows, API status mapping, structured metadata.'],
    compareSummaryUz: 'Katta loyihada bitta asosiy `AppError(Exception)` yaratib, barcha biznes xatolarini undan meros oling.',
    compareSummaryEn: 'Root application exceptions in a shared base `AppError(Exception)` class.',
    practiceTasks: [
      pt('p0707_1', '1-mashq: Oddiy Custom Error', 'Task 1: First Custom Error', '`class InvalidAgeError(Exception): pass` yaratib ko‘taring va tuting.', 'Define and catch InvalidAgeError.', `class InvalidAgeError(Exception):\n    pass\ntry:\n    raise InvalidAgeError("too young")\nexcept InvalidAgeError as e:\n    print(e)`, 'too young', 'Inherit from Exception.', 'Raise and catch.'),
      pt('p0707_2', '2-mashq: Ota xato bilan tutish', 'Task 2: Base Domain Catch', '`class StoreError(Exception): pass` va `class OutOfStockError(StoreError): pass` yozing; `except StoreError:` bilan tuting.', 'Catch subclass via base StoreError.', `class StoreError(Exception): pass\nclass OutOfStockError(StoreError): pass\ntry:\n    raise OutOfStockError("sold out")\nexcept StoreError as e:\n    print(type(e).__name__)`, 'OutOfStockError', 'Subclass StoreError.', 'Catch StoreError.'),
      pt('p0707_3', '3-mashq: Atributli xato', 'Task 3: Error With Code', '`class CodeErr(Exception):` `__init__(self, code, msg)` yozing va `e.code` chiqaring.', 'Attach .code attribute.', `class CodeErr(Exception):\n    def __init__(self, code, msg):\n        super().__init__(msg)\n        self.code = code\ntry:\n    raise CodeErr(422, "bad")\nexcept CodeErr as e:\n    print(e.code, e)`, '422 bad', 'super().__init__(msg)', 'Print code and e.'),
      pt('p0707_4', '4-mashq: `issubclass` tekshiruvi', 'Task 4: Verify Inheritance', '`issubclass(CodeErr, Exception)` chiqaring.', 'Check issubclass(..., Exception).', `class MyErr(Exception): pass\nprint(issubclass(MyErr, Exception))`, 'True', 'issubclass(MyErr, Exception)', 'Prints True.'),
      pt('p0707_5', '5-mashq: Biznes qoida funksiyasi', 'Task 5: Domain Guard', '`withdraw(bal, amt)` `amt > bal` da `BalanceError` ko‘tarsin.', 'Raise custom BalanceError.', `class BalanceError(Exception): pass\ndef withdraw(bal, amt):\n    if amt > bal:\n        raise BalanceError("low")\n    return bal - amt\ntry:\n    withdraw(50, 80)\nexcept BalanceError as e:\n    print(e)`, 'low', 'if amt > bal: raise', 'Catch BalanceError.'),
    ],
    quiz: [
      q('q0707_1', 'Custom exception qaysi sinfdan meros olishi kerak?', 'Which class should custom exceptions inherit from?', ['object', 'BaseException', 'Exception', 'RuntimeError faqat'], ['object', 'BaseException', 'Exception', 'Only RuntimeError'], 2, '`Exception` sinfidan.', '`Exception`.'),
      q('q0707_2', 'Nima uchun `BaseException` dan to‘g‘ridan-to‘g‘ri meros olinmaydi?', 'Why avoid subclassing `BaseException` directly?', ['SyntaxError beradi', 'except Exception: uni tuta olmaydi', 'Sekin ishlaydi', 'Xotira oshadi'], ['SyntaxError', 'Standard except Exception: skips it', 'Slow', 'Memory leak'], 1, 'Oddiy `except Exception:` `BaseException` ni tutmaydi.', 'Skipped by `except Exception:`.'),
      q('q0707_3', 'Custom `__init__` ichida xato matnini o‘rnatish uchun nima chaqiriladi?', 'Call required in custom `__init__` to set error message?', ['self.msg()', 'super().__init__(msg)', 'raise(msg)', 'Exception.set()'], ['self.msg()', 'super().__init__(msg)', 'raise(msg)', 'Exception.set()'], 1, '`super().__init__(msg)`.', '`super().__init__(msg)`.'),
      q('q0707_4', '`OutOfStockError(StoreError)` ni `except StoreError:` ushlay oladimi?', 'Does `except StoreError:` catch `OutOfStockError(StoreError)`?', ['Yo‘q', 'Ha, merosxo‘rlik tufayli', 'Faqat bir xil nomda', 'Faqat debug da'], ['No', 'Yes, via inheritance', 'Same name only', 'Debug only'], 1, 'Ha, ota klass barcha vorislarini tutadi.', 'Yes, base class catches all subclasses.'),
      q('q0707_5', 'Custom xatoga `status_code` kabi qo‘shimcha maydon qo‘shish mumkinmi?', 'Can custom exceptions carry extra attributes like `status_code`?', ['Yo‘q', 'Ha, __init__ orqali self.status_code', 'Faqat str bo‘ladi', 'Faqat dataclass da'], ['No', 'Yes, via self attributes in __init__', 'Strings only', 'Dataclasses only'], 1, 'Ha, `__init__` da `self.status_code = ...` saqlanadi.', 'Yes, store custom fields on `self`.'),
    ],
    homework: hw('Kutubxona Ijarasi Xatolar Tizimi', 'Library Borrowing Exception Hierarchy', '`LibraryError(Exception)` asos sinfidan `BookNotFoundError(book_id)` va `BookAlreadyBorrowedError(book_id)` sinflarini meros olib `borrow_book(catalog, book_id)` funksiyasida qo‘llang.', 'Build `LibraryError -> BookNotFoundError, BookAlreadyBorrowedError` with `book_id` attributes and use them in `borrow_book(catalog, book_id)`.', ['super().__init__ bilan xabar', 'except LibraryError: umumiy handler'], ['Call super().__init__', 'Test polymorphic except LibraryError'], 'class BookNotFoundError(LibraryError): ...', 'Store self.book_id.', 'Foydalanuvchi limiti oshganda `BorrowLimitError` ham qo‘shing.', 'Add a third subclass for borrow limit.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-07-08',
    courseId: 'errors_testing',
    moduleId: 'c07_m4',
    order: 8,
    titleUz: 'Debugging — xatolarni ilmiy usulda izlab topish',
    titleEn: 'Systematic Debugging: `repr()`, `f"{x=}"`, Isolation & `pdb`',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    prerequisites: ['PY-07-07'],
    conceptId: 'debugging_techniques',
    whyUz: "Tajribasiz dasturchi kodni taxmin bilan o‘zgartiraveradi va yangi xato qo‘shadi. Senior dasturchi esa **ilmiy usul** (gipoteza -> izolyatsiya -> `f\"{x=}\"` / `repr()` / debugger bilan kuzatish) orqali xatoning ildizini aniq topadi!",
    whyEn: 'Systematic debugging replaces blind guessing with hypothesis testing, minimal reproduction, `f"{x=}"` / `repr()` inspection, and interactive breakpoints.',
    analogyUz: "Debugging — bu shifokor diagnostikasi: \"taxminan tabletka berish\" emas, balki harorat (`f\"{x=}\"`), qon tahlili (`repr(x)`) va rentgen (`breakpoint()`) bilan aniq kasallik o‘chog‘ini ko‘rishdir!",
    analogyEn: 'Debugging is clinical diagnosis—measuring exact variable values (`repr()`, `f"{x=}"`, step debugger) instead of guessing fixes.',
    stopsUz: "Oddiy `print(x)` ko‘pincha aldaydi: `\"5\"` (str) ham, `5` (int) ham, `\"5 \"` (oxirida bo‘shliq bor!) ham `print()` da bir xil `5` bo‘lib ko‘rinadi! Haqiqiy ko‘rinish va tur uchun **`print(f\"{x=}\")`** yoki **`repr(x)`** ishlating!",
    stopsEn: '`print(x)` hides quotes and trailing spaces (`"5 "` looks identical to `5`). Always inspect suspicious values using `repr(x)` or Python 3.8+ `f"{x=}"`!',
    objUz: ['`f"{var=}"` va `repr()` orqali yashirin bo‘shliq va tur xatolarini darrov ko‘rish', 'Ilmiy Debugging (Minimal Repro + Binary Search / Bisection) usulini qo‘llash', 'VS Code Debugger va Python `breakpoint()` / `pdb` (`n`, `s`, `c`, `p`) buyruqlarini bilish'],
    objEn: ['Reveal hidden whitespace and type mismatches with `f"{var=}"` and `repr()`', 'Apply minimal reproducible examples and binary-search isolation', 'Navigate interactive debugging with `breakpoint()` / `pdb` commands'],
    theoryUz: `### 1. \`print(f"{x=}")\` va \`repr(x)\` Kuchi
Python 3.8+ da \`f"{val=}"\` avtomatik \`val='5 '\` ko‘rinishida nomini, \`repr()\` qo‘shtirnoqlarini va bo‘shliqlarini ko‘rsatadi!
### 2. Ilmiy Debugging 4 Qadami
1. **Reproduce**: xatoni har safar qayta chiqaradigan eng kichik misolni (MRE) yarating.
2. **Hypothesize**: "menimcha X qiymat Y bo‘lib qolmoqda".
3. **Inspect**: \`f"{x=}, {type(x)=}"\` yoki \`breakpoint()\` bilan tekshiring.
4. **Fix + Assert**: tuzating va shu bug qaytmasligi uchun test yozing!
### 3. \`breakpoint()\` va \`pdb\` Buyruqlari
IDE bo‘lmagan terminalda \`breakpoint()\` dasturni to‘xtatadi:
- \`n\` (next): keyingi qatorga o‘tish
- \`s\` (step): funksiya ichiga kirish
- \`p expr\` (print): o‘zgaruvchi qiymatini ko‘rish
- \`c\` (continue): keyingi breakpointgacha davom etish
### 4. Binary Search Debugging
100 qator kodda qayerda buzilganini bilmasangiz, o‘rtasiga tekshiruv qo‘yib yarmini chiqarib tashlang!
### 5. Keng tarqalgan xato
Kodga vaqtinchalik qo‘yilgan \`breakpoint()\` yoki \`print()\` ni production ga commit qilib yuborish.`,
    theoryEn: `### 1. \`f"{x=}"\` & \`repr()\`
Expose invisible trailing spaces and \`str\` vs \`int\` mismatches immediately.
### 2. Scientific Method (Reproduce -> Hypothesize -> Inspect -> Prevent)
Shrink the failing input to a Minimal Reproducible Example (MRE) before changing code.
### 3. Interactive \`breakpoint()\` / \`pdb\`
Key commands: \`n\` (next line), \`s\` (step into), \`p var\` (inspect), \`c\` (continue), \`q\` (quit).
### 4. Binary Search Bisection
Halve the suspect code path repeatedly to isolate where state diverges.
### 5. Pitfall
Leaving \`breakpoint()\` inside committed code pauses production workers!`,
    examples: [
      ex('Misol 1: `f"{x=}"` yordamida yashirin tur/bo‘shliq xatosini topish', 'Example 1: Exposing Hidden Types with f"{x=}"', `a = "5 "\nb = 5\nprint("Naive:", a, b)\nprint(f"Debug: {a=}, {b=}")\nfixed = int(a.strip()) + b\nprint("Fixed sum:", fixed)`, `Naive: 5  5\nDebug: a='5 ', b=5\nFixed sum: 10`, 'Oddiy `print` da ikkalasi ham `5` ko‘rinsa-da, `f"{a=}"` uning bo‘shliqli string ekanini darrov fosh qildi!', '`f"{a=}"` revealed the invisible trailing space and quotes immediately.'),
      ex('Misol 2: Binary Search usulida xato qadamini topish', 'Example 2: Pipeline Step Tracer', `def debug_pipeline(nums: list[int]) -> list[int]:\n    step1 = [n for n in nums if n > 0]\n    step2 = [n * 2 for n in step1]\n    assert len(step2) == len(step1), f"Length mismatch: {step1=}, {step2=}"\n    return step2\n\nprint(debug_pipeline([-1, 3, 5]))`, `[6, 10]`, 'Oraliq holatlarni assert va `f"{...=}"` bilan tekshirish xatoni darrov izolyatsiya qiladi.', 'Checking intermediate stage invariants isolates where data diverges.'),
      ex('Misol 3: `inspect` va `sys._getframe` siz toza xato snapshot', 'Example 3: Structured Debug Snapshot', `def bug_snapshot(fn_name: str, **locals_map):\n    parts = ", ".join(f"{k}={v!r}" for k, v in locals_map.items())\n    return f"[DEBUG {fn_name}] {parts}"\n\nprint(bug_snapshot("calc_tax", price=100, rate="0.12"))`, `[DEBUG calc_tax] price=100, rate='0.12'`, '`!r` format specifier har bir qiymatni `repr()` shaklida ko‘rsatadi.', '`!r` shows exact `repr()` formatting for every inspected variable.'),
    ],
    traceTitleUz: 'Debug snapshot izi',
    traceTitleEn: 'Tracing Debug Inspection',
    traceCode: `raw = " 42\\n"\nprint(f"{raw=}")\nclean = int(raw.strip())\nprint(f"{clean=}")`,
    traceSteps: [
      traceStep(1, 'f"{raw=}"', "raw=' 42\\n'", 'Yashirin \\n va bo‘shliq ko‘rindi', 'Exposed whitespace', "raw=' 42\\n'"),
      traceStep(2, 'int(raw.strip())', 'clean=42', 'Tozalanib int ga o‘tdi', 'Stripped and parsed'),
      traceStep(3, 'f"{clean=}"', 'clean=42', 'Endi haqiqiy int ekani ko‘rindi', 'Confirmed int', 'clean=42'),
    ],
    commonMistakes: [
      mistake('Oddiy `print(x)` ga qarab `"5"` ni `5` deb o‘ylash', 'Fooled by str() Output in print()', `x = "5"\ny = 5\nprint(x, y)  # Ikkalasi bir xil ko'rinadi!`, 'Hides string quotes and trailing whitespace', `x = "5"\ny = 5\nprint(f"{x=}, {y=}")`, '`print(x)` `str(x)` ni chiqaradi — qo‘shtirnoq ko‘rinmaydi.', '`print()` strips quotes via `str()`.', 'Debug da har doim `repr(x)` yoki `f"{x=}"` yozing.', 'Use `f"{x=}"` or `repr(x)` when debugging.'),
      mistake('Bir vaqtda 5 ta joyni o‘zgartirib nima tuzatganini bilmay qolish', 'Shotgun Debugging (Changing 5 Things at Once)', `# Changing loop bounds, types, and filters all at once`, 'Cannot tell which edit fixed or broke the code', `print("Change ONE hypothesis at a time and re-test!")`, 'Bir vaqtda 1 ta gipotezani tekshirish haqiqiy sababni ochadi.', 'Shotgun edits hide root causes.', 'Har bir o‘zgarishdan keyin kichik testni qayta yurgizing.', 'Verify one change at a time.'),
    ],
    compareTitleUz: '`print()` debugging vs `pdb` / IDE Debugger',
    compareTitleEn: '`print(f"{x=}")` vs Interactive Debugger',
    compareUz: ['`f"{x=}"` / logging: tezkor skriptlar va sikl oqimini kuzatish uchun qulay.', 'IDE Debugger / `breakpoint()`: murakkab rekursiya, OOP holati va qadam-baqadam to‘xtatish uchun tengsiz.'],
    compareEn: ['`f"{x=}"`: fast linear inspection.', 'Interactive debugger (`breakpoint()`): step-by-step call stack and live expression evaluation.'],
    compareSummaryUz: 'Kichik shubhalarda `f"{x=}"`, murakkab holatlarda IDE breakpoint / `pdb` dan foydalaning.',
    compareSummaryEn: 'Use `f"{x=}"` for quick checks and IDE breakpoints / `pdb` for deep state inspection.',
    practiceTasks: [
      pt('p0708_1', '1-mashq: `f"{x=}"`', 'Task 1: Debug f-string', '`val = " 7 "` uchun `print(f"{val=}")` chiqaring.', 'Inspect with f"{val=}".', `val = " 7 "\nprint(f"{val=}")`, "val=' 7 '", 'f"{val=}"', 'Observe quotes.'),
      pt('p0708_2', '2-mashq: `repr()` bilan yashirin belgi', 'Task 2: repr() Tab Check', '`"a\\tb"` ni `repr()` bilan chiqaring.', 'Print repr of string with tab.', `print(repr("a\\tb"))`, "'a\\tb'", 'repr(...)', 'Exposes \\t.'),
      pt('p0708_3', '3-mashq: `!r` format spec', 'Task 3: Format !r', '`x = "ok"` ni `f"val={x!r}"` bilan chiqaring.', 'Format with !r.', `x = "ok"\nprint(f"val={x!r}")`, "val='ok'", '{x!r}', 'Prints quotes.'),
      pt('p0708_4', '4-mashq: Minimal repro tuzatish', 'Task 4: Fix Off-by-One Bug', '`[10, 20, 30]` ning o‘rtacha qiymatini `sum / len` bilan chiqaring (len-1 bugini tuzating).', 'Fix buggy len-1 divisor.', `nums = [10, 20, 30]\nprint(sum(nums) / len(nums))`, '20.0', 'Divide by len(nums).', 'Prints 20.0.'),
      pt('p0708_5', '5-mashq: `type()` tekshiruvi', 'Task 5: Inspect Type', '`x = "12"` uchun `type(x).__name__` ni chiqaring.', 'Print type name.', `x = "12"\nprint(type(x).__name__)`, 'str', 'type(x).__name__', 'Prints str.'),
    ],
    quiz: [
      q('q0708_1', 'Python 3.8+ da `x = "5 "` uchun `f"{x=}"` nimani chiqaradi?', 'Output of `f"{x=}"` when `x = "5 "`?', ['5', '"5"', "x='5 '", 'x=5'], ['5', '"5"', "x='5 '", 'x=5'], 2, "`x='5 '` — nom, tenglik va `repr()` qiymatini ko‘rsatadi.", "`x='5 '`."),
      q('q0708_2', 'Python 3.7+ da kodni to‘xtatib interaktiv `pdb` ni ochadigan built-in funksiya?', 'Built-in function launching interactive debugger?', ['debug()', 'stop()', 'breakpoint()', 'pause()'], ['debug()', 'stop()', 'breakpoint()', 'pause()'], 2, '`breakpoint()`.', '`breakpoint()`.'),
      q('q0708_3', '`pdb` da funksiya ichiga kirmasdan keyingi qatorga o‘tish buyrug‘i?', '`pdb` command stepping OVER to next line?', ['s', 'n', 'c', 'q'], ['s', 'n', 'c', 'q'], 1, '`n` (next).', '`n` (next).'),
      q('q0708_4', '`pdb` da hozirgi funksiyadan keyingisigacha davom ettirish buyrug‘i?', '`pdb` command to continue execution?', ['n', 's', 'c', 'p'], ['n', 's', 'c', 'p'], 2, '`c` (continue).', '`c` (continue).'),
      q('q0708_5', 'Nima uchun `repr(x)` debug da `str(x)` dan yaxshiroq?', 'Why is `repr(x)` better than `str(x)` when debugging?', ['Qisqaroq', 'Bo‘shliq, tab, \\n va str vs int farqini aniq ko‘rsatadi', 'Tezroq', 'Rangli chiqaradi'], ['Shorter', 'Reveals whitespace, escapes, and quotes/types', 'Faster', 'Colors output'], 1, 'Yashirin belgilar va turlar farqini ko‘rsatadi.', 'Exposes quotes, whitespace, and escape characters.'),
    ],
    homework: hw('Bug Hunt: 3 ta Yashirin Xatoni Izolyatsiya Qilish', 'Debug Audit Challenge', 'Berilgan ma’lumotlar ro‘yxatidagi bo‘shliq, string-son aralashuvi va bo‘sh ro‘yxat chekka holatlarini `f"{...=}"` diagnostikasi yordamida topib, xavfsiz `clean_avg(raw_items)` funksiyasini yozing.', 'Inspect dirty inputs (`[" 10 ", "bad", "", "20"]`) using `f"{x=}"` debug logging and implement a crash-free `clean_avg(raw_items)` helper.', ['f"{x=}" bilan diagnostika', 'Bo‘sh/buzilgan elementlarni toza filtrlash'], ['Use debug f-strings', 'Handle empty list safely'], 'val = int(item.strip())', 'Strip before casting.', 'Bo‘sh ro‘yxat kelsa `0.0` qaytarsin.', 'Return 0.0 when no valid items.', 20),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-07-09',
    courseId: 'errors_testing',
    moduleId: 'c07_m4',
    order: 9,
    titleUz: '`logging` moduli — professional tizim jurnallari va Review #15',
    titleEn: 'Structured Logging (`logging` Module) & Review #15',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-07-08'],
    conceptId: 'logging_module',
    whyUz: "Haqiqiy backend serverlarda 100 ta `print()` yozib bo‘lmaydi: qay biri oddiy ma’lumot, qay biri xato, soat nechada va qaysi modulda bo‘lganini bilish uchun Python'ning standart **`logging`** moduli ishlatiladi!",
    whyEn: 'Production backends replace scattered `print()` calls with Python’s `logging` module—gaining severity levels, timestamps, module names, and zero-code verbosity control.',
    analogyUz: "`print()` — bu ko‘chada baqirib gapirish (hammasi bir xil, qayerga ketgani nomaʼlum). `logging` — bu vaqt muhri (`timestamp`), muhimlik darajasi (`INFO`, `WARNING`, `ERROR`) va arxiv bo‘limi bor rasmiy bort jurnali!",
    analogyEn: '`print()` shouts uncategorized text; `logging` writes timestamped, severity-tagged flight-recorder entries you can filter by environment.',
    stopsUz: "1) Standart holatda `logging` faqat **`WARNING` va undan yuqori** darajalarni chiqaradi (`INFO` va `DEBUG` ko‘rinmaydi, agar `level=logging.INFO` bermasangiz)! 2) `logger.info(\"User %s logged in\", user)` tarzida `%s` lazy formatting ishlating (f-string har doim hisoblanib resurs yeydi)! 3) Xato tutganda **`logger.exception(...)`** stack trace ni avtomatik qo‘shadi!",
    stopsEn: 'Default threshold is `WARNING` (`INFO`/`DEBUG` are hidden unless `level=logging.INFO` is configured). Use lazy `%s` placeholders instead of eager f-strings, and `logger.exception()` inside `except` blocks to capture tracebacks.',
    objUz: ['5 ta log darajasini (`DEBUG < INFO < WARNING < ERROR < CRITICAL`) vaziyatga qarab tanlash', '`logging.basicConfig(level=..., format=..., stream=sys.stdout, force=True)` sozlash', '`logger = logging.getLogger(__name__)` va `logger.exception()` ni qo‘llash'],
    objEn: ['Choose accurately among `DEBUG`, `INFO`, `WARNING`, `ERROR`, and `CRITICAL`', 'Configure `basicConfig` with level, format, and `stream=sys.stdout`', 'Use module loggers (`getLogger(__name__)`) and `logger.exception()`'],
    theoryUz: `### 1. 5 ta Log Darajasi (Tartib Bo‘yicha)
1. \`DEBUG\` (10) — ishlab chiqishda mayda tafsilotlar
2. \`INFO\` (20) — normal ish jarayoni ("Server 8000-portda ishga tushdi")
3. \`WARNING\` (30) — dastur ishlayapti, lekin eʼtibor kerak ("Disk 85% to‘ldi")
4. \`ERROR\` (40) — ma’lum bir operatsiya bajarilmadi ("DB ulanish uzildi")
5. \`CRITICAL\` (50) — butun tizim to‘xtash xavfi
### 2. \`logging.basicConfig\` Sozlash
\`\`\`python
import logging, sys
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s:%(name)s:%(message)s",
    stream=sys.stdout,
    force=True,
)
\`\`\`
### 3. \`logger.exception("...")\`
\`except\` ichida chaqirilganda \`ERROR\` darajasida yozadi va **to‘liq Traceback ni** ham avtomatik ilova qiladi!
### 4. Keng tarqalgan xato
\`logging.info()\` chaqirib "nega chiqmayapti?" deb hayron bo‘lish — chunki default level \`WARNING\`!`,
    theoryEn: `### 1. Severity Hierarchy
\`DEBUG (10) < INFO (20) < WARNING (30) < ERROR (40) < CRITICAL (50)\`.
### 2. Configuring \`basicConfig\`
Pass \`level=logging.INFO\`, \`format=...\`, and \`stream=sys.stdout, force=True\`.
### 3. Module Loggers
Create per-module loggers with \`logger = logging.getLogger(__name__)\`.
### 4. \`logger.exception()\`
Logs at \`ERROR\` severity and automatically attaches the active exception traceback.
### 5. Default Level Trap
Without configuring \`level=logging.INFO\`, \`DEBUG\` and \`INFO\` messages are silently dropped.`,
    examples: [
      ex('Misol 1: `basicConfig` bilan log darajalari filtri', 'Example 1: Configuring Level & Format', `import logging, sys\n\nlogging.basicConfig(\n    level=logging.INFO,\n    format="%(levelname)s | %(name)s | %(message)s",\n    stream=sys.stdout,\n    force=True,\n)\nlogger = logging.getLogger("billing")\nlogger.debug("Ignored debug detail")\nlogger.info("Invoice #%s created", 104)\nlogger.warning("Low credit balance")`, `INFO | billing | Invoice #104 created\nWARNING | billing | Low credit balance`, '`level=logging.INFO` bo‘lgani uchun `DEBUG` yashirildi, `INFO` va `WARNING` chiqdi.', 'Threshold `INFO` suppressed `DEBUG` while emitting `INFO` and `WARNING`.'),
      ex('Misol 2: `except` ichida `logger.error` vs `logger.exception`', 'Example 2: Logging Exceptions Cleanly', `import logging, sys\n\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s:%(message)s", stream=sys.stdout, force=True)\nlog = logging.getLogger("parser")\ntry:\n    int("bad")\nexcept ValueError as err:\n    log.error("Failed parse: %s", err)`, `ERROR:Failed parse: invalid literal for int() with base 10: 'bad'`, 'Lazy `%s` formati faqat log darajasi yoqilgan bo‘lsagina matnni birlashtiradi.', 'Lazy `%s` formatting logged failure cleanly.'),
      ex('Misol 3: `io.StringIO` stream ga log yozib tekshirish', 'Example 3: Capturing Logs in Memory Stream', `import io, logging\nbuf = io.StringIO()\nhandler = logging.StreamHandler(buf)\nlog = logging.getLogger("audit_demo")\nlog.setLevel(logging.WARNING)\nlog.handlers = [handler]\nlog.propagate = False\nlog.info("skip")\nlog.error("alert")\nprint("Captured:", buf.getvalue().strip())`, `Captured: alert`, 'Testlarda `StreamHandler(StringIO)` orqali loglar chiqishini avtomatik tekshirish mumkin.', 'Captured log stream output cleanly for test verification.'),
    ],
    traceTitleUz: 'Log level filtrlash izi',
    traceTitleEn: 'Tracing Log Level Filtering',
    traceCode: `import logging, sys\nlogging.basicConfig(level=logging.WARNING, format="%(levelname)s:%(message)s", stream=sys.stdout, force=True)\nlogging.info("one")\nlogging.error("two")`,
    traceSteps: [
      traceStep(1, 'level=WARNING (30)', 'threshold=30', 'Minimal daraja 30 qo‘yildi', 'Set threshold 30'),
      traceStep(2, 'logging.info("one")', '20 < 30 -> drop', 'INFO tashlab yuborildi', 'Dropped INFO'),
      traceStep(3, 'logging.error("two")', '40 >= 30 -> emit', 'ERROR chiqarildi', 'Emitted ERROR', 'ERROR:two'),
    ],
    commonMistakes: [
      mistake('`basicConfig` bermasdan `logging.info()` kutish', 'Missing level=logging.INFO Configuration', `import logging\nlogging.info("Started!")  # Hech narsa chiqarmaydi!`, 'INFO suppressed because default root level is WARNING', `import logging, sys\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s:%(message)s", stream=sys.stdout, force=True)\nlogging.info("Started!")`, 'Standart daraja `WARNING` bo‘lgani uchun `INFO` jim yopiladi.', 'Default root level is `WARNING`.', 'Dastur boshida `logging.basicConfig(level=logging.INFO, ...)` chaqiring.', 'Configure `level=logging.INFO` at startup.'),
      mistake('Loggerda `%s` o‘rniga `f"..."` ishlatish', 'Eager f-string in High-Volume Logs', `# logger.debug(f"Payload: {expensive_fn()}") always computes even when DEBUG is off!`, 'Wastes CPU on suppressed debug logs', `import logging, sys\nlogging.basicConfig(level=logging.WARNING, format="%(message)s", stream=sys.stdout, force=True)\nlogging.debug("Value: %s", 123)\nprint("Skipped formatting!")`, '`%s` faqat o‘sha daraja yoqilgandagina formatlanadi.', 'Lazy `%s` avoids formatting disabled log lines.', '`logger.info("User %s", uid)` shaklini odat qiling.', 'Use `%s` placeholders in logger calls.'),
    ],
    compareTitleUz: '`print()` vs `logging`',
    compareTitleEn: '`print()` vs `logging`',
    compareUz: ['`print()`: tezkor bir martalik o‘quv skriptlari va CLI foydalanuvchi javoblari uchun.', '`logging`: serverlar, background jarayonlar, xato auditi va daraja filtrlari uchun.'],
    compareEn: ['`print()`: interactive CLI UI output and scratch snippets.', '`logging`: production telemetry, severity filtering, and audit logs.'],
    compareSummaryUz: 'CLI foydalanuvchi natijasi uchun `print()`, tizim hodisalari va xatolarni yozishda esa `logging` ishlating.',
    compareSummaryEn: 'Use `print()` for CLI user output and `logging` for diagnostics and audit trails.',
    practiceTasks: [
      pt('p0709_1', '1-mashq: `INFO` log', 'Task 1: Enable INFO', '`basicConfig(level=logging.INFO, format="%(levelname)s:%(message)s", stream=sys.stdout, force=True)` bilan `"ready"` chiqaring.', 'Log INFO message.', `import logging, sys\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s:%(message)s", stream=sys.stdout, force=True)\nlogging.info("ready")`, 'INFO:ready', 'Set level=logging.INFO', 'Emit info.'),
      pt('p0709_2', '2-mashq: Nomli logger', 'Task 2: Named Logger', '`logging.getLogger("auth")` bilan `WARNING` chiqaring.', 'Use getLogger("auth").', `import logging, sys\nlogging.basicConfig(level=logging.INFO, format="%(name)s:%(levelname)s:%(message)s", stream=sys.stdout, force=True)\nlogging.getLogger("auth").warning("retry")`, 'auth:WARNING:retry', 'logging.getLogger("auth")', 'Call .warning().'),
      pt('p0709_3', '3-mashq: Lazy `%s`', 'Task 3: Lazy Placeholder', '`log.info("id=%s", 42)` chiqaring.', 'Use %s placeholder.', `import logging, sys\nlogging.basicConfig(level=logging.INFO, format="%(message)s", stream=sys.stdout, force=True)\nlogging.info("id=%s", 42)`, 'id=42', 'logging.info("id=%s", 42)', 'Prints id=42.'),
      pt('p0709_4', '4-mashq: Level filtri', 'Task 4: Filter Below ERROR', '`level=logging.ERROR` qilib `warning("a")` va `error("b")` chaqiring.', 'Only ERROR emits.', `import logging, sys\nlogging.basicConfig(level=logging.ERROR, format="%(message)s", stream=sys.stdout, force=True)\nlogging.warning("a")\nlogging.error("b")`, 'b', 'level=logging.ERROR', 'Only b prints.'),
      pt('p0709_5', '5-mashq: StreamHandler + StringIO', 'Task 5: Capture via StringIO', '`StreamHandler(buf)` orqali logni oqimga yozib o‘qing.', 'Capture log in StringIO.', `import io, logging\nbuf = io.StringIO()\nlg = logging.getLogger("t5")\nlg.setLevel(logging.INFO)\nlg.handlers = [logging.StreamHandler(buf)]\nlg.propagate = False\nlg.info("ok")\nprint(buf.getvalue().strip())`, 'ok', 'StreamHandler(buf)', 'Inspect buf.'),
    ],
    quiz: [
      q('q0709_1', 'Python `logging` modulining standart (default) minimal darajasi?', 'Default minimum severity in `logging`?', ['DEBUG', 'INFO', 'WARNING', 'ERROR'], ['DEBUG', 'INFO', 'WARNING', 'ERROR'], 2, '`WARNING` (30).', '`WARNING`.'),
      q('q0709_2', '5 ta log darajasining to‘g‘ri o‘sish tartibi?', 'Ascending severity order?', ['INFO < DEBUG < WARNING < ERROR < CRITICAL', 'DEBUG < INFO < WARNING < ERROR < CRITICAL', 'WARNING < INFO < DEBUG < ERROR < CRITICAL', 'DEBUG < WARNING < INFO < CRITICAL < ERROR'], ['INFO < DEBUG < WARNING < ERROR < CRITICAL', 'DEBUG < INFO < WARNING < ERROR < CRITICAL', 'WARNING < INFO < DEBUG < ERROR < CRITICAL', 'DEBUG < WARNING < INFO < CRITICAL < ERROR'], 1, '`DEBUG < INFO < WARNING < ERROR < CRITICAL`.', '`DEBUG < INFO < WARNING < ERROR < CRITICAL`.'),
      q('q0709_3', '`except` ichida stack trace ni ham logga qo‘shuvchi metod?', 'Logger method automatically attaching active traceback?', ['logger.info()', 'logger.warn()', 'logger.exception()', 'logger.trace()'], ['logger.info()', 'logger.warn()', 'logger.exception()', 'logger.trace()'], 2, '`logger.exception()`.', '`logger.exception()`.'),
      q('q0709_4', 'Har bir modulda logger olishning standart usuli?', 'Standard way to obtain a module-scoped logger?', ['logging.new()', 'logging.getLogger(__name__)', 'logging.Logger()', 'logging.init()'], ['logging.new()', 'logging.getLogger(__name__)', 'logging.Logger()', 'logging.init()'], 1, '`logging.getLogger(__name__)`.', '`logging.getLogger(__name__)`.'),
      q('q0709_5', 'Nima uchun `logger.debug("x=%s", val)` f-stringdan afzal?', 'Why prefer `%s` over f-strings in logger calls?', ['Chiroyliroq', 'Daraja o‘chirilgan bo‘lsa formatlash bajarilmaydi (lazy)', 'Faqat str oladi', 'Faylga yozmaydi'], ['Prettier', 'Skips string formatting when log level is disabled', 'Strings only', 'Skips files'], 1, 'Lazy evaluation CPU va xotirani tejaydi.', 'Avoids unnecessary formatting overhead.'),
    ],
    homework: hw('Ko‘p Darajali Buyurtma Audit Loggeri', 'Order Pipeline Logger', 'Buyurtmani qayta ishlash (`validate` -> `charge` -> `ship`) bosqichlarida `logging.getLogger("orders")` orqali `INFO`, `WARNING` va custom `OrderError` chiqqanda `ERROR` loglarini yozadigan skript tuzing.', 'Instrument an order processor (`validate -> charge -> ship`) emitting `INFO`, `WARNING`, and `ERROR` logs cleanly via `logging`.', ['basicConfig(level=logging.INFO, stream=sys.stdout, force=True)', 'Lazy %s formati'], ['Configure INFO level to stdout', 'Use %s formatting'], 'logger.error("Order %s failed: %s", oid, err)', 'Log structured fields.', 'Loglarni ham konsolga, ham `io.StringIO` arxiviga yozing.', 'Mirror logs into a StringIO buffer.', 25),
    reviewCheckpoint: review(
      15,
      'Review Loyiha #15: Custom Exception + Structured Logging Auditori (Course 7 Milestone)',
      'Review Project #15: Resilient Job Runner with Custom Errors & Logging',
      '75-dars marrasi! `try/except/else/finally`, Custom Exceptions (`JobError`) va `logging` ni birlashtirib, vazifalar navbatini xavfsiz bajaruvchi va audit log yurituvchi mini-dvigatel tuzing.',
      '75-lesson milestone! Combine custom exceptions, `try/except/else/finally`, and structured `logging` into a resilient job runner.',
      ['`JobError` custom xatosi', 'Har bir job uchun `INFO` (start), `ERROR` (fail) va `finally` (cleanup) logi', 'Yakuniy `succeeded` va `failed` statistikasi'],
      ['Custom `JobError` hierarchy', '`INFO`/`ERROR`/`finally` lifecycle logging', 'Return final success/failure counts'],
      `import logging, sys

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(message)s", stream=sys.stdout, force=True)
log = logging.getLogger("runner")

class JobError(Exception):
    pass

def run_jobs(jobs: list[tuple[str, bool]]) -> dict[str, int]:
    stats = {"ok": 0, "err": 0}
    for name, should_fail in jobs:
        try:
            if should_fail:
                raise JobError(f"{name} timed out")
        except JobError as e:
            stats["err"] += 1
            log.error("Job failed: %s", e)
        else:
            stats["ok"] += 1
            log.info("Job done: %s", name)
    return stats

print("Summary:", run_jobs([("sync_db", False), ("email_blast", True), ("backup", False)]))`,
    ),
    relatedVideos: ['VIDEO-COREY-001', 'VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-07-10',
    courseId: 'errors_testing',
    moduleId: 'c07_m4',
    order: 10,
    titleUz: 'Unit Testing — `unittest`, `pytest` naqshlari va TDD asoslari',
    titleEn: 'Unit Testing: `unittest`, `pytest` Patterns, AAA & Edge Cases',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    prerequisites: ['PY-07-09'],
    conceptId: 'unit_testing',
    whyUz: "Kod ishlayotganini bir marta `print()` bilan ko‘rish yetarli emas — ertaga boshqa funksiyani o‘zgartirganingizda eski kodingiz buzilib qolmaganini (regression) faqat avtomatlashtirilgan **Unit Testlar** 1 soniyada kafolatlaydi!",
    whyEn: 'Manual `print()` checks break as codebases evolve. Automated unit tests verify happy paths, edge cases, and exception contracts in milliseconds.',
    analogyUz: "Unit Test — bu bino qurilgandan keyin uning har bir g‘ishti va elektr rozetkasini alohida tekshiruvchi avtomatik inspektor: yangi devor qo‘shilganda eski simlar uzilib qolmaganini darrov aniqlaydi!",
    analogyEn: 'Unit tests are automated circuit breakers for your codebase—instantaneously catching regressions whenever code changes.',
    stopsUz: "Faqat bitta \"ideal\" misolni (happy path) test qilmang! Har bir funksiya uchun 3 toifa test shart: **1) Normal holat, 2) Chekka holat (`0`, bo‘sh list `[]`, katta son), 3) Xato holati (`assertRaises` / `pytest.raises`)**.",
    stopsEn: 'Never test only the happy path—every unit needs normal cases, boundary/empty cases (`0`, `[]`), and exception tests (`assertRaises`).',
    objUz: ['AAA (Arrange -> Act -> Assert) test strukturasini qo‘llash', 'Python standart `unittest.TestCase` (`assertEqual`, `assertAlmostEqual`, `assertRaises`) bilan test yozish', '`pytest` (`assert ...`, `@pytest.mark.parametrize`, `pytest.raises`) sintaksisini tushunish'],
    objEn: ['Structure tests cleanly using Arrange-Act-Assert (AAA)', 'Write runnable test suites with standard library `unittest.TestCase`', 'Understand `pytest` idioms (`assert`, `pytest.raises`, parametrize, fixtures)'],
    theoryUz: `### 1. AAA (Arrange -> Act -> Assert) Strukturasi
1. **Arrange**: kirish ma’lumotlarini tayyorlash
2. **Act**: tekshirilayotgan funksiyani chaqirish
3. **Assert**: natijani kutilgan qiymat bilan solishtirish
### 2. Standart \`unittest\` vs Tashqi \`pytest\`
- **\`unittest\`** Python bilan tayyor keladi (\`class TestMath(unittest.TestCase):\`, \`self.assertEqual\`, \`with self.assertRaises(ValueError):\`).
- **\`pytest\`** (real loyihalarda eng mashhur): oddiy \`def test_add(): assert add(2, 3) == 5\`, \`with pytest.raises(ValueError):\`, \`@pytest.mark.parametrize\`.
### 3. Nima Uchun Pure Funksiyalarni Testlash Oson?
Tashqi DB yoki API ga bog‘liq bo‘lmagan sof funksiyalar millisekundda testlanadi; tashqi bog‘liqliklar esa **Mock / Stub** qilinadi (\`unittest.mock\`).
### 4. Keng tarqalgan xato
Test ichida \`try/except\` yozib xatoni yutib yuborish (test doim yashil o‘taveradi!) — buning o‘rniga \`with self.assertRaises(...):\` ishlating.`,
    theoryEn: `### 1. Arrange-Act-Assert (AAA)
Keep every unit test readable and isolated around one single assertion concern.
### 2. \`unittest\` (Stdlib) vs \`pytest\` (Ecosystem Standard)
\`unittest\` uses \`TestCase\` subclasses and \`self.assertRaises\`; \`pytest\` uses plain functions, raw \`assert\`, and \`pytest.raises\`.
### 3. Testing Edge Cases & Exceptions
Cover normal inputs, empty/zero boundaries, float tolerances (\`assertAlmostEqual\`), and expected errors.
### 4. Mocking External I/O
Use \`unittest.mock\` or dependency injection so unit tests never rely on live networks.
### 5. Pitfall
Forgetting \`test_\` prefix on test functions causes test runners to skip them silently!`,
    examples: [
      ex('Misol 1: To‘liq `unittest.TestCase` to‘plami (happy, edge, error)', 'Example 1: Runnable unittest Suite', `import unittest\n\ndef discount(price: float, pct: float) -> float:\n    if price < 0 or not 0 <= pct <= 100:\n        raise ValueError("Invalid inputs")\n    return round(price * (1 - pct / 100), 2)\n\nclass TestDiscount(unittest.TestCase):\n    def test_standard(self):\n        self.assertEqual(discount(100, 20), 80.0)\n    def test_zero_boundary(self):\n        self.assertEqual(discount(0, 50), 0.0)\n    def test_invalid_raises(self):\n        with self.assertRaises(ValueError):\n            discount(100, 150)\n\nsuite = unittest.defaultTestLoader.loadTestsFromTestCase(TestDiscount)\nres = unittest.TextTestRunner(verbosity=0).run(suite)\nprint("Tests run:", res.testsRun, "| OK:", res.wasSuccessful())`, `Tests run: 3 | OK: True`, '`unittest` standart kutubxonasi normal, chegara va `assertRaises` xato testlarini tekshirdi.', 'Verified happy path, zero boundary, and `ValueError` contract via `unittest`.'),
      ex('Misol 2: `pytest` uslubidagi parametrize jadvali', 'Example 2: Table-Driven Parameterized Tests', `def is_strong_pw(pw: str) -> bool:\n    return len(pw) >= 8 and any(c.isdigit() for c in pw)\n\ncases = [("abc", False), ("abcdefgh", False), ("python2026", True)]\nfor pw, expected in cases:\n    assert is_strong_pw(pw) == expected, f"Failed on {pw}"\nprint("Passed", len(cases), "parameterized cases")`, `Passed 3 parameterized cases`, 'Xuddi `@pytest.mark.parametrize` kabi bitta siklda ko‘plab ssenariylar tekshirildi.', 'Data-driven test table verified multiple boundary cases concisely.'),
      ex('Misol 3: `unittest.mock.Mock` bilan tashqi bog‘liqlikni almashtirish', 'Example 3: Isolation via unittest.mock', `from unittest.mock import Mock\n\ndef send_welcome(mailer, email: str) -> str:\n    mailer.send(email, "Welcome!")\n    return f"Sent to {email}"\n\nfake_mailer = Mock()\nmsg = send_welcome(fake_mailer, "ali@uz.dev")\nfake_mailer.send.assert_called_once_with("ali@uz.dev", "Welcome!")\nprint(msg)`, `Sent to ali@uz.dev`, 'Haqiqiy email yubormasdan `Mock` orqali chaqiruv argumentlari tekshirildi.', 'Verified collaborator call arguments cleanly without touching SMTP.'),
    ],
    traceTitleUz: '`assertRaises` tekshiruvi izi',
    traceTitleEn: 'Tracing assertRaises',
    traceCode: `import unittest\ntc = unittest.TestCase()\nwith tc.assertRaises(ZeroDivisionError):\n    _ = 1 / 0\nprint("Passed exception test!")`,
    traceSteps: [
      traceStep(1, 'with tc.assertRaises(ZeroDivisionError):', 'expecting error', 'Kontekst menejer kutilayotgan xatoni belgiladi', 'Entered expected-exception guard'),
      traceStep(2, '1 / 0', 'ZeroDivisionError', 'Kutilgan xato otildi', 'Raised matching error'),
      traceStep(3, '(exit block)', 'TEST PASS', 'Xato tutildi va test muvaffaqiyatli o‘tdi', 'Assertion passed', 'Passed exception test!'),
    ],
    commonMistakes: [
      mistake('Test funksiyasi nomini `test_` bilan boshlamaslik', 'Test Function Missing test_ Prefix', `import unittest\nclass T(unittest.TestCase):\n    def check_add(self):\n        self.assertEqual(1 + 1, 3)`, 'Test runner silently reports 0 tests run!', `import unittest\nclass T(unittest.TestCase):\n    def test_add(self):\n        self.assertEqual(1 + 1, 2)\ns = unittest.defaultTestLoader.loadTestsFromTestCase(T)\nprint("Discovered:", s.countTestCases())`, 'Ham `unittest`, ham `pytest` faqat `test_` bilan boshlanadigan metodlarni topadi.', 'Test runners only discover methods prefixed with `test_`.', 'Har bir test nomini `test_...` bilan boshlang.', 'Start every test method/function with `test_`.'),
      mistake('Faqat muvaffaqiyatli (happy) holatni test qilish', 'Testing Only Happy Paths', `def div(a, b): return a / b\nassert div(10, 2) == 5`, 'Misses b=0 ZeroDivisionError and float cases', `import unittest\ntc = unittest.TestCase()\ntc.assertAlmostEqual(10 / 3, 3.3333, places=3)\nwith tc.assertRaises(ZeroDivisionError):\n    _ = 10 / 0\nprint("Edge & error covered!")`, 'Real xatolar chegaraviy va noto‘g‘ri kirishlarda chiqadi.', 'Bugs hide at boundaries and invalid inputs.', 'Har funksiya uchun normal + boundary + error test yozing.', 'Cover normal, edge, and failure cases.'),
    ],
    compareTitleUz: '`unittest` (stdlib) vs `pytest` (tashqi standart)',
    compareTitleEn: '`unittest` vs `pytest`',
    compareUz: ['`unittest`: qo‘shimcha o‘rnatishsiz tayyor, Java/OOP uslubidagi `TestCase` klasslari.', '`pytest`: qisqa `assert`, `@pytest.mark.parametrize`, `fixtures` va boy plaginlar — sanoat standarti.'],
    compareEn: ['`unittest`: zero-install standard library `TestCase` classes.', '`pytest`: industry standard with plain `assert`, fixtures, and `@parametrize`.'],
    compareSummaryUz: 'Loyihalarda `pytest` yozish osonroq; lekin `unittest` va `unittest.mock` tamoyillari ikkalasida ham bir xil!',
    compareSummaryEn: 'Write `pytest` in modern projects; the AAA structure, edge-case discipline, and `unittest.mock` apply everywhere.',
    practiceTasks: [
      pt('p0710_1', '1-mashq: `TestCase.assertEqual`', 'Task 1: TestCase Equality', '`unittest.TestCase().assertEqual(2 + 3, 5)` ni tekshirib `"ok"` chiqaring.', 'Run assertEqual.', `import unittest\nunittest.TestCase().assertEqual(2 + 3, 5)\nprint("ok")`, 'ok', 'TestCase().assertEqual', 'Prints ok.'),
      pt('p0710_2', '2-mashq: `assertRaises`', 'Task 2: Assert ValueError', '`int("bad")` `ValueError` berishini `assertRaises` bilan tasdiqlang.', 'Test ValueError via assertRaises.', `import unittest\ntc = unittest.TestCase()\nwith tc.assertRaises(ValueError):\n    int("bad")\nprint("raised")`, 'raised', 'with tc.assertRaises(ValueError):', 'Prints raised.'),
      pt('p0710_3', '3-mashq: `assertAlmostEqual`', 'Task 3: Float Test', '`0.1 + 0.2` va `0.3` ni `assertAlmostEqual` bilan tekshiring.', 'Check float closeness.', `import unittest\nunittest.TestCase().assertAlmostEqual(0.1 + 0.2, 0.3)\nprint("close")`, 'close', 'assertAlmostEqual', 'Prints close.'),
      pt('p0710_4', '4-mashq: Parametrized jadval', 'Task 4: Parametrized Loop', '`[(2, 4), (-3, 9), (0, 0)]` uchun `x * x` ni assert qiling.', 'Loop over test cases.', `for x, exp in [(2, 4), (-3, 9), (0, 0)]:\n    assert x * x == exp\nprint("3/3")`, '3/3', 'assert x * x == exp', 'Prints 3/3.'),
      pt('p0710_5', '5-mashq: `Mock` chaqiruv tekshiruvi', 'Task 5: Mock Verification', '`m = Mock(); m.save("u1")` ni `assert_called_once_with("u1")` bilan tekshiring.', 'Verify Mock call.', `from unittest.mock import Mock\nm = Mock()\nm.save("u1")\nm.save.assert_called_once_with("u1")\nprint("mock ok")`, 'mock ok', 'assert_called_once_with', 'Prints mock ok.'),
    ],
    quiz: [
      q('q0710_1', 'Test yozishdagi AAA shabloni nimani bildiradi?', 'What does AAA stand for in unit testing?', ['Add, Alter, Apply', 'Arrange, Act, Assert', 'Assert, Abort, Allow', 'Async, Await, Apply'], ['Add, Alter, Apply', 'Arrange, Act, Assert', 'Assert, Abort, Allow', 'Async, Await, Apply'], 1, 'Arrange -> Act -> Assert.', 'Arrange, Act, Assert.'),
      q('q0710_2', 'Test funksiyasi/metodi nomi nima bilan boshlanishi shart?', 'Required prefix for test discovery?', ['run_', 'check_', 'test_', 'spec_'], ['run_', 'check_', 'test_', 'spec_'], 2, '`test_` bilan.', '`test_`.'),
      q('q0710_3', 'Funksiya kutilgan xatoni ko‘targanini tekshirish uchun `unittest` metodi?', 'Method verifying an expected exception in `unittest`?', ['assertError', 'assertRaises', 'catchError', 'expectFail'], ['assertError', 'assertRaises', 'catchError', 'expectFail'], 1, '`self.assertRaises(...)`.', '`self.assertRaises(...)`.'),
      q('q0710_4', 'Float natijalarni testlashda qaysi metod afzal?', 'Preferred assertion for floating-point values?', ['assertEqual', 'assertAlmostEqual', 'assertIs', 'assertTrue'], ['assertEqual', 'assertAlmostEqual', 'assertIs', 'assertTrue'], 1, '`assertAlmostEqual`.', '`assertAlmostEqual`.'),
      q('q0710_5', 'Test ichida ma’lumotlar bazasi yoki tashqi API ni simulyatsiya qilish vositasi?', 'Tool replacing external dependencies in unit tests?', ['Mock (unittest.mock)', 'eval()', 'pickle', 'globals()'], ['Mock (unittest.mock)', 'eval()', 'pickle', 'globals()'], 0, '`unittest.mock.Mock`.', '`unittest.mock.Mock`.'),
    ],
    homework: hw('7-Kurs Yakuniy To‘liq Unit Test To‘plami', 'Course 7 Password & Wallet Test Suite', 'O‘zingizning `Wallet(balance)` yoki `withdraw(balance, amount)` funksiyangiz uchun kamida 5 ta testli (`normal`, `zero boundary`, `float rounding`, `ValueError`, `Mock` logger) `unittest.TestCase` sinfini yozib ishga tushiring.', 'Write a 5-test `unittest.TestCase` suite for a `withdraw(balance, amount, audit=None)` helper covering happy path, zero boundary, float math, `ValueError` via `assertRaises`, and `Mock` audit logging.', ['Kamida 5 ta test_ metodi', 'unittest.TextTestRunner bilan natija chiqarish'], ['5+ test_ methods', 'Run via TextTestRunner'], 'suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestWallet)', 'Run all tests cleanly.', '`pytest` uslubidagi muqobil `@pytest.mark.parametrize` ro‘yxatini ham izohda yozib ko‘rsating.', 'Document equivalent `pytest` parametrize table.', 25),
    relatedVideos: ['VIDEO-CS50P-001', 'VIDEO-COREY-001'],
  }),
];
