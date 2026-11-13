import { useState } from 'react'
import { categoryIcon, type ServiceItem } from '../../api/services'
import type { ApplicationProgress } from '../../data/welfare'
import { Modal } from '../Modal'
import { CheckCard } from './CheckCard'
import { StatusSegment } from './StatusSegment'

interface SeparateApplicationsModalProps {
  /** GET /services?age= 목록 */
  services: { items: ServiceItem[]; loading: boolean; error: string | null; retry: () => void }
  initial: Record<string, ApplicationProgress>
  onCancel: () => void
  onDone: (selected: Record<string, ApplicationProgress>) => void
}

function pairs<T>(list: T[]) {
  return Array.from({ length: Math.ceil(list.length / 2) }, (_, i) => list.slice(i * 2, i * 2 + 2))
}

/** 3/4 "그것 말고 따로 신청한 것" — 있어요를 고르면 뜨는 모달. 고른 것마다 지금 상태도 고름 */
export function SeparateApplicationsModal({ services, initial, onCancel, onDone }: SeparateApplicationsModalProps) {
  const [draft, setDraft] = useState(initial)
  const count = Object.keys(draft).length

  const toggle = (id: string) =>
    setDraft((prev) => {
      const next = { ...prev }
      if (id in next) delete next[id]
      else next[id] = '심사 대기 중'
      return next
    })

  return (
    <Modal titleId="separate-modal-title" onClose={onCancel} zoom={0.9} className="flex max-w-[720px] flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h2 id="separate-modal-title" className="text-24 font-bold text-text-strong">
          따로 신청한 것을 골라 주세요
        </h2>
        <p className="text-15 text-text-sub">여러 개 고를 수 있어요. 고른 것은 지금 상태도 알려 주세요.</p>
      </div>

      {services.loading && <p className="text-15 text-text-sub">목록을 불러오는 중이에요</p>}
      {services.error && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-15 text-text-sub">목록을 불러오지 못했어요. {services.error}</p>
          <button type="button" onClick={services.retry} className="text-15 font-medium text-primary underline">
            다시 시도
          </button>
        </div>
      )}
      <div className="grid items-start gap-2 sm:grid-cols-2">
        {pairs(services.items).map((row) => (
          <div key={row[0].id} className="contents">
            {row.map((item) => (
              <CheckCard key={item.id} checked={item.id in draft} label={item.name} icon={categoryIcon(item.category)} onToggle={() => toggle(item.id)} />
            ))}
            {row
              .filter((item) => item.id in draft)
              .map((item) => (
                <StatusSegment
                  key={`${item.id}-status`}
                  label={item.name}
                  value={draft[item.id]}
                  onChange={(status) => setDraft((prev) => ({ ...prev, [item.id]: status }))}
                />
              ))}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-14 w-[120px] shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-17 font-medium text-text-strong hover:bg-bg-sidebar"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => onDone(draft)}
          className="flex h-14 flex-1 items-center justify-center rounded-xl bg-primary text-17 font-bold text-white hover:bg-primary/90"
        >
          {count > 0 ? `${count}개 골랐어요` : '고른 게 없어요'}
        </button>
      </div>
    </Modal>
  )
}
