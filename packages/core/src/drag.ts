// 끌어다 놓기(드래그): 마우스·터치 모두 Pointer Events 로 처리
// 사용: const drag = useDrag((itemId, dropId) => ...)
//       <div {...drag.handle('사과')} style={drag.style('사과')} />   ← 끌 수 있는 것
//       <div data-drop="바구니1" />                                   ← 놓는 곳
// 놓는 곳이 아니면 onDrop 의 dropId 는 null (제자리로 돌아감)
// 세 번째 값 rect = 놓는 순간 끌던 것의 화면 위치 (칠교처럼 "근처면 맞음" 판정용)
import { useContext, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { FitScale } from './FitStage'

type Drag = { id: string; x: number; y: number; dx: number; dy: number }

export function useDrag(onDrop: (id: string, dropId: string | null, rect: DOMRect) => void) {
  const [drag, setDrag] = useState<Drag | null>(null)
  const fit = useContext(FitScale) // 놀이판이 줄어 있으면 손가락 이동을 배율로 나눔
  const ref = useRef<Drag | null>(null)
  const set = (d: Drag | null) => {
    ref.current = d
    setDrag(d)
  }

  const handle = (id: string) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (ref.current) return
      e.currentTarget.setPointerCapture(e.pointerId)
      set({ id, x: e.clientX, y: e.clientY, dx: 0, dy: 0 })
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const d = ref.current
      if (d?.id === id) set({ ...d, dx: (e.clientX - d.x) / fit.current, dy: (e.clientY - d.y) / fit.current })
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => {
      if (ref.current?.id !== id) return
      const rect = e.currentTarget.getBoundingClientRect() // 제자리로 돌아가기 전 위치
      set(null)
      // 끌던 것 자체는 건너뛰고, 그 밑에 있는 놓는 곳을 찾음
      const target = document
        .elementsFromPoint(e.clientX, e.clientY)
        .map((el) => el.closest<HTMLElement>('[data-drop]'))
        .find((el) => el && !el.contains(e.currentTarget))
      onDrop(id, target?.dataset.drop ?? null, rect)
    },
    onPointerCancel: () => set(null),
  })

  const style = (id: string): CSSProperties =>
    drag?.id === id
      ? { transform: `translate(${drag.dx}px, ${drag.dy}px) scale(1.1)`, zIndex: 10, transition: 'none', touchAction: 'none' }
      : { touchAction: 'none' }

  return { handle, style, dragging: drag?.id ?? null }
}
