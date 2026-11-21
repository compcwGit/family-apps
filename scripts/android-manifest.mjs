// cap sync 다음에 실행: apps/<앱>/android.json 이 있으면 AndroidManifest.xml 에 반영
// - admobAppId: 애드몹 앱 ID meta-data
// - removePermissions: 라이브러리가 넣는 권한을 tools:node="remove" 로 뺌 (예: 아동 앱의 AD_ID)
// 사용: (apps/<앱> 에서) node ../../scripts/android-manifest.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

if (!existsSync('android.json')) process.exit(0)
if (process.env.APP_VARIANT === 'family') {
  console.log('family 빌드: 광고 설정을 넣지 않음')
  process.exit(0)
}
const cfg = JSON.parse(readFileSync('android.json', 'utf8'))
const path = 'android/app/src/main/AndroidManifest.xml'
let xml = readFileSync(path, 'utf8')

if (!xml.includes('xmlns:tools=')) xml = xml.replace('<manifest ', '<manifest xmlns:tools="http://schemas.android.com/tools" ')

if (cfg.admobAppId && !xml.includes('com.google.android.gms.ads.APPLICATION_ID')) {
  xml = xml.replace(
    /(<application[^>]*>)/,
    `$1\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${cfg.admobAppId}" />`,
  )
}
for (const p of cfg.removePermissions ?? []) {
  if (!xml.includes(`"${p}" tools:node="remove"`))
    xml = xml.replace('</manifest>', `    <uses-permission android:name="${p}" tools:node="remove" />\n</manifest>`)
}
writeFileSync(path, xml)
console.log('AndroidManifest.xml 반영:', Object.keys(cfg).filter((k) => k !== '//').join(', '))
