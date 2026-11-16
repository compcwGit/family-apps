import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, pick, type GameProps } from '@family/core'
import { readNumber, type Mode } from './numbers'
import { SAY } from './voice'

// 몇 개일까?: 그림을 세어 보고 숫자 고르기. 그림을 누르면 하나씩 세어 줌. 별 5개부터 10까지
const THINGS = ['🍎', '🐶', '🐱', '🐟', '⭐', '🚗', '🎈', '🐤', '🍓', '🦋', '🌸', '🐸']

function makeRound(max: number, prev = 0) {
  let n = prev
  while (n === prev) n = 1 + Math.floor(Math.random() * max)
  const choices = new Set([n])
  while (choices.size < 3) {
    const c = n + pick([-2, -1, 1, 2])
    if (c >= 1 && c <= max + 1) choices.add(c)
  }
  return { n, thing: pick(THINGS), choices: [...choices].sort((a, b) => a - b) }
}

export function Count({ stars, onStar, mode }: GameProps & { mode: Mode }) {
  const max = stars >= 5 ? 10 : 5
  const [round, setRound] = useState(() => makeRound(max))
  const [tapped, setTapped] = useState<number[]>([]) // 누른 순서
  const fb = useFeedback(onStar)
  const ask = SAY.countAsk
  useSay(ask, [round])

  const count = (i: number) => {
    if (tapped.includes(i)) return
    const t = [...tapped, i]
    setTapped(t)
    speak(readNumber(t.length, mode), 523)
  }
  const choose = (c: number) => {
    if (c === round.n)
      fb.ok(SAY.countOk(c, mode), () => {
        setRound(makeRound(max, round.n))
        setTapped([])
      })
    else fb.no(String(c), SAY.countNo)
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        몇 개일까요?
      </GameTop>
      <div className="count-field">
        {Array.from({ length: round.n }, (_, i) => (
          <button key={i} className={'count-item' + (tapped.includes(i) ? ' on' : '')} onClick={() => count(i)}>
            {round.thing}
            {tapped.includes(i) && <b>{tapped.indexOf(i) + 1}</b>}
          </button>
        ))}
      </div>
      <div className="g-row">
        {round.choices.map((c) => (
          <button key={c} className={'g-card count-num' + (fb.wrong === String(c) ? ' g-shake' : '') + (fb.party && c === round.n ? ' ok' : '')} onClick={() => choose(c)}>
            {c}
          </button>
        ))}
      </div>
      <Party show={fb.party} />
    </div>
  )
}
