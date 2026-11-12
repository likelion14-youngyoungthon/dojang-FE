import { useNavigate } from 'react-router'
import chevronRightIcon from '../assets/icons/chevron-right-18.svg'
import kakaoIcon from '../assets/icons/kakao.svg'
import peopleIcon from '../assets/icons/people.svg'
import { PERSONAS } from '../data/personas'
import { StartLayout } from '../components/StartLayout'
import { useAccountActions } from '../session/useAccountActions'

/** A1 로그인 (API: POST /auth/kakao · POST /auth/demo) */
export function LoginPage() {
  const navigate = useNavigate()
  const { loginKakao } = useAccountActions()

  const footer = (
    <p className="text-13 text-text-sub">
      {/* TODO: 이용약관·개인정보 처리방침 페이지가 생기면 링크 연결 */}
      시작하면 <span className="text-text underline">이용약관</span>과{' '}
      <span className="text-text underline">개인정보 처리방침</span>에 동의하게 돼요. 카카오 정보는 로그인 확인에만
      써요.
    </p>
  )

  return (
    <StartLayout footer={footer} showModeCaption>
      <div className="flex flex-col gap-2">
        <h1 className="text-32 font-bold text-text-strong">시작하기</h1>
        <p className="text-17 text-text">카카오로 시작하면 신청 기록이 저장돼요.</p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={loginKakao}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-kakao px-6 text-17 font-medium text-kakao-text hover:brightness-95"
        >
          <img src={kakaoIcon} alt="" width={20} height={20} />
          카카오로 시작하기
        </button>

        <button
          type="button"
          onClick={() => navigate('/demo')}
          className="flex h-14 w-full items-center gap-2.5 rounded-xl border border-border bg-surface pr-4 pl-5 hover:bg-bg-sidebar"
        >
          <img src={peopleIcon} alt="" width={20} height={20} />
          <span className="text-17 font-medium text-text-strong">체험하기</span>
          <span className="flex-1" />
          <span className="text-15 text-text-sub">예시 인물 {PERSONAS.length}명</span>
          <img src={chevronRightIcon} alt="" width={18} height={18} />
        </button>
      </div>
    </StartLayout>
  )
}
