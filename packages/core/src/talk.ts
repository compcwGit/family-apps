// 친근한 말투 공통: 받침에 맞는 조사, 칭찬·격려를 매번 다르게
export const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)]

export const hasBatchim = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  return code >= 0 && code < 11172 && code % 28 !== 0
}
// 강아지는/닭은, 강아지예요/닭이에요, 강아지를/닭을, 강아지가/닭이
export const eun = (w: string) => w + (hasBatchim(w) ? '은' : '는')
export const ieyo = (w: string) => w + (hasBatchim(w) ? '이에요' : '예요')
export const eul = (w: string) => w + (hasBatchim(w) ? '을' : '를')
export const iga = (w: string) => w + (hasBatchim(w) ? '이' : '가')

export const PRAISES = ['우와, 잘했어요!', '최고예요!', '딩동댕!', '참 잘했어요!', '와, 대단해요!'] as const
export const CHEERS = ['괜찮아, 다시 해 보자!', '음, 다시 생각해 볼까?', '천천히 해 보자!'] as const
export const praise = () => pick(PRAISES)
export const cheer = () => pick(CHEERS)

export const shuffle = <T,>(list: readonly T[]) => [...list].sort(() => Math.random() - 0.5)

// 문장 나누기: "우와, 잘했어요! 모두 맞췄어요!" → ["우와, 잘했어요!", "모두 맞췄어요!"]
// 녹음 파일은 문장 단위로 만들고, 재생할 때도 같은 규칙으로 나눠서 이어 붙임 (speech.ts, voicelist.ts)
export const splitSentences = (text: string) =>
  text
    .split(/(?<=[!?.])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

// 끌어다 맞추기(core/DragMatch) 말
export const MATCH = {
  all: '모두 맞췄어요!',
  name: (n: string) => `${n}!`,
  placed: (n: string) => `${ieyo(n)}! 딱 맞아요!`,
  wrong: (n: string) => `${eun(n)} 거기가 아니에요. 다시 해 볼까?`,
}
