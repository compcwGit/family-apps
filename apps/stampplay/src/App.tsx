import { useState } from 'react'
import { ParentGate, getPlatform, playTone } from '@family/core'
import { ParentPanel } from './ParentPanel'
import { StampBoard } from './StampBoard'
import { History } from './History'
import { addStamp, boardsOf, loadPlans, loadReasons, loadStamps, nextPlanOf, removeStamp, saveReasons, setPlan } from './stamps'
import './app.css'

type Screen = 'home' | 'gate' | 'parent' | 'history' | 'board'

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
  const [openNo, setOpenNo] = useState(1) // 칭찬 기록에서 연 도장판 번호
  const boards = boardsOf(stamps, plans)
  const [newestId, setNewestId] = useState<string | null>(null)

  if (screen === 'gate') return <ParentGate onPass={() => setScreen('parent')} onCancel={() => setScreen('home')} />
  if (screen === 'history')
    return (
      <History
        boards={boards}
        onOpen={(no) => {
          setOpenNo(no)
          setScreen('board')
        }}
        onClose={() => setScreen('home')}
      />
    )
  if (screen === 'board')
    return (
      <main>
        <h1>📖 지난 도장판</h1>
        <StampBoard board={boards[openNo - 1] ?? boards[boards.length - 1]} newestId={null} />
        <button className="core-btn history-btn" onClick={() => setScreen('history')}>
          ← 칭찬 기록
        </button>
      </main>
    )
  if (screen === 'parent')
    return (
      <ParentPanel
        stamps={stamps}
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
        onRemove={(id) => setStamps(removeStamp(id))}
        onClose={() => {
          setScreen('home')
          if (newestId) stampSound()
        }}
      />
    )

  return (
    <main onAnimationEnd={() => setNewestId(null)}>
      <h1>칭찬 도장판</h1>
      <StampBoard board={boards[boards.length - 1]} newestId={newestId} />
      <button className="core-btn history-btn" onClick={() => setScreen('history')}>
        📖 칭찬 기록
      </button>
      <footer>실행 환경: {getPlatform()}</footer>
      <button className="core-parent-btn" onClick={() => setScreen('gate')} aria-label="부모 메뉴">
        ⚙️
      </button>
    </main>
  )
}
