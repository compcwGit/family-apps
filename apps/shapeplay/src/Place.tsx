import { useState } from 'react'
import { useDrag, useFeedback, useSay, Party, GameTop, speak, pick, type GameProps } from '@family/core'
import { PLACE_THINGS, PLACE_SPOTS, SAY } from './voice'

// 위치 놀이: "곰을 상자 위에 놓아요" → 곰을 상자 위·아래·안·옆 자리 중 맞는 곳에 끌어다 놓기
function makeRound(prev?: string) {
  let spot = pick(PLACE_SPOTS)
  while (spot.id === prev) spot = pick(PLACE_SPOTS)
  return { thing: pick(PLACE_THINGS), spot }
}

export function Place({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(() => makeRound())
  const [placed, setPlaced] = useState<string | null>(null)
  const fb = useFeedback(onStar)
  const { thing, spot } = round
  const ask = SAY.placeAsk(thing.name, spot.name)
  useSay(ask, [round])

  const drag = useDrag((_, drop) => {
    if (!drop) return
    if (drop !== spot.id) return fb.no('thing', SAY.placeNo(PLACE_SPOTS.find((s) => s.id === drop)!.name))
    setPlaced(drop)
    fb.ok(SAY.placeOk(thing.name, spot.name), () => {
      setPlaced(null)
      setRound(makeRound(spot.id))
    })
  })

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        {thing.e} {SAY.placeTitle(thing.name, spot.name)}
      </GameTop>
      <div className="place-scene">
        {PLACE_SPOTS.map((s) => (
          <div key={s.id} className={'place-spot place-' + s.id} data-drop={s.id}>
            {placed === s.id ? <span className="place-thing">{thing.e}</span> : <span className="place-label">{s.name}</span>}
          </div>
        ))}
        <div className="place-box" aria-hidden>
          <div className="place-box-back" />
          <div className="place-box-front">상자</div>
        </div>
      </div>
      <div className="g-row g-tray">
        {!placed && (
          <div className={'g-piece place-piece' + (fb.wrong === 'thing' ? ' g-shake' : '')} {...drag.handle('thing')} style={drag.style('thing')}>
            {thing.e}
          </div>
        )}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
