# Python Mastery — Universal Interaktiv Python O‘rganish Platformasi

**Python Mastery** — bu 0 dan Professional darajagacha Python dasturlash tilini o‘rgatuvchi, ikki tilli (**O‘zbekcha** va **Inglizcha**), real Python kodini xavfsiz muhitda ishga tushiruvchi va sun’iy intellekt (AI Ustoz) yordamiga ega to‘liq **full-stack** ta’lim platformasi.

---

## Asosiy Imkoniyatlar

- **17 ta tizimli kurs va 90 kunlik o‘quv rejasi (6 bosqich)**: O‘zgaruvchilardan tortib OOP, fayllar, testlash, algoritmlar va amaliy arxitekturagacha.
- **Ikki tilli interfeys (UZ / EN)**: Barcha darslar, mashqlar, imtihonlar va interfeys o‘zbek va ingliz tillarida.
- **Code Lab (CodeMirror 6 + Real Python Sandbox)**: Brauzer ichida Python kodini yozish, stdin berish, natijani bir zumda ko‘rish (`python -I -B` izolyatsiya qilingan muhitda, 3.5 soniya timeout va xavfli modullarni bloklash bilan).
- **12 ta avtomatik baholanadigan mashq**: Ochiq va yashirin test keyslari, natijalar tarixi hamda AI maslahatlari bilan.
- **Diagnostik test va 3 ta nazorat imtihoni (Checkpoint Exams)**: Bilim darajasini aniqlash va mustahkamlash.
- **3 ta ko‘p bosqichli amaliy loyiha**: Real vazifalar asosida bosqichma-bosqich loyiha topshirish.
- **7 rejimli AI Ustoz (Gemini API)**:
  - *O‘qituvchi (Teacher)*, *Xato tuzatuvchi (Debugger)*, *Kod tekshiruvchi (Reviewer)*, *Mashq murabbiyi (Practice Coach)*, *Sokratik savol-javob (Socratic)*, *Loyiha mentori (Project Mentor)*, *Imtihon tahlilchisi (Exam Evaluator)*.
- **Shaxsiy qaydlar (SQLite FTS5) va Lug‘at**: Qaydlar bo‘ylab tezkor qidiruv, video darslar katalogi va terminlar lug‘ati.
- **Analitika va Zaxira nusxa (Backup)**: Kunlik faollik, mavzular bo‘yicha o‘zlashtirish foizi, yutuqlar va barcha ma’lumotlarni JSON faylga eksport/import qilish.

---

## Texnologiyalar

| Qatlam | Texnologiya |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, CodeMirror 6, Lucide Icons, Motion |
| **Backend** | Node.js 22+, Express.js, TypeScript (`tsx`) |
| **Ma’lumotlar bazasi** | Node.js ichki `node:sqlite` (SQLite + WAL + FTS5 to‘liq matnli qidiruv) |
| **Kod ijrosi (Sandbox)** | Python 3.11+ (`-I -B` izolyatsiya rejimi) |
| **AI Ustoz** | Google `@google/genai` SDK (faqat server tomonida) |

---

## Kompyuterga O‘rnatish Talablari

Dasturni o‘z kompyuteringizda (Windows, macOS yoki Linux) ishga tushirish uchun quyidagilar o‘rnatilgan bo‘lishi shart:

