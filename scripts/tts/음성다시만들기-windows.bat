@echo off
chcp 65001 >nul
rem 더블클릭: 목소리 설정을 바꾼 뒤 모든 앱 음성을 처음부터 다시 만들기 (30~40분). 새 문장만 만들 때는 음성만들기-windows.bat
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0win-make.ps1" -Force
pause
