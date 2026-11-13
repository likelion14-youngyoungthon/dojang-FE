import { useSearchParams } from 'react-router'
import navigationIcon from '../../assets/icons/navigation.svg'
import phoneIcon from '../../assets/icons/phone.svg'
import { KakaoMap, type MapPlace } from '../../components/results/KakaoMap'
import { PageTitle, ResultsLayout } from '../../components/results/ResultsLayout'
import { PlaceTile } from '../../components/results/Tiles'
import { useResults } from '../../results/ResultsContext'

/** 21 접수처 위치 — 카카오맵 (키: .env.local의 VITE_KAKAO_MAP_KEY). 좌표가 있는 곳만 핀, 목록에는 모두 */
export function LocationsPage() {
  const [params, setParams] = useSearchParams()
  const { remaining, offices } = useResults()
  const selectedId = params.get('office') ?? offices[0]?.id
  const selected = offices.find((o) => o.id === selectedId) ?? offices[0]
  const countAt = (id: string) => remaining.filter((b) => b.officeId === id).length
  const places = offices.filter((o): o is typeof o & MapPlace => o.lat != null && o.lng != null)

  return (
    <ResultsLayout
      back={{ label: '남은 신청', to: '/results' }}
      title={<PageTitle>접수처 위치</PageTitle>}
      aside={offices.map((office) => {
        const active = office.id === selected?.id
        return (
          <section
            key={office.id}
            aria-label={office.name}
            className={`flex w-full flex-col gap-3 rounded-[20px] bg-surface p-5 shadow-card ${
              active ? 'border-[1.5px] border-primary' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setParams({ office: office.id }, { replace: true })}
              aria-pressed={active}
              className="flex flex-col gap-1 text-left"
            >
              <span className="flex items-center gap-2">
                <PlaceTile kind={office.icon} />
                <span className="text-17 font-bold text-text-strong">{office.name}</span>
                <span className="text-17 font-bold text-primary">{countAt(office.id)}건</span>
              </span>
              <span className="text-14 text-text-sub">
                {office.addressLines.map((line, i) => (
                  <span key={line} className={i > 0 && office.id === 'mobility_center' ? 'block' : ''}>
                    {i > 0 && office.id !== 'mobility_center' ? ' ' : ''}
                    {line}
                  </span>
                ))}
              </span>
            </button>
            <div className="flex items-center gap-2">
              {/* TODO: 카카오맵 SDK 연동 후 앱 길찾기로 교체 */}
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(office.addressLines.join(' '))}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 items-center gap-2 rounded-[10px] border border-border bg-surface px-3.5 text-15 font-medium text-text-strong hover:bg-bg-sidebar"
              >
                <img src={navigationIcon} alt="" width={16} height={16} />
                길찾기
              </a>
              <a href={`tel:${office.phone}`} className="flex items-center gap-1.5 text-17 font-medium text-text">
                <img src={phoneIcon} alt="" width={16} height={16} />
                {office.phone}
              </a>
            </div>
          </section>
        )
      })}
    >
      <KakaoMap
        places={places}
        selectedId={selected?.id ?? ''}
        onSelect={(id) => setParams({ office: id }, { replace: true })}
        className="h-[730px] w-full"
      />
    </ResultsLayout>
  )
}