1. **Node.js (v22.0.0 yoki undan yangi)** — *Muhim!* Loyiha `node:sqlite` modulidan foydalangani uchun Node.js 22+ talab qilinadi.
   - Yuklab olish: [https://nodejs.org](https://nodejs.org)
   - Tekshirish: `node -v`
2. **Python (3.11 yoki undan yangi)** — Code Lab va mashqlarni ishlatish uchun.
   - Yuklab olish: [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - *Windows foydalanuvchilari uchun muhim*: O‘rnatish vaqtida **"Add Python to PATH"** katakchasini albatta belgilang!
   - Tekshirish: `python --version` (Windows) yoki `python3 --version` (Linux/macOS)
3. **Git** (repozitoriyni klonlash uchun): [https://git-scm.com](https://git-scm.com)

---

## O‘rnatish va Ishga Tushirish (Bosqichma-bosqich)

### 1-qadam: Loyihani yuklab olish
```bash
git clone https://github.com/<SIZNING_USERNAME>/<REPO_NOMI>.git
cd <REPO_NOMI>
```

### 2-qadam: Kutubxonalarni o‘rnatish
```bash
npm install
```

### 3-qadam: Muhit o‘zgaruvchilarini (`.env`) sozlash
`.env.example` faylidan nusxa olib `.env` faylini yarating:

**Linux / macOS:**
```bash
cp .env.example .env
```

**Windows (CMD):**
```cmd
copy .env.example .env
```

So‘ng `.env` faylini ochib, o‘zingizning Gemini API kalitingizni kiriting:
```env
GEMINI_API_KEY="SIZNING_GEMINI_API_KALITINGIZ"
APP_URL="http://localhost:3000"
```

> **Eslatma:** API kalitini [Google AI Studio](https://aistudio.google.com/apikey) dan bepul olishingiz mumkin. Agar `GEMINI_API_KEY` kiritilmasa ham, barcha darslar, Code Lab, mashqlar, imtihonlar, loyihalar va qaydlar **to‘liq oflayn** ishlayveradi (faqat AI Ustoz javob bermaydi).

### 4-qadam: Dasturni ishga tushirish

**Oddiy ishga tushirish (Development / Lokal foydalanish):**
```bash
npm run dev
```

**Yoki tayyor (Production) rejimda ishga tushirish:**
```bash
npm run build
npm start
```

**Tezkor ishga tushirish skriptlari orqali:**
- **Linux / macOS:** `chmod +x scripts/start_linux.sh && ./scripts/start_linux.sh`
- **Windows:** `scripts\start_windows.bat` faylini ikki marta bosing.

Brauzeringizni oching va quyidagi manzilga kiring:
👉 **http://localhost:3000**

---

## Qanday Ishlatiladi?

1. **Profil yaratish va Boshlang‘ich sozlash (Onboarding)**:
   - Birinchi kirishda o‘zingiz uchun profil yarating (parol qo‘yish ixtiyoriy).
   - Tilni (**O‘zbekcha** / **English**), kundalik maqsadni (masalan, 30 daqiqa) va tajriba darajangizni tanlang.
   - Xohlasangiz, **Diagnostik test** topshirib, qaysi bosqichdan boshlash kerakligini avtomatik aniqlang.
2. **Boshqaruv paneli (Dashboard) va O‘quv yo‘li (Learning Path)**:
   - 90 kunlik reja va 17 ta kurs ketma-ketligini kuzatib boring.
   - Har bir dars nazariya, interaktiv kod misollari va mini-testdan iborat.
3. **Code Lab (Amaliy muhit)**:
   - Python fayllarini yarating, tahrirlang va **Ishga tushirish (Run)** tugmasi orqali real Python 3 da sinab ko‘ring.
   - `input()` ishlatadigan kodlar uchun pastdagi **Stdin** maydoniga kirish ma’lumotlarini yozing.
4. **Mashqlar, Imtihonlar va Loyihalar**:
   - Mashqlarda funksiyalarni yozib **Tekshirish (Run Tests)** tugmasini bosing — tizim kodingizni ochiq va yashirin testlardan o‘tkazadi.
   - Qiyin joyda qolsangiz, **AI Maslahat (Hint)** yoki **AI Ustoz** dan yordam so‘rang.
5. **Qaydlar va Zaxira nusxa (Backup)**:
   - Muhim qoidalarni **Qaydlar** bo‘limiga saqlang va kalit so‘zlar bilan qidiring.
   - **Sozlamalar** bo‘limidan barcha o‘quv natijalaringizni `.json` fayl sifatida yuklab oling yoki boshqa kompyuterga ko‘chiring.

---

## Loyiha Tuzilishi

```text
├── server.ts                 # Express + Vite server (3000-port) va REST/SSE API
├── server/
│   ├── db.ts                 # SQLite sxemasi, jadvallar va FTS5 qidiruv
│   ├── auth.ts               # Parol xeshlash (scrypt) va sessiya tokenlari
│   ├── sandbox.ts            # Izolyatsiya qilingan Python 3 ijro muhiti
│   └── gemini.ts             # AI Ustoz va maslahatlar uchun Gemini integratsiyasi
├── src/
│   ├── App.tsx               # Asosiy ilova marshrutizatsiyasi va holat boshqaruvi
│   ├── data/                 # 17 ta kurs, mashqlar, imtihonlar, loyihalar va tarjimalar
│   ├── components/           # CodeMirror IDE, Markdown renderer, ekranlar
│   └── lib/api.ts            # Frontend API mijoz funksiyalari
├── scripts/                  # Linux/macOS va Windows uchun tezkor ishga tushirish fayllari
├── data/                     # Lokal SQLite bazasi (python_mastery.db, .gitignore da)
├── .env.example              # Muhit o‘zgaruvchilari namunasi
└── package.json              # Kutubxonalar va npm skriptlari
```

---

## Muammolarni Bartaraf Etish (Troubleshooting)

- **`SyntaxError` yoki `Cannot find module 'node:sqlite'` chiqsa:**
  Node.js versiyangiz 22 dan past. `node -v` bilan tekshiring va Node.js 22+ o‘rnating.
- **`Python unavailable` yoki kod ishlamasa:**
  Kompyuteringizga Python 3.11+ o‘rnatilganini va tizim `PATH` ga qo‘shilganini tekshiring (`python --version` yoki `python3 --version`).
- **AI Ustoz javob bermasa:**
  `.env` faylida `GEMINI_API_KEY` to‘g‘ri yozilganini va internet mavjudligini tekshiring, so‘ng serverni qayta ishga tushiring.
- **Ma’lumotlar qayerga saqlanadi?**
  Barcha foydalanuvchi profillari, kodlar, qaydlar va test natijalari loyiha ichidagi `data/python_mastery.db` faylida lokal saqlanadi.

---

## Litsenziya

Ushbu loyiha ta’lim va shaxsiy rivojlanish maqsadida **Apache-2.0** litsenziyasi ostida taqdim etiladi.
