import { useState } from 'react'
import chevronDownIcon from '../../assets/icons/chevron-down.svg'
import externalLinkIcon from '../../assets/icons/external-link-14.svg'
import type { Benefit } from '../../data/results'
import { Card } from './Card'

type EvidenceData = NonNullable<Benefit['detail']>['evidence']

/**
 * 근거 원문 (Figma: L2 상세 · 근거 원문 펼침 / 근거 찾는 중)
 * 근거를 아직 못 찾았으면(null) "찾는 중"으로 접힌 채 보임
 */
export function EvidenceCard({
  evidence,
  tagValue,
  failed = false,
}: {
  evidence: EvidenceData
  tagValue: (tag: string) => string
  /** GET /basis 실패 (E502 등) */
  failed?: boolean
}) {
  const [open, setOpen] = useState(false)
  const searching = evidence === null
  // 서버가 인용을 0개로 주는 서비스가 있음 (원문 데이터 없음)
  const empty = evidence !== null && evidence.items.length === 0

  return (
    <Card>
      <div className={`flex items-center gap-2 px-6 pt-[18px] ${open ? 'pb-3' : 'pb-[18px]'}`}>
        <h2 className="text-22 font-bold text-text-strong">근거 원문</h2>
        <span className="flex-1" />
        <span className="flex h-[26px] items-center gap-1 rounded-lg bg-neutral-100 px-2 text-13 font-medium text-text">
          <img src={externalLinkIcon} alt="" width={14} height={14} />
          {/* TODO: 근거를 못 불러왔을 때 디자인이 없어 칩 글자만 바꿈 */}
          {failed
            ? '근거를 불러오지 못했어요'
            : searching
              ? '복지로 · 찾는 중'
              : empty
                ? '확인된 원문이 없어요'
                : `${evidence.source} · ${evidence.checkedAt} 확인`}
        </span>
        <button
          type="button"
          disabled={searching || empty}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="evidence-list"
          aria-label={open ? '근거 원문 접기' : '근거 원문 펼치기'}
          className="flex size-5 items-center justify-center disabled:opacity-40"
        >
          <img src={chevronDownIcon} alt="" width={20} height={20} className={open ? 'rotate-180' : ''} />
        </button>
      </div>

      {open && evidence && (
        <ul id="evidence-list" className="flex flex-col gap-5 px-6 pt-1 pb-6">
          {evidence.items.map((item) => (
            <li key={item.quote[0]} className="flex gap-3.5">
              <span className="w-[3px] shrink-0 self-stretch rounded-[2px] bg-primary-200" aria-hidden />
              <div className="flex min-w-0 flex-1 flex-col gap-2 py-px">
                <blockquote className="text-17 text-text-strong">
                  {item.quote.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </blockquote>
                <p className="flex items-center gap-2">
                  <span className="flex h-6 items-center rounded-md bg-primary-100 px-2 text-13 font-bold text-primary">
                    {item.tag} · {tagValue(item.tag)}
                  </span>
                  <span className="text-14 text-text-sub">{item.kind}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
