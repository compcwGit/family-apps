import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, pick, eun, type GameProps } from '@family/core'
import { WORDS, firstSound } from './words'
import { CONSONANTS } from './hangul'

// 첫소리 찾기: "기역으로 시작하는 건?" — 첫 글자가 그 자음으로 시작하는 그림 고르기
// 글자 아래 낱말을 쓰고 첫 글자를 색으로 강조 (글자와 소리 연결)
// 받침이 있으면 '으로', 없거나 ㄹ 받침이면 '로' (기역으로, 리을로)
const euro = (w: string) => {
  const b = (w.charCodeAt(w.length - 1) - 0xac00) % 28
  return w + (b === 0 || b === 8 ? '로' : '으로')
}
const nameOf = (ch: string) => CONSONANTS.find((c) => c.ch === ch)?.name ?? ch

const usable = CONSONANTS.filter((c) => WORDS.some((x) => firstSound(x.w) === c.ch))

function makeRound(k: number, prev?: string) {
  const jamo = pick(usable.filter((c) => c.ch !== prev))
  const answer = pick(WORDS.filter((x) => firstSound(x.w) === jamo.ch))
  // 헷갈리지 않게 오답은 서로 다른 첫소리로
  const others: typeof WORDS = []
  for (const x of shuffle(WORDS))
    if (others.length < k - 1 && firstSound(x.w) !== jamo.ch && !others.some((o) => firstSound(o.w) === firstSound(x.w))) others.push(x)
  return { jamo, answer, choices: shuffle([answer, ...others]) }
}

export function FirstSound({ stars, onStar }: GameProps) {
  const k = stars >= 5 ? 4 : 3
  const [round, setRound] = useState(() => makeRound(k))
  const [solved, setSolved] = useState(false)
  const fb = useFeedback(onStar)
  const name = round.jamo.name
  const ask = `${name}! ${euro(name)} 시작하는 건 뭘까요?`
  useSay(ask, [round])

  const choose = (w: string) => {
    if (w !== round.answer.w) return fb.no(w, `${eun(w)} ${euro(nameOf(firstSound(w)))} 시작해요. 다시 찾아볼까?`)
    setSolved(true)
    fb.ok(`${round.answer.w}의 ${round.answer.w[0]}!`, () => {
      setSolved(false)
      setRound(makeRound(k, round.jamo.ch))
    })
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        <span className="first-jamo" style={{ background: round.jamo.color }}>
          {round.jamo.ch}
        </span>{' '}
        으로 시작하는 건?
      </GameTop>
      <div className="g-row">
        {round.choices.map((c) => (
          <button
            key={c.w}
            className={'g-card word-card' + (fb.wrong === c.w ? ' g-shake' : '') + (solved && c === round.answer ? ' ok' : '')}
            onClick={() => choose(c.w)}
          >
            {c.e}
            <small>
              <span className="first-hl">{c.w[0]}</span>
              {c.w.slice(1)}
            </small>
          </button>
        ))}
      </div>
      <Party show={fb.party} />
    </div>
  )
}
