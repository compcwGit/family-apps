// 동물 친구들이 읽는 말 모음 — 화면(컴포넌트)과 음성 목록(voice-lines.json)이 같이 씀
// 말을 바꾸면: npm run voice-lines -- animalfriends  →  scripts/tts/make_voices.py 로 바뀐 것만 다시 만들기
import { voiceList, MATCH, eun, ieyo, iga, eul } from '@family/core/voicelist'
import { ANIMALS, BABIES, FOODS, HOMES, type Animal } from './animals'
import { SONGS } from './songs'

const LEGS: Record<number, string> = { 2: '두', 4: '네', 8: '여덟' }
export const legsWord = (n: number) => LEGS[n]

export const SAY = {
  // 친구들
  board: (a: Animal) => `${a.name}! ${a.sound}!`,
  fact: (a: Animal) => a.fact,
  homeTap: '동물이 어디에 사는지 알아봐요!',
  babyTap: '눌러 보세요! 아기가 나와요!',
  babyShow: (m: string, b: string) => `${b}! ${m}의 아기예요!`,
  // 퀴즈 · 소리
  quizAsk: (a: Animal) => `${a.sound}! ${a.sound}! 누구일까요?`,
  quizOk: (a: Animal) => `${ieyo(a.name)}!`,
  quizNo: (a: Animal) => `${eun(a.name)} ${a.sound}! 다시 들어볼까요?`,
  // 퀴즈 · 이름
  findAsk: (a: Animal) => `${eul(a.name)} 찾아 보세요!`,
  findNo: (a: Animal) => `${eun(a.name)} 아니에요. 다시 찾아 볼까요?`,
  // 퀴즈 · 누구일까
  whoAsk: '이 동물은 누구일까요?',
  whoNo: '다시 잘 보세요!',
  // 퀴즈 · 다리
  legsAsk: (a: Animal) => `${eun(a.name)} 다리가 몇 개일까요?`,
  legsOk: (a: Animal) => `${eun(a.name)} 다리가 ${LEGS[a.legs!]} 개예요!`,
  legsNo: '다시 세어 볼까요?',
  // 퀴즈 · 크기
  bigAsk: (big: boolean) => (big ? '누가 더 클까요?' : '누가 더 작을까요?'),
  bigOk: (a: Animal, big: boolean) => `${iga(a.name)} 더 ${big ? '커요' : '작아요'}!`,
  bigNo: '다시 비교해 볼까요?',
  // 사는 곳 · 먹이
  homeAsk: (a: Animal) => `${eun(a.name)} 어디에 살까요?`,
  homeOk: (a: Animal) => `${eun(a.name)} ${HOMES[a.home].place} 살아요!`,
  homeNo: (a: Animal) => `${eun(a.name)} 거기에 안 살아요. 다시 생각해 볼까요?`,
  eatAsk: (a: Animal) => `${eun(a.name)} 뭘 좋아할까요?`,
  eatOk: (a: Animal) => `${eun(a.name)} ${eul(FOODS[a.food!])} 좋아해요!`,
  eatNo: (a: Animal) => `${eun(a.name)} 그건 안 먹어요. 다시 생각해 볼까요?`,
  // 그림자
  shadow: '누구 그림자일까요? 끌어다 놓아요!',
  shadowFind: (a: Animal) => `${eun(a.name)} 어느 그림자일까요?`,
  shadowFindNo: '그림자 모양이 달라요. 다시 찾아 볼까요?',
  shadowWho: '누구 그림자일까요?',
  // 피아노
  piano: (a: Animal) => `${a.sound}!`,
  followAsk: (title: string) => `${eul(title)} 따라 쳐 봐요!`,
  followNo: '불이 켜진 건반을 눌러요!',
  followOk: '멋진 연주예요!',
  freeAsk: '마음대로 쳐 봐요!',
}

export function voiceLines() {
  const v = voiceList().common()
  v.add('game', SAY.shadow, MATCH.all, SAY.homeTap, SAY.babyTap, SAY.whoAsk, SAY.whoNo, SAY.legsNo, SAY.bigAsk(true), SAY.bigAsk(false), SAY.bigNo)
  v.add('game', SAY.shadowFindNo, SAY.shadowWho, SAY.followNo, SAY.followOk, SAY.freeAsk)
  for (const s of SONGS) v.add('song', SAY.followAsk(s.title))
  for (const b of BABIES) v.add('baby', SAY.babyShow(b.mother, b.baby))
  for (const a of ANIMALS) {
    v.add('animal', SAY.board(a), SAY.fact(a), SAY.quizAsk(a), SAY.quizOk(a), SAY.quizNo(a), SAY.piano(a), MATCH.name(a.name), MATCH.placed(a.name), MATCH.wrong(a.name))
    v.add('animal', SAY.findAsk(a), SAY.findNo(a), SAY.shadowFind(a), SAY.homeAsk(a), SAY.homeOk(a), SAY.homeNo(a))
    v.add('animal', SAY.bigOk(a, true), SAY.bigOk(a, false))
    if (a.legs) v.add('animal', SAY.legsAsk(a), SAY.legsOk(a))
    if (a.food) v.add('animal', SAY.eatAsk(a), SAY.eatOk(a), SAY.eatNo(a))
  }
  return v.lines
}
