import { useState } from 'react'
import { playTone, speak, TracePad } from '@family/core'
import { ALL_JAMO, NUMBERS } from './hangul'
import { cheer, praise } from './talk'
import { SAY } from './voice'

// 따라쓰기: 초록 점에서 시작해 회색 길을 따라 그리기. 획 순서대로 하나씩 (그리는 판·판정은 core TracePad)

export type NumRead = 'native' | 'sino' // 하나·둘 / 일·이

export function Trace({ done, onDone, numRead }: { done: string[]; onDone: (ch: string) => void; numRead: NumRead }) {
  const [set, setSet] = useState<'h' | 'n'>('h') // 한글 / 숫자
  const [idx, setIdx] = useState(0)
  const [step, setStep] = useState(0) // 지금 그릴 획 번호
  const [msg, setMsg] = useState('')

  const list = set === 'h' ? ALL_JAMO : NUMBERS
  const j = list[idx]
  const finished = step >= j.strokes.length
  const label = set === 'n' && numRead === 'native' ? j.word : j.name // 숫자 읽는 소리

  const go = (i: number) => {
    setIdx((i + list.length) % list.length)
    setStep(0)
    setMsg('')
  }

  const onStroke = (ok: boolean) => {
    if (ok) {
      const next = step + 1
      setStep(next)
      if (next >= j.strokes.length) {
        const p = praise()
        speak(SAY.traceDone(p, label))
        setMsg(`${p} ⭐`)
        onDone(j.ch)
      } else playTone(660)
    } else {
      const c = cheer()
      setMsg(c)
      speak(c, 220)
    }
  }

  return (
    <div className="board">
      <div className="seg">
        {(['h', 'n'] as const).map((s) => (
          <button
            key={s}
            className={set === s ? 'seg-btn on' : 'seg-btn'}
            onClick={() => {
              setSet(s)
              setIdx(0)
              setStep(0)
              setMsg('')
            }}
          >
            {s === 'h' ? '한글 ㄱㅏ' : '숫자 123'}
          </button>
        ))}
      </div>
      <div className="trace-top">
        <button className="arrow" onClick={() => go(idx - 1)} aria-label="이전">◀</button>
        <button className="trace-title" onClick={() => speak(label)}>
          {j.ch} <small>{label}</small> {done.includes(j.ch) && '⭐'}
        </button>
        <button className="arrow" onClick={() => go(idx + 1)} aria-label="다음">▶</button>
      </div>

      <TracePad key={`${set}-${idx}`} strokes={j.strokes} step={step} onStart={() => setMsg('')} onStroke={onStroke} />

      <p className="trace-msg">{msg || (finished ? '' : `${step + 1}번 획을 그려요`)}</p>
      {finished && (
        <div className="trace-actions">
          <button className="core-btn" onClick={() => go(idx)}>다시 쓰기</button>
          <button className="core-btn" onClick={() => go(idx + 1)}>다음 글자 ▶</button>
        </div>
      )}
    </div>
  )
}
