// 빌드 종류: VITE_FAMILY=1 이면 아이용 'family' 빌드 (우리집 태블릿에 APK 로 직접 설치)
// — 잠금·결제 없이 전부 열려 있음. 결제 라이브러리도 앱에 안 들어감 (scripts/android-variant.mjs)
export const FAMILY = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_FAMILY === '1'
