import { useState } from 'react'
import { useNavigate } from 'react-router'
import checkCircleIcon from '../../assets/icons/check-circle.svg'
import { Card } from '../../components/results/Card'
import { ResultQuestionCard } from '../../components/results/ResultQuestionCard'
import { StatusChangeModal } from '../../components/results/StatusChangeModal'
import { LaterCard } from '../../components/results/LaterCard'
import { OfficeGroupCard } from '../../components/results/OfficeGroupCard'
import { PageTitle, ResultsLayout } from '../../components/results/ResultsLayout'
import { SituationSummaryLink } from '../../components/results/SituationSummaryLink'
import { TodoCard } from '../../components/results/TodoCard'
import { OFFICES, STATUS_TABS, type StatusTab } from '../../data/results'
import { formatMonthDay } from '../../results/progress'
import { useResults } from '../../results/ResultsContext'

/** 13 남은 신청 · 0건일 때 · 신청 후 · A2 다시 방문 (API: POST /judge · GET /offices · GET /meta · GET /me/progress) */
export function ResultsPage() {
  const navigate = useNavigate()
  const { remaining, applied, isReturnVisit, setStage } = useResults()
  const [tab, setTab] = useState<StatusTab>('all')
  // A2: 다시 방문했을 때 심사 대기 중인 신청 하나의 결과를 물음. 아직이에요를 누르면 이번 방문 동안 숨김
  const [notYet, setNotYet] = useState<string[]>([])
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const asking = isReturnVisit ? applied.find((a) => a.stage === 'submitted' && !notYet.includes(a.benefit.id)) : undefined
  const savedText = isReturnVisit && applied.length > 0 ? `${formatMonthDay(applied[0].submittedAt)}에 저장한 기록` : undefined

  const count = (t: StatusTab) => (t === 'all' ? remaining.length : remaining.filter((b) => b.status === t).length)
  const visible = tab === 'all' ? remaining : remaining.filter((b) => b.status === tab)
  const groups = [
    ...OFFICES.map((office) => ({ office, benefits: visible.filter((b) => b.officeId === office.id) })),
    { office: null, benefits: visible.filter((b) => b.officeId === null) },
  ].filter((g) => g.benefits.length > 0)

  // 지금 할 일: 신청 전 항목이 가장 많은 접수처 (없으면 남은 신청이 가장 많은 곳)
  const todo = OFFICES.map((office) => {
    const atOffice = remaining.filter((b) => b.officeId === office.id)
    return { office, count: atOffice.length, before: atOffice.filter((b) => b.status === 'before').length }
  }).sort((a, b) => b.before - a.before || b.count - a.count)[0]

  const tabs =
    remaining.length > 0 ? (
      <div role="tablist" aria-label="상태별로 보기" className="flex flex-wrap gap-7 pt-1">
        {STATUS_TABS.map(({ value, label }) => {
          const active = tab === value
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(value)}
              className={`flex h-12 items-center gap-1.5 text-17 ${
                active ? 'border-b-3 border-primary font-bold text-text-strong' : 'font-medium text-text-sub hover:text-text'
              }`}
            >
              {label}
              <span className={active ? 'text-primary' : ''}>{count(value)}</span>
            </button>
          )
        })}
      </div>
    ) : null

  return (
    <ResultsLayout
      title={<PageTitle>남은 신청</PageTitle>}
      titleAside={<SituationSummaryLink text={savedText} />}
      below={tabs}
      aside={
        <>
          {todo && todo.count > 0 && <TodoCard office={todo.office} count={todo.count} />}
          <LaterCard />
        </>
      }
    >
      {asking && (
        <ResultQuestionCard
          benefit={asking.benefit}
          submittedAt={asking.submittedAt}
          onAnswerYes={() => setConfirmingId(asking.benefit.id)}
          onAnswerNotYet={() => setNotYet((prev) => [...prev, asking.benefit.id])}
        />
      )}
      {confirmingId && (
        <StatusChangeModal
          benefitName={applied.find((a) => a.benefit.id === confirmingId)?.benefit.name ?? ''}
          onCancel={() => setConfirmingId(null)}
          onConfirm={() => {
            setStage(confirmingId, 'approved')
            setConfirmingId(null)
          }}
        />
      )}

      {remaining.length === 0 ? (
        <Card className="items-center gap-5 px-10 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary-100">
            <img src={checkCircleIcon} alt="" width={32} height={32} />
          </span>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-24 font-bold text-text-strong">지금 신청할 것이 없어요</h2>
            <p className="text-17 text-text">결과가 나오면 신청 기록에서 적어 주세요.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(applied.length > 0 ? `/history/${applied[0].benefit.id}` : '/results')}
              disabled={applied.length === 0}
              className="flex h-12 items-center rounded-xl bg-primary px-5 text-15 font-bold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-sub"
            >
              신청 기록 보기
            </button>
            <button
              type="button"
              onClick={() => navigate('/situation/place')}
              className="flex h-12 items-center rounded-xl border border-border bg-surface px-5 text-15 font-medium text-text-strong hover:bg-bg-sidebar"
            >
              상황 고치기
            </button>
          </div>
        </Card>
      ) : (
        groups.map((g) => <OfficeGroupCard key={g.office?.id ?? 'recruit'} office={g.office} benefits={g.benefits} />)
      )}
    </ResultsLayout>
  )
}
