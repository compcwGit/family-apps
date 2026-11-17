import type { CSSProperties } from 'react'
import type { Ink } from './stamps'

// 도장 모양: 두 겹 원 테두리 + 잉크 색. 그림(emoji)이 없으면 기본 "참 잘했어요" 도장
// 크기는 감싼 요소의 너비를 따름 (.sp-mark 너비를 정하면 글자·테두리가 같이 커짐)
export const tiltOf = (i: number) => [-8, 5, -3, 10][(i * 7) % 4]

export function StampMark({ emoji, ink = 'red', tilt = 0, className = '' }: { emoji: string; ink?: Ink; tilt?: number; className?: string }) {
  return (
    <span className={'sp-mark ' + className}>
      <span className={'sp-stamp ink-' + ink} style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
        {emoji ? (
          <span className="sp-stamp-emoji">{emoji}</span>
        ) : (
          <>
            <span>참</span>
            <span>잘했어요</span>
          </>
        )}
      </span>
    </span>
  )
}
