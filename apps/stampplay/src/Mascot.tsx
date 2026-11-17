// 캐릭터 꾹이 (도장을 든 아기곰). pose: basic 도장 들기 / happy 기뻐하기 / peek 눈 가리기
export type Pose = 'basic' | 'happy' | 'peek'
const LABEL: Record<Pose, string> = { basic: '도장을 든 아기곰 꾹이', happy: '두 팔을 들고 기뻐하는 꾹이', peek: '두 손으로 눈을 가린 꾹이' }

export function Mascot({ pose = 'basic', size = 110 }: { pose?: Pose; size?: number }) {
  return (
    <svg className="sp-mascot" width={size} height={Math.round(size * 1.15)} viewBox="0 0 200 230" role="img" aria-label={LABEL[pose]}>
      {pose === 'happy' && (
        <>
          <ellipse cx="38" cy="150" rx="13" ry="24" fill="#E8A25C" transform="rotate(-35 38 150)" />
          <ellipse cx="162" cy="150" rx="13" ry="24" fill="#E8A25C" transform="rotate(35 162 150)" />
        </>
      )}
      <ellipse cx="100" cy="192" rx="52" ry="38" fill="#F0B26E" />
      <ellipse cx="100" cy="198" rx="30" ry="24" fill="#FFE8CC" />
      {pose === 'basic' && <ellipse cx="54" cy="186" rx="14" ry="20" fill="#E8A25C" transform="rotate(25 54 186)" />}
      <circle cx="54" cy="46" r="22" fill="#E8A25C" />
      <circle cx="54" cy="46" r="11" fill="#F6CFA0" />
      <circle cx="146" cy="46" r="22" fill="#E8A25C" />
      <circle cx="146" cy="46" r="11" fill="#F6CFA0" />
      <ellipse cx="100" cy="98" rx="72" ry="64" fill="#F0B26E" />
      <ellipse cx="100" cy="122" rx="30" ry="22" fill="#FFE8CC" />
      {pose === 'basic' && (
        <>
          <circle cx="58" cy="118" r="10" fill="#F3907A" />
          <circle cx="142" cy="118" r="10" fill="#F3907A" />
          <circle cx="74" cy="94" r="7.5" fill="#3A2A1F" />
          <circle cx="76.5" cy="91.5" r="2.4" fill="#FFFFFF" />
          <circle cx="126" cy="94" r="7.5" fill="#3A2A1F" />
          <circle cx="128.5" cy="91.5" r="2.4" fill="#FFFFFF" />
          <ellipse cx="100" cy="112" rx="9" ry="6.5" fill="#3A2A1F" />
          <path d="M90 126 Q100 135 110 126" fill="none" stroke="#3A2A1F" strokeWidth="3" strokeLinecap="round" />
          <rect x="146" y="138" width="16" height="28" rx="8" fill="#8B5E3C" />
          <rect x="134" y="162" width="40" height="15" rx="4" fill="#D6402A" />
          <ellipse cx="150" cy="182" rx="14" ry="17" fill="#E8A25C" />
        </>
      )}
      {pose === 'happy' && (
        <>
          <circle cx="58" cy="116" r="11" fill="#F3907A" />
          <circle cx="142" cy="116" r="11" fill="#F3907A" />
          <path d="M64 98 Q74 84 84 98" fill="none" stroke="#3A2A1F" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M116 98 Q126 84 136 98" fill="none" stroke="#3A2A1F" strokeWidth="4.5" strokeLinecap="round" />
          <ellipse cx="100" cy="111" rx="9" ry="6.5" fill="#3A2A1F" />
          <path d="M87 122 Q100 146 113 122 Z" fill="#B3321C" />
        </>
      )}
      {pose === 'peek' && (
        <>
          <circle cx="58" cy="120" r="10" fill="#F3907A" />
          <circle cx="142" cy="120" r="10" fill="#F3907A" />
          <ellipse cx="100" cy="112" rx="9" ry="6.5" fill="#3A2A1F" />
          <ellipse cx="100" cy="129" rx="6" ry="5" fill="#B3321C" />
          <path d="M62 160 Q60 125 72 104" fill="none" stroke="#E8A25C" strokeWidth="22" strokeLinecap="round" />
          <path d="M138 160 Q140 125 128 104" fill="none" stroke="#E8A25C" strokeWidth="22" strokeLinecap="round" />
          <ellipse cx="76" cy="94" rx="20" ry="16" fill="#E8A25C" />
          <ellipse cx="124" cy="94" rx="20" ry="16" fill="#E8A25C" />
          <circle cx="70" cy="90" r="3.5" fill="#F6CFA0" />
          <circle cx="80" cy="88" r="3.5" fill="#F6CFA0" />
          <circle cx="120" cy="88" r="3.5" fill="#F6CFA0" />
          <circle cx="130" cy="90" r="3.5" fill="#F6CFA0" />
        </>
      )}
    </svg>
  )
}
