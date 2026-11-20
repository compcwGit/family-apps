// 놀이판 맞추기: 안의 내용을 놀이판 크기에 맞춰 통째로 줄이거나 키움 → 어떤 기기에서도 스크롤 없음
// 내용은 "설계 폭"(가로 화면 1000px, 세로 화면 600px)으로 배치한 뒤 놀이판에 꽉 차게 확대/축소
// (태블릿에서는 최대 1.5배까지 크게, 아이폰에서는 작게)
import { createContext, useLayoutEffect, useRef, type ReactNode } from 'react'

// 끌어다 놓기(useDrag)가 손가락 이동을 배율로 나눠서 쓰도록 지금 배율을 알려 줌
export const FitScale = createContext<{ current: number }>({ current: 1 })

const PAD = 20

export function FitStage({
  children,
  className = 'sb-stage',
  design = [1000, 600],
  max = 1.5,
  narrow = 0,
  top = false,
  bar,
}: {
  children: ReactNode
  className?: string
  design?: [landscape: number, portrait: number] // 배치할 때 쓰는 폭
  max?: number // 최대 확대 배율
  narrow?: number // 폭이 이보다 좁으면 가로로 길어도 세로용 폭으로 배치 (부모 화면)
  bar?: ReactNode // 놀이판 맨 위 고정 줄 (확대/축소 안 됨 → 화면이 바뀌어도 버튼 크기·위치 그대로)
  top?: boolean // 세로 가운데 대신 위쪽에 붙임 (화면마다 내용 높이가 달라도 위쪽 메뉴 위치가 그대로)
}) {
  const stage = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const barEl = useRef<HTMLDivElement>(null)
  const scale = useRef({ current: 1 }).current

  useLayoutEffect(() => {
    const st = stage.current!
    const el = inner.current!
    let busy = false
    const fit = () => {
      if (busy) return
      busy = true
      const W = st.clientWidth - PAD * 2
      const bh = barEl.current?.offsetHeight ?? 0
      const H = st.clientHeight - PAD * 2 - bh
      if (W <= 0 || H <= 0) return void (busy = false)
      const base = W >= H && W >= narrow ? design[0] : design[1]
      let s = Math.min(W / base, max)
      el.style.width = `${W / s}px`
      let h = el.offsetHeight
      if (h * s > H) {
        // 세로가 넘치면 더 줄이고, 그만큼 넓게 배치해서 다시 잼
        s = H / h
        el.style.width = `${W / s}px`
        h = el.offsetHeight
        s = Math.min(s, H / h, max)
      }
      const w = el.offsetWidth
      scale.current = s
      el.style.transform = `translate(${PAD + (W - w * s) / 2}px, ${bh + (top ? PAD : PAD + (H - h * s) / 2)}px) scale(${s})`
      busy = false
    }
    fit()
    const ro = new ResizeObserver(() => requestAnimationFrame(fit))
    ro.observe(st)
    ro.observe(el)
    if (barEl.current) ro.observe(barEl.current)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale])

  return (
    <div className={className} ref={stage}>
      {bar && (
        <div className="sb-bar" ref={barEl}>
          {bar}
        </div>
      )}
      <FitScale.Provider value={scale}>
        <div className="sb-fit" ref={inner}>
          {children}
        </div>
      </FitScale.Provider>
    </div>
  )
}
