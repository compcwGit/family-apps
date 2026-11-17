import { useState } from 'react'
import { BackIcon } from './Icons'
import { Mascot, type Kind } from './Mascot'

// 부모 확인: 두 자리 수 덧셈, 보기 4개 중 고르기. 받아올림이 있게 내서 유치원생은 어렵게
// 틀리면 새 문제 (찍어서 맞히기 어렵게)
const rand = (n: number) => Math.floor(Math.random() * n)
const makeQuestion = () => {
  const ua = 1 + rand(9) // 일의 자리 1~9
  const ub = 10 - ua + rand(ua) // 일의 자리 합이 10 이상 → 받아올림
  const a = (1 + rand(8)) * 10 + ua // 11~89
  const b = (1 + rand(8)) * 10 + ub
  const answer = a + b
  // 헷갈리는 보기: 받아올림을 빼먹은 답(-10), ±1, ±10, ±11 중에서
  const pool = [answer - 10, answer + 10, answer - 1, answer + 1, answer - 11, answer + 11].filter((n) => n > 0)
  const choices = new Set([answer, answer - 10])
  while (choices.size < 4) choices.add(pool[rand(pool.length)])
  return { a, b, answer, choices: [...choices].sort(() => Math.random() - 0.5) }
}

export function Gate({ kind, onPass, onCancel }: { kind: Kind; onPass: () => void; onCancel: () => void }) {
  const [q, setQ] = useState(makeQuestion)
  const [bad, setBad] = useState(false)
  const pick = (n: number) => {
    if (n === q.answer) return onPass()
    setBad(true)
    setQ(makeQuestion())
  }

  return (
    <main className="sp-page">
      <button className="sp-pill sp-pill-light sp-back" onClick={onCancel}>
        <BackIcon />
        도장판으로
      </button>
      <div className="sp-gate">
        <div className="sp-gate-q">
          <div className="sp-gate-mascot">
            <Mascot kind={kind} pose="peek" size={120} />
            <p className="sp-bubble sp-bubble-line">눈 감고 있을게요!</p>
          </div>
          <h1 className="sp-h1">엄마·아빠 확인</h1>
          <p className="sp-sub">아래 문제의 답을 골라 주세요.</p>
          <div className="sp-gate-eq">
            <span>
              {q.a} + {q.b} =
            </span>
            <span className="sp-gate-ans empty">?</span>
          </div>
          {bad && (
            <p role="status" className="sp-gate-bad">
              앗, 새 문제로 다시 풀어 볼까요?
            </p>
          )}
        </div>
        <div className="sp-choices">
          {q.choices.map((n) => (
            <button key={`${q.a}-${q.b}-${n}`} className="sp-key sp-choice" onClick={() => pick(n)}>
              {n}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
