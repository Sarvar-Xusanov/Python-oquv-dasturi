@echo off
setlocal enabledelayedexpansion
echo === Python Mastery Ishga Tushirgich (Windows) ===

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Xatolik: Node.js topilmadi. Iltimos Node.js 22+ o'rnating: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node -p "process.versions.node"') do set NODE_MAJOR=%%a
if %NODE_MAJOR% lss 22 (
    echo Xatolik: Node.js 22+ talab qilinadi. Iltimos Node.js ni yangilang.
    pause
    exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    where py >nul 2>nul
    if %errorlevel% neq 0 (
        echo Xatolik: Python topilmadi. Python 3.11+ o'rnating va "Add Python to PATH" ni belgilang.
        pause
        exit /b 1
    )
)

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo Eslatma: .env fayli yaratildi. AI Ustoz uchun .env ichiga GEMINI_API_KEY kiriting.
    )
)

if not exist "node_modules" (
    echo Kutubxonalar o'rnatilmoqda ^(npm install^)...
    call npm install
)

echo Server ishga tushirilmoqda: http://localhost:3000
call npm run dev
pause
