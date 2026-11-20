import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps, Emo } from '@family/core'
import { WORDS } from './words'
import { SAY } from './voice'

// 글자 순서 맞추기: 그림을 보고 흩어진 글자 카드를 순서대로 눌러 낱말 만들기 (두·세 글자 낱말)
const POOL = WORDS.filter((x) => x.w.length >= 2 && x.w.length <= 3)

function makeRound(prev?: string) {
  const word = shuffle(POOL.filter((x) => x.w !== prev))[0]
  let cards = [...word.w].map((c, i) => ({ id: `${i}`, c }))
  // 섞었는데 원래 순서 그대로면 다시 섞기 (바나나처럼 같은 글자가 있어도 글자 기준으로 비교)
  for (let t = 0; t < 5; t++) {
    cards = shuffle(cards)
    if (cards.map((x) => x.c).join('') !== word.w) break
  }
  return { word, cards }
}

export function WordOrder({ stars, onStar }: GameProps) {
  const [round, setRound] = useState(() => makeRound())
  const [used, setUsed] = useState<string[]>([]) // 누른 카드 id 순서
  const fb = useFeedback(onStar)
  const { word, cards } = round
  const ask = SAY.orderAsk(word.w)
  useSay(ask, [round])

  const tap = (id: string, c: string) => {
    if (c !== word.w[used.length]) return fb.no(id, SAY.orderNo)
    const next = [...used, id]
    setUsed(next)
    if (next.length === word.w.length)
      fb.ok(SAY.listenOk(word.w), () => {
        setUsed([])
        setRound(makeRound(word.w))
      })
    else speak(c, 659)
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        순서대로 눌러 낱말을 만들어요
      </GameTop>
      <div className="miss-word">
        <span className="miss-emoji"><Emo e={word.e} /></span>
        <div className="miss-letters">
          {[...word.w].map((_, i) => (
            <span key={i} className={i < used.length ? 'miss-box filled' : 'miss-box hole'}>
              {i < used.length ? word.w[i] : ''}
            </span>
          ))}
        </div>
      </div>
      <div className="g-row">
        {cards.map((x) => (
          <button
            key={x.id}
            className={'g-card letter-card' + (fb.wrong === x.id ? ' g-shake' : '') + (used.includes(x.id) ? ' done' : '')}
            onClick={() => tap(x.id, x.c)}
          >
            {x.c}
          </button>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
