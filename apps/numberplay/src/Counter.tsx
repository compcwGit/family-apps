import { useState } from 'react'
import { speak, playTone } from '@family/core'
import { readNumber, ROW_COLORS, type Mode } from './numbers'

// 하나씩 세기: 화면을 누를 때마다 1씩 늘고 소리로 읽어 줌
// 아래에 "10개 묶음(막대) + 낱개(점)"로 수의 크기를 보여 줌
export function Counter({ n, setN, mode }: { n: number; setN: (n: number) => void; mode: Mode }) {
  const [pop, setPop] = useState(false)

  const say = (v: number) => {
    const word = readNumber(v, mode)
    if (v === 100) speak(`${word}! 다 셌어요! 최고!`, 784)
    else if (v % 10 === 0) speak(`${word}! 잘했어요!`, 659)
    else speak(word, 523)
  }

  const next = () => {
    if (n >= 100) return
    const v = n + 1
    setN(v)
    say(v)
    if (v % 10 === 0) playTone(880)
    setPop(true)
    setTimeout(() => setPop(false), 300)
  }
  const back = () => n > 0 && (setN(n - 1), n - 1 > 0 && say(n - 1))
  const reset = () => setN(0)

  const tens = Math.floor(n / 10)
  const ones = n % 10

  return (
    <div className="counter">
      <button className={pop ? 'big pop' : 'big'} onClick={next} disabled={n >= 100}
              style={{ background: ROW_COLORS[Math.min(tens, 9)] }}>
        <span className="big-num">{n === 0 ? '👆' : n}</span>
        <span className="big-word">{n === 0 ? '눌러서 세어 봐요' : readNumber(n, mode)}</span>
      </button>

      {n === 100 && <p className="party">🎉 100까지 다 셌어요! 🎉</p>}

      <div className="blocks" aria-hidden>
        {Array.from({ length: tens }, (_, i) => (
          <span key={'t' + i} className="ten" style={{ background: ROW_COLORS[i] }} />
        ))}
        {Array.from({ length: ones }, (_, i) => (
          <span key={'o' + i} className="one" style={{ background: ROW_COLORS[Math.min(tens, 9)] }} />
        ))}
      </div>

      <div className="row">
        <button className="core-btn" onClick={back} disabled={n === 0}>◀ 하나 빼기</button>
        <button className="core-btn" onClick={reset}>🔄 처음부터</button>
      </div>
    </div>
  )
}
