import { useEffect, useState } from 'react'
import { api } from './client'

/** GET /services/{id}/steps 단계 하나 */
export interface ServiceStep {
  /** prepare 서류 준비 · submit 신청 · review 자격 심사 · result 결과 안내 */
  key: string
  label: string
  /** review 단계만: 규칙표의 전체 처리 기간(일). 심사만의 기간이나 확정 기한이 아님. null은 미확인 */
  days: number | null
  /** 다른 단계와 함께 할 수 있는지 (완료 여부 아님) */
  parallel: boolean
}

const cache = new Map<string, Promise<ServiceStep[]>>()
/** 서비스마다 한 번만 부름 (실패하면 다음에 다시) */
function fetchSteps(id: string) {
  let request = cache.get(id)
  if (!request) {
    request = api.get<{ service_id: string; steps: ServiceStep[] }>(`/services/${encodeURIComponent(id)}/steps`).then(
      (d) => d.steps,
      (e) => {
        cache.delete(id)
        throw e
      },
    )
    cache.set(id, request)
  }
  return request
}

/** 실패하거나 Figma 예시 서비스(서버에 없는 id)면 null → 화면은 기본 4단계로 보여 줌 */
export function useServiceSteps(id: string | undefined) {
  const [result, setResult] = useState<{ id: string; steps: ServiceStep[] | null } | null>(null)

  useEffect(() => {
    if (!id) return
    let alive = true
    fetchSteps(id)
      .then((steps) => alive && setResult({ id, steps }))
      .catch(() => alive && setResult({ id, steps: null }))
    return () => {
      alive = false
    }
  }, [id])

  return result && result.id === id ? result.steps : null
}
