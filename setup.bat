@echo off
setlocal enabledelayedexpansion
title Boyana Chilli Merchants - Setup ^& Startup
color 0F
cls

echo.
echo  ============================================================
echo    Boyana Chilli Merchants
echo    Application Setup ^& Startup
echo  ============================================================
echo.
echo  Validating required software...
echo  ------------------------------------------------------------
echo.

set ERRORS=0

:: ----------------------------------------------------------------
:: 1. Java JDK 21+
:: ----------------------------------------------------------------
set LABEL=  Java JDK 21+
<nul set /p dummy="  Java JDK 21+         "
where java >nul 2>&1
if errorlevel 1 (
    echo [ FAIL ]  Not found. Install JDK 21+ from https://adoptium.net
    set /a ERRORS+=1
) else (
    set JAVA_VER=unknown
    for /f "tokens=3" %%v in ('java -version 2^>^&1 ^| findstr /i "version"') do (
        if "!JAVA_VER!"=="unknown" set JAVA_VER=%%~v
    )
    echo [  OK  ]  Version !JAVA_VER!
)

:: ----------------------------------------------------------------
:: 2. Apache Maven 3.9+
:: ----------------------------------------------------------------
<nul set /p dummy="  Apache Maven 3.9+    "
where mvn >nul 2>&1
if errorlevel 1 (
    echo [ FAIL ]  Not found. Install Maven from https://maven.apache.org
    set /a ERRORS+=1
) else (
    set MVN_VER=unknown
    for /f "tokens=3" %%v in ('mvn --version 2^>^&1 ^| findstr /i "Apache Maven"') do (
        if "!MVN_VER!"=="unknown" set MVN_VER=%%v
    )
    echo [  OK  ]  Version !MVN_VER!
)

:: ----------------------------------------------------------------
:: 3. Node.js 18+
:: ----------------------------------------------------------------
<nul set /p dummy="  Node.js 18+          "
where node >nul 2>&1
if errorlevel 1 (
    echo [ FAIL ]  Not found. Install Node.js from https://nodejs.org
    set /a ERRORS+=1
) else (
    set NODE_VER=unknown
    for /f %%v in ('node --version 2^>^&1') do set NODE_VER=%%v
    echo [  OK  ]  Version !NODE_VER!
)

:: ----------------------------------------------------------------
:: 4. npm (bundled with Node.js)
:: ----------------------------------------------------------------
<nul set /p dummy="  npm                  "
where npm >nul 2>&1
if errorlevel 1 (
    echo [ FAIL ]  Not found. Reinstall Node.js (npm is included)
    set /a ERRORS+=1
) else (
    set NPM_VER=unknown
    for /f %%v in ('npm --version 2^>^&1') do set NPM_VER=%%v
    echo [  OK  ]  Version !NPM_VER!
)

:: ----------------------------------------------------------------
:: 5. MySQL 8.0+ (check known install paths + PATH)
:: ----------------------------------------------------------------
<nul set /p dummy="  MySQL 8.0+           "
set MYSQL_EXE=

where mysql >nul 2>&1
if not errorlevel 1 (
    for /f "delims=" %%p in ('where mysql 2^>nul') do (
        if "!MYSQL_EXE!"=="" set MYSQL_EXE=%%p
    )
)
if "!MYSQL_EXE!"=="" (
    for %%d in (
        "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
        "C:\Program Files\MySQL\MySQL Server 8.3\bin\mysql.exe"
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
        "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
    ) do (
        if "!MYSQL_EXE!"=="" if exist %%d set MYSQL_EXE=%%~d
    )
)

