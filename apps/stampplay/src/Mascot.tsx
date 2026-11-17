import type { ReactNode } from 'react'

// 캐릭터: 곰(꾹이)·토끼·호랑이·기린·공룡·상어. 모두 같은 몸 틀에 귀·무늬·색만 다름
// pose: basic 기본(양팔 내리기) / happy 기뻐하기 / peek 눈 가리기
export type Pose = 'basic' | 'happy' | 'peek'
export type Kind = 'bear' | 'rabbit' | 'tiger' | 'giraffe' | 'dino' | 'shark'
export const KINDS: Kind[] = ['bear', 'rabbit', 'tiger', 'giraffe', 'dino', 'shark']
export const KIND_NAME: Record<Kind, string> = { bear: '곰', rabbit: '토끼', tiger: '호랑이', giraffe: '기린', dino: '공룡', shark: '상어' }

type Pal = { main: string; dark: string; light: string; inner: string; cheek: string }
const PAL: Record<Kind, Pal> = {
  bear: { main: '#F0B26E', dark: '#E8A25C', light: '#FFE8CC', inner: '#F6CFA0', cheek: '#F3907A' },
  rabbit: { main: '#EDE3D9', dark: '#DCCDC0', light: '#FFFFFF', inner: '#F6B6C0', cheek: '#F7A1A8' },
  tiger: { main: '#F2A04A', dark: '#E58A2E', light: '#FFF3E2', inner: '#FFE0BF', cheek: '#F3907A' },
  giraffe: { main: '#F6CB62', dark: '#E9B444', light: '#FFF3D1', inner: '#F9DFA0', cheek: '#F3907A' },
  dino: { main: '#86C98A', dark: '#6AB36F', light: '#DDF2D2', inner: '#B8E3B5', cheek: '#F3907A' },
  shark: { main: '#8DB3D3', dark: '#6F98BD', light: '#F5F8FB', inner: '#C9DCEC', cheek: '#F3A3B0' },
}
const INK = '#3A2A1F'
const POSE_NAME: Record<Pose, string> = { basic: '웃고 있는', happy: '두 팔을 들고 기뻐하는', peek: '두 손으로 눈을 가린' }

// 머리 뒤 (귀·뿔·지느러미·가시)
function behindHead(k: Kind, p: Pal): ReactNode {
  switch (k) {
    case 'bear':
      return (
        <>
          <circle cx="54" cy="46" r="22" fill={p.dark} />
          <circle cx="54" cy="46" r="11" fill={p.inner} />
          <circle cx="146" cy="46" r="22" fill={p.dark} />
          <circle cx="146" cy="46" r="11" fill={p.inner} />
        </>
      )
    case 'rabbit':
      return (
        <>
          <ellipse cx="72" cy="40" rx="16" ry="38" fill={p.main} transform="rotate(-10 72 40)" />
          <ellipse cx="72" cy="42" rx="7" ry="28" fill={p.inner} transform="rotate(-10 72 42)" />
          <ellipse cx="128" cy="40" rx="16" ry="38" fill={p.main} transform="rotate(10 128 40)" />
          <ellipse cx="128" cy="42" rx="7" ry="28" fill={p.inner} transform="rotate(10 128 42)" />
        </>
      )
    case 'tiger':
      return (
        <>
          <circle cx="52" cy="48" r="20" fill={p.dark} />
          <circle cx="52" cy="48" r="10" fill={p.light} />
          <circle cx="148" cy="48" r="20" fill={p.dark} />
          <circle cx="148" cy="48" r="10" fill={p.light} />
        </>
      )
    case 'giraffe':
      return (
        <>
          <rect x="72" y="12" width="11" height="34" rx="5.5" fill={p.dark} />
          <circle cx="77.5" cy="13" r="9" fill="#9A6A3C" />
          <rect x="117" y="12" width="11" height="34" rx="5.5" fill={p.dark} />
          <circle cx="122.5" cy="13" r="9" fill="#9A6A3C" />
          <ellipse cx="34" cy="66" rx="20" ry="10" fill={p.dark} transform="rotate(-25 34 66)" />
          <ellipse cx="166" cy="66" rx="20" ry="10" fill={p.dark} transform="rotate(25 166 66)" />
        </>
      )
    case 'dino':
      return (
        <>
          <path d="M60 52 L70 18 L86 40 Z" fill="#4E9A52" />
          <path d="M86 38 L100 4 L114 38 Z" fill="#4E9A52" />
          <path d="M114 40 L130 18 L140 52 Z" fill="#4E9A52" />
        </>
      )
    case 'shark':
      return <path d="M82 44 Q100 -6 132 46 Z" fill={p.dark} />
  }
}

// 머리 위 무늬
function onHead(k: Kind): ReactNode {
  switch (k) {
    case 'tiger':
      return (
        <g stroke={INK} strokeWidth="6" strokeLinecap="round">
          <path d="M100 38 L100 54" />
          <path d="M84 41 L89 55" />
          <path d="M116 41 L111 55" />
          <path d="M30 92 L46 97" />
          <path d="M31 106 L46 107" />
          <path d="M170 92 L154 97" />
          <path d="M169 106 L154 107" />
        </g>
      )
    case 'giraffe':
      return (
        <g fill="#D98F35">
          <ellipse cx="58" cy="70" rx="11" ry="8" />
          <ellipse cx="144" cy="66" rx="9" ry="7" />
          <ellipse cx="152" cy="132" rx="7" ry="9" />
          <ellipse cx="46" cy="134" rx="6" ry="8" />
        </g>
      )
    case 'shark':
      return (
        <g fill="none" stroke="#5E89AD" strokeWidth="3" strokeLinecap="round">
          <path d="M40 96 Q44 106 40 116" />
          <path d="M48 98 Q52 106 48 114" />
          <path d="M160 96 Q156 106 160 116" />
          <path d="M152 98 Q148 106 152 114" />
        </g>
      )
    default:
      return null
  }
}

