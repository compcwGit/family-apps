import pkg from '../package.json'

// 부모 화면(산수 잠금 뒤): 앱 정보와 개인정보처리방침
export function ParentInfo({ onClose }: { onClose: () => void }) {
  return (
    <main className="info">
      <h1>부모님께</h1>
      <section>
        <h2>동물 친구들</h2>
        <p>버전 {pkg.version}</p>
        <p>
          동물을 누르면 이름과 울음소리를 들려주고, "누구일까요?" 퀴즈로 울음소리를 맞혀 보는 유아용 앱입니다.
          소리는 기기에 설치된 음성 읽기(TTS) 기능을 사용합니다. 소리가 나지 않으면 기기 설정의
          "텍스트 음성 변환"에서 한국어 음성을 설치해 주세요.
        </p>
      </section>
      <section>
        <h2>개인정보처리방침</h2>
        <p>동물 친구들은 이름, 사진, 위치, 기기 정보 등 <b>어떤 개인정보도 수집·저장·전송하지 않습니다.</b></p>
        <p>광고, 결제, 회원가입, 외부 링크가 없으며 인터넷 연결 없이 동작합니다.</p>
      </section>
      <button className="core-btn" onClick={onClose}>
        돌아가기
      </button>
    </main>
  )
}
