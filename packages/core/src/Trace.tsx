// 따라 쓰기 공통: 초록 점에서 시작해 회색 길을 따라 그리기, 획 순서대로 하나씩 판정
// 한글 놀이(자모·숫자 따라 쓰기)와 숫자 놀이(숫자 따라 쓰기)에서 씀. 좌표는 100×100
import { useRef, useState } from 'react'

import { type Pt } from './strokes'
export { arc, DIGIT_STROKES, type Pt } from './strokes'

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

// 그리는 판. step = 지금 그릴 획 번호(부모가 관리). 한 획을 그리고 손을 떼면 onStroke(맞았는지)
export function TracePad({ strokes, step, onStart, onStroke }: {
  strokes: Pt[][]
  step: number
  onStart?: () => void
  onStroke: (ok: boolean) => void
}) {
  const [drawn, setDrawn] = useState<Pt[]>([])
  const svg = useRef<SVGSVGElement>(null)
  const drawing = useRef(false)
  const cur = strokes[step]

  const toPt = (e: React.PointerEvent): Pt => {
    // getScreenCTM 은 아이폰 Safari 에서 CSS 확대(transform) 안의 SVG 좌표가 어긋남 → 화면 위치·크기로 직접 계산
    // (테두리 안쪽이 viewBox 와 겹침. 확대 배율 k = 화면 폭 / 원래 폭)
    const el = svg.current!
    const r = el.getBoundingClientRect()
    const k = r.width / ((el.clientWidth + el.clientLeft * 2) || 1) // svg 에는 offsetWidth 가 없어서 clientWidth + 테두리로 원래 폭을 구함
    const w = el.clientWidth * k
    const h = el.clientHeight * k
    return [((e.clientX - r.left - el.clientLeft * k) / w) * 100, ((e.clientY - r.top - el.clientTop * k) / h) * 100]
  }
  const down = (e: React.PointerEvent) => {
    if (!cur) return
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    drawing.current = true
    setDrawn([toPt(e)])
    onStart?.()
  }
  const move = (e: React.PointerEvent) => {
    if (drawing.current) setDrawn((d) => [...d, toPt(e)])
  }
  const up = () => {
    if (!drawing.current) return
    drawing.current = false
    const ok = passed(cur, drawn)
    setDrawn([])
    onStroke(ok)
  }

  return (
    <svg ref={svg} className="trace-pad" viewBox="0 0 100 100" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      {/* 회색 길 */}
      {strokes.map((s, i) => (
        <polyline key={i} points={path(s)} className={i < step ? 'g-done' : 'g-todo'} />
      ))}
      {/* 지금 그릴 획: 점선 + 시작점 번호 */}
      {cur && (
        <>
          <polyline points={path(cur)} className="g-now" />
          <circle cx={cur[0][0]} cy={cur[0][1]} r="6" className="g-start" />
          <text x={cur[0][0]} y={cur[0][1] + 2.6} className="g-num">
            {step + 1}
          </text>
        </>
      )}
      {drawn.length > 1 && <polyline points={path(drawn)} className="g-ink" />}
    </svg>
  )
}
