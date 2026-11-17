import { useState } from 'react'
import { ParentGate, ParentPage, PlayShell, stopSpeaking, useStars, setSpeechOptions } from '@family/core'
import { Steps } from './Steps'
import { Feel } from './Feel'
import pkg from '../package.json'
import './app.css'

setSpeechOptions({ rate: 0.8 })

const GAMES = [
  { id: 'steps', label: '순서', View: Steps },
  { id: 'feel', label: '기분', View: Feel },
] as const
const GAME_NAMES: Record<string, string> = { steps: '순서대로', feel: '기분 맞추기' }
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
        accent="#63D2A1"
        about="손 씻기·이 닦기·길 건너기 같은 생활 습관과 안전 규칙을 순서대로 맞추고, 이야기 속 친구의 기분을 표정으로 골라 보는 유아용 앱입니다."
        nuri={[
          ['신체운동·건강', '순서대로 — 손 씻기, 이 닦기, 밥 먹기, 잠자기 (건강하게 생활하기), 길 건너기, 외출하기 (안전하게 생활하기)'],
          ['사회관계', '기분 맞추기 (나와 다른 사람의 감정 알기)'],
        ]}
        stars={GAMES.map((g) => [GAME_NAMES[g.id], stars.of(g.id)] as [string, number])}
        onReset={stars.reset}
        onClose={() => go('steps')}
      />
    )

  const game = GAMES.find((g) => g.id === screen)!
  return (
    <PlayShell app="생활 놀이" accent="#63D2A1" games={GAMES} active={screen} onPick={(id) => go(id as Screen)} onParent={() => go('gate')}>
      <game.View key={game.id} stars={stars.of(game.id)} onStar={() => stars.add(game.id)} />
    </PlayShell>
  )
}
