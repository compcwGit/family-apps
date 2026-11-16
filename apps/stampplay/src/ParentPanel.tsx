import { useState } from 'react'
import { StampIcon } from './StampIcon'
import { ICONS, MAX_TARGET, iconOf, type Plan, type Reason, type Stamp } from './stamps'

// 부모 화면: 칭찬도장 찍기·만들기·지우기, 약속 정하기, 최근 기록, 지우기
export function ParentPanel({
  stamps,
  reasons,
  onReasons,
  plan,
  onPlan,
  onStamp,
  onRemove,
  onClose,
}: {
  stamps: Stamp[]
  reasons: Reason[]
  onReasons: (list: Reason[]) => void
  plan: Plan
  onPlan: (plan: Plan) => void
  onStamp: (reason: Reason) => void
  onRemove: (id: string) => void
  onClose: () => void
}) {
  const recent = [...stamps].reverse().slice(0, 10)
  const [target, setTarget] = useState(plan.target)
  const [reward, setReward] = useState(plan.reward)
  const [editing, setEditing] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newEmoji, setNewEmoji] = useState('')
  const label = newLabel.trim()
  const canAdd = label !== '' && !reasons.some((r) => r.label === label)
  const changed = target !== plan.target || reward.trim() !== plan.reward

  return (
    <main>
      <h1>칭찬도장 찍기</h1>
      <div className="reason-grid">
        {reasons.map((r) => (
          <button
            key={r.label}
            className={editing ? 'reason editing' : 'reason'}
            onClick={() => (editing ? onReasons(reasons.filter((x) => x !== r)) : onStamp(r))}
          >
            {editing && <span className="reason-del">✕</span>}
            <span className="reason-emoji">
              <StampIcon emoji={r.emoji} />
            </span>
            {r.label}
          </button>
        ))}
      </div>
      <button className="core-link reason-edit" onClick={() => setEditing(!editing)}>
        {editing ? '✔ 다 했어요' : '✏️ 칭찬도장 만들기·지우기'}
      </button>
      {editing && (
        <div className="reason-new">
          <p className="reason-new-help">지울 도장은 위에서 누르세요. 이미 찍은 도장 기록은 남아요.</p>
          <div className="icon-pick">
            {ICONS.map((e) => (
              <button key={e || 'good'} className={e === newEmoji ? 'icon-opt on' : 'icon-opt'} onClick={() => setNewEmoji(e)}>
                <StampIcon emoji={e} />
              </button>
            ))}
          </div>
          <input className="promise-input" value={newLabel} maxLength={12} placeholder="예: 책 읽기" onChange={(e) => setNewLabel(e.target.value)} />
          <button
            className="core-btn promise-save"
            disabled={!canAdd}
            onClick={() => {
              onReasons([...reasons, { label, emoji: newEmoji }])
              setNewLabel('')
              setNewEmoji('')
            }}
          >
            도장 추가
          </button>
        </div>
      )}

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
              <span className="mini">
                <StampIcon emoji={iconOf(s)} />
              </span>{' '}
              {s.reason}
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
