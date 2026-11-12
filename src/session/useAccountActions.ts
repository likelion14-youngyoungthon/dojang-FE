import { useNavigate } from 'react-router'
import type { Persona } from '../data/personas'
import { useResults } from '../results/ResultsContext'
import { useSituation } from '../situation/SituationContext'
import { useSession } from './SessionContext'

/** 로그인·체험 시작·로그아웃·탈퇴 — 계정이 바뀌면 이 브라우저에 남은 상황·신청 기록도 비움 */
export function useAccountActions() {
  const navigate = useNavigate()
  const { signIn, signOut } = useSession()
  const { replace } = useSituation()
  const { clear } = useResults()

  return {
    // TODO: POST /auth/kakao 연동 후 로그인 성공했을 때만 이동 · 이름은 카카오 프로필로
    loginKakao: () => {
      signIn({ kind: 'kakao', name: '김멋사' })
      navigate('/situation/place')
    },
    // 시연 경로: 체험 인물 고르기 → 입력 화면을 건너뛰고 바로 남은 신청 (TODO: POST /auth/demo · POST /judge)
    startDemo: (persona: Persona) => {
      clear()
      replace(persona.situation)
      signIn({ kind: 'demo', name: persona.accountName, personaId: persona.id }, persona.mode)
      navigate('/results')
    },
    logout: () => {
      clear()
      replace({})
      signOut()
      navigate('/')
    },
    // TODO: DELETE /me 연동
    withdraw: () => {
      clear()
      replace({})
      signOut()
      navigate('/')
    },
  }
}
