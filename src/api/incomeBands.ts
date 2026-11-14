import { useEffect, useState } from 'react'
import { api } from './client'

/** /judge의 income_band 값 */
export type IncomeBandId = 'le120' | 'le180' | 'over180' | 'unknown'

export interface IncomeBand {
  id: IncomeBandId
  /** 서버 글자 (월 6,430,843원 이하) */
  label: string
  /** 이 구간의 상한(원). over180·unknown은 null */
  max_won: number | null
}

export interface IncomeBands {
  year: number
  household: number
  bands: IncomeBand[]
  source: string
  checked_at: string
}

/** 화면 글자 — 큰 글자는 만 원 단위, 작은 글자는 원 단위 (대응표: max_won으로 만듦) */
export function bandText(band: IncomeBand, bands: IncomeBand[]): { label: string; sub?: string } {
  if (band.max_won != null) {
    return {
      label: `월 ${Math.floor(band.max_won / 10_000).toLocaleString()}만 원 이하`,
      sub: `${band.max_won.toLocaleString()}원 이하`,
    }
  }
  if (band.id === 'over180') {
    const top = bands.find((b) => b.id === 'le180')?.max_won
    return { label: '그보다 많아요', sub: top != null ? `${top.toLocaleString()}원 초과` : undefined }
  }
  return { label: band.label }
}

const cache = new Map<number, Promise<IncomeBands>>()
/** GET /income-bands?household= — 가족 수마다 한 번만 부름 (실패하면 다음에 다시) */
export function fetchIncomeBands(household: number) {
  let request = cache.get(household)
  if (!request) {
    request = api.get<IncomeBands>('/income-bands', { query: { household } }).catch((e) => {
      cache.delete(household)
      throw e
    })
    cache.set(household, request)
  }
  return request
}

export function useIncomeBands(household: number) {
  const [result, setResult] = useState<{ household: number; data?: IncomeBands; error?: string } | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    fetchIncomeBands(household)
      .then((data) => alive && setResult({ household, data }))
      .catch((e: Error) => alive && setResult({ household, error: e.message }))
    return () => {
      alive = false
    }
  }, [household, attempt])

  // 가족 수를 바꾼 직후에는 이전 금액을 보여 주지 않음
  const current = result?.household === household ? result : null
  return {
    bands: current?.data?.bands ?? null,
    loading: !current,
    error: current?.error ?? null,
    retry: () => {
      setResult(null)
      setAttempt((n) => n + 1)
    },
  }
}
