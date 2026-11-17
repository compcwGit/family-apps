# 목소리 설정 비교 샘플 만들기 (win-make.ps1 로 설치가 끝난 뒤). 샘플만들기-windows.bat 이 실행함
$ErrorActionPreference = 'Continue'
$env:PYTHONIOENCODING = 'utf-8'
$env:PYTHONUTF8 = '1'
Set-Location (Resolve-Path "$PSScriptRoot\..\..")
$py = "$env:USERPROFILE\melo-env\Scripts\python.exe"
Start-Transcript -Path (Join-Path $PSScriptRoot 'win-sample.log') -Force | Out-Null
try {
  if (-not (Test-Path $py)) { throw '먼저 음성만들기-windows.bat 으로 설치하세요' }
  $env:SSL_CERT_FILE = (& $py -c "import certifi; print(certifi.where())").Trim()
  & $py scripts\tts\sample_voices.py
  if ($LASTEXITCODE) { throw '샘플 만들기 실패' }
  Write-Host ''
  Write-Host '=== 샘플을 다 만들었어요. scripts\tts\samples 폴더를 열어 들어 보세요 ==='
  Start-Process explorer.exe (Join-Path $PSScriptRoot 'samples')
} catch {
  Write-Host "오류: $_" -ForegroundColor Red
  Write-Host 'Claude 에게 "오류 났어" 라고 알려 주세요'
} finally {
  Stop-Transcript | Out-Null
}
