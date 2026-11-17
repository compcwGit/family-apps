// 색칠 놀이 그림·색 (SVG 200×200 칸 기준). 칸 하나 = 칠할 수 있는 부분 하나
export type Part = { el: 'path' | 'circle' | 'rect' | 'ellipse'; p: Record<string, number | string> }
const c = (cx: number, cy: number, r: number): Part => ({ el: 'circle', p: { cx, cy, r } })
const r = (x: number, y: number, width: number, height: number, rx = 4): Part => ({ el: 'rect', p: { x, y, width, height, rx } })
const e = (cx: number, cy: number, rx: number, ry: number, rot = 0): Part => ({
  el: 'ellipse',
  p: { cx, cy, rx, ry, transform: `rotate(${rot} ${cx} ${cy})` },
})
const d = (path: string): Part => ({ el: 'path', p: { d: path } })

export const PICTURES: { id: string; name: string; icon: string; parts: Part[] }[] = [
  {
    id: 'house', name: '집', icon: '🏠',
    parts: [r(0, 172, 200, 28, 0), c(165, 32, 20), r(128, 42, 16, 36), r(40, 92, 120, 80, 2), d('M28 96 L100 34 L172 96 Z'),
      r(88, 126, 26, 46), r(54, 106, 24, 24), r(122, 106, 24, 24)],
  },
  {
    id: 'flower', name: '꽃', icon: '🌷',
    parts: [r(97, 92, 6, 70, 3), e(78, 130, 20, 8, -30), e(122, 125, 20, 8, 30),
      ...[0, 60, 120, 180, 240, 300].map((a) => c(100 + 27 * Math.cos((a * Math.PI) / 180), 66 + 27 * Math.sin((a * Math.PI) / 180), 17)),
      c(100, 66, 15), d('M66 158 L134 158 L122 196 L78 196 Z')],
  },
  {
    id: 'fish', name: '물고기', icon: '🐟',
    parts: [d('M148 100 L192 64 L192 136 Z'), d('M78 72 L100 40 L118 72 Z'), e(95, 102, 62, 38), e(105, 108, 14, 8, 30),
      c(62, 94, 8), c(30, 54, 9), c(42, 26, 6), d('M30 200 Q20 170 34 150 Q46 172 40 200 Z')],
  },
  {
    id: 'car', name: '자동차', icon: '🚗',
    parts: [d('M48 104 L70 60 L132 60 L158 104 Z'), r(18, 100, 166, 50, 14), d('M66 100 L79 68 L98 68 L98 100 Z'),
      d('M106 100 L106 68 L126 68 L146 100 Z'), c(56, 150, 21), c(146, 150, 21), r(170, 112, 12, 10, 3)],
  },
  {
    id: 'rocket', name: '로켓', icon: '🚀',
    parts: [d('M100 14 C128 40 132 80 128 140 L72 140 C68 80 72 40 100 14 Z'), c(100, 70, 14), d('M72 110 L46 150 L72 140 Z'),
      d('M128 110 L154 150 L128 140 Z'), d('M82 140 L118 140 L100 190 Z'), c(30, 40, 6), c(170, 60, 5), c(160, 18, 4)],
  },
]
export const PALETTE = ['#FF6B57', '#FF9A3C', '#FFC94A', '#63D2A1', '#6EC1F5', '#5B6CE0', '#B79CF7', '#FF9EC4', '#A86F4C', '#2A2840', '#FFFFFF']
export const NAMES = ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라', '분홍', '갈색', '검정', '지우개']

