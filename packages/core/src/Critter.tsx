// 직접 그린 동물 캐릭터 (이모지 대신 — 기기마다 같은 모양). 디자인 시안 "스티커북"
// <Critter kind="cat" size={150} />, 그림자: shadow
import type { ReactNode } from 'react'

const INK = '#2A2840'
const s = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' as const }
const eyes = (y: number, dx = 15) => (
  <>
    <circle cx={60 - dx} cy={y} r="5.5" fill={INK} />
    <circle cx={60 + dx} cy={y} r="5.5" fill={INK} />
  </>
)

const ART = {
  cat: ['고양이', <>
    <path d="M26 54 L32 12 L58 34 Z" fill="#FFB86B" {...s} /><path d="M94 54 L88 12 L62 34 Z" fill="#FFB86B" {...s} />
    <circle cx="60" cy="68" r="40" fill="#FFB86B" {...s} />
    <path d="M48 32 Q60 40 72 32" fill="none" stroke="#E08A3C" strokeWidth="5" strokeLinecap="round" />
    {eyes(64)}<path d="M55 77 L65 77 L60 83 Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M30 78 L44 80 M30 88 L44 85 M90 78 L76 80 M90 88 L76 85" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </>],
  dog: ['강아지', <>
    <circle cx="60" cy="64" r="40" fill="#F2C48D" {...s} />
    <ellipse cx="24" cy="58" rx="13" ry="27" transform="rotate(18 24 58)" fill="#8D5B3E" {...s} />
    <ellipse cx="96" cy="58" rx="13" ry="27" transform="rotate(-18 96 58)" fill="#8D5B3E" {...s} />
    <ellipse cx="60" cy="82" rx="20" ry="15" fill="#FFF1DE" stroke={INK} strokeWidth="4" />
    {eyes(58)}<ellipse cx="60" cy="76" rx="8" ry="6" fill={INK} />
    <path d="M60 82 L60 89 M52 90 Q60 96 68 90" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </>],
  chick: ['병아리', <>
    <path d="M52 26 Q56 8 62 24 Q66 10 70 26" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="60" cy="68" r="44" fill="#FFD84D" {...s} />
    {eyes(62)}<circle cx="34" cy="78" r="7" fill="#FF9EB0" /><circle cx="86" cy="78" r="7" fill="#FF9EB0" />
    <path d="M50 72 L70 72 L60 86 Z" fill="#FF9A3C" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
  </>],
  pig: ['돼지', <>
    <path d="M24 46 L28 18 L50 32 Z" fill="#FFB3C7" {...s} /><path d="M96 46 L92 18 L70 32 Z" fill="#FFB3C7" {...s} />
    <circle cx="60" cy="66" r="42" fill="#FFB3C7" {...s} />
    <ellipse cx="60" cy="78" rx="18" ry="13" fill="#FF86A8" stroke={INK} strokeWidth="4" />
    <ellipse cx="54" cy="78" rx="3" ry="4.5" fill={INK} /><ellipse cx="66" cy="78" rx="3" ry="4.5" fill={INK} />
    {eyes(56, 16)}
  </>],
  rabbit: ['토끼', <>
    <ellipse cx="44" cy="30" rx="11" ry="27" fill="#FFFFFF" {...s} /><ellipse cx="76" cy="30" rx="11" ry="27" fill="#FFFFFF" {...s} />
    <ellipse cx="44" cy="32" rx="4.5" ry="16" fill="#FFB3C7" /><ellipse cx="76" cy="32" rx="4.5" ry="16" fill="#FFB3C7" />
    <circle cx="60" cy="76" r="36" fill="#FFFFFF" {...s} />
    {eyes(72, 13)}<path d="M55 84 L65 84 L60 89 Z" fill="#FF86A8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="38" cy="86" r="6" fill="#FFD3DE" /><circle cx="82" cy="86" r="6" fill="#FFD3DE" />
  </>],
  bear: ['곰', <>
    <circle cx="28" cy="34" r="15" fill="#C08A5E" {...s} /><circle cx="92" cy="34" r="15" fill="#C08A5E" {...s} />
    <circle cx="60" cy="66" r="42" fill="#C08A5E" {...s} />
    <ellipse cx="60" cy="82" rx="20" ry="15" fill="#EBC9A0" stroke={INK} strokeWidth="4" />
    {eyes(60)}<ellipse cx="60" cy="77" rx="7" ry="5" fill={INK} />
    <path d="M53 88 Q60 93 67 88" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </>],
  cow: ['소', <>
    <path d="M30 34 Q18 20 22 10 M90 34 Q102 20 98 10" fill="none" stroke="#E8D8B0" strokeWidth="9" strokeLinecap="round" />
    <path d="M30 34 Q18 20 22 10 M90 34 Q102 20 98 10" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="16" cy="50" rx="14" ry="8" fill="#FFFFFF" {...s} /><ellipse cx="104" cy="50" rx="14" ry="8" fill="#FFFFFF" {...s} />
    <ellipse cx="60" cy="62" rx="38" ry="42" fill="#FFFFFF" {...s} />
    <path d="M30 40 Q42 30 50 44 Q44 58 30 52 Z" fill={INK} /><path d="M80 34 Q92 40 88 54 Q76 50 76 40 Z" fill={INK} />
    {eyes(58, 14)}
    <ellipse cx="60" cy="88" rx="26" ry="16" fill="#FFB3C7" stroke={INK} strokeWidth="4" />
    <ellipse cx="50" cy="88" rx="4" ry="5" fill={INK} /><ellipse cx="70" cy="88" rx="4" ry="5" fill={INK} />
  </>],
  frog: ['개구리', <>
    <circle cx="36" cy="38" r="17" fill="#7ED36A" {...s} /><circle cx="84" cy="38" r="17" fill="#7ED36A" {...s} />
    <ellipse cx="60" cy="72" rx="48" ry="36" fill="#7ED36A" {...s} />
    <circle cx="36" cy="38" r="9" fill="#FFFFFF" /><circle cx="84" cy="38" r="9" fill="#FFFFFF" />
    <circle cx="37" cy="39" r="5" fill={INK} /><circle cx="83" cy="39" r="5" fill={INK} />
    <path d="M34 78 Q60 98 86 78" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <circle cx="26" cy="74" r="6" fill="#FF9EB0" /><circle cx="94" cy="74" r="6" fill="#FF9EB0" />
  </>],
  lion: ['사자', <>
    <circle cx="60" cy="62" r="54" fill="#E08A3C" {...s} />
    <path d="M14 62 Q8 48 18 40 M106 62 Q112 48 102 40 M30 18 Q40 8 50 14 M90 18 Q80 8 70 14" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <circle cx="60" cy="64" r="36" fill="#FFC94A" {...s} />
    {eyes(58, 13)}
    <path d="M53 72 L67 72 L60 80 Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M60 80 L60 86 M52 88 Q60 93 68 88" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </>],
  duck: ['오리', <>
    <path d="M56 20 Q60 6 66 18" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <circle cx="60" cy="62" r="42" fill="#FFF3C4" {...s} />
    {eyes(54, 16)}
    <ellipse cx="60" cy="80" rx="26" ry="11" fill="#FF9A3C" stroke={INK} strokeWidth="4" />
    <path d="M38 80 Q60 86 82 80" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </>],
  hen: ['닭', <>
    <path d="M42 30 Q40 12 52 16 Q56 4 66 14 Q78 8 76 28 Z" fill="#FF6B57" {...s} />
    <circle cx="60" cy="66" r="40" fill="#FFFFFF" {...s} />
    {eyes(60, 15)}
    <path d="M50 70 L70 70 L60 82 Z" fill="#FFC94A" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M56 82 Q52 96 60 96 Q68 96 64 82 Z" fill="#FF6B57" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
  </>],
  sheep: ['양', <>
    {[[30, 34], [52, 22], [76, 24], [94, 40], [100, 64], [20, 60], [26, 86], [94, 88], [60, 100]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="18" fill="#FFF8EC" {...s} />
    ))}
    <circle cx="60" cy="62" r="40" fill="#FFF8EC" stroke="none" />
    <ellipse cx="22" cy="56" rx="12" ry="7" fill="#5B5873" {...s} /><ellipse cx="98" cy="56" rx="12" ry="7" fill="#5B5873" {...s} />
    <ellipse cx="60" cy="66" rx="24" ry="30" fill="#5B5873" {...s} />
    <circle cx="51" cy="60" r="5" fill="#FFFFFF" /><circle cx="69" cy="60" r="5" fill="#FFFFFF" />
    <path d="M54 80 Q60 85 66 80" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
  </>],
  horse: ['말', <>
    <path d="M38 30 L42 8 L54 24 Z" fill="#A86F4C" {...s} /><path d="M82 30 L78 8 L66 24 Z" fill="#A86F4C" {...s} />
    <ellipse cx="60" cy="62" rx="32" ry="46" fill="#A86F4C" {...s} />
    <path d="M48 20 Q60 10 72 20 Q66 34 60 30 Q54 34 48 20 Z" fill={INK} />
    {eyes(52, 15)}
    <ellipse cx="60" cy="92" rx="24" ry="15" fill="#E8C49E" stroke={INK} strokeWidth="4" />
    <ellipse cx="51" cy="92" rx="3.5" ry="5" fill={INK} /><ellipse cx="69" cy="92" rx="3.5" ry="5" fill={INK} />
  </>],
  elephant: ['코끼리', <>
    <ellipse cx="22" cy="58" rx="20" ry="28" fill="#A9B7C9" {...s} /><ellipse cx="98" cy="58" rx="20" ry="28" fill="#A9B7C9" {...s} />
    <circle cx="60" cy="54" r="36" fill="#A9B7C9" {...s} />
    <path d="M50 70 Q48 96 62 108 Q72 112 74 102 Q62 98 66 72 Z" fill="#A9B7C9" {...s} />
    {eyes(50, 14)}
    <circle cx="36" cy="66" r="6" fill="#FFB3C7" /><circle cx="84" cy="66" r="6" fill="#FFB3C7" />
  </>],
} satisfies Record<string, [string, ReactNode]>

export type CritterKind = keyof typeof ART
export const CRITTERS = Object.keys(ART) as CritterKind[]
export const critterName = (k: CritterKind) => ART[k][0]

export function Critter({ kind, size = 150, shadow = false }: { kind: CritterKind; size?: number; shadow?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label={shadow ? `${ART[kind][0]} 그림자` : ART[kind][0]}
      style={shadow ? { filter: 'brightness(0)', opacity: 0.2 } : undefined}
    >
      {ART[kind][1]}
    </svg>
  )
}
