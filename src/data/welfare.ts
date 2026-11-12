import allowanceIcon from '../assets/icons/welfare/allowance.svg'
import assistiveIcon from '../assets/icons/welfare/assistive.svg'
import careIcon from '../assets/icons/welfare/care.svg'
import childcareIcon from '../assets/icons/welfare/childcare.svg'
import counselIcon from '../assets/icons/welfare/counsel.svg'
import educationIcon from '../assets/icons/welfare/education.svg'
import employmentIcon from '../assets/icons/welfare/employment.svg'
import medicalIcon from '../assets/icons/welfare/medical.svg'
import parkingIcon from '../assets/icons/welfare/parking.svg'
import reductionIcon from '../assets/icons/welfare/reduction.svg'
import sportsIcon from '../assets/icons/welfare/sports.svg'
import therapyIcon from '../assets/icons/welfare/therapy.svg'
import transportIcon from '../assets/icons/welfare/transport.svg'

/** 20px 복지 아이콘과 20px 칸 안에서의 위치 (Figma: 복지 아이콘) */
export const WELFARE_ICONS = {
  reduction: { src: reductionIcon, inset: 'inset-[18.75%_25%]', bleed: 'inset-[-5.83%_-7.29%]' },
  parking: { src: parkingIcon, inset: 'inset-[18.75%]', bleed: 'inset-[-5.83%]' },
  care: { src: careIcon, inset: 'inset-[18.75%_18.75%_20.83%_18.75%]', bleed: 'inset-[-6.03%_-5.83%]' },
  assistive: { src: assistiveIcon, inset: 'inset-[16.67%_20.83%_16.67%_22.92%]', bleed: 'inset-[-5.47%_-6.48%]' },
  counsel: { src: counselIcon, inset: 'inset-[20.83%_16.67%_20.83%_16.66%]', bleed: 'inset-[-6.25%_-5.47%]' },
  medical: { src: medicalIcon, inset: 'inset-[18.75%]', bleed: 'inset-[-5.83%]' },
  transport: { src: transportIcon, inset: 'inset-[20.83%_16.67%_17.5%_16.67%]', bleed: 'inset-[-5.91%_-5.47%]' },
  employment: { src: employmentIcon, inset: 'inset-[20.83%_14.58%]', bleed: 'inset-[-6.25%_-5.15%]' },
  therapy: { src: therapyIcon, inset: 'inset-[25.19%_20.83%_18.75%_20.83%]', bleed: 'inset-[-6.5%_-6.25%]' },
  allowance: { src: allowanceIcon, inset: 'inset-[14.58%]', bleed: 'inset-[-5.15%]' },
  childcare: { src: childcareIcon, inset: 'inset-[18.75%_16.67%_20.83%_16.67%]', bleed: 'inset-[-6.03%_-5.47%]' },
  education: { src: educationIcon, inset: 'inset-[22.57%_16.67%_20.83%_16.67%]', bleed: 'inset-[-6.44%_-5.47%]' },
  sports: { src: sportsIcon, inset: 'inset-[35.42%_16.67%]', bleed: 'inset-[-12.5%_-5.47%]' },
} as const

export type WelfareIconKind = keyof typeof WELFARE_ICONS

export interface WelfareItem {
  id: string
  /** 화면에 보이는 짧은 이름 */
  name: string
  /** 공식 제도명 */
  official?: string
  icon: WelfareIconKind
}

// TODO: 서버의 제도 목록으로 교체
/** 장애 등록할 때 같이 신청하는 것 */
export const REGISTRATION_BUNDLE: WelfareItem[] = [
  { id: 'reduction', name: '감면 서비스 7종', official: '감면서비스 대행 7종', icon: 'reduction' },
  { id: 'parking', name: '장애인 자동차 표지', official: '장애인사용자동차등표지', icon: 'parking' },
  { id: 'activity', name: '장애인 활동지원', official: '장애인활동지원', icon: 'care' },
  { id: 'assistive', name: '장애인 보조기구', official: '장애인보조기구 교부', icon: 'assistive' },
  { id: 'support-plan', name: '발달장애인 개인별지원계획', official: '발달장애인 개인별지원계획', icon: 'counsel' },
  { id: 'diagnosis', name: '진단서 발급비·검사비', official: '저소득 장애인 진단서 발급비 및 검사비', icon: 'medical' },
  { id: 'highway', name: '고속도로 통행료 할인', official: '고속도로 통행료 할인', icon: 'transport' },
  { id: 'employment', name: '고용 서비스 연결', official: '타기관 서비스 의뢰(고용)', icon: 'employment' },
]

/** 그것 말고 따로 신청하는 것 */
export const SEPARATE_APPLICATIONS: WelfareItem[] = [
  { id: 'child-allowance', name: '장애아동수당', icon: 'allowance' },
  { id: 'rehab-voucher', name: '발달재활서비스 바우처', icon: 'therapy' },
  { id: 'family-care', name: '장애아가족양육지원', icon: 'care' },
  { id: 'parent-counsel', name: '발달장애인 부모상담지원', icon: 'counsel' },
  { id: 'family-rest', name: '발달장애인 가족휴식지원', icon: 'care' },
  { id: 'childcare-fee', name: '장애아 보육료 지원', icon: 'childcare' },
  { id: 'special-education', name: '특수교육대상자 선정·배치', icon: 'education' },
  { id: 'special-transport', name: '특별교통수단 이용등록', icon: 'transport' },
  { id: 'sports-voucher', name: '장애인스포츠강좌이용권', icon: 'sports' },
]

export const APPLICATION_STATUSES = ['심사 대기 중', '결과 나옴', '이용 중'] as const
export type ApplicationProgress = (typeof APPLICATION_STATUSES)[number]
