// 놀이 공통: 맞았을 때·틀렸을 때 반응, 별, 안내 말하기 (여러 앱의 놀이 화면에서 같이 씀)
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { speak } from './speech'
import { praise, cheer } from './talk'
import { createStore } from './storage'

// 놀이 화면이 받는 값: 지금까지 모은 별(난이도 올리기용), 별 하나 더하기
export type GameProps = { stars: number; onStar: () => void }

// ok: 칭찬 + 별 + (잠시 뒤) 다음 판 / no: 살짝 흔들고 격려 (틀려도 벌점 없음)
export function useFeedback(onStar: () => void) {
  const [wrong, setWrong] = useState<string | null>(null)
  const [party, setParty] = useState(false)
  const busy = useRef(false)
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const ok = (say = '', next?: () => void, delay = 2200) => {
    if (busy.current) return
    busy.current = true
    onStar()
    setParty(true)
    speak(`${praise()} ${say}`.trim(), 784)
    later(() => {
      setParty(false)
      busy.current = false
      next?.()
    }, delay)
  }
  const no = (id: string, say?: string) => {
    if (busy.current) return
    setWrong(id)
    speak(say ?? cheer(), 220)
    later(() => setWrong(null), 600)
  }
  return { ok, no, wrong, party, busy: () => busy.current, later }
}

// 판이 바뀔 때마다 안내 말하기
export function useSay(text: string, deps: unknown[]) {
  useEffect(() => {
    const t = setTimeout(() => speak(text), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// 별 터지는 효과
export function Party({ show }: { show: boolean }) {
  return show ? <div className="g-party">⭐</div> : null
}

// 놀이 위쪽 줄: 다시 듣기 + 모은 별
export function GameTop({ stars, onAgain, children }: { stars: number; onAgain?: () => void; children?: ReactNode }) {
  return (
    <div className="g-top">
      {onAgain && (
        <button className="core-btn g-again" onClick={onAgain} aria-label="다시 듣기">
          🔊
        </button>
      )}
      <div className="g-ask">{children}</div>
      <span className="g-stars">⭐ {stars}</span>
    </div>
  )
}

// 놀이별 별 개수 (기기 안에만 저장). key 예: 'shapeplay.stars'
export function useStars(key: string) {
  const store = useRef(createStore<Record<string, number>>(key, {})).current
  const [all, setAll] = useState(store.get)
  const add = (id: string) =>
    setAll((prev) => {
      const next = { ...prev, [id]: (prev[id] ?? 0) + 1 }
      store.set(next)
      return next
    })
  const reset = () => {
    setAll({})
    store.set({})
  }
  return { of: (id: string) => all[id] ?? 0, add, reset, total: Object.values(all).reduce((a, b) => a + b, 0) }
}
