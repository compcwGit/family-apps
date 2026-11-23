// 안드로이드 빌드 종류 정하기 — cap add / cap sync 전에 (apps/<앱> 에서) 실행
// APP_VARIANT=store  (기본) : Play 배포용. 아무것도 안 바꿈 (결제·광고는 앱 설정대로)
// APP_VARIANT=family        : 아이용(우리집). 광고·결제 라이브러리를 앱에 넣지 않고, 패키지 이름 뒤에 .family 를 붙여
//                             Play 버전과 한 기기에 같이 깔 수 있게 함. APK 로 직접 설치 (Play 에 올리지 않음)
// 뺄 플러그인 목록은 apps/<앱>/android.json 의 excludePlugins (없으면 애드몹 + 구글 결제)
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

if (process.env.APP_VARIANT !== 'family') process.exit(0)

const cap = JSON.parse(readFileSync('capacitor.config.json', 'utf8'))
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const android = existsSync('android.json') ? JSON.parse(readFileSync('android.json', 'utf8')) : {}
const adPlugins = new Set(android.excludePlugins ?? ['@capacitor-community/admob', '@capgo/native-purchases'])

// 앱이 쓰는 캐퍼시터 플러그인(package.json 에 "capacitor" 항목이 있는 패키지) 중 광고용만 뺀 목록
const find = (name) => ['node_modules', '../../node_modules'].map((d) => join(d, name, 'package.json')).find(existsSync)
const plugins = Object.keys(pkg.dependencies ?? {})
  .filter((n) => !adPlugins.has(n))
  .filter((n) => {
    const f = find(n)
    return f && JSON.parse(readFileSync(f, 'utf8')).capacitor
  })

cap.appId = `${cap.appId}.family`
cap.appName = android.familyName ?? `${cap.appName} (우리집)`
cap.includePlugins = plugins
writeFileSync('capacitor.config.json', JSON.stringify(cap, null, 2) + '\n')
console.log(`family 빌드: ${cap.appId} / ${cap.appName} / 플러그인 ${plugins.join(', ') || '없음'} (제외: ${[...adPlugins].join(', ')})`)
