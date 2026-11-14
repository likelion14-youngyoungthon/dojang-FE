import { useNavigate } from 'react-router'
import { loginDemo, logoutToken, withdrawAccount } from '../api/auth'
import type { Persona } from '../data/personas'
import { useResults } from '../results/ResultsContext'
import { useSituation } from '../situation/SituationContext'
import { useSession } from './SessionContext'

/** 로그인·체험 시작·로그아웃·탈퇴 — 계정이 바뀌면 이 브라우저에 남은 상황·신청 기록도 비움 */
export function useAccountActions() {
  const navigate = useNavigate()
  const { signIn, signOut } = useSession()
  const { replace } = useSituation()
  const { clear, runJudge } = useResults()

  return {
    // TODO: POST /auth/kakao 연동 후 로그인 성공했을 때만 이동 · 이름은 카카오 프로필로
    loginKakao: () => {
      signIn({ kind: 'kakao', name: '김멋사' })
      navigate('/situation/place')
    },
    // 시연 경로: 체험 인물 고르기 → POST /auth/demo → POST /judge → 입력 화면을 건너뛰고 바로 남은 신청
    // 체험 로그인·판정이 실패해도 시연은 이어지도록 Figma 예시 값으로 넘어감
    startDemo: async (persona: Persona) => {
      clear()
      replace(persona.situation)
      signIn({ kind: 'demo', name: persona.accountName, personaId: persona.id }, persona.mode)
      await loginDemo().catch((e) => console.warn('체험 로그인 실패, 이 브라우저에만 저장', e))
      await runJudge(persona.situation, { save: false }).catch((e) => console.warn('체험 인물 판정 실패, 예시 값으로 보여 줌', e))
      navigate('/results')
    },
    // 로그아웃 · 체험 끝내기: 서버 호출 없이 토큰만 지움
    logout: () => {
      logoutToken()
      clear()
      replace({})
      signOut()
      navigate('/')
    },
    // 탈퇴: DELETE /me (카카오 계정만). 실패하면 기록을 지우지 않고 오류를 던짐
    withdraw: async () => {
      await withdrawAccount()
      clear()
      replace({})
      signOut()
      navigate('/')
    },
  }
}
