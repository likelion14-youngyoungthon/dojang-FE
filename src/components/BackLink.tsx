import backIcon from '../assets/icons/back.svg'

/** 뒤로 링크 (Figma: 뒤로 링크) */
export function BackLink({ onClick, label = '뒤로' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="flex h-8 items-center gap-0.5 text-15 font-medium text-text-sub hover:text-text">
      <img src={backIcon} alt="" width={18} height={18} />
      {label}
    </button>
  )
}
