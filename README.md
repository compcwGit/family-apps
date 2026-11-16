# family-apps

서버 없는 앱 모음. React 하나로 **웹 미리보기 + Windows(Electron) + Android(Capacitor)** 를 만듭니다.
공통 기능(부모 잠금, 저장, 광고·결제)은 한 번만 만들고, 앱은 화면만 따로 만드는 **모노레포** 구조입니다.

## 구조

```
apps/<앱>/            앱마다 하나 (패키지 이름, 화면, 아이콘)
  └─ stampplay/       칭찬도장 모험 게임 (com.compcwgit.stampplay)
  └─ hangulplay/      한글 놀이 (com.compcwgit.hangulplay, 가칭)
  └─ animalfriends/   동물 친구들 (com.compcwgit.animalfriends)
  └─ numberplay/      숫자 놀이 (가칭)
  └─ shapeplay/       모양 놀이 — 도형·분류·색칠 (가칭)
  └─ lifeplay/        생활 놀이 — 생활 순서·기분 (가칭)
packages/core/        모든 앱 공통
  ├─ ParentGate       부모 잠금 (두 자리 덧셈)
  ├─ ParentPage       부모 화면 공통 (소개, 누리과정, 개인정보처리방침)
  ├─ game, DragMatch  놀이 공통 반응·별, 끌어다 맞추기 (useDrag)
  ├─ talk             조사·칭찬 문구
  ├─ storage          기기 안 저장
  ├─ sound, platform  소리, 실행 환경 판별
  └─ ads, billing     광고·광고 제거 결제 (준비 중)
templates/app/        새 앱 뼈대
scripts/              new-app, build-pages, changed-apps(CI용)
docs/ideas/           아이디어·방침 정리
```

## 집 PC 명령어

Node.js 22 이상 필요.

```bash
git clone https://github.com/compcwgit/family-apps.git   # 처음 한 번
cd family-apps
git pull                                  # 매번 시작할 때
npm install                               # 처음, 그리고 package.json 이 바뀌었을 때

npm run dev -w apps/stampplay             # 브라우저에서 개발
npm run electron:dev -w apps/stampplay    # Windows 앱으로 실행
```

새 앱 만들기:

```bash
npm run new-app -- animalfriends "동물 친구들"   # → apps/animalfriends, 패키지 com.compcwgit.animalfriends
npm install
```

> 패키지 이름(com.compcwgit.<이름>)은 Play 스토어에 올린 뒤 바꿀 수 없습니다. 영문 이름을 신중하게 정하세요.

## 자동 빌드 (.github/workflows)

| 워크플로 | 언제 | 결과 |
|---|---|---|
| Web Preview (Pages) | 코드 push | `https://compcwgit.github.io/family-apps/` 에 앱 목록 |
| Android APK | 코드 push/PR, **바뀐 앱만** | 아티팩트, main 이면 Releases 에 `<앱>-android-<번호>` |
| Windows EXE | main push·수동, **바뀐 앱만** | 아티팩트에 설치 파일 |

`packages/`, `templates/`, `scripts/`, 워크플로가 바뀌면 모든 앱을 다시 빌드합니다. 문서만 바뀌면 빌드하지 않습니다.

## 태블릿 설치

Releases → `<앱>.apk` 다운로드 → 설치 (처음엔 "알 수 없는 앱" 허용).
아이에게 줄 땐 **화면 고정**을 켜 두세요. 부모 메뉴는 오른쪽 아래 ⚙️ → 산수 문제.

## 하루 흐름

1. 출근길: Issue 하나 → 아이폰 Claude Code 로 브랜치 작업 → PR
2. 자동: 미리보기 + APK 빌드
3. 퇴근길: 미리보기 확인, PR 에 수정 요청
4. 집: 태블릿에 APK 설치해 확인 → merge

안드로이드 아이콘·권한을 바꾸려면 PC에서 `cd apps/<앱> && npx cap add android` 후 `android/` 폴더를 커밋하세요.
