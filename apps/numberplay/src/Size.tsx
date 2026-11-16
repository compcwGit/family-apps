import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, pick, type GameProps } from '@family/core'
import { SAY, SIZE_THINGS as THINGS } from './voice'

// 크기 순서: 작은 것부터(또는 큰 것부터) 차례로 눌러서 줄 세우기. 판마다 방향을 바꿈. 별 6개부터 4개, 12개부터 5개
const SIZES = [3, 4.4, 5.8, 7.2, 8.6] // rem

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
        {round.big ? '큰 것부터 ⬇️' : '작은 것부터 ⬆️'}
      </GameTop>
      <div className="size-field">
        {round.order.map((s) => (
          <button
            key={s}
            className={'size-item' + (line.includes(s) ? ' gone' : '') + (fb.wrong === String(s) ? ' g-shake' : '')}
            style={{ fontSize: `${SIZES[s]}rem` }}
            onClick={() => tap(s)}
          >
            {round.thing.e}
          </button>
        ))}
      </div>
      <div className="size-line">
        {line.map((s, i) => (
          <div key={s} className="size-slot">
            <span style={{ fontSize: `${SIZES[s] * 0.8}rem` }}>{round.thing.e}</span>
            <b>{i + 1}</b>
          </div>
        ))}
      </div>
      <Party show={fb.party} />
    </div>
  )
}
