import { useSearchParams } from 'react-router'
import mapBaseImage from '../../assets/icons/map-base.svg'
import mapPinIcon from '../../assets/icons/map-pin-icon.svg'
import mapPinOtherIcon from '../../assets/icons/map-pin-other.svg'
import mapPinSelectedIcon from '../../assets/icons/map-pin-selected.svg'
import minusIcon from '../../assets/icons/minus.svg'
import navigationIcon from '../../assets/icons/navigation.svg'
import phoneIcon from '../../assets/icons/phone.svg'
import plusIcon from '../../assets/icons/plus.svg'
import { PageTitle, ResultsLayout } from '../../components/results/ResultsLayout'
import { PlaceTile } from '../../components/results/Tiles'
import { OFFICES } from '../../data/results'
import { useResults } from '../../results/ResultsContext'

/** 21 접수처 위치 — 지도는 카카오맵 SDK 연동 전이라 Figma 그림으로 대신함 */
export function LocationsPage() {
  const [params, setParams] = useSearchParams()
  const { remaining } = useResults()
  const selectedId = params.get('office') ?? OFFICES[0].id
  const selected = OFFICES.find((o) => o.id === selectedId) ?? OFFICES[0]
  const countAt = (id: string) => remaining.filter((b) => b.officeId === id).length

  return (
    <ResultsLayout
      back={{ label: '남은 신청', to: '/results' }}
      title={<PageTitle>접수처 위치</PageTitle>}
      aside={OFFICES.map((office) => {
        const active = office.id === selected.id
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
                  <span key={line} className={i > 0 && office.id === 'transport' ? 'block' : ''}>
                    {i > 0 && office.id !== 'transport' ? ' ' : ''}
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
      {/* TODO: 카카오맵 SDK로 교체 (지도 바탕·핀·확대 축소는 지금 보여 주기용) */}
      <div
        role="img"
        aria-label={`${selected.name} 위치 지도`}
        className="relative flex h-[730px] w-full items-center justify-center overflow-hidden rounded-[20px] border border-divider bg-[#f2efe9] shadow-card"
      >
        <img src={mapBaseImage} alt="" className="absolute -inset-px size-[calc(100%+2px)] max-w-none" />
        <img src={mapPinOtherIcon} alt="" width={24} height={32} className="absolute top-[20.4%] left-[27.7%]" />
        <img src={mapPinOtherIcon} alt="" width={24} height={32} className="absolute top-[76.7%] left-[83.1%]" />

        <div className="relative flex flex-col items-center gap-2">
          <span className="relative h-14 w-11 drop-shadow-[0_16px_20px_rgb(25_31_40/0.16)]">
            <img src={mapPinSelectedIcon} alt="" width={44} height={56} className="absolute inset-0" />
            <img src={mapPinIcon} alt="" width={22} height={22} className="absolute top-[10.5px] left-[11px]" />
          </span>
          <span className="flex h-8 items-center rounded-lg bg-surface px-3 text-13 font-bold text-text-strong drop-shadow-[0_8px_12px_rgb(16_24_40/0.06)]">
            {selected.name}
          </span>
        </div>

        <div className="absolute top-[15px] right-[15px] flex w-10 flex-col overflow-hidden rounded border border-[#c9ced4] bg-surface" aria-hidden>
          <span className="flex size-10 items-center justify-center">
            <img src={plusIcon} alt="" width={20} height={20} />
          </span>
          <span className="h-px w-10 bg-divider" />
          <span className="flex size-10 items-center justify-center">
            <img src={minusIcon} alt="" width={20} height={20} />
          </span>
        </div>

        <p className="absolute bottom-3 left-[11px] text-[11px] font-bold text-icon-off">kakao map</p>
      </div>
    </ResultsLayout>
  )
}
