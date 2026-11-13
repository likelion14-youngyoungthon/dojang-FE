import type { RegItem } from '../api/regItems'
import { SEPARATE_APPLICATIONS } from '../data/welfare'
import type { Situation } from './SituationContext'

export interface SummaryRow {
  label: string
  /** 채워지지 않았으면 null, 여러 줄이면 배열 */
  lines: string[] | null
}

const SEVERITY_TEXT = { '심한 장애': '정도 심함', '심하지 않은 장애': '정도 심하지 않음', '잘 모르겠어요': null } as const
const LIVELIHOOD_TEXT = { 기초생활수급: '기초생활수급', 차상위: '차상위', '해당 없어요': '수급 아님', '잘 모르겠어요': null } as const

/** 오른쪽 "내 상황" 카드에 보이는 6줄 — 단계 순서(사는 곳·누가 → 나이·장애 → 이미 신청 → 가구·소득)와 같게 */
/** regItems: GET /reg-items 목록 (등록 때 신청한 것 이름) */
export function summarize(s: Situation, regItems: RegItem[]): SummaryRow[] {
  const disability = s.disabilityType
    ? [
        s.disabilityType === '잘 모르겠어요' ? '장애 유형 모름' : s.disabilityType.replace(/장애$/, ' 장애'),
        s.severity ? SEVERITY_TEXT[s.severity] : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : null

  const household = s.basicLivelihood
    ? [
        [`${s.householdSize}명`, LIVELIHOOD_TEXT[s.basicLivelihood]].filter(Boolean).join(' · '),
        ...(s.income && s.income !== 'unknown' && s.incomeLabel ? [s.incomeLabel] : []),
      ]
    : null

  const applied = [
    ...regItems.filter((w) => s.bundle.includes(w.id)).map((w) => w.easy_label),
    ...(s.hasSeparate ? SEPARATE_APPLICATIONS.filter((w) => w.id in s.separate).map((w) => w.name) : []),
  ]
  const appliedDone = applied.length > 0 || s.hasSeparate === false || s.bundle.includes('unknown')

  return [
    { label: '사는 곳', lines: s.gu && s.dong ? [`${s.gu} ${s.dong}`] : null },
    { label: '누가', lines: s.applicant ? [s.applicant] : null },
    { label: '나이', lines: s.age ? [`만 ${s.age}세`] : null },
    { label: '장애', lines: disability ? [disability] : null },
    { label: '이미 신청', lines: appliedDone ? (applied.length ? applied : ['없음']) : null },
    { label: '가구·소득', lines: household },
  ]
}

/** 단계별로 꼭 골라야 하는 값을 다 골랐는지 ("해당하는 것"은 해당 없을 수 있어 제외) */
export function isStepComplete(step: number, s: Situation) {
  switch (step) {
    case 1:
      return Boolean(s.gu && s.dong && s.applicant)
    case 2:
      return Boolean(s.age && s.disabilityType && s.severity)
    case 3:
      return s.bundle.length > 0 && s.hasSeparate !== null
    case 4:
      return Boolean(s.basicLivelihood && s.income)
    default:
      return false
  }
}
