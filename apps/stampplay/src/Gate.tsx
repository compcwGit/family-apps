import { useMemo, useState } from 'react'
import { BackIcon } from './Icons'
import { Mascot, type Kind } from './Mascot'

// 부모 확인: 두 자리 수 덧셈 + 숫자 키패드. 받아올림이 있게 내서 유치원생은 어렵게. 틀리면 지우고 다시
const rand = (n: number) => Math.floor(Math.random() * n)
const makeQuestion = () => {
  const ua = 1 + rand(9) // 일의 자리 1~9
  const ub = 10 - ua + rand(ua) // 일의 자리 합이 10 이상 → 받아올림
  const a = (1 + rand(8)) * 10 + ua // 11~89
  const b = (1 + rand(8)) * 10 + ub
  return { a, b, answer: String(a + b) }
}

export function Gate({ kind, onPass, onCancel }: { kind: Kind; onPass: () => void; onCancel: () => void }) {
  const q = useMemo(makeQuestion, [])
  const [v, setV] = useState('')
  const [bad, setBad] = useState(false)
  const press = (d: string) => {
    if (v.length < 3) setV(v + d)
    setBad(false)
  }
  const check = () => {
    if (v === q.answer) onPass()
    else {
      setV('')
      setBad(true)
    }
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
          <p className="sp-sub">아래 문제를 풀면 도장을 찍을 수 있어요.</p>
          <div className="sp-gate-eq">
            <span>
              {q.a} + {q.b} =
            </span>
            <span className={'sp-gate-ans' + (v ? '' : ' empty')}>{v || '?'}</span>
          </div>
          {bad && (
            <p role="status" className="sp-gate-bad">
              앗, 다시 한번 풀어 볼까요?
            </p>
          )}
        </div>
        <div className="sp-keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button key={d} className="sp-key" onClick={() => press(d)}>
              {d}
            </button>
          ))}
          <button className="sp-key sp-key-sm" onClick={() => setV('')}>
            지우기
          </button>
          <button className="sp-key" onClick={() => press('0')}>
            0
          </button>
          <button className="sp-key sp-key-ok" onClick={check}>
            확인
          </button>
        </div>
      </div>
    </main>
  )
}
