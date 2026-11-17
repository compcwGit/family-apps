// 앱 화면 틀 (디자인 시안 "스티커북"): 위 줄(처음으로 · 앱 이름 · 질문 말풍선 · 별) + 왼쪽 놀이 목록 + 놀이판
// 놀이 화면의 <GameTop> 은 위 줄의 말풍선 자리로 들어감 (portal)
// 놀이판은 FitStage: 내용이 화면에 꼭 맞게 확대/축소 → 태블릿·폰 모두 스크롤 없음
import { createContext, useState, type CSSProperties, type ReactNode } from 'react'
import { HomeIcon, GearIcon } from './icons'
import { FitStage } from './FitStage'

export const ShellSlot = createContext<HTMLElement | null>(null)

export type ShellGame = { id: string; label: string }

export function PlayShell({
  app,
  accent,
  games,
  active,
  onPick,
  onParent,
  children,
}: {
  app: string // 앱 이름 (위 줄 왼쪽)
  accent: string // 앱 대표색
  games: readonly ShellGame[] // 왼쪽 놀이 목록 (label 은 짧게: 2~4글자)
  active: string
  onPick: (id: string) => void
  onParent: () => void
  children: ReactNode
}) {
  const [slot, setSlot] = useState<HTMLDivElement | null>(null)
  return (
    <div className="sb-shell" style={{ '--accent': accent } as CSSProperties}>
      <header className="sb-top">
        <button className="sb-round" aria-label="처음으로" onClick={() => onPick(games[0].id)}>
          <HomeIcon />
        </button>
        <div className="sb-app">{app}</div>
        <div className="sb-slot" ref={setSlot} />
      </header>
      <div className="sb-body">
        <nav className="sb-rail" aria-label="놀이 고르기">
          {games.map((g) => (
            <button
              key={g.id}
              className={'sb-rail-btn' + (g.id === active ? ' on' : '') + (g.label.length > 2 ? ' long' : '')}
              aria-current={g.id === active ? 'page' : undefined}
              onClick={() => onPick(g.id)}
            >
              {g.label}
            </button>
          ))}
          <div className="sb-rail-gap" />
          <button className="sb-gear" aria-label="부모 메뉴" onClick={onParent}>
            <GearIcon />
          </button>
        </nav>
        <ShellSlot.Provider value={slot}>
          <FitStage>{children}</FitStage>
        </ShellSlot.Provider>
      </div>
    </div>
  )
}
