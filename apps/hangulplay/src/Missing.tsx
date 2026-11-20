import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps, Emo } from '@family/core'
import { WORDS } from './words'
import { SAY } from './voice'

// 빠진 글자 채우기: 그림 + "사 _" → 빈칸에 들어갈 글자 고르기 (두 글자 이상 낱말)
const LONG = WORDS.filter((x) => x.w.length >= 2)

function makeRound(prev?: string) {
  const word = shuffle(LONG.filter((x) => x.w !== prev))[0]
  const hole = Math.floor(Math.random() * word.w.length)
  const answer = word.w[hole]
  const others = shuffle([...new Set(WORDS.flatMap((x) => [...x.w]))].filter((c) => c !== answer)).slice(0, 2)
  return { word, hole, answer, choices: shuffle([answer, ...others]) }
}

export function Missing({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(() => makeRound())
  const [solved, setSolved] = useState(false)
  const fb = useFeedback(onStar)
  const { word, hole, answer } = round
  const ask = SAY.missAsk(word.w)
  useSay(ask, [round])

  const choose = (c: string) => {
    if (c !== answer) return fb.no(c, SAY.missNo)
    setSolved(true)
    fb.ok(SAY.listenOk(word.w), () => {
      setSolved(false)
      setRound(makeRound(word.w))
    })
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        빈칸에 들어갈 글자는?
      </GameTop>
      <div className="miss-word">
        <span className="miss-emoji"><Emo e={word.e} /></span>
        <div className="miss-letters">
          {[...word.w].map((c, i) => (
            <span key={i} className={i === hole ? (solved ? 'miss-box filled' : 'miss-box hole') : 'miss-box'}>
              {i === hole && !solved ? '?' : c}
            </span>
          ))}
        </div>
      </div>
      <div className="g-row">
        {round.choices.map((c) => (
          <button
            key={c}
            className={'g-card letter-card' + (fb.wrong === c ? ' g-shake' : '') + (solved && c === answer ? ' ok' : '')}
            onClick={() => choose(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
