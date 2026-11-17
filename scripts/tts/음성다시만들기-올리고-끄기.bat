@echo off
chcp 65001 >nul
rem 더블클릭: 모든 앱 음성을 다시 만들기 → 검사 → 커밋 → main·external 에 올리기 → 끝나면 (성공·실패 상관없이) 30초 뒤 컴퓨터 끄기
rem 결과는 scripts\tts\win-make.log. 끄기 취소: 명령 프롬프트에서 shutdown /a
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0win-make.ps1" -Force -Publish -Shutdown
pause
