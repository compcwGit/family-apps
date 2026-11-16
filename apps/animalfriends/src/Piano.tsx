import { useState } from 'react'
import { playTone, speak } from '@family/core'
import { ANIMALS } from './animals'

// 동물 피아노: 건반 8개(도~높은 도). 🎵 피아노 소리 / 🐾 동물 울음소리 바꾸기
const KEYS = [
  { note: '도', freq: 262, color: '#EF5350' },
  { note: '레', freq: 294, color: '#FF9800' },
  { note: '미', freq: 330, color: '#FFEB3B' },
  { note: '파', freq: 349, color: '#66BB6A' },
  { note: '솔', freq: 392, color: '#42A5F5' },
  { note: '라', freq: 440, color: '#3F51B5' },
  { note: '시', freq: 494, color: '#AB47BC' },
  { note: '도', freq: 523, color: '#F48FB1' },
]
const ANIMAL_KEYS = ['소', '돼지', '사자', '강아지', '고양이', '오리', '닭', '병아리'].map((n) => ANIMALS.find((a) => a.name === n)!)

export function Piano() {
  const [animal, setAnimal] = useState(false)
  const [hit, setHit] = useState<number | null>(null)
  const press = (i: number) => {
    setHit(i)
    setTimeout(() => setHit((h) => (h === i ? null : h)), 250)
    if (animal) speak(ANIMAL_KEYS[i].sound, KEYS[i].freq)
    else playTone(KEYS[i].freq)
  }
  return (
    <div className="g-game">
      <div className="g-row">
        <button className={'core-btn' + (animal ? ' off' : '')} onClick={() => setAnimal(false)}>
          🎵 피아노
        </button>
        <button className={'core-btn' + (animal ? '' : ' off')} onClick={() => setAnimal(true)}>
          🐾 동물 소리
        </button>
      </div>
      <div className="piano">
        {KEYS.map((k, i) => (
          <button key={i} className={'piano-key' + (hit === i ? ' hit' : '')} style={{ background: k.color }} onPointerDown={() => press(i)}>
            <span className="piano-animal">{ANIMAL_KEYS[i].emoji}</span>
            <span className="piano-note">{k.note}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
