// 친근한 말투: 칭찬·격려를 매번 다르게, "기역이에요" 처럼 받침에 맞춰 말하기
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

// 마지막 글자에 받침이 있으면 '이에요', 없으면 '예요'
export function iEyo(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  const hasBatchim = code >= 0 && code < 11172 && code % 28 !== 0
  return word + (hasBatchim ? '이에요' : '예요')
}

export const praise = () => pick(['우와, 잘했어요!', '최고예요!', '멋지게 썼어요!', '참 잘했어요!', '와, 대단해요!'])
export const cheer = () => pick(['괜찮아, 다시 해 보자!', '초록 점에서 시작해 볼까?', '천천히 따라가 보자!'])
