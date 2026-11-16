// 음원 파일 없이 WebAudio 로 짧은 소리를 냄 (2주차에 실제 동물 소리 파일로 교체)
let ctx: AudioContext | null = null

export function playTone(freq: number) {
  ctx ??= new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.6)
}
