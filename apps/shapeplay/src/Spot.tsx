import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, pick, type GameProps, Emo } from '@family/core'
import { SPOT_SETS, SAY } from './voice'

// 다른 그림 찾기: 왼쪽·오른쪽 그림판에서 다른 곳을 오른쪽에서 찾아 누르기. 별 3개부터 3군데
function makeRound(k: number) {
  const set = pick(SPOT_SETS)
  const left = Array.from({ length: 9 }, () => pick(set))
  const right = [...left]
  const diff = shuffle(Array.from({ length: 9 }, (_, i) => i)).slice(0, k)
  for (const i of diff) right[i] = pick(set.filter((e) => e !== left[i]))
  return { left, right, diff }
}

export function Spot({ stars, onStar }: GameProps) {
  const k = stars >= 3 ? 3 : 2
  const [round, setRound] = useState(() => makeRound(k))
  const [found, setFound] = useState<number[]>([])
  const fb = useFeedback(onStar)
  useSay(SAY.spotAsk(k), [round])

  const tap = (i: number) => {
    if (found.includes(i)) return
    if (!round.diff.includes(i)) return fb.no(`s${i}`, SAY.spotNo)
    const next = [...found, i]
    setFound(next)
    if (next.length < round.diff.length) return speak(SAY.spotFound(next.length), 659)
    fb.ok(SAY.spotOk, () => {
      setRound(makeRound(k))
      setFound([])
    })
  }

  const grid = (cells: string[], side: 'l' | 'r') => (
    <div className={'spot-grid ' + side}>
      {cells.map((e, i) => (
        <button
          key={i}
          className={'spot-cell' + (found.includes(i) ? ' found' : '') + (side === 'r' && fb.wrong === `s${i}` ? ' g-shake' : '')}
          onClick={() => tap(i)}
        >
          <Emo e={e} />
        </button>
      ))}
    </div>
  )
  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(SAY.spotAsk(k))}>
        다른 곳 {k}군데를 찾아요 ({found.length}/{k})
      </GameTop>
      <div className="spot-wrap">
        {grid(round.left, 'l')}
        {grid(round.right, 'r')}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
