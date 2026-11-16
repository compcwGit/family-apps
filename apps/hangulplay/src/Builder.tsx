import { useState } from 'react'
import { speak } from '@family/core'
import { CONSONANTS, VOWELS, compose } from './hangul'

// 글자 만들기: 자음 + 모음 (+ 받침)을 고르면 글자가 짠! (ㄱ + ㅏ = 가, ㄱ + ㅏ + ㅁ = 감)
export function Builder() {
  const [c, setC] = useState('ㄱ')
  const [v, setV] = useState('ㅏ')
  const [b, setB] = useState('') // '' = 받침 없음
  const [pop, setPop] = useState(0)
  const syl = compose(c, v, b)

  const pick = (nc: string, nv: string, nb: string) => {
    setC(nc)
    setV(nv)
    setB(nb)
    setPop((p) => p + 1)
    speak(compose(nc, nv, nb))
  }

  return (
    <div className="board">
      <div className="formula">
        <span className="f-part">{c}</span>
        <span className="f-op">+</span>
        <span className="f-part">{v}</span>
        {b && (
          <>
            <span className="f-op">+</span>
            <span className="f-part">{b}</span>
          </>
        )}
        <span className="f-op">=</span>
        <button key={pop} className="f-result" onClick={() => speak(syl)}>
          {syl}
        </button>
      </div>

      <p className="pick-label">자음</p>
      <div className="pick-row">
        {CONSONANTS.map((j) => (
          <button key={j.ch} className={c === j.ch ? 'pick on' : 'pick'} style={{ background: j.color }} onClick={() => pick(j.ch, v, b)}>
            {j.ch}
          </button>
        ))}
      </div>
      <p className="pick-label">모음</p>
      <div className="pick-row">
        {VOWELS.map((j) => (
          <button key={j.ch} className={v === j.ch ? 'pick on' : 'pick'} style={{ background: j.color }} onClick={() => pick(c, j.ch, b)}>
            {j.ch}
          </button>
        ))}
      </div>
      <p className="pick-label">받침</p>
      <div className="pick-row">
        <button className={b === '' ? 'pick none on' : 'pick none'} onClick={() => pick(c, v, '')}>
          없음
        </button>
        {CONSONANTS.map((j) => (
          <button key={j.ch} className={b === j.ch ? 'pick on' : 'pick'} style={{ background: j.color }} onClick={() => pick(c, v, j.ch)}>
            {j.ch}
          </button>
        ))}
      </div>
    </div>
  )
}
