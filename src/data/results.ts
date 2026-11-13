import careIcon from '../assets/icons/benefit/care.svg'
import childcareIcon from '../assets/icons/benefit/childcare.svg'
import counselIcon from '../assets/icons/benefit/counsel.svg'
import educationIcon from '../assets/icons/benefit/education.svg'
import therapyIcon from '../assets/icons/benefit/therapy.svg'
import transportIcon from '../assets/icons/benefit/transport.svg'
import buildingIcon from '../assets/icons/easy/building-28.svg'
import calendarIcon from '../assets/icons/easy/calendar-28.svg'
import homeIcon from '../assets/icons/easy/home-28.svg'
import hourglassIcon from '../assets/icons/easy/hourglass.svg'
import moneyIcon from '../assets/icons/easy/money.svg'
import sunIcon from '../assets/icons/easy/sun.svg'
import ticketIcon from '../assets/icons/easy/ticket.svg'
import userCheckIcon from '../assets/icons/easy/user-check.svg'
import usersIcon from '../assets/icons/easy/users-28.svg'
import placeEducationIcon from '../assets/icons/place/education-white.svg'
import placeOfficeIcon from '../assets/icons/place/office-white.svg'
import placeRecruitIcon from '../assets/icons/place/recruit-white.svg'
import placeTransportIcon from '../assets/icons/place/transport-white.svg'
import type { JudgeResult } from '../api/judge'
import type { ApiOffice } from '../api/offices'

// ─────────────────────────────────────────────────────────────
// TODO: POST /judge · GET /offices 결과로 교체. 지금은 Figma "3 결과" 예시 값
// ─────────────────────────────────────────────────────────────

/** 22px 복지 아이콘 (40px 타일 안) */
export const BENEFIT_ICONS = {
  therapy: { src: therapyIcon, inset: 'inset-[25.19%_20.83%_18.75%_20.83%]', bleed: 'inset-[-6.5%_-6.25%]' },
  care: { src: careIcon, inset: 'inset-[18.75%_18.75%_20.83%_18.75%]', bleed: 'inset-[-6.03%_-5.84%_-6.03%_-5.83%]' },
  counsel: { src: counselIcon, inset: 'inset-[20.83%_16.66%]', bleed: 'inset-[-6.25%_-5.47%]' },
  childcare: { src: childcareIcon, inset: 'inset-[18.75%_16.67%_20.83%_16.67%]', bleed: 'inset-[-6.03%_-5.47%]' },
  education: { src: educationIcon, inset: 'inset-[22.57%_16.67%_20.83%_16.67%]', bleed: 'inset-[-6.44%_-5.47%]' },
  transport: { src: transportIcon, inset: 'inset-[20.83%_16.67%_17.5%_16.67%]', bleed: 'inset-[-5.91%_-5.47%]' },
} as const
export type BenefitIconKind = keyof typeof BENEFIT_ICONS

/** 24px 장소 아이콘 (48px 타일 안) */
export const PLACE_ICONS = {
  office: { src: placeOfficeIcon, inset: 'inset-[18.75%_12.5%_16.67%_12.5%]', bleed: 'inset-[-5.65%_-4.86%]' },
  education: { src: placeEducationIcon, inset: 'inset-[20.83%_10.42%_24.17%_10.42%]', bleed: 'inset-[-6.63%_-4.61%]' },
  transport: { src: placeTransportIcon, inset: 'inset-[22.92%_16.67%_20%_16.67%]', bleed: 'inset-[-6.39%_-5.47%]' },
  recruit: { src: placeRecruitIcon, inset: 'inset-[14.58%_16.67%_16.67%_16.67%]', bleed: 'inset-[-5.3%_-5.47%]' },
} as const
export type PlaceIconKind = keyof typeof PLACE_ICONS

export type ResultStatus = 'before' | 'check' | 'recruit'

export interface Office {
  id: string
  name: string
  /** 신청 단계에 쓰는 짧은 이름 (행정복지센터 신청) */
  kind: string
  icon: PlaceIconKind
  phone: string
  /** 줄 바꿈 위치까지 디자인대로 */
  addressLines: string[]
  /** 지도 핀 좌표 (GET /offices). 없으면 지도에 핀 없이 목록에만 보임 */
  lat: number | null
  lng: number | null
}

