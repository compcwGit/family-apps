import { Mascot } from './Mascot'
import { StarIcon } from './Icons'
import { StampMark } from './StampMark'
import { iconOf, inkOf, type Board, type Stamp } from './stamps'

// 도장 찍힘: 부모 화면에서 도장을 찍고 아이 화면으로 돌아올 때 한 번 보여 줌
export function Done({ stamp, board, total, onClose }: { stamp: Stamp; board: Board; total: number; onClose: () => void }) {
  const remaining = board.plan.target - board.stamps.length

  return (
    <main className="sp-page sp-done">
      <div className="sp-done-deco" aria-hidden="true">
        <span className="dot" style={{ left: '14%', top: '15%', width: 28, height: 28, background: '#F2B544' }} />
        <span className="dot" style={{ left: '23%', top: '70%', width: 18, height: 18, background: '#2F6FB5' }} />
        <span className="dot" style={{ left: '80%', top: '19%', width: 22, height: 22, background: '#2E7D4F' }} />
        <span className="dot" style={{ left: '84%', top: '65%', width: 34, height: 34, background: '#F2B544' }} />
        <span className="dot" style={{ left: '33%', top: '11%', width: 14, height: 14, background: '#D6402A' }} />
        <span className="dot" style={{ left: '69%', top: '80%', width: 16, height: 16, background: '#D6402A' }} />
        <span className="star">
          <StarIcon />
        </span>
      </div>
      <div className="sp-done-mascot">
        <Mascot pose="happy" size={210} />
      </div>
      <p className="sp-done-kkuk">꾹!</p>
      <StampMark emoji={iconOf(stamp)} ink={inkOf(stamp)} tilt={-8} className="sp-mark-xl stamp-in" />
      <h1 className="sp-h1 sp-done-title">{board.done ? '도장판을 다 모았어요!' : '칭찬도장을 받았어요!'}</h1>
      <p className="sp-tag">{stamp.reason}</p>
      <p className="sp-done-info">
        {board.done ? (
          board.plan.reward ? (
            <>
              약속 선물: <b className="red">{board.plan.reward}</b>
            </>
          ) : (
            <>정말 최고예요!</>
          )
        ) : (
          <>
            도장 <b>{total}개째</b> · {board.plan.reward ? '선물까지' : '다 모으기까지'} <b className="red">{remaining}개</b> 남았어요
          </>
        )}
      </p>
      <button className="sp-pill sp-pill-dark sp-pill-lg" onClick={onClose}>
        도장판 보러 가기
      </button>
    </main>
  )
}
