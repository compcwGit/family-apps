import { useState } from 'react'
import { FitStage, getPlatform, playTone } from '@family/core'
import { Done } from './Done'
import { Gate } from './Gate'
import { GoalPanel } from './GoalPanel'
import { History } from './History'
import { BackIcon, BookIcon, LockIcon } from './Icons'
import { ParentPanel } from './ParentPanel'
import { StampBoard } from './StampBoard'
import { StampMark } from './StampMark'
import { addStamp, boardsOf, loadCharacter, loadPlans, loadReasons, loadStamps, nextPlanOf, removeStamp, saveCharacter, saveReasons, setPlan } from './stamps'
import './app.css'

type Screen = 'home' | 'gate' | 'parent' | 'history' | 'board' | 'done'

// 도장 찍는 "쾅" + 짧은 축하음
const stampSound = () => {
  playTone(196)
  setTimeout(() => playTone(523), 180)
  setTimeout(() => playTone(784), 330)
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [stamps, setStamps] = useState(loadStamps)
  const [plans, setPlans] = useState(loadPlans)
  const [reasons, setReasons] = useState(loadReasons)
  const [character, setCharacter] = useState(loadCharacter)
  const [openNo, setOpenNo] = useState(1) // 칭찬 기록에서 연 도장판 번호
  const [fromParent, setFromParent] = useState(false) // 칭찬 기록을 부모 화면에서 열었는지 (지우기 가능, 닫으면 부모 화면으로)
  const boards = boardsOf(stamps, plans)
  const [newestId, setNewestId] = useState<string | null>(null)

  if (screen === 'gate') return <Gate kind={character} onPass={() => setScreen('parent')} onCancel={() => setScreen('home')} />
  if (screen === 'history')
    return (
      <History
        boards={boards}
        closeLabel={fromParent ? '부모 화면으로' : '도장판으로'}
        onOpen={(no) => {
          setOpenNo(no)
          setScreen('board')
        }}
        onClose={() => setScreen(fromParent ? 'parent' : 'home')}
      />
    )
  if (screen === 'board') {
    const b = boards[openNo - 1] ?? boards[boards.length - 1]
    return (
      <main className="sp-page">
        <header className="sp-head">
          <button className="sp-pill sp-pill-light" onClick={() => setScreen('history')}>
            <BackIcon />
            칭찬 기록
          </button>
          <h1 className="sp-h1">지난 도장판</h1>
        </header>
        <div className="sp-body">
          <StampBoard key={openNo} board={b} newestId={null} onRemove={fromParent ? (id) => setStamps(removeStamp(id)) : undefined} />
          <GoalPanel board={b} kind={character} />
        </div>
      </main>
    )
  }

  // 부모 화면: 지금 판이 다 찼으면 다음 판(빈 판)도 함께 보여 줌
  const current = boards[boards.length - 1]
  const nextBoard = current.done ? { no: current.no + 1, plan: nextPlanOf(stamps, plans), stamps: [], done: false } : undefined

  if (screen === 'parent')
    return (
      <ParentPanel
        board={current}
        nextBoard={nextBoard}
        newestId={newestId}
        reasons={reasons}
        onReasons={(list) => setReasons(saveReasons(list))}
        plan={nextPlanOf(stamps, plans)}
        onPlan={(p) => setPlans(setPlan(stamps, p))}
        onStamp={(reason) => {
          const next = addStamp(reason)
          setStamps(next)
          setNewestId(next[next.length - 1].id)
          playTone(196)
        }}
        onRemove={(id) => {
          setStamps(removeStamp(id))
          if (id === newestId) setNewestId(null)
        }}
        onHistory={() => {
          setFromParent(true)
          setScreen('history')
        }}
        character={character}
        onCharacter={(k) => setCharacter(saveCharacter(k))}
        onClose={() => {
          // 새로 찍은 도장이 있으면 "도장 찍힘" 화면을 먼저 보여 줌
          if (newestId && stamps.some((s) => s.id === newestId)) {
            setScreen('done')
            stampSound()
          } else {
            setNewestId(null)
            setScreen('home')
          }
        }}
      />
    )

  if (screen === 'done') {
    const stamp = stamps.find((s) => s.id === newestId) ?? stamps[stamps.length - 1]
    const board = boards.find((b) => b.stamps.some((s) => s.id === stamp?.id)) ?? current
    if (stamp) return <Done kind={character} stamp={stamp} board={board} total={stamps.length} onClose={() => setScreen('home')} />
  }

  return (
    <main className="sp-page" onAnimationEnd={(e) => e.animationName === 'sp-stamp-in' && setNewestId(null)}>
      <header className="sp-head">
        <div className="sp-brand">
          <StampMark emoji="" tilt={-8} className="sp-mark-logo" />
          <div>
            <h1 className="sp-h1">칭찬도장판</h1>
            <p className="sp-sub">도장을 모으면 선물이 와요</p>
          </div>
        </div>
        <div className="sp-head-end sp-head-actions">
          <button
            className="sp-pill sp-pill-light"
            onClick={() => {
              setFromParent(false)
              setScreen('history')
            }}
          >
            <BookIcon size={22} />
            칭찬 기록
          </button>
          <button className="sp-pill sp-pill-dark" onClick={() => setScreen('gate')}>
            <LockIcon />
            엄마·아빠
          </button>
        </div>
      </header>
      <FitStage className="sp-fit" design={[1084, 380]} max={1}>
        <div className="sp-body">
          <StampBoard board={current} newestId={newestId} />
          <GoalPanel board={current} kind={character} />
        </div>
      </FitStage>
      {getPlatform() === 'web' && <p className="sp-foot">웹 미리보기</p>}
    </main>
  )
}
