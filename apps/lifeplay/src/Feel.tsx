import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps } from '@family/core'
import { FEELS, STORIES, SAY, type FeelId } from './voice'

// 기분 맞추기: 상황 이야기를 듣고 어떤 기분일지 표정 고르기. 정답보다 "그럴 때 그런 기분이 들 수 있어"를 배우는 놀이
export function Feel({ stars, onStar }: GameProps) {
  const [order] = useState(() => shuffle(STORIES))
  const [n, setN] = useState(0)
  const story = order[n % order.length]
  const fb = useFeedback(onStar)
  const ask = SAY.feelAsk(story.t)
  useSay(ask, [n])

  const tap = (id: FeelId) => {
    if (id === story.feel) fb.ok(story.after, () => setN(n + 1), 3600)
    else fb.no(id, SAY.feelNo)
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(ask)}>
        기분이 어떨까요?
      </GameTop>
      <div className="feel-story">
        <span className="feel-scene">{story.e}</span>
        <p>{story.t}</p>
      </div>
      <div className="g-row">
        {FEELS.map((f) => (
          <button
            key={f.id}
            className={'g-card' + (fb.wrong === f.id ? ' g-shake' : '') + (fb.party && f.id === story.feel ? ' ok' : '')}
            onClick={() => tap(f.id)}
          >
            {f.face}
            <small>{f.name}</small>
          </button>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
