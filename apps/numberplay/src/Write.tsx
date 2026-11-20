import { useState } from 'react'
import { TracePad, DIGIT_STROKES, playTone, speak, praise, cheer, GameTop, type GameProps } from '@family/core'
import { readNumber, type Mode } from './numbers'

// 숫자 따라 쓰기: 1~9, 0 순서로. 다 쓰면 별 (그리는 판·판정은 한글 놀이와 같은 core TracePad)
const ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
const read = (d: number, mode: Mode) => (d === 0 ? '영' : readNumber(d, mode))

export function Write({ stars, onStar, mode }: GameProps & { mode: Mode }) {
  const [idx, setIdx] = useState(0)
  const [step, setStep] = useState(0)
  const [msg, setMsg] = useState('')
  const d = ORDER[idx]
  const strokes = DIGIT_STROKES[d]
  const finished = step >= strokes.length

  const go = (i: number) => {
    setIdx((i + ORDER.length) % ORDER.length)
    setStep(0)
    setMsg('')
  }
  const onStroke = (ok: boolean) => {
    if (!ok) {
      const c = cheer()
      setMsg(c)
      return speak(c, 220)
    }
    const next = step + 1
    setStep(next)
    if (next < strokes.length) return playTone(660)
    const p = praise()
    setMsg(`${p} ⭐`)
    speak(`${p} ${read(d, mode)}!`)
    onStar()
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(read(d, mode))}>
        숫자를 따라 써요
      </GameTop>
      <div className="write-top">
        <button className="write-arrow" onClick={() => go(idx - 1)} aria-label="이전">◀</button>
        <button className="write-title" onClick={() => speak(read(d, mode))}>
          {d} <small>{read(d, mode)}</small>
        </button>
        <button className="write-arrow" onClick={() => go(idx + 1)} aria-label="다음">▶</button>
      </div>
      <TracePad key={idx} strokes={strokes} step={step} onStart={() => setMsg('')} onStroke={onStroke} />
      <p className="write-msg">{msg || (finished ? '' : `${step + 1}번 획을 그려요`)}</p>
      {finished && (
        <div className="row">
          <button className="sb-pill" onClick={() => go(idx)}>다시 쓰기</button>
          <button className="sb-pill" onClick={() => go(idx + 1)}>다음 숫자 ▶</button>
        </div>
      )}
    </div>
  )
}
