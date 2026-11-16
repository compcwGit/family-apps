// 1~100 을 한국어로 읽는 말 (데이터 파일 없이 계산)
// native: 하나, 둘 … 아흔아홉, 백   /   sino: 일, 이 … 구십구, 백
export type Mode = 'native' | 'sino'

const NATIVE_ONES = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉']
const NATIVE_TENS = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔']
const SINO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']

export function readNumber(n: number, mode: Mode): string {
  if (n === 100) return '백'
  const t = Math.floor(n / 10)
  const o = n % 10
  if (mode === 'native') return NATIVE_TENS[t] + NATIVE_ONES[o]
  return (t === 0 ? '' : (t === 1 ? '' : SINO[t]) + '십') + SINO[o]
}

// 10 단위마다 색을 바꿔서 줄을 구분하기 쉽게
export const ROW_COLORS = [
  '#FFCDD2', '#FFE0B2', '#FFF9C4', '#DCEDC8', '#C8E6C9',
  '#B2EBF2', '#BBDEFB', '#D1C4E9', '#F8BBD0', '#D7CCC8',
]