export const OFFICES: Office[] = [
  { id: 'dong_center', name: '백암면 행정복지센터', kind: '행정복지센터', icon: 'office', phone: '031-6193-5792', addressLines: ['경기도 용인시 처인구', '백암면 백암로 189'], lat: 37.16396, lng: 127.375365 },
  { id: 'education_office', name: '용인교육지원청', kind: '교육지원청', icon: 'education', phone: '031-8020-9113', addressLines: ['경기도 용인시 처인구', '중부대로1161번길 69'], lat: 37.2426232, lng: 127.1797311 },
  { id: 'mobility_center', name: '용인시 교통약자이동지원센터', kind: '이동지원센터', icon: 'transport', phone: '1666-0420', addressLines: ['경기도 용인시 처인구 동백죽전대로 61', '(용인미르스타디움)'], lat: 37.249624, lng: 127.165149 },
]

export interface Document {
  name: string
  note: string
}

export interface Reason {
  condition: string
  criteria: string
  /** 내 상황 칸 — 상황 값에서 채움 (Figma 예시) */
  field?: 'age' | 'disability' | 'income'
  /** 내 상황 칸 — judge conditions[].value (있으면 이 값) */
  value?: string | null
  /** 판정 — judge conditions[].met: true 맞아요 · false 맞지 않아요 · null 확인 필요 (예시 값은 없음 = 맞아요) */
  met?: boolean | null
}

export interface Evidence {
  quote: string[]
  tag: string
  kind: '지원대상' | '지원내용'
}

/** 쉬운 말 그림 문장에 쓰는 그림 (Figma: 그림 칸) */
export const EASY_ICONS = {
  sun: sunIcon,
  ticket: ticketIcon,
  userCheck: userCheckIcon,
  money: moneyIcon,
  hourglass: hourglassIcon,
  users: usersIcon,
  home: homeIcon,
  calendar: calendarIcon,
  building: buildingIcon,
} as const
export type EasyIconKind = keyof typeof EASY_ICONS

/** 큰 글씨 블록: 라벨 · 큰 값 · 덧붙임 (Figma: 큰 글씨 블록) */
export interface LargeBlock {
  label: string
  title: string
  sub: string
}

/** 판정 칸: 맞아요 / 확인 필요 */
export type Verdict = 'ok' | 'check'

export interface Benefit {
  id: string
  name: string
  /** 복지 아이콘 — judge category. 없으면 숨김 */
  icon?: BenefitIconKind
  summary: string
  /** 주황색으로 덧붙는 확인할 것 */
  checkNote?: string
  status: ResultStatus
  /** 모집 기간 항목은 접수처 없음 */
  officeId: string | null
  detail?: {
    amount?: { label: string; value: string }[]
    /** 없으면 기본 요약(무엇을 · 접수처) */
    rows?: { label: string; value: string }[]
    reasons: Reason[]
    evidence: { source: string; checkedAt: string; items: Evidence[] } | null
    onlineUrl?: string
  }
  documents?: Document[]
  /** 받는 것 — judge benefit: 큰 글자 amount / 작은 글자 note (대응표 8번) */
  benefitAmount?: { amount: string; note: string | null } | null
  /** 창구에서 쓰는 신청서 이름 (judge form_names). 없으면 '서비스명 신청서' */
  formNames?: string[]
  /** 제목 아래 한 줄 설명 (큰 글씨·쉬운 말) */
  tagline?: string
  /** 큰 글씨 화면 (Figma M1) — TODO: GET /services/{id}/steps */
  large?: {
    gets: LargeBlock
    note?: string
    result?: LargeBlock
    steps?: string[]
  }
  /** 문자·온라인 화면 (Figma M2) 예시 값 — 판정 결과는 judge online·benefit·form_names로 채움 */
  textOnline?: {
    facts: { label: string; value: string; unit?: string }[]
    /** 창구에서 쓰는 신청서 이름 (줄 바꿈 위치까지) */
    form: string[]
    reasons: { condition: string; criteria: string; mine: string; verdict: Verdict }[]
  }
  /** 쉬운 말 화면 (Figma M3) — TODO: 서버 필드 easy_sentences(쉬운 말 문장) 추가 필요 */
  easy?: {
    groups: { title: string; items: { icon: EasyIconKind; text: string }[] }[]
    glossary?: { word: string; meaning: string }
  }
}

