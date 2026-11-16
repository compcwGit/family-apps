// 새 앱 만들기: npm run new-app -- <영문이름> "<앱 표시 이름>"
// 예) npm run new-app -- animalfriends "동물 친구들"
// 패키지 이름은 com.compcwgit.<영문이름> 으로 정해집니다 (스토어에 올린 뒤엔 바꿀 수 없음)
import { cpSync, readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const [name, title = name] = process.argv.slice(2)
if (!name || !/^[a-z][a-z0-9]*$/.test(name)) {
  console.error('사용법: npm run new-app -- <영문 소문자 이름> "<앱 표시 이름>"')
  process.exit(1)
}
const dest = join('apps', name)
if (existsSync(dest)) {
  console.error(`이미 있습니다: ${dest}`)
  process.exit(1)
}

cpSync(join('templates', 'app'), dest, { recursive: true })

const replace = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) replace(p)
    else
      writeFileSync(
        p,
        readFileSync(p, 'utf8')
          .replaceAll('__NAME__', name)
          .replaceAll('__APPID__', `com.compcwgit.${name}`)
          .replaceAll('__TITLE__', title),
      )
  }
}
replace(dest)

console.log(`만들었습니다: ${dest}  (패키지 com.compcwgit.${name})`)
console.log('다음: npm install  →  npm run dev -w apps/' + name)
