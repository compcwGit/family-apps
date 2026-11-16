// 음성 읽기(TTS): 기기에 설치된 음성을 사용, 인터넷 불필요
// 안 되는 환경(음성 미설치 등)에서는 짧은 효과음으로 대신함
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { playTone } from './sound'

export async function speak(text: string, fallbackFreq = 523): Promise<void> {
  try {
    await TextToSpeech.stop()
    await TextToSpeech.speak({ text, lang: 'ko-KR', rate: 0.95, pitch: 1.2, volume: 1, category: 'ambient' })
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
