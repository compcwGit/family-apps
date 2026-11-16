import { StampIcon } from './StampIcon'
import { iconOf, type Board } from './stamps'

const day = (at: number) => new Date(at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })

// 아이 화면: 지난 도장판 기록 (최근 판이 위). 누르면 그 도장판을 열어 봄
export function History({ boards, onOpen, onClose }: { boards: Board[]; onOpen: (no: number) => void; onClose: () => void }) {
  return (
    <main>
      <h1>📖 칭찬 기록</h1>
      <ul className="history">
        {[...boards].reverse().map((b) => (
          <li key={b.no}>
            <button className={b.done ? 'history-item done' : 'history-item'} onClick={() => onOpen(b.no)}>
              <div className="history-head">
                <b>{b.no}번째 도장판</b>
                <span>
                  {b.done ? '🎉 완성' : '모으는 중'} · {b.stamps.length}/{b.plan.target}
                </span>
              </div>
              {b.plan.reward && <p className="history-reward">🎁 {b.plan.reward}</p>}
              <p className="history-stamps">
                {b.stamps.length
                  ? b.stamps.map((s) => (
                      <span key={s.id} className="mini">
                        <StampIcon emoji={iconOf(s)} />
                      </span>
                    ))
                  : '아직 도장이 없어요'}
              </p>
              {b.stamps.length > 0 && (
                <p className="history-date">
                  {day(b.stamps[0].at)}
                  {b.done && ` ~ ${day(b.stamps[b.stamps.length - 1].at)}`}
                </p>
              )}
            </button>
          </li>
        ))}
      </ul>
      <button className="core-btn" onClick={onClose}>
        도장판으로
      </button>
    </main>
  )
}
