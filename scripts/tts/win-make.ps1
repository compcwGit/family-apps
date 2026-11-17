# Windows 에서 MeloTTS 로 앱 음성 만들기 (WSL 없이). 음성만들기-windows.bat 이 실행함
#  - 처음 한 번: uv(파이썬 관리 도구) → 파이썬 3.9 가상환경(%USERPROFILE%\melo-env) → MeloTTS·사전 설치
#  - 그다음: 작은 앱부터 음성 만들기 (이미 만든 파일은 건너뜀). 진행 기록: scripts\tts\win-make.log
# -Force: 이미 있는 파일도 모두 다시 만듦 (목소리 설정을 바꿨을 때)
# -Publish: 다 만든 뒤 검사 → 커밋 → main·external 에 push (집 모드 끝날 때 규칙)
# -Shutdown: 끝나면 성공·실패 상관없이 30초 뒤 컴퓨터 끄기 (찬욱 결정. 결과는 win-make.log 에 남음. 취소: shutdown /a)
param([switch]$Force, [switch]$Publish, [switch]$Shutdown, [string[]]$Apps)
$ErrorActionPreference = 'Continue'
$env:PYTHONIOENCODING = 'utf-8'
$env:PYTHONUTF8 = '1'
$root = Resolve-Path "$PSScriptRoot\..\.."
Set-Location $root
Start-Transcript -Path (Join-Path $PSScriptRoot 'win-make.log') -Force | Out-Null
# 실행되는 동안 PC 가 절전 모드로 들어가지 않게 함 (화면 잠금·화면 꺼짐은 괜찮음). 스크립트가 끝나면 원래대로
Add-Type -Namespace Win32 -Name Power -MemberDefinition '[DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint esFlags);'
[void][Win32.Power]::SetThreadExecutionState([uint32]2147483649)  # ES_CONTINUOUS(0x80000000) | ES_SYSTEM_REQUIRED(0x1)
try {
  # git 명령 (Windows git. 이 명령에서만 폴더 소유자 검사를 건너뜀 — Claude 가 받은 폴더라 소유자가 달라 보일 수 있음. 작성자 compcwgit)
  function G { git -c 'safe.directory=*' -c user.name=compcwgit -c user.email=compcwgit@users.noreply.github.com @args }
  if ($Publish) {
    # 30~40분 만든 뒤에 실패하지 않도록, 올리기에 필요한 git·GitHub 로그인을 먼저 확인
    Write-Host '=== GitHub 올리기 미리 확인 ==='
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Windows 에 git 이 없어서 올릴 수 없어요 (git-scm.com 에서 설치)' }
    G push --dry-run origin HEAD:refs/heads/main
    if ($LASTEXITCODE) { throw 'GitHub 에 올릴 수 없어요 (로그인 창이 떴다면 로그인 후 다시 실행)' }
  }
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
    $extra = @(); if ($Force) { $extra += '--force' }
    & $py scripts\tts\make_voices.py "apps\$app\voice-lines.json" "apps\$app\public\voice" @extra
    if ($LASTEXITCODE) { throw "$app 음성 만들기 실패" }
  }
  Write-Host ''
  Write-Host '=== 다 만들었어요. Claude 에게 "다 됐어" 라고 알려 주세요 ==='
  if ($Publish) {
    Write-Host ''
    Write-Host '=== 검사 ==='
    & $py scripts\tts\check_voices.py
    if ($LASTEXITCODE) { throw '빠진 음성이 있어서 올리지 않았어요' }
    Write-Host '=== 커밋 ==='
    G add -A
    if ($LASTEXITCODE) { throw 'git add 실패' }
    G diff --cached --quiet
    if ($LASTEXITCODE) {
      $msg = @(
        'feat(tts): 녹음 음성을 D1 목소리로 다시 만듦 (조금 신나는 억양, 반음 2개 높게)',
        '',
        '- 찬욱이 샘플 비교로 고른 D1: 빠르기 1.0, sdp 0.8, noise 0.85, noise_w 1.0, 높이 +2반음 (make_voices.py 기본값)',
        '- 샘플만들기-windows.bat(목소리 설정 비교), 음성다시만들기-windows.bat(전체 다시 만들기),',
        '  음성다시만들기-올리고-끄기.bat(다시 만들기 → 검사 → push → 컴퓨터 끄기), check_voices.py(빠진 음성 검사)',
        '',
        '집에서 확인: 태블릿·아이폰에서 새 목소리, 발음이 흐트러진 문장이 있는지',
        '',
        'Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>',
        'Claude-Session: https://claude.ai/code/session_01VUxXQ44GxaWyRWCJHYU6Y6'
      ) -join "`n"
      $msgFile = Join-Path $env:TEMP 'family-apps-commit.txt'
      [IO.File]::WriteAllText($msgFile, $msg, (New-Object Text.UTF8Encoding $false))
      G commit -q -F $msgFile
      if ($LASTEXITCODE) { throw 'git commit 실패' }
    }
    Write-Host '=== 최신 코드 합치기 ==='
    G fetch origin
    if ($LASTEXITCODE) { throw 'git fetch 실패 (인터넷·GitHub 로그인 확인)' }
    foreach ($b in 'origin/main', 'origin/external') {
      G merge --no-edit $b
      if ($LASTEXITCODE) { G merge --abort; throw "$b 와 합치다가 충돌 — 올리지 않았어요" }
    }
    Write-Host '=== main · external 에 올리기 ==='
    G push origin main
    if ($LASTEXITCODE) { throw 'main push 실패 (GitHub 로그인 확인)' }
    G push origin main:external
    if ($LASTEXITCODE) { throw 'external push 실패' }
    Write-Host '=== 올리기 끝 ==='
  }
} catch {
  Write-Host "오류: $_" -ForegroundColor Red
  Write-Host 'Claude 에게 "오류 났어" 라고 알려 주세요 (scripts\tts\win-make.log 를 보고 고칩니다)'
} finally {
  [void][Win32.Power]::SetThreadExecutionState([uint32]2147483648)  # ES_CONTINUOUS 만 → 절전 막기 해제
  if ($Shutdown) {
    Write-Host '30초 뒤 컴퓨터가 꺼져요 (취소: 명령 프롬프트에서 shutdown /a)'
  }
  Stop-Transcript | Out-Null
  if ($Shutdown) {
    shutdown.exe /s /t 30 /c "family-apps 음성 작업 끝 - 30초 뒤 꺼집니다 (결과: scripts\tts\win-make.log, 취소: shutdown /a)"
  }
}
