// 숫자 놀이가 읽는 말 모음 — 화면(컴포넌트)과 음성 목록(voice-lines.json)이 같이 씀
// 말을 바꾸면: npm run voice-lines -- numberplay  →  scripts/tts/make_voices.py 로 바뀐 것만 다시 만들기
import { voiceList, iga, eun } from '@family/core/voicelist'
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
  // 더하기·빼기
  plusAsk: (a: number, b: number, m: Mode) => `${readNumber(a, m)} 더하기 ${eun(readNumber(b, m))}?`,
  minusAsk: (a: number, b: number, m: Mode) => `${readNumber(a, m)} 빼기 ${eun(readNumber(b, m))}?`,
  plusOk: (n: number, m: Mode) => `모두 ${readNumber(n, m)}!`,
  minusOk: (n: number, m: Mode) => (n === 0 ? '하나도 안 남았어요!' : `${readNumber(n, m)} 남았어요!`),
  mathNo: '그림을 하나씩 세어 볼까?',
  // 거꾸로·뛰어 세기 (뛰어 세기 안내는 "둘씩"처럼 늘 고유어)
  skipTitle: (k: string) => ({ down: '거꾸로 세어요', two: '둘씩 뛰어 세어요', ten: '열씩 뛰어 세어요', five: '다섯씩 뛰어 세어요' })[k]!,
  skipAsk: (k: string, start: number, m: Mode) =>
    k === 'down' ? `${readNumber(start, m)}부터 거꾸로 세어요! 큰 수부터 눌러요.` : `${({ two: '둘', ten: '열', five: '다섯' } as Record<string, string>)[k]}씩 뛰어 세어요! 작은 수부터 눌러요.`,
  skipNo: '다음 숫자는 뭘까? 다시 찾아볼까?',
  skipLaunch: '발사! 로켓이 날아가요!',
  skipOk: '다 셌어요! 최고!',
  // 시계 보기
  clockAsk: '시계를 보고 몇 시인지 골라요!',
  clockNo: '짧은 바늘이 가리키는 숫자를 볼까?',
  clockOk: (t: string) => `${t}예요!`,
}

// 시각 읽기: 3시 → "세 시", 3시 30분 → "세 시 반" (시는 늘 고유어)
const HOURS = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두']
export const hourText = (h: number, m: number) => `${HOURS[h]} 시${m ? ' 반' : ''}`

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
  for (const m of ['native', 'sino'] as const) {
    for (let a = 1; a <= 10; a++)
      for (let b = 1; b <= 10; b++) {
        if (a + b <= 10) v.add('math', SAY.plusAsk(a, b, m))
        if (b < a) v.add('math', SAY.minusAsk(a, b, m))
      }
    for (let n = 0; n <= 10; n++) v.add('math', SAY.plusOk(n, m), SAY.minusOk(n, m))
    v.add('skip', SAY.skipAsk('down', 5, m), SAY.skipAsk('down', 10, m))
  }
  v.add('math', SAY.mathNo)
  v.add('skip', SAY.skipAsk('two', 2, 'native'), SAY.skipAsk('ten', 10, 'native'), SAY.skipAsk('five', 5, 'native'), SAY.skipNo, SAY.skipLaunch, SAY.skipOk)
  v.add('write', '영')
  v.add('clock', SAY.clockAsk, SAY.clockNo)
  for (let h = 1; h <= 12; h++) for (const mm of [0, 30]) v.add('clock', SAY.clockOk(hourText(h, mm)))
  return v.lines
}
