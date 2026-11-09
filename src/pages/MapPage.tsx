import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { InfoNote } from '../components/Card'
import { FilterChips } from '../components/FilterChips'
import { FlowLayout } from '../components/FlowLayout'
import { IllustratedMap } from '../components/IllustratedMap'
import { INSTITUTION_CATEGORIES, INSTITUTIONS, type InstitutionCategory } from '../data/institutions'
import { useFlow } from '../flow/FlowContext'

export function ViewToggle({ view }: { view: 'map' | 'list' }) {
  const navigate = useNavigate()
  const items = [
    { key: 'map', label: '지도', to: '/map' },
    { key: 'list', label: '목록', to: '/map/list' },
  ] as const
  return (
    <div role="tablist" aria-label="보기 방식" className="flex gap-0.5 rounded-lg bg-gray-50 p-[3px]">
      {items.map((item) => {
        const selected = view === item.key
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => navigate(item.to)}
            className={`h-[38px] rounded-md px-4 text-[14px] ${
              selected ? 'bg-white font-bold' : 'font-medium text-gray-700 hover:text-gray-900'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

/** 21 지도·기관 탐색 */
export function MapPage() {
  const navigate = useNavigate()
  const { state } = useFlow()
  const [filter, setFilter] = useState<InstitutionCategory | '전체'>('전체')
  const visible = INSTITUTIONS.filter((i) => filter === '전체' || i.category === filter)
  const located = visible.filter((i) => i.pin)
  // 위치 확인된 기관에만 1, 2, 3… 번호를 붙임
  const pinNumber = new Map(located.map((i, idx) => [i.id, String(idx + 1)]))

  return (
    <FlowLayout step={3} backTo="/services" backLabel="남은 신청 목록으로" wide>
      <div className="-mt-1 flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[32px] leading-[1.35] font-bold">지도·기관 탐색</h1>
            <p className="text-[15px] text-gray-700">
              현재 거주지 {state.gu} {state.dong} 기준으로 이용 기관을 보여 드려요.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ViewToggle view="map" />
            <Button
              variant="secondary"
              className="h-11 px-[18px] text-[15px]"
              onClick={() => navigate('/map/explore')}
            >
              다른 동 탐색
            </Button>
          </div>
        </div>

        <FilterChips
          label="기관 분류"
          options={INSTITUTION_CATEGORIES}
          value={filter}
          onChange={setFilter}
        />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <IllustratedMap
              pins={located.map((i) => ({ id: i.id, label: pinNumber.get(i.id)!, ...i.pin! }))}
              onPinClick={(id) => navigate(`/institutions/${id}`)}
            />
          </div>

          <section className="flex w-full flex-col gap-2.5 lg:w-[380px] lg:shrink-0">
            <h2 className="text-[15px] font-bold">거주지 관할 기관 {visible.length}곳</h2>
            <ul className="flex flex-col gap-2.5">
              {visible.map((inst) => {
                const num = pinNumber.get(inst.id)
                return (
                  <li key={inst.id}>
                    <Link
                      to={`/institutions/${inst.id}`}
                      className="flex gap-3 rounded-[10px] border border-gray-200 bg-white px-4 py-3.5 hover:border-gray-300"
                    >
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                          num ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {num ?? '–'}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[15px] font-bold">{inst.name}</span>
                          <Badge>{inst.category}</Badge>
                        </div>
                        <p className="text-[13px] text-gray-700">
                          {inst.area} · {inst.address}
                        </p>
                        <div className="flex items-center gap-2">
                          {inst.pin ? (
                            <Badge tone="green">위치 확인됨</Badge>
                          ) : (
                            <Badge tone="orange">위치 미확인</Badge>
                          )}
                          <span className="text-[12px] text-gray-500">{inst.baseDate} 기준</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        <InfoNote className="text-[13px]">
          위치가 확인된 기관만 지도에 핀으로 표시돼요. 목록에는 위치를 확인하지 못한 기관도 포함돼요. 목록에
          없는 기관이 있을 수 있으니 관할 창구에서 최종 확인해 주세요.
        </InfoNote>
      </div>
    </FlowLayout>
  )
}
