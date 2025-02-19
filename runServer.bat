@echo off
REM Node 서버를 새로운 터미널 창에서 실행합니다.
start "Server" cmd /k "node server.js"

REM 서버가 실행될 시간을 기다립니다. (예: 3초)
timeout /t 3 /nobreak >nul

REM 기본 브라우저에서 서버 주소를 엽니다.
start "" "http://localhost:3000"