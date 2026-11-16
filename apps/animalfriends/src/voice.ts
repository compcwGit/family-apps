// 동물 친구들이 읽는 말 모음 — 화면(컴포넌트)과 음성 목록(voice-lines.json)이 같이 씀
// 말을 바꾸면: npm run voice-lines -- animalfriends  →  scripts/tts/make_voices.py 로 바뀐 것만 다시 만들기
import { voiceList, MATCH, eun, ieyo } from '@family/core/voicelist'
import { ANIMALS, type Animal } from './animals'

export const SAY = {
  board: (a: Animal) => `${a.name}! ${a.sound}!`,
  quizAsk: (a: Animal) => `${a.sound}! ${a.sound}! 누구일까요?`,
  quizOk: (a: Animal) => `딩동댕! ${ieyo(a.name)}!`,
  quizNo: (a: Animal) => `${eun(a.name)} ${a.sound}! 다시 들어볼까요?`,
  shadow: '누구 그림자일까요? 끌어다 놓아요!',
  piano: (a: Animal) => `${a.sound}!`,
}

export function voiceLines() {
  const v = voiceList().common()
  v.add('game', SAY.shadow, MATCH.all)
  for (const a of ANIMALS)
    v.add('animal', SAY.board(a), SAY.quizAsk(a), SAY.quizOk(a), SAY.quizNo(a), SAY.piano(a), MATCH.name(a.name), MATCH.placed(a.name), MATCH.wrong(a.name))
  return v.lines
}
