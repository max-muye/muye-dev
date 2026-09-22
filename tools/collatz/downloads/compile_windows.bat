@echo off
setlocal
cd /d "%~dp0"

set "GPP=C:\Program Files (x86)\Embarcadero\Dev-Cpp\TDM-GCC-64\bin\g++.exe"
if not exist "%GPP%" set "GPP=g++"

echo Compiler: %GPP%
echo.
"%GPP%" -O3 -std=c++17 collatz.cpp -o collatz.exe
if errorlevel 1 (
  echo.
  echo Build failed.
  echo If Windows says g++ is not recognized, install Dev-C++ or edit this file's GPP path.
  pause
  exit /b 1
)

echo Built: collatz.exe
echo.
echo Run normal:
echo collatz.exe
echo.
echo Run fast record search:
echo collatz.exe -3
pause
