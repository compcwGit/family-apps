import { useState } from 'react'
import { MAX_TARGET, REASONS, emojiOf, type Plan, type Stamp } from './stamps'

// 부모 화면: 이유를 골라 칭찬도장 찍기, 약속 정하기, 최근 기록, 지우기
export function ParentPanel({
  stamps,
  plan,
  onPlan,
  onStamp,
  onRemove,
  onClose,
}: {
  stamps: Stamp[]
  plan: Plan
  onPlan: (plan: Plan) => void
  onStamp: (reason: string) => void
  onRemove: (id: string) => void
  onClose: () => void
}) {
  const recent = [...stamps].reverse().slice(0, 10)
  const [target, setTarget] = useState(plan.target)
  const [reward, setReward] = useState(plan.reward)
  const changed = target !== plan.target || reward.trim() !== plan.reward

  return (
    <main>
      <h1>칭찬도장 찍기</h1>
      <div className="reason-grid">
        {REASONS.map((r) => (
          <button key={r.label} className="reason" onClick={() => onStamp(r.label)}>
            <span className="reason-emoji">{r.emoji}</span>
            {r.label}
          </button>
        ))}
      </div>

      <h2 className="recent-title">약속</h2>
      <div className="promise">
        <div className="promise-count">
          <button className="promise-step" onClick={() => setTarget(Math.max(1, target - 1))} aria-label="하나 줄이기">
            −
          </button>
          <b>{target}개</b>
          <button className="promise-step" onClick={() => setTarget(Math.min(MAX_TARGET, target + 1))} aria-label="하나 늘리기">
            +
          </button>
          <span>모으면</span>
        </div>
        <input className="promise-input" value={reward} maxLength={30} placeholder="예: 장난감 사주기" onChange={(e) => setReward(e.target.value)} />
        <button className="core-btn promise-save" disabled={!changed} onClick={() => onPlan({ target, reward: reward.trim() })}>
          {changed ? '약속 정하기' : '저장됨'}
        </button>
      </div>

      <h2 className="recent-title">최근 기록 (총 {stamps.length}개)</h2>
      <ul className="recent">
        {recent.length === 0 && <li className="recent-empty">아직 도장이 없어요</li>}
        {recent.map((s) => (
          <li key={s.id}>
            <span>
              {emojiOf(s.reason)} {s.reason}
            </span>
            <span className="recent-date">{new Date(s.at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
            <button className="core-link recent-del" onClick={() => onRemove(s.id)}>
              지우기
            </button>
          </li>
        ))}
      </ul>

      <button className="core-btn" onClick={onClose}>
        아이 화면으로
      </button>
    </main>
  )
}
