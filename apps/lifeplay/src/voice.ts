// 생활 놀이가 읽는 말 모음 — 화면(컴포넌트)과 음성 목록(voice-lines.json)이 같이 씀
// 말을 바꾸면: npm run voice-lines -- lifeplay  →  scripts/tts/make_voices.py 로 바뀐 것만 다시 만들기
import { voiceList, eun, ieyo, hasBatchim } from '@family/core/voicelist'

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
  { id: 'surprised', face: '😲', name: '놀라요' },
  { id: 'shy', face: '😳', name: '부끄러워요' },
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
  { e: '🖍️', t: '동생이 내 그림에 낙서를 했어요.', feel: 'angry', after: '화가 날 수 있어요. "그러지 마" 하고 말해요.' },
  { e: '🚚', t: '제일 친한 친구가 멀리 이사를 가요.', feel: 'sad', after: '헤어지면 슬퍼요. 그림 편지를 써 볼까요?' },
  { e: '🐶', t: '강아지가 꼬리를 흔들며 반겨 줬어요.', feel: 'happy', after: '반겨 주면 기뻐요!' },
  { e: '📦', t: '상자를 열었더니 장난감이 펑 튀어나왔어요.', feel: 'surprised', after: '깜짝 놀랐지요? 갑자기 무언가 나타나면 놀라요.' },
  { e: '🙈', t: '숨어 있던 친구가 "까꿍!" 하고 나타났어요.', feel: 'surprised', after: '까꿍! 깜짝 놀랐어요.' },
  { e: '🎉', t: '집에 왔더니 가족들이 "깜짝 파티!" 하고 외쳤어요.', feel: 'surprised', after: '깜짝 파티는 놀랍고 기뻐요!' },
  { e: '🎤', t: '많은 사람 앞에서 혼자 노래를 불러요.', feel: 'shy', after: '부끄러울 수 있어요. 용기 내면 멋져요!' },
  { e: '👋', t: '처음 만난 친구가 "안녕?" 하고 인사했어요.', feel: 'shy', after: '처음엔 부끄러울 수 있어요. 나도 "안녕!" 해 볼까요?' },
  { e: '🌟', t: '선생님이 친구들 앞에서 나를 칭찬해 주셨어요.', feel: 'shy', after: '칭찬을 받으면 부끄럽기도 하고 기쁘기도 해요.' },
]

// 고르기 놀이(안전할까요·고운 말·누가 도와줄까요) 공통: 그림 + 상황 → 답 하나 고르기
export type Opt = { id: string; face: string; name: string }
export type Quiz = { e: string; t: string; answer: string; after: string }

// 🚦 안전할까요? ⭕/❌ (겁주지 않고, 어떻게 하면 되는지 알려 주기)
export const SAFE_OPTS: Opt[] = [
  { id: 'o', face: '⭕', name: '안전해요' },
  { id: 'x', face: '❌', name: '위험해요' },
]
export const SAFETY: Quiz[] = [
  { e: '🍲', t: '뜨거운 냄비를 만져요.', answer: 'x', after: '앗, 뜨거워요! 뜨거운 건 어른이 만져요.' },
  { e: '🔌', t: '콘센트에 젓가락을 넣어요.', answer: 'x', after: '콘센트는 위험해요. 손대지 않아요.' },
  { e: '⚽', t: '찻길에서 공놀이를 해요.', answer: 'x', after: '찻길은 위험해요. 공놀이는 놀이터에서 해요.' },
  { e: '🍬', t: '모르는 사람이 사탕을 준다며 따라오래요.', answer: 'x', after: '모르는 사람은 따라가지 않아요. "싫어요!" 하고 어른에게 가요.' },
  { e: '💊', t: '약을 사탕처럼 먹어요.', answer: 'x', after: '약은 사탕이 아니에요. 어른이 줄 때만 먹어요.' },
  { e: '🪟', t: '창문 앞 의자에 올라가요.', answer: 'x', after: '떨어질 수 있어요. 창문 앞에는 올라가지 않아요.' },
  { e: '🛗', t: '엘리베이터 문에 손을 대요.', answer: 'x', after: '문에 손이 끼일 수 있어요. 문에서 떨어져요.' },
  { e: '🚦', t: '초록불에 손을 들고 건너요.', answer: 'o', after: '맞아요! 초록불에 손 들고 건너요.' },
  { e: '🚗', t: '차를 타면 안전띠를 매요.', answer: 'o', after: '맞아요! 차에서는 꼭 안전띠를 매요.' },
  { e: '🚲', t: '자전거를 탈 때 헬멧을 써요.', answer: 'o', after: '맞아요! 헬멧이 머리를 지켜 줘요.' },
  { e: '👫', t: '사람 많은 곳에서 엄마 손을 꼭 잡아요.', answer: 'o', after: '맞아요! 손을 잡으면 길을 잃지 않아요.' },
  { e: '🏊', t: '어른과 함께 물놀이를 해요.', answer: 'o', after: '맞아요! 물놀이는 어른과 함께해요.' },
]

