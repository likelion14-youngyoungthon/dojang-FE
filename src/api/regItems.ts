import { useEffect, useState } from 'react'
import type { WelfareIconKind } from '../data/welfare'
import { api } from './client'

/** GET /reg-items — 장애 등록할 때 같이 신청하는 것. id는 /judge의 reg_items 값 */
export interface RegItem {
  id: string
  /** 공식 이름 */
  label: string
  /** 화면에 보이는 쉬운 이름 */
  easy_label: string
  category: string
}

/** 서버 category → 복지 아이콘 */
const CATEGORY_ICON: Record<string, WelfareIconKind> = {
  discount: 'reduction',
  car: 'parking',
  care: 'care',
  device: 'assistive',
  counsel: 'counsel',
  medical: 'medical',
  transport: 'transport',
  job: 'employment',
}
export const regItemIcon = (category: string): WelfareIconKind => CATEGORY_ICON[category] ?? 'counsel'

let cache: Promise<RegItem[]> | undefined
/** 목록은 바뀌지 않으니 한 번만 부름 (실패하면 다음에 다시) */
function fetchRegItems() {
  cache ??= api.get<RegItem[]>('/reg-items').catch((e) => {
    cache = undefined
    throw e
  })
  return cache
}

export function useRegItems() {
  const [items, setItems] = useState<RegItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    fetchRegItems()
      .then((list) => alive && setItems(list))
      .catch((e: Error) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [attempt])

  return {
    items: items ?? [],
    loading: !items && !error,
    error,
    retry: () => {
      setError(null)
      setAttempt((n) => n + 1)
    },
  }
}
