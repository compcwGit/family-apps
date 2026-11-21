// CI용: 빌드할 앱 목록(JSON 배열)을 받아 [{app, variant}] 로 펼침
// - store  : 모든 앱 (Play 배포용)
// - family : 광고를 쓰는 앱(apps/<앱>/android.json 에 admobAppId 가 있는 앱)만 추가 → 광고 없는 아이용 APK
import { existsSync, readFileSync } from 'node:fs'

const apps = JSON.parse(process.argv[2] ?? '[]')
const out = []
for (const app of apps) {
  out.push({ app, variant: 'store' })
  const f = `apps/${app}/android.json`
  if (existsSync(f) && JSON.parse(readFileSync(f, 'utf8')).admobAppId) out.push({ app, variant: 'family' })
}
console.log(JSON.stringify(out))
