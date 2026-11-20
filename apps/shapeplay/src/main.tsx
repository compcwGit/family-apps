import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@family/core/style.css'
// 점토 테마 (2026-11-20 찬욱 결정: 모든 앱)
import '@family/core/clay.css'
// 아이 화면 글꼴 Jua (OFL, 앱에 포함해 오프라인에서도 보임)
import '@fontsource/jua/400.css'
import { setVoiceFiles, setEmojiFiles } from '@family/core'
import emojiFiles from './emoji-files.json'

// 녹음 파일 목록 (scripts/tts/make_voices.py 가 만듦). 없으면 기기 음성(TTS)으로 읽음
const voiceFiles = Object.values(import.meta.glob<Record<string, string>>('./voice-files.json', { eager: true, import: 'default' }))[0]
setVoiceFiles(voiceFiles)

// 3D 그림 이모지 (npm run emoji 가 만듦)
setEmojiFiles(emojiFiles)
document.documentElement.classList.add('clay')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
