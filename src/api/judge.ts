import type { Situation } from '../situation/SituationContext'
import { api } from './client'

/** POST /judge 응답의 서비스 하나 (대응표 4번) */
export interface JudgeItem {
  id: string
  name: string
  verdict: 'eligible' | 'check_needed' | 'not_eligible'
  /** apply 신청 전 · check 확인 필요 · extra_form 추가 서류 · auto 자동 적용 · already 등록 때 신청 · null 대상 아님 */
  status: 'apply' | 'check' | 'extra_form' | 'auto' | 'already' | null
  hidden: boolean
  /** provider면 '공고 대기' (기관이 모집할 때만 받음) */
  office: { id: string; name: string | null; phone: string | null }
  form_names: string[]
  documents: string[]
  processing_days: number | null
  deadline: string | null
  notes: string[]
  /** 나중에 가능: 이 나이부터 받을 수 있음 */
  eligible_from_age: number | null
  /** 복지 아이콘 종류 (대응표 6번). null이면 숨김 */
  category: string | null
  /** 13 목록 둘째 줄. null이면 숨김 */
  short_desc: string | null
  /** L2 제목 아래 설명. null이면 숨김 */
  description: string | null
  /** status: check일 때만 주황 글자 */
  check_reason: string | null
  /** 받는 것: 큰 글자 amount / 작은 글자 note */
  benefit: { amount: string; note: string | null } | null
  /** '왜 받을 수 있나요' — met: true 맞음 · false 안 맞음 · null 미확인 */
  conditions: { key: string; label: string; rule: string; value: string | null; met: boolean | null }[] | null
  /** 문자·온라인 모드 — 복지로 온라인 신청 근거가 있으면 true */
  online: boolean
}

/** data는 배열이 아니라 서비스 id를 키로 한 객체 (순서 유지) */
export type JudgeResult = Record<string, JudgeItem>

export interface JudgeRequest {
  age: number
  dong: string
  disability_type?: string
  severity?: string
  household?: number
  status?: string
  income_band?: string
  reg_items?: string[]
  reg_items_unknown?: boolean
  tags?: string[]
}

// 화면 글자 → 서버 값 (대응표 2·3번)
const DISABILITY: Record<string, string> = {
  지체장애: 'physical',
  뇌병변장애: 'brain_lesion',
  시각장애: 'visual',
  청각장애: 'hearing',
  언어장애: 'speech',
  지적장애: 'intellectual',
  자폐성장애: 'autism',
  정신장애: 'mental',
  신장장애: 'kidney',
  심장장애: 'heart',
  호흡기장애: 'respiratory',
  간장애: 'liver',
  안면장애: 'facial',
  '장루·요루장애': 'ostomy',
  뇌전증장애: 'epilepsy',
  '잘 모르겠어요': 'unknown',
}
const SEVERITY: Record<string, string> = { '심한 장애': 'severe', '심하지 않은 장애': 'mild', '잘 모르겠어요': 'unknown' }
const TAGS: Record<string, string> = {
  '어린이집에 다녀요': 'daycare',
  '차가 있어요': 'has_car',
  '휠체어를 써요': 'wheelchair',
  '최근에 아이를 낳았어요': 'newborn',
}
const LIVELIHOOD: Record<string, string> = { 기초생활수급: 'basic', 차상위: 'near_poor', '해당 없어요': 'neither', '잘 모르겠어요': 'unknown' }

/** 고른 상황 → POST /judge 요청. 누가·맞춤 모드·따로 신청한 것은 보내지 않음 */
export function toJudgeRequest(s: Partial<Situation>): JudgeRequest {
  const bundle = s.bundle ?? []
  const unknownBundle = bundle.includes('unknown')
  return {
    age: Number(s.age),
    dong: s.dong ?? '',
    disability_type: s.disabilityType ? DISABILITY[s.disabilityType] : undefined,
    severity: s.severity ? SEVERITY[s.severity] : undefined,
    tags: (s.circumstances ?? []).map((c) => TAGS[c]).filter(Boolean),
    reg_items: unknownBundle ? [] : bundle,
    reg_items_unknown: unknownBundle,
    household: s.householdSize,
    status: s.basicLivelihood ? LIVELIHOOD[s.basicLivelihood] : undefined,
    income_band: s.income ?? undefined,
  }
}

export const postJudge = (request: JudgeRequest) => api.post<JudgeResult>('/judge', request)

const invert = (m: Record<string, string>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [v, k]))

/** 다시 방문 — 저장된 profile(judge 요청)을 화면 상황 값으로 되돌림. 구·누가·소득 글자는 서버에 없어 비움 */
export function fromJudgeRequest(p: JudgeRequest): Partial<Situation> {
  const disability = invert(DISABILITY)
  const severity = invert(SEVERITY)
  const tags = invert(TAGS)
  const livelihood = invert(LIVELIHOOD)
  return {
    age: String(p.age),
    dong: p.dong,
    disabilityType: p.disability_type ? disability[p.disability_type] : null,
    severity: p.severity ? (severity[p.severity] as Situation['severity']) : null,
    circumstances: (p.tags ?? []).map((t) => tags[t]).filter(Boolean),
    bundle: p.reg_items_unknown ? ['unknown'] : (p.reg_items ?? []),
    householdSize: p.household ?? 3,
    basicLivelihood: p.status ? (livelihood[p.status] as Situation['basicLivelihood']) : null,
    income: (p.income_band as Situation['income']) ?? null,
  }
}
