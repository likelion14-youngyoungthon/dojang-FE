import benefitCareIcon from '../assets/icons/benefit-care.svg'
import benefitChildcareIcon from '../assets/icons/benefit-childcare.svg'
import benefitTherapyIcon from '../assets/icons/benefit-therapy.svg'

/** 복지 종류별 아이콘과 26px 안에서의 위치 (Figma: benefit/*) */
const BENEFIT = {
  therapy: { label: '치료·재활', src: benefitTherapyIcon, inset: 'inset-[25.19%_20.83%_18.75%_20.83%]', bleed: 'inset-[-6.5%_-6.25%]' },
  care: { label: '돌봄·활동', src: benefitCareIcon, inset: 'inset-[18.75%_18.75%_20.83%_18.75%]', bleed: 'inset-[-6.03%_-5.84%_-6.03%_-5.83%]' },
  childcare: { label: '보육', src: benefitChildcareIcon, inset: 'inset-[18.75%_16.67%_20.83%_16.67%]', bleed: 'inset-[-6.03%_-5.47%]' },
} as const

export type BenefitKind = keyof typeof BENEFIT

/** 복지 종류 아이콘 타일 (Figma: 복지 종류 아이콘 타일) */
export function BenefitIcon({ kind }: { kind: BenefitKind }) {
  const { label, src, inset, bleed } = BENEFIT[kind]
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-100" role="img" aria-label={label}>
      <span className="relative size-[26px]">
        <span className={`absolute ${inset}`}>
          <img src={src} alt="" className={`absolute block max-w-none ${bleed}`} />
        </span>
      </span>
    </span>
  )
}
