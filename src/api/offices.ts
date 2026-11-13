import { useEffect, useState } from 'react'
import { api } from './client'

/** GET /offices 응답 한 곳 (주소·좌표·전화가 없는 기관도 있음) */
export interface ApiOffice {
  id: string
  name: string
  kind: string
  address: string | null
  phone: string | null
  lat: number | null
  lng: number | null
  checked_at: string
}

const cache = new Map<string, Promise<ApiOffice[]>>()
/** GET /offices?dong= — 동마다 한 번만 부름 (실패하면 다음에 다시) */
export function fetchOffices(dong: string) {
  let request = cache.get(dong)
  if (!request) {
    request = api.get<ApiOffice[]>('/offices', { query: { dong } }).catch((e) => {
      cache.delete(dong)
      throw e
    })
    cache.set(dong, request)
  }
  return request
}

/** 고른 동의 접수처 목록 — dong이 없으면 부르지 않음 */
export function useOffices(dong: string | null) {
  const [result, setResult] = useState<{ dong: string; offices?: ApiOffice[]; error?: string } | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!dong) return
    let alive = true
    fetchOffices(dong)
      .then((offices) => alive && setResult({ dong, offices }))
      .catch((e: Error) => alive && setResult({ dong, error: e.message }))
    return () => {
      alive = false
    }
  }, [dong, attempt])

  // 동을 바꾼 직후에는 이전 동의 결과를 보여 주지 않음
  const current = dong && result?.dong === dong ? result : null
  return {
    offices: current?.offices ?? null,
    loading: Boolean(dong) && !current,
    error: current?.error ?? null,
    retry: () => {
      setResult(null)
      setAttempt((n) => n + 1)
    },
  }
}
