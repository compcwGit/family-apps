import { useState } from 'react'
import { Critter, speak } from '@family/core'
import { ANIMALS } from './animals'

// 동물 버튼판: 누르면 "강아지! 멍멍!" 하고 통통 튐
export function AnimalBoard() {
  const [active, setActive] = useState<string | null>(null)

  const tap = (name: string, sound: string, freq: number) => {
    speak(`${name}! ${sound}!`, freq)
    setActive(name)
    setTimeout(() => setActive(null), 500)
  }

  return (
    <div className="grid">
      {ANIMALS.map((a) => (
        <button
          key={a.name}
          className={active === a.name ? 'card pop' : 'card'}
          onClick={() => tap(a.name, a.sound, a.freq)}
        >
          <Critter kind={a.critter} size={110} />
          <span className="label">{a.name}</span>
        </button>
      ))}
    </div>
  )
}
