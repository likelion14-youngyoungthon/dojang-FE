import { api, clearToken, getToken, setToken } from './client'

/** POST /auth/kakao · /auth/demo 응답 */
export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  is_new: boolean
  nickname: string | null
  is_demo: boolean
}

// 카카오 로그인 (인가 코드 방식)
// 1. 카카오 인가 페이지로 이동 → 2. 카카오가 /oauth/kakao?code=로 돌려보냄 → 3. POST /auth/kakao로 JWT 받음
// client_id는 카카오 앱의 REST API 키 (.env.local의 VITE_KAKAO_REST_API_KEY). 서버가 쓰는 앱과 같아야 함
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY as string | undefined
/** 카카오 콘솔 Redirect URI에 등록한 주소와 같아야 함 (예: http://localhost:5173/oauth/kakao) */
export const KAKAO_CALLBACK_PATH = '/oauth/kakao'
const kakaoRedirectUri = () => `${window.location.origin}${KAKAO_CALLBACK_PATH}`
const STATE_KEY = 'kakao_state'

/** 카카오 인가 페이지 주소 — 키가 없으면 null. 돌아올 때 확인할 state를 이 탭에 남김 */
export function kakaoAuthorizeUrl() {
  if (!KAKAO_REST_API_KEY) return null
  const state = crypto.randomUUID()
  try {
    sessionStorage.setItem(STATE_KEY, state)
  } catch {
    // 저장이 막혀 있으면 state 확인 없이 진행
  }
  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: kakaoRedirectUri(),
    response_type: 'code',
    state,
  })
  return `https://kauth.kakao.com/oauth/authorize?${params}`
}

/** 돌아온 state가 보낸 것과 같은지 (다른 사이트가 만든 로그인 요청 막기). 한 번 쓰면 지움 */
export function checkKakaoState(state: string | null) {
  let saved: string | null = null
  try {
    saved = sessionStorage.getItem(STATE_KEY)
    sessionStorage.removeItem(STATE_KEY)
  } catch {
    return true
  }
  return saved == null || saved === state
}

/** POST /auth/kakao — 인가 코드로 JWT 받아 저장. 코드는 한 번만 쓸 수 있음 */
export async function loginKakao(code: string) {
  const res = await api.post<LoginResponse>('/auth/kakao', { code, redirect_uri: kakaoRedirectUri() })
  setToken(res.access_token)
  return res
}

/** 체험 인물 고르기 — 카카오 없이 임시 회원 토큰을 받아 저장 */
export async function loginDemo() {
  const res = await api.post<LoginResponse>('/auth/demo')
  setToken(res.access_token)
  return res
}

/** 로그아웃 · 체험 끝내기 — 서버 호출 없이 토큰만 지움 (대응표) */
export const logoutToken = () => clearToken()

/** 탈퇴 — 카카오 계정만 (체험에는 탈퇴 없음). 회원과 저장한 신청 현황을 지움 */
export async function withdrawAccount() {
  if (getToken()) await api.delete<null>('/me')
  clearToken()
}
