# 광고 있는 버전 / 없는 버전 (on·off 방식)

> 2026-11-23 변경: 동물 친구들은 광고를 없애고 인앱 결제만 쓰기로 함. family 빌드는 이제 "잠금·결제·광고 없음(전부 열림)" 아이용 APK. `android.json` 에 `"family": true` 가 있는 앱이 대상 (`VITE_FAMILY=1`, `excludePlugins` 로 광고·결제 플러그인 제외). 아래는 처음 설계(광고 기준) 기록.

## 원본 요청 (찬욱)
앱을 만들 때 아이용 광고 없는 버전과, 배포용 광고 있는 버전을 두 개씩 만들어 달라.

## 결정 (찬욱 확인 + Claude 기본값)
- 소스는 하나, 빌드를 두 번 한다 (스위치 방식)
- **store**: Play 배포용. 광고 있음. 패키지 `com.compcwgit.<앱>`. 서명된 AAB + APK (기존과 같음)
- **family**: 아이 태블릿용(우리집). 광고 없음. 패키지 `com.compcwgit.<앱>.family`, 앱 이름 `<이름> (우리집)`. **APK만** 만들어 직접 설치 (Play에 올리지 않음)
- 패키지가 달라서 한 기기에 둘 다 깔 수 있다. 저장된 데이터(진행 상황)는 서로 공유되지 않는다

## 동작 방식
- `VITE_ADS=0` 으로 빌드하면 `ADS_ENABLED=false` → `initAds`가 즉시 끝나고 `adBreak`도 아무것도 안 함. 부모 화면의 광고 안내도 숨김
- `scripts/android-variant.mjs` (`APP_VARIANT=family`): capacitor.config.json 의 appId/appName 을 바꾸고 `includePlugins` 에서 광고 플러그인(애드몹)을 뺀다 → 앱 안에 광고 라이브러리·AD_ID 권한이 아예 없음
- `scripts/android-manifest.mjs`: family 면 애드몹 meta-data 를 넣지 않음
- `scripts/android-matrix.mjs`: CI 빌드 목록. 모든 앱 store, `android.json` 에 `admobAppId` 가 있는 앱만 family 추가
- CI 결과: store `<앱>-apk`·`<앱>-aab`, family `<앱>-family-apk` / 릴리스 태그 `<앱>-family-android-<번호>`

## 새 앱 만들 때
- 광고를 쓰는 앱: `apps/<앱>/android.json` 에 `admobAppId` 를 넣고, `App.tsx` 에서 `ADS_ENABLED` 로 광고를 감싼다 (`animalfriends` 참고) → family 빌드가 자동으로 생김
- 광고를 안 쓰는 앱: 아무것도 안 하면 store 하나만 생김

## ⚠️ 찬욱이 확인할 것 (집에서)
- 두 APK 를 실제 기기에 깔아 보기: family 에 광고가 없는지, 앱 이름 `(우리집)`, store 버전과 같이 깔리는지
- 아이 태블릿에는 family APK 를 직접 설치 (출처를 알 수 없는 앱 설치 허용 필요)
