import checkGreenIcon from '../assets/icons/check-green.svg'
import chatIcon from '../assets/icons/chat.svg'
import clockIcon from '../assets/icons/clock.svg'
import mapPinDetailIcon from '../assets/icons/map-pin-detail.svg'
import messageIcon from '../assets/icons/message.svg'
import phoneMdIcon from '../assets/icons/phone-md.svg'
import walkIcon from '../assets/icons/walk.svg'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { FlowLayout } from '../components/FlowLayout'
import { MOCK_INSTITUTION_DETAIL } from '../data/institutions'

function CardTitle({ children }: { children: string }) {
  return <h2 className="text-[17px] font-bold">{children}</h2>
}

/** 23 기관 카드 상세 */
export function InstitutionDetailPage() {
  // TODO: useParams()의 institutionId로 상세 API 조회
  const d = MOCK_INSTITUTION_DETAIL
  const contacts = [
    { label: '전화', icon: phoneMdIcon, href: `tel:${d.phone}` },
    { label: '문자', icon: messageIcon, href: `sms:${d.phone}` },
    { label: '채팅', icon: chatIcon },
    { label: '방문 안내', icon: walkIcon },
  ]

  return (
    <FlowLayout step={3} backTo="/map" backLabel="기관 목록으로" wide>
      <div className="-mt-1 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[32px] leading-[1.35] font-bold">{d.name}</h1>
            <Badge tone="green">{d.status}</Badge>
          </div>
          <p className="text-[14px] text-gray-700">{d.meta}</p>
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
            <Card className="flex flex-col gap-3">
              <CardTitle>위치 정보</CardTitle>
              <div aria-hidden className="relative h-[180px] overflow-hidden rounded-lg bg-map-bg">
                <div className="absolute top-[80px] left-0 h-3 w-full bg-white" />
                <div className="absolute top-0 left-[38%] h-full w-3 bg-white" />
                <div className="absolute top-[30px] left-0 h-1.5 w-full bg-white" />
                <div className="absolute top-0 left-[70%] h-full w-1.5 bg-white" />
                <img
                  src={mapPinDetailIcon}
                  alt=""
                  width={32}
                  height={40}
                  className="absolute top-[50px] left-[calc(38%-10px)]"
                />
              </div>
              <p className="text-[16px] font-medium">{d.address}</p>
              <p className="flex gap-4 text-[14px] text-gray-700">
                <span>{d.distance}</span>
                <span>{d.transit}</span>
              </p>
            </Card>

            <Card className="flex flex-col gap-3">
              <CardTitle>제공 서비스</CardTitle>
              <ul className="flex flex-wrap gap-2">
                {d.services.map((s) => (
                  <li
                    key={s}
                    className="rounded-md bg-primary-50 px-3 py-1.5 text-[14px] font-medium text-primary"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="flex flex-col gap-3">
              <CardTitle>운영 시간</CardTitle>
              <div className="flex items-start gap-2.5">
                <img src={clockIcon} alt="" width={18} height={18} className="mt-[3px]" />
                <p className="text-[15px] leading-[1.7]">
                  {d.hours.map((h) => (
                    <span key={h} className="block">
                      {h}
                    </span>
                  ))}
                </p>
              </div>
            </Card>

            <Card className="flex flex-col gap-3">
              <CardTitle>접근성 정보</CardTitle>
              <ul className="grid gap-3 sm:grid-cols-2">
                {d.accessibility.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-[15px] font-medium">
                    <img src={checkGreenIcon} alt="" width={18} height={18} />
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <aside className="flex w-full flex-col gap-4 lg:w-[320px] lg:shrink-0">
            <Card className="flex flex-col gap-3">
              <CardTitle>연락처</CardTitle>
              <p className="text-[20px] font-bold">{d.phone}</p>
              <div className="grid grid-cols-2 gap-2">
                {contacts.map((c) => {
                  const className =
                    'flex h-12 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-[15px] font-medium hover:bg-gray-50'
                  const content = (
                    <>
                      <img src={c.icon} alt="" width={18} height={18} />
                      {c.label}
                    </>
                  )
                  return c.href ? (
                    <a key={c.label} href={c.href} className={className}>
                      {content}
                    </a>
                  ) : (
                    <button key={c.label} type="button" className={className}>
                      {content}
                    </button>
                  )
                })}
              </div>
            </Card>
            <Button>이 기관 이용 문의하기</Button>
            <p className="text-[13px] text-gray-500">
              운영 시간과 접근성 정보는 바뀔 수 있어요. 방문 전에 기관에 확인해 주세요.
            </p>
          </aside>
        </div>
      </div>
    </FlowLayout>
  )
}
