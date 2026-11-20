@echo off
chcp 65001 >nul
rem 더블클릭: vrew-work 폴더의 Vrew 오디오(mp3)+자막(srt)을 문장마다 잘라 앱에 넣기
cd /d "%~dp0..\.."
set PYTHONUTF8=1
set PY=%USERPROFILE%\melo-env\Scripts\python.exe
if not exist "%PY%" set PY=python
"%PY%" scripts\tts\vrew.py split %*
pause
