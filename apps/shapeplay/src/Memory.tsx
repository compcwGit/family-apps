import { useEffect, useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, pick, type GameProps } from '@family/core'
import { SAY, MEMORY_PICS } from './voice'

// 카드 뒤집기 짝 맞추기: 뒤집힌 카드에서 같은 그림 두 장 찾기. 별 3개부터 4쌍, 8개부터 6쌍
function makeDeck(pairs: number) {
  return shuffle(shuffle(MEMORY_PICS).slice(0, pairs).flatMap((e) => [e, e])).map((e, i) => ({ id: i, e }))
}

export function Memory({ stars, onStar }: GameProps) {
  const pairs = stars >= 8 ? 6 : stars >= 3 ? 4 : 3
  const [deck, setDeck] = useState(() => makeDeck(pairs))
  const [open, setOpen] = useState<number[]>([]) // 지금 뒤집은 카드 (최대 2장)
  const [found, setFound] = useState<number[]>([])
  const fb = useFeedback(onStar)
  useSay(SAY.memoryAsk, [deck])

  // 두 장이 다르면 잠깐 보여 준 뒤 다시 덮기
  useEffect(() => {
    if (open.length !== 2) return
    const [a, b] = open.map((i) => deck[i])
    if (a.e === b.e) {
      const next = [...found, a.id, b.id]
      setFound(next)
      setOpen([])
      if (next.length === deck.length) fb.ok(SAY.memoryOk, () => {
        setDeck(makeDeck(pairs))
        setFound([])
      })
      else speak(pick(SAY.sortIn), 659)
      return
    }
    const t = setTimeout(() => setOpen([]), 900)
    return () => clearTimeout(t)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const flip = (i: number) => {
    if (open.length >= 2 || open.includes(i) || found.includes(i)) return
    setOpen([...open, i])
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(SAY.memoryAsk)}>
        같은 그림 두 장을 찾아요
      </GameTop>
      <div className={'mem-grid mem-' + deck.length}>
        {deck.map((c, i) => {
          const up = open.includes(i) || found.includes(i)
          return (
            <button key={c.id} className={'mem-card' + (up ? ' up' : '') + (found.includes(i) ? ' found' : '')} onClick={() => flip(i)} aria-label={up ? c.e : '뒤집힌 카드'}>
              <span className="mem-inner">
                <span className="mem-back">?</span>
                <span className="mem-front">{c.e}</span>
              </span>
            </button>
          )
        })}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
