import { useEffect, useState } from 'react'
import { GameTop, LockedPlay, ParentGate, ParentPage, PlayShell, FAMILY, autoRestore, stopSpeaking, useStars, useUnlocked } from '@family/core'
import { Meet } from './Meet'
import { Baby } from './Baby'
import { SoundQuiz, NameQuiz, WhoQuiz, LegsQuiz, HomeQuiz, EatQuiz } from './Quizzes'
import { Shadow, ShadowFind, ShadowWho } from './Shadow'
import { AnimalPiano, FollowPiano, FreePiano } from './Piano'
import { SubTabs } from './SubTabs'
import pkg from '../package.json'
import './app.css'

// 왼쪽 놀이 4개, 놀이마다 위쪽에 세부 메뉴 줄
const GAMES = [
  { id: 'play', label: '친구' },
  { id: 'quiz', label: '퀴즈' },
  { id: 'shadow', label: '그림자' },
  { id: 'piano', label: '피아노' },
] as const
type Game = (typeof GAMES)[number]['id']
type Screen = Game | 'gate' | 'parent'

const SUBS = {
  play: [
    { id: 'meet', label: '만나기' },
    { id: 'home', label: '사는 곳' },
    { id: 'baby', label: '아기' },
    { id: 'eat', label: '먹이' },
  ],
  quiz: [
    { id: 'sound', label: '소리' },
    { id: 'name', label: '이름' },
    { id: 'who', label: '누구?' },
    { id: 'legs', label: '다리' },
  ],
  shadow: [
    { id: 'sfind', label: '찾기' },
    { id: 'shadow', label: '맞추기' },
    { id: 'swho', label: '누구?' },
  ],
  piano: [
    { id: 'keys', label: '건반' },
    { id: 'follow', label: '따라 치기' },
    { id: 'free', label: '자유 연주' },
  ],
} as const
type Subs = Record<Game, string>

// 유료 범위 (docs/ideas/006-paid-unlock.md): 무료 6개, 나머지 8개는 전체 기능 구매 후
const APP = 'animalfriends'
// 결제 스위치 (2026-11-23: 광고를 없애고 1회 구매만 쓰기로 함 — 사업자 등록 뒤 Play 상품 animalfriends_full 활성화 필요)
// 아이용 'family' 빌드(VITE_FAMILY=1, APK 직접 설치)는 결제 라이브러리도 빼고 전부 열려 있음
const PAID = true
const LOCK = PAID && !FAMILY
const FREE = new Set(['meet', 'home', 'baby', 'eat', 'sound', 'keys'])
const SUB_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(SUBS).flatMap(([g, list]) => list.map((t) => [t.id, `${GAMES.find((x) => x.id === g)!.label} · ${t.label}`])),
)
// 부모 화면 목록: "친구(만나기·사는 곳)" 처럼 놀이별로 묶음
const group = (free: boolean) =>
  GAMES.map((g) => [g.label, SUBS[g.id].filter((t) => FREE.has(t.id) === free).map((t) => t.label)] as const)
    .filter(([, list]) => list.length)
    .map(([game, list]) => `${game}(${list.join('·')})`)
const FREE_NAMES = group(true)
const PAID_NAMES = group(false)

// 별을 모으는 놀이 이름 (부모 화면에 보임). 'shadow' 는 예전 그림자 맞추기 별을 그대로 이어 씀
// 질문 말풍선이 없는 화면: 말풍선은 그대로 두고 글자만 비움
const QUIET = ['meet', 'baby', 'keys', 'free']
const STAR_NAMES: [string, string][] = [
  ['home', '사는 곳'], ['eat', '먹이'],
  ['sound', '소리 퀴즈'], ['name', '이름 퀴즈'], ['who', '누구일까'], ['legs', '다리 수'],
  ['sfind', '그림자 찾기'], ['shadow', '그림자 맞추기'], ['swho', '누구 그림자'],
  ['follow', '따라 치기'],
]

