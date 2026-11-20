import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { setEmojiFiles } from '@family/core'
import emojiFiles from './emoji-files.json'
import '@family/core/style.css'
// 점토 테마 (모든 앱 공통)
import '@family/core/clay.css'

// 3D 그림 이모지: 이모지를 쓰면 npm run emoji -- <앱> 으로 그림 넣기
setEmojiFiles(emojiFiles)
document.documentElement.classList.add('clay')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
