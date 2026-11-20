import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps } from '@family/core'
import { SAFETY, SAFE_OPTS, TALKS, WORDS, HELPS, HELPERS, SAY, type Opt, type Quiz } from './voice'

// 고르기 놀이 공통: 그림 + 상황을 듣고 답 하나 고르기. 맞으면 이유를 들려주고 다음 문제
// options: 보기 전부(안전 ⭕❌) 또는 정답 + 다른 보기 2개(고운 말·누가 도와줄까요)
function Choice({ stars, onStar, list, opts, title, ask, all }: GameProps & {
  list: Quiz[]
  opts: Opt[]
  title: string
  ask: (t: string) => string
  all?: boolean // 보기를 전부 보여줄지
}) {
  const [order] = useState(() => shuffle(list))
  const [n, setN] = useState(0)
  const q = order[n % order.length]
  const [choices] = useState(() => new Map<number, Opt[]>())
  if (!choices.has(n)) {
    const right = opts.find((o) => o.id === q.answer)!
    choices.set(n, all ? opts : shuffle([right, ...shuffle(opts.filter((o) => o !== right)).slice(0, 2)]))
  }
  const fb = useFeedback(onStar)
  const line = ask(q.t)
  useSay(line, [n])

  const tap = (id: string) => {
    if (id === q.answer) fb.ok(q.after, () => setN(n + 1), 3600)
    else fb.no(id, SAY.quizNo)
  }

  return (
    <div className="g-game">
      <GameTop stars={stars} onAgain={() => speak(line)}>
        {title}
      </GameTop>
      <div className="feel-story">
        <span className="feel-scene">{q.e}</span>
        <p>{q.t}</p>
      </div>
      <div className="g-row">
        {choices.get(n)!.map((o) => (
          <button
            key={o.id}
            className={'g-card choice-card' + (fb.wrong === o.id ? ' g-shake' : '') + (fb.party && o.id === q.answer ? ' ok' : '')}
            onClick={() => tap(o.id)}
          >
            {o.face}
            <small>{o.name}</small>
          </button>
        ))}
      </div>
      <Party show={fb.party} text={fb.line} />
    </div>
  )
}

export const Safety = (p: GameProps) => <Choice {...p} list={SAFETY} opts={SAFE_OPTS} all title="안전할까요?" ask={SAY.safeAsk} />
export const Talk = (p: GameProps) => <Choice {...p} list={TALKS} opts={WORDS} title="뭐라고 말할까요?" ask={SAY.talkAsk} />
export const Help = (p: GameProps) => <Choice {...p} list={HELPS} opts={HELPERS} title="누가 도와줄까요?" ask={SAY.helpAsk} />
