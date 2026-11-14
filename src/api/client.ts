// 백엔드 API 공통 클라이언트
// - 주소: .env.local의 VITE_API_URL (없으면 배포 서버)
// - 응답 {code, data, message}에서 data만 돌려주고, code가 OK가 아니면 ApiError를 던짐
// - 요청·응답 키는 서버 그대로 snake_case (Swagger는 camelCase로 적혀 있지만 실제 서버는 snake_case만 받음)
//   자동 변환은 하지 않음: /judge 응답은 서비스 id(pension_basic)가 키라서 변환하면 id가 깨짐

import { readStorage, removeStorage, writeStorage } from '../lib/storage'

const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'https://dojang-api.duckdns.org'}/api/v1`
const TOKEN_KEY = 'token'
/** /basis(AI)는 20~30초 걸릴 때가 있어 넉넉히 잡음 */
const DEFAULT_TIMEOUT_MS = 40_000

/**
 * 서버 에러 코드
 * E400 잘못된 요청 · E401 로그인 필요 · E404 없음 · E405 메서드 · E500 서버 · E502 AI 실패
 * NETWORK 연결 실패·시간 초과 (프론트에서 붙인 코드)
 */
export type ApiErrorCode = 'E400' | 'E401' | 'E404' | 'E405' | 'E500' | 'E502' | 'NETWORK' | (string & {})

export class ApiError extends Error {
  code: ApiErrorCode
  status: number

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

export const getToken = () => readStorage<string>(TOKEN_KEY)
export const setToken = (token: string) => writeStorage(TOKEN_KEY, token)
export const clearToken = () => removeStorage(TOKEN_KEY)

type QueryValue = string | number | boolean | null | undefined | readonly (string | number)[]

interface RequestOptions {
  query?: Record<string, QueryValue>
  body?: unknown
  signal?: AbortSignal
  timeoutMs?: number
}

/** 빈 값은 빼고, 배열은 tags=a&tags=b 처럼 같은 이름으로 여러 번 붙임 */
function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value == null) continue
    for (const v of Array.isArray(value) ? value : [value]) params.append(key, String(v))
  }
  const qs = params.toString()
  return `${BASE_URL}${path}${qs ? `?${qs}` : ''}`
}

async function request<T>(method: string, path: string, { query, body, signal, timeoutMs = DEFAULT_TIMEOUT_MS }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const timeout = AbortSignal.timeout(timeoutMs)
  let res: Response
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    })
  } catch (e) {
    // 화면이 바뀌어 직접 취소한 요청은 그대로 던져서 무시할 수 있게 함
    if (signal?.aborted) throw e
    const message = timeout.aborted ? '응답이 너무 늦어요. 잠시 후 다시 시도해 주세요.' : '서버에 연결하지 못했어요. 인터넷 연결을 확인해 주세요.'
    throw new ApiError('NETWORK', message, 0)
  }

  const json = (await res.json().catch(() => null)) as { code?: string; data?: T; message?: string | null } | null
  if (!json || json.code !== 'OK') {
    const code = json?.code ?? (res.ok ? 'E500' : `E${res.status}`)
    // 토큰이 만료·무효면 지워서 다음 요청이 로그인 없이 가도록 함 (로그인 화면 이동은 부르는 쪽에서)
    if (code === 'E401') clearToken()
    throw new ApiError(code, json?.message ?? '잠시 후 다시 시도해 주세요.', res.status)
  }
  return json.data as T
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', path, { ...options, body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('DELETE', path, options),
}
