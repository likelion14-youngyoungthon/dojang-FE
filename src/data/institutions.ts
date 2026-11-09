export const INSTITUTION_CATEGORIES = ['활동지원', '발달재활', '보조기기', '취업·고용'] as const
export type InstitutionCategory = (typeof INSTITUTION_CATEGORIES)[number]

export interface Institution {
  id: string
  name: string
  category: InstitutionCategory
  area: string
  address: string
  /** 지도 일러스트 위 핀 위치(%). 없으면 위치 미확인 */
  pin?: { x: number; y: number }
  baseDate: string
}

// TODO: 기관 API 결과로 교체
export const INSTITUTIONS: Institution[] = [
  {
    id: 'yongin-welfare',
    name: '용인시장애인복지관',
    category: '활동지원',
    area: '처인구 마평동',
    address: '마평로 14',
    pin: { x: 37.7, y: 39.2 },
    baseDate: '2026-10-31',
  },
  {
    id: 'kead-yongin',
    name: '한국장애인고용공단 용인지사',
    category: '취업·고용',
    area: '처인구 역북동',
    address: '금령로 60',
    pin: { x: 57.7, y: 57.5 },
    baseDate: '2026-10-31',
  },
  {
    id: 'suji-daycare',
    name: '수지장애인주간보호센터',
    category: '발달재활',
    area: '수지구 풍덕천동',
    address: '풍덕천로 57',
    pin: { x: 82.7, y: 31.7 },
    baseDate: '2026-10-31',
  },
  {
    id: 'yongin-assistive',
    name: '용인시보조기기센터',
    category: '보조기기',
    area: '기흥구 영덕동',
    address: '영덕로 1',
    baseDate: '2026-10-31',
  },
  {
    id: 'yongin-dev-center',
    name: '용인시발달장애인지원센터',
    category: '발달재활',
    area: '처인구 삼가동',
    address: '중부대로 1199',
    baseDate: '2026-10-31',
  },
]

export interface InstitutionDetail {
  name: string
  status: string
  meta: string
  address: string
  distance: string
  transit: string
  services: string[]
  hours: string[]
  accessibility: string[]
  phone: string
}

// TODO: 기관 상세 API 결과로 교체
export const MOCK_INSTITUTION_DETAIL: InstitutionDetail = {
  name: '용인시 장애인직업재활시설 A',
  status: '운영 중',
  meta: '장애인 활동지원 · 직업 재활 · 자료 기준 2026-10-31',
  address: '경기도 용인시 수지구 광교로 123',
  distance: '거리 약 2.1km',
  transit: '버스로 약 20분',
  services: ['장애인 활동지원', '직업재활서비스', '직업훈련'],
  hours: ['월~금 09:00 ~ 18:00', '토·일·공휴일 휴무'],
  accessibility: ['휠체어 접근 가능', '주차장 있음', '장애인 화장실 2개', '엘리베이터 있음'],
  phone: '031-1234-5678',
}

/** 22 다른 동 탐색 — 읍면동별 참고 기관 */
export const EXPLORE_CATEGORIES = ['행정복지센터', '활동지원기관', '발달재활', '보조기기'] as const
export type ExploreCategory = (typeof EXPLORE_CATEGORIES)[number]

export interface ExploreInstitution {
  name: string
  category: ExploreCategory
  badge: string
  badgeTone: 'blue' | 'gray' | 'orange'
  address: string
  warning?: string
}

// TODO: 읍면동별 기관 API 결과로 교체 (현재는 모든 동에 같은 예시 사용)
export function getExploreInstitutions(dong: string): ExploreInstitution[] {
  return [
    {
      name: `${dong} 행정복지센터`,
      category: '행정복지센터',
      badge: '방문 접수',
      badgeTone: 'blue',
      address: `${dong} 둔전로 39`,
    },
    {
      name: '용인장애인종합복지관',
      category: '활동지원기관',
      badge: '방문·전화',
      badgeTone: 'gray',
      address: `${dong} (주소 확인 필요)`,
    },
    {
      name: `${dong.replace(/[읍면동]$/, '')} 발달재활센터`,
      category: '발달재활',
      badge: '확인 필요',
      badgeTone: 'orange',
      address: `${dong} 농서로 12`,
      warning: '좌표가 확인되지 않아 지도에는 표시되지 않아요.',
    },
  ]
}
