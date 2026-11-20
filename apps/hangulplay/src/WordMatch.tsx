import { useState } from 'react'
import { DragMatch, shuffle, type GameProps, Emo } from '@family/core'
import { WORDS } from './words'
import { SAY } from './voice'

// 그림-낱말 짝 맞추기: 아래 낱말 카드를 위쪽 같은 그림에 끌어다 놓기 (공통 끌어다 맞추기 사용)
const pick3 = () => shuffle(WORDS).slice(0, 3)

export function WordMatch({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(0)
  const [words, setWords] = useState(pick3)
  return (
    <DragMatch
      key={round}
      prompt={SAY.matchAsk}
      stars={stars}
      onStar={onStar}
      onNext={() => {
        setWords(pick3())
        setRound(round + 1)
      }}
      items={words.map((x) => ({
        id: x.w,
        name: x.w,
        piece: <span className="word-chip">{x.w}</span>,
        hole: <span className="word-pic"><Emo e={x.e} /></span>,
      }))}
    />
  )
}