export const BENEFITS: Benefit[] = [
  {
    id: 'rehab-voucher',
    name: '발달재활서비스 바우처',
    icon: 'therapy',
    summary: '월 18만원 · 본인부담 8만원',
    status: 'before',
    officeId: 'dong_center',
    detail: {
      amount: [
        { label: '지원 금액', value: '18' },
        { label: '본인부담', value: '8' },
      ],
      rows: [
        { label: '무엇을', value: '언어·놀이·감각 등 발달재활 치료비 이용권' },
        { label: '기한', value: '상시' },
        { label: '준비 서류', value: '발달재활서비스 의뢰서 · 장애 진단서' },
        { label: '알아둘 점', value: '9세 미만은 의뢰서와 검사자료로 진단서를 대신할 수 있어요' },
      ],
      reasons: [
        { condition: '나이', criteria: '18세 미만', field: 'age' },
        { condition: '장애 유형', criteria: '뇌병변·지적·자폐성 등 6가지', field: 'disability' },
        { condition: '소득', criteria: '기준 중위소득 180% 이하', field: 'income' },
      ],
      evidence: {
        source: '복지로',
        checkedAt: '2026-11-08',
        items: [
          { quote: ['18세 미만 장애아동을 대상으로 합니다.'], tag: '나이', kind: '지원대상' },
          {
            quote: ['(기타요건) 장애인복지법상 등록장애아동', '(뇌병변, 지적, 자폐성, 청각, 언어, 시각장애)'],
            tag: '장애 유형',
            kind: '지원대상',
          },
          { quote: ['기준중위소득 180% 이하: 월 18만원(본인부담금 8만원)'], tag: '소득', kind: '지원내용' },
        ],
      },
      onlineUrl: 'https://www.bokjiro.go.kr',
    },
    documents: [
      { name: '발달재활서비스 의뢰서', note: '발달재활서비스 바우처' },
      { name: '장애 진단서', note: '발달재활서비스 바우처 · 9세 미만은 의뢰서와 검사자료로 대신할 수 있어요' },
    ],
  },
  { id: 'family-care', name: '장애아가족양육지원', icon: 'care', summary: '아이돌봄 지원', status: 'before', officeId: 'dong_center' },
  { id: 'parent-counsel', name: '발달장애인 부모상담지원', icon: 'counsel', summary: '부모 상담 12개월', status: 'before', officeId: 'dong_center' },
  { id: 'support-plan', name: '발달장애인 개인별지원계획', icon: 'counsel', summary: '필요한 지원 계획 세우기', status: 'before', officeId: 'dong_center' },
  { id: 'childcare-fee', name: '장애아 보육료 지원', icon: 'childcare', summary: '장애아반 월 634,000원', status: 'before', officeId: 'dong_center' },
  {
    id: 'special-education',
    name: '특수교육대상자 선정·배치',
    icon: 'education',
    summary: '만 3~17세 의무교육',
    checkNote: '진단평가',
    status: 'check',
    officeId: 'education_office',
  },
  {
    id: 'special-transport',
    name: '특별교통수단 이용등록',
    icon: 'transport',
    summary: '장애인 콜택시 1,700원부터',
    checkNote: '보행 어려움 서류',
    status: 'check',
    officeId: 'mobility_center',
  },
  { id: 'family-rest', name: '발달장애인 가족휴식지원', icon: 'care', summary: '모집 시기 확인', status: 'recruit', officeId: null },

  // ── 5 맞춤 예시 인물의 신청 (Figma M1 · M2 · M3 · C1)
  {
    id: 'assistive-repair',
    name: '보장구 수리비 지원',
    icon: 'care',
    summary: '수리비의 절반 · 1년에 10만원까지',
    status: 'before',
    officeId: 'dong_center',
    tagline: '휠체어와 전동스쿠터 수리비를 도와줘요.',
    large: {
      gets: { label: '받는 돈', title: '수리비의 절반', sub: '1년에 10만원까지' },
      note: '기초생활수급·차상위는 전부, 1년에 20만원까지',
      steps: ['행정복지센터에서 신청서를 써요', '수리 의뢰서를 받아요', '지정 수리업체에 맡겨요'],
    },
  },
  {
    id: 'activity-support',
    name: '장애인 활동지원',
    icon: 'care',
    summary: '월 이용권 · 6~64세',
    status: 'before',
    officeId: 'dong_center',
    tagline: '도와주는 사람이 집에 와서 집안일과 외출을 도와줘요.',
    detail: {
      rows: [
        { label: '무엇을', value: '활동지원사의 집안일·외출 도움 이용권' },
        { label: '기한', value: '상시' },
      ],
      reasons: [],
      evidence: null,
      onlineUrl: 'https://www.bokjiro.go.kr',
    },
    large: {
      gets: { label: '받는 것', title: '도와주는 사람이 와요', sub: '집안일과 외출을 도와줘요' },
      result: { label: '결과', title: '30일 안에 정해져요', sub: '신청서를 낸 날부터' },
    },
    textOnline: {
      facts: [
        { label: '받는 것', value: '월 이용권' },
        { label: '나이', value: '6~64세' },
        { label: '소득', value: '상관없음' },
        { label: '심의', value: '30', unit: '일 이내' },
      ],
      form: ['사회보장급여(사회서비스이용권)', '신청(변경)서'],
      reasons: [
        { condition: '나이', criteria: '6~64세', mine: '35세', verdict: 'ok' },
        { condition: '활동지원등급', criteria: '종합조사로 정해요', mine: '신청 뒤 방문 조사', verdict: 'check' },
      ],
    },
    easy: {
      groups: [
        {
          title: '무엇을 해요',
          items: [
            { icon: 'users', text: '도와주는 사람이 집에 와요.' },
            { icon: 'home', text: '집안일과 외출을 도와줘요.' },
          ],
        },
        {
          title: '누가 받아요',
          items: [
            { icon: 'userCheck', text: '6살부터 64살까지 받아요.' },
            { icon: 'money', text: '버는 돈과 상관없이 받아요.' },
          ],
        },
        {
          title: '알아 두세요',
          items: [
            { icon: 'calendar', text: '30일 안에 정해져요.' },
            { icon: 'building', text: '행정복지센터에서 신청해요.' },
          ],
        },
      ],
      glossary: { word: '이용권', meaning: '정해진 곳에서 돈 대신 쓰는 표예요.' },
    },
  },
  {
    id: 'day-activity',
    name: '발달장애인 주간활동서비스',
    icon: 'care',
    summary: '낮 활동 · 한 달 132시간 또는 176시간',
    status: 'before',
    officeId: 'dong_center',
    tagline: '낮에 사람들과 함께 활동하는 서비스예요.',
    easy: {
      groups: [
        {
          title: '무엇을 해요',
          items: [
            { icon: 'sun', text: '낮에 여러 사람과 함께 활동해요.' },
            { icon: 'ticket', text: '한 달에 132시간이나 176시간 써요.' },
          ],
        },
        {
          title: '누가 받아요',
          items: [
            { icon: 'userCheck', text: '18살부터 64살까지 받아요.' },
            { icon: 'money', text: '돈을 얼마나 벌어도 받을 수 있어요.' },
          ],
        },
        { title: '알아 두세요', items: [{ icon: 'hourglass', text: '자리가 없으면 기다려야 해요.' }] },
      ],
      glossary: { word: '이용권', meaning: '정해진 곳에서 돈 대신 쓰는 표예요.' },
    },
  },
]

