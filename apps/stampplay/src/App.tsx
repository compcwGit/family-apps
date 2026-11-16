import { useState } from 'react'
import { ParentGate, getPlatform, playTone } from '@family/core'
import { AnimalBoard } from './AnimalBoard'
import { ParentPanel } from './ParentPanel'
import { StampBoard } from './StampBoard'
import { addStamp, loadStamps, removeStamp } from './stamps'
import './app.css'

type Screen = 'home' | 'animals' | 'gate' | 'parent'

// 도장 찍는 "쾅" + 짧은 축하음
const stampSound = () => {
  playTone(196)
  setTimeout(() => playTone(523), 180)
  setTimeout(() => playTone(784), 330)
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [stamps, setStamps] = useState(loadStamps)
  const [newestId, setNewestId] = useState<string | null>(null)

  if (screen === 'animals') return <AnimalBoard onBack={() => setScreen('home')} />
  if (screen === 'gate') return <ParentGate onPass={() => setScreen('parent')} onCancel={() => setScreen('home')} />
  if (screen === 'parent')
    return (
      <ParentPanel
        stamps={stamps}
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
      <StampBoard stamps={stamps} newestId={newestId} />
      <button className="core-btn small-btn" onClick={() => setScreen('animals')}>
        🐶 동물 친구들
      </button>
      <footer>실행 환경: {getPlatform()}</footer>
      <button className="core-parent-btn" onClick={() => setScreen('gate')} aria-label="부모 메뉴">
        ⚙️
      </button>
    </main>
  )
}
