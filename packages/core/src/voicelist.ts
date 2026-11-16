// 음성 목록 만들기 도우미 (앱마다 src/voice.ts 의 voiceLines() 에서 씀)
// 결과 { "파일 id": "읽을 말" } → voice-lines.json → scripts/tts/make_voices.py 가 mp3 로 만듦
//
// add(묶음, 말...)  : 문장으로 나눠서 넣음. id = 묶음/해시 (말이 같으면 id 도 항상 같음)
// set(id, 말)       : id 를 직접 정해서 통째로 넣음 (한글 놀이 jamo/3131 처럼 원래 쓰던 id)
import { splitSentences, PRAISES, CHEERS } from './talk'

// FNV-1a 32비트 → 36진수 (짧고, 같은 말이면 언제나 같은 값)
export function voiceHash(text: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193)
  return (h >>> 0).toString(36)
}

export function voiceList() {
  const lines: Record<string, string> = {}
  const have = new Set<string>()
  const list = {
    lines,
    set(id: string, text: string) {
      lines[id] = text
      have.add(text)
      return list
    },
    add(group: string, ...texts: string[]) {
      for (const t of texts)
        for (const s of splitSentences(t))
          if (!have.has(s)) {
            lines[`${group}/${voiceHash(s)}`] = s
            have.add(s)
          }
      return list
    },
    // core 놀이 공통 말 (칭찬·격려). useFeedback 을 쓰는 앱은 꼭 넣기
    common() {
      return list.add('core', ...PRAISES, ...CHEERS)
    },
  }
  return list
}
export * from './talk'
