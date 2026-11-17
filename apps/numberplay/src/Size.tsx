import { useState } from 'react'
import { Critter, useFeedback, useSay, Party, GameTop, speak, shuffle, pick, type GameProps } from '@family/core'
import { SAY, SIZE_THINGS as THINGS } from './voice'

// 크기 순서: 작은 것부터(또는 큰 것부터) 차례로 눌러서 줄 세우기. 판마다 방향을 바꿈. 별 6개부터 4개, 12개부터 5개
const SIZES = [64, 92, 120, 150, 180] // px

function makeRound(k: number, n: number) {
  return { thing: pick(THINGS), big: n % 2 === 1, order: shuffle(SIZES.slice(0, k).map((_, i) => i)) }
}

export function Size({ stars, onStar }: GameProps) {
  const k = stars >= 12 ? 5 : stars >= 6 ? 4 : 3
  const [n, setN] = useState(0)
  const [round, setRound] = useState(() => makeRound(k, 0))
  const [line, setLine] = useState<number[]>([]) // 줄 선 것 (크기 번호)
  const fb = useFeedback(onStar)
  const ask = SAY.sizeAsk(round.big, round.thing.n)
  useSay(ask, [round])

  // 다음에 눌러야 할 크기 번호 (0 = 제일 작음)
  const want = round.big ? round.order.length - 1 - line.length : line.length
  const tap = (s: number) => {
    if (line.includes(s) || fb.busy()) return
    if (s !== want) return fb.no(String(s), SAY.sizeNo(round.big, round.thing.n))
    const l = [...line, s]
    setLine(l)
    if (l.length === round.order.length)
      fb.ok(SAY.sizeOk(round.big), () => {
        setN(n + 1)
        setRound(makeRound(k, n + 1))
        setLine([])
      })
    else speak(SAY.sizeStep(l.length), 523 + l.length * 60)
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        {ask}
      </GameTop>
      <div className="size-field">
        {round.order.map((s) => (
          <button
            key={s}
            className={'size-item' + (line.includes(s) ? ' gone' : '') + (fb.wrong === String(s) ? ' g-shake' : '')}
            onClick={() => tap(s)}
            aria-label={`${round.thing.n} ${s + 1}`}
          >
            <Critter kind={round.thing.k} size={SIZES[s]} />
          </button>
        ))}
      </div>
      <div className="size-line">
        {line.map((s, i) => (
          <div key={s} className="size-slot">
            <Critter kind={round.thing.k} size={SIZES[s] * 0.6} />
            <b>{i + 1}</b>
          </div>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
