// 음원 파일 없이 WebAudio 로 소리를 만듦 (코드로 만든 소리라 라이선스 필요 없음)
//
// 아이폰(Safari)·안드로이드 WebView 주의:
//  - 소리는 "탭(click/touchend)" 안에서 한 번 켜 줘야 나옴 → 첫 탭 때 자동으로 켬 (unlock)
//  - 웹(아이폰 Safari): audioSession 'ambient' = 다른 앱 음악을 멈추지 않고 같이 재생 (찬욱 결정 2026-11-20)
//    대신 아이폰 무음 스위치를 켜면 앱 소리가 안 남. ('playback' 은 무음과 상관없이 나지만 유튜브 뮤직 등을 멈춤)
//    웹은 "잠깐 줄이기"가 안 됨. 안드로이드 앱은 packages/audio-focus 로 말할 때 음악을 잠깐 줄임
let ctx: AudioContext | null = null

// 소리 방식 설정 (소리를 내기 전에 한 번 호출): 다른 앱 음악과 섞어서 재생
export function followMediaVolume() {
  try {
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    if (nav.audioSession) nav.audioSession.type = 'ambient'
  } catch {
    /* 지원 안 하는 기기는 무시 */
  }
}

function audio(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    followMediaVolume()
  }
  if (ctx.state !== 'running') ctx.resume().catch(() => {})
  return ctx
}

// 첫 탭 때 소리 켜기: 무음 1샘플을 재생해서 이후 소리가 바로 나게 함
// 웹(아이폰 Safari)에서는 기기 음성도 탭 안에서 한 번 말해야 그 뒤에 말할 수 있어서, 들리지 않는 말을 한 번 함
let speechUnlocked = false
if (typeof window !== 'undefined') {
  const unlock = () => {
    if (!speechUnlocked && 'speechSynthesis' in window) {
      speechUnlocked = true
      try {
        const u = new SpeechSynthesisUtterance(' ')
        u.volume = 0
        window.speechSynthesis.speak(u)
      } catch {
        /* 무시 */
      }
    }
    const c = audio()
    const src = c.createBufferSource()
    src.buffer = c.createBuffer(1, 1, 22050)
    src.connect(c.destination)
    src.start(0)
    if (c.state === 'running') {
      window.removeEventListener('touchend', unlock, true)
      window.removeEventListener('click', unlock, true)
    }
  }
  window.addEventListener('touchend', unlock, true)
  window.addEventListener('click', unlock, true)
}

// 짧은 효과음 ("띵")
export function playTone(freq: number) {
  const c = audio()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'triangle'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.3, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6)
  osc.connect(gain).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + 0.6)
}

// 피아노 비슷한 소리: 배음 몇 개를 겹치고, 빠르게 치고 천천히 사라지게 (높은 배음일수록 빨리 사라짐)
const PARTIALS: [ratio: number, level: number, decay: number][] = [
  [1, 0.55, 1.6],
  [2, 0.22, 1.0],
  [3, 0.1, 0.7],
  [4, 0.05, 0.5],
  [5, 0.025, 0.35],
]
export function playPiano(freq: number) {
  const c = audio()
  const t = c.currentTime
  const out = c.createGain()
  out.gain.value = 0.45
  out.connect(c.destination)
  for (const [ratio, level, decay] of PARTIALS) {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq * ratio * (1 + 0.0004 * ratio) // 피아노 줄처럼 높은 배음이 살짝 높음
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(level, t + 0.006) // 치는 순간
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay) // 사라짐
    osc.connect(g).connect(out)
    osc.start(t)
    osc.stop(t + decay + 0.05)
  }
}
