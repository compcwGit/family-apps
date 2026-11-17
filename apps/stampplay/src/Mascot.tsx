import type { ReactNode } from 'react'

// 캐릭터: 곰(꾹이)·토끼·호랑이·기린·공룡·상어
// 모두 같은 몸 틀(큰 머리 + 작고 통통한 몸, 반짝이는 큰 눈)에 귀·무늬·색만 다름
// pose: basic 기본 / happy 기뻐하기 / peek 눈 가리기
export type Pose = 'basic' | 'happy' | 'peek'
export type Kind = 'bear' | 'rabbit' | 'tiger' | 'giraffe' | 'dino' | 'shark'
export const KINDS: Kind[] = ['bear', 'rabbit', 'tiger', 'giraffe', 'dino', 'shark']
export const KIND_NAME: Record<Kind, string> = { bear: '곰', rabbit: '토끼', tiger: '호랑이', giraffe: '기린', dino: '공룡', shark: '상어' }

// main 몸, dark 팔·귀, light 배·입, inner 귀 안·발바닥, cheek 볼, line 부드러운 테두리
type Pal = { main: string; dark: string; light: string; inner: string; cheek: string; line: string }
const PAL: Record<Kind, Pal> = {
  bear: { main: '#F2B877', dark: '#E9A462', light: '#FFEBD2', inner: '#F8CFA4', cheek: '#F79A86', line: '#D58E4C' },
  rabbit: { main: '#FBF5EF', dark: '#F0E4D8', light: '#FFFFFF', inner: '#FBC2CC', cheek: '#FBA3B0', line: '#D9C3B0' },
  tiger: { main: '#F6A653', dark: '#EC9238', light: '#FFF4E4', inner: '#FFE2C2', cheek: '#F79A86', line: '#D47F2A' },
  giraffe: { main: '#F8D06E', dark: '#EEBB4E', light: '#FFF5D6', inner: '#FBE2A8', cheek: '#F79A86', line: '#D3A23A' },
  dino: { main: '#90D293', dark: '#76BE7A', light: '#E2F5D8', inner: '#C2E8BF', cheek: '#F79A86', line: '#5EA463' },
  shark: { main: '#9BC0DE', dark: '#7FA7CB', light: '#F7FAFD', inner: '#D2E3F1', cheek: '#F6A9B8', line: '#6A93B8' },
}
const INK = '#3A2A1F'
const POSE_NAME: Record<Pose, string> = { basic: '웃고 있는', happy: '두 팔을 들고 기뻐하는', peek: '두 손으로 눈을 가린' }

// 머리 위치·크기 (모든 캐릭터 공통)
const HX = 100
const HY = 112
const HRX = 78
const HRY = 66
// 눈 위치
const EL = 72
const ER = 128
const EY = 116

// 머리 뒤 (귀·뿔·지느러미·가시)
function behindHead(k: Kind, p: Pal): ReactNode {
  const s = { stroke: p.line, strokeWidth: 3 }
  switch (k) {
    case 'bear':
      return (
        <>
          <circle cx="46" cy="60" r="22" fill={p.main} {...s} />
          <circle cx="46" cy="60" r="11" fill={p.inner} />
          <circle cx="154" cy="60" r="22" fill={p.main} {...s} />
          <circle cx="154" cy="60" r="11" fill={p.inner} />
        </>
      )
    case 'rabbit':
      return (
        <>
          <ellipse cx="74" cy="40" rx="17" ry="38" fill={p.main} transform="rotate(-12 74 40)" {...s} />
          <ellipse cx="74" cy="44" rx="8" ry="27" fill={p.inner} transform="rotate(-12 74 44)" />
          <ellipse cx="126" cy="40" rx="17" ry="38" fill={p.main} transform="rotate(12 126 40)" {...s} />
          <ellipse cx="126" cy="44" rx="8" ry="27" fill={p.inner} transform="rotate(12 126 44)" />
        </>
      )
    case 'tiger':
      return (
        <>
          <circle cx="48" cy="62" r="20" fill={p.main} {...s} />
          <circle cx="48" cy="62" r="10" fill={p.light} />
          <circle cx="152" cy="62" r="20" fill={p.main} {...s} />
          <circle cx="152" cy="62" r="10" fill={p.light} />
        </>
      )
    case 'giraffe':
      return (
        <>
          <rect x="74" y="22" width="10" height="34" rx="5" fill={p.dark} {...s} />
          <circle cx="79" cy="22" r="9" fill="#B07A45" />
          <rect x="116" y="22" width="10" height="34" rx="5" fill={p.dark} {...s} />
          <circle cx="121" cy="22" r="9" fill="#B07A45" />
          <ellipse cx="30" cy="86" rx="20" ry="10" fill={p.main} transform="rotate(-25 30 86)" {...s} />
          <ellipse cx="30" cy="86" rx="11" ry="5" fill={p.inner} transform="rotate(-25 30 86)" />
          <ellipse cx="170" cy="86" rx="20" ry="10" fill={p.main} transform="rotate(25 170 86)" {...s} />
          <ellipse cx="170" cy="86" rx="11" ry="5" fill={p.inner} transform="rotate(25 170 86)" />
        </>
      )
    case 'dino':
      return (
        <g fill="#F4B860" stroke="#E09A3A" strokeWidth="3" strokeLinejoin="round">
          <path d="M60 70 L66 28 L90 54 Z" />
          <path d="M84 52 L100 10 L116 52 Z" />
          <path d="M110 54 L134 28 L140 70 Z" />
        </g>
      )
    case 'shark':
      return <path d="M78 62 Q100 -10 134 64 Z" fill={p.dark} stroke={p.line} strokeWidth="3" strokeLinejoin="round" />
  }
}

