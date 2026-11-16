import pkg from '../package.json'
import type { SpeechOptions } from '@family/core'
import type { NumRead } from './Trace'
import { VoiceSettings } from './VoiceSettings'

// 부모 화면(산수 잠금 뒤): 진도, 앱 정보, 개인정보처리방침
export function ParentInfo({
  doneCount,
  numRead,
  onNumRead,
  voice,
  onVoice,
  onReset,
  onClose,
}: {
  doneCount: number
  numRead: NumRead
  onNumRead: (r: NumRead) => void
  voice: SpeechOptions
  onVoice: (v: SpeechOptions) => void
  onReset: () => void
  onClose: () => void
}) {
  return (
    <main className="info">
      <h1>부모님께</h1>
      <section>
        <h2>진도</h2>
        <p>따라쓰기 완료: {doneCount} / 34 (한글 24 + 숫자 10)</p>
        <button className="core-link" onClick={onReset}>진도 초기화</button>
      </section>
      <VoiceSettings value={voice} onChange={onVoice} />
      <section>
        <h2>숫자 읽는 소리</h2>
        <div className="seg">
          <button className={numRead === 'native' ? 'seg-btn on' : 'seg-btn'} onClick={() => onNumRead('native')}>
            하나, 둘, 셋
          </button>
          <button className={numRead === 'sino' ? 'seg-btn on' : 'seg-btn'} onClick={() => onNumRead('sino')}>
            일, 이, 삼
          </button>
        </div>
      </section>
      <section>
        <h2>한글 놀이</h2>
        <p>버전 {pkg.version}</p>
        <p>
          자음·모음 카드, 글자 만들기(ㄱ+ㅏ=가), 따라쓰기로 한글을 익히는 유아용 앱입니다.
          소리는 기기에 설치된 음성 읽기(TTS) 기능을 사용합니다. 소리가 나지 않으면 기기 설정의
          "텍스트 음성 변환"에서 한국어 음성을 설치해 주세요.
        </p>
      </section>
      <section>
        <h2>개인정보처리방침</h2>
        <p>한글 놀이는 이름, 사진, 위치, 기기 정보 등 <b>어떤 개인정보도 수집·저장·전송하지 않습니다.</b></p>
        <p>학습 진도는 이 기기 안에만 저장됩니다. 광고, 결제, 회원가입, 외부 링크가 없으며 인터넷 연결 없이 동작합니다.</p>
      </section>
      <button className="core-btn" onClick={onClose}>
        돌아가기
      </button>
    </main>
  )
}
