# 음성 파일 만들기 (MeloTTS)

앱에 넣을 음성(mp3)을 집 PC에서 미리 만들어 둡니다. 앱은 이 파일을 재생만 하므로 인터넷이 필요 없습니다.

- 엔진: [MeloTTS](https://github.com/myshell-ai/MeloTTS) 한국어 모델 — MIT 라이선스(상업 이용 가능)
- MeloTTS는 Ubuntu + Python 3.9에서 개발·테스트됐고, Windows는 Docker를 권장합니다
  → 여기서는 **WSL2(Ubuntu)** 로 설치합니다 (Docker보다 가벼움)

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

## 2. 음성 만들기

```bash
source ~/melo-env/bin/activate
cd /mnt/c/<집 PC 소스 경로>      # 예: C:\dev\family-apps → /mnt/c/dev/family-apps
python scripts/tts/make_voices.py apps/numberplay/voice-lines.json apps/numberplay/public/voice
```

- 첫 실행 때 한국어 모델을 내려받습니다
- 이미 만든 파일은 건너뜁니다. 몇 개만 다시: `--only native/23 praise/good` (`jamo/`처럼 `/`로 끝나면 그 묶음 전체)
- 속도: `--speed 0.8` (작을수록 천천히)

## 3. 앱별 음성 목록

| 앱 | 목록 | 저장 폴더 |
|---|---|---|
| 숫자 놀이 | `apps/numberplay/voice-lines.json` (하나~백, 일~백, 칭찬) | `apps/numberplay/public/voice/` |
| 한글 놀이 | `apps/hangulplay/voice-lines.json` (자모 카드·이름, 숫자 0~9, 칭찬·격려, 글자 2,100개 — 총 2,177개) | `apps/hangulplay/public/voice/` |

한글 놀이 목록은 앱 데이터에서 자동으로 만듭니다. 단어·칭찬 문장을 바꾸면 다시 실행하세요:
```bash
npm run voice-lines -w apps/hangulplay      # → apps/hangulplay/voice-lines.json
```
한글 놀이 음성 만들기 (글자가 많아 시간이 걸립니다. 자모·칭찬만 먼저 들어 보려면 `--only`):
```bash
python scripts/tts/make_voices.py apps/hangulplay/voice-lines.json apps/hangulplay/public/voice --speed 0.85
python scripts/tts/make_voices.py apps/hangulplay/voice-lines.json apps/hangulplay/public/voice --only jamo/ name/ num/ praise/ cheer/ sample
```

`voice-lines.json`은 `{ "파일 id": "읽을 말" }` 형식입니다. 숫자 놀이 목록은 `src/numbers.ts`의 읽는 말과 같아야 합니다.
