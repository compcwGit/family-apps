import { useState } from 'react'
import { StampBoard } from './StampBoard'
import { StampIcon } from './StampIcon'
import { ICONS, MAX_TARGET, iconOf, type Board, type Plan, type Reason } from './stamps'

// 부모 화면: 도장 고르고 도장판 빈 칸 눌러 찍기(아이 화면과 같은 도장판), 칭찬도장 만들기·지우기, 약속 정하기, 최근 기록, 지우기
export function ParentPanel({
  board,
  nextBoard,
  newestId,
  reasons,
  onReasons,
  plan,
  onPlan,
  onStamp,
  onRemove,
  onClose,
}: {
  board: Board
  nextBoard?: Board
  newestId: string | null
  reasons: Reason[]
  onReasons: (list: Reason[]) => void
  plan: Plan
  onPlan: (plan: Plan) => void
  onStamp: (reason: Reason) => void
  onRemove: (id: string) => void
  onClose: () => void
}) {
  const [target, setTarget] = useState(plan.target)
  const [reward, setReward] = useState(plan.reward)
  const [editing, setEditing] = useState(false)
  const [pickedLabel, setPickedLabel] = useState(reasons[0]?.label ?? '')
  const picked = reasons.find((r) => r.label === pickedLabel) ?? reasons[0]
  const [newLabel, setNewLabel] = useState('')
  const [newEmoji, setNewEmoji] = useState('')
  const label = newLabel.trim()
  const canAdd = label !== '' && !reasons.some((r) => r.label === label)
  const changed = target !== plan.target || reward.trim() !== plan.reward

  return (
    <main>
      <button className="core-btn parent-back" onClick={onClose}>
        ← 아이 화면으로
      </button>
      <h1>칭찬도장 찍기</h1>
      <p className="parent-help">{picked ? '① 도장을 고르고 ② 도장판 빈 칸을 누르세요' : '먼저 칭찬도장을 만들어 주세요'}</p>
      <div className="reason-grid">
        {reasons.map((r) => (
          <button
            key={r.label}
            className={editing ? 'reason editing' : r === picked ? 'reason on' : 'reason'}
            onClick={() => (editing ? onReasons(reasons.filter((x) => x !== r)) : setPickedLabel(r.label))}
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

      {/* 지금 판이 다 찼으면: 다 찬 판(지우기 가능) 아래에 다음 빈 판 */}
      <StampBoard board={board} newestId={newestId} onRemove={onRemove} onEmpty={!board.done && picked && !editing ? () => onStamp(picked) : undefined} />
      {nextBoard && (
        <StampBoard key={nextBoard.no} board={nextBoard} newestId={null} onEmpty={picked && !editing ? () => onStamp(picked) : undefined} />
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

    </main>
  )
}
