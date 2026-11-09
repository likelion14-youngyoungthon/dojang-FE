import { DONG_BY_GU, GU_LIST } from './regions'

export const BIRTH_DECADES = ['1940년대', '1950년대', '1960년대', '1970년대', '1980년대', '1990년대', '2000년대', '2010년대', '2020년대']

/** 장애인복지법상 15개 장애 유형 */
export const DISABILITY_TYPES = [
  '지체장애',
  '뇌병변장애',
  '시각장애',
  '청각장애',
  '언어장애',
  '지적장애',
  '자폐성장애',
  '정신장애',
  '신장장애',
  '심장장애',
  '호흡기장애',
  '간장애',
  '안면장애',
  '장루·요루장애',
  '뇌전증장애',
]

export const DISABILITY_LEVELS = ['심한 장애', '심하지 않은 장애']

export const BENEFIT_STATUSES = [
  '수급하지 않음',
  '생계급여 수급',
  '의료급여 수급',
  '주거급여 수급',
  '교육급여 수급',
  '차상위계층',
  '잘 모르겠음',
]

/** "기흥구 보정동" 형태의 전체 읍면동 목록 */
export const ALL_DONGS = GU_LIST.flatMap((gu) => DONG_BY_GU[gu].map((dong) => `${gu} ${dong}`))
