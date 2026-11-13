/** 구 이름 — 목록은 GET /dongs에서 받음 (api/dongs.ts) */
export type Gu = string

// TODO: GET /offices 연동 후 서버 값으로 교체 (지금은 Figma 예시 한 곳만)
const OFFICE_ADDRESS: Record<string, string> = {
  백암면: '처인구 백암면 백암로 189',
}

export function getOffice(gu: Gu, dong: string) {
  return { name: `${dong} 행정복지센터`, address: OFFICE_ADDRESS[dong] ?? `용인시 ${gu} ${dong}` }
}
