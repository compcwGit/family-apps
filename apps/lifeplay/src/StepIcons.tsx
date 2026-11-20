// 순서대로 카드 그림 (디자인 시안 "손 씻기"). 그림이 없는 단계는 이모지로 보임
import type { ReactNode } from 'react'
import { Emo, hasEmoji } from '@family/core'

const INK = '#2A2840'
const ICONS: Record<string, ReactNode> = {
  '💧': (
    <>
      <path d="M50 14 C50 14 24 46 24 62 a26 26 0 0 0 52 0 C76 46 50 14 50 14 Z" fill="#6EC1F5" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M38 64 a12 12 0 0 0 10 12" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  '🧼': (
    <>
      <rect x="18" y="46" width="64" height="38" rx="12" fill="#FF9EC4" stroke={INK} strokeWidth="5" />
      <circle cx="34" cy="30" r="10" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
      <circle cx="58" cy="22" r="7" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
      <circle cx="74" cy="36" r="5" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
    </>
  ),
  '🚿': (
    <>
      <path d="M20 26 H62 a10 10 0 0 1 10 10 V44" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="16" width="16" height="20" rx="4" fill="#B79CF7" stroke={INK} strokeWidth="4" />
      <path d="M72 56 v8 M60 66 v8 M84 66 v8 M72 80 v8" stroke="#6EC1F5" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  '🧻': (
    <>
      <rect x="20" y="18" width="60" height="66" rx="10" fill="#63D2A1" stroke={INK} strokeWidth="5" />
      <path d="M20 66 H80 M20 74 H80" stroke={INK} strokeWidth="4" />
      <path d="M34 18 V10 H66 V18" fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    </>
  ),
}

// 3D 그림 이모지가 있으면 그걸 씀 (점토 테마). 없으면 손으로 그린 그림 → 이모지 글자
export function StepIcon({ e }: { e: string }) {
  if (hasEmoji(e))
    return (
      <span className="steps-emoji" aria-hidden="true">
        <Emo e={e} />
      </span>
    )
  return ICONS[e] ? (
    <svg width="96" height="96" viewBox="0 0 100 100" aria-hidden="true">
      {ICONS[e]}
    </svg>
  ) : (
    <span className="steps-emoji" aria-hidden="true">
      {e}
    </span>
  )
}
