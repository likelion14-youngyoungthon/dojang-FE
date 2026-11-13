import type { JudgeRequest, JudgeResult } from './judge'
import { api } from './client'

/**
 * 저장 값 (대응표 4번)
 * judge 판단: apply · check · extra_form · auto · already / 사용자: submitted · approved · in_use / 옛 값 applied는 submitted로 봄
 */
export type SavedStatus = 'apply' | 'check' | 'extra_form' | 'auto' | 'already' | 'submitted' | 'approved' | 'in_use' | 'applied'

export interface ServiceState {
  id: string
  status: SavedStatus | null
  /** YYYY-MM-DD */
  submitted_at: string | null
}

export interface ProgressResponse {
  profile: JudgeRequest | null
  services: ServiceState[]
  updated_at: string | null
}

/** 사용자가 바꾼 상태 (이 값이 있으면 judge status 대신 화면 상태가 됨) */
export const USER_STATUSES = ['submitted', 'approved', 'in_use'] as const
export type UserStatus = (typeof USER_STATUSES)[number]

/** 사용자 상태만 뽑음 (applied → submitted) */
export function userStatusOf(s: ServiceState): UserStatus | null {
  if (s.status === 'applied') return 'submitted'
  return USER_STATUSES.find((u) => u === s.status) ?? null
}

/** 로컬 날짜 YYYY-MM-DD (UTC로 바꾸면 밤 9시 이후 날짜가 하루 밀림) */
export function toDateString(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * PUT /me/progress의 services — 카드 목록 (judge 결과 또는 사용자가 바꾼 상태)
 * - 나중에 가능·화면에서 뺀 것은 저장 안 함 (대응표 4번)
 * - 새 판정에서 빠진 진행 중 서비스도 보존 (상황 변경 재판정 계약)
 */
export function buildServices(
  judge: JudgeResult | null,
  progress: Record<string, { stage: UserStatus; submittedAt: string }>,
): ServiceState[] {
  const fromJudge = Object.values(judge ?? {})
    .filter((i) => !i.hidden && i.verdict !== 'not_eligible')
    .map((i): ServiceState => {
      const user = progress[i.id]
      return user
        ? { id: i.id, status: user.stage, submitted_at: toDateString(user.submittedAt) }
        : { id: i.id, status: i.status, submitted_at: null }
    })
  const kept = Object.entries(progress)
    .filter(([id]) => !fromJudge.some((s) => s.id === id))
    .map(([id, p]): ServiceState => ({ id, status: p.stage, submitted_at: toDateString(p.submittedAt) }))
  return [...fromJudge, ...kept]
}

export const getProgress = () => api.get<ProgressResponse>('/me/progress')

/** 목록을 통째로 저장 (서버는 전체 교체) */
export const putProgress = (profile: JudgeRequest | null, services: ServiceState[]) =>
  api.put<ProgressResponse>('/me/progress', { profile, services })
