# 집에서 할 일 (외부에서 한 작업 마무리)

집 PC에서 Claude에게 **"집이야"** 라고 하면 이 문서를 보고 하나씩 같이 진행합니다.
끝낸 항목은 체크하고, 다 끝나면 이 문서의 항목을 지웁니다.

---

## 1. 외부 작업 받아오기

```bash
git checkout main
git pull
git fetch origin
git merge origin/external
npm install          # tsx 등 새 패키지가 추가됨
```

## 2. 새 놀이 확인 (2026-11-17 추가분)

브라우저로 먼저 확인 → 태블릿 APK로 확인.

```bash
npm run dev -w apps/shapeplay     # 모양 놀이 (새 앱)
npm run dev -w apps/lifeplay      # 생활 놀이 (새 앱)
npm run dev -w apps/animalfriends # 그림자 맞추기, 동물 피아노
npm run dev -w apps/numberplay    # 몇 개일까?, 크기 순서, 다음은 뭘까?
npm run dev -w apps/hangulplay    # 듣고 찾기, 첫소리 찾기
```

- [ ] 태블릿에서 **손가락으로 끌어다 놓기**가 잘 되는지 (도형 맞추기, 그림자 맞추기, 끼리끼리). 조각·구멍 크기
- [ ] 이모지가 다 보이는지 (🪥 칫솔 등 최신 이모지), 끼리끼리 색이 헷갈리지 않는지 (🦋 등)
- [ ] **기분 맞추기** 상황·문구, **순서대로** 단계가 집에서 가르치는 방식과 맞는지 → 고칠 곳은 `apps/lifeplay/src/voice.ts`
- [ ] 새 앱 이름 확정: `shapeplay` 모양 놀이, `lifeplay` 생활 놀이 (스토어에 올린 뒤엔 바꿀 수 없음)
- [ ] 어느 앱부터 출시할지 (앱마다 테스터 12명 × 14일 비공개 테스트)

자세한 내용: [docs/ideas/005-nuri-games.md](ideas/005-nuri-games.md)

## 3. 녹음 음성 만들기 (MeloTTS)

처음이면 [scripts/tts/README.md](../scripts/tts/README.md) **1. 설치**부터 (WSL Ubuntu, 한 번만).

```bash
# Ubuntu(WSL) 창
source ~/melo-env/bin/activate
cd /mnt/c/<집 PC 소스 경로>

# 작은 앱부터 들어 보기
bash scripts/tts/make_all.sh lifeplay
```

- [ ] `apps/lifeplay/public/voice/` 의 mp3 몇 개 들어 보기 → 속도가 빠르면 `SPEED=0.8` 로 다시 (`--force`)
- [ ] `npm run dev -w apps/lifeplay` 로 앱에서 녹음이 나오는지, **문장 이어 붙일 때 간격·억양**이 자연스러운지
- [ ] 괜찮으면 나머지: `bash scripts/tts/make_all.sh` (한글 놀이 2,534개는 오래 걸림 — 자기 전에 돌려 두기)
- [ ] 이상한 문장만 다시: `python scripts/tts/make_voices.py apps/<앱>/voice-lines.json apps/<앱>/public/voice --only "문장 그대로"`
- [ ] 태블릿(APK)·Windows(Electron)에서도 녹음이 나오는지
- [ ] **한글 놀이 용량** 결정: 글자 2,100개 녹음을 다 넣을지 (APK 약 20MB 늘어남 예상), 글자는 TTS로 둘지

## 4. 끝날 때

```bash
git add -A && git commit -m "..."     # 녹음 파일(public/voice, src/voice-files.json)도 커밋
git push origin main
git push origin main:external
```
