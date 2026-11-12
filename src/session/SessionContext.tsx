import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ViewMode } from '../data/viewModes'
import { readStorage, removeStorage, writeStorage } from '../lib/storage'

export interface Account {
  kind: 'kakao' | 'demo'
  /** 사이드바 계정 행 이름 */
  name: string
  /** 체험 계정이면 고른 인물 */
  personaId?: string
}

interface SessionState {
  account: Account | null
  mode: ViewMode
}

interface SessionContextValue extends SessionState {
  setMode: (mode: ViewMode) => void
  signIn: (account: Account, mode?: ViewMode) => void
  signOut: () => void
}

const KEY = 'session'
const INITIAL: SessionState = { account: null, mode: '기본' }

const SessionContext = createContext<SessionContextValue | null>(null)

/** 로그인 계정과 맞춤 화면 (API: POST /auth/kakao · POST /auth/demo) */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(() => readStorage<SessionState>(KEY) ?? INITIAL)

  useEffect(() => {
    if (state.account) writeStorage(KEY, state)
    else removeStorage(KEY)
  }, [state])

  const value: SessionContextValue = {
    ...state,
    setMode: (mode) => setState((prev) => ({ ...prev, mode })),
    signIn: (account, mode = '기본') => setState({ account, mode }),
    // TODO: 로그아웃은 서버 호출 없이 토큰만 지움 (Figma A3 메모)
    signOut: () => setState(INITIAL),
  }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession은 SessionProvider 안에서 써야 해요')
  return ctx
}
