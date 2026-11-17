// 놀이판 맞추기: 안의 내용을 놀이판 크기에 맞춰 통째로 줄이거나 키움 → 어떤 기기에서도 스크롤 없음
// 내용은 "설계 폭"(가로 화면 1000px, 세로 화면 600px)으로 배치한 뒤 놀이판에 꽉 차게 확대/축소
// (태블릿에서는 최대 1.5배까지 크게, 아이폰에서는 작게)
import { createContext, useLayoutEffect, useRef, type ReactNode } from 'react'

// 끌어다 놓기(useDrag)가 손가락 이동을 배율로 나눠서 쓰도록 지금 배율을 알려 줌
export const FitScale = createContext<{ current: number }>({ current: 1 })

const MAX = 1.5
const PAD = 20

export function FitStage({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const scale = useRef({ current: 1 }).current

  useLayoutEffect(() => {
    const st = stage.current!
    const el = inner.current!
    let busy = false
    const fit = () => {
      if (busy) return
      busy = true
      const W = st.clientWidth - PAD * 2
      const H = st.clientHeight - PAD * 2
      if (W <= 0 || H <= 0) return void (busy = false)
      const design = W >= H ? 1000 : 600
      let s = Math.min(W / design, MAX)
      el.style.width = `${W / s}px`
      let h = el.offsetHeight
      if (h * s > H) {
        // 세로가 넘치면 더 줄이고, 그만큼 넓게 배치해서 다시 잼
        s = H / h
        el.style.width = `${W / s}px`
        h = el.offsetHeight
        s = Math.min(s, H / h, MAX)
      }
      const w = el.offsetWidth
      scale.current = s
      el.style.transform = `translate(${PAD + (W - w * s) / 2}px, ${PAD + (H - h * s) / 2}px) scale(${s})`
      busy = false
    }
    fit()
    const ro = new ResizeObserver(() => requestAnimationFrame(fit))
    ro.observe(st)
    ro.observe(el)
    return () => ro.disconnect()
  }, [scale])

  return (
    <div className="sb-stage" ref={stage}>
      <FitScale.Provider value={scale}>
        <div className="sb-fit" ref={inner}>
          {children}
        </div>
      </FitScale.Provider>
    </div>
  )
}
