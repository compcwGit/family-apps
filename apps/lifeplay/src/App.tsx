import { useState } from 'react'
import { ParentGate, ParentPage, stopSpeaking, useStars, setSpeechOptions } from '@family/core'
import { Steps } from './Steps'
import { Feel } from './Feel'
import pkg from '../package.json'
import './app.css'

setSpeechOptions({ rate: 0.8 })

const GAMES = [
  { id: 'steps', label: '🧼 순서대로', View: Steps },
  { id: 'feel', label: '😊 기분 맞추기', View: Feel },
] as const
type Screen = (typeof GAMES)[number]['id'] | 'gate' | 'parent'

// 생활 놀이: 생활 습관·안전 순서 맞추기 + 기분 맞추기
export default function App() {
  const [screen, setScreen] = useState<Screen>('steps')
  const stars = useStars('lifeplay.stars')
  const go = (s: Screen) => {
    stopSpeaking()
    setScreen(s)
  }

  if (screen === 'gate') return <ParentGate onPass={() => go('parent')} onCancel={() => go('steps')} />
  if (screen === 'parent')
    return (
      <ParentPage
        title="생활 놀이"
        version={pkg.version}
        about="손 씻기·이 닦기·길 건너기 같은 생활 습관과 안전 규칙을 순서대로 맞추고, 이야기 속 친구의 기분을 표정으로 골라 보는 유아용 앱입니다."
        nuri={[
          ['신체운동·건강', '순서대로 — 손 씻기, 이 닦기, 밥 먹기, 잠자기 (건강하게 생활하기), 길 건너기, 외출하기 (안전하게 생활하기)'],
          ['사회관계', '기분 맞추기 (나와 다른 사람의 감정 알기)'],
        ]}
        onReset={stars.reset}
        onClose={() => go('steps')}
      />
    )

  const game = GAMES.find((g) => g.id === screen)!
  return (
    <main>
      <nav className="core-tabs">
        {GAMES.map((g) => (
          <button key={g.id} className={screen === g.id ? 'tab on' : 'tab'} onClick={() => go(g.id)}>
            {g.label}
          </button>
        ))}
      </nav>
      <game.View key={game.id} stars={stars.of(game.id)} onStar={() => stars.add(game.id)} />
      <button className="core-parent-btn" onClick={() => go('gate')} aria-label="부모 메뉴">
        ⚙️
      </button>
    </main>
  )
}
