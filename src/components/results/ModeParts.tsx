import type { ReactNode } from 'react'
import alertWarnIcon from '../../assets/icons/alert-warn-14.svg'
import checkSuccessIcon from '../../assets/icons/check-success.svg'
import { EASY_ICONS, type EasyIconKind, type LargeBlock, type Verdict } from '../../data/results'

// ─────────────────────────────────────────────────────────────
// 5 맞춤 예시(M1·M2·M3·C1)에서 같이 쓰는 조각
// ─────────────────────────────────────────────────────────────

/** 큰 글씨 블록: 라벨 22 · 큰 값 32 · 덧붙임 24 (Figma: 큰 글씨 블록) */
export function LargeBlockView({ label, title, sub }: LargeBlock) {
  return (
    <div className="flex flex-col gap-1.5 break-keep">
      <p className="text-22 font-medium text-text-sub">{label}</p>
      <p className="text-32 font-bold text-text-strong">{title}</p>
      <p className="text-24 font-medium text-text">{sub}</p>
    </div>
  )
}

/** 그림 문장 한 줄 (Figma: 그림 문장 행) — lg는 72px 그림 칸, md는 56px */
export function EasyRow({ icon, text, size = 'lg' }: { icon?: EasyIconKind; text: string; size?: 'lg' | 'md' }) {
  const lg = size === 'lg'
  return (
    <li className={`flex items-center ${lg ? 'gap-5' : 'gap-4'}`}>
      <span className={`flex shrink-0 items-center justify-center bg-primary-100 ${lg ? 'size-[72px] rounded-2xl' : 'size-14 rounded-[14px]'}`}>
        {icon && <img src={EASY_ICONS[icon]} alt="" className={lg ? 'size-9' : 'size-7'} />}
      </span>
      <p className={`font-medium text-text-strong ${lg ? 'text-22' : 'text-19'}`}>{text}</p>
    </li>
  )
}

/** 연락 방법 행: 44px 아이콘 칸 + 이름·설명 (Figma: 연락 방법 행) */
export function ContactRow({ icon, title, description, compact = false }: { icon: string; title: string; description: string; compact?: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-100">
        <img src={icon} alt="" width={22} height={22} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-13 font-medium text-text-strong">{title}</p>
        <p className={compact ? 'text-15 text-text' : 'text-17 text-text'}>{description}</p>
      </div>
    </div>
  )
}

/** 판정 배지: 맞아요 / 확인 필요 */
export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const ok = verdict === 'ok'
  return (
    <span
      className={`inline-flex h-[26px] items-center gap-1 rounded-lg pr-2 pl-1.5 text-13 font-bold whitespace-nowrap ${
        ok ? 'bg-success-100 text-success' : 'bg-warn-100 text-warn'
      }`}
    >
      <img src={ok ? checkSuccessIcon : alertWarnIcon} alt="" width={14} height={14} />
      {ok ? '맞아요' : '확인 필요'}
    </span>
  )
}

/** 쉬운 말 그룹 카드 (Figma M3: 무엇을 해요 · 누가 받아요 · 알아 두세요) */
export function EasyGroupCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col gap-3.5 rounded-[20px] bg-surface px-6 py-5 shadow-card">
      <h2 className="text-17 font-bold text-primary">{title}</h2>
      <ul className="flex flex-col gap-3.5">{children}</ul>
    </section>
  )
}
