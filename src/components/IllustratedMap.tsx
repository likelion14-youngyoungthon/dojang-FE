import currentLocationIcon from '../assets/icons/current-location.svg'
import mapPinIcon from '../assets/icons/map-pin.svg'

export interface MapPin {
  id: string
  label: string
  x: number
  y: number
}

interface IllustratedMapProps {
  pins: MapPin[]
  onPinClick?: (id: string) => void
}

/**
 * 21 화면의 지도 영역. 시안과 같은 정적 일러스트(도로·공원·하천)이며,
 * TODO: 카카오/네이버 지도 SDK 연동 시 이 컴포넌트를 교체
 */
export function IllustratedMap({ pins, onPinClick }: IllustratedMapProps) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-map-bg lg:aspect-auto lg:h-[600px]">
      {/* 배경 일러스트 (600×600 기준 % 좌표) */}
      <div aria-hidden>
        <div className="absolute top-[11.7%] left-[10%] h-[21.7%] w-[30%] bg-map-park" />
        <div className="absolute top-[60%] left-[63.3%] h-[25%] w-[28.3%] bg-map-park" />
        <div className="absolute top-[70%] left-0 h-[10%] w-full bg-map-water" />
        <div className="absolute top-[41.7%] left-0 h-3.5 w-full bg-white" />
        <div className="absolute top-0 left-[48.3%] h-full w-3.5 bg-white" />
        <div className="absolute top-[20%] left-0 h-2 w-full bg-white" />
        <div className="absolute top-[90%] left-0 h-2 w-full bg-white" />
        <div className="absolute top-0 left-[78.3%] h-full w-2 bg-white" />
        <div className="absolute top-0 left-[20%] h-full w-2 bg-white" />
      </div>

      {pins.map((pin) => (
        <button
          key={pin.id}
          type="button"
          onClick={() => onPinClick?.(pin.id)}
          aria-label={`${pin.label}번 기관`}
          className="absolute h-10 w-8 -translate-x-1/2 -translate-y-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <img src={mapPinIcon} alt="" width={32} height={40} />
          <span className="absolute top-[7px] left-1/2 -translate-x-1/2 text-[13px] font-bold text-white">
            {pin.label}
          </span>
        </button>
      ))}

      <img
        src={currentLocationIcon}
        alt="현재 위치"
        width={18}
        height={18}
        className="absolute top-[43.7%] left-[50%]"
      />

      <div className="absolute top-4 left-4 rounded-lg bg-white px-3 py-2 text-[13px] font-medium">
        위치 확인된 기관 {pins.length}곳 표시 중
      </div>

      <div className="absolute top-4 right-4 flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white">
        <button type="button" aria-label="확대" className="size-10 text-[20px] font-medium hover:bg-gray-50">
          +
        </button>
        <button type="button" aria-label="축소" className="size-10 text-[20px] font-medium hover:bg-gray-50">
          −
        </button>
      </div>
    </div>
  )
}
