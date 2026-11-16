import { useState } from 'react'
import { speak } from '@family/core'
import { readNumber, ROW_COLORS, type Mode } from './numbers'

// 100판: 1~100 을 10줄로 보여 주고, 누르면 읽어 줌
// 하나씩 세기에서 센 데까지는 진하게 표시
export function Board({ counted, mode }: { counted: number; mode: Mode }) {
  const [active, setActive] = useState(0)

  const tap = (v: number) => {
    speak(readNumber(v, mode))
    setActive(v)
    setTimeout(() => setActive(0), 400)
  }

  return (
    <div className="board">
      {Array.from({ length: 100 }, (_, i) => i + 1).map((v) => (
        <button
          key={v}
          className={'cell' + (v <= counted ? ' done' : '') + (active === v ? ' pop' : '')}
          style={{ background: ROW_COLORS[Math.floor((v - 1) / 10)] }}
          onClick={() => tap(v)}
        >
          {v}
        </button>
      ))}
    </div>
  )
}
