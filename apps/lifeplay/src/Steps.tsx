import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps } from '@family/core'

// 순서대로: 생활 습관·안전 그림 카드를 할 순서대로 누르기
type Step = { e: string; t: string }
const ROUTINES: { name: string; icon: string; steps: Step[] }[] = [
  { name: '손 씻기', icon: '🧼', steps: [{ e: '💧', t: '손에 물 묻히기' }, { e: '🧼', t: '비누로 거품 내기' }, { e: '🚿', t: '물로 헹구기' }, { e: '🧻', t: '수건으로 닦기' }] },
  { name: '이 닦기', icon: '🪥', steps: [{ e: '🪥', t: '칫솔에 치약 짜기' }, { e: '😁', t: '이를 구석구석 닦기' }, { e: '🥛', t: '물로 입 헹구기' }] },
  { name: '길 건너기', icon: '🚦', steps: [{ e: '🚦', t: '초록불 기다리기' }, { e: '👀', t: '양쪽 차 살피기' }, { e: '✋', t: '손 들고 건너기' }] },
  { name: '밥 먹기', icon: '🍚', steps: [{ e: '🧼', t: '손 씻기' }, { e: '🙏', t: '잘 먹겠습니다' }, { e: '🍚', t: '골고루 먹기' }, { e: '🪥', t: '이 닦기' }] },
  { name: '잠자기', icon: '😴', steps: [{ e: '🛁', t: '깨끗이 씻기' }, { e: '👕', t: '잠옷 입기' }, { e: '📖', t: '그림책 읽기' }, { e: '😴', t: '잘 자요' }] },
  { name: '외출하기', icon: '🧥', steps: [{ e: '🧥', t: '외투 입기' }, { e: '👟', t: '신발 신기' }, { e: '👋', t: '다녀오겠습니다' }] },
]

export function Steps({ stars, onStar }: GameProps) {
  const [ri, setRi] = useState(() => Math.floor(Math.random() * ROUTINES.length))
  const routine = ROUTINES[ri]
  const [cards, setCards] = useState(() => shuffle(routine.steps.map((_, i) => i)))
  const [done, setDone] = useState(0) // 맞게 놓은 개수
  const fb = useFeedback(onStar)
  const ask = `${routine.name}! 무엇부터 할까요?`
  useSay(ask, [ri])

  const next = () => {
    const n = (ri + 1 + Math.floor(Math.random() * (ROUTINES.length - 1))) % ROUTINES.length
    setRi(n)
    setCards(shuffle(ROUTINES[n].steps.map((_, i) => i)))
    setDone(0)
  }
  const tap = (i: number) => {
    if (fb.busy()) return
    if (i !== done) return fb.no(String(i), `${routine.steps[i].t}? 그 전에 할 게 있어요!`)
    const d = done + 1
    setDone(d)
    if (d === routine.steps.length) fb.ok(`${routine.name} 끝!`, next, 2400)
    else speak(`${d}번, ${routine.steps[i].t}!`, 659)
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        {routine.icon} {routine.name}
      </GameTop>
      <div className="g-row">
        {routine.steps.map((s, i) => (
          <div key={i} className="g-drop steps-slot">
            <span className="steps-num">{i + 1}</span>
            {i < done && (
              <div className="g-card ok">
                {s.e}
                <small>{s.t}</small>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="g-row g-tray">
        {cards.map((i) =>
          i < done ? null : (
            <button key={i} className={'g-card' + (fb.wrong === String(i) ? ' g-shake' : '')} onClick={() => tap(i)}>
              {routine.steps[i].e}
              <small>{routine.steps[i].t}</small>
            </button>
          ),
        )}
      </div>
      <Party show={fb.party} />
    </div>
  )
}
