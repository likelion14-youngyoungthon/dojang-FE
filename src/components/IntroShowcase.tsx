import arrowRightIcon from '../assets/icons/arrow-right.svg'
import micIcon from '../assets/icons/mic.svg'
import { BenefitRow } from './BenefitRow'
import { ModeSwitch } from './ModeSwitch'

// 예시 화면 조각에 쓰는 고정 문구 (실제 데이터 아님)
const PREVIEW_ROWS = [
  { kind: 'therapy', title: '발달재활서비스 바우처', summary: '월 18만원' },
  { kind: 'care', title: '장애아가족양육지원', summary: '아이돌봄 지원' },
  { kind: 'childcare', title: '장애아 보육료 지원', summary: '장애아반 월 634,000원' },
] as const

/**
 * 시작 화면 오른쪽 파란 소개 면 (Figma: 소개 면)
 * 실제 화면 조각을 1.12배로 키워 보여 주는 장식 영역이라 화면낭독기에는 제목만 읽힘
 */
export function IntroShowcase({ showModeCaption = false }: { showModeCaption?: boolean }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center overflow-hidden bg-primary px-10 py-16 xl:py-0">
      <div className="flex flex-col items-start gap-10 [zoom:1.12]">
        <h2 className="text-40 font-bold text-on-primary">
          상황을 말하면
          <br />
          남은 신청만 알려 드려요
        </h2>

        <div className="flex flex-wrap items-center gap-4" aria-hidden>
          <div className="flex w-[296px] flex-col gap-2.5 rounded-2xl bg-surface p-5 drop-shadow-[0_4px_8px_rgb(25_31_40/0.05)]">
            <p className="flex items-center gap-1.5 text-13 font-medium text-text-sub">
              <img src={micIcon} alt="" width={16} height={16} />
              내가 한 말
            </p>
            <p className="text-15 whitespace-nowrap text-text-strong">
              아이가 <b className="text-primary">네 살</b>이고 <b className="text-primary">자폐 진단</b>을 받아서
              <br />
              이번에 장애 등록했어요.
              <br />
              <b className="text-primary">어린이집</b> 다니고 있어요.
            </p>
          </div>

          <span className="flex size-9 items-center justify-center rounded-[18px] bg-surface">
            <img src={arrowRightIcon} alt="" width={20} height={20} />
          </span>

          <div className="flex w-[376px] flex-col overflow-hidden rounded-2xl bg-surface shadow-[0_4px_16px_rgb(25_31_40/0.05),0_1px_2px_rgb(25_31_40/0.04)]">
            <div className="flex items-center gap-3 px-6 pt-[18px] pb-3.5">
              <div className="flex flex-col whitespace-nowrap">
                <p className="text-13 font-medium text-text-sub">남은 신청</p>
                <p className="flex items-baseline gap-0.5 text-text-strong">
                  <span className="text-40 font-bold">8</span>
                  <span className="text-17 font-medium">건</span>
                </p>
              </div>
              <span className="flex-1" />
              <span className="flex h-7 items-center rounded-lg bg-primary-100 px-2.5 text-13 font-bold whitespace-nowrap text-primary">
                백암면 한 번 방문으로 5건
              </span>
            </div>
            {PREVIEW_ROWS.map((row) => (
              <div key={row.title} className="border-t border-divider">
                <BenefitRow {...row} status="before" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4" aria-hidden>
          <div className="rounded-2xl bg-surface p-2 drop-shadow-[0_4px_8px_rgb(25_31_40/0.05)]">
            <ModeSwitch value="기본" />
          </div>
          {showModeCaption && <p className="text-15 text-on-primary">읽는 사람에 맞춰 화면이 바뀌어요</p>}
        </div>
      </div>
    </section>
  )
}
