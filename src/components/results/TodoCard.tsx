import { useNavigate } from 'react-router'
import pinWhiteIcon from '../../assets/icons/pin-white.svg'
import sealPatternIcon from '../../assets/icons/seal-pattern.svg'
import type { Office } from '../../data/results'
import { PlaceTile } from './Tiles'

/** 오른쪽 "지금 할 일" 카드 — 가장 많이 몰린 접수처 한 곳 (Figma: 카드 · 지금 할 일) */
export function TodoCard({ office, count }: { office: Office; count: number }) {
  const navigate = useNavigate()
  return (
    <section aria-labelledby="todo-title" className="relative flex w-full flex-col gap-4 overflow-hidden rounded-[20px] bg-primary p-6 shadow-card">
      <img src={sealPatternIcon} alt="" width={280} height={280} className="pointer-events-none absolute -right-[130px] -bottom-40" />
      <h2 id="todo-title" className="relative text-13 font-bold text-on-primary">
        지금 할 일
      </h2>
      <p className="relative flex items-baseline gap-0.5 text-on-primary">
        <span className="text-[48px] leading-[56px] font-bold">{count}</span>
        <span className="text-20 font-medium">건</span>
      </p>
      <div className="relative flex items-center gap-3">
        <PlaceTile kind={office.icon} inverse />
        <p className="text-17 font-bold text-on-primary">{office.name}</p>
      </div>
      <div className="relative flex flex-col gap-2">
        <button
          type="button"
          onClick={() => navigate(`/results/prepare/${office.id}`)}
          className="flex h-12 items-center justify-center rounded-xl bg-surface px-5 text-15 font-medium text-primary hover:bg-primary-100"
        >
          창구에 가져갈 것 보기
        </button>
        <button
          type="button"
          onClick={() => navigate(`/results/locations?office=${office.id}`)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-on-primary px-5 text-15 font-medium text-on-primary hover:bg-white/10"
        >
          <img src={pinWhiteIcon} alt="" width={20} height={20} />
          위치 보기
        </button>
      </div>
    </section>
  )
}
