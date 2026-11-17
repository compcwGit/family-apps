// 음원 파일 없이 WebAudio 로 소리를 만듦 (코드로 만든 소리라 라이선스 필요 없음)
//
// 아이폰(Safari)·안드로이드 WebView 주의:
//  - 소리는 "탭(click/touchend)" 안에서 한 번 켜 줘야 나옴 → 첫 탭 때 자동으로 켬 (unlock)
//  - 무음 스위치를 켜면 소리가 나지 않아야 함 (부모가 정한 무음 존중) → audioSession 을 'ambient' 로 (iOS 17+, Safari 16.4+)
//    이 설정은 녹음 목소리 재생(speech.ts 의 Audio)에도 적용됨: 아이폰은 원래 녹음 재생이 무음을 무시함
let ctx: AudioContext | null = null

// 아이폰 무음 스위치를 따르게 함 (소리를 내기 전에 한 번 호출)
export function respectSilentSwitch() {
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
    respectSilentSwitch()
  }
  if (ctx.state !== 'running') ctx.resume().catch(() => {})
  return ctx
}

// 첫 탭 때 소리 켜기: 무음 1샘플을 재생해서 이후 소리가 바로 나게 함
if (typeof window !== 'undefined') {
  const unlock = () => {
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
