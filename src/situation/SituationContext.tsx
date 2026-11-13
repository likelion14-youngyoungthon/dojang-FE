import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { IncomeBandId } from '../api/incomeBands'
import type { BasicLivelihood, Severity } from '../data/profileOptions'
import type { Gu } from '../data/regions'
import type { ApplicationProgress } from '../data/welfare'
import { readStorage, writeStorage } from '../lib/storage'

export type Applicant = '본인' | '가족·보호자'

/** 2 상황 알려 주기 4단계에서 모으는 값 (12 판정 요청에 실림) */
export interface Situation {
  gu: Gu | null
  dong: string | null
  applicant: Applicant | null
  age: string
  disabilityType: string | null
  severity: Severity | null
  circumstances: string[]
  /** 장애 등록할 때 같이 신청한 것 (id) */
  bundle: string[]
  /** 그것 말고 따로 신청한 게 있는지 */
  hasSeparate: boolean | null
  /** 따로 신청한 것 id → 지금 상태 */
  separate: Record<string, ApplicationProgress>
  householdSize: number
  basicLivelihood: BasicLivelihood | null
  income: IncomeBandId | null
  /** 고른 소득 구간의 화면 글자 (월 643만 원 이하) — 가족 수가 바뀌면 12 화면에서 다시 맞춤 */
  incomeLabel: string | null
}

const INITIAL_SITUATION: Situation = {
  gu: null,
  dong: null,
  applicant: null,
  age: '',
  disabilityType: null,
  severity: null,
  circumstances: [],
  bundle: [],
  hasSeparate: null,
  separate: {},
  householdSize: 3,
  basicLivelihood: null,
  income: null,
  incomeLabel: null,
}

interface SituationContextValue {
  situation: Situation
  update: (patch: Partial<Situation>) => void
  /** 체험 인물 값으로 통째로 바꾸거나 탈퇴할 때 비움 */
  replace: (next: Partial<Situation>) => void
}

const KEY = 'situation'

const SituationContext = createContext<SituationContextValue | null>(null)

export function SituationProvider({ children }: { children: ReactNode }) {
  const [situation, setSituation] = useState<Situation>(() => ({ ...INITIAL_SITUATION, ...readStorage<Situation>(KEY) }))
  useEffect(() => writeStorage(KEY, situation), [situation])

  const update = (patch: Partial<Situation>) => setSituation((prev) => ({ ...prev, ...patch }))
  const replace = (next: Partial<Situation>) => setSituation({ ...INITIAL_SITUATION, ...next })
  return <SituationContext.Provider value={{ situation, update, replace }}>{children}</SituationContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useSituation() {
  const ctx = useContext(SituationContext)
  if (!ctx) throw new Error('useSituation은 SituationProvider 안에서 써야 해요')
  return ctx
}
