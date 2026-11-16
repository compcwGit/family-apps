import { BOARD_SIZE, emojiOf, type Stamp } from './stamps'

// 아이 화면: 10칸 도장판. 꽉 차면 다음 판.
export function StampBoard({ stamps, newestId }: { stamps: Stamp[]; newestId: string | null }) {
  const filled = stamps.length % BOARD_SIZE === 0 && stamps.length > 0 ? BOARD_SIZE : stamps.length % BOARD_SIZE
  const current = stamps.slice(stamps.length - filled)
  const boardNo = Math.max(1, Math.ceil(stamps.length / BOARD_SIZE))
  const complete = filled === BOARD_SIZE

  return (
    <section className="board">
      <p className="board-info">
        {boardNo}번째 도장판 · {filled}/{BOARD_SIZE}
      </p>
      <div className="board-grid">
        {Array.from({ length: BOARD_SIZE }, (_, i) => {
          const s = current[i]
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
      {complete && <p className="board-complete">🎉 도장판 완성! 🎉</p>}
    </section>
  )
}
