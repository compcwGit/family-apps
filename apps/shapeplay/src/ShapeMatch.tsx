import { useState } from 'react'
import { DragMatch, shuffle, type GameProps } from '@family/core'
import { SHAPES, ShapeIcon } from './shapes'
import { SAY } from './voice'

// 도형 맞추기: 조각을 같은 모양 구멍에 끌어다 놓기. 별 6개부터 4개씩
export function ShapeMatch({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(0)
  const [items] = useState(() => new Map<number, typeof SHAPES>())
  if (!items.has(round)) items.set(round, shuffle(SHAPES).slice(0, stars >= 6 ? 4 : 3))
  return (
    <DragMatch
      key={round}
      items={items.get(round)!.map((s) => ({ id: s.id, name: s.name, piece: <ShapeIcon shape={s} />, hole: <ShapeIcon shape={s} hole /> }))}
      prompt={SAY.shapeAsk}
      stars={stars}
      onStar={onStar}
      onNext={() => setRound((r) => r + 1)}
    />
  )
}
