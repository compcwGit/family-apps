# Windows 에서 MeloTTS 로 앱 음성 만들기 (WSL 없이). 음성만들기-windows.bat 이 실행함
#  - 처음 한 번: uv(파이썬 관리 도구) → 파이썬 3.9 가상환경(%USERPROFILE%\melo-env) → MeloTTS·사전 설치
#  - 그다음: 작은 앱부터 음성 만들기 (이미 만든 파일은 건너뜀). 진행 기록: scripts\tts\win-make.log
param([string[]]$Apps)
$ErrorActionPreference = 'Continue'
$env:PYTHONIOENCODING = 'utf-8'
$env:PYTHONUTF8 = '1'
$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location $root
Start-Transcript -Path (Join-Path $PSScriptRoot 'win-make.log') -Force | Out-Null
try {
  $uvDir = "$env:USERPROFILE\.local\bin"
  $env:Path = "$uvDir;$env:Path"
  if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host '=== uv 설치 ==='
    powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://astral.sh/uv/install.ps1 | iex"
    $env:Path = "$uvDir;$env:Path"
    if (-not (Get-Command uv -ErrorAction SilentlyContinue)) { throw 'uv 설치 실패' }
  }
  $venv = "$env:USERPROFILE\melo-env"
  $py = "$venv\Scripts\python.exe"
  if (-not (Test-Path "$venv\.melo-ok")) {
    Write-Host '=== MeloTTS 설치 (처음 한 번만, 10~20분) ==='
    if (-not (Test-Path $py)) {
      uv venv $venv --python 3.9
      if ($LASTEXITCODE) { throw '파이썬 가상환경 만들기 실패' }
    }
    uv pip install --python $py 'https://github.com/myshell-ai/MeloTTS/archive/refs/heads/main.zip' imageio-ffmpeg
    if ($LASTEXITCODE) { throw 'MeloTTS 설치 실패' }
    & $py -m unidic download
    if ($LASTEXITCODE) { throw 'unidic 사전 받기 실패' }
    New-Item "$venv\.melo-ok" -ItemType File -Force | Out-Null
  }
  if (-not $Apps -or $Apps.Count -eq 0) { $Apps = 'lifeplay', 'animalfriends', 'shapeplay', 'numberplay', 'hangulplay' }
  foreach ($app in $Apps) {
    Write-Host "=== $app ==="
    & $py scripts\tts\make_voices.py "apps\$app\voice-lines.json" "apps\$app\public\voice" --speed 0.9
    if ($LASTEXITCODE) { throw "$app 음성 만들기 실패" }
  }
  Write-Host ''
  Write-Host '=== 다 만들었어요. Claude 에게 "다 됐어" 라고 알려 주세요 ==='
} catch {
  Write-Host "오류: $_" -ForegroundColor Red
  Write-Host 'Claude 에게 "오류 났어" 라고 알려 주세요 (scripts\tts\win-make.log 를 보고 고칩니다)'
} finally {
  Stop-Transcript | Out-Null
}
