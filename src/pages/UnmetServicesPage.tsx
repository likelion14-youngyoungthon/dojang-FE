import { Link, useNavigate } from 'react-router'
import chevronRightIcon from '../assets/icons/chevron-right.svg'
import { Badge, type BadgeTone } from '../components/Badge'
import { Button } from '../components/Button'
import { InfoNote } from '../components/Card'
import { FlowLayout, PageTitle } from '../components/FlowLayout'

// TODO: 추천 API의 불충족·미확인 결과로 교체
const UNMET: { serviceId: string; name: string; badge: string; tone: BadgeTone; reason: string }[] = [
  {
    serviceId: 'disability-pension',
    name: '장애인연금',
    badge: '소득인정액 미확인',
    tone: 'orange',
    reason: '소득인정액이 선정기준액 이하인지 확인이 필요해요.',
  },
  {
    serviceId: 'activity-support',
    name: '장애인 활동지원',
    badge: '장기요양 수급 여부 확인',
    tone: 'orange',
    reason: '노인장기요양 급여를 받고 있다면 함께 받기 어려워요.',
  },
  {
    serviceId: 'special-transport',
    name: '특별교통수단 이용등록',
    badge: '이동 정도 확인 필요',
    tone: 'orange',
    reason: '보행상 장애 정도에 따라 이용 대상이 정해져요.',
  },
  {
    serviceId: 'assistive-devices',
    name: '장애인 보조기기 급여',
    badge: '처방전 필요',
    tone: 'gray',
    reason: '의사 처방전이 있어야 급여를 신청할 수 있어요.',
  },
]

/** 15 해당 불충족 항목 */
export function UnmetServicesPage() {
  const navigate = useNavigate()

  return (
    <FlowLayout step={3} backTo="/services" backLabel="남은 신청 목록으로">
      <PageTitle
        title="대상이 아닐 수 있는 지원"
        description="조건이 확인되지 않았거나 맞지 않을 수 있는 지원이에요. 항목을 누르면 어떤 조건인지 자세히 볼 수 있어요."
      />

      <div className="-mt-1 flex flex-col gap-6">
        <ul className="overflow-hidden rounded-[10px] border border-gray-200">
          {UNMET.map((item) => (
            <li key={item.serviceId} className="border-b border-gray-200 last:border-b-0">
              <Link
                to={`/services/${item.serviceId}`}
                className="flex items-center gap-4 bg-white py-5 pr-5 pl-6 hover:bg-gray-50"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[17px] font-bold">{item.name}</span>
                    <Badge tone={item.tone}>{item.badge}</Badge>
                  </div>
                  <p className="text-[14px] text-gray-700">{item.reason}</p>
                </div>
                <img src={chevronRightIcon} alt="" width={20} height={20} />
              </Link>
            </li>
          ))}
        </ul>

        <InfoNote>
          이 목록은 지금까지 입력한 정보를 바탕으로 만들었어요. 상황이 바뀌면 다시 확인해 주세요.
        </InfoNote>

        <div className="flex gap-3">
          <Button variant="secondary" className="w-[190px] shrink-0" onClick={() => navigate('/confirm')}>
            입력 정보 수정하기
          </Button>
          <Button className="flex-1" onClick={() => navigate('/services')}>
            남은 신청 목록으로
          </Button>
        </div>
      </div>
    </FlowLayout>
  )
}
