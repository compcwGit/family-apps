// 앱에서 쓰는 이모지를 찾아 3D 그림(Microsoft Fluent Emoji 3D, MIT)을 앱에 넣기
//
//   npm run emoji -- lifeplay          고른 앱
//   npm run emoji                      모든 앱
//
// apps/<앱>/src 의 .ts/.tsx 에서 이모지를 모아 → apps/<앱>/public/emoji/<코드>.webp 로 복사
// → apps/<앱>/src/emoji-files.json ({ 이모지: 파일 }) 저장. 그림이 없는 이모지는 글자 그대로 보임
// 그림 출처: npm @lobehub/fluent-emoji-3d (devDependency, 앱에 넣는 건 쓰는 파일만)
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const src = join(root, 'node_modules/@lobehub/fluent-emoji-3d/assets')
const have = new Set(readdirSync(src))
const apps = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(join(root, 'apps'))
const EMOJI = /\p{Extended_Pictographic}(?:️|[\u{1F3FB}-\u{1F3FF}]|‍\p{Extended_Pictographic}️?)*/gu

const code = (e: string) => [...e].map((c) => c.codePointAt(0)!.toString(16)).join('-')
function fileFor(e: string) {
  const full = code(e)
  const noVs = code(e.replace(/️/g, ''))
  for (const c of [full, noVs, `${noVs}-fe0f`]) if (have.has(`${c}.webp`)) return `${c}.webp`
  return null
}
function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : /\.tsx?$/.test(d.name) ? [join(dir, d.name)] : [],
  )
}

for (const app of apps) {
  const dir = join(root, 'apps', app)
  if (!existsSync(join(dir, 'src'))) continue
  const found = new Set<string>()
  for (const f of walk(join(dir, 'src'))) for (const m of readFileSync(f, 'utf8').matchAll(EMOJI)) found.add(m[0])
  const out = join(dir, 'public/emoji')
  rmSync(out, { recursive: true, force: true })
  mkdirSync(out, { recursive: true })
  const map: Record<string, string> = {}
  const missing: string[] = []
  for (const e of [...found].sort()) {
    const f = fileFor(e)
    if (!f) missing.push(e)
    else {
      copyFileSync(join(src, f), join(out, f))
      map[e] = f
    }
  }
  writeFileSync(join(dir, 'src/emoji-files.json'), JSON.stringify(map, null, 1) + '\n')
  console.log(`${app}: 그림 ${Object.keys(map).length}개${missing.length ? `, 그림 없음 ${missing.join(' ')}` : ''}`)
}