// 머리 위 무늬
function onHead(k: Kind): ReactNode {
  switch (k) {
    case 'tiger':
      return (
        <g stroke="#7A4A22" strokeWidth="5" strokeLinecap="round">
          <path d="M100 50 L100 62" />
          <path d="M86 53 L89 63" />
          <path d="M114 53 L111 63" />
          <path d="M28 108 L40 111" />
          <path d="M29 120 L40 120" />
          <path d="M172 108 L160 111" />
          <path d="M171 120 L160 120" />
        </g>
      )
    case 'giraffe':
      return (
        <g fill="#E9A84A">
          <ellipse cx="58" cy="78" rx="10" ry="7" />
          <ellipse cx="144" cy="74" rx="8" ry="6" />
          <ellipse cx="160" cy="146" rx="6" ry="8" />
          <ellipse cx="40" cy="146" rx="5" ry="7" />
        </g>
      )
    case 'shark':
      return (
        <g fill="none" stroke={PAL.shark.line} strokeWidth="2.5" strokeLinecap="round">
          <path d="M34 112 Q38 120 34 128" />
          <path d="M42 113 Q45 120 42 127" />
          <path d="M166 112 Q162 120 166 128" />
          <path d="M158 113 Q155 120 158 127" />
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
      return <path d="M95 134 Q100 130 105 134 Q100 140 95 134 Z" fill="#EE8FA0" />
    case 'giraffe':
    case 'dino':
      return (
        <>
          <ellipse cx="94" cy="136" rx="2.6" ry="3.2" fill={INK} />
          <ellipse cx="106" cy="136" rx="2.6" ry="3.2" fill={INK} />
        </>
      )
    case 'shark':
      return null
    default:
      return (
        <>
          <ellipse cx="100" cy="135" rx="7" ry="5" fill={INK} />
          <ellipse cx="98" cy="133.5" rx="2.2" ry="1.4" fill="#FFFFFF" opacity=".7" />
        </>
      )
  }
}

// 반짝이는 큰 눈
const Eye = ({ x }: { x: number }) => (
  <>
    <ellipse cx={x} cy={EY} rx="10" ry="12" fill={INK} />
    <circle cx={x + 3.5} cy={EY - 4.5} r="4" fill="#FFFFFF" />
    <circle cx={x - 3.5} cy={EY + 4} r="2" fill="#FFFFFF" />
  </>
)

export function Mascot({ kind = 'bear', pose = 'basic', size = 110 }: { kind?: Kind; pose?: Pose; size?: number }) {
  const p = PAL[kind]
  const line = { stroke: p.line, strokeWidth: 3 }
  const muzzle = kind === 'shark' ? { cy: 148, rx: 44, ry: 24 } : kind === 'giraffe' ? { cy: 142, rx: 24, ry: 17 } : { cy: 142, rx: 21, ry: 15 }

  return (
    <svg className="sp-mascot" width={size} height={Math.round(size * 1.15)} viewBox="0 0 200 230" role="img" aria-label={`${POSE_NAME[pose]} ${KIND_NAME[kind]}`}>
      {/* 기뻐하기: 머리 뒤로 올린 팔 */}
      {pose === 'happy' && (
        <>
          <ellipse cx="50" cy="176" rx="11" ry="19" fill={p.dark} transform="rotate(-40 50 176)" {...line} />
          <ellipse cx="150" cy="176" rx="11" ry="19" fill={p.dark} transform="rotate(40 150 176)" {...line} />
        </>
      )}
      {/* 몸 + 발 */}
      <ellipse cx="80" cy="219" rx="15" ry="8" fill={p.dark} {...line} />
      <ellipse cx="120" cy="219" rx="15" ry="8" fill={p.dark} {...line} />
      <ellipse cx="100" cy="196" rx="44" ry="28" fill={p.main} {...line} />
      <ellipse cx="100" cy="200" rx="26" ry="18" fill={p.light} />
      {kind === 'giraffe' && (
        <g fill="#E9A84A">
          <ellipse cx="70" cy="194" rx="6" ry="5" />
          <ellipse cx="132" cy="204" rx="6" ry="5" />
        </g>
      )}
      {/* 기본: 몸 옆에 내린 짧은 팔 */}
      {pose === 'basic' && (
        <>
          <ellipse cx="60" cy="196" rx="10" ry="15" fill={p.dark} transform="rotate(28 60 196)" {...line} />
          <ellipse cx="140" cy="196" rx="10" ry="15" fill={p.dark} transform="rotate(-28 140 196)" {...line} />
        </>
      )}
      {behindHead(kind, p)}
      {/* 머리 */}
      <ellipse cx={HX} cy={HY} rx={HRX} ry={HRY} fill={p.main} {...line} />
      {onHead(kind)}
      <ellipse cx="100" cy={muzzle.cy} rx={muzzle.rx} ry={muzzle.ry} fill={p.light} />
      <ellipse cx="50" cy="138" rx="13" ry="8" fill={p.cheek} opacity=".75" />
      <ellipse cx="150" cy="138" rx="13" ry="8" fill={p.cheek} opacity=".75" />

      {pose === 'basic' && (
        <>
          <Eye x={EL} />
          <Eye x={ER} />
          {nose(kind)}
          <path d="M91 144 Q95.5 150 100 144 Q104.5 150 109 144" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          {kind === 'rabbit' && <rect x="96" y="146" width="8" height="7" rx="2" fill="#FFFFFF" stroke="#D9C3B0" strokeWidth="1.5" />}
          {kind === 'shark' && <path d="M94 146 L97 151 L100 146 L103 151 L106 146" fill="none" stroke="#C9D8E6" strokeWidth="1.6" strokeLinejoin="round" />}
        </>
      )}
      {pose === 'happy' && (
        <>
          <path d={`M${EL - 11} ${EY + 3} Q${EL} ${EY - 11} ${EL + 11} ${EY + 3}`} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
          <path d={`M${ER - 11} ${EY + 3} Q${ER} ${EY - 11} ${ER + 11} ${EY + 3}`} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
          {nose(kind)}
          <path d="M89 143 Q100 164 111 143 Z" fill="#B3321C" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="100" cy="155" rx="6" ry="4" fill="#F28A8A" />
          {/* 반짝 */}
          <path d="M28 70 l3 -9 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 z" fill="#F2B544" />
          <path d="M168 44 l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 z" fill="#F2B544" />
        </>
      )}
      {pose === 'peek' && (
        <>
          {nose(kind)}
          <ellipse cx="100" cy="149" rx="5" ry="4.5" fill="#B3321C" />
          <path d="M66 190 Q56 150 70 126" fill="none" stroke={p.line} strokeWidth="25" strokeLinecap="round" />
          <path d="M134 190 Q144 150 130 126" fill="none" stroke={p.line} strokeWidth="25" strokeLinecap="round" />
          <path d="M66 190 Q56 150 70 126" fill="none" stroke={p.dark} strokeWidth="19" strokeLinecap="round" />
          <path d="M134 190 Q144 150 130 126" fill="none" stroke={p.dark} strokeWidth="19" strokeLinecap="round" />
          <ellipse cx={EL} cy={EY} rx="20" ry="16" fill={p.dark} {...line} />
          <ellipse cx={ER} cy={EY} rx="20" ry="16" fill={p.dark} {...line} />
          <circle cx={EL - 7} cy={EY - 4} r="3.5" fill={p.inner} />
          <circle cx={EL + 2} cy={EY - 7} r="3.5" fill={p.inner} />
          <circle cx={ER - 2} cy={EY - 7} r="3.5" fill={p.inner} />
          <circle cx={ER + 7} cy={EY - 4} r="3.5" fill={p.inner} />
        </>
      )}
    </svg>
  )
}
