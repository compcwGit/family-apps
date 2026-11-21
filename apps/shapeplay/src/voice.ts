// 모양 놀이가 읽는 말 모음 — 화면(컴포넌트)과 음성 목록(voice-lines.json)이 같이 씀
// 말을 바꾸면: npm run voice-lines -- shapeplay  →  scripts/tts/make_voices.py 로 바뀐 것만 다시 만들기
import { voiceList, MATCH, eun, eul, ieyo, iga } from '@family/core/voicelist'
import { SHAPES } from './shapes'
import { PICTURES, NAMES } from './pictures'
import { PUZZLES } from './tangram'

// 끼리끼리 모으기: 색 묶음
export const COLORS = [
  { id: 'red', name: '빨간색', bg: '#FFD3C9', dot: '#FF6B57', items: ['🍎', '🍓', '🍒', '🍅', '🚒', '🌹'] },
  { id: 'yellow', name: '노란색', bg: '#FFEBB0', dot: '#FFC94A', items: ['🍌', '🌽', '🐤', '🍋', '⭐', '🌻'] },
  { id: 'green', name: '초록색', bg: '#CBEFDD', dot: '#63D2A1', items: ['🥦', '🐸', '🍀', '🥒', '🌲', '🍏'] },
  { id: 'blue', name: '파란색', bg: '#CDE9FB', dot: '#6EC1F5', items: ['🐳', '💧', '💙', '🧢', '🚙', '🦋'] },
]

// 카드 뒤집기 그림
export const MEMORY_PICS = ['🐶', '🐱', '🐰', '🐻', '🐸', '🐥', '🍎', '🍌', '🍓', '🚗', '⭐', '🎈']

// 점 잇기 그림 (200×200, 1번 점부터 차례로, 마지막 점은 1번으로 이어짐)
// 다른 그림 찾기 그림 묶음
export const SPOT_SETS = [
  ['🍎', '🍌', '🍇', '🍓', '🍊'],
  ['🐶', '🐱', '🐰', '🐻', '🐼'],
  ['🚗', '🚌', '🚲', '🚀', '🚂'],
  ['⭐', '🌙', '☀️', '☁️', '🌈'],
]

// 위치 놀이: 놓을 것과 자리
export const PLACE_THINGS = [
  { name: '곰 인형', e: '🧸' }, { name: '공', e: '⚽' }, { name: '고양이', e: '🐱' }, { name: '사과', e: '🍎' }, { name: '오리', e: '🦆' },
]
export const PLACE_SPOTS = [
  { id: 'up', name: '위' }, { id: 'in', name: '안' }, { id: 'down', name: '아래' }, { id: 'side', name: '옆' },
]

export const SAY = {
  shapeAsk: '같은 모양 자리에 끌어다 놓아요!',
  sortRule: (a: string, b: string) => `${eun(a)} ${a} 바구니에, ${eun(b)} ${b} 바구니에 담아요!`,
  sortNo: '그 바구니가 아니에요. 다시 볼까?',
  sortOk: '모두 담았어요!',
  sortIn: ['쏙!', '좋아요!', '맞아요!'],
  colorDone: (praise: string, name: string) => `${praise} 예쁜 ${name} 완성!`,
  colorName: (n: string) => `${n}!`,
  tangramAsk: (name: string) => `조각을 끌어다 ${name} 모양을 만들어요!`,
  tangramNo: '거기가 아니에요. 같은 모양 자리를 찾아볼까?',
  tangramDone: (name: string) => `${name} 완성!`,
  memoryAsk: '카드를 뒤집어서 같은 그림 두 장을 찾아요!',
  memoryOk: '짝을 모두 찾았어요!',
  spotAsk: (k: number) => `오른쪽 그림에서 다른 곳 ${k === 3 ? '세' : '두'} 군데를 찾아요!`,
  spotNo: '거기는 똑같아요. 다시 찾아볼까?',
  spotFound: (n: number) => `${n === 1 ? '하나' : '둘'} 찾았다!`,
  spotOk: '다른 곳을 모두 찾았어요!',
  placeTitle: (t: string, p: string) => `${eul(t)} 상자 ${p}에`,
  placeAsk: (t: string, p: string) => `${eul(t)} 상자 ${p}에 놓아요!`,
  placeNo: (p: string) => `거기는 상자 ${ieyo(p)}. 다시 해 볼까?`,
  placeOk: (t: string, p: string) => `맞아요! ${iga(t)} 상자 ${p}에 있어요.`,
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
  v.add('tangram', SAY.tangramNo)
  for (const p of PUZZLES) v.add('tangram', SAY.tangramAsk(p.name), SAY.tangramDone(p.name))
  v.add('memory', SAY.memoryAsk, SAY.memoryOk)
  v.add('spot', SAY.spotAsk(2), SAY.spotAsk(3), SAY.spotNo, SAY.spotFound(1), SAY.spotFound(2), SAY.spotOk)
  for (const s of PLACE_SPOTS) v.add('place', SAY.placeNo(s.name))
  for (const t of PLACE_THINGS) for (const s of PLACE_SPOTS) v.add('place', SAY.placeAsk(t.name, s.name), SAY.placeOk(t.name, s.name))
  return v.lines
}
