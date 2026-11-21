# Python Mastery — Universal Interaktiv Python O‘rganish Platformasi

> **0 dan Professional darajagacha** Python dasturlash tilini **O‘zbek** va **Ingliz** tillarida tizimli o‘rganish, real Python kodini xavfsiz muhitda sinash va **AI Ustoz** yordamida mustahkamlash uchun yaratilgan to‘liq (full-stack) ta’lim platformasi.

---

## Loyiha Nima Uchun Yaratilgan?

Ko‘pchilik Python o‘rganishni boshlaganda bir xil muammolarga duch keladi: darslar tarqoq, o‘zbek tilida tizimli manbalar kam, kod yozib tekshirish uchun alohida dasturlar sozlash qiyin, xato chiqqanda esa tushuntirib beradigan ustoz topilmaydi.

**Python Mastery** shu muammolarni bitta joyda hal qiladi:
- **Noldan tizimli reja:** 90 kunlik 6 bosqichli dastur va 17 ta ketma-ket kurs.
- **Amaliyot birinchi o‘rinda:** Har bir darsda interaktiv kod misollari, tayyor **Code Lab** va avtomatik testlanadigan mashqlar.
- **Real Python muhiti:** Kod brauzer simulyatsiyasi emas, balki haqiqiy izolyatsiya qilingan **Python 3** da ishlaydi.
- **Shaxsiy AI Ustoz:** Xatolaringizni tushuntiradi, kodingizni tekshiradi va tayyor javob bermasdan fikrlashga o‘rgatadi.
- **To‘liq lokal va maxfiy:** Barcha natijalaringiz, qaydlar va kodlaringiz o‘z kompyuteringizdagi SQLite bazasida saqlanadi.

### Kimlar uchun mo‘ljallangan?
- **Yangi boshlovchilar:** Dasturlashni 0 dan boshlayotganlar uchun.
- **Talaba va o‘quvchilar:** Bilimni mustahkamlash, test va loyihalar orqali tajriba orttirish uchun.
- **Mustaqil o‘rganuvchilar:** O‘z sur’atida kunlik maqsad bilan o‘rganish uchun.

---

## Asosiy Imkoniyatlar

| Bo‘lim | Imkoniyatlari |
| :--- | :--- |
| **17 ta Kurs & 90 kunlik reja** | O‘zgaruvchilar, shartlar, sikllar, funksiyalar, OOP, fayllar, testlash, algoritmlar va arxitektura (UZ / EN). |
| **Code Lab (IDE)** | CodeMirror 6 muharriri, sintaksis yoritish, `stdin` kiritish va real Python 3 sandbox ijrosi. |
| **12 ta Amaliy Mashq** | Ochiq va yashirin test keyslari bilan avtomatik baholash + AI maslahat tugmasi. |
| **Diagnostik & Nazorat Imtihonlari** | Boshlang‘ich darajani aniqlash testi va 3 ta bosqichma-bosqich imtihon. |
| **3 ta Real Loyiha** | Ko‘p bosqichli amaliy loyihalar (CLI menejer, tahlilchi, tizim arxitekturasi). |
| **7 Rejimli AI Ustoz** | *O‘qituvchi, Debugger, Kod tekshiruvchi, Mashq murabbiyi, Sokratik savol-javob, Loyiha mentori, Imtihon tahlilchisi*. |
| **Qaydlar & Lug‘at** | SQLite FTS5 tezkor qidiruvga ega shaxsiy qaydlar, video resurslar va terminlar lug‘ati. |
| **Analitika & Zaxira nusxa** | Kunlik faollik grafigi, yutuqlar (Achievements) va JSON formatda zaxira eksport/import. |

---

## Tezkor O‘rnatish (3 daqiqada ishga tushirish)

