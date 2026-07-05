@echo off
title Boyana Chilli Merchants - Backend [Port 8080]
color 0B
cls

echo.
echo  ====================================================
echo    Boyana Chilli Merchants
echo    Backend Server  ^|  Spring Boot  ^|  Port 8080
echo  ====================================================
echo.

cd /d "%~dp0chilli-backend"

if not exist "pom.xml" (
    echo  ERROR: pom.xml not found. Make sure you run this from
    echo         the Chilli_Enterprises_App folder.
    echo.
    pause
    exit /b 1
)

echo  Starting Spring Boot application...
echo  API will be available at: http://localhost:8080
echo  Swagger UI              : http://localhost:8080/swagger-ui/index.html
echo.
echo  Press Ctrl+C to stop the server.
echo  ====================================================
echo.

mvn spring-boot:run

echo.
echo  ====================================================
echo   Backend server stopped.
echo  ====================================================
echo.
pause
