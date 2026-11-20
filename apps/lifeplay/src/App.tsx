import { useState } from 'react'
import { ParentGate, ParentPage, PlayShell, stopSpeaking, useStars, setSpeechOptions } from '@family/core'
import { Steps } from './Steps'
import { Feel } from './Feel'
import { Safety, Talk, Help } from './Choice'
import { Tidy } from './Tidy'
import { Weather } from './Weather'
import pkg from '../package.json'
import './app.css'

setSpeechOptions({ rate: 0.8 })

const GAMES = [
  { id: 'steps', label: '순서', View: Steps },
  { id: 'feel', label: '기분', View: Feel },
  { id: 'safe', label: '안전', View: Safety },
  { id: 'talk', label: '고운 말', View: Talk },
  { id: 'tidy', label: '정리', View: Tidy },
  { id: 'wear', label: '날씨', View: Weather },
  { id: 'help', label: '도움', View: Help },
] as const
const GAME_NAMES: Record<string, string> = {
  steps: '순서대로', feel: '기분 맞추기', safe: '안전할까요?', talk: '뭐라고 말할까요?', tidy: '제자리에 정리해요', wear: '날씨에 맞게 입어요', help: '누가 도와줄까요?',
}
type Screen = (typeof GAMES)[number]['id'] | 'gate' | 'parent'

// 생활 놀이: 순서대로, 기분 맞추기, 안전할까요, 고운 말, 정리, 날씨 옷 입기, 누가 도와줄까요
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
        about="손 씻기·이 닦기 같은 생활 습관 순서, 안전 규칙, 상황에 맞는 고운 말, 물건 정리, 날씨에 맞는 옷차림, 우리를 도와주는 사람들, 그리고 친구의 기분을 놀이로 익히는 유아용 앱입니다."
        nuri={[
          ['신체운동·건강', '순서대로 — 손 씻기, 이 닦기, 밥 먹기, 잠자기 (건강하게 생활하기), 길 건너기·외출하기, 안전할까요? (안전하게 생활하기), 날씨에 맞게 입어요'],
          ['사회관계', '기분 맞추기 (나와 다른 사람의 감정 알기), 뭐라고 말할까요? (예절·더불어 생활하기), 제자리에 정리해요, 누가 도와줄까요? (사회에 관심 가지기)'],
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
