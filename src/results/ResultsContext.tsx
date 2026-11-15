import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { KAKAO_CALLBACK_PATH } from '../api/auth'
import { getToken } from '../api/client'
import { fetchDongs } from '../api/dongs'
import { bandText, fetchIncomeBands } from '../api/incomeBands'
import { fromJudgeRequest, postJudge, toJudgeRequest, type JudgeRequest, type JudgeResult } from '../api/judge'
import { fetchOffices, type ApiOffice } from '../api/offices'
import { buildServices, getProgress, putProgress, userStatusOf, type UserStatus } from '../api/progress'
import type { ApplicationProgress } from '../data/welfare'
import { getPersona } from '../data/personas'
import { BENEFITS, DEFAULT_BENEFIT_IDS, LATER_BENEFITS, OFFICES, setLiveView, toJudgeView, type JudgeView } from '../data/results'
import { readStorage, writeStorage } from '../lib/storage'
import { useSession } from '../session/SessionContext'
import { useSituation, type Situation } from '../situation/SituationContext'

/** 신청한 뒤의 단계 — 서버 저장 값 submitted(심사 대기 중) · approved · in_use(이용 중) */
export type ProgressStage = UserStatus

export interface ProgressEntry {
  /** ISO 날짜 (서버에는 submitted_at YYYY-MM-DD로 저장). 모르면 null */
  submittedAt: string | null
  stage: ProgressStage
}

interface StoredResults {
  progress: Record<string, ProgressEntry>
  /** 26 서류 체크 — 서버에 안 보냄 (localStorage만) */
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
  runJudge: (situation: Partial<Situation>, options?: { save?: boolean }) => Promise<void>
  togglePacked: (name: string) => void
  /** 카카오 로그인 직후 — 서버에 저장된 상황·신청 현황으로 채움. 저장된 게 없으면 false */
  restore: (options?: { overwrite?: boolean }) => Promise<boolean>
  /** 탈퇴·다른 체험 인물로 바꿀 때 비움 */
  clear: () => void
}

const KEY = 'results'
const EMPTY: StoredResults = { progress: {}, packed: [], judge: null, offices: [] }

const ResultsContext = createContext<ResultsContextValue | null>(null)

const stored = readStorage<StoredResults>(KEY)
// 토큰이 없으면 이 브라우저의 기록으로 다시 방문을 판단 (토큰이 있으면 GET /me/progress로)
const RETURN_VISIT = Object.keys(stored?.progress ?? {}).length > 0

/** 판정 + 같은 동의 접수처 주소 (judge office에는 이름·전화만 있음) */
async function judgeWithOffices(request: JudgeRequest) {
  const [judge, offices] = await Promise.all([postJudge(request), fetchOffices(request.dong)])
  return { judge, offices }
}

/** 10 '따로 신청한 것' 상태 → 저장 값 (대응표 4번) */
const SEPARATE_STATUS: Record<ApplicationProgress, UserStatus> = { '심사 대기 중': 'submitted', '결과 나옴': 'approved', '이용 중': 'in_use' }
const separateStatuses = (s: Partial<Situation>) =>
  Object.fromEntries(Object.entries(s.separate ?? {}).map(([id, label]) => [id, SEPARATE_STATUS[label]]))

/**
 * 서버 profile → 화면 상황 값. 서버에 없는 구·소득 글자는 목록 API로 다시 채움
 * (구: GET /dongs, 소득 글자: GET /income-bands — 12 화면과 같은 글자). 누가(본인/보호자)는 서버에 없어 비움
 */
async function situationFromProfile(profile: JudgeRequest): Promise<Partial<Situation>> {
  const base = fromJudgeRequest(profile)
  const needBands = profile.household != null && base.income != null && base.income !== 'unknown'
  const [dongs, bands] = await Promise.all([
    fetchDongs().catch(() => []),
    needBands ? fetchIncomeBands(profile.household!).catch(() => null) : null,
  ])
  const band = bands?.bands.find((b) => b.id === base.income)
  return {
    ...base,
    gu: dongs.find((d) => d.dong === profile.dong)?.gu ?? null,
    incomeLabel: band && bands ? bandText(band, bands.bands).label : null,
  }
}

/** PUT /me/progress — 로그인(토큰)했을 때만. 목록 통째로 저장 (따로 신청한 것과 상태 포함) */
function save(situation: Partial<Situation>, judge: JudgeResult | null, progress: Record<string, ProgressEntry>) {
  if (!getToken()) return
  // TODO: 저장 실패를 화면에 알릴 디자인이 없어 콘솔에만 남김
  putProgress(toJudgeRequest(situation), buildServices(judge, progress, separateStatuses(situation))).catch((e) =>
    console.warn('신청 현황 저장 실패', e),
  )
}

