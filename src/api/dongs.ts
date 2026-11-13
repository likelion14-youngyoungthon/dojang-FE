import { useEffect, useState } from 'react'
import { api } from './client'

export interface Dong {
  gu: string
  dong: string
}

let cache: Promise<Dong[]> | undefined
/** GET /dongs — 목록은 바뀌지 않으니 한 번만 부름 (실패하면 다음에 다시) */
function fetchDongs() {
  cache ??= api.get<Dong[]>('/dongs').catch((e) => {
    cache = undefined
    throw e
  })
  return cache
}

/** 구 순서대로 묶은 용인시 읍면동 목록 */
export function useDongs() {
  const [dongs, setDongs] = useState<Dong[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    fetchDongs()
      .then((list) => alive && setDongs(list))
      .catch((e: Error) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [attempt])

  const byGu = new Map<string, string[]>()
  for (const { gu, dong } of dongs ?? []) byGu.set(gu, [...(byGu.get(gu) ?? []), dong])

  return {
    byGu,
    loading: !dongs && !error,
    error,
    retry: () => {
      setError(null)
      setAttempt((n) => n + 1)
    },
  }
}
