// 도형 목록: 이름, SVG 경로(100×100 칸 기준), 색
const star = (() => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 ? 19 : 46
    const a = (Math.PI / 5) * i - Math.PI / 2
    return `${(50 + r * Math.cos(a)).toFixed(1)} ${(54 + r * Math.sin(a)).toFixed(1)}`
  })
  return `M${pts.join(' L')} Z`
})()

export type Shape = { id: string; name: string; d: string; color: string }

export const SHAPES: Shape[] = [
  { id: 'circle', name: '동그라미', d: 'M8 50 A42 42 0 1 0 92 50 A42 42 0 1 0 8 50 Z', color: '#FF8C6B' },
  { id: 'triangle', name: '세모', d: 'M50 8 L94 88 L6 88 Z', color: '#6EC1F5' },
  { id: 'square', name: '네모', d: 'M12 12 H88 V88 H12 Z', color: '#63D2A1' },
  { id: 'star', name: '별', d: star, color: '#FFC94A' },
  { id: 'heart', name: '하트', d: 'M50 90 C20 70 6 52 6 33 C6 18 18 8 30 8 C40 8 47 14 50 22 C53 14 60 8 70 8 C82 8 94 18 94 33 C94 52 80 70 50 90 Z', color: '#FF9EC4' },
  { id: 'diamond', name: '마름모', d: 'M50 4 L94 50 L50 96 L6 50 Z', color: '#B79CF7' },
]

export function ShapeIcon({ shape, color, hole }: { shape: Shape; color?: string; hole?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" aria-label={shape.name}>
      <path
        d={shape.d}
        fill={hole ? '#F3E6CC' : (color ?? shape.color)}
        stroke={hole ? '#B49F78' : '#2A2840'}
        strokeWidth={hole ? 4 : 5}
        strokeDasharray={hole ? '9 7' : undefined}
        strokeLinejoin="round"
      />
    </svg>
  )
}
