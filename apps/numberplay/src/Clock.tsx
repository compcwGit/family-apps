import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, pick, type GameProps } from '@family/core'
import { SAY, hourText } from './voice'

// 시계 보기: 바늘 시계를 보고 몇 시인지 고르기. 별 5개 전에는 정각만, 그다음 "반"(30분)도
function makeRound(half: boolean, prev?: string) {
  let h = 1
  let m = 0
  do {
    h = 1 + Math.floor(Math.random() * 12)
    m = half && Math.random() < 0.5 ? 30 : 0
  } while (`${h}:${m}` === prev)
  const others = new Set<string>()
  while (others.size < 2) {
    const oh = ((h - 1 + pick([-3, -2, -1, 1, 2, 3]) + 12) % 12) + 1
    const om = half ? pick([0, 30]) : 0
    if (!(oh === h && om === m)) others.add(`${oh}:${om}`)
  }
  const choices = shuffle([`${h}:${m}`, ...others]).map((s) => s.split(':').map(Number) as [number, number])
  return { h, m, choices }
}

function Face({ h, m }: { h: number; m: number }) {
  const ha = ((h % 12) + m / 60) * 30 // 시침 각도
  const ma = m * 6
  return (
    <svg className="clock" viewBox="0 0 200 200" role="img" aria-label="시계">
      <circle cx="100" cy="100" r="92" className="clock-face" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i + 1) * 30 * Math.PI) / 180
        return (
          <text key={i} x={100 + 72 * Math.sin(a)} y={100 - 72 * Math.cos(a) + 9} className="clock-num">
            {i + 1}
          </text>
        )
      })}
      <line x1="100" y1="100" x2={100 + 42 * Math.sin((ha * Math.PI) / 180)} y2={100 - 42 * Math.cos((ha * Math.PI) / 180)} className="clock-hour" />
      <line x1="100" y1="100" x2={100 + 66 * Math.sin((ma * Math.PI) / 180)} y2={100 - 66 * Math.cos((ma * Math.PI) / 180)} className="clock-min" />
      <circle cx="100" cy="100" r="7" className="clock-pin" />
    </svg>
  )
}

export function Clock({ stars, onStar }: GameProps) {
  const half = stars >= 5
  const [round, setRound] = useState(() => makeRound(half))
  const fb = useFeedback(onStar)
  const ask = SAY.clockAsk
  useSay(ask, [round])

  const choose = (h: number, m: number) => {
    if (h !== round.h || m !== round.m) return fb.no(`${h}:${m}`, SAY.clockNo)
    fb.ok(SAY.clockOk(hourText(h, m)), () => setRound(makeRound(half, `${h}:${m}`)))
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        몇 시일까요?
      </GameTop>
      <Face h={round.h} m={round.m} />
      <div className="g-row">
        {round.choices.map(([h, m]) => (
          <button
            key={`${h}:${m}`}
            className={'g-card clock-card' + (fb.wrong === `${h}:${m}` ? ' g-shake' : '') + (fb.party && h === round.h && m === round.m ? ' ok' : '')}
            onClick={() => choose(h, m)}
          >
            {h}시{m ? ' 반' : ''}
          </button>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
