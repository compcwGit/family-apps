import { useState } from 'react'
import { ParentGate, createStore, setSpeechOptions, stopSpeaking, useStars, type SpeechOptions } from '@family/core'
import { JamoBoard } from './JamoBoard'
import { Builder } from './Builder'
import { Trace, type NumRead } from './Trace'
import { Listen } from './Listen'
import { FirstSound } from './FirstSound'
import { ParentInfo } from './ParentInfo'
import './app.css'

type Screen = 'jamo' | 'build' | 'trace' | 'listen' | 'first' | 'gate' | 'parent'

// 읽기 설정 (부모 화면에서 변경). 기본: 아이가 또박또박 들을 수 있게 조금 천천히
const voiceStore = createStore<SpeechOptions>('hangulplay.voice', { rate: 0.75, pitch: 1.2, voice: '' })
setSpeechOptions(voiceStore.get())

// 따라쓰기를 끝낸 자모 목록 (기기 안에만 저장)
const store = createStore<string[]>('hangulplay.done', [])
// 숫자 읽는 소리 (부모 화면에서 선택)
const numStore = createStore<NumRead>('hangulplay.numRead', 'native')

// 한글 놀이: 자모 카드 + 글자 만들기 + 따라쓰기 + 듣고 찾기 + 첫소리 찾기
export default function App() {
  const [screen, setScreen] = useState<Screen>('jamo')
  const [done, setDone] = useState(store.get)
  const [numRead, setNumRead] = useState(numStore.get)
  const [voice, setVoice] = useState(voiceStore.get)
  const stars = useStars('hangulplay.stars')
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
        numRead={numRead}
        onNumRead={(r) => {
          setNumRead(r)
          numStore.set(r)
        }}
        voice={voice}
        onVoice={(v) => {
          setVoice(v)
          voiceStore.set(v)
        }}
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
        {tab('listen', '👂 듣고 찾기')}
        {tab('first', 'ㄱ 첫소리 찾기')}
      </nav>
      {screen === 'jamo' && <JamoBoard done={done} />}
      {screen === 'build' && <Builder />}
      {screen === 'trace' && <Trace done={done} onDone={markDone} numRead={numRead} />}
      {screen === 'listen' && <Listen stars={stars.of('listen')} onStar={() => stars.add('listen')} />}
      {screen === 'first' && <FirstSound stars={stars.of('first')} onStar={() => stars.add('first')} />}
      <button className="core-parent-btn" onClick={() => go('gate')} aria-label="부모 메뉴">
        ⚙️
      </button>
    </main>
  )
}
