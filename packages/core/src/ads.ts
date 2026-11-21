// 광고 (애드몹) — 안드로이드 Play 버전만. 웹(아이폰)·Windows 에서는 아무것도 안 함
// Google Play 가족 정책 (만 5세 이하 대상):
// - 아동 대상 표시(tagForChildDirectedTreatment) + 전체 이용가(G) 광고만, 맞춤 광고 없음(npa)
// - 놀이 도중에는 띄우지 않고, 놀이를 바꿀 때만 가끔 전면 광고 (배너는 아이가 잘못 누르기 쉬워 안 씀)
// - 앱을 켜자마자는 안 띄움, 한 번 띄우면 한동안 쉼
// 광고 ID(AD_ID) 권한은 안드로이드 빌드에서 뺀다 (apps/<앱>/android.json → scripts/android-manifest.mjs)
import { getPlatform } from './platform'

export type AdsConfig = {
  /** 전면 광고 단위 ID (ca-app-pub-…/…) */
  interstitial: string
  /** 앱을 켜고 처음 광고까지 쉬는 시간(초) */
  firstAfter?: number
  /** 광고 사이 최소 간격(초) */
  gap?: number
}

const isAndroid = () => getPlatform() === 'android'
const plugin = async () => await import('@capacitor-community/admob') // 웹·Windows 에서는 불러오지 않음

let cfg: AdsConfig | null = null
let ready = false // 다음 광고를 미리 받아 둠
let last = 0 // 마지막으로 띄운 시각 (앱 시작 시각부터)

async function load() {
  if (!cfg) return
  try {
    const { AdMob } = await plugin()
    await AdMob.prepareInterstitial({ adId: cfg.interstitial, npa: true })
    ready = true
  } catch {
    ready = false // 오프라인 등: 다음 기회에 다시
  }
}

/** 앱 시작 때 한 번. 실패해도 앱은 그대로 */
export async function initAds(c: AdsConfig) {
  if (!isAndroid() || cfg) return
  cfg = c
  last = Date.now() - ((c.gap ?? 180) - (c.firstAfter ?? 120)) * 1000
  try {
    const { AdMob, MaxAdContentRating } = await plugin()
    await AdMob.initialize({
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
      maxAdContentRating: MaxAdContentRating.General,
    })
    await load()
  } catch {
    cfg = null
  }
}

/** 놀이를 바꿀 때 부르기: 간격이 지났고 광고가 준비돼 있을 때만 띄움 */
export async function adBreak() {
  if (!cfg || !ready || Date.now() - last < (cfg.gap ?? 180) * 1000) return
  ready = false
  last = Date.now()
  try {
    const { AdMob } = await plugin()
    await AdMob.showInterstitial()
  } catch {
    /* 무시 */
  }
  void load()
}