export function ResultsProvider({ children }: { children: ReactNode }) {
  const { situation, replace } = useSituation()
  const [state, setState] = useState<StoredResults>(() => ({ ...EMPTY, ...stored }))
  const [isReturnVisit, setIsReturnVisit] = useState(RETURN_VISIT)
  useEffect(() => writeStorage(KEY, state), [state])
  // 자식 화면보다 먼저 채워야 getBenefit·getOffice가 판정 결과를 봄
  const view = state.judge ? toJudgeView(state.judge, state.offices) : null
  setLiveView(view)

  /**
   * 저장된 기록 불러오기: GET /me/progress → POST /judge (대응표)
   * - overwrite: 이 브라우저의 상황 값을 서버 profile로 덮어씀 (로그인 직후). 아니면 비어 있을 때만 채움
   * - 저장된 profile이 없으면 false
   */
  const restore = async ({ overwrite = false, alive = (): boolean => true } = {}) => {
    const { profile, services } = await getProgress()
    if (!alive() || !profile) return false
    const progress: Record<string, ProgressEntry> = {}
    for (const s of services) {
      const stage = userStatusOf(s)
      if (stage) progress[s.id] = { stage, submittedAt: s.submitted_at ? `${s.submitted_at}T00:00:00` : null }
    }
    // 다른 기기에서 열면 상황 값이 비어 있으니 서버 profile로 채움
    const shouldFill = overwrite || !situation.dong
    const [{ judge, offices }, restored] = await Promise.all([
      judgeWithOffices(profile),
      shouldFill ? situationFromProfile(profile) : null,
    ])
    if (!alive()) return false
    if (restored) replace(restored)
    setState((prev) => ({ ...prev, progress, judge, offices }))
    setIsReturnVisit(Object.values(progress).some((p) => p.stage === 'submitted'))
    return true
  }

  // 다시 방문: 앱 열 때 토큰 있으면 불러옴 (카카오 로그인 콜백 화면은 거기서 직접 부름)
  useEffect(() => {
    if (!getToken() || window.location.pathname === KAKAO_CALLBACK_PATH) return
    let alive = true
    restore({ alive: () => alive }).catch((e) => console.warn('다시 방문 불러오기 실패', e))
    return () => {
      alive = false
    }
    // 앱을 열 때 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 낸 신청 고르기 · 상태 변경: 누를 때마다 PUT /me/progress
  const updateProgress = (next: Record<string, ProgressEntry>) => {
    setState((prev) => ({ ...prev, progress: next }))
    save(situation, state.judge, next)
  }
  const submit = (ids: string[]) => {
    const submittedAt = new Date().toISOString()
    const next = { ...state.progress }
    ids.forEach((id) => {
      next[id] ??= { submittedAt, stage: 'submitted' }
    })
    updateProgress(next)
  }
  const setStage = (id: string, stage: ProgressStage) => {
    if (!state.progress[id]) return
    updateProgress({ ...state.progress, [id]: { ...state.progress[id], stage } })
  }
  const togglePacked = (name: string) =>
    setState((prev) => ({
      ...prev,
      packed: prev.packed.includes(name) ? prev.packed.filter((n) => n !== name) : [...prev.packed, name],
    }))
  // 상황 바꾸기: POST /judge → PUT /me/progress (기존 진행 상태는 유지)
  // 체험 인물 고르기는 POST /auth/demo → POST /judge만 (저장 없음, 대응표)
  const runJudge = async (next: Partial<Situation>, { save: shouldSave = true } = {}) => {
    const request = toJudgeRequest(next)
    const { judge, offices } = await judgeWithOffices(request)
    setState((prev) => ({ ...prev, judge, offices }))
    if (shouldSave) save(next, judge, state.progress)
  }
  const clear = () => {
    setState(EMPTY)
    setIsReturnVisit(false)
  }

  return (
    <ResultsContext.Provider value={{ ...state, view, isReturnVisit, submit, setStage, runJudge, togglePacked, restore, clear }}>
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
  // 화면 상태 = 저장 값(submitted·approved·in_use)이 있으면 그것 → 낸 신청과 '따로 신청한 것'은 남은 신청에서 뺌
  const { situation } = useSituation()
  const remaining = mine.filter((b) => !ctx.progress[b.id] && !situation.separate[b.id])
  // 신청 기록: 최근에 신청한 것부터
  const applied = mine
    .filter((b) => ctx.progress[b.id])
    .map((benefit) => ({ benefit, ...ctx.progress[benefit.id] }))
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))

  return { ...ctx, remaining, applied, offices, later }
}
