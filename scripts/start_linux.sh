#!/usr/bin/env bash
set -e

echo "=== Python Mastery Ishga Tushirgich (Linux / macOS) ==="

if ! command -v node >/dev/null 2>&1; then
  echo "Xatolik: Node.js topilmadi. Iltimos Node.js 22+ o'rnating: https://nodejs.org"
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 22 ]; then
  echo "Xatolik: Node.js 22+ talab qilinadi (sizda v$(node -v))."
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1 && ! command -v python >/dev/null 2>&1; then
  echo "Xatolik: Python 3 topilmadi. Iltimos Python 3.11+ o'rnating: https://www.python.org"
  exit 1
fi

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp .env.example .env
  echo "Eslatma: .env fayli yaratildi. AI Ustoz uchun .env ichiga GEMINI_API_KEY kiriting."
fi

if [ ! -d "node_modules" ]; then
  echo "Kutubxonalar o'rnatilmoqda (npm install)..."
  npm install
fi

echo "Server ishga tushirilmoqda: http://localhost:3000"
npm run dev
