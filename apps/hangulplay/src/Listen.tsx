import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps, Emo } from '@family/core'
import { WORDS } from './words'
import { SAY } from './voice'

// 듣고 찾기: 낱말을 듣고 그림 고르기 (글자는 맞힌 뒤에 보여 줌). 별 5개부터 4개 중에서
function makeRound(k: number, prev?: string) {
  const [answer, ...rest] = shuffle(WORDS.filter((x) => x.w !== prev))
  return { answer, choices: shuffle([answer, ...rest.slice(0, k - 1)]) }
}

export function Listen({ stars, onStar }: GameProps) {
  const k = stars >= 5 ? 4 : 3
  const [round, setRound] = useState(() => makeRound(k))
  const [solved, setSolved] = useState(false)
  const fb = useFeedback(onStar)
  const ask = SAY.listenAsk(round.answer.w)
  useSay(ask, [round])

  const choose = (w: string) => {
    if (w !== round.answer.w) return fb.no(w, SAY.listenNo(w, round.answer.w))
    setSolved(true)
    fb.ok(SAY.listenOk(round.answer.w), () => {
      setSolved(false)
      setRound(makeRound(k, round.answer.w))
    })
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        잘 듣고 찾아요
      </GameTop>
      <div className="g-row">
        {round.choices.map((c) => (
          <button
            key={c.w}
            className={'g-card word-card' + (fb.wrong === c.w ? ' g-shake' : '') + (solved && c === round.answer ? ' ok' : '')}
            onClick={() => choose(c.w)}
          >
            <Emo e={c.e} />
            <small>{solved && c === round.answer ? c.w : ' '}</small>
          </button>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
