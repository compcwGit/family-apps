import { useState } from 'react'
import { speak, Emo } from '@family/core'
import { CONSONANTS, VOWELS, DOUBLES, type Jamo } from './hangul'
import { jamoLine } from './talk'

// 자모 카드: 누르면 "기역이에요. 기차의 기!" 하고 그림 단어를 보여 줌
export function JamoBoard({ done }: { done: string[] }) {
  const [group, setGroup] = useState<'c' | 'v' | 'd'>('c')
  const [active, setActive] = useState<Jamo | null>(null)
  const list = group === 'c' ? CONSONANTS : group === 'v' ? VOWELS : DOUBLES

  const tap = (j: Jamo) => {
    speak(jamoLine(j))
    setActive(j)
  }

  return (
    <div className="board">
      <div className="seg">
        <button className={group === 'c' ? 'seg-btn on' : 'seg-btn'} onClick={() => setGroup('c')}>
          자음 ㄱㄴㄷ
        </button>
        <button className={group === 'v' ? 'seg-btn on' : 'seg-btn'} onClick={() => setGroup('v')}>
          모음 ㅏㅑㅓ
        </button>
        <button className={group === 'd' ? 'seg-btn on' : 'seg-btn'} onClick={() => setGroup('d')}>
          쌍·겹 ㄲㅐ
        </button>
      </div>

      {active && (
        <button className="hero" style={{ background: active.color }} onClick={() => tap(active)}>
          <span className="hero-ch">{active.ch}</span>
          <span className="hero-word">
            <span className="hero-emoji"><Emo e={active.emoji} /></span>
            {active.word}
          </span>
        </button>
      )}

      <div className="jamo-grid">
        {list.map((j) => (
          <button
            key={j.ch}
            className={active?.ch === j.ch ? 'jamo on' : 'jamo'}
            style={{ background: j.color }}
            onClick={() => tap(j)}
          >
            {j.ch}
            {done.includes(j.ch) && <span className="badge">⭐</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
