export const DISABILITY_TYPES = [
  '지체장애', '뇌병변장애', '시각장애', '청각장애', '언어장애', '지적장애', '자폐성장애', '정신장애',
  '신장장애', '심장장애', '호흡기장애', '간장애', '안면장애', '장루·요루장애', '뇌전증장애', '잘 모르겠어요',
] as const

export const SEVERITIES = ['심한 장애', '심하지 않은 장애', '잘 모르겠어요'] as const
export type Severity = (typeof SEVERITIES)[number]

/** 판정에 쓰이는 해당 사항 (여러 개 선택) */
export const CIRCUMSTANCES = ['어린이집에 다녀요', '차가 있어요', '휠체어를 써요', '최근에 아이를 낳았어요'] as const

export const BASIC_LIVELIHOOD = ['기초생활수급', '차상위', '해당 없어요', '잘 모르겠어요'] as const
export type BasicLivelihood = (typeof BASIC_LIVELIHOOD)[number]

/**
 * 2026년 기준 중위소득(월) — 가구원 수별
 * 소득 구간은 중위소득 120%·180% (Figma 3명 가구 예시 6,430,843원·9,646,264원과 일치)
 * TODO: 서버에서 받은 기준 금액으로 교체
 */
const MEDIAN_INCOME_2026: Record<number, number> = {
  1: 2_564_238,
  2: 4_199_292,
  3: 5_359_036,
  4: 6_494_738,
  5: 7_556_719,
  6: 8_555_952,
}

export type IncomeBracket = 'under120' | 'under180' | 'over180' | 'unknown'

export function getIncomeBrackets(householdSize: number) {
  const median = MEDIAN_INCOME_2026[Math.min(Math.max(householdSize, 1), 6)]
  const low = Math.floor(median * 1.2)
  const high = Math.floor(median * 1.8)
  const man = (won: number) => `월 ${Math.floor(won / 10_000).toLocaleString()}만 원 이하`
  const won = (n: number) => n.toLocaleString()
  return [
    { value: 'under120', label: man(low), sub: `${won(low)}원 이하` },
    { value: 'under180', label: man(high), sub: `${won(high)}원 이하` },
    { value: 'over180', label: '그보다 많아요', sub: `${won(high)}원 초과` },
    { value: 'unknown', label: '잘 모르겠어요' },
  ] as const satisfies readonly { value: IncomeBracket; label: string; sub?: string }[]
}
