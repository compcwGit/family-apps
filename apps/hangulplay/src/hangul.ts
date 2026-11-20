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

// 쌍자음·이중모음 카드 (ㄱㄴㄷ 화면의 세 번째 묶음). 따라쓰기는 없음
const D = (ch: string, name: string, word: string, emoji: string, color: string): Jamo => ({ ch, name, word, emoji, color, strokes: [] })
export const DOUBLES: Jamo[] = [
  D('ㄲ', '쌍기역', '꽃', '🌸', '#FFCDD2'), D('ㄸ', '쌍디귿', '딸기', '🍓', '#F8BBD0'), D('ㅃ', '쌍비읍', '빵', '🍞', '#E1BEE7'),
  D('ㅆ', '쌍시옷', '씨앗', '🌱', '#D1C4E9'), D('ㅉ', '쌍지읒', '짹짹', '🐤', '#C5CAE9'),
  D('ㅐ', '애', '개', '🐶', '#BBDEFB'), D('ㅔ', '에', '게', '🦀', '#B3E5FC'), D('ㅘ', '와', '과자', '🍪', '#B2EBF2'),
  D('ㅙ', '왜', '돼지', '🐷', '#B2DFDB'), D('ㅚ', '외', '외계인', '👽', '#C8E6C9'), D('ㅝ', '워', '원숭이', '🐵', '#DCEDC8'),
  D('ㅟ', '위', '쥐', '🐭', '#F0F4C3'), D('ㅢ', '의', '의자', '🪑', '#FFF9C4'), D('ㅖ', '예', '시계', '⏰', '#FFE0B2'),
]

// 호(곡선): 각도는 도(°), 0° = 오른쪽, 각도가 커지면 화면에서 시계 방향
const arc = (cx: number, cy: number, rx: number, ry: number, from: number, to: number): Pt[] => {
  const n = Math.max(2, Math.round(Math.abs(to - from) / 15))
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / n) * Math.PI) / 180
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt
  })
}

// 숫자 0~9 따라쓰기 (흔히 쓰는 획 순서)
const NUM_COLOR = ['#FFCDD2', '#F8BBD0', '#E1BEE7', '#C5CAE9', '#BBDEFB', '#B2EBF2', '#C8E6C9', '#F0F4C3', '#FFE0B2', '#D7CCC8']
const NUM_NAME = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
const NUM_WORD = ['영', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉']
const NUM_STROKES: Pt[][][] = [
  [arc(50, 50, 22, 32, -90, -450)], // 0: 위에서 시작해 왼쪽으로 한 바퀴
  [[[40, 27], [50, 18], [50, 82]]], // 1
  [[...arc(50, 36, 19, 17, 180, 360), [32, 82], [72, 82]]], // 2
  [[...arc(48, 34, 17, 15, -150, 90), ...arc(48, 66, 19, 17, -90, 150)]], // 3
  [[[56, 18], [28, 62], [76, 62]], [[60, 36], [60, 85]]], // 4: ㄴ자 → 세로
  [[[37, 20], [35, 46], ...arc(48, 62, 20, 19, -128, 150)], [[37, 20], [68, 20]]], // 5: 세로·곡선 → 윗줄
  [[[62, 18], [42, 38], ...arc(50, 64, 18, 18, 180, -180)]], // 6
  [[[30, 20], [70, 20], [42, 84]]], // 7
  [[...arc(50, 33, 15, 15, -45, -270), ...arc(50, 66, 18, 18, -90, 270), ...arc(50, 33, 15, 15, 90, -45)]], // 8
  [[...arc(50, 36, 17, 17, 0, -360), [64, 84]]], // 9
]
export const NUMBERS: Jamo[] = NUM_STROKES.map((strokes, n) => ({
  ch: String(n), name: NUM_NAME[n], word: NUM_WORD[n], emoji: '', color: NUM_COLOR[n], strokes,
}))

// 자음 + 모음 (+ 받침) → 글자 (유니코드: 가 + (초성×21 + 중성)×28 + 종성)
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'
const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'
const JONG = ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ' // 0번 = 받침 없음
export const compose = (c: string, v: string, b = '') =>
  String.fromCharCode(0xac00 + (CHO.indexOf(c) * 21 + JUNG.indexOf(v)) * 28 + (b ? JONG.indexOf(b) : 0))
