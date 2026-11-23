// CI용: 빌드할 앱 목록(JSON 배열)을 받아 [{app, variant}] 로 펼침
// - store  : 모든 앱 (Play 배포용)
// - family : apps/<앱>/android.json 에 "family": true (또는 광고를 쓰는 앱: admobAppId) 가 있는 앱만 추가 → 아이용 APK
import { existsSync, readFileSync } from 'node:fs'

const apps = JSON.parse(process.argv[2] ?? '[]')
const out = []
for (const app of apps) {
  out.push({ app, variant: 'store' })
  const f = `apps/${app}/android.json`
  if (existsSync(f) && (() => { const c = JSON.parse(readFileSync(f, 'utf8')); return c.family || c.admobAppId })()) out.push({ app, variant: 'family' })
}
console.log(JSON.stringify(out))
