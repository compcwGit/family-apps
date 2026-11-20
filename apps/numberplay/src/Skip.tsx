import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps } from '@family/core'
import { readNumber, type Mode } from './numbers'
import { SAY } from './voice'

// 거꾸로·뛰어 세기: 흩어진 숫자 카드를 차례대로 누르기
// 판마다 바꿈: 거꾸로(5→1, 별 3개부터 10→1) → 2씩(2~10) → 10씩(10~50) → 5씩(5~25). 뛰어 세기에는 엉뚱한 숫자 2개 섞임
type Kind = 'down' | 'two' | 'ten' | 'five'
const KINDS: Kind[] = ['down', 'two', 'ten', 'five']

function makeRound(kind: Kind, stars: number) {
  let seq: number[]
  let extra: number[] = []
  if (kind === 'down') seq = Array.from({ length: stars >= 3 ? 10 : 5 }, (_, i) => (stars >= 3 ? 10 : 5) - i)
  else {
    const by = kind === 'two' ? 2 : kind === 'ten' ? 10 : 5
    seq = Array.from({ length: 5 }, (_, i) => by * (i + 1))
    extra = shuffle(Array.from({ length: by * 5 }, (_, i) => i + 1).filter((x) => x % by !== 0)).slice(0, 2)
  }
  return { kind, seq, cards: shuffle([...seq, ...extra]) }
}

export function Skip({ stars, onStar, mode }: GameProps & { mode: Mode }) {
  const [n, setN] = useState(0)
  const [round, setRound] = useState(() => makeRound('down', stars))
  const [done, setDone] = useState(0) // 맞게 누른 개수
  const fb = useFeedback(onStar)
  const ask = SAY.skipAsk(round.kind, round.seq[0], mode)
  useSay(ask, [round])

  const tap = (x: number) => {
    if (x !== round.seq[done]) return fb.no(String(x), SAY.skipNo)
    const next = done + 1
    setDone(next)
    if (next < round.seq.length) return speak(readNumber(x, mode), 523)
    fb.ok(round.kind === 'down' ? SAY.skipLaunch : SAY.skipOk, () => {
      setN(n + 1)
      setDone(0)
      setRound(makeRound(KINDS[(n + 1) % KINDS.length], stars))
    })
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        {SAY.skipTitle(round.kind)}
      </GameTop>
      <div className="skip-line">
        {round.kind === 'down' && <span className={fb.party ? 'skip-rocket go' : 'skip-rocket'}>🚀</span>}
        {round.seq.map((x, i) => (
          <span key={x} className={i < done ? 'skip-slot on' : 'skip-slot'}>
            {i < done ? x : ''}
          </span>
        ))}
      </div>
      <div className="g-row skip-cards">
        {round.cards.map((x) => (
          <button
            key={x}
            className={'g-card count-num' + (fb.wrong === String(x) ? ' g-shake' : '') + (round.seq.indexOf(x) > -1 && round.seq.indexOf(x) < done ? ' done' : '')}
            onClick={() => tap(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
