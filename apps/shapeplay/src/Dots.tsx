import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, playTone, type GameProps, Emo } from '@family/core'
import { DOT_PICS, SAY } from './voice'

// 점 잇기: 1, 2, 3… 순서대로 점을 누르면 선이 이어지고, 다 이으면 그림이 나타남
export function Dots({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(0)
  const [n, setN] = useState(1) // 이은 점 개수 (1번 점은 처음부터 시작점)
  const fb = useFeedback(onStar)
  const pic = DOT_PICS[round % DOT_PICS.length]
  const pts = pic.pts
  const done = n >= pts.length
  useSay(SAY.dotsAsk, [round])

  const tap = (i: number) => {
    if (done || i < n) return
    if (i !== n) return fb.no(`d${i}`, SAY.dotsNo(n + 1))
    const next = n + 1
    setN(next)
    if (next < pts.length) return playTone(523 + next * 20)
    fb.ok(SAY.dotsOk(pic.name), () => {
      setRound(round + 1)
      setN(1)
    })
  }

  const line = [...pts.slice(0, n), ...(done ? [pts[0]] : [])].map((p) => p.join(',')).join(' ')
  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(SAY.dotsAsk)}>
        {done ? pic.name : '1, 2, 3… 차례로 이어요'}
      </GameTop>
      <div className="dots-wrap">
      <svg className="dots-board" viewBox="0 0 200 200" role="img" aria-label="점 잇기">
        {done && <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={pic.color} className="dots-fill" />}
        <polyline points={line} className="dots-line" />
        {pts.map(([x, y], i) => (
          <g key={i} className={'dots-dot' + (i < n ? ' on' : '') + (i === n ? ' next' : '') + (fb.wrong === `d${i}` ? ' g-shake' : '')} onClick={() => tap(i)}>
            <circle cx={x} cy={y} r="14" className="dots-hit" />
            <circle cx={x} cy={y} r="6" />
            <text x={x} y={y - 11}>{i + 1}</text>
          </g>
        ))}
      </svg>
      {done && <span className="dots-emoji"><Emo e={pic.icon} /></span>}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
