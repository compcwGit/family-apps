// 부모 화면(산수 잠금 뒤) 공통 — 디자인 시안 "스티커북" 부모 화면: 차분한 2단 카드
// 앱 소개, 누리과정 영역, 소리(녹음/기기 음성), 모은 별, 앱별 설정(children), 개인정보처리방침
import { useState, type CSSProperties, type ReactNode } from 'react'
import { eun } from './talk'
import { hasVoiceFiles, setUseVoiceFiles, usesVoiceFiles } from './speech'

// 앱별 설정 칸 (children 안에서 씀)
export function ParentSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="sb-card">
      <div className="sb-card-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

// 두 개 중 고르기 (녹음/기기 음성, 하나 둘/일 이 등)
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: [T, string][]
  onChange: (v: T) => void
}) {
  return (
    <div className="sb-seg" role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => (
        <button key={v} role="radio" aria-checked={v === value} className={v === value ? 'on' : ''} onClick={() => onChange(v)}>
          {text}
        </button>
      ))}
    </div>
  )
}

const NURI_COLORS: Record<string, string> = {
  자연탐구: '#2FB36B',
  예술경험: '#8A6AE0',
  의사소통: '#2D8FD5',
  사회관계: '#E0704A',
  '신체운동·건강': '#C99A12',
}

export function ParentPage({
  title,
  version,
  accent,
  about,
  nuri,
  stars,
  onReset,
  onClose,
  children,
}: {
  title: string
  version: string
  accent: string
  about: string
  nuri?: [area: string, what: string][] // 누리과정 영역과 해당 놀이
  stars?: [game: string, n: number][] // 놀이별 모은 별
  onReset?: () => void
  onClose: () => void
  children?: ReactNode // 앱별 설정 (ParentSection)
}) {
  const [files, setFiles] = useState(usesVoiceFiles)
  const [armed, setArmed] = useState(false) // 별 초기화: 실수 막기 위해 두 번 누르기
  return (
    <div className="sb-parent" style={{ '--accent': accent } as CSSProperties}>
      <header className="sb-parent-top">
        <div className="sb-parent-title">
          <h1>부모님께</h1>
          <span>
            {title} · 버전 {version}
          </span>
        </div>
        <button className="sb-pill" onClick={onClose}>
          아이 화면으로
        </button>
      </header>
      <div className="sb-parent-grid">
        <div className="sb-col">
          <ParentSection title={title}>
            <p>{about}</p>
          </ParentSection>
          {nuri && (
            <ParentSection title="누리과정 영역">
              <p className="muted">2019 개정 누리과정(만 3~5세)의 영역에 맞춰 놀이를 구성했습니다.</p>
              <ul className="sb-nuri">
                {nuri.map(([area, what]) => (
                  <li key={area}>
                    <span className="sb-chip" style={{ borderColor: NURI_COLORS[area] ?? '#2A2840' }}>
                      {area}
                    </span>
                    <span>{what}</span>
                  </li>
                ))}
              </ul>
            </ParentSection>
          )}
          <ParentSection title="소리">
            {hasVoiceFiles() ? (
              <Segmented
                label="읽어 주는 목소리"
                value={files ? 'files' : 'tts'}
                options={[
                  ['files', '녹음한 목소리'],
                  ['tts', '기기 음성 (TTS)'],
                ]}
                onChange={(v) => {
                  setFiles(v === 'files')
                  setUseVoiceFiles(v === 'files')
                }}
              />
            ) : null}
            <p className="muted">
              소리가 나지 않으면 기기 설정의 "텍스트 음성 변환"에서 한국어 음성을 설치해 주세요.
            </p>
          </ParentSection>
        </div>
        <div className="sb-col">
          {stars && (
            <ParentSection
              title="모은 별"
              action={
                onReset && (
                  <button
                    className="sb-pill quiet"
                    onClick={() => {
                      if (!armed) return setArmed(true)
                      setArmed(false)
                      onReset()
                    }}
                  >
                    {armed ? '한 번 더 누르면 지워요' : '처음부터'}
                  </button>
                )
              }
            >
              <div className="sb-stars">
                {stars.map(([game, n]) => (
                  <div key={game}>
                    <span>{game}</span>
                    <b>{n}</b>
                  </div>
                ))}
              </div>
            </ParentSection>
          )}
          {children}
          <ParentSection title="개인정보처리방침">
            <p>
              {eun(title)} 이름, 사진, 위치, 기기 정보 등 <b>어떤 개인정보도 수집·저장·전송하지 않습니다.</b>
            </p>
            <p className="muted">
              놀이 기록(모은 별 등)과 설정은 기기 안에만 저장되며, 인터넷 연결 없이 동작합니다. 광고·결제·회원가입·외부 링크가
              없습니다.
            </p>
          </ParentSection>
        </div>
      </div>
    </div>
  )
}
