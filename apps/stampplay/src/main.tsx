import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { setEmojiFiles } from '@family/core'
import emojiFiles from './emoji-files.json'
import '@family/core/style.css'
// 점토 테마 (2026-11-20 찬욱 결정: 모든 앱)
import '@family/core/clay.css'
// 시안 글꼴 (OFL, 앱에 포함해 오프라인에서도 보임)
import '@fontsource/jua/400.css'
import '@fontsource/gowun-dodum/400.css'

// 3D 그림 이모지 (npm run emoji 가 만듦)
setEmojiFiles(emojiFiles)
document.documentElement.classList.add('clay')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
