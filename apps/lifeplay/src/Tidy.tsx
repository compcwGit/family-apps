import { useState } from 'react'
import { useDrag, useFeedback, useSay, Party, GameTop, speak, shuffle, pick, Emo, type GameProps } from '@family/core'
import { PLACES, SAY } from './voice'

// 제자리에 정리해요: 흩어진 물건을 알맞은 곳(장난감 상자·옷장·싱크대·책꽂이)에 끌어다 넣기
function makeRound() {
  const places = shuffle(PLACES).slice(0, 2)
  const items = places.flatMap((p) => shuffle(p.items).slice(0, 3).map((e, i) => ({ id: `${p.id}${i}`, place: p.id, e })))
  return { places, items: shuffle(items) }
}

export function Tidy({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(makeRound)
  const [done, setDone] = useState<string[]>([])
  const fb = useFeedback(onStar)
  const ask = SAY.tidyAsk(round.places[0].name, round.places[1].name)
  useSay(ask, [round])

  const drag = useDrag((id, dropId) => {
    if (!dropId) return
    const item = round.items.find((i) => i.id === id)!
    const place = round.places.find((p) => p.id === dropId)!
    if (item.place !== dropId) return fb.no(id, SAY.tidyNo(place.name))
    const next = [...done, id]
    setDone(next)
    if (next.length === round.items.length)
      fb.ok(SAY.tidyOk, () => {
        setRound(makeRound())
        setDone([])
      })
    else speak(pick(SAY.tidyIn), 659)
  })

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        제자리에 정리해요
      </GameTop>
      <div className="g-row">
        {round.places.map((p) => (
          <div key={p.id} className="tidy-place" data-drop={p.id} style={{ background: p.bg }}>
            <div className="tidy-label">
              <span className="tidy-icon"><Emo e={p.icon} /></span> {p.name}
            </div>
            <div className="tidy-in">
              {round.items
                .filter((i) => i.place === p.id && done.includes(i.id))
                .map((i) => (
                  <Emo key={i.id} e={i.e} />
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="g-line" />
      <div className="g-row g-tray">
        {round.items
          .filter((i) => !done.includes(i.id))
          .map((i) => (
            <div key={i.id} className={'g-piece tidy-item' + (fb.wrong === i.id ? ' g-shake' : '')} {...drag.handle(i.id)} style={drag.style(i.id)}>
              <Emo e={i.e} />
            </div>
          ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
