import { useState } from 'react'
import { CheckCard } from '../components/situation/CheckCard'
import { ChoiceButton } from '../components/situation/ChoiceButton'
import { Field } from '../components/situation/Field'
import { SeparateApplicationsModal } from '../components/situation/SeparateApplicationsModal'
import { SituationLayout } from '../components/situation/SituationLayout'
import { WelfareIcon } from '../components/situation/WelfareIcon'
import { regItemIcon, useRegItems } from '../api/regItems'
import { categoryIcon, useServiceList } from '../api/services'
import { useSituation } from '../situation/SituationContext'

const UNKNOWN = 'unknown'

/** 3/4 · 10 이미 신청한 것 (API: GET /reg-items · '있어요'를 고를 때 GET /services?age=) — "있어요"를 고르면 모달에서 목록과 상태를 고름 */
export function AppliedPage() {
  const { situation, update } = useSituation()
  const { bundle, hasSeparate, separate } = situation
  const [modalOpen, setModalOpen] = useState(false)
  const regItems = useRegItems()
  const services = useServiceList(situation.age)
  const chosen = services.items.filter((w) => w.id in separate)

  const toggleBundle = (id: string) => {
    if (id === UNKNOWN) return update({ bundle: bundle.includes(UNKNOWN) ? [] : [UNKNOWN] })
    const without = bundle.filter((x) => x !== UNKNOWN && x !== id)
    update({ bundle: bundle.includes(id) ? without : [...without, id] })
  }

  return (
    <SituationLayout step={3} title="이미 신청한 것을 알려 주세요">
      <Field id="bundle-title" title="장애 등록할 때 같이 신청한 것">
        {regItems.loading && <p className="text-15 text-text-sub">목록을 불러오는 중이에요</p>}
        {regItems.error && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-15 text-text-sub">목록을 불러오지 못했어요. {regItems.error}</p>
            <button type="button" onClick={regItems.retry} className="text-15 font-medium text-primary underline">
              다시 시도
            </button>
          </div>
        )}
        <div className="grid items-start gap-2 sm:grid-cols-2">
          {regItems.items.map((item) => (
            <CheckCard
              key={item.id}
              checked={bundle.includes(item.id)}
              label={item.easy_label}
              sub={item.label}
              icon={regItemIcon(item.category)}
              onToggle={() => toggleBundle(item.id)}
            />
          ))}
          <div className="sm:col-span-2">
            <CheckCard checked={bundle.includes(UNKNOWN)} label="잘 모르겠어요" onToggle={() => toggleBundle(UNKNOWN)} />
          </div>
        </div>
      </Field>

      <hr className="w-full border-divider" />

      <Field id="separate-title" title="그것 말고 따로 신청한 것">
        <div className="flex gap-2">
          <ChoiceButton selected={hasSeparate === false} onClick={() => update({ hasSeparate: false, separate: {} })}>
            없어요
          </ChoiceButton>
          <ChoiceButton selected={hasSeparate === true} onClick={() => setModalOpen(true)} aria-haspopup="dialog">
            있어요
          </ChoiceButton>
        </div>

        {hasSeparate && chosen.length > 0 && (
          <div className="flex flex-col gap-3 rounded-xl bg-bg-page px-4 py-3.5">
            <ul className="flex flex-col gap-2">
              {chosen.map((item) => (
                <li key={item.id} className="flex items-center gap-2.5">
                  {categoryIcon(item.category) && <WelfareIcon kind={categoryIcon(item.category)!} />}
                  <span className="text-17 font-medium text-text-strong">{item.name}</span>
                  <span className="flex-1" />
                  <span className="rounded-lg bg-primary-100 px-2 py-0.5 text-13 font-bold text-primary">{separate[item.id]}</span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => setModalOpen(true)} className="self-start text-15 font-medium text-primary underline">
              다시 고르기
            </button>
          </div>
        )}
      </Field>

      {modalOpen && (
        <SeparateApplicationsModal
          services={services}
          initial={separate}
          onCancel={() => setModalOpen(false)}
          onDone={(selected) => {
            const has = Object.keys(selected).length > 0
            update({ hasSeparate: has, separate: selected })
            setModalOpen(false)
          }}
        />
      )}
    </SituationLayout>
  )
}
