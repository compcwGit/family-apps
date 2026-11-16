import { useState } from 'react'
import { useFeedback, useSay, Party, GameTop, speak, shuffle, type GameProps } from '@family/core'

// 기분 맞추기: 상황 이야기를 듣고 어떤 기분일지 표정 고르기. 정답보다 "그럴 때 그런 기분이 들 수 있어"를 배우는 놀이
const FEELS = [
  { id: 'happy', face: '😄', name: '기뻐요' },
  { id: 'sad', face: '😢', name: '슬퍼요' },
  { id: 'angry', face: '😠', name: '화나요' },
  { id: 'scared', face: '😨', name: '무서워요' },
] as const
type FeelId = (typeof FEELS)[number]['id']

const STORIES: { e: string; t: string; feel: FeelId; after: string }[] = [
  { e: '🎁', t: '생일 선물을 받았어요.', feel: 'happy', after: '선물을 받으면 기뻐요!' },
  { e: '🎂', t: '친구들이 생일 축하 노래를 불러 줬어요.', feel: 'happy', after: '축하를 받으면 기뻐요!' },
  { e: '🏞️', t: '엄마 아빠랑 놀이터에 갔어요.', feel: 'happy', after: '같이 놀면 기뻐요!' },
  { e: '🍦', t: '아이스크림을 땅에 떨어뜨렸어요.', feel: 'sad', after: '아끼던 걸 잃으면 슬퍼요. 그럴 땐 안아 달라고 해요.' },
  { e: '🎈', t: '풍선이 하늘로 날아가 버렸어요.', feel: 'sad', after: '풍선이 날아가면 슬퍼요.' },
  { e: '🧸', t: '친구가 내 장난감을 말없이 가져갔어요.', feel: 'angry', after: '화가 날 수 있어요. 그럴 땐 "내 거야, 돌려줘" 하고 말해요.' },
  { e: '🧱', t: '열심히 쌓은 블록 탑을 누가 무너뜨렸어요.', feel: 'angry', after: '화가 날 수 있어요. 숨을 크게 쉬어 봐요.' },
  { e: '⛈️', t: '밤에 천둥이 쾅쾅 쳤어요.', feel: 'scared', after: '천둥소리는 무서워요. 어른 곁에 있으면 괜찮아요.' },
  { e: '🐕', t: '큰 개가 멍멍 크게 짖었어요.', feel: 'scared', after: '큰 개가 짖으면 무서워요. 천천히 뒤로 물러나요.' },
  { e: '🌑', t: '방에 불이 갑자기 꺼졌어요.', feel: 'scared', after: '깜깜하면 무서워요. 어른을 불러요.' },
]

export function Feel({ stars, onStar }: GameProps) {
  const [order] = useState(() => shuffle(STORIES))
  const [n, setN] = useState(0)
  const story = order[n % order.length]
  const fb = useFeedback(onStar)
  const ask = `${story.t} 기분이 어떨까요?`
  useSay(ask, [n])

  const tap = (id: FeelId) => {
    if (id === story.feel) fb.ok(story.after, () => setN(n + 1), 3600)
    else fb.no(id, '그럴 수도 있어요. 다시 생각해 볼까?')
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
      <Party show={fb.party} />
    </div>
  )
}
