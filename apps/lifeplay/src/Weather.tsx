import { useState } from 'react'
import { useDrag, useFeedback, useSay, Party, GameTop, speak, shuffle, Emo, type GameProps } from '@family/core'
import { WEATHERS, CLOTHES, SAY } from './voice'

// 날씨에 맞게 입어요: 날씨를 보고 맞는 옷·물건만 아이에게 끌어다 입히기 (안 맞는 것 3개 섞임)
function makeRound(prev?: string) {
  const w = shuffle(WEATHERS.filter((x) => x.id !== prev))[0]
  const good = shuffle(w.good).slice(0, 3)
  const bad = shuffle(w.bad).slice(0, 3)
  return { w, good, items: shuffle([...good, ...bad]) }
}

export function Weather({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(() => makeRound())
  const [worn, setWorn] = useState<string[]>([])
  const fb = useFeedback(onStar)
  const { w } = round
  const ask = SAY.wearAsk(w.name)
  useSay(ask, [round])

  const drag = useDrag((c, dropId) => {
    if (dropId !== 'kid') return
    if (!round.good.includes(c)) return fb.no(c, SAY.wearNo(w.name, CLOTHES[c]))
    const next = [...worn, c]
    setWorn(next)
    if (next.length === round.good.length)
      fb.ok(SAY.wearOk(w.name), () => {
        setRound(makeRound(w.id))
        setWorn([])
      })
    else speak(SAY.wearIn(CLOTHES[c]), 659)
  })

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        <Emo e={w.icon} /> {w.name}
      </GameTop>
      <div className="wear-kid" data-drop="kid" style={{ background: w.bg }}>
        <span className="wear-weather"><Emo e={w.icon} /></span>
        <span className="wear-face"><Emo e="🧒" /></span>
        <div className="wear-on">
          {worn.map((c) => (
            <Emo key={c} e={c} />
          ))}
        </div>
      </div>
      <div className="g-line" />
      <div className="g-row g-tray">
        {round.items
          .filter((c) => !worn.includes(c))
          .map((c) => (
            <div key={c} className={'g-piece wear-item' + (fb.wrong === c ? ' g-shake' : '')} {...drag.handle(c)} style={drag.style(c)}>
              <Emo e={c} />
              <small>{CLOTHES[c]}</small>
            </div>
          ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
