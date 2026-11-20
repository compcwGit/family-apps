# 작업 규칙 (Claude용)

이 저장소는 찬욱의 개인 사이드 프로젝트입니다. 대화는 한국어로 합니다.

## 작업 환경 구분 (집 / 외부) — 세션 시작 시 가장 먼저 판별
원본은 항상 GitHub이다. 브랜치는 `main`(최종본)과 `external`(외부 작업) 두 개를 쓴다. 외부에 있을 때 집 PC는 꺼져 있다.
(이 영역은 family-apps, household-ledger, comStockTestBot 세 저장소에서 똑같이 유지한다. 고칠 때는 세 곳 모두 고친다)

### 모드 판별 (위에서부터 먼저 맞는 것)
1. **찬욱이 직접 말하면 그게 우선**: "집이야" → 집 모드 / "회사야"·"밖이야"·"폰이야" → 외부 모드
2. 집 PC에 접근할 수 있으면 → 집 모드 (Claude 데스크톱 앱이 집 PC에 연결돼 `mcp__remote-devices__*` 도구가 있거나, 아래 집 PC 소스 경로에서 Claude Code를 실행한 경우)
3. 그 외 → 외부 모드
- 집 PC 소스 경로: `V:\WorkProject\<저장소 이름>` (예: `V:\WorkProject\family-apps`). 집 PC 에서 Claude 는 이 폴더를 연결해서 작업

### "집이야"라고 하면 — 집 모드 세팅
1. 위 집 PC 소스 경로가 비어 있으면 물어보고, 세 저장소의 이 파일에 모두 기록한다
2. 그 폴더가 이 저장소를 clone한 폴더인지, `origin`이 맞는지, 커밋 안 된 변경이 있는지 확인한다
3. 아래 "집 모드 — 시작할 때"를 실행하고, 외부에서 한 작업 요약과 "집에서 확인할 것" 목록(`git log main..origin/external`의 커밋 메시지)을 보여준다
4. 집 PC에 접근할 수 없으면(데스크톱 앱 미연결) 연결하라고 안내하거나 아래 명령을 직접 실행하게 한다. 클라우드에서 대신 `main`에 push하지 않는다

### 외부 모드 (회사·출퇴근길 폰)
1. `external`을 받고 최신 `main`을 합친다 (`external`이 없으면 `main`에서 새로 만든다)
2. 작업하고 커밋한 뒤 **`external`에만 push**한다. `main`에는 push하지 않는다
3. 실제 실행(Electron 창, 안드로이드 기기·에뮬레이터, 아이폰 등)으로 확인하지 못한 부분은 커밋 메시지에 `집에서 확인:` 줄로 남기고, 마지막 답변에도 따로 알린다

### 집 모드
- **시작할 때** (외부 작업 받아오기)
  ```
  git checkout main
  git pull
  git fetch origin
  git merge origin/external
  ```
- **끝날 때** (최종본 올리고 `external`도 맞추기)
  ```
  git push origin main
  git push origin main:external
  ```
- 집에서는 `main`에서 작업한다. `external`에 직접 커밋하지 않는다
- 집과 외부에서 같은 파일을 고쳐 충돌이 나면 집에서 해결한다
- 끝날 때 push를 안 했으면 찬욱에게 꼭 알린다 (안 하면 외부에서 옛날 코드로 작업하게 됨)

## 집 모드에서 추가로 — 음성 파일 만들기 (family-apps 만)
외부에서 추가·변경한 말(`apps/<앱>/src/voice.ts`)의 음성은 집 PC에서 MeloTTS로 만든다 (찬욱 결정 2026-11-20).
"집이야" 세팅(위 3번)이 끝나면 찬욱이 따로 말하지 않아도 이어서 한다.
1. `npm run voice-lines` → `python scripts/tts/check_voices.py` 로 빠진 음성을 찾고, 앱별 개수를 찬욱에게 보여 준다
2. 빠진 게 있으면 집 PC에서 `scripts\tts\win-make.ps1` 을 실행한다 (= `음성만들기-windows.bat`. 이미 만든 건 건너뛰고 새 것만 만듦)
   - 오래 걸리면 백그라운드로 돌리고 진행은 `scripts\tts\win-make.log` 로 확인한다
   - 빠진 앱만: `win-make.ps1 -Apps lifeplay,shapeplay`
3. 다시 검사해서 통과하면 mp3 와 `apps/<앱>/src/voice-files.json` 을 커밋하고, 집 모드 끝날 때 push 한다 (`-Publish` 로 한 번에 해도 됨)
4. Claude 가 집 PC 명령을 직접 실행할 수 없으면 찬욱에게 `scripts\tts\음성만들기-windows.bat` 더블클릭을 안내한다
- 외부 모드에서 말을 추가·변경하면 커밋 메시지에 `집에서 확인: 음성 만들기 (앱 N개)` 를 남긴다

## 아이디어를 받으면 반드시
1. **실현 가능한지 확인**: 기술, Google Play 정책, 비용. 정책·가격처럼 바뀌는 정보는 검색해서 근거를 남긴다
2. **실현 가능한 방향으로 가이드**: 그대로 어려우면 대안을 제시한다
3. **⚠️ 찬욱이 직접 확인·결정할 부분은 꼭 따로 표시해서 알린다**: 계정, 결제, 설정, 미정 사항
4. 정리한 내용은 `docs/ideas/`에 파일로 남긴다 (원본 아이디어와 Claude 제안을 구분해서)

## 아이디어 → 개발 흐름
1. 찬욱이 `💡 아이디어` Issue를 대충 적거나 대화로 말한다
2. Claude가 검토해서 `docs/ideas/`에 정리하고, 그 Issue에 요약 코멘트와 ⚠️ 확인 사항을 남긴다
   (결정이 필요한 건 `⚠️ 확인 필요` 라벨을 붙인 Issue로 따로 만든다)
3. 만들기로 정하면 `🔨 작업` Issue로 30~40분 크기로 쪼갠다 (앱 라벨도 붙인다)
4. 작업 Issue 하나 = 브랜치 하나 = PR 하나. PR 본문에 `Closes #번호`

## 작업 방식
- 코드는 최소한으로, 필요한 부분만 고친다 (전체 재작성 지양)
- 코드 변경은 브랜치 → PR. `docs/`와 `*.md` 문서만 바뀌면 main에 바로 올려도 된다
  - 위 Issue별 브랜치·PR과 문서 main 직접 push는 **집 모드에서만**. 외부에서는 `external` 하나에 모은다. 집에서 PR로 합친 뒤에도 끝날 때 `git push origin main:external`로 맞춘다
- 스택: React + Vite + TypeScript, Electron(Windows), Capacitor(Android). 서버 없이 동작
- 모노레포(npm workspaces): 앱은 `apps/<앱>`, 공통 기능은 `packages/core`에 둔다
  - 두 앱 이상에서 쓸 기능(부모 잠금, 저장, 광고, 결제, 공통 UI)은 앱이 아니라 core에 만든다
  - 새 앱은 `npm run new-app -- <영문이름> "<표시 이름>"`으로 만든다 (패키지 com.compcwgit.<이름>)
  - Electron 버전은 정확한 버전으로 고정한다 (범위 지정 시 electron-builder가 실패함)
- 아이용 앱은 Google Play 가족 정책을 따른다 (`docs/ideas/monetization.md` 참고)
