import { useState } from 'react'
import { CheckCard } from '../situation/CheckCard'
import type { Benefit, Office } from '../../data/results'
import type { WelfareIconKind } from '../../data/welfare'
import { Modal } from '../Modal'

// 결과 화면 복지 아이콘 → 체크 선택지용 20px 아이콘
const ICON_20: Record<Benefit['icon'], WelfareIconKind> = {
  therapy: 'therapy',
  care: 'care',
  counsel: 'counsel',
  childcare: 'childcare',
  education: 'education',
  transport: 'transport',
}

interface SubmitModalProps {
  office: Office
  benefits: Benefit[]
  onCancel: () => void
  onSubmit: (ids: string[]) => void
}

/** 26 낸 신청 고르기 (확인 창) — 고른 것만 심사 대기 중으로 바꿈 */
export function SubmitModal({ office, benefits, onCancel, onSubmit }: SubmitModalProps) {
  const [picked, setPicked] = useState(benefits.map((b) => b.id))
  const [today] = useState(() => new Date())
  const toggle = (id: string) => setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  return (
    <Modal titleId="submit-title" onClose={onCancel} zoom={0.9} className="flex max-w-[520px] flex-col gap-5 p-7">
      <div className="flex flex-col gap-1">
        <h2 id="submit-title" className="text-24 font-bold text-text-strong">
          오늘 낸 신청을 골라 주세요
        </h2>
        <p className="text-15 text-text-sub">
          {office.name} · {today.getMonth() + 1}월 {today.getDate()}일
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {benefits.map((b) => (
          <CheckCard key={b.id} checked={picked.includes(b.id)} label={b.name} icon={ICON_20[b.icon]} onToggle={() => toggle(b.id)} />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-12 w-28 shrink-0 items-center justify-center rounded-xl border border-border bg-surface px-5 text-15 font-medium text-text-strong hover:bg-bg-sidebar"
        >
          취소
        </button>
        <button
          type="button"
          disabled={picked.length === 0}
          onClick={() => onSubmit(picked)}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary px-5 text-15 font-bold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-sub"
        >
          {picked.length > 0 ? `${picked.length}건 심사 대기 중으로 바꾸기` : '고른 신청이 없어요'}
        </button>
      </div>
    </Modal>
  )
}

