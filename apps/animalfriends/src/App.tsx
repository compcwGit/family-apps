import { useState } from 'react'
import { ParentGate } from '@family/core'
import { AnimalBoard } from './AnimalBoard'
import './app.css'

// 동물 친구들: 누르면 소리가 나는 동물 버튼판
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
    <>
      <AnimalBoard />
      <button className="core-parent-btn" onClick={() => setParent('gate')} aria-label="부모 메뉴">⚙️</button>
    </>
  )
}
