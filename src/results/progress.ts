import type { ServiceStep } from '../api/steps'
import { getOffice, type Benefit } from '../data/results'
import type { ProgressEntry } from './ResultsContext'

/** 11월 12일 */
export function formatMonthDay(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

export interface ApplyStep {
  title: string
  sub?: string
}

/** 서버 단계가 없을 때 쓰는 기본 4단계 (Figma L3) */
const DEFAULT_STEPS: ServiceStep[] = [
  { key: 'prepare', label: '서류 준비', days: null, parallel: true },
  { key: 'submit', label: '', days: null, parallel: false },
  { key: 'review', label: '자격 심사', days: null, parallel: false },
  { key: 'result', label: '결과 안내', days: null, parallel: false },
]

/**
 * 신청 단계 (Figma L3: 서류 준비 → 행정복지센터 신청 → 자격 심사 → 결과 안내)
 * serverSteps: GET /services/{id}/steps — 없으면 기본 4단계
 */
export function getApplySteps(benefit: Benefit, entry: ProgressEntry, serverSteps?: ServiceStep[] | null): ApplyStep[] {
  const office = getOffice(benefit.officeId)
  const documents = benefit.documents?.map((d) => d.name).join(' · ')
  return (serverSteps ?? DEFAULT_STEPS).map((step) => {
    switch (step.key) {
      case 'prepare':
        return { title: step.label, sub: documents ?? '필요한 서류는 접수처에서 알려 줘요' }
      case 'submit':
        return {
          title: step.label || (office ? `${office.kind} 신청` : '모집 기간 신청'),
          sub: [formatMonthDay(entry.submittedAt), office?.name].filter(Boolean).join(' · '),
        }
      case 'review':
        // days는 규칙표의 전체 처리 기간 — 심사만의 기간이나 확정 기한이 아님
        return {
          title: step.label,
          sub: step.days != null ? `전체 처리 기간 ${step.days}일 기준 · 정확한 기간은 접수처에서 확인해요` : '기간은 접수처에서 확인해요',
        }
      case 'result':
        return { title: step.label, sub: entry.stage === 'approved' ? '접수처에서 알려 준 결과를 확인해요' : undefined }
      default:
        return { title: step.label }
    }
  })
}

/** 지금 단계 (1부터) — 신청하면 자격 심사, 결과가 나오면 결과 안내 */
export function currentStep(entry: ProgressEntry, serverSteps?: ServiceStep[] | null) {
  const keys = (serverSteps ?? DEFAULT_STEPS).map((s) => s.key)
  const index = keys.indexOf(entry.stage === 'approved' ? 'result' : 'review')
  return index >= 0 ? index + 1 : keys.length
}
