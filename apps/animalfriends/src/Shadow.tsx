import { useState } from 'react'
import { Critter, DragMatch, pick, shuffle, type GameProps } from '@family/core'
import { ANIMALS, byName } from './animals'
import { usePortrait } from './usePortrait'
import { Choice, type Make } from './Choice'
import { SAY } from './voice'

// 그림자 맞추기: 동물을 같은 모양 그림자에 끌어다 놓기. 별 6개부터 4마리씩
export function Shadow({ stars, onStar }: GameProps) {
  const px = usePortrait() ? 72 : 190
  const [round, setRound] = useState(0)
  const [rounds] = useState(() => new Map<number, typeof ANIMALS>())
  if (!rounds.has(round)) rounds.set(round, shuffle(ANIMALS).slice(0, stars >= 6 ? 4 : 3))
  return (
    <DragMatch
      key={round}
      items={rounds.get(round)!.map((a) => ({
        id: a.name,
        name: a.name,
        piece: <Critter kind={a.critter} size={px} />,
        hole: <Critter kind={a.critter} size={px} shadow />,
      }))}
      prompt={SAY.shadow}
      stars={stars}
      onStar={onStar}
      onNext={() => setRound((r) => r + 1)}
    />
  )
}

// 그림자 찾기: 동물 한 마리를 보여 주고, 그림자 3개 중 진짜를 고르기
const findMake: Make = (_s, prev) => {
  const a = pick(ANIMALS.filter((x) => x.name !== prev?.answer))
  const three = shuffle([a, ...shuffle(ANIMALS.filter((x) => x !== a)).slice(0, 2)])
  return {
    ask: SAY.shadowFind(a),
    prompt: <Critter kind={a.critter} size={200} />,
    options: three.map((x) => ({ id: x.name, view: <span className="dark"><Critter kind={x.critter} size={150} shadow /></span> })),
    answer: a.name,
    ok: SAY.quizOk(a),
    no: () => SAY.shadowFindNo,
  }
}
export const ShadowFind = (p: GameProps) => <Choice {...p} make={findMake} cols={3} size={200} psize={118} />

// 누구 그림자? 까만 그림자만 보고 이름 맞히기
const whoMake: Make = (_s, prev) => {
  const a = pick(ANIMALS.filter((x) => x.name !== prev?.answer))
  return {
    ask: SAY.shadowWho,
    prompt: <span className="dark"><Critter kind={a.critter} size={260} shadow /></span>,
    options: shuffle([a, ...shuffle(ANIMALS.filter((x) => x !== a)).slice(0, 3)]).map((x) => ({ id: x.name, view: <Critter kind={x.critter} size={130} /> })),
    answer: a.name,
    ok: SAY.quizOk(a),
    no: (id) => SAY.findNo(byName(id)),
  }
}
export const ShadowWho = (p: GameProps) => <Choice {...p} make={whoMake} side size={200} psize={150} />
