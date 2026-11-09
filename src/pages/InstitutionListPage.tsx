import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import chevronRightIcon from '../assets/icons/chevron-right.svg'
import mapOutlineIcon from '../assets/icons/map-outline.svg'
import statusDotIcon from '../assets/icons/status-dot.svg'
import { Button } from '../components/Button'
import { FilterChips } from '../components/FilterChips'
import { FlowLayout } from '../components/FlowLayout'

const CATEGORIES = ['활동지원', '복지시설', '보조기기'] as const
type Category = (typeof CATEGORIES)[number]

// TODO: 기관 목록 API 결과로 교체
const LIST: { id: string; gu: string; name: string; desc: string; tags: Category[] }[] = [
  { id: 'yongin-welfare', gu: '용인시 처인구', name: '○○ 장애인활동지원센터', desc: '활동지원 신청·이용기관', tags: ['활동지원'] },
  { id: 'yongin-dev-center', gu: '용인시 처인구', name: '△△ 장애인복지관', desc: '활동지원 · 복지시설', tags: ['활동지원', '복지시설'] },
  { id: 'yongin-assistive', gu: '용인시 처인구', name: '장애인 보조기기 대여센터', desc: '보조기기 구입·교부', tags: ['보조기기'] },
  { id: 'suji-daycare', gu: '용인시 처인구', name: '장애인 의료지원센터', desc: '의료비 및 재활 지원', tags: ['복지시설'] },
  { id: 'kead-yongin', gu: '용인시 기흥구', name: '기흥 장애인 직업훈련원', desc: '일자리·고용 지원', tags: ['복지시설'] },
]

/** 24 목록 대안 — 지도를 쓰기 어려울 때 */
export function InstitutionListPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Category | '전체'>('전체')
  const [selected, setSelected] = useState<string | null>(null)
  const visible = LIST.filter((i) => filter === '전체' || i.tags.includes(filter))
  const groups = [...new Set(visible.map((i) => i.gu))]

  const mapButton = (className: string) => (
    <Button variant="secondary" className={`gap-2 px-5 ${className}`} onClick={() => navigate('/map')}>
      <img src={mapOutlineIcon} alt="" width={18} height={18} />
      지도로 보기
    </Button>
  )

  return (
    <FlowLayout step={3} backTo="/services" backLabel="남은 신청 목록으로" contentWidth={860}>
      <div className="-mt-3 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[32px] leading-[1.35] font-bold">기관 목록</h1>
            <p className="text-[15px] text-gray-700">지도를 쓰기 어려울 때 목록으로 기관을 찾을 수 있어요.</p>
          </div>
          {mapButton('h-11 text-[15px]')}
        </div>

        <FilterChips label="기관 분류" options={CATEGORIES} value={filter} onChange={setFilter} />

        {groups.map((gu) => {
          const items = visible.filter((i) => i.gu === gu)
          return (
            <section key={gu} className="flex flex-col gap-2.5">
              <h2 className="flex items-center gap-2">
                <span className="text-[16px] font-bold">{gu}</span>
                <span className="text-[14px] font-medium text-gray-500">{items.length}곳</span>
              </h2>
              <ul role="radiogroup" aria-label={`${gu} 기관`} className="overflow-hidden rounded-[10px] border border-gray-200">
                {items.map((inst) => {
                  const isSelected = selected === inst.name
                  return (
                    <li
                      key={inst.name}
                      className={`flex items-center gap-4 border-b border-gray-200 py-4 pr-5 pl-6 last:border-b-0 ${
                        isSelected ? 'bg-primary-50' : 'bg-white'
                      }`}
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelected(inst.name)}
                        className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left"
                      >
                        <span className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[16px] font-bold">{inst.name}</span>
                          <span className="flex items-center gap-[5px] text-[13px] font-medium text-success">
                            <img src={statusDotIcon} alt="" width={8} height={8} />
                            운영 중
                          </span>
                        </span>
                        <span className="text-[14px] text-gray-700">{inst.desc}</span>
                      </button>
                      <span className="hidden text-[13px] text-gray-500 sm:inline">확인일 2026-10-31</span>
                      <Link to={`/institutions/${inst.id}`} aria-label={`${inst.name} 상세 보기`}>
                        <img src={chevronRightIcon} alt="" width={20} height={20} />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}

        <div className="flex gap-3 pt-2">
          {mapButton('w-[160px] shrink-0')}
          <Button
            className="flex-1"
            disabled={!selected}
            onClick={() => {
              const inst = LIST.find((i) => i.name === selected)
              if (inst) navigate(`/institutions/${inst.id}`)
            }}
          >
            선택한 기관에 문의하기
          </Button>
        </div>
      </div>
    </FlowLayout>
  )
}
