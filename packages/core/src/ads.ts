// 광고 (준비 중) — AdMob, 아동용 설정이 기본값
// 가족 정책: 놀이 중·단계 시작 때 전면 광고 금지, 아동 대상 처리 + 최대 등급 G
import { isAdFree } from './billing'

export const AD_CONFIG = {
  tagForChildDirectedTreatment: true,
  maxAdContentRating: 'G',
} as const

export function shouldShowAds(): boolean {
  return !isAdFree()
}

export async function showBanner(): Promise<void> {
  if (!shouldShowAds()) return
  // TODO: @capacitor-community/admob 연결 (개발 중엔 테스트 광고 ID)
}
