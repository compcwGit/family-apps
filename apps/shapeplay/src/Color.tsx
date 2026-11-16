import { useState } from 'react'
import { createStore, speak, playTone, praise, type GameProps } from '@family/core'

// 색칠 놀이: 색을 고르고 그림의 칸을 누르면 칠해짐. 칠한 그림은 기기 안에 저장
type Part = { el: 'path' | 'circle' | 'rect' | 'ellipse'; p: Record<string, number | string> }
const c = (cx: number, cy: number, r: number): Part => ({ el: 'circle', p: { cx, cy, r } })
const r = (x: number, y: number, width: number, height: number, rx = 4): Part => ({ el: 'rect', p: { x, y, width, height, rx } })
const e = (cx: number, cy: number, rx: number, ry: number, rot = 0): Part => ({
  el: 'ellipse',
  p: { cx, cy, rx, ry, transform: `rotate(${rot} ${cx} ${cy})` },
})
const d = (path: string): Part => ({ el: 'path', p: { d: path } })

const PICTURES: { id: string; name: string; icon: string; parts: Part[] }[] = [
  {
    id: 'house', name: '집', icon: '🏠',
    parts: [r(0, 172, 200, 28, 0), c(165, 32, 20), r(128, 42, 16, 36), r(40, 92, 120, 80, 2), d('M28 96 L100 34 L172 96 Z'),
      r(88, 126, 26, 46), r(54, 106, 24, 24), r(122, 106, 24, 24)],
  },
  {
    id: 'flower', name: '꽃', icon: '🌷',
    parts: [r(97, 92, 6, 70, 3), e(78, 130, 20, 8, -30), e(122, 125, 20, 8, 30),
      ...[0, 60, 120, 180, 240, 300].map((a) => c(100 + 27 * Math.cos((a * Math.PI) / 180), 66 + 27 * Math.sin((a * Math.PI) / 180), 17)),
      c(100, 66, 15), d('M66 158 L134 158 L122 196 L78 196 Z')],
  },
  {
    id: 'fish', name: '물고기', icon: '🐟',
    parts: [d('M148 100 L192 64 L192 136 Z'), d('M78 72 L100 40 L118 72 Z'), e(95, 102, 62, 38), e(105, 108, 14, 8, 30),
      c(62, 94, 8), c(30, 54, 9), c(42, 26, 6), d('M30 200 Q20 170 34 150 Q46 172 40 200 Z')],
  },
  {
    id: 'car', name: '자동차', icon: '🚗',
    parts: [d('M48 104 L70 60 L132 60 L158 104 Z'), r(18, 100, 166, 50, 14), d('M66 100 L79 68 L98 68 L98 100 Z'),
      d('M106 100 L106 68 L126 68 L146 100 Z'), c(56, 150, 21), c(146, 150, 21), r(170, 112, 12, 10, 3)],
  },
  {
    id: 'rocket', name: '로켓', icon: '🚀',
    parts: [d('M100 14 C128 40 132 80 128 140 L72 140 C68 80 72 40 100 14 Z'), c(100, 70, 14), d('M72 110 L46 150 L72 140 Z'),
      d('M128 110 L154 150 L128 140 Z'), d('M82 140 L118 140 L100 190 Z'), c(30, 40, 6), c(170, 60, 5), c(160, 18, 4)],
  },
]
const PALETTE = ['#EF5350', '#FF9800', '#FFEB3B', '#66BB6A', '#42A5F5', '#3F51B5', '#AB47BC', '#F48FB1', '#8D6E63', '#212121', '#FFFFFF']
const NAMES = ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라', '분홍', '갈색', '검정', '지우개']

const store = createStore<Record<string, string[]>>('shapeplay.paint', {})

export function Color({ stars, onStar }: GameProps) {
  const [pic, setPic] = useState(0)
  const [color, setColor] = useState(0)
  const [fills, setFills] = useState(store.get)
  const picture = PICTURES[pic]
  const mine = fills[picture.id] ?? []

  const paint = (i: number) => {
    const next = [...mine]
    next[i] = PALETTE[color]
    const all = { ...fills, [picture.id]: next }
    setFills(all)
    store.set(all)
    playTone(400 + color * 40)
    const wasDone = picture.parts.every((_, k) => mine[k] && mine[k] !== '#FFFFFF')
    const isDone = picture.parts.every((_, k) => next[k] && next[k] !== '#FFFFFF')
    if (isDone && !wasDone) {
      onStar()
      speak(`${praise()} 예쁜 ${picture.name} 완성!`, 784)
    }
  }
  const clear = () => {
    const all = { ...fills, [picture.id]: [] }
    setFills(all)
    store.set(all)
  }

  return (
    <div className="g-game">
      <div className="g-top">
        <div className="g-row color-pics">
          {PICTURES.map((p, i) => (
            <button key={p.id} className={'color-pic' + (i === pic ? ' on' : '')} onClick={() => setPic(i)}>
              {p.icon}
            </button>
          ))}
        </div>
        <span className="g-stars">⭐ {stars}</span>
      </div>
      <svg className="color-canvas" viewBox="0 0 200 200">
        {picture.parts.map((part, i) => {
          const El = part.el
          return <El key={i} {...part.p} fill={mine[i] ?? '#FFFFFF'} stroke="#5D4037" strokeWidth={2.5} strokeLinejoin="round" onClick={() => paint(i)} />
        })}
      </svg>
      <div className="g-row color-palette">
        {PALETTE.map((p, i) => (
          <button
            key={p}
            className={'color-chip' + (i === color ? ' on' : '')}
            style={{ background: p }}
            onClick={() => {
              setColor(i)
              speak(NAMES[i])
            }}
            aria-label={NAMES[i]}
          >
            {i === PALETTE.length - 1 ? '🧽' : ''}
          </button>
        ))}
        <button className="core-btn off" onClick={clear}>
          🗑️ 처음부터
        </button>
      </div>
    </div>
  )
}
