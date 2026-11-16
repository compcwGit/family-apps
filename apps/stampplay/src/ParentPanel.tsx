import { REASONS, emojiOf, type Stamp } from './stamps'

// 부모 화면: 이유를 골라 칭찬도장 찍기, 최근 기록, 지우기
export function ParentPanel({
  stamps,
  onStamp,
  onRemove,
  onClose,
}: {
  stamps: Stamp[]
  onStamp: (reason: string) => void
  onRemove: (id: string) => void
  onClose: () => void
}) {
  const recent = [...stamps].reverse().slice(0, 10)

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
