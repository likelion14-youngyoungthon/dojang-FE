import { useNavigate } from 'react-router'
import infoIcon from '../assets/icons/info.svg'
import kakaoSymbolIcon from '../assets/icons/kakao-symbol.svg'
import { AccessibilityButton } from '../components/AccessibilityButton'
import { IntroPanel } from '../components/IntroPanel'

/** 00 카카오 로그인 화면 — 서비스 첫 화면 */
export function LoginPage() {
  const navigate = useNavigate()

  // TODO: 카카오 로그인 SDK/백엔드 OAuth 연동 후 로그인 성공 시 이동하도록 교체
  const handleKakaoLogin = () => navigate('/region')

  return (
    <div className="flex min-h-screen bg-white">
      <IntroPanel />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col items-center justify-between gap-10 px-6 pt-10 pb-12 md:px-24">
        <div className="flex w-full justify-end">
          <AccessibilityButton />
        </div>

        <div className="flex w-full max-w-[440px] flex-col gap-8">
          <div className="flex flex-col gap-2.5">
            <h2 className="text-[32px] leading-[1.35] font-bold">도장 시작하기</h2>
            <p className="text-[16px] leading-[1.65] text-gray-700">
              카카오 계정으로 로그인하고 시작해 주세요.
              <br />
              내 상황과 신청 진행 상태를 다음에 와도 이어서 볼 수 있어요.
            </p>
          </div>

          {/* 카카오 로그인 버튼 (카카오 디자인 가이드 색상 #FEE500 · 검정 85%) */}
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#fee500] hover:brightness-95"
          >
            {/* TODO: 카카오 공식 심볼 에셋으로 교체 (Figma 레이어 메모) */}
            <img src={kakaoSymbolIcon} alt="" width={22} height={22} />
            <span className="text-[17px] leading-[1.5] font-bold text-black/85">카카오로 시작하기</span>
          </button>

          <div className="flex items-start gap-2.5 rounded-lg bg-gray-50 px-4 py-3.5">
            <img src={infoIcon} alt="" width={18} height={18} className="mt-[2px] shrink-0" />
            <p className="break-keep text-[14px] leading-[1.6] text-gray-700">
              카카오 계정 정보는 로그인 확인에만 써요. 장애·소득 등 입력하신 정보는 카카오로 보내지 않아요.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center text-[13px] leading-[1.5] text-gray-500">
          {/* TODO: 이용약관·개인정보 처리방침 페이지가 생기면 링크 연결 */}
          <p>
            시작하면 <span className="font-medium text-gray-700 underline">이용약관</span>과
            <span className="font-medium text-gray-700 underline">개인정보 처리방침</span>에 동의하게 돼요.
          </p>
          <p>용인시에 거주하는 등록장애인 당사자 또는 지원인이 이용할 수 있어요.</p>
        </div>
      </main>
    </div>
  )
}
