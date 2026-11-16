import { useState, type ReactNode } from 'react'
import { useDrag, useFeedback, useSay, Party, GameTop, speak, shuffle, pick, type GameProps } from '@family/core'
import { SHAPES, ShapeIcon } from './shapes'
import { COLORS, SAY } from './voice'

// 끼리끼리 모으기: 섞여 있는 것을 같은 색(또는 같은 모양) 바구니에 담기. 판마다 색/모양 번갈아
const PAINTS = ['#EF5350', '#42A5F5', '#66BB6A', '#FFCA28', '#AB47BC', '#FF7043']

type Item = { id: string; group: string; view: ReactNode }
type Basket = { id: string; name: string; bg: string; label: ReactNode }

function makeRound(n: number): { rule: string; baskets: Basket[]; items: Item[] } {
  if (n % 2 === 0) {
    const [a, b] = shuffle(COLORS)
    const items = [a, b].flatMap((c) =>
      shuffle(c.items).slice(0, 3).map((e, i) => ({ id: `${c.id}${i}`, group: c.id, view: <span className="g-emoji">{e}</span> })),
    )
    return {
      rule: SAY.sortRule(a.name, b.name),
      baskets: [a, b].map((c) => ({ id: c.id, name: c.name, bg: c.bg, label: <span className="sort-dot" style={{ background: c.bg }} /> })),
      items: shuffle(items),
    }
  }
  const [a, b] = shuffle(SHAPES)
  const items = [a, b].flatMap((s) =>
    shuffle(PAINTS).slice(0, 3).map((c, i) => ({ id: `${s.id}${i}`, group: s.id, view: <ShapeIcon shape={s} color={c} /> })),
  )
  return {
    rule: SAY.sortRule(a.name, b.name),
    baskets: [a, b].map((s) => ({ id: s.id, name: s.name, bg: '#FFE0B2', label: <ShapeIcon shape={s} hole /> })),
    items: shuffle(items),
  }
}

export function Sort({ stars, onStar }: GameProps) {
  const [n, setN] = useState(0)
  const [round, setRound] = useState(() => makeRound(0))
  const [inBasket, setIn] = useState<string[]>([])
  const fb = useFeedback(onStar)
  useSay(round.rule, [round])

  const next = () => {
    setN(n + 1)
    setRound(makeRound(n + 1))
    setIn([])
  }
  const drag = useDrag((id, dropId) => {
    if (!dropId) return
    const item = round.items.find((i) => i.id === id)!
    if (item.group !== dropId) return fb.no(id, SAY.sortNo)
    const done = [...inBasket, id]
    setIn(done)
    if (done.length === round.items.length) fb.ok(SAY.sortOk, next)
    else speak(pick(SAY.sortIn), 659)
  })

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(round.rule)}>
        같은 것끼리 모아요
      </GameTop>
      <div className="g-row sort-baskets">
        {round.baskets.map((b) => (
          <div key={b.id} className="sort-basket" data-drop={b.id} style={{ background: b.bg }}>
            <div className="sort-label">
              {b.label} <span>{b.name}</span>
            </div>
            <div className="sort-in">
              {round.items
                .filter((i) => i.group === b.id && inBasket.includes(i.id))
                .map((i) => (
                  <div key={i.id} className="sort-mini">
                    {i.view}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="g-row g-tray">
        {round.items
          .filter((i) => !inBasket.includes(i.id))
          .map((i) => (
            <div key={i.id} className={'g-piece' + (fb.wrong === i.id ? ' g-shake' : '')} {...drag.handle(i.id)} style={drag.style(i.id)}>
              {i.view}
            </div>
          ))}
      </div>
      <Party show={fb.party} />
    </div>
  )
}
