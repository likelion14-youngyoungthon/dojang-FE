import type { Situation } from '../situation/SituationContext'
import type { ViewMode } from './viewModes'

export interface Persona {
  id: string
  age: number
  title: string
  summary: string
  /** 이 인물로 체험할 때 켜지는 맞춤 화면 */
  mode: ViewMode
  /** 사이드바 계정 행에 보이는 이름 (Figma: 체험 · 72세 어르신) */
  accountName: string
  /** 입력 화면을 건너뛰고 바로 채우는 상황 값 */
  situation: Partial<Situation>
  /** 이 인물의 남은 신청 (data/results의 id) */
  benefitIds: string[]
}

const BAEKAM = { gu: '처인구', dong: '백암면', hasSeparate: false } as const

/** 체험 인물 프리셋 — 서버 값이 아닌 프론트 고정 값 (Figma A1-2 라벨 · 5 맞춤 예시 참고) */
export const PERSONAS: Persona[] = [
  {
    id: 'senior-wheelchair',
    age: 72,
    title: '휠체어를 쓰는 어르신',
    summary: '보장구 수리비 지원',
    mode: '큰 글씨',
    accountName: '체험 · 72세 어르신',
    situation: {
      ...BAEKAM,
      applicant: '본인',
      age: '72',
      disabilityType: '지체장애',
      severity: '심한 장애',
      circumstances: ['휠체어를 써요'],
      householdSize: 1,
      basicLivelihood: '해당 없어요',
      income: 'under120',
    },
    benefitIds: ['assistive-repair'],
  },
  {
    id: 'parent-autism',
    age: 4,
    title: '자폐성 장애 아이의 엄마',
    summary: '발달재활서비스 바우처 등 8건',
    mode: '기본',
    accountName: '체험 · 4세 보호자',
    situation: {
      ...BAEKAM,
      applicant: '가족·보호자',
      age: '4',
      disabilityType: '자폐성장애',
      severity: '심한 장애',
      circumstances: ['어린이집에 다녀요'],
      // Figma 4세 예시: 등록 때 신청 2건
      bundle: ['reduction', 'parking'],
      householdSize: 3,
      basicLivelihood: '해당 없어요',
      income: 'under180',
    },
    benefitIds: [
      'rehab-voucher',
      'family-care',
      'parent-counsel',
      'support-plan',
      'childcare-fee',
      'special-education',
      'special-transport',
      'family-rest',
    ],
  },
  {
    id: 'adult-hearing',
    age: 35,
    title: '청각장애가 있는 성인',
    summary: '장애인 활동지원',
    mode: '문자·온라인',
    accountName: '체험 · 35세 청각장애',
    situation: {
      ...BAEKAM,
      applicant: '본인',
      age: '35',
      disabilityType: '청각장애',
      severity: '심한 장애',
      householdSize: 1,
      basicLivelihood: '해당 없어요',
      income: 'under180',
    },
    benefitIds: ['activity-support'],
  },
  {
    id: 'self-autism',
    age: 24,
    title: '자폐성 장애가 있는 본인',
    summary: '발달장애인 주간활동서비스',
    mode: '쉬운 말',
    accountName: '체험 · 24세 본인',
    situation: {
      ...BAEKAM,
      applicant: '본인',
      age: '24',
      disabilityType: '자폐성장애',
      severity: '심한 장애',
      householdSize: 3,
      basicLivelihood: '해당 없어요',
      income: 'under180',
    },
    benefitIds: ['day-activity'],
  },
]

export const getPersona = (id: string | null | undefined) => PERSONAS.find((p) => p.id === id) ?? null
