import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps } from '@family/core'
import { SAY } from './voice'

// 다음은 뭘까?: 되풀이되는 규칙(패턴)을 보고 빈칸에 올 것 고르기
// 쉬운 것(AB)부터 시작해서 별이 모이면 AAB, ABB, ABC 도 나옴
const POOL = ['🍎', '🍌', '🍇', '⭐', '🌙', '☀️', '🐶', '🐱', '🔴', '🔵', '🟡', '🟢']
const UNITS = [
  [0, 1], // AB
  [0, 0, 1], // AAB
  [0, 1, 1], // ABB
  [0, 1, 2], // ABC
]

function makeRound(stars: number) {
  const unit = UNITS[Math.floor(Math.random() * Math.min(UNITS.length, 1 + Math.floor(stars / 4)))]
  const syms = shuffle(POOL).slice(0, 4) // 3개는 패턴, 1개는 헷갈리게
  const len = unit.length * 2 + 1 + Math.floor(Math.random() * unit.length) // 두 번 이상 되풀이
  const seq = Array.from({ length: len + 1 }, (_, i) => syms[unit[i % unit.length]])
  const answer = seq[len]
  const used = [...new Set(seq)]
  const choices = shuffle([answer, ...shuffle([...used.filter((s) => s !== answer), syms[3]]).slice(0, 2)])
  return { shown: seq.slice(0, len), answer, choices }
}

export function Pattern({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(() => makeRound(stars))
  const [solved, setSolved] = useState(false)
  const fb = useFeedback(onStar)
  const ask = SAY.patternAsk
  useSay(ask, [round])

  const choose = (c: string) => {
    if (c !== round.answer) return fb.no(c, SAY.patternNo)
    setSolved(true)
    fb.ok(SAY.patternOk, () => {
      setSolved(false)
      setRound(makeRound(stars + 1))
    })
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        다음은 뭘까?
      </GameTop>
      <div className="pattern-seq">
        {round.shown.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
        <span className={'pattern-q' + (solved ? ' ok' : '')}>{solved ? round.answer : '?'}</span>
      </div>
      <div className="g-row">
        {round.choices.map((c) => (
          <button key={c} className={'g-card' + (fb.wrong === c ? ' g-shake' : '')} onClick={() => choose(c)}>
            {c}
          </button>
        ))}
      </div>
      <Party show={fb.party} />
    </div>
  )
}
