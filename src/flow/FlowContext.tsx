import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DONG_BY_GU, type Gu } from '../data/regions'

export type Applicant = 'self' | 'other'
export type Relationship = '부모' | '보호자' | '가족' | '적법한 대리인' | '지원인'
export type SubjectConsent = 'yes' | 'no' | 'unknown'
export type FontScale = '기본' | '크게' | '매우 크게'

/** 25 접근성 설정 */
export interface A11ySettings {
  fontScale: FontScale
  highContrast: boolean
  screenReader: boolean
  focusHighlight: boolean
  easyMode: boolean
  captions: boolean
  voiceInput: boolean
  textOnly: boolean
}

export interface FlowState {
  gu: Gu
  dong: string
  agreedToTerms: boolean
  applicant: Applicant
  relationship: Relationship
  subjectConsent: SubjectConsent
  useVoice: boolean
  /** 06·07 화면에서 입력한 상황 설명 */
  situation: string
  a11y: A11ySettings
}

const DEFAULT_A11Y: A11ySettings = {
  fontScale: '기본',
  highContrast: false,
  screenReader: false,
  focusHighlight: true,
  easyMode: true,
  captions: false,
  voiceInput: true,
  textOnly: false,
}

const initialState: FlowState = {
  situation: '',
  gu: '처인구',
  dong: DONG_BY_GU['처인구'][0],
  agreedToTerms: true,
  applicant: 'self',
  relationship: '부모',
  subjectConsent: 'yes',
  useVoice: true,
  a11y: DEFAULT_A11Y,
}

const FONT_ZOOM: Record<FontScale, number> = { 기본: 1, 크게: 1.15, '매우 크게': 1.3 }

interface FlowContextValue {
  state: FlowState
  update: (patch: Partial<FlowState>) => void
}

const FlowContext = createContext<FlowContextValue | null>(null)

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(initialState)
  const update = (patch: Partial<FlowState>) => setState((prev) => ({ ...prev, ...patch }))

  // 접근성 설정을 문서 전체에 반영 (디자인이 px 단위라 글자 크기는 zoom으로 확대)
  const { fontScale, highContrast, focusHighlight } = state.a11y
  useEffect(() => {
    const root = document.documentElement
    root.style.zoom = String(FONT_ZOOM[fontScale])
    root.classList.toggle('a11y-high-contrast', highContrast)
    root.classList.toggle('a11y-focus', focusHighlight)
  }, [fontScale, highContrast, focusHighlight])

  return <FlowContext.Provider value={{ state, update }}>{children}</FlowContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useFlow() {
  const ctx = useContext(FlowContext)
  if (!ctx) throw new Error('useFlow must be used within FlowProvider')
  return ctx
}
