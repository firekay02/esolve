@echo off
REM FixItNow Local Development Startup Script for Windows
REM This script helps you quickly start the application locally

echo 🚀 Starting FixItNow Local Development Environment
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ npm version:
npm --version

REM Install frontend dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Check if .env file exists in backend
if not exist "backend\.env" (
    echo ⚙️ Creating backend .env file...
    copy "backend\.env.example" "backend\.env"
    echo 📝 Please edit backend\.env with your database credentials
)

echo.
echo What would you like to run?
echo 1) Frontend only (React app)
echo 2) Backend only (API server)
echo 3) Full stack (Frontend + Backend)
echo 4) Static HTML file
echo.
set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" (
    echo 🎯 Starting frontend development server...
    npm run dev
) else if "%choice%"=="2" (
    echo 🎯 Starting backend API server...
    cd backend
    npm run dev
) else if "%choice%"=="3" (
    echo 🎯 Starting full stack application...
    echo 🔧 Starting backend server in new window...
    start "Backend Server" cmd /k "cd backend && npm run dev"
    
    echo 🎨 Starting frontend server...
    timeout /t 3 /nobreak >nul
    npm run dev
) else if "%choice%"=="4" (
    echo 🌐 Starting static HTML server...
    echo 📂 Serving on http://localhost:8000
    echo 🔗 Open: http://localhost:8000/fixitnow-source.html
    python -m http.server 8000
) else (
    echo ❌ Invalid choice. Please run the script again.
    pause
    exit /b 1
)

pause