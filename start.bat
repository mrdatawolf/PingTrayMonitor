@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

echo === Ping Tray Monitor - startup checks ===
echo.

set ERRORS=0

REM ── .env check ────────────────────────────────────────────────────────────────
if not exist ".env" (
  echo [FAIL] .env not found. Create one with the following keys:
  echo.
  echo   MQTT_BROKER_HOST=^<broker ip^>
  echo   MQTT_BROKER_PORT=1883
  echo   MQTT_WS_PORT=9001
  echo   MQTT_USERNAME=
  echo   MQTT_PASSWORD=
  echo   PROCESS_STATUS=^<projectId^>/^<systemId^>
  echo   CONNECTION_STATUS=^<projectId^>/^<systemId^>
  echo.
  set /a ERRORS+=1
  goto :done
)
echo [OK]   .env found

REM ── Check required keys have values (findstr /R: "KEY=<at least one char>") ─
for %%K in (MQTT_BROKER_HOST MQTT_BROKER_PORT PROCESS_STATUS CONNECTION_STATUS) do (
  findstr /B /R "^%%K=." .env > nul 2>&1
  if errorlevel 1 (
    echo [FAIL] %%K is not set in .env
    set /a ERRORS+=1
  ) else (
    for /f "tokens=2 delims==" %%V in ('findstr /B "%%K=" .env') do (
      echo [OK]   %%K = %%V
    )
  )
)

REM ── Check PROCESS_STATUS and CONNECTION_STATUS look like uuid/uuid ─────────
for %%K in (PROCESS_STATUS CONNECTION_STATUS) do (
  for /f "tokens=2 delims==" %%V in ('findstr /B "%%K=" .env 2^>nul') do (
    echo %%V | findstr /R "^[a-f0-9-][a-f0-9-]*/[a-f0-9-][a-f0-9-]*" > nul 2>&1
    if errorlevel 1 (
      echo [FAIL] %%K value "%%V" does not look like projectId/systemId
      set /a ERRORS+=1
    )
  )
)

REM ── node_modules check ─────────────────────────────────────────────────────
if not exist "node_modules\" (
  echo [WARN] node_modules not found -- running npm install...
  call npm install
  if errorlevel 1 (
    echo [FAIL] npm install failed
    set /a ERRORS+=1
    goto :done
  )
  echo [OK]   npm install complete
) else (
  echo [OK]   node_modules present
)

REM ── Node version check ─────────────────────────────────────────────────────
for /f "tokens=*" %%V in ('node --version 2^>nul') do set NODE_VER=%%V
if "!NODE_VER!"=="" (
  echo [FAIL] node not found -- install Node.js 18+
  set /a ERRORS+=1
) else (
  echo [OK]   Node !NODE_VER!
)

:done
echo.
if !ERRORS! GTR 0 (
  echo !ERRORS! check^(s^) failed. Fix the issues above and try again.
  pause
  exit /b 1
)

echo All checks passed. Starting...
echo.
call npm start
if errorlevel 1 (
  echo.
  echo [FAIL] npm start exited with an error ^(exit code %errorlevel%^).
  echo        Check the output above for details.
  pause
  exit /b 1
)