if "!MYSQL_EXE!"=="" (
    echo [ FAIL ]  Not found. Install MySQL 8.0+ from https://dev.mysql.com/downloads
    set /a ERRORS+=1
) else (
    "!MYSQL_EXE!" -u root -proot -e "SELECT 1;" >nul 2>&1
    if errorlevel 1 (
        echo [ WARN ]  Found but cannot connect ^(root/root^). Check service + credentials.
        echo.
        echo           If MySQL is running with different credentials, edit
        echo           chilli-backend\src\main\resources\application-dev.yml
        echo           and set DB_USERNAME / DB_PASSWORD environment variables.
        echo.
        set /a ERRORS+=1
    ) else (
        set MYSQL_VER=unknown
        for /f "skip=1" %%v in ('"!MYSQL_EXE!" -u root -proot -e "SELECT VERSION();" 2^>nul') do (
            if "!MYSQL_VER!"=="unknown" set MYSQL_VER=%%v
        )
        echo [  OK  ]  Version !MYSQL_VER!
    )
)

:: ----------------------------------------------------------------
:: 6. Project files sanity check
:: ----------------------------------------------------------------
<nul set /p dummy="  Backend project      "
if exist "%~dp0chilli-backend\pom.xml" (
    echo [  OK  ]  Found chilli-backend\pom.xml
) else (
    echo [ FAIL ]  chilli-backend\pom.xml not found
    set /a ERRORS+=1
)

<nul set /p dummy="  Frontend project     "
if exist "%~dp0chilli-frontend\package.json" (
    echo [  OK  ]  Found chilli-frontend\package.json
) else (
    echo [ FAIL ]  chilli-frontend\package.json not found
    set /a ERRORS+=1
)

echo.
echo  ------------------------------------------------------------

:: ----------------------------------------------------------------
:: Result
:: ----------------------------------------------------------------
if !ERRORS! GTR 0 (
    echo.
    echo  [ FAILED ]  !ERRORS! issue^(s^) found above. Fix them and re-run setup.bat
    echo.
    pause
    exit /b 1
)

echo  [  OK  ]  All checks passed!
echo.
echo  ============================================================
echo    Launching Application Servers
echo  ============================================================
echo.

:: ----------------------------------------------------------------
:: Start Backend
:: ----------------------------------------------------------------
echo  [1/2] Starting Backend (Spring Boot)...
start "Boyana Chilli - Backend [Port 8080]" cmd /k ""%~dp0backend.bat""
echo        Window opened: Boyana Chilli - Backend [Port 8080]
echo.

:: ----------------------------------------------------------------
:: Wait for backend to become ready (polls every 3 s, max 90 s)
:: ----------------------------------------------------------------
echo  Waiting for backend to be ready on http://localhost:8080 ...
set ATTEMPTS=0

:wait_loop
set /a ATTEMPTS+=1
if !ATTEMPTS! GTR 30 (
    echo.
    echo  WARNING: Backend did not respond after 90 seconds.
    echo           The frontend will open anyway. Check the Backend window for errors.
    echo.
    goto :start_frontend
)
timeout /t 3 /nobreak >nul
curl -s -o nul http://localhost:8080/actuator/health 2>nul
if not errorlevel 1 goto :backend_ready
curl -s -o nul -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{}" 2>nul
if not errorlevel 1 goto :backend_ready
goto :wait_loop

:backend_ready
echo  Backend is ready! ^(after !ATTEMPTS! attempts^)
echo.

:: ----------------------------------------------------------------
:: Start Frontend
:: ----------------------------------------------------------------
:start_frontend
echo  [2/2] Starting Frontend (React + Vite)...
start "Boyana Chilli - Frontend [Port 5173]" cmd /k ""%~dp0frontend.bat""
echo        Window opened: Boyana Chilli - Frontend [Port 5173]
echo.

:: ----------------------------------------------------------------
:: Wait a moment then open browser
:: ----------------------------------------------------------------
echo  Waiting for frontend to initialize...
timeout /t 5 /nobreak >nul

echo  Opening app in browser...
start "" "http://localhost:5173"

echo.
echo  ============================================================
echo    Application is running!
echo.
echo    Frontend : http://localhost:5173
echo    Backend  : http://localhost:8080
echo    Swagger  : http://localhost:8080/swagger-ui/index.html
echo.
echo    Default login: admin / admin
echo.
echo    Close the Backend and Frontend windows to stop the servers.
echo    This window can be closed.
echo  ============================================================
echo.
pause
endlocal
