import { useState, type ReactNode } from 'react'
import { GameTop, Party, speak, useFeedback, useSay, type GameProps } from '@family/core'

// 보기 고르기 공통 틀: 말로 묻고 → 그림 보기 중에서 고르기. 틀려도 벌점 없이 다시, 맞으면 칭찬 + 별
// 소리·이름·누구일까·다리·크기·사는 곳·먹이·그림자 찾기 퀴즈가 모두 이 틀을 씀
export type Option = { id: string; view: ReactNode }
export type Round = {
  ask: string // 묻는 말 (위 말풍선 + 음성)
  prompt?: ReactNode // 문제 그림 (없으면 보기만)
  options: Option[]
  answer: string // 맞는 보기 id
  ok: string // 맞았을 때 칭찬 뒤에 붙일 말
  no: (id: string) => string // 틀렸을 때 말 (고른 보기 id)
  onOk?: () => void
}
export type Make = (stars: number, prev?: Round) => Round

export function Choice({ make, stars, onStar, cols = 2, size = 150 }: GameProps & { make: Make; cols?: number; size?: number }) {
  const [round, setRound] = useState(() => make(stars))
  const fb = useFeedback(onStar)
  useSay(round.ask, [round])

  const tap = (id: string) => {
    if (fb.busy()) return
    if (id === round.answer) fb.ok(round.ok, () => setRound(make(stars + 1, round)))
    else fb.no(id, round.no(id))
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(round.ask)}>
        {round.ask}
      </GameTop>
      {round.prompt && <div className="ch-prompt">{round.prompt}</div>}
      <div className="ch-grid" style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}>
        {round.options.map((o) => (
          <button key={o.id} className={'card' + (fb.wrong === o.id ? ' shake' : '')} style={{ width: size, height: size }} onClick={() => tap(o.id)}>
            {o.view}
          </button>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
