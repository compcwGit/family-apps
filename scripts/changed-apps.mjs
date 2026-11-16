// CI용: 빌드할 앱 목록을 JSON 배열로 출력
// 공통 코드(packages, templates, scripts, 워크플로, 루트 설정)가 바뀌면 전체, 아니면 바뀐 앱만
import { execSync } from 'node:child_process'
import { readdirSync, existsSync } from 'node:fs'

const all = readdirSync('apps').filter((d) => existsSync(`apps/${d}/package.json`))
const base = process.env.BASE_SHA
let changed = all
if (base && !/^0+$/.test(base)) {
  try {
    const files = execSync(`git diff --name-only ${base} HEAD`, { encoding: 'utf8' }).split('\n').filter(Boolean)
    const shared = files.some((f) => !f.startsWith('apps/') && !f.startsWith('docs/') && !f.endsWith('.md'))
    changed = shared ? all : all.filter((a) => files.some((f) => f.startsWith(`apps/${a}/`)))
  } catch {
    changed = all
  }
}
console.log(JSON.stringify(changed))
