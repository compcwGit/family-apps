import { useState } from 'react'
import { ParentGate, ParentPage, ParentSection, PlayShell, Segmented, createStore, stopSpeaking, useStars } from '@family/core'
import { Counter } from './Counter'
import { Board } from './Board'
import { Count } from './Count'
import { Size } from './Size'
import { Pattern } from './Pattern'
import { MathPlay } from './Math'
import { Write } from './Write'
import { Skip } from './Skip'
import { Clock } from './Clock'
import type { Mode } from './numbers'
import pkg from '../package.json'
import './app.css'

const GAMES = [
  { id: 'count', label: '세기' },
  { id: 'board', label: '100판' },
  { id: 'howmany', label: '몇 개' },
  { id: 'size', label: '크기' },
  { id: 'pattern', label: '다음은?' },
  { id: 'math', label: '더하기' },
  { id: 'write', label: '쓰기' },
  { id: 'skip', label: '뛰어 세기' },
  { id: 'clock', label: '시계' },
] as const
type Screen = (typeof GAMES)[number]['id'] | 'gate' | 'parent'

// 센 숫자·읽는 방법은 기기 안에만 저장
const store = createStore<{ n: number; mode: Mode }>('numberplay', { n: 0, mode: 'native' })

// 숫자 놀이: 하나씩 세기(1~100) + 100판 + 몇 개일까? + 크기 순서 + 다음은 뭘까?(패턴) + 더하기·빼기 + 따라 쓰기 + 뛰어 세기 + 시계
export default function App() {
  const [screen, setScreen] = useState<Screen>('count')
  const [data, setData] = useState(store.get)
  const stars = useStars('numberplay.stars')
  const star = (id: string) => ({ stars: stars.of(id), onStar: () => stars.add(id) })
  const save = (d: Partial<typeof data>) => {
    const v = { ...data, ...d }
    setData(v)
    store.set(v)
  }
  const go = (s: Screen) => {
    stopSpeaking()
    setScreen(s)
  }

  if (screen === 'gate') return <ParentGate onPass={() => go('parent')} onCancel={() => go('count')} />
  if (screen === 'parent')
    return (
      <ParentPage
        title="숫자 놀이"
        version={pkg.version}
        accent="#FFC94A"
        about="화면을 누를 때마다 숫자를 하나씩 세며 1부터 100까지 소리로 읽어 주고, 그림 개수 세기·크기 순서·규칙 찾기·그림 더하기와 빼기·숫자 따라 쓰기·거꾸로와 뛰어 세기·시계 보기 놀이가 들어 있는 유아용 앱입니다."
        nuri={[
          ['자연탐구', '하나씩 세기, 100판, 몇 개일까?, 거꾸로·뛰어 세기 (수 세기), 더하기·빼기 그림 (수 더하고 빼기), 크기 순서 (비교·순서), 다음은 뭘까? (규칙성), 시계 보기 (시간 개념)'],
          ['의사소통', '숫자 따라 쓰기 (쓰기에 관심 가지기)'],
        ]}
        stars={[
          ['몇 개일까?', stars.of('howmany')],
          ['크기 순서', stars.of('size')],
          ['다음은 뭘까?', stars.of('pattern')],
          ['더하기·빼기', stars.of('math')],
          ['숫자 따라 쓰기', stars.of('write')],
          ['거꾸로·뛰어 세기', stars.of('skip')],
          ['시계 보기', stars.of('clock')],
        ]}
        onReset={stars.reset}
        onClose={() => go('count')}
      >
        <ParentSection title="숫자 읽는 방법">
          <Segmented
            label="숫자 읽는 방법"
            value={data.mode}
            options={[
              ['native', '하나, 둘, 셋'],
              ['sino', '일, 이, 삼'],
            ]}
            onChange={(mode) => save({ mode })}
          />
          <p className="muted">"하나, 둘"은 99(아흔아홉)까지, 100은 "백"으로 읽습니다. 센 숫자: {data.n}</p>
        </ParentSection>
      </ParentPage>
    )

  return (
    <PlayShell app="숫자 놀이" accent="#FFC94A" games={GAMES} active={screen} onPick={(id) => go(id as Screen)} onParent={() => go('gate')}>
      {screen === 'count' && <Counter n={data.n} setN={(n) => save({ n })} mode={data.mode} />}
      {screen === 'board' && <Board counted={data.n} mode={data.mode} />}
      {screen === 'howmany' && <Count {...star('howmany')} mode={data.mode} />}
      {screen === 'size' && <Size {...star('size')} />}
      {screen === 'pattern' && <Pattern {...star('pattern')} />}
      {screen === 'math' && <MathPlay {...star('math')} mode={data.mode} />}
      {screen === 'write' && <Write {...star('write')} mode={data.mode} />}
      {screen === 'skip' && <Skip {...star('skip')} mode={data.mode} />}
      {screen === 'clock' && <Clock {...star('clock')} />}
    </PlayShell>
  )
}
