import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router'
import checkBlueIcon from '../assets/icons/check-blue.svg'
import chevronRightSmIcon from '../assets/icons/chevron-right-sm.svg'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, InfoNote } from '../components/Card'
import { CheckItem } from '../components/CheckItem'
import { FlowLayout } from '../components/FlowLayout'
import { RelocationDialog } from '../components/RelocationDialog'
import { StatusChangeDialog } from '../components/StatusChangeDialog'
import { MOCK_USER, SERVICES, STATUS_META } from '../data/services'
import { useFlow } from '../flow/FlowContext'

const STEPS = ['준비', '접수', '심사·보완', '결과', '이용 준비']

// TODO: 신청 진행 API 결과로 교체
const MOCK_PROGRESS = {
  current: 2,
  todos: [
    '심사 결과 통보를 기다리고 있어요',
    '추가 서류 요청이 오면 14일 안에 제출해야 해요',
    '담당자에게 연락이 오면 바로 확인해 주세요',
  ],
  documents: [
    { name: '장애인등록증 사본', needsCheck: false, done: true },
    { name: '건강보험료 납부 확인서', needsCheck: true, done: false },
    { name: '주민등록등본', needsCheck: true, done: false },
  ],
  where: [
    { label: '담당 기관', value: '주소지 읍·면·동 행정복지센터 (기흥구)' },
    { label: '접수 방법', value: '방문 또는 복지로 온라인 신청' },
    { label: '담당 창구', value: '복지서비스팀 (1층 3번 창구)' },
  ],
  baseDate: '2026-10-31',
}

function CardTitle({ children }: { children: string }) {
  return <h2 className="text-[17px] font-bold">{children}</h2>
}

const inputClass =
  'h-[50px] min-w-0 flex-1 rounded-lg border border-gray-300 px-4 text-[15px] placeholder:text-gray-500 focus:border-primary focus:outline-none'

interface ServiceStepsPageProps {
  /** status: 18 상태 변경 확인, relocation: 20 거주지 변경 확인 */
  modal?: 'status' | 'relocation'
}

