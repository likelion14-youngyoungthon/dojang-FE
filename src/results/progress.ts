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

/**
 * 신청 단계 4가지 (Figma L3: 서류 준비 → 행정복지센터 신청 → 자격 심사 → 결과 안내)
 * TODO: GET /services/{id}/steps 응답으로 교체
 */
export function getApplySteps(benefit: Benefit, entry: ProgressEntry): ApplyStep[] {
  const office = getOffice(benefit.officeId)
  const documents = benefit.documents?.map((d) => d.name).join(' · ')
  return [
    { title: '서류 준비', sub: documents ?? '필요한 서류는 접수처에서 알려 줘요' },
    {
      title: office ? `${office.kind} 신청` : '모집 기간 신청',
      sub: [formatMonthDay(entry.submittedAt), office?.name].filter(Boolean).join(' · '),
    },
    { title: '자격 심사', sub: '기간은 접수처에서 확인해요' },
    { title: '결과 안내', sub: entry.stage === 'approved' ? '접수처에서 알려 준 결과를 확인해요' : undefined },
  ]
}

/** 지금 단계 (1부터) — 신청하면 자격 심사, 결과가 나오면 결과 안내 */
export function currentStep(entry: ProgressEntry) {
  return entry.stage === 'approved' ? 4 : 3
}
