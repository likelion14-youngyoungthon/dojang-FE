import { Navigate, useNavigate, useParams } from 'react-router'
import docIcon from '../assets/icons/doc.svg'
import mapIcon from '../assets/icons/map.svg'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { FlowLayout } from '../components/FlowLayout'
import { getServiceDetail, SERVICES, STATUS_META } from '../data/services'

function CardTitle({ children }: { children: string }) {
  return <h2 className="text-[17px] font-bold">{children}</h2>
}

/** 14 카드 상세 */
export function ServiceDetailPage() {
  const navigate = useNavigate()
  const { serviceId } = useParams()
  const service = SERVICES.find((s) => s.id === serviceId)
  if (!service) return <Navigate to="/services" replace />

  const detail = getServiceDetail(service)
  const meta = STATUS_META[service.status]

  return (
    <FlowLayout step={3} backTo="/services" backLabel="남은 신청 목록으로" wide>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] leading-[1.35] font-bold">{service.name}</h1>
          <Badge tone={meta.tone}>{meta.badge}</Badge>
        </div>
        <p className="text-[14px] text-gray-700">{detail.meta}</p>
      </div>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <Card className="flex flex-col gap-3.5">
            <CardTitle>추천 이유</CardTitle>
            <p className="text-[15px] leading-[1.7] text-gray-700">{detail.reason}</p>
            <a href="#sources" className="w-fit text-[14px] font-medium text-primary underline">
              근거: {detail.reasonSource}
            </a>
          </Card>

          <Card className="flex flex-col">
            <CardTitle>확인이 필요한 조건</CardTitle>
            <ul>
              {detail.conditions.map((condition, i) => (
                <li
                  key={condition}
                  className={`flex items-center justify-between gap-3 py-3 ${i > 0 ? 'border-t border-gray-200' : ''}`}
                >
                  <span className="text-[15px] font-medium">{condition}</span>
                  <Badge tone="orange">확인 필요</Badge>
                </li>
              ))}
            </ul>
            <p className="pt-2 text-[13px] text-gray-500">위 조건은 실제 창구에서 최종 확인해요.</p>
          </Card>

          <Card className="flex flex-col gap-3.5">
            <CardTitle>준비 서류</CardTitle>
            <h3 className="text-[15px] font-bold">공통 서류</h3>
            <ul className="text-[15px] leading-[1.8] text-gray-700">
              {detail.documents.common.map((doc) => (
                <li key={doc}>· {doc}</li>
              ))}
            </ul>
            {detail.documents.optional.length > 0 && (
              <>
                <h3 className="text-[15px] font-bold">상황에 따라 추가될 수 있는 서류</h3>
                <ul className="text-[15px] leading-[1.8] text-gray-700">
                  {detail.documents.optional.map((doc) => (
                    <li key={doc}>· {doc}</li>
                  ))}
                </ul>
              </>
            )}
            <p className="text-[13px] text-gray-500">실제 필요한 서류는 창구에서 확인해 주세요.</p>
          </Card>

          <Card id="sources" className="flex flex-col gap-3.5">
            <CardTitle>공식 근거</CardTitle>
            {detail.sources.map((source) => (
              <a
                key={source}
                href="#"
                className="flex w-fit items-center gap-2 text-[14px] font-medium text-primary underline"
              >
                <img src={docIcon} alt="" width={16} height={16} />
                {source}
              </a>
            ))}
            <p className="text-[13px] text-gray-500">확인되지 않은 내용은 '확인 필요'로 표시돼요.</p>
          </Card>
        </div>

        <aside className="flex w-full flex-col gap-3 lg:sticky lg:top-6 lg:w-[320px] lg:shrink-0">
          <Card className="flex flex-col gap-3.5">
            <CardTitle>신청 창구</CardTitle>
            {detail.offices.map((office) => (
              <div key={office.label} className="flex flex-col gap-0.5">
                <p className="text-[13px] text-gray-500">{office.label}</p>
                <p className="text-[15px] font-medium">{office.value}</p>
              </div>
            ))}
            <Button
              variant="secondary"
              className="h-12 gap-2 px-4 text-[15px]"
              onClick={() => navigate('/map')}
            >
              <img src={mapIcon} alt="" width={18} height={18} />
              지도에서 접수처 보기
            </Button>
          </Card>
          <Button onClick={() => navigate(`/services/${service.id}/steps`)}>신청 단계 확인하기</Button>
        </aside>
      </div>
    </FlowLayout>
  )
}
