import { useState } from 'react'
import { ParentGate } from '@family/core'

// 새 앱 첫 화면. 여기서부터 만들면 됩니다.
export default function App() {
  const [parent, setParent] = useState<'closed' | 'gate' | 'open'>('closed')

  if (parent === 'gate') return <ParentGate onPass={() => setParent('open')} onCancel={() => setParent('closed')} />
  if (parent === 'open')
    return (
      <main>
        <h1>부모 화면</h1>
        <button className="core-btn" onClick={() => setParent('closed')}>돌아가기</button>
      </main>
    )

  return (
    <main>
      <h1>__TITLE__</h1>
      <p>새 앱이 준비됐어요.</p>
      <button className="core-parent-btn" onClick={() => setParent('gate')} aria-label="부모 메뉴">⚙️</button>
    </main>
  )
}
