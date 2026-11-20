// 먹이·사는 곳 그림 (이모지 대신 직접 그림 — 기기마다 같은 모양, core/Critter 와 같은 선 모양)
import type { ReactNode } from 'react'
import type { FoodKind, Home } from './animals'

const INK = '#2A2840'
const s = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

const FOOD_ART: Record<FoodKind, ReactNode> = {
  carrot: (
    <>
      <path d="M60 40 L48 12 M60 40 L60 6 M60 40 L72 12" fill="none" stroke="#5DB85C" strokeWidth="7" strokeLinecap="round" />
      <path d="M60 112 L34 46 Q60 30 86 46 Z" fill="#FF9A3C" {...s} />
      <path d="M46 62 L56 62 M62 78 L72 78 M52 92 L60 92" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  honey: (
    <>
      <rect x="22" y="38" width="76" height="70" rx="22" fill="#FFC94A" {...s} />
      <rect x="28" y="22" width="64" height="20" rx="8" fill="#B5703C" {...s} />
      <rect x="40" y="58" width="40" height="30" rx="8" fill="#FFF3C4" stroke={INK} strokeWidth="3.5" />
      <path d="M52 66 L68 66 M52 76 L64 76" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  acorn: (
    <>
      <path d="M60 14 L60 28" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M28 54 Q32 94 60 108 Q88 94 92 54 Z" fill="#D9A066" {...s} />
      <path d="M22 54 Q22 26 60 26 Q98 26 98 54 Z" fill="#8D5B3E" {...s} />
    </>
  ),
  banana: (
    <>
      <path d="M22 40 Q30 100 92 96 Q108 94 112 84 Q70 96 44 28 Z" fill="#FFE04D" {...s} />
      <path d="M22 40 L18 24 L36 22 L44 28" fill="#B5703C" {...s} />
    </>
  ),
  grass: (
    <>
      <path d="M24 108 Q22 60 14 30 Q42 50 46 108 Z" fill="#7ED36A" {...s} />
      <path d="M44 108 Q48 40 60 10 Q74 40 76 108 Z" fill="#5DB85C" {...s} />
      <path d="M76 108 Q82 52 106 30 Q102 70 98 108 Z" fill="#7ED36A" {...s} />
    </>
  ),
  fish: (
    <>
      <path d="M86 60 L112 38 L112 82 Z" fill="#6EC6FF" {...s} />
      <ellipse cx="54" cy="60" rx="40" ry="28" fill="#8FD3FF" {...s} />
      <circle cx="32" cy="54" r="6" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      <circle cx="31" cy="55" r="3" fill={INK} />
      <path d="M66 36 Q74 60 66 84" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </>
  ),
  bone: (
    <>
      <path d="M32 40 Q14 34 18 22 Q28 12 42 26 L78 62 Q94 62 102 80 Q106 98 88 98 Q78 94 78 82 L42 46 Z" fill="#FFF6E2" {...s} />
      <path d="M38 40 Q22 46 18 60 Q18 72 32 74 Q44 70 44 58" fill="#FFF6E2" {...s} />
      <path d="M72 78 Q76 100 94 104 Q108 102 106 88" fill="none" />
    </>
  ),
  grain: (
    <>
      <path d="M60 112 L60 36" stroke="#B5703C" strokeWidth="6" strokeLinecap="round" />
      {[22, 40, 58].map((y) => (
        <g key={y}>
          <ellipse cx="46" cy={y + 6} rx="10" ry="16" transform={`rotate(-30 46 ${y + 6})`} fill="#FFD84D" {...s} />
          <ellipse cx="74" cy={y + 6} rx="10" ry="16" transform={`rotate(30 74 ${y + 6})`} fill="#FFD84D" {...s} />
        </g>
      ))}
      <ellipse cx="60" cy="14" rx="9" ry="14" fill="#FFD84D" {...s} />
    </>
  ),
  leaf: (
    <>
      <path d="M18 104 Q10 36 70 14 Q110 10 106 54 Q96 100 18 104 Z" fill="#7ED36A" {...s} />
      <path d="M18 104 Q52 70 88 34" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
}

export function FoodIcon({ kind, size = 120 }: { kind: FoodKind; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={kind}>
      {FOOD_ART[kind]}
    </svg>
  )
}

const PLACE_ART: Record<Home, ReactNode> = {
  farm: (
    <>
      <path d="M12 56 L60 14 L108 56 L108 108 L12 108 Z" fill="#EF5350" {...s} />
      <path d="M12 56 L60 14 L108 56" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <rect x="40" y="64" width="40" height="44" rx="4" fill="#FFF6E2" {...s} />
      <path d="M40 64 L80 108 M80 64 L40 108" stroke={INK} strokeWidth="4" />
      <circle cx="60" cy="40" r="8" fill="#FFF6E2" stroke={INK} strokeWidth="4" />
    </>
  ),
  forest: (
    <>
      <rect x="26" y="78" width="12" height="30" fill="#8D5B3E" {...s} />
      <rect x="78" y="82" width="12" height="26" fill="#8D5B3E" {...s} />
      <path d="M32 18 L6 84 L58 84 Z" fill="#5DB85C" {...s} />
      <path d="M84 30 L56 90 L112 90 Z" fill="#7ED36A" {...s} />
    </>
  ),
  water: (
    <>
      <rect x="8" y="22" width="104" height="86" rx="20" fill="#8FD3FF" {...s} />
      <path d="M20 54 Q34 40 48 54 Q62 68 76 54 Q90 40 100 54" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <path d="M20 82 Q34 68 48 82 Q62 96 76 82 Q90 68 100 82" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  plain: (
    <>
      <circle cx="84" cy="34" r="20" fill="#FFD84D" {...s} />
      <path d="M6 108 Q40 56 74 80 Q96 62 114 90 L114 108 Z" fill="#9BD66B" {...s} />
      <path d="M24 108 L24 96 M40 108 L40 92 M56 108 L56 98 M90 108 L90 98" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
}

export function PlaceIcon({ kind, size = 120 }: { kind: Home; size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={kind}>
      {PLACE_ART[kind]}
    </svg>
  )
}
