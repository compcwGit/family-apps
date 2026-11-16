// 한글 놀이 음성 목록 만들기: 앱 데이터(src/hangul.ts, src/talk.ts)에서 읽는 말을 모아
// voice-lines.json 으로 저장 → scripts/tts/make_voices.py 가 MeloTTS로 mp3를 만듦
//
// 실행 (저장소 루트): npm run voice-lines -w apps/hangulplay
// 단어·칭찬 문장을 바꾸면 다시 실행하고, 바뀐 id만 make_voices.py --only 로 다시 만들기
//
// 파일 id 규칙 (앱에서 재생할 때도 같은 규칙):
//   jamo/<코드>        자모 카드 문장   "기역이에요. 기차의 기!"   (코드 = 글자의 유니코드 16진수, ㄱ → 3131)
//   name/<코드>        자모 이름        "기역" (따라쓰기 제목·완료)
//   num/native/<n>     숫자 고유어      "하나" (0은 "영")
//   num/sino/<n>       숫자 한자어      "일"
//   syl/<코드>         글자 만들기      "감" (자음 14 × 모음 10 × 받침 없음+14 = 2,100개)
//   praise/<i>         칭찬             "우와, 잘했어요!"
//   cheer/<i>          격려             "괜찮아, 다시 해 보자!"
//   sample             목소리 들어 보기
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { ALL_JAMO, CONSONANTS, NUMBERS, VOWELS, compose } from '../src/hangul.ts'
import { CHEERS, PRAISES, SAMPLE, jamoLine } from '../src/talk.ts'

export const code = (ch: string) => ch.codePointAt(0)!.toString(16)

const lines: Record<string, string> = {}

for (const j of ALL_JAMO) {
  lines[`jamo/${code(j.ch)}`] = jamoLine(j)
  lines[`name/${code(j.ch)}`] = j.name
}
for (const n of NUMBERS) {
  lines[`num/native/${n.ch}`] = n.word
  lines[`num/sino/${n.ch}`] = n.name
}
PRAISES.forEach((t, i) => (lines[`praise/${i}`] = t))
CHEERS.forEach((t, i) => (lines[`cheer/${i}`] = t))
lines.sample = SAMPLE

for (const c of CONSONANTS)
  for (const v of VOWELS)
    for (const b of ['', ...CONSONANTS.map((x) => x.ch)]) {
      const syl = compose(c.ch, v.ch, b)
      lines[`syl/${code(syl)}`] = syl
    }

const out = fileURLToPath(new URL('../voice-lines.json', import.meta.url))
writeFileSync(out, JSON.stringify(lines, null, 1) + '\n')
console.log(`${Object.keys(lines).length}개 → ${out}`)
