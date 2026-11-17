// 숫자 놀이가 읽는 말 모음 — 화면(컴포넌트)과 음성 목록(voice-lines.json)이 같이 씀
// 말을 바꾸면: npm run voice-lines -- numberplay  →  scripts/tts/make_voices.py 로 바뀐 것만 다시 만들기
import { voiceList, iga } from '@family/core/voicelist'
import { readNumber, type Mode } from './numbers'

import type { CritterKind } from '@family/core/critter'

// 크기 순서에 나오는 캐릭터 (core/Critter.tsx)
export const SIZE_THINGS: { k: CritterKind; n: string }[] = [
  { k: 'bear', n: '곰' },
  { k: 'elephant', n: '코끼리' },
  { k: 'rabbit', n: '토끼' },
  { k: 'dog', n: '강아지' },
  { k: 'cat', n: '고양이' },
  { k: 'chick', n: '병아리' },
]

export const SAY = {
  good: '잘했어요!',
  done: '다 셌어요! 최고!',
  countAsk: '몇 마리일까요? 하나씩 눌러서 세어 봐요!',
  countOk: (n: number, m: Mode) => `모두 ${readNumber(n, m)}!`,
  countNo: '다시 하나씩 세어 볼까?',
  sizeAsk: (big: boolean, thing: string) => `제일 ${big ? '큰' : '작은'} ${thing}부터 차례로 눌러요!`,
  sizeNo: (big: boolean, thing: string) => `더 ${big ? '큰' : '작은'} ${iga(thing)} 있어요!`,
  sizeOk: (big: boolean) => (big ? '큰 것부터 줄을 섰어요!' : '작은 것부터 줄을 섰어요!'),
  sizeStep: (n: number) => `${n}번!`,
  patternAsk: '규칙을 찾아봐요. 다음에는 뭐가 올까요?',
  patternNo: '처음부터 하나씩 따라 읽어 볼까?',
  patternOk: '규칙을 찾았어요!',
}

export function voiceLines() {
  const v = voiceList()
  // 숫자 1~100 (원래 쓰던 id 그대로)
  for (const m of ['native', 'sino'] as const) for (let n = 1; n <= 100; n++) v.set(`${m}/${n}`, readNumber(n, m))
  v.set('praise/good', SAY.good).set('praise/done', SAY.done)
  v.common()
  v.add('count', SAY.countAsk, SAY.countNo)
  for (const m of ['native', 'sino'] as const) for (let n = 1; n <= 11; n++) v.add('count', SAY.countOk(n, m))
  for (const big of [false, true]) {
    v.add('size', SAY.sizeOk(big))
    for (const t of SIZE_THINGS) v.add('size', SAY.sizeAsk(big, t.n), SAY.sizeNo(big, t.n))
  }
  for (let n = 1; n <= 5; n++) v.add('size', SAY.sizeStep(n))
  v.add('pattern', SAY.patternAsk, SAY.patternNo, SAY.patternOk)
  return v.lines
}
