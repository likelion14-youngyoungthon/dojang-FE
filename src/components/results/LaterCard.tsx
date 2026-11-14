import { useState } from 'react'
import { useLocation } from 'react-router'
import chevronDownIcon from '../../assets/icons/chevron-down.svg'
import { useResults } from '../../results/ResultsContext'
import { Card } from './Card'

/** 오른쪽 "나중에 가능" 접이식 카드 — 사이드바에서 #later로 들어오면 펼침 */
export function LaterCard() {
  const { hash } = useLocation()
  const { later } = useResults()
  // 직접 열고 닫기 전에는 주소의 #later 여부를 따름
  const [toggled, setToggled] = useState<boolean | null>(null)
  const open = toggled ?? hash === '#later'
  const setOpen = (fn: (v: boolean) => boolean) => setToggled(fn(open))

  return (
    <Card id="later" className="px-6 py-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="later-list"
        className="flex w-full items-center gap-2 text-left"
      >
        <span className="text-22 font-bold text-text-strong">나중에 가능</span>
        <span className="text-17 font-bold text-primary">{later.length}건</span>
        <span className="flex-1" />
        <img src={chevronDownIcon} alt="" width={20} height={20} className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        // TODO: Figma에 펼친 모습이 없어 이름만 나열 — 디자인 나오면 맞추기
        <ul id="later-list" className="mt-3 flex flex-col gap-2 border-t border-divider pt-3">
          {later.map((name) => (
            <li key={name} className="text-17 text-text">
              {name}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
