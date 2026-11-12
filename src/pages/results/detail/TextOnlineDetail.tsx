import { useState } from 'react'
import { useNavigate } from 'react-router'
import contactMessageIcon from '../../../assets/icons/contact-message.svg'
import contactOnlineIcon from '../../../assets/icons/contact-online.svg'
import contactVisitIcon from '../../../assets/icons/contact-visit.svg'
import copyIcon from '../../../assets/icons/copy.svg'
import externalLinkWhiteIcon from '../../../assets/icons/external-link-white.svg'
import windowIcon from '../../../assets/icons/window.svg'
import { Card, CardHeader } from '../../../components/results/Card'
import { ContactRow, VerdictBadge } from '../../../components/results/ModeParts'
import { PageTitle, ResultsLayout } from '../../../components/results/ResultsLayout'
import { SubmitModal } from '../../../components/results/SubmitModal'
import { BenefitTile } from '../../../components/results/Tiles'
import { StatusChip } from '../../../components/StatusChip'
import { getOffice, type Benefit, type Verdict } from '../../../data/results'
import { useResults } from '../../../results/ResultsContext'
import { shortAddress, textMessageLines } from '../../../results/modeText'
import { describeAge, describeDisability, describeIncome } from '../../../situation/describe'
import { useSituation } from '../../../situation/SituationContext'

const SECONDARY = 'flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-15 font-medium text-text-strong hover:bg-bg-sidebar'

/** M2 문자·온라인 — 전화 없이 신청하는 길을 먼저 (API: POST /judge · GET /services/{id}/basis · GET /services/{id}/steps · GET /offices) */
export function TextOnlineDetail({ benefit }: { benefit: Benefit }) {
  const navigate = useNavigate()
  const { situation } = useSituation()
  const { submit } = useResults()
  const [copied, setCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const office = getOffice(benefit.officeId)
  const onlineUrl = benefit.detail?.onlineUrl
  const message = textMessageLines(benefit)

  const facts =
    benefit.textOnline?.facts ?? benefit.detail?.amount?.map(({ label, value }) => ({ label, value: `월 ${value}`, unit: '만원' })) ?? []
  const mine = { age: describeAge(situation), disability: describeDisability(situation), income: describeIncome(situation) }
  const reasons: { condition: string; criteria: string; mine: string; verdict: Verdict }[] =
    benefit.textOnline?.reasons ??
    // TODO: 판정 결과는 POST /judge 응답으로
    benefit.detail?.reasons.map((r) => ({ condition: r.condition, criteria: r.criteria, mine: mine[r.field], verdict: 'ok' as const })) ??
    []

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.join('\n'))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

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
      aside={
        <>
          <Card className="gap-4 p-6">
            {onlineUrl && (
              <a
                href={onlineUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-17 font-bold text-white hover:bg-primary/90"
              >
                <img src={externalLinkWhiteIcon} alt="" width={20} height={20} />
                온라인으로 신청
              </a>
            )}
            {office && (
              <button type="button" onClick={() => setSubmitting(true)} className={SECONDARY}>
                신청했어요
              </button>
            )}
          </Card>
          {benefit.textOnline?.form && (
            <Card className="gap-1.5 p-6">
              <p className="text-13 font-medium text-text-sub">신청서</p>
              <p className="text-17 font-medium text-text-strong">
                {benefit.textOnline.form.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </Card>
          )}
        </>
      }
    >
      {facts.length > 0 && (
        <section aria-label="한눈에 보기" className="flex flex-wrap items-center gap-7 rounded-[20px] bg-primary px-7 pt-5 pb-6 text-on-primary">
          {facts.map(({ label, value, unit }, i) => (
            <div key={label} className="flex items-center gap-7">
              {i > 0 && <span className="h-10 w-px bg-on-primary" aria-hidden />}
              <div className="flex flex-col gap-0.5">
                <p className="text-13 font-medium">{label}</p>
                {unit ? (
                  <p className="flex h-10 items-baseline gap-[3px]">
                    <span className="text-28 font-bold">{value}</span>
                    <span className="text-17 font-medium">{unit}</span>
                  </p>
                ) : (
                  <p className="flex h-10 items-end pb-[5px] text-22 font-bold">{value}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      <Card>
        <CardHeader title="연락하고 신청하는 방법" />
        <ul className="flex flex-col border-t border-divider">
          {onlineUrl && (
            <li className="flex items-center gap-4 border-b border-divider px-6 py-4">
              <ContactRow icon={contactOnlineIcon} title="온라인 신청" description="복지로에서 신청서를 내요" />
              <a href={onlineUrl} target="_blank" rel="noreferrer" className={SECONDARY}>
                <img src={windowIcon} alt="" width={20} height={20} />
                복지로 열기
              </a>
            </li>
          )}
          <li className="flex items-center gap-4 border-b border-divider px-6 py-4">
            <ContactRow icon={contactMessageIcon} title="107 손말이음센터" description="문자나 수어로 말하면 대신 전화해 줘요 · 24시간 · 무료" />
            <a href={`sms:107?body=${encodeURIComponent(message.join('\n'))}`} className={SECONDARY}>
              107에 문자 보내기
            </a>
          </li>
          {office && (
            <li className="flex items-center gap-4 border-b border-divider px-6 py-4">
              <ContactRow icon={contactVisitIcon} title="직접 방문" description={`${office.name} · ${shortAddress(office)}`} />
              <button type="button" onClick={() => navigate(`/results/locations?office=${office.id}`)} className={SECONDARY}>
                위치 보기
              </button>
            </li>
          )}
        </ul>
        {office && <p className="px-6 pt-3 pb-3.5 text-14 text-text-sub">전화 {office.phone}</p>}
      </Card>

      <Card>
        <CardHeader title="문자로 보낼 말">
          <button
            type="button"
            onClick={copy}
            className="flex h-10 items-center gap-2 rounded-[10px] border border-border bg-surface px-3.5 text-15 font-medium text-text-strong hover:bg-bg-sidebar"
          >
            <img src={copyIcon} alt="" width={16} height={16} />
            {copied ? '복사했어요' : '복사'}
          </button>
        </CardHeader>
        <div className="px-6 pb-6">
          <p className="rounded-xl bg-bg-page px-4 py-3.5 text-17 text-text-strong">
            {message.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </Card>

      {reasons.length > 0 && (
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
              {reasons.map((r) => (
                <tr key={r.condition} className="border-b border-divider last:border-b-0">
                  <td className="py-[13px] pl-6">
                    <p className="text-17 font-bold text-text-strong">{r.condition}</p>
                    <p className="text-17 text-text">{r.criteria}</p>
                  </td>
                  <td className="py-[13px] pl-4 text-17 font-medium text-text-strong">{r.mine}</td>
                  <td className="py-[13px] pr-6 pl-4">
                    <VerdictBadge verdict={r.verdict} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="h-1.5" />
        </Card>
      )}

      {submitting && office && (
        <SubmitModal
          office={office}
          benefits={[benefit]}
          onCancel={() => setSubmitting(false)}
          onSubmit={(ids) => {
            submit(ids)
            setSubmitting(false)
            navigate('/results')
          }}
        />
      )}
    </ResultsLayout>
  )
}
