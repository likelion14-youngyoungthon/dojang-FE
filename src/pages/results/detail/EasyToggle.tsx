/** 쉬운 말 ↔ 원문 전환 (Figma M3: 선택 칸 두 개) */
export function EasyToggle({ plain, onChange }: { plain: boolean; onChange: (plain: boolean) => void }) {
  const item = (selected: boolean) =>
    `flex h-10 items-center justify-center rounded-[10px] px-3.5 text-17 ${
      selected ? 'border-[1.5px] border-primary bg-primary-100 font-bold text-primary' : 'bg-neutral-100 font-medium text-text-strong hover:bg-divider'
    }`
  return (
    <div role="radiogroup" aria-label="설명 방식" className="flex gap-1.5">
      <button type="button" role="radio" aria-checked={!plain} onClick={() => onChange(false)} className={item(!plain)}>
        쉬운 말
      </button>
      <button type="button" role="radio" aria-checked={plain} onClick={() => onChange(true)} className={item(plain)}>
        원문
      </button>
    </div>
  )
}
