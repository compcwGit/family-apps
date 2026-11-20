import { useState } from 'react'
import { Critter, useFeedback, useSay, Party, GameTop, speak, pick, shuffle, type CritterKind, type GameProps } from '@family/core'
import type { Mode } from './numbers'
import { SAY } from './voice'

// 더하기·빼기 그림: 그림으로 세어 보고 답 고르기. 더하기는 두 무리, 빼기는 떠나는 친구에 ✋ 표시
// 별 5개 전에는 5까지, 그다음 10까지. 판마다 더하기/빼기 번갈아
const THINGS: CritterKind[] = ['chick', 'cat', 'dog', 'rabbit', 'duck', 'frog', 'pig', 'bear']

function makeRound(max: number, plus: boolean) {
  let a: number, b: number
  if (plus) {
    a = 1 + Math.floor(Math.random() * (max - 1))
    b = 1 + Math.floor(Math.random() * (max - a))
  } else {
    a = 2 + Math.floor(Math.random() * (max - 1))
    b = 1 + Math.floor(Math.random() * (a - 1))
  }
  const ans = plus ? a + b : a - b
  const choices = new Set([ans])
  while (choices.size < 3) {
    const c = ans + pick([-2, -1, 1, 2])
    if (c >= 0 && c <= max) choices.add(c)
  }
  return { a, b, plus, ans, thing: pick(THINGS), choices: shuffle([...choices]) }
}

export function MathPlay({ stars, onStar, mode }: GameProps & { mode: Mode }) {
  const max = stars >= 5 ? 10 : 5
  const [n, setN] = useState(0)
  const [round, setRound] = useState(() => makeRound(max, true))
  const fb = useFeedback(onStar)
  const { a, b, plus, ans, thing } = round
  const ask = plus ? SAY.plusAsk(a, b, mode) : SAY.minusAsk(a, b, mode)
  useSay(ask, [round])
  const size = a + b > 7 ? 70 : 96

  const choose = (c: number) => {
    if (c !== ans) return fb.no(String(c), SAY.mathNo)
    fb.ok(plus ? SAY.plusOk(ans, mode) : SAY.minusOk(ans, mode), () => {
      setN(n + 1)
      setRound(makeRound(max, n % 2 === 1))
    })
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        {plus ? '모두 몇 마리일까요?' : '몇 마리 남았을까요?'}
      </GameTop>
      <div className="math-field">
        {plus ? (
          <>
            <div className="math-group">{Array.from({ length: a }, (_, i) => <Critter key={i} kind={thing} size={size} />)}</div>
            <span className="math-op">+</span>
            <div className="math-group">{Array.from({ length: b }, (_, i) => <Critter key={i} kind={thing} size={size} />)}</div>
          </>
        ) : (
          <div className="math-group">
            {Array.from({ length: a }, (_, i) => (
              <span key={i} className={i >= a - b ? 'math-leave' : ''}>
                <Critter kind={thing} size={size} />
                {i >= a - b && <b>👋</b>}
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="math-sum">
        {a} {plus ? '+' : '−'} {b} = <span className={fb.party ? 'math-ans on' : 'math-ans'}>{fb.party ? ans : '?'}</span>
      </p>
      <div className="g-row">
        {round.choices.map((c) => (
          <button key={c} className={'g-card count-num' + (fb.wrong === String(c) ? ' g-shake' : '') + (fb.party && c === ans ? ' ok' : '')} onClick={() => choose(c)}>
            {c}
          </button>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
