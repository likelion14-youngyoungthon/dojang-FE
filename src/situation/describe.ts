import { getIncomeBrackets } from '../data/profileOptions'
import type { Situation } from './SituationContext'

// 상황을 아직 안 고른 채 결과 화면을 열었을 때 보여 줄 Figma 예시 값
const FALLBACK = { age: '만 4세', disability: '자폐성 장애', dong: '백암면', income: '월 964만 원 이하' }

export function describeAge(s: Situation) {
  return s.age ? `만 ${s.age}세` : FALLBACK.age
}

export function describeDisability(s: Situation) {
  if (!s.disabilityType || s.disabilityType === '잘 모르겠어요') return FALLBACK.disability
  return s.disabilityType.replace(/장애$/, ' 장애')
}

export function describeIncome(s: Situation) {
  const bracket = s.income && s.income !== 'unknown' ? getIncomeBrackets(s.householdSize).find((b) => b.value === s.income) : null
  return bracket?.label ?? FALLBACK.income
}

/** 남은 신청 제목 옆 한 줄 요약: 만 4세 · 자폐성 장애 · 백암면 */
export function describeSituation(s: Situation) {
  return [describeAge(s), describeDisability(s), s.dong ?? FALLBACK.dong].join(' · ')
}
