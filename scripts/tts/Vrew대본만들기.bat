@echo off
chcp 65001 >nul
rem 더블클릭: Vrew 에 붙여 넣을 대본 만들기 (녹음이 없는 말만). 전부 다시: Vrew대본만들기.bat --all
cd /d "%~dp0..\.."
set PYTHONUTF8=1
set PY=%USERPROFILE%\melo-env\Scripts\python.exe
if not exist "%PY%" set PY=python
"%PY%" scripts\tts\vrew.py script %*
if exist scripts\tts\vrew-work start "" scripts\tts\vrew-work
pause
