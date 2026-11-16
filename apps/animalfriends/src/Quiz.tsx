import { useEffect, useState } from 'react'
import { speak } from '@family/core'
import { ANIMALS, isIt, topic, type Animal } from './animals'

// "누구일까요?" 퀴즈: 울음소리를 듣고 4마리 중에서 고르기
function makeRound(prev?: Animal) {
  const pool = ANIMALS.filter((a) => a !== prev)
  const answer = pool[Math.floor(Math.random() * pool.length)]
  const others = ANIMALS.filter((a) => a !== answer).sort(() => Math.random() - 0.5).slice(0, 3)
  return { answer, choices: [answer, ...others].sort(() => Math.random() - 0.5) }
}

export function Quiz() {
  const [round, setRound] = useState(() => makeRound())
  const [stars, setStars] = useState(0)
  const [wrong, setWrong] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)

  const ask = (a: Animal) => speak(`${a.sound}! ${a.sound}! 누구일까요?`, a.freq)

  useEffect(() => {
    ask(round.answer)
  }, [round])

  const pick = (a: Animal) => {
    if (solved) return
    if (a === round.answer) {
      setSolved(true)
      setStars((s) => s + 1)
      speak(`딩동댕! ${isIt(a.name)}!`, 784)
      setTimeout(() => {
        setSolved(false)
        setRound(makeRound(round.answer))
      }, 2200)
    } else {
      setWrong(a.name)
      speak(`${topic(a.name)} ${a.sound}! 다시 들어볼까요?`, 220)
      setTimeout(() => {
        setWrong(null)
        ask(round.answer)
      }, 2600)
    }
  }

  return (
    <div className="quiz">
      <div className="quiz-top">
        <button className="core-btn" onClick={() => ask(round.answer)} aria-label="다시 듣기">
          🔊 다시 듣기
        </button>
        <span className="quiz-stars">⭐ {stars}</span>
      </div>
      {stars > 0 && stars % 5 === 0 && solved && <p className="quiz-party">🎉 대단해요! 🎉</p>}
      <div className="quiz-grid">
        {round.choices.map((a) => (
          <button
            key={a.name}
            className={'card' + (solved && a === round.answer ? ' pop correct' : '') + (wrong === a.name ? ' shake' : '')}
            style={{ background: a.color }}
            onClick={() => pick(a)}
          >
            <span className="emoji">{a.emoji}</span>
            <span className="label">{a.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
