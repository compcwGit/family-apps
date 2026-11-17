import { GiftIcon } from './Icons'
import { Mascot } from './Mascot'
import type { Board } from './stamps'

// 도장판 옆 카드: 약속(선물), 모은 개수, 남은 개수, 꾹이 말풍선
export function GoalPanel({ board }: { board: Board }) {
  const { plan, stamps, done } = board
  const remaining = plan.target - stamps.length

  return (
    <aside className="sp-card sp-goal">
      <div className="sp-goal-icon">
        <GiftIcon />
      </div>
      <div className="sp-goal-title">
        <p>{!plan.reward ? (done ? '참 잘했어요' : '선물 약속') : done ? '약속 선물' : '다음 선물'}</p>
        <h2>{plan.reward || (done ? '도장판 완성!' : '엄마·아빠와 약속해요')}</h2>
      </div>
      <div className="sp-goal-count">
        <b>{stamps.length}</b>
        <span>/ {plan.target}</span>
      </div>
      <div className="sp-bar">
        <div style={{ width: `${(stamps.length / plan.target) * 100}%` }} />
      </div>
      <p className="sp-goal-left">
        {done ? (
          <>도장을 <b>다 모았어요!</b></>
        ) : (
          <>도장 <b>{remaining}개</b> 더 모으면 받아요</>
        )}
      </p>
      <div className="sp-goal-fill" />
      <div className="sp-goal-mascot">
        <Mascot pose={done ? 'happy' : 'basic'} size={110} />
        <p className="sp-bubble">
          {done ? (
            <>다 모았어요!<br />최고!</>
          ) : (
            <>{remaining}개만 더<br />모아 보자!</>
          )}
        </p>
      </div>
    </aside>
  )
}
