import { useRef, useState } from 'react'
import { useDrag, useFeedback, Party, GameTop, speak, pick, shuffle, type GameProps } from '@family/core'
import { PUZZLES, shapeKey, bounds, type Piece } from './tangram-puzzles'
import { SAY } from './voice'

// 칠교놀이: 칠교 조각을 그림자(도안) 자리에 끌어다 놓아 모양 만들기. 다 채우면 다음 도안
const U = 60 // 1칸 = 60px (도안과 조각을 같은 크기로)
const pts = (p: Piece, dx = 0, dy = 0) => p.pts.map(([x, y]) => `${(x - dx) * U},${(y - dy) * U}`).join(' ')

export function Tangram({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(0)
  return <Board key={round} puzzle={PUZZLES[round % PUZZLES.length]} stars={stars} onStar={onStar} onNext={() => setRound((r) => r + 1)} />
}

function Board({ puzzle, stars, onStar, onNext }: GameProps & { puzzle: (typeof PUZZLES)[number]; onNext: () => void }) {
  const [placed, setPlaced] = useState<Record<string, string>>({}) // 자리 id → 놓인 조각 id
  const [order] = useState(() => shuffle(puzzle.pieces.map((p) => p.id)))
  const fb = useFeedback(onStar)
  const byId = (id: string) => puzzle.pieces.find((p) => p.id === id)!
  const used = Object.values(placed)
  const ask = SAY.tangramAsk(puzzle.name)

  const board = useRef<SVGSVGElement>(null)
  // 맞는 자리: 비어 있고 모양·방향이 같은 자리. 손가락이 그 자리 위면 바로, 아니면 조각이 자리 근처(1칸 안)면 맞음
  const drag = useDrag((id, drop, rect) => {
    const fits = (s: Piece) => !placed[s.id] && shapeKey(s.pts) === shapeKey(byId(id).pts)
    let slot = drop && drop !== 'board' && fits(byId(drop)) ? drop : null
    if (!slot && board.current) {
      const c = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2).matrixTransform(board.current.getScreenCTM()!.inverse())
      const near = puzzle.pieces
        .filter(fits)
        .map((s) => {
          const b = bounds(s.pts)
          return { id: s.id, d: Math.hypot(b.x + b.w / 2 - c.x / U, b.y + b.h / 2 - c.y / U) }
        })
        .sort((a, b) => a.d - b.d)[0]
      if (near && near.d < 1) slot = near.id
    }
    if (slot) {
      const next = { ...placed, [slot]: id }
      setPlaced(next)
      if (Object.keys(next).length === puzzle.pieces.length) fb.ok(SAY.tangramDone(puzzle.name), onNext)
      else speak(pick(SAY.sortIn), 659)
    } else if (drop) fb.no(id, SAY.tangramNo) // 도안 위에 놓았는데 틀림 (도안 밖이면 그냥 제자리로)
  })

  const all = bounds(puzzle.pieces.flatMap((p) => p.pts))
  const pad = 0.3
  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        {ask}
      </GameTop>
      <svg
        ref={board}
        data-drop="board"
        className="tg-board"
        viewBox={`${(all.x - pad) * U} ${(all.y - pad) * U} ${(all.w + pad * 2) * U} ${(all.h + pad * 2) * U}`}
        style={{ width: (all.w + pad * 2) * U }}
        role="img"
        aria-label={`${puzzle.name} 칠교 도안`}
      >
        {puzzle.pieces.map((slot) => {
          const p = placed[slot.id] ? byId(placed[slot.id]) : null
          return (
            <polygon
              key={slot.id}
              data-drop={slot.id}
              points={pts(slot)}
              className={p ? 'tg-slot filled' : 'tg-slot'}
              style={p ? { fill: p.color } : undefined}
            />
          )
        })}
      </svg>
      <div className="g-line" />
      <div className="g-row g-tray tg-tray">
        {order.map((id) => {
          const p = byId(id)
          const b = bounds(p.pts)
          if (used.includes(id)) return <div key={id} className="tg-piece" style={{ width: b.w * U, height: b.h * U }} />
          return (
            <div
              key={id}
              className={'tg-piece' + (fb.wrong === id ? ' g-shake' : '')}
              {...drag.handle(id)}
              style={{ ...drag.style(id), width: b.w * U, height: b.h * U }}
            >
              <svg viewBox={`-3 -3 ${b.w * U + 6} ${b.h * U + 6}`} width={b.w * U} height={b.h * U}>
                <polygon points={pts(p, b.x, b.y)} fill={p.color} className="tg-shape" />
              </svg>
            </div>
          )
        })}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