/** 로그인 사용자(체험 인물이 아닐 때)의 남은 신청 — TODO: POST /judge 결과로 교체 */
export const DEFAULT_BENEFIT_IDS = [
  'rehab-voucher',
  'family-care',
  'parent-counsel',
  'support-plan',
  'childcare-fee',
  'special-education',
  'special-transport',
  'family-rest',
]

/** 나중에 가능 — Figma에 펼친 모습이 없어 이름만 예시로 둠 */
export const LATER_BENEFITS = ['장애인연금', '발달장애인 주간활동서비스', '장애인 일자리 지원', '발달장애인 자립지원']

export const STATUS_TABS = [
  { value: 'all', label: '전체' },
  { value: 'before', label: '신청 전' },
  { value: 'check', label: '확인 필요' },
  { value: 'recruit', label: '모집 기간' },
] as const
export type StatusTab = (typeof STATUS_TABS)[number]['value']

// ─────────────────────────────────────────────────────────────
// POST /judge 결과 → 화면 데이터
// 서버가 정하는 것: 보이는 항목·상태·접수처. 아이콘·한 줄 설명·상세 내용은
// 서버 필드(category·short_desc 등)가 [추가 예정]이라 같은 서비스의 Figma 예시 값을 빌려 씀
// ─────────────────────────────────────────────────────────────

