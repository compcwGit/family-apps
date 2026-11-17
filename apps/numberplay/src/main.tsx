import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@family/core/style.css'
// 아이 화면 글꼴 Jua (OFL, 앱에 포함해 오프라인에서도 보임)
import '@fontsource/jua/400.css'
import { setVoiceFiles } from '@family/core'

// 녹음 파일 목록 (scripts/tts/make_voices.py 가 만듦). 없으면 기기 음성(TTS)으로 읽음
const voiceFiles = Object.values(import.meta.glob<Record<string, string>>('./voice-files.json', { eager: true, import: 'default' }))[0]
setVoiceFiles(voiceFiles)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
