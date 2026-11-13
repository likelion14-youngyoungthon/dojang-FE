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
