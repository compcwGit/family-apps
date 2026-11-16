import { useState } from 'react'
import { ParentGate, stopSpeaking } from '@family/core'
import { AnimalBoard } from './AnimalBoard'
import { ParentInfo } from './ParentInfo'
import { Quiz } from './Quiz'
import './app.css'

type Screen = 'play' | 'quiz' | 'gate' | 'parent'

// 동물 친구들: 동물 버튼판 + "누구일까요?" 퀴즈
export default function App() {
  const [screen, setScreen] = useState<Screen>('play')
  const go = (s: Screen) => {
    stopSpeaking()
    setScreen(s)
  }

  if (screen === 'gate') return <ParentGate onPass={() => go('parent')} onCancel={() => go('play')} />
  if (screen === 'parent') return <ParentInfo onClose={() => go('play')} />

  return (
    <main>
      <nav className="tabs">
        <button className={screen === 'play' ? 'tab on' : 'tab'} onClick={() => go('play')}>
          🐾 동물 친구들
        </button>
        <button className={screen === 'quiz' ? 'tab on' : 'tab'} onClick={() => go('quiz')}>
          ❓ 누구일까요?
        </button>
      </nav>
      {screen === 'play' ? <AnimalBoard /> : <Quiz />}
      <button className="core-parent-btn" onClick={() => go('gate')} aria-label="부모 메뉴">
        ⚙️
      </button>
    </main>
  )
}
