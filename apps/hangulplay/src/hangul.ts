// 한글 데이터: 기본 자음 14 + 모음 10, 그림 단어, 따라쓰기 획(100×100 좌표)
export type Pt = [number, number]
export type Jamo = { ch: string; name: string; word: string; emoji: string; color: string; strokes: Pt[][] }

// 원(ㅇ, ㅎ): 위에서 시작해 시계 반대 방향으로 그림
const circle = (cx: number, cy: number, r: number): Pt[] =>
  Array.from({ length: 25 }, (_, i) => {
    const a = -Math.PI / 2 - (i / 24) * Math.PI * 2
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Pt
  })

export const CONSONANTS: Jamo[] = [
  { ch: 'ㄱ', name: '기역', word: '기차', emoji: '🚂', color: '#FFCDD2', strokes: [[[22, 25], [75, 25], [75, 80]]] },
  { ch: 'ㄴ', name: '니은', word: '나비', emoji: '🦋', color: '#F8BBD0', strokes: [[[25, 20], [25, 75], [80, 75]]] },
  { ch: 'ㄷ', name: '디귿', word: '다람쥐', emoji: '🐿️', color: '#E1BEE7', strokes: [[[25, 25], [75, 25]], [[25, 25], [25, 75], [78, 75]]] },
  { ch: 'ㄹ', name: '리을', word: '라면', emoji: '🍜', color: '#D1C4E9',
    strokes: [[[25, 20], [75, 20], [75, 48]], [[25, 48], [75, 48]], [[25, 48], [25, 80], [78, 80]]] },
  { ch: 'ㅁ', name: '미음', word: '모자', emoji: '🧢', color: '#C5CAE9',
    strokes: [[[25, 22], [25, 78]], [[25, 22], [75, 22], [75, 78]], [[25, 78], [75, 78]]] },
  { ch: 'ㅂ', name: '비읍', word: '바나나', emoji: '🍌', color: '#BBDEFB',
    strokes: [[[28, 18], [28, 80]], [[72, 18], [72, 80]], [[28, 48], [72, 48]], [[28, 80], [72, 80]]] },
  { ch: 'ㅅ', name: '시옷', word: '사과', emoji: '🍎', color: '#B3E5FC', strokes: [[[50, 20], [22, 80]], [[50, 45], [78, 80]]] },
  { ch: 'ㅇ', name: '이응', word: '오리', emoji: '🦆', color: '#B2EBF2', strokes: [circle(50, 50, 28)] },
  { ch: 'ㅈ', name: '지읒', word: '자동차', emoji: '🚗', color: '#B2DFDB',
    strokes: [[[25, 22], [75, 22]], [[55, 22], [22, 80]], [[50, 48], [78, 80]]] },
  { ch: 'ㅊ', name: '치읓', word: '치즈', emoji: '🧀', color: '#C8E6C9',
    strokes: [[[47, 8], [55, 18]], [[25, 28], [75, 28]], [[55, 28], [22, 85]], [[50, 52], [78, 85]]] },
  { ch: 'ㅋ', name: '키읔', word: '코끼리', emoji: '🐘', color: '#DCEDC8', strokes: [[[22, 22], [75, 22], [75, 80]], [[22, 50], [75, 50]]] },
  { ch: 'ㅌ', name: '티읕', word: '토끼', emoji: '🐰', color: '#F0F4C3',
    strokes: [[[25, 22], [75, 22]], [[25, 48], [75, 48]], [[25, 22], [25, 78], [78, 78]]] },
  { ch: 'ㅍ', name: '피읖', word: '포도', emoji: '🍇', color: '#FFF9C4',
    strokes: [[[20, 22], [80, 22]], [[38, 22], [38, 75]], [[62, 22], [62, 75]], [[20, 75], [80, 75]]] },
  { ch: 'ㅎ', name: '히읗', word: '하마', emoji: '🦛', color: '#FFE0B2',
    strokes: [[[47, 8], [55, 18]], [[22, 28], [78, 28]], circle(50, 62, 20)] },
]

export const VOWELS: Jamo[] = [
  { ch: 'ㅏ', name: '아', word: '아기', emoji: '👶', color: '#FFCCBC', strokes: [[[40, 15], [40, 85]], [[40, 50], [68, 50]]] },
  { ch: 'ㅑ', name: '야', word: '야구', emoji: '⚾', color: '#D7CCC8',
    strokes: [[[40, 15], [40, 85]], [[40, 38], [68, 38]], [[40, 62], [68, 62]]] },
  { ch: 'ㅓ', name: '어', word: '엄마', emoji: '👩', color: '#FFCDD2', strokes: [[[32, 50], [60, 50]], [[60, 15], [60, 85]]] },
  { ch: 'ㅕ', name: '여', word: '여우', emoji: '🦊', color: '#F8BBD0',
    strokes: [[[32, 38], [60, 38]], [[32, 62], [60, 62]], [[60, 15], [60, 85]]] },
  { ch: 'ㅗ', name: '오', word: '오이', emoji: '🥒', color: '#E1BEE7', strokes: [[[50, 30], [50, 60]], [[15, 60], [85, 60]]] },
  { ch: 'ㅛ', name: '요', word: '요요', emoji: '🪀', color: '#C5CAE9',
    strokes: [[[38, 30], [38, 60]], [[62, 30], [62, 60]], [[15, 60], [85, 60]]] },
  { ch: 'ㅜ', name: '우', word: '우유', emoji: '🥛', color: '#BBDEFB', strokes: [[[15, 40], [85, 40]], [[50, 40], [50, 72]]] },
  { ch: 'ㅠ', name: '유', word: '유령', emoji: '👻', color: '#B2EBF2',
    strokes: [[[15, 40], [85, 40]], [[38, 40], [38, 72]], [[62, 40], [62, 72]]] },
  { ch: 'ㅡ', name: '으', word: '음악', emoji: '🎵', color: '#C8E6C9', strokes: [[[15, 50], [85, 50]]] },
  { ch: 'ㅣ', name: '이', word: '이빨', emoji: '🦷', color: '#FFF9C4', strokes: [[[50, 15], [50, 85]]] },
]

export const ALL_JAMO = [...CONSONANTS, ...VOWELS]

// 자음 + 모음 → 글자 (유니코드: 가 + (초성×21 + 중성)×28)
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
export const compose = (c: string, v: string) =>
  String.fromCharCode(0xac00 + (CHO.indexOf(c) * 21 + JUNG.indexOf(v)) * 28)
