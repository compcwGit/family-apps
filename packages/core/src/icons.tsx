// 스티커북 아이콘 (선 아이콘, 잉크색). 장식이라 aria-hidden — 버튼에 aria-label 을 붙일 것
const line = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const HomeIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...line} strokeWidth="2.6" aria-hidden="true">
    <path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" />
  </svg>
)
export const SpeakerIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...line} strokeWidth="2.4" aria-hidden="true">
    <path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7" /><path d="M19 6a8.5 8.5 0 0 1 0 12" />
  </svg>
)
export const GearIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...line} strokeWidth="2.2" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" />
  </svg>
)
export const CheckIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...line} strokeWidth="3.4" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)
export const EraserIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...line} strokeWidth="2.4" aria-hidden="true">
    <path d="M7 21h10" /><path d="M5.5 14.5l7-7 5 5-7 7H8z" />
  </svg>
)
export const StarIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <path d="M20 3 L25 14 L37 15 L28 23 L31 35 L20 29 L9 35 L12 23 L3 15 L15 14 Z" fill="#FFC94A" stroke="#2A2840" strokeWidth="3" strokeLinejoin="round" />
  </svg>
)
