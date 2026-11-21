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
      // 가로 배치는 놀이판도 가로로 길고 화면(창)도 가로일 때만. 세로 폰에서 위 메뉴가 두 줄로 접혀 놀이판이
      // 납작해져도 가로 배치(폭 1000)로 그리면 글자·그림이 아주 작아짐 (아이폰 SE)
      const base = W >= H && W >= narrow && innerWidth >= innerHeight ? design[0] : design[1]
      // 배율 s 일 때 폭 W/s 로 배치해서 세로가 들어가는지
      const fits = (k: number) => {
        el.style.width = `${W / k}px`
        return el.offsetHeight * k <= H
      }
      let s = Math.min(W / base, max)
      if (!fits(s)) {
        // 세로가 넘치면: 넓게 배치할수록 낮아지므로, 들어가는 가장 큰 배율을 반으로 나눠 찾기
        // (예전엔 한 번 줄이고 끝이라 아이폰 SE 처럼 짧은 화면에서 지나치게 작아졌음)
        let lo = s * 0.25
        let hi = s
        if (!fits(lo)) lo = Math.min(lo, H / el.offsetHeight)
        for (let i = 0; i < 9; i++) {
          const mid = (lo + hi) / 2
          if (fits(mid)) lo = mid
          else hi = mid
        }
        s = lo
        fits(s)
      }
      const h = el.offsetHeight
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
