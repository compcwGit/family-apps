import { useRef, useState } from 'react'
import { playTone, speak } from '@family/core'
import { ALL_JAMO, NUMBERS, type Pt } from './hangul'

// 따라쓰기: 초록 점에서 시작해 회색 길을 따라 그리기. 획 순서대로 하나씩.
const near = 13 // 허용 거리 (100×100 기준)

const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1])

// 획을 촘촘한 점으로 나눔 (판정용)
function samples(stroke: Pt[]): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < stroke.length - 1; i++) {
    const [a, b] = [stroke[i], stroke[i + 1]]
    const n = Math.max(1, Math.ceil(dist(a, b) / 3))
    for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
  }
  out.push(stroke[stroke.length - 1])
  return out
}

// 시작점 근처에서 시작 + 길의 80% 이상을 지나감 + 그린 선이 길에서 크게 벗어나지 않음
function passed(stroke: Pt[], drawn: Pt[]) {
  if (drawn.length < 3 || dist(drawn[0], stroke[0]) > near * 1.5) return false
  const guide = samples(stroke)
  const covered = guide.filter((g) => drawn.some((d) => dist(g, d) < near)).length / guide.length
  const onPath = drawn.filter((d) => guide.some((g) => dist(g, d) < near * 1.3)).length / drawn.length
  return covered >= 0.8 && onPath >= 0.75
}

const path = (pts: Pt[]) => pts.map((p) => p.join(',')).join(' ')

export type NumRead = 'native' | 'sino' // 하나·둘 / 일·이

export function Trace({ done, onDone, numRead }: { done: string[]; onDone: (ch: string) => void; numRead: NumRead }) {
  const [set, setSet] = useState<'h' | 'n'>('h') // 한글 / 숫자
  const [idx, setIdx] = useState(0)
  const [step, setStep] = useState(0) // 지금 그릴 획 번호
  const [drawn, setDrawn] = useState<Pt[]>([])
  const [msg, setMsg] = useState('')
  const svg = useRef<SVGSVGElement>(null)
  const drawing = useRef(false)

  const list = set === 'h' ? ALL_JAMO : NUMBERS
  const j = list[idx]
  const finished = step >= j.strokes.length
  const label = set === 'n' && numRead === 'native' ? j.word : j.name // 숫자 읽는 소리

  const go = (i: number) => {
    setIdx((i + list.length) % list.length)
    setStep(0)
    setDrawn([])
    setMsg('')
  }

  const toPt = (e: React.PointerEvent): Pt => {
    const m = svg.current!.getScreenCTM()!.inverse()
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m)
    return [p.x, p.y]
  }

  const down = (e: React.PointerEvent) => {
    if (finished) return
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    drawing.current = true
    setDrawn([toPt(e)])
    setMsg('')
  }
  const move = (e: React.PointerEvent) => {
    if (drawing.current) setDrawn((d) => [...d, toPt(e)])
  }
  const up = () => {
    if (!drawing.current) return
    drawing.current = false
    if (passed(j.strokes[step], drawn)) {
      const next = step + 1
      setStep(next)
      setDrawn([])
      if (next >= j.strokes.length) {
        speak(`잘했어요! ${label}!`)
        setMsg('잘했어요! ⭐')
        onDone(j.ch)
      } else playTone(660)
    } else {
      setDrawn([])
      setMsg('초록 점에서 다시 해 볼까?')
      playTone(220)
    }
  }

  const cur = j.strokes[step]

  return (
    <div className="board">
      <div className="seg">
        {(['h', 'n'] as const).map((s) => (
          <button
            key={s}
            className={set === s ? 'seg-btn on' : 'seg-btn'}
            onClick={() => {
              setSet(s)
              setIdx(0)
              setStep(0)
              setDrawn([])
              setMsg('')
            }}
          >
            {s === 'h' ? '한글 ㄱㅏ' : '숫자 123'}
          </button>
        ))}
      </div>
      <div className="trace-top">
        <button className="arrow" onClick={() => go(idx - 1)} aria-label="이전">◀</button>
        <button className="trace-title" onClick={() => speak(label)}>
          {j.ch} <small>{label}</small> {done.includes(j.ch) && '⭐'}
        </button>
        <button className="arrow" onClick={() => go(idx + 1)} aria-label="다음">▶</button>
      </div>

      <svg
        ref={svg}
        className="trace-pad"
        viewBox="0 0 100 100"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {/* 회색 길 */}
        {j.strokes.map((s, i) => (
          <polyline key={i} points={path(s)} className={i < step ? 'g-done' : 'g-todo'} />
        ))}
        {/* 지금 그릴 획: 점선 + 시작점 번호 */}
        {cur && (
          <>
            <polyline points={path(cur)} className="g-now" />
            <circle cx={cur[0][0]} cy={cur[0][1]} r="6" className="g-start" />
            <text x={cur[0][0]} y={cur[0][1] + 2.6} className="g-num">{step + 1}</text>
          </>
        )}
        {drawn.length > 1 && <polyline points={path(drawn)} className="g-ink" />}
      </svg>

      <p className="trace-msg">{msg || (finished ? '' : `${step + 1}번 획을 그려요`)}</p>
      {finished && (
        <div className="trace-actions">
          <button className="core-btn" onClick={() => go(idx)}>다시 쓰기</button>
          <button className="core-btn" onClick={() => go(idx + 1)}>다음 글자 ▶</button>
        </div>
      )}
    </div>
  )
}
