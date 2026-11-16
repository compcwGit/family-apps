import { useState } from 'react'
import { StampIcon } from './StampIcon'
import { iconOf, stampTime, type Board } from './stamps'

// 도장판: 약속한 칸 수만큼. 도장을 누르면 찍은 날짜·시간을 보여 줌
export function StampBoard({ board, newestId }: { board: Board; newestId: string | null }) {
  const { no, plan, stamps, done } = board
  const [pickedId, setPickedId] = useState<string | null>(null)
  const picked = stamps.find((s) => s.id === pickedId)

  return (
    <section className="board">
      {plan.reward && (
        <p className="board-promise">
          🎁 {plan.target}개 모으면 <b>{plan.reward}</b>
        </p>
      )}
      <p className="board-info">
        {no}번째 도장판 · {stamps.length}/{plan.target}
      </p>
      <div className="board-grid">
        {Array.from({ length: plan.target }, (_, i) => {
          const s = stamps[i]
          if (!s)
            return (
              <div key={i} className="slot">
                <span className="slot-no">{i + 1}</span>
              </div>
            )
          const emoji = iconOf(s)
          return (
            <button
              key={s.id}
              className={'slot filled' + (s.id === newestId ? ' stamp-in' : '') + (s.id === pickedId ? ' picked' : '')}
              onClick={() => setPickedId(s.id === pickedId ? null : s.id)}
              aria-label={`${s.reason} ${stampTime(s.at)}`}
            >
              <span className="slot-icon">
                <StampIcon emoji={emoji} />
              </span>
              {emoji && <span className="slot-mark">참 잘했어요</span>}
            </button>
          )
        })}
      </div>
      {picked && (
        <p className="stamp-detail">
          <span className="mini">
            <StampIcon emoji={iconOf(picked)} />
          </span>
          <b>{picked.reason}</b>
          <span>{stampTime(picked.at)}</span>
        </p>
      )}
      {done && <p className="board-complete">🎉 도장판 완성!{plan.reward && ` 약속: ${plan.reward}`} 🎉</p>}
    </section>
  )
}
