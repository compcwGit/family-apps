import { createStore } from '@family/core'

// 도장 기록: 태블릿 안에만 저장
export type Stamp = { id: string; reason: string; at: number }

export const REASONS = [
  { label: '정리정돈', emoji: '🧸' },
  { label: '양치하기', emoji: '🪥' },
  { label: '인사 잘하기', emoji: '🙇' },
  { label: '밥 잘 먹기', emoji: '🍚' },
  { label: '동생 돌보기', emoji: '🤝' },
  { label: '심부름', emoji: '🛒' },
]

export const BOARD_SIZE = 10

const store = createStore<Stamp[]>('stampplay.stamps', [])

export const loadStamps = () => store.get()

export function addStamp(reason: string): Stamp[] {
  const next = [...store.get(), { id: crypto.randomUUID(), reason, at: Date.now() }]
  store.set(next)
  return next
}

export function removeStamp(id: string): Stamp[] {
  const next = store.get().filter((s) => s.id !== id)
  store.set(next)
  return next
}

export const emojiOf = (reason: string) => REASONS.find((r) => r.label === reason)?.emoji ?? '⭐'
