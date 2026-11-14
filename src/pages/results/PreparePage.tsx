import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import checkWhiteIcon from '../../assets/icons/check-white-14.svg'
import chevronDownIcon from '../../assets/icons/chevron-down.svg'
import downloadIcon from '../../assets/icons/download.svg'
import printerIcon from '../../assets/icons/printer.svg'
import { Card, CardHeader } from '../../components/results/Card'
import { OfficeInfoCard } from '../../components/results/OfficeInfoCard'
import { PageTitle, ResultsLayout } from '../../components/results/ResultsLayout'
import { SubmitModal } from '../../components/results/SubmitModal'
import { getOffice } from '../../data/results'
import { useResults } from '../../results/ResultsContext'

/** 26 창구에 가져갈 것 · 낸 신청 고르기(확인 창) */
export function PreparePage() {
  const { officeId } = useParams()
  const navigate = useNavigate()
  const { remaining, packed, togglePacked, submit } = useResults()
  const [formsOpen, setFormsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const office = getOffice(officeId ?? null)
  if (!office) return <Navigate to="/results" replace />

  const benefits = remaining.filter((b) => b.officeId === office.id)
  // 같은 서류는 한 줄로 합치고 어느 신청에 쓰는지 이어 붙임
  const documents = Object.values(
    benefits
      .flatMap((b) => b.documents ?? [])
      .reduce<Record<string, { name: string; note: string }>>((acc, d) => {
        acc[d.name] = acc[d.name] ? { name: d.name, note: `${acc[d.name].note} · ${d.note}` } : d
        return acc
      }, {}),
  )
  // 창구에서 쓰는 신청서: judge form_names (중복 제거). 판정 전 예시 값은 '서비스명 신청서'
  const forms = [...new Set(benefits.flatMap((b) => b.formNames ?? [`${b.name} 신청서`]))]

  // TODO: 서버에서 PDF로 받기 — 지금은 글자 파일로 내려받음
  const handleDownload = () => {
    const text = [
      `${office.name} · 창구에 가져갈 것`,
      '',
      '[집에서 챙겨 갈 것]',
      ...documents.map((d) => `- ${d.name} (${d.note})`),
      '',
      '[신청하러 온 것]',
      ...benefits.map((b) => `- ${b.name}`),
      '',
      `주소: ${office.addressLines.join(' ')}`,
      `전화: ${office.phone}`,
    ].join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `${office.name}_가져갈것.txt` })
    a.click()
    URL.revokeObjectURL(url)
  }

  const toolButton =
    'flex h-10 items-center gap-2 rounded-[10px] border border-border bg-surface px-3.5 text-15 font-medium text-text-strong hover:bg-bg-sidebar'

  return (
    <ResultsLayout
      back={{ label: office.name, to: '/results' }}
      title={<PageTitle>창구에 가져갈 것</PageTitle>}
      titleAside={
        <div className="flex gap-2">
          <button type="button" onClick={() => window.print()} className={toolButton}>
            <img src={printerIcon} alt="" width={16} height={16} />
            인쇄
          </button>
          <button type="button" onClick={handleDownload} className={toolButton}>
            <img src={downloadIcon} alt="" width={16} height={16} />
            내려받기
          </button>
        </div>
      }
      aside={
        <>
          <Card className="p-6">
            <button
              type="button"
              disabled={benefits.length === 0}
              onClick={() => setModalOpen(true)}
              aria-haspopup="dialog"
              className="flex h-14 w-full items-center justify-center rounded-xl bg-primary px-6 text-17 font-bold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-sub"
            >
              신청했어요
            </button>
          </Card>
          {benefits.length > 0 && (
            <Card className="gap-3.5 p-6">
              <p className="text-13 font-bold text-primary">창구에 보여 주세요</p>
              <p className="text-22 font-bold text-text-strong">아래 {benefits.length}건을 신청하러 왔어요.</p>
              <ul className="flex flex-col gap-1.5">
                {benefits.map((b) => (
                  <li key={b.id} className="flex items-center gap-2.5 text-17 font-medium text-text-strong">
                    <span className="size-[5px] shrink-0 rounded-[3px] bg-primary" aria-hidden />
                    {b.name}
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <OfficeInfoCard office={office} />
        </>
      }
    >
      <Card>
        <CardHeader title="집에서 챙겨 갈 것" count={`${documents.length}가지`} />
        {documents.length === 0 && <p className="border-t border-divider px-6 py-4 text-15 text-text-sub">따로 챙길 서류가 없어요.</p>}
        <ul>
          {documents.map((d) => {
            const checked = packed.includes(d.name)
            return (
              <li key={d.name} className="border-t border-divider">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => togglePacked(d.name)}
                  className="flex w-full items-center gap-3.5 px-6 py-[13px] text-left hover:bg-bg-sidebar"
                >
                  {checked ? (
                    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md bg-primary">
                      <img src={checkWhiteIcon} alt="" width={14} height={14} />
                    </span>
                  ) : (
                    <span className="size-[22px] shrink-0 rounded-md border-[1.5px] border-border bg-surface" />
                  )}
                  <span className={`flex min-w-0 flex-1 flex-col ${checked ? 'text-text-sub' : ''}`}>
                    <span className={`text-17 font-medium ${checked ? '' : 'text-text-strong'}`}>{d.name}</span>
                    <span className="text-14 text-text-sub">{d.note}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card>
        <button
          type="button"
          onClick={() => setFormsOpen((v) => !v)}
          aria-expanded={formsOpen}
          aria-controls="forms-list"
          className="flex w-full items-center gap-2 px-6 py-[18px] text-left"
        >
          <span className="text-22 font-bold text-text-strong">창구에서 쓰는 신청서</span>
          <span className="text-17 font-bold text-primary">{forms.length}장</span>
          <span className="flex-1" />
          <img src={chevronDownIcon} alt="" width={20} height={20} className={formsOpen ? 'rotate-180' : ''} />
        </button>
        {formsOpen && (
          // TODO: Figma에 펼친 모습이 없어 신청서 이름만 나열
          <ul id="forms-list" className="flex flex-col gap-2 border-t border-divider px-6 py-4">
            {forms.map((name) => (
              <li key={name} className="text-17 text-text">
                {name}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {modalOpen && (
        <SubmitModal
          office={office}
          benefits={benefits}
          onCancel={() => setModalOpen(false)}
          onSubmit={(ids) => {
            submit(ids)
            setModalOpen(false)
            navigate('/results')
          }}
        />
      )}
    </ResultsLayout>
  )
}
