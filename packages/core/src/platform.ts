import { Capacitor } from '@capacitor/core'

// 현재 실행 환경: 'android' | 'electron' | 'web'
export function getPlatform(): 'android' | 'electron' | 'web' {
  if (Capacitor.getPlatform() === 'android') return 'android'
  if (navigator.userAgent.includes('Electron')) return 'electron'
  return 'web'
}
