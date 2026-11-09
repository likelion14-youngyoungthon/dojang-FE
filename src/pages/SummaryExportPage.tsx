import { useState } from 'react'
import { useNavigate } from 'react-router'
import accessibilityGrayIcon from '../assets/icons/accessibility-gray.svg'
import downloadWhiteIcon from '../assets/icons/download-white.svg'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CheckItem } from '../components/CheckItem'
import { FlowLayout } from '../components/FlowLayout'
import { OptionTile } from '../components/OptionTile'
import { MOCK_USER, SERVICES, STATUS_META } from '../data/services'

const SECTIONS = ['대상자 정보', '확정된 사실', '확인이 필요한 항목', '서비스 후보 목록', '신청 진행 상태'] as const
type Section = (typeof SECTIONS)[number]

const FORMATS = ['텍스트 파일 (.txt)', 'PDF 파일 (.pdf)', '화면 공유용 텍스트 복사'] as const
type Format = (typeof FORMATS)[number]

const TODAY = '2026-11-09'

function buildSummary(include: Section[]) {
  const count = (s: keyof typeof STATUS_META) => SERVICES.filter((x) => x.status === s).length
  const rows: { label: string; value: string; warn?: boolean; section: Section }[] = [
    { section: '대상자 정보', label: '대상자', value: `${MOCK_USER.name} (성인 · 지체장애)` },
    { section: '확정된 사실', label: '확정된 사실', value: `${MOCK_USER.region} 거주, 등록장애인(심한 장애)` },
    { section: '확인이 필요한 항목', label: '확인 필요', value: '소득인정액, 현재 수급 여부', warn: true },
    {
      section: '서비스 후보 목록',
      label: '서비스 후보',
      value: `${SERVICES.length}건 — 신청 전 ${count('before')} · 접수·결과 대기 ${count('progress')} · 확인 필요 ${count('check')}`,
    },
    {
      section: '신청 진행 상태',
      label: '신청 진행 상태',
      value: SERVICES.filter((s) => s.status === 'progress')
        .map((s) => `${s.name}: ${STATUS_META[s.status].badge}`)
        .join(', '),
    },
  ]
  return rows.filter((r) => include.includes(r.section))
}

const FOOTNOTE = '이 요약은 이용자가 입력한 내용을 기준으로 해요. 실제 자격과 수급 여부는 관할 창구에서 최종 확인해 주세요.'

/** 26 요약 내보내기 */
export function SummaryExportPage() {
  const navigate = useNavigate()
  const [include, setInclude] = useState<Section[]>([...SECTIONS])
  const [format, setFormat] = useState<Format>(FORMATS[0])
  const [copied, setCopied] = useState(false)
  const rows = buildSummary(include)

  const asText = () =>
    [
      '남은 신청 안내 요약',
      `기준일 ${TODAY} · 용인시 남은 신청 안내`,
      '',
      ...rows.map((r) => `[${r.label}] ${r.value}`),
      '',
      FOOTNOTE,
    ].join('\n')

  const handleExport = async () => {
    if (format === '텍스트 파일 (.txt)') {
      const url = URL.createObjectURL(new Blob([asText()], { type: 'text/plain;charset=utf-8' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `남은신청안내_요약_${TODAY}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'PDF 파일 (.pdf)') {
      // 브라우저 인쇄 창에서 "PDF로 저장" 선택
      window.print()
    } else {
      await navigator.clipboard.writeText(asText())
      setCopied(true)
    }
  }

  return (
    <FlowLayout step={3} backTo="/services" backLabel="남은 신청 목록으로" wide>
      <div className="-mt-1 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] leading-[1.35] font-bold">요약 내보내기</h1>
          <p className="text-[16px] text-gray-700">
            창구에 가져가거나 가족과 공유할 수 있도록 지금까지의 내용을 정리해 드려요.
          </p>
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
            <Card className="flex flex-col gap-2.5">
              <h2 className="text-[17px] font-bold">포함할 내용</h2>
              {SECTIONS.map((section) => (
                <CheckItem
                  key={section}
                  label={section}
                  checked={include.includes(section)}
                  onChange={(checked) =>
                    setInclude((prev) => (checked ? [...prev, section] : prev.filter((s) => s !== section)))
                  }
                />
              ))}
              <p className="text-[13px] text-gray-500">확인이 필요한 항목은 확정 정보와 구분해서 표시돼요.</p>
            </Card>

            <Card className="flex flex-col gap-2.5">
              <h2 className="text-[17px] font-bold">내보내기 형식</h2>
              <div role="radiogroup" aria-label="내보내기 형식" className="flex flex-col gap-2.5">
                {FORMATS.map((f) => (
                  <OptionTile
                    key={f}
                    type="radio"
                    label={f}
                    selected={format === f}
                    onSelect={() => {
                      setFormat(f)
                      setCopied(false)
                    }}
                  />
                ))}
              </div>
            </Card>

            <p className="flex items-start gap-2.5 rounded-lg bg-gray-50 px-4 py-3.5 text-[14px] text-gray-700">
              <img src={accessibilityGrayIcon} alt="" width={18} height={18} className="mt-0.5" />
              화면낭독기를 쓰신다면 텍스트 파일을 권장해요. PDF는 기기에 따라 읽기 어려울 수 있어요.
            </p>
          </div>

          <section className="flex w-full flex-col gap-2.5 lg:w-[460px] lg:shrink-0">
            <h2 className="text-[15px] font-bold text-gray-700">미리보기</h2>
            <article className="flex flex-col gap-3.5 rounded-lg border border-gray-300 bg-white p-7 shadow-[0_2px_8px_rgba(0,0,0,0.06)] print:border-0 print:shadow-none">
              <header className="flex flex-col gap-1 border-b border-gray-200 pb-3.5">
                <h3 className="text-[18px] font-bold">남은 신청 안내 요약</h3>
                <p className="text-[12px] text-gray-500">기준일 {TODAY} · 용인시 남은 신청 안내</p>
              </header>
              {rows.map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <p className={`text-[12px] font-bold ${row.warn ? 'text-warning' : 'text-gray-500'}`}>
                    {row.label}
                  </p>
                  <p className="text-[15px] font-medium">{row.value}</p>
                </div>
              ))}
              {rows.length === 0 && <p className="text-[14px] text-gray-500">포함할 내용을 선택해 주세요.</p>}
              <footer className="border-t border-gray-200 pt-3.5 text-[12px] leading-[1.6] text-gray-500">
                {FOOTNOTE}
              </footer>
            </article>
          </section>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" className="w-[140px] shrink-0" onClick={() => navigate('/services')}>
            건너뛰기
          </Button>
          <Button className="flex-1 gap-2" disabled={rows.length === 0} onClick={handleExport}>
            <img src={downloadWhiteIcon} alt="" width={20} height={20} />
            {copied ? '복사했어요' : '내보내기'}
          </Button>
        </div>
      </div>
    </FlowLayout>
  )
}
