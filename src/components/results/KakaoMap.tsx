import { useEffect, useRef, useState } from 'react'
import mapPinOtherIcon from '../../assets/icons/map-pin-other.svg'
import mapPinSelectedIcon from '../../assets/icons/map-pin-selected.svg'

/* 카카오맵 JS SDK는 타입 패키지가 없어 쓰는 부분만 any로 둠 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Kakao = any
declare global {
  interface Window {
    kakao: Kakao
  }
}

const KEY = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined

let sdk: Promise<Kakao> | undefined
/** SDK 스크립트는 한 번만 불러옴 */
function loadSdk(): Promise<Kakao> {
  sdk ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false`
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao))
    script.onerror = () => {
      sdk = undefined
      reject(new Error('카카오맵 SDK를 불러오지 못했어요'))
    }
    document.head.append(script)
  })
  return sdk
}

export interface MapPlace {
  id: string
  name: string
  lat: number
  lng: number
}

interface KakaoMapProps {
  places: MapPlace[]
  selectedId: string
  onSelect: (id: string) => void
  className?: string
}

/** 카카오맵 — 접수처 핀 표시, 선택한 곳으로 이동 */
export function KakaoMap({ places, selectedId, onSelect, className = '' }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Kakao>(null)
  const onSelectRef = useRef(onSelect)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(KEY ? 'loading' : 'error')

  useEffect(() => {
    onSelectRef.current = onSelect
  })

  // 지도 만들기 (한 번)
  useEffect(() => {
    if (!KEY) return
    let cancelled = false
    loadSdk()
      .then((kakao) => {
        if (cancelled || !containerRef.current) return
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(37.2411, 127.1776), // 용인시청
          level: 7,
        })
        map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT)
        mapRef.current = map
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
  }, [])

  // 핀 그리기 · 선택한 곳으로 이동
  useEffect(() => {
    const map = mapRef.current
    if (status !== 'ready' || !map) return
    const { maps } = window.kakao
    const image = (src: string, w: number, h: number) =>
      new maps.MarkerImage(src, new maps.Size(w, h), { offset: new maps.Point(w / 2, h) })

    const overlays = places.map((place) => {
      const selected = place.id === selectedId
      const marker = new maps.Marker({
        map,
        position: new maps.LatLng(place.lat, place.lng),
        title: place.name,
        image: selected ? image(mapPinSelectedIcon, 44, 56) : image(mapPinOtherIcon, 24, 32),
        zIndex: selected ? 1 : 0,
      })
      maps.event.addListener(marker, 'click', () => onSelectRef.current(place.id))
      return marker
    })

    const current = places.find((p) => p.id === selectedId)
    if (current) {
      const label = document.createElement('span')
      label.className =
        'flex h-8 items-center rounded-lg bg-surface px-3 text-13 font-bold text-text-strong shadow-card'
      label.textContent = current.name
      overlays.push(
        new maps.CustomOverlay({
          map,
          position: new maps.LatLng(current.lat, current.lng),
          content: label,
          yAnchor: 0,
          zIndex: 2,
        }),
      )
      map.panTo(new maps.LatLng(current.lat, current.lng))
    }

    return () => overlays.forEach((o) => o.setMap(null))
  }, [status, places, selectedId])

  const selectedName = places.find((p) => p.id === selectedId)?.name ?? ''

  return (
    <div
      role="img"
      aria-label={`${selectedName} 위치 지도`}
      className={`relative overflow-hidden rounded-[20px] border border-divider bg-[#f2efe9] shadow-card ${className}`}
    >
      <div ref={containerRef} className="absolute inset-0" />
      {status !== 'ready' && (
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-15 text-text-sub">
          {status === 'loading' ? '지도를 불러오는 중이에요' : '지도를 불러오지 못했어요. 왼쪽 목록의 주소와 길찾기를 이용해 주세요.'}
        </p>
      )}
    </div>
  )
}
