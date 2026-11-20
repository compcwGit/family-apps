// 친근한 말투: 칭찬·격려를 매번 다르게, "기역이에요" 처럼 받침에 맞춰 말하기
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

// 마지막 글자에 받침이 있으면 '이에요', 없으면 '예요'
export function iEyo(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  const hasBatchim = code >= 0 && code < 11172 && code % 28 !== 0
  return word + (hasBatchim ? '이에요' : '예요')
}

// 음성 파일 목록(src/voice.ts)도 이 문장들을 그대로 씀
export const PRAISES = ['우와, 잘했어요!', '최고예요!', '멋지게 썼어요!', '참 잘했어요!', '와, 대단해요!']
export const CHEERS = ['괜찮아, 다시 해 보자!', '초록 점에서 시작해 볼까?', '천천히 따라가 보자!']
export const SAMPLE = '안녕! 같이 한글 놀이 하자!'
export const praise = () => pick(PRAISES)
export const cheer = () => pick(CHEERS)

// 자모 카드: 자음(기역)은 "기역이에요. 기차의 기!", 모음(아)은 "아! 아기의 아!"
export function jamoLine(j: { name: string; word: string }) {
  const intro = j.name.length > 1 ? `${iEyo(j.name)}.` : `${j.name}!`
  // 한 글자 낱말(꽃·빵·게)은 "꽃!"만
  return `${intro} ${j.word.length > 1 ? `${j.word}의 ${j.word[0]}` : j.word}!`
}
