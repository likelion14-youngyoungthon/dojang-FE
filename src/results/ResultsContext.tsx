import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getPersona } from '../data/personas'
import { postJudge, toJudgeRequest, type JudgeResult } from '../api/judge'
import { fetchOffices, type ApiOffice } from '../api/offices'
import { BENEFITS, DEFAULT_BENEFIT_IDS, LATER_BENEFITS, OFFICES, setLiveView, toJudgeView, type JudgeView } from '../data/results'
import { readStorage, writeStorage } from '../lib/storage'
import { useSession } from '../session/SessionContext'
import type { Situation } from '../situation/SituationContext'

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
  /** POST /judge 응답 — 없으면 Figma 예시 값으로 보여 줌 */
  judge: JudgeResult | null
  /** 판정한 동의 GET /offices (접수처 주소) */
  offices: ApiOffice[]
}

interface ResultsContextValue extends StoredResults {
  /** 판정 결과를 화면 데이터로 바꾼 것 (없으면 null) */
  view: JudgeView | null
  /** 저장된 기록을 불러온 다시 방문인지 (A2) */
  isReturnVisit: boolean
  submit: (ids: string[]) => void
  setStage: (id: string, stage: ProgressStage) => void
  /** 12 '결과 보기' · 체험 인물 고르기 — 판정 받고 저장. 실패하면 ApiError를 던짐 */
  runJudge: (situation: Partial<Situation>) => Promise<void>
  togglePacked: (name: string) => void
  /** 탈퇴·다른 체험 인물로 바꿀 때 비움 */
  clear: () => void
}

const KEY = 'results'
const EMPTY: StoredResults = { progress: {}, packed: [], judge: null, offices: [] }

const ResultsContext = createContext<ResultsContextValue | null>(null)

// 처음 열 때 저장된 신청 기록이 있으면 다시 방문으로 봄 — TODO: GET /me/progress 응답으로 판단
const stored = readStorage<StoredResults>(KEY)
const RETURN_VISIT = Object.keys(stored?.progress ?? {}).length > 0

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredResults>(() => ({ ...EMPTY, ...stored }))
  const [isReturnVisit, setIsReturnVisit] = useState(RETURN_VISIT)
  useEffect(() => writeStorage(KEY, state), [state])
  // 자식 화면보다 먼저 채워야 getBenefit·getOffice가 판정 결과를 봄
  const view = state.judge ? toJudgeView(state.judge, state.offices) : null
  setLiveView(view)

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
  const runJudge = async (situation: Partial<Situation>) => {
    const request = toJudgeRequest(situation)
    // 접수처 주소는 판정과 같이 받음 (judge office에는 이름·전화만 있음)
    const [judge, offices] = await Promise.all([postJudge(request), fetchOffices(request.dong)])
    setState((prev) => ({ ...prev, judge, offices }))
  }
  const clear = () => {
    setState(EMPTY)
    setIsReturnVisit(false)
  }

  return (
    <ResultsContext.Provider value={{ ...state, view, isReturnVisit, submit, setStage, runJudge, togglePacked, clear }}>
      {children}
    </ResultsContext.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export function useResults() {
  const ctx = useContext(ResultsContext)
  if (!ctx) throw new Error('useResults는 ResultsProvider 안에서 써야 해요')
  const { account } = useSession()

  // 판정 결과가 있으면 서버 기준, 없으면 Figma 예시 값
  const { view } = ctx
  const ids = getPersona(account?.personaId)?.benefitIds ?? DEFAULT_BENEFIT_IDS
  const mine = view?.benefits ?? BENEFITS.filter((b) => ids.includes(b.id))
  const offices = view?.offices ?? OFFICES
  const later = view?.later.map((l) => l.name) ?? LATER_BENEFITS
  const remaining = mine.filter((b) => !ctx.progress[b.id])
  // 신청 기록: 최근에 신청한 것부터
  const applied = mine
    .filter((b) => ctx.progress[b.id])
    .map((benefit) => ({ benefit, ...ctx.progress[benefit.id] }))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))

  return { ...ctx, remaining, applied, offices, later }
}
