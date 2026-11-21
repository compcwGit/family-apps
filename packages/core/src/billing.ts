// 전체 기능 해제 (1회 구매) — docs/ideas/006-paid-unlock.md
// - 안드로이드: Google Play 결제 (@capgo/native-purchases). Play Console 인앱 상품 ID = `${앱}_full` (1회 구매, 비소모성)
// - 웹(아이폰)·Windows: 아직 결제 없음 → 무료 놀이만 (나중에 해제 코드)
// - 서버 없음: 구매 여부는 Play 가 기기에 알려 주는 구매 내역 + 기기 저장값으로 판단
// 결제 버튼은 반드시 부모 잠금(ParentGate) 뒤 부모 화면에만 둘 것 (Google Play 가족 정책)
import { useSyncExternalStore } from 'react'
import { createStore } from './storage'
import { getPlatform } from './platform'

const unlocked = createStore<Record<string, boolean>>('core.unlocked', {})
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((f) => f())
const subscribe = (f: () => void) => {
  listeners.add(f)
  return () => listeners.delete(f)
}

/** Play Console 에 만들 인앱 상품 ID */
export const productIdOf = (app: string) => `${app}_full`

export function isUnlocked(app: string): boolean {
  return unlocked.get()[app] === true
}

/** 화면에서 쓰기: 구매하면 바로 다시 그려짐 */
export function useUnlocked(app: string): boolean {
  return useSyncExternalStore(subscribe, () => isUnlocked(app))
}

function setUnlocked(app: string) {
  unlocked.set({ ...unlocked.get(), [app]: true })
  emit()
}

/** 이 기기에서 결제할 수 있는지 (지금은 안드로이드 Play 버전만) */
export const canPurchase = () => getPlatform() === 'android'

const plugin = async () => await import('@capgo/native-purchases') // 웹·Windows 에서는 불러오지 않음

/** 스토어에 등록한 가격 (예: "₩3,900"). 못 가져오면 null */
export async function priceOf(app: string): Promise<string | null> {
  if (!canPurchase()) return null
  try {
    const { NativePurchases: p, PURCHASE_TYPE } = await plugin()
    const { product } = await p.getProduct({ productIdentifier: productIdOf(app), productType: PURCHASE_TYPE.INAPP })
    return product?.priceString ?? null
  } catch {
    return null
  }
}

/** 구매 창 열기. 구매가 끝나면 true */
export async function purchaseFull(app: string): Promise<boolean> {
  if (!canPurchase()) throw new Error('이 기기에서는 아직 결제할 수 없어요')
  const { NativePurchases: p, PURCHASE_TYPE } = await plugin()
  const t = await p.purchaseProduct({ productIdentifier: productIdOf(app), productType: PURCHASE_TYPE.INAPP })
  // purchaseState "1" = 구매 완료 ("2" 는 결제 대기 — 완료되면 다음 실행 때 복원으로 열림)
  if (t && (t.purchaseState === undefined || t.purchaseState === '1')) {
    setUnlocked(app)
    return true
  }
  return false
}

/** 구매 내역으로 다시 열기 (앱을 다시 깔았거나 기기를 바꿨을 때). 찾으면 true */
export async function restoreFull(app: string): Promise<boolean> {
  if (!canPurchase()) return false
  const { NativePurchases: p, PURCHASE_TYPE } = await plugin()
  try {
    await p.restorePurchases()
  } catch {
    /* 오프라인 등: 아래 구매 내역 조회로 계속 */
  }
  const { purchases } = await p.getPurchases({ productType: PURCHASE_TYPE.INAPP })
  const ok = purchases.some((x) => x.productIdentifier === productIdOf(app) && (x.purchaseState === undefined || x.purchaseState === '1'))
  if (ok) setUnlocked(app)
  return ok
}

/** 앱 시작 때 조용히 복원 (안드로이드). 실패해도 무시 */
export function autoRestore(app: string) {
  if (canPurchase() && !isUnlocked(app)) restoreFull(app).catch(() => {})
}

// ---- 예전 자리표시자 (광고 제거) — ads.ts 가 씀. 광고를 넣지 않기로 하면 지움
const adFree = createStore<boolean>('core.adFree', false)
export function isAdFree(): boolean {
  return adFree.get()
}
export async function purchaseRemoveAds(): Promise<boolean> {
  throw new Error('광고 제거 결제는 쓰지 않습니다 (전체 기능 해제 purchaseFull 사용)')
}
export async function restorePurchases(): Promise<void> {}
