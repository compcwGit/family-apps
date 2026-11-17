import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@family/core/style.css'
// 시안 글꼴 (OFL, 앱에 포함해 오프라인에서도 보임)
import '@fontsource/jua/400.css'
import '@fontsource/gowun-dodum/400.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
