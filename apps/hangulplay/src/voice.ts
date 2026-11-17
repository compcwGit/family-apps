// 한글 놀이가 읽는 말 모음 — 화면(컴포넌트)과 음성 목록(voice-lines.json)이 같이 씀
// 말을 바꾸면: npm run voice-lines -- hangulplay  →  scripts/tts/make_voices.py 로 바뀐 것만 다시 만들기
//
// 파일 id 규칙 (원래 쓰던 것 그대로):
//   jamo/<코드>        자모 카드 문장   "기역이에요. 기차의 기!"   (코드 = 글자의 유니코드 16진수, ㄱ → 3131)
//   name/<코드>        자모 이름        "기역" (따라쓰기 제목·완료)
//   num/native/<n>     숫자 고유어      "하나" (0은 "영")
//   num/sino/<n>       숫자 한자어      "일"
//   syl/<코드>         글자 만들기      "감" (자음 14 × 모음 10 × 받침 없음+14 = 2,100개)
//   praise/<i>, cheer/<i>, sample
//   그 밖의 문장(듣고 찾기, 첫소리 찾기, 따라쓰기 완료 등)은 <묶음>/<해시>
import { voiceList, eun, eul } from '@family/core/voicelist'
import { ALL_JAMO, CONSONANTS, NUMBERS, VOWELS, compose } from './hangul'
import { CHEERS, PRAISES, SAMPLE, jamoLine } from './talk'
import { WORDS, firstSound } from './words'

// 받침이 있으면 '으로', 없거나 ㄹ 받침이면 '로' (기역으로, 리을로)
export const euro = (w: string) => {
  const b = (w.charCodeAt(w.length - 1) - 0xac00) % 28
  return w + (b === 0 || b === 8 ? '로' : '으로')
}
const nameOf = (ch: string) => CONSONANTS.find((c) => c.ch === ch)?.name ?? ch

export const SAY = {
  traceDone: (praise: string, label: string) => `${praise} ${label}!`,
  listenAsk: (w: string) => `${eul(w)} 찾아 보세요!`,
  listenNo: (wrong: string, answer: string) => `그건 ${wrong}! ${eul(answer)} 찾아 볼까?`,
  listenOk: (w: string) => `${w}!`,
  firstAsk: (name: string) => `${name}! ${euro(name)} 시작하는 건 뭘까요?`,
  firstNo: (w: string) => `${eun(w)} ${euro(nameOf(firstSound(w)))} 시작해요. 다시 찾아볼까?`,
  firstOk: (w: string) => `${w}의 ${w[0]}!`,
}

const code = (ch: string) => ch.codePointAt(0)!.toString(16)

export function voiceLines() {
  const v = voiceList()
  for (const j of ALL_JAMO) v.set(`jamo/${code(j.ch)}`, jamoLine(j)).set(`name/${code(j.ch)}`, j.name)
  for (const n of NUMBERS) v.set(`num/native/${n.ch}`, n.word).set(`num/sino/${n.ch}`, n.name)
  PRAISES.forEach((t, i) => v.set(`praise/${i}`, t))
  CHEERS.forEach((t, i) => v.set(`cheer/${i}`, t))
  v.set('sample', SAMPLE)
  for (const c of CONSONANTS)
    for (const vw of VOWELS)
      for (const b of ['', ...CONSONANTS.map((x) => x.ch)]) {
        const syl = compose(c.ch, vw.ch, b)
        v.set(`syl/${code(syl)}`, syl)
      }

  v.common()
  // 따라쓰기 완료: "우와, 잘했어요! 기역!" → 칭찬 + "기역!"
  for (const j of [...ALL_JAMO, ...NUMBERS]) v.add('trace', SAY.traceDone('', j.name), SAY.traceDone('', j.word))
  for (const c of CONSONANTS) v.add('first', SAY.firstAsk(c.name))
  for (const x of WORDS) {
    v.add('listen', SAY.listenAsk(x.w), SAY.listenOk(x.w), `그건 ${x.w}!`, `${eul(x.w)} 찾아 볼까?`)
    v.add('first', SAY.firstNo(x.w), SAY.firstOk(x.w))
  }
  return v.lines
}
