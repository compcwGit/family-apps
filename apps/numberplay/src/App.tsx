import { useState } from 'react'
import { ParentGate, createStore, stopSpeaking, useStars } from '@family/core'
import { Counter } from './Counter'
import { Board } from './Board'
import { Count } from './Count'
import { Size } from './Size'
import { Pattern } from './Pattern'
import { ParentInfo } from './ParentInfo'
import type { Mode } from './numbers'
import './app.css'

type Screen = 'count' | 'board' | 'howmany' | 'size' | 'pattern' | 'gate' | 'parent'

// 센 숫자·읽는 방법은 기기 안에만 저장
const store = createStore<{ n: number; mode: Mode }>('numberplay', { n: 0, mode: 'native' })

// 숫자 놀이: 하나씩 세기(1~100) + 100판 + 몇 개일까? + 크기 순서 + 다음은 뭘까?(패턴)
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
    return <ParentInfo mode={data.mode} setMode={(mode) => save({ mode })} onClose={() => go('count')} />

  return (
    <main>
      <nav className="tabs">
        <button className={screen === 'count' ? 'tab on' : 'tab'} onClick={() => go('count')}>
          👆 하나씩 세기
        </button>
        <button className={screen === 'board' ? 'tab on' : 'tab'} onClick={() => go('board')}>
          💯 100판
        </button>
        <button className={screen === 'howmany' ? 'tab on' : 'tab'} onClick={() => go('howmany')}>
          🍎 몇 개일까?
        </button>
        <button className={screen === 'size' ? 'tab on' : 'tab'} onClick={() => go('size')}>
          🐻 크기 순서
        </button>
        <button className={screen === 'pattern' ? 'tab on' : 'tab'} onClick={() => go('pattern')}>
          🔁 다음은 뭘까?
        </button>
      </nav>
      {screen === 'count' && <Counter n={data.n} setN={(n) => save({ n })} mode={data.mode} />}
      {screen === 'board' && <Board counted={data.n} mode={data.mode} />}
      {screen === 'howmany' && <Count {...star('howmany')} mode={data.mode} />}
      {screen === 'size' && <Size {...star('size')} />}
      {screen === 'pattern' && <Pattern {...star('pattern')} />}
      <button className="core-parent-btn" onClick={() => go('gate')} aria-label="부모 메뉴">
        ⚙️
      </button>
    </main>
  )
}
