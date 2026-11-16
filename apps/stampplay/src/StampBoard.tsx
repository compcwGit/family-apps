import { emojiOf, type Board } from './stamps'

// 아이 화면: 약속한 칸 수만큼의 도장판. 꽉 차면 다음 도장 때 다음 판.
export function StampBoard({ board, newestId }: { board: Board; newestId: string | null }) {
  const { no, plan, stamps, done } = board

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
          return (
            <div key={i} className={'slot' + (s ? ' filled' : '') + (s && s.id === newestId ? ' stamp-in' : '')}>
              {s ? (
                <>
                  <span className="slot-emoji">{emojiOf(s.reason)}</span>
                  <span className="slot-mark">참 잘했어요</span>
                </>
              ) : (
                <span className="slot-no">{i + 1}</span>
              )}
            </div>
          )
        })}
      </div>
      {done && <p className="board-complete">🎉 도장판 완성!{plan.reward && ` 약속: ${plan.reward}`} 🎉</p>}
    </section>
  )
}
