// 부모 화면(산수 잠금 뒤) 공통: 앱 소개, 누리과정 영역, 별 초기화, 개인정보처리방침
import type { ReactNode } from 'react'
import { eun } from './talk'

export function ParentPage({
  title,
  version,
  about,
  nuri,
  onReset,
  onClose,
  children,
}: {
  title: string
  version: string
  about: string
  nuri?: [area: string, what: string][] // 누리과정 영역과 해당 놀이
  onReset?: () => void
  onClose: () => void
  children?: ReactNode // 앱별 설정
}) {
  return (
    <main className="core-info">
      <h1>부모님께</h1>
      <section>
        <h2>{title}</h2>
        <p>버전 {version}</p>
        <p>{about}</p>
        <p>
          소리는 기기에 설치된 음성 읽기(TTS) 기능을 사용합니다. 소리가 나지 않으면 기기 설정의 "텍스트 음성 변환"에서
          한국어 음성을 설치해 주세요.
        </p>
      </section>
      {nuri && (
        <section>
          <h2>누리과정 영역</h2>
          <p>2019 개정 누리과정(만 3~5세)의 영역에 맞춰 놀이를 구성했습니다.</p>
          <ul>
            {nuri.map(([area, what]) => (
              <li key={area}>
                <b>{area}</b> — {what}
              </li>
            ))}
          </ul>
        </section>
      )}
      {children}
      {onReset && (
        <section>
          <h2>모은 별</h2>
          <button className="core-btn off" onClick={() => confirmReset(onReset)}>
            별 처음부터
          </button>
        </section>
      )}
      <section>
        <h2>개인정보처리방침</h2>
        <p>
          {eun(title)} 이름, 사진, 위치, 기기 정보 등 <b>어떤 개인정보도 수집·저장·전송하지 않습니다.</b>
        </p>
        <p>놀이 기록(모은 별 등)은 기기 안에만 저장되며, 인터넷 연결 없이 동작합니다.</p>
      </section>
      <button className="core-btn" onClick={onClose}>
        돌아가기
      </button>
    </main>
  )
}

// 실수로 누르는 것을 막기 위해 한 번 더 누르게 함 (브라우저 확인 창은 쓰지 않음)
let armed = 0
function confirmReset(fn: () => void) {
  if (Date.now() - armed < 3000) {
    armed = 0
    fn()
  } else armed = Date.now()
}
