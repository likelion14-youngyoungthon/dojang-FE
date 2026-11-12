import { useState, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import checkSuccessIcon from '../../assets/icons/check-success.svg'
import { Card, CardHeader, KeyValueList } from '../../components/results/Card'
import { EvidenceCard } from '../../components/results/EvidenceCard'
import { OfficeInfoCard } from '../../components/results/OfficeInfoCard'
import { PageTitle, ResultsLayout } from '../../components/results/ResultsLayout'
import { BenefitTile } from '../../components/results/Tiles'
import { StatusChip } from '../../components/StatusChip'
import { getBenefit, getOffice, type Benefit, type Reason } from '../../data/results'
import { useSession } from '../../session/SessionContext'
import { describeAge, describeDisability, describeIncome } from '../../situation/describe'
import { useSituation } from '../../situation/SituationContext'
import { EasyDetail } from './detail/EasyDetail'
import { LargeDetail } from './detail/LargeDetail'
import { TextOnlineDetail } from './detail/TextOnlineDetail'
import { EasyToggle } from './detail/EasyToggle'

/** 복지 상세 — 맞춤 화면에 따라 L2(기본) · M1 큰 글씨 · M2 문자·온라인 · M3 쉬운 말 */
export function BenefitDetailPage() {
  const { benefitId } = useParams()
  const { mode } = useSession()
  const [plain, setPlain] = useState(false)
  const benefit = getBenefit(benefitId)
  if (!benefit) return <Navigate to="/results" replace />

  if (mode === '큰 글씨') return <LargeDetail benefit={benefit} />
  if (mode === '문자·온라인') return <TextOnlineDetail benefit={benefit} />
  if (mode === '쉬운 말' && benefit.easy) {
    // 쉬운 말 ↔ 원문: 원문은 기본 상세를 그대로 보여 줌
    const toggle = <EasyToggle plain={plain} onChange={setPlain} />
    return plain ? <DefaultDetail benefit={benefit} titleAside={toggle} /> : <EasyDetail benefit={benefit} toggle={toggle} />
  }
  return <DefaultDetail benefit={benefit} />
}

/** L2 상세 · 근거 원문 펼침 · 근거 찾는 중 */
function DefaultDetail({ benefit, titleAside }: { benefit: Benefit; titleAside?: ReactNode }) {
  const navigate = useNavigate()
  const { situation } = useSituation()
  const office = getOffice(benefit.officeId)
  const detail = benefit.detail
  const mine: Record<Reason['field'], string> = {
    age: describeAge(situation),
    disability: describeDisability(situation),
    income: describeIncome(situation),
  }
  const tagValue = (tag: string) => (tag === '나이' ? mine.age : tag === '장애 유형' ? mine.disability : mine.income)

  return (
    <ResultsLayout
      back={{ label: '남은 신청', to: '/results' }}
      title={
        <div className="flex flex-wrap items-center gap-3">
          <BenefitTile kind={benefit.icon} />
          <PageTitle>{benefit.name}</PageTitle>
          <StatusChip status={benefit.status} />
        </div>
      }
      titleAside={titleAside}
      aside={
        office && (
          <>
            <Card className="p-6">
              <button
                type="button"
                onClick={() => navigate(`/results/prepare/${office.id}`)}
                className="flex h-14 w-full items-center justify-center rounded-xl bg-primary px-6 text-17 font-bold text-white hover:bg-primary/90"
              >
                창구 준비하기
              </button>
            </Card>
            <OfficeInfoCard office={office} onlineUrl={detail?.onlineUrl} />
          </>
        )
      }
    >
      {detail?.amount && (
        <section aria-label="지원 금액" className="flex flex-wrap items-center gap-7 rounded-[20px] bg-primary px-7 pt-5 pb-6 text-on-primary">
          {detail.amount.map(({ label, value }, i) => (
            <div key={label} className="flex items-center gap-7">
              {i > 0 && <span className="h-10 w-px bg-on-primary" aria-hidden />}
              <div className="flex flex-col gap-0.5">
                <p className="text-13 font-medium">{label}</p>
                <p className="flex h-10 items-baseline gap-[3px]">
                  <span className="text-17 font-medium">월</span>
                  <span className="text-28 font-bold">{value}</span>
                  <span className="text-17 font-medium">만원</span>
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      <Card>
        <CardHeader title="요약" />
        <div className="px-6 pb-2.5">
          <KeyValueList
            rows={
              detail?.rows ?? [
                { label: '무엇을', value: benefit.summary },
                // TODO: 상세 정보 API 연동 전이라 나머지 칸은 비어 있음
                { label: '접수처', value: office?.name ?? '모집 기간에만 신청' },
              ]
            }
          />
        </div>
      </Card>

      {detail && detail.reasons.length > 0 && (
        <Card>
          <CardHeader title="받을 수 있는 이유" />
          <table className="w-full text-left">
            <thead className="bg-bg-page">
              <tr className="text-13 font-medium text-text-sub">
                <th scope="col" className="py-2.5 pl-6 font-medium">
                  조건 <span className="text-14 font-normal">·</span> 기준
                </th>
                <th scope="col" className="w-[140px] py-2.5 pl-4 font-medium">
                  내 상황
                </th>
                <th scope="col" className="w-[116px] py-2.5 pr-6 pl-4 font-medium">
                  판정
                </th>
              </tr>
            </thead>
            <tbody>
              {detail.reasons.map((r) => (
                <tr key={r.condition} className="border-b border-divider last:border-b-0">
                  <td className="py-[13px] pl-6">
                    <p className="text-17 font-bold text-text-strong">{r.condition}</p>
                    <p className="text-17 text-text">{r.criteria}</p>
                  </td>
                  <td className="py-[13px] pl-4 text-17 font-medium text-text-strong">{mine[r.field]}</td>
                  <td className="py-[13px] pr-6 pl-4">
                    {/* TODO: 판정 결과(맞아요/확인 필요 등)는 POST /judge 응답으로 */}
                    <span className="inline-flex h-[26px] items-center gap-1 rounded-lg bg-success-100 pr-2 pl-1.5 text-13 font-bold text-success">
                      <img src={checkSuccessIcon} alt="" width={14} height={14} />
                      맞아요
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="h-1.5" />
        </Card>
      )}

      <EvidenceCard evidence={detail?.evidence ?? null} tagValue={tagValue} />
    </ResultsLayout>
  )
}
