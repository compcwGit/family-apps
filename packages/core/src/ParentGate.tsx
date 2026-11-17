import { FitStage } from './FitStage'
import { useMemo } from 'react'

// 부모 잠금: 두 자리 덧셈. 매번 새 문제, 틀리면 닫힘.
function makeQuestion() {
  const a = 10 + Math.floor(Math.random() * 20)
  const b = 5 + Math.floor(Math.random() * 15)
  const answer = a + b
  const choices = new Set([answer])
  while (choices.size < 4) choices.add(answer + Math.floor(Math.random() * 11) - 5)
  return { a, b, answer, choices: [...choices].sort(() => Math.random() - 0.5) }
}

export function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const q = useMemo(makeQuestion, [])

  return (
    <FitStage className="core-gate" design={[560, 420]} max={1.4}>
      <p className="core-gate-title">어른만 풀어주세요</p>
      <p className="core-gate-q">
        {q.a} + {q.b} = ?
      </p>
      <div className="core-gate-choices">
        {q.choices.map((c) => (
          <button key={c} className="core-btn" onClick={() => (c === q.answer ? onPass() : onCancel())}>
            {c}
          </button>
        ))}
      </div>
      <button className="core-link" onClick={onCancel}>
        닫기
      </button>
    </FitStage>
  )
}
