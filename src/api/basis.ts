import { useEffect, useState } from 'react'
import { api } from './client'
import type { JudgeRequest } from './judge'

/** GET /services/{id}/basis — 카드 상세 근거 (AI). 실패하면 E502 */
export interface BasisResponse {
  quotes: {
    /** 공식 원문 문장 */
    text: string
    /** 관련된 입력 필드 (age · disability_type · income_band 등) */
    matches: string
    source: string
    checked_at: string
    /** 지원대상 · 선정기준 · 지원내용 */
    section: string
  }[]
  summary: string
}

const cache = new Map<string, Promise<BasisResponse>>()
/** 서비스·사용자 값마다 한 번만 부름 (대응표: 열 때 1번, 서비스별 캐시). 실패하면 다음에 다시 */
function fetchBasis(id: string, p: JudgeRequest) {
  // 사용자 값은 /judge 요청과 같은 값
  const query = {
    age: p.age,
    disability_type: p.disability_type,
    severity: p.severity,
    status: p.status,
    income_band: p.income_band,
    tags: p.tags,
  }
  const key = `${id}?${JSON.stringify(query)}`
  let request = cache.get(key)
  if (!request) {
    request = api.get<BasisResponse>(`/services/${encodeURIComponent(id)}/basis`, { query }).catch((e) => {
      cache.delete(key)
      throw e
    })
    cache.set(key, request)
  }
  return request
}

/** id가 없으면 부르지 않음 (판정 전 Figma 예시 화면) */
export function useBasis(id: string | null, profile: JudgeRequest) {
  const [result, setResult] = useState<{ key: string; data?: BasisResponse; error?: string } | null>(null)
  const key = id ? `${id}?${JSON.stringify(profile)}` : ''

  useEffect(() => {
    if (!id) return
    let alive = true
    fetchBasis(id, profile)
      .then((data) => alive && setResult({ key, data }))
      .catch((e: Error) => alive && setResult({ key, error: e.message }))
    return () => {
      alive = false
    }
    // key가 id·사용자 값을 모두 담고 있음
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const current = result?.key === key ? result : null
  return { data: current?.data ?? null, error: current?.error ?? null }
}
