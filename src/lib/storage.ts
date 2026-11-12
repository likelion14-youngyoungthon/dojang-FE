// 브라우저 저장소 — 사생활 보호 모드 등에서 막혀 있어도 화면은 그대로 동작하도록 실패는 무시
// TODO: GET·PUT /me/progress 연동 후에는 서버 값을 기준으로 삼고 이곳은 임시 보관용으로만 씀

const PREFIX = 'didim:'

export function readStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // 저장이 안 돼도 이번 방문 동안은 메모리 값으로 계속 씀
  }
}

export function removeStorage(key: string) {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    // 무시
  }
}
