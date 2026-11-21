import type { Lesson } from '../../types/domain';
import { ex, hw, makeLesson, mistake, pt, q, review, traceStep } from './lessonBuilder';

export const C15_PART2_LESSONS: Lesson[] = [
  makeLesson({
    id: 'PY-15-06',
    courseId: 'automation',
    moduleId: 'c15_m2',
    order: 6,
    titleUz: 'BeautifulSoup (`bs4`) va HTML Parsing — DOM, Selektorlar va Toza Matn',
    titleEn: 'BeautifulSoup & HTML Parsing: DOM Trees, CSS Selectors & Clean Extraction',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-15-05'],
    conceptId: 'auto_html_parsing',
    whyUz: "HTML sahifadan narx, sarlavha yoki havolalarni ajratishda ko‘pchilik **Regex (`<div.*?>`)** yozishga urinadi — HTML esa ichma-ich teglardan iborat daraxt (DOM) bo‘lib, regex darhol sinadi! Python da **BeautifulSoup (`bs4` + `lxml`)** yoki standart kutubxonadagi **`html.parser.HTMLParser`** bilan DOM daraxtidan ishonchli ma’lumot sug‘urib olinadi.",
    whyEn: 'Extract structured data from raw HTML reliably using DOM parsers (`BeautifulSoup` / `lxml` in production, and stdlib `html.parser.HTMLParser`) instead of fragile regular expressions.',
    analogyUz: "**Regex bilan HTML o‘qish** — bu daraxtdagi olmalarni ko‘zini bog‘lab qaychi bilan kesish (shoxlar chalkashib ketadi). **BeautifulSoup / DOM Parser** esa daraxtni aniq shoxlar (`<html> -> <body> -> <article class='card'>`) bo‘yicha ko‘rib terib olishdir!",
    analogyEn: 'Parsing HTML with regex breaks on nested tags; a DOM parser builds the tree so selectors like `article.card h2` grab exact nodes cleanly.',
    stopsUz: "HTML parsingda 3 oltin qoida: 1) **HTML ni hech qachon Regex bilan parse qilmang** — `BeautifulSoup(html, 'lxml')` (yoki stdlib `HTMLParser`) ishlating! 2) CSS selektorlarda dinamik hash klasslar (`.css-1x9k2a`) o‘rniga semantik atributlar (`article[data-id]`, `h2.title`, `a[href]`) tanlang. 3) Matnni doim `.get_text(\" \", strip=True)` bilan tozalang va `None` elementlarni tekshiring (`AttributeError: 'NoneType'`)!",
    stopsEn: 'Never parse HTML with regex—use a DOM parser (`BeautifulSoup` or `html.parser`). Target semantic tags/attributes rather than auto-generated hash classes, and guard against `None` returns before calling `.text`.',
    objUz: ['DOM daraxti (`tag`, `attrs`, `children`) va `HTMLParser` / `BeautifulSoup` ishlash mexanizmi', '`select()` (CSS selektorlar) vs `find()`/`find_all()` va semantik atribut tanlash', 'Defensiv parsing (`None` tekshiruvi, whitespace/narx tozalash va nisbiy URL `urljoin`)'],
    objEn: ['Navigate HTML DOM trees with stdlib `HTMLParser` and `BeautifulSoup` selectors', 'Choose resilient semantic attributes over brittle auto-generated CSS classes', 'Write defensive extractors guarding `None` nodes and normalizing whitespace/prices'],
    theoryUz: `### 1. Nima Uchun DOM Parser (Regex Emas)?
HTML ichma-ich \`<div><div>...</div></div>\` va atribut tartiblari tufayli regular language emas!
### 2. BeautifulSoup (\`bs4\`) Asosiy API
- \`soup = BeautifulSoup(html, "lxml")\`
- \`soup.find("h1", class_="price")\` (topilmasa \`None\`!)
- \`soup.select("article.card > a[href]")\` (CSS selektor ro‘yxati)
- \`node.get_text(" ", strip=True)\`
### 3. Stdlib \`html.parser.HTMLParser\`
Tashqi paketlarsiz ham Python standart kutubxonasi \`HTMLParser\` bilan \`handle_starttag\`, \`handle_data\`, \`handle_endtag\` hodisalarini ushlab toza HTML parser qurish mumkin!`,
    theoryEn: `### 1. DOM Parsing Beats Regex
Nested tags and varying attribute order make regex brittle; DOM parsers tokenize HTML cleanly into tags, attributes, and text nodes.
### 2. BeautifulSoup Selectors
Use \`soup.select("card a[href]")\`, always check \`if node is not None:\`, and call \`node.get_text(" ", strip=True)\`.
### 3. Stdlib \`html.parser\`
Python’s built-in \`HTMLParser\` provides streaming tag/attribute/text hooks with zero external dependencies.`,
    examples: [
      ex('Misol 1: Stdlib `HTMLParser` bilan Mahsulot Kartalarini Ajratish', 'Example 1: Pure-Stdlib HTML Product Extractor', `from html.parser import HTMLParser

class ProductParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items, self._in_title, self._in_price = [], False, False
        self._cur: dict = {}
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        cls = d.get("class", "")
        if tag == "div" and cls == "card":
            self._cur = {"href": d.get("data-url", "")}
        elif tag == "h2" and cls == "title":
            self._in_title = True
        elif tag == "span" and cls == "price":
            self._in_price = True
    def handle_data(self, data):
        txt = data.strip()
        if not txt: return
        if self._in_title: self._cur["title"] = txt
        elif self._in_price: self._cur["price"] = txt
    def handle_endtag(self, tag):
        if tag == "h2": self._in_title = False
        elif tag == "span": self._in_price = False
        elif tag == "div" and "title" in self._cur:
            self.items.append(self._cur); self._cur = {}

html = '<div class="card" data-url="/p/1"><h2 class="title">  Py Book </h2><span class="price">$29</span></div>'
p = ProductParser(); p.feed(html)
print(p.items)`, `[{'href': '/p/1', 'title': 'Py Book', 'price': '$29'}]`, 'Stdlib `HTMLParser` ichki holat bayroqlari bilan HTML teglari va atributlaridan toza lug‘atlar yig‘adi.', 'Built-in `HTMLParser` extracts attributes and trimmed text cleanly without regex.'),
      ex('Misol 2: Defensiv Qiymat Tozalash (`None` Guard & Price Parsing)', 'Example 2: Defensive Field & Price Normalization', `def parse_price_cents(raw: str | None) -> int | None:
    if not raw:
        return None
    cleaned = raw.replace("$", "").replace(",", "").strip()
    return int(round(float(cleaned) * 100))

print(parse_price_cents(" $1,250.50 "), "| missing:", parse_price_cents(None))`, `125050 | missing: None`, 'Narx va `None` qiymatlarni xavfsiz tozalash scraperning yarim yo‘lda yiqilishini to‘xtatadi.', 'Defensive helpers normalize currency strings and return `None` when optional elements are absent.'),
      ex('Misol 3: Nisbiy Href -> To‘liq URL (`urljoin` usuli)', 'Example 3: Resolving Relative Links Safely', `def resolve_url(base: str, href: str) -> str:
    if href.startswith(("http://", "https://")):
        return href
    return base.rstrip("/") + "/" + href.lstrip("/")

print(resolve_url("https://shop.uz", "/items/42"))`, `https://shop.uz/items/42`, 'Nisbiy `/items/42` havolalarni bazaviy domen bilan birlashtirish to‘liq link beradi.', 'Resolves relative `href` paths against the site origin cleanly.'),
    ],
    traceTitleUz: 'HTMLParser Event Oqimi',
    traceTitleEn: 'Tracing HTMLParser Tag Hooks',
    traceCode: `<h2 class="title">Py Book</h2>`,
    traceSteps: [
      traceStep(1, 'handle_starttag("h2")', '_in_title = True', 'Sarlavha tegi ochildi', 'Entered title tag'),
      traceStep(2, 'handle_data("Py Book")', '_cur["title"] = "Py Book"', 'Matn yig‘ildi', 'Captured trimmed text'),
      traceStep(3, 'handle_endtag("h2")', '_in_title = False', 'Teg yopildi', 'Closed title state'),
    ],
    commonMistakes: [
      mistake('HTML teglarini Regex bilan ajratishga urinish', 'Parsing Nested HTML with Regex', `# re.findall(r"<div>(.*?)</div>", html) breaks immediately on nested <div> tags!`, 'Wrong matches & broken output', `print("Always use a DOM parser (BeautifulSoup or html.parser.HTMLParser)!")`, 'HTML ichma-ich tuzilishga ega — doim DOM parser ishlating.', 'Nested tags break regex patterns; use a proper HTML parser.', 'DOM parser ishlating.', 'Use a DOM parser.'),
      mistake('`soup.find(...)` dan qaytgan `None` da `.text` chaqirish', 'Calling .text Without Checking for None', `# title = soup.find("h1").text crashes with AttributeError when one page lacks <h1>!`, "AttributeError: 'NoneType' object has no attribute 'text'", `node_text = None\nprint(node_text.strip() if node_text else "N/A")`, 'Topilmagan element `None` qaytaradi — avval tekshiring.', 'Always check `if node is not None` before accessing `.text` or attributes.', '`None` tekshiruvi qo‘ying.', 'Guard against `None`.'),
    ],
    compareTitleUz: 'BeautifulSoup (`bs4`) vs Stdlib `HTMLParser`',
    compareTitleEn: 'BeautifulSoup (`bs4`) vs Stdlib `HTMLParser`',
    compareUz: ['`HTMLParser`: nol tashqi paket (stdlib), oqimli va yengil.', 'BeautifulSoup (`bs4` + `lxml`): kuchli CSS selektorlar (`.select()`), buzilgan HTML ni tuzatish va qulay daraxt navigatsiyasi.'],
    compareEn: ['`HTMLParser`: zero dependencies, fast streaming hooks.', 'BeautifulSoup (`bs4`): concise CSS `.select()` queries and forgiving tree navigation.'],
    compareSummaryUz: 'HTML ni DOM parser bilan o‘qing, semantik atributlarni tanlang, `None` holatlarni tekshiring va matn/narxlarni tozalang.',
    compareSummaryEn: 'Parse HTML with DOM tools, pick semantic selectors, guard missing nodes against `None`, and normalize extracted text.',
    practiceTasks: [
      pt('p1506_1', '1-mashq: Barcha `<a>` havolalarni yig‘ish', 'Task 1: Extract All Hrefs', '`HTMLParser` bilan `<a href="...">` linklarini ro‘yxatga oling.', 'Collect href attributes.', `from html.parser import HTMLParser\nclass Links(HTMLParser):\n    def __init__(self): super().__init__(); self.out = []\n    def handle_starttag(self, t, a):\n        if t == "a": self.out.append(dict(a).get("href"))\np = Links(); p.feed('<a href="/a">1</a><a href="/b">2</a>')\nprint(p.out)`, "['/a', '/b']", 'Check tag == "a" and dict(attrs)', "Prints ['/a', '/b']."),
      pt('p1506_2', '2-mashq: `None` xavfsiz `.text` olish', 'Task 2: Safe Text Helper', '`node_text` `None` bo‘lsa `""`, aks holda `.strip()` qaytaring.', 'Guard None node.', `def safe_txt(s): return s.strip() if s else ""\nprint(repr(safe_txt(None)), repr(safe_txt("  Hi  ")))`, "'' 'Hi'", 'Check truthiness/None', "Prints '' 'Hi'."),
      pt('p1506_3', '3-mashq: Ko‘p bo‘sh joylarni tozalash', 'Task 3: Collapse Whitespace', '`"  Salom\\n\\t  Python  "` ni `"Salom Python"` qiling.', 'Normalize whitespace.', `print(" ".join("  Salom\\n\\t  Python  ".split()))`, 'Salom Python', '" ".join(s.split())', 'Prints Salom Python.'),
      pt('p1506_4', '4-mashq: Narx matnidan `int` olish', 'Task 4: Clean Price String', '`"$1,299"` -> `1299` ga aylantiring.', 'Parse price integer.', `def to_int(p): return int("".join(c for c in p if c.isdigit()))\nprint(to_int("$1,299"))`, '1299', 'Keep digits only', 'Prints 1299.'),
      pt('p1506_5', '5-mashq: HTML Entity dekodlash', 'Task 5: Unescape HTML Entities', '`html.unescape("Py &amp; SQL &lt;3")` natijasini chiqaring.', 'Unescape HTML.', `import html\nprint(html.unescape("Py &amp; SQL &lt;3"))`, 'Py & SQL <3', 'Use html.unescape', 'Prints Py & SQL <3.'),
    ],
    quiz: [
      q('q1506_1', 'Nima uchun HTML ni parse qilishda Regex o‘rniga BeautifulSoup / DOM Parser ishlatiladi?', 'Why use BeautifulSoup/DOM parsers instead of regex for HTML?', ['Tezroq', 'HTML ichma-ich teglardan iborat daraxt tuzilmasi bo‘lib regex murakkab teglarda sinadi', 'Faqat CSS', 'UTF-8'], ['Faster', 'HTML is nested tree data where regex breaks on nested tags and attribute variations', 'CSS only', 'UTF-8'], 1, 'HTML ichma-ich daraxt bo‘lgani uchun.', 'HTML is nested tree structure.'),
      q('q1506_2', '`soup.find("h1")` sahifada topilmasa nimani qaytaradi?', 'What does `soup.find("h1")` return if no `<h1>` exists?', ['""', '[]', 'None', 'IndexError'], ['""', '[]', 'None', 'IndexError'], 2, '`None` (shuning uchun `.text` dan oldin tekshirish shart!).', '`None`.'),
      q('q1506_3', 'Scraping da `.css-a9f81c` kabi hash klass o‘rniga qaysi selektor ishonchliroq?', 'More resilient selector than auto-generated CSS classes like `.css-a9f81c`?', ['20-div indeksi', 'Semantik `data-*` atributlari yoki `article h2` kabi tuzilmaviy teglar', 'Inline style', 'XPath //div[9]'], ['Index 20', 'Semantic `data-*` attributes or structural tags like `article h2`', 'Inline style', 'Deep XPath'], 1, 'Semantik atribut va tuzilmaviy teglar.', 'Semantic attributes & structural tags.'),
      q('q1506_4', 'HTML dagi `&amp;` va `&nbsp;` kabi belgilarni oddiy matnga o‘giruvchi stdlib funksiyasi?', 'Stdlib function decoding HTML entities like `&amp;`?', ['json.loads', 'html.unescape()', 're.sub', 'str.strip'], ['json.loads', 'html.unescape()', 're.sub', 'str.strip'], 1, '`html.unescape()`.', '`html.unescape()`.'),
      q('q1506_5', 'Matn ichidagi ortiqcha `\\n`, `\\t` va bo‘shliqlarni bitta probelga tushirish usuli?', 'Clean Python idiom collapsing arbitrary newlines/tabs into single spaces?', ['s.strip()', '" ".join(s.split())', 's.lower()', 's.replace(" ", "")'], ['s.strip()', '" ".join(s.split())', 's.lower()', 's.replace(" ", "")'], 1, '`" ".join(s.split())`.', '`" ".join(s.split())`.'),
    ],
    homework: hw('HTML Jadval & Katalog Extractor', 'Resilient HTML Table & Card Extractor', 'Stdlib `HTMLParser` yordamida mahsulotlar sahifasidan nomi, narxi (integer tiyin/dollar), havolasi va `html.unescape()` qilingan tavsifini ajratib oluvchi, yo‘q maydonlarda yiqilmaydigan extractor yozing.', 'Write a resilient `HTMLParser` extracting cards (`title`, normalized integer `price`, resolved `url`) while tolerating missing tags and unescaping HTML entities.', ['HTMLParser + html.unescape', 'Missing tag va narx normalizatsiyasi'], ['HTMLParser + unescape', 'Handles missing fields cleanly'], 'Maintain current item dict on card start/end tags and guard missing keys with .get().', 'Clean DOM extractor.', 'Natijani CSV faylga eksport qiling.', 'Export to CSV.', 25),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-15-07',
    courseId: 'automation',
    moduleId: 'c15_m3',
    order: 7,
    titleUz: 'Selenium va Browser Automation — SPA, Explicit Waits va Headless Testlar',
    titleEn: 'Selenium & Browser Automation: Explicit Waits, Headless Mode & Playwright',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['PY-15-06'],
    conceptId: 'auto_browser',
    whyUz: "Oddiy `requests.get()` bilan React/Vue (SPA) saytini yuklasangiz ko‘pincha faqat bo‘sh `<div id='root'></div>` keladi — chunki kontent JavaScript orqali yuklanadi! **Selenium** va **Playwright** haqiqiy brauzerni (Chrome/Firefox) boshqarib, tugmalarni bosish, form to‘ldirish va End-to-End (E2E) testlarni avtomatlashtiradi.",
    whyEn: 'Automate JavaScript-rendered Single Page Apps and E2E tests with Selenium / Playwright: choose explicit condition waits (`WebDriverWait`) over `time.sleep()`, run headless in CI, and avoid stale-element errors.',
    analogyUz: "**`requests` + `BeautifulSoup`** — bu gazeta o‘qish (statik HTML tayyor keladi). **Selenium / Playwright** — bu robot qo‘l: u haqiqiy Chrome brauzerini ochadi, JS ishga tushishini kutadi, tugmani bosadi va paydo bo‘lgan natijani o‘qiydi!",
    analogyEn: 'Static fetchers read the initial HTML envelope; Selenium and Playwright drive a real browser engine to execute JavaScript, click buttons, and wait for dynamic DOM updates.',
    stopsUz: "Browser Automation da 3 oltin qoida: 1) **Hech qachon `time.sleep(5)` yozmang** — sayt 0.5s da tayyor bo‘lsa vaqt ketadi, 6s olsa sinadi! Doim **Explicit Wait (`WebDriverWait(driver, 10).until(EC.visibility_of_element_located(...))`)** ishlating! 2) **Har doim `try ... finally: driver.quit()`** yozing (xato chiqsa ham Chrome jarayonlari xotirani yeb qolmasin!). 3) Server/CI da **`--headless=new`** va aniq `data-testid` lokatorlarini ishlating!",
    stopsEn: 'Replace brittle `time.sleep()` calls with Explicit Waits (`WebDriverWait`), always wrap browser sessions in `try ... finally: driver.quit()` (or Playwright `with` context managers), and target stable `data-testid` locators.',
    objUz: ['Statik SSR vs JavaScript SPA (qachon Browser kerak, qachon JSON API kifoya)', '`time.sleep()` vs Explicit `WebDriverWait` vs Implicit Wait farqi', 'Headless CI rejimi, `driver.quit()` tozalash va Selenium vs Playwright tanlovi'],
    objEn: ['Decide when browser automation is needed vs HTTP/API fetching', 'Use Explicit Waits (`WebDriverWait`) with deadline polling instead of `time.sleep()`', 'Compare Selenium WebDriver with modern Playwright auto-waiting'],
    theoryUz: `### 1. Explicit Wait (\`WebDriverWait\`) Mexanizmi
\`WebDriverWait(driver, timeout=10)\` har 0.5s da shartni (polling) tekshiradi — element paydo bo‘lgan ZAHOTI davom etadi, muddat tugasa \`TimeoutException\` ko‘taradi!
### 2. \`time.sleep()\` vs Explicit Wait
- \`time.sleep(5)\`: sekin serverda sinadi (flaky!), tez serverda bekorga 4.5s kutadi.
- **Explicit Wait**: aniq element holatini (\`clickable\`, \`visible\`) kutadi.
### 3. \`try / finally: driver.quit()\`
Brauzer jarayoni og‘ir (~300MB RAM) — xato yuz berganda ham \`driver.quit()\` chaqirilmasa zombie Chrome lar server RAM ini to‘ldiradi!
### 4. Selenium vs Playwright
Playwright avtomatik auto-wait, tarmoq so‘rovlarini ushlash (\`page.route\`) va tezroq WebSocket protokolini beradi; Selenium esa ulkan meros va keng ekotizimga ega.`,
    theoryEn: `### 1. Polling-Based Explicit Waits
Instead of fixed \`time.sleep()\`, poll a predicate until ready or raise \`TimeoutException\` at the deadline.
### 2. Resource Cleanup
A leaked headless browser consumes hundreds of MB of RAM—always close via \`finally: driver.quit()\` or a context manager.
### 3. Stable Locators
Prefer \`[data-testid="submit-btn"]\` over fragile \`/html/body/div[3]/div[2]/button\`.
### 4. Selenium vs Playwright
Playwright ships built-in auto-waiting and network interception; Selenium offers broad WebDriver compatibility.`,
    examples: [
      ex('Misol 1: Explicit Wait Polling Engine (`WebDriverWait.until` mexanizmi)', 'Example 1: Explicit Wait Deadline Poller Simulation', `def wait_until(predicate, max_ticks: int = 10):
    for tick in range(1, max_ticks + 1):
        val = predicate(tick)
        if val:
            return val, tick
    raise TimeoutError("Element never became visible")

# Element appears dynamically at tick 3
res, took = wait_until(lambda t: {"text": "Loaded!"} if t >= 3 else None)
print("Resolved immediately at tick:", took, "| data:", res)`, `Resolved immediately at tick: 3 | data: {'text': 'Loaded!'}`, 'Explicit Wait element 3-qadamda tayyor bo‘lishi bilanoq qaytdi — 10 qadamni bekorga kutmadi!', 'Polling wait returns the instant the condition succeeds instead of sleeping for the entire timeout.'),
      ex('Misol 2: Context Manager bilan Brauzer Sessiyasini Kafolatli Yopish', 'Example 2: Context-Managed Browser Cleanup (finally: quit)', `from contextlib import contextmanager

class MockBrowser:
    def __init__(self): self.closed = False
    def quit(self): self.closed = True

@contextmanager
def open_browser():
    drv = MockBrowser()
    try:
        yield drv
    finally:
        drv.quit()

try:
    with open_browser() as b:
        raise RuntimeError("Click failed!")
except RuntimeError:
    print("Browser closed cleanly despite error?", b.closed)`, `Browser closed cleanly despite error? True`, 'Kontekst menejer (`finally: drv.quit()`) xato chiqqanda ham zombie Chrome qoldirmaydi.', 'Context managers guarantee `driver.quit()` executes even when a test step fails.'),
      ex('Misol 3: Barqaror Lokator Skorlash (`data-testid` vs mo‘rt XPath)', 'Example 3: Scoring CSS/XPath Locator Resilience', `def rate_locator(loc: str) -> str:
    if "data-testid" in loc or loc.startswith("#"): return "STRONG"
    if "/div[" in loc: return "FRAGILE"
    return "MODERATE"

print(rate_locator('[data-testid="pay-btn"]'), rate_locator("/html/body/div[3]/div[1]/button"))`, `STRONG FRAGILE`, '`data-testid` va ID lokatorlar dizayn o‘zgarganda ham sinmaydi.', 'Semantic `data-testid` locators survive layout refactors unlike positional XPaths.'),
    ],
    traceTitleUz: 'Explicit Wait Polling Trace',
    traceTitleEn: 'Tracing WebDriverWait Polling',
    traceCode: `wait_until(pred, max_ticks=10) # ready at tick 3`,
    traceSteps: [
      traceStep(1, 'tick 1', 'pred(1) -> None', 'Hali JS yuklanmoqda', 'Not ready yet'),
      traceStep(2, 'tick 2', 'pred(2) -> None', 'Davom etmoqda', 'Polling continues'),
      traceStep(3, 'tick 3', 'pred(3) -> {"text": "Loaded!"}', 'Tayyor! Darhol qaytdi', 'Succeeded early at tick 3'),
    ],
    commonMistakes: [
      mistake('`time.sleep(5)` yozib element yuklanishini kutish', 'Sleeping Fixed Seconds Instead of Explicit Waits', `# time.sleep(5) slows every test down AND still fails randomly when CI is busy for 6s!`, 'Slow & flaky E2E suite', `print("Replace time.sleep() with WebDriverWait / Playwright auto-wait!")`, 'Aniq shartga (`EC.element_to_be_clickable`) asoslangan wait tez va barqaror.', 'Explicit condition waits finish as soon as the UI is ready.', 'Explicit Wait ishlating.', 'Use `WebDriverWait`.'),
      mistake('Test yiqilganda `driver.quit()` chaqirilmay qolishi', 'Leaking Headless Browser Processes on Failure', `# Calling driver.quit() at end of try block skips cleanup whenever an assert raises!`, 'Server RAM exhausted by zombie browsers', `print("Always put driver.quit() inside finally: or a with-block!")`, '`try ... finally: driver.quit()` xotira sizib chiqishini yo‘qotadi.', 'Wrap browser lifecycles in `finally` or `with` blocks.', '`finally: driver.quit()` qo‘ying.', 'Close inside `finally`.'),
    ],
    compareTitleUz: '`requests` + `bs4` vs Selenium vs Playwright',
    compareTitleEn: '`requests` vs Selenium vs Playwright',
    compareUz: ['`requests + bs4`: statik HTML va JSON API (100x tez va yengil).', 'Selenium: klassik WebDriver E2E testlar.', 'Playwright: zamonaviy tezkor auto-wait, tarmoq mocklari va async Python API.'],
    compareEn: ['`requests + bs4`: fastest option whenever HTML or JSON endpoints work directly.', 'Selenium: classic cross-browser WebDriver automation.', 'Playwright: modern auto-waiting, fast protocol, and clean sync/async Python API.'],
    compareSummaryUz: 'Brauzer avtomatlashtirishni faqat JS SPA kerak bo‘lganda tanlang, `time.sleep()` o‘rniga Explicit Wait va `finally: driver.quit()` ishlating.',
    compareSummaryEn: 'Reserve browsers for JS-heavy SPAs, replace `time.sleep()` with explicit polling waits, and always clean up in `finally`.',
    practiceTasks: [
      pt('p1507_1', '1-mashq: Explicit Wait Poller', 'Task 1: Wait Poller', '4-urinishda `"OK"` qaytaruvchi shartni 10 urinishgacha kuting.', 'Poll until ready.', `def wait_ok(fn, limit=10):\n    for i in range(1, limit + 1):\n        if fn(i): return i\n    raise TimeoutError()\nprint(wait_ok(lambda i: i >= 4))`, '4', 'Loop 1..limit and return i', 'Prints 4.'),
      pt('p1507_2', '2-mashq: `finally` Cleanup kafolati', 'Task 2: Guaranteed Quit', 'Xato chiqqanda ham `closed` True bo‘lishini ko‘rsating.', 'Close browser in finally.', `closed = False\ntry:\n    raise AssertionError("fail")\nexcept AssertionError:\n    pass\nfinally:\n    closed = True\nprint(closed)`, 'True', 'Set closed in finally', 'Prints True.'),
      pt('p1507_3', '3-mashq: `data-testid` selektori', 'Task 3: Build Safe Locator', '`testid="login"` dan `[data-testid="login"]` yasang.', 'Format data-testid selector.', `def tid(name): return f'[data-testid="{name}"]'\nprint(tid("login"))`, '[data-testid="login"]', 'f-string CSS selector', 'Prints [data-testid="login"].'),
      pt('p1507_4', '4-mashq: Headless CI Flaglari', 'Task 4: Headless Args Check', '`"--headless=new"` borligini tekshiring.', 'Check headless flag.', `opts = ["--headless=new", "--no-sandbox"]\nprint("--headless=new" in opts)`, 'True', 'Check membership', 'Prints True.'),
      pt('p1507_5', '5-mashq: Stale Element Retry', 'Task 5: Retry Stale Read', '1-urinishda xato bersa, elementni qayta topib o‘qing.', 'Retry stale lookup.', `tries = 0\ndef read_dom():\n    global tries; tries += 1\n    if tries == 1: raise LookupError("stale")\n    return "Price: $10"\nfor _ in range(2):\n    try: print(read_dom()); break\n    except LookupError: continue`, 'Price: $10', 'Re-query on LookupError', 'Prints Price: $10.'),
    ],
    quiz: [
      q('q1507_1', 'Nima uchun Selenium da `time.sleep(5)` o‘rniga `WebDriverWait` (Explicit Wait) ishlatiladi?', 'Why prefer `WebDriverWait` over `time.sleep(5)`?', ['CSS rang', 'Element tayyor bo‘lgan zahoti darhol davom etadi, muddat oshsa aniq `TimeoutException` beradi', 'Xotira ko‘payadi', 'JS o‘chadi'], ['CSS color', 'Continues immediately once ready and fails explicitly at timeout', 'More RAM', 'No JS'], 1, 'Tez va barqaror kutish.', 'Faster and less flaky.'),
      q('q1507_2', 'Test xato bilan tugasa ham headless Chrome RAM da qolib ketmasligi uchun `driver.quit()` qayerda turishi kerak?', 'Where should `driver.quit()` always live to prevent zombie browser processes?', ['if True:', 'try ... finally: bloki (yoki `with` kontekst menejer) ichida', 'Sikl boshida', 'Importda'], ['if True:', 'Inside `finally:` or a `with` context manager', 'Top of loop', 'Import'], 1, '`finally:` bloki ichida.', 'Inside `finally:`.'),
      q('q1507_3', 'Qaysi lokator UI dizayni o‘zgarganda ham eng kam sinadi?', 'Which UI locator is most resilient to CSS/layout refactoring?', ['/html/body/div[4]/span[2]', '[data-testid="checkout-btn"]', '.mt-4.flex.p-2', '//div[1]/a'], ['/html/body/div[4]/span[2]', '[data-testid="checkout-btn"]', '.mt-4.flex.p-2', '//div[1]/a'], 1, '`[data-testid="..."]`.', '`[data-testid="..."]`.'),
      q('q1507_4', 'Agar sahifa ma’lumotlari to‘g‘ridan-to‘g‘ri XHR JSON API da mavjud bo‘lsa, Selenium ishlatish kerakmi?', 'Should you launch Selenium if the site exposes the needed data via a clean JSON API?', ['Ha, doim Selenium', 'Yo‘q, to‘g‘ridan-to‘g‘ri HTTP/JSON API 100x tez va barqaror', 'Faqat Firefox', 'Ha, CSS kerak'], ['Always Selenium', 'No, direct HTTP JSON requests are 100x faster and far more reliable', 'Firefox only', 'Need CSS'], 1, 'Yo‘q, JSON API har doim afzal.', 'Direct HTTP JSON beats full browser automation.'),
      q('q1507_5', 'Zamonaviy brauzer avtomatlashtirishda Selenium ga kuchli raqobatchi, auto-wait li kutubxona?', 'Modern browser automation library featuring built-in auto-waiting and fast protocol?', ['BeautifulSoup', 'Playwright', 'Flask', 'NumPy'], ['BeautifulSoup', 'Playwright', 'Flask', 'NumPy'], 1, 'Playwright.', 'Playwright.'),
    ],
    homework: hw('Explicit Wait & Stale-Safe Browser Driver Simulyatori', 'Resilient E2E Driver & Poller', 'Context manager bilan avtomatik `quit()` qiluvchi, `wait_until(timeout)` polling mexanizmli va stale-element xatosini 2 marta qayta urinib tuzatuvchi mini E2E brauzer klassini yozing.', 'Build a browser session wrapper with context-managed `quit()`, polling `wait_until()`, and automatic retry on stale-element lookups.', ['Context manager quit + Explicit poller', 'Stale-element retry testi'], ['Context manager + poller', 'Stale retry test'], 'Re-invoke the locator callback inside retry loop when stale errors occur.', 'Solid E2E harness.', 'Lokator sifati auditorini ham qo‘shing.', 'Add locator quality scorer.', 20),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-15-08',
    courseId: 'automation',
    moduleId: 'c15_m3',
    order: 8,
    titleUz: 'Excel va Office Automation — `csv`, `openpyxl`, Formulalar va Hisobotlar',
    titleEn: 'Excel & Office Automation: `csv`, `openpyxl` Workbooks & Automated Reports',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    prerequisites: ['PY-15-07'],
    conceptId: 'auto_office',
    whyUz: "Moliya, HR va savdo bo‘limlari har hafta 20 ta Excel fayldan qo‘lda nusxa ko‘chirib jamlama hisobot yasaydi. Python da **`csv` / `openpyxl` / `python-docx`** bilan minglab satrlarni soniyalarda tozalab, guruhlab, formula (`=SUM(...)`) va rangli format bilan tayyor Excel hisobotga aylantirish mumkin!",
    whyEn: 'Automate tedious spreadsheet and office pipelines: process tabular exports reliably with stdlib `csv` (`DictReader`/`DictWriter` + `newline=""` + UTF-8 BOM), generate `openpyxl` Excel formulas/formatting safely, and defend against CSV Formula Injection.',
    analogyUz: "**Python Office Automation** — bu 24/7 bexato ishlaydigan moliya yordamchisi: u 50 ta filialning CSV/Excel jadvallarini yig‘adi, dublikat va bo‘sh kataklarni tekshiradi, summa va foizlarni hisoblaydi va chiroyli hisobot yaratadi!",
    analogyEn: 'Python acts as a tireless analyst merging dozens of branch spreadsheets, validating columns, and generating formatted formula-driven workbooks in seconds.',
    stopsUz: "Office & CSV Automation da 3 muhim qoida: 1) Excel o‘zbek/kirill/emoji matnlarini ochganda buzmasligi uchun CSV ni **`encoding=\"utf-8-sig\"` (UTF-8 with BOM)** va **`newline=\"\"`** bilan yozing! 2) Excel kataklariga foydalanuvchi matni yozayotganda **`=`, `+`, `-`, `@`** bilan boshlansa **CSV/Formula Injection** xavfi bo‘ladi — oldiga apostrof `'` qo‘yib sanitizatsiya qiling! 3) Katta Excel (`100k+` qator) da `openpyxl.load_workbook(..., read_only=True)` ishlating!",
    stopsEn: 'Write Excel-friendly CSVs with `encoding="utf-8-sig"` and `newline=""`, sanitize untrusted strings starting with `=`, `+`, `-`, `@` against CSV Formula Injection, and stream large `.xlsx` files with `read_only=True`.',
    objUz: ['Stdlib `csv.DictReader` / `DictWriter`, `utf-8-sig` BOM va `newline=""` qoidalari', 'Ko‘p faylli jamlama (Consolidation) hisobot va `openpyxl` formula/stillar arxitekturasi', 'CSV/Excel Formula Injection (`=HYPERLINK(...)`) himoyasi va `read_only=True` streaming'],
    objEn: ['Read/write Excel-compatible CSVs using `DictReader`/`DictWriter` and `utf-8-sig`', 'Consolidate multi-file sales sheets and generate structured Excel summaries', 'Neutralize Spreadsheet Formula Injection (`=`, `+`, `-`, `@`) on untrusted cell values'],
    theoryUz: `### 1. Excel-Friendly CSV (\`utf-8-sig\` + \`newline=""\`)
Oddiy \`utf-8\` CSV ni Windows Excel ochganda "O‘zbekiston" kabi harflar buzilishi mumkin; \`utf-8-sig\` BOM qo‘shib barcha Excel larda to‘g‘ri ochiladi!
### 2. \`openpyxl\` (.xlsx) Imkoniyatlari
- \`wb = Workbook(); ws = wb.active; ws.title = "Sotuvlar"\`
- \`ws["C10"] = "=SUM(C2:C9)"\` — Excel ochilganda formulani o‘zi hisoblaydi!
- Katta fayl o‘qishda: \`load_workbook("big.xlsx", read_only=True)\` Xotirani O(1) ushlaydi.
### 3. Formula Injection Himoyasi
Foydalanuvchi ismiga \`=cmd|' /C calc'!A0\` yozsa Excel ishga tushirishi mumkin — katak \`=\`, \`+\`, \`-\`, \`@\` bilan boshlansa oldiga \`'\` qo‘ying!`,
    theoryEn: `### 1. Excel-Safe CSV Output
Pass \`encoding="utf-8-sig"\` and \`newline=""\` so Microsoft Excel renders UTF-8 characters properly without blank lines.
### 2. \`openpyxl\` Workbooks & Formulas
Write native Excel formulas (\`=SUM(C2:C9)\`), style headers, and pass \`read_only=True\` / \`write_only=True\` on massive sheets.
### 3. Spreadsheet Formula Injection Defense
Prefix untrusted text starting with \`=\`, \`+\`, \`-\`, or \`@\` with a single quote \`'\` so Excel treats it strictly as literal text.`,
    examples: [
      ex('Misol 1: Multi-Fayl CSV Jamlama Hisobot (Stdlib `csv` + `io.StringIO`)', 'Example 1: Consolidating Branch CSVs into Summary Report', `import csv, io
from collections import defaultdict

branch_csvs = [
    "branch,revenue\\nToshkent,1200\\nSamarqand,800",
    "branch,revenue\\nToshkent,500\\nBuxoro,950",
]
totals = defaultdict(int)
for raw in branch_csvs:
    for row in csv.DictReader(io.StringIO(raw)):
        totals[row["branch"]] += int(row["revenue"])

out = io.StringIO()
w = csv.DictWriter(out, fieldnames=["branch", "total_revenue"], lineterminator="\\n")
w.writeheader()
for br in sorted(totals):
    w.writerow({"branch": br, "total_revenue": totals[br]})
print(out.getvalue().strip())`, `branch,total_revenue\nBuxoro,950\nSamarqand,800\nToshkent,1700`, 'Bir nechta filial CSV lari `DictReader` da yig‘ilib, saralangan yagona jamlama CSV hisobotga yozildi.', 'Aggregates multiple CSV feeds via `DictReader` into a clean sorted summary report.'),
      ex('Misol 2: Spreadsheet Formula Injection Sanitizatsiyasi', 'Example 2: Neutralizing Excel Formula Injection', `def safe_cell(val: str) -> str:
    s = str(val)
    if s and s[0] in ("=", "+", "-", "@", "\\t", "\\r"):
        return "'" + s
    return s

print(safe_cell("=HYPERLINK('http://evil.uz')"))
print(safe_cell("Azizbek"))`, `'=HYPERLINK('http://evil.uz')\nAzizbek`, 'Xavfli formula prefikslari oldiga apostrof `\'` qo‘yilib Excel da bajarilishi bloklandi.', 'Prefixes dangerous leading characters with an apostrophe so Excel renders literal text.'),
      ex('Misol 3: Excel-Style SpreadsheetML XML Hisobot Generator (Tashqi Paketsiz)', 'Example 3: Generating Spreadsheet XML Formula Sheet', `rows = [("Laptop", 2, 800), ("Mouse", 5, 25)]
total_formula_val = sum(qty * price for _, qty, price in rows)
xml_rows = "".join(f"<Row><Cell>{n}</Cell><Cell>{q*p}</Cell></Row>" for n, q, p in rows)
print(f"<Sheet>{xml_rows}<Total formula='=SUM(B1:B2)'>{total_formula_val}</Total></Sheet>")`, `<Sheet><Row><Cell>Laptop</Cell><Cell>1600</Cell></Row><Row><Cell>Mouse</Cell><Cell>125</Cell></Row><Total formula='=SUM(B1:B2)'>1725</Total></Sheet>`, 'Hisobot qatorlari va jami formula birga strukturali tarzda generatsiya qilindi.', 'Generates structured spreadsheet rows alongside summary formulas cleanly.'),
    ],
    traceTitleUz: 'CSV Consolidation & Safe Cell Trace',
    traceTitleEn: 'Tracing Report Consolidation',
    traceCode: `safe_cell("=SUM(A1)")`,
    traceSteps: [
      traceStep(1, 's[0] in ("=","+","-","@")', 'True ("=")', 'Formula belgisi aniqlandi', 'Detected leading "="'),
      traceStep(2, 'return "\'" + s', "'=SUM(A1)", 'Oddiy matnga aylantirildi', 'Escaped as safe literal'),
    ],
    commonMistakes: [
      mistake('CSV ni `utf-8-sig` va `newline=""` siz yozib Excel da buzilgan shrift ko‘rish', 'Writing Excel CSVs Without utf-8-sig or newline=""', `# open("rep.csv", "w") causes blank rows on Windows and broken Cyrillic/Uzbek letters in Excel!`, 'Blank lines & mojibake text in Excel', `print('Always open Excel CSVs with encoding="utf-8-sig", newline=""!')`, 'Excel uchun BOM (`utf-8-sig`) va `newline=""` shart.', 'Use `encoding="utf-8-sig"` and `newline=""` for Excel CSV compatibility.', '`utf-8-sig` + `newline=""` bering.', 'Pass `utf-8-sig` and `newline=""`.'),
      mistake('Foydalanuvchi ismini tekshirmay Excel katagiga yozib Formula Injection qoldirish', 'Allowing Raw = / + / @ Strings into Exported Sheets', `# Exporting "=CMD|..." directly executes formulas when finance opens the spreadsheet!`, 'CSV / Excel Formula Injection', `print("Escape cells starting with =, +, -, @ with a leading single quote!")`, 'Xavfli boshlanuvchi matnlarni apostrof bilan zararsizlantiring.', 'Sanitize untrusted strings starting with `=`, `+`, `-`, or `@`.', '`safe_cell()` ishlating.', 'Sanitize leading formula chars.'),
    ],
    compareTitleUz: '`csv` (Stdlib) vs `openpyxl` vs `pandas.to_excel()`',
    compareTitleEn: '`csv` vs `openpyxl` vs `pandas.to_excel()`',
    compareUz: ['`csv` (stdlib): yengil, juda tez, tashqi paketsiz universal almashinuv.', '`openpyxl`: `.xlsx` ranglar, shriftlar, ustun kengligi va Excel formulalar.', '`pandas.to_excel`: katta tahlil jadvallarini bir qatorda eksport qilish.'],
    compareEn: ['`csv`: zero-dependency universal interchange format.', '`openpyxl`: full `.xlsx` styling, multi-sheets, charts, and formulas.', '`pandas.to_excel`: one-line export from analytical DataFrames.'],
    compareSummaryUz: 'Excel CSV larini `utf-8-sig` + `newline=""` bilan yozing, formula injection dan saqlaning va katta `.xlsx` larda `read_only=True` ishlating.',
    compareSummaryEn: 'Export Excel CSVs with `utf-8-sig` + `newline=""`, sanitize formula prefixes, and stream big `.xlsx` sheets with `read_only=True`.',
    practiceTasks: [
      pt('p1508_1', '1-mashq: `csv.DictReader` Yig‘indisi', 'Task 1: Sum DictReader Column', 'CSV matndagi `"qty"` ustuni yig‘indisini toping.', 'Sum qty column.', `import csv, io\ntxt = "item,qty\\nA,3\\nB,7"\nprint(sum(int(r["qty"]) for r in csv.DictReader(io.StringIO(txt))))`, '10', 'csv.DictReader + sum', 'Prints 10.'),
      pt('p1508_2', '2-mashq: Formula Injection Himoyasi', 'Task 2: Escape Formula Prefix', '`"=1+1"`, `"-cmd"`, `"Ali"` uchun `safe_cell` chiqaring.', 'Escape =/+/-/@.', `def safe(v): return "'" + v if v[:1] in "=+ -@" else v\nprint(safe("=1+1"), safe("-cmd"), safe("Ali"))`, "'=1+1 '-cmd Ali", 'Check v[:1]', 'Prints escaped & clean values.'),
      pt('p1508_3', '3-mashq: `DictWriter` Saralangan Eksport', 'Task 3: DictWriter Export', '`[{"k": "x", "v": 1}]` ni CSV satrga yozing.', 'Write CSV with header.', `import csv, io\nb = io.StringIO()\nw = csv.DictWriter(b, fieldnames=["k", "v"], lineterminator="\\n")\nw.writeheader(); w.writerow({"k": "x", "v": 1})\nprint(b.getvalue().strip())`, 'k,v\nx,1', 'writeheader then writerow', 'Prints CSV.'),
      pt('p1508_4', '4-mashq: `utf-8-sig` BOM Baytlari', 'Task 4: Inspect UTF-8 BOM', '`"Salom".encode("utf-8-sig")[:3]` BOM baytlarini ko‘ring.', 'Inspect BOM bytes.', `print("Salom".encode("utf-8-sig")[:3] == b"\\xef\\xbb\\xbf")`, 'True', 'utf-8-sig adds EF BB BF', 'Prints True.'),
      pt('p1508_5', '5-mashq: Excel Ustun Harfi (`1->A, 27->AA`)', 'Task 5: Column Index to Letter', '1 -> A, 26 -> Z, 27 -> AA funksiyasini yozing.', 'Convert 1-based col to Excel letter.', `def col_letter(n: int) -> str:\n    s = ""\n    while n > 0:\n        n, rem = divmod(n - 1, 26)\n        s = chr(65 + rem) + s\n    return s\nprint(col_letter(1), col_letter(26), col_letter(27))`, 'A Z AA', 'divmod(n-1, 26)', 'Prints A Z AA.'),
    ],
    quiz: [
      q('q1508_1', 'Windows Excel da UTF-8 CSV ochilganda shriftlar buzilmasligi uchun qaysi encoding ishlatiladi?', 'Encoding ensuring Excel opens UTF-8 CSV files without garbled text?', ['ascii', 'utf-8-sig', 'latin-1', 'utf-16-be'], ['ascii', 'utf-8-sig', 'latin-1', 'utf-16-be'], 1, '`utf-8-sig` (BOM qo‘shadi).', '`utf-8-sig`.'),
      q('q1508_2', 'Excel CSV/XLSX da `=HYPERLINK(...)` kabi xavfli katak matnini zararsizlantirish usuli?', 'How do you neutralize CSV/Excel Formula Injection on untrusted cell values?', ['Upper case', 'Oldiga apostrof `\'` qo‘yish (`=`, `+`, `-`, `@` bo‘lsa)', 'Strip spaces', 'JSON'], ['Uppercase', 'Prefix values starting with `=`, `+`, `-`, `@` with `\'`', 'Strip', 'JSON'], 1, 'Oldiga apostrof `\'` qo‘yish.', 'Prefix with a single quote `\'`.'),
      q('q1508_3', '200MB lik ulkan `.xlsx` faylini `openpyxl` da xotirani to‘ldirmasdan o‘qish rejimi?', '`openpyxl` mode for streaming giant `.xlsx` workbooks with minimal RAM?', ['fast=True', 'read_only=True', 'lazy=False', 'stream=0'], ['fast=True', 'read_only=True', 'lazy=False', 'stream=0'], 1, '`read_only=True`.', '`read_only=True`.'),
      q('q1508_4', 'Python da `csv.writer` ochayotganda ortiqcha bo‘sh qatorlarni yo‘qotuvchi `open()` parametri?', '`open()` argument required with `csv.writer` to avoid blank lines on Windows?', ['newline=""', 'bom=True', 'binary=True', 'mode="csv"'], ['newline=""', 'bom=True', 'binary=True', 'mode="csv"'], 0, '`newline=""`.', '`newline=""`.'),
      q('q1508_5', 'Katakka `ws["D10"] = "=SUM(D2:D9)"` yozilganda qiymatni kim hisoblaydi?', 'Who evaluates `=SUM(D2:D9)` written into a cell by `openpyxl`?', ['Python', 'Excel / LibreOffice faylni ochganda hisoblaydi', 'SQL', 'OS'], ['Python', 'Excel / LibreOffice evaluates the formula upon opening', 'SQL', 'OS'], 1, 'Jadval dasturi ochganda hisoblaydi.', 'Spreadsheet app evaluates on open.'),
    ],
    homework: hw('Ko‘p Filialli Sales Consolidator & Formula-Safe Exporter', 'Multi-Sheet CSV/Report Consolidator', 'Bir nechta CSV hisobotni birlashtiruvchi, katak qiymatlarini Formula Injection dan tozalovchi, ustun jami va o‘rtachasini hisoblovchi hamda Excel `utf-8-sig` formatiga mos CSV eksport qiluvchi hisobot generatorini tuzing.', 'Create a consolidation tool merging multi-branch CSVs, sanitizing cell values against Formula Injection, computing branch totals/averages, and exporting Excel-safe CSV with column-letter formula specs.', ['Formula injection sanitizer + DictReader merger', 'Excel column letter mapper + summary CSV'], ['Sanitizer + DictReader merger', 'Column mapper + summary CSV'], 'Normalize incoming keys, escape leading =/+/-/@ before export, and sort output rows deterministically.', 'Office automation ready.', 'Haftalik top-3 filialni alohida summary blok qilib chiqaring.', 'Add top-3 summary.', 20),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-15-09',
    courseId: 'automation',
    moduleId: 'c15_m4',
    order: 9,
    titleUz: 'Email va Telegram Automation — MIME Xabarlar, Bot API, Webhooks va Rate Limits',
    titleEn: 'Email & Telegram Automation: `EmailMessage` MIME, Bot API & Rate Limits',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    prerequisites: ['PY-15-08'],
    conceptId: 'auto_notifications',
    whyUz: "Skript kechasi soat 3 da server xatosini aniqladi yoki savdo hisobotini tayyorladi — buni kimgadir **Email** yoki **Telegram Bot** orqali darhol yetkazish kerak! Lekin `BOT_TOKEN` ni Git ga qo‘yish, `HTML` belgilarni escape qilmaslik yoki Telegramning sekundiga 30 ta xabar limitini (`429`) buzish botni bloklatadi.",
    whyEn: 'Build reliable notification pipelines for Email (`email.message.EmailMessage` MIME) and Telegram Bots: escape HTML/MarkdownV2 safely, respect Telegram flood-control rate limits, protect bot tokens, and contrast long-polling vs production webhooks.',
    analogyUz: "**Long Polling** — bu har 2 soniyada pochtachiga qo‘ng‘iroq qilib \"Menga xat bormi?\" deb so‘rash. **Webhook** esa pochtachiga manzilingizni (`POST /telegram/webhook`) berib qo‘yish: yangi xabar kelishi bilanoq Telegram o‘zi sizning serveringizga yetkazadi!",
    analogyEn: 'Long polling repeatedly asks Telegram for updates; a webhook gives Telegram your HTTPS endpoint so updates arrive pushed in real time.',
    stopsUz: "Email & Telegram da 4 muhim qoida (sandboximiz tarmoq va `smtplib` ni bloklagani uchun bu darsda stdlib `email.message.EmailMessage` va Telegram payload builder/rate-limiterlarni xavfsiz mashq qilamiz!): 1) **Token/SMTP parolni faqat env dan oling**! 2) Telegram `parse_mode='HTML'` da foydalanuvchi matnini doim **`html.escape()`** qiling! 3) Telegram limiti (~1 msg/s bitta chatga, ~30 msg/s umumiy) — **`429 retry_after`** ni hurmat qiling! 4) Webhook da **`X-Telegram-Bot-Api-Secret-Token`** headerini `hmac.compare_digest` bilan tekshiring!",
    stopsEn: 'Load SMTP/Bot tokens strictly from env vars, escape dynamic user strings with `html.escape()` when sending Telegram HTML messages, respect `429 retry_after` flood limits, and verify `X-Telegram-Bot-Api-Secret-Token` on webhooks. (Practice builds stdlib `EmailMessage` and Telegram payload routers safely without live network sockets.)',
    objUz: ['Stdlib `email.message.EmailMessage` bilan MIME matn/HTML + fayl biriktirma tuzish', 'Telegram Bot API `sendMessage` payload, `html.escape()` va `X-Telegram-Bot-Api-Secret-Token` webhook tekshiruvi', 'Long Polling vs HTTPS Webhook arxitekturasi va Notification Rate Limiting (`429`)'],
    objEn: ['Construct MIME multi-part emails safely with stdlib `EmailMessage`', 'Escape Telegram HTML payloads and verify webhook secret headers', 'Contrast long polling vs webhooks and enforce per-chat rate pacing'],
    theoryUz: `### 1. Email Automation (\`email.message.EmailMessage\`)
Zamonaviy Python da qo‘lda MIME sarlavha yozish o‘rniga \`EmailMessage\` ishlatiladi: \`set_content()\`, \`add_alternative(..., subtype="html")\`, \`add_attachment()\`. Serverga esa \`smtplib.SMTP_SSL(..., port=465)\` yoki \`starttls()\` (port 587) orqali ulaniladi.
### 2. Telegram Bot API: Polling vs Webhook
- **Polling** (\`getUpdates\`): lokal/oddiy botlar uchun qulay (HTTPS domen shart emas).
- **Webhook**: production FastAPI/Django uchun (tezkor, ortiqcha so‘rov yo‘q, \`X-Telegram-Bot-Api-Secret-Token\` tekshiruvi bilan!).
### 3. Parse Mode Xavfi
\`parse_mode="HTML"\` da foydalanuvchi \`"<script>"\` yoki \`"a < b"\` yozsa Telegram API \`400 Bad Request\` beradi — doim \`html.escape(user_text)\` ishlating!`,
    theoryEn: `### 1. Structured Emails via \`EmailMessage\`
Build plain-text + HTML fallback MIME emails cleanly with \`EmailMessage\`, delivered over TLS (\`SMTP_SSL\` 465 / \`STARTTLS\` 587) or transactional APIs.
### 2. Telegram Polling vs Webhooks
Use polling for simple background workers without public HTTPS; use webhooks verified by \`X-Telegram-Bot-Api-Secret-Token\` inside production web backends.
### 3. Escaping & Flood Control
Escape dynamic text with \`html.escape()\` under \`parse_mode="HTML"\`, chunk messages >4096 chars, and honor \`parameters.retry_after\`.`,
    examples: [
      ex('Misol 1: Stdlib `EmailMessage` (Plain Text + HTML Fallback MIME)', 'Example 1: Constructing a Multi-Part EmailMessage', `from email.message import EmailMessage

msg = EmailMessage()
msg["Subject"] = "Kunlik Python Hisoboti"
msg["From"] = "noreply@pythonmastery.uz"
msg["To"] = "admin@pythonmastery.uz"
msg.set_content("Jami buyurtmalar: 42")
msg.add_alternative("<h3>Jami buyurtmalar: <b>42</b></h3>", subtype="html")

raw = msg.as_string()
print("Has multipart?", msg.is_multipart(), "| Subject ok?", "Kunlik" in msg["Subject"], "| Size:", len(raw) > 50)`, `Has multipart? True | Subject ok? True | Size: True`, '`EmailMessage` ham matn, ham HTML versiyali haqiqiy MIME elektron xatni xatosiz yig‘adi.', 'Stdlib `EmailMessage` builds valid multi-part plain+HTML MIME emails cleanly.'),
      ex('Misol 2: Xavfsiz Telegram HTML Payload & `4096` Belgi Bo‘luvchi', 'Example 2: Escaped Telegram HTML & Message Chunker', `import html, json

def build_tg_payloads(chat_id: int, raw_text: str, max_len: int = 20) -> list[str]:
    safe = html.escape(raw_text)
    chunks = [safe[i:i + max_len] for i in range(0, len(safe), max_len)]
    return [json.dumps({"chat_id": chat_id, "text": f"<b>Alert:</b> {c}", "parse_mode": "HTML"}) for c in chunks]

print("\\n".join(build_tg_payloads(1001, "x < y & error!", max_len=30)))`, `{"chat_id": 1001, "text": "<b>Alert:</b> x &lt; y &amp; error!", "parse_mode": "HTML"}`, '`html.escape()` `<` va `&` belgilarini `&lt;`/`&amp;` ga o‘girib Telegram `400 can\'t parse entities` xatosini oldini oladi.', 'Escaping user content prevents Telegram `400` entity-parsing failures.'),
      ex('Misol 3: Telegram Webhook Secret Header Tekshiruvi', 'Example 3: Constant-Time Telegram Webhook Auth', `import hmac

WEBHOOK_SECRET = "tg_secret_9f8a"

def handle_webhook(headers: dict[str, str], update: dict) -> tuple[int, str]:
    tok = headers.get("X-Telegram-Bot-Api-Secret-Token", "")
    if not hmac.compare_digest(tok, WEBHOOK_SECRET):
        return 401, "Unauthorized webhook"
    msg = update.get("message", {}).get("text", "")
    return 200, f"Processed: {msg}"

print(handle_webhook({"X-Telegram-Bot-Api-Secret-Token": "fake"}, {"message": {"text": "/start"}}))
print(handle_webhook({"X-Telegram-Bot-Api-Secret-Token": "tg_secret_9f8a"}, {"message": {"text": "/start"}}))`, `(401, 'Unauthorized webhook')\n(200, 'Processed: /start')`, 'Begona so‘rovlar Telegram dan kelgan soxta xabar yubora olmasligi uchun Secret Token tekshiriladi.', 'Verifies Telegram’s secret header in constant time to reject spoofed webhook calls.'),
    ],
    traceTitleUz: 'Telegram Alert Formatting & Webhook Auth Trace',
    traceTitleEn: 'Tracing Escaped Telegram Webhook',
    traceCode: `handle_webhook(headers, {"message": {"text": "a < b"}})`,
    traceSteps: [
      traceStep(1, 'compare_digest(tok, secret)', 'True', 'So‘rov haqiqatan Telegramdan keldi', 'Verified Telegram webhook secret'),
      traceStep(2, 'html.escape("a < b")', '"a &lt; b"', 'HTML teglar buzilmasligi taʼminlandi', 'Escaped "<" safely'),
      traceStep(3, 'chunk <= 4096', '1 payload JSON', 'Telegram limitiga moslandi', 'Ready for sendMessage'),
    ],
    commonMistakes: [
      mistake('Telegram `parse_mode="HTML"` da xom xatolar/foydalanuvchi matnini escape qilmaslik', 'Sending Unescaped `<` or `&` in Telegram HTML Mode', `# text = f"Error: {err}" fails with Telegram 400 when err contains "<class 'ValueError'>" !`, "400 Bad Request: can't parse entities", `import html\nprint(f"<b>Err:</b> {html.escape(\"<class 'ValueError'>\")}")`, 'Telegram `<class ...>` ni yopilmagan HTML teg deb o‘ylab xato beradi! Doim `html.escape()` qiling.', 'Error strings like `<ValueError>` break Telegram HTML parsing unless escaped with `html.escape()`.', '`html.escape()` ishlating.', 'Wrap dynamic text in `html.escape()`.'),
      mistake('Webhook endpointni secret tokensiz ochiq qoldirish', 'Leaving Telegram Webhook Endpoints Unauthenticated', `# Anyone who discovers /tg/webhook URL can POST fake admin /broadcast updates!`, 'Spoofed bot commands', `print("Set secret_token in setWebhook and verify X-Telegram-Bot-Api-Secret-Token!")`, 'Webhook URL ni maxfiy header bilan himoyalash shart.', 'Verify `X-Telegram-Bot-Api-Secret-Token` on every incoming webhook POST.', 'Secret Token tekshiring.', 'Check webhook secret header.'),
    ],
    compareTitleUz: 'Telegram Long Polling vs HTTPS Webhook',
    compareTitleEn: 'Telegram Long Polling vs Webhooks',
    compareUz: ['Long Polling: HTTPS domen shart emas, dev/kichik skript uchun oson.', 'Webhook: serverga darhol push, nol bo‘sh so‘rov, FastAPI/Docker production uchun ideal.'],
    compareEn: ['Long Polling: works behind NAT/localhost without public HTTPS.', 'Webhook: zero idle polling, instant push delivery into production web backends.'],
    compareSummaryUz: 'Email da `EmailMessage` MIME, Telegramda esa `html.escape()`, `4096` bo‘laklash, `429 retry_after` va webhook secret tekshiruvini qo‘llang.',
    compareSummaryEn: 'Use `EmailMessage` for MIME mail, and harden Telegram bots with `html.escape()`, 4096-char chunking, rate limits, and webhook secret checks.',
    practiceTasks: [
      pt('p1509_1', '1-mashq: `EmailMessage` Sarlavhalari', 'Task 1: Build EmailMessage', '`Subject`, `From`, `To` va body bilan `EmailMessage` tuzing.', 'Create EmailMessage.', `from email.message import EmailMessage\nm = EmailMessage(); m["Subject"] = "Test"; m["From"] = "a@b.uz"; m["To"] = "c@d.uz"; m.set_content("Hi")\nprint(m["Subject"], m.get_content().strip())`, 'Test Hi', 'Set headers & set_content', 'Prints Test Hi.'),
      pt('p1509_2', '2-mashq: Telegram `html.escape()`', 'Task 2: Escape Telegram HTML', '`"<KeyError: \'id\'>"` ni xavfsiz HTML ga o‘giring.', 'Escape exception text.', `import html\nprint(html.escape("<KeyError: 'id'>"))`, '&lt;KeyError: &#x27;id&#x27;&gt;', 'Call html.escape', 'Prints escaped entities.'),
      pt('p1509_3', '3-mashq: `4096` Chunker', 'Task 3: Chunk Long Text', 'Uzunligi 7 bo‘lgan matnni `size=3` bo‘laklarga bo‘ling.', 'Chunk string by 3.', `s = "ABCDEFG"\nprint([s[i:i+3] for i in range(0, len(s), 3)])`, "['ABC', 'DEF', 'G']", 'Slice in step 3', "Prints ['ABC', 'DEF', 'G']."),
      pt('p1509_4', '4-mashq: Webhook Secret Verify', 'Task 4: Verify Webhook Token', '`hmac.compare_digest` bilan token tekshiring.', 'Check webhook token.', `import hmac\nprint(hmac.compare_digest("sec1", "sec1"), hmac.compare_digest("sec1", "bad"))`, 'True False', 'hmac.compare_digest', 'Prints True False.'),
      pt('p1509_5', '5-mashq: Flood `retry_after` kutish', 'Task 5: Parse Telegram 429', 'Telegram `{"ok": False, "parameters": {"retry_after": 14}}` dan kutish soniyasini oling.', 'Extract retry_after.', `resp = {"ok": False, "parameters": {"retry_after": 14}}\nprint(resp.get("parameters", {}).get("retry_after", 1))`, '14', 'Nested .get()', 'Prints 14.'),
    ],
    quiz: [
      q('q1509_1', 'Telegram `parse_mode="HTML"` da `<ValueError>` matni xato bermasligi uchun nima qilinadi?', 'How to stop `<ValueError>` from triggering Telegram 400 parse errors?', ['Bold qilish', '`html.escape()` dan o‘tkazish', 'Lower qilish', 'Base64'], ['Bold it', 'Pass dynamic text through `html.escape()`', 'Lowercase', 'Base64'], 1, '`html.escape()`.', '`html.escape()`.'),
      q('q1509_2', 'Telegram bitta xabarda ruxsat etadigan maksimal belgilar limiti?', 'Maximum character limit per Telegram text message?', ['500', '1024', '4096', '65536'], ['500', '1024', '4096', '65536'], 2, '4096 ta belgi.', '4096 characters.'),
      q('q1509_3', 'Production Telegram webhook so‘rovi haqiqatan Telegramdan kelganini tekshirish headeri?', 'HTTP header sent by Telegram to authenticate webhook POSTs?', ['Authorization', 'X-Telegram-Bot-Api-Secret-Token', 'Cookie', 'X-Forwarded-For'], ['Authorization', 'X-Telegram-Bot-Api-Secret-Token', 'Cookie', 'X-Forwarded-For'], 1, '`X-Telegram-Bot-Api-Secret-Token`.', '`X-Telegram-Bot-Api-Secret-Token`.'),
      q('q1509_4', 'Python stdlib da zamonaviy matn+HTML+attachment MIME email yaratish klassi?', 'Modern Python stdlib class for building MIME emails cleanly?', ['smtplib.Mail', 'email.message.EmailMessage', 'http.Email', 'json.Mime'], ['smtplib.Mail', 'email.message.EmailMessage', 'http.Email', 'json.Mime'], 1, '`EmailMessage`.', '`EmailMessage`.'),
      q('q1509_5', 'Public HTTPS serveri bo‘lmagan oddiy lokal skriptda Telegram yangilanishlarini olish usuli?', 'Easiest mode to receive Telegram updates on localhost without public HTTPS?', ['Webhook', 'Long Polling (`getUpdates`)', 'SMTP', 'FTP'], ['Webhook', 'Long Polling (`getUpdates`)', 'SMTP', 'FTP'], 1, 'Long Polling.', 'Long Polling.'),
    ],
    homework: hw('Multi-Channel Alert Dispatcher (`EmailMessage` + Telegram)', 'Dual-Channel Notification Dispatcher', 'Xabar matnini `html.escape()` + 4096-belgi chunking bilan Telegram JSON payloadlariga, hamda `EmailMessage` (plain+HTML) ga formatlovchi, va `429 retry_after` ni boshqaruvchi Notification Dispatcher yozing.', 'Build a notification dispatcher formatting both multi-part `EmailMessage` MIME payloads and chunked, `html.escape()`d Telegram Bot payloads with `429 retry_after` handling.', ['EmailMessage MIME + Telegram HTML escape', '4096 chunking + webhook secret guard'], ['EmailMessage + TG HTML escape', 'Chunking + webhook auth'], 'Escape user payload before wrapping in <b>/<i> tags and split long texts cleanly.', 'Production alert engine.', 'Admin vs Billing alert kanallariga ajrating.', 'Route by severity.', 20),
    relatedVideos: ['VIDEO-DOCS-001'],
  }),

  makeLesson({
    id: 'PY-15-10',
    courseId: 'automation',
    moduleId: 'c15_m4',
    order: 10,
    titleUz: 'Scheduled Tasks, Cron, Lockfiles va Review #34 (15-Kurs Yakuni)',
    titleEn: 'Scheduled Tasks, Cron Expressions, Lockfiles & Review #34',
    difficulty: 'advanced',
    estimatedMinutes: 35,
    prerequisites: ['PY-15-09'],
    conceptId: 'auto_cron_scheduling',
    whyUz: "Har kuni soat 02:00 da backup oladigan yoki har 5 daqiqada narxlarni tekshiradigan skriptni qo‘lda ishga tushirmaysiz — uni **Cron** yoki **systemd timer** yuritadi! Lekin birinchi ishga tushish 6 daqiqa cho‘zilib ketsa, 5-daqiqada ikkinchi nusxa ustiga tushib bazani buzadi (**Overlap**). Buni **Lockfile**, **UTC jadvallar** va **Monitoring** hal qiladi!",
    whyEn: 'Schedule reliable recurring jobs with Cron / systemd timers / APScheduler: decode 5-field cron expressions (`m h dom mon dow`), prevent overlapping runs via lockfiles, run schedules in UTC, and alert on dead-man’s-switch misses.',
    analogyUz: "**Lockfile (qulf fayli)** — bu hojatxona eshigidagi \"BAND\" yozuvi: soat 10:05 dagi Cron skripti kelganda soat 10:00 dagi ish hali tugamaganini ko‘rsa, navbatni buzmasdan chiroyli chiqib ketadi!",
    analogyEn: 'A lockfile acts like an occupied latch: if the 10:00 job is still running at 10:05, the newly spawned cron instance sees the lock and exits safely instead of colliding.',
    stopsUz: "Cron & Scheduling da 4 oltin qoida: 1) **Overlap (ustma-ust tushish) ni Lockfile / DB Lock bilan to‘sing!** 2) Server vaqtini **UTC** da saqlang (yozgi/qishki vaqt siljishida 2 marta yurmasin!). 3) Cron muhiti Minimal `$PATH` ga ega — **venv ning to‘liq yo‘lini** (`/app/.venv/bin/python /app/job.py`) yozing! 4) Muvaffaqiyatsiz tugagan Cron jim qolmasin: `stdout/stderr` ni log faylga yozing va xatoda Telegram/Email alert yuboring!",
    stopsEn: 'Guard overlapping cron runs with lockfiles, schedule in UTC (avoiding DST skips/doubles), invoke explicit `.venv/bin/python` paths (cron has a tiny `$PATH`), and route errors to logs/alerts.',
    objUz: ['5-maydonli Cron ifodasini (`minute hour day month weekday`) o‘qish va tekshirish', 'Lockfile / Context Manager bilan Overlapping Run (ikkitasi birga yurishi) ni oldini olish', 'Cron vs systemd timer vs Celery Beat tanlovi + Dead-Man’s Switch monitoringi'],
    objEn: ['Decode and match 5-field Cron expressions (`*/5 * * * *`, `0 2 * * 1-5`)', 'Prevent concurrent job overlap using context-managed lockfiles', 'Compare Cron, systemd timers, and Celery Beat plus dead-man’s-switch health pings'],
    theoryUz: `### 1. 5-Maydonli Cron Sintaksisi
\`┌─ minut (0-59)\`
\`│ ┌─ soat (0-23)\`
\`│ │ ┌─ oy kuni (1-31)\`
\`│ │ │ ┌─ oy (1-12)\`
\`│ │ │ │ ┌─ hafta kuni (0-6, 0=Yakshanba)\`
\`*/15 9-18 * * 1-5\` = Ish kunlari (Dush-Jum) 09:00–18:59 da har 15 daqiqada!
### 2. Overlap Prevention (Lockfile)
\`Path("/tmp/sync.lock")\` mavjud bo‘lsa ikkinchi jarayon darhol chiqadi; \`finally:\` da esa qulf ochiladi. (Linux da \`fcntl.flock\` jarayon o‘lsa ham qulfni avtomatik yechadi!).
### 3. Cron vs Celery Beat vs systemd timer
- **Cron**: har Linux da tayyor oddiy jadval.
- **systemd timer**: dependency, random delay va journalctl loglari.
- **Celery Beat**: taqsimlangan workerlar klasteriga navbat yuborish.`,
    theoryEn: `### 1. Anatomy of 5-Field Cron
\`minute hour day_of_month month day_of_week\` — e.g. \`0 2 * * *\` runs daily at 02:00 UTC; \`*/5 * * * *\` every 5 minutes.
### 2. Overlap Locks
Check/acquire a lock before doing work and release inside \`finally:\` (or via OS \`flock\`) so slow runs never collide.
### 3. Cron vs systemd vs Celery Beat
Use OS Cron/systemd timers for single-host scripts; use Celery Beat for distributed worker fleets, always using full \`.venv/bin/python\` paths.`,
    examples: [
      ex('Misol 1: 5-Maydonli Cron Matcher (`*`, `*/N`, `a-b`, `N`)', 'Example 1: Pure-Python 5-Field Cron Schedule Matcher', `def match_field(expr: str, val: int) -> bool:
    if expr == "*": return True
    if expr.startswith("*/"): return val % int(expr[2:]) == 0
    if "-" in expr:
        lo, hi = map(int, expr.split("-"))
        return lo <= val <= hi
    return val in {int(x) for x in expr.split(",")}

def cron_matches(cron: str, minute: int, hour: int, dom: int, mon: int, dow: int) -> bool:
    parts = cron.split()
    return all(match_field(p, v) for p, v in zip(parts, (minute, hour, dom, mon, dow)))

print("Every 15m workhours (10:30 Tue)?", cron_matches("*/15 9-18 * * 1-5", 30, 10, 12, 5, 2))
print("On Sunday (10:30 Sun)?", cron_matches("*/15 9-18 * * 1-5", 30, 10, 17, 5, 0))`, `Every 15m workhours (10:30 Tue)? True\nOn Sunday (10:30 Sun)? False`, 'Cron ifodasi dushanba–juma 09:00–18:59 oralig‘ida har 15 daqiqada mos keldi, yakshanbada esa False qaytardi.', 'Evaluates `*`, `*/step`, ranges, and lists cleanly against date/time fields.'),
      ex('Misol 2: Context-Managed Lockfile (Overlap Prevention)', 'Example 2: Lockfile Preventing Overlapping Runs', `from pathlib import Path
from contextlib import contextmanager

@contextmanager
def job_lock(lock_path: Path):
    if lock_path.exists():
        yield False
        return
    lock_path.write_text("locked", encoding="utf-8")
    try:
        yield True
    finally:
        lock_path.unlink(missing_ok=True)

lp = Path("sync_job.lock")
lp.unlink(missing_ok=True)
with job_lock(lp) as acquired_1:
    with job_lock(lp) as acquired_2:
        print("First acquired?", acquired_1, "| Second blocked?", not acquired_2)
print("Released cleanly?", not lp.exists())`, `First acquired? True | Second blocked? True\nReleased cleanly? True`, 'Birinchi ish ishlayotganda ikkinchisi qulfni ko‘rib bloklandi; ish tugashi bilan `finally` qulfni yechdi.', 'Prevents overlapping runs while guaranteeing lock cleanup in `finally:`.'),
      ex('Misol 3: Dead-Man’s Switch (Silent Failure Detector)', 'Example 3: Dead-Man’s Switch Heartbeat Check', `def check_heartbeat(last_ok_min_ago: int, max_gap_min: int = 65) -> str:
    return "OK" if last_ok_min_ago <= max_gap_min else f"ALERT: job silent for {last_ok_min_ago}m!"

print(check_heartbeat(40), "|", check_heartbeat(130))`, `OK | ALERT: job silent for 130m!`, 'Soatlik cron umuman ishga tushmay qolsa ham Dead-Man’s Switch jim qolib ketmaydi.', 'Alerts when a scheduled job misses its expected heartbeat window.'),
    ],
    traceTitleUz: 'Lockfile Overlap Guard Trace',
    traceTitleEn: 'Tracing Overlap Prevention',
    traceCode: `with job_lock(lp) as ok1:\n    with job_lock(lp) as ok2: ...`,
    traceSteps: [
      traceStep(1, 'Outer enter', 'writes sync_job.lock -> True', '1-job qulfni oldi', 'First job acquired lock'),
      traceStep(2, 'Inner enter', 'lock exists -> False', '2-job to‘xtatildi (overlap yo‘q!)', 'Second run skipped safely'),
      traceStep(3, 'Outer exit', 'unlink(missing_ok=True)', 'Qulf tozalandi', 'Released lock on exit'),
    ],
    commonMistakes: [
      mistake('Cron qatoriga virtual muhitsiz faqat `python script.py` yozish', 'Calling Relative `python` Without .venv Path in Crontab', `# Cron runs with a minimal PATH=/usr/bin:/bin—missing your .venv packages and relative paths!`, 'ModuleNotFoundError / No such file', `print("Use absolute paths: 0 2 * * * /srv/app/.venv/bin/python /srv/app/job.py")`, 'Cron da joriy papka va `$PATH` boshqacha — to‘liq absolyut yo‘l yozing.', 'Always invoke the explicit `.venv/bin/python` and full script path inside crontab.', 'Absolyut `.venv` yo‘lini yozing.', 'Use absolute `.venv` paths.'),
      mistake('Lockfile qo‘ymasdan uzoq ishlaydigan Cron vazifani har daqiqaga qo‘yish', 'Running Un-Locked Cron Jobs Frequently', `# If a 90s job runs every 60s without a lock, instances pile up until RAM/DB crashes!`, 'Cascading process pile-up & DB lock', `print("Protect recurring cron jobs with a lockfile / DB advisory lock!")`, 'Sekin ishlasa ustma-ust chiqmasligi uchun doim lock qo‘ying.', 'Prevent concurrent instance pile-ups with a lockfile or advisory lock.', 'Lockfile qo‘ying.', 'Acquire a job lock.'),
    ],
    compareTitleUz: 'Cron vs systemd Timers vs Celery Beat',
    compareTitleEn: 'Cron vs systemd Timers vs Celery Beat',
    compareUz: ['Cron: hamma Unix tizimida bor sodda jadval.', 'systemd timer: jitter, aniq loglar, Missed-run (`Persistent=true`) qo‘llab-quvvatlash.', 'Celery Beat: taqsimlangan backend workerlar klasteri uchun.'],
    compareEn: ['Cron: universal, simple single-host scheduler.', 'systemd timer: structured logs, dependency ordering, persistent catch-up.', 'Celery Beat: distributed schedule producer for worker clusters.'],
    compareSummaryUz: 'Cron vazifalarini UTC da, to‘liq `.venv` yo‘lida, lockfile overlap himoyasi va Dead-Man’s Switch monitoringi bilan yuring.',
    compareSummaryEn: 'Run cron schedules in UTC with explicit `.venv` paths, overlap lockfiles, and dead-man’s-switch alerts.',
    practiceTasks: [
      pt('p1510_1', '1-mashq: `*/5` Step Tekshiruvi', 'Task 1: Cron Step Match', 'Minut `0, 5, 10, 12` dan qaysilari `*/5` ga tushishini chiqaring.', 'Check */5 minutes.', `print([m for m in (0, 5, 10, 12) if m % 5 == 0])`, '[0, 5, 10]', 'm % 5 == 0', 'Prints [0, 5, 10].'),
      pt('p1510_2', '2-mashq: Ish Kunlari (`1-5`) Filtrlash', 'Task 2: Weekday Range', 'Hafta kunlari `0..6` dan faqat `1-5` ni ajrating.', 'Match weekdays 1-5.', `print([d for d in range(7) if 1 <= d <= 5])`, '[1, 2, 3, 4, 5]', '1 <= d <= 5', 'Prints [1, 2, 3, 4, 5].'),
      pt('p1510_3', '3-mashq: Crontab Absolyut Buyrug‘i', 'Task 3: Build Crontab Line', '`"/app/.venv/bin/python"` va `"/app/sync.py"` bilan soat 03:00 UTC qatorini yasang.', 'Format crontab entry.', `print("0 3 * * * /app/.venv/bin/python /app/sync.py")`, '0 3 * * * /app/.venv/bin/python /app/sync.py', '5 fields + full paths', 'Prints crontab line.'),
      pt('p1510_4', '4-mashq: Lockfile Cleanup (`finally`)', 'Task 4: Lock Release', 'Xato chiqqanda ham lock fayl o‘chishini tasdiqlang.', 'Ensure lock removal.', `from pathlib import Path\np = Path("t.lock"); p.write_text("1")\ntry:\n    raise ValueError()\nexcept ValueError:\n    pass\nfinally:\n    p.unlink(missing_ok=True)\nprint(p.exists())`, 'False', 'unlink in finally', 'Prints False.'),
      pt('p1510_5', '5-mashq: Dead-Man Alert Check', 'Task 5: Heartbeat Check', 'Oxirgi ping 90 daqiqa oldin bo‘lsa (max=60) `True` (alert) chiqaring.', 'Detect missed heartbeat.', `def missed(age, max_age=60): return age > max_age\nprint(missed(45), missed(90))`, 'False True', 'age > max_age', 'Prints False True.'),
    ],
    quiz: [
      q('q1510_1', '`0 2 * * 1-5` Cron ifodasi qachon ishga tushadi?', 'When does the cron expression `0 2 * * 1-5` execute?', ['Har 2 minutda', 'Dushanbadan Jumagacha har kuni soat 02:00 da', 'Faqat yanvar-mayda', 'Har soat'], ['Every 2m', 'Monday through Friday at 02:00', 'Jan-May', 'Hourly'], 1, 'Dush–Jum 02:00 da.', 'Weekdays at 02:00.'),
      q('q1510_2', 'Birinchi Cron jarayoni tugamasdan ikkinchisi ustiga tushib ketishini to‘sish usuli?', 'Pattern preventing overlapping concurrent executions of the same cron job?', ['Cache', 'Lockfile / Advisory Lock (`flock`)', 'print()', 'Recursion'], ['Cache', 'Lockfile / Advisory Lock (`flock`)', 'print()', 'Recursion'], 1, 'Lockfile / Advisory Lock.', 'Lockfile / Advisory Lock.'),
      q('q1510_3', 'Nima uchun Crontab da `python job.py` emas, `/app/.venv/bin/python /app/job.py` yoziladi?', 'Why specify full `.venv/bin/python` and full script paths in crontab?', ['Tezroq', 'Cron minimal `$PATH` bilan ishlaydi va joriy papkani bilmaydi', 'Windows sharti', 'SQL'], ['Faster', 'Cron runs with a minimal `$PATH` and home working directory', 'Windows', 'SQL'], 1, 'Minimal `$PATH` va ishchi papka sabab.', 'Cron lacks venv PATH and project cwd.'),
      q('q1510_4', 'Server jadvallari (Cron) uchun nega **UTC** vaqt mintaqasi afzal?', 'Why prefer UTC over local daylight-saving timezones for cron jobs?', ['Chiroyliroq', 'Soat oldinga/orqaga surganda vazifa o‘tkazib yuborilishi yoki 2 marta yurishini oldini oladi', 'CPU tejaladi', 'JSON'], ['Prettier', 'Prevents jobs from running twice or being skipped during DST transitions', 'Saves CPU', 'JSON'], 1, 'DST (vaqt siljishi) xatolaridan qochish.', 'Avoids DST skips and duplicates.'),
      q('q1510_5', 'Soatlik cron umuman ishga tushmay jim qolganda buni aniqlaydigan monitoring usuli?', 'Monitoring technique detecting when a scheduled cron silently stops running altogether?', ['Cache', 'Dead-Man’s Switch (heartbeat muddati o‘tganda ogohlantirish)', 'CSS lint', 'HTML unescape'], ['Cache', 'Dead-Man’s Switch heartbeat monitor', 'CSS lint', 'HTML unescape'], 1, 'Dead-Man’s Switch.', 'Dead-Man’s Switch.'),
    ],
    homework: hw('Cron Matcher + Lockfile + Alert Engine', 'Course 15 Complete Scheduler Pipeline', '5-maydonli Cron ifodasini tekshiruvchi, overlap qulfini boshqaruvchi, natijani atomik yozuvchi va xato bo‘lganda Telegram-uslubidagi escape qilingan alert chiqaruvchi yakuniy scheduler modulini yozing.', 'Combine a 5-field cron matcher, lockfile overlap protection, atomic summary write, and escaped Telegram alert formatting into one scheduler harness.', ['Cron matcher + lockfile', 'Atomik summary + escaped alert'], ['Cron matcher + lockfile', 'Atomic summary + alert'], 'Acquire lock before executing job function and release inside finally.', 'Course 15 capstone.', 'Dead-Man’s Switch tekshiruvini ham ulang.', 'Add heartbeat monitor.', 25),
    reviewCheckpoint: review(
      34,
      'Review Loyiha #34: 15-Kurs Yakuni — End-to-End Automation Pipeline!',
      'Review Project #34: Course 15 Capstone — Full Automation Pipeline!',
      'Automation va System Programming kursini yakunladingiz! HTML parsing (`HTMLParser`), xavfsiz CSV eksport (`safe_cell`), lockfile overlap himoyasi va Telegram-escaped hisobotni bitta pipeline da ishga tushiring.',
      'Finish Course 15! Unite HTML extraction, Formula-safe CSV reporting, overlap lockfile protection, and escaped Telegram notification output in one automation pipeline.',
      ['Lockfile overlap himoyasi', 'HTMLParser -> Formula-safe CSV eksport', 'Escaped Telegram status alerti'],
      ['Overlap lockfile guard', 'HTMLParser -> safe CSV report', 'Escaped Telegram alert'],
      `import csv, html, io
from html.parser import HTMLParser
from pathlib import Path

HTML_DATA = '<div class="row"><span>Py Course</span><b>=100</b></div>'

class RowParser(HTMLParser):
    def __init__(self): super().__init__(); self.vals = []; self._cap = False
    def handle_starttag(self, t, a): self._cap = t in {"span", "b"}
    def handle_data(self, d):
        if self._cap and d.strip(): self.vals.append(d.strip())
    def handle_endtag(self, t): self._cap = False

def safe_cell(v: str) -> str:
    return "'" + v if v[:1] in "=+ -@" else v

p = RowParser(); p.feed(HTML_DATA)
buf = io.StringIO()
w = csv.writer(buf, lineterminator="\\n")
w.writerow(["title", "price"])
w.writerow([safe_cell(p.vals[0]), safe_cell(p.vals[1])])

Path("c15_done.lock").unlink(missing_ok=True)
alert = f"<b>Synced:</b> {html.escape(p.vals[0])}"
print(buf.getvalue().strip())
print("TG Alert:", alert)
`,
    ),
    relatedVideos: ['VIDEO-DOCS-001', 'VIDEO-CS50P-001'],
  }),
];