// 💬 뭐라고 말할까요? (고운 말·인사)
export const WORDS: Opt[] = [
  { id: 'thanks', face: '🙏', name: '고마워' },
  { id: 'sorry', face: '🙇', name: '미안해' },
  { id: 'hello', face: '👋', name: '안녕하세요' },
  { id: 'okay', face: '🤗', name: '괜찮아?' },
  { id: 'eat', face: '🥄', name: '잘 먹겠습니다' },
  { id: 'play', face: '🤝', name: '같이 놀자' },
  { id: 'help', face: '🙋', name: '도와주세요' },
]
export const TALKS: Quiz[] = [
  { e: '🎁', t: '친구가 선물을 줬어요.', answer: 'thanks', after: '"고마워!" 하고 말해요.' },
  { e: '🖍️', t: '친구가 크레파스를 빌려줬어요.', answer: 'thanks', after: '빌려주면 "고마워!" 해요.' },
  { e: '💥', t: '뛰다가 친구와 쿵 부딪혔어요.', answer: 'sorry', after: '"미안해!" 하고 말해요.' },
  { e: '🧃', t: '실수로 친구 옷에 주스를 쏟았어요.', answer: 'sorry', after: '실수했을 땐 "미안해!" 해요.' },
  { e: '🏫', t: '아침에 유치원에서 선생님을 만났어요.', answer: 'hello', after: '"안녕하세요!" 하고 인사해요.' },
  { e: '👵', t: '할머니 댁에 도착했어요.', answer: 'hello', after: '"안녕하세요!" 하고 꾸벅 인사해요.' },
  { e: '😭', t: '친구가 넘어져서 울어요.', answer: 'okay', after: '"괜찮아?" 하고 물어봐요. 친구 마음을 달래 줘요.' },
  { e: '🍚', t: '밥상에 맛있는 밥이 차려졌어요.', answer: 'eat', after: '"잘 먹겠습니다!" 하고 먹어요.' },
  { e: '⚽', t: '친구들이 공놀이를 해요. 나도 하고 싶어요.', answer: 'play', after: '"같이 놀자!" 하고 말해요.' },
  { e: '📦', t: '상자가 너무 무거워서 못 들겠어요.', answer: 'help', after: '"도와주세요!" 하고 말하면 돼요.' },
]

// 🚒 누가 도와줄까요?
export const HELPERS: Opt[] = [
  { id: 'fire', face: '🧑‍🚒', name: '소방관' },
  { id: 'police', face: '👮', name: '경찰관' },
  { id: 'doctor', face: '🧑‍⚕️', name: '의사 선생님' },
  { id: 'teacher', face: '🧑‍🏫', name: '선생님' },
  { id: 'mail', face: '📮', name: '집배원' },
]
export const HELPS: Quiz[] = [
  { e: '🔥', t: '불이 났어요!', answer: 'fire', after: '불이 나면 소방관이 와서 꺼 줘요. 전화는 119!' },
  { e: '🐱', t: '고양이가 높은 나무에서 못 내려와요.', answer: 'fire', after: '소방관은 위험에 빠진 동물도 구해 줘요.' },
  { e: '🤒', t: '열이 나고 많이 아파요.', answer: 'doctor', after: '아프면 의사 선생님이 낫게 도와줘요.' },
  { e: '🦵', t: '넘어져서 무릎을 다쳤어요.', answer: 'doctor', after: '다치면 의사 선생님이 치료해 줘요.' },
  { e: '🗺️', t: '길을 잃어버렸어요.', answer: 'police', after: '길을 잃으면 경찰관에게 도와 달라고 해요. 전화는 112!' },
  { e: '🚗', t: '길에서 자동차끼리 부딪혔어요.', answer: 'police', after: '경찰관이 와서 길을 정리해 줘요.' },
  { e: '📚', t: '유치원에서 모르는 게 생겼어요.', answer: 'teacher', after: '모르는 건 선생님께 여쭤봐요.' },
  { e: '💌', t: '할머니께 편지를 보내고 싶어요.', answer: 'mail', after: '집배원이 편지를 배달해 줘요.' },
]

