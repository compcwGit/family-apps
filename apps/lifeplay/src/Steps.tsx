import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps } from '@family/core'
import { ROUTINES, SAY } from './voice'
import { StepIcon } from './StepIcons'

// 순서대로: 생활 습관·안전 그림 카드를 할 순서대로 누르기
export function Steps({ stars, onStar }: GameProps) {
  const [ri, setRi] = useState(() => Math.floor(Math.random() * ROUTINES.length))
  const routine = ROUTINES[ri]
  const [cards, setCards] = useState(() => shuffle(routine.steps.map((_, i) => i)))
  const [done, setDone] = useState(0) // 맞게 놓은 개수
  const fb = useFeedback(onStar)
  const ask = SAY.stepsAsk(routine.name)
  useSay(ask, [ri])

  const next = () => {
    const n = (ri + 1 + Math.floor(Math.random() * (ROUTINES.length - 1))) % ROUTINES.length
    setRi(n)
    setCards(shuffle(ROUTINES[n].steps.map((_, i) => i)))
    setDone(0)
  }
  const tap = (i: number) => {
    if (fb.busy()) return
    if (i !== done) return fb.no(String(i), SAY.stepsNo(routine.steps[i].t))
    const d = done + 1
    setDone(d)
    if (d === routine.steps.length) fb.ok(SAY.stepsOk(routine.name), next, 2400)
    else speak(SAY.stepsStep(d, routine.steps[i].t), 659)
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        {ask}
      </GameTop>
      <div className="g-row">
        {routine.steps.map((s, i) => (
          <div key={i} className="g-drop steps-slot">
            <span className="steps-num">{i + 1}</span>
            {i < done && (
              <div className="g-card steps-done">
                <StepIcon e={s.e} />
                <small>{s.t}</small>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="g-line" />
      <div className="g-row g-tray">
        {cards.map((i) =>
          i < done ? null : (
            <button key={i} className={'g-card' + (fb.wrong === String(i) ? ' g-shake' : '')} onClick={() => tap(i)}>
              <StepIcon e={routine.steps[i].e} />
              <small>{routine.steps[i].t}</small>
            </button>
          ),
        )}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
