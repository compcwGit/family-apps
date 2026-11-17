# 음성 파일 만들기 (MeloTTS)

앱에 넣을 음성(mp3)을 집 PC에서 미리 만들어 둡니다. 앱은 이 파일을 재생만 하므로 인터넷이 필요 없습니다.

- 엔진: [MeloTTS](https://github.com/myshell-ai/MeloTTS) 한국어 모델 — MIT 라이선스(상업 이용 가능)
- MeloTTS는 Ubuntu + Python 3.9에서 개발·테스트됐고, Windows는 Docker를 권장합니다
  → 여기서는 **WSL2(Ubuntu)** 로 설치합니다 (Docker보다 가벼움)

## 가장 쉬운 방법: 더블클릭
`scripts\tts\음성만들기.bat` 을 더블클릭 → WSL 이 없으면 설치 방법을 알려 주고, 있으면 MeloTTS 를 (처음 한 번) 설치한 뒤
작은 앱부터 음성을 만듭니다 (`scripts/tts/wsl-make.sh`). 한글 놀이는 마지막이고 오래 걸려요.

## 1. 설치 (집 PC, 한 번만)

**PowerShell (관리자)** — WSL이 없을 때만. 끝나면 재부팅
```powershell
wsl --install -d Ubuntu-22.04
```

**Ubuntu 창**
```bash
sudo apt update && sudo apt install -y git ffmpeg build-essential
curl -LsSf https://astral.sh/uv/install.sh | sh && source ~/.bashrc   # Python 버전 관리 도구
uv venv ~/melo-env --python 3.9
source ~/melo-env/bin/activate
git clone https://github.com/myshell-ai/MeloTTS.git ~/MeloTTS
cd ~/MeloTTS && uv pip install -e . && python -m unidic download
```

## 2. 음성 목록 만들기 (집 PC 또는 어디서나, Node)

앱마다 읽는 말은 `apps/<앱>/src/voice.ts` 한 곳에 모여 있습니다 (화면도 여기 있는 말을 씀).
여기서 `apps/<앱>/voice-lines.json`(`{ "파일 id": "읽을 말" }`)을 만듭니다.

```bash
npm run voice-lines                     # 모든 앱
npm run voice-lines -- numberplay       # 고른 앱만
```
말을 고친 뒤 다시 실행하면 "새로 / 바뀜" 개수와, 다시 만들 id(`--only ...`)를 알려 줍니다.

| 앱 | 개수 | 내용 |
|---|---|---|
| 동물 친구들 | 75 | 동물 이름·울음소리, 퀴즈, 그림자 맞추기, 칭찬·격려 |
| 숫자 놀이 | 274 | 하나~백, 일~백(`native/` `sino/`), 몇 개일까?·크기 순서·패턴 |
| 한글 놀이 | 2,534 | 자모 카드·이름, 숫자, 글자 2,100개, 듣고 찾기·첫소리 찾기 |
| 모양 놀이 | 94 | 도형 이름, 끼리끼리 안내, 색 이름 |
| 생활 놀이 | 92 | 순서대로 단계, 기분 이야기 |

칭찬도장(stampplay)은 읽는 말이 없어서 목록이 없습니다.

## 3. 음성 만들기 (집 PC WSL)

```bash
source ~/melo-env/bin/activate
cd /mnt/c/<집 PC 소스 경로>      # 예: C:\dev\family-apps → /mnt/c/dev/family-apps
bash scripts/tts/make_all.sh                 # 모든 앱 (이미 만든 파일은 건너뜀)
bash scripts/tts/make_all.sh lifeplay        # 고른 앱만
SPEED=0.85 bash scripts/tts/make_all.sh      # 읽는 속도 (작을수록 천천히, 기본 0.9)
```

앱 하나만 직접:
```bash
python scripts/tts/make_voices.py apps/numberplay/voice-lines.json apps/numberplay/public/voice
```

- 첫 실행 때 한국어 모델을 내려받습니다
- 몇 개만 다시: `--only native/23 praise/` (`/`로 끝나면 그 묶음 전체). id 대신 말 그대로도 됨: `--only "모두 맞췄어요!"`
- 다 만들면 `apps/<앱>/src/voice-files.json`(재생 목록)을 씁니다. 파일만 지웠다면 `--index-only`로 목록만 다시 쓰기
- 한글 놀이는 글자가 많아 오래 걸립니다. 먼저 들어 보려면: `--only jamo/ name/ num/ praise/ cheer/ sample`

## 4. 앱에서 재생되는 방식

- 앱 `main.tsx`가 `src/voice-files.json`을 읽어 `setVoiceFiles`로 넘김 (파일이 없으면 그냥 넘어감)
- `speak("우와, 잘했어요! 모두 맞췄어요!")` → 말 전체 → 없으면 **문장마다** 녹음을 찾아 이어서 재생
- 한 문장이라도 녹음이 없으면 지금처럼 **기기 음성(TTS)** 으로 읽음 → 녹음을 조금씩 채워 가도 앱은 계속 동작
- 그래서 녹음은 문장 단위로 만듭니다 (칭찬 + 안내를 따로 만들어 이어 붙임 → 조합마다 만들 필요 없음)
- 녹음으로 재생할 때는 한글 놀이 부모 화면의 목소리·속도·높이 설정이 적용되지 않습니다 (녹음할 때 정한 속도 그대로)

## 커밋할 것
`voice-lines.json`, `src/voice-files.json`, `public/voice/**` 를 커밋하면 APK·웹 미리보기에 녹음이 들어갑니다.
