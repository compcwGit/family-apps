# family-apps

React 하나로 **웹 미리보기 + Windows(Electron) + Android(Capacitor)** 를 만드는 서버 없는 앱 템플릿.
첫 화면은 아이용 "동물 친구들" 소리 버튼판입니다.

## 처음 한 번 (집 PC)

```bash
npm install
npm run dev            # 브라우저 개발 서버
npm run electron:dev   # Windows 앱으로 실행
```

GitHub에 올리기:

```bash
git init && git add . && git commit -m "init"
git branch -M main
git remote add origin https://github.com/<내아이디>/family-apps.git
git push -u origin main
```

## GitHub 설정 (한 번만)

1. **Settings → Pages → Source: GitHub Actions** 선택
2. **Settings → Environments → github-pages → Deployment branches** 를 `No restriction` 으로
   (브랜치에 push 해도 미리보기가 갱신됨. 마지막 push 가 화면에 보임)
3. 미리보기 주소: `https://<내아이디>.github.io/family-apps/`

> 비공개 저장소에서 Pages 를 쓰려면 유료 플랜이 필요합니다. 이 저장소에는 비밀 정보가 없으니
> **공개 저장소**를 추천합니다. 가족사진은 저장소에 넣지 말고, 앱에서 기기 갤러리로 불러오세요.

## 자동 빌드 (.github/workflows)

| 워크플로 | 언제 | 결과 |
|---|---|---|
| Web Preview (Pages) | 모든 push | 아이폰 Safari 로 확인 |
| Android APK | 모든 push/PR | Actions 아티팩트, main 이면 **Releases** 에 APK |
| Windows EXE | main push, 수동 | Actions 아티팩트에 설치 파일 |

태블릿 설치: 태블릿 브라우저로 저장소 **Releases** → `family-apps.apk` 다운로드 → 설치
(처음엔 "출처를 알 수 없는 앱 설치" 허용 필요).
아이에게 줄 땐 **설정 → 보안 → 앱 고정(화면 고정)** 을 켜 두세요.

## 하루 흐름

1. 출근길: Projects 보드에서 Issue 하나 → 아이폰 Claude Code 로 브랜치 작업 → PR
2. 자동: Pages 미리보기 + APK 빌드
3. 퇴근길: Safari 로 미리보기 확인, PR 에 수정 요청
4. 집: 태블릿에 APK 설치해 터치 테스트 → merge

## 구조

```
src/App.tsx        첫 화면 (동물 버튼판)
src/sound.ts       소리 재생 (지금은 WebAudio 톤)
src/platform.ts    android / electron / web 판별
electron/main.cjs  Windows 앱 진입점
capacitor.config.json  안드로이드 설정 (android/ 폴더는 CI에서 자동 생성)
docs/ROADMAP.md    주차별 Issue 목록
```

안드로이드 아이콘·권한을 바꾸고 싶어지면 PC에서 `npx cap add android` 후 `android/` 폴더를 커밋하세요.
