import { useEffect, useState } from 'react'
import { listKoreanVoices, setSpeechOptions, speak, type SpeechOptions } from '@family/core'
import { SAMPLE } from './talk'
const RATES = [
  { v: 0.6, label: '천천히' },
  { v: 0.75, label: '조금 천천히' },
  { v: 0.95, label: '보통' },
]
const PITCHES = [
  { v: 1.0, label: '낮게' },
  { v: 1.2, label: '보통' },
  { v: 1.4, label: '높게' },
]

// 부모 화면: 목소리·속도·높낮이 고르기 (고르면 바로 들려줌)
export function VoiceSettings({ value, onChange }: { value: SpeechOptions; onChange: (v: SpeechOptions) => void }) {
  const [voices, setVoices] = useState<{ id: string; name: string; local: boolean }[] | null>(null)
  useEffect(() => {
    listKoreanVoices().then(setVoices)
  }, [])

  const change = (o: Partial<SpeechOptions>) => {
    const next = { ...value, ...o }
    setSpeechOptions(next)
    onChange(next)
    speak(SAMPLE)
  }

  const seg = <T,>(list: { v: T; label: string }[], cur: T, set: (v: T) => void) => (
    <div className="seg">
      {list.map((x) => (
        <button key={x.label} className={cur === x.v ? 'seg-btn on' : 'seg-btn'} onClick={() => set(x.v)}>
          {x.label}
        </button>
      ))}
    </div>
  )

  return (
    <section>
      <h2>목소리</h2>
      <div className="voice-list">
        <button className={value.voice === '' ? 'voice on' : 'voice'} onClick={() => change({ voice: '' })}>
          기기 기본 목소리
        </button>
        {voices?.map((v, i) => (
          <button key={v.id} className={value.voice === v.id ? 'voice on' : 'voice'} onClick={() => change({ voice: v.id })}>
            목소리 {i + 1} <small>{v.name}{v.local ? '' : ' · 인터넷 필요'}</small>
          </button>
        ))}
      </div>
      {voices && voices.length === 0 && (
        <p>이 기기에서 고를 수 있는 한국어 목소리가 없어요. 기기 설정의 "텍스트 음성 변환"에서 한국어 음성을 설치해 주세요.</p>
      )}
      <h2>읽는 속도</h2>
      {seg(RATES, value.rate, (rate) => change({ rate }))}
      <h2>목소리 높이</h2>
      {seg(PITCHES, value.pitch, (pitch) => change({ pitch }))}
      <p>
        <button className="core-link" onClick={() => speak(SAMPLE)}>
          🔊 들어 보기
        </button>
      </p>
    </section>
  )
}