// 코
function nose(k: Kind): ReactNode {
  switch (k) {
    case 'rabbit':
      return <path d="M93 110 Q100 104 107 110 Q100 118 93 110 Z" fill="#E88A9A" />
    case 'giraffe':
    case 'dino':
      return (
        <>
          <ellipse cx="91" cy="112" rx="3.5" ry="4.5" fill={INK} />
          <ellipse cx="109" cy="112" rx="3.5" ry="4.5" fill={INK} />
        </>
      )
    case 'shark':
      return null
    default:
      return <ellipse cx="100" cy="112" rx="9" ry="6.5" fill={INK} />
  }
}

export function Mascot({ kind = 'bear', pose = 'basic', size = 110 }: { kind?: Kind; pose?: Pose; size?: number }) {
  const p = PAL[kind]
  const muzzle = kind === 'shark' ? { cy: 130, rx: 46, ry: 26 } : kind === 'giraffe' ? { cy: 122, rx: 34, ry: 24 } : { cy: 122, rx: 30, ry: 22 }
  const cheekY = pose === 'happy' ? 116 : 118

  return (
    <svg className="sp-mascot" width={size} height={Math.round(size * 1.15)} viewBox="0 0 200 230" role="img" aria-label={`${POSE_NAME[pose]} ${KIND_NAME[kind]}`}>
      {pose === 'happy' && (
        <>
          <ellipse cx="38" cy="150" rx="13" ry="24" fill={p.dark} transform="rotate(-35 38 150)" />
          <ellipse cx="162" cy="150" rx="13" ry="24" fill={p.dark} transform="rotate(35 162 150)" />
        </>
      )}
      <ellipse cx="100" cy="192" rx="52" ry="38" fill={p.main} />
      <ellipse cx="100" cy="198" rx="30" ry="24" fill={p.light} />
      {kind === 'giraffe' && (
        <g fill="#D98F35">
          <ellipse cx="62" cy="186" rx="8" ry="6" />
          <ellipse cx="140" cy="202" rx="7" ry="6" />
        </g>
      )}
      {pose === 'basic' && <ellipse cx="54" cy="186" rx="14" ry="20" fill={p.dark} transform="rotate(25 54 186)" />}
      {behindHead(kind, p)}
      <ellipse cx="100" cy="98" rx="72" ry="64" fill={p.main} />
      {onHead(kind)}
      <ellipse cx="100" cy={muzzle.cy} rx={muzzle.rx} ry={muzzle.ry} fill={p.light} />
      <circle cx="58" cy={cheekY} r={pose === 'happy' ? 11 : 10} fill={p.cheek} />
      <circle cx="142" cy={cheekY} r={pose === 'happy' ? 11 : 10} fill={p.cheek} />

      {pose === 'basic' && (
        <>
          <circle cx="74" cy="94" r="7.5" fill={INK} />
          <circle cx="76.5" cy="91.5" r="2.4" fill="#FFFFFF" />
          <circle cx="126" cy="94" r="7.5" fill={INK} />
          <circle cx="128.5" cy="91.5" r="2.4" fill="#FFFFFF" />
          {nose(kind)}
          <path d="M90 126 Q100 135 110 126" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          {kind === 'rabbit' && <rect x="95" y="128" width="10" height="9" rx="2" fill="#FFFFFF" stroke="#DCCDC0" strokeWidth="1.5" />}
          <ellipse cx="146" cy="186" rx="14" ry="20" fill={p.dark} transform="rotate(-25 146 186)" />
        </>
      )}
      {pose === 'happy' && (
        <>
          <path d="M64 98 Q74 84 84 98" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M116 98 Q126 84 136 98" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
          {nose(kind)}
          <path d="M87 122 Q100 146 113 122 Z" fill="#B3321C" />
        </>
      )}
      {pose === 'peek' && (
        <>
          {nose(kind)}
          <ellipse cx="100" cy="129" rx="6" ry="5" fill="#B3321C" />
          <path d="M62 160 Q60 125 72 104" fill="none" stroke={p.dark} strokeWidth="22" strokeLinecap="round" />
          <path d="M138 160 Q140 125 128 104" fill="none" stroke={p.dark} strokeWidth="22" strokeLinecap="round" />
          <ellipse cx="76" cy="94" rx="20" ry="16" fill={p.dark} />
          <ellipse cx="124" cy="94" rx="20" ry="16" fill={p.dark} />
          <circle cx="70" cy="90" r="3.5" fill={p.inner} />
          <circle cx="80" cy="88" r="3.5" fill={p.inner} />
          <circle cx="120" cy="88" r="3.5" fill={p.inner} />
          <circle cx="130" cy="90" r="3.5" fill={p.inner} />
        </>
      )}
    </svg>
  )
}
