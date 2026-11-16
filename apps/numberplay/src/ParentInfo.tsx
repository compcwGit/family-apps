import pkg from '../package.json'
import type { Mode } from './numbers'

// 부모 화면(산수 잠금 뒤): 읽는 방법 설정, 앱 정보, 개인정보처리방침
export function ParentInfo({ mode, setMode, onClose }: { mode: Mode; setMode: (m: Mode) => void; onClose: () => void }) {
  return (
    <main className="info">
      <h1>부모님께</h1>
      <section>
        <h2>숫자 읽는 방법</h2>
        <div className="row">
          <button className={mode === 'native' ? 'core-btn' : 'core-btn off'} onClick={() => setMode('native')}>
            하나, 둘, 셋
          </button>
          <button className={mode === 'sino' ? 'core-btn' : 'core-btn off'} onClick={() => setMode('sino')}>
            일, 이, 삼
          </button>
        </div>
        <p>"하나, 둘"은 99(아흔아홉)까지, 100은 "백"으로 읽습니다.</p>
      </section>
      <section>
        <h2>숫자 놀이</h2>
        <p>버전 {pkg.version}</p>
        <p>
          화면을 누를 때마다 숫자를 하나씩 세며 1부터 100까지 소리로 읽어 주는 유아용 앱입니다. 소리는 기기에
          설치된 음성 읽기(TTS) 기능을 사용합니다. 소리가 나지 않으면 기기 설정의 "텍스트 음성 변환"에서 한국어
          음성을 설치해 주세요.
        </p>
      </section>
      <section>
        <h2>개인정보처리방침</h2>
        <p>숫자 놀이는 이름, 사진, 위치, 기기 정보 등 <b>어떤 개인정보도 수집·저장·전송하지 않습니다.</b></p>
        <p>센 숫자와 설정만 기기 안에 저장되며, 인터넷 연결 없이 동작합니다.</p>
      </section>
      <button className="core-btn" onClick={onClose}>
        돌아가기
      </button>
    </main>
  )
}
