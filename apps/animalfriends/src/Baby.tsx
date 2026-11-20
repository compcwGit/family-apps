import { useState } from 'react'
import { Critter, speak } from '@family/core'
import { BABIES, byName } from './animals'
import { usePortrait } from './usePortrait'
import { SAY } from './voice'

// 엄마와 아기: 엄마 카드를 누르면 아기가 나옴. 병아리만 따로 그림이 있고, 나머지는 엄마 그림을 작게 보여 줌
export function Baby() {
  const [open, setOpen] = useState<string[]>([])
  const portrait = usePortrait()
  const tap = (mother: string, baby: string) => {
    speak(SAY.babyShow(mother, baby), byName(mother).freq)
    setOpen((o) => (o.includes(mother) ? o : [...o, mother]))
  }
  return (
    <div className="baby">
      <p className="baby-hint">{SAY.babyTap}</p>
      <div className="baby-grid">
        {BABIES.map((b) => {
          const m = byName(b.mother)
          const shown = open.includes(b.mother)
          return (
            <button key={b.mother} className={'card baby-card' + (shown ? ' pop' : '')} onClick={() => tap(b.mother, b.baby)}>
              <div className="baby-row">
                <Critter kind={m.critter} size={portrait ? 96 : 140} />
                {shown ? <Critter kind={b.critter ?? m.critter} size={portrait ? (b.critter ? 80 : 60) : b.critter ? 110 : 80} /> : <span className="baby-q">?</span>}
              </div>
              <span className="label">{shown ? b.baby : m.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
