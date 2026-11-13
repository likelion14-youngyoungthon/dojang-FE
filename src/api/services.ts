import { useEffect, useState } from 'react'
import type { WelfareIconKind } from '../data/welfare'
import { api } from './client'

/** GET /services?age= — 10 '따로 신청한 것' 고르기 목록 (나이 범위만 거르고 자격은 판정 안 함) */
export interface ServiceItem {
  id: string
  name: string
  /** 아이콘 종류 (대응표 6번). null이면 숨김 */
  category: string | null
}

/** 대응표 6번 category → 20px 복지 아이콘. 맞는 아이콘이 없으면 숨김 */
const CATEGORY_ICON: Record<string, WelfareIconKind> = {
  allowance: 'allowance',
  therapy: 'therapy',
  care: 'care',
  counsel: 'counsel',
  childcare: 'childcare',
  education: 'education',
  transport: 'transport',
  discount: 'reduction',
  device: 'assistive',
  medical: 'medical',
  job: 'employment',
  sports: 'sports',
  car: 'parking',
}
export const categoryIcon = (category: string | null): WelfareIconKind | undefined =>
  category ? CATEGORY_ICON[category] : undefined

const cache = new Map<number, Promise<ServiceItem[]>>()
/** 나이마다 한 번만 부름 (실패하면 다음에 다시) */
function fetchServices(age: number) {
  let request = cache.get(age)
  if (!request) {
    request = api.get<ServiceItem[]>('/services', { query: { age } }).catch((e) => {
      cache.delete(age)
      throw e
    })
    cache.set(age, request)
  }
  return request
}

/** 나이가 없으면 부르지 않음 (02 화면에서 고른 만 나이) */
export function useServiceList(age: string) {
  const n = age === '' ? NaN : Number(age)
  const valid = Number.isInteger(n) && n >= 0
  const [result, setResult] = useState<{ age: number; items?: ServiceItem[]; error?: string } | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!valid) return
    let alive = true
    fetchServices(n)
      .then((items) => alive && setResult({ age: n, items }))
      .catch((e: Error) => alive && setResult({ age: n, error: e.message }))
    return () => {
      alive = false
    }
  }, [n, valid, attempt])

  const current = valid && result?.age === n ? result : null
  return {
    items: current?.items ?? [],
    loading: valid && !current,
    error: current?.error ?? null,
    retry: () => {
      setResult(null)
      setAttempt((x) => x + 1)
    },
  }
}
