import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { checkKakaoState } from '../api/auth'
import { StartLayout } from '../components/StartLayout'
import { useAccountActions } from '../session/useAccountActions'

/** 인가 코드는 한 번만 쓸 수 있어서, 개발 모드(StrictMode)에서 effect가 두 번 돌아도 한 번만 보냄 */
const handled = new Set<string>()

/** 카카오 로그인 콜백 (/oauth/kakao?code=&state=) — POST /auth/kakao 후 다음 화면으로 */
export function KakaoCallbackPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { completeKakaoLogin } = useAccountActions()
  const code = params.get('code')
  const kakaoError = params.get('error')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 카카오 화면에서 '취소'를 누르면 error=access_denied로 돌아옴 → 조용히 첫 화면으로
    if (kakaoError === 'access_denied') {
      navigate('/', { replace: true })
      return
    }
    if (!code) {
      setError(params.get('error_description') ?? '카카오에서 로그인 정보를 받지 못했어요.')
      return
    }
    if (handled.has(code)) return
    handled.add(code)
    if (!checkKakaoState(params.get('state'))) {
      setError('로그인 요청이 올바르지 않아요. 처음부터 다시 시도해 주세요.')
      return
    }
    completeKakaoLogin(code).catch((e: Error) => setError(e.message))
    // 주소의 코드마다 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, kakaoError])

  const footer = <p className="text-13 text-text-sub">카카오 정보는 로그인 확인에만 써요.</p>

  return (
    <StartLayout footer={footer}>
      {error ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2" role="alert">
            <h1 className="text-32 font-bold text-text-strong">로그인하지 못했어요</h1>
            <p className="text-17 text-text">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-kakao px-6 text-17 font-medium text-kakao-text hover:brightness-95"
          >
            처음으로 돌아가기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2" role="status">
          <h1 className="text-32 font-bold text-text-strong">로그인하는 중</h1>
          <p className="text-17 text-text">카카오 계정을 확인하고 있어요. 잠시만 기다려 주세요.</p>
        </div>
      )}
    </StartLayout>
  )
}
