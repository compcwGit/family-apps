import { useState } from 'react'
import { ParentGate, ParentPage, PlayShell, stopSpeaking, useStars, setSpeechOptions } from '@family/core'
import { ShapeMatch } from './ShapeMatch'
import { Sort } from './Sort'
import { Color } from './Color'
import pkg from '../package.json'
import './app.css'

setSpeechOptions({ rate: 0.8 })

const GAMES = [
  { id: 'shape', label: '도형', View: ShapeMatch },
  { id: 'sort', label: '끼리끼리', View: Sort },
  { id: 'color', label: '색칠', View: Color },
] as const
const GAME_NAMES: Record<string, string> = { shape: '도형 맞추기', sort: '끼리끼리', color: '색칠 놀이' }
type Screen = (typeof GAMES)[number]['id'] | 'gate' | 'parent'

// 모양 놀이: 도형 맞추기 + 같은 색·모양끼리 모으기 + 색칠 놀이
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
        about="도형을 같은 모양 자리에 끌어다 맞추고, 같은 색·같은 모양끼리 바구니에 모으고, 그림을 색칠하는 유아용 앱입니다."
        nuri={[
          ['자연탐구', '도형 맞추기, 끼리끼리 모으기 (모양·색 구별, 분류하기)'],
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
