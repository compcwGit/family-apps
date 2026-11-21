// 세부 메뉴 줄: 한 놀이(친구·퀴즈·그림자·피아노) 안의 여러 놀이를 고름. 놀이판 맨 위에 붙음
import { LockIcon, stopSpeaking } from '@family/core'

export function SubTabs<T extends string>({ tabs, active, onPick, locked }: { tabs: readonly { id: T; label: string }[]; active: T; onPick: (id: T) => void; locked?: (id: T) => boolean }) {
  return (
    <nav className="subtabs" aria-label="세부 메뉴">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={'subtab' + (t.id === active ? ' on' : '')}
          aria-current={t.id === active ? 'page' : undefined}
          onClick={() => {
            stopSpeaking()
            onPick(t.id)
          }}
        >
          {t.label}
          {locked?.(t.id) && (
            <span className="subtab-lock" aria-label="잠김">
              <LockIcon size={18} />
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}
