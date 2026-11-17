import { BackIcon } from './Icons'
import { StampMark } from './StampMark'
import { iconOf, inkOf, type Board } from './stamps'

const day = (at: number) => new Date(at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })

// 지난 도장판 목록 (최근 판이 위). 누르면 그 도장판을 열어 봄
export function History({ boards, onOpen, onClose, closeLabel }: { boards: Board[]; onOpen: (no: number) => void; onClose: () => void; closeLabel: string }) {
  return (
    <main className="sp-page">
      <header className="sp-head">
        <button className="sp-pill sp-pill-light" onClick={onClose}>
          <BackIcon />
          {closeLabel}
        </button>
        <h1 className="sp-h1">칭찬 기록</h1>
      </header>
      <ul className="sp-history">
        {[...boards].reverse().map((b) => (
          <li key={b.no}>
            <button className={'sp-card sp-history-item' + (b.done ? ' done' : '')} onClick={() => onOpen(b.no)}>
              <div className="sp-history-head">
                <b>{b.no}번째 도장판</b>
                <span className={b.done ? 'sp-badge done' : 'sp-badge'}>{b.done ? '다 모았어요' : '모으는 중'}</span>
                <span className="sp-history-count">
                  {b.stamps.length} / {b.plan.target}
                </span>
              </div>
              {b.plan.reward && <p className="sp-history-reward">선물: {b.plan.reward}</p>}
              <div className="sp-history-stamps">
                {b.stamps.length ? (
                  b.stamps.map((s) => <StampMark key={s.id} emoji={iconOf(s)} ink={inkOf(s)} className="sp-mark-xs" />)
                ) : (
                  <span className="sp-muted">아직 도장이 없어요</span>
                )}
              </div>
              {b.stamps.length > 0 && (
                <p className="sp-muted">
                  {day(b.stamps[0].at)}
                  {b.done && ` ~ ${day(b.stamps[b.stamps.length - 1].at)}`}
                </p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
