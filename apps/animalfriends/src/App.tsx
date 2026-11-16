import { useState } from 'react'
import { ParentGate, stopSpeaking, useStars } from '@family/core'
import { AnimalBoard } from './AnimalBoard'
import { ParentInfo } from './ParentInfo'
import { Quiz } from './Quiz'
import { Shadow } from './Shadow'
import { Piano } from './Piano'
import './app.css'

type Screen = 'play' | 'quiz' | 'shadow' | 'piano' | 'gate' | 'parent'

// 동물 친구들: 동물 버튼판 + "누구일까요?" 퀴즈 + 그림자 맞추기 + 동물 피아노
export default function App() {
  const [screen, setScreen] = useState<Screen>('play')
  const stars = useStars('animalfriends.stars')
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
        <button className={screen === 'shadow' ? 'tab on' : 'tab'} onClick={() => go('shadow')}>
          👤 그림자 맞추기
        </button>
        <button className={screen === 'piano' ? 'tab on' : 'tab'} onClick={() => go('piano')}>
          🎹 동물 피아노
        </button>
      </nav>
      {screen === 'play' && <AnimalBoard />}
      {screen === 'quiz' && <Quiz />}
      {screen === 'shadow' && <Shadow stars={stars.of('shadow')} onStar={() => stars.add('shadow')} />}
      {screen === 'piano' && <Piano />}
      <button className="core-parent-btn" onClick={() => go('gate')} aria-label="부모 메뉴">
        ⚙️
      </button>
    </main>
  )
}
