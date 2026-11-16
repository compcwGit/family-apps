import { useState } from 'react'
import { ParentGate, createStore, stopSpeaking } from '@family/core'
import { Counter } from './Counter'
import { Board } from './Board'
import { ParentInfo } from './ParentInfo'
import type { Mode } from './numbers'
import './app.css'

type Screen = 'count' | 'board' | 'gate' | 'parent'

// 센 숫자·읽는 방법은 기기 안에만 저장
const store = createStore<{ n: number; mode: Mode }>('numberplay', { n: 0, mode: 'native' })

// 숫자 놀이: 하나씩 세기(1~100) + 100판
export default function App() {
  const [screen, setScreen] = useState<Screen>('count')
  const [data, setData] = useState(store.get)
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
      </nav>
      {screen === 'count' ? (
        <Counter n={data.n} setN={(n) => save({ n })} mode={data.mode} />
      ) : (
        <Board counted={data.n} mode={data.mode} />
      )}
      <button className="core-parent-btn" onClick={() => go('gate')} aria-label="부모 메뉴">
        ⚙️
      </button>
    </main>
  )
}
