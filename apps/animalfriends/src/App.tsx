import { useState } from 'react'
import { ParentGate, ParentPage, PlayShell, stopSpeaking, useStars } from '@family/core'
import { AnimalBoard } from './AnimalBoard'
import { Quiz } from './Quiz'
import { Shadow } from './Shadow'
import { Piano } from './Piano'
import pkg from '../package.json'
import './app.css'

const GAMES = [
  { id: 'play', label: '친구' },
  { id: 'quiz', label: '퀴즈' },
  { id: 'shadow', label: '그림자' },
  { id: 'piano', label: '피아노' },
] as const
type Screen = (typeof GAMES)[number]['id'] | 'gate' | 'parent'

// 동물 친구들: 동물 버튼판 + "누구일까요?" 퀴즈 + 그림자 맞추기 + 동물 피아노
export default function App() {
  const [screen, setScreen] = useState<Screen>('play')
  const stars = useStars('animalfriends.stars')
  const go = (s: Screen) => {
    stopSpeaking()
    setScreen(s)
  }

  if (screen === 'gate') return <ParentGate onPass={() => go('parent')} onCancel={() => go('play')} />
  if (screen === 'parent')
    return (
      <ParentPage
        title="동물 친구들"
        version={pkg.version}
        accent="#FF8C6B"
        about='동물을 누르면 이름과 울음소리를 들려주고, "누구일까요?" 퀴즈로 울음소리를 맞혀 보고, 그림자 맞추기와 동물 피아노로 노는 유아용 앱입니다.'
        nuri={[
          ['의사소통', '친구, 퀴즈 (소리 듣고 이름 알기)'],
          ['자연탐구', '그림자 맞추기 (모양 비교하기)'],
          ['예술경험', '동물 피아노 (소리·리듬 즐기기)'],
        ]}
        stars={[['그림자 맞추기', stars.of('shadow')]]}
        onReset={stars.reset}
        onClose={() => go('play')}
      />
    )

  return (
    <PlayShell app="동물 친구들" accent="#FF8C6B" games={GAMES} active={screen} onPick={(id) => go(id as Screen)} onParent={() => go('gate')}>
      {screen === 'play' && <AnimalBoard />}
      {screen === 'quiz' && <Quiz />}
      {screen === 'shadow' && <Shadow stars={stars.of('shadow')} onStar={() => stars.add('shadow')} />}
      {screen === 'piano' && <Piano />}
    </PlayShell>
  )
}
