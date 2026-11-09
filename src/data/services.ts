import type { BadgeTone } from '../components/Badge'

export type ServiceStatus = 'before' | 'progress' | 'check'

export const STATUS_META: Record<ServiceStatus, { tab: string; badge: string; tone: BadgeTone }> = {
  before: { tab: '신청 전', badge: '신청 전', tone: 'gray' },
  progress: { tab: '진행 중', badge: '접수·결과 대기', tone: 'blue' },
  check: { tab: '확인 필요', badge: '확인 필요', tone: 'orange' },
}

export interface Service {
  id: string
  name: string
  /** 접수 기관 그룹 */
  office: string
  status: ServiceStatus
  target: string
  summary: string
  dataDate: string
}

// TODO: 추천 API 결과로 교체
export const MOCK_USER = {
  name: '이민지',
  profile: '지체장애(심한 장애) · 성인',
  region: '용인시 기흥구',
  analyzedAt: '2026년 11월 9일',
}

export const SERVICES: Service[] = [
  {
    id: 'disability-pension',
    name: '장애인연금',
    office: '행정복지센터 접수',
    status: 'check',
    target: '만 18세 이상 · 심한 장애 등록',
    summary: '소득인정액 조건이 아직 확인되지 않았어요',
    dataDate: '2026-11-01',
  },
  {
    id: 'activity-support',
    name: '장애인 활동지원',
    office: '행정복지센터 접수',
    status: 'progress',
    target: '사용자 입력 기준',
    summary: '신청서 제출 완료 · 결과를 기다리는 중이에요',
    dataDate: '2026-11-01',
  },
  {
    id: 'telecom-discount',
    name: '장애인 통신요금 감면',
    office: '행정복지센터 접수',
    status: 'before',
    target: '등록장애인 공통',
    summary: '다음 할 일: 행정복지센터 또는 통신사에 신청',
    dataDate: '2026-11-01',
  },
  {
    id: 'medical-support',
    name: '장애인 의료비 지원',
    office: '행정복지센터 접수',
    status: 'check',
    target: '의료급여 2종·차상위 대상',
    summary: '수급 상태가 아직 확인되지 않았어요',
    dataDate: '2026-11-01',
  },
  {
    id: 'assistive-devices',
    name: '장애인 보조기기 급여',
    office: '국민건강보험공단 접수',
    status: 'check',
    target: '장애 유형별 품목 조건',
    summary: '품목과 처방전 필요 여부를 확인해야 해요',
    dataDate: '2026-11-01',
  },
  {
    id: 'special-transport',
    name: '특별교통수단 이용등록',
    office: '용인시 교통약자 이동지원센터 접수',
    status: 'before',
    target: '이동이 어려운 심한 장애',
    summary: '다음 할 일: 이동지원센터에 이용 등록 신청',
    dataDate: '2026-11-01',
  },
]

export interface ServiceDetail {
  meta: string
  reason: string
  reasonSource: string
  conditions: string[]
  documents: { common: string[]; optional: string[] }
  sources: string[]
  offices: { label: string; value: string }[]
}

// TODO: 상세 API 결과로 교체. 현재는 활동지원만 상세 데이터가 있음
export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  'activity-support': {
    meta: '신청 접수: 주소지 행정복지센터 · 방문조사: 국민연금공단 용인지사 · 최종 확인일 2026-10-31',
    reason:
      '혼자 출퇴근하면서 이동과 일상생활에 도움이 필요하다고 말씀하셨어요. 활동지원은 만 6세 이상 65세 미만 등록장애인이 신청할 수 있어요.',
    reasonSource: '장애인활동 지원에 관한 법률 제5조',
    conditions: [
      '활동지원 수급자격 심사(인정조사) 결과',
      '노인장기요양보험 급여 수급 여부',
      '소득 수준 (본인부담금 산정)',
    ],
    documents: {
      common: ['사회보장급여 신청서', '장애인등록증 또는 복지카드', '신분증'],
      optional: ['건강보험료 납부 확인서 (소득 확인이 필요한 경우)'],
    },
    sources: ['장애인활동 지원에 관한 법률 제5조 (신청 자격)', '보건복지부 장애인활동지원 사업안내'],
    offices: [
      { label: '접수', value: '주소지 읍·면·동 행정복지센터' },
      { label: '방문조사', value: '국민연금공단 용인지사' },
      { label: '접수 방법', value: '방문 또는 복지로 온라인 신청' },
    ],
  },
}

export function getServiceDetail(service: Service): ServiceDetail {
  return (
    SERVICE_DETAILS[service.id] ?? {
      meta: `신청 접수: ${service.office.replace(' 접수', '')} · 최종 확인일 ${service.dataDate}`,
      reason: `${service.target} 조건을 바탕으로 추천했어요.`,
      reasonSource: '관련 법령 및 사업안내',
      conditions: [service.summary],
      documents: { common: ['사회보장급여 신청서', '장애인등록증 또는 복지카드', '신분증'], optional: [] },
      sources: ['보건복지부 장애인 복지사업 안내'],
      offices: [{ label: '접수', value: service.office.replace(' 접수', '') }],
    }
  )
}
