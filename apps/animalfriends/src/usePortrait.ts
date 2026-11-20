import { useEffect, useState } from 'react'

// 세로 화면(아이폰 세로 등)인지: 세로면 카드를 2줄로 크게, 가로면 한 줄에 많이
export function usePortrait() {
  const q = '(orientation: portrait)'
  const [p, setP] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setP(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return p
}
