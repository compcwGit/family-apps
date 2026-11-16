import { useState } from 'react'
import { ParentGate, createStore, stopSpeaking } from '@family/core'
import { JamoBoard } from './JamoBoard'
import { Builder } from './Builder'
import { Trace } from './Trace'
import { ParentInfo } from './ParentInfo'
import './app.css'

type Screen = 'jamo' | 'build' | 'trace' | 'gate' | 'parent'

// 따라쓰기를 끝낸 자모 목록 (기기 안에만 저장)
const store = createStore<string[]>('hangulplay.done', [])

// 한글 놀이: 자모 카드 + 글자 만들기 + 따라쓰기
export default function App() {
  const [screen, setScreen] = useState<Screen>('jamo')
  const [done, setDone] = useState(store.get)
  const go = (s: Screen) => {
    stopSpeaking()
    setScreen(s)
  }
  const markDone = (ch: string) => {
    if (done.includes(ch)) return
    const next = [...done, ch]
    setDone(next)
    store.set(next)
  }

  if (screen === 'gate') return <ParentGate onPass={() => go('parent')} onCancel={() => go('jamo')} />
  if (screen === 'parent')
    return (
      <ParentInfo
        doneCount={done.length}
        onReset={() => {
          setDone([])
          store.set([])
        }}
        onClose={() => go('jamo')}
      />
    )

  const tab = (s: Screen, label: string) => (
    <button className={screen === s ? 'tab on' : 'tab'} onClick={() => go(s)}>
      {label}
    </button>
  )

  return (
    <main>
      <nav className="tabs">
        {tab('jamo', '🔤 ㄱㄴㄷ')}
        {tab('build', '🧩 글자 만들기')}
        {tab('trace', '✏️ 따라 쓰기')}
      </nav>
      {screen === 'jamo' && <JamoBoard done={done} />}
      {screen === 'build' && <Builder />}
      {screen === 'trace' && <Trace done={done} onDone={markDone} />}
      <button className="core-parent-btn" onClick={() => go('gate')} aria-label="부모 메뉴">
        ⚙️
      </button>
    </main>
  )
}
