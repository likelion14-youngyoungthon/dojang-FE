import { Navigate, useNavigate, useParams } from 'react-router'
import arrowRightLgIcon from '../assets/icons/arrow-right-lg.svg'
import warningMdIcon from '../assets/icons/warning-md.svg'
import { Button } from '../components/Button'
import { InfoNote } from '../components/Card'
import { FlowLayout, PageTitle } from '../components/FlowLayout'
import { MOCK_USER, SERVICES } from '../data/services'

// TODO: 정정 요청 파싱 API 결과로 교체
const MOCK_CORRECTION = {
  before: { service: '장애인연금', subject: `${MOCK_USER.name} (본인)`, status: '접수·결과 대기' },
  after: { service: '특별교통수단 이용등록', subject: `${MOCK_USER.name} (본인)`, status: '접수·결과 대기' },
  reason: '그게 아니라 교통수단 이용등록을 신청한 거예요',
}

type Row = { service: string; subject: string; status: string }

function ComparePanel({ title, row, highlight = false }: { title: string; row: Row; highlight?: boolean }) {
  const items = [
    { label: '서비스', value: row.service, accent: highlight },
    { label: '대상자', value: row.subject },
    { label: '상태', value: row.status },
  ]
  return (
    <section
      className={`flex-1 overflow-hidden rounded-[10px] bg-white ${
        highlight ? 'border-[1.5px] border-primary' : 'border border-gray-200'
      }`}
    >
      <h2
        className={`px-5 py-3 text-[14px] font-bold ${highlight ? 'bg-primary-50 text-primary' : 'bg-gray-50 text-gray-700'}`}
      >
        {title}
      </h2>
      <dl className="flex flex-col gap-3.5 px-5 pt-[18px] pb-5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <dt className="text-[13px] text-gray-500">{item.label}</dt>
            <dd className={`text-[16px] font-bold ${item.accent ? 'text-primary' : ''}`}>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** 19 서비스·대상자 정정 */
export function CorrectionPage() {
  const navigate = useNavigate()
  const { serviceId } = useParams()
  const service = SERVICES.find((s) => s.id === serviceId)
  if (!service) return <Navigate to="/services" replace />

  const c = MOCK_CORRECTION
  const back = `/services/${service.id}/steps`

  return (
    <FlowLayout step={4} backTo={back} backLabel="신청 단계 카드로" contentWidth={800}>
      <PageTitle title="정정 내용을 확인해 주세요" description="아래 내용이 맞는지 확인한 뒤 정정을 완료해 주세요." />

      <div className="-mt-1 flex flex-col gap-6">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <ComparePanel title="정정 전" row={c.before} />
          <img
            src={arrowRightLgIcon}
            alt="에서"
            width={24}
            height={24}
            className="self-center max-sm:rotate-90"
          />
          <ComparePanel title="정정 후" row={c.after} highlight />
        </div>

        <p className="text-[14px] text-gray-700">
          잘못 반영된 {c.before.service}의 상태는 정정 전으로 되돌아가요.
        </p>

        <blockquote className="flex flex-col gap-1.5 border-l-3 border-gray-300 bg-gray-50 px-5 py-4">
          <p className="text-[13px] text-gray-500">정정 이유 (입력하신 내용)</p>
          <p className="text-[16px] font-medium">“{c.reason}”</p>
        </blockquote>

        <div className="flex items-start gap-3 rounded-[10px] border border-warning-200 bg-warning-50 px-5 py-4">
          <img src={warningMdIcon} alt="" width={22} height={22} />
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[15px] font-bold">주의해 주세요</p>
            <p className="text-[14px] text-gray-700">
              서로 다른 사람의 신청 내역은 합쳐지지 않아요. 대상자가 맞는지 다시 확인해 주세요.
            </p>
          </div>
        </div>

        <InfoNote>
          정정을 완료하면 신청 단계 카드에 반영돼요. 실제 자격 여부는 행정복지센터에서 최종 확인해 주세요.
        </InfoNote>

        <div className="flex gap-3">
          <Button variant="secondary" className="w-[120px] shrink-0" onClick={() => navigate(back)}>
            취소
          </Button>
          <Button className="flex-1" onClick={() => navigate(back)}>
            정정 완료
          </Button>
        </div>
      </div>
    </FlowLayout>
  )
}
