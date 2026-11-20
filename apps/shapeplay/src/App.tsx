import { useState } from 'react'
import { ParentGate, ParentPage, PlayShell, stopSpeaking, useStars, setSpeechOptions } from '@family/core'
import { ShapeMatch } from './ShapeMatch'
import { Sort } from './Sort'
import { Color } from './Color'
import { Tangram } from './Tangram'
import { Memory } from './Memory'
import { Dots } from './Dots'
import { Spot } from './Spot'
import { Place } from './Place'
import pkg from '../package.json'
import './app.css'

setSpeechOptions({ rate: 0.8 })

const GAMES = [
  { id: 'shape', label: '도형', View: ShapeMatch },
  { id: 'sort', label: '끼리끼리', View: Sort },
  { id: 'color', label: '색칠', View: Color },
  { id: 'tangram', label: '칠교', View: Tangram },
  { id: 'memory', label: '짝 찾기', View: Memory },
  { id: 'dots', label: '점 잇기', View: Dots },
  { id: 'spot', label: '다른 곳', View: Spot },
  { id: 'place', label: '위치', View: Place },
] as const
const GAME_NAMES: Record<string, string> = {
  shape: '도형 맞추기', sort: '끼리끼리', color: '색칠 놀이', tangram: '칠교놀이', memory: '카드 짝 찾기', dots: '점 잇기', spot: '다른 그림 찾기', place: '위치 놀이',
}
type Screen = (typeof GAMES)[number]['id'] | 'gate' | 'parent'

// 모양 놀이: 도형 맞추기, 끼리끼리, 색칠, 칠교, 카드 짝 찾기, 점 잇기, 다른 그림 찾기, 위치 놀이
export default function App() {
  const [screen, setScreen] = useState<Screen>('shape')
  const stars = useStars('shapeplay.stars')
  const go = (s: Screen) => {
    stopSpeaking()
    setScreen(s)
  }

  if (screen === 'gate') return <ParentGate onPass={() => go('parent')} onCancel={() => go('shape')} />
  if (screen === 'parent')
    return (
      <ParentPage
        title="모양 놀이"
        version={pkg.version}
        accent="#B79CF7"
        about="도형 맞추기, 같은 색·모양끼리 모으기, 색칠, 칠교, 카드 짝 찾기, 점 잇기, 다른 그림 찾기, 위·아래·안·옆 위치 놀이가 들어 있는 유아용 앱입니다."
        nuri={[
          ['자연탐구', '도형 맞추기, 끼리끼리 모으기, 칠교놀이, 점 잇기 (모양·색 구별, 분류하기), 위치 놀이 (공간 개념), 카드 짝 찾기, 다른 그림 찾기 (관찰·탐구)'],
          ['예술경험', '색칠 놀이 (색으로 표현하기)'],
        ]}
        stars={GAMES.map((g) => [GAME_NAMES[g.id], stars.of(g.id)] as [string, number])}
        onReset={stars.reset}
        onClose={() => go('shape')}
      />
    )

  const game = GAMES.find((g) => g.id === screen)!
  return (
    <PlayShell app="모양 놀이" accent="#B79CF7" games={GAMES} active={screen} onPick={(id) => go(id as Screen)} onParent={() => go('gate')}>
      <game.View key={game.id} stars={stars.of(game.id)} onStar={() => stars.add(game.id)} />
    </PlayShell>
  )
}
