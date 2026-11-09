import { useState } from 'react'
import locationIcon from '../assets/icons/location.svg'
import messageXsIcon from '../assets/icons/message-xs.svg'
import phoneXsIcon from '../assets/icons/phone-xs.svg'
import walkXsIcon from '../assets/icons/walk-xs.svg'
import warning20Icon from '../assets/icons/warning-20.svg'
import { Badge } from '../components/Badge'
import { FilterChips } from '../components/FilterChips'
import { FlowLayout } from '../components/FlowLayout'
import { DONG_BY_GU, GU_LIST, type Gu } from '../data/regions'
import { EXPLORE_CATEGORIES, getExploreInstitutions, type ExploreCategory } from '../data/institutions'
import { useFlow } from '../flow/FlowContext'

const ACTIONS = [
  { label: '전화 문의', icon: phoneXsIcon },
  { label: '문자 문의', icon: messageXsIcon },
  { label: '방문 안내', icon: walkXsIcon },
]

/** 22 다른 동 탐색 */
export function ExploreAreaPage() {
  const { state } = useFlow()
  const [gu, setGu] = useState<Gu>('처인구')
  const [dong, setDong] = useState(DONG_BY_GU['처인구'][0])
  const [filter, setFilter] = useState<ExploreCategory | '전체'>('전체')
  const isResidence = gu === state.gu && dong === state.dong

  const institutions = getExploreInstitutions(dong).filter((i) => filter === '전체' || i.category === filter)
  const showAssistiveEmpty = filter === '전체' || filter === '보조기기'

  return (
    <FlowLayout step={3} backTo="/map" backLabel="지도·기관 탐색으로" wide>
      <div className="-mt-1 flex flex-col gap-5">
        <h1 className="text-[32px] leading-[1.35] font-bold">다른 동 탐색</h1>

        <div className="flex flex-wrap items-center gap-3 rounded-[10px] bg-primary-50 px-5 py-3.5">
          <img src={locationIcon} alt="" width={20} height={20} />
          <span className="text-[14px] font-medium text-gray-700">현재 거주지</span>
          <span className="text-[16px] font-bold">
            {state.gu} {state.dong}
          </span>
          <Badge>관할 창구 유지 중</Badge>
          <span className="text-[14px] text-gray-700">
            탐색하는 동이 바뀌어도 거주지와 관할 창구는 그대로예요.
          </span>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          <section className="flex w-full flex-col gap-3.5 rounded-[10px] border border-gray-200 p-5 lg:w-[300px] lg:shrink-0">
            <h2 className="text-[16px] font-bold">다른 읍면동 탐색</h2>
            <div role="radiogroup" aria-label="구" className="flex h-11 gap-1 rounded-lg bg-gray-50 p-1">
              {GU_LIST.map((g) => {
                const selected = gu === g
                return (
                  <button
                    key={g}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setGu(g)
                      setDong(DONG_BY_GU[g][0])
                    }}
                    className={`flex-1 rounded-md text-[14px] ${
                      selected
                        ? 'border-[1.5px] border-primary bg-white font-bold text-primary'
                        : 'font-medium text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {g}
                  </button>
                )
              })}
            </div>
            <ul role="listbox" aria-label="읍면동" className="flex max-h-[340px] flex-col gap-0.5 overflow-y-auto">
              {DONG_BY_GU[gu].map((d) => {
                const selected = dong === d
                return (
                  <li key={d} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => setDong(d)}
                      className={`flex h-10 w-full items-center justify-between rounded-md px-3 text-[15px] ${
                        selected ? 'bg-primary-50 font-bold text-primary' : 'font-medium hover:bg-gray-50'
                      }`}
                    >
                      {d}
                      {selected && <span className="text-[12px]">탐색 중</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="flex min-w-0 flex-1 flex-col gap-4">
            {!isResidence && (
              <div className="flex items-start gap-2.5 rounded-lg bg-warning-50 px-4 py-3">
                <img src={warning20Icon} alt="" width={20} height={20} />
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-[15px] font-bold">
                    탐색 중: {gu} {dong} · 거주지 아님
                  </p>
                  <p className="text-[14px] text-gray-700">
                    아래 기관은 참고용이에요. 관할 창구는 {state.dong} 행정복지센터로 유지돼요.
                  </p>
                </div>
              </div>
            )}

            <FilterChips
              size="sm"
              label="기관 분류"
              options={EXPLORE_CATEGORIES}
              value={filter}
              onChange={setFilter}
            />

            <div className="grid gap-3 md:grid-cols-2">
              {institutions.map((inst) => (
                <article
                  key={inst.name}
                  className="flex flex-col gap-2 rounded-[10px] border border-gray-200 bg-white px-5 py-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[16px] font-bold">{inst.name}</h3>
                    <Badge tone={inst.badgeTone}>{inst.badge}</Badge>
                  </div>
                  <p className="text-[13px] text-gray-700">{inst.address}</p>
                  {inst.warning && <p className="text-[13px] text-warning">{inst.warning}</p>}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ACTIONS.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className="flex h-[34px] items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-[13px] font-medium hover:bg-gray-50"
                      >
                        <img src={action.icon} alt="" width={15} height={15} />
                        {action.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[12px] text-gray-500">확인 기준일 2026-10-31</p>
                </article>
              ))}

              {showAssistiveEmpty && (
                <article className="flex flex-col gap-1.5 rounded-[10px] border border-dashed border-gray-300 bg-gray-50 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-bold">보조기기 공급기관</h3>
                    <Badge tone="gray">0곳</Badge>
                  </div>
                  <p className="text-[14px] leading-[1.6] text-gray-700">
                    이 지역 자료에서는 확인된 기관이 없어요. 다른 읍면동을 탐색하거나 이동 지원 관련 문의를
                    이용해 주세요.
                  </p>
                </article>
              )}
            </div>
          </section>
        </div>
      </div>
    </FlowLayout>
  )
}
