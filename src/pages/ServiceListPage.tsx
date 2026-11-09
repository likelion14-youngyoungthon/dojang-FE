import { useState } from 'react'
import { useNavigate } from 'react-router'
import downloadIcon from '../assets/icons/download.svg'
import { Button } from '../components/Button'
import { InfoNote } from '../components/Card'
import { FlowLayout } from '../components/FlowLayout'
import { GroupHead, ServiceCard } from '../components/ServiceCard'
import { MOCK_USER, SERVICES, STATUS_META, type ServiceStatus } from '../data/services'

type Tab = 'all' | ServiceStatus
const TABS: Tab[] = ['all', 'before', 'progress', 'check']

/** 13 남은 신청 목록 */
export function ServiceListPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('all')
  const visible = SERVICES.filter((s) => tab === 'all' || s.status === tab)
  const offices = [...new Set(visible.map((s) => s.office))]
  const count = (t: Tab) => (t === 'all' ? SERVICES.length : SERVICES.filter((s) => s.status === t).length)

  return (
    <FlowLayout step={3} backTo="/income" wide>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-[1.35] font-bold">남은 신청 안내</h1>
          <p className="text-[16px] font-medium">
            {MOCK_USER.name} 님 · {MOCK_USER.profile}
          </p>
          <p className="text-[14px] text-gray-500">
            {MOCK_USER.region} 거주 · {MOCK_USER.analyzedAt} 분석 기준
          </p>
        </div>
        <Button
          variant="secondary"
          className="h-11 gap-2 px-4 text-[15px]"
          onClick={() => navigate('/summary')}
        >
          <img src={downloadIcon} alt="" width={18} height={18} />
          요약 내보내기
        </Button>
      </div>

      <div role="tablist" className="flex gap-6 border-b border-gray-200">
        {TABS.map((t) => {
          const selected = tab === t
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t)}
              className={`-mb-px flex items-center gap-1.5 pt-2 pb-3 ${
                selected ? 'border-b-[2.5px] border-primary font-bold text-primary' : ''
              }`}
            >
              <span className={`text-[16px] ${selected ? '' : 'font-medium text-gray-700'}`}>
                {t === 'all' ? '전체' : STATUS_META[t].tab}
              </span>
              <span className={`text-[14px] font-bold ${selected ? '' : 'text-gray-500'}`}>{count(t)}</span>
            </button>
          )
        })}
      </div>

      <div role="tabpanel" className="grid gap-x-4 gap-y-6 md:grid-cols-2">
        {offices.map((office) => {
          const items = visible.filter((s) => s.office === office)
          return (
            <section
              key={office}
              className={`flex flex-col gap-3 ${items.length > 1 ? 'md:col-span-2' : ''}`}
            >
              <GroupHead>{office}</GroupHead>
              <div className={`grid gap-4 ${items.length > 1 ? 'md:grid-cols-2' : ''}`}>
                {items.map((service) => (
                  <ServiceCard key={service.id} service={service} userName={MOCK_USER.name} />
                ))}
              </div>
            </section>
          )
        })}
        {visible.length === 0 && (
          <p className="py-10 text-center text-[15px] text-gray-500 md:col-span-2">
            해당하는 신청이 없어요.
          </p>
        )}
      </div>

      <div className="grid gap-4 pt-2 md:grid-cols-2">
        <div className="flex flex-col gap-1.5 rounded-[10px] bg-gray-50 px-6 py-5">
          <h2 className="text-[16px] font-bold">확인이 필요한 조건이 있어요</h2>
          <p className="text-[14px] text-gray-700">
            조건이 모두 확인되지 않은 항목은 후보에서 빠져 있어요. 조건을 확인하면 다시 계산해요.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              className="h-11 px-4 text-[15px]"
              onClick={() => navigate('/services/unmet')}
            >
              불충족·미확인 항목 보기
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 rounded-[10px] bg-gray-50 px-6 py-5">
          <h2 className="text-[16px] font-bold">근처 접수처와 기관을 찾아보세요</h2>
          <p className="text-[14px] text-gray-700">
            현재 거주지 관할 창구와 주변 기관을 지도와 목록으로 볼 수 있어요.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              className="h-11 px-4 text-[15px]"
              onClick={() => navigate('/map')}
            >
              지도·기관 탐색
            </Button>
          </div>
        </div>
      </div>

      <InfoNote>
        이 안내는 입력하신 내용을 바탕으로 한 참고 정보예요. 실제 자격 여부는 관할 창구에서 최종 확인해
        주세요.
      </InfoNote>
    </FlowLayout>
  )
}