// 동물 친구들: 친구(만나기·사는 곳·아기·먹이) + 퀴즈 5종 + 그림자 3종 + 동물 피아노 3종
export default function App() {
  const [screen, setScreen] = useState<Screen>('play')
  const [subs, setSubs] = useState<Subs>({ play: 'meet', quiz: 'sound', shadow: 'sfind', piano: 'keys' })
  const stars = useStars('animalfriends.stars')
  const unlocked = useUnlocked(APP)
  const [askUnlock, setAskUnlock] = useState(false) // 잠긴 놀이에서 부모 화면으로 오면 "전체 기능" 칸부터
  useEffect(() => (LOCK ? autoRestore(APP) : undefined), []) // 구매 내역으로 다시 열기
  const isLocked = (id: string) => LOCK && !unlocked && !FREE.has(id)
  const star = (id: string) => ({ stars: stars.of(id), onStar: () => stars.add(id) })
  const go = (s: Screen) => {
    stopSpeaking()
    setScreen(s)
  }

  if (screen === 'gate') return <ParentGate onPass={() => go('parent')} onCancel={() => (setAskUnlock(false), go('play'))} />
  if (screen === 'parent')
    return (
      <ParentPage
        title="동물 친구들"
        version={pkg.version}
        accent="#FF8C6B"
        about="동물 24마리를 만나고(이름·울음소리·사는 곳·먹이·아기), 소리·이름·다리·크기 퀴즈와 그림자 놀이, 동물 피아노(따라 치기·자유 연주)로 노는 유아용 앱입니다."
        nuri={[
          ['의사소통', '친구, 소리·이름 퀴즈 (소리 듣고 이름 알기)'],
          ['자연탐구', '사는 곳·먹이·아기, 다리 수·크기 비교, 그림자 놀이 (동물과 자연 알아보기, 모양 비교하기)'],
          ['예술경험', '동물 피아노 (소리·리듬 즐기기, 노래 따라 치기)'],
        ]}
        stars={STAR_NAMES.map(([id, name]) => [name, stars.of(id)] as [string, number])}
        onReset={stars.reset}
        unlock={LOCK ? { app: APP, free: FREE_NAMES, paid: PAID_NAMES, open: askUnlock } : undefined}
        onClose={() => (setAskUnlock(false), go('play'))}
      />
    )

  const game = screen as Game
  const total = STAR_NAMES.reduce((n, [id]) => n + stars.of(id), 0) // 질문이 없는 화면의 별 칸: 모은 별 전체
  const sub = subs[game]
  const view = (() => {
    if (isLocked(sub)) return <LockedPlay name={SUB_NAMES[sub]} onAsk={() => (setAskUnlock(true), go('gate'))} />
    switch (sub) {
      case 'meet': return <Meet />
      case 'home': return <HomeQuiz {...star('home')} />
      case 'baby': return <Baby />
      case 'eat': return <EatQuiz {...star('eat')} />
      case 'sound': return <SoundQuiz {...star('sound')} />
      case 'name': return <NameQuiz {...star('name')} />
      case 'who': return <WhoQuiz {...star('who')} />
      case 'legs': return <LegsQuiz {...star('legs')} />
      case 'sfind': return <ShadowFind {...star('sfind')} />
      case 'shadow': return <Shadow {...star('shadow')} />
      case 'swho': return <ShadowWho {...star('swho')} />
      case 'keys': return <AnimalPiano />
      case 'follow': return <FollowPiano {...star('follow')} />
      default: return <FreePiano />
    }
  })()

  return (
    <PlayShell design={[1000, 420]} top bar={<SubTabs tabs={SUBS[game]} active={sub} locked={isLocked} onPick={(id) => setSubs({ ...subs, [game]: id })} />} app="동물 친구들" accent="#FF8C6B" games={GAMES.map((g) => ({ ...g, locked: SUBS[g.id].every((t) => isLocked(t.id)) }))} active={screen} onPick={(id) => go(id as Screen)} onParent={() => go('gate')}>
      {(QUIET.includes(sub) || isLocked(sub)) && <GameTop stars={total} quiet />}
      <div key={sub} className="sub-body">
        {view}
      </div>
    </PlayShell>
  )
}
