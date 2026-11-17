// 끌어다 맞추기 공통: 위쪽 빈 자리(구멍·그림자)에 아래쪽 조각을 끌어다 놓음
// 도형 맞추기(모양 놀이), 그림자 맞추기(동물 친구들)에서 씀
import { useState, type ReactNode } from 'react'
import { useDrag } from './drag'
import { speak } from './speech'
import { useFeedback, Party, GameTop } from './game'
import { CheckIcon } from './icons'
import { shuffle, MATCH } from './talk'

export type MatchItem = { id: string; name: string; piece: ReactNode; hole: ReactNode }

export function DragMatch({
  items,
  prompt,
  stars,
  onStar,
  onNext,
}: {
  items: MatchItem[] // 이번 판에 나올 것들
  prompt: string
  stars: number
  onStar: () => void
  onNext: () => void // 다 맞추면 다음 판
}) {
  const [placed, setPlaced] = useState<string[]>([])
  const [order] = useState(() => shuffle(items.map((i) => i.id)))
  const fb = useFeedback(onStar)
  const byId = (id: string) => items.find((i) => i.id === id)!

  const drag = useDrag((id, dropId) => {
    if (!dropId) return
    const item = byId(id)
    if (dropId === id) {
      const next = [...placed, id]
      setPlaced(next)
      if (next.length === items.length) fb.ok(MATCH.all, onNext)
      else speak(MATCH.placed(item.name), 659)
    } else fb.no(id, MATCH.wrong(item.name))
  })

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(prompt)}>
        {prompt}
      </GameTop>
      <div className="g-row">
        {items.map((i) => (
          <div key={i.id} className={'g-drop' + (placed.includes(i.id) ? ' filled' : '')} data-drop={i.id}>
            {placed.includes(i.id) ? (
              <>
                <div className="g-placed">{i.piece}</div>
                <span className="g-check" aria-label="맞음">
                  <CheckIcon />
                </span>
              </>
            ) : (
              i.hole
            )}
          </div>
        ))}
      </div>
      <div className="g-line" />
      <div className="g-row g-tray">
        {order.map((id) =>
          placed.includes(id) ? (
            <div key={id} className="g-slot" />
          ) : (
            <div
              key={id}
              className={'g-piece' + (fb.wrong === id ? ' g-shake' : '')}
              {...drag.handle(id)}
              onPointerDownCapture={() => speak(MATCH.name(byId(id).name))}
              style={drag.style(id)}
            >
              {byId(id).piece}
            </div>
          ),
        )}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}
