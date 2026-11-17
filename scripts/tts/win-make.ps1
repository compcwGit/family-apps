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
    uv pip install --python $py 'https://github.com/myshell-ai/MeloTTS/archive/refs/heads/main.zip' imageio-ffmpeg 'setuptools<70' 'boto3>=1.34'
    if ($LASTEXITCODE) { throw 'MeloTTS 설치 실패' }
    & $py -m unidic download
    if ($LASTEXITCODE) { throw 'unidic 사전 받기 실패' }
    New-Item "$venv\.melo-ok" -ItemType File -Force | Out-Null
  }
  # librosa(MeloTTS 가 씀)가 pkg_resources 를 찾음 → 새 가상환경에는 setuptools 가 없어서 넣어 줌
  & $py -c "import pkg_resources" 2>$null
  if ($LASTEXITCODE) {
    Write-Host '=== setuptools 설치 ==='
    uv pip install --python $py 'setuptools<70'
    if ($LASTEXITCODE) { throw 'setuptools 설치 실패' }
  }
  # 그냥 설치하면 아주 옛날 boto3(1.7)가 깔려서 cached_path(MeloTTS 가 모델 받을 때 씀)가 실패함 → 새 boto3 로
  & $py -c "import cached_path" 2>$null
  if ($LASTEXITCODE) {
    Write-Host '=== boto3 새 버전 설치 ==='
    uv pip install --python $py 'boto3>=1.34'
    if ($LASTEXITCODE) { throw 'boto3 설치 실패' }
  }
  # 한국어 발음 변환(g2pkk)이 Windows 에서는 eunjeon(파이썬 3.6 전용)을 찾음 → python-mecab-ko 로 대신하는 eunjeon 을 만들어 줌
  # python-mecab-ko 의 mecab 폴더는 일본어용 MeCab 폴더와 이름이 겹쳐서(Windows 는 대소문자 구분 안 함) 따로 설치
  & $py -c "import eunjeon; eunjeon.Mecab().pos('강아지')" 2>$null
  if ($LASTEXITCODE) {
    Write-Host '=== 한국어 형태소 분석기(python-mecab-ko) 설치 ==='
    uv pip install --python $py --target "$venv\mecab-ko" 'python-mecab-ko==1.3.7'
    if ($LASTEXITCODE) { throw 'python-mecab-ko 설치 실패' }
    $shim = "$venv\Lib\site-packages\eunjeon"
    New-Item -ItemType Directory -Force $shim | Out-Null
    $code = @(
      '# g2pkk(MeloTTS 한국어 발음)가 Windows 에서 찾는 eunjeon 대신 python-mecab-ko 를 씀 (family-apps win-make.ps1 이 만듦)',
      'import os, sys',
      "_dir = os.path.join(sys.prefix, 'mecab-ko')",
      'if _dir not in sys.path:',
      '    sys.path.insert(0, _dir)',
      'from mecab import MeCab as _MeCab',
      '',
      'class Mecab:',
      '    def __init__(self, *args, **kwargs):',
      '        self._m = _MeCab()',
      '',
      '    def pos(self, text):',
      '        return self._m.pos(text)',
      ''
    ) -join "`n"
    [IO.File]::WriteAllText("$shim\__init__.py", $code)
    & $py -c "import eunjeon; print(eunjeon.Mecab().pos('강아지를 찾아요'))"
    if ($LASTEXITCODE) { throw '한국어 형태소 분석기 확인 실패' }
  }
  # 이 파이썬(uv 가 받은 것)은 Windows 인증서 저장소를 안 써서 https 확인이 실패함 → certifi 인증서 묶음을 쓰게 함
  $env:SSL_CERT_FILE = (& $py -c "import certifi; print(certifi.where())").Trim()
  # 영어 발음 사전(MeloTTS 가 시작할 때 읽음) 미리 받기 — 이미 있으면 건너뜀
  & $py -c "import nltk; [nltk.download(p, quiet=True) or exit(1) for p in ('cmudict', 'averaged_perceptron_tagger', 'averaged_perceptron_tagger_eng')]"
  if ($LASTEXITCODE) { throw '영어 발음 사전(nltk) 받기 실패' }
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
