// 생활 놀이가 읽는 말 모음 — 화면(컴포넌트)과 음성 목록(voice-lines.json)이 같이 씀
// 말을 바꾸면: npm run voice-lines -- lifeplay  →  scripts/tts/make_voices.py 로 바뀐 것만 다시 만들기
import { voiceList } from '@family/core/voicelist'

// 순서대로: 생활 습관·안전 그림 카드
export type Step = { e: string; t: string }
export const ROUTINES: { name: string; icon: string; steps: Step[] }[] = [
  { name: '손 씻기', icon: '🧼', steps: [{ e: '💧', t: '손에 물 묻히기' }, { e: '🧼', t: '비누로 거품 내기' }, { e: '🚿', t: '물로 헹구기' }, { e: '🧻', t: '수건으로 닦기' }] },
  { name: '이 닦기', icon: '🪥', steps: [{ e: '🪥', t: '칫솔에 치약 짜기' }, { e: '😁', t: '이를 구석구석 닦기' }, { e: '🥛', t: '물로 입 헹구기' }] },
  { name: '길 건너기', icon: '🚦', steps: [{ e: '🚦', t: '초록불 기다리기' }, { e: '👀', t: '양쪽 차 살피기' }, { e: '✋', t: '손 들고 건너기' }] },
  { name: '밥 먹기', icon: '🍚', steps: [{ e: '🧼', t: '손 씻기' }, { e: '🙏', t: '잘 먹겠습니다' }, { e: '🍚', t: '골고루 먹기' }, { e: '🪥', t: '이 닦기' }] },
  { name: '잠자기', icon: '😴', steps: [{ e: '🛁', t: '깨끗이 씻기' }, { e: '👕', t: '잠옷 입기' }, { e: '📖', t: '그림책 읽기' }, { e: '😴', t: '잘 자요' }] },
  { name: '외출하기', icon: '🧥', steps: [{ e: '🧥', t: '외투 입기' }, { e: '👟', t: '신발 신기' }, { e: '👋', t: '다녀오겠습니다' }] },
]

// 기분 맞추기: 정답보다 "그럴 때 그런 기분이 들 수 있어"를 배우는 놀이
export const FEELS = [
  { id: 'happy', face: '😄', name: '기뻐요' },
  { id: 'sad', face: '😢', name: '슬퍼요' },
  { id: 'angry', face: '😠', name: '화나요' },
  { id: 'scared', face: '😨', name: '무서워요' },
] as const
export type FeelId = (typeof FEELS)[number]['id']

export const STORIES: { e: string; t: string; feel: FeelId; after: string }[] = [
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

export const SAY = {
  stepsAsk: (name: string) => `${name}! 무엇부터 할까요?`,
  stepsNo: (t: string) => `${t}? 그 전에 할 게 있어요!`,
  stepsOk: (name: string) => `${name} 끝!`,
  stepsStep: (n: number, t: string) => `${n}번, ${t}!`,
  feelAsk: (t: string) => `${t} 기분이 어떨까요?`,
  feelNo: '그럴 수도 있어요. 다시 생각해 볼까?',
}

export function voiceLines() {
  const v = voiceList().common()
  for (const r of ROUTINES) {
    v.add('steps', SAY.stepsAsk(r.name), SAY.stepsOk(r.name))
    r.steps.forEach((s, i) => v.add('steps', SAY.stepsNo(s.t), SAY.stepsStep(i + 1, s.t)))
  }
  v.add('feel', SAY.feelNo)
  for (const s of STORIES) v.add('feel', SAY.feelAsk(s.t), s.after)
  return v.lines
}
