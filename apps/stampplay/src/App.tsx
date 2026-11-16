import { useState } from 'react'
import { ParentGate, getPlatform, playTone } from '@family/core'
import './app.css'

// 임시 첫 화면: 동물 버튼판 (StampPlay 본 화면이 생기면 교체 — Issue 참고)
const ANIMALS = [
  { emoji: '🐶', name: '강아지', freq: 523, color: '#FFB74D' },
  { emoji: '🐱', name: '고양이', freq: 659, color: '#F06292' },
  { emoji: '🐮', name: '소', freq: 262, color: '#81C784' },
  { emoji: '🐷', name: '돼지', freq: 392, color: '#F48FB1' },
  { emoji: '🐸', name: '개구리', freq: 784, color: '#AED581' },
  { emoji: '🦁', name: '사자', freq: 196, color: '#FFD54F' },
]

export default function App() {
  const [active, setActive] = useState<string | null>(null)
  const [parent, setParent] = useState<'closed' | 'gate' | 'open'>('closed')

  const tap = (name: string, freq: number) => {
    playTone(freq)
    setActive(name)
    setTimeout(() => setActive(null), 400)
  }

  if (parent === 'gate') return <ParentGate onPass={() => setParent('open')} onCancel={() => setParent('closed')} />
  if (parent === 'open')
    return (
      <main>
        <h1>부모 화면</h1>
        <p>여기에 도장 찍기, 기록 보기가 들어갈 예정이에요.</p>
        <button className="core-btn" onClick={() => setParent('closed')}>돌아가기</button>
      </main>
    )

  return (
    <main>
      <h1>동물 친구들</h1>
      <div className="grid">
        {ANIMALS.map((a) => (
          <button
            key={a.name}
            className={active === a.name ? 'card pop' : 'card'}
            style={{ background: a.color }}
            onClick={() => tap(a.name, a.freq)}
          >
            <span className="emoji">{a.emoji}</span>
            <span className="label">{a.name}</span>
          </button>
        ))}
      </div>
      <footer>실행 환경: {getPlatform()}</footer>
      <button className="core-parent-btn" onClick={() => setParent('gate')} aria-label="부모 메뉴">⚙️</button>
    </main>
  )
}
