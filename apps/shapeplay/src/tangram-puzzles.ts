// 칠교 도안: 조각 = 꼭짓점 목록(칸 좌표, 1칸 = 정사각형 칠교판 한 변의 1/4)
// 유치원생용: 조각을 돌리지 않음. 조각은 처음부터 도안 자리와 같은 방향으로 나옴
// 같은 모양·같은 방향 조각(작은 세모 2개 등)은 어느 자리에 놓아도 맞음
export type Pt = [number, number]
export type Piece = { id: string; pts: Pt[]; color: string }
export type Puzzle = { id: string; name: string; pieces: Piece[] }

const COLOR = { big1: '#FF6B57', big2: '#6EC1F5', mid: '#FFC94A', small1: '#63D2A1', small2: '#B79CF7', square: '#FF9EC4', para: '#FF9A3C' }
const P = (id: keyof typeof COLOR, ...pts: Pt[]): Piece => ({ id, pts, color: COLOR[id] })

// 쉬운 것(조각 3개)부터 → 정사각형(7개 모두)
export const PUZZLES: Puzzle[] = [
  {
    id: 'tree', name: '나무',
    pieces: [P('big1', [0, 2], [4, 2], [2, 0]), P('big2', [0, 4], [4, 4], [2, 2]), P('square', [2, 4], [3, 5], [2, 6], [1, 5])],
  },
  {
    id: 'fish', name: '물고기',
    pieces: [P('big1', [0, 2], [4, 2], [2, 0]), P('big2', [0, 2], [4, 2], [2, 4]), P('mid', [4, 2], [6, 2], [6, 0]),
      P('small1', [4, 2], [6, 2], [5, 3])],
  },
  {
    id: 'house', name: '집',
    pieces: [P('big1', [0, 4], [4, 4], [2, 2]), P('big2', [0, 6], [4, 6], [2, 4]), P('mid', [0, 4], [2, 4], [0, 6]),
      P('small1', [2, 4], [4, 4], [3, 5]), P('small2', [4, 4], [4, 6], [3, 5])],
  },
  {
    id: 'boat', name: '배',
    pieces: [P('big1', [2, 0], [2, 4], [0, 2]), P('mid', [2, 2], [2, 4], [4, 4]), P('small1', [0, 4], [2, 4], [1, 5]),
      P('para', [1, 5], [2, 4], [4, 4], [3, 5]), P('small2', [4, 4], [5, 5], [3, 5])],
  },
  {
    id: 'square', name: '네모',
    pieces: [P('big1', [0, 0], [4, 0], [2, 2]), P('big2', [0, 0], [2, 2], [0, 4]), P('mid', [4, 2], [4, 4], [2, 4]),
      P('small1', [4, 0], [4, 2], [3, 1]), P('small2', [2, 2], [3, 3], [1, 3]), P('square', [2, 2], [3, 1], [4, 2], [3, 3]),
      P('para', [0, 4], [1, 3], [3, 3], [2, 4])],
  },
]

// 조각 모양 비교용: 왼쪽 위를 (0,0)으로 옮긴 꼭짓점 (순서 무관)
export function shapeKey(pts: Pt[]) {
  const mx = Math.min(...pts.map((p) => p[0]))
  const my = Math.min(...pts.map((p) => p[1]))
  return pts
    .map(([x, y]) => `${x - mx},${y - my}`)
    .sort()
    .join(' ')
}

export function bounds(pts: Pt[]) {
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }
}