/** 온라인 신청 안내 주소 — Figma 예시와 같은 복지로 첫 화면 */
const BOKJIRO_URL = 'https://www.bokjiro.go.kr'

/** 대응표 6번: office.id → 장소 아이콘 */
const OFFICE_ICON: Record<string, PlaceIconKind> = { education_office: 'education', mobility_center: 'transport' }

export interface LaterBenefit {
  name: string
  /** 이 나이부터 */
  age: number
}

export interface JudgeView {
  /** 남은 신청 (신청 전 · 확인 필요 · 추가 서류 · 공고 대기) */
  benefits: Benefit[]
  /** 남은 신청이 있는 접수처 — GET /offices 순서 */
  offices: Office[]
  /** 나중에 가능 — 나이 순 */
  later: LaterBenefit[]
}

/** 서버 주소(경기도 용인시 처인구 백암면 백암로 189)를 두 줄로 */
function splitAddress(address: string | null | undefined) {
  if (!address) return []
  const m = address.match(/^(\S+ \S+ \S+구) (.+)$/)
  return m ? [m[1], m[2]] : [address]
}

/** apiOffices: GET /offices?dong= (주소). judge office에는 이름·전화만 있음 */
export function toJudgeView(result: JudgeResult, apiOffices: ApiOffice[]): JudgeView {
  const items = Object.values(result)
  const later = items
    .filter((i) => i.verdict === 'not_eligible' && i.eligible_from_age != null && !i.hidden)
    .map((i) => ({ name: i.name, age: i.eligible_from_age! }))
    .sort((a, b) => a.age - b.age)

  const benefits: Benefit[] = items
    .filter((i) => !i.hidden && i.verdict !== 'not_eligible' && (i.status === 'apply' || i.status === 'check' || i.status === 'extra_form'))
    .map((i): Benefit => {
      const recruit = i.office.id === 'provider'
      return {
        id: i.id,
        name: i.name,
        // 대응표 8번: judge 필드를 그대로 씀. null이면 숨김
        icon: i.category && i.category in BENEFIT_ICONS ? (i.category as BenefitIconKind) : undefined,
        summary: i.short_desc ?? '',
        checkNote: i.check_reason ?? undefined,
        tagline: i.description ?? undefined,
        benefitAmount: i.benefit,
        status: recruit ? 'recruit' : i.status === 'apply' ? 'before' : 'check',
        officeId: recruit ? null : i.office.id,
        detail: {
          reasons: (i.conditions ?? []).map((c) => ({ condition: c.label, criteria: c.rule, value: c.value, met: c.met })),
          evidence: null,
          // 문자·온라인: online이 true일 때만 복지로 신청 안내 (basis.sources는 지원정보 페이지라 신청 주소로 쓰지 않음)
          onlineUrl: i.online ? BOKJIRO_URL : undefined,
        },
        // 26 가져갈 것: judge 결과 재사용 (대응표 1번)
        documents: i.documents.map((name) => ({ name, note: i.name })),
        formNames: i.form_names,
      }
    })

  const used = new Set(benefits.map((b) => b.officeId).filter(Boolean))
  const judgeOffice = new Map(items.map((i) => [i.office.id, i.office]))
  const order = [...apiOffices.map((o) => o.id), ...judgeOffice.keys()]
  const offices = [...new Set(order)]
    .filter((id) => used.has(id))
    .map((id): Office => {
      const api = apiOffices.find((o) => o.id === id)
      const name = api?.name ?? judgeOffice.get(id)?.name ?? id
      return {
        id,
        name,
        kind: id === 'dong_center' ? '행정복지센터' : name,
        icon: OFFICE_ICON[id] ?? 'office',
        phone: api?.phone ?? judgeOffice.get(id)?.phone ?? '',
        addressLines: splitAddress(api?.address),
        lat: api?.lat ?? null,
        lng: api?.lng ?? null,
      }
    })

  return { benefits, offices, later }
}

// ponytail: 지금 결과를 모듈 변수로 둬서 getBenefit·getOffice를 부르는 화면을 그대로 씀 (ResultsProvider가 채움)
let live: JudgeView | null = null
export const setLiveView = (view: JudgeView | null) => {
  live = view
}

export const getOffice = (id: string | null) => (live?.offices ?? OFFICES).find((o) => o.id === id) ?? null
export const getBenefit = (id: string | undefined) => (live?.benefits ?? BENEFITS).find((b) => b.id === id) ?? null
