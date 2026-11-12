import type { ReactNode } from 'react'
import { Link } from 'react-router'
import contactMessageIcon from '../assets/icons/contact-message.svg'
import contactOnlineIcon from '../assets/icons/contact-online.svg'
import contactVisitIcon from '../assets/icons/contact-visit.svg'
import externalLinkWhiteIcon from '../assets/icons/external-link-white.svg'
import phoneDarkIcon from '../assets/icons/phone-dark-20.svg'
import phoneWhite28Icon from '../assets/icons/phone-white-28.svg'
import pinDark28Icon from '../assets/icons/pin-dark-28.svg'
import pinDarkIcon from '../assets/icons/pin-dark.svg'
import pinWhiteIcon from '../assets/icons/pin-white.svg'
import { ContactRow, EasyRow, LargeBlockView } from '../components/results/ModeParts'
import { getBenefit, getOffice } from '../data/results'
import { shortAddress, textMessageLines } from '../results/modeText'

// 시연·발표에서 보여 주는 신청 (Figma C1 예시)
const BENEFIT_ID = 'activity-support'

function Column({ mode, audience, children }: { mode: string; audience: string; children: ReactNode }) {
  return (
    <section aria-label={`${mode} 화면`} className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-19 font-bold text-text-strong">{mode}</h2>
        <span className="flex h-[26px] items-center rounded-lg bg-primary-100 px-2 text-13 font-bold text-primary">{audience}</span>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-surface shadow-card">{children}</div>
    </section>
  )
}

/** C1 같은 신청, 세 화면 — 큰 글씨 · 문자·온라인 · 쉬운 말을 나란히 (시연·발표 장면) */
export function ComparePage() {
  const benefit = getBenefit(BENEFIT_ID)
  const office = getOffice(benefit?.officeId ?? null)
  if (!benefit || !office || !benefit.large || !benefit.easy) return null

  const onlineUrl = benefit.detail?.onlineUrl
  const message = textMessageLines(benefit)
  const locationsTo = `/results/locations?office=${office.id}`
  const fullButton = 'flex w-full items-center justify-center gap-2 rounded-xl'

  return (
    <main className="flex min-h-screen flex-col bg-bg-page pt-3">
      <h1 className="px-10 text-36 font-bold text-text-strong">같은 신청, 세 화면</h1>

      <div className="flex flex-1 flex-col gap-6 px-10 pt-6 pb-8 xl:flex-row">
        <Column mode="큰 글씨" audience="65세 이상">
          <div className="flex flex-1 flex-col gap-[22px] p-7">
            <p className="text-32 font-bold text-text-strong">{benefit.name}</p>
            <LargeBlockView {...benefit.large.gets} />
            <LargeBlockView label="신청하는 곳" title={office.name} sub={shortAddress(office)} />
            {benefit.large.result && <LargeBlockView {...benefit.large.result} />}
            <span className="flex-1" />
            <div className="flex flex-col gap-2.5">
              <a href={`tel:${office.phone}`} className={`${fullButton} h-[72px] rounded-2xl bg-primary text-24 font-bold text-white hover:bg-primary/90`}>
                <img src={phoneWhite28Icon} alt="" width={28} height={28} />
                전화하기
              </a>
              <Link
                to={locationsTo}
                className={`${fullButton} h-[72px] rounded-2xl border border-border bg-surface text-24 font-bold text-text-strong hover:bg-bg-sidebar`}
              >
                <img src={pinDark28Icon} alt="" width={28} height={28} />
                가는 길 보기
              </Link>
            </div>
          </div>
        </Column>

        <Column mode="문자·온라인" audience="청각장애">
          <p className="px-6 pt-6 pb-2 text-24 font-bold text-text-strong">{benefit.name}</p>
          {onlineUrl && (
            <div className="flex flex-col gap-0 border-b border-divider pb-4">
              <div className="px-6 py-4">
                <ContactRow compact icon={contactOnlineIcon} title="온라인 신청" description="복지로에서 신청서를 내요" />
              </div>
              <div className="px-6">
                <a href={onlineUrl} target="_blank" rel="noreferrer" className={`${fullButton} h-12 bg-primary text-15 font-bold text-white hover:bg-primary/90`}>
                  <img src={externalLinkWhiteIcon} alt="" width={20} height={20} />
                  복지로 열기
                </a>
              </div>
            </div>
          )}
          <div className="flex flex-col border-b border-divider pb-4">
            <div className="px-6 py-4">
              <ContactRow compact icon={contactMessageIcon} title="107 손말이음센터" description="문자나 수어로 말하면 대신 전화해 줘요" />
            </div>
            <div className="px-6">
              <a
                href={`sms:107?body=${encodeURIComponent(message.join('\n'))}`}
                className={`${fullButton} h-12 border border-border bg-surface text-15 font-medium text-text-strong hover:bg-bg-sidebar`}
              >
                107에 문자 보내기
              </a>
            </div>
          </div>
          <div className="flex flex-col border-b border-divider pb-4">
            <div className="px-6 py-4">
              <ContactRow compact icon={contactVisitIcon} title="직접 방문" description={office.name} />
            </div>
            <div className="px-6">
              <Link to={locationsTo} className={`${fullButton} h-12 border border-border bg-surface text-15 font-medium text-text-strong hover:bg-bg-sidebar`}>
                <img src={pinDarkIcon} alt="" width={20} height={20} />
                위치 보기
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 px-6 py-4">
            <p className="text-13 font-medium text-text-sub">문자로 보낼 말</p>
            <p className="rounded-xl bg-bg-page px-3.5 py-3 text-15 text-text-strong">
              {message.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
          <span className="flex-1" />
          <p className="border-t border-divider px-6 pt-3 pb-3.5 text-13 text-text-sub">전화 {office.phone}</p>
        </Column>

        <Column mode="쉬운 말" audience="발달장애 본인">
          <div className="flex flex-1 flex-col gap-5 p-7">
            <p className="text-24 font-bold text-text-strong">{benefit.name}</p>
            <ul className="flex flex-col gap-4">
              {benefit.easy.groups.flatMap((g) => g.items).map((item) => (
                <EasyRow key={item.text} {...item} size="md" />
              ))}
            </ul>
            <span className="flex-1" />
            <div className="flex flex-col gap-2">
              <Link to={locationsTo} className={`${fullButton} h-14 bg-primary text-17 font-bold text-white hover:bg-primary/90`}>
                <img src={pinWhiteIcon} alt="" width={20} height={20} />
                가는 길 보기
              </Link>
              <a
                href={`tel:${office.phone}`}
                className={`${fullButton} h-14 border border-border bg-surface text-17 font-medium text-text-strong hover:bg-bg-sidebar`}
              >
                <img src={phoneDarkIcon} alt="" width={20} height={20} />
                전화하기
              </a>
            </div>
          </div>
        </Column>
      </div>
    </main>
  )
}
