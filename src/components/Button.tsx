import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary'
  /** lg: 56px / 17px (페이지 하단), md: 52px / 16px (모달) */
  size?: 'md' | 'lg'
}

const variantClass = {
  primary: 'bg-primary font-bold text-white hover:bg-primary/90',
  secondary: 'border border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-50',
}

const sizeClass = {
  md: 'h-13 text-[16px]',
  lg: 'h-14 text-[17px]',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      // twMerge: className으로 넘긴 높이·글자 크기가 기본 size 값을 덮어쓰도록
      className={twMerge(
        'flex items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  )
}
