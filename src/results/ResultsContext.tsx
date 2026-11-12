import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getPersona } from '../data/personas'
import { BENEFITS, DEFAULT_BENEFIT_IDS } from '../data/results'
import { readStorage, writeStorage } from '../lib/storage'
import { useSession } from '../session/SessionContext'

/** 신청한 뒤의 단계 — 서버 status의 submitted(심사 대기 중) · approved(결과 나옴) */
export type ProgressStage = 'submitted' | 'approved'

export interface ProgressEntry {
  /** ISO 날짜 — TODO: 서버 필드 services[].submitted_at 추가 필요 (Figma A2 메모) */
  submittedAt: string
  stage: ProgressStage
}

interface StoredResults {
  progress: Record<string, ProgressEntry>
  packed: string[]
}

interface ResultsContextValue extends StoredResults {
  /** 저장된 기록을 불러온 다시 방문인지 (A2) */
  isReturnVisit: boolean
  submit: (ids: string[]) => void
  setStage: (id: string, stage: ProgressStage) => void
  togglePacked: (name: string) => void
  /** 탈퇴·다른 체험 인물로 바꿀 때 비움 */
  clear: () => void
}

const KEY = 'results'
const EMPTY: StoredResults = { progress: {}, packed: [] }

const ResultsContext = createContext<ResultsContextValue | null>(null)

// 처음 열 때 저장된 신청 기록이 있으면 다시 방문으로 봄 — TODO: GET /me/progress 응답으로 판단
const stored = readStorage<StoredResults>(KEY)
const RETURN_VISIT = Object.keys(stored?.progress ?? {}).length > 0

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredResults>(() => ({ ...EMPTY, ...stored }))
  const [isReturnVisit, setIsReturnVisit] = useState(RETURN_VISIT)
  useEffect(() => writeStorage(KEY, state), [state])

  // TODO: PUT /me/progress 연동
  const submit = (ids: string[]) =>
    setState((prev) => {
      const submittedAt = new Date().toISOString()
      const progress = { ...prev.progress }
      ids.forEach((id) => {
        progress[id] ??= { submittedAt, stage: 'submitted' }
      })
      return { ...prev, progress }
    })
  const setStage = (id: string, stage: ProgressStage) =>
    setState((prev) => (prev.progress[id] ? { ...prev, progress: { ...prev.progress, [id]: { ...prev.progress[id], stage } } } : prev))
  const togglePacked = (name: string) =>
    setState((prev) => ({
      ...prev,
      packed: prev.packed.includes(name) ? prev.packed.filter((n) => n !== name) : [...prev.packed, name],
    }))
  const clear = () => {
    setState(EMPTY)
    setIsReturnVisit(false)
  }

  return (
    <ResultsContext.Provider value={{ ...state, isReturnVisit, submit, setStage, togglePacked, clear }}>
      {children}
    </ResultsContext.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export function useResults() {
  const ctx = useContext(ResultsContext)
  if (!ctx) throw new Error('useResults는 ResultsProvider 안에서 써야 해요')
  const { account } = useSession()

  const ids = getPersona(account?.personaId)?.benefitIds ?? DEFAULT_BENEFIT_IDS
  const mine = BENEFITS.filter((b) => ids.includes(b.id))
  const remaining = mine.filter((b) => !ctx.progress[b.id])
  // 신청 기록: 최근에 신청한 것부터
  const applied = mine
    .filter((b) => ctx.progress[b.id])
    .map((benefit) => ({ benefit, ...ctx.progress[benefit.id] }))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))

  return { ...ctx, remaining, applied }
}
