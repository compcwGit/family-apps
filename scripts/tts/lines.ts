// 앱마다 음성 목록(voice-lines.json) 만들기 — 앱의 src/voice.ts 에 있는 voiceLines() 를 실행해서 저장
//
//   npm run voice-lines              모든 앱
//   npm run voice-lines -- numberplay hangulplay   고른 앱만
//
// 만든 목록으로 집 PC(WSL)에서 mp3 만들기: scripts/tts/README.md
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '../..')
const all = readdirSync(join(root, 'apps')).filter((a) => existsSync(join(root, 'apps', a, 'src/voice.ts')))
const pick = process.argv.slice(2)
const apps = pick.length ? pick : all

for (const app of apps) {
  if (!all.includes(app)) {
    console.error(`${app}: src/voice.ts 가 없습니다 (말이 있는 앱: ${all.join(', ')})`)
    process.exitCode = 1
    continue
  }
  const mod = await import(pathToFileURL(join(root, 'apps', app, 'src/voice.ts')).href)
  const lines: Record<string, string> = mod.voiceLines()
  const out = join(root, 'apps', app, 'voice-lines.json')
  const before = existsSync(out) ? (JSON.parse(readFileSync(out, 'utf8')) as Record<string, string>) : {}
  writeFileSync(out, JSON.stringify(lines, null, 1) + '\n')
  // 새로 생긴 말 / 바뀐 말 → 이것만 다시 만들면 됨 (make_voices.py 는 이미 있는 파일을 건너뜀)
  const changed = Object.keys(lines).filter((k) => before[k] !== undefined && before[k] !== lines[k])
  const added = Object.keys(lines).filter((k) => before[k] === undefined)
  console.log(`${app}: ${Object.keys(lines).length}개 (새로 ${added.length}, 바뀜 ${changed.length}) → apps/${app}/voice-lines.json`)
  if (changed.length) console.log(`  바뀐 것 다시 만들기: --only ${changed.join(' ')}`)
}
