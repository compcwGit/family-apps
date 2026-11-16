// 기기 안에만 저장 (서버 없음). 앱마다 prefix 로 구분.
// 데이터가 커지면 Dexie(IndexedDB)로 교체할 수 있게 이 파일 안에서만 저장 방식을 다룹니다.
export function createStore<T>(key: string, initial: T) {
  return {
    get(): T {
      try {
        const raw = localStorage.getItem(key)
        return raw ? (JSON.parse(raw) as T) : initial
      } catch {
        return initial
      }
    },
    set(value: T) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        /* 저장 공간이 없거나 막힌 경우: 조용히 무시 */
      }
    },
  }
}
