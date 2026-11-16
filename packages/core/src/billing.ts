// 광고 제거·기능 해제 구매 (준비 중)
// TODO: Google Play 결제 플러그인 연결. 지금은 기기 저장값으로만 동작하는 자리표시자.
// 결제 버튼은 반드시 ParentGate 뒤에 둘 것 (docs/ideas/monetization.md)
import { createStore } from './storage'

const adFree = createStore<boolean>('core.adFree', false)

export function isAdFree(): boolean {
  return adFree.get()
}

export async function purchaseRemoveAds(): Promise<boolean> {
  throw new Error('결제는 아직 연결되지 않았습니다 (billing.ts TODO)')
}

export async function restorePurchases(): Promise<void> {
  // TODO: Play 구매 내역 조회 후 adFree 갱신
}
