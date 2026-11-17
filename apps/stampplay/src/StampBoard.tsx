import { useState } from 'react'
import { StampMark, tiltOf } from './StampMark'
import { iconOf, inkOf, stampTime, type Board } from './stamps'

// 도장판 카드: 약속한 칸 수만큼. 도장을 누르면 찍은 날짜·시간을 보여 줌
// onEmpty 가 있으면(부모 화면) 빈 칸을 눌러 도장을 찍음. 다음에 찍힐 칸은 깜빡임
// onRemove 가 있으면(부모 화면) 도장을 눌렀을 때 내역 옆에 "지우기"
export function StampBoard({
  board,
  newestId,
  onEmpty,
  onRemove,
}: {
  board: Board
  newestId: string | null
  onEmpty?: () => void
  onRemove?: (id: string) => void
}) {
  const { no, plan, stamps } = board
  const [pickedId, setPickedId] = useState<string | null>(null)
  const picked = stamps.find((s) => s.id === pickedId)

  return (
    <section className="sp-card sp-board" aria-label={`${no}번째 도장판`}>
      <p className="sp-board-cap">
        <span>{no}번째 도장판</span>
        <span>
          {stamps.length} / {plan.target}
        </span>
      </p>
      <div className="sp-grid">
        {Array.from({ length: plan.target }, (_, i) => {
          const s = stamps[i]
          if (!s && onEmpty)
            return (
              <button key={i} className={'sp-cell sp-slot sp-tap' + (i === stamps.length ? ' next' : '')} onClick={onEmpty} aria-label={`${i + 1}번 칸에 도장 찍기`}>
                <span>{i + 1}</span>
              </button>
            )
          if (!s)
            return (
              <div key={i} className="sp-cell sp-slot">
                <span>{i + 1}</span>
              </div>
            )
          return (
            <button
              key={s.id}
              className={'sp-cell sp-filled' + (s.id === newestId ? ' stamp-in' : '') + (s.id === pickedId ? ' picked' : '')}
              onClick={() => setPickedId(s.id === pickedId ? null : s.id)}
              aria-label={`${s.reason} ${stampTime(s.at)}`}
            >
              <StampMark emoji={iconOf(s)} ink={inkOf(s)} tilt={tiltOf(i)} />
            </button>
          )
        })}
      </div>
      {picked && (
        <div className="sp-detail" role="status">
          <StampMark emoji={iconOf(picked)} ink={inkOf(picked)} className="sp-mark-xs" />
          <div className="sp-detail-text">
            <b>{picked.reason}</b>
            <span>{stampTime(picked.at)}</span>
          </div>
          {onRemove && (
            <button className="sp-pill sp-pill-danger" onClick={() => onRemove(picked.id)}>
              지우기
            </button>
          )}
        </div>
      )}
    </section>
  )
}
