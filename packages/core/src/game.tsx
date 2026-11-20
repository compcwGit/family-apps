// 놀이 공통: 맞았을 때·틀렸을 때 반응, 별, 안내 말하기 (여러 앱의 놀이 화면에서 같이 씀)
import { useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { speak } from './speech'
import { praise, cheer } from './talk'
import { createStore } from './storage'
import { splitSentences } from './talk'
import { ShellSlot } from './PlayShell'
import { Critter, type CritterKind } from './Critter'
import { SpeakerIcon, StarIcon } from './icons'
import { Emo, hasEmoji } from './Emo'

// 놀이 화면이 받는 값: 지금까지 모은 별(난이도 올리기용), 별 하나 더하기
export type GameProps = { stars: number; onStar: () => void }

// ok: 칭찬 + 별 + (잠시 뒤) 다음 판 / no: 살짝 흔들고 격려 (틀려도 벌점 없음)
export function useFeedback(onStar: () => void) {
  const [wrong, setWrong] = useState<string | null>(null)
  const [party, setParty] = useState(false)
  const [line, setLine] = useState('') // 칭찬 화면에 보일 말
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
    const text = `${praise()} ${say}`.trim()
    setLine(text)
    setParty(true)
    speak(text, 784)
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
  return { ok, no, wrong, party, line, busy: () => busy.current, later }
}

// 판이 바뀔 때마다 안내 말하기
export function useSay(text: string, deps: unknown[]) {
  useEffect(() => {
    const t = setTimeout(() => speak(text), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// 맞혔을 때 칭찬 화면: 햇살 + 큰 별 + 캐릭터 + 말풍선("딩동댕!" / 나머지 말) + 별 +1
const CHEER_CRITTERS: CritterKind[] = ['chick', 'cat', 'dog', 'rabbit', 'bear', 'pig']
const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180
  const p = (d: number) => `${(200 + 190 * Math.cos(a + d)).toFixed(0)} ${(200 + 190 * Math.sin(a + d)).toFixed(0)}`
  return `M200 200 L${p(-0.12)} L${p(0.12)} Z`
})
export function Party({ show, text = '' }: { show: boolean; text?: string }) {
  const [critter] = useState(() => CHEER_CRITTERS[Math.floor(Math.random() * CHEER_CRITTERS.length)])
  if (!show) return null
  const [big, ...rest] = splitSentences(text)
  return createPortal(
    <div className="g-party" role="status">
      <div className="g-party-burst">
        <svg className="g-party-rays" viewBox="0 0 400 400" aria-hidden="true">
          {RAYS.map((d) => (
            <path key={d} d={d} fill="#FFE59A" />
          ))}
        </svg>
        {hasEmoji('🌟') ? <span className="g-party-star"><Emo e="🌟" /></span> : <StarIcon size={220} />}
        <div className="g-party-critter">
          <Critter kind={critter} size={170} />
        </div>
        {big && (
          <div className="g-party-bubble">
            <span className="g-party-big">{big}</span>
            {rest.length > 0 && <span className="g-party-small">{rest.join(' ')}</span>}
          </div>
        )}
        <div className="g-party-plus">별 +1</div>
      </div>
    </div>,
    document.body,
  )
}

// 놀이 위쪽: 질문 말풍선(다시 듣기) + 모은 별. quiet: 글자만 비우고 말풍선·버튼 자리는 그대로(질문이 없는 화면). 화면 틀(PlayShell) 안이면 위 줄로 올라감
export function GameTop({ stars, onAgain, quiet, children }: { stars: number; onAgain?: () => void; quiet?: boolean; children?: ReactNode }) {
  const slot = useContext(ShellSlot)
  const top = (
    <div className="g-top">
      <div className="g-bubble">
        <span className="g-ask">{children}</span>
        {(onAgain || quiet) && (
          <button className="g-again" onClick={onAgain} aria-label="다시 듣기" disabled={quiet} style={quiet ? { visibility: 'hidden' } : undefined}>
            <SpeakerIcon />
          </button>
        )}
      </div>
      <span className="g-stars" aria-label={`모은 별 ${stars}개`}>
        {hasEmoji('⭐') ? <Emo e="⭐" /> : <StarIcon />} {stars}
      </span>
    </div>
  )
  return slot ? createPortal(top, slot) : top
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
