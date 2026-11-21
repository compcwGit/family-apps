// 음성 읽기(TTS): 기기에 설치된 음성을 사용, 인터넷 불필요
// 안 되는 환경(음성 미설치 등)에서는 짧은 효과음으로 대신함
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { playTone } from './sound'
import { splitSentences } from './talk'
import { createStore } from './storage'
import { Capacitor, registerPlugin } from '@capacitor/core'
import { followMediaVolume } from './sound'

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

// 녹음 파일: { "읽을 말": "파일 경로" } (scripts/tts/make_voices.py 가 만드는 src/voice-files.json)
// 앱 main.tsx 에서 setVoiceFiles 로 넘겨 줌. 말 전체 → 없으면 문장마다 찾아서, 모두 있으면 파일로 재생
// 하나라도 없으면 지금처럼 기기 음성(TTS)으로 읽음
let files: Record<string, string> = {}
let base = './voice/'
export function setVoiceFiles(index: Record<string, string> | undefined, folder = './voice/') {
  files = index ?? {}
  base = folder
}

let audio: HTMLAudioElement | null = null
let playId = 0
function playFile(src: string, id: number): Promise<boolean> {
  return new Promise((resolve) => {
    if (id !== playId) return resolve(false)
    followMediaVolume() // 녹음 목소리도 미디어 볼륨을 따름
    // 한 번 쓴 재생기를 계속 씀: 아이폰 Safari 는 새로 만든 재생기를 탭 밖(await 뒤)에서 틀면 소리를 막는 경우가 있음
    audio ??= new Audio()
    audio.src = base + src
    audio.onended = () => resolve(true)
    audio.onerror = () => resolve(false)
    audio.onpause = () => resolve(false) // 다른 말이 시작되거나 멈춤
    audio.play().catch(() => resolve(false))
  })
}
// 부모 화면에서 "녹음한 목소리 / 기기 음성" 고르기 (기기 안에 저장)
const preferStore = createStore<boolean>('core.voiceFiles', true)
let preferFiles = preferStore.get()
export const hasVoiceFiles = () => Object.keys(files).length > 0
export const usesVoiceFiles = () => preferFiles
export function setUseVoiceFiles(on: boolean) {
  preferFiles = on
  preferStore.set(on)
}

function clipsFor(text: string): string[] | null {
  if (!preferFiles) return null
  if (files[text]) return [files[text]]
  const parts = splitSentences(text).map((s) => files[s])
  return parts.length && parts.every(Boolean) ? parts : null
}

// 앞의 말 끊기. 웹(아이폰 Safari)은 끊자마자 말하면 새 말을 버리므로, 말하는 중일 때만 끊고 잠깐 기다림
async function stopBeforeSpeak() {
  const synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null
  if (synth && !Capacitor.isNativePlatform()) {
    if (synth.speaking || synth.pending) {
      synth.cancel()
      await new Promise((r) => setTimeout(r, 80))
    }
    return
  }
  await TextToSpeech.stop()
}

// 안드로이드 앱: 말하는 동안 다른 앱 소리(음악)를 멈추지 않고 잠깐 줄였다가 되돌림 (packages/audio-focus)
// 말이 끝나고 조금 기다렸다 되돌림 → 연달아 말할 때 음악 소리가 들쑥날쑥하지 않게
// 웹(아이폰 Safari)·PC는 해당 없음
const AudioFocus = registerPlugin<{ duck(): Promise<void>; release(): Promise<void> }>('AudioFocus')
let releaseTimer: ReturnType<typeof setTimeout> | undefined
function duckOthers() {
  if (!Capacitor.isNativePlatform()) return
  clearTimeout(releaseTimer)
  AudioFocus.duck().catch(() => {})
}
function restoreOthers(id = playId) {
  if (!Capacitor.isNativePlatform() || id !== playId) return // 다른 말이 이어지면 그대로 줄인 채
  clearTimeout(releaseTimer)
  releaseTimer = setTimeout(() => AudioFocus.release().catch(() => {}), 500)
}

export async function speak(text: string, fallbackFreq = 523): Promise<void> {
  const id = ++playId
  audio?.pause()
  duckOthers()
  try {
    await speakNow(text, fallbackFreq, id)
  } finally {
    restoreOthers(id)
  }
}

async function speakNow(text: string, fallbackFreq: number, id: number): Promise<void> {
  const clips = clipsFor(text)
  if (clips) {
    try {
      await TextToSpeech.stop()
    } catch {
      /* 무시 */
    }
    for (const c of clips) if (!(await playFile(c, id))) break
    return
  }
  try {
    const idx = opts.voice ? (await allVoices()).findIndex((v) => voiceId(v) === opts.voice) : -1
    await stopBeforeSpeak()
    if (id !== playId) return // 기다리는 사이에 다른 말이 시작됨
    await TextToSpeech.speak({
      text,
      lang: 'ko-KR',
      rate: opts.rate,
      pitch: opts.pitch,
      volume: 1,
      category: 'playback', // 미디어 볼륨을 따름 (벨소리 무음 스위치와 상관없음)
      ...(idx >= 0 ? { voice: idx } : {}),
    })
  } catch {
    playTone(fallbackFreq)
  }
}

export async function stopSpeaking(): Promise<void> {
  playId++
  audio?.pause()
  restoreOthers() // 멈추면 다른 앱 소리도 원래대로
  try {
    await TextToSpeech.stop()
  } catch {
    /* 무시 */
  }
}
