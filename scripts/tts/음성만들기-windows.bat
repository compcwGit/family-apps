@echo off
chcp 65001 >nul
rem 더블클릭: Windows 에서 바로 (WSL 없이) MeloTTS 로 앱 음성 만들기. 앱 고르기: 음성만들기-windows.bat lifeplay
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0win-make.ps1" %*
pause
