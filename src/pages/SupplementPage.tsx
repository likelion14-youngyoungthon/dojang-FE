import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import phoneIcon from '../assets/icons/phone.svg'
import { Button } from '../components/Button'
import { Card, InfoNote } from '../components/Card'
import { CheckItem } from '../components/CheckItem'
import { Field } from '../components/Field'
import { FlowLayout, PageTitle } from '../components/FlowLayout'
import { Select } from '../components/Select'
import { SERVICES } from '../data/services'

const PLANNED = ['3일 이내', '1주일 이내', '2주일 이내', '아직 모르겠어요']

// TODO: 보완 요청 API 결과로 교체
const MOCK_SUPPLEMENT = {
  documents: ['의료기관 진단서 (최근 1개월 이내 발급)', '소득 증명 서류 (급여명세서 또는 통장 사본)'],
  deadline: '2026년 11월 23일까지',
  reviewer: '용인시청 장애인복지과',
  phone: '031-000-0000',
}

/** 17 보완 요청 입력 */
export function SupplementPage() {
  const navigate = useNavigate()
  const { serviceId } = useParams()
  const service = SERVICES.find((s) => s.id === serviceId)
  const s = MOCK_SUPPLEMENT
  const [ready, setReady] = useState<string[]>([])
  const [planned, setPlanned] = useState('1주일 이내')
  if (!service) return <Navigate to="/services" replace />

  const back = `/services/${service.id}/steps`

  return (
    <FlowLayout step={4} backTo={back} backLabel="신청 단계 카드로">
      <PageTitle
        title="보완 서류 제출"
        description={`${service.name} 심사를 위해 아래 서류를 추가로 제출해야 해요.`}
      />

      <div className="-mt-1 flex flex-col gap-6">
        <Card className="flex flex-col">
          <h2 className="text-[17px] font-bold">추가 제출 서류</h2>
          {s.documents.map((doc, i) => (
            <CheckItem
              key={doc}
              size="lg"
              label={doc}
              checked={ready.includes(doc)}
              onChange={(checked) =>
                setReady((prev) => (checked ? [...prev, doc] : prev.filter((d) => d !== doc)))
              }
              className={`py-3.5 ${i > 0 ? 'border-t border-gray-200' : ''}`}
            />
          ))}
          <p className="pt-1.5 text-[13px] text-gray-500">
            준비한 서류에 체크해 두면 다음에 다시 확인할 수 있어요.
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="제출 예정일" htmlFor="planned">
            <Select
              id="planned"
              options={PLANNED}
              value={planned}
              onChange={(e) => setPlanned(e.target.value)}
            />
          </Field>
          <div className="flex flex-col gap-2">
            <p className="text-[15px] font-bold">제출 기한</p>
            <p className="flex h-13 items-center rounded-lg bg-gray-50 px-4 text-[16px] font-bold">
              {s.deadline}
            </p>
          </div>
        </div>

        <Card className="flex min-h-[100px] flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] text-gray-500">심사 담당</p>
            <p className="text-[16px] font-bold">{s.reviewer}</p>
          </div>
          <a
            href={`tel:${s.phone}`}
            className="flex items-center gap-1.5 text-[16px] font-bold text-primary hover:underline"
          >
            <img src={phoneIcon} alt="" width={18} height={18} />
            {s.phone}
          </a>
        </Card>

        <InfoNote>
          제출 기한이 지나면 심사가 늦어질 수 있어요. 예정일을 저장하면 신청 단계 카드에 표시돼요.
        </InfoNote>

        <div className="flex gap-3">
          <Button variant="secondary" className="w-[120px] shrink-0" onClick={() => navigate(back)}>
            취소
          </Button>
          <Button className="flex-1" onClick={() => navigate(back)}>
            제출 예정일 저장
          </Button>
        </div>
      </div>
    </FlowLayout>
  )
}
