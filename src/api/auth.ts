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
