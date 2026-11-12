import { useEffect, useRef, useState } from 'react'
import logOutIcon from '../assets/icons/log-out.svg'
import moreIcon from '../assets/icons/more.svg'
import trashIcon from '../assets/icons/trash.svg'
import userIcon from '../assets/icons/user.svg'
import { useSession } from '../session/SessionContext'
import { useAccountActions } from '../session/useAccountActions'
import { Modal } from './Modal'

/** A4 탈퇴 확인 (DELETE /me) */
function WithdrawModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal titleId="withdraw-title" onClose={onCancel} zoom={0.9} className="flex max-w-[440px] flex-col gap-6 p-7">
      <div className="flex flex-col gap-2">
        <h2 id="withdraw-title" className="text-24 font-bold text-text-strong">
          탈퇴할까요?
        </h2>
        <p className="text-17 text-text">저장한 신청 기록이 모두 지워지고 되돌릴 수 없어요.</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-12 flex-1 items-center justify-center rounded-xl border border-border bg-surface px-5 text-15 font-medium text-text-strong hover:bg-bg-sidebar"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-danger px-5 text-15 font-bold text-white hover:bg-danger/90"
        >
          탈퇴
        </button>
      </div>
    </Modal>
  )
}

/**
 * 사이드바 맨 아래 계정 행 + A3 계정 메뉴
 * 행 전체(아바타 + 이름)를 눌러도 ··· 와 같은 메뉴가 열림 (Figma: 계정 행). 체험 계정에는 탈퇴 없음
 */
export function AccountMenu() {
  const { account } = useSession()
  const { logout, withdraw } = useAccountActions()
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // TODO: 로그인 없이 결과 화면을 열면 Figma 예시 이름을 보여 줌
  const name = account?.name ?? '김멋사'
  const canWithdraw = account?.kind !== 'demo'
  const itemClass = 'flex h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-15 font-medium hover:bg-bg-sidebar'

  return (
    <div ref={rootRef} className="relative">
      {open && (
        <div
          role="menu"
          aria-label="계정 메뉴"
          className="absolute right-[-39px] bottom-[61px] z-30 flex w-52 flex-col gap-0.5 rounded-[14px] border border-divider bg-surface p-2 shadow-float"
        >
          <button type="button" role="menuitem" onClick={logout} className={`${itemClass} text-text-strong`}>
            <img src={logOutIcon} alt="" width={20} height={20} />
            로그아웃
          </button>
          {canWithdraw && (
            <>
              <div className="px-3 py-1" role="separator">
                <div className="h-px bg-divider" />
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  setConfirming(true)
                }}
                className={`${itemClass} text-danger`}
              >
                <img src={trashIcon} alt="" width={20} height={20} />
                탈퇴
              </button>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[72px] w-full items-center gap-2.5 bg-surface pr-4 pl-5 text-left"
      >
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-primary-100">
          <img src={userIcon} alt="" width={20} height={20} />
        </span>
        <span className="truncate text-15 font-bold text-text-strong">{name}</span>
        <span className="flex-1" />
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-[10px] ${open ? 'bg-primary-100' : ''}`} aria-hidden>
          <img src={moreIcon} alt="" width={20} height={20} />
        </span>
      </button>

      {confirming && (
        <WithdrawModal
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false)
            withdraw()
          }}
        />
      )}
    </div>
  )
}
