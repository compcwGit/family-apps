# 출시 가이드 (Play 스토어 · 아이폰 웹앱)

앱별 스토어 자료: [animalfriends.md](animalfriends.md) (그래픽·스크린샷은 같은 이름 폴더)

## 아이폰 웹앱 — 바로 가능
- main 에 push 하면 GitHub Pages 에 자동 배포: `https://compcwgit.github.io/family-apps/<앱>/`
- 아이폰 Safari → 공유 → **홈 화면에 추가** → 아이콘·이름이 앱처럼 나옴 (manifest·apple-touch-icon 설정됨)
- 개인정보처리방침: `https://compcwgit.github.io/family-apps/privacy.html` (`pages/privacy.html`)

## Play 스토어 — 순서
1. **Play Console 계정 인증 마무리** (전화번호 인증 남음)
2. **업로드 키 만들기** (집 PC, 한 번만 — 잃어버리면 안 됨. 저장소에 절대 올리지 말 것)
   ```bat
   keytool -genkeypair -v -keystore greenholic-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
   - 집 PC 에는 JDK 17 이 있음 → PowerShell 에서 (V:\WorkProject 등 저장소 밖 폴더에서 실행):
     ```powershell
     & "C:\Program Files\Java\jdk-17.0.2\bin\keytool.exe" -genkeypair -v -keystore greenholic-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
     ```
     이름·조직 질문은 아무 값(예: 그린홀릭)이나, 비밀번호 2개(키스토어·키)는 꼭 기억
   - 비밀번호·`.jks` 파일은 구글 드라이브 등 안전한 곳에 따로 백업
3. **GitHub 저장소 Secrets 등록** (Settings → Secrets and variables → Actions → New repository secret)
   | 이름 | 값 |
   |---|---|
   | `ANDROID_KEYSTORE_BASE64` | PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("greenholic-upload.jks"))` 결과 |
   | `ANDROID_KEYSTORE_PASSWORD` | 키스토어 비밀번호 |
   | `ANDROID_KEY_ALIAS` | `upload` |
   | `ANDROID_KEY_PASSWORD` | 키 비밀번호 |
   → 이후 main push 마다 Actions 결과물에 `<앱>-aab` (Play 업로드용 서명 AAB) 가 생김
4. **Play Console → 앱 만들기**: 이름·기본 언어(한국어)·앱/무료 선택 → 앱 콘텐츠 설문(위 앱별 문서의 답) → 스토어 등록정보(설명·그래픽)
5. **Play 앱 서명** 사용(기본값) → 위 AAB 를 **비공개 테스트** 트랙에 업로드
   - AAB 받는 곳: GitHub → Actions → Android APK → 최신 main 실행 → 아래 Artifacts 의 `<앱>-aab`
5-1. **인앱 상품 만들기** (유료 앱, 첫 AAB 를 올린 뒤에 메뉴가 열림): 수익 창출 → 인앱 상품 → 상품 만들기
   - 상품 ID: `<앱>_full` (예: `animalfriends_full`) — 코드와 같아야 함, 나중에 못 바꿈
   - 이름 "전체 기능", 설명 "모든 놀이 열기 (1회 구매)", 가격 설정 → 활성화
   - 테스트: 설정 → 라이선스 테스트 에 본인 Gmail 추가 → 비공개 테스트 설치본에서 "테스트 카드"로 결제 확인 (실제 청구 없음)
6. **비공개 테스트: 테스터 12명 이상 × 14일 연속** (개인 계정 필수 조건) → 그 뒤 프로덕션 신청
   - 테스터는 Google 계정 이메일 목록 또는 Google 그룹으로 추가, 테스트 참여 링크를 보내 설치하게 함

## 버전
- versionName = 앱 `package.json` 의 `version` (예: 1.0.0) — 기능이 바뀌면 직접 올림
- versionCode = CI 빌드 번호 (자동으로 계속 커짐 → Play 업로드 조건 충족)

## 아이콘
- `apps/<앱>/icon-1024.png` (아이폰·웹·예전 안드로이드), `icon-android.png` (적응형 아이콘용, 그림을 작게) 
- `python scripts/make-icons.py` → 웹 아이콘들, CI 의 `scripts/android-icons.sh` → 안드로이드 아이콘
