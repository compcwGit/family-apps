import { useState } from 'react'
import { playTone } from '@family/core'

// 동물 버튼판 (#10 결정 전까지 첫 화면의 작은 버튼으로 유지)
const ANIMALS = [
  { emoji: '🐶', name: '강아지', freq: 523, color: '#FFB74D' },
  { emoji: '🐱', name: '고양이', freq: 659, color: '#F06292' },
  { emoji: '🐮', name: '소', freq: 262, color: '#81C784' },
  { emoji: '🐷', name: '돼지', freq: 392, color: '#F48FB1' },
  { emoji: '🐸', name: '개구리', freq: 784, color: '#AED581' },
  { emoji: '🦁', name: '사자', freq: 196, color: '#FFD54F' },
]

export function AnimalBoard() {
  const [active, setActive] = useState<string | null>(null)

  const tap = (name: string, freq: number) => {
    playTone(freq)
    setActive(name)
    setTimeout(() => setActive(null), 400)
  }

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
    </main>
  )
}
