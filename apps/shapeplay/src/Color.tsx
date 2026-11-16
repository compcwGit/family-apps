import { useState } from 'react'
import { createStore, speak, playTone, praise, type GameProps } from '@family/core'
import { PICTURES, PALETTE, NAMES } from './pictures'
import { SAY } from './voice'

// 색칠 놀이: 색을 고르고 그림의 칸을 누르면 칠해짐. 칠한 그림은 기기 안에 저장
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
      speak(SAY.colorDone(praise(), picture.name), 784)
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
              speak(SAY.colorName(NAMES[i]))
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
