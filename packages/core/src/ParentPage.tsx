// 부모 화면(산수 잠금 뒤) 공통 — 디자인 시안 "스티커북" 부모 화면
// 앱 소개, 누리과정 영역, 소리(녹음/기기 음성), 모은 별, 앱별 설정(children = ParentSection), 개인정보처리방침
// 칸을 위쪽 탭으로 하나씩 보여 주고, 화면에 맞게 확대/축소 → 폰에서도 스크롤 없음
import { Children, isValidElement, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { FitStage } from './FitStage'
import { eun } from './talk'
import { hasVoiceFiles, setUseVoiceFiles, usesVoiceFiles } from './speech'
import { usesEmojiFiles } from './Emo'
import { UnlockSection } from './Unlock'

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
  unlock,
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
  unlock?: { app: string; free: string[]; paid: string[]; open?: boolean } // 유료 앱: "전체 기능" 칸 (open 이면 이 칸부터 보여 줌)
  children?: ReactNode // 앱별 설정 (ParentSection)
}) {
  const [files, setFiles] = useState(usesVoiceFiles)
  const [armed, setArmed] = useState(false) // 별 초기화: 실수 막기 위해 두 번 누르기
  const [tab, setTab] = useState(unlock?.open ? 1 : 0)

  const sections: ReactElement<{ title: string }>[] = [
    <ParentSection key="about" title="앱 소개">
      <p>{about}</p>
    </ParentSection>,
  ]
  if (unlock) sections.push(<UnlockSection key="unlock" title="전체 기능" app={unlock.app} free={unlock.free} paid={unlock.paid} />)
  if (nuri)
    sections.push(
      <ParentSection key="nuri" title="누리과정">
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
      </ParentSection>,
    )
  if (stars)
    sections.push(
      <ParentSection
        key="stars"
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
      </ParentSection>,
    )
  sections.push(
    <ParentSection key="sound" title="소리">
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
      <p className="muted">소리가 나지 않으면 기기 설정의 "텍스트 음성 변환"에서 한국어 음성을 설치해 주세요.</p>
    </ParentSection>,
  )
  // 앱별 설정 (ParentSection 의 title 이 탭 이름)
  Children.forEach(children, (c) => {
    if (isValidElement<{ title: string }>(c)) sections.push(c)
  })
  sections.push(
    <ParentSection key="privacy" title="개인정보">
      <p>
        {eun(title)} 이름, 사진, 위치, 기기 정보 등 <b>어떤 개인정보도 수집·저장·전송하지 않습니다.</b>
      </p>
      <p className="muted">
        놀이 기록(모은 별 등)과 설정은 기기 안에만 저장되며, 인터넷 연결 없이 동작합니다. 광고·회원가입·외부 링크가 없습니다.
        {unlock && ' 전체 기능 구매는 이 부모 화면에서만, Google Play 결제로 처리됩니다.'}
      </p>
    </ParentSection>,
  )
  // 3D 그림 이모지를 쓰는 앱: MIT 라이선스 표시
  if (usesEmojiFiles())
    sections.push(
      <ParentSection key="license" title="오픈소스">
        <p>그림: Microsoft Fluent Emoji 3D</p>
        <p className="muted">MIT License · Copyright (c) Microsoft Corporation. 자유롭게 사용·수정·배포할 수 있으며, 소프트웨어는 "있는 그대로" 제공되고 어떠한 보증도 하지 않습니다.</p>
      </ParentSection>,
    )
  const at = Math.min(tab, sections.length - 1)

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
      <nav className="sb-ptabs" role="tablist" aria-label="부모 메뉴">
        {sections.map((sec, i) => (
          <button key={sec.props.title} role="tab" aria-selected={i === at} className={i === at ? 'on' : ''} onClick={() => setTab(i)}>
            {sec.props.title}
          </button>
        ))}
      </nav>
      <FitStage key={at} className="sb-pstage" design={[760, 400]} max={1.25} narrow={700}>
        {sections[at]}
      </FitStage>
    </div>
  )
}
