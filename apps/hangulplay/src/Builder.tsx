import { useState } from 'react'
import { speak } from '@family/core'
import { CONSONANTS, VOWELS, compose } from './hangul'

// 글자 만들기: 자음 하나 + 모음 하나를 고르면 글자가 짠! (ㄱ + ㅏ = 가)
export function Builder() {
  const [c, setC] = useState('ㄱ')
  const [v, setV] = useState('ㅏ')
  const [pop, setPop] = useState(0)
  const syl = compose(c, v)

  const pick = (nc: string, nv: string) => {
    setC(nc)
    setV(nv)
    setPop((p) => p + 1)
    speak(compose(nc, nv))
  }

  return (
    <div className="board">
      <div className="formula">
        <span className="f-part">{c}</span>
        <span className="f-op">+</span>
        <span className="f-part">{v}</span>
        <span className="f-op">=</span>
        <button key={pop} className="f-result" onClick={() => speak(syl)}>
          {syl}
        </button>
      </div>

      <div className="pick-row">
        {CONSONANTS.map((j) => (
          <button key={j.ch} className={c === j.ch ? 'pick on' : 'pick'} style={{ background: j.color }} onClick={() => pick(j.ch, v)}>
            {j.ch}
          </button>
        ))}
      </div>
      <div className="pick-row">
        {VOWELS.map((j) => (
          <button key={j.ch} className={v === j.ch ? 'pick on' : 'pick'} style={{ background: j.color }} onClick={() => pick(c, j.ch)}>
            {j.ch}
          </button>
        ))}
      </div>
    </div>
  )
}
