import { useState } from 'react'
import { DragMatch, shuffle, type GameProps } from '@family/core'
import { ANIMALS } from './animals'
import { SAY } from './voice'

// 그림자 맞추기: 동물을 같은 모양 그림자에 끌어다 놓기. 별 6개부터 4마리씩
export function Shadow({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(0)
  const [rounds] = useState(() => new Map<number, typeof ANIMALS>())
  if (!rounds.has(round)) rounds.set(round, shuffle(ANIMALS).slice(0, stars >= 6 ? 4 : 3))
  return (
    <DragMatch
      key={round}
      items={rounds.get(round)!.map((a) => ({
        id: a.name,
        name: a.name,
        piece: <span className="g-emoji">{a.emoji}</span>,
        hole: <span className="g-emoji g-shadow">{a.emoji}</span>,
      }))}
      prompt={SAY.shadow}
      stars={stars}
      onStar={onStar}
      onNext={() => setRound((r) => r + 1)}
    />
  )
}
