@echo off
title Boyana Chilli Merchants - Frontend [Port 5173]
color 0A
cls

echo.
echo  ====================================================
echo    Boyana Chilli Merchants
echo    Frontend Server  ^|  React + Vite  ^|  Port 5173
echo  ====================================================
echo.

cd /d "%~dp0chilli-frontend"

if not exist "package.json" (
    echo  ERROR: package.json not found. Make sure you run this
    echo         from the Chilli_Enterprises_App folder.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo  node_modules not found. Installing npm dependencies...
    echo.
    npm install
    if errorlevel 1 (
        echo.
        echo  ERROR: npm install failed. Check your Node.js installation.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo  Dependencies installed successfully.
    echo.
)

echo  Starting Vite development server...
echo  App will be available at: http://localhost:5173
echo.
echo  Press Ctrl+C to stop the server.
echo  ====================================================
echo.

npm run dev

echo.
echo  ====================================================
echo   Frontend server stopped.
echo  ====================================================
echo.
pause
