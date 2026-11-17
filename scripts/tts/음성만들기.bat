@echo off
chcp 65001 >nul
rem 더블클릭: WSL(Ubuntu)에서 MeloTTS 로 앱 음성 만들기. 앱을 고르려면 cmd 에서: 음성만들기.bat lifeplay
wsl -e true >nul 2>&1
if errorlevel 1 (
  echo WSL^(Ubuntu^)이 설치되어 있지 않아요.
  echo 시작 메뉴에서 PowerShell 을 "관리자 권한으로 실행" 한 뒤 아래를 입력하고, 끝나면 재부팅하세요.
  echo.
  echo     wsl --install -d Ubuntu-22.04
  echo.
  echo 재부팅 후 Ubuntu 창에서 사용자 이름·비밀번호를 정한 다음, 이 파일을 다시 더블클릭하세요.
  pause
  exit /b 1
)
wsl --cd "%~dp0..\.." bash scripts/tts/wsl-make.sh %*
pause
