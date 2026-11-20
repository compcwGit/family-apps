// 직접 그린 동물 캐릭터 (이모지 대신 — 기기마다 같은 모양). 디자인 시안 "스티커북"
// <Critter kind="cat" size={150} />, 그림자: shadow
import type { ReactNode } from 'react'
import { Emo, hasEmoji } from './Emo'

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
  fox: ['여우', <>
    <path d="M22 58 L26 10 L56 34 Z" fill="#F08A3C" {...s} /><path d="M98 58 L94 10 L64 34 Z" fill="#F08A3C" {...s} />
    <path d="M30 46 L31 24 L46 35 Z" fill="#FFF3E0" /><path d="M90 46 L89 24 L74 35 Z" fill="#FFF3E0" />
    <path d="M12 66 Q60 18 108 66 Q100 108 60 110 Q20 108 12 66 Z" fill="#F08A3C" {...s} />
    <path d="M18 72 Q42 70 60 94 Q78 70 102 72 Q94 104 60 106 Q26 104 18 72 Z" fill="#FFF3E0" />
    {eyes(64, 20)}<ellipse cx="60" cy="96" rx="6.5" ry="5" fill={INK} />
  </>],
  squirrel: ['다람쥐', <>
    <path d="M78 96 Q116 90 108 52 Q104 26 82 22 Q96 44 84 62" fill="#B5703C" {...s} />
    <circle cx="36" cy="30" r="11" fill="#B5703C" {...s} /><circle cx="76" cy="30" r="11" fill="#B5703C" {...s} />
    <circle cx="56" cy="68" r="38" fill="#B5703C" {...s} />
    <ellipse cx="56" cy="80" rx="22" ry="17" fill="#FFE8C8" stroke={INK} strokeWidth="4" />
    {eyes(62, 15)}<ellipse cx="56" cy="74" rx="5" ry="4" fill={INK} />
    <path d="M50 84 L50 90 M62 84 L62 90" stroke={INK} strokeWidth="3" strokeLinecap="round" /><rect x="50" y="85" width="12" height="8" rx="2" fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
  </>],
  tiger: ['호랑이', <>
    <circle cx="26" cy="32" r="14" fill="#FFA640" {...s} /><circle cx="94" cy="32" r="14" fill="#FFA640" {...s} />
    <circle cx="60" cy="64" r="44" fill="#FFA640" {...s} />
    <path d="M52 22 L56 38 M60 20 L60 38 M68 22 L64 38 M16 56 L32 60 M16 70 L30 70 M104 56 L88 60 M104 70 L90 70" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <ellipse cx="60" cy="82" rx="22" ry="16" fill="#FFF3E0" stroke={INK} strokeWidth="4" />
    {eyes(58, 17)}<path d="M53 74 L67 74 L60 81 Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M60 81 L60 87 M52 88 Q60 93 68 88" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </>],
  monkey: ['원숭이', <>
    <circle cx="16" cy="62" r="15" fill="#9A6A45" {...s} /><circle cx="104" cy="62" r="15" fill="#9A6A45" {...s} />
    <circle cx="16" cy="62" r="7" fill="#FFD3B0" /><circle cx="104" cy="62" r="7" fill="#FFD3B0" />
    <circle cx="60" cy="60" r="42" fill="#9A6A45" {...s} />
    <path d="M30 56 Q38 40 60 50 Q82 40 90 56 Q94 86 60 98 Q26 86 30 56 Z" fill="#FFD9B8" stroke={INK} strokeWidth="4" />
    {eyes(62, 13)}<circle cx="55" cy="78" r="2.5" fill={INK} /><circle cx="65" cy="78" r="2.5" fill={INK} />
    <path d="M48 86 Q60 96 72 86" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </>],
  giraffe: ['기린', <>
    <path d="M46 28 L44 8 M74 28 L76 8" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <circle cx="44" cy="8" r="6" fill="#B5703C" {...s} /><circle cx="76" cy="8" r="6" fill="#B5703C" {...s} />
    <ellipse cx="26" cy="46" rx="13" ry="7" transform="rotate(-20 26 46)" fill="#FFD166" {...s} /><ellipse cx="94" cy="46" rx="13" ry="7" transform="rotate(20 94 46)" fill="#FFD166" {...s} />
    <ellipse cx="60" cy="58" rx="32" ry="38" fill="#FFD166" {...s} />
    <circle cx="44" cy="36" r="6" fill="#B5703C" /><circle cx="78" cy="42" r="5" fill="#B5703C" /><circle cx="68" cy="28" r="4" fill="#B5703C" />
    <ellipse cx="60" cy="86" rx="24" ry="22" fill="#FFF0C4" stroke={INK} strokeWidth="4" />
    {eyes(54, 15)}<ellipse cx="52" cy="86" rx="3.5" ry="5" fill={INK} /><ellipse cx="68" cy="86" rx="3.5" ry="5" fill={INK} />
    <path d="M52 100 Q60 105 68 100" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </>],
  penguin: ['펭귄', <>
    <ellipse cx="60" cy="64" rx="42" ry="48" fill="#3E4A6B" {...s} />
    <ellipse cx="60" cy="74" rx="28" ry="34" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
    <ellipse cx="14" cy="70" rx="9" ry="22" transform="rotate(14 14 70)" fill="#3E4A6B" {...s} /><ellipse cx="106" cy="70" rx="9" ry="22" transform="rotate(-14 106 70)" fill="#3E4A6B" {...s} />
    {eyes(46, 14)}<path d="M50 56 L70 56 L60 68 Z" fill="#FF9A3C" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <ellipse cx="44" cy="112" rx="14" ry="6" fill="#FF9A3C" stroke={INK} strokeWidth="4" /><ellipse cx="76" cy="112" rx="14" ry="6" fill="#FF9A3C" stroke={INK} strokeWidth="4" />
  </>],
  fish: ['물고기', <>
    <path d="M86 60 L114 36 L114 84 Z" fill="#FF8A65" {...s} />
    <path d="M44 34 Q60 14 74 36 Z" fill="#FF8A65" {...s} />
    <ellipse cx="56" cy="62" rx="44" ry="32" fill="#FFA384" {...s} />
    <path d="M70 36 Q78 62 70 88" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="34" cy="56" r="8" fill="#FFFFFF" stroke={INK} strokeWidth="3.5" /><circle cx="33" cy="57" r="4" fill={INK} />
    <path d="M18 72 Q26 78 32 72" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </>],
  whale: ['고래', <>
    <path d="M44 22 Q38 8 28 12 M44 22 Q50 8 60 12 M44 22 L44 30" fill="none" stroke="#7DD3F5" strokeWidth="6" strokeLinecap="round" />
    <path d="M92 76 Q112 74 112 50 Q100 56 98 62 Q104 40 118 38 Q96 36 90 62 Z" fill="#4A8FD8" {...s} />
    <path d="M8 74 Q8 32 52 32 Q96 32 98 72 Q98 104 52 104 Q8 104 8 74 Z" fill="#4A8FD8" {...s} />
    <path d="M14 82 Q52 112 94 80 Q80 100 52 100 Q26 100 14 82 Z" fill="#DDF1FF" />
    <circle cx="34" cy="64" r="5.5" fill={INK} /><path d="M20 82 Q30 90 40 84" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </>],
  turtle: ['거북', <>
    <path d="M52 40 Q48 10 60 8 Q72 10 68 40 Z" fill="#9BD66B" {...s} />
    <circle cx="54" cy="22" r="3.5" fill={INK} /><circle cx="66" cy="22" r="3.5" fill={INK} />
    <ellipse cx="18" cy="82" rx="12" ry="8" fill="#9BD66B" {...s} /><ellipse cx="102" cy="82" rx="12" ry="8" fill="#9BD66B" {...s} />
    <ellipse cx="32" cy="108" rx="12" ry="7" fill="#9BD66B" {...s} /><ellipse cx="88" cy="108" rx="12" ry="7" fill="#9BD66B" {...s} />
    <path d="M12 88 Q14 38 60 36 Q106 38 108 88 Q60 108 12 88 Z" fill="#6BAF4A" {...s} />
    <path d="M60 38 L60 98 M30 54 L90 54 M22 76 L98 76" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </>],
  octopus: ['문어', <>
    <path d="M18 76 Q8 100 22 108 Q30 112 30 100 M42 82 Q36 108 46 112 Q54 114 52 102 M78 82 Q84 108 74 112 Q66 114 68 102 M102 76 Q112 100 98 108 Q90 112 90 100" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
    <path d="M18 76 Q8 100 22 108 Q30 112 30 100 M42 82 Q36 108 46 112 Q54 114 52 102 M78 82 Q84 108 74 112 Q66 114 68 102 M102 76 Q112 100 98 108 Q90 112 90 100" fill="none" stroke="#C77DDB" strokeWidth="6" strokeLinecap="round" />
    <path d="M14 70 Q14 12 60 12 Q106 12 106 70 Q106 90 60 90 Q14 90 14 70 Z" fill="#C77DDB" {...s} />
    {eyes(58, 17)}<circle cx="32" cy="72" r="6" fill="#E8B2F5" /><circle cx="88" cy="72" r="6" fill="#E8B2F5" />
    <path d="M52 74 Q60 82 68 74" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
  </>],
} satisfies Record<string, [string, ReactNode]>

export type CritterKind = keyof typeof ART
export const CRITTERS = Object.keys(ART) as CritterKind[]
export const critterName = (k: CritterKind) => ART[k][0]

// 3D 그림 이모지가 앱에 있으면(점토 테마) 그 그림으로, 없으면 직접 그린 그림으로
export const CRITTER_EMOJI: Record<CritterKind, string> = {
  cat: '🐱', dog: '🐶', chick: '🐥', pig: '🐷', rabbit: '🐰', bear: '🐻', cow: '🐮',
  frog: '🐸', lion: '🦁', duck: '🦆', hen: '🐔', sheep: '🐑', horse: '🐴', elephant: '🐘',
}

export function Critter({ kind, size = 150, shadow = false }: { kind: CritterKind; size?: number; shadow?: boolean }) {
  const e = CRITTER_EMOJI[kind]
  if (hasEmoji(e))
    return (
      <span
        className="critter-emo"
        role="img"
        aria-label={shadow ? `${ART[kind][0]} 그림자` : ART[kind][0]}
        style={{ fontSize: size * 0.92, width: size, height: size, ...(shadow ? { filter: 'brightness(0)', opacity: 0.2 } : {}) }}
      >
        <Emo e={e} />
      </span>
    )
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