// 🧸 제자리에 정리해요: 판마다 정리할 곳 2군데, 물건 3개씩
export const PLACES = [
  { id: 'toy', name: '장난감 상자', icon: '🧺', bg: '#FFE7C2', items: ['🧸', '🚗', '🧩', '🪀', '🎈'] },
  { id: 'closet', name: '옷장', icon: '🚪', bg: '#E3F1FE', items: ['👕', '👖', '🧦', '👗', '🧢'] },
  { id: 'sink', name: '싱크대', icon: '🚰', bg: '#DDF5EA', items: ['🍽️', '🥄', '🥣', '🍴', '🥛'] },
  { id: 'shelf', name: '책꽂이', icon: '📚', bg: '#EEE6FE', items: ['📕', '📗', '📘', '📙', '📓'] },
]

// ☔ 날씨에 맞게 입어요: 맞는 것만 아이에게 입히기 (틀린 것 3개 섞임)
export const CLOTHES: Record<string, string> = {
  '🩳': '반바지', '👕': '반팔 옷', '🧢': '모자', '🩴': '샌들', '🕶️': '선글라스',
  '☂️': '우산', '🥾': '장화', '🧥': '외투', '🧣': '목도리', '🧤': '장갑',
}
export const WEATHERS = [
  { id: 'hot', name: '더운 날', icon: '☀️', bg: '#FFF1C9', good: ['🩳', '👕', '🧢', '🩴', '🕶️'], bad: ['🧣', '🧤', '🧥', '🥾'] },
  { id: 'rain', name: '비 오는 날', icon: '🌧️', bg: '#DCEBFA', good: ['☂️', '🥾'], bad: ['🕶️', '🩴', '🧤'] },
  { id: 'cold', name: '추운 날', icon: '❄️', bg: '#EAF4FF', good: ['🧥', '🧣', '🧤', '🥾'], bad: ['🩳', '🩴', '🕶️'] },
]

export const SAY = {
  stepsAsk: (name: string) => `${name}! 무엇부터 할까요?`,
  stepsNo: (t: string) => `${t}? 그 전에 할 게 있어요!`,
  stepsOk: (name: string) => `${name} 끝!`,
  stepsStep: (n: number, t: string) => `${n}번, ${t}!`,
  feelAsk: (t: string) => `${t} 기분이 어떨까요?`,
  feelNo: '그럴 수도 있어요. 다시 생각해 볼까?',
  safeAsk: (t: string) => `${t} 안전할까요?`,
  talkAsk: (t: string) => `${t} 뭐라고 말할까요?`,
  helpAsk: (t: string) => `${t} 누가 도와줄까요?`,
  quizNo: '다시 생각해 볼까?',
  tidyAsk: (a: string, b: string) => `${a}${hasBatchim(a) ? '과' : '와'} ${b}에 정리해요!`,
  tidyNo: (place: string) => `그건 ${place}에 넣는 게 아니에요.`,
  tidyIn: ['쏙!', '깨끗해요!', '좋아요!'],
  tidyOk: '정리 끝! 방이 깨끗해졌어요!',
  wearAsk: (w: string) => `${ieyo(w)}! 맞는 옷을 입혀 줘요.`,
  wearNo: (w: string, c: string) => `${w}에는 ${eun(c)} 안 맞아요.`,
  wearIn: (c: string) => `${c}!`,
  wearOk: (w: string) => `${w} 준비 끝! 잘 다녀와요!`,
}

export function voiceLines() {
  const v = voiceList().common()
  for (const r of ROUTINES) {
    v.add('steps', SAY.stepsAsk(r.name), SAY.stepsOk(r.name))
    r.steps.forEach((s, i) => v.add('steps', SAY.stepsNo(s.t), SAY.stepsStep(i + 1, s.t)))
  }
  v.add('feel', SAY.feelNo)
  for (const s of STORIES) v.add('feel', SAY.feelAsk(s.t), s.after)
  v.add('quiz', SAY.quizNo)
  for (const q of SAFETY) v.add('safe', SAY.safeAsk(q.t), q.after)
  for (const q of TALKS) v.add('talk', SAY.talkAsk(q.t), q.after)
  for (const q of HELPS) v.add('help', SAY.helpAsk(q.t), q.after)
  for (const a of PLACES) {
    v.add('tidy', SAY.tidyNo(a.name))
    for (const b of PLACES) if (a !== b) v.add('tidy', SAY.tidyAsk(a.name, b.name))
  }
  v.add('tidy', ...SAY.tidyIn, SAY.tidyOk)
  for (const w of WEATHERS) {
    v.add('wear', SAY.wearAsk(w.name), SAY.wearOk(w.name))
    for (const c of w.bad) v.add('wear', SAY.wearNo(w.name, CLOTHES[c]))
  }
  for (const c of Object.values(CLOTHES)) v.add('wear', SAY.wearIn(c))
  return v.lines
}
