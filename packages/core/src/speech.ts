// 음성 읽기(TTS): 기기에 설치된 음성을 사용, 인터넷 불필요
// 안 되는 환경(음성 미설치 등)에서는 짧은 효과음으로 대신함
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { playTone } from './sound'

// 읽기 설정. 앱마다 setSpeechOptions 로 바꿀 수 있음 (기본값은 기존과 같음)
// voice: 목소리 id (listKoreanVoices 의 id), '' = 기기 기본 목소리
export type SpeechOptions = { rate: number; pitch: number; voice: string }
let opts: SpeechOptions = { rate: 0.95, pitch: 1.2, voice: '' }

export function setSpeechOptions(o: Partial<SpeechOptions>) {
  opts = { ...opts, ...o }
}
export function setSpeechRate(rate: number) {
  setSpeechOptions({ rate })
}

// 기기의 목소리 목록 (웹은 처음에 비어 있다가 잠시 뒤 채워지므로 한 번 더 시도)
let cache: SpeechSynthesisVoice[] = []
async function allVoices(): Promise<SpeechSynthesisVoice[]> {
  if (cache.length) return cache
  for (let i = 0; i < 3 && !cache.length; i++) {
    try {
      cache = (await TextToSpeech.getSupportedVoices()).voices
    } catch {
      return []
    }
    if (!cache.length) await new Promise((r) => setTimeout(r, 300))
  }
  return cache
}
const voiceId = (v: SpeechSynthesisVoice) => v.voiceURI || v.name

// 한국어 목소리만. local=false 는 인터넷이 필요한 목소리
export async function listKoreanVoices(): Promise<{ id: string; name: string; local: boolean }[]> {
  return (await allVoices())
    .filter((v) => v.lang?.toLowerCase().replace('_', '-').startsWith('ko'))
    .map((v) => ({ id: voiceId(v), name: v.name, local: v.localService !== false }))
}

export async function speak(text: string, fallbackFreq = 523): Promise<void> {
  try {
    const idx = opts.voice ? (await allVoices()).findIndex((v) => voiceId(v) === opts.voice) : -1
    await TextToSpeech.stop()
    await TextToSpeech.speak({
      text,
      lang: 'ko-KR',
      rate: opts.rate,
      pitch: opts.pitch,
      volume: 1,
      category: 'ambient',
      ...(idx >= 0 ? { voice: idx } : {}),
    })
  } catch {
    playTone(fallbackFreq)
  }
}

export async function stopSpeaking(): Promise<void> {
  try {
    await TextToSpeech.stop()
  } catch {
    /* 무시 */
  }
}
