// 웹 미리보기용: 모든 앱을 빌드해서 site/<앱>/ 에 모으고, site/index.html 에 목록을 만듦
import { execSync } from 'node:child_process'
import { readdirSync, existsSync, mkdirSync, cpSync, writeFileSync, readFileSync } from 'node:fs'

const apps = readdirSync('apps').filter((d) => existsSync(`apps/${d}/package.json`))
mkdirSync('site', { recursive: true })
const links = []
for (const a of apps) {
  execSync(`npm run build -w apps/${a}`, { stdio: 'inherit' })
  cpSync(`apps/${a}/dist`, `site/${a}`, { recursive: true })
  const title = JSON.parse(readFileSync(`apps/${a}/package.json`, 'utf8')).build?.productName ?? a
  links.push(`<li><a href="./${a}/">${title}</a></li>`)
}
writeFileSync(
  'site/index.html',
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>family-apps 미리보기</title><style>body{font-family:system-ui;padding:24px;font-size:1.3rem}li{margin:12px 0}</style>
<h1>family-apps 미리보기</h1><ul>${links.join('')}</ul>`,
)
console.log('site/ 준비 완료:', apps.join(', '))
