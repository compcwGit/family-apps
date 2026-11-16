import { createStore } from '@family/core'

// 도장 기록: 태블릿 안에만 저장
// emoji: 찍을 때의 도장 그림을 함께 저장 (도장 종류를 지워도 기록은 그대로). '' = 참 잘했어요 도장
export type Stamp = { id: string; reason: string; at: number; emoji?: string }

// 칭찬도장 종류: 부모가 직접 만들고 지울 수 있음. emoji '' = 기본 "참 잘했어요" 도장
export type Reason = { label: string; emoji: string }

export const ICONS = ['', '⭐', '❤️', '🌈', '🧸', '🪥', '🙇', '🍚', '🤝', '🛒', '📚', '🎨', '🚿', '🛏️', '🧹', '💪', '😊', '🌱']

export const REASONS: Reason[] = [
  { label: '정리정돈', emoji: '🧸' },
  { label: '양치하기', emoji: '🪥' },
  { label: '인사 잘하기', emoji: '🙇' },
  { label: '밥 잘 먹기', emoji: '🍚' },
  { label: '동생 돌보기', emoji: '🤝' },
  { label: '심부름', emoji: '🛒' },
]

export const BOARD_SIZE = 10 // 약속을 정하지 않은 도장판의 칸 수
export const MAX_TARGET = 30

// 약속: 도장판 하나마다 "몇 개 모으면 무엇". plans[i] = i+1번째 도장판의 약속
// 정하지 않은 다음 도장판은 마지막 약속을 그대로 이어서 씀
export type Plan = { target: number; reward: string }
export type Board = { no: number; plan: Plan; stamps: Stamp[]; done: boolean }
const DEFAULT_PLAN: Plan = { target: BOARD_SIZE, reward: '' }

const store = createStore<Stamp[]>('stampplay.stamps', [])
const reasonStore = createStore<Reason[]>('stampplay.reasons', REASONS)

export const loadReasons = () => reasonStore.get()
export function saveReasons(list: Reason[]): Reason[] {
  reasonStore.set(list)
  return list
}
const planStore = createStore<Plan[]>('stampplay.plans', [])

export const loadPlans = () => planStore.get()

// 도장 기록을 약속 순서대로 도장판에 나눔. 마지막 원소가 지금 도장판
export function boardsOf(stamps: Stamp[], plans: Plan[]): Board[] {
  const boards: Board[] = []
  let i = 0
  do {
    const b = boards.length
    const plan = plans[b] ?? plans[plans.length - 1] ?? DEFAULT_PLAN
    const part = stamps.slice(i, i + plan.target)
    boards.push({ no: b + 1, plan, stamps: part, done: part.length === plan.target })
    i += plan.target
  } while (i < stamps.length)
  return boards
}

// 지금 도장판(다 찼으면 다음 도장판)의 약속을 바꿈
export function setPlan(stamps: Stamp[], plan: Plan): Plan[] {
  const boards = boardsOf(stamps, planStore.get())
  const last = boards[boards.length - 1]
  const idx = last.done ? last.no : last.no - 1
  const next = boards.slice(0, idx).map((b) => b.plan)
  next[idx] = plan
  planStore.set(next)
  return next
}

export function nextPlanOf(stamps: Stamp[], plans: Plan[]): Plan {
  const last = boardsOf(stamps, plans).at(-1)!
  return last.done ? plans[last.no] ?? last.plan : last.plan
}

export const loadStamps = () => store.get()

export function addStamp(r: Reason): Stamp[] {
  const next = [...store.get(), { id: crypto.randomUUID(), reason: r.label, at: Date.now(), emoji: r.emoji }]
  store.set(next)
  return next
}

export function removeStamp(id: string): Stamp[] {
  const next = store.get().filter((s) => s.id !== id)
  store.set(next)
  return next
}

// 예전 기록(emoji 없음)은 기본 목록에서 찾음
export const iconOf = (s: Stamp) => s.emoji ?? REASONS.find((r) => r.label === s.reason)?.emoji ?? ''

export const stampTime = (at: number) =>
  new Date(at).toLocaleString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short', hour: 'numeric', minute: '2-digit' })