/** 16 신청 단계 카드 (+ 18·20 모달) */
export function ServiceStepsPage({ modal }: ServiceStepsPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { serviceId } = useParams()
  const { state, update } = useFlow()
  const service = SERVICES.find((s) => s.id === serviceId)
  const p = MOCK_PROGRESS
  const [docs, setDocs] = useState(p.documents)
  const [supplement, setSupplement] = useState('')
  const [statusText, setStatusText] = useState('')
  if (!service) return <Navigate to="/services" replace />

  const meta = STATUS_META[service.status]
  const base = `/services/${service.id}`
  const closeModal = () => navigate(`${base}/steps`)
  const evidence = (location.state as { text?: string } | null)?.text || '오늘 장애인연금 신청서를 냈어요'

  return (
    <FlowLayout step={4} backTo="/services" backLabel="남은 신청 목록으로" wide>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-[32px] leading-[1.35] font-bold">{service.name}</h1>
          <Badge tone={meta.tone}>{meta.badge}</Badge>
        </div>
        <p className="text-[14px] text-gray-700">
          신청 대상자: {MOCK_USER.name} (본인) · 사용자 입력 기준이며 기관의 확인 상태와는 구분돼요
        </p>
      </div>

      <section className="flex flex-col gap-4 rounded-[10px] bg-gray-50 px-6 pt-5 pb-[22px]">
        <div className="flex items-start justify-between font-bold">
          <h2 className="text-[16px]">신청 단계</h2>
          <p className="text-[14px] text-primary">
            {p.current} / {STEPS.length} 단계
          </p>
        </div>
        <ol className="flex gap-2">
          {STEPS.map((label, i) => {
            const step = i + 1
            const done = step < p.current
            const active = step === p.current
            return (
              <li
                key={label}
                aria-current={active ? 'step' : undefined}
                className="flex min-w-0 flex-1 flex-col gap-2.5"
              >
                <div className={`h-1.5 rounded-[3px] ${step <= p.current ? 'bg-primary' : 'bg-gray-200'}`} />
                <p
                  className={`flex items-center gap-1.5 text-[15px] ${
                    active ? 'font-bold' : done ? 'font-medium' : 'font-medium text-gray-500'
                  }`}
                >
                  {done && <img src={checkBlueIcon} alt="완료" width={16} height={16} />}
                  {step}. {label}
                </p>
              </li>
            )
          })}
        </ol>
      </section>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <Card className="flex flex-col gap-3.5">
            <CardTitle>지금 해야 할 일</CardTitle>
            <ul className="text-[15px] leading-[1.8] text-gray-700">
              {p.todos.map((todo) => (
                <li key={todo}>· {todo}</li>
              ))}
            </ul>
          </Card>

          <Card className="flex flex-col gap-2.5">
            <CardTitle>준비 서류</CardTitle>
            {docs.map((doc, i) => (
              <CheckItem
                key={doc.name}
                label={doc.name}
                checked={doc.done}
                dimWhenChecked
                onChange={(done) => setDocs((prev) => prev.map((d, j) => (j === i ? { ...d, done } : d)))}
                trailing={doc.needsCheck && !doc.done ? <Badge tone="orange">확인 필요</Badge> : null}
              />
            ))}
            <p className="text-[13px] text-gray-500">실제 필요한 서류는 창구에서 최종 확인해 주세요.</p>
          </Card>

          <Card className="flex flex-col gap-3">
            <CardTitle>보완 요청이 왔나요?</CardTitle>
            <p className="text-[14px] text-gray-700">
              추가 서류 제출이나 보완 요청을 받았다면 내용을 적어 주세요.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                navigate(`${base}/supplement`, { state: { note: supplement } })
              }}
            >
              <input
                aria-label="보완 요청 내용"
                value={supplement}
                onChange={(e) => setSupplement(e.target.value)}
                placeholder="보완 요청 내용을 입력하세요"
                className={inputClass}
              />
              <Button type="submit" variant="secondary" className="h-[50px] shrink-0 px-[18px] text-[15px]">
                보완 요청 입력
              </Button>
            </form>
          </Card>

          <Card className="flex flex-col gap-3">
            <CardTitle>진행 상황 업데이트</CardTitle>
            <p className="text-[14px] text-gray-700">
              신청서를 냈거나 결과를 받았다면 적어 주세요. 이 서비스는 입력하신 내용으로만 상태를 바꿔요.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                navigate(`${base}/status`, { state: { text: statusText } })
              }}
            >
              <input
                aria-label="진행 상황"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                placeholder="예: 오늘 신청서를 냈어요, 승인됐대요"
                className={inputClass}
              />
              <Button type="submit" className="h-[50px] shrink-0 px-[18px] text-[15px]">
                상태 변경하기
              </Button>
            </form>
          </Card>
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-[320px] lg:shrink-0">
          <Card className="flex flex-col gap-3.5">
            <CardTitle>어디서 진행하나요</CardTitle>
            {p.where.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <p className="text-[13px] text-gray-500">{row.label}</p>
                <p className="text-[15px] font-medium">{row.value}</p>
              </div>
            ))}
            <p className="text-[13px] text-gray-500">기준일 {p.baseDate}</p>
          </Card>

          <Card className="flex flex-col">
            <CardTitle>정보 수정</CardTitle>
            {[
              { label: '서비스·대상자 정정', to: `${base}/correct` },
              { label: '거주지 변경', to: `${base}/relocation` },
            ].map((link, i) => (
              <Link
                key={link.label}
                to={link.to}
                className={`flex items-center justify-between py-3.5 text-[15px] font-medium hover:text-primary ${
                  i === 0 ? 'border-b border-gray-200' : ''
                }`}
              >
                {link.label}
                <img src={chevronRightSmIcon} alt="" width={18} height={18} />
              </Link>
            ))}
          </Card>
        </aside>
      </div>

      <InfoNote>
        이 화면의 정보는 입력하신 내용을 기준으로 하며, 행정기관과 실시간으로 연동되지 않아요. 실제 자격과
        결과는 담당 창구에서 최종 확인해 주세요.
      </InfoNote>

      {modal === 'status' && (
        // TODO: 입력 문장에서 서비스·상태를 추출하는 API 결과로 교체
        <StatusChangeDialog
          serviceName="장애인연금"
          before="신청 전"
          after="접수·결과 대기"
          evidence={evidence}
          onConfirm={closeModal}
          onClose={closeModal}
        />
      )}
      {modal === 'relocation' && (
        <RelocationDialog
          initialGu={state.gu}
          onConfirm={(gu, dong) => {
            update({ gu, dong })
            closeModal()
          }}
          onClose={closeModal}
        />
      )}
    </FlowLayout>
  )
}
