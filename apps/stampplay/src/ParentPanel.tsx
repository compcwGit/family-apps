import { useState } from 'react'
import { BackIcon, BookIcon, PencilIcon } from './Icons'
import { StampBoard } from './StampBoard'
import { StampMark } from './StampMark'
import { ICONS, INKS, MAX_TARGET, type Board, type Ink, type Plan, type Reason } from './stamps'

const INK_NAME: Record<Ink, string> = { red: '빨강', blue: '파랑', green: '초록' }

// 부모 화면: 도장 고르고 도장판 빈 칸 눌러 찍기(아이 화면과 같은 도장판), 칭찬도장 만들기·지우기, 약속 정하기, 지난 도장판
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
  onHistory,
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
  onHistory: () => void
  onClose: () => void
}) {
  const [target, setTarget] = useState(plan.target)
  const [reward, setReward] = useState(plan.reward)
  const [editing, setEditing] = useState(false)
  const [pickedLabel, setPickedLabel] = useState(reasons[0]?.label ?? '')
  const picked = reasons.find((r) => r.label === pickedLabel) ?? reasons[0]
  const [newLabel, setNewLabel] = useState('')
  const [newEmoji, setNewEmoji] = useState('')
  const [newInk, setNewInk] = useState<Ink>('red')
  const label = newLabel.trim()
  const canAdd = label !== '' && !reasons.some((r) => r.label === label)
  const changed = target !== plan.target || reward.trim() !== plan.reward
  const stampHere = picked && !editing ? () => onStamp(picked) : undefined

  return (
    <main className="sp-page">
      <header className="sp-head">
        <button className="sp-pill sp-pill-light" onClick={onClose}>
          <BackIcon />
          아이 화면으로
        </button>
        <h1 className="sp-h1">어떤 도장을 찍어 줄까요?</h1>
        <button className="sp-pill sp-pill-light sp-head-end" onClick={onHistory}>
          <BookIcon size={22} />
          지난 도장판
        </button>
      </header>

      <div className="sp-body">
        <div className="sp-col">
          <p className="sp-help">{picked ? '도장을 고르고, 도장판의 빈 칸을 눌러 꾹 찍어 주세요' : '먼저 칭찬도장을 만들어 주세요'}</p>
          {/* 지금 판이 다 찼으면: 다 찬 판(지우기 가능) 아래에 다음 빈 판 */}
          <StampBoard board={board} newestId={newestId} onRemove={onRemove} onEmpty={board.done ? undefined : stampHere} />
          {nextBoard && <StampBoard key={nextBoard.no} board={nextBoard} newestId={null} onEmpty={stampHere} />}
        </div>

        <aside className="sp-card sp-side">
          <h2 className="sp-h2">{editing ? '지울 도장을 누르세요' : '도장 고르기'}</h2>
          <div className="sp-kinds">
            {reasons.map((r) => (
              <button
                key={r.label}
                className={'sp-kind' + (editing ? ' editing' : r === picked ? ' on' : '')}
                aria-pressed={!editing && r === picked}
                onClick={() => (editing ? onReasons(reasons.filter((x) => x !== r)) : setPickedLabel(r.label))}
              >
                <StampMark emoji={r.emoji} ink={r.ink} className="sp-mark-sm" />
                <span>{r.label}</span>
                {editing && <span className="sp-kind-del" aria-label="지우기">×</span>}
              </button>
            ))}
          </div>
          <button className="sp-chip" onClick={() => setEditing(!editing)}>
            <PencilIcon size={18} />
            {editing ? '다 했어요' : '칭찬도장 만들기·지우기'}
          </button>
          {editing && (
            <div className="sp-new">
              <p className="sp-muted">이미 찍은 도장 기록은 지워지지 않아요.</p>
              <div className="sp-new-preview">
                <StampMark emoji={newEmoji} ink={newInk} tilt={-6} className="sp-mark-md" />
                <span>{label || '새 도장'}</span>
              </div>
              <div className="sp-icon-pick">
                {ICONS.map((e) => (
                  <button key={e || 'good'} className={'sp-icon-opt' + (e === newEmoji ? ' on' : '')} onClick={() => setNewEmoji(e)} aria-label={e || '참 잘했어요 도장'}>
                    <StampMark emoji={e} ink={newInk} className="sp-mark-xs" />
                  </button>
                ))}
              </div>
              <div className="sp-inks">
                {INKS.map((k) => (
                  <button key={k} className={'sp-chip ink-' + k + (k === newInk ? ' on' : '')} onClick={() => setNewInk(k)}>
                    <span className="sp-ink-dot" />
                    {INK_NAME[k]}
                  </button>
                ))}
              </div>
              <label className="sp-field">
                <span>도장 이름</span>
                <input value={newLabel} maxLength={12} placeholder="예: 책 읽기" onChange={(e) => setNewLabel(e.target.value)} />
              </label>
              <button
                className="sp-pill sp-pill-red"
                disabled={!canAdd}
                onClick={() => {
                  onReasons([...reasons, { label, emoji: newEmoji, ink: newInk }])
                  setNewLabel('')
                  setNewEmoji('')
                }}
              >
                도장 추가
              </button>
            </div>
          )}
        </aside>
      </div>

      <section className="sp-card sp-promise">
        <h2 className="sp-h2">약속</h2>
        <div className="sp-promise-row">
          <div className="sp-stepper">
            <button onClick={() => setTarget(Math.max(1, target - 1))} aria-label="하나 줄이기">
              −
            </button>
            <b>{target}개</b>
            <button onClick={() => setTarget(Math.min(MAX_TARGET, target + 1))} aria-label="하나 늘리기">
              +
            </button>
          </div>
          <span className="sp-promise-mid">모으면</span>
          <label className="sp-field sp-grow">
            <span className="sp-sr">약속 선물</span>
            <input value={reward} maxLength={30} placeholder="예: 장난감 사주기" onChange={(e) => setReward(e.target.value)} />
          </label>
          <button className="sp-pill sp-pill-dark" disabled={!changed} onClick={() => onPlan({ target, reward: reward.trim() })}>
            {changed ? '약속 정하기' : '저장됨'}
          </button>
        </div>
        <p className="sp-muted">지금 도장판(다 찼으면 다음 도장판)부터 적용돼요. 다음 판은 같은 약속을 이어받아요.</p>
      </section>
    </main>
  )
}
