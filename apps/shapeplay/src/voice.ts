// 모양 놀이가 읽는 말 모음 — 화면(컴포넌트)과 음성 목록(voice-lines.json)이 같이 씀
// 말을 바꾸면: npm run voice-lines -- shapeplay  →  scripts/tts/make_voices.py 로 바뀐 것만 다시 만들기
import { voiceList, MATCH, eun } from '@family/core/voicelist'
import { SHAPES } from './shapes'
import { PICTURES, NAMES } from './pictures'

// 끼리끼리 모으기: 색 묶음
export const COLORS = [
  { id: 'red', name: '빨간색', bg: '#EF9A9A', items: ['🍎', '🍓', '🍒', '🍅', '🚒', '🌹'] },
  { id: 'yellow', name: '노란색', bg: '#FFF59D', items: ['🍌', '🌽', '🐤', '🍋', '⭐', '🌻'] },
  { id: 'green', name: '초록색', bg: '#A5D6A7', items: ['🥦', '🐸', '🍀', '🥒', '🌲', '🍏'] },
  { id: 'blue', name: '파란색', bg: '#90CAF9', items: ['🐳', '💧', '💙', '🧢', '🚙', '🦋'] },
]

export const SAY = {
  shapeAsk: '같은 모양 자리에 끌어다 놓아요!',
  sortRule: (a: string, b: string) => `${eun(a)} ${a} 바구니에, ${eun(b)} ${b} 바구니에 담아요!`,
  sortNo: '그 바구니가 아니에요. 다시 볼까?',
  sortOk: '모두 담았어요!',
  sortIn: ['쏙!', '좋아요!', '맞아요!'],
  colorDone: (praise: string, name: string) => `${praise} 예쁜 ${name} 완성!`,
  colorName: (n: string) => `${n}!`,
}

export function voiceLines() {
  const v = voiceList().common()
  v.add('shape', SAY.shapeAsk, MATCH.all)
  for (const s of SHAPES) v.add('shape', MATCH.name(s.name), MATCH.placed(s.name), MATCH.wrong(s.name))
  v.add('sort', SAY.sortNo, SAY.sortOk, ...SAY.sortIn)
  // 두 묶음 순서 상관없이 모두 (색 4개, 모양 6개)
  for (const group of [COLORS.map((c) => c.name), SHAPES.map((s) => s.name)])
    for (const a of group) for (const b of group) if (a !== b) v.add('sort', SAY.sortRule(a, b))
  for (const p of PICTURES) v.add('color', SAY.colorDone('', p.name))
  for (const n of NAMES) v.add('color', SAY.colorName(n))
  return v.lines
}
