import { createContext, useContext, useState, type ReactNode } from 'react'
import { DONG_BY_GU, type Gu } from '../data/regions'

export type Applicant = 'self' | 'other'
export type Relationship = '부모' | '보호자' | '가족' | '적법한 대리인' | '지원인'
export type SubjectConsent = 'yes' | 'no' | 'unknown'

export interface FlowState {
  gu: Gu
  dong: string
  agreedToTerms: boolean
  applicant: Applicant
  relationship: Relationship
  subjectConsent: SubjectConsent
  useVoice: boolean
}

const initialState: FlowState = {
  gu: '처인구',
  dong: DONG_BY_GU['처인구'][0],
  agreedToTerms: true,
  applicant: 'self',
  relationship: '부모',
  subjectConsent: 'yes',
  useVoice: true,
}

interface FlowContextValue {
  state: FlowState
  update: (patch: Partial<FlowState>) => void
}

const FlowContext = createContext<FlowContextValue | null>(null)

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(initialState)
  const update = (patch: Partial<FlowState>) => setState((prev) => ({ ...prev, ...patch }))

  return <FlowContext.Provider value={{ state, update }}>{children}</FlowContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used within FlowProvider')
  return ctx
}
