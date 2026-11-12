import type { Benefit, Office } from '../data/results'

/** 받침 있으면 을, 없으면 를 */
function objectParticle(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  return code >= 0 && code <= 11171 && code % 28 !== 0 ? '을' : '를'
}

/** 문자로 보낼 말 — 접수처에 문자로 서류를 묻는 기본 문장 */
export function textMessageLines(benefit: Benefit) {
  return [`${benefit.name}${objectParticle(benefit.name)} 신청하려고 합니다.`, '준비할 서류를 문자로 알려 주세요.']
}

/** 처인구 백암면 백암로 189 — 주소 앞의 "경기도 용인시"를 뺀 짧은 주소 */
export function shortAddress(office: Office) {
  return office.addressLines.join(' ').replace(/^경기도 용인시 /, '')
}
