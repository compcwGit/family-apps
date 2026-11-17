@echo off
chcp 65001 >nul
rem 더블클릭: 목소리 설정 5가지 x 문장 3개 샘플 만들기 → scripts\tts\samples
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0win-sample.ps1"
pause
