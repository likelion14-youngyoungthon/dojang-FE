// TODO: GET /dongs 연동 후 서버 값으로 교체
export const GU_LIST = ['처인구', '기흥구', '수지구'] as const
export type Gu = (typeof GU_LIST)[number]

export const DONGS_BY_GU: Record<Gu, string[]> = {
  처인구: ['포곡읍', '모현읍', '이동읍', '남사읍', '원삼면', '백암면', '양지읍', '중앙동', '역북동', '삼가동', '유림1동', '유림2동', '동부동'],
  기흥구: ['신갈동', '영덕1동', '영덕2동', '구갈동', '상갈동', '보라동', '기흥동', '서농동', '구성동', '마북동', '동백1동', '동백2동', '동백3동', '상하동', '보정동'],
  수지구: ['풍덕천1동', '풍덕천2동', '신봉동', '죽전1동', '죽전2동', '죽전3동', '동천동', '상현1동', '상현2동', '상현3동', '성복동'],
}

// TODO: GET /offices 연동 후 서버 값으로 교체 (지금은 Figma 예시 한 곳만)
const OFFICE_ADDRESS: Record<string, string> = {
  백암면: '처인구 백암면 백암로 189',
}

export function getOffice(gu: Gu, dong: string) {
  return { name: `${dong} 행정복지센터`, address: OFFICE_ADDRESS[dong] ?? `용인시 ${gu} ${dong}` }
}