### Kerakli dasturlar
1. **Node.js 22+** *(muhim: ichki `node:sqlite` moduli uchun)* — [nodejs.org](https://nodejs.org)
2. **Python 3.11+** — [python.org](https://www.python.org/downloads/) *(Windows’da o‘rnatishda **"Add Python to PATH"** ni belgilang!)*
3. **Git** — [git-scm.com](https://git-scm.com)

### 1-qadam: Loyihani yuklab olish va kutubxonalarni o‘rnatish
```bash
git clone https://github.com/<SIZNING_USERNAME>/<REPO_NOMI>.git
cd <REPO_NOMI>
npm install
```

### 2-qadam: `.env` faylini yaratish
**Windows (CMD):**
```cmd
copy .env.example .env
```
**Linux / macOS:**
```bash
cp .env.example .env
```

`.env` faylini ochib, [Google AI Studio](https://aistudio.google.com/apikey) dan olingan Gemini API kalitini kiriting:
```env
GEMINI_API_KEY="SIZNING_GEMINI_API_KALITINGIZ"
APP_URL="http://localhost:3000"
```
> **Eslatma:** API kalitini kiritmasangiz ham barcha darslar, Code Lab, mashqlar, imtihonlar, loyihalar va qaydlar **to‘liq oflayn** ishlaydi (faqat AI Ustoz javob bermaydi).

### 3-qadam: Ishga tushirish
- **Universal usul (barcha tizimlarda):**
  ```bash
  npm run dev
  ```
- **Windows’da tezkor usul:** `scripts\start_windows.bat` faylini ikki marta bosing.
- **Linux / macOS’da tezkor usul:** `chmod +x scripts/start_linux.sh && ./scripts/start_linux.sh`

Brauzerda oching: **http://localhost:3000**

*(Tayyor production rejimida ishlatish uchun: `npm run build && npm start`)*

---

## Platformadan Qanday O‘rganish Kerak?

1. **Profil oching va darajangizni aniqlang:** Tilni (**O‘zbekcha / English**) tanlang, kundalik vaqtingizni (masalan, 30 daqiqa) belgilang va xohlasangiz **Diagnostik test** topshiring.
2. **Nazariya + Jonli Misol:** Har bir darsni o‘qib, undagi kodlarni bir tugma bilan **Code Lab** da ishga tushirib ko‘ring va o‘zgartirib tajriba qiling.
3. **Mashqlarni yeching:** Funksiyalarni yozing va **Tekshirish** tugmasini bosing. Yashirin testlardan o‘tish uchun chekka holatlarni (edge cases) ham hisobga oling.
4. **AI Ustozdan to‘g‘ri foydalaning:** Tayyor kod so‘rash o‘rniga **Sokratik** yoki **Debugger** rejimida xatoning sababini tushunib oling.
5. **Loyihalar va Qaydlar:** Muhim tushunchalarni **Qaydlar** ga yozib boring va har bosqich oxirida loyiha hamda imtihon topshiring.

---

## Texnologik Arxitektura

| Qatlam | Texnologiya |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, CodeMirror 6, Lucide Icons, Motion |
| **Backend** | Node.js 22+, Express.js, TypeScript (`tsx`) |
| **Ma’lumotlar bazasi** | Node.js ichki `node:sqlite` (WAL + FTS5 to‘liq matnli qidiruv) |
| **Kod ijrosi (Sandbox)** | Python 3 (`-I -B` izolyatsiya, 3.5s timeout, xavfli modullarni bloklash) |
| **AI Integratsiyasi** | Google `@google/genai` SDK (faqat server tomonida, SSE streaming) |

---

## Muammolarni Bartaraf Etish (Troubleshooting)

- **`Cannot find module 'node:sqlite'` chiqsa:** `node -v` bilan tekshiring — Node.js **22+** versiya bo‘lishi shart.
- **`Python unavailable` chiqsa:** Python o‘rnatilganini va `PATH` ga qo‘shilganini tekshiring (`python --version` yoki `python3 --version`).
- **AI Ustoz ishlamasa:** `.env` ichida `GEMINI_API_KEY` to‘g‘ri kiritilganini va internet borligini tekshiring, keyin serverni qayta ishga tushiring.

---

## English Summary

**Python Mastery** is a bilingual (**Uzbek / English**) full-stack interactive Python learning platform from beginner to professional level. It includes 17 structured courses, a 90-day 6-phase roadmap, a CodeMirror 6 **Code Lab** backed by an isolated **Python 3 sandbox**, 12 auto-graded exercises, diagnostic & checkpoint exams, 3 multi-milestone projects, SQLite FTS5 notes, and a 7-mode **Gemini AI Mentor**.

**Quick Run:** Install **Node.js 22+** and **Python 3.11+**, clone the repo, run `npm install`, copy `.env.example` to `.env` (add `GEMINI_API_KEY` optionally), and start with `npm run dev` on `http://localhost:3000`.

---

## Litsenziya

**Apache-2.0** — ta’lim va shaxsiy rivojlanish uchun ochiq.
